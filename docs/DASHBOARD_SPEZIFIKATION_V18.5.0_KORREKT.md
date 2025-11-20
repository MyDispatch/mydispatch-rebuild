# DASHBOARD-SPEZIFIKATION V18.5.0 - KORREKTE IMPLEMENTATION

> **QUELLE:** Basierend auf `/src/pages/Index.tsx` (aktueller Production-Code)  
> **STATUS:** ✅ PRODUKTIV - Diese Spezifikation entspricht dem LIVE-System  
> **DATUM:** 2025-01-15  
> **VERANTWORTLICH:** System-Analyse & Dokumentation

---

## 📋 INHALTSVERZEICHNIS

1. [Layout-Struktur](#layout-struktur)
2. [Komponenten-Hierarchie](#komponenten-hierarchie)
3. [KPI-Cards System](#kpi-cards-system)
4. [Dashboard-Widgets](#dashboard-widgets)
5. [Responsive Breakpoints](#responsive-breakpoints)
6. [Datenfluss & APIs](#datenfluss--apis)
7. [Tariff-Gating](#tariff-gating)
8. [Mobile-Optimierung](#mobile-optimierung)

---

## 🎯 LAYOUT-STRUKTUR

### **Haupt-Layout (Desktop)**

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (60px, fixiert)                                          │
│ Logo/Company | Search | AI-Support | User | Logout              │
├──────┬──────────────────────────────────────────────────────────┤
│ S    │ MAIN CONTENT (padding: px-4 sm:px-6 lg:px-8 py-6)       │
│ I    │                                                           │
│ D    │ ┌─────────────────────────────────────────────────┐     │
│ E    │ │ 1. HERO SECTION (space-y-6)                     │     │
│ B    │ │   - Titel + Begrüßung                           │     │
│ A    │ │   - DashboardKPICards (4-Spalten Grid)          │     │
│ R    │ └─────────────────────────────────────────────────┘     │
│      │                                                           │
│ 6    │ ┌─────────────────────────────────────────────────┐     │
│ 4    │ │ 2. WIDGETS ROW (3-Spalten Grid, gap-4 lg:gap-6) │     │
│ /    │ │   - UrgentActionsWidget                         │     │
│ 2    │ │   - ResourceStatusWidget                        │     │
│ 4    │ │   - RevenueBreakdownWidget (Business+) / Banner │     │
│ 0    │ └─────────────────────────────────────────────────┘     │
│ p    │                                                           │
│ x    │ ┌─────────────────────────────────────────────────┐     │
│      │ │ 3. MAP & QUICK ACTIONS (3-Spalten Grid)         │     │
│      │ │   - HEREMapComponent (2 Spalten)                │     │
│      │ │   - WeatherWidget, TrafficWidget, QuickActions  │     │
│      │ └─────────────────────────────────────────────────┘     │
│      │                                                           │
│      │ ┌─────────────────────────────────────────────────┐     │
│      │ │ 4. AI PREDICTIVE (Business+)                    │     │
│      │ │   - PredictiveDemandWidget (Full-Width)         │     │
│      │ └─────────────────────────────────────────────────┘     │
│      │                                                           │
│      │ ┌─────────────────────────────────────────────────┐     │
│      │ │ 5. LIVE INFO & ACTIVITY (3-Spalten Grid)        │     │
│      │ │   - LiveInfoWidget (Business+, 1 Spalte)        │     │
│      │ │   - ActivityTimeline (2/3 Spalten)              │     │
│      │ └─────────────────────────────────────────────────┘     │
│      │                                                           │
│      │ ┌─────────────────────────────────────────────────┐     │
│      │ │ 6. UPGRADE BANNER (Starter-Nutzer)              │     │
│      │ │   - Business+ Upsell mit CTA                    │     │
│      │ └─────────────────────────────────────────────────┘     │
│      │                                                           │
├──────┴──────────────────────────────────────────────────────────┤
│ FOOTER (kollabierbar, py-3 hover:py-8)                          │
│ Copyright | Impressum | Datenschutz | AGB | NeXify Support      │
└─────────────────────────────────────────────────────────────────┘
```

### **Mobile-Layout (isMobile = true)**

```
┌─────────────────────────────────────┐
│ HEADER (kompakt)                    │
├─────────────────────────────────────┤
│ MobileDashboard Component           │
│ - Kompakte KPI-Cards (2x2)          │
│ - Wichtige Aktionen zuerst          │
│ - Stack-Layout (vertikal)           │
│ - Touch-optimiert                   │
├─────────────────────────────────────┤
│ FOOTER (minimiert)                  │
└─────────────────────────────────────┘
```

---

## 🏗️ KOMPONENTEN-HIERARCHIE

### **Komponenten-Baum**

```typescript
<DashboardLayout>
  <SEOHead title="Dashboard" description="..." />
  <Breadcrumbs />

  {showWelcomeWizard && <WelcomeWizard />}

  {isMobile ? (
    <MobileDashboard {...props} />
  ) : (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Hero Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Willkommen zurück{profile?.first_name ? `, ${profile.first_name}` : ''}! ...
            </p>
          </div>
        </div>

        <DashboardKPICards />
      </section>

      {/* 2. Widgets Row (3-Spalten) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <UrgentActionsWidget />
        <ResourceStatusWidget />
        {isBusinessActive ? (
          <RevenueBreakdownWidget />
        ) : (
          <Card>Upgrade-Banner</Card>
        )}
      </section>

      {/* 3. Map & Quick Actions (3-Spalten) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          <WidgetErrorBoundary widgetName="HERE Map">
            <HEREMapComponent />
          </WidgetErrorBoundary>
        </div>
        <div className="space-y-4">
          <WidgetErrorBoundary widgetName="Wetter">
            <WeatherWidget />
          </WidgetErrorBoundary>
          <WidgetErrorBoundary widgetName="Verkehr">
            <TrafficWidget />
          </WidgetErrorBoundary>
          <Card>
            <CardHeader><CardTitle>Schnellaktionen</CardTitle></CardHeader>
            <CardContent>
              {quickActions.map((action) => (
                <Button {...action} />
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. AI Predictive (Business+) */}
      {isBusinessActive && (
        <section>
          <PredictiveDemandWidget />
        </section>
      )}

      {/* 5. Live Info & Activity (3-Spalten) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {isBusinessActive && (
          <div className="lg:col-span-1">
            <LiveInfoWidget />
          </div>
        )}
        <div className={isBusinessActive ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <ActivityTimeline activities={activities} maxItems={5} />
        </div>
      </section>

      {/* 6. Upgrade Banner (Starter) */}
      {!isBusinessActive && (
        <section>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Erweitern Sie Ihre Möglichkeiten</h3>
                  <p className="text-sm text-muted-foreground">
                    Upgraden Sie auf Business für Live-Tracking, Wetter & Verkehrsdaten, ...
                  </p>
                </div>
                <Button onClick={() => navigate('/pricing')}>
                  Tarife ansehen
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  )}
</DashboardLayout>
```

---

## 📊 KPI-CARDS SYSTEM

### **Implementierung**

**Component:** `<DashboardKPICards />`  
**File:** `src/components/dashboard/DashboardKPICards.tsx`

### **Layout**

```css
/* Desktop: 4-Spalten Grid */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6
```

### **KPI-Cards (4 Stück)**

#### **1. Aufträge**

```typescript
{
  title: "Aufträge",
  value: totalBookings, // completed + pending + cancelled
  icon: FileText,
  description: "Gesamt",
  subMetrics: [
    { label: 'Bestätigt', value: bookingsConfirmed, color: 'success' },
    { label: 'Ausstehend', value: bookingsPending, color: 'warning' },
    { label: 'Storniert', value: bookingsCancelled, color: 'error' }
  ],
  statusType: bookingsPending > 5 ? 'warning' : 'success',
  onClick: () => navigate('/auftraege')
}
```

**Datenquelle:** `useDashboardStats()` → `dashboard_stats` View  
**Status-Logik:** `warning` wenn `pending_bookings > 5`, sonst `success`

#### **2. Umsatz**

```typescript
{
  title: "Umsatz",
  value: formatCurrency(totalRevenue), // z.B. "12.345,67 €"
  icon: Euro,
  description: "Gesamt",
  subMetrics: [
    {
      label: 'Bezahlt',
      value: Math.round((revenuePaid / totalRevenue) * 100) || 0, // in %
      color: 'success'
    },
    {
      label: 'Offen',
      value: Math.round((revenuePending / totalRevenue) * 100) || 0, // in %
      color: 'warning'
    }
  ],
  statusType: revenuePending > totalRevenue * 0.5 ? 'warning' : 'success',
  onClick: () => navigate('/rechnungen')
}
```

**Datenquelle:** `useDashboardStats()` → `total_revenue`, `paid_revenue`, `pending_revenue`  
**Status-Logik:** `warning` wenn > 50% unbezahlt, sonst `success`

#### **3. Fahrer**

```typescript
{
  title: "Fahrer",
  value: totalDrivers,
  icon: Users,
  description: "Gesamt registriert",
  onClick: () => navigate('/fahrer?tab=drivers')
}
```

**Datenquelle:** `useDashboardStats()` → `total_drivers`  
**Hinweis:** Keine Sub-Metrics (kann erweitert werden mit shift_status)

#### **4. Kunden**

```typescript
{
  title: "Kunden",
  value: totalCustomers,
  icon: Users,
  description: "Gesamt registriert",
  onClick: () => navigate('/kunden')
}
```

**Datenquelle:** `useDashboardStats()` → `total_customers`

### **KPICard Design-Spezifikation**

```typescript
interface KPICardProps {
  title: string;
  value: string | number;
  icon: any;
  description?: string;
  subMetrics?: SubMetric[];
  trend?: string; // z.B. "+15%"
  trendDirection?: "up" | "down";
  onClick?: () => void;
  statusType?: "success" | "warning" | "error" | "neutral";
}

interface SubMetric {
  label: string;
  value: number;
  color: "success" | "warning" | "error" | "neutral";
}
```

**Styling:**

```css
/* Card */
className="cursor-pointer transition-all hover:shadow-md h-full border-border"

/* Status-Farbcodierung */
statusType === 'success': border-status-success/20 bg-status-success/5
statusType === 'warning': border-status-warning/20 bg-status-warning/5
statusType === 'error': border-status-error/20 bg-status-error/5
default: border-border

/* Icon */
className="h-4 w-4 sm:h-5 sm:w-5 text-foreground"

/* Value */
className="text-xl sm:text-2xl font-bold mt-0.5 sm:mt-1"

/* Sub-Metrics Dot */
w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full
bg-status-success (grün) | bg-status-warning (gelb) | bg-status-error (rot)
```

---

## 🎛️ DASHBOARD-WIDGETS

### **Widget-Übersicht**

| Widget                   | Spalten | Business+ | Error Boundary | Beschreibung                               |
| ------------------------ | ------- | --------- | -------------- | ------------------------------------------ |
| `DashboardKPICards`      | 4       | ❌        | ✅             | KPI-Cards mit Drill-Down                   |
| `UrgentActionsWidget`    | 1       | ❌        | ✅             | Dringende Aktionen (Dokumente, Rechnungen) |
| `ResourceStatusWidget`   | 1       | ❌        | ✅             | Fahrer & Fahrzeuge Status                  |
| `RevenueBreakdownWidget` | 1       | ✅        | ✅             | Umsatz-Aufschlüsselung                     |
| `HEREMapComponent`       | 2       | ❌        | ✅             | Live-Karte mit Fahrzeugen                  |
| `WeatherWidget`          | 1       | ❌        | ✅             | Wetter-Informationen                       |
| `TrafficWidget`          | 1       | ❌        | ✅             | Verkehrsmeldungen                          |
| `PredictiveDemandWidget` | 3       | ✅        | ✅             | AI-Nachfrage-Prognose                      |
| `LiveInfoWidget`         | 1       | ✅        | ✅             | Live-Infos (News, Alerts)                  |
| `ActivityTimeline`       | 2/3     | ❌        | ✅             | Letzte Aktivitäten (Audit-Logs)            |

### **Widget-Details**

#### **UrgentActionsWidget**

```typescript
<UrgentActionsWidget
  expiringDocuments={expiringDocuments} // Anzahl
  overdueInvoices={overdueInvoices} // Anzahl
  overdueAmount={overdueAmount} // € Betrag
  unassignedBookings={dashboardStats?.pending_bookings ?? 0}
/>
```

**Datenquellen:**

- `documents` → Filter: `expiry_date <= heute + 30 Tage`
- `invoices` → Filter: `payment_status === 'overdue'`
- `dashboardStats` → `pending_bookings`

**Aktionen:**

- Klick auf "Dokumente" → `/dokumente`
- Klick auf "Rechnungen" → `/rechnungen`
- Klick auf "Aufträge" → `/auftraege`

#### **ResourceStatusWidget**

```typescript
<ResourceStatusWidget
  availableDrivers={[
    { id, first_name, last_name, profile_image_url, shift_status, rides_today }
  ]} // Max 3
  busyDrivers={[
    { id, first_name, last_name, profile_image_url, shift_status, rides_today, current_booking }
  ]} // Max 3
  offlineDrivers={count} // Anzahl
  availableVehicles={count} // Anzahl
  totalVehicles={count} // Anzahl
/>
```

**Datenquellen:**

- `drivers` → Filter: `!archived && shift_status === 'available'`
- `drivers` → Filter: `!archived && shift_status === 'busy'`
- `vehicles` → Filter: `!archived`

#### **RevenueBreakdownWidget** (Business+)

```typescript
<RevenueBreakdownWidget
  total={todayTotal} // Gesamtumsatz heute
  breakdown={[
    { label: 'Barzahlung', value: revenueCash, percentage: 45, color: 'hsl(var(--primary))' },
    { label: 'Rechnung', value: revenueInvoice, percentage: 35, color: 'hsl(var(--primary))' },
    { label: 'Kartenzahlung', value: revenueCard, percentage: 20, color: 'hsl(var(--status-success))' }
  ]}
  comparison={{
    yesterday: yesterdayRevenue,
    lastWeek: lastWeekRevenue,
    lastMonth: lastMonthRevenue
  }}
/>
```

**Datenquellen:**

- `bookings` → Filter: `created_at === heute && payment_status === 'paid'`
- Gruppierung nach `payment_method` (Barzahlung, Rechnung, Kartenzahlung)
- Dual-Fallback: DE + EN Zahlungsmethoden

**Fallback (Starter):**

```typescript
<Card className="border-primary/20 bg-primary/5">
  <CardContent className="pt-6">
    <div className="text-center py-6">
      <TrendingUp className="h-12 w-12 mx-auto mb-3 text-foreground" />
      <h3 className="font-semibold mb-2">Umsatz-Analyse</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Detaillierte Umsatz-Aufschlüsselung nur im Business-Tarif
      </p>
      <Button size="sm" onClick={() => navigate('/pricing')}>
        Jetzt upgraden
      </Button>
    </div>
  </CardContent>
</Card>
```

#### **HEREMapComponent**

```typescript
<WidgetErrorBoundary widgetName="HERE Map">
  <HEREMapComponent />
</WidgetErrorBoundary>
```

**Features:**

- Live-Tracking verfügbarer Fahrer
- Aktuelle Fahrzeug-Positionen
- Interaktive Karte (Zoom, Pan)
- Marker mit Tooltips

#### **WeatherWidget** & **TrafficWidget**

```typescript
<WidgetErrorBoundary widgetName="Wetter">
  <WeatherWidget />
</WidgetErrorBoundary>

<WidgetErrorBoundary widgetName="Verkehr">
  <TrafficWidget />
</WidgetErrorBoundary>
```

**Datenquellen:**

- HERE Weather API (via Edge Function)
- HERE Traffic API (via Edge Function)

#### **PredictiveDemandWidget** (Business+)

```typescript
{isBusinessActive && (
  <section>
    <PredictiveDemandWidget />
  </section>
)}
```

**Features:**

- AI-basierte Nachfrage-Prognose (7 Tage)
- Historische Analyse (90 Tage)
- Lovable AI Gateway (Google Gemini)
- Visualisierung via Recharts

**Datenquelle:**

- Edge Function: `ai-forecast`
- Model: `google/gemini-2.5-flash`

#### **ActivityTimeline**

```typescript
<ActivityTimeline
  activities={activities} // Audit-Logs
  maxItems={5}
/>
```

**Datenquelle:**

- `audit_logs` Tabelle (via `useAuditLogs()`)
- Sortierung: `created_at DESC`
- Limit: 5 neueste Einträge

**Aktivitätstypen:**

- `booking.created` → "Neuer Auftrag erstellt"
- `driver.shift_start` → "Fahrer hat Schicht gestartet"
- `invoice.paid` → "Rechnung wurde bezahlt"
- etc.

---

## 📱 RESPONSIVE BREAKPOINTS

### **Grid-Breakpoints**

```css
/* KPI-Cards */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

/* Widgets Row */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3

/* Map + Quick Actions */
grid-cols-1 lg:grid-cols-3
  - Map: lg:col-span-2
  - Sidebar: default

/* Live Info + Activity */
grid-cols-1 lg:grid-cols-3
  - LiveInfo: lg:col-span-1 (wenn Business+)
  - Activity: lg:col-span-2 (Business+) | lg:col-span-3 (Starter)
```

### **Mobile-Spezifisch**

```typescript
if (isMobile) {
  return (
    <MobileDashboard
      profile={profile}
      totalBookings={totalBookings}
      totalRevenue={totalRevenue}
      activeDrivers={activeDrivers}
      vehiclesInUse={availableVehicles}
      expiringDocuments={expiringDocuments}
      overdueInvoices={overdueInvoices}
      overdueAmount={overdueAmount}
      onNavigate={(path, state) => navigate(path, state)}
    />
  );
}
```

**Mobile-Optimierungen:**

- Stack-Layout (vertikal)
- Touch-optimierte Buttons (min-height: 44px)
- Reduzierte Info-Dichte
- Bottom-Navigation statt Sidebar
- Swipe-Gesten

---

## 🔄 DATENFLUSS & APIS

### **Hooks & Queries**

```typescript
// Authentifizierung
const { profile, company } = useAuth();

// Subscription-Status
const { productId } = useSubscription();
const isBusinessActive =
  company?.subscription_status === "active" &&
  company?.subscription_product_id &&
  isBusinessTier(company.subscription_product_id);

// Dashboard-Statistiken (Materialized View)
const { data: dashboardStats } = useDashboardStats();
// Nutzt: supabase.rpc('get_dashboard_stats_for_company', { target_company_id })

// Live-Statistiken
const { stats: liveData } = useStatistics();

// Entitäten
const { drivers = [] } = useDrivers();
const { vehicles = [] } = useVehicles();
const { documents = [] } = useDocuments();
const { invoices = [] } = useInvoices();
const { bookings = [] } = useBookings();
const { activities, isLoading: isLoadingActivities } = useAuditLogs();

// Realtime-Updates
useRealtimeBookings();
useRealtimeDrivers();
useRealtimeVehicles();

// Device-Detection
const { isMobile } = useDeviceType();
```

### **Dashboard-Stats (Materialized View)**

**RPC Function:** `get_dashboard_stats_for_company(target_company_id UUID)`

**Rückgabe:**

```typescript
interface DashboardStats {
  company_id: string;
  completed_bookings: number;
  confirmed_bookings: number;
  pending_bookings: number;
  cancelled_bookings: number;
  total_revenue: number;
  avg_booking_value: number;
  paid_revenue: number;
  pending_revenue: number;
  partner_bookings: number;
  partner_revenue: number;
  total_customers: number;
  total_drivers: number;
  total_vehicles: number;
  last_refresh: string; // ISO Timestamp
}
```

**View-Refresh:** Automatisch via Trigger bei INSERT/UPDATE/DELETE auf `bookings`

**Caching:**

```typescript
staleTime: 60000, // 1 Minute
gcTime: 5 * 60 * 1000, // 5 Minuten
retry: 3,
refetchOnWindowFocus: false,
```

---

## 🔒 TARIFF-GATING

### **Business+ Features**

```typescript
const isBusinessActive =
  company?.subscription_status === "active" &&
  company?.subscription_product_id &&
  isBusinessTier(company.subscription_product_id);

// Business+ Product IDs
const businessProductIds = ["prod_TEegHmtpPZOZcG", "prod_TF5cnWFZYEQUsG"];
```

**Gesperrte Features (Starter):**

- `RevenueBreakdownWidget` → Zeigt Upgrade-Banner
- `PredictiveDemandWidget` → Nicht gerendert
- `LiveInfoWidget` → Nicht gerendert

**Upgrade-Banner (Starter):**

```typescript
{!isBusinessActive && (
  <section>
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold mb-1">Erweitern Sie Ihre Möglichkeiten</h3>
            <p className="text-sm text-muted-foreground">
              Upgraden Sie auf Business für Live-Tracking, Wetter & Verkehrsdaten, Partner-Management und mehr.
            </p>
          </div>
          <Button onClick={() => navigate('/pricing')} className="flex-shrink-0">
            Tarife ansehen
          </Button>
        </div>
      </CardContent>
    </Card>
  </section>
)}
```

---

## 🎨 DESIGN-GUIDELINES

### **Spacing**

```css
/* Haupt-Container */
space-y-6 sm:space-y-8

/* Sections */
gap-4 lg:gap-6

/* Card Padding */
p-4 sm:p-6
```

### **Typography**

```css
/* Hero-Titel */
text-3xl font-bold

/* Beschreibungstext */
text-muted-foreground mt-1

/* KPI-Werte */
text-xl sm:text-2xl font-bold

/* Sub-Metrics */
text-[10px] sm:text-xs
```

### **Farben**

```css
/* Status-Codierung */
border-status-success/20 bg-status-success/5  /* Grün */
border-status-warning/20 bg-status-warning/5  /* Gelb */
border-status-error/20 bg-status-error/5      /* Rot */

/* Upgrade-Banner */
border-primary/20 bg-primary/5

/* Hover-Effects */
hover:shadow-md
hover:scale-105 (Buttons)
```

---

## 📝 SCHNELLAKTIONEN

### **Quick-Actions-Array**

```typescript
const quickActions = [
  {
    label: "Neuer Auftrag",
    icon: Plus,
    action: () => navigate("/auftraege", { state: { openCreateDialog: true } }),
    variant: "default" as const,
  },
  {
    label: "Schichtzettel",
    icon: Calendar,
    action: () => navigate("/schichtzettel"),
    variant: "outline" as const,
  },
  {
    label: "Team-Chat",
    icon: MessageSquare,
    action: () => navigate("/team-chat"),
    variant: "outline" as const,
  },
];
```

**Render:**

```typescript
<Card>
  <CardHeader className="pb-3">
    <CardTitle className="text-base">Schnellaktionen</CardTitle>
  </CardHeader>
  <CardContent className="space-y-2">
    {quickActions.map((action) => (
      <Button
        key={action.label}
        variant={action.variant}
        size="sm"
        className="w-full justify-start"
        onClick={action.action}
      >
        <action.icon className="mr-2 h-4 w-4" />
        {action.label}
      </Button>
    ))}
  </CardContent>
</Card>
```

---

## 🚀 PERFORMANCE-OPTIMIERUNGEN

### **React Query Caching**

```typescript
// Dashboard-Stats
staleTime: 60000, // 1 Minute
gcTime: 5 * 60 * 1000, // 5 Minuten

// Realtime-Updates via Subscriptions
useRealtimeBookings(); // Invalidiert bookings-Query
useRealtimeDrivers(); // Invalidiert drivers-Query
useRealtimeVehicles(); // Invalidiert vehicles-Query
```

### **Error-Boundaries**

```typescript
<WidgetErrorBoundary widgetName="HERE Map">
  <HEREMapComponent />
</WidgetErrorBoundary>
```

**Fallback bei Fehler:**

```typescript
<ErrorPlaceholder
  title="Widget temporär nicht verfügbar"
  action={<Button onClick={refetch}>Erneut versuchen</Button>}
/>
```

### **Lazy-Loading**

```typescript
// WelcomeWizard nur bei Bedarf laden
const [showWelcomeWizard, setShowWelcomeWizard] = useState(false);

useEffect(() => {
  const hasSeenOnboarding = localStorage.getItem("mydispatch_onboarding_completed");
  if (!hasSeenOnboarding && profile) {
    setShowWelcomeWizard(true);
  }
}, [profile]);
```

---

## ✅ ZUSAMMENFASSUNG

### **Dashboard-Aufbau (Desktop)**

1. **Hero Section:** KPI-Cards (4-Spalten)
2. **Widgets Row:** UrgentActions, ResourceStatus, RevenueBreakdown (3-Spalten)
3. **Map & Quick Actions:** HEREMap (2 Spalten) + Sidebar (1 Spalte)
4. **AI Predictive:** PredictiveDemandWidget (Full-Width, Business+)
5. **Live Info & Activity:** LiveInfoWidget (1 Spalte, Business+) + ActivityTimeline (2/3 Spalten)
6. **Upgrade-Banner:** Nur für Starter-Nutzer

### **Key Features**

✅ Realtime-Updates via Supabase Subscriptions  
✅ Materialized View für schnelle Stats-Abfragen  
✅ Error-Boundaries für resiliente Widgets  
✅ Tariff-Gating für Business+ Features  
✅ Mobile-optimierte Alternative (MobileDashboard)  
✅ Responsive Grid-Layout  
✅ SEO-optimiert via SEOHead  
✅ Breadcrumbs-Navigation

### **Datenquellen**

- `dashboard_stats` View (RPC)
- `bookings`, `drivers`, `vehicles`, `customers`, `invoices`, `documents`
- Realtime via Supabase Subscriptions
- HERE APIs (Map, Weather, Traffic)
- Lovable AI (Gemini 2.5 Flash)

---

**Version:** V18.5.0  
**Letztes Update:** 2025-01-15  
**Autor:** MyDispatch System-Dokumentation  
**Status:** ✅ PRODUKTIV
