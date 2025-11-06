# 🚨 LOGIN FIX - SOFORT AUSFÜHREN!

## Problem identifiziert:
1. ❌ **FALSCHE Supabase URL** in .env.local (alte Project ID)
2. ❌ **Master-User SQL noch nicht ausgeführt**

## ✅ GELÖST - .env.local korrigiert!

Die .env.local wurde soeben aktualisiert auf das **RICHTIGE** Projekt:
- ✅ Projekt-ID: `vsbqyqhzxmwezlhzdmfd`
- ✅ URL: `https://vsbqyqhzxmwezlhzdmfd.supabase.co`
- ✅ Anon Key aktualisiert

## 🎯 NÄCHSTE SCHRITTE (2 Minuten):

### 1. Dev-Server neu starten (WICHTIG!)
```powershell
# Terminal stoppen (Ctrl+C falls läuft)
cd C:\Users\pcour\mydispatch-rebuild
npm run dev
```

### 2. Master-User in Supabase anlegen

**OPTION A - Automatisch (Copy & Paste in Supabase SQL Editor):**

1. Öffne: https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/sql/new

2. Kopiere den KOMPLETTEN Code aus: `supabase\setup_master_users.sql`

3. Klicke "Run"

**OPTION B - Manuell (schneller, falls SQL-Editor Probleme macht):**

1. Öffne: https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/auth/users

2. Klicke "Add user" → "Create new user"

3. Eingeben:
   - Email: `courbois1981@gmail.com`
   - Password: `1def!xO2022!!`
   - ✅ Auto Confirm User (Checkbox aktivieren!)

4. Nach Erstellung → User anklicken → "User UID" kopieren

5. Öffne SQL Editor und führe aus:
```sql
-- Profile erstellen
INSERT INTO profiles (id, user_id, email, full_name, role)
VALUES (
  gen_random_uuid(),
  'PASTE_USER_ID_HIER',
  'courbois1981@gmail.com',
  'Pascal Courbois',
  'master'
);

-- Master-Role setzen
INSERT INTO user_roles (user_id, role)
VALUES ('PASTE_USER_ID_HIER', 'master');
```

## 🧪 TEST

Nach Neustart des Servers:

1. Gehe zu: http://localhost:5173/auth
2. Login mit:
   - Email: `courbois1981@gmail.com`
   - Passwort: `1def!xO2022!!`
3. Du solltest direkt auf `/master` weitergeleitet werden!

## 📍 DEPLOYMENT FIX

Für deployed Version (Vercel):

1. Gehe zu: https://vercel.com/u4231458123-droids-projects/mydispatch-rebuild/settings/environment-variables

2. Aktualisiere die Environment Variables:
   ```
   VITE_SUPABASE_URL = https://vsbqyqhzxmwezlhzdmfd.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYnF5cWh6eG13ZXpsaHpkbWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MDg5MTgsImV4cCI6MjA0NjQ4NDkxOH0.1_eazWKy3vU7wE5xPSWDFtl8lPfIiIPEVXEUP81Gx4U
   ```

3. Redeploy: `git push origin feature/nexify-ai-autonomous-build-session-2025-11-05`

## ❓ Troubleshooting

### "Invalid login credentials" nach Neustart?
→ Master-User SQL noch nicht ausgeführt in Supabase!

### "No profile found" nach Login?
→ Profile + user_roles Tabelle nicht erstellt (siehe OPTION B Step 5)

### Login-Button macht nichts?
→ Browser-Konsole öffnen (F12) und Fehler posten

---

**Status nach Fix:**
- ✅ .env.local korrigiert (vsbqyqhzxmwezlhzdmfd)
- ⏳ Master-User anlegen (siehe oben)
- ⏳ Dev-Server neu starten
