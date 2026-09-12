import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const api=process.env.API_BASE_URL || 'http://localhost:5080';
const site=process.env.FRONTEND_URL || 'http://localhost:5173';
const snapshot=async()=> (await fetch(api+'/api/users/11111111-1111-1111-1111-111111111111/dashboard')).json();
const before=await snapshot();
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
await page.goto(site+'/learn');
const milestones=page.getByRole('button',{name:/Earned Milestones/});
await milestones.click();assert.equal(await milestones.getAttribute('aria-expanded'),'true');
assert.equal(await page.getByLabel('Scrollable earned milestones').evaluate(e=>getComputedStyle(e).overflowY),'auto');
await milestones.click();assert.equal(await milestones.getAttribute('aria-expanded'),'false');
const tracks=page.getByRole('button',{name:/Programming Languages & Tracks/});
await tracks.click();assert.equal(await tracks.getAttribute('aria-expanded'),'true');
assert.equal(await page.getByLabel('Scrollable programming languages and tracks').evaluate(e=>getComputedStyle(e).overflowY),'auto');
await tracks.click();assert.equal(await tracks.getAttribute('aria-expanded'),'false');
await page.getByRole('button',{name:'Switch to dark mode'}).first().click();
await page.reload();assert.ok(await page.locator('html').evaluate(e=>e.classList.contains('dark')));
await page.getByRole('button',{name:/^Math: choose a learning track/}).click();
await page.getByText('Preview track:',{exact:false}).waitFor();
await page.locator('a[href="/lesson/math_basics/math_addition"]').click();
await page.getByRole('button',{name:'START LESSON',exact:true}).click();
await page.getByText('Calculate the sum: 47 + 38 = ?',{exact:false}).waitFor();
await page.getByRole('button',{name:'75',exact:true}).click();
await page.getByRole('button',{name:'Check',exact:true}).click();
await page.getByRole('button',{name:/Try Again/}).click();
await page.getByRole('button',{name:'85',exact:true}).click();
await page.getByRole('button',{name:'Check',exact:true}).click();
await page.getByRole('button',{name:'Continue',exact:true}).click();
for(let problem=2;problem<=10;problem++){
 await page.getByText(`Problem ${problem} / 10`,{exact:true}).waitFor();
 await page.getByRole('button',{name:'85',exact:true}).click();
 await page.getByRole('button',{name:'Check',exact:true}).click();
 await page.getByRole('button',{name:'Continue',exact:true}).click();
}
await page.getByText('+0 XP',{exact:true}).waitFor();
await page.getByText('Preview practice complete.',{exact:false}).waitFor();
assert.deepEqual(await snapshot(),before);
assert.deepEqual(errors,[]);
console.log('PASS bonus merge: dropdowns, sidebar math navigation, persisted dark mode, math evaluation, unchanged server progress');
}finally{await browser.close();}
