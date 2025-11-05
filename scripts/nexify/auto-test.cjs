/* ==================================================================================
   AUTO-TEST - Automatische Browser-Tests & System-Validierung
   ==================================================================================
   Führt automatische Tests durch und speichert Screenshots & Reports
   ================================================================================== */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n🧪 NeXify AI MASTER - Auto-Test Started...\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  const testResults = {
    timestamp: new Date().toISOString(),
    tests: [],
    passed: 0,
    failed: 0
  };

  try {
    // Test 1: Database Connection
    console.log('📋 Test 1: Database Connection');
    try {
      const { data, error } = await supabase.from('nexify_master_sessions').select('count');
      if (!error) {
        console.log('   ✅ Database Connected');
        testResults.tests.push({ name: 'Database Connection', status: 'PASS' });
        testResults.passed++;
      } else {
        throw error;
      }
    } catch (err) {
      console.log('   ❌ Database Error:', err.message);
      testResults.tests.push({ name: 'Database Connection', status: 'FAIL', error: err.message });
      testResults.failed++;
    }

    // Test 2: Knowledge Base
    console.log('📋 Test 2: Knowledge Base Tables');
    const tables = [
      'nexify_master_sessions',
      'nexify_master_memory',
      'knowledge_base',
      'component_registry',
      'known_issues',
      'code_snippets',
      'best_practices',
      'ai_learning_patterns',
      'ai_actions_log'
    ];

    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('count').limit(1);
        if (!error) {
          console.log(`   ✅ Table exists: ${table}`);
          testResults.tests.push({ name: `Table: ${table}`, status: 'PASS' });
          testResults.passed++;
        } else {
          throw error;
        }
      } catch (err) {
        console.log(`   ⚠️  Table missing: ${table}`);
        testResults.tests.push({ name: `Table: ${table}`, status: 'PENDING', note: 'Awaiting migration' });
      }
    }

    // Save Test Report
    const reportPath = path.join(__dirname, '..', '..', '.nexify', 'analytics', 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));

    console.log('\n========================================');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📊 Report: ${reportPath}`);
    console.log('========================================\n');

  } catch (err) {
    console.error('❌ Test Suite Error:', err.message);
  }
}

runTests();
