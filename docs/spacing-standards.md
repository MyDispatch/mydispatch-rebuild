# Spacing Standards - V28.1 Design System

**Version:** 1.0  
**Datum:** 2025-11-09  
**Status:** ✅ Aktiv

---

## Spacing-Hierarchie

### Container-Spacing

```tsx
// Page-Container
<div className="container mx-auto py-8 space-y-8">
  {/* Content */}
</div>

// Section-Container
<section className="py-12 space-y-6">
  {/* Content */}
</section>
```

**Regeln:**
- `py-8` für Page-Container
- `py-12` für große Sections
- `space-y-8` für Page-Level-Spacing
- `space-y-6` für Section-Level-Spacing

---

### Grid-Spacing

```tsx
// Hauptgrid (KPI Cards, Features)
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// Subgrid (Listenelemente)
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Items */}
</div>

// Kompakte Grids (Icons, Badges)
<div className="flex gap-2">
  {/* Small Items */}
</div>
```

**Regeln:**
- `gap-6` für Hauptgrids (KPI Cards, Features)
- `gap-4` für Subgrids (Listenelemente)
- `gap-2` für kompakte Grids (Icons, Badges)

---

### Card-Spacing

```tsx
// Standard Card
<Card>
  <CardHeader className="pb-4">
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent className="p-6">
    {/* Content */}
  </CardContent>
</Card>

// Kompakte Card
<Card className="p-4">
  {/* Content */}
</Card>
```

**Regeln:**
- `p-6` für Standard-Card-Content
- `p-4` für kompakte Cards
- `pb-4` für CardHeader (wenn CardContent folgt)

---

### Margin-Spacing

```tsx
// Section-Margins
<div className="mb-6">
  {/* Section */}
</div>

// Item-Margins
<h4 className="mb-2">Title</h4>
<p className="mb-4">Paragraph</p>

// Icon-Margins
<Icon className="mb-4" />
```

**Regeln:**
- `mb-6` für Section-Margins (zwischen großen Blöcken)
- `mb-4` für Item-Margins (zwischen Paragraphen)
- `mb-2` für kleine Margins (zwischen Title und Subtitle)

---

### Space-Y/Space-X

```tsx
// Vertical Spacing (Listen)
<div className="space-y-4">
  {items.map(item => <Item key={item.id} />)}
</div>

// Horizontal Spacing (Buttons)
<div className="flex space-x-4">
  <Button />
  <Button />
</div>
```

**Regeln:**
- `space-y-4` für Listen-Items
- `space-y-2` für kompakte Listen
- `space-x-4` für Button-Gruppen
- `space-x-2` für Icon-Gruppen

---

## Responsive Spacing

### Mobile-First Approach

```tsx
// Responsive Padding
<div className="px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>

// Responsive Gaps
<div className="gap-4 md:gap-6">
  {/* Grid */}
</div>
```

**Regeln:**
- Mobile: `px-4`, `gap-4`
- Tablet: `sm:px-6`, `md:gap-6`
- Desktop: `lg:px-8`

---

## Anti-Patterns (❌ VERMEIDEN)

### Inkonsistente Gap-Werte
```tsx
// ❌ FALSCH
<div className="gap-3">  // Warum 3?
<div className="gap-5">  // Warum 5?

// ✅ RICHTIG
<div className="gap-6">  // Hauptgrid
<div className="gap-4">  // Subgrid
<div className="gap-2">  // Kompakt
```

### Inkonsistente Margins
```tsx
// ❌ FALSCH
<h4 className="mb-1">  // Zu klein
<h4 className="mb-3">  // Nicht im System
<h4 className="mb-5">  // Nicht im System

// ✅ RICHTIG
<h4 className="mb-2">  // Kleine Margin
<h4 className="mb-4">  // Standard-Margin
<h4 className="mb-6">  // Große Margin
```

### Inline-Padding statt Component
```tsx
// ❌ FALSCH
<button className="p-4">
  {/* Content */}
</button>

// ✅ RICHTIG
<V28Button size="lg">
  {/* Content */}
</V28Button>
```

---

## Spacing-Scale

**Tailwind-Scale (4px-Basis):**
- `2` = 8px (kompakt)
- `4` = 16px (standard)
- `6` = 24px (groß)
- `8` = 32px (sehr groß)
- `12` = 48px (section)

**Verwendung:**
- `gap-2`, `space-y-2`: Kompakte Elemente (Icons, Badges)
- `gap-4`, `space-y-4`: Standard-Elemente (Listen, Buttons)
- `gap-6`, `space-y-6`: Große Elemente (Cards, Sections)
- `gap-8`, `space-y-8`: Sehr große Elemente (Page-Sections)

---

## Checkliste für neue Components

- [ ] Verwendet `gap-6` für Hauptgrids
- [ ] Verwendet `gap-4` für Subgrids
- [ ] Verwendet `p-6` für Card-Content
- [ ] Verwendet `mb-6` für Section-Margins
- [ ] Verwendet `space-y-4` für Listen
- [ ] Keine Custom-Spacing-Werte (gap-3, gap-5, etc.)
- [ ] Responsive Breakpoints für Mobile

---

## Beispiel: Perfektes Dashboard-Layout

```tsx
<StandardPageLayout>
  {/* KPI Cards - gap-6 */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <StatCard />
    <StatCard />
    <StatCard />
  </div>

  {/* Quick Actions - gap-6, p-6 */}
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Schnellzugriff</CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard />
        <QuickActionCard />
        <QuickActionCard />
      </div>
    </CardContent>
  </Card>

  {/* Activity Feed - space-y-4 */}
  <Card>
    <CardHeader>
      <CardTitle>Aktivitäten</CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-4">
        <ActivityItem />
        <ActivityItem />
        <ActivityItem />
      </div>
    </CardContent>
  </Card>
</StandardPageLayout>
```

---

## Wartung

**Bei neuen Components:**
1. Prüfe Spacing-Standards
2. Verwende nur dokumentierte Werte
3. Teste auf allen Breakpoints
4. Update diese Dokumentation bei Änderungen

**Bei Refactoring:**
1. Suche nach Custom-Spacing (`gap-3`, `gap-5`, etc.)
2. Ersetze durch Standard-Werte
3. Teste visuell auf Regressions
4. Update Component-Dokumentation
