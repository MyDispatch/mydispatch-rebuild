#!/usr/bin/env tsx
/**
 * Console-Log Migration Script V28.2.12
 *
 * Automatisiert die Migration von console.* zu logger.*
 * mit DEV-Guards und Component-Context
 *
 * Usage: tsx scripts/migrate-console-logs.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";

// Exclude already migrated files
const EXCLUDE_FILES = [
  "src/hooks/use-auto-validator.ts",
  "src/hooks/use-pricing-validation.ts",
  "src/hooks/use-doc-sync.ts",
  "src/lib/logger.ts",
  "src/lib/dev-logger.ts",
  "scripts/migrate-console-logs.ts",
];

const files = globSync("src/**/*.{ts,tsx}").filter((file) => !EXCLUDE_FILES.includes(file));

let totalFixed = 0;
let totalReplacements = 0;

console.log(`🔍 Scanning ${files.length} files...\n`);

files.forEach((file) => {
  let content = readFileSync(file, "utf-8");
  let changed = false;
  let replacements = 0;

  // Skip if already uses logger
  if (
    content.includes("from '@/lib/logger'") &&
    !content.match(/console\.(log|error|warn|info|debug|group)/)
  ) {
    return;
  }

  // Pattern 1: console.log → logger.info
  const logMatches = content.match(/console\.log\(/g);
  if (logMatches) {
    content = content.replace(/console\.log\(/g, "logger.info(");
    replacements += logMatches.length;
    changed = true;
  }

  // Pattern 2: console.error → logger.error
  const errorMatches = content.match(/console\.error\(/g);
  if (errorMatches) {
    content = content.replace(/console\.error\(/g, "logger.error(");
    replacements += errorMatches.length;
    changed = true;
  }

  // Pattern 3: console.warn → logger.warn
  const warnMatches = content.match(/console\.warn\(/g);
  if (warnMatches) {
    content = content.replace(/console\.warn\(/g, "logger.warn(");
    replacements += warnMatches.length;
    changed = true;
  }

  // Pattern 4: console.info → logger.info
  const infoMatches = content.match(/console\.info\(/g);
  if (infoMatches) {
    content = content.replace(/console\.info\(/g, "logger.info(");
    replacements += infoMatches.length;
    changed = true;
  }

  // Pattern 5: console.debug → logger.debug
  const debugMatches = content.match(/console\.debug\(/g);
  if (debugMatches) {
    content = content.replace(/console\.debug\(/g, "logger.debug(");
    replacements += debugMatches.length;
    changed = true;
  }

  // Pattern 6: console.group → logger.group
  const groupMatches = content.match(/console\.group\(/g);
  if (groupMatches) {
    content = content.replace(/console\.group\(/g, "logger.group(");
    replacements += groupMatches.length;
    changed = true;
  }

  // Pattern 7: console.groupEnd → logger.groupEnd
  const groupEndMatches = content.match(/console\.groupEnd\(/g);
  if (groupEndMatches) {
    content = content.replace(/console\.groupEnd\(/g, "logger.groupEnd(");
    replacements += groupEndMatches.length;
    changed = true;
  }

  // Pattern 8: Add logger import if missing
  if (changed && !content.includes("from '@/lib/logger'")) {
    // Find the last import statement
    const importRegex = /(import\s+.*?from\s+['"].*?['"];?\n)+/;
    const match = content.match(importRegex);

    if (match) {
      const lastImportEnd = match.index! + match[0].length;
      content =
        content.slice(0, lastImportEnd) +
        `import { logger } from '@/lib/logger';\n` +
        content.slice(lastImportEnd);
    } else {
      // No imports found, add at top
      content = `import { logger } from '@/lib/logger';\n\n${content}`;
    }
  }

  if (changed) {
    writeFileSync(file, content);
    totalFixed++;
    totalReplacements += replacements;
    console.log(`✅ ${file} (${replacements} replacements)`);
  }
});

console.log(`\n${"=".repeat(60)}`);
console.log(`✅ Migration Complete!`);
console.log(`${"=".repeat(60)}`);
console.log(`📊 Fixed ${totalFixed} files`);
console.log(`📊 Total ${totalReplacements} console.* calls replaced`);
console.log(`${"=".repeat(60)}\n`);
console.log(`⚠️  Manual review needed for:`);
console.log(`   - Complex console.error() with error objects`);
console.log(`   - console.table() calls`);
console.log(`   - console.time() / console.timeEnd() calls`);
console.log(`\n🚀 Next: npm run build && npm run type-check\n`);
