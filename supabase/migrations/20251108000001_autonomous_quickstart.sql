-- ==================================================================================
-- AUTONOMOUS SYSTEM QUICK START
-- ==================================================================================
-- Purpose: Activate autonomous system immediately after migration
-- Run this in Supabase SQL Editor AFTER applying main migration
-- ==================================================================================

-- Step 1: Enable Autonomous System (DRY-RUN mode for safety)
UPDATE autonomous_system_config
SET
  enabled = true,
  dry_run_mode = true,
  autonomy_level = 2,
  max_parallel_tasks = 3,
  notification_email = 'courbois1981@gmail.com',
  notify_on_completion = true,
  updated_at = NOW(),
  updated_by = 'initial_setup'
WHERE id IN (SELECT id FROM autonomous_system_config LIMIT 1);

-- Step 2: Insert sample autonomous tasks for testing
INSERT INTO autonomous_tasks (task_type, description, priority, autonomy_level, risk_level, requires_approval, files_affected)
VALUES
  -- Task 1: Safe documentation update
  ('documentation', 'Update CHANGELOG.md with autonomous system v1.0', 5, 2, 'low', false, ARRAY['CHANGELOG.md']),

  -- Task 2: Layout fix (safe, auto-approved)
  ('layout_fix', 'Fix spacing inconsistencies in Dashboard components', 6, 2, 'low', false, ARRAY['src/pages/Dashboard.tsx']),

  -- Task 3: Type improvement (safe, auto-approved)
  ('type_improvement', 'Replace any types with proper TypeScript types', 7, 2, 'low', false, ARRAY['src/hooks/use-bookings.ts']);

-- Step 3: Verify setup
SELECT
  'System Config' as component,
  CASE WHEN enabled THEN '✅ Enabled' ELSE '❌ Disabled' END as status,
  'Autonomy Level ' || autonomy_level::text as level,
  CASE WHEN dry_run_mode THEN '🧪 DRY-RUN MODE' ELSE '🚀 PRODUCTION MODE' END as mode
FROM autonomous_system_config
LIMIT 1

UNION ALL

SELECT
  'Pending Tasks' as component,
  COUNT(*)::text || ' tasks' as status,
  '' as level,
  '' as mode
FROM autonomous_tasks
WHERE status = 'pending';

-- Step 4: View pending tasks
SELECT
  id,
  task_type,
  description,
  priority,
  autonomy_level,
  risk_level,
  requires_approval,
  status,
  created_at
FROM autonomous_tasks
WHERE status = 'pending'
ORDER BY priority DESC, created_at ASC;

-- Step 5: Check system statistics
SELECT * FROM autonomous_system_stats;

-- ==================================================================================
-- NEXT STEPS (After running this script)
-- ==================================================================================
--
-- 1. Verify Edge Functions are deployed:
--    https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/functions
--
-- 2. Test ai-agent-poll Edge Function:
--    curl -X POST https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/ai-agent-poll \
--      -H "Authorization: Bearer YOUR_ANON_KEY"
--
-- 3. Setup Cron Job for automatic execution:
--    Dashboard → Database → Cron Jobs → Create Job
--    Schedule: "*/5 * * * *" (every 5 minutes)
--    Command: SELECT net.http_post(
--               url:='https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/ai-agent-poll',
--               headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
--             );
--
-- 4. Monitor execution:
--    SELECT * FROM autonomous_execution_logs ORDER BY timestamp DESC LIMIT 20;
--
-- 5. Disable dry-run mode when ready for production:
--    UPDATE autonomous_system_config SET dry_run_mode = false;
--
-- 6. Emergency stop if needed:
--    SELECT emergency_stop_autonomous_system('Testing emergency stop', 1);
--
-- ==================================================================================
-- VERIFICATION QUERIES
-- ==================================================================================

-- Check if all tables exist
SELECT
  table_name,
  CASE
    WHEN table_name IN (
      'autonomous_tasks',
      'autonomous_execution_logs',
      'autonomous_system_config',
      'autonomous_safety_checks'
    ) THEN '✅ Exists'
    ELSE '❌ Missing'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'autonomous%'
ORDER BY table_name;

-- Check if functions exist
SELECT
  routine_name,
  '✅ Exists' as status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'get_autonomous_config',
    'create_autonomous_task',
    'emergency_stop_autonomous_system'
  )
ORDER BY routine_name;

-- ==================================================================================
-- SUCCESS MESSAGE
-- ==================================================================================
SELECT
  '🎉 Autonomous System Quick Start Complete!' as message,
  'System is now active in DRY-RUN mode' as status,
  '3 sample tasks created for testing' as tasks,
  'Check autonomous_tasks table to see them' as next_step;
