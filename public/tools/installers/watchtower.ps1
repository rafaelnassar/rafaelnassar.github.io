# Installer: Watchtower
$ErrorActionPreference = 'Stop'

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

Clear-Host
Write-Host ''
Say '======================================================' Cyan
Say '                    WATCHTOWER                        ' Cyan
Say '======================================================' Cyan
Write-Host ''

$docker = Get-Command docker -ErrorAction SilentlyContinue
if (-not $docker) {
  throw 'Docker was not found in PATH. Install/open Docker Desktop.'
}

docker info *> $null
if ($LASTEXITCODE -ne 0) {
  throw 'Docker Desktop is not running or is not accessible.'
}

$existing = docker ps -a --filter "name=^/watchtower$" --format "{{.Names}}"
if ($existing -eq 'watchtower') {
  Say 'Watchtower container already exists.' Yellow
  docker ps -a --filter "name=^/watchtower$"
  return
}

Say 'Recommended mode: monitor only. It will not auto-update containers.' Yellow
$auto = Read-Host 'Auto-update containers? [y/N]'

if ($auto -match '^[yY]') {
  $args = @(
    'run','-d',
    '--name','watchtower',
    '--restart','always',
    '-v','/var/run/docker.sock:/var/run/docker.sock',
    'containrrr/watchtower',
    '--cleanup',
    '--interval','86400'
  )
} else {
  $args = @(
    'run','-d',
    '--name','watchtower',
    '--restart','always',
    '-v','/var/run/docker.sock:/var/run/docker.sock',
    'containrrr/watchtower',
    '--monitor-only',
    '--interval','86400'
  )
}

Say 'Starting Watchtower...' Blue
docker @args | Out-Host

Write-Host ''
Say 'Watchtower configured.' Green
Write-Host ''
