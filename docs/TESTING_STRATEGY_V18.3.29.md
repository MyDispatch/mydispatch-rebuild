# 🧪 TESTING STRATEGY V18.3.29
## MyDispatch - Comprehensive Testing Standards

**Status:** Production-Ready  
**Letzte Aktualisierung:** 2025-10-21  
**Verantwortlich:** Senior Systemarchitekt  
**Klassifizierung:** Intern - Entwicklungsvorgabe

---

## 🎯 TESTING-PHILOSOPHIE

**Ziel:** 100% Fehlerfreiheit durch systematisches, mehrschichtiges Testing.

**Prinzipien:**
1. **Test Pyramid:** 70% Unit, 20% Integration, 10% E2E
2. **Test First:** Tests vor oder parallel zur Implementierung
3. **Automated:** Alle Tests automatisiert in CI/CD
4. **Fast:** Tests müssen schnell laufen (<5min gesamt)
5. **Reliable:** Tests dürfen nicht flaky sein

---

## 📊 TEST-PYRAMIDE

```
        ┌─────────────┐
        │   E2E       │  10% (Playwright)
        │   Tests     │  User Flows, Critical Paths
        └─────────────┘
       ┌───────────────┐
       │  Integration  │  20% (React Testing Library)
       │  Tests        │  Component Integration, API Mocks
       └───────────────┘
      ┌─────────────────┐
      │   Unit Tests    │  70% (Jest/Vitest)
      │                 │  Functions, Utils, Business Logic
      └─────────────────┘
```

---

## 1️⃣ UNIT TESTS (70%)

### Technologie
- **Framework:** Jest / Vitest
- **Coverage:** > 80% (gemessen mit Istanbul)

---

### Was wird getestet?

```
✅ Business Logic
✅ Utility Functions
✅ Validation Schemas (Zod)
✅ Formatters
✅ Custom Hooks (isoliert)
✅ State Management Logic
```

---

### Unit Test Struktur

```typescript
// src/lib/formatters.test.ts
import { formatCurrency, formatDate } from './formatters';

describe('formatCurrency', () => {
  it('formats positive numbers correctly', () => {
    expect(formatCurrency(1234.56)).toBe('1.234,56 €');
  });

  it('formats negative numbers correctly', () => {
    expect(formatCurrency(-1234.56)).toBe('-1.234,56 €');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('0,00 €');
  });

  it('handles very large numbers', () => {
    expect(formatCurrency(1000000)).toBe('1.000.000,00 €');
  });

  it('respects currency parameter', () => {
    expect(formatCurrency(100, 'USD')).toContain('$');
  });
});

describe('formatDate', () => {
  it('formats date in German locale', () => {
    const date = new Date('2025-10-21');
    expect(formatDate(date, 'dd.MM.yyyy')).toBe('21.10.2025');
  });

  it('handles invalid dates gracefully', () => {
    const invalidDate = new Date('invalid');
    expect(formatDate(invalidDate)).toBe('Ungültiges Datum');
  });
});
```

---

### Validation Tests (Zod)

```typescript
// src/lib/validation.test.ts
import { validateOrder, formatValidationErrors } from './validation';

describe('Order Validation', () => {
  it('accepts valid order data', () => {
    const validOrder = {
      customer_id: '123e4567-e89b-12d3-a456-426614174000',
      pickup_address: 'Test Str. 1, 12345 Berlin',
      delivery_address: 'Test Str. 2, 54321 Hamburg',
      pickup_date: new Date('2025-12-01'),
    };

    const result = validateOrder(validOrder);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toMatchObject(validOrder);
    }
  });

  it('rejects order with invalid UUID', () => {
    const invalidOrder = {
      customer_id: 'invalid-uuid',
      pickup_address: 'Test Str. 1',
      delivery_address: 'Test Str. 2',
      pickup_date: new Date(),
    };

    const result = validateOrder(invalidOrder);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = formatValidationErrors(result.error);
      expect(errors.customer_id).toContain('Ungültige ID');
    }
  });

  it('rejects delivery date before pickup date', () => {
    const invalidOrder = {
      customer_id: '123e4567-e89b-12d3-a456-426614174000',
      pickup_address: 'Test Str. 1',
      delivery_address: 'Test Str. 2',
      pickup_date: new Date('2025-12-01'),
      delivery_date: new Date('2025-11-01'), // Before pickup!
    };

    const result = validateOrder(invalidOrder);
    expect(result.success).toBe(false);
  });
});
```

---

### Custom Hooks Tests

```typescript
// src/hooks/useDebounce.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated', delay: 300 });
    expect(result.current).toBe('initial'); // Still old value

    // Wait for debounce
    await waitFor(() => {
      expect(result.current).toBe('updated');
    }, { timeout: 500 });
  });

  it('cancels previous debounce on new change', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'first' });
    rerender({ value: 'second' });
    rerender({ value: 'final' });

    await waitFor(() => {
      expect(result.current).toBe('final');
    }, { timeout: 500 });

    // Should NOT have been 'first' or 'second'
  });
});
```

---

## 2️⃣ INTEGRATION TESTS (20%)

### Technologie
- **Framework:** React Testing Library
- **Mocking:** MSW (Mock Service Worker) für API-Calls

---

### Was wird getestet?

```
✅ Component Integration
✅ User Interactions (Click, Type, Submit)
✅ Form Submissions
✅ API Integration (gemockt)
✅ Context/State Management
✅ Routing
```

---

### Component Integration Tests

```typescript
// src/components/orders/OrderCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrderCard } from './OrderCard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockOrder = {
  id: '123',
  order_number: 'ORD-001',
  customer_name: 'Test Customer',
  pickup_address: 'Test Str. 1',
  delivery_address: 'Test Str. 2',
  status: 'pending' as const,
  pickup_date: new Date('2025-12-01'),
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('OrderCard', () => {
  it('renders order information correctly', () => {
    render(<OrderCard order={mockOrder} />, { wrapper });

    expect(screen.getByText('ORD-001')).toBeInTheDocument();
    expect(screen.getByText('Test Customer')).toBeInTheDocument();
    expect(screen.getByText(/Test Str. 1/)).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<OrderCard order={mockOrder} onEdit={onEdit} />, { wrapper });

    const editButton = screen.getByRole('button', { name: /bearbeiten/i });
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockOrder.id);
  });

  it('displays correct status badge', () => {
    render(<OrderCard order={mockOrder} />, { wrapper });

    const badge = screen.getByText(/offen/i);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('badge-warning'); // gelb für pending
  });

  it('handles loading state', () => {
    render(<OrderCard order={mockOrder} isLoading={true} />, { wrapper });

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('ORD-001')).not.toBeInTheDocument();
  });
});
```

---

### Form Integration Tests

```typescript
// src/components/orders/CreateOrderForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateOrderForm } from './CreateOrderForm';

describe('CreateOrderForm', () => {
  it('validates required fields', async () => {
    const onSubmit = jest.fn();
    render(<CreateOrderForm onSubmit={onSubmit} />);

    const submitButton = screen.getByRole('button', { name: /erstellen/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/pflichtfeld/i)).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();

    render(<CreateOrderForm onSubmit={onSubmit} />);

    // Fill form
    await user.type(screen.getByLabelText(/abholadresse/i), 'Test Str. 1');
    await user.type(screen.getByLabelText(/lieferadresse/i), 'Test Str. 2');
    await user.selectOptions(screen.getByLabelText(/kunde/i), 'customer-123');

    // Submit
    const submitButton = screen.getByRole('button', { name: /erstellen/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          pickup_address: 'Test Str. 1',
          delivery_address: 'Test Str. 2',
          customer_id: 'customer-123',
        })
      );
    });
  });

  it('sanitizes HTML in text inputs', async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();

    render(<CreateOrderForm onSubmit={onSubmit} />);

    // Try to inject XSS
    await user.type(
      screen.getByLabelText(/notizen/i),
      '<script>alert("XSS")</script>Test'
    );

    await user.click(screen.getByRole('button', { name: /erstellen/i }));

    await waitFor(() => {
      const submittedData = onSubmit.mock.calls[0][0];
      expect(submittedData.notes).not.toContain('<script>');
      expect(submittedData.notes).toContain('Test'); // Sanitized but safe content kept
    });
  });
});
```

---

### API Integration Tests (MSW)

```typescript
// src/services/orders.test.ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { fetchOrders, createOrder } from './orders';

const server = setupServer(
  rest.get('/api/orders', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', order_number: 'ORD-001', status: 'pending' },
        { id: '2', order_number: 'ORD-002', status: 'delivered' },
      ])
    );
  }),

  rest.post('/api/orders', async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.json({
        id: '3',
        order_number: 'ORD-003',
        ...body,
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Order API', () => {
  it('fetches orders successfully', async () => {
    const orders = await fetchOrders();

    expect(orders).toHaveLength(2);
    expect(orders[0].order_number).toBe('ORD-001');
  });

  it('creates order successfully', async () => {
    const newOrder = {
      customer_id: '123',
      pickup_address: 'Test',
      delivery_address: 'Test',
    };

    const createdOrder = await createOrder(newOrder);

    expect(createdOrder.order_number).toBe('ORD-003');
    expect(createdOrder).toMatchObject(newOrder);
  });

  it('handles API errors', async () => {
    server.use(
      rest.get('/api/orders', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
      })
    );

    await expect(fetchOrders()).rejects.toThrow('Internal Server Error');
  });
});
```

---

## 3️⃣ E2E TESTS (10%)

### Technologie
- **Framework:** Playwright
- **Browser:** Chromium, Firefox, Safari (cross-browser)

---

### Was wird getestet?

```
✅ Critical User Flows
✅ Authentication Flow
✅ Order Creation Flow
✅ Invoice Generation Flow
✅ Payment Flow
✅ Mobile Responsiveness
✅ Design System Compliance
```

---

### User Flow Tests

```typescript
// tests/e2e/flows/order-creation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Order Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@mydispatch.de');
    await page.fill('[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('complete order creation', async ({ page }) => {
    // Navigate to Orders
    await page.click('a[href="/orders"]');
    await expect(page).toHaveURL('/orders');

    // Click "Neuer Auftrag"
    await page.click('button:has-text("Neuer Auftrag")');

    // Wait for dialog
    await expect(page.locator('role=dialog')).toBeVisible();

    // Fill form
    await page.selectOption('[name="customer_id"]', { label: 'Test Customer' });
    await page.fill('[name="pickup_address"]', 'Berliner Str. 1, 10115 Berlin');
    await page.fill('[name="delivery_address"]', 'Hamburger Str. 2, 20095 Hamburg');

    // Select date
    await page.click('[name="pickup_date"]');
    await page.click('button:has-text("Heute")');

    // Submit
    await page.click('button:has-text("Erstellen")');

    // Verify success
    await expect(page.locator('text=Auftrag erstellt')).toBeVisible();

    // Verify in table
    await expect(page.locator('table')).toContainText('Test Customer');
    await expect(page.locator('table')).toContainText('Berliner Str. 1');
  });

  test('shows validation errors', async ({ page }) => {
    await page.goto('/orders');
    await page.click('button:has-text("Neuer Auftrag")');

    // Submit without filling
    await page.click('button:has-text("Erstellen")');

    // Expect validation errors
    await expect(page.locator('text=Pflichtfeld')).toBeVisible();
    await expect(page.locator('text=Pflichtfeld')).toHaveCount(3); // Customer, pickup, delivery
  });

  test('prevents XSS injection', async ({ page }) => {
    await page.goto('/orders');
    await page.click('button:has-text("Neuer Auftrag")');

    // Try XSS
    await page.selectOption('[name="customer_id"]', { index: 1 });
    await page.fill('[name="pickup_address"]', 'Test');
    await page.fill('[name="delivery_address"]', 'Test');
    await page.fill('[name="notes"]', '<script>alert("XSS")</script>');

    await page.click('button:has-text("Erstellen")');

    // Expect no alert (XSS blocked)
    await expect(page).not.toHaveURL('about:blank'); // Would redirect if XSS worked

    // Verify sanitized data
    await page.click('table tbody tr:first-child');
    await expect(page.locator('text=<script>')).not.toBeVisible();
  });
});
```

---

### Mobile Responsiveness Tests

```typescript
// tests/e2e/compliance/mobile-responsive.spec.ts
import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({
    ...devices['iPhone 12'],
  });

  test('dashboard is mobile-friendly', async ({ page }) => {
    await page.goto('/dashboard');

    // Check viewport
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeLessThanOrEqual(414);

    // KPI Cards should stack vertically
    const kpiCards = page.locator('[data-testid="kpi-card"]');
    const firstCardBox = await kpiCards.first().boundingBox();
    const secondCardBox = await kpiCards.nth(1).boundingBox();

    expect(secondCardBox?.y).toBeGreaterThan(firstCardBox!.y + firstCardBox!.height);
  });

  test('touch targets are at least 44x44px', async ({ page }) => {
    await page.goto('/orders');

    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });
});
```

---

## 📈 COVERAGE REQUIREMENTS

### Coverage-Ziele

| Metrik | Zielwert | Aktuell |
|--------|----------|---------|
| **Statements** | > 80% | - |
| **Branches** | > 75% | - |
| **Functions** | > 80% | - |
| **Lines** | > 80% | - |

---

### Coverage-Reports

```bash
# Generate Coverage Report
npm run test:coverage

# View HTML Report
open coverage/index.html

# CI: Fail on low coverage
jest --coverage --coverageThreshold='{"global":{"branches":75,"functions":80,"lines":80,"statements":80}}'
```

---

## 🤖 CI/CD INTEGRATION

### Test-Ausführung in Pipeline

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-screenshots
          path: test-results/
```

---

## ✅ TESTING CHECKLISTE

### Vor Pull Request

- [ ] Alle Unit Tests passing
- [ ] Alle Integration Tests passing
- [ ] E2E Tests für neue Features geschrieben
- [ ] Coverage > 80%
- [ ] Keine flaky Tests
- [ ] Tests lokal ausgeführt (`npm run test`)

### Vor Release

- [ ] Full E2E Test Suite passing
- [ ] Cross-Browser Tests (Chrome, Firefox, Safari)
- [ ] Mobile Tests (iOS, Android)
- [ ] Performance Tests (Lighthouse)
- [ ] Security Tests (OWASP)
- [ ] Load Tests (wenn relevant)

---

## 🔗 VERWANDTE DOKUMENTATION

- `docs/CODING_STANDARDS_V18.3.29.md` - Code-Qualität
- `docs/GIT_WORKFLOW_V18.3.29.md` - Development Workflow
- `playwright.config.ts` - Playwright Configuration
- `jest.config.js` - Jest Configuration

---

**END OF DOCUMENT**

*Diese Testing-Standards sind verbindlich für alle Test-Entwicklungen in MyDispatch.*
