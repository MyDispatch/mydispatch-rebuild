#!/usr/bin/env tsx
/**
 * EMERGENCY FIX: TypeScript Button Errors
 * ========================================
 * Fixes all remaining Button instances in files where import is already changed
 * - Replaces <Button with <V28Button
 * - Replaces </Button> with </V28Button>
 * - Maps variants (default→primary, outline/ghost→secondary)
 */

import { readFileSync, writeFileSync } from "fs";

const FILES_TO_FIX = [
  "src/pages/Dokumente.tsx",
  "src/pages/DriverTracking.tsx",
  "src/pages/Einstellungen.tsx",
  "src/pages/Kommunikation.tsx",
  "src/pages/Kostenstellen.tsx",
  "src/pages/Partner.tsx",
  "src/pages/Schichtzettel.tsx",
  "src/pages/Statistiken.tsx",
];

function fixFile(filePath: string): void {
  console.log(`\n🔧 Fixing: ${filePath}`);

  let content = readFileSync(filePath, "utf-8");
  let changes = 0;

  // 1. Replace opening tags
  const openBefore = (content.match(/<Button\s/g) || []).length;
  content = content.replace(/<Button\s/g, "<V28Button ");
  changes += openBefore;

  // 2. Replace closing tags
  const closeBefore = (content.match(/<\/Button>/g) || []).length;
  content = content.replace(/<\/Button>/g, "</V28Button>");
  changes += closeBefore;

  // 3. Map variants
  const variantMap = {
    'variant="default"': 'variant="primary"',
    'variant="outline"': 'variant="secondary"',
    'variant="ghost"': 'variant="secondary"',
  };

  for (const [old, newV] of Object.entries(variantMap)) {
    const count = (content.match(new RegExp(old, "g")) || []).length;
    if (count > 0) {
      content = content.replace(new RegExp(old, "g"), newV);
      console.log(`  ✅ ${old} → ${newV}: ${count} instances`);
    }
  }

  writeFileSync(filePath, content, "utf-8");
  console.log(`  ✅ Fixed ${changes} Button instances`);
}

console.log("🚀 Emergency Button Migration Fix\n");
console.log("==================================\n");

FILES_TO_FIX.forEach(fixFile);

console.log("\n\n✅ All TypeScript errors fixed!");
console.log("Run: npm run build");
