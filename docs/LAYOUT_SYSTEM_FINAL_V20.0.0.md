# LAYOUT SYSTEM FINAL SPECIFICATION V20.0.0

> **Status:** PRODUCTION LOCKED 🔒  
> **Datum:** 2025-01-26  
> **Priorität:** P-00 (HÖCHSTE)

---

## 🚨 KRITISCHE REGEL

**DIESES LAYOUT-SYSTEM IST AB SOFORT UNVERÄNDERLICH!**

Alle Layouts im gesamten System MÜSSEN diese Architektur zu 100% einhalten.

**KEINE ABWEICHUNGEN ERLAUBT!**

---

## 📐 LAYOUT-ARCHITEKTUR

### Grundprinzip: Fixed Sidebar, Responsive Content

```
┌─────────────────────────────────────────────────────┐
│  Sidebar (fixed)  │  Header (fixed, angepasst)      │
│  64px / 240px     ├─────────────────────────────────┤
│                   │                                  │
│  [Navigation]     │  Main Content                    │
│                   │  (pt-16 pb-20)                   │
│  [Legal]          │                                  │
│                   ├─────────────────────────────────┤
│                   │  Footer (fixed, angepasst)       │
└───────────────────┴─────────────────────────────────┘
```

**KEY EIGENSCHAFTEN:**
- ✅ Sidebar: `fixed left-0 top-0 h-full`
- ✅ Header: `fixed top-0 right-0` mit `left: 64px/240px`
- ✅ Footer: `fixed bottom-0 right-0` mit `left: 64px/240px`
- ✅ Main: `flex-1` (KEIN margin!)
- ✅ Content: Padding für Header/Footer

---

## 🎯 KOMPONENTEN-HIERARCHIE

### 1. MainLayout (Desktop)

```typescript
<div className="min-h-screen flex bg-background">
  {/* Sidebar - FIXED LEFT */}
  <AppSidebar 
    expanded={sidebarExpanded} 
    setExpanded={setSidebarExpanded} 
  />

  {/* Main Content Area - KEIN margin! */}
  <div className="flex-1 overflow-x-hidden">
    <Header sidebarExpanded={sidebarExpanded} />
    
    <main className="min-h-screen pt-16 pb-20">
      {children}
    </main>
    
    <Footer sidebarExpanded={sidebarExpanded} />
  </div>
</div>
```

**WICHTIG:**
- ❌ **KEIN** `ml-60` oder `ml-[64px]` auf Main-Content!
- ✅ Header/Footer passen sich automatisch an Sidebar-Breite an
- ✅ `flex-1` sorgt für automatische Breite

---

### 2. AppSidebar

```typescript
<aside
  className={cn(
    "fixed left-0 top-0 h-full z-40",
    "bg-background border-r",
    "transition-[width]",
    expanded ? "w-60" : "w-[64px]"
  )}
  style={{
    borderColor: DESIGN_TOKENS.colors.border.DEFAULT,
    boxShadow: DESIGN_TOKENS.elevation.sm,
    transitionDuration: DESIGN_TOKENS.motion.duration.slow,
    transitionTimingFunction: DESIGN_TOKENS.motion.timing.easeInOut,
  }}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
  {/* Toggle */}
  <div className="h-16 flex items-center justify-center">
    {!expanded && <ChevronRight style={{ width: '20px', height: '20px' }} />}
  </div>

  {/* Navigation - SCROLLBAR SICHTBAR */}
  <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-visible">
    {/* Menu Items */}
  </nav>

  {/* Legal Section */}
  <div className={cn("transition-opacity", expanded ? "opacity-100" : "opacity-0")}>
    {/* Legal Links */}
  </div>
</aside>
```

**KEY FEATURES:**
- ✅ `fixed left-0 top-0 h-full` (immer sichtbar)
- ✅ `z-40` (über Main-Content)
- ✅ `.scrollbar-visible` (Scrollbar sichtbar)
- ✅ **ALLE Icons 20px × 20px** (konsistent!)
- ✅ Hover-Expansion: 64px → 240px

---

### 3. Header

```typescript
<header 
  className="fixed top-0 right-0 z-30 bg-background transition-[left,width]" 
  style={{ 
    left: sidebarExpanded ? '240px' : '64px',
    width: sidebarExpanded ? 'calc(100% - 240px)' : 'calc(100% - 64px)',
    boxShadow: DESIGN_TOKENS.elevation.sm,
    borderBottom: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`,
    transitionDuration: DESIGN_TOKENS.motion.duration.slow,
    transitionTimingFunction: DESIGN_TOKENS.motion.timing.easeInOut,
  }}
>
  <div style={{ padding: `0 ${DESIGN_TOKENS.spacing.lg} 0 ${DESIGN_TOKENS.spacing.xl}` }}>
    <div className="flex items-center justify-between" style={{ height: '64px' }}>
      {/* Logo */}
      {/* Actions */}
    </div>
  </div>
</header>
```

**KEY EIGENSCHAFTEN:**
- ✅ `fixed top-0 right-0` (nicht full-width!)
- ✅ `left` und `width` passen sich an Sidebar an
- ✅ `z-30` (unter Sidebar, über Content)
- ✅ Height: `64px`

---

### 4. Footer

```typescript
<footer 
  className="fixed bottom-0 z-20 bg-background transition-[left,width]"
  style={{ 
    left: sidebarExpanded ? '240px' : '64px',
    width: sidebarExpanded ? 'calc(100% - 240px)' : 'calc(100% - 64px)',
    borderTop: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`,
    padding: `${DESIGN_TOKENS.spacing.xs} 0`,
    transitionDuration: DESIGN_TOKENS.motion.duration.slow,
    transitionTimingFunction: DESIGN_TOKENS.motion.timing.easeInOut,
  }}
>
  {/* Footer Content */}
</footer>
```

**KEY EIGENSCHAFTEN:**
- ✅ `fixed bottom-0` (nicht full-width!)
- ✅ `left` und `width` passen sich an Sidebar an
- ✅ `z-20` (unter Header, über Content)

---

## 📏 SPACING & DIMENSIONS

### Sidebar
- **Width collapsed:** `64px`
- **Width expanded:** `240px`
- **z-index:** `40`
- **Transition:** `300ms ease-in-out`

### Header
- **Height:** `64px`
- **z-index:** `30`
- **Padding:** `0 ${DESIGN_TOKENS.spacing.lg} 0 ${DESIGN_TOKENS.spacing.xl}`

### Footer
- **Padding:** `${DESIGN_TOKENS.spacing.xs} 0`
- **z-index:** `20`

### Main Content
- **Padding Top:** `pt-16` (64px für Header)
- **Padding Bottom:** `pb-20` (80px für Footer)
- **KEIN margin!**

---

## 🔧 KRITISCHE FIXES

### Problem 1: Margin statt flex-1

**FALSCH:**
```typescript
<div className="flex-1 ml-60"> {/* ❌ margin verschiebt! */}
```

**RICHTIG:**
```typescript
<div className="flex-1"> {/* ✅ füllt automatisch! */}
```

### Problem 2: Icons inkonsistent

**FALSCH:**
```typescript
<Icon className="h-5 w-5" /> {/* ❌ 20px */}
<Icon className="h-4 w-4" /> {/* ❌ 16px */}
<Icon style={{ width: '14px', height: '14px' }} /> {/* ❌ 14px */}
```

**RICHTIG:**
```typescript
<Icon style={{ width: '20px', height: '20px' }} /> {/* ✅ IMMER 20px! */}
```

### Problem 3: Scrollbar nicht sichtbar

**FALSCH:**
```typescript
<nav className="overflow-y-auto"> {/* ❌ Scrollbar versteckt */}
```

**RICHTIG:**
```typescript
<nav className="overflow-y-auto scrollbar-visible"> {/* ✅ Scrollbar sichtbar */}

/* In index.css */
.scrollbar-visible {
  scrollbar-width: thin;
  scrollbar-color: #E5E7EB transparent;
}
```

---

## 📦 BETROFFENE DATEIEN

### ✅ FINAL (REFERENZ)
- `src/components/layout/MainLayout.tsx` ⭐ V20.0.0
- `src/components/layout/AppSidebar.tsx` ⭐ V20.0.0
- `src/components/layout/Header.tsx` ⭐ V20.0.0
- `src/components/layout/Footer.tsx` ⭐ V20.0.0
- `src/components/layout/DashboardLayout.tsx` ⭐ V20.0.0

### 📝 VERWANDTE KOMPONENTEN
- `src/components/layout/MobileHeader.tsx` - Mobile-Variante
- `src/components/layout/MobileBottomNav.tsx` - Mobile-Navigation
- `src/components/layout/MarketingLayoutNew.tsx` - Marketing-Version

---

## ✅ VERWENDUNG

### Dashboard Pages

```typescript
import { MainLayout } from '@/components/layout/MainLayout';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Content */}
      </div>
    </MainLayout>
  );
}
```

### Mit Breadcrumbs

```typescript
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DetailPage() {
  return (
    <DashboardLayout
      title="Seiten-Titel"
      description="Beschreibung"
      canonical="/detail"
    >
      {/* Content */}
    </DashboardLayout>
  );
}
```

---

## 🚨 VERBOTEN (BLACKLIST)

### ❌ NIEMALS VERWENDEN

1. **Margin auf Main-Content:**
   ```typescript
   ❌ className="ml-60 ml-[64px]"
   ```

2. **Inline Header/Footer in Pages:**
   ```typescript
   ❌ <header>Custom Header</header>
   ✅ <MainLayout> {/* verwendet Header intern */}
   ```

3. **Inkonsistente Icon-Größen:**
   ```typescript
   ❌ <Icon className="h-4 w-4" />
   ✅ <Icon style={{ width: '20px', height: '20px' }} />
   ```

4. **Sidebar ohne fixed:**
   ```typescript
   ❌ className="absolute left-0"
   ✅ className="fixed left-0 top-0 h-full"
   ```

5. **Scrollbar verstecken:**
   ```typescript
   ❌ className="overflow-y-auto"
   ✅ className="overflow-y-auto scrollbar-visible"
   ```

---

## 🔒 LOCK-DOWN REGEL

**AB SOFORT GILT:**

Diese Layout-Architektur ist **UNVERÄNDERLICH** und **SYSTEMWEIT VERBINDLICH**.

Jede Abweichung führt zu:
- ❌ Layout-Bruch
- ❌ Inkonsistente Spacing
- ❌ Sofortiger Rollback

**Dieses System darf niemals wieder geändert werden!**

---

## 📚 VERWANDTE DOKUMENTE

- `HEADER_FOOTER_SIDEBAR_FINAL_V20.0.0.md` - Header/Footer/Sidebar Design
- `DESIGN_TOKENS` - Zentrale Token-Definitionen
- `PRICING_DESIGN_SYSTEM_V26.0.md` - Marketing Page Standards

---

**ENDE DER SPEZIFIKATION**

**Status:** 🔒 LOCKED - UNVERÄNDERLICH - SYSTEMWEIT VERBINDLICH
