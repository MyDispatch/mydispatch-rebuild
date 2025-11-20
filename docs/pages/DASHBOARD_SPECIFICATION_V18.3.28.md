# 📊 DASHBOARD SPECIFICATION V18.3.28

## Entwicklervorgabe & Template-Master

**Status:** Production-Ready (Master-Template)  
**Letzte Aktualisierung:** 2025-10-21  
**Verantwortlich:** Senior Systemarchitekt  
**Klassifizierung:** Intern - Entwicklungsvorgabe

---

## 🎯 ZWECK

Diese Spezifikation definiert die **Dashboard-Seite** als **Master-Template** für alle anderen Seiten in MyDispatch. Sie dient als verbindliche Entwicklervorgabe gemäß Phase 3B des Master-Prompts.

**Template-Status:** ✅ Diese Seite ist Teil der "Master-Template-Vorgabe" (Dashboard, Aufträge, Finanzen)

---

## 📋 INHALTSVERZEICHNIS

1. [Bauplan (Layout-Struktur)](#bauplan-layout-struktur)
2. [UI-Vorgabe (Komponenten-Mapping)](#ui-vorgabe-komponenten-mapping)
3. [Design- & Layoutvorgaben](#design--layoutvorgaben)
4. [Schaltplan (Interaktionslogik)](#schaltplan-interaktionslogik)
5. [Datenflüsse & API-Integration](#datenflüsse--api-integration)
6. [Responsive Behavior](#responsive-behavior)
7. [Accessibility](#accessibility)
8. [Performance-Optimierung](#performance-optimierung)

---

## 🏗️ BAUPLAN (LAYOUT-STRUKTUR)

### Hierarchie-Diagramm

```
DashboardLayout (Wrapper)
└── Container (max-w-7xl mx-auto px-4 sm:px-6 lg:px-8)
    └── Main Content (space-y-6 sm:space-y-8)
        ├── Header Section
        │   ├── Title & Description (PageHeader)
        │   └── Quick Actions (Button-Group)
        │
        ├── KPI Section (Grid)
        │   ├── KPICard: Offene Aufträge
        │   ├── KPICard: Heute fällig
        │   ├── KPICard: Aktive Fahrer
        │   └── KPICard: Umsatz (Monat)
        │
        ├── Content Grid (2-Column Desktop)
        │   ├── Left Column (2/3)
        │   │   ├── Card: Aktuelle Aufträge (Table/List)
        │   │   └── Card: Performance Chart (Recharts)
        │   │
        │   └── Right Column (1/3)
        │       ├── Card: Karte (HERE Maps)
        │       ├── Card: Wetter-Widget
        │       └── Card: Verkehrslage
        │
        └── Bottom Section
            └── Card: Recent Activity Log
```

---

### Grid-System

```tsx
// KPI Section
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  {/* 4 KPI Cards */}
</div>

// Content Grid
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Left: lg:col-span-2 */}
  <div className="lg:col-span-2 space-y-6">...</div>
  {/* Right: lg:col-span-1 */}
  <div className="space-y-6">...</div>
</div>
```

**Breakpoints:**

- **Mobile (< 640px):** 1 Column (alle Elemente gestackt)
- **Tablet (640px - 1023px):** 2 Columns für KPIs, 1 Column für Content
- **Desktop (≥ 1024px):** 4 Columns für KPIs, 2/3 + 1/3 für Content

---

## 🎨 UI-VORGABE (KOMPONENTEN-MAPPING)

### Verwendete Labary-Komponenten

| UI-Element    | Komponente      | Pfad                                   | Variante           |
| ------------- | --------------- | -------------------------------------- | ------------------ |
| **Layout**    | DashboardLayout | `@/components/layouts/DashboardLayout` | -                  |
| **KPI Cards** | KPICard         | `@/components/design-system/KPICard`   | default            |
| **Cards**     | Card            | `@/components/ui/card`                 | default            |
| **Buttons**   | Button          | `@/components/ui/button`               | default, outline   |
| **Icons**     | Icon (Lucide)   | `lucide-react`                         | -                  |
| **Charts**    | LineChart       | `recharts`                             | -                  |
| **Table**     | Table           | `@/components/ui/table`                | -                  |
| **Badges**    | Badge           | `@/components/ui/badge`                | default, secondary |
| **Dialogs**   | Dialog          | `@/components/ui/dialog`               | -                  |
| **Tooltips**  | Tooltip         | `@/components/ui/tooltip`              | -                  |

---

### KPICard-Struktur (Beispiel)

```tsx
import { KPICard } from "@/components/design-system/KPICard";
import { Package } from "lucide-react";

<KPICard
  title="Offene Aufträge"
  value="24"
  subtitle="Gestern: 18 (+33%)"
  icon={Package}
  trend="up"
  className="hover:shadow-lg transition-shadow"
/>;
```

**Props:**

- `title`: string (KPI-Bezeichnung)
- `value`: string | number (Hauptwert)
- `subtitle`: string (Zusatzinfo, z.B. Vergleich)
- `icon`: LucideIcon (Icon-Component)
- `trend`: 'up' | 'down' | 'neutral' (optional)
- `className`: string (Custom-Styles)

---

### Card-Struktur (Content-Cards)

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader className="pb-3">
    <div className="flex items-center justify-between">
      <CardTitle>Aktuelle Aufträge</CardTitle>
      <Button variant="outline" size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Neu
      </Button>
    </div>
    <CardDescription>Letzte 5 erstellte Aufträge</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">{/* Table oder List */}</CardContent>
</Card>;
```

**Card-Header-Pattern:**

- `pb-3`: Reduzierter Bottom-Padding (statt default pb-6)
- Flex-Layout für Title + Actions
- CardDescription für Subtext

---

### Maps-Integration

```tsx
<Card>
  <CardHeader>
    <CardTitle>Live-Karte</CardTitle>
  </CardHeader>
  <CardContent className="p-0">
    {/* Full-Width Iframe, kein padding */}
    <div className="relative w-full h-[400px]">
      <iframe
        src="https://wego.here.com/..."
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
        title="HERE Maps"
      />
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      )}
    </div>
  </CardContent>
</Card>
```

**WICHTIG:**

- `p-0` auf CardContent (kein Padding für Full-Width)
- Loading-State als Overlay (nicht statt Content)
- `loading="lazy"` für Performance

---

## 🎨 DESIGN- & LAYOUTVORGABEN

### Farbsystem

**Gemäß Design System V18.3.28:**

```css
/* Primärfarben (MyDispatch CI) */
--primary: 40 31% 88%; /* Beige/Gold */
--primary-foreground: 225 31% 28%; /* Dunkelblau */

/* Text & Background */
--foreground: 225 31% 28%; /* Haupttext */
--background: 0 0% 100%; /* Hintergrund */

/* Status-Farben (NUR für Badges!) */
--status-success: 142 76% 36%; /* Grün */
--status-warning: 48 96% 53%; /* Gelb */
--status-error: 0 84% 60%; /* Rot */
```

**Icon-Farben:**

```tsx
// ✅ RICHTIG
<Icon name="TrendingUp" className="text-foreground" />

// ❌ FALSCH
<Icon name="TrendingUp" className="text-green-500" />
```

---

### Typografie

**Verwendete Schriftgrößen:**

```tsx
// Headings
<h1 className="text-3xl font-bold">Dashboard</h1>    // Page Title
<h2 className="text-2xl font-semibold">Section</h2>  // Section Title
<h3 className="text-xl font-semibold">Card Title</h3> // Card Title

// Body Text
<p className="text-base text-foreground">Normal</p>  // Standard
<p className="text-sm text-muted-foreground">Meta</p> // Meta-Info

// KPI Values
<span className="text-4xl font-bold">24</span>       // Large Number
```

**WICHTIG:** Alle Schriftgrößen verwenden `clamp()` im Design System (Fluid Typography).

---

### Spacing

**Gemäß 4px-Grid:**

```tsx
// Zwischen Sektionen
<div className="space-y-6 sm:space-y-8">

// Zwischen Cards
<div className="grid gap-6">

// Card-Innenabstände
<CardHeader className="pb-3">   // Reduzierter Bottom-Padding
<CardContent className="space-y-4">  // Interne Abstände

// Button-Gruppen
<div className="flex gap-2">
```

---

### Shadows & Borders

```tsx
// Standard Card
<Card className="shadow-md hover:shadow-lg transition-shadow">

// Prominent Card (Maps, Charts)
<Card className="shadow-lg">

// Subtle Border
<div className="border-b border-border pb-4">
```

---

## ⚙️ SCHALTPLAN (INTERAKTIONSLOGIK)

### State Management

```typescript
// Dashboard.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  // ========================================================================
  // STATE
  // ========================================================================
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7)
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ========================================================================
  // DATA FETCHING (React Query)
  // ========================================================================

  // KPI: Offene Aufträge
  const { data: openOrders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders', 'open'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Auto-Refresh alle 30s
  });

  // KPI: Fahrer-Anzahl
  const { data: activeDrivers } = useQuery({
    queryKey: ['drivers', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('status', 'on_duty');

      if (error) throw error;
      return data;
    },
  });

  // Chart-Daten
  const { data: performanceData } = useQuery({
    queryKey: ['analytics', 'performance', dateRange],
    queryFn: async () => {
      // Fetch aggregated data für Chart
      // ...
    },
  });

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleCreateOrder = () => {
    // Open Dialog
    setSelectedOrder(null); // null = new order
    // Dialog öffnet via state oder imperative API
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    // Open Order-Details-Dialog oder Navigate
  };

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['orders'] });
    toast.success('Dashboard aktualisiert');
  };

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <DashboardLayout title="Dashboard" description="Übersicht Ihrer Aufträge">
      {/* ... */}
    </DashboardLayout>
  );
};
```

---

### User Interactions

| Aktion             | Trigger           | Effekt               | Feedback               |
| ------------------ | ----------------- | -------------------- | ---------------------- |
| **Auftrags-Click** | Table Row Click   | Öffnet Order-Details | Highlight Row + Dialog |
| **Neu-Button**     | Button Click      | Öffnet Create-Dialog | Dialog Slide-In        |
| **Refresh**        | Button Click      | Re-fetch alle Daten  | Toast + Spinner        |
| **Filter**         | Dropdown Change   | Update Query-Filter  | Table-Update           |
| **Date-Range**     | DatePicker Change | Update Chart-Daten   | Chart-Animation        |

---

### Realtime-Updates

```typescript
// Supabase Realtime für Live-Updates
useEffect(() => {
  const channel = supabase
    .channel("dashboard-orders")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
      },
      (payload) => {
        // Invalidate Query bei Änderungen
        queryClient.invalidateQueries({ queryKey: ["orders"] });

        // Optional: Toast-Benachrichtigung
        if (payload.eventType === "INSERT") {
          toast.info("Neuer Auftrag erstellt");
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

---

## 📡 DATENFLÜSSE & API-INTEGRATION

### API-Endpunkte

```
GET /api/orders?status=pending               # Offene Aufträge
GET /api/orders?date_from=...&date_to=...   # Zeitraum-Filter
GET /api/drivers?status=on_duty              # Aktive Fahrer
GET /api/analytics/performance?range=7d      # Performance-Daten
POST /api/orders                             # Auftrag erstellen
```

---

### Data Flow Diagram

```
┌─────────────────┐
│  React Query    │  (Client-Side Cache)
│  - orders       │
│  - drivers      │
│  - analytics    │
└────────┬────────┘
         │ HTTP (REST)
         ▼
┌─────────────────┐
│  Supabase API   │  (Backend)
│  - PostgreSQL   │
│  - RLS Policies │
└────────┬────────┘
         │ Realtime (WebSocket)
         ▼
┌─────────────────┐
│  UI Components  │
│  - KPICards     │
│  - Tables       │
│  - Charts       │
└─────────────────┘
```

---

### Error Handling

```tsx
const { data, error, isLoading } = useQuery({
  queryKey: ["orders"],
  queryFn: fetchOrders,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

if (error) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <p className="font-semibold mb-2">Fehler beim Laden</p>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => queryClient.invalidateQueries(["orders"])}>Neu laden</Button>
      </CardContent>
    </Card>
  );
}
```

---

## 📱 RESPONSIVE BEHAVIOR

### Mobile (<640px)

```tsx
// Stack Layout (1 Column)
<div className="space-y-6">
  {/* KPIs: 1 Column */}
  <div className="grid grid-cols-1 gap-4">
    <KPICard {...} />
    <KPICard {...} />
  </div>

  {/* Content: Full Width Stack */}
  <Card>Aktuelle Aufträge</Card>
  <Card>Karte</Card>
  <Card>Wetter</Card>
</div>
```

**Optimierungen:**

- Reduced Padding: `px-4` statt `px-6`
- Smaller Gap: `gap-4` statt `gap-6`
- Touch-Targets: Min. 44x44px
- Simplified Tables: Zeige nur wichtigste Spalten

---

### Tablet (640px - 1023px)

```tsx
// KPIs: 2 Columns
<div className="grid grid-cols-2 gap-6">

// Content: Still 1 Column
<div className="space-y-6">
```

---

### Desktop (≥1024px)

```tsx
// KPIs: 4 Columns
<div className="grid grid-cols-4 gap-6">

// Content: 2/3 + 1/3 Layout
<div className="grid grid-cols-3 gap-6">
  <div className="col-span-2">...</div>
  <div className="col-span-1">...</div>
</div>
```

---

## ♿ ACCESSIBILITY

### WCAG 2.1 AA Konformität

**Implementierte Maßnahmen:**

1. **Keyboard-Navigation:**

   ```tsx
   <Button
     onKeyDown={(e) => {
       if (e.key === 'Enter' || e.key === ' ') {
         handleClick();
       }
     }}
   >
   ```

2. **ARIA-Labels:**

   ```tsx
   <Button aria-label="Neuen Auftrag erstellen">
     <Plus className="h-4 w-4" />
   </Button>
   ```

3. **Focus-States:**

   ```tsx
   <Card className="focus-within:ring-2 focus-within:ring-primary">
   ```

4. **Screen-Reader-Texte:**

   ```tsx
   <span className="sr-only">Offene Aufträge: 24</span>
   ```

5. **Alt-Texte:**
   ```tsx
   <iframe title="HERE Maps - Aktuelle Fahrzeugpositionen" />
   ```

---

## ⚡ PERFORMANCE-OPTIMIERUNG

### Code Splitting

```tsx
// Lazy-Loading für nicht-kritische Komponenten
import { lazy, Suspense } from "react";

const PerformanceChart = lazy(() => import("@/components/charts/PerformanceChart"));

<Suspense fallback={<CardSkeleton />}>
  <PerformanceChart data={performanceData} />
</Suspense>;
```

---

### React Query Optimierung

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 Minuten
      cacheTime: 10 * 60 * 1000, // 10 Minuten
      refetchOnWindowFocus: false, // Kein Auto-Refetch bei Tab-Wechsel
    },
  },
});
```

---

### Memoization

```tsx
import { useMemo } from "react";

const Dashboard = () => {
  const kpiData = useMemo(() => {
    return {
      openOrders: orders?.filter((o) => o.status === "pending").length || 0,
      todayOrders: orders?.filter((o) => isToday(o.pickup_date)).length || 0,
      activeDrivers: drivers?.filter((d) => d.status === "on_duty").length || 0,
    };
  }, [orders, drivers]);

  // ...
};
```

---

## 🔗 VERWANDTE DOKUMENTATION

- `docs/DESIGN_SYSTEM_V18.3.28.md` - Design System
- `docs/DESIGN_SYSTEM_VORGABEN_V18.3.md` - Layout-Standards
- `docs/PFLICHTENHEFT_V18.3.28.md` - System-Requirements
- `docs/pages/AUFTRÄGE_SPECIFICATION_V18.3.28.md` - Aufträge-Seite (Template)
- `docs/pages/FINANZEN_SPECIFICATION_V18.3.28.md` - Finanzen-Seite (Template)

---

## ✅ IMPLEMENTIERUNGS-CHECKLISTE

### Pre-Development

- [ ] Design System Review durchgeführt
- [ ] Komponenten in Labary-System verfügbar geprüft
- [ ] Fehlerdatenbank konsultiert (XSS-Prevention)
- [ ] API-Endpunkte dokumentiert

### Development

- [ ] Layout gemäß Bauplan implementiert
- [ ] Alle Labary-Komponenten korrekt verwendet
- [ ] Responsive Breakpoints getestet
- [ ] Error-Handling implementiert
- [ ] Loading-States implementiert
- [ ] Realtime-Updates konfiguriert

### Testing

- [ ] E2E Tests geschrieben (Playwright)
- [ ] Mobile-Responsive getestet
- [ ] Accessibility-Audit durchgeführt (Lighthouse)
- [ ] Performance-Optimierungen angewendet
- [ ] Cross-Browser Testing (Chrome, Safari, Firefox)

### Post-Development

- [ ] Code-Review durch Senior Architect
- [ ] Phase 1 QA-Zyklus durchlaufen
- [ ] Fehlerdatenbank aktualisiert
- [ ] Dokumentation aktualisiert (diese Datei)

---

**END OF DOCUMENT**

_Diese Spezifikation ist verbindlich und muss bei allen Arbeiten an der Dashboard-Seite befolgt werden. Abweichungen sind zu dokumentieren und zu begründen._
