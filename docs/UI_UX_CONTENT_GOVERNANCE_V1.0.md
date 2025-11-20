# 📚 MyDispatch UI/UX & Content Governance V1.0

**Basiert auf:** V26.1 Design System  
**Status:** ✅ DEFINITIVE ARBEITSGRUNDLAGE & ZWINGEND  
**Ziel:** 100% konsistentes, hochwertiges, fehlerfreies und CI-konformes Nutzererlebnis

---

## 1. 🌟 OVERALL PHILOSOPHIE & PRINZIPIEN

### Design-Standard

- **Minimalistisches Flat-Design** mit klarer visueller Hierarchie
- **"Hero-Qualität"** (wie auf `/` und `/pricing`) ist systemweiter Standard
- Alle UI-Elemente und Seiten folgen diesem Standard

### Zielgruppe

- **B2B** (Taxi-/Mietwagenunternehmer)
- Professionell, vertrauenswürdig, klar und pragmatisch

### Architektur

- **Design-System-First**: Tokens vor direkten Werten
- **Token-Basiert**: UNIFIED_DESIGN_TOKENS
- **Mobile-First**: Responsive ab 375px
- **Security-First**: RLS, Validierung, DSGVO

### Konsistenz

> **"Immer alles gleich"** ist das oberste UX-Gebot für vergleichbare Bereiche.

Systemweite Harmonisierung in Design, Layout, Funktion und Technik ist **PFLICHT**.

---

## 2. 📐 LAYOUT & STRUKTUR

### 2.1 Globale Elemente

#### Header, Footer, Sidebar

- **Obligatorisch** systemweit
- **Identisches Design/Layout** überall
- **Sticky** (oben/unten)
- **Technische Funktion** passt sich an aktuelle Seite an
- **Transitions:** 300ms ease_default

#### Content-Bereich

- Passt sich konsistent an globale Elemente an
- `margin-left` bei geöffneter Sidebar
- Standard-Padding: `pt-14 sm:pt-16 pb-16 sm:pb-20`

---

### 2.2 Seiten-Typen

#### Marketing-Seiten (/, /pricing, /faq)

**Master-Vorlagen:** `/` und `/pricing`

- Ästhetik, Struktur und Spacing übernehmen
- Visueller Rhythmus: `bg-canvas` → `bg-white` → `bg-canvas` → etc.
- Komponenten: `MarketingSection`, `MarketingCard`

#### Dashboard-Seiten

##### Hauptdashboard (/dashboard)

> **UNVERÄNDERLICH (FROZEN)**

- Layout ist **FROZEN** - keine Layout-Änderungen erlaubt
- Nur technische Optimierung erlaubt
- Nur visuelle Synchronisierung mit V26.1 Tokens/Elementen

##### Alle ANDEREN Dashboards (/auftraege, /fahrer, /fahrzeuge, etc.)

> **MÜSSEN "Single Large Card View"-Paradigma verwenden**

**Pflicht-Struktur:**

```tsx
<DashboardLayout>
  <V26DashboardCard>
    <V26SectionHeader
      title="Seiten-Titel"
      description="Beschreibung"
    />

    {/* Action Bar */}
    <div className="flex gap-3">
      <V26ActionButton variant="primary" icon={Plus}>
        Neu erstellen
      </V26ActionButton>
      <V26ActionButton variant="secondary" icon={Download}>
        Exportieren
      </V26ActionButton>
    </div>

    {/* Filter & Search */}
    <V26FilterSection
      searchValue={search}
      onSearchChange={setSearch}
      additionalFilters={...}
    />

    {/* Daten-Anzeige */}
    <V26DataTable headers={...}>
      {/* Rows */}
    </V26DataTable>

    {/* Pagination */}
    <V26Pagination />
  </V26DashboardCard>
</DashboardLayout>
```

---

### 2.3 Hero-Bereich (Wenn vorhanden)

#### Video

- Wird beibehalten
- **Abdunklungs-Overlay:** `rgba(--color-foreground, 0.4-0.6)`
- `overflow: hidden`

#### Layout

- **Klare Trennung:** Links (Text/CTA), Rechts (Grafik)
- Optimierte Abstände gemäß `/` Vorlage

#### Rechte Grafik

> **MUSS ein im Code gebautes Live-UI-Mockup sein**

- **KEIN statisches Bild**
- Nutzt originale V26.1 Library-Elemente
- Im verkleinerten Maßstab
- Pixelgenau an Bereich angepasst
- Mit fiktiven Daten
- Stellt kontextuell relevante Dashboards/Funktionen dar

#### Gesamtästhetik

- Hochwertig und perfektioniert
- Premium Trust-Badge
- Glow-Effekte gemäß `/` Vorlage

---

## 3. 🎨 VISUELLES DESIGN (V26.1 TOKENS & STYLES)

### 3.1 Farben

#### ZWINGEND

- Ausschließlich **KERNFARBEN_V26_1** verwenden
- Referenziert über CSS-Variablen oder `UNIFIED_DESIGN_TOKENS`

#### VERBOTEN

- ❌ Direkte Hex-Codes
- ❌ RGB(A)-Werte
- ❌ Tailwind-Farbklassen (z.B. `text-gray-900`, `bg-white`)

#### Ampel-System

- Grün/Gelb/Rot **NUR** für Status-Badges

---

### 3.2 Typografie

#### Schriftart

- **Inter** - `font-sans` auf **ALLEN** Text-Elementen

#### Größen

- **Fluid Typography** via `clamp()`
- Über definierte Tokens/Klassen (z.B. `text-heading-1`, `text-body-lg`)

#### Gewichte

- Standard Tailwind (`font-normal` bis `font-extrabold`)

#### Farben

- Über Farb-Tokens (`text_primary`, `text_secondary`, `text_tertiary`)

#### Wrapping

- **Headlines:** `text-balance`
- **Absätze:** `text-pretty`

#### Links

- **KEINE Unterstreichungen**
- `V26Link` Komponente oder `opacity-80` auf Hover

---

### 3.3 Spacing

#### ZWINGEND

- Ausschließlich **Tailwind CSS Utility-Klassen**
  - `p-X`, `m-X`, `gap-X`, `space-y-X`

#### VERBOTEN

- ❌ Inline-Styles (`style={{ padding: '...' }}`)
- ❌ Magic Numbers für statisches Spacing

#### Konsistenz

- Standardisierte Abstände gemäß `Pricing.tsx`/`Home.tsx`
- Globale Standards (Header/Footer-Höhe, Section-Padding)

---

### 3.4 Icons

- **Set:** Lucide React
- **Styling in V26IconBox:**
  - Dunkelblauer Hintergrund
  - Beiges Icon
- **Standardgröße:** `h-4 w-4` oder `h-5 w-5`

---

### 3.5 Effekte & Interaktionen

#### Glow

- Alle interaktiven Elemente **MÜSSEN** Glow-Effekte haben

#### Hover

- **Smooth:** 300ms `ease_default`
- Umsetzung via Tailwind `hover:`
- **KEINE** JS-Style-Manipulation für statische Hover
- Standard-Effekte: `-translate-y-1`, `scale(1.02)`

#### Transitions

- **Standard:** 300ms `ease_default`
- **KEINE** längeren Transitions für Layout-Elemente

---

## 4. 🧩 KOMPONENTEN & BIBLIOTHEK

### Component-First

- **Immer zuerst Library prüfen**
- Dann ggf. erstellen und hinzufügen

### Library-Pflicht

> **JEDE** neu erstellte, wiederverwendbare Komponente **MUSS** in die Library

- Pfad: `src/components/design-system/` oder thematisch
- **Barrel Exports** (`index.ts`) aktualisieren

### Qualität

- Alle Komponenten **MÜSSEN** "Hero-Qualität" haben
- V26.1 CI implementieren

### Shadcn/UI

- Dient als Basis
- **Immer mit V26-Wrapper/Styling** verwenden

### Pflicht-Komponenten (Dashboards)

- `V26DashboardCard`
- `V26StatCard`
- `V26MetricCard`
- `V26DataTable`
- `V26ActionButton`
- `V26StatusBadge`
- `V26SectionHeader`

### Buttons

- `V26Button` verwenden
- Varianten: `primary-filled`, `secondary-outlined`, `ghost`

### Badges

- **Performance:** Beige BG / Dunkelblau Text
- **Status:** Ampel-System

---

## 5. 🖱️ INTERAKTION & USER EXPERIENCE (UX)

### Mobile-First

- Design und Implementierung starten mit Mobile (min. 375px Breite)
- **Touch-Targets:** >= 44px

### Formulare

- Struktur aus `MyDispatch_Gesamtkonzept.md` folgen
- **Strikte Input-Validierung** (Zod)
- **DSGVO-Hinweise** sind Pflicht

### Konsistenz

- Gleiche Elemente müssen sich systemweit **gleich** verhalten und aussehen
- Standard-Dashboard-Struktur beachten

### Feedback

- **Loading States**
- **Error Handling** (Toasts)
- **Success States**
- Systemweit konsistent implementiert
- **Defensive Coding** anwenden

---

## 6. ✍️ CONTENT & KOMMUNIKATION

### Tonality

- **Professionell**, freundlich, hilfsbereit
- **B2B**, **Siezen**
- **KEINE** Spielereien oder Witze

### Stil

- **Prägnant:** max. 20 Wörter/Satz
- **Direkte Ansprache:** "Sie"
- **Aktive Verben**
- **Nutzen vor Features**

### Kernbotschaft

- **Transparent & Fair**
- **Keine versteckten Kosten**

### Markenwerte

- **"Made in Germany"** hervorheben
- **"DSGVO-konform"** betonen
- **Slogan:** "simply arrive"

### Rechtliche Inhalte

- **Impressum, Datenschutz, AGB** im Footer
- **DSGVO-Hinweise** bei Formularen
- **AI Act Hinweise** bei KI-Antworten
- **PBefG § 51 Hinweise** bei Auftragsdaten

---

## 7. 🚫 VERBOTENE PRAKTIKEN (ZERO TOLERANCE)

### Design & Styling

- ❌ Keine direkten Hex-Codes oder Tailwind-Farbklassen in Komponenten
- ❌ Keine Inline-Styles für statisches Spacing, Farben, Transitions
- ❌ Keine JS-basierten Hover-Effekte für statische Styles
- ❌ Keine Ampel-Farben außerhalb von Status-Badges
- ❌ Keine Transitions > 300ms für Layout-Elemente
- ❌ Keine Unterstreichungen bei Links

### Code-Qualität

- ❌ Kein wiederholender Code (DRY-Prinzip)
- ❌ Keine Komponenten ohne TypeScript-Interfaces
- ❌ Kein `any`-Typ ohne zwingende Begründung

### Layout

- ❌ Keine Layout-Änderungen am Hauptdashboard (`/dashboard`)

---

## 8. 📊 QUALITY GATES

### Design System Compliance

- ✅ 100% Token-basiert
- ✅ Keine Hex-Codes
- ✅ Keine Inline-Styles
- ✅ Hero-Qualität

### Code Quality

- ✅ TypeScript Strict
- ✅ ESLint Validation
- ✅ DRY-Prinzip
- ✅ Component-First

### Accessibility

- ✅ WCAG 2.1 AA
- ✅ 44px Touch Targets
- ✅ Semantic HTML
- ✅ Keyboard Navigation

### Performance

- ✅ Mobile-First
- ✅ 300ms Transitions
- ✅ Optimized Re-Renders
- ✅ Tree-Shakeable Imports

---

## 9. 📚 REFERENZEN

### Master-Vorlagen

- **Marketing:** `/` und `/pricing`
- **Dashboard:** `/dashboard` (FROZEN)
- **Single Large Card:** Alle anderen Dashboards

### Dokumentation

- `NEXIFY_SYSTEM_MASTER_BRAIN.md`
- `V26.1_DESIGN_SYSTEM.md`
- `MyDispatch_Gesamtkonzept.md`

### Komponenten-Library

- `src/components/design-system/`
- `src/components/dashboard/`
- `docs/V26_COMPONENT_LIBRARY.md`

---

**Diese Richtlinien stellen die vollständige und verbindliche Grundlage für alle UI/UX- und Content-Entscheidungen im MyDispatch Projekt dar.**

**Version:** 1.0  
**Stand:** 2025-10-27  
**Authority:** Zentrale Governance für MyDispatch V26.1
