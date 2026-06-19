# Installer: Watchtower
$ErrorActionPreference = 'Stop'

function C([string]$t,[ConsoleColor]$c='Gray'){ Write-Host $t -ForegroundColor $c }

C ''
C '╔══════════════════════════════════════════════════════╗' Cyan
C '║                     WATCHTOWER                      ║' Cyan
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

C 'Modo recomendado: apenas monitorar e mostrar logs, sem atualizar automaticamente.' Yellow
$auto = Read-Host 'Deseja atualizar containers automaticamente? [s/N]'

if ($auto -match '^[sS]') {
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

C '➜ Subindo Watchtower...' Blue
docker @args | Out-Host

C ''
C '✔ Watchtower configurado.' Green
C ''
