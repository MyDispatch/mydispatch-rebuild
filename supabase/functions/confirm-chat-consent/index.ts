/* ==================================================================================
   CONFIRM CHAT CONSENT - Token-basierte Bestätigung
   ==================================================================================
   Bestätigt Chat-Einwilligung via Email-Link und fügt User zum Company-Chat hinzu
   ================================================================================== */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response("Token fehlt", { status: 400, headers: corsHeaders });
    }

    console.log("[ConfirmChatConsent] Processing token:", token.substring(0, 8) + "...");

    // Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Finde Consent-Record mit diesem Token
    const { data: consentData, error: consentError } = await supabaseAdmin
      .from("chat_consent")
      .select("*")
      .eq("confirmation_token", token)
      .maybeSingle();

    if (consentError) {
      console.error("[ConfirmChatConsent] Error finding consent:", consentError);
      throw consentError;
    }

    if (!consentData) {
      console.error("[ConfirmChatConsent] Token not found");
      return new Response(
        generateHtmlResponse(
          "error",
          "Token ungültig",
          "Dieser Bestätigungslink ist ungültig oder wurde bereits verwendet."
        ),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "text/html" } }
      );
    }

    // Prüfe Gültigkeit
    if (consentData.confirmed_at) {
      console.log("[ConfirmChatConsent] Already confirmed");
      return new Response(
        generateHtmlResponse(
          "success",
          "Bereits bestätigt",
          "Sie haben bereits zugestimmt und sind im Team-Chat aktiv."
        ),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "text/html" } }
      );
    }

    if (new Date(consentData.confirmation_token_expires_at) < new Date()) {
      console.error("[ConfirmChatConsent] Token expired");
      return new Response(
        generateHtmlResponse(
          "error",
          "Link abgelaufen",
          "Dieser Bestätigungslink ist abgelaufen. Bitte fordern Sie einen neuen an."
        ),
        { status: 410, headers: { ...corsHeaders, "Content-Type": "text/html" } }
      );
    }

    // Update Consent
    const { error: updateError } = await supabaseAdmin
      .from("chat_consent")
      .update({
        consent_given: true,
        consent_given_at: new Date().toISOString(),
        consent_method: "email_confirmation",
        confirmed_at: new Date().toISOString(),
        confirmation_token: null,
        confirmation_token_expires_at: null,
      })
      .eq("id", consentData.id);

    if (updateError) {
      console.error("[ConfirmChatConsent] Update error:", updateError);
      throw updateError;
    }

    // Füge User zum Unternehmens-Chat hinzu
    // 1. Finde oder erstelle Unternehmens-Chat
    let { data: companyChat, error: chatError } = await supabaseAdmin
      .from("chat_conversations")
      .select("id")
      .eq("company_id", consentData.company_id)
      .eq("name", "Unternehmens-Chat")
      .eq("is_group", true)
      .eq("archived", false)
      .maybeSingle();

    if (chatError) {
      console.error("[ConfirmChatConsent] Chat lookup error:", chatError);
      throw chatError;
    }

    // Erstelle Chat wenn nicht vorhanden
    if (!companyChat) {
      const { data: newChat, error: createError } = await supabaseAdmin
        .from("chat_conversations")
        .insert({
          company_id: consentData.company_id,
          name: "Unternehmens-Chat",
          is_group: true,
          created_by: consentData.user_id,
          archived: false,
        })
        .select("id")
        .single();

      if (createError) {
        console.error("[ConfirmChatConsent] Chat creation error:", createError);
        throw createError;
      }

      companyChat = newChat;
      console.log("[ConfirmChatConsent] Created company chat:", companyChat.id);
    }

    // 2. Füge User als Participant hinzu
    const { error: participantError } = await supabaseAdmin.from("chat_participants").insert({
      conversation_id: companyChat.id,
      user_id: consentData.user_id,
      joined_at: new Date().toISOString(),
    });

    // Ignoriere Constraint-Fehler (bereits Participant)
    if (participantError && !participantError.message.includes("duplicate")) {
      console.error("[ConfirmChatConsent] Participant error:", participantError);
      throw participantError;
    }

    console.log("[ConfirmChatConsent] ✅ User added to company chat");

    return new Response(
      generateHtmlResponse(
        "success",
        "Erfolgreich aktiviert!",
        "Sie wurden erfolgreich zum Team-Chat hinzugefügt. Sie können dieses Fenster jetzt schließen.",
        "/kommunikation"
      ),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "text/html" } }
    );
  } catch (error: any) {
    console.error("[ConfirmChatConsent] Error:", error);
    return new Response(
      generateHtmlResponse(
        "error",
        "Fehler",
        "Ein Fehler ist aufgetreten. Bitte kontaktieren Sie den Support."
      ),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "text/html" } }
    );
  }
};

function generateHtmlResponse(
  type: "success" | "error",
  title: string,
  message: string,
  redirectUrl?: string
): string {
  const iconColor = type === "success" ? "#10b981" : "#ef4444";
  const icon = type === "success" ? "✅" : "❌";

  return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 16px;
          padding: 48px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
        }
        .icon {
          font-size: 64px;
          margin-bottom: 24px;
        }
        h1 {
          color: #1a1a1a;
          margin: 0 0 16px 0;
          font-size: 28px;
          font-weight: 700;
        }
        p {
          color: #666;
          margin: 0 0 32px 0;
          font-size: 16px;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          background-color: #EADEBD;
          color: #1a1a1a;
          padding: 14px 32px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          transition: transform 0.2s;
        }
        .button:hover {
          transform: scale(1.05);
        }
        .footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e0e0e0;
          color: #999;
          font-size: 12px;
        }
      </style>
      ${redirectUrl ? `<meta http-equiv="refresh" content="3;url=${redirectUrl}">` : ""}
    </head>
    <body>
      <div class="container">
        <div class="icon">${icon}</div>
        <h1>${title}</h1>
        <p>${message}</p>
        ${
          redirectUrl
            ? `
          <a href="${redirectUrl}" class="button">
            Zum Team-Chat
          </a>
          <p style="color: #999; font-size: 13px; margin-top: 20px;">
            Sie werden automatisch weitergeleitet...
          </p>
        `
            : ""
        }
        <div class="footer">
          MyDispatch Team-Kommunikation<br>
          Made in Germany 🇩🇪 • DSGVO-konform
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(handler);
