# 🎯 SMART TEMPLATES SYSTEM V21.0.0

> **Version:** 21.0.0  
> **Status:** ✅ PRODUCTION-READY  
> **Letzte Aktualisierung:** 2025-10-25  
> **Zweck:** Zentrale wiederverwendbare UI-Komponenten für schnelle, konsistente Seiten-Migration

---

## 📋 ÜBERSICHT

Das Smart Templates System bietet vorgefertigte, wiederverwendbare React-Komponenten, die auf der **Pricing.tsx Master-Vorlage** basieren und 100% Design-Token-konform sind. Diese Templates beschleunigen die manuelle Migration enorm und garantieren pixelgenaue Konsistenz.

---

## 🎨 DESIGN-PRINZIPIEN

### 1. **100% Token-Basiert**
- Alle visuellen Properties nutzen `DESIGN_TOKENS` aus `design-tokens.ts`
- Keine direkten Farben, Spacing oder Schatten-Werte
- Konsistenz durch zentrale Token-Verwaltung

### 2. **Pixelgenaue Pricing.tsx-Konformität**
- Exakte Übernahme aller Hover-Effekte (translateY, scale, shadow)
- Identische Typografie-Stile (Fluid Typography)
- Konsistente Spacing- und Radius-Werte

### 3. **Maximale Wiederverwendbarkeit**
- Flexible Props für verschiedene Use-Cases
- Composable Design (verschachtelte Templates)
- TypeScript-typisiert für Entwickler-Sicherheit

---

## 📚 VERFÜGBARE SMART TEMPLATES

### 🗂️ CARDS

#### **DashboardCard**
**Zweck:** Universelle Card für Dashboard-Inhalte mit optionalem Icon, Badge und Hover-Effekten.

**Props:**
```typescript
interface DashboardCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: LucideIcon;
  iconVariant?: 'dunkelblau' | 'beige';
  highlighted?: boolean;
  badge?: string;
  onClick?: () => void;
  hoverable?: boolean;
  className?: string;
  contentClassName?: string;
}
```

**Use-Cases:**
- Detaillierte Dashboard-Widgets
- Feature-Boxen mit längeren Inhalten
- Karten mit Call-to-Action-Buttons

**Beispiel:**
```tsx
<DashboardCard
  title="Letzte Aufträge"
  description="Übersicht über die neuesten Buchungen"
  icon={List}
  iconVariant="dunkelblau"
  badge="Neu"
  highlighted={false}
>
  {/* Tabelle oder Liste der Aufträge */}
</DashboardCard>
```

---

#### **StatCard**
**Zweck:** Kompakte Karte für KPIs, Metriken und Statistiken mit optionalem Trend-Indikator.

**Props:**
```typescript
interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: LucideIcon;
  iconVariant?: 'dunkelblau' | 'beige';
  onClick?: () => void;
  className?: string;
}
```

**Use-Cases:**
- KPI-Dashboards
- Statistik-Übersichten
- Quick-Metrics

**Beispiel:**
```tsx
<StatCard
  label="Aufträge heute"
  value="142"
  change={{ value: 12.5, trend: 'up' }}
  icon={Truck}
  iconVariant="beige"
  onClick={() => navigate('/auftraege')}
/>
```

---

### 📐 LAYOUT

#### **SectionHeader**
**Zweck:** Konsistente Sektion-Überschrift mit optionaler Beschreibung und Action-Buttons.

**Props:**
```typescript
interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: 'left' | 'center';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}
```

**Use-Cases:**
- Seiten-Überschriften
- Sektion-Trenner
- Header mit CTA-Buttons

**Beispiel:**
```tsx
<SectionHeader
  title="Dashboard Übersicht"
  description="Verwalten Sie Ihre Aufträge, Fahrer und Fahrzeuge zentral"
  align="center"
  spacing="lg"
  actions={
    <ActionButton variant="primary" icon={Plus}>
      Neuer Auftrag
    </ActionButton>
  }
/>
```

---

#### **DataGrid**
**Zweck:** Responsive Grid-Layout für Karten mit anpassbaren Spalten pro Breakpoint.

**Props:**
```typescript
interface DataGridProps {
  children: ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Use-Cases:**
- KPI-Grids (4-Spalten Desktop, 2-Spalten Tablet)
- Card-Layouts (3-Spalten Desktop)
- Kompakte Listen (6-Spalten Desktop)

**Beispiel:**
```tsx
<DataGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap="lg">
  <StatCard label="Aufträge" value="142" icon={Truck} />
  <StatCard label="Fahrer" value="28" icon={Users} />
  <StatCard label="Fahrzeuge" value="35" icon={Car} />
  <StatCard label="Umsatz" value="12.450 €" icon={Euro} />
</DataGrid>
```

---

### 🖱️ INTERACTIVE

#### **ActionButton**
**Zweck:** CI-konforme Button-Komponente mit allen Varianten (Primary, Secondary, Ghost, Destructive).

**Props:**
```typescript
interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}
```

**Use-Cases:**
- Call-to-Action-Buttons
- Formular-Submit-Buttons
- Navigations-Links als Buttons

**Beispiel:**
```tsx
<ActionButton
  variant="primary"
  size="lg"
  icon={Plus}
  iconPosition="left"
  onClick={handleCreate}
>
  Neuer Auftrag
</ActionButton>

<ActionButton
  variant="secondary"
  icon={Download}
  iconPosition="right"
  loading={isDownloading}
>
  Exportieren
</ActionButton>
```

---

## 🚀 QUICK START

### Installation (bereits vorhanden)
```bash
# Smart Templates sind bereits im Projekt
```

### Import
```typescript
import {
  DashboardCard,
  StatCard,
  SectionHeader,
  DataGrid,
  ActionButton,
} from '@/components/smart-templates';
```

### Beispiel: Komplettes Dashboard

```typescript
import {
  SectionHeader,
  DataGrid,
  StatCard,
  DashboardCard,
  ActionButton,
} from '@/components/smart-templates';
import { Truck, Users, Car, Euro, Plus, List, Calendar } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header mit Action */}
      <SectionHeader
        title="Dashboard Übersicht"
        description="Verwalten Sie Ihre Aufträge, Fahrer und Fahrzeuge zentral"
        align="center"
        spacing="lg"
        actions={
          <ActionButton variant="primary" icon={Plus}>
            Neuer Auftrag
          </ActionButton>
        }
      />

      {/* KPI-Grid */}
      <DataGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }}>
        <StatCard
          label="Aufträge heute"
          value="142"
          change={{ value: 12.5, trend: 'up' }}
          icon={Truck}
        />
        <StatCard
          label="Aktive Fahrer"
          value="28"
          change={{ value: -3.2, trend: 'down' }}
          icon={Users}
        />
        <StatCard
          label="Fahrzeuge verfügbar"
          value="35"
          icon={Car}
        />
        <StatCard
          label="Umsatz heute"
          value="12.450 €"
          change={{ value: 8.1, trend: 'up' }}
          icon={Euro}
        />
      </DataGrid>

      {/* Content-Cards */}
      <DataGrid columns={{ mobile: 1, desktop: 2 }}>
        <DashboardCard
          title="Letzte Aufträge"
          description="Die 10 neuesten Buchungen"
          icon={List}
          iconVariant="dunkelblau"
        >
          {/* Tabelle oder Liste */}
        </DashboardCard>

        <DashboardCard
          title="Nächste Termine"
          description="Anstehende Fahrten und Reservierungen"
          icon={Calendar}
          iconVariant="beige"
        >
          {/* Kalender oder Liste */}
        </DashboardCard>
      </DataGrid>
    </div>
  );
}
```

---

## 📊 MIGRATIONS-WORKFLOW

### Phase 1: Analyse der alten Seite
1. Identifiziere die Hauptinhalte (KPIs, Tabellen, Formulare)
2. Identifiziere wiederkehrende UI-Muster
3. Mappe alte Elemente auf Smart Templates

### Phase 2: Template-Auswahl
1. **Statistiken/KPIs?** → `StatCard`
2. **Detaillierte Widgets?** → `DashboardCard`
3. **Seiten-Titel mit Actions?** → `SectionHeader`
4. **Mehrere Karten nebeneinander?** → `DataGrid`
5. **Call-to-Action?** → `ActionButton`

### Phase 3: Pixelgenaue Implementierung
1. Nutze Templates mit exakten Props
2. Füge Inhalt in `children` ein
3. Teste Hover-Effekte und Responsivität
4. Vergleiche mit Pricing.tsx Referenz

---

## ✅ QUALITY CHECKLIST

Vor dem Commit:
- [ ] Alle Komponenten nutzen Smart Templates
- [ ] Keine direkten Farben (nur DESIGN_TOKENS)
- [ ] Hover-Effekte funktionieren (translateY, scale, shadow)
- [ ] Mobile-First Responsiveness getestet
- [ ] Icons aus `lucide-react` importiert
- [ ] Props-Typen korrekt verwendet
- [ ] Keine Inline-Styles außerhalb von Templates

---

## 🔗 VERWANDTE DOKUMENTATION

- **Design-Tokens:** `src/lib/design-system/design-tokens.ts`
- **Pricing.tsx Master-Vorlage:** `src/pages/Pricing.tsx`
- **KERNFARBEN:** `src/lib/design-system/pricing-colors.ts`
- **Template-System (alt):** `docs/SPRINT_48_TEMPLATE_SYSTEM.md`

---

**Version:** 21.0.0  
**Datum:** 2025-10-25  
**Status:** ✅ PRODUCTION-READY
