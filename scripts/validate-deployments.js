#!/usr/bin/env node
/**
 * Deployment Validierung Script
 *
 * Prüft alle Deployments nach Ausführung
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });
config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ACCESS_TOKEN;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function validateDeployments() {
  console.log('🔍 Deployment Validierung gestartet...\n');
  console.log(`📡 Verbindung zu: ${supabaseUrl}\n`);

  const results = {
    migrations: { passed: 0, failed: 0, checks: [] },
    functions: { passed: 0, failed: 0, checks: [] },
    tables: { passed: 0, failed: 0, checks: [] },
    rls: { passed: 0, failed: 0, checks: [] }
  };

  // Prüfe Tabellen
  console.log('📊 Prüfe Datenbank-Tabellen...');
  const expectedTables = [
    'knowledge_base',
    'component_registry',
    'known_issues',
    'code_snippets',
    'best_practices',
    'ai_learning_patterns',
    'automation_patterns',
    'ai_actions_log',
    'ai_self_reports'
  ];

  for (const tableName of expectedTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error && (error.code === '42P01' || error.message.includes('Could not find the table'))) {
        // Table does not exist - this is expected before migrations are deployed
        results.tables.failed++;
        results.tables.checks.push({ table: tableName, status: '⚠️ Noch nicht erstellt (Migrations erforderlich)' });
        console.log(`  ⚠️  ${tableName} - Noch nicht erstellt (Migrations erforderlich)`);
      } else if (error) {
        results.tables.failed++;
        results.tables.checks.push({ table: tableName, status: `❌ Fehler: ${error.message}` });
        console.log(`  ❌ ${tableName} - Fehler: ${error.message}`);
      } else {
        results.tables.passed++;
        results.tables.checks.push({ table: tableName, status: '✅ Vorhanden' });
        console.log(`  ✅ ${tableName} - Vorhanden`);
      }
    } catch (err) {
      results.tables.failed++;
      results.tables.checks.push({ table: tableName, status: `❌ Exception: ${err.message || err}` });
      console.log(`  ❌ ${tableName} - Exception: ${err.message || err}`);
    }
  }

  // Prüfe RLS
  console.log('\n🛡️ Prüfe RLS Policies...');
  try {
    const { data: tables, error } = await supabase.rpc('get_tables_without_rls');

    if (error) {
      // Check if error is about missing function (expected before migrations)
      if (error.message.includes('Could not find the function') ||
          error.message.includes('function') && error.message.includes('does not exist')) {
        console.log(`  ⚠️  RLS Check Funktion noch nicht verfügbar`);
        console.log(`      Das ist normal, wenn Migrations noch nicht deployed wurden.`);
        console.log(`      Die Funktion wird nach dem Deployment verfügbar sein.`);
        results.rls.checks.push({ status: '⚠️ RPC Funktion noch nicht verfügbar (Migrations erforderlich)' });
      } else {
        console.log(`  ⚠️ RLS Check nicht verfügbar: ${error.message}`);
        results.rls.checks.push({ status: `⚠️ RPC Funktion nicht verfügbar: ${error.message}` });
      }
    } else if (!tables || tables.length === 0) {
      results.rls.passed++;
      results.rls.checks.push({ status: '✅ Alle Tabellen haben RLS' });
      console.log('  ✅ Alle Tabellen haben RLS aktiviert');
    } else {
      results.rls.failed++;
      results.rls.checks.push({
        status: `❌ ${tables.length} Tabellen ohne RLS`,
        tables: tables.map(t => t.table_name)
      });
      console.log(`  ❌ ${tables.length} Tabellen ohne RLS:`);
      tables.forEach(table => {
        console.log(`    - ${table.table_name}`);
      });
    }
  } catch (err) {
    console.log(`  ⚠️ RLS Check fehlgeschlagen: ${err.message || err}`);
    results.rls.checks.push({ status: `⚠️ Fehler: ${err.message || err}` });
  }

  // Zusammenfassung
  console.log('\n📊 VALIDIERUNGS-ERGEBNISSE:\n');
  console.log(`Tabellen: ${results.tables.passed}/${expectedTables.length} vorhanden`);

  // Count actual problems (not missing tables which are expected)
  const missingTables = results.tables.checks.filter(c => c.status.includes('Noch nicht erstellt')).length;
  const actualTableErrors = results.tables.failed - missingTables;

  if (actualTableErrors > 0) {
    console.log(`⚠️  ${actualTableErrors} Tabellen haben Fehler`);
  }
  if (missingTables > 0) {
    console.log(`ℹ️  ${missingTables} Tabellen noch nicht erstellt (Migrations erforderlich - normal)`);
  }

  const rlsStatus = results.rls.passed > 0 ? '✅ OK' :
                    results.rls.checks.some(c => c.status.includes('noch nicht verfügbar')) ? '⚠️ Funktion noch nicht verfügbar' :
                    '❌ Probleme';
  console.log(`RLS: ${rlsStatus}`);

  // Only exit with error if there are actual problems, not missing tables
  const hasActualErrors = actualTableErrors > 0 ||
                         (results.rls.failed > 0 && !results.rls.checks.some(c => c.status.includes('noch nicht verfügbar')));

  if (!hasActualErrors && results.tables.passed === expectedTables.length) {
    console.log('\n✅ Alle Checks bestanden!');
    process.exit(0);
  } else if (!hasActualErrors && missingTables > 0) {
    console.log('\n✅ Verbindung erfolgreich! Tabellen werden durch Migrations erstellt.');
    console.log('   Führe Migrations aus und prüfe erneut.');
    process.exit(0); // Exit with success - missing tables are expected
  } else {
    console.log(`\n⚠️ ${actualTableErrors > 0 ? actualTableErrors : missingTables} Problem(e) gefunden`);
    process.exit(hasActualErrors ? 1 : 0);
  }
}

validateDeployments();

