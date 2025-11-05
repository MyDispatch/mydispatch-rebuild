#!/usr/bin/env tsx
/**
 * AUTO TYPE FIXER
 * Systematischer Batch-Fix für alle any-types im Projekt
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

interface TypeReplacement {
  pattern: RegExp;
  replacement: string;
  description: string;
}

const TYPE_REPLACEMENTS: TypeReplacement[] = [
  {
    pattern: /\(\s*e\s*:\s*any\s*\)/g,
    replacement: '(e: React.ChangeEvent<HTMLInputElement>)',
    description: 'Event handler parameter'
  },
  {
    pattern: /\(\s*error\s*:\s*any\s*\)/g,
    replacement: '(error: Error | unknown)',
    description: 'Error parameter'
  },
  {
    pattern: /\(\s*data\s*:\s*any\s*\)/g,
    replacement: '(data: unknown)',
    description: 'Data parameter'
  },
  {
    pattern: /:\s*any\[\]/g,
    replacement: ': unknown[]',
    description: 'Any array'
  },
  {
    pattern: /Record<string,\s*any>/g,
    replacement: 'Record<string, unknown>',
    description: 'Record with any values'
  }
];

async function fixFile(filePath: string): Promise<number> {
  let content = readFileSync(filePath, 'utf-8');
  let fixCount = 0;

  for (const replacement of TYPE_REPLACEMENTS) {
    const before = content;
    content = content.replace(replacement.pattern, replacement.replacement);
    if (content !== before) {
      const matches = before.match(replacement.pattern);
      fixCount += matches?.length || 0;
      console.log(`  ✓ ${replacement.description}: ${matches?.length || 0} fixes`);
    }
  }

  if (fixCount > 0) {
    writeFileSync(filePath, content, 'utf-8');
  }

  return fixCount;
}

async function main() {
  console.log('🔧 AUTO TYPE FIXER - Starting...\n');

  const files = await glob('src/**/*.{ts,tsx}', {
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.d.ts']
  });

  console.log(`📁 Found ${files.length} files\n`);

  let totalFixes = 0;
  let filesChanged = 0;

  for (const file of files) {
    const fixes = await fixFile(file);
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
}

main().catch(console.error);
