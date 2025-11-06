-- ⚡ QUICK FIX: Master-User für courbois1981@gmail.com
-- Projekt: ygpwuiygivxoqtyoigtg
-- Ausführen in: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/sql/new

-- SCHRITT 1: User manuell im Dashboard anlegen!
-- Gehe zu: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/auth/users
-- Klicke "Add user" → Email: courbois1981@gmail.com, Password: 1def!xO2022!!, ✓ Auto Confirm

-- SCHRITT 2: Dann dieses SQL ausführen (nachdem User angelegt wurde):

-- Profile erstellen (falls Tabelle existiert)
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
DO UPDATE SET 
  role = 'master',
  full_name = 'Pascal Courbois',
  updated_at = now();

-- Master-Role in user_roles setzen (falls Tabelle existiert)
INSERT INTO user_roles (user_id, role)
SELECT 
  au.id,
  'master'
FROM auth.users au
WHERE au.email = 'courbois1981@gmail.com'
ON CONFLICT (user_id, role) 
DO NOTHING;

-- ALTERNATIV: Falls Tabellen nicht existieren, nur User-Metadata setzen
UPDATE auth.users
SET 
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"master"'
  ),
  updated_at = now()
WHERE email = 'courbois1981@gmail.com';

-- ✅ FERTIG! 
-- Teste Login auf: http://localhost:5173/auth
-- Email: courbois1981@gmail.com
-- Password: 1def!xO2022!!
