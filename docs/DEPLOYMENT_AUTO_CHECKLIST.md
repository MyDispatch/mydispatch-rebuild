# ✅ AUTO-DEPLOYMENT CHECKLIST - BEI "DEPLOY" BEFEHL

**Status:** ✅ AKTIV  
**Datum:** 2025-01-31  
**Regel:** Pascal's Deployment-Regel (siehe `PASCAL_DEPLOYMENT_REGEL.md`)

---

## 🔄 AUTOMATISCHER WORKFLOW

**Wenn Pascal sagt: "Deploy" oder "Deploye" oder "Deployment"**

### Schritt 1: Status prüfen

- [ ] Lade `docs/DEPLOYMENT_STATUS.md`
- [ ] Identifiziere alle nicht-deployten Items
- [ ] Prüfe auf explizite Ausnahmen ("ohne X")

### Schritt 2: Deployment ausführen

- [ ] Database Migrations ausführen
- [ ] Edge Functions deployen
- [ ] Frontend Build & Deploy
- [ ] Konfigurationen anwenden

### Schritt 3: Status aktualisieren

- [ ] Update `docs/DEPLOYMENT_STATUS.md`
- [ ] Markiere deployed Items als ✅
- [ ] Notiere Deployment-Datum

### Schritt 4: Validierung

- [ ] Funktionen testen
- [ ] Fehler prüfen
- [ ] Logs überprüfen

---

## 📋 VOLLSTÄNDIGE CHECKLIST

### Database Migrations (7)

- [ ] `20250131_nexify_master_system.sql`
- [ ] `20250131_nexify_crm_system.sql`
- [ ] `20250131_system_health_tables.sql`
- [ ] `20250131_storage_letterheads.sql`
- [ ] `20250131_cron_jobs.sql`
- [ ] `20250131000003_fix_master_login.sql`
- [ ] `20250131000000_nexify_ai_master_database.sql`

### Edge Functions (8)

- [ ] `fix-master-login`
- [ ] `nexify-auto-load-context`
- [ ] `nexify-project-context`
- [ ] `nexify-crm-context`
- [ ] `nexify-crm-sync`
- [ ] `daily-health-check`
- [ ] `auto-fix-issues`
- [ ] `create-master-user`

### Frontend Code (5)

- [ ] `src/components/ErrorBoundary.tsx`
- [ ] `src/components/settings/LetterheadUpload.tsx`
- [ ] `src/lib/email-templates-branded.ts`
- [ ] `src/App.tsx` (ErrorBoundary Integration)
- [ ] `src/components/settings/BrandingSection.tsx` (LetterheadUpload Integration)

### Konfigurationen (4)

- [ ] Environment Variables (Sentry DSN)
- [ ] Storage Bucket `company-letterheads`
- [ ] Cron Jobs (4 Jobs: health-check + auto-fix, je 2x täglich)
- [ ] RLS Policies für neue Tables

---

## 📊 DEPLOYMENT-STATUS TRACKING

**Nach jedem Deployment:**

1. ✅ Item in `DEPLOYMENT_STATUS.md` markieren
2. ✅ Deployment-Datum notieren
3. ✅ Status auf ✅ DEPLOYED setzen

---

**Diese Checkliste wird bei jedem "Deploy" Befehl automatisch verwendet!** 🚀
