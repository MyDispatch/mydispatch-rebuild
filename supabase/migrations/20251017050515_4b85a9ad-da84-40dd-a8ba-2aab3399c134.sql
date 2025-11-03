-- ==================================================================================
-- TARIFSTEUERUNGS-SYSTEM V18.2 - DATENBANK-MIGRATION
-- ==================================================================================
-- Implementiert Special Accounts (Test, Master) und Account-Type-Steuerung
-- ==================================================================================

-- 1. Erweitere companies-Tabelle um account_type
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'normal' CHECK (account_type IN ('normal', 'test', 'master'));

-- 2. Neue Tabelle für Special Accounts
CREATE TABLE IF NOT EXISTS special_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT UNIQUE NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('test', 'master')),
  can_switch_tariff BOOLEAN DEFAULT false,
  can_access_master_dashboard BOOLEAN DEFAULT false,
  can_bypass_payment BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS für special_accounts
ALTER TABLE special_accounts ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Master-Accounts können alle Special Accounts sehen
CREATE POLICY "Master accounts can view all special accounts" 
ON special_accounts FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE email IN ('info@simsek.cc', 'nexify.login@gmail.com', 'master@my-dispatch.de')
  )
);

-- 5. RLS Policy: System kann Special Accounts einfügen
CREATE POLICY "System can insert special accounts" 
ON special_accounts FOR INSERT
WITH CHECK (true);

-- 6. Seed Special Accounts (Test-Accounts)
INSERT INTO special_accounts (user_email, account_type, can_switch_tariff, can_bypass_payment, notes) 
VALUES
  ('courbois1981@gmail.com', 'test', true, true, 'Test-Account 1 - Vollzugriff Business + Tariff-Switching'),
  ('demo@my-dispatch.de', 'test', true, true, 'Test-Account 2 - Vollzugriff Business + Tariff-Switching'),
  ('master@my-dispatch.de', 'master', false, true, 'Master-Account - Vollzugriff auf Master-Dashboard')
ON CONFLICT (user_email) DO NOTHING;

-- 7. Index für Performance
CREATE INDEX IF NOT EXISTS idx_special_accounts_email ON special_accounts(user_email);
CREATE INDEX IF NOT EXISTS idx_companies_account_type ON companies(account_type);

-- 8. Trigger für updated_at
CREATE OR REPLACE FUNCTION update_special_accounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_special_accounts_updated_at ON special_accounts;
CREATE TRIGGER trigger_special_accounts_updated_at
  BEFORE UPDATE ON special_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_special_accounts_updated_at();