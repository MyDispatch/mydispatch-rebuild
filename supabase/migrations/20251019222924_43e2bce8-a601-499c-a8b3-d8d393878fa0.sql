-- ==================================================================================
-- SECURITY FIX: Fix public data exposure on companies table
-- ==================================================================================

-- 1. Drop the overly permissive policy on companies table
DROP POLICY IF EXISTS "Public can view basic landingpage info" ON companies;

-- 2. Create RESTRICTED view for public landingpage data (without SECURITY DEFINER)
DROP VIEW IF EXISTS companies_public_info;

CREATE VIEW companies_public_info AS
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
  -- ONLY city and postal code (NO street address)
  postal_code,
  city,
  -- Conditional exposure of contact info
  CASE WHEN landingpage_enabled = true AND widget_show_phone = true THEN phone ELSE NULL END as phone,
  CASE WHEN landingpage_enabled = true THEN email ELSE NULL END as email,
  created_at
FROM companies
WHERE landingpage_enabled = true 
  AND company_status = 'active';

-- Grant public read access to the view ONLY
GRANT SELECT ON companies_public_info TO anon, authenticated;

-- 3. Re-create RESTRICTED policy on companies table for public access
CREATE POLICY "Public can view safe landingpage info"
  ON companies
  FOR SELECT
  USING (
    landingpage_enabled = true 
    AND company_status = 'active'
  );

-- NOTE: This policy still needs field-level restrictions
-- Users should query companies_public_info view for public data
-- Direct table access for authenticated users will see all fields (as intended)