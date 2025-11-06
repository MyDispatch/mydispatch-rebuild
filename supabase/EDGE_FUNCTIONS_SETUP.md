# 🎯 MASTER-USER SETUP - DIREKT VIA SUPABASE DASHBOARD
# Falls Supabase CLI nicht verfügbar ist

## ⚡ SCHNELLSTART (3 Minuten)

### Schritt 1: Edge Functions hochladen (1 Min)

**Dashboard öffnen:**
```
https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/functions
```

**Zwei Functions erstellen:**

#### Function 1: `admin-create-user`
1. Klicke "Create a new function"
2. Name: `admin-create-user`
3. Code aus: `supabase/functions/admin-create-user/index.ts` kopieren
4. "Deploy function" klicken

#### Function 2: `setup-master-users`
1. Klicke "Create a new function"
2. Name: `setup-master-users`
3. Code aus: `supabase/functions/setup-master-users/index.ts` kopieren
4. "Deploy function" klicken

---

### Schritt 2: Admin-Token als Secret setzen (30 Sek)

**Secrets öffnen:**
```
https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/vault/secrets
```

**Secret erstellen:**
- Name: `FUNCTION_ADMIN_TOKEN`
- Value: `MyDispatch_Master_2025_SecureToken_ygpwuiygivxoqtyoigtg`
- "Add secret" klicken

---

### Schritt 3: Master-Users erstellen (1 Min)

**OPTION A - Via PowerShell:**

```powershell
cd C:\Users\pcour\mydispatch-rebuild\supabase
.\deploy-master-users.ps1
```

**OPTION B - Via curl/PowerShell (manuell):**

```powershell
$TOKEN = "MyDispatch_Master_2025_SecureToken_ygpwuiygivxoqtyoigtg"
$URL = "https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/setup-master-users"

Invoke-RestMethod -Uri $URL -Method POST -Headers @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
}
```

**OPTION C - Via Browser DevTools:**

Öffne Browser Console (F12) auf beliebiger Supabase-Seite:

```javascript
fetch('https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/setup-master-users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer MyDispatch_Master_2025_SecureToken_ygpwuiygivxoqtyoigtg',
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(d => console.log('SUCCESS:', d))
.catch(e => console.error('ERROR:', e))
```

---

## ✅ ERWARTETES ERGEBNIS

Nach Ausführung solltest du sehen:

```json
{
  "success": true,
  "results": [
    { "email": "courbois1981@gmail.com", "status": "created", "userId": "..." },
    { "email": "pascal@nexify.ai", "status": "created", "userId": "..." },
    { "email": "master@nexify.ai", "status": "created", "userId": "..." }
  ],
  "message": "Processed 3 master users"
}
```

---

## 🧪 LOGIN TESTEN

Nach erfolgreichem Setup:

1. **Dev-Server starten:**
   ```powershell
   cd C:\Users\pcour\mydispatch-rebuild
   npm run dev
   ```

2. **Login-Seite öffnen:**
   ```
   http://localhost:5173/auth
   ```

3. **Anmelden mit:**
   - Email: `courbois1981@gmail.com`
   - Passwort: `1def!xO2022!!`

4. **Erwartung:**
   - ✅ Erfolgreicher Login
   - ✅ Weiterleitung zu `/master`

---

## 📍 TROUBLESHOOTING

### "Function not found" Error?
→ Edge Functions noch nicht deployed (siehe Schritt 1)

### "Unauthorized" Error?
→ FUNCTION_ADMIN_TOKEN nicht gesetzt oder falsch (siehe Schritt 2)

### "User already exists" bei wiederholtem Aufruf?
→ Das ist OK! Function updated dann nur das Passwort

### "Table profiles does not exist"?
→ Datenbank-Schema fehlt. Führe aus:
```sql
-- In SQL Editor: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/sql/new

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT,
  full_name TEXT,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, role)
);
```

---

## 🔑 WICHTIGE LINKS

- **Functions Dashboard:** https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/functions
- **Secrets Vault:** https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/vault/secrets
- **SQL Editor:** https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/sql/new
- **Auth Users:** https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/auth/users

---

**Erstellt:** 6. November 2025  
**Projekt:** MyDispatch (ygpwuiygivxoqtyoigtg)  
**Status:** Bereit zum Deployment
