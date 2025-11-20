# 🚀 DEPLOYMENT ANLEITUNG - VOLLSTÄNDIG

**Erstellt:** 2025-11-04  
**Status:** ✅ ALLE SCRIPTS ERSTELLT - BEREIT ZUR AUSFÜHRUNG

---

## ✅ WAS BEREITS ERLEDIGT IST

1. ✅ **Edge Function auf Anthropic umgestellt** (`ai-support-chat`)
2. ✅ **API-Keys in `.env.local` gespeichert**
3. ✅ **Projekt-spezifische Trennung dokumentiert**
4. ✅ **Alle Deployment-Scripts erstellt**
5. ✅ **Vollständige Dokumentation erstellt**

---

## 📋 DEPLOYMENT-SCHRITTE

### PHASE 1: Supabase Secrets setzen 🔐

**Manuell in Supabase Dashboard:**

1. Öffne: https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/settings/secrets
2. Setze folgende Secrets:

```
ANTHROPIC_API_KEY = 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
RESEND_API_KEY = re_QLd5UEuy_65ESCwqXFrSaHzuSTaS8LTGd
RESEND_DOMAIN = b899dc5b-e1e7-486e-87ef-bccece2d3002
DAILY_API_KEY = e4397b97b3227ce33788210723d0454edfbbb4bc487efe01ec372ca8cc441d72
```

### PHASE 2: Database Migrations ausführen 📊

**In Supabase Dashboard → SQL Editor:**

1. Öffne: https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/sql/new
2. Führe nacheinander aus:

```
1. supabase/migrations/20250131_nexify_master_system.sql
2. supabase/migrations/20250131_nexify_crm_system.sql
3. supabase/migrations/20250131_system_health_tables.sql
4. supabase/migrations/20250131_storage_letterheads.sql
5. supabase/migrations/20250131_email_templates_table.sql
6. supabase/migrations/20250131_cron_jobs.sql
7. supabase/migrations/20250131000003_fix_master_login.sql
```

### PHASE 3: Edge Functions deployen ⚡

**Option 1: Supabase CLI (falls installiert)**

```bash
cd C:\Users\pcour\mydispatch-rebuild
supabase functions deploy fix-master-login
supabase functions deploy nexify-auto-load-context
supabase functions deploy nexify-project-context
supabase functions deploy nexify-crm-context
supabase functions deploy nexify-crm-sync
supabase functions deploy daily-health-check
supabase functions deploy auto-fix-issues
supabase functions deploy create-master-user
supabase functions deploy ai-support-chat
```

**Option 2: Supabase Dashboard**

1. Öffne: https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/functions
2. Deploye jede Funktion einzeln

**Edge Functions:**

- ✅ `fix-master-login`
- ✅ `nexify-auto-load-context`
- ✅ `nexify-project-context`
- ✅ `nexify-crm-context`
- ✅ `nexify-crm-sync`
- ✅ `daily-health-check`
- ✅ `auto-fix-issues`
- ✅ `create-master-user`
- ✅ `ai-support-chat` (✅ bereits auf Anthropic umgestellt)

### PHASE 4: Frontend Build & Deploy 🎨

**1. Dependencies installieren:**

```bash
cd C:\Users\pcour\mydispatch-rebuild
npm install
```

**2. Build erstellen:**

```bash
npm run build
```

**3. Deploy zu Hosting:**

- Vercel/Netlify/etc. (je nach Konfiguration)

### PHASE 5: Cursor Prompt Extensions 🔧

**Manuell konfigurieren:**

1. Öffne Cursor Command Palette: `Ctrl+Shift+P`
2. Führe aus: `Configure Prompt Saver`
3. GitHub Token eingeben: `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`
4. Führe aus: `Configure Prompt Manager`
5. GitHub Token eingeben: `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`

---

## ✅ VALIDIERUNG

Nach jedem Schritt prüfen:

### Supabase Secrets

- ✅ Secrets in Dashboard sichtbar
- ✅ Keine Fehler beim Setzen

### Migrations

- ✅ Alle 7 Migrations erfolgreich ausgeführt
- ✅ Keine Fehler in SQL Editor

### Edge Functions

- ✅ Alle 9 Functions deployed
- ✅ Keine Fehler beim Deployment
- ✅ Functions in Dashboard sichtbar

### Frontend

- ✅ Build erfolgreich (`dist/` Ordner vorhanden)
- ✅ Keine Build-Fehler
- ✅ Deployed zu Hosting

### Cursor Extensions

- ✅ Prompt Saver konfiguriert
- ✅ Prompt Manager konfiguriert
- ✅ Test: Prompt speichern/laden funktioniert

---

## 📊 STATUS

**✅ Vorbereitung:** 100% abgeschlossen  
**✅ Scripts:** Alle erstellt  
**✅ Dokumentation:** Vollständig  
**⏳ Deployment:** Wartet auf manuelle Ausführung

---

## 🎯 NÄCHSTE SCHRITTE

1. ⏳ Supabase Secrets setzen (PHASE 1)
2. ⏳ Migrations ausführen (PHASE 2)
3. ⏳ Edge Functions deployen (PHASE 3)
4. ⏳ Frontend Build & Deploy (PHASE 4)
5. ⏳ Cursor Extensions konfigurieren (PHASE 5)

---

**Alle Vorbereitungen sind abgeschlossen! Deployment kann jetzt starten.** 🚀
