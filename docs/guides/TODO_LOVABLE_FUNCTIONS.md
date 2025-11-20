# 📋 TODO: Lovable Functions Migration zu Claude AI

**Status:** ⏳ Ausstehend  
**Priorität:** Niedrig (Optional Features)  
**Geschätzte Zeit:** 12-16 Stunden

---

## 🎯 Ziel

Alle 34 Supabase Edge Functions, die aktuell Lovable AI (Gemini 2.5 Flash) nutzen, auf Claude AI (Anthropic) migrieren.

---

## 📝 Betroffene Functions (34 Stück)

### AI Code Analysis & Validation:

1. `ai-code-analyzer` - Code Quality Analysis
2. `ai-code-validator` - Code Validation
3. `ai-code-migrator` - Code Migration Helper
4. `ai-auto-fix-generator` - Automatic Fix Generator
5. `classify-components` - Component Classification
6. `tavily-code-validator` - Code Validation via Tavily

### AI Documentation:

7. `ai-doc-parser` - Document Parser
8. `ai-doc-gap-analyzer` - Documentation Gap Analysis
9. `auto-doc-updater` - Automatic Documentation Updates
10. `manage-docs` - Document Management
11. `wiki-to-yaml-parser` - Wiki to YAML Converter

### AI Error Handling:

12. `ai-error-analysis` - Error Analysis
13. `ai-error-predictor` - Error Prediction
14. `ai-self-healer` - Self-Healing System

### AI Support & Chat:

15. `ai-support-chat` - Support Chat Assistant
16. `dashboard-ai-assistant` - Dashboard AI Assistant
17. `master-chat` - Master Chat System
18. `enhanced-knowledge-query` - Enhanced Knowledge Base Queries
19. `ai-knowledge-query` - Knowledge Base Queries

### AI Visual Analysis:

20. `ai-visual-analysis` - Visual Analysis
21. `ai-visual-validator` - Visual Validation
22. `generate-hero-image` - Hero Image Generation
23. `ai-document-ocr` - OCR Document Processing

### AI System Management:

24. `ai-orchestrator` - AI Orchestration
25. `brain-system` - Brain System Core
26. `brain-full-system-scan` - Full System Scan
27. `brain-qa-check` - QA Checks
28. `self-reflection` - System Self-Reflection

### AI Forecasting & Analytics:

29. `ai-forecast` - Forecasting & Predictions

### Validation & Auditing:

30. `genesis-audit` - Genesis Audit System
31. `phase-2-validation` - Phase 2 Validation
32. `pre-go-live-validation` - Pre-Go-Live Validation

### API & Integration:

33. `api-connection-manager` - API Connection Management
34. `kronos-code-generator` - Kronos Code Generator

---

## 🔧 Erforderliche Änderungen

### 1. Environment Variables

```typescript
// ALT:
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

// NEU:
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
```

### 2. API Endpoint

```typescript
// ALT:
const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-2.5-flash",
    messages: [...]
  })
});

// NEU:
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    messages: [...]
  })
});
```

### 3. Response Format

```typescript
// ALT (OpenAI-kompatibel):
const data = await response.json();
const result = JSON.parse(data.choices[0].message.content);

// NEU (Claude):
const data = await response.json();
const result = JSON.parse(data.content[0].text);
```

---

## 📋 Migration Checklist

Für jede Function:

- [ ] Backup erstellen (`.backup` Suffix)
- [ ] `LOVABLE_API_KEY` → `ANTHROPIC_API_KEY` ersetzen
- [ ] API Endpoint ändern
- [ ] Request Headers anpassen
- [ ] Request Body Format anpassen (max_tokens hinzufügen)
- [ ] Response Parsing anpassen
- [ ] Error Handling prüfen
- [ ] Testen mit echten Daten
- [ ] Dokumentation aktualisieren

---

## 🚫 Warum gelöscht?

Diese Functions wurden **temporär entfernt**, weil:

1. ✅ **Lovable-Abhängigkeit** - Nutzen Lovable AI Gateway
2. ✅ **Nicht kritisch** - Optionale AI-Features, keine Core-Funktionalität
3. ✅ **Zeitersparnis** - Migration würde 12-16h dauern
4. ✅ **Fokus** - Priorität liegt auf Frontend-Rebuild

**Die App funktioniert OHNE diese Functions!**

---

## 💡 Alternative Lösungen

### Option 1: Claude AI Migration (Empfohlen)

- ✅ Nutzt ANTHROPIC_API_KEY (bereits verfügbar)
- ✅ Claude 3.5 Sonnet (bessere Qualität als Gemini)
- ✅ Keine externe Abhängigkeit

### Option 2: Direkt Anthropic SDK nutzen

```typescript
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: Deno.env.get("ANTHROPIC_API_KEY"),
});

const message = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 4096,
  messages: [{ role: "user", content: "..." }],
});
```

### Option 3: OpenAI API nutzen

- Falls bevorzugt, kann auch OpenAI API genutzt werden
- `OPENAI_API_KEY` ist bereits konfiguriert
- GPT-4.1-mini, GPT-4.1-nano verfügbar

---

## 📊 Impact Analysis

### ✅ Keine Auswirkungen auf:

- Landing Page
- Authentication
- Dashboard
- Dispatch Management
- Orders, Drivers, Vehicles
- Customers, Invoices
- Finance, Statistics
- Wiki (Basis-Funktionen)
- Communication (Basis-Chat)
- Settings

### ⚠️ Betroffene Features (Optional):

- AI-gestützte Code-Analyse
- Automatische Dokumentations-Updates
- AI-basierte Error-Prediction
- AI Support Chat (erweitert)
- Visual Analysis Features
- Automatische System-Audits

**→ Alle Kern-Features funktionieren weiterhin!**

---

## 🎯 Wann migrieren?

**Priorität: NIEDRIG**

Migriere diese Functions, wenn:

- ✅ Frontend-Rebuild abgeschlossen ist
- ✅ Alle Core-Features funktionieren
- ✅ App ist live und stabil
- ✅ Zeit für "Nice-to-Have" Features ist

**Geschätzte Zeit:** 12-16 Stunden (30 Min pro Function)

---

## 📝 Notizen

- Alle Functions haben `.backup` Dateien (falls Wiederherstellung nötig)
- Original Lovable-Code ist im Git-History verfügbar
- Claude API Dokumentation: https://docs.anthropic.com/
- Anthropic SDK: https://github.com/anthropics/anthropic-sdk-typescript

---

**Erstellt:** 3. November 2025  
**Status:** ⏳ Ausstehend  
**Nächster Schritt:** Frontend-Rebuild abschließen, dann Functions migrieren
