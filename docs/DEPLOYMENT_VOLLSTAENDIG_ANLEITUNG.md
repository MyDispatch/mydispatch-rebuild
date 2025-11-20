# 🚀 DEPLOYMENT - VOLLSTÄNDIGE ANLEITUNG

**Status:** ✅ BEREIT ZUM DEPLOYEN  
**Datum:** 2025-01-31  
**Erstellt von:** NeXify AI MASTER

---

## ✅ SCHRITT 3: DEPLOYMENT (BESTÄTIGT)

**Pascal's Bestätigung:** ✅ Deployment später durchführen

---

## 📋 DEPLOYMENT-SCHRITTE

### 1. Database Migrations (8)

**Wo:** Supabase Dashboard → SQL Editor

**Reihenfolge:**

1. `20250131_nexify_master_system.sql`
2. `20250131_nexify_crm_system.sql`
3. `20250131_system_health_tables.sql`
4. `20250131_storage_letterheads.sql`
5. `20250131_email_templates_table.sql`
6. `20250131_fix_master_login_quick.sql`
7. `20250131_cron_jobs.sql`

**Wie:**

1. Öffne Supabase Dashboard
2. Gehe zu: **SQL Editor**
3. Öffne die Migration-Datei
4. Kopiere den Inhalt
5. Füge in SQL Editor ein
6. Klicke **Run**
7. Wiederhole für alle 8 Migrations

---

### 2. Edge Functions (9)

**Wo:** Terminal (Supabase CLI)

**Voraussetzung:** Supabase CLI installiert und authentifiziert

**Befehle:**

```bash
# In Terminal (im Projektverzeichnis)
cd C:\Users\pcour\mydispatch-rebuild

# Deploye alle Functions
supabase functions deploy ai-support-chat
supabase functions deploy fix-master-login
supabase functions deploy nexify-auto-load-context
supabase functions deploy nexify-project-context
supabase functions deploy nexify-crm-context
supabase functions deploy nexify-crm-sync
supabase functions deploy daily-health-check
supabase functions deploy auto-fix-issues
supabase functions deploy create-master-user
```

**Alternativ (alle auf einmal):**

```bash
# Deploye alle Functions in einem Befehl
supabase functions deploy ai-support-chat && \
supabase functions deploy fix-master-login && \
supabase functions deploy nexify-auto-load-context && \
supabase functions deploy nexify-project-context && \
supabase functions deploy nexify-crm-context && \
supabase functions deploy nexify-crm-sync && \
supabase functions deploy daily-health-check && \
supabase functions deploy auto-fix-issues && \
supabase functions deploy create-master-user
```

---

### 3. Environment Variables

**Wo:** Supabase Dashboard → Settings → Edge Functions → Secrets

**Zu setzende Variablen:**

1. **OPENAI_API_KEY**
   - Wert: Dein OpenAI API Key
   - Zweck: Für AI-Chat-System

2. **RESEND_API_KEY**
   - Wert: Dein Resend API Key
   - Zweck: Für E-Mail-Versand

3. **RESEND_DOMAIN**
   - Wert: `mydispatch.de`
   - Zweck: E-Mail-Domain

**Wie:**

1. Öffne Supabase Dashboard
2. Gehe zu: **Settings → Edge Functions**
3. Scrolle zu: **Secrets**
4. Klicke **Add Secret**
5. Füge jede Variable hinzu
6. Klicke **Save**

---

## ✅ VERIFIKATION

### Nach Deployment prüfen:

**Migrations:**

- ✅ Alle 8 Migrations in Supabase Dashboard → Database → Tables sichtbar?

**Edge Functions:**

- ✅ Alle 9 Functions in Supabase Dashboard → Edge Functions sichtbar?

**Environment Variables:**

- ✅ Alle 3 Variablen in Settings → Edge Functions → Secrets sichtbar?

---

## 📋 DEPLOYMENT-CHECKLISTE

- [ ] Supabase CLI installiert und authentifiziert
- [ ] Database Migrations (8) ausgeführt
- [ ] Edge Functions (9) deployed
- [ ] Environment Variables (3) gesetzt
- [ ] Verifikation durchgeführt

---

**Pascal, Deployment-Anleitung ist fertig!** 🚀
