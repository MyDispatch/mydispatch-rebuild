#!/usr/bin/env powershell
# PowerShell Script für npm install (mit Timeout)
# Verwendet wenn Terminal-Befehle hängen

$ErrorActionPreference = "Stop"
$timeout = 120000  # 2 Minuten

Write-Host "📦 npm install wird gestartet..." -ForegroundColor Cyan
Write-Host "⏱️ Timeout: $($timeout/1000) Sekunden`n" -ForegroundColor Yellow

$job = Start-Job -ScriptBlock {
    Set-Location "C:\Users\pcour\mydispatch-rebuild"
    npm install 2>&1
}

if (Wait-Job $job -Timeout $timeout) {
    $output = Receive-Job $job
    Remove-Job $job
    Write-Host $output
    Write-Host "`n✅ npm install erfolgreich!" -ForegroundColor Green
} else {
    Stop-Job $job
    Remove-Job $job
    Write-Host "`n⚠️ npm install hängt!" -ForegroundColor Yellow
    Write-Host "   Bitte manuell ausführen oder GitHub Web UI verwenden" -ForegroundColor Yellow
    exit 1
}

