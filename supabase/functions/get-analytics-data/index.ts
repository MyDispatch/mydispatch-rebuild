import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { timeframe = "7d" } = await req.json();

    // Berechne Zeitfenster
    const daysBack = timeframe === "24h" ? 1 : timeframe === "7d" ? 7 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Aggregiere Analytics
    const { count: newCompanies } = await supabase
      .from("companies")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString());

    const { count: newBookings } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startDate.toISOString());

    const { data: revenueData } = await supabase
      .from("bookings")
      .select("price")
      .gte("created_at", startDate.toISOString())
      .eq("payment_status", "paid");

    const totalRevenue = revenueData?.reduce((sum, b) => sum + (b.price || 0), 0) || 0;

    return new Response(
      JSON.stringify({
        success: true,
        analytics: {
          timeframe,
          new_companies: newCompanies || 0,
          new_bookings: newBookings || 0,
          total_revenue: totalRevenue,
          period_start: startDate.toISOString(),
          period_end: new Date().toISOString(),
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
