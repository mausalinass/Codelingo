# Codelingo backend

Single ASP.NET Core 10 Web API with EF Core/Npgsql PostgreSQL persistence. Runtime data is stored in PostgreSQL; 80 lessons are static, versioned definitions. Student code is never executed. See [API_CONTRACT.md](API_CONTRACT.md) for frontend integration.

## Requirements

- .NET SDK 10 (built and tested with 10.0.400).
- PostgreSQL (tested with portable PostgreSQL 17.11).
- Node.js 18+ for the live smoke suite.

All backend work is contained here. No frontend or shared root files are modified.

## Start on this workstation

The implementation provisioned portable PostgreSQL in ignored `.runtime/pgsql`, data in `.runtime/pgdata`, and generated credentials in `.runtime/local-env.json`. The database listens only on 127.0.0.1:55432. These machine-local files are not committed or pushed.

If PostgreSQL is not already running, start it in a terminal:

```powershell
powershell -NoProfile -File backend/scripts/start-postgres.ps1
```

Start the API:

```powershell
powershell -NoProfile -File backend/scripts/start-local.ps1
```

The API is http://localhost:5080; Swagger is http://localhost:5080/swagger/index.html. Startup applies migrations and seeds only when the fixed demo user is absent. It never resets completed work automatically. Ctrl+C stops each foreground process. Do not start duplicate processes on the same ports.

The portable binaries came from [EDB's PostgreSQL binary distribution](https://www.enterprisedb.com/download-postgresql-binaries). They are a local development dependency, not part of the application distribution.

## Fresh checkout / another database

Provision PostgreSQL and create a database/user with migration privileges. Copy values from [.env.example](.env.example) into your process or hosting configuration; ASP.NET does not automatically read .env files. Never commit real passwords.

```powershell
$env:ConnectionStrings__Default = 'Host=localhost;Port=5432;Database=codelingo;Username=codelingo;Password=YOUR_SECRET'
$env:ASPNETCORE_ENVIRONMENT = 'Development'
$env:Database__Initialize = 'true'
dotnet restore backend/Codelingo.Api
dotnet run --project backend/Codelingo.Api
```

Alternatively, apply migrations explicitly from the backend directory:

```powershell
cd backend
dotnet tool restore
dotnet tool run dotnet-ef database update --project Codelingo.Api
```

Set Database__Initialize=true on the first API boot to seed the demo (it also applies pending migrations). If false, the API can boot without a database for liveness/OpenAPI inspection; data endpoints still require PostgreSQL. /health is liveness; /health/ready checks database connectivity, not full schema health.

## Configuration

| Setting | Meaning |
|---|---|
| ConnectionStrings__Default | Npgsql connection string; no secret default |
| ASPNETCORE_ENVIRONMENT | Development locally, Production on host |
| ASPNETCORE_URLS | Listening URL; local script uses http://localhost:5080 |
| FrontendOrigin | Exact frontend origin; required for production browser access |
| Demo__TimeZone | IANA timezone; default America/New_York |
| Database__Initialize | Apply migration and ensure seed on startup; default false |
| Demo__Enabled | Enable demo endpoints; false except Development default |
| Demo__ApiKey | Required X-Demo-Key secret for demo mutation outside Development |

## Verify

From repository root:

```powershell
dotnet build backend/Codelingo.Api
dotnet test backend/Codelingo.Api.Tests
node backend/scripts/smoke.mjs
node backend/scripts/curriculum-smoke.mjs
```

The smoke suite deliberately resets the fixed demo user, performs three full judge flows, verifies 12 simultaneous requests award XP once, checks validation/CORS/OpenAPI, and leaves the demo reset. Do not run against an active judging session. Override API_BASE_URL and DEMO_API_KEY for a configured host. Swagger/OpenAPI checks in this script expect Development; production Swagger is disabled.

## Persistence design

Six tables map to the execution plan, including unique user/language and user/language/lesson keys. EF migration includes foreign keys, cascade deletes, language/trait checks, indexes, JSONB provider data, and decimal percentages. UUIDs/timestamps are assigned by application code; uuid-ossp is unnecessary.

Evaluation, personality changes, and reset lock the user's PostgreSQL row. First completion, attempt, global/route XP, aggregate progress, and streak commit together. This protects duplicate XP across concurrent API processes. Dashboard reads use a repeatable-read snapshot. Reset uses an additional advisory lock for initial user creation.

Seed: one user, eight course rows, 80 lesson-state rows, one profile and one streak. Python/C# hello are completed. Global XP starts at 120, including 100 historical/demo XP beyond the two seeded lesson rewards. Python/C# course XP starts at 10; other routes start at zero.

## Deployment handoff

Public deployment is not provisioned. Supply an API host/project and production frontend origin; set hosted PostgreSQL credentials in that host's secret manager as ConnectionStrings__Default. Typical format:

`Host=DB_HOST;Port=5432;Database=codelingo;Username=DB_USER;Password=SECRET;SSL Mode=VerifyFull`

Use the database provider's required TLS/certificate settings. Publish with `dotnet publish backend/Codelingo.Api -c Release -o backend/.runtime/publish`, deploy its output on a .NET 10 host, and configure the host's HTTPS reverse proxy/listening port. Set ASPNETCORE_ENVIRONMENT=Production and FrontendOrigin to the actual React origin. Apply migrations and seed before judging. Production demo endpoints need both Demo__Enabled=true and a strong Demo__ApiKey, used from trusted presenter tooling, never embedded in public React code.

This MVP has no user authentication or code compiler. Regex checks recognize the plan's controlled patterns and do not establish arbitrary semantic correctness. Path locking is presentational, not enforced by the API. Swell is explicitly SWELL_MOCK behind a provider boundary.

## Expansion migration

ExpandCurriculum adds the five language IDs, backfills route/lesson state for existing users, and recalculates percentages against ten lessons. It preserves global XP, route XP, completion IDs/dates, attempts and streaks. Back up PostgreSQL before deployment. Down migration deliberately refuses to discard earned progress; rollback requires a pre-migration backup. A local pre-expansion backup is in ignored .runtime/before-expansion.dump.

The frontend is in ../codelingo-web. Its API integration uses live server responses without a mock fallback. The shared profile is a demo, not a personal account. Follow that directory's README for build and browser tests.
