# MyDispatch TODO - Offene Punkte & Fehleranalyse

**Stand:** 24. November 2025
**Version:** V33.7
**Status:** Production-Ready mit offenen Optimierungen

---

## 🔴 **KRITISCH (Production-Blocker)**

### 1. Edge Functions Deployment (MANUELL ERFORDERLICH)

**Status:** ⚠️ Code fertig, aber nicht deployed

**Betroffene Functions:**

- `create-checkout` - Stripe Checkout Session
- `stripe-webhook` - Webhook Handler für Payments

**Fehler-Ursprung:**

- Supabase CLI Login erforderlich: `supabase login`
- Secrets müssen manuell gesetzt werden

**Auswirkung:**

- ❌ Payment-First Registration funktioniert nicht
- ❌ Keine Stripe-Integration aktiv
- ❌ Users können sich nicht registrieren

**Lösung:**

```bash
# 1. Supabase CLI Login
supabase login

# 2. Deploy Edge Functions
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook

# 3. Secrets setzen
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_PUBLISHABLE_KEY=pk_live_...

# 4. Test
curl https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/create-checkout \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"tier": "starter"}'
```

**Geschätzter Aufwand:** 15-20 Minuten (manuell)

---

### 2. Supabase Database Types unvollständig

**Status:** ⚠️ Basis-Schema vorhanden, aber nicht komplett

**Datei:** `src/integrations/supabase/types.ts`

**Fehler-Ursprung:**

- Korrupte Datei wurde durch Minimal-Schema ersetzt
- Vollständige Types müssen aus Supabase Dashboard generiert werden

**Aktueller Zustand:**

```typescript
export interface Database {
  public: {
    Tables: {
      [_ in never]: never; // ❌ LEER - sollte alle Tabellen enthalten
    };
  };
}
```

**Auswirkung:**

- ⚠️ Keine Type-Safety für Supabase-Queries
- ⚠️ Autocomplete funktioniert nicht
- ⚠️ Type-Errors werden nicht erkannt

**Lösung:**

```bash
# Option 1: Via Supabase Dashboard
# Settings → API → Generate TypeScript Types
# Kopieren → Einfügen in src/integrations/supabase/types.ts

# Option 2: Via CLI (wenn Login funktioniert)
supabase login
npx supabase gen types typescript --project-id ygpwuiygivxoqtyoigtg > src/integrations/supabase/types.ts
```

**Geschätzter Aufwand:** 5 Minuten

---

### 3. Dependabot Security Vulnerabilities

**Status:** ⚠️ 3 Vulnerabilities erkannt

**Details:**

- 1x HIGH Severity
- 2x MODERATE Severity

**Link:** https://github.com/MyDispatch/mydispatch-rebuild/security/dependabot

**Fehler-Ursprung:**

- Veraltete npm-Packages mit bekannten Sicherheitslücken

**Auswirkung:**

- 🔒 Potenzielle Sicherheitsrisiken
- 🔒 Compliance-Issues

**Lösung:**

```bash
# 1. Vulnerabilities anzeigen
npm audit

# 2. Auto-fix versuchen
npm audit fix

# 3. Falls Breaking Changes:
npm audit fix --force
# Dann: Tests laufen lassen + manuell prüfen

# 4. Alternativ: Dependabot PRs mergen
# GitHub → Security → Dependabot alerts → Review PRs
```

**Geschätzter Aufwand:** 30-60 Minuten

---

## 🟡 **MEDIUM PRIORITY (Performance & Code Quality)**

### 4. Code-Splitting für große Chunks

**Status:** ⚠️ Build erfolgreich, aber Chunks zu groß

**Problem:**

```
export-libs-itdtIZ7W.js: 1,507 KB (423 KB gzipped) ⚠️
charts-z1p_2UdF.js: 411 KB (104 KB gzipped) ⚠️
```

**Fehler-Ursprung:**

- XLSX, jsPDF, Recharts werden zusammen gebundelt
- Keine dynamischen Imports

**Auswirkung:**

- 🐢 Langsamere Initial Page Load (1.5 MB Export-Libs)
- 🐢 Schlechte Web Vitals (LCP)

**Lösung:**

**Vite Config anpassen:**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          xlsx: ["xlsx"],
          jspdf: ["jspdf", "jspdf-autotable"],
          recharts: ["recharts"],
          "react-vendor": ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
```

**Dynamic Imports hinzufügen:**

```typescript
// In Export-Komponenten
const exportToExcel = async (data: any[]) => {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  // ... rest of code
};
```

**Geschätzter Aufwand:** 1-2 Stunden

---

### 5. Unused Variables Cleanup (~765 Warnings)

**Status:** ⚠️ Nicht kritisch, aber Code-Qualität

**Top-Dateien mit Warnings:**

- `src/pages/Kunden.tsx` - 11 warnings
- `src/pages/Fahrer.tsx` - 8 warnings
- `src/pages/Partner.tsx` - 6 warnings
- `src/pages/Rechnungen.tsx` - 5 warnings
- Weitere ~735 warnings verteilt

**Fehler-Ursprung:**

- Über-Import während schneller Entwicklung
- Legacy-Code nach Refactoring
- Unused interface declarations

**Auswirkung:**

- ❌ KEINE - Build funktioniert (nur ESLint Warnings)
- Code-Qualität reduziert

**Lösung:**

```bash
# Systematisch durchgehen:
1. Kunden.tsx cleanup (11 warnings)
2. Fahrer.tsx cleanup (8 warnings)
3. Partner.tsx cleanup (6 warnings)
4. Rest der Dateien (5-10 pro Session)

# Oder: ESLint auto-fix
npm run lint:fix
```

**Geschätzter Aufwand:** 4-6 Stunden (nicht dringend)

---

### 6. Test Coverage erhöhen

**Status:** ⚠️ 142 Tests passing, aber nur ~65% Coverage

**Fehler-Ursprung:**

- Schnelle Feature-Entwicklung
- Fehlende Tests für neue Components
- E2E-Tests unvollständig

**Kritische Lücken:**

- Edge Functions: Nicht getestet
- Payment Flow: Nicht getestet
- Realtime Features: Teilweise getestet

**Lösung:**

```bash
# Tests schreiben für:
1. Edge Functions (Unit Tests mit Deno Test)
2. Payment Flow (Integration Tests)
3. Realtime Subscriptions (Mock Tests)
4. Auth Flow (E2E Tests)

# Coverage-Report:
npm run test:coverage
```

**Geschätzter Aufwand:** 1 Woche

---

## 🟢 **LOW PRIORITY (Nice-to-Have)**

### 7. Edge Functions Placeholder-Code vervollständigen

**Status:** ⚠️ Funktional, aber nicht perfekt

**Betroffene Functions:**

#### a) `send-booking-pdf/index.ts:284`

```typescript
// Generate PDF from HTML (Placeholder - use actual PDF service in production)
```

**Fehler:** Nutzt einfachen HTML → PDF Converter
**Besser:** Nutze jsPDF oder dediziertes PDF-Service

#### b) `export-shift-pdf/index.ts:4`

```typescript
// Exportiert Schichtzettel als PDF (Placeholder - Basis-Implementation)
```

**Fehler:** Basis-Implementation ohne Layout
**Besser:** Professionelles PDF-Template

#### c) `bulk-export-pdf/index.ts:129`

```typescript
download_url: `${supabaseUrl}/storage/v1/object/public/documents/exports/bulk_${Date.now()}.zip`, // Placeholder
```

**Fehler:** URL wird nicht validiert
**Besser:** Prüfe ob File existiert + generiere signierte URL

#### d) `send-data-export/index.ts:111`

```typescript
attachmentContent = Buffer.from(JSON.stringify(exportData, null, 2)).toString("base64"); // Placeholder
```

**Fehler:** JSON statt XLSX/PDF
**Besser:** Echtes XLSX-Export via xlsx package

#### e) `ai-agent-poll/index.ts:254`

```typescript
// TASK HANDLERS (Placeholder implementations)
```

**Fehler:** Task-Execution nicht implementiert
**Besser:** Echte Task-Handler für autonome Tasks

#### f) `ai-demand-prediction/index.ts:177`

```typescript
// Check for weather (placeholder - could integrate weather API)
```

**Fehler:** Keine Wetter-Integration
**Besser:** OpenWeatherMap API integration

#### g) `system-audit/index.ts:114`

```typescript
const ciCompliance = 95; // Placeholder
```

**Fehler:** Hardcoded Wert
**Besser:** Echte CI/CD Metriken von GitHub Actions

#### h) `central-brain/index.ts:248`

```typescript
// 3. Execute task (placeholder for actual task execution)
```

**Fehler:** Task-Execution nicht implementiert
**Besser:** Task-Queue mit echten Handlern

**Geschätzter Aufwand:** 3-4 Stunden pro Function (24-32h gesamt)

---

### 8. "Coming Soon" Features implementieren

**Status:** ⚠️ UI vorhanden, aber Features fehlen

**Datei:** `src/pages/KIAssistent.tsx`

**9 Features mit "Coming Soon" Status:**

```typescript
Line 120: Chat starten (Coming Soon)
Line 140: Konfigurieren (Coming Soon)
Line 157: Aktivieren (Coming Soon)
Line 174: Einrichten (Coming Soon)
Line 191: Aktivieren (Coming Soon)
Line 210: Insights generieren (Coming Soon)
```

**Fehler-Ursprung:**

- KI-Features sind Business/Enterprise-Plan Features
- Noch nicht implementiert (Roadmap Q1 2026)

**Benötigt:**

- OpenAI API Integration
- AI-Chat Backend (Edge Function)
- Smart Assignment Algorithmus
- Demand Prediction ML-Model
- Performance Analytics

**Geschätzter Aufwand:** 2-3 Wochen (größeres Feature)

---

### 9. Internationalisierung (i18n)

**Status:** ❌ Nicht implementiert

**Fehler-Ursprung:**

- App nur auf Deutsch entwickelt
- Keine i18n-Library integriert

**Auswirkung:**

- Keine Mehrsprachigkeit
- Schwierig für internationale Expansion

**Lösung:**

```bash
# 1. react-i18next installieren
npm install react-i18next i18next

# 2. Translations erstellen
src/locales/
  de/
    common.json
    pages.json
  en/
    common.json
    pages.json

# 3. Alle Strings ersetzen
"Aufträge" → {t('pages.bookings.title')}
```

**Geschätzter Aufwand:** 1 Woche

---

### 10. Accessibility Improvements

**Status:** ⚠️ Basis-WCAG-Compliance, aber Optimierung möglich

**Fehler-Ursprung:**

- Schnelle Entwicklung
- Fehlende aria-labels bei einigen Buttons
- Keyboard-Navigation teilweise suboptimal

**Konkrete TODOs:**

```typescript
// Missing aria-labels
<Button onClick={onCreate}>
  <Plus /> Erstellen  // ❌ Icon-only für Screen Reader unklar
</Button>

// ✅ Besser:
<Button onClick={onCreate} aria-label="Neuen Auftrag erstellen">
  <Plus /> Erstellen
</Button>
```

**Geschätzter Aufwand:** 2-3 Stunden

---

## 📋 **DOKUMENTATIONS-LÜCKEN**

### 11. Fehlende Demo-Accounts Seed-Daten

**Status:** ❌ SQL-File referenziert, aber nicht vorhanden

**Datei:** `supabase/seed_demo_accounts.sql` (FEHLT)

**Fehler-Ursprung:**

- Referenziert in `DEPLOYMENT_PAYMENT_FIRST_SYSTEM.md:171`
- Nie erstellt

**Benötigt:**

```sql
-- seed_demo_accounts.sql
INSERT INTO auth.users (email, encrypted_password) VALUES
  ('demo@my-dispatch.de', crypt('Demo123!', gen_salt('bf'))),
  ('test@my-dispatch.de', crypt('Test123!', gen_salt('bf')));

INSERT INTO profiles (user_id, first_name, last_name, company_id) VALUES
  -- ... demo profiles
```

**Geschätzter Aufwand:** 30 Minuten

---

### 12. Stripe Enterprise Product ID Placeholder

**Status:** ⚠️ Placeholder-Wert aktiv

**Datei:** `supabase/functions/sync-tariff-to-stripe/index.ts:44`

```typescript
enterprise: "prod_ENTERPRISE_ID_PLACEHOLDER";
```

**Fehler-Ursprung:**

- Stripe Enterprise Plan noch nicht in Stripe Dashboard angelegt

**Lösung:**

```bash
# 1. In Stripe Dashboard: Product erstellen
# 2. Product ID kopieren
# 3. Placeholder ersetzen:
enterprise: "prod_ABC123XYZ"
```

**Geschätzter Aufwand:** 10 Minuten

---

## 🔍 **FEHLERURSACHEN-ANALYSE**

### Hauptursachen für offene Punkte:

#### 1. **Manuelle Deployment-Schritte**

**Ursache:** Supabase CLI Login + Secrets Management
**Betroffene:** Edge Functions, Stripe Integration
**Lösung:** Automation via GitHub Actions oder manuell durchführen

#### 2. **Schnelle Feature-Entwicklung**

**Ursache:** Focus auf MVP statt perfekte Code-Qualität
**Betroffene:** Unused Variables, Test Coverage, Placeholder-Code
**Lösung:** Systematisches Cleanup in Sprints

#### 3. **Fehlende CI/CD-Automation**

**Ursache:** Manuelle Steps nicht in Pipeline integriert
**Betroffene:** Type-Generation, Dependency Updates, Security Scans
**Lösung:** GitHub Actions Workflows erweitern

#### 4. **Incomplete Type-Safety**

**Ursache:** Korrupte types.ts durch fehlerhafte Generation
**Betroffene:** Supabase Queries, Type-Checking
**Lösung:** Neue Type-Generation aus Supabase Dashboard

---

## 🎯 **PRIORISIERUNGS-MATRIX**

### **SOFORT (heute):**

1. ✅ Kritische TypeScript-Fehler behoben
2. ✅ tsconfig.app.json korrigiert
3. ⏳ Supabase Types vervollständigen (5 min)
4. ⏳ Dependabot Alerts reviewen (30 min)

### **DIESE WOCHE:**

1. Edge Functions deployen (15 min)
2. Stripe Secrets setzen (10 min)
3. Code-Splitting implementieren (2h)
4. Demo-Accounts Seed erstellen (30 min)

### **DIESEN MONAT:**

1. Unused Variables Cleanup (4-6h)
2. Placeholder-Code in Edge Functions (24h)
3. Test Coverage erhöhen auf 80% (1 Woche)
4. Accessibility Audit + Fixes (3h)

### **Q1 2026 (Roadmap):**

1. KI-Features implementieren (2-3 Wochen)
2. Internationalisierung (i18n) (1 Woche)
3. Advanced Analytics (1 Woche)
4. Performance Optimizations (1 Woche)

---

## 📊 **METRIKEN & FORTSCHRITT**

### **Code Quality:**

- TypeScript Errors: **0** ✅
- TypeScript Warnings: **~765** ⚠️ (Target: <100)
- Test Coverage: **65%** ⚠️ (Target: 80%)
- Security Vulnerabilities: **3** ⚠️ (Target: 0)

### **Performance:**

- Build Time: **1m 22s** ✅
- Largest Chunk: **1.5 MB** ⚠️ (Target: <500KB)
- Lighthouse Score: **Nicht gemessen** ❌

### **Functionality:**

- Core Features: **100%** ✅
- Payment Integration: **0%** ❌ (Edge Functions nicht deployed)
- AI Features: **0%** ⏳ (Roadmap Q1 2026)

---

## 🚀 **NÄCHSTE SCHRITTE (Empfohlene Reihenfolge)**

1. **Supabase Types vervollständigen** (5 min) - KRITISCH
2. **Edge Functions deployen** (15 min) - BLOCKER
3. **Dependabot Alerts beheben** (30 min) - SICHERHEIT
4. **Code-Splitting implementieren** (2h) - PERFORMANCE
5. **Demo-Accounts Seed erstellen** (30 min) - DEPLOYMENT
6. **Unused Variables Cleanup** (4-6h) - CODE QUALITY
7. **Test Coverage erhöhen** (1 Woche) - STABILITÄT

---

**Letzte Aktualisierung:** 24. November 2025, 05:30 Uhr
**Nächster Review:** Nach Edge Functions Deployment
**Status:** Production-Ready mit 3 kritischen Blockern
