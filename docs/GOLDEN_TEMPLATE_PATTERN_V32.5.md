# 🎯 Golden Template Pattern: /rechnungen

**Basis:** `/workspaces/mydispatch-rebuild/src/pages/Rechnungen.tsx`
**Status:** ✅ MASTER TEMPLATE für alle Dashboard-Seiten

---

## 📐 Struktur-Anatomie

### 1️⃣ StandardPageLayout Wrapper
```tsx
<StandardPageLayout
  title="Seitentitel"
  description="SEO Description"
  canonical="/route"
  subtitle="Untertitel"
  onCreateNew={() => handleCreate()}
  createButtonLabel="Neue Aktion"
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  searchPlaceholder="Durchsuchen..."
  cardTitle="Übersicht-Titel"
  cardIcon={<Icon className="h-5 w-5" />}
>
```

### 2️⃣ KPI Cards Grid (3 Cards)
```tsx
{/* ✅ V6.1: StatCards Pattern (Golden Template) */}
<div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
  {kpis.map((kpi, index) => (
    <StatCard
      key={index}
      label={kpi.title}
      value={kpi.value}
      icon={kpi.icon}
      change={kpi.trend ? {
        value: kpi.trend.value,
        trend: kpi.trend.value >= 0 ? 'up' : 'down'
      } : undefined}
    />
  ))}
</div>
```

### 3️⃣ Export Bar
```tsx
{/* V33.0: Export Bar */}
<UniversalExportBar
  data={allData}
  filename={`export-${new Date().toISOString().split('T')[0]}`}
  showPdf={true}
  showExcel={true}
  showCsv={true}
/>
```

### 4️⃣ Content (Tabs + Tables)
```tsx
<Tabs value={currentTab} onValueChange={(value) => setSearchParams({ tab: value })}>
  <TabsList className="mb-4">
    <TabsTrigger value="tab1">
      <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
      <span>Tab 1</span>
      <Badge variant="secondary">{count}</Badge>
    </TabsTrigger>
  </TabsList>

  <TabsContent value="tab1">
    {renderTable(data)}
  </TabsContent>
</Tabs>
```

### 5️⃣ Table Pattern with Bulk Selection
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[50px]">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={() => bulkSelection.toggleSelectAll(data)}
        />
      </TableHead>
      <TableHead>Column 1</TableHead>
      {/* ... more columns */}
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        <TableCell>
          <Checkbox
            checked={bulkSelection.isSelected(item.id)}
            onCheckedChange={() => bulkSelection.toggleSelection(item.id)}
          />
        </TableCell>
        {/* ... more cells */}
      </TableRow>
    ))}
  </TableBody>
</Table>

<BulkActionBar
  selectedCount={bulkSelection.selectedCount}
  onClearSelection={bulkSelection.clearSelection}
  actions={[
    { label: 'Action 1', icon: Icon1, onClick: handleAction1 },
    { label: 'Action 2', icon: Icon2, onClick: handleAction2 },
  ]}
/>
```

### 6️⃣ Right Sidebar (320px, Desktop only)
```tsx
{!isMobile && (
  <aside
    className="fixed right-0 top-16 bottom-0 bg-white border-l border-slate-200 shadow-lg z-20 overflow-y-auto hidden md:block transition-all duration-300"
    style={{ width: '320px' }}
  >
    {/* Schnellzugriff Actions */}
    <div className="p-4 space-y-3 border-b border-slate-200">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-slate-700" />
        Schnellzugriff
      </h3>

      <V28Button variant="primary" fullWidth icon={Plus} onClick={() => {}}>
        Haupt-Aktion
      </V28Button>

      <V28Button variant="secondary" fullWidth icon={Download} onClick={() => {}}>
        Sekundär-Aktion
      </V28Button>
    </div>

    {/* Live-Status Stats */}
    <div className="p-4 space-y-3">
      <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Live-Status</h4>

      <div className="space-y-2">
        {/* Stat Card 1 */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-600">Label</span>
            <Icon className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500 mt-1">Details</p>
        </div>

        {/* Stat Card 2 (colored) */}
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-green-600">Success Metric</span>
            <Icon className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-700">{value}</p>
          <p className="text-xs text-green-500 mt-1">Details</p>
        </div>

        {/* Stat Card 3 (warning/error) */}
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-red-600">Alert Metric</span>
            <Icon className="h-4 w-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-700">{value}</p>
          <p className="text-xs text-red-500 mt-1">Details</p>
        </div>
      </div>
    </div>
  </aside>
)}
```

---

## 🎨 Design-Tokens

### Colors (Sidebar Stats)
- **Neutral:** `bg-slate-50`, `border-slate-200`, `text-slate-600/700/900`
- **Success:** `bg-green-50`, `border-green-200`, `text-green-600/700`
- **Warning:** `bg-amber-50`, `border-amber-200`, `text-amber-600/700`
- **Error:** `bg-red-50`, `border-red-200`, `text-red-600/700`
- **Info:** `bg-blue-50`, `border-blue-200`, `text-blue-600/700`

### Typography (Sidebar)
- **Section Header:** `text-sm font-semibold text-slate-900 uppercase tracking-wider`
- **Subsection Header:** `text-xs font-semibold text-slate-700 uppercase tracking-wider`
- **Stat Label:** `text-xs font-medium text-{color}-600`
- **Stat Value:** `text-2xl font-bold text-{color}-700/900`
- **Stat Details:** `text-xs text-{color}-500`

### Spacing
- **Page Container:** `space-y-6` (Desktop), `space-y-4` (Mobile)
- **KPI Cards Grid:** `gap-3`
- **Sidebar Padding:** `p-4`
- **Sidebar Sections:** `space-y-3`
- **Sidebar Stats:** `space-y-2`

---

## 📝 Anpassungs-Checkliste

Bei Konvertierung einer Seite zum Golden Template:

- [ ] StandardPageLayout mit allen Props
- [ ] 3 KPI Cards (StatCard mit KPIGenerator)
- [ ] UniversalExportBar
- [ ] Tabs mit Badges (falls mehrere Views)
- [ ] Table mit Bulk Selection
- [ ] BulkActionBar
- [ ] Right Sidebar 320px Desktop only
- [ ] Sidebar: Schnellzugriff (2-3 Buttons)
- [ ] Sidebar: Live-Status (3-4 Stats)
- [ ] Mobile View (optional MobileComponent)
- [ ] DetailDialog für Detailansicht
- [ ] EmptyState für leere Listen

---

## 🚀 Seiten-Status

| Seite | Status | Tabs | Special |
|-------|--------|------|---------|
| **Rechnungen.tsx** | ✅ MASTER | Rechnungen/Angebote | - |
| **Dashboard.tsx** | ✅ ANDERS | - | Widget-fokussiert |
| **Auftraege.tsx** | ⏳ ZU KONVERTIEREN | Aufträge/Angebote | Smart Assignment |
| **Kunden.tsx** | ⏳ ZU KONVERTIEREN | - | Portal-Zugang |
| **Fahrer.tsx** | ⏳ ZU KONVERTIEREN | Fahrer/Fahrzeuge | GPS Status |
| **Partner.tsx** | ⏳ ZU KONVERTIEREN | - | Provision |
| **Statistiken.tsx** | ⏳ ZU KONVERTIEREN | - | Charts |
| **Schichtzettel.tsx** | ⏳ ZU KONVERTIEREN | - | Calendar |

---

**Version:** 1.0
**Datum:** 2025-11-08
**Basis:** Rechnungen.tsx V28.1
