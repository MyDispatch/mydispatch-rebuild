#!/usr/bin/env tsx
/**
 * MYDISPATCH V6.3 - BUTTON MIGRATION SCRIPT
 * ==========================================
 * Migrates ALL ui/button instances to V28Button
 * - Changes imports
 * - Renames components
 * - Maps variants (default→primary, outline/ghost→secondary)
 * - Generates migration report
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface MigrationResult {
  file: string;
  success: boolean;
  changes: {
    imports: number;
    components: number;
    variants: { [key: string]: number };
  };
  error?: string;
}

const results: MigrationResult[] = [];

// Variant mapping
const VARIANT_MAP: { [key: string]: string } = {
  'default': 'primary',
  'outline': 'secondary',
  'ghost': 'secondary',
  'destructive': 'destructive', // unchanged
  'link': 'ghost', // link buttons become ghost
};

// Recursive file finder
function findTSXFiles(dir: string, exclude: string[] = []): string[] {
  const files: string[] = [];
  
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    
    // Skip excluded paths
    if (exclude.some(ex => fullPath.includes(ex))) continue;
    
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findTSXFiles(fullPath, exclude));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Migrate single file
function migrateFile(filePath: string): MigrationResult {
  const result: MigrationResult = {
    file: filePath,
    success: false,
    changes: {
      imports: 0,
      components: 0,
      variants: {},
    },
  };
  
  try {
    let content = readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // 1. Check if file uses ui/button
    if (!content.includes(`from '@/components/ui/button'`) && 
        !content.includes(`from "@/components/ui/button"`)) {
      // Skip files that don't use ui/button
      return result;
    }
    
    console.log(`\n🔄 Migrating: ${filePath}`);
    
    // 2. Replace Import
    const importRegex = /import\s*\{\s*Button(?:\s*,\s*ButtonProps)?\s*\}\s*from\s*['"]@\/components\/ui\/button['"]/g;
    if (importRegex.test(content)) {
      content = content.replace(
        importRegex,
        `import { V28Button } from '@/components/design-system/V28Button'`
      );
      result.changes.imports++;
    }
    
    // 3. Replace Component Names
    // Opening tags: <Button → <V28Button
    const openingTagMatches = content.match(/<Button\s/g);
    if (openingTagMatches) {
      content = content.replace(/<Button\s/g, '<V28Button ');
      result.changes.components += openingTagMatches.length;
    }
    
    // Closing tags: </Button> → </V28Button>
    const closingTagMatches = content.match(/<\/Button>/g);
    if (closingTagMatches) {
      content = content.replace(/<\/Button>/g, '</V28Button>');
    }
    
    // 4. Map Variants
    for (const [oldVariant, newVariant] of Object.entries(VARIANT_MAP)) {
      // Skip if no change
      if (oldVariant === newVariant) continue;
      
      const variantRegex = new RegExp(`variant=["']${oldVariant}["']`, 'g');
      const matches = content.match(variantRegex);
      
      if (matches) {
        content = content.replace(variantRegex, `variant="${newVariant}"`);
        result.changes.variants[oldVariant] = matches.length;
      }
    }
    
    // 5. Write file if changes were made
    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf-8');
      result.success = true;
      
      console.log(`  ✅ Imports: ${result.changes.imports} | Components: ${result.changes.components} | Variants: ${JSON.stringify(result.changes.variants)}`);
    } else {
      console.log(`  ⏭️  No changes needed`);
    }
    
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error';
    console.error(`  ❌ Error: ${result.error}`);
  }
  
  return result;
}

// Main execution
async function main() {
  console.log('🚀 MyDispatch V6.3 - Button Migration to V28Button\n');
  console.log('================================================\n');
  
  // Find all TSX files
  const files = findTSXFiles('src', [
    'node_modules',
    '.git',
    'dist',
    'build',
    // Exclude already migrated files
    'src/components/design-system/V28Button.tsx',
  ]);
  
  console.log(`📁 Found ${files.length} TSX/TS files\n`);
  
  // Migrate each file
  for (const file of files) {
    const result = migrateFile(file);
    
    if (result.success || result.error) {
      results.push(result);
    }
  }
  
  // Generate Report
  console.log('\n\n📊 MIGRATION REPORT');
  console.log('===================\n');
  
  const successCount = results.filter(r => r.success).length;
  const errorCount = results.filter(r => r.error).length;
  const totalImports = results.reduce((sum, r) => sum + r.changes.imports, 0);
  const totalComponents = results.reduce((sum, r) => sum + r.changes.components, 0);
  
  const variantCounts: { [key: string]: number } = {};
  results.forEach(r => {
    Object.entries(r.changes.variants).forEach(([variant, count]) => {
      variantCounts[variant] = (variantCounts[variant] || 0) + count;
    });
  });
  
  console.log(`✅ Successfully migrated: ${successCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`📦 Total imports changed: ${totalImports}`);
  console.log(`🔧 Total components changed: ${totalComponents}`);
  console.log(`🎨 Variant mappings:`);
  
  Object.entries(variantCounts).forEach(([variant, count]) => {
    console.log(`   ${variant} → ${VARIANT_MAP[variant]}: ${count} instances`);
  });
  
  // Failed files
  if (errorCount > 0) {
    console.log('\n\n❌ FAILED FILES:');
    results.filter(r => r.error).forEach(r => {
      console.log(`   ${r.file}: ${r.error}`);
    });
  }
  
  // Success files (sample)
  console.log('\n\n✅ SUCCESSFULLY MIGRATED FILES (Sample):');
  results
    .filter(r => r.success)
    .slice(0, 10)
    .forEach(r => {
      console.log(`   ${r.file}`);
    });
  
  if (successCount > 10) {
    console.log(`   ... and ${successCount - 10} more files`);
  }
  
  console.log('\n\n🎉 MIGRATION COMPLETE!');
  console.log('======================');
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Run: npm run build`);
  console.log(`   2. Fix any TypeScript errors manually`);
  console.log(`   3. Test the application`);
  console.log(`   4. Commit changes: "feat: migrate all buttons to V28Button"`);
}

main().catch(console.error);
