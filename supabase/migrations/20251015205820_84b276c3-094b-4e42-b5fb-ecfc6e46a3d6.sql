-- ==================================================================================
-- V18.1: Security-Fixes für Linter-Warnungen
-- ==================================================================================

-- 1. RLS für audit_logs aktivieren (falls noch nicht vorhanden)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. RLS-Policies für audit_logs (nur wenn noch nicht vorhanden)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'audit_logs' 
    AND policyname = 'Users can view their company audit logs'
  ) THEN
    CREATE POLICY "Users can view their company audit logs"
      ON audit_logs FOR SELECT
      USING (
        company_id IN (
          SELECT company_id FROM profiles WHERE user_id = auth.uid()
        )
      );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'audit_logs' 
    AND policyname = 'System can insert audit logs'
  ) THEN
    CREATE POLICY "System can insert audit logs"
      ON audit_logs FOR INSERT
      WITH CHECK (
        company_id IN (
          SELECT company_id FROM profiles WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- 3. Search Path für Funktionen setzen (Security-Fix)
ALTER FUNCTION get_partner_vehicles(uuid) SET search_path = public;
ALTER FUNCTION get_partner_drivers(uuid) SET search_path = public;