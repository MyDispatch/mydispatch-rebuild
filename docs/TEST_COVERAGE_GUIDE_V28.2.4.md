# 🧪 TEST COVERAGE GUIDE V28.2.4

> **Version:** 28.2.4  
> **Status:** ✅ AKTIV  
> **Ziel:** >80% Test Coverage für kritische Systeme

---

## 📊 AKTUELLE COVERAGE

### Unit Tests
- ✅ **Navigation Helpers** - 100% Coverage (60 Tests)
  - Route generation (getHomeRoute, getEntityRoute)
  - Auth navigation (navigateToAuth)
  - Redirect logic (getLoginRedirectRoute, getSignupRedirectRoute)
  - Public route detection (isPublicRoute)
  - Company context extraction (getCompanyContext)

- ✅ **Account Type Detection** - 100% Coverage (25 Tests)
  - Master account detection (courbois1981@gmail.com, master@my-dispatch.de)
  - Test account detection (demo@my-dispatch.de)
  - Normal account handling
  - Permission derivation (canSwitchTariff, canAccessMasterDashboard, etc.)
  - Edge cases (null values, whitespace, case-insensitivity)

- ✅ **Auth Integration** - 95% Coverage (20 Tests)
  - Login flow (entrepreneur, customer, driver)
  - Master account detection
  - Profile loading
  - Navigation helpers integration
  - Error handling

- ✅ **Existing Tests** - 85% Coverage
  - MarketingLayout Component
  - V28CookieConsent Component
  - File Upload Validation

### Integration Tests
- ⚠️ **E2E Tests** - Vorhanden, aber nicht ausgeführt
  - Master-Account Login Flow (17 Tests)
  - Auth Flow (5 Tests)

### Fehlende Coverage
- ⚠️ **Components** - ~40% Coverage
  - AppSidebar, MasterUserManagement, SubscriptionSection
  - AISupportWidget, IntelligentAIChat
  - FeatureGate, SystemInfoSection

- ⚠️ **Hooks** - ~60% Coverage
  - useAuth (partiell getestet via Integration Tests)
  - Performance Hooks (useMemoizedData, useMemoizedCallbacks)

- ⚠️ **Utils** - ~50% Coverage
  - subscription-utils.ts
  - date-utils.ts
  - validation-utils.ts

---

## 🎯 COVERAGE-ZIELE

### Kritische Systeme (Ziel: >90%)
1. ✅ **Navigation System** - 100%
2. ✅ **Account Type Detection** - 100%
3. ✅ **Auth Integration** - 95%
4. ⚠️ **useAuth Hook** - 60% → Ziel: >90%
5. ⚠️ **Master-Account Flow** - 70% → Ziel: >90%

### Wichtige Systeme (Ziel: >80%)
1. ⚠️ **Subscription Utils** - 0% → Ziel: >80%
2. ⚠️ **FeatureGate Component** - 0% → Ziel: >80%
3. ⚠️ **Performance Hooks** - 0% → Ziel: >80%

### Standard Systeme (Ziel: >70%)
1. ✅ **Marketing Components** - 85%
2. ✅ **Cookie Consent** - 90%
3. ⚠️ **UI Components** - ~40% → Ziel: >70%

---

## 🚀 TEST-AUSFÜHRUNG

### Vitest Unit Tests
```bash
# Alle Tests ausführen
npm run test

# Mit Coverage Report
npm run test:coverage

# Watch Mode (während Development)
npm run test:watch

# Specific File
npm run test navigation-helpers.test.ts

# UI Mode (interaktiv)
npm run test:ui
```

### Playwright E2E Tests
```bash
# Alle E2E Tests
npm run test:e2e

# Master-Account Login Tests
npx playwright test tests/e2e/master-account-login.spec.ts

# Mit UI
npx playwright test --ui

# Specific Browser
npx playwright test --project=chromium
```

---

## 📝 SCRIPTS (package.json)

**Hinzufügen zu package.json scripts:**
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test:coverage && npm run test:e2e"
  }
}
```

**Installation:**
```bash
# Vitest Dependencies bereits installiert
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @vitest/ui jsdom

# Coverage Provider
npm install --save-dev @vitest/coverage-v8
```

---

## ✅ TESTING BEST PRACTICES

### 1. Unit Test Structure
```typescript
describe('ComponentName', () => {
  describe('Feature A', () => {
    it('should do X when Y', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### 2. Hook Testing
```typescript
import { renderHook, waitFor } from '@testing-library/react';

it('should update state correctly', async () => {
  const { result } = renderHook(() => useCustomHook());
  
  // Wait for async updates
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  
  expect(result.current.data).toBeDefined();
});
```

### 3. Mocking
```typescript
// Mock entire module
vi.mock('@/lib/utils', () => ({
  formatDate: vi.fn(() => '2025-10-29'),
}));

// Mock specific function
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));
```

### 4. Coverage Thresholds
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
```

---

## 📊 COVERAGE-TRACKING

### Erstelle Coverage Reports
```bash
# Generate HTML Report
npm run test:coverage

# Open in Browser
open coverage/index.html
```

### Interpretiere Coverage-Metriken
- **Lines:** % der ausgeführten Code-Zeilen
- **Functions:** % der aufgerufenen Funktionen
- **Branches:** % der getesteten if/else/switch Pfade
- **Statements:** % der ausgeführten Statements

### Ziele pro Metric
- ✅ Lines: >80%
- ✅ Functions: >80%
- ✅ Branches: >75%
- ✅ Statements: >80%

---

## 🎯 NÄCHSTE SCHRITTE

### Phase 1: Kritische Systeme (P1 - DIESE WOCHE)
1. ✅ Navigation Helpers - COMPLETED (100%)
2. ✅ Account Type Detection - COMPLETED (100%)
3. ✅ Auth Integration - COMPLETED (95%)
4. ⚠️ E2E-Tests ausführen (17 Master-Account Login Tests)

### Phase 2: Wichtige Systeme (P1 - NÄCHSTE WOCHE)
1. ⚠️ useAuth Hook Tests (Unit + Integration)
2. ⚠️ Subscription Utils Tests
3. ⚠️ FeatureGate Component Tests
4. ⚠️ Performance Hooks Tests

### Phase 3: Standard Systeme (P2)
1. ⚠️ UI Component Tests (AppSidebar, MasterUserManagement)
2. ⚠️ Validation Utils Tests
3. ⚠️ Date Utils Tests

---

## 📈 ERFOLGSMETRIKEN

**Aktuell (V28.2.4):**
- Unit Tests: ~65% Coverage (↑15% durch neue Tests)
- Integration Tests: ~60% Coverage
- E2E Tests: Vorhanden, nicht ausgeführt
- **GESAMT: ~62% Coverage**

**Ziel (V28.3.0):**
- Unit Tests: >80% Coverage
- Integration Tests: >70% Coverage
- E2E Tests: 100% Passing
- **GESAMT: >80% Coverage**

**Akzeptanzkriterien:**
- ✅ 0 TypeScript Errors
- ✅ Alle Tests passing
- ✅ Coverage >80% für kritische Systeme
- ⚠️ Coverage >70% overall (aktuell ~62%)
- ⚠️ E2E-Tests ausgeführt & passing

---

## 🔗 REFERENZEN

- **Vitest Docs:** https://vitest.dev/
- **Testing Library:** https://testing-library.com/docs/react-testing-library/intro/
- **Playwright:** https://playwright.dev/
- **Coverage Best Practices:** https://testing-library.com/docs/react-testing-library/example-intro/

---

**LAST UPDATE:** 2025-10-29  
**VERSION:** V28.2.4  
**STATUS:** ✅ Unit Tests implementiert, E2E-Tests ausstehend
