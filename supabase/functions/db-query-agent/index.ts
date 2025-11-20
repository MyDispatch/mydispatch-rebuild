/* ==================================================================================
   DB-QUERY-AGENT V18.5.13 - DATA-RAG (SECURE READ-ONLY)
   ================================================================================== 
   Sicherer Zugriff auf Konfigurations-Daten
   - Whitelist für Tabellen
   - SELECT-only Queries
   - Performance-Metrics
   - Security-Logging
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Whitelist der erlaubten Tabellen (V18.5.13 Kern-Anforderung)
const ALLOWED_TABLES = [
  "pricing_tiers",
  "feature_flags",
  "system_config",
  "subscription_plans",
  "companies",
] as const;

type AllowedTable = (typeof ALLOWED_TABLES)[number];

interface QueryRequest {
  table: string;
  columns?: string;
  filters?: Record<string, any>;
  limit?: number;
}

interface QueryResult {
  success: boolean;
  data?: any;
  error?: string;
  metrics: {
    queryTimeMs: number;
    rowCount: number;
    table: string;
  };
}

serve(async (req) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // Auth-Check
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Keine Authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Supabase Client (Service Role für Read-Access)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse Request
    const { table, columns = "*", filters, limit = 100 }: QueryRequest = await req.json();

    // Whitelist-Check
    if (!ALLOWED_TABLES.includes(table as AllowedTable)) {
      console.warn(`[DB-Query-Agent] Unauthorized table access attempt: ${table}`);
      return new Response(
        JSON.stringify({
          error: "Tabelle nicht in Whitelist",
          allowed_tables: ALLOWED_TABLES,
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build Query (SELECT-only!)
    let query = supabase.from(table).select(columns).limit(limit);

    // Apply Filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    // Execute Query
    const { data, error } = await query;

    const queryTime = Date.now() - startTime;

    if (error) {
      console.error("[DB-Query-Agent] Query Error:", error);
      return new Response(
        JSON.stringify({
          error: error.message,
          metrics: { queryTimeMs: queryTime, rowCount: 0, table },
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result: QueryResult = {
      success: true,
      data,
      metrics: {
        queryTimeMs: queryTime,
        rowCount: data?.length || 0,
        table,
      },
    };

    console.log(`[DB-Query-Agent] SUCCESS: ${table} (${data?.length} rows, ${queryTime}ms)`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("[DB-Query-Agent] Critical Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal Server Error",
        metrics: { queryTimeMs: Date.now() - startTime, rowCount: 0, table: "unknown" },
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
