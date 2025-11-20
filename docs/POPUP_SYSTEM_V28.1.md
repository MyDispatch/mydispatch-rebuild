# 🪟 POPUP SYSTEM V28.1 - SYSTEMWEITE DIALOG-VORLAGE

> **Erstellt:** 2025-01-28  
> **Version:** V28.1  
> **Zweck:** ABSOLUTE Vorgabe für ALLE Popups/Dialogs im System  
> **Status:** ✅ AKTIV & ENFORCEMENT

---

## 🎯 MISSION

**ALLE Popups/Dialogs im System MÜSSEN diese Vorlage nutzen!**

**AUSNAHMEN:**

- ✅ Native Browser-Alerts (confirm, alert, prompt) - NICHT überschreiben
- ✅ System-Toast-Notifications (Sonner)
- ❌ KEINE Custom-Dialogs außerhalb dieser Vorlage!

---

## 📐 V28 DIALOG ANATOMIE

### Struktur (3-Teil-System)

```
┌─────────────────────────────────────────┐
│ HEADER (Fixed)                          │ ← Immer sichtbar
│ - Icon (optional)                       │
│ - Title                                 │
│ - Description (optional)                │
│ - Badge (optional)                      │
│ - Close Button (X)                      │
├─────────────────────────────────────────┤
│ BODY (Scrollable)                       │ ← Scrollbar UNSICHTBAR
│ - Content                               │
│ - Beliebig lang                         │
│ - bg-slate-50                           │
├─────────────────────────────────────────┤
│ FOOTER (Fixed, optional)                │ ← Immer sichtbar
│ - Action Buttons                        │
│ - Cancel/Close Button                   │
└─────────────────────────────────────────┘
```

---

## 🎨 DESIGN TOKENS (V28.1 PFLICHT!)

### Farben

```typescript
import { PRIMARY_COLORS_V28 } from '@/lib/design-system/unified-design-tokens-v28';

// Border & Backgrounds
border: PRIMARY_COLORS_V28.slate200
bg-header: PRIMARY_COLORS_V28.white
bg-body: PRIMARY_COLORS_V28.slate50
bg-footer: PRIMARY_COLORS_V28.white

// Text
text-title: PRIMARY_COLORS_V28.slate900
text-description: PRIMARY_COLORS_V28.slate600
text-content: PRIMARY_COLORS_V28.slate900

// Overlay (Backdrop)
backdrop: PRIMARY_COLORS_V28.slate900 (80% opacity)
backdrop-blur: sm
```

### Spacing

```css
/* Header */
px: 16px (mobile) → 24px (desktop)
pt: 16px (mobile) → 24px (desktop)
pb: 16px

/* Body */
px: 16px (mobile) → 24px (desktop)
py: 16px

/* Footer */
px: 16px (mobile) → 24px (desktop)
py: 16px

/* Gaps */
gap-between-elements: 8px (mobile) → 12px (desktop)
```

### Rounding & Shadows

```css
border-radius: rounded-2xl (16px)
border: 1px solid slate-200
shadow: shadow-lg (Tailwind)
```

### Transitions

```css
duration: 300ms
easing: ease-in-out
backdrop-animation: fade-in/fade-out
content-animation: zoom-in/zoom-out + slide
```

---

## 💻 USAGE PATTERN

### Pattern 1: Einfacher Dialog (ohne Footer)

```tsx
import { V28Dialog } from "@/components/design-system/V28Dialog";
import { Info } from "lucide-react";

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <V28Dialog
      open={open}
      onOpenChange={setOpen}
      title="Information"
      description="Wichtige Details zur Nutzung"
      icon={<Info className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-600">Hier steht der Content des Dialogs...</p>
      </div>
    </V28Dialog>
  );
}
```

### Pattern 2: Dialog mit Actions (Footer)

```tsx
import { V28Dialog } from "@/components/design-system/V28Dialog";
import { V28Button } from "@/components/design-system/V28Button";
import { AlertTriangle } from "lucide-react";

function DeleteConfirmDialog() {
  const [open, setOpen] = useState(false);

  return (
    <V28Dialog
      open={open}
      onOpenChange={setOpen}
      title="Löschen bestätigen"
      description="Diese Aktion kann nicht rückgängig gemacht werden"
      icon={<AlertTriangle className="h-5 w-5" />}
      badge="Warnung"
      actions={
        <>
          <V28Button variant="danger" size="lg" onClick={handleDelete} className="flex-1">
            Löschen
          </V28Button>
          <V28Button variant="secondary" size="lg" onClick={() => setOpen(false)}>
            Abbrechen
          </V28Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-900">Möchten Sie diesen Eintrag wirklich löschen?</p>
      </div>
    </V28Dialog>
  );
}
```

### Pattern 3: Komplexer Dialog (Tariff-Features Beispiel)

```tsx
import { V28Dialog } from "@/components/design-system/V28Dialog";
import { V28Button } from "@/components/design-system/V28Button";
import { Sparkles, Check, X } from "lucide-react";

function TariffDialog({ tariff }) {
  const [open, setOpen] = useState(false);

  return (
    <V28Dialog
      open={open}
      onOpenChange={setOpen}
      title={tariff.name}
      description={tariff.description}
      icon={<Sparkles className="h-5 w-5" />}
      badge={tariff.badge}
      maxWidth="3xl"
      actions={
        <>
          <V28Button variant="primary" size="lg" onClick={handleSelect} className="flex-1">
            {tariff.ctaText}
          </V28Button>
          <V28Button variant="secondary" size="lg" onClick={() => setOpen(false)}>
            Schließen
          </V28Button>
        </>
      }
    >
      {/* Preis-Section */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-slate-900">{tariff.price}</div>
        <div className="text-sm text-slate-600">pro Monat</div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">Enthaltene Features</h3>
        {tariff.features.map((feature) => (
          <div
            key={feature.id}
            className="flex items-start gap-3 p-4 rounded-lg bg-white border border-slate-200"
          >
            <Check className="h-5 w-5 text-accent shrink-0" />
            <div>
              <div className="text-sm font-medium text-slate-900">{feature.name}</div>
              <div className="text-xs text-slate-600 mt-1">{feature.description}</div>
            </div>
          </div>
        ))}
      </div>
    </V28Dialog>
  );
}
```

---

## 📋 PROPS API

### V28Dialog Props

| Prop           | Type                                             | Required | Default | Description                   |
| -------------- | ------------------------------------------------ | -------- | ------- | ----------------------------- |
| `open`         | `boolean`                                        | ✅       | -       | Dialog open state             |
| `onOpenChange` | `(open: boolean) => void`                        | ✅       | -       | Callback when state changes   |
| `title`        | `string`                                         | ✅       | -       | Dialog title                  |
| `description`  | `string`                                         | ❌       | -       | Optional subtitle/description |
| `icon`         | `ReactNode`                                      | ❌       | -       | Optional icon in header       |
| `badge`        | `string`                                         | ❌       | -       | Optional badge text           |
| `children`     | `ReactNode`                                      | ✅       | -       | Body content (scrollable)     |
| `actions`      | `ReactNode`                                      | ❌       | -       | Footer action buttons         |
| `maxWidth`     | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl'` | ❌       | `'lg'`  | Max dialog width              |
| `className`    | `string`                                         | ❌       | -       | Additional CSS classes        |

---

## 🎯 MOBILE-FIRST RESPONSIVE

### Breakpoints

```css
/* Mobile (< 640px) */
- Single column
- Full width (padding: 16px)
- Stack buttons vertically
- Icon size: 40px
- Title: text-xl
- Description: text-sm

/* Tablet/Desktop (≥ 640px) */
- Fixed width (max-w-lg/xl/2xl/3xl)
- Padding: 24px
- Buttons horizontal
- Icon size: 48px
- Title: text-2xl
- Description: text-base
```

### Touch Optimization

```css
/* ALL Interactive Elements */
min-height: 44px  /* Apple HIG minimum */
min-width: 44px
gap: 8px (mobile) → 12px (desktop)

/* Buttons */
padding: 12px 16px (mobile)
padding: 16px 24px (desktop)
```

---

## 🚫 ANTI-PATTERNS

### ❌ Anti-Pattern 1: Custom Dialog außerhalb V28Dialog

```tsx
// FALSCH - Eigene Dialog-Komponente
import { Dialog, DialogContent } from "@/components/ui/dialog";

function MyDialog() {
  return (
    <Dialog>
      <DialogContent className="custom-styles">...</DialogContent>
    </Dialog>
  );
}
```

**✅ RICHTIG:**

```tsx
import { V28Dialog } from "@/components/design-system/V28Dialog";

function MyDialog() {
  return (
    <V28Dialog open={open} onOpenChange={setOpen} title="...">
      ...
    </V28Dialog>
  );
}
```

### ❌ Anti-Pattern 2: Hardcoded Farben

```tsx
// FALSCH
<div style={{ background: '#F1F5F9' }}>
```

**✅ RICHTIG:**

```tsx
import { PRIMARY_COLORS_V28 } from '@/lib/design-system/unified-design-tokens-v28';

<div style={{ background: PRIMARY_COLORS_V28.slate50 }}>
```

### ❌ Anti-Pattern 3: Keine Fixed Header/Footer

```tsx
// FALSCH - Header scrollt mit
<DialogContent>
  <DialogHeader>Title</DialogHeader>
  <div>Content...</div>
  <DialogFooter>Actions</DialogFooter>
</DialogContent>
```

**✅ RICHTIG:** V28Dialog hat automatisch Fixed Header & Footer!

### ❌ Anti-Pattern 4: Sichtbare Scrollbar

```tsx
// FALSCH
<div className="overflow-y-auto">
```

**✅ RICHTIG:**

```tsx
<div className="overflow-y-auto scrollbar-invisible">
```

**CSS (in index.css):**

```css
.scrollbar-invisible {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.scrollbar-invisible::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
```

---

## 🔍 QUALITY CHECKLIST

Vor jedem Dialog-Commit:

### Design Compliance

- [ ] V28Dialog verwendet (NICHT ui/dialog.tsx direkt)
- [ ] PRIMARY_COLORS_V28 für alle Farben
- [ ] rounded-2xl Container
- [ ] shadow-lg
- [ ] border-slate-200

### Struktur

- [ ] Fixed Header mit Title
- [ ] Scrollable Body (bg-slate-50)
- [ ] Fixed Footer (falls Actions)
- [ ] Close Button (X) funktioniert
- [ ] Scrollbar UNSICHTBAR

### Responsive

- [ ] Mobile: Single column, stacked buttons
- [ ] Desktop: Horizontal buttons
- [ ] Touch-Targets min-h-[44px]
- [ ] Padding responsive (16px → 24px)

### Accessibility

- [ ] Title semantisch korrekt
- [ ] Close Button mit sr-only Label
- [ ] Keyboard Navigation (ESC schließt)
- [ ] Focus Management
- [ ] ARIA Labels

### Performance

- [ ] Smooth Animations (300ms)
- [ ] Keine Re-Renders bei Scroll
- [ ] Lazy-Load Content (falls nötig)

---

## 📊 MIGRATION STATUS

### Implementiert in:

- ✅ `src/components/design-system/V28Dialog.tsx` (Master-Komponente)
- ✅ `src/components/pricing/TariffFeatureDialog.tsx` (Referenz-Beispiel)

### Zu migrieren:

- ⏳ Alle bestehenden Dialog-Komponenten im System
- ⏳ Custom Modals in Features
- ⏳ Confirmation Dialogs

### Enforcement:

- ✅ ESLint-Regel: Verbiete ui/dialog.tsx Import (außer in V28Dialog)
- ✅ Pre-Commit Hook: Prüfe auf Custom Dialog-Komponenten
- ✅ Code Review: V28Dialog-Compliance Checklist

---

## 🔗 RELATED DOCUMENTS

- [V28.1 Design System](./DESIGN_SYSTEM_V28.1.md)
- [unified-design-tokens-v28.ts](../src/lib/design-system/unified-design-tokens-v28.ts)
- [Component Library Master Plan](./COMPONENT_LIBRARY_MASTER_PLAN.md)
- [TEXT_ALIGNMENT_SYSTEM_V26.0.md](./TEXT_ALIGNMENT_SYSTEM_V26.0.md)

---

## 🚀 ENFORCEMENT RULES

### ESLint Rule (zu implementieren)

```javascript
// .eslintrc.js
{
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@/components/ui/dialog',
            message: 'Use V28Dialog from @/components/design-system/V28Dialog instead',
            allowTypeImports: true,
          },
        ],
      },
    ],
  },
}
```

### Pre-Commit Hook

```bash
#!/bin/bash
# Check for custom dialog usage

if grep -r "import.*dialog.*from.*@/components/ui/dialog" src/ --exclude-dir=design-system; then
  echo "❌ ERROR: Direct ui/dialog import detected!"
  echo "Use V28Dialog from @/components/design-system/V28Dialog"
  exit 1
fi

echo "✅ Dialog compliance check passed"
```

---

**Version:** V28.1  
**Last Update:** 2025-01-28  
**Maintainer:** NeXify AI Agent  
**Status:** 🟢 ACTIVE & ENFORCED
