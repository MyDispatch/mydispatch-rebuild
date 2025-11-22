-- ==================================================================================
-- DELETION REQUESTS TABLE - DSGVO Art. 17 Compliance
-- ==================================================================================
-- Purpose: Manage customer data deletion requests (Right to be Forgotten)
-- Compliance: EU GDPR Article 17 (Right to Erasure)
-- ==================================================================================

-- Create deletion_requests table
CREATE TABLE IF NOT EXISTS deletion_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  requester_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('full_account', 'customer_data', 'partial_data')),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  notes TEXT,
  archived BOOLEAN DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (MANDATORY for all tables)
ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX idx_deletion_requests_company ON deletion_requests(company_id) WHERE archived = FALSE;
CREATE INDEX idx_deletion_requests_status ON deletion_requests(status) WHERE archived = FALSE;
CREATE INDEX idx_deletion_requests_customer ON deletion_requests(customer_id) WHERE archived = FALSE;
CREATE INDEX idx_deletion_requests_requested_at ON deletion_requests(requested_at DESC);

-- RLS Policies

-- Policy: Users can view deletion requests in their company
CREATE POLICY "Users can view company deletion requests"
ON deletion_requests FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Authenticated users can create deletion requests
CREATE POLICY "Users can create deletion requests"
ON deletion_requests FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Only admins can update/approve/reject requests
CREATE POLICY "Admins can update deletion requests"
ON deletion_requests FOR UPDATE
USING (
  company_id IN (
    SELECT company_id
    FROM profiles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'super_admin')
  )
);

-- Policy: Admins can delete (archive) requests
CREATE POLICY "Admins can delete deletion requests"
ON deletion_requests FOR DELETE
USING (
  company_id IN (
    SELECT company_id
    FROM profiles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'super_admin')
  )
);

-- Trigger: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_deletion_requests_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_deletion_requests_timestamp
BEFORE UPDATE ON deletion_requests
FOR EACH ROW
EXECUTE FUNCTION update_deletion_requests_timestamp();

-- Audit log function for DSGVO compliance tracking
CREATE OR REPLACE FUNCTION log_deletion_request_audit()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert audit log (assumes you have a system_logs or audit_logs table)
  -- If not, this can log to brain_logs or another audit table
  INSERT INTO brain_logs (
    log_level,
    message,
    context,
    metadata,
    created_at
  ) VALUES (
    'info',
    CASE
      WHEN TG_OP = 'INSERT' THEN 'DSGVO deletion request created'
      WHEN TG_OP = 'UPDATE' AND NEW.status != OLD.status THEN 'DSGVO deletion request status changed: ' || OLD.status || ' → ' || NEW.status
      WHEN TG_OP = 'DELETE' THEN 'DSGVO deletion request archived'
      ELSE 'DSGVO deletion request modified'
    END,
    jsonb_build_object(
      'request_id', COALESCE(NEW.id, OLD.id),
      'company_id', COALESCE(NEW.company_id, OLD.company_id),
      'request_type', COALESCE(NEW.request_type, OLD.request_type),
      'status', NEW.status,
      'old_status', OLD.status,
      'operation', TG_OP
    ),
    jsonb_build_object(
      'table', 'deletion_requests',
      'timestamp', NOW(),
      'user_id', auth.uid()
    ),
    NOW()
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_deletion_request_audit
AFTER INSERT OR UPDATE OR DELETE ON deletion_requests
FOR EACH ROW
EXECUTE FUNCTION log_deletion_request_audit();

-- Comments for documentation
COMMENT ON TABLE deletion_requests IS 'DSGVO Article 17 - Right to Erasure (Right to be Forgotten) request management';
COMMENT ON COLUMN deletion_requests.request_type IS 'full_account: Complete account deletion | customer_data: Delete customer records | partial_data: Delete specific data';
COMMENT ON COLUMN deletion_requests.status IS 'pending: Awaiting review | approved: Approved for deletion | rejected: Request denied | completed: Deletion completed';
COMMENT ON COLUMN deletion_requests.reason IS 'User-provided reason for deletion request (optional)';
COMMENT ON COLUMN deletion_requests.rejection_reason IS 'Admin-provided reason if request is rejected (required for rejected status)';
