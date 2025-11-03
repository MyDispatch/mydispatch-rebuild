# 🎨 MyDispatch Design System V18.3.28 - Corporate Standard

**Status:** Production-Ready  
**Letzte Aktualisierung:** 2025-10-21  
**Verantwortlich:** Senior Systemarchitekt

---

## 📋 INHALTSVERZEICHNIS

1. [Farbsystem](#farbsystem)
2. [Typografie-System](#typografie-system)
3. [Icon-System](#icon-system)
4. [Layout-System](#layout-system)
5. [Spacing-System](#spacing-system)
6. [Komponenten-Bibliothek](#komponenten-bibliothek)
7. [Animations-System](#animations-system)
8. [Responsive Design](#responsive-design)

---

## 🎨 FARBSYSTEM

### Corporate Identity Farben

```css
/* MyDispatch CI Colors - HSL-basiert */
--primary: 40 31% 88%;           /* #EADEBD - Beige/Gold (MyDispatch Hauptfarbe) */
--primary-foreground: 225 31% 28%; /* #323D5E - Dunkelblau (Kontrast) */
--primary-glow: 40 41% 93%;      /* Hellere Variante für Highlights */

--foreground: 225 31% 28%;       /* #323D5E - Haupttext */
--background: 0 0% 100%;         /* #FFFFFF - Hintergrund */

--secondary: 40 8% 95%;          /* Helle Sekundärfarbe */
--muted: 40 8% 95%;              /* Gedämpfte Hintergründe */
```

### Status-Farben (Ampelsystem)

**KRITISCH:** Nur für Status-Badges verwenden, NIEMALS für Icons!

```css
--status-success: 142 76% 36%;   /* Grün - Erfolg */
--status-warning: 48 96% 53%;    /* Gelb - Warnung */
--status-error: 0 84% 60%;       /* Rot - Fehler */
```

### Chart-Farben (Datenvisualisierung)

```css
--chart-primary: 31 26% 45%;     /* #9B7D57 - Hauptlinie */
--chart-secondary: 40 31% 70%;   /* #D4C5A3 - Sekundärlinie */
--chart-tertiary: 31 26% 55%;    /* #B89368 - Dritte Linie */
--chart-grid: 40 12% 88%;        /* Grid-Linien */
```

### Verwendungsregeln

✅ **RICHTIG:**
- `bg-primary` für Hauptelemente
- `text-foreground` für Texte auf hellem Hintergrund
- `text-status-success` für Status-Badges

❌ **FALSCH:**
- Direkte Farben: `text-white`, `bg-black`
- Ampelfarben auf Icons: `text-green-500` auf `<Icon />`
- Hex-Codes: `#FFFFFF`, `rgb(255,255,255)`

---

## 📝 TYPOGRAFIE-SYSTEM

### Schriftarten

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Inter Features:**
- `font-feature-settings: 'cv11', 'ss01'`
- `-webkit-font-smoothing: antialiased`
- Variable Font (opsz: 32)

### Fluid Typography (Responsive)

```css
--font-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);    /* 12px → 14px */
--font-sm: clamp(0.875rem, 0.825rem + 0.25vw, 1rem);     /* 14px → 16px */
--font-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);    /* 16px → 18px */
--font-lg: clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem);  /* 18px → 20px */
--font-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);      /* 20px → 24px */
--font-2xl: clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem);   /* 24px → 30px */
--font-3xl: clamp(1.875rem, 1.65rem + 1.125vw, 2.25rem); /* 30px → 36px */
--font-4xl: clamp(2.25rem, 1.95rem + 1.5vw, 3rem);       /* 36px → 48px */
--font-5xl: clamp(3rem, 2.55rem + 2.25vw, 4rem);         /* 48px → 64px */
```

### Typography Classes

```tsx
.text-display       // Display-Text (Hero-Headlines)
.text-heading-1     // H1 - Hauptüberschriften
.text-heading-2     // H2 - Sektionsüberschriften
.text-heading-3     // H3 - Unterüberschriften
.text-body-lg       // Großer Fließtext
.text-body          // Standard-Fließtext
.text-body-sm       // Kleiner Text (Captions)
```

### Textumbruch-System (DIN 5008)

```css
/* Standard: Deutsche Silbentrennung */
hyphens: auto;
hyphenate-limit-chars: 6 3 3; /* Min. 6 Zeichen, mind. 3 vor/nach Trennung */

/* Utility-Klassen */
.hero-text-no-hyphens         // Keine Silbentrennung (Hero-Texte)
.marketing-text-soft-hyphens  // Sanfte Trennung (8 4 4)
.body-text-hyphens            // Standard-Trennung (6 3 3)
.text-nowrap-important        // Kein Umbruch + Ellipsis
```

---

## 🎯 ICON-SYSTEM

### Standardisierung (Lucide React)

**Anzahl:** 170+ Komponenten verwenden Lucide Icons  
**Library:** `lucide-react` (tree-shakeable ES Modules)

### Icon-Verwendung

```tsx
import { Camera, User, Settings } from 'lucide-react';

// Standard-Icon (24px)
<Camera className="h-4 w-4 text-foreground" />

// Große Icons (Header, Hero)
<User className="h-6 w-6 text-foreground" />

// Button-Icons
<Button>
  <Settings className="h-4 w-4 mr-2" />
  Einstellungen
</Button>
```

### Icon-Größen-System

| Größe | Class | Pixel | Verwendung |
|-------|-------|-------|------------|
| XS | `h-3 w-3` | 12px | Inline-Text, Badges |
| SM | `h-4 w-4` | 16px | Buttons, Listen |
| MD | `h-5 w-5` | 20px | Cards, Navigation |
| LG | `h-6 w-6` | 24px | Headers, Hero |
| XL | `h-8 w-8` | 32px | Large Actions |
| 2XL | `h-10 w-10` | 40px | Feature Icons |

### Farbregeln für Icons

✅ **RICHTIG:**
```tsx
// Foreground auf hellem Hintergrund
<Icon className="text-foreground" />

// Primary für Akzente
<Icon className="text-primary" />

// Muted für sekundäre Icons
<Icon className="text-muted-foreground" />
```

❌ **FALSCH:**
```tsx
// NIEMALS Ampelfarben auf Icons (außer Status-Badges)
<Icon className="text-green-500" />   // ❌
<Icon className="text-red-500" />     // ❌
<Icon className="text-yellow-500" />  // ❌
```

### Dynamische Icon-Komponente

```tsx
// src/components/design-system/Icon.tsx
import { icons, LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof icons;
  className?: string;
}

export const Icon = ({ name, className, ...props }: IconProps) => {
  const LucideIcon = icons[name];
  return <LucideIcon className={cn("h-4 w-4", className)} {...props} />;
};

// Verwendung
<Icon name="Camera" className="text-foreground" />
```

---

## 📐 LAYOUT-SYSTEM

### Grid-System

```tsx
// Container
<div className="container mx-auto px-4 sm:px-6 lg:px-8" />

// Grid-Layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />
```

### Breakpoints

```css
sm: 640px   // Tablet Portrait
md: 768px   // Tablet Landscape
lg: 1024px  // Desktop
xl: 1280px  // Large Desktop
2xl: 1536px // Extra Large
```

### Master-Template-Struktur

Basierend auf Dashboard/Aufträge/Finanzen:

```tsx
<PageLayout>
  <PageHeader>
    <PageHeaderWithKPIs 
      title="Seitentitel"
      kpis={[...]}
    />
  </PageHeader>
  
  <PageContent className="space-y-6">
    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard {...} />
    </div>
    
    {/* Main Content */}
    <Card>
      <CardHeader>
        <CardTitle>Abschnitt</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Content */}
      </CardContent>
    </Card>
  </PageContent>
</PageLayout>
```

---

## 📏 SPACING-SYSTEM (4px Grid)

### Spacing-Scale

```
0: 0px      // Kein Abstand
1: 4px      // Extra klein
2: 8px      // Klein
3: 12px     // Klein-Medium
4: 16px     // Medium (Standard)
5: 20px     // Medium-Groß
6: 24px     // Groß
8: 32px     // Extra groß
10: 40px    // 2XL
12: 48px    // 3XL
16: 64px    // 4XL
20: 80px    // 5XL
```

### Verwendung

```tsx
// Padding
<div className="p-4">        // 16px rundum
<div className="px-6 py-4">  // 24px horizontal, 16px vertikal

// Margin
<div className="mt-6 mb-4">  // 24px oben, 16px unten

// Gap (Flexbox/Grid)
<div className="flex gap-4">  // 16px zwischen Items
<div className="space-y-6">   // 24px zwischen Kindern (vertikal)
```

---

## 🧩 KOMPONENTEN-BIBLIOTHEK (Labary-System)

### Basis-Komponenten

```
@/components/ui/
├── button.tsx          // Buttons (variants: default, outline, ghost, destructive)
├── card.tsx            // Cards (Header, Content, Footer)
├── dialog.tsx          // Modal-Dialoge
├── sheet.tsx           // Slide-out Panels
├── input.tsx           // Form-Inputs
├── select.tsx          // Dropdowns
├── checkbox.tsx        // Checkboxen
├── radio-group.tsx     // Radio-Buttons
├── switch.tsx          // Toggles
├── badge.tsx           // Status-Badges
├── avatar.tsx          // User-Avatare
├── tooltip.tsx         // Tooltips
├── toast.tsx           // Benachrichtigungen
├── progress.tsx        // Fortschrittsbalken
├── separator.tsx       // Trennlinien
└── scroll-area.tsx     // Scrollbare Bereiche
```

### Design-System-Komponenten

```
@/components/design-system/
├── HeroSection.tsx          // Hero-Bereiche (Landing)
├── KPICard.tsx              // KPI-Anzeige (Dashboard)
├── QuickActions.tsx         // Quick-Action-Buttons
├── ResponsiveBadge.tsx      // Responsive Badges
├── Icon.tsx                 // Dynamische Icon-Komponente (NEU)
└── index.ts                 // Barrel Export
```

---

## ✨ ANIMATIONS-SYSTEM

### Transitions

```css
--transition-base: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-smooth: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
```

### Utility-Klassen

```tsx
.hover-lift         // translateY(-4px) + Shadow
.hover-scale        // scale(1.02)
.hover-glow         // Shadow-Glow-Effekt
.interactive-hover  // Subtile Bg-Change
.smooth-hover       // Pseudo-Element-Overlay
.card-hover         // Card-Scale + Shadow
```

### Keyframe-Animationen

```tsx
.animate-fade-in           // Fade + Slide
.animate-scale-in          // Scale + Fade
.animate-slide-in-right    // Slide from Right
.animate-bounce-subtle     // Subtiles Bounce
.animate-pulse-glow        // Glow-Pulsieren
```

---

## 📱 RESPONSIVE DESIGN

### Mobile-First-Ansatz

```tsx
// Mobile (Default)
<div className="text-sm p-4">

// Tablet
<div className="md:text-base md:p-6">

// Desktop
<div className="lg:text-lg lg:p-8">
```

### Touch-Optimierung

```tsx
// Touch-Targets mind. 44x44px
<Button className="min-h-[44px] min-w-[44px]" />

// Mobile-spezifische UI
<div className="block md:hidden">Mobile Menu</div>
<div className="hidden md:block">Desktop Menu</div>
```

### Responsive Typography

Alle Schriftgrößen verwenden `clamp()` für flüssige Skalierung:

```css
/* Automatische Anpassung zwischen Mobile & Desktop */
font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
```

---

## 📐 SHADOWS & EFFECTS

### Shadow-System

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--shadow-elegant: 0 10px 30px -10px rgba(50, 61, 94, 0.3);
--shadow-glow: 0 0 40px rgba(234, 222, 189, 0.4);
```

### Verwendung

```tsx
<Card className="shadow-md hover:shadow-lg" />
<div className="shadow-elegant" />
```

---

## ✅ QUALITÄTSREGELN

### Code-Style

```tsx
// ✅ RICHTIG
<Button variant="default" className="shadow-md">
  <Icon name="Plus" className="mr-2 h-4 w-4" />
  Hinzufügen
</Button>

// ❌ FALSCH
<button style={{ background: '#EADEBD' }}>
  <i class="icon-plus"></i>
  Hinzufügen
</button>
```

### Accessibility

```tsx
// Alt-Texte für Bilder
<img src="..." alt="Beschreibender Text" />

// ARIA-Labels für Icon-Buttons
<Button aria-label="Einstellungen öffnen">
  <Settings className="h-4 w-4" />
</Button>

// Touch-Targets (44x44px minimum)
<Button className="min-h-[44px] min-w-[44px]" />
```

---

## 🔍 CHECKLISTE: DESIGN-SYSTEM-KONFORMITÄT

- [ ] Alle Farben aus CSS-Variablen (`hsl(var(--primary))`)
- [ ] Keine direkten Farben (`text-white`, `#FFFFFF`)
- [ ] Icons aus Lucide React
- [ ] Icon-Größen aus System (`h-4 w-4`)
- [ ] Spacing auf 4px-Grid
- [ ] Typography aus Fluid-Scale
- [ ] Komponenten aus Labary-System
- [ ] Hover-Effects aus Utility-Klassen
- [ ] Touch-Targets mind. 44x44px
- [ ] Responsive Breakpoints verwendet

---

## 📚 DOKUMENTATION & UPDATES

**Letzte Updates:**
- V18.3.28: Icon-System-Dokumentation, Dynamische Icon-Komponente
- V18.3.27: XSS-Prävention, Sanitization-System
- V15.0: Initial Design System (HSL-basiert)

**Verantwortlich:** Senior Systemarchitekt  
**Review-Zyklus:** Bei jedem Major Feature  
**Nächstes Review:** Nach Phase 3C (Content-Management-System)
