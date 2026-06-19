# Installer: Supabase Self-Host
$ErrorActionPreference = 'Stop'

$MainScriptUrl = 'https://rafaelnassar.github.io/tools/supabase-stack.ps1'
$InstallDir = Join-Path $HOME 'SupabaseStack'
$MainScriptPath = Join-Path $InstallDir 'supabase-stack.ps1'
$CmdPath = Join-Path $InstallDir 'supabase-stack.cmd'

function C([string]$t,[ConsoleColor]$c='Gray'){ Write-Host $t -ForegroundColor $c }

C ''
C '╔══════════════════════════════════════════════════════╗' Cyan
C '║              SUPABASE SELF-HOST INSTALLER           ║' Cyan
C '╚══════════════════════════════════════════════════════╝' Cyan
C ''

New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null

C '➜ Baixando/atualizando Supabase Stack Manager...' Blue
Invoke-WebRequest -Uri $MainScriptUrl -UseBasicParsing -OutFile $MainScriptPath

@"
@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "$MainScriptPath" %*
"@ | Set-Content -Path $CmdPath -Encoding ASCII

C '✔ Instalado/atualizado.' Green
C ''
C 'O que deseja fazer agora?' White
C ''
Write-Host '  [1] Verificar ambiente'
Write-Host '  [2] Criar nova instância'
Write-Host '  [3] Listar instâncias'
Write-Host '  [0] Voltar'
C ''

$op = Read-Host 'Opção'

switch ($op) {
  '1' { & powershell -NoProfile -ExecutionPolicy Bypass -File $MainScriptPath doctor }
  '2' {
    $name = Read-Host 'Nome da instância. Ex: meuapp'
    if (-not [string]::IsNullOrWhiteSpace($name)) {
      & powershell -NoProfile -ExecutionPolicy Bypass -File $MainScriptPath new $name -OpenStudio
    }
  }
  '3' { & powershell -NoProfile -ExecutionPolicy Bypass -File $MainScriptPath list }
  default { return }
}
