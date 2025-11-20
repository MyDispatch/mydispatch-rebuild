# SEITEN-PLANUNGSPROZESS V18.5.1

**Erstellt:** 23.10.2025 22:47 Uhr (DE)  
**Version:** 18.5.1 PRODUCTION-READY  
**Status:** 🟢 FINALISIERT & VERPFLICHTEND

---

## ⚠️ LAYOUT FREEZE WARNUNG

**KRITISCH:** Vor Beginn prüfen ob Seite unter **Layout Freeze** steht!

📋 **Geschützte Seiten (KEINE Layout-Änderungen):**

- ✅ Dashboard (`src/pages/Index.tsx`)
- ✅ Aufträge (`src/pages/Auftraege.tsx`)

📖 **Dokumentation:** `docs/LAYOUT_FREEZE_PROTECTION_V18.5.1.md`

---

## 📊 EXECUTIVE SUMMARY

Dieser Prozess ist **VERPFLICHTEND** vor Implementierung JEDER neuen Seite oder Feature.

**Ziel:** Fehlerfreie Implementierung durch vollständige Planung VOR Beginn der Entwicklung.

**Workflow:** SAMMELN → PLANEN → PRÄSENTIEREN → UMSETZEN → TESTEN

---

## 🎯 PHASE 1: INFORMATIONS-SAMMLUNG

### KRITISCH: Bevor du IRGENDWAS implementierst, musst du:

#### 1. Alle relevanten Dokumente lesen

```bash
# Pflicht-Dokumente für JEDE Seite:
- LAYOUT_FREEZE_PROTECTION_V18.5.1.md ⭐⭐⭐ (ZUERST PRÜFEN!)
- MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md
- RECHTLICHE_COMPLIANCE_VORGABEN_V18.5.1.md
- DESIGN_SYSTEM_VORGABEN_V18.3.md
- MOBILE_LAYOUT_STANDARDS_V18.3.md

# Zusätzlich je nach Seiten-Typ:
- MOBILE_GRID_SYSTEM_V18.3_FINAL.md (bei App-Seiten)
- GEBRANDETE_LANDINGPAGE_KONZEPT_V18.2.md (bei Marketing-Seiten)
- LEGAL_COMPLIANCE_V18.3.24.md (bei Daten-verarbeitenden Seiten)
```

#### 2. Bestehenden Code analysieren

```typescript
// Suche nach ähnlichen Seiten:
// - Welches Layout-Pattern wird verwendet?
// - Welche Components sind wiederverwendbar?
// - Welche Grid-Struktur passt?
// - Welche rechtlichen Hinweise sind nötig?
```

#### 3. Datenbank-Schema prüfen

```sql
-- Falls neue Daten gespeichert werden:
-- - Welche Tabellen existieren bereits?
-- - Welche RLS-Policies sind nötig?
-- - Welche Aufbewahrungsfristen gelten (DSGVO/PBefG)?
-- - Welche Indizes sind sinnvoll?
```

#### 4. Design-System-Compliance

```typescript
// CI-Farben:
import { CI_COLOR_01, CI_COLOR_02, CI_COLOR_03 } from "@/lib/ci-colors";

// Grid-Pattern:
import { DashboardGrid } from "@/components/design-system/DashboardGrid";
import { MobileGridLayout } from "@/components/mobile/MobileGridLayout";

// Spacing-System:
// gap-2, gap-4, gap-6, gap-8
// p-4 sm:p-6 lg:p-8
// py-12 sm:py-16 md:py-20
```

#### 5. Rechtliche Anforderungen

```typescript
// Checkliste:
- [ ] DSGVO: Datenschutzhinweis nötig?
- [ ] AI Act: KI-Kennzeichnung nötig?
- [ ] TMG: Impressum/AGB-Link nötig?
- [ ] UStG: Rechnungspflichtangaben beachtet?
- [ ] PBefG: 10 Jahre Aufbewahrung nötig?
```

---

## 🏗️ PHASE 2: PLANUNG

### 1. Architektur-Entscheidung

**Frage dich:**

- Ist das eine Marketing-Seite oder App-Seite?
- Mobile-First oder Desktop-First? (IMMER Mobile-First!)
- Welches Grid-Pattern passt?
- Welche Components sind wiederverwendbar?

**Entscheidungs-Matrix:**

| Seiten-Typ                      | Layout            | Grid-Pattern                       | Touch-Targets |
| ------------------------------- | ----------------- | ---------------------------------- | ------------- |
| Marketing (Home, Pricing, Docs) | MarketingLayout   | HERO-GRID, TARIF-KARTEN-GRID       | min-h-[44px]  |
| App (Dashboard, Aufträge)       | MainLayout        | DASHBOARD-GRID, MOBILE-GRID-LAYOUT | min-h-[44px]  |
| Auth (Login, Register)          | AuthHeader/Footer | FORM-GRID                          | h-11          |
| Dialogs (Formulare)             | Dialog            | RESPONSIVE-DIALOG                  | min-h-[44px]  |

### 2. Component-Breakdown

**Erstelle Liste aller benötigten Components:**

```typescript
// Beispiel: Neue Statistik-Seite
const ComponentBreakdown = {
  Layout: "MainLayout",
  Grid: "DashboardGrid",
  Components: [
    "StatisticsHeader", // Neu erstellen
    "KpiCard", // Wiederverwendbar
    "ChartCard", // Wiederverwendbar
    "FilterBar", // Wiederverwendbar
    "MobileStatistics", // Neu erstellen
  ],
  Dialogs: [
    "DateRangeDialog", // Neu erstellen
  ],
  Hooks: [
    "useStatistics", // Neu erstellen
    "useDeviceType", // Wiederverwendbar
  ],
};
```

### 3. Datenfluss-Planung

```typescript
// Beispiel: Datenfluss für Statistik-Seite
const DataFlow = {
  // 1. Datenquelle
  source: 'supabase.from("bookings")',

  // 2. Query-Logic
  query: `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as total_bookings,
      SUM(price) as revenue
    FROM bookings
    WHERE company_id = auth.uid()
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `,

  // 3. State-Management
  state: {
    data: "useState<Statistics[]>([]);",
    loading: "useState<boolean>(true);",
    error: "useState<Error | null>(null);",
  },

  // 4. Cache-Strategy
  cache: "React Query - staleTime: 5min",

  // 5. Optimistic Updates
  optimistic: false, // Nur bei Mutations
};
```

### 4. Mobile-First Wireframe

```
┌─────────────────────────────────┐
│  MOBILE (375px)                 │
├─────────────────────────────────┤
│  [Search Bar]                   │ ← h-11
│  [Filter Buttons ────────→]     │ ← min-h-[44px], horizontal scroll
│  12 Ergebnisse                  │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Card 1                   │   │
│  │ Content...               │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Card 2                   │   │
│  │ Content...               │   │
│  └─────────────────────────┘   │
│                                 │
│  [Floating Action Button]       │ ← fixed bottom-24 right-4
└─────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│  DESKTOP (1920px)                                 │
├───────────────────────────────────────────────────┤
│  [Search] [Filter 1] [Filter 2] [Filter 3]        │
│                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Card 1   │ │ Card 2   │ │ Card 3   │          │
│  └──────────┘ └──────────┘ └──────────┘          │
│                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Card 4   │ │ Card 5   │ │ Card 6   │          │
│  └──────────┘ └──────────┘ └──────────┘          │
└───────────────────────────────────────────────────┘
```

### 5. Rechtliche Compliance

**Erstelle Compliance-Matrix:**

```typescript
// Compliance-Matrix für neue Seite
const ComplianceMatrix = {
  DSGVO: {
    datenschutzhinweis: true, // Bei Formularen
    cookies: false, // Keine zusätzlichen Cookies
    aufbewahrungsfrist: "10 Jahre", // PBefG § 51
  },
  AI_Act: {
    ki_kennzeichnung: false, // Keine KI-Features
  },
  TMG: {
    impressum_link: true, // Im Footer
    agb_link: false, // Keine Vertragsabschlüsse
  },
  UStG: {
    rechnungspflicht: false, // Keine Rechnungserstellung
  },
  PBefG: {
    auftragsdaten: false, // Keine Auftragsdaten
  },
};
```

---

## 🎤 PHASE 3: PRÄSENTATION

### VERPFLICHTEND: Präsentiere Pascal deinen Plan!

**Format:**

```markdown
## Planungspräsentation: [Seiten-Name]

### 1. Überblick

- **Seiten-Typ:** Marketing / App / Auth / Dialog
- **Hauptzweck:** [Beschreibung in 1-2 Sätzen]
- **Geschätzter Aufwand:** [X Minuten]

### 2. Architektur-Entscheidungen

- **Layout:** MarketingLayout / MainLayout / AuthLayout
- **Grid-Pattern:** HERO-GRID / DASHBOARD-GRID / MOBILE-GRID-LAYOUT
- **Responsive-Strategie:** Mobile-First, 3 Breakpoints (sm, md, lg)

### 3. Components

**Neu zu erstellen:**

- [ ] Component 1 (5min)
- [ ] Component 2 (10min)

**Wiederverwendbar:**

- [x] Component A (schon vorhanden)
- [x] Component B (schon vorhanden)

### 4. Datenfluss

- **Quelle:** Supabase / Static Data / API
- **State:** React Query / useState
- **Cache:** 5min staleTime

### 5. Rechtliche Compliance

- [x] DSGVO-Hinweis eingeplant
- [x] CI-Farben verwendet
- [x] Mobile-First umgesetzt
- [ ] Weitere Anforderungen...

### 6. Wireframes

[ASCII-Wireframes für Mobile + Desktop]

### 7. Offene Fragen

- Frage 1 an Pascal
- Frage 2 an Pascal

### 8. Next Steps nach Freigabe

1. Component X erstellen (5min)
2. Component Y erstellen (10min)
3. Integration testen (5min)
4. Mobile-Test (5min)
   **Gesamt: 25min**
```

---

## 🚀 PHASE 4: IMPLEMENTIERUNG

### ERST NACH FREIGABE durch Pascal!

#### 1. Component-Erstellung (Parallel!)

```bash
# WICHTIG: Parallel erstellen, nicht sequentiell!
# Verwende lov-write für ALLE neuen Files in EINEM Tool-Call
```

#### 2. Integration

```typescript
// Schritt für Schritt:
// 1. Layout integrieren
// 2. Grid-System einfügen
// 3. Components platzieren
// 4. Datenfluss verbinden
// 5. Error-Handling
// 6. Loading-States
```

#### 3. Rechtliche Elemente

```tsx
// IMMER am Ende jeder Seite einfügen:
<footer className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
  <p>
    <Link to="/impressum" className="hover:text-foreground">
      Impressum
    </Link>
    {" • "}
    <Link to="/datenschutz" className="hover:text-foreground">
      Datenschutz
    </Link>
    {" • "}
    <Link to="/agb" className="hover:text-foreground">
      AGB
    </Link>
  </p>
</footer>
```

#### 4. Dokumentation

```typescript
// JEDE neue Component MUSS Kommentare haben:
/* ==================================================================================
   [COMPONENT NAME] V18.5.1
   ==================================================================================
   - Zweck: [Beschreibung]
   - Mobile-First: ✅
   - Touch-Targets: ✅ min-h-[44px]
   - CI-Farben: ✅
   - Rechtlich: [DSGVO/AI Act/etc.]
   ================================================================================== */
```

---

## ✅ PHASE 5: TESTING

### VERPFLICHTENDE Tests:

#### 1. Responsive-Tests

```bash
# PFLICHT: Teste auf ALLEN Breakpoints
Mobile:  375px, 414px
Tablet:  768px, 1024px
Desktop: 1920px

# Browser-DevTools: Responsive-Mode
# Oder: https://responsivedesignchecker.com/
```

#### 2. Touch-Target-Test

```bash
# Teste mit Finger auf echtem Gerät:
- Alle Buttons ≥ 44px?
- Alle Links gut klickbar?
- FAB nicht überlappend?
- Filter-Buttons erreichbar?
```

#### 3. Performance-Test

```bash
# React DevTools Profiler:
- Render-Time < 16ms (60fps)
- Keine unnötigen Re-Renders
- Memoization aktiv?
```

#### 4. Accessibility-Test

```bash
# Chrome Lighthouse:
- Accessibility-Score ≥ 95
- Kontrast ≥ 4.5:1
- Alt-Texte vorhanden
```

#### 5. Legal-Compliance-Test

```bash
# Checkliste:
- [ ] DSGVO-Hinweis vorhanden?
- [ ] AI-Kennzeichnung (falls KI)?
- [ ] Impressum-Link im Footer?
- [ ] Keine verbotenen Daten erhoben?
```

---

## 🚫 ANTI-PATTERNS

### ❌ Implementieren OHNE Planung

```typescript
// ❌ FALSCH: Direkt losprogrammieren
"Ich erstelle jetzt die neue Statistik-Seite..."
[Code wird geschrieben ohne Plan]

// ✅ RICHTIG: Erst planen, dann präsentieren
"Ich analysiere zunächst die Anforderungen und erstelle einen Plan..."
[Informationen sammeln → Plan erstellen → Präsentieren → Warten auf Freigabe]
```

### ❌ Unvollständige Informationen

```typescript
// ❌ FALSCH: Nicht alle Docs gelesen
"Ich habe eine Idee, wie wir das machen können..."
[Hat aber Grid-System, CI-Farben, Mobile-Standards nicht gelesen]

// ✅ RICHTIG: Alle relevanten Docs gelesen
"Nach Analyse aller Standards (Grid, CI, Mobile, Legal) schlage ich vor..."
```

### ❌ Pascal nach dem Mund reden

```typescript
// ❌ FALSCH: Blind zustimmen
Pascal: "Lass uns 5 neue Features gleichzeitig bauen!"
NeXify: "Klar, machen wir!"

// ✅ RICHTIG: Bessere Lösung präsentieren
Pascal: "Lass uns 5 neue Features gleichzeitig bauen!"
NeXify: "Pascal, das birgt Risiken. Besser: Feature 1 heute (15min),
         testen, dann Feature 2 morgen. So vermeiden wir Bugs."
```

### ❌ Fehlende Zeitangaben

```typescript
// ❌ FALSCH: Keine Zeit-Estimates
"Ich setze jetzt die neue Seite um..."

// ✅ RICHTIG: Realistische Zeitangaben
"Basierend auf meiner Analyse:
- Component A: 5min
- Component B: 10min
- Integration: 5min
- Testing: 5min
Gesamt: 25min"
```

---

## 📊 PROZESS-CHECKLISTE

### Vor Start JEDER neuen Seite:

#### Phase 1: Informations-Sammlung

- [ ] Alle Pflicht-Dokumente gelesen
- [ ] Ähnliche Seiten im Code analysiert
- [ ] Datenbank-Schema geprüft
- [ ] Design-System-Compliance geprüft
- [ ] Rechtliche Anforderungen ermittelt

#### Phase 2: Planung

- [ ] Architektur-Entscheidung getroffen
- [ ] Component-Breakdown erstellt
- [ ] Datenfluss geplant
- [ ] Mobile-First Wireframes gezeichnet
- [ ] Compliance-Matrix erstellt

#### Phase 3: Präsentation

- [ ] Plan an Pascal präsentiert
- [ ] Offene Fragen geklärt
- [ ] Freigabe erhalten
- [ ] Zeitplan bestätigt

#### Phase 4: Implementierung

- [ ] Components parallel erstellt
- [ ] Integration durchgeführt
- [ ] Rechtliche Elemente eingefügt
- [ ] Code dokumentiert

#### Phase 5: Testing

- [ ] Responsive-Tests (5 Breakpoints)
- [ ] Touch-Target-Test (echtes Gerät)
- [ ] Performance-Test (< 16ms)
- [ ] Accessibility-Test (Score ≥ 95)
- [ ] Legal-Compliance-Test

---

## 🔗 VERWANDTE DOKUMENTATIONEN

- **MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md** - Grid-Patterns für alle Bereiche
- **RECHTLICHE_COMPLIANCE_VORGABEN_V18.5.1.md** - Rechtliche Anforderungen
- **MYDISPATCH_AI_AGENT_META_PROMPT_V18.5.1.md** - Meta-System Vorgaben
- **VORBEREITUNG_SCHNELLUMSETZUNG_V18.5.1.md** - Quick-Win Optimierungen

---

**Letzte Aktualisierung:** 23.10.2025 22:47 Uhr (DE)  
**Nächster Review:** Nach jeder problematischen Implementierung  
**Status:** 🟢 PRODUCTION-READY & VERPFLICHTEND
