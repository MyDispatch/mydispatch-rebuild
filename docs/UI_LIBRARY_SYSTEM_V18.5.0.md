# UI-LIBRARY SYSTEM V18.5.1

> **Version:** 18.5.1  
> **Letzte Aktualisierung:** 2025-01-27 (V39.0 - Dashboard-Komponenten vollständig dokumentiert)
> **Status:** 🟢 Production-Ready

---

## 🎯 ÜBERSICHT

Zentrale UI-Komponenten-Library für MyDispatch mit **100% V26.1 Design System Konformität**.

**Prinzipien:**

- ✅ UNIFIED_DESIGN_TOKENS als einzige Farbquelle
- ✅ Mobile-First Responsive Design
- ✅ Wiederverwendbarkeit über Seiten hinweg
- ✅ Type-Safe Props mit TypeScript
- ✅ Accessibility (WCAG AA)

---

## 📚 KOMPONENTEN-STRUKTUR

### 1. V26.0 Design System Components (src/components/design-system/)

#### V26Button.tsx

**Verwendung:** Primary/Secondary Action-Buttons  
**Props:**

```typescript
interface V26ButtonProps {
  variant: "primary" | "secondary";
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  icon?: LucideIcon;
}
```

**Beispiel:**

```tsx
<V26Button variant="primary" onClick={handleSave}>
  Speichern
</V26Button>
```

---

#### V26IconBox.tsx

**Verwendung:** Icon-Container mit Premium-Styling  
**Design:** Dunkelblau Hintergrund, Beige Icon  
**Props:**

```typescript
interface V26IconBoxProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
}
```

**Beispiel:**

```tsx
<V26IconBox icon={Users} size="md" />
```

---

#### V26InfoBox.tsx

**Verwendung:** Notice-/Hinweis-Boxen  
**Typen:** `info`, `warning`, `legal`  
**Props:**

```typescript
interface V26InfoBoxProps {
  type: "info" | "warning" | "legal";
  icon?: LucideIcon;
  children: ReactNode;
}
```

**Beispiel:**

```tsx
<V26InfoBox type="legal" icon={Shield}>
  DSGVO-Hinweis: Ihre Daten werden verschlüsselt gespeichert.
</V26InfoBox>
```

**Dokumentation:** `docs/V26_INFOBOARD_SYSTEM.md`

---

### 2. V26.1 Dashboard Components (src/components/dashboard/) **⭐ NEU**

#### V26DashboardCard.tsx

**Verwendung:** Standardisiertes Card-Layout für Dashboard-Bereiche  
**Features:**

- ✅ Konsistente Border, Shadow, Radius
- ✅ Premium Glow-Effekte
- ✅ Header mit optionalem Icon & Action
- ✅ Responsive Padding

**Props:**

```typescript
interface V26DashboardCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  headerAction?: ReactNode;
  className?: string;
}
```

**Beispiel:**

```tsx
<V26DashboardCard
  title="Letzte Aufträge"
  icon={FileText}
  headerAction={<Button variant="ghost">Alle anzeigen</Button>}
>
  <Table>...</Table>
</V26DashboardCard>
```

**Verwendet in:**

- Dashboard (Index.tsx)
- Aufträge (Auftraege.tsx)
- Kommunikation (Kommunikation.tsx)

---

#### V26KPICard.tsx

**Verwendung:** KPI-Darstellung mit Icon, Wert & Trend  
**Features:**

- ✅ Gradient Background (Weiß → Canvas)
- ✅ Hover-Scale-Animation (1.02x)
- ✅ Premium Glow-Effekte
- ✅ Optional: Trend mit Pfeil-Indikator

**Props:**

```typescript
interface V26KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}
```

**Beispiel:**

```tsx
<V26KPICard
  label="Abgeschlossene Aufträge"
  value={42}
  icon={CheckCircle}
  trend={{ value: 12, isPositive: true }}
/>
```

**Verwendet in:**

- Dashboard (Index.tsx)
- Alle Dashboard-Seiten mit KPIs

---

#### V26DashboardTable.tsx

**Verwendung:** Standardisierte Tabelle mit Row/Cell-Komponenten  
**Features:**

- ✅ Responsive Design (Mobile-First)
- ✅ Hover-Effekte auf Rows
- ✅ Konsistente Spacing & Border
- ✅ Clickable Rows

**Components:**

- `V26DashboardTable` - Container
- `V26DashboardTableRow` - Zeile (clickable)
- `V26DashboardTableCell` - Zelle

**Props:**

```typescript
interface V26DashboardTableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

interface V26DashboardTableRowProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

interface V26DashboardTableCellProps {
  children: ReactNode;
  className?: string;
}
```

**Beispiel:**

```tsx
<V26DashboardTable headers={["Name", "Status", "Datum", "Aktionen"]}>
  {items.map((item) => (
    <V26DashboardTableRow key={item.id} onClick={() => handleView(item)}>
      <V26DashboardTableCell>{item.name}</V26DashboardTableCell>
      <V26DashboardTableCell>
        <StatusIndicator type={item.status} />
      </V26DashboardTableCell>
      <V26DashboardTableCell>{formatDate(item.date)}</V26DashboardTableCell>
      <V26DashboardTableCell>
        <Button variant="ghost" size="sm">
          Bearbeiten
        </Button>
      </V26DashboardTableCell>
    </V26DashboardTableRow>
  ))}
</V26DashboardTable>
```

**Verwendet in:**

- Aufträge (Auftraege.tsx)
- Fahrer/Fahrzeuge (Fahrer.tsx)
- Dokumente (Dokumente.tsx)

---

#### V26FilterSection.tsx

**Verwendung:** Filter-Leiste mit Search & Action-Buttons  
**Features:**

- ✅ Integrierte Search-Bar
- ✅ Action-Buttons (Add, Export, etc.)
- ✅ Responsive Layout
- ✅ Konsistente Spacing

**Props:**

```typescript
interface V26FilterSectionProps {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  actions?: ReactNode;
  className?: string;
}
```

**Beispiel:**

```tsx
<V26FilterSection
  searchPlaceholder="Fahrer durchsuchen..."
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  actions={
    <>
      <V26ActionButton variant="primary" onClick={handleCreate} icon={Plus}>
        Neuer Fahrer
      </V26ActionButton>
      <V26ActionButton variant="outline" onClick={handleExport} icon={Download}>
        Exportieren
      </V26ActionButton>
    </>
  }
/>
```

**Verwendet in:**

- Alle Dashboard-Seiten mit Tabellen

---

#### V26ActionButton.tsx

**Verwendung:** Standardisierte Action-Buttons  
**Varianten:**

- `primary` - Dunkelblau mit Beige Text
- `secondary` - Beige mit Dunkelblau Text
- `outline` - Transparent mit Dunkelblau Border

**Props:**

```typescript
interface V26ActionButtonProps {
  onClick: () => void;
  icon?: LucideIcon;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  className?: string;
}
```

**Beispiel:**

```tsx
<V26ActionButton variant="primary" onClick={handleSave} icon={Save}>
  Speichern
</V26ActionButton>
```

**Verwendet in:**

- Alle Dashboard-Seiten

---

### 3. Shared Components (src/components/shared/)

#### StatusIndicator.tsx

**Verwendung:** Ampel-System für Status-Anzeige  
**Typen:** `success` (Grün), `warning` (Gelb), `error` (Rot), `neutral` (Grau)

**Props:**

```typescript
interface StatusIndicatorProps {
  type: "success" | "warning" | "error" | "neutral";
  label?: string;
  size?: "sm" | "md" | "lg";
}
```

**Beispiel:**

```tsx
<StatusIndicator type="success" label="Verfügbar" size="sm" />
```

---

#### EmptyState.tsx

**Verwendung:** Leere Zustände mit Icon, Text & Action

**Props:**

```typescript
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  isSearchResult?: boolean;
}
```

**Beispiel:**

```tsx
<EmptyState
  icon={<FileText className="w-full h-full" />}
  title="Noch keine Aufträge"
  description="Erstellen Sie Ihren ersten Auftrag"
  actionLabel="Neuer Auftrag"
  onAction={() => setDialogOpen(true)}
/>
```

---

#### BulkActionBar.tsx

**Verwendung:** Massenaktionen-Leiste bei Auswahl mehrerer Items

**Props:**

```typescript
interface BulkActionBarProps {
  selectedCount: number;
  onDeselectAll: () => void;
  actions: Array<{
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: "default" | "destructive";
  }>;
}
```

**Beispiel:**

```tsx
<BulkActionBar
  selectedCount={3}
  onDeselectAll={() => clearSelection()}
  actions={[
    {
      label: "Archivieren",
      icon: Archive,
      onClick: handleBulkArchive,
    },
    {
      label: "Löschen",
      icon: Trash,
      onClick: handleBulkDelete,
      variant: "destructive",
    },
  ]}
/>
```

---

#### DetailDialog.tsx

**Verwendung:** Detail-Ansichten mit Delete/Archive-Optionen

**Props:**

```typescript
interface DetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  onDelete?: () => void;
  onArchive?: () => void;
  showDelete?: boolean;
  showArchive?: boolean;
  createdAt?: string;
}
```

**Beispiel:**

```tsx
<DetailDialog
  open={detailOpen}
  onOpenChange={setDetailOpen}
  title={`Auftrag: ${booking.id}`}
  onDelete={handleDelete}
  showDelete={true}
  createdAt={booking.created_at}
>
  {/* Detail-Content */}
</DetailDialog>
```

---

#### PageHeaderWithKPIs.tsx

**Verwendung:** Header mit KPI-Cards & Quick-Actions  
**Features:**

- ✅ Responsive Grid (1-3 Spalten)
- ✅ KPI-Cards mit Icons & Trends
- ✅ Quick-Action-Buttons

**Props:**

```typescript
interface PageHeaderWithKPIsProps {
  kpis: [KPI, KPI, KPI]; // Genau 3 KPIs
  quickActions: [Action, Action]; // Genau 2 Actions
  quickAccessTitle?: string;
}
```

**Beispiel:**

```tsx
<PageHeaderWithKPIs
  kpis={[
    { title: "Offen", value: 12, icon: Clock, trend: { value: 5, isUp: true } },
    { title: "Bestätigt", value: 45, icon: Check, trend: { value: 2, isUp: true } },
    { title: "Gesamt", value: 120, icon: FileText, trend: { value: 0, isUp: true } },
  ]}
  quickActions={[
    { label: "Neuer Auftrag", icon: Plus, onClick: handleCreate },
    { label: "Exportieren", icon: Download, onClick: handleExport },
  ]}
  quickAccessTitle="Schnellzugriff"
/>
```

---

### 4. Form Components (src/components/forms/)

#### PersonFormFields.tsx

**Verwendung:** Personen-Daten-Formular (Name, Anrede, etc.)  
**Integriert:** Anrede, Vorname, Nachname, Email, Telefon

---

#### AddressInput.tsx

**Verwendung:** Adress-Eingabe mit Google Places Autocomplete  
**Features:**

- ✅ Autocomplete via Google Maps API
- ✅ Automatisches Splitting (Straße, PLZ, Stadt)
- ✅ Manuelle Eingabe-Fallback

---

#### InlineDocumentUpload.tsx

**Verwendung:** Dokument-Upload inline in Formularen  
**Features:**

- ✅ Drag & Drop
- ✅ File-Preview
- ✅ Upload-Progress
- ✅ Ablaufdatum-Erfassung

---

### 5. Base Components (src/components/ui/)

**Shadcn/UI Basis-Komponenten:**

- `button.tsx`, `card.tsx`, `input.tsx`, `dialog.tsx`, `table.tsx`, etc.
- **NIEMALS direkt ändern** - nur via Variants/Props erweitern

---

## 🎨 DESIGN TOKENS (src/lib/design-system/unified-design-tokens.ts)

### Farben

```typescript
colors: {
  // Brand
  dunkelblau: '#323D5E',
  beige: '#EADEBD',
  weiss: '#FFFFFF',
  canvas: '#F9FAFB',

  // Semantic
  text_primary: 'hsl(222 47% 11%)',
  text_secondary: 'hsl(215 16% 47%)',

  // Status
  status_success: 'hsl(142 76% 36%)',
  status_warning: 'hsl(38 92% 50%)',
  status_error: 'hsl(0 84% 60%)',

  // Borders
  beige_border_19: 'hsla(46, 55%, 84%, 0.19)',
  beige_border_30: 'hsla(46, 55%, 84%, 0.30)',
}
```

### Spacing

```typescript
spacing: {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  component: {
    card_padding: '1.5rem',
    panel_padding_x: '1.5rem',
    panel_padding_y: '1rem',
    gap_cards: '1rem',
    gap_inline: '0.75rem',
  }
}
```

### Borders

```typescript
border: {
  width: {
    standard: '2px',
    thick: '3px',
  },
  styles: {
    card_standard: {
      borderWidth: '2px',
      borderStyle: 'solid',
    }
  }
}
```

### Shadows

```typescript
shadow: {
  component: {
    card_standard: '0 4px 16px hsla(46, 55%, 84%, 0.15), 0 2px 8px hsla(50, 61%, 94%, 0.1)',
    card_hover: '0 8px 24px hsla(46, 55%, 84%, 0.25), 0 4px 12px hsla(50, 61%, 94%, 0.15)',
  }
}
```

### Radius

```typescript
radius: {
  component: {
    card: '0.75rem',      // 12px
    button: '0.75rem',    // 12px
    input: '0.5rem',      // 8px
  }
}
```

---

## ✅ BEST PRACTICES

### 1. Token-Compliance

```typescript
// ❌ FALSCH: Direkte Farben
<div className="bg-white text-black border-gray-200">

// ✅ RICHTIG: Token-basiert
<div style={{
  backgroundColor: UNIFIED_DESIGN_TOKENS.colors.weiss,
  color: UNIFIED_DESIGN_TOKENS.colors.text_primary,
  borderColor: UNIFIED_DESIGN_TOKENS.colors.beige_border_19,
}}>
```

### 2. Mobile-First Responsive

```typescript
// ❌ FALSCH: Desktop-First
<div className="text-base sm:text-sm">

// ✅ RICHTIG: Mobile-First
<div className="text-sm md:text-base">
```

### 3. Component-Reuse

```typescript
// ❌ FALSCH: Custom Card jedes Mal
<Card className="p-6 border-2 border-[#EADEBD19] rounded-xl shadow-md">

// ✅ RICHTIG: V26DashboardCard
<V26DashboardCard title="Meine Daten" icon={User}>
  {/* Content */}
</V26DashboardCard>
```

### 4. Spacing-Konsistenz

```typescript
// ❌ FALSCH: Hardcoded px
<div className="gap-3 p-5">

// ✅ RICHTIG: Token-basiert
<div style={{
  gap: UNIFIED_DESIGN_TOKENS.spacing.component.gap_inline,
  padding: UNIFIED_DESIGN_TOKENS.spacing.component.card_padding,
}}>
```

### 5. Rundungen bei gestapelten Elementen

```typescript
// ❌ FALSCH: Alle Ecken rund
<div className="space-y-0">
  <div className="rounded-lg"></div>
  <div className="rounded-lg"></div>
</div>

// ✅ RICHTIG: Nur Außen-Ecken
<div className="space-y-0">
  <div className="rounded-t-lg rounded-b-none"></div>
  <div className="rounded-t-none rounded-b-lg"></div>
</div>

// ODER: Tailwind Utility
<div className="divide-y-2">
  <div className="first:rounded-t-lg last:rounded-b-lg"></div>
</div>
```

---

## 📦 EXPORT-STRUKTUR

### Dashboard Components (src/components/dashboard/index.ts)

```typescript
export { V26DashboardCard } from "./V26DashboardCard";
export { V26KPICard } from "./V26KPICard";
export {
  V26DashboardTable,
  V26DashboardTableRow,
  V26DashboardTableCell,
} from "./V26DashboardTable";
export { V26FilterSection } from "./V26FilterSection";
export { V26ActionButton } from "./V26ActionButton";
export { DashboardInfoPanel } from "./DashboardInfoPanel";
export { DashboardSidebar } from "./DashboardSidebar";
```

**Usage:**

```typescript
import { V26DashboardCard, V26KPICard } from "@/components/dashboard";
```

---

## 🚨 ANTI-PATTERNS (NEVER DO)

### 1. Direkte Farben

```typescript
// ❌ NIEMALS
className="text-white bg-black border-gray-200"
style={{ backgroundColor: '#323D5E' }}
```

### 2. Hardcoded Shadows/Borders

```typescript
// ❌ NIEMALS
className="shadow-md border-2"
style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
```

### 3. Komponentenbasierter Duplicate-Code

```typescript
// ❌ NIEMALS: Custom Card-Logik wiederholen
function MyPage() {
  return (
    <Card className="p-6 border-2 border-beige rounded-xl shadow-premium">
      <h2>Titel</h2>
      {/* Content */}
    </Card>
  );
}

// ✅ IMMER: Verwende V26DashboardCard
function MyPage() {
  return (
    <V26DashboardCard title="Titel">
      {/* Content */}
    </V26DashboardCard>
  );
}
```

### 4. Inline-Styles ohne Tokens

```typescript
// ❌ NIEMALS
<div style={{ padding: '24px', gap: '16px' }}>

// ✅ IMMER
<div style={{
  padding: UNIFIED_DESIGN_TOKENS.spacing.lg,
  gap: UNIFIED_DESIGN_TOKENS.spacing.md,
}}>
```

---

## 📊 COVERAGE METRICS

**Dashboard-Komponenten Nutzung:**

- ✅ V26DashboardCard: 8 Seiten
- ✅ V26KPICard: 6 Seiten
- ✅ V26DashboardTable: 7 Seiten
- ✅ V26FilterSection: 7 Seiten
- ✅ V26ActionButton: 12 Seiten

**Token-Compliance:**

- ✅ 100% systemweit (Stand V39.0)
- ✅ 0 direkte Hex-Codes in Components
- ✅ 0 willkürliche px/rem-Werte

---

## 🔗 VERWANDTE DOKUMENTATION

- `docs/DESIGN_SYSTEM_FINAL_V26.md` - Design-System Master
- `docs/UNIFIED_DESIGN_SYSTEM_V26.1.md` - Token-System
- `docs/V26_INFOBOARD_SYSTEM.md` - V26InfoBox-Dokumentation
- `docs/MyDispatch_Gesamtkonzept.md` - System-Architektur

---

**Version:** 18.5.1 | **Status:** 🟢 PRODUCTION-READY  
**Letzte Aktualisierung:** 2025-01-27 | **Nächste Review:** Nach Major-Change
