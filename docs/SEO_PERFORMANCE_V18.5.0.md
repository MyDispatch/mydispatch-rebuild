# SEO & PERFORMANCE V18.5.0

> **Version:** 18.5.0  
> **Status:** ✅ VERBINDLICH  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 PERFORMANCE-ZIELE

| Metrik                       | Ziel  | Minimum |
| ---------------------------- | ----- | ------- |
| **Lighthouse Performance**   | >90   | >80     |
| **First Contentful Paint**   | <1.8s | <2.5s   |
| **Time to Interactive**      | <3.9s | <5.0s   |
| **Bundle Size (Initial)**    | <1MB  | <1.5MB  |
| **Largest Contentful Paint** | <2.5s | <4.0s   |

---

## ⚡ 1. CODE-SPLITTING & LAZY-LOADING

### Route-Based Code-Splitting

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

// ✅ LAZY-LOAD Heavy Routes
const Dashboard = lazy(() => import('@/pages/Index'));
const Auftraege = lazy(() => import('@/pages/Auftraege'));
const Fahrer = lazy(() => import('@/pages/Fahrer'));
const Kunden = lazy(() => import('@/pages/Kunden'));
const Einstellungen = lazy(() => import('@/pages/Einstellungen'));

// ❌ NICHT lazy-loaden: Auth-Pages (müssen sofort verfügbar sein)
import Login from '@/pages/Login';
import Register from '@/pages/Register';

export function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Dashboard />} />
        <Route path="/auftraege" element={<Auftraege />} />
        <Route path="/fahrer" element={<Fahrer />} />
        <Route path="/kunden" element={<Kunden />} />
        <Route path="/einstellungen" element={<Einstellungen />} />
      </Routes>
    </Suspense>
  );
}

const PageSkeleton = () => (
  <div className="container mx-auto p-6 space-y-4">
    <Skeleton className="h-12 w-64" />
    <Skeleton className="h-64 w-full" />
  </div>
);
```

### Component-Level Lazy-Loading

```typescript
// ❌ FALSCH - Alles sofort laden
import { HEREMapComponent } from '@/components/dashboard/HEREMapComponent';
import { PredictiveDemandWidget } from '@/components/dashboard/PredictiveDemandWidget';
import { AISupport } from '@/components/AISupport';

// ✅ RICHTIG - Lazy-Load Heavy Components
const HEREMapComponent = lazy(() => import('@/components/dashboard/HEREMapComponent'));
const PredictiveDemandWidget = lazy(() => import('@/components/dashboard/PredictiveDemandWidget'));
const AISupport = lazy(() => import('@/components/AISupport'));

export function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Suspense fallback={<Skeleton className="h-96" />}>
        <HEREMapComponent />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-64" />}>
        <PredictiveDemandWidget />
      </Suspense>
    </div>
  );
}
```

---

## 🖼️ 2. IMAGE-OPTIMIERUNG

### Responsive Images

```typescript
// ❌ FALSCH - Große Bilder für Mobile
<img src="/hero-image.jpg" alt="Hero" />

// ✅ RICHTIG - Responsive Images mit srcset
<img
  src="/hero-image-800.webp"
  srcSet="
    /hero-image-400.webp 400w,
    /hero-image-800.webp 800w,
    /hero-image-1200.webp 1200w,
    /hero-image-1920.webp 1920w
  "
  sizes="
    (max-width: 640px) 400px,
    (max-width: 1024px) 800px,
    (max-width: 1536px) 1200px,
    1920px
  "
  alt="Hero"
  loading="lazy"
  decoding="async"
/>
```

### WebP-Format mit Fallback

````typescript
// src/components/OptimizedImage.tsx

/**
 * Optimized Image Component mit WebP-Fallback
 *
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="/company-logo.jpg"
 *   alt="Company Logo"
 *   width={200}
 *   height={100}
 *   priority
 * />
 * ```
 */

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: OptimizedImageProps) => {
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
      />
    </picture>
  );
};
````

---

## 📦 3. BUNDLE-OPTIMIERUNG

### Vite-Config

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [react(), visualizer({ open: true, gzipSize: true, brotliSize: true })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor-Splitting
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          "query-vendor": ["@tanstack/react-query"],
          "form-vendor": ["react-hook-form", "zod", "@hookform/resolvers"],
          "date-vendor": ["date-fns"],
          "chart-vendor": ["recharts"],

          // Code-Splitting per Feature
          dashboard: ["./src/pages/Index.tsx"],
          booking: ["./src/pages/Auftraege.tsx"],
          driver: ["./src/pages/Fahrer.tsx"],
        },
      },
    },
    target: "es2020",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },
});
```

---

## 🚀 4. SEO-OPTIMIERUNG

### Meta-Tags-Component

````typescript
// src/components/SEOHead.tsx
import { Helmet } from 'react-helmet-async';

/**
 * SEO Head Component für Meta-Tags
 *
 * @example
 * ```tsx
 * <SEOHead
 *   title="Aufträge | MyDispatch"
 *   description="Verwalten Sie Ihre Aufträge effizient"
 *   canonical="https://app.mydispatch.de/auftraege"
 * />
 * ```
 */

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

export const SEOHead = ({
  title,
  description,
  canonical,
  ogImage = 'https://app.mydispatch.de/og-image.jpg',
  noindex = false,
}: SEOHeadProps) => {
  const fullTitle = `${title} | MyDispatch - Premium Taxi-Disposition`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical || window.location.href} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical || window.location.href} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Additional SEO */}
      <meta name="language" content="de" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="MyDispatch GmbH" />
    </Helmet>
  );
};
````

### Strukturierte Daten (JSON-LD)

```typescript
// src/components/StructuredData.tsx

/**
 * Structured Data für SEO (Schema.org)
 */

interface LocalBusinessDataProps {
  name: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  email: string;
  url: string;
  logo: string;
}

export const LocalBusinessData = ({
  name,
  address,
  phone,
  email,
  url,
  logo,
}: LocalBusinessDataProps) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    image: logo,
    '@id': url,
    url,
    telephone: phone,
    email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};
```

### Sitemap-Generator

```typescript
// scripts/generate-sitemap.ts

import { writeFileSync } from "fs";

const BASE_URL = "https://app.mydispatch.de";

const STATIC_PAGES = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/pricing", changefreq: "weekly", priority: 0.8 },
  { url: "/features", changefreq: "weekly", priority: 0.8 },
  { url: "/about", changefreq: "monthly", priority: 0.6 },
  { url: "/contact", changefreq: "monthly", priority: 0.6 },
  { url: "/datenschutz", changefreq: "monthly", priority: 0.4 },
  { url: "/impressum", changefreq: "monthly", priority: 0.4 },
  { url: "/agb", changefreq: "monthly", priority: 0.4 },
];

const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_PAGES.map(
  (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </url>`
).join("\n")}
</urlset>`;

  writeFileSync("public/sitemap.xml", sitemap);
  console.log("✅ Sitemap generated: public/sitemap.xml");
};

generateSitemap();
```

```json
// package.json
{
  "scripts": {
    "generate:sitemap": "tsx scripts/generate-sitemap.ts"
  }
}
```

---

## 🔍 5. PERFORMANCE-MONITORING

### Web Vitals Tracking

```typescript
// src/lib/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";
import * as Sentry from "@sentry/react";

/**
 * Track Web Vitals zu Sentry
 */
export const reportWebVitals = () => {
  getCLS((metric) => {
    Sentry.captureMessage(`CLS: ${metric.value}`, {
      level: "info",
      tags: { metric: "cls" },
    });
  });

  getFID((metric) => {
    Sentry.captureMessage(`FID: ${metric.value}`, {
      level: "info",
      tags: { metric: "fid" },
    });
  });

  getFCP((metric) => {
    Sentry.captureMessage(`FCP: ${metric.value}`, {
      level: "info",
      tags: { metric: "fcp" },
    });
  });

  getLCP((metric) => {
    Sentry.captureMessage(`LCP: ${metric.value}`, {
      level: "info",
      tags: { metric: "lcp" },
    });
  });

  getTTFB((metric) => {
    Sentry.captureMessage(`TTFB: ${metric.value}`, {
      level: "info",
      tags: { metric: "ttfb" },
    });
  });
};

// src/main.tsx
import { reportWebVitals } from "./lib/web-vitals";

reportWebVitals();
```

---

## 📊 6. CACHING-STRATEGIE

### Service Worker (Workbox)

```typescript
// src/sw.ts
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

// Precache Static Assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache Images (Cache-First, 30 Tage)
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Tage
      }),
    ],
  })
);

// Cache API-Calls (Network-First mit Fallback)
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 Minuten
      }),
    ],
  })
);

// Cache Fonts (Cache-First)
registerRoute(
  ({ url }) =>
    url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "fonts",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 Jahr
      }),
    ],
  })
);
```

---

## 🎯 7. LIGHTHOUSE-OPTIMIERUNG

### Checklist

- [ ] **Performance**
  - [ ] Bundle Size <1.5MB
  - [ ] Code-Splitting aktiviert
  - [ ] Lazy-Loading für Routes
  - [ ] Images optimiert (WebP, srcset)
  - [ ] Service Worker registriert

- [ ] **Accessibility**
  - [ ] Alt-Text auf allen Images
  - [ ] aria-label auf Icon-Buttons
  - [ ] Focus-States sichtbar
  - [ ] WCAG 2.1 AA Kontraste (min 4.5:1)

- [ ] **Best Practices**
  - [ ] HTTPS überall
  - [ ] Keine console.log in Production
  - [ ] CSP-Header gesetzt
  - [ ] No Mixed Content

- [ ] **SEO**
  - [ ] Meta-Tags auf allen Seiten
  - [ ] Structured Data (JSON-LD)
  - [ ] Sitemap.xml vorhanden
  - [ ] robots.txt konfiguriert
  - [ ] Canonical URLs gesetzt

---

## 📈 MONITORING-DASHBOARD

### Sentry Performance-Tracking

```typescript
// src/lib/sentry-integration.ts
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  release: `mydispatch@18.5.0`,

  // Performance Monitoring
  tracesSampleRate: 0.2, // 20% der Requests tracken

  // Profiling
  profilesSampleRate: 0.1,

  integrations: [new Sentry.BrowserTracing(), new Sentry.BrowserProfilingIntegration()],
});
```

---

## 🔧 NPM SCRIPTS

```json
{
  "scripts": {
    "analyze": "vite-bundle-visualizer",
    "lighthouse": "lighthouse https://app.mydispatch.de --view",
    "perf:audit": "npm run analyze && npm run lighthouse",
    "generate:sitemap": "tsx scripts/generate-sitemap.ts"
  }
}
```

---

**Version:** V18.5.0  
**Nächstes Audit:** Monatlich (Lighthouse-Score Review)
