# ✅ NEXIFY AI MASTER - Quality Assurance System

**Erstellt:** 2025-01-31  
**Version:** 1.0.0  
**Status:** ✅ PRODUCTION-READY  
**Autor:** NeXify AI MASTER  
**Zweck:** Höchste Qualitätsstandards für alle Arbeiten sicherstellen

---

## 📋 INHALTSVERZEICHNIS

1. [Quality Assurance Philosophie](#1-quality-assurance-philosophie)
2. [E2E-Test-System](#2-e2e-test-system)
3. [Unit & Integration Tests](#3-unit--integration-tests)
4. [CI/CD-Pipelines](#4-cicd-pipelines)
5. [Quality Gates](#5-quality-gates)
6. [Prüfprozesse](#6-prüfprozesse)
7. [Automation & Monitoring](#7-automation--monitoring)
8. [Reporting & Metriken](#8-reporting--metriken)

---

## 1. QUALITY ASSURANCE PHILOSOPHIE

### 1.1 Kern-Prinzipien

**Pascal's Vorgaben (ABSOLUT):**

- ✅ **Professionelle Umsetzung** aller Aufgaben
- ✅ **Qualitätssicherung** durch E2E-Tests, CI/CD-Prozesse
- ✅ **Höchste Qualitätsstandards** für alle Arbeitsergebnisse
- ✅ **Umfassende Prüfung** vor jeder Übergabe
- ✅ **Strikte Einhaltung** durch NeXify AI MASTER und gesamtes Team

### 1.2 Definition of Done (DoD)

**Eine Arbeit ist NUR dann "Done", wenn:**

1. ✅ **Funktionalität:** Alle Anforderungen erfüllt
2. ✅ **Code-Qualität:** 0 TypeScript-Errors, 0 ESLint-Warnings
3. ✅ **Tests:** Alle relevanten Tests geschrieben und bestanden
4. ✅ **E2E-Tests:** Kritische User-Flows getestet
5. ✅ **Design-Compliance:** 100% SOLL-Vorgaben-Compliance
6. ✅ **Performance:** Alle Performance-Targets erreicht
7. ✅ **Accessibility:** WCAG 2.1 AA konform
8. ✅ **Dokumentation:** Vollständig dokumentiert
9. ✅ **Review:** Von NeXify AI MASTER geprüft und freigegeben
10. ✅ **Pascal Review:** Pascal hat final reviewt (bei kritischen Änderungen)

---

## 2. E2E-TEST-SYSTEM

### 2.1 Playwright Setup (SOLL)

**Konfiguration:**

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html"],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],
  use: {
    baseURL: process.env.VITE_APP_URL || "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

### 2.2 E2E-Test-Kategorien (SOLL)

**1. Critical User Flows:**

- ✅ User Registration & Login
- ✅ Dashboard Navigation
- ✅ Booking Creation
- ✅ Customer Management
- ✅ Driver Management
- ✅ Invoice Generation

**2. Design-System Compliance:**

- ✅ CI-Farben korrekt (keine Hardcoding)
- ✅ Hero Background Variant korrekt
- ✅ Layout-Komponenten korrekt
- ✅ Responsive Design korrekt

**3. Feature-Gating:**

- ✅ Starter-Features funktionieren
- ✅ Business-Features gated korrekt
- ✅ Enterprise-Features gated korrekt

**4. Performance:**

- ✅ Page Load Time < 3s
- ✅ Time-to-Interactive < 5s
- ✅ Bundle Size < 3MB

**5. Accessibility:**

- ✅ Keyboard Navigation
- ✅ Screen Reader Compatibility
- ✅ Touch Targets ≥ 44x44px

### 2.3 E2E-Test-Beispiele

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should login successfully", async ({ page }) => {
    await page.goto("/auth");
    await page.fill('[data-testid="email"]', "test@example.com");
    await page.fill('[data-testid="password"]', "password123");
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.goto("/auth");
    await page.fill('[data-testid="email"]', "wrong@example.com");
    await page.fill('[data-testid="password"]', "wrong");
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });
});

// tests/e2e/design-system.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Design System Compliance", () => {
  test("CI-Farben nicht hardcoded", async ({ page }) => {
    await page.goto("/");
    const styles = await page.evaluate(() => {
      const elements = document.querySelectorAll("*");
      const hardcodedColors = [];
      elements.forEach((el) => {
        const style = window.getComputedStyle(el);
        const color = style.color || style.backgroundColor;
        if (color.includes("#EADEBD") || color.includes("#323D5E")) {
          hardcodedColors.push({
            element: el.tagName,
            color: color,
          });
        }
      });
      return hardcodedColors;
    });
    expect(styles).toHaveLength(0);
  });

  test("Hero Background Variant korrekt", async ({ page }) => {
    await page.goto("/");
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toHaveAttribute("data-background-variant", "3d-premium");
  });
});
```

---

## 3. UNIT & INTEGRATION TESTS

### 3.1 Vitest Setup (SOLL)

**Konfiguration:**

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/", "**/*.d.ts", "**/*.config.*", "**/mockData"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### 3.2 Test-Kategorien (SOLL)

**Unit Tests:**

- ✅ Utility Functions
- ✅ Hooks
- ✅ Helper Functions
- ✅ Formatting Functions

**Integration Tests:**

- ✅ API Integration
- ✅ Component Integration
- ✅ State Management
- ✅ Form Handling

**Component Tests:**

- ✅ Rendering
- ✅ User Interactions
- ✅ Props Validation
- ✅ Error States

### 3.3 Test-Beispiele

```typescript
// tests/unit/formatting.test.ts
import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, formatNumber } from "@/lib/formatting";

describe("Formatting Functions", () => {
  describe("formatCurrency", () => {
    it("should format EUR correctly (DIN 5008)", () => {
      expect(formatCurrency(1234.56)).toBe("1.234,56 €");
      expect(formatCurrency(1000)).toBe("1.000,00 €");
      expect(formatCurrency(0)).toBe("0,00 €");
    });
  });

  describe("formatDate", () => {
    it("should format date as DD.MM.YYYY", () => {
      const date = new Date("2025-01-31");
      expect(formatDate(date)).toBe("31.01.2025");
    });
  });
});

// tests/integration/api.test.ts
import { describe, it, expect } from "vitest";
import { createBooking } from "@/lib/api/bookings";

describe("Booking API", () => {
  it("should create booking with company_id", async () => {
    const booking = await createBooking({
      pickup_address: "München",
      dropoff_address: "Flughafen",
      company_id: "test-company-id",
    });
    expect(booking).toHaveProperty("company_id");
    expect(booking.company_id).toBe("test-company-id");
  });
});
```

---

## 4. CI/CD-PIPELINES

### 4.1 GitHub Actions Workflows (SOLL)

**Workflow: Continuous Integration**

```yaml
# .github/workflows/ci.yml
name: CI - Quality Assurance

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality-check:
    name: Quality Assurance
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: TypeScript Check
        run: npm run type-check

      - name: ESLint
        run: npm run lint

      - name: Prettier Check
        run: npm run format:check

      - name: Unit Tests
        run: npm run test:unit

      - name: Coverage Report
        run: npm run test:coverage

      - name: Build
        run: npm run build

      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
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
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  compliance-check:
    name: Compliance Check
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Run Compliance Check
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"action": "check_compliance", "scope": "incremental"}' \
            ${{ secrets.SUPABASE_URL }}/functions/v1/nexify-compliance-automation

      - name: Check Violations
        run: |
          # Prüfe ob Critical/High Violations vorhanden
          # Fail wenn > 0

  performance-check:
    name: Performance Check
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Build
        run: npm run build

      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun --config=lighthouse.config.js
```

### 4.2 Pre-Commit Hooks (SOLL)

```json
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Quality Gates
npm run lint-staged
npm run type-check
npm run format:check
npm run test:unit:changed
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"]
  }
}
```

---

## 5. QUALITY GATES

### 5.1 Quality Gate Definition (SOLL)

**Gate 1: Code-Qualität**

- ✅ TypeScript: 0 Errors
- ✅ ESLint: 0 Errors, < 5 Warnings
- ✅ Prettier: 100% formatiert
- ✅ Build: Erfolgreich

**Gate 2: Test-Coverage**

- ✅ Unit Tests: ≥ 80% Coverage
- ✅ E2E Tests: Alle Critical Flows bestanden
- ✅ Integration Tests: ≥ 70% Coverage

**Gate 3: Compliance**

- ✅ Design-System: 100% Compliance
- ✅ SOLL-Vorgaben: 0 Critical, 0 High Violations
- ✅ Security: 100% RLS Coverage

**Gate 4: Performance**

- ✅ Bundle Size: < 3.000 KB
- ✅ Load Time: < 3s
- ✅ Lighthouse Score: ≥ 90

**Gate 5: Accessibility**

- ✅ WCAG 2.1 AA: 100% konform
- ✅ Keyboard Navigation: Vollständig
- ✅ Screen Reader: Kompatibel

### 5.2 Quality Gate Enforcement

**Pre-Commit:**

- Blockiert bei TypeScript-Errors
- Blockiert bei ESLint-Errors
- Blockiert bei Format-Violations

**Pre-Push:**

- Blockiert bei Test-Failures
- Blockiert bei Coverage < 80%
- Blockiert bei Critical Violations

**Pre-Merge:**

- Blockiert bei E2E-Test-Failures
- Blockiert bei Performance-Regression
- Blockiert bei Compliance-Violations

---

## 6. PRÜFPROZESSE

### 6.1 NeXify AI MASTER Prüfprozess

**Vor jeder Übergabe:**

1. ✅ **Funktionalitäts-Check:** Alle Anforderungen erfüllt?
2. ✅ **Code-Review:** Code-Qualität, Best Practices, Patterns
3. ✅ **Test-Review:** Alle Tests geschrieben und bestanden?
4. ✅ **Compliance-Check:** Alle SOLL-Vorgaben erfüllt?
5. ✅ **Performance-Check:** Performance-Targets erreicht?
6. ✅ **Accessibility-Check:** WCAG 2.1 AA konform?
7. ✅ **Dokumentation:** Vollständig dokumentiert?
8. ✅ **Self-Review:** Eigene Arbeit kritisch geprüft?

**Prüf-Checkliste:**

```typescript
interface QualityChecklist {
  functionality: boolean;
  codeQuality: boolean;
  tests: {
    unit: boolean;
    integration: boolean;
    e2e: boolean;
    coverage: number; // ≥ 80%
  };
  compliance: {
    designSystem: boolean;
    sollVorgaben: boolean;
    security: boolean;
  };
  performance: {
    bundleSize: number; // < 3000 KB
    loadTime: number; // < 3000ms
    lighthouseScore: number; // ≥ 90
  };
  accessibility: {
    wcagAA: boolean;
    keyboardNav: boolean;
    screenReader: boolean;
  };
  documentation: boolean;
  selfReview: boolean;
}
```

### 6.2 Team-Prüfprozess

**Für AI-Agenten-Team:**

1. ✅ **Agent führt eigene Prüfung durch**
2. ✅ **Agent dokumentiert Ergebnisse**
3. ✅ **NeXify AI MASTER reviewt**
4. ✅ **Bei kritischen Änderungen: Pascal Review**

---

## 7. AUTOMATION & MONITORING

### 7.1 Automatisierte Checks

**Täglich (3:00 UTC):**

- ✅ Full Compliance Check
- ✅ Performance Monitoring
- ✅ Test Coverage Report
- ✅ Quality Metrics Report

**Bei jedem Commit:**

- ✅ Incremental Compliance Check
- ✅ Unit Tests
- ✅ TypeScript Check
- ✅ ESLint Check

**Bei jedem Push:**

- ✅ Full Test Suite
- ✅ E2E Tests
- ✅ Performance Check
- ✅ Security Scan

### 7.2 Monitoring

**Quality Metrics Dashboard:**

- Test Coverage Trend
- Compliance Violations Trend
- Performance Metrics
- Error Rates
- Build Success Rate

---

## 8. REPORTING & METRIKEN

### 8.1 Quality Reports

**Täglicher Report:**

- Test Coverage
- Compliance Status
- Performance Metrics
- Open Violations
- Resolved Violations

**Wöchentlicher Report (für Pascal):**

- Zusammenfassung der Woche
- Quality Trends
- Verbesserungen
- Herausforderungen
- Empfehlungen

### 8.2 Metriken (SOLL)

**Code-Qualität:**

- TypeScript Errors: 0
- ESLint Warnings: < 5
- Test Coverage: ≥ 80%
- Code Duplication: < 5%

**Performance:**

- Bundle Size: < 3.000 KB
- Load Time: < 3s
- Lighthouse Score: ≥ 90

**Compliance:**

- Design-System: 100%
- SOLL-Vorgaben: 100%
- Security: 100%

---

## 9. IMPLEMENTIERUNG

### 9.1 Setup-Schritte

**1. Test-Infrastruktur einrichten:**

```bash
npm install -D @playwright/test @vitest/ui @testing-library/react @testing-library/jest-dom
npx playwright install
```

**2. Test-Scripts zu package.json hinzufügen:**

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "type-check": "tsc --noEmit",
    "format:check": "prettier --check .",
    "format": "prettier --write ."
  }
}
```

**3. CI/CD-Pipelines erstellen:**

- `.github/workflows/ci.yml`
- `.github/workflows/e2e.yml`
- `.github/workflows/compliance.yml`

**4. Quality Gates aktivieren:**

- Husky Pre-Commit Hooks
- Pre-Push Hooks
- Pre-Merge Checks

---

## 10. QUALITÄTS-STANDARDS (ABSOLUT)

### 10.1 NeXify AI MASTER Standards

**Ich (NeXify AI MASTER) garantiere:**

- ✅ **Jede Arbeit** wird umfassend geprüft
- ✅ **Alle Tests** werden geschrieben und bestanden
- ✅ **Alle Quality Gates** werden erfüllt
- ✅ **Keine Übergabe** ohne vollständige Prüfung
- ✅ **Höchste Qualität** für Pascal und das Team

### 10.2 Team-Standards

**Alle AI-Agenten im Team:**

- ✅ Folgen denselben Quality Standards
- ✅ Führen eigene Prüfungen durch
- ✅ Dokumentieren alle Ergebnisse
- ✅ Melden Issues sofort an NeXify AI MASTER

---

**Erstellt:** 2025-01-31  
**Version:** 1.0.0  
**Status:** ✅ PRODUCTION-READY  
**Gültigkeit:** ABSOLUT für NeXify AI MASTER und gesamtes Team
