import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("📊 Generating Weekly Roadmap Report...");

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Hole completed Tasks der letzten 7 Tage
    const { data: completedTasks, error: completedError } = await supabase
      .from("roadmap_tasks")
      .select("*")
      .eq("status", "completed")
      .gte("completed_at", sevenDaysAgo)
      .order("completed_at", { ascending: false });

    if (completedError) throw completedError;

    // Hole blocked Tasks
    const { data: blockedTasks, error: blockedError } = await supabase
      .from("roadmap_tasks")
      .select("*")
      .eq("status", "blocked");

    if (blockedError) throw blockedError;

    // Berechne Velocity
    const totalHours = (completedTasks || []).reduce(
      (sum, t) => sum + (t.actual_hours || t.estimated_hours || 0),
      0
    );
    const tasksPerDay = ((completedTasks || []).length / 7).toFixed(2);

    // Hole Gesamtanzahl Tasks
    const { count: totalTasks } = await supabase
      .from("roadmap_tasks")
      .select("*", { count: "exact", head: true });

    const { count: completedCount } = await supabase
      .from("roadmap_tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed");

    const completionPercent = totalTasks
      ? Math.round(((completedCount || 0) / totalTasks) * 100)
      : 0;

    // Generiere Report
    const report = {
      report_date: new Date().toISOString(),
      period: "Last 7 Days",
      completion_percent: completionPercent,
      completed_tasks_week: completedTasks?.length || 0,
      total_hours_week: totalHours,
      velocity: `${tasksPerDay} tasks/day`,
      blocked_tasks: blockedTasks?.length || 0,
      top_completed: (completedTasks || []).slice(0, 5).map((t) => ({
        task_id: t.task_id,
        title: t.title,
        category: t.category,
        actual_hours: t.actual_hours || t.estimated_hours,
      })),
      blockers: (blockedTasks || []).map((t) => ({
        task_id: t.task_id,
        title: t.title,
        reason: t.blockers?.reason || "Unknown",
      })),
    };

    console.log("📈 Report generated:", report);

    // Speichere Report in Knowledge-Base
    await supabase.from("knowledge_base").insert({
      category: "roadmap_report",
      title: `Roadmap Report - ${new Date().toLocaleDateString("de-DE")}`,
      content: report,
      tags: ["roadmap", "weekly-report", "velocity", "metrics"],
      source: "automated_report",
      confidence_score: 1.0,
    });

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Weekly Report Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
