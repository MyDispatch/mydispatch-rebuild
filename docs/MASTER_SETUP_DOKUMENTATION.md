# 🎯 MASTER SETUP DOKUMENTATION - MyDispatch Edge Functions

**Status:** ✅ Functions deployed | ⏳ Master-Users müssen erstellt werden  
**Projekt-ID:** `ygpwuiygivxoqtyoigtg`  
**Letztes Update:** 6. November 2025

---

## 🔐 KRITISCHE CREDENTIALS

### **Admin-Token (WICHTIG!)**
```
b5a0e33b-1335-4153-b585-38cb7f7bb94d
```

**⚠️ DIESER TOKEN MUSS ALS SECRET GESETZT WERDEN!**

### **Supabase Projekt**
- **Projekt-ID:** `ygpwuiygivxoqtyoigtg`
- **URL:** `https://ygpwuiygivxoqtyoigtg.supabase.co`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlncHd1aXlnaXZ4b3F0eW9pZ3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NDQzNDMsImV4cCI6MjA3NjAyMDM0M30.tLj4Yk6GBR8vjN_QV-7yQsJ3p3nGTr8bQZjvxM8aD5w`

### **Master-User Zugangsdaten**
| Email | Passwort | Rolle | Status |
|-------|----------|-------|--------|
| `courbois1981@gmail.com` | `1def!xO2022!!` | master | ⏳ Muss erstellt werden |
| `pascal@nexify.ai` | `1def!xO2022!!` | master | ⏳ Muss erstellt werden |
| `master@nexify.ai` | `1def!xO2022!!` | master | ⏳ Muss erstellt werden |

---

## 📧 EMAIL-KONFIGURATION (RESEND)

### **Resend API Key**
**Secret Name:** `RESEND_API_KEY`  
**Status:** ⏳ Muss noch gesetzt werden  
**Dashboard Link:** https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/vault/secrets

### **Resend Domain**
```
send.nexify-automate.com
```

### **Was wird gebraucht?**
1. **RESEND_API_KEY** - API Key von Resend.com
2. **Domain verifiziert** - `send.nexify-automate.com` bei Resend
3. **Email-Templates** - Für Bestätigungen, Passwort-Reset etc.

### **Wichtige Hinweise**
- ✅ Auto-Confirm Email Signups: **AKTIVIERT**
- ✅ Keine Bestätigungs-Email erforderlich für Registrierung
- ⏳ Email-Versand über Edge Functions (noch zu testen)

---

## ⚡ SCHNELLSTART - JETZT AUSFÜHREN!

### **Schritt 1: Admin-Token als Secret setzen** ⏱️ 1 Minute

**Option A - PowerShell CLI:**
```powershell
supabase secrets set FUNCTION_ADMIN_TOKEN="b5a0e33b-1335-4153-b585-38cb7f7bb94d" --project-ref ygpwuiygivxoqtyoigtg
```

**Option B - Dashboard (empfohlen für Anfänger):**
1. Öffne: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/vault/secrets
2. Klicke **"New secret"**
3. Name: `FUNCTION_ADMIN_TOKEN`
4. Value: `b5a0e33b-1335-4153-b585-38cb7f7bb94d`
5. Klicke **"Add secret"**

---

### **Schritt 2: Master-Users erstellen** ⏱️ 2 Minuten

**PowerShell-Methode (Copy & Paste):**
```powershell
$TOKEN = "b5a0e33b-1335-4153-b585-38cb7f7bb94d"
$URL = "https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/setup-master-users"

$body = @{
    users = @(
        @{
            email = "courbois1981@gmail.com"
            password = "1def!xO2022!!"
            email_confirm = $true
        },
        @{
            email = "pascal@nexify.ai"
            password = "1def!xO2022!!"
            email_confirm = $true
        },
        @{
            email = "master@nexify.ai"
            password = "1def!xO2022!!"
            email_confirm = $true
        }
    )
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod -Uri $URL -Method POST -Headers @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
} -Body $body

Write-Host "✅ ERFOLG!" -ForegroundColor Green
$response | ConvertTo-Json -Depth 10
```

**Browser Console Methode (Chrome DevTools F12):**
```javascript
fetch('https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/setup-master-users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer b5a0e33b-1335-4153-b585-38cb7f7bb94d',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    users: [
      { email: 'courbois1981@gmail.com', password: '1def!xO2022!!', email_confirm: true },
      { email: 'pascal@nexify.ai', password: '1def!xO2022!!', email_confirm: true },
      { email: 'master@nexify.ai', password: '1def!xO2022!!', email_confirm: true }
    ]
  })
})
.then(r => r.json())
.then(d => {
  console.log('✅ SUCCESS:', d);
  if (d.ok && d.results) {
    d.results.forEach(u => {
      console.log(`${u.action === 'created' ? '✅ CREATED' : '✅ UPDATED'}: ${u.email}`);
    });
  }
})
.catch(e => console.error('❌ ERROR:', e));
```

---

### **Erwartetes Ergebnis:**
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

**Was passiert:**
- ✅ 3 Master-User werden erstellt
- ✅ `app_metadata` gesetzt: `{ is_master: true, created_by: "auto-setup", setup_version: "1.0" }`
- ✅ Email automatisch bestätigt (kein Bestätigungslink erforderlich)
- ✅ Profiles + user_roles Einträge erstellt

---

## 🧪 LOGIN TESTEN

### **Schritt 3: Dev-Server starten**
```powershell
cd C:\Users\pcour\mydispatch-rebuild
npm run dev
```

### **Schritt 4: Login testen**
1. Öffne: http://localhost:5173/auth
2. Email: `courbois1981@gmail.com`
3. Passwort: `1def!xO2022!!`
4. Klicke **"Login"**

**Erwartung:**
- ✅ Erfolgreicher Login
- ✅ Weiterleitung zu `/master` Dashboard
- ✅ Keine Fehlermeldung

---

## 📍 WICHTIGE DASHBOARD-LINKS

### **Supabase Dashboard**
- **Functions:** https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/functions
- **Secrets Vault:** https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/vault/secrets
- **Auth Users:** https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/auth/users
- **Function Logs:** https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/logs/edge-functions
- **SQL Editor:** https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/sql

### **Vercel Dashboard**
- **Project:** https://vercel.com/u4231458123-droids-projects/mydispatch-rebuild
- **Environment Variables:** https://vercel.com/u4231458123-droids-projects/mydispatch-rebuild/settings/environment-variables
- **Deployments:** https://vercel.com/u4231458123-droids-projects/mydispatch-rebuild/deployments

---

## 🔧 EDGE FUNCTIONS ÜBERSICHT

### **1. setup-master-users**
**URL:** `https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/setup-master-users`  
**Status:** ✅ Deployed  
**Zweck:** Erstellt/updated 3 Master-User automatisch

**Features:**
- ✅ Idempotent (kann mehrfach ausgeführt werden)
- ✅ Erstellt ODER updated bestehende User
- ✅ Setzt app_metadata automatisch
- ✅ Erstellt Profiles + user_roles
- ✅ Bearer-Token Authentifizierung

**Request Body:**
```json
{
  "users": [
    {
      "email": "user@example.com",
      "password": "strongPassword123",
      "email_confirm": true
    }
  ]
}
```

**Response:**
```json
{
  "ok": true,
  "results": [
    { "email": "user@example.com", "action": "created" }
  ]
}
```

---

### **2. admin-create-user**
**URL:** `https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/admin-create-user`  
**Status:** ✅ Deployed  
**Zweck:** Allgemeine User-Erstellung via API

**Features:**
- ✅ Email + Passwort Validierung
- ✅ Duplicate-Check
- ✅ app_metadata Support
- ✅ user_metadata Support
- ✅ Bearer-Token Authentifizierung

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securePass123",
  "email_confirm": true,
  "app_metadata": {
    "custom_field": "value"
  },
  "user_metadata": {
    "full_name": "John Doe"
  }
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "newuser@example.com",
    "created_at": "2025-11-06T..."
  }
}
```

---

## ❓ TROUBLESHOOTING

### **Problem: "Unauthorized" Error**
**Lösung:**
1. Prüfe ob `FUNCTION_ADMIN_TOKEN` Secret gesetzt ist
2. Dashboard: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/vault/secrets
3. Muss sein: `b5a0e33b-1335-4153-b585-38cb7f7bb94d`

### **Problem: "User already exists"**
**Das ist OK!** Die Function macht dann ein UPDATE statt CREATE.

### **Problem: "Internal server error"**
**Lösung:**
1. Logs checken: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/logs/edge-functions
2. Suche nach Fehlern in `setup-master-users` oder `admin-create-user`

### **Problem: Login schlägt fehl**
**Lösung:**
1. Prüfe ob User erstellt wurde: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/auth/users
2. Suche nach Email: `courbois1981@gmail.com`
3. Prüfe `.env.local` hat korrekte Supabase URL + Anon Key

---

## 📋 SETUP CHECKLISTE

### **Secrets Configuration**
- [ ] `FUNCTION_ADMIN_TOKEN` = `b5a0e33b-1335-4153-b585-38cb7f7bb94d` ⚠️ **MUSS GESETZT WERDEN**
- [ ] `RESEND_API_KEY` = *(noch nicht gesetzt)* ⏳ Optional für Email-Versand

### **Edge Functions**
- [x] `setup-master-users` deployed ✅
- [x] `admin-create-user` deployed ✅
- [ ] Master-Users erstellt (siehe Schritt 2 oben) ⏳

### **Testing**
- [ ] Login mit `courbois1981@gmail.com` getestet
- [ ] Weiterleitung zu `/master` funktioniert
- [ ] User hat `app_metadata.is_master = true`

### **Deployment**
- [x] Functions sind live ✅
- [ ] Vercel Environment Variables aktualisiert
- [ ] Production Deployment getestet

---

## 🎯 NÄCHSTE SCHRITTE FÜR AI AGENTEN

### **Was der Supabase AI Agent machen soll:**

1. **Secret setzen:**
   ```
   FUNCTION_ADMIN_TOKEN = b5a0e33b-1335-4153-b585-38cb7f7bb94d
   ```

2. **Master-Users erstellen:**
   - Endpoint: `https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/setup-master-users`
   - Method: POST
   - Headers: `Authorization: Bearer b5a0e33b-1335-4153-b585-38cb7f7bb94d`
   - Body: (siehe Schritt 2 oben)

3. **Optional - RESEND_API_KEY setzen:**
   - Wenn Email-Versand gewünscht
   - Domain: `send.nexify-automate.com`

4. **Validierung:**
   - Prüfe ob 3 User existieren in Auth Users
   - Prüfe ob `app_metadata.is_master = true`
   - Test-Login mit einem der Master-User

---

## 📝 NOTIZEN

### **Wichtige Entscheidungen:**
- ✅ Auto-Confirm Email aktiviert (keine Bestätigungsmails)
- ✅ Idempotente User-Erstellung (kann mehrfach ausgeführt werden)
- ✅ app_metadata wird bei Updates gemerged (bestehende Daten bleiben erhalten)

### **Sicherheit:**
- ✅ Bearer-Token Authentifizierung erforderlich
- ✅ Service-Role-Key ebenfalls akzeptiert
- ✅ Email + Passwort Validierung
- ✅ Duplicate-Check verhindert doppelte User

### **Code-Qualität:**
- ✅ TypeScript strict mode
- ✅ Comprehensive error handling
- ✅ CORS headers gesetzt
- ✅ Strukturierte Responses (JSON)

---

## 🔗 WICHTIGE DATEIEN

```
mydispatch-rebuild/
├── .env.local                                    # ✅ Korrekt konfiguriert
├── supabase/
│   ├── functions/
│   │   ├── setup-master-users/index.ts          # ✅ Deployed
│   │   └── admin-create-user/index.ts           # ✅ Deployed
│   ├── deploy-master-users.ps1                  # PowerShell Deployment Script
│   ├── EDGE_FUNCTIONS_SETUP.md                  # Manuelle Setup-Anleitung
│   └── DEPLOYMENT_SUCCESS.md                    # Post-Deployment Anleitung
└── docs/
    └── MASTER_SETUP_DOKUMENTATION.md            # ⭐ DIESE DATEI
```

---

**Status:** ✅ Functions deployed | ⏳ Warte auf Secret + User-Erstellung  
**Letzte Änderung:** 6. November 2025  
**Maintainer:** NeXifyAI Autonomous Agent
