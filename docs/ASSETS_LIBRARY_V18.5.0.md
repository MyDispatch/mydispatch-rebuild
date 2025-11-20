# ASSETS LIBRARY V18.5.0

> **Version:** 18.5.0  
> **Status:** ✅ PRODUCTION-READY  
> **Letzte Aktualisierung:** 2025-10-22

---

## 🎯 ÜBERSICHT

MyDispatch-spezifische Assets mit höchster Qualität, CI-konform und individuell erstellt.

---

## 📁 AKTUELLE ASSETS

```
src/assets/
├── hero-dashboard-screenshot.jpg         # Hero Dashboard-Screenshot (1920x1080)
└── [Weitere Assets folgen]
```

---

## 🎨 GRAFIK-ANFORDERUNGEN

**KRITISCH:** Alle Grafiken müssen MyDispatch-bezogen und CI-konform sein!

### ✅ PFLICHT-KRITERIEN

- **Individuell:** Keine Stock-Fotos oder generische Illustrationen
- **MyDispatch-Bezug:** Dashboard-Screenshots, Code-Beispiele, GPS-Tracking
- **CI-Farben:** Ausschließlich Primary (#323D5E), Foreground (#EADEBD), Accent
- **CI-Icons:** Nur Lucide Icons in text-foreground
- **Realistische Daten:** Echte Fahrzeuge, Aufträge, Kunden (keine Platzhalter)
- **Professionell:** Hochauflösend, optimiert, SEO-freundlich

---

## 🖼️ LOGOS

### Official Logo

**Datei:** `src/assets/mydispatch-logo-official.png`  
**Verwendung:** Header, Footer, Marketing  
**Format:** PNG mit Transparenz  
**Größe:** 300x80px (3:1 Ratio)

```tsx
import officialLogo from "@/assets/mydispatch-logo-official.png";

<img src={officialLogo} alt="MyDispatch - simply arrive" className="h-10 object-contain" />;
```

### White Logo (für dunkle Hintergründe)

**Datei:** `src/assets/mydispatch-logo-white.png`  
**Verwendung:** Dark-Mode, Video-Hero  
**Format:** PNG mit Transparenz

```tsx
import whiteLogo from "@/assets/mydispatch-logo-white.png";

<img src={whiteLogo} alt="MyDispatch" className="h-10 object-contain" />;
```

### Favicon/Icon

**Datei:** `src/assets/mydispatch-logo-icon.png`  
**Verwendung:** Browser-Tab, App-Icon  
**Format:** PNG, quadratisch  
**Größen:** 16x16, 32x32, 192x192, 512x512

---

## 🎨 HERO ASSETS

### Video Background

**URL:** `https://videos.pexels.com/video-files/9520622/9520622-uhd_2732_1440_25fps.mp4`  
**Typ:** Taxi/Verkehr-Video  
**Verwendung:** Hero-Section Background

```tsx
<video
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 w-full h-full object-cover"
  style={{ filter: "brightness(0.5)" }}
>
  <source
    src="https://videos.pexels.com/video-files/9520622/9520622-uhd_2732_1440_25fps.mp4"
    type="video/mp4"
  />
</video>
```

### Fallback Gradient

**CSS:** `linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--primary)) 100%)`  
**Verwendung:** Wenn Video nicht lädt

```tsx
<div className="absolute inset-0 bg-gradient-to-br from-foreground to-primary"></div>
```

---

## 🎯 FEATURE-ILLUSTRATIONEN

### Dispatch Management

**Datei:** `src/assets/images/features/feature-dispatch.svg`  
**Icon:** `ClipboardList` (Lucide)  
**Beschreibung:** Auftragsverwaltung-Illustration

### Fleet Management

**Datei:** `src/assets/images/features/feature-fleet.svg`  
**Icon:** `Car` (Lucide)  
**Beschreibung:** Fuhrparkverwaltung-Illustration

### Driver Management

**Datei:** `src/assets/images/features/feature-drivers.svg`  
**Icon:** `Users` (Lucide)  
**Beschreibung:** Fahrermanagement-Illustration

### Billing

**Datei:** `src/assets/images/features/feature-billing.svg`  
**Icon:** `Receipt` (Lucide)  
**Beschreibung:** Rechnungswesen-Illustration

---

## 🌟 ICONS (Lucide React)

### Installation

```bash
npm install lucide-react
```

### Verwendung

```tsx
import {
  Home,
  Car,
  Users,
  Receipt,
  Settings,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Check,
  X,
  AlertCircle,
  Info,
  HelpCircle,
} from "lucide-react";

<Home className="h-5 w-5 text-foreground" />;
```

### Icon-Größen

```tsx
// Small (16px)
<Icon className="h-4 w-4" />

// Medium (20px) - Standard
<Icon className="h-5 w-5" />

// Large (24px)
<Icon className="h-6 w-6" />

// Extra Large (32px)
<Icon className="h-8 w-8" />
```

### Icon-Farben (Semantic Tokens)

```tsx
// Foreground (Standard)
<Icon className="text-foreground" />

// Muted (Sekundär)
<Icon className="text-muted-foreground" />

// Primary (Akzent)
<Icon className="text-primary" />

// Status (NUR in Badges/StatusIndicator!)
<Icon className="text-status-success" />
```

---

## 📸 MARKETING-BILDER

### Dashboard Preview

**Datei:** `src/assets/images/marketing/dashboard-preview.png`  
**Größe:** 1920x1080px  
**Verwendung:** Feature-Showcase

```tsx
import dashboardPreview from "@/assets/images/marketing/dashboard-preview.png";

<img
  src={dashboardPreview}
  alt="MyDispatch Dashboard Übersicht"
  className="rounded-xl shadow-2xl"
/>;
```

### Mobile App Preview

**Datei:** `src/assets/images/marketing/mobile-app.png`  
**Größe:** 750x1334px (iPhone-Ratio)  
**Verwendung:** Mobile-Feature Showcase

### Statistics Chart

**Datei:** `src/assets/images/marketing/statistics-chart.png`  
**Größe:** 1200x800px  
**Verwendung:** Analytics-Feature

---

## 🏢 TESTIMONIAL-LOGOS

### Company Logos

**Verzeichnis:** `src/assets/images/testimonials/`  
**Format:** PNG mit Transparenz  
**Größe:** 200x100px (2:1 Ratio)  
**Farbe:** Grayscale (Filter in CSS)

```tsx
import companyLogo from "@/assets/images/testimonials/company-1.png";

<img
  src={companyLogo}
  alt="Taxi München GmbH"
  className="h-12 grayscale hover:grayscale-0 transition-all"
/>;
```

---

## 🎬 VIDEO-ASSETS

### Product Demo

**Datei:** `src/assets/videos/demo-walkthrough.mp4`  
**Länge:** ~2 Minuten  
**Verwendung:** Product-Tour

```tsx
<video controls className="w-full rounded-xl shadow-2xl">
  <source src="/videos/demo-walkthrough.mp4" type="video/mp4" />
</video>
```

---

## 🎨 GRADIENT-DEFINITIONEN

### Primary Gradient

```css
background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-glow)) 100%);
```

### Hero Gradient

```css
background: linear-gradient(180deg, rgba(234, 222, 189, 0.1) 0%, rgba(50, 61, 94, 0.05) 100%);
```

### Dark Overlay (Video)

```css
background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%);
```

---

## 📐 IMAGE OPTIMIERUNG

### Responsive Images

```tsx
<img
  src={image}
  srcSet={`
    ${imageSmall} 640w,
    ${imageMedium} 1024w,
    ${imageLarge} 1920w
  `}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Description"
  loading="lazy"
/>
```

### Image Compression

- **JPG:** 85% Qualität für Photos
- **PNG:** TinyPNG für Logos/Grafiken
- **SVG:** SVGO für Vektorgrafiken
- **WebP:** Als Alternative zu JPG/PNG

---

## 🔄 PLACEHOLDER & FALLBACKS

### Image Loading Placeholder

```tsx
<div className="bg-muted animate-pulse rounded-lg" style={{ aspectRatio: "16/9" }} />
```

### Avatar Placeholder

```tsx
import { User } from "lucide-react";

<div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
  <User className="h-5 w-5 text-muted-foreground" />
</div>;
```

### Logo Fallback

```tsx
<div className="h-10 w-40 bg-primary/20 rounded-md flex items-center justify-center">
  <span className="text-sm font-bold text-foreground">MyDispatch</span>
</div>
```

---

## 🚀 PERFORMANCE-OPTIMIERUNG

### Lazy Loading

```tsx
<img src={image} alt="Description" loading="lazy" decoding="async" />
```

### WebP mit Fallback

```tsx
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <source srcSet="image.jpg" type="image/jpeg" />
  <img src="image.jpg" alt="Description" />
</picture>
```

### Icon-Sprites (für wiederkehrende Icons)

```tsx
// Verwende Lucide React statt Icon-Sprites
// Bessere Tree-Shaking, kleinere Bundle-Size
```

---

## 📋 ASSET-CHECKLISTE

### Vor Deployment

- [ ] Alle Bilder komprimiert (JPG: 85%, PNG: TinyPNG)
- [ ] Alt-Texte für alle Bilder vorhanden
- [ ] Lazy-Loading aktiviert
- [ ] Responsive Sizes definiert
- [ ] Fallbacks für Videos vorhanden
- [ ] Logos in allen Größen vorhanden
- [ ] WebP-Versionen erstellt

### SEO-Optimierung

- [ ] Beschreibende Dateinamen (`hero-background.jpg` statt `IMG_1234.jpg`)
- [ ] Alt-Texte mit Keywords
- [ ] Image-Schema.org Markup
- [ ] Sitemap mit Images

---

## 🔗 EXTERNE RESSOURCEN

### Stock-Photos

- **Pexels:** https://www.pexels.com/ (Kostenlos)
- **Unsplash:** https://unsplash.com/ (Kostenlos)
- **Pixabay:** https://pixabay.com/ (Kostenlos)

### Icon-Libraries

- **Lucide:** https://lucide.dev/ (Installiert)
- **Heroicons:** https://heroicons.com/ (Optional)

### Video-Background

- **Pexels Videos:** https://www.pexels.com/videos/
- **Mixkit:** https://mixkit.co/free-stock-video/

### Tools

- **TinyPNG:** https://tinypng.com/ (Compression)
- **SVGOMG:** https://jakearchibald.github.io/svgomg/ (SVG Optimization)
- **Squoosh:** https://squoosh.app/ (Image Optimization)

---

## 🔗 VERKNÜPFTE DOKUMENTE

- [UI_COMPONENTS_LIBRARY_V18.5.0.md](./UI_COMPONENTS_LIBRARY_V18.5.0.md)
- [DESIGN_SYSTEM_V18.5.0.md](./DESIGN_SYSTEM_V18.5.0.md)
- [ICON_SYSTEM_V18.3.24.md](./ICON_SYSTEM_V18.3.24.md)

---

**Letzte Aktualisierung:** 2025-10-22 22:40 (DE)  
**Version:** 18.5.0  
**Status:** ✅ PRODUCTION-READY
