# 📋 VERWALTUNGS-SEITEN DESIGN-VORGABEN V18.3.26

**Status:** 🔴 KRITISCH - ZWINGEND EINZUHALTEN  
**Datum:** 2025-10-21  
**Version:** V18.3.26 FINAL  
**Gültigkeit:** Alle internen Verwaltungs-Seiten (Dashboard, Aufträge, Kunden, Fahrer, etc.)

---

## 🎯 ZWECK

Diese Design-Vorgaben definieren das **verbindliche Layout, Struktur und UX-Pattern** für alle internen Verwaltungs-Seiten im MyDispatch-System.

**Referenz-Implementierungen (EXAKT EINZUHALTEN):**

1. ✅ **`src/pages/Index.tsx`** - Dashboard (441 Zeilen)
2. ✅ **`src/pages/Auftraege.tsx`** - Aufträge (2167 Zeilen)

**Diese Seiten sind die MASTER-VORLAGEN für:**

- Layout-Struktur
- Design-Tokens
- Komponentennutzung
- Responsive Verhalten
- Touch-Targets
- Accessibility

---

## 📐 LAYOUT-STRUKTUR (MANDATORY)

### **1. Standard Page Layout**

**ALLE Verwaltungs-Seiten MÜSSEN `StandardPageLayout` verwenden:**

```tsx
import { StandardPageLayout } from "@/components/layout/StandardPageLayout";

export default function MeinePage() {
  return (
    <StandardPageLayout
      title="Seiten-Titel"
      description="SEO-Beschreibung für Suchmaschinen"
      canonical="/route"
      subtitle="Sichtbarer Untertitel"
      onCreateNew={() => setDialogOpen(true)}
      createButtonLabel="Neues Element"
      stats={statsArray}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Elemente durchsuchen..."
      cardTitle="Übersicht-Titel"
      cardIcon={<Icon className="h-5 w-5" />}
      filterComponents={<FilterComponents />}
      footerContent={<FooterInfo />}
    >
      {/* Page Content */}
    </StandardPageLayout>
  );
}
```

**Pflicht-Props:**

- `title` - Seiten-Titel (SEO)
- `description` - SEO-Beschreibung
- `canonical` - Canonical URL
- `subtitle` - Sichtbarer Untertitel unter Header

**Optional (aber empfohlen):**

- `onCreateNew` + `createButtonLabel` - Haupt-Aktion (z.B. "Auftrag anlegen")
- `stats` - KPI-Cards Array (max. 4)
- `searchValue` + `onSearchChange` - Suchfunktion
- `cardTitle` + `cardIcon` - Card-Header
- `filterComponents` - Filter-Elemente (Switches, Dropdowns)
- `footerContent` - Info-Box am Ende der Card

---

### **2. KPI-Cards (Statistics)**

**Format (max. 4 Cards):**

```tsx
const stats = [
  {
    label: "Gesamt",
    value: "1.234",
    icon: <FileText className="h-4 w-4" />,
    className: "text-foreground", // Optional
  },
  {
    label: "Aktiv",
    value: "856",
    icon: <CheckCircle className="h-4 w-4" />,
    className: "text-status-success",
  },
  {
    label: "Ausstehend",
    value: "42",
    icon: <Clock className="h-4 w-4" />,
    className: "text-status-warning",
  },
  {
    label: "Archiviert",
    value: "336",
    icon: <Archive className="h-4 w-4" />,
    className: "text-muted-foreground",
  },
];
```

**Regeln:**

- ✅ Icons: `h-4 w-4` (Standard)
- ✅ Farben: NUR `text-foreground`, `text-status-*`, `text-muted-foreground`
- ❌ NIEMALS: `text-accent`, `text-green-500`, etc.
- ✅ Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`

---

### **3. Search & Filter Bar**

**Search Bar (IMMER min-h-[44px]):**

```tsx
<StandardPageLayout
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  searchPlaceholder="Aufträge durchsuchen..."
>
```

**Filter Components:**

```tsx
<StandardPageLayout
  filterComponents={
    <div className="flex items-center gap-2">
      <Switch
        id="show-archived"
        checked={showArchived}
        onCheckedChange={setShowArchived}
      />
      <Label htmlFor="show-archived">Archivierte anzeigen</Label>
    </div>
  }
>
```

**Regeln:**

- ✅ Search Input: min-h-[44px]
- ✅ Filter Switches: min-h-[44px] Touch-Target
- ✅ Labels: mit `htmlFor` verbunden

---

### **4. Table Layout**

**Standard Table (Desktop):**

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Spalte 1</TableHead>
      <TableHead>Spalte 2</TableHead>
      <TableHead className="text-right">Aktionen</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell>{item.value}</TableCell>
        <TableCell className="text-right">
          <StandardActionButtons
            onViewDetails={() => handleView(item)}
            onEdit={() => handleEdit(item)}
            showViewDetails={true}
            showEdit={true}
            showArchive={false}
          />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**Mobile View:**

```tsx
if (isMobile) {
  return (
    <StandardPageLayout {...props}>
      <MobileGridLayout
        data={filteredData}
        renderCard={(item) => <Card>...</Card>}
        onItemClick={handleClick}
        entityLabel={{ singular: "Element", plural: "Elemente" }}
        fabLabel="Neues Element"
        onFabClick={onCreate}
        fabIcon={Plus}
      />
    </StandardPageLayout>
  );
}
```

---

### **5. Dialogs (ZWINGEND: DIALOG_LAYOUT)**

**❌ FALSCH (alt, unsicher):**

```tsx
<DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
  <DialogHeader>...</DialogHeader>
  <form>...</form>
</DialogContent>
```

**✅ RICHTIG (DIALOG_LAYOUT Utils):**

```tsx
import { DIALOG_LAYOUT } from "@/lib/utils/dialog-layout-utils";

<DialogContent className={DIALOG_LAYOUT.content}>
  <div className={DIALOG_LAYOUT.header}>
    <DialogHeader>
      <DialogTitle>Titel</DialogTitle>
      <DialogDescription>Beschreibung</DialogDescription>
    </DialogHeader>
  </div>

  <div className={DIALOG_LAYOUT.body}>
    <form id="my-form" onSubmit={handleSubmit}>
      {/* Form Content */}
    </form>
  </div>

  <div className={DIALOG_LAYOUT.footer}>
    <Button type="submit" form="my-form">
      Speichern
    </Button>
    <Button variant="outline" onClick={onClose}>
      Abbrechen
    </Button>
  </div>
</DialogContent>;
```

**KRITISCH:**

- ✅ IMMER `DIALOG_LAYOUT` verwenden
- ✅ Form mit `id` Attribut + `form` Prop auf Button
- ✅ Inputs: `min-h-[44px]`
- ✅ Buttons: `min-h-[44px]`

---

## 🎨 DESIGN-TOKENS (MANDATORY)

### **Farben (100% Semantic)**

| Verwendung           | Token                                    | Zweck                                  |
| -------------------- | ---------------------------------------- | -------------------------------------- |
| **Primary Button**   | `bg-primary text-primary-foreground`     | Haupt-Aktionen                         |
| **Secondary Button** | `bg-secondary text-secondary-foreground` | Sekundär-Aktionen                      |
| **Outline Button**   | `variant="outline"`                      | Tertiär-Aktionen                       |
| **Text (Primary)**   | `text-foreground`                        | Standard-Text                          |
| **Text (Secondary)** | `text-muted-foreground`                  | Sekundär-Text                          |
| **Background**       | `bg-background`                          | Page Background                        |
| **Card Background**  | `bg-card`                                | Card Background                        |
| **Muted Background** | `bg-muted`                               | Subtile Hintergründe                   |
| **Border**           | `border-border`                          | Standard Border                        |
| **Status Success**   | `text-status-success`                    | Erfolgs-Status (NUR für Badges/Status) |
| **Status Warning**   | `text-status-warning`                    | Warnung-Status (NUR für Badges/Status) |
| **Status Error**     | `text-destructive`                       | Fehler-Status (NUR für Badges/Status)  |

**❌ VERBOTEN:**

```tsx
// NIEMALS verwenden:
text-accent
bg-accent
text-white / bg-white
text-black / bg-black
text-green-500 / text-red-500 / etc.
text-status-* auf Icons (NUR auf Status-Badges!)
```

### **Icons (Mobile-First)**

| Context                | Mobile      | Tablet      | Desktop     |
| ---------------------- | ----------- | ----------- | ----------- |
| **Table Actions**      | `h-4 w-4`   | `h-4 w-4`   | `h-4 w-4`   |
| **Card Headers**       | `h-5 w-5`   | `h-5 w-5`   | `h-5 w-5`   |
| **Buttons (Standard)** | `h-4 w-4`   | `h-4 w-4`   | `h-4 w-4`   |
| **Buttons (Small)**    | `h-4 w-4`   | `h-4 w-4`   | `h-4 w-4`   |
| **Empty State**        | `h-16 w-16` | `h-16 w-16` | `h-16 w-16` |

**KRITISCH:**

- ❌ NIEMALS `h-3 w-3` (zu klein!)
- ✅ MINIMUM: `h-4 w-4` (16px)
- ✅ Icons IMMER mit `text-foreground` oder `text-muted-foreground`

### **Typography (Mobile-First)**

```tsx
// Body Text
text-sm  sm:text-base  md:text-lg

// Small Text
text-xs  sm:text-sm

// Card Title
text-base  sm:text-lg

// Page Title (in StandardPageLayout)
text-2xl  sm:text-3xl  md:text-4xl

// Section Heading
text-lg  sm:text-xl  md:text-2xl
```

### **Spacing (Mobile-First)**

```tsx
// Section Padding
p-4  sm:p-6  md:p-8

// Element Spacing
gap-2  sm:gap-3  md:gap-4

// Vertical Spacing
space-y-2  sm:space-y-3  md:space-y-4

// Grid Gaps
gap-4  sm:gap-6  md:gap-8
```

### **Touch-Targets (ABSOLUT)**

```tsx
// ALLE interaktiven Elemente MÜSSEN min. 44px hoch sein:

// Buttons
<Button className="min-h-[44px]">Aktion</Button>

// Inputs
<Input className="min-h-[44px]" />

// Textareas
<Textarea className="min-h-[44px]" />

// Icon-Only Buttons
<Button size="icon" className="min-h-[44px] min-w-[44px]">
  <Icon className="h-4 w-4" />
</Button>

// Links
<a className="min-h-[44px] inline-flex items-center">Link</a>
```

**❌ VERBOTEN:**

```tsx
<Button className="h-7">   // ❌ Zu klein!
<Input className="h-8">    // ❌ Zu klein!
```

---

## 🧩 KOMPONENTEN-NUTZUNG (MANDATORY)

### **Pflicht-Komponenten für alle Seiten**

| Komponente                | Verwendung       | Import                                      |
| ------------------------- | ---------------- | ------------------------------------------- |
| **StandardPageLayout**    | Page Wrapper     | `@/components/layout/StandardPageLayout`    |
| **StandardActionButtons** | Table Actions    | `@/components/shared/StandardActionButtons` |
| **StatusIndicator**       | Status-Anzeigen  | `@/components/shared/StatusIndicator`       |
| **EmptyState**            | Keine Daten      | `@/components/shared/EmptyState`            |
| **DetailDialog**          | Details anzeigen | `@/components/shared/DetailDialog`          |
| **MobileGridLayout**      | Mobile View      | `@/components/mobile/MobileGridLayout`      |

### **Standard Action Buttons (Desktop Tables)**

```tsx
import { StandardActionButtons } from "@/components/shared/StandardActionButtons";

<StandardActionButtons
  onViewDetails={() => handleView(item)}
  onEdit={() => handleEdit(item)}
  onArchive={() => handleArchive(item)}
  showViewDetails={true}
  showEdit={true}
  showArchive={item.active}
/>;
```

**Props:**

- `onViewDetails` - Details-Dialog öffnen
- `onEdit` - Edit-Dialog öffnen
- `onArchive` - Element deaktivieren
- `showViewDetails` - Zeige Details-Button
- `showEdit` - Zeige Edit-Button
- `showArchive` - Zeige Archivieren-Button

### **Status Indicator**

```tsx
import { StatusIndicator } from "@/components/shared/StatusIndicator";

<StatusIndicator
  type="success" // success, warning, error, neutral, info
  label="Aktiv"
  size="sm" // sm, md, lg
/>;
```

### **Empty State**

```tsx
import { EmptyState } from "@/components/shared/EmptyState";

<EmptyState
  icon={<FileText className="w-full h-full" />}
  title="Keine Aufträge gefunden"
  description="Erstellen Sie Ihren ersten Auftrag"
  actionLabel="Auftrag anlegen"
  onAction={() => setDialogOpen(true)}
  isSearchResult={false}
/>;
```

---

## 📱 RESPONSIVE VERHALTEN (MANDATORY)

### **Mobile Detection**

```tsx
import { useDeviceType } from "@/hooks/use-device-type";

const { isMobile, isTablet, isDesktop } = useDeviceType();

if (isMobile) {
  return <MobileView />;
}

return <DesktopView />;
```

### **Breakpoints**

```tsx
// Tailwind Breakpoints (Mobile-First)
sm:   640px   // Tablet Portrait
md:   768px   // Tablet Landscape
lg:   1024px  // Desktop
xl:   1280px  // Large Desktop
2xl:  1536px  // Wide Desktop
```

### **Grid Layouts**

```tsx
// KPI Cards
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

// Content Cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Table (Desktop only, Mobile → Cards)
{isMobile ? <MobileGridLayout /> : <Table />}
```

---

## 🚫 ANTI-PATTERNS (NIEMALS TUN)

### **❌ CODE-LEVEL VIOLATIONS**

```tsx
// ❌ VERBOTEN:
<Icon className="text-accent" />              // accent entfernt!
<Icon className="text-status-success" />      // NUR für Status-Badges!
<Icon className="h-3 w-3" />                  // Zu klein!
<Button className="h-7">                      // < 44px Touch-Target!
<Input className="bg-white" />                // Kein bg-white!
<div className="text-white">                  // Kein text-white!

// ✅ RICHTIG:
<Icon className="text-foreground h-4 w-4" />
<StatusIndicator type="success" label="Aktiv" />
<Icon className="h-4 w-4" />
<Button className="min-h-[44px]">
<Input className="bg-background" />
<div className="text-foreground">
```

### **❌ WORKFLOW-LEVEL VIOLATIONS**

```tsx
// ❌ VERBOTEN:
- StandardPageLayout NICHT verwenden
- DIALOG_LAYOUT NICHT verwenden
- Direct Colors (text-white, bg-black)
- Icons < h-4 w-4
- Touch-Targets < 44px
- Manuelle Dialog-Layouts
- Separator in Dialogs
- Inline Formatierung (Currency, Date)

// ✅ RICHTIG:
- IMMER StandardPageLayout
- IMMER DIALOG_LAYOUT
- NUR Semantic Tokens
- Icons MINIMUM h-4 w-4
- ALLE Touch-Targets min-h-[44px]
- DIALOG_LAYOUT Utils
- Keine Separators in Dialogs
- formatCurrency(), formatDate() verwenden
```

---

## ✅ QUALITÄTS-GATES (PRE-COMMIT)

### **Pflicht-Checks vor jedem Commit:**

- [ ] `StandardPageLayout` verwendet?
- [ ] Alle Icons ≥ `h-4 w-4`?
- [ ] Keine `text-accent` Referenzen?
- [ ] Keine `text-status-*` auf Icons?
- [ ] Alle Touch-Targets ≥ 44px?
- [ ] `DIALOG_LAYOUT` in allen Dialogs?
- [ ] Keine `<Separator />` in Dialogs?
- [ ] Mobile View implementiert?
- [ ] `formatCurrency()` / `formatDate()` verwendet?
- [ ] Alle Inputs mit `min-h-[44px]`?
- [ ] Dark/Light Mode getestet?
- [ ] Responsive getestet (320px, 768px, 1024px)?

---

## 📊 REFERENZ-IMPLEMENTIERUNGEN

### **1. Dashboard (Index.tsx) - 441 Zeilen**

**Struktur:**

```
┌─────────────────────────────────────────┐
│ DashboardLayout                         │
│ ├─ WelcomeWizard (Onboarding)          │
│ ├─ DashboardKPICards (4 Cards)         │
│ ├─ LiveInfoWidget (Wetter, Traffic)    │
│ ├─ UrgentActionsWidget                 │
│ ├─ ResourceStatusWidget                │
│ ├─ RevenueBreakdownWidget              │
│ ├─ PredictiveDemandWidget              │
│ ├─ HEREMapComponent                     │
│ └─ ActivityTimeline                    │
└─────────────────────────────────────────┘
```

**Key Features:**

- Realtime-Updates (useRealtimeBookings, etc.)
- Tarif-basierte Widgets (isBusinessTier)
- Mobile-optimiertes Layout
- Widget Error Boundaries
- Zentrale Formatierung (formatCurrency)

### **2. Aufträge (Auftraege.tsx) - 2167 Zeilen**

**Struktur:**

```
┌─────────────────────────────────────────┐
│ StandardPageLayout                      │
│ ├─ KPI Cards (4)                        │
│ ├─ Search Bar                           │
│ ├─ Filter (Archived Toggle)            │
│ ├─ Table (Desktop)                      │
│ │  ├─ StandardActionButtons            │
│ │  └─ StatusIndicator                  │
│ ├─ MobileGridLayout (Mobile)           │
│ ├─ Create/Edit Dialog (DIALOG_LAYOUT)  │
│ ├─ Detail Dialog (DetailDialog)        │
│ ├─ Partner Forward Dialog              │
│ └─ Inline Customer Form                │
└─────────────────────────────────────────┘
```

**Key Features:**

- Multi-Step Forms
- AI-powered Features (Smart Assignment)
- Inline Forms (Customer Creation)
- Complex Validation
- Partner Integration
- PBefG-Compliance Hints

---

## 🔄 MAINTENANCE & UPDATES

### **Bei neuen Features:**

1. ✅ Referenz-Seiten prüfen (Index.tsx, Auftraege.tsx)
2. ✅ Pattern übernehmen (Layout, Components, Tokens)
3. ✅ Quality Gates durchlaufen
4. ✅ Mobile View implementieren
5. ✅ Tests durchführen

### **Bei Design-Änderungen:**

**❌ NICHT ERLAUBT ohne Approval:**

- Layout-Struktur ändern
- Neue Farb-Tokens einführen
- Touch-Target-Größen reduzieren
- Dialog-Layout-System ändern

**✅ ERLAUBT:**

- Funktionale Erweiterungen
- Neue Komponenten (nach Pattern)
- Performance-Optimierungen
- Accessibility-Verbesserungen

---

## 📞 SUPPORT & ESKALATION

### **Bei Konflikten zwischen Vorgaben:**

**Hierarchie:**

1. KNOWLEDGE_V18.3.25.txt (Höchste Priorität)
2. VERWALTUNGS_SEITEN_DESIGN_VORGABEN_V18.3.26.md (Diese Datei)
3. MASTER_VORGABEN_CHECKLISTE_V18.3.24.md
4. META_GUIDELINES_V18.3.25.md
5. Spezifische Vorgaben (MOBILE_FIRST, LEGAL, etc.)

### **Bei unklaren Anforderungen:**

1. ✅ Referenz-Seiten konsultieren (Index.tsx, Auftraege.tsx)
2. ✅ Existing Patterns suchen (Search-Tool)
3. ✅ ERROR_DATABASE prüfen
4. ✅ Code-Kommentare lesen
5. 🔄 NUR DANN: User fragen

---

## 🎯 CHANGELOG

| Version      | Datum      | Änderungen                                                |
| ------------ | ---------- | --------------------------------------------------------- |
| **V18.3.26** | 2025-10-21 | Initial Release - Basierend auf Index.tsx & Auftraege.tsx |

---

**© 2025 MyDispatch - Design-System V18.3 - Alle Rechte vorbehalten**

**DIESE VORGABEN SIND BINDEND UND DÜRFEN NICHT OHNE APPROVAL GEÄNDERT WERDEN!**
