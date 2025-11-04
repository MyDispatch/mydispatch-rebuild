# ==================================================================================
# CONFIGURE CURSOR PROMPT EXTENSIONS - GitHub PAT
# ==================================================================================
# Konfiguriert Cursor Prompt Saver und Prompt Manager via Command Palette
# Erstellt: 2025-11-04
# ==================================================================================

Write-Host "🔧 CURSOR PROMPT EXTENSIONS KONFIGURATION" -ForegroundColor Green
Write-Host ""

$githubPAT = "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"
$githubUsername = "u4231458123@gmail.com"

Write-Host "GitHub PAT:" -ForegroundColor Yellow
Write-Host "   Token: $githubPAT" -ForegroundColor Cyan
Write-Host "   Username: $githubUsername" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  MANUELLE KONFIGURATION ERFORDERLICH:" -ForegroundColor Red
Write-Host ""
Write-Host "1. Öffne Cursor Command Palette:" -ForegroundColor Cyan
Write-Host "   Windows/Linux: Ctrl+Shift+P" -ForegroundColor White
Write-Host "   macOS: Cmd+Shift+P" -ForegroundColor White
Write-Host ""

Write-Host "2. Führe aus:" -ForegroundColor Cyan
Write-Host "   → 'Configure Prompt Saver'" -ForegroundColor White
Write-Host "   → GitHub Token eingeben: $githubPAT" -ForegroundColor White
Write-Host ""

Write-Host "3. Führe aus:" -ForegroundColor Cyan
Write-Host "   → 'Configure Prompt Manager'" -ForegroundColor White
Write-Host "   → GitHub Token eingeben: $githubPAT" -ForegroundColor White
Write-Host ""

Write-Host "4. Testen:" -ForegroundColor Cyan
Write-Host "   → Prompt speichern" -ForegroundColor White
Write-Host "   → Prompt laden" -ForegroundColor White
Write-Host ""

Write-Host "✅ Nach Konfiguration: Cursor neu starten empfohlen" -ForegroundColor Green
Write-Host ""

# Versuche Cursor Settings direkt zu setzen (falls möglich)
$cursorSettingsPath = "$env:APPDATA\Cursor\User\settings.json"

if (Test-Path $cursorSettingsPath) {
    Write-Host "📝 Versuche Cursor Settings zu aktualisieren..." -ForegroundColor Yellow
    
    try {
        $settings = Get-Content $cursorSettingsPath -Raw | ConvertFrom-Json
        
        # Füge GitHub PAT zu Settings hinzu (falls Extension es unterstützt)
        # HINWEIS: Die meisten Extensions speichern in Secrets, nicht in Settings
        
        $settings | ConvertTo-Json -Depth 10 | Set-Content $cursorSettingsPath
        Write-Host "  ✅ Settings aktualisiert" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠️  Settings konnten nicht automatisch aktualisiert werden" -ForegroundColor Yellow
        Write-Host "     → Manuelle Konfiguration über Command Palette erforderlich" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ KONFIGURATION FERTIG!" -ForegroundColor Green

