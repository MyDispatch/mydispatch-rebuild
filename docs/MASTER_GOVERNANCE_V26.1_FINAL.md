# 🎯 MASTER GOVERNANCE V26.1 - SYSTEMWEITE ARBEITSANWEISUNG

**Status:** ✅ DEFINITIVE ARBEITSGRUNDLAGE  
**Datum:** 2025-10-26  
**Gültigkeit:** DAUERHAFT & VERBINDLICH FÜR ALLE IMPLEMENTIERUNGEN

---

## 🧠 PROZESS & METHODIK (LOGISCHES DENKEN)

### GRUNDPRINZIP: VORAUSSCHAUENDES SYSTEMDENKEN

Bei jeder Aufgabe gilt:

- **Logisches Denken**: Bewerte Konsequenzen systemweit
- **Vorausschau**: Denke langfristig auf alle MyDispatch-Anforderungen
- **Ganzheitlich**: Verstehe Abhängigkeiten und Zusammenhänge

### ARBEITSABLAUF (MANDATORISCH)

#### 1. PRE-WORK (KONSOLIDIERUNG & IST-ABGLEICH)

Vor jeder Code-Änderung oder Implementierung:

- [ ] Ziehe vollständige Wissens-Informationen zusammen (CI, Governance, Feature-Liste)
- [ ] Gleiche mit aktuellem IST-Stand im Repository ab
- [ ] Identifiziere ALLE Abhängigkeiten des Bereichs
- [ ] Prüfe deren vollständige Funktion

#### 2. FEHLERANALYSE (ULTIMATIV)

Bei Fehlern oder Unstimmigkeiten:

- [ ] Finde ausnahmslos ALLE Fehler im betroffenen Bereich
- [ ] Suche deren jeweiligen Ursprung (Root Cause)
- [ ] Finde die systemweit überdachte Gesamtlösung
- [ ] Plane und setze vollständig um

#### 3. DOKUMENTATIONS-GOVERNANCE (POST-WORK)

Nach jeder abgeschlossenen Arbeit:

- [ ] Aktualisiere alle bisherigen sowie veralteten Vorgaben
- [ ] Pflege gesamte Dokumentation sauber und strukturiert
- [ ] Update Component Library Liste
- [ ] Vermerke in CHANGELOG

---

## 🤖 TECHNOLOGIE-STACK (MANDATORISCH)

| Komponente | Vorgabe                             | Secrets                           |
| ---------- | ----------------------------------- | --------------------------------- |
| KI-API     | Anthropic API                       | ANTHROPIC_API_KEY (Lovable Cloud) |
| KI-Modell  | Claude 3.5 Sonnet (ausschließlich!) | N/A                               |
| Backend    | Supabase, RLS, Security Definer     | N/A                               |
| Testing    | Playwright E2E, Visuelle Regression | N/A                               |

---

## 📝 DESIGN-SPRINT-GOVERNANCE (COMPONENT-FIRST)

### OBLIGATORISCHER WORKFLOW FÜR JEDEN BEREICH

Diese Kette ist **zwingend** bei Bearbeitung jedes Bereichs einzuhalten:

#### SCHRITT 1: PRÜFUNG

- [ ] Prüfe aktuellen IST-Stand im gesamten Bereich
- [ ] Analysiere alle UI-Elemente
- [ ] Vergleiche mit bestehender Component Library

#### SCHRITT 2: VERSTÄNDNIS & ÜBERDENKEN

- [ ] Verstehe Anforderungen des Bereichs
- [ ] Überdenke im Kontext der Gesamtanforderungen
- [ ] Identifiziere Abhängigkeiten

#### SCHRITT 3: UI-BIBLIOTHEK-CHECK

- [ ] Prüfe aktuelle UI-Elemente in der Library
- [ ] Identifiziere fehlende Komponenten
- [ ] Plane neue Komponenten

#### SCHRITT 4: COMPONENT-FIRST

**BEVOR** du den Hauptbereich implementierst:

1. **Vorhandene Komponenten**: Nutze sie konsequent
2. **Nicht vorhandene (benötigte) Komponenten**:
   - Erstelle sie zunächst vollständig nach V26.1 Design
   - Lege sie in entsprechender Library ab:
     - `/src/components/design-system/` für allgemeine UI
     - `/src/components/hero/` für Hero-spezifisch
     - `/src/components/pricing/` für Pricing-spezifisch
     - `/src/components/dashboard/` für Dashboard-spezifisch
     - `/src/components/home/` für Home-spezifisch
   - Update Barrel Exports (`index.ts`)

#### SCHRITT 5: IMPLEMENTIERUNG

- [ ] Setze V26.1 Design vollständig und pixelgenau um
- [ ] Nutze neue gültige Schriftart: **Inter**
- [ ] Nutze neue gültige Farben: **Token-basiert** (DESIGN_TOKENS_V26_1)
- [ ] Nutze Icons: **Lucide React**
- [ ] Setze gesetzliche Vorgaben um (DSGVO, Impressum, etc.)

#### SCHRITT 6: FUNKTIONS-CHECK & FEHLERBEHEBUNG

- [ ] Prüfe jede Funktion im gesamten Bereich
- [ ] Finde und behebe ALLE Fehler
- [ ] Finde systemweite Gesamtlösung
- [ ] Setze vollständig um

#### SCHRITT 7: LIB-PFLEGE

- [ ] Füge neue UI-Elemente zur Library hinzu
- [ ] Dokumentiere strukturiert und sortiert
- [ ] Update Barrel Exports

#### SCHRITT 8: DESIGN-SPERRE (FINALISIERUNG)

Nach Fertigstellung des Bereichs:

- [ ] Sperre gegen erneute Design- und Layout-Neuerungen
- [ ] **Nach Sperre**: Nur noch technische Optimierungen, Fixes, Stabilisierungen erlaubt

---

## 🎨 V26.1 DESIGN SYSTEM (HERO-QUALITÄT ALS STANDARD)

### KERNFARBEN (MANDATORY)

```typescript
export const KERNFARBEN_V26_1 = {
  // Core Brand Colors
  dunkelblau: "#323D5E", // Primary
  dunkelblau_hover: "#3F4C70", // Hover State
  dunkelblau_lighter: "#4A5A85", // Lighter Variant
  beige: "#EADEBD", // Secondary
  weiss: "#FFFFFF", // Pure White
  canvas: "#F8F9FB", // Light Background

  // Text Colors
  text_primary: "#323D5E", // Haupttext (Dunkelblau)
  text_secondary: "#64748B", // Sekundärtext
  text_tertiary: "#94A3B8", // Tertiärtext

  // Border Colors
  border_neutral: "#E2E8F0",
  border_neutral_soft: "#F1F5F9",
} as const;
```

### MOTION & TRANSITIONS (BEST PRACTICE)

```typescript
export const MOTION_V26_1 = {
  // Duration (Best Practice)
  duration_instant: "100ms",
  duration_fast: "200ms",
  duration_default: "300ms", // ← Standard für Sidebar/Header/Footer
  duration_slow: "400ms",
  duration_slower: "600ms",

  // Timing Functions
  ease_default: "cubic-bezier(0.4, 0, 0.2, 1)",
  ease_smooth: "cubic-bezier(0.4, 0, 0.2, 1)",

  // Transitions
  transition_sidebar: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  transition_header:
    "left 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  transition_content: "margin 300ms cubic-bezier(0.4, 0, 0.2, 1)",
} as const;
```

### ICON & BADGE SYSTEM

#### Icon-Boxen (Dunkelblau + Beige)

```tsx
<div className="bg-[#323D5E] rounded-xl p-3 shadow-lg shadow-[#323D5E]/20">
  <Icon className="text-[#EADEBD] h-6 w-6" />
</div>
```

#### Performance-Badges (Beige + Dunkelblau)

```tsx
<div className="bg-[rgba(234,222,189,0.15)] border-2 border-[rgba(234,222,189,0.3)] text-[#323D5E] px-3 py-1 rounded-lg font-semibold">
  +12%
</div>
```

#### Status-Badges (Ampel-System - NUR für Status)

```tsx
<Badge className="bg-[rgba(34,197,94,0.15)] border-2 border-[rgba(34,197,94,0.3)] text-green-700">
  Live
</Badge>
```

**VERBOTEN:** Ampel-Farben außerhalb von Status-Badges!

### GLOW-EFFEKTE (HERO-QUALITÄT)

Alle interaktiven Elemente benötigen Glow-Effekte:

```tsx
// Hover State
className="transition-all duration-300 hover:shadow-lg hover:shadow-[#323D5E]/20 hover:-translate-y-1"

// Active State
className="shadow-lg shadow-[#EADEBD]/30"

// Premium Glow
style={{
  boxShadow: '0 10px 40px -10px rgba(50, 61, 94, 0.2), 0 0 40px rgba(234, 222, 189, 0.1)',
}}
```

---

## 🏗️ COMPONENT LIBRARY STRUKTUR

```
src/components/
├── design-system/          # Allgemeine UI-Komponenten
│   ├── V26Button.tsx       # Primary/Secondary Buttons
│   ├── V26IconBox.tsx      # Icon Container mit Glow
│   ├── V26MarketingCard.tsx
│   ├── V26FeatureListItem.tsx
│   ├── V26BillingToggle.tsx
│   └── index.ts
├── hero/                   # Hero-spezifische Komponenten
│   ├── HeroBackgroundOrbs.tsx
│   ├── HeroPremiumBadge.tsx
│   ├── HeroTrustStats.tsx
│   ├── DashboardKPICard.tsx
│   ├── DashboardActivityItem.tsx
│   ├── DashboardPreviewTemplate.tsx
│   └── index.ts
├── home/                   # Home-spezifische Komponenten
│   ├── V26FeatureCard.tsx
│   ├── V26TestimonialCard.tsx
│   ├── V26SliderControls.tsx
│   └── index.ts
├── pricing/                # Pricing-spezifische Komponenten
│   ├── V26PricingCard.tsx
│   ├── V26PricingHero.tsx
│   ├── V26ComparisonTable.tsx
│   ├── V26AddonCard.tsx
│   └── index.ts
├── dashboard/              # Dashboard-spezifische Komponenten
│   ├── V26DashboardCard.tsx      # ← NEU (zu erstellen)
│   ├── V26StatCard.tsx           # ← NEU (zu erstellen)
│   ├── V26MetricCard.tsx         # ← NEU (zu erstellen)
│   ├── V26DataTable.tsx          # ← NEU (zu erstellen)
│   ├── V26ActionButton.tsx       # ← NEU (zu erstellen)
│   ├── V26StatusBadge.tsx        # ← NEU (zu erstellen)
│   ├── V26SectionHeader.tsx      # ← NEU (zu erstellen)
│   └── index.ts
├── layout/                 # Layout-Komponenten
│   ├── Header.tsx          # ✅ V26.1 synchronized
│   ├── Footer.tsx          # ✅ V26.1 synchronized
│   ├── AppSidebar.tsx      # ✅ V26.1 synchronized
│   ├── DashboardLayout.tsx
│   └── MainLayout.tsx
├── shared/                 # Shared Components
│   ├── DashboardSection.tsx
│   └── ...
└── [weitere contexts]/     # Weitere kontextspezifische Komponenten
```

---

## 📊 DASHBOARD-SPEZIFISCHE VORGABEN

### KRITISCHE REGEL FÜR /dashboard (HAUPTDASHBOARD)

**UNVERÄNDERLICH:**

- ❌ **KEIN Layout-Change** für das Hauptdashboard (`/dashboard`)
- ❌ **Infoboard links** bleibt in Position und Struktur
- ❌ **GPS-Karte** bleibt in Position und Struktur

**ERLAUBT & PFLICHT:**

- ✅ **Technische Optimierung** (Performance, Code-Qualität)
- ✅ **Visuelle Synchronisierung** (V26.1 Design-Tokens)
- ✅ **UI-Element-Upgrade** (Glow-Effekte, Transitions)
- ✅ **Funktionale Perfektion** (Bug-Fixes, Stabilisierung)

### DASHBOARD-ARCHITEKTUR (ALLE ANDEREN DASHBOARDS)

**Paradigma:** "Single Large Card View"

Alle anderen Dashboard-Seiten nutzen:

- Große zentrale Card als Hauptcontainer
- Integrierte Sections mit `DashboardSection`
- Konsistente Header/Footer/Sidebar
- V26.1 Design-Tokens durchgehend

### UI-ELEMENTE FÜR DASHBOARDS (MANDATORY)

Alle Dashboard-Seiten MÜSSEN folgende V26.1 Elemente nutzen:

#### 1. V26DashboardCard (zu erstellen)

```tsx
// Große zentrale Card für Dashboard-Content
<V26DashboardCard title="Dashboard Titel" icon={Icon}>
  {children}
</V26DashboardCard>
```

#### 2. V26StatCard (zu erstellen)

```tsx
// KPI-Karten mit Glow-Effekten
<V26StatCard label="Aufträge" value="142" icon={Truck} trend="+12%" trendType="positive" />
```

#### 3. V26MetricCard (zu erstellen)

```tsx
// Erweiterte Metrik-Karten mit Chart-Integration
<V26MetricCard
  title="Umsatz"
  value="12.450 €"
  icon={Euro}
  trend={{ value: 12, label: "vs. Vormonat" }}
  miniChart={chartData}
/>
```

#### 4. V26DataTable (zu erstellen)

```tsx
// Tabellen mit V26.1 Styling
<V26DataTable columns={columns} data={data} onRowClick={handleRowClick} />
```

#### 5. V26ActionButton (zu erstellen)

```tsx
// Aktions-Buttons mit Glow-Effekten
<V26ActionButton variant="primary" icon={Plus}>
  Neuer Auftrag
</V26ActionButton>
```

#### 6. V26StatusBadge (zu erstellen)

```tsx
// Status-Badges (Ampel-System)
<V26StatusBadge status="success">Bestätigt</V26StatusBadge>
<V26StatusBadge status="warning">Ausstehend</V26StatusBadge>
<V26StatusBadge status="error">Storniert</V26StatusBadge>
```

#### 7. V26SectionHeader (zu erstellen)

```tsx
// Section-Header mit Icon und Actions
<V26SectionHeader
  title="Letzte Aufträge"
  icon={List}
  actions={<V26ActionButton>Alle anzeigen</V26ActionButton>}
/>
```

---

## ✅ QUALITY GATES (PRE-COMMIT CHECKLIST)

### VISUELLE PRÜFUNG

- [ ] Alle Elemente haben Glow-Effekte
- [ ] Hover-States funktionieren smooth (300ms)
- [ ] Farben ausschließlich aus DESIGN_TOKENS_V26_1
- [ ] Icons: Dunkelblau Background + Beige Icon
- [ ] Performance-Badges: Beige Background + Dunkelblau Text
- [ ] Status-Badges: NUR Ampel-System (Grün/Gelb/Rot)
- [ ] Responsive auf allen Breakpoints (mobile, tablet, desktop)
- [ ] Animations laufen flüssig (60fps)

### CODE-PRÜFUNG

- [ ] Alle Buttons nutzen V26Button oder V26HeroButton
- [ ] Alle UI-Elemente sind wiederverwendbare Komponenten
- [ ] Barrel Exports (`index.ts`) aktualisiert
- [ ] TypeScript ohne Errors
- [ ] Keine Inline-Styles für Farben/Transitions
- [ ] Props-Interfaces vollständig dokumentiert
- [ ] Keine direkten Hex-Codes (nur KERNFARBEN_V26_1)
- [ ] Keine Hex + Alpha (nur rgba())
- [ ] Transitions: 300ms für Layout-Elemente
- [ ] Header/Footer: Sticky-Position korrekt (top: 0, bottom: 0)

### DOKUMENTATION-PRÜFUNG

- [ ] Komponenten in Library dokumentiert
- [ ] Usage-Examples vorhanden
- [ ] Props-Beschreibungen vollständig
- [ ] CHANGELOG aktualisiert

### FUNKTIONALE PRÜFUNG

- [ ] Alle Features funktionieren wie vorher
- [ ] Keine Breaking Changes
- [ ] Edge Cases getestet
- [ ] Error Handling implementiert
- [ ] Loading States implementiert

---

## 🚫 FORBIDDEN PRACTICES (ABSOLUTES VERBOT)

❌ **NIEMALS:**

- Direkte Hex-Codes in Components verwenden
- Inline-Hover-Effekte mit `onMouseEnter/Leave` für Styles
- Shadcn-Components ohne V26-Wrapper verwenden
- Wiederholenden Code schreiben (DRY-Prinzip verletzt)
- Komponenten ohne TypeScript-Interfaces
- Komponenten ohne Hero-Qualität implementieren
- Layout des Hauptdashboards (`/dashboard`) ändern
- Ampel-Farben außerhalb von Status-Badges
- Transitions länger als 300ms für Layout-Elemente
- Nicht-Token-basierte Farben

---

## 📈 SYSTEMWEITE HARMONISIERUNG (ABSOLUT)

### DESIGN-GLEICHHEIT

- **Alle Seiten** nutzen identisches Design-System
- **Alle UI-Elemente** haben Hero-Qualität
- **Alle Farben** aus DESIGN_TOKENS_V26_1
- **Alle Icons** im Dunkelblau/Beige-System
- **Alle Badges** folgen Performance/Status-Regeln

### LAYOUT-GLEICHHEIT

- **Header** systemweit identisch (sticky, 300ms transition)
- **Footer** systemweit identisch (sticky, 300ms transition)
- **Sidebar** systemweit identisch (collapsible, 300ms transition)
- **Content-Bereich** konsistent (margin-left angepasst)

### FUNKTIONALE GLEICHHEIT

- **Error Handling** systemweit konsistent
- **Loading States** systemweit konsistent
- **Toast Notifications** systemweit konsistent
- **Form Validation** systemweit konsistent

### TECHNISCHE GLEICHHEIT

- **Code-Struktur** folgt Best Practices
- **TypeScript** überall vollständig
- **React Query** für Data Fetching
- **Supabase** für Backend (RLS aktiviert)

---

## 🎯 IMPLEMENTIERUNGS-PRIORITÄTEN (NEXT STEPS)

### PRIORITÄT 1: DASHBOARD-KOMPONENTEN ERSTELLEN

- [ ] `V26DashboardCard` erstellen
- [ ] `V26StatCard` erstellen
- [ ] `V26MetricCard` erstellen
- [ ] `V26DataTable` erstellen
- [ ] `V26ActionButton` erstellen
- [ ] `V26StatusBadge` erstellen
- [ ] `V26SectionHeader` erstellen
- [ ] Barrel Export `/src/components/dashboard/index.ts` erstellen

### PRIORITÄT 2: HAUPTDASHBOARD SYNCHRONISIEREN

- [ ] `/dashboard` (Hauptdashboard) technisch optimieren
- [ ] UI-Elemente auf V26.1 upgraden (OHNE Layout-Change!)
- [ ] Glow-Effekte hinzufügen
- [ ] Transitions auf 300ms standardisieren
- [ ] Testing durchführen

### PRIORITÄT 3: WEITERE DASHBOARDS SYNCHRONISIEREN

- [ ] `/agent-dashboard` auf V26.1
- [ ] `/bookings` auf V26.1
- [ ] `/vehicles` auf V26.1
- [ ] `/drivers` auf V26.1
- [ ] `/customers` auf V26.1
- [ ] usw.

### PRIORITÄT 4: DOKUMENTATION FINALISIEREN

- [ ] Alle Komponenten dokumentieren
- [ ] Usage-Examples erstellen
- [ ] CHANGELOG pflegen
- [ ] Component Library aktualisieren

---

## 📚 REFERENZEN

### INTERNE DOKUMENTATION

- `V26.1_DESIGN_SYNC_DOCUMENTATION.md` → Design-Sync Details
- `V26.1_COMPONENT_WORKFLOW.md` → Component-First Workflow
- `MYDISPATCH_DESIGN_SYSTEM_FINAL_V26.0.md` → Design-System Spezifikation
- `SYSTEM_DESIGN_PRINCIPLES_V18.5.0.md` → System-Prinzipien
- `HOME_REFACTORING_V26.0_AUDIT.md` → Home-Refactoring Audit

### CODE-REFERENZEN

- `src/lib/design-system/v26-1-tokens.ts` → Design-Tokens
- `src/components/hero/index.ts` → Hero Components
- `src/components/home/index.ts` → Home Components
- `src/components/pricing/index.ts` → Pricing Components
- `src/components/design-system/index.ts` → Design-System Components
- `src/pages/Home.tsx` → Master-Vorlage (Hero-Qualität)
- `src/pages/Pricing.tsx` → Master-Vorlage (Hero-Qualität)

---

## 🔒 FINALISIERUNG & SPERRE

**Nach Abschluss der Implementierung:**

1. **Design-Sperre aktivieren**:
   - Keine weiteren Design-Änderungen
   - Nur technische Optimierungen, Fixes, Stabilisierungen

2. **Version taggen**:
   - Git Tag: `v26.1-final`
   - CHANGELOG eintrag

3. **Dokumentation abschließen**:
   - Alle Komponenten dokumentiert
   - Alle Vorgaben final
   - Quality Gates erfüllt

---

## 📝 CHANGELOG

### V26.1 (2025-10-26)

- ✅ Hero-Design als systemweiter Standard etabliert
- ✅ V26.1 Design-Tokens finalisiert
- ✅ Component Library strukturiert
- ✅ Home-Seite vollständig synchronisiert
- ✅ Pricing-Seite vollständig synchronisiert
- ✅ Header/Footer/Sidebar synchronisiert
- ✅ Workflow-Dokumentation erstellt
- ✅ Master-Governance-Dokumentation erstellt
- 🔄 Dashboard-Komponenten (in Arbeit)
- 🔄 Dashboard-Synchronisierung (in Arbeit)

---

**DIESE DOKUMENTATION IST DIE DEFINITIVE ARBEITSGRUNDLAGE FÜR ALLE ZUKÜNFTIGEN IMPLEMENTIERUNGEN.**

**Version:** V26.1 MASTER FINAL  
**Status:** DAUERHAFT GÜLTIG  
**Zertifiziert:** Senior Projektleiter & Systemarchitekt  
**Letzte Aktualisierung:** 2025-10-26
