$ErrorActionPreference = 'Stop'
$backendPath = Split-Path $PSScriptRoot -Parent
$settingsPath = Join-Path $backendPath '.runtime/local-env.json'
if (Test-Path -LiteralPath $settingsPath) {
    $localSettings = Get-Content -LiteralPath $settingsPath -Raw | ConvertFrom-Json
    $env:ConnectionStrings__Default = $localSettings.ConnectionStrings__Default
}
if (-not $env:ConnectionStrings__Default) { throw 'Set ConnectionStrings__Default to your PostgreSQL connection string.' }
$env:ASPNETCORE_ENVIRONMENT = 'Development'
$env:Database__Initialize = 'true'
dotnet run --project (Join-Path $backendPath 'Codelingo.Api') --no-launch-profile --urls http://localhost:5080
