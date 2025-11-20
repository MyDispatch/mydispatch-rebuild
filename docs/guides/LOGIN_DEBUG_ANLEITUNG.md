# 🔐 LOGIN DEBUG ANLEITUNG

**Status:** 🔴 LOGIN FUNKTIONIERT NICHT  
**Code:** ✅ Funktioniert (Build erfolgreich)  
**Vermutliche Ursache:** Supabase Auth-Konfiguration oder fehlende Test-User

---

## ✅ AUTH-CODE IST KORREKT

Die Login-Logik in `src/pages/Auth.tsx` ist vollständig implementiert:
- ✅ `supabase.auth.signInWithPassword()` funktioniert
- ✅ Error Handling vorhanden
- ✅ Profile-Check nach Login
- ✅ Master-User Support (courbois1981@gmail.com)

---

## 🔍 DIAGNOSE-SCHRITTE

### Schritt 1: Supabase Dashboard prüfen

**URL:** https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/auth/users

**Prüfe:**
1. Gibt es registrierte Benutzer?
2. Ist die E-Mail-Adresse bestätigt? (Confirmed Status)
3. Hat der User ein Passwort gesetzt?

---

### Schritt 2: Test-User erstellen

**Option A: Über SQL Editor**

```sql
-- 1. Master-User anlegen
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'courbois1981@gmail.com',
  crypt('TestPasswort123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Pascal Courbois"}',
  false,
  ''
) ON CONFLICT (email) DO NOTHING;

-- 2. Profile erstellen
INSERT INTO public.profiles (
  user_id,
  email,
  role,
  created_at,
  updated_at
)
SELECT 
  id,
  'courbois1981@gmail.com',
  'master',
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'courbois1981@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- 3. Master-Rolle zuweisen
INSERT INTO public.user_roles (
  user_id,
  role,
  created_at
)
SELECT 
  id,
  'master',
  NOW()
FROM auth.users
WHERE email = 'courbois1981@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

**Option B: Über Supabase Dashboard**

1. Gehe zu: Authentication → Users
2. Klicke "Add user"
3. Email: `courbois1981@gmail.com`
4. Password: `TestPasswort123!`
5. Auto Confirm: ✅ JA
6. Speichern

Dann SQL ausführen für Profile + Role:
```sql
-- Profile + Role für neuen User
INSERT INTO public.profiles (user_id, email, role)
SELECT id, email, 'master' FROM auth.users 
WHERE email = 'courbois1981@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'master';

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'master' FROM auth.users 
WHERE email = 'courbois1981@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

---

### Schritt 3: Auth-Einstellungen prüfen

**Pfad:** Authentication → Settings

**Wichtige Einstellungen:**
- ✅ Enable Email Confirmations: AUS (für Test) oder E-Mail SMTP korrekt
- ✅ Enable Email Sign Ups: AN
- ✅ Minimum Password Length: 6-8 Zeichen
- ✅ Site URL: `https://my-dispatch.de` oder deine Domain
- ✅ Redirect URLs: Deine Domain hinzufügen

---

### Schritt 4: Browser-Konsole Debug

**Test im Frontend:**

1. Öffne Developer Tools (F12)
2. Gehe zu Console Tab
3. Versuche Login mit:
   - Email: `courbois1981@gmail.com`
   - Passwort: `TestPasswort123!`

**Erwartete Logs:**
```
[Auth] Login attempt { email: "courbois1981@gmail.com", ... }
[Auth] Login successful { userId: "...", email: "...", ... }
[Auth] Profile-Check { found: true, ... }
[Auth] Master-Zugang erkannt { email: "courbois1981@gmail.com", ... }
```

**Fehler-Logs:**
```
[Auth] Login error { errorCode: 400, errorMessage: "Invalid login credentials" }
```
→ User existiert nicht oder falsches Passwort

```
[Auth] Login error { errorMessage: "Email not confirmed" }
```
→ E-Mail muss bestätigt werden (siehe Schritt 2, Option B: Auto Confirm aktivieren)

---

### Schritt 5: RLS Policies prüfen

**SQL Query:**

```sql
-- Prüfe ob RLS Policies Profile-Zugriff blockieren
SELECT * FROM pg_policies WHERE tablename = 'profiles';
SELECT * FROM pg_policies WHERE tablename = 'user_roles';
```

**Fix falls nötig:**

```sql
-- Allow authenticated users to read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Allow service role to manage all profiles
CREATE POLICY "Service role can manage profiles" ON profiles
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');
```

---

## 🧪 SCHNELLTEST

**Terminal Command:**

```bash
# Test Auth API direkt
curl -X POST 'https://vsbqyqhzxmwezlhzdmfd.supabase.co/auth/v1/token?grant_type=password' \
  -H "apikey: DEIN_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "courbois1981@gmail.com",
    "password": "TestPasswort123!"
  }'
```

**Erfolg:**
```json
{
  "access_token": "eyJhbG...",
  "token_type": "bearer",
  "user": { "id": "...", "email": "courbois1981@gmail.com" }
}
```

**Fehler:**
```json
{
  "error": "invalid_grant",
  "error_description": "Invalid login credentials"
}
```
→ User existiert nicht oder Passwort falsch

---

## ⚡ SCHNELLSTE LÖSUNG

**Wenn du sofort testen willst:**

1. Gehe zu Supabase Dashboard → Authentication → Users
2. Klicke "Add user"
3. Eingeben:
   - Email: `test@mydispatch.de`
   - Password: `Test123!`
   - Auto Confirm User: ✅ AN
4. Speichern
5. Im Frontend einloggen mit test@mydispatch.de / Test123!

Dann sollte Login sofort funktionieren (ohne Profile/Rolle, aber Login-Flow läuft durch).

---

## 📋 CHECKLISTE

- [ ] Test-User in Supabase Auth angelegt
- [ ] E-Mail bestätigt (Auto Confirm oder manuell)
- [ ] Profile-Eintrag in `profiles` Tabelle vorhanden
- [ ] RLS Policies erlauben Profile-Zugriff
- [ ] Site URL korrekt konfiguriert
- [ ] Email Confirmations deaktiviert (für Test) oder SMTP konfiguriert
- [ ] Browser-Konsole auf Fehler geprüft

Nach diesen Schritten sollte Login funktionieren!
