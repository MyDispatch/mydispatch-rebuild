// ==================================================================================
// AI SUPPORT CHAT - Edge Function für IntelligentAIChat
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: AI-Chat-Support für MyDispatch
// Autor: NeXify AI MASTER
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  context: string;
  isMasterAccount?: boolean;
  companyId?: string;
  isPublicLanding?: boolean;
  userName?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get Authorization Header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const request: ChatRequest = await req.json();

    // Validate Request
    if (!request.messages || !Array.isArray(request.messages) || request.messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Anthropic (Claude) API Key
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
    
    // Fallback: Use a simple response system if Anthropic is not configured
    if (!anthropicApiKey) {
      console.warn("[AI-SUPPORT-CHAT] Anthropic API Key not configured, using fallback");
      
      // Simple fallback responses
      const lastMessage = request.messages[request.messages.length - 1];
      const userQuery = lastMessage.content.toLowerCase();
      
      let response = "Ich bin Ihr MyDispatch AI-Assistent. Wie kann ich Ihnen helfen?";
      
      if (userQuery.includes("buchung") || userQuery.includes("auftrag")) {
        response = "Für Buchungen können Sie die Auftragsverwaltung nutzen. Möchten Sie Hilfe bei der Erstellung eines neuen Auftrags?";
      } else if (userQuery.includes("fahrer") || userQuery.includes("fahrzeug")) {
        response = "Für Fahrer- und Fahrzeugverwaltung nutzen Sie bitte die entsprechenden Bereiche im Dashboard. Kann ich Ihnen bei etwas Bestimmtem helfen?";
      } else if (userQuery.includes("rechnung") || userQuery.includes("zahlung")) {
        response = "Rechnungen können Sie im Rechnungsbereich erstellen und verwalten. Brauchen Sie Hilfe bei der Rechnungserstellung?";
      } else if (userQuery.includes("hilfe") || userQuery.includes("support")) {
        response = "Gerne helfe ich Ihnen! Sie können mich zu folgenden Themen fragen:\n- Buchungen und Aufträge\n- Fahrer- und Fahrzeugverwaltung\n- Rechnungen\n- Einstellungen\n\nWas möchten Sie wissen?";
      }

      // Stream response
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          const chunks = response.split(' ');
          
          chunks.forEach((chunk, index) => {
            setTimeout(() => {
              const data = JSON.stringify({
                choices: [{
                  delta: {
                    content: index === chunks.length - 1 ? chunk : chunk + ' '
                  }
                }]
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              
              if (index === chunks.length - 1) {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
              }
            }, index * 50); // 50ms delay per chunk
          });
        }
      });

      return new Response(stream, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Use Anthropic (Claude) API if configured
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: `Du bist ein hilfreicher AI-Assistent für MyDispatch, eine Taxi-Dispositionssoftware. 
        Kontext: ${request.context || 'Kein spezifischer Kontext'}
        ${request.isMasterAccount ? 'Du hast Master-Zugriff.' : ''}
        ${request.isPublicLanding ? 'Du unterstützt öffentliche Kunden bei Buchungen.' : 'Du unterstützt eingeloggte Nutzer bei der Software-Nutzung.'}
        Antworte auf Deutsch, präzise und hilfreich.`,
        messages: request.messages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
        stream: true,
      }),
    });

    if (!anthropicResponse.ok) {
      const errorData = await anthropicResponse.json();
      throw new Error(`Anthropic API error: ${anthropicResponse.status} - ${JSON.stringify(errorData)}`);
    }

    // Stream Anthropic response (convert to OpenAI-compatible format)
    const reader = anthropicResponse.body?.getReader();
    const decoder = new TextDecoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        if (!reader) {
          controller.close();
          return;
        }
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  controller.close();
                  return;
                }
                
                try {
                  const json = JSON.parse(data);
                  if (json.type === 'content_block_delta' && json.delta?.text) {
                    // Convert Anthropic format to OpenAI format
                    const openaiFormat = JSON.stringify({
                      choices: [{
                        delta: {
                          content: json.delta.text
                        }
                      }]
                    });
                    controller.enqueue(encoder.encode(`data: ${openaiFormat}\n\n`));
                  } else if (json.type === 'message_stop') {
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                    return;
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error: any) {
    console.error("[AI-SUPPORT-CHAT] Error:", error);
    
    // Return error as stream
    const encoder = new TextEncoder();
    const errorStream = new ReadableStream({
      start(controller) {
        const errorMessage = JSON.stringify({
          choices: [{
            delta: {
              content: "Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support."
            }
          }]
        });
        controller.enqueue(encoder.encode(`data: ${errorMessage}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    });

    return new Response(errorStream, {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
      },
    });
  }
});

