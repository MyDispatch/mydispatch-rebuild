# MyDispatch Migration Consolidator
# Konsolidiert alle SQL-Migrationen in eine Master-Datei

Write-Host "🔄 Konsolidiere Migrationen..." -ForegroundColor Cyan

$migrationsPath = Join-Path $PSScriptRoot "..\supabase\migrations"
$outputPath = Join-Path $PSScriptRoot "..\MASTER_MIGRATION_COMPLETE.sql"

# Alle SQL-Dateien sortiert nach Name holen
$files = Get-ChildItem -Path $migrationsPath -Filter "*.sql" | Sort-Object Name

Write-Host "📁 Gefundene Migrations: $($files.Count)" -ForegroundColor Green

# Header erstellen
$header = "-- ============================================`n"
$header += "-- MyDispatch Master Migration`n"
$header += "-- ============================================`n"
$header += "-- Generated: " + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + "`n"
$header += "-- Total Files: " + $files.Count + "`n"
$header += "-- Project ID: ygpwuiygivxoqtyoigtg`n"
$header += "-- ============================================`n`n"

$content = $header

# Jede Datei hinzufügen
$counter = 0
foreach ($file in $files) {
    $counter++
    Write-Host "  [$counter/$($files.Count)] $($file.Name)" -ForegroundColor Gray

    $content += "`n-- ============================================`n"
    $content += "-- FILE: " + $file.Name + "`n"
    $content += "-- ============================================`n`n"

    try {
        $fileContent = Get-Content $file.FullName -Raw -Encoding UTF8
        $content += $fileContent
        $content += "`n`n"
    } catch {
        Write-Host "    ⚠️  Fehler beim Lesen: $_" -ForegroundColor Yellow
    }
}

# Datei schreiben
try {
    $content | Out-File -FilePath $outputPath -Encoding UTF8 -NoNewline
    Write-Host "✅ Master-Migration erstellt: $outputPath" -ForegroundColor Green

    $fileSize = (Get-Item $outputPath).Length / 1MB
    Write-Host "📊 Dateigröße: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Fehler beim Schreiben: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Fertig! Master-Migration bereit zur Ausführung." -ForegroundColor Green
