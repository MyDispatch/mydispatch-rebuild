/* ==================================================================================
   AI CODE REVIEW - INTELLIGENT GITHUB CI/CD INTEGRATION V18.3.30
   ==================================================================================
   Intelligente Code-Review-Engine mit Claude Sonnet 4.5
   Features:
   - Automatisches Code-Review bei Pull Requests
   - Design-System-Compliance Prüfung (Keine accent, text-white, bg-black)
   - Security-Audit (company_id Filter, Soft-Delete, Input Validation)
   - Performance-Analyse (React Query, Defensive Coding)
   - Mobile-First & Accessibility (Touch-Targets, Responsive)
   - Strukturierte GitHub PR Comments
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const GITHUB_TOKEN = Deno.env.get("GITHUB_Personal_access_tokens_classic");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CodeReviewRequest {
  files: {
    path: string;
    content: string;
    diff?: string;
  }[];
  context?: string;
  prNumber?: number;
  repoOwner?: string;
  repoName?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    const { files, context, prNumber, repoOwner, repoName }: CodeReviewRequest = await req.json();

    // Erstelle umfassenden Review-Prompt für MyDispatch V18.3.30
    const systemPrompt = `Du bist ein Senior Code Reviewer für MyDispatch, ein Premium Flottenmanagement-System.

**DEINE AUFGABE:**
Führe eine umfassende Code-Review durch und prüfe:

1. **Design-System Compliance** (KRITISCH - BLOCKING)
   - ❌ VERBOTEN: accent, text-white, bg-black, text-black (außer in index.css)
   - ✅ PFLICHT: Semantic Tokens (text-foreground, bg-primary, text-muted-foreground)
   - ✅ Touch-Targets ≥ 44px (min-h-[44px])
   - ✅ Mobile-First: Responsive Typography (text-sm sm:text-base md:text-lg)
   - ✅ Responsive Icons (h-4 w-4 sm:h-5 sm:w-5)
   - ✅ Responsive Spacing (p-4 sm:p-6 md:p-8)

2. **Security** (KRITISCH - BLOCKING)
   - ✅ Alle DB-Queries mit company_id Filter (.eq('company_id', ...))
   - ✅ KEINE DELETE Statements (nur Soft-Delete: archived=true)
   - ✅ Input Validation mit Zod
   - ✅ Keine console.log ohne import.meta.env.DEV Guard
   - ✅ Keine hardcoded Secrets

3. **Code Quality** (WICHTIG)
   - ✅ React Query für Data Fetching (useQuery, useMutation)
   - ✅ Error Handler statt console.error (logger.error from @/lib/logger)
   - ✅ Type-Safety (kein any ohne Begründung)
   - ✅ Defensive Coding (try-catch, fallbacks)

4. **Performance** (EMPFOHLEN)
   - ✅ Lazy loading für große Components
   - ✅ Memoization (useMemo, useCallback)
   - ✅ Vermeidung unnötiger Re-Renders

5. **Accessibility** (PFLICHT)
   - ✅ Alt texts für Images
   - ✅ Aria labels für interaktive Elements
   - ✅ Touch targets mindestens 44x44px
   - ✅ Color contrast WCAG AA

**OUTPUT FORMAT:**
Strukturiere dein Review nach SEVERITY:
- ❌ **Critical Issues** (BLOCKING - Merge verhindern)
- ⚠️ **Warnings** (Wichtig - vor Merge fixen)
- ℹ️ **Info** (Verbesserungsvorschläge)
- ✅ **Passed** (Was gut ist)

Für jeden Issue:
- Dateiname & Zeilennummer
- Präzise Problembeschreibung
- Konkrete Fix-Vorschlag

Sei präzise, konstruktiv und priorisiere nach Severity.`;

    const userPrompt = `Review diese Code-Änderungen:

${context ? `**Context:** ${context}\n\n` : ""}

${files
  .map(
    (file) => `
**File:** ${file.path}
${file.diff ? `\n**Diff:**\n\`\`\`diff\n${file.diff}\n\`\`\`\n` : ""}
**Content:**
\`\`\`typescript
${file.content}
\`\`\`
`
  )
  .join("\n---\n")}`;

    // Call Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", // Updated to latest Sonnet 4.5
        max_tokens: 4096,
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
    const reviewContent = result.content[0].text;

    // Parse Review für strukturierte Ausgabe
    const review = {
      summary: reviewContent,
      passed: (reviewContent.match(/✅/g) || []).length,
      warnings: (reviewContent.match(/⚠️/g) || []).length,
      critical: (reviewContent.match(/❌/g) || []).length,
      suggestions: (reviewContent.match(/💡/g) || []).length,
      approved: !(reviewContent.match(/❌/g) || []).length,
    };

    // Optional: Post Review als GitHub Comment
    if (GITHUB_TOKEN && prNumber && repoOwner && repoName) {
      try {
        await fetch(
          `https://api.github.com/repos/${repoOwner}/${repoName}/issues/${prNumber}/comments`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${GITHUB_TOKEN}`,
              "Content-Type": "application/json",
              Accept: "application/vnd.github.v3+json",
            },
            body: JSON.stringify({
              body: `## 🤖 AI Code Review (Claude Sonnet 4.5)\n\n${reviewContent}\n\n---\n*Automated Review powered by Claude Sonnet 4.5 | MyDispatch V18.3.30*`,
            }),
          }
        );
      } catch (err) {
        console.error("Failed to post GitHub comment:", err);
        // Non-blocking - continue anyway
      }
    }

    return new Response(JSON.stringify(review), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Code Review error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        approved: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
