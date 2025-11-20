# 🪟 PopUp System V28.1 - Wiederverwendbare Dialog-Patterns

**Status:** ✅ PRODUCTION-READY  
**Version:** 28.1 - Professional Gray-Blue Flat Design  
**Erstellt:** 2025-10-28  
**Gültig für:** Alle Dialogs, Modals, PopUps, Overlays

---

## 🎯 ZIEL

Systemweites, konsistentes PopUp-Design für alle Dialog-Komponenten in MyDispatch.

**Design-Prinzipien:**

- ✅ V28.1 Professional Gray-Blue Design
- ✅ Flat Design (rounded-2xl Container)
- ✅ Mobile-First & Tablet-Responsive
- ✅ 300ms Transitions
- ✅ Accessibility-konform (ARIA, Keyboard)
- ✅ Performance-optimiert (Lazy Loading)

---

## 🎨 DESIGN SPECIFICATION

### Container

```typescript
// Dialog Container
<DialogContent
  className="max-w-3xl max-h-[90vh] p-0 overflow-hidden rounded-2xl border shadow-lg"
  style={{
    borderColor: PRIMARY_COLORS_V28.slate200,
    background: PRIMARY_COLORS_V28.white,
  }}
>
```

**Eigenschaften:**

- **Max Width:** `max-w-3xl` (768px) - Responsive auf allen Screens
- **Max Height:** `max-h-[90vh]` - Verhindert Viewport-Overflow
- **Padding:** `p-0` - Kein direktes Padding (Sections haben eigenes)
- **Overflow:** `overflow-hidden` - Verhindert Layout-Probleme
- **Border Radius:** `rounded-2xl` (16px) - Einzige Ausnahme vom Flat Design
- **Border:** 1px solid slate200
- **Shadow:** `shadow-lg` (Tailwind Standard)
- **Background:** White (slate50 für Body-Section)

### Header (Fixed)

```typescript
<DialogHeader
  className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b shrink-0"
  style={{ borderColor: PRIMARY_COLORS_V28.slate200 }}
>
  {/* Header Content */}
</DialogHeader>
```

**Eigenschaften:**

- **Position:** Fixed (shrink-0)
- **Padding:** Mobile: `px-4 pt-4 pb-4`, Desktop: `px-6 pt-6 pb-4`
- **Border:** 1px solid slate200 (unten)
- **Background:** Transparent (erbt von Container)
- **Flex:** Flex-Column mit gap-3/4

**Header-Struktur:**

```tsx
{
  /* Icon + Title + Badge */
}
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
  {/* Icon + Title */}
  <div className="flex items-center gap-3 w-full sm:w-auto">
    {/* Icon Box */}
    <div
      className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center shrink-0"
      style={{
        background: `linear-gradient(135deg, ${PRIMARY_COLORS_V28.primaryLight} 0%, ${PRIMARY_COLORS_V28.slate100} 100%)`,
      }}
    >
      <Icon style={{ color: PRIMARY_COLORS_V28.primary }} />
    </div>

    {/* Title + Description */}
    <div className="flex-1 min-w-0">
      <DialogTitle style={{ color: PRIMARY_COLORS_V28.slate900 }}>Title</DialogTitle>
      <DialogDescription style={{ color: PRIMARY_COLORS_V28.slate600 }}>
        Description
      </DialogDescription>
    </div>
  </div>

  {/* Badge (optional) */}
  <Badge
    style={{
      background: PRIMARY_COLORS_V28.primary,
      color: PRIMARY_COLORS_V28.white,
    }}
  >
    Badge Text
  </Badge>
</div>;
```

### Body (Scrollable)

```typescript
<div
  className="px-4 sm:px-6 py-4 overflow-y-auto flex-1"
  style={{
    background: PRIMARY_COLORS_V28.slate50,
  }}
>
  {/* Body Content */}
</div>
```

**Eigenschaften:**

- **Padding:** Mobile: `px-4 py-4`, Desktop: `px-6 py-4`
- **Overflow:** `overflow-y-auto` - Scrollable bei Bedarf
- **Flex:** `flex-1` - Nimmt verfügbaren Platz ein
- **Background:** slate50 (unterscheidet sich von Header/Footer)

**Content-Sections:**

```tsx
{
  /* Section */
}
<div className="mb-6">
  {/* Section Title */}
  <h3
    className="text-xs sm:text-sm font-semibold mb-3"
    style={{ color: PRIMARY_COLORS_V28.slate600 }}
  >
    Section Title
  </h3>

  {/* Section Content */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">{/* Items */}</div>
</div>;
```

### Footer (Fixed)

```typescript
<div
  className="px-4 sm:px-6 py-4 border-t shrink-0"
  style={{
    borderColor: PRIMARY_COLORS_V28.slate200,
    background: PRIMARY_COLORS_V28.white,
  }}
>
  {/* Footer Content */}
</div>
```

**Eigenschaften:**

- **Position:** Fixed (shrink-0)
- **Padding:** Mobile: `px-4 py-4`, Desktop: `px-6 py-4`
- **Border:** 1px solid slate200 (oben)
- **Background:** White (wie Container)

**Button-Layout:**

```tsx
<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
  {/* Primary Button */}
  <Button
    className="flex-1 min-h-[44px] text-sm sm:text-base font-semibold rounded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    style={{
      background: PRIMARY_COLORS_V28.slate900,
      color: PRIMARY_COLORS_V28.white,
    }}
  >
    Primary Action
  </Button>

  {/* Secondary Button */}
  <Button
    variant="outline"
    className="min-h-[44px] text-sm sm:text-base font-semibold rounded transition-all duration-300 hover:-translate-y-0.5"
    style={{
      borderColor: PRIMARY_COLORS_V28.slate200,
      color: PRIMARY_COLORS_V28.slate900,
    }}
  >
    Secondary Action
  </Button>
</div>
```

---

## 📦 WIEDERVERWENDBARE PATTERNS

### Pattern 1: Info Card (Body Section)

```tsx
<div
  className="rounded-lg p-3 sm:p-4 border shadow-sm transition-all duration-300"
  style={{
    background: PRIMARY_COLORS_V28.white,
    borderColor: PRIMARY_COLORS_V28.slate200,
  }}
>
  <div className="text-xl sm:text-2xl font-bold" style={{ color: PRIMARY_COLORS_V28.slate900 }}>
    Value
  </div>
  <div className="text-[10px] sm:text-xs mt-1" style={{ color: PRIMARY_COLORS_V28.slate600 }}>
    Label
  </div>
</div>
```

**Verwendung:** Statistiken, Limits, Key-Values

### Pattern 2: Feature Item (mit Icon)

```tsx
<div
  className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
  style={{
    background: PRIMARY_COLORS_V28.white,
    borderColor: PRIMARY_COLORS_V28.slate200,
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = PRIMARY_COLORS_V28.primary;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = PRIMARY_COLORS_V28.slate200;
  }}
>
  <Check
    className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5"
    style={{ color: PRIMARY_COLORS_V28.accent }}
  />
  <div className="flex-1 min-w-0">
    <div className="text-xs sm:text-sm font-medium" style={{ color: PRIMARY_COLORS_V28.slate900 }}>
      Feature Name
    </div>
    <div className="text-[10px] sm:text-xs mt-1" style={{ color: PRIMARY_COLORS_V28.slate600 }}>
      Feature Description
    </div>
  </div>
</div>
```

**Verwendung:** Feature-Listen, Checklisten, Benefits

### Pattern 3: Disabled/Excluded Item

```tsx
<div
  className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg opacity-60"
  style={{
    background: PRIMARY_COLORS_V28.slate100,
  }}
>
  <X
    className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5"
    style={{ color: PRIMARY_COLORS_V28.slate300 }}
  />
  <div className="flex-1 min-w-0">
    <div className="text-xs sm:text-sm" style={{ color: PRIMARY_COLORS_V28.slate600 }}>
      Excluded Feature
    </div>
  </div>
</div>
```

**Verwendung:** Nicht verfügbare Features, Disabled Items

### Pattern 4: Highlight Card (Accent)

```tsx
<div
  className="rounded-lg p-3 sm:p-4 border shadow-sm transition-all duration-300"
  style={{
    background: PRIMARY_COLORS_V28.accentLight,
    borderColor: PRIMARY_COLORS_V28.accent,
  }}
>
  <div className="text-xl sm:text-2xl font-bold" style={{ color: PRIMARY_COLORS_V28.accent }}>
    Special Value
  </div>
  <div className="text-[10px] sm:text-xs mt-1" style={{ color: PRIMARY_COLORS_V28.slate600 }}>
    Special Label
  </div>
</div>
```

**Verwendung:** Unlimited, Premium Features, Highlights

---

## 📱 RESPONSIVE BREAKPOINTS

### Mobile (< 640px)

```css
/* Spacing */
padding-x: px-4
padding-y: py-4
gap: gap-2

/* Typography */
title: text-xl
body: text-xs
description: text-[10px]

/* Icons */
icon-size: h-4 w-4

/* Buttons */
min-height: min-h-[44px]  /* Touch Target */
text: text-sm
```

### Tablet (640px - 768px)

```css
/* Spacing */
padding-x: px-6
padding-y: py-6 (Header), py-4 (Body/Footer)
gap: gap-3

/* Typography */
title: text-2xl
body: text-sm
description: text-xs

/* Icons */
icon-size: h-5 w-5

/* Buttons */
min-height: min-h-[44px]
text: text-base
```

### Desktop (> 768px)

```css
/* Grid Layout */
grid: grid-cols-2 (Feature Items)

/* Flexbox */
flex-direction: row (Header, Footer)
```

---

## ⚡ TRANSITIONS & ANIMATIONS

### Standard Transitions

```css
/* All Elements */
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1)

/* Hover Effects */
hover:
  - transform: translateY(-2px)
  - box-shadow: shadow-md
  - border-color: PRIMARY_COLORS_V28.primary
```

### Button Hover Pattern

```typescript
<Button
  className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
  style={{
    background: PRIMARY_COLORS_V28.slate900,
    color: PRIMARY_COLORS_V28.white,
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = PRIMARY_COLORS_V28.primary;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = PRIMARY_COLORS_V28.slate900;
  }}
>
  Button Text
</Button>
```

---

## ♿ ACCESSIBILITY

### Keyboard Navigation

```typescript
// Dialog schließen mit ESC
<Dialog onOpenChange={onOpenChange}>
  {/* Content */}
</Dialog>

// Focus Trap innerhalb Dialog
// Automatisch durch RadixUI Dialog
```

### ARIA Labels

```tsx
// Dialog Title (required)
<DialogTitle>Accessible Title</DialogTitle>

// Dialog Description (recommended)
<DialogDescription>Accessible Description</DialogDescription>

// Button Labels
<Button aria-label="Close dialog">
  Close
</Button>
```

### Touch Targets

```css
/* Minimum Touch Target Size: 44x44px */
min-h-[44px]  /* Alle interaktiven Elemente */
```

---

## 🔧 IMPLEMENTATION GUIDE

### Step 1: Import Dependencies

```typescript
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PRIMARY_COLORS_V28 } from "@/lib/design-system/unified-design-tokens-v28";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles } from "lucide-react";
```

### Step 2: Setup State

```typescript
interface MyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // ... weitere Props
}

export function MyDialog({ open, onOpenChange, ... }: MyDialogProps) {
  // ... Component Logic
}
```

### Step 3: Implement Structure

```tsx
return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      className="max-w-3xl max-h-[90vh] p-0 overflow-hidden rounded-2xl border shadow-lg"
      style={{
        borderColor: PRIMARY_COLORS_V28.slate200,
        background: PRIMARY_COLORS_V28.white,
      }}
    >
      {/* Header */}
      <DialogHeader
        className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b shrink-0"
        style={{ borderColor: PRIMARY_COLORS_V28.slate200 }}
      >
        {/* Header Content */}
      </DialogHeader>

      {/* Body */}
      <div
        className="px-4 sm:px-6 py-4 overflow-y-auto flex-1"
        style={{ background: PRIMARY_COLORS_V28.slate50 }}
      >
        {/* Body Content */}
      </div>

      {/* Footer */}
      <div
        className="px-4 sm:px-6 py-4 border-t shrink-0"
        style={{
          borderColor: PRIMARY_COLORS_V28.slate200,
          background: PRIMARY_COLORS_V28.white,
        }}
      >
        {/* Footer Content */}
      </div>
    </DialogContent>
  </Dialog>
);
```

---

## 📋 QUALITY CHECKLIST

```
□ Container: rounded-2xl, border slate200, shadow-lg?
□ Header: Fixed (shrink-0), border-b slate200?
□ Body: Scrollable (overflow-y-auto, flex-1), bg slate50?
□ Footer: Fixed (shrink-0), border-t slate200?
□ Mobile-First: px-4/px-6, text-xs/text-sm responsive?
□ Touch Targets: min-h-[44px] für alle Buttons?
□ Transitions: duration-300, hover:-translate-y-0.5?
□ Colors: PRIMARY_COLORS_V28 verwendet (keine Hex)?
□ Icons: h-4/h-5 responsive?
□ Grid: grid-cols-1 md:grid-cols-2 für Feature-Listen?
□ Accessibility: DialogTitle, DialogDescription vorhanden?
□ Keyboard: ESC zum Schließen funktioniert?
```

---

## 🎯 BEISPIELE

### Referenz-Implementation

**TariffFeatureDialog.tsx** - Vollständige Implementierung aller Patterns:

```
src/components/pricing/TariffFeatureDialog.tsx
```

**Zeigt:**

- ✅ Header mit Icon Box + Title + Badge
- ✅ Scrollable Body mit slate50 Background
- ✅ Info Cards (Limits & Kapazitäten)
- ✅ Feature Items mit Hover-Effects
- ✅ Excluded Items (opacity + slate100)
- ✅ Footer mit Primary/Secondary Buttons
- ✅ Vollständig responsive (Mobile → Desktop)

---

## 📝 CHANGELOG

### V28.1 (2025-10-28) - Initial Release

- ✅ V28.1 Design System etabliert
- ✅ Professional Gray-Blue Farben
- ✅ Flat Design mit rounded-2xl Container
- ✅ Mobile-First & Tablet-Responsive
- ✅ Wiederverwendbare Patterns definiert
- ✅ Accessibility Guidelines etabliert
- ✅ TariffFeatureDialog als Referenz-Implementation

---

**Autor:** Lovable AI Agent  
**Review:** Ibrahim (Design Owner)  
**Status:** ✅ APPROVED & PRODUCTION-READY  
**Letzte Aktualisierung:** 2025-10-28

---

_Dieses Dokument definiert das Standard-PopUp-System für MyDispatch V28.1. Alle neuen Dialogs MÜSSEN diesem Pattern folgen._
