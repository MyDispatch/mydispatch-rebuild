# 🎨 MYDISPATCH DESIGN-SYSTEM MASTER V18.3 ULTIMATE

**Datum:** 21.10.2025  
**Version:** V18.3 ULTIMATE  
**Status:** 🔴 KRITISCH - ABSOLUTE SYSTEMWEITE VORGABE  
**Zweck:** Zentrale Single Source of Truth für ALLE Design-, Layout-, Format- und Architektur-Entscheidungen

---

## 📋 EXECUTIVE SUMMARY

Dieses Dokument definiert die **ABSOLUTE WAHRHEIT** für das gesamte MyDispatch-System. Jede Code-Änderung, jede Komponente, jede Farbe MUSS diesem System folgen.

### 🎯 Kernziele

1. **100% Zentralisierung** - Alle Styles, Formate, Utils zentral gesteuert
2. **0 Duplikation** - Jeder Code existiert nur einmal
3. **Maximale Wartbarkeit** - Änderungen nur an 1 Stelle = systemweit wirksam
4. **Fehlerfreiheit** - Type-Safety, Validation, Konsistenz

---

## 🏗️ SYSTEM-ARCHITEKTUR-ÜBERSICHT

```
MyDispatch V18.3 Architektur
├── 🎨 Design-System (src/index.css + tailwind.config.ts)
│   ├── CI-Farben (--primary, --foreground, --accent)
│   ├── Ampel-System (--status-success/warning/error)
│   ├── Chart-Farben (--primary für Charts)
│   ├── Typography (Inter, Geist)
│   ├── Spacing (8px Grid)
│   ├── Animations (Keyframes + Transitions)
│   └── Shadows (--shadow-elegant, --shadow-glow)
│
├── 🧩 Component-Library (src/components/)
│   ├── ui/ (Shadcn Base Components)
│   ├── layout/ (Header, Sidebar, Footer - GESCHÜTZT)
│   ├── dashboard/ (KPI-Cards, Charts, Widgets)
│   ├── forms/ (PersonFormFields, AddressInput)
│   ├── shared/ (RelatedEntityCard, BulkActionBar)
│   └── statistics/ (RevenueChart, PartnerPerformance)
│
├── 🔧 Utility-Library (src/lib/)
│   ├── format-utils.ts (formatCurrency, formatDate, formatStatus)
│   ├── utils.ts (cn() Tailwind Merge)
│   ├── validation-utils.ts (Zod Schemas)
│   └── api-utils.ts (Supabase Helpers)
│
├── 🪝 Hook-Library (src/hooks/)
│   ├── use-auth.tsx (User, Profile, Company)
│   ├── use-device-type.tsx (isMobile Detection)
│   ├── use-dashboard-stats.tsx (Live KPIs)
│   ├── use-status-system.tsx (Ampel-System)
│   └── 40+ weitere zentrale Hooks
│
├── 📄 Page-Library (src/pages/)
│   ├── Dashboard.tsx
│   ├── Auftraege.tsx (Tabs: Aufträge + Angebote)
│   ├── Fahrer.tsx (Tabs: Fahrer + Fahrzeuge)
│   └── 15+ weitere Pages
│
└── 📐 Layout-System (GESCHÜTZT - NIEMALS ÄNDERN)
    ├── Header (h-16 = 60px)
    ├── Sidebar (w-16/w-60 = 64px/240px)
    ├── Footer (py-2)
    └── MainLayout + DashboardLayout
```

---

## 🎨 TEIL 1: FARBSYSTEM (ABSOLUTE WAHRHEIT)

### 1.1 CI-Farben (NIEMALS ÄNDERN)

```css
/* src/index.css - Lines 17-46 */
:root {
  /* Hauptfarben */
  --background: 0 0% 100%; /* #FFFFFF - Weiß */
  --foreground: 225 31% 28%; /* #323D5E - Dunkelblau (Text) */

  --primary: 40 31% 88%; /* #EADEBD - MyDispatch Beige/Gold */
  --primary-foreground: 225 31% 28%; /* #323D5E - Dunkel auf Primary */
  --primary-glow: 40 41% 93%; /* Hellere Primary-Variante */

  --accent: 31 26% 38%; /* #856d4b - MyDispatch Braun/Gold */
  --accent-foreground: 0 0% 100%; /* #FFFFFF - Weiß auf Accent */
  --accent-hover: 31 26% 32%; /* Dunklere Accent-Variante */

  --muted: 40 8% 95%; /* Gedämpftes Beige */
  --muted-foreground: 225 20% 50%; /* Gedämpfter Text */

  --border: 40 12% 88%; /* #E8E0D0 - Border */
  --card: 0 0% 100%; /* #FFFFFF - Card-Hintergrund */
}
```

### 1.2 Ampel-System (NUR für Status/Badges)

```css
/* KRITISCH: Ampelfarben NUR für Status-Badges, NIEMALS für Icons/Charts */
:root {
  --status-success: 142 76% 36%; /* #22c55e - Echtes Grün */
  --status-warning: 48 96% 53%; /* #eab308 - Echtes Gelb */
  --status-error: 0 84% 60%; /* #ef4444 - Echtes Rot */
}
```

**VERWENDUNG:**

```tsx
// ✅ RICHTIG: Status-Badges
<Badge variant="success">Aktiv</Badge>
<StatusIndicator status="error" />
<Alert variant="destructive">...</Alert>

// ❌ FALSCH: Icons, Charts, Buttons (außer Status-Buttons)
<Plus className="text-status-success" />  // VERBOTEN!
<Area stroke="hsl(var(--status-success))" />  // VERBOTEN!
```

### 1.3 Chart-Farben (Für Datenvisualisierung)

```css
/* WICHTIG: Für Charts verwenden wir --primary als Hauptfarbe */
:root {
  /* PRIMARY = Zentrale Chart-Farbe (wie Fahrzeug-Auslastungsleiste) */
  --primary: 40 31% 88%; /* #EADEBD - Hauptfarbe für Charts */

  /* Sekundäre Chart-Farben (für Multi-Serie-Charts) */
  --chart-secondary: 40 31% 70%; /* #D4C5A3 - Sekundärlinie */
  --chart-tertiary: 31 26% 55%; /* #B89368 - Dritte Linie */
  --chart-grid: 40 12% 88%; /* #E8E0D0 - Gitternetz */
}
```

**VERWENDUNG:**

```tsx
// RevenueChart, AreaChart, LineChart
<Area
  stroke="hsl(var(--primary))" // Hauptlinie
  fill="url(#colorRevenue)" // Gradient
/>;

// Multi-Serie Charts
const COLORS = [
  "hsl(var(--primary))", // Serie 1
  "hsl(var(--chart-secondary))", // Serie 2
  "hsl(var(--chart-tertiary))", // Serie 3
];
```

### 1.4 Icon-Farben (IMMER text-foreground)

```tsx
// ✅ RICHTIG: Icons verwenden IMMER text-foreground
<Plus className="h-4 w-4 text-foreground" />
<Users className="h-5 w-5 text-foreground" />
<Car className="h-6 w-6 text-foreground" />

// ❌ FALSCH: Ampelfarben auf Icons
<Plus className="text-status-success" />  // VERBOTEN!
<Users className="text-primary" />        // VERBOTEN!
```

**AUSNAHMEN** (sehr selten):

- Status-spezifische Icons IN Status-Badges (z.B. CheckCircle in Success-Badge)
- Hero-Sections mit dunklem Hintergrund (text-white)

### 1.5 Hover-Farben (KRITISCH - V18.3.1)

⚠️ **NEU ab V18.3.1:** Systemweite Regel für sichtbare Hover-Zustände

```tsx
// ✅ RICHTIG: Hover-Farben auf HELLEN Hintergründen
// (bg-primary, bg-background, bg-card)
<Button
  variant="ghost"
  className="text-foreground hover:text-foreground"
>
  <Icon className="text-foreground" />
  Text
</Button>

// ❌ FALSCH: Weiße Hover-Farbe auf hellem Hintergrund
<Button variant="ghost" className="hover:text-white">
  {/* UNSICHTBAR auf bg-primary! */}
</Button>

// ❌ FALSCH: accent-foreground auf hellem Hintergrund
<Icon className="hover:text-accent-foreground" />
{/* accent-foreground ist WEISS - unsichtbar! */}
```

**REGEL:**

- **Helle Hintergründe** (bg-primary, bg-background, bg-card) → `hover:text-foreground` (dunkel)
- **Dunkle Hintergründe** (bg-accent, bg-destructive) → `hover:text-white`

**Dokumentation:** [DESIGN_SYSTEM_HOVER_RULES_V18.3.1.md](./DESIGN_SYSTEM_HOVER_RULES_V18.3.1.md)

---

## 📐 TEIL 2: LAYOUT-SYSTEM (GESCHÜTZT)

### 2.1 Geschützte Layout-Komponenten (NIEMALS ÄNDERN)

#### Header (src/components/layout/Header.tsx)

```tsx
// FIXIERT: h-16 (60px), bg-primary
<header className="h-16 bg-primary fixed top-0 w-full z-50">
  {/* KEINE Layout-Änderungen erlaubt */}
</header>
```

#### Sidebar (src/components/layout/AppSidebar.tsx)

```tsx
// FIXIERT: w-16 (collapsed) / w-60 (expanded)
<Sidebar className="w-16 md:w-60 transition-all duration-300">
  {/* KEINE Layout-Änderungen erlaubt */}
</Sidebar>
```

#### Footer (src/components/layout/Footer.tsx)

```tsx
// FIXIERT: py-2, bg-primary
<footer className="py-2 bg-primary">{/* KEINE Layout-Änderungen erlaubt */}</footer>
```

### 2.2 Erlaubte Änderungen an Layout-Komponenten

✅ **ERLAUBT:**

- Funktionale Erweiterungen (neue Features, Buttons)
- Daten-Enrichment (mehr Informationen anzeigen)
- Event-Handler (onClick, Navigation)

❌ **VERBOTEN:**

- Layout-Änderungen (Höhe, Breite, Padding, Margin)
- CI-Farben ändern (bg-primary → bg-accent)
- Border-System ändern
- Icon-Farben ändern

---

## 🎯 TEIL 3: TYPOGRAFIE-SYSTEM

### 3.1 Schriftarten

```css
/* Primär: Inter (Body + UI) */
font-family:
  "Inter",
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Roboto,
  sans-serif;

/* Sekundär: Geist (Headlines - wenn benötigt) */
font-family: "Geist", "Inter", sans-serif;

/* Monospace (Code, Zahlen) */
font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace;
```

### 3.2 Fluid Typography (Responsive)

```css
/* Definiert in src/index.css Lines 103-112 */
:root {
  --font-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem); /* 12px → 14px */
  --font-sm: clamp(0.875rem, 0.825rem + 0.25vw, 1rem); /* 14px → 16px */
  --font-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem); /* 16px → 18px */
  --font-lg: clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem); /* 18px → 20px */
  --font-xl: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem); /* 20px → 24px */
  --font-2xl: clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem); /* 24px → 30px */
  --font-3xl: clamp(1.875rem, 1.65rem + 1.125vw, 2.25rem); /* 30px → 36px */
  --font-4xl: clamp(2.25rem, 1.95rem + 1.5vw, 3rem); /* 36px → 48px */
  --font-5xl: clamp(3rem, 2.55rem + 2.25vw, 4rem); /* 48px → 64px */
}
```

### 3.3 Tailwind Typography-Klassen

```tsx
// Tailwind-Größen (bevorzugt für Konsistenz)
text-xs      // 12px (Labels, Meta-Info)
text-sm      // 14px (Standard-Text)
text-base    // 16px (Wichtiger Text)
text-lg      // 18px (Subheadings)
text-xl      // 20px (Small Headlines)
text-2xl     // 24px (Headlines)
text-3xl     // 30px (Large Headlines)

// Custom Utility-Klassen (src/index.css Lines 234-271)
.text-display      // Display-Größe (48-64px)
.text-heading-1    // H1 (36-48px)
.text-heading-2    // H2 (30-36px)
.text-heading-3    // H3 (24-30px)
.text-body-lg      // Body Large (18-20px)
.text-body         // Body Standard (16-18px)
.text-body-sm      // Body Small (14-16px)
```

### 3.4 Font-Weights

```tsx
font - normal; // 400 (Body-Text)
font - medium; // 500 (Subtext, Labels)
font - semibold; // 600 (Wichtige UI-Elemente)
font - bold; // 700 (Headlines, Zahlen)
```

### 3.5 Line-Heights

```tsx
leading - tight; // 1.25 (Headlines)
leading - normal; // 1.5 (Body-Text)
leading - relaxed; // 1.625 (Long-Form-Text)
```

### 3.6 Letter-Spacing

```tsx
// Headlines (enger für Eleganz)
-tracking - tight; // letter-spacing: -0.01em

// Body (normal)
tracking - normal; // letter-spacing: 0

// Labels/Meta (weiter für Lesbarkeit)
tracking - wide; // letter-spacing: 0.025em
```

---

## 📏 TEIL 4: SPACING-SYSTEM (8px Grid)

### 4.1 Tailwind-Spacing-Skala

```tsx
/* Alle Abstände in 8px-Schritten (außer px/0.5) */
space-y-1    // 0.25rem (4px)   - Sehr eng
space-y-2    // 0.5rem  (8px)   - Eng
space-y-3    // 0.75rem (12px)  - Standard-Kompakt
space-y-4    // 1rem    (16px)  - Standard
space-y-6    // 1.5rem  (24px)  - Luftig
space-y-8    // 2rem    (32px)  - Sehr luftig

/* Padding */
p-1  // 0.25rem (4px)
p-2  // 0.5rem  (8px)
p-3  // 0.75rem (12px)
p-4  // 1rem    (16px)  - Standard für Cards
p-6  // 1.5rem  (24px)  - Standard für Dialogs
p-8  // 2rem    (32px)  - Standard für Sections

/* Margin */
m-1, m-2, m-3, m-4, m-6, m-8 (identisch zu Padding)

/* Gap (Flexbox/Grid) */
gap-1, gap-2, gap-3, gap-4, gap-6, gap-8
```

### 4.2 Responsive Spacing

```tsx
// Mobile: Kompakter
<div className="space-y-4 md:space-y-6 lg:space-y-8">

// Mobile: Weniger Padding
<div className="p-4 md:p-6 lg:p-8">

// Mobile-First-Pattern
<div className="px-4 sm:px-6 lg:px-8">
```

---

## 🎭 TEIL 5: BORDER & RADIUS-SYSTEM

### 5.1 Border-Radius

```css
/* Definiert in src/index.css Line 48 */
:root {
  --radius: 0.5rem; /* 8px - Standard-Radius */
}
```

```tsx
// Tailwind-Klassen
rounded-none    // 0px     (Keine Rundung)
rounded-sm      // 0.125rem (2px)
rounded         // 0.25rem  (4px)
rounded-md      // 0.375rem (6px)
rounded-lg      // 0.5rem   (8px) - STANDARD für Cards
rounded-xl      // 0.75rem  (12px)
rounded-2xl     // 1rem     (16px)
rounded-full    // 9999px   (Perfekter Kreis)
```

### 5.2 Border-System

```tsx
// ✅ RICHTIG: Border nur auf Cards
<Card className="border rounded-lg" />

// ❌ FALSCH: Border auf Icons, Buttons (außer variant="outline")
<Button className="border" />  // FALSCH!
<Icon className="border" />    // FALSCH!

// ✅ RICHTIG: Outline-Buttons
<Button variant="outline" />  // Border ist Teil der Variante
```

---

## 🎨 TEIL 6: SHADOW-SYSTEM

### 6.1 Shadow-Varianten

```css
/* Definiert in src/index.css Lines 82-88 */
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-elegant: 0 10px 30px -10px rgba(50, 61, 94, 0.3);
  --shadow-glow: 0 0 40px rgba(234, 222, 189, 0.4);
}
```

### 6.2 Tailwind-Shadow-Klassen

```tsx
shadow-sm       // Subtil
shadow          // Standard
shadow-md       // Medium
shadow-lg       // Large
shadow-xl       // Extra Large
shadow-2xl      // 2X Large
shadow-elegant  // Custom (CI-konform)
shadow-glow     // Custom (Primary-Glow)
```

---

## 🎬 TEIL 7: ANIMATION-SYSTEM

### 7.1 Keyframe-Animationen

```css
/* Definiert in tailwind.config.ts Lines 86-133 */
keyframes: {
  "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
  "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
  "fade-in": { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1" } },
  "fade-out": { "0%": { opacity: "1" }, "100%": { opacity: "0", transform: "translateY(10px)" } },
  "scale-in": { "0%": { transform: "scale(0.95)", opacity: "0" }, "100%": { transform: "scale(1)" } },
  "scale-out": { "0%": { transform: "scale(1)" }, "100%": { transform: "scale(0.95)", opacity: "0" } },
  "slide-in-right": { "0%": { transform: "translateX(100%)" }, "100%": { transform: "translateX(0)" } },
  "slide-out-right": { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(100%)" } },
  "bounce-subtle": { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-5px)" } },
  "pulse-glow": { "0%, 100%": { opacity: "1", boxShadow: "var(--shadow-glow)" } },
}
```

### 7.2 Animation-Klassen

```tsx
animate-fade-in          // Einblenden (0.3s)
animate-fade-out         // Ausblenden (0.3s)
animate-scale-in         // Hineinzoomen (0.2s)
animate-scale-out        // Herauszoomen (0.2s)
animate-slide-in-right   // Von rechts einschieben (0.3s)
animate-slide-out-right  // Nach rechts ausschieben (0.3s)
animate-bounce-subtle    // Subtiles Hüpfen (2s infinite)
animate-pulse-glow       // Pulsierender Glow (3s infinite)
```

### 7.3 Transition-Utilities

```css
/* Definiert in src/index.css Lines 114-116 */
:root {
  --transition-base: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-smooth: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

```tsx
// Tailwind-Transitions
transition; // all 150ms cubic-bezier(0.4, 0, 0.2, 1)
transition - colors; // colors 150ms
transition - opacity; // opacity 150ms
transition -
  // Custom Hover-Effects (src/index.css Lines 308-370)
  transform.hover - // transform 150ms
  lift.hover - // translateY(-4px) + shadow-xl
  scale.hover - // scale(1.02)
  glow.interactive - // shadow-glow
  hover.card - // bg + shadow + translateY
  hover; // scale(1.01) + shadow
```

---

## 📦 TEIL 8: COMPONENT-PATTERNS

### 8.1 Card-Pattern

```tsx
// Standard-Card
<Card className="border shadow-sm">
  <CardHeader>
    <CardTitle>Titel</CardTitle>
    <CardDescription>Beschreibung</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Content */}
  </CardContent>
</Card>

// Card mit Hover-Effect
<Card className="border shadow-sm hover-scale transition">
  ...
</Card>
```

### 8.2 Button-Pattern

```tsx
// Primär (Accent-Hintergrund)
<Button variant="default">Primary Action</Button>

// Sekundär (Outline)
<Button variant="outline">Secondary Action</Button>

// Ghost (Transparent)
<Button variant="ghost">Tertiary Action</Button>

// Destructive (Rot)
<Button variant="destructive">Delete</Button>

// Größen
<Button size="sm">Small</Button>     // h-9 px-3
<Button size="default">Default</Button> // h-10 px-4
<Button size="lg">Large</Button>     // h-11 px-8
```

### 8.3 Badge-Pattern

```tsx
// Status-Badges (Ampelfarben)
<Badge variant="success">Aktiv</Badge>
<Badge variant="warning">Ausstehend</Badge>
<Badge variant="destructive">Fehler</Badge>

// Neutrale Badges
<Badge variant="secondary">Info</Badge>
<Badge variant="outline">Label</Badge>
```

### 8.4 Form-Pattern

```tsx
// Standard-Form-Field
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Label</FormLabel>
      <FormControl>
        <Input placeholder="Placeholder" {...field} />
      </FormControl>
      <FormDescription>Optional Description</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>

// Zentrale PersonFormFields (wiederverwendbar)
<PersonFormFields
  form={form}
  prefix="customer"
  requiredFields={['first_name', 'last_name']}
/>
```

---

## 🔧 TEIL 9: UTILITY-FUNKTIONEN (ZENTRAL)

### 9.1 Format-Utils (src/lib/format-utils.ts)

```tsx
import {
  formatCurrency, // 1234.56 => "1.234,56 €"
  formatDate, // "2025-01-18" => "18.01.2025"
  formatDateTime, // "2025-01-18T14:30:00Z" => "18.01.2025 14:30"
  formatTime, // "2025-01-18T14:30:00Z" => "14:30"
  formatBookingStatus, // "pending" => "Ausstehend"
  formatInvoiceStatus, // "paid" => "Bezahlt"
  formatOfferStatus, // "sent" => "Versendet"
  formatShiftStatus, // "available" => "Verfügbar"
  formatPaymentStatus, // "pending" => "Ausstehend"
  formatVehicleClass, // "Business Class" => "Business"
  getFullName, // ("Max", "Mustermann") => "Max Mustermann"
} from "@/lib/format-utils";

// KRITISCH: IMMER diese Funktionen verwenden, NIEMALS inline formatieren!
// ✅ RICHTIG:
const displayPrice = formatCurrency(booking.price);
const displayDate = formatDate(booking.pickup_date);

// ❌ FALSCH:
const displayPrice = `${booking.price.toFixed(2)} €`; // VERBOTEN!
const displayDate = new Date(booking.pickup_date).toLocaleDateString("de-DE"); // VERBOTEN!
```

### 9.2 Validation-Utils (TODO: Erstellen)

```tsx
// src/lib/validation-utils.ts (NEU - PHASE 1)
import { z } from "zod";

// Deutsche Telefonnummer
export const phoneSchema = z
  .string()
  .regex(/^(\+49|0)[1-9][0-9]{1,14}$/, "Ungültige deutsche Telefonnummer");

// Deutsche PLZ
export const plzSchema = z.string().regex(/^[0-9]{5}$/, "PLZ muss 5-stellig sein");

// Email
export const emailSchema = z.string().email("Ungültige E-Mail-Adresse");

// IBAN
export const ibanSchema = z.string().regex(/^DE[0-9]{20}$/, "Ungültige deutsche IBAN");
```

### 9.3 API-Utils (TODO: Zentralisieren)

```tsx
// src/lib/api-utils.ts (NEU - PHASE 1)
import { supabase } from "@/integrations/supabase/client";

/**
 * Zentrale Error-Handler
 */
export function handleError(error: any, context: string) {
  console.error(`[${context}] Error:`, error);
  toast.error(`Fehler: ${error.message || "Unbekannter Fehler"}`);
}

/**
 * Zentrale Success-Handler
 */
export function handleSuccess(message: string) {
  toast.success(message);
}

/**
 * Zentrale Supabase-Query mit Company-Filter
 */
export async function queryWithCompanyFilter<T>(table: string, companyId: string): Promise<T[]> {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("company_id", companyId)
    .eq("archived", false);

  if (error) throw error;
  return data as T[];
}
```

---

## 🪝 TEIL 10: HOOK-SYSTEM (ZENTRAL)

### 10.1 Core-Hooks (Immer verfügbar)

```tsx
// Authentication & User
import { useAuth } from "@/hooks/use-auth";
const { user, profile, company, roles, loading } = useAuth();

// Device Detection
import { useDeviceType } from "@/hooks/use-device-type";
const { isMobile, isTablet, isDesktop } = useDeviceType();

// Dashboard Stats (Materialized View)
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
const { data: stats, isLoading } = useDashboardStats();

// Status-System (Ampel-Logik)
import { useStatusSystem } from "@/hooks/use-status-system";
const { configs, getStatusConfig } = useStatusSystem();

// Company-Location (GPS-Koordinaten)
import { useCompanyLocation } from "@/hooks/use-company-location";
const { location, hasCoordinates } = useCompanyLocation();
```

### 10.2 Entity-Hooks (CRUD-Operations)

```tsx
// Bookings
import { useBookings } from "@/hooks/use-bookings";
const { bookings, isLoading, createMutation, updateMutation } = useBookings();

// Customers
import { useCustomers } from "@/hooks/use-customers";
const { customers, isLoading, createMutation } = useCustomers();

// Drivers
import { useDrivers } from "@/hooks/use-drivers";
const { drivers, isLoading } = useDrivers();

// Vehicles
import { useVehicles } from "@/hooks/use-vehicles";
const { vehicles, isLoading } = useVehicles();
```

### 10.3 Feature-Hooks

```tsx
// Bulk-Selection
import { useBulkSelection } from "@/hooks/use-bulk-selection";
const { selectedIds, isSelected, toggleSelection, clearSelection } = useBulkSelection(items);

// Chat-Consent
import { useChatConsent } from "@/hooks/use-chat-consent";
const { consent, loading, grantConsent } = useChatConsent();

// Auto-Update (PWA)
import { useAutoUpdate } from "@/hooks/use-auto-update";
useAutoUpdate({ checkInterval: 5 * 60 * 1000 });
```

---

## 📱 TEIL 11: RESPONSIVE DESIGN (MOBILE-FIRST)

### 11.1 Breakpoints

```tsx
/* Tailwind Breakpoints */
sm:  640px   // Small devices (Phones landscape)
md:  768px   // Medium devices (Tablets)
lg:  1024px  // Large devices (Laptops)
xl:  1280px  // Extra large devices (Desktops)
2xl: 1536px  // 2X Large devices (Large Desktops)

/* Mobile Detection (useDeviceType) */
isMobile = window.innerWidth < 768px
isTablet = window.innerWidth >= 768px && < 1024px
isDesktop = window.innerWidth >= 1024px
```

### 11.2 Mobile-Optimierungen

```tsx
// Touch-Targets (min. 44x44px)
<Button className="min-h-[44px]" />

// Kompakte Abstände
<div className="space-y-4 md:space-y-6" />

// Full-Width auf Mobile
<Card className="w-full md:max-w-md" />

// Stack auf Mobile, Grid auf Desktop
<div className="flex flex-col md:grid md:grid-cols-2 gap-4" />
```

### 11.3 Mobile-Specific-Classes (src/index.css Lines 377-427)

```css
@media (max-width: 767px) {
  /* Touch-optimierte Buttons */
  button,
  a[role="button"] {
    min-height: 44px;
    touch-action: manipulation;
  }

  /* Full-Width Dialogs */
  [role="dialog"] {
    width: calc(100vw - 2rem) !important;
  }

  /* Safe Area (iOS) */
  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

---

## 🌍 TEIL 12: LOKALISIERUNG (DEUTSCHE STANDARDS)

### 12.1 Währung (DIN 5008)

```tsx
// ✅ RICHTIG: formatCurrency()
import { formatCurrency } from "@/lib/format-utils";
const displayPrice = formatCurrency(1234.56); // "1.234,56 €"

// ❌ FALSCH: Inline-Formatierung
const displayPrice = `${price.toFixed(2)} €`; // VERBOTEN!
```

**Details:**

- Punkt als Tausendertrenner: `1.234`
- Komma als Dezimaltrennzeichen: `,56`
- Währungszeichen nachgestellt mit Leerzeichen: ` €`

### 12.2 Datum & Zeit (DIN 5008)

```tsx
// ✅ RICHTIG: formatDate(), formatDateTime(), formatTime()
import { formatDate, formatDateTime, formatTime } from "@/lib/format-utils";
const displayDate = formatDate("2025-01-18"); // "18.01.2025"
const displayDateTime = formatDateTime("2025-01-18T14:30:00Z"); // "18.01.2025 14:30"
const displayTime = formatTime("2025-01-18T14:30:00Z"); // "14:30"

// ❌ FALSCH: US-Format oder inline
const displayDate = new Date().toLocaleDateString("en-US"); // VERBOTEN!
```

**Format:**

- Datum: `DD.MM.YYYY` (18.01.2025)
- Zeit: `HH:mm` (14:30)
- DateTime: `DD.MM.YYYY HH:mm` (18.01.2025 14:30)

### 12.3 Rechtschreibung (Neue Deutsche Rechtschreibung 2006)

**Wichtige Regeln:**

- `Straße` (nicht `Strasse`)
- `dass` (Konjunktion, nicht `daß`)
- `kennenlernen` (zusammen)
- `infrage stellen` (getrennt)
- `Rad fahren` (getrennt)

### 12.4 Anrede-System

```tsx
// Salutation (Herr/Frau/Divers)
salutation: "Herr" | "Frau" | "Divers";

// Titel (optional)
title: "Dr." | "Prof." | "Dr. med." | null;

// Formelle Anrede
("Sehr geehrte Frau Prof. Schmidt,");
("Guten Tag Alex Müller,"); // Divers
```

---

## 🔐 TEIL 13: SECURITY & RLS-PATTERNS

### 13.1 Multi-Tenant-Security (KRITISCH)

```tsx
// ✅ RICHTIG: IMMER company_id filtern
const { data } = await supabase
  .from("bookings")
  .select("*")
  .eq("company_id", profile.company_id)
  .eq("archived", false);

// ❌ FALSCH: Ohne company_id
const { data } = await supabase.from("bookings").select("*"); // KRITISCHER SICHERHEITSFEHLER!
```

### 13.2 Archiving-System (NIEMALS DELETE)

```tsx
// ✅ RICHTIG: Archivieren
await supabase
  .from("bookings")
  .update({
    archived: true,
    archived_at: new Date().toISOString(),
  })
  .eq("id", bookingId);

// ❌ FALSCH: DELETE verwenden
await supabase.from("bookings").delete().eq("id", bookingId); // VERBOTEN!
```

### 13.3 RLS-Policy-Patterns

```sql
-- ✅ RICHTIG: RLS Policy mit company_id
CREATE POLICY "Users can view their own company bookings"
ON public.bookings
FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM public.profiles
    WHERE user_id = auth.uid()
  )
  AND archived = false
);
```

---

## 📋 TEIL 14: QUALITY-CHECKLISTS

### 14.1 Pre-Commit-Checklist (ZWINGEND)

```bash
# 1. Icon-Farben prüfen
✓ Alle Icons verwenden text-foreground
✓ Keine text-status-* auf Icons

# 2. CI-Farben prüfen
✓ Primary: #EADEBD (hsl(40 31% 88%))
✓ Foreground: #323D5E (hsl(225 31% 28%))
✓ Accent: #856d4b (hsl(31 26% 38%))

# 3. Chart-Farben prüfen
✓ Charts verwenden --primary als Hauptfarbe
✓ Keine --chart-primary mehr (deprecated)

# 4. Layout prüfen
✓ Header: h-16 (60px)
✓ Sidebar: w-16/w-60 (64px/240px)
✓ Footer: py-2
✓ Keine Border außer auf Cards

# 5. Mobile prüfen
✓ Touch-Targets ≥ 44px
✓ Responsive Breakpoints korrekt
✓ isMobile Hook verwendet

# 6. Lokalisierung prüfen
✓ Währung: formatCurrency() verwendet
✓ Datum: formatDate() verwendet
✓ Neue Deutsche Rechtschreibung

# 7. TypeScript prüfen
✓ 0 Build-Errors
✓ 0 Runtime-Errors
✓ Explizite Types für Supabase ENUMs

# 8. Utils verwendet
✓ format-utils.ts Funktionen verwendet
✓ Keine Inline-Formatierung
✓ Zentrale Hooks verwendet
```

### 14.2 Component-Creation-Checklist

```bash
# Bei neuer Komponente:
✓ Verwendung von Design-System-Tokens (--primary, --foreground)
✓ Props mit TypeScript-Interface definiert
✓ Responsive Design (md:, lg: Breakpoints)
✓ Accessibility (aria-labels, keyboard-nav)
✓ Error-Boundaries (try/catch)
✓ Loading-States
✓ Empty-States
✓ Mobile-Optimierung (min-h-[44px])
✓ Dokumentation (JSDoc-Kommentar)
```

---

## 🚀 TEIL 15: IMPLEMENTIERUNGS-ROADMAP

### Phase 1: Foundation-Cleanup (SOFORT - Woche 1)

#### Sprint 1.1: Utility-Zentralisierung

**Ziel:** Alle Format-/Validation-Utils konsolidieren

```bash
# Neue Dateien erstellen:
src/lib/validation-utils.ts     # Zod-Schemas (Phone, PLZ, Email, IBAN)
src/lib/api-utils.ts            # Supabase-Helpers (queryWithCompanyFilter)
src/lib/string-utils.ts         # String-Manipulation (slugify, truncate)
src/lib/date-utils.ts           # Erweiterte Datum-Utils (addBusinessDays)

# Bestehende Dateien erweitern:
src/lib/format-utils.ts         # Bereits vollständig ✅
```

**Dateien zu erstellen:**

1. `src/lib/validation-utils.ts` (300 Zeilen)
2. `src/lib/api-utils.ts` (200 Zeilen)
3. `src/lib/string-utils.ts` (150 Zeilen)
4. `src/lib/date-utils.ts` (200 Zeilen)

**Impact:** 🔴 KRITISCH - Eliminiert 50+ Code-Duplikationen

#### Sprint 1.2: Component-Cleanup

**Ziel:** Doppelte Komponenten eliminieren

```bash
# Duplikate identifizieren:
src/components/dashboard/RevenueChart.tsx      # Behalten (besser)
src/components/statistics/RevenueChart.tsx     # Konsolidieren oder umbenennen

# Neue zentrale Komponenten:
src/components/shared/StatusBadge.tsx          # Einheitliche Status-Badges
src/components/shared/LoadingSpinner.tsx       # Zentrale Loader
src/components/shared/EmptyState.tsx           # Zentrale Empty-States
```

**Impact:** 🟡 WICHTIG - Reduziert Bundle-Size um 10%

#### Sprint 1.3: Hook-Cleanup

**Ziel:** Unused Hooks entfernen, Missing Hooks erstellen

```bash
# Audit aller 46 Hooks:
src/hooks/*.tsx  # Analyse auf Verwendung

# Neue Hooks:
src/hooks/use-pagination.tsx        # Zentrale Pagination-Logik
src/hooks/use-filters.tsx           # Zentrale Filter-Logik
src/hooks/use-export.tsx            # PDF/Excel-Export
```

**Impact:** 🟡 WICHTIG - Bessere Code-Organisation

---

### Phase 2: Advanced Features (Woche 2-3)

#### Sprint 2.1: Chart-System-Upgrade

**Ziel:** Alle Charts auf --primary migrieren

```bash
# Bestehende Charts migrieren:
src/components/dashboard/RevenueChart.tsx      # ✅ Bereits migriert
src/components/statistics/RevenueChart.tsx     # ✅ Bereits migriert
src/components/dashboard/PaymentMethodsChart.tsx  # Migration pending

# Neue Charts:
src/components/statistics/DriverPerformanceChart.tsx
src/components/statistics/UtilizationHeatmap.tsx
src/components/statistics/ForecastChart.tsx (Business+)
```

**Impact:** 🟡 WICHTIG - Konsistentes Chart-Design

#### Sprint 2.2: Form-System-Upgrade

**Ziel:** Alle Formulare auf zentrale Komponenten umstellen

```bash
# Zentrale Form-Components:
src/components/forms/PersonFormFields.tsx       # ✅ Bereits vorhanden
src/components/forms/AddressFormFields.tsx      # Erweitern
src/components/forms/CompanyFormFields.tsx      # NEU
src/components/forms/VehicleFormFields.tsx      # NEU

# Migration aller 20+ Formulare:
src/pages/Auftraege.tsx      # PersonFormFields verwenden
src/pages/Kunden.tsx         # PersonFormFields verwenden
src/pages/Fahrer.tsx         # PersonFormFields verwenden
```

**Impact:** 🔴 KRITISCH - 80% weniger Form-Code

#### Sprint 2.3: Table-System-Upgrade

**Ziel:** Einheitliche Tabellen-Komponente mit Bulk-Actions

```bash
# Neue zentrale Table-Component:
src/components/shared/DataTable.tsx             # Generische Tabelle
src/components/shared/BulkActionBar.tsx         # ✅ Konzept vorhanden

# Migration aller Tabellen:
src/pages/Auftraege.tsx      # DataTable verwenden
src/pages/Kunden.tsx         # DataTable verwenden
src/pages/Fahrer.tsx         # DataTable verwenden
```

**Impact:** 🟡 WICHTIG - Konsistente UX

---

### Phase 3: Performance & Scale (Woche 4-5)

#### Sprint 3.1: Code-Splitting

```bash
# Lazy-Loading für große Pages:
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Statistiken = lazy(() => import('@/pages/Statistiken'));

# Route-basiertes Splitting:
src/routes/index.tsx  # Implementierung
```

**Impact:** 🟢 ENHANCEMENT - 30% schnellere Initial-Load-Time

#### Sprint 3.2: Bundle-Size-Optimierung

```bash
# Tree-Shaking:
- Unused Lucide-Icons entfernen
- Unused Radix-Components entfernen
- date-fns modular importieren

# Bundle-Analyse:
npm run build --analyze
```

**Impact:** 🟢 ENHANCEMENT - 20% kleinerer Bundle

#### Sprint 3.3: Cache-Strategie

```bash
# React-Query-Konfiguration:
src/lib/query-client.ts  # Optimierte Cache-Times

# Service-Worker (PWA):
vite.config.ts  # Workbox-Konfiguration
```

**Impact:** 🟢 ENHANCEMENT - Bessere Offline-Fähigkeit

---

## 📊 TEIL 16: METRIKEN & KPIs

### 16.1 Code-Quality-Metriken

```bash
# Vor Zentralisierung (V18.2)
├── Anzahl Komponenten:        450+
├── Code-Duplikation:          35%
├── Inline-Formatierung:       200+ Stellen
├── Unused Hooks:              12
├── Bundle-Size:               2.5 MB
├── Initial-Load-Time:         3.2s
└── TypeScript-Errors:         8

# Nach Zentralisierung (V18.3 Ziel)
├── Anzahl Komponenten:        350 (-22%)
├── Code-Duplikation:          < 5% (-86%)
├── Inline-Formatierung:       0 (-100%)
├── Unused Hooks:              0 (-100%)
├── Bundle-Size:               1.8 MB (-28%)
├── Initial-Load-Time:         2.1s (-34%)
└── TypeScript-Errors:         0 (-100%)
```

### 16.2 Wartbarkeits-Metriken

```bash
# Change-Impact-Analyse:
Vor V18.3:
- Währungs-Format ändern:       200+ Stellen ändern
- CI-Farbe ändern:              50+ Stellen ändern
- Status-Label ändern:          80+ Stellen ändern

Nach V18.3:
- Währungs-Format ändern:       1 Stelle (format-utils.ts)
- CI-Farbe ändern:              1 Stelle (index.css)
- Status-Label ändern:          1 Stelle (format-utils.ts)

Effizienz-Steigerung:           95-99%
```

---

## 🔒 TEIL 17: VERBOTENE PATTERNS (ANTI-PATTERNS)

### 17.1 ❌ NIEMALS TUN

```tsx
// ❌ 1. Direkte Hex-Farben
<div style={{ color: '#EADEBD' }} />  // VERBOTEN!
<div className="text-[#323D5E]" />     // VERBOTEN!

// ❌ 2. Inline-Formatierung
const price = `${amount.toFixed(2)} €`;  // VERBOTEN!
const date = new Date().toLocaleDateString();  // VERBOTEN!

// ❌ 3. DELETE statt Archiving
await supabase.from('bookings').delete();  // VERBOTEN!

// ❌ 4. Queries ohne company_id
await supabase.from('bookings').select('*');  // KRITISCH!

// ❌ 5. Ampelfarben auf Icons
<Plus className="text-status-success" />  // VERBOTEN!

// ❌ 6. US-Formate
const date = '12/31/2024';  // VERBOTEN! (DD.MM.YYYY)
const price = '$1,234.56';  // VERBOTEN! (1.234,56 €)

// ❌ 7. Layout-Änderungen an geschützten Components
<Header className="h-20" />  // VERBOTEN! (h-16 fixiert)

// ❌ 8. Duplizierte Utility-Funktionen
// Neue Utils IMMER in src/lib/ erstellen, nicht inline!

// ❌ 9. Magic Numbers
<div className="mt-[17px]" />  // VERBOTEN! (Verwende 8px-Grid)

// ❌ 10. Inline-Styles (außer dynamic styles)
<div style={{ marginTop: '20px' }} />  // VERBOTEN!

// ❌ 11. Weiße Hover-Farben auf hellen Hintergründen (NEU V18.3.1)
<Button className="bg-primary hover:text-white" />  // VERBOTEN! (unsichtbar)
<Icon className="hover:text-accent-foreground" />   // VERBOTEN! (ist weiß)
```

### 17.2 ✅ STATTDESSEN VERWENDEN

```tsx
// ✅ 1. Design-System-Tokens
<div className="text-primary" />
<div style={{ color: 'hsl(var(--primary))' }} />

// ✅ 2. Zentrale Format-Utils
const price = formatCurrency(amount);
const date = formatDate(dateString);

// ✅ 3. Archiving
await supabase.from('bookings').update({ archived: true });

// ✅ 4. Company-Filter
await supabase.from('bookings').select('*').eq('company_id', profile.company_id);

// ✅ 5. text-foreground auf Icons
<Plus className="text-foreground" />

// ✅ 6. Deutsche Formate
const date = formatDate('2025-01-18');  // "18.01.2025"
const price = formatCurrency(1234.56);  // "1.234,56 €"

// ✅ 7. Geschützte Layouts respektieren
<Header className="h-16" />  // Fixiert

// ✅ 8. Zentrale Utils
import { formatCurrency } from '@/lib/format-utils';

// ✅ 9. 8px-Grid-System
<div className="mt-4" />  // 16px = 2 * 8px

// ✅ 10. Tailwind-Klassen
<div className="mt-4" />
```

---

## 🎓 TEIL 18: ONBOARDING FÜR NEUE ENTWICKLER

### 18.1 Pflichtlektüre (in dieser Reihenfolge)

1. **Dieses Dokument** (`DESIGN_SYSTEM_MASTER_V18.3_ULTIMATE.md`) - 60 Min
2. `docs/DESIGN_SYSTEM_CHART_COLORS_V18.3.md` - 15 Min
3. `docs/REVENUE_CHART_FEATURES_V18.3.md` - 10 Min
4. Custom Knowledge (MyDispatch V18.3 Konzept) - 30 Min
5. `src/index.css` - Durchlesen (15 Min)
6. `tailwind.config.ts` - Durchlesen (10 Min)
7. `src/lib/format-utils.ts` - Durchlesen (10 Min)

**Gesamt:** 2.5 Stunden

### 18.2 Erste Schritte

```bash
# 1. Projekt klonen & Setup
git clone <repo>
npm install

# 2. Dev-Server starten
npm run dev

# 3. Erstes Feature implementieren (Tutorial)
# Aufgabe: Neues KPI-Card erstellen
# Datei: src/components/dashboard/MyFirstKPICard.tsx
# Anforderungen:
# - Verwende Card-Component
# - Verwende Design-System-Farben
# - Verwende formatCurrency()
# - Mobile-responsive
# - TypeScript-Interfaces
```

### 18.3 Code-Review-Checkliste

```bash
# Vor jedem Pull-Request:
✓ Pre-Commit-Checklist durchgegangen
✓ 0 TypeScript-Errors
✓ 0 Console-Warnings
✓ Mobile getestet (< 768px)
✓ Design-System eingehalten
✓ Keine Inline-Formatierung
✓ Zentrale Utils verwendet
✓ JSDoc-Kommentare geschrieben
✓ README aktualisiert (falls nötig)
```

---

## 🔮 TEIL 19: ZUKUNFTSSICHERHEIT

### 19.1 Design-Token-Evolution

```tsx
// Vorbereitet für CSS Custom Properties Export
// In Zukunft: Design-Tokens als JSON exportieren
// Tools: Style Dictionary, Figma Tokens
// → Automatische Synchronisation Design ↔ Code
```

### 19.2 Component-Library-Export

```tsx
// Vorbereitet für externes NPM-Package
// @mydispatch/ui-components
// → Wiederverwendung in anderen Projekten (z.B. Partner-Portal)
```

### 19.3 Theming-System

```tsx
// Vorbereitet für White-Label (Enterprise)
// Kunden können eigene CI-Farben definieren
// → Zur Laufzeit ohne Code-Änderung
```

---

## 📞 TEIL 20: SUPPORT & KONTAKT

### 20.1 Bei Unklarheiten

1. **Dieses Dokument durchsuchen** (Cmd+F)
2. **Custom Knowledge prüfen** (Project Settings)
3. **Bestehende Implementierung anschauen** (src/components/dashboard/)
4. **Fragen an Team** (Discord/Slack)

### 20.2 Dokumentation-Updates

```bash
# Dieses Dokument ist LIVING DOCUMENTATION
# Bei Änderungen am Design-System:
# → Dieses Dokument ZWINGEND aktualisieren!

# Verantwortlich: Tech Lead / Senior Developer
# Review: Alle 2 Wochen
```

---

## ✅ TEIL 21: FINALE CHECKLISTE

### 21.1 System-Konformität

```bash
# Projekt-Status prüfen:
✓ Alle Farben verwenden Design-System-Tokens
✓ Alle Formatierungen verwenden format-utils.ts
✓ Alle Icons verwenden text-foreground
✓ Alle Charts verwenden --primary
✓ Alle Layouts respektieren geschützte Components
✓ Alle Queries filtern nach company_id
✓ Alle Deletes sind Archivierungen
✓ Alle Formulare verwenden zentrale Components
✓ Alle Hooks sind dokumentiert
✓ 0 TypeScript-Errors
✓ 0 Inline-Formatierung
✓ 0 Magic Numbers
✓ 0 Hardcoded Colors
✓ 100% Mobile-Responsive
✓ 100% Deutsche Lokalisierung
```

### 21.2 Go-Live-Readiness

```bash
# Production-Ready wenn:
✓ Alle Checklisten erfüllt
✓ Performance > 90 (Lighthouse)
✓ Accessibility > 90 (Lighthouse)
✓ SEO > 90 (Lighthouse)
✓ Bundle-Size < 2 MB
✓ Initial-Load-Time < 3s
✓ RLS-Policies aktiv
✓ Error-Tracking aktiv (Sentry)
✓ Monitoring aktiv
✓ Backup-Strategie vorhanden
```

---

## 🎉 ZUSAMMENFASSUNG

### Was ist dieses Dokument?

Die **ABSOLUTE SINGLE SOURCE OF TRUTH** für MyDispatch V18.3 Design-System, Architektur und Best Practices.

### Warum ist es wichtig?

- **0 Duplikation** → Änderungen nur an 1 Stelle
- **100% Konsistenz** → Einheitliche UX/UI
- **Maximale Wartbarkeit** → Code bleibt sauber & verständlich
- **Fehlerfreiheit** → Type-Safety & Validation

### Wer muss es lesen?

**ALLE** Entwickler, Designer, PMs - keine Ausnahmen!

### Wie oft aktualisieren?

Bei JEDER Design-System-Änderung sofort aktualisieren.

---

**Version:** V18.3 ULTIMATE  
**Letzte Aktualisierung:** 21.10.2025  
**Maintainer:** MyDispatch Dev-Team  
**Status:** 🔴 KRITISCH - VERBINDLICH

---

**🚨 KRITISCHE REGEL:**  
Jede Code-Änderung, die NICHT diesem Dokument entspricht, wird im Code-Review ABGELEHNT.  
Keine Ausnahmen. Keine Kompromisse. 100% Konformität.
