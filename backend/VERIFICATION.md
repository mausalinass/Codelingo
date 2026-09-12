# Integrated backend/frontend verification

Validated locally on 2026-09-12 with .NET SDK 10.0.400, PostgreSQL 17.11, Node 24 and Chrome.

- Backend build: zero warnings/errors; 110 unit tests passed.
- Curriculum: 8 languages × 10 lessons, unique exercise IDs. Tests cover all 80 reference snippets, CRLF/whitespace, incorrect answers, personality, percentages and local-date streaks.
- PostgreSQL ExpandCurriculum migration: applied. Exact pre/post comparison preserved global XP, existing completed-row UUIDs and streak. Eight route rows and 80 lesson rows now exist for the demo user. Backup saved under ignored .runtime/before-expansion.dump.
- Live HTTP: three consecutive reset/judge flows passed with new percentages (10% -> 20%), XP 120 -> 130, streak 4 -> 5, replay +0.
- Concurrency: 12 simultaneous correct requests award exactly 10 XP combined.
- All 80 lessons: live wrong/correct/replay requests passed. Eight persisted courses reached 100%, global XP 900, streak 5; reset afterward.
- Browser: analytical -> practical and visual modes render CODE correctly; incorrect/correct answers and replays use real API responses; completion shows +10 then +0 and streak 5.
- Browser reload: saved XP/progress remain. Out-of-order completion preserves the correct current lesson.
- HTTP failure in browser: error shown, answer retained, no fabricated XP; retry succeeds after recovery.
- Dashboard API outage: visible error, no simulated lesson links.
- Demo profile: no email/password collection or fake signup.
- Mobile: 390px viewport passes horizontal overflow test after navigation wrapping fix.
- Frontend TypeScript/Vite build and Oxlint passed. Vite reports a non-blocking large lesson/editor chunk; the lesson route is lazy-loaded.

Reproduction: backend/scripts/smoke.mjs, backend/scripts/curriculum-smoke.mjs and codelingo-web/scripts/integration-test.mjs. Tests deliberately reset the fixed demo user and should not run during judging.

Scope: verified shared-profile demo. Public hosting, deployed cross-origin integration and real user authentication remain outside these local checks. The project should not be advertised as supporting private personal accounts.
