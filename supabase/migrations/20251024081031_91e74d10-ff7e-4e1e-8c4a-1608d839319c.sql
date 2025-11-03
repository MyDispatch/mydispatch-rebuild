-- ==================================================================================
-- BATCH 8: OBSERVABILITY & AUTOMATION V18.5.1
-- ==================================================================================
-- Purpose: Cron-Job für Heartbeat, pg_net Extension, Heartbeat History
-- ==================================================================================

-- 1. Enable pg_cron and pg_net extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 2. Create heartbeat_history table for tracking agent health metrics
CREATE TABLE IF NOT EXISTS public.heartbeat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  agent_health JSONB NOT NULL,
  critical_issues INTEGER NOT NULL DEFAULT 0,
  warnings INTEGER NOT NULL DEFAULT 0,
  all_agents_healthy BOOLEAN NOT NULL DEFAULT true,
  uptime_percentage NUMERIC(5,2),
  avg_response_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Enable RLS on heartbeat_history
ALTER TABLE public.heartbeat_history ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policy for heartbeat_history (only authenticated users can read)
CREATE POLICY "Authenticated users can view heartbeat history"
ON public.heartbeat_history
FOR SELECT
TO authenticated
USING (true);

-- 5. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_heartbeat_history_timestamp 
ON public.heartbeat_history(timestamp DESC);

-- 6. Create function to cleanup old heartbeat history (keep last 30 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_heartbeat_history()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.heartbeat_history
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  RAISE NOTICE 'Cleaned up heartbeat history older than 30 days';
END;
$$;

-- 7. Schedule heartbeat via pg_cron (every 15 minutes)
SELECT cron.schedule(
  'heartbeat-every-15-minutes',
  '*/15 * * * *',
  $$
  SELECT
    net.http_post(
        url:='https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/central-brain',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYnF5cWh6eG13ZXpsaHpkbWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NDExNzcsImV4cCI6MjA3NjAxNzE3N30.3PEVtsGomB8z9vtCE3jrufvgl5Sg1Kwhm9boqHCh6HU"}'::jsonb,
        body:='{"action": "heartbeat"}'::jsonb
    ) as request_id;
  $$
);

-- 8. Schedule cleanup of old heartbeat history (daily at 3 AM)
SELECT cron.schedule(
  'cleanup-heartbeat-history-daily',
  '0 3 * * *',
  $$
  SELECT public.cleanup_old_heartbeat_history();
  $$
);

-- 9. Schedule cleanup of old monitoring_logs (daily at 3:30 AM)
SELECT cron.schedule(
  'cleanup-monitoring-logs-daily',
  '30 3 * * *',
  $$
  DELETE FROM public.monitoring_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
  $$
);