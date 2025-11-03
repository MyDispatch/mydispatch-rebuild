-- ==================================================================================
-- DZ-FMS Phase 1.1: Error Logs Table for Error Tracker
-- ==================================================================================

CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  user_id UUID REFERENCES auth.users(id),
  
  -- Error Details
  error_message TEXT NOT NULL,
  error_stack TEXT,
  error_category TEXT NOT NULL CHECK (error_category IN ('api', 'ui', 'auth', 'data', 'network', 'validation', 'unknown')),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  
  -- Context
  component_name TEXT,
  device_info JSONB,
  context JSONB,
  
  -- Tracking
  count INTEGER DEFAULT 1,
  last_occurrence TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id)
);

-- Index für Performance
CREATE INDEX IF NOT EXISTS idx_error_logs_company ON error_logs(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_category ON error_logs(error_category, created_at DESC);

-- Enable RLS
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can view errors from their company
CREATE POLICY "Users can view error logs of their company"
  ON error_logs
  FOR SELECT
  USING (
    company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
  );

-- System can insert error logs (no user context required)
CREATE POLICY "System can insert error logs"
  ON error_logs
  FOR INSERT
  WITH CHECK (true);

-- Admins can update/resolve errors
CREATE POLICY "Admins can resolve errors"
  ON error_logs
  FOR UPDATE
  USING (
    company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
    AND has_role(auth.uid(), 'admin'::app_role)
  );

-- Auto-delete old error logs (>90 days) for DSGVO compliance
CREATE OR REPLACE FUNCTION cleanup_old_error_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM error_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  RAISE NOTICE 'Cleaned up error logs older than 90 days';
END;
$$;