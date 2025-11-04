# ==================================================================================
# SET SUPABASE SECRETS - Automated Script
# ==================================================================================
# Setzt alle Supabase Secrets via Supabase CLI
# Erstellt: 2025-11-04
# ==================================================================================

Write-Host "🔐 SUPABASE SECRETS SETZEN" -ForegroundColor Green
Write-Host ""

# Prüfe ob Supabase CLI installiert ist
$supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue

if (-not $supabaseInstalled) {
    Write-Host "❌ Supabase CLI nicht gefunden!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installation:" -ForegroundColor Yellow
    Write-Host "   npm install -g supabase" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "ODER manuell in Supabase Dashboard:" -ForegroundColor Yellow
    Write-Host "   https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/settings/secrets" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

# Project ID
$projectId = "vsbqyqhzxmwezlhzdmfd"

Write-Host "📋 Setze Secrets für Projekt: $projectId" -ForegroundColor Yellow
Write-Host ""

# Secrets
$secrets = @{
    "ANTHROPIC_API_KEY" = "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"
    "RESEND_API_KEY" = "re_QLd5UEuy_65ESCwqXFrSaHzuSTaS8LTGd"
    "RESEND_DOMAIN" = "b899dc5b-e1e7-486e-87ef-bccece2d3002"
    "DAILY_API_KEY" = "e4397b97b3227ce33788210723d0454edfbbb4bc487efe01ec372ca8cc441d72"
}

foreach ($key in $secrets.Keys) {
    $value = $secrets[$key]
    Write-Host "Setze $key..." -ForegroundColor Cyan
    
    # Supabase CLI Secret setzen
    supabase secrets set "$key=$value" --project-ref $projectId
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ $key gesetzt" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $key fehlgeschlagen" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ ALLE SECRETS GESETZT!" -ForegroundColor Green
Write-Host ""

