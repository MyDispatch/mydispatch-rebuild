# 📋 VOLLSTÄNDIGE ANALYSE: ALLE VORGABEN, REGELN & VERBOTE

**Erstellt:** 2025-01-31  
**Quellen:** Alle Dokumentationsdateien (Root + docs/ + archive/)  
**Status:** ✅ Vollständig strukturiert und dedupliziert

---

## 📚 INHALTSVERZEICHNIS

1. [Design-System & CI-Farben](#1-design-system--ci-farben)
2. [Layout & Komponenten](#2-layout--komponenten)
3. [Code-Standards & Qualität](#3-code-standards--qualität)
4. [Hero-System & Backgrounds](#4-hero-system--backgrounds)
5. [Deutsche Formatierung](#5-deutsche-formatierung)
6. [Sicherheit & DSGVO](#6-sicherheit--dsgvo)
7. [Tarif-System & Feature-Gating](#7-tarif-system--feature-gating)
8. [Datenquellen & Single Source of Truth](#8-datenquellen--single-source-of-truth)
9. [Mobile & Responsive](#9-mobile--responsive)
10. [Performance & Optimierung](#10-performance--optimierung)
11. [Layout-Freeze & Geschützte Bereiche](#11-layout-freeze--geschützte-bereiche)
12. [Verbotene Praktiken](#12-verbotene-praktiken)
13. [Workflow & Prozesse](#13-workflow--prozesse)
14. [Dokumentation & Maintenance](#14-dokumentation--maintenance)

---

## 1. DESIGN-SYSTEM & CI-FARBEN

### 1.1 CI-Farben (UNVERÄNDERLICH)

**Status:** 🔴 ABSOLUT FIX - NIEMALS ÄNDERN

```css
/* PRIMARY COLORS */
--primary: 40 31% 88%;         /* #EADEBD - Beige/Gold */
--foreground: 225 31% 28%;     /* #323D5E - Dunkelgrau/Blau */
--accent: 31 26% 38%;          /* #856d4b - Braun/Gold */

/* SEMANTIC COLORS */
--muted: 40 8% 95%;
--destructive: 0 84% 60%;
--border: 40 12% 88%;  /* NUR Card-Borders! */

/* AMPEL-SYSTEM (KRITISCH - NIEMALS ÄNDERN!) */
--status-success: 142 76% 36%;  /* Ampel-Grün */
--status-warning: 48 96% 53%;   /* Ampel-Gelb */
--status-error: 0 84% 60%;      /* Ampel-Rot */
--status-pending: 48 96% 53% / 0.7;
--status-neutral: 40 8% 95%;
--status-info: 31 26% 38%;
```

**Regeln:**
- ✅ IMMER HSL-Format verwenden: `hsl(var(--primary))`
- ✅ IMMER aus `index.css` oder `ci-colors.ts` importieren
- ❌ NIEMALS direkte HEX-Farben (#EADEBD, #323D5E)
- ❌ NIEMALS `text-white`, `bg-white`, `text-red-500` in Production-Code
- ❌ NIEMALS CI-Farben ändern

### 1.2 Design-System Versionen

**Aktuell gültig:**
- ✅ **V28.1** - EINZIGE WAHRHEIT (für Auth & App)
- ✅ **V32.0** - Slate-Only (für Marketing-Seiten)
- ✅ **V31.5** - Hero Background Standard

**Deprecated (NIEMALS verwenden):**
- ❌ **V26** - TOT / DEPRECATED
- ❌ **V26.1** - TOT / DEPRECATED
- ❌ Alle Referenzen zu `/v26/`, `/v26.1/`, `/design-system-v26*`, `/theme-v26*`

**Verbotene Imports:**
```typescript
// ❌ FALSCH
import { colors } from '@/styles/v26/colors'
import { spacing } from '@/design-system/v26.1'
import { theme } from '@/config/theme-v26'

// ✅ RICHTIG
import { designTokens } from '@/config/design-tokens'
import { getCIColorVar } from '@/lib/ci-colors'
```

### 1.3 Kontrast-Regeln

**Bei dunklen Backgrounds:**
- ✅ IMMER helle Schrift verwenden (`text-primary-foreground`, `text-white`)
- ✅ `bg-accent` → IMMER `text-primary-foreground` oder `text-accent-foreground`
- ✅ `bg-destructive` → IMMER `text-destructive-foreground`
- ✅ `bg-foreground` → IMMER `text-primary` (heller Text)
- ❌ NIEMALS `#323D5E` (Dunkelblau) für Haupttext auf dunklem Hintergrund

**WCAG-Kontrast:**
- ✅ Alle Kontraste müssen ≥ 4.5:1 (WCAG AA)
- ✅ Ideal: ≥ 7:1 (WCAG AAA)

---

## 2. LAYOUT & KOMPONENTEN

### 2.1 Spacing-System (Tailwind)

**Standard-Abstände:**
```tsx
gap-4      // 1rem (16px) - STANDARD für Desktop
gap-6      // 1.5rem (24px) - Große Abstände
gap-3      // 0.75rem (12px) - Mobile
p-6        // Innen-Abstand für Cards (Desktop)
p-4        // Innen-Abstand für Cards (Mobile)
py-8       // Vertikale Sektion-Abstände
px-4       // Horizontale Container-Padding
```

**Konsistenz-Regeln:**
- ✅ Einheitliche Gaps innerhalb eines Containers
- ✅ `space-y-6` für vertikale Stacks (bevorzugt)
- ✅ `gap` für Grid/Flex-Container
- ❌ Keine unterschiedlichen Gaps in verschachtelten Containern

### 2.2 Card-System

**Standard Card-Struktur:**
```tsx
<Card>
  <CardHeader className="pb-3"> {/* Reduzierter Bottom-Padding */}
    <CardTitle>Titel</CardTitle>
    <CardDescription>Beschreibung</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4"> {/* Interne Abstände */}
    {/* Content */}
  </CardContent>
</Card>
```

**Regeln:**
- ✅ `pb-3` in CardHeader (reduzierter Bottom-Padding)
- ✅ `space-y-4` in CardContent für interne Abstände
- ✅ `p-0` für Full-Width Content (Charts, Maps)

### 2.3 Responsive Grid-System

**Breakpoints:**
```css
sm:  640px  // Small devices (Tablets)
md:  768px  // Medium devices (MOBILE BREAKPOINT)
lg:  1024px // Large devices (Desktops)
xl:  1280px // Extra large devices
2xl: 1536px // Ultra wide screens
```

**Standard-Patterns:**
```tsx
// Dashboard Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

// Widget Grid
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

// Two Column (60/40)
<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
  <div className="lg:col-span-3">{/* 60% */}</div>
  <div className="lg:col-span-2">{/* 40% */}</div>
</div>
```

**Mobile-First:**
- ✅ IMMER Mobile-First schreiben (`grid-cols-1` zuerst)
- ✅ `sm:`, `md:`, `lg:` für größere Breakpoints
- ❌ NIEMALS Desktop-First (`lg:grid-cols-4` ohne `grid-cols-1`)

### 2.4 Borders

**Regel:**
- ✅ NUR Card-Borders verwenden (`--border`)
- ❌ KEINE Borders für Header/Footer/Sidebar (borderless!)

---

## 3. CODE-STANDARDS & QUALITÄT

### 3.1 Defensive Coding Standards

**Hooks:**
- ✅ PFLICHT: Try-Catch-Blocks für externe API-Calls
- ✅ PFLICHT: Fallback-Values zurückgeben (`data || []`, `isLoading ?? true`)
- ✅ PFLICHT: Error-Handling mit `handleError()` aus `error-handler.ts`

**Components:**
- ✅ PFLICHT: Loading-, Error- und Empty-States
- ✅ PFLICHT: Props-Validierung mit TypeScript
- ✅ PFLICHT: Event-Handler mit Try-Catch
- ✅ Maximal 300 Zeilen pro Komponente

**API-Calls:**
- ✅ PFLICHT: Retry-Logic mit Exponential Backoff
- ✅ PFLICHT: Timeout-Handling (default: 10s)
- ✅ PFLICHT: Cache-Strategy (React Query: `staleTime`, `cacheTime`)

**Forms:**
- ✅ PFLICHT: Client-Side-Validation (Zod)
- ✅ PFLICHT: Server-Side-Validation (Edge Functions)
- ✅ PFLICHT: Input-Sanitization

### 3.2 Error-Handling

**Zentrale Error-Handler:**
```typescript
// ✅ IMMER verwenden
import { handleError, handleSuccess } from '@/lib/error-handler';

try {
  await someOperation();
  handleSuccess('Operation erfolgreich');
} catch (error) {
  handleError(error, 'Operation fehlgeschlagen', {
    showToast: true,
    logToSupabase: true
  });
}
```

**Regeln:**
- ✅ IMMER zentrale `handleError()` verwenden
- ✅ Components in Error-Boundaries wrappen
- ❌ NIEMALS `console.error/console.log` in Production-Code
- ❌ NIEMALS ungehandelte Exceptions

### 3.3 Code-Qualität

**Verboten:**
- ❌ `console.log`, `console.error`, `console.warn` (nur `logger.ts`)
- ❌ Direkte Farben (nur Semantic Tokens)
- ❌ Hardcoded Werte (nur zentrale Datenquellen)
- ❌ `any` ohne Grund
- ❌ Unnötige Re-Renders

**Erlaubt:**
- ✅ TypeScript strict mode
- ✅ ESLint & Prettier
- ✅ Code-Splitting (React.lazy)
- ✅ Memoization wo sinnvoll

---

## 4. HERO-SYSTEM & BACKGROUNDS

### 4.1 Hero Background Standard V31.5

**KRITISCHE REGEL:**
```tsx
// ✅ MANDATORY für alle Pre-Login-Seiten
<HeroIpadShowcase
  backgroundVariant="3d-premium"  // VERPFLICHTEND!
  // ... weitere Props
/>
```

**Background-Variant:**
- ✅ **EINZIG ERLAUBT:** `backgroundVariant="3d-premium"`
- ❌ VERBOTEN: `"3d-clean"`, `"flat"`, `"light"`, oder andere Varianten
- ❌ KEINE Ausnahmen!

**Betroffene Seiten (40+):**
- `/` (Home.tsx)
- `/pricing` (Pricing.tsx)
- `/docs` (Docs.tsx)
- `/faq` (FAQ.tsx)
- `/contact` (Contact.tsx)
- `/features` (Features.tsx)
- Alle Feature-Detailseiten
- Alle Rechtsseiten

### 4.2 Hero Dark Overlay (für Video-Backgrounds)

**Overlay-Konfiguration:**
```css
.hero-dark-overlay {
  background: linear-gradient(
    180deg, 
    rgba(0, 0, 0, 0.40) 0%,   /* Oben: 40% Schwarz */
    rgba(0, 0, 0, 0.50) 50%,  /* Mitte: 50% Schwarz */
    rgba(0, 0, 0, 0.45) 100%  /* Unten: 45% Schwarz */
  );
}
```

**Typografie auf dunklen Hintergründen:**
- ✅ Primary Headline: `hsl(var(--primary))` (#EADEBD) mit Glow
- ✅ Secondary Headline: `white` mit Text-Shadow
- ✅ Subtext: `white` mit 90% Opacity
- ❌ NIEMALS `#323D5E` (Dunkelblau) für Haupttext auf dunklem Hintergrund

**Button-Varianten:**
- ✅ Primary CTA: `bg-primary` + `text-foreground`
- ✅ Secondary CTA: `white` border + `white` text + transparent background

### 4.3 V28Hero3DBackgroundPremium - 6 Layer System

**Layer-Struktur (IMMER 6 Layer):**
1. Base Gradient
2. Straßennetz-Pattern
3. Floating Orbs (3 Stück)
4. Taxi-Elemente (6 Stück)
5. Premium Glow Effects (5 Stück)
6. Vignette Overlays (2 Stück)

**Performance-Features:**
- ✅ Mouse-Parallax mit RAF (60fps)
- ✅ `prefers-reduced-motion` Check
- ✅ Throttled Mouse Events
- ✅ Hardware-accelerated `translate3d()`

---

## 5. DEUTSCHE FORMATIERUNG

### 5.1 Rechtschreibreform (2006)

**ss vs. ß:**
- ✅ `dass` (Konjunktion), `Straße` (nach langem Vokal), `Fuß`
- ✅ `muss`, `Fluss` (nach kurzem Vokal)
- ❌ `daß`, `Strasse`, `muß`

**Getrennt- und Zusammenschreibung:**
- ✅ `infrage stellen` (getrennt)
- ✅ `zurzeit` (Adverb, zusammen)
- ✅ `zur Zeit` (Präposition + Artikel, getrennt)
- ✅ `kennenlernen` (zusammen)

**Groß- und Kleinschreibung:**
- ✅ `im Allgemeinen`, `des Weiteren`, `seit Langem`
- ✅ `heute Morgen` (Tageszeit nach Adverb)
- ✅ `Rad fahren` (Substantiv + Verb getrennt)

### 5.2 Zahlen & Währungen (DIN 5008)

**Datumsformat:**
```typescript
// ✅ KORREKT: 15.01.2025 (DD.MM.YYYY)
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
```

**Uhrzeitformat:**
```typescript
// ✅ KORREKT: 14:30 (24h-Format)
const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
```

**Währungsformat:**
```typescript
// ✅ KORREKT: 1.234,56 € (Punkt als Tausendertrenner, Komma als Dezimaltrenn.)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'  // NIEMALS USD!
  }).format(amount);
};
```

**Zahlenformat:**
- ✅ `1.234.567,89` (Punkt als Tausendertrenner, Komma als Dezimaltrenn.)
- ✅ `42 %` (Leerzeichen vor %)
- ✅ `5 km` (Leerzeichen vor Einheit)

### 5.3 Typografie

**Line-Height:**
```css
body, p { line-height: 1.5; }      /* DIN 1450 */
h1, h2, h3 { line-height: 1.2; }   /* Kompakter für Headlines */
td { line-height: 1.4; }            /* Kompakter für Tabellen */
```

**Geschützte Leerzeichen:**
```tsx
<span>42&nbsp;€</span>         // Zahl + Währung
<span>42&nbsp;%</span>          // Zahl + Prozent
<span>§&nbsp;21 PBefG</span>    // Paragraph + Nummer
<span>z.&nbsp;B.</span>         // Abkürzungen
<span>Dr.&nbsp;Müller</span>    // Titel + Name
```

**Silbentrennung:**
```css
* {
  hyphens: auto;
  -webkit-hyphens: auto;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
```

### 5.4 Anrede & Titel

**Anrede-Optionen:**
```typescript
const ANREDE_OPTIONS = [
  { value: 'Herr', label: 'Herr' },
  { value: 'Frau', label: 'Frau' },
  { value: 'Divers', label: 'Divers' },
];
```

**Titel-Optionen:**
```typescript
const TITEL_OPTIONS = [
  { value: '', label: 'Kein Titel' },
  { value: 'Dr.', label: 'Dr.' },
  { value: 'Prof.', label: 'Prof.' },
  { value: 'Prof. Dr.', label: 'Prof. Dr.' },
];
```

---

## 6. SICHERHEIT & DSGVO

### 6.1 Multi-Tenant & Datenisolierung

**Datenisolierung:**
```typescript
// ✅ IMMER company_id Filter verwenden
const { data } = await supabase
  .from('bookings')
  .select('*')
  .eq('company_id', profile.company_id)  // ZWINGEND!
  .eq('archived', false);
```

**Regeln:**
- ✅ ALLE Entities MÜSSEN `company_id` haben
- ✅ IMMER `company_id` Filter in Queries
- ✅ RLS Policies für company_id isolation

### 6.2 Row Level Security (RLS)

**Regeln:**
- ✅ ALLE Tabellen MÜSSEN RLS aktiviert haben
- ✅ 58+ RLS Policies (company_id isolation, NO recursion)
- ✅ SECURITY DEFINER Functions für RLS Infinite Recursion Fix

**Beispiel:**
```sql
CREATE POLICY "company_isolation_select" ON bookings
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id 
      FROM profiles 
      WHERE user_id = auth.uid()
    )
  );
```

### 6.3 Archiving-System

**Regel:**
- ✅ NIEMALS Hard-Delete verwenden
- ✅ IMMER Soft-Delete (Archiving)
- ✅ `archived: true` + `archived_at: timestamp`

```typescript
// ❌ FALSCH - Hard Delete
await supabase.from('customers').delete().eq('id', id);

// ✅ RICHTIG - Soft Delete
await supabase
  .from('customers')
  .update({ 
    archived: true, 
    archived_at: new Date().toISOString() 
  })
  .eq('id', id);
```

### 6.4 DSGVO-Konformität

**Rechtstexte:**
- ✅ Impressum.tsx (289 Zeilen)
- ✅ Datenschutz.tsx (792 Zeilen)
- ✅ AGB.tsx (277 Zeilen)

**GPS-Daten:**
- ✅ Auto-Delete nach 24h (DSGVO Art. 5)
- ✅ GPS-Einwilligung (Dialog mit localStorage-Persistenz)
- ✅ DSGVO-Hinweise: `<DSGVONotice context="registration|login|booking" />`

**Cookie-Banner:**
- ✅ `EnhancedCookieBanner.tsx` (Opt-In/Opt-Out)

### 6.5 Secrets Management

**Regel:**
- ❌ NIEMALS Secrets im Frontend
- ✅ API-Keys IMMER in Edge Functions (Backend)
- ✅ Umgebungsvariablen: `Deno.env.get('API_KEY')`

---

## 7. TARIF-SYSTEM & FEATURE-GATING

### 7.1 Tarif-Matrix

| Tarif | Monatlich | Jährlich | Ersparnis |
|-------|-----------|----------|-----------|
| **Starter** | 39 € | 420 € | 48 € |
| **Business** | 99 € | 1.068 € | 120 € |
| **Enterprise** | Individuell | Individuell | - |

### 7.2 Feature-Gating Implementation

**Zentrale Datenquellen:**
```typescript
// ✅ IMMER aus zentralen Quellen
import { PRICING_TIERS } from '@/data/pricing-tiers';
import { hasFeatureAccess } from '@/lib/tariff/tariff-definitions';
import { isBusinessTier } from '@/lib/subscription-utils';

// ❌ NIEMALS hardcoden
const price = 39; // FALSCH!
```

**Feature-Gate Pattern:**
```typescript
const hasPartnerAccess = hasFeatureAccess(
  company?.subscription_product_id, 
  'partners'
);

if (!hasPartnerAccess) {
  return <UpgradePrompt 
    featureName="Partner-Management"
    requiredTier="Business"
    variant="fullscreen"
  />;
}
```

### 7.3 Account-Typen

**Typen:**
```typescript
type AccountType = 'normal' | 'test' | 'master';

const SPECIAL_ACCOUNTS = {
  test: [
    'courbois1981@gmail.com',
    'demo@my-dispatch.de',
  ],
  master: [
    'master@my-dispatch.de',
  ],
};
```

**Regeln:**
- ✅ Test-Accounts: Tariff-Switching erlaubt
- ✅ Master-Accounts: Master-Dashboard-Zugang
- ✅ Normal-Accounts: Standard-Features basierend auf Tarif

---

## 8. DATENQUELLEN & SINGLE SOURCE OF TRUTH

### 8.1 Zentrale Datenquellen

**KRITISCHE REGEL:** Jede Datenart hat GENAU EINE Quelle!

| Datentyp | Datei | Beschreibung |
|----------|-------|--------------|
| **Pricing** | `src/data/pricing-tiers.ts` | Marketing-Preise |
| **Tarif-Logik** | `src/lib/tariff/tariff-definitions.ts` | App-Tarif-Logik |
| **Stripe-Integration** | `src/lib/subscription-utils.ts` | Stripe-Integration |
| **FAQ** | `src/data/faq-data.ts` | FAQ-Daten |
| **Testimonials** | `src/data/testimonials.ts` | Testimonials |
| **CI-Farben** | `src/lib/ci-colors.ts` | CI-Farben-System |
| **Doc-Zeitstempel** | `src/lib/doc-timestamps.ts` | Dokumentations-Zeitstempel |

**Verboten:**
- ❌ Hardcoded Werte
- ❌ Duplizierte Datenquellen
- ❌ Inline-Definitionen

**Erlaubt:**
- ✅ Import aus zentralen Quellen
- ✅ Single Source of Truth Prinzip

### 8.2 Synchronisation

**Pricing-Synchronisation:**
- ✅ `pricing-tiers.ts` (Marketing) ↔ `tariff-definitions.ts` (App-Logik)
- ✅ MÜSSEN IMMER synchron sein!
- ✅ Bei Änderungen: BEIDE Dateien aktualisieren

---

## 9. MOBILE & RESPONSIVE

### 9.1 Touch-Target-Größe

**Regel:**
- ✅ Mindestens 44x44px (iOS HIG)
- ✅ `min-h-[44px] min-w-[44px]` für Buttons
- ✅ `touch-manipulation` CSS-Property

### 9.2 Viewport & Overflow

**Regel:**
- ✅ `overflow-x-hidden` auf Container-Level
- ✅ `max-w-full` für Grid-Container
- ✅ `min-height: 100vh` für Full-Height Layouts

**Mobile-First:**
- ✅ IMMER Mobile-First schreiben
- ✅ Breakpoint: 768px (`md:`) für Mobile/Desktop-Trennung

### 9.3 Font-Sizes

**Regel:**
- ✅ Minimum 16px für Body (iOS zoomed nicht)
- ✅ Responsive Skalierung: `clamp(2rem, 5vw, 4rem)` für Headlines

---

## 10. PERFORMANCE & OPTIMIERUNG

### 10.1 React Query

**Regeln:**
- ✅ IMMER React Query für API-Calls verwenden
- ✅ Cache-Strategy: `staleTime: 5 * 60 * 1000` (5 Minuten)
- ✅ Retry-Logic: 3 Retries mit Exponential Backoff

### 10.2 Code-Splitting

**Regeln:**
- ✅ React.lazy für große Komponenten
- ✅ Route-based Code-Splitting
- ✅ Dynamic Imports für selten genutzte Features

### 10.3 Debouncing

**Regeln:**
- ✅ PFLICHT für Suchfelder (300ms default)
- ✅ `useDebouncedValue` Hook verwenden

### 10.4 Lazy-Loading

**Regeln:**
- ✅ Große Listen MÜSSEN virtualisiert oder paginiert sein
- ✅ Infinite Scroll mit `useInfiniteQuery`

---

## 11. LAYOUT-FREEZE & GESCHÜTZTE BEREICHE

### 11.1 Geschützte Seiten

**Öffentliche Seiten (Pre-Login) - V32.1 Design-Lock:**
- `/` (Home.tsx)
- `/pricing` (Pricing.tsx)
- `/features` (Features.tsx)
- `/contact` (Contact.tsx)
- `/faq` (FAQ.tsx)
- `/auth` (Auth.tsx)
- `/login` (Login.tsx)
- `/register` (Register.tsx)
- Alle Rechtsseiten

**Auth-Komponenten - V28.1 Design-Lock:**
- AuthPageLayout
- AuthHeader
- AuthFooter
- V28AuthCard
- V28AuthInput

**Dashboard-Seiten (Post-Login) - V18.5 Design-Lock:**
- Dashboard (Index.tsx)
- Aufträge (Auftraege.tsx)

### 11.2 Schutz-Regeln

**VERBOTEN - NIEMALS ÄNDERN:**
- ❌ Hero-Sektion (Position, Größe, Variante, Background)
- ❌ Header-Bereich Layout
- ❌ Section-Struktur und Spacing
- ❌ Card-Designs und Grid-Layouts
- ❌ Farben
- ❌ Typografie und Font-Größen
- ❌ Navigation und Footer
- ❌ Komponenten-Varianten
- ❌ Background-Varianten
- ❌ Animation-Timings
- ❌ Padding, Margins, Gaps

**ERLAUBT - NUR TECHNISCHE OPTIMIERUNGEN:**
- ✅ Performance-Optimierungen
- ✅ SEO-Optimierungen
- ✅ Accessibility-Verbesserungen
- ✅ Bug-Fixes (KEINE visuellen Änderungen!)
- ✅ Code-Refactoring
- ✅ Datenanbindungen (ohne UI-Änderung)
- ✅ Analytics & Tracking
- ✅ Error-Handling & Logging
- ✅ Security-Improvements

**NICHT ERLAUBT:**
- ❌ Neue Features hinzufügen
- ❌ Komponenten austauschen
- ❌ Farben anpassen
- ❌ Spacing optimieren
- ❌ Animationen hinzufügen/ändern
- ❌ Icons austauschen
- ❌ Texte umformulieren

### 11.3 Code-Marker

**Verpflichtender Header:**
```typescript
/* ==================================================================================
   ⚠️ LAYOUT FREEZE V32.1 - KEINE DESIGN/LAYOUT-ÄNDERUNGEN ERLAUBT!
   ==================================================================================
   DESIGN-SYSTEM: V28HeroPremium + V32.0 Slate-Only
   GESCHÜTZT: Hero, Sections, Grid-Layouts, Card-Struktur, Farben, Spacing
   ERLAUBT: Technische Optimierungen (Performance, SEO, A11y, Security)
   VERBOTEN: Design-Änderungen, neue Features, Layout-Anpassungen
   LETZTE FREIGABE: 2025-10-31
   ================================================================================== */
```

---

## 12. VERBOTENE PRAKTIKEN

### 12.1 Design-System

- ❌ V26/V26.1 Imports verwenden
- ❌ Hardcoded alte Werte
- ❌ Alte Tailwind Classes (blue-600, gray-700)
- ❌ Referenzen zu V26 Dateien

### 12.2 Farben

- ❌ Direkte HEX-Farben (#EADEBD, #323D5E)
- ❌ `text-white`, `bg-white`, `text-red-500` in Production-Code
- ❌ CI-Farben ändern
- ❌ `#323D5E` für Haupttext auf dunklem Hintergrund

### 12.3 Code-Qualität

- ❌ `console.log/error/warn` (nur `logger.ts`)
- ❌ Direkte Farben (nur Semantic Tokens)
- ❌ Hardcoded Werte (nur zentrale Datenquellen)
- ❌ `any` ohne Grund
- ❌ Ungehandelte Exceptions

### 12.4 Datenbank

- ❌ Hard-Delete verwenden
- ❌ RLS deaktivieren
- ❌ `company_id` Filter vergessen

### 12.5 Secrets

- ❌ API-Keys im Frontend
- ❌ Secrets in Git committen
- ❌ Hardcoded Credentials

---

## 13. WORKFLOW & PROZESSE

### 13.1 AI-Agent Workflow

**Bei JEDER Anfrage:**
1. 📖 DOKUMENTATION LESEN (IMMER!)
   - MYDISPATCH_MASTER_SYSTEM_V18.5.0.md (ERSTE ANLAUFSTELLE)
   - Relevante Spezial-Docs
   - Vorhandene Code-Dateien prüfen

2. 🔍 KONTEXT SAMMELN
   - Welche Dateien sind betroffen?
   - Welche Datenquellen werden benötigt?
   - Gibt es Dependencies?

3. 💡 OPTIMIERUNG PRÜFEN
   - Gibt es eine effizientere Lösung?
   - Kann ich etwas zusätzlich verbessern?
   - Sollte ich einen Alternativvorschlag machen?

4. ✅ VALIDIEREN
   - Ist die Anfrage klar?
   - Habe ich alle Informationen?
   - Gibt es Unklarheiten? → FRAGEN!

5. 🛠️ IMPLEMENTIEREN
   - SINGLE SOURCE OF TRUTH respektieren
   - Parallel Tool-Calls nutzen
   - Konsistenz sicherstellen

6. 🧪 VERIFIZIEREN
   - Funktioniert alles?
   - Sind alle Dateien synchron?
   - Mobile responsive?

### 13.2 Proaktive Optimierung

**PFLICHT: Eigenständige Verbesserungsvorschläge**
- ✅ Prüfe: Gibt es eine effizientere Lösung?
- ✅ Prüfe: Kann etwas automatisiert werden?
- ✅ Prüfe: Gibt es bessere Patterns?
- ✅ Schlage aktiv Verbesserungen vor

### 13.3 Kommunikation

**KRITISCH:** Du sprichst Pascal NIEMALS nach dem Mund!

```
❌ FALSCH: "Ja, das ist eine gute Idee"
✅ RICHTIG: "Pascal, ich verstehe deinen Ansatz, aber hier ist eine effektivere Lösung: [...]"
```

**Bei Layout-Freeze-Anfragen:**
1. **STOPPEN** - Keine Änderungen durchführen
2. **WARNEN** - User über Layout-Freeze informieren
3. **ALTERNATIVEN** - Neue Seite/Komponente vorschlagen
4. **ESKALIEREN** - Bei Konflikten: Pascal fragen

---

## 14. DOKUMENTATION & MAINTENANCE

### 14.1 Dokumentations-Hierarchie

**1. ERSTE ANLAUFSTELLE:**
- `MYDISPATCH_MASTER_SYSTEM_V18.5.0.md`

**2. Spezifische System-Docs:**
- `TARIFF_SYSTEM_V18.3.24.md` → Tarif-Details
- `CHAT_SYSTEM_FINALE_*.md` → AI-Chat
- `CORPORATE_DESIGN_MANUAL_V1.0.md` → Design
- `SYSTEM_OPTIMIZATION_PROPOSALS_V18.5.1.md` → Technische Optimierungen

**3. Code-Dateien als Referenz:**
- `src/lib/ci-colors.ts` → CI-Farben
- `src/lib/doc-timestamps.ts` → Zeitstempel

**Bei Widersprüchen:** Neueste Version (höchste Versionsnummer) gewinnt!

### 14.2 Post-Update Pflicht

**NACH JEDER ÄNDERUNG:**
- ✅ Aktualisiere `AI_SYSTEM_MEMORY.last_updated`
- ✅ Dokumentiere in `PROJECT_STATUS.md`
- ✅ Führe QA-Checks aus
- ✅ Bei Fehler: ROLLBACK + Dokumentation in `learned_errors`

### 14.3 Version-Management

**Aktuelle Version: V18.5.1**

- **Major Version (18.x):** Grundlegende System-Architektur
- **Minor Version (.5.x):** Feature-Updates
- **Patch Version (.x.1):** Bug-Fixes + Optimierungen

---

## 📊 ZUSAMMENFASSUNG: TOP-PRIORITÄT REGELN

### 🔴 ABSOLUT KRITISCH (NIEMALS BRECHEN!)

1. **Design-System:**
   - ✅ NUR V28.1 verwenden (V26/V26.1 TOT!)
   - ✅ CI-Farben NIEMALS ändern
   - ✅ `backgroundVariant="3d-premium"` für alle Hero-Sections

2. **Datenquellen:**
   - ✅ SINGLE SOURCE OF TRUTH
   - ✅ NIEMALS hardcoden
   - ✅ IMMER aus zentralen Quellen importieren

3. **Sicherheit:**
   - ✅ RLS IMMER aktiv
   - ✅ NIEMALS Hard-Delete
   - ✅ NIEMALS Secrets im Frontend

4. **Layout-Freeze:**
   - ✅ Geschützte Seiten NIEMALS ändern
   - ✅ NUR technische Optimierungen erlaubt

5. **Deutsche Formatierung:**
   - ✅ DIN 5008 (Datum, Währung, Zahlen)
   - ✅ Neue Rechtschreibreform (2006)
   - ✅ Geschützte Leerzeichen

---

**Erstellt:** 2025-01-31  
**Version:** 1.0  
**Status:** ✅ Vollständig strukturiert und dedupliziert

