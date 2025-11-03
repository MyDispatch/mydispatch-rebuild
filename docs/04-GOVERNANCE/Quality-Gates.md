# ✅ Quality Gates

> **Automatische Quality Checks für MyDispatch**  
> **Version:** 18.5.0  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 Quality-First Prinzip

**Kein Code geht in Production ohne Quality Gates zu passieren.**

---

## 🚦 Quality Gate Stages

### Stage 1: Pre-Commit (Local)

**Trigger:** `git commit`  
**Tool:** Husky + Lint-Staged

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

**Checks:**
- ✅ ESLint (Code Quality)
- ✅ Prettier (Code Formatting)
- ✅ TypeScript (Type Errors)

**Bei Fehlschlag:** Commit wird blockiert

---

### Stage 2: Pre-Push (Local)

**Trigger:** `git push`  
**Tool:** Husky

```bash
# .husky/pre-push
npm run type-check
npm run test
```

**Checks:**
- ✅ TypeScript Compilation
- ✅ Unit Tests (Vitest)

**Bei Fehlschlag:** Push wird blockiert

---

### Stage 3: Pull Request (CI)

**Trigger:** Pull Request  
**Tool:** GitHub Actions

```yaml
# .github/workflows/pr.yml
jobs:
  quality-gates:
    runs-on: ubuntu-latest
    steps:
      - name: Lint
        run: npm run lint
      
      - name: Type Check
        run: npm run type-check
      
      - name: Unit Tests
        run: npm run test
      
      - name: E2E Tests
        run: npm run test:e2e
      
      - name: Build
        run: npm run build
      
      - name: Design System Check
        run: npm run test:design-tokens
      
      - name: Security Check
        run: supabase test db
```

**Checks:**
- ✅ ESLint (Zero Errors)
- ✅ TypeScript (Zero Errors)
- ✅ Unit Tests (100% Pass)
- ✅ E2E Tests (100% Pass)
- ✅ Build Success
- ✅ Design-Token Compliance
- ✅ Supabase Security Linter

**Bei Fehlschlag:** PR kann nicht gemerged werden

---

### Stage 4: Production (Post-Deploy)

**Trigger:** Deployment to Production  
**Tool:** Smoke Tests

```typescript
// tests/smoke/production.test.ts
describe('Production Smoke Tests', () => {
  it('Homepage loads', async () => {
    const response = await fetch('https://mydispatch.lovable.app');
    expect(response.status).toBe(200);
  });
  
  it('API responds', async () => {
    const response = await fetch('https://xyz.supabase.co/rest/v1/health');
    expect(response.status).toBe(200);
  });
});
```

**Checks:**
- ✅ Homepage lädt
- ✅ API erreichbar
- ✅ Authentication funktioniert

**Bei Fehlschlag:** Alert + Rollback

---

## 🔍 Quality Metrics

### Code Quality

| Metric | Schwelle | Tool |
|--------|----------|------|
| **ESLint Errors** | 0 | ESLint |
| **TypeScript Errors** | 0 | tsc |
| **Code Duplication** | < 5% | - |
| **Cyclomatic Complexity** | < 10 | ESLint |

### Test Coverage

| Metric | Schwelle | Tool |
|--------|----------|------|
| **Unit Test Coverage** | > 80% | Vitest |
| **Integration Test Coverage** | > 60% | Vitest |
| **E2E Test Coverage** | Critical Flows | Playwright |

### Performance

| Metric | Schwelle | Tool |
|--------|----------|------|
| **LCP** | < 2.5s | Lighthouse |
| **FCP** | < 1.8s | Lighthouse |
| **CLS** | < 0.1 | Lighthouse |
| **Bundle Size** | < 1MB | Vite |

### Security

| Metric | Schwelle | Tool |
|--------|----------|------|
| **RLS Enabled** | 100% | Supabase Linter |
| **Security Policies** | 100% | Supabase Linter |
| **Vulnerable Dependencies** | 0 Critical | npm audit |

---

## 🛠️ Quality Tools

### 1. ESLint

```bash
# Lint ausführen
npm run lint

# Automatisches Fixing
npm run lint:fix
```

**Config:** `.eslintrc.json`

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### 2. TypeScript

```bash
# Type Check
npm run type-check
```

**Config:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### 3. Vitest (Unit Tests)

```bash
# Unit Tests ausführen
npm run test

# Mit Coverage
npm run test:coverage
```

**Coverage Report:** `coverage/index.html`

### 4. Playwright (E2E Tests)

```bash
# E2E Tests ausführen
npm run test:e2e

# Spezifischer Test
npx playwright test tests/e2e/booking.test.ts
```

### 5. Design-Token Checker

```bash
# Check auf verbotene direkte Farben
npm run test:design-tokens

# Script: scripts/check-design-tokens.sh
```

**Prüft:**
- ❌ `text-white`, `bg-black`, `text-blue-500`
- ❌ Inline-Styles
- ❌ Direct Lucide-Imports

### 6. Supabase Security Linter

```bash
# Security Check
supabase test db

# Output: Liste aller Security-Warnungen
```

**Prüft:**
- ❌ Tabellen ohne RLS
- ❌ Fehlende Policies
- ❌ Unsichere Functions

---

## 📊 Quality Dashboard

### GitHub Actions Status Badge

```markdown
![CI/CD](https://github.com/yourusername/mydispatch/workflows/CI/badge.svg)
```

### Coverage Badge

```markdown
![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)
```

---

## 🚨 Quality Gate Failures

### Was passiert bei Fehlschlag?

#### Pre-Commit
```
❌ ESLint Error in src/components/Button.tsx
   Line 42: 'color' is not defined

→ Commit blockiert
→ Fix den Fehler und committe erneut
```

#### Pre-Push
```
❌ TypeScript Error in src/pages/Dashboard.tsx
   Line 123: Type 'string' is not assignable to type 'number'

→ Push blockiert
→ Fix den Fehler und pushe erneut
```

#### Pull Request
```
❌ E2E Test Failed: Booking Creation
   Expected: Booking created successfully
   Received: Error 500

→ PR kann nicht gemerged werden
→ Fix den Test und pushe erneut
```

---

## ✅ Quality Checklist

Vor jedem Deployment:

### Code Quality
```
[ ] ESLint: 0 Errors
[ ] TypeScript: 0 Errors
[ ] Prettier: Code formatiert
[ ] Keine console.log() in Production
```

### Testing
```
[ ] Unit Tests: > 80% Coverage
[ ] E2E Tests: Alle Critical Flows
[ ] No Flaky Tests
```

### Security
```
[ ] RLS auf allen Tabellen
[ ] Supabase Linter: 0 Critical Issues
[ ] Input Validation überall
[ ] Keine Secrets im Code
```

### Performance
```
[ ] Bundle < 1MB
[ ] LCP < 2.5s
[ ] CLS < 0.1
[ ] Lighthouse Score > 90
```

### Design System
```
[ ] Semantic Tokens verwendet
[ ] Icon-Komponente genutzt
[ ] Touch-Targets ≥ 44px
[ ] Mobile-First Spacing
```

### Legal Compliance
```
[ ] DSGVO-Hinweis bei Formularen
[ ] Impressum/Datenschutz/AGB im Footer
[ ] Cookie-Consent (falls benötigt)
```

---

## 🔧 Automatisierung

### package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:design-tokens": "bash scripts/check-design-tokens.sh",
    "pre-deploy": "npm run lint && npm run type-check && npm run test && npm run test:e2e && npm run build"
  }
}
```

---

## 📚 Weitere Ressourcen

- [Testing Guide](../03-DEVELOPMENT/Testing.md) - Test-Strategie
- [Security Guidelines](./Security.md) - Security Best Practices
- [Legal Compliance](./Legal-Compliance.md) - DSGVO & Co.
- [Performance Guide](../03-DEVELOPMENT/Performance.md) - Performance-Optimierung

---

## 📝 Changelog

### V18.5.0 (2025-01-26)
- Erstversion Quality Gates
- 4-Stage Quality Pipeline definiert
- Automatische Checks dokumentiert
- Quality Metrics & Tools hinzugefügt

---

**KRITISCH:** Quality Gates sind NICHT verhandelbar. Kein Code ohne Gates in Production!
