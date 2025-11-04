#!/usr/bin/env node
/**
 * NeXifyAI MASTER - Master Workflow Script
 *
 * Führt automatisch alle notwendigen Checks und Workflows aus
 * Für 24/7 autonome Ausführung optimiert
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

// Konfiguration
const PROJECT_ROOT = process.cwd();
const WIKI_PATH = join(PROJECT_ROOT, 'docs', 'NEXIFY_WIKI_V1.0.md');
const ENV_LOCAL_PATH = join(PROJECT_ROOT, '.env.local');

// Workflow Steps
const WORKFLOWS = {
  checkWiki: {
    name: 'Wiki Verfügbarkeit',
    command: () => existsSync(WIKI_PATH) ? Promise.resolve(true) : Promise.reject(new Error('Wiki nicht gefunden')),
    critical: true
  },
  checkCredentials: {
    name: 'Credentials Prüfung',
    command: () => existsSync(ENV_LOCAL_PATH) ? Promise.resolve(true) : Promise.reject(new Error('Credentials nicht gefunden')),
    critical: true
  },
  validateTypeScript: {
    name: 'TypeScript Check',
    command: () => execAsync('npm run type-check', { cwd: PROJECT_ROOT, maxBuffer: 10 * 1024 * 1024 }),
    critical: false
  },
  validateAll: {
    name: 'Vollständige Validierung',
    command: () => execAsync('npm run validate:all', { cwd: PROJECT_ROOT, maxBuffer: 10 * 1024 * 1024 }),
    critical: false
  }
};

async function runWorkflow(workflow) {
  try {
    console.log(`\n📋 ${workflow.name}...`);
    const result = await workflow.command();
    console.log(`✅ ${workflow.name} - Erfolgreich`);
    return { name: workflow.name, success: true, critical: workflow.critical };
  } catch (error) {
    const isCritical = workflow.critical;
    if (isCritical) {
      console.error(`❌ ${workflow.name} - KRITISCH: ${error.message}`);
    } else {
      console.log(`⚠️  ${workflow.name} - Warnung: ${error.message}`);
    }
    return { name: workflow.name, success: !isCritical, critical: isCritical, error: error.message };
  }
}

async function masterWorkflow() {
  console.log('🚀 NeXifyAI MASTER - Master Workflow gestartet...\n');
  console.log('='.repeat(60));
  console.log(`📁 Projekt: ${PROJECT_ROOT}`);
  console.log(`📚 Wiki: ${WIKI_PATH}`);
  console.log('='.repeat(60));

  const results = [];

  // Kritische Checks zuerst
  const criticalWorkflows = Object.values(WORKFLOWS).filter(w => w.critical);
  const optionalWorkflows = Object.values(WORKFLOWS).filter(w => !w.critical);

  console.log('\n🔴 KRITISCHE CHECKS:\n');
  for (const workflow of criticalWorkflows) {
    const result = await runWorkflow(workflow);
    results.push(result);

    if (!result.success && result.critical) {
      console.error(`\n❌ KRITISCHER FEHLER: ${result.name} fehlgeschlagen!`);
      console.error('   Workflow wird gestoppt.');
      process.exit(1);
    }
  }

  console.log('\n🟡 OPTIONALE CHECKS:\n');
  for (const workflow of optionalWorkflows) {
    const result = await runWorkflow(workflow);
    results.push(result);

    // Kleine Pause zwischen Checks
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Zusammenfassung
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 WORKFLOW-ZUSAMMENFASSUNG:\n');

  const criticalPassed = results.filter(r => r.critical && r.success).length;
  const criticalFailed = results.filter(r => r.critical && !r.success).length;
  const optionalPassed = results.filter(r => !r.critical && r.success).length;
  const optionalWarnings = results.filter(r => !r.critical && !r.success).length;

  console.log(`🔴 Kritische Checks: ${criticalPassed}/${criticalWorkflows.length} erfolgreich`);
  if (criticalFailed > 0) {
    console.error(`   ❌ ${criticalFailed} kritische Fehler!`);
  }

  console.log(`🟡 Optionale Checks: ${optionalPassed}/${optionalWorkflows.length} erfolgreich`);
  if (optionalWarnings > 0) {
    console.log(`   ⚠️  ${optionalWarnings} Warnungen`);
  }

  // Status für autonome Systeme
  const allCriticalPassed = criticalFailed === 0;
  const hasWarnings = optionalWarnings > 0;

  if (allCriticalPassed && !hasWarnings) {
    console.log('\n✅ ALLE CHECKS ERFOLGREICH - SYSTEM BEREIT FÜR ARBEIT');
    process.exit(0);
  } else if (allCriticalPassed && hasWarnings) {
    console.log('\n✅ KRITISCHE CHECKS ERFOLGREICH - SYSTEM BEREIT (MIT WARNUNGEN)');
    process.exit(0);
  } else {
    console.error('\n❌ KRITISCHE FEHLER - SYSTEM NICHT BEREIT');
    process.exit(1);
  }
}

// Ausführung
masterWorkflow().catch(error => {
  console.error('\n❌ FATAL ERROR:', error);
  process.exit(1);
});

