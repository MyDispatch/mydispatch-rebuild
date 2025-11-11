-- ==================================================================================
-- SEED 65 APP_LOGS ENTRIES (Spread over recent hours)
-- ==================================================================================
-- Datum: 2025-11-10
-- Zweck: Testdaten für Observability (65 Logs) ohne Secrets, konform zu RLS
-- Hinweis: RLS wird temporär deaktiviert, um Seed-Inserts auszuführen
-- ==================================================================================

-- RLS temporär deaktivieren
ALTER TABLE app_logs DISABLE ROW LEVEL SECURITY;

-- 65 strukturierte Einträge erzeugen
WITH series AS (
  SELECT gs AS idx,
         CASE 
           WHEN gs % 7 = 0 THEN 'error'
           WHEN gs % 3 = 0 THEN 'warn'
           ELSE 'info'
         END AS level,
         NOW() - (gs || ' minutes')::interval AS ts
  FROM generate_series(0, 64) AS gs
)
INSERT INTO app_logs (level, message, context, created_at)
SELECT level,
       CONCAT('Seed log #', idx),
       jsonb_build_object(
         'component', 'seed',
         'idx', idx,
         'category', CASE WHEN level='error' THEN 'system' WHEN level='warn' THEN 'monitor' ELSE 'app' END
       ),
       ts
FROM series;

-- RLS wieder aktivieren
ALTER TABLE app_logs ENABLE ROW LEVEL SECURITY;

-- Validierungs-Marker
INSERT INTO app_logs (level, message, context)
VALUES ('info', 'Seed complete: 65 app_logs inserted', '{"source":"migration","batch":"65-logs"}');

-- ==================================================================================
-- Ende
-- ==================================================================================

