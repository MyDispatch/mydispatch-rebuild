-- ==================================================================================
-- SECURITY FIX: Add white-label indicator to public view (without exposing tariff)
-- ==================================================================================

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
  -- 🔒 White-Label indicator WITHOUT exposing subscription_product_id
  -- Enterprise tariffs have white-label (no "Powered by MyDispatch")
  CASE 
    WHEN subscription_product_id LIKE '%enterprise%' THEN false
    ELSE true
  END as show_powered_by,
  created_at
FROM companies
WHERE landingpage_enabled = true 
  AND company_status = 'active';

GRANT SELECT ON companies_public_info TO anon, authenticated;