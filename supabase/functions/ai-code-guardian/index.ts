/* ==================================================================================
   AI CODE GUARDIAN V6.1 - NEXIFY WIKI INTEGRATION
   ==================================================================================
   Claude Sonnet 4.5-powered Code Review mit NeXify Knowledge Base
   
   Features:
   - NeXify Wiki Knowledge Base Integration (knowledge_base, known_issues, learnings)
   - Component Registry Validation (kein Hallucination)
   - Design System Compliance (V28Button statt ui/button)
   - Security Audit (RLS, SQL Injection)
   - Auto-Learning (ai_learning_patterns, ai_actions_log)
   - GitHub PR Integration
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CodeGuardianRequest {
  files: Array<{ path: string; content: string; diff?: string }>;
  prNumber?: number;
  context?: string;
}

interface Violation {
  type: "critical" | "warning" | "info";
  message: string;
  file: string;
  line: number | null;
  suggestion: string;
}

interface CodeGuardianResponse {
  approved: boolean;
  violations: Violation[];
  warnings: string[];
  learnings: string[];
  suggestedFixes: string[];
  metrics: {
    totalIssues: number;
    criticalCount: number;
    warningCount: number;
    knowledgeApplied: number;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[ai-code-guardian] Request received");

    // Environment Validation
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const claudeApiKey = Deno.env.get("ANTHROPIC_API_KEY");

    console.log("[ai-code-guardian] Environment check:", {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      hasClaudeApiKey: !!claudeApiKey,
    });

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials missing");
    }

    if (!claudeApiKey) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    const { files, prNumber, context }: CodeGuardianRequest = await req.json();
    console.log(`[ai-code-guardian] Reviewing ${files.length} files for PR #${prNumber || "N/A"}`);

    const supabase = createClient(supabaseUrl, supabaseKey);

    // STEP 1: Load NeXify Knowledge Base
    console.log("[ai-code-guardian] Loading NeXify Knowledge Base...");

    const [knowledgeBase, knownIssues, recentLearnings, componentRegistry] = await Promise.all([
      supabase
        .from("knowledge_base")
        .select("title, content, category, tags")
        .order("importance", { ascending: false })
        .limit(30),
      supabase
        .from("known_issues")
        .select("issue_id, title, description, severity, tags, prevention_checklist")
        .eq("resolved", false)
        .order("severity", { ascending: false })
        .limit(20),
      supabase
        .from("ai_learning_patterns")
        .select("pattern_type, context, learnings, confidence")
        .eq("success", true)
        .order("learned_at", { ascending: false })
        .limit(15),
      supabase
        .from("component_registry")
        .select("component_name, file_path, tags, verification_status")
        .eq("verification_status", "active")
        .limit(100),
    ]);

    console.log("[ai-code-guardian] Knowledge Base loaded:", {
      knowledge: knowledgeBase.data?.length || 0,
      issues: knownIssues.data?.length || 0,
      learnings: recentLearnings.data?.length || 0,
      components: componentRegistry.data?.length || 0,
    });

    // STEP 2: Build Enhanced System Prompt
    const systemPrompt = `Du bist der MyDispatch Code Guardian V6.1 - Ein vollautonomer Code-Reviewer mit Zugriff auf die komplette NeXify Knowledge Base.

# 🗄️ DEINE WISSENSQUELLEN (SOEBEN GELADEN):

## Knowledge Base (${knowledgeBase.data?.length || 0} Einträge):
${JSON.stringify(knowledgeBase.data?.slice(0, 10), null, 2)}

## Known Issues (${knownIssues.data?.length || 0} aktive):
${JSON.stringify(knownIssues.data, null, 2)}

## Recent Learnings (${recentLearnings.data?.length || 0} Patterns):
${JSON.stringify(recentLearnings.data?.slice(0, 5), null, 2)}

## Component Registry (${componentRegistry.data?.length || 0} Components):
${componentRegistry.data?.map((c) => `${c.component_name}: ${c.file_path}`).join("\n")}

# 🚨 KRITISCHE PRÜFUNGEN (MUST REJECT PR):

1. **ui/button DETECTION (HIGHEST PRIORITY)**
   ❌ REJECT SOFORT wenn: \`import { Button } from '@/components/ui/button'\`
   ✅ MUSS SEIN: \`import { V28Button } from '@/components/design-system/V28Button'\`
   
   **Mapping:**
   - Button variant="outline" → V28Button variant="secondary"
   - Button variant="default" → V28Button variant="primary"
   - Button variant="ghost" → V28Button variant="secondary"

2. **Design System Token Compliance**
   ❌ REJECT: text-white, bg-white, text-black, bg-black (außer in index.css)
   ✅ REQUIRE: text-foreground, bg-primary, text-muted-foreground

3. **Component Hallucination Prevention**
   ❌ REJECT: Imports von Components die NICHT in Component Registry existieren
   ✅ VALIDATE: Alle Imports gegen Component Registry

4. **Security**
   ❌ REJECT: Tabellen ohne RLS Policies
   ❌ REJECT: Hardcoded Secrets
   ❌ REJECT: SQL Injection Risks

5. **TypeScript**
   ❌ REJECT: TypeScript Compile Errors
   ❌ REJECT: \`any\` ohne Begründung

# ⚠️ WARNINGS (ALLOW PR, BUT WARN):

1. Fehlende ARIA-Labels
2. Performance Issues (useEffect ohne deps)
3. Console.log in Production Code
4. Fehlende Error Boundaries

# 💡 LEARNINGS TO APPLY:

Nutze \`ai_learning_patterns\` für:
- Pattern-Vorschläge basierend auf früheren Erfolgen
- Best Practice Referenzen
- Wiederverwendbare Code-Snippets

# 📊 OUTPUT FORMAT (STRICT JSON):

{
  "approved": boolean,
  "violations": [
    {
      "type": "critical" | "warning" | "info",
      "message": "Clear description",
      "file": "path/to/file.tsx",
      "line": number | null,
      "suggestion": "How to fix it"
    }
  ],
  "warnings": ["Warning text 1", "Warning text 2"],
  "learnings": ["Applied learning pattern #42: V28Button Migration"],
  "suggestedFixes": [
    "File: src/pages/Master.tsx:21\nReplace: import { Button } from '@/components/ui/button'\nWith: import { V28Button } from '@/components/design-system/V28Button'"
  ],
  "metrics": {
    "totalIssues": number,
    "criticalCount": number,
    "warningCount": number,
    "knowledgeApplied": number
  }
}

**WICHTIG:** Gib NUR valides JSON zurück, KEIN zusätzlicher Text außerhalb!`;

    // STEP 3: Build User Prompt
    const userPrompt = `Review these files from PR #${prNumber || "N/A"}:

${context ? `**Context:** ${context}\n\n` : ""}

${files
  .map(
    (file) => `
**File:** ${file.path}
${file.diff ? `**Diff:**\n\`\`\`diff\n${file.diff}\n\`\`\`\n` : ""}
**Content:**
\`\`\`typescript
${file.content}
\`\`\`
`
  )
  .join("\n---\n")}

**WICHTIG:** Prüfe ZUERST auf ui/button imports - das ist ein AUTO-REJECT!`;

    // STEP 4: Call Claude Sonnet 4.5
    console.log("[ai-code-guardian] Calling Claude Sonnet 4.5...");

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": claudeApiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 8192,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });

    if (!claudeResponse.ok) {
      const error = await claudeResponse.text();
      console.error("[ai-code-guardian] Claude API error:", error);
      throw new Error(`Claude API error: ${claudeResponse.status}`);
    }

    const claudeResult = await claudeResponse.json();
    const reviewText = claudeResult.content[0].text;

    console.log("[ai-code-guardian] Claude response received:", reviewText.substring(0, 200));

    // STEP 5: Parse JSON Response
    let parsedReview: CodeGuardianResponse;

    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = reviewText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in Claude response");
      }

      parsedReview = JSON.parse(jsonMatch[0]);
      console.log("[ai-code-guardian] Review parsed successfully");
    } catch (parseError) {
      console.error("[ai-code-guardian] JSON parsing failed:", parseError);
      console.error("[ai-code-guardian] Raw response:", reviewText);

      // Fallback: Manual parsing
      const hasUiButton = reviewText.toLowerCase().includes("ui/button");
      parsedReview = {
        approved: !hasUiButton,
        violations: hasUiButton
          ? [
              {
                type: "critical",
                message: "ui/button import detected (AUTO-REJECT)",
                file: "unknown",
                line: null,
                suggestion: "Replace with V28Button from design-system",
              },
            ]
          : [],
        warnings: [],
        learnings: [],
        suggestedFixes: [],
        metrics: {
          totalIssues: hasUiButton ? 1 : 0,
          criticalCount: hasUiButton ? 1 : 0,
          warningCount: 0,
          knowledgeApplied: 0,
        },
      };
    }

    // STEP 6: Log Review to ai_actions_log
    console.log("[ai-code-guardian] Logging review to ai_actions_log...");

    await supabase.from("ai_actions_log").insert({
      action_type: "code_review",
      success: parsedReview.approved,
      context: {
        prNumber,
        filesCount: files.length,
        criticalCount: parsedReview.metrics.criticalCount,
        warningCount: parsedReview.metrics.warningCount,
      },
      result: parsedReview,
    });

    // STEP 7: Auto-Learning (wenn erfolgreich)
    if (parsedReview.approved && parsedReview.learnings.length > 0) {
      console.log("[ai-code-guardian] Recording successful patterns...");

      await supabase.from("ai_learning_patterns").insert({
        pattern_type: "code_review_success",
        success: true,
        context: {
          prNumber,
          learningsApplied: parsedReview.learnings,
          filesReviewed: files.map((f) => f.path),
        },
        learnings: `PR #${prNumber} approved. Applied ${parsedReview.learnings.length} learnings successfully.`,
        confidence: 0.95,
      });
    }

    console.log("[ai-code-guardian] Review complete:", {
      approved: parsedReview.approved,
      violations: parsedReview.violations.length,
    });

    return new Response(JSON.stringify(parsedReview), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[ai-code-guardian] Error:", error);

    return new Response(
      JSON.stringify({
        approved: false,
        violations: [
          {
            type: "critical",
            message: `Code Guardian Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            file: "system",
            line: null,
            suggestion: "Check Edge Function logs for details",
          },
        ],
        warnings: [],
        learnings: [],
        suggestedFixes: [],
        metrics: {
          totalIssues: 1,
          criticalCount: 1,
          warningCount: 0,
          knowledgeApplied: 0,
        },
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
