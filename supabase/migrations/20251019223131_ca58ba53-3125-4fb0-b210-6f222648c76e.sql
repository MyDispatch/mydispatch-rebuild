-- ==================================================================================
-- SECURITY FIX: Convert all views to SECURITY INVOKER (respect querying user's RLS)
-- ==================================================================================

-- 1. Fix archived_documents view
DROP VIEW IF EXISTS archived_documents;

CREATE VIEW archived_documents 
WITH (security_invoker = true) AS
SELECT 
  id,
  entity_type,
  entity_id,
  document_type,
  expiry_date,
  archived_at,
  company_id
FROM documents
WHERE archived = true
ORDER BY archived_at DESC;

-- Add RLS policy for archived_documents view access
GRANT SELECT ON archived_documents TO authenticated;

-- 2. Fix archived_partner_connections view
DROP VIEW IF EXISTS archived_partner_connections;

CREATE VIEW archived_partner_connections
WITH (security_invoker = true) AS
SELECT 
  id,
  company_a_id,
  company_b_id,
  provision_rate,
  archived_at
FROM partner_connections
WHERE archived = true
ORDER BY archived_at DESC;

GRANT SELECT ON archived_partner_connections TO authenticated;

-- 3. Fix companies_public_info view (make it SECURITY INVOKER)
DROP VIEW IF EXISTS companies_public_info;

CREATE VIEW companies_public_info
WITH (security_invoker = true) AS
SELECT 
  id,
  name,
  company_slug,
  business_type,
  logo_url,
  primary_color,
  landingpage_title,
  landingpage_hero_text,
  landingpage_description,
  landingpage_enabled,
  widget_enabled,
  widget_button_text,
  widget_size,
  widget_show_phone,
  business_hours,
  timezone,
  postal_code,
  city,
  CASE WHEN landingpage_enabled = true AND widget_show_phone = true THEN phone ELSE NULL END as phone,
  CASE WHEN landingpage_enabled = true THEN email ELSE NULL END as email,
  created_at
FROM companies
WHERE landingpage_enabled = true 
  AND company_status = 'active';

GRANT SELECT ON companies_public_info TO anon, authenticated;

-- 4. Fix slow_queries view (monitoring view)
DROP VIEW IF EXISTS slow_queries;

CREATE VIEW slow_queries
WITH (security_invoker = true) AS
SELECT 
  query,
  calls,
  mean_exec_time,
  max_exec_time,
  stddev_exec_time
FROM extensions.pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 20;

GRANT SELECT ON slow_queries TO authenticated;

-- NOTE: dashboard_stats is a MATERIALIZED VIEW and cannot use security_invoker
-- Materialized views always run with creator's permissions
-- This is acceptable as it's a computed cache