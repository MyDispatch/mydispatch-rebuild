-- ==================================================================================
-- V18.5.13: DATA-RAG & TASK-QUEUE INFRASTRUCTURE
-- ==================================================================================
-- Konfigurations-Tabellen für DB-Query-Agent (Data-RAG)
-- Agent-Task-Queue für Chat-freie Workflow-Steuerung
-- ==================================================================================

-- 1. PRICING_TIERS (Tarif-Konfiguration)
CREATE TABLE IF NOT EXISTS public.pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name TEXT NOT NULL UNIQUE,
  tier_slug TEXT NOT NULL UNIQUE,
  monthly_price INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  max_users INTEGER,
  max_drivers INTEGER,
  max_vehicles INTEGER,
  ai_features_enabled BOOLEAN DEFAULT false,
  partner_network_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. FEATURE_FLAGS (Feature-Toggle-System)
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_name TEXT NOT NULL UNIQUE,
  flag_slug TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT false,
  description TEXT,
  required_tier TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. SYSTEM_CONFIG (Globale System-Konfiguration)
CREATE TABLE IF NOT EXISTS public.system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT NOT NULL UNIQUE,
  config_value JSONB NOT NULL,
  config_type TEXT NOT NULL CHECK (config_type IN ('string', 'number', 'boolean', 'json', 'array')),
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. SUBSCRIPTION_PLANS (Abonnement-Pläne)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  pricing_tier_id UUID REFERENCES public.pricing_tiers(id),
  tier_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  trial_ends_at TIMESTAMPTZ,
  subscription_starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  subscription_ends_at TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. AGENT_TASKS (Task-Queue für Chat-freie Workflow-Steuerung)
CREATE TABLE IF NOT EXISTS public.agent_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Task-Identifikation
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL CHECK (task_type IN ('feature', 'bugfix', 'refactor', 'infrastructure', 'documentation', 'compliance')),
  
  -- Priorisierung & Kategorisierung
  priority INTEGER NOT NULL DEFAULT 2 CHECK (priority BETWEEN 0 AND 3),
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Workflow-Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'planned', 'ready_for_review', 'approved', 'in_progress', 'completed', 'cancelled')),
  approval_mode TEXT NOT NULL DEFAULT 'manual' CHECK (approval_mode IN ('manual', 'auto')),
  
  -- Planung & Schätzung
  estimated_duration_minutes INTEGER,
  estimated_cost_tokens INTEGER,
  estimated_db_queries INTEGER DEFAULT 0,
  complexity_score INTEGER CHECK (complexity_score BETWEEN 1 AND 10),
  
  -- Umsetzung & Tracking
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  
  -- Agent-Metadaten
  agent_notes TEXT,
  arca_score INTEGER DEFAULT 0,
  requires_migration BOOLEAN DEFAULT false,
  requires_prompt_update BOOLEAN DEFAULT false,
  
  -- Beziehungen
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  assigned_to_agent TEXT DEFAULT 'nexify',
  
  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indizes für Performance
CREATE INDEX IF NOT EXISTS idx_agent_tasks_status ON public.agent_tasks(status);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_priority ON public.agent_tasks(priority DESC);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_company_id ON public.agent_tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_created_at ON public.agent_tasks(created_at DESC);

-- Update-Trigger
CREATE OR REPLACE FUNCTION public.update_pricing_tiers_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_pricing_tiers_updated_at
  BEFORE UPDATE ON public.pricing_tiers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_pricing_tiers_timestamp();

CREATE TRIGGER trigger_feature_flags_updated_at
  BEFORE UPDATE ON public.feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_system_config_updated_at
  BEFORE UPDATE ON public.system_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_agent_tasks_updated_at
  BEFORE UPDATE ON public.agent_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;

-- Pricing Tiers: Alle können lesen (für Pricing-Seite)
CREATE POLICY "Pricing tiers are viewable by everyone"
  ON public.pricing_tiers FOR SELECT
  USING (true);

-- Feature Flags: Nur Master-Accounts können schreiben
CREATE POLICY "Feature flags viewable by authenticated users"
  ON public.feature_flags FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Feature flags editable by master accounts"
  ON public.feature_flags FOR ALL
  USING (public.is_master_account(auth.uid()));

-- System Config: Public configs für alle, Rest nur Master
CREATE POLICY "Public system config viewable by everyone"
  ON public.system_config FOR SELECT
  USING (is_public = true);

CREATE POLICY "All system config viewable by authenticated"
  ON public.system_config FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "System config editable by master accounts"
  ON public.system_config FOR ALL
  USING (public.is_master_account(auth.uid()));

-- Subscription Plans: Nur eigene Company
CREATE POLICY "Subscription plans viewable by company members"
  ON public.subscription_plans FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Subscription plans editable by master accounts"
  ON public.subscription_plans FOR ALL
  USING (public.is_master_account(auth.uid()));

-- Agent Tasks: Nur Master-Accounts
CREATE POLICY "Agent tasks viewable by master accounts"
  ON public.agent_tasks FOR SELECT
  USING (public.is_master_account(auth.uid()));

CREATE POLICY "Agent tasks manageable by master accounts"
  ON public.agent_tasks FOR ALL
  USING (public.is_master_account(auth.uid()));

-- Seed-Daten für Pricing Tiers
INSERT INTO public.pricing_tiers (tier_name, tier_slug, monthly_price, features, max_users, max_drivers, max_vehicles, ai_features_enabled, partner_network_enabled) VALUES
  ('Starter', 'starter', 4900, '["Basis-Buchungsverwaltung", "Fahrer-Tracking", "Mobile App", "Email-Support"]'::jsonb, 3, 5, 5, false, false),
  ('Business', 'business', 9900, '["Alle Starter-Features", "Kunden-Portal", "Reporting & Analytics", "API-Zugang", "Prioritäts-Support"]'::jsonb, 10, 20, 20, false, true),
  ('Business+', 'business-plus', 19900, '["Alle Business-Features", "AI Smart Assignment", "Predictive Analytics", "Erweiterte Automatisierung", "24/7 Support"]'::jsonb, 25, 50, 50, true, true),
  ('Enterprise', 'enterprise', 39900, '["Alle Business+ Features", "Dedizierter Account Manager", "Custom Integrationen", "White-Label", "SLA-Garantie"]'::jsonb, NULL, NULL, NULL, true, true)
ON CONFLICT (tier_slug) DO NOTHING;

-- Seed-Daten für Feature Flags
INSERT INTO public.feature_flags (flag_name, flag_slug, enabled, description, required_tier) VALUES
  ('AI Smart Assignment', 'ai-smart-assignment', true, 'KI-basierte Fahrer-Zuweisung', 'business-plus'),
  ('Predictive Analytics', 'predictive-analytics', true, 'Vorhersage-Analysen für Nachfrage', 'business-plus'),
  ('Partner Network', 'partner-network', true, 'Partner-Vernetzung für Auftrags-Sharing', 'business'),
  ('Document OCR', 'document-ocr', false, 'Automatische Dokumenten-Erkennung', 'business-plus'),
  ('Real-Time Chat', 'real-time-chat', true, 'Echtzeit-Team-Kommunikation', 'business')
ON CONFLICT (flag_slug) DO NOTHING;

-- Seed-Daten für System Config
INSERT INTO public.system_config (config_key, config_value, config_type, description, is_public) VALUES
  ('date_format', '"DD.MM.YYYY"'::jsonb, 'string', 'Deutsches Datumsformat', true),
  ('time_format', '"HH:mm"'::jsonb, 'string', 'Deutsches Zeitformat (24h)', true),
  ('currency', '"EUR"'::jsonb, 'string', 'Standard-Währung', true),
  ('max_file_upload_mb', '10'::jsonb, 'number', 'Maximale Dateigröße für Uploads', false),
  ('enable_analytics', 'true'::jsonb, 'boolean', 'Analytics aktiviert', false),
  ('arca_threshold', '3'::jsonb, 'number', 'ARCA-Score-Schwellwert für Auto-Correction', false)
ON CONFLICT (config_key) DO NOTHING;