# 📧 E-MAIL KONFIGURATION FIX

**Problem:** E-Mails werden nicht versendet  
**Ursache:** `RESEND_API_KEY` fehlt in Supabase Edge Functions Secrets  
**Lösung:** 3 Minuten Setup

---

## ⚡ SOFORT-LÖSUNG

### Schritt 1: Supabase Dashboard öffnen

```
https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/settings/functions
```

### Schritt 2: Secret hinzufügen

1. Klicke auf **"Secrets"** Tab
2. Klicke **"Add new secret"**
3. Trage ein:

```
Name:  RESEND_API_KEY
Value: re_QLd5UEuy_65ESCwqXFrSaHzuSTaS8LTGd
```

4. Klicke **"Save"**

### Schritt 3: Optional - Domain Secrets

```
Name:  RESEND_DOMAIN
Value: send.nexify-automate.com
```

```
Name:  RESEND_FROM_EMAIL
Value: noreply@send.nexify-automate.com
```

---

## ✅ ERGEBNIS

Nach dem Secret-Setup funktionieren **alle 16 E-Mail-Funktionen**:

- ✅ Registrierungs-Bestätigung
- ✅ Passwort-Reset
- ✅ Buchungsbestätigungen
- ✅ Fahrer-Einladungen
- ✅ Kunden-Credentials
- ✅ Demo-Anfragen
- ✅ Chat-Consent (DSGVO)
- ✅ Kontaktformular
- ✅ Launch-Ankündigungen
- ✅ Kündigungsbestätigungen
- ✅ Booking PDFs
- ✅ Datenexport (DSGVO)
- ✅ Nexify Kontakt
- ✅ Template E-Mails
- ✅ System Alerts
- ✅ Generische E-Mails

---

## 🧪 FUNKTIONSTEST (PowerShell)

### Test: Password Reset E-Mail

```powershell
$body = @{
    email = "test@example.com"
    resetLink = "https://my-dispatch.de/reset?token=test123"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/send-password-reset" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

**Erwartete Antwort:**

```json
{
  "success": true,
  "messageId": "resend_abc123..."
}
```

---

## 🔍 VERIFIKATION

1. Gehe zu **Resend Dashboard**: https://resend.com/emails
2. Filter nach Domain: `send.nexify-automate.com`
3. Schaue nach Test-E-Mails

---

## ✅ CHECKLISTE

- [ ] Supabase Dashboard → Edge Functions → Secrets geöffnet
- [ ] `RESEND_API_KEY` Secret hinzugefügt
- [ ] `RESEND_DOMAIN` Secret hinzugefügt (optional)
- [ ] Test-E-Mail versendet
- [ ] E-Mail im Resend Dashboard sichtbar
- [ ] E-Mail im Posteingang angekommen

**Nach diesen Schritten: E-Mail-System 100% funktionsfähig! 🚀**
