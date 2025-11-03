import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { scan_result, apply_fixes = false } = await req.json();
    
    if (!scan_result || !scan_result.detailed_results) {
      throw new Error("Scan-Ergebnis ist erforderlich");
    }

    const fixes: any[] = [];
    let successfulFixes = 0;
    let failedFixes = 0;

    // Sammle alle auto-fixable Issues
    const autoFixableIssues = scan_result.detailed_results
      .flatMap((result: any) => result.issues)
      .filter((issue: any) => issue.auto_fixable === true);

    console.log(`Found ${autoFixableIssues.length} auto-fixable issues`);

    // Für jedes Issue: Erstelle Fix
    for (const issue of autoFixableIssues) {
      try {
        if (apply_fixes) {
          // TODO: Implementiere GitHub API Integration für automatische Commits
          // Für jetzt: Logge Fixes
          console.log(`Would fix: ${issue.file}`);
          console.log(`Replace: ${issue.code} -> ${issue.replacement}`);
          
          fixes.push({
            file: issue.file,
            issue: issue.issue,
            status: 'success',
            details: `Würde ersetzen: ${issue.code.substring(0, 50)}... mit ${issue.replacement.substring(0, 50)}...`
          });
          successfulFixes++;
        } else {
          fixes.push({
            file: issue.file,
            issue: issue.issue,
            status: 'success',
            details: 'Fix vorbereitet (apply_fixes=false)'
          });
          successfulFixes++;
        }
      } catch (fixError) {
        console.error(`Fix failed for ${issue.file}:`, fixError);
        fixes.push({
          file: issue.file,
          issue: issue.issue,
          status: 'failed',
          details: fixError instanceof Error ? fixError.message : 'Unknown error'
        });
        failedFixes++;
      }
    }

    const result = {
      timestamp: new Date().toISOString(),
      total_fixes: autoFixableIssues.length,
      successful_fixes: successfulFixes,
      failed_fixes: failedFixes,
      fixes: fixes
    };

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Auto-Fix Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
