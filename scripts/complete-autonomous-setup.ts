#!/usr/bin/env tsx
/**
 * COMPLETE AUTONOMOUS SYSTEM SETUP
 * Applies full migration and activates system
 * Run: npx tsx scripts/complete-autonomous-setup.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('\n❌ Missing Supabase configuration:');
  console.error('   - Required: SUPABASE_URL (or VITE_SUPABASE_URL)');
  console.error('   - Required: SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Set these in your environment or .env.local before running this script.');
  process.exit(1);
}

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║     AUTONOMOUS SYSTEM - COMPLETE SETUP & ACTIVATION       ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

async function executeSQL(sql: string, description: string) {
  console.log(`\n📝 ${description}...`);

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ query: sql })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SQL execution failed: ${error}`);
  }

  console.log(`✅ ${description} - Done!`);
}

async function main() {
  try {
    // Step 1: Read migration file
    console.log('📖 Reading migration file...');
    const migrationPath = join(process.cwd(), 'supabase/migrations/20251108000000_autonomous_system_setup.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    console.log(`✅ Loaded migration (${migrationSQL.length} characters)\n`);

    // Step 2: Execute via Supabase REST API
    console.log('🚀 Applying migration via REST API...');
    console.log('   (This may take 30-60 seconds...)\n');

    await executeSQL(migrationSQL, 'Database Migration');

    // Step 3: Activate system
    console.log('\n⚙️  Activating autonomous system...');

    const activationSQL = `
      UPDATE autonomous_system_config
      SET
        enabled = true,
        dry_run_mode = true,
        autonomy_level = 2,
        max_parallel_tasks = 3,
        notification_email = 'courbois1981@gmail.com',
        notify_on_completion = true,
        updated_at = NOW()
      WHERE id = (SELECT id FROM autonomous_system_config LIMIT 1);

      INSERT INTO autonomous_tasks (task_type, description, priority, autonomy_level, risk_level, requires_approval, files_affected)
      VALUES
        ('documentation', 'Update CHANGELOG.md with autonomous system v1.0', 5, 2, 'low', false, ARRAY['CHANGELOG.md']),
        ('layout_fix', 'Fix spacing inconsistencies in Dashboard components', 6, 2, 'low', false, ARRAY['src/pages/Dashboard.tsx']),
        ('type_improvement', 'Replace any types with proper TypeScript types', 7, 2, 'low', false, ARRAY['src/hooks/use-bookings.ts']);
    `;

    await executeSQL(activationSQL, 'System Activation & Sample Tasks');

    // Success!
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║              ✅ SETUP COMPLETE & ACTIVATED!               ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('📊 System Status:');
    console.log('   - 4 Tables created (autonomous_tasks, logs, config, safety_checks)');
    console.log('   - 3 Functions created (get_config, create_task, emergency_stop)');
    console.log('   - System ENABLED in DRY-RUN mode');
    console.log('   - 3 Sample tasks created\n');

    console.log('🎯 What happens next:');
    console.log('   1. ai-agent-poll Edge Function runs every 5 minutes');
    console.log('   2. Processes tasks in DRY-RUN mode (no actual changes)');
    console.log('   3. Logs results in autonomous_execution_logs\n');

  console.log('📊 Monitor:');
  const projectRef = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '').split('.')[0];
  console.log(`   https://supabase.com/dashboard/project/${projectRef}/editor\n`);

    console.log('🔍 Verify:');
    console.log('   SELECT * FROM autonomous_system_config;');
    console.log('   SELECT * FROM autonomous_tasks WHERE status = \'pending\';\n');

    console.log('🛑 Emergency Stop:');
    console.log('   SELECT emergency_stop_autonomous_system(\'Manual stop\', 24);\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    console.error('\nAlternative: Apply migration manually in Supabase SQL Editor');
    console.error('File: supabase/migrations/20251108000000_autonomous_system_setup.sql\n');
    process.exit(1);
  }
}

main();
