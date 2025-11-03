-- ==================================================================================
-- MyDispatch V18.0 - Phase 1 Database Migration
-- Partner-System, System-Logs, Health-Checks, Performance-Indexes
-- ==================================================================================

-- 1. Partner Requests Table
CREATE TABLE IF NOT EXISTS partner_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requesting_company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  target_company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT no_self_request CHECK (requesting_company_id != target_company_id)
);

-- 2. Partner Connections Table
CREATE TABLE IF NOT EXISTS partner_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_a_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  company_b_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  share_vehicles BOOLEAN NOT NULL DEFAULT true,
  share_drivers BOOLEAN NOT NULL DEFAULT true,
  provision_rate NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (provision_rate >= 0 AND provision_rate <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(company_a_id, company_b_id),
  CONSTRAINT no_self_connection CHECK (company_a_id != company_b_id)
);

-- 3. System Logs Table
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('error', 'warn', 'info', 'debug')),
  message TEXT NOT NULL,
  context JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Health Checks Table
CREATE TABLE IF NOT EXISTS health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL CHECK (service IN ('database', 'edge_functions', 'storage', 'auth')),
  status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'down')),
  response_time_ms INTEGER,
  error_message TEXT,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_company_archived ON bookings(company_id, archived) WHERE archived = false;
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_drivers_company_status ON drivers(company_id, shift_status) WHERE archived = false;
CREATE INDEX IF NOT EXISTS idx_vehicles_company_status ON vehicles(company_id, status) WHERE archived = false;
CREATE INDEX IF NOT EXISTS idx_customers_company_archived ON customers(company_id, archived) WHERE archived = false;
CREATE INDEX IF NOT EXISTS idx_partner_requests_target ON partner_requests(target_company_id, status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_partner_connections_companies ON partner_connections(company_a_id, company_b_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_company_level ON system_logs(company_id, level, created_at DESC);

-- 6. RLS Policies for Partner Requests
ALTER TABLE partner_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view requests for their company"
  ON partner_requests FOR SELECT
  USING (
    requesting_company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
    OR target_company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create requests for their company"
  ON partner_requests FOR INSERT
  WITH CHECK (requesting_company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update requests for their company"
  ON partner_requests FOR UPDATE
  USING (target_company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

-- 7. RLS Policies for Partner Connections
ALTER TABLE partner_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their partner connections"
  ON partner_connections FOR SELECT
  USING (
    company_a_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
    OR company_b_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete their partner connections"
  ON partner_connections FOR DELETE
  USING (
    company_a_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
    OR company_b_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid())
  );

-- 8. RLS Policies for System Logs
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view logs for their company"
  ON system_logs FOR SELECT
  USING (company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "System can insert logs"
  ON system_logs FOR INSERT
  WITH CHECK (true);

-- 9. RLS Policies for Health Checks (Master-Only)
ALTER TABLE health_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only master accounts can view health checks"
  ON health_checks FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE email IN ('info@simsek.cc', 'nexify.login@gmail.com')
    )
  );

-- 10. Triggers for updated_at
CREATE TRIGGER update_partner_requests_updated_at
  BEFORE UPDATE ON partner_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_connections_updated_at
  BEFORE UPDATE ON partner_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 11. Function to get partner resources (vehicles/drivers)
CREATE OR REPLACE FUNCTION get_partner_vehicles(user_company_id UUID)
RETURNS TABLE (
  vehicle_id UUID,
  license_plate TEXT,
  vehicle_class vehicle_class,
  partner_company_id UUID,
  partner_company_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.license_plate,
    v.vehicle_class,
    c.id,
    c.name
  FROM vehicles v
  JOIN companies c ON v.company_id = c.id
  JOIN partner_connections pc ON (
    (pc.company_a_id = user_company_id AND pc.company_b_id = c.id AND pc.share_vehicles = true)
    OR (pc.company_b_id = user_company_id AND pc.company_a_id = c.id AND pc.share_vehicles = true)
  )
  WHERE v.archived = false
    AND v.status = 'available';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_partner_drivers(user_company_id UUID)
RETURNS TABLE (
  driver_id UUID,
  first_name TEXT,
  last_name TEXT,
  partner_company_id UUID,
  partner_company_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.first_name,
    d.last_name,
    c.id,
    c.name
  FROM drivers d
  JOIN companies c ON d.company_id = c.id
  JOIN partner_connections pc ON (
    (pc.company_a_id = user_company_id AND pc.company_b_id = c.id AND pc.share_drivers = true)
    OR (pc.company_b_id = user_company_id AND pc.company_a_id = c.id AND pc.share_drivers = true)
  )
  WHERE d.archived = false
    AND d.shift_status = 'available';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;