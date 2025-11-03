/* ==================================================================================
   AUTO-VALIDATE - KRONOS V18.0
   ==================================================================================
   Automatische Validierung generierter Entities
   - TypeScript Syntax Check
   - Import Resolution Validation
   - Basic Quality Metrics
   ================================================================================== */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metrics: {
    lines_of_code: number;
    imports_count: number;
    exports_count: number;
    complexity_score: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { entity_id, code, file_path } = await req.json();

    console.log(`[AUTO-VALIDATE] Validating entity: ${entity_id || file_path}`);

    const errors: string[] = [];
    const warnings: string[] = [];

    // Step 1: Basic TypeScript Syntax Validation
    try {
      // Check for common syntax issues
      if (!code.includes('export')) {
        warnings.push('No exports found - file may not be importable');
      }

      // Check for required imports
      if (file_path?.includes('components') && !code.includes('import')) {
        errors.push('Component file missing imports');
      }

      // Check for React imports (if component)
      if (file_path?.includes('components') && !code.includes('React')) {
        warnings.push('React component may be missing React import');
      }

      // Check for balanced brackets
      const openBraces = (code.match(/{/g) || []).length;
      const closeBraces = (code.match(/}/g) || []).length;
      if (openBraces !== closeBraces) {
        errors.push(`Unbalanced braces: ${openBraces} open, ${closeBraces} close`);
      }

      const openParens = (code.match(/\(/g) || []).length;
      const closeParens = (code.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        errors.push(`Unbalanced parentheses: ${openParens} open, ${closeParens} close`);
      }

    } catch (syntaxError) {
      errors.push(`Syntax check failed: ${syntaxError}`);
    }

    // Step 2: Import Resolution Validation
    const importRegex = /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g;
    const imports: string[] = [];
    let match;

    while ((match = importRegex.exec(code)) !== null) {
      imports.push(match[1]);
    }

    // Check for common import issues
    for (const imp of imports) {
      if (imp.startsWith('@/') && !imp.includes('/')) {
        warnings.push(`Potentially invalid import path: ${imp}`);
      }
      
      // Check for node_modules imports
      if (!imp.startsWith('.') && !imp.startsWith('@/') && !imp.startsWith('react')) {
        warnings.push(`External dependency detected: ${imp}`);
      }
    }

    // Step 3: Quality Metrics
    const lines = code.split('\n');
    const linesOfCode = lines.filter(l => l.trim() && !l.trim().startsWith('//')).length;
    
    const exports = (code.match(/export\s+(default\s+)?(const|function|class|interface|type)/g) || []).length;
    
    // Simple complexity: count conditionals and loops
    const complexityIndicators = [
      ...code.matchAll(/if\s*\(/g),
      ...code.matchAll(/for\s*\(/g),
      ...code.matchAll(/while\s*\(/g),
      ...code.matchAll(/switch\s*\(/g),
      ...code.matchAll(/\?\s*.*:/g), // ternary
    ];
    const complexityScore = Math.min(100, complexityIndicators.length * 5);

    const metrics = {
      lines_of_code: linesOfCode,
      imports_count: imports.length,
      exports_count: exports,
      complexity_score: complexityScore,
    };

    // Step 4: Determine overall validity
    const valid = errors.length === 0;

    const result: ValidationResult = {
      valid,
      errors,
      warnings,
      metrics,
    };

    // Step 5: Log validation result
    if (entity_id) {
      await supabase.from('execution_logs').insert({
        entity_id,
        action: 'validate',
        status: valid ? 'completed' : 'failed',
        details: result,
        error_message: errors.length > 0 ? errors.join('; ') : null,
      });

      // Update entity status if failed
      if (!valid) {
        await supabase
          .from('entities_queue')
          .update({
            status: 'failed',
            error_message: `Validation failed: ${errors.join('; ')}`,
          })
          .eq('id', entity_id);
      }
    }

    console.log(`[AUTO-VALIDATE] Result: ${valid ? 'VALID' : 'INVALID'}, ${errors.length} errors, ${warnings.length} warnings`);

    return new Response(
      JSON.stringify({
        success: true,
        validation: result,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('[AUTO-VALIDATE] Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
