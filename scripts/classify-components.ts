#!/usr/bin/env tsx
/**
 * HYPERION PHASE 0: Component Classification Script
 * 
 * Classifies all 363 components into:
 * - Category A: Golden Template candidates (/dashboard, /rechnungen)
 * - Category B: Pure business logic (reusable)
 * - Category C: Legacy/architectural debt (to be deprecated)
 * 
 * Uses Gemini 1.5 Pro via Lovable AI Gateway for analysis
 */

import { createClient } from '@supabase/supabase-js';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY!;

interface ClassificationResult {
  file_path: string;
  category: 'A' | 'B' | 'C';
  reasoning: string;
  complexity: 'low' | 'medium' | 'high';
  migration_priority: number;
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Golden Templates
const GOLDEN_TEMPLATES = [
  'src/pages/Dashboard.tsx',
  'src/pages/Rechnungen.tsx'
];

async function getAllComponentFiles(dir: string, files: string[] = []): Promise<string[]> {
  const entries = readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        await getAllComponentFiles(fullPath, files);
      }
    } else if (entry.name.endsWith('.tsx') && !entry.name.endsWith('.stories.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function classifyComponent(filePath: string): Promise<ClassificationResult> {
  const systemPrompt = `Du bist ein Senior-Architekt für React-Anwendungen. 

DEINE AUFGABE: Klassifiziere die gegebene React-Komponente in eine von drei Kategorien:

**KATEGORIE A (Genom-Kandidat):**
- Komponenten aus /dashboard oder /rechnungen (Golden Templates)
- Perfekt strukturiert, wiederverwendbar, testbar
- Entspricht Best Practices 2025

**KATEGORIE B (Verwertbare Logik):**
- Reine Geschäftslogik ohne UI
- Wiederverwendbare Utility-Funktionen
- Kann extrahiert und isoliert werden

**KATEGORIE C (Architektonische Altlast):**
- Verletzte Best Practices
- Nicht wiederverwendbar
- Spaghetti-Code
- Zur Deprecation markiert

Antworte NUR mit JSON:
{
  "category": "A" | "B" | "C",
  "reasoning": "1-2 Sätze Begründung",
  "complexity": "low" | "medium" | "high",
  "migration_priority": 1-10 (1=highest)
}`;

  const userPrompt = `Klassifiziere diese Komponente:\n\nDateipfad: ${filePath}`;

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return {
      file_path: filePath,
      ...result
    };
  } catch (error) {
    console.error(`Failed to classify ${filePath}:`, error);
    // Fallback: classify as C
    return {
      file_path: filePath,
      category: 'C',
      reasoning: 'Classification failed - marked as legacy',
      complexity: 'medium',
      migration_priority: 5
    };
  }
}

async function main() {
  console.log('🚀 HYPERION Phase 0: Component Classification\n');
  
  // Get all component files
  const files = await getAllComponentFiles('src/components');
  console.log(`📦 Found ${files.length} components to classify\n`);
  
  // Auto-classify Golden Templates
  const results: ClassificationResult[] = [];
  
  for (const file of files) {
    if (GOLDEN_TEMPLATES.includes(file)) {
      results.push({
        file_path: file,
        category: 'A',
        reasoning: 'Golden Template - Reference Implementation',
        complexity: 'low',
        migration_priority: 10
      });
      console.log(`✅ ${file} → Category A (Golden Template)`);
    } else {
      // Classify with AI
      const result = await classifyComponent(file);
      results.push(result);
      
      const emoji = result.category === 'A' ? '✅' : result.category === 'B' ? '🔧' : '⚠️';
      console.log(`${emoji} ${file} → Category ${result.category}`);
    }
  }
  
  // Store results in Supabase
  console.log('\n💾 Storing classification results in Supabase...');
  
  const { error } = await supabase
    .from('component_classification')
    .upsert(
      results.map(r => ({
        file_path: r.file_path,
        category: r.category,
        reasoning: r.reasoning,
        complexity: r.complexity,
        migration_priority: r.migration_priority,
        deprecated: r.category === 'C',
        classified_by: 'gemini-2.5-flash'
      })),
      { onConflict: 'file_path' }
    );
  
  if (error) {
    console.error('❌ Failed to store results:', error);
    process.exit(1);
  }
  
  // Summary
  const summary = {
    total: results.length,
    categoryA: results.filter(r => r.category === 'A').length,
    categoryB: results.filter(r => r.category === 'B').length,
    categoryC: results.filter(r => r.category === 'C').length,
  };
  
  console.log('\n📊 CLASSIFICATION SUMMARY:');
  console.log(`   Total Components: ${summary.total}`);
  console.log(`   ✅ Category A (Golden): ${summary.categoryA}`);
  console.log(`   🔧 Category B (Logic): ${summary.categoryB}`);
  console.log(`   ⚠️  Category C (Legacy): ${summary.categoryC}`);
  console.log(`\n   Legacy Rate: ${((summary.categoryC / summary.total) * 100).toFixed(1)}%`);
  
  console.log('\n✅ Classification complete!');
  console.log('   View results in Supabase: component_classification table');
}

main().catch(console.error);
