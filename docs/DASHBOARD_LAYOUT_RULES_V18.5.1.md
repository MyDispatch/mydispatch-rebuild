# DASHBOARD LAYOUT RULES V18.5.1

> **Version:** 18.5.1  
> **Status:** ✅ VERBINDLICH  
> **Zweck:** Konsistente Dashboard-Layouts ohne Überlappungen

---

## 🎯 ZIEL

Alle Dashboard-Seiten MÜSSEN einheitliche Layouts haben:

- ✅ Keine überlappenden Cards
- ✅ Gleiche Höhen in Zeilen
- ✅ Konsistente Abstände
- ✅ Mobile-First Responsive

---

## 📐 GRID-SYSTEM

### Desktop (lg+): 12-Spalten-Grid

```tsx
<div className="space-y-6 sm:space-y-8">
  {/* Section 1: KPI-Cards - 4 Spalten */}
  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
    <KPICard />
    <KPICard />
    <KPICard />
    <KPICard />
  </section>

  {/* Section 2: Main Content - 8/4 Split */}
  <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
    {/* Linke Spalte: 8 Spalten (66%) */}
    <div className="lg:col-span-8 space-y-4 lg:space-y-6">
      <Widget className="h-full" />
      <Widget className="h-full" />
    </div>

    {/* Rechte Spalte: 4 Spalten (33%) */}
    <div className="lg:col-span-4 space-y-4 lg:space-y-6">
      <Widget className="h-full" />
      <Widget className="h-full" />
    </div>
  </section>

  {/* Section 3: Full Width */}
  <section>
    <Widget className="w-full" />
  </section>
</div>
```

### Tablet (md): 2-Spalten-Grid

```tsx
<div className="space-y-4 md:space-y-6">
  <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
    <Widget />
    <Widget />
  </section>
</div>
```

### Mobile (< md): Single Column

```tsx
<div className="space-y-4">
  <Widget />
  <Widget />
  <Widget />
</div>
```

---

## 📦 CARD-HÖHEN

### REGEL: Gleiche Höhe in Zeile

**Verwende IMMER `h-full` für flexible Höhe:**

```tsx
// ✅ KORREKT: Flexible Höhe mit h-full
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <Card className="h-full">
    <CardHeader>...</CardHeader>
    <CardContent>...</CardContent>
  </Card>
  <Card className="h-full">
    <CardHeader>...</CardHeader>
    <CardContent>...</CardContent>
  </Card>
  <Card className="h-full">
    <CardHeader>...</CardHeader>
    <CardContent>...</CardContent>
  </Card>
</div>
```

**NIEMALS feste Höhen verwenden:**

```tsx
// ❌ FALSCH: Feste Höhen führen zu Überlappungen
<Card className="h-[400px]">
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>
```

**Ausnahmen: Charts mit aspect-ratio**

```tsx
// ✅ OK: aspect-ratio für Charts
<Card className="h-full">
  <CardHeader>...</CardHeader>
  <CardContent>
    <div className="aspect-video">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>...</AreaChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>
```

---

## 📏 SPACING-SYSTEM

### Standard-Abstände (Mobile-First):

```tsx
// Zwischen Sections
<div className="space-y-6 sm:space-y-8">

// Zwischen Cards in Grid
<div className="grid gap-4 lg:gap-6">

// Innerhalb Card (vertikal)
<CardContent className="space-y-4">

// Card-Padding
<Card className="p-4 lg:p-6">

// Header-Padding (kompakt)
<CardHeader className="pb-3">
```

### Responsive Spacing Table:

| Element               | Mobile      | Desktop        |
| --------------------- | ----------- | -------------- |
| Section Gap           | `space-y-6` | `sm:space-y-8` |
| Grid Gap              | `gap-4`     | `lg:gap-6`     |
| Card Content          | `space-y-3` | `space-y-4`    |
| Card Padding          | `p-4`       | `lg:p-6`       |
| Header Padding Bottom | `pb-3`      | `pb-3`         |

---

## 🧩 WIDGET-TEMPLATE

### Standard Widget Component:

```tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StandardWidgetProps {
  className?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function StandardWidget({ className, title, description, children }: StandardWidgetProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
```

### Nutzung:

```tsx
<StandardWidget title="Dringende Aktionen" description="Erfordert Ihre Aufmerksamkeit">
  <div className="space-y-3">{/* Widget-Inhalt */}</div>
</StandardWidget>
```

---

## 🔧 COMMON PATTERNS

### Pattern 1: KPI-Cards Row

```tsx
<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
  <KPICard
    title="Aufträge Heute"
    value={totalBookings}
    icon={<Icon name="Calendar" className="text-primary" />}
    className="h-full"
  />
  <KPICard
    title="Umsatz Heute"
    value={formatCurrency(totalRevenue)}
    icon={<Icon name="Euro" className="text-status-success" />}
    className="h-full"
  />
  {/* ... weitere KPIs */}
</section>
```

### Pattern 2: Main Content mit Sidebar

```tsx
<section className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
  {/* Main Content */}
  <div className="lg:col-span-8 space-y-4 lg:space-y-6">
    <LiveMap className="h-full" />
    <RecentActivity className="h-full" />
  </div>

  {/* Sidebar */}
  <div className="lg:col-span-4 space-y-4 lg:space-y-6">
    <QuickActions className="h-full" />
    <UrgentNotices className="h-full" />
    <WeatherWidget className="h-full" />
  </div>
</section>
```

### Pattern 3: Three Equal Columns

```tsx
<section className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
  <Widget className="h-full" />
  <Widget className="h-full" />
  <Widget className="h-full" />
</section>
```

---

## 🚨 COMMON ERRORS & FIXES

### Error 1: Cards überlappen sich

**Problem:**

```tsx
// ❌ FALSCH: Feste Höhen + mehr Inhalt = Überlappung
<Card className="h-[300px]">
  <CardContent>{/* Viel Inhalt, der nicht passt */}</CardContent>
</Card>
```

**Lösung:**

```tsx
// ✅ KORREKT: Flexible Höhe
<Card className="h-full">
  <CardContent>{/* Inhalt passt sich an */}</CardContent>
</Card>
```

### Error 2: Ungleiche Höhen in Zeile

**Problem:**

```tsx
// ❌ FALSCH: Keine h-full = unterschiedliche Höhen
<div className="grid grid-cols-3 gap-6">
  <Card>Short content</Card>
  <Card>Very long content that makes this card taller...</Card>
  <Card>Medium content</Card>
</div>
```

**Lösung:**

```tsx
// ✅ KORREKT: h-full für gleiche Höhen
<div className="grid grid-cols-3 gap-6">
  <Card className="h-full">Short content</Card>
  <Card className="h-full">Very long content...</Card>
  <Card className="h-full">Medium content</Card>
</div>
```

### Error 3: Inkonsistente Abstände

**Problem:**

```tsx
// ❌ FALSCH: Verschiedene Gaps
<div className="space-y-4">
  <Card />
</div>
<div className="space-y-6"> {/* Anderer Wert! */}
  <Card />
</div>
```

**Lösung:**

```tsx
// ✅ KORREKT: Konsistente Gaps
<div className="space-y-6 sm:space-y-8">
  <section>...</section>
  <section>...</section>
</div>
```

---

## 📱 MOBILE OPTIMIERUNG

### Breakpoints:

```tsx
// Standard Breakpoints (Tailwind)
sm: 640px   // Smartphone horizontal / Tablet vertical
md: 768px   // Tablet horizontal
lg: 1024px  // Desktop
xl: 1280px  // Large Desktop
2xl: 1536px // Extra Large Desktop
```

### Mobile-First Classes:

```tsx
// ✅ KORREKT: Mobile First
<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
  // Mobile: 1 Spalte, gap-4
  // Desktop: 4 Spalten, gap-6
</div>

// ❌ FALSCH: Desktop First
<div className="grid grid-cols-4 lg:grid-cols-1">
  // Schwer zu lesen, nicht Mobile-First
</div>
```

### Touch Targets (Mobile):

```tsx
// Buttons: Mindestens 44x44px
<Button size="lg" className="min-h-[44px] min-w-[44px]">
  Action
</Button>

// Icons in Buttons: Mindestens 20x20px
<Button>
  <Icon name="Plus" className="h-5 w-5 mr-2" />
  Neuer Auftrag
</Button>
```

---

## ✅ CHECKLISTE VOR COMMIT

### Layout:

- [ ] Alle Cards in Zeile haben `h-full`
- [ ] Keine festen Höhen (außer Charts mit aspect-ratio)
- [ ] Konsistente Gaps (`gap-4 lg:gap-6`)
- [ ] Konsistente Sections Spacing (`space-y-6 sm:space-y-8`)

### Mobile:

- [ ] Mobile-First Classes verwendet
- [ ] Touch-Targets ≥ 44px
- [ ] Grid-Cols: `grid-cols-1` als Basis
- [ ] Auf Mobile (375px) getestet

### Content:

- [ ] Keine Überlappungen
- [ ] Content scrollt bei Bedarf (`overflow-y-auto`)
- [ ] Keine horizontalen Scrollbars

---

## 📚 REFERENZEN

- `DESIGN_SYSTEM_VORGABEN_V18.3.md` - Spacing System
- `DASHBOARD_DESIGN_VORGABEN.md` - Card Standards
- `DEFENSIVE_CODING_STANDARDS.md` - Mobile Development
- `src/pages/Index.tsx` - Dashboard Reference Implementation

---

**Next Steps:**

1. Apply to all Dashboard pages
2. Create UI Library Components
3. Set up Visual Regression Tests
