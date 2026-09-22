# Publica la tienda en Vercel  ->  https://jose-store.vercel.app
# Cuenta: josestore1723-8403  (token en .vercel-token, no se sube a ningun lado)
#
# Uso:   pwsh ./deploy.ps1        (o boton derecho > Run with PowerShell)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$tokenFile = Join-Path $root ".vercel-token"

if (-not (Test-Path $tokenFile)) {
  Write-Host "ERROR: falta el archivo .vercel-token" -ForegroundColor Red
  Write-Host "Genera un token en https://vercel.com/account/settings/tokens y guardalo ahi."
  exit 1
}
$token = (Get-Content $tokenFile -Raw).Trim()

Write-Host "[1/2] Generando jose-store/index.html desde 'Jose Store.dc.html' ..." -ForegroundColor Cyan
node (Join-Path $root "build.js")
if ($LASTEXITCODE -ne 0) { Write-Host "build.js fallo" -ForegroundColor Red; exit 1 }

Write-Host "[2/2] Desplegando a produccion ..." -ForegroundColor Cyan
vercel deploy --prod --yes --cwd (Join-Path $root "jose-store") --scope josestore1723-8403 --token $token
if ($LASTEXITCODE -ne 0) { Write-Host "deploy fallo" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "Listo -> https://jose-store.vercel.app" -ForegroundColor Green
