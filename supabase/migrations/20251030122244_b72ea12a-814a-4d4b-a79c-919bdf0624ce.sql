-- ============================================================================
-- API Connection Manager - Automatic Health Check Cron Job
-- ============================================================================
-- Runs every 15 minutes to monitor Tavily API, Lovable AI Gateway & Anthropic API
-- Auto-fixes critical API issues and logs results to api_health_logs

-- Schedule cron job for api-connection-manager (every 15 minutes)
SELECT cron.schedule(
  'api-health-check',
  '*/15 * * * *', -- Every 15 minutes
  $$
  SELECT
    net.http_post(
      url := 'https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/api-connection-manager',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYnF5cWh6eG13ZXpsaHpkbWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NDExNzcsImV4cCI6MjA3NjAxNzE3N30.3PEVtsGomB8z9vtCE3jrufvgl5Sg1Kwhm9boqHCh6HU"}'::jsonb,
      body := '{"trigger": "cron"}'::jsonb
    ) as request_id;
  $$
);

-- Verify cron job was created
SELECT jobid, schedule, command, nodename, nodeport, database, username, active
FROM cron.job
WHERE jobname = 'api-health-check';