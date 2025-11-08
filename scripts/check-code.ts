#!/usr/bin/env tsx
/* ==================================================================================
   CHECKER CLI V1.0 - Standalone Code Quality Tool
   ==================================================================================
   🎯 ZWECK:
   - Lokale Code-Prüfung via Claude 4.5
   - CI/CD Integration (GitHub Actions)
   - Exit-Code für Pipeline-Steuerung
   
   📊 USAGE:
   - npm run check:code [files...]
   - npm run check:db
   - npm run check:full
   
   🔐 REQUIREMENTS:
   - SUPABASE_URL (env)
   - SUPABASE_SERVICE_ROLE_KEY (env)
   ================================================================================== */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Config
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface CheckResult {
  success: boolean;
  reportId?: string;
  issuesFound?: number;
  summary?: string;
  data?: {
    issues: Array<{
      type: string;
      severity: string;
      file: string;
      line: number;
      description: string;
      fix: string;
    }>;
  };
}

async function checkCode(files?: string[]): Promise<CheckResult> {
  console.log('🔍 Running Code Check...');

  let codeContent = '';
  
  if (files && files.length > 0) {
    // Read specific files
    for (const file of files) {
      const filePath = path.resolve(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        codeContent += `\n\n// File: ${file}\n${content}`;
      } else {
        console.warn(`⚠️  File not found: ${file}`);
      }
    }
  } else {
    // Full repo scan: Read key files
    const keyFiles = [
      'src/pages/Index.tsx',
      'src/components/checker/CodeCheckerTrigger.tsx',
      'src/hooks/use-auto-healer.tsx',
    ];
    
    for (const file of keyFiles) {
      const filePath = path.resolve(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        codeContent += `\n\n// File: ${file}\n${content}`;
      }
    }
  }

  if (!codeContent.trim()) {
    console.error('❌ No code to check');
    return { success: false };
  }

  const { data, error } = await supabase.functions.invoke('code-checker', {
    body: {
      reportType: 'code',
      code: codeContent,
      context: `CLI Check: ${files ? files.join(', ') : 'Full Scan'}`,
    }
  });

  if (error) {
    console.error('❌ Check failed:', error);
    return { success: false };
  }

  return data;
}

async function checkDatabase(): Promise<CheckResult> {
  console.log('🗄️  Running Database Check...');

  const { data, error } = await supabase.functions.invoke('code-checker', {
    body: {
      reportType: 'database',
      context: 'CLI DB Check',
    }
  });

  if (error) {
    console.error('❌ Check failed:', error);
    return { success: false };
  }

  return data;
}

async function checkFull(): Promise<CheckResult> {
  console.log('🚀 Running Full System Check...');

  const { data, error } = await supabase.functions.invoke('code-checker', {
    body: {
      reportType: 'full',
      context: 'CLI Full Check',
    }
  });

  if (error) {
    console.error('❌ Check failed:', error);
    return { success: false };
  }

  return data;
}

function printResults(result: CheckResult): number {
  if (!result.success) {
    console.error('❌ Check failed');
    return 1;
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 CHECK RESULTS');
  console.log('='.repeat(60));
  
  if (result.issuesFound === 0) {
    console.log('✅ No issues found! Code quality is excellent.');
    return 0;
  }

  console.log(`\n⚠️  Found ${result.issuesFound} issues\n`);
  
  if (result.summary) {
    console.log('📝 Summary:');
    console.log(result.summary);
  }

  if (result.data?.issues && result.data.issues.length > 0) {
    console.log('\n🔍 Top Issues:\n');
    
    const topIssues = result.data.issues.slice(0, 5);
    topIssues.forEach((issue, idx) => {
      console.log(`${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.type}`);
      console.log(`   File: ${issue.file}:${issue.line}`);
      console.log(`   ${issue.description}`);
      if (issue.fix) {
        console.log(`   💡 Fix: ${issue.fix}`);
      }
      console.log('');
    });

    if (result.data.issues.length > 5) {
      console.log(`   ... and ${result.data.issues.length - 5} more issues\n`);
    }
  }

  console.log('='.repeat(60));
  console.log(`\n📋 Report ID: ${result.reportId}\n`);

  // Exit code based on severity
  const hasCritical = result.data?.issues.some(i => 
    i.severity === 'critical' || i.severity === 'high'
  );

  if (hasCritical) {
    console.log('❌ Critical issues found - Fix before deployment!');
    return 1;
  } else {
    console.log('⚠️  Non-critical issues found - Review recommended');
    return 0; // Non-blocking
  }
}

// Main CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  let result: CheckResult;

  switch (command) {
    case 'db':
    case 'database':
      result = await checkDatabase();
      break;
    
    case 'full':
      result = await checkFull();
      break;
    
    case 'code':
    default: {
      const files = command === 'code' ? args.slice(1) : args;
      result = await checkCode(files.length > 0 ? files : undefined);
      break;
    }
  }

  const exitCode = printResults(result);
  process.exit(exitCode);
}

main().catch((err) => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
