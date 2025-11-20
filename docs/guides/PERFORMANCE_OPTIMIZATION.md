# Performance Optimization Guide

## React Performance Best Practices

### 1. Component Memoization

**Use React.memo for expensive components:**

```typescript
import React from 'react';

// ✅ GOOD: Memoize expensive components
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <div>{/* Expensive rendering */}</div>;
});

// ⚠️ Add custom comparison for complex props
export const SmartComponent = React.memo(
  ({ data }: Props) => <div>{data.name}</div>,
  (prevProps, nextProps) => prevProps.data.id === nextProps.data.id
);
```

### 2. useMemo & useCallback

**Memoize expensive calculations:**

```typescript
import { useMemo, useCallback } from 'react';

function MyComponent({ items }: Props) {
  // ✅ Memoize expensive calculations
  const sortedItems = useMemo(
    () => items.sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );

  // ✅ Memoize callbacks passed to children
  const handleClick = useCallback((id: string) => {
    console.log('Clicked:', id);
  }, []);

  return <ItemList items={sortedItems} onClick={handleClick} />;
}
```

### 3. Lazy Loading

**Split code with React.lazy:**

```typescript
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// ✅ Lazy load heavy components
const HeavyChart = lazy(() => import('@/components/charts/HeavyChart'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));

function Dashboard() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyChart data={chartData} />
    </Suspense>
  );
}
```

### 4. Virtual Scrolling

**For long lists (>100 items):**

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {items[virtualRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5. Image Optimization

**Use proper image formats:**

```typescript
// ✅ GOOD: Modern formats with fallback
<picture>
  <source srcSet="/hero.avif" type="image/avif" />
  <source srcSet="/hero.webp" type="image/webp" />
  <img src="/hero.jpg" alt="Hero" loading="lazy" />
</picture>

// ✅ GOOD: Lazy loading
<img src="/large-image.jpg" loading="lazy" alt="Description" />

// ✅ GOOD: Responsive images
<img
  srcSet="/image-320w.jpg 320w, /image-640w.jpg 640w, /image-1280w.jpg 1280w"
  sizes="(max-width: 640px) 100vw, 640px"
  src="/image-640w.jpg"
  alt="Responsive"
/>
```

## Bundle Size Optimization

### 1. Analyze Bundle

```bash
npm run build
npx vite-bundle-visualizer
```

### 2. Tree-Shaking

**Import only what you need:**

```typescript
// ❌ BAD: Imports entire library
import _ from "lodash";
import * as dateFns from "date-fns";

// ✅ GOOD: Tree-shakeable imports
import { debounce } from "lodash-es";
import { format, parseISO } from "date-fns";
```

### 3. Dynamic Imports

**Load code on demand:**

```typescript
// ❌ BAD: Always imports heavy library
import jsPDF from "jspdf";

function ExportButton() {
  const handleExport = () => {
    const doc = new jsPDF();
    // ...
  };
}

// ✅ GOOD: Dynamic import
function ExportButton() {
  const handleExport = async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    // ...
  };
}
```

## API Performance

### 1. Query Deduplication

**Use React Query for caching:**

```typescript
import { useQuery } from "@tanstack/react-query";

function useCustomers() {
  return useQuery({
    queryKey: ["customers", companyId],
    queryFn: fetchCustomers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}
```

### 2. Pagination

**Don't fetch all data at once:**

```typescript
function useBookings(page: number, pageSize: number = 20) {
  return useQuery({
    queryKey: ["bookings", page, pageSize],
    queryFn: () =>
      supabase
        .from("bookings")
        .select("*", { count: "exact" })
        .range(page * pageSize, (page + 1) * pageSize - 1),
  });
}
```

### 3. Debounce Search

**Reduce API calls:**

```typescript
import { useDebouncedValue } from '@/hooks/use-debounced-value';

function SearchInput() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: () => searchAPI(debouncedSearch),
    enabled: debouncedSearch.length > 2,
  });

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

## Database Performance

### 1. Use Indexes

```sql
-- ✅ Add indexes for frequently queried columns
CREATE INDEX idx_bookings_company_id ON bookings(company_id);
CREATE INDEX idx_bookings_date ON bookings(pickup_date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ✅ Composite indexes for complex queries
CREATE INDEX idx_bookings_company_status ON bookings(company_id, status);
```

### 2. Select Only Needed Columns

```typescript
// ❌ BAD: Fetches all columns
const { data } = await supabase.from("bookings").select("*");

// ✅ GOOD: Select specific columns
const { data } = await supabase.from("bookings").select("id, pickup_date, customer_name, status");
```

### 3. Use RPC for Complex Queries

```sql
-- Create stored procedure
CREATE OR REPLACE FUNCTION get_dashboard_stats(p_company_id UUID)
RETURNS JSON AS $$
  SELECT json_build_object(
    'total_bookings', COUNT(*),
    'pending_bookings', COUNT(*) FILTER (WHERE status = 'pending'),
    'revenue', SUM(price)
  )
  FROM bookings
  WHERE company_id = p_company_id
    AND pickup_date >= CURRENT_DATE - INTERVAL '30 days';
$$ LANGUAGE sql STABLE;
```

```typescript
// Use in TypeScript
const { data } = await supabase.rpc("get_dashboard_stats", {
  p_company_id: companyId,
});
```

## Monitoring

### 1. Performance Metrics

```typescript
import { useEffect } from "react";

function usePerformanceMonitoring(componentName: string) {
  useEffect(() => {
    const start = performance.now();

    return () => {
      const duration = performance.now() - start;
      if (duration > 1000) {
        console.warn(`${componentName} took ${duration.toFixed(2)}ms to render`);
      }
    };
  }, [componentName]);
}
```

### 2. Web Vitals

```bash
# Install web-vitals
npm install web-vitals

# src/lib/web-vitals.ts
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

export function reportWebVitals() {
  onCLS(console.log);
  onFID(console.log);
  onLCP(console.log);
  onFCP(console.log);
  onTTFB(console.log);
}
```

## Checklist

- [ ] Components memoized with `React.memo`
- [ ] Expensive calculations wrapped in `useMemo`
- [ ] Callbacks stabilized with `useCallback`
- [ ] Heavy components lazy-loaded
- [ ] Lists virtualized (>100 items)
- [ ] Images lazy-loaded and optimized
- [ ] Bundle analyzed and optimized
- [ ] Tree-shaking enabled (lodash-es, not lodash)
- [ ] Dynamic imports for heavy libraries
- [ ] API queries cached with React Query
- [ ] Pagination implemented for large datasets
- [ ] Search debounced (300ms)
- [ ] Database indexes on frequently queried columns
- [ ] RPC functions for complex queries
- [ ] Web Vitals monitored

## Target Metrics

| Metric                         | Target | Current  |
| ------------------------------ | ------ | -------- |
| First Contentful Paint (FCP)   | <1.8s  | ✅       |
| Largest Contentful Paint (LCP) | <2.5s  | ✅       |
| Time to Interactive (TTI)      | <3.8s  | ⏳       |
| Total Blocking Time (TBT)      | <300ms | ⏳       |
| Cumulative Layout Shift (CLS)  | <0.1   | ✅       |
| Bundle Size (JS)               | <500KB | ⚠️ 650KB |
| Bundle Size (CSS)              | <100KB | ✅ 185KB |

**Measured with:** Lighthouse CI, WebPageTest
