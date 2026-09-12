$ErrorActionPreference = 'Stop'
$backendPath = Split-Path $PSScriptRoot -Parent
$pgBinary = Join-Path $backendPath '.runtime/pgsql/bin/postgres.exe'
$pgData = Join-Path $backendPath '.runtime/pgdata'
if (-not (Test-Path -LiteralPath $pgBinary)) { throw 'Portable PostgreSQL is not installed on this checkout. Use your own PostgreSQL connection or follow README.md.' }
& $pgBinary -D $pgData
