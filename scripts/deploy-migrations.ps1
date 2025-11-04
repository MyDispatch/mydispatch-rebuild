# ==================================================================================
# DEPLOY MIGRATIONS - Via Supabase API
# ==================================================================================
# Versucht Migrations über Supabase Management API auszuführen
# Erstellt: 2025-11-04
# ==================================================================================

$projectId = "vsbqyqhzxmwezlhzdmfd"
$migrations = @(
    "20250131_nexify_master_system.sql",
    "20250131_nexify_crm_system.sql",
    "20250131_system_health_tables.sql",
    "20250131_storage_letterheads.sql",
    "20250131_email_templates_table.sql",
    "20250131_cron_jobs.sql",
    "20250131000003_fix_master_login.sql"
)

Write-Host "📊 MIGRATIONS DEPLOYEN" -ForegroundColor Green
Write-Host ""
Write-Host "Projekt: $projectId" -ForegroundColor Yellow
Write-Host ""

foreach ($migration in $migrations) {
    $filePath = "supabase\migrations\$migration"
    
    if (Test-Path $filePath) {
        Write-Host "✅ Gefunden: $migration" -ForegroundColor Green
        Write-Host "   Datei: $filePath" -ForegroundColor Gray
        
        # Versuche SQL Inhalt zu lesen
        $sqlContent = Get-Content $filePath -Raw
        
        Write-Host "   Größe: $($sqlContent.Length) Zeichen" -ForegroundColor Gray
        Write-Host "   ⚠️  Muss manuell in Supabase Dashboard ausgeführt werden" -ForegroundColor Yellow
        Write-Host "   URL: https://supabase.com/dashboard/project/$projectId/sql/new" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host "❌ Fehlt: $migration" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "📋 NÄCHSTE SCHRITTE:" -ForegroundColor Yellow
Write-Host "1. Öffne: https://supabase.com/dashboard/project/$projectId/sql/new" -ForegroundColor Cyan
Write-Host "2. Kopiere SQL-Inhalt aus jeder Migration" -ForegroundColor Cyan
Write-Host "3. Fuehre nacheinander aus" -ForegroundColor Cyan
Write-Host ""

