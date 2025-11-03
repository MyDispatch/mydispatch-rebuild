#!/usr/bin/env tsx
/* ==================================================================================
   AUTOMATED ERROR SCAN V18.5.0
   ==================================================================================
   Vollständiger Codebase-Scan mit Agent Debug System
   Generiert detaillierten Report + Auto-Fix-Vorschläge
   ================================================================================== */

import { agentDebugSystem } from '../src/lib/agent-debug-system';
import { glob } from 'glob';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface ScanOptions {
  includePatterns: string[];
  excludePatterns: string[];
  outputDir: string;
  generateFixes: boolean;
  verbose: boolean;
}

interface ScanReport {
  timestamp: string;
  totalFiles: number;
  totalErrors: number;
  byCategory: Record<string, number>;
  bySeverity: Record<string, number>;
  autoFixable: number;
  criticalFiles: string[];
  files: Array<{
    path: string;
    errors: any[];
    errorCount: number;
  }>;
  batchFixes?: any;
  estimatedFixTime: string;
}

async function scanCodebase(options: ScanOptions): Promise<ScanReport> {
  console.log('\n🔍 STARTING AUTOMATED ERROR SCAN\n');
  console.log('Scanning patterns:', options.includePatterns);
  console.log('Excluding:', options.excludePatterns, '\n');

  const startTime = Date.now();

  // Find all files
  const files = await glob(options.includePatterns, {
    ignore: options.excludePatterns,
    absolute: false
  });

  console.log(`📁 Found ${files.length} files to scan\n`);

  const allErrors: any[] = [];
  const scanResults: ScanReport = {
    timestamp: new Date().toISOString(),
    totalFiles: files.length,
    totalErrors: 0,
    byCategory: {},
    bySeverity: {},
    autoFixable: 0,
    criticalFiles: [],
    files: [],
    estimatedFixTime: '0h 0m'
  };

  let filesProcessed = 0;

  // Scan each file
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8');
      const result = await agentDebugSystem.scanFiles([{ 
        path: file, 
        content 
      }]);

      if (result.totalErrors > 0) {
        scanResults.files.push({
          path: file,
          errors: result.errors,
          errorCount: result.totalErrors
        });
        allErrors.push(...result.errors);

        // Track critical files
        const criticalErrors = result.errors.filter((e: any) => e.severity === 'critical');
        if (criticalErrors.length > 0) {
          scanResults.criticalFiles.push(file);
        }

        if (options.verbose) {
          console.log(`  ⚠️  ${file}: ${result.totalErrors} errors`);
        }
      }

      filesProcessed++;
      if (filesProcessed % 10 === 0 || filesProcessed === files.length) {
        process.stdout.write(`\rProgress: ${filesProcessed}/${files.length} files scanned`);
      }
    } catch (error) {
      console.error(`\n❌ Error scanning ${file}:`, error);
    }
  }

  console.log('\n');

  // Aggregate results
  scanResults.totalErrors = allErrors.length;
  scanResults.autoFixable = allErrors.filter(e => e.autoFixable).length;

  // Group by category
  allErrors.forEach(error => {
    scanResults.byCategory[error.category] = 
      (scanResults.byCategory[error.category] || 0) + 1;
    scanResults.bySeverity[error.severity] = 
      (scanResults.bySeverity[error.severity] || 0) + 1;
  });

  // Estimate fix time (rough calculation)
  const autoFixTime = scanResults.autoFixable * 0.5; // 30 sec per auto-fix
  const manualFixTime = (scanResults.totalErrors - scanResults.autoFixable) * 5; // 5 min per manual fix
  const totalMinutes = Math.round(autoFixTime + manualFixTime);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  scanResults.estimatedFixTime = `${hours}h ${minutes}m`;

  // Generate batch fixes
  if (options.generateFixes) {
    scanResults.batchFixes = generateBatchFixes(allErrors, scanResults.files);
  }

  // Save results
  if (!existsSync(options.outputDir)) {
    mkdirSync(options.outputDir, { recursive: true });
  }

  const reportPath = join(options.outputDir, `ERROR_SCAN_REPORT_${Date.now()}.json`);
  writeFileSync(reportPath, JSON.stringify(scanResults, null, 2));

  const summaryPath = join(options.outputDir, 'SCAN_SUMMARY.txt');
  writeFileSync(summaryPath, generateTextSummary(scanResults));

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n✅ Scan completed in ${duration}s`);
  console.log(`📊 Report saved to: ${reportPath}`);
  console.log(`📝 Summary saved to: ${summaryPath}\n`);

  return scanResults;
}

function generateBatchFixes(errors: any[], files: any[]) {
  const batches: Record<string, any[]> = {
    'design-system': [],
    'mobile-first': [],
    'security': [],
    'accessibility': [],
    'performance': [],
    'code-quality': []
  };

  errors.forEach(error => {
    if (error.autoFixable && error.fix) {
      const category = error.category;
      if (!batches[category]) batches[category] = [];
      
      batches[category].push({
        type: error.type,
        file: error.file,
        line: error.line,
        pattern: error.code,
        replacement: error.fix,
        description: error.description
      });
    }
  });

  return batches;
}

function generateTextSummary(report: ScanReport): string {
  let summary = `
╔══════════════════════════════════════════════════════════════╗
║           AUTOMATED ERROR SCAN SUMMARY V18.5.0              ║
╚══════════════════════════════════════════════════════════════╝

Timestamp: ${report.timestamp}
Files Scanned: ${report.totalFiles}
Total Errors: ${report.totalErrors}
Auto-Fixable: ${report.autoFixable} (${Math.round(report.autoFixable / report.totalErrors * 100)}%)
Estimated Fix Time: ${report.estimatedFixTime}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERRORS BY SEVERITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  Object.entries(report.bySeverity)
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return (order[a[0] as keyof typeof order] || 99) - (order[b[0] as keyof typeof order] || 99);
    })
    .forEach(([severity, count]) => {
      const emoji = { critical: '🔴', high: '🟠', medium: '🟡', low: '🔵' }[severity] || '⚪';
      summary += `${emoji} ${severity.toUpperCase()}: ${count}\n`;
    });

  summary += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERRORS BY CATEGORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

  Object.entries(report.byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      const percentage = Math.round((count / report.totalErrors) * 100);
      const bar = '█'.repeat(Math.floor(percentage / 2));
      summary += `${category.padEnd(25)}: ${count.toString().padStart(4)} (${percentage}%) ${bar}\n`;
    });

  if (report.criticalFiles.length > 0) {
    summary += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL FILES (${report.criticalFiles.length})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
    report.criticalFiles.slice(0, 20).forEach(file => {
      summary += `🚨 ${file}\n`;
    });
    if (report.criticalFiles.length > 20) {
      summary += `... and ${report.criticalFiles.length - 20} more\n`;
    }
  }

  summary += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDED ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Run batch-fix-runner.ts for auto-fixable errors (${report.autoFixable} fixes)
2. Review critical files manually (${report.criticalFiles.length} files)
3. Address security issues first (${report.bySeverity.critical || 0} critical)
4. Run incremental scans during development

Next Steps:
  npm run fix:batch         # Run auto-fixes
  npm run fix:interactive   # Interactive fix mode
  npm run scan:watch        # Watch mode for continuous scanning
`;

  return summary;
}

// Main execution
const options: ScanOptions = {
  includePatterns: [
    'src/**/*.tsx',
    'src/**/*.ts'
  ],
  excludePatterns: [
    '**/node_modules/**',
    '**/*.test.ts',
    '**/*.spec.ts',
    '**/dist/**',
    '**/.lovable/**',
    '**/integrations/supabase/types.ts'
  ],
  outputDir: './docs/error-reports',
  generateFixes: true,
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v')
};

scanCodebase(options).then(results => {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                    SCAN COMPLETE                            ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  console.log(`📊 Total Errors: ${results.totalErrors}`);
  console.log(`✨ Auto-Fixable: ${results.autoFixable} (${Math.round(results.autoFixable / results.totalErrors * 100)}%)`);
  console.log(`⏱️  Estimated Fix Time: ${results.estimatedFixTime}\n`);
  
  console.log('By Severity:');
  Object.entries(results.bySeverity).forEach(([severity, count]) => {
    const emoji = { critical: '🔴', high: '🟠', medium: '🟡', low: '🔵' }[severity] || '⚪';
    console.log(`  ${emoji} ${severity}: ${count}`);
  });
  
  console.log('\nBy Category (Top 5):');
  Object.entries(results.byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([category, count]) => {
      console.log(`  • ${category}: ${count}`);
    });

  if (results.criticalFiles.length > 0) {
    console.log(`\n🚨 ${results.criticalFiles.length} files contain CRITICAL errors`);
  }

  console.log('\n📖 See SCAN_SUMMARY.txt for detailed breakdown');
  console.log('💡 Run "npm run fix:batch" to start auto-fixing\n');

  process.exit(0);
}).catch(error => {
  console.error('\n❌ Scan failed:', error);
  process.exit(1);
});
