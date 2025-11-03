# APP PAGE TEMPLATE V18.5.1

> **Version:** 18.5.1  
> **Letzte Aktualisierung:** 2025-10-23  
> **Status:** 🔴 SYSTEMWEIT VERPFLICHTEND  
> **Zweck:** Fahrer & Fahrzeuge als zentrale Design-Vorlage für ALLE internen App-Seiten

---

## 🎯 GRUNDPRINZIP

**Die Fahrer & Fahrzeuge-Seite (`/fahrer`) ist die MASTER-TEMPLATE für ALLE internen App-Seiten von MyDispatch.**

### Was bedeutet das?

Alle geschützten App-Seiten (Dashboard-Bereich) MÜSSEN:
- **1:1 identische Layout-Struktur** wie Fahrer & Fahrzeuge verwenden
- **Gleiches Tab-System** (vollfächig, keine Abrundungen an Verbindungen)
- **Gleiche KPI-Cards** (oben, responsive Grid)
- **Gleiche Search/Filter-Bar** verwenden
- **Gleiche Table-Komponenten** (mit Bulk-Select)
- **Gleiche Dialogs** (CRUD-Operationen)
- **Individuelle Hero-Grafik** (jede Seite eigenes kontextbezogenes Bild)

---

## 📁 BETROFFENE PAGES

### ✅ Verwenden App-Template (PFLICHT)

| Seite | Route | Status | Tab-System | Besonderheiten |
|-------|-------|--------|------------|----------------|
| **Fahrer & Fahrzeuge** | `/fahrer` | ✅ Master | Ja (2 Tabs) | Original-Template |
| **Aufträge** | `/auftraege` | 🔄 TODO | Ja (3 Tabs) | Aufträge/Angebote/Archiv |
| **Dashboard** | `/dashboard` | 🔄 TODO | Nein | KPI-Cards + Widgets |
| **Kunden** | `/kunden` | 🔄 TODO | Nein | Liste + Details |
| **Partner** | `/partner` | 🔄 TODO | Nein | Liste + Provisionen |
| **Rechnungen** | `/rechnungen` | 🔄 TODO | Ja (2 Tabs) | Rechnungen/Mahnungen |

### ❌ Verwenden NICHT App-Template

| Seite | Route | Grund |
|-------|-------|-------|
| **Home** | `/` | Public Marketing (anderes Template) |
| **Auth** | `/auth` | Login/Register (vereinfacht) |
| **Alle Marketing** | `/*` | Public Pages (HOME_DESIGN_TEMPLATE) |

---

## 🎨 LAYOUT-STRUKTUR (PFLICHT)

## 🖼️ HERO-BEREICHE (TAILWIND CSS - VERPFLICHTEND!)

**KRITISCH:** Alle Hero-Bereiche MÜSSEN als Tailwind CSS Designs erstellt werden!

### ✅ KORREKT: Tailwind CSS Hero-Bereich

```tsx
{/* Hero-Bereich - Tailwind CSS Design */}
<div className="relative w-full h-[200px] sm:h-[250px] lg:h-[300px] mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-secondary/30 shadow-lg">
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
    <div className="mb-4 p-6 rounded-full bg-foreground/10 backdrop-blur-sm">
      <Icon className="h-16 w-16 sm:h-20 sm:w-20 text-foreground" />
    </div>
    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
      [Seitenname]
    </h2>
    <p className="text-sm sm:text-base text-foreground/80 max-w-2xl">
      [Beschreibung]
    </p>
  </div>
  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
</div>
```

### ❌ FALSCH: JPG/PNG Bilder

```tsx
// ❌ NIEMALS Bilder für Hero-Bereiche verwenden
<img src={heroImage} alt="Hero" />
```

**Workflow bei neuer Seite:**
1. Icon aus Lucide React wählen (kontextbezogen)
2. Tailwind CSS Hero-Bereich wie oben kopieren
3. Icon, Titel und Beschreibung anpassen
4. NIEMALS JPG/PNG Bilder erstellen oder verwenden!

**Beispiele:**
- `/fahrer` → Icon: `Users`, Text: "Fahrer & Fahrzeuge"
- `/auftraege` → Icon: `FileText`, Text: "Aufträge"
- `/kunden` → Icon: `Users`, Text: "Kunden"
- `/dashboard` → Icon: `LayoutDashboard`, Text: "Dashboard"

---

## 🎨 GRAFIK-ANFORDERUNGEN

**KRITISCH:** Grafiken NUR für:
- **Logos** (PNG mit Transparenz)
- **Marketing-Fotos** (JPG, z.B. Team-Fotos, Produktbilder)
- **Screenshots** (PNG/JPG, z.B. Dashboard-Previews)
- **Icons** (SVG via Lucide React, NIEMALS als Dateien!)

**NIEMALS Grafiken für:**
- Hero-Bereiche (→ Tailwind CSS!)
- Hintergründe (→ Tailwind Gradienten!)
- Dekorative Elemente (→ Tailwind CSS!)
- Feature-Illustrationen (→ Lucide Icons + Tailwind!)

---

### 1. OVERALL STRUCTURE

```tsx
<StandardPageLayout
  title="Fahrer & Fahrzeuge"
  description="Verwalten Sie Ihre Fahrer und Fahrzeuge zentral"
  actions={[
    <Button onClick={...}>Fahrer hinzufügen</Button>
  ]}
>
  {/* 0. Hero-Grafik (individuell pro Seite) */}
  <div className="relative w-full h-[200px] sm:h-[250px] lg:h-[300px] mb-6 rounded-lg overflow-hidden">
    <img 
      src={heroImage} 
      alt="Fahrer & Fahrzeuge - MyDispatch Dashboard"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
  </div>

  {/* 1. KPI-Cards Section */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <KPICard title="..." value={123} icon={Icon} />
  </div>

  {/* 2. Search & Filter Bar */}
  <div className="flex flex-col sm:flex-row gap-4 mb-6">
    <SearchInput value={searchTerm} onChange={...} />
    <FilterToggle checked={showArchived} onChange={...} />
  </div>

  {/* 3. Tab-System (falls mehrere Bereiche) */}
  <Tabs value={currentTab} onValueChange={...}>
    <TabsList className="w-full">
      <TabsTrigger value="fahrer" className="flex-1">Fahrer</TabsTrigger>
      <TabsTrigger value="fahrzeuge" className="flex-1">Fahrzeuge</TabsTrigger>
    </TabsList>

    <TabsContent value="fahrer">
      {/* Table + BulkActionBar */}
    </TabsContent>

    <TabsContent value="fahrzeuge">
      {/* Table + BulkActionBar */}
    </TabsContent>
  </Tabs>
</StandardPageLayout>
```

---

## 🎨 TAB-SYSTEM (OPTIMIERT)

### Design-Specs (V18.5.1 - Vollfächig & Clean)

**KRITISCH:** Tabs MÜSSEN die gesamte verfügbare Breite ausfüllen und an Verbindungsstellen KEINE Abrundungen haben.

**CSS-Specs:**
```tsx
// TabsList
<TabsList className="
  w-full                    // Volle Breite
  flex                      // Flexbox
  bg-muted                  // Hintergrundfarbe
  p-0                       // KEIN Padding (Tabs füllen komplett aus)
  rounded-t-lg              // NUR oben abgerundet
  border-b                  // Border unten
  border-border             // Border-Farbe
">

// TabsTrigger
<TabsTrigger className="
  flex-1                    // Gleichmäßige Breite-Verteilung
  min-h-[44px]             // Touch-Target (Mobile)
  px-4 py-3                // Padding innen
  text-sm font-medium      // Typografie
  rounded-none             // KEINE Abrundungen (wichtig!)
  
  // Erste Tab: NUR links oben abgerundet
  first:rounded-tl-lg
  
  // Letzte Tab: NUR rechts oben abgerundet
  last:rounded-tr-lg
  
  // Aktiver State
  data-[state=active]:bg-background
  data-[state=active]:text-foreground
  data-[state=active]:border-b-2
  data-[state=active]:border-primary
  
  // Hover State (inaktive Tabs)
  data-[state=inactive]:hover:bg-muted/80
  data-[state=inactive]:hover:text-foreground
">
```

**Visualisierung:**
```
┌────────────────────┬────────────────────┐  ← TabsList (w-full, p-0)
│     Fahrer         │     Fahrzeuge      │  ← TabsTrigger (flex-1, rounded-none)
│  (rounded-tl-lg)   │  (rounded-tr-lg)   │
└────────────────────┴────────────────────┘
        ↑                    ↑
  Nur hier abgerundet    Nur hier abgerundet
  (erste Tab links)      (letzte Tab rechts)
```

**VERBOTEN:**
```tsx
// ❌ NIEMALS Abrundungen zwischen Tabs
"rounded-md"
"rounded-l-md rounded-r-md"
"[&:not(:first-child):not(:last-child)]:rounded-sm"

// ❌ NIEMALS feste Breiten
"w-[200px]"
"max-w-xs"

// ✅ IMMER flex-1 für gleichmäßige Verteilung
"flex-1"
```

---

## 🎨 KPI-CARDS (SYSTEMWEIT IDENTISCH)

**Specs:**
```tsx
<Card className="
  p-4 sm:p-6                    // Responsive Padding
  bg-card                       // Hintergrund
  border border-border          // Border
  shadow-sm hover:shadow-md     // Hover-Effect
  transition-all duration-200   // Animation
">
  <CardHeader className="pb-2">
    <div className="flex items-center justify-between">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
  </CardHeader>
  <CardContent>
    <div className="text-2xl sm:text-3xl font-bold text-foreground">
      {value}
    </div>
    <p className="text-xs text-muted-foreground mt-1">
      {description}
    </p>
  </CardContent>
</Card>
```

**Grid-Layout:**
```tsx
// Mobile (1 Spalte) → Tablet (2 Spalten) → Desktop (4 Spalten)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  <KPICard />
  <KPICard />
  <KPICard />
  <KPICard />
</div>
```

---

## 🎨 SEARCH & FILTER BAR (SYSTEMWEIT IDENTISCH)

**Specs:**
```tsx
<div className="
  flex flex-col sm:flex-row  // Mobile Stack, Desktop Row
  gap-4                      // Consistent Gap
  mb-6                       // Margin Bottom
  items-start sm:items-center // Alignment
">
  {/* Search Input */}
  <div className="relative flex-1 w-full">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Suchen..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10"
    />
  </div>

  {/* Filter Toggle */}
  <div className="flex items-center gap-2">
    <Switch
      checked={showArchived}
      onCheckedChange={setShowArchived}
      id="show-archived"
    />
    <Label htmlFor="show-archived" className="text-sm">
      Archivierte anzeigen
    </Label>
  </div>
</div>
```

---

## 🎨 TABLE-KOMPONENTEN (SYSTEMWEIT IDENTISCH)

**Basis-Struktur:**
```tsx
<div className="rounded-md border">
  <Table>
    <TableHeader>
      <TableRow>
        {/* Bulk-Select Checkbox (optional) */}
        <TableHead className="w-[50px]">
          <Checkbox
            checked={allSelected}
            onCheckedChange={onToggleSelectAll}
          />
        </TableHead>
        <TableHead>Spalte 1</TableHead>
        <TableHead>Spalte 2</TableHead>
        <TableHead className="text-right">Aktionen</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id}>
          <TableCell>
            <Checkbox
              checked={selectedIds.has(item.id)}
              onCheckedChange={() => onToggleSelection(item.id)}
            />
          </TableCell>
          <TableCell>{item.name}</TableCell>
          <TableCell>
            <StatusIndicator status={item.status} />
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
              <Edit className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>

{/* BulkActionBar (erscheint bei Auswahl) */}
<BulkActionBar
  selectedCount={selectedIds.size}
  onClearSelection={clearSelection}
  actions={[
    { label: 'Bearbeiten', icon: Edit, onClick: handleBulkEdit },
    { label: 'Archivieren', icon: Archive, onClick: handleBulkArchive, variant: 'destructive' },
  ]}
/>
```

---

## 🎨 DIALOGS (CRUD-OPERATIONEN)

**Specs:**
```tsx
<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent className="
    max-w-2xl              // Feste Breite Desktop
    max-h-[85vh]          // Max-Höhe für Mobile
    overflow-y-auto       // Scrollbar bei langem Content
  ">
    <DialogHeader>
      <DialogTitle>
        {editingItem ? 'Bearbeiten' : 'Neu anlegen'}
      </DialogTitle>
      <DialogDescription>
        Erfassen Sie die erforderlichen Daten
      </DialogDescription>
    </DialogHeader>

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Fields - Gruppiert in Sections */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Basis-Daten</h3>
        <Input ... />
        <Input ... />
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="text-sm font-semibold">Zusatz-Daten</h3>
        <Input ... />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
          Abbrechen
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Speichern
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>
```

---

## 🚫 VERBOTENE PATTERNS

### 1. TAB-SYSTEM VIOLATIONS

```tsx
// ❌ NIEMALS nicht-vollfächige Tabs
<TabsList className="inline-flex w-auto">

// ❌ NIEMALS feste Breiten
<TabsTrigger className="w-[200px]">

// ❌ NIEMALS Abrundungen zwischen Tabs
<TabsTrigger className="rounded-md">

// ✅ IMMER vollfächig mit flex-1
<TabsList className="w-full">
  <TabsTrigger className="flex-1 rounded-none first:rounded-tl-lg last:rounded-tr-lg">
```

---

### 2. LAYOUT VIOLATIONS

```tsx
// ❌ NIEMALS Custom-Layouts statt StandardPageLayout
<div className="container mx-auto">
  <h1>Titel</h1>
  {content}
</div>

// ✅ IMMER StandardPageLayout
<StandardPageLayout title="..." description="...">
  {content}
</StandardPageLayout>
```

---

### 3. KPI-CARD VIOLATIONS

```tsx
// ❌ NIEMALS Custom-Cards statt KPI-Pattern
<div className="bg-white p-4">
  <p>{value}</p>
</div>

// ✅ IMMER KPI-Card-Pattern
<Card>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">{value}</div>
  </CardContent>
</Card>
```

---

## ✅ IMPLEMENTATION WORKFLOW

### Neue interne App-Seite erstellen (Step-by-Step)

**1. Fahrer & Fahrzeuge als Basis kopieren**
```bash
cp src/pages/Fahrer.tsx src/pages/NeueSeite.tsx
```

**2. Struktur anpassen (NUR Inhalte ändern)**
```tsx
// ❌ NICHT Layout ändern
// ❌ NICHT neue Tab-Styles erstellen
// ❌ NICHT neue KPI-Card-Varianten erstellen

// ✅ NUR Inhalte ändern
const stats = [
  { title: "Neue Metrik", value: 123, icon: Icon },
  // ... angepasste Inhalte
];
```

**3. Tab-System anpassen (falls nötig)**
```tsx
<Tabs value={currentTab} onValueChange={...}>
  <TabsList className="w-full">
    <TabsTrigger value="tab1" className="flex-1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2" className="flex-1">Tab 2</TabsTrigger>
  </TabsList>

  <TabsContent value="tab1">
    {/* Inhalt Tab 1 */}
  </TabsContent>

  <TabsContent value="tab2">
    {/* Inhalt Tab 2 */}
  </TabsContent>
</Tabs>
```

**4. Route registrieren**
```tsx
// src/routes.config.tsx
{
  path: '/neue-seite',
  element: <ProtectedRoute><NeueSeite /></ProtectedRoute>,
  isPublic: false
}
```

---

## 📊 QUALITY CHECKLIST (PRE-DEPLOYMENT)

### Layout Compliance

```
[ ] Hero-Grafik vorhanden (hero-[seitenname].jpg)
[ ] Hero-Grafik optimiert (< 500KB, 1920x512px)
[ ] Hero-Grafik kontextbezogen (zeigt Seitenthema)
[ ] Hero-Grafik in CI-Farben (Beige #EADEBD, Blau #323D5E)
[ ] StandardPageLayout verwendet
[ ] KPI-Cards Grid (1/2/4 Spalten)
[ ] Search & Filter Bar vorhanden
[ ] Tab-System vollfächig (w-full)
[ ] Tab-Abrundungen nur außen (first/last)
[ ] Table mit Bulk-Select
[ ] BulkActionBar bei Auswahl
[ ] Dialog für CRUD
```

### Mobile-First Compliance

```
[ ] Hero-Grafik responsive (object-cover, auto-height)
[ ] Hero-Grafik lädt schnell (< 500KB optimiert)
[ ] Touch-Targets min-h-[44px]
[ ] Responsive Grid (1 → 2 → 4)
[ ] Mobile-Stack (flex-col sm:flex-row)
[ ] Tested auf 375px, 768px, 1920px
```

### Design-System Compliance

```
[ ] Semantic Tokens (keine direkten Farben)
[ ] Icon-Komponente (nicht Lucide direkt)
[ ] Button-System (nicht custom styles)
[ ] Spacing konsistent (gap-4, gap-6)
[ ] Hero-Grafik in CI-Farben (Beige/Blau)
```

---

## 🔗 VERKNÜPFTE DOKUMENTE

Diese Vorgaben basieren auf:
- `MASTER_INDEX_V18.5.1.md` - Zentrale Übersicht
- `DESIGN_SYSTEM_V18.5.0.md` - Design-Vorgaben
- `SYSTEM_DESIGN_PRINCIPLES_V18.5.0.md` - Zentralisierungs-Prinzipien
- `MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md` - Mobile-First Patterns
- `UI_LIBRARY_SYSTEM_V18.5.0.md` - UI-Komponenten

---

## 📈 SUCCESS METRICS

| Metrik | Zielwert | Prüfung |
|--------|----------|---------|
| Layout-Consistency | 100% | Visueller Check |
| Tab-System Compliance | 100% | Code Review |
| Mobile-First Compliance | 100% | Device Testing |
| Lighthouse Score | > 90 | Automated |
| Table-Performance < 1s | 100% | Performance Monitoring |

---

## 🚀 ROLLOUT-PLAN

### Phase 1: Basis-Templates (KW 43/2025)
- [x] Fahrer & Fahrzeuge (Master-Template)
- [ ] Aufträge (3 Tabs)
- [ ] Kunden (Liste + Details)

### Phase 2: Erweiterte Seiten (KW 44/2025)
- [ ] Partner (Provisionen)
- [ ] Rechnungen (2 Tabs)
- [ ] Statistiken (Dashboards)

### Phase 3: Optimierung (KW 45/2025)
- [ ] Performance-Optimierung
- [ ] A/B-Testing Setup
- [ ] Analytics Integration

---

**KRITISCH:** Diese Vorgaben sind SYSTEMWEIT und AUSNAHMSLOS zu befolgen. Jede Abweichung muss dokumentiert und genehmigt werden.

**Version:** 18.5.1  
**Datum:** 2025-10-23  
**Status:** 🔴 PRODUCTION-READY & VERPFLICHTEND
