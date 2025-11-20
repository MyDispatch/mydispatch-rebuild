# 📋 DASHBOARD NAMING CONVENTIONS V18.3.24

**Datum**: 20.01.2025  
**Status**: ✅ ZWINGEND SYSTEMWEIT  
**Gültigkeit**: Alle Dashboard-Seiten, Widgets und Komponenten

---

## 🚨 ABSOLUTE REGEL: EINHEITLICHE BETITELUNGEN

**KRITISCH**: Alle Widget-Titel MÜSSEN systemweit **exakt gleich** lauten!

### Warum?

- **Nutzerfreundlichkeit**: Keine Verwirrung durch unterschiedliche Bezeichnungen
- **Konsistenz**: Professioneller, einheitlicher Auftritt
- **Wiedererkennbarkeit**: Nutzer finden Funktionen schneller

---

## 📊 DASHBOARD V18.3 - STANDARDISIERTE TITEL

### Linke Spalte (Operativ - 8 Cols)

| Position | Widget              | Titel (ZWINGEND)       | Beschreibung                    |
| -------- | ------------------- | ---------------------- | ------------------------------- |
| 1        | `RevenueChart`      | **Umsatz-Entwicklung** | Chart mit 7-Tage-Verlauf        |
| 2        | `HEREMapComponent`  | **Live-Karte**         | Interaktive Karte mit GPS       |
| 3        | `Schnellzugriff`    | **Schnellzugriff**     | 4 Hauptaktions-Buttons          |
| 4        | `Tagesübersicht`    | **Tagesübersicht**     | Aufträge/Fahrer/Fahrzeuge heute |
| 5        | `Offene Rechnungen` | **Offene Rechnungen**  | Überfällig & Ausstehend         |

### Rechte Spalte (Monitoring - 4 Cols)

| Position | Widget                 | Titel (ZWINGEND)       | Beschreibung                   |
| -------- | ---------------------- | ---------------------- | ------------------------------ |
| 1        | `UrgentActionsWidget`  | **Dringende Aktionen** | Kritische Hinweise ZUERST!     |
| 2        | `PaymentMethodsChart`  | **Zahlungsarten**      | Pie-Chart Bar/Rechnung/Karte   |
| 3        | `ResourceStatusWidget` | **Fahrer-Status**      | Live-Status Fahrer + Fahrzeuge |
| 4        | `StatisticsWidget`     | **Vergleich & Trends** | Gestern/Woche/Monat            |
| 5        | `ActivityTimeline`     | **Letzte Aktivitäten** | Live-Timeline Events           |

---

## 🔤 NAMING-PATTERNS

### Widget-Titel (CardTitle)

```tsx
// ✅ RICHTIG: Kurz, prägnant, eindeutig
<CardTitle className="text-sm font-semibold">
  Umsatz-Entwicklung
</CardTitle>

// ❌ FALSCH: Zu lang, unspezifisch
<CardTitle className="text-sm font-semibold">
  Statistik-Überblick über Umsätze
</CardTitle>
```

### Sub-Headlines (CardDescription)

```tsx
// ✅ RICHTIG: Ergänzende Info
<CardDescription className="text-[10px]">
  Letzte 7 Tage
</CardDescription>

// ❌ FALSCH: Titel-Wiederholung
<CardDescription className="text-[10px]">
  Umsatz-Entwicklung Details
</CardDescription>
```

---

## 🎯 LOGISCHE ANORDNUNG

### Priorisierung (Top → Bottom)

**Linke Spalte**: Operativ (Aktionen → Überblick)

1. **Finanzen** (Revenue Chart)
2. **Visueller Überblick** (Live-Karte)
3. **Hauptaktionen** (Schnellzugriff)
4. **Tages-Zusammenfassung** (Tagesübersicht)
5. **Follow-up** (Offene Rechnungen)

**Rechte Spalte**: Monitoring (Wichtig → Detail)

1. **KRITISCH** (Dringende Aktionen) ← IMMER ZUERST!
2. **Finanzen Detail** (Zahlungsarten)
3. **Ressourcen Live** (Fahrer-Status)
4. **Vergleiche** (Vergleich & Trends)
5. **Historie** (Letzte Aktivitäten)

---

## ❌ HÄUFIGE FEHLER (VERBOTEN!)

### 1. Inkonsistente Titel

```tsx
// ❌ FALSCH: Verschiedene Bezeichnungen für gleiche Funktion
<CardTitle>Fahrer Live-Status</CardTitle>      // Dashboard
<CardTitle>Ressourcen-Status</CardTitle>        // Detail-Seite
<CardTitle>Fahrer-Übersicht</CardTitle>         // Mobile

// ✅ RICHTIG: Immer gleich
<CardTitle>Fahrer-Status</CardTitle>            // Überall!
```

### 2. Zu lange Titel

```tsx
// ❌ FALSCH: Zu ausführlich
<CardTitle>Statistik-Überblick über die letzten Tage</CardTitle>

// ✅ RICHTIG: Kompakt
<CardTitle>Vergleich & Trends</CardTitle>
```

### 3. Unspezifische Titel

```tsx
// ❌ FALSCH: Zu allgemein
<CardTitle>Übersicht</CardTitle>
<CardTitle>Daten</CardTitle>
<CardTitle>Status</CardTitle>

// ✅ RICHTIG: Spezifisch
<CardTitle>Tagesübersicht</CardTitle>
<CardTitle>Zahlungsarten</CardTitle>
<CardTitle>Fahrer-Status</CardTitle>
```

### 4. Falsche Priorisierung

```tsx
// ❌ FALSCH: Wichtiges am Ende
<div className="lg:col-span-4 space-y-3">
  <PaymentMethodsChart />
  <StatisticsWidget />
  <UrgentActionsWidget />  // ← KRITISCH, gehört nach OBEN!
</div>

// ✅ RICHTIG: Wichtiges zuerst
<div className="lg:col-span-4 space-y-3">
  <UrgentActionsWidget />  // ← IMMER ZUERST!
  <PaymentMethodsChart />
  <StatisticsWidget />
</div>
```

---

## 📝 WIDGET-KOMPONENTEN-MAPPING

### Komponenten-Datei → Titel-Mapping

```tsx
// src/components/dashboard/UrgentActionsWidget.tsx
<CardTitle>Dringende Aktionen</CardTitle>

// src/components/dashboard/ResourceStatusWidget.tsx
<CardTitle>Fahrer-Status</CardTitle>

// src/components/dashboard/StatisticsWidget.tsx
<CardTitle>Vergleich & Trends</CardTitle>

// src/components/dashboard/ActivityTimeline.tsx
<CardTitle>Letzte Aktivitäten</CardTitle>

// src/components/dashboard/RevenueChart.tsx (RevenueChart)
<CardTitle>Umsatz-Entwicklung</CardTitle>

// src/components/dashboard/RevenueChart.tsx (PaymentMethodsChart)
<CardTitle>Zahlungsarten</CardTitle>
```

---

## 🔧 CHECKLISTE FÜR NEUE WIDGETS

Vor jedem neuen Widget prüfen:

- [ ] Titel ist **kurz** (max. 3 Wörter)
- [ ] Titel ist **eindeutig** (nicht "Übersicht")
- [ ] Titel ist **spezifisch** (beschreibt Inhalt)
- [ ] Titel ist **systemweit konsistent** (Dokumentation prüfen!)
- [ ] Position ist **logisch** (Wichtiges zuerst)
- [ ] Icon passt zum Titel
- [ ] CardDescription ergänzt, wiederholt nicht

---

## 🌍 MULTI-LANGUAGE (ZUKUNFT)

Falls später Internationalisierung benötigt:

```tsx
// Titel-Keys (i18n)
const WIDGET_TITLES = {
  de: {
    revenue: "Umsatz-Entwicklung",
    driverStatus: "Fahrer-Status",
    urgentActions: "Dringende Aktionen",
    // ...
  },
  en: {
    revenue: "Revenue Overview",
    driverStatus: "Driver Status",
    urgentActions: "Urgent Actions",
    // ...
  },
};
```

**WICHTIG**: Auch bei i18n müssen die Keys **systemweit gleich** sein!

---

## 📚 REFERENZEN

- **Dashboard Design-Vorgaben**: `docs/DASHBOARD_DESIGN_VORGABEN.md`
- **V18.3 Gesamtkonzept**: Custom Knowledge
- **Corporate Design Manual**: V1.0

---

**Version**: 18.3.24  
**Letzte Aktualisierung**: 20.01.2025  
**Verantwortlich**: System-Architektur  
**Status**: ✅ PRODUKTIV
