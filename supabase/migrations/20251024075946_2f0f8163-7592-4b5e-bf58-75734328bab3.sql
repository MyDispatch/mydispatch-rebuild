-- ==================================================================================
-- WATCHDOG-AI DATABASE SCHEMA V18.5.1
-- ==================================================================================
-- Purpose: 24/7 System Monitoring & Agent Orchestration
-- ==================================================================================

-- Table: monitoring_logs (Scan-Ergebnisse der Watchdog-AI)
CREATE TABLE IF NOT EXISTS public.monitoring_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_type TEXT NOT NULL CHECK (scan_type IN ('frontend', 'backend', 'docs', 'tests', 'full')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  file_path TEXT,
  auto_fixable BOOLEAN DEFAULT false,
  fixed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Table: agent_status (Status aller AI-Agenten für Inter-Agent-Communication)
CREATE TABLE IF NOT EXISTS public.agent_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL UNIQUE CHECK (agent_name IN ('nexify', 'docs-agent', 'watchdog-ai')),
  status TEXT NOT NULL CHECK (status IN ('idle', 'working', 'syncing', 'error')),
  current_task TEXT,
  last_sync_at TIMESTAMPTZ,
  data JSONB DEFAULT '{}',
  version TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.monitoring_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Admin-only access (Service-Role für Edge Functions)
CREATE POLICY "Service role can manage monitoring_logs"
  ON public.monitoring_logs
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage agent_status"
  ON public.agent_status
  FOR ALL
  USING (auth.role() = 'service_role');

-- Indexes für Performance
CREATE INDEX idx_monitoring_logs_severity ON public.monitoring_logs(severity);
CREATE INDEX idx_monitoring_logs_scan_type ON public.monitoring_logs(scan_type);
CREATE INDEX idx_monitoring_logs_created_at ON public.monitoring_logs(created_at DESC);
CREATE INDEX idx_agent_status_agent_name ON public.agent_status(agent_name);

-- Function: Automatisches Updated-At für agent_status
CREATE OR REPLACE FUNCTION public.update_agent_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-Update agent_status.updated_at
CREATE TRIGGER update_agent_status_updated_at
  BEFORE UPDATE ON public.agent_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_agent_status_timestamp();

-- Initial Agent Status Seeds
INSERT INTO public.agent_status (agent_name, status, version, data) VALUES
  ('nexify', 'idle', '18.5.1', '{"capabilities": ["frontend", "backend", "ai-orchestration"]}'),
  ('docs-agent', 'idle', '18.5.1', '{"capabilities": ["documentation", "analysis", "validation"]}'),
  ('watchdog-ai', 'idle', '18.5.1', '{"capabilities": ["monitoring", "scanning", "alerting"]}')
ON CONFLICT (agent_name) DO NOTHING;