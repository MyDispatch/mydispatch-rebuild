# 🎨 DESIGN SYSTEM V28.1 - COMPLETE DOCUMENTATION

## Professional Minimalism für MyDispatch

> **Version:** 28.1  
> **Status:** PRODUCTION  
> **Letzte Aktualisierung:** 2025-10-28  
> **Basis:** Home & Pricing Pages Components

---

## 🎯 ÜBERSICHT

Dieses Dokument definiert das **vollständige, verbindliche Design-System** für MyDispatch. Es basiert auf professioneller Minimalism mit einer Slate-basierten Farbpalette und nutzt die existierenden V28 Components von Home und Pricing als Foundation.

### Design-Philosophie

- **Professional Minimalism:** Klar, reduziert, fokussiert
- **Flat Design:** Keine übertriebenen Effekte, subtile Schatten
- **B2B-optimiert:** Seriös, vertrauenswürdig, funktional
- **Accessibility First:** WCAG 2.1 AA konform

---

## 🎨 DESIGN TOKENS

### Zentrale Token-Datei

**Datei:** `config/design-tokens.ts`

✅ **IMMER aus dieser Datei importieren:**

```typescript
import { designTokens } from "@/config/design-tokens";
```

❌ **NIEMALS hardcoded values:**

```typescript
// FALSCH
style={{ color: '#334155' }}
className="text-[#334155]"

// RICHTIG
style={{ color: designTokens.colors.primary.DEFAULT }}
className="text-slate-700"
```

---

## 🎨 FARBSYSTEM

### Primary Palette (Slate - Professional)

```typescript
colors: {
  primary: {
    DEFAULT: '#334155',  // slate-700 - Haupt-Akzentfarbe
    600: '#475569',      // slate-600 - Text Secondary
    900: '#0f172a',      // slate-900 - Text Primary
  }
}
```

### Semantische Farben

```typescript
text: {
  primary: '#0f172a',    // slate-900 - Überschriften
  secondary: '#475569',  // slate-600 - Body-Text
  tertiary: '#94a3b8',   // slate-400 - Sub-Text
  inverse: '#FFFFFF',    // Weißer Text auf dunklem BG
}

bg: {
  primary: '#FFFFFF',    // Weiß - Cards, Modals
  canvas: '#f8fafc',     // slate-50 - Page Background
  inverse: '#0f172a',    // slate-900 - Hero, Footer
}

border: {
  DEFAULT: '#e2e8f0',    // slate-200 - Standard Border
  light: '#f1f5f9',      // slate-100 - Subtle Border
  focus: '#334155',      // slate-700 - Focus State
}
```

---

## 📐 LAYOUT SYSTEM (V18.6)

### Foundation Components

#### Container

**Zweck:** Konsistente max-width und padding

```tsx
<Container size="xl" padding="lg">
  {children}
</Container>
```

#### Section

**Zweck:** Wrapper für Content-Sections

```tsx
<Section spacing="xl" background="white">
  {children}
</Section>
```

#### Grid

**Zweck:** Responsive CSS Grid

```tsx
<Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
  {children}
</Grid>
```

#### Flex

**Zweck:** Flexbox Layouts

```tsx
<Flex direction="row" justify="between" align="center" gap="md">
  {children}
</Flex>
```

#### Stack

**Zweck:** Vertical/Horizontal Stacks

```tsx
<Stack spacing="lg" direction="vertical">
  {children}
</Stack>
```

### Spacing System

```typescript
layoutSpacing: {
  none: '0',
  xs: '8px',      // gap-2
  sm: '16px',     // gap-4
  md: '24px',     // gap-6  ⭐ DEFAULT
  lg: '32px',     // gap-8
  xl: '48px',     // gap-12
  '2xl': '64px',  // gap-16
}
```

**ABSOLUTE REGELN:**

- ❌ NIEMALS hardcoded spacing (py-20, mt-10, gap-5)
- ✅ IMMER Layout Components nutzen
- ✅ IMMER Design System Spacing

---

## 📦 COMPONENT LIBRARY

### Foundation Components

#### V28Button

**Datei:** `src/components/design-system/V28Button.tsx`

```tsx
<V28Button variant="primary" size="lg" onClick={handleClick}>
  Jetzt starten
</V28Button>
```

**Props:**

- `variant?: 'primary' | 'secondary'`
- `size?: 'sm' | 'md' | 'lg'`
- `disabled?: boolean`
- `className?: string`

**Styling:**

- Primary: `bg-slate-700 text-white`
- Secondary: `bg-slate-100 text-slate-900 border border-slate-200`
- Hover: `scale-[1.02]` + `shadow-md`
- Rounded: `rounded-xl` (12px)

---

#### V28Badge

**Datei:** `src/components/design-system/V28Badge.tsx`

```tsx
<V28Badge variant="primary">Bestseller</V28Badge>
```

**Variants:**

- `primary`: Slate-700 background
- `secondary`: Slate-100 background

---

#### V28IconBox

**Datei:** `src/components/design-system/V28IconBox.tsx`

```tsx
<V28IconBox icon={Truck} variant="primary" />
```

**Variants:**

- `primary`: Slate-100 BG + Slate-700 Icon
- `slate`: Slate-100 BG + Slate-700 Icon

**Features:**

- Fixed size: `w-12 h-12`
- Rounded: `rounded-lg` (8px)
- Ring: `ring-1 ring-slate-200`

---

### Content Components

#### V28MarketingCard

**Datei:** `src/components/design-system/V28MarketingCard.tsx`

```tsx
<V28MarketingCard>
  <h3>Feature Title</h3>
  <p>Feature description...</p>
</V28MarketingCard>
```

**Styling:**

- Border: `border border-slate-200` (1px)
- Shadow: `shadow-lg` (Tailwind)
- Rounded: `rounded-2xl` (16px)
- Padding: `p-8`
- Hover: Subtle scale + shadow

---

#### V28MarketingSection

**Datei:** `src/components/design-system/V28MarketingSection.tsx`

```tsx
<V28MarketingSection background="canvas" title="Section Title" description="Section description...">
  {children}
</V28MarketingSection>
```

**Props:**

- `background?: 'canvas' | 'white'`
- `title?: string`
- `description?: string`

---

#### V28FeatureListItem

**Datei:** `src/components/design-system/V28FeatureListItem.tsx`

```tsx
<ul className="space-y-2.5">
  <V28FeatureListItem text="Feature 1" />
  <V28FeatureListItem text="Feature 2" />
</ul>
```

---

#### V28BillingToggle

**Datei:** `src/components/design-system/V28BillingToggle.tsx`

```tsx
<V28BillingToggle billingPeriod={billingPeriod} onToggle={setBillingPeriod} discountText="-20%" />
```

---

#### V28InfoBox

**Datei:** `src/components/design-system/V28InfoBox.tsx`

```tsx
<V28InfoBox type="legal" title="Hinweis">
  <p>Important information...</p>
</V28InfoBox>
```

**Types:**

- `info`, `warning`, `error`, `success`, `legal`

---

### Pricing Components

#### V28PricingCard

**Datei:** `src/components/pricing/V28PricingCard.tsx`

```tsx
<V28PricingCard
  name="Business"
  description="Für wachsende Unternehmen"
  price="79€"
  priceDetail="pro Monat"
  icon={Building2}
  badge="Bestseller"
  highlighted={true}
  ctaLabel="Jetzt starten"
  ctaVariant="primary"
  features={[
    { text: "Feature 1", included: true },
    { text: "Feature 2", included: true },
  ]}
  onCTAClick={() => navigate("/auth")}
/>
```

**Features:**

- Highlighted Card: `ring-2 ring-slate-700` + `shadow-2xl`
- Badge-Support
- "Mehr anzeigen" Link
- Icon + Premium Styling

---

#### V28PricingHero

**Datei:** `src/components/pricing/V28PricingHero.tsx`

```tsx
<V28PricingHero
  title="Klar. Fair. Zukunftssicher."
  subtitle="Entdecken Sie unsere flexiblen Tarife"
>
  <V28BillingToggle ... />
</V28PricingHero>
```

---

#### V28AddonCard

**Datei:** `src/components/pricing/V28AddonCard.tsx`

```tsx
<V28AddonCard
  icon={Truck}
  title="Fleet & Driver Add-On"
  price="5€"
  priceLabel="pro Monat"
  description="Beschreibung..."
  highlighted={true}
/>
```

---

#### V28ComparisonTable

**Datei:** `src/components/pricing/V28ComparisonTable.tsx`

```tsx
<V28ComparisonTable features={comparisonData} />
```

---

#### V28AccordionItem

**Datei:** `src/components/pricing/V28AccordionItem.tsx`

```tsx
<Accordion type="single" collapsible>
  <V28AccordionItem value="item-0" question="Frage?" answer="Antwort..." />
</Accordion>
```

---

### Home Components

#### V28HeroBackground

**Datei:** `src/components/hero/V28HeroBackground.tsx`

```tsx
<V28HeroBackground />
```

**Features:**

- Slate Gradient Background
- Subtle Pattern Overlay
- Responsive

---

#### V28BrowserMockup

**Datei:** `src/components/home/V28BrowserMockup.tsx`

```tsx
<V28BrowserMockup title="Dashboard">{dashboardContent}</V28BrowserMockup>
```

---

#### V28DashboardPreview

**Datei:** `src/components/home/V28DashboardPreview.tsx`

```tsx
<V28DashboardPreview animationDelay="0.6s" />
```

---

#### V28SliderControls

**Datei:** `src/components/home/V28SliderControls.tsx`

```tsx
<V28SliderControls
  currentSlide={0}
  totalSlides={3}
  onPrevious={() => {}}
  onNext={() => {}}
  onDotClick={(idx) => {}}
/>
```

---

## 🎭 VISUELLER RHYTHMUS

### Section Pattern (Home/Pricing)

```
Hero                 → bg-slate-900 (dark)
Features             → bg-canvas (slate-50)
Testimonials         → bg-white
Pricing              → bg-white
Add-Ons              → bg-canvas
Comparison Table     → bg-white
FAQ                  → bg-canvas
Final CTA            → bg-white
```

**Regel:** Alternierender Rhythmus für visuelle Harmonie

---

## 📋 TYPOGRAPHY STANDARDS

### Überschriften

```tsx
// H1 (Hero)
className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900"
style={{ textWrap: 'balance' }}

// H2 (Section)
className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900"
style={{ textWrap: 'balance' }}

// H3 (Card)
className="text-2xl font-semibold text-slate-900"
```

### Body-Text

```tsx
// Standard
className="text-base text-slate-600 leading-relaxed"

// Description
className="text-lg text-slate-600 leading-relaxed"
style={{ textWrap: 'pretty' }}

// Sub-Text
className="text-sm text-slate-400"
```

---

## 🚨 ABSOLUTE VERBOTE

1. **Direkte Farb-Werte** außerhalb von `design-tokens.ts`
2. **Hardcoded Spacing** (py-20, mt-10, gap-5)
3. **Components außerhalb der Library erstellen**
4. **Inline-Styles** ohne Token-Referenz
5. **Abweichende Button-Styles**
6. **V26 Components für neue Features nutzen** (V26 ist DEPRECATED!)

---

## ✅ PFLICHT-CHECKLISTE

Vor jedem Commit:

- [ ] Nur Design Tokens verwendet
- [ ] Layout Components genutzt (Container, Section, Grid, Flex, Stack)
- [ ] Wiederverwendbare V28 Components genutzt
- [ ] Visueller Rhythmus eingehalten
- [ ] Typography-Standards befolgt
- [ ] Button-Hover-Effekte korrekt
- [ ] Card-Shadows konsistent
- [ ] Mobile-First responsive
- [ ] `textWrap: 'balance'` für Überschriften
- [ ] `textWrap: 'pretty'` für Beschreibungen
- [ ] COMPONENT_REGISTRY.md gecheckt
- [ ] Keine V26 Components verwendet

---

## 📚 WEITERE DOKUMENTATION

- **Design Tokens:** `config/design-tokens.ts`
- **Component Registry:** `docs/COMPONENT_REGISTRY.md`
- **Layout Pattern System:** `docs/LAYOUT_PATTERN_SYSTEM_V18.6.md`
- **Usage Guidelines:** `docs/COMPONENT_USAGE_GUIDE.md`

---

## 🔄 VERSION HISTORY

### V28.1 (2025-10-28)

- Vollständige Design System Dokumentation
- Design Tokens zentral in `/config`
- Component Library basierend auf Home & Pricing
- 17 V28 Production Components
- Layout Pattern System V18.6 Integration

---

**STATUS:** PRODUCTION-LOCKED  
**ÄNDERUNGEN:** Nur mit Freigabe!
