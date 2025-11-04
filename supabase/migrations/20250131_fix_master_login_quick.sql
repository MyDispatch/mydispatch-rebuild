-- ==================================================================================
-- FIX MASTER LOGIN - Quick Fix Script
-- ==================================================================================
-- Erstellt: 2025-01-31
-- Zweck: Master-User Login-Problem beheben
-- Autor: NeXify AI MASTER
-- ==================================================================================

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'courbois1981@gmail.com';
BEGIN
  -- 1. Finde User in auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
  
  IF v_user_id IS NOT NULL THEN
    -- 2. Stelle sicher, dass E-Mail bestätigt ist
    UPDATE auth.users 
    SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
    WHERE id = v_user_id;
    
    -- 3. Erstelle oder aktualisiere Profile
    INSERT INTO public.profiles (user_id, first_name, last_name, role, company_id, created_at, updated_at)
    VALUES (v_user_id, 'Pascal', 'Courbois', 'master', NULL, NOW(), NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      role = 'master',
      updated_at = NOW();
    
    -- 4. Erstelle oder aktualisiere user_roles
    INSERT INTO public.user_roles (user_id, role, created_at)
    VALUES (v_user_id, 'master', NOW())
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Master-User % erfolgreich konfiguriert!', v_email;
  ELSE
    RAISE NOTICE 'User mit E-Mail % nicht gefunden!', v_email;
  END IF;
END $$;

