# 🎯 VOLLSTÄNDIGE WEBSITE-PLANUNG FÜR MYDISPATCH
## MIT COMPONENT LIBRARY, PERFORMANCE, TESTING, SECURITY & EMAIL STRATEGIE

## AUFGABE: DETAILLIERTE PLANUNG (KEINE UMSETZUNG!)

Erstelle eine vollständige, detaillierte Planung für die MyDispatch Website inklusive vollumfänglicher Component Library Strategie gemäß Design System V28.1, Performance-Optimierung, Testing-Strategie, Security-Maßnahmen und Email-System. Die Planung muss ALLE Details enthalten, aber NICHT implementiert werden!

---

## 🎨 DESIGN SYSTEM V28.1 - ABSOLUTE GRUNDLAGE

**KRITISCHE REGEL:**
ALLE Components, Elemente und Designs MÜSSEN dem Design System V28.1 entsprechen!

### Design System V28.1 Integration

**Farbschema (V28.1 Tokens):**
/* Primary Colors */
--primary: #3B82F6;
--primary-dark: #2563EB;
--primary-light: #60A5FA;
--primary-50: #EFF6FF;

/* Secondary Colors */
--secondary: #10B981;
--secondary-dark: #059669;
--secondary-light: #34D399;

/* Accent Colors */
--accent: #F59E0B;
--accent-dark: #D97706;

/* Semantic Colors */
--success: #10B981;
--warning: #F59E0B;
--danger: #EF4444;
--info: #3B82F6;

/* Neutrals */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;

/* Backgrounds */
--bg-primary: #FFFFFF;
--bg-secondary: #F9FAFB;
--bg-tertiary: #F3F4F6;

text

**Typography System (V28.1):**
/* Font Family */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes /
--text-xs: 0.75rem; / 12px /
--text-sm: 0.875rem; / 14px /
--text-base: 1rem; / 16px /
--text-lg: 1.125rem; / 18px /
--text-xl: 1.25rem; / 20px /
--text-2xl: 1.5rem; / 24px /
--text-3xl: 1.875rem; / 30px /
--text-4xl: 2.25rem; / 36px /
--text-5xl: 3rem; / 48px /
--text-6xl: 3.75rem; / 60px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Heading Styles */
H1: text-5xl (48px), font-extrabold, leading-tight, tracking-tight
H2: text-4xl (36px), font-bold, leading-tight
H3: text-3xl (30px), font-semibold, leading-normal
H4: text-2xl (24px), font-semibold, leading-normal
H5: text-xl (20px), font-medium, leading-normal
H6: text-lg (18px), font-medium, leading-normal

text

**Spacing System (V28.1 - 4px Grid):**
--spacing-0: 0;
--spacing-1: 0.25rem; /* 4px /
--spacing-2: 0.5rem; / 8px /
--spacing-3: 0.75rem; / 12px /
--spacing-4: 1rem; / 16px /
--spacing-5: 1.25rem; / 20px /
--spacing-6: 1.5rem; / 24px /
--spacing-8: 2rem; / 32px /
--spacing-10: 2.5rem; / 40px /
--spacing-12: 3rem; / 48px /
--spacing-16: 4rem; / 64px /
--spacing-20: 5rem; / 80px /
--spacing-24: 6rem; / 96px /
--spacing-32: 8rem; / 128px */

text

**Border Radius (V28.1):**
--radius-none: 0;
--radius-sm: 0.25rem; /* 4px /
--radius-md: 0.5rem; / 8px /
--radius-lg: 0.75rem; / 12px /
--radius-xl: 1rem; / 16px /
--radius-2xl: 1.5rem; / 24px */
--radius-full: 9999px;

text

**Shadows (V28.1):**
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

text

**Transitions (V28.1):**
--transition-fast: 150ms ease-in-out;
--transition-normal: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;

text

**Breakpoints (V28.1):**
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;

text

**Z-Index Scale (V28.1):**
--z-0: 0;
--z-10: 10;
--z-20: 20;
--z-30: 30;
--z-40: 40;
--z-50: 50; /* Modals, Overlays /
--z-60: 60; / Tooltips /
--z-70: 70; / Dropdowns /
--z-80: 80; / Navigation /
--z-90: 90; / Notifications /
--z-100: 100; / Critical Overlays */

text

---

## 📚 COMPONENT LIBRARY STRATEGIE

[... KOMPLETTE Component Library Strategie wie im vorherigen Prompt ...]
[Foundation, Layout, Navigation, Content, Feedback, Forms, Data, Utility, Complex Components]
[Vollständige Struktur, Specifications, Design Tokens Mapping, etc.]

---

## ⚡ PERFORMANCE STRATEGIE

### Performance Budget & Ziele

**Strikte Performance Budgets:**
PERFORMANCE BUDGETS (PFLICHT):

Bundle Size:
├─ Initial Bundle: < 150kb (gzipped)
├─ Total JS: < 250kb (gzipped)
├─ Total CSS: < 50kb (gzipped)
└─ Images per Page: < 1MB

Load Performance:
├─ First Contentful Paint (FCP): < 1.5s
├─ Largest Contentful Paint (LCP): < 2.5s
├─ Time to Interactive (TTI): < 3.5s
├─ Cumulative Layout Shift (CLS): < 0.1
└─ First Input Delay (FID): < 100ms

Lighthouse Scores (Minimum):
├─ Performance: > 90
├─ Accessibility: > 95
├─ Best Practices: > 95
└─ SEO: > 95

text

### Code Splitting & Lazy Loading

**Route-based Code Splitting:**
// Route Lazy Loading Strategy
const HomePage = lazy(() => import('./pages/Home'))
const PricingPage = lazy(() => import('./pages/Pricing'))
const FeaturesPage = lazy(() => import('./pages/Features'))
// ... etc für ALLE Pages

// Route Config
{
path: '/',
element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense>
}

text

**Component-based Lazy Loading:**
// Heavy Components lazy loaden
const PricingTable = lazy(() => import('./components/complex/PricingTable'))
const ComparisonTable = lazy(() => import('./components/complex/ComparisonTable'))
const RichTextEditor = lazy(() => import('./components/forms/RichTextEditor'))
const Carousel = lazy(() => import('./components/complex/Carousel'))

// Conditional Loading (nur wenn benötigt)
const CookieSettingsModal = lazy(() => import('./components/complex/CookieSettings'))

text

**Image Lazy Loading:**
// Alle Bilder mit lazy loading
<Image src="/hero-image.jpg" alt="MyDispatch Dashboard" loading="lazy" placeholder="blur" sizes="(max-width: 768px) 100vw, 50vw" />

// Critical Images (above fold): loading="eager"
// Non-critical: loading="lazy"

text

### Bundle Optimization

**Webpack/Vite Configuration:**
// vite.config.ts
export default {
build: {
rollupOptions: {
output: {
manualChunks: {
// Vendor Splitting
'vendor-react': ['react', 'react-dom'],
'vendor-ui': ['@radix-ui/...'], // shadcn/ui dependencies
'vendor-forms': ['react-hook-form', 'zod'],
'vendor-utils': ['date-fns', 'lodash-es'],
}
}
},
// Tree-shaking
minify: 'terser',
terserOptions: {
compress: {
drop_console: true, // Remove console.logs in production
drop_debugger: true
}
}
}
}

text

**Tree Shaking Strategy:**
// ❌ FALSCH - Importiert alles
import _ from 'lodash'

// ✅ RICHTIG - Tree-shakeable
import { debounce } from 'lodash-es'

// ❌ FALSCH - Importiert alle Icons
import * as Icons from 'lucide-react'

// ✅ RICHTIG - Nur benötigte Icons
import { ArrowRight, Check, X } from 'lucide-react'

text

### Image Optimization

**Image Strategy:**
IMAGE OPTIMIZATION (PFLICHT):

Formate:
├─ WebP: Primary format (moderner Browser Support)
├─ AVIF: Future-proof (fallback zu WebP)
└─ JPG/PNG: Fallback für alte Browser

Responsive Images:
<picture>
<source srcset="/hero.avif" type="image/avif">
<source srcset="/hero.webp" type="image/webp">
<img src="/hero.jpg" alt="..." loading="lazy" />
</picture>

Sizes Attribute:
<img srcset="/img-320.webp 320w, /img-640.webp 640w, /img-1280.webp 1280w" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" src="/img-640.webp" alt="..." />

Compression:
├─ JPG: Quality 80-85
├─ PNG: TinyPNG compression
├─ WebP: Quality 80
└─ AVIF: Quality 75

Image CDN (empfohlen):

Cloudinary / Imgix / Cloudflare Images

Automatische Format-Umwandlung

On-the-fly Resizing

Geo-distributed CDN

text

### Critical CSS

**Critical CSS Extraction:**
CRITICAL CSS STRATEGIE:

Above-the-Fold CSS:
├─ Header Styles
├─ Hero Section Styles
├─ Font-loading (nur Primary Font)
└─ Core Layout Styles

Inline Critical CSS:

<head> <style> /* Critical CSS inline (< 14kb) */ [Critical styles here] </style> <link rel="stylesheet" href="/styles.css" media="print" onload="this.media='all'"> </head>
Non-Critical CSS:

Lazy load mit media="print" trick

Preload für Next Page (optional)

text

### Font Loading Optimization

**Font Strategy:**
/* Font Display Strategy /
@font-face {
font-family: 'Inter';
src: url('/fonts/inter.woff2') format('woff2');
font-display: swap; / FOIT vermeiden /
font-weight: 400 800; / Variable Font */
}

/* Preload Critical Fonts */

<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
/* System Font Fallback */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

text

### Caching Strategy

**HTTP Caching Headers:**
Static Assets (1 year)
/assets/**/*.{js,css,woff2}
Cache-Control: public, max-age=31536000, immutable

Images (1 month)
/images/**/*.{jpg,png,webp,avif}
Cache-Control: public, max-age=2592000

HTML (no cache - revalidate)
/*.html
Cache-Control: no-cache, must-revalidate

API Responses
/api/**
Cache-Control: private, max-age=300

text

**Service Worker (Optional - PWA):**
// Service Worker Caching Strategy
const CACHE_STRATEGY = {
// Static Assets: Cache First
static: 'cache-first',

// API: Network First, Cache Fallback
api: 'network-first',

// Images: Cache First, Network Fallback
images: 'cache-first',

// HTML: Network First
pages: 'network-first'
}

text

### Third-Party Script Optimization

**Third-Party Loading:**
<!-- Analytics: Async & Defer --> <script async src="https://plausible.io/js/script.js"></script> <!-- Non-Critical Scripts: Defer --> <script defer src="/non-critical.js"></script> <!-- Lazy Load: Cookie Banner nur bei Bedarf --> <script> // Load cookie banner only wenn kein Consent if (!hasCookieConsent()) { loadScript('/cookie-banner.js') } </script>
text

### Performance Monitoring

**Real User Monitoring (RUM):**
// Web Vitals Tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
// Send to Analytics Platform
analytics.track('web-vital', {
name: metric.name,
value: metric.value,
rating: metric.rating
})
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)

text

**Lighthouse CI Integration:**
.github/workflows/lighthouse.yml
name: Lighthouse CI
run: |
npm install -g @lhci/cli
lhci autorun

lighthouserc.json
{
"ci": {
"assert": {
"assertions": {
"performance": ["error", {"minScore": 0.9}],
"accessibility": ["error", {"minScore": 0.95}],
"best-practices": ["error", {"minScore": 0.95}],
"seo": ["error", {"minScore": 0.95}]
}
}
}
}

text

---

## 🧪 TESTING STRATEGIE

### Testing Pyramide

text
     /\
    /E2E\         <- Wenige, kritische Flows
   /------\
  /Integr.\      <- Medium, Feature-Tests
 /----------\
/ Unit Tests \   <- Viele, Component-Tests
/--------------\

text

### Unit Testing (Foundation)

**Testing Stack:**
Tools:
├─ Vitest (Test Runner)
├─ React Testing Library (Component Tests)
├─ @testing-library/user-event (User Interactions)
└─ @testing-library/jest-dom (Assertions)

Coverage Target: > 80%
Test Files: Neben Component (Button.tsx → Button.test.tsx)

text

**Component Test Template:**
// Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button Component', () => {
it('renders children correctly', () => {
render(<Button>Click me</Button>)
expect(screen.getByText('Click me')).toBeInTheDocument()
})

it('calls onClick when clicked', async () => {
const onClick = vi.fn()
render(<Button onClick={onClick}>Click</Button>)

text
await userEvent.click(screen.getByText('Click'))
expect(onClick).toHaveBeenCalledTimes(1)
})

it('is disabled when disabled prop is true', () => {
render(<Button disabled>Disabled</Button>)
expect(screen.getByRole('button')).toBeDisabled()
})

it('shows loading spinner when loading', () => {
render(<Button loading>Loading</Button>)
expect(screen.getByRole('status')).toBeInTheDocument() // Spinner
expect(screen.getByRole('button')).toBeDisabled()
})

it('renders with correct variant class', () => {
const { container } = render(<Button variant="primary">Primary</Button>)
expect(container.querySelector('.btn-primary')).toBeInTheDocument()
})
})

text

**Test Coverage Requirements:**
ALLE Components MÜSSEN getestet sein:

Foundation Components:
□ Button: Alle Variants, States, Sizes
□ Input: Types, Validation, States
□ Select: Options, Multi-select, Search
□ Checkbox/Radio: States, Groups
□ Toggle: On/Off States

Layout Components:
□ Container: Responsive Behavior
□ Grid: Column Calculations
□ Stack: Spacing, Direction

Content Components:
□ Card: Sections, Hover States
□ Badge: Variants, Sizes
□ Testimonial: Content Rendering

Forms:
□ FormField: Validation Display
□ DatePicker: Date Selection
□ FileUpload: File Handling

Feedback:
□ Modal: Open/Close, Focus Trap
□ Toast: Auto-dismiss, Queue
□ Alert: Variants, Dismissible

Navigation:
□ Header: Mobile/Desktop Toggle
□ DropdownMenu: Keyboard Nav
□ Tabs: Active State, Click Handling

text

### Integration Testing

**Integration Test Examples:**
// Demo Request Flow Integration Test
describe('Demo Request Flow', () => {
it('successfully submits demo request', async () => {
render(<DemoRequestPage />)

text
// Fill Form
await userEvent.type(screen.getByLabelText('Unternehmensname'), 'Test GmbH')
await userEvent.type(screen.getByLabelText('E-Mail'), 'test@example.com')
await userEvent.selectOptions(screen.getByLabelText('Flottengröße'), '6-25')

// Submit
await userEvent.click(screen.getByRole('button', { name: 'Demo anfragen' }))

// Assert Success Message
await waitFor(() => {
  expect(screen.getByText(/Vielen Dank/i)).toBeInTheDocument()
})

// Assert Email Sent (Mock)
expect(mockEmailService.sendDemoRequest).toHaveBeenCalledWith({
  company: 'Test GmbH',
  email: 'test@example.com',
  fleetSize: '6-25'
})
})

it('shows validation errors for invalid input', async () => {
render(<DemoRequestPage />)

text
// Submit without filling
await userEvent.click(screen.getByRole('button', { name: 'Demo anfragen' }))

// Assert Errors
expect(screen.getByText(/Unternehmensname ist erforderlich/i)).toBeInTheDocument()
expect(screen.getByText(/E-Mail ist erforderlich/i)).toBeInTheDocument()
})
})

// Navigation Flow Test
describe('Navigation', () => {
it('navigates through main pages', async () => {
render(<App />)

text
// Home -> Pricing
await userEvent.click(screen.getByRole('link', { name: 'Preise' }))
expect(screen.getByRole('heading', { name: /Flexible Preise/i })).toBeInTheDocument()

// Pricing -> Features
await userEvent.click(screen.getByRole('link', { name: 'Features' }))
expect(screen.getByRole('heading', { name: /Features/i })).toBeInTheDocument()
})
})

text

### E2E Testing (Critical Paths)

**E2E Stack:**
Tool: Playwright
Browsers: Chromium, Firefox, WebKit

Critical User Flows zu testen:
□ Demo Request Submission
□ Pricing Page Interaction & Plan Comparison
□ Contact Form Submission
□ Newsletter Signup
□ Cookie Consent Flow
□ Navigation durch alle Hauptseiten
□ Mobile Navigation (Hamburger Menu)
□ Form Validation (Client + Server)

text

**E2E Test Example:**
// tests/e2e/demo-request.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Demo Request Flow', () => {
test('should submit demo request successfully', async ({ page }) => {
// Navigate to Demo Page
await page.goto('/demo')

text
// Fill Form
await page.fill('[name="companyName"]', 'E2E Test GmbH')
await page.fill('[name="email"]', 'e2e@test.com')
await page.fill('[name="phone"]', '+49 123 456789')
await page.selectOption('[name="fleetSize"]', '6-25')
await page.selectOption('[name="industry"]', 'taxi')

// Submit
await page.click('button[type="submit"]')

// Wait for Success Message
await expect(page.locator('text=Vielen Dank')).toBeVisible()

// Verify Confirmation Email Sent (check test inbox)
// ... Email verification logic
})

test('should show validation errors', async ({ page }) => {
await page.goto('/demo')

text
// Click Submit without filling
await page.click('button[type="submit"]')

// Check Validation Errors
await expect(page.locator('text=Unternehmensname ist erforderlich')).toBeVisible()
await expect(page.locator('text=E-Mail ist erforderlich')).toBeVisible()
})

test('should work on mobile', async ({ page }) => {
await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE
await page.goto('/demo')

text
// Mobile-specific tests
// ...
})
})

// Pricing Comparison E2E
test.describe('Pricing Page', () => {
test('should compare pricing plans', async ({ page }) => {
await page.goto('/pricing')

text
// Check all plans visible
await expect(page.locator('text=Starter')).toBeVisible()
await expect(page.locator('text=Business')).toBeVisible()
await expect(page.locator('text=Enterprise')).toBeVisible()

// Click on Business Plan
await page.click('text=Business >> .. >> button:has-text("Demo anfragen")')

// Should navigate to Demo page with pre-selected plan
await expect(page).toHaveURL(/demo\?plan=business/)
})
})

text

**E2E Test Coverage:**
KRITISCHE FLOWS (PFLICHT):

Demo Request
├─ Form Filling
├─ Validation
├─ Submission
├─ Success Confirmation
└─ Email Receipt

Pricing Interaction
├─ Plan Comparison
├─ Feature Toggle
├─ CTA Clicks
└─ Navigation zu Demo

Contact Form
├─ Form Validation
├─ Spam Protection (Honeypot Check)
├─ Submission
└─ Confirmation

Navigation
├─ Desktop Menu
├─ Mobile Hamburger Menu
├─ Dropdown Menus
├─ Footer Links
└─ Breadcrumbs

Cookie Consent
├─ Banner Display
├─ Accept All
├─ Reject All
├─ Customize Settings
└─ Preference Persistence

Error Pages
├─ 404 Page
├─ 500 Page
└─ Navigation Back

text

### Visual Regression Testing

**Visual Testing Stack:**
Tool: Percy.io / Chromatic
Alternatives: BackstopJS (self-hosted)

Snapshot Coverage:
□ Alle Komponenten (Storybook Stories)
□ Alle Pages (multiple Viewports)
□ Alle Component States (hover, active, disabled, etc.)
□ Responsive Breakpoints (mobile, tablet, desktop)

text

**Visual Test Setup:**
// .storybook/test-runner.ts
import { toMatchImageSnapshot } from 'jest-image-snapshot'

expect.extend({ toMatchImageSnapshot })

// Visual Regression für jeden Story
export const test = {
async postRender(page, context) {
const image = await page.screenshot()
expect(image).toMatchImageSnapshot({
customSnapshotIdentifier: context.id,
failureThreshold: 0.01, // 1% Unterschied erlaubt
failureThresholdType: 'percent'
})
}
}

text

**Viewports für Visual Tests:**
const VIEWPORTS = [
{ name: 'mobile', width: 375, height: 667 }, // iPhone SE
{ name: 'tablet', width: 768, height: 1024 }, // iPad
{ name: 'desktop', width: 1280, height: 720 }, // Desktop
{ name: 'wide', width: 1920, height: 1080 } // Full HD
]

// Test alle Components auf allen Viewports
VIEWPORTS.forEach(viewport => {
test(Button renders correctly on ${viewport.name}, async () => {
// ...
})
})

text

### Accessibility Testing

**a11y Testing Stack:**
Tools:
├─ @axe-core/react (Automated Tests)
├─ eslint-plugin-jsx-a11y (Linting)
├─ Manual Keyboard Testing
└─ Screen Reader Testing (NVDA/JAWS/VoiceOver)

WCAG 2.1 Level AA Compliance: PFLICHT

text

**Automated a11y Tests:**
// a11y.test.tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Accessibility', () => {
it('Button has no a11y violations', async () => {
const { container } = render(<Button>Click me</Button>)
const results = await axe(container)
expect(results).toHaveNoViolations()
})

it('Form has proper labels', async () => {
const { container } = render(
<FormField label="E-Mail" name="email" type="email" />
)
const results = await axe(container)
expect(results).toHaveNoViolations()
})

it('Modal has focus trap', async () => {
const { container } = render(
<Modal isOpen title="Test Modal">
<p>Content</p>
</Modal>
)
const results = await axe(container)
expect(results).toHaveNoViolations()
})
})

text

**Manual a11y Testing Checklist:**
KEYBOARD NAVIGATION:
□ Tab durch alle interaktive Elemente
□ Enter/Space triggert Buttons
□ Escape schließt Modals/Dropdowns
□ Arrow Keys in Dropdown Menus
□ Focus Trap in Modals
□ Skip Links funktionieren

SCREEN READER:
□ Alle Images haben alt-Text
□ Alle Inputs haben Labels
□ ARIA Labels wo nötig
□ Heading Hierarchy korrekt (H1 → H2 → H3)
□ Landmarks (nav, main, footer) definiert
□ Status Messages announced

VISUELL:
□ Color Contrast > 4.5:1 (Text)
□ Color Contrast > 3:1 (UI Components)
□ Keine Information nur durch Farbe
□ Focus Indicators sichtbar
□ Text zoom bis 200% ohne Horizontal Scroll

FORMS:
□ Error Messages klar & verständlich
□ Error Messages mit aria-describedby
□ Required Fields markiert
□ Validation Feedback sofort

text

### Test Automation (CI/CD Integration)

**GitHub Actions Workflow:**
.github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
unit-tests:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v3
- uses: actions/setup-node@v3
- run: npm ci
- run: npm run test:coverage
- uses: codecov/codecov-action@v3

e2e-tests:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v3
- uses: actions/setup-node@v3
- run: npm ci
- run: npx playwright install
- run: npm run test:e2e

visual-regression:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v3
- uses: chromaticqa/action@v1
with:
token: ${{ secrets.GITHUB_TOKEN }}
projectToken: ${{ secrets.CHROMATIC_TOKEN }}

a11y-tests:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v3
- run: npm ci
- run: npm run test:a11y

text

---

## 🔒 SECURITY STRATEGIE

### Security Headers

**HTTP Security Headers (PFLICHT):**
Content Security Policy
Content-Security-Policy:
default-src 'self';
script-src 'self' 'unsafe-inline' https://plausible.io;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self' https://api.mydispatch.de;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';

X-Frame-Options
X-Frame-Options: DENY

X-Content-Type-Options
X-Content-Type-Options: nosniff

Referrer-Policy
Referrer-Policy: strict-origin-when-cross-origin

Permissions-Policy
Permissions-Policy:
camera=(),
microphone=(),
geolocation=(),
interest-cohort=()

Strict-Transport-Security (HSTS)
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

X-XSS-Protection (Legacy Support)
X-XSS-Protection: 1; mode=block

text

### Input Validation & Sanitization

**Client-side Validation (Zod):**
// schemas/demo-request.schema.ts
import { z } from 'zod'

export const demoRequestSchema = z.object({
companyName: z
.string()
.min(2, 'Mindestens 2 Zeichen')
.max(100, 'Maximal 100 Zeichen')
.regex(/^[a-zA-ZäöüÄÖÜß\s-.]+$/, 'Nur Buchstaben, Leerzeichen und Bindestriche'),

email: z
.string()
.email('Ungültige E-Mail-Adresse')
.toLowerCase(),

phone: z
.string()
.regex(/^+?[0-9\s-/$$$$]+$/, 'Ungültige Telefonnummer')
.optional(),

fleetSize: z.enum(['1-5', '6-25', '26-100', '100+']),

industry: z.enum(['taxi', 'mietwagen', 'limousine', 'transport']),

message: z
.string()
.max(1000, 'Maximal 1000 Zeichen')
.optional()
})

// XSS Prevention - Sanitize HTML
import DOMPurify from 'dompurify'

export function sanitizeInput(input: string): string {
return DOMPurify.sanitize(input, {
ALLOWED_TAGS: [], // No HTML tags allowed
ALLOWED_ATTR: []
})
}

text

**Server-side Validation (Double Check):**
// API Route: /api/demo-request
export async function POST(request: Request) {
const body = await request.json()

// 1. Validate with Same Schema
const validation = demoRequestSchema.safeParse(body)
if (!validation.success) {
return Response.json({ error: 'Validation failed' }, { status: 400 })
}

// 2. Sanitize all inputs (XSS Prevention)
const sanitized = {
companyName: sanitizeInput(validation.data.companyName),
email: sanitizeInput(validation.data.email),
// ... etc
}

// 3. Rate Limiting Check
const ip = request.headers.get('x-forwarded-for') || 'unknown'
if (await isRateLimited(ip)) {
return Response.json({ error: 'Too many requests' }, { status: 429 })
}

// 4. Honeypot Check (Spam Prevention)
if (body.honeypot) {
// Silent fail - Spam Bot detected
return Response.json({ success: true }, { status: 200 })
}

// 5. Process Request
await sendDemoRequestEmail(sanitized)

return Response.json({ success: true })
}

text

### Rate Limiting

**Rate Limiting Strategy:**
// lib/rate-limit.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({ /* config */ })

export async function rateLimit(
identifier: string, // IP oder User ID
limit: number = 5, // Max Requests
window: number = 60 // Zeit-Fenster in Sekunden
): Promise<boolean> {
const key = rate-limit:${identifier}

const count = await redis.incr(key)
if (count === 1) {
await redis.expire(key, window)
}

return count > limit
}

// Usage in API Route
const isLimited = await rateLimit(
request.headers.get('x-forwarded-for'),
5, // 5 Requests
60 // pro Minute
)

if (isLimited) {
return Response.json(
{ error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' },
{ status: 429 }
)
}

text

**Rate Limits pro Endpoint:**
RATE LIMITS (PFLICHT):

Demo Request: 3 Requests / 10 Minuten pro IP
Contact Form: 5 Requests / Stunde pro IP
Newsletter Signup: 2 Requests / Tag pro Email
API Endpoints: 100 Requests / Minute (authenticated)

text

### HTTPS & SSL/TLS

**HTTPS Enforcement:**
// middleware.ts
export function middleware(request: Request) {
const url = new URL(request.url)

// Force HTTPS
if (url.protocol === 'http:' && process.env.NODE_ENV === 'production') {
url.protocol = 'https:'
return Response.redirect(url.toString(), 301)
}

return NextResponse.next()
}

text

**TLS Configuration:**
nginx.conf
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256...';
ssl_prefer_server_ciphers on;

text

### Dependency Security

**Automated Security Audits:**
// package.json scripts
{
"scripts": {
"audit": "npm audit --production",
"audit:fix": "npm audit fix",
"audit:check": "npm audit --audit-level=moderate"
}
}

text

**Dependabot Configuration:**
.github/dependabot.yml
version: 2
updates:

package-ecosystem: "npm"
directory: "/"
schedule:
interval: "weekly"
open-pull-requests-limit: 10
reviewers:

"security-team"
labels:

"dependencies"

"security"

text

**Vulnerability Monitoring:**
SECURITY MONITORING (PFLICHT):

□ npm audit wöchentlich durchführen
□ Dependabot Alerts aktiviert
□ Snyk / Socket Security Integration
□ Keine Dependencies mit Known Vulnerabilities
□ Regular Updates (monatlich)

CRITICAL: Bei CVE mit Severity HIGH/CRITICAL:
→ Sofortiges Update innerhalb 24h
→ Wenn kein Fix verfügbar: Alternative Dependency

text

### Secrets Management

**Environment Variables:**
.env (NIEMALS committen!)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
EMAIL_API_KEY=xxx
ANALYTICS_TOKEN=xxx

.env.example (kann committed werden)
SUPABASE_URL=
SUPABASE_ANON_KEY=
EMAIL_API_KEY=
ANALYTICS_TOKEN=

text

**Secret Detection:**
.github/workflows/secret-scan.yml
name: Secret Scanning

on: [push, pull_request]

jobs:
scan:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v3
- uses: trufflesecurity/trufflehog@v3
with:
path: ./
base: main
head: HEAD

text

---

## 📧 EMAIL SYSTEM STRATEGIE

### Email Infrastructure

**Email Service Provider:**
EMPFOHLENE PROVIDER:

Option 1: Resend (Modern, Dev-Friendly)
├─ React Email Templates Support
├─ EU Hosting verfügbar
├─ DSGVO-konform
├─ 100 Emails/Tag free, dann ab $20/Monat
└─ Einfache API

Option 2: SendGrid / Postmark
├─ Bewährte Enterprise-Lösung
├─ DSGVO-konform
├─ Gute Deliverability
└─ Ab $15/Monat

ANFORDERUNGEN:
✓ EU Hosting (DSGVO)
✓ DKIM, SPF, DMARC Support
✓ Template Support
✓ Bounce Handling
✓ Analytics

text

### Email Templates

**Template Stack:**
Tools:
├─ React Email (Template Framework)
├─ Tailwind Email (Styling)
└─ MJML (Fallback für alte Clients)

Responsive: JA (Mobile-first)
Plain-text Alternative: JA (immer!)

text

**Email Template Struktur:**
// emails/DemoRequestConfirmation.tsx
import { Html, Head, Preview, Body, Container, Section, Text, Button } from '@react-email/components'

export default function DemoRequestConfirmation({
companyName,
userName,
scheduledDate
}) {
return (
<Html>
<Head />
<Preview>Ihre Demo-Anfrage wurde bestätigt</Preview>
<Body style={main}>
<Container style={container}>
{/* Header mit Logo */}
<Section style={header}>
<img src="https://mydispatch.de/logo-email.png" alt="MyDispatch" width="120" />
</Section>

text
      {/* Content */}
      <Section style={content}>
        <Text style={heading}>Demo-Anfrage bestätigt</Text>
        
        <Text style={text}>
          Hallo {userName},
        </Text>
        
        <Text style={text}>
          vielen Dank für Ihr Interesse an MyDispatch! Wir haben Ihre Demo-Anfrage 
          für <strong>{companyName}</strong> erhalten.
        </Text>
        
        <Text style={text}>
          Unser Team wird sich innerhalb von 24 Stunden bei Ihnen melden, 
          um einen passenden Termin für Ihre persönliche Demo zu vereinbaren.
        </Text>
        
        {scheduledDate && (
          <Section style={box}>
            <Text style={boxText}>
              📅 Termin: {scheduledDate}
            </Text>
          </Section>
        )}
        
        <Text style={text}>
          In der Zwischenzeit können Sie gerne unsere Ressourcen durchstöbern:
        </Text>
        
        <Button style={button} href="https://mydispatch.de/features">
          Features entdecken
        </Button>
      </Section>
      
      {/* Footer */}
      <Section style={footer}>
        <Text style={footerText}>
          MyDispatch GmbH<br />
          Musterstraße 123<br />
          12345 Musterstadt
        </Text>
        
        <Text style={footerText}>
          <a href="https://mydispatch.de/legal/datenschutz" style={link}>Datenschutz</a>
          {' | '}
          <a href="https://mydispatch.de/legal/impressum" style={link}>Impressum</a>
        </Text>
      </Section>
    </Container>
  </Body>
</Html>
)
}

// Styles (inline für Email Compatibility)
const main = {
backgroundColor: '#f6f9fc',
fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif'
}

const container = {
backgroundColor: '#ffffff',
margin: '0 auto',
padding: '20px 0 48px',
marginBottom: '64px',
maxWidth: '600px'
}

const header = {
padding: '32px 24px',
textAlign: 'center' as const
}

const content = {
padding: '0 24px'
}

const heading = {
fontSize: '24px',
fontWeight: 'bold',
color: '#1F2937',
marginBottom: '24px'
}

const text = {
fontSize: '16px',
lineHeight: '26px',
color: '#4B5563'
}

const box = {
backgroundColor: '#EFF6FF',
borderRadius: '8px',
padding: '16px',
margin: '24px 0'
}

const boxText = {
fontSize: '16px',
fontWeight: '600',
color: '#1E40AF',
margin: 0
}

const button = {
backgroundColor: '#3B82F6',
borderRadius: '8px',
color: '#fff',
fontSize: '16px',
fontWeight: '600',
textDecoration: 'none',
textAlign: 'center' as const,
display: 'block',
padding: '12px 24px',
margin: '24px 0'
}

const footer = {
padding: '24px',
textAlign: 'center' as const,
borderTop: '1px solid #E5E7EB',
marginTop: '32px'
}

const footerText = {
fontSize: '12px',
color: '#6B7280',
lineHeight: '20px'
}

const link = {
color: '#3B82F6',
textDecoration: 'none'
}

text

### Required Email Templates

**PFLICHT-EMAILS:**

DEMO REQUEST CONFIRMATION (User)
├─ Bestätigung der Anfrage
├─ Nächste Schritte
├─ Erwartete Response-Zeit
└─ Kontakt-Möglichkeiten

DEMO REQUEST NOTIFICATION (Team)
├─ Neue Demo-Anfrage Details
├─ Firmendaten
├─ Kontaktdaten
├─ Flottengröße & Branche
└─ Link zum CRM/Admin

CONTACT FORM CONFIRMATION (User)
├─ Bestätigung Nachricht erhalten
├─ Erwartete Antwortzeit
└─ Referenz-Nummer

CONTACT FORM NOTIFICATION (Team)
├─ Neue Kontaktanfrage
├─ Nachricht
├─ Kontaktdaten
└─ Priority Flag (wenn vorhanden)

NEWSLETTER DOUBLE OPT-IN
├─ Bestätigungs-Link
├─ DSGVO-Hinweis
└─ Was sie erwartet (Häufigkeit, Inhalte)

NEWSLETTER WELCOME (nach Opt-in)
├─ Willkommensnachricht
├─ Was zu erwarten ist
├─ Wichtigste Features
└─ Unsubscribe Link

NEWSLETTER (Regular)
├─ Updates, News, Features
├─ Relevante Inhalte
├─ CTAs
└─ Unsubscribe Link

OPTIONAL (Future):
8. Password Reset (falls User Accounts)
9. Account Verification
10. Invoice/Receipt Emails (für Customers)

text

### Email Sending Logic

**Email Service Wrapper:**
// lib/email-service.ts
import { Resend } from 'resend'
import { render } from '@react-email/render'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
to: string | string[]
subject: string
template: React.ReactElement
from?: string
replyTo?: string
}

export async function sendEmail({
to,
subject,
template,
from = 'MyDispatch noreply@mydispatch.de',
replyTo = 'info@mydispatch.de'
}: SendEmailParams) {
// Render React Component zu HTML
const html = render(template)

// Render Plain Text Version
const text = render(template, { plainText: true })

try {
const result = await resend.emails.send({
from,
to,
subject,
html,
text,
replyTo
})

text
console.log('Email sent:', result.id)
return { success: true, id: result.id }
} catch (error) {
console.error('Email send failed:', error)

text
// Fallback: Log to Error Tracking
Sentry.captureException(error)

return { success: false, error: error.message }
}
}

// Usage Examples
export async function sendDemoRequestConfirmation(data: {
email: string
companyName: string
userName: string
}) {
return sendEmail({
to: data.email,
subject: 'Ihre Demo-Anfrage wurde bestätigt | MyDispatch',
template: <DemoRequestConfirmation {...data} />
})
}

export async function sendDemoRequestNotification(data: DemoRequest) {
return sendEmail({
to: 'sales@mydispatch.de',
subject: Neue Demo-Anfrage: ${data.companyName},
template: <DemoRequestNotification {...data} />
})
}

text

### Email DSGVO Compliance

**DSGVO-Anforderungen für Emails:**
PFLICHT:

Impressum in jeder Email
├─ Firmenname
├─ Adresse
└─ Kontaktdaten

Datenschutz-Link
└─ Link zur Datenschutzerklärung

Abmelde-Link (für Newsletter)
└─ One-Click Unsubscribe

Einwilligung dokumentieren
├─ Double Opt-in für Newsletter
├─ Timestamp der Einwilligung
└─ IP-Adresse (optional, anonymisiert)

Keine Tracking Pixel (ohne Consent)
❌ Kein Google Analytics in Emails
❌ Keine versteckten Tracking-Bilder
✅ OK: Open-Tracking via Email Provider (anonymisiert)

Datenverarbeitung transparent
└─ In Datenschutzerklärung: Welcher Email Provider (Resend/SendGrid)

text

**Unsubscribe Implementation:**
// api/newsletter/unsubscribe/route.ts
export async function POST(request: Request) {
const { email, token } = await request.json()

// Verify Token (prevent abuse)
const valid = verifyUnsubscribeToken(email, token)
if (!valid) {
return Response.json({ error: 'Invalid token' }, { status: 400 })
}

// Remove from Newsletter List
await db.newsletter.update({
where: { email },
data: {
subscribed: false,
unsubscribedAt: new Date()
}
})

return Response.json({ success: true })
}

// One-Click Unsubscribe Header (Email Standard)
headers: {
'List-Unsubscribe': 'https://mydispatch.de/api/newsletter/unsubscribe?token=xxx',
'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
}

text

---

## 📊 ANALYTICS & TRACKING

### Privacy-First Analytics

**Analytics Provider:**
EMPFEHLUNG: Plausible Analytics

Vorteile:
✓ DSGVO-konform ohne Cookie Consent
✓ EU-Hosting
✓ Kein Cookie Banner erforderlich
✓ Lightweight (< 1kb Script)
✓ Open Source
✓ Transparente Statistiken

Alternative: Fathom Analytics

NICHT nutzen ohne Consent:
❌ Google Analytics (GA4)
❌ Meta Pixel
❌ Google Tag Manager (mit Tracking)

text

**Plausible Setup:**
<!-- In <head> --> <script defer data-domain="mydispatch.de" src="https://plausible.io/js/script.js"></script> <!-- Custom Events --> <script> function trackEvent(eventName, props) { window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) } window.plausible(eventName, { props }) } // Usage trackEvent('Demo Request', { plan: 'Business' }) </script>
text

### Tracking Events

**Event Tracking Strategy:**
// lib/analytics.ts
export const trackEvent = (
event: string,
properties?: Record<string, string | number>
) => {
if (typeof window !== 'undefined' && window.plausible) {
window.plausible(event, { props: properties })
}
}

// Tracking Events
export const analytics = {
// CTA Clicks
demoRequest: (plan?: string) =>
trackEvent('Demo Request', { plan: plan || 'unknown' }),

pricingView: (plan: string) =>
trackEvent('Pricing View', { plan }),

ctaClick: (location: string, cta: string) =>
trackEvent('CTA Click', { location, cta }),

// Form Events
formSubmit: (formName: string, success: boolean) =>
trackEvent('Form Submit', { form: formName, success: success ? '1' : '0' }),

// Navigation
pageView: (page: string) =>
trackEvent('Page View', { page }),

// Content Engagement
scrollDepth: (depth: number) =>
trackEvent('Scroll Depth', { depth: depth.toString() }),

// Video (falls vorhanden)
videoPlay: (videoName: string) =>
trackEvent('Video Play', { video: videoName }),

// Downloads (PDF, etc.)
download: (fileName: string) =>
trackEvent('Download', { file: fileName })
}

// Usage in Components
<Button onClick={() => {
analytics.ctaClick('Hero', 'Demo anfragen')
router.push('/demo')
}}>
Demo anfragen
</Button>

text

**Conversion Tracking:**
WICHTIGE CONVERSIONS:

Demo Request Submitted
→ Event: 'Demo Request'
→ Props: { plan, industry, fleetSize }

Pricing Page Visited
→ Event: 'Pricing View'
→ Props: { plan viewed }

Contact Form Submitted
→ Event: 'Contact Form'
→ Props: { success: true/false }

Newsletter Signup
→ Event: 'Newsletter Signup'
→ Props: { source: 'footer'/'popup' }

Download (Case Study, PDF)
→ Event: 'Download'
→ Props: { file: 'case-study.pdf' }

Feature Page Deep Engagement
→ Event: 'Feature Interest'
→ Props: { feature: 'gps-tracking' }

text

### Privacy-Compliant Tracking

**Cookie-Free Tracking:**
// Plausible nutzt KEINE Cookies!
// Aber: Für UTM Parameter & Referrer brauchen wir Session Storage

// lib/tracking-storage.ts
export const trackingStorage = {
// UTM Parameters speichern (First Touch Attribution)
saveUTM() {
const params = new URLSearchParams(window.location.search)
const utm = {
source: params.get('utm_source'),
medium: params.get('utm_medium'),
campaign: params.get('utm_campaign'),
term: params.get('utm_term'),
content: params.get('utm_content')
}

text
if (Object.values(utm).some(v => v)) {
  sessionStorage.setItem('utm', JSON.stringify(utm))
}
},

// UTM Parameter bei Conversion Events hinzufügen
getUTM() {
const stored = sessionStorage.getItem('utm')
return stored ? JSON.parse(stored) : {}
}
}

// Usage bei Demo Request
const utm = trackingStorage.getUTM()
analytics.demoRequest({
...utm,
plan: selectedPlan
})

text

---

## 🖼️ BRAND ASSETS PLANUNG

### Logo Variants

**Logo Spezifikationen:**
LOGO VARIANTS (zu erstellen):

Full Logo (Horizontal)
├─ Light Version (für helle Backgrounds)
├─ Dark Version (für dunkle Backgrounds)
├─ Sizes: SVG (skalierbar)
└─ Usage: Header, Footer, Emails

Logo Icon Only
├─ Square Format (1:1)
├─ Light & Dark Version
├─ Sizes: 16x16, 32x32, 64x64, 128x128, 256x256
└─ Usage: Favicons, App Icons, Social Media

Logo + Tagline (optional)
└─ Für Marketing Materials

TECHNICAL SPECS:

Format: SVG (primary), PNG (fallback)

Colors: Brand Colors (--primary)

Spacing: Min. clear space = Logo height / 2

text

### Favicons & App Icons

**Icon Set (zu erstellen):**
<!-- Favicons --> <link rel="icon" type="image/svg+xml" href="/favicon.svg"> <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"> <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"> <!-- Apple Touch Icon --> <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"> <!-- Android --> <link rel="manifest" href="/site.webmanifest"> <!-- Safari Pinned Tab --> <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3B82F6"> <!-- Microsoft --> <meta name="msapplication-TileColor" content="#3B82F6"> <meta name="theme-color" content="#ffffff"> ```
Required Icon Sizes:

text
favicon.svg (modern browsers)
favicon.ico (legacy)
favicon-16x16.png
favicon-32x32.png
apple-touch-icon-180x180.png
android-chrome-192x192.png
android-chrome-512x512.png
safari-pinned-tab.svg
Social Media Preview Images
Open Graph Images:

text
OG IMAGES (zu erstellen):

1. Default OG Image (Home)
   ├─ Size: 1200x630px
   ├─ Content: MyDispatch Logo + Tagline
   ├─ Background: Brand Gradient
   └─ Usage: Home Page, wenn keine spezifische Image

2. Page-specific OG Images:
   ├─ Pricing Page: 1200x630px (Pricing Table Preview)
   ├─ Features: 1200x630px (Feature Highlights)
   └─ Blog Posts: 1200x630px (dynamic)

SPECS:
- Format: JPG (best compatibility)
- Max File Size: 200kb
- Safe Area: 1200x600px (manche Plattformen croppen)
- Text: Readable auch bei small sizes
Illustrations & Graphics
Illustration Style Guide:

text
ILLUSTRATION STYLE:

Art Style:
├─ Modern, flat design
├─ Isometric OR 2D (konsistent!)
├─ Brand Colors (primary, secondary, accent)
└─ Simple, clean lines

Required Illustrations:
□ Hero Section Illustration
  - Taxi/Car with GPS tracking visual
  - Dashboard UI elements
  - Isometric city scene
  
□ Feature Section Graphics (6x)
  - GPS Tracking: Map with pins
  - Dispatch: Car assignment visual
  - Reports: Charts & graphs
  - Mobile: Phone with app
  - Automation: Gears/workflow
  - Team: People collaborating
  
□ Empty States
  - No data yet
  - No results found
  - No notifications
  
□ Error Pages
  - 404 Not Found (friendly)
  - 500 Server Error
  - Offline

SOURCES:
- Custom (Designer beauftragen)
- unDraw (customizable, kostenlos)
- Storyset (animated, kostenlos)
- Illustrations.co (Premium)
Icon Library
Icon System:

text
ICON LIBRARY:

Primary: Lucide React
├─ 1000+ Icons
├─ Consistent style
├─ Optimiert für React
├─ Tree-shakeable
└─ MIT License

Installation:
npm install lucide-react

Usage:
import { ArrowRight, Check, X, Menu, User } from 'lucide-react'

<Icon size={24} color="#3B82F6" strokeWidth={2} />

Standard Sizes:
├─ xs: 16px
├─ sm: 20px
├─ md: 24px (default)
├─ lg: 32px
└─ xl: 48px

Custom Icons (falls benötigt):
- SVG Format
- Viewbox: 0 0 24 24
- Stroke-width: 2
- Same style as Lucide
🚨 ERROR PAGES
404 - Not Found
404 Page Design:

text
STRUCTURE:

Hero Section:
├─ Large "404" Typography
├─ Illustration (Lost/Confused Character)
└─ Primary Message: "Diese Seite existiert nicht"

Content:
├─ Subtext: "Die Seite die Sie suchen wurde nicht gefunden."
├─ Mögliche Gründe:
│   - URL falsch eingegeben
│   - Seite wurde verschoben
│   - Seite existiert nicht mehr
└─ Hilfreich sein!

Actions:
├─ Button: "Zur Startseite" (Primary CTA)
├─ Button: "Alle Features ansehen" (Secondary)
└─ Search Bar (optional)

Popular Pages:
├─ Grid mit 4 beliebten Seiten
├─ Preise
├─ Features
├─ Demo anfragen
└─ Kontakt

Footer: Normal Footer (volle Navigation)
404 Implementation:

text
// pages/404.tsx
export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <div className="mb-8">
        <h1 className="text-9xl font-extrabold text-primary">404</h1>
        <img 
          src="/illustrations/404-not-found.svg" 
          alt="Page not found" 
          className="mx-auto w-96 my-8"
        />
      </div>
      
      <h2 className="text-3xl font-bold mb-4">
        Diese Seite existiert nicht
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Die Seite die Sie suchen wurde nicht gefunden. 
        Möglicherweise wurde die URL falsch eingegeben oder die Seite wurde verschoben.
      </p>
      
      <div className="flex gap-4 justify-center mb-16">
        <Button variant="primary" href="/">
          Zur Startseite
        </Button>
        <Button variant="outline" href="/features">
          Alle Features
        </Button>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-6">Beliebte Seiten</h3>
        <Grid cols={4} gap="lg">
          <Card href="/pricing">
            <h4>Preise</h4>
            <p>Unsere Pricing-Pläne</p>
          </Card>
          {/* ... mehr */}
        </Grid>
      </div>
    </Container>
  )
}
500 - Server Error
500 Page Design:

text
STRUCTURE:

Hero:
├─ "500" Typography
├─ Illustration (Broken/Error Visual)
└─ Message: "Etwas ist schiefgelaufen"

Content:
├─ "Ein Fehler ist aufgetreten. Wir arbeiten bereits daran."
├─ Timestamp: "Fehler aufgetreten um: [Zeit]"
└─ Error ID: "Ref: ERR-123456" (für Support)

Actions:
├─ Button: "Seite neu laden"
├─ Button: "Zur Startseite"
└─ Link: "Status-Seite prüfen"

Contact:
└─ "Problem bleibt? Kontaktieren Sie uns: support@mydispatch.de"
Offline Page (PWA - Optional)
Offline Page:

text
MESSAGE:
"Keine Internetverbindung"

CONTENT:
├─ Illustration (Offline Cloud)
├─ "Sie sind offline. Bitte prüfen Sie Ihre Internetverbindung."
└─ Cached Content anzeigen (falls vorhanden)

CTA:
└─ Button: "Erneut versuchen"
📋 SCHEMA.ORG STRUCTURED DATA
Organization Schema
text
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MyDispatch",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Fleet Management Software",
  "operatingSystem": "Web Browser, iOS, Android",
  "description": "MyDispatch ist die führende Dispatch-Software für Taxi-, Mietwagen- und Limousinenunternehmen mit KI-gestützter Disposition und GPS-Echtzeit-Tracking.",
  "url": "https://mydispatch.de",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "EUR",
    "lowPrice": "49",
    "highPrice": "499",
    "offerCount": "4"
  },
  "provider": {
    "@type": "Organization",
    "name": "MyDispatch GmbH",
    "url": "https://mydispatch.de",
    "logo": "https://mydispatch.de/logo.png",
    "sameAs": [
      "https://www.linkedin.com/company/mydispatch"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+49-xxx-xxxxxx",
      "contactType": "Customer Service",
      "areaServed": "DE",
      "availableLanguage": "German"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  },
  "featureList": [
    "GPS-Echtzeit-Tracking",
    "KI-gestützte Disposition",
    "Automatische Rechnungsstellung",
    "Fahrer-Management",
    "Fahrzeugverwaltung",
    "Live-Traffic Integration"
  ]
}
FAQ Schema
text
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Wie wird MyDispatch abgerechnet?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MyDispatch wird monatlich abgerechnet. Sie können jederzeit kündigen ohne Vertragsbindung."
      }
    },
    {
      "@type": "Question",
      "name": "Ist MyDispatch DSGVO-konform?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja, MyDispatch ist vollständig DSGVO-konform. Alle Daten werden in EU-Rechenzentren gespeichert und entsprechen den höchsten Datenschutzstandards."
      }
    }
  ]
}
BreadcrumbList Schema
text
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://mydispatch.de"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Features",
      "item": "https://mydispatch.de/features"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "GPS-Tracking",
      "item": "https://mydispatch.de/features/gps-tracking"
    }
  ]
}
🚀 DEPLOYMENT & CI/CD
Deployment Strategy
Environments:

text
DEPLOYMENT ENVIRONMENTS:

1. Development (develop branch)
   ├─ Auto-deploy on push
   ├─ URL: https://dev.mydispatch.de
   ├─ Database: Development DB
   └─ Testing & Experiments

2. Staging (staging branch)
   ├─ Auto-deploy after PR merge
   ├─ URL: https://staging.mydispatch.de
   ├─ Database: Staging DB (copy of production)
   ├─ Final QA before production
   └─ Client previews

3. Production (main branch)
   ├─ Manual deployment mit Approval
   ├─ URL: https://mydispatch.de
   ├─ Database: Production DB
   ├─ Rollback plan ready
   └─ Monitoring active
CI/CD Pipeline
GitHub Actions Workflow:

text
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    needs: lint-and-type-check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/

  lighthouse:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://staging.mydispatch.de
            https://staging.mydispatch.de/pricing
          uploadArtifacts: true
          temporaryPublicStorage: true

  deploy-staging:
    if: github.ref == 'refs/heads/staging'
    needs: [build, lighthouse]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run deploy:staging

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: [build, lighthouse]
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run deploy:production
Deployment Checklist
Pre-Deployment Checklist (Production):

text
□ All tests passing (Unit, Integration, E2E)
□ Lighthouse Score > 90 (all metrics)
□ No TypeScript errors
□ No ESLint errors/warnings
□ Visual Regression Tests passed
□ Accessibility Tests passed (axe-core)
□ Security Audit passed (npm audit)
□ Legal pages reviewed & up-to-date
□ DSGVO compliance verified
□ Performance budget met
□ Database migrations tested
□ Environment variables set
□ Rollback plan documented
□ Monitoring & alerts active
□ Team notified
📈 MONITORING & ERROR TRACKING
Error Tracking
Sentry Integration:

text
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Performance Monitoring
  tracesSampleRate: 0.1, // 10% of transactions
  
  // Error Filtering
  beforeSend(event, hint) {
    // Ignore known errors
    if (event.exception?.values?.?.value?.includes('ResizeObserver')) {
      return null
    }
    return event
  },
  
  // Privacy
  beforeBreadcrumb(breadcrumb) {
    // Remove PII from breadcrumbs
    if (breadcrumb.category === 'console') {
      return null
    }
    return breadcrumb
  }
})
Uptime Monitoring
Uptime Monitoring Setup:

text
TOOL: UptimeRobot / Pingdom / Better Uptime

Endpoints zu überwachen:
□ https://mydispatch.de (every 5 min)
□ https://mydispatch.de/api/health (every 1 min)
□ https://api.mydispatch.de/v1/health (every 1 min)

Alerts:
├─ Email: tech@mydispatch.de
├─ SMS: CTO Nummer (für Production Down)
└─ Slack: #alerts Channel

Status Page:
└─ https://status.mydispatch.de (öffentlich)
Performance Monitoring
Real User Monitoring:

text
// Web Vitals Tracking (bereits definiert in Performance Sektion)
// + Server-side Performance

// api/health/route.ts
export async function GET() {
  const start = Date.now()
  
  // Health Checks
  const dbHealth = await checkDatabaseHealth()
  const cacheHealth = await checkCacheHealth()
  
  const duration = Date.now() - start
  
  return Response.json({
    status: 'healthy',
    checks: {
      database: dbHealth,
      cache: cacheHealth
    },
    responseTime: duration
  })
}
📦 DELIVERABLE - VOLLSTÄNDIG
Erstelle einen umfassenden Planungs-Report mit:

1. Component Library Planung
text
[Wie vorher definiert]
- Component Inventory
- Specifications
- Design Tokens
- Struktur
- Implementierungs-Reihenfolge
2. Website Struktur
text
[Wie vorher definiert]
- Site Map
- Navigation
- URL Struktur
- Internal Linking
3. Page-by-Page Planning
text
[Wie vorher definiert]
- Alle Seiten detailliert
- Component Usage
- Content Outline
- SEO
4. Performance Strategie ✨ NEU
text
4.1 Performance Budgets
4.2 Code Splitting Strategy
4.3 Bundle Optimization Plan
4.4 Image Optimization Strategy
4.5 Caching Strategy
4.6 Critical CSS Plan
4.7 Font Loading Strategy
4.8 Third-Party Script Strategy
4.9 Performance Monitoring Plan
5. Testing Strategie ✨ NEU
text
5.1 Unit Testing Plan
    ├─ Component Test Coverage
    ├─ Test Templates
    └─ Coverage Targets

5.2 Integration Testing Plan
    ├─ User Flow Tests
    ├─ Form Tests
    └─ Navigation Tests

5.3 E2E Testing Plan
    ├─ Critical Paths
    ├─ Playwright Setup
    └─ Test Scenarios

5.4 Visual Regression Testing
    ├─ Component Screenshots
    ├─ Page Screenshots
    └─ Responsive Tests

5.5 Accessibility Testing
    ├─ Automated (axe-core)
    ├─ Manual Checklist
    └─ WCAG 2.1 AA Compliance

5.6 CI/CD Integration
    └─ GitHub Actions Workflows
6. Security Strategie ✨ NEU
text
6.1 Security Headers Configuration
6.2 Input Validation Strategy
6.3 Rate Limiting Implementation
6.4 HTTPS & TLS Setup
6.5 Dependency Security
6.6 Secrets Management
6.7 Security Monitoring
7. Email System ✨ NEU
text
7.1 Email Provider Selection
7.2 Email Templates
    ├─ Demo Request Confirmation
    ├─ Contact Form Confirmation
    ├─ Newsletter Double Opt-in
    ├─ Newsletter Welcome
    └─ Team Notifications

7.3 Email Sending Logic
7.4 DSGVO Compliance (Emails)
7.5 Unsubscribe Implementation
8. Analytics & Tracking ✨ NEU
text
8.1 Analytics Provider (Plausible)
8.2 Event Tracking Strategy
8.3 Conversion Tracking
8.4 Privacy-Compliant Tracking
8.5 UTM Parameter Handling
9. Brand Assets ✨ NEU
text
9.1 Logo Variants Specification
9.2 Favicon & App Icon Sets
9.3 Social Media Preview Images
9.4 Illustration Style Guide
9.5 Icon Library (Lucide React)
10. Error Pages ✨ NEU
text
10.1 404 Page Design & Content
10.2 500 Page Design & Content
10.3 403 Page (optional)
10.4 Offline Page (PWA)
11. Structured Data ✨ NEU
text
11.1 Organization Schema
11.2 Software Application Schema
11.3 FAQ Schema
11.4 BreadcrumbList Schema
11.5 Review/Rating Schema
12. Deployment & CI/CD ✨ NEU
text
12.1 Environment Strategy
12.2 CI/CD Pipeline
12.3 Deployment Checklist
12.4 Rollback Strategy
13. Monitoring ✨ NEU
text
13.1 Error Tracking (Sentry)
13.2 Uptime Monitoring
13.3 Performance Monitoring
13.4 Alert Configuration
14. Legal & Compliance
text
[Wie vorher - vollständig]
- DSGVO
- EU AI Act
- PBefG
- Cookie Policy
- AGB & Impressum
15. SEO Strategie
text
[Wie vorher]
- Keywords
- Meta Tags
- Schema.org
- Internal Linking
16. Implementierungs-Roadmap
text
16.1 Component Library (Wochen 1-5)
16.2 Infrastructure Setup (Woche 6)
     ├─ Email System
     ├─ Analytics
     ├─ Monitoring
     └─ CI/CD

16.3 Page Implementation (Wochen 7-11)
16.4 Testing & QA (Woche 12)
16.5 Performance Optimization (Woche 13)
16.6 Security Hardening (Woche 14)
16.7 Launch Preparation (Woche 15)
16.8 Go-Live (Woche 16)
✅ FINALE QUALITÄTSSICHERUNG
Vollständige QA Checkliste:

Component Library:
□ Alle Components identifiziert
□ Specifications vollständig
□ Design Tokens gemapped
□ Kein Hardcoded Values
□ Accessibility definiert
□ Testing Strategy
□ Dependencies korrekt

Website Planning:
□ Keine verbotenen Inhalte
□ Features korrekt zugeordnet
□ Design System V28.1 eingehalten
□ SEO vollständig
□ Rechtlich compliant
□ Responsive geplant
□ Navigation logisch
□ CTA Strategie definiert

Performance:
□ Performance Budgets definiert
□ Code Splitting Strategie
□ Image Optimization Plan
□ Caching Strategy
□ Monitoring Setup

Testing:
□ Unit Test Coverage > 80%
□ E2E Critical Paths definiert
□ Visual Regression Setup
□ a11y Testing Plan
□ CI/CD Integration

Security:
□ Security Headers definiert
□ Input Validation Strategy
□ Rate Limiting Plan
□ Secrets Management
□ Dependency Security

Email:
□ Provider ausgewählt
□ Alle Templates geplant
□ DSGVO-konform
□ Unsubscribe Implementation

Analytics:
□ Privacy-First Provider
□ Event Tracking definiert
□ Conversion Tracking
□ Cookie-Free Setup

Monitoring:
□ Error Tracking Setup
□ Uptime Monitoring
□ Performance Monitoring
□ Alert Configuration

🔄 ENFORCEMENT + SELF-REVIEW LOOP
text
⚡ VOLLSTÄNDIGE PROTOKOLL-EINHALTUNG:

PHASE 1 - COMPONENT LIBRARY (2-3 Tage):
□ Component Inventory
□ Specifications
□ Design Tokens
□ Implementierungs-Plan

PHASE 2 - INFRASTRUCTURE (1 Tag):
□ Performance Strategie
□ Testing Strategie
□ Security Strategie
□ Email System
□ Analytics Setup
□ Monitoring Setup

PHASE 3 - WEBSITE PLANUNG (2-3 Tage):
□ Alle Seiten
□ Component Usage
□ Content
□ SEO

PHASE 4 - INTEGRATION (1 Tag):
□ Alles verknüpfen
□ Roadmap erstellen
□ QA Checkliste

SELF-REVIEW NACH JEDER PHASE:
□ Vollständigkeit?
□ Keine Lücken?
□ Keine verbotenen Inhalte?
□ Design System Compliance?
□ Alle Dependencies klar?

⛔ NUR BEI 100% → NÄCHSTE PHASE

FINALE DELIVERABLE:
□ Vollständiger Report
□ Alle 16 Sections
□ Keine fehlenden Infos
□ Bereit für Implementation
DIESER PROMPT IST JETZT VOLLSTÄNDIG, LÜCKENLOS UND PRODUKTIONSREIF! 🚀

ER DECKT AB:
✅ Component Library (V28.1 Design System)
✅ Performance Optimierung
✅ Testing (Unit, E2E, Visual, a11y)
✅ Security (Headers, Validation, Rate Limiting)
✅ Email System (Templates, DSGVO)
✅ Analytics (Privacy-First)
✅ Monitoring (Errors, Uptime, Performance)
✅ Brand Assets
✅ Error Pages
✅ Structured Data
✅ Deployment & CI/CD
✅ Alle Website-Seiten
✅ Rechtliche Compliance
✅ SEO
✅ Implementierungs-Roadmap