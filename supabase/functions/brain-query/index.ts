import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BrainQueryRequest {
  query: string;
  categories?: string[];
  limit?: number;
  include_code_snippets?: boolean;
  include_best_practices?: boolean;
}

interface SessionData {
  recent_learnings: Array<{
    id: string;
    pattern_type: string;
    learnings: string;
    confidence: number;
    learned_at: string;
  }>;
  critical_issues: Array<{
    id: string;
    issue_name: string;
    severity: string;
    solution: string;
    prevention_checklist: any;
    resolved: boolean;
  }>;
  active_components: Array<{
    component_name: string;
    file_path: string;
    tags: string[];
  }>;
  best_practices: Array<{
    title: string;
    content: any;
    category: string;
    usage_count: number;
  }>;
  automation_patterns: Array<{
    pattern_name: string;
    trigger_conditions: any;
    execution_command: string;
  }>;
}

interface SearchResult {
  session_data?: SessionData;
  knowledge_base: Array<{
    id: string;
    title: string;
    content: string;
    category: string;
    file_path: string;
    relevance: number;
  }>;
  code_snippets?: Array<{
    id: string;
    title: string;
    code: string;
    language: string;
    use_case: string;
  }>;
  best_practices?: Array<{
    id: string;
    title: string;
    domain: string;
    do_example: string;
    dont_example: string;
  }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      query,
      categories,
      limit = 5,
      include_code_snippets = true,
      include_best_practices = true,
    }: BrainQueryRequest = await req.json();

    console.log("[brain-query] Query:", query, "Categories:", categories);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const result: SearchResult = {
      knowledge_base: [],
      code_snippets: [],
      best_practices: [],
    };

    // SESSION INIT MODE (Special handling for Wiki load)
    if (query === "session_init") {
      console.log("[brain-query] 🧠 SESSION INIT MODE - Loading Wiki Data...");

      try {
        // 1. Recent Learnings (letzte 10)
        const { data: learnings, error: learningsError } = await supabase
          .from("ai_learning_patterns")
          .select("id, pattern_type, learnings, confidence, learned_at")
          .order("learned_at", { ascending: false })
          .limit(10);

        if (learningsError) {
          console.error("[brain-query] Learnings Error:", learningsError);
        }

        // 2. Critical Issues (severity=critical, resolved=false)
        const { data: issues, error: issuesError } = await supabase
          .from("known_issues")
          .select("id, issue_name, severity, solution, prevention_checklist, resolved")
          .eq("severity", "critical")
          .eq("resolved", false);

        if (issuesError) {
          console.error("[brain-query] Critical Issues Error:", issuesError);
        }

        // 3. Active Components (verification_status=active)
        const { data: components, error: componentsError } = await supabase
          .from("component_registry")
          .select("component_name, file_path, tags")
          .eq("verification_status", "active")
          .order("last_verified", { ascending: false });

        if (componentsError) {
          console.error("[brain-query] Components Error:", componentsError);
        }

        // 4. Best Practices (top 10 usage_count)
        const { data: practices, error: practicesError } = await supabase
          .from("best_practices")
          .select("title, content, category, usage_count")
          .order("usage_count", { ascending: false })
          .limit(10);

        if (practicesError) {
          console.error("[brain-query] Best Practices Error:", practicesError);
        }

        // 5. Automation Patterns
        const { data: automations, error: automationsError } = await supabase
          .from("automation_patterns")
          .select("pattern_name, trigger_conditions, execution_command")
          .order("execution_count", { ascending: false })
          .limit(5);

        if (automationsError) {
          console.error("[brain-query] Automation Patterns Error:", automationsError);
        }

        // Build session_data
        result.session_data = {
          recent_learnings: learnings || [],
          critical_issues: issues || [],
          active_components: components || [],
          best_practices: practices || [],
          automation_patterns: automations || [],
        };

        console.log("[brain-query] ✅ Session Init Complete:", {
          learnings: result.session_data.recent_learnings.length,
          critical_issues: result.session_data.critical_issues.length,
          components: result.session_data.active_components.length,
          best_practices: result.session_data.best_practices.length,
          automation_patterns: result.session_data.automation_patterns.length,
        });

        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } catch (sessionError) {
        console.error("[brain-query] Session Init Error:", sessionError);
        // Fallback: Return empty session_data
        result.session_data = {
          recent_learnings: [],
          critical_issues: [],
          active_components: [],
          best_practices: [],
          automation_patterns: [],
        };
      }
    }

    // NORMAL SEARCH MODE (wenn query != "session_init")
    // 1. Knowledge Base Full-Text Search
    let kbQuery = supabase
      .from("knowledge_base")
      .select("id, title, content, category, file_path, tags")
      .textSearch("search_vector", query, {
        type: "websearch",
        config: "german",
      })
      .eq("status", "approved")
      .limit(limit);

    if (categories && categories.length > 0) {
      kbQuery = kbQuery.in("category", categories);
    }

    const { data: kbData, error: kbError } = await kbQuery;

    if (kbError) {
      console.error("[brain-query] Knowledge Base Error:", kbError);
    } else if (kbData) {
      // Calculate relevance score
      result.knowledge_base = kbData
        .map((item) => ({
          ...item,
          relevance: calculateRelevance(query, item),
        }))
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, limit);

      console.log("[brain-query] Found", result.knowledge_base.length, "knowledge base entries");
    }

    // 2. Code Snippets Search (optional)
    if (include_code_snippets) {
      const { data: snippetsData, error: snippetsError } = await supabase
        .from("code_snippets")
        .select("id, snippet_name, code, language, category, use_case, tags")
        .or(`snippet_name.ilike.%${query}%, description.ilike.%${query}%, tags.cs.{${query}}`)
        .limit(3);

      if (snippetsError) {
        console.error("[brain-query] Code Snippets Error:", snippetsError);
      } else if (snippetsData) {
        result.code_snippets = snippetsData;
        console.log("[brain-query] Found", result.code_snippets.length, "code snippets");
      }
    }

    // 3. Best Practices Search (optional)
    if (include_best_practices) {
      const { data: practicesData, error: practicesError } = await supabase
        .from("best_practices")
        .select("id, title, category, description, do_example, dont_example, reference_doc")
        .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
        .limit(3);

      if (practicesError) {
        console.error("[brain-query] Best Practices Error:", practicesError);
      } else if (practicesData) {
        result.best_practices = practicesData;
        console.log("[brain-query] Found", result.best_practices.length, "best practices");
      }
    }

    // Log search for analytics
    await supabase.from("brain_query_logs").insert({
      query,
      categories,
      results_count: result.knowledge_base.length,
      timestamp: new Date().toISOString(),
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[brain-query] Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

/**
 * Calculate relevance score for search result
 *
 * Scoring:
 * - Title exact match: +0.5
 * - Title partial match: +0.3
 * - Content match: +0.2
 * - Tags match: +0.2
 * - Category match: +0.1
 */
function calculateRelevance(query: string, doc: any): number {
  const queryLower = query.toLowerCase();
  let score = 0;

  // Title match
  if (doc.title.toLowerCase() === queryLower) {
    score += 0.5;
  } else if (doc.title.toLowerCase().includes(queryLower)) {
    score += 0.3;
  }

  // Content match (first 500 chars for performance)
  if (doc.content.substring(0, 500).toLowerCase().includes(queryLower)) {
    score += 0.2;
  }

  // Tags match
  if (doc.tags?.some((tag: string) => tag.toLowerCase().includes(queryLower))) {
    score += 0.2;
  }

  // Category match
  if (doc.category?.toLowerCase().includes(queryLower)) {
    score += 0.1;
  }

  return Math.min(score, 1.0); // Max 1.0
}
