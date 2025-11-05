# 🔧 ENVIRONMENT SETUP GUIDE

**Status**: ⚠️ **KRITISCH - ENV VARS ERFORDERLICH**
**Datum**: 2025-11-05

---

## 🚨 PROBLEM IDENTIFIZIERT

Der Dev-Server benötigt Supabase Credentials in `.env.local`:

```
Error: supabaseKey is required.
```

---

## ✅ LÖSUNG

### 1. .env.local Datei erstellen/aktualisieren

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://vsbqyqhzxmwezlhzdmfd.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR_ANON_KEY_HERE>

# Optional: Service Key (nur für Backend)
SUPABASE_SERVICE_KEY=<YOUR_SERVICE_KEY_HERE>
```

### 2. Keys von Supabase Dashboard holen

1. Gehe zu: https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd
2. Settings → API
3. Kopiere `anon` public key
4. Füge in `.env.local` ein

### 3. Server neustarten

```bash
npm run dev
```

---

## 📋 VOLLSTÄNDIGE .env.local TEMPLATE

```bash
# =============================================================================
# SUPABASE CONFIGURATION
# =============================================================================
VITE_SUPABASE_URL=https://vsbqyqhzxmwezlhzdmfd.supabase.co
VITE_SUPABASE_ANON_KEY=<YOUR_ANON_KEY>

# =============================================================================
# API KEYS (Optional - für Premium Features)
# =============================================================================
# HERE Maps
VITE_HERE_API_KEY=<YOUR_HERE_API_KEY>

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=<YOUR_STRIPE_KEY>

# =============================================================================
# FEATURE FLAGS
# =============================================================================
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
```

---

## ⚡ QUICK FIX

```bash
# 1. Kopiere .env.example zu .env.local
cp .env.example .env.local

# 2. Füge deine Keys ein
code .env.local

# 3. Restart Dev Server
npm run dev
```

---

## 🔒 SECURITY HINWEIS

**NIEMALS** committen:
- ❌ `.env.local` (ist in .gitignore)
- ❌ Supabase Service Keys
- ❌ API Secrets

**IMMER** verwenden:
- ✅ Environment Variables
- ✅ Supabase Vault für Secrets
- ✅ `VITE_` Prefix für Client-Side Vars

---

**Status**: ⚠️ Keys müssen eingetragen werden
**Nächster Schritt**: Environment Variables konfigurieren
