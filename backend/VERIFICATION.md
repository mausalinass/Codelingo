# Backend verification

Validated locally on 2026-09-11, Windows, .NET SDK 10.0.400, PostgreSQL 17.11.

- Build: passed, zero warnings/errors.
- Unit tests: 29 passed (nine curriculum solutions, incorrect/oversize answers, personality/ties, rounded progress, streak dates, local date near UTC midnight, adaptive modes).
- EF migration InitialCreate: generated and applied; no pending model changes.
- Seed: 1 user, 3 language rows, 9 lesson rows, 1 personality profile; starting XP 120, streak 4, C# 33.33%.
- Full judge flow: passed three consecutive reset/rehearsal cycles.
- Each cycle: analytical lesson -> practical switch -> hidden explanation -> wrong answer +0 -> correct +10 -> C# 66.67% -> streak 5 -> replay +0 -> persisted dashboard.
- Concurrent test: 12 simultaneous correct submissions, exactly 10 total awarded XP.
- Same-day next lesson: +10 XP, streak remains 5, course reaches 100%.
- Validation: null/oversize/invalid UUID 400; unknown user/language/lesson/exercise 404; invalid trait 400; empty answer valid wrong result.
- All nine lessons expose VISUAL_GUIDED with steps and no Regex internals.
- Development CORS: expected origin accepted, unrelated origin not allowed.
- Swagger and OpenAPI returned 200; database readiness passed.
- Production configuration: demo mutations reject absent/wrong key; accept correct key; Swagger disabled; configured frontend origin allowed.

Reproduce with the commands in README.md and scripts/smoke.mjs. The smoke suite leaves the demo in its initial state.

Public deployment and deployed React integration remain unverified pending a hosting destination and production configuration.

- Process restart: XP 130, C# 66.67%, streak 5 survived API restart with startup initialization enabled; demo reset afterward.
