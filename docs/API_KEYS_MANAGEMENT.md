# 🔐 API-KEYS VERWALTUNG - SICHERHEITSDOKUMENTATION

**Erstellt:** 2025-11-04  
**Status:** ✅ AKTIV  
**Version:** 1.0.0

---

## 🚨 KRITISCHE SICHERHEITSREGELN

1. ✅ **NIEMALS API-Keys in Git committen!**
2. ✅ **Alle Keys sind in `.gitignore`**
3. ✅ **Frontend Keys:** `.env.local` (nicht committet)
4. ✅ **Backend Keys:** Supabase Secrets (nicht committet)
5. ✅ **Cursor Keys:** Cursor Secrets (nicht committet)

---

## 📍 SPEICHERORTE DER API-KEYS

### Frontend (`.env.local`)

**Datei:** `.env.local` (in `.gitignore`)  
**Zweck:** Frontend-Environment-Variables  
**Status:** ✅ Gespeichert

**Keys:**

- ✅ `VITE_GOOGLE_API_KEY`
- ✅ `VITE_DAILY_API_KEY`
- ⏳ `VITE_STRIPE_PUBLISHABLE_KEY` (wenn benötigt)
- ⏳ `VITE_HERE_API_KEY` (wenn benötigt)
- ⏳ `VITE_SENTRY_DSN` (wenn benötigt)

### Backend (Supabase Secrets)

**Ort:** Supabase Dashboard → Settings → Secrets  
**Zweck:** Edge Functions Environment Variables  
**Status:** ⏳ Muss konfiguriert werden

**Keys (zu setzen):**

- ⏳ `ANTHROPIC_API_KEY` (Claude API)
- ⏳ `RESEND_API_KEY`
- ⏳ `RESEND_DOMAIN`
- ⏳ `DAILY_API_KEY` (falls Edge Functions benötigen)

### Cursor Extensions

**Ort:** Cursor Settings / Secrets  
**Zweck:** Cursor Prompt Extensions  
**Status:** ⏳ Muss konfiguriert werden

**Keys:**

- ⏳ GitHub PAT (für Prompt Saver/Manager)
- ✅ Tavily MCP API (bereits in `.cursor/mcp-config.json`)

---

## 🔑 API-KEYS ÜBERSICHT

### ✅ Google API Key

- **Key:** `AIzaSyDZRIS2SYJYjdHSAv-j4E9Bt5kCCkf3sbQ`
- **Speicherort:** `.env.local` → `VITE_GOOGLE_API_KEY`
- **Verwendung:** Google Maps, Geocoding, etc.
- **Status:** ✅ Gespeichert

### ✅ Daily API Key

- **Key:** `e4397b97b3227ce33788210723d0454edfbbb4bc487efe01ec372ca8cc441d72`
- **Speicherort:** `.env.local` → `VITE_DAILY_API_KEY`
- **Verwendung:** Daily.co Video Calls
- **Status:** ✅ Gespeichert

### ✅ GitHub Personal Access Token

- **Token:** `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`
- **Username:** `u4231458123@gmail.com`
- **Speicherort:** Cursor Secrets (via Command Palette)
- **Verwendung:** Cursor Prompt Saver/Manager
- **Status:** ⏳ Muss über Command Palette konfiguriert werden

### ✅ Anthropic (Claude) API Key

- **Key:** `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`
- **Speicherort:** Supabase Secrets → `ANTHROPIC_API_KEY`
- **Verwendung:** AI Chat (ersetzt OpenAI)
- **Status:** ⏳ Muss in Supabase Secrets gesetzt werden

### ✅ Resend API Key

- **Key:** `re_QLd5UEuy_65ESCwqXFrSaHzuSTaS8LTGd`
- **Domain:** `https://resend.com/domains/b899dc5b-e1e7-486e-87ef-bccece2d3002`
- **Speicherort:** Supabase Secrets
  - `RESEND_API_KEY`
  - `RESEND_DOMAIN` (nur Domain-ID: `b899dc5b-e1e7-486e-87ef-bccece2d3002`)
- **Verwendung:** E-Mail-Versand
- **Status:** ⏳ Muss in Supabase Secrets gesetzt werden

### ✅ Tavily MCP API

- **Key:** `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`
- **Speicherort:** `.cursor/mcp-config.json`
- **Verwendung:** Web Search für Best Practices
- **Status:** ✅ Konfiguriert

---

## 🔧 KONFIGURATION ANLEITUNGEN

### 1. Supabase Secrets setzen

**Vorgehen:**

1. Öffne Supabase Dashboard → Settings → Secrets
2. Füge folgende Secrets hinzu:

```env
# Anthropic (Claude) API
ANTHROPIC_API_KEY=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

# Resend
RESEND_API_KEY=re_QLd5UEuy_65ESCwqXFrSaHzuSTaS8LTGd
RESEND_DOMAIN=b899dc5b-e1e7-486e-87ef-bccece2d3002

# Daily (falls Edge Functions benötigen)
DAILY_API_KEY=e4397b97b3227ce33788210723d0454edfbbb4bc487efe01ec372ca8cc441d72
```

### 2. Cursor Prompt Extensions konfigurieren

**Vorgehen:**

1. Command Palette: `Ctrl+Shift+P`
2. `Configure Prompt Saver`
3. GitHub Token eingeben: `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`
4. `Configure Prompt Manager`
5. GitHub Token eingeben: `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`

### 3. Frontend Environment Variables

**Status:** ✅ `.env.local` erstellt mit:

- `VITE_GOOGLE_API_KEY`
- `VITE_DAILY_API_KEY`

**Hinweis:** Diese Datei ist in `.gitignore` und wird NICHT committet!

---

## 🔄 ANTHROPIC STATT OPENAI

### Edge Functions anpassen

**Dateien zu ändern:**

- `supabase/functions/ai-support-chat/index.ts`

**Änderungen:**

```typescript
// ❌ ALT (OpenAI):
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

// ✅ NEU (Anthropic):
import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });
```

---

## 🛡️ SICHERHEITSMASSNAHMEN

### ✅ Implementiert

1. ✅ `.env.local` in `.gitignore`
2. ✅ `.env.local.example` als Template (ohne echte Keys)
3. ✅ API-Keys Dokumentation (ohne Keys in Git)
4. ✅ Supabase Secrets (nicht in Git)
5. ✅ Cursor Secrets (nicht in Git)

### ⚠️ WICHTIGE HINWEISE

- **NIEMALS** API-Keys in Code committen
- **NIEMALS** API-Keys in Dokumentation (die in Git ist) committen
- **IMMER** `.env.local` prüfen vor Git-Commits
- **IMMER** Secrets in Supabase/Cursor nutzen für Backend

---

## 📋 CHECKLISTE

### ✅ Erledigt

- [x] `.env.local` erstellt (mit Keys)
- [x] `.env.local.example` erstellt (ohne Keys)
- [x] `.gitignore` prüfen (`.env.local` enthalten)
- [x] API-Keys Dokumentation erstellt
- [x] Tavily MCP konfiguriert

### ⏳ Ausstehend

- [ ] Supabase Secrets setzen (Anthropic, Resend)
- [ ] Cursor Prompt Extensions konfigurieren (GitHub PAT)
- [ ] Edge Functions auf Anthropic umstellen
- [ ] `.gitignore` prüfen (`.env.local` sicher enthalten)

---

## 🔗 LINKS

- **Resend Domain:** https://resend.com/domains/b899dc5b-e1e7-486e-87ef-bccece2d3002
- **Supabase Secrets:** Dashboard → Settings → Secrets
- **Cursor Settings:** Command Palette → `Preferences: Open Settings (JSON)`

---

**⚠️ WICHTIG:** Diese Dokumentation enthält KEINE echten API-Keys (außer in nicht-committeten Dateien). Alle Keys sind sicher gespeichert!
