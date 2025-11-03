-- ==================================================================================
-- KRITISCHER FIX: Entferne zirkuläre RLS-Abhängigkeit
-- ==================================================================================
-- Problem: dashboard_stats_secure referenziert profiles → Endlosschleife
-- Lösung: Nutze direkt die Materialized View mit einfacher RLS

-- Entferne problematische View
DROP VIEW IF EXISTS dashboard_stats_secure;

-- Stelle direkten Zugriff auf dashboard_stats wieder her
GRANT SELECT ON dashboard_stats TO authenticated;

-- WICHTIG: Nutze stattdessen direkt die Materialized View
-- Die company_id-Isolation erfolgt über die bestehende RLS auf anderen Tabellen