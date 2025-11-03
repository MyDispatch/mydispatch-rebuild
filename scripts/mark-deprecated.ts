#!/usr/bin/env tsx
/* ==================================================================================
   DEPRECATION MARKER SCRIPT
   ==================================================================================
   Marks legacy V26* components as deprecated
   Usage: tsx scripts/mark-deprecated.ts --pattern="V26*"
   ================================================================================== */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const DEPRECATION_COMMENT = `/* ==================================================================================
   ⚠️  DEPRECATED - LEGACY V26 COMPONENT
   ==================================================================================
   This component is deprecated and will be removed in future versions.
   Please use the V28 equivalent or Golden Template components instead.
   
   Migration Guide: docs/V28_MIGRATION_GUIDE.md
   ================================================================================== */

`;

async function markDeprecated(pattern: string) {
  console.log(`🔍 Searching for files matching: ${pattern}`);
  
  const files = await glob(`src/**/${pattern}.tsx`, { ignore: 'node_modules/**' });
  
  console.log(`📋 Found ${files.length} files to mark as deprecated`);
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Skip if already deprecated
    if (content.includes('DEPRECATED')) {
      console.log(`⏭️  Skipping ${file} (already marked)`);
      continue;
    }
    
    // Add deprecation comment at the top
    const newContent = DEPRECATION_COMMENT + content;
    fs.writeFileSync(file, newContent, 'utf-8');
    
    console.log(`✅ Marked as deprecated: ${file}`);
  }
  
  console.log(`\n✅ Deprecation marking complete!`);
  console.log(`📝 ${files.length} files marked as deprecated`);
}

// Parse CLI args
const args = process.argv.slice(2);
const patternArg = args.find(arg => arg.startsWith('--pattern='));
const pattern = patternArg ? patternArg.split('=')[1] : 'V26*';

markDeprecated(pattern);
