# 📦 COMPONENT REGISTRY V28.1 - MyDispatch

## ⚠️ KRITISCHE REGEL: IMMER PRÜFEN!

**Vor JEDER neuen Component-Erstellung:**

1. ✅ Diese Datei checken
2. ✅ filesExplorer.md durchsuchen
3. ✅ Nur wenn NICHT existiert → neu erstellen
4. ✅ Sonst → bestehende Component verwenden/erweitern

---

## 🎨 V28.1 DESIGN SYSTEM COMPONENTS

### V28Button

- **Path:** `src/components/design-system/V28Button.tsx`
- **Status:** ✅ PRODUCTION V28.1
- **Purpose:** Flat, modern button mit subtle shadows
- **Variants:**
  - `primary` - bg-slate-700, text-white, NO BORDER
  - `secondary` - bg-slate-100, text-slate-900, border-slate-200 (1px)
- **Sizes:** `sm` (h-10), `md` (h-12), `lg` (h-14)
- **Hover:** scale-[1.02] + shadow-md
- **Focus:** ring-2 ring-slate-500
- **Usage:** IMMER für Buttons verwenden!

### V28Badge

- **Path:** `src/components/design-system/V28Badge.tsx`
- **Status:** ✅ PRODUCTION V28.1
- **Purpose:** Flat badge mit 1px border
- **Variants:**
  - `primary` - bg-slate-100, border-slate-300, text-slate-800
  - `secondary` - bg-slate-50, border-slate-200, text-slate-700
- **Styling:** px-3 py-1, rounded-full, 1px border
- **Usage:** Für Rabatte, Labels, Tags

### V28IconBox

- **Path:** `src/components/design-system/V28IconBox.tsx`
- **Status:** ✅ PRODUCTION V28.1
- **Purpose:** Borderless icon container mit slate colors
- **Variants:**
  - `primary` - bg-slate-700, text-white
  - `secondary` - bg-slate-100, text-slate-700
- **Sizes:** `sm` (h-10 w-10), `md` (h-12 w-12), `lg` (h-14 w-14)
- **Border:** NONE (borderless!)
- **Usage:** Für Icons in Cards, Headers

### V28BillingToggle

- **Path:** `src/components/design-system/V28BillingToggle.tsx`
- **Status:** ✅ PRODUCTION V28.1
- **Purpose:** Clean toggle switch für Monthly/Yearly
- **Features:**
  - Container: bg-slate-100, border-slate-200, shadow-lg
  - Active Button: bg-white, shadow-md
  - Inactive Button: text-slate-600
  - Integrated V28Badge für discount
- **Props:**
  - `billingPeriod: 'monthly' | 'yearly'`
  - `onToggle: (period) => void`
  - `discountText?: string` (default: '-20%')
- **Usage:** Für Billing-Period Selection

### V28MarketingSection

- **Path:** `src/components/design-system/V28MarketingSection.tsx`
- **Status:** ✅ PRODUCTION V28.1
- **Purpose:** Section wrapper mit optionalem Title/Description
- **Props:**
  - `background?: 'canvas' | 'white'`
  - `title?: string`
  - `description?: string`
  - `children: ReactNode`
- **Backgrounds:** Alternating canvas (slate-50) / white
- **Usage:** Für alle Marketing-Sections

### V28MarketingCard

- **Path:** `src/components/design-system/V28MarketingCard.tsx`
- **Status:** ✅ PRODUCTION V28.1
- **Purpose:** Standard card container
- **Styling:**
  - rounded-2xl
  - border-slate-200 (1px)
  - shadow-lg
  - p-8 default padding
- **Usage:** Für Info-Boxen, FAQ-Container

### V28InfoBox

- **Path:** `src/components/design-system/V28InfoBox.tsx`
- **Status:** ✅ PRODUCTION V28.1
- **Purpose:** Info/Legal notice box
- **Types:**
  - `info` - Informationen
  - `legal` - Rechtliche Hinweise
- **Styling:** bg-slate-50, border-l-4 border-slate-700, p-6
- **Usage:** Für DSGVO-Hinweise, Informationen

### V28FeatureListItem

- **Path:** `src/components/design-system/V28FeatureListItem.tsx`
- **Status:** ✅ PRODUCTION V28.1
- **Purpose:** Feature list item mit Check-Icon
- **Styling:**
  - Check-Icon: bg-slate-100, text-slate-700
  - Text: text-slate-700
- **Usage:** In Feature-Listen

---

## 💰 V28.1 PRICING COMPONENTS

### V28PricingCard

- **Path:** `src/components/pricing/V28PricingCard.tsx`
- **Status:** ✅ PRODUCTION V28.1
- **Purpose:** Premium pricing cards
- **Props:**
  - `name: string`
  - `description: string`
  - `price: string`
  - `priceDetail?: string`
  - `icon: LucideIcon`
  - `features: Array<{ text: string; included: boolean }>`
  - `ctaLabel: string`
  - `ctaVariant?: 'primary' | 'secondary'`
  - `onCTAClick: () => void`
  - `highlighted?: boolean`
  - `badge?: string`
  - `hasMoreFeatures?: boolean`
  - `onShowAllFeatures?: () => void`
- **Styling:**
  - Highlighted: ring-2 ring-slate-400, shadow-2xl
  - Standard: border-slate-200, shadow-lg
  - Hover: scale-[1.01], shadow-2xl
- **Usage:** Für Tarif-Karten auf Pricing-Page

### V28PricingHero

- **Path:** `src/components/pricing/V28PricingHero.tsx`
- **Status:** ✅ PRODUCTION V28.1
- **Purpose:** Hero section mit gradient background
- **Features:**
  - Gradient: from-slate-700 to-slate-800
  - Animated background orbs
  - Centered title + subtitle
  - Children slot für BillingToggle
- **Usage:** Hero-Section auf Pricing/Marketing-Pages

### V28ComparisonTable

- **Path:** `src/components/pricing/V28ComparisonTable.tsx`
- **Status:** ✅ PRODUCTION V28.1 (FINAL)
- **Purpose:** Flat comparison table
- **Features:**
  - Header: bg-gradient-to-r from-slate-700 to-slate-800
  - Highlighted Column: bg-slate-100, rounded-xl, NO BORDERS!
  - Check Icons: text-slate-700
  - X Icons: text-slate-400
  - Hover: hover:bg-slate-50
- **Props:**
  - `features: Array<{ name: string; starter: boolean; business: boolean; enterprise: boolean }>`
- **Usage:** Tarif-Vergleichstabelle

### V28AddonCard

- **Path:** `src/components/pricing/V28AddonCard.tsx`
- **Status:** ✅ PRODUCTION V28.1
- **Purpose:** Add-on feature cards
- **Props:**
  - `icon: LucideIcon`
  - `title: string`
  - `price?: string`
  - `priceLabel?: string`
  - `description: string`
  - `children?: ReactNode`
  - `highlighted?: boolean`
- **Styling:**
  - Highlighted: ring-2 ring-slate-400, shadow-xl
  - Standard: border-slate-200, shadow-lg
  - Hover: scale-[1.02], shadow-2xl
- **Usage:** Add-On Cards auf Pricing-Page

### V28AccordionItem

- **Path:** `src/components/pricing/V28AccordionItem.tsx`
- **Status:** ✅ PRODUCTION V28.1
- **Purpose:** FAQ accordion item
- **Features:**
  - Clean borders (border-b border-slate-200)
  - No last-child border
  - Smooth transitions
- **Usage:** FAQ-Section

### TariffFeatureDialog

- **Path:** `src/components/pricing/TariffFeatureDialog.tsx`
- **Status:** ✅ PRODUCTION V28.1
- **Purpose:** Feature detail dialog
- **Usage:** "Alle Features anzeigen" Dialog

---

## 🧩 SHADCN/UI COMPONENTS (42+)

### Standard UI Components

- `Button` (`src/components/ui/button.tsx`) - shadcn base button
- `Badge` (`src/components/ui/badge.tsx`) - shadcn base badge
- `Card` (`src/components/ui/card.tsx`) - Card system
- `Dialog` (`src/components/ui/dialog.tsx`) - Modals
- `Accordion` (`src/components/ui/accordion.tsx`) - Accordion
- `Input`, `Label`, `Select`, `Checkbox`, etc. - Form elements
- ... weitere 35+ shadcn Components

**Note:** Für V28.1 Design IMMER V28-Components verwenden, nicht shadcn direkt!

---

## 🏗️ LAYOUT COMPONENTS

### MarketingLayout

- **Path:** `src/components/layout/MarketingLayout.tsx`
- **Status:** ✅ PRODUCTION
- **Purpose:** Layout für Marketing-Seiten
- **Features:**
  - UnifiedHeader
  - Content Area
  - UnifiedFooter
- **Usage:** Wrapper für /pricing, /contact, legal pages

### UnifiedHeader

- **Path:** `src/components/layout/UnifiedHeader.tsx`
- **Status:** ✅ PRODUCTION
- **Purpose:** Header mit Navigation
- **Usage:** In MarketingLayout

### UnifiedFooter

- **Path:** `src/components/layout/UnifiedFooter.tsx`
- **Status:** ✅ PRODUCTION
- **Purpose:** Footer mit Legal Links
- **Usage:** In MarketingLayout

### MainLayout

- **Path:** `src/components/layout/MainLayout.tsx`
- **Status:** ✅ PRODUCTION
- **Purpose:** Portal/Dashboard Layout
- **Usage:** Für authentifizierte Bereiche

---

## 📝 UPDATE PROTOCOL

**Bei JEDER neuen Component:**

1. ✅ Sofort hier eintragen
2. ✅ Path, Status, Purpose, Props dokumentieren
3. ✅ filesExplorer.md aktualisieren
4. ✅ CHANGELOG.md Eintrag
5. ✅ Falls V28.1 relevant: In DESIGN_SYSTEM_V28.1_FINAL.md

**Bei Component-Änderungen:**

1. ✅ Props/Styling hier aktualisieren
2. ✅ Status aktualisieren (⚠️ → ✅)
3. ✅ CHANGELOG.md Eintrag
4. ✅ PROJECT_MEMORY_V28.1.md ggf. updaten

**Bei Component-Löschung:**

1. ✅ Aus Registry entfernen
2. ✅ In filesExplorer.md markieren (❌ DEPRECATED)
3. ✅ CHANGELOG.md Eintrag
4. ✅ Prüfen: Noch irgendwo importiert? → Cleanup!

---

## 🔍 QUICK SEARCH

### Nach Component-Typ

- V28.1 Design System → `src/components/design-system/V28*.tsx`
- V28.1 Pricing → `src/components/pricing/V28*.tsx`
- shadcn/ui → `src/components/ui/*.tsx`
- Layout → `src/components/layout/*.tsx`

### Nach Funktion

- **Buttons:** V28Button
- **Badges:** V28Badge
- **Icons:** V28IconBox
- **Cards:** V28PricingCard, V28AddonCard, V28MarketingCard
- **Sections:** V28MarketingSection
- **Toggle:** V28BillingToggle
- **Tables:** V28ComparisonTable
- **Dialogs:** TariffFeatureDialog

---

**LAST UPDATE:** 2025-01-28  
**TOTAL COMPONENTS:** 16 V28.1 + 42 shadcn + 4 Layout = 62+  
**STATUS:** ✅ V28.1 FINALISIERT
