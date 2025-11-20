# Dashboard Design V28.1 Master Documentation

**Version:** V28.1  
**Status:** ✅ ACTIVE STANDARD  
**Datum:** 2025-10-29  
**Ersetzt:** V26.1 (jetzt LEGACY), V18.3.24 (jetzt OBSOLETE)

---

## 🎯 ZIEL

V28.1 Professional Minimalism definiert den aktuellen Standard für alle Dashboard-Seiten, Widgets und UI-Komponenten in MyDispatch.

---

## 🎨 DESIGN-PRINZIPIEN

### Core-Philosophie: **Professional Minimalism**

1. **Pure Tailwind** - KEINE Custom CSS Classes, KEINE Token-Imports
2. **Slate Palette** - Professional Gray-Blue (nicht Dunkelblau/Beige)
3. **1px Borders** - Subtil statt prominent (V26.1 hatte 2-3px)
4. **Tailwind Shadows** - `shadow-sm`, `shadow-md`, `shadow-lg`
5. **200-300ms Transitions** - Schnell und responsiv
6. **Flat Design** - Keine Glassmorphism, keine Heavy Effects

---

## 🎨 FARBPALETTE

### Primärfarben (Slate)

```css
/* Backgrounds */
--background: rgb(255 255 255); /* Weiß */
--card: rgb(255 255 255); /* Weiß */

/* Text */
--slate-900: rgb(15 23 42); /* Haupttext */
--slate-700: rgb(51 65 85); /* Icon/Label */
--slate-600: rgb(71 85 105); /* Secondary Text */
--slate-500: rgb(100 116 139); /* Tertiary */

/* Borders & Dividers */
--slate-200: rgb(226 232 240); /* Standard Border */
--slate-100: rgb(241 245 249); /* Icon Background */
--slate-50: rgb(248 250 252); /* Subtle Background */

/* Status Colors */
--status-success: rgb(34 197 94); /* Grün */
--status-warning: rgb(251 146 60); /* Orange */
--status-error: rgb(239 68 68); /* Rot */
--status-info: rgb(59 130 246); /* Blau */
```

---

## 📐 LAYOUT-SYSTEM

### Grid-Struktur (Desktop)

**Standard Dashboard Layout:**

```tsx
<div className="grid grid-cols-12 gap-3">
  {/* Linke Spalte - 8 Cols */}
  <div className="col-span-8 space-y-3">{/* Widgets */}</div>

  {/* Rechte Spalte - 4 Cols */}
  <div className="col-span-4 space-y-3">{/* Widgets */}</div>
</div>
```

**Mobile (< 768px):**

```tsx
<div className="space-y-3">{/* Alle Widgets full-width, gestacked */}</div>
```

### Spacing-Standards

| Element             | Desktop            | Mobile             |
| ------------------- | ------------------ | ------------------ |
| Gap zwischen Cards  | `gap-3` (12px)     | `gap-3` (12px)     |
| Vertical Spacing    | `space-y-3` (12px) | `space-y-3` (12px) |
| Card Padding        | `p-3` (12px)       | `p-3` (12px)       |
| Page Bottom Padding | `pb-[128px]`       | `pb-16` (64px)     |

---

## 🧩 KOMPONENTEN-STANDARDS

### Card-Struktur

```tsx
<Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
  <CardHeader className="pb-3">
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-lg bg-slate-100">
        <Icon className="h-4 w-4 text-slate-700" />
      </div>
      <CardTitle className="text-sm font-semibold text-slate-900">Widget-Titel</CardTitle>
    </div>
  </CardHeader>
  <CardContent className="pb-3">{/* Content */}</CardContent>
</Card>
```

### Typografie

| Element       | Tailwind Class          | Größe   | Weight                     |
| ------------- | ----------------------- | ------- | -------------------------- |
| Widget-Titel  | `text-sm`               | 14px    | `font-semibold`            |
| Body-Text     | `text-xs`               | 12px    | `font-medium`              |
| Meta-Text     | `text-[10px]`           | 10px    | `font-medium`              |
| Large Numbers | `text-2xl` - `text-5xl` | 24-48px | `font-bold` / `font-black` |

### Icon-Größen

| Kontext            | Tailwind Class | Größe |
| ------------------ | -------------- | ----- |
| Card Header Icon   | `h-4 w-4`      | 16px  |
| Timeline/List Icon | `h-4 w-4`      | 16px  |
| Small Badge Icon   | `h-3 w-3`      | 12px  |
| Large Feature Icon | `h-6 w-6`      | 24px  |

### Button-Styles

**Primary:**

```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
  Primär
</button>
```

**Secondary:**

```tsx
<button className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg font-semibold hover:bg-slate-200 transition-colors duration-200">
  Sekundär
</button>
```

---

## 📊 DASHBOARD WIDGETS V28.1

### Linke Spalte (8 Cols)

1. **RevenueChart** - Umsatz-Entwicklung (Area Chart, 7-Tage)
2. **HEREMapComponent** - Live-Karte (Fahrzeuge, Aufträge, Firmensitz)
3. **Quick Actions** - 2-3 Buttons (Neuer Auftrag, Schichtzettel, Team-Chat)
4. **TodayOverviewCard** - Tagesübersicht (Aufträge, Fahrer, Fahrzeuge heute)
5. **OpenInvoicesCard** - Offene Rechnungen (Offen, Überfällig, Summen)

### Rechte Spalte (4 Cols)

1. **UrgentActionsCard** - Dringende Aktionen (IMMER ZUERST!)
2. **PaymentMethodsChart** - Zahlungsarten (Pie Chart: Bar/Rechnung/Karte)
3. **ResourceStatusCard** - Fahrer-Status (Progress Bars, Kategorien)
4. **StatisticsCard** - Vergleich & Trends (Gestern/Woche/Monat)
5. **ActivityTimeline** - Letzte Aktivitäten (Scrollbare Timeline)

---

## 🎯 WIDGET-NAMING-CONVENTIONS

| Widget              | Titel (exakt)        | Icon            |
| ------------------- | -------------------- | --------------- |
| UrgentActionsCard   | "Dringende Aktionen" | `AlertTriangle` |
| PaymentMethodsChart | "Zahlungsarten"      | `Receipt`       |
| ResourceStatusCard  | "Fahrer-Status"      | `Users`         |
| StatisticsCard      | "Vergleich & Trends" | `BarChart3`     |
| ActivityTimeline    | "Letzte Aktivitäten" | `Activity`      |
| RevenueChart        | "Umsatz-Entwicklung" | `TrendingUp`    |
| TodayOverviewCard   | "Tagesübersicht"     | `Calendar`      |
| OpenInvoicesCard    | "Offene Rechnungen"  | `Receipt`       |

---

## 🔄 SCROLLBAR GOVERNANCE

### Globale Regeln

1. **Horizontal VERBOTEN** - `overflow-x: hidden !important` auf `html`, `body`
2. **Vertikal unauffällig** - 6px breit, `hsl(var(--border))`, transparent track
3. **Sidebar extra unauffällig** - 4px breit, fast unsichtbar
4. **Smooth Scrolling** - `scroll-behavior: smooth` auf `html`

### Implementation (src/index.css)

```css
/* Horizontal VERBOTEN */
html,
body {
  overflow-x: hidden !important;
  max-width: 100vw;
}

/* Vertikal unauffällig - Webkit */
::-webkit-scrollbar {
  width: 6px;
  height: 0px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 3px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.3);
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}

/* Sidebar extra unauffällig */
aside::-webkit-scrollbar {
  width: 4px;
}

aside::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.1);
}

aside::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.25);
}
```

### Utility-Klasse (tailwind.config.ts)

```typescript
plugins: [
  plugin(function ({ addUtilities }) {
    addUtilities({
      ".scrollbar-hide": {
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
    });
  }),
],
```

---

## 🚀 MIGRATION VON V26.1

### Was ändert sich?

| V26.1 (LEGACY)                        | V28.1 (ACTIVE)      |
| ------------------------------------- | ------------------- |
| Token-Imports (UNIFIED_DESIGN_TOKENS) | Pure Tailwind       |
| Dunkelblau/Beige (#323D5E, #EADEBD)   | Slate Palette (rgb) |
| 2-3px Borders                         | 1px Borders         |
| Custom CSS Classes (`.v26-*`)         | Tailwind Classes    |
| 300ms Transitions                     | 200ms Transitions   |
| Glassmorphism Effects                 | Flat Design         |

### Migration-Steps

1. **Remove Token-Imports:**

   ```tsx
   // ❌ V26.1
   import { UNIFIED_DESIGN_TOKENS } from "@/lib/unified-design-tokens-v26";

   // ✅ V28.1
   // No imports needed
   ```

2. **Replace Custom Classes:**

   ```tsx
   // ❌ V26.1
   className = "v26-bg-dunkelblau v26-text-beige v26-border-beige-20";

   // ✅ V28.1
   className = "bg-slate-900 text-slate-50 border border-slate-200";
   ```

3. **Update Shadows:**

   ```tsx
   // ❌ V26.1
   className = "v26-shadow-card-standard";

   // ✅ V28.1
   className = "shadow-sm hover:shadow-md";
   ```

4. **Simplify Transitions:**

   ```tsx
   // ❌ V26.1
   className = "v26-transition-all";

   // ✅ V28.1
   className = "transition-all duration-200";
   ```

---

## ✅ QUALITÄTSPRÜFUNG

### Checkliste pro Dashboard-Seite

- [ ] Pure Tailwind (keine Token-Imports)
- [ ] Slate Palette (keine Dunkelblau/Beige)
- [ ] 1px Borders überall
- [ ] `shadow-sm` / `shadow-md` / `shadow-lg` verwendet
- [ ] 200-300ms Transitions
- [ ] `gap-3` / `space-y-3` Spacing
- [ ] `pb-[128px]` Desktop, `pb-16` Mobile
- [ ] Keine horizontalen Scrollbars
- [ ] Vertikale Scrollbars unauffällig (6px, Slate)
- [ ] Widget-Titel aus Naming Conventions
- [ ] 8/4 Grid (Desktop), 1 Spalte (Mobile)
- [ ] 0 TypeScript Errors
- [ ] 0 Build Warnings

---

## 📝 CHANGELOG

### V28.1 (2025-10-29)

- ✅ Professional Minimalism als neuer Standard
- ✅ Slate Palette ersetzt Dunkelblau/Beige
- ✅ 1px Borders statt 2-3px
- ✅ Tailwind Shadows statt Custom Shadows
- ✅ 200ms Transitions statt 300ms
- ✅ Globale Scrollbar Governance
- ✅ 8 neue V28.1 Widgets erstellt
- ✅ scrollbar-hide Utility hinzugefügt

### V26.1 (LEGACY)

- ⚠️ Token-basiertes System (obsolete)
- ⚠️ Dunkelblau/Beige Farbschema (obsolete)
- ⚠️ Custom CSS Classes (obsolete)

---

**Status:** ✅ ACTIVE STANDARD  
**Version:** V28.1
