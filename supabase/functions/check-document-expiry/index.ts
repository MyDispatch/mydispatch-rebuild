/* ==================================================================================
   Edge Function: check-document-expiry
   ==================================================================================
   Prüft ablaufende Dokumente und sendet E-Mail-Erinnerungen
   - Läuft täglich (via Cron-Job)
   - Warnung 30/14/7 Tage vor Ablauf
   - E-Mail via Resend.com
   ================================================================================== */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "https://esm.sh/resend@4.0.0";

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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const resendDomain = Deno.env.get("RESEND_DOMAIN") || "onboarding@resend.dev";

    // Berechne Datumsgrenze (30 Tage vorher)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const { data: expiringDocs, error } = await supabaseClient
      .from('documents')
      .select('*, companies(name, email)')
      .not('expiry_date', 'is', null)
      .lte('expiry_date', thirtyDaysFromNow.toISOString())
      .eq('reminder_sent', false);

    if (error) throw error;

    let sentCount = 0;

    for (const doc of expiringDocs || []) {
      const expiryDate = new Date(doc.expiry_date);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

      // Sende Erinnerung bei 30, 14, 7 Tagen
      if ([30, 14, 7].includes(daysUntilExpiry) || daysUntilExpiry < 0) {
        const status = daysUntilExpiry < 0 ? 'ABGELAUFEN' : `läuft in ${daysUntilExpiry} Tagen ab`;

        await resend.emails.send({
          from: `MyDispatch <${resendDomain}>`,
          to: [doc.companies.email],
          subject: `⚠️ Dokument-Erinnerung: ${doc.name}`,
          html: `
            <h2>Dokument-Ablauf-Warnung</h2>
            <p><strong>Dokument:</strong> ${doc.name}</p>
            <p><strong>Typ:</strong> ${doc.document_type}</p>
            <p><strong>Status:</strong> ${status}</p>
            <p><strong>Ablaufdatum:</strong> ${new Date(doc.expiry_date).toLocaleDateString('de-DE')}</p>
            <p>Bitte erneuern Sie das Dokument rechtzeitig.</p>
            <hr>
            <p><em>MyDispatch by RideHub Solutions</em></p>
          `,
        });

        // Markiere als erinnert
        await supabaseClient
          .from('documents')
          .update({ reminder_sent: true })
          .eq('id', doc.id);

        sentCount++;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `${sentCount} Erinnerungen versendet`,
        checked: expiringDocs?.length || 0 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error('Fehler:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});