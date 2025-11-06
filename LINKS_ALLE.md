# 🔗 ALLE WICHTIGEN LINKS - MyDispatch

**Projekt-ID:** `vsbqyqhzxmwezlhzdmfd`

---

## 📊 SUPABASE DASHBOARD

### Hauptseite
https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd

### Auth - User Management (Master-User anlegen!)
https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/auth/users

### SQL Editor (Queries ausführen)
https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/sql/new

### Table Editor (Datenbank-Tabellen)
https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/editor

### API Settings (Keys & URL verifizieren)
https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/settings/api

### Database Settings
https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/settings/database

### Secrets (RESEND_API_KEY eintragen!)
https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/settings/vault/secrets

---

## 🚀 VERCEL DEPLOYMENT

### Project Dashboard
https://vercel.com/u4231458123-droids-projects/mydispatch-rebuild

### Environment Variables (nach Fix aktualisieren!)
https://vercel.com/u4231458123-droids-projects/mydispatch-rebuild/settings/environment-variables

### Deployments (Status prüfen)
https://vercel.com/u4231458123-droids-projects/mydispatch-rebuild/deployments

### Live App (deployed)
https://mydispatch-rebuild.vercel.app
https://mydispatch-rebuild.vercel.app/auth

---

## 💻 LOKALE ENTWICKLUNG

### Dev Server (nach .env Fix neu starten!)
http://localhost:5173
http://localhost:5173/auth

### Liveblocks Mock (neues Design)
file:///C:/Users/pcour/mydispatch-rebuild/public/liveblocks-mock.html

---

## 🔑 CREDENTIALS

### Master Login
- **Email:** courbois1981@gmail.com
- **Passwort:** 1def!xO2022!!
- **Alternative Email:** pascal@nexify.ai
- **Alternative Email:** master@nexify.ai

### Supabase API (aus .env.local)
- **URL:** https://vsbqyqhzxmwezlhzdmfd.supabase.co
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYnF5cWh6eG13ZXpsaHpkbWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MDg5MTgsImV4cCI6MjA0NjQ4NDkxOH0.1_eazWKy3vU7wE5xPSWDFtl8lPfIiIPEVXEUP81Gx4U

### Resend Email
- **API Key:** re_WWtdb7JV_DJ9iJU4DJrc7ZLkFufufFxi5
- **Domain:** send.nexify-automate.com

---

## ⚡ SCHNELLSTART - LOGIN FIX

### 1. Supabase: Master-User anlegen (2 Min)

**Link:** https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/auth/users

1. Klicke **"Add user"** → **"Create new user"**
2. Email: `courbois1981@gmail.com`
3. Password: `1def!xO2022!!`
4. ✅ **"Auto Confirm User"** aktivieren
5. Klicke **"Create user"**

### 2. Supabase: Profile + Role erstellen

**Link:** https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/sql/new

SQL Code kopieren und ausführen:

```sql
-- Profile + Master-Role für courbois1981@gmail.com
INSERT INTO profiles (id, user_id, email, full_name, role)
SELECT gen_random_uuid(), id, email, 'Pascal Courbois', 'master'
FROM auth.users WHERE email = 'courbois1981@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'master';

INSERT INTO user_roles (user_id, role)
SELECT id, 'master'
FROM auth.users WHERE email = 'courbois1981@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

### 3. Dev-Server neu starten

```powershell
cd C:\Users\pcour\mydispatch-rebuild
npm run dev
```

### 4. Login testen

**Link:** http://localhost:5173/auth

Login-Daten:
- Email: `courbois1981@gmail.com`
- Passwort: `1def!xO2022!!`

✅ **Du solltest zu `/master` weitergeleitet werden!**

---

## 🔧 TROUBLESHOOTING

### Chrome öffnet keine Tabs?
Alternative: Links manuell kopieren und im Browser öffnen (siehe oben)

### "Invalid login credentials"?
→ Master-User noch nicht in Supabase angelegt (siehe Schritt 1-2)

### "No profile found"?
→ SQL Script noch nicht ausgeführt (siehe Schritt 2)

### Dev-Server startet nicht?
```powershell
cd C:\Users\pcour\mydispatch-rebuild
npm install
npm run dev
```

### Deployed Version funktioniert nicht?
→ Vercel Environment Variables aktualisieren:
https://vercel.com/u4231458123-droids-projects/mydispatch-rebuild/settings/environment-variables

**Setze:**
```
VITE_SUPABASE_URL = https://vsbqyqhzxmwezlhzdmfd.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYnF5cWh6eG13ZXpsaHpkbWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MDg5MTgsImV4cCI6MjA0NjQ4NDkxOH0.1_eazWKy3vU7wE5xPSWDFtl8lPfIiIPEVXEUP81Gx4U
```

Dann: Redeploy auslösen (git push)

---

**📅 Erstellt:** 6. November 2025
**🔄 Status:** Login-Fix in Bearbeitung
**✅ .env.local:** Korrigiert (vsbqyqhzxmwezlhzdmfd)
