# PRICING DESIGN SYSTEM V26.0 - "BALANCED"

> **Version:** 26.0  
> **Status:** PRODUCTION  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 ÜBERSICHT

Dieses Dokument definiert das **verbindliche** Design-System für alle Pricing- und Marketing-Seiten. Es basiert auf dem V26.0 "BALANCED" Design und ist **NIEMALS** ohne Genehmigung zu ändern.

---

## 🎨 KERNFARBEN (ZWINGEND!)

Alle Farben sind in `src/lib/design-system/pricing-colors.ts` definiert:

```typescript
export const KERNFARBEN = {
  dunkelblau: '#323D5E',
  beige: '#EADEBD',
  weiss: '#FFFFFF',
  canvas: '#F9FAFB',
  text_primary: '#111827',    // H1, H2, H3, Preise
  text_secondary: '#374151',  // Body-Text
  text_tertiary: '#6B7280',   // Sub-Text, "pro Monat"
  border_neutral: '#E5E7EB',
  border_neutral_soft: 'rgba(229, 231, 235, 0.8)',
}
```

### ✅ RICHTIG
```tsx
import { KERNFARBEN } from '@/lib/design-system/pricing-colors';
style={{ color: KERNFARBEN.text_primary }}
```

### ❌ FALSCH
```tsx
className="text-gray-900"
style={{ color: '#111827' }}
```

---

## 📦 WIEDERVERWENDBARE KOMPONENTEN

**WICHTIG V26.0:** Für Standard-UI-Komponenten (Buttons, Icons, InfoBoxen) siehe `V26_COMPONENT_LIBRARY.md`.

Die folgenden Komponenten sind speziell für Marketing-Seiten:

### 1. MarketingSection
**Datei:** `src/components/marketing/MarketingSection.tsx`

Konsistente Section mit optionalen Überschriften:

```tsx
<MarketingSection
  background="canvas"
  title="Häufig gestellte Fragen"
  description="Antworten auf die wichtigsten Fragen..."
>
  {/* Content */}
</MarketingSection>
```

**Props:**
- `background`: 'canvas' | 'white'
- `title`: Optional, automatisch zentriert
- `description`: Optional, automatisch zentriert
- `className`: Zusätzliche Klassen

---

### 2. IconBox
**Datei:** `src/components/marketing/IconBox.tsx`

Icon-Container mit CI-Farben:

```tsx
<IconBox 
  icon={Truck} 
  variant="beige" 
  size="lg" 
/>
```

**Props:**
- `icon`: LucideIcon
- `variant`: 'beige' | 'dunkelblau'
- `size`: 'sm' | 'md' | 'lg'

---

### 3. FeatureListItem
**Datei:** `src/components/marketing/FeatureListItem.tsx`

Feature-Listen-Element mit Check-Icon:

```tsx
<ul className="space-y-2.5">
  <FeatureListItem text="DATEV-Anbindung & Buchhaltung" />
  <FeatureListItem text="Spezielle API-Schnittstellen" />
</ul>
```

---

### 4. BillingToggle
**Datei:** `src/components/marketing/BillingToggle.tsx`

Monatlich/Jährlich Toggle:

```tsx
<BillingToggle
  billingPeriod={billingPeriod}
  onToggle={setBillingPeriod}
  discountText="-20%"
/>
```

---

### 5. MarketingCard
**Datei:** `src/components/marketing/MarketingCard.tsx`

Card mit konsistentem CI-Styling:

```tsx
<MarketingCard>
  <div className="flex items-start gap-5">
    <IconBox icon={Truck} variant="beige" size="lg" />
    <div>
      <h3 className="text-2xl font-semibold mb-3">Titel</h3>
      <p>Beschreibung</p>
    </div>
  </div>
</MarketingCard>
```

---

## 🎭 VISUELLER RHYTHMUS (V26.0)

Sections müssen diesem Muster folgen:

```
Hero (Light)     → bg-canvas
Pricing Cards    → bg-canvas
Add-Ons          → bg-white
Vergleichstabelle → bg-canvas
FAQ              → bg-canvas (mit bg-white Card)
```

**Regel:** Maximale visuelle Harmonie durch gezielten Kontrast.

---

## 📐 LAYOUT-STANDARDS

### Section-Spacing
```tsx
className="py-20 md:py-24"
```

### Container
```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
```

### Title + Description Spacing
```tsx
<div className="text-center mb-12 md:mb-16">
```

### Card-Padding
```tsx
<CardContent className="p-8">
```

---

## 🎨 TYPOGRAFIE

### Überschriften
```tsx
// H1 (Hero)
className="text-5xl md:text-6xl font-bold tracking-tight mb-6"
style={{ color: KERNFARBEN.text_primary, textWrap: 'balance' }}

// H2 (Section)
className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
style={{ color: KERNFARBEN.text_primary, textWrap: 'balance' }}

// H3 (Card)
className="text-2xl font-semibold mb-3"
style={{ color: KERNFARBEN.text_primary }}
```

### Body-Text
```tsx
// Standard
className="text-base font-normal leading-relaxed"
style={{ color: KERNFARBEN.text_secondary }}

// Description
className="text-lg font-normal leading-relaxed"
style={{ color: KERNFARBEN.text_secondary, textWrap: 'pretty' }}

// Sub-Text
className="text-sm font-normal"
style={{ color: KERNFARBEN.text_tertiary }}
```

---

## 🔘 BUTTON-STANDARDS

### Primary (Highlighted Tariff)
```tsx
style={{
  backgroundColor: KERNFARBEN.dunkelblau,
  color: KERNFARBEN.beige,
  border: 'none',
}}
className="h-12 rounded-full font-semibold"

// Hover
onMouseEnter={(e) => {
  e.currentTarget.style.backgroundColor = '#3F4C70';
  e.currentTarget.style.boxShadow = `0 0 25px ${KERNFARBEN.dunkelblau}66`;
  e.currentTarget.style.transform = 'scale(1.02)';
}}
```

### Outline
```tsx
style={{
  backgroundColor: KERNFARBEN.weiss,
  color: KERNFARBEN.dunkelblau,
  borderColor: KERNFARBEN.dunkelblau,
  borderWidth: '2px',
}}
className="h-12 rounded-full font-semibold"

// Hover
onMouseEnter={(e) => {
  e.currentTarget.style.backgroundColor = `${KERNFARBEN.dunkelblau}1A`;
  e.currentTarget.style.transform = 'scale(1.02)';
}}
```

---

## 🎯 CARD-STANDARDS

### Standard Marketing Card
```tsx
<MarketingCard>
  {/* Content */}
</MarketingCard>
```

### Tariff Card (Komplexer)
- Border: `border-neutral-soft` (nicht highlighted)
- Ring: `ring-2 ring-dunkelblau` (highlighted)
- Shadow: `shadow-xl shadow-dunkelblau/15` (highlighted)
- Hover: `translateY(-2px)` + Border-Änderung

---

## 📋 PFLICHT-CHECKLISTE

Vor jedem Commit:

- [ ] Nur KERNFARBEN verwendet (keine direkten Hex-Werte)
- [ ] Wiederverwendbare Komponenten genutzt
- [ ] Visueller Rhythmus eingehalten
- [ ] Typography-Standards befolgt
- [ ] Button-Hover-Effekte korrekt
- [ ] Card-Shadows konsistent
- [ ] Mobile-First responsive
- [ ] `textWrap: 'balance'` für Überschriften
- [ ] `textWrap: 'pretty'` für Beschreibungen

---

## 🚫 VERBOTEN

1. **Direkte Farb-Werte** außerhalb von `KERNFARBEN`
2. **Inline-Styles** ohne `KERNFARBEN`-Referenz
3. **Eigene Card-Komponenten** statt `MarketingCard`
4. **Abweichende Button-Styles**
5. **Andere Icon-Container** statt `IconBox`
6. **Manuelle Feature-Listen** statt `FeatureListItem`

---

## 📝 CONTENT-STANDARDS

Siehe: `docs/CONTENT_WRITING_STANDARDS_V26.0.md`

- **Ton:** Klar, direkt, benefit-orientiert
- **Struktur:** Kurze Sätze, aktive Sprache
- **Längen:** H1 max 8 Wörter, H2 max 10 Wörter

---

## 🔄 VERSION HISTORY

### V26.0 (2025-01-26)
- Initiale Definition des wiederverwendbaren Design-Systems
- Extraktion aus Pricing Page V26.0 "BALANCED"
- Erstellung zentraler Komponenten-Bibliothek

---

**STATUS:** PRODUCTION-LOCKED  
**ÄNDERUNGEN:** Nur mit Freigabe!
