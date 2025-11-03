/* ==================================================================================
   AI CHAT EXAMPLE - CLAUDE SONNET 4.5 TEMPLATE
   ==================================================================================
   🚨 DIESES TEMPLATE MUSS FÜR ALLE AI-EDGE-FUNCTIONS VERWENDET WERDEN
   
   Implementiert:
   - Ausschließlich Claude Sonnet 4.5 über Anthropic API
   - Streaming mit SSE
   - CORS-Header
   - Error-Handling
   - ANTHROPIC_API_KEY aus Supabase Secrets
   ================================================================================== */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// 🚨 GOVERNANCE-CHECK: Diese Konstanten NIEMALS ÄNDERN!
const AI_PROVIDER = "anthropic";
const AI_MODEL = "claude-sonnet-4-5";
const API_KEY_SECRET = "ANTHROPIC_API_KEY";
const ANTHROPIC_VERSION = "2023-06-01";

serve(async (req) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 🚨 KRITISCH: Nur ANTHROPIC_API_KEY verwenden
    const ANTHROPIC_API_KEY = Deno.env.get(API_KEY_SECRET);
    if (!ANTHROPIC_API_KEY) {
      console.error(`${API_KEY_SECRET} ist nicht in Supabase Secrets konfiguriert`);
      return new Response(
        JSON.stringify({ 
          error: "AI-Konfiguration fehlt",
          details: "API-Key nicht gefunden"
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Request-Body parsen
    const { messages, systemPrompt } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Ungültiges Request-Format: 'messages' Array erforderlich" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Standard-System-Prompt für MyDispatch
    const defaultSystemPrompt = `Du bist der AI-Assistent von MyDispatch, einer modernen Taxi- und Mietwagen-Dispositionsplattform.

Deine Aufgaben:
- Unterstütze Nutzer bei der Disposition und Verwaltung
- Beantworte Fragen zu MyDispatch-Funktionen
- Gib klare, präzise und hilfreiche Antworten
- Kommuniziere professionell und freundlich (B2B-Tonalität)

MyDispatch Kernwerte:
- Made in Germany
- DSGVO-konform
- Professionell und vertrauenswürdig
- Slogan: "simply arrive"`;

    // 🚨 KRITISCH: Nur Claude Sonnet 4.5 verwenden
    console.log(`[AI] Verwende ${AI_PROVIDER}/${AI_MODEL}`);
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": ANTHROPIC_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_MODEL, // 🚨 NIEMALS ÄNDERN!
        system: systemPrompt || defaultSystemPrompt,
        messages: messages,
        max_tokens: 4096,
        stream: true,
      }),
    });

    // Fehlerbehandlung
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API Error:", response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: "AI API Fehler",
          status: response.status,
          details: errorText
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Stream zurückgeben
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    console.error("Edge Function Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Interner Server-Fehler",
        message: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

/* ==================================================================================
   DEPLOYMENT CHECKLIST
   ==================================================================================
   
   Vor Deployment sicherstellen:
   
   1. ✅ ANTHROPIC_API_KEY in Supabase Secrets konfiguriert
   2. ✅ AI_MODEL ist "claude-sonnet-4-5"
   3. ✅ Keine Referenzen zu anderen AI-Providern
   4. ✅ CORS-Header korrekt konfiguriert
   5. ✅ Error-Handling implementiert
   6. ✅ Logging aktiviert
   
   ================================================================================== */
