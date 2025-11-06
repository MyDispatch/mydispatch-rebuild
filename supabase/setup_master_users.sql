-- Master User Fix - MyDispatch
-- Erstellt 3 Master-User mit verschlüsseltem Passwort
-- Projekt: vsbqyqhzxmwezlhzdmfd
-- Datum: 2025-11-06

-- 1. Master User: courbois1981@gmail.com
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  role,
  aud,
  confirmation_token
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'courbois1981@gmail.com',
  crypt('1def!xO2022!!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"name": "Pascal Courbois", "role": "master"}',
  'authenticated',
  'authenticated',
  ''
)
ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('1def!xO2022!!', gen_salt('bf')),
  updated_at = now();

-- 2. Master User: pascal@nexify.ai
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  role,
  aud,
  confirmation_token
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'pascal@nexify.ai',
  crypt('1def!xO2022!!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"name": "Pascal Nexify", "role": "master"}',
  'authenticated',
  'authenticated',
  ''
)
ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('1def!xO2022!!', gen_salt('bf')),
  updated_at = now();

-- 3. Master User: master@nexify.ai
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  role,
  aud,
  confirmation_token
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'master@nexify.ai',
  crypt('1def!xO2022!!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"name": "Master Admin", "role": "master"}',
  'authenticated',
  'authenticated',
  ''
)
ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('1def!xO2022!!', gen_salt('bf')),
  updated_at = now();

-- Profile-Einträge erstellen
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, raw_user_meta_data->>'name', 'master'
FROM auth.users
WHERE email IN ('courbois1981@gmail.com', 'pascal@nexify.ai', 'master@nexify.ai')
ON CONFLICT (id) DO UPDATE SET
  role = 'master',
  updated_at = now();

-- User Roles setzen
INSERT INTO user_roles (user_id, role)
SELECT id, 'master'
FROM auth.users
WHERE email IN ('courbois1981@gmail.com', 'pascal@nexify.ai', 'master@nexify.ai')
ON CONFLICT (user_id) DO UPDATE SET
  role = 'master',
  updated_at = now();
