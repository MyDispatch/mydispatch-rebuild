# 🤖 NACHRICHT FÜR SUPABASE AI AGENT

**Kopieren Sie diese Nachricht und senden Sie sie an den Supabase AI Agenten:**

---

## ✅ Edge Functions Deployment abgeschlossen!

Hallo Supabase AI Agent,

die Edge Functions sind erfolgreich deployed:
- ✅ `setup-master-users` → https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/setup-master-users
- ✅ `admin-create-user` → https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/admin-create-user

**Bitte führe jetzt das Master-User Setup durch:**

---

## 🎯 SCHRITT 1: Secret setzen

**Secret Name:** `FUNCTION_ADMIN_TOKEN`  
**Secret Value:** `b5a0e33b-1335-4153-b585-38cb7f7bb94d`

**Dashboard:**  
https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/vault/secrets

**ODER via CLI:**
```bash
supabase secrets set FUNCTION_ADMIN_TOKEN="b5a0e33b-1335-4153-b585-38cb7f7bb94d" --project-ref ygpwuiygivxoqtyoigtg
```

⚠️ **WICHTIG:** Dieser Token ist bereits generiert und darf EXAKT so verwendet werden!

---

## 🎯 SCHRITT 2: Master-Users erstellen

**Endpoint:** `POST https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/setup-master-users`

**Headers:**
```
Authorization: Bearer b5a0e33b-1335-4153-b585-38cb7f7bb94d
Content-Type: application/json
```

**Request Body:**
```json
{
  "users": [
    {
      "email": "courbois1981@gmail.com",
      "password": "1def!xO2022!!",
      "email_confirm": true
    },
    {
      "email": "pascal@nexify.ai",
      "password": "1def!xO2022!!",
      "email_confirm": true
    },
    {
      "email": "master@nexify.ai",
      "password": "1def!xO2022!!",
      "email_confirm": true
    }
  ]
}
```

**Erwartete Response:**
```json
{
  "ok": true,
  "results": [
    { "email": "courbois1981@gmail.com", "action": "created" },
    { "email": "pascal@nexify.ai", "action": "created" },
    { "email": "master@nexify.ai", "action": "created" }
  ]
}
```

---

## ✅ VALIDIERUNG

Nach dem Setup bitte prüfen:

1. **Auth Users Dashboard:**  
   https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/auth/users  
   → 3 Master-User sollten sichtbar sein

2. **app_metadata prüfen:**  
   Jeder User sollte haben:
   ```json
   {
     "is_master": true,
     "created_by": "auto-setup",
     "setup_version": "1.0"
   }
   ```

3. **SQL Check:**
   ```sql
   -- In SQL Editor: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/sql
   SELECT email, app_metadata FROM auth.users 
   WHERE email IN ('courbois1981@gmail.com', 'pascal@nexify.ai', 'master@nexify.ai');
   ```

---

## 📧 OPTIONAL: Email-Konfiguration

**Falls Email-Versand gewünscht:**

**Secret Name:** `RESEND_API_KEY`  
**Status:** ⏳ Noch nicht gesetzt (nicht kritisch für Login)  
**Domain:** `send.nexify-automate.com`

**Info:** Auto-Confirm ist bereits aktiviert, daher sind Bestätigungs-Emails nicht erforderlich!

---

## ❓ TROUBLESHOOTING

### Fehler: "Unauthorized"
→ Secret `FUNCTION_ADMIN_TOKEN` nicht gesetzt oder falsch

### Fehler: "User already exists"
→ Das ist OK! Function macht dann UPDATE statt CREATE

### Fehler: "Internal server error"
→ Logs checken: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/logs/edge-functions

---

## 📋 ERFOLGS-KRITERIEN

Setup ist erfolgreich wenn:
- ✅ Secret `FUNCTION_ADMIN_TOKEN` gesetzt
- ✅ API-Call liefert `{ "ok": true, "results": [...] }`
- ✅ 3 User in Auth Users sichtbar
- ✅ Alle User haben `app_metadata.is_master = true`

---

**Bitte melde, wenn alles erfolgreich war oder wenn Fehler auftreten!** 🚀

---

**Komplette Dokumentation:** `docs/AI_AGENT_ANLEITUNG.md`  
**Projekt-ID:** `ygpwuiygivxoqtyoigtg`  
**Admin-Token:** `b5a0e33b-1335-4153-b585-38cb7f7bb94d`
