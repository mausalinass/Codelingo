# Codelingo React frontend

React + TypeScript + Vite, integrated with the ASP.NET API in ../backend. This is a shared-profile learning demo, not an authenticated user account service.

## Local startup

Start PostgreSQL and the backend using ../backend/README.md, then:

```sh
npm ci
npm run dev -- --port 5173 --strictPort
```

Open http://localhost:5173. Development defaults to API http://localhost:5080. For another origin configure VITE_API_BASE_URL; see .env.example. The app never substitutes mock success for a failed API request. Network failures display an error and retain the typed answer for retry.

## Integration rules

- Catalog and completed/current/locked lesson states come from the dashboard API.
- Eight languages, ten lessons per course; UI uses returned totals and IDs.
- CODE/FILL_BLANK rendering follows exercise.type. All current backend exercises use CODE in every personality mode.
- Demo personality POST sends primaryTrait and receives PersonalityResponse.
- Completion XP/streak come directly from EvaluateResponse. Replays display +0 XP.
- Demo profile dialog does not collect email/password or pretend to create accounts.
- SWELL_MOCK is explicitly shown. Scores such as 0.88 render as 88%.
- Demo switch controls are visible in Development and hidden in production. Do not embed Demo__ApiKey in VITE_* variables. A trusted server-side presenter tool is needed for protected production mutations.

## Validation

```sh
npm run build
npm run lint
npx playwright install chromium
npm run test:integration
```

The integration test requires both local servers. It resets the fixed demo user and leaves it reset. To use an installed Chrome set CHROME_PATH to its executable path; on this workstation C:\Program Files\Google\Chrome\Application\chrome.exe. Override FRONTEND_URL and API_BASE_URL if necessary. Test covers practical/visual code submission, wrong/correct/replay, persistent XP and streak, recarga, HTTP failure without fabricated success, demo profile and mobile overflow.

## Deployment

Set VITE_API_BASE_URL to your HTTPS API origin before npm run build, then host dist with an SPA fallback to index.html. Empty production API URL assumes a same-origin /api reverse proxy. Local .env files are ignored and are not committed. Configure backend FrontendOrigin to the actual frontend origin. Test the deployed frontend/API/database together before judging.

Public registration, authentication and individual user data isolation are not implemented. Do not advertise a personal-account launch based on this demo.
