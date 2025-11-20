# 🧪 Testing Guide

> **Test-Strategie für MyDispatch**  
> **Version:** 18.5.0  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 Testing-Pyramide

```
      /\
     /E2E\        10% - End-to-End (Playwright)
    /------\
   /Integ.  \     20% - Integration (React Query, Supabase)
  /----------\
 /   Unit     \   70% - Unit Tests (Vitest)
/--------------\
```

---

## 🧩 Unit Testing (Vitest)

### Setup

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### Component Tests

```tsx
// Button.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("should render correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should call onClick handler", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("should apply className", () => {
    render(<Button className="custom-class">Test</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });
});
```

### Hook Tests

```tsx
// use-bookings.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useBookings } from "./use-bookings";

describe("useBookings", () => {
  it("should fetch bookings", async () => {
    const { result } = renderHook(() => useBookings());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.bookings).toBeDefined();
    expect(result.current.bookings.length).toBeGreaterThan(0);
  });
});
```

### Utility Tests

```tsx
// format-utils.test.ts
import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate } from "./format-utils";

describe("formatCurrency", () => {
  it("should format Euro correctly", () => {
    expect(formatCurrency(1234.56)).toBe("1.234,56 €");
  });

  it("should handle zero", () => {
    expect(formatCurrency(0)).toBe("0,00 €");
  });

  it("should handle negative values", () => {
    expect(formatCurrency(-100)).toBe("-100,00 €");
  });
});
```

---

## 🎭 E2E Testing (Playwright)

### Setup

```bash
npm install --save-dev @playwright/test
npx playwright install --with-deps
```

### Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
});
```

### E2E Test Examples

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should login successfully", async ({ page }) => {
    await page.goto("/auth");

    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator("text=Willkommen")).toBeVisible();
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/auth");

    await page.fill('[name="email"]', "wrong@example.com");
    await page.fill('[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Ungültige Anmeldedaten")).toBeVisible();
  });
});
```

### Design System Tests

```typescript
// tests/e2e/design-system/color-consistency.spec.ts
import { test, expect } from "@playwright/test";

test("should use semantic color tokens", async ({ page }) => {
  await page.goto("/");

  const forbiddenClasses = await page.evaluate(() => {
    const all = document.querySelectorAll("*");
    const forbidden = ["text-white", "text-black", "bg-white", "bg-black"];
    const found: string[] = [];

    all.forEach((el) => {
      const classes = el.className.toString();
      forbidden.forEach((fc) => {
        if (classes.includes(fc)) {
          found.push(classes);
        }
      });
    });

    return found;
  });

  // Max 5 Warnings erlaubt (Marketing-Seiten haben Ausnahmen)
  expect(forbiddenClasses.length).toBeLessThan(5);
});
```

### Mobile Tests

```typescript
// tests/e2e/mobile/touch-targets.spec.ts
import { test, expect } from "@playwright/test";

test("should have 44px touch targets", async ({ page }) => {
  await page.goto("/dashboard");

  const buttons = await page.locator("button").all();

  for (const button of buttons) {
    const box = await button.boundingBox();

    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
    }
  }
});
```

---

## 🔄 Integration Testing

### React Query Tests

```tsx
// tests/integration/bookings-query.test.tsx
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useBookings } from "@/hooks/use-bookings";

describe("Bookings Integration", () => {
  it("should cache bookings data", async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result, rerender } = renderHook(() => useBookings(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const firstData = result.current.bookings;

    // Re-render sollte gecachte Daten verwenden
    rerender();
    expect(result.current.bookings).toBe(firstData);
  });
});
```

---

## 📊 Coverage Goals

### Minimum Coverage

```json
// package.json
{
  "vitest": {
    "coverage": {
      "lines": 80,
      "functions": 80,
      "branches": 75,
      "statements": 80
    }
  }
}
```

### Coverage Report

```bash
# Generate coverage report
npm run test:coverage

# Open in browser
open coverage/index.html
```

---

## 🤖 Automated Testing (CI/CD)

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Run unit tests
        run: npm run test:unit

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm install

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 🎯 Test Scripts

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:compliance": "playwright test tests/e2e/compliance/",
    "test:design-tokens": "bash scripts/check-design-tokens.sh"
  }
}
```

---

## ✅ Testing Checklist

Vor jedem PR:

```
[ ] Unit Tests für neue Functions/Components
[ ] E2E Tests für kritische User-Flows
[ ] Design System Compliance Tests passed
[ ] Coverage >80%
[ ] Alle Tests grün (npm run test)
[ ] Mobile Touch-Target Tests passed
```

---

## 📚 Weitere Ressourcen

- [Playwright Docs](https://playwright.dev)
- [Vitest Docs](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [Coding Standards](./Coding-Standards.md)

---

## 📝 Changelog

### V18.5.0 (2025-01-26)

- Erstversion Testing Guide
- Unit, E2E, Integration Testing dokumentiert
- CI/CD Integration hinzugefügt
- Coverage Goals definiert
