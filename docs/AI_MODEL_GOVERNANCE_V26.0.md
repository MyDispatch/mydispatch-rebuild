/* ==================================================================================
   AI MODEL GOVERNANCE V26.0 - ABSOLUTE VERPFLICHTUNG
   ==================================================================================
   
   🚨 KRITISCHE REGEL - AUSNAHMSLOS EINZUHALTEN 🚨
   
   MyDispatch verwendet AUSSCHLIESSLICH das folgende AI-Modell:
   
   **Modell:** Claude Sonnet 4.5 (claude-sonnet-4-5)
   **API:** Anthropic API
   **API-Key:** ANTHROPIC_API_KEY (in Supabase Secrets hinterlegt)
   
   ================================================================================== */

## 🎯 ABSOLUTE VERPFLICHTUNG

### Für alle Entwickler, AI-Agenten und Code-Generatoren:

**ES IST ZWINGEND VERBOTEN:**
- ❌ Lovable AI Gateway zu verwenden
- ❌ Google Gemini Modelle zu verwenden
- ❌ OpenAI GPT Modelle zu verwenden
- ❌ Andere AI-Modelle als Claude Sonnet 4.5 zu verwenden
- ❌ Fallback-Modelle zu konfigurieren

**ES IST ZWINGEND VORGESCHRIEBEN:**
- ✅ Ausschließlich Claude Sonnet 4.5 über Anthropic API
- ✅ API-Key aus Supabase Secret "ANTHROPIC_API_KEY" verwenden
- ✅ Zentrale AI-Konfiguration (siehe unten) verwenden
- ✅ Alle Edge Functions mit dieser Konfiguration implementieren

---

## 📋 TECHNISCHE IMPLEMENTATION

### 1. Zentrale AI-Konfiguration

Datei: `src/lib/ai/config.ts`

```typescript
/* ==================================================================================
   ZENTRALE AI-KONFIGURATION - CLAUDE SONNET 4.5 ONLY
   ==================================================================================
   Diese Datei definiert die EINZIGE erlaubte AI-Konfiguration.
   NIEMALS ÄNDERN ohne explizite Freigabe!
   ================================================================================== */

export const AI_CONFIG = {
  provider: 'anthropic' as const,
  model: 'claude-sonnet-4-5' as const,
  apiKeySecret: 'ANTHROPIC_API_KEY' as const,
  baseUrl: 'https://api.anthropic.com/v1' as const,
} as const;

export type AIConfig = typeof AI_CONFIG;

// Type Guard zur Compile-Time Validierung
export function validateAIConfig(config: unknown): config is AIConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    'provider' in config &&
    config.provider === 'anthropic' &&
    'model' in config &&
    config.model === 'claude-sonnet-4-5'
  );
}
```

### 2. Edge Function Template

**Alle AI-Funktionen MÜSSEN diesem Template folgen:**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 🚨 KRITISCH: Nur ANTHROPIC_API_KEY verwenden
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY ist nicht konfiguriert");
    }

    const { messages } = await req.json();

    // 🚨 KRITISCH: Nur Claude Sonnet 4.5 verwenden
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5", // 🚨 NIEMALS ÄNDERN!
        messages,
        max_tokens: 4096,
        stream: true, // Optional: für Streaming
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API Error:", error);
      return new Response(
        JSON.stringify({ error: "AI API Fehler" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    console.error("Edge Function Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

---

## 🔒 SECRETS MANAGEMENT

Der API-Key ist bereits in Supabase Secrets hinterlegt:

```
Secret Name: ANTHROPIC_API_KEY
Verwendung: Alle Edge Functions mit AI-Funktionalität
Status: ✅ Konfiguriert
```

**NIEMALS:**
- API-Keys im Frontend speichern
- API-Keys in Environment-Variablen im Client
- API-Keys in Git committen

---

## 📊 COMPLIANCE CHECKLIST

Vor jeder AI-Integration prüfen:

- [ ] Claude Sonnet 4.5 als Modell konfiguriert?
- [ ] Anthropic API als Provider verwendet?
- [ ] ANTHROPIC_API_KEY aus Supabase Secrets geladen?
- [ ] Keine Lovable AI Gateway Referenzen?
- [ ] Keine Google Gemini Referenzen?
- [ ] Keine OpenAI GPT Referenzen?
- [ ] Zentrale AI_CONFIG verwendet?
- [ ] Edge Function nach Template implementiert?

---

## 🚨 VERSTOSS-KONSEQUENZEN

Bei Verstoß gegen diese Governance:

1. **Code-Review-Block:** Pull Request wird abgelehnt
2. **Automatische Reversion:** Änderung wird zurückgerollt
3. **Dokumentation:** Verstoß wird in ARCA-System dokumentiert
4. **Eskalation:** Meldung an Pascal (Projekt-Inhaber)

---

## 📖 REFERENZEN

- **Anthropic API Dokumentation:** https://docs.anthropic.com/
- **Claude Sonnet 4.5 Specs:** https://docs.anthropic.com/claude/docs/models-overview
- **Supabase Secrets Management:** https://supabase.com/docs/guides/functions/secrets

---

**Version:** V26.0  
**Erstellt:** 2025-10-26  
**Status:** PRODUCTION - ZWINGEND  
**Letzte Aktualisierung:** 2025-10-26  

**Verantwortlich:** Pascal (Projekt-Inhaber)  
**Governance-Level:** P-00 (Höchste Priorität)
