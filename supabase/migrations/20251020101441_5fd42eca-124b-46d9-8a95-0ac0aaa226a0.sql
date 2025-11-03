-- ==================================================================================
-- PERMISSION-FIX für dashboard_stats Materialized View
-- ==================================================================================
-- Behebt Permission-Denied-Fehler aus Postgres-Logs
-- ==================================================================================

-- Grant Permissions für Materialized View
GRANT SELECT ON dashboard_stats TO authenticated;
GRANT SELECT ON dashboard_stats TO anon;

-- Stelle sicher, dass Refresh-Funktion existiert und Permissions hat
GRANT EXECUTE ON FUNCTION refresh_dashboard_stats() TO authenticated;

-- Update Ownership (falls nötig)
ALTER MATERIALIZED VIEW dashboard_stats OWNER TO postgres;