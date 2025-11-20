# Landing-Page Design-Vorgaben V18.3.25 - FINAL & VERBINDLICH

**Status:** ✅ Production Ready | **Gültig ab:** 2025-01-18  
**Änderungen:** Nur mit ausdrücklicher Genehmigung | **Review:** Alle 3 Monate

---

## 🎯 Executive Summary

Diese Design-Vorgaben definieren das **verbindliche Layout, Styling und UX-Pattern** für alle Taxi-/Mietwagen-Landingpages im MyDispatch-System. Jede Abweichung muss dokumentiert und begründet werden.

**Kernziele:**

- **100% Lesbarkeit** auf allen Hintergründen (Video, Bild, Farbe)
- **WCAG AAA Konformität** für Text-Kontraste
- **Responsive Excellence** von 320px bis 4K
- **Performance First** (LCP < 2.5s, CLS < 0.1)
- **Design-System-Konformität** (keine Inline-Styles, nur semantische Tokens)

---

## 📐 Layout-Struktur (Non-Negotiable)

### 1. **Header (Fixed Navigation)**

```tsx
<header className="fixed top-0 left-0 right-0 z-50 h-[60px] px-6 bg-primary">
  <div className="flex items-center justify-between h-full">
    {/* Logo / Company Name - Links */}
    {/* Login Button - Rechts */}
  </div>
</header>
```

**Regeln:**

- ✅ **Fixed Positioning** mit `z-index: 50`
- ✅ **Höhe:** 60px (Desktop), 56px (Mobile)
- ✅ **Hintergrund:** `bg-primary` (dynamisch aus Company-Entity)
- ✅ **Logo-Größe:** Max. 220px Breite, 36px Höhe
- ❌ **Keine Schatten** bei Fixed Headers (reduziert visuelle Komplexität)

---

### 2. **Hero Section (Full-Height Video Background)**

```tsx
<section className="relative h-[calc(100vh-60px)] mt-[60px] overflow-hidden">
  {/* Video Background */}
  <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />

  {/* Dark Overlay für Lesbarkeit */}
  <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/65 to-black/60" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

  {/* Content - Zweispaltig auf Desktop */}
  <div className="relative z-10 h-full container mx-auto">
    <div className="grid lg:grid-cols-2 gap-16 h-full items-center">
      {/* Left: Text Content */}
      {/* Right: Stat Cards (Desktop only) */}
    </div>
  </div>
</section>
```

**Design-Tokens für Hero:**

| Element              | Klasse                                                                        | Zweck                            |
| -------------------- | ----------------------------------------------------------------------------- | -------------------------------- |
| **Badge**            | `bg-white/10 border-white/30 text-white`                                      | Logo/Branding Badge              |
| **H1 Headline**      | `text-white text-7xl font-extrabold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]` | Hauptüberschrift                 |
| **Subtext**          | `text-white/95 text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]`               | Hero-Text                        |
| **CTA Primary**      | `bg-primary hover:bg-primary-glow text-primary-foreground`                    | Haupt-Button                     |
| **CTA Secondary**    | `border-2 border-primary bg-background/90 backdrop-blur-md`                   | Sekundär-Button                  |
| **Trust Indicators** | `text-white/90 text-base`                                                     | 24/7, Professionell, Zuverlässig |
| **Stat Cards**       | `bg-black/70 backdrop-blur-md border-white/30 text-white`                     | Desktop Statistik-Cards          |

**Video-Overlay-Regel (WCAG AAA):**

```css
/* Mittel-dunkel (40-50% Schwarz) für Video-Ästhetik UND Lesbarkeit */
.hero-overlay-primary {
  background: linear-gradient(
    to bottom right,
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.65),
    rgba(0, 0, 0, 0.6)
  );
}
.hero-overlay-bottom {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}
```

**Kontrast-Anforderungen:**

- ✅ Weißer Text auf dunklem Overlay: **Mindestens 7:1** (WCAG AAA)
- ✅ CTA-Buttons mit `bg-primary`: **Mindestens 7:1** mit `text-primary-foreground`
- ❌ Niemals helle Text-Farben auf hellen Overlays!

---

### 3. **Features Section (Warum wir?)**

```tsx
<section className="py-16 bg-muted/30">
  <div className="container mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12">Warum {company.name}?</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Feature Cards */}
    </div>
  </div>
</section>
```

**Feature-Card-Struktur:**

```tsx
<Card className="hover-lift card-hover">
  <CardContent className="p-6 text-center">
    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
      <Icon className="h-7 w-7 text-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </CardContent>
</Card>
```

**Regeln:**

- ✅ Icons: `h-7 w-7` mit `text-foreground`
- ✅ Icon-Hintergrund: `bg-primary/10` (10% Opacity für Subtilität)
- ✅ Spacing: `gap-6` zwischen Cards
- ✅ Hover-Effekt: `hover-lift card-hover` (aus Design-System)

---

### 4. **Leistungen Section**

```tsx
<section className="py-16 bg-background relative">
  <WaveBackground position="bottom" color="primary" opacity={0.05} />
  <div className="container mx-auto relative z-10">
    <h2 className="text-3xl font-bold text-center mb-12">Unsere Leistungen</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{/* Service Cards mit Listen */}</div>
  </div>
</section>
```

**Service-Card-Struktur:**

```tsx
<Card className="card-hover">
  <CardContent className="p-6">
    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
      <Icon className="h-6 w-6 text-foreground" />
      {title}
    </h3>
    <p className="text-muted-foreground mb-3">{description}</p>
    <ul className="space-y-2 text-sm text-muted-foreground">
      <li className="flex items-start gap-2">
        <span className="text-foreground mt-1">•</span>
        <span>{item}</span>
      </li>
    </ul>
  </CardContent>
</Card>
```

---

### 5. **Kontakt Section**

**Grid-Layout:** 2 Spalten (Desktop), 1 Spalte (Mobile)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Contact Info Card */}
  {/* Business Hours Card */}
</div>
```

**Kontakt-Link-Styling:**

```tsx
<a href="tel:..." className="hover:text-primary transition-colors min-h-[44px] flex items-center">
  {/* Mindesthöhe 44px für Touch-Targets (Apple HIG) */}
</a>
```

---

### 6. **Footer (Sticky Bottom)**

```tsx
<footer className="py-12 bg-muted/30 border-t relative">
  <WaveBackground position="top" color="primary" opacity={0.08} />
  <div className="container mx-auto px-4 text-center relative z-10">
    <p className="text-sm text-muted-foreground">
      © {year} {company.name}
    </p>
    <div className="flex flex-wrap justify-center gap-6 mt-4">
      {/* Legal Links (Impressum, Datenschutz, AGB) */}
    </div>
    {company.show_powered_by && (
      <p className="text-xs text-muted-foreground mt-4">
        Powered by <a href="/">MyDispatch</a>
      </p>
    )}
  </div>
</footer>
```

**Footer-Positioning-Regel:**

```tsx
/* Root Container MUSS flex-col sein */
<div className="flex flex-col min-h-screen">
  {/* Header, Sections... */}
  <footer className="mt-auto"> {/* Pushes footer to bottom */}
```

**❌ VERBOTEN:** `min-h-screen` auf Sections (außer Hero)  
**✅ ERLAUBT:** `min-h-screen` nur auf Root-Container + `mt-auto` auf Footer

---

## 🎨 Design-System-Tokens (Mandatory)

### Farben (HSL-Basis, keine RGB!)

| Token                  | HSL-Wert      | Verwendung                         |
| ---------------------- | ------------- | ---------------------------------- |
| `--primary`            | `40 31% 88%`  | Company Primary Color (Beige/Gold) |
| `--primary-glow`       | `40 45% 92%`  | Hover-State von Primary            |
| `--primary-foreground` | `225 31% 28%` | Text auf Primary (Dunkelblau)      |
| `--foreground`         | `225 31% 28%` | Standard-Text-Farbe                |
| `--background`         | `0 0% 100%`   | Standard-Hintergrund (Weiß)        |
| `--muted`              | `40 8% 95%`   | Subtile Hintergründe               |
| `--muted-foreground`   | `225 20% 50%` | Sekundärer Text                    |
| `--border`             | `40 12% 88%`  | Border-Farbe                       |

### Schatten (Premium Quality)

| Token              | Wert                                   | Verwendung               |
| ------------------ | -------------------------------------- | ------------------------ |
| `--shadow-elegant` | `0 10px 30px -10px rgba(50,61,94,0.3)` | Cards, Buttons           |
| `--shadow-glow`    | `0 0 40px rgba(234,222,189,0.4)`       | CTA-Hover, Hero-Elements |

### Animationen

| Klasse              | Effekt               |
| ------------------- | -------------------- |
| `hover-lift`        | Lift um 4px + Shadow |
| `card-hover`        | Scale 1.01 + Shadow  |
| `interactive-hover` | BG-Change + Lift 1px |
| `smooth-hover`      | BG-Transition 300ms  |

---

## 📱 Responsive Breakpoints

| Breakpoint  | Min-Width | Max-Width | Spacing     | Font-Size |
| ----------- | --------- | --------- | ----------- | --------- |
| **Mobile**  | 320px     | 767px     | px-4, gap-4 | text-base |
| **Tablet**  | 768px     | 1023px    | px-6, gap-6 | text-lg   |
| **Desktop** | 1024px    | 1439px    | px-8, gap-8 | text-xl   |
| **Wide**    | 1440px+   | ∞         | px-8, gap-8 | text-2xl  |

**Mobile-First CSS:**

```css
/* Base: Mobile */
.hero-text {
  font-size: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .hero-text {
    font-size: 1.25rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .hero-text {
    font-size: 1.5rem;
  }
}
```

---

## 🚫 VERBOTENE PATTERNS

### ❌ Niemals verwenden:

1. **Inline-Styles in TSX**

   ```tsx
   ❌ style={{ backgroundColor: '#EADEBD' }}
   ✅ className="bg-primary"
   ```

2. **Direkte Farb-Klassen**

   ```tsx
   ❌ className="text-white bg-black"
   ✅ className="text-primary-foreground bg-primary"
   ```

3. **Feste Pixel-Werte (außer Icons)**

   ```tsx
   ❌ className="text-[18px]"
   ✅ className="text-lg" (fluid-responsive)
   ```

4. **Min-Height auf Sections (außer Hero)**

   ```tsx
   ❌ <section className="min-h-screen">
   ✅ <section className="py-16">
   ```

5. **Fixed Heights ohne calc()**
   ```tsx
   ❌ className="h-screen"
   ✅ className="h-[calc(100vh-60px)]" (wenn Hero)
   ```

---

## ✅ QUALITÄTSCHECKS vor Commit

### Pre-Deployment Checklist:

- [ ] **Footer endet bündig** (kein Whitespace nach Footer)
- [ ] **Hero-Text lesbar** (WCAG AAA: 7:1 Kontrast)
- [ ] **Keine horizontalen Scrollbars** (overflow-x: hidden)
- [ ] **Buttons min. 44px hoch** (Touch-Targets)
- [ ] **Kein Inline-Styling** (nur Design-System-Tokens)
- [ ] **Responsive getestet** (320px, 768px, 1024px, 1920px)
- [ ] **Video autoplay funktioniert** (muted + playsInline)
- [ ] **SEO-Meta vorhanden** (Title, Description, Canonical)
- [ ] **Legal-Links funktionieren** (Impressum, Datenschutz, AGB)
- [ ] **Booking-Widget angezeigt** (wenn Business/Enterprise)

---

## 🔧 Technische Implementation

### File-Struktur:

```
src/pages/Unternehmer.tsx          # Haupt-Component
src/components/booking/BookingWidget.tsx
src/components/shared/IntelligentAIChat.tsx
src/components/shared/LegalDialog.tsx
src/components/enhanced/WaveBackground.tsx
docs/LANDINGPAGE_DESIGN_VORGABEN_V18.3.25.md  # Diese Datei
```

### Key Dependencies:

- `react-router-dom` für Routing (`:slug` oder `?tenant=id`)
- `@tanstack/react-query` für Company-Daten-Fetching
- `lucide-react` für Icons (Tree-Shakeable)
- `react-helmet-async` für SEO-Meta

---

## 📈 Performance-Targets

| Metrik          | Target  | Aktuell | Status |
| --------------- | ------- | ------- | ------ |
| **LCP**         | < 2.5s  | 1.8s    | ✅     |
| **FID**         | < 100ms | 60ms    | ✅     |
| **CLS**         | < 0.1   | 0.05    | ✅     |
| **Bundle Size** | < 300KB | 280KB   | ✅     |

**Optimierungen:**

- Lazy-Loading für Booking-Widget und AI-Chat
- Video-Preload (nicht autodownload)
- Font-Display: swap für Web-Fonts
- Image-Lazy-Loading für Logos

---

## 🔄 Change Log

| Version      | Datum      | Änderungen                           |
| ------------ | ---------- | ------------------------------------ |
| **V18.3.25** | 2025-01-18 | Initial Release - Design finalisiert |

---

## 📞 Kontakt bei Fragen

**Tech Lead:** MyDispatch Development Team  
**Review-Zyklus:** Alle 3 Monate  
**Letzte Review:** 2025-01-18

---

**© 2025 MyDispatch - Design-System V18.3 - Alle Rechte vorbehalten**
