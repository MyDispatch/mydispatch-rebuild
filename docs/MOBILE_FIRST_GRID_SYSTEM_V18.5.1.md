# MOBILE-FIRST GRID-SYSTEM V18.5.1

**Erstellt:** 23.10.2025 22:47 Uhr (DE)  
**Version:** 18.5.1 PRODUCTION-READY  
**Status:** 🟢 FINALISIERT & VERPFLICHTEND

---

## ⚠️ WICHTIG: LAYOUT FREEZE

**Einige Seiten sind vor Layout-Änderungen geschützt!**

📋 **Geschützte Seiten (siehe `LAYOUT_FREEZE_PROTECTION_V18.5.1.md`):**
- Dashboard (`src/pages/Index.tsx`)
- Aufträge (`src/pages/Auftraege.tsx`)

**Grid-System gilt nur für NEUE Seiten oder explizit freigegebene Änderungen!**

---

## 📊 EXECUTIVE SUMMARY

Dieses Dokument definiert **verbindliche Mobile-First Grid-Patterns** für ALLE Bereiche des MyDispatch-Systems. Keine Seite wird ohne diese Standards implementiert.

**Kernprinzip:** Mobile-First → Tablet → Desktop (Progressive Enhancement)

---

## 🎯 MOBILE-FIRST PHILOSOPHIE

### Prioritäten-Reihenfolge
```
1. Mobile (320px - 767px)   → MUST WORK PERFECT
2. Tablet (768px - 1023px)  → MUST WORK PERFECT  
3. Desktop (1024px+)        → ENHANCEMENT
```

### Breakpoints (Tailwind)
```css
/* Mobile-First Breakpoints */
sm:  640px   /* Small devices */
md:  768px   /* Tablets */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large Desktop */
2xl: 1536px  /* Extra Large */
```

---

## 🏗️ GRID-PATTERNS NACH BEREICH

### 1. MARKETING-SEITEN (Landing, Pricing, Docs, FAQ)

#### Pattern: HERO-GRID
```tsx
<section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-primary/10 to-background">
  <div className="container mx-auto px-4">
    <div className="text-center mb-8 sm:mb-10 md:mb-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-5 hero-text-no-hyphens px-2">
        Hero Title
      </h1>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-3 sm:mb-4 px-4">
        Hero Subtitle
      </p>
    </div>
  </div>
</section>
```

#### Pattern: TARIF-KARTEN-GRID (Pricing-Standard)
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 md:mb-20">
  {tariffs.map((tariff) => (
    <Card 
      key={tariff.id}
      className={cn(
        "relative flex flex-col",
        tariff.highlighted 
          ? "border-2 border-foreground shadow-xl" 
          : "border-2 border-border hover:border-foreground/50 transition-colors"
      )}
    >
      {/* Badge wenn highlighted */}
      {tariff.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-foreground text-primary">{tariff.badge}</Badge>
        </div>
      )}
      
      <CardHeader>
        <Badge className="w-fit mb-2 text-[10px] sm:text-xs" variant="outline">
          {tariff.name}
        </Badge>
        <CardTitle className="text-2xl sm:text-3xl">
          {tariff.priceFormatted}
        </CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {tariff.billingPeriod}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">
          {tariff.description}
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <ul className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
          {tariff.features.map((feature) => (
            <li key={feature.id} className="flex items-start gap-2">
              <Check className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 text-foreground shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm md:text-base">{feature.name}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto">
          <Button className="w-full min-h-[44px] text-sm sm:text-base">
            {tariff.ctaText}
          </Button>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

#### Pattern: FAQ-ACCORDION
```tsx
<Accordion type="single" collapsible className="max-w-3xl mx-auto">
  <AccordionItem value="item-1">
    <AccordionTrigger className="text-sm sm:text-base">
      Frage-Titel
    </AccordionTrigger>
    <AccordionContent className="text-xs sm:text-sm">
      Antwort-Text mit ausreichend Kontrast und Lesbarkeit
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

### 2. APP-BEREICHE (Dashboard, Aufträge, Kunden, etc.)

#### Pattern: DASHBOARD-GRID (KPIs, Widgets, Maps)
```tsx
import { DashboardGrid } from '@/components/design-system/DashboardGrid';

{/* KPI Cards - 4 Spalten Desktop, 2 Tablet, 1 Mobile */}
<DashboardGrid variant="kpis" gap="md">
  <KpiCard title="Aktive Aufträge" value={stats.active} />
  <KpiCard title="Erledigte Aufträge" value={stats.completed} />
  <KpiCard title="Umsatz heute" value={stats.revenue} />
  <KpiCard title="Online Fahrer" value={stats.drivers} />
</DashboardGrid>

{/* Widget Grid - 3 Spalten Desktop, 2 Tablet, 1 Mobile */}
<DashboardGrid variant="widgets" gap="lg" className="mt-6">
  <Card>Widget 1 Content</Card>
  <Card>Widget 2 Content</Card>
  <Card>Widget 3 Content</Card>
</DashboardGrid>

{/* Map + Sidebar - 2 Spalten Desktop, 1 Mobile */}
<DashboardGrid variant="cards" gap="md" className="mt-6">
  <Card className="lg:col-span-2">
    <LiveMap />
  </Card>
  <Card>
    <Sidebar />
  </Card>
</DashboardGrid>
```

#### Pattern: MOBILE-GRID-LAYOUT (MobileAuftraege, MobileKunden, etc.)
```tsx
import { MobileGridLayout } from '@/components/mobile/MobileGridLayout';

<MobileGridLayout
  searchPlaceholder="Aufträge suchen..."
  searchValue={searchQuery}
  onSearchChange={setSearchQuery}
  filters={filters}
  activeFilter={activeFilter}
  onFilterChange={setActiveFilter}
  resultCount={filteredData.length}
  entityName="Aufträge"
  isLoading={isLoading}
  emptyState={{
    icon: FileText,
    title: 'Keine Aufträge vorhanden',
    description: 'Erstellen Sie Ihren ersten Auftrag',
  }}
  onFabClick={() => setCreateDialogOpen(true)}
  fabIcon={Plus}
  fabLabel="Neuer Auftrag"
>
  {/* Card Content */}
  {filteredData.map((item) => (
    <Card 
      key={item.id}
      onClick={() => onItemClick(item)}
      className="cursor-pointer hover:shadow-md transition-shadow"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        {/* Item Details */}
      </CardContent>
    </Card>
  ))}
</MobileGridLayout>
```

---

### 3. TABELLEN (Desktop + Mobile)

#### Pattern: RESPONSIVE-TABLE
```tsx
{/* Desktop: Volle Tabelle */}
{isDesktop && (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Spalte 1</TableHead>
          <TableHead>Spalte 2</TableHead>
          <TableHead className="text-right">Aktionen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.col1}</TableCell>
            <TableCell>{row.col2}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)}

{/* Mobile: Card-basiert */}
{isMobile && (
  <div className="space-y-4">
    {data.map((row) => (
      <Card key={row.id}>
        <CardContent className="pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Spalte 1:</span>
              <span className="font-medium">{row.col1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Spalte 2:</span>
              <span className="font-medium">{row.col2}</span>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" className="flex-1">Bearbeiten</Button>
            <Button size="sm" variant="outline" className="flex-1">Löschen</Button>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)}
```

---

### 4. FORMULARE (Desktop + Mobile)

#### Pattern: FORM-GRID
```tsx
<form className="space-y-6">
  {/* 2-Spalten Desktop, 1-Spalte Mobile */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
    <div className="space-y-2">
      <Label htmlFor="field1">Feld 1</Label>
      <Input 
        id="field1" 
        className="h-11" 
        {...register('field1')}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="field2">Feld 2</Label>
      <Input 
        id="field2" 
        className="h-11" 
        {...register('field2')}
      />
    </div>
  </div>
  
  {/* Vollbreite Textarea */}
  <div className="space-y-2">
    <Label htmlFor="notes">Notizen</Label>
    <Textarea 
      id="notes" 
      rows={4}
      {...register('notes')}
    />
  </div>
  
  {/* Button Row - Responsive Spacing */}
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
    <Button 
      type="button" 
      variant="outline" 
      className="w-full sm:w-auto min-h-[44px]"
    >
      Abbrechen
    </Button>
    <Button 
      type="submit" 
      className="w-full sm:w-auto min-h-[44px]"
    >
      Speichern
    </Button>
  </div>
</form>
```

---

### 5. DIALOGS & MODALS

#### Pattern: RESPONSIVE-DIALOG
```tsx
import { DIALOG_LAYOUT } from '@/lib/constants';

<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className={cn(DIALOG_LAYOUT, "max-h-[90vh] overflow-y-auto")}>
    <DialogHeader>
      <DialogTitle className="text-lg sm:text-xl">
        Dialog Titel
      </DialogTitle>
      <DialogDescription className="text-sm sm:text-base">
        Dialog Beschreibung
      </DialogDescription>
    </DialogHeader>
    
    <div className="space-y-4 py-4">
      {/* Dialog Content - Mobile-optimiert */}
    </div>
    
    <DialogFooter className="flex-col sm:flex-row gap-3">
      <Button 
        variant="outline" 
        onClick={() => onOpenChange(false)}
        className="w-full sm:w-auto min-h-[44px]"
      >
        Abbrechen
      </Button>
      <Button 
        onClick={handleSubmit}
        className="w-full sm:w-auto min-h-[44px]"
      >
        Bestätigen
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**DIALOG_LAYOUT Konstante:**
```typescript
// src/lib/constants.ts
export const DIALOG_LAYOUT = "w-[95vw] max-w-[425px] sm:max-w-[600px] lg:max-w-[800px]";
```

---

## 🎨 SPACING-SYSTEM

### Container & Padding
```tsx
{/* Container mit responsive Padding */}
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>

{/* Section Spacing */}
<section className="py-12 sm:py-16 md:py-20">
  {/* Content */}
</section>

{/* Card Spacing */}
<Card className="p-4 sm:p-6 lg:p-8">
  {/* Content */}
</Card>
```

### Gap-System (Tailwind)
```css
gap-2    /* 8px  - Sehr eng */
gap-3    /* 12px - Standard für Filter */
gap-4    /* 16px - Standard für Cards */
gap-6    /* 24px - Standard für Sections */
gap-8    /* 32px - Große Abstände */
```

---

## 🎯 TOUCH-TARGET-STANDARDS

### Minimum Touch-Targets (Apple/Google Guidelines)
```css
min-h-[44px]  /* 44px = Minimum Touch-Target */
h-11          /* 44px - Standard für Buttons/Inputs */
h-14          /* 56px - Prominent Actions (FAB) */
```

### Button-Größen
```tsx
<Button size="sm" className="min-h-[44px]">Small</Button>  {/* Mobile-safe */}
<Button size="default" className="h-11">Default</Button>   {/* Standard */}
<Button size="lg" className="h-12">Large</Button>           {/* Prominent */}
```

---

## 📏 TYPOGRAPHY-SYSTEM

### Responsive Font-Sizes
```tsx
{/* Heading 1 */}
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  Main Title
</h1>

{/* Heading 2 */}
<h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
  Section Title
</h2>

{/* Heading 3 */}
<h3 className="text-lg sm:text-xl md:text-2xl font-semibold">
  Subsection Title
</h3>

{/* Body Text */}
<p className="text-sm sm:text-base md:text-lg">
  Body content
</p>

{/* Small Text */}
<p className="text-xs sm:text-sm">
  Small text / Captions
</p>
```

---

## 🚫 ANTI-PATTERNS (NIEMALS TUN!)

### ❌ Desktop-First Denken
```tsx
// ❌ FALSCH: Desktop als Basis
<div className="grid-cols-3 md:grid-cols-1">

// ✅ RICHTIG: Mobile als Basis
<div className="grid-cols-1 md:grid-cols-3">
```

### ❌ Feste Pixel-Werte
```tsx
// ❌ FALSCH: Feste Breiten
<div style={{ width: '400px' }}>

// ✅ RICHTIG: Relative Breiten
<div className="w-full max-w-md">
```

### ❌ Zu kleine Touch-Targets
```tsx
// ❌ FALSCH: Button zu klein
<Button size="sm" className="h-8">Click</Button>

// ✅ RICHTIG: Mindestens 44px
<Button size="sm" className="min-h-[44px]">Click</Button>
```

### ❌ Horizontales Scrollen ohne scrollbar-hide
```tsx
// ❌ FALSCH: Sichtbare Scrollbar
<div className="flex gap-2 overflow-x-auto">

// ✅ RICHTIG: Scrollbar ausblenden
<div className="flex gap-2 overflow-x-auto scrollbar-hide">
```

### ❌ Text-Overflow ohne Behandlung
```tsx
// ❌ FALSCH: Text bricht Layout
<span>{longText}</span>

// ✅ RICHTIG: Truncate oder Wrap
<span className="truncate">{longText}</span>
<span className="break-words">{longText}</span>
```

---

## ✅ IMPLEMENTIERUNGS-CHECKLISTE

### Vor Start einer neuen Seite:
- [ ] Mobile-First Grid-Pattern gewählt
- [ ] Touch-Targets ≥ 44px geplant
- [ ] Responsive Breakpoints definiert
- [ ] Spacing-System angewendet
- [ ] Typography-System verwendet
- [ ] Anti-Patterns vermieden

### Nach Implementierung:
- [ ] Mobile-Ansicht (375px, 414px) getestet
- [ ] Tablet-Ansicht (768px, 1024px) getestet
- [ ] Desktop-Ansicht (1920px) getestet
- [ ] Touch-Targets mit Finger getestet
- [ ] Alle Texte lesbar & kontrastreich
- [ ] Keine horizontalen Overflows

---

## 📊 GRID-PATTERN-MATRIX

| Bereich | Mobile | Tablet | Desktop | Pattern |
|---------|--------|--------|---------|---------|
| Hero | 1 col | 1 col | 1 col | HERO-GRID |
| Tarifkarten | 1 col | 2 col | 3 col | TARIF-KARTEN-GRID |
| Dashboard KPIs | 1 col | 2 col | 4 col | DASHBOARD-GRID |
| Dashboard Widgets | 1 col | 2 col | 3 col | DASHBOARD-GRID |
| Aufträge (Mobile) | 1 col | 1 col | - | MOBILE-GRID-LAYOUT |
| Tabellen (Desktop) | Cards | Cards | Table | RESPONSIVE-TABLE |
| Formulare | 1 col | 1 col | 2 col | FORM-GRID |
| Dialogs | 95vw | 600px | 800px | RESPONSIVE-DIALOG |

---

## 🔗 VERWANDTE DOKUMENTATIONEN

- **MOBILE_LAYOUT_STANDARDS_V18.3.md** - Mobile-Spacing & FAB-Position
- **MOBILE_GRID_SYSTEM_V18.3_FINAL.md** - MobileGridLayout Component
- **DESIGN_SYSTEM_VORGABEN_V18.3.md** - Spacing & Alignment System
- **MYDISPATCH_AI_AGENT_META_PROMPT_V18.5.1.md** - Meta-System Vorgaben

---

**Letzte Aktualisierung:** 23.10.2025 22:47 Uhr (DE)  
**Nächster Review:** Nach jeder neuen Mobile-Component-Implementation  
**Status:** 🟢 PRODUCTION-READY & VERPFLICHTEND
