# SYSTEM-KOMPONENTEN VORGABEN V18.5.1

> **Version:** 18.5.1  
> **Letzte Aktualisierung:** 2025-01-26  
> **Status:** 🟢 VERPFLICHTEND

---

## 🎯 KERNREGEL: SYSTEM-KOMPONENTEN → MASTER-DASHBOARD

**VERPFLICHTEND:** Alle System-bezogenen Komponenten (Alerts, Monitoring, Logs, Health-Checks, Admin-Tools) werden **AUSSCHLIESSLICH** im Master-Dashboard (`/master`) integriert.

### WARUM?

- **Zielgruppe:** System-Komponenten sind für **MyDispatch-Betreiber** (intern), **NICHT** für MyDispatch-Kunden
- **Konsistenz:** Zentrale Übersicht aller System-Metriken an einem Ort
- **Effizienz:** Keine zusätzlichen Routen für interne Tools
- **Security:** Reduzierte Angriffsfläche durch weniger exponierte Routen

### 🚨 SICHERHEITS-KRITISCH!

**ABSOLUTE REGEL:** Kunden-Dashboard (`/dashboard`) und Master-Dashboard (`/master`) sind **KOMPLETT GETRENNT**!

- ✅ `/master` Route mit `requiredRole="master"` geschützt
- ✅ System-Komponenten **NIEMALS** im Kunden-Dashboard
- ✅ Zugriff nur für MyDispatch-Team (role = 'master')
- ✅ Siehe: `docs/DASHBOARD_SECURITY_SEPARATION_V18.5.1.md`

---

## ✅ INTEGRATION-PATTERN

### 1. Master-Dashboard Layout

```typescript
// src/pages/MasterDashboard.tsx (Master-Dashboard)

<DashboardLayout title="Master-Dashboard" description="...">
  <div className="space-y-6">
    {/* KPI-Bereich (oben, volle Breite) */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard />
      <KPICard />
      <KPICard />
      <KPICard />
    </div>

    {/* SYSTEM-WIDGETS (unterhalb KPIs, vor Tabs) */}
    <div className="lg:max-w-md">
      <AlertWidget />  {/* ← System-Komponente HIER */}
      {/* ... weitere System-Widgets */}
    </div>

    {/* Tabs für verschiedene Bereiche */}
    <Tabs defaultValue="overview">
      <TabsList>...</TabsList>
      <TabsContent>...</TabsContent>
    </Tabs>
  </div>
</DashboardLayout>
```

### 2. Widget-Struktur (Standard)

```typescript
// src/components/dashboard/AlertWidget.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLatestAlerts, useAlertStatistics } from "@/hooks/use-alert-system";

export function AlertWidget() {
  const { data: stats } = useAlertStatistics(7);
  const { data: alerts } = useLatestAlerts(5);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          System-Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {/* Stats-Übersicht (3 Badges) */}
        <div className="grid grid-cols-3 gap-2">
          <StatBadge label="Critical" value={stats?.critical || 0} variant="destructive" />
          <StatBadge label="Warning" value={stats?.warning || 0} variant="warning" />
          <StatBadge label="Info" value={stats?.info || 0} variant="default" />
        </div>

        {/* Latest Alerts (max 5, kompakt) */}
        <div className="space-y-2">
          {alerts?.slice(0, 5).map(alert => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 🚫 VERBOTEN

### ❌ NICHT ERLAUBT:

```typescript
// ❌ FALSCH: Separate Route für System-Komponenten
<Route path="/alerts" element={<AlertsPage />} />
<Route path="/monitoring" element={<MonitoringPage />} />
<Route path="/logs" element={<LogsPage />} />

// ❌ FALSCH: Eigenständige Seiten für System-Tools
// src/pages/Alerts.tsx
// src/pages/Monitoring.tsx
// src/pages/SystemHealth.tsx

// ❌ FALSCH: System-Komponenten im Kunden-Dashboard
// src/pages/Index.tsx (Kunden-Dashboard)
<AlertWidget /> // ← FALSCH! Gehört ins Master-Dashboard
```

### ✅ KORREKT:

```typescript
// ✅ RICHTIG: Alles im Master-Dashboard
<Route path="/master" element={<MasterDashboard />} />

// Master-Dashboard enthält:
// - AlertWidget (System-Alerts)
// - MonitoringWidget (Performance)
// - LogWidget (Error-Logs)
// - HealthCheckWidget (API-Status)

// ✅ RICHTIG: Trennung der Dashboards
// /dashboard → Kunden-Dashboard (Business-Widgets)
// /master    → Master-Dashboard (System-Widgets)
```

---

## 📋 SYSTEM-KOMPONENTEN LISTE

### Bereits Integriert (Master-Dashboard):

- ✅ `AlertWidget` (System-Alerts, NEU in BATCH 10)

### Business-Widgets (Kunden-Dashboard):

- ✅ `WeatherWidget` (Wetter-Daten für Tourenplanung)
- ✅ `TrafficWidget` (Verkehrslage)
- ✅ `PredictiveDemandWidget` (KI-Prognosen, Business-Tier)

### Zukünftige System-Widgets (Master-Dashboard):

- 🔄 `PerformanceWidget` (Response Times, DB-Latenz)
- 🔄 `ErrorLogWidget` (Latest Errors, 404s, Sentry)
- 🔄 `UserActivityWidget` (Active Users, Sessions)
- 🔄 `BackupStatusWidget` (Letzte Backups, Erfolgsrate)
- 🔄 `APIHealthWidget` (Externe APIs: Stripe, Google Maps, etc.)
- 🔄 `DatabaseWidget` (Connections, Query Performance)
- 🔄 `SecurityWidget` (Failed Logins, Suspicious Activity)

---

## 🎨 DESIGN-VORGABEN

### Widget-Größe (Responsive):

```typescript
// Master-Dashboard: Begrenzte Breite für bessere Lesbarkeit
className = "lg:max-w-md"; // Max 448px auf Desktop

// Alternative: Volle Breite (wenn mehrere Widgets nebeneinander)
className = "w-full";
```

### Widget-Höhe:

```typescript
// IMMER flexible Höhe für Grid-Konsistenz
className = "h-full";
```

### Spacing:

```typescript
// Konsistentes Spacing (siehe DESIGN_SYSTEM_VORGABEN_V18.3.md)
<div className="space-y-4 sm:space-y-6">
  <Widget1 />
  <Widget2 />
</div>
```

### Farben (NIEMALS direkt!):

```typescript
// ❌ FALSCH
className = "text-red-500 bg-white";

// ✅ RICHTIG: Semantic Tokens
className = "text-destructive bg-background";
```

---

## 🔄 WORKFLOW BEI NEUEN SYSTEM-KOMPONENTEN

1. **Prüfung:** Ist es eine System-Komponente? (Intern, nicht für Kunden)
2. **Entscheidung:** Widget im Master-Dashboard erstellen
3. **Implementation:**
   - Widget-Komponente erstellen (`src/components/dashboard/XyzWidget.tsx`)
   - Hook für Daten erstellen/nutzen (`src/hooks/use-xyz.ts`)
   - In `/dashboard` rechte Spalte integrieren
4. **Testing:** Mobile (375px), Tablet (768px), Desktop (1920px)
5. **Dokumentation:** Diese Datei aktualisieren (Liste erweitern)

---

## 📊 BEISPIEL: MASTER-DASHBOARD LAYOUT

```typescript
// src/pages/MasterDashboard.tsx
export default function MasterDashboard() {
  return (
    <DashboardLayout title="Master-Dashboard" description="System-Überwachung">
      <div className="space-y-6">

        {/* KPIs (volle Breite, 4 Karten) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Gesamt" value={stats.total} icon={Building2} />
          <KPICard title="Aktiv" value={stats.active} icon={Users} />
          <KPICard title="Terminiert" value={stats.terminated} icon={AlertCircle} />
          <KPICard title="Umsatz" value={formatCurrency(stats.totalRevenue)} icon={TrendingUp} />
        </div>

        {/* SYSTEM-WIDGETS (unterhalb KPIs, vor Tabs) */}
        <div className="lg:max-w-md">
          <WidgetErrorBoundary widgetName="AlertWidget">
            <AlertWidget />
          </WidgetErrorBoundary>
        </div>

        {/* Tabs für verschiedene Bereiche */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="termination">Terminierung</TabsTrigger>
            <TabsTrigger value="analytics">Analysen</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">...</TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
```

---

## ✅ CHECKLISTE

Vor Commit (System-Komponente):

- [ ] Widget im Master-Dashboard (`/master`) integriert (NICHT `/dashboard`)?
- [ ] NICHT im Kunden-Dashboard platziert?
- [ ] Begrenzte Breite (`lg:max-w-md`) oder Grid genutzt?
- [ ] Mobile-First Design (375px, 768px, 1920px getestet)?
- [ ] Semantic Tokens (keine direkten Farben)?
- [ ] Hook für Daten genutzt (nicht inline API-Calls)?
- [ ] `h-full` oder `flex flex-col` für flexible Höhe?
- [ ] `WidgetErrorBoundary` verwendet?
- [ ] Diese Dokumentation aktualisiert?

---

**KRITISCH:** Diese Vorgabe ist **NICHT verhandelbar**. System-Komponenten gehören ins Master-Dashboard. Keine Ausnahmen.

---

**Version:** 18.5.1  
**Datum:** 26.01.2025  
**Status:** 🟢 Production-Ready & Verpflichtend
