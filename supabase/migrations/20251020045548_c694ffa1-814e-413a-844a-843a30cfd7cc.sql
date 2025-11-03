-- ==========================================
-- P0-FIX: pg_cron/pg_net + brain_logs
-- DSGVO-Compliance + Self-Learning-System
-- ==========================================

-- Step 1: Enable Extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Step 2: brain_logs Table (Agent-Learning)
CREATE TABLE IF NOT EXISTS public.brain_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  agent_action TEXT NOT NULL,
  input_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  output_result JSONB,
  confidence NUMERIC(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  execution_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.brain_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company isolation" ON brain_logs
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert" ON brain_logs
  FOR INSERT WITH CHECK (true);

-- Indices for Performance
CREATE INDEX idx_brain_logs_company_created ON brain_logs(company_id, created_at DESC);
CREATE INDEX idx_brain_logs_action ON brain_logs(agent_action);
CREATE INDEX idx_brain_logs_success ON brain_logs(success) WHERE success = false;

-- Step 3: GPS Auto-Delete (24h DSGVO-Compliance)
SELECT cron.schedule(
  'cleanup-gps-positions-24h',
  '0 2 * * *',
  $$
  DELETE FROM driver_positions 
  WHERE updated_at < NOW() - INTERVAL '24 hours';
  
  INSERT INTO health_checks (service, status, checked_at)
  VALUES ('gps_cleanup_cron', 'healthy', NOW());
  $$
);

-- Step 4: Document-Expiry Check (täglich 09:00)
SELECT cron.schedule(
  'check-document-expiry-daily',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/check-document-expiry',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    )
  );
  $$
);

-- Step 5: Error-Logs Cleanup (90 Tage Retention)
SELECT cron.schedule(
  'cleanup-old-error-logs',
  '0 3 * * 0',
  $$
  DELETE FROM error_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
  $$
);

-- Step 6: Brain-Logs Cleanup (30 Tage Retention)
SELECT cron.schedule(
  'cleanup-old-brain-logs',
  '0 4 * * 0',
  $$
  DELETE FROM brain_logs 
  WHERE created_at < NOW() - INTERVAL '30 days';
  $$
);

-- Step 7: Cron Health-Check
SELECT cron.schedule(
  'cron-health-check',
  '0 * * * *',
  $$
  INSERT INTO health_checks (service, status, checked_at)
  VALUES ('pg_cron_system', 'healthy', NOW());
  $$
);