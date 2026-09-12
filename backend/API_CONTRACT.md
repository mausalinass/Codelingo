# Codelingo API — expanded curriculum

Base URL locally: http://localhost:5080. Camel-case JSON. Demo user: `11111111-1111-1111-1111-111111111111`.

## Catalog and supported IDs

Eight languages: `python`, `javascript`, `typescript`, `csharp`, `go`, `rust`, `java`, `cpp`.

Ten lessons in this order: `hello`, `variables`, `conditions`, `functions`, `loops`, `arrays`, `oop`, `async`, `errors`, `generics`.

GET /api/lessons/catalog returns language groups with lesson id, title, and order. Curriculum is static/versioned in Curriculum/lessons.json. Do not infer IDs from display text. Sample solutions and validation rules are never sent to the frontend.

## Endpoints

| Method | Path | Result |
|---|---|---|
| GET | /api/users/{userId}/dashboard | User, streak, eight courses with explicit lesson states |
| GET | /api/users/{userId}/personality | Stored normalized Swell mock profile |
| GET | /api/lessons/catalog | Public catalog, no answers |
| GET | /api/lessons/{language}/{lessonId}?userId={userId} | Adaptive lesson and exercise |
| POST | /api/evaluate | Persisted attempt, XP, progress and streak |
| POST | /api/demo/users/{userId}/personality | Demo-only personality switch |
| POST | /api/demo/users/{userId}/reset | Reset only the fixed demo user |
| POST | /api/onboarding/preferences | Persist demo onboarding selections in Development |
| POST | /api/onboarding/placement | Score five deterministic placement answers in Development |
| POST | /api/onboarding/complete | Persist the demo starting point in Development |
| GET | /api/users/{userId}/onboarding | Resume persisted demo onboarding in Development |
| GET | /health | Liveness |
| GET | /health/ready | PostgreSQL connectivity |

## Dashboard

The response retains `user`, `streak`, `activeLanguage`, and `courses`. Every course now includes `lessons`:

```json
{
  "language": "csharp",
  "completedLessons": 1,
  "totalLessons": 10,
  "percentage": 10,
  "lessons": [
    {"id":"hello","title":"Hello World","description":"A string literal contains text.","order":1,"status":"completed"},
    {"id":"variables","title":"Variables & Types","description":"A variable binds a name to a value.","order":2,"status":"current"}
  ]
}
```

The example abbreviates the lessons array; all ten are returned. States: completed, current (first incomplete), locked (later incomplete). Completed IDs remain accurate even if a lesson was completed out of order. Path locking is presentation guidance; the API allows direct lesson practice. Compute global progress from the sum of actual totalLessons. Never hard-code /3 or /10 in the UI.

Seed/reset: Mauricio, totalXp=120, streak.current=4, streak.longest=7, activeLanguage=csharp; Python and C# hello completed, all other lessons incomplete. Global XP includes 100 historical/demo XP. C# now starts at 1/10 (10%), not 1/3. Completing conditions directly gives 2/10 (20%); variables remains current. Completing variables first and then conditions gives 3/10 (30%).

## Personality

```json
{"source":"SWELL_MOCK","primaryTrait":"ANALYTICAL","learningMode":"DEEP_EXPLANATION","scores":{"analytical":0.88,"practical":0.41,"visual":0.52}}
```

Scores are fractions, so display 0.88 as 88%. Traits/modes: ANALYTICAL/DEEP_EXPLANATION, PRACTICAL/PRACTICE_FIRST, VISUAL/VISUAL_GUIDED. Ties prefer analytical, practical, then visual.

Switch request: `{"primaryTrait":"PRACTICAL"}`. Response is the same PersonalityResponse shape above, with practical scores 0.35/0.91/0.48. It is not a success/personality object. Refetch personality and lesson after success; surface errors.

## Lesson and submission

Adaptive response retains lessonId, language, personality, presentationMode, title, louisMessage, explanation, visualSteps, showExplanationFirst, and exercise {id,type,prompt,starterCode}. All current exercises are CODE. Practical hides explanation; visual shows guided steps. Choose the editor using exercise.type, not presentationMode.

POST /api/evaluate:

```json
{"userId":"11111111-1111-1111-1111-111111111111","language":"csharp","lessonId":"conditions","exerciseId":"cs-if-01","answer":"if (age >= 18) { Console.WriteLine(\"Adult\"); }"}
```

After reset, the first correct conditions response:

```json
{"correct":true,"xpAwarded":10,"feedback":{"title":"Correct!","message":"Nice work. Your condition checks whether age is at least 18."},"progress":{"lessonCompleted":true,"languagePercentage":20},"streak":{"previous":4,"current":5,"increased":true}}
```

Wrong answers return 200 with correct=false and xpAwarded=0, without changing progress/streak. Correct replays return correct=true and xpAwarded=0. The completion screen must use the returned xpAwarded and streak.current; do not assume +10 or add another streak increment. Refetch dashboard after completion.

Limit: 5,000 answer characters, 65,536 request bytes. Empty/whitespace input is a wrong answer; null/missing/overlong input is 400. Unknown user/language/lesson/exercise is 404. Oversized HTTP body is 413. Server failure is generic 500. Disabled or unauthorized demo routes return 404.

Evaluation is controlled pattern/string matching and never executes code. Original nine exercises preserve the MVP patterns. Added exercises recognize the specified snippet token sequence with whitespace flexibility outside quoted strings. Names, literals, structure and required imports/declarations must match the prompt; arbitrary equivalent solutions are not guaranteed. This is a teaching demo, not a compiler or semantic correctness proof.

## Demo and production

Development demo controls are enabled by default. Outside Development, mutation requires Demo__Enabled=true and X-Demo-Key matching secret Demo__ApiKey. Never put that secret in public VITE_* configuration. Production frontend hides controls by default; a trusted presenter tool can switch personality. There is no verified real-user signup/login yet. The frontend identifies the shared demo profile and does not collect passwords. Google and Apple controls remain disabled until a hosted provider and backend token verification are configured.

The onboarding endpoints are limited to the fixed demo user in Development until real authentication exists. Preferences accept `uiLanguage` (`es` or `en`), `programmingLanguage` (`python`, `javascript`, `typescript`, or `csharp`) and the four documented experience levels. Placement requires exactly five unique answers, returns a deterministic score/recommendation, and does not award XP, streaks, or lesson completion. Completion stores `startingLessonId` separately from progress.

Development CORS allows localhost and 127.0.0.1 on ports 5173, 5174, and 3000. Production requires exact FrontendOrigin. Set VITE_API_BASE_URL to the deployed HTTPS API origin when deploying frontend separately; an empty production value assumes a same-origin /api proxy.

Swagger: /swagger/index.html and /openapi/v1.json in Development. See README.md for startup and migrations.
