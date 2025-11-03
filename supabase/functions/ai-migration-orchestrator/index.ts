/* ==================================================================================
   AI MIGRATION ORCHESTRATOR V1.0 - AUTONOMOUS CLAUDE SONNET 4.5 ORCHESTRATION
   ==================================================================================
   Autonomous Migration System für ui/button → V28Button Migration
   Features:
   - Analysiert 33 betroffene Pages automatisch
   - Erstellt detaillierten Execution-Plan mit Claude Sonnet 4.5
   - Gibt konkrete File-by-File Anweisungen zurück
   - Kein manueller Eingriff erforderlich
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MigrationTask {
  filePath: string;
  priority: number;
  estimatedComplexity: 'low' | 'medium' | 'high';
  changes: {
    from: string;
    to: string;
    reasoning: string;
  }[];
}

interface MigrationPlan {
  totalFiles: number;
  estimatedDuration: string;
  tasks: MigrationTask[];
  qualityGates: string[];
  risks: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Load known issue: ui/button Migration (Issue #5)
    const { data: knownIssues } = await supabase
      .from('known_issues')
      .select('*')
      .ilike('title', '%button%')
      .eq('resolved', false)
      .limit(1)
      .single();

    if (!knownIssues) {
      return new Response(
        JSON.stringify({ error: 'No ui/button migration issue found in known_issues table' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    const affectedFiles = knownIssues.affected_files || [];

    // Claude Sonnet 4.5 System Prompt für Migration-Orchestration
    const systemPrompt = `Du bist ein Senior Migration-Orchestrator für MyDispatch V18.3.30.

**DEINE AUFGABE:**
Erstelle einen DETAILLIERTEN, FILE-BY-FILE Execution-Plan für die Migration von ui/button → V28Button.

**CONTEXT:**
- 33 Pages nutzen noch \`import { Button } from '@/components/ui/button'\`
- Migration zu \`import { V28Button } from '@/components/design-system/V28Button'\`
- V28Button hat nur 2 Varianten: 'primary' (dunkelblau) und 'secondary' (weiß)
- Alle ui/button Varianten müssen auf diese 2 Varianten gemappt werden

**VARIANT MAPPING:**
- ui/button "default" → V28Button "primary"
- ui/button "outline" → V28Button "secondary"
- ui/button "secondary" → V28Button "secondary"
- ui/button "ghost" → V28Button "secondary"
- ui/button "destructive" → V28Button "primary" (mit red warning in comment)

**OUTPUT FORMAT (JSON):**
{
  "totalFiles": 33,
  "estimatedDuration": "45min",
  "tasks": [
    {
      "filePath": "src/pages/Dashboard.tsx",
      "priority": 1,
      "estimatedComplexity": "low",
      "changes": [
        {
          "from": "import { Button } from '@/components/ui/button'",
          "to": "import { V28Button } from '@/components/design-system/V28Button'",
          "reasoning": "Replace ui/button import with V28Button"
        },
        {
          "from": "<Button variant=\\"outline\\">Cancel</Button>",
          "to": "<V28Button variant=\\"secondary\\">Cancel</V28Button>",
          "reasoning": "Map outline variant to secondary"
        }
      ]
    }
  ],
  "qualityGates": ["All buttons must use V28Button", "No ui/button imports remain"],
  "risks": ["Destructive buttons need manual color review"]
}

Sei EXTREM PRÄZISE und gib für JEDE DER 33 DATEIEN konkrete Änderungen an.`;

    const userPrompt = `Erstelle Migration-Plan für diese ${affectedFiles.length} betroffenen Dateien:

${affectedFiles.map((file: string, idx: number) => `${idx + 1}. ${file}`).join('\n')}

Analysiere JEDE Datei und gib konkrete from/to Änderungen zurück.`;

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 16000, // Erhöht für 33 Files
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const result = await response.json();
    const migrationPlanJson = result.content[0].text;

    // Parse JSON response
    let migrationPlan: MigrationPlan;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = migrationPlanJson.match(/```json\n([\s\S]*?)\n```/) || 
                       migrationPlanJson.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : migrationPlanJson;
      migrationPlan = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', migrationPlanJson);
      throw new Error('Claude response was not valid JSON');
    }

    // Log plan to Supabase
    await supabase.from('ai_actions_log').insert({
      action_type: 'migration_plan_created',
      details: {
        totalFiles: migrationPlan.totalFiles,
        estimatedDuration: migrationPlan.estimatedDuration,
        taskCount: migrationPlan.tasks.length,
      },
      success: true,
    });

    return new Response(
      JSON.stringify({
        success: true,
        plan: migrationPlan,
        nextStep: 'Execute migration tasks sequentially',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('AI Migration Orchestrator error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
