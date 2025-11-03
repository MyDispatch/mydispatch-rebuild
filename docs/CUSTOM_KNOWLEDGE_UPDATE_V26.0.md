/* ==================================================================================
   CUSTOM KNOWLEDGE UPDATE V26.0 - AI MODEL GOVERNANCE
   ==================================================================================
   
   Dieser Text MUSS in die Custom Knowledge des Projekts eingefügt werden!
   
   Pfad: Project Settings → Manage Knowledge → Add to Custom Knowledge
   
   ================================================================================== */

# 🚨 ABSOLUTE AI-MODEL-VERPFLICHTUNG

**KRITISCHE REGEL - AUSNAHMSLOS EINZUHALTEN**

MyDispatch verwendet **AUSSCHLIESSLICH** das folgende AI-Modell:

```
Modell: Claude Sonnet 4.5 (claude-sonnet-4-5)
Provider: Anthropic API
API-Key: ANTHROPIC_API_KEY (in Supabase Secrets)
```

## VERBOTEN ❌

- Lovable AI Gateway
- Google Gemini (alle Varianten)
- OpenAI GPT (alle Varianten)
- Andere AI-Modelle als Claude Sonnet 4.5
- Fallback-Modelle

## VORGESCHRIEBEN ✅

- Claude Sonnet 4.5 über Anthropic API
- API-Key aus Supabase Secret "ANTHROPIC_API_KEY"
- Zentrale AI-Konfiguration (`src/lib/ai/config.ts`)
- Edge Function Template (`supabase/functions/ai-chat-example/index.ts`)

## IMPLEMENTATION

**Alle AI-Edge-Functions müssen:**

1. ANTHROPIC_API_KEY aus Deno.env.get("ANTHROPIC_API_KEY") laden
2. Anthropic API direkt aufrufen (https://api.anthropic.com/v1/messages)
3. Modell auf "claude-sonnet-4-5" setzen
4. Streaming mit SSE implementieren
5. System-Prompt für MyDispatch verwenden

**Beispiel:**

```typescript
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-5",
    messages: messages,
    max_tokens: 4096,
    stream: true,
  }),
});
```

## DOKUMENTATION

- **AI Model Governance:** `docs/AI_MODEL_GOVERNANCE_V26.0.md`
- **Zentrale Config:** `src/lib/ai/config.ts`
- **Client Helper:** `src/lib/ai/anthropic-client.ts`
- **Edge Function Template:** `supabase/functions/ai-chat-example/index.ts`

## COMPLIANCE CHECKLIST

Bei jeder AI-Integration prüfen:

- [ ] Claude Sonnet 4.5 als Modell?
- [ ] Anthropic API als Provider?
- [ ] ANTHROPIC_API_KEY aus Secrets?
- [ ] Keine Lovable AI Referenzen?
- [ ] Keine Gemini/GPT Referenzen?
- [ ] Zentrale AI_CONFIG verwendet?
- [ ] Edge Function nach Template?

## VERSTOSS-KONSEQUENZEN

1. Code-Review-Block
2. Automatische Reversion
3. ARCA-Dokumentation
4. Eskalation an Pascal

---

**Version:** V26.0  
**Status:** PRODUCTION - ZWINGEND  
**Governance-Level:** P-00 (Höchste Priorität)
