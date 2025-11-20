/* ==================================================================================
   ANTHROPIC CLIENT V26.0 - CLAUDE SONNET 4.5 HELPER
   ==================================================================================
   Wiederverwendbare Client-Logik für Anthropic API Calls
   Nur für Frontend-Use (Edge Functions verwenden direkten Fetch)
   ================================================================================== */

import { AI_CONFIG, enforceAIConfig } from './config';

export interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AnthropicStreamResponse {
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: Error) => void;
}

/**
 * Anthropic API Client für Frontend
 * 
 * Ruft Edge Functions auf, die dann die Anthropic API verwenden.
 * NIEMALS direkt von hier aus die Anthropic API aufrufen!
 */
export class AnthropicClient {
  private readonly edgeFunctionUrl: string;

  constructor(edgeFunctionName: string) {
    // Validiere AI-Konfiguration bei Instanziierung
    enforceAIConfig();

    // Konstruiere Edge Function URL
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL ist nicht konfiguriert');
    }

    this.edgeFunctionUrl = `${supabaseUrl}/functions/v1/${edgeFunctionName}`;
  }

  /**
   * Streaming Chat mit Claude Sonnet 4.5
   * 
   * @param messages - Chat-Historie
   * @param handlers - Callback-Handler für Stream-Events
   */
  async streamChat(
    messages: AnthropicMessage[],
    handlers: AnthropicStreamResponse
  ): Promise<void> {
    try {
      const response = await fetch(this.edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY}`,
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error(`Edge Function Error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body ist leer');
      }

      // SSE Stream parsen
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Line-by-line Processing
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          if (!line || line.startsWith(':')) continue;
          if (!line.startsWith('data: ')) continue;

          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            handlers.onDone();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            
            // Anthropic SSE Format
            if (parsed.type === 'content_block_delta') {
              const text = parsed.delta?.text;
              if (text) {
                handlers.onDelta(text);
              }
            }
          } catch (parseError) {
            if (import.meta.env.DEV) {
              console.warn('JSON Parse Error:', parseError);
            }
          }
        }
      }

      handlers.onDone();
    } catch (error) {
      handlers.onError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Non-Streaming Chat mit Claude Sonnet 4.5
   * 
   * @param messages - Chat-Historie
   * @returns Komplette Antwort
   */
  async chat(messages: AnthropicMessage[]): Promise<string> {
    return new Promise((resolve, reject) => {
      let fullResponse = '';

      this.streamChat(messages, {
        onDelta: (text) => {
          fullResponse += text;
        },
        onDone: () => {
          resolve(fullResponse);
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  }
}

/**
 * Helper: Erstelle System-Prompt für MyDispatch
 * 
 * Standardisierter System-Prompt für alle AI-Integrationen.
 */
export function createMyDispatchSystemPrompt(context?: string): string {
  const basePrompt = `Du bist der AI-Assistent von MyDispatch, einer modernen Taxi- und Mietwagen-Dispositionsplattform.

Deine Aufgaben:
- Unterstütze Nutzer bei der Disposition und Verwaltung
- Beantworte Fragen zu MyDispatch-Funktionen
- Gib klare, präzise und hilfreiche Antworten
- Kommuniziere professionell und freundlich (B2B-Tonalität)
- Verweise bei rechtlichen Fragen auf offizielle Dokumentation

MyDispatch Kernwerte:
- Made in Germany
- DSGVO-konform
- Professionell und vertrauenswürdig
- Slogan: "simply arrive"`;

  return context ? `${basePrompt}\n\nKontext:\n${context}` : basePrompt;
}
