# HOME DESIGN TEMPLATE V18.5.1

> **Version:** 18.5.1  
> **Letzte Aktualisierung:** 2025-10-23  
> **Status:** 🔴 SYSTEMWEIT VERPFLICHTEND  
> **Zweck:** Home-Seite als zentrale Design-Vorlage für ALLE öffentlichen Seiten

---

## 🎯 GRUNDPRINZIP

**Die Home-Seite (`/`) ist die MASTER-TEMPLATE für ALLE öffentlichen Marketing-Seiten von MyDispatch.**

### Was bedeutet das?

Alle öffentlichen Seiten (Marketing, Landing Pages, Rechtstexte) MÜSSEN:

- **1:1 identisches Design** wie Home verwenden
- **Gleiche Buttons, Badges, Cards, Icons** verwenden
- **Gleichen Header, Footer, Sidebar** verwenden (nur Menü-Belegung unterschiedlich)
- **Gleiche Animationen, Shadows, Transitions** verwenden
- **Gleiche Farben (Semantic Tokens)** verwenden

---

## 📁 BETROFFEN PAGES

### ✅ Verwenden Home-Template (PFLICHT)

| Seite                    | Route                   | Status    | Besonderheiten         |
| ------------------------ | ----------------------- | --------- | ---------------------- |
| **Home**                 | `/`                     | ✅ Master | Original-Template      |
| **Taxiunternehmen**      | `/taxiunternehmen`      | 🔄 TODO   | Nur Inhalte anpassen   |
| **Mietwagenunternehmen** | `/mietwagenunternehmen` | 🔄 TODO   | Nur Inhalte anpassen   |
| **Fahrer-Info**          | `/fahrer`               | 🔄 TODO   | Nur Inhalte anpassen   |
| **Impressum**            | `/impressum`            | 🔄 TODO   | Rechtstext, keine Hero |
| **Datenschutz**          | `/datenschutz`          | 🔄 TODO   | Rechtstext, keine Hero |
| **AGB**                  | `/agb`                  | 🔄 TODO   | Rechtstext, keine Hero |
| **Widerrufsrecht**       | `/widerrufsrecht`       | 🔄 TODO   | Rechtstext, keine Hero |

### ❌ Verwenden NICHT Home-Template

| Seite               | Route          | Grund                       |
| ------------------- | -------------- | --------------------------- |
| **Dashboard**       | `/dashboard`   | App-Bereich, eigenes Design |
| **Auth**            | `/auth`        | Login/Register, vereinfacht |
| **Alle App-Seiten** | `/dashboard/*` | Interne App-Navigation      |

---

## 🎨 DESIGN-ELEMENTE (1:1 ÜBERNEHMEN)

### 1. HEADER (SYSTEMWEIT IDENTISCH)

**Datei:** `src/components/auth/AuthHeader.tsx`

**Specs:**

```tsx
<header
  className="
  fixed top-0 w-full z-50
  h-16 sm:h-20
  bg-gradient-to-r from-primary via-primary/95 to-secondary/20
  border-b border-primary/20
  shadow-lg
"
>
  {/* Logo - STRIKTE MAX-WIDTH! */}
  <img
    src={logoUrl || officialLogo}
    alt={`${companyName} Logo`}
    className="
      h-7 sm:h-8
      max-w-[120px] sm:max-w-[160px] md:max-w-[180px]
      object-contain
    "
  />

  {/* Navigation - NUR Menü-Items unterschiedlich */}
  <nav>
    {/* Auf Home: Features | Tarife | Über uns */}
    {/* Auf Taxiunternehmen: Leistungen | Vorteile | Kontakt */}
    {/* etc. - IMMER gleicher Style, nur Text unterschiedlich */}
  </nav>

  {/* CTA Button - IMMER gleich */}
  <MarketingButton marketingVariant="hero-primary">Jetzt abonnieren</MarketingButton>
</header>
```

**KRITISCH:**

- Logo NIEMALS ohne `max-width` (siehe `LOGO_OVERFLOW_FIX_V18.5.1_SUMMARY.md`)
- Gradient IMMER `from-primary via-primary/95 to-secondary/20`
- Höhe IMMER `h-16 sm:h-20`

---

### 2. FOOTER (SYSTEMWEIT IDENTISCH)

**Datei:** `src/components/auth/AuthFooter.tsx`

**Specs:**

```tsx
<footer
  className="
  bg-gradient-to-b from-primary/95 via-primary/90 to-secondary/20
  border-t border-primary/20
  pt-12 sm:pt-16 pb-6
"
>
  {/* 4-Spalten-Grid - Inhalte können unterschiedlich sein */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    <div>Produkt</div>
    <div>Unternehmen</div>
    <div>Support</div>
    <div>Rechtliches</div>
  </div>

  {/* Footer-Bottom - IMMER identisch */}
  <div className="border-t border-primary-foreground/10 pt-6 mt-8">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <p className="text-primary-foreground/70 text-sm">
        © 2025 MyDispatch.de by Roitsch Solutions
      </p>
      <div className="flex gap-4">{/* Social Links */}</div>
    </div>
  </div>
</footer>
```

**KRITISCH:**

- Gradient IMMER `from-primary/95 via-primary/90 to-secondary/20`
- Text-Farbe IMMER `text-primary-foreground` (nicht `text-foreground`!)
- Copyright IMMER gleich

---

### 3. BUTTONS (SYSTEMWEIT IDENTISCH)

**Quelle:** `src/components/design-system/MarketingButton.tsx`

**Varianten:**

```tsx
// Hero-Bereich (dunkler Hintergrund)
<MarketingButton marketingVariant="hero-primary">
  Jetzt abonnieren
</MarketingButton>

<MarketingButton marketingVariant="hero-secondary">
  Mehr erfahren
</MarketingButton>

// CTA-Bereiche (heller Hintergrund)
<MarketingButton marketingVariant="cta-primary">
  Kostenlos testen
</MarketingButton>

<MarketingButton marketingVariant="cta-secondary">
  Kontakt aufnehmen
</MarketingButton>
```

**VERBOTEN:**

```tsx
// ❌ NIEMALS Standard-Button auf Marketing-Seiten
<Button variant="default">Click</Button>

// ❌ NIEMALS direkte Styles
<button className="bg-primary text-foreground">Click</button>
```

---

### 4. BADGES (SYSTEMWEIT IDENTISCH)

**Specs:**

```tsx
<Badge
  className="
  text-xs sm:text-sm
  px-3 sm:px-4 py-1 sm:py-1.5
  bg-primary text-foreground
  border-none font-semibold
"
>
  Made in Germany
</Badge>
```

**Varianten:**

- `bg-primary text-foreground` - Haupt-Badge
- `bg-secondary text-secondary-foreground` - Sekundär
- `bg-status-success text-status-success-foreground` - Erfolg

---

### 5. CARDS (SYSTEMWEIT IDENTISCH)

**Feature-Cards (Home-Seite):**

```tsx
<Card
  className="
  p-4 sm:p-6
  rounded-xl
  shadow-md hover:shadow-2xl
  border border-border/50 hover:border-primary/40
  hover:-translate-y-1
  transition-all duration-300
"
>
  {/* Icon-Box */}
  <div
    className="
    p-2 sm:p-3
    bg-secondary rounded-lg
    shadow-md
  "
  >
    <Icon name="Car" className="h-6 w-6 sm:h-8 sm:w-8 text-secondary-foreground" />
  </div>

  {/* Title */}
  <h3 className="text-base sm:text-lg font-bold text-foreground">Feature-Titel</h3>

  {/* Description */}
  <p className="text-xs sm:text-sm text-muted-foreground">Feature-Beschreibung</p>
</Card>
```

---

### 6. ICONS (SYSTEMWEIT IDENTISCH)

**Quelle:** `src/components/design-system/Icon.tsx`

**STRIKTE REGEL:**

```tsx
// ✅ RICHTIG - Über Icon-Komponente
import { Icon } from '@/components/design-system';

<Icon name="Car" className="text-foreground" />
<Icon name="Check" className="text-muted-foreground" />

// ❌ VERBOTEN - Direkte Lucide-Imports
import { Car } from 'lucide-react';
<Car className="text-green-500" />
```

**Erlaubte Farben:**

- `text-foreground` (Standard)
- `text-muted-foreground` (Deaktiviert)
- `text-primary-foreground` (Auf Primary-Hintergrund)
- `text-secondary-foreground` (Auf Secondary-Hintergrund)

**VERBOTEN:**

- ❌ `text-status-success` / `text-green-*`
- ❌ `text-status-warning` / `text-yellow-*`
- ❌ `text-status-error` / `text-red-*`

---

### 7. HERO-GRAFIK (PERFEKT ERSTELLT)

**Datei:** `src/assets/hero-dashboard-screenshot-fixed.jpg`

**Specs:**

- **Auflösung:** 1920x1080 (16:9)
- **Format:** JPG (optimiert)
- **Inhalt:** MyDispatch Dashboard-Screenshot in Browser-Fenster
- **KRITISCH:** Browser-Tab-Bereich VOLLSTÄNDIG ausgefüllt (kein grauer Rand!)

**Verwendung:**

```tsx
import heroDashboard from "@/assets/hero-dashboard-screenshot-fixed.jpg";

<div className="relative w-full max-w-2xl">
  {/* Glow Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/30 rounded-3xl blur-3xl opacity-50" />

  {/* Frame */}
  <div className="relative bg-gradient-to-br from-secondary/10 to-secondary/5 backdrop-blur-sm p-3 rounded-2xl border border-primary/20 shadow-[0_20px_60px_-15px_rgba(234,222,189,0.3)]">
    <img
      src={heroDashboard}
      alt="MyDispatch Echtzeit-Dashboard"
      className="w-full h-auto object-cover rounded-xl"
      loading="eager"
    />
  </div>
</div>;
```

---

### 8. ANIMATIONEN (SYSTEMWEIT IDENTISCH)

**Quelle:** `tailwind.config.ts`

```tsx
// Fade-In für Section-Content
<div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
  Content
</div>

// Hover-Effects für Cards
<Card className="hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">

// Hover-Effects für Buttons
<Button className="hover:shadow-[0_0_40px_rgba(234,222,189,0.6)] transition-all duration-300">
```

---

### 9. SPACING (SYSTEMWEIT IDENTISCH)

**Mobile-First Pattern:**

```tsx
// Section Padding
<section className="py-12 sm:py-16 md:py-20">

// Card Padding
<Card className="p-4 sm:p-6 md:p-8">

// Grid Gap
<div className="grid gap-4 sm:gap-6 md:gap-8">

// Text Spacing
<div className="space-y-3 sm:space-y-4 md:space-y-6">
```

---

### 10. TYPOGRAFIE (SYSTEMWEIT IDENTISCH)

**Quelle:** `src/index.css`

```tsx
// Hero Headline (Primary - Golden)
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
  MyDispatch
</h1>

// Hero Headline (Secondary - White auf Dark)
<h1 className="hero-headline-secondary">
  Die führende Software
</h1>

// Hero Subtext
<p className="hero-subtext text-base sm:text-lg md:text-xl">
  Subtext
</p>

// Section Headline
<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
  Section Title
</h2>

// Card Title
<h3 className="text-base sm:text-lg font-bold text-foreground">
  Card Title
</h3>

// Body Text
<p className="text-xs sm:text-sm text-muted-foreground">
  Description
</p>
```

---

## 🚫 VERBOTENE PATTERNS

### 1. DESIGN-SYSTEM VIOLATIONS

```tsx
// ❌ NIEMALS direkte Farben
<div className="bg-white text-black">
<div className="text-[#eadebd]">
<div style={{ backgroundColor: '#323d5e' }}>

// ✅ IMMER Semantic Tokens
<div className="bg-background text-foreground">
<div className="text-primary">
<div className="bg-secondary">
```

---

### 2. BUTTON-SYSTEM VIOLATIONS

```tsx
// ❌ NIEMALS Standard-Buttons auf Marketing
<Button variant="default">Click</Button>

// ❌ NIEMALS Custom-Styles
<button className="bg-primary hover:bg-primary/90">

// ✅ IMMER MarketingButton
<MarketingButton marketingVariant="hero-primary">Click</MarketingButton>
```

---

### 3. ICON-SYSTEM VIOLATIONS

```tsx
// ❌ NIEMALS direkte Lucide-Imports
import { Check } from 'lucide-react';
<Check className="text-green-500" />

// ❌ NIEMALS Status-Farben auf Icons
<Icon name="Check" className="text-status-success" />

// ✅ IMMER Icon-Komponente mit CI-Farben
<Icon name="Check" className="text-foreground" />
```

---

### 4. LOGO-SYSTEM VIOLATIONS

```tsx
// ❌ NIEMALS Logo ohne max-width
<img src={logo} className="h-8" />

// ❌ NIEMALS Logo + Text (Redundanz)
<div>
  <img src={logo} />
  <span>MyDispatch</span>
</div>

// ✅ IMMER Logo mit strikter max-width
<img
  src={logo}
  className="h-7 sm:h-8 max-w-[120px] sm:max-w-[160px] md:max-w-[180px] object-contain"
/>
```

---

## ✅ IMPLEMENTATION WORKFLOW

### Neue öffentliche Seite erstellen (Step-by-Step)

**1. Home-Seite als Basis kopieren**

```bash
cp src/pages/Home.tsx src/pages/NeueSeite.tsx
```

**2. Inhalte anpassen (NUR Texte/Daten ändern)**

```tsx
// ❌ NICHT Design ändern
// ❌ NICHT neue Button-Varianten erstellen
// ❌ NICHT neue Farben verwenden

// ✅ NUR Inhalte ändern
const features = [
  { title: "Neue Feature", description: "..." },
  // ... angepasste Inhalte
];
```

**3. Header/Footer/Navigation anpassen**

```tsx
// MarketingLayout mit currentPage
<MarketingLayout currentPage="neue-seite">{/* Inhalt */}</MarketingLayout>
```

**4. SEO-Meta-Tags anpassen**

```tsx
<SEOHead title="Neue Seite - MyDispatch" description="..." canonical="/neue-seite" />
```

**5. Route registrieren**

```tsx
// src/routes.config.tsx
{
  path: '/neue-seite',
  element: <NeueSeite />,
  isPublic: true
}
```

---

## 📊 QUALITY CHECKLIST (PRE-DEPLOYMENT)

### Design-System Compliance

```
[ ] MarketingButton verwendet (nicht Button)
[ ] Icon-Komponente verwendet (nicht Lucide direkt)
[ ] Semantic Tokens verwendet (keine direkten Farben)
[ ] Header 1:1 identisch mit Home (nur Menü unterschiedlich)
[ ] Footer 1:1 identisch mit Home
[ ] Logo mit max-width (120px/160px/180px)
[ ] Animationen identisch (animate-fade-in, hover-effects)
[ ] Spacing identisch (py-12 sm:py-16 md:py-20)
[ ] Typografie identisch (hero-headline-secondary, hero-subtext)
[ ] Cards identisch (shadow-md, hover:shadow-2xl, hover:-translate-y-1)
```

### Mobile-First Compliance

```
[ ] Touch-Targets min-h-[44px]
[ ] Responsive Breakpoints (mobile/tablet/desktop)
[ ] Mobile-Ansicht getestet (375px, 414px, 768px)
[ ] Tablet-Ansicht getestet (1024px)
[ ] Desktop-Ansicht getestet (1920px)
```

### Rechtliche Compliance

```
[ ] Impressum verlinkt (Footer)
[ ] Datenschutz verlinkt (Footer)
[ ] AGB verlinkt (Footer)
[ ] DSGVO-Hinweise bei Formularen
[ ] Cookie-Banner implementiert
```

---

## 🔗 VERKNÜPFTE DOKUMENTE

Diese Vorgaben basieren auf:

- `HOMEPAGE_KONZEPT_V18.5.0.md` - Struktur & Inhalte
- `HEADER_FOOTER_UNIFIED_V18.5.1.md` - Header/Footer Specs
- `BUTTON_USAGE_GUIDE_V18.5.0.md` - Button-Varianten
- `SYSTEM_DESIGN_PRINCIPLES_V18.5.0.md` - Design-System
- `UI_LIBRARY_SYSTEM_V18.5.0.md` - UI-Komponenten
- `LOGO_OVERFLOW_FIX_V18.5.1_SUMMARY.md` - Logo-Specs

---

## 📈 SUCCESS METRICS

| Metrik                   | Zielwert | Prüfung         |
| ------------------------ | -------- | --------------- |
| Design-System Compliance | 100%     | Visueller Check |
| Button-System Compliance | 100%     | Code Review     |
| Icon-System Compliance   | 100%     | Code Review     |
| Mobile-First Compliance  | 100%     | Device Testing  |
| Lighthouse Score         | > 90     | Automated       |
| WCAG AA Kontrast         | 100%     | Automated       |

---

## 🚀 ROLLOUT-PLAN

### Phase 1: Kritische Seiten (Woche 1)

- [x] Home (Master-Template)
- [ ] Taxiunternehmen
- [ ] Mietwagenunternehmen
- [ ] Impressum
- [ ] Datenschutz
- [ ] AGB

### Phase 2: Erweiterte Seiten (Woche 2)

- [ ] Fahrer-Info
- [ ] Partner-Info
- [ ] Widerrufsrecht
- [ ] Cookie-Richtlinie

### Phase 3: Optimierung (Woche 3)

- [ ] Performance-Optimierung
- [ ] SEO-Optimierung
- [ ] A/B-Testing Setup
- [ ] Analytics Integration

---

**KRITISCH:** Diese Vorgaben sind SYSTEMWEIT und AUSNAHMSLOS zu befolgen. Jede Abweichung muss dokumentiert und genehmigt werden.

**Version:** 18.5.1  
**Datum:** 2025-10-23  
**Status:** 🔴 PRODUCTION-READY & VERPFLICHTEND
