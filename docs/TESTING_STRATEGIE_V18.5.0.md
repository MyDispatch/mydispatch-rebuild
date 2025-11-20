# TESTING-STRATEGIE V18.5.0

> **Version:** 18.5.0  
> **Status:** ✅ VERBINDLICH  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 TESTING-PYRAMIDE

```
         /\
        /  \  E2E Tests (5%)
       /    \  - Playwright
      /------\
     /        \  Integration Tests (25%)
    /          \  - React Testing Library
   /------------\
  /              \  Unit Tests (70%)
 /                \  - Vitest
/------------------\
```

---

## 🧪 1. UNIT TESTS (70%)

### Tools
- **Vitest** - Test-Runner (schneller als Jest)
- **@testing-library/react** - Component-Tests

### Setup

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

### Beispiel: Util-Tests

```typescript
// src/lib/__tests__/format-utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDateTime, formatDistance } from '../format-utils';

describe('formatCurrency', () => {
  it('formatiert Beträge korrekt in Euro', () => {
    expect(formatCurrency(1234.56)).toBe('1.234,56 €');
    expect(formatCurrency(0)).toBe('0,00 €');
    expect(formatCurrency(1000000)).toBe('1.000.000,00 €');
  });

  it('rundet auf 2 Dezimalstellen', () => {
    expect(formatCurrency(10.999)).toBe('11,00 €');
    expect(formatCurrency(10.001)).toBe('10,00 €');
  });
});

describe('formatDateTime', () => {
  it('formatiert Datum im deutschen Format', () => {
    const date = new Date('2025-01-26T14:30:00Z');
    expect(formatDateTime(date)).toBe('26.01.2025 15:30'); // +1h für MEZ
  });
});

describe('formatDistance', () => {
  it('formatiert Distanzen korrekt', () => {
    expect(formatDistance(500)).toBe('500 m');
    expect(formatDistance(1500)).toBe('1,5 km');
    expect(formatDistance(10000)).toBe('10,0 km');
  });
});
```

### Beispiel: Hook-Tests

```typescript
// src/hooks/__tests__/use-bookings.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBookings } from '../use-bookings';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock useAuth
vi.mock('../use-auth', () => ({
  useAuth: () => ({
    profile: { company_id: 'test-company-id' },
  }),
}));

describe('useBookings', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('lädt Buchungen erfolgreich', async () => {
    const mockBookings = [
      { id: '1', pickup_time: '2025-01-26T14:00:00Z', status: 'pending' },
      { id: '2', pickup_time: '2025-01-27T10:00:00Z', status: 'confirmed' },
    ];

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockBookings, error: null }),
    } as any);

    const { result } = renderHook(() => useBookings(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockBookings);
    expect(result.current.data).toHaveLength(2);
  });

  it('behandelt Fehler korrekt', async () => {
    const mockError = new Error('Database error');

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: null, error: mockError }),
    } as any);

    const { result } = renderHook(() => useBookings(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });
});
```

---

## 🔗 2. INTEGRATION TESTS (25%)

### Beispiel: Component-Integration

```typescript
// src/components/booking/__tests__/BookingForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingForm } from '../BookingForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('BookingForm', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('rendert alle Formular-Felder', () => {
    render(<BookingForm />, { wrapper });

    expect(screen.getByLabelText(/Abholadresse/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Zieladresse/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Abholzeit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Passagiere/i)).toBeInTheDocument();
  });

  it('validiert Pflichtfelder', async () => {
    const user = userEvent.setup();
    render(<BookingForm />, { wrapper });

    const submitButton = screen.getByRole('button', { name: /Buchen/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Adresse ist erforderlich/i)).toBeInTheDocument();
    });
  });

  it('erstellt Buchung erfolgreich', async () => {
    const user = userEvent.setup();
    const mockInsert = vi.fn().mockResolvedValue({
      data: { id: '123' },
      error: null,
    });

    vi.mocked(supabase.from).mockReturnValue({
      insert: mockInsert,
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: '123' }, error: null }),
    } as any);

    render(<BookingForm />, { wrapper });

    await user.type(screen.getByLabelText(/Abholadresse/i), 'Marienplatz 1, München');
    await user.type(screen.getByLabelText(/Zieladresse/i), 'Flughafen München');
    await user.type(screen.getByLabelText(/Abholzeit/i), '2025-01-26T14:00');
    await user.click(screen.getByRole('button', { name: /Buchen/i }));

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          pickup_address: 'Marienplatz 1, München',
          dropoff_address: 'Flughafen München',
        })
      );
    });
  });
});
```

---

## 🌐 3. E2E TESTS (5%)

### Tools
- **Playwright** - Cross-Browser E2E Testing

### Setup

```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Beispiel: E2E-Test

```typescript
// e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('input[name="email"]', 'test@mydispatch.de');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('Benutzer kann Buchung erstellen', async ({ page }) => {
    // Navigate to Bookings
    await page.click('text=Aufträge');
    await expect(page).toHaveURL('/auftraege');

    // Open Create Dialog
    await page.click('button:has-text("Neuer Auftrag")');

    // Fill Form
    await page.fill('input[name="pickup_address"]', 'Marienplatz 1, München');
    await page.fill('input[name="dropoff_address"]', 'Flughafen München');
    await page.fill('input[name="pickup_time"]', '2025-01-26T14:00');
    await page.selectOption('select[name="passengers"]', '2');

    // Submit
    await page.click('button:has-text("Buchen")');

    // Verify Success Toast
    await expect(page.locator('text=Buchung erfolgreich erstellt')).toBeVisible();

    // Verify Entry in Table
    await expect(page.locator('table')).toContainText('Marienplatz 1');
  });

  test('Formular zeigt Validierungsfehler bei ungültigen Daten', async ({ page }) => {
    await page.click('text=Aufträge');
    await page.click('button:has-text("Neuer Auftrag")');

    // Submit without filling
    await page.click('button:has-text("Buchen")');

    // Verify Error Messages
    await expect(page.locator('text=Adresse ist erforderlich')).toBeVisible();
  });
});
```

---

## 📸 4. VISUAL REGRESSION TESTS

### Tools
- **Playwright Screenshots** - Pixel-genaue Vergleiche

### Setup

```typescript
// e2e/visual/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression - Dashboard', () => {
  test('Dashboard sieht korrekt aus (Desktop)', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="email"]', 'test@mydispatch.de');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Wait for Dashboard to fully load
    await page.waitForSelector('[data-testid="dashboard-loaded"]');

    // Screenshot
    await expect(page).toHaveScreenshot('dashboard-desktop.png', {
      fullPage: true,
      maxDiffPixels: 100, // Toleranz für kleine Änderungen
    });
  });

  test('Dashboard sieht korrekt aus (Mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

    await page.goto('/');
    await page.fill('input[name="email"]', 'test@mydispatch.de');
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    await page.waitForSelector('[data-testid="dashboard-loaded"]');

    await expect(page).toHaveScreenshot('dashboard-mobile.png', {
      fullPage: true,
      maxDiffPixels: 50,
    });
  });
});
```

---

## 🚀 CI/CD INTEGRATION

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Run Unit Tests
        run: npm run test:unit -- --coverage
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E Tests
        run: npm run test:e2e
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Upload Playwright Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  visual-regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run Visual Tests
        run: npm run test:visual
      
      - name: Upload Screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: visual-diff
          path: e2e/visual/__screenshots__/
```

---

## 📊 COVERAGE GOALS

| Typ | Ziel | Minimum |
|-----|------|---------|
| Unit Tests | 80% | 70% |
| Integration Tests | 60% | 50% |
| E2E Tests | 40% | 30% |

---

## 🛠️ NPM SCRIPTS

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:watch": "vitest watch",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:visual": "playwright test e2e/visual",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

**Version:** V18.5.0  
**Nächstes Update:** Monatlich (Coverage-Review)