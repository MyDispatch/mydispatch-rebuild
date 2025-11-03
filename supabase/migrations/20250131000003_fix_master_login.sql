-- ==================================================================================
-- FIX MASTER LOGIN - courbois1981@gmail.com als Master-Zugang
-- ==================================================================================
-- Erstellt: 2025-01-31
-- Zweck: Pascal's Email als Master-Zugang sicherstellen
-- Autor: NeXify AI MASTER
-- ==================================================================================

-- 1. Funktion: Erstelle/Update Master-User für courbois1981@gmail.com
CREATE OR REPLACE FUNCTION ensure_master_user()
RETURNS void AS $$
DECLARE
  master_user_id UUID;
  master_email TEXT := 'courbois1981@gmail.com';
BEGIN
  -- Finde User-ID aus auth.users
  SELECT id INTO master_user_id
  FROM auth.users
  WHERE email = master_email;

  -- Wenn User existiert, aber kein Profile, erstelle Profile
  IF master_user_id IS NOT NULL THEN
    -- Erstelle Profile falls nicht vorhanden
    INSERT INTO public.profiles (
      user_id,
      email,
      role,
      created_at,
      updated_at
    )
    SELECT 
      master_user_id,
      master_email,
      'master',
      NOW(),
      NOW()
    WHERE NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE user_id = master_user_id
    );

    -- Update Profile falls vorhanden
    UPDATE public.profiles
    SET role = 'master',
        updated_at = NOW()
    WHERE user_id = master_user_id AND role != 'master';

    -- Erstelle Master-Role in user_roles falls nicht vorhanden
    INSERT INTO public.user_roles (
      user_id,
      role,
      granted_at,
      granted_by
    )
    SELECT 
      master_user_id,
      'master',
      NOW(),
      'system'
    WHERE NOT EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = master_user_id AND role = 'master'
    );

    RAISE NOTICE 'Master-User für % konfiguriert', master_email;
  ELSE
    RAISE NOTICE 'User % existiert noch nicht in auth.users. Bitte erst in Supabase Auth erstellen.', master_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Funktion ausführen
SELECT ensure_master_user();

-- 3. Helper: Prüfe ob User Master ist
CREATE OR REPLACE FUNCTION is_master_user(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
  is_master BOOLEAN := FALSE;
BEGIN
  -- Finde User-ID
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = user_email;

  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Prüfe user_roles
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = is_master_user.user_id
    AND role = 'master'
  ) INTO is_master;

  -- Oder prüfe profile.role
  IF NOT is_master THEN
    SELECT (role = 'master') INTO is_master
    FROM public.profiles
    WHERE user_id = is_master_user.user_id;
  END IF;

  RETURN is_master;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RLS Policy für Master-Zugriff auf alle Tabellen (Service Role hat Vollzugriff)
-- Master-Roles werden bereits durch user_roles gesteuert

-- 5. Kommentar
COMMENT ON FUNCTION ensure_master_user() IS 'Stellt sicher dass courbois1981@gmail.com Master-Zugang hat';
COMMENT ON FUNCTION is_master_user(TEXT) IS 'Prüft ob User Master-Role hat';

