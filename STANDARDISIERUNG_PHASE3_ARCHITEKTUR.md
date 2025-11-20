# PHASE 3: ARCHITEKTUR & PERFORMANCE - Skalierbarkeit

## Status: 🟢 MEDIUM PRIORITY (Nach Phase 2)

### 3.1 Micro-Frontend Architecture (Optional)

**Problem:**
- Monolithische App (alle Features in einem Bundle)
- Lange Build-Zeiten (2-3 Minuten)
- Schwierig zu skalieren mit mehreren Teams

**Solution: Feature-Based Code-Splitting**

```typescript
// src/routes/index.tsx (Updated)
const BookingsModule = lazy(() => import('@/features/bookings'));
const CustomersModule = lazy(() => import('@/features/customers'));
const DriversModule = lazy(() => import('@/features/drivers'));
const PortalModule = lazy(() => import('@/features/portal'));

export const routes = [
  {
    path: '/auftraege',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <BookingsModule />
      </Suspense>
    )
  },
  // ...similar for other modules
];
```

**Folder Structure:**

```
src/features/
├── bookings/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── types/
│   └── index.tsx       # Module entry point
├── customers/
│   └── ...
└── drivers/
    └── ...
```

**Benefits:**
- ✅ Parallel development (team per feature)
- ✅ Faster builds (affected modules only)
- ✅ Smaller initial bundle
- ✅ Independent deployments (future)

**Estimated Impact:** Build time 3 min → 1.5 min

---

### 3.2 State Management Standardization

**Problem:**
- Mixed state management: React Query + Context + useState
- Prop drilling in complex components
- No global state strategy

**Current State:**
```
✅ React Query: Server state (bookings, customers)
✅ React Context: Auth, Settings, Theme
❌ Local useState: Everything else (inconsistent)
```

**Recommended: Zustand for Client State**

```typescript
// src/stores/ui-store.ts (NEW)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  language: 'de' | 'en';
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'de' | 'en') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'light',
      language: 'de',
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language })
    }),
    {
      name: 'ui-storage'
    }
  )
);
```

**Usage:**

```typescript
// BEFORE: Prop drilling
<Layout sidebarOpen={sidebarOpen} onToggle={setSidebarOpen}>
  <Header sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />
  <Sidebar open={sidebarOpen} onToggle={setSidebarOpen} />
</Layout>

// AFTER: Zustand
<Layout>
  <Header />
  <Sidebar />
</Layout>

// In any component
const { sidebarOpen, setSidebarOpen } = useUIStore();
```

**State Strategy:**

```
Server State (React Query):
- Bookings, Customers, Drivers
- Realtime subscriptions
- Cache invalidation

Client State (Zustand):
- UI preferences (sidebar, theme)
- Form wizards (multi-step)
- Temporary selections (bulk actions)

URL State (React Router):
- Pagination, filters, search
- Selected IDs (for deep linking)
```

**Estimated Impact:** Code reduction -15%, Performance +10%

---

### 3.3 Database Query Optimization

**Problem:**
- N+1 queries (missing joins)
- Over-fetching data (SELECT *)
- No query caching strategy

**Optimizations:**

#### 1. Selective Field Fetching
```typescript
// BEFORE: Over-fetching
const { data } = await supabase
  .from('bookings')
  .select('*'); // All fields (50+ columns)

// AFTER: Selective fields
const { data } = await supabase
  .from('bookings')
  .select('id, pickup_time, status, customer:customers(name, phone)');
```

#### 2. Query Joins (Eliminate N+1)
```typescript
// BEFORE: N+1 queries
const bookings = await fetchBookings();
for (const booking of bookings) {
  booking.customer = await fetchCustomer(booking.customer_id); // N queries
}

// AFTER: Single query with join
const bookings = await supabase
  .from('bookings')
  .select(`
    *,
    customer:customers(id, name, phone),
    driver:drivers(id, name),
    vehicle:vehicles(id, license_plate)
  `);
```

#### 3. Pagination Strategy
```typescript
// Standard pagination pattern
const { data, count } = await supabase
  .from('bookings')
  .select('*', { count: 'exact' })
  .range(0, 49)  // First 50 items
  .order('created_at', { ascending: false });
```

#### 4. React Query Cache Strategy
```typescript
// src/lib/react-query/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      cacheTime: 10 * 60 * 1000,     // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    }
  }
});
```

**Estimated Impact:** Query time -40%, Network requests -60%

---

### 3.4 Image Optimization

**Problem:**
- Unoptimized PNG/JPG images
- No lazy loading
- No responsive images

**Solutions:**

#### 1. Convert to WebP/AVIF
```bash
# Install sharp for image optimization
npm install sharp --save-dev

# Optimize all images
node scripts/optimize-images.js
```

#### 2. Responsive Images
```tsx
<picture>
  <source
    srcSet="/images/hero-800w.webp 800w, /images/hero-1200w.webp 1200w"
    type="image/webp"
  />
  <img
    src="/images/hero.jpg"
    alt="Hero"
    loading="lazy"
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</picture>
```

#### 3. Lazy Loading with Intersection Observer
```typescript
// src/components/shared/LazyImage.tsx
export function LazyImage({ src, alt, ...props }: ImageProps) {
  const [imageSrc, setImageSrc] = useState<string>();
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={imageSrc || '/images/placeholder.svg'}
      alt={alt}
      {...props}
    />
  );
}
```

**Estimated Impact:** Image size -70%, LCP -30%

---

### 3.5 Performance Monitoring & Budgets

**Problem:**
- No performance tracking
- No bundle size alerts
- No regression detection

**Solution: Lighthouse CI + Bundle Budgets**

#### 1. Lighthouse CI Configuration
```yaml
# .lighthouserc.json
{
  "ci": {
    "collect": {
      "url": [
        "https://www.my-dispatch.de",
        "https://www.my-dispatch.de/auftraege",
        "https://www.my-dispatch.de/dashboard"
      ],
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

#### 2. Bundle Size Budgets
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'charts': ['recharts'],
          'export-libs': ['xlsx', 'jspdf']
        }
      }
    },
    chunkSizeWarningLimit: 1000, // 1 MB warning
    reportCompressedSize: true
  },
  plugins: [
    bundleAnalyzer({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ]
});
```

#### 3. GitHub Actions Performance Check
```yaml
# .github/workflows/performance.yml
name: Performance Check

on:
  pull_request:
    branches: [master]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci --legacy-peer-deps
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v11
        with:
          configPath: './.lighthouserc.json'
          uploadArtifacts: true
```

**Estimated Impact:** Performance regression detection, CI/CD quality gates

---

### 3.6 Security Hardening

**Problem:**
- No Content Security Policy (CSP)
- Missing security headers
- No rate limiting

**Solutions:**

#### 1. Content Security Policy
```json
// vercel.json (Updated)
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://ygpwuiygivxoqtyoigtg.supabase.co wss://ygpwuiygivxoqtyoigtg.supabase.co https://api.stripe.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(self)"
        }
      ]
    }
  ]
}
```

#### 2. Rate Limiting (Edge Function)
```typescript
// supabase/functions/_shared/rate-limiter.ts
const rateLimit = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  ip: string,
  limit: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count };
}
```

#### 3. Dependency Scanning
```bash
# GitHub Dependabot alerts (already active)
# https://github.com/MyDispatch/mydispatch-rebuild/security/dependabot

# npm audit (run regularly)
npm audit --production

# Automated dependency updates
npm install -g npm-check-updates
ncu -u --target minor  # Update to latest minor versions
```

**Security Checklist:**
- [x] Supabase RLS enabled on all tables
- [x] Service role key not in frontend
- [x] HTTPS only (enforced by Vercel)
- [ ] CSP headers configured
- [ ] Rate limiting on API endpoints
- [ ] Regular dependency updates

---

### 3.7 Accessibility (A11y) Compliance

**Problem:**
- No ARIA labels
- Keyboard navigation incomplete
- Color contrast issues

**WCAG 2.1 Level AA Compliance:**

#### 1. ARIA Labels
```tsx
// BEFORE
<button onClick={handleDelete}>
  <TrashIcon />
</button>

// AFTER
<button
  onClick={handleDelete}
  aria-label="Buchung löschen"
  aria-describedby="delete-warning"
>
  <TrashIcon aria-hidden="true" />
</button>
<p id="delete-warning" className="sr-only">
  Diese Aktion kann nicht rückgängig gemacht werden
</p>
```

#### 2. Keyboard Navigation
```tsx
// Focus trap for modals
import { FocusTrap } from '@/components/shared/FocusTrap';

<Dialog>
  <FocusTrap>
    <DialogContent>
      {/* Content */}
    </DialogContent>
  </FocusTrap>
</Dialog>
```

#### 3. Color Contrast Check
```bash
# Automated check with axe-core
npm run test:a11y

# Manual check
# https://webaim.org/resources/contrastchecker/
```

#### 4. Screen Reader Testing
```bash
# Test with NVDA (Windows) or VoiceOver (Mac)
# Focus order
# Button/Link labels
# Form errors
# Status messages
```

**Accessibility Checklist:**
- [ ] All images have alt text
- [ ] All buttons have labels
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA
- [ ] Forms have proper labels
- [ ] Error messages are descriptive
- [ ] Skip to main content link
- [ ] Focus indicators visible

---

## IMPLEMENTATION TIMELINE

### Month 1: Architecture
- Week 1: Feature-based code-splitting
- Week 2: State management with Zustand
- Week 3: API layer consolidation
- Week 4: Database query optimization

### Month 2: Performance
- Week 1: Image optimization
- Week 2: Bundle size reduction
- Week 3: Performance monitoring setup
- Week 4: Lighthouse CI integration

### Month 3: Security & A11y
- Week 1: CSP headers implementation
- Week 2: Rate limiting
- Week 3: A11y audit & fixes
- Week 4: Final security review

---

## MEASUREMENT & VALIDATION

### Performance Metrics
```
Lighthouse Score:
- Performance:      > 90
- Accessibility:    > 95
- Best Practices:   > 90
- SEO:              > 95

Core Web Vitals:
- LCP (Largest Contentful Paint):  < 2.5s
- FID (First Input Delay):         < 100ms
- CLS (Cumulative Layout Shift):   < 0.1

Bundle Size:
- Initial Load:     < 500 KB (gzip)
- Total Bundle:     < 2.5 MB (gzip)
```

### Validation Commands
```bash
npm run lighthouse           # Lighthouse audit
npm run test:a11y           # Accessibility tests
npm run test:security       # Security audit
npm run analyze:bundle      # Bundle analysis
```

---

**Estimated Time:** 3 months (part-time) | 1.5 months (full-time)
**Priority:** 🟢 MEDIUM (After Phase 1 & 2)
**Owner:** Development Team + DevOps
