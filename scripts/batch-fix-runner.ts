#!/usr/bin/env tsx
/* ==================================================================================
   BATCH FIX RUNNER V18.5.0
   ==================================================================================
   Automatische Batch-Fixes für alle auto-fixable Errors
   Sicher, testbar, mit Rollback-Mechanismus
   ================================================================================== */

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';

type ReplacementFunction = (match: string, ...args: string[]) => string;

interface BatchFix {
  name: string;
  category: string;
  pattern: RegExp;
  replacement: string | ReplacementFunction;
  files: string[];
  verify?: (content: string) => boolean;
  priority: number;
}

interface FixResult {
  success: boolean;
  filesModified: string[];
  errors: string[];
}

interface BatchConfig {
  category: string;
  pattern: RegExp | string;
  replacement: string | ((match: string) => string);
}

const BACKUP_DIR = '.lovable/backups';

// Ensure backup directory exists
if (!existsSync(BACKUP_DIR)) {
  mkdirSync(BACKUP_DIR, { recursive: true });
}

async function runBatchFix(config: BatchConfig): Promise<FixResult> {
  console.log(`\n${'━'.repeat(70)}`);
  console.log(`🔧 ${config.category}`);
  console.log(`   Category: ${config.category} | Priority: ${config.priority}`);
  console.log(`${'━'.repeat(70)}`);

  const files = await glob(config.files, {
    ignore: ['**/node_modules/**', '**/dist/**', '**/.lovable/**']
  });

  let fixedCount = 0;
  let filesChanged = 0;
  const errors: string[] = [];

  for (const file of files) {
    try {
      let content = readFileSync(file, 'utf-8');
      const originalContent = content;

      // Apply fix
      content = content.replace(config.pattern as RegExp, config.replacement as string);

      // Skip if no change
      if (content === originalContent) continue;

      // Verify if specified
      if (config.verify && !config.verify(content)) {
        errors.push(`Verification failed for ${file}`);
        continue;
      }

      // Count fixes
      const matches = originalContent.match(config.pattern as RegExp);
      const count = matches?.length || 0;
      fixedCount += count;

      if (!dryRun) {
        // Backup original
        const backupPath = join(BACKUP_DIR, file.replace(/\//g, '_'));
        copyFileSync(file, backupPath);

        // Save fixed file
        writeFileSync(file, content, 'utf-8');
        filesChanged++;

        console.log(`  ✅ ${file}: ${count} fixes applied`);
      } else {
        console.log(`  🔍 ${file}: ${count} fixes would be applied (dry-run)`);
        filesChanged++;
      }
    } catch (error) {
      const msg = `Error processing ${file}: ${error}`;
      errors.push(msg);
      console.error(`  ❌ ${msg}`);
    }
  }

  return { success: true, filesModified: files, errors };
}

// ============================================================================
// BATCH DEFINITIONS
// ============================================================================

const DESIGN_SYSTEM_BATCHES: BatchFix[] = [
  {
    name: 'Remove accent color (CRITICAL)',
    category: 'design-system',
    priority: 100,
    pattern: /\baccent\b(?![-\w])/g,
    replacement: 'primary',
    files: ['src/**/*.tsx', 'src/**/*.ts', 'src/**/*.css'],
    verify: (content) => !content.match(/\baccent\b(?![-\w])/)
  },
  {
    name: 'Replace text-white with text-foreground',
    category: 'design-system',
    priority: 90,
    pattern: /(?<!\/\/.*)\btext-white\b(?!\s*\/[*/])/g,
    replacement: 'text-foreground',
    files: ['src/**/*.tsx'],
  },
  {
    name: 'Replace bg-white with bg-background',
    category: 'design-system',
    priority: 90,
    pattern: /(?<!\/\/.*)\bbg-white\b(?!\s*\/[*/])/g,
    replacement: 'bg-background',
    files: ['src/**/*.tsx'],
  },
  {
    name: 'Replace text-black with text-foreground',
    category: 'design-system',
    priority: 90,
    pattern: /(?<!\/\/.*)\btext-black\b(?!\s*\/[*/])/g,
    replacement: 'text-foreground',
    files: ['src/**/*.tsx'],
  },
  {
    name: 'Replace bg-black with bg-background',
    category: 'design-system',
    priority: 90,
    pattern: /(?<!\/\/.*)\bbg-black\b(?!\s*\/[*/])/g,
    replacement: 'bg-background',
    files: ['src/**/*.tsx'],
  },
];

const MOBILE_FIRST_BATCHES: BatchFix[] = [
  {
    name: 'Add min-height to buttons (Touch Target)',
    category: 'mobile-first',
    priority: 80,
    pattern: /<Button([^>]*?)(?!.*min-h-)(.*?)>/g,
    replacement: (match, before, after) => {
      if (before.includes('className="')) {
        return match.replace('className="', 'className="min-h-[44px] ');
      }
      return `<Button${before} className="min-h-[44px]"${after}>`;
    },
    files: ['src/**/*.tsx'],
  },
];

const PERFORMANCE_BATCHES: BatchFix[] = [
  {
    name: 'Add lazy loading to images',
    category: 'performance',
    priority: 70,
    pattern: /<img([^>]*?)(?!.*loading=)(.*?)>/g,
    replacement: '<img$1 loading="lazy"$2>',
    files: ['src/**/*.tsx'],
  },
];

const CODE_QUALITY_BATCHES: BatchFix[] = [
  {
    name: 'Replace inline toLocaleString with formatCurrency',
    category: 'code-quality',
    priority: 60,
    pattern: /(\w+)\.toLocaleString\(['"]de-DE['"],\s*\{[^}]*currency[^}]*\}\)/g,
    replacement: 'formatCurrency($1)',
    files: ['src/**/*.tsx', 'src/**/*.ts'],
  },
];

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run') || args.includes('-d');
  const category = args.find(arg => !arg.startsWith('-'));

  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║             BATCH FIX RUNNER V18.5.0                        ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }

  // Collect all batches
  const allBatches = [
    ...DESIGN_SYSTEM_BATCHES,
    ...MOBILE_FIRST_BATCHES,
    ...PERFORMANCE_BATCHES,
    ...CODE_QUALITY_BATCHES,
  ].sort((a, b) => b.priority - a.priority);

  // Filter by category if specified
  const batchesToRun = category
    ? allBatches.filter(b => b.category === category)
    : allBatches;

  if (batchesToRun.length === 0) {
    console.log('❌ No batches found for category:', category);
    console.log('\nAvailable categories:');
    const categories = [...new Set(allBatches.map(b => b.category))];
    categories.forEach(cat => console.log(`  • ${cat}`));
    process.exit(1);
  }

  console.log(`Running ${batchesToRun.length} batch fixes...\n`);

  let totalFixed = 0;
  let totalFilesChanged = 0;
  const allErrors: string[] = [];

  for (const batch of batchesToRun) {
    const result = await runBatchFix(batch, dryRun);
    totalFixed += result.fixedCount;
    totalFilesChanged += result.filesChanged;
    allErrors.push(...result.errors);
  }

  console.log('\n' + '═'.repeat(70));
  console.log('                         SUMMARY                              ');
  console.log('═'.repeat(70));
  console.log(`✅ Total fixes applied: ${totalFixed}`);
  console.log(`📁 Files changed: ${totalFilesChanged}`);
  console.log(`❌ Errors encountered: ${allErrors.length}`);

  if (allErrors.length > 0) {
    console.log('\n⚠️  Errors:');
    allErrors.forEach(err => console.log(`  • ${err}`));
  }

  if (dryRun) {
    console.log('\n💡 Run without --dry-run to apply fixes');
  } else {
    console.log(`\n💾 Backups saved to: ${BACKUP_DIR}`);
  }

  console.log('\n🎉 Batch fixing complete!\n');
}

main().catch(error => {
  console.error('\n❌ Batch fix failed:', error);
  process.exit(1);
});
