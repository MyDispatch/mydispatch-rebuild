# CORPORATE IDENTITY HANDBUCH V18.5.0

> **MyDispatch - simply arrive**  
> Premium Taxi- & Mietwagen-Dispatch-System  
> **Gültig ab:** 2025-01-15  
> **Status:** ✅ VERBINDLICH - Systemweite Vorgabe

---

## 📋 INHALTSVERZEICHNIS

1. [Logo & Marke](#logo--marke)
2. [Farbsystem](#farbsystem)
3. [Typografie](#typografie)
4. [Icon-System](#icon-system)
5. [Spacing & Layout](#spacing--layout)
6. [Komponenten-Styling](#komponenten-styling)
7. [Animationen & Effekte](#animationen--effekte)
8. [Responsive Design](#responsive-design)
9. [Barrierefreiheit](#barrierefreiheit)

---

## 🎨 LOGO & MARKE

### **Haupt-Logo**

**Datei:** `src/assets/mydispatch-logo-official.png`

**Verwendung:**

```typescript
import officialLogo from '@/assets/mydispatch-logo-official.png';

<img
  src={officialLogo}
  alt="MyDispatch - simply arrive"
  width="140"
  height="37"
  className="h-8 max-w-[160px] object-contain drop-shadow-sm"
/>
```

**Maße:**

- **Desktop:** 140×37px (h-8, max-w-[160px])
- **Mobile:** 120×32px (h-6, max-w-[120px])

**Schutzraum:** Mind. 8px Abstand zu anderen Elementen

### **Logo-Varianten**

#### **1. Sidebar-Logo (Collapsed)**

```typescript
// Initialen-Badge (64px Sidebar)
<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
  <span className="text-sm font-bold text-primary-foreground">MD</span>
</div>
```

#### **2. Sidebar-Logo (Expanded)**

```typescript
// 240px Sidebar
<div className="flex items-center gap-2 px-4 animate-fade-in">
  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
    <span className="text-xs font-bold text-primary-foreground">MD</span>
  </div>
  <span className="text-base font-bold text-foreground tracking-tight">
    MyDispatch
  </span>
</div>
```

#### **3. Company-Logo (Header)**

```typescript
// Wenn company.logo_url existiert
company?.logo_url ? (
  <img
    src={company.logo_url}
    alt={company.name || 'Logo'}
    width="149"
    height="40"
    className="h-8 max-w-[160px] object-contain drop-shadow-sm"
  />
) : (
  // Fallback: Unternehmensname
  <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight drop-shadow-sm">
    {company?.name || 'MyDispatch'}
  </span>
)
```

### **Slogan**

**Primär:** "simply arrive"  
**Sekundär:** "MyDispatch - Die moderne Disponenten-Lösung"  
**Verwendung:** Footer, Hero-Sections, Meta-Descriptions

---

## 🎨 FARBSYSTEM

### **Basis-Farben (HSL)**

#### **Primary (Beige/Gold) - #EADEBD**

```css
--primary: 40 31% 88%; /* hsl(40, 31%, 88%) */
--primary-foreground: 225 31% 28%; /* #323D5E (Dunkelblau) */
--primary-glow: 40 41% 93%; /* Hellere Variante */
```

**Verwendung:**

- Header-Hintergrund (Gradient)
- Sidebar-Hintergrund
- Primary Buttons
- Hover-States auf hellen Hintergründen
- Akzent-Elemente

**Tailwind-Klassen:**

```css
bg-primary
text-primary-foreground
border-primary
hover:bg-primary/90
```

#### **Foreground (Dunkelblau) - #323D5E**

```css
--foreground: 225 31% 28%; /* hsl(225, 31%, 28%) */
```

**Verwendung:**

- Haupt-Textfarbe
- Icons (default)
- Überschriften
- Button-Text auf hellem Hintergrund

**Tailwind-Klassen:**

```css
text-foreground
border-foreground
```

#### **Background (Weiß) - #FFFFFF**

```css
--background: 0 0% 100%; /* hsl(0, 0%, 100%) */
```

**Verwendung:**

- Seiten-Hintergrund
- Card-Hintergrund
- Dialogs, Modals

#### **Muted (Hellgrau)**

```css
--muted: 40 8% 95%; /* hsl(40, 8%, 95%) */
--muted-foreground: 225 20% 50%; /* hsl(225, 20%, 50%) */
```

**Verwendung:**

- Sekundäre Hintergründe
- Disabled States
- Platzhalter-Texte
- Beschreibungstexte

**Tailwind-Klassen:**

```css
bg-muted
text-muted-foreground
hover:bg-muted/50
```

### **Status-Farben (Ampel-System)**

#### **Success (Grün) - Echtes Ampel-Grün**

```css
--status-success: 142 76% 36%; /* hsl(142, 76%, 36%) */
--status-success-foreground: 0 0% 100%; /* Weiß */
```

**Verwendung:**

- Status "Verfügbar" (Fahrer)
- Bezahlte Rechnungen
- Erfolgs-Meldungen
- Bestätigte Aufträge

**Tailwind-Klassen:**

```css
bg-status-success
text-status-success-foreground
border-status-success
border-status-success/20 bg-status-success/5 /* Subtile Hervorhebung */
```

#### **Warning (Gelb) - Echtes Ampel-Gelb**

```css
--status-warning: 48 96% 53%; /* hsl(48, 96%, 53%) */
--status-warning-foreground: 0 0% 0%; /* Schwarz */
```

**Verwendung:**

- Status "Ausstehend"
- Ablaufende Dokumente
- Warnungen
- Offene Rechnungen

**Tailwind-Klassen:**

```css
bg-status-warning
text-status-warning-foreground
border-status-warning
border-status-warning/20 bg-status-warning/5
```

#### **Error (Rot) - Echtes Ampel-Rot**

```css
--status-error: 0 84% 60%; /* hsl(0, 84%, 60%) */
--status-error-foreground: 0 0% 100%; /* Weiß */
```

**Verwendung:**

- Status "Storniert"
- Überfällige Rechnungen
- Fehler-Meldungen
- Abgelaufene Dokumente

**Tailwind-Klassen:**

```css
bg-status-error
text-status-error-foreground
border-status-error
border-status-error/20 bg-status-error/5
```

### **Portal-Farben**

#### **Fahrer-Portal**

```css
--portal-fahrer: 220 14% 96%; /* Helles Blau-Grau */
--portal-fahrer-foreground: 225 31% 28%;
```

#### **Kunden-Portal**

```css
--portal-kunde: 40 8% 98%; /* Extra-helles Beige */
--portal-kunde-foreground: 225 31% 28%;
```

#### **Öffentliche Landingpages**

```css
--portal-public: 0 0% 100%; /* Weiß */
--portal-public-foreground: 225 31% 28%;
```

### **Chart-Farben (Datenvisualisierung)**

```css
--chart-primary: 31 26% 45%; /* #9B7D57 - Helleres Braun/Gold */
--chart-secondary: 40 31% 70%; /* #D4C5A3 - Mittleres Beige */
--chart-tertiary: 31 26% 55%; /* #B89368 - Mittleres Braun */
--chart-grid: 40 12% 88%; /* Identisch zu --border */
```

**Verwendung in Recharts:**

```typescript
<Line dataKey="revenue" stroke="hsl(var(--chart-primary))" />
<Bar dataKey="bookings" fill="hsl(var(--chart-secondary))" />
<YAxis stroke="hsl(var(--chart-grid))" />
```

### **Gradients**

#### **Primary Gradient**

```css
--gradient-primary: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-glow)) 100%);
```

**Verwendung:**

```css
bg-gradient-to-r from-primary via-primary to-primary/95
```

#### **Hero Gradient**

```css
--gradient-hero: linear-gradient(180deg, rgba(234, 222, 189, 0.1) 0%, rgba(50, 61, 94, 0.05) 100%);
```

### **Shadows**

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--shadow-elegant: 0 10px 30px -10px rgba(50, 61, 94, 0.3);
--shadow-glow: 0 0 40px rgba(234, 222, 189, 0.4);
```

**Tailwind-Klassen:**

```css
shadow-sm
shadow-md
shadow-lg
shadow-xl
shadow-2xl
shadow-elegant /* Premium-Shadow */
shadow-glow    /* Glow-Effekt */
```

---

## ✍️ TYPOGRAFIE

### **Schriftarten**

#### **Primary Font: Inter**

```css
font-family:
  "Inter",
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Roboto,
  "Helvetica Neue",
  Arial,
  sans-serif;

/* OpenType Features */
font-feature-settings: "cv11", "ss01";
font-variation-settings: "opsz" 32;

/* Rendering */
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

**Verwendung:** Alle UI-Texte, Buttons, Formulare

#### **Secondary Font: Playfair Display** (optional für Headlines)

```css
font-family: "Playfair Display", Georgia, serif;
```

**Verwendung:** Hero-Headlines, Marketing-Texte

#### **Monospace: SF Mono**

```css
font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace;
```

**Verwendung:** Code-Snippets, technische Daten, API-Responses

### **Fluid Typography (clamp)**

```css
/* Responsive Font-Sizes */
--font-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem); /* 12px → 14px */
--font-sm: clamp(0.875rem, 0.825rem + 0.25vw, 1rem); /* 14px → 16px */
--font-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem); /* 16px → 18px */
--font-lg: clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem); /* 18px → 20px */
--font-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem); /* 20px → 24px */
--font-2xl: clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem); /* 24px → 30px */
--font-3xl: clamp(1.875rem, 1.65rem + 1.125vw, 2.25rem); /* 30px → 36px */
--font-4xl: clamp(2.25rem, 1.95rem + 1.5vw, 3rem); /* 36px → 48px */
--font-5xl: clamp(3rem, 2.55rem + 2.25vw, 4rem); /* 48px → 64px */
```

### **Utility-Klassen**

```css
/* Display (Hero-Titel) */
.text-display {
  font-size: var(--font-5xl); /* 48px → 64px */
  line-height: 1.1;
  font-weight: 800;
}

/* Headings */
.text-heading-1 {
  font-size: var(--font-4xl); /* 36px → 48px */
  line-height: 1.2;
  font-weight: 700;
}

.text-heading-2 {
  font-size: var(--font-3xl); /* 30px → 36px */
  line-height: 1.25;
  font-weight: 700;
}

.text-heading-3 {
  font-size: var(--font-2xl); /* 24px → 30px */
  line-height: 1.3;
  font-weight: 600;
}

/* Body */
.text-body-lg {
  font-size: var(--font-lg); /* 18px → 20px */
  line-height: 1.6;
}

.text-body {
  font-size: var(--font-base); /* 16px → 18px */
  line-height: 1.6;
}

.text-body-sm {
  font-size: var(--font-sm); /* 14px → 16px */
  line-height: 1.5;
}
```

### **Tailwind-Klassen (Standard)**

```css
/* Headlines */
text-3xl font-bold               /* Dashboard-Titel */
text-2xl font-semibold           /* KPI-Card Values */
text-xl font-medium              /* Section-Titel */
text-lg font-semibold            /* Card-Titel */

/* Body */
text-base                        /* Standard-Text (16px) */
text-sm                          /* Sekundär-Text (14px) */
text-xs                          /* Meta-Text (12px) */
text-[10px]                      /* Badges, Labels (10px) */

/* Farben */
text-foreground                  /* Haupt-Text */
text-muted-foreground            /* Sekundär-Text */
text-primary-foreground          /* Text auf Primary-BG */
text-status-success              /* Erfolgs-Text */
```

### **Textumbruch-Regeln (DIN 5008)**

```css
/* Systemweite Einstellungen */
body {
  hyphens: auto; /* Deutsche Silbentrennung */
  -webkit-hyphens: auto;
  hyphenate-limit-chars: 6 3 3; /* Min. 6 Zeichen, 3 vor/nach Trennung */
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: normal; /* NICHT break-all! */
}

/* Headlines: Keine Silbentrennung */
h1,
h2,
h3,
h4,
h5,
h6 {
  hyphens: none;
  -webkit-hyphens: none;
}

/* Utility-Klassen */
.hero-text-no-hyphens {
  hyphens: none !important;
  word-break: normal !important;
}

.text-nowrap-important {
  white-space: nowrap !important;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-balance {
  text-wrap: balance; /* Gleichmäßige Zeilenverteilung */
}

.text-pretty {
  text-wrap: pretty; /* Verhindert Witwen/Waisen */
}
```

---

## 🎭 ICON-SYSTEM

### **Icon-Library: Lucide React**

**Installation:**

```bash
npm install lucide-react
```

### **Standard-Icons**

```typescript
import {
  Home, // Dashboard
  FileText, // Aufträge
  Users, // Kunden, Fahrer
  Car, // Fahrzeuge
  Receipt, // Finanzen
  Calendar, // Schichten
  FolderOpen, // Dokumente
  Euro, // Kostenstellen
  Handshake, // Partner
  TrendingUp, // Statistiken
  Settings, // Einstellungen
  MessageSquare, // Kommunikation
  Building2, // Landingpage
  Plus, // Hinzufügen
  Search, // Suche
  Bot, // AI-Support
  LogOut, // Abmelden
  Crown, // Premium-Feature
  Lock, // Gesperrt
  Sparkles, // AI/Magic
  AlertTriangle, // Warnung
  Check, // Erfolg
  Info, // Information
  MapPin, // Standort
  Phone, // Telefon
  Mail, // E-Mail
} from "lucide-react";
```

### **Icon-Größen**

```typescript
// Standard-Größen
const iconSizes = {
  xs: "h-3 w-3", // 12px
  sm: "h-4 w-4", // 16px
  md: "h-5 w-5", // 20px (Standard)
  lg: "h-6 w-6", // 24px
  xl: "h-8 w-8", // 32px
  "2xl": "h-12 w-12", // 48px
};
```

**Verwendung:**

```typescript
<FileText className="h-5 w-5 text-foreground" />
<Users className={cn("h-4 w-4", iconSizes.sm)} />
```

### **Icon-Farben**

```css
/* Standard */
text-foreground             /* Haupt-Icons */
text-muted-foreground       /* Sekundär-Icons */

/* Status */
text-status-success         /* Grüne Icons */
text-status-warning         /* Gelbe Icons */
text-status-error           /* Rote Icons */

/* Interaktiv */
hover:text-foreground       /* Hover auf hellem BG */
hover:text-primary          /* Hover-Akzent */
```

### **Icon-Komponente (Wiederverwendbar)**

```typescript
import { Icon } from '@/components/design-system/Icon';

<Icon name="FileText" size="md" className="text-foreground" />
```

---

## 📐 SPACING & LAYOUT

### **Spacing-System (Tailwind)**

```css
/* Padding */
p-1   /* 4px */
p-2   /* 8px */
p-3   /* 12px */
p-4   /* 16px */  ← Standard für Cards
p-6   /* 24px */  ← Standard für Desktop-Cards
p-8   /* 32px */
p-12  /* 48px */

/* Margin */
m-1 bis m-12 (identisch)

/* Gap (Grid/Flex) */
gap-1  /* 4px */
gap-2  /* 8px */
gap-3  /* 12px */
gap-4  /* 16px */  ← Standard für Mobile
gap-6  /* 24px */  ← Standard für Desktop
gap-8  /* 32px */

/* Space (Stack-Layout) */
space-y-2  /* 8px vertikal */
space-y-4  /* 16px vertikal */
space-y-6  /* 24px vertikal */  ← Standard für Sections
space-y-8  /* 32px vertikal */  ← Standard für Desktop
```

### **Container-Padding**

```css
/* Main Content */
px-4 sm:px-6 lg:px-8   /* 16px → 24px → 32px */
py-6 sm:py-8           /* 24px → 32px */

/* Card Padding */
p-4 sm:p-6             /* 16px → 24px */

/* Dialog Padding */
p-6                    /* 24px (konsistent) */
```

### **Grid-Layouts**

```css
/* KPI-Cards (4-Spalten) */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6

/* Widgets (3-Spalten) */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6

/* Map + Sidebar (3-Spalten) */
grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6
  - Map: lg:col-span-2
  - Sidebar: default (1 Spalte)

/* 2-Spalten Layout */
grid-cols-1 lg:grid-cols-2 gap-6

/* Form-Fields (2-Spalten) */
grid-cols-1 sm:grid-cols-2 gap-4
```

### **Layout-Komponenten**

#### **Sidebar**

```css
/* Collapsed */
w-[64px]
- Logo: 10×10 Badge
- Icons: h-5 w-5

/* Expanded */
w-60 (240px)
- Logo: 8×8 Badge + Text
- Icons: h-5 w-5 + Label
```

#### **Header**

```css
height: 60px (h-16)
left: 64px → 240px (dynamisch)
width: calc(100% - 64px) → calc(100% - 240px)

/* Mobile */
left: 0
width: 100%
```

#### **Footer**

```css
/* Normal */
py-3 (12px)

/* Hover (Expanded) */
py-8 (32px)
opacity: 0 → 1 (Links)
max-height: 0 → 24 (96px)
```

#### **Main Content**

```css
/* Desktop */
margin-left: 64px → 240px (transition)
padding: px-4 sm:px-6 lg:px-8 py-6 sm:py-8

/* Mobile */
margin-left: 0
padding: px-4 py-6
```

---

## 🎨 KOMPONENTEN-STYLING

### **Card**

```typescript
<Card className="border-border hover:shadow-md transition-all">
  <CardHeader className="pb-3">
    <CardTitle className="text-base">Titel</CardTitle>
    <CardDescription className="text-xs text-muted-foreground">Beschreibung</CardDescription>
  </CardHeader>
  <CardContent className="space-y-2">
    {/* Inhalt */}
  </CardContent>
</Card>
```

**Status-Cards:**

```css
/* Success */
border-status-success/20 bg-status-success/5

/* Warning */
border-status-warning/20 bg-status-warning/5

/* Error */
border-status-error/20 bg-status-error/5

/* Upgrade */
border-primary/20 bg-primary/5
```

### **Button**

```typescript
// Variants
<Button variant="default">Primary</Button>      /* bg-primary text-primary-foreground */
<Button variant="outline">Secondary</Button>    /* border-border text-foreground */
<Button variant="ghost">Ghost</Button>          /* hover:bg-muted */
<Button variant="destructive">Löschen</Button>  /* bg-destructive text-destructive-foreground */

// Sizes
<Button size="sm">Klein</Button>      /* h-8 px-3 text-sm */
<Button size="default">Normal</Button> /* h-10 px-4 text-base */
<Button size="lg">Groß</Button>        /* h-12 px-6 text-lg */
```

### **Badge**

```typescript
<Badge variant="outline" className="gap-1 text-[10px] sm:text-xs">
  <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />
  +15%
</Badge>

// Status-Badges
<Badge className="bg-status-success text-status-success-foreground">Verfügbar</Badge>
<Badge className="bg-status-warning text-status-warning-foreground">Ausstehend</Badge>
<Badge className="bg-status-error text-status-error-foreground">Überfällig</Badge>
```

### **StatusIndicator**

```typescript
<StatusIndicator
  status="completed"
  type="booking"
  size="md"
  showLabel={true}
/>
```

**Status-Typen:**

```typescript
// Bookings
'pending' → warning (Gelb)
'confirmed' → success (Grün)
'in_progress' → primary (Blau)
'completed' → success (Grün)
'cancelled' → error (Rot)

// Drivers
'available' → success (Grün)
'busy' → warning (Gelb)
'break' → neutral (Grau)
'offline' → error (Rot)

// Vehicles
'available' → success (Grün)
'im_einsatz' → warning (Gelb)
'wartung' → neutral (Grau)
'defekt' → error (Rot)
```

---

## ✨ ANIMATIONEN & EFFEKTE

### **Transitions**

```css
/* Standard */
--transition-base: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-smooth: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);

/* Tailwind */
transition-all           /* Standard */
transition-colors        /* Nur Farben */
transition-transform     /* Nur Transform */
duration-200             /* 200ms */
duration-300             /* 300ms */
duration-500             /* 500ms */
ease-in-out              /* Smooth */
```

### **Hover-Effekte**

```css
/* Lift */
.hover-lift {
  transition: var(--transition-base);
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

/* Scale */
.hover-scale {
  transition: var(--transition-base);
}
.hover-scale:hover {
  transform: scale(1.02);
}

/* Glow */
.hover-glow:hover {
  box-shadow: var(--shadow-glow);
}

/* Buttons (Standard) */
hover:shadow-md
hover:scale-105
hover:bg-primary/90
```

### **Animations (Keyframes)**

```typescript
// Fade In
<div className="animate-fade-in">
  Inhalt
</div>

// Scale In
<div className="animate-scale-in">
  Dialog
</div>

// Slide In
<div className="animate-slide-in-right">
  Sidebar
</div>

// Bounce
<div className="animate-bounce-subtle">
  Notification
</div>

// Pulse Glow
<div className="animate-pulse-glow">
  Premium-Badge
</div>
```

### **Loading States**

```typescript
// Skeleton Loader
<Card className="animate-pulse">
  <CardContent className="p-6">
    <div className="h-20 bg-muted rounded" />
  </CardContent>
</Card>

// Spinner
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
```

---

## 📱 RESPONSIVE DESIGN

### **Breakpoints**

```css
/* Tailwind Breakpoints */
sm: 640px    /* Small devices (Phones landscape) */
md: 768px    /* Medium devices (Tablets) */
lg: 1024px   /* Large devices (Desktops) */
xl: 1280px   /* Extra large devices */
2xl: 1536px  /* Ultra wide displays */
```

### **Responsive Patterns**

#### **Stack → Grid**

```css
/* Mobile: Vertikal gestapelt */
grid-cols-1

/* Tablet: 2 Spalten */
sm:grid-cols-2

/* Desktop: 4 Spalten */
lg:grid-cols-4
```

#### **Hide/Show**

```css
/* Mobile: Ausblenden */
hidden sm:block      /* Nur ab sm sichtbar */

/* Desktop: Ausblenden */
block lg:hidden      /* Nur bis lg sichtbar */
```

#### **Text-Größen**

```css
/* Responsive Font-Sizes */
text-sm sm:text-base      /* 14px → 16px */
text-xl sm:text-2xl       /* 20px → 24px */
text-2xl sm:text-3xl      /* 24px → 30px */
```

#### **Padding/Margin**

```css
/* Responsive Spacing */
p-4 sm:p-6 lg:p-8         /* 16px → 24px → 32px */
gap-4 lg:gap-6            /* 16px → 24px */
space-y-6 sm:space-y-8    /* 24px → 32px */
```

### **Mobile-First Approach**

```css
/* ❌ FALSCH (Desktop-First) */
<div className="lg:grid-cols-4 md:grid-cols-2 grid-cols-1">

/* ✅ RICHTIG (Mobile-First) */
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

---

## ♿ BARRIEREFREIHEIT

### **WCAG 2.1 AA Compliance**

#### **Kontraste**

```css
/* Mindest-Kontrast: 4.5:1 für Text */

/* ✅ RICHTIG: Ausreichender Kontrast */
text-foreground on bg-background    /* Dunkel auf Hell */
text-white on bg-status-success     /* Weiß auf Grün */
text-primary-foreground on bg-primary /* Dunkel auf Beige */

/* ❌ FALSCH: Zu geringer Kontrast */
text-muted-foreground on bg-muted   /* Grau auf Grau */
text-white on bg-primary            /* Weiß auf Beige */
```

#### **Keyboard-Navigation**

```typescript
// Tab-Index
<button tabIndex={0}>Klickbar</button>

// Focus-Styles
focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2

// Skip-Links
<a href="#main-content" className="sr-only focus:not-sr-only">
  Zum Hauptinhalt
</a>
```

#### **ARIA-Labels**

```typescript
<button aria-label="Auftrag erstellen">
  <Plus className="h-5 w-5" />
</button>

<nav aria-label="Hauptnavigation">
  {/* Sidebar-Menu */}
</nav>

<input aria-describedby="email-hint" />
<span id="email-hint" className="text-xs text-muted-foreground">
  Bitte geben Sie eine gültige E-Mail-Adresse ein
</span>
```

#### **Screen-Reader Only**

```css
/* Utility-Klasse */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## ✅ ZUSAMMENFASSUNG

### **Kern-Prinzipien**

1. **Konsistenz:** Einheitliche Farben, Schriften, Abstände systemweit
2. **Semantic Tokens:** NIEMALS direkte Farben (bg-white, text-black), immer Design-System
3. **Responsive:** Mobile-First, Fluid Typography, Adaptive Layouts
4. **Accessibility:** WCAG 2.1 AA, Keyboard-Navigation, Screen-Reader-Support
5. **Performance:** Optimierte Animationen, Hardware-Acceleration, Code-Splitting
6. **Premium-Qualität:** Hochwertige Shadows, Gradients, Hover-Effects

### **Checkliste für neue Komponenten**

✅ Semantic Tokens verwenden (bg-primary, text-foreground)  
✅ Responsive Breakpoints definieren (sm, md, lg)  
✅ Hover/Focus-States implementieren  
✅ ARIA-Labels hinzufügen  
✅ Keyboard-Navigation testen  
✅ Kontraste prüfen (min 4.5:1)  
✅ Loading/Error-States implementieren  
✅ Fluid Typography verwenden (text-body, text-heading-1)  
✅ Spacing-System nutzen (gap-4, space-y-6, p-4 sm:p-6)  
✅ Icons aus Lucide React importieren

---

**Version:** V18.5.0  
**Letztes Update:** 2025-01-15  
**Autor:** MyDispatch CI-Team  
**Status:** ✅ VERBINDLICH
