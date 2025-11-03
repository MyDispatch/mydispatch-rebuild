-- Update NeXify (courbois1981@gmail.com) to Business Tariff
-- Dies ist eine manuelle Übersteuerung für Entwicklungs-/Testzwecke

UPDATE companies 
SET 
  subscription_status = 'active',
  subscription_product_id = 'prod_TEegHmtpPZOZcG', -- Business Monthly
  subscription_current_period_end = (NOW() + INTERVAL '1 year')::timestamptz,
  landingpage_enabled = true,
  widget_enabled = true
WHERE email = 'courbois1981@gmail.com';

-- Füge Admin-Rolle hinzu
INSERT INTO user_roles (user_id, role)
SELECT u.id, 'admin'
FROM auth.users u
WHERE u.email = 'courbois1981@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;