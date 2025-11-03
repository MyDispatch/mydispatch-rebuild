# ⚡ PERFORMANCE GOVERNANCE V19.0.0

**Status:** Production-Ready (P-00)  
**Gültig ab:** 2025-10-25  
**Zweck:** Verpflichtende Performance-Standards für MyDispatch  
**Klassifizierung:** Bindend für alle Entwicklungen  
**Hierarchie:** Untergeordnet zu MYDISPATCH_CORPORATE_GOVERNANCE_V19.0.0.md

---

## 📋 ÜBERSICHT

MyDispatch verpflichtet sich zu **erstklassiger Performance** und exzellenter User Experience. Dieses Dokument definiert die obligatorischen Performance-Standards, Best Practices und Testing-Prozesse.

---

## 🎯 PERFORMANCE-ZIELE

### Core Web Vitals (Google Standards)

| Metrik | Ziel | Akzeptabel | Quelle |
|--------|------|------------|--------|
| **LCP** (Largest Contentful Paint) | < 1.5s | < 2.5s | Core Web Vitals |
| **FID** (First Input Delay) | < 50ms | < 100ms | Core Web Vitals |
| **CLS** (Cumulative Layout Shift) | < 0.05 | < 0.1 | Core Web Vitals |
| **FCP** (First Contentful Paint) | < 1.0s | < 1.8s | Lighthouse |
| **TTI** (Time to Interactive) | < 2.5s | < 3.8s | Lighthouse |
| **TBT** (Total Blocking Time) | < 150ms | < 300ms | Lighthouse |

### Lighthouse Score

| Kategorie | Ziel | Akzeptabel |
|-----------|------|------------|
| **Performance** | > 95 | > 90 |
| **Accessibility** | > 95 | > 90 |
| **Best Practices** | > 95 | > 90 |
| **SEO** | > 95 | > 90 |

### Bundle Size

| Asset-Typ | Ziel | Akzeptabel |
|-----------|------|------------|
| **Initial JS** | < 200 KB | < 300 KB |
| **Initial CSS** | < 50 KB | < 100 KB |
| **Images (pro Bild)** | < 100 KB | < 200 KB |
| **Fonts (gesamt)** | < 100 KB | < 150 KB |

---

## ✅ PFLICHT-OPTIMIERUNGEN

### 1. CODE-SPLITTING & LAZY LOADING

**Pflicht:** Alle Routes müssen lazy-loaded sein

**Implementierung:**
```typescript
// ✅ RICHTIG: Lazy Loading
import { lazy, Suspense } from 'react';

const Pricing = lazy(() => import('@/pages/Pricing'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}

// ❌ FALSCH: Eager Loading
import Pricing from '@/pages/Pricing';
import Dashboard from '@/pages/Dashboard';
```

### 2. IMAGE OPTIMIZATION

**Pflicht:** Alle Bilder müssen optimiert sein

**Implementierung:**
```typescript
// ✅ RICHTIG: Optimierte Bilder mit lazy loading
<img 
  src="/images/hero.webp" // WebP-Format!
  alt="MyDispatch Hero"
  loading="lazy" // Native lazy loading
  width={1920}
  height={1080}
  style={{ maxWidth: '100%', height: 'auto' }}
/>

// ✅ RICHTIG: Responsive Images
<picture>
  <source 
    srcSet="/images/hero-mobile.webp" 
    media="(max-width: 640px)"
  />
  <source 
    srcSet="/images/hero-desktop.webp" 
    media="(min-width: 641px)"
  />
  <img src="/images/hero-desktop.webp" alt="Hero" />
</picture>

// ❌ FALSCH: Unoptimierte Bilder
<img src="/images/hero.png" alt="Hero" /> // PNG statt WebP, kein lazy loading
```

**Bild-Optimierungs-Prozess:**
1. Format: WebP (Fallback: JPEG/PNG)
2. Kompression: TinyPNG / ImageOptim
3. Responsive Sizes: Mobile (375px, 640px), Desktop (1024px, 1920px)
4. Lazy Loading: `loading="lazy"` für alle Below-the-Fold Bilder

### 3. FONT OPTIMIZATION

**Pflicht:** Fonts müssen preloaded und optimiert sein

**Implementierung:**
```html
<!-- In index.html: Preload kritischer Fonts -->
<link 
  rel="preload" 
  href="/fonts/Inter-Regular.woff2" 
  as="font" 
  type="font/woff2"
  crossorigin
/>

<!-- Font-Display: swap für schnelleres Rendering -->
<style>
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/Inter-Regular.woff2') format('woff2');
    font-display: swap; /* Kritisch! */
    font-weight: 400;
  }
</style>
```

**Font-Loading-Strategie:**
1. WOFF2-Format verwenden (beste Kompression)
2. `font-display: swap` für alle Fonts
3. Nur benötigte Weights laden (400, 600, 700 für Inter)
4. Subsetting: Nur benötigte Zeichen (Latin)

### 4. REACT QUERY CACHING

**Pflicht:** Alle Server-Requests müssen gecached werden

**Implementierung:**
```typescript
// ✅ RICHTIG: React Query Caching
import { useQuery } from '@tanstack/react-query';

function useTariffs() {
  return useQuery({
    queryKey: ['tariffs'],
    queryFn: fetchTariffs,
    staleTime: 5 * 60 * 1000, // 5 Minuten
    cacheTime: 10 * 60 * 1000, // 10 Minuten
  });
}

// ❌ FALSCH: Unkontrolliertes Fetching
function Component() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchTariffs().then(setData); // Kein Caching!
  }, []);
}
```

**Caching-Strategie:**
- **Static Data (Tarife, Features):** staleTime: 5-10 Minuten
- **User Data (Profile, Bookings):** staleTime: 1-2 Minuten
- **Real-Time Data (GPS):** staleTime: 0 (immer fresh)

### 5. MEMOIZATION

**Pflicht:** Teure Berechnungen und Komponenten memoizen

**Implementierung:**
```typescript
// ✅ RICHTIG: Memoized Component
const TariffCard = React.memo(({ tariff }: TariffCardProps) => {
  return <Card>...</Card>;
});

// ✅ RICHTIG: Memoized Value
const expensiveValue = useMemo(() => {
  return tariffs.map(t => calculateDiscount(t));
}, [tariffs]);

// ✅ RICHTIG: Memoized Callback
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);

// ❌ FALSCH: Keine Memoization bei teuren Operations
function Component({ tariffs }) {
  const expensiveValue = tariffs.map(t => calculateDiscount(t)); // Re-renders!
  return <div>{expensiveValue}</div>;
}
```

### 6. VIRTUAL SCROLLING (Für lange Listen)

**Pflicht:** Listen mit >100 Elementen müssen virtualized sein

**Implementierung:**
```typescript
// ✅ RICHTIG: Virtual Scrolling
import { useVirtualizer } from '@tanstack/react-virtual';

function LongList({ items }: { items: any[] }) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Geschätzte Höhe pro Item
  });
  
  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div key={virtualItem.index}>
            {items[virtualItem.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}

// ❌ FALSCH: Rendern aller Items
function LongList({ items }: { items: any[] }) {
  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
}
```

### 7. WILL-CHANGE & HARDWARE-BESCHLEUNIGUNG

**Pflicht:** Komplexe Animationen müssen hardware-beschleunigt sein

**Implementierung:**
```typescript
// ✅ RICHTIG: Hardware-Beschleunigung
<div 
  style={{
    transform: 'translateX(0)', // Erzwingt Compositing-Layer
    willChange: 'transform', // Hint für Browser
    transition: DESIGN_TOKENS.motion.transition_transform,
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0px)';
  }}
>
  Content
</div>

// ❌ FALSCH: Nicht-hardware-beschleunigte Animation
<div 
  style={{
    marginTop: '0', // Kein Compositing!
    transition: 'margin-top 0.3s',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.marginTop = '-2px';
  }}
>
  Content
</div>
```

**Hardware-Beschleunigte Eigenschaften:**
- `transform` (translateX, translateY, scale, rotate)
- `opacity`
- `filter` (blur, brightness, etc.)

**NICHT hardware-beschleunigt:**
- `margin`, `padding`
- `width`, `height`
- `top`, `left`, `right`, `bottom`

### 8. DEBOUNCING & THROTTLING

**Pflicht:** Häufige Events (Scroll, Resize, Input) müssen gedrosselt werden

**Implementierung:**
```typescript
// ✅ RICHTIG: Debounced Input
import { useDebouncedCallback } from 'use-debounce';

function SearchInput() {
  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      // Search API call
      searchTariffs(value);
    },
    500 // 500ms Debounce
  );
  
  return (
    <input 
      type="text"
      onChange={(e) => debouncedSearch(e.target.value)}
    />
  );
}

// ❌ FALSCH: Ungethrottled Event
function SearchInput() {
  return (
    <input 
      type="text"
      onChange={(e) => searchTariffs(e.target.value)} // Auf jeden Keystroke!
    />
  );
}
```

---

## 🧪 PERFORMANCE-TESTING

### 1. Lighthouse Tests (CI/CD)

**Automatische Lighthouse-Tests für jede PR:**

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000/
            http://localhost:3000/pricing
          configPath: './lighthouserc.json'
          uploadArtifacts: true
```

**Lighthouse-Config (`lighthouserc.json`):**
```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1500 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

### 2. Bundle Size Monitoring

**Automatisches Bundle-Size-Tracking:**

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Code-Splitting: Vendor-Chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-accordion'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
  },
});
```

### 3. Performance Monitoring (Production)

**Real User Monitoring (RUM) mit Web Vitals:**

```typescript
// src/lib/performance/web-vitals.ts
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Sende an Analytics (z.B. Google Analytics, Sentry)
  console.log(metric);
}

export function initPerformanceMonitoring() {
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}

// In App.tsx
import { initPerformanceMonitoring } from '@/lib/performance/web-vitals';

useEffect(() => {
  initPerformanceMonitoring();
}, []);
```

---

## 📋 PERFORMANCE-CHECKLISTE

### Vor jedem Release

- [ ] **Lighthouse Tests:**
  - [ ] Performance-Score > 90
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1

- [ ] **Bundle Size:**
  - [ ] Initial JS < 300 KB
  - [ ] Initial CSS < 100 KB
  - [ ] Kein ungenutzter Code (Tree-Shaking)

- [ ] **Images:**
  - [ ] Alle Bilder WebP-Format
  - [ ] Lazy Loading für Below-the-Fold
  - [ ] Responsive Sizes definiert

- [ ] **Fonts:**
  - [ ] WOFF2-Format
  - [ ] font-display: swap
  - [ ] Preload für kritische Fonts

- [ ] **Code-Optimierungen:**
  - [ ] React Query Caching aktiviert
  - [ ] Teure Berechnungen memoized
  - [ ] Lazy Loading für Routes
  - [ ] Debouncing für häufige Events

- [ ] **Monitoring:**
  - [ ] Web Vitals Tracking aktiviert
  - [ ] Error-Tracking konfiguriert (Sentry)

---

## 🔗 VERWANDTE DOKUMENTATION

**Hierarchie:**
```
MYDISPATCH_CORPORATE_GOVERNANCE_V19.0.0.md (Oberste Ebene)
├─ PERFORMANCE_GOVERNANCE_V19.0.0.md (Diese Datei)
├─ DESIGN_TOKEN_GOVERNANCE_V19.0.0.md (Design-Tokens)
└─ ACCESSIBILITY_GOVERNANCE_V19.0.0.md (Accessibility)
```

**Externe Ressourcen:**
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Performance](https://vitejs.dev/guide/performance.html)

---

## 📝 CHANGELOG

### V19.0.0 (2025-10-25) - INITIAL RELEASE

**🎯 NEU:**
- Performance-Ziele definiert (Core Web Vitals, Lighthouse, Bundle Size)
- Pflicht-Optimierungen dokumentiert (Code-Splitting, Images, Fonts, Caching, Memoization)
- Hardware-Beschleunigung für Animationen (`will-change`, `transform`)
- Testing-Prozess etabliert (Lighthouse CI, Bundle-Monitoring, RUM)
- Performance-Checkliste bereitgestellt

**🔗 Integration:**
- Verknüpft mit MYDISPATCH_CORPORATE_GOVERNANCE_V19.0.0.md
- Verknüpft mit DESIGN_TOKEN_GOVERNANCE_V19.0.0.md
- Bindend für alle Entwicklungen

---

**END OF DOCUMENT**

**ANWENDUNG:**
Diese Governance ist ab sofort bindend für alle Entwicklungen. Alle neuen Features MÜSSEN die Performance-Standards erfüllen.
