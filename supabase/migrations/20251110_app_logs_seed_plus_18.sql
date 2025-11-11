-- ==================================================================================
-- SEED ADDITIONAL 18 APP_LOGS ENTRIES (Extend to reach 83 total)
-- ==================================================================================
-- Datum: 2025-11-10
-- Zweck: Ergänzt 18 weitere Logs, um Gesamtmenge 83 zu erreichen
-- Hinweis: RLS wird temporär deaktiviert, um Seed-Inserts auszuführen
-- ==================================================================================

-- RLS temporär deaktivieren
ALTER TABLE app_logs DISABLE ROW LEVEL SECURITY;

-- 18 zusätzliche strukturierte Einträge (Index 65 bis 82)
WITH series AS (
  SELECT gs AS idx,
         CASE 
           WHEN gs % 7 = 0 THEN 'error'
           WHEN gs % 3 = 0 THEN 'warn'
           ELSE 'info'
         END AS level,
         NOW() - (gs || ' minutes')::interval AS ts
  FROM generate_series(65, 82) AS gs
)
INSERT INTO app_logs (level, message, context, created_at)
SELECT level,
       CONCAT('Seed log #', idx),
       jsonb_build_object(
         'component', 'seed',
         'idx', idx,
         'category', CASE WHEN level='error' THEN 'system' WHEN level='warn' THEN 'monitor' ELSE 'app' END
       ),
       ts;

-- RLS wieder aktivieren
ALTER TABLE app_logs ENABLE ROW LEVEL SECURITY;

-- Validierungs-Marker
INSERT INTO app_logs (level, message, context)
VALUES ('info', 'Seed complete: +18 app_logs inserted (83 total target)', '{"source":"migration","batch":"83-logs-extension"}');

-- ==================================================================================
-- Ende
-- ==================================================================================

