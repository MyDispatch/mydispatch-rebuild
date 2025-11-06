# ✅ KORRIGIERTE LINKS - RICHTIGE PROJEKT-ID!

**KORREKTE Projekt-ID:** `ygpwuiygivxoqtyoigtg` (wie im MCP konfiguriert)

---

## 🚨 WICHTIG: ALLE VORHERIGEN LINKS WAREN FALSCH!

Die richtige Projekt-ID ist: **ygpwuiygivxoqtyoigtg**

---

## 📊 SUPABASE DASHBOARD (KORREKT!)

### 1. Auth Users - Master-User anlegen
```
https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/auth/users
```
**→ Hier "Add user" klicken:**
- Email: `courbois1981@gmail.com`
- Password: `1def!xO2022!!`
- ✅ "Auto Confirm User" aktivieren

### 2. SQL Editor - Profile erstellen
```
https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/sql/new
```
**→ Hier SQL aus `QUICK_FIX_MASTER_USER.sql` einfügen und RUN klicken**

### 3. Dashboard Hauptseite
```
https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg
```

### 4. API Settings (Keys prüfen)
```
https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/api
```

### 5. Table Editor
```
https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/editor
```

### 6. Database Settings
```
https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/database
```

---

## ⚡ SCHNELL-ANLEITUNG (2 SCHRITTE)

### Schritt 1: Auth User anlegen (1 Min)
Öffne: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/auth/users

1. Klicke **"Add user"**
2. Wähle **"Create new user"**
3. Eingeben:
   - Email: `courbois1981@gmail.com`
   - Password: `1def!xO2022!!`
4. ✅ Checkbox **"Auto Confirm User"** aktivieren
5. Klicke **"Create user"**

### Schritt 2: Profile mit SQL erstellen (30 Sek)
Öffne: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/sql/new

Kopiere diesen Code und klicke **"Run"**:

```sql
-- Profile erstellen
INSERT INTO profiles (id, user_id, email, full_name, role)
SELECT 
  gen_random_uuid(),
  au.id,
  au.email,
  'Pascal Courbois',
  'master'
FROM auth.users au
WHERE au.email = 'courbois1981@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET role = 'master', updated_at = now();

-- Master-Role setzen
INSERT INTO user_roles (user_id, role)
SELECT au.id, 'master'
FROM auth.users au
WHERE au.email = 'courbois1981@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- User-Metadata aktualisieren
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}', '"master"'
)
WHERE email = 'courbois1981@gmail.com';
```

---

## 🧪 TEST

**Nach Neustart des Dev-Servers:**

```powershell
cd C:\Users\pcour\mydispatch-rebuild
npm run dev
```

**Dann testen:**
- URL: http://localhost:5173/auth
- Email: `courbois1981@gmail.com`
- Password: `1def!xO2022!!`

✅ **Du solltest zu `/master` weitergeleitet werden!**

---

## 📍 DEPLOYED VERSION FIX

Vercel Environment Variables: https://vercel.com/u4231458123-droids-projects/mydispatch-rebuild/settings/environment-variables

**Setze diese Werte:**
```
VITE_SUPABASE_URL = https://ygpwuiygivxoqtyoigtg.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlncHd1aXlnaXZ4b3F0eW9pZ3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NDQzNDMsImV4cCI6MjA3NjAyMDM0M30.tLj4Yk6GBR8vjN_QV-7yQsJ3p3nGTr8bQZjvxM8aD5w
```

---

## ✅ WAS KORRIGIERT WURDE

1. ✅ `.env.local` - Projekt-ID von `vsbqyqhzxmwezlhzdmfd` → `ygpwuiygivxoqtyoigtg`
2. ✅ `setup_master_users.sql` - Kommentar korrigiert
3. ✅ `QUICK_FIX_MASTER_USER.sql` - Neues vereinfachtes Script erstellt
4. ✅ Alle Links aktualisiert

**Status:** Bereit zum Testen!
