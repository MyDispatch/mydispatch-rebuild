# ==================================================================================
# SET SUPABASE SECRETS - Direct API Call
# ==================================================================================
# Versucht Secrets direkt über Supabase Management API zu setzen
# Erstellt: 2025-11-04
# ==================================================================================

$projectId = "vsbqyqhzxmwezlhzdmfd"

# Secrets
$secrets = @{
    "ANTHROPIC_API_KEY" = "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"
    "RESEND_API_KEY" = "re_QLd5UEuy_65ESCwqXFrSaHzuSTaS8LTGd"
    "RESEND_DOMAIN" = "b899dc5b-e1e7-486e-87ef-bccece2d3002"
    "DAILY_API_KEY" = "e4397b97b3227ce33788210723d0454edfbbb4bc487efe01ec372ca8cc441d72"
}

Write-Host "🔐 SUPABASE SECRETS SETZEN" -ForegroundColor Green
Write-Host ""
Write-Host "Projekt: $projectId" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  WICHTIG: Secrets müssen MANUELL in Supabase Dashboard gesetzt werden" -ForegroundColor Red
Write-Host ""
Write-Host "1. Öffne: https://supabase.com/dashboard/project/$projectId/settings/secrets" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Setze folgende Secrets:" -ForegroundColor Cyan
Write-Host ""

foreach ($key in $secrets.Keys) {
    $value = $secrets[$key]
    Write-Host "   $key = $value" -ForegroundColor White
}

Write-Host ""
Write-Host "Nach dem Setzen: Edge Functions koennen die Secrets verwenden" -ForegroundColor Green
Write-Host ""

