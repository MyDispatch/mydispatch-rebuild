#!/usr/bin/env tsx
/**
 * FIX UNUSED VARIABLES
 * Systematischer Batch-Fix für TS6133 Errors (Unused Variables/Imports)
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

interface FixPattern {
  pattern: RegExp;
  replacement: string;
  description: string;
}

const FIX_PATTERNS: FixPattern[] = [
  // Unused React imports (React 17+ doesn't need React for JSX)
  {
    pattern: /^import React from ['"]react['"];?\n/gm,
    replacement: '',
    description: 'Unused React import (React 17+)'
  },
  // Unused imports in destructuring (remove from destructuring)
  {
    pattern: /import\s+{\s*([^}]+)\s*}\s+from\s+['"]lucide-react['"];?/g,
    replacement: (match: string, imports: string) => {
      // This is complex - we'll handle it per file
      return match;
    },
    description: 'Unused lucide-react imports'
  },
];

async function fixUnusedReactImports(filePath: string): Promise<number> {
  let content = readFileSync(filePath, 'utf-8');
  let fixCount = 0;

  // Check if file uses JSX but doesn't use React object
  const hasJSX = /<[A-Z]/.test(content);
  const usesReact = /React\.(Component|createElement|Fragment|useState|useEffect|useContext|useRef|useMemo|useCallback|forwardRef|memo|lazy|Suspense|StrictMode)/.test(content);
  const hasReactImport = /^import React from ['"]react['"];?\n/gm.test(content);

  if (hasJSX && !usesReact && hasReactImport) {
    content = content.replace(/^import React from ['"]react['"];?\n/gm, '');
    fixCount++;
    console.log(`  ✓ Removed unused React import`);
  }

  if (fixCount > 0) {
    writeFileSync(filePath, content, 'utf-8');
  }

  return fixCount;
}

async function main() {
  console.log('🔧 FIX UNUSED VARIABLES - Starting...\n');

  const files = await glob('src/**/*.{ts,tsx}', {
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.d.ts']
  });

  console.log(`📁 Found ${files.length} files\n`);

  let totalFixes = 0;
  let filesChanged = 0;

  for (const file of files) {
    const fixes = await fixUnusedReactImports(file);
    if (fixes > 0) {
      console.log(`✅ ${file}: ${fixes} fixes\n`);
      filesChanged++;
      totalFixes += fixes;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Complete!`);
  console.log(`📊 Files changed: ${filesChanged}`);
  console.log(`🔧 Total fixes: ${totalFixes}`);
  console.log('='.repeat(60));
  console.log('\n⚠️  Note: Some unused variables need manual review');
  console.log('   Run: npm run type-check to see remaining TS6133 errors');
}

main().catch(console.error);

