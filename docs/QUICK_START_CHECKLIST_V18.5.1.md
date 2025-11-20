# ⚡ QUICK START CHECKLIST V18.5.1

> **Zweck:** Sofortige Checkliste vor JEDER Code-Änderung

---

## 🎯 VOR JEDER AUFGABE (ZWINGEND!)

### BLOCK 1: SCHRIFTBILD-CHECK ✅

```typescript
1. [ ] src/index.css konsultiert (Typography-Klassen)
2. [ ] tailwind.config.ts konsultiert (Farb-System)
3. [ ] Typography-Klasse gewählt:
   - text-display (Hero)
   - text-heading-1/2/3 (Headlines)
   - text-body-lg/text-body/text-body-sm (Body)
   - text-caption (Small)
4. [ ] Semantic Token gewählt:
   - text-foreground (Haupt-Text)
   - text-muted-foreground (Sekundär)
   - text-primary (Akzent)
5. [ ] Kontrast-Regel geprüft:
   - Helle BG → text-foreground
   - Dunkle BG → text-primary oder text-white
```

### BLOCK 2: TEMPLATE-CHECK ✅

```typescript
1. [ ] Template gewählt:
   - DashboardPageTemplate (1-Bereich)
   - DashboardDualPageTemplate (2-Bereiche mit Tabs)
2. [ ] KPIs erstellt (genau 3!):
   - KPIGenerator.entity.total()
   - KPIGenerator.entity.active()
   - KPIGenerator.entity.custom()
3. [ ] Quick Actions erstellt (genau 2!):
   - QuickActionsGenerator.create()
   - QuickActionsGenerator.export()
4. [ ] Komponenten gewählt:
   - DashboardSection (Bereichs-Container)
   - StandardTableTemplate (Listen)
   - StandardDetailDialog (PopUps)
   - DetailTrigger (Eye-Icon)
```

### BLOCK 3: GRID-CHECK ✅

```typescript
1. [ ] 12-Spalten-Grid verwendet:
   <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
2. [ ] KPI-Layout korrekt:
   - KPIs: lg:col-span-9
   - Schnellzugriff: lg:col-span-3
3. [ ] Spacing korrekt:
   - gap-3 (Standard zwischen Elementen)
   - gap-6 (Zwischen großen Blöcken)
4. [ ] Responsive Breakpoints:
   - sm: (Mobile)
   - md: (Tablet)
   - lg: (Desktop)
```

### BLOCK 4: KOMPONENTEN-CHECK ✅

```typescript
1. [ ] Bestehende Komponenten geprüft:
   - src/components/shared/
   - src/components/base/
   - src/components/dashboard/
2. [ ] Korrekte Imports:
   import { MetricCard } from '@/components/dashboard/MetricCard'
   import { StatusIndicator } from '@/components/shared/StatusIndicator'
   import { EmptyState } from '@/components/shared/EmptyState'
3. [ ] TypeScript-Interfaces definiert
4. [ ] Props-Dokumentation (JSDoc)
```

---

## 🚀 NEUE DASHBOARD-SEITE ERSTELLEN

### Schritt-für-Schritt

```typescript
// 1. HOOKS & STATE
export default function MeineDashboardSeite() {
  const { profile, company } = useAuth();
  const { toast } = useToast();
  const { isMobile } = useDeviceType();
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // React Query
  const { data, isLoading } = useMyData();

  // 2. STATS & KPIs
  const stats = DashboardStatsCalculator.myEntity(data);
  const kpis: [any, any, any] = [
    KPIGenerator.myEntity.total(stats.total),
    KPIGenerator.myEntity.active(stats.active),
    KPIGenerator.myEntity.custom(stats.custom),
  ];

  // 3. QUICK ACTIONS
  const quickActions: [any, any] = [
    QuickActionsGenerator.create(
      'Neu erstellen',
      Plus,
      () => setDialogOpen(true)
    ),
    QuickActionsGenerator.export(
      Download,
      () => handleExport()
    ),
  ];

  // 4. EVENT HANDLERS
  const handleCreate = () => { ... };
  const handleEdit = (item) => { ... };

  // 5. MOBILE REDIRECT (optional)
  if (isMobile) {
    return <MobileVersion />;
  }

  // 6. RENDER
  return (
    <DashboardPageTemplate
      pageTitle="Meine Seite"
      pageDescription="Beschreibung"
      kpis={kpis}
      quickActions={quickActions}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      showArchived={showArchived}
      onArchivedChange={setShowArchived}
      sectionIcon={Users}
      sectionTitle="Liste"
      sectionBadge={data.length}
    >
      <StandardTableTemplate
        data={data}
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

## ✅ COMMIT-CHECKLIST

```typescript
- [ ] Keine console.log() mehr im Code
- [ ] Keine // @ts-ignore Kommentare
- [ ] Keine 'any' Types (außer explizit begründet)
- [ ] Keine Direct Colors (#fff, rgb())
- [ ] Keine custom font-size
- [ ] Keine text-white auf hellen BG
- [ ] Typography-Klassen verwendet
- [ ] Semantic Tokens verwendet
- [ ] Template-System verwendet
- [ ] 12-Spalten-Grid korrekt
- [ ] Mobile-optimiert (responsive)
- [ ] Loading-States implementiert
- [ ] Error-Handling vorhanden
- [ ] Empty-States vorhanden
- [ ] TypeScript-Strict ohne Errors
```

---

## 📚 REFERENZEN (Schnellzugriff)

```typescript
// DOKUMENTATION
docs/MYDISPATCH_SYSTEM_MASTER_V18.5.1.md
docs/TYPOGRAPHY_STANDARDS_V18.5.1.md
docs/DASHBOARD_TEMPLATE_SYSTEM_V18.5.1.md

// DESIGN-SYSTEM
src/index.css (Zeilen 1-500)
tailwind.config.ts

// TEMPLATES
src/components/templates/DashboardPageTemplate.tsx
src/components/templates/DashboardDualPageTemplate.tsx
src/components/templates/StandardTableTemplate.tsx

// KOMPONENTEN
src/components/shared/PageHeaderWithKPIs.tsx
src/components/shared/DashboardSection.tsx
src/components/shared/StandardDetailDialog.tsx
src/components/dashboard/MetricCard.tsx

// AUTOMATION
src/lib/dashboard-automation/kpi-generator.ts
src/lib/dashboard-automation/quick-actions-generator.ts
src/lib/dashboard-automation/stats-calculator.ts
```

---

## 🎯 WICHTIGSTE REGELN (Niemals vergessen!)

1. **SCHRIFTBILD:** IMMER Typography-Klassen (text-heading-X, text-body)
2. **FARBEN:** IMMER Semantic Tokens (text-foreground, text-muted-foreground)
3. **TEMPLATES:** IMMER Dashboard-Templates verwenden
4. **GRID:** IMMER 12-Spalten-Grid (KPIs=9, Schnellzugriff=3)
5. **KOMPONENTEN:** IMMER bestehende Components prüfen

---

**MERKE:** Diese Checkliste ist ZWINGEND vor JEDER Code-Änderung!

---

**END OF QUICK START CHECKLIST**
