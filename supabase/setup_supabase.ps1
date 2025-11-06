# Supabase Setup-Skript für MyDispatch
# Konfiguriert RESEND_API_KEY und erstellt Master Users
# Datum: 2025-11-06

$ErrorActionPreference = "Stop"

# Farbige Output-Funktionen
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Error { Write-Host $args -ForegroundColor Red }

Write-Info "=================================="
Write-Info "Supabase MyDispatch Setup"
Write-Info "=================================="
Write-Host ""

# Konfiguration
$PROJECT_ID = "vsbqyqhzxmwezlhzdmfd"
$SUPABASE_URL = "https://vsbqyqhzxmwezlhzdmfd.supabase.co"
$ACCESS_TOKEN = "sbp_c7ba28a3d0760fa168bc483b0a8d8b048dfe58a1"
$RESEND_API_KEY = "re_WWtdb7JV_DJ9iJU4DJrc7ZLkFufufFxi5"

Write-Info "Projekt: $PROJECT_ID"
Write-Host ""

# Schritt 1: RESEND_API_KEY als Edge Function Secret setzen
Write-Info "📧 SCHRITT 1: RESEND_API_KEY konfigurieren..."
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $ACCESS_TOKEN"
    "Content-Type" = "application/json"
    "apikey" = $ACCESS_TOKEN
}

$secretBody = @{
    name = "RESEND_API_KEY"
    value = $RESEND_API_KEY
} | ConvertTo-Json

try {
    Write-Info "Setze Edge Function Secret: RESEND_API_KEY"
    
    # Supabase Management API endpoint für Secrets
    $secretUrl = "https://api.supabase.com/v1/projects/$PROJECT_ID/secrets"
    
    $response = Invoke-RestMethod -Uri $secretUrl -Method Post -Headers $headers -Body $secretBody
    Write-Success "✅ RESEND_API_KEY erfolgreich gesetzt!"
} catch {
    Write-Warning "⚠️  Fehler beim Setzen des Secrets (möglicherweise bereits vorhanden)"
    Write-Host $_.Exception.Message
}

Write-Host ""

# Schritt 2: Master Users erstellen
Write-Info "👥 SCHRITT 2: Master Users erstellen..."
Write-Host ""

$sqlFile = Join-Path $PSScriptRoot "setup_master_users.sql"

if (-Not (Test-Path $sqlFile)) {
    Write-Error "❌ SQL-Datei nicht gefunden: $sqlFile"
    exit 1
}

Write-Info "Lese SQL-Skript: $sqlFile"
$sql = Get-Content $sqlFile -Raw

# SQL über Supabase SQL API ausführen
$sqlUrl = "$SUPABASE_URL/rest/v1/rpc/exec_sql"

try {
    Write-Info "Führe SQL-Skript aus..."
    
    # Für die direkte Ausführung müssen wir den SQL-Editor oder die Management API nutzen
    Write-Warning "⚠️  SQL muss manuell im Supabase Dashboard ausgeführt werden:"
    Write-Host ""
    Write-Info "1. Öffne: https://supabase.com/dashboard/project/$PROJECT_ID/sql/new"
    Write-Host ""
    Write-Info "2. Kopiere den Inhalt von: $sqlFile"
    Write-Host ""
    Write-Info "3. Führe das SQL-Skript aus"
    Write-Host ""
    
    # Alternative: Verwende Supabase CLI wenn verfügbar
    if (Get-Command supabase -ErrorAction SilentlyContinue) {
        Write-Info "Supabase CLI gefunden! Versuche automatische Ausführung..."
        
        Set-Location (Split-Path $sqlFile -Parent)
        supabase db push --db-url "postgresql://postgres.[PROJECT]:[PASSWORD]@db.$PROJECT_ID.supabase.co:5432/postgres"
        
    } else {
        Write-Info "💡 TIPP: Installiere Supabase CLI für automatische Ausführung:"
        Write-Host "   npm install -g supabase" -ForegroundColor Gray
    }
    
} catch {
    Write-Error "❌ Fehler: $($_.Exception.Message)"
}

Write-Host ""
Write-Info "=================================="
Write-Success "Setup-Anleitung abgeschlossen!"
Write-Info "=================================="
Write-Host ""

Write-Info "NAECHSTE SCHRITTE:"
Write-Host ""
Write-Host "1. RESEND_API_KEY Secret ueberpruefen:" -ForegroundColor Cyan
Write-Host "   https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/settings/functions" -ForegroundColor Gray
Write-Host ""
Write-Host "2. SQL-Skript fuer Master Users ausfuehren:" -ForegroundColor Cyan
Write-Host "   https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/sql/new" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Login testen mit:" -ForegroundColor Cyan
Write-Host "   Email: courbois1981@gmail.com" -ForegroundColor Gray
Write-Host "   Password: 1def!xO2022!!" -ForegroundColor Gray
Write-Host ""
