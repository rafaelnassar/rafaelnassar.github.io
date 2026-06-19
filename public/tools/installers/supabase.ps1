# Installer: Supabase Self-Host
$ErrorActionPreference = 'Stop'

$MainScriptUrl = 'https://rafaelnassar.github.io/tools/supabase-stack.ps1'
$InstallDir = Join-Path $HOME 'SupabaseStack'
$MainScriptPath = Join-Path $InstallDir 'supabase-stack.ps1'
$CmdPath = Join-Path $InstallDir 'supabase-stack.cmd'

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

function Header {
  Clear-Host
  Write-Host ''
  Say '======================================================' Cyan
  Say '              SUPABASE SELF-HOST INSTALLER            ' Cyan
  Say '======================================================' Cyan
  Write-Host ''
}

Header

New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null

Say 'Downloading/updating Supabase Stack Manager...' Blue
Invoke-WebRequest -Uri $MainScriptUrl -UseBasicParsing -OutFile $MainScriptPath

@"
@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "$MainScriptPath" %*
"@ | Set-Content -Path $CmdPath -Encoding ASCII

Say 'Installed/updated.' Green
Write-Host ''
Say 'What do you want to do now?' White
Write-Host ''
Write-Host '  [1] Check environment'
Write-Host '  [2] Create new instance'
Write-Host '  [3] List instances'
Write-Host '  [0] Back'
Write-Host ''

$op = Read-Host 'Option'

switch ($op) {
  '1' {
    & powershell -NoProfile -ExecutionPolicy Bypass -File $MainScriptPath doctor
  }

  '2' {
    $name = Read-Host 'Instance name. Example: meuapp'
    if (-not [string]::IsNullOrWhiteSpace($name)) {
      & powershell -NoProfile -ExecutionPolicy Bypass -File $MainScriptPath new $name -OpenStudio
    }
  }

  '3' {
    & powershell -NoProfile -ExecutionPolicy Bypass -File $MainScriptPath list
  }

  default {
    return
  }
}
