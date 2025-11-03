#!/usr/bin/env tsx
/* ==================================================================================
   REAL-TIME MONITORING - KONTINUIERLICHE QUALITÄTSPRÜFUNG
   ==================================================================================
   - File-Watcher für Echtzeit-Validierung
   - Automatische Fehlerkorrektur im Hintergrund
   - Desktop-Notifications bei kritischen Fehlern
   - Integration mit VS Code
   ================================================================================== */

import { watch } from 'fs';
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { execSync } from 'child_process';

interface WatchedFile {
  path: string;
  lastModified: number;
  errorCount: number;
}

const watchedFiles = new Map<string, WatchedFile>();
let isProcessing = false;

const VALIDATION_RULES = {
  // Design System
  accentUsage: {
    pattern: /\baccent\b(?!.*\/\/|.*\/\*)/,
    severity: 'critical',
    autoFix: (content: string) => content.replace(/\baccent\b/g, 'primary'),
    message: 'accent color detected - replacing with primary'
  },
  
  directColors: {
    pattern: /\b(text-white|bg-white|text-black|bg-black)\b(?!.*\/\/)/,
    severity: 'critical',
    autoFix: (content: string) => {
      let fixed = content;
      fixed = fixed.replace(/text-white(?!\s*\/)/g, 'text-foreground');
      fixed = fixed.replace(/bg-white(?!\s*\/)/g, 'bg-background');
      fixed = fixed.replace(/text-black(?!\s*\/)/g, 'text-foreground');
      fixed = fixed.replace(/bg-black(?!\s*\/)/g, 'bg-foreground');
      return fixed;
    },
    message: 'Direct colors detected - replacing with semantic tokens'
  },

  // Security
  deleteStatement: {
    pattern: /\.delete\(\)(?!.*soft)/,
    severity: 'critical',
    autoFix: (content: string) => 
      content.replace(/\.delete\(\)/g, '.update({ deleted_at: new Date().toISOString() })'),
    message: 'DELETE detected - replacing with soft-delete'
  },

  // Mobile-First
  smallTouchTarget: {
    pattern: /min-h-\[[1-3][0-9]px\]/,
    severity: 'error',
    autoFix: (content: string) => 
      content.replace(/min-h-\[[1-3][0-9]px\]/g, 'min-h-[44px]'),
    message: 'Touch target too small - fixing to 44px minimum'
  },

  // Code Quality
  consoleLog: {
    pattern: /console\.(log|debug|info)(?!.*KEEP)/,
    severity: 'warning',
    autoFix: null, // Manual review required
    message: 'console.log detected - consider removing or using logDebug()'
  }
};

function validateContent(content: string, file: string): { errors: string[]; fixed: string } {
  const errors: string[] = [];
  let fixed = content;

  for (const [name, rule] of Object.entries(VALIDATION_RULES)) {
    if (rule.pattern.test(content)) {
      errors.push(`[${rule.severity}] ${rule.message}`);
      
      if (rule.autoFix && rule.severity === 'critical') {
        fixed = rule.autoFix(fixed);
        console.log(`  ✅ Auto-fixed: ${name} in ${file}`);
      }
    }
  }

  return { errors, fixed };
}

async function processFile(filePath: string) {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const content = readFileSync(filePath, 'utf-8');
    const { errors, fixed } = validateContent(content, filePath);

    if (errors.length > 0) {
      const fileInfo = watchedFiles.get(filePath) || {
        path: filePath,
        lastModified: Date.now(),
        errorCount: 0
      };

      fileInfo.errorCount = errors.length;
      fileInfo.lastModified = Date.now();
      watchedFiles.set(filePath, fileInfo);

      console.log(`\n⚠️  ${filePath}:`);
      errors.forEach(err => console.log(`   ${err}`));

      // Auto-fix if content changed
      if (fixed !== content) {
        writeFileSync(filePath, fixed, 'utf-8');
        console.log(`   🔧 Auto-fixes applied\n`);
        
        // Notify critical fixes
        if (errors.some(e => e.includes('[critical]'))) {
          notifyUser('Critical Violation Fixed', filePath);
        }
      }
    } else {
      // Clear errors if file is now clean
      if (watchedFiles.has(filePath)) {
        console.log(`\n✅ ${filePath} - all issues resolved`);
        watchedFiles.delete(filePath);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
  } finally {
    isProcessing = false;
  }
}

function notifyUser(title: string, message: string) {
  // Try to send desktop notification (cross-platform)
  try {
    if (process.platform === 'darwin') {
      execSync(`osascript -e 'display notification "${message}" with title "${title}"'`);
    } else if (process.platform === 'linux') {
      execSync(`notify-send "${title}" "${message}"`);
    } else if (process.platform === 'win32') {
      // Windows notification via PowerShell
      const ps = `
        [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
        [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null
        $xml = @"
        <toast>
          <visual>
            <binding template="ToastText02">
              <text id="1">${title}</text>
              <text id="2">${message}</text>
            </binding>
          </visual>
        </toast>
"@
        $toast = [Windows.UI.Notifications.ToastNotification]::new($xml)
        [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier("MyDispatch").Show($toast)
      `;
      execSync(`powershell -Command "${ps}"`);
    }
  } catch (error) {
    // Silently fail if notifications not available
  }
}

async function startMonitoring() {
  console.log('🔍 MyDispatch Real-Time Monitor V18.5.0');
  console.log('=========================================\n');
  console.log('Watching src/ for quality violations...');
  console.log('Press Ctrl+C to stop\n');

  // Initial scan
  const files = await glob('src/**/*.{ts,tsx}', { ignore: '**/node_modules/**' });
  console.log(`📊 Initial scan of ${files.length} files...\n`);

  for (const file of files) {
    await processFile(file);
  }

  // Watch for changes
  const watcher = watch('src', { recursive: true }, async (eventType, filename) => {
    if (!filename || !filename.match(/\.(tsx?|jsx?)$/)) return;
    
    const filePath = `src/${filename}`;
    
    // Debounce rapid changes
    setTimeout(() => {
      processFile(filePath);
    }, 500);
  });

  console.log('\n✅ Monitoring active. Watching for changes...\n');
  
  // Status report every 30 seconds
  setInterval(() => {
    if (watchedFiles.size > 0) {
      console.log(`\n📊 Current Issues: ${watchedFiles.size} files with violations`);
      watchedFiles.forEach((file, path) => {
        console.log(`   - ${path}: ${file.errorCount} issues`);
      });
      console.log('');
    }
  }, 30000);

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n👋 Monitoring stopped');
    console.log(`📊 Final stats: ${watchedFiles.size} files with remaining issues\n`);
    watcher.close();
    process.exit(0);
  });
}

startMonitoring().catch(error => {
  console.error('❌ Monitor failed:', error);
  process.exit(1);
});
