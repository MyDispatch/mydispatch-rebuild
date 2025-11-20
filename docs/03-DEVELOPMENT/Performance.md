# ⚡ Performance Guide

> **Performance-Optimierung für MyDispatch**  
> **Version:** 18.5.0  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 Performance-Ziele

### Web Vitals Budgets

| Metric | Gut | Akzeptabel | Kritisch |
|--------|-----|------------|----------|
| **FCP** (First Contentful Paint) | < 1.8s | < 3s | > 3s |
| **LCP** (Largest Contentful Paint) | < 2.5s | < 4s | > 4s |
| **TTI** (Time to Interactive) | < 3.8s | < 7.3s | > 7.3s |
| **CLS** (Cumulative Layout Shift) | < 0.1 | < 0.25 | > 0.25 |
| **FID** (First Input Delay) | < 100ms | < 300ms | > 300ms |
| **Bundle Size** | < 500KB | < 1MB | > 1MB |

---

## 🚀 Frontend-Optimierung

### 1. Code-Splitting

```tsx
// ✅ RICHTIG - Lazy Loading für Routes
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Booking = lazy(() => import('./pages/Booking'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </Suspense>
  );
}

// ❌ FALSCH - Alle Routes in einem Bundle
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
```

### 2. React Query Caching

```tsx
// ✅ RICHTIG - Aggressive Caching
const { data: bookings } = useQuery({
  queryKey: ['bookings', companyId],
  queryFn: fetchBookings,
  staleTime: 5 * 60 * 1000, // 5min Cache
  cacheTime: 10 * 60 * 1000, // 10min Memory
});

// ❌ FALSCH - Kein Caching
const { data: bookings } = useQuery({
  queryKey: ['bookings'],
  queryFn: fetchBookings,
  staleTime: 0, // Immer neu laden!
});
```

### 3. Memoization

```tsx
import { useMemo, useCallback } from 'react';

// ✅ RICHTIG - Expensive Calculations memoizen
const sortedBookings = useMemo(() => {
  return bookings.sort((a, b) => 
    new Date(b.pickup_time) - new Date(a.pickup_time)
  );
}, [bookings]);

// ✅ RICHTIG - Callbacks memoizen
const handleDelete = useCallback((id: string) => {
  deleteBooking(id);
}, []);

// ❌ FALSCH - Jeder Render neu berechnen
const sortedBookings = bookings.sort((a, b) => 
  new Date(b.pickup_time) - new Date(a.pickup_time)
);
```

### 4. Virtual Scrolling (bei langen Listen)

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function BookingList({ bookings }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: bookings.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Geschätzte Zeilenhöhe
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${item.size}px`,
              transform: `translateY(${item.start}px)`,
            }}
          >
            <BookingCard booking={bookings[item.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5. Image Optimization

```tsx
// ✅ RICHTIG - Lazy Loading + Responsive Images
<img 
  src="/images/hero.jpg"
  srcSet="/images/hero-sm.jpg 375w, /images/hero-md.jpg 768w, /images/hero-lg.jpg 1920w"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  loading="lazy"
  alt="Hero Image"
/>

// ❌ FALSCH - Große Bilder ohne Optimierung
<img src="/images/hero-full-res.jpg" alt="Hero" />
```

---

## 🗄️ Backend-Optimierung

### 1. Database Indexing

```sql
-- ✅ RICHTIG - Indexes auf häufig abgefragte Felder
CREATE INDEX idx_bookings_company_id ON bookings(company_id);
CREATE INDEX idx_bookings_pickup_time ON bookings(pickup_time);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Composite Index für komplexe Queries
CREATE INDEX idx_bookings_company_status 
ON bookings(company_id, status);

-- ❌ FALSCH - Keine Indexes
-- Query dauert 5s statt 50ms!
```

### 2. Query Optimization

```typescript
// ✅ RICHTIG - Nur benötigte Felder abfragen
const { data } = await supabase
  .from('bookings')
  .select('id, pickup_address, pickup_time, status')
  .eq('company_id', companyId)
  .limit(20);

// ❌ FALSCH - Alle Felder + Alle Zeilen
const { data } = await supabase
  .from('bookings')
  .select('*'); // Alle Felder!
// Keine Pagination!
```

### 3. Materialized Views (für komplexe Reports)

```sql
-- Für komplexe Dashboard-Stats
CREATE MATERIALIZED VIEW company_stats AS
SELECT 
  company_id,
  COUNT(*) as total_bookings,
  SUM(final_price) as total_revenue,
  AVG(final_price) as avg_booking_price
FROM bookings
WHERE status = 'completed'
GROUP BY company_id;

-- Index für schnelle Abfragen
CREATE INDEX idx_company_stats_company_id 
ON company_stats(company_id);

-- Refresh täglich (Cronjob)
REFRESH MATERIALIZED VIEW company_stats;
```

### 4. Connection Pooling

```typescript
// Supabase nutzt automatisch Connection Pooling
// ABER: Queries effizient gestalten!

// ✅ RICHTIG - Batching
const { data } = await supabase
  .from('bookings')
  .select('*, customer:customers(*)')
  .in('id', bookingIds);

// ❌ FALSCH - N+1 Problem
for (const booking of bookings) {
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', booking.customer_id)
    .single();
}
```

---

## 📦 Bundle-Optimierung

### 1. Tree-Shaking

```typescript
// ✅ RICHTIG - Named Imports
import { Button } from '@/components/ui/button';

// ❌ FALSCH - Default Import
import * as Components from '@/components/ui'; // Importiert ALLES!
```

### 2. Vite Config Optimierung

```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React-Vendor-Bundle
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI-Vendor-Bundle
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
          ],
          
          // Utility-Bundle
          'utils': ['date-fns', 'zod', 'clsx'],
        },
      },
    },
    
    // Minify
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in prod
      },
    },
  },
});
```

### 3. Bundle-Analyse

```bash
# Bundle-Größe analysieren
npm run build -- --analyze

# Output: dist/stats.html (Bundle-Visualisierung)
```

---

## 🌐 Network-Optimierung

### 1. HTTP/2 Server Push (automatisch via Lovable Cloud)

### 2. Compression (Gzip/Brotli)

```typescript
// vite.config.ts
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'brotli',
      ext: '.br',
    }),
  ],
});
```

### 3. Resource Hints

```html
<!-- public/index.html -->
<head>
  <!-- Preconnect zu kritischen Domains -->
  <link rel="preconnect" href="https://xyz.supabase.co" />
  <link rel="dns-prefetch" href="https://xyz.supabase.co" />
  
  <!-- Preload kritische Ressourcen -->
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
</head>
```

---

## 📊 Performance Monitoring

### 1. Web Vitals Tracking

```typescript
// src/lib/performance.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  console.log(metric.name, metric.value);
  
  // Optional: Send to analytics service
  // analytics.track('web_vitals', {
  //   metric: metric.name,
  //   value: metric.value,
  // });
}

export function initPerformanceMonitoring() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

### 2. React Profiler

```tsx
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
) {
  console.log(`${id} ${phase}: ${actualDuration}ms`);
}

<Profiler id="Dashboard" onRender={onRenderCallback}>
  <Dashboard />
</Profiler>
```

---

## 🚨 Performance Anti-Patterns

### NIEMALS tun:

```tsx
// ❌ 1. Inline-Functions in Props
<Button onClick={() => handleClick(id)}>Click</Button>
// → Jeder Render = neue Function-Instanz

// ✅ RICHTIG
const onClick = useCallback(() => handleClick(id), [id]);
<Button onClick={onClick}>Click</Button>

// ❌ 2. Context ohne Memoization
const value = { user, settings, preferences };
<UserContext.Provider value={value}>
// → Jeder Render = neues Object

// ✅ RICHTIG
const value = useMemo(() => ({ user, settings, preferences }), [user, settings, preferences]);

// ❌ 3. Massive useState Updates
onClick={() => {
  setState1(...);
  setState2(...);
  setState3(...); // 3 Re-Renders!
}}

// ✅ RICHTIG - Batching
import { unstable_batchedUpdates } from 'react-dom';
onClick={() => {
  unstable_batchedUpdates(() => {
    setState1(...);
    setState2(...);
    setState3(...); // 1 Re-Render!
  });
}}
```

---

## ✅ Performance Checklist

Vor jedem Deployment:

```
[ ] Bundle < 1MB (idealerweise < 500KB)
[ ] LCP < 2.5s
[ ] FCP < 1.8s
[ ] CLS < 0.1
[ ] Lazy Loading für Routes
[ ] React Query Caching konfiguriert
[ ] Images optimiert (lazy + responsive)
[ ] Database Indexes auf Foreign Keys
[ ] Keine N+1 Query-Probleme
[ ] Tree-Shaking aktiviert
[ ] Compression (Brotli) aktiv
```

---

## 📚 Weitere Ressourcen

- [Web Vitals](https://web.dev/vitals/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [Supabase Performance](https://supabase.com/docs/guides/database/performance)

---

## 📝 Changelog

### V18.5.0 (2025-01-26)
- Erstversion Performance Guide
- Web Vitals Budgets definiert
- Frontend/Backend-Optimierungen dokumentiert
- Performance Anti-Patterns hinzugefügt

---

**KRITISCH:** Performance ist User Experience. Niemals kompromittieren!
