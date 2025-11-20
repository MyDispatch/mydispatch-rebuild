/* ==================================================================================
   Edge Function: export-shift-pdf
   ==================================================================================
   Exportiert Schichtzettel als PDF (Placeholder - Basis-Implementation)
   - Authentifiziert
   - Multi-Tenant
   - Vorbereitung für PDF-Export
   ================================================================================== */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user) throw new Error("Nicht authentifiziert");

    const { shiftId } = await req.json();

    if (!shiftId) {
      throw new Error("shiftId erforderlich");
    }

    // Hole Schichtzettel-Daten
    const { data: shift, error } = await supabaseClient
      .from("shifts")
      .select("*, drivers(first_name, last_name), vehicles(license_plate)")
      .eq("id", shiftId)
      .single();

    if (error) throw error;

    // TODO: PDF-Generierung implementieren
    // Für jetzt: JSON-Export als Basis
    const exportData = {
      shift,
      generatedAt: new Date().toISOString(),
      format: "json", // Später: 'pdf'
    };

    return new Response(JSON.stringify(exportData), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="schichtzettel-${shiftId}.json"`,
      },
      status: 200,
    });
  } catch (error: any) {
    console.error("Fehler beim Export:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
