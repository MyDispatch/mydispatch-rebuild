-- ========================================
-- Task 13: Tarif-basierte Feature-Flags System
-- ========================================
-- Adds feature limits to companies table for tariff-based restrictions
-- Starter Tarif: max_drivers=3, max_vehicles=3
-- Business Tarif: unlimited (NULL or very high limits)

ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS feature_limits JSONB DEFAULT '{
  "max_drivers": null,
  "max_vehicles": null,
  "max_bookings_per_month": null,
  "has_customer_portal": true,
  "has_statistics": true,
  "has_financial_module": false
}'::JSONB;

-- Comments for documentation
COMMENT ON COLUMN public.companies.feature_limits IS 'Tariff-based feature restrictions (JSON). NULL = unlimited. Starter: max_drivers=3, max_vehicles=3. Business: all NULL (unlimited).';

-- Example values for different tariffs:
-- Starter Tarif:
-- {
--   "max_drivers": 3,
--   "max_vehicles": 3,
--   "max_bookings_per_month": 100,
--   "has_customer_portal": false,
--   "has_statistics": true,
--   "has_financial_module": false
-- }
--
-- Business Tarif:
-- {
--   "max_drivers": null,
--   "max_vehicles": null,
--   "max_bookings_per_month": null,
--   "has_customer_portal": true,
--   "has_statistics": true,
--   "has_financial_module": true
-- }

-- Index for fast feature limit lookups
CREATE INDEX IF NOT EXISTS idx_companies_feature_limits ON public.companies
USING GIN (feature_limits) WHERE feature_limits IS NOT NULL;

-- Helper function to check feature access (can be used in RLS policies)
CREATE OR REPLACE FUNCTION check_feature_limit(
  company_uuid UUID,
  feature_key TEXT,
  current_count INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  limit_value INTEGER;
BEGIN
  -- Get the limit from feature_limits JSONB
  SELECT (feature_limits->>feature_key)::INTEGER
  INTO limit_value
  FROM public.companies
  WHERE id = company_uuid;

  -- NULL means unlimited
  IF limit_value IS NULL THEN
    RETURN TRUE;
  END IF;

  -- Check if current count is below limit
  RETURN current_count < limit_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_feature_limit IS 'Checks if a feature limit is reached. Returns TRUE if allowed (current < limit or limit=NULL). Usage: SELECT check_feature_limit(company_id, ''max_drivers'', (SELECT COUNT(*) FROM drivers WHERE company_id = $1));';
