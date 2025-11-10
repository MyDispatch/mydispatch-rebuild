/* ==================================================================================
   NEXIFY API - Robust Edge Function Gateway
   ----------------------------------------------------------------------------------
   Ziele:
   - Klare Endpoints (REST-ähnlich über Pfade)
   - Sichere Authentifizierung/Autorisierung (JWT via Authorization Header)
   - Hohe Performance (parallel Queries, kleine Payloads, Caching-Header)
   - Umfassendes Error-Handling & strukturiertes Logging
   - Browser bleibt schlank: reine Server-Funktion, keine Frontend-Abhängigkeiten
   ================================================================================== */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

type Json = Record<string, unknown> | Array<unknown> | string | number | boolean | null;

interface ApiResponse<T extends Json = Json> {
  success: boolean;
  data?: T;
  error?: string;
  requestId?: string;
}

function json<T extends Json>(body: ApiResponse<T>, status = 200, cache = false): Response {
  const headers: Record<string, string> = {
    ...corsHeaders,
    "Content-Type": "application/json",
  };
  if (cache) {
    headers["Cache-Control"] = "public, max-age=30"; // 30s Client-Cache
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function getEnvOrThrow(): { url: string; serviceKey: string } {
  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return { url, serviceKey };
}

async function getUserFromAuthToken(supabaseAdmin: ReturnType<typeof createClient>, req: Request) {
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error) return null;
  return data?.user ?? null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  const url = new URL(req.url);
  const path = url.pathname; // z.B. /functions/v1/nexify-api/wiki/session-init

  // Logging: Eingangsanfrage
  console.log(`[nexify-api] ${requestId} ${req.method} ${path}`);

  let supabaseAdmin;
  try {
    const { url: supabaseUrl, serviceKey } = getEnvOrThrow();
    supabaseAdmin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  } catch (envErr) {
    console.error(`[nexify-api] ${requestId} ENV ERROR:`, envErr);
    return json({ success: false, error: "Server configuration error", requestId }, 500);
  }

  // Route-Mapping
  try {
    // ===== Wiki: Session Init =====
    if (path.endsWith("/wiki/session-init")) {
      // Parallelisierte Queries für bessere Performance
      const [learnings, issues, components, practices, automations] = await Promise.all([
        supabaseAdmin
          .from("ai_learning_patterns")
          .select("id, pattern_type, learnings, confidence, learned_at")
          .order("learned_at", { ascending: false })
          .limit(10),
        supabaseAdmin
          .from("known_issues")
          .select("id, issue_name, severity, solution, prevention_checklist, resolved")
          .eq("severity", "critical")
          .eq("resolved", false),
        supabaseAdmin
          .from("component_registry")
          .select("component_name, file_path, tags")
          .eq("verification_status", "active")
          .order("last_verified", { ascending: false }),
        supabaseAdmin
          .from("best_practices")
          .select("title, content, category, usage_count")
          .order("usage_count", { ascending: false })
          .limit(10),
        supabaseAdmin
          .from("automation_patterns")
          .select("pattern_name, trigger_conditions, execution_command")
          .order("execution_count", { ascending: false })
          .limit(5),
      ]);

      const session_data = {
        recent_learnings: learnings.data ?? [],
        critical_issues: issues.data ?? [],
        active_components: components.data ?? [],
        best_practices: practices.data ?? [],
        automation_patterns: automations.data ?? [],
      };

      console.log(`[nexify-api] ${requestId} ✅ session-init`, {
        learnings: session_data.recent_learnings.length,
        critical_issues: session_data.critical_issues.length,
        components: session_data.active_components.length,
        best_practices: session_data.best_practices.length,
        automations: session_data.automation_patterns.length,
      });

      return json({ success: true, data: { session_data }, requestId }, 200, true);
    }

    // ===== Wiki: Search =====
    if (path.endsWith("/wiki/search")) {
      const q = url.searchParams.get("q") ?? "";
      const limit = Number(url.searchParams.get("limit") ?? "5");
      const categories = (url.searchParams.get("categories") ?? "")
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      let kbQuery = supabaseAdmin
        .from("knowledge_base")
        .select("id, title, content, category, file_path, tags")
        .textSearch("search_vector", q, { type: "websearch", config: "german" })
        .eq("status", "approved")
        .limit(limit);

      if (categories.length > 0) {
        kbQuery = kbQuery.in("category", categories);
      }

      const { data: kbData, error: kbErr } = await kbQuery;
      if (kbErr) {
        console.error(`[nexify-api] ${requestId} kb error:`, kbErr);
        return json({ success: false, error: kbErr.message, requestId }, 500);
      }

      return json({ success: true, data: { knowledge_base: kbData ?? [] }, requestId }, 200, true);
    }

    // ===== Components: Active =====
    if (path.endsWith("/components/active")) {
      const { data, error } = await supabaseAdmin
        .from("component_registry")
        .select("component_name, file_path, tags")
        .eq("verification_status", "active")
        .order("last_verified", { ascending: false })
        .limit(50);
      if (error) return json({ success: false, error: error.message, requestId }, 500);
      return json({ success: true, data: { components: data ?? [] }, requestId }, 200, true);
    }

    // ===== Issues: Critical =====
    if (path.endsWith("/issues/critical")) {
      const { data, error } = await supabaseAdmin
        .from("known_issues")
        .select("id, issue_name, severity, solution, prevention_checklist, resolved")
        .eq("severity", "critical")
        .eq("resolved", false);
      if (error) return json({ success: false, error: error.message, requestId }, 500);
      return json({ success: true, data: { issues: data ?? [] }, requestId }, 200, true);
    }

    // ===== Best Practices: Top =====
    if (path.endsWith("/best-practices/top")) {
      const { data, error } = await supabaseAdmin
        .from("best_practices")
        .select("title, content, category, usage_count")
        .order("usage_count", { ascending: false })
        .limit(10);
      if (error) return json({ success: false, error: error.message, requestId }, 500);
      return json({ success: true, data: { best_practices: data ?? [] }, requestId }, 200, true);
    }

    // ===== Admin: Summary (Auth erforderlich) =====
    if (path.endsWith("/admin/summary")) {
      const user = await getUserFromAuthToken(supabaseAdmin, req);
      const role = (user?.app_metadata as any)?.role ?? "guest";
      if (role !== "admin") {
        return json({ success: false, error: "Unauthorized", requestId }, 401);
      }

      const [kbCount, compCount, issuesCount] = await Promise.all([
        supabaseAdmin.from("knowledge_base").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("component_registry").select("component_name", { count: "exact", head: true }),
        supabaseAdmin.from("known_issues").select("id", { count: "exact", head: true }).eq("resolved", false),
      ]);

      return json({
        success: true,
        data: {
          totals: {
            knowledge_base: kbCount.count ?? 0,
            active_components: compCount.count ?? 0,
            unresolved_issues: issuesCount.count ?? 0,
          },
        },
        requestId,
      }, 200, true);
    }

    // Fallback: 404
    return json({ success: false, error: "Not Found", requestId }, 404);
  } catch (err) {
    console.error(`[nexify-api] ${requestId} ERROR:`, err);
    const message = err instanceof Error ? err.message : String(err);
    return json({ success: false, error: message, requestId }, 500);
  }
});

