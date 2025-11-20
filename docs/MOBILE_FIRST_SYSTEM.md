# MyDispatch Mobile-First Design System V18.3

## Meta-Vorgabe: Mobile First mit expliziter Tablet-Optimierung

**KRITISCH**: Alle Neuentwicklungen und Optimierungen müssen folgenden Workflow durchlaufen:

### 🎯 Drei-Säulen-Ansatz: Mobile → Tablet → Desktop

**PFLICHT:** Jede Komponente MUSS für ALLE drei Geräteklassen optimiert werden:

- 📱 **Mobile** (< 768px): Touch-First, kompakt, vertikal
- 📋 **Tablet** (768px - 1023px): Hybrid-Layout, moderate Dichte
- 💻 **Desktop** (≥ 1024px): Information-Dense, horizontal

### 1. Analyse-Phase (IMMER ZUERST)

- [ ] Alle betroffenen Dateien identifizieren
- [ ] Abhängigkeiten und Schnittstellen dokumentieren
- [ ] Bestehende Patterns prüfen (Mobile, Tablet, Desktop)
- [ ] Risikoanalyse durchführen
- [ ] Tablet-spezifische Anforderungen identifizieren

### 2. Planungs-Phase

- [ ] Design-Tokens definieren
- [ ] Templates erstellen
- [ ] Umsetzungsreihenfolge festlegen
- [ ] Test-Strategie planen

### 3. Template-Erstellung

- [ ] Basis-Templates für alle Komponententypen
- [ ] Utility-Klassen definieren
- [ ] Code-Snippets dokumentieren

### 4. Systemweite Umsetzung

- [ ] Alle Seiten/Komponenten anpassen
- [ ] Tests durchführen
- [ ] Dokumentation aktualisieren

---

## Mobile-First Design-Tokens

### Typografie (Mobile → Tablet → Desktop)

```tsx
// Headings - Drei-Stufen-System
h1: "text-2xl md:text-4xl lg:text-5xl xl:text-6xl"
//   Mobile: 24px | Tablet: 36px | Desktop: 48px | Large: 60px

h2: "text-xl md:text-3xl lg:text-4xl xl:text-5xl"
//   Mobile: 20px | Tablet: 30px | Desktop: 36px | Large: 48px

h3: "text-lg md:text-2xl lg:text-3xl xl:text-4xl"
//   Mobile: 18px | Tablet: 24px | Desktop: 30px | Large: 36px

h4: "text-base md:text-xl lg:text-2xl"
//   Mobile: 16px | Tablet: 20px | Desktop: 24px

h5: "text-sm md:text-lg lg:text-xl"
//   Mobile: 14px | Tablet: 18px | Desktop: 20px

// Body Text - Drei-Stufen-System
body-lg: "text-base md:text-lg lg:text-xl"
//        Mobile: 16px | Tablet: 18px | Desktop: 20px

body: "text-sm md:text-base lg:text-lg"
//     Mobile: 14px | Tablet: 16px | Desktop: 18px

body-sm: "text-xs md:text-sm lg:text-base"
//        Mobile: 12px | Tablet: 14px | Desktop: 16px

// Hero (Dark Background) - Drei-Stufen-System
hero-h1: "text-3xl md:text-5xl lg:text-6xl xl:text-7xl"
//        Mobile: 30px | Tablet: 48px | Desktop: 60px | Large: 72px

hero-subtitle: "text-base md:text-xl lg:text-2xl xl:text-3xl"
//              Mobile: 16px | Tablet: 20px | Desktop: 24px | Large: 30px

// 📋 TABLET-SPEZIFISCHE REGELN:
// - md: Breakpoint (768px) ist EXPLIZIT für Tablets
// - Tablets verwenden moderate Schriftgrößen (zwischen Mobile & Desktop)
// - Nie Mobile-Größen auf Tablet übernehmen!
// - Immer md: Prefix für Tablet-optimierte Typo verwenden
```

### Spacing (Mobile → Tablet → Desktop)

```tsx
// Section Padding - Drei-Stufen-System
section-py: "py-8 md:py-16 lg:py-20 xl:py-24"
//           Mobile: 32px | Tablet: 64px | Desktop: 80px | Large: 96px

section-px: "px-4 md:px-6 lg:px-8 xl:px-12"
//           Mobile: 16px | Tablet: 24px | Desktop: 32px | Large: 48px

// Container Max-Width - Drei-Stufen-System
container-mobile: "max-w-full px-4"
//                 Mobile: 100% mit 16px Padding

container-tablet: "md:max-w-3xl md:mx-auto"
//                 Tablet: 768px max, zentriert

container-desktop: "lg:max-w-5xl xl:max-w-7xl lg:mx-auto"
//                  Desktop: 1024px | Large: 1280px, zentriert

// Gaps - Drei-Stufen-System
gap-sm: "gap-2 md:gap-3 lg:gap-4"
//       Mobile: 8px | Tablet: 12px | Desktop: 16px

gap-md: "gap-3 md:gap-4 lg:gap-6"
//       Mobile: 12px | Tablet: 16px | Desktop: 24px

gap-lg: "gap-4 md:gap-6 lg:gap-8 xl:gap-10"
//       Mobile: 16px | Tablet: 24px | Desktop: 32px | Large: 40px

// Margins/Padding - Drei-Stufen-System
p-responsive: "p-4 md:p-6 lg:p-8"
//             Mobile: 16px | Tablet: 24px | Desktop: 32px

px-responsive: "px-4 md:px-6 lg:px-8 xl:px-12"
//              Mobile: 16px | Tablet: 24px | Desktop: 32px | Large: 48px

py-responsive: "py-4 md:py-6 lg:py-8 xl:py-12"
//              Mobile: 16px | Tablet: 24px | Desktop: 32px | Large: 48px

// 📋 TABLET-SPEZIFISCHE SPACING-REGELN:
// - Tablets haben 1.5x Mobile-Spacing
// - Desktop hat 2x Mobile-Spacing
// - Nie identische Werte für Mobile und Tablet!
// - md: Breakpoint MUSS für Tablet-Spacing gesetzt sein
```

### Touch-Targets (Apple HIG ≥44px)

```tsx
// Buttons
btn-base: "min-h-[44px] px-4 sm:px-6 py-2 sm:py-3"
btn-lg: "min-h-[44px] px-6 sm:px-8 py-3 sm:py-4"

// Interactive Elements
touch-target: "min-h-[44px] min-w-[44px]"
```

### Grid Layouts

```tsx
// Standard Grids
grid-1-2-3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
grid-1-2-4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
grid-2-4: "grid grid-cols-2 sm:grid-cols-4"

// Responsive Gaps
grid-gap: "gap-4 sm:gap-6"
```

---

## Component Templates

### 1. Hero Section Template

```tsx
<section className="min-h-[600px] md:min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
  <div className="max-w-5xl mx-auto text-center">
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-xs sm:text-sm">Badge Text</span>
      </div>

      {/* Heading */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
        Hero Title
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto px-2 sm:px-0">
        Hero Subtitle
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-8">
        <Button className="w-full sm:w-auto min-h-[44px]">Primary CTA</Button>
        <Button variant="outline" className="w-full sm:w-auto min-h-[44px]">
          Secondary CTA
        </Button>
      </div>
    </div>
  </div>
</section>
```

### 2. Feature Section Template

```tsx
<section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
  <div className="container mx-auto max-w-6xl">
    {/* Header */}
    <div className="text-center mb-8 sm:mb-12 md:mb-16">
      <Badge className="mb-3 sm:mb-4">Category</Badge>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
        Section Title
      </h2>
      <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
        Section Description
      </p>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {items.map((item, idx) => (
        <Card key={idx} className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
            <Badge className="text-[9px] sm:text-[10px]">Label</Badge>
          </div>
          <h3 className="text-base sm:text-lg font-bold mb-2">{item.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
        </Card>
      ))}
    </div>
  </div>
</section>
```

### 3. Card Template (Mobile-First)

```tsx
<Card className="p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
    <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
    </div>
    <div className="flex-1">
      <h3 className="text-sm sm:text-base font-bold mb-1 sm:mb-2">Title</h3>
      <p className="text-xs sm:text-sm text-muted-foreground">Description</p>
    </div>
  </div>
</Card>
```

### 4. Button Template

```tsx
// Primary Button
<Button className="w-full sm:w-auto min-h-[44px] px-4 sm:px-6 text-sm sm:text-base">
  <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
  Button Text
</Button>

// Icon Button
<Button size="icon" className="min-h-[44px] min-w-[44px]">
  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
</Button>
```

### 5. Form Template

```tsx
<form className="space-y-4 sm:space-y-6">
  <div className="space-y-1.5 sm:space-y-2">
    <Label className="text-xs sm:text-sm">Label</Label>
    <Input className="min-h-[44px] text-sm sm:text-base" />
  </div>

  <Button type="submit" className="w-full min-h-[44px]">
    Submit
  </Button>
</form>
```

---

## Compliance Checklist (ERWEITERT: Drei-Säulen-Ansatz)

### ✅ Jede Komponente muss für ALLE drei Geräteklassen erfüllen:

#### 📱 Mobile (< 768px) - PFLICHT:

- [ ] **Touch-Targets**: Alle interaktiven Elemente ≥44px (min-h-[44px])
- [ ] **Kompakte Typography**: text-sm, text-base (max)
- [ ] **Kompakte Spacing**: p-4, gap-3
- [ ] **Kleine Icons**: h-4 w-4, h-5 w-5 (max)
- [ ] **Full-Width Buttons**: w-full
- [ ] **Vertikale Layouts**: flex-col
- [ ] **Mobile Padding**: px-4 (max)
- [ ] **Readable Line Heights**: leading-relaxed

#### 📋 Tablet (768px - 1023px) - NEU & PFLICHT:

- [ ] **Touch-Targets**: Auch Tablets sind Touch! ≥44px (min-h-[44px])
- [ ] **Moderate Typography**: md:text-base, md:text-lg, md:text-xl
- [ ] **Moderate Spacing**: md:p-6, md:gap-4, md:gap-6
- [ ] **Mittlere Icons**: md:h-5 md:w-5, md:h-6 md:w-6
- [ ] **Hybride Buttons**: md:w-auto (nicht mehr full-width)
- [ ] **2-Spalten-Layouts**: md:grid-cols-2, md:flex-row
- [ ] **Tablet Padding**: md:px-6
- [ ] **Sidebar Collapsed**: w-16 auf Tablet (64px)
- [ ] **Bottom-Nav Hidden**: Auf Tablet versteckt

#### 💻 Desktop (≥ 1024px) - PFLICHT:

- [ ] **Information-Dense Typography**: lg:text-lg, lg:text-xl, lg:text-2xl
- [ ] **Großzügige Spacing**: lg:p-8, lg:gap-8, xl:gap-10
- [ ] **Große Icons**: lg:h-6 lg:w-6, lg:h-8 lg:w-8
- [ ] **Auto-Width Buttons**: lg:w-auto
- [ ] **Horizontale Layouts**: lg:flex-row, lg:grid-cols-3
- [ ] **Desktop Padding**: lg:px-8, xl:px-12
- [ ] **Sidebar Expanded**: lg:w-64 (240px)

### 🔗 Navigation & Links - SYSTEMWEIT:

- [ ] **Interne Links**: Verwende `<Link to="/path">` (react-router-dom)
- [ ] **Externe Links**: target="\_blank" rel="noopener noreferrer"
- [ ] **CTAs funktional**: Alle Buttons führen zu korrekten Zielen
- [ ] **Router Guards**: Auth-Protected Routes implementiert
- [ ] **Redirects**: Nach Login zu Dashboard, etc.
- [ ] **404 Fallback**: Fehlerseite für ungültige Routes
- [ ] **Deep Links**: Direkte Links zu Unterseiten funktionieren
- [ ] **AGB/Datenschutz**: Footer-Links korrekt verlinkt

---

## Umsetzungs-Reihenfolge

### Phase 1: Öffentliche Marketing-Seiten (PRIORITÄT)

1. ✅ Home.tsx (erledigt)
2. Pricing.tsx
3. Unternehmer.tsx
4. Contact.tsx
5. Docs.tsx
6. FAQ.tsx
7. Auth.tsx

### Phase 2: Layout-Komponenten

1. MarketingLayout.tsx
2. DashboardLayout.tsx
3. Header.tsx
4. Footer.tsx
5. AppSidebar.tsx
6. MobileBottomNav.tsx

### Phase 3: Interne App-Seiten

1. Dashboard/IndexNew.tsx
2. Auftraege.tsx
3. Kunden.tsx
4. Fahrer.tsx
5. Fahrzeuge.tsx
6. Rechnungen.tsx
7. Schichtzettel.tsx
8. Dokumente.tsx
9. Partner.tsx
10. Statistiken.tsx

### Phase 4: Mobile-Komponenten Review

1. Alle /components/mobile/\* prüfen
2. MobileGridLayout optimieren
3. MobileFormDialog optimieren
4. Touch-Targets validieren

---

## Testing-Strategie (ERWEITERT: Mobile + Tablet + Desktop)

### Device Tests - Drei-Säulen-Ansatz

#### 📱 Mobile (< 768px)

- iPhone SE (375px) ← Minimum
- iPhone 14 (390px)
- iPhone 14 Pro Max (430px)

#### 📋 Tablet (768px - 1023px)

- iPad Mini (768px) ← Tablet Minimum
- iPad (810px)
- iPad Pro 11" (834px)
- iPad Pro 12.9" (1024px)

#### 💻 Desktop (≥ 1024px)

- Laptop (1280px)
- Desktop (1440px)
- Large Desktop (1920px)
- 4K (2560px+)

### Playwright Tests (ERWEITERT)

```typescript
// tests/e2e/compliance/mobile-responsive.spec.ts
// Alle Tests müssen für ALLE drei Geräteklassen bestehen:

// Mobile Tests (< 768px)
// - Touch-Targets ≥44px
// - Mobile-Bottom-Nav 5 Items
// - Sidebar versteckt
// - Kompakte Abstände (gap-3)

// Tablet Tests (768px - 1023px) - NEU!
// - Touch-Targets ≥44px (Tablets sind Touch-Devices!)
// - Sidebar sichtbar, collapsed (64px)
// - Bottom-Nav versteckt
// - Moderate Abstände (gap-4, gap-6)
// - Hybride Layouts (2-Spalten-Grids)
// - Icons md:h-6 md:w-6

// Desktop Tests (≥ 1024px)
// - Sidebar expanded (240px)
// - Bottom-Nav versteckt
// - Information-Dense Layouts
// - Große Abstände (gap-8, gap-10)
```

### 📋 TABLET-KRITISCHE TEST-PUNKTE:

- [ ] Sidebar auf Tablet collapsed aber sichtbar?
- [ ] Touch-Targets auch auf Tablet ≥44px?
- [ ] Moderate Schriftgrößen (md: Prefix)?
- [ ] 2-Spalten-Layouts funktional?
- [ ] Keine Mobile-Layouts auf Tablet!
- [ ] Keine Desktop-Dichte auf Tablet!

---

## Code-Snippets Library

### Responsive Section Wrapper

```tsx
<section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-muted/20 to-background">
  <div className="container mx-auto max-w-6xl">{/* content */}</div>
</section>
```

### Responsive Heading Group

```tsx
<div className="text-center mb-8 sm:mb-12 md:mb-16">
  <Badge className="mb-3 sm:mb-4">Category</Badge>
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">Heading</h2>
  <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">Description</p>
</div>
```

### Responsive Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  {items.map((item) => (
    <Card key={item.id} className="p-4 sm:p-6">
      {/* content */}
    </Card>
  ))}
</div>
```

---

## Best Practices (ERWEITERT: Drei-Säulen-Ansatz)

### DO ✅ - Mobile (< 768px)

- Beginne IMMER mit Mobile-Werten (text-sm, p-4, gap-3)
- Min-Höhe 44px für alle Touch-Elemente
- w-full für Buttons
- flex-col für Layouts
- Teste auf iPhone SE (375px) ← MINIMUM
- Kompakte Abstände, große Touch-Targets

### DO ✅ - Tablet (768px - 1023px) - NEU!

- Verwende EXPLIZIT md: Prefix für Tablet-Werte
- Moderate Schriftgrößen (md:text-base, md:text-lg, md:text-xl)
- Moderate Spacing (md:p-6, md:gap-4, md:gap-6)
- Touch-Targets AUCH auf Tablet ≥44px!
- 2-Spalten-Layouts (md:grid-cols-2, md:flex-row)
- Hybride Button-Breiten (md:w-auto)
- Sidebar collapsed aber sichtbar (md:w-16)
- Teste auf iPad (768px) ← TABLET MINIMUM

### DO ✅ - Desktop (≥ 1024px)

- Verwende lg: und xl: Prefixes für Desktop/Large
- Information-Dense Layouts (lg:grid-cols-3, lg:grid-cols-4)
- Großzügige Spacing (lg:p-8, lg:gap-8, xl:gap-10)
- Sidebar expanded (lg:w-64 = 240px)
- Teste auf 1280px+ Displays

### DON'T ❌ - Kritische Anti-Patterns

- ❌ Keine fixen Größen ohne Breakpoints (text-2xl → FALSCH!)
- ❌ Keine Desktop-first Layouts
- ❌ Keine Touch-Targets <44px (auch nicht auf Tablet!)
- ❌ Keine horizontalen Scrolls auf Mobile
- ❌ Keine zu kleinen Icons auf Mobile (<16px)
- ❌ **NEU:** Keine identischen Werte für Mobile und Tablet!
- ❌ **NEU:** Kein Überspringen von md: Breakpoint (text-sm lg:text-xl)
- ❌ **NEU:** Keine Mobile-Layouts auf Tablet (w-full ohne md:w-auto)
- ❌ **NEU:** Keine Desktop-Dichte auf Tablet (zu kleine Abstände)

---

## Dokumentation Updates

Bei jeder Änderung:

1. Diese Datei aktualisieren
2. Sprint-Report ergänzen
3. Changelog pflegen
4. Tests anpassen

---

**Stand**: 2025-10-21
**Version**: V18.3
**Status**: Systemweite Implementierung läuft
