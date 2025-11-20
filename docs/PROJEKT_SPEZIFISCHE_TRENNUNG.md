# 🗂️ PROJEKT-SPEZIFISCHE TRENNUNG - MYDISPATCH

**Erstellt:** 2025-11-04  
**Status:** ✅ AKTIV  
**Version:** 1.0.0

---

## 🎯 ZWECK

Diese Dokumentation stellt sicher, dass **MyDispatch** vollständig von anderen Projekten getrennt ist. Ab morgen werden weitere Projekte angelegt - diese müssen **NICHT** durch MyDispatch-Daten beeinflusst werden.

---

## 📁 STRUKTUR-PRINZIP

```
mydispatch-rebuild/
├── .env.local                    # ✅ MyDispatch-spezifisch (NICHT committen!)
├── .env.local.example            # ✅ Template (ohne Keys)
├── docs/
│   ├── API_KEYS_MANAGEMENT.md    # ✅ MyDispatch API-Keys
│   ├── PROJEKT_SPEZIFISCHE_TRENNUNG.md  # ✅ Diese Datei
│   └── ...                       # ✅ Alle MyDispatch Docs
├── supabase/
│   ├── migrations/              # ✅ MyDispatch Migrations
│   └── functions/               # ✅ MyDispatch Edge Functions
└── src/                         # ✅ MyDispatch Frontend
```

**⚠️ WICHTIG:** Keine projekt-übergreifenden Konfigurationen!

---

## 🔐 API-KEYS - MYDISPATCH-SPEZIFISCH

### Frontend (`.env.local`)

**Datei:** `.env.local` (in `.gitignore`)  
**Projekt:** MyDispatch  
**Status:** ✅ Gespeichert

**MyDispatch Keys:**

- ✅ `VITE_GOOGLE_API_KEY` → Google Maps
- ✅ `VITE_DAILY_API_KEY` → Daily.co Video Calls
- ⏳ `VITE_STRIPE_PUBLISHABLE_KEY` → Payment (aus Docs suchen)
- ⏳ `VITE_HERE_API_KEY` → HERE Maps (aus Docs suchen)
- ⏳ `VITE_SENTRY_DSN` → Error Tracking (aus Docs suchen)

### Backend (Supabase Secrets)

**Ort:** Supabase Dashboard → Settings → Secrets  
**Projekt:** MyDispatch Supabase Project  
**Status:** ⏳ Muss konfiguriert werden

**MyDispatch Secrets:**

- ⏳ `ANTHROPIC_API_KEY` → Claude API (für Chat)
- ⏳ `RESEND_API_KEY` → E-Mail-Versand
- ⏳ `RESEND_DOMAIN` → Resend Domain-ID
- ⏳ `DAILY_API_KEY` → Daily.co (falls Edge Functions benötigen)

### Cursor Extensions

**Ort:** Cursor Settings / Secrets  
**Projekt:** Global (für alle Projekte verwendbar)  
**Status:** ⏳ Muss konfiguriert werden

**Global Keys:**

- ⏳ GitHub PAT (für Prompt Saver/Manager)
- ✅ Tavily MCP API (bereits konfiguriert)

---

## 📋 REGELN FÜR PROJEKT-TRENNUNG

### ✅ ERLAUBT

- ✅ MyDispatch-spezifische Konfigurationen in `.env.local`
- ✅ MyDispatch-spezifische Docs in `docs/`
- ✅ MyDispatch-spezifische Migrations in `supabase/migrations/`
- ✅ MyDispatch-spezifische Edge Functions in `supabase/functions/`

### ❌ VERBOTEN

- ❌ Projekt-übergreifende Konfigurationen
- ❌ Hardcodierte Keys in Code
- ❌ API-Keys in Git committen
- ❌ Projekt-Daten vermischen

---

## 🔄 WORKFLOW FÜR NEUE PROJEKTE (AB MORGEN)

### Wenn neues Projekt angelegt wird:

1. **Neues Projekt-Repository erstellen**
   - Eigener Ordner
   - Eigene `.env.local`
   - Eigene `docs/`
   - Eigene Supabase Project

2. **MyDispatch bleibt unberührt**
   - Keine Änderungen an MyDispatch-Konfigurationen
   - Keine Änderungen an MyDispatch-Docs
   - Keine Änderungen an MyDispatch-Migrations

3. **Getrennte Konfigurationen**
   - Jedes Projekt hat eigene `.env.local`
   - Jedes Projekt hat eigene Supabase Secrets
   - Jedes Projekt hat eigene Docs

---

## 📊 MYDISPATCH-SPEZIFISCHE KONFIGURATION

### Environment Variables

**Datei:** `.env.local` (MyDispatch-spezifisch)

```env
# MyDispatch Supabase
VITE_SUPABASE_URL=https://vsbqyqhzxmwezlhzdmfd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (MyDispatch Key)

# MyDispatch APIs
VITE_GOOGLE_API_KEY=AIzaSyDZRIS2SYJYjdHSAv-j4E9Bt5kCCkf3sbQ
VITE_DAILY_API_KEY=e4397b97b3227ce33788210723d0454edfbbb4bc487efe01ec372ca8cc441d72
```

### Supabase Secrets

**Projekt:** MyDispatch Supabase Project

```env
# MyDispatch Backend Secrets
ANTHROPIC_API_KEY=sk-ant-api03-... (MyDispatch Chat)
RESEND_API_KEY=re_QLd5UEuy_... (MyDispatch E-Mails)
RESEND_DOMAIN=b899dc5b-e1e7-486e-87ef-bccece2d3002
```

---

## 🚨 WICHTIGE HINWEISE

### Für AI Agent (NeXify AI MASTER)

1. **IMMER zuerst in MyDispatch Docs suchen**
   - `docs/` durchsuchen
   - Projekt-spezifische Konfigurationen nutzen
   - Nur wenn nicht gefunden → Pascal fragen

2. **NICHT projekt-übergreifend arbeiten**
   - MyDispatch-Konfigurationen nur für MyDispatch
   - Neue Projekte = neue Konfigurationen
   - Keine Vermischung!

3. **Dokumentation projekt-spezifisch**
   - MyDispatch Docs in `docs/`
   - Neue Projekte = eigene Docs
   - Keine projekt-übergreifenden Docs

---

## ✅ CHECKLISTE

### MyDispatch-Konfiguration

- [x] `.env.local` erstellt (MyDispatch-spezifisch)
- [x] `.env.local.example` erstellt (Template)
- [x] `.gitignore` prüft (`.env.local` enthalten)
- [x] API-Keys Dokumentation erstellt
- [x] Projekt-Trennung dokumentiert

### Ausstehend

- [ ] Supabase Secrets setzen (MyDispatch Project)
- [ ] Cursor Prompt Extensions konfigurieren (Global)
- [ ] Stripe/HERE/Sentry Keys aus Docs suchen
- [ ] Edge Function auf Anthropic umstellen ✅ (gerade gemacht)

---

## 📝 NOTIZEN

- ✅ Alle MyDispatch-Konfigurationen sind projekt-spezifisch
- ✅ Neue Projekte werden ab morgen getrennt angelegt
- ✅ Keine Vermischung zwischen Projekten
- ✅ AI Agent sucht IMMER zuerst in MyDispatch Docs

---

**Status:** ✅ PROJEKT-TRENNUNG AKTIV  
**Nächste Schritte:** Weitere Konfigurationen aus MyDispatch Docs suchen
