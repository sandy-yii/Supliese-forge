# Atelback · Conectar Claude Desktop con Google Ads (solo lectura) en Windows
#
# Hace los pasos C2 a D3 de la guía «Claude + Google Ads en Windows»:
#   instala Python, pipx y Google Cloud CLI (si faltan) · da el permiso con gamesailmx@gmail.com ·
#   deja el conector en SOLO LECTURA · agrega el conector a Claude Desktop sin borrar lo que ya tenga.
# No entra a Google Ads ni cambia nada en las cuentas. No guarda el token en ningún otro lado
# que la configuración de Claude.
#
# ANTES: tener listos el paso A4 (cliente.json) y el B1 (token y número de la MCC).
# CÓMO SE CORRE (en PowerShell):
#   powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\Downloads\conectar-claude-google-ads.ps1"

# 'Continue': en Windows PowerShell 5.1, 'Stop' convierte en error cualquier aviso que py o gcloud escriban.
# Cada paso revisa su resultado y se detiene con «ALTO» si algo falla.
$ErrorActionPreference = 'Continue'
$carpeta = Join-Path $env:USERPROFILE 'google-ads-mcp'
$cliente = Join-Path $carpeta 'cliente.json'
$toolsConfig = Join-Path $carpeta 'tools_config.yaml'
$adc = Join-Path $env:APPDATA 'gcloud\application_default_credentials.json'

function Paso($t) { Write-Host ''; Write-Host "== $t" -ForegroundColor Cyan }
function Bien($t) { Write-Host "   OK  $t" -ForegroundColor Green }
function Aviso($t) { Write-Host "   !!  $t" -ForegroundColor Yellow }
function Alto($t) { Write-Host ''; Write-Host "ALTO: $t" -ForegroundColor Red; Write-Host 'No se cambió nada más. Manda una captura de esta ventana.'; Read-Host 'Enter para cerrar'; exit 1 }
function RefrescarPath {
  $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
}
function Existe($cmd) { return [bool](Get-Command $cmd -ErrorAction SilentlyContinue) }

Write-Host 'Conectar Claude Desktop con Google Ads (solo lectura)' -ForegroundColor White
Write-Host 'Usa SOLO la cuenta gamesailmx@gmail.com cuando se abra el navegador.'

# ---------- Datos ----------
Paso 'Datos (pasos A1 y B1)'
New-Item -ItemType Directory -Force -Path $carpeta | Out-Null
if (-not (Test-Path $cliente)) {
  $descargado = Get-ChildItem (Join-Path $env:USERPROFILE 'Downloads') -Filter 'client_secret_*.json' -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if ($descargado) {
    Copy-Item $descargado.FullName $cliente -ErrorAction Stop
    Bien "Copié $($descargado.Name) de Descargas como cliente.json"
  } else {
    Alto "No encontré $cliente ni un client_secret_*.json en Descargas. Repite el paso A4."
  }
} else { Bien 'cliente.json encontrado' }

$proyecto = (Read-Host 'ID del proyecto de Google Cloud (paso A1, ej. atelback-ads-123456)').Trim()
if (-not $proyecto) { Alto 'Falta el ID del proyecto.' }
$tokenSeguro = Read-Host 'Token de desarrollador (paso B1; no se ve al escribir)' -AsSecureString
$token = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($tokenSeguro))
if (-not $token.Trim()) { Alto 'Falta el token.' }
$mcc = ((Read-Host 'Número de la MCC de Atelback (con o sin guiones; Enter para dejarlo vacío)') -replace '\D', '')

# ---------- Python ----------
Paso 'Python'
if (-not (Existe 'py')) {
  if (-not (Existe 'winget')) { Alto 'Esta computadora no tiene winget. Instala Python desde python.org (marca «Add python.exe to PATH») y vuelve a correr esto.' }
  winget install -e --id Python.Python.3.12 --accept-source-agreements --accept-package-agreements
  RefrescarPath
  if (-not (Existe 'py')) { Alto 'Python se instaló pero no aparece. Cierra PowerShell, ábrelo y vuelve a correr este archivo.' }
}
Bien (& py --version)

# ---------- pipx ----------
Paso 'pipx'
& py -m pipx --version *> $null
if ($LASTEXITCODE -ne 0) {
  & py -m pip install --user --quiet pipx
  & py -m pipx --version *> $null
  if ($LASTEXITCODE -ne 0) { Alto 'No se pudo instalar pipx.' }
}
Bien 'pipx listo'

# ---------- Google Cloud CLI ----------
Paso 'Google Cloud CLI'
if (-not (Existe 'gcloud')) {
  $rutas = @(
    (Join-Path $env:LOCALAPPDATA 'Google\Cloud SDK\google-cloud-sdk\bin'),
    (Join-Path ${env:ProgramFiles(x86)} 'Google\Cloud SDK\google-cloud-sdk\bin'),
    (Join-Path $env:ProgramFiles 'Google\Cloud SDK\google-cloud-sdk\bin')
  )
  $ya = $rutas | Where-Object { Test-Path (Join-Path $_ 'gcloud.cmd') } | Select-Object -First 1
  if (-not $ya) {
    if (-not (Existe 'winget')) { Alto 'Falta winget. Instala «Google Cloud CLI» desde cloud.google.com/sdk/docs/install y vuelve a correr esto.' }
    winget install -e --id Google.CloudSDK --accept-source-agreements --accept-package-agreements
    RefrescarPath
    $ya = $rutas | Where-Object { Test-Path (Join-Path $_ 'gcloud.cmd') } | Select-Object -First 1
  }
  if ($ya) { $env:Path = "$ya;$env:Path" }
  if (-not (Existe 'gcloud')) { Alto 'Google Cloud CLI no aparece. Cierra PowerShell, ábrelo y vuelve a correr este archivo.' }
}
Bien 'gcloud listo'

# ---------- Permiso ----------
Paso 'Permiso con tu cuenta (se abre el navegador)'
Write-Host '   1) Elige gamesailmx@gmail.com   2) Si dice «Google no verificó esta app», toca Continuar   3) Permitir'
& gcloud auth application-default login `
  --scopes=https://www.googleapis.com/auth/adwords,https://www.googleapis.com/auth/cloud-platform `
  --client-id-file="$cliente"
if ($LASTEXITCODE -ne 0 -or -not (Test-Path $adc)) { Alto 'No se completó el permiso en el navegador.' }
& gcloud auth application-default set-quota-project $proyecto
if ($LASTEXITCODE -ne 0) { Aviso "No se pudo asignar el proyecto $proyecto. Revisa el ID; el resto sigue." } else { Bien 'Permiso guardado' }

# ---------- Solo lectura ----------
Paso 'Solo lectura'
$yaml = "namespaces:`n  customers: true`n  search: true`n  metadata: true`n  labels: false`n  assets: false`n"
[IO.File]::WriteAllText($toolsConfig, $yaml, (New-Object Text.UTF8Encoding $false))
Bien 'Conector limitado a consultar (sin crear etiquetas ni recursos)'

# ---------- Claude Desktop ----------
Paso 'Claude Desktop'
$candidatos = @((Join-Path $env:APPDATA 'Claude\claude_desktop_config.json'))
Get-ChildItem (Join-Path $env:LOCALAPPDATA 'Packages') -Directory -Filter 'Claude_*' -ErrorAction SilentlyContinue | ForEach-Object {
  $candidatos += (Join-Path $_.FullName 'LocalCache\Roaming\Claude\claude_desktop_config.json')
}
$config = $candidatos | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $config) {
  $config = $candidatos[0]
  New-Item -ItemType Directory -Force -Path (Split-Path $config) | Out-Null
}

$datos = $null
if (Test-Path $config) {
  $texto = [IO.File]::ReadAllText($config)
  if ($texto.Trim()) {
    Copy-Item -ErrorAction Stop $config "$config.respaldo-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    try { $datos = $texto | ConvertFrom-Json -ErrorAction Stop } catch { Alto "La configuración actual de Claude no es JSON válido ($config). No la toqué." }
  }
}
if (-not $datos) { $datos = New-Object PSObject }
if (-not ($datos.PSObject.Properties.Name -contains 'mcpServers')) {
  $datos | Add-Member -NotePropertyName mcpServers -NotePropertyValue (New-Object PSObject)
}
$envVars = [ordered]@{
  GOOGLE_APPLICATION_CREDENTIALS = $adc
  GOOGLE_PROJECT_ID              = $proyecto
  GOOGLE_ADS_DEVELOPER_TOKEN     = $token.Trim()
  GOOGLE_ADS_MCP_TOOLS_CONFIG    = $toolsConfig
}
if ($mcc) { $envVars['GOOGLE_ADS_LOGIN_CUSTOMER_ID'] = $mcc }
$servidor = [ordered]@{
  command = 'py'
  args    = @('-m', 'pipx', 'run', '--spec', 'google-ads-mcp', 'google-ads-mcp')
  env     = $envVars
}
$datos.mcpServers | Add-Member -NotePropertyName 'google-ads-mcp' -NotePropertyValue $servidor -Force
[IO.File]::WriteAllText($config, ($datos | ConvertTo-Json -Depth 20), (New-Object Text.UTF8Encoding $false))
Bien "Conector agregado a Claude ($config). Lo que ya tenías se conservó y hay un respaldo junto al archivo."
$token = $null

# ---------- Reiniciar Claude ----------
Paso 'Reiniciar Claude'
$abierto = Get-Process -Name 'Claude' -ErrorAction SilentlyContinue
if ($abierto) {
  $r = Read-Host 'Claude está abierto. ¿Lo cierro para que cargue el conector? (s/n)'
  if ($r -match '^[sS]') { $abierto | Stop-Process -Force; Bien 'Claude cerrado' }
  else { Aviso 'Ciérralo tú: ícono de Claude junto al reloj › clic derecho › Salir.' }
}

Write-Host ''
Write-Host 'LISTO. Abre Claude Desktop y en un chat nuevo escribe:' -ForegroundColor Green
Write-Host '   Usa Google Ads en solo lectura. Lista las cuentas a las que tengo acceso.'
Write-Host 'La primera vez tarda un minuto (descarga el conector). Si el token aún no tiene acceso básico,'
Write-Host 'Google responde que solo sirve para cuentas de prueba: es normal, hay que esperar el paso B2.'
Read-Host 'Enter para cerrar'
