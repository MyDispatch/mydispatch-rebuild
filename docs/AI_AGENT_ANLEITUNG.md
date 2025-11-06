# 🤖 ANLEITUNG FÜR SUPABASE AI AGENT

**Projekt:** MyDispatch Edge Functions Setup  
**Datum:** 6. November 2025  
**Status:** Functions deployed ✅ | Master-Users müssen erstellt werden ⏳

---

## 🎯 AUFGABE: Master-User Setup abschließen

### **Was bereits erledigt ist:**
- ✅ Edge Function `setup-master-users` deployed
- ✅ Edge Function `admin-create-user` deployed
- ✅ Code ist produktionsbereit und getestet

### **Was JETZT gemacht werden muss:**

---

## ⚡ SCHRITT 1: Secret setzen (KRITISCH!)

**Secret Name:** `FUNCTION_ADMIN_TOKEN`  
**Secret Value:** `b5a0e33b-1335-4153-b585-38cb7f7bb94d`

**Dashboard Link:**  
https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/vault/secrets

**Wichtig:**
- ⚠️ Dieser Token MUSS EXAKT so gesetzt werden
- ⚠️ Keine Leerzeichen, keine Anführungszeichen im Wert
- ⚠️ Secret-Name groß/klein beachten: `FUNCTION_ADMIN_TOKEN`

---

## ⚡ SCHRITT 2: Master-Users erstellen

**Endpoint:**  
```
POST https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/setup-master-users
```

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

Nach der Ausführung bitte prüfen:

1. **User existieren?**
   - Dashboard: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/auth/users
   - Erwartung: 3 User sichtbar

2. **app_metadata korrekt?**
   - Jeder User sollte haben:
   ```json
   {
     "is_master": true,
     "created_by": "auto-setup",
     "setup_version": "1.0"
   }
   ```

3. **Profiles erstellt?**
   - SQL Editor: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/sql
   - Query:
   ```sql
   SELECT * FROM profiles WHERE role = 'master';
   ```
   - Erwartung: 3 Zeilen

4. **user_roles erstellt?**
   - Query:
   ```sql
   SELECT * FROM user_roles WHERE role = 'master';
   ```
   - Erwartung: 3 Zeilen

---

## 📧 OPTIONAL: Email-Konfiguration

**Falls Email-Versand gewünscht wird:**

**Secret Name:** `RESEND_API_KEY`  
**Secret Value:** *(API Key von Resend.com)*  
**Domain:** `send.nexify-automate.com`

**Status:** ⏳ Noch nicht konfiguriert (nicht kritisch für Login)

---

## ❌ FEHLERBEHANDLUNG

### Fehler: "Unauthorized"
**Grund:** Secret `FUNCTION_ADMIN_TOKEN` nicht gesetzt oder falsch  
**Lösung:** Schritt 1 wiederholen

### Fehler: "User already exists"
**Grund:** User wurde bereits erstellt  
**Lösung:** Das ist OK! Function macht dann UPDATE statt CREATE

### Fehler: "Internal server error"
**Grund:** Unerwarteter Fehler in Function  
**Lösung:** 
1. Logs checken: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/logs/edge-functions
2. Nach `setup-master-users` Fehlern suchen

---

## 🎯 ERFOLGS-KRITERIEN

Setup ist erfolgreich wenn:

- ✅ Secret `FUNCTION_ADMIN_TOKEN` gesetzt
- ✅ API-Call liefert `{ "ok": true, "results": [...] }`
- ✅ 3 User in Auth Users Dashboard sichtbar
- ✅ Alle User haben `app_metadata.is_master = true`
- ✅ 3 Profiles mit `role = 'master'` existieren
- ✅ 3 user_roles mit `role = 'master'` existieren

---

## 📋 QUICK REFERENCE

**Projekt-ID:** `ygpwuiygivxoqtyoigtg`  
**Admin-Token:** `b5a0e33b-1335-4153-b585-38cb7f7bb94d`  
**Master-Passwort:** `1def!xO2022!!`

**Master-Users:**
1. `courbois1981@gmail.com`
2. `pascal@nexify.ai`
3. `master@nexify.ai`

**Function URL:**  
`https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/setup-master-users`

---

## 💡 HINWEISE

1. **Idempotent:** Die Function kann mehrfach ausgeführt werden ohne Probleme
2. **Auto-Confirm:** Email-Bestätigung ist deaktiviert (Auto-Confirm: enabled)
3. **Merge Logic:** Bei Updates wird `app_metadata` gemerged, nicht überschrieben
4. **Sicherheit:** Bearer-Token oder Service-Role-Key erforderlich

---

**Viel Erfolg! 🚀**

Bei Fragen oder Problemen:
- Dokumentation: `docs/MASTER_SETUP_DOKUMENTATION.md`
- Function Code: `supabase/functions/setup-master-users/index.ts`
