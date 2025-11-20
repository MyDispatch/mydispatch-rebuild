# Dashboard Widgets V28.1 Catalog

**Version:** V28.1  
**Status:** ✅ PRODUCTION-READY  
**Datum:** 2025-10-29

---

## 📚 WIDGET-ÜBERSICHT

Alle Widgets befinden sich in: `src/components/dashboard/widgets/`

---

## 🚨 URGENT ACTIONS CARD

**Datei:** `UrgentActionsCard.tsx`  
**Position:** Rechte Spalte, Position 1 (IMMER ZUERST!)  
**Icon:** `AlertTriangle`

### Props

```typescript
interface UrgentAction {
  id: string;
  type: "warning" | "overdue" | "maintenance";
  title: string;
  description: string;
  count?: number;
  onClick?: () => void;
}

interface UrgentActionsCardProps {
  actions: UrgentAction[];
}
```

### Verwendung

```tsx
import { UrgentActionsCard } from "@/components/dashboard/widgets";

<UrgentActionsCard
  actions={[
    {
      id: "1",
      type: "overdue",
      title: "Überfällige Rechnungen",
      description: "5 Rechnungen seit über 14 Tagen offen",
      count: 5,
      onClick: () => navigate("/rechnungen?filter=overdue"),
    },
    {
      id: "2",
      type: "maintenance",
      title: "Fahrzeug-Wartung fällig",
      description: "3 Fahrzeuge benötigen Service",
      count: 3,
      onClick: () => navigate("/fahrzeuge?filter=maintenance"),
    },
  ]}
/>;
```

---

## 💳 PAYMENT METHODS CHART

**Datei:** `PaymentMethodsChart.tsx`  
**Position:** Rechte Spalte, Position 2  
**Icon:** `Receipt`

### Props

```typescript
interface PaymentMethod {
  name: string;
  value: number;
  color: string;
}

interface PaymentMethodsChartProps {
  data: PaymentMethod[];
}
```

### Verwendung

```tsx
import { PaymentMethodsChart } from "@/components/dashboard/widgets";

<PaymentMethodsChart
  data={[
    { name: "Bar", value: 4580, color: "#10b981" },
    { name: "Rechnung", value: 8920, color: "#3b82f6" },
    { name: "Karte", value: 2340, color: "#8b5cf6" },
  ]}
/>;
```

---

## 📝 ACTIVITY TIMELINE

**Datei:** `ActivityTimeline.tsx`  
**Position:** Rechte Spalte, Position 5  
**Icon:** `Activity`

### Props

```typescript
interface ActivityItem {
  id: string;
  type: "booking" | "customer" | "invoice" | "vehicle" | "driver" | "other";
  title: string;
  description: string;
  timestamp: Date;
  onClick?: () => void;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
  maxItems?: number; // Default: 10
}
```

### Verwendung

```tsx
import { ActivityTimeline } from "@/components/dashboard/widgets";

<ActivityTimeline
  activities={[
    {
      id: "1",
      type: "booking",
      title: "Neuer Auftrag #1234",
      description: "Flughafen Transfer für Max Mustermann",
      timestamp: new Date("2025-10-29T14:30:00"),
      onClick: () => navigate("/auftraege/1234"),
    },
    {
      id: "2",
      type: "customer",
      title: "Neuer Kunde registriert",
      description: "Maria Schmidt - Firma XYZ GmbH",
      timestamp: new Date("2025-10-29T13:15:00"),
      onClick: () => navigate("/kunden/5678"),
    },
  ]}
  maxItems={8}
/>;
```

---

## 👥 RESOURCE STATUS CARD

**Datei:** `ResourceStatusCard.tsx`  
**Position:** Rechte Spalte, Position 3  
**Icon:** `Users`

### Props

```typescript
interface ResourceStats {
  drivers: {
    available: number;
    busy: number;
    offline: number;
    total: number;
  };
  vehicles: {
    available: number;
    inUse: number;
    maintenance: number;
    total: number;
  };
}

interface ResourceStatusCardProps {
  stats: ResourceStats;
}
```

### Verwendung

```tsx
import { ResourceStatusCard } from "@/components/dashboard/widgets";

<ResourceStatusCard
  stats={{
    drivers: {
      available: 8,
      busy: 5,
      offline: 2,
      total: 15,
    },
    vehicles: {
      available: 12,
      inUse: 7,
      maintenance: 3,
      total: 22,
    },
  }}
/>;
```

---

## 📈 REVENUE CHART

**Datei:** `RevenueChart.tsx`  
**Position:** Linke Spalte, Position 1  
**Icon:** `TrendingUp`

### Props

```typescript
interface RevenueData {
  date: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}
```

### Verwendung

```tsx
import { RevenueChart } from "@/components/dashboard/widgets";

<RevenueChart
  data={[
    { date: "Mo", revenue: 4580 },
    { date: "Di", revenue: 5320 },
    { date: "Mi", revenue: 4890 },
    { date: "Do", revenue: 6120 },
    { date: "Fr", revenue: 7340 },
    { date: "Sa", revenue: 8920 },
    { date: "So", revenue: 5670 },
  ]}
  trend={{ value: 12.5, direction: "up" }}
/>;
```

---

## 📊 STATISTICS CARD

**Datei:** `StatisticsCard.tsx`  
**Position:** Rechte Spalte, Position 4  
**Icon:** `BarChart3`

### Props

```typescript
interface ComparisonPeriod {
  label: string;
  current: number;
  previous: number;
  change: number;
  trend: "up" | "down" | "neutral";
}

interface StatisticsCardProps {
  periods: ComparisonPeriod[];
  valueFormatter?: (value: number) => string;
}
```

### Verwendung

```tsx
import { StatisticsCard } from "@/components/dashboard/widgets";

<StatisticsCard
  periods={[
    {
      label: "vs. Gestern",
      current: 5840,
      previous: 5200,
      change: 12.3,
      trend: "up",
    },
    {
      label: "vs. Vorwoche",
      current: 38500,
      previous: 41200,
      change: -6.6,
      trend: "down",
    },
    {
      label: "vs. Vormonat",
      current: 142300,
      previous: 138900,
      change: 2.4,
      trend: "up",
    },
  ]}
/>;
```

---

## 📅 TODAY OVERVIEW CARD

**Datei:** `TodayOverviewCard.tsx`  
**Position:** Linke Spalte, Position 4  
**Icon:** `Calendar`

### Props

```typescript
interface TodayStats {
  bookings: number;
  drivers: number;
  vehicles: number;
}

interface TodayOverviewCardProps {
  stats: TodayStats;
}
```

### Verwendung

```tsx
import { TodayOverviewCard } from "@/components/dashboard/widgets";

<TodayOverviewCard
  stats={{
    bookings: 24,
    drivers: 15,
    vehicles: 18,
  }}
/>;
```

---

## 🧾 OPEN INVOICES CARD

**Datei:** `OpenInvoicesCard.tsx`  
**Position:** Linke Spalte, Position 5  
**Icon:** `Receipt`

### Props

```typescript
interface InvoiceStats {
  open: {
    count: number;
    total: number;
  };
  overdue: {
    count: number;
    total: number;
  };
}

interface OpenInvoicesCardProps {
  stats: InvoiceStats;
  onViewAll?: () => void;
}
```

### Verwendung

```tsx
import { OpenInvoicesCard } from "@/components/dashboard/widgets";

<OpenInvoicesCard
  stats={{
    open: {
      count: 12,
      total: 8450,
    },
    overdue: {
      count: 5,
      total: 3200,
    },
  }}
  onViewAll={() => navigate("/rechnungen?filter=open")}
/>;
```

---

## 🎨 DESIGN-STANDARDS

### Farben pro Widget-Typ

| Widget-Typ     | Primärfarbe                | Verwendung                   |
| -------------- | -------------------------- | ---------------------------- |
| Urgent/Warning | Red (`text-red-600`)       | Warnungen, Überfällige Items |
| Success        | Green (`text-green-600`)   | Verfügbar, Abgeschlossen     |
| Info           | Blue (`text-blue-600`)     | Neutral, Informativ          |
| Warning (mild) | Amber (`text-amber-600`)   | Im Einsatz, Pending          |
| Maintenance    | Orange (`text-orange-600`) | Service, Wartung             |

### Animations

Alle Widgets verwenden `animate-fade-in` mit gestaffelten Delays:

```tsx
style={{ animationDelay: `${index * 50}ms` }}
```

---

## ✅ QUALITÄTSPRÜFUNG

### Checkliste pro Widget

- [ ] Pure Tailwind (keine Token-Imports)
- [ ] Slate Palette
- [ ] 1px Borders
- [ ] `shadow-sm hover:shadow-md`
- [ ] 200ms Transitions
- [ ] CardHeader mit Icon + Titel
- [ ] CardContent mit `pb-3`
- [ ] Responsive (Mobile: full-width)
- [ ] Loading-State (wenn applicable)
- [ ] Empty-State (wenn applicable)
- [ ] onClick-Handler (wenn applicable)
- [ ] TypeScript-Typisierung vollständig
- [ ] Memoization für Performance (wenn applicable)

---

**Status:** ✅ PRODUCTION-READY  
**Version:** V28.1
