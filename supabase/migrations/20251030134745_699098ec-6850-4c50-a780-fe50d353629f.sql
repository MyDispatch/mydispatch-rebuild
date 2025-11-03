-- ============================================================================
-- WEEKLY TARIFF AUDIT CRON JOB V2.0
-- ============================================================================
-- Ruft sync-tariff-system Edge Function jeden Montag 08:00 UTC
-- Verhindert Drift zwischen DB und Code

-- Stelle sicher, dass pg_cron Extension aktiviert ist
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Lösche alte Cron Jobs falls vorhanden
SELECT cron.unschedule('weekly-tariff-audit') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'weekly-tariff-audit'
);

-- Erstelle neuen Cron Job für wöchentliches Tarif-Audit
SELECT cron.schedule(
  'weekly-tariff-audit',
  '0 8 * * 1', -- Jeden Montag 08:00 UTC
  $$
  SELECT
    net.http_post(
        url:='https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/sync-tariff-system',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYnF5cWh6eG13ZXpsaHpkbWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NDExNzcsImV4cCI6MjA3NjAxNzE3N30.3PEVtsGomB8z9vtCE3jrufvgl5Sg1Kwhm9boqHCh6HU"}'::jsonb,
        body:='{"trigger": "cron_weekly", "timestamp": "' || now()::text || '"}'::jsonb
    ) as request_id;
  $$
);

-- Verifizierung
SELECT jobname, schedule, active, jobid
FROM cron.job
WHERE jobname = 'weekly-tariff-audit';