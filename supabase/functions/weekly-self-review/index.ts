import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WeeklyReviewRequest {
  review_period?: "last_7_days" | "last_14_days";
  focus_areas?: string[];
}

interface KnowledgeGap {
  area: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  occurrences: number;
}

interface ImprovementAction {
  action: string;
  priority: "low" | "medium" | "high" | "critical";
  estimated_impact: string;
  estimated_effort: string;
}

interface ToolSpec {
  name: string;
  type: "edge_function" | "hook" | "component" | "utility";
  purpose: string;
  trigger_reason: string;
  occurrences: number;
}

interface WeeklyReviewResponse {
  success: boolean;
  review_date: string;
  review_period: string;
  identified_gaps: KnowledgeGap[];
  improvement_plan: ImprovementAction[];
  new_tools_to_create: ToolSpec[];
  summary: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const {
      review_period = "last_7_days",
      focus_areas = [
        "hallucination_incidents",
        "knowledge_gaps",
        "pattern_opportunities",
        "tool_creation_candidates",
      ],
    }: WeeklyReviewRequest = await req.json().catch(() => ({}));

    console.log("🔍 Weekly Self-Review Started:", { review_period, focus_areas });

    const interval = review_period === "last_7_days" ? "7 days" : "14 days";

    const identified_gaps: KnowledgeGap[] = [];
    const improvement_plan: ImprovementAction[] = [];
    const new_tools_to_create: ToolSpec[] = [];

    // 1. Analyze Hallucination Incidents
    if (focus_areas.includes("hallucination_incidents")) {
      const { data: hallucinations } = await supabase
        .from("known_issues")
        .select("*")
        .eq("issue_type", "hallucinated_function")
        .gte("last_occurrence", `now() - interval '${interval}'`)
        .order("occurrences", { ascending: false });

      if (hallucinations && hallucinations.length > 0) {
        identified_gaps.push({
          area: "Hallucination Detection",
          severity: "critical",
          description: `${hallucinations.length} hallucination incidents detected in ${review_period}`,
          occurrences: hallucinations.reduce((sum, h) => sum + (h.occurrences || 0), 0),
        });

        improvement_plan.push({
          action: "Strengthen Function Existence Validation",
          priority: "critical",
          estimated_impact: "Reduce hallucinations by 90%",
          estimated_effort: "2-3 hours",
        });

        // Suggest auto-validator tool
        new_tools_to_create.push({
          name: "auto-function-validator",
          type: "edge_function",
          purpose: "Automatically validate function existence before usage",
          trigger_reason: `Repeated hallucination incidents (${hallucinations.length} times)`,
          occurrences: hallucinations.length,
        });
      }
    }

    // 2. Identify Knowledge Gaps
    if (focus_areas.includes("knowledge_gaps")) {
      const { data: actions } = await supabase
        .from("ai_actions_log")
        .select("*")
        .eq("success", false)
        .gte("created_at", `now() - interval '${interval}'`)
        .order("created_at", { ascending: false })
        .limit(10);

      if (actions && actions.length > 0) {
        const commonErrors = new Map<string, number>();
        actions.forEach((action) => {
          const errorType = action.error_message?.split(":")[0] || "Unknown";
          commonErrors.set(errorType, (commonErrors.get(errorType) || 0) + 1);
        });

        for (const [error, count] of commonErrors.entries()) {
          if (count > 2) {
            identified_gaps.push({
              area: "Knowledge Gap",
              severity: count > 5 ? "high" : "medium",
              description: `Repeated error: "${error}" (${count}x)`,
              occurrences: count,
            });
          }
        }
      }
    }

    // 3. Analyze Pattern Opportunities
    if (focus_areas.includes("pattern_opportunities")) {
      const { data: actions } = await supabase
        .from("ai_actions_log")
        .select("action_type, metadata")
        .gte("created_at", `now() - interval '${interval}'`);

      if (actions && actions.length > 0) {
        const actionCounts = new Map<string, number>();
        actions.forEach((action) => {
          actionCounts.set(action.action_type, (actionCounts.get(action.action_type) || 0) + 1);
        });

        for (const [action_type, count] of actionCounts.entries()) {
          if (count > 5) {
            improvement_plan.push({
              action: `Create Automation Pattern for "${action_type}"`,
              priority: count > 10 ? "high" : "medium",
              estimated_impact: `Reduce manual effort by ${Math.round(count * 0.8)} actions`,
              estimated_effort: "1-2 hours",
            });
          }
        }
      }
    }

    // 4. Tool Creation Candidates
    if (focus_areas.includes("tool_creation_candidates")) {
      const { data: recentActions } = await supabase
        .from("ai_actions_log")
        .select("action_type, task_description")
        .gte("created_at", `now() - interval '${interval}'`);

      if (recentActions && recentActions.length > 0) {
        const taskCounts = new Map<string, number>();
        recentActions.forEach((action) => {
          const task = action.task_description?.split(" ").slice(0, 3).join(" ") || "Unknown";
          taskCounts.set(task, (taskCounts.get(task) || 0) + 1);
        });

        for (const [task, count] of taskCounts.entries()) {
          if (count > 3) {
            new_tools_to_create.push({
              name: `auto-${task.toLowerCase().replace(/\s+/g, "-")}`,
              type: "utility",
              purpose: `Automate repeated task: "${task}"`,
              trigger_reason: `Task repeated ${count} times in ${review_period}`,
              occurrences: count,
            });
          }
        }
      }
    }

    // 5. Generate Summary
    const summary = `Weekly Review (${review_period}): ${identified_gaps.length} gaps identified, ${improvement_plan.length} improvements planned, ${new_tools_to_create.length} new tools suggested.`;

    // 6. Log Review to Database
    await supabase.from("ai_actions_log").insert({
      action_type: "weekly_self_review",
      task_description: `Weekly Self-Review: ${review_period}`,
      success: true,
      metadata: {
        identified_gaps: identified_gaps.length,
        improvement_plan: improvement_plan.length,
        new_tools: new_tools_to_create.length,
      },
    });

    console.log("✅ Weekly Review Completed:", summary);

    return new Response(
      JSON.stringify({
        success: true,
        review_date: new Date().toISOString(),
        review_period,
        identified_gaps,
        improvement_plan,
        new_tools_to_create,
        summary,
      } as WeeklyReviewResponse),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Weekly Review Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
