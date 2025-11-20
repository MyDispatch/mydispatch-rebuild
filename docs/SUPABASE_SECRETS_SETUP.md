# 🔐 SUPABASE SECRETS SETUP - ANLEITUNG

**Erstellt:** 2025-11-04  
**Status:** ⏳ AUSSTEHEND  
**Version:** 1.0.0

---

## 🎯 ZWECK

Diese Anleitung zeigt, wie API-Keys sicher in Supabase Secrets gespeichert werden.

---

## 📍 SPEICHERORT

**Supabase Dashboard → Settings → Secrets**

**URL:** `https://supabase.com/dashboard/project/[PROJECT_ID]/settings/secrets`

---

## 🔑 ZU SETZENDE SECRETS

### 1. Anthropic (Claude) API Key

**Name:** `ANTHROPIC_API_KEY`  
**Wert:** `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`  
**Verwendung:** AI Chat (ersetzt OpenAI)  
**Edge Function:** `ai-support-chat`

### 2. Resend API Key

**Name:** `RESEND_API_KEY`  
**Wert:** `re_QLd5UEuy_65ESCwqXFrSaHzuSTaS8LTGd`  
**Verwendung:** E-Mail-Versand  
**Edge Function:** Alle E-Mail-Funktionen

### 3. Resend Domain

**Name:** `RESEND_DOMAIN`  
**Wert:** `b899dc5b-e1e7-486e-87ef-bccece2d3002`  
**Verwendung:** Resend Domain-ID  
**Domain URL:** https://resend.com/domains/b899dc5b-e1e7-486e-87ef-bccece2d3002

### 4. Daily API Key (Optional)

**Name:** `DAILY_API_KEY`  
**Wert:** `e4397b97b3227ce33788210723d0454edfbbb4bc487efe01ec372ca8cc441d72`  
**Verwendung:** Daily.co Video Calls (falls Edge Functions benötigen)

---

## 📋 SCHRITT-FÜR-SCHRITT ANLEITUNG

### Schritt 1: Supabase Dashboard öffnen

1. Öffne https://supabase.com/dashboard
2. Wähle dein Projekt aus
3. Gehe zu **Settings** → **Secrets**

### Schritt 2: Secrets hinzufügen

1. Klicke auf **"Add new secret"**
2. Für jeden Secret:
   - **Name** eingeben (z.B. `ANTHROPIC_API_KEY`)
   - **Value** eingeben (den API-Key)
   - **"Add secret"** klicken

### Schritt 3: Alle Secrets setzen

Setze folgende Secrets:

```
ANTHROPIC_API_KEY = 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
RESEND_API_KEY = re_QLd5UEuy_65ESCwqXFrSaHzuSTaS8LTGd
RESEND_DOMAIN = b899dc5b-e1e7-486e-87ef-bccece2d3002
DAILY_API_KEY = e4397b97b3227ce33788210723d0454edfbbb4bc487efe01ec372ca8cc441d72
```

---

## ✅ VERIFIKATION

### Test 1: Edge Function Secret Access

```typescript
// In Edge Function:
const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
if (!anthropicApiKey) {
  throw new Error("ANTHROPIC_API_KEY not found in secrets");
}
```

### Test 2: Resend Secret Access

```typescript
// In Edge Function:
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resendDomain = Deno.env.get("RESEND_DOMAIN");
if (!resendApiKey || !resendDomain) {
  throw new Error("Resend secrets not found");
}
```

---

## 🔄 ALTE SECRETS ENTFERNEN

Falls `OPENAI_API_KEY` vorhanden ist:

1. **NICHT löschen** (falls noch benötigt)
2. **ODER** löschen und durch `ANTHROPIC_API_KEY` ersetzen

---

## 📝 NOTIZEN

- ✅ Secrets sind **NICHT** in Git
- ✅ Secrets sind **NUR** in Supabase Dashboard
- ✅ Secrets sind für **ALLE** Edge Functions verfügbar
- ✅ Secrets werden automatisch als Environment Variables geladen

---

**Status:** ⏳ WARTET AUF MANUELLE KONFIGURATION
