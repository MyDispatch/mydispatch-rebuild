-- ==================================================================================
-- CRON-JOBS SETUP - P2-OPTIMIERUNG V18.3.24
-- ==================================================================================
-- Aktiviert 2 zusätzliche Cron-Jobs für Self-Reflection & n8n-Skalierung
-- WICHTIG: In Lovable Cloud Backend → SQL Editor ausführen
-- ==================================================================================

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

-- ==================================================================================
-- VERIFIKATION: Prüfe ob Cron-Jobs aktiv sind
-- ==================================================================================

-- Zeige alle Cron-Jobs
SELECT jobname, schedule, command 
FROM cron.job 
WHERE jobname IN ('self-reflection', 'n8n-scalability-check')
ORDER BY jobname;

-- Erwartete Ausgabe (nach Ausführung):
-- | jobname                    | schedule     | command                                    |
-- | self-reflection            | 0 * * * *    | SELECT net.http_post(url:='...')          |
-- | n8n-scalability-check      | 0 8 * * *    | SELECT net.http_post(url:='...')          |

-- ==================================================================================
-- MANUELLER TEST (Optional)
-- ==================================================================================

-- Test Self-Reflection sofort ausführen
SELECT net.http_post(
  url:='https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/self-reflection',
  headers:='{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYnF5cWh6eG13ZXpsaHpkbWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NDExNzcsImV4cCI6MjA3NjAxNzE3N30.3PEVtsGomB8z9vtCE3jrufvgl5Sg1Kwhm9boqHCh6HU"}'::jsonb
) AS self_reflection_result;

-- Prüfe brain_logs nach Test
SELECT * FROM brain_logs 
WHERE agent_action = 'self_reflection' 
ORDER BY created_at DESC 
LIMIT 1;

-- ==================================================================================
-- DEAKTIVIERUNG (Falls nötig)
-- ==================================================================================

-- Deaktiviere Self-Reflection Cron
-- SELECT cron.unschedule('self-reflection');

-- Deaktiviere n8n-Scalability-Check Cron
-- SELECT cron.unschedule('n8n-scalability-check');
