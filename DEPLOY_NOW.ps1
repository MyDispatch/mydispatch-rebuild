# 🚀 MyDispatch Deployment Script - V32.5
# Automatisches Deployment aller Edge Functions + Secrets Konfiguration

Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🚀 MyDispatch V32.5 - Automatisches Deployment" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# ========================
# 1. VORAUSSETZUNGEN PRÜFEN
# ========================
Write-Host "📋 Schritt 1/5: Voraussetzungen prüfen..." -ForegroundColor Yellow
Write-Host ""

# Prüfe Supabase CLI
$supabaseVersion = & npx supabase --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Supabase CLI gefunden: v$supabaseVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Supabase CLI nicht verfügbar!" -ForegroundColor Red
    Write-Host "   Installation: npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Prüfe Node.js
$nodeVersion = & node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Node.js gefunden: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js nicht gefunden!" -ForegroundColor Red
    exit 1
}

# Prüfe Git Status
Write-Host ""
Write-Host "📦 Git Status:" -ForegroundColor Cyan
$gitStatus = & git status --short
if ($gitStatus) {
    Write-Host "⚠️  Uncommitted Changes vorhanden:" -ForegroundColor Yellow
    Write-Host $gitStatus
    Write-Host ""
    $continue = Read-Host "   Trotzdem fortfahren? (y/n)"
    if ($continue -ne "y") {
        Write-Host "❌ Abgebrochen." -ForegroundColor Red
        exit 0
    }
} else {
    Write-Host "✅ Working Directory sauber" -ForegroundColor Green
}

# ========================
# 2. SUPABASE ACCESS TOKEN
# ========================
Write-Host ""
Write-Host "🔑 Schritt 2/5: Supabase Access Token konfigurieren..." -ForegroundColor Yellow
Write-Host ""

# Prüfe ob Token bereits gesetzt
if ($env:SUPABASE_ACCESS_TOKEN) {
    Write-Host "✅ SUPABASE_ACCESS_TOKEN bereits gesetzt" -ForegroundColor Green
    $useExisting = Read-Host "   Bestehendes Token verwenden? (y/n)"
    if ($useExisting -ne "y") {
        $env:SUPABASE_ACCESS_TOKEN = $null
    }
}

if (-not $env:SUPABASE_ACCESS_TOKEN) {
    Write-Host "📝 Neues Access Token benötigt:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   1. Öffne: https://supabase.com/dashboard/account/tokens" -ForegroundColor White
    Write-Host "   2. Klicke 'Generate New Token'" -ForegroundColor White
    Write-Host "   3. Name: 'Edge Functions Deployment V32.5'" -ForegroundColor White
    Write-Host "   4. Kopiere das generierte Token" -ForegroundColor White
    Write-Host ""

    # Öffne Browser
    Start-Process "https://supabase.com/dashboard/account/tokens"
    Write-Host "🌐 Browser geöffnet..." -ForegroundColor Green
    Write-Host ""

    $token = Read-Host "   Füge das Token hier ein (sbp_...)"
    if (-not $token -or -not $token.StartsWith("sbp_")) {
        Write-Host "❌ Ungültiges Token Format! Muss mit 'sbp_' beginnen." -ForegroundColor Red
        exit 1
    }

    $env:SUPABASE_ACCESS_TOKEN = $token
    Write-Host "✅ Token gesetzt" -ForegroundColor Green
}

# ========================
# 3. PROJEKT VERLINKEN
# ========================
Write-Host ""
Write-Host "🔗 Schritt 3/5: Projekt verlinken..." -ForegroundColor Yellow
Write-Host ""

$projectRef = "ygpwuiygivxoqtyoigtg"
Write-Host "   Project Ref: $projectRef" -ForegroundColor White

$linkResult = & npx supabase link --project-ref $projectRef 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Projekt erfolgreich verlinkt" -ForegroundColor Green
} else {
    Write-Host "⚠️  Projekt-Verlinkung fehlgeschlagen:" -ForegroundColor Yellow
    Write-Host $linkResult
    Write-Host ""
    Write-Host "   Fahre trotzdem fort (Direct Deployment)..." -ForegroundColor Yellow
}

# ========================
# 4. EDGE FUNCTIONS DEPLOYEN
# ========================
Write-Host ""
Write-Host "🚀 Schritt 4/5: Edge Functions deployen..." -ForegroundColor Yellow
Write-Host ""

# Zähle Functions
$functionsDir = Join-Path $PSScriptRoot "supabase\functions"
$functionsList = Get-ChildItem -Path $functionsDir -Directory
$functionsCount = $functionsList.Count

Write-Host "📦 Gefundene Edge Functions: $functionsCount" -ForegroundColor Cyan
Write-Host ""

# Deployment-Optionen
Write-Host "Deployment-Optionen:" -ForegroundColor White
Write-Host "  [1] Alle Functions deployen ($functionsCount Funktionen) - ~10 Minuten" -ForegroundColor White
Write-Host "  [2] Nur kritische Functions (Payment + Core) - ~2 Minuten" -ForegroundColor White
Write-Host "  [3] Einzelne Function deployen" -ForegroundColor White
Write-Host "  [4] Abbrechen" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Wähle Option (1-4)"

switch ($choice) {
    "1" {
        # Alle Functions deployen
        Write-Host ""
        Write-Host "🔄 Deploye alle $functionsCount Edge Functions..." -ForegroundColor Yellow
        Write-Host "   ⏱️  Geschätzte Dauer: 10-15 Minuten" -ForegroundColor White
        Write-Host ""

        $deployStart = Get-Date
        $successCount = 0
        $errorCount = 0

        foreach ($func in $functionsList) {
            $funcName = $func.Name
            Write-Host "   📤 Deploying: $funcName" -ForegroundColor Cyan

            $deployResult = & npx supabase functions deploy $funcName --project-ref $projectRef 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "      ✅ $funcName deployed" -ForegroundColor Green
                $successCount++
            } else {
                Write-Host "      ❌ $funcName failed: $deployResult" -ForegroundColor Red
                $errorCount++
            }
        }

        $deployEnd = Get-Date
        $duration = ($deployEnd - $deployStart).TotalMinutes

        Write-Host ""
        Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "📊 Deployment Zusammenfassung:" -ForegroundColor Yellow
        Write-Host "   ✅ Erfolgreich: $successCount" -ForegroundColor Green
        Write-Host "   ❌ Fehler: $errorCount" -ForegroundColor Red
        Write-Host "   ⏱️  Dauer: $([math]::Round($duration, 2)) Minuten" -ForegroundColor White
        Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
    }

    "2" {
        # Kritische Functions
        $criticalFunctions = @(
            "create-checkout",
            "stripe-webhook",
            "check-subscription",
            "customer-portal",
            "send-booking-email",
            "send-template-email",
            "brain-query",
            "get-here-api-key"
        )

        Write-Host ""
        Write-Host "🔄 Deploye kritische Edge Functions..." -ForegroundColor Yellow
        Write-Host "   Funktionen: $($criticalFunctions -join ', ')" -ForegroundColor White
        Write-Host ""

        $successCount = 0
        $errorCount = 0

        foreach ($funcName in $criticalFunctions) {
            Write-Host "   📤 Deploying: $funcName" -ForegroundColor Cyan

            $deployResult = & npx supabase functions deploy $funcName --project-ref $projectRef 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "      ✅ $funcName deployed" -ForegroundColor Green
                $successCount++
            } else {
                Write-Host "      ❌ $funcName failed: $deployResult" -ForegroundColor Red
                $errorCount++
            }
        }

        Write-Host ""
        Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "📊 Deployment Zusammenfassung:" -ForegroundColor Yellow
        Write-Host "   ✅ Erfolgreich: $successCount" -ForegroundColor Green
        Write-Host "   ❌ Fehler: $errorCount" -ForegroundColor Red
        Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
    }

    "3" {
        # Einzelne Function
        Write-Host ""
        Write-Host "📋 Verfügbare Functions:" -ForegroundColor Cyan
        $functionsList | Select-Object -First 20 | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor White }
        if ($functionsCount -gt 20) {
            Write-Host "   ... und $($functionsCount - 20) weitere" -ForegroundColor Gray
        }
        Write-Host ""

        $funcName = Read-Host "Function Name"
        if (Test-Path (Join-Path $functionsDir $funcName)) {
            Write-Host ""
            Write-Host "📤 Deploying: $funcName" -ForegroundColor Cyan

            & npx supabase functions deploy $funcName --project-ref $projectRef

            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ $funcName erfolgreich deployed" -ForegroundColor Green
            } else {
                Write-Host "❌ Deployment fehlgeschlagen" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Function '$funcName' nicht gefunden" -ForegroundColor Red
        }
    }

    "4" {
        Write-Host "❌ Abgebrochen." -ForegroundColor Red
        exit 0
    }

    default {
        Write-Host "❌ Ungültige Option" -ForegroundColor Red
        exit 1
    }
}

# ========================
# 5. STRIPE SECRETS KONFIGURIEREN
# ========================
Write-Host ""
Write-Host "🔐 Schritt 5/5: Stripe Secrets konfigurieren..." -ForegroundColor Yellow
Write-Host ""

Write-Host "⚠️  Stripe Secrets müssen manuell im Supabase Dashboard gesetzt werden:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. Öffne: https://supabase.com/dashboard/project/$projectRef/settings/functions" -ForegroundColor White
Write-Host "   2. Gehe zu Secrets Tab" -ForegroundColor White
Write-Host "   3. Setze folgende Secrets:" -ForegroundColor White
Write-Host ""
Write-Host "      STRIPE_SECRET_KEY=sk_live_..." -ForegroundColor Gray
Write-Host "      STRIPE_WEBHOOK_SECRET=whsec_..." -ForegroundColor Gray
Write-Host "      STRIPE_PUBLISHABLE_KEY=pk_live_..." -ForegroundColor Gray
Write-Host "      STRIPE_PRICE_STARTER_MONTHLY=price_1..." -ForegroundColor Gray
Write-Host "      STRIPE_PRICE_STARTER_YEARLY=price_1..." -ForegroundColor Gray
Write-Host "      STRIPE_PRICE_BUSINESS_MONTHLY=price_1..." -ForegroundColor Gray
Write-Host "      STRIPE_PRICE_BUSINESS_YEARLY=price_1..." -ForegroundColor Gray
Write-Host "      STRIPE_PRICE_ENTERPRISE_MONTHLY=price_1..." -ForegroundColor Gray
Write-Host "      STRIPE_PRICE_ENTERPRISE_YEARLY=price_1..." -ForegroundColor Gray
Write-Host ""

$openDashboard = Read-Host "Dashboard jetzt öffnen? (y/n)"
if ($openDashboard -eq "y") {
    Start-Process "https://supabase.com/dashboard/project/$projectRef/settings/functions"
    Write-Host "🌐 Dashboard geöffnet" -ForegroundColor Green
}

# ========================
# FERTIG
# ========================
Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Deployment abgeschlossen!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Nächste Schritte:" -ForegroundColor Yellow
Write-Host "   1. ✅ Edge Functions deployed" -ForegroundColor Green
Write-Host "   2. ⚠️  Stripe Secrets im Dashboard setzen" -ForegroundColor Yellow
Write-Host "   3. 🧪 Teste Stripe Checkout: https://www.my-dispatch.de/register" -ForegroundColor White
Write-Host "   4. 📧 Teste Email Functions: https://www.my-dispatch.de/bookings/new" -ForegroundColor White
Write-Host ""
Write-Host "📚 Dokumentation:" -ForegroundColor Cyan
Write-Host "   - EDGE_FUNCTIONS_DEPLOYMENT_MANUAL.md" -ForegroundColor White
Write-Host "   - TODO_COMPLETION_REPORT.md" -ForegroundColor White
Write-Host ""
