# 🔐 MYDISPATCH API-KEYS - VOLLSTÄNDIGE ÜBERSICHT

**Projekt:** MyDispatch  
**Erstellt:** 2025-11-04  
**Status:** ✅ AKTIV

---

## 📍 SPEICHERORTE

### Frontend (`.env.local`)

**Datei:** `.env.local` (in `.gitignore`)  
**Status:** ✅ Gespeichert

### Backend (Supabase Secrets)

**Ort:** Supabase Dashboard → Settings → Secrets  
**Status:** ⏳ Muss konfiguriert werden

### Cursor Extensions

**Ort:** Cursor Settings / Secrets  
**Status:** ⏳ Muss konfiguriert werden

---

## ✅ BEREITS GESPEICHERT

### Google API Key

- **Key:** `AIzaSyDZRIS2SYJYjdHSAv-j4E9Bt5kCCkf3sbQ`
- **Speicherort:** `.env.local` → `VITE_GOOGLE_API_KEY`
- **Verwendung:** Google Maps, Geocoding
- **Status:** ✅ Gespeichert

### Daily API Key

- **Key:** `e4397b97b3227ce33788210723d0454edfbbb4bc487efe01ec372ca8cc441d72`
- **Speicherort:** `.env.local` → `VITE_DAILY_API_KEY`
- **Verwendung:** Daily.co Video Calls
- **Status:** ✅ Gespeichert

### Anthropic (Claude) API Key

- **Key:** `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`
- **Speicherort:** Supabase Secrets → `ANTHROPIC_API_KEY`
- **Verwendung:** AI Chat (ersetzt OpenAI)
- **Status:** ⏳ Muss in Supabase Secrets gesetzt werden

### Resend API Key

- **Key:** `re_QLd5UEuy_65ESCwqXFrSaHzuSTaS8LTGd`
- **Domain:** `b899dc5b-e1e7-486e-87ef-bccece2d3002`
- **Speicherort:** Supabase Secrets
  - `RESEND_API_KEY`
  - `RESEND_DOMAIN`
- **Verwendung:** E-Mail-Versand
- **Status:** ⏳ Muss in Supabase Secrets gesetzt werden

### GitHub Personal Access Token

- **Token:** `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`
- **Username:** `u4231458123@gmail.com`
- **Speicherort:** Cursor Secrets (via Command Palette)
- **Verwendung:** Cursor Prompt Saver/Manager
- **Status:** ⏳ Muss über Command Palette konfiguriert werden

### Tavily MCP API

- **Key:** `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`
- **Speicherort:** `.cursor/mcp-config.json`
- **Verwendung:** Web Search für Best Practices
- **Status:** ✅ Konfiguriert

---

## ⏳ AUSSTEHEND (AUS DOCS SUCHEN)

### Stripe Keys

- **Status:** ⏳ In MyDispatch Docs suchen
- **Speicherort:** `.env.local` → `VITE_STRIPE_PUBLISHABLE_KEY`
- **Verwendung:** Payment Processing

### HERE Maps API Key

- **Status:** ⏳ In MyDispatch Docs suchen
- **Speicherort:** `.env.local` → `VITE_HERE_API_KEY`
- **Verwendung:** Geocoding, Distance Matrix

### Sentry DSN

- **Status:** ⏳ In MyDispatch Docs suchen
- **Speicherort:** `.env.local` → `VITE_SENTRY_DSN`
- **Verwendung:** Error Tracking

---

## 🔄 NÄCHSTE SCHRITTE

1. ✅ **Gespeichert:** Google, Daily, Tavily
2. ⏳ **Supabase Secrets setzen:** Anthropic, Resend
3. ⏳ **Cursor Extensions:** GitHub PAT konfigurieren
4. ⏳ **Aus Docs suchen:** Stripe, HERE Maps, Sentry

---

**⚠️ WICHTIG:** Alle Keys sind MyDispatch-spezifisch und NICHT projekt-übergreifend!
