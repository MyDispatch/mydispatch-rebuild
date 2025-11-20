# LAYOUT-ARCHITEKTUR V33.1 - FINAL DOCUMENTATION

**Erstellt:** 2025-10-31  
**Status:** ✅ PRODUCTION-READY  
**Letzte Prüfung:** Layout-Cleanup V33.0 abgeschlossen  
**Latest Update:** V33.4 Background-System (2025-01-31)

---

## 📚 VERSION HISTORY

### V33.4 (2025-01-31) - BACKGROUND-SYSTEM ROUTING-BASED

- ✅ Background-Steuerung über `routes.config.tsx` (zentral)
- ✅ KEINE Background-Props in Pages mehr nötig
- ✅ Type-Safe Background-Control via RouteConfig
- ✅ Premium-Pages mit `orbs-light` aktiviert: `/master`, `/dashboard`, `/agent-dashboard`, `/statistiken`
- ✅ Vollständige Dokumentation in `docs/BACKGROUND_SYSTEM_V33.4.md`

### V33.3 (2025-01-31) - MASTER DASHBOARD FIX

- ✅ Quick Actions Panel Positioning (transition-none, explizites right: 0px)
- ✅ KEINE Layout-Duplikationen mehr (0 grep Matches)

### V33.1 (2025-10-31) - FINAL STANDARDIZATION

- ✅ Alle Protected Pages nutzen Fragment-Wrapper (`<>`) + `layout: 'main'`
- ✅ Z-Index Hierarchy standardisiert
- ✅ Background-System eingeführt (white, canvas, orbs-light)

---

## 📐 SYSTEM-HIERARCHIE

```
App.tsx (Root)
├── BrowserRouter
│   ├── Routes
│   │   ├── PUBLIC ROUTES (layout: 'none')
│   │   │   └── MarketingLayout (in Page selbst)
│   │   │       ├── Marketing Sidebar (64px/240px hover)
│   │   │       ├── Header (fixed top, 64px, z-40)
│   │   │       ├── Footer (fixed bottom, 32px, z-20)
│   │   │       └── Main Content
│   │   │           ├── Floating Orbs (optional, background="orbs-light")
│   │   │           └── Page Content
│   │   │
│   │   └── PROTECTED ROUTES (layout: 'main')
│   │       └── MainLayout (automatisch von App.tsx)
│   │           ├── AppSidebar (64px/240px hover, fixed left, z-40)
│   │           ├── DashboardSidebar (320px, nur /dashboard, z-10)
│   │           ├── Header (fixed top, 64px, z-40)
│   │           ├── Footer (fixed bottom, 48px, z-20)
│   │           ├── Main Content
│   │           │   ├── Floating Orbs (optional, background="orbs-light")
│   │           │   └── Page Content
│   │           └── Quick Actions Panel (280px, nur /master, z-30)
│   │
│   └── GlobalSearchDialog (z-50)
│   └── IntelligentAIChat (z-100)
```

---

## 🎨 LAYOUT-TYPEN

### 1. MarketingLayout (Public Pages)

**Verwendung:**

```typescript
// routes.config.tsx
{
  path: '/features',
  component: lazy(() => import('@/pages/Features')),
  layout: 'none',  // ← EXPLIZIT gesetzt!
  protected: false,
  meta: { ... }
}

// Features.tsx
import { MarketingLayout } from '@/components/layout/MarketingLayoutNew';

export default function Features() {
  return (
    <MarketingLayout currentPage="features" background="orbs-light">
      <SEOHead ... />
      {/* Page Content */}
    </MarketingLayout>
  );
}
```

**Komponenten:**

- **Sidebar:** Marketing-Navigation (64px → 240px hover, z-40)
- **Header:** Logo, CTA-Buttons (64px, z-40)
- **Footer:** Copyright, Legal Links (32px, z-20)
- **Background:**
  - `white` (Default): Pure weiß
  - `canvas`: Slate-50 Background
  - `orbs-light`: Weiß + Floating Orbs

**Pages (16 Total):**

- `/` (Home)
- `/features` (Features)
- `/pricing` (Pricing)
- `/about` (About)
- `/contact` (Contact)
- `/demo` (Demo)
- `/docs` (Docs)
- `/faq` (FAQ)
- `/impressum` (Impressum)
- `/datenschutz` (Datenschutz)
- `/agb` (AGB)
- `/terms` (Terms)
- `/nutzungsbedingungen` (Nutzungsbedingungen)
- `/nexify-support` (NeXify Support)
- - Feature Detail Pages

---

### 2. MainLayout (Protected Pages)

**Verwendung:**

```typescript
// routes.config.tsx
{
  path: '/dashboard',
  component: lazy(() => import('@/pages/Index')),
  layout: 'main',  // ← App.tsx wrapped automatisch!
  protected: true,
  meta: { ... }
}

// Index.tsx
export default function Index() {
  return (
    <>
      <SEOHead ... />  {/* KEIN Layout-Wrapper! */}
      <Breadcrumbs />
      {/* Page Content */}
    </>
  );
}
```

**Komponenten:**

- **AppSidebar:** App-Navigation (64px → 240px hover, z-40)
- **DashboardSidebar:** Quick-Links (320px, nur `/dashboard`, z-10)
- **Header:** User-Profil, Search, AI-Button (64px, z-40)
- **Footer:** Copyright, Legal Links (48px, z-20)
- **Quick Actions Panel:** System-Actions (280px, nur `/master`, z-30)
- **Background:**
  - `white` (Default): Pure weiß
  - `canvas`: Slate-50 Background
  - `orbs-light`: Weiß + Floating Orbs

**Pages (29 Total):**

- `/dashboard` (Dashboard)
- `/master` (Master Dashboard)
- `/auftraege` (Aufträge)
- `/fahrer` (Fahrer)
- `/fahrzeuge` (Fahrzeuge)
- `/kunden` (Kunden)
- `/partner` (Partner)
- `/rechnungen` (Rechnungen)
- `/dokumente` (Dokumente)
- `/statistiken` (Statistiken)
- `/einstellungen` (Einstellungen)
- - 18 weitere Protected Routes

---

## 🔢 Z-INDEX HIERARCHY

Aus `src/lib/constants.ts`:

```typescript
export const Z_INDEX_HIERARCHY = {
  base: 0, // Base Content
  dashboardSidebar: 10, // DashboardSidebar (320px)
  quickActionsPanel: 30, // Quick Actions Panel (280px)
  header: 40, // Header & AppSidebar
  dialogs: 50, // GlobalSearchDialog
  notifications: 100, // IntelligentAIChat, Toasts
} as const;
```

**Implementierung:**

- **Header:** `z-40` (inline style)
- **Footer:** `z-20` (inline style)
- **AppSidebar:** `z-40` (className)
- **Marketing Sidebar:** `z-40` (className)
- **DashboardSidebar:** `z-10` (className)
- **Quick Actions Panel:** `z-30` (className)

**Regel:** Header/Sidebar IMMER z-40, Footer IMMER z-20, Panels z-10 bis z-30

---

## 📱 RESPONSIVE VERHALTEN

### Desktop (1920x1080)

```
┌─────────────────────────────────────────────────────────┐
│ Header (64px, z-40)                                     │
├─────┬───────────────────────────────────────────┬───────┤
│ App │ Main Content (flex-1)                     │ Quick │
│ Side│ - Floating Orbs (optional)                │ Act.  │
│ bar │ - Page Content                            │ Panel │
│ 64/ │ - Responsive Margins:                     │ 280px │
│ 240 │   • /dashboard: 384px / 560px             │ (nur  │
│ px  │   • andere: 64px / 240px                  │/master│
├─────┴───────────────────────────────────────────┴───────┤
│ Footer (48px, z-20)                                     │
└─────────────────────────────────────────────────────────┘
```

**Sidebar-Toggle:**

- **Collapsed:** 64px (nur Icons)
- **Expanded:** 240px (Icons + Text)
- **Transition:** 600ms cubic-bezier(0.4, 0, 0.2, 1)
- **Trigger:** `onMouseEnter` / `onMouseLeave`

**Dashboard-Spezifikum:**

- **DashboardSidebar:** Zusätzliche 320px links
- **Main Content Margin:** 384px (collapsed) / 560px (expanded)

### Tablet (768x1024)

```
┌─────────────────────────────────────────────────────────┐
│ Header (64px, z-40)                                     │
├─────┬───────────────────────────────────────────────────┤
│ App │ Main Content (flex-1)                             │
│ Side│ - Collapsed Sidebar (64px)                        │
│ bar │ - Touch-friendly Targets (44x44px min)            │
│ 64px│ - NO Quick Actions Panel (Mobile-first)           │
├─────┴───────────────────────────────────────────────────┤
│ Footer (48px, z-20)                                     │
└─────────────────────────────────────────────────────────┘
```

### Mobile (375x667)

```
┌─────────────────────────────────────────────────────────┐
│ MobileHeader (56px, z-40)                               │
│ - Hamburger Menu Button (links)                         │
│ - Logo (center)                                         │
│ - Action Buttons (rechts)                               │
├─────────────────────────────────────────────────────────┤
│ Main Content (flex-1)                                   │
│ - pt-20 (MobileHeader Offset)                           │
│ - pb-0 (MobileBottomNav Offset)                         │
│ - NO Desktop Sidebars                                   │
│ - NO Quick Actions Panel                                │
├─────────────────────────────────────────────────────────┤
│ MobileBottomNav (64px, z-40)                            │
│ - 5 Primary Navigation Icons                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🎭 BACKGROUND-SYSTEM

### Unterstützte Varianten:

#### 1. `background="white"` (Default)

```css
bg-white
```

Pure weißer Hintergrund, keine Orbs, keine Texturen.

#### 2. `background="canvas"`

```css
bg-slate-50
```

Slate-50 Canvas-Hintergrund, subtle, professionell.

#### 3. `background="orbs-light"` (Premium)

```css
bg-white relative overflow-hidden
```

**Floating Orbs:**

```tsx
{
  background === "orbs-light" && (
    <>
      <div
        className="absolute top-[10%] right-[5%] w-[350px] h-[350px] 
        bg-slate-100 rounded-full blur-2xl opacity-20 
        pointer-events-none animate-pulse"
        style={{ animationDuration: "10s" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[15%] left-[5%] w-[300px] h-[300px] 
        bg-slate-200 rounded-full blur-2xl opacity-15 
        pointer-events-none animate-pulse"
        style={{ animationDuration: "15s", animationDelay: "3s" }}
        aria-hidden="true"
      />
    </>
  );
}
```

**Verwendung:**

```typescript
// MarketingLayout
<MarketingLayout background="orbs-light">
  {children}
</MarketingLayout>

// MainLayout (via props)
<MainLayout background="orbs-light">
  {children}
</MainLayout>
```

---

## 🚫 ANTI-PATTERNS (VERMEIDEN!)

### ❌ NIEMALS: Verschachtelte Layouts

```typescript
// ❌ FALSCH
export default function MyPage() {
  return (
    <DashboardLayout>  {/* Doppelter Wrapper! */}
      <MainLayout>
        {content}
      </MainLayout>
    </DashboardLayout>
  );
}

// ✅ RICHTIG (Protected Page)
// routes.config.tsx: layout: 'main'
export default function MyPage() {
  return (
    <>
      <SEOHead ... />  {/* KEIN Layout-Wrapper! */}
      {content}
    </>
  );
}

// ✅ RICHTIG (Public Page)
// routes.config.tsx: layout: 'none'
export default function MyPage() {
  return (
    <MarketingLayout currentPage="mypage">
      <SEOHead ... />
      {content}
    </MarketingLayout>
  );
}
```

### ❌ NIEMALS: Layout-Prop in routes.config OHNE Wrapper

```typescript
// ❌ FALSCH
// routes.config.tsx: layout: 'none'
export default function MyPage() {
  return (
    <MarketingLayout>  {/* App.tsx wrapped NICHT! */}
      {content}
    </MarketingLayout>
  );
}

// ✅ RICHTIG
// routes.config.tsx: layout: 'none' (explizit!)
export default function MyPage() {
  return (
    <MarketingLayout>  {/* Page wrapped selbst */}
      {content}
    </MarketingLayout>
  );
}
```

### ❌ NIEMALS: Direkte Z-Index-Werte ohne Constants

```typescript
// ❌ FALSCH
<div className="z-50">...</div>

// ✅ RICHTIG
import { Z_INDEX_HIERARCHY } from '@/lib/constants';
<div style={{ zIndex: Z_INDEX_HIERARCHY.header }}>...</div>
```

---

## 🔧 TRANSITION TIMINGS

**Aus `@/lib/design-system/design-tokens`:**

```typescript
export const DESIGN_TOKENS = {
  motion: {
    duration: {
      default: "300ms", // Buttons, Hover
      slow: "600ms", // Sidebar, Layout-Shifts
    },
    timing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
};
```

**Sidebar-Toggle:**

```typescript
style={{
  transitionDuration: '600ms',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
}}
```

**Header/Footer Sync:**

```typescript
style={{
  transition: `
    left 600ms cubic-bezier(0.4, 0, 0.2, 1),
    width 600ms cubic-bezier(0.4, 0, 0.2, 1)
  `,
}}
```

---

## 📦 COMPONENT-EXPORTE

### MarketingLayout

```typescript
import { MarketingLayout } from "@/components/layout/MarketingLayoutNew";
```

### MainLayout

```typescript
import { MainLayout } from "@/components/layout/MainLayout";
```

### useMainLayout (Shared State)

```typescript
import { useMainLayout } from "@/hooks/use-main-layout";

const { sidebarExpanded, setSidebarExpanded } = useMainLayout();
```

---

## ✅ TESTING CHECKLISTE

### Visual Regression Tests:

- [ ] Desktop (1920x1080): Sidebar-Toggle smooth
- [ ] Desktop: KEINE doppelten Header/Footer
- [ ] Desktop: Floating Orbs sichtbar (orbs-light Pages)
- [ ] Desktop: Quick Actions Panel rechts (nur /master)
- [ ] Desktop: DashboardSidebar links (nur /dashboard)
- [ ] Tablet (768x1024): Collapsed Sidebar, Touch-friendly
- [ ] Mobile (375x667): MobileHeader, MobileBottomNav, KEINE Desktop-Sidebars

### Functional Tests:

- [ ] Sidebar-Toggle: 64px ↔ 240px (600ms Transition)
- [ ] Header/Footer: Sync mit Sidebar-Breite
- [ ] Background-System: white, canvas, orbs-light funktionieren
- [ ] Z-Index: Header (40) > Quick Actions (30) > DashboardSidebar (10)

### Accessibility Tests:

- [ ] Touch-Targets: Min. 44x44px
- [ ] Keyboard-Navigation: Fokus sichtbar
- [ ] Screen Reader: Sidebar-Labels korrekt
- [ ] Color Contrast: WCAG AA konform

---

## 📚 RELATED DOCUMENTATION

- `docs/DASHBOARD_STANDARDS.md` → Dashboard-spezifische Standards
- `docs/MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md` → Responsive Grid System
- `docs/COMPONENT_REGISTRY.md` → Alle Components
- `src/lib/constants.ts` → Z-Index Hierarchy
- `src/config/design-tokens.ts` → Design System Tokens

---

## 🚀 CHANGELOG

### V33.1 (2025-10-31) - LAYOUT-CLEANUP

- ✅ Z-Index Fix: Header auf z-40, Footer auf z-20
- ✅ MarketingLayout Background-System: Floating Orbs hinzugefügt
- ✅ DashboardLayout.tsx entfernt (obsolet)
- ✅ Alle Pages auf MainLayout-only migriert
- ✅ Vollständige Dokumentation erstellt

### V33.0 (2025-10-30) - INITIAL CLEANUP

- ✅ MasterDashboard.tsx entfernt (obsolet)
- ✅ Protected Pages: DashboardLayout-Wrapper entfernt
- ✅ Template-Components: SEOHead direkt hinzugefügt

### V33.2 (2025-01-31) - LAYOUT-WRAPPER STANDARDISIERUNG 🔴 CRITICAL FIX

**Problem:** Einige Pages wrapped sich SELBST in `<MainLayout>`, obwohl `routes.config.tsx` bereits `layout: 'main'` setzte → Doppelte Header/Footer

**Root Cause:**

- Protected Pages importierten `<MainLayout>` direkt
- `App.tsx` wrapped BEREITS via `routes.config.tsx` (`layout: 'main'`)
- Resultat: `<MainLayout><MainLayout>...</MainLayout></MainLayout>` (Verschachtelung)

**Lösung:**

1. **ALLE** Protected Pages nutzen NUR Fragment-Wrapper (`<>`)
2. `layout: 'main'` in `routes.config.tsx` sorgt für automatisches Wrapping in `App.tsx`
3. Public Pages nutzen `layout: 'none'` und wrappen sich SELBST in `<MarketingLayout>`

**Betroffene Dateien:**

- ✅ `Dokumente.tsx`: Fragment-Schließung korrigiert (Zeile 439)
- ✅ `Kommunikation.tsx`: Fragment-Schließung korrigiert (Zeile 802)
- ✅ `Schichtzettel.tsx`: `<MainLayout>`-Wrapper entfernt, `SEOHead` hinzugefügt
- ✅ `Dashboard.tsx`: `<MainLayout>`-Wrapper entfernt
- ✅ `Master.tsx`: Bereits in V33.1 gefixt

**Erfolgs-Kriterien:**

- ✅ 0 Build-Errors
- ✅ KEINE doppelten Header/Footer auf ALLEN Protected Pages
- ✅ KEINE verschachtelten Layouts mehr
- ✅ EINE zentrale Layout-Steuerung (`routes.config.tsx` + `App.tsx`)
- ✅ Alle Pages haben `<SEOHead>` mit korrekten Meta-Daten

**NEUE MANDATORY REGEL:**

```typescript
// ❌ NIEMALS in Protected Pages:
import { MainLayout } from '@/components/layout/MainLayout';
export default function Page() {
  return <MainLayout>...</MainLayout>;  // ❌ VERBOTEN!
}

// ✅ IMMER in Protected Pages:
import { SEOHead } from '@/components/shared/SEOHead';
export default function Page() {
  return (
    <>
      <SEOHead ... />
      {/* Content */}
    </>
  );
}
```

**Referenz:** `docs/LAYOUT_FIX_V33.2_COMPLETED.md` für vollständige Details

---

**ENDE DER DOKUMENTATION V33.2** ✅
