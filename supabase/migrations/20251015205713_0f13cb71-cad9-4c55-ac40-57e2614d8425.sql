-- ==================================================================================
-- V18.1 SECURITY FIX: Enable RLS for performance_metrics
-- ==================================================================================

ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Only allow system/master accounts to view performance metrics
CREATE POLICY "Only master accounts can view performance metrics"
  ON performance_metrics FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE email IN ('info@simsek.cc', 'nexify.login@gmail.com')
    )
  );

-- Allow system to insert performance metrics
CREATE POLICY "System can insert performance metrics"
  ON performance_metrics FOR INSERT
  WITH CHECK (true);