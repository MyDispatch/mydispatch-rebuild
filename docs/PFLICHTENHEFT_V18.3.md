# 📋 PFLICHTENHEFT V18.3 - MyDispatch Premium+

**Dokument-Typ:** Requirements Specification (Lastenheft + Pflichtenheft)  
**Erstellt:** 2025-10-21  
**Status:** ✅ Vollständig & Verbindlich  
**Gültigkeit:** Gesamtsystem MyDispatch V18.3+  
**Compliance:** ISO 25010, DIN 66001, DSGVO Art. 25

---

## 🎯 EXECUTIVE SUMMARY

### **Projektziel**

MyDispatch ist eine **Cloud-basierte SaaS-Plattform** für Taxi- und Mietwagenunternehmen zur **vollständigen Digitalisierung** von Disposition, Fuhrparkverwaltung, Abrechnung und Kommunikation.

### **Zielgruppe**

- **Primär:** Taxi- & Mietwagenunternehmen (5-500 Fahrzeuge)
- **Sekundär:** Einzelfahrer (Taxi-Portal)
- **Tertiär:** Endkunden (Buchungsportal)

### **Kernfunktionen (MVP)**

1. ✅ **Auftragsverwaltung** (Bookings, Angebote, Tracking)
2. ✅ **Fuhrparkmanagement** (Fahrzeuge, Fahrer, Dokumente)
3. ✅ **Finanzwesen** (Rechnungen, Kostenstellen, Abrechnungen)
4. ✅ **Kommunikation** (Chat, Benachrichtigungen, WhatsApp)
5. ✅ **Analytics** (KPIs, Reports, Statistiken)

---

## 📊 SYSTEMARCHITEKTUR

### **1. Technology Stack**

#### **Frontend**

```yaml
Framework: React 18.3+ (TypeScript)
Build Tool: Vite 6+
UI Library: Radix UI + Shadcn/UI
Styling: Tailwind CSS 3.4+ (JIT)
State Management: TanStack Query + Zustand
Routing: React Router v6
Forms: React Hook Form + Zod
Charts: Recharts
Maps: Google Maps API / HERE Maps
Icons: Lucide React
```

#### **Backend**

```yaml
Platform: Lovable Cloud (Supabase-based)
Database: PostgreSQL 15+ (Supabase)
Auth: Supabase Auth (JWT + RLS)
Storage: Supabase Storage (S3-compatible)
Edge Functions: Deno Runtime
Realtime: Supabase Realtime (WebSockets)
```

#### **Infrastructure**

```yaml
Hosting: Vercel / Netlify (CDN)
DNS: Cloudflare
CI/CD: GitHub Actions
Monitoring: Sentry
Analytics: Google Analytics 4
Logs: Supabase Logs
```

### **2. Datenbank-Schema (Kernentitäten)**

```sql
-- Unternehmen (Multi-Tenancy Root)
companies (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  company_slug TEXT UNIQUE,
  tax_id TEXT UNIQUE,
  address TEXT,
  phone TEXT,
  email TEXT,
  company_status company_status DEFAULT 'trial',
  landingpage_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Benutzer (Auth-System)
profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  company_id UUID REFERENCES companies,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Rollen (RBAC)
user_roles (
  user_id UUID REFERENCES profiles,
  role app_role NOT NULL, -- admin, dispatcher, driver, customer
  PRIMARY KEY (user_id, role)
)

-- Aufträge
bookings (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies NOT NULL,
  customer_id UUID REFERENCES customers,
  driver_id UUID REFERENCES drivers,
  vehicle_id UUID REFERENCES vehicles,
  pickup_time TIMESTAMPTZ NOT NULL,
  pickup_address TEXT NOT NULL,
  dropoff_address TEXT NOT NULL,
  status booking_status DEFAULT 'pending',
  price DECIMAL(10,2),
  passengers INT CHECK (passengers BETWEEN 1 AND 8),
  luggage INT CHECK (luggage BETWEEN 0 AND 8),
  payment_status payment_status DEFAULT 'unpaid',
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Kunden
customers (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  has_portal_access BOOLEAN DEFAULT false,
  customer_type customer_type DEFAULT 'private',
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Fahrer
drivers (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  license_number TEXT,
  p_schein_expiry_date DATE,
  shift_status shift_status DEFAULT 'off_duty',
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Fahrzeuge
vehicles (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies NOT NULL,
  license_plate TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  vehicle_class vehicle_class DEFAULT 'limousine',
  status vehicle_status DEFAULT 'available',
  tuv_expiry_date DATE,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
)

-- Rechnungen
invoices (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers,
  booking_id UUID REFERENCES bookings,
  amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2),
  status invoice_status DEFAULT 'draft',
  due_date DATE,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### **3. Row Level Security (RLS)**

**Prinzip:** Zero-Trust Security Model

```sql
-- Multi-Tenancy Enforcement (Beispiel für bookings)
CREATE POLICY "Users see only their company bookings"
ON public.bookings
FOR SELECT
USING (
  company_id = (SELECT company_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Portal Customer Access (Beispiel)
CREATE POLICY "Portal customers see own bookings"
ON public.bookings
FOR SELECT
USING (
  customer_id IN (
    SELECT id FROM public.customers
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND has_portal_access = true
  )
);
```

---

## 🎨 DESIGN SYSTEM

### **1. Farbpalette (HSL-Semantic Tokens)**

```css
:root {
  /* CI Primary Colors */
  --primary: 40 31% 88%; /* Beige #EADEBD */
  --primary-foreground: 225 31% 28%; /* Navy #323D5E */

  /* UI Base Colors */
  --background: 40 8% 95%; /* Light Beige #F8F7F4 */
  --foreground: 225 31% 28%; /* Navy #323D5E */
  --card: 0 0% 100%; /* White */
  --card-foreground: 225 31% 28%; /* Navy */

  /* Semantic Colors */
  --success: 142 76% 36%; /* Green #16A34A */
  --warning: 38 92% 50%; /* Orange #F59E0B */
  --error: 0 84% 60%; /* Red #EF4444 */

  /* Neutral Colors */
  --muted: 210 40% 96%; /* Light Gray */
  --muted-foreground: 215 16% 47%; /* Mid Gray */
  --border: 214 32% 91%; /* Border Gray */
}
```

### **2. Typography**

```css
/* Font Family */
font-family:
  "Inter",
  system-ui,
  -apple-system,
  sans-serif;

/* Font Sizes (Mobile-First) */
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
} /* 12px */
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
} /* 14px */
.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
} /* 16px */
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
} /* 18px */
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
} /* 20px */
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
} /* 24px */
.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
} /* 30px */
.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
} /* 36px */

/* Font Weights */
.font-light {
  font-weight: 300;
}
.font-normal {
  font-weight: 400;
}
.font-medium {
  font-weight: 500;
}
.font-semibold {
  font-weight: 600;
}
.font-bold {
  font-weight: 700;
}
.font-extrabold {
  font-weight: 800;
}
```

### **3. Spacing (8px-Grid)**

```css
/* Padding/Margin Scale */
.p-0 {
  padding: 0;
} /* 0px */
.p-1 {
  padding: 0.25rem;
} /* 4px */
.p-2 {
  padding: 0.5rem;
} /* 8px */
.p-3 {
  padding: 0.75rem;
} /* 12px */
.p-4 {
  padding: 1rem;
} /* 16px */
.p-6 {
  padding: 1.5rem;
} /* 24px */
.p-8 {
  padding: 2rem;
} /* 32px */
.p-12 {
  padding: 3rem;
} /* 48px */
```

### **4. Touch Targets (Mobile)**

```css
/* Minimum Touch Target Size (WCAG 2.1 AAA) */
.min-h-[44px] {
  min-height: 44px;
}
.min-w-[44px] {
  min-width: 44px;
}

/* Interactive Elements */
button,
a[role="button"],
input,
select {
  min-height: 44px;
  min-width: 44px;
  padding: 0.5rem 1rem;
}
```

---

## 🔒 SECURITY REQUIREMENTS

### **1. Authentication & Authorization**

#### **A. User Authentication**

- ✅ **Email + Password** (bcrypt hashing)
- ✅ **Magic Link** (passwordless)
- ✅ **OAuth** (Google, Microsoft) - Geplant Phase 2
- ✅ **MFA (2FA)** - Geplant Phase 2

#### **B. Session Management**

- ✅ **JWT Tokens** (15 min exp, httpOnly cookies)
- ✅ **Refresh Tokens** (7 Tage exp, secure storage)
- ✅ **Auto-Logout** bei Inaktivität (30 min)

#### **C. Role-Based Access Control (RBAC)**

```typescript
enum AppRole {
  ADMIN = "admin", // Volle Rechte
  DISPATCHER = "dispatcher", // Disposition + Aufträge
  DRIVER = "driver", // Fahrer-App (nur eigene Schichten)
  CUSTOMER = "customer", // Kunden-Portal (nur eigene Buchungen)
}
```

### **2. Data Protection (DSGVO)**

#### **A. Privacy by Design**

- ✅ **Datenminimierung:** Nur notwendige Daten
- ✅ **Pseudonymisierung:** UUIDs statt incrementing IDs
- ✅ **Verschlüsselung:** TLS 1.3, AES-256 at rest
- ✅ **Löschkonzept:** Archivierung statt DELETE

#### **B. User Rights**

- ✅ **Auskunft (Art. 15)** - API Endpoint geplant
- ✅ **Berichtigung (Art. 16)** - Self-Service möglich
- ✅ **Löschung (Art. 17)** - Archivierung + Anonymisierung
- ✅ **Datenübertragbarkeit (Art. 20)** - Export als JSON/CSV

#### **C. Audit Logging**

```sql
-- Alle kritischen Aktionen protokollieren
audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  company_id UUID,
  action TEXT NOT NULL, -- create, update, delete, export
  entity_type TEXT NOT NULL, -- booking, customer, driver
  entity_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### **3. Input Validation (Defense in Depth)**

#### **Client-Side (React Hook Form + Zod)**

```typescript
const bookingSchema = z.object({
  pickup_time: z.date().min(new Date(), "Future dates only"),
  pickup_address: z.string().min(5).max(500),
  dropoff_address: z.string().min(5).max(500),
  passengers: z.number().int().min(1).max(8),
  luggage: z.number().int().min(0).max(8),
  special_requests: z.string().max(1000).optional(),
});
```

#### **Server-Side (Database Trigger)**

```sql
CREATE FUNCTION validate_booking_input()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.passengers < 1 OR NEW.passengers > 8 THEN
    RAISE EXCEPTION 'Passengers must be between 1 and 8';
  END IF;
  IF NEW.pickup_time < NOW() - INTERVAL '5 minutes' THEN
    RAISE EXCEPTION 'Pickup time must be in the future';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### **4. XSS & Injection Prevention**

```typescript
// KRITISCH: Niemals dangerouslySetInnerHTML ohne Sanitization
import DOMPurify from 'dompurify';

// Sichere HTML-Ausgabe
const SafeHTML = ({ html }: { html: string }) => (
  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
);

// SQL Injection Prevention: Immer Prepared Statements
const { data } = await supabase
  .from('bookings')
  .select('*')
  .eq('customer_id', customerId); // ✅ Safe (Supabase Client)

// ❌ NIEMALS:
// .query(`SELECT * FROM bookings WHERE customer_id = '${customerId}'`)
```

---

## ⚡ PERFORMANCE REQUIREMENTS

### **1. Load Time Targets**

```yaml
# Desktop (High-Speed Connection)
FCP (First Contentful Paint): < 1.0s
LCP (Largest Contentful Paint): < 2.5s
TTI (Time to Interactive): < 3.0s
TBT (Total Blocking Time): < 300ms

# Mobile (3G Connection)
FCP: < 2.0s
LCP: < 4.0s
TTI: < 5.0s
TBT: < 600ms
```

### **2. Bundle Size Limits**

```yaml
Initial Bundle (JS): < 200 KB gzipped
Initial Bundle (CSS): < 50 KB gzipped
Vendor Bundle: < 150 KB gzipped (React, Radix, etc.)
Lazy Chunks: < 50 KB each
Total Page Weight: < 1 MB (ohne dynamische Inhalte)
```

### **3. Database Performance**

```yaml
# Query Response Time Targets
Dashboard Stats: < 100ms
List Views (50 items): < 200ms
Detail Views: < 50ms
Search: < 300ms
Reports/Analytics: < 1000ms

# Caching Strategy
React Query staleTime: 5 minutes
React Query cacheTime: 30 minutes
Supabase Realtime: Live updates für kritische Daten
```

### **4. Optimierungen (Implementiert)**

- ✅ **Code Splitting:** Route-based + Component-based
- ✅ **Tree Shaking:** Vite + Rollup (automatisch)
- ✅ **Image Optimization:** WebP/AVIF, lazy loading
- ✅ **Font Loading:** Preload + display=swap
- ✅ **Memoization:** React.memo, useMemo, useCallback
- ✅ **Virtualization:** Large lists (1000+ items)
- ✅ **Debouncing:** Search inputs (300ms delay)

---

## ♿ ACCESSIBILITY REQUIREMENTS (WCAG 2.1 AA)

### **1. Keyboard Navigation**

- ✅ Alle Funktionen per Tastatur bedienbar
- ✅ Sichtbarer Focus-State (ring-2 ring-primary)
- ✅ Skip Links für Hauptinhalt
- ✅ Tab-Reihenfolge logisch

### **2. Screen Reader Support**

```tsx
// Beispiel: Accessible Button
<button
  aria-label="Neuen Auftrag erstellen"
  aria-describedby="create-booking-hint"
  onClick={handleCreate}
>
  <Plus className="h-4 w-4" aria-hidden="true" />
  <span className="sr-only">Neuen Auftrag erstellen</span>
</button>
```

### **3. Kontrastverhältnis**

- ✅ Text > 16px: 4.5:1
- ✅ Text < 16px: 7:1
- ✅ UI Components: 3:1
- ✅ Icons: 3:1 (gegen Hintergrund)

### **4. Forms**

```tsx
// Accessible Form Example
<Label htmlFor="customer-name">
  Kundenname <span aria-label="Pflichtfeld">*</span>
</Label>
<Input
  id="customer-name"
  name="customerName"
  required
  aria-required="true"
  aria-invalid={!!errors.customerName}
  aria-describedby="customer-name-error"
/>
{errors.customerName && (
  <span id="customer-name-error" role="alert" className="text-error">
    {errors.customerName.message}
  </span>
)}
```

---

## 📱 MOBILE REQUIREMENTS

### **1. Responsive Design (Mobile-First)**

```css
/* Breakpoints (Tailwind Config) */
sm: '640px'   /* Tablet Portrait */
md: '768px'   /* Tablet Landscape */
lg: '1024px'  /* Desktop */
xl: '1280px'  /* Large Desktop */
2xl: '1536px' /* Extra Large */
```

### **2. Touch Optimization**

```tsx
// Touch-friendly Interactive Elements
<button
  className="min-h-[44px] min-w-[44px] p-4"
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
>
  Aktion
</button>
```

### **3. Progressive Web App (PWA)**

```json
// manifest.json
{
  "name": "MyDispatch",
  "short_name": "Dispatch",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F8F7F4",
  "theme_color": "#323D5E",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### **4. Offline Support (Geplant Phase 2)**

- ✅ Service Worker für static assets
- ✅ IndexedDB für offline data
- ✅ Sync API für Hintergrund-Sync

---

## 🧪 TESTING REQUIREMENTS

### **1. Unit Tests (Jest + React Testing Library)**

- ✅ **Coverage Target:** ≥ 80%
- ✅ **Critical Paths:** 100% (Auth, Booking, Payment)

### **2. E2E Tests (Playwright)**

```typescript
// Example: Booking Flow Test
test("complete booking flow", async ({ page }) => {
  await page.goto("/auftraege");
  await page.click('[aria-label="Neuen Auftrag erstellen"]');
  await page.fill("#pickup-address", "München HBF");
  await page.fill("#dropoff-address", "Flughafen München");
  await page.click('button[type="submit"]');
  await expect(page.locator(".success-message")).toBeVisible();
});
```

### **3. Visual Regression Tests**

- ✅ **Tool:** Playwright Screenshots
- ✅ **Devices:** Desktop, Tablet, Mobile
- ✅ **Themes:** Light + Dark Mode

### **4. Performance Tests**

- ✅ **Tool:** Lighthouse CI
- ✅ **Frequency:** Every deploy
- ✅ **Budget:** See Performance Requirements

---

## 🔄 DEPLOYMENT & CI/CD

### **1. Environments**

```yaml
Development:
  Branch: develop
  URL: https://dev.my-dispatch.de
  Auto-deploy: On push

Staging:
  Branch: staging
  URL: https://staging.my-dispatch.de
  Auto-deploy: On push

Production:
  Branch: main
  URL: https://my-dispatch.de
  Deploy: Manual approval
```

### **2. CI/CD Pipeline (GitHub Actions)**

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      - run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
      - run: npm run lighthouse:ci

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: npm run deploy
```

### **3. Monitoring**

```typescript
// Sentry Integration
Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VITE_ENVIRONMENT,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

---

## 📈 SUCCESS METRICS

### **Technical KPIs**

- ✅ **Uptime:** 99.9% (SLA)
- ✅ **Error Rate:** < 0.1%
- ✅ **Lighthouse Score:** ≥ 95
- ✅ **Test Coverage:** ≥ 80%
- ✅ **Bundle Size:** < 200 KB

### **Business KPIs**

- ✅ **User Onboarding:** < 5 minutes
- ✅ **Booking Creation Time:** < 2 minutes
- ✅ **Support Tickets:** < 10/month
- ✅ **Churn Rate:** < 5%
- ✅ **NPS Score:** ≥ 50

---

## 🔄 CHANGELOG

### **V18.3 (2025-10-21)**

- ✅ Initial Release: Vollständiges Pflichtenheft
- ✅ System Architecture dokumentiert
- ✅ Security Requirements definiert
- ✅ Performance Targets spezifiziert
- ✅ Testing Strategy etabliert

---

**Letzte Aktualisierung:** 2025-10-21  
**Verantwortlich:** Lovable AI Agent V18.3.29  
**Status:** ✅ Production-Ready & Vollständig Verbindlich  
**Nächste Review:** 2025-11-21
