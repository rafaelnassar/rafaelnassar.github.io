<# 
.SYNOPSIS
  Supabase Self-Host Manager para Windows 10/11 com Docker Desktop.

.DESCRIPTION
  Cria e gerencia múltiplas instâncias self-hosted do Supabase usando Docker Compose.
  Pensado para Windows puro: não depende de Git Bash, sed, awk, timeout ou /dev/tcp.

.EXAMPLES
  .\supabase-stack.ps1 doctor
  .\supabase-stack.ps1 new meuapp
  .\supabase-stack.ps1 list
  .\supabase-stack.ps1 status meuapp
  .\supabase-stack.ps1 logs meuapp auth
  .\supabase-stack.ps1 secrets meuapp
  .\supabase-stack.ps1 stop meuapp
  .\supabase-stack.ps1 start meuapp
  .\supabase-stack.ps1 reset meuapp
#>

[CmdletBinding()]
param(
  [Parameter(Position = 0)]
  [ValidateSet(
    'new','install',
    'start','stop','restart',
    'status','ps',
    'logs',
    'secrets','access','acessos',
    'reset','reinstall',
    'list','ls',
    'clean',
    'doctor',
    'update',
    'help'
  )]
  [string]$Command = 'help',

  [Parameter(Position = 1)]
  [string]$Name,

  [Parameter(Position = 2)]
  [string]$Service,

  [string]$BaseDir = (Join-Path $HOME 'supabase-selfhost-instances'),

  [string]$Branch = 'master',

  [switch]$NoPull,

  [switch]$Force,

  [switch]$OpenStudio,

  [switch]$Follow,

  [switch]$NoColor
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

try {
  [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
  $OutputEncoding = [System.Text.UTF8Encoding]::new($false)
} catch {}

try {
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
} catch {}

try {
  $script:BaseDir = (Resolve-Path -LiteralPath $BaseDir -ErrorAction Stop).Path
} catch {
  $script:BaseDir = [System.IO.Path]::GetFullPath($BaseDir)
}

$script:RepoDir = Join-Path $script:BaseDir '_supabase_repo'
$script:DockerExe = $null
$script:GitExe = $null

function Write-Ui {
  param(
    [Parameter(Mandatory = $true)][string]$Text,
    [ConsoleColor]$Color = [ConsoleColor]::Gray
  )

  if ($NoColor) {
    Write-Host $Text
  } else {
    Write-Host $Text -ForegroundColor $Color
  }
}

function Print-Title {
  Write-Host ''
  Write-Ui '╔══════════════════════════════════════════════════════╗' Cyan
  Write-Ui '║              SUPABASE SELF-HOST MANAGER             ║' Cyan
  Write-Ui '║                    Windows 10/11                    ║' Cyan
  Write-Ui '╚══════════════════════════════════════════════════════╝' Cyan
  Write-Host ''
}

function Ok    { param([string]$Message) Write-Ui "✔ $Message" Green }
function Warn  { param([string]$Message) Write-Ui "⚠ $Message" Yellow }
function Info  { param([string]$Message) Write-Ui "➜ $Message" Blue }
function Fail  { param([string]$Message) Write-Ui "✖ $Message" Red }

function Usage {
  Print-Title

  @"
Uso:

  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 doctor
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 new [nome]
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 start <nome>
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 stop <nome>
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 restart <nome>
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 status <nome>
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 logs <nome> [servico] [-Follow]
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 secrets <nome>
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 reset <nome>
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 list
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 clean
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 update

Exemplos:

  .\supabase-stack.ps1 new meuapp
  .\supabase-stack.ps1 new teste
  .\supabase-stack.ps1 logs meuapp auth
  .\supabase-stack.ps1 secrets meuapp
  .\supabase-stack.ps1 reset meuapp

Pasta padrão:

  $script:BaseDir

"@ | Write-Host
}

function Write-Utf8Lines {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string[]]$Lines
  )

  $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
  [System.IO.File]::WriteAllLines($Path, $Lines, $utf8NoBom)
}

function Write-Utf8Text {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Text
  )

  $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
  [System.IO.File]::WriteAllText($Path, $Text, $utf8NoBom)
}

function Resolve-Docker {
  $cmd = Get-Command docker -ErrorAction SilentlyContinue
  if ($cmd) {
    return $cmd.Source
  }

  $candidates = @(
    (Join-Path $env:ProgramFiles 'Docker\Docker\resources\bin\docker.exe'),
    (Join-Path $env:ProgramFiles 'Docker\Docker\docker.exe')
  )

  if (${env:ProgramFiles(x86)}) {
    $candidates += (Join-Path ${env:ProgramFiles(x86)} 'Docker\Docker\resources\bin\docker.exe')
  }

  foreach ($candidate in $candidates) {
    if ($candidate -and (Test-Path -LiteralPath $candidate)) {
      return $candidate
    }
  }

  throw "Docker CLI não encontrado. Instale o Docker Desktop e abra um novo terminal."
}

function Resolve-Git {
  $cmd = Get-Command git -ErrorAction SilentlyContinue
  if ($cmd) {
    return $cmd.Source
  }

  $candidates = @(
    (Join-Path $env:ProgramFiles 'Git\cmd\git.exe'),
    (Join-Path $env:ProgramFiles 'Git\bin\git.exe')
  )

  if (${env:ProgramFiles(x86)}) {
    $candidates += (Join-Path ${env:ProgramFiles(x86)} 'Git\cmd\git.exe')
  }

  foreach ($candidate in $candidates) {
    if ($candidate -and (Test-Path -LiteralPath $candidate)) {
      return $candidate
    }
  }

  return $null
}

function Start-DockerDesktopIfNeeded {
  $desktopCandidates = @(
    (Join-Path $env:ProgramFiles 'Docker\Docker\Docker Desktop.exe')
  )

  if (${env:ProgramFiles(x86)}) {
    $desktopCandidates += (Join-Path ${env:ProgramFiles(x86)} 'Docker\Docker\Docker Desktop.exe')
  }

  foreach ($candidate in $desktopCandidates) {
    if ($candidate -and (Test-Path -LiteralPath $candidate)) {
      Info "Docker instalado, mas o daemon não respondeu. Abrindo Docker Desktop..."
      Start-Process -FilePath $candidate | Out-Null
      return
    }
  }

  Warn "Docker Desktop não foi encontrado no caminho padrão. Abra o Docker Desktop manualmente."
}

function Ensure-Docker {
  $script:DockerExe = Resolve-Docker

  try {
    & $script:DockerExe info *> $null
    if ($LASTEXITCODE -eq 0) {
      Ok "Docker está instalado e acessível."
    } else {
      throw "Docker info retornou código $LASTEXITCODE"
    }
  } catch {
    Start-DockerDesktopIfNeeded

    for ($i = 1; $i -le 90; $i++) {
      Start-Sleep -Seconds 2
      try {
        & $script:DockerExe info *> $null
        if ($LASTEXITCODE -eq 0) {
          Ok "Docker Desktop ficou acessível."
          break
        }
      } catch {}

      if ($i -eq 90) {
        throw "Docker Desktop não está rodando ou não ficou acessível. Abra o Docker Desktop e tente novamente."
      }
    }
  }

  & $script:DockerExe compose version *> $null
  if ($LASTEXITCODE -ne 0) {
    throw "Docker Compose V2 não está disponível. Atualize o Docker Desktop."
  }

  Ok "Docker Compose V2 disponível."
}

function Ensure-BaseDir {
  New-Item -ItemType Directory -Path $script:BaseDir -Force | Out-Null
}

function Ensure-Repo {
  Ensure-BaseDir

  $script:GitExe = Resolve-Git

  if ($script:GitExe) {
    if ((Test-Path -LiteralPath (Join-Path $script:RepoDir '.git')) -and -not $Force) {
      Info "Atualizando repositório oficial do Supabase..."
      Push-Location $script:RepoDir
      try {
        & $script:GitExe fetch --depth 1 origin $Branch *> $null
        & $script:GitExe reset --hard "origin/$Branch" *> $null
      } finally {
        Pop-Location
      }
      Ok "Repositório atualizado."
    } else {
      if (Test-Path -LiteralPath $script:RepoDir) {
        Warn "Recriando cache local do Supabase..."
        Remove-Item -LiteralPath $script:RepoDir -Recurse -Force
      }

      Info "Baixando repositório oficial do Supabase com Git..."
      & $script:GitExe clone --depth 1 --branch $Branch https://github.com/supabase/supabase.git $script:RepoDir
      if ($LASTEXITCODE -ne 0) {
        throw "Falha ao clonar o repositório oficial do Supabase."
      }
      Ok "Repositório baixado."
    }
  } else {
    Warn "Git não encontrado. Usando fallback por ZIP do GitHub."

    if ((Test-Path -LiteralPath (Join-Path $script:RepoDir 'docker\docker-compose.yml')) -and -not $Force) {
      Ok "Cache local do Supabase já existe."
    } else {
      if (Test-Path -LiteralPath $script:RepoDir) {
        Remove-Item -LiteralPath $script:RepoDir -Recurse -Force
      }

      $tmpRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("supabase-repo-" + [guid]::NewGuid().ToString('N'))
      $zipPath = Join-Path $tmpRoot 'supabase.zip'
      $extractPath = Join-Path $tmpRoot 'extract'

      New-Item -ItemType Directory -Path $tmpRoot -Force | Out-Null
      New-Item -ItemType Directory -Path $extractPath -Force | Out-Null

      try {
        $zipUrl = "https://github.com/supabase/supabase/archive/refs/heads/$Branch.zip"
        Info "Baixando ZIP do Supabase..."
        Invoke-WebRequest -Uri $zipUrl -UseBasicParsing -OutFile $zipPath

        Info "Extraindo arquivos..."
        Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force

        $folder = Get-ChildItem -LiteralPath $extractPath -Directory | Select-Object -First 1
        if (-not $folder) {
          throw "ZIP baixado, mas sem pasta extraída."
        }

        Move-Item -LiteralPath $folder.FullName -Destination $script:RepoDir -Force
        Ok "Repositório baixado por ZIP."
      } finally {
        Remove-Item -LiteralPath $tmpRoot -Recurse -Force -ErrorAction SilentlyContinue
      }
    }
  }

  $dockerCompose = Join-Path $script:RepoDir 'docker\docker-compose.yml'
  $envExample = Join-Path $script:RepoDir 'docker\.env.example'

  if (-not (Test-Path -LiteralPath $dockerCompose)) {
    throw "docker-compose.yml não encontrado. A estrutura do Supabase pode ter mudado."
  }

  if (-not (Test-Path -LiteralPath $envExample)) {
    throw ".env.example não encontrado. A estrutura do Supabase pode ter mudado."
  }
}

function New-Slug {
  param([Parameter(Mandatory = $true)][string]$Text)

  $slug = $Text.Trim().ToLowerInvariant()
  $slug = $slug -replace '[^a-z0-9]+', '-'
  $slug = $slug -replace '^-+', ''
  $slug = $slug -replace '-+$', ''

  if ([string]::IsNullOrWhiteSpace($slug)) {
    throw "Nome inválido. Use letras e números, por exemplo: meuapp."
  }

  return $slug
}

function Get-InstanceDir {
  param([Parameter(Mandatory = $true)][string]$InstanceName)
  return (Join-Path $script:BaseDir $InstanceName)
}

function Require-Instance {
  param([string]$InstanceName)

  if ([string]::IsNullOrWhiteSpace($InstanceName)) {
    throw "Informe o nome da instância."
  }

  $slug = New-Slug $InstanceName
  $dir = Get-InstanceDir $slug

  if (-not (Test-Path -LiteralPath $dir)) {
    Fail "Instância não encontrada: $slug"
    Write-Host ''
    List-Instances
    throw "Instância inexistente."
  }

  return $slug
}

function Copy-DirectoryContents {
  param(
    [Parameter(Mandatory = $true)][string]$Source,
    [Parameter(Mandatory = $true)][string]$Destination
  )

  New-Item -ItemType Directory -Path $Destination -Force | Out-Null

  Get-ChildItem -LiteralPath $Source -Force | ForEach-Object {
    $target = Join-Path $Destination $_.Name
    Copy-Item -LiteralPath $_.FullName -Destination $target -Recurse -Force
  }
}

function Read-EnvValue {
  param(
    [Parameter(Mandatory = $true)][string]$File,
    [Parameter(Mandatory = $true)][string]$Key
  )

  if (-not (Test-Path -LiteralPath $File)) {
    return $null
  }

  $pattern = '^\s*' + [regex]::Escape($Key) + '=(.*)$'

  foreach ($line in [System.IO.File]::ReadLines($File)) {
    if ($line -match $pattern) {
      return $Matches[1].Trim().Trim('"')
    }
  }

  return $null
}

function Read-EnvValueAny {
  param(
    [Parameter(Mandatory = $true)][string]$File,
    [Parameter(Mandatory = $true)][string[]]$Keys
  )

  foreach ($key in $Keys) {
    $value = Read-EnvValue -File $File -Key $key
    if (-not [string]::IsNullOrWhiteSpace($value)) {
      return $value
    }
  }

  return $null
}

function Set-EnvValue {
  param(
    [Parameter(Mandatory = $true)][string]$File,
    [Parameter(Mandatory = $true)][string]$Key,
    [Parameter(Mandatory = $true)][AllowEmptyString()][string]$Value
  )

  $lines = @()
  if (Test-Path -LiteralPath $File) {
    $lines = [System.IO.File]::ReadAllLines($File)
  }

  $pattern = '^' + [regex]::Escape($Key) + '='
  $found = $false
  $updated = New-Object System.Collections.Generic.List[string]

  foreach ($line in $lines) {
    if ($line -match $pattern) {
      $updated.Add("$Key=$Value")
      $found = $true
    } else {
      $updated.Add($line)
    }
  }

  if (-not $found) {
    $updated.Add("$Key=$Value")
  }

  Write-Utf8Lines -Path $File -Lines $updated.ToArray()
}

function Test-PortUsed {
  param([Parameter(Mandatory = $true)][int]$Port)

  $client = New-Object System.Net.Sockets.TcpClient

  try {
    $async = $client.BeginConnect('127.0.0.1', $Port, $null, $null)
    $connected = $async.AsyncWaitHandle.WaitOne(250, $false)

    if ($connected) {
      $client.EndConnect($async)
      return $true
    }

    return $false
  } catch {
    return $false
  } finally {
    try { $client.Close() } catch {}
  }
}

function Get-ReservedPorts {
  $ports = New-Object System.Collections.Generic.HashSet[int]

  if (-not (Test-Path -LiteralPath $script:BaseDir)) {
    return @()
  }

  $keys = @(
    'KONG_HTTP_PORT',
    'KONG_HTTPS_PORT',
    'POSTGRES_PORT',
    'POOLER_PROXY_PORT_TRANSACTION'
  )

  Get-ChildItem -LiteralPath $script:BaseDir -Directory -Force -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.Name -eq '_supabase_repo') {
      return
    }

    $envFile = Join-Path $_.FullName '.env'
    if (-not (Test-Path -LiteralPath $envFile)) {
      return
    }

    foreach ($key in $keys) {
      $raw = Read-EnvValue -File $envFile -Key $key
      $port = 0
      if ([int]::TryParse($raw, [ref]$port)) {
        [void]$ports.Add($port)
      }
    }
  }

  return @($ports)
}

function Get-FreePort {
  param(
    [Parameter(Mandatory = $true)][int]$Start,
    [int[]]$Reserved = @()
  )

  $port = $Start

  while ((Test-PortUsed -Port $port) -or ($Reserved -contains $port)) {
    $port++
  }

  return $port
}

function Patch-DockerComposeContainerNames {
  param([Parameter(Mandatory = $true)][string]$File)

  $text = [System.IO.File]::ReadAllText($File)

  if ($text.Contains('${INSTANCE_NAME}-')) {
    Ok "docker-compose.yml já está com containers isolados."
    return
  }

  Copy-Item -LiteralPath $File -Destination "$File.original" -Force

  $patched = [regex]::Replace(
    $text,
    '(?m)^(\s*)container_name:\s*"?([^"#\r\n]+)"?\s*$',
    {
      param($m)

      $indent = $m.Groups[1].Value
      $value = $m.Groups[2].Value.Trim()

      if ($value.StartsWith('${INSTANCE_NAME}-')) {
        return $m.Value
      }

      return $indent + 'container_name: "${INSTANCE_NAME}-' + $value + '"'
    }
  )

  Write-Utf8Text -Path $File -Text $patched
  Ok "docker-compose.yml ajustado para múltiplas instâncias."
}

function Enable-NewAuthComposeVariables {
  param([Parameter(Mandatory = $true)][string]$File)

  if (-not (Test-Path -LiteralPath $File)) {
    return
  }

  $text = [System.IO.File]::ReadAllText($File)

  $text = [regex]::Replace($text, '(?m)^(\s*)#\s*(GOTRUE_JWT_KEYS:\s*\$\{JWT_KEYS:-\[\]\})', '$1$2')
  $text = [regex]::Replace($text, '(?m)^(\s*)#\s*(API_JWT_JWKS:\s*\$\{JWT_JWKS:-\{"keys":\[\]\}\})', '$1$2')
  $text = [regex]::Replace($text, '(?m)^(\s*)#\s*(JWT_JWKS:\s*\$\{JWT_JWKS:-\{"keys":\[\]\}\})', '$1$2')

  Write-Utf8Text -Path $File -Text $text
}

function New-RandomBytes {
  param([Parameter(Mandatory = $true)][int]$Count)

  $bytes = New-Object byte[] $Count
  $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()

  try {
    $rng.GetBytes($bytes)
  } finally {
    $rng.Dispose()
  }

  return $bytes
}

function ConvertTo-Base64Url {
  param([Parameter(Mandatory = $true)]$Value)

  if ($Value -is [string]) {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Value)
  } else {
    $bytes = [byte[]]$Value
  }

  return ([Convert]::ToBase64String($bytes)).TrimEnd('=').Replace('+', '-').Replace('/', '_')
}

function New-RandomHex {
  param([Parameter(Mandatory = $true)][int]$Bytes)

  return ([BitConverter]::ToString((New-RandomBytes -Count $Bytes)) -replace '-', '').ToLowerInvariant()
}

function New-RandomBase64 {
  param([Parameter(Mandatory = $true)][int]$Bytes)

  return [Convert]::ToBase64String((New-RandomBytes -Count $Bytes))
}

function New-Hs256Jwt {
  param(
    [Parameter(Mandatory = $true)][string]$Role,
    [Parameter(Mandatory = $true)][string]$JwtSecret
  )

  $header = '{"alg":"HS256","typ":"JWT"}'
  $iat = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
  $exp = $iat + (5 * 365 * 24 * 3600)

  $payload = '{"role":"' + $Role + '","iss":"supabase","iat":' + $iat + ',"exp":' + $exp + '}'

  $encodedHeader = ConvertTo-Base64Url $header
  $encodedPayload = ConvertTo-Base64Url $payload
  $signedContent = "$encodedHeader.$encodedPayload"

  $hmac = New-Object System.Security.Cryptography.HMACSHA256
  try {
    $hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($JwtSecret)
    $signatureBytes = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($signedContent))
  } finally {
    $hmac.Dispose()
  }

  $encodedSignature = ConvertTo-Base64Url $signatureBytes

  return "$signedContent.$encodedSignature"
}

function Get-KeyValueMapFromLines {
  param([Parameter(Mandatory = $true)][string[]]$Lines)

  $map = @{}

  foreach ($line in $Lines) {
    if ($line -match '^([A-Z0-9_]+)=(.*)$') {
      $map[$Matches[1]] = $Matches[2]
    }
  }

  return $map
}

function New-AsymmetricAuthKeys {
  param([Parameter(Mandatory = $true)][string]$JwtSecret)

  Info "Gerando chaves novas de Auth com node:22-alpine..."

  & $script:DockerExe image inspect node:22-alpine *> $null
  if ($LASTEXITCODE -ne 0) {
    & $script:DockerExe pull node:22-alpine
    if ($LASTEXITCODE -ne 0) {
      throw "Não foi possível baixar node:22-alpine para gerar chaves de Auth."
    }
  }

  $js = @'
const crypto = require("crypto");

const jwtSecret = process.argv[1];

const { privateKey } = crypto.generateKeyPairSync("ec", { namedCurve: "P-256" });
const jwkPrivate = privateKey.export({ format: "jwk" });
const kid = crypto.randomUUID();

const octKey = {
  kty: "oct",
  k: Buffer.from(jwtSecret).toString("base64url"),
  alg: "HS256"
};

const jwksKeypair = {
  keys: [
    {
      kty: "EC",
      kid,
      use: "sig",
      key_ops: ["sign", "verify"],
      alg: "ES256",
      ext: true,
      crv: jwkPrivate.crv,
      x: jwkPrivate.x,
      y: jwkPrivate.y,
      d: jwkPrivate.d
    },
    octKey
  ]
};

const jwksPublic = {
  keys: [
    {
      kty: "EC",
      kid,
      use: "sig",
      key_ops: ["verify"],
      alg: "ES256",
      ext: true,
      crv: jwkPrivate.crv,
      x: jwkPrivate.x,
      y: jwkPrivate.y
    },
    octKey
  ]
};

function signES256(payload) {
  const header = { alg: "ES256", typ: "JWT", kid };
  const b64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
  const b64Payload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const data = b64Header + "." + b64Payload;
  const sig = crypto
    .sign("SHA256", Buffer.from(data), { key: privateKey, dsaEncoding: "ieee-p1363" })
    .toString("base64url");

  return data + "." + sig;
}

const iat = Math.floor(Date.now() / 1000);
const exp = iat + 5 * 365 * 24 * 3600;
const anonJwt = signES256({ role: "anon", iss: "supabase", iat, exp });
const serviceJwt = signES256({ role: "service_role", iss: "supabase", iat, exp });

const PROJECT_REF = "supabase-self-hosted";

function generateOpaqueKey(prefix) {
  const random = crypto.randomBytes(17).toString("base64url").slice(0, 22);
  const intermediate = prefix + random;
  const checksum = crypto
    .createHash("sha256")
    .update(PROJECT_REF + "|" + intermediate)
    .digest("base64url")
    .slice(0, 8);

  return intermediate + "_" + checksum;
}

console.log("SUPABASE_PUBLISHABLE_KEY=" + generateOpaqueKey("sb_publishable_"));
console.log("SUPABASE_SECRET_KEY=" + generateOpaqueKey("sb_secret_"));
console.log("ANON_KEY_ASYMMETRIC=" + anonJwt);
console.log("SERVICE_ROLE_KEY_ASYMMETRIC=" + serviceJwt);
console.log("JWT_KEYS=" + JSON.stringify(jwksKeypair.keys));
console.log("JWT_JWKS=" + JSON.stringify(jwksPublic));
'@

  $output = & $script:DockerExe run --rm node:22-alpine node -e $js $JwtSecret

  if ($LASTEXITCODE -ne 0) {
    throw "Falha ao gerar chaves novas de Auth."
  }

  $map = Get-KeyValueMapFromLines -Lines @($output)

  $required = @(
    'SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_SECRET_KEY',
    'ANON_KEY_ASYMMETRIC',
    'SERVICE_ROLE_KEY_ASYMMETRIC',
    'JWT_KEYS',
    'JWT_JWKS'
  )

  foreach ($key in $required) {
    if (-not $map.ContainsKey($key)) {
      throw "Geração de Auth incompleta. Chave ausente: $key"
    }
  }

  return $map
}

function Generate-Secrets {
  param([Parameter(Mandatory = $true)][string]$EnvFile)

  Info "Gerando secrets novos para esta instalação..."

  $jwtSecret = New-RandomBase64 -Bytes 30

  $secrets = @{
    JWT_SECRET = $jwtSecret
    ANON_KEY = (New-Hs256Jwt -Role 'anon' -JwtSecret $jwtSecret)
    SERVICE_ROLE_KEY = (New-Hs256Jwt -Role 'service_role' -JwtSecret $jwtSecret)
    SECRET_KEY_BASE = (New-RandomBase64 -Bytes 48)
    VAULT_ENC_KEY = (New-RandomHex -Bytes 16)
    PG_META_CRYPTO_KEY = (New-RandomBase64 -Bytes 24)
    LOGFLARE_PUBLIC_ACCESS_TOKEN = (New-RandomBase64 -Bytes 24)
    LOGFLARE_PRIVATE_ACCESS_TOKEN = (New-RandomBase64 -Bytes 24)
    S3_PROTOCOL_ACCESS_KEY_ID = (New-RandomHex -Bytes 16)
    S3_PROTOCOL_ACCESS_KEY_SECRET = (New-RandomHex -Bytes 32)
    MINIO_ROOT_PASSWORD = (New-RandomHex -Bytes 16)
    POSTGRES_PASSWORD = (New-RandomHex -Bytes 16)
    DASHBOARD_PASSWORD = (New-RandomHex -Bytes 16)
  }

  foreach ($key in $secrets.Keys) {
    Set-EnvValue -File $EnvFile -Key $key -Value $secrets[$key]
  }

  $newAuth = New-AsymmetricAuthKeys -JwtSecret $jwtSecret

  foreach ($key in $newAuth.Keys) {
    Set-EnvValue -File $EnvFile -Key $key -Value $newAuth[$key]
  }

  Ok "Secrets gerados e gravados no .env."
}

function Invoke-Compose {
  param(
    [Parameter(Mandatory = $true)][string]$InstanceName,
    [Parameter(Mandatory = $true)][string[]]$ComposeArgs,
    [switch]$AllowFailure
  )

  $dir = Get-InstanceDir $InstanceName

  Push-Location $dir
  try {
    & $script:DockerExe compose -p $InstanceName @ComposeArgs
    $code = $LASTEXITCODE
  } finally {
    Pop-Location
  }

  if (($code -ne 0) -and (-not $AllowFailure)) {
    throw "docker compose falhou com código $code."
  }

  return $code
}

function Get-ComposeStatus {
  param([Parameter(Mandatory = $true)][string]$InstanceName)

  $dir = Get-InstanceDir $InstanceName
  $items = @()

  Push-Location $dir
  try {
    $raw = & $script:DockerExe compose -p $InstanceName ps --format json 2>$null

    if ($LASTEXITCODE -ne 0 -or -not $raw) {
      return @()
    }

    foreach ($line in @($raw)) {
      if ([string]::IsNullOrWhiteSpace($line)) {
        continue
      }

      try {
        $parsed = $line | ConvertFrom-Json
        $items += $parsed
      } catch {
        # Alguns builds podem devolver JSON em formato diferente.
      }
    }
  } finally {
    Pop-Location
  }

  return $items
}

function Wait-Health {
  param([Parameter(Mandatory = $true)][string]$InstanceName)

  Info "Aguardando serviços iniciarem..."

  for ($i = 1; $i -le 90; $i++) {
    $items = @(Get-ComposeStatus -InstanceName $InstanceName)

    if ($items.Count -gt 0) {
      $unhealthy = @($items | Where-Object { "$($_.Health)" -eq 'unhealthy' })
      if ($unhealthy.Count -gt 0) {
        Warn "Algum container ficou unhealthy."
        Invoke-Compose -InstanceName $InstanceName -ComposeArgs @('ps') -AllowFailure | Out-Null
        Write-Host ''
        Warn "Últimos logs do Auth:"
        Invoke-Compose -InstanceName $InstanceName -ComposeArgs @('logs','auth','--tail','120') -AllowFailure | Out-Null
        throw "Serviço unhealthy."
      }

      $notRunning = @($items | Where-Object { "$($_.State)" -notin @('running', 'exited') })
      $startingHealth = @($items | Where-Object { "$($_.Health)" -eq 'starting' })

      if (($notRunning.Count -eq 0) -and ($startingHealth.Count -eq 0)) {
        Ok "Serviços iniciados."
        return
      }
    }

    Start-Sleep -Seconds 2
  }

  Warn "Tempo de espera atingido. Mostrando status atual:"
  Invoke-Compose -InstanceName $InstanceName -ComposeArgs @('ps') -AllowFailure | Out-Null
}

function Show-Access {
  param([Parameter(Mandatory = $true)][string]$InstanceName)

  $dir = Get-InstanceDir $InstanceName
  $envFile = Join-Path $dir '.env'

  $studioUrl = Read-EnvValue -File $envFile -Key 'SUPABASE_PUBLIC_URL'
  $dashboardUser = Read-EnvValue -File $envFile -Key 'DASHBOARD_USERNAME'
  $dashboardPass = Read-EnvValue -File $envFile -Key 'DASHBOARD_PASSWORD'
  $publicKey = Read-EnvValueAny -File $envFile -Keys @('SUPABASE_PUBLISHABLE_KEY', 'ANON_KEY')
  $secretKey = Read-EnvValueAny -File $envFile -Keys @('SUPABASE_SECRET_KEY', 'SERVICE_ROLE_KEY')
  $dbPass = Read-EnvValue -File $envFile -Key 'POSTGRES_PASSWORD'
  $dbPort = Read-EnvValue -File $envFile -Key 'POSTGRES_PORT'
  $poolerPort = Read-EnvValue -File $envFile -Key 'POOLER_PROXY_PORT_TRANSACTION'

  Write-Host ''
  Write-Ui '╔══════════════════════════════════════════════════════╗' Green
  Write-Ui '║                 INSTÂNCIA PRONTA                    ║' Green
  Write-Ui '╚══════════════════════════════════════════════════════╝' Green
  Write-Host ''
  Write-Host ("Nome:               {0}" -f $InstanceName)
  Write-Host ("Pasta:              {0}" -f $dir)
  Write-Host ''
  Write-Host ("Studio:             {0}" -f $studioUrl)
  Write-Host ("Usuário Studio:     {0}" -f ($(if ($dashboardUser) { $dashboardUser } else { 'supabase' })))
  Write-Host ("Senha Studio:       {0}" -f $dashboardPass)
  Write-Host ''
  Write-Host ("Supabase URL:       {0}" -f $studioUrl)
  Write-Host ("Public/Anon Key:    {0}" -f $publicKey)
  Write-Host ("Secret/Service Key: {0}" -f $secretKey)
  Write-Host ''
  Write-Host ("Postgres Host:      localhost")
  Write-Host ("Postgres Port:      {0}" -f $dbPort)
  Write-Host ("Postgres User:      postgres")
  Write-Host ("Postgres Password:  {0}" -f $dbPass)
  Write-Host ("Pooler Port:        {0}" -f $poolerPort)
  Write-Host ''
  Warn "Guarde esses dados. Eles pertencem somente a esta instância."
  Write-Host ''

  Invoke-Compose -InstanceName $InstanceName -ComposeArgs @('ps') -AllowFailure | Out-Null

  if ($OpenStudio -and $studioUrl) {
    Start-Process $studioUrl | Out-Null
  }
}

function Create-Instance {
  param([string]$RawName)

  Ensure-Docker
  Ensure-Repo

  if ([string]::IsNullOrWhiteSpace($RawName)) {
    $RawName = 'supabase-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
  }

  $instanceName = New-Slug $RawName
  $dir = Get-InstanceDir $instanceName

  if (Test-Path -LiteralPath $dir) {
    if ($Force) {
      Warn "Removendo instância existente por causa de -Force: $instanceName"
      Invoke-Compose -InstanceName $instanceName -ComposeArgs @('down','-v','--remove-orphans') -AllowFailure | Out-Null
      Remove-Item -LiteralPath $dir -Recurse -Force
    } else {
      $suffix = Get-Date -Format 'HHmmss'
      Warn "Já existe uma instância chamada '$instanceName'."
      $instanceName = "$instanceName-$suffix"
      $dir = Get-InstanceDir $instanceName
      Warn "Criando nova instância como: $instanceName"
    }
  }

  Print-Title

  Info "Criando instância: $instanceName"
  New-Item -ItemType Directory -Path $dir -Force | Out-Null

  Info "Copiando arquivos Docker do Supabase..."
  Copy-DirectoryContents -Source (Join-Path $script:RepoDir 'docker') -Destination $dir
  Ok "Arquivos copiados."

  $envExample = Join-Path $dir '.env.example'
  $envFile = Join-Path $dir '.env'
  $composeFile = Join-Path $dir 'docker-compose.yml'

  if (-not (Test-Path -LiteralPath $envExample)) {
    throw ".env.example não encontrado na pasta da instância."
  }

  Copy-Item -LiteralPath $envExample -Destination $envFile -Force

  $reserved = @(Get-ReservedPorts)

  $studioPort = Get-FreePort -Start 8000 -Reserved $reserved
  $reserved += $studioPort

  $httpsPort = Get-FreePort -Start 8443 -Reserved $reserved
  $reserved += $httpsPort

  $dbPort = Get-FreePort -Start 54322 -Reserved $reserved
  $reserved += $dbPort

  $poolerPort = Get-FreePort -Start 6543 -Reserved $reserved
  $reserved += $poolerPort

  Set-EnvValue -File $envFile -Key 'INSTANCE_NAME' -Value $instanceName
  Set-EnvValue -File $envFile -Key 'COMPOSE_PROJECT_NAME' -Value $instanceName

  Set-EnvValue -File $envFile -Key 'KONG_HTTP_PORT' -Value ([string]$studioPort)
  Set-EnvValue -File $envFile -Key 'KONG_HTTPS_PORT' -Value ([string]$httpsPort)
  Set-EnvValue -File $envFile -Key 'POSTGRES_PORT' -Value ([string]$dbPort)
  Set-EnvValue -File $envFile -Key 'POOLER_PROXY_PORT_TRANSACTION' -Value ([string]$poolerPort)

  Set-EnvValue -File $envFile -Key 'SUPABASE_PUBLIC_URL' -Value "http://localhost:$studioPort"
  Set-EnvValue -File $envFile -Key 'API_EXTERNAL_URL' -Value "http://localhost:$studioPort"
  Set-EnvValue -File $envFile -Key 'SITE_URL' -Value 'http://localhost:3000'
  Set-EnvValue -File $envFile -Key 'DASHBOARD_USERNAME' -Value 'supabase'

  Patch-DockerComposeContainerNames -File $composeFile
  Enable-NewAuthComposeVariables -File $composeFile
  Generate-Secrets -EnvFile $envFile

  if (-not $NoPull) {
    Info "Baixando imagens Docker..."
    Invoke-Compose -InstanceName $instanceName -ComposeArgs @('pull') | Out-Null
    Ok "Imagens baixadas."
  } else {
    Warn "Pulando docker compose pull por causa de -NoPull."
  }

  Info "Subindo containers..."
  Invoke-Compose -InstanceName $instanceName -ComposeArgs @('up','-d') | Out-Null

  Wait-Health -InstanceName $instanceName
  Show-Access -InstanceName $instanceName
}

function Start-Instance {
  param([string]$RawName)

  Ensure-Docker
  $instanceName = Require-Instance $RawName
  Print-Title
  Info "Subindo instância: $instanceName"
  Invoke-Compose -InstanceName $instanceName -ComposeArgs @('up','-d') | Out-Null
  Wait-Health -InstanceName $instanceName
  Show-Access -InstanceName $instanceName
}

function Stop-Instance {
  param([string]$RawName)

  Ensure-Docker
  $instanceName = Require-Instance $RawName
  Print-Title
  Info "Parando instância: $instanceName"
  Invoke-Compose -InstanceName $instanceName -ComposeArgs @('down') | Out-Null
  Ok "Instância parada."
}

function Restart-Instance {
  param([string]$RawName)

  Ensure-Docker
  $instanceName = Require-Instance $RawName
  Print-Title
  Info "Reiniciando instância: $instanceName"
  Invoke-Compose -InstanceName $instanceName -ComposeArgs @('down') | Out-Null
  Invoke-Compose -InstanceName $instanceName -ComposeArgs @('up','-d') | Out-Null
  Wait-Health -InstanceName $instanceName
  Show-Access -InstanceName $instanceName
}

function Status-Instance {
  param([string]$RawName)

  Ensure-Docker
  $instanceName = Require-Instance $RawName
  Print-Title
  Invoke-Compose -InstanceName $instanceName -ComposeArgs @('ps') | Out-Null
}

function Logs-Instance {
  param(
    [string]$RawName,
    [string]$RawService
  )

  Ensure-Docker
  $instanceName = Require-Instance $RawName
  Print-Title

  $args = @('logs','--tail','180')

  if ($Follow) {
    $args += '-f'
  }

  if (-not [string]::IsNullOrWhiteSpace($RawService)) {
    $args += $RawService
  }

  Invoke-Compose -InstanceName $instanceName -ComposeArgs $args | Out-Null
}

function Secrets-Instance {
  param([string]$RawName)

  Ensure-Docker
  $instanceName = Require-Instance $RawName
  Print-Title
  Show-Access -InstanceName $instanceName
}

function Reset-Instance {
  param([string]$RawName)

  Ensure-Docker
  $instanceName = Require-Instance $RawName
  $dir = Get-InstanceDir $instanceName

  Print-Title
  Warn "Isso vai apagar containers, volumes e dados da instância: $instanceName"
  $confirm = Read-Host 'Digite APAGAR para confirmar'

  if ($confirm -ne 'APAGAR') {
    Warn "Cancelado."
    return
  }

  Info "Removendo containers e volumes..."
  Invoke-Compose -InstanceName $instanceName -ComposeArgs @('down','-v','--remove-orphans') -AllowFailure | Out-Null

  Info "Removendo pasta da instância..."
  Remove-Item -LiteralPath $dir -Recurse -Force

  Ok "Instância removida."
  Write-Host ''
  Info "Criando instalação nova com o mesmo nome..."
  Create-Instance -RawName $instanceName
}

function List-Instances {
  Ensure-BaseDir

  Write-Host ''
  Write-Ui 'Instâncias:' White

  $rows = @()

  Get-ChildItem -LiteralPath $script:BaseDir -Directory -Force -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_.Name -eq '_supabase_repo') {
      return
    }

    $envFile = Join-Path $_.FullName '.env'
    if (-not (Test-Path -LiteralPath $envFile)) {
      return
    }

    $rows += [pscustomobject]@{
      Nome = $_.Name
      Studio = (Read-EnvValue -File $envFile -Key 'SUPABASE_PUBLIC_URL')
      Postgres = ('localhost:' + (Read-EnvValue -File $envFile -Key 'POSTGRES_PORT'))
      Pasta = $_.FullName
    }
  }

  if ($rows.Count -eq 0) {
    Write-Host '  Nenhuma instância encontrada.'
    return
  }

  $rows | Format-Table -AutoSize | Out-String | Write-Host
}

function Clean-Docker {
  Ensure-Docker
  Print-Title
  Warn "Limpeza segura: remove containers parados, networks órfãs, build cache e imagens dangling."
  Warn "Não remove volumes de instâncias ativas."
  $confirm = Read-Host 'Digite LIMPAR para confirmar'

  if ($confirm -ne 'LIMPAR') {
    Warn "Cancelado."
    return
  }

  & $script:DockerExe container prune -f | Out-Host
  & $script:DockerExe network prune -f | Out-Host
  & $script:DockerExe image prune -f | Out-Host
  & $script:DockerExe builder prune -f | Out-Host

  Ok "Limpeza concluída."
}

function Update-Repo {
  Ensure-Docker
  Ensure-Repo
  Ok "Cache do Supabase pronto em: $script:RepoDir"
}

function Doctor {
  Print-Title

  Write-Ui 'Ambiente:' White
  Write-Host ("  Windows:      {0}" -f ([Environment]::OSVersion.VersionString))
  Write-Host ("  PowerShell:   {0}" -f ($PSVersionTable.PSVersion.ToString()))
  Write-Host ("  BaseDir:      {0}" -f $script:BaseDir)
  Write-Host ''

  try {
    $script:DockerExe = Resolve-Docker
    Ok "Docker CLI encontrado: $script:DockerExe"

    & $script:DockerExe --version | Write-Host

    try {
      & $script:DockerExe info *> $null
      if ($LASTEXITCODE -eq 0) {
        Ok "Docker daemon acessível."
      } else {
        Warn "Docker daemon não respondeu."
      }
    } catch {
      Warn "Docker daemon não respondeu."
    }

    & $script:DockerExe compose version | Write-Host
  } catch {
    Fail $_.Exception.Message
  }

  Write-Host ''

  $script:GitExe = Resolve-Git
  if ($script:GitExe) {
    Ok "Git encontrado: $script:GitExe"
    & $script:GitExe --version | Write-Host
  } else {
    Warn "Git não encontrado. O script usará fallback por ZIP."
  }

  Write-Host ''

  Ensure-BaseDir
  $reserved = @(Get-ReservedPorts)
  if ($reserved.Count -gt 0) {
    Info ("Portas já reservadas por instâncias: " + (($reserved | Sort-Object) -join ', '))
  } else {
    Info "Nenhuma porta reservada por instâncias existentes."
  }

  $drive = Get-PSDrive -Name ([System.IO.Path]::GetPathRoot($script:BaseDir).Substring(0,1)) -ErrorAction SilentlyContinue
  if ($drive) {
    $freeGb = [math]::Round($drive.Free / 1GB, 2)
    Info "Espaço livre no disco da pasta base: $freeGb GB"
  }

  List-Instances
}

try {
  switch ($Command.ToLowerInvariant()) {
    { $_ -in @('new','install') } {
      Create-Instance -RawName $Name
      break
    }

    'start' {
      Start-Instance -RawName $Name
      break
    }

    'stop' {
      Stop-Instance -RawName $Name
      break
    }

    'restart' {
      Restart-Instance -RawName $Name
      break
    }

    { $_ -in @('status','ps') } {
      Status-Instance -RawName $Name
      break
    }

    'logs' {
      Logs-Instance -RawName $Name -RawService $Service
      break
    }

    { $_ -in @('secrets','access','acessos') } {
      Secrets-Instance -RawName $Name
      break
    }

    { $_ -in @('reset','reinstall') } {
      Reset-Instance -RawName $Name
      break
    }

    { $_ -in @('list','ls') } {
      Print-Title
      List-Instances
      break
    }

    'clean' {
      Clean-Docker
      break
    }

    'doctor' {
      Doctor
      break
    }

    'update' {
      Update-Repo
      break
    }

    'help' {
      Usage
      break
    }

    default {
      Usage
      break
    }
  }
} catch {
  Write-Host ''
  Fail $_.Exception.Message
  Write-Host ''
  exit 1
}
