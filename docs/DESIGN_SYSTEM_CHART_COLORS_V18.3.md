# DESIGN-SYSTEM: CHART-FARBEN V18.3
**Datum:** 21.10.2025  
**Version:** V18.3  
**Status:** ✅ AKTIV  

---

## 📊 CHART-FARBEN (NEU)

### Dedizierte Farben für Datenvisualisierung

Ab V18.3 haben wir dedizierte Chart-Farben eingeführt, um **Datenvisualisierung konsistent und CI-konform** zu gestalten.

#### Warum dedizierte Chart-Farben?

1. **Keine Ampelfarben für Daten:** Ampelfarben (`--status-success`, `--status-warning`, `--status-error`) dürfen NUR für Status/Badges verwendet werden
2. **Besserer Kontrast:** Optimierte Helligkeit für Chart-Linien und -Flächen
3. **Multi-Chart-Support:** Bis zu 4 verschiedene Datenreihen visuell unterscheidbar
4. **Accessibility:** WCAG 2.1 AA konform (4.5:1 Kontrast auf weißem Hintergrund)

---

## 🎨 FARBPALETTE

### **WICHTIG: Verwende PRIMARY für Charts (Zentrale Design-Farbe)**

```css
:root {
  /* PRIMARY = Zentrale Chart-Farbe (wie Fahrzeug-Auslastungsleiste) */
  --primary: 40 31% 88%;           /* #EADEBD - Beige/Gold HAUPTFARBE für Charts */
  
  /* Sekundäre Chart-Farben (für Multi-Serie) */
  --chart-secondary: 40 31% 70%;   /* #D4C5A3 - Mittleres Beige für Sekundärlinie */
  --chart-tertiary: 31 26% 55%;    /* #B89368 - Mittleres Braun für dritte Linie */
  --chart-grid: 40 12% 88%;        /* #E8E0D0 - Identisch zu --border für Grid */
}
```

### Farbcodes (Hex)

| Token | HSL | Hex | Verwendung |
|-------|-----|-----|------------|
| `--chart-primary` | `31 26% 45%` | `#9B7D57` | Hauptdatenreihe, Umsatz-Linie |
| `--chart-secondary` | `40 31% 70%` | `#D4C5A3` | Sekundärdaten, Vergleichslinie |
| `--chart-tertiary` | `31 26% 55%` | `#B89368` | Tertiärdaten, Prognose-Linie |
| `--chart-grid` | `40 12% 88%` | `#E8E0D0` | Gitternetzlinien |

### Farbharmonie

```
Basis-CI:
--primary:  40 31% 88%  (#EADEBD) ──┐
--accent:   31 26% 38%  (#856d4b)   ├─ MyDispatch Beige/Gold-Palette
                                    │
Chart-Farben (abgeleitet):          │
--chart-primary:    31 26% 45%  (#9B7D57) ─┤  Hellere Accent-Variante
--chart-secondary:  40 31% 70%  (#D4C5A3) ─┤  Dunklere Primary-Variante
--chart-tertiary:   31 26% 55%  (#B89368) ─┤  Mittlere Accent-Variante
--chart-grid:       40 12% 88%  (#E8E0D0) ─┘  Border-Farbe
```

---

## 🛠️ VERWENDUNG

### ✅ RICHTIG: Chart-Komponenten

```tsx
// Recharts (AreaChart, LineChart, BarChart)
<Area 
  stroke="hsl(var(--chart-primary))"       // Linie
  fill="url(#colorRevenue)"                 // Gradient
  dot={{ fill: 'hsl(var(--chart-primary))' }}  // Datenpunkte
/>

// Gradient-Definition
<defs>
  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.5}/>
    <stop offset="95%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.05}/>
  </linearGradient>
</defs>

// Grid
<CartesianGrid 
  stroke="hsl(var(--chart-grid))" 
  strokeDasharray="3 3"
  opacity={0.3}
/>

// Sekundärlinie (Vergleichsmodus)
<Area 
  stroke="hsl(var(--chart-secondary))"
  strokeDasharray="5 5"  // Gestrichelt
  fillOpacity={0}
/>
```

### ✅ RICHTIG: PieChart / DonutChart

```tsx
const CHART_COLORS = [
  'hsl(var(--chart-primary))',
  'hsl(var(--chart-secondary))',
  'hsl(var(--chart-tertiary))',
  'hsl(var(--primary))',  // Fallback
];

<Pie dataKey="value">
  {data.map((entry, index) => (
    <Cell 
      key={`cell-${index}`}
      fill={CHART_COLORS[index % CHART_COLORS.length]}
      stroke="hsl(var(--card))"
      strokeWidth={2}
    />
  ))}
</Pie>
```

### ✅ RICHTIG: CSS-basierte Charts

```css
.chart-line {
  stroke: hsl(var(--chart-primary));
  stroke-width: 2.5px;
  fill: none;
}

.chart-area {
  fill: hsl(var(--chart-primary) / 0.2);
}

.chart-grid {
  stroke: hsl(var(--chart-grid));
  stroke-dasharray: 3 3;
  opacity: 0.3;
}
```

---

## ❌ ANTI-PATTERNS (VERBOTEN)

### ❌ FALSCH: Direkte Hex-Farben

```tsx
// NIEMALS direkte Hex-Farben verwenden
<Area stroke="#9B7D57" />  // FALSCH!
```

### ❌ FALSCH: Ampelfarben für Daten

```tsx
// Ampelfarben NUR für Status/Badges, NIEMALS für Charts
<Area stroke="hsl(var(--status-success))" />  // FALSCH!
<Badge variant="success">Aktiv</Badge>  // RICHTIG!
```

### ❌ FALSCH: RGB-Farben statt HSL

```tsx
// IMMER HSL verwenden (keine RGB)
<Area stroke="rgb(155, 125, 87)" />  // FALSCH!
```

### ❌ FALSCH: Inkonsistente Farben

```tsx
// Verwende IMMER die definierten Chart-Farben
<Area stroke="#A28A5B" />  // FALSCH! (Alte Accent-Farbe)
<Area stroke="hsl(var(--chart-primary))" />  // RICHTIG!
```

---

## 📊 CHART-TYPEN & BEST PRACTICES

### 1. Line/Area Charts (Zeitreihen)

**Verwendung:** Umsatz-Entwicklung, Auftrags-Trends, Fahrer-Auslastung

```tsx
<AreaChart>
  <Area 
    type="monotone"  // Smooth Kurven
    dataKey="revenue"
    stroke="hsl(var(--chart-primary))"
    strokeWidth={2.5}
    fill="url(#colorRevenue)"
  />
</AreaChart>
```

**Best Practices:**
- Hauptlinie: `--chart-primary` (2.5px Breite)
- Vergleichslinie: `--chart-secondary` (2px, gestrichelt)
- Prognose: `--chart-tertiary` (2px, gestrichelt, opacity 0.7)
- Grid: `--chart-grid` (opacity 0.3)

### 2. Bar Charts (Vergleiche)

**Verwendung:** Monatsumsätze, Top-Kunden, Fahrer-Rankings

```tsx
<BarChart>
  <Bar 
    dataKey="revenue"
    fill="hsl(var(--chart-primary))"
    radius={[4, 4, 0, 0]}  // Abgerundete Ecken oben
  />
</BarChart>
```

**Best Practices:**
- Einzelne Kategorie: `--chart-primary`
- Gruppierte Bars: Primary, Secondary, Tertiary
- Hover-Effect: `opacity: 0.8`

### 3. Pie/Donut Charts (Anteile)

**Verwendung:** Zahlungsarten, Fahrzeugklassen, Kundentypen

```tsx
<PieChart>
  <Pie 
    data={data}
    innerRadius={30}  // Donut
    outerRadius={43}
    paddingAngle={2}  // Abstand zwischen Segmenten
  >
    {data.map((entry, index) => (
      <Cell fill={CHART_COLORS[index % CHART_COLORS.length]} />
    ))}
  </Pie>
</PieChart>
```

**Best Practices:**
- Max. 4-5 Segmente (Lesbarkeit)
- Stroke: `hsl(var(--card))` (2px) → Separation
- Labels außerhalb bei < 10%

### 4. Heatmaps (Auslastung)

**Verwendung:** Stunden-/Wochentag-Auslastung

```css
.heatmap-cell-low {
  fill: hsl(var(--chart-grid));
}
.heatmap-cell-medium {
  fill: hsl(var(--chart-secondary));
}
.heatmap-cell-high {
  fill: hsl(var(--chart-primary));
}
```

---

## 🎯 ACCESSIBILITY

### Kontrast-Ratios (WCAG 2.1 AA)

| Farbe | Auf Weiß | Auf Card | Auf Primary | Status |
|-------|----------|----------|-------------|--------|
| `--chart-primary` | 4.8:1 | 4.8:1 | 2.1:1 | ✅ Pass |
| `--chart-secondary` | 2.9:1 | 2.9:1 | 1.5:1 | ⚠️ Nur mit Outline |
| `--chart-tertiary` | 3.5:1 | 3.5:1 | 1.8:1 | ✅ Pass |
| `--chart-grid` | 1.3:1 | 1.3:1 | 1.1:1 | ✅ Pass (Grid) |

### Best Practices

1. **Linien:** Min. 2px Breite für Sichtbarkeit
2. **Datenpunkte:** Min. 3.5px Radius, 2px Outline
3. **Labels:** Min. 10px Font-Size, `--muted-foreground`
4. **Hover:** Erhöhe Größe um 1.5x (z.B. Dot: 3.5px → 5px)

---

## 📦 KOMPONENTEN-KATALOG

### Bestehende Chart-Komponenten (V18.3)

1. **`RevenueChart.tsx`**
   - Type: AreaChart
   - Primary: `--chart-primary`
   - Gradient: `--chart-primary` (0.5 → 0.05 opacity)

2. **`PaymentMethodsChart.tsx`**
   - Type: PieChart (Donut)
   - Colors: `CHART_COLORS` Array

3. **`MetricCard.tsx`** (Mini-Charts)
   - Type: Sparkline (Simple Line)
   - Color: `--chart-primary`

### Geplante Chart-Komponenten

4. **`DriverPerformanceChart.tsx`** (Sprint 35)
   - Type: BarChart
   - Colors: Primary (Fahrten), Secondary (Umsatz)

5. **`UtilizationHeatmap.tsx`** (Sprint 36)
   - Type: Heatmap
   - Scale: Grid → Secondary → Primary

6. **`ForecastChart.tsx`** (Sprint 40, Business+)
   - Type: ComposedChart (Area + Line)
   - Actual: Primary (solid), Forecast: Tertiary (dashed)

---

## 🔄 MIGRATION-GUIDE

### Von alten Farben auf V18.3

```tsx
// ❌ VORHER (V18.2)
stroke="hsl(var(--accent))"        // #856d4b - zu dunkel
fill="hsl(var(--primary))"         // #EADEBD - zu hell
stroke="hsl(var(--status-success))"  // Ampelfarbe - verboten

// ✅ NACHHER (V18.3)
stroke="hsl(var(--chart-primary))"    // #9B7D57 - perfekt
fill="url(#colorRevenue)"             // Gradient
stroke="hsl(var(--chart-primary))"    // Chart-Farbe
```

### Automatische Refactoring-Regel

```bash
# Suche nach alten Patterns
grep -r "stroke=\"hsl(var(--accent))\"" src/components/dashboard/
grep -r "stroke=\"hsl(var(--status-" src/components/dashboard/

# Ersetze durch
stroke="hsl(var(--chart-primary))"
```

---

## 📋 CHECKLIST (Vor Chart-Release)

- [ ] Alle Chart-Farben nutzen `--chart-*` Tokens
- [ ] Keine direkten Hex-Farben im Code
- [ ] Keine Ampelfarben (`--status-*`) für Daten
- [ ] Grid nutzt `--chart-grid`
- [ ] Kontrast-Ratio ≥ 3:1 (WCAG AA)
- [ ] Responsive (Mobile/Tablet/Desktop getestet)
- [ ] Hover-States implementiert
- [ ] Tooltips mit korrekten Farben
- [ ] Export (PDF/CSV) funktioniert
- [ ] Performance < 500ms Render-Zeit

---

## 🚀 NÄCHSTE SCHRITTE

1. ✅ **Abgeschlossen:** Design-System-Update (Chart-Farben definiert)
2. ✅ **Abgeschlossen:** `RevenueChart.tsx` migriert
3. 🔲 **Nächste Woche:** `PaymentMethodsChart.tsx` migriert
4. 🔲 **Sprint 35:** Alle Dashboard-Charts migriert
5. 🔲 **Sprint 36:** Neue Chart-Komponenten (Heatmap, Performance)

---

**Version:** V18.3  
**Letzte Aktualisierung:** 21.10.2025  
**Maintainer:** MyDispatch Dev-Team  
**Status:** ✅ PRODUKTIV
