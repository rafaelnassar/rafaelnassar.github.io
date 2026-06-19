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

function Pause-Menu {
  Write-Host ''
  Read-Host 'Press ENTER to continue'
}

function Run-Manager {
  param([string[]]$Arguments)

  & powershell -NoProfile -ExecutionPolicy Bypass -File $MainScriptPath @Arguments
  if ($LASTEXITCODE -ne 0) {
    Say "Manager exited with code $LASTEXITCODE." Red
  }
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
Start-Sleep -Milliseconds 500

while ($true) {
  Header
  Say 'Supabase actions:' White
  Write-Host ''
  Write-Host '  [1] Check environment'
  Write-Host '  [2] Create new instance'
  Write-Host '  [3] List instances'
  Write-Host '  [4] Update instance without data loss'
  Write-Host '  [5] Show access/secrets'
  Write-Host '  [0] Back to Docker Hub'
  Write-Host ''

  $op = Read-Host 'Option'

  switch ($op) {
    '1' {
      Run-Manager @('doctor')
      Pause-Menu
    }

    '2' {
      $name = Read-Host 'Instance name. Example: meuapp'
      if (-not [string]::IsNullOrWhiteSpace($name)) {
        Run-Manager @('new',$name,'-OpenStudio')
      } else {
        Say 'Instance name is required.' Yellow
      }
      Pause-Menu
    }

    '3' {
      Run-Manager @('list')
      Pause-Menu
    }

    '4' {
      $name = Read-Host 'Instance name'
      if (-not [string]::IsNullOrWhiteSpace($name)) {
        Run-Manager @('upgrade',$name)
      } else {
        Say 'Instance name is required.' Yellow
      }
      Pause-Menu
    }

    '5' {
      $name = Read-Host 'Instance name'
      if (-not [string]::IsNullOrWhiteSpace($name)) {
        Run-Manager @('secrets',$name)
      } else {
        Say 'Instance name is required.' Yellow
      }
      Pause-Menu
    }

    '0' {
      return
    }

    default {
      Say 'Invalid option.' Yellow
      Start-Sleep -Seconds 1
    }
  }
}
