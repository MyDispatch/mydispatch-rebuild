# ✅ V28 COMPONENT REUSABILITY - DOKUMENTATION

**Datum:** 2025-10-28  
**Status:** ✅ KORRIGIERT - Nur wiederverwendbare Components

---

## 🔴 PROBLEM: DOPPELTE COMPONENTS ERSTELLT

**WAS FALSCH WAR:**
- Ich habe eigene Feature/Testimonial Cards erstellt (`V28FeatureCard.tsx`, `V28TestimonialCard.tsx`)
- Diese waren DUPLICATE von bestehenden wiederverwendbaren Components
- **INKONSISTENT** mit Pricing-Seite
- Wartungs-Alptraum: Änderungen müssen an mehreren Stellen gemacht werden

**LÖSUNG:**
- ✅ `V28FeatureCard.tsx` gelöscht → Nutze `V28MarketingCard` + `V28IconBox`
- ✅ `V28TestimonialCard.tsx` gelöscht → Nutze `V28MarketingCard` + Content
- ✅ Home.tsx nutzt jetzt die GLEICHEN Components wie Pricing

---

## ✅ WIEDERVERWENDBARE V28 COMPONENTS

### Design System Components (`/components/design-system`)

#### 1. V28MarketingCard
**Path:** `src/components/design-system/V28MarketingCard.tsx`
**Verwendung:** Universeller Card-Container
**Props:**
- `children: ReactNode` - Beliebiger Inhalt
- `className?: string` - Custom classes
- `contentClassName?: string` - Padding override

**Style:**
- `rounded-2xl`
- `border border-slate-200`
- `shadow-lg`
- `bg-white`
- `p-8` (default padding)

**Wo verwendet:**
- ✅ Pricing: Add-ons, FAQ Container
- ✅ Home: Features, Testimonials

#### 2. V28IconBox
**Path:** `src/components/design-system/V28IconBox.tsx`
**Verwendung:** Icon-Container mit Hintergrund
**Props:**
- `icon: LucideIcon`
- `variant?: 'primary' | 'slate'`
- `size?: 'sm' | 'md' | 'lg'`

**Style:**
- `rounded-lg` (NICHT rounded-full!)
- `bg-slate-100` (slate) oder `bg-primary-100` (primary)
- `ring-1 ring-slate-200`

**Wo verwendet:**
- ✅ Home: Feature Icons
- ✅ Pricing: Tarif Icons

#### 3. V28Button
**Path:** `src/components/design-system/V28Button.tsx`
**Verwendung:** Alle Buttons
**Variants:** `primary`, `secondary`
**Sizes:** `sm`, `md`, `lg`

**Style:**
- `rounded-xl`
- `shadow-sm hover:shadow-md`
- `hover:scale-[1.02]`

#### 4. V28BillingToggle
**Path:** `src/components/design-system/V28BillingToggle.tsx`
**Verwendung:** Monthly/Yearly Toggle
**Style:**
- `rounded-xl` Container
- `shadow-lg`

#### 5. V28Badge
**Path:** `src/components/design-system/V28Badge.tsx`
**Verwendung:** Labels, Tags
**Variants:** `primary`, `secondary`

#### 6. V28MarketingSection
**Path:** `src/components/design-system/V28MarketingSection.tsx`
**Verwendung:** Section-Container mit Heading
**Backgrounds:** `white`, `canvas`, `primary`

#### 7. V28FeatureListItem
**Path:** `src/components/design-system/V28FeatureListItem.tsx`
**Verwendung:** Feature-Liste mit Check-Icon

---

### Pricing Components (`/components/pricing`)

#### 1. V28PricingCard
**Path:** `src/components/pricing/V28PricingCard.tsx`
**Verwendung:** Tarif-Karten
**Props:**
- `name`, `description`, `price`, `priceDetail`
- `icon: LucideIcon`
- `badge?: string`
- `highlighted?: boolean`
- `ctaLabel`, `ctaVariant`
- `features: { text: string, included: boolean }[]`
- `hasMoreFeatures?: boolean`
- `onCTAClick`, `onShowAllFeatures`

**Style:**
- `rounded-2xl`
- `shadow-lg hover:shadow-2xl`
- `hover:scale-[1.01]`
- `ring-2 ring-slate-400` (wenn highlighted)

#### 2. V28AddonCard
**Path:** `src/components/pricing/V28AddonCard.tsx`
**Verwendung:** Add-on Karten
**Style:** Wie PricingCard, aber kleineres Format

#### 3. V28ComparisonTable
**Path:** `src/components/pricing/V28ComparisonTable.tsx`
**Verwendung:** Feature-Vergleichstabelle

#### 4. V28AccordionItem
**Path:** `src/components/pricing/V28AccordionItem.tsx`
**Verwendung:** FAQ Items
**Style:**
- `rounded-lg` (in Container)
- `border-slate-200`

---

### Home-Specific Components (`/components/home`)

#### 1. V28BrowserMockup
**Path:** `src/components/home/V28BrowserMockup.tsx`
**Verwendung:** Browser-Fenster mit Traffic Lights
**Style:**
- `rounded-2xl`
- `shadow-2xl`
- macOS Traffic Lights (`rounded-full`)

#### 2. V28DashboardPreview
**Path:** `src/components/home/V28DashboardPreview.tsx`
**Verwendung:** Dashboard Preview im Browser-Mockup
**Kombiniert:** `V28BrowserMockup` + Dashboard Content

#### 3. V28SliderControls
**Path:** `src/components/home/V28SliderControls.tsx`
**Verwendung:** Slider Navigation (Arrows + Dots)
**Style:**
- `rounded-xl` Buttons
- `shadow-sm hover:shadow-md`
- `rounded-full` Dots

---

## 📋 USAGE PATTERNS

### Feature Cards (Home)
```tsx
<V28MarketingCard className="hover:shadow-2xl hover:scale-[1.01]">
  <V28IconBox icon={ClipboardList} variant="slate" />
  <h3 className="font-sans text-lg font-semibold mb-2 mt-4 text-slate-900">
    Feature Title
  </h3>
  <p className="font-sans text-sm leading-relaxed text-slate-600">
    Feature Description
  </p>
</V28MarketingCard>
```

### Testimonial Cards (Home)
```tsx
<V28MarketingCard className="hover:shadow-2xl hover:scale-[1.01]">
  {/* Rating Stars */}
  <div className="flex gap-1 mb-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="w-5 h-5 rounded-full bg-slate-700">
        <Star className="w-3 h-3" fill="white" />
      </div>
    ))}
  </div>
  
  <p className="text-sm italic text-slate-600">
    "Quote"
  </p>
  
  <p className="text-sm font-semibold text-slate-900">
    Company Name
  </p>
</V28MarketingCard>
```

### Pricing Cards
```tsx
<V28PricingCard
  name="Starter"
  description="Für kleine Teams"
  price="€49"
  priceDetail="pro Monat"
  icon={Rocket}
  badge="Beliebt"
  highlighted={true}
  ctaLabel="Jetzt starten"
  ctaVariant="primary"
  features={[
    { text: "3 Fahrzeuge", included: true },
    { text: "3 Fahrer", included: true }
  ]}
  onCTAClick={() => handleSubscribe('starter')}
/>
```

---

## 🎯 GOLDEN RULES

### NIEMALS:
❌ Eigene Card-Components erstellen wenn `V28MarketingCard` existiert
❌ Component-Duplikate zwischen Pages (Home vs Pricing)
❌ Neue Icon-Wrapper erstellen wenn `V28IconBox` existiert
❌ Inline-Styles für Cards/Buttons wenn Design-System Components existieren

### IMMER:
✅ `V28MarketingCard` als universellen Container nutzen
✅ `V28IconBox` für alle Icons mit Hintergrund
✅ `V28Button` für alle Buttons
✅ Pricing-Seite als Referenz für Component-Nutzung
✅ Wiederverwendbarkeit vor neuen Components
✅ COMPONENT_REGISTRY.md checken vor neuer Component

---

## 🔄 MIGRATION CHECKLIST

Bei neuen Features:
□ Gibt es bereits ein Component für meinen Use-Case?
□ Kann ich `V28MarketingCard` + Content nutzen?
□ Kann ich `V28IconBox` für Icons nutzen?
□ Brauche ich wirklich ein neues Component?
□ Wenn JA: Ist es wirklich wiederverwendbar?
□ COMPONENT_REGISTRY.md updaten

---

**LAST UPDATE:** 2025-10-28  
**STATUS:** ✅ HOME & PRICING NUTZEN GLEICHE COMPONENTS
