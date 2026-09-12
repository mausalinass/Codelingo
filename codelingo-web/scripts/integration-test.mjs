import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
const api = process.env.API_BASE_URL || 'http://localhost:5080';
const user = '11111111-1111-1111-1111-111111111111';
const request = async (path, body) => {
 const r = await fetch(api + path, {method:body ? 'POST':'GET', headers:{'Content-Type':'application/json'},body:body ? JSON.stringify(body):undefined});
 assert.equal(r.status,200,path); return r.json();
};
const reset=()=>request('/api/demo/users/'+user+'/reset',{});
await reset();
const browser = await chromium.launch(process.env.CHROME_PATH ? {headless:true,executablePath:process.env.CHROME_PATH} : {headless:true});
const page = await browser.newPage();
const errors=[];page.on('pageerror',error=>errors.push(error.message));
async function submitCorrectProblems(solution, firstProblem = 1) {
 for (let problem = firstProblem; problem <= 10; problem++) {
 await page.locator('.cm-content').fill(solution);
  await page.waitForTimeout(80);
  const [, response] = await Promise.all([
   page.getByRole('button',{name:'Check',exact:true}).click(),
   page.waitForResponse(r => r.url().endsWith('/api/evaluate') && r.request().method() === 'POST'),
  ]);
  const evaluation = await response.json();
  assert.equal(evaluation.correct, true, `problem ${problem} should evaluate as correct`);
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  if (problem < 10) await page.getByText(`Problem ${problem + 1} / 10`,{exact:true}).waitFor();
 }
 await page.waitForURL('**/complete');
}
try {
 await page.goto(frontend+'/learn');
 await page.getByText('1 / 10 lessons',{exact:false}).waitFor();
 await page.getByTitle('120 total XP').waitFor();
 await page.getByRole('button',{name:'Demo Profile',exact:true}).click();
 await page.getByRole('dialog').waitFor();
 assert.equal(await page.locator('input[type="password"]').count(),0);
 await page.getByRole('button',{name:'Close demo profile'}).click();
 await page.goto(frontend+'/lesson/csharp/conditions');
 await page.getByRole('button',{name:/Practical Mode/}).click();
 await page.getByText('Before you begin',{exact:true}).waitFor();
 await page.getByRole('button',{name:'START LESSON',exact:true}).click();
 await page.locator('.cm-content').waitFor();
 assert.equal(await page.locator('.cm-content').count(),1);
 for (let attempt = 1; attempt <= 3; attempt++) {
  await page.locator('.cm-content').fill('if (age > 18) {}');
  await page.getByRole('button',{name:'Check',exact:true}).click();
  if (attempt < 3) await page.getByRole('button',{name:/Try Again/}).click();
 }
 await page.getByText('Correct answer',{exact:true}).first().waitFor();
 await page.getByRole('button',{name:'Next Problem',exact:true}).click();
 await page.getByText('Problem 2 / 10',{exact:true}).waitFor();
 const solution='if (age >= 18) { Console.WriteLine("Adult"); }';
 await submitCorrectProblems(solution,2);
 await page.getByText('+10 XP',{exact:true}).waitFor();await page.getByText('1 DAY',{exact:true}).waitFor();
 await page.goto(frontend+'/lesson/csharp/conditions');
 await page.getByRole('button',{name:'START LESSON',exact:true}).click();
 await submitCorrectProblems(solution);await page.getByText('+0 XP',{exact:true}).waitFor();await page.getByText('1 DAY',{exact:true}).waitFor();
 await page.goto(frontend+'/learn');await page.reload();
 await page.getByText('2 / 10 lessons',{exact:false}).waitFor();await page.getByTitle('130 total XP').waitFor();
 // Out-of-order completion must not mark Variables completed.
 assert.equal(await page.locator('a[href="/lesson/csharp/variables"]').count(),1);
 assert.equal(await page.locator('a[href="/lesson/csharp/conditions"]').count(),1);
 await page.goto(frontend+'/lesson/csharp/variables');
 await page.getByRole('button',{name:/Visual Mode/}).click();
 await page.getByText('Before you begin',{exact:true}).waitFor();
 await page.getByRole('button',{name:'START LESSON',exact:true}).click();
 await page.locator('.cm-content').waitFor();
 await page.locator('.cm-content').fill('int score = 100;');
 // Force HTTP failure: UI must not fabricate a successful evaluation.
 await page.route('**/api/evaluate',route=>route.fulfill({status:503,contentType:'application/json',body:'{"message":"Unavailable"}'}));
 await page.getByRole('button',{name:'Check',exact:true}).click();
 await page.getByText('Could not check your answer',{exact:true}).waitFor();
 assert.equal((await request('/api/users/'+user+'/dashboard')).user.totalXp,130);
 await page.unroute('**/api/evaluate');await page.getByRole('button',{name:'Retry Check',exact:true}).click();
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await page.getByText('Problem 2 / 10',{exact:true}).waitFor();
 await submitCorrectProblems('int score = 100;',2);await page.getByText('+10 XP',{exact:true}).waitFor();await page.getByText('1 DAY',{exact:true}).waitFor();
 await page.setViewportSize({width:390,height:844});await page.goto(frontend+'/learn');await page.getByText('3 / 10 lessons',{exact:false}).waitFor();
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),'Mobile page must not overflow horizontally');
 // New browser context avoids cached data when testing dashboard failure.
 const offline=await browser.newPage();await offline.route(api + '/api/**',route=>route.abort());await offline.goto(frontend+'/learn');
 await offline.getByRole('alert').waitFor({timeout:30000});assert.equal(await offline.locator('a[href^="/lesson/"]').count(),0);await offline.close();
 assert.deepEqual(errors,[]);
 console.log('PASS React integration: lesson intro, ten problems, retries, replay protection, XP/streak, server errors and mobile layout');
} finally {await browser.close(); await reset();}
