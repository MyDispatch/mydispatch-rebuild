-- ==================================================================================
-- MIGRATION: Marketing Stats Dynamic Content System
-- DATE: 2025-10-31
-- AUTHOR: NeXify AI V6.0.4
-- PURPOSE: Dynamisches Content-Management für Marketing-Pages (A/B Testing ready)
-- ==================================================================================

-- 1. CREATE marketing_stats TABLE
CREATE TABLE IF NOT EXISTS public.marketing_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  icon_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. CREATE INDEX für Performance
CREATE INDEX IF NOT EXISTS idx_marketing_stats_section_active 
  ON public.marketing_stats(section, active, display_order);

-- 3. ENABLE RLS (MANDATORY für Production!)
ALTER TABLE public.marketing_stats ENABLE ROW LEVEL SECURITY;

-- 4. CREATE RLS POLICIES
-- Public Read Policy (nur active=true Entries)
CREATE POLICY "Public Read Marketing Stats"
  ON public.marketing_stats
  FOR SELECT
  USING (active = true);

-- Admin Write Policy (nur Admins können schreiben)
CREATE POLICY "Admin Write Marketing Stats"
  ON public.marketing_stats
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- 5. INSERT Initial Trust Stats für Home-Page
INSERT INTO public.marketing_stats (section, value, label, display_order, active, icon_name)
VALUES
  ('home_trust', '99.8%', 'Verfügbarkeit', 1, true, 'shield-check'),
  ('home_trust', '24/7', 'Support', 2, true, 'headset'),
  ('home_trust', 'DSGVO', 'Konform', 3, true, 'lock'),
  ('home_trust', '<2s', 'Response Time', 4, true, 'zap')
ON CONFLICT DO NOTHING;

-- 6. CREATE updated_at TRIGGER
CREATE OR REPLACE FUNCTION update_marketing_stats_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_marketing_stats_updated_at
  BEFORE UPDATE ON public.marketing_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_marketing_stats_timestamp();

-- 7. ADD TABLE COMMENTS (Documentation)
COMMENT ON TABLE public.marketing_stats IS 
  'Dynamische Marketing-Statistiken für A/B Testing und Content-Management';
COMMENT ON COLUMN public.marketing_stats.section IS 
  'Section identifier (z.B. home_trust, pricing_benefits, feature_highlights)';
COMMENT ON COLUMN public.marketing_stats.active IS 
  'Nur active=true Einträge werden auf Frontend angezeigt (A/B Testing)';
COMMENT ON COLUMN public.marketing_stats.display_order IS 
  'Sortierreihenfolge innerhalb einer Section (ASC)';

-- ==================================================================================
-- VERIFICATION CHECKLIST:
-- [x] RLS enabled?
-- [x] Policies für SELECT (Public) und ALL (Admin)?
-- [x] Initial Data seeded (4 Trust-Stats)?
-- [x] Indexes created (Performance)?
-- [x] Trigger für updated_at?
-- [x] Comments für Documentation?
-- ==================================================================================