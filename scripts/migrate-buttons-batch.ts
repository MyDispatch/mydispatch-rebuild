#!/usr/bin/env tsx
/**
 * BUTTON MIGRATION SCRIPT - V28Button Batch Migration
 * Migriert alle Button-Imports zu V28Button mit Variant-Mapping
 */

import * as fs from "fs";
import * as path from "path";

// Variant Mapping
const VARIANT_MAP: Record<string, string> = {
  outline: "secondary",
  ghost: "secondary",
  default: "primary",
  destructive: "destructive",
  secondary: "secondary",
  link: "secondary",
};

// Dateien die bereits migriert wurden (überspringen)
const ALREADY_MIGRATED = [
  "AgentHealthDashboard.tsx",
  "AlertDashboard.tsx",
  "EmptyState.tsx",
  "ErrorBoundary.tsx",
];

function migrateFile(filePath: string): boolean {
  const fileName = path.basename(filePath);

  // Skip bereits migrierte Files
  if (ALREADY_MIGRATED.includes(fileName)) {
    console.log(`⏭️  Überspringe ${fileName} (bereits migriert)`);
    return false;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  let hasChanges = false;

  // 1. Import ersetzen
  if (
    content.includes("from '@/components/ui/button'") ||
    content.includes('from "@/components/ui/button"')
  ) {
    content = content.replace(
      /import\s+\{\s*Button(?:\s*,\s*ButtonProps)?\s*\}\s+from\s+['"]@\/components\/ui\/button['"]/g,
      "import { V28Button } from '@/components/design-system/V28Button'"
    );
    hasChanges = true;
  }

  // 2. Button Component Tags ersetzen
  if (content.includes("<Button") || content.includes("</Button>")) {
    content = content.replace(/<Button\b/g, "<V28Button");
    content = content.replace(/<\/Button>/g, "</V28Button>");
    hasChanges = true;
  }

  // 3. Variant Mapping
  Object.entries(VARIANT_MAP).forEach(([oldVariant, newVariant]) => {
    const regex = new RegExp(`variant="${oldVariant}"`, "g");
    if (content.match(regex)) {
      content = content.replace(regex, `variant="${newVariant}"`);
      hasChanges = true;
    }
  });

  // Speichern wenn Änderungen
  if (hasChanges) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`✅ Migriert: ${fileName}`);
    return true;
  }

  return false;
}

// Alle TSX/TS Files in src/components finden
function findComponentFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(findComponentFiles(filePath));
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      // Prüfe ob File Button-Import hat
      const content = fs.readFileSync(filePath, "utf-8");
      if (
        content.includes("from '@/components/ui/button'") ||
        content.includes('from "@/components/ui/button"')
      ) {
        results.push(filePath);
      }
    }
  });

  return results;
}

// MAIN EXECUTION
console.log("🚀 Starting Button Migration to V28Button...\n");

const componentDir = path.join(process.cwd(), "src/components");
const filesToMigrate = findComponentFiles(componentDir);

console.log(`📁 Gefunden: ${filesToMigrate.length} Dateien mit Button-Imports\n`);

let migratedCount = 0;
let skippedCount = 0;

filesToMigrate.forEach((file) => {
  const migrated = migrateFile(file);
  if (migrated) {
    migratedCount++;
  } else {
    skippedCount++;
  }
});

console.log(`\n✨ Migration abgeschlossen!`);
console.log(`   ✅ ${migratedCount} Dateien migriert`);
console.log(`   ⏭️  ${skippedCount} Dateien übersprungen`);
console.log(`   📊 Total: ${filesToMigrate.length} Dateien`);
