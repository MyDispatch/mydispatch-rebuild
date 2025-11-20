# 🧪 TEST TEMPLATE - MyDispatch

## Standard Pattern für Tests (Vitest + React Testing Library + Playwright)

---

## 1. Unit Tests (Vitest + React Testing Library)

### Component Test Template

```typescript
/* ==================================================================================
   [COMPONENT-NAME].test.tsx - UNIT TESTS
   ================================================================================== */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ==================================================================================
     RENDERING TESTS
     ================================================================================== */

  it('renders correctly with required props', () => {
    render(<ComponentName title="Test Title" description="Test Description" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders with optional props', () => {
    render(
      <ComponentName
        title="Test"
        description="Test"
        variant="secondary"
        size="lg"
      />
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  /* ==================================================================================
     INTERACTION TESTS
     ================================================================================== */

  it('handles click events correctly', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<ComponentName title="Test" description="Test" onClick={onClick} />);

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('handles hover events', async () => {
    const onHover = vi.fn();
    const user = userEvent.setup();

    render(<ComponentName title="Test" description="Test" onHover={onHover} />);

    await user.hover(screen.getByRole('button'));

    expect(onHover).toHaveBeenCalled();
  });

  /* ==================================================================================
     STATE TESTS
     ================================================================================== */

  it('respects disabled state', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<ComponentName title="Test" description="Test" onClick={onClick} disabled />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows loading state correctly', () => {
    render(<ComponentName title="Test" description="Test" isLoading />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  /* ==================================================================================
     ACCESSIBILITY TESTS
     ================================================================================== */

  it('has correct ARIA attributes', () => {
    render(<ComponentName title="Test Button" description="Test" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Test Button');
    expect(button).toHaveAttribute('tabIndex', '0');
  });

  it('supports keyboard navigation', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<ComponentName title="Test" description="Test" onClick={onClick} />);

    const button = screen.getByRole('button');
    button.focus();

    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalled();
  });

  /* ==================================================================================
     ERROR HANDLING TESTS
     ================================================================================== */

  it('handles errors gracefully', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<ComponentName title="Test" description="Test" />);
    }).not.toThrow();

    consoleError.mockRestore();
  });
});
```

---

### Hook Test Template

```typescript
/* ==================================================================================
   [HOOK-NAME].test.ts - HOOK TESTS
   ================================================================================== */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useApiData, useCreateApiData } from './useApiName';

// Wrapper for TanStack Query
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe('useApiData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches data successfully', async () => {
    const { result } = renderHook(() => useApiData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
  });

  it('handles errors correctly', async () => {
    // Mock API failure
    vi.mock('@/integrations/supabase/client', () => ({
      supabase: {
        from: () => ({
          select: () => ({
            eq: () => Promise.resolve({ data: null, error: { message: 'Error' } }),
          }),
        }),
      },
    }));

    const { result } = renderHook(() => useApiData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});

describe('useCreateApiData', () => {
  it('creates data successfully', async () => {
    const { result } = renderHook(() => useCreateApiData(), {
      wrapper: createWrapper(),
    });

    const newData = { name: 'Test' };

    result.current.mutate(newData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});
```

---

## 2. Integration Tests (Vitest)

```typescript
/* ==================================================================================
   [FEATURE-NAME].integration.test.tsx - INTEGRATION TESTS
   ================================================================================== */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '@/App';

describe('Feature Integration: User Registration', () => {
  beforeEach(async () => {
    // Reset Database State
    await resetTestDatabase();
  });

  it('completes full registration flow', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate to Registration
    await user.click(screen.getByText('Registrieren'));

    // Fill Form
    await user.type(screen.getByLabelText('E-Mail'), 'test@example.com');
    await user.type(screen.getByLabelText('Passwort'), 'Password123!');
    await user.type(screen.getByLabelText('Passwort bestätigen'), 'Password123!');
    await user.click(screen.getByLabelText('AGB akzeptieren'));

    // Submit
    await user.click(screen.getByRole('button', { name: 'Registrieren' }));

    // Verify Success
    await waitFor(() => {
      expect(screen.getByText('Registrierung erfolgreich')).toBeInTheDocument();
    });

    // Verify Database Entry
    const dbUser = await getUserFromDatabase('test@example.com');
    expect(dbUser).toBeDefined();
    expect(dbUser.email).toBe('test@example.com');
  });
});
```

---

## 3. E2E Tests (Playwright)

```typescript
/* ==================================================================================
   [FEATURE-NAME].e2e.spec.ts - END-TO-END TESTS
   ================================================================================== */

import { test, expect } from "@playwright/test";

test.describe("User Registration E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("complete registration flow", async ({ page }) => {
    // Navigate to Registration
    await page.click("text=Registrieren");

    // Fill Form
    await page.fill('input[name="email"]', "e2e@example.com");
    await page.fill('input[name="password"]', "Password123!");
    await page.fill('input[name="confirmPassword"]', "Password123!");
    await page.check('input[name="acceptTerms"]');

    // Submit
    await page.click('button:has-text("Registrieren")');

    // Wait for Success
    await expect(page.locator("text=Registrierung erfolgreich")).toBeVisible();

    // Verify Redirect to Dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("validation errors", async ({ page }) => {
    await page.click("text=Registrieren");

    // Try to submit without filling fields
    await page.click('button:has-text("Registrieren")');

    // Verify Error Messages
    await expect(page.locator("text=E-Mail ist erforderlich")).toBeVisible();
    await expect(page.locator("text=Passwort ist erforderlich")).toBeVisible();
  });

  test("handles server errors", async ({ page }) => {
    // Mock Server Error
    await page.route("**/api/register", (route) => {
      route.fulfill({ status: 500, body: "Server Error" });
    });

    await page.click("text=Registrieren");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "Password123!");
    await page.click('button:has-text("Registrieren")');

    // Verify Error Toast
    await expect(page.locator("text=Fehler beim Registrieren")).toBeVisible();
  });
});
```

---

## Test Utilities

### Mock Data Factory

```typescript
// tests/factories/user.factory.ts
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "test-user-id",
    email: "test@example.com",
    name: "Test User",
    role: "user",
    created_at: new Date().toISOString(),
    ...overrides,
  };
}
```

### Test Helpers

```typescript
// tests/helpers/render.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

---

## Test Coverage Target

```
Unit Tests:        >80% Coverage
Integration Tests: Critical Paths
E2E Tests:         Core User Flows
```

---

## Checklist Test Implementation

**Unit Tests:**

- [ ] Rendering Tests
- [ ] Interaction Tests (Click, Hover, Keyboard)
- [ ] State Tests (Loading, Disabled, Error)
- [ ] Accessibility Tests (ARIA, tabIndex)
- [ ] Edge Cases

**Integration Tests:**

- [ ] Full Feature Flow
- [ ] API Integration
- [ ] State Management
- [ ] Error Scenarios

**E2E Tests:**

- [ ] Critical User Paths
- [ ] Form Validation
- [ ] Navigation
- [ ] Error Handling
- [ ] Multi-Step Flows

---

**LAST UPDATE:** 2025-01-26  
**VERSION:** 1.0  
**STATUS:** ✅ TEMPLATE READY
