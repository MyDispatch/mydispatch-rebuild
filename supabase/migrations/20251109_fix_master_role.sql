-- ==================================================================================
-- FIX: Master Role für courbois1981@gmail.com setzen
-- ==================================================================================
-- Erstellt: 2025-11-09
-- Zweck: Login-Redirect-Problem beheben
-- Issue: user_roles Tabelle ist leer, Master-Account hat keine Role
-- ==================================================================================

-- 1. Master-Role für courbois1981@gmail.com setzen
-- Finde User-ID und erstelle user_roles Entry
INSERT INTO user_roles (user_id, role)
SELECT 
  id as user_id,
  'master'::app_role as role
FROM auth.users
WHERE email = 'courbois1981@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. Validierung: Prüfe ob Master-Role gesetzt wurde
DO $$
DECLARE
  master_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO master_count
  FROM user_roles
  WHERE role = 'master';
  
  IF master_count > 0 THEN
    RAISE NOTICE '✅ Master-Role erfolgreich gesetzt! (% Einträge)', master_count;
  ELSE
    RAISE WARNING '⚠️ Keine Master-Role gefunden! User courbois1981@gmail.com existiert möglicherweise nicht.';
  END IF;
END $$;

-- 3. Zeige alle Master-Accounts
SELECT 
  ur.id,
  ur.user_id,
  ur.role,
  au.email,
  ur.created_at
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.role = 'master';
