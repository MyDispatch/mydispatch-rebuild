# 📄 SEITENDOKUMENTATION: Dashboard (DashboardV18_3)

**Version:** 18.3.27  
**Status:** Aktiv, Master-Template  
**Seite:** `/dashboard`  
**Komponente:** `src/pages/DashboardV18_3.tsx`  
**Kategorie:** Verwaltung / Übersicht

---

## 1. BAUPLAN (LAYOUT-SPEZIFIKATION)

### 1.1 Seitenstruktur (Master-Template)

```
┌─────────────────────────────────────────────────────────┐
│ MainLayout (Protected)                                  │
│  ├─ MobileHeader / Header (Desktop)                     │
│  ├─ AppSidebar (Desktop)                                │
│  └─ Main Content Area                                   │
│     ├─ PageHeader                                       │
│     │  ├─ Title + Description                           │
│     │  └─ Action Buttons (rechts)                       │
│     ├─ KPI Cards (Grid 2x2)                             │
│     │  ├─ Aktive Aufträge (Heute)                       │
│     │  ├─ Offene Rechnungen                             │
│     │  ├─ Verfügbare Fahrer                             │
│     │  └─ Wartende Dokumente                            │
│     ├─ Charts Section (Grid 2 Spalten)                  │
│     │  ├─ Umsatz-Chart (Bar)                            │
│     │  └─ Auftrags-Status (Donut)                       │
│     └─ Recent Activity Timeline                         │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Responsive Breakpoints

- **Mobile (<640px):**
  - KPI Cards: 1 Spalte (grid-cols-1)
  - Charts: 1 Spalte (grid-cols-1)
  - Padding: p-4

- **Tablet (640px-1024px):**
  - KPI Cards: 2 Spalten (sm:grid-cols-2)
  - Charts: 1 Spalte (noch sm:grid-cols-1)
  - Padding: sm:p-6

- **Desktop (>1024px):**
  - KPI Cards: 2 Spalten (lg:grid-cols-2)
  - Charts: 2 Spalten (lg:grid-cols-2)
  - Padding: lg:p-8

### 1.3 Layout-Container

```typescript
<div className="space-y-6 sm:space-y-8 lg:space-y-10">
  {/* PageHeader */}
  {/* KPI Grid */}
  {/* Charts Grid */}
  {/* Activity Timeline */}
</div>
```

---

## 2. UI-VORGABE (KOMPONENTEN-MAPPING)

### 2.1 PageHeader

**Labary-Komponente:** Custom Component  
**Props:**
```typescript
{
  heading: string;
  description?: string;
  actions?: ReactNode;
}
```

**Verwendung:**
```tsx
<PageHeader 
  heading="Dashboard"
  description="Übersicht über Ihre wichtigsten Kennzahlen"
/>
```

### 2.2 KPI Cards

**Labary-Komponente:** `Card` + `CardHeader` + `CardTitle` + `CardContent`  
**Icon-Komponenten:** `lucide-react` Icons

**Struktur:**
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">
      {title}
    </CardTitle>
    <Icon className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{value}</div>
    <p className="text-xs text-muted-foreground">{description}</p>
  </CardContent>
</Card>
```

**KPI-Definitionen:**

| KPI | Icon | Datenquelle | Format |
|-----|------|-------------|--------|
| Aktive Aufträge (Heute) | `Package` | `dashboard_stats.active_bookings_today` | Number |
| Offene Rechnungen | `FileText` | `dashboard_stats.open_invoices_amount` | Currency (EUR) |
| Verfügbare Fahrer | `Users` | `dashboard_stats.available_drivers` | Number |
| Wartende Dokumente | `AlertCircle` | `dashboard_stats.pending_documents` | Number |

### 2.3 Charts

#### Umsatz-Chart (Bar Chart)

**Labary-Komponente:** `recharts` (Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer)

**Konfiguration:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Umsatz (Letzte 7 Tage)</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={revenueData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="date" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip />
        <Bar dataKey="amount" fill="hsl(var(--primary))" />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
```

**Datenformat:**
```typescript
type RevenueData = {
  date: string; // "DD.MM"
  amount: number; // EUR
}[];
```

#### Auftrags-Status (Donut Chart)

**Labary-Komponente:** `recharts` (Pie, PieChart, Cell, ResponsiveContainer, Legend)

**Konfiguration:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Auftrags-Status</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={statusData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
        >
          {statusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
```

**Datenformat:**
```typescript
type StatusData = {
  status: string; // "pending", "confirmed", "in_transit", "delivered"
  value: number;
  label: string; // "Ausstehend", "Bestätigt", "Unterwegs", "Zugestellt"
}[];
```

**Status-Farben:**
```typescript
const STATUS_COLORS = {
  pending: "hsl(var(--status-warning))",
  confirmed: "hsl(var(--status-info))",
  in_transit: "hsl(var(--primary))",
  delivered: "hsl(var(--status-success))",
  cancelled: "hsl(var(--status-error))",
};
```

### 2.4 Activity Timeline

**Labary-Komponente:** `Card` + Custom Timeline Component

**Struktur:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Letzte Aktivitäten</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <div className="h-full w-px bg-border" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{activity.title}</p>
            <p className="text-xs text-muted-foreground">{activity.description}</p>
            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

**Datenformat:**
```typescript
type Activity = {
  id: string;
  title: string;
  description: string;
  timestamp: string; // formatiert via format-utils
  type: "booking" | "invoice" | "driver" | "document";
}[];
```

---

## 3. DESIGN- & LAYOUTVORGABEN

### 3.1 Typografie

- **Page Title:** `text-2xl sm:text-3xl font-bold text-foreground`
- **Page Description:** `text-sm sm:text-base text-muted-foreground`
- **Card Title:** `text-sm font-medium text-foreground`
- **KPI Value:** `text-2xl font-bold text-foreground`
- **KPI Description:** `text-xs text-muted-foreground`
- **Chart Labels:** `text-xs text-muted-foreground`
- **Activity Title:** `text-sm font-medium text-foreground`
- **Activity Description:** `text-xs text-muted-foreground`

### 3.2 Spacing

- **Outer Container:** `p-4 sm:p-6 lg:p-8`
- **Section Spacing:** `space-y-6 sm:space-y-8 lg:space-y-10`
- **Card Grid Gap:** `gap-4 sm:gap-6`
- **Card Internal Padding:** Standard (Card-Default)

### 3.3 Farben (Semantic Tokens)

- **Background:** `bg-background`
- **Card Background:** `bg-card`
- **Text Primary:** `text-foreground`
- **Text Secondary:** `text-muted-foreground`
- **Border:** `border-border`
- **Primary Accent:** `bg-primary`, `text-primary-foreground`
- **Status Success:** `text-status-success` (nur für Werte, NICHT für Icons)
- **Status Warning:** `text-status-warning` (nur für Werte)
- **Status Error:** `text-status-error` (nur für Werte)

### 3.4 Icons

- **Size (Mobile):** `h-4 w-4`
- **Size (Desktop):** `h-4 w-4` (gleich, keine Vergrößerung)
- **Color:** `text-muted-foreground` (IMMER, niemals Status-Farben auf Icons)

### 3.5 Responsive Verhalten

- **KPI Cards:**
  - Mobile: Stack vertikal, 100% Breite
  - Tablet+: 2 Spalten
  
- **Charts:**
  - Mobile: Stack vertikal, 100% Breite
  - Desktop: 2 Spalten nebeneinander

- **Activity Timeline:**
  - Immer 1 Spalte (volle Breite)

---

## 4. SCHALTPLAN (INTERAKTIONSLOGIK)

### 4.1 Datenfluss

```
Component Mount
  ↓
Load Dashboard Stats (Security Definer Function)
  ↓
  ├─ get_dashboard_stats(company_id) → KPI Cards
  ├─ Query: bookings (last 7 days) → Revenue Chart
  ├─ Query: bookings (status count) → Status Chart
  └─ Query: activities (recent) → Activity Timeline
  ↓
Render Dashboard
  ↓
Auto-Refresh (TanStack Query, 30s)
```

### 4.2 API-Anbindungen

#### KPI Stats

**Endpoint:** Supabase RPC  
**Function:** `get_dashboard_stats`  
**Auth:** Required (company_id via auth.uid())

```typescript
const { data: stats } = useQuery({
  queryKey: ['dashboard-stats', companyId],
  queryFn: async () => {
    const { data, error } = await supabase
      .rpc('get_dashboard_stats', { p_company_id: companyId });
    if (error) throw error;
    return data;
  },
  refetchInterval: 30000, // 30s
});
```

#### Revenue Chart Data

**Endpoint:** Supabase Query  
**Table:** `bookings`  
**Filter:** `company_id`, `created_at >= 7 days ago`, `status != 'cancelled'`

```typescript
const { data: revenueData } = useQuery({
  queryKey: ['revenue-chart', companyId],
  queryFn: async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data, error } = await supabase
      .from('bookings')
      .select('created_at, total_price')
      .eq('company_id', companyId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .neq('status', 'cancelled');
    
    if (error) throw error;
    
    // Group by date and sum
    return groupByDate(data);
  },
  refetchInterval: 60000, // 60s
});
```

#### Status Chart Data

**Endpoint:** Supabase Query  
**Table:** `bookings`  
**Filter:** `company_id`, `is_archived = false`

```typescript
const { data: statusData } = useQuery({
  queryKey: ['status-chart', companyId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('status')
      .eq('company_id', companyId)
      .eq('is_archived', false);
    
    if (error) throw error;
    
    // Count by status
    return countByStatus(data);
  },
  refetchInterval: 60000, // 60s
});
```

#### Activity Timeline

**Endpoint:** Supabase Query  
**Tables:** `bookings`, `invoices`, `documents` (UNION)  
**Filter:** `company_id`, `created_at DESC`, `LIMIT 10`

```typescript
const { data: activities } = useQuery({
  queryKey: ['activities', companyId],
  queryFn: async () => {
    // Complex query combining multiple tables
    // Implementation via Edge Function (optional)
    const { data, error } = await supabase
      .rpc('get_recent_activities', { p_company_id: companyId });
    
    if (error) throw error;
    return data;
  },
  refetchInterval: 60000, // 60s
});
```

### 4.3 Zustandsverwaltung

- **Loading State:** Skeleton-Loader für KPIs und Charts
- **Error State:** Toast-Notification + Fallback-UI
- **Empty State:** "Noch keine Daten vorhanden" Message

```typescript
if (isLoading) return <DashboardSkeleton />;
if (error) return <DashboardError error={error} />;
if (!stats) return <DashboardEmpty />;
```

### 4.4 Interaktionen

- **KPI Card Click:** Navigation zu Detail-Seite (optional)
  - Aktive Aufträge → `/auftraege`
  - Offene Rechnungen → `/rechnungen`
  - Verfügbare Fahrer → `/fahrer`
  - Wartende Dokumente → `/dokumente`

- **Chart Tooltip:** Zeigt Details bei Hover
- **Activity Click:** Navigation zu Detail-Dialog (optional)

---

## 5. ZUSÄTZLICHE VORGABEN

### 5.1 Performance

- **Lazy Loading:** Charts werden erst beim Scrollen in den Viewport geladen (optional)
- **Memoization:** KPI Cards und Charts mit `React.memo`
- **Query Caching:** TanStack Query Cache für 30s

### 5.2 Accessibility

- **Keyboard Navigation:** Alle interaktiven Elemente fokussierbar
- **Screen Reader:** Semantische HTML-Tags (`<main>`, `<section>`, `<article>`)
- **ARIA Labels:** Alle Icon-only Buttons mit `aria-label`

### 5.3 Error Handling

- **Network Errors:** Toast mit Retry-Button
- **Permission Errors:** Redirect zu Login
- **Data Errors:** Fallback-Werte (0, [], etc.)

### 5.4 Testing

- **Unit Tests:**
  - KPI Value Formatting
  - Chart Data Transformation
  
- **Integration Tests:**
  - Dashboard Stats API Call
  - Chart Rendering with Data
  
- **E2E Tests:**
  - Dashboard Load & Display
  - Navigation via KPI Cards

---

## 6. ÄNDERUNGSHISTORIE

| Version | Datum | Änderung | Autor |
|---------|-------|----------|-------|
| 18.3.27 | 2025-10-21 | Initiale Erstellung | AI Agent |

---

**Ende der Seitendokumentation**

**Version:** V18.3.27  
**Status:** AKTIV - MASTER-TEMPLATE  
**Seite:** Dashboard (DashboardV18_3)
