-- ==================================================================================
-- MASTER LOGS TABLE - Backend-Agenten-System V2.0 Logging
-- ==================================================================================
-- Purpose: Central logging for all AI agent operations (Orchestrator, Analyzer, Migrator, Validator, Healer)
-- Version: V40.10
-- Created: 2025-10-27
-- ==================================================================================

CREATE TYPE public.master_log_status AS ENUM ('pending', 'in_progress', 'success', 'error', 'rollback');

CREATE TABLE public.master_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  agent_name TEXT NOT NULL, -- 'orchestrator', 'analyzer', 'migrator', 'validator', 'healer'
  operation TEXT NOT NULL, -- 'scan', 'migrate', 'validate', 'fix', 'delegate'
  plan_md TEXT, -- Execution plan in markdown
  screenshot_base64 TEXT, -- Base64-encoded screenshot (visual validation)
  status master_log_status NOT NULL DEFAULT 'pending',
  error_message TEXT,
  metadata JSONB DEFAULT '{}', -- Additional context (files processed, violations found, etc.)
  duration_ms INTEGER, -- Operation duration
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast queries
CREATE INDEX idx_master_logs_timestamp ON public.master_logs(timestamp DESC);
CREATE INDEX idx_master_logs_agent ON public.master_logs(agent_name);
CREATE INDEX idx_master_logs_status ON public.master_logs(status);

-- Enable RLS
ALTER TABLE public.master_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all authenticated users to read logs (for monitoring)
CREATE POLICY "Authenticated users can view master logs"
ON public.master_logs
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow system to insert/update logs (via Edge Functions with service_role)
-- Note: Edge Functions will use service_role key for unrestricted access

-- Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_master_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_master_logs_updated_at
BEFORE UPDATE ON public.master_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_master_logs_updated_at();

-- Comment
COMMENT ON TABLE public.master_logs IS 
'Central logging for Backend-Agenten-System V2.0. 
Logs all operations from Orchestrator, Analyzer, Migrator, Validator, Healer.
Accessible via authenticated users for monitoring, written via service_role.';
