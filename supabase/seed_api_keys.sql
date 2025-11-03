-- Seed API Keys with known services
-- These are templates that admins can fill in

-- Insert default API key templates for first organization
INSERT INTO api_keys (organization_id, service_name, key_name, encrypted_value, is_active, created_by)
SELECT 
    o.id as organization_id,
    service_name,
    key_name,
    'ENCRYPTED_PLACEHOLDER_' || service_name || '_' || key_name as encrypted_value,
    false as is_active, -- Inactive until admin fills in real values
    (SELECT id FROM auth.users LIMIT 1) as created_by
FROM organizations o
CROSS JOIN (
    VALUES 
        -- Supabase
        ('supabase', 'url'),
        ('supabase', 'anon_key'),
        ('supabase', 'service_role_key'),
        
        -- Google Services
        ('google_maps', 'api_key'),
        ('google_maps', 'places_api_key'),
        ('google_calendar', 'api_key'),
        ('google_calendar', 'client_id'),
        ('google_calendar', 'client_secret'),
        
        -- Payment Providers
        ('stripe', 'publishable_key'),
        ('stripe', 'secret_key'),
        ('stripe', 'webhook_secret'),
        ('paypal', 'client_id'),
        ('paypal', 'client_secret'),
        
        -- Email Services
        ('sendgrid', 'api_key'),
        ('resend', 'api_key'),
        ('mailgun', 'api_key'),
        ('mailgun', 'domain'),
        
        -- SMS Services
        ('twilio', 'account_sid'),
        ('twilio', 'auth_token'),
        ('twilio', 'phone_number'),
        
        -- Push Notifications
        ('firebase', 'server_key'),
        ('firebase', 'sender_id'),
        ('onesignal', 'app_id'),
        ('onesignal', 'api_key'),
        
        -- Analytics
        ('google_analytics', 'measurement_id'),
        ('mixpanel', 'project_token'),
        
        -- Error Tracking
        ('sentry', 'dsn'),
        
        -- Storage
        ('aws_s3', 'access_key_id'),
        ('aws_s3', 'secret_access_key'),
        ('aws_s3', 'bucket_name'),
        ('aws_s3', 'region'),
        
        -- Other Services
        ('openai', 'api_key'),
        ('anthropic', 'api_key')
) AS services(service_name, key_name)
WHERE o.id = (SELECT id FROM organizations LIMIT 1)
ON CONFLICT (organization_id, service_name, key_name) DO NOTHING;
