# PRÜF- & VALIDIERUNGS-SYSTEM V18.5.0

> **Version:** 18.5.0  
> **Status:** ✅ VERBINDLICH  
> **Zweck:** Automatisierte Qualitätssicherung für MyDispatch

---

## 🎯 ÜBERSICHT

Jeder Code-Change, jedes Feature, jedes Deployment MUSS durch ein mehrstufiges Prüfsystem laufen. Keine Ausnahmen!

**Prüfstufen:**

1. **Pre-Commit**: Lokale Checks vor Git-Commit
2. **CI/CD Pipeline**: Automatisierte Tests bei Push
3. **Manual Review**: Screenshot-Validierung & UAT
4. **Post-Deployment**: Live-Monitoring & Health-Checks

---

## 📋 PRÜFSTUFE 1: PRE-COMMIT CHECKS

### **A. TypeScript Validation**

```bash
# Pflicht vor jedem Commit
npm run type-check

# Expected Output:
# ✅ 0 Errors
# ✅ 0 Warnings

# Falls Errors:
# ❌ FIX BEFORE COMMIT!
```

**Husky Pre-Commit Hook:**

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running Pre-Commit Checks..."

# TypeScript Check
npm run type-check || {
  echo "❌ TypeScript Errors found. Commit blocked!"
  exit 1
}

# ESLint Check
npm run lint || {
  echo "❌ ESLint Errors found. Commit blocked!"
  exit 1
}

# Design-System Audit
node scripts/design-system-audit.js || {
  echo "❌ Design-System Violations found. Commit blocked!"
  exit 1
}

echo "✅ All Pre-Commit Checks passed!"
```

### **B. Design-System Audit**

```typescript
// scripts/design-system-audit.ts
import { glob } from "glob";
import { readFileSync } from "fs";

const FORBIDDEN_PATTERNS = [
  /bg-white(?![a-z])/, // bg-white (aber nicht bg-white/10)
  /bg-black(?![a-z])/, // bg-black
  /text-white(?![a-z])/, // text-white
  /text-black(?![a-z])/, // text-black
  /text-\[#[0-9a-fA-F]+\]/, // text-[#fff]
  /bg-\[#[0-9a-fA-F]+\]/, // bg-[#000]
  /border-\[#[0-9a-fA-F]+\]/, // border-[#ccc]
];

async function auditDesignSystem() {
  const files = await glob("src/**/*.{tsx,ts}");
  const violations: Array<{ file: string; line: number; match: string }> = [];

  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      FORBIDDEN_PATTERNS.forEach((pattern) => {
        if (pattern.test(line)) {
          violations.push({
            file,
            line: index + 1,
            match: line.match(pattern)?.[0] || "unknown",
          });
        }
      });
    });
  }

  if (violations.length > 0) {
    console.error("❌ Design-System Violations found:\n");
    violations.forEach((v) => {
      console.error(`  ${v.file}:${v.line} - ${v.match}`);
    });
    process.exit(1);
  }

  console.log("✅ Design-System Audit passed!");
}

auditDesignSystem();
```

### **C. Security Scan**

```bash
# Supabase RLS Policy Check
npx supabase db lint --linked

# Expected Output:
# ✅ 0 CRITICAL Issues
# ⚠️  Warnings acceptable (with justification)

# Check for auth.users references (FORBIDDEN!)
psql $SUPABASE_DB_URL -c "
  SELECT policyname, qual::text
  FROM pg_policies
  WHERE qual::text LIKE '%auth.users%'
" | grep -q "0 rows" || {
  echo "❌ auth.users found in RLS policies!"
  exit 1
}
```

---

## 📋 PRÜFSTUFE 2: CI/CD PIPELINE

### **GitHub Workflow: `.github/workflows/ci-cd-pipeline.yml`**

```yaml
name: CI/CD Pipeline - MyDispatch V18.5.0

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Job 1: Code Quality
  code-quality:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install Dependencies
        run: npm ci

      - name: TypeScript Check
        run: npm run type-check

      - name: ESLint Check
        run: npm run lint

      - name: Design-System Audit
        run: node scripts/design-system-audit.js

  # Job 2: Security Scan
  security-scan:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4

      - name: Supabase CLI Setup
        uses: supabase/setup-cli@v1

      - name: RLS Policy Check
        run: npx supabase db lint --linked
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}

      - name: Check for auth.users
        run: |
          result=$(psql ${{ secrets.SUPABASE_DB_URL }} -t -c "
            SELECT COUNT(*) 
            FROM pg_policies 
            WHERE qual::text LIKE '%auth.users%'
          ")
          if [ "$result" -gt 0 ]; then
            echo "❌ auth.users found in RLS policies!"
            exit 1
          fi

  # Job 3: AI Code Review
  ai-code-review:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: [code-quality, security-scan]
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Full history for diff

      - name: Get Changed Files
        id: changed-files
        run: |
          git diff --name-only ${{ github.event.before }} ${{ github.sha }} > changed_files.txt
          cat changed_files.txt

      - name: AI Code Review (Claude Sonnet 4.5)
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: |
          curl -X POST ${{ secrets.SUPABASE_URL }}/functions/v1/ai-code-review \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Content-Type: application/json" \
            -d "{
              \"pr_number\": \"${{ github.event.pull_request.number }}\",
              \"changed_files\": $(cat changed_files.txt | jq -R -s -c 'split(\"\n\")[:-1]')
            }" \
            -o ai_review_result.json

      - name: Check Review Result
        run: |
          status=$(jq -r '.status' ai_review_result.json)
          if [ "$status" = "BLOCKED" ]; then
            echo "❌ AI Code Review BLOCKED deployment!"
            jq '.issues[] | select(.severity == "CRITICAL")' ai_review_result.json
            exit 1
          fi

          if [ "$status" = "CHANGES_REQUESTED" ]; then
            echo "⚠️  AI Code Review requests changes:"
            jq '.issues[]' ai_review_result.json
            exit 1
          fi

          echo "✅ AI Code Review APPROVED!"

  # Job 4: Unit Tests
  unit-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install Dependencies
        run: npm ci

      - name: Run Unit Tests
        run: npm run test:unit -- --coverage

      - name: Upload Coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage-final.json

  # Job 5: E2E Tests
  e2e-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install Dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E Tests
        run: npm run test:e2e
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/

  # Job 6: Lighthouse Performance
  lighthouse:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: [code-quality, security-scan, ai-code-review]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install Dependencies
        run: npm ci

      - name: Build App
        run: npm run build

      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:4173/
            http://localhost:4173/auftraege
            http://localhost:4173/fahrer
          uploadArtifacts: true
          temporaryPublicStorage: true

  # Job 7: Bundle Size Check
  bundle-size:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install Dependencies
        run: npm ci

      - name: Build App
        run: npm run build

      - name: Check Bundle Size
        run: |
          size=$(du -sh dist/assets/*.js | awk '{print $1}')
          echo "Bundle Size: $size"

          # Max 1.5MB
          size_bytes=$(du -sb dist/assets/*.js | awk '{sum += $1} END {print sum}')
          max_size=1572864 # 1.5MB in bytes

          if [ "$size_bytes" -gt "$max_size" ]; then
            echo "❌ Bundle size exceeds 1.5MB limit!"
            exit 1
          fi

          echo "✅ Bundle size OK!"

  # Job 8: Deploy (only on main branch)
  deploy:
    runs-on: ubuntu-latest
    needs: [unit-tests, e2e-tests, lighthouse, bundle-size]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Lovable
        run: |
          echo "✅ Deployment triggered automatically via Lovable"

      - name: Post Deployment Metrics
        env:
          DATADOC_KEY_ID: ${{ secrets.DATADOC_KEY_ID }}
          DATADOC_API_KEY: ${{ secrets.DATADOC_API_KEY }}
        run: |
          curl -X POST https://api.datadoc.com/v1/metrics \
            -H "X-API-Key-ID: $DATADOC_KEY_ID" \
            -H "X-API-Key: $DATADOC_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "name": "ci.deployment.success",
              "value": 1,
              "tags": {
                "environment": "production",
                "version": "18.5.0"
              }
            }'
```

---

## 📋 PRÜFSTUFE 3: MANUAL REVIEW

### **A. Screenshot-Validierung (Pflicht)**

```typescript
// scripts/screenshot-validation.ts
import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { compareImages } from "resemblejs";

interface ScreenshotTest {
  name: string;
  url: string;
  viewport: { width: number; height: number };
  selector?: string;
  threshold?: number; // Max 5% difference
}

const SCREENSHOT_TESTS: ScreenshotTest[] = [
  {
    name: "dashboard-desktop",
    url: "/",
    viewport: { width: 1920, height: 1080 },
    threshold: 0.05,
  },
  {
    name: "dashboard-mobile",
    url: "/",
    viewport: { width: 375, height: 812 },
    threshold: 0.05,
  },
  {
    name: "auftraege-page",
    url: "/auftraege",
    viewport: { width: 1920, height: 1080 },
    threshold: 0.05,
  },
  {
    name: "booking-form",
    url: "/auftraege",
    viewport: { width: 1920, height: 1080 },
    selector: '[data-testid="booking-form"]',
    threshold: 0.03,
  },
];

async function runScreenshotValidation() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  let failed = 0;

  for (const test of SCREENSHOT_TESTS) {
    console.log(`\n📸 Testing: ${test.name}`);

    await page.setViewportSize(test.viewport);
    await page.goto(`http://localhost:4173${test.url}`);

    // Wait for page load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000); // Extra stabilization

    const screenshotPath = `screenshots/${test.name}-current.png`;
    const baselinePath = `screenshots/${test.name}-baseline.png`;

    if (test.selector) {
      await page.locator(test.selector).screenshot({ path: screenshotPath });
    } else {
      await page.screenshot({ path: screenshotPath, fullPage: true });
    }

    // Compare with baseline
    if (existsSync(baselinePath)) {
      const comparison = await compareImages(
        readFileSync(baselinePath),
        readFileSync(screenshotPath),
        { threshold: test.threshold }
      );

      const diffPercent = comparison.rawMisMatchPercentage;

      if (diffPercent > (test.threshold || 0.05) * 100) {
        console.error(`❌ Visual regression detected: ${diffPercent.toFixed(2)}% difference`);
        writeFileSync(`screenshots/${test.name}-diff.png`, comparison.getBuffer());
        failed++;
      } else {
        console.log(`✅ Visual test passed: ${diffPercent.toFixed(2)}% difference`);
      }
    } else {
      console.log(`📝 Creating baseline: ${baselinePath}`);
      writeFileSync(baselinePath, readFileSync(screenshotPath));
    }
  }

  await browser.close();

  if (failed > 0) {
    console.error(`\n❌ ${failed} visual regression tests failed!`);
    process.exit(1);
  }

  console.log("\n✅ All screenshot validations passed!");
}

runScreenshotValidation();
```

**Usage:**

```bash
# Nach jedem größeren Code-Change
npm run build
npm run preview & # Start preview server
npm run test:screenshots

# Expected Output:
# ✅ All screenshot validations passed!
```

### **B. User Acceptance Test (UAT)**

```markdown
# UAT Checklist - Feature: {FEATURE_NAME}

## Vorbereitung

- [ ] Feature in Staging-Environment deployed
- [ ] Test-User mit Business+ Tarif angelegt
- [ ] Screenshots der erwarteten UI vorbereitet

## Functional Tests

- [ ] Feature ist erreichbar (Link/Button funktioniert)
- [ ] Formular-Validierung funktioniert korrekt
- [ ] Daten werden korrekt gespeichert (DB-Check)
- [ ] Fehlerbehandlung funktioniert (Toast-Nachricht)
- [ ] Loading-States werden angezeigt

## Design Tests

- [ ] Pixelgenau mit Design-Vorgaben (Screenshot-Vergleich)
- [ ] Semantic Tokens verwendet (keine direkten Farben)
- [ ] Responsive auf Mobile (iPhone 13 Test)
- [ ] Dark/Light Mode funktioniert
- [ ] WCAG 2.1 AA Kontraste (min 4.5:1)

## Security Tests

- [ ] company_id Filter aktiv (andere Mandanten sehen keine Daten)
- [ ] RLS Policies greifen (direkter DB-Zugriff blockiert)
- [ ] Input-Validation mit Zod (SQL-Injection-Schutz)
- [ ] Auth-Check (nicht eingeloggte User werden redirected)

## Performance Tests

- [ ] Erste Ladung <2s (Network-Tab prüfen)
- [ ] React Query Caching aktiv (zweite Ladung <500ms)
- [ ] Keine Memory-Leaks (Chrome DevTools Memory-Profiler)
- [ ] Lazy-Loading funktioniert (nur benötigte Komponenten geladen)

## Edge Cases

- [ ] Leere Daten (keine Fehler bei leerer Liste)
- [ ] Sehr lange Texte (UI bricht nicht)
- [ ] Offline-Modus (Fehlermeldung angezeigt)
- [ ] Langsame Verbindung (Loading-State bleibt sichtbar)

## Browser-Compatibility

- [ ] Chrome (aktuellste Version)
- [ ] Firefox (aktuellste Version)
- [ ] Safari (iOS 16+)
- [ ] Edge (aktuellste Version)

## Tarif-Gate (falls relevant)

- [ ] Feature nur für Business+ sichtbar
- [ ] Basic-User sehen Upgrade-Hinweis
- [ ] Feature-Gate in RLS Policy vorhanden

---

**Tester:** {NAME}
**Datum:** {YYYY-MM-DD}
**Status:** ✅ APPROVED / ⚠️ CHANGES NEEDED / ❌ BLOCKED
**Kommentar:** {OPTIONAL}
```

---

## 📋 PRÜFSTUFE 4: POST-DEPLOYMENT

### **A. Health-Check (Automatisiert)**

```typescript
// scripts/health-check.ts
import fetch from "node-fetch";

interface HealthCheck {
  name: string;
  url: string;
  expectedStatus: number;
  timeout: number;
}

const HEALTH_CHECKS: HealthCheck[] = [
  {
    name: "App Homepage",
    url: "https://YOUR_APP.lovable.app/",
    expectedStatus: 200,
    timeout: 5000,
  },
  {
    name: "Dashboard",
    url: "https://YOUR_APP.lovable.app/",
    expectedStatus: 200,
    timeout: 5000,
  },
  {
    name: "API Health",
    url: "https://YOUR_APP.lovable.app/api/health",
    expectedStatus: 200,
    timeout: 3000,
  },
];

async function runHealthChecks() {
  console.log("🏥 Running Post-Deployment Health Checks...\n");

  let failed = 0;

  for (const check of HEALTH_CHECKS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), check.timeout);

      const response = await fetch(check.url, {
        signal: controller.signal,
        headers: { "User-Agent": "MyDispatch-HealthCheck/1.0" },
      });

      clearTimeout(timeout);

      if (response.status === check.expectedStatus) {
        console.log(`✅ ${check.name}: OK (${response.status})`);
      } else {
        console.error(`❌ ${check.name}: FAILED (${response.status})`);
        failed++;
      }
    } catch (error) {
      console.error(`❌ ${check.name}: ERROR (${error.message})`);
      failed++;
    }
  }

  if (failed > 0) {
    console.error(`\n❌ ${failed} health checks failed!`);
    process.exit(1);
  }

  console.log("\n✅ All health checks passed!");
}

runHealthChecks();
```

### **B. Live-Monitoring (Sentry + Datadoc)**

```typescript
// lib/post-deployment-monitoring.ts
import * as Sentry from "@sentry/react";
import { datadoc } from "./datadoc-client";

export function startPostDeploymentMonitoring() {
  const deploymentTime = new Date();
  const monitoringDuration = 30 * 60 * 1000; // 30 Minuten

  console.log("📊 Post-Deployment Monitoring gestartet (30 Minuten)");

  // Track Errors
  let errorCount = 0;
  Sentry.addGlobalEventProcessor((event) => {
    if (event.timestamp && new Date(event.timestamp * 1000) > deploymentTime) {
      errorCount++;

      // Alert bei >5 Errors in 30min
      if (errorCount > 5) {
        datadoc.logEvent({
          type: "deployment.high_error_rate",
          data: {
            error_count: errorCount,
            deployment_time: deploymentTime.toISOString(),
          },
        });

        // Slack/E-Mail Alert
        fetch("/api/send-alert", {
          method: "POST",
          body: JSON.stringify({
            type: "HIGH_ERROR_RATE",
            error_count: errorCount,
            message: "⚠️ Hohe Fehlerrate nach Deployment!",
          }),
        });
      }
    }
    return event;
  });

  // Track Performance
  setInterval(() => {
    const performanceData = window.performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    datadoc.logMetric({
      name: "deployment.page_load_time",
      value: performanceData.loadEventEnd - performanceData.fetchStart,
      tags: {
        deployment_time: deploymentTime.toISOString(),
      },
    });
  }, 60 * 1000); // Jede Minute

  // Stop nach 30min
  setTimeout(() => {
    console.log("✅ Post-Deployment Monitoring abgeschlossen");

    datadoc.logEvent({
      type: "deployment.monitoring_complete",
      data: {
        deployment_time: deploymentTime.toISOString(),
        total_errors: errorCount,
        status: errorCount > 5 ? "WARNING" : "OK",
      },
    });
  }, monitoringDuration);
}

// In src/App.tsx aufrufen
if (import.meta.env.PROD) {
  startPostDeploymentMonitoring();
}
```

---

## ✅ PRÜFPLAN-COMPLIANCE-MATRIX

| Prüfstufe   | Check                 | Pflicht | Automatisiert | Blockiert Deployment |
| ----------- | --------------------- | ------- | ------------- | -------------------- |
| Pre-Commit  | TypeScript            | ✅      | ✅            | ✅                   |
| Pre-Commit  | ESLint                | ✅      | ✅            | ✅                   |
| Pre-Commit  | Design-System Audit   | ✅      | ✅            | ✅                   |
| CI/CD       | Code-Quality          | ✅      | ✅            | ✅                   |
| CI/CD       | Security-Scan         | ✅      | ✅            | ✅                   |
| CI/CD       | AI Code-Review        | ✅      | ✅            | ✅ (bei CRITICAL)    |
| CI/CD       | Unit Tests            | ✅      | ✅            | ✅                   |
| CI/CD       | E2E Tests             | ✅      | ✅            | ✅                   |
| CI/CD       | Lighthouse            | ✅      | ✅            | ⚠️ (bei <70)         |
| CI/CD       | Bundle-Size           | ✅      | ✅            | ✅ (bei >1.5MB)      |
| Manual      | Screenshot-Validation | ✅      | ✅            | ⚠️ (Manual Approve)  |
| Manual      | UAT                   | ✅      | ❌            | ⚠️ (Manual Approve)  |
| Post-Deploy | Health-Check          | ✅      | ✅            | ❌ (Alert only)      |
| Post-Deploy | Live-Monitoring       | ✅      | ✅            | ❌ (Alert only)      |

---

**Version:** V18.5.0  
**Status:** ✅ VERBINDLICH  
**Nächstes Review:** 2025-02-26
