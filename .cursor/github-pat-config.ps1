Param(
  [Parameter(Mandatory=$true)][string]$Token,
  [Parameter(Mandatory=$true)][string]$Username
)

Write-Host "🔧 CURSOR PROMPT EXTENSIONS KONFIGURATION" -ForegroundColor Green
Write-Host ""
Write-Host "GitHub PAT:" -ForegroundColor Yellow
Write-Host "   Token: $Token" -ForegroundColor Cyan
Write-Host "   Username: $Username" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  MANUELLE KONFIGURATION ERFORDERLICH:" -ForegroundColor Red
Write-Host ""
Write-Host "1. Öffne Cursor Command Palette:" -ForegroundColor Cyan
Write-Host "   Windows/Linux: Ctrl+Shift+P" -ForegroundColor White
Write-Host "   macOS: Cmd+Shift+P" -ForegroundColor White
Write-Host ""
Write-Host "2. Führe aus:" -ForegroundColor Cyan
Write-Host "   → 'Configure Prompt Saver'" -ForegroundColor White
Write-Host "   → GitHub Token eingeben: $Token" -ForegroundColor White
Write-Host ""
Write-Host "3. Führe aus:" -ForegroundColor Cyan
Write-Host "   → 'Configure Prompt Manager'" -ForegroundColor White
Write-Host "   → GitHub Token eingeben: $Token" -ForegroundColor White
Write-Host ""
Write-Host "4. Testen:" -ForegroundColor Cyan
Write-Host "   → Prompt speichern" -ForegroundColor White
Write-Host "   → Prompt laden" -ForegroundColor White
Write-Host ""
Write-Host "✅ Nach Konfiguration: Cursor neu starten empfohlen" -ForegroundColor Green
Write-Host ""

$cursorSettingsPath = "$env:APPDATA\Cursor\User\settings.json"
if (Test-Path $cursorSettingsPath) {
  Write-Host "📝 Versuche Cursor Settings zu aktualisieren..." -ForegroundColor Yellow
  try {
    $settings = Get-Content $cursorSettingsPath -Raw | ConvertFrom-Json
    # Hinweis: die Extensions speichern Tokens i.d.R. als Secret, nicht in settings.json.
    # Wir hinterlegen nur einen Hinweis-Eintrag, ohne das Secret zu persistieren.
    if (-not $settings.custom) { $settings | Add-Member -NotePropertyName custom -NotePropertyValue @{} }
    $settings.custom.githubPromptExtensions = @{ configured = $true; username = $Username; configuredAt = (Get-Date).ToString("s") }
    $settings | ConvertTo-Json -Depth 10 | Set-Content $cursorSettingsPath
    Write-Host "  ✅ Settings-Hinweis aktualisiert (ohne Secret)" -ForegroundColor Green
  } catch {
    Write-Host "  ⚠️  Settings konnten nicht automatisch aktualisiert werden (harmlos)" -ForegroundColor Yellow
    Write-Host "     → Manuelle Konfiguration über Command Palette erforderlich" -ForegroundColor Yellow
  }
}

Write-Host ""; Write-Host "✅ KONFIGURATION FERTIG!" -ForegroundColor Green
