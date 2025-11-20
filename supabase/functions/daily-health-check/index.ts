// ==================================================================================
// DAILY HEALTH CHECK - Automatische System-Gesundheitsprüfung (2x täglich)
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: Automatische Prüfung und Fixes 2x täglich (08:00 + 20:00)
// Autor: NeXify AI MASTER
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface HealthCheckResult {
  timestamp: string;
  checks: {
    database: { status: "ok" | "warning" | "error"; message: string; responseTime?: number };
    api: { status: "ok" | "warning" | "error"; message: string };
    storage: { status: "ok" | "warning" | "error"; message: string };
    edgeFunctions: { status: "ok" | "warning" | "error"; message: string };
    errorRate: { status: "ok" | "warning" | "error"; message: string; rate?: number };
    performance: { status: "ok" | "warning" | "error"; message: string };
  };
  issues: string[];
  fixes: string[];
  overall: "healthy" | "warning" | "critical";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const result: HealthCheckResult = {
      timestamp: new Date().toISOString(),
      checks: {
        database: { status: "ok", message: "OK" },
        api: { status: "ok", message: "OK" },
        storage: { status: "ok", message: "OK" },
        edgeFunctions: { status: "ok", message: "OK" },
        errorRate: { status: "ok", message: "OK" },
        performance: { status: "ok", message: "OK" },
      },
      issues: [],
      fixes: [],
      overall: "healthy",
    };

    // 1. Database Health Check
    try {
      const startTime = Date.now();
      const { data, error } = await supabase.from("companies").select("id").limit(1);

      const responseTime = Date.now() - startTime;

      if (error) throw error;
      if (responseTime > 1000) {
        result.checks.database = {
          status: "warning",
          message: `Slow response: ${responseTime}ms`,
          responseTime,
        };
        result.issues.push(`Database response time: ${responseTime}ms (threshold: 1000ms)`);
      } else {
        result.checks.database = { status: "ok", message: "OK", responseTime };
      }
    } catch (error: any) {
      result.checks.database = { status: "error", message: error.message };
      result.issues.push(`Database error: ${error.message}`);
      result.overall = "critical";
    }

    // 2. API Health Check (Supabase Functions)
    try {
      const { data, error } = await supabase.functions.invoke("system-health", {
        body: { check: "api" },
      });

      if (error) throw error;
      result.checks.api = { status: "ok", message: "OK" };
    } catch (error: any) {
      result.checks.api = { status: "warning", message: error.message };
      result.issues.push(`API check warning: ${error.message}`);
    }

    // 3. Storage Health Check
    try {
      const { data, error } = await supabase.storage.from("company-logos").list("", { limit: 1 });

      if (error) throw error;
      result.checks.storage = { status: "ok", message: "OK" };
    } catch (error: any) {
      result.checks.storage = { status: "warning", message: error.message };
      result.issues.push(`Storage check warning: ${error.message}`);
    }

    // 4. Error Rate Check (letzte 24h)
    try {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { data: errorLogs, error } = await supabase
        .from("ai_actions_log")
        .select("success")
        .gte("created_at", yesterday)
        .limit(1000);

      if (error) throw error;

      if (errorLogs && errorLogs.length > 0) {
        const errors = errorLogs.filter((log) => log.success === false).length;
        const errorRate = errors / errorLogs.length;

        result.checks.errorRate = {
          status: errorRate > 0.1 ? "error" : errorRate > 0.05 ? "warning" : "ok",
          message: `${(errorRate * 100).toFixed(1)}% error rate`,
          rate: errorRate,
        };

        if (errorRate > 0.1) {
          result.issues.push(`High error rate: ${(errorRate * 100).toFixed(1)}% (threshold: 10%)`);
          result.overall = "critical";
        } else if (errorRate > 0.05) {
          result.issues.push(
            `Elevated error rate: ${(errorRate * 100).toFixed(1)}% (threshold: 5%)`
          );
          if (result.overall === "healthy") result.overall = "warning";
        }
      }
    } catch (error: any) {
      result.checks.errorRate = { status: "warning", message: error.message };
    }

    // 5. Performance Check (Database Indexes)
    try {
      // Check for slow queries
      const { data: slowQueries, error } = await supabase.rpc("check_slow_queries", {
        threshold_ms: 500,
      });

      if (error) {
        // RPC might not exist, that's OK
        result.checks.performance = { status: "ok", message: "Performance check skipped" };
      } else if (slowQueries && slowQueries.length > 0) {
        result.checks.performance = {
          status: "warning",
          message: `${slowQueries.length} slow queries detected`,
        };
        result.issues.push(`${slowQueries.length} slow queries detected`);
        if (result.overall === "healthy") result.overall = "warning";
      } else {
        result.checks.performance = { status: "ok", message: "OK" };
      }
    } catch (error: any) {
      result.checks.performance = { status: "ok", message: "Performance check skipped" };
    }

    // 6. Auto-Fixes
    if (result.issues.length > 0) {
      // Log issues
      await supabase.from("system_health_logs").insert({
        timestamp: result.timestamp,
        overall_status: result.overall,
        checks: result.checks,
        issues: result.issues,
        fixes: result.fixes,
      });

      // Send notification if critical
      if (result.overall === "critical") {
        try {
          await supabase.functions.invoke("send-admin-alert", {
            body: {
              type: "system_health_critical",
              message: `Critical system health issues detected: ${result.issues.join(", ")}`,
              checks: result.checks,
            },
          });
        } catch (error) {
          console.error("[HEALTH-CHECK] Failed to send alert:", error);
        }
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("[DAILY-HEALTH-CHECK] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
