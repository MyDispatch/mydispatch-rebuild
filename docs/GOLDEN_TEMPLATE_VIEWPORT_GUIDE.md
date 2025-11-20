# 🧬 GOLDEN TEMPLATE VIEWPORT GUIDE V1.0

## 📋 ÜBERSICHT

Dieses Dokument definiert die **VERBINDLICHE** Struktur für alle Standard-Inhaltsseiten (Genom B) über alle Viewports hinweg.

**Referenz-Seite:** `/rechnungen` (Golden Template Master)

---

## 📱 MOBILE VIEW (<768px)

### ✅ STRUKTUR

```typescript
if (isMobile) {
  return (
    <StandardPageLayout>
      {/* ✅ DIREKTE StatCards (KEIN PageHeaderWithKPIs!) */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {kpis.map((kpi, index) => (
          <StatCard
            key={index}
            label={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            change={kpi.trend ? { value: kpi.trend.value, trend: kpi.trend.value >= 0 ? 'up' : 'down' } : undefined}
          />
        ))}
      </div>

      {/* Mobile-optimierte Komponente */}
      <Mobile{Entity}
        items={items}
        isLoading={loading}
        onCreateNew={() => setDialogOpen(true)}
        onItemClick={handleItemClick}
        onRefresh={handleRefresh}
      />
    </StandardPageLayout>
  );
}
```

### ⚠️ WICHTIG: Warum KEINE PageHeaderWithKPIs auf Mobile?

1. **Platzeffizienz**: Die Schnellzugriff-Card (3 Spalten) ist auf Mobile zu groß
2. **UX-Optimierung**: Quick Actions sollten in der Mobile-Komponente selbst sein (FAB)
3. **Performance**: Weniger DOM-Komplexität = schnellere Render-Zeit

### ❌ ANTI-PATTERN

```typescript
// ❌ FALSCH auf Mobile:
if (isMobile) {
  return (
    <StandardPageLayout>
      <PageHeaderWithKPIs kpis={kpis} quickActions={quickActions} />
      {/* ... */}
    </StandardPageLayout>
  );
}
```

---

## 💻 DESKTOP VIEW (≥768px)

### ✅ STRUKTUR

```typescript
<StandardPageLayout
  title="Seiten-Titel"
  subtitle="Beschreibung"
  onCreateNew={handleCreate}
  createButtonLabel="Neu erstellen"
>
  {/* ✅ PageHeaderWithKPIs (9 Cols KPIs + 3 Cols Schnellzugriff) */}
  <PageHeaderWithKPIs
    kpis={kpis}
    quickActions={quickActions}
    quickAccessTitle="Schnellzugriff"
  />

  {/* UniversalExportBar */}
  <UniversalExportBar
    data={items}
    filename={`export-${Date.now()}`}
    showPdf={true}
    showExcel={true}
    showCsv={true}
  />

  {/* Content: Tabs, Tables, Charts */}
  <Tabs value={currentTab}>
    <TabsList>...</TabsList>
    <TabsContent>...</TabsContent>
  </Tabs>
</StandardPageLayout>

{/* ✅ Right Sidebar (MANDATORY!) */}
{!isMobile && (
  <aside 
    className="fixed right-0 top-16 bottom-0 bg-white border-l border-slate-200 shadow-lg z-20 overflow-y-auto hidden md:block"
    style={{ width: '320px' }}
  >
    {/* Schnellzugriff Actions */}
    <div className="p-4 space-y-3 border-b border-slate-200">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-slate-700" />
        Schnellzugriff
      </h3>
      
      <V28Button variant="primary" fullWidth icon={Plus}>
        Primäre Aktion
      </V28Button>

      <V28Button variant="secondary" fullWidth icon={Download}>
        Sekundäre Aktion
      </V28Button>
    </div>

    {/* Live-Status Stats */}
    <div className="p-4 space-y-3">
      <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        Live-Status
      </h4>
      
      <div className="space-y-2">
        {/* Mini-KPI Cards */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-600">Metrik</span>
            <Icon className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">42</p>
          <p className="text-xs text-slate-500 mt-1">Details</p>
        </div>

        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-green-600">Erfolg</span>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-700">128</p>
          <p className="text-xs text-green-500 mt-1">+12% heute</p>
        </div>

        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-amber-600">Warnung</span>
            <AlertCircle className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-700">7</p>
          <p className="text-xs text-amber-500 mt-1">Benötigt Beachtung</p>
        </div>
      </div>
    </div>
  </aside>
)}
```

### ⚠️ WICHTIG: Warum PageHeaderWithKPIs auf Desktop?

1. **Optimal für große Bildschirme**: 9:3 Grid nutzt Platz ideal aus
2. **Konsistente UX**: Schnellzugriff immer oben rechts sichtbar
3. **Platzersparnis**: Vermeidet redundante Actions in Sidebar UND Header

### ❌ ANTI-PATTERN

```typescript
// ❌ FALSCH auf Desktop:
<StandardPageLayout>
  {/* Direkte StatCards statt PageHeaderWithKPIs */}
  <div className="grid grid-cols-3 gap-3">
    {kpis.map(kpi => <StatCard {...kpi} />)}
  </div>
</StandardPageLayout>
```

---

## 🎯 RIGHT SIDEBAR (MANDATORY!)

### Technische Spezifikation

- **Position:** `fixed right-0 top-16 bottom-0`
- **Breite:** `320px` (feste Breite, KEIN dynamisches Resize)
- **Sichtbarkeit:** `hidden md:block` (ab 768px Breakpoint)
- **Z-Index:** `z-20` (über Content, unter Modals)
- **Guard:** `{!isMobile && ( ... )}` (IMMER mit Device-Check)

### Inhalt-Struktur

1. **Schnellzugriff-Sektion** (oben, mit Border)
   - Titel mit Slate-Akzent-Bar
   - 2 V28Button (Primary + Secondary)

2. **Live-Status-Sektion** (unten)
   - 3-4 Mini-KPI-Cards
   - Farbcodiert nach Kontext (Slate, Green, Amber, Red, Blue)

### Design-Tokens

```css
/* Sidebar Container */
background: white
border-left: 1px solid slate-200
shadow: shadow-lg

/* Section Headers */
color: slate-900 (Schnellzugriff)
color: slate-700 (Live-Status)
font-size: text-xs / text-sm
font-weight: font-semibold
text-transform: uppercase
letter-spacing: tracking-wider

/* Mini-KPI Cards */
padding: p-3
border-radius: rounded-lg
border: 1px solid {color}-200
background: {color}-50

/* Text Hierarchy */
Label: text-xs font-medium {color}-600
Value: text-2xl font-bold {color}-700/900
Detail: text-xs {color}-500
```

---

## 📊 KPI-DATEN & QUICK ACTIONS

### ✅ SSOT-Prinzip (Single Source of Truth)

**Definiere KPIs UND Quick Actions einmal, nutze sie überall:**

```typescript
// ✅ EINMAL definieren (useMemo für Performance)
const kpis = useMemo(() => [
  KPIGenerator.entity.metric1(data1),
  KPIGenerator.entity.metric2(data2),
  KPIGenerator.entity.metric3(data3),
] as [any, any, any], [data1, data2, data3]);

const quickActions: [any, any] = useMemo(() => [
  QuickActionsGenerator.create('Primär', Plus, handleCreate),
  QuickActionsGenerator.export(Download, handleExport),
], [handleCreate, handleExport]);

// ✅ Mobile: Direkte StatCards
if (isMobile) {
  return (
    <>
      {kpis.map((kpi, index) => (
        <StatCard key={index} {...kpi} />
      ))}
    </>
  );
}

// ✅ Desktop: PageHeaderWithKPIs
return <PageHeaderWithKPIs kpis={kpis} quickActions={quickActions} />;
```

### ❌ ANTI-PATTERN: Doppelte Definition

```typescript
// ❌ FALSCH: KPIs doppelt definieren
const mobileKPIs = [{ title: 'Total', value: 42, icon: Users }];
const desktopKPIs = [{ title: 'Total', value: 42, icon: Users }]; // Duplikat!
```

---

## ✅ VALIDATION CHECKLIST

### Page Compliance Check

- [ ] **Mobile:**
  - [ ] Nutzt direkte `<StatCard>` im `isMobile` Block
  - [ ] KEINE `<PageHeaderWithKPIs>` auf Mobile
  - [ ] Quick Actions in Mobile-Komponente (z.B. FAB)

- [ ] **Desktop:**
  - [ ] Nutzt `<PageHeaderWithKPIs kpis={kpis} quickActions={quickActions} />`
  - [ ] KEINE direkten `<StatCard>` außerhalb Mobile-Block
  - [ ] Right Sidebar vorhanden (`fixed right-0 ... width: 320px`)

- [ ] **Sidebar:**
  - [ ] Schnellzugriff-Sektion (2 Buttons)
  - [ ] Live-Status-Sektion (3-4 Mini-KPIs)
  - [ ] Guard: `{!isMobile && ( ... )}`

- [ ] **SSOT:**
  - [ ] KPIs in `useMemo` definiert
  - [ ] Quick Actions in `useMemo` definiert
  - [ ] Wiederverwendung in Mobile + Desktop

### Automated Validation

```bash
# Run Golden Template Validator
tsx scripts/validate-golden-templates.ts

# Expected Output:
✅ PASS - src/pages/{Entity}.tsx
  Viewport Structure:
    Mobile: ✅ Direct StatCards
    Desktop: ✅ PageHeaderWithKPIs
    Sidebar: ✅ Right Sidebar (320px)
```

---

## 🎨 BEISPIEL-SEITEN (100% COMPLIANT)

| Seite | Mobile StatCards | Desktop PageHeaderWithKPIs | Right Sidebar | Status |
|-------|------------------|---------------------------|---------------|--------|
| `/rechnungen` | ✅ | ✅ | ✅ | ✅ MASTER |
| `/fahrer` | ✅ | ✅ | ✅ | ✅ COMPLIANT |
| `/auftraege` | ✅ | ✅ | ✅ | ✅ COMPLIANT |
| `/kunden` | ✅ | ✅ | ✅ | ✅ COMPLIANT |

---

## 🚫 HÄUFIGE FEHLER

### ❌ Fehler 1: PageHeaderWithKPIs auf Mobile

```typescript
// ❌ FALSCH
if (isMobile) {
  return (
    <StandardPageLayout>
      <PageHeaderWithKPIs kpis={kpis} quickActions={quickActions} />
    </StandardPageLayout>
  );
}
```

**Fix:** Nutze direkte StatCards auf Mobile.

### ❌ Fehler 2: Direkte StatCards auf Desktop

```typescript
// ❌ FALSCH
<StandardPageLayout>
  <div className="grid grid-cols-3 gap-3">
    {kpis.map(kpi => <StatCard {...kpi} />)}
  </div>
</StandardPageLayout>
```

**Fix:** Nutze PageHeaderWithKPIs auf Desktop.

### ❌ Fehler 3: Fehlende Right Sidebar

```typescript
// ❌ FALSCH: Keine Sidebar!
<StandardPageLayout>
  <PageHeaderWithKPIs ... />
</StandardPageLayout>
```

**Fix:** Füge `{!isMobile && <aside>...</aside>}` nach StandardPageLayout hinzu.

### ❌ Fehler 4: Doppelte KPI-Definition

```typescript
// ❌ FALSCH
const mobileKPIs = [KPIGenerator.bookings.total(42)];
const desktopKPIs = [KPIGenerator.bookings.total(42)]; // Duplikat!
```

**Fix:** Definiere KPIs einmal in `useMemo`, nutze sie überall.

---

## 📚 REFERENZEN

- **Master Golden Template:** `src/pages/Rechnungen.tsx`
- **Validator:** `scripts/validate-golden-templates.ts`
- **KPI Generator:** `src/lib/dashboard-automation/kpi-generator.ts`
- **PageHeaderWithKPIs:** `src/components/shared/PageHeaderWithKPIs.tsx`

---

**Version:** 1.0
**Datum:** 2025-01-31
**Status:** ✅ PRODUCTION-READY
**Compliance:** 100% Genesis Protocol Axiom II
