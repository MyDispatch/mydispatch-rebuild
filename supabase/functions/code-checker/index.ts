// ==================================================================================
// CODE-CHECKER EDGE FUNCTION V1.0 - Claude 4.5 Integration
// ==================================================================================
// 🚨 KRITISCH: Nutzt Claude Sonnet 4.5 exklusiv für Code/DB-Reviews
// Keine anderen Modelle! API-Key: ANTHROPIC_API_KEY (CLAUDE_4_5_KEY ist deprecated)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckRequest {
  reportType: 'code' | 'database' | 'git' | 'full';
  code?: string;           // Code-Snippet für Review
  files?: string[];        // File-Paths für Review
  dbQuery?: string;        // DB-Query für Analyse
  context?: string;        // Zusätzlicher Kontext
}

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

serve(async (req) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth Check
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Supabase Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // User/Company Validation
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Invalid auth token");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("user_id", user.id)
      .single();

    if (!profile?.company_id) {
      throw new Error("No company found for user");
    }

    // Parse Request
    const { reportType, code, files, dbQuery, context }: CheckRequest = await req.json();

    // Claude API Key (ANTHROPIC_API_KEY ist der richtige Name!)
    const CLAUDE_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!CLAUDE_KEY) {
      throw new Error("ANTHROPIC_API_KEY nicht konfiguriert");
    }

    // Create pending report
    const { data: report, error: reportError } = await supabase
      .from("checker_reports")
      .insert({
        company_id: profile.company_id,
        report_type: reportType,
        status: 'pending',
        source_type: 'manual',
        source_metadata: {
          user_id: user.id,
          timestamp: new Date().toISOString(),
          report_type: reportType
        }
      })
      .select()
      .single();

    if (reportError || !report) {
      throw new Error(`Failed to create report: ${reportError?.message}`);
    }

    console.log(`[CODE-CHECKER] Created report ${report.id} for company ${profile.company_id}`);

    // Build Claude Prompt (Strukturiert für JSON-Output)
    const systemPrompt = `Du bist ein Senior Code-Review & DB-Analyse Expert.
Du analysierst Code/Datenbanken und gibst strukturierte Reports zurück.

WICHTIG: Deine Antwort MUSS IMMER valides JSON sein mit diesem Format:
{
  "issues": [
    {
      "type": "bug" | "style" | "security" | "performance" | "db_integrity",
      "severity": "low" | "medium" | "high" | "critical",
      "file": "path/to/file.ts",
      "line": 123,
      "description": "Klare Beschreibung des Problems",
      "fix": "Konkrete Lösung"
    }
  ],
  "fixes": [
    {
      "issue_id": 0,
      "suggested_code": "...",
      "confidence": 0.95
    }
  ],
  "summary": "Zusammenfassung der Analyse (max 200 Wörter)"
}

Bei fehlerfreiem Code: {"issues": [], "fixes": [], "summary": "Keine Probleme gefunden."}`;

    let userPrompt = '';
    
    if (reportType === 'code') {
      userPrompt = `**CODE REVIEW AUFTRAG**

Prüfe folgenden Code auf:
- Bugs (Logikfehler, Race Conditions, etc.)
- Style-Violations (z.B. fehlende Token-Usage, inline-styles)
- Security-Issues (SQL Injection, XSS, etc.)
- Performance-Probleme

${code ? `\n\nCode:\n\`\`\`typescript\n${code}\n\`\`\`` : ''}
${files ? `\n\nFiles: ${files.join(', ')}` : ''}
${context ? `\n\nKontext: ${context}` : ''}

Antwort als JSON.`;
    } else if (reportType === 'database') {
      userPrompt = `**DATABASE ANALYSE AUFTRAG**

Prüfe folgende DB-Query/Schema auf:
- Missing Indexes
- N+1 Queries
- Fehlende Foreign Keys
- RLS Policy Gaps

${dbQuery ? `\n\nQuery:\n\`\`\`sql\n${dbQuery}\n\`\`\`` : ''}
${context ? `\n\nKontext: ${context}` : ''}

Antwort als JSON.`;
    } else if (reportType === 'git') {
      userPrompt = `**GIT REVIEW AUFTRAG**

Prüfe Git-Commits/Files auf:
- Unstaged Breaking Changes
- Fehlende Tests
- Console.logs/Debug-Code

${context ? `\n\nKontext: ${context}` : ''}

Antwort als JSON.`;
    } else {
      userPrompt = `**FULL SYSTEM CHECK**

Führe umfassenden Check durch (Code + DB + Git).

${context ? `\n\nKontext: ${context}` : ''}

Antwort als JSON.`;
    }

    // Call Claude Sonnet 4.5
    console.log(`[CODE-CHECKER] Calling Claude Sonnet 4.5 for report ${report.id}`);
    
    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": CLAUDE_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5", // 🚨 EINZIGES erlaubtes Modell
        max_tokens: 4096,
        temperature: 0.3, // Niedriger für präzise Analysen
        messages: [
          { role: "user", content: systemPrompt + "\n\n" + userPrompt }
        ] as ClaudeMessage[],
      }),
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error(`[CODE-CHECKER] Claude API Error (${claudeResponse.status}):`, errorText);
      
      // Update report to error
      await supabase
        .from("checker_reports")
        .update({
          status: 'error',
          summary: `Claude API Error: ${claudeResponse.status} - ${errorText.slice(0, 500)}`
        })
        .eq("id", report.id);
      
      throw new Error(`Claude API failed: ${claudeResponse.status}`);
    }

    const claudeData = await claudeResponse.json();
    const claudeText = claudeData.content?.[0]?.text || '';
    const tokensUsed = claudeData.usage?.total_tokens || 0;

    console.log(`[CODE-CHECKER] Claude response received, tokens: ${tokensUsed}`);

    // Parse Claude JSON
    let parsedResult;
    try {
      // Extrahiere JSON aus Markdown-Code-Block falls vorhanden
      const jsonMatch = claudeText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : claudeText;
      parsedResult = JSON.parse(jsonString);
    } catch (e) {
      console.error(`[CODE-CHECKER] Failed to parse Claude JSON:`, claudeText);
      
      // Fallback: Plain-Text Summary
      await supabase
        .from("checker_reports")
        .update({
          status: 'warning',
          summary: `Claude Response (nicht als JSON parsebar):\n\n${claudeText.slice(0, 2000)}`,
          tokens_used: tokensUsed
        })
        .eq("id", report.id);
      
      return new Response(JSON.stringify({ 
        success: false, 
        reportId: report.id,
        message: "Claude antwortete nicht im JSON-Format"
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update Report mit Results
    const { error: updateError } = await supabase
      .from("checker_reports")
      .update({
        status: parsedResult.issues?.length > 0 ? 'warning' : 'success',
        issues: parsedResult.issues || [],
        fixes: parsedResult.fixes || [],
        summary: parsedResult.summary || 'Keine Zusammenfassung verfügbar',
        tokens_used: tokensUsed,
        model_used: 'claude-sonnet-4-5'
      })
      .eq("id", report.id);

    if (updateError) {
      console.error(`[CODE-CHECKER] Failed to update report:`, updateError);
      throw updateError;
    }

    console.log(`[CODE-CHECKER] Report ${report.id} completed: ${parsedResult.issues?.length || 0} issues found`);

    // Return Success
    return new Response(JSON.stringify({
      success: true,
      reportId: report.id,
      issuesFound: parsedResult.issues?.length || 0,
      summary: parsedResult.summary,
      data: parsedResult
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[CODE-CHECKER] Error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});