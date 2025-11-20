# 📊 PERFORMANCE TESTING GUIDE V28.1

## 🎯 ÜBERSICHT

Dieser Guide führt dich durch die Ausführung der kompletten Performance Test Suite für MyDispatch V28.1.

**Test-Scope:**

- ✅ E2E Tests (17 Tests) - Master Account Login Flow
- ✅ Lighthouse CI (10 Pre-Login Pages) - Performance, Accessibility, SEO
- ✅ Bundle Size Analysis
- ✅ Query Performance Tests

**Geschätzte Dauer:** ~25-30 Minuten

---

## 🚀 QUICK START

### Option 1: Full Test Suite (Empfohlen)

```bash
# Komplett: E2E + Lighthouse CI + Report
./scripts/run-performance-tests.sh
```

### Option 2: Nur E2E Tests (Quick)

```bash
# Nur E2E Tests (5 Min)
./scripts/quick-e2e-test.sh
```

### Option 3: Nur Lighthouse CI

```bash
# Build + Lighthouse
npm run build
npx @lhci/cli@latest autorun --config=lighthouserc.json
```

---

## 📋 PREREQUISITES CHECK

### 1. Node & Dependencies

```bash
# Node Version: ≥ 18.x
node --version

# Dependencies installiert?
npm install
```

### 2. Playwright installiert?

```bash
# Playwright Browsers installieren (falls nicht vorhanden)
npx playwright install
```

### 3. Port 5173 verfügbar?

```bash
# Dev Server Port prüfen
lsof -i :5173
# Falls belegt → killen oder anderen Port nutzen
```

### 4. Port 4173 verfügbar? (für Lighthouse)

```bash
# Preview Server Port prüfen
lsof -i :4173
# Falls belegt → killen
```

---

## 🧪 TEST EXECUTION (FULL SUITE)

### Schritt 1: Full Test Suite starten

```bash
# Mache Script ausführbar
chmod +x scripts/run-performance-tests.sh

# Starte Test Suite
./scripts/run-performance-tests.sh
```

**Was passiert:**

1. ✅ E2E Tests (5-10 Min)
   - 17 Tests für Master Account Login Flow
   - Screenshots bei Failures
   - HTML Report generiert

2. ✅ Lighthouse CI Build (3-5 Min)
   - Production Build erstellt
   - Optimierungen angewendet
   - Bundle Size analysiert

3. ✅ Lighthouse CI Tests (15-20 Min)
   - 10 Pre-Login Pages getestet
   - 3 Runs pro Page (Median-Score)
   - Performance, Accessibility, SEO, Best Practices

4. ✅ Report Generation (1-2 Min)
   - JSON Report erstellt
   - Zusammenfassung generiert
   - Issues dokumentiert

---

## 📊 EXPECTED RESULTS

### E2E Tests (PASS Criteria)

```
✅ 17/17 Tests PASSED
✅ Duration: < 5 Min
✅ 0 Failures
✅ Screenshots: Nur bei Failures
```

### Lighthouse CI (PASS Criteria)

```
Page                  Performance  Accessibility  Best Practices  SEO
─────────────────────────────────────────────────────────────────────
/                     ≥ 90         ≥ 95           ≥ 95            ≥ 95
/home                 ≥ 90         ≥ 95           ≥ 95            ≥ 95
/pricing              ≥ 90         ≥ 95           ≥ 95            ≥ 95
/features             ≥ 90         ≥ 95           ≥ 95            ≥ 95
/faq                  ≥ 90         ≥ 95           ≥ 95            ≥ 95
/contact              ≥ 90         ≥ 95           ≥ 95            ≥ 95
/unternehmer          ≥ 90         ≥ 95           ≥ 95            ≥ 95
/docs                 ≥ 90         ≥ 95           ≥ 95            ≥ 95
/legal/impressum      ≥ 90         ≥ 95           ≥ 95            ≥ 95
/legal/datenschutz    ≥ 90         ≥ 95           ≥ 95            ≥ 95
```

### Core Web Vitals

```
FCP (First Contentful Paint):     < 2.0s
LCP (Largest Contentful Paint):   < 2.5s
TBT (Total Blocking Time):        < 300ms
CLS (Cumulative Layout Shift):    < 0.1
```

---

## 📁 TEST REPORTS (Location)

Nach Execution findest du:

```
test-results/
├── performance/
│   ├── performance-report-{timestamp}.json    # Full Report
│   ├── query-performance.json                 # DB Query Results
│   └── lighthouse/
│       ├── lhr-{page}-{run}.json              # Lighthouse Reports
│       └── summary.json                       # Lighthouse Summary
│
└── playwright-report/
    ├── index.html                             # E2E Test Report (HTML)
    └── screenshots/                           # Failure Screenshots
```

---

## 🔍 REPORT ANALYSIS

### 1. E2E Test Report öffnen

```bash
# HTML Report im Browser öffnen
open test-results/playwright-report/index.html

# Oder
npx playwright show-report
```

### 2. Lighthouse Report analysieren

```bash
# Lighthouse Summary
cat test-results/performance/lighthouse/summary.json | jq
```

### 3. Performance Report lesen

```bash
# Gesamter Report
cat test-results/performance/performance-report-*.json | jq
```

---

## ⚠️ TROUBLESHOOTING

### Problem: E2E Tests fehlschlagen

**Error: "Timeout waiting for page"**

```bash
# Dev Server manuell starten (separates Terminal)
npm run dev

# Dann Tests nochmal
./scripts/quick-e2e-test.sh
```

**Error: "locator.click() failed"**

- Screenshot checken: `test-results/playwright-report/screenshots/`
- Manuell im Browser testen
- Selector möglicherweise geändert (V28.1 Migration)

---

### Problem: Lighthouse CI fehlschlägt

**Error: "Port 4173 already in use"**

```bash
# Port freigeben
kill $(lsof -t -i:4173)

# Oder anderer Port in lighthouserc.json
```

**Error: "Build failed"**

```bash
# Dependencies neu installieren
rm -rf node_modules package-lock.json
npm install

# Dann Build nochmal
npm run build
```

---

### Problem: Performance Scores < 90

**Mögliche Ursachen:**

1. **Bundle Size zu groß** (> 1.5MB)
   - Check: `dist/assets/index-*.js` Size
   - Fix: Code-Splitting verbessern

2. **Bilder nicht optimiert**
   - Check: `public/` Image Sizes
   - Fix: WebP nutzen, komprimieren

3. **Fonts zu groß**
   - Check: `public/fonts/` Size
   - Fix: Subset nutzen, preload

4. **Third-Party Scripts**
   - Check: Google Maps, HERE Maps Scripts
   - Fix: Lazy-Load implementieren

---

## 🔧 ADVANCED OPTIONS

### E2E Tests: Headed Mode (Browser sichtbar)

```bash
./scripts/quick-e2e-test.sh --headed
```

### E2E Tests: Debug Mode

```bash
./scripts/quick-e2e-test.sh --debug
```

### Lighthouse: Nur bestimmte Pages

```bash
# lighthouserc.json editieren → url[] Array anpassen
npx @lhci/cli@latest autorun --config=lighthouserc.json
```

### Performance Tests: Skip E2E

```bash
./scripts/run-performance-tests.sh --skip-e2e
```

### Performance Tests: Skip Lighthouse

```bash
./scripts/run-performance-tests.sh --skip-lighthouse
```

---

## 📚 NEXT STEPS NACH TESTS

### Wenn ALLE Tests PASSED ✅

1. **Report finalisieren**

   ```bash
   # PERFORMANCE_REPORT_V28.1.md updaten mit Results
   ```

2. **Dokumentation updaten**
   - `docs/TODO_TRACKING.md` → Performance Testing ✅
   - `docs/CHANGELOG.md` → V28.2.11 Entry
   - `docs/PROJECT_MEMORY_V28.1.md` → Status Update

3. **Commit Results**
   ```bash
   git add test-results/ docs/
   git commit -m "✅ Performance Testing V28.1 COMPLETED"
   ```

---

### Wenn Tests FAILED ❌

1. **Failure Analysis**
   - Welche Tests failed?
   - Screenshots/Reports checken
   - Root Cause identifizieren

2. **Issues dokumentieren**

   ```markdown
   # docs/PERFORMANCE_ISSUES_V28.1.md

   ## Issue #1: E2E Test "Login Flow" failed

   - Error: Timeout waiting for button
   - Screenshot: test-results/.../login-failed.png
   - Root Cause: Selector geändert nach V28.1 Migration
   - Fix: Update selector in test
   ```

3. **Fixes implementieren**
   - Code anpassen
   - Tests nochmal ausführen
   - Validieren

---

## 🎯 PERFORMANCE TARGETS (Definition of Done)

### E2E Tests

- ✅ 17/17 Tests PASSED
- ✅ Duration: < 5 Min
- ✅ 0 Failures

### Lighthouse CI

- ✅ Performance Score: ≥ 90 (alle Pages)
- ✅ Accessibility Score: ≥ 95 (alle Pages)
- ✅ Best Practices Score: ≥ 95 (alle Pages)
- ✅ SEO Score: ≥ 95 (alle Pages)

### Core Web Vitals

- ✅ FCP: < 2.0s
- ✅ LCP: < 2.5s
- ✅ TBT: < 300ms
- ✅ CLS: < 0.1

### Bundle Size

- ✅ Main Bundle: < 1.5MB
- ✅ Total Assets: < 3MB
- ✅ Code-Splitting: ✓ (Lazy Routes)

---

## 📞 SUPPORT

**Bei Problemen:**

1. Check Troubleshooting Section
2. Review Test Reports
3. Check Console Logs
4. Open GitHub Issue

**Docs:**

- Test Strategy: `TESTING_STRATEGIE_V18.1.md`
- Quality Gates: `docs/04-GOVERNANCE/Quality-Gates.md`
- Performance Report: `docs/PERFORMANCE_REPORT_V28.1.md`

---

## ✅ COMPLETION CHECKLIST

Nach erfolgreicher Test-Execution:

- [ ] E2E Tests PASSED (17/17)
- [ ] Lighthouse CI PASSED (10/10 Pages)
- [ ] Performance Report finalisiert
- [ ] Dokumentation updated
- [ ] Results committed
- [ ] TODO_TRACKING.md updated (Performance Testing ✅)
- [ ] CHANGELOG.md updated (V28.2.11)
- [ ] PROJECT_MEMORY_V28.1.md updated

---

**Version:** V28.1  
**Last Updated:** 2025-10-29  
**Status:** READY FOR EXECUTION
