# Installer: Portainer CE
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
Say '                    PORTAINER CE                      ' Cyan
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

$existing = docker ps -a --filter "name=^/portainer$" --format "{{.Names}}"
if ($existing -eq 'portainer') {
  Say 'Portainer container already exists.' Yellow
  docker ps -a --filter "name=^/portainer$"
  return
}

$port = Read-Host 'Portainer port [9000]'
if ([string]::IsNullOrWhiteSpace($port)) {
  $port = '9000'
}

Say 'Creating volume portainer_data...' Blue
docker volume create portainer_data | Out-Host

Say 'Starting Portainer...' Blue
docker run -d `
  --name portainer `
  --restart=always `
  -p "${port}:9000" `
  -v /var/run/docker.sock:/var/run/docker.sock `
  -v portainer_data:/data `
  portainer/portainer-ce:latest | Out-Host

Write-Host ''
Say "Portainer is available at: http://localhost:$port" Green
Write-Host ''
