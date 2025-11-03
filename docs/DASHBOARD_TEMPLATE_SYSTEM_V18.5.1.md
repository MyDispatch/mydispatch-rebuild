# DASHBOARD-TEMPLATE-SYSTEM V18.5.1

> **Version:** 18.5.1  
> **Erstellt:** 2025-01-26  
> **Status:** ✅ Produktionsbereit

---

## 🎯 ÜBERSICHT

Vollständig standardisiertes Template-System für ALLE Dashboard-Seiten mit:
- Einheitlicher Struktur (Breadcrumbs, KPIs, Suche, Content)
- Wiederverwendbaren Komponenten
- Mobile-optimiertem Design
- Rechtlich konformen Zeitstempeln

---

## 📦 KOMPONENTEN-ÜBERSICHT

### 1. DashboardPageTemplate (1-Bereich)
```typescript
import { DashboardPageTemplate } from '@/components/templates';

<DashboardPageTemplate
  // SEO & Layout
  pageTitle="Kunden"
  pageDescription="Verwaltung Ihrer Kundendaten"
  
  // KPIs + Actions
  kpis={[kpi1, kpi2, kpi3]}
  quickActions={[action1, action2]}
  
  // Search & Filter
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  searchPlaceholder="Kunden durchsuchen..."
  showArchived={showArchived}
  onArchivedChange={setShowArchived}
  
  // Section
  sectionIcon={Users}
  sectionTitle="Kundenliste"
  sectionBadge={customers.length}
>
  {/* Ihre Table oder Content */}
  <StandardTableTemplate ... />
</DashboardPageTemplate>
```

### 2. DashboardDualPageTemplate (2-Bereiche mit Tabs)
```typescript
import { DashboardDualPageTemplate } from '@/components/templates';

<DashboardDualPageTemplate
  // SEO & Layout
  pageTitle="Fahrer & Fahrzeuge"
  pageDescription="Verwaltung Ihrer Flotte"
  
  // Tabs
  sections={[
    {
      id: 'fahrer',
      label: 'Fahrer',
      icon: Users,
      title: 'Fahrerliste',
      badge: drivers.length,
      content: <DriversTable ... />,
      kpis: driverKPIs,
      quickActions: driverActions,
    },
    {
      id: 'fahrzeuge',
      label: 'Fahrzeuge',
      icon: Car,
      title: 'Fahrzeugliste',
      badge: vehicles.length,
      content: <VehiclesTable ... />,
      kpis: vehicleKPIs,
      quickActions: vehicleActions,
    }
  ]}
  activeTab={currentTab}
  onTabChange={setCurrentTab}
  
  // Search & Filter (Global)
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  showArchived={showArchived}
  onArchivedChange={setShowArchived}
/>
```

### 3. DashboardSection (Bereichs-Container)
```typescript
import { DashboardSection } from '@/components/shared';

<DashboardSection
  icon={Users}
  title="Kundenliste"
  badge={25}
>
  {/* Content */}
</DashboardSection>
```

### 4. StandardDetailDialog (Eye-Icon PopUp)
```typescript
import { StandardDetailDialog, DetailTrigger } from '@/components/shared';

// In Tabelle: Trigger-Button
<DetailTrigger 
  onClick={() => setSelectedItem(item)}
  label="Details anzeigen"
/>

// Detail-Dialog
<StandardDetailDialog
  open={detailOpen}
  onOpenChange={setDetailOpen}
  title={`Kunde: ${customer.name}`}
  createdAt={customer.created_at}
  actions={[
    {
      label: 'PDF herunterladen',
      icon: Download,
      onClick: handlePDFDownload,
      variant: 'outline',
    },
    {
      label: 'E-Mail senden',
      icon: Mail,
      onClick: handleEmail,
      variant: 'outline',
    },
  ]}
  onArchive={handleArchive}
  showArchive={true}
>
  {/* Detail-Content */}
  <div className="space-y-4">
    <div>
      <span className="text-sm text-muted-foreground">Name:</span>
      <p className="font-medium">{customer.name}</p>
    </div>
  </div>
</StandardDetailDialog>
```

---

## 🎨 DESIGN-STANDARDS

### Layout-Struktur (ZWINGEND)
1. **Breadcrumbs** (automatisch via StandardPageLayout)
2. **Titel + Beschreibung** (SEO-optimiert)
3. **KPIs (3x) + Schnellzugriff (2x)** via PageHeaderWithKPIs
4. **Suche + Archiv-Toggle** (horizontal angeordnet)
5. **Bereich(e)** mit zentriertem Icon/Titel/Badge
6. **Eye-Icon** für Detailansichten (NIEMALS andere Icons!)

### KPI-Generierung
```typescript
import { KPIGenerator } from '@/lib/dashboard-automation';

const kpis: [any, any, any] = [
  KPIGenerator.customers.total(stats.total),
  KPIGenerator.customers.portalAccess(stats.portalAccess),
  KPIGenerator.customers.openInvoices(stats.openInvoices),
];
```

### Quick Actions
```typescript
import { QuickActionsGenerator } from '@/lib/dashboard-automation';

const quickActions: [any, any] = [
  QuickActionsGenerator.create(
    'Kunde hinzufügen',
    Plus,
    () => setDialogOpen(true)
  ),
  QuickActionsGenerator.export(
    Download,
    () => handleExport()
  ),
];
```

---

## 📋 CHECKLISTE FÜR NEUE SEITEN

- [ ] Template gewählt (Single/Dual)
- [ ] KPIs mit KPIGenerator erstellt (genau 3!)
- [ ] Quick Actions mit QuickActionsGenerator (genau 2!)
- [ ] Suche + Archiv-Toggle integriert
- [ ] DashboardSection für Content verwendet
- [ ] Eye-Icon für Detailansichten (DetailTrigger)
- [ ] StandardDetailDialog für PopUps
- [ ] Zeitstempel created_at angezeigt
- [ ] Mobile-Variante erstellt (falls nötig)
- [ ] SEO-Metadaten gesetzt (pageTitle, pageDescription)

---

## 🚀 MIGRATION BESTEHENDER SEITEN

### Beispiel: /kunden Migration

**Vorher:**
```typescript
export default function Kunden() {
  // Individuelles Layout, inkonsistente KPIs
  return (
    <MainLayout>
      <div>Custom KPIs</div>
      <div>Custom Search</div>
      <CustomTable />
    </MainLayout>
  );
}
```

**Nachher:**
```typescript
import { DashboardPageTemplate } from '@/components/templates';
import { KPIGenerator, QuickActionsGenerator } from '@/lib/dashboard-automation';

export default function Kunden() {
  const stats = DashboardStatsCalculator.customers(customers);
  
  const kpis: [any, any, any] = [
    KPIGenerator.customers.total(stats.total),
    KPIGenerator.customers.portalAccess(stats.portalAccess),
    KPIGenerator.customers.openInvoices(stats.openInvoices),
  ];
  
  const quickActions: [any, any] = [
    QuickActionsGenerator.create('Kunde hinzufügen', Plus, handleCreate),
    QuickActionsGenerator.export(Download, handleExport),
  ];
  
  return (
    <DashboardPageTemplate
      pageTitle="Kunden"
      pageDescription="Verwaltung Ihrer Kundendaten"
      kpis={kpis}
      quickActions={quickActions}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      showArchived={showArchived}
      onArchivedChange={setShowArchived}
      sectionIcon={Users}
      sectionTitle="Kundenliste"
      sectionBadge={customers.length}
    >
      <StandardTableTemplate
        data={customers}
        columns={columns}
        onViewDetails={handleViewDetails}
        showBulkSelect={true}
        showCreatedAt={true}
      />
    </DashboardPageTemplate>
  );
}
```

---

## 🔧 TROUBLESHOOTING

### Problem: KPIs werden nicht angezeigt
**Lösung:** Prüfen, ob genau 3 KPIs übergeben werden (Array-Typ: `[any, any, any]`)

### Problem: Quick Actions fehlen
**Lösung:** Prüfen, ob genau 2 Actions übergeben werden (Array-Typ: `[any, any]`)

### Problem: Eye-Icon funktioniert nicht
**Lösung:** `DetailTrigger` verwenden statt custom Button:
```typescript
<DetailTrigger onClick={() => setSelectedItem(item)} />
```

### Problem: Breadcrumbs fehlen
**Lösung:** `StandardPageLayout` automatisch via Template integriert

---

## 📊 VORTEILE

✅ **Konsistenz**: Alle Seiten sehen identisch aus  
✅ **Wartbarkeit**: Zentrale Änderungen wirken systemweit  
✅ **Performance**: Memoization & optimierte Renders  
✅ **Rechtssicherheit**: Zeitstempel automatisch  
✅ **Mobile-First**: Responsive by default  
✅ **DRY-Prinzip**: Keine Code-Duplikation  

---

## 🎯 NÄCHSTE SCHRITTE

1. Migration `/kunden` auf DashboardPageTemplate
2. Migration `/auftraege` auf DashboardPageTemplate
3. Migration `/rechnungen` auf DashboardPageTemplate
4. Migration `/partner` auf DashboardPageTemplate
5. Systemweite Tests & QA

---

**Stand:** V18.5.1 abgeschlossen ✅
