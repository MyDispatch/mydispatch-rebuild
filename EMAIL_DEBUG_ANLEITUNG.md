# 📧 E-MAIL DEBUG ANLEITUNG - RESEND API

**Status:** 🔴 EMAILS KOMMEN NICHT AN  
**Grund:** `RESEND_API_KEY` fehlt in Supabase Secrets  
**Lösung:** Secret im Supabase Dashboard setzen

---

## ✅ SOFORT-LÖSUNG

### Schritt 1: Supabase Dashboard öffnen

1. Gehe zu: https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd
2. Login mit Admin-Account

### Schritt 2: Secret setzen

**Pfad:** Settings → Edge Functions → Secrets

**Füge hinzu:**
```
RESEND_API_KEY=re_QLd5UEuy_65ESCwqXFrSaHzuSTaS8LTGd
```

### Schritt 3: Edge Functions neu deployen (optional)

Falls nötig, deploye die Email-Functions neu:
```bash
supabase functions deploy send-password-reset
supabase functions deploy send-demo-request
supabase functions deploy send-registration-confirmation
supabase functions deploy send-template-email
supabase functions deploy send-customer-credentials
supabase functions deploy send-driver-invitation
supabase functions deploy send-chat-consent-email
supabase functions deploy send-launch-email
supabase functions deploy send-contact-email
supabase functions deploy send-termination-email
supabase functions deploy send-booking-pdf
supabase functions deploy send-data-export
supabase functions deploy send-nexify-contact
supabase functions deploy alert-manager
supabase functions deploy send-booking-email
```

---

## 📋 ALTERNATIVE: Supabase CLI (wenn Login funktioniert)

```bash
# 1. Login
supabase login

# 2. Link Project
supabase link --project-ref vsbqyqhzxmwezlhzdmfd

# 3. Set Secret
supabase secrets set RESEND_API_KEY=re_QLd5UEuy_65ESCwqXFrSaHzuSTaS8LTGd

# 4. Verify
supabase secrets list
```

---

## 🧪 FUNKTIONSTEST

Nach dem Setzen des Secrets:

### Test 1: Password Reset Email
```bash
curl -X POST https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/send-password-reset \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "resetLink": "https://my-dispatch.de/reset?token=test"}'
```

### Test 2: Demo Request Email
```bash
curl -X POST https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/send-demo-request \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test GmbH",
    "phone": "+49123456789"
  }'
```

---

## 🔍 ERWARTETE ANTWORT

**Erfolg:**
```json
{
  "success": true,
  "messageId": "resend_abc123..."
}
```

**Fehler (kein Secret):**
```json
{
  "error": "Email service not configured"
}
```

---

## 📊 PRÜFUNG IN RESEND DASHBOARD

1. Gehe zu: https://resend.com/emails
2. Login mit Resend Account
3. Prüfe "Sent Emails" Liste
4. Schaue nach Domain: `send.nexify-automate.com`

---

## ⚠️ WICHTIG

- **Verifizierte Domain:** `send.nexify-automate.com`
- **Alle 16 Email Functions** wurden bereits auf diese Domain aktualisiert ✅
- **Fehlt nur noch:** RESEND_API_KEY Secret in Supabase

Nach dem Setzen des Secrets sollten alle Emails sofort funktionieren!
