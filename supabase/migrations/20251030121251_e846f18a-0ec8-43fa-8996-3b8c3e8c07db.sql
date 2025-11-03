-- =====================================================
-- PHASE 2: API CONNECTION MANAGER - DATABASE SCHEMA
-- =====================================================

-- Table: api_health_logs
CREATE TABLE IF NOT EXISTS public.api_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_name TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'down')),
  response_time_ms INTEGER,
  error_message TEXT,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_api_health_logs_api_name ON public.api_health_logs(api_name);
CREATE INDEX IF NOT EXISTS idx_api_health_logs_checked_at ON public.api_health_logs(checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_health_logs_status ON public.api_health_logs(status);

-- Table: api_fix_logs
CREATE TABLE IF NOT EXISTS public.api_fix_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_name TEXT NOT NULL,
  issue_detected TEXT NOT NULL,
  fix_attempted TEXT NOT NULL,
  fix_successful BOOLEAN NOT NULL DEFAULT false,
  fix_details JSONB DEFAULT '{}'::jsonb,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index für Fix-Tracking
CREATE INDEX IF NOT EXISTS idx_api_fix_logs_api_name ON public.api_fix_logs(api_name);
CREATE INDEX IF NOT EXISTS idx_api_fix_logs_attempted_at ON public.api_fix_logs(attempted_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_fix_logs_successful ON public.api_fix_logs(fix_successful);

-- RLS Policies (Master-Account-Only)
ALTER TABLE public.api_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_fix_logs ENABLE ROW LEVEL SECURITY;

-- Master-Account kann alles lesen
CREATE POLICY "Master account can read api_health_logs"
  ON public.api_health_logs
  FOR SELECT
  USING (public.is_master_account(auth.uid()));

CREATE POLICY "Master account can read api_fix_logs"
  ON public.api_fix_logs
  FOR SELECT
  USING (public.is_master_account(auth.uid()));

-- Service Role kann alles (für Edge Functions)
CREATE POLICY "Service role full access api_health_logs"
  ON public.api_health_logs
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access api_fix_logs"
  ON public.api_fix_logs
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Cleanup-Function (löscht alte Logs nach 90 Tagen)
CREATE OR REPLACE FUNCTION public.cleanup_old_api_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  DELETE FROM public.api_health_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  DELETE FROM public.api_fix_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  RAISE NOTICE 'Cleaned up API logs older than 90 days';
END;
$$;