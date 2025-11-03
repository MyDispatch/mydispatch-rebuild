# CARD LAYOUT SYSTEM V18.5.0

> **Version:** 18.5.0  
> **Status:** ✅ VERBINDLICH  
> **Zweck:** Perfekte Card-Ausrichtung ohne Overflow

---

## 🎯 PROBLEM & LÖSUNG

### ❌ VORHER (Probleme)
- Cards mit unterschiedlichen Höhen
- Unschöne Leerflächen zwischen Cards
- Cards überlagern sich
- Overflow-Probleme
- Keine automatische Breitenanpassung

### ✅ NACHHER (Perfekt)
- Alle Cards gleich hoch in Reihe
- Perfekt bündige Ausrichtung
- Kein Overflow
- Responsive Grid mit voller Breite
- Automatische Höhenanpassung

---

## 📐 GRID-SYSTEM

### Standard-Grid (Dashboard/App-Seiten)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  <div className="w-full h-full overflow-hidden">
    <Card className="w-full h-full">
      {/* Card Content */}
    </Card>
  </div>
</div>
```

### Map + Sidebar Grid
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
  {/* Map: 2/3 Breite */}
  <div className="lg:col-span-2 w-full overflow-hidden">
    <HEREMapComponent />
  </div>
  
  {/* Sidebar: 1/3 Breite */}
  <div className="w-full space-y-4">
    <WeatherWidget />
    <TrafficWidget />
  </div>
</div>
```

### Timeline Grid (Business+)
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
  {isBusinessActive && (
    <div className="lg:col-span-1 w-full overflow-hidden">
      <LiveInfoWidget />
    </div>
  )}
  <div className={cn(
    "w-full overflow-hidden",
    isBusinessActive ? 'lg:col-span-2' : 'lg:col-span-3'
  )}>
    <ActivityTimeline />
  </div>
</div>
```

---

## 🃏 CARD-STRUKTUR

### Standard-Card (mit Overflow-Protection)
```tsx
<Card className="w-full h-full overflow-hidden border shadow-sm">
  <CardHeader className="pb-2 pt-3">
    <CardTitle className="text-sm font-semibold truncate">
      Titel
    </CardTitle>
  </CardHeader>
  <CardContent className="pb-3 overflow-hidden">
    {/* Content mit automatischem Scroll */}
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {/* Items */}
    </div>
  </CardContent>
</Card>
```

### Widget-Card (volle Höhe)
```tsx
<div className="w-full h-full">
  <Card className="w-full h-full flex flex-col overflow-hidden">
    <CardHeader className="pb-2 pt-3 flex-shrink-0">
      {/* Header fixiert */}
    </CardHeader>
    <CardContent className="flex-1 overflow-y-auto pb-3">
      {/* Content scrollbar */}
    </CardContent>
  </Card>
</div>
```

---

## 🔒 OVERFLOW-PROTECTION

### Text-Overflow
```tsx
// Einzeiliger Text
<p className="truncate">Langer Text...</p>

// Mehrzeiliger Text mit Ellipsis
<p className="line-clamp-2">Sehr langer Text...</p>
<p className="line-clamp-3">Noch längerer Text...</p>

// Mit max-height
<div className="max-h-[200px] overflow-y-auto">
  <p>Unbegrenzter Text...</p>
</div>
```

### Container-Overflow
```tsx
// Parent-Container
<div className="overflow-hidden">
  <div className="space-y-4">
    {/* Cards */}
  </div>
</div>

// Horizontal Scroll verhindern
<div className="overflow-x-hidden max-w-full">
  {/* Content */}
</div>
```

---

## 📱 RESPONSIVE GAPS

### Standard-Spacing
```tsx
gap-4 sm:gap-6     // 16px → 24px
gap-3 sm:gap-4     // 12px → 16px
gap-2 sm:gap-3     // 8px → 12px
```

### Container-Padding
```tsx
px-4 sm:px-6 lg:px-8  // 16px → 24px → 32px
py-4 sm:py-6          // 16px → 24px
```

---

## 🎨 CARD-VARIANTEN

### Standard-Card
```tsx
<Card className="border shadow-sm">
  {/* Content */}
</Card>
```

### Hover-Card
```tsx
<Card className="border shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer">
  {/* Content */}
</Card>
```

### Alert-Card (für Urgent Actions)
```tsx
<Card className="border-status-warning/20 bg-status-warning/5">
  {/* Warnung */}
</Card>
```

### Disabled-Card (Feature Locked)
```tsx
<Card className="border-primary/20 bg-primary/5 opacity-75">
  {/* Upgrade-Hinweis */}
</Card>
```

---

## 🔧 FLEX VS GRID

### Wann GRID verwenden?
```tsx
// ✅ Für gleichmäßige Spalten-Layouts
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <Card>Widget 1</Card>
  <Card>Widget 2</Card>
  <Card>Widget 3</Card>
</div>
```

### Wann FLEX verwenden?
```tsx
// ✅ Für unterschiedliche Content-Größen
<div className="flex flex-col sm:flex-row gap-4">
  <Card className="flex-1">Hauptinhalt</Card>
  <Card className="w-full sm:w-80">Sidebar</Card>
</div>
```

---

## 🎯 HÄUFIGE PROBLEME & LÖSUNGEN

### Problem 1: Cards verschiedene Höhen
**Lösung:**
```tsx
<div className="grid grid-cols-3 gap-6">
  <div className="w-full h-full">
    <Card className="w-full h-full">{/* Content */}</Card>
  </div>
</div>
```

### Problem 2: Card-Overflow
**Lösung:**
```tsx
<Card className="overflow-hidden">
  <CardContent className="overflow-y-auto max-h-[400px]">
    {/* Content */}
  </CardContent>
</Card>
```

### Problem 3: Leerflächen zwischen Cards
**Lösung:**
```tsx
// Konsistente Gaps verwenden
<div className="space-y-6">  // Vertikal
<div className="grid gap-6">  // Grid
```

### Problem 4: Card zu breit auf Mobile
**Lösung:**
```tsx
<Card className="w-full max-w-2xl mx-auto">
  {/* Begrenzte Breite, zentriert */}
</Card>
```

### Problem 5: Cards überlagern sich
**Lösung:**
```tsx
// Klare Container-Hierarchie
<div className="space-y-6">  // Parent mit spacing
  <Card>{/* Card 1 */}</Card>
  <Card>{/* Card 2 */}</Card>
</div>
```

---

## 📋 CARD-LAYOUT CHECKLISTE

Vor Deployment prüfen:

- [ ] Alle Cards verwenden `w-full`
- [ ] Grid-Container haben `gap-4 sm:gap-6`
- [ ] Overflow-protection: `overflow-hidden` auf Card
- [ ] Text-Ellipsis: `truncate` oder `line-clamp-X`
- [ ] Responsive Gaps: `gap-4 sm:gap-6`
- [ ] Max-Width auf Auth-Cards: `max-w-2xl`
- [ ] Touch-Targets: `min-h-[44px]` auf Buttons
- [ ] Container-Padding: `px-4 sm:px-6 lg:px-8`

---

## 🔗 BEISPIELE

### Dashboard-Grid (3-Spalten)
```tsx
<div className="space-y-6 overflow-hidden">
  {/* Row 1: Widgets */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    <div className="w-full h-full">
      <UrgentActionsWidget />
    </div>
    <div className="w-full h-full">
      <ResourceStatusWidget />
    </div>
    <div className="w-full h-full">
      <RevenueBreakdownWidget />
    </div>
  </div>
  
  {/* Row 2: Map + Sidebar */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
    <div className="lg:col-span-2 w-full overflow-hidden">
      <HEREMapComponent />
    </div>
    <div className="w-full space-y-4">
      <WeatherWidget />
      <TrafficWidget />
    </div>
  </div>
</div>
```

### Auth-Page Card
```tsx
<main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
  <Card className="w-full max-w-2xl shadow-elegant overflow-hidden">
    <CardContent className="p-6 sm:p-8">
      {/* Form Content */}
    </CardContent>
  </Card>
</main>
```

---

## 🔗 VERKNÜPFTE DOKUMENTE

- [DESIGN_SYSTEM_VORGABEN_V18.3.md](./DESIGN_SYSTEM_VORGABEN_V18.3.md)
- [UI_COMPONENTS_LIBRARY_V18.5.0.md](./UI_COMPONENTS_LIBRARY_V18.5.0.md)
- [QUALITAETS_STANDARDS_V18.5.0.md](./QUALITAETS_STANDARDS_V18.5.0.md)

---

**Letzte Aktualisierung:** 2025-10-22 22:45 (DE)  
**Version:** 18.5.0  
**Status:** ✅ VERBINDLICH
