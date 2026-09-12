import assert from 'node:assert/strict';
const base = process.env.API_BASE_URL || 'http://localhost:5080';
const id = '11111111-1111-1111-1111-111111111111';
const user = '/api/users/' + id;
const demo = '/api/demo/users/' + id;
const headers = { 'Content-Type': 'application/json', ...(process.env.DEMO_API_KEY ? { 'X-Demo-Key': process.env.DEMO_API_KEY } : {}) };
async function request(path, body, status = 200) {
  const response = await fetch(base + path, { method: body === undefined ? 'GET' : 'POST', headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await response.text(); assert.equal(response.status, status, path + ': ' + text);
  return text ? JSON.parse(text) : null;
}
const answer = { userId: id, language: 'csharp', lessonId: 'conditions', exerciseId: 'cs-if-01', answer: 'if (age >= 18) { Console.WriteLine("Adult"); }' };
const dashboard = () => request(user + '/dashboard');
function state(d, xp, streak, count, percentage) {
  assert.equal(d.user.totalXp, xp); assert.equal(d.streak.current, streak); assert.equal(d.streak.longest, 7);
  const c = d.courses.find(x => x.language === 'csharp'); assert.equal(c.completedLessons, count); assert.equal(c.percentage, percentage);
}
for (let run = 1; run <= 3; run++) {
  await request(demo + '/reset', {});
  state(await dashboard(), 120, 4, 1, 33.33);
  const p = await request(user + '/personality'); assert.equal(p.primaryTrait, 'ANALYTICAL'); assert.equal(p.learningMode, 'DEEP_EXPLANATION');
  const lessonUrl = '/api/lessons/csharp/conditions?userId=' + id;
  const analytical = await request(lessonUrl); assert.equal(analytical.showExplanationFirst, true); assert.ok(analytical.explanation);
  const switched = await request(demo + '/personality', {primaryTrait:'PRACTICAL'}); assert.equal(switched.learningMode, 'PRACTICE_FIRST'); assert.equal(switched.scores.practical, 0.91);
  const practical = await request(lessonUrl); assert.equal(practical.presentationMode, 'PRACTICE_FIRST'); assert.equal(practical.explanation, null); assert.equal(practical.showExplanationFirst, false); assert.equal(practical.exercise.id, analytical.exercise.id);
  const wrong = await request('/api/evaluate', {...answer, answer:'if (age > 18) {}'}); assert.equal(wrong.correct, false); assert.equal(wrong.xpAwarded, 0);
  state(await dashboard(), 120, 4, 1, 33.33);
  const correct = await request('/api/evaluate', answer); assert.equal(correct.correct, true); assert.equal(correct.xpAwarded, 10); assert.equal(correct.progress.languagePercentage, 66.67); assert.deepEqual(correct.streak, { previous: 4, current: 5, increased: true });
  const replay = await request('/api/evaluate', answer); assert.equal(replay.xpAwarded, 0); assert.equal(replay.streak.increased, false);
  state(await dashboard(), 130, 5, 2, 66.67);
  console.log('PASS judge rehearsal ' + run + ': XP 120 -> 130; C# 1/3 -> 2/3; streak 4 -> 5; replay +0');
}
await request(demo + '/reset', {});
const concurrent = await Promise.all(Array.from({length: 12}, () => request('/api/evaluate', answer)));
assert.equal(concurrent.reduce((n, x) => n + x.xpAwarded, 0), 10); state(await dashboard(), 130, 5, 2, 66.67);
console.log('PASS 12 concurrent submissions award exactly 10 XP total');
const loop = await request('/api/evaluate', {...answer, lessonId:'loops', exerciseId:'cs-loop-01', answer:'for (int i = 0; i < 3; i++) { Console.WriteLine(i); }'});
assert.equal(loop.xpAwarded, 10); assert.equal(loop.streak.current, 5); assert.equal(loop.streak.increased, false); assert.equal(loop.progress.languagePercentage, 100);
await request('/api/evaluate', {...answer, answer:''});
await request('/api/evaluate', {...answer, answer:'x'.repeat(5001)}, 400);
await request('/api/evaluate', {...answer, answer:null}, 400);
await request('/api/evaluate', {...answer, userId:'bad'}, 400);
await request('/api/evaluate', {...answer, userId:'22222222-2222-2222-2222-222222222222'}, 404);
await request('/api/evaluate', {...answer, language:'ruby'}, 404);
await request('/api/evaluate', {...answer, lessonId:'unknown'}, 404);
await request('/api/evaluate', {...answer, exerciseId:'unknown'}, 404);
await request(demo + '/personality', {primaryTrait:'INVALID'}, 400);
await request(demo + '/personality', {primaryTrait:'VISUAL'});
for (const language of ['python','javascript','csharp']) for (const lesson of ['hello','conditions','loops']) {
  const data = await request('/api/lessons/' + language + '/' + lesson + '?userId=' + id);
  assert.equal(data.presentationMode, 'VISUAL_GUIDED'); assert.ok(data.visualSteps.length); assert.equal(data.exercise.requiredPatterns, undefined);
}
const cors = await fetch(base + '/api/evaluate', {method:'OPTIONS', headers:{Origin:'http://localhost:5173','Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type'}});
assert.equal(cors.headers.get('access-control-allow-origin'), 'http://localhost:5173');
const blockedCors = await fetch(base + '/health', {headers:{Origin:'https://untrusted.invalid'}}); assert.equal(blockedCors.headers.get('access-control-allow-origin'), null);
assert.equal((await fetch(base + '/swagger/index.html')).status, 200);
assert.equal((await fetch(base + '/openapi/v1.json')).status, 200);
await request('/health/ready');
await request(demo + '/reset', {}); state(await dashboard(), 120, 4, 1, 33.33);
console.log('PASS validation, visual lessons, same-day streak, CORS, OpenAPI, readiness; reset to judging state');
