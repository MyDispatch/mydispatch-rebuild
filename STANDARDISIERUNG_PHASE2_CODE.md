# PHASE 2: CODE-STANDARDISIERUNG - Vereinfachung & Konsistenz

## Status: 🟡 HIGH PRIORITY (Nach Phase 1)

### 2.1 Component Consolidation (469 Components → Target: 350)

**Problem:**

- 469 Components (zu viele Varianten)
- Duplicate Patterns: `Button` vs `V28Button` vs `StandardButton`
- Inkonsistente Props: `className` vs `classes`, `size` vs `variant`

**Duplicate Components Identifiziert:**

#### Buttons (5 Varianten → 2)

```
❌ components/ui/button.tsx (shadcn/ui - deprecated)
❌ components/shared/StandardButton.tsx (redundant)
✅ components/design-system/V28Button.tsx (KEEP)
✅ lib/components/V28Button/V28Button.tsx (Storybook - KEEP)
```

#### Cards (4 Varianten → 2)

```
❌ components/ui/card.tsx (shadcn/ui - deprecated)
❌ components/shared/StatCard.tsx (duplicate)
✅ components/design-system/V28Card.tsx (KEEP)
✅ components/smart-templates/StatCard.tsx (specialized - KEEP)
```

#### Badges (3 Varianten → 1)

```
❌ components/ui/badge.tsx (shadcn/ui - deprecated)
❌ components/shared/Badge.tsx (redundant)
✅ components/design-system/V28Badge.tsx (KEEP)
```

**Consolidation Strategy:**

```typescript
// BEFORE: 5 Button imports
import { Button } from "@/components/ui/button";
import { V28Button } from "@/components/design-system/V28Button";
import { StandardButton } from "@/components/shared/StandardButton";

// AFTER: 1 unified import
import { Button } from "@/components/design-system/Button"; // Re-export V28Button
```

**Script for Auto-Migration:**

```bash
# Find and replace deprecated imports
npm run migrate:components
```

**Estimated Impact:** 469 → 350 Components (-25%)

---

### 2.2 Hook Consolidation (109 Hooks → Target: 80)

**Problem:**

- Duplicate data-fetching hooks
- Inconsistent naming: `use-bookings` vs `useBookings`
- Missing React Query best practices

**Identified Duplicates:**

#### Data Fetching (15 hooks)

```typescript
// BEFORE: Separate hooks
useBookings(); // src/hooks/use-bookings.tsx
useRealtimeBookings(); // src/hooks/use-realtime-bookings.tsx
useBookingStats(); // src/hooks/use-booking-stats.ts

// AFTER: Unified hook with options
useBookings({ realtime: true, includeStats: true });
```

#### Form Validation (8 hooks)

```typescript
// BEFORE: Separate validation hooks
useCustomerValidation();
useDriverValidation();
useVehicleValidation();

// AFTER: Generic validation hook
useEntityValidation<Customer>({ schema: customerSchema });
```

**Consolidation Pattern:**

```typescript
// src/hooks/api/useEntity.ts (Generic Pattern)
export function useEntity<T>(
  entity: string,
  options: {
    realtime?: boolean;
    companyScoped?: boolean;
    includeStats?: boolean;
  } = {}
) {
  const query = useQuery({
    queryKey: [entity, options],
    queryFn: () => fetchEntity<T>(entity, options),
  });

  // Realtime subscription optional
  if (options.realtime) {
    useRealtimeSubscription(entity, query.refetch);
  }

  return query;
}

// Usage
const { data: bookings } = useEntity<Booking>("bookings", { realtime: true });
const { data: customers } = useEntity<Customer>("customers");
```

**Estimated Impact:** 109 → 80 Hooks (-27%)

---

### 2.3 File Organization & Naming Conventions

**Problem:**

- Mixed naming: `use-auth.tsx` vs `useAuth.ts`
- Inconsistent folder structure
- Components in wrong locations

**Standard Folder Structure:**

```
src/
├── components/
│   ├── design-system/      # V28 Components (frozen)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── index.ts        # Barrel export
│   ├── features/           # Feature-specific (NEW)
│   │   ├── bookings/
│   │   ├── customers/
│   │   └── drivers/
│   ├── layout/             # Layout components (frozen)
│   └── shared/             # Cross-feature components
├── hooks/
│   ├── api/                # Data fetching hooks
│   ├── forms/              # Form hooks
│   └── ui/                 # UI state hooks
├── lib/
│   ├── api/                # API clients
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript types
├── pages/                  # Route pages
└── config/                 # App configuration
```

**Naming Conventions:**

```typescript
// FILES
✅ Button.tsx                 (PascalCase for components)
✅ useAuth.ts                 (camelCase for hooks)
✅ api-client.ts              (kebab-case for utilities)
✅ Button.test.tsx            (*.test.tsx for tests)
✅ Button.stories.tsx         (*.stories.tsx for Storybook)

// COMPONENTS
✅ export function Button() {}      (Named export)
❌ export default Button;           (Avoid default exports)

// HOOKS
✅ export function useAuth() {}     (use prefix)
❌ export function getAuth() {}     (Reserved for functions)

// TYPES
✅ export interface ButtonProps {}  (PascalCase + Props suffix)
✅ export type ButtonVariant = ...  (PascalCase + type suffix)
```

**Migration Script:**

```bash
# Automated file renaming
npm run migrate:naming-conventions

# Manual review required for
node scripts/find-inconsistent-names.js
```

---

### 2.4 ESLint & Prettier Standardization

**Current Config Issues:**

- Prettier rules conflict with ESLint
- No import ordering enforced
- Missing React hooks rules

**Unified ESLint Config:**

```javascript
// eslint.config.js (Updated)
export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefreshPlugin,
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
    },
    rules: {
      // React
      "react/jsx-no-target-blank": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      // Imports
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling"], "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],
      "import/no-duplicates": "error",

      // Best Practices
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "prefer-const": "error",
    },
  },
];
```

**Prettier Config:**

```json
// .prettierrc (Updated)
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "importOrder": ["^react", "^@?\\w", "^@/", "^[./]"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

**Run Standardization:**

```bash
# Format entire codebase
npm run format

# Fix all auto-fixable ESLint issues
npm run lint:fix

# Check remaining manual fixes
npm run quality:check
```

---

### 2.5 TypeScript Type Safety Improvements

**Problem:**

- 200+ `any` types
- Missing return types
- Inconsistent type imports

**Type Safety Checklist:**

#### 1. Remove all `any` types

```typescript
// BEFORE
const data: any = await fetchData();

// AFTER
const data: BookingData = await fetchData<BookingData>();
```

#### 2. Add explicit return types

```typescript
// BEFORE
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// AFTER
function calculateTotal(items: BookingItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

#### 3. Use `import type` for types

```typescript
// BEFORE
import { BookingData } from "@/types/booking";

// AFTER
import type { BookingData } from "@/types/booking";
```

**Automated Fix Script:**

```bash
# Find all 'any' types
npm run check:any-types

# Automated type inference (where possible)
npm run migrate:add-types

# Manual review required
node scripts/find-missing-types.js
```

**Estimated Impact:** 200+ `any` → 50 `any` (-75%)

---

### 2.6 Deprecated Code Removal

**Found via grep_search:**

```typescript
// 50+ instances of TODO/FIXME/DEPRECATED
```

**Categories:**

#### 1. DEPRECATED Functions/Components (Priority: HIGH)

```
❌ UNIFIED_DESIGN_TOKENS (src/lib/design-system/unified-design-tokens.ts)
   → Migrate to @/config/design-tokens

❌ LEGACY_QUERY_KEYS (src/lib/query-client.ts)
   → Migrate to @/lib/react-query/query-keys

❌ VITE_SUPABASE_ANON_KEY (Environment Variable)
   → Migrate to VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
```

#### 2. TODO Items (Priority: MEDIUM)

```
TODO: Create deletion_requests table (gdpr-export.ts)
TODO: Implement ZIP export (UniversalDownload.tsx)
```

#### 3. FIXME Items (Priority: LOW)

```
FIXME: Improve error handling (multiple files)
```

**Cleanup Script:**

```bash
# Remove all deprecated code
npm run clean:deprecated

# Convert TODOs to GitHub Issues
node scripts/todos-to-issues.js

# Remove dead code (unused exports)
npm run clean:dead-code
```

---

### 2.7 API Layer Standardization

**Problem:**

- Direct Supabase calls in components
- Inconsistent error handling
- No centralized API client

**Unified API Pattern:**

```typescript
// src/lib/api/base-client.ts (NEW)
export class APIClient {
  private supabase = supabase;

  async get<T>(table: string, options: QueryOptions = {}): Promise<Result<T[]>> {
    try {
      const { companyId } = options;
      let query = this.supabase.from(table).select("*");

      if (companyId) {
        query = query.eq("company_id", companyId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  }

  async create<T>(table: string, data: Partial<T>): Promise<Result<T>> {
    // ...similar pattern
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<Result<T>> {
    // ...similar pattern
  }

  async delete(table: string, id: string): Promise<Result<void>> {
    // Soft delete by default
    return this.update(table, id, { archived: true, archived_at: new Date().toISOString() });
  }
}

export const api = new APIClient();
```

**Usage in Hooks:**

```typescript
// BEFORE: Direct Supabase
const { data, error } = await supabase.from("bookings").select("*").eq("company_id", companyId);

// AFTER: Unified API
const { data, error } = await api.get<Booking>("bookings", { companyId });
```

**Benefits:**

- ✅ Centralized error handling
- ✅ Automatic company scoping
- ✅ Type safety
- ✅ Easy mocking for tests
- ✅ RLS compliance

---

## IMPLEMENTATION PLAN

### Week 1: Component Consolidation

- Day 1-2: Identify duplicates (automated script)
- Day 3-4: Migrate to V28 components
- Day 5: Remove deprecated components

### Week 2: Hook Consolidation

- Day 1-2: Create generic useEntity hook
- Day 3-4: Migrate existing hooks
- Day 5: Remove redundant hooks

### Week 3: File Organization

- Day 1-2: Rename files (automated script)
- Day 3-4: Reorganize folder structure
- Day 5: Update imports (barrel exports)

### Week 4: Code Quality

- Day 1: Run ESLint/Prettier on entire codebase
- Day 2-3: Fix TypeScript `any` types
- Day 4: Remove deprecated code
- Day 5: Final quality check

---

## MEASUREMENT & VALIDATION

### Before (Current)

```
Components:      469
Hooks:           109
Bundle Size:     4.64 MB
TypeScript Errors: 0 (with noImplicitAny: false)
ESLint Warnings: ~200
```

### After (Target)

```
Components:      350 (-25%)
Hooks:           80 (-27%)
Bundle Size:     2.5 MB (-46%)
TypeScript Errors: 0 (with noImplicitAny: true)
ESLint Warnings: 0
```

### Validation Commands

```bash
npm run quality:full        # Full quality check
npm run test:all           # All tests pass
npm run build              # Build success < 2 min
npm run check:bundle-size  # Bundle < 2.5 MB
```

---

**Estimated Time:** 4 weeks (part-time) | 2 weeks (full-time)
**Priority:** 🟡 HIGH (After Phase 1 deployment)
**Owner:** Development Team + AI Agent Support
