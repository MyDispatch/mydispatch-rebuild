# 💻 CODING STANDARDS V18.3.29

## MyDispatch - Corporate Development Standards

**Status:** Production-Ready  
**Letzte Aktualisierung:** 2025-10-21  
**Verantwortlich:** Senior Systemarchitekt  
**Klassifizierung:** Intern - Entwicklungsvorgabe

---

## 🎯 ZWECK

Dieses Dokument definiert **verbindliche Coding-Standards** für die Entwicklung von MyDispatch. Alle Code-Contributions MÜSSEN diesen Standards entsprechen.

**Ziel:** Maximale Code-Qualität, Wartbarkeit, Konsistenz und Fehlerfreiheit.

---

## 📋 INHALTSVERZEICHNIS

1. [TypeScript Standards](#typescript-standards)
2. [React Best Practices](#react-best-practices)
3. [Naming Conventions](#naming-conventions)
4. [File Structure](#file-structure)
5. [Import Organization](#import-organization)
6. [Error Handling](#error-handling)
7. [Comments & Documentation](#comments--documentation)
8. [Testing Standards](#testing-standards)
9. [Performance Rules](#performance-rules)
10. [Security Guidelines](#security-guidelines)

---

## 🔷 TYPESCRIPT STANDARDS

### Strict Mode (PFLICHT)

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Regel:** Keine `any` Types außer in begründeten Ausnahmefällen (z.B. Third-Party-Library ohne Types).

---

### Type-First Development

```typescript
// ✅ RICHTIG: Types zuerst definieren
interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  status: OrderStatus;
  created_at: Date;
}

type OrderStatus = 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';

// ❌ FALSCH: Inline-Types
const handleOrder = (order: { id: string; status: string }) => { ... }
```

---

### Unions statt Enums

```typescript
// ✅ RICHTIG: String Literal Unions
type OrderStatus = "pending" | "assigned" | "in_transit" | "delivered" | "cancelled";

// ❌ FALSCH: Enums (außer für Flags)
enum OrderStatus {
  Pending = "pending",
  Assigned = "assigned",
}
```

**Begründung:** Unions sind type-safer und besser tree-shakeable.

---

### Utility Types verwenden

```typescript
// Partial für optionale Updates
type OrderUpdate = Partial<Order>;

// Pick für Subsets
type OrderListItem = Pick<Order, "id" | "order_number" | "status">;

// Omit für Ausschlüsse
type CreateOrderInput = Omit<Order, "id" | "created_at">;

// Record für Maps
type OrderStatusMap = Record<OrderStatus, string>;
```

---

### Zod für Runtime-Validation

```typescript
// IMMER Zod-Schemas für externe Daten
import { z } from "zod";

const OrderSchema = z.object({
  customer_id: z.string().uuid(),
  pickup_address: z.string().min(5),
  // ...
});

// Type von Schema ableiten
type Order = z.infer<typeof OrderSchema>;
```

---

## ⚛️ REACT BEST PRACTICES

### Functional Components (PFLICHT)

```typescript
// ✅ RICHTIG: Functional Components mit TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>;
};

// ❌ FALSCH: Class Components
class Button extends React.Component { ... }
```

---

### Hooks-Regeln (React Rules of Hooks)

```typescript
// ✅ RICHTIG: Hooks immer top-level
const MyComponent = () => {
  const [state, setState] = useState(0);
  const data = useQuery({ ... });

  useEffect(() => { ... }, []);

  return <div>...</div>;
};

// ❌ FALSCH: Conditional Hooks
const MyComponent = () => {
  if (condition) {
    const [state, setState] = useState(0); // FEHLER!
  }
};
```

---

### Custom Hooks für Logic-Reuse

```typescript
// Eigene Hooks für wiederverwendbare Logik
export const useOrders = (filters: OrderFilters) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', filters],
    queryFn: () => fetchOrders(filters),
  });

  const createOrder = useMutation({ ... });
  const updateOrder = useMutation({ ... });

  return {
    orders: data,
    isLoading,
    error,
    createOrder,
    updateOrder,
  };
};

// Verwendung
const OrdersPage = () => {
  const { orders, isLoading, createOrder } = useOrders({ status: 'pending' });
  // ...
};
```

---

### Props Destructuring

```typescript
// ✅ RICHTIG: Props destructuren
export const Card = ({ title, children, className }: CardProps) => {
  return (
    <div className={cn("card", className)}>
      <h3>{title}</h3>
      {children}
    </div>
  );
};

// ❌ FALSCH: Props direkt verwenden
export const Card = (props: CardProps) => {
  return <div>{props.title}</div>;
};
```

---

### Memoization (Performance)

```typescript
// useMemo für teure Berechnungen
const filteredOrders = useMemo(() => {
  return orders.filter(o => o.status === 'pending');
}, [orders]);

// useCallback für Funktionen als Props
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);

// React.memo für Component-Level Memoization
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <div>{data}</div>;
});
```

**Regel:** Nur bei nachweisbarem Performance-Problem verwenden, nicht präventiv!

---

## 🏷️ NAMING CONVENTIONS

### Files & Folders

```
// Components (PascalCase)
✅ Button.tsx
✅ OrderCard.tsx
❌ button.tsx
❌ order-card.tsx

// Hooks (camelCase mit "use" Prefix)
✅ useOrders.ts
✅ useDebounce.ts
❌ orders.ts

// Utils (camelCase)
✅ formatDate.ts
✅ validation.ts
❌ FormatDate.ts

// Pages (PascalCase)
✅ Dashboard.tsx
✅ OrdersPage.tsx

// Folders (kebab-case)
✅ components/ui/
✅ design-system/
❌ components/UI/
❌ designSystem/
```

---

### Variables & Functions

```typescript
// Variables: camelCase
const orderCount = 10;
const isLoading = false;

// Booleans: Prefix mit is/has/should
const isActive = true;
const hasPermission = false;
const shouldRefetch = true;

// Functions: camelCase, Verb-first
const fetchOrders = async () => { ... };
const handleSubmit = () => { ... };
const validateForm = () => { ... };

// Event Handlers: Prefix "handle"
const handleClick = () => { ... };
const handleSubmit = () => { ... };
const handleChange = (e: ChangeEvent) => { ... };

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';

// Types & Interfaces: PascalCase
interface Order { ... }
type OrderStatus = 'pending' | 'delivered';
```

---

### React Components

```typescript
// Component Names: PascalCase
export const OrderCard = () => { ... };
export const KPICard = () => { ... };

// Props Interfaces: ComponentName + Props
interface OrderCardProps {
  order: Order;
  onEdit: (id: string) => void;
}

// Component Files: Match Component Name
// OrderCard.tsx contains OrderCard component
```

---

## 📁 FILE STRUCTURE

### Component File Structure

````tsx
/**
 * ========================================================================
 * COMPONENT NAME V18.3.29
 * ========================================================================
 *
 * Kurze Beschreibung der Komponente.
 *
 * VERWENDUNG:
 * ```tsx
 * <ComponentName prop1="value" />
 * ```
 * ========================================================================
 */

import React from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface ComponentNameProps {
  prop1: string;
  prop2?: number;
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_VALUE = 'default';

// ============================================================================
// COMPONENT
// ============================================================================

export const ComponentName = ({ prop1, prop2 = 0, className }: ComponentNameProps) => {
  // State
  const [state, setState] = useState(DEFAULT_VALUE);

  // Queries
  const { data } = useQuery({ ... });

  // Handlers
  const handleClick = () => {
    // ...
  };

  // Effects
  useEffect(() => {
    // ...
  }, []);

  // Render
  return (
    <div className={cn("base-classes", className)}>
      {/* Content */}
    </div>
  );
};

// ============================================================================
// HELPER FUNCTIONS (wenn nötig)
// ============================================================================

function helperFunction() {
  // ...
}
````

---

### Project Structure

```
src/
├── components/
│   ├── ui/                    # Shadcn Base Components
│   ├── design-system/         # Custom Design System
│   ├── dashboard/             # Feature-Komponenten
│   ├── orders/
│   ├── shared/                # Geteilte Komponenten
│   └── layouts/               # Layout-Wrapper
│
├── hooks/                     # Custom React Hooks
│   ├── useOrders.ts
│   ├── useDebounce.ts
│   └── index.ts               # Barrel Export
│
├── lib/                       # Utility Functions
│   ├── utils.ts               # cn() + Helpers
│   ├── sanitize.ts            # XSS-Prevention
│   ├── validation.ts          # Zod Schemas
│   └── constants.ts           # App-wide Constants
│
├── pages/                     # Route Components
│   ├── Dashboard.tsx
│   ├── Orders.tsx
│   └── index.tsx
│
├── integrations/              # External APIs
│   └── supabase/
│       ├── client.ts          # (auto-generated)
│       └── types.ts           # (auto-generated)
│
├── types/                     # TypeScript Definitions
│   ├── order.ts
│   ├── driver.ts
│   └── index.ts
│
└── App.tsx                    # Root Component
```

---

## 📦 IMPORT ORGANIZATION

### Import-Reihenfolge (ESLint Rule)

```typescript
// 1. React & External Libraries
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

// 2. Internal Libraries & Utils
import { cn } from "@/lib/utils";
import { sanitizeHTML } from "@/lib/sanitize";
import { validateOrder } from "@/lib/validation";

// 3. Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { KPICard } from "@/components/design-system/KPICard";

// 4. Hooks
import { useOrders } from "@/hooks/useOrders";

// 5. Types
import type { Order, OrderStatus } from "@/types";

// 6. Icons (Lucide)
import { Plus, Edit, Trash } from "lucide-react";

// 7. Styles (wenn separate CSS-Dateien)
import "./styles.css";
```

---

### Barrel Exports

```typescript
// components/design-system/index.ts
export { HeroSection } from "./HeroSection";
export { KPICard } from "./KPICard";
export { Icon } from "./Icon";

export type { HeroSectionProps } from "./HeroSection";
export type { KPICardProps } from "./KPICard";

// Verwendung
import { KPICard, Icon } from "@/components/design-system";
```

---

## 🚨 ERROR HANDLING

### Try-Catch für Async-Functions

```typescript
// ✅ RICHTIG: Comprehensive Error Handling
const fetchOrders = async () => {
  try {
    const { data, error } = await supabase.from("orders").select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("[fetchOrders]", error);
    throw new Error("Fehler beim Laden der Aufträge");
  }
};

// ❌ FALSCH: Keine Error Handling
const fetchOrders = async () => {
  const { data } = await supabase.from("orders").select("*");
  return data; // Was wenn error?
};
```

---

### React Query Error Handling

```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ['orders'],
  queryFn: fetchOrders,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  onError: (error) => {
    console.error('[useQuery:orders]', error);
    toast.error('Fehler beim Laden der Aufträge');
  },
});

// UI Error State
if (error) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <p className="font-semibold mb-2">Fehler beim Laden</p>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => refetch()}>Neu laden</Button>
      </CardContent>
    </Card>
  );
}
```

---

### Graceful Degradation

```typescript
// Fallback-Werte für optionale Daten
const driverName = order.driver?.full_name || "Nicht zugewiesen";

// Optional Chaining für verschachtelte Props
const cityName = order.customer?.address?.city ?? "Unbekannt";

// Nullish Coalescing statt OR
const count = order.count ?? 0; // 0 wird nicht als falsy behandelt
```

---

## 📝 COMMENTS & DOCUMENTATION

### JSDoc für Public APIs

```typescript
/**
 * Erstellt einen neuen Auftrag.
 *
 * @param orderData - Die Auftragsdaten
 * @returns Der erstellte Auftrag
 * @throws {Error} Wenn die Validierung fehlschlägt
 *
 * @example
 * const order = await createOrder({
 *   customer_id: '123',
 *   pickup_address: 'Str. 1'
 * });
 */
export async function createOrder(orderData: CreateOrderInput): Promise<Order> {
  // Implementation
}
```

---

### Inline-Kommentare (sparsam!)

```typescript
// ✅ RICHTIG: Erklärung von "Warum", nicht "Was"
// Workaround für Supabase RLS Policy Bug (Ticket #123)
const { data } = await supabase.rpc("custom_fetch_orders");

// ❌ FALSCH: Kommentiert offensichtlichen Code
// Setze loading auf true
setIsLoading(true);
```

---

### TODO-Comments

```typescript
// TODO(username): Implement pagination
// FIXME: Memory leak when unmounting
// HACK: Temporary workaround for API bug
// NOTE: This is intentional due to legacy support
```

---

## 🧪 TESTING STANDARDS

### Test File Structure

```
src/components/Button.tsx
src/components/Button.test.tsx  ✅ Co-located

tests/e2e/orders.spec.ts        ✅ Separate für E2E
```

---

### Unit Test Pattern

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(
      <Button label="Test" onClick={() => {}} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
```

---

### E2E Test Pattern

```typescript
import { test, expect } from "@playwright/test";

test.describe("Orders Page", () => {
  test("should create new order", async ({ page }) => {
    await page.goto("/orders");

    // Click "Neuer Auftrag"
    await page.click('button:has-text("Neuer Auftrag")');

    // Fill form
    await page.fill('[name="pickup_address"]', "Test Str. 1");
    await page.fill('[name="delivery_address"]', "Test Str. 2");

    // Submit
    await page.click('button:has-text("Erstellen")');

    // Verify success
    await expect(page.locator("text=Auftrag erstellt")).toBeVisible();
  });
});
```

---

## ⚡ PERFORMANCE RULES

### 1. Lazy Loading für Routes

```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Orders = lazy(() => import('@/pages/Orders'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Suspense>
  );
}
```

---

### 2. React Query Stale Time

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 Minuten
      cacheTime: 10 * 60 * 1000, // 10 Minuten
      refetchOnWindowFocus: false,
    },
  },
});
```

---

### 3. Debounce für Search

```typescript
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const [searchInput, setSearchInput] = useState("");
const debouncedSearch = useDebouncedValue(searchInput, 300);

// Query verwendet debounced value
const { data } = useQuery({
  queryKey: ["orders", debouncedSearch],
  queryFn: () => fetchOrders(debouncedSearch),
});
```

---

### 4. Image Optimization

```tsx
<img src={imageUrl} alt="Description" loading="lazy" width={400} height={300} />
```

---

## 🔒 SECURITY GUIDELINES

### 1. Input Sanitization (PFLICHT)

```typescript
import { sanitizeHTML } from '@/lib/sanitize';

// IMMER sanitizen vor Rendering
<div dangerouslySetInnerHTML={{ __html: sanitizeHTML(userContent) }} />
```

---

### 2. Input Validation (PFLICHT)

```typescript
import { validateOrder } from "@/lib/validation";

const handleSubmit = (formData: unknown) => {
  const result = validateOrder(formData);
  if (!result.success) {
    // Handle validation errors
    return;
  }

  // result.data ist validiert
  createOrder(result.data);
};
```

---

### 3. Environment Variables

```typescript
// ✅ RICHTIG: Aus .env lesen (automatisch)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// ❌ FALSCH: Hardcoded
const apiKey = "sk_test_123..."; // NIEMALS!
```

---

### 4. RLS Policies prüfen

```sql
-- IMMER RLS aktivieren
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- IMMER Policies definieren
CREATE POLICY "Users see own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);
```

---

## ✅ PRE-COMMIT CHECKLIST

- [ ] TypeScript Errors: `npm run type-check`
- [ ] ESLint: `npm run lint`
- [ ] Prettier: `npm run format`
- [ ] Tests: `npm run test`
- [ ] Build: `npm run build`
- [ ] No Console Logs (außer in catch-Blöcken)
- [ ] No `any` Types
- [ ] Alle Imports funktionieren
- [ ] Komponenten dokumentiert (JSDoc)

---

## 🔗 VERWANDTE DOKUMENTATION

- `docs/BESTÄTIGUNGS_PROMPT_V18.3.29.md` - Master Prompt
- `docs/DESIGN_SYSTEM_V18.3.29.md` - Design System
- `docs/PFLICHTENHEFT_V18.3.29.md` - Requirements
- `docs/FEHLERDATENBANK_V18.3.29.md` - Error Log
- `.eslintrc.json` - ESLint Config
- `.prettierrc` - Prettier Config

---

**END OF DOCUMENT**

_Diese Coding Standards sind verbindlich und müssen bei allen Code-Contributions befolgt werden._
