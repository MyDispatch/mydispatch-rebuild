-- API Keys Management Table
-- Stores encrypted API keys for external services

CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    key_name TEXT NOT NULL,
    encrypted_value TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_validated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    UNIQUE(organization_id, service_name, key_name)
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their organization's keys
CREATE POLICY "Users can view their organization's API keys"
    ON api_keys FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM user_organizations 
            WHERE user_id = auth.uid()
        )
    );

-- Policy: Only admins can insert/update/delete keys
CREATE POLICY "Admins can manage API keys"
    ON api_keys FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_organizations
            WHERE user_id = auth.uid()
            AND organization_id = api_keys.organization_id
            AND role IN ('admin', 'owner')
        )
    );

-- Indexes for performance
CREATE INDEX idx_api_keys_org ON api_keys(organization_id);
CREATE INDEX idx_api_keys_service ON api_keys(service_name);
CREATE INDEX idx_api_keys_active ON api_keys(is_active);

-- Updated timestamp trigger
CREATE TRIGGER update_api_keys_updated_at
    BEFORE UPDATE ON api_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Audit log for API key changes
CREATE TABLE IF NOT EXISTS api_keys_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
    organization_id UUID NOT NULL,
    action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'validated'
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    old_value JSONB,
    new_value JSONB
);

CREATE INDEX idx_api_keys_audit_org ON api_keys_audit(organization_id);
CREATE INDEX idx_api_keys_audit_key ON api_keys_audit(api_key_id);
