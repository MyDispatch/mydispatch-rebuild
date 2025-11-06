# ⚡ AUTOMATISCHER MASTER-USER SETUP via Supabase Edge Functions
# Projekt: ygpwuiygivxoqtyoigtg
# Datum: 2025-11-06

Write-Host "🚀 MyDispatch - Master-User Setup gestartet..." -ForegroundColor Cyan
Write-Host ""

# Projekt-ID
$PROJECT_ID = "ygpwuiygivxoqtyoigtg"

# 1. SECRETS SETZEN
Write-Host "📝 Schritt 1: Secrets setzen..." -ForegroundColor Yellow

# Generiere starkes Admin-Token
$ADMIN_TOKEN = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
Write-Host "   ✓ Admin-Token generiert: $ADMIN_TOKEN" -ForegroundColor Green

# Setze Secret (via Supabase CLI)
Write-Host "   → Setze FUNCTION_ADMIN_TOKEN..." -ForegroundColor Gray
supabase secrets set FUNCTION_ADMIN_TOKEN="$ADMIN_TOKEN" --project-ref $PROJECT_ID

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ FUNCTION_ADMIN_TOKEN gesetzt!" -ForegroundColor Green
} else {
    Write-Host "   ❌ Fehler beim Setzen des Secrets" -ForegroundColor Red
    Write-Host ""
    Write-Host "ALTERNATIVE: Manuell im Dashboard setzen:" -ForegroundColor Yellow
    Write-Host "https://supabase.com/dashboard/project/$PROJECT_ID/settings/vault/secrets" -ForegroundColor Cyan
    Write-Host "Name: FUNCTION_ADMIN_TOKEN" -ForegroundColor Gray
    Write-Host "Value: $ADMIN_TOKEN" -ForegroundColor Gray
    Write-Host ""
    Read-Host "Drücke Enter, wenn Secret gesetzt wurde"
}

Write-Host ""

# 2. EDGE FUNCTIONS DEPLOYEN
Write-Host "📦 Schritt 2: Edge Functions deployen..." -ForegroundColor Yellow

# admin-create-user deployen
Write-Host "   → Deploye admin-create-user..." -ForegroundColor Gray
supabase functions deploy admin-create-user --project-ref $PROJECT_ID

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ admin-create-user deployed!" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Deploy-Fehler bei admin-create-user" -ForegroundColor Red
}

# setup-master-users deployen
Write-Host "   → Deploye setup-master-users..." -ForegroundColor Gray
supabase functions deploy setup-master-users --project-ref $PROJECT_ID

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ setup-master-users deployed!" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Deploy-Fehler bei setup-master-users" -ForegroundColor Red
}

Write-Host ""

# 3. MASTER-USERS ERSTELLEN (via Edge Function)
Write-Host "👤 Schritt 3: Master-Users erstellen..." -ForegroundColor Yellow

$FUNCTION_URL = "https://$PROJECT_ID.supabase.co/functions/v1/setup-master-users"

Write-Host "   → Rufe Edge Function auf..." -ForegroundColor Gray
Write-Host "   URL: $FUNCTION_URL" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri $FUNCTION_URL -Method POST -Headers @{
        "Authorization" = "Bearer $ADMIN_TOKEN"
        "Content-Type" = "application/json"
    } -ErrorAction Stop

    Write-Host "   ✓ Master-Users erstellt!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Ergebnisse:" -ForegroundColor Cyan
    $response.results | ForEach-Object {
        $status = $_.status
        $email = $_.email
        if ($status -eq "created") {
            Write-Host "   ✓ $email - NEU ERSTELLT" -ForegroundColor Green
        } elseif ($status -eq "updated") {
            Write-Host "   ↻ $email - AKTUALISIERT" -ForegroundColor Yellow
        } else {
            Write-Host "   ❌ $email - FEHLER" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "   ❌ Fehler beim Erstellen der Master-Users" -ForegroundColor Red
    Write-Host "   Fehler: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "   ALTERNATIVE: Manuell via curl ausführen:" -ForegroundColor Yellow
    Write-Host "   curl -X POST $FUNCTION_URL \" -ForegroundColor Gray
    Write-Host "     -H 'Authorization: Bearer $ADMIN_TOKEN' \" -ForegroundColor Gray
    Write-Host "     -H 'Content-Type: application/json'" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ SETUP ABGESCHLOSSEN!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Nächste Schritte:" -ForegroundColor Cyan
Write-Host "   1. Dev-Server neu starten: npm run dev" -ForegroundColor Gray
Write-Host "   2. Login testen: http://localhost:5173/auth" -ForegroundColor Gray
Write-Host "   3. Credentials:" -ForegroundColor Gray
Write-Host "      - Email: courbois1981@gmail.com" -ForegroundColor Gray
Write-Host "      - Passwort: 1def!xO2022!!" -ForegroundColor Gray
Write-Host ""
Write-Host "🔑 Admin-Token für spätere Verwendung:" -ForegroundColor Cyan
Write-Host $ADMIN_TOKEN -ForegroundColor Yellow
Write-Host ""
Write-Host "💾 WICHTIG: Speichere dieses Token sicher!" -ForegroundColor Red
Write-Host ""

# Admin-Token in .env speichern
$envPath = ".env.local"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    if ($envContent -notmatch "FUNCTION_ADMIN_TOKEN") {
        Add-Content -Path $envPath -Value "`nFUNCTION_ADMIN_TOKEN=$ADMIN_TOKEN"
        Write-Host "✓ Admin-Token in .env.local gespeichert" -ForegroundColor Green
    }
}

Read-Host "Drücke Enter zum Beenden"
