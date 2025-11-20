# 🎨 DESIGN SYSTEM V28.1 - PROFESSIONAL MINIMALISM (FINAL)

**Status:** ✅ PRODUCTION - Führendes Design System  
**Letztes Update:** 2025-01-28  
**Gültig für:** Alle neuen Features ab sofort

---

## 🎯 DESIGN-PHILOSOPHIE

**Professional Minimalism** - Moderne, puristische B2B-Ästhetik für Unternehmenskunden.

### Kernprinzipien

1. **Flat Design** - Keine 3D-Effekte, klare Flächen
2. **Subtle Shadows** - Tailwind-Standard-Shadows (sm, lg, xl, 2xl)
3. **Gray-Blue Palette** - Professional, neutral, zeitlos
4. **Spacious Layouts** - Großzügiger Whitespace
5. **Minimal Borders** - 1px oder borderless, nie 2-3px

---

## 🎨 FARBPALETTE V28.1

### Primärfarben (Slate-Based)

```typescript
// Von unified-design-tokens-v28.ts
PRIMARY_COLORS_V28 = {
  // Primary Action Color
  primary: "hsl(215, 16%, 47%)", // slate-600
  primaryHover: "hsl(215, 19%, 35%)", // slate-700

  // Neutral Colors
  slate900: "hsl(222, 47%, 11%)", // Text Primary
  slate800: "hsl(217, 33%, 17%)", // Text Strong
  slate700: "hsl(215, 19%, 35%)", // Buttons
  slate600: "hsl(215, 16%, 47%)", // Text Secondary
  slate500: "hsl(215, 14%, 61%)", // Borders
  slate400: "hsl(215, 16%, 65%)", // Disabled
  slate300: "hsl(215, 16%, 75%)", // Borders Light
  slate200: "hsl(214, 20%, 85%)", // Backgrounds
  slate100: "hsl(214, 32%, 91%)", // Highlighted BG
  slate50: "hsl(210, 40%, 96%)", // Canvas

  // Pure Backgrounds
  white: "hsl(0, 0%, 100%)", // Card BG

  // Glass Effect (optional)
  glass: "hsla(0, 0%, 100%, 0.7)", // Glassmorphism
};
```

### Tailwind-Klassen (Bevorzugt!)

```css
/* Backgrounds */
bg-slate-700    /* Primary Buttons */
bg-slate-100    /* Secondary Buttons, Highlighted Areas */
bg-slate-50     /* Canvas (page background) */
bg-white        /* Cards */

/* Text Colors */
text-slate-900  /* Headlines, Primary Text */
text-slate-700  /* Body Text, Strong */
text-slate-600  /* Secondary Text */
text-slate-400  /* Disabled, Tertiary */

/* Borders */
border-slate-200   /* Standard borders */
border-slate-300   /* Stronger borders */
border-slate-400   /* Ring/Highlight borders */
```

### Status-Farben (Portal Only!)

```css
/* ⚠️ NUR in Portal-Bereichen, NIEMALS auf Marketing-Seiten! */
bg-green-50     /* Success states */
bg-yellow-50    /* Warning states */
bg-red-50       /* Error states */
```

---

## 🧱 KOMPONENTEN-SYSTEM V28.1

### V28Button - Modern Minimalism

```tsx
// src/components/design-system/V28Button.tsx
<V28Button variant="primary" size="lg">
  Jetzt starten
</V28Button>

// Variants:
- primary:   bg-slate-700, text-white (NO BORDER!)
- secondary: bg-slate-100, text-slate-900, border-slate-200 (1px)

// Sizes:
- sm: h-10 px-6 text-sm
- md: h-12 px-8 text-base
- lg: h-14 px-10 text-lg

// Hover: scale-[1.02] + shadow-md
// Focus: ring-2 ring-slate-500
```

### V28Badge - Flat & Clean

```tsx
// src/components/design-system/V28Badge.tsx
<V28Badge variant="primary">-20%</V28Badge>

// Variants:
- primary:   bg-slate-100, border-slate-300, text-slate-800 (1px)
- secondary: bg-slate-50, border-slate-200, text-slate-700 (1px)

// NO 3D effects, NO glow!
```

### V28IconBox - Minimalist Icon Container

```tsx
// src/components/design-system/V28IconBox.tsx
<V28IconBox icon={Rocket} variant="primary" />

// Variants:
- primary:   bg-slate-700, text-white
- secondary: bg-slate-100, text-slate-700

// Border: NONE (borderless)
// Sizes: sm (h-10 w-10), md (h-12 w-12), lg (h-14 w-14)
```

### V28PricingCard - Clean Pricing Display

```tsx
// src/components/pricing/V28PricingCard.tsx
<V28PricingCard
  name="Business"
  price="99€"
  icon={Building2}
  highlighted={true}  // Ring + stronger shadow
  features={[...]}
  ctaVariant="primary"
/>

// Highlighted: ring-2 ring-slate-400, shadow-2xl
// Standard: border-slate-200, shadow-lg
// Hover: scale-[1.01], shadow-2xl
```

### V28ComparisonTable - Flat Table Design

```tsx
// src/components/pricing/V28ComparisonTable.tsx
<V28ComparisonTable features={comparisonData} />

// Header: bg-gradient-to-r from-slate-700 to-slate-800
// Highlighted Column: bg-slate-100 (NO borders!)
// Icons: text-slate-700 (Check), text-slate-400 (X)
// NO shadows on table itself
```

### V28BillingToggle - Clean Toggle Switch

```tsx
// src/components/design-system/V28BillingToggle.tsx
<V28BillingToggle billingPeriod={period} onToggle={setPeriod} discountText="-20%" />

// Container: bg-slate-100, border-slate-200, shadow-lg
// Active Button: bg-white, shadow-md
// Inactive Button: text-slate-600
// Badge: V28Badge integrated
```

---

## 📐 LAYOUT-STANDARDS V28.1

### Section Spacing

```css
/* Standard Section */
py-16 md:py-20 lg:py-24

/* Hero Section */
py-20 md:py-24 lg:py-32

/* Compact Section */
py-12 md:py-16 lg:py-20
```

### Container & Max-Width

```css
/* Standard Container */
container mx-auto px-4 sm:px-6 lg:px-8

/* Content Max-Width */
max-w-7xl   /* Full-width layouts */
max-w-5xl   /* Standard content */
max-w-4xl   /* Centered content */
max-w-3xl   /* Text-heavy content */
```

### Grid Systems

```css
/* 3-Column Cards (Pricing) */
grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10

/* 2-Column Add-Ons */
grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8
```

---

## ✨ SHADOW-SYSTEM V28.1

### Standard Tailwind Shadows (ONLY!)

```css
/* Card Standard */
shadow-lg           /* Base card shadow */
shadow-xl           /* Emphasized card */
shadow-2xl          /* Hero cards, highlighted */

/* Hover Enhancements */
hover:shadow-md     /* Button hover */
hover:shadow-xl     /* Card hover (from lg) */
hover:shadow-2xl    /* Card hover (from xl) */

/* No Custom Shadows! */
❌ drop-shadow-[0_0_40px_rgba(...)]  /* VERBOTEN! */
✅ shadow-xl                         /* RICHTIG! */
```

---

## 🎭 HOVER & INTERACTION V28.1

### Hover-Patterns

```css
/* Buttons */
hover:scale-[1.02] hover:shadow-md

/* Cards */
hover:scale-[1.01] hover:shadow-2xl

/* Links */
hover:text-slate-900 (from slate-600/700)

/* NO glow effects, NO transform-gpu, keep it simple! */
```

### Transitions

```css
/* Standard */
transition-all duration-200

/* Slow */
transition-all duration-300

/* Fast */
transition-colors duration-150
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints

```typescript
sm: 640px   // Small tablets
md: 768px   // Tablets
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

### Mobile-First Patterns

```css
/* Text Sizes */
text-sm md:text-base lg:text-lg
text-3xl md:text-4xl lg:text-5xl

/* Spacing */
gap-4 md:gap-6 lg:gap-8
p-4 md:p-6 lg:p-8

/* Card Offset (Pricing) */
md:-translate-y-12 lg:-translate-y-16
```

---

## 🚫 VERBOTENE PATTERNS (V26 Legacy)

### ❌ Alte V26 Patterns - NICHT MEHR VERWENDEN!

```css
/* ❌ FALSCH - V26 Colors */
#EADEBD, #323D5E, v26-bg-dunkelblau, v26-text-beige

/* ❌ FALSCH - 3px Borders */
border-[3px], style={{ border: '3px solid ...' }}

/* ❌ FALSCH - Custom Glow Shadows */
drop-shadow-[0_0_40px_...], boxShadow: '0 0 25px ...'

/* ❌ FALSCH - Inset 3D Borders */
box-shadow: inset 0 0 0 3px ...

/* ❌ FALSCH - V26 Components */
V26Button, V26Badge, V26IconBox (mit V26-Styling!)
```

### ✅ Korrekte V28.1 Patterns

```css
/* ✅ RICHTIG - Slate Colors */
bg-slate-700, text-slate-900, border-slate-200

/* ✅ RICHTIG - Standard Borders */
border (1px default) oder borderless

/* ✅ RICHTIG - Tailwind Shadows */
shadow-lg, shadow-xl, shadow-2xl

/* ✅ RICHTIG - Ring für Highlight */
ring-2 ring-slate-400

/* ✅ RICHTIG - V28 Components */
V28Button, V28Badge, V28IconBox (mit V28.1-Styling!)
```

---

## 📋 PRE-COMMIT CHECKLIST V28.1

Vor JEDEM Commit prüfen:

### Design System

- [ ] Nur Slate-Farben verwendet (keine V26 Beige/Dunkelblau)?
- [ ] Tailwind-Shadows verwendet (keine custom glow)?
- [ ] Standard-Borders (1px) oder borderless (keine 2-3px)?
- [ ] V28-Components importiert (nicht V26-Legacy)?

### Code Quality

- [ ] Alle Imports existieren (filesExplorer.md gecheckt)?
- [ ] Keine halluzinierten Funktionen?
- [ ] Alle Props typisiert (kein `any`)?
- [ ] DRY-Principle befolgt (keine Code-Duplication)?

### Responsive

- [ ] Mobile-first Classes verwendet (text-sm md:text-base)?
- [ ] Breakpoints konsistent (sm, md, lg, xl)?
- [ ] Touch-Targets mindestens 44px (h-11 minimum)?

### Accessibility

- [ ] Focus-States definiert (ring-2)?
- [ ] Color-Contrast WCAG AAA (Slate erfüllt das)?
- [ ] Alt-Texte für Icons/Bilder?

---

## 📚 REFERENZ-DATEIEN

### Zentrale Token-Datei

```
src/lib/design-system/unified-design-tokens-v28.ts
```

### V28.1 Components

```
src/components/design-system/V28*.tsx
src/components/pricing/V28*.tsx
```

### Template-Seite

```
src/pages/Pricing.tsx  (✅ REFERENZ-IMPLEMENTIERUNG!)
```

---

## 🔄 MIGRATION VON V26 → V28.1

### Automatische Replacements

```bash
# Colors
s/v26-bg-dunkelblau/bg-slate-700/g
s/v26-bg-beige/bg-slate-100/g
s/v26-text-dunkelblau/text-slate-900/g
s/#323D5E/slate-700/g
s/#EADEBD/slate-100/g

# Borders
s/border-\[3px\]/border/g
s/border-2/border/g

# Shadows
s/drop-shadow-\[.*\]/shadow-xl/g
```

### Manuelle Checks

1. Component-Imports aktualisieren
2. Custom inline-styles entfernen
3. Glow-Effekte durch Tailwind-Shadows ersetzen
4. 3D-Borders durch Ring-Effekte ersetzen

---

**LAST UPDATE:** 2025-01-28  
**MAINTAINED BY:** AI Agent  
**VERSION:** V28.1 FINAL (Production-Ready)
