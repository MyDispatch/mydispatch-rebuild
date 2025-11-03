# LAYOUT-PATTERN STANDARD V33.1

**Erstellt:** 2025-10-31  
**Status:** ✅ MANDATORY STANDARD  
**Gültig ab:** Sofort

---

## 🎯 GOLDEN RULES

### Rule #1: SINGLE SOURCE OF TRUTH
**Ein Layout-System pro Page-Typ:**
- **Public Pages:** `MarketingLayout` (in Page selbst)
- **Protected Pages:** `MainLayout` (automatisch von App.tsx)

### Rule #2: NIEMALS VERSCHACHTELN
**Nie zwei Layouts kombinieren:**
```typescript
// ❌ FALSCH
<MainLayout>
  <MarketingLayout>
    {content}
  </MarketingLayout>
</MainLayout>

// ✅ RICHTIG
<MarketingLayout>
  {content}
</MarketingLayout>
```

### Rule #3: LAYOUT-PROP IN ROUTES.CONFIG
**Immer explizit setzen:**
```typescript
// ✅ RICHTIG
{
  path: '/features',
  component: lazy(() => import('@/pages/Features')),
  layout: 'none',  // ← EXPLIZIT!
  protected: false,
}

// ❌ FALSCH (undefined = Fehler)
{
  path: '/features',
  component: lazy(() => import('@/pages/Features')),
  // layout fehlt!
}
```

---

## 📖 CODE-BEISPIELE

### Public Page (Marketing)

**routes.config.tsx:**
```typescript
{
  path: '/features',
  component: lazy(() => import('@/pages/Features')),
  layout: 'none',  // ← EXPLIZIT: Kein App.tsx Wrapper!
  protected: false,
  prefetch: true,
  meta: {
    title: 'Features',
    description: 'Alle MyDispatch Features im Überblick',
  },
}
```

**Features.tsx:**
```typescript
import { MarketingLayout } from '@/components/layout/MarketingLayoutNew';
import { SEOHead } from '@/components/shared/SEOHead';
import { V28HeroPremium } from '@/components/hero';

export default function Features() {
  return (
    <MarketingLayout 
      currentPage="features" 
      background="orbs-light"  // ← Optional: Floating Orbs
    >
      <SEOHead 
        title="Features - MyDispatch"
        description="Alle MyDispatch Features im Überblick"
        canonical="/features"
      />

      <V28HeroPremium
        variant="features"
        backgroundVariant="3d-premium"
        title="Leistungsstarke Features"
        subtitle="Alles für Ihre Disposition"
      />

      {/* Page Content */}
      <section className="py-16">
        {/* ... */}
      </section>
    </MarketingLayout>
  );
}
```

---

### Protected Page (App)

**routes.config.tsx:**
```typescript
{
  path: '/dashboard',
  component: lazy(() => import('@/pages/Index')),
  layout: 'main',  // ← App.tsx wrapped automatisch!
  protected: true,
  meta: {
    title: 'Dashboard',
    icon: Home,
    breadcrumb: 'Dashboard',
    description: 'Live-Übersicht und Statistiken',
  },
}
```

**Index.tsx:**
```typescript
import { SEOHead } from '@/components/shared/SEOHead';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Premium3DCard } from '@/components/design-system/Premium3DCard';

export default function Index() {
  return (
    <>
      <SEOHead 
        title="Dashboard - MyDispatch"
        description="Live-Übersicht Ihrer Flotte"
        canonical="/dashboard"
      />

      <Breadcrumbs />

      {/* KEIN Layout-Wrapper! MainLayout kommt von App.tsx */}
      <div className="space-y-6">
        <Premium3DCard title="Aufträge heute" value={47} />
        {/* ... */}
      </div>
    </>
  );
}
```

---

### Master Dashboard (Spezialfall)

**routes.config.tsx:**
```typescript
{
  path: '/master',
  component: lazy(() => import('@/pages/Master')),
  layout: 'main',  // ← MainLayout mit Quick Actions Panel
  protected: true,
  requiredRole: 'master',  // 🚨 Nur für System-Admins!
  meta: {
    title: 'Master System Dashboard',
    icon: ShieldCheck,
    breadcrumb: 'System Control',
    description: 'Zentrale System-Kontrolle',
  },
}
```

**Master.tsx:**
```typescript
import { MainLayout } from '@/components/layout/MainLayout';
import { useMainLayout } from '@/hooks/use-main-layout';

export default function Master() {
  const { sidebarExpanded } = useMainLayout();

  return (
    <MainLayout background="orbs-light">
      {/* Main Content */}
      <div className="space-y-6">
        {/* System Health KPIs */}
      </div>

      {/* Quick Actions Panel - Fixed Right */}
      <aside 
        className="fixed right-0 w-[280px] bg-white/95 backdrop-blur-md 
          border-l border-slate-200 shadow-2xl z-30 overflow-y-auto"
        style={{
          top: '64px',
          bottom: '48px',
          height: 'calc(100vh - 64px - 48px)',
        }}
      >
        {/* Quick Actions */}
      </aside>
    </MainLayout>
  );
}
```

---

## 🎨 BACKGROUND-SYSTEM

### MarketingLayout Background-Prop

**Syntax:**
```typescript
<MarketingLayout 
  currentPage="features" 
  background="white" | "canvas" | "orbs-light"
>
  {children}
</MarketingLayout>
```

**Varianten:**

#### 1. `background="white"` (Default)
```typescript
<MarketingLayout background="white">
  {/* Pure weißer Hintergrund */}
</MarketingLayout>
```

#### 2. `background="canvas"`
```typescript
<MarketingLayout background="canvas">
  {/* Slate-50 Canvas-Hintergrund */}
</MarketingLayout>
```

#### 3. `background="orbs-light"` (Premium)
```typescript
<MarketingLayout background="orbs-light">
  {/* Weiß + Floating Orbs */}
</MarketingLayout>
```

### MainLayout Background-Prop

**Syntax:**
```typescript
<MainLayout background="white" | "canvas" | "orbs-light">
  {children}
</MainLayout>
```

**Verwendung identisch zu MarketingLayout.**

---

## 🚨 HÄUFIGE FEHLER

### Fehler #1: Doppelter Layout-Wrapper
```typescript
// ❌ FALSCH
// routes.config: layout: 'main'
export default function MyPage() {
  return (
    <DashboardLayout>  {/* Doppelter Wrapper! */}
      {content}
    </DashboardLayout>
  );
}

// ✅ RICHTIG
// routes.config: layout: 'main'
export default function MyPage() {
  return (
    <>
      <SEOHead ... />  {/* KEIN Wrapper! */}
      {content}
    </>
  );
}
```

### Fehler #2: Layout-Prop vergessen
```typescript
// ❌ FALSCH
{
  path: '/features',
  component: lazy(() => import('@/pages/Features')),
  // layout fehlt! → undefined → Error
}

// ✅ RICHTIG
{
  path: '/features',
  component: lazy(() => import('@/pages/Features')),
  layout: 'none',  // ← EXPLIZIT gesetzt!
}
```

### Fehler #3: MarketingLayout in Protected Page
```typescript
// ❌ FALSCH
// routes.config: layout: 'main', protected: true
export default function MyProtectedPage() {
  return (
    <MarketingLayout>  {/* Falsche Layout-Komponente! */}
      {content}
    </MarketingLayout>
  );
}

// ✅ RICHTIG
// routes.config: layout: 'main', protected: true
export default function MyProtectedPage() {
  return (
    <>
      <SEOHead ... />  {/* MainLayout kommt von App.tsx */}
      {content}
    </>
  );
}
```

### Fehler #4: Background ohne overflow-hidden
```typescript
// ❌ FALSCH
<div className="bg-white relative">
  {/* Orbs werden abgeschnitten! */}
  <div className="absolute ...">...</div>
</div>

// ✅ RICHTIG
<div className="bg-white relative overflow-hidden">
  {/* Orbs bleiben sichtbar */}
  <div className="absolute ...">...</div>
</div>
```

---

## 📋 CHECKLISTE FÜR NEUE PAGES

### Public Page:
- [ ] `routes.config.tsx`: `layout: 'none'` gesetzt
- [ ] Page importiert `MarketingLayout`
- [ ] `<MarketingLayout currentPage="...">`-Wrapper
- [ ] `<SEOHead>`-Component hinzugefügt
- [ ] `background`-Prop gesetzt (falls Orbs gewünscht)
- [ ] Hero-Section implementiert (V28HeroPremium)

### Protected Page:
- [ ] `routes.config.tsx`: `layout: 'main'` gesetzt
- [ ] `protected: true` gesetzt
- [ ] Page importiert KEINE Layout-Komponente
- [ ] `<SEOHead>`-Component hinzugefügt
- [ ] `<Breadcrumbs>`-Component hinzugefügt
- [ ] Content in `<div className="space-y-6">`-Wrapper

---

## 🔗 RELATED STANDARDS

- `docs/LAYOUT_ARCHITECTURE_V33.1.md` → Vollständige Layout-Hierarchie
- `docs/DASHBOARD_STANDARDS.md` → Dashboard-spezifische Standards
- `docs/COMPONENT_REGISTRY.md` → Alle verfügbaren Components

---

**ENDE DES PATTERN-STANDARDS V33.1** ✅
