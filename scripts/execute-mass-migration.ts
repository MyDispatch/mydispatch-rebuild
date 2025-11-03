#!/usr/bin/env tsx
/* ==================================================================================
   MASS MIGRATION EXECUTOR V1.0 - AUTONOMOUS UI MIGRATION
   ==================================================================================
   Automatische Migration: shadcn/ui → V28 Design System
   - Liest alle TSX/TS Files
   - Ruft auto-migrate-ui-imports Edge Function auf
   - Schreibt migrierte Files zurück
   - Erstellt Migration Report
   ================================================================================== */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Priority Files (User-Facing Pages)
const PRIORITY_PATTERNS = [
  'src/pages/Auftraege.tsx',
  'src/pages/Fahrer.tsx',
  'src/pages/Kunden.tsx',
  'src/pages/Partner.tsx',
  'src/pages/Fahrzeuge.tsx',
  'src/pages/Disposition.tsx',
  'src/pages/Dashboard.tsx',
  'src/pages/Einstellungen.tsx',
  'src/pages/Master.tsx',
];

interface MigrationResult {
  success: boolean;
  filePath: string;
  changes: number;
  appliedMigrations: string[];
  error?: string;
}

async function migrateFile(filePath: string): Promise<MigrationResult> {
  console.log(`🔄 Migrating: ${filePath}`);
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Check if file already uses V28 components
    if (fileContent.includes('from "@/lib/components/V28')) {
      console.log(`⏭️  Skipped ${filePath}: Already using V28 components`);
      return {
        success: true,
        filePath,
        changes: 0,
        appliedMigrations: ['Already migrated'],
      };
    }

    const { data, error } = await supabase.functions.invoke('auto-migrate-ui-imports', {
      body: { fileContent, filePath }
    });

    if (error) {
      console.error(`❌ Error migrating ${filePath}:`, error);
      return {
        success: false,
        filePath,
        changes: 0,
        appliedMigrations: [],
        error: error.message,
      };
    }

    if (data.success && data.changesCount > 0) {
      // Backup original file
      const backupPath = `${filePath}.backup`;
      fs.copyFileSync(filePath, backupPath);
      
      // Write migrated code
      fs.writeFileSync(filePath, data.migratedCode, 'utf-8');
      
      console.log(`✅ Migrated ${filePath}: ${data.changesCount} changes`);
      console.log(`   Applied: ${data.appliedMigrations.join(', ')}`);
      
      return {
        success: true,
        filePath,
        changes: data.changesCount,
        appliedMigrations: data.appliedMigrations,
      };
    } else {
      console.log(`⏭️  Skipped ${filePath}: No changes needed`);
      return {
        success: true,
        filePath,
        changes: 0,
        appliedMigrations: [],
      };
    }
  } catch (error: any) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return {
      success: false,
      filePath,
      changes: 0,
      appliedMigrations: [],
      error: error.message,
    };
  }
}

async function executeMassMigration() {
  console.log('🚀 SOL INVICTUS V21.0 - MASS MIGRATION EXECUTOR');
  console.log('=' .repeat(60));
  console.log(`📊 Migrating: shadcn/ui → V28 Design System\n`);

  // Collect all files to migrate
  const filesToMigrate: string[] = [];
  
  // Add priority files
  for (const pattern of PRIORITY_PATTERNS) {
    if (fs.existsSync(pattern)) {
      filesToMigrate.push(pattern);
    }
  }

  // Add all other pages
  const allPages = glob.sync('src/pages/**/*.tsx');
  for (const page of allPages) {
    if (!filesToMigrate.includes(page)) {
      filesToMigrate.push(page);
    }
  }

  console.log(`📦 Total files to migrate: ${filesToMigrate.length}\n`);

  const results: MigrationResult[] = [];
  let progressCount = 0;

  for (const file of filesToMigrate) {
    progressCount++;
    console.log(`\n[${progressCount}/${filesToMigrate.length}] Processing ${file}...`);
    
    const result = await migrateFile(file);
    results.push(result);
    
    // Rate limiting: 500ms delay between calls
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Generate Summary Report
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRATION SUMMARY REPORT');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const totalChanges = results.reduce((sum, r) => sum + r.changes, 0);
  const filesWithChanges = results.filter(r => r.changes > 0).length;

  console.log(`✅ Successful: ${successful}/${filesToMigrate.length}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📝 Files Modified: ${filesWithChanges}`);
  console.log(`🔄 Total Changes: ${totalChanges}`);

  // Detailed Results
  console.log('\n📋 DETAILED RESULTS:');
  console.log('-'.repeat(60));
  
  results.forEach(r => {
    if (r.changes > 0) {
      console.log(`✅ ${r.filePath}: ${r.changes} changes`);
      console.log(`   → ${r.appliedMigrations.join(', ')}`);
    }
  });

  if (failed > 0) {
    console.log('\n⚠️  FAILED MIGRATIONS:');
    console.log('-'.repeat(60));
    results.filter(r => !r.success).forEach(r => {
      console.log(`❌ ${r.filePath}: ${r.error}`);
    });
  }

  // Save report to file
  const reportPath = 'docs/MIGRATION_REPORT_V21.0.md';
  const reportContent = generateMarkdownReport(results, {
    total: filesToMigrate.length,
    successful,
    failed,
    filesWithChanges,
    totalChanges,
  });

  fs.writeFileSync(reportPath, reportContent, 'utf-8');
  console.log(`\n📄 Report saved to: ${reportPath}`);

  console.log('\n🎉 Mass Migration completed!');
  console.log('='.repeat(60));

  // Exit code
  process.exit(failed > 0 ? 1 : 0);
}

function generateMarkdownReport(
  results: MigrationResult[],
  stats: {
    total: number;
    successful: number;
    failed: number;
    filesWithChanges: number;
    totalChanges: number;
  }
): string {
  const timestamp = new Date().toISOString();
  
  return `# MIGRATION REPORT V21.0 - SOL INVICTUS

**Datum:** ${timestamp}
**Executor:** Mass Migration Script
**Ziel:** shadcn/ui → V28 Design System

---

## 📊 EXECUTIVE SUMMARY

| Metrik | Wert |
|--------|------|
| Total Files | ${stats.total} |
| ✅ Successful | ${stats.successful} |
| ❌ Failed | ${stats.failed} |
| 📝 Files Modified | ${stats.filesWithChanges} |
| 🔄 Total Changes | ${stats.totalChanges} |

**Success Rate:** ${((stats.successful / stats.total) * 100).toFixed(1)}%

---

## ✅ MIGRATED FILES (${stats.filesWithChanges})

${results
  .filter(r => r.changes > 0)
  .map(r => `### ${r.filePath}\n- **Changes:** ${r.changes}\n- **Migrations:** ${r.appliedMigrations.join(', ')}\n`)
  .join('\n')}

---

## ⏭️ SKIPPED FILES (Already Migrated)

${results
  .filter(r => r.success && r.changes === 0)
  .map(r => `- ${r.filePath}`)
  .join('\n')}

---

${stats.failed > 0 ? `## ❌ FAILED MIGRATIONS

${results
  .filter(r => !r.success)
  .map(r => `### ${r.filePath}\n**Error:** ${r.error}\n`)
  .join('\n')}

---` : ''}

## 🎯 NEXT STEPS

1. ✅ Review migrated files in Git diff
2. ✅ Run unit tests: \`npm run test\`
3. ✅ Run Storybook: \`npm run storybook\`
4. ✅ Test critical flows manually
5. ✅ Commit changes: \`git commit -m "feat: V28 Design System Migration"\`

---

**Generated by:** SOL INVICTUS V21.0
**Mission:** STRANGLER FIG 2.0 - Phase 3
`;
}

// Execute
executeMassMigration().catch(console.error);
