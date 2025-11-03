-- ==================================================================================
-- KRONOS V18.0 - ENTITY STORAGE & EXECUTION TRACKING
-- ==================================================================================
-- Tables für maschinenlesbare Entity-Definitionen und Execution-Tracking
-- ==================================================================================

-- entities_queue: Alle zu generierenden Entities
CREATE TABLE IF NOT EXISTS public.entities_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('UI-Component', 'Page', 'API-Module', 'State-Slice')),
  name TEXT NOT NULL,
  specification JSONB NOT NULL,
  level INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
  generated_code TEXT,
  file_path TEXT,
  error_message TEXT,
  dependencies TEXT[] DEFAULT '{}',
  execution_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_type, name)
);

-- execution_logs: Tracking der Execution
CREATE TABLE IF NOT EXISTS public.execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES public.entities_queue(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed', 'skipped')),
  details JSONB DEFAULT '{}',
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- execution_runs: Tracking kompletter Execution-Runs
CREATE TABLE IF NOT EXISTS public.execution_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_type TEXT NOT NULL DEFAULT 'full' CHECK (run_type IN ('full', 'incremental', 'level', 'single')),
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
  total_entities INTEGER DEFAULT 0,
  completed_entities INTEGER DEFAULT 0,
  failed_entities INTEGER DEFAULT 0,
  skipped_entities INTEGER DEFAULT 0,
  total_levels INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Indexes für Performance
CREATE INDEX IF NOT EXISTS idx_entities_queue_status ON public.entities_queue(status);
CREATE INDEX IF NOT EXISTS idx_entities_queue_level ON public.entities_queue(level);
CREATE INDEX IF NOT EXISTS idx_entities_queue_type ON public.entities_queue(entity_type);
CREATE INDEX IF NOT EXISTS idx_execution_logs_entity_id ON public.execution_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_created_at ON public.execution_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_execution_runs_status ON public.execution_runs(status);
CREATE INDEX IF NOT EXISTS idx_execution_runs_started_at ON public.execution_runs(started_at DESC);

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION update_entities_queue_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_entities_queue_updated_at
  BEFORE UPDATE ON public.entities_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_entities_queue_updated_at();

-- RLS Policies
ALTER TABLE public.entities_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_runs ENABLE ROW LEVEL SECURITY;

-- Service Role hat vollen Zugriff
CREATE POLICY "Service role full access on entities_queue"
  ON public.entities_queue
  FOR ALL
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

CREATE POLICY "Service role full access on execution_logs"
  ON public.execution_logs
  FOR ALL
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

CREATE POLICY "Service role full access on execution_runs"
  ON public.execution_runs
  FOR ALL
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Authenticated Users können lesen
CREATE POLICY "Authenticated users can read entities_queue"
  ON public.entities_queue
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can read execution_logs"
  ON public.execution_logs
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can read execution_runs"
  ON public.execution_runs
  FOR SELECT
  USING (auth.uid() IS NOT NULL);