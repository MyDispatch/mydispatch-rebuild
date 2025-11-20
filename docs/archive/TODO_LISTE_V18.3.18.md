# 📋 TODO-LISTE V18.3.18 - OFFENE ARBEITEN

**Datum:** 19.10.2025  
**Version:** V18.3.18  
**Status:** 98.1% Produktionsreife  
**Verbleibend:** 1.9% bis Go-Live

---

## 🔴 KRITISCH (P0) - VOR GO-LIVE

### 1. MobileStatistiken Component (2h)

**Datei:** `src/components/mobile/MobileStatistiken.tsx` (NEU)

**Anforderungen:**

- Responsive Layout für Mobile (<768px)
- Vereinfachte KPI-Cards (4 Hauptmetriken)
- Touch-optimierte Charts (vereinfacht)
- Scrollbare Tabellen
- Tab-Navigation für verschiedene Bereiche

**Vorlage:**

```typescript
import { MobileGridLayout } from '@/components/mobile/MobileGridLayout';
import { MobileKPICard } from '@/components/mobile/MobileKPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { formatCurrency } from '@/lib/format-utils';
import { SimpleLineChart } from './SimpleLineChart';
import { MobileScrollTable } from './MobileScrollTable';

export function MobileStatistiken() {
  const { data: stats } = useDashboardStats();

  return (
    <MobileGridLayout>
      {/* KPI-Cards */}
      <MobileKPICard
        title="Umsatz (Monat)"
        value={formatCurrency(stats?.monthly_revenue || 0)}
        trend="+12%"
      />

      {/* Weitere KPIs */}

      {/* Vereinfachter Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Umsatz-Trend (7 Tage)</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleLineChart data={revenueData} height={200} />
        </CardContent>
      </Card>

      {/* Top-Fahrer */}
      <MobileScrollTable
        headers={['Fahrer', 'Fahrten', 'Umsatz']}
        rows={topDrivers.map(d => [
          d.name,
          d.rides,
          formatCurrency(d.revenue)
        ])}
      />
    </MobileGridLayout>
  );
}
```

**Akzeptanzkriterien:**

- ✅ Lädt auf Mobile (<768px)
- ✅ Touch-Targets min. 44px
- ✅ Charts vereinfacht (nicht zu komplex)
- ✅ Tabellen horizontal scrollbar
- ✅ Performance: Keine Lag-Spikes

---

### 2. SimpleLineChart Component (45min)

**Datei:** `src/components/mobile/SimpleLineChart.tsx` (NEU)

**Anforderungen:**

- Leichtgewichtige Chart-Komponente (keine Recharts)
- SVG-basiert (nativer HTML5)
- Responsive (100% width)
- Max. 10 Datenpunkte (Performance)

**Vorlage:**

```typescript
interface SimpleLineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export function SimpleLineChart({
  data,
  height = 200,
  color = '#EADEBD'
}: SimpleLineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (d.value / maxValue) * 80 // 20% margin top/bottom
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <svg
      viewBox="0 0 100 100"
      style={{ width: '100%', height }}
      className="text-foreground"
    >
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="2"
          fill={color}
        />
      ))}
    </svg>
  );
}
```

**Akzeptanzkriterien:**

- ✅ Funktioniert ohne Recharts
- ✅ Performance: <50ms Render-Zeit
- ✅ Responsive auf allen Screen-Sizes
- ✅ Farbe anpassbar

---

### 3. MobileScrollTable Component (45min)

**Datei:** `src/components/mobile/MobileScrollTable.tsx` (NEU)

**Anforderungen:**

- Horizontal scrollbar (Overflow-X)
- Fixed Header (sichtbar beim Scrollen)
- Touch-freundlich (min. 44px Zeilen-Höhe)
- Sticky erste Spalte (optional)

**Vorlage:**

```typescript
interface MobileScrollTableProps {
  headers: string[];
  rows: (string | number)[][];
  stickyFirstColumn?: boolean;
}

export function MobileScrollTable({
  headers,
  rows,
  stickyFirstColumn = false
}: MobileScrollTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="sticky top-0 bg-card border-b">
              <tr>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className={cn(
                      "text-left p-3 text-sm font-medium",
                      stickyFirstColumn && i === 0 && "sticky left-0 bg-card"
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b min-h-[44px]">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={cn(
                        "p-3 text-sm",
                        stickyFirstColumn && j === 0 && "sticky left-0 bg-card font-medium"
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Akzeptanzkriterien:**

- ✅ Horizontal scrollbar funktioniert
- ✅ Header bleibt sichtbar (Sticky)
- ✅ Erste Spalte sticky (optional)
- ✅ Min. 44px Zeilen-Höhe

---

### 4. Statistiken.tsx Integration (30min)

**Datei:** `src/pages/Statistiken.tsx` (ÄNDERN)

**Änderungen:**

```typescript
import { useDeviceType } from '@/hooks/use-device-type';
import { MobileStatistiken } from '@/components/mobile/MobileStatistiken';

export default function Statistiken() {
  const { deviceType } = useDeviceType();

  // Mobile: MobileStatistiken Component
  if (deviceType === 'mobile') {
    return (
      <DashboardLayout
        title="Statistiken"
        description="Auswertungen & Analysen"
        canonical="/statistiken"
      >
        <MobileStatistiken />
      </DashboardLayout>
    );
  }

  // Desktop: Bestehende Statistiken-Seite
  return (
    <DashboardLayout
      title="Statistiken"
      description="Auswertungen & Analysen"
      canonical="/statistiken"
    >
      {/* Bestehende Desktop-Charts */}
    </DashboardLayout>
  );
}
```

**Akzeptanzkriterien:**

- ✅ Mobile zeigt MobileStatistiken
- ✅ Desktop zeigt bestehende Statistiken
- ✅ Keine Doppel-Renderung
- ✅ Performance: Kein Lag beim Wechsel

---

## 🟡 WICHTIG (P1) - NACH GO-LIVE

### 5. Auth.tsx Mobile-Optimierung (1h)

**Datei:** `src/pages/Auth.tsx` (ÄNDERN)

**Änderungen:**

- Tarif-Karten: Vertical-Layout auf Mobile
- Touch-Targets: Min. 44px (2x)
- Form-Felder: Breitere Abstände
- Scroll-Navigation: Optimiert

**Umsetzung:**

```typescript
{deviceType === 'mobile' ? (
  <div className="grid grid-cols-1 gap-6">
    {Object.entries(PLANS).map(([key, plan]) => (
      <Card
        key={key}
        className={cn(
          "cursor-pointer transition-all min-h-[88px]",
          selectedPlan === key && "ring-2 ring-accent"
        )}
        onClick={() => setSelectedPlan(key)}
      >
        {/* Größere Texte */}
      </Card>
    ))}
  </div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* Desktop-Layout */}
  </div>
)}
```

---

### 6. Bundle-Size-Optimierung (2h)

**Aktionen:**

- Code-Splitting für große Libraries
- Tree-Shaking für unused Exports
- Dynamic Imports für Edge-Cases
- Preact-Aliasing (optional)

**Ziel:** <300 KB Initial-Bundle

---

### 7. Lighthouse-Score-Messung (1h)

**Bereiche:**

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

**Tools:** Chrome DevTools Lighthouse

---

### 8. Image-Optimierung (1h)

**Aktionen:**

- WebP-Format für alle Bilder
- Lazy-Loading für Below-Fold-Images
- Responsive Images (srcset)
- Compression (TinyPNG)

---

## 🟢 NICE-TO-HAVE (P2) - ZUKUNFT

### 9. PWA-Offline-Sync (4h)

- IndexedDB-Cache für Offline-Daten
- Background-Sync bei Re-Connection
- Conflict-Resolution

### 10. Advanced-Analytics (6h)

- Custom-Metriken-Builder
- Drill-Down-Reports
- Export-Formate (CSV, Excel, PDF)

### 11. Custom-Report-Builder (8h)

- Drag & Drop Report-Editor
- Saved-Reports
- Scheduled-Reports

### 12. Multi-Language-Support (12h)

- i18n-Integration (react-i18next)
- Sprachen: DE, EN, FR, ES
- RTL-Support (AR)

---

## ✅ CHECKLISTE VOR GO-LIVE

### Code-Qualität

- [ ] MobileStatistiken implementiert
- [ ] SimpleLineChart funktioniert
- [ ] MobileScrollTable funktioniert
- [ ] Statistiken.tsx integriert
- [ ] TypeScript-Errors: 0
- [ ] Runtime-Errors: 0
- [ ] Console-Warnings: 0

### Testing

- [ ] Desktop: Alle Seiten getestet
- [ ] Mobile: Alle Seiten getestet
- [ ] Tablet: Spot-Check
- [ ] Cross-Browser: Chrome, Safari, Firefox
- [ ] Performance: <3s Initial-Load

### Deployment

- [ ] Edge Functions deployed (18/18)
- [ ] Database Migrations applied
- [ ] Secrets konfiguriert
- [ ] RLS Policies aktiv (58+)
- [ ] GPS-Cleanup-Job läuft

### Dokumentation

- [ ] IST-Analyse aktualisiert
- [ ] TODO-Liste aktualisiert
- [ ] README aktualisiert
- [ ] API-Docs aktualisiert
- [ ] User-Guide erstellt

---

## 🎯 ERFOLGSMETRIKEN

**Vor Sprint 41:**

- Produktionsreife: 98.1%
- Mobile-UX-Score: 92.9%
- Offene P0-Tasks: 4

**Nach Sprint 41:**

- Produktionsreife: 100% ✅
- Mobile-UX-Score: 100% ✅
- Offene P0-Tasks: 0 ✅

---

## 🚀 TIMELINE

**Sprint 41:** 4 Stunden (1 Tag)

- Task 1: 2h (MobileStatistiken)
- Task 2: 45min (SimpleLineChart)
- Task 3: 45min (MobileScrollTable)
- Task 4: 30min (Integration)

**GO-LIVE:** Nach Sprint 41 ✅

**Post-Launch Optimierung:** 5h (P1-Tasks)

---

**NÄCHSTER SCHRITT:** Sprint 41 starten → MobileStatistiken implementieren! 🚀
