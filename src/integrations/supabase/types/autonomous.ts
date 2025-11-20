/**
 * AUTONOMOUS SYSTEM - TypeScript Types
 *
 * Generated based on supabase/migrations/20251108000002_autonomous_complete_fixed.sql
 * These types match the database schema for autonomous system tables
 *
 * Note: JSONB fields use `any` type for flexible data storage - this is intentional
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AutonomousTask {
  id: string;

  // Task Details
  task_type:
    | 'layout_fix'
    | 'type_improvement'
    | 'performance_optimization'
    | 'test_creation'
    | 'documentation'
    | 'accessibility'
    | 'security_fix'
    | 'database_migration'
    | 'edge_function'
    | 'feature_implementation'
    | 'bug_fix'
    | 'refactoring';
  description: string;
  priority: number;

  // Autonomy & Risk
  autonomy_level: 1 | 2 | 3;
  risk_level: 'low' | 'medium' | 'high';
  requires_approval: boolean;

  // Execution Status
  status:
    | 'pending'
    | 'in_progress'
    | 'completed'
    | 'failed'
    | 'awaiting_review'
    | 'approved'
    | 'rejected'
    | 'rolled_back';
  assigned_to: string;

  // Files & Changes
  files_affected: string[];
  estimated_duration_minutes: number | null;

  // Results
  result: Record<string, any> | null;
  error_message: string | null;
  rollback_data: Record<string, any> | null;

  // GitKraken Integration
  gitkraken_patch_url: string | null;
  github_pr_url: string | null;

  // Timestamps
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  reviewed_at: string | null;

  // Audit
  created_by: string;
  reviewed_by: string | null;
}

export interface AutonomousExecutionLog {
  id: string;
  task_id: string;

  // Execution Details
  execution_step: string;
  step_status: 'started' | 'completed' | 'failed' | 'skipped';

  // Data
  input_data: Record<string, any> | null;
  output_data: Record<string, any> | null;
  error_data: Record<string, any> | null;

  // Timestamps
  timestamp: string;
  duration_ms: number | null;

  // Context
  agent_version: string | null;
  git_commit_sha: string | null;
  environment: string;
}

export interface AutonomousSystemConfig {
  id: string;

  // System Control
  enabled: boolean;
  dry_run_mode: boolean;
  autonomy_level: 1 | 2 | 3;

  // Safety Limits
  max_parallel_tasks: number;
  max_tasks_per_run: number;
  max_files_per_task: number;

  // Rate Limiting
  min_interval_minutes: number;
  max_daily_tasks: number;

  // Emergency Stop
  emergency_stop: boolean;
  emergency_stop_reason: string | null;
  emergency_stop_until: string | null;

  // Notifications
  notification_email: string;
  notify_on_completion: boolean;
  notify_on_failure: boolean;
  notify_on_high_risk: boolean;

  // Timestamps
  updated_at: string;
  updated_by: string | null;
}

export interface AutonomousSafetyCheck {
  id: string;
  task_id: string;

  // Check Details
  check_type:
    | 'build_validation'
    | 'test_validation'
    | 'rls_validation'
    | 'visual_validation'
    | 'performance_validation'
    | 'security_scan'
    | 'breaking_change_detection';
  check_status: 'pending' | 'passed' | 'failed' | 'skipped';

  // Results
  check_result: Record<string, any> | null;
  error_details: string | null;

  // Timestamps
  checked_at: string;
  duration_ms: number | null;

  // Context
  checked_by: string;
}

export interface AutonomousSystemStats {
  id: string;

  // Date
  date: string;

  // Task Counts
  tasks_created: number;
  tasks_completed: number;
  tasks_failed: number;
  tasks_rolled_back: number;

  // Performance
  avg_completion_time_minutes: number | null;
  total_files_modified: number;
  total_lines_changed: number;

  // Safety
  safety_checks_run: number;
  safety_checks_failed: number;
  emergency_stops_triggered: number;

  // Timestamps
  created_at: string;
}

/**
 * Database table names for type-safe queries
 */
export const AUTONOMOUS_TABLES = {
  tasks: 'autonomous_tasks',
  execution_logs: 'autonomous_execution_logs',
  system_config: 'autonomous_system_config',
  safety_checks: 'autonomous_safety_checks',
  system_stats: 'autonomous_system_stats',
} as const;

/**
 * Insert types (for .insert() operations)
 * Omit auto-generated fields like id, timestamps
 */
export type AutonomousTaskInsert = Omit<
  AutonomousTask,
  'id' | 'created_at' | 'started_at' | 'completed_at' | 'reviewed_at'
> & {
  id?: string;
  created_at?: string;
};

export type AutonomousExecutionLogInsert = Omit<
  AutonomousExecutionLog,
  'id' | 'timestamp'
> & {
  id?: string;
  timestamp?: string;
};

export type AutonomousSystemConfigInsert = Omit<
  AutonomousSystemConfig,
  'id' | 'updated_at'
> & {
  id?: string;
  updated_at?: string;
};

/**
 * Update types (for .update() operations)
 * All fields optional
 */
export type AutonomousTaskUpdate = Partial<
  Omit<AutonomousTask, 'id' | 'created_at' | 'created_by'>
>;

export type AutonomousSystemConfigUpdate = Partial<
  Omit<AutonomousSystemConfig, 'id'>
>;
