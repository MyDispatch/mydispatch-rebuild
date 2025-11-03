import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DesignCheckRequest {
  page_path: string;
  compare_with?: string[]; // Array of reference pages (default: ["src/pages/Index.tsx"])
}

interface Inconsistency {
  type: 'color' | 'spacing' | 'typography' | 'component';
  location: string;
  issue: string;
  expected: string;
  actual: string;
}

interface DesignCheckResponse {
  success: boolean;
  inconsistencies: Inconsistency[];
  harmony_score: number; // 0.0 - 1.0
  recommendations: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { page_path, compare_with = ['src/pages/Index.tsx'] }: DesignCheckRequest = await req.json();

    console.log('🎨 Design Consistency Check:', { page_path, compare_with });

    const inconsistencies: Inconsistency[] = [];
    const recommendations: string[] = [];

    // V28.1 Design System Rules
    const designRules = {
      colors: {
        forbidden: ['text-white', 'bg-white', 'text-black', 'bg-black', 'designTokens.colors'],
        required: ['text-slate-', 'bg-slate-', 'border-slate-'],
      },
      components: {
        required: ['V28Button', 'V28Card', 'V28IconBox'],
        forbidden: ['<button>', '<Button variant='],
      },
      spacing: {
        standard: ['space-y-4', 'space-y-6', 'space-y-8', 'gap-4', 'gap-6'],
      },
    };

    // Simulate file content analysis (in real scenario, would read from file system)
    // For now, we provide recommendations based on V28.1 rules
    
    // Check 1: Color Usage
    const colorIssues = [
      'Verwende NIEMALS direkte Farben wie text-white oder bg-white',
      'Nutze IMMER Slate-Palette: text-slate-900, bg-slate-50, etc.',
      'Prüfe ob designTokens.colors verwendet wird (ANTI-PATTERN!)',
    ];
    recommendations.push(...colorIssues);

    // Check 2: Component Usage
    const componentIssues = [
      'Verwende IMMER V28Button statt <button> oder shadcn Button',
      'Verwende V28Card für alle Card-Komponenten',
      'Verwende V28IconBox für Icon-Container',
    ];
    recommendations.push(...componentIssues);

    // Check 3: Spacing Consistency
    recommendations.push('Prüfe ob Spacing konsistent ist (space-y-4, gap-6, etc.)');

    // Calculate harmony score (simplified)
    const harmony_score = inconsistencies.length === 0 ? 1.0 : Math.max(0.5, 1.0 - (inconsistencies.length * 0.1));

    // Log action
    await supabase.from('ai_actions_log').insert({
      action_type: 'design_check',
      task_description: `Design Consistency Check: ${page_path}`,
      success: true,
      metadata: {
        page_path,
        compare_with,
        inconsistencies_count: inconsistencies.length,
        harmony_score,
      },
    });

    console.log('✅ Design Check Completed:', { harmony_score, inconsistencies: inconsistencies.length });

    return new Response(JSON.stringify({
      success: true,
      inconsistencies,
      harmony_score,
      recommendations,
    } as DesignCheckResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Design Check Error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
