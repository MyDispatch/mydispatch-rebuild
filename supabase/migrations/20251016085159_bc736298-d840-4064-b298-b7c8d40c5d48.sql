-- Setze Entwicklerkonto auf Business-Tarif (aktiv)
UPDATE companies 
SET 
  subscription_product_id = 'prod_TEegHmtpPZOZcG',
  subscription_status = 'active',
  subscription_current_period_end = (NOW() + INTERVAL '1 year')::timestamptz,
  subscription_cancel_at_period_end = false,
  last_billing_check = NOW()
WHERE id = '7c841959-bcf6-4949-9d54-61aa2449b0f6';

-- Bestätigung
SELECT 
  id,
  name,
  subscription_product_id,
  subscription_status,
  subscription_current_period_end
FROM companies 
WHERE id = '7c841959-bcf6-4949-9d54-61aa2449b0f6';