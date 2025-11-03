#!/usr/bin/env tsx
/* ==================================================================================
   PRE-COMMIT VALIDATION - VERHINDERT FEHLER VOR COMMIT
   ==================================================================================
   - Blockiert Commits mit kritischen Fehlern
   - Automatische Fixes für einfache Violations
   - Integration mit Git-Hooks
   - Real-time Feedback
   ================================================================================== */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

interface ValidationError {
  file: string;
  line: number;
  severity: 'critical' | 'error' | 'warning';
  message: string;
  autoFixable: boolean;
  fix?: () => void;
}

const CRITICAL_VIOLATIONS = {
  // Design System
  accentColor: /\baccent\b(?!.*\/\/|.*\/\*)/,
  directColors: /\b(text-white|bg-white|text-black|bg-black)\b(?!.*\/\/)/,
  hexColors: /#[0-9a-fA-F]{3,6}(?!.*\/\/)/,
  
  // Security
  missingCompanyId: /\.from\(['"].*?['"]\)\.select\(.*?\)(?!.*company_id)/,
  deleteStatement: /\.delete\(\)/,
  authUsersInRLS: /auth\.users/,
  
  // Mobile-First
  smallTouchTarget: /min-h-\[(1|2|3)[0-9]px\]/,
  nonResponsiveFontSize: /text-(xs|sm|base|lg|xl)(?!\s+sm:|md:|lg:)/,
  
  // Code Quality
  inlineFormatter: /\.(toLocaleString|toFixed|toPrecision)\(/,
  missingTryCatch: /async\s+function.*?\{[^}]*(?!try)/,
};

async function validateStagedFiles(): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];
  
  // Get staged files
  const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACM')
    .toString()
    .trim()
    .split('\n')
    .filter(file => file.match(/\.(tsx?|jsx?)$/));

  console.log(`\n🔍 Validating ${stagedFiles.length} staged files...\n`);

  for (const file of stagedFiles) {
    try {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Check accent color
        if (CRITICAL_VIOLATIONS.accentColor.test(line)) {
          errors.push({
            file,
            line: index + 1,
            severity: 'critical',
            message: 'VERBOTEN: accent color detected - use primary instead',
            autoFixable: true,
            fix: () => {
              const fixed = content.replace(/\baccent\b/g, 'primary');
              writeFileSync(file, fixed, 'utf-8');
            }
          });
        }

        // Check direct colors
        if (CRITICAL_VIOLATIONS.directColors.test(line)) {
          errors.push({
            file,
            line: index + 1,
            severity: 'critical',
            message: 'Direct colors detected - use semantic tokens',
            autoFixable: true,
            fix: () => {
              let fixed = content;
              fixed = fixed.replace(/text-white/g, 'text-foreground');
              fixed = fixed.replace(/bg-white/g, 'bg-background');
              fixed = fixed.replace(/text-black/g, 'text-foreground');
              fixed = fixed.replace(/bg-black/g, 'bg-foreground');
              writeFileSync(file, fixed, 'utf-8');
            }
          });
        }

        // Check hex colors (only in TSX, not in design tokens)
        if (CRITICAL_VIOLATIONS.hexColors.test(line) && 
            !file.includes('design-tokens.ts') &&
            !file.includes('index.css')) {
          errors.push({
            file,
            line: index + 1,
            severity: 'error',
            message: 'Hex color detected - use CI_COLORS_HEX from design-tokens',
            autoFixable: false,
          });
        }

        // Check missing company_id filter
        if (CRITICAL_VIOLATIONS.missingCompanyId.test(line)) {
          errors.push({
            file,
            line: index + 1,
            severity: 'critical',
            message: 'SECURITY: Missing company_id filter',
            autoFixable: false,
          });
        }

        // Check DELETE statement
        if (CRITICAL_VIOLATIONS.deleteStatement.test(line)) {
          errors.push({
            file,
            line: index + 1,
            severity: 'critical',
            message: 'SECURITY: DELETE detected - use soft-delete instead',
            autoFixable: true,
            fix: () => {
              const fixed = content.replace(
                /\.delete\(\)/g,
                '.update({ deleted_at: new Date().toISOString() })'
              );
              writeFileSync(file, fixed, 'utf-8');
            }
          });
        }

        // Check small touch targets
        if (CRITICAL_VIOLATIONS.smallTouchTarget.test(line)) {
          errors.push({
            file,
            line: index + 1,
            severity: 'error',
            message: 'Touch target too small - minimum 44px required',
            autoFixable: true,
            fix: () => {
              const fixed = content.replace(/min-h-\[[1-3][0-9]px\]/g, 'min-h-[44px]');
              writeFileSync(file, fixed, 'utf-8');
            }
          });
        }
      });
    } catch (error) {
      console.error(`❌ Error reading ${file}:`, error);
    }
  }

  return errors;
}

async function run() {
  console.log('🚀 MyDispatch Pre-Commit Validation V18.5.0\n');

  const errors = await validateStagedFiles();

  // Separate by severity
  const critical = errors.filter(e => e.severity === 'critical');
  const regular = errors.filter(e => e.severity === 'error');
  const warnings = errors.filter(e => e.severity === 'warning');

  // Auto-fix what we can
  const autoFixable = errors.filter(e => e.autoFixable);
  if (autoFixable.length > 0) {
    console.log(`\n🔧 Auto-fixing ${autoFixable.length} violations...\n`);
    autoFixable.forEach(error => error.fix?.());
    
    // Re-stage fixed files
    const fixedFiles = [...new Set(autoFixable.map(e => e.file))];
    fixedFiles.forEach(file => {
      execSync(`git add ${file}`);
    });
    
    console.log('✅ Auto-fixes applied and re-staged\n');
  }

  // Report remaining errors
  const remaining = errors.filter(e => !e.autoFixable);
  
  if (critical.length > 0 && remaining.some(e => e.severity === 'critical')) {
    console.log('❌ CRITICAL VIOLATIONS - COMMIT BLOCKED:\n');
    remaining
      .filter(e => e.severity === 'critical')
      .forEach(e => {
        console.log(`  ${e.file}:${e.line}`);
        console.log(`    ${e.message}\n`);
      });
    process.exit(1);
  }

  if (regular.length > 0 && remaining.some(e => e.severity === 'error')) {
    console.log('⚠️  ERRORS FOUND:\n');
    remaining
      .filter(e => e.severity === 'error')
      .forEach(e => {
        console.log(`  ${e.file}:${e.line}`);
        console.log(`    ${e.message}\n`);
      });
  }

  if (warnings.length > 0) {
    console.log('⚡ WARNINGS:\n');
    warnings.forEach(e => {
      console.log(`  ${e.file}:${e.line}`);
      console.log(`    ${e.message}\n`);
    });
  }

  if (remaining.length === 0) {
    console.log('✅ All validations passed!\n');
    console.log(`📊 Summary:`);
    console.log(`   - Auto-fixed: ${autoFixable.length}`);
    console.log(`   - Manual fixes: 0\n`);
  }

  // Exit with error if critical issues remain
  if (remaining.some(e => e.severity === 'critical')) {
    process.exit(1);
  }
}

run().catch(error => {
  console.error('❌ Pre-commit validation failed:', error);
  process.exit(1);
});
