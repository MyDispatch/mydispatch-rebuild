-- ==================================================================================
-- AUTONOMOUS SYSTEM - COMPLETE SETUP (ERROR-FREE)
-- ==================================================================================
-- Version: 1.1 (Fixed)
-- Date: 2025-11-08
-- Purpose: Complete autonomous system with all dependencies
-- ==================================================================================

-- ==================================================================================
-- STEP 1: ENSURE REQUIRED EXTENSIONS
-- ==================================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================================================================================
-- STEP 2: CREATE TABLES
-- ==================================================================================

-- Table 1: autonomous_tasks
CREATE TABLE IF NOT EXISTS autonomous_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Task Details
  task_type TEXT NOT NULL CHECK (task_type IN (
    'layout_fix',
    'type_improvement',
    'performance_optimization',
    'test_creation',
    'documentation',
    'accessibility',
    'security_fix',
    'database_migration',
    'edge_function',
    'feature_implementation',
    'bug_fix',
    'refactoring'
  )),
  description TEXT NOT NULL,
  priority INTEGER DEFAULT 0 CHECK (priority BETWEEN 0 AND 10),

  -- Autonomy & Risk
  autonomy_level INTEGER NOT NULL DEFAULT 2 CHECK (autonomy_level IN (1, 2, 3)),
  risk_level TEXT NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  requires_approval BOOLEAN DEFAULT false,

  -- Execution Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',
    'in_progress',
    'completed',
    'failed',
    'awaiting_review',
    'approved',
    'rejected',
    'rolled_back'
  )),
  assigned_to TEXT DEFAULT 'ai_agent',

  -- Files & Changes
  files_affected TEXT[] DEFAULT '{}',
  estimated_duration_minutes INTEGER,

  -- Results
  result JSONB,
  error_message TEXT,
  rollback_data JSONB,

  -- GitKraken Integration
  gitkraken_patch_url TEXT,
  github_pr_url TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,

  -- Audit
  created_by TEXT DEFAULT 'autonomous_system',
  reviewed_by TEXT
);

-- Table 2: autonomous_execution_logs
CREATE TABLE IF NOT EXISTS autonomous_execution_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  task_id UUID REFERENCES autonomous_tasks(id) ON DELETE CASCADE,

  -- Execution Details
  execution_step TEXT NOT NULL,
  step_status TEXT CHECK (step_status IN ('started', 'completed', 'failed', 'skipped')),

  -- Data
  input_data JSONB,
  output_data JSONB,
  error_data JSONB,

  -- Timestamps
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  duration_ms INTEGER,

  -- Context
  agent_version TEXT,
  git_commit_sha TEXT,
  environment TEXT DEFAULT 'production'
);

-- Table 3: autonomous_system_config
CREATE TABLE IF NOT EXISTS autonomous_system_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- System Control
  enabled BOOLEAN DEFAULT false,  -- Start disabled for safety
  dry_run_mode BOOLEAN DEFAULT true,  -- Start in dry-run for safety
  autonomy_level INTEGER DEFAULT 2 CHECK (autonomy_level IN (1, 2, 3)),

  -- Safety Limits
  max_parallel_tasks INTEGER DEFAULT 5,
  max_tasks_per_run INTEGER DEFAULT 10,
  max_files_per_task INTEGER DEFAULT 20,

  -- Rate Limiting
  min_interval_minutes INTEGER DEFAULT 60,
  max_daily_tasks INTEGER DEFAULT 50,

  -- Emergency Stop
  emergency_stop BOOLEAN DEFAULT false,
  emergency_stop_reason TEXT,
  emergency_stop_until TIMESTAMPTZ,

  -- Notifications
  notification_email TEXT DEFAULT 'courbois1981@gmail.com',
  notify_on_completion BOOLEAN DEFAULT true,
  notify_on_failure BOOLEAN DEFAULT true,
  notify_on_high_risk BOOLEAN DEFAULT true,

  -- Timestamps
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- Table 4: autonomous_safety_checks
CREATE TABLE IF NOT EXISTS autonomous_safety_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  task_id UUID REFERENCES autonomous_tasks(id) ON DELETE CASCADE,

  -- Check Details
  check_type TEXT NOT NULL CHECK (check_type IN (
    'build_validation',
    'test_validation',
    'rls_validation',
    'type_check',
    'lint_check',
    'security_scan',
    'dependency_audit',
    'breaking_change_detection'
  )),

  -- Results
  passed BOOLEAN NOT NULL,
  details JSONB,
  error_message TEXT,

  -- Timestamps
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  duration_ms INTEGER
);

-- ==================================================================================
-- STEP 3: CREATE INDEXES
-- ==================================================================================
CREATE INDEX IF NOT EXISTS idx_autonomous_tasks_status ON autonomous_tasks(status);
CREATE INDEX IF NOT EXISTS idx_autonomous_tasks_priority ON autonomous_tasks(priority DESC);
CREATE INDEX IF NOT EXISTS idx_autonomous_tasks_created_at ON autonomous_tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_autonomous_tasks_type ON autonomous_tasks(task_type);

CREATE INDEX IF NOT EXISTS idx_execution_logs_task_id ON autonomous_execution_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_timestamp ON autonomous_execution_logs(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_safety_checks_task_id ON autonomous_safety_checks(task_id);
CREATE INDEX IF NOT EXISTS idx_safety_checks_passed ON autonomous_safety_checks(passed);

-- ==================================================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- ==================================================================================
ALTER TABLE autonomous_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE autonomous_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE autonomous_system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE autonomous_safety_checks ENABLE ROW LEVEL SECURITY;

-- ==================================================================================
-- STEP 5: CREATE RLS POLICIES (Permissive for now, tighten in production)
-- ==================================================================================
CREATE POLICY "Allow all for service_role" ON autonomous_tasks FOR ALL USING (true);
CREATE POLICY "Allow all for service_role logs" ON autonomous_execution_logs FOR ALL USING (true);
CREATE POLICY "Allow all for service_role config" ON autonomous_system_config FOR ALL USING (true);
CREATE POLICY "Allow all for service_role checks" ON autonomous_safety_checks FOR ALL USING (true);

-- ==================================================================================
-- STEP 6: CREATE HELPER FUNCTIONS
-- ==================================================================================

-- Function 1: Get system config
CREATE OR REPLACE FUNCTION get_autonomous_config()
RETURNS autonomous_system_config
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  config autonomous_system_config;
BEGIN
  SELECT * INTO config FROM autonomous_system_config LIMIT 1;

  IF config IS NULL THEN
    RAISE EXCEPTION 'Autonomous system config not initialized';
  END IF;

  RETURN config;
END;
$$;

-- Function 2: Create task with validation
CREATE OR REPLACE FUNCTION create_autonomous_task(
  p_task_type TEXT,
  p_description TEXT,
  p_autonomy_level INTEGER DEFAULT 2,
  p_priority INTEGER DEFAULT 5
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_config autonomous_system_config;
  v_task_id UUID;
  v_daily_count INTEGER;
BEGIN
  -- Get config
  v_config := get_autonomous_config();

  -- Check if system is enabled
  IF NOT v_config.enabled THEN
    RAISE EXCEPTION 'Autonomous system is disabled';
  END IF;

  -- Check emergency stop
  IF v_config.emergency_stop THEN
    RAISE EXCEPTION 'Emergency stop active: %', v_config.emergency_stop_reason;
  END IF;

  -- Check daily limit
  SELECT COUNT(*) INTO v_daily_count
  FROM autonomous_tasks
  WHERE created_at > NOW() - INTERVAL '24 hours';

  IF v_daily_count >= v_config.max_daily_tasks THEN
    RAISE EXCEPTION 'Daily task limit reached: %', v_config.max_daily_tasks;
  END IF;

  -- Create task
  INSERT INTO autonomous_tasks (
    task_type,
    description,
    autonomy_level,
    priority,
    requires_approval
  ) VALUES (
    p_task_type,
    p_description,
    p_autonomy_level,
    p_priority,
    p_autonomy_level >= 3 OR p_priority >= 8
  )
  RETURNING id INTO v_task_id;

  RETURN v_task_id;
END;
$$;

-- Function 3: Emergency stop
CREATE OR REPLACE FUNCTION emergency_stop_autonomous_system(
  p_reason TEXT,
  p_duration_hours INTEGER DEFAULT 24
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE autonomous_system_config
  SET
    emergency_stop = true,
    emergency_stop_reason = p_reason,
    emergency_stop_until = NOW() + (p_duration_hours || ' hours')::INTERVAL,
    updated_at = NOW(),
    updated_by = current_user;

  -- Cancel all pending tasks
  UPDATE autonomous_tasks
  SET status = 'rejected', error_message = 'Emergency stop: ' || p_reason
  WHERE status IN ('pending', 'in_progress');

  RETURN true;
END;
$$;

-- ==================================================================================
-- STEP 7: CREATE STATISTICS VIEW
-- ==================================================================================
CREATE OR REPLACE VIEW autonomous_system_stats AS
SELECT
  COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_tasks,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_tasks,
  COUNT(*) FILTER (WHERE status = 'awaiting_review') as review_tasks,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at)) / 60) FILTER (WHERE status = 'completed') as avg_duration_minutes,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as tasks_last_24h,
  COUNT(*) FILTER (WHERE status = 'completed' AND created_at > NOW() - INTERVAL '24 hours') as completed_last_24h
FROM autonomous_tasks;

-- ==================================================================================
-- STEP 8: SEED INITIAL CONFIG (DISABLED BY DEFAULT)
-- ==================================================================================
INSERT INTO autonomous_system_config (
  id,
  enabled,
  dry_run_mode,
  autonomy_level,
  max_parallel_tasks,
  notification_email
)
SELECT
  uuid_generate_v4(),
  false,  -- DISABLED by default for safety
  true,   -- DRY-RUN by default for safety
  2,
  3,
  'courbois1981@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM autonomous_system_config);

-- ==================================================================================
-- STEP 9: LOG MIGRATION (only if brain_logs exists)
-- ==================================================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'brain_logs'
  ) THEN
    INSERT INTO brain_logs (log_type, message, context)
    VALUES (
      'migration',
      'Autonomous system setup completed',
      jsonb_build_object(
        'version', '1.1',
        'tables_created', ARRAY['autonomous_tasks', 'autonomous_execution_logs', 'autonomous_system_config', 'autonomous_safety_checks'],
        'functions_created', ARRAY['get_autonomous_config', 'create_autonomous_task', 'emergency_stop_autonomous_system'],
        'enabled', false,
        'dry_run_mode', true
      )
    );
  END IF;
END $$;

-- ==================================================================================
-- SUCCESS MESSAGE
-- ==================================================================================
SELECT
  '✅ Autonomous System Setup Complete!' as message,
  'System initialized (DISABLED by default)' as status,
  'Run activation script to enable' as next_step;
