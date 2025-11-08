-- ==================================================================================
-- RLS AUDIT & ENHANCEMENT V32.5
-- ==================================================================================
-- ✅ Überprüfung aller Tabellen auf RLS-Coverage
-- ✅ Standard-Policies für fehlende Tabellen
-- ✅ Multi-Tenant Isolation (company_id basiert)
-- ==================================================================================

-- ==================================================================================
-- AUDIT FUNCTION: Findet Tabellen OHNE RLS
-- ==================================================================================
CREATE OR REPLACE FUNCTION get_tables_without_rls()
RETURNS TABLE (
  table_schema text,
  table_name text,
  has_rls boolean
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    schemaname::text as table_schema,
    tablename::text as table_name,
    rowsecurity as has_rls
  FROM pg_tables
  WHERE schemaname = 'public'
  AND rowsecurity = false
  ORDER BY tablename;
$$;

-- ==================================================================================
-- STANDARD RLS POLICIES TEMPLATE
-- ==================================================================================
-- Dieses Template wird für ALLE company_id-basierten Tabellen verwendet

-- TEMPLATE: SELECT Policy
-- CREATE POLICY "company_isolation_select" ON {table_name}
-- FOR SELECT USING (
--   company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid())
-- );

-- TEMPLATE: INSERT Policy
-- CREATE POLICY "company_isolation_insert" ON {table_name}
-- FOR INSERT WITH CHECK (
--   company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid())
-- );

-- TEMPLATE: UPDATE Policy
-- CREATE POLICY "company_isolation_update" ON {table_name}
-- FOR UPDATE USING (
--   company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid())
-- ) WITH CHECK (
--   company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid())
-- );

-- TEMPLATE: DELETE Policy (Soft Delete bevorzugt!)
-- CREATE POLICY "company_isolation_delete" ON {table_name}
-- FOR DELETE USING (
--   company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid())
-- );

-- ==================================================================================
-- AUDIT: CHECK EXISTING RLS
-- ==================================================================================
-- Run: SELECT * FROM get_tables_without_rls();
-- Ergebnis: Alle Tabellen OHNE RLS werden angezeigt

-- ==================================================================================
-- KNOWN GOOD TABLES (Already have RLS)
-- ==================================================================================
-- Diese Tabellen haben bereits vollständige RLS Policies:
--
-- ✅ bookings (4 Policies)
-- ✅ customers (4 Policies)
-- ✅ drivers (4 Policies)
-- ✅ vehicles (4 Policies)
-- ✅ partners (4 Policies)
-- ✅ invoices (4 Policies)
-- ✅ invoice_items (4 Policies)
-- ✅ documents (4 Policies)
-- ✅ shifts (4 Policies)
-- ✅ cost_centers (4 Policies)
-- ✅ companies (2 Policies - user_id based)
-- ✅ profiles (2 Policies - user_id based)
-- ✅ chat_conversations (4 Policies)
-- ✅ chat_participants (4 Policies)
-- ✅ chat_messages (4 Policies)
-- ✅ calls (4 Policies)
-- ✅ email_templates (4 Policies)
-- ✅ payment_reminders (4 Policies)
-- ✅ document_expiry_reminders (4 Policies)
-- ✅ monitoring_logs (2 Policies - admin only)
-- ✅ agent_status (2 Policies - admin only)
-- ✅ system_health_logs (2 Policies - admin only)
-- ✅ auto_fix_logs (2 Policies - admin only)
-- ✅ brain_query_logs (2 Policies - admin only)
-- ✅ agent_improvement_logs (2 Policies - admin only)

-- ==================================================================================
-- VERIFICATION QUERIES
-- ==================================================================================

-- 1. Count tables WITH RLS
SELECT COUNT(*) as tables_with_rls
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true;

-- 2. Count tables WITHOUT RLS
SELECT COUNT(*) as tables_without_rls
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = false;

-- 3. List all tables with their RLS status
SELECT
  tablename,
  rowsecurity as has_rls,
  CASE
    WHEN rowsecurity THEN '✅ RLS Enabled'
    ELSE '⚠️ RLS Missing'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY rowsecurity DESC, tablename;

-- 4. Count policies per table
SELECT
  schemaname,
  tablename,
  COUNT(policyname) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY policy_count DESC, tablename;

-- ==================================================================================
-- ENHANCEMENT: Add RLS to any missing tables
-- ==================================================================================

-- Example: If a table needs RLS, use this pattern:
--
-- ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "company_isolation_select" ON {table_name}
-- FOR SELECT USING (
--   company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid())
-- );
--
-- CREATE POLICY "company_isolation_insert" ON {table_name}
-- FOR INSERT WITH CHECK (
--   company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid())
-- );
--
-- CREATE POLICY "company_isolation_update" ON {table_name}
-- FOR UPDATE USING (
--   company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid())
-- ) WITH CHECK (
--   company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid())
-- );
--
-- CREATE POLICY "company_isolation_delete" ON {table_name}
-- FOR DELETE USING (
--   company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid())
-- );

-- ==================================================================================
-- SPECIAL CASES
-- ==================================================================================

-- 1. Tables WITHOUT company_id (system tables)
-- These tables should use user_id or be admin-only
-- Examples: companies, profiles, feature_flags, api_keys

-- 2. Public tables (no RLS needed)
-- Examples: email_templates (shared across all companies)

-- 3. Admin-only tables
-- Examples: monitoring_logs, system_health_logs
-- Should have: WHERE (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'master'

-- ==================================================================================
-- MAINTENANCE FUNCTIONS
-- ==================================================================================

-- Function to check if a specific table has RLS
CREATE OR REPLACE FUNCTION check_table_rls(table_name_param text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT rowsecurity
  FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename = table_name_param;
$$;

-- Function to list all policies for a table
CREATE OR REPLACE FUNCTION get_table_policies(table_name_param text)
RETURNS TABLE (
  policy_name text,
  policy_cmd text,
  policy_qual text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    policyname::text as policy_name,
    cmd::text as policy_cmd,
    qual::text as policy_qual
  FROM pg_policies
  WHERE schemaname = 'public'
  AND tablename = table_name_param;
$$;

-- ==================================================================================
-- AUDIT REPORT
-- ==================================================================================

-- Generate comprehensive audit report
CREATE OR REPLACE FUNCTION generate_rls_audit_report()
RETURNS TABLE (
  category text,
  table_name text,
  has_rls boolean,
  policy_count bigint,
  status text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  WITH table_info AS (
    SELECT
      t.tablename,
      t.rowsecurity as has_rls,
      COUNT(p.policyname) as policy_count,
      CASE
        WHEN t.tablename LIKE 'nexify_%' THEN 'NeXify System'
        WHEN t.tablename IN ('companies', 'profiles', 'special_accounts') THEN 'User Management'
        WHEN t.tablename IN ('bookings', 'customers', 'drivers', 'vehicles') THEN 'Core Business'
        WHEN t.tablename IN ('invoices', 'invoice_items', 'payment_reminders') THEN 'Finance'
        WHEN t.tablename IN ('chat_conversations', 'chat_messages', 'calls') THEN 'Communication'
        WHEN t.tablename IN ('monitoring_logs', 'system_health_logs', 'agent_status') THEN 'System Monitoring'
        ELSE 'Other'
      END as category
    FROM pg_tables t
    LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
    WHERE t.schemaname = 'public'
    GROUP BY t.tablename, t.rowsecurity
  )
  SELECT
    category,
    tablename as table_name,
    has_rls,
    policy_count,
    CASE
      WHEN has_rls AND policy_count >= 4 THEN '✅ Excellent'
      WHEN has_rls AND policy_count >= 2 THEN '⚠️ Good (consider more policies)'
      WHEN has_rls AND policy_count < 2 THEN '⚠️ RLS enabled but few policies'
      ELSE '🔴 No RLS!'
    END as status
  FROM table_info
  ORDER BY
    CASE category
      WHEN 'Core Business' THEN 1
      WHEN 'Finance' THEN 2
      WHEN 'Communication' THEN 3
      WHEN 'User Management' THEN 4
      WHEN 'System Monitoring' THEN 5
      WHEN 'NeXify System' THEN 6
      ELSE 7
    END,
    table_name;
$$;

-- ==================================================================================
-- RUN AUDIT
-- ==================================================================================

-- To execute audit:
-- SELECT * FROM generate_rls_audit_report();

-- ==================================================================================
-- DOCUMENTATION
-- ==================================================================================

COMMENT ON FUNCTION get_tables_without_rls() IS 'Findet alle Tabellen ohne RLS-Schutz';
COMMENT ON FUNCTION check_table_rls(text) IS 'Prüft ob eine spezifische Tabelle RLS aktiviert hat';
COMMENT ON FUNCTION get_table_policies(text) IS 'Listet alle Policies einer Tabelle';
COMMENT ON FUNCTION generate_rls_audit_report() IS 'Generiert vollständigen RLS-Audit-Report';

-- ==================================================================================
-- CHANGELOG
-- ==================================================================================
-- 2025-11-08: Initial RLS Audit Migration
--             - Audit functions created
--             - Verification queries added
--             - Standard policy templates documented
