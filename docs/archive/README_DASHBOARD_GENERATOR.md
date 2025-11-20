# 🚀 Dashboard Generator V6.1

## Installation

Da `package.json` read-only ist, führe das Script direkt aus:

```bash
npx tsx scripts/generate-dashboard.ts --help
```

## Quick Start

### Einfache Dashboard-Generierung

```bash
npx tsx scripts/generate-dashboard.ts \
  --name="Auftraege" \
  --title="Aufträge" \
  --table="bookings"
```

Dies generiert:
- `src/pages/Auftraege.tsx` mit UniversalMasterDashboardTemplate
- KPI: Anzahl Einträge
- Quick Actions: Neu erstellen, CSV Import, Export
- Responsive Design
- V28 Design System Compliance

### Erweiterte Konfiguration

Erstelle `dashboard-configs/auftraege.json`:

```json
{
  "name": "Auftraege",
  "title": "Aufträge",
  "route": "/auftraege",
  "supabaseTable": "bookings",
  "kpis": [
    {
      "label": "Gesamt",
      "calculation": "count",
      "icon": "FileText"
    },
    {
      "label": "Umsatz",
      "calculation": "sum",
      "field": "price",
      "icon": "Euro"
    },
    {
      "label": "Durchschnitt",
      "calculation": "avg",
      "field": "price",
      "icon": "TrendingUp"
    }
  ],
  "hasQuickActions": true,
  "hasExport": true,
  "hasFilters": true,
  "relatedTables": ["customers", "drivers", "vehicles"]
}
```

Dann:

```bash
npx tsx scripts/generate-dashboard.ts --config=dashboard-configs/auftraege.json
```

## Features

### Auto-Generated Components

✅ **UniversalMasterDashboardTemplate Integration**
- PageHeader mit KPIs
- Quick Actions Panel via Context
- Loading & Error States
- Responsive Design

✅ **Automatic KPI Calculations**
- `count`: Anzahl Einträge
- `sum`: Summe eines Feldes
- `avg`: Durchschnitt eines Feldes
- `custom`: Eigene SQL-Query

✅ **Quick Actions**
- Neu erstellen
- CSV Import
- Export (PDF/Excel/CSV)

✅ **Export Configuration**
- PDF Export
- Excel Export
- CSV Export

✅ **Filter System**
- Status-Filter
- Custom Filters
- Search Integration

### Available Icons

Alle Lucide Icons sind verfügbar:
- `FileText`, `Euro`, `TrendingUp`, `Users`, `Building2`
- `Calendar`, `Clock`, `MapPin`, `Phone`, `Mail`
- Siehe: https://lucide.dev/icons

## KPI Calculation Types

### Count
Zählt alle Einträge:
```json
{
  "label": "Gesamt",
  "calculation": "count",
  "icon": "FileText"
}
```

### Sum
Summiert ein Zahlenfeld:
```json
{
  "label": "Umsatz",
  "calculation": "sum",
  "field": "price",
  "icon": "Euro"
}
```

### Average
Berechnet Durchschnitt:
```json
{
  "label": "Ø Preis",
  "calculation": "avg",
  "field": "price",
  "icon": "TrendingUp"
}
```

### Custom
Eigene Berechnung:
```json
{
  "label": "Custom",
  "calculation": "custom",
  "customQuery": "SELECT COUNT(*) FILTER (WHERE status = 'completed') FROM bookings",
  "icon": "CheckCircle2"
}
```

## Post-Generation Steps

Nach Generierung eines Dashboards:

### 1. Route hinzufügen (src/App.tsx)

```tsx
import Auftraege from '@/pages/Auftraege';

// In routes:
<Route path="/auftraege" element={<Auftraege />} />
```

### 2. Sidebar Navigation (src/components/layout/AppSidebar.tsx)

```tsx
{
  title: 'Aufträge',
  url: '/auftraege',
  icon: FileText,
}
```

### 3. StandardTableTemplate Integration

Ersetze den Platzhalter-Content:

```tsx
import { StandardTableTemplate } from '@/components/shared/StandardTableTemplate';

// In UniversalMasterDashboardTemplate children:
<StandardTableTemplate
  data={data}
  columns={[
    { id: 'id', label: 'ID', width: '100px' },
    { id: 'customer_name', label: 'Kunde', width: 'auto' },
    { id: 'price', label: 'Preis', width: '120px' },
  ]}
  onRowClick={(row) => console.log('Clicked:', row)}
/>
```

### 4. EnhancedDetailDialog

```tsx
import { EnhancedDetailDialog } from '@/components/shared/EnhancedDetailDialog';

<EnhancedDetailDialog
  open={detailDialogOpen}
  onOpenChange={setDetailDialogOpen}
  title="Auftrag Details"
  data={selectedItem}
  fields={[
    { label: 'ID', value: selectedItem?.id },
    { label: 'Kunde', value: selectedItem?.customer_name },
  ]}
/>
```

## Example: Fahrer Dashboard

```bash
npx tsx scripts/generate-dashboard.ts \
  --name="Fahrer" \
  --title="Fahrer" \
  --table="drivers"
```

Generiert:
```tsx
import { UniversalMasterDashboardTemplate } from '@/components/dashboard/UniversalMasterDashboardTemplate';

export default function Fahrer() {
  // State & Data Fetching
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // KPIs
  const kpis = [
    { label: 'Gesamt', value: data.length, icon: Users },
  ];
  
  // Quick Actions
  const quickActions = [
    { icon: Plus, label: 'Neu erstellen', action: () => {} },
  ];
  
  return (
    <UniversalMasterDashboardTemplate
      pageTitle="Fahrer - MyDispatch"
      headerTitle="Fahrer"
      kpis={kpis}
      quickActions={quickActions}
      loading={loading}
    >
      {/* Content */}
    </UniversalMasterDashboardTemplate>
  );
}
```

## Testing

Nach Generierung:

### Visual Regression Test

```bash
npx playwright test tests/e2e/visual-regression/fahrer-dashboard.spec.ts
```

### Manual Testing Checklist

- [ ] Dashboard lädt ohne Fehler
- [ ] KPIs zeigen korrekte Werte
- [ ] Quick Actions funktionieren
- [ ] Export funktioniert (alle Formate)
- [ ] Filter funktionieren
- [ ] Responsive auf Mobile/Tablet/Desktop
- [ ] Loading States korrekt
- [ ] Error States korrekt

## Migration von bestehenden Dashboards

### Schritt 1: Config erstellen

Analysiere bestehenden Dashboard und erstelle Config:

```json
{
  "name": "AltesAuftraegeDashboard",
  "title": "Aufträge",
  "route": "/auftraege",
  "supabaseTable": "bookings",
  "kpis": [/* KPIs aus altem Dashboard */],
  "hasQuickActions": true,
  "hasExport": true,
  "hasFilters": true
}
```

### Schritt 2: Neu generieren

```bash
npx tsx scripts/generate-dashboard.ts --config=migration-configs/auftraege.json
```

### Schritt 3: Custom Logic migrieren

Kopiere Custom Functions aus altem Dashboard:
- Event Handler
- Custom Calculations
- Business Logic

### Schritt 4: Testen & Deployen

```bash
npm run test:e2e
npm run build
```

## Troubleshooting

### "Template not found"
→ Stelle sicher, dass `UniversalMasterDashboardTemplate.tsx` existiert

### "Icon not found"
→ Prüfe, ob Icon-Name korrekt ist (siehe Lucide.dev)

### "TypeScript errors"
→ Führe `npm run lint:fix` aus

### "Build fails"
→ Prüfe ob alle Imports korrekt sind

## Best Practices

✅ **DO:**
- Nutze semantische Icon-Namen (FileText für Dokumente, Euro für Geld)
- Implementiere Loading States
- Implementiere Error Handling
- Nutze V28Button statt ui/button
- Schreibe Tests für kritische Dashboards

❌ **DON'T:**
- Editiere generierte Files manuell (regeneriere stattdessen)
- Nutze `ui/button` (Claude Code Guardian wird rejecten!)
- Vergesse Routes hinzuzufügen
- Überspringe Tests

## Support

Probleme? Kontaktiere:
- NeXify AI Agent (Master Dashboard)
- Claude Code Guardian (automatische Reviews)
- Dokumentation: docs/NEXIFY_WIKI_V1.0.md
