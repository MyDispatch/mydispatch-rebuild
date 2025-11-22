-- ==================================================================================
-- TEMPORÄRE SIGNUP-DATEN FÜR PAYMENT-FIRST REGISTRATION
-- ==================================================================================
-- Erstellt: 2025-11-22
-- Zweck: Speichert Signup-Daten bis Stripe-Payment erfolgreich
-- Workflow: User füllt Formular → Daten hier → Stripe Payment → Account Creation
-- ==================================================================================

-- Temporäre Signup-Tabelle
CREATE TABLE IF NOT EXISTS temp_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,

  -- Persönliche Daten
  salutation TEXT CHECK (salutation IN ('Herr', 'Frau', 'Divers')),
  title TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,

  -- Unternehmensdaten
  company_name TEXT NOT NULL,
  tax_id TEXT NOT NULL,
  street TEXT,
  city TEXT,
  postal_code TEXT,

  -- Passwort (gehashed)
  password_hash TEXT NOT NULL,

  -- Tarif-Auswahl
  selected_tariff TEXT NOT NULL CHECK (selected_tariff IN ('starter', 'business')),
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
  fleet_addon_enabled BOOLEAN DEFAULT false,

  -- Stripe-Daten
  stripe_checkout_session_id TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'expired')),

  -- Tracking
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'), -- Signup verfällt nach 24h
  completed_at TIMESTAMPTZ,

  -- Metadaten
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT
);

-- Index für schnelle Lookups
CREATE INDEX idx_temp_signups_email ON temp_signups(email);
CREATE INDEX idx_temp_signups_checkout_session ON temp_signups(stripe_checkout_session_id);
CREATE INDEX idx_temp_signups_expires_at ON temp_signups(expires_at);
CREATE INDEX idx_temp_signups_payment_status ON temp_signups(payment_status);

-- RLS Policies (Public Access für Signup-Flow)
ALTER TABLE temp_signups ENABLE ROW LEVEL SECURITY;

-- Jeder kann temp_signup erstellen (Insert)
CREATE POLICY "Anyone can create temp signup"
ON temp_signups FOR INSERT
WITH CHECK (true);

-- User kann eigenen temp_signup via Email lesen
CREATE POLICY "Users can read own temp signup"
ON temp_signups FOR SELECT
USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Service Role kann alles (für Webhooks)
CREATE POLICY "Service role has full access"
ON temp_signups FOR ALL
USING (auth.role() = 'service_role');

-- Auto-Cleanup: Lösche abgelaufene Signups nach 7 Tagen
-- (Supabase Cron Job kann das regelmäßig ausführen)
COMMENT ON TABLE temp_signups IS 'Temporäre Signup-Daten für Payment-First Registration. Auto-Cleanup nach expires_at + 7 Tage.';

-- ==================================================================================
-- BRAIN LOGS: Dokumentiere Migration
-- ==================================================================================
INSERT INTO brain_logs (
  category,
  action,
  context,
  metadata,
  created_at
) VALUES (
  'database_migration',
  'create_temp_signups_table',
  'Temporäre Signup-Tabelle für Payment-First Registration erstellt. Ermöglicht Stripe-Payment BEFORE Account Creation.',
  jsonb_build_object(
    'table_name', 'temp_signups',
    'purpose', 'payment_first_registration',
    'auto_cleanup', 'expires_at + 7 days',
    'workflow', 'User Signup → temp_signups → Stripe Payment → Webhook → Account Creation'
  ),
  NOW()
);
