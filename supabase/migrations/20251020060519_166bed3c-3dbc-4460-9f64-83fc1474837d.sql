-- ==================================================================================
-- AUTOMATED CRON-JOBS SETUP - P2-OPTIMIERUNG V18.3.24
-- ==================================================================================
-- Aktiviert 2 zusätzliche Cron-Jobs für Self-Reflection & n8n-Skalierung
-- Auto-executed via Lovable Cloud Migration Tool
-- ==================================================================================

-- Enable required extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 1. Self-Reflection (stündlich) - Gemini analysiert brain_logs
SELECT cron.schedule(
  'self-reflection',
  '0 * * * *', -- Jede Stunde (zur vollen Stunde)
  $$
  SELECT net.http_post(
    url:='https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/self-reflection',
    headers:='{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYnF5cWh6eG13ZXpsaHpkbWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NDExNzcsImV4cCI6MjA3NjAxNzE3N30.3PEVtsGomB8z9vtCE3jrufvgl5Sg1Kwhm9boqHCh6HU"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
);

-- 2. n8n Scalability Check (täglich) - Prüft Execution-Limits
SELECT cron.schedule(
  'n8n-scalability-check',
  '0 8 * * *', -- Täglich 08:00 Uhr (Morgen-Report)
  $$
  SELECT net.http_post(
    url:='https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/n8n-scalability-check',
    headers:='{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYnF5cWh6eG13ZXpsaHpkbWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NDExNzcsImV4cCI6MjA3NjAxNzE3N30.3PEVtsGomB8z9vtCE3jrufvgl5Sg1Kwhm9boqHCh6HU"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
);