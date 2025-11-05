# ==================================================================================
# MIGRATIONS HISTORY REPAIR SCRIPT
# ==================================================================================
# Zweck: Repariert die Migration-History nach Repository-Wechsel
# Datum: 2025-11-04
# ==================================================================================

Write-Host "`n🔧 STARTE MIGRATIONS-HISTORY REPAIR...`n" -ForegroundColor Cyan

# Alte/fehlerhafte Migrations als "reverted" markieren
$revertedMigrations = @(
    "20251022015401",
    "20251022033545",
    "20251022044104",
    "20251022044647",
    "20251022044731",
    "20251022112756",
    "20251102152905",
    "20251102162256",
    "20251102163251",
    "20251102164435",
    "20251102172754",
    "20251102173632",
    "20251102175253",
    "20251102182149",
    "20251102182920"
)

Write-Host "📋 Markiere alte Migrations als 'reverted'...`n" -ForegroundColor Yellow

foreach ($migration in $revertedMigrations) {
    Write-Host "   ⏮️  $migration" -ForegroundColor Gray
    npx supabase migration repair --status reverted $migration 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Reverted: $migration" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Warnung: $migration konnte nicht reverted werden" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ MIGRATIONS-HISTORY REPARIERT!`n" -ForegroundColor Green
Write-Host "🚀 Du kannst jetzt deployen mit: npx supabase db push`n" -ForegroundColor Cyan
