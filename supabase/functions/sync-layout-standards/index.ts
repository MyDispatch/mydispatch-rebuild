import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SyncRequest {
  force_refresh?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { force_refresh = false }: SyncRequest = await req.json();

    console.log("📐 Starting Layout Standards Knowledge-Base Sync...");

    // Delete existing entries if force_refresh
    if (force_refresh) {
      await supabase
        .from("knowledge_base")
        .delete()
        .in("category", ["layout_standard", "grid_pattern", "spacing_preset"]);
    }

    // Layout Standards from src/config/layout-standards.ts
    const layoutStandards = [
      {
        category: "grid_pattern",
        title: "HERO-GRID Pattern",
        content: {
          pattern_name: "HERO-GRID",
          mobile: "grid grid-cols-1 gap-6 px-4 py-8",
          tablet: "sm:grid-cols-2 sm:gap-8 sm:px-6 sm:py-12",
          desktop: "lg:grid-cols-3 lg:gap-12 lg:px-8 lg:py-16",
          full: "grid grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 sm:gap-8 sm:px-6 sm:py-12 lg:grid-cols-3 lg:gap-12 lg:px-8 lg:py-16",
          usage: "Landing pages, Hero sections, Feature grids",
        },
        tags: ["layout", "grid", "hero", "responsive"],
        confidence_score: 1.0,
      },
      {
        category: "grid_pattern",
        title: "TARIF-KARTEN-GRID Pattern",
        content: {
          pattern_name: "TARIF-KARTEN-GRID",
          mobile: "grid grid-cols-1 gap-6 px-4",
          tablet: "sm:grid-cols-2 sm:gap-8 sm:px-6",
          desktop: "lg:grid-cols-3 lg:gap-10 lg:px-8",
          full: "grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:gap-8 sm:px-6 lg:grid-cols-3 lg:gap-10 lg:px-8",
          usage: "Pricing pages, Product cards",
        },
        tags: ["layout", "grid", "pricing", "responsive"],
        confidence_score: 1.0,
      },
      {
        category: "grid_pattern",
        title: "DASHBOARD-GRID Pattern",
        content: {
          pattern_name: "DASHBOARD-GRID",
          mobile: "grid grid-cols-1 gap-4 p-4",
          tablet: "sm:grid-cols-2 sm:gap-6 sm:p-6",
          desktop: "lg:grid-cols-4 lg:gap-8 lg:p-8",
          full: "grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:gap-6 sm:p-6 lg:grid-cols-4 lg:gap-8 lg:p-8",
          usage: "Admin dashboards, KPI cards",
        },
        tags: ["layout", "grid", "dashboard", "responsive"],
        confidence_score: 1.0,
      },
      {
        category: "spacing_preset",
        title: "Section Spacing (DIN 5008)",
        content: {
          preset_name: "section",
          classes: "space-y-12 md:space-y-16 lg:space-y-24",
          usage: "Between major page sections",
          standard: "DIN 5008: 2x line spacing between blocks",
        },
        tags: ["spacing", "din-5008", "section"],
        confidence_score: 1.0,
      },
      {
        category: "spacing_preset",
        title: "Card Spacing",
        content: {
          preset_name: "card",
          classes: "space-y-4 md:space-y-6",
          usage: "Within cards and panels",
        },
        tags: ["spacing", "card", "layout"],
        confidence_score: 1.0,
      },
      {
        category: "layout_standard",
        title: "Touch Target Minimum Standards",
        content: {
          minimum: "min-h-[44px] min-w-[44px]",
          comfortable: "min-h-[48px] min-w-[48px]",
          large: "min-h-[56px] min-w-[56px]",
          standard: "Apple HIG: 44x44pt, Material Design: 48x48dp, WCAG 2.5.5: 44x44px",
          applies_to: "All interactive elements: buttons, links, inputs",
        },
        tags: ["touch-target", "accessibility", "wcag", "mobile"],
        confidence_score: 1.0,
      },
      {
        category: "layout_standard",
        title: "Responsive Breakpoints",
        content: {
          mobile: { min: 320, max: 767, touchTarget: "44px" },
          tablet: { min: 768, max: 1023, touchTarget: "48px" },
          desktop: { min: 1024, max: 1920 },
          source: "src/config/layout-standards.ts",
        },
        tags: ["breakpoints", "responsive", "mobile-first"],
        confidence_score: 1.0,
      },
    ];

    const { data, error } = await supabase
      .from("knowledge_base")
      .insert(layoutStandards.map((s) => ({ ...s, source: "docs_sync" })))
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ Synced ${data.length} layout standards`);

    await supabase.from("ai_actions_log").insert({
      action_type: "knowledge_sync",
      task_description: "Sync Layout Standards to Knowledge Base",
      success: true,
      metadata: {
        synced_count: data.length,
        source: "layout-standards.ts",
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        synced: data.length,
        message: "Layout standards synced successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error syncing layout standards:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
