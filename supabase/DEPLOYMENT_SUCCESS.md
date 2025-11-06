# ✅ EDGE FUNCTIONS DEPLOYED - JETZT MASTER-USERS ERSTELLEN!

## 🎉 **DEPLOYMENT ERFOLGREICH!**

Beide Functions sind live:
- ✅ `setup-master-users`: https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/setup-master-users
- ✅ `admin-create-user`: https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/admin-create-user

---

## ⚡ JETZT AUSFÜHREN (3 SCHRITTE)

### **Schritt 1: Secret setzen (falls noch nicht vorhanden)**

```powershell
supabase secrets set FUNCTION_ADMIN_TOKEN="b5a0e33b-1335-4153-b585-38cb7f7bb94d" --project-ref ygpwuiygivxoqtyoigtg
```

**ODER im Dashboard:**
https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/vault/secrets
- Name: `FUNCTION_ADMIN_TOKEN`
- Value: `b5a0e33b-1335-4153-b585-38cb7f7bb94d`

---

### **Schritt 2: Master-Users erstellen via Function**

**PowerShell:**
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

Invoke-RestMethod -Uri $URL -Method POST -Headers @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
} -Body $body
```

**Browser Console (F12):**
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
.then(d => console.log('✅ SUCCESS:', d))
.catch(e => console.error('❌ ERROR:', e))
```

---

### **Schritt 3: Erwartetes Ergebnis**

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

## 🧪 **LOGIN TESTEN**

Nach erfolgreichem Setup:

1. **Dev-Server starten:**
   ```powershell
   cd C:\Users\pcour\mydispatch-rebuild
   npm run dev
   ```

2. **Login testen:**
   - URL: http://localhost:5173/auth
   - Email: `courbois1981@gmail.com`
   - Passwort: `1def!xO2022!!`

3. **Erwartung:**
   - ✅ Erfolgreicher Login
   - ✅ Weiterleitung zu `/master`
   - ✅ `app_metadata` enthält: `{ is_master: true, created_by: "auto-setup", setup_version: "1.0" }`

---

## 🔑 **CREDENTIALS ÜBERSICHT**

**Master-User 1:**
- Email: courbois1981@gmail.com
- Passwort: 1def!xO2022!!
- app_metadata: { is_master: true, created_by: "auto-setup", setup_version: "1.0" }

**Master-User 2:**
- Email: pascal@nexify.ai
- Passwort: 1def!xO2022!!
- app_metadata: { is_master: true, created_by: "auto-setup", setup_version: "1.0" }

**Master-User 3:**
- Email: master@nexify.ai
- Passwort: 1def!xO2022!!
- app_metadata: { is_master: true, created_by: "auto-setup", setup_version: "1.0" }

**Admin-Token:**
- `b5a0e33b-1335-4153-b585-38cb7f7bb94d`

---

## 📍 **WICHTIGE LINKS**

- **Functions Dashboard:** https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/functions
- **Secrets Vault:** https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/vault/secrets
- **Auth Users:** https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/auth/users
- **Function Logs:** https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/logs/edge-functions

---

## ❓ **TROUBLESHOOTING**

### "Unauthorized" Error?
→ `FUNCTION_ADMIN_TOKEN` nicht gesetzt oder falsch (siehe Schritt 1)

### "User already exists"?
→ Das ist OK! Function macht UPDATE statt CREATE

### "Internal error"?
→ Logs checken: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/logs/edge-functions

---

**Status:** ✅ Functions deployed, bereit zur Ausführung!  
**Nächster Schritt:** Führe Schritt 2 aus (Master-Users erstellen)
