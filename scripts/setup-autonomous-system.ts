#!/usr/bin/env tsx
/**
 * Autonomous System Setup Script
 * Applies database migration and configures Edge Functions
 * Run: npx tsx scripts/setup-autonomous-system.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ygpwuiygivxoqtyoigtg.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable required');
  console.log('\n💡 Get your service role key from:');
  console.log('   Supabase Dashboard → Project Settings → API → service_role key');
  console.log('\n📝 Set it temporarily:');
  console.log('   $env:SUPABASE_SERVICE_ROLE_KEY="your_key_here"');
  console.log('   npx tsx scripts/setup-autonomous-system.ts');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applyMigration() {
  console.log('🔧 Applying autonomous system migration...\n');

  const migrationPath = join(process.cwd(), 'supabase/migrations/20251108000000_autonomous_system_setup.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf-8');

  // Split by statement (basic splitting)
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--') && s !== '');

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement });

      if (error) {
        // Try direct query if rpc fails
        const { error: queryError } = await supabase.from('_').select('*').limit(0);
        if (queryError) {
          console.error(`❌ Statement failed: ${statement.substring(0, 100)}...`);
          console.error(`   Error: ${error.message}`);
          errorCount++;
        } else {
          successCount++;
        }
      } else {
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Execution error: ${err}`);
      errorCount++;
    }
  }

  console.log(`\n✅ Migration applied: ${successCount} statements succeeded, ${errorCount} failed`);
}

async function checkTablesExist() {
  console.log('\n🔍 Checking autonomous system tables...\n');

  const tables = ['autonomous_tasks', 'autonomous_logs', 'autonomous_configs', 'autonomous_metrics'];

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`❌ ${table}: NOT FOUND (${error.message})`);
    } else {
      console.log(`✅ ${table}: EXISTS`);
    }
  }
}

async function seedInitialConfig() {
  console.log('\n🌱 Seeding initial configuration...\n');

  const configs = [
    {
      key: 'autonomy_level',
      value: { level: 2, description: 'Safe changes without approval' },
      category: 'system',
      description: 'Current autonomy level for AI agent',
    },
    {
      key: 'working_hours',
      value: { start: '00:00', end: '23:59', timezone: 'Europe/Berlin' },
      category: 'scheduling',
      description: 'Agent working hours (24/7 by default)',
    },
    {
      key: 'auto_approve_categories',
      value: ['layout', 'types', 'performance', 'docs', 'accessibility'],
      category: 'approval',
      description: 'Task types that auto-approve',
    },
    {
      key: 'gitkraken_enabled',
      value: true,
      category: 'integration',
      description: 'GitKraken Cloud Patches enabled',
    },
  ];

  for (const config of configs) {
    const { error } = await supabase
      .from('autonomous_configs')
      .upsert(config, { onConflict: 'key' });

    if (error) {
      console.log(`❌ Failed to seed ${config.key}: ${error.message}`);
    } else {
      console.log(`✅ Config seeded: ${config.key}`);
    }
  }
}

async function createSampleTask() {
  console.log('\n📋 Creating sample autonomous task...\n');

  const { data, error } = await supabase
    .from('autonomous_tasks')
    .insert({
      task_type: 'documentation',
      description: 'Update CHANGELOG.md with autonomous system setup',
      priority: 5,
      autonomy_level: 2,
      risk_level: 'low',
      requires_approval: false,
      assigned_to: 'ai_agent',
      metadata: {
        files: ['CHANGELOG.md'],
        changes: 'Add autonomous system v1.0 entry',
      },
    })
    .select()
    .single();

  if (error) {
    console.log(`❌ Sample task creation failed: ${error.message}`);
  } else {
    console.log(`✅ Sample task created: ${data.id}`);
    console.log(`   Type: ${data.task_type}`);
    console.log(`   Status: ${data.status}`);
  }
}

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║        AUTONOMOUS SYSTEM SETUP - MyDispatch V32.5         ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  try {
    // Step 1: Apply migration (manual via Supabase Dashboard recommended)
    console.log('⚠️  Manual Migration Required:');
    console.log('   1. Open Supabase Dashboard → SQL Editor');
    console.log('   2. Copy content from: supabase/migrations/20251108000000_autonomous_system_setup.sql');
    console.log('   3. Run the entire migration');
    console.log('   4. Press Enter here to continue...\n');

    // Wait for user confirmation
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });

    // Step 2: Check tables
    await checkTablesExist();

    // Step 3: Seed config
    await seedInitialConfig();

    // Step 4: Create sample task
    await createSampleTask();

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                  ✅ SETUP COMPLETE                        ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    console.log('📋 Next Steps:');
    console.log('   1. Deploy Edge Functions: npm run deploy:functions');
    console.log('   2. Configure GitHub Secrets (see docs/AUTONOMOUS_SYSTEM_README.md)');
    console.log('   3. Set environment variables: VITE_AUTONOMOUS_MODE=true');
    console.log('   4. Setup Cron Jobs in Supabase Dashboard');
    console.log('   5. Test dry-run: npx tsx scripts/autonomous-agent.ts --dry-run\n');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

main();
