/* ==================================================================================
   DOC-AI SYNC EDGE FUNCTION - V18.5.3 (Auto-Trigger & Confidence System)
   ==================================================================================
   Automatisierter Sync zwischen NeXify und Doc-AI Agent
   
   Features:
   ✅ Real-Time Trigger via Supabase Channel
   ✅ Confidence-basierte Auto-Approval (>85% → Auto, <85% → NeXify Review)
   ✅ Validation Request Queue Management
   ✅ Automatic Doc Update Notification
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ValidationRequest {
  id: string;
  doc_path: string;
  change_type: "create" | "update" | "delete";
  confidence: number;
  summary: string;
  details?: Record<string, any>;
  timestamp: string;
}

interface SyncAction {
  action: "validate" | "sync" | "notify";
  request?: ValidationRequest;
  data?: Record<string, any>;
}

const CONFIDENCE_THRESHOLD = 0.85; // 85% Auto-Approval

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, request, data }: SyncAction = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.info(`[Doc-AI Sync] Action: ${action}`);

    switch (action) {
      case "validate": {
        if (!request) {
          throw new Error("Validation request missing");
        }

        console.info(`[Validation] Doc: ${request.doc_path}, Confidence: ${request.confidence}`);

        // ⭐ CONFIDENCE-BASED DECISION
        if (request.confidence >= CONFIDENCE_THRESHOLD) {
          // AUTO-APPROVAL: Hohe Confidence → Sofortige Ausführung
          console.info(
            `[Auto-Approve] Confidence ${request.confidence} >= ${CONFIDENCE_THRESHOLD}`
          );

          const { error: logError } = await supabase.from("brain_logs").insert({
            agent_name: "doc-ai",
            action_type: "doc_validation",
            action_result: "auto_approved",
            metadata: {
              doc_path: request.doc_path,
              confidence: request.confidence,
              change_type: request.change_type,
              summary: request.summary,
            },
            confidence_score: request.confidence,
          });

          if (logError) {
            console.error("[Auto-Approve Log Error]", logError);
          }

          return new Response(
            JSON.stringify({
              status: "auto_approved",
              confidence: request.confidence,
              message: `Doc-Update automatisch genehmigt (Confidence: ${Math.round(request.confidence * 100)}%)`,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
          );
        } else {
          // NIEDRIGE CONFIDENCE: Queue für NeXify-Review
          console.warn(
            `[NeXify Review] Confidence ${request.confidence} < ${CONFIDENCE_THRESHOLD}`
          );

          const { error: queueError } = await supabase.from("brain_logs").insert({
            agent_name: "doc-ai",
            action_type: "doc_validation",
            action_result: "needs_review",
            metadata: {
              doc_path: request.doc_path,
              confidence: request.confidence,
              change_type: request.change_type,
              summary: request.summary,
              details: request.details,
              queued_for_nexify: true,
            },
            confidence_score: request.confidence,
          });

          if (queueError) {
            console.error("[Queue Error]", queueError);
          }

          // Trigger Real-Time Notification an NeXify
          const { error: channelError } = await supabase
            .from("agent_status")
            .update({
              last_heartbeat: new Date().toISOString(),
              metadata: {
                pending_review: true,
                doc_path: request.doc_path,
                confidence: request.confidence,
              },
            })
            .eq("agent_name", "nexify");

          if (channelError) {
            console.error("[Channel Notification Error]", channelError);
          }

          return new Response(
            JSON.stringify({
              status: "needs_review",
              confidence: request.confidence,
              message: `NeXify-Review erforderlich (Confidence: ${Math.round(request.confidence * 100)}%)`,
              queue_id: request.id,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
          );
        }
      }

      case "sync": {
        // Doc-AI hat Änderung durchgeführt → Notifiziere NeXify
        console.info("[Sync] Doc-Update durchgeführt:", data);

        const { error: syncError } = await supabase.from("brain_logs").insert({
          agent_name: "doc-ai",
          action_type: "doc_sync",
          action_result: "success",
          metadata: {
            ...data,
            synced_at: new Date().toISOString(),
          },
        });

        if (syncError) {
          console.error("[Sync Log Error]", syncError);
        }

        return new Response(
          JSON.stringify({
            status: "synced",
            message: "Doc-Update erfolgreich synchronisiert",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }

      case "notify": {
        // NeXify hat Review abgeschlossen → Update Queue
        console.info("[Notify] NeXify Review abgeschlossen:", data);

        const { error: notifyError } = await supabase.from("brain_logs").insert({
          agent_name: "nexify",
          action_type: "doc_review",
          action_result: data?.approved ? "approved" : "rejected",
          metadata: {
            ...data,
            reviewed_at: new Date().toISOString(),
          },
        });

        if (notifyError) {
          console.error("[Notify Log Error]", notifyError);
        }

        return new Response(
          JSON.stringify({
            status: "notified",
            message: "Review-Status aktualisiert",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error("[Doc-AI Sync Error]", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unbekannter Fehler",
        status: "error",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
