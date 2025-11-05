/* ==================================================================================
   HEALTH-CHECK - System-Gesundheits-Überwachung
   ==================================================================================
   Prüft System-Status und speichert Logs
   ================================================================================== */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n💊 NeXify AI MASTER - Health Check Started...\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHealth() {
  const healthStatus = {
    timestamp: new Date().toISOString(),
    status: 'HEALTHY',
    checks: {
      database: 'PENDING',
      knowledge_base: 'PENDING',
      storage: 'PENDING'
    },
    warnings: [],
    errors: []
  };

  try {
    // Check 1: Database Connection
    console.log('📋 Checking Database Connection...');
    try {
      const { data, error } = await supabase.from('nexify_master_sessions').select('count').limit(1);
      if (!error) {
        console.log('   ✅ Database: HEALTHY');
        healthStatus.checks.database = 'HEALTHY';
      } else {
        throw error;
      }
    } catch (err) {
      console.log('   ⚠️  Database: UNHEALTHY');
      healthStatus.checks.database = 'UNHEALTHY';
      healthStatus.warnings.push('Database not accessible - Migrations needed');
    }

    // Check 2: Knowledge Base
    console.log('📋 Checking Knowledge Base...');
    try {
      const { data, error } = await supabase.from('knowledge_base').select('count').limit(1);
      if (!error) {
        console.log('   ✅ Knowledge Base: HEALTHY');
        healthStatus.checks.knowledge_base = 'HEALTHY';
      } else {
        throw error;
      }
    } catch (err) {
      console.log('   ⚠️  Knowledge Base: PENDING');
      healthStatus.checks.knowledge_base = 'PENDING';
      healthStatus.warnings.push('Knowledge Base not ready - Migrations needed');
    }

    // Determine Overall Status
    if (healthStatus.warnings.length > 0) {
      healthStatus.status = 'PENDING_MIGRATIONS';
    }
    if (healthStatus.errors.length > 0) {
      healthStatus.status = 'UNHEALTHY';
    }

    // Save Health Report
    const reportPath = path.join(__dirname, '..', '..', '.nexify', 'logs', 'health-check.json');
    fs.writeFileSync(reportPath, JSON.stringify(healthStatus, null, 2));

    console.log('\n========================================');
    console.log(`💊 Overall Status: ${healthStatus.status}`);
    console.log(`⚠️  Warnings: ${healthStatus.warnings.length}`);
    console.log(`❌ Errors: ${healthStatus.errors.length}`);
    console.log(`📊 Report: ${reportPath}`);
    console.log('========================================\n');

    return healthStatus;
  } catch (err) {
    console.error('❌ Health Check Error:', err.message);
    process.exit(1);
  }
}

checkHealth();
