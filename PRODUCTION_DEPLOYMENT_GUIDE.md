# 🚀 MyDispatch V32.5 - Production Deployment Guide

**Status:** ✅ READY FOR PRODUCTION
**Date:** 2025-11-24
**Target:** Supabase Production (ygpwuiygivxoqtyoigtg)

---

## 📋 Deployment Checklist

### Phase 1: Voraussetzungen ✅

- [x] TypeScript 0 errors
- [x] npm audit 0 vulnerabilities (Vite 6.4.1)
- [x] Build successful (55s)
- [x] Git pushed to main branch
- [x] Vercel auto-deploy triggered

### Phase 2: Edge Functions Deployment 🚀

- [ ] 111 Edge Functions bereit
- [ ] 8 Critical Functions deployen
- [ ] 9 Stripe Secrets konfigurieren

### Phase 3: Testing & Validation 🧪

- [ ] Stripe Checkout testen
- [ ] Email Functions validieren
- [ ] Brain Query testen
- [ ] Production URLs prüfen

---

## 🔐 Required Secrets for Supabase

### 1. Stripe API Keys (PRODUCTION)

Diese Keys müssen aus dem Stripe Dashboard geholt werden:

**Stripe Dashboard:** https://dashboard.stripe.com/apikeys

```bash
# Live/Production Keys
STRIPE_SECRET_KEY=sk_live_HIER_EINTRAGEN
STRIPE_WEBHOOK_SECRET=whsec_HIER_EINTRAGEN  # Nach Webhook-Erstellung
STRIPE_PUBLISHABLE_KEY=pk_live_HIER_EINTRAGEN
```

**Stripe Price IDs** (bereits konfiguriert - NO CHANGES needed):

```bash
STRIPE_PRICE_STARTER_MONTHLY=price_1SIBMrLX5M8TT990zBX6gWOm
STRIPE_PRICE_STARTER_YEARLY=price_1SIbRALX5M8TT990B81vhHPT
STRIPE_PRICE_BUSINESS_MONTHLY=price_1SIBN9LX5M8TT990mxE8owxm
STRIPE_PRICE_BUSINESS_YEARLY=price_1SIbRKLX5M8TT990e1vX4ebf
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_1QkbDcC2Q9bhAGYzYf2YH6bm
STRIPE_PRICE_ENTERPRISE_YEARLY=price_1QkejZC2Q9bhAGYzIuPMEW3H
```

---

## 🔧 Setup Instructions

### Step 1: Configure Stripe Webhook

1. **Öffne Stripe Webhooks:**
   - https://dashboard.stripe.com/webhooks

2. **Füge neuen Endpoint hinzu:**
   - **URL:** `https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/stripe-webhook`
   - **Events:** Wähle diese Events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `charge.refunded`
     - `invoice.payment_succeeded`

3. **Kopiere Webhook Secret:**
   - Zeige den Endpoint
   - Kopiere "Signing secret" (beginnt mit `whsec_`)

### Step 2: Configure Supabase Secrets

1. **Öffne Supabase Dashboard:**
   - https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/functions

2. **Gehe zu "Secrets" Tab**

3. **Füge 9 Secrets hinzu:**

   **STRIPE_SECRET_KEY**

   ```
   sk_live_HIER_KOPIEREN
   ```

   **STRIPE_WEBHOOK_SECRET**

   ```
   whsec_HIER_KOPIEREN
   ```

   **STRIPE_PUBLISHABLE_KEY**

   ```
   pk_live_HIER_KOPIEREN
   ```

   **Price IDs** (einfach kopieren):

   ```
   STRIPE_PRICE_STARTER_MONTHLY: price_1SIBMrLX5M8TT990zBX6gWOm
   STRIPE_PRICE_STARTER_YEARLY: price_1SIbRALX5M8TT990B81vhHPT
   STRIPE_PRICE_BUSINESS_MONTHLY: price_1SIBN9LX5M8TT990mxE8owxm
   STRIPE_PRICE_BUSINESS_YEARLY: price_1SIbRKLX5M8TT990e1vX4ebf
   STRIPE_PRICE_ENTERPRISE_MONTHLY: price_1QkbDcC2Q9bhAGYzYf2YH6bm
   STRIPE_PRICE_ENTERPRISE_YEARLY: price_1QkejZC2Q9bhAGYzIuPMEW3H
   ```

### Step 3: Deploy Edge Functions

**Option A: Via GitHub Workflow (Recommended)**

1. **Öffne GitHub Actions:**
   - https://github.com/MyDispatch/mydispatch-rebuild/actions/workflows/deploy-production.yml

2. **Klicke "Run workflow"**

3. **Setze Options:**
   - `deploy_functions`: ✅ true
   - `deploy_secrets`: ✅ true

4. **Klicke "Run workflow"**

**Option B: Local Deployment (requires Docker)**

```bash
# Supabase Login
npx supabase login

# Link Project
npx supabase link --project-ref ygpwuiygivxoqtyoigtg

# Deploy all functions
npm run deploy:functions

# Or deploy specific functions
npx supabase functions deploy create-checkout --project-ref ygpwuiygivxoqtyoigtg
npx supabase functions deploy stripe-webhook --project-ref ygpwuiygivxoqtyoigtg
npx supabase functions deploy check-subscription --project-ref ygpwuiygivxoqtyoigtg
```

---

## 🧪 Validation Tests

### Test 1: Stripe Checkout

1. **Öffne Registration Page:**
   - https://www.my-dispatch.de/register

2. **Starte Checkout:**
   - Wähle Tarif (z.B. "Business Monthly")
   - Klicke "Subscribe"

3. **Validate:**
   - Stripe Checkout Modal öffnet sich
   - Edge Function `create-checkout` wird aufgerufen
   - Payment erfolgt (oder Test mit Stripe Test Card: `4242 4242 4242 4242`)

### Test 2: Email Notifications

1. **Erstelle neue Booking:**
   - https://www.my-dispatch.de/bookings/new

2. **Validate:**
   - Email wird versendet
   - Edge Function `send-booking-email` läuft
   - Email kommt an

### Test 3: Subscription Status

1. **Prüfe Subscription:**
   - Nach Payment: Dashboard zeigt aktives Abonnement
   - Edge Function `check-subscription` wird aufgerufen
   - Company record aktualisiert sich

### Test 4: Edge Function Logs

1. **Öffne Function Logs:**
   - https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/functions

2. **Prüfe auf Fehler:**
   - Keine `ERROR` oder `FATAL` logs
   - `create-checkout` hat ausgeführt
   - `stripe-webhook` hat ausgeführt

---

## 📊 Deployment Metrics

### Frontend (Vercel)

- ✅ Auto-deployed from main branch
- ✅ TypeScript: 0 errors
- ✅ Build size: ~1.2MB (optimized)
- ✅ Deployment URL: https://www.my-dispatch.de

### Backend (Supabase)

- 🚀 111 Edge Functions ready
- 🔐 9 Stripe Secrets required
- 📡 Realtime subscriptions active
- 🗄️ 57 tables with RLS enabled

### Database (PostgreSQL)

- ✅ 225+ migrations applied
- ✅ RLS policies enforced
- ✅ Soft deletes enabled
- ✅ Audit logging active

---

## ⚠️ Critical Checklist

Before going LIVE:

- [ ] All Stripe Keys are PRODUCTION keys (sk*live*, pk*live*)
- [ ] NOT test keys (sk*test*, pk*test*)
- [ ] Webhook endpoint is configured correctly
- [ ] All 9 Stripe Secrets in Supabase
- [ ] Edge Functions deployed successfully
- [ ] No errors in Function logs
- [ ] Test checkout works end-to-end
- [ ] Email notifications work
- [ ] SSL certificate valid
- [ ] Monitoring configured

---

## 🆘 Troubleshooting

### Problem: "Invalid access token format"

**Solution:** Token muss von https://supabase.com/dashboard/account/tokens kommen (format: `sbp_...`)

### Problem: Edge Function deployment fails

**Solution:** Docker wird benötigt. Nutze stattdessen GitHub Actions Workflow.

### Problem: Stripe Webhook not triggering

**Solution:**

1. Prüfe Webhook URL in Stripe Dashboard
2. Prüfe Webhook Secret in Supabase
3. Prüfe Edge Function logs auf Errors

### Problem: Checkout Session not created

**Solution:**

1. Prüfe STRIPE_SECRET_KEY ist gesetzt
2. Prüfe Price IDs sind korrekt
3. Prüfe Edge Function logs

---

## 📚 Related Documentation

- `EDGE_FUNCTIONS_DEPLOYMENT_MANUAL.md` - Detailed Edge Functions guide
- `TODO_COMPLETION_REPORT.md` - All completed tasks
- `DEPLOY_NOW.ps1` - PowerShell deployment script
- `.github/workflows/deploy-production.yml` - GitHub Actions workflow

---

## 🎯 Next Steps

1. **Configure Stripe Webhook** (5 mins)
2. **Add Stripe Secrets to Supabase** (5 mins)
3. **Run GitHub Actions Workflow** (10 mins)
4. **Run Validation Tests** (5 mins)
5. **Monitor Production** (ongoing)

**Estimated Total Time:** 25 minutes

---

**Created:** 2025-11-24
**Project:** MyDispatch V32.5
**Environment:** Production
**Status:** 🚀 READY TO DEPLOY
