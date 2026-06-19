# Supabase Self-Host Manager for Windows
# ASCII-only for Windows PowerShell 5.1 compatibility.

[CmdletBinding()]
param(
  [Parameter(Position = 0)]
  [ValidateSet(
    'new','install',
    'start','stop','restart',
    'status','ps',
    'logs',
    'secrets','access',
    'reset','reinstall',
    'list','ls',
    'clean',
    'doctor',
    'update','upgrade',
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

  [switch]$Follow
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

try {
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
} catch {}

$script:BaseDir = [System.IO.Path]::GetFullPath($BaseDir)
$script:RepoDir = Join-Path $script:BaseDir '_supabase_repo'
$script:DockerExe = $null
$script:GitExe = $null

function Say {
  param(
    [string]$Text,
    [ConsoleColor]$Color = [ConsoleColor]::Gray
  )

  try {
    Write-Host $Text -ForegroundColor $Color
  } catch {
    Write-Host $Text
  }
}

function Title {
  Write-Host ''
  Say '======================================================' Cyan
  Say '              SUPABASE SELF-HOST MANAGER              ' Cyan
  Say '                    Windows 10/11                     ' Cyan
  Say '======================================================' Cyan
  Write-Host ''
}

function Ok { param([string]$Message) Say "[OK] $Message" Green }
function Warn { param([string]$Message) Say "[WARN] $Message" Yellow }
function Info { param([string]$Message) Say "[INFO] $Message" Blue }
function Fail { param([string]$Message) Say "[ERROR] $Message" Red }

function Usage {
  Title
  @"
Usage:

  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 doctor
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 new [name]
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 start <name>
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 stop <name>
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 restart <name>
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 status <name>
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 logs <name> [service] [-Follow]
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 secrets <name>
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 upgrade <name>
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 reset <name>
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 list
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 clean
  powershell -ExecutionPolicy Bypass -File .\supabase-stack.ps1 update

  upgrade <name>
    Update instance Docker files/images without deleting volumes, .env or secrets.

Examples:

  .\supabase-stack.ps1 new meuapp
  .\supabase-stack.ps1 logs meuapp auth
  .\supabase-stack.ps1 secrets meuapp

Default folder:

  $script:BaseDir

"@ | Write-Host
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

  throw 'Docker CLI not found. Install Docker Desktop and open a new terminal.'
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

function Invoke-Native {
  param(
    [Parameter(Mandatory = $true)][string]$FilePath,
    [Parameter(Mandatory = $true)][string[]]$Arguments,
    [switch]$Quiet,
    [switch]$AllowFailure
  )

  $oldPreference = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  $output = @()
  $code = 0

  try {
    $output = @(& $FilePath @Arguments 2>&1)
    $code = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $oldPreference
  }

  $script:LastNativeExitCode = $code

  if (-not $Quiet -and $output) {
    $output | ForEach-Object { Write-Host $_ }
  }

  if (($code -ne 0) -and (-not $AllowFailure)) {
    $message = "Command failed with exit code $code`: $FilePath $($Arguments -join ' ')"
    if ($output) {
      $tail = ($output | Select-Object -Last 20) -join [Environment]::NewLine
      $message = "$message`n$tail"
    }
    throw $message
  }

  return $output
}

function Start-DockerDesktopIfNeeded {
  $desktop = Join-Path $env:ProgramFiles 'Docker\Docker\Docker Desktop.exe'

  if (Test-Path -LiteralPath $desktop) {
    Info 'Docker is installed, but the daemon did not answer. Opening Docker Desktop...'
    Start-Process -FilePath $desktop | Out-Null
    return
  }

  Warn 'Docker Desktop was not found in the default path. Open Docker Desktop manually.'
}

function Ensure-Docker {
  $script:DockerExe = Resolve-Docker

  Invoke-Native -FilePath $script:DockerExe -Arguments @('info') -Quiet -AllowFailure | Out-Null
  if ($script:LastNativeExitCode -eq 0) {
    Ok 'Docker is installed and accessible.'
  } else {
    Start-DockerDesktopIfNeeded

    for ($i = 1; $i -le 90; $i++) {
      Start-Sleep -Seconds 2
      Invoke-Native -FilePath $script:DockerExe -Arguments @('info') -Quiet -AllowFailure | Out-Null
      if ($script:LastNativeExitCode -eq 0) {
        Ok 'Docker Desktop is accessible.'
        break
      }

      if ($i -eq 90) {
        throw 'Docker Desktop is not running or not accessible. Open Docker Desktop and try again.'
      }
    }
  }

  Invoke-Native -FilePath $script:DockerExe -Arguments @('compose','version') -Quiet | Out-Null

  Ok 'Docker Compose V2 is available.'
}

function Ensure-BaseDir {
  New-Item -ItemType Directory -Path $script:BaseDir -Force | Out-Null
}

function Ensure-Repo {
  Ensure-BaseDir
  $script:GitExe = Resolve-Git

  if ($script:GitExe) {
    $cloneRequired = $Force -or -not (Test-Path -LiteralPath (Join-Path $script:RepoDir '.git'))

    if (-not $cloneRequired) {
      Info 'Updating official Supabase repository cache...'
      try {
        Push-Location $script:RepoDir
        try {
          Invoke-Native -FilePath $script:GitExe -Arguments @('remote','set-url','origin','https://github.com/supabase/supabase.git') | Out-Null
          Invoke-Native -FilePath $script:GitExe -Arguments @('fetch','--depth','1','origin',$Branch) | Out-Null
          Invoke-Native -FilePath $script:GitExe -Arguments @('reset','--hard',"origin/$Branch") | Out-Null
        } finally {
          Pop-Location
        }
      } catch {
        Warn 'Repository cache update failed. Cloning a fresh copy...'
        $cloneRequired = $true
      }
    }

    if ($cloneRequired) {
      if (Test-Path -LiteralPath $script:RepoDir) {
        Remove-Item -LiteralPath $script:RepoDir -Recurse -Force
      }

      Info 'Cloning official Supabase repository...'
      Invoke-Native -FilePath $script:GitExe -Arguments @('clone','--depth','1','--branch',$Branch,'https://github.com/supabase/supabase.git',$script:RepoDir) | Out-Null
    }
  } else {
    Warn 'Git not found. Using GitHub ZIP fallback.'

    if ((Test-Path -LiteralPath (Join-Path $script:RepoDir 'docker\docker-compose.yml')) -and -not $Force) {
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
        Info 'Downloading Supabase ZIP...'
        Invoke-WebRequest -Uri $zipUrl -UseBasicParsing -OutFile $zipPath

        Info 'Extracting files...'
        Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force

        $folder = Get-ChildItem -LiteralPath $extractPath -Directory | Select-Object -First 1
        if (-not $folder) {
          throw 'Downloaded ZIP has no extracted folder.'
        }

        Move-Item -LiteralPath $folder.FullName -Destination $script:RepoDir -Force
      } finally {
        Remove-Item -LiteralPath $tmpRoot -Recurse -Force -ErrorAction SilentlyContinue
      }
    }
  }

  if (-not (Test-Path -LiteralPath (Join-Path $script:RepoDir 'docker\docker-compose.yml'))) {
    throw 'docker-compose.yml was not found. Supabase repository structure may have changed.'
  }

  if (-not (Test-Path -LiteralPath (Join-Path $script:RepoDir 'docker\.env.example'))) {
    throw '.env.example was not found. Supabase repository structure may have changed.'
  }

  Ok 'Repository cache ready.'
}

function New-Slug {
  param([string]$Text)

  $slug = $Text.Trim().ToLowerInvariant()
  $slug = $slug -replace '[^a-z0-9]+', '-'
  $slug = $slug -replace '^-+', ''
  $slug = $slug -replace '-+$', ''

  if ([string]::IsNullOrWhiteSpace($slug)) {
    throw 'Invalid name. Use letters and numbers, for example: meuapp.'
  }

  return $slug
}

function Get-InstanceDir {
  param([string]$InstanceName)
  return (Join-Path $script:BaseDir $InstanceName)
}

function Require-Instance {
  param([string]$InstanceName)

  if ([string]::IsNullOrWhiteSpace($InstanceName)) {
    throw 'Inform the instance name.'
  }

  $slug = New-Slug $InstanceName
  $dir = Get-InstanceDir $slug

  if (-not (Test-Path -LiteralPath $dir)) {
    Fail "Instance not found: $slug"
    List-Instances
    throw 'Instance does not exist.'
  }

  return $slug
}

function Copy-DirectoryContents {
  param(
    [string]$Source,
    [string]$Destination
  )

  New-Item -ItemType Directory -Path $Destination -Force | Out-Null

  Get-ChildItem -LiteralPath $Source -Force | ForEach-Object {
    $target = Join-Path $Destination $_.Name
    if ($_.PSIsContainer) {
      Copy-DirectoryContents -Source $_.FullName -Destination $target
    } else {
      Copy-Item -LiteralPath $_.FullName -Destination $target -Force
    }
  }
}

function Read-EnvValue {
  param(
    [string]$File,
    [string]$Key
  )

  if (-not (Test-Path -LiteralPath $File)) {
    return $null
  }

  $pattern = '^\s*' + [regex]::Escape($Key) + '=(.*)$'

  foreach ($line in [System.IO.File]::ReadAllLines($File)) {
    if ($line -match $pattern) {
      return $Matches[1].Trim().Trim('"')
    }
  }

  return $null
}

function Read-EnvValueAny {
  param(
    [string]$File,
    [string[]]$Keys
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
    [string]$File,
    [string]$Key,
    [string]$Value
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

  [System.IO.File]::WriteAllLines($File, $updated.ToArray(), [System.Text.Encoding]::ASCII)
}

function Test-PortUsed {
  param([int]$Port)

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

function Get-FreePort {
  param([int]$Start)

  $port = $Start
  while (Test-PortUsed -Port $port) {
    $port++
  }

  return $port
}

function Patch-DockerComposeContainerNames {
  param(
    [string]$File,
    [switch]$SkipOriginalBackup
  )

  $text = [System.IO.File]::ReadAllText($File)

  if ($text.Contains('${INSTANCE_NAME}-')) {
    Ok 'docker-compose.yml already has isolated container names.'
    return
  }

  if (-not $SkipOriginalBackup) {
    Copy-Item -LiteralPath $File -Destination "$File.original" -Force
  }

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

  [System.IO.File]::WriteAllText($File, $patched, [System.Text.Encoding]::ASCII)
  Ok 'docker-compose.yml patched for multiple instances.'
}

function New-RandomBytes {
  param([int]$Count)

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
  param($Value)

  if ($Value -is [string]) {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Value)
  } else {
    $bytes = [byte[]]$Value
  }

  return ([Convert]::ToBase64String($bytes)).TrimEnd('=').Replace('+', '-').Replace('/', '_')
}

function New-RandomHex {
  param([int]$Bytes)
  return ([BitConverter]::ToString((New-RandomBytes -Count $Bytes)) -replace '-', '').ToLowerInvariant()
}

function New-RandomBase64 {
  param([int]$Bytes)
  return [Convert]::ToBase64String((New-RandomBytes -Count $Bytes))
}

function New-Hs256Jwt {
  param(
    [string]$Role,
    [string]$JwtSecret
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

function Generate-Secrets {
  param([string]$EnvFile)

  Info 'Generating instance secrets...'

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

  if (-not (Read-EnvValue -File $EnvFile -Key 'SUPABASE_PUBLISHABLE_KEY')) {
    Set-EnvValue -File $EnvFile -Key 'SUPABASE_PUBLISHABLE_KEY' -Value ('sb_publishable_' + (New-RandomHex -Bytes 16))
  }

  if (-not (Read-EnvValue -File $EnvFile -Key 'SUPABASE_SECRET_KEY')) {
    Set-EnvValue -File $EnvFile -Key 'SUPABASE_SECRET_KEY' -Value ('sb_secret_' + (New-RandomHex -Bytes 24))
  }

  Ok 'Secrets generated.'
}

function Invoke-Compose {
  param(
    [string]$InstanceName,
    [string[]]$ComposeArgs,
    [switch]$AllowFailure
  )

  $dir = Get-InstanceDir $InstanceName
  $arguments = @('compose','-p',$InstanceName) + $ComposeArgs

  Push-Location $dir
  try {
    if ($AllowFailure) {
      Invoke-Native -FilePath $script:DockerExe -Arguments $arguments -AllowFailure | Out-Null
    } else {
      Invoke-Native -FilePath $script:DockerExe -Arguments $arguments | Out-Null
    }
  } finally {
    Pop-Location
  }

  return $script:LastNativeExitCode
}

function Wait-Health {
  param([string]$InstanceName)

  Info 'Waiting for services to start...'

  for ($i = 1; $i -le 60; $i++) {
    $dir = Get-InstanceDir $InstanceName
    Push-Location $dir
    try {
      $output = Invoke-Native -FilePath $script:DockerExe -Arguments @('compose','-p',$InstanceName,'ps') -Quiet -AllowFailure
      $output = $output -join [Environment]::NewLine
    } finally {
      Pop-Location
    }

    if ($output -match 'unhealthy') {
      Warn 'Some container became unhealthy.'
      Invoke-Compose -InstanceName $InstanceName -ComposeArgs @('ps') -AllowFailure | Out-Null
      Invoke-Compose -InstanceName $InstanceName -ComposeArgs @('logs','auth','--tail','120') -AllowFailure | Out-Null
      throw 'Service unhealthy.'
    }

    if ($output -match 'healthy' -or $output -match 'Up') {
      Start-Sleep -Seconds 2
      Ok 'Services started.'
      return
    }

    Start-Sleep -Seconds 2
  }

  Warn 'Wait timeout reached. Current status:'
  Invoke-Compose -InstanceName $InstanceName -ComposeArgs @('ps') -AllowFailure | Out-Null
}

function Show-Access {
  param([string]$InstanceName)

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
  Say '======================================================' Green
  Say '                    INSTANCE READY                    ' Green
  Say '======================================================' Green
  Write-Host ''
  Write-Host ("Name:               {0}" -f $InstanceName)
  Write-Host ("Folder:             {0}" -f $dir)
  Write-Host ''
  Write-Host ("Studio:             {0}" -f $studioUrl)
  Write-Host ("Studio user:        {0}" -f ($(if ($dashboardUser) { $dashboardUser } else { 'supabase' })))
  Write-Host ("Studio password:    {0}" -f $dashboardPass)
  Write-Host ''
  Write-Host ("Supabase URL:       {0}" -f $studioUrl)
  Write-Host ("Public/Anon key:    {0}" -f $publicKey)
  Write-Host ("Secret/Service key: {0}" -f $secretKey)
  Write-Host ''
  Write-Host ("Postgres host:      localhost")
  Write-Host ("Postgres port:      {0}" -f $dbPort)
  Write-Host ("Postgres user:      postgres")
  Write-Host ("Postgres password:  {0}" -f $dbPass)
  Write-Host ("Pooler port:        {0}" -f $poolerPort)
  Write-Host ''
  Warn 'Save these values. They belong only to this instance.'
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
      Warn "Removing existing instance because -Force was used: $instanceName"
      Invoke-Compose -InstanceName $instanceName -ComposeArgs @('down','-v','--remove-orphans') -AllowFailure | Out-Null
      Remove-Item -LiteralPath $dir -Recurse -Force
    } else {
      $suffix = Get-Date -Format 'HHmmss'
      Warn "Instance already exists: $instanceName"
      $instanceName = "$instanceName-$suffix"
      $dir = Get-InstanceDir $instanceName
      Warn "Creating new instance as: $instanceName"
    }
  }

  Title
  Info "Creating instance: $instanceName"
  New-Item -ItemType Directory -Path $dir -Force | Out-Null

  Info 'Copying Supabase Docker files...'
  Copy-DirectoryContents -Source (Join-Path $script:RepoDir 'docker') -Destination $dir
  Ok 'Files copied.'

  $envExample = Join-Path $dir '.env.example'
  $envFile = Join-Path $dir '.env'
  $composeFile = Join-Path $dir 'docker-compose.yml'

  if (-not (Test-Path -LiteralPath $envExample)) {
    throw '.env.example not found in instance folder.'
  }

  Copy-Item -LiteralPath $envExample -Destination $envFile -Force

  $studioPort = Get-FreePort -Start 8000
  $httpsPort = Get-FreePort -Start 8443
  $dbPort = Get-FreePort -Start 54322
  $poolerPort = Get-FreePort -Start 6543

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
  Generate-Secrets -EnvFile $envFile

  if (-not $NoPull) {
    Info 'Pulling Docker images...'
    Invoke-Compose -InstanceName $instanceName -ComposeArgs @('pull') | Out-Null
    Ok 'Docker images pulled.'
  }

  Info 'Starting containers...'
  Invoke-Compose -InstanceName $instanceName -ComposeArgs @('up','-d') | Out-Null

  Wait-Health -InstanceName $instanceName
  Show-Access -InstanceName $instanceName
}

function Upgrade-Instance {
  param([string]$RawName)

  Ensure-Docker
  $instanceName = Require-Instance $RawName
  $dir = Get-InstanceDir $instanceName
  $envFile = Join-Path $dir '.env'
  $volumesDir = Join-Path $dir 'volumes'
  $composeFile = Join-Path $dir 'docker-compose.yml'

  if (-not (Test-Path -LiteralPath $envFile)) {
    throw "Instance .env file not found: $envFile"
  }

  if (-not (Test-Path -LiteralPath $composeFile)) {
    throw "Instance docker-compose.yml not found: $composeFile"
  }

  Ensure-Repo

  Title
  Info "Updating instance without data loss: $instanceName"

  $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  $backupFile = "$composeFile.backup-$timestamp"
  Copy-Item -LiteralPath $composeFile -Destination $backupFile -Force
  Ok "Compose backup created: $backupFile"

  $sourceDir = Join-Path $script:RepoDir 'docker'
  Info 'Copying updated Docker files...'

  Get-ChildItem -LiteralPath $sourceDir -Force | ForEach-Object {
    if ($_.Name -in @('.env','volumes')) {
      return
    }

    $target = Join-Path $dir $_.Name
    if ($_.PSIsContainer) {
      Copy-DirectoryContents -Source $_.FullName -Destination $target
    } else {
      Copy-Item -LiteralPath $_.FullName -Destination $target -Force
    }
  }

  if (-not (Test-Path -LiteralPath $envFile)) {
    throw 'Upgrade stopped because the instance .env file was not preserved.'
  }

  if ((Test-Path -LiteralPath $volumesDir) -and -not (Test-Path -LiteralPath $volumesDir -PathType Container)) {
    throw 'Upgrade stopped because the instance volumes path is invalid.'
  }

  Patch-DockerComposeContainerNames -File $composeFile -SkipOriginalBackup
  Ok 'Docker files updated. Existing .env and volumes were preserved.'

  Info 'Pulling Docker images...'
  Invoke-Compose -InstanceName $instanceName -ComposeArgs @('pull') | Out-Null
  Ok 'Docker images pulled.'

  Info 'Applying updated stack...'
  Invoke-Compose -InstanceName $instanceName -ComposeArgs @('up','-d') | Out-Null
  Wait-Health -InstanceName $instanceName
  Show-Access -InstanceName $instanceName
}

function Start-Instance {
  param([string]$RawName)

  Ensure-Docker
  $instanceName = Require-Instance $RawName
  Title
  Info "Starting instance: $instanceName"
  Invoke-Compose -InstanceName $instanceName -ComposeArgs @('up','-d') | Out-Null
  Wait-Health -InstanceName $instanceName
  Show-Access -InstanceName $instanceName
}

function Stop-Instance {
  param([string]$RawName)

  Ensure-Docker
  $instanceName = Require-Instance $RawName
  Title
  Info "Stopping instance: $instanceName"
  Invoke-Compose -InstanceName $instanceName -ComposeArgs @('down') | Out-Null
  Ok 'Instance stopped.'
}

function Restart-Instance {
  param([string]$RawName)

  Ensure-Docker
  $instanceName = Require-Instance $RawName
  Title
  Info "Restarting instance: $instanceName"
  Invoke-Compose -InstanceName $instanceName -ComposeArgs @('down') | Out-Null
  Invoke-Compose -InstanceName $instanceName -ComposeArgs @('up','-d') | Out-Null
  Wait-Health -InstanceName $instanceName
  Show-Access -InstanceName $instanceName
}

function Status-Instance {
  param([string]$RawName)

  Ensure-Docker
  $instanceName = Require-Instance $RawName
  Title
  Invoke-Compose -InstanceName $instanceName -ComposeArgs @('ps') | Out-Null
}

function Logs-Instance {
  param(
    [string]$RawName,
    [string]$RawService
  )

  Ensure-Docker
  $instanceName = Require-Instance $RawName
  Title

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
  Title
  Show-Access -InstanceName $instanceName
}

function Reset-Instance {
  param([string]$RawName)

  Ensure-Docker
  $instanceName = Require-Instance $RawName
  $dir = Get-InstanceDir $instanceName

  Title
  Warn "This will delete containers, volumes and data for instance: $instanceName"
  $confirm = Read-Host 'Type DELETE to confirm'

  if ($confirm -ne 'DELETE') {
    Warn 'Canceled.'
    return
  }

  Info 'Removing containers and volumes...'
  Invoke-Compose -InstanceName $instanceName -ComposeArgs @('down','-v','--remove-orphans') -AllowFailure | Out-Null

  Info 'Removing instance folder...'
  Remove-Item -LiteralPath $dir -Recurse -Force

  Ok 'Instance removed.'
  Write-Host ''
  Info 'Creating a fresh install with the same name...'
  Create-Instance -RawName $instanceName
}

function List-Instances {
  Ensure-BaseDir

  Write-Host ''
  Say 'Instances:' White

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
      Name = $_.Name
      Studio = (Read-EnvValue -File $envFile -Key 'SUPABASE_PUBLIC_URL')
      Postgres = ('localhost:' + (Read-EnvValue -File $envFile -Key 'POSTGRES_PORT'))
      Folder = $_.FullName
    }
  }

  if ($rows.Count -eq 0) {
    Write-Host '  No instances found.'
    return
  }

  $rows | Format-Table -AutoSize | Out-String | Write-Host
}

function Clean-Docker {
  Ensure-Docker
  Title
  Warn 'Safe cleanup: removes stopped containers, orphan networks, build cache and dangling images.'
  Warn 'It does not remove active instance volumes.'
  $confirm = Read-Host 'Type CLEAN to confirm'

  if ($confirm -ne 'CLEAN') {
    Warn 'Canceled.'
    return
  }

  Invoke-Native -FilePath $script:DockerExe -Arguments @('container','prune','-f') | Out-Null
  Invoke-Native -FilePath $script:DockerExe -Arguments @('network','prune','-f') | Out-Null
  Invoke-Native -FilePath $script:DockerExe -Arguments @('image','prune','-f') | Out-Null
  Invoke-Native -FilePath $script:DockerExe -Arguments @('builder','prune','-f') | Out-Null

  Ok 'Cleanup completed.'
}

function Update-Repo {
  Ensure-Docker
  Ensure-Repo
  Ok "Supabase cache ready at: $script:RepoDir"
}

function Doctor {
  Title

  Say 'Environment:' White
  Write-Host ("  Windows:      {0}" -f ([Environment]::OSVersion.VersionString))
  Write-Host ("  PowerShell:   {0}" -f ($PSVersionTable.PSVersion.ToString()))
  Write-Host ("  BaseDir:      {0}" -f $script:BaseDir)
  Write-Host ''

  try {
    $script:DockerExe = Resolve-Docker
    Ok "Docker CLI found: $script:DockerExe"

    Invoke-Native -FilePath $script:DockerExe -Arguments @('--version') | Out-Null
    Invoke-Native -FilePath $script:DockerExe -Arguments @('info') -Quiet -AllowFailure | Out-Null
    if ($script:LastNativeExitCode -eq 0) {
      Ok 'Docker daemon accessible.'
    } else {
      Warn 'Docker daemon did not answer.'
    }

    Invoke-Native -FilePath $script:DockerExe -Arguments @('compose','version') -AllowFailure | Out-Null
  } catch {
    Fail $_.Exception.Message
  }

  Write-Host ''

  $script:GitExe = Resolve-Git
  if ($script:GitExe) {
    Ok "Git found: $script:GitExe"
    Invoke-Native -FilePath $script:GitExe -Arguments @('--version') | Out-Null
  } else {
    Warn 'Git not found. ZIP fallback will be used.'
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

    { $_ -in @('secrets','access') } {
      Secrets-Instance -RawName $Name
      break
    }

    { $_ -in @('reset','reinstall') } {
      Reset-Instance -RawName $Name
      break
    }

    { $_ -in @('list','ls') } {
      Title
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

    'upgrade' {
      Upgrade-Instance -RawName $Name
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
