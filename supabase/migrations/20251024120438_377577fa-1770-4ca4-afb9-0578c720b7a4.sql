
-- ==================================================================================
-- MIGRATION TEIL 1: Enum-Werte hinzufügen
-- ==================================================================================

-- 'master' hinzufügen
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'master' AND enumtypid = 'app_role'::regtype) THEN
    ALTER TYPE app_role ADD VALUE 'master';
  END IF;
END $$;

-- 'customer' hinzufügen
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'customer' AND enumtypid = 'app_role'::regtype) THEN
    ALTER TYPE app_role ADD VALUE 'customer';
  END IF;
END $$;
