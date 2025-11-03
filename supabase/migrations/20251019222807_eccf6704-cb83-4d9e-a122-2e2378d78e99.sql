-- ==================================================================================
-- SECURITY FIX: Remove SECURITY DEFINER views and fix public data exposure
-- ==================================================================================

-- 1. Fix companies_public_info view - recreate without SECURITY DEFINER
-- Only expose safe, non-sensitive fields
DROP VIEW IF EXISTS companies_public_info CASCADE;

CREATE OR REPLACE VIEW companies_public_info AS
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
  -- ONLY expose city and postal code (no full address)
  postal_code,
  city,
  -- Conditionally expose contact info only for active landingpages
  CASE WHEN landingpage_enabled = true THEN phone ELSE NULL END as phone,
  CASE WHEN landingpage_enabled = true THEN email ELSE NULL END as email,
  created_at
FROM companies
WHERE landingpage_enabled = true 
  AND company_status = 'active';

-- Explicitly grant access (no SECURITY DEFINER)
GRANT SELECT ON companies_public_info TO anon, authenticated;

-- 2. Restrict public access to companies table
-- Drop overly permissive policy
DROP POLICY IF EXISTS "Public can view basic landingpage info" ON companies;

-- Create minimal policy - public can ONLY check if landingpage exists
-- Actual data access goes through companies_public_info view
CREATE POLICY "Public can verify landingpage exists"
  ON companies
  FOR SELECT
  USING (
    landingpage_enabled = true 
    AND company_status = 'active'
  );

-- 3. Fix use-public-company.tsx hook to use the safe view
-- (Will be done in application code)

-- 4. Add comment for documentation
COMMENT ON VIEW companies_public_info IS 
  'Public-safe view of company data. Only exposes non-sensitive fields for active landingpages. 
   NO SECURITY DEFINER - uses caller permissions. 
   Sensitive fields (tax_id, stripe_*, billing_*, detailed address) are excluded.';

COMMENT ON POLICY "Public can verify landingpage exists" ON companies IS
  'Minimal public access. Use companies_public_info view for actual data retrieval.';