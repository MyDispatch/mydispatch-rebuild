/* ==================================================================================
   AI SELF-REPORT GENERATOR V1.0 - AUTONOMOUS WEEKLY SELF-REVIEW
   ==================================================================================
   Generiert automatisch wöchentliche Self-Reports für NeXify Wiki V6.1
   
   Features:
   - Analysiert ai_learning_patterns (letzte 7 Tage)
   - Analysiert known_issues (resolved vs. unresolved)
   - Analysiert code_snippets (usage patterns)
   - Generiert Metrics & Insights mit Claude Sonnet 4.5
   - Auto-Insert in ai_self_reports Tabelle
   
   Usage:
   - Manuell via Edge Function Call
   - Automatisch via Cron Job (wöchentlich)
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SelfReportMetrics {
  hallucination_rate: number;
  knowledge_check_compliance: number;
  pattern_reuse_rate: number;
  auto_fix_success_rate: number;
  edge_function_error_rate: number;
  button_migration_progress: number;
}

interface SelfReportInsights {
  top_learnings: string[];
  critical_issues_resolved: number;
  critical_issues_pending: number;
  recommendations: string[];
  next_priorities: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("[Self-Report] Starting weekly analysis...");

    // 1. Load Data from Last 7 Days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: learnings } = await supabase
      .from("ai_learning_patterns")
      .select("*")
      .gte("learned_at", sevenDaysAgo.toISOString())
      .order("learned_at", { ascending: false });

    const { data: issues } = await supabase
      .from("known_issues")
      .select("*")
      .order("severity", { ascending: false });

    const { data: snippets } = await supabase
      .from("code_snippets")
      .select("*")
      .gte("last_used", sevenDaysAgo.toISOString())
      .order("usage_count", { ascending: false });

    const { data: actions } = await supabase
      .from("ai_actions_log")
      .select("*")
      .gte("created_at", sevenDaysAgo.toISOString());

    console.log("[Self-Report] Data loaded:", {
      learnings: learnings?.length || 0,
      issues: issues?.length || 0,
      snippets: snippets?.length || 0,
      actions: actions?.length || 0,
    });

    // 2. Calculate Metrics
    const totalActions = actions?.length || 0;
    const successfulActions = actions?.filter((a) => a.success).length || 0;
    const failedActions = totalActions - successfulActions;

    const totalIssues = issues?.length || 0;
    const resolvedIssues = issues?.filter((i) => i.resolved).length || 0;
    const criticalIssues =
      issues?.filter((i) => i.severity === "critical" && !i.resolved).length || 0;

    const metrics: SelfReportMetrics = {
      hallucination_rate: failedActions / (totalActions || 1),
      knowledge_check_compliance:
        learnings?.filter((l) => l.success).length / (learnings?.length || 1) || 1.0,
      pattern_reuse_rate: (snippets?.length || 0) / (totalActions || 1),
      auto_fix_success_rate: successfulActions / (totalActions || 1),
      edge_function_error_rate: failedActions / (totalActions || 1),
      button_migration_progress: 0.03, // 1/34 Pages migriert
    };

    // 3. Generate Insights with Claude Sonnet 4.5
    const systemPrompt = `Du bist ein Senior Meta-Analyst für das NeXify Wiki V6.1 System.

**DEINE AUFGABE:**
Analysiere die wöchentlichen Metriken und Daten und erstelle einen strukturierten Self-Report.

**INPUT DATEN:**
- Learnings: ${learnings?.length || 0} neue Learnings in den letzten 7 Tagen
- Issues: ${totalIssues} total (${resolvedIssues} resolved, ${criticalIssues} critical pending)
- Code Snippets: ${snippets?.length || 0} wiederverwendete Patterns
- Actions: ${totalActions} (${successfulActions} erfolgreiche, ${failedActions} fehlgeschlagen)

**OUTPUT FORMAT (JSON):**
{
  "top_learnings": ["Learning 1", "Learning 2", "Learning 3"],
  "critical_issues_resolved": ${resolvedIssues},
  "critical_issues_pending": ${criticalIssues},
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "next_priorities": ["Priority 1", "Priority 2", "Priority 3"]
}

Sei KONKRET und ACTIONABLE. Fokussiere dich auf die wichtigsten Erkenntnisse der Woche.`;

    const userPrompt = `Analysiere folgende Daten der letzten 7 Tage:

**LEARNINGS:**
${learnings
  ?.slice(0, 10)
  .map((l) => `- ${l.pattern_type}: ${l.learnings} (Success: ${l.success})`)
  .join("\n")}

**CRITICAL ISSUES:**
${
  issues
    ?.filter((i) => !i.resolved && i.severity === "critical")
    .map((i) => `- ${i.title}: ${i.description}`)
    .join("\n") || "Keine kritischen Issues"
}

**TOP PATTERNS:**
${
  snippets
    ?.slice(0, 5)
    .map((s) => `- ${s.snippet_name}: ${s.usage_count} Nutzungen`)
    .join("\n") || "Keine Pattern-Reuse"
}

Erstelle einen Self-Report mit den wichtigsten Insights und Empfehlungen.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Claude API error:", error);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const result = await response.json();
    const insightsJson = result.content[0].text;

    // Parse JSON response
    let insights: SelfReportInsights;
    try {
      const jsonMatch =
        insightsJson.match(/```json\n([\s\S]*?)\n```/) || insightsJson.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[1] || jsonMatch[0] : insightsJson;
      insights = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error("Failed to parse Claude response:", insightsJson);
      throw new Error("Claude response was not valid JSON");
    }

    console.log("[Self-Report] Insights generated:", insights);

    // 4. Insert Self-Report into Database
    const { error: insertError } = await supabase.from("ai_self_reports").insert({
      report_date: new Date().toISOString(),
      metrics: metrics,
      insights: insights,
      data_summary: {
        learnings_count: learnings?.length || 0,
        issues_resolved: resolvedIssues,
        issues_pending: totalIssues - resolvedIssues,
        actions_total: totalActions,
        actions_successful: successfulActions,
      },
    });

    if (insertError) {
      console.error("Failed to insert self-report:", insertError);
      throw insertError;
    }

    console.log("[Self-Report] Report saved to database");

    return new Response(
      JSON.stringify({
        success: true,
        report_date: new Date().toISOString(),
        metrics,
        insights,
        message: "Weekly self-report generated successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("AI Self-Report Generator error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
