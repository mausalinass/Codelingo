import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const base = process.env.API_BASE_URL || 'http://localhost:5080';
const userId = '11111111-1111-1111-1111-111111111111';
const headers = {'Content-Type':'application/json', ...(process.env.DEMO_API_KEY ? {'X-Demo-Key':process.env.DEMO_API_KEY} : {})};
const request = async (path, body) => {
 const r = await fetch(base + path, {method:body ? 'POST':'GET',headers,body:body ? JSON.stringify(body) : undefined});
 assert.equal(r.status,200,path+': '+(r.ok?'':await r.text()));return r.json();
};
const lessons = JSON.parse(await readFile(new URL('../Codelingo.Api/Curriculum/lessons.json',import.meta.url),'utf8'));
await request('/api/demo/users/'+userId+'/reset',{});
const initial = await request('/api/users/'+userId+'/dashboard');
assert.equal(initial.courses.length,8);assert.ok(initial.courses.every(c=>c.lessons.length===10));
for (const lesson of lessons) {
 const dto=await request('/api/lessons/'+lesson.language+'/'+lesson.id+'?userId='+userId);
 assert.equal(dto.exercise.id,lesson.exercise.id);assert.equal(dto.exercise.sampleSolution,undefined);assert.equal(dto.exercise.requiredPatterns,undefined);
 const payload={userId,language:lesson.language,lessonId:lesson.id,exerciseId:dto.exercise.id,answer:'wrong answer'};
 const wrong=await request('/api/evaluate',payload);assert.equal(wrong.correct,false);assert.equal(wrong.xpAwarded,0);
 payload.answer=lesson.exercise.sampleSolution;
 const correct=await request('/api/evaluate',payload);assert.equal(correct.correct,true,lesson.language+'/'+lesson.id);
 const seeded=lesson.id==='hello'&&['python','csharp'].includes(lesson.language);
 assert.equal(correct.xpAwarded,seeded?0:10);
 const replay=await request('/api/evaluate',payload);assert.equal(replay.xpAwarded,0);
}
const final=await request('/api/users/'+userId+'/dashboard');
assert.equal(final.user.totalXp,900);assert.equal(final.streak.current,5);
assert.ok(final.courses.every(c=>c.totalLessons===10&&c.completedLessons===10&&c.percentage===100&&c.lessons.every(l=>l.status==='completed')));
console.log('PASS 80 live lessons: wrong, correct, replay, persisted 100% for eight courses, XP=900, streak=5');
await request('/api/demo/users/'+userId+'/reset',{});
console.log('Reset to XP 120; C# 1/10; streak 4.');
