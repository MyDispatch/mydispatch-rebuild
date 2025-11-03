#!/usr/bin/env tsx
/* ==================================================================================
   BRAIN-QA BATCH-FIX RUNNER V40.20
   ==================================================================================
   Nutzt das Brain QA System für systematische, automatisierte Code-Fixes
   - Scannt alle .tsx Files
   - Wendet AutoFixer.fullFix() an
   - Validiert & Dokumentiert Changes
   ================================================================================== */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { AutoFixer } from '../src/lib/brain-system/auto-fixer';

interface FixResult {
  file: string;
  changed: boolean;
  changes: {
    icons: number;
    colors: number;
    spacing: number;
    touchTargets: number;
    total: number;
  };
  error?: string;
}

class BrainQABatchRunner {
  private results: FixResult[] = [];
  private projectRoot: string;

  constructor() {
    this.projectRoot = process.cwd();
  }

  /**
   * Rekursiv alle .tsx Files finden
   */
  private findTSXFiles(dir: string, exclude: string[] = []): string[] {
    const files: string[] = [];
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      // Skip excluded directories
      if (exclude.some(ex => fullPath.includes(ex))) {
        continue;
      }

      if (stat.isDirectory()) {
        files.push(...this.findTSXFiles(fullPath, exclude));
      } else if (entry.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Zähle spezifische Changes
   */
  private countChanges(original: string, fixed: string) {
    return {
      icons: (original.match(/\bh-[356]\s+w-[356]\b/g) || []).length - 
             (fixed.match(/\bh-[356]\s+w-[356]\b/g) || []).length,
      colors: (original.match(/text-white|bg-white|text-black/g) || []).length -
              (fixed.match(/text-white|bg-white|text-black/g) || []).length,
      spacing: (original.match(/[pm]-[157]\b/g) || []).length - 
               (fixed.match(/[pm]-[157]\b/g) || []).length,
      touchTargets: (original.match(/h-(8|9|10)/g) || []).length - 
                    (fixed.match(/h-(8|9|10)/g) || []).length,
      total: original !== fixed ? 1 : 0,
    };
  }

  /**
   * Fixe einzelne Datei
   */
  private fixFile(filePath: string, dryRun: boolean): FixResult {
    try {
      const original = readFileSync(filePath, 'utf-8');
      const fixed = AutoFixer.fullFix(original);
      const changes = this.countChanges(original, fixed);

      if (!dryRun && original !== fixed) {
        writeFileSync(filePath, fixed, 'utf-8');
      }

      return {
        file: relative(this.projectRoot, filePath),
        changed: original !== fixed,
        changes,
      };
    } catch (error) {
      return {
        file: relative(this.projectRoot, filePath),
        changed: false,
        changes: { icons: 0, colors: 0, spacing: 0, touchTargets: 0, total: 0 },
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Batch-Fix für alle Files
   */
  async runBatch(options: {
    dryRun?: boolean;
    include?: string[];
    exclude?: string[];
    maxFiles?: number;
  } = {}): Promise<void> {
    const {
      dryRun = false,
      include = ['src/components', 'src/pages'],
      exclude = ['node_modules', '.git', 'dist', 'build'],
      maxFiles,
    } = options;

    console.log('🧠 Brain QA Batch-Fix Runner V40.20\n');
    console.log(`Mode: ${dryRun ? '🔍 DRY-RUN' : '✅ APPLY FIXES'}\n`);

    // Finde alle .tsx Files
    const allFiles: string[] = [];
    for (const dir of include) {
      const fullPath = join(this.projectRoot, dir);
      allFiles.push(...this.findTSXFiles(fullPath, exclude));
    }

    console.log(`Found ${allFiles.length} .tsx files\n`);

    // Limitiere auf maxFiles wenn gesetzt
    const filesToProcess = maxFiles ? allFiles.slice(0, maxFiles) : allFiles;
    console.log(`Processing ${filesToProcess.length} files...\n`);

    // Fixe alle Files
    for (const file of filesToProcess) {
      const result = this.fixFile(file, dryRun);
      this.results.push(result);

      if (result.changed) {
        console.log(`✅ ${result.file} - ${result.changes.icons} icons, ${result.changes.colors} colors`);
      }
    }

    this.printSummary();
  }

  /**
   * Drucke Summary
   */
  private printSummary(): void {
    const changedFiles = this.results.filter(r => r.changed);
    const totalIcons = this.results.reduce((sum, r) => sum + r.changes.icons, 0);
    const totalColors = this.results.reduce((sum, r) => sum + r.changes.colors, 0);
    const totalSpacing = this.results.reduce((sum, r) => sum + r.changes.spacing, 0);
    const totalTouchTargets = this.results.reduce((sum, r) => sum + r.changes.touchTargets, 0);
    const errors = this.results.filter(r => r.error);

    console.log('\n📊 SUMMARY\n');
    console.log(`Files processed: ${this.results.length}`);
    console.log(`Files changed: ${changedFiles.length}`);
    console.log(`\nFixes applied:`);
    console.log(`  - Icons: ${totalIcons}`);
    console.log(`  - Colors: ${totalColors}`);
    console.log(`  - Spacing: ${totalSpacing}`);
    console.log(`  - Touch Targets: ${totalTouchTargets}`);
    
    if (errors.length > 0) {
      console.log(`\n❌ Errors: ${errors.length}`);
      errors.forEach(e => console.log(`   - ${e.file}: ${e.error}`));
    }

    console.log('\n✅ Batch-Fix Complete!');
  }
}

// CLI Execution
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const maxFiles = args.find(a => a.startsWith('--max='))?.split('=')[1];

const runner = new BrainQABatchRunner();
runner.runBatch({
  dryRun,
  maxFiles: maxFiles ? parseInt(maxFiles) : undefined,
}).catch(console.error);
