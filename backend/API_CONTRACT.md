# Codelingo frontend API contract

Base URL: http://localhost:5080. JSON uses camelCase. Demo user ID: `11111111-1111-1111-1111-111111111111`.

| Method | Path | Purpose |
|---|---|---|
| GET | /api/users/{userId}/dashboard | Persisted XP, streak, courses |
| GET | /api/users/{userId}/personality | Normalized mock Swell profile |
| GET | /api/lessons/{language}/{lessonId}?userId={userId} | Adaptive lesson |
| POST | /api/evaluate | Evaluate a complete answer; save attempt |
| POST | /api/demo/users/{userId}/personality | Demo personality switch |
| POST | /api/demo/users/{userId}/reset | Restore the fixed demo user |
| GET | /health | Process liveness |
| GET | /health/ready | Database connectivity (503 when unavailable) |

Development explorer: /swagger/index.html. Schemas: /openapi/v1.json and /swagger/v1/swagger.json.

## Identifiers and adaptation

Language IDs: `python`, `javascript` (JavaScript/TypeScript route), `csharp`. Lesson IDs in order: `hello`, `conditions`, `loops`.

| Trait | Learning/presentation mode | Presentation |
|---|---|---|
| ANALYTICAL | DEEP_EXPLANATION | Full explanation first |
| PRACTICAL | PRACTICE_FIRST | explanation=null, showExplanationFirst=false |
| VISUAL | VISUAL_GUIDED | Visual steps and shorter explanation |

All modes currently return exercise.type=CODE. Submit the complete code answer, including in practical/visual modes. Fill-blank is a preference in the plan; CODE keeps answer submission unambiguous. Exercise identity and learning objective remain the same across traits. No Regex or raw provider payload is exposed.

Exercise IDs: `py-hello-01`, `py-if-01`, `py-loop-01`; corresponding JavaScript IDs use `js-`, C# IDs use `cs-`. Use the ID returned in the lesson.

## Dashboard

GET /api/users/{userId}/dashboard

```json
{"user":{"id":"11111111-1111-1111-1111-111111111111","displayName":"Mauricio","totalXp":120},"streak":{"current":4,"longest":7},"activeLanguage":"csharp","courses":[{"language":"python","completedLessons":1,"totalLessons":3,"percentage":33.33},{"language":"javascript","completedLessons":0,"totalLessons":3,"percentage":0},{"language":"csharp","completedLessons":1,"totalLessons":3,"percentage":33.33}]}
```

Initial C# path: hello complete, conditions current, loops next. The MVP does not enforce lesson locking server-side; the frontend may present sequential path access. Course percentages are numbers rounded to two decimal places. Seed global XP includes 100 historical/demo XP beyond the two seeded lesson rewards.

## Personality

GET /api/users/{userId}/personality

```json
{"source":"SWELL_MOCK","primaryTrait":"ANALYTICAL","learningMode":"DEEP_EXPLANATION","scores":{"analytical":0.88,"practical":0.41,"visual":0.52}}
```

POST /api/demo/users/{userId}/personality with:

```json
{"primaryTrait":"PRACTICAL"}
```

Response:

```json
{"source":"SWELL_MOCK","primaryTrait":"PRACTICAL","learningMode":"PRACTICE_FIRST","scores":{"analytical":0.35,"practical":0.91,"visual":0.48}}
```

Refetch the lesson after switching. VISUAL scores are 0.35 analytical, 0.48 practical, 0.91 visual. Ties prefer ANALYTICAL, then PRACTICAL, then VISUAL. GET preserves the stored profile.

## Adaptive lesson

GET /api/lessons/csharp/conditions?userId=11111111-1111-1111-1111-111111111111

```json
{"lessonId":"conditions","language":"csharp","personality":"ANALYTICAL","presentationMode":"DEEP_EXPLANATION","title":"Making Decisions with if","louisMessage":"Let's inspect how a Boolean condition controls program flow.","explanation":"An if statement evaluates an expression that resolves to true or false. The >= operator compares the value on its left with the threshold on its right, including equality. Only when the comparison is true does the program enter the conditional block; otherwise it skips the block. Braces group statements into a block.","visualSteps":["Evaluate age >= 18","TRUE -> execute block","FALSE -> skip block"],"showExplanationFirst":true,"exercise":{"id":"cs-if-01","type":"CODE","prompt":"Print Adult when age is 18 or greater.","starterCode":"int age = 20;\n\n// Your code here"}}
```

Practical mode returns Louis's message "No lecture. Let's code it.", explanation=null, and showExplanationFirst=false.

## Evaluate

POST /api/evaluate

```json
{"userId":"11111111-1111-1111-1111-111111111111","language":"csharp","lessonId":"conditions","exerciseId":"cs-if-01","answer":"if (age >= 18) { Console.WriteLine(\"Adult\"); }"}
```

First correct completion after reset:

```json
{"correct":true,"xpAwarded":10,"feedback":{"title":"Correct!","message":"Nice work. Your condition checks whether age is at least 18."},"progress":{"lessonCompleted":true,"languagePercentage":66.67},"streak":{"previous":4,"current":5,"increased":true}}
```

Wrong answer before completion (HTTP 200):

```json
{"correct":false,"xpAwarded":0,"feedback":{"title":"Try again","message":"Check the requested condition, output text, and punctuation, then try again."},"progress":{"lessonCompleted":false,"languagePercentage":33.33},"streak":{"previous":4,"current":4,"increased":false}}
```

Correct replay: correct=true, xpAwarded=0, lessonCompleted=true, unchanged progress/streak. A wrong replay also preserves completed state. Refetch dashboard after evaluation for authoritative global XP. Concurrent submissions are serialized by a PostgreSQL user row lock.

Answers are limited to 5,000 characters and HTTP bodies to 65,536 bytes. Empty/whitespace answers are wrong answers (200); null/missing answers or overlong answers are malformed (400). Pattern matching is intentionally controlled and case-sensitive, not a compiler: code never executes and semantic equivalence is not guaranteed.

Streak changes only on a first lesson completion. Dates use configured America/New_York, including seed yesterday; replays and same-day completions cannot increment it again. increased means the numeric streak grew; after a missed day it may reset to 1.

## Reset and errors

POST /api/demo/users/11111111-1111-1111-1111-111111111111/reset with `{}` returns:

```json
{"message":"Demo reset.","userId":"11111111-1111-1111-1111-111111111111"}
```

Restores 120 XP, streak 4/longest 7, last activity yesterday, C# 1/3, ANALYTICAL, and removes demo attempts. Only the fixed demo user can be reset.

| Case | HTTP |
|---|---|
| Valid GET, correct or wrong answer | 200 |
| Invalid/missing input or invalid trait | 400 |
| Unknown user/language/lesson/exercise | 404 |
| Demo endpoint disabled or key missing/wrong | 404 |
| Body larger than 65,536 bytes | 413 |
| Unexpected server error | 500 with generic message |

Demo endpoints require Demo__Enabled=true. Development enables this by default. Outside Development, also require secret Demo__ApiKey and request header X-Demo-Key. Keep that secret out of public frontend bundles; use a trusted presenter tool or server-side proxy. Regular MVP endpoints use user IDs without authentication, so this is a hackathon API rather than an authenticated multi-user service.

## CORS and startup

Development allows http://localhost:5173, :5174, and :3000. Set FrontendOrigin for another exact origin. Production permits only configured FrontendOrigin. No wildcard or credentialed CORS.

See [README.md](README.md) for PostgreSQL, configuration, and startup. On this workstation: run `powershell -NoProfile -File backend/scripts/start-postgres.ps1` if PostgreSQL is stopped, then `powershell -NoProfile -File backend/scripts/start-local.ps1`. The current local API uses port 5080; PostgreSQL uses loopback port 55432. The scripts locate ignored local credentials without printing them.
