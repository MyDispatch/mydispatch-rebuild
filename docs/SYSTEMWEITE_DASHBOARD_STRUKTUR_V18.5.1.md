# SYSTEMWEITE DASHBOARD-STRUKTUR V18.5.1

**Erstellt:** 23.10.2025 23:15 Uhr (DE)  
**Version:** 18.5.1 PRODUCTION-READY  
**Status:** 🟢 FINALISIERT & VERPFLICHTEND

---

## 📊 EXECUTIVE SUMMARY

Dieses Dokument definiert die **VERPFLICHTENDE** Struktur für ALLE Dashboard-Seiten (Aufträge, Kunden, Fahrer, Fahrzeuge, Rechnungen, etc.).

**Ziel:** 100% konsistente Benutzererfahrung durch identische Seitenstrukturen.

**Kernprinzip:** Jede Dashboard-Seite folgt EXAKT der gleichen Struktur - keine Ausnahmen!

---

## 🎯 PFLICHT-STRUKTUR FÜR ALLE DASHBOARD-SEITEN

### Layout-Reihenfolge (TOP → BOTTOM)

```
1. Breadcrumbs (automatisch via DashboardLayout)
2. Hero-Bereich (Tailwind CSS Gradient + Icon)
3. Seitentitel + Beschreibung
4. Suche + "Archivierte anzeigen" Toggle
5. 3 KPI-Cards + Schnellzugriff (4-Spalten-Grid)
6. Button-Liste / Tab-Navigation
7. Listenansicht (StandardTableTemplate)
8. Details-Dialog (EnhancedDetailDialog)
```

---

## 🏗️ KOMPONENTEN-STRUKTUR

### 1. ZENTRALES LAYOUT (DashboardLayout)

**Datei:** `src/components/layout/DashboardLayout.tsx`

```tsx
import { DashboardLayout } from "@/components/layout/DashboardLayout";

<DashboardLayout
  title="Seiten-Titel (z.B. Kunden)"
  description="SEO-optimierte Beschreibung"
  canonical="/pfad"
>
  {/* Seiteninhalt */}
</DashboardLayout>;
```

**WICHTIG:**

- DashboardLayout ist PFLICHT für alle Dashboard-Seiten
- Breadcrumbs werden automatisch integriert
- SEO-Optimierung via SEOHead Component

---

### 2. HERO-BEREICH (Tailwind CSS - KEINE JPGs!)

**Verpflichtend auf JEDER Dashboard-Seite:**

```tsx
<div className="relative w-full h-[200px] sm:h-[250px] lg:h-[300px] mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-secondary/30 shadow-lg">
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
    <div className="mb-4 p-6 rounded-full bg-foreground/10 backdrop-blur-sm">
      <SeitenIcon className="h-16 w-16 sm:h-20 sm:w-20 text-foreground" />
    </div>
    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">Seitentitel</h2>
    <p className="text-sm sm:text-base text-foreground/80 max-w-2xl">
      Kurze Beschreibung der Seite
    </p>
  </div>
  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
</div>
```

**Icons nach Seite:**

- Kunden: `Users`
- Aufträge: `FileText`
- Fahrer: `Users`
- Fahrzeuge: `Car`
- Rechnungen: `Receipt`

---

### 3. SEITENKOPF (Titel + Beschreibung + Suche)

**Struktur:**

```tsx
<div className="mb-6">
  {/* Titel */}
  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Seitentitel</h1>

  {/* Beschreibung */}
  <p className="text-sm sm:text-base text-muted-foreground mb-4">Kurzbeschreibung der Seite</p>

  {/* Suche + Archivierte Toggle */}
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
    <div className="flex-1">
      <Input
        placeholder="Durchsuchen..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="h-11"
      />
    </div>
    <div className="flex items-center gap-2">
      <Switch id="show-archived" checked={showArchived} onCheckedChange={setShowArchived} />
      <Label htmlFor="show-archived" className="text-sm cursor-pointer">
        Archivierte anzeigen
      </Label>
    </div>
  </div>
</div>
```

---

### 4. KPI-HEADER (3 KPIs + Schnellzugriff)

**Component:** `PageHeaderWithKPIs`

**VERPFLICHTEND:** Genau 3 KPIs + Schnellzugriff auf JEDER Seite!

```tsx
import { PageHeaderWithKPIs } from "@/components/shared/PageHeaderWithKPIs";
import { MetricCard } from "@/components/dashboard/MetricCard";

<PageHeaderWithKPIs
  kpis={[
    {
      title: "KPI 1 Titel",
      value: stats.value1,
      icon: IconComponent1,
      trend: { value: 12, label: "+12% ggü. Vormonat" },
    },
    {
      title: "KPI 2 Titel",
      value: stats.value2,
      icon: IconComponent2,
    },
    {
      title: "KPI 3 Titel",
      value: stats.value3,
      icon: IconComponent3,
    },
  ]}
  quickActions={[
    {
      label: "Hauptaktion",
      icon: Plus,
      onClick: () => setDialogOpen(true),
      variant: "default",
    },
    {
      label: "Exportieren",
      icon: Download,
      onClick: handleExport,
      variant: "outline",
    },
  ]}
  quickAccessTitle="Schnellzugriff"
/>;
```

**Grid-Layout:**

- Desktop: 4 Spalten (`grid-cols-4`)
- Tablet: 2 Spalten (`grid-cols-2`)
- Mobile: 1 Spalte (`grid-cols-1`)

---

### 5. BUTTON-LISTE / TAB-NAVIGATION

#### A) SOLO-LÖSUNG (z.B. Kunden)

**Eine Kategorie auf der Seite → Button mittig zentriert**

```tsx
<div className="flex justify-center mb-6">
  <Button onClick={() => setDialogOpen(true)} className="min-h-[44px]">
    <Plus className="h-4 w-4 mr-2" />
    Kunde hinzufügen
  </Button>
</div>
```

#### B) MULTI-KATEGORIE (z.B. Fahrer & Fahrzeuge)

**Mehrere Kategorien → Tab-Navigation**

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
  <TabsList className="grid w-full grid-cols-2 gap-2">
    <TabsTrigger value="kategorie1" className="flex items-center gap-2">
      <Icon1 className="h-4 w-4" />
      Kategorie 1 ({count1})
    </TabsTrigger>
    <TabsTrigger value="kategorie2" className="flex items-center gap-2">
      <Icon2 className="h-4 w-4" />
      Kategorie 2 ({count2})
    </TabsTrigger>
  </TabsList>

  <TabsContent value="kategorie1">{/* Tabelle 1 */}</TabsContent>

  <TabsContent value="kategorie2">{/* Tabelle 2 */}</TabsContent>
</Tabs>
```

**WICHTIG:** `gap-2` in `TabsList` für Hover-Spacing!

---

### 6. LISTENANSICHT (StandardTableTemplate)

**Component:** `StandardTableTemplate`

**VERPFLICHTEND auf ALLEN Seiten:**

```tsx
import { StandardTableTemplate, TableColumn } from "@/components/templates/StandardTableTemplate";

const columns: TableColumn<EntityType>[] = [
  {
    key: "field1",
    header: "Spalte 1",
    render: (item) => <span className="font-medium">{item.field1}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (item) => <StatusIndicator type={getStatusType(item.status)} label={item.status} />,
    className: "w-[120px]",
  },
  // ... weitere Spalten
];

<StandardTableTemplate
  data={filteredData}
  columns={columns}
  onViewDetails={(item) => {
    setSelectedItem(item);
    setDetailDialogOpen(true);
  }}
  selectedIds={bulkSelection.selectedIds}
  onToggleSelection={bulkSelection.toggleSelection}
  onToggleSelectAll={() => bulkSelection.toggleSelectAll(filteredData)}
  showBulkSelect={true}
  showCreatedAt={true}
  emptyTitle="Keine Einträge vorhanden"
  emptyDescription="Erstellen Sie Ihren ersten Eintrag"
/>;
```

**Features:**

- ✅ Nur EIN Details-Button am Seitenende (Eye-Icon)
- ✅ Bulk-Selection Support
- ✅ Rechtlich erforderlicher Zeitstempel (created_at)
- ✅ Mobile-optimiert (Card-View)
- ✅ Empty State Integration

---

### 7. DETAILS-DIALOG (EnhancedDetailDialog)

**Component:** `EnhancedDetailDialog`

**VERPFLICHTEND:** Alle Aktionen NUR im Dialog!

```tsx
import {
  EnhancedDetailDialog,
  createEntityActions,
} from "@/components/templates/EnhancedDetailDialog";

<EnhancedDetailDialog
  open={detailDialogOpen}
  onOpenChange={setDetailDialogOpen}
  title="Entity-Details"
  createdAt={selectedItem?.created_at}
  actions={createEntityActions(selectedItem?.id, handleEdit, handlePDF, handleEmail, handleArchive)}
  relatedEntities={
    <>
      <RelatedEntityCard
        icon={User}
        label="Verknüpfte Entity"
        value={relatedEntity.name}
        onClick={() => navigate(`/path/${relatedEntity.id}`)}
      />
    </>
  }
>
  {/* Detail-Content */}
  <div className="space-y-4">
    <FieldRow label="Feld 1" value={selectedItem?.field1} />
    <FieldRow label="Feld 2" value={selectedItem?.field2} />
    {/* ... weitere Felder */}
  </div>
</EnhancedDetailDialog>;
```

**Actions im Dialog:**

- ✅ Bearbeiten
- ✅ PDF herunterladen
- ✅ E-Mail senden
- ✅ Archivieren (mit Bestätigung)

---

## 🚦 AMPELSYSTEM (StatusIndicator)

**Component:** `StatusIndicator`

**VERPFLICHTEND:** Für alle Status-Anzeigen verwenden!

```tsx
import { StatusIndicator, getBookingStatusType } from "@/components/shared/StatusIndicator";

<StatusIndicator type={getBookingStatusType(booking.status)} label={booking.status} />;
```

**Status-Typen:**

- `success`: Grün (erfolgreich, aktiv, bezahlt)
- `warning`: Gelb (ausstehend, in Bearbeitung)
- `error`: Rot (überfällig, abgebrochen, inaktiv)
- `neutral`: Grau (archiviert, unbekannt)

**Helper-Funktionen:**

- `getBookingStatusType(status)` - Für Auftrags-Status
- `getPaymentStatusType(status)` - Für Zahlungs-Status
- `getDriverStatusType(status)` - Für Fahrer-Status

---

## 🎨 ZENTRALE KOMPONENTEN (Header, Footer, Sidebar)

### Header

**Datei:** `src/components/layout/Header.tsx`

**WICHTIG:**

- NIEMALS direkt in Seiten integrieren
- Wird automatisch via `MainLayout` geladen
- Logo MUSS zur jeweiligen Startseite verlinken
- Domain: `my-dispatch.de` (NICHT mydispatch.de)

### Footer

**Datei:** `src/components/layout/Footer.tsx`

**WICHTIG:**

- Automatisch via `MainLayout`
- Pflicht-Links: Impressum, Datenschutz, AGB
- Gleiche Gestaltung auf ALLEN Seiten

### Sidebar

**Datei:** `src/components/layout/Sidebar.tsx`

**WICHTIG:**

- Automatisch via `MainLayout`
- Menü-Belegung pro Seite korrekt
- Aktive Route hervorheben

---

## 📱 MOBILE-OPTIMIERUNG

### Mobile-Override

**VERPFLICHTEND:** Separate Mobile-Components verwenden!

```tsx
import { useDeviceType } from "@/hooks/use-device-type";
import { MobileKunden } from "@/components/mobile/MobileKunden";

const { isMobile } = useDeviceType();

if (isMobile) {
  return <MobileKunden />;
}

// Desktop-Layout
return <DashboardLayout>{/* Desktop-Content */}</DashboardLayout>;
```

**Mobile-Components:**

- `MobileAuftraege` (Aufträge)
- `MobileKunden` (Kunden)
- `MobileFahrer` (Fahrer)
- `MobileFahrzeuge` (Fahrzeuge)
- `MobileRechnungen` (Rechnungen)

---

## 🔒 RECHTLICHE COMPLIANCE

### 1. DSGVO-Hinweis (bei Formularen)

```tsx
<div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
  <p>
    🔒 Ihre Daten werden verschlüsselt übertragen und gemäß
    <Link to="/datenschutz" className="text-primary hover:underline ml-1">
      Datenschutzerklärung
    </Link>{" "}
    verarbeitet.
  </p>
</div>
```

### 2. Zeitstempel (PBefG § 51)

**VERPFLICHTEND:** Bei Aufträgen und Rechnungen 10 Jahre aufbewahren!

```tsx
<StandardTableTemplate
  showCreatedAt={true} // ✅ IMMER aktiviert bei Aufträgen/Rechnungen
  // ...
/>
```

### 3. Footer-Links

**VERPFLICHTEND auf JEDER Seite:**

```tsx
<footer className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
  <p>
    <Link to="/impressum" className="hover:text-foreground">
      Impressum
    </Link>
    {" • "}
    <Link to="/datenschutz" className="hover:text-foreground">
      Datenschutz
    </Link>
    {" • "}
    <Link to="/agb" className="hover:text-foreground">
      AGB
    </Link>
  </p>
</footer>
```

---

---

## ✅ DESIGN-VORGABEN

### Spacing & Alignment

- **Grid-Gap:** `gap-3` (Standard für alle Grids)
- **Card-Padding:** `p-4` (Header), `p-6` (Content)
- **Section-Spacing:** `space-y-4` (Vertikal)
- **Responsive:** Mobile-First (`sm:`, `md:`, `lg:`)

### Rundungen bei angrenzenden Elementen

- **VERPFLICHTEND:** Wo Elemente zusammentreffen (z.B. gestapelte Buttons), KEINE Rundungen an angrenzenden Kanten
- **Implementierung:** `rounded-none first:rounded-t-lg last:rounded-b-lg`
- **Anwendung:** Button-Listen, Tab-Navigation, gestapelte Cards
- **Beispiel:** Schnellzugriff-Buttons in `PageHeaderWithKPIs`

```tsx
// ✅ KORREKT - Erste/Letzte gerundet, angrenzende Kanten gerade
<div className="space-y-0">
  {actions.map((action, i) => (
    <Button
      key={i}
      className="rounded-none first:rounded-t-lg last:rounded-b-lg"
    />
  ))}
</div>

// ❌ FALSCH - Alle voll gerundet mit Abstand
<div className="space-y-2">
  {actions.map((action, i) => (
    <Button key={i} className="rounded-lg" />
  ))}
</div>
```

### Farben & CI

- **NIEMALS** direkte Farben (`text-white`, `bg-[#fff]`)
- **IMMER** Semantic Tokens (`text-foreground`, `bg-primary`)

---

## ✅ PRE-IMPLEMENTATION CHECKLIST

### Vor Erstellung JEDER neuen Dashboard-Seite:

#### Struktur

- [ ] DashboardLayout verwendet?
- [ ] Hero-Bereich (Tailwind CSS) integriert?
- [ ] Seitentitel + Beschreibung vorhanden?
- [ ] Suche + "Archivierte anzeigen" Toggle?
- [ ] 3 KPIs + Schnellzugriff (PageHeaderWithKPIs)?
- [ ] Button-Liste / Tab-Navigation korrekt?
- [ ] StandardTableTemplate verwendet?
- [ ] EnhancedDetailDialog verwendet?

#### Mobile

- [ ] Mobile-Component erstellt?
- [ ] useDeviceType Hook verwendet?
- [ ] Touch-Targets ≥ 44px?
- [ ] Responsive Grid (grid-cols-1 sm:2 lg:4)?

#### Rechtlich

- [ ] DSGVO-Hinweis bei Formularen?
- [ ] Zeitstempel bei Aufträgen/Rechnungen?
- [ ] Footer-Links (Impressum/Datenschutz/AGB)?

#### Design-System

- [ ] CI-Farben (semantic tokens)?
- [ ] Ampelsystem (StatusIndicator)?
- [ ] Icons via lucide-react?
- [ ] Spacing-System (gap-2, gap-4, gap-6)?

---

## 🚫 ANTI-PATTERNS (VERBOTEN!)

### ❌ Unterschiedliche Seitenstrukturen

```tsx
// ❌ FALSCH: Jede Seite anders aufgebaut
<div className="p-6">
  <h1>Titel</h1>
  <CustomTable />
</div>

// ✅ RICHTIG: Einheitliche Struktur
<DashboardLayout>
  <Hero />
  <PageHeaderWithKPIs />
  <StandardTableTemplate />
</DashboardLayout>
```

### ❌ Fehlende KPIs

```tsx
// ❌ FALSCH: Nur 2 KPIs oder keine
<div className="grid grid-cols-2">
  <KPI1 />
  <KPI2 />
</div>

// ✅ RICHTIG: IMMER 3 KPIs + Schnellzugriff
<PageHeaderWithKPIs
  kpis={[kpi1, kpi2, kpi3]}
  quickActions={[action1, action2]}
/>
```

### ❌ Hero-Grafiken als JPG

```tsx
// ❌ FALSCH: Hero als JPG-Datei
<img src="/hero-image.jpg" alt="Hero" />

// ✅ RICHTIG: Hero als Tailwind CSS Gradient
<div className="bg-gradient-to-br from-primary via-primary/80 to-secondary/30">
  <Icon className="h-16 w-16 text-foreground" />
</div>
```

### ❌ Action-Buttons in Tabelle

```tsx
// ❌ FALSCH: Bearbeiten/Löschen in Tabelle
<TableCell>
  <Button onClick={handleEdit}>Bearbeiten</Button>
  <Button onClick={handleDelete}>Löschen</Button>
</TableCell>

// ✅ RICHTIG: Nur Details-Button, Rest im Dialog
<TableCell>
  <Button onClick={handleViewDetails}>
    <Eye className="h-4 w-4" />
  </Button>
</TableCell>
```

### ❌ Verschiedene Header/Footer

```tsx
// ❌ FALSCH: Custom Header auf jeder Seite
<CustomHeader />

// ✅ RICHTIG: Zentraler Header via MainLayout
// Wird automatisch geladen, NICHT manuell einbinden!
```

---

## 📋 SEITEN-MATRIX

### Übersicht aller Dashboard-Seiten

| Seite             | Solo/Multi | KPI 1  | KPI 2         | KPI 3             | Schnellzugriff                 |
| ----------------- | ---------- | ------ | ------------- | ----------------- | ------------------------------ |
| **Kunden**        | Solo       | Gesamt | Portal-Zugang | Offene Rechnungen | Kunde anlegen, Export          |
| **Aufträge**      | Solo       | Offen  | Heute         | Umsatz Monat      | Auftrag anlegen, Export        |
| **Fahrer**        | Multi      | Gesamt | Aktiv         | Inaktiv           | Fahrer anlegen, Schichtplan    |
| **Fahrzeuge**     | Multi      | Gesamt | Verfügbar     | In Wartung        | Fahrzeug anlegen, Wartungsplan |
| **Rechnungen**    | Solo       | Offen  | Überfällig    | Umsatz Monat      | Rechnung erstellen, Export     |
| **Partner**       | Solo       | Gesamt | Aktive        | Provision Monat   | Partner anlegen, Export        |
| **Kostenstellen** | Solo       | Gesamt | Aktive        | Ausgaben Monat    | Kostenstelle anlegen, Export   |
| **Dokumente**     | Multi      | Gesamt | Fahrer-Docs   | Fahrzeug-Docs     | Dokument hochladen, Export     |

---

## 🔗 VERWANDTE DOKUMENTATIONEN

- **TEMPLATE_SYSTEM_V18.3.md** - StandardTableTemplate, EnhancedDetailDialog
- **MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md** - Grid-Patterns, Responsive Design
- **RECHTLICHE_COMPLIANCE_VORGABEN_V18.5.1.md** - DSGVO, AI Act, TMG
- **SEITEN_PLANUNGSPROZESS_V18.5.1.md** - Workflow für neue Seiten
- **PAGE_HEADER_VERPFLICHTEND_V18.3.24.md** - KPI-Header Details
- **UI_LIBRARY_SYSTEM_V18.5.0.md** - Wiederverwendbare Components

---

**Letzte Aktualisierung:** 23.10.2025 23:15 Uhr (DE)  
**Nächster Review:** Bei jeder neuen Dashboard-Seite  
**Status:** 🟢 PRODUCTION-READY & VERPFLICHTEND

---

## 📝 CHANGELOG

### V18.5.1 (23.10.2025)

- ✅ Systemweite Dashboard-Struktur definiert
- ✅ Hero-Bereiche als Tailwind CSS (KEINE JPGs)
- ✅ PageHeaderWithKPIs verpflichtend für alle Seiten
- ✅ StandardTableTemplate als Standard
- ✅ EnhancedDetailDialog als Standard
- ✅ Zentrale Header/Footer/Sidebar
- ✅ Mobile-Components verpflichtend
- ✅ Rechtliche Compliance integriert
- ✅ Checklisten erstellt

---

**Ende der Dokumentation**
