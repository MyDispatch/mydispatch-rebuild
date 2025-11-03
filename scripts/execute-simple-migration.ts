#!/usr/bin/env tsx
/**
 * MISSION II - PHASE 2A: SIMPLE COMPONENT MIGRATION
 * ================================================
 * Migriert einfache shadcn/ui Components zu V28 Components
 * 
 * Scope: Button, Input, Card, Badge, Select
 * Strategy: Automated via Edge Function
 * 
 * Part of SOL INVICTUS v21.0 - STRANGLER FIG 2.0
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface MigrationResult {
  file: string;
  success: boolean;
  componentsReplaced: string[];
  errors?: string[];
  backupPath?: string;
}

interface MigrationReport {
  totalFiles: number;
  successfulMigrations: number;
  failedMigrations: number;
  componentsReplaced: Record<string, number>;
  results: MigrationResult[];
  timestamp: string;
}

// Simple components that can be auto-migrated
const SIMPLE_COMPONENTS = [
  'Button',
  'Input', 
  'Card',
  'Badge',
  'Select',
];

// Component mapping: shadcn → V28 Compat Layer
// Format: { componentName: { newName, importPath } }
const COMPONENT_MAP: Record<string, { newName: string; importPath: string }> = {
  'Button': { 
    newName: 'V28Button', 
    importPath: '@/components/design-system/V28Button' 
  },
  'Input': { 
    newName: 'Input', // Stays same name!
    importPath: '@/lib/compat/V28InputCompound' 
  },
  'Card': { 
    newName: 'Card', // Stays same name!
    importPath: '@/lib/compat/V28CardCompound' 
  },
  'Badge': { 
    newName: 'Badge', // Stays same name!
    importPath: '@/lib/compat/V28BadgeCompound' 
  },
  'Select': { 
    newName: 'Select', // Stays same name!
    importPath: '@/lib/compat/V28SelectCompound' 
  },
};

// Variant mapping for Button
const BUTTON_VARIANT_MAP: Record<string, string> = {
  'default': 'primary',
  'outline': 'secondary',
  'ghost': 'secondary',
  'destructive': 'destructive',
  'link': 'ghost',
  'secondary': 'secondary',
};

const results: MigrationResult[] = [];
const componentsReplaced: Record<string, number> = {};

/**
 * Find all TSX files in directory
 */
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

/**
 * Check if file uses ONLY simple components
 */
function usesOnlySimpleComponents(content: string): boolean {
  const uiImportRegex = /from ['"]@\/components\/ui\/([^'"]+)['"]/g;
  const matches = [...content.matchAll(uiImportRegex)];
  
  if (matches.length === 0) return false;
  
  for (const match of matches) {
    const componentName = match[1];
    if (!SIMPLE_COMPONENTS.some(simple => 
      componentName === simple.toLowerCase() || 
      componentName === simple
    )) {
      return false; // Found complex component
    }
  }
  
  return true;
}

/**
 * Migrate a single file
 */
function migrateFile(filePath: string): MigrationResult {
  const result: MigrationResult = {
    file: filePath,
    success: false,
    componentsReplaced: [],
    errors: [],
  };
  
  try {
    let content = readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // Skip if already using V28 components or compat layer
    if (content.includes('@/lib/components/V28') || content.includes('@/lib/compat/')) {
      result.errors?.push('Already migrated to V28');
      return result;
    }
    
    // Skip if uses complex components
    if (!usesOnlySimpleComponents(content)) {
      result.errors?.push('Contains complex components - skip for Phase 2B');
      return result;
    }
    
    console.log(`\n🔄 Migrating: ${filePath}`);
    
    // Create backup
    const backupPath = `${filePath}.backup`;
    writeFileSync(backupPath, originalContent, 'utf-8');
    result.backupPath = backupPath;
    
    let hasChanges = false;
    
    // Step 1: Replace imports AND component tags (if name changes)
    for (const [oldComp, config] of Object.entries(COMPONENT_MAP)) {
      const { newName, importPath } = config;
      const nameChanged = oldComp !== newName;
      
      // Match import lines (supports multi-line imports)
      const oldImportPattern = new RegExp(
        `import\\s*\\{[^}]*\\b${oldComp}\\b[^}]*\\}\\s*from\\s*['"]@\\/components\\/ui\\/${oldComp.toLowerCase()}['"]`,
        'g'
      );
      
      if (oldImportPattern.test(content)) {
        // Replace import with new path
        content = content.replace(
          oldImportPattern,
          (match) => {
            // Extract all named imports
            const importsMatch = match.match(/\{([^}]+)\}/);
            if (!importsMatch) return match;
            
            let imports = importsMatch[1].trim();
            
            // Replace component name if it changed
            if (nameChanged) {
              imports = imports.replace(new RegExp(`\\b${oldComp}\\b`, 'g'), newName);
            }
            
            return `import { ${imports} } from '${importPath}'`;
          }
        );
        
        // Track replacement
        componentsReplaced[oldComp] = (componentsReplaced[oldComp] || 0) + 1;
        result.componentsReplaced.push(oldComp);
        hasChanges = true;
        
        // Step 2: Replace component tags IF name changed (like Button → V28Button)
        if (nameChanged) {
          const openTagRegex = new RegExp(`<${oldComp}\\b`, 'g');
          const closeTagRegex = new RegExp(`<\\/${oldComp}>`, 'g');
          
          content = content.replace(openTagRegex, `<${newName}`);
          content = content.replace(closeTagRegex, `</${newName}>`);
        }
      }
    }
    
    // Step 3: Map Button variants
    if (result.componentsReplaced.includes('Button')) {
      for (const [oldVariant, newVariant] of Object.entries(BUTTON_VARIANT_MAP)) {
        if (oldVariant === newVariant) continue;
        
        const variantRegex = new RegExp(`variant=["']${oldVariant}["']`, 'g');
        content = content.replace(variantRegex, `variant="${newVariant}"`);
      }
    }
    
    // Step 4: Write file if changes
    if (hasChanges && content !== originalContent) {
      writeFileSync(filePath, content, 'utf-8');
      result.success = true;
      console.log(`  ✅ Migrated: ${result.componentsReplaced.join(', ')}`);
    } else if (!hasChanges) {
      result.errors?.push('No changes needed');
    }
    
  } catch (error) {
    result.errors?.push(error instanceof Error ? error.message : 'Unknown error');
    console.error(`  ❌ Error: ${result.errors?.join(', ')}`);
  }
  
  return result;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 MISSION II - PHASE 2A: SIMPLE COMPONENT MIGRATION');
  console.log('=====================================================');
  console.log(`Target Components: ${SIMPLE_COMPONENTS.join(', ')}`);
  console.log('');
  
  // Find all TSX files
  const files = findTSXFiles('src', [
    'node_modules',
    '.git',
    'dist',
    'build',
    'src/lib/components', // Exclude V28 components themselves
  ]);
  
  console.log(`📁 Found ${files.length} TSX/TS files\n`);
  
  // Migrate each file
  for (const file of files) {
    const result = migrateFile(file);
    
    if (result.success || result.errors?.length) {
      results.push(result);
    }
  }
  
  // Generate Report
  const report: MigrationReport = {
    totalFiles: results.length,
    successfulMigrations: results.filter(r => r.success).length,
    failedMigrations: results.filter(r => !r.success).length,
    componentsReplaced,
    results,
    timestamp: new Date().toISOString(),
  };
  
  // Write report
  writeFileSync(
    'logs/migration-report-phase2a.json',
    JSON.stringify(report, null, 2),
    'utf-8'
  );
  
  // Console output
  console.log('\n\n📊 PHASE 2A MIGRATION REPORT');
  console.log('============================\n');
  
  console.log(`✅ Successfully migrated: ${report.successfulMigrations} files`);
  console.log(`⏭️  Skipped/Failed: ${report.failedMigrations} files`);
  console.log(`📦 Total processed: ${report.totalFiles} files`);
  console.log('');
  
  console.log('🎨 Component Replacements:');
  Object.entries(componentsReplaced).forEach(([comp, count]) => {
    const config = COMPONENT_MAP[comp];
    console.log(`   ${comp} → ${config.newName} (${config.importPath}): ${count} instances`);
  });
  
  // Success files (sample)
  if (report.successfulMigrations > 0) {
    console.log('\n\n✅ SUCCESSFULLY MIGRATED FILES (Sample):');
    results
      .filter(r => r.success)
      .slice(0, 10)
      .forEach(r => {
        console.log(`   ${r.file} → [${r.componentsReplaced.join(', ')}]`);
      });
    
    if (report.successfulMigrations > 10) {
      console.log(`   ... and ${report.successfulMigrations - 10} more files`);
    }
  }
  
  // Failed files
  if (report.failedMigrations > 0) {
    console.log('\n\n⏭️  SKIPPED FILES (Reason):');
    results
      .filter(r => !r.success)
      .slice(0, 10)
      .forEach(r => {
        console.log(`   ${r.file}: ${r.errors?.join(', ')}`);
      });
  }
  
  console.log('\n\n🎉 PHASE 2A COMPLETE!');
  console.log('=====================');
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Review: logs/migration-report-phase2a.json`);
  console.log(`   2. Test: npm run type-check`);
  console.log(`   3. Build: npm run build`);
  console.log(`   4. Verify: grep -r "from '@/components/ui/button'" src/`);
  console.log(`   5. Commit: git add . && git commit -m "feat: Phase 2A - Simple Component Migration"`);
  console.log('');
  console.log(`📊 Report saved: logs/migration-report-phase2a.json`);
  console.log(`🔙 Backups: *.backup files created (rollback possible)`);
}

main().catch(console.error);
