# 🎯 PUBLIC HOMEPAGE MIGRATION PLAN - V28.1 DESIGN SYSTEM

**Status:** 📋 ANALYSE PHASE  
**Target:** `src/pages/Home.tsx` (Public Landing Page)  
**Datum:** 2025-10-28  
**Regel:** **ERST PLANEN, DANN BAUEN!**

---

## 🔍 WICHTIGE UNTERSCHEIDUNG (USER-VORGABE)

**KRITISCHE REGEL FÜR ALLE ZUKÜNFTIGEN ARBEITEN:**

- **"Home"** = `src/pages/Home.tsx` - Public Homepage (Landing Page) für nicht-eingeloggte User
- **"Dashboard"** = `src/pages/Index.tsx` - Erste Seite NACH Login im App-Bereich

**Routing:**

```typescript
// Public Homepage (/)
{
  path: '/',
  component: lazy(() => import('@/pages/Home')),
  layout: 'none',
  protected: false
}

// Dashboard (/ nach Login)
{
  path: '/dashboard' oder Index nach Redirect,
  component: lazy(() => import('@/pages/Index')),
  protected: true
}
```

---

## 📋 HOMEPAGE VOLLSTÄNDIGE ANALYSE

---

## 📋 PRE-IMPLEMENTATION CHECKLIST

### 1. ANALYSE DURCHGEFÜHRT

- [ ] `src/pages/Index.tsx` vollständig gelesen
- [ ] Alle verwendeten Komponenten identifiziert
- [ ] Besondere Elemente (Dashboard-Grafik) analysiert
- [ ] V28.1 Design-System Dokumentation studiert
- [ ] Bestehende V28-Komponenten gecheckt (COMPONENT_REGISTRY.md)

### 2. MIGRATION SCOPE DEFINIERT

- [ ] Welche Komponenten müssen geändert werden?
- [ ] Welche Komponenten sind bereits V28.1-konform?
- [ ] Welche neuen Komponenten müssen erstellt werden?
- [ ] Welche Assets (Dashboard-Grafik) müssen angepasst werden?

### 3. DEPENDENCIES GECHECKT

- [ ] Alle Imports in filesExplorer.md vorhanden?
- [ ] Keine halluzinierten Komponenten geplant?
- [ ] Type-Safety überall gewährleistet?

---

## 🔍 HOMEPAGE ANALYSE (TO DO IN NEXT SESSION)

### Zu analysierende Bereiche:

#### 1. HERO SECTION

- **Aktuell:** Wahrscheinlich V26 Beige/Dunkelblau
- **Neu:** V28.1 Slate/Professional Minimalism
- **Besonderheit:** Dashboard-Grafik (Screenshot/Image)
- **Migration:**
  - [ ] Hero-Background auf V28.1 Gradient
  - [ ] Dashboard-Grafik auf V28.1 Styling anpassen
  - [ ] Spacing/Typography auf V28.1
  - [ ] Button-Styles auf V28Button

#### 2. FEATURE SECTIONS

- **Aktuell:** Zu prüfen
- **Neu:** V28MarketingSection + V28MarketingCard
- **Migration:**
  - [ ] Background-Pattern (white/canvas alternierend)
  - [ ] Card-Styling auf V28MarketingCard
  - [ ] Icons auf slate-700/slate-900
  - [ ] Feature-Listen mit V28FeatureListItem

#### 3. CTA SECTIONS

- **Aktuell:** Zu prüfen
- **Neu:** V28Button (primary/secondary)
- **Migration:**
  - [ ] Buttons auf V28Button
  - [ ] Hover-States auf V28.1
  - [ ] Spacing konsistent

#### 4. TRUST BADGES / TESTIMONIALS

- **Aktuell:** Zu prüfen
- **Neu:** V28MarketingCard oder Custom
- **Migration:**
  - [ ] Badge-Styling auf V28Badge
  - [ ] Card-Styling auf slate-border
  - [ ] Shadows auf shadow-lg/xl

---

## 🎨 V28.1 DESIGN-SYSTEM REGELN (REFRESH)

### Farben (ZWINGEND):

```typescript
PRIMARY_COLORS_V28 = {
  // Grays
  slate50: "rgb(248, 250, 252)",
  slate100: "rgb(241, 245, 249)",
  slate200: "rgb(226, 232, 240)",
  slate300: "rgb(203, 213, 225)",
  slate600: "rgb(71, 85, 105)",
  slate700: "rgb(51, 65, 85)",
  slate900: "rgb(15, 23, 42)",
  white: "rgb(255, 255, 255)",

  // Primaries
  primary: "rgb(59, 130, 246)", // Blue-500
  primaryHover: "rgb(37, 99, 235)", // Blue-600
  primaryLight: "rgb(219, 234, 254)", // Blue-100

  // Accents
  accent: "rgb(34, 197, 94)", // Green-500
  accentLight: "rgb(220, 252, 231)", // Green-100
};
```

### Shadows (NUR Tailwind):

- `shadow-sm`: Subtle
- `shadow-md`: Standard Cards
- `shadow-lg`: Highlighted Cards
- `shadow-xl`: Hero/Important Elements
- **KEINE custom boxShadow!**

### Borders:

- `border` (1px) ODER borderless
- `border-slate-200` für Neutrales
- `ring-2 ring-slate-400` für Highlights

### Spacing (8px Grid):

- Sections: `py-16 md:py-20 lg:py-24`
- Cards: `p-6` Standard, `p-8` Large
- Gaps: `gap-4`, `gap-6`, `gap-8`

### Typography:

- H1: `text-4xl sm:text-5xl md:text-6xl font-bold`
- H2: `text-3xl sm:text-4xl md:text-5xl font-bold`
- H3: `text-2xl sm:text-3xl font-semibold`
- Body: `text-base md:text-lg`

### Scrollbars:

- **IMMER:** `scrollbar-invisible` (NIEMALS sichtbar!)

---

## 📦 BENÖTIGTE KOMPONENTEN (CHECK IN NEXT SESSION)

### Bereits vorhanden (vermutlich):

- ✅ `V28MarketingSection`
- ✅ `V28MarketingCard`
- ✅ `V28Button`
- ✅ `V28FeatureListItem`
- ✅ `V28Badge`
- ✅ `V28InfoBox`

### Möglicherweise neu zu erstellen:

- ⏳ `V28HeroSection` (falls nicht vorhanden)
- ⏳ `V28DashboardPreview` (für Dashboard-Grafik)
- ⏳ `V28TestimonialCard` (falls Testimonials vorhanden)
- ⏳ `V28StatsCard` (falls Statistiken vorhanden)

---

## 🖼️ DASHBOARD-GRAFIK MIGRATION

### Analyse-Fragen (Next Session):

1. **Was ist es?**
   - Screenshot?
   - SVG-Illustration?
   - PNG/JPG Image?
   - React-Component?

2. **Wo liegt es?**
   - `src/assets/`?
   - `public/`?
   - Inline im Code?

3. **Wie wird es gerendert?**
   - `<img src={...} />`?
   - SVG Component?
   - Canvas?

### Migrations-Optionen:

```typescript
// OPTION A: Image mit V28.1 Styling
<div className="rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
  <img
    src={dashboardImage}
    alt="MyDispatch Dashboard"
    className="w-full h-auto"
  />
</div>

// OPTION B: Container mit Gradient + Image
<div
  className="rounded-2xl border border-slate-200 shadow-2xl p-4"
  style={{ background: PRIMARY_COLORS_V28.slate50 }}
>
  <div className="rounded-lg overflow-hidden shadow-lg">
    <img src={dashboardImage} alt="Dashboard" />
  </div>
</div>

// OPTION C: Mockup-Frame (Browser-Window-Style)
<V28BrowserMockup>
  <img src={dashboardImage} alt="Dashboard" />
</V28BrowserMockup>
```

---

## 🚀 IMPLEMENTATION PLAN (NEXT SESSION)

### PHASE 1: SETUP

1. Komplette `Index.tsx` lesen
2. COMPONENT_REGISTRY.md checken
3. Benötigte Komponenten identifizieren
4. Dashboard-Grafik analysieren

### PHASE 2: KOMPONENTEN-MIGRATION

1. **Hero Section:**
   - Background auf V28.1 Gradient
   - Typography auf V28.1
   - Buttons auf V28Button
   - Dashboard-Grafik anpassen

2. **Feature Sections:**
   - Layout auf V28MarketingSection
   - Cards auf V28MarketingCard
   - Icons auf slate-700
   - Listen auf V28FeatureListItem

3. **CTA Sections:**
   - Buttons auf V28Button
   - Spacing auf 8px Grid
   - Colors auf PRIMARY_COLORS_V28

4. **Sonstige Elemente:**
   - Badges auf V28Badge
   - InfoBoxen auf V28InfoBox
   - Alle custom Shadows entfernen

### PHASE 3: SCROLLBAR-CHECK

- [ ] Alle `overflow-y-auto` mit `scrollbar-invisible`
- [ ] Flexbox-Scrolling mit `min-h-0` Pattern

### PHASE 4: SELF-REVIEW

- [ ] Alle Imports existieren
- [ ] Keine halluzinierten Funktionen
- [ ] Type Safety überall
- [ ] PRIMARY_COLORS_V28 durchgängig
- [ ] Keine direct colors (text-white, bg-white)
- [ ] Scrollbars unsichtbar

### PHASE 5: DOCUMENTATION

- [ ] COMPONENT_REGISTRY.md aktualisieren
- [ ] filesExplorer.md aktualisieren
- [ ] CHANGELOG.md Eintrag
- [ ] SESSION_LEARNINGS aktualisieren (falls neue Patterns)

---

## ⚠️ CRITICAL RULES (NICHT VERGESSEN!)

### 1. ERST PLANEN, DANN BAUEN

- ✅ Plan vollständig erstellt
- ⏳ Analyse durchführen (Next Session)
- ⏳ Implementation starten (After Analysis)

### 2. KEINE DIRECT COLORS

```typescript
// ❌ FALSCH
className="text-white bg-blue-500"
style={{ color: '#FFFFFF' }}

// ✅ RICHTIG
style={{
  color: PRIMARY_COLORS_V28.white,
  background: PRIMARY_COLORS_V28.primary
}}
```

### 3. SCROLLBARS IMMER UNSICHTBAR

```typescript
// ✅ RICHTIG
className = "overflow-y-auto scrollbar-invisible";
```

### 4. FLEXBOX SCROLLING PATTERN

```tsx
<Container className="flex flex-col">
  <Header className="shrink-0" />
  <Body className="flex-1 min-h-0 overflow-y-auto scrollbar-invisible" />
  <Footer className="shrink-0" />
</Container>
```

---

## 📊 GESCHÄTZTE ÄNDERUNGEN

### Dateien (geschätzt):

- 🔧 `src/pages/Index.tsx` - MAJOR CHANGES
- 🆕 Möglicherweise neue V28-Komponenten
- 📝 Dokumentations-Updates

### Risiken:

- 🟡 Dashboard-Grafik könnte komplex sein
- 🟡 Unbekannte Custom-Komponenten möglich
- 🟢 V28-System gut etabliert (Pricing als Referenz)

---

## ✅ NEXT SESSION CHECKLIST

**START PROTOCOL:**

1. [ ] Diesen Plan lesen
2. [ ] `src/pages/Index.tsx` vollständig analysieren
3. [ ] Dashboard-Grafik identifizieren
4. [ ] COMPONENT_REGISTRY.md checken
5. [ ] Implementation-Details planen
6. [ ] User um Bestätigung fragen
7. [ ] Dann Implementation starten

**WÄHREND IMPLEMENTATION:**

- Parallel Tool Calls nutzen (Effizienz!)
- Self-Review WÄHREND des Codes
- Keine halluzinierten Imports
- Type Safety durchgängig

**NACH IMPLEMENTATION:**

- Finale Self-Review
- Dokumentation komplett
- Bestätigung: "✅ Self-Review passed"

---

**STATUS:** 📋 PLAN VOLLSTÄNDIG  
**READY FOR:** 🚀 NEXT SESSION IMPLEMENTATION  
**REGEL VERINNERLICHT:** ✅ ERST PLANEN, DANN BAUEN!

**LAST UPDATE:** 2025-10-28  
**NEXT STEP:** Homepage-Analyse & Implementation (Next Session)
