#!/usr/bin/env node
/**
 * NeXifyAI MASTER - Auto-Init Script
 *
 * Wird automatisch bei jedem Chat-Start ausgeführt
 * Lädt alle notwendigen Kontexte und prüft System-Status
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const PROJECT_ROOT = process.cwd();
const WIKI_PATH = join(PROJECT_ROOT, 'docs', 'NEXIFY_WIKI_V1.0.md');
const ENV_LOCAL_PATH = join(PROJECT_ROOT, '.env.local');
const PACKAGE_JSON_PATH = join(PROJECT_ROOT, 'package.json');

async function autoInit() {
  console.log('🚀 NeXifyAI MASTER - Auto-Init gestartet...\n');

  // Prüfe kritische Dateien
  const checks = {
    wiki: existsSync(WIKI_PATH),
    credentials: existsSync(ENV_LOCAL_PATH),
    packageJson: existsSync(PACKAGE_JSON_PATH)
  };

  console.log('📋 System-Checks:');
  console.log(`  ${checks.wiki ? '✅' : '❌'} Wiki verfügbar: ${WIKI_PATH}`);
  console.log(`  ${checks.credentials ? '✅' : '❌'} Credentials verfügbar: ${ENV_LOCAL_PATH}`);
  console.log(`  ${checks.packageJson ? '✅' : '❌'} Package.json verfügbar: ${PACKAGE_JSON_PATH}`);

  // Lade Credentials für Supabase-Verbindung
  if (checks.credentials) {
    try {
      const envContent = readFileSync(ENV_LOCAL_PATH, 'utf8');
      const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1] ||
                         envContent.match(/SUPABASE_URL=(.+)/)?.[1];

      if (supabaseUrl) {
        console.log(`\n📡 Supabase URL gefunden: ${supabaseUrl}`);
        console.log('✅ Supabase-Verbindung bereit');
      }
    } catch (error) {
      console.log(`\n⚠️  Credentials-Laden fehlgeschlagen: ${error.message}`);
    }
  }

  // Lade Package.json für verfügbare Scripts
  if (checks.packageJson) {
    try {
      const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf8'));
      const scripts = Object.keys(packageJson.scripts || {});

      console.log(`\n📚 Verfügbare npm Scripts: ${scripts.length}`);
      console.log('   Wichtigste Scripts:');
      if (scripts.includes('master:workflow')) console.log('   ✅ master:workflow');
      if (scripts.includes('validate:all')) console.log('   ✅ validate:all');
      if (scripts.includes('check:rls')) console.log('   ✅ check:rls');
      if (scripts.includes('git:push:safe')) console.log('   ✅ git:push:safe');
    } catch (error) {
      console.log(`\n⚠️  Package.json-Laden fehlgeschlagen: ${error.message}`);
    }
  }

  // Status
  const allCritical = checks.wiki && checks.credentials && checks.packageJson;

  if (allCritical) {
    console.log('\n✅ SYSTEM BEREIT FÜR AUTONOME AUSFÜHRUNG');
    console.log('   Alle kritischen Komponenten verfügbar');
    process.exit(0);
  } else {
    console.error('\n❌ SYSTEM NICHT VOLLSTÄNDIG BEREIT');
    console.error('   Einige kritische Komponenten fehlen');
    process.exit(1);
  }
}

autoInit();

