-- ================================================================
-- MASTER USER FIX - MyDispatch (via Supabase SQL Editor)
-- ================================================================
-- ANLEITUNG:
-- 1. Öffne: https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/sql
-- 2. Kopiere dieses Script komplett
-- 3. Füge es ein und klicke "RUN"
-- ================================================================

BEGIN;

-- Master User 1: courbois1981@gmail.com
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated', 'authenticated',
  'courbois1981@gmail.com',
  crypt('1def!xO2022!!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Pascal Courbois"}',
  false
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = NOW();

INSERT INTO public.profiles (user_id, email, role)
SELECT id, 'courbois1981@gmail.com', 'master' 
FROM auth.users WHERE email = 'courbois1981@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'master';

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'master' FROM auth.users 
WHERE email = 'courbois1981@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Master User 2: pascal@nexify.ai
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated', 'authenticated',
  'pascal@nexify.ai',
  crypt('1def!xO2022!!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Pascal Nexify"}',
  false
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = NOW();

INSERT INTO public.profiles (user_id, email, role)
SELECT id, 'pascal@nexify.ai', 'master' 
FROM auth.users WHERE email = 'pascal@nexify.ai'
ON CONFLICT (user_id) DO UPDATE SET role = 'master';

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'master' FROM auth.users 
WHERE email = 'pascal@nexify.ai'
ON CONFLICT (user_id, role) DO NOTHING;

-- Master User 3: master@nexify.ai
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated', 'authenticated',
  'master@nexify.ai',
  crypt('1def!xO2022!!', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Master Admin"}',
  false
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = NOW();

INSERT INTO public.profiles (user_id, email, role)
SELECT id, 'master@nexify.ai', 'master' 
FROM auth.users WHERE email = 'master@nexify.ai'
ON CONFLICT (user_id) DO UPDATE SET role = 'master';

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'master' FROM auth.users 
WHERE email = 'master@nexify.ai'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verifikation
SELECT u.email, u.email_confirmed_at, p.role as profile_role, ur.role as user_role
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email IN ('courbois1981@gmail.com', 'pascal@nexify.ai', 'master@nexify.ai')
ORDER BY u.email;

COMMIT;

-- ✅ ERWARTETE AUSGABE: 3 Zeilen mit role='master'
-- 🧪 TEST: Login auf https://my-dispatch.de mit courbois1981@gmail.com / 1def!xO2022!!
