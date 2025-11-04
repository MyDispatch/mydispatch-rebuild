# ==================================================================================
# DEPLOY EDGE FUNCTIONS - Check & Deploy
# ==================================================================================
# Prüft Edge Functions und bereitet Deployment vor
# Erstellt: 2025-11-04
# ==================================================================================

$projectId = "vsbqyqhzxmwezlhzdmfd"
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

Write-Host "⚡ EDGE FUNCTIONS DEPLOYEN" -ForegroundColor Green
Write-Host ""
Write-Host "Projekt: $projectId" -ForegroundColor Yellow
Write-Host ""

foreach ($func in $edgeFunctions) {
    $funcPath = "supabase\functions\$func"
    
    if (Test-Path $funcPath) {
        Write-Host "✅ Gefunden: $func" -ForegroundColor Green
        
        # Prüfe ob index.ts vorhanden
        $indexFile = Join-Path $funcPath "index.ts"
        if (Test-Path $indexFile) {
            Write-Host "   ✅ index.ts vorhanden" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  index.ts fehlt" -ForegroundColor Yellow
        }
        
        Write-Host "   Pfad: $funcPath" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host "❌ Fehlt: $func" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "📋 DEPLOYMENT:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Supabase CLI (falls installiert)" -ForegroundColor Cyan
foreach ($func in $edgeFunctions) {
    Write-Host "   supabase functions deploy $func" -ForegroundColor White
}
Write-Host ""
Write-Host "Option 2: Supabase Dashboard" -ForegroundColor Cyan
$dashboardUrl = "https://supabase.com/dashboard/project/$projectId/functions"
Write-Host "   $dashboardUrl" -ForegroundColor White
Write-Host ""

