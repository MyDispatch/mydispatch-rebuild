-- ==================================================================================
-- SECURITY FIXES für PHASE 2 (Vereinfachte Lösung)
-- ==================================================================================

-- ==================================================================================
-- FIX 1: Security Definer View (slow_queries)
-- ==================================================================================

DROP VIEW IF EXISTS slow_queries;

CREATE OR REPLACE VIEW slow_queries AS
SELECT 
  query,
  calls,
  mean_exec_time,
  max_exec_time,
  stddev_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 20;

REVOKE ALL ON slow_queries FROM PUBLIC;
REVOKE ALL ON slow_queries FROM authenticated;
GRANT SELECT ON slow_queries TO service_role;


-- ==================================================================================
-- FIX 2: Materialized View in API (dashboard_stats)
-- ==================================================================================

-- Sichere Wrapper-View mit company_id-Isolation
CREATE OR REPLACE VIEW dashboard_stats_secure AS
SELECT * FROM dashboard_stats
WHERE company_id IN (
  SELECT company_id FROM profiles WHERE user_id = auth.uid()
);

-- Entferne direkten Zugriff auf dashboard_stats
REVOKE ALL ON dashboard_stats FROM PUBLIC;
REVOKE ALL ON dashboard_stats FROM authenticated;

-- Grant nur auf sichere Wrapper-View
GRANT SELECT ON dashboard_stats_secure TO authenticated;