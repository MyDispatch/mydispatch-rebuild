# 🚀 Edge Functions Deployment - Manuelle Schritte

**Status:** ⚠️ MANUELLE AKTION ERFORDERLICH
**Erstellt:** 2025-01-08
**Priorität:** 🔴 KRITISCH (Blockiert payment-first Registration)

## Übersicht

**Edge Functions vorhanden:** 104 Funktionen implementiert
**Kritische Funktionen für Payment-First Registration:**

- `create-checkout` - Stripe Checkout Session erstellen
- `stripe-webhook` - Stripe Webhook Events verarbeiten
- `check-subscription` - Subscription Status prüfen
- `customer-portal` - Stripe Customer Portal

## 🔴 KRITISCHE VORAUSSETZUNGEN

### 1. Supabase CLI Login

```powershell
# Supabase CLI Login (aktuell nicht authentifiziert)
npx supabase login

# ODER: Access Token setzen (aktuelles Token ist abgelaufen)
$env:SUPABASE_ACCESS_TOKEN = "sbp_<neues_token_aus_dashboard>"
```

**Access Token holen:**

1. https://supabase.com/dashboard/account/tokens
2. "Generate New Token" → Name: "Edge Functions Deployment"
3. Token kopieren und in Umgebungsvariable setzen

### 2. Stripe API Keys konfigurieren

**Supabase Dashboard → Project Settings → Edge Functions → Secrets:**

```bash
# Stripe API Keys (Production)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Stripe Price IDs (Tarife)
STRIPE_PRICE_STARTER_MONTHLY=price_1...
STRIPE_PRICE_STARTER_YEARLY=price_1...
STRIPE_PRICE_BUSINESS_MONTHLY=price_1...
STRIPE_PRICE_BUSINESS_YEARLY=price_1...
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_1PpJXUP4K8YE9Q9Wq7p2lXYZ  # ⚠️ PLACEHOLDER
STRIPE_PRICE_ENTERPRISE_YEARLY=price_1...
```

**Secrets setzen via CLI:**

```powershell
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_...
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
npx supabase secrets set STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 📋 Deployment-Schritte

### Option A: Alle Edge Functions deployen (EMPFOHLEN)

```powershell
cd c:\Users\pcour\Desktop\MyDispatch_ALL\mydispatch-rebuild

# Alle Edge Functions deployen (104 Funktionen)
npm run deploy:functions

# ODER: Manuell via Supabase CLI
npx supabase functions deploy --project-ref ygpwuiygivxoqtyoigtg
```

### Option B: Nur kritische Payment Functions deployen

```powershell
# Einzelne Funktionen deployen
npx supabase functions deploy create-checkout --project-ref ygpwuiygivxoqtyoigtg
npx supabase functions deploy stripe-webhook --project-ref ygpwuiygivxoqtyoigtg
npx supabase functions deploy check-subscription --project-ref ygpwuiygivxoqtyoigtg
npx supabase functions deploy customer-portal --project-ref ygpwuiygivxoqtyoigtg
```

## ✅ Deployment Validation

### 1. Funktionen testen (nach Deployment)

```powershell
# create-checkout testen
curl -X POST https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/create-checkout `
  -H "Authorization: Bearer $env:VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY" `
  -H "Content-Type: application/json" `
  -d '{
    "tariff_id": "starter",
    "billing_period": "monthly",
    "customer_email": "test@example.com",
    "success_url": "https://www.my-dispatch.de/success",
    "cancel_url": "https://www.my-dispatch.de/cancel"
  }'

# Erwartetes Ergebnis: { "sessionId": "cs_test_...", "url": "https://checkout.stripe.com/..." }
```

### 2. Webhook konfigurieren (Stripe Dashboard)

**Nach Deployment:**

1. https://dashboard.stripe.com/webhooks
2. "Add endpoint" → URL: `https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/stripe-webhook`
3. Events auswählen:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Webhook Secret kopieren → Als `STRIPE_WEBHOOK_SECRET` in Supabase setzen

### 3. Logs überprüfen

```powershell
# Echtzeit Logs anschauen
npx supabase functions logs create-checkout --project-ref ygpwuiygivxoqtyoigtg --tail

# Fehler checken
npx supabase functions logs create-checkout --project-ref ygpwuiygivxoqtyoigtg --level error
```

## 🐛 Troubleshooting

### Problem: "Unauthorized" beim Deployment

**Lösung:** Access Token aktualisieren

```powershell
# Neues Token aus Supabase Dashboard holen
$env:SUPABASE_ACCESS_TOKEN = "sbp_<neues_token>"
```

### Problem: "Stripe API Key not found"

**Lösung:** Secrets konfigurieren (siehe oben)

```powershell
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_...
```

### Problem: Webhook Events kommen nicht an

**Lösung 1:** Webhook Secret prüfen

```powershell
# Secret aus Stripe Dashboard kopieren
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

**Lösung 2:** Stripe CLI für lokales Testing

```powershell
stripe listen --forward-to https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/stripe-webhook
```

### Problem: Edge Function läuft nicht

**Lösung:** Logs checken für spezifische Fehler

```powershell
npx supabase functions logs create-checkout --level error --limit 50
```

## 📊 Status-Check Commands

```powershell
# Deployed Functions auflisten
npx supabase functions list --project-ref ygpwuiygivxoqtyoigtg

# Function Details
npx supabase functions get create-checkout --project-ref ygpwuiygivxoqtyoigtg

# Secrets auflisten (ohne Werte anzuzeigen)
npx supabase secrets list --project-ref ygpwuiygivxoqtyoigtg
```

## 🎯 Erfolgs-Kriterien

- ✅ `create-checkout` deployed und erreichbar (Status 200)
- ✅ `stripe-webhook` deployed und erreichbar
- ✅ Stripe Webhook in Stripe Dashboard konfiguriert
- ✅ Alle Secrets gesetzt (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, etc.)
- ✅ Test-Checkout erstellt und erfolgreich abgeschlossen
- ✅ Webhook Events in `stripe-webhook` Logs sichtbar

## ⚠️ WICHTIG: Nach Deployment

**Frontend .env.local aktualisieren:**

```bash
# Stripe Publishable Key (für Frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Bestätigen dass Edge Functions URL korrekt ist
VITE_SUPABASE_URL=https://ygpwuiygivxoqtyoigtg.supabase.co
```

**Production Build neu deployen:**

```powershell
npm run build
git add -A
git commit -m "feat: add Stripe Edge Functions secrets"
git push origin master  # Triggers Vercel deployment
```

## 📝 Nächste Schritte nach Deployment

1. ✅ Payment-First Registration Flow testen:
   - Registrierung starten → Stripe Checkout
   - Zahlung abschließen
   - Account automatisch aktiviert
   - Login möglich

2. ✅ Subscription Management testen:
   - Upgrade/Downgrade zwischen Tarifen
   - Kündigungen
   - Rechnungsstellung

3. ✅ Webhook Monitoring einrichten:
   - Supabase Dashboard → Edge Functions → Logs
   - Stripe Dashboard → Webhooks → Events
   - n8n Workflow für Alert bei Webhook-Fehlern

---

**Verantwortlich:** DevOps / Deployment Team
**Zeitaufwand:** 30-60 Minuten
**Dokumentation:** [Stripe Integration Guide](STRIPE_INTEGRATION_GUIDE.md)
