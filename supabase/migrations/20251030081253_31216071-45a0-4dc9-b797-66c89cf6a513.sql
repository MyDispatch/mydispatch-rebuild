-- ==================================================================================
-- V5.0 FIX: Create agent_status Table
-- ==================================================================================

-- Create agent_status table
CREATE TABLE IF NOT EXISTS public.agent_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('idle', 'working', 'error', 'offline')),
  version TEXT NOT NULL,
  last_heartbeat TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agent_status ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read for authenticated users
CREATE POLICY "Allow authenticated read on agent_status"
  ON public.agent_status FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policy: Only system can write (using service_role)
CREATE POLICY "Allow service role write on agent_status"
  ON public.agent_status FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_agent_status_agent_name 
  ON public.agent_status(agent_name);

-- Trigger for updated_at
CREATE TRIGGER update_agent_status_updated_at
  BEFORE UPDATE ON public.agent_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_agent_status_timestamp();

-- Initial seed data
INSERT INTO public.agent_status (agent_name, status, version, last_heartbeat) VALUES
  ('NeXify', 'idle', 'v5.0.0', now()),
  ('Watchdog-AI', 'idle', 'v18.5.1', now()),
  ('Docs-Agent', 'idle', 'v3.2.0', now())
ON CONFLICT (agent_name) DO NOTHING;