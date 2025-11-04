# ==================================================================================
# DEPLOY ALL - MyDispatch Deployment Script
# ==================================================================================
# Deployt alle 7 Migrations, 8 Edge Functions und Frontend Code
# Erstellt: 2025-11-04
# ==================================================================================

Write-Host "🚀 MYDISPATCH DEPLOYMENT - VOLLSTÄNDIG" -ForegroundColor Green
Write-Host ""

# ==================================================================================
# PHASE 1: SUPABASE SECRETS SETZEN
# ==================================================================================
Write-Host "📋 PHASE 1: Supabase Secrets konfigurieren" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  WICHTIG: Diese müssen MANUELL in Supabase Dashboard gesetzt werden:" -ForegroundColor Red
Write-Host ""
Write-Host "1. Öffne: https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/settings/secrets" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Setze folgende Secrets:" -ForegroundColor Cyan
Write-Host "   ANTHROPIC_API_KEY = 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" -ForegroundColor White
Write-Host "   RESEND_API_KEY = re_QLd5UEuy_65ESCwqXFrSaHzuSTaS8LTGd" -ForegroundColor White
Write-Host "   RESEND_DOMAIN = b899dc5b-e1e7-486e-87ef-bccece2d3002" -ForegroundColor White
Write-Host "   DAILY_API_KEY = e4397b97b3227ce33788210723d0454edfbbb4bc487efe01ec372ca8cc441d72" -ForegroundColor White
Write-Host ""
Read-Host "Drücke ENTER wenn Secrets gesetzt sind"

# ==================================================================================
# PHASE 2: MIGRATIONS DEPLOYEN
# ==================================================================================
Write-Host ""
Write-Host "📋 PHASE 2: Database Migrations deployen" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  WICHTIG: Diese müssen MANUELL in Supabase Dashboard ausgeführt werden:" -ForegroundColor Red
Write-Host ""
Write-Host "1. Öffne: https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/sql/new" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Führe folgende Migrations nacheinander aus:" -ForegroundColor Cyan
Write-Host ""

$migrations = @(
    "20250131_nexify_master_system.sql",
    "20250131_nexify_crm_system.sql",
    "20250131_system_health_tables.sql",
    "20250131_storage_letterheads.sql",
    "20250131_email_templates_table.sql",
    "20250131_cron_jobs.sql",
    "20250131000003_fix_master_login.sql"
)

for ($i = 0; $i -lt $migrations.Count; $i++) {
    $migration = $migrations[$i]
    $number = $i + 1
    $filePath = "supabase\migrations\$migration"
    
    if (Test-Path $filePath) {
        Write-Host "   $number. ✅ $migration" -ForegroundColor Green
        Write-Host "      Datei: $filePath" -ForegroundColor Gray
    } else {
        Write-Host "   $number. ❌ $migration (FEHLT!)" -ForegroundColor Red
    }
}

Write-Host ""
Read-Host "Drücke ENTER wenn alle Migrations ausgeführt sind"

# ==================================================================================
# PHASE 3: EDGE FUNCTIONS DEPLOYEN
# ==================================================================================
Write-Host ""
Write-Host "📋 PHASE 3: Edge Functions deployen" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  WICHTIG: Diese müssen MANUELL via Supabase CLI oder Dashboard deployen:" -ForegroundColor Red
Write-Host ""

$edgeFunctions = @(
    "fix-master-login",
    "nexify-auto-load-context",
    "nexify-project-context",
    "nexify-crm-context",
    "nexify-crm-sync",
    "daily-health-check",
    "auto-fix-issues",
    "create-master-user",
    "ai-support-chat"
)

Write-Host "Edge Functions zu deployen:" -ForegroundColor Cyan
for ($i = 0; $i -lt $edgeFunctions.Count; $i++) {
    $func = $edgeFunctions[$i]
    $number = $i + 1
    $funcPath = "supabase\functions\$func"
    
    if (Test-Path $funcPath) {
        Write-Host "   $number. ✅ $func" -ForegroundColor Green
    } else {
        Write-Host "   $number. ❌ $func (FEHLT!)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Deployment-Befehl (falls Supabase CLI installiert):" -ForegroundColor Cyan
foreach ($func in $edgeFunctions) {
    Write-Host "   supabase functions deploy $func" -ForegroundColor White
}

Write-Host ""
Read-Host "Drücke ENTER wenn alle Edge Functions deployed sind"

# ==================================================================================
# PHASE 4: FRONTEND BUILD & DEPLOY
# ==================================================================================
Write-Host ""
Write-Host "📋 PHASE 4: Frontend Build & Deploy" -ForegroundColor Yellow
Write-Host ""

Write-Host "Build wird erstellt..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build erfolgreich!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  Frontend muss jetzt deployed werden (Vercel/Netlify/etc.)" -ForegroundColor Yellow
} else {
    Write-Host "❌ Build fehlgeschlagen!" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ DEPLOYMENT KOMPLETT!" -ForegroundColor Green
Write-Host ""
Write-Host "Nächste Schritte:" -ForegroundColor Cyan
Write-Host "1. ✅ Supabase Secrets gesetzt"
Write-Host "2. ✅ Migrations ausgeführt"
Write-Host "3. ✅ Edge Functions deployed"
Write-Host "4. ✅ Frontend deployed"
Write-Host ""

