-- ==================================================================================
-- MASTER-ACCOUNT CREATION + MINDESTVORLAUF FEATURE
-- ==================================================================================
-- Erstellt: 2025-11-22
-- Zweck: 
--   1. Master-Account (info@my-dispatch.de) erstellen
--   2. Mindestvorlauf (booking_advance_time) Feld zu companies hinzufügen
-- ==================================================================================

-- ==================================================================================
-- TEIL 1: MINDESTVORLAUF FEATURE
-- ==================================================================================

-- Füge booking_advance_time zu companies Tabelle hinzu
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS booking_advance_time INTEGER DEFAULT 30
CHECK (booking_advance_time IN (30, 60, 90, 120));

COMMENT ON COLUMN companies.booking_advance_time IS 'Mindestvorlauf für Buchungen in Minuten. Optionen: 30, 60, 90, 120 (30 Min, 1 Std, 1,5 Std, 2 Std)';

-- Index für schnelle Lookups
CREATE INDEX IF NOT EXISTS idx_companies_booking_advance_time ON companies(booking_advance_time);

-- ==================================================================================
-- TEIL 2: MASTER-ACCOUNT VORBEREITUNG
-- ==================================================================================

-- Hinweis: Master-Account KANN NICHT via Migration erstellt werden!
-- Grund: auth.users Tabelle ist Supabase-intern und nicht via RLS zugänglich
-- 
-- LÖSUNG: Manuelle Erstellung via Supabase Dashboard:
--   1. Gehe zu Authentication → Users
--   2. Klicke "Add User"
--   3. Email: info@my-dispatch.de
--   4. Password: #25_FS.42-FKS!
--   5. Auto-confirm Email: ✓
--   6. Dann führe folgendes SQL aus:

-- Master Company erstellen (fallback if not exists)
DO $$
DECLARE
  v_company_id UUID;
BEGIN
  -- Check if master company already exists
  SELECT id INTO v_company_id FROM companies WHERE company_slug = 'master';
  
  IF v_company_id IS NULL THEN
    INSERT INTO companies (
      name,
      company_slug,
      email,
      subscription_status,
      subscription_product_id,
      booking_advance_time
    ) VALUES (
      'MyDispatch Master',
      'master',
      'info@my-dispatch.de',
      'active',
      'prod_MASTER', -- Special master product
      30 -- Default 30 Min Mindestvorlauf
    ) RETURNING id INTO v_company_id;
    
    RAISE NOTICE 'Master company created: %', v_company_id;
  ELSE
    RAISE NOTICE 'Master company already exists: %', v_company_id;
  END IF;
END $$;

-- Cleanup: Remove old master account (info@simsek.cc)
-- Nur ausführen wenn neuer Master-Account funktioniert!
-- COMMENT OUT bis sicher bestätigt:
/*
DO $$
DECLARE
  v_old_master_user_id UUID;
BEGIN
  -- Find old master user
  SELECT id INTO v_old_master_user_id 
  FROM auth.users 
  WHERE email = 'info@simsek.cc';
  
  IF v_old_master_user_id IS NOT NULL THEN
    -- Remove from user_roles
    DELETE FROM user_roles WHERE user_id = v_old_master_user_id AND role = 'master';
    
    -- Remove from profiles
    DELETE FROM profiles WHERE user_id = v_old_master_user_id;
    
    -- Archive company (don't delete - keep data)
    UPDATE companies 
    SET archived = true, archived_at = NOW()
    WHERE id = (SELECT company_id FROM profiles WHERE user_id = v_old_master_user_id LIMIT 1);
    
    RAISE NOTICE 'Old master account removed: %', v_old_master_user_id;
  END IF;
END $$;
*/

-- ==================================================================================
-- TEIL 3: DEMO-ACCOUNTS VORBEREITUNG
-- ==================================================================================

-- Demo Companies erstellen
DO $$
DECLARE
  v_demo_starter_company_id UUID;
  v_demo_business_company_id UUID;
BEGIN
  -- Demo Starter Company
  SELECT id INTO v_demo_starter_company_id FROM companies WHERE company_slug = 'demo-starter';
  
  IF v_demo_starter_company_id IS NULL THEN
    INSERT INTO companies (
      name,
      company_slug,
      email,
      tax_id,
      phone,
      address,
      city,
      postal_code,
      subscription_status,
      subscription_product_id,
      booking_advance_time
    ) VALUES (
      'Demo Taxi Starter GmbH',
      'demo-starter',
      'demo.starter@my-dispatch.de',
      'DE123456789',
      '+49 123 4567890',
      'Demostraße 1',
      'Berlin',
      '10115',
      'active',
      'prod_TEegHmtpPZOZcG', -- Starter Product ID
      60 -- 1 Std Mindestvorlauf
    ) RETURNING id INTO v_demo_starter_company_id;
    
    RAISE NOTICE 'Demo Starter Company created: %', v_demo_starter_company_id;
  END IF;
  
  -- Demo Business Company
  SELECT id INTO v_demo_business_company_id FROM companies WHERE company_slug = 'demo-business';
  
  IF v_demo_business_company_id IS NULL THEN
    INSERT INTO companies (
      name,
      company_slug,
      email,
      tax_id,
      phone,
      address,
      city,
      postal_code,
      subscription_status,
      subscription_product_id,
      booking_advance_time
    ) VALUES (
      'Demo Taxi Business GmbH',
      'demo-business',
      'demo.business@my-dispatch.de',
      'DE987654321',
      '+49 987 6543210',
      'Business Boulevard 42',
      'München',
      '80331',
      'active',
      'prod_TF5cnWFZYEQUsG', -- Business Product ID
      30 -- 30 Min Mindestvorlauf
    ) RETURNING id INTO v_demo_business_company_id;
    
    RAISE NOTICE 'Demo Business Company created: %', v_demo_business_company_id;
  END IF;
END $$;

-- Hinweis: Demo-Account Auth-User müssen auch manuell erstellt werden:
-- 1. demo.starter@my-dispatch.de (Password: De.25-STR_#mO_!)
-- 2. demo.business@my-dispatch.de (Password: De.BsS_25#mO_!)
-- 
-- Dann Profile zuweisen:
/*
-- ERST AUSFÜHREN NACHDEM AUTH-USER ERSTELLT WURDEN!
INSERT INTO profiles (user_id, company_id, first_name, last_name, role)
VALUES 
  ('<DEMO_STARTER_USER_ID>', '<DEMO_STARTER_COMPANY_ID>', 'Demo', 'Starter', 'entrepreneur'),
  ('<DEMO_BUSINESS_USER_ID>', '<DEMO_BUSINESS_COMPANY_ID>', 'Demo', 'Business', 'entrepreneur');
*/

-- ==================================================================================
-- BRAIN LOGS: Dokumentiere Changes
-- ==================================================================================
INSERT INTO brain_logs (
  category,
  action,
  context,
  metadata,
  created_at
) VALUES (
  'database_migration',
  'master_account_and_mindestvorlauf',
  'Added booking_advance_time field to companies table. Prepared Master and Demo accounts (Auth users must be created manually).',
  jsonb_build_object(
    'booking_advance_time_options', ARRAY[30, 60, 90, 120],
    'booking_advance_time_default', 30,
    'master_email', 'info@my-dispatch.de',
    'demo_starter_email', 'demo.starter@my-dispatch.de',
    'demo_business_email', 'demo.business@my-dispatch.de',
    'manual_steps_required', true
  ),
  NOW()
);
