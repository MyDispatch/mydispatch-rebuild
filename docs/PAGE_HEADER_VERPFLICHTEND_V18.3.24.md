/_ ==================================================================================
PAGE HEADER VERPFLICHTEND - V18.3.24
==================================================================================
KRITISCHE DESIGNVORGABE: Jede Seite MUSS exakt 3 KPIs + Schnellzugriff haben
================================================================================== _/

## 🎯 VERPFLICHTENDE STRUKTUR

Jede Seite (außer Landing) MUSS folgendes Header-Pattern verwenden:

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🏠 TITEL                                                    [Badges] │
│ Beschreibung                                                         │
├─────────────────────────────────────────────────────────────────────┤
│ ┌───────────────┬───────────────┬───────────────┬─────────────────┐ │
│ │  KPI 1        │  KPI 2        │  KPI 3        │ SCHNELLZUGRIFF  │ │
│ │  Wert 1       │  Wert 2       │  Wert 3       │                 │ │
│ │  +12% ↑       │  +8% ↑        │  Status       │  [Action 1]     │ │
│ │               │               │               │  [Action 2]     │ │
│ │               │               │               │  [Action 3]     │ │
│ └───────────────┴───────────────┴───────────────┴─────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
      9 cols                                           3 cols
```

## ✅ REGEL 1: EXAKT 3 KPIs

**VERPFLICHTEND**: Jede Seite hat **EXAKT 3 KPI-Cards**

- ❌ NICHT erlaubt: 2 KPIs, 4 KPIs, 1 KPI
- ✅ IMMER: 3 KPIs (9 cols Grid: 3 cols pro KPI)

**Warum?**

- Konsistentes Layout über alle Seiten
- Perfekte Grid-Balance: 9 cols KPIs + 3 cols Schnellzugriff = 12 cols
- Mobile-optimiert: 3 KPIs stacken sauber

## ✅ REGEL 2: SCHNELLZUGRIFF VERPFLICHTEND

**VERPFLICHTEND**: Jede Seite hat **2-4 Quick Actions**

- Min. 2 Actions (z.B. "Neu", "Export")
- Max. 4 Actions (sonst wird es zu voll)
- Erste Action IMMER die Haupt-Action (z.B. "Neuer Auftrag")

**Layout:**

- 3 cols rechts neben KPIs
- Hervorgehobenes Design (Border, Gradient)
- Vertikal gestackt
- Responsive: Mobile → Full-Width über KPIs

## 📋 TEMPLATE-KONFIGURATION

```typescript
import { UnifiedPageTemplate } from '@/components/layout/UnifiedPageTemplate';

<UnifiedPageTemplate
  header={{
    title: 'Seiten-Titel',
    description: 'Beschreibung der Seite',
    icon: IconComponent,

    // VERPFLICHTEND: Exakt 3 KPIs
    kpis: [
      {
        label: 'KPI 1 Titel',
        value: 42, // oder formatCurrency(150)
        icon: IconComponent,
        trend: '+12%', // optional
        statusType: 'success' // 'success' | 'warning' | 'error' | 'neutral'
      },
      {
        label: 'KPI 2 Titel',
        value: 15,
        icon: IconComponent,
        statusType: 'warning'
      },
      {
        label: 'KPI 3 Titel',
        value: formatCurrency(450),
        icon: IconComponent,
        trend: '+8%',
        statusType: 'success'
      }
    ],

    // VERPFLICHTEND: 2-4 Quick Actions
    quickActions: [
      {
        label: 'Haupt-Action',
        icon: Plus,
        onClick: handleCreate,
        variant: 'default' // optional: 'default' | 'outline' | 'ghost'
      },
      {
        label: 'Export',
        icon: Download,
        onClick: handleExport,
        variant: 'outline'
      },
      {
        label: 'Weitere Action',
        icon: Settings,
        onClick: handleSettings,
        variant: 'outline'
      }
    ]
  }}

  // ... rest of config
/>
```

## 🎨 DESIGN-DETAILS

### KPI Card (MetricCard)

```typescript
// Auto-rendered in PageHeader
<MetricCard
  title="Aufträge heute"
  value={15}
  icon={FileText}
  trend={{ value: 12, label: '+12%' }} // optional
  subtitle="Status-Text" // optional
/>
```

### Schnellzugriff Card

```typescript
// Auto-rendered in PageHeader
<Card className="border-2 border-primary/20 shadow-md hover:shadow-lg">
  <CardHeader className="border-b border-primary/10">
    <CardTitle>Schnellzugriff</CardTitle>
  </CardHeader>
  <CardContent className="space-y-2">
    {quickActions.map(action => (
      <Button variant="quickAction" onClick={action.onClick}>
        <action.icon className="h-4 w-4 mr-3" />
        {action.label}
      </Button>
    ))}
  </CardContent>
</Card>
```

## 📱 RESPONSIVE VERHALTEN

### Desktop (≥ 1024px)

```
┌─────────────────────────────────────────────┐
│ [KPI 1] [KPI 2] [KPI 3] [Schnellzugriff]   │
│  3 cols  3 cols  3 cols      3 cols         │
└─────────────────────────────────────────────┘
```

### Tablet (768px - 1023px)

```
┌─────────────────────────────┐
│ [KPI 1] [KPI 2] [KPI 3]     │
│  4 cols  4 cols  4 cols      │
├─────────────────────────────┤
│ [Schnellzugriff]            │
│  12 cols                     │
└─────────────────────────────┘
```

### Mobile (< 768px)

```
┌───────────────┐
│ [KPI 1]       │
│  12 cols      │
├───────────────┤
│ [KPI 2]       │
│  12 cols      │
├───────────────┤
│ [KPI 3]       │
│  12 cols      │
├───────────────┤
│ [Schnellzugr.]│
│  12 cols      │
└───────────────┘
```

## ✅ BEISPIELE FÜR VERSCHIEDENE SEITEN

### Aufträge-Seite

```typescript
kpis: [
  { label: 'Aufträge heute', value: 15, icon: FileText, trend: '+12%', statusType: 'success' },
  { label: 'Ausstehend', value: 3, icon: RefreshCw, statusType: 'warning' },
  { label: 'Umsatz', value: formatCurrency(450), icon: Euro, trend: '+8%', statusType: 'success' }
],
quickActions: [
  { label: 'Neuer Auftrag', icon: Plus, onClick: handleCreate },
  { label: 'Smart Assignment', icon: Sparkles, onClick: handleAI },
  { label: 'Export', icon: Download, onClick: handleExport, variant: 'outline' }
]
```

### Kunden-Seite

```typescript
kpis: [
  { label: 'Gesamt-Kunden', value: 124, icon: Users, statusType: 'neutral' },
  { label: 'Top-Kunde', value: 'Max Mustermann', icon: TrendingUp, statusType: 'success' },
  { label: 'Offene Beträge', value: formatCurrency(1250), icon: AlertCircle, statusType: 'error' }
],
quickActions: [
  { label: 'Neuer Kunde', icon: UserPlus, onClick: handleCreate },
  { label: 'Import', icon: Upload, onClick: handleImport, variant: 'outline' },
  { label: 'Export', icon: Download, onClick: handleExport, variant: 'outline' }
]
```

### Fahrer-Seite

```typescript
kpis: [
  { label: 'Verfügbar', value: 8, icon: CheckCircle, statusType: 'success' },
  { label: 'Im Einsatz', value: 5, icon: Activity, statusType: 'warning' },
  { label: 'Offline', value: 2, icon: XCircle, statusType: 'neutral' }
],
quickActions: [
  { label: 'Neuer Fahrer', icon: UserPlus, onClick: handleCreate },
  { label: 'Schichtplan', icon: Calendar, onClick: () => navigate('/schichtzettel'), variant: 'outline' },
  { label: 'Dokumente', icon: FileText, onClick: () => navigate('/dokumente'), variant: 'outline' }
]
```

### Dashboard

```typescript
kpis: [
  { label: 'Aufträge heute', value: 15, icon: FileText, trend: '+12%', statusType: 'success' },
  { label: 'Umsatz', value: formatCurrency(1450), icon: TrendingUp, trend: '+8%', statusType: 'success' },
  { label: 'Verfügbare Fahrer', value: 8, icon: Users, statusType: 'neutral' }
],
quickActions: [
  { label: 'Neuer Auftrag', icon: Plus, onClick: () => navigate('/auftraege') },
  { label: 'Kalender', icon: Calendar, onClick: () => navigate('/schichtzettel'), variant: 'outline' },
  { label: 'Team-Chat', icon: MessageSquare, onClick: () => navigate('/kommunikation'), variant: 'outline' }
]
```

## 🚫 ANTI-PATTERNS (WAS NIEMALS TUN)

### ❌ NUR 2 KPIs

```typescript
// FALSCH!
kpis: [
  { label: "KPI 1", value: 10, icon: Icon },
  { label: "KPI 2", value: 20, icon: Icon },
  // Fehlt: KPI 3!
];
```

### ❌ 4+ KPIs

```typescript
// FALSCH!
kpis: [
  { label: 'KPI 1', ... },
  { label: 'KPI 2', ... },
  { label: 'KPI 3', ... },
  { label: 'KPI 4', ... } // ZU VIELE!
]
```

### ❌ Keine Quick Actions

```typescript
// FALSCH!
header: {
  kpis: [...],
  // quickActions fehlt komplett!
}
```

### ❌ Nur 1 Quick Action

```typescript
// FALSCH!
quickActions: [
  { label: "Neu", icon: Plus, onClick: handleCreate },
  // Zu wenig! Min. 2 erforderlich
];
```

### ❌ Mehr als 4 Quick Actions

```typescript
// FALSCH!
quickActions: [
  { ... },
  { ... },
  { ... },
  { ... },
  { ... } // 5 Actions = ZU VIELE!
]
```

## 📊 METRIKEN & ERFOLGSKRITERIEN

### Vor Regel-Implementierung (V18.2)

- Inkonsistente Header-Layouts
- 0-4 KPIs pro Seite (uneinheitlich)
- Quick Actions mal da, mal nicht
- Unterschiedliche Designs

### Nach Regel-Implementierung (V18.3)

- ✅ 100% konsistente Header über alle Seiten
- ✅ Exakt 3 KPIs auf allen Seiten
- ✅ 2-4 Quick Actions verpflichtend
- ✅ Einheitliches Design (PageHeaderWithKPIs-Pattern)

## 🔄 MIGRATION ALTER SEITEN

Wenn Sie eine alte Seite migrieren:

1. **Identifiziere aktuelle KPIs**
   - Wenn < 3: Füge sinnvolle KPIs hinzu
   - Wenn > 3: Wähle die 3 wichtigsten aus

2. **Definiere Quick Actions**
   - Min. 2, Max. 4
   - Erste Action = Haupt-Action (meist "Neu erstellen")

3. **Verwende verpflichtendes Pattern**
   ```typescript
   header: {
     kpis: [KPI1, KPI2, KPI3], // Exakt 3!
     quickActions: [Action1, Action2, ...] // 2-4
   }
   ```

## 📚 WEITERFÜHRENDE DOKUMENTATION

- `docs/PAGE_TEMPLATE_SYSTEM_V18.3_ULTIMATE.md` - Komplettes Template-System
- `src/components/layout/PageHeader.tsx` - PageHeader-Implementierung
- `src/types/page-template.ts` - TypeScript-Types
- `docs/OPTIMIZATION_TRACKING_V18.3.24.md` - Sprint-Tracking

---

**Version**: V18.3.24
**Status**: ✅ AKTIV & VERPFLICHTEND
**Datum**: 18.10.2025
**Autor**: MyDispatch Template-System
