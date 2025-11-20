# 🚀 ZENTRALE IMPLEMENTIERUNGS-STRATEGIE
## UNIVERSELLER PROMPT FÜR FEHLERFREIE, WARTBARE UMSETZUNG

---

## 🎯 ZIEL DIESER IMPLEMENTATION

Setze die geplanten Features/Components/Pages um mit:
- ✅ **Zentralisierung:** Keine Code-Duplication, DRY-Prinzip absolut
- ✅ **Wartbarkeit:** Änderungen an EINER Stelle, Effekt überall
- ✅ **Fehlerfreiheit:** Multi-Layer Validation, Type-Safety
- ✅ **Skalierbarkeit:** Leicht erweiterbar ohne Refactoring
- ✅ **Performance:** Optimiert von Anfang an
- ✅ **Best Practices:** Industry Standards, Clean Code

---

## 📐 ZENTRALE ARCHITEKTUR-PRINZIPIEN

### 1. Single Source of Truth (SSoT)

**REGEL: Jede Information hat GENAU EINE Quelle!**

// ❌ FALSCH - Duplikation
// Button.tsx
const primaryColor = '#3B82F6'

// Card.tsx
const primaryColor = '#3B82F6' // Duplikat!

// ✅ RICHTIG - Zentrale Quelle
// design-tokens.ts
export const colors = {
primary: '#3B82F6'
} as const

// Button.tsx
import { colors } from '@/design-tokens'
const primaryColor = colors.primary

// Card.tsx
import { colors } from '@/design-tokens'
const cardBorder = colors.primary

text

**Zentrale Quellen für:**
Design Tokens → /config/design-tokens.ts
API Endpoints → /config/api-routes.ts
Environment Config → /config/env.ts
Feature Flags → /config/features.ts
Constants → /config/constants.ts
Types → /types/.types.ts
Validation Schemas → /schemas/.schema.ts
Utility Functions → /lib/utils/*.ts

text

---

### 2. Composition over Inheritance

**REGEL: Kleine, wiederverwendbare Teile komponieren!**

// ❌ FALSCH - Monolithische Component
function PricingCard() {
return (
<div className="card">
<div className="card-header">
<h3>Starter</h3>
<Badge>Beliebt</Badge>
</div>
<div className="card-body">
<p className="price">49€</p>
<ul className="features">
<li><Check /> Feature 1</li>
<li><Check /> Feature 2</li>
</ul>
</div>
<div className="card-footer">
<Button>Jetzt starten</Button>
</div>
</div>
)
}

// ✅ RICHTIG - Komposition aus kleinen Teilen
function PricingCard({ plan, features, price, badge }) {
return (
<Card>
<Card.Header>
<Heading level={3}>{plan}</Heading>
{badge && <Badge>{badge}</Badge>}
</Card.Header>

text
  <Card.Body>
    <Price amount={price} currency="EUR" period="month" />
    <FeatureList features={features} />
  </Card.Body>
  
  <Card.Footer>
    <Button variant="primary">Jetzt starten</Button>
  </Card.Footer>
</Card>
)
}

// Jetzt sind Card, Badge, Price, FeatureList einzeln wiederverwendbar!

text

---

### 3. Configuration over Code

**REGEL: Daten in Config, nicht in Code!**

// ❌ FALSCH - Hardcoded
function PricingPage() {
return (
<>
<PricingCard plan="Starter" price={49} features={['Feature 1', 'Feature 2']} />
<PricingCard plan="Business" price={99} features={['Feature 1', 'Feature 2', 'Feature 3']} />
<PricingCard plan="Enterprise" price={199} features={['All Features']} />
</>
)
}

// ✅ RICHTIG - Configuration
// config/pricing-plans.ts
export const PRICING_PLANS = [
{
id: 'starter',
name: 'Starter',
price: 49,
features: [
{ id: 'drivers', name: 'Bis 5 Fahrer/Fahrzeuge', included: true },
{ id: 'orders', name: 'Auftragsverwaltung', included: true },
{ id: 'gps', name: 'GPS-Tracking', included: false }
]
},
// ... more plans
] as const

// pages/Pricing.tsx
import { PRICING_PLANS } from '@/config/pricing-plans'

function PricingPage() {
return (
<>
{PRICING_PLANS.map(plan => (
<PricingCard key={plan.id} {...plan} />
))}
</>
)
}

// Änderungen nur in pricing-plans.ts → Effekt überall!

text

---

### 4. Type-Safety Everywhere

**REGEL: Explizite Types für ALLES!**

// ❌ FALSCH - Keine Types
function Button({ variant, size, children, onClick }) {
// ...
}

// ✅ RICHTIG - Explizite Types
// types/components.types.ts
export interface ButtonProps {
variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
disabled?: boolean
loading?: boolean
fullWidth?: boolean
icon?: React.ReactNode
iconPosition?: 'left' | 'right'
onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
type?: 'button' | 'submit' | 'reset'
children: React.ReactNode
}

// components/Button.tsx
import { ButtonProps } from '@/types/components.types'

export function Button({
variant = 'primary',
size = 'md',
disabled = false,
loading = false,
fullWidth = false,
icon,
iconPosition = 'left',
onClick,
type = 'button',
children
}: ButtonProps): JSX.Element {
// ...
}

// Jetzt: Auto-complete, Type-checking, keine Runtime-Fehler!

text

---

### 5. Error Boundaries & Defensive Programming

**REGEL: Immer für Fehler-Szenarien planen!**

// ❌ FALSCH - Kein Error Handling
function UserProfile({ userId }) {
const user = fetchUser(userId)
return <div>{user.name}</div> // Crash wenn user undefined!
}

// ✅ RICHTIG - Defensive Programming
function UserProfile({ userId }: { userId: string }) {
const { data: user, error, isLoading } = useUser(userId)

// Loading State
if (isLoading) {
return <Skeleton variant="profile" />
}

// Error State
if (error) {
return (
<ErrorState
title="Fehler beim Laden"
message={error.message}
retry={() => refetch()}
/>
)
}

// Empty State
if (!user) {
return <EmptyState message="Benutzer nicht gefunden" />
}

// Success State
return (
<div>
<h2>{user.name ?? 'Unbekannt'}</h2>
<p>{user.email ?? 'Keine E-Mail'}</p>
</div>
)
}

// Alle Szenarien abgedeckt: Loading, Error, Empty, Success!

text

---

## 🗂️ ZENTRALE PROJEKT-STRUKTUR

**Standardisierte Ordnerstruktur:**

/src
├─ /app # Next.js App Router (oder /pages)
│ ├─ /(routes) # Grouped Routes
│ ├─ /api # API Routes
│ └─ layout.tsx # Root Layout
│
├─ /components # React Components
│ ├─ /ui # UI Components (Design System)
│ │ ├─ /foundation # Button, Input, etc.
│ │ ├─ /layout # Container, Grid, etc.
│ │ ├─ /navigation # Header, Footer, etc.
│ │ ├─ /content # Card, Hero, etc.
│ │ ├─ /feedback # Modal, Toast, etc.
│ │ ├─ /forms # FormField, DatePicker, etc.
│ │ ├─ /data # Table, List, etc.
│ │ └─ /complex # CookieBanner, etc.
│ │
│ ├─ /features # Feature-specific Components
│ │ ├─ /pricing # PricingCard, ComparisonTable
│ │ ├─ /demo # DemoForm, etc.
│ │ └─ /auth # LoginForm, etc.
│ │
│ └─ /providers # Context Providers
│
├─ /lib # Utility Functions & Helpers
│ ├─ /utils # Generic Utils
│ │ ├─ cn.ts # className utility
│ │ ├─ format.ts # Formatters (date, currency, etc.)
│ │ ├─ validators.ts # Validation helpers
│ │ └─ string.ts # String utilities
│ │
│ ├─ /api # API Client & Helpers
│ │ ├─ client.ts # API Client (fetch wrapper)
│ │ └─ endpoints.ts # API Endpoints (centralized)
│ │
│ ├─ /hooks # Custom React Hooks
│ │ ├─ useMediaQuery.ts
│ │ ├─ useDebounce.ts
│ │ └─ useLocalStorage.ts
│ │
│ └─ /email # Email Logic
│ ├─ client.ts # Email sending logic
│ └─ templates/ # Email templates
│
├─ /config # Configuration Files
│ ├─ design-tokens.ts # Design System Tokens (SSoT!)
│ ├─ api-routes.ts # API Routes (SSoT!)
│ ├─ env.ts # Environment Config
│ ├─ features.ts # Feature Flags
│ ├─ constants.ts # App Constants
│ ├─ pricing-plans.ts # Pricing Configuration
│ ├─ navigation.ts # Navigation Structure
│ └─ seo.ts # SEO Defaults
│
├─ /types # TypeScript Types
│ ├─ components.types.ts # Component Props Types
│ ├─ api.types.ts # API Response Types
│ ├─ database.types.ts # Database Types (Supabase)
│ └─ global.types.ts # Global Types
│
├─ /schemas # Validation Schemas (Zod)
│ ├─ demo-request.schema.ts
│ ├─ contact.schema.ts
│ └─ newsletter.schema.ts
│
├─ /styles # Global Styles
│ ├─ globals.css # Global CSS
│ └─ components.css # Component-specific CSS (if needed)
│
├─ /public # Static Assets
│ ├─ /images
│ ├─ /icons
│ └─ /fonts
│
└─ /tests # Tests
├─ /unit # Unit Tests
├─ /integration # Integration Tests
└─ /e2e # E2E Tests

text

---

## 🔧 ZENTRALE CONFIGURATION FILES

### 1. Design Tokens (SSoT für Styling)

// config/design-tokens.ts
export const designTokens = {
colors: {
primary: {
DEFAULT: '#3B82F6',
dark: '#2563EB',
light: '#60A5FA',
50: '#EFF6FF',
100: '#DBEAFE',
// ... all shades
},
secondary: {
DEFAULT: '#10B981',
// ...
},
// ... all colors
},

spacing: {
0: '0',
1: '0.25rem', // 4px
2: '0.5rem', // 8px
3: '0.75rem', // 12px
4: '1rem', // 16px
// ... all spacings
},

typography: {
fontFamily: {
primary: "'Inter', sans-serif",
mono: "'JetBrains Mono', monospace"
},
fontSize: {
xs: '0.75rem',
sm: '0.875rem',
base: '1rem',
// ... all sizes
},
fontWeight: {
normal: 400,
medium: 500,
semibold: 600,
bold: 700,
extrabold: 800
}
},

borderRadius: {
none: '0',
sm: '0.25rem',
md: '0.5rem',
lg: '0.75rem',
xl: '1rem',
full: '9999px'
},

shadows: {
sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
},

transitions: {
fast: '150ms ease-in-out',
normal: '250ms ease-in-out',
slow: '350ms ease-in-out'
},

breakpoints: {
sm: '640px',
md: '768px',
lg: '1024px',
xl: '1280px',
'2xl': '1536px'
},

zIndex: {
base: 0,
dropdown: 10,
sticky: 20,
fixed: 30,
modal: 40,
popover: 50,
tooltip: 60,
notification: 70
}
} as const

// Type Safety
export type DesignTokens = typeof designTokens
export type ColorToken = keyof typeof designTokens.colors
export type SpacingToken = keyof typeof designTokens.spacing

text

### 2. App Constants

// config/constants.ts
export const APP_CONFIG = {
name: 'MyDispatch',
url: 'https://mydispatch.de',
description: 'Intelligente Flottensteuerung für Taxi & Mietwagen',

contact: {
email: 'info@mydispatch.de',
phone: '+49 xxx xxxxx',
support: 'support@mydispatch.de'
},

legal: {
companyName: 'MyDispatch GmbH',
address: 'Musterstraße 123, 12345 Musterstadt',
taxId: 'DE123456789'
},

features: {
newsletter: true,
blog: false,
cookieBanner: true,
analytics: true
},

limits: {
maxFileSize: 5 * 1024 * 1024, // 5MB
maxFilesPerUpload: 5,
rateLimit: {
demo: { requests: 3, window: 600 }, // 3 requests per 10 min
contact: { requests: 5, window: 3600 }, // 5 per hour
newsletter: { requests: 2, window: 86400 } // 2 per day
}
}
} as const

text

### 3. API Routes (Zentral)

// config/api-routes.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.mydispatch.de'

export const API_ROUTES = {
demo: {
submit: ${BASE_URL}/v1/demo-request,
list: ${BASE_URL}/v1/admin/demo-requests
},

contact: {
submit: ${BASE_URL}/v1/contact,
},

newsletter: {
subscribe: ${BASE_URL}/v1/newsletter/subscribe,
unsubscribe: ${BASE_URL}/v1/newsletter/unsubscribe,
verify: ${BASE_URL}/v1/newsletter/verify
},

health: ${BASE_URL}/v1/health
} as const

// Usage
import { API_ROUTES } from '@/config/api-routes'
await fetch(API_ROUTES.demo.submit, { ... })

text

### 4. Navigation Structure

// config/navigation.ts
export type NavItem = {
label: string
href: string
children?: NavItem[]
badge?: string
external?: boolean
}

export const NAVIGATION: NavItem[] = [
{
label: 'Produkt',
href: '#',
children: [
{ label: 'Features Übersicht', href: '/features' },
{ label: 'Fahrer & Fahrzeuge', href: '/features/fahrer-fahrzeuge' },
{ label: 'GPS-Tracking', href: '/features/gps-tracking' },
{ label: 'Automatisierung', href: '/features/automatisierung' }
]
},
{
label: 'Preise',
href: '/pricing'
},
{
label: 'Branchen',
href: '#',
children: [
{ label: 'Taxi', href: '/branchen/taxi' },
{ label: 'Mietwagen', href: '/branchen/mietwagen' },
{ label: 'Limousinen', href: '/branchen/limousinen' }
]
},
{
label: 'Ressourcen',
href: '#',
children: [
{ label: 'Blog', href: '/blog' },
{ label: 'Hilfe-Center', href: '/hilfe' },
{ label: 'API Docs', href: '/api-docs' },
{ label: 'Changelog', href: '/changelog', badge: 'Neu' }
]
}
]

export const FOOTER_NAVIGATION = {
produkt: [
{ label: 'Features', href: '/features' },
{ label: 'Preise', href: '/pricing' },
{ label: 'Demo anfragen', href: '/demo' }
],
branchen: [
{ label: 'Taxi', href: '/branchen/taxi' },
{ label: 'Mietwagen', href: '/branchen/mietwagen' },
{ label: 'Limousinen', href: '/branchen/limousinen' }
],
unternehmen: [
{ label: 'Über uns', href: '/about' },
{ label: 'Kontakt', href: '/kontakt' }
],
rechtliches: [
{ label: 'Impressum', href: '/legal/impressum' },
{ label: 'Datenschutz', href: '/legal/datenschutz' },
{ label: 'AGB', href: '/legal/agb' },
{ label: 'Cookie-Einstellungen', href: '/legal/cookie-policy' }
]
}

text

### 5. Pricing Plans Configuration

// config/pricing-plans.ts
export type PricingPlan = {
id: string
name: string
description: string
price: number | 'custom'
period: 'month' | 'year'
badge?: string
features: {
id: string
name: string
included: boolean
limit?: string | number
}[]
cta: {
label: string
href: string
}
highlighted?: boolean
}

export const PRICING_PLANS: PricingPlan[] = [
{
id: 'starter',
name: 'Starter',
description: 'Für Einzelunternehmer',
price: 49,
period: 'month',
features: [
{ id: 'drivers', name: 'Fahrer/Fahrzeuge', included: true, limit: '1-5' },
{ id: 'orders', name: 'Auftragsverwaltung', included: true },
{ id: 'invoicing', name: 'Rechnungsstellung', included: true },
{ id: 'gps', name: 'GPS-Tracking', included: false },
{ id: 'api', name: 'API-Zugang', included: false }
],
cta: {
label: 'Jetzt starten',
href: '/demo?plan=starter'
}
},
{
id: 'business',
name: 'Business',
description: 'Wachsende Flotten',
price: 99,
period: 'month',
badge: 'Beliebt',
highlighted: true,
features: [
{ id: 'drivers', name: 'Fahrer/Fahrzeuge', included: true, limit: '6-25' },
{ id: 'orders', name: 'Auftragsverwaltung', included: true },
{ id: 'invoicing', name: 'Rechnungsstellung', included: true },
{ id: 'gps', name: 'GPS-Tracking', included: true },
{ id: 'api', name: 'API-Zugang', included: true, limit: 'Read-Only' }
],
cta: {
label: 'Jetzt starten',
href: '/demo?plan=business'
}
},
// ... more plans
] as const

text

---

## 🧩 ZENTRALE UTILITY FUNCTIONS

### 1. className Utility (cn)

// lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**

Merge Tailwind classes with proper conflict resolution
*/
export function cn(...inputs: ClassValue[]) {
return twMerge(clsx(inputs))
}

// Usage
<button className={cn(
'px-4 py-2 rounded',
variant === 'primary' && 'bg-primary text-white',
disabled && 'opacity-50 cursor-not-allowed'
)} />

text

### 2. Format Utilities

// lib/utils/format.ts
/**

Format currency (EUR)
*/
export function formatCurrency(
amount: number,
options?: Intl.NumberFormatOptions
): string {
return new Intl.NumberFormat('de-DE', {
style: 'currency',
currency: 'EUR',
...options
}).format(amount)
}

/**

Format date
*/
export function formatDate(
date: Date | string,
format: 'short' | 'long' | 'relative' = 'short'
): string {
const d = typeof date === 'string' ? new Date(date) : date

if (format === 'relative') {
return formatDistanceToNow(d, { addSuffix: true, locale: de })
}

return new Intl.DateTimeFormat('de-DE', {
dateStyle: format === 'long' ? 'long' : 'short'
}).format(d)
}

/**

Format phone number
*/
export function formatPhone(phone: string): string {
const cleaned = phone.replace(/\D/g, '')

if (cleaned.startsWith('49')) {
// German format: +49 xxx xxxxxxx
return +49 ${cleaned.slice(2, 5)} ${cleaned.slice(5)}
}

return phone
}

/**

Truncate text
*/
export function truncate(text: string, maxLength: number): string {
if (text.length <= maxLength) return text
return text.slice(0, maxLength) + '...'
}

text

### 3. Validation Helpers

// lib/utils/validators.ts
/**

Validate German phone number
*/
export function isValidPhone(phone: string): boolean {
const pattern = /^(+49|0)[1-9][0-9]{1,14}$/
return pattern.test(phone.replace(/\s/g, ''))
}

/**

Validate VAT ID (German)
*/
export function isValidVatId(vatId: string): boolean {
const pattern = /^DE[0-9]{9}$/
return pattern.test(vatId)
}

/**

Check if email is from disposable domain
/
export function isDisposableEmail(email: string): boolean {
const disposableDomains = ['tempmail.com', 'guerrillamail.com', / ... */]
const domain = email.split('@')?.toLowerCase()​
return disposableDomains.includes(domain)
}

text

---

## 🎣 ZENTRALE CUSTOM HOOKS

### 1. useMediaQuery

// lib/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
const [matches, setMatches] = useState(false)

useEffect(() => {
const media = window.matchMedia(query)

text
if (media.matches !== matches) {
  setMatches(media.matches)
}

const listener = () => setMatches(media.matches)
media.addEventListener('change', listener)

return () => media.removeEventListener('change', listener)
}, [matches, query])

return matches
}

// Usage
const isMobile = useMediaQuery('(max-width: 640px)')
const isDesktop = useMediaQuery('(min-width: 1024px)')

text

### 2. useDebounce

// lib/hooks/useDebounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
const [debouncedValue, setDebouncedValue] = useState<T>(value)

useEffect(() => {
const handler = setTimeout(() => {
setDebouncedValue(value)
}, delay)

text
return () => clearTimeout(handler)
}, [value, delay])

return debouncedValue
}

// Usage in Search
const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDebounce(searchTerm, 300)

useEffect(() => {
if (debouncedSearch) {
performSearch(debouncedSearch)
}
}, [debouncedSearch])

text

### 3. useLocalStorage

// lib/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
key: string,
initialValue: T
): [T, (value: T) => void] {
// SSR-safe: Nur im Client
const [storedValue, setStoredValue] = useState<T>(() => {
if (typeof window === 'undefined') {
return initialValue
}

text
try {
  const item = window.localStorage.getItem(key)
  return item ? JSON.parse(item) : initialValue
} catch (error) {
  console.error(`Error reading localStorage key "${key}":`, error)
  return initialValue
}
})

const setValue = (value: T) => {
try {
setStoredValue(value)
if (typeof window !== 'undefined') {
window.localStorage.setItem(key, JSON.stringify(value))
}
} catch (error) {
console.error(Error setting localStorage key "${key}":, error)
}
}

return [storedValue, setValue]
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'light')

text

---

## 📝 ZENTRALE VALIDATION SCHEMAS

// schemas/demo-request.schema.ts
import { z } from 'zod'

export const demoRequestSchema = z.object({
companyName: z
.string()
.min(2, 'Mindestens 2 Zeichen')
.max(100, 'Maximal 100 Zeichen')
.regex(/^[a-zA-ZäöüÄÖÜß\s-.&]+$/, 'Ungültige Zeichen'),

email: z
.string()
.email('Ungültige E-Mail-Adresse')
.toLowerCase()
.refine(
(email) => !isDisposableEmail(email),
'Temporäre E-Mail-Adressen sind nicht erlaubt'
),

phone: z
.string()
.regex(/^+?[0-9\s-/$$$$]+$/, 'Ungültige Telefonnummer')
.optional(),

fleetSize: z.enum(['1-5', '6-25', '26-100', '100+']),

industry: z.enum(['taxi', 'mietwagen', 'limousine', 'transport']),

message: z
.string()
.max(1000, 'Maximal 1000 Zeichen')
.optional(),

// Honeypot (Spam Protection)
website: z.string().max(0).optional(),

// Terms acceptance
acceptTerms: z.literal(true, {
errorMap: () => ({ message: 'Bitte akzeptieren Sie die Datenschutzerklärung' })
})
})

export type DemoRequest = z.infer<typeof demoRequestSchema>

text

---

## 🚦 IMPLEMENTATION WORKFLOW

**Schritt-für-Schritt für JEDES Feature:**

PHASE 1: PREPARATION
□ 1. Lies alle Konfigurations-Dateien
- design-tokens.ts
- constants.ts
- Relevante Config-Dateien

□ 2. Prüfe existierende Components
- COMPONENT_REGISTRY.md checken
- Kann ich bestehende Components nutzen?

□ 3. Prüfe existierende Utilities
- lib/utils/* durchsehen
- Gibt es bereits Helper-Functions?

PHASE 2: TYPES & SCHEMAS
□ 4. Erstelle Types (wenn neu)
- In types/*.types.ts
- Exportiere für Wiederverwendung

□ 5. Erstelle Validation Schema (wenn Form)
- In schemas/*.schema.ts
- Nutze Zod
- Server + Client gleiche Schema

PHASE 3: IMPLEMENTATION
□ 6. Implementiere Component/Page
- Nutze Design Tokens (KEINE Hardcoded Values!)
- Nutze bestehende Components
- Nutze zentrale Utils
- Type-Safe (explizite Types überall)

□ 7. Error Handling
- Loading States
- Error States
- Empty States
- Success States

PHASE 4: TESTING
□ 8. Unit Tests schreiben
- Component Tests
- Utility Tests
- Min. 80% Coverage

□ 9. Integration Tests (falls relevant)

□ 10. Manual Testing
- Alle Breakpoints
- Alle States
- Keyboard Navigation
- Screen Reader

PHASE 5: DOCUMENTATION
□ 11. Code Comments (wo komplex)
□ 12. Update COMPONENT_REGISTRY.md
□ 13. Update filesExplorer.md
□ 14. Update CHANGELOG.md

PHASE 6: REVIEW
□ 15. Self-Review gegen Checklist
□ 16. Keine Hardcoded Values?
□ 17. Alle Imports zentral?
□ 18. Type-Safety überall?
□ 19. Error Handling komplett?
□ 20. Performance optimiert?

✅ NUR BEI ALLEN ✓ → FERTIG

text

---

## ✅ QUALITY GATES (vor Completion)

**Checkliste für JEDE Implementation:**

CODE QUALITY:
□ TypeScript: 0 Errors
□ ESLint: 0 Errors, 0 Warnings
□ Prettier: Code formatted
□ Keine any Types
□ Keine @ts-ignore Comments
□ Keine console.log (außer Error Logging)

DESIGN SYSTEM:
□ Alle Farben aus designTokens.colors
□ Alle Spacings aus designTokens.spacing
□ Alle Font-Sizes aus designTokens.typography
□ Keine hardcoded values
□ Responsive für alle Breakpoints

BEST PRACTICES:
□ DRY: Keine Code-Duplication
□ SSoT: Zentrale Konfiguration genutzt
□ Type-Safe: Explizite Types
□ Error Handling: Alle States abgedeckt
□ Accessibility: WCAG 2.1 AA
□ Performance: Lazy Loading, Optimization

TESTING:
□ Unit Tests: > 80% Coverage
□ Integration Tests: Kritische Flows
□ Manual Tests: Alle Devices
□ Accessibility Tests: axe-core passing

DOCUMENTATION:
□ Code Comments (wo nötig)
□ COMPONENT_REGISTRY.md updated
□ filesExplorer.md updated
□ CHANGELOG.md updated

SECURITY:
□ Input Validation (Client + Server)
□ XSS Prevention
□ No Secrets in Code
□ Rate Limiting (falls API)

text

---

## 🔄 SELF-ENFORCEMENT LOOP

**Nach jeder Implementation:**

🔄 POST-IMPLEMENTATION REVIEW:

Code Quality Check:
"Habe ich irgendwo hardcoded values?"
→ Suche im Code nach Hex-Colors, px-Werten, etc.
→ Falls gefunden: In designTokens verschieben

Duplication Check:
"Gibt es ähnlichen Code woanders?"
→ Suche nach Patterns
→ Falls gefunden: Extrahieren in Utility/Component

Type Safety Check:
"Habe ich überall explizite Types?"
→ Suche nach fehlenden Type Definitions
→ Ergänzen

Error Handling Check:
"Habe ich alle Error-Szenarien abgedeckt?"
→ Loading, Error, Empty, Success?
→ Falls fehlt: Ergänzen

Accessibility Check:
"Kann ich das mit Keyboard bedienen?"
"Kann Screen Reader das vorlesen?"
→ Test durchführen
→ Falls Probleme: Fixen

Performance Check:
"Habe ich unnötige Re-Renders?"
"Sind Images optimiert?"
→ React DevTools Profiler nutzen
→ Optimieren

Documentation Check:
"Habe ich alle Docs aktualisiert?"
→ Checkliste durchgehen
→ Fehlende Updates nachholen

✅ NUR WENN ALLES ✓ → Als fertig markieren

text

---

## 📦 DELIVERABLE STANDARDS

**Was produziere ich?**

CLEAN CODE
├─ Type-Safe (TypeScript strict)
├─ Linted (ESLint passing)
├─ Formatted (Prettier)
├─ Documented (Comments wo nötig)
└─ Tested (> 80% Coverage)

MAINTAINABLE CODE
├─ DRY (no duplication)
├─ SSoT (zentrale Configs)
├─ Modular (kleine, wiederverwendbare Teile)
├─ Consistent (gleiche Patterns überall)
└─ Documented (für andere Devs verständlich)

PERFORMANT CODE
├─ Lazy Loading (wo möglich)
├─ Optimized Images
├─ No unnecessary re-renders
├─ Efficient algorithms
└─ Performance Budget eingehalten

ACCESSIBLE CODE
├─ WCAG 2.1 AA compliant
├─ Keyboard navigable
├─ Screen reader friendly
├─ Focus indicators visible
└─ Alt texts für Images

SECURE CODE
├─ Input Validation (Client + Server)
├─ XSS Prevention
├─ No Secrets in Code
├─ Rate Limiting
└─ Error Handling (keine sensiblen Infos)

text

---

## 🎯 ZUSAMMENFASSUNG: ZENTRALE PRINZIPIEN

SINGLE SOURCE OF TRUTH
→ Jede Info hat EINE Quelle (Config-Files)

COMPOSITION OVER INHERITANCE
→ Kleine Teile komponieren, nicht monolithisch

CONFIGURATION OVER CODE
→ Daten in Config, nicht hardcoded

TYPE-SAFETY EVERYWHERE
→ Explizite Types für alles

ERROR BOUNDARIES
→ Alle States abdecken (Loading, Error, Empty, Success)

DRY (Don't Repeat Yourself)
→ Keine Code-Duplication

KISS (Keep It Simple, Stupid)
→ Einfachste Lösung wählen

YAGNI (You Aren't Gonna Need It)
→ Nur implementieren was JETZT gebraucht wird

SEPARATION OF CONCERNS
→ Jede Datei/Function hat EINE Verantwortung

FAIL FAST
→ Fehler früh erkennen & klar kommunizieren