# Installer: Portainer CE
$ErrorActionPreference = 'Stop'

function C([string]$t,[ConsoleColor]$c='Gray'){ Write-Host $t -ForegroundColor $c }

C ''
C '╔══════════════════════════════════════════════════════╗' Cyan
C '║                    PORTAINER CE                     ║' Cyan
C '╚══════════════════════════════════════════════════════╝' Cyan
C ''

$docker = Get-Command docker -ErrorAction SilentlyContinue
if (-not $docker) {
  throw 'Docker não encontrado no PATH. Instale/abra o Docker Desktop.'
}

docker info *> $null
if ($LASTEXITCODE -ne 0) {
  throw 'Docker Desktop não está rodando ou não está acessível.'
}

$port = Read-Host 'Porta do Portainer [9000]'
if ([string]::IsNullOrWhiteSpace($port)) { $port = '9000' }

C '➜ Criando volume portainer_data...' Blue
docker volume create portainer_data | Out-Host

C '➜ Subindo Portainer...' Blue
docker run -d `
  --name portainer `
  --restart=always `
  -p "${port}:9000" `
  -v /var/run/docker.sock:/var/run/docker.sock `
  -v portainer_data:/data `
  portainer/portainer-ce:latest | Out-Host

C ''
C "✔ Portainer disponível em: http://localhost:$port" Green
C ''
