# 📊 DASHBOARD DESIGN-VORGABEN V18.3.24

**Datum**: 20.01.2025  
**Status**: ✅ ZWINGEND FÜR ALLE DASHBOARDS  
**Gültigkeit**: Systemweit für alle Dashboard-Seiten

---

## 🚨 ABSOLUTE REGEL: KEINE LEERRÄUME

**KRITISCH**: Es sind **KEINE Leerräume** in Dashboards erlaubt!

### Regel-Definition
- Alle Spalten in einem Grid müssen **exakt gleich hoch** enden
- Linke und rechte Spalten MÜSSEN **bündig abschließen**
- **KEINE weißen Löcher** zwischen oder unter Cards
- Alle Widgets müssen **kompakt** und **flächeneffizient** sein
- **JEDE SEITE** muss vollständig abschließen - keine Ausnahmen!

### Häufige Verstöße (VERBOTEN!)
❌ Linke Spalte endet früher als rechte Spalte
❌ Weiße Flächen unter Cards
❌ Doppelte/redundante Widgets (z.B. "Ressourcen-Status" zweimal)
❌ Hover-Icons ohne Farbe (Icons MÜSSEN bei Hover heller werden: `group-hover:text-accent`)

### Widget-Anordnung (LOGISCH & NUTZERFREUNDLICH)
**WICHTIG**: Widgets müssen logisch gruppiert und priorisiert sein!
- **Linke Spalte** (Operativ): Aktionen → Überblick → Follow-up
- **Rechte Spalte** (Monitoring): Kritisch → Details → Historie
- **Siehe auch**: `docs/DASHBOARD_NAMING_CONVENTIONS.md`

### Umsetzung
```tsx
// ✅ RICHTIG: Linke Spalte füllen bis bündig mit rechter Spalte
<div className="grid grid-cols-12 gap-3">
  <div className="col-span-8 space-y-3">
    <Card /> {/* Chart */}
    <Card /> {/* Map */}
    <div className="grid grid-cols-2 gap-3">
      <Card /> {/* Live-Status 1 */}
      <Card /> {/* Live-Status 2 */}
    </div>
    <Card /> {/* Schnellzugriff */}
  </div>
  
  <div className="col-span-4 space-y-3">
    <Card /> {/* Payment Methods */}
    <Card /> {/* Urgent Actions */}
    <Card /> {/* Resource Status */}
    <Card /> {/* Statistics */}
    <Card /> {/* Activity Timeline */}
  </div>
</div>

// ❌ FALSCH: Leere Fläche unter linker Spalte
<div className="col-span-8">
  <Card /> {/* Chart */}
  <Card /> {/* Map */}
  {/* FEHLT: Weitere Cards zum Auffüllen! */}
</div>
```

---

## 📐 CARD-STANDARDS

### 1. Card-Struktur (ZWINGEND)
```tsx
// Standard Card-Template
<Card className="border shadow-sm">          {/* KEIN h-full! */}
  <CardHeader className="pb-2 pt-3">        {/* Kompakt */}
    <CardTitle className="text-sm font-semibold">Titel</CardTitle>
  </CardHeader>
  <CardContent className="pb-3">            {/* Einheitlich */}
    {/* Content */}
  </CardContent>
</Card>
```

### 2. Padding-Standards
```tsx
// Header
pt-3    // 12px oben
pb-2    // 8px unten

// Content
pb-3    // 12px unten
p-2     // 8px für Items
```

### 3. Spacing-Standards
```tsx
// Container
space-y-3    // 12px zwischen Cards
gap-3        // 12px Grid-Gap

// Elemente
space-y-2    // 8px zwischen kleinen Items
gap-2        // 8px kleiner Grid-Gap
```

---

## 🎨 TYPOGRAFIE-STANDARDS

### Font-Größen
```tsx
// Headlines
text-sm      // 14px - Card-Titel
text-xs      // 12px - Sub-Headlines

// Body
text-xs      // 12px - Normaler Text
text-[11px]  // 11px - Beschreibungen
text-[10px]  // 10px - Meta-Infos
text-[9px]   // 9px - Labels
text-[8px]   // 8px - Badges (minimal)
```

### Icon-Größen
```tsx
h-4 w-4      // 16px - Standard Card-Header
h-3.5 w-3.5  // 14px - Timeline-Icons
h-3 w-3      // 12px - Kleine Icons
h-2.5 w-2.5  // 10px - Mini-Icons (Trend)
```

---

## 📊 CHART-STANDARDS

### Höhen-Definitionen
```tsx
// Area/Line Charts
h-[140px]    // Kompakt für Revenue-Chart

// Pie Charts
w-[90px] h-[90px]    // Payment Methods

// Bar Charts (Mini)
h-[32px]     // Trend-Lines in KPI-Cards
```

### Chart-Padding
```tsx
<CardContent className="pt-1 pb-3">
  <div className="w-full h-[140px]">
    <ResponsiveContainer>
      {/* Chart */}
    </ResponsiveContainer>
  </div>
</CardContent>
```

---

## 🔴 GRID-LAYOUT-SYSTEM

### Dashboard-Grid (12 Spalten)
```tsx
// Desktop: 8/4 Split
<div className="grid grid-cols-12 gap-3">
  <div className="col-span-8">    {/* Linke Spalte: Charts, Map, etc. */}
  <div className="col-span-4">    {/* Rechte Spalte: Widgets */}
</div>

// Mobile: Full Width
<div className="grid grid-cols-1 gap-3">
```

### Sub-Grids
```tsx
// 2-Spalten (hälftig)
<div className="grid grid-cols-2 gap-3">

// 3-Spalten (drittel)
<div className="grid grid-cols-3 gap-2">

// 4-Spalten (viertel)
<div className="grid grid-cols-4 gap-2">
```

---

## 🎯 WIDGET-TYPEN

### 1. KPI-Cards (Top-Row)
```tsx
<MetricCard
  title="Aufträge heute"
  value={totalBookings}
  icon={FileText}
  trend={{ value: 12, label: 'gestern' }}
  subtitle="X ausstehend"
  miniChart={[...data]}
/>
```

### 2. Chart-Cards
```tsx
<RevenueChart data={[...]} total={1234} />
<PaymentMethodsChart data={[...]} />
```

### 3. Status-Widgets
```tsx
<UrgentActionsWidget {...props} />
<ResourceStatusWidget {...props} />
<StatisticsWidget {...props} />
```

### 4. Timeline-Widget
```tsx
<ActivityTimeline 
  activities={recentActivities} 
  maxItems={5}  // Mit Pagination!
/>
```

---

## ✅ QUALITÄTS-CHECKLISTE

### Vor jedem Dashboard-Deployment:
- [ ] Linke Spalte endet bündig mit rechter Spalte
- [ ] Keine leeren Flächen sichtbar
- [ ] Alle Cards verwenden Standard-Paddings (`pt-3`, `pb-3`)
- [ ] Alle Spacing verwendet `gap-3` / `space-y-3`
- [ ] Keine `h-full` auf Cards (führt zu Weißflächen!)
- [ ] Charts haben feste Höhen (z.B. `h-[140px]`)
- [ ] Font-Größen folgen Standards (`text-xs`, `text-[10px]`, etc.)
- [ ] Icons verwenden `text-foreground` (KEINE Ampelfarben!)
- [ ] Mobile-View funktioniert (`grid-cols-1`)

---

## 🔧 HÄUFIGE FEHLER & LÖSUNGEN

### Problem: Weißfläche unter linker Spalte
```tsx
// ❌ FALSCH
<div className="col-span-8 space-y-4">
  <Card className="h-full" />  // h-full verursacht Leerraum!
</div>

// ✅ RICHTIG
<div className="col-span-8 space-y-3">
  <Card className="border shadow-sm" />  // Keine h-full!
  {/* Weitere Cards zum Auffüllen */}
  <div className="grid grid-cols-2 gap-3">
    <Card />
    <Card />
  </div>
</div>
```

### Problem: Zu viel Padding in Cards
```tsx
// ❌ FALSCH
<CardContent className="p-6">  // Zu viel Platz!

// ✅ RICHTIG
<CardContent className="pb-3">  // Kompakt!
```

### Problem: Charts zu hoch
```tsx
// ❌ FALSCH
<div className="h-[220px]">  // Zu groß!

// ✅ RICHTIG
<div className="h-[140px]">  // Kompakt!
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
```tsx
// Mobile: < 768px
<div className="grid grid-cols-1 gap-3">

// Tablet: 768px - 1024px
<div className="grid grid-cols-1 md:grid-cols-2 gap-3">

// Desktop: > 1024px
<div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
```

### Mobile-Optimierungen
- Reduzierte Paddings: `p-3` → `p-2`
- Kleinere Font-Größen
- Single-Column-Layout
- Touch-Targets ≥ 44px

---

## 🎨 CI-KONFORMITÄT

### Farben (HSL!)
```tsx
--primary: 40 31% 88%        // #EADEBD
--foreground: 225 31% 28%    // #323D5E
--accent: 45 31% 54%         // #A28A5B
--status-success: 142 71% 45%  // NUR für Badges!
--status-warning: 48 96% 53%   // NUR für Badges!
--status-error: 0 84% 60%      // NUR für Badges!
```

### Icon-Farben (ZWINGEND!)
```tsx
// ✅ RICHTIG
<Icon className="h-4 w-4 text-foreground" />

// ❌ FALSCH
<Icon className="h-4 w-4 text-status-success" />  // VERBOTEN!
```

---

## 🚀 WIEDERVERWENDBARKEIT

Alle Dashboard-Seiten MÜSSEN diese Standards einhalten:
- `/dashboard` (DashboardV18_3)
- `/statistiken`
- Zukünftige Dashboard-Views

**Diese Vorgaben sind systemweit bindend!**

---

**Version**: 18.3.24  
**Letzte Aktualisierung**: 20.01.2025  
**Verantwortlich**: System-Architektur  
**Status**: ✅ PRODUKTIV
