-- ==================================================================================
-- CRON JOBS - Automatisches Monitoring (2x täglich)
-- ==================================================================================
-- Erstellt: 2025-01-31
-- Zweck: Automatische Health Checks und Auto-Fixes
-- Autor: NeXify AI MASTER
-- ==================================================================================
-- HINWEIS: Diese Jobs müssen manuell in Supabase Dashboard konfiguriert werden
-- oder über pg_cron Extension aktiviert werden
-- ==================================================================================

-- Prüfe ob pg_cron Extension aktiviert ist
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Service Role Key (aus Environment Variable)
-- WICHTIG: Ersetzen Sie YOUR_SERVICE_ROLE_KEY mit dem tatsächlichen Key!

-- 1. Daily Health Check - Morgens (08:00)
SELECT cron.schedule(
  'daily-health-check-morning',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/daily-health-check',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY", "Content-Type": "application/json"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
) ON CONFLICT (jobname) DO UPDATE SET schedule = EXCLUDED.schedule;

-- 2. Daily Health Check - Abends (20:00)
SELECT cron.schedule(
  'daily-health-check-evening',
  '0 20 * * *',
  $$
  SELECT net.http_post(
    url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/daily-health-check',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY", "Content-Type": "application/json"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
) ON CONFLICT (jobname) DO UPDATE SET schedule = EXCLUDED.schedule;

-- 3. Auto-Fix Issues - Morgens (08:05)
SELECT cron.schedule(
  'auto-fix-issues-morning',
  '5 8 * * *',
  $$
  SELECT net.http_post(
    url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/auto-fix-issues',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY", "Content-Type": "application/json"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
) ON CONFLICT (jobname) DO UPDATE SET schedule = EXCLUDED.schedule;

-- 4. Auto-Fix Issues - Abends (20:05)
SELECT cron.schedule(
  'auto-fix-issues-evening',
  '5 20 * * *',
  $$
  SELECT net.http_post(
    url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/auto-fix-issues',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY", "Content-Type": "application/json"}'::jsonb,
    body:='{}'::jsonb
  );
  $$
) ON CONFLICT (jobname) DO UPDATE SET schedule = EXCLUDED.schedule;

-- Kommentare
COMMENT ON TABLE cron.job IS 'Cron Jobs für automatisches Monitoring (2x täglich)';

-- Hinweis: Diese Migration muss manuell angepasst werden:
-- 1. YOUR_PROJECT_REF durch tatsächliche Project Reference ersetzen
-- 2. YOUR_SERVICE_ROLE_KEY durch tatsächlichen Service Role Key ersetzen
-- 3. Oder: Cron Jobs über Supabase Dashboard konfigurieren

