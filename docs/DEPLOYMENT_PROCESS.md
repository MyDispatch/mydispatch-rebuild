# 🚀 MyDispatch - Deployment-Prozess

**Erstellt:** 2025-01-31  
**Version:** 1.0.0  
**Autor:** NeXify AI MASTER  
**Status:** ✅ VOLLSTÄNDIG  
**Zweck:** Standardisierte Deployment-Prozesse

---

## 📋 INHALTSVERZEICHNIS

1. [Pre-Deployment Checklist](#1-pre-deployment-checklist)
2. [Frontend Deployment](#2-frontend-deployment)
3. [Edge Functions Deployment](#3-edge-functions-deployment)
4. [Database Migration Deployment](#4-database-migration-deployment)
5. [Post-Deployment Verification](#5-post-deployment-verification)
6. [Rollback-Strategien](#6-rollback-strategien)

---

## 1. PRE-DEPLOYMENT CHECKLIST

### 1.1 Code-Qualität

**Vor jedem Deployment:**
- [ ] `npm run quality:check` bestanden
- [ ] `npm run test:unit` bestanden
- [ ] `npm run test:e2e` bestanden (kritische Flows)
- [ ] `npm run type-check` bestanden
- [ ] `npm run lint` bestanden
- [ ] `npm run format:check` bestanden

**Code-Coverage:**
- [ ] Unit Tests: ≥ 80%
- [ ] E2E Tests: Kritische Flows abgedeckt

---

### 1.2 Dokumentation

- [ ] Changelog aktualisiert
- [ ] README aktualisiert (falls nötig)
- [ ] API-Dokumentation aktualisiert (falls nötig)
- [ ] Migration-Dokumentation (falls DB-Änderungen)

---

### 1.3 Security

- [ ] Secrets nicht hardcoded
- [ ] RLS Policies korrekt
- [ ] Input-Validation vorhanden
- [ ] CORS-Konfiguration korrekt

---

## 2. FRONTEND DEPLOYMENT

### 2.1 Entwicklungsumgebung

**Lokale Entwicklung:**
```bash
# Development-Server starten
npm run dev

# Tests ausführen
npm run test:unit:watch

# Build testen
npm run build
```

---

### 2.2 Git-Workflow

**Branch-Strategie:**
- `main` - Production (geschützt)
- `develop` - Development (optional)
- `feature/*` - Features
- `fix/*` - Bug-Fixes

**Prozess:**
1. **Feature-Branch erstellen:**
   ```bash
   git checkout -b feature/meine-feature
   ```

2. **Entwicklung:**
   - Code schreiben
   - Tests schreiben
   - Quality-Checks ausführen

3. **Commit:**
   ```bash
   git add .
   git commit -m "feat: Meine Feature Beschreibung"
   ```

4. **Push:**
   ```bash
   git push origin feature/meine-feature
   ```

5. **Pull Request erstellen:**
   - Titel: `feat: Meine Feature`
   - Beschreibung
   - Checkliste
   - Screenshots (falls UI)

6. **Code-Review:**
   - Reviewer prüft Code
   - Feedback beheben
   - Approve erhalten

7. **Merge:**
   - Merge zu `main`
   - Branch löschen (optional)

---

### 2.3 CI/CD Pipeline

**Automatisch:**
- Quality-Checks
- Tests
- Build
- Deployment zu Vercel/Netlify

**Manual Steps:**
- Keine (vollautomatisch)

---

## 3. EDGE FUNCTIONS DEPLOYMENT

### 3.1 Lokale Entwicklung

**Edge Function entwickeln:**
```bash
cd supabase/functions/meine-function
# Code schreiben
```

**Lokal testen:**
```bash
supabase functions serve meine-function
```

**Test-Request:**
```bash
curl -X POST http://localhost:54321/functions/v1/meine-function \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

---

### 3.2 Deployment

**Voraussetzungen:**
- ✅ Supabase CLI installiert
- ✅ Logged in: `supabase login`
- ✅ Projekt verlinkt: `supabase link --project-ref vsbqyqhzxmwezlhzdmfd`

**Deployment:**
```bash
# Edge Function deployen
supabase functions deploy meine-function

# Mit Environment Variables
supabase functions deploy meine-function --env-file .env.local
```

**Verifizierung:**
- Supabase Dashboard → Edge Functions
- Logs prüfen
- Test-Request senden

---

### 3.3 Environment Variables

**Setzen:**
```bash
# Via Supabase Dashboard
# Settings → Edge Functions → Secrets

# Oder via CLI (geplant)
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
```

**Verfügbare Variables:**
- `SUPABASE_URL` - Automatisch gesetzt
- `SUPABASE_SERVICE_ROLE_KEY` - Automatisch gesetzt
- `STRIPE_SECRET_KEY` - Manuell setzen
- `HERE_API_KEY` - Manuell setzen
- `N8N_API_KEY` - Manuell setzen

---

## 4. DATABASE MIGRATION DEPLOYMENT

### 4.1 Migration erstellen

**Neue Migration:**
```bash
supabase migration new meine_migration
```

**SQL schreiben:**
```sql
-- supabase/migrations/YYYYMMDDHHMMSS_meine_migration.sql

-- Up Migration
CREATE TABLE meine_tabelle (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE meine_tabelle ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own company data"
ON meine_tabelle FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);
```

---

### 4.2 Migration testen

**Lokal:**
```bash
# Database reset (Achtung: Löscht alle Daten!)
supabase db reset

# Migration ausführen
supabase migration up

# Verifizierung
supabase db diff
```

---

### 4.3 Migration deployen

**Production:**
```bash
# Migration deployen
supabase db push

# Oder via Supabase Dashboard
# SQL Editor → Migration kopieren → Ausführen
```

**Verifizierung:**
- Migration erfolgreich?
- RLS Policies aktiv?
- Daten korrekt?
- Performance OK?

---

### 4.4 Rollback-Strategie

**Wichtig:** Vor jeder Migration Rollback-Plan erstellen!

**Beispiel:**
```sql
-- Rollback-Migration
DROP POLICY IF EXISTS "Users can view own company data" ON meine_tabelle;
DROP TABLE IF EXISTS meine_tabelle;
```

---

## 5. POST-DEPLOYMENT VERIFICATION

### 5.1 Frontend

**Checkliste:**
- [ ] Production-URL öffnen
- [ ] Login funktioniert?
- [ ] Hauptfunktionen testen
- [ ] Mobile-Ansicht prüfen
- [ ] Performance prüfen (Lighthouse)
- [ ] Error-Console prüfen

---

### 5.2 Edge Functions

**Checkliste:**
- [ ] Edge Function Logs prüfen
- [ ] Test-Request senden
- [ ] Response korrekt?
- [ ] Error-Handling funktioniert?

---

### 5.3 Database

**Checkliste:**
- [ ] Migration erfolgreich?
- [ ] RLS Policies aktiv?
- [ ] Daten korrekt?
- [ ] Performance OK?
- [ ] Indizes vorhanden?

---

### 5.4 Monitoring

**Checkliste:**
- [ ] Error-Rate prüfen (Sentry)
- [ ] API-Usage prüfen (Supabase)
- [ ] Performance prüfen
- [ ] User-Feedback prüfen

---

## 6. ROLLBACK-STRATEGIEN

### 6.1 Frontend Rollback

**Vercel/Netlify:**
- Automatisches Rollback möglich
- Dashboard → Deployments → Previous Version

**Manual:**
```bash
# Previous Version deployen
git revert HEAD
git push origin main
```

---

### 6.2 Edge Function Rollback

**Prozess:**
1. Previous Version identifizieren
2. Code wiederherstellen
3. Neu deployen:
   ```bash
   supabase functions deploy meine-function
   ```

---

### 6.3 Database Migration Rollback

**Wichtig:** Rollback-Strategie VOR Migration!

**Prozess:**
1. Rollback-Migration erstellen
2. Migration deployen
3. Bei Problemen: Rollback ausführen

**Beispiel:**
```sql
-- Rollback-Migration
DROP POLICY IF EXISTS "Users can view own company data" ON meine_tabelle;
DROP TABLE IF EXISTS meine_tabelle;
```

---

## 📋 DEPLOYMENT-CHECKLISTE

### Pre-Deployment:
- [ ] Quality-Checks bestanden
- [ ] Tests bestanden
- [ ] Dokumentation aktualisiert
- [ ] Security-Checks bestanden

### Deployment:
- [ ] Frontend deployed
- [ ] Edge Functions deployed (falls nötig)
- [ ] Database Migration deployed (falls nötig)

### Post-Deployment:
- [ ] Verifizierung abgeschlossen
- [ ] Monitoring prüfen
- [ ] User-Feedback prüfen

---

**Pascal, alle Deployment-Prozesse sind dokumentiert!** 🚀

