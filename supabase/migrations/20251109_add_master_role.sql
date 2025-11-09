-- ==================================================================================
-- ADD MASTER ROLE TO app_role ENUM
-- ==================================================================================
-- Erstellt: 2025-11-09
-- Zweck: Login-Redirect-Problem beheben
-- Issue: app_role Enum hatte keinen 'master' Wert
-- ==================================================================================

-- 1. Erweitere app_role Enum um 'master' Wert
-- HINWEIS: Dieser Befehl MUSS außerhalb einer Transaktion ausgeführt werden
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'master';

-- 2. Dokumentation: Zeige alle app_role Werte
DO $$
DECLARE
  role_values TEXT;
BEGIN
  SELECT string_agg(enumlabel, ', ' ORDER BY enumsortorder)
  INTO role_values
  FROM pg_enum
  WHERE enumtypid = 'app_role'::regtype;
  
  RAISE NOTICE '✅ app_role Enum-Werte: %', role_values;
END $$;
