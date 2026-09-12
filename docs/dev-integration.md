# Combined dev branch
This merge joins frontend dd73a39 (dropdowns, sidebar, dark theme, math and spoken-language prototypes) with backend integration 2ddfea4.

## Preserved and verified
- Earned Milestones and Programming Languages & Tracks dropdowns.
- Left subject sidebar and math exercise navigation.
- Dark mode preference across reloads.
- Eight API-backed programming tracks, explicit lesson completion IDs, adaptive CODE editor, persisted XP/streak, replay +0 XP, and visible HTTP failures.
- PDF execution plan and copyable prompt under output/pdf. These describe future rebranding work; the plan has not been implemented by this merge.

## Integration boundary
The server supports python, javascript, typescript, csharp, go, rust, java and cpp. Math, spoken languages, Kotlin and Swift remain frontend prototypes inherited from dev. They are explicitly labeled preview, use session-only practice completion and award no saved XP or streak. Backend errors never fall back to those previews. Preview totals are excluded from saved global progress and milestones.
The inherited prototype curriculum includes generic/fallback exercises; it is not a fully authored, server-backed curriculum for every advertised track. Backend persistence and complete content for these tracks are follow-up work.

## Validation
- npm run build and npm run lint pass.
- dotnet test backend/Codelingo.Api.Tests -c Release --no-restore: 110 pass.
- scripts/integration-test.mjs: original API integration regression passes.
- scripts/bonus-integration-test.mjs: dropdowns, sidebar, dark mode reload, wrong/correct math answers and unchanged server progress pass.
- Build reports non-blocking bundle size warnings.

## Product upgrade implementation

The public `/` route now offers Get Started, Login and explicit demo access. The persisted onboarding flow covers explanation language, four programming tracks, experience, five deterministic questions and a real starting-point result stored by Development-only demo onboarding endpoints. `/progress`, `/achievements` and `/profile` are live sidebar destinations. Louis can be paused with the preference retained across reloads, and streak badges use the 0/1/50/100/250/500 color tiers.

Google and Apple authentication remain externally blocked because no provider credentials or backend verifier are configured. Their controls say setup is required; the complete local flow uses the deterministic demo user. Real-user identity and account persistence must be completed before production launch.
