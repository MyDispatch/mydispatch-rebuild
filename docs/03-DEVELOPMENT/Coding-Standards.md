# 💻 Coding Standards

> **Code-Guidelines für MyDispatch**  
> **Version:** 18.5.0  
> **Konsolidiert aus:** 15+ Development-Dokumenten  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 Grundprinzipien

### DRY (Don't Repeat Yourself)
- Keine Code-Duplikation
- Wiederverwendbare Komponenten/Hooks
- Zentrale Utilities statt Copy-Paste

### KISS (Keep It Simple, Stupid)
- Einfache Lösungen bevorzugen
- Keine Over-Engineering
- Lesbarkeit > Cleverness

### YAGNI (You Aren't Gonna Need It)
- Nur Features implementieren, die gebraucht werden
- Keine spekulativen Features
- Refactoring when needed, not before

---

## 📁 Dateistruktur

### Empfohlene Struktur

```
src/
├── components/
│   ├── ui/              # Shadcn UI Components
│   ├── shared/          # Wiederverwendbare Components
│   ├── design-system/   # Design System Components
│   └── [feature]/       # Feature-spezifische Components
├── hooks/               # Custom Hooks
├── lib/                 # Utility Functions
├── pages/               # Route Components
├── config/              # Configuration Files
└── integrations/        # External Integrations (Supabase, etc.)
```

### Naming Conventions

```tsx
// Components: PascalCase
MyComponent.tsx

// Hooks: camelCase mit "use" prefix
use-my-hook.ts

// Utils: camelCase
format-utils.ts

// Types: PascalCase mit .types.ts suffix
my-types.types.ts

// Constants: UPPER_SNAKE_CASE
const MAX_ITEMS = 10;
```

---

## 🔷 TypeScript Guidelines

### Strikte Type-Safety

```tsx
// ✅ RICHTIG - Explizite Types
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`).then(r => r.json());
}

// ❌ FALSCH - Any Types
function getUser(id: any): any {
  return fetch(`/api/users/${id}`).then(r => r.json());
}
```

### Type vs Interface

```tsx
// Type für Unions, Intersections, Primitives
type Status = 'active' | 'inactive';
type Point = { x: number; y: number };

// Interface für Objekt-Shapes (erweiternbar)
interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  permissions: string[];
}
```

### Generics verwenden

```tsx
// ✅ RICHTIG - Type-safe Generic
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = firstElement([1, 2, 3]); // number | undefined
const str = firstElement(['a', 'b']); // string | undefined
```

---

## ⚛️ React Guidelines

### Component Struktur

```tsx
/* ================================================================================
   COMPONENT NAME - Brief Description
   ================================================================================
   Props: { ... }
   Usage: <ComponentName prop={value} />
   ================================================================================ */

import { FC } from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  /** Description of prop */
  className?: string;
  children?: React.ReactNode;
}

export const Component: FC<ComponentProps> = ({ 
  className,
  children 
}) => {
  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  );
};
```

### Hooks Rules

```tsx
// ✅ RICHTIG - Top-level, nicht conditional
function Component() {
  const [state, setState] = useState(0);
  const value = useMemo(() => expensiveCalc(), []);
  
  return <div>{state}</div>;
}

// ❌ FALSCH - Conditional hooks
function Component({ condition }) {
  if (condition) {
    const [state, setState] = useState(0); // FEHLER!
  }
  return null;
}
```

### Performance Optimierung

```tsx
// useMemo für teure Berechnungen
const expensiveValue = useMemo(() => {
  return items.reduce((acc, item) => acc + item.value, 0);
}, [items]);

// useCallback für stabile Callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// React.memo für Components die nicht re-rendern müssen
export const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});
```

---

## 🎨 Styling Guidelines

### Tailwind CSS Best Practices

```tsx
// ✅ RICHTIG - cn() für conditional classes
<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)}>

// ✅ RICHTIG - Semantic Tokens
<div className="text-foreground bg-background">

// ❌ FALSCH - Direct Colors
<div className="text-white bg-[#EADEBD]">

// ❌ FALSCH - Inline Styles
<div style={{ color: 'white' }}>
```

### Responsive Design

```tsx
// ✅ RICHTIG - Mobile-First
<div className="text-sm md:text-base lg:text-lg">
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ❌ FALSCH - Desktop-First
<div className="text-lg md:text-sm">
```

---

## 🗄️ Database Best Practices

### RLS Policies IMMER verwenden

```sql
-- ✅ RICHTIG - RLS aktiviert
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
USING (auth.uid() = user_id);

-- ❌ FALSCH - Kein RLS
-- Daten sind öffentlich zugänglich!
```

### Security Definer Functions

```sql
-- ✅ RICHTIG - Security Definer mit search_path
CREATE OR REPLACE FUNCTION get_user_data(user_id UUID)
RETURNS TABLE(...)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  -- Safe function logic
END;
$$;
```

### Supabase Client Usage

```tsx
// ✅ RICHTIG - Immer importieren von zentraler Stelle
import { supabase } from '@/integrations/supabase/client';

// ❌ FALSCH - Eigene Instanz erstellen
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key);
```

---

## 🔐 Security Best Practices

### Input Validation

```tsx
// ✅ RICHTIG - Zod Schema Validation
import { z } from 'zod';

const bookingSchema = z.object({
  pickup_time: z.date().min(new Date()),
  passengers: z.number().min(1).max(8),
  pickup_address: z.string().max(500)
});

// Validate before submitting
const result = bookingSchema.safeParse(data);
```

### XSS Prevention

```tsx
// ✅ RICHTIG - DOMPurify für User-Input
import DOMPurify from 'dompurify';

const sanitized = DOMPurify.sanitize(userInput);
<div dangerouslySetInnerHTML={{ __html: sanitized }} />

// ❌ FALSCH - Direct HTML injection
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### Secrets Management

```tsx
// ✅ RICHTIG - Environment Variables
const apiKey = import.meta.env.VITE_API_KEY;

// ❌ FALSCH - Hardcoded Secrets
const apiKey = 'sk_test_123456789'; // NIEMALS!
```

---

## 📊 Error Handling

### Try-Catch Pattern

```tsx
// ✅ RICHTIG - Comprehensive Error Handling
async function fetchData() {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    toast.error('Daten konnten nicht geladen werden');
    throw error; // Re-throw for upstream handling
  }
}
```

### React Error Boundaries

```tsx
// Erstelle Error Boundary für kritische Sections
<ErrorBoundary fallback={<ErrorFallback />}>
  <CriticalComponent />
</ErrorBoundary>
```

---

## 🧪 Testing Guidelines

### Test Structure

```tsx
describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
  
  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<Component />);
    
    await user.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### Test Coverage Ziele

- Unit Tests: >80% Coverage
- E2E Tests: Kritische User-Flows
- Integration Tests: API-Endpoints

---

## 📝 Kommentare & Dokumentation

### TSDoc für Functions

```tsx
/**
 * Berechnet die Distanz zwischen zwei Koordinaten
 * @param from - Start-Koordinaten { lat, lng }
 * @param to - Ziel-Koordinaten { lat, lng }
 * @returns Distanz in Kilometern
 * @throws Error wenn Koordinaten ungültig
 */
function calculateDistance(
  from: Coordinates,
  to: Coordinates
): number {
  // Implementation
}
```

### Kommentar-Guidelines

```tsx
// ✅ RICHTIG - Erklärt "Warum"
// WORKAROUND: Supabase doesn't support batch updates
// See: https://github.com/supabase/supabase/issues/123
for (const item of items) {
  await update(item);
}

// ❌ FALSCH - Erklärt "Was" (offensichtlich)
// Loop through items
for (const item of items) {
  await update(item);
}
```

---

## 🚀 Performance Best Practices

### React Query Caching

```tsx
// ✅ RICHTIG - Stale Time setzen
const { data } = useQuery({
  queryKey: ['bookings'],
  queryFn: fetchBookings,
  staleTime: 5 * 60 * 1000, // 5 Minuten
  gcTime: 10 * 60 * 1000,   // 10 Minuten (vorher cacheTime)
});
```

### Image Optimization

```tsx
// ✅ RICHTIG - Lazy Loading + Dimensions
<img 
  src={imageUrl}
  loading="lazy"
  width={800}
  height={600}
  alt="Descriptive text"
/>
```

### Bundle Size Optimierung

```tsx
// ✅ RICHTIG - Tree-shaking friendly imports
import { debounce } from 'lodash-es';

// ❌ FALSCH - Gesamte Library importieren
import _ from 'lodash';
```

---

## ✅ Pre-Commit Checklist

```bash
[ ] npm run type-check     # TypeScript Errors
[ ] npm run lint           # ESLint Errors
[ ] npm run format         # Prettier Formatting
[ ] npm run test           # Unit Tests
[ ] npm run test:design-tokens  # Design System Check
```

---

## 📚 Weitere Ressourcen

- [Testing Guide](./Testing.md)
- [Design System](../02-ARCHITECTURE/Design-System.md)
- [Quick Reference](../01-GETTING-STARTED/Quick-Reference.md)

---

## 📝 Changelog

### V18.5.0 (2025-01-26)
- Konsolidierung aus 15+ Development-Dokumenten
- TypeScript Guidelines erweitert
- Security Best Practices hinzugefügt
- Performance Optimierung dokumentiert
