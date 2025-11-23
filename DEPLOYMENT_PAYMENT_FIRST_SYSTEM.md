# ==================================================================================

# DEPLOYMENT-ANLEITUNG: Payment-First Registration System

# ==================================================================================

# Erstellt: 2025-11-22

# Status: CRITICAL - MUSS deployed werden damit Registrierungen funktionieren!

# ==================================================================================

## 1. EDGE FUNCTIONS DEPLOYEN

### Option A: Supabase CLI (empfohlen)

```powershell
# Stripe Webhook (NEU - erstellt Accounts nach Zahlung)
supabase functions deploy stripe-webhook

# Create Checkout (GEÄNDERT - unterstützt jetzt temp_signups)
supabase functions deploy create-checkout
```

### Option B: Supabase Dashboard

1. Gehe zu: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/functions
2. Erstelle neue Function "stripe-webhook"
   - Code: `supabase/functions/stripe-webhook/index.ts`
   - Environment Variables benötigt:
     - STRIPE_SECRET_KEY
     - STRIPE_WEBHOOK_SECRET (von Stripe Dashboard holen!)
3. Update existing "create-checkout" Function
   - Code: `supabase/functions/create-checkout/index.ts`

## 2. STRIPE WEBHOOK IN STRIPE DASHBOARD EINRICHTEN

1. Gehe zu: https://dashboard.stripe.com/webhooks
2. Klicke "Add endpoint"
3. URL: `https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/stripe-webhook`
4. Events to send (auswählen):
   - `checkout.session.completed` ← CRITICAL für Account Creation!
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Kopiere "Signing secret" (whsec\_...)
6. Speichere in Supabase Dashboard → Edge Functions → Secrets:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## 3. DATENBANK MIGRATION ANWENDEN

### Option A: Auto-Deploy via GitHub Integration

✅ Migration wurde bereits gepusht → sollte automatisch deployed werden

- Datei: `supabase/migrations/20251122000018_temp_signups_table.sql`
- Check in Dashboard: Database → Migrations

### Option B: Manuell

```powershell
supabase db push
```

### Option C: Supabase Dashboard SQL Editor

1. Gehe zu: SQL Editor
2. Kopiere Inhalt von `supabase/migrations/20251122000018_temp_signups_table.sql`
3. Execute

## 4. SUPABASE TYPES AKTUALISIEREN (TypeScript Errors fixen)

```powershell
# Types von Supabase holen
supabase gen types typescript --project-id ygpwuiygivxoqtyoigtg > src/integrations/supabase/types.ts

# ODER (wenn lokal verlinktes Projekt)
supabase db pull
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

## 5. MASTER-ACCOUNT ERSTELLEN

### SQL in Supabase Dashboard ausführen:

```sql
-- 1. Create Auth User
-- WICHTIG: Ersetze <HASHED_PASSWORD> durch bcrypt-Hash von "#25_FS.42-FKS!"
-- Verwende: https://bcrypt-generator.com/ mit Rounds=10

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'info@my-dispatch.de',
  '<HASHED_PASSWORD>', -- bcrypt hash von #25_FS.42-FKS!
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) RETURNING id;

-- 2. Create Company (Master Company)
INSERT INTO companies (
  name,
  company_slug,
  email,
  subscription_status
) VALUES (
  'MyDispatch Master',
  'master',
  'info@my-dispatch.de',
  'active'
) RETURNING id;

-- 3. Create Profile
-- WICHTIG: Ersetze <USER_ID> und <COMPANY_ID> mit IDs aus obigen Queries
INSERT INTO profiles (
  user_id,
  company_id,
  first_name,
  last_name,
  role
) VALUES (
  '<USER_ID>',
  '<COMPANY_ID>',
  'Master',
  'Account',
  'entrepreneur'
);

-- 4. Add Master Role
INSERT INTO user_roles (
  user_id,
  role
) VALUES (
  '<USER_ID>',
  'master'
);
```

## 6. DEMO-ACCOUNTS ERSTELLEN

Siehe: `supabase/seed_demo_accounts.sql` (TODO: noch zu erstellen)

## 7. TESTEN

### Test 1: Neue Registrierung (Payment-First)

1. Gehe zu: https://www.my-dispatch.de/auth?mode=signup
2. Wähle Tarif (Starter oder Business)
3. Fülle Formular komplett aus
4. Klicke "Jetzt registrieren"
5. ✅ ERWARTET: Redirect zu Stripe Checkout
6. Zahle mit Testkarte: 4242 4242 4242 4242, CVC: 123, Datum: 12/34
7. ✅ ERWARTET: Redirect zurück zu /auth?payment=success
8. ✅ ERWARTET: Account wird automatisch erstellt
9. ✅ ERWARTET: Auto-Login funktioniert

### Test 2: Master-Account Login

1. Gehe zu: https://www.my-dispatch.de/auth
2. Email: info@my-dispatch.de
3. Password: #25_FS.42-FKS!
4. ✅ ERWARTET: Login erfolgreich
5. ✅ ERWARTET: Master-Dashboard sichtbar (vereinfachte Ansicht)

### Test 3: Abgebrochene Zahlung

1. Registrierung starten wie Test 1
2. Auf Stripe-Seite: Klicke "Cancel"
3. ✅ ERWARTET: Redirect zu /auth?payment=canceled
4. ✅ ERWARTET: Fehlermeldung wird angezeigt
5. ✅ ERWARTET: temp_signups Eintrag bleibt mit status='pending'

## 8. TROUBLESHOOTING

### Problem: "No signup found" im Webhook Log

**Lösung:**

- Check temp_signups Tabelle: `SELECT * FROM temp_signups WHERE payment_status='pending';`
- Prüfe ob stripe_checkout_session_id korrekt gespeichert wurde

### Problem: Account wird nicht erstellt nach Zahlung

**Lösung:**

- Check Webhook Logs in Stripe Dashboard
- Check Supabase Logs: Functions → stripe-webhook → Logs
- Prüfe ob STRIPE_WEBHOOK_SECRET korrekt gesetzt ist

### Problem: TypeScript Errors in Auth.tsx

**Lösung:**

- Aktualisiere Supabase Types (Schritt 4)
- Wenn weiterhin Fehler: Ignoriere temporär mit `// @ts-ignore`

### Problem: Webhook wird nicht getriggert

**Lösung:**

- Check Stripe Dashboard → Webhooks → Test
- Prüfe ob Endpoint URL korrekt ist
- Prüfe ob Events ausgewählt sind (`checkout.session.completed`)

## 9. MONITORING

### Wichtige Logs überwachen:

1. **Supabase Functions:**
   - stripe-webhook
   - create-checkout

2. **Stripe Dashboard:**
   - Webhooks → Recent deliveries
   - Payments → Sessions

3. **Supabase Database:**

   ```sql
   -- Pending Signups (sollte nach Payment leer sein)
   SELECT * FROM temp_signups WHERE payment_status = 'pending' AND created_at > NOW() - INTERVAL '1 hour';

   -- Completed Signups (heute)
   SELECT * FROM temp_signups WHERE payment_status = 'completed' AND completed_at > CURRENT_DATE;

   -- Failed Signups
   SELECT * FROM temp_signups WHERE payment_status = 'failed';
   ```

## 10. CLEANUP

### Auto-Cleanup für abgelaufene Signups (Cron Job)

```sql
-- Erstelle Cleanup-Funktion
CREATE OR REPLACE FUNCTION cleanup_expired_temp_signups()
RETURNS void AS $$
BEGIN
  DELETE FROM temp_signups
  WHERE expires_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule via Supabase Dashboard (oder pg_cron)
-- Läuft täglich um 3:00 Uhr
```

## ==================================================================================

## DEPLOYMENT CHECKLIST

## ==================================================================================

- [ ] Edge Functions deployed (stripe-webhook, create-checkout)
- [ ] Stripe Webhook Endpoint erstellt & Secret gesetzt
- [ ] Migration angewendet (temp_signups Tabelle existiert)
- [ ] Supabase Types aktualisiert
- [ ] Master-Account erstellt (info@my-dispatch.de)
- [ ] Demo-Accounts erstellt
- [ ] Test 1: Neue Registrierung funktioniert
- [ ] Test 2: Master-Login funktioniert
- [ ] Test 3: Abgebrochene Zahlung handled
- [ ] Monitoring eingerichtet
- [ ] Cleanup Cron Job aktiv

## ==================================================================================

## IMPORTANT NOTES

## ==================================================================================

1. **STRIPE_WEBHOOK_SECRET ist KRITISCH!**
   - Ohne diesen Secret können Webhooks nicht verifiziert werden
   - Account-Creation schlägt fehl ohne funktionierende Webhooks

2. **Migration MUSS vor erstem Test angewendet sein**
   - Sonst existiert temp_signups Tabelle nicht
   - Registrierung schlägt sofort fehl

3. **Master-Account Password ist komplex**
   - Nutze Password Manager zum Speichern
   - Hash: bcrypt mit 10 Rounds

4. **TypeScript Errors sind temporär**
   - Nach Type-Update verschwinden sie
   - Blockieren NICHT die Funktionalität

## ==================================================================================

## NEXT STEPS NACH DEPLOYMENT

## ==================================================================================

1. Mindestvorlauf-Konfiguration (Todo #7)
2. Auftragsformular MwSt-Felder (Todo #8)
3. Form-Standardisierung Audit (Todo #9)
4. Email-Templates überarbeiten
5. Customer/Driver Portal Features
