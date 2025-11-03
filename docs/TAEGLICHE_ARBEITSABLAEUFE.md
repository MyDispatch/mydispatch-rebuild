# 📅 MyDispatch - Tägliche Arbeitsabläufe

**Erstellt:** 2025-01-31  
**Version:** 1.0.0  
**Autor:** NeXify AI MASTER  
**Status:** ✅ VOLLSTÄNDIG  
**Zweck:** Standardisierte Vorgehensweisen für tägliche Arbeiten

---

## 📋 INHALTSVERZEICHNIS

1. [Tägliche Checks](#1-tägliche-checks)
2. [Deployment-Prozesse](#2-deployment-prozesse)
3. [Feature-Entwicklung](#3-feature-entwicklung)
4. [Bug-Fixes](#4-bug-fixes)
5. [Datenbank-Änderungen](#5-datenbank-änderungen)
6. [Edge Functions](#6-edge-functions)
7. [Testing](#7-testing)
8. [Code-Review](#8-code-review)

---

## 1. TÄGLICHE CHECKS

### 1.1 Morgen-Routine (Jeden Tag)

**Zeitaufwand:** 15 Minuten

**Checkliste:**
- [ ] Supabase Dashboard öffnen
  - [ ] Edge Function Logs prüfen (Fehler?)
  - [ ] Database Performance prüfen (langsame Queries?)
  - [ ] API Usage prüfen (Limits?)
  - [ ] Storage Usage prüfen (Quota?)
- [ ] Stripe Dashboard prüfen
  - [ ] Webhook-Events prüfen (Fehler?)
  - [ ] Zahlungen prüfen (fehlgeschlagen?)
  - [ ] Subscriptions prüfen (gekündigt?)
- [ ] Error Monitoring (Sentry)
  - [ ] Neue Errors?
  - [ ] Kritische Errors?
  - [ ] Trends prüfen
- [ ] GitHub Issues prüfen
  - [ ] Neue Issues?
  - [ ] Kritische Issues?
  - [ ] Status-Updates?

**Bei Fehlern:**
1. Sofort dokumentieren
2. Priorität bestimmen (P0/P1/P2)
3. Fix planen
4. Implementieren
5. Testen
6. Deployen

---

### 1.2 Wöchentliche Checks (Montag)

**Zeitaufwand:** 30 Minuten

**Checkliste:**
- [ ] Database Backup prüfen
- [ ] Edge Functions Performance-Analyse
- [ ] API Usage Limits prüfen
- [ ] Dependencies Updates prüfen
- [ ] Security Updates prüfen
- [ ] Code-Qualität prüfen (Lighthouse)
- [ ] User-Feedback prüfen

---

## 2. DEPLOYMENT-PROZESSE

### 2.1 Frontend-Deployment

**Voraussetzungen:**
- ✅ Alle Tests bestanden
- ✅ Code-Review abgeschlossen
- ✅ Linting bestanden
- ✅ Type-Check bestanden

**Prozess:**
1. **Branch erstellen:**
   ```bash
   git checkout -b feature/meine-feature
   ```

2. **Entwicklung:**
   - Code schreiben
   - Tests schreiben
   - Linting fixen

3. **Pre-Commit:**
   ```bash
   npm run quality:check
   ```

4. **Commit & Push:**
   ```bash
   git add .
   git commit -m "feat: Meine Feature"
   git push origin feature/meine-feature
   ```

5. **Pull Request erstellen:**
   - Beschreibung
   - Screenshots (falls UI)
   - Tests bestanden
   - Checkliste abgehakt

6. **Code-Review:**
   - Reviewer prüft Code
   - Feedback beheben
   - Approve erhalten

7. **Merge:**
   - Merge zu `main`
   - Automatisches Deployment via Vercel/Netlify

8. **Verifizierung:**
   - Production-URL prüfen
   - Funktionstest durchführen
   - Monitoring prüfen

---

### 2.2 Edge Function Deployment

**Voraussetzungen:**
- ✅ Edge Function lokal getestet
- ✅ Environment Variables gesetzt
- ✅ Error-Handling implementiert

**Prozess:**
1. **Edge Function entwickeln:**
   ```bash
   cd supabase/functions/meine-function
   # Code schreiben
   ```

2. **Lokal testen:**
   ```bash
   supabase functions serve meine-function
   ```

3. **Deployen:**
   ```bash
   supabase functions deploy meine-function
   ```

4. **Verifizierung:**
   - Supabase Dashboard → Edge Functions
   - Logs prüfen
   - Test-Request senden

5. **Dokumentation:**
   - Edge Function dokumentieren
   - Environment Variables dokumentieren
   - Usage dokumentieren

---

### 2.3 Database Migration Deployment

**Voraussetzungen:**
- ✅ Migration lokal getestet
- ✅ Rollback-Strategie vorhanden
- ✅ Backup erstellt

**Prozess:**
1. **Migration erstellen:**
   ```bash
   supabase migration new meine_migration
   ```

2. **SQL schreiben:**
   ```sql
   -- Migration-Datei
   CREATE TABLE ...
   ALTER TABLE ...
   ```

3. **Lokal testen:**
   ```bash
   supabase db reset
   supabase migration up
   ```

4. **Review:**
   - SQL prüfen
   - RLS Policies prüfen
   - Performance prüfen

5. **Deployen:**
   ```bash
   supabase db push
   ```

6. **Verifizierung:**
   - Migration erfolgreich?
   - RLS Policies aktiv?
   - Daten korrekt?

---

## 3. FEATURE-ENTWICKLUNG

### 3.1 Feature-Planung

**Schritte:**
1. **Anforderung klären:**
   - Was soll das Feature machen?
   - Welche User betrifft es?
   - Welche Tarif-Beschränkung?

2. **Design prüfen:**
   - Design-System konform?
   - Responsive?
   - Accessibility?

3. **Datenbank prüfen:**
   - Braucht neue Tabellen?
   - Braucht neue Spalten?
   - RLS Policies?

4. **API prüfen:**
   - Braucht neue Edge Functions?
   - Braucht neue Endpoints?
   - Rate Limits?

5. **Testing planen:**
   - Unit Tests?
   - E2E Tests?
   - Integration Tests?

---

### 3.2 Feature-Implementierung

**Schritte:**
1. **Branch erstellen:**
   ```bash
   git checkout -b feature/meine-feature
   ```

2. **Datenbank (falls nötig):**
   - Migration erstellen
   - RLS Policies erstellen
   - Testen

3. **Backend (falls nötig):**
   - Edge Function erstellen
   - Testen
   - Deployen

4. **Frontend:**
   - Komponenten erstellen
   - Hooks erstellen
   - Tests schreiben

5. **Integration:**
   - Frontend + Backend verbinden
   - E2E Tests schreiben
   - Testen

6. **Dokumentation:**
   - Feature dokumentieren
   - API dokumentieren
   - Usage dokumentieren

---

## 4. BUG-FIXES

### 4.1 Bug-Report analysieren

**Schritte:**
1. **Bug verstehen:**
   - Was ist das Problem?
   - Wann tritt es auf?
   - Welche User betrifft es?

2. **Reproduzieren:**
   - Bug lokal reproduzieren
   - Steps dokumentieren

3. **Root Cause finden:**
   - Logs prüfen
   - Code prüfen
   - Database prüfen

4. **Fix planen:**
   - Lösung skizzieren
   - Impact-Analyse
   - Testing-Plan

---

### 4.2 Bug-Fix implementieren

**Schritte:**
1. **Branch erstellen:**
   ```bash
   git checkout -b fix/bug-beschreibung
   ```

2. **Fix implementieren:**
   - Code ändern
   - Tests anpassen
   - Dokumentation anpassen

3. **Testen:**
   - Bug reproduzieren → sollte nicht mehr auftreten
   - Regression-Tests
   - Edge Cases testen

4. **Review:**
   - Code-Review
   - Testing-Review

5. **Deployen:**
   - Merge zu `main`
   - Deployment verifizieren
   - Bug-Report schließen

---

## 5. DATENBANK-ÄNDERUNGEN

### 5.1 Neue Tabelle erstellen

**Checkliste:**
- [ ] Migration erstellen
- [ ] RLS aktivieren
- [ ] RLS Policies erstellen
- [ ] Indizes erstellen
- [ ] Foreign Keys definieren
- [ ] Constraints definieren
- [ ] Migration testen
- [ ] Rollback-Strategie dokumentieren

**Beispiel:**
```sql
-- Migration: 20250131000000_create_meine_tabelle.sql
CREATE TABLE meine_tabelle (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS aktivieren
ALTER TABLE meine_tabelle ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own company data"
ON meine_tabelle FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);
```

---

### 5.2 Spalte hinzufügen

**Checkliste:**
- [ ] Migration erstellen
- [ ] Default-Wert (falls nötig)
- [ ] NULLABLE vs NOT NULL
- [ ] Constraints (falls nötig)
- [ ] Migration testen
- [ ] Rollback-Strategie

---

## 6. EDGE FUNCTIONS

### 6.1 Neue Edge Function erstellen

**Checkliste:**
- [ ] Edge Function erstellen
- [ ] Error-Handling implementieren
- [ ] Logging implementieren
- [ ] Input-Validation
- [ ] CORS-Headers
- [ ] Environment Variables dokumentieren
- [ ] Tests schreiben
- [ ] Deployment testen

**Template:**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Function logic here

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

---

## 7. TESTING

### 7.1 Unit Tests

**Vor jedem Commit:**
```bash
npm run test:unit
```

**Test-Coverage:**
```bash
npm run test:coverage
```

**Ziel:** ≥ 80% Coverage

---

### 7.2 E2E Tests

**Vor jedem Deployment:**
```bash
npm run test:e2e
```

**Kritische Flows:**
- Login/Logout
- Booking erstellen
- Rechnung erstellen
- Subscription upgraden

---

## 8. CODE-REVIEW

### 8.1 Review-Checkliste

**Code-Qualität:**
- [ ] TypeScript korrekt?
- [ ] Linting bestanden?
- [ ] Formatting korrekt?
- [ ] Tests vorhanden?
- [ ] Tests bestanden?

**Funktionalität:**
- [ ] Feature funktioniert?
- [ ] Edge Cases abgedeckt?
- [ ] Error-Handling vorhanden?

**Performance:**
- [ ] Keine unnötigen Re-Renders?
- [ ] Queries optimiert?
- [ ] Code-Splitting?

**Security:**
- [ ] RLS Policies korrekt?
- [ ] Input-Validation?
- [ ] Secrets nicht hardcoded?

**Dokumentation:**
- [ ] Code dokumentiert?
- [ ] README aktualisiert?
- [ ] Changelog aktualisiert?

---

**Pascal, alle täglichen Arbeitsabläufe sind dokumentiert!** 🚀

