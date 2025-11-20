# PHOENIX RISING Phase 1.3: Design-System Status

**Version:** 1.0  
**Datum:** 2025-01-31  
**Status:** 🟡 **IN ARBEIT**

---

## Bestandsaufnahme

### ✅ Bereits Implementiert

#### Design-Token-System

- ✅ `src/lib/design-system.ts` - Zentrale Token-Bibliothek (v18.5.0)
  - Typography System (responsive, fluid)
  - Spacing System (8px Grid)
  - Icon Sizes & Colors
  - Card Styles
  - Animations
  - Validation Helpers

#### V28 Design-System-Komponenten (src/components/design-system/)

**Atoms (Basis-Komponenten):**

1. ✅ `V28Button.tsx` - Button mit Varianten (+ Storybook Story)
2. ✅ `V28Badge.tsx` - Status/Info-Badges
3. ✅ `V28IconBox.tsx` - Icon-Container
4. ✅ `V28Select.tsx` - Dropdown-Select
5. ✅ `V28AuthInput.tsx` - Input mit Auth-Fokus
6. ✅ `V28TariffBadge.tsx` - Tarif-spezifische Badges

**Molecules (Komponenten-Kombinationen):** 7. ✅ `V28AuthCard.tsx` - Auth-Container 8. ✅ `V28InfoBox.tsx` - Info/Warning-Boxen 9. ✅ `V28StatCard.tsx` - Statistik-Karten 10. ✅ `V28DashboardCard.tsx` - Dashboard-Container 11. ✅ `V28FeatureListItem.tsx` - Feature-Listen-Eintrag 12. ✅ `V28MarketingCard.tsx` - Marketing-Karten 13. ✅ `V28TariffCard.tsx` - Tarif-Karten 14. ✅ `V28BillingToggle.tsx` - Billing-Toggle (Monat/Jahr)

**Organisms (Sektionen):** 15. ✅ `V28DashboardSection.tsx` - Dashboard-Sektionen 16. ✅ `V28MarketingSection.tsx` - Marketing-Sektionen 17. ✅ `V28Dialog.tsx` - Modal-Dialoge

#### Shadcn/UI Komponenten (src/components/ui/)

- **58 UI-Komponenten** (accordion, alert, button, card, dialog, etc.)
- ✅ Alle mit HSL-Farben konfiguriert
- ✅ Tailwind CSS Integration
- ❌ Keine eigenen Storybook Stories

---

## 🎯 Migrations-Strategie

### Priorität 1: V28 Core-Atoms vervollständigen

**Fehlende Basis-Atome:**

- ❌ `V28Input.tsx` - Standard-Input (nicht nur Auth)
- ❌ `V28Textarea.tsx` - Mehrzeiliges Input
- ❌ `V28Checkbox.tsx` - Checkboxen
- ❌ `V28RadioGroup.tsx` - Radio-Buttons
- ❌ `V28Switch.tsx` - Toggle-Switch
- ❌ `V28Label.tsx` - Form-Labels
- ❌ `V28Link.tsx` - Link-Komponente (existiert als V26)
- ❌ `V28Card.tsx` - Basis-Card (nicht Dashboard-spezifisch)
- ❌ `V28Alert.tsx` - Alert/Notification
- ❌ `V28Table.tsx` - Basis-Tabelle

### Priorität 2: Storybook Stories

**Existierende Stories:**

- ✅ `V28Button.stories.tsx`

**Fehlende Stories (17 Komponenten):**

- ❌ V28Badge
- ❌ V28IconBox
- ❌ V28Select
- ❌ V28AuthInput
- ❌ V28TariffBadge
- ❌ V28AuthCard
- ❌ V28InfoBox
- ❌ V28StatCard
- ❌ V28DashboardCard
- ❌ V28FeatureListItem
- ❌ V28MarketingCard
- ❌ V28TariffCard
- ❌ V28BillingToggle
- ❌ V28DashboardSection
- ❌ V28MarketingSection
- ❌ V28Dialog

### Priorität 3: Component Registry

**Fehlende Registrierungen:**

- Alle V28-Komponenten müssen in `component_registry` Tabelle erfasst werden
- Props-Schema dokumentieren
- Dependencies tracken

---

## 📋 Implementierungs-Plan

### Phase 1.3.1: Core-Atoms (10 neue Komponenten)

**Ziel:** Basis-Atome vervollständigen

```tsx
// Beispiel: V28Input.tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { TYPOGRAPHY } from "@/lib/design-system";

interface V28InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const V28Input = forwardRef<HTMLInputElement, V28InputProps>(
  ({ className, error, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <label className={TYPOGRAPHY.label}>{label}</label>}
        <Input ref={ref} className={cn(error && "border-status-error", className)} {...props} />
        {error && <p className="text-xs text-status-error">{error}</p>}
      </div>
    );
  }
);
```

**Tasks:**

1. ✅ V28Button (existiert)
2. ❌ V28Input - Standard-Input
3. ❌ V28Textarea - Mehrzeiliges Input
4. ❌ V28Checkbox - Checkboxen
5. ❌ V28RadioGroup - Radio-Buttons
6. ❌ V28Switch - Toggle-Switch
7. ❌ V28Label - Form-Labels
8. ❌ V28Link - Link-Komponente
9. ❌ V28Card - Basis-Card
10. ❌ V28Alert - Alert-Komponente
11. ❌ V28Table - Basis-Tabelle

### Phase 1.3.2: Storybook Stories (17 Stories)

**Ziel:** Alle V28-Komponenten visuell testbar machen

```tsx
// Beispiel: V28Input.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { V28Input } from "./V28Input";

const meta = {
  title: "Design System/Atoms/V28Input",
  component: V28Input,
  tags: ["autodocs"],
} satisfies Meta<typeof V28Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Email eingeben...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "E-Mail",
    placeholder: "max@example.com",
  },
};

export const WithError: Story = {
  args: {
    label: "E-Mail",
    placeholder: "max@example.com",
    error: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
  },
};
```

### Phase 1.3.3: Component Registry Integration

**Ziel:** Tracking & Dokumentation

```tsx
// Nach Erstellung jeder Komponente:
await supabase.from("component_registry").insert({
  component_name: "V28Input",
  file_path: "src/components/design-system/V28Input.tsx",
  description: "Standard Input-Feld mit Label und Error-State",
  verification_status: "active",
  props_schema: {
    label: { type: "string", optional: true },
    error: { type: "string", optional: true },
    placeholder: { type: "string", optional: true },
  },
  dependencies: ["@/components/ui/input", "@/lib/design-system"],
  tags: ["atom", "form", "input"],
});
```

---

## 🔄 Nächste Schritte

**Sofort:**

1. ❌ Implementiere V28Input, V28Textarea, V28Checkbox
2. ❌ Erstelle Storybook Stories für alle 3
3. ❌ Registriere in component_registry

**Danach:** 4. ❌ V28RadioGroup, V28Switch, V28Label 5. ❌ V28Link, V28Card, V28Alert, V28Table 6. ❌ Storybook Stories für verbleibende 14 existierende V28-Komponenten

**Final:** 7. ❌ Design-System-Dokumentation im Wiki 8. ❌ Migration Guide (shadcn → V28)

---

## 📊 Metriken

**Komponenten:**

- ✅ V28 Komponenten: 17/28 (61%)
- ✅ Storybook Stories: 1/28 (4%)
- ✅ Registry Einträge: 0/28 (0%)

**Fortschritt:**

- Phase 1.3.1: 0% (0/11 Atoms)
- Phase 1.3.2: 4% (1/17 Stories)
- Phase 1.3.3: 0% (0/28 Registry)

---

**Status:** 🟡 Bereit für Implementierung

**Nächste Aktion:** Implementiere V28Input, V28Textarea, V28Checkbox
