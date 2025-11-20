# COMPONENT LIBRARY V18.5.1 - MYDISPATCH

> **Version:** 18.5.1  
> **Letzte Aktualisierung:** 2025-10-23  
> **Status:** 🟢 PRODUCTION-READY  
> **Zweck:** Zentrale Referenz aller wiederverwendbaren UI-Komponenten

---

## 🎯 ÜBERSICHT

Diese Library dokumentiert **ALLE** wiederverwendbaren UI-Komponenten in MyDispatch mit:

- ✅ Code-Beispielen
- ✅ Props-Dokumentation
- ✅ Use-Cases
- ✅ Do's & Don'ts
- ✅ Accessibility-Guidelines

---

## 📦 KOMPONENTEN-KATEGORIEN

### 1. BUTTONS

### 2. BADGES & INDICATORS

### 3. CARDS & CONTAINERS

### 4. INPUTS & FORMS

### 5. DIALOGS & MODALS

### 6. LAYOUT-KOMPONENTEN

### 7. NAVIGATION

### 8. DATA-DISPLAY

---

## 1️⃣ BUTTONS

### 1.1 Marketing-Buttons

**Location:** `src/components/design-system/MarketingButton.tsx`

**Purpose:** Spezialisierte Buttons für Marketing-Seiten mit perfekten Kontrasten.

**Varianten:**

#### hero-primary

```tsx
import { MarketingButton } from "@/components/design-system/MarketingButton";

<MarketingButton marketingVariant="hero-primary">Jetzt abonnieren</MarketingButton>;
```

- **Use-Case:** Primäre CTA auf Hero-Bereichen
- **Style:** `bg-primary text-foreground` mit Hover-Glow
- **Touch-Target:** ✅ 44px minimum

#### hero-secondary

```tsx
<MarketingButton marketingVariant="hero-secondary">Mehr erfahren</MarketingButton>
```

- **Use-Case:** Sekundäre CTA auf Hero-Bereichen
- **Style:** Transparent mit Border, Glassmorphism
- **Important:** `!text-white` für Kontrast auf dunklen BGs

#### cta-primary

```tsx
<MarketingButton marketingVariant="cta-primary">Kostenlos testen</MarketingButton>
```

- **Use-Case:** Call-to-Action in Content-Bereichen
- **Style:** `bg-primary` mit Shadow-Lift

#### cta-secondary

```tsx
<MarketingButton marketingVariant="cta-secondary">Preise ansehen</MarketingButton>
```

- **Use-Case:** Sekundäre CTAs in Content-Bereichen
- **Style:** Border mit Hover-BG

**Props:**

```typescript
interface MarketingButtonProps extends ButtonProps {
  marketingVariant?: "hero-primary" | "hero-secondary" | "cta-primary" | "cta-secondary";
}
```

**✅ DO:**

- Marketing-Buttons NUR auf öffentlichen Marketing-Seiten
- Immer `min-h-[44px]` für Touch-Targets
- Hover-States für Interaktivität

**❌ DON'T:**

- Marketing-Buttons in internen App-Seiten (verwende App-Buttons!)
- Direkte Color-Overrides via className
- Touch-Targets < 44px

---

### 1.2 App-Buttons

**Location:** `src/components/ui/button.tsx`

**Purpose:** Standard-Buttons für interne App-Seiten.

**Varianten:**

#### default

```tsx
import { Button } from "@/components/ui/button";

<Button variant="default">Speichern</Button>;
```

- **Use-Case:** Primäre Aktionen in Forms/Dialogs
- **Style:** `bg-primary text-primary-foreground`

#### secondary

```tsx
<Button variant="secondary">Abbrechen</Button>
```

- **Use-Case:** Sekundäre Aktionen
- **Style:** `bg-secondary text-secondary-foreground`

#### outline

```tsx
<Button variant="outline">Exportieren</Button>
```

- **Use-Case:** Tertiary Actions mit Border
- **Style:** Transparent mit Border

#### ghost

```tsx
<Button variant="ghost">
  <Edit className="h-4 w-4" />
</Button>
```

- **Use-Case:** Icon-Buttons ohne BG
- **Style:** Transparent, Hover: `bg-muted/80`

#### destructive

```tsx
<Button variant="destructive">Löschen</Button>
```

- **Use-Case:** Gefährliche Aktionen (Delete, Deactivate)
- **Style:** `bg-destructive text-destructive-foreground`

#### link

```tsx
<Button variant="link">Mehr Details</Button>
```

- **Use-Case:** Text-Links mit Button-Padding
- **Style:** `text-primary underline-offset-4`

#### quickAction

```tsx
<Button variant="quickAction">
  <Plus className="h-4 w-4 mr-2" />
  Neu
</Button>
```

- **Use-Case:** Quick-Action Buttons in Toolbars
- **Style:** Kompakt mit Icon

**Sizes:**

```tsx
<Button size="sm">Klein</Button>
<Button size="default">Standard</Button>
<Button size="lg">Groß</Button>
<Button size="icon"><Icon /></Button>
```

**✅ DO:**

- App-Buttons für interne Seiten
- Size="icon" für Icon-Only Buttons
- Destructive für gefährliche Aktionen

**❌ DON'T:**

- Marketing-Varianten in App-Bereichen
- Inline-Styles für Colors
- Button ohne aria-label (bei icon-only)

---

## 2️⃣ BADGES & INDICATORS

### 2.1 Animated Badge

**Location:** `src/components/enhanced/AnimatedBadge.tsx`

**Purpose:** Animated Badges mit Status-Anzeige.

**Varianten:**

```tsx
import { AnimatedBadge } from '@/components/enhanced/AnimatedBadge';
import { CheckCircle } from 'lucide-react';

// Success Badge
<AnimatedBadge
  label="Aktiv"
  icon={CheckCircle}
  variant="success"
  glow
/>

// Warning Badge
<AnimatedBadge
  label="Ausstehend"
  variant="warning"
  pulse
/>

// Error Badge
<AnimatedBadge
  label="Abgelehnt"
  variant="error"
/>

// Info Badge
<AnimatedBadge
  label="In Bearbeitung"
  variant="info"
/>
```

**Props:**

```typescript
interface AnimatedBadgeProps {
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "success" | "warning" | "error" | "info";
  pulse?: boolean; // Animate pulse
  glow?: boolean; // Glow effect
  className?: string;
}
```

**✅ DO:**

- Status-Badges für Status-Anzeigen (Ampel-System)
- Glow bei wichtigen States
- Icons für bessere Erkennbarkeit

**❌ DON'T:**

- Zu viele Badges gleichzeitig (max 3 pro View)
- Pulse bei unwichtigen States
- Badges als Buttons verwenden

---

### 2.2 Status Indicator

**Location:** `src/components/shared/StatusIndicator.tsx`

**Purpose:** Ampel-System für Statuses (Grün/Gelb/Rot).

```tsx
import { StatusIndicator } from '@/components/shared/StatusIndicator';

<StatusIndicator status="active" />    // Grün
<StatusIndicator status="pending" />   // Gelb
<StatusIndicator status="inactive" />  // Rot
```

---

## 3️⃣ CARDS & CONTAINERS

### 3.1 KPI-Cards

**Location:** `src/components/ui/card.tsx` + Custom Wrapper

**Purpose:** Dashboard KPI-Anzeige mit Icons.

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

<Card className="p-4 sm:p-6 hover:shadow-md transition-all">
  <CardHeader className="pb-2">
    <div className="flex items-center justify-between">
      <CardTitle className="text-sm font-medium text-muted-foreground">Aktive Fahrer</CardTitle>
      <Users className="h-4 w-4 text-muted-foreground" />
    </div>
  </CardHeader>
  <CardContent>
    <div className="text-2xl sm:text-3xl font-bold text-foreground">{value}</div>
    <p className="text-xs text-muted-foreground mt-1">+12% vs. letzter Monat</p>
  </CardContent>
</Card>;
```

**Grid-Layout:**

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  <KPICard title="KPI 1" value={123} icon={Icon1} />
  <KPICard title="KPI 2" value={456} icon={Icon2} />
  <KPICard title="KPI 3" value={789} icon={Icon3} />
  <KPICard title="KPI 4" value={101} icon={Icon4} />
</div>
```

**✅ DO:**

- Responsive Grid (1 col mobile, 2 tablet, 4 desktop)
- Icons für schnelle Erkennbarkeit
- Hover-Effects für Interaktivität

**❌ DON'T:**

- Zu viele KPIs gleichzeitig (max 4-6)
- Lange Texte in KPI-Cards
- KPIs ohne Kontext/Vergleich

---

### 3.2 Content Cards

```tsx
<Card className="p-6 shadow-card hover:shadow-card-hover transition-all">
  <CardHeader>
    <CardTitle>Titel</CardTitle>
    <CardDescription>Beschreibung</CardDescription>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

## 4️⃣ INPUTS & FORMS

### 4.1 Standard Input

**Location:** `src/components/ui/input.tsx`

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="email">E-Mail</Label>
  <Input id="email" type="email" placeholder="name@firma.de" className="w-full" />
</div>;
```

**✅ DO:**

- Label mit htmlFor (Accessibility!)
- Placeholder für Beispiele
- Type-Attribute (email, tel, number)

**❌ DON'T:**

- Label vergessen
- Placeholder als Label missbrauchen
- Ohne DSGVO-Hinweis bei Datensammlung

---

### 4.2 Search Input

```tsx
<div className="relative flex-1 w-full">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input
    placeholder="Suchen..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-10"
  />
</div>
```

---

### 4.3 Searchable Select

**Location:** `src/components/shared/SearchableSelect.tsx`

```tsx
import { SearchableSelect } from "@/components/shared/SearchableSelect";

<SearchableSelect
  options={[
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
  ]}
  value={selectedValue}
  onChange={setSelectedValue}
  placeholder="Wählen Sie..."
/>;
```

---

### 4.4 Inline Customer Form

**Location:** `src/components/forms/InlineCustomerForm.tsx`

```tsx
import { InlineCustomerForm } from "@/components/forms/InlineCustomerForm";

<InlineCustomerForm
  onCustomerCreated={(customer) => {
    console.log("Neuer Kunde:", customer);
  }}
/>;
```

---

## 5️⃣ DIALOGS & MODALS

### 5.1 Standard Dialog

**Location:** `src/components/ui/dialog.tsx`

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Dialog Titel</DialogTitle>
      <DialogDescription>Beschreibung des Dialogs</DialogDescription>
    </DialogHeader>

    {/* Content */}
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Fields */}
    </form>

    <DialogFooter className="flex justify-end gap-3 border-t pt-4">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Abbrechen
      </Button>
      <Button type="submit">Speichern</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

**✅ DO:**

- Max-Width für Lesbarkeit (max-w-2xl)
- Max-Height für Mobile (max-h-[85vh])
- Overflow-y-auto bei langem Content
- DialogFooter mit Border-Top

**❌ DON'T:**

- Dialog ohne Close-Option
- Zu breite Dialogs (> max-w-4xl)
- Dialogs ohne Fokus-Trap

---

### 5.2 Detail Dialog

**Location:** `src/components/shared/DetailDialog.tsx`

```tsx
import { DetailDialog } from "@/components/shared/DetailDialog";

<DetailDialog
  open={showDetail}
  onOpenChange={setShowDetail}
  title="Auftrag Details"
  data={selectedBooking}
  sections={[
    { label: "Kunde", value: booking.customer_name },
    { label: "Abholdatum", value: booking.pickup_date },
    { label: "Status", value: <StatusIndicator status={booking.status} /> },
  ]}
/>;
```

---

## 6️⃣ LAYOUT-KOMPONENTEN

### 6.1 Marketing Layout

**Location:** `src/components/layout/MarketingLayout.tsx`

**Purpose:** Layout für öffentliche Marketing-Seiten.

```tsx
import { MarketingLayout } from "@/components/layout/MarketingLayout";

export default function PricingPage() {
  return <MarketingLayout currentPage="pricing">{/* Page Content */}</MarketingLayout>;
}
```

**Features:**

- ✅ Primary Gradient Header
- ✅ Primary Gradient Footer
- ✅ Desktop Sidebar (64px/240px hover-expand)
- ✅ Mobile Hamburger-Menu
- ✅ Logo klickbar zu /

---

### 6.2 Main Layout (App)

**Location:** `src/components/layout/MainLayout.tsx`

**Purpose:** Layout für geschützte App-Seiten.

```tsx
import { MainLayout } from "@/components/layout/MainLayout";

export default function DashboardPage() {
  return <MainLayout>{/* Page Content */}</MainLayout>;
}
```

**Features:**

- ✅ App Sidebar (64px/240px)
- ✅ Primary Gradient Header
- ✅ Primary Gradient Footer
- ✅ Mobile Bottom-Nav
- ✅ Logo klickbar zu /dashboard

---

### 6.3 Standard Page Layout

**Location:** `src/components/layout/StandardPageLayout.tsx`

**Purpose:** Wrapper für interne App-Seiten mit Titel & Actions.

```tsx
import { StandardPageLayout } from "@/components/layout/StandardPageLayout";

<StandardPageLayout
  title="Fahrer & Fahrzeuge"
  description="Verwalten Sie Ihre Fahrer und Fahrzeuge zentral"
  actions={[
    <Button onClick={handleCreate}>
      <Plus className="h-4 w-4 mr-2" />
      Fahrer hinzufügen
    </Button>,
  ]}
>
  {/* Page Content */}
</StandardPageLayout>;
```

---

## 7️⃣ NAVIGATION

### 7.1 App Sidebar

**Location:** `src/components/layout/AppSidebar.tsx`

```tsx
import { AppSidebar } from "@/components/layout/AppSidebar";

<AppSidebar />;
```

**Features:**

- ✅ Active-Route Highlighting
- ✅ Icon + Label
- ✅ Collapsible (64px/240px)
- ✅ Permissions-basierte Anzeige

---

### 7.2 Mobile Bottom Nav

**Location:** `src/components/layout/MobileBottomNav.tsx`

```tsx
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

<MobileBottomNav />;
```

---

## 8️⃣ DATA-DISPLAY

### 8.1 Data Table

**Location:** `src/components/ui/table.tsx`

```tsx
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

<div className="rounded-md border">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Aktionen</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id}>
          <TableCell>{item.name}</TableCell>
          <TableCell>
            <StatusIndicator status={item.status} />
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>;
```

**✅ DO:**

- Rounded Border um Table
- Text-right für Actions-Column
- StatusIndicator für Status-Spalten

**❌ DON'T:**

- Tables ohne Border
- Actions ohne Icon
- Lange Texte ohne Truncate

---

### 8.2 Bulk Action Bar

**Location:** `src/components/shared/BulkActionBar.tsx`

```tsx
import { BulkActionBar } from "@/components/shared/BulkActionBar";

<BulkActionBar
  selectedCount={selectedIds.size}
  onClearSelection={clearSelection}
  actions={[
    {
      label: "Bearbeiten",
      icon: Edit,
      onClick: handleBulkEdit,
    },
    {
      label: "Archivieren",
      icon: Archive,
      onClick: handleBulkArchive,
      variant: "destructive",
    },
  ]}
/>;
```

---

## 📋 BEST PRACTICES

### General Rules

1. **NIEMALS direkte Farben:** `text-white`, `bg-[#fff]` verboten!
2. **IMMER Semantic Tokens:** `text-foreground`, `bg-primary`
3. **Mobile-First:** `text-sm md:text-base`, `gap-2 md:gap-4`
4. **Touch-Targets:** Buttons min-h-[44px] (Apple/Google Guidelines)
5. **Accessibility:** aria-label bei icon-only Buttons

### Import-Pattern

```tsx
// ✅ Korrekt: Von zentralen Komponenten importieren
import { Button } from "@/components/ui/button";
import { MarketingButton } from "@/components/design-system/MarketingButton";

// ❌ Falsch: Direkt von node_modules
import { Button } from "@radix-ui/react-button"; // NIEMALS!
```

### Naming-Conventions

```tsx
// Components: PascalCase
MarketingButton.tsx;

// Hooks: camelCase mit 'use' Prefix
useAuth.ts;

// Utils: camelCase
formatCurrency.ts;

// Constants: UPPER_SNAKE_CASE
PRICING_TIERS.ts;
```

---

## 🔗 VERWANDTE DOKUMENTE

- [DESIGN_SYSTEM_V18.5.0.md](./DESIGN_SYSTEM_V18.5.0.md) - Vollständiges Design-System
- [BUTTON_USAGE_GUIDE_V18.5.0.md](./BUTTON_USAGE_GUIDE_V18.5.0.md) - Button-Spezifikation
- [UI_LIBRARY_SYSTEM_V18.5.0.md](./UI_LIBRARY_SYSTEM_V18.5.0.md) - UI-Übersicht
- [APP_PAGE_TEMPLATE_V18.5.1.md](./APP_PAGE_TEMPLATE_V18.5.1.md) - Seiten-Templates

---

**Version:** 18.5.1  
**Datum:** 2025-10-23  
**Status:** 🟢 PRODUCTION-READY & VOLLSTÄNDIG
