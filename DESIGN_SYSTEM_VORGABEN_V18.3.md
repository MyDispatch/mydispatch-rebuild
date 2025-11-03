# Design System Vorgaben V18.3 - Systemweite Layout-Konsistenz

**Datum:** 18.10.2025  
**Version:** V18.3  
**Status:** 🔴 PFLICHT - Systemweit durchzusetzen

---

## 🎯 ZIELSETZUNG

Alle Seiten und Komponenten MÜSSEN perfekt ausgerichtet sein:
- ✅ Keine ungewollten Lücken zwischen Elementen
- ✅ Konsistente Abstände (gap, padding, margin)
- ✅ Perfekte Ausrichtung horizontal und vertikal
- ✅ Responsive ohne Layout-Breaks

---

## 📐 SPACING-SYSTEM (Tailwind)

### Standard-Abstände
```tsx
// Gap zwischen Grid-Items
gap-4      // 1rem (16px) - STANDARD für Desktop
gap-6      // 1.5rem (24px) - Große Abstände
gap-3      // 0.75rem (12px) - Mobile

// Padding
p-6        // Innen-Abstand für Cards (Desktop)
p-4        // Innen-Abstand für Cards (Mobile)
py-8       // Vertikale Sektion-Abstände
px-4       // Horizontale Container-Padding

// Margin
mb-6       // Abstand zwischen Sektionen
mt-4       // Abstand zwischen Elementen
```

### KRITISCH: Konsistente Grid-Gaps
```tsx
// ❌ FALSCH: Unterschiedliche Gaps
<div className="grid gap-4">
  <div className="grid gap-6"> {/* Inkonsistent! */}
  </div>
</div>

// ✅ RICHTIG: Einheitliche Gaps
<div className="space-y-6"> {/* oder space-y-8 für große Sektionen */}
  <div className="grid gap-6">...</div>
  <div className="grid gap-6">...</div>
</div>
```

---

## 🎨 CARD-SYSTEM

### Standard Card-Struktur
```tsx
<Card>
  <CardHeader className="pb-3"> {/* Reduzierter Bottom-Padding */}
    <CardTitle>Titel</CardTitle>
    <CardDescription>Beschreibung</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4"> {/* Interne Abstände */}
    {/* Content */}
  </CardContent>
</Card>
```

### Card-Varianten
```tsx
// Volle Breite (Charts, Maps)
<Card>
  <CardHeader>...</CardHeader>
  <CardContent className="p-0"> {/* Kein Padding für Full-Width */}
    <div className="w-full h-[400px]">...</div>
  </CardContent>
</Card>

// Mit Footer
<Card>
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
  <CardFooter className="pt-4 border-t"> {/* Border oben */}
    {/* Buttons, Actions */}
  </CardFooter>
</Card>
```

---

## 📱 RESPONSIVE GRID-SYSTEM

### Dashboard-Layout (Standard)
```tsx
<div className="space-y-6 sm:space-y-8"> {/* Responsive Spacing */}
  {/* KPI Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    {/* 1 Spalte Mobile, 2 Tablet, 4 Desktop */}
  </div>
  
  {/* Widget Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* 1 Spalte Mobile/Tablet, 3 Desktop */}
  </div>
  
  {/* Map + Widgets */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2"> {/* Map: 2/3 */}
      {/* Map Component */}
    </div>
    <div className="space-y-6"> {/* Widgets: 1/3 */}
      {/* Weather, Traffic */}
    </div>
  </div>
</div>
```

### Responsive Breakpoints
```tsx
// Mobile First Approach
sm:  640px  // Small devices (Tablets)
md:  768px  // Medium devices
lg:  1024px // Large devices (Desktops)
xl:  1280px // Extra large devices
2xl: 1536px // Ultra wide screens

// Verwendung
className="
  text-sm sm:text-base lg:text-lg    // Responsive Text
  p-4 lg:p-6                          // Responsive Padding
  gap-4 lg:gap-6                      // Responsive Gaps
"
```

---

## 🎯 ALIGNMENT-SYSTEM

### Horizontal Alignment
```tsx
// Flex Container
<div className="flex items-center justify-between gap-4">
  {/* Perfekt zentriert vertikal, Abstand zwischen Elementen */}
</div>

// Grid Container
<div className="grid grid-cols-2 gap-4 items-start">
  {/* Items oben ausgerichtet */}
</div>
```

### Vertical Spacing
```tsx
// Space-Y (bevorzugt für vertikale Stacks)
<div className="space-y-4">
  <div>Element 1</div>
  <div>Element 2</div>
  {/* Automatischer Abstand zwischen Kindern */}
</div>

// Gap (für Grid/Flex)
<div className="flex flex-col gap-4">
  <div>Element 1</div>
  <div>Element 2</div>
</div>
```

---

## 🖼️ WIDGET-HEIGHTS

### Konsistente Höhen
```tsx
// Maps
h-[400px] sm:h-[500px] lg:h-[600px]  // Responsive Height

// Charts
h-[300px] sm:h-[350px] lg:h-[400px]

// Info Widgets (Weather, Traffic)
h-auto  // Content-based, aber mit min-h wenn nötig

// Loading States
h-[400px]  // Matches content height
```

### Aspect Ratios (Alternative)
```tsx
// Für responsive Verhältnisse
<div className="aspect-video">  {/* 16:9 */}
<div className="aspect-square"> {/* 1:1 */}
<div className="aspect-[4/3]">  {/* Custom */}
```

---

## 🎨 OVERLAY-SYSTEM (Maps, Charts)

### Standard Overlay Pattern
```tsx
<div className="relative">
  {/* Base Content - IMMER im DOM */}
  <div ref={contentRef} className="w-full h-[500px]" />
  
  {/* Loading Overlay */}
  {loading && (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="text-muted-foreground">Lädt...</p>
      </div>
    </div>
  )}
  
  {/* Error Overlay */}
  {error && (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <div>
          <p className="font-semibold mb-2">Nicht verfügbar</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
        <Button onClick={handleRetry} variant="outline" size="sm">
          Neu laden
        </Button>
      </div>
    </div>
  )}
</div>
```

---

## 📄 SEITEN-LAYOUT-STRUKTUR

### DashboardLayout Wrapper
```tsx
<DashboardLayout
  title="Dashboard"
  description="SEO Description"
  canonical="/"
>
  <div className="space-y-6 sm:space-y-8 overflow-x-hidden max-w-full">
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Header Content */}
    </div>
    
    {/* Content Sections */}
    <section className="grid ...">...</section>
    <section className="grid ...">...</section>
  </div>
</DashboardLayout>
```

### StandardPageLayout Wrapper
```tsx
<StandardPageLayout
  title="Seiten-Titel"
  description="SEO Description"
  canonical="/route"
  showBackButton={true}
>
  <div className="space-y-6">
    {/* Page Content */}
  </div>
</StandardPageLayout>
```

---

## 🎯 QUICK REFERENCE - Häufige Patterns

### Card Grid (Dashboard Widgets)
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### Two Column Layout (60/40)
```tsx
<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
  <div className="lg:col-span-3">{/* 60% */}</div>
  <div className="lg:col-span-2">{/* 40% */}</div>
</div>
```

### Stacked Content with Consistent Spacing
```tsx
<div className="space-y-6">
  <section>...</section>
  <section>...</section>
  <section>...</section>
</div>
```

---

## ✅ PRE-COMMIT CHECKLIST: Layout

- [ ] Alle Grid-Gaps konsistent (gap-4 oder gap-6)
- [ ] Space-Y für vertikale Stacks verwendet
- [ ] Cards haben pb-3 in Header, space-y-4 in Content
- [ ] Responsive Breakpoints korrekt (sm:, lg:)
- [ ] Keine ungewollten Lücken zwischen Sektionen
- [ ] Overlays haben absolute + inset-0
- [ ] Maps/Charts haben konsistente Heights
- [ ] overflow-x-hidden auf Container-Level
- [ ] max-w-full für Grid-Container

---

## 🔗 Verwandte Dokumentation

- `MASTER_PROMPT_V18.2.md` - Design-Freeze-Regeln
- `ICON_GUIDELINES.md` - Icon-Farben-System
- `HERE_MAPS_INTEGRATION_LESSONS_V18.3.md` - Map-Container Pattern
