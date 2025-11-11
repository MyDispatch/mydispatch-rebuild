# MyDispatch Design-System Konsolidiert
Status: Production-Ready
Version: 1.1.0
Datum: 2025-11-11
Autor: Engineering (Frontend)

## Zusammenfassung
Konsolidiertes Layout- und Designkonzept für MyDispatch mit einheitlicher CI-Palette, Typografie, Komponenten-Zuständen und strukturiertem Layout-System. Ziel ist eine pixelgenaue, barrierefreie und performante Umsetzung über alle Geräte und Browser hinweg. Dieses Dokument vereinheitlicht Vorgaben aus bestehenden Master-Dokumenten und setzt klare, erweiterbare Standards.

## Details

### 1) Hauptmenü & Navigation
- Primärnavigation: `AppSidebar` (64px collapsed → 240px expanded), `Header` oben fixiert, `Footer` unten fixiert.
- Mobile: Hamburger-Menü, `MobileBottomNav` mit 4–5 Kernaktionen.
- Active-State: deutliche Hervorhebung mit `state-active` und Fokus-Ring (`:focus-visible`).
- Skip-to-Content: verfügbar (`#main-content`) für schnelleren Tastaturzugriff.

### 2) Farbpalette, Typografie, UI-Elemente
- Palette (HSL Tokens in `src/index.css`):
  - `--primary: #1F3A8A`, `--secondary: #0EA5E9`, `--accent: #22C55E`.
  - `--background: #0B1220`, `--surface: #111827`.
  - `--text-primary: #F8FAFC`, `--text-secondary: #CBD5E1`.
  - Statusfarben: `--error`, `--warning`, `--info`, `--success`.
- Typografie: Inter/DM Sans; Basis-Linienhöhe `1.625`, Prose-Container 45–75ch.
- UI-Elemente: Buttons, Cards, Inputs mit standardisierten Zuständen (`hover`, `active`, `disabled`, `focus-visible`).

### 3) Informationsarchitektur & Benutzerführung
- Layout-Hierarchie: `Layout > Page > Section > Widget > Primitive`.
- Inhalte logisch gruppiert; Breadcrumbs optional (`DashboardLayout`).
- Konsistente Navigationsmuster: seitliche AppSidebar + kontextuelle Actions im Header.

### 4) Barrierefreiheit (WCAG 2.1 AA)
- Tastaturnavigation vollständig: sichtbarer Fokus, sinnvolle Reihenfolge.
- Skip-to-Content, semantische Landmarken (`header`, `main`, `footer`).
- Farbkonstraste ≥ 4.5:1; keine rein farbbasierten Hinweise.
- „Prefers-reduced-motion“ berücksichtigt (Animationen deaktiviert).

### 5) Performance-Optimierung
- Assets: Bildgrößen restriktiv, SVG bevorzugt, Fonts subsetted.
- Lighthouse Budgets (`lighthouse-budget.json`): FCP ≤ 2000ms, LCP ≤ 2500ms, TBT ≤ 300ms, CLS ≤ 0.1.
- Caching: `public/_headers`, Service Worker (`public/sw.js`) für Offline.
- Code-Splitting per React lazy routes, Preload/Prefetch gezielt.

### 6) Cross-Browser-Kompatibilität
- Moderne Browser (Chrome, Edge, Firefox, Safari) – getestet mit Standard-CSS.
- Scrollbar-Handling: unsichtbar, aber bedienbar (Utility Klassen); kein doppelter Scroll.
- Fallbacks: Keine kritischen Vendor-Prefixes erforderlich; Font-Smoothing gesetzt.

### 7) Mobile-First & Breakpoints
- Breakpoints: `sm (640)`, `md (768)`, `lg (1024)`, `xl (1280)`, `xxl (1536)`.
- Mobile-First: Stacks → Grids; Sidebar ausgeblendet oder komprimiert.
- Touch-Ziele ≥ 44px; horizontale Padding 24px im Menü für Präzision.

### 8) Interaktive Zustände
- Utilities in `src/index.css`:
  - `.state-hover` mit sanfter Transition.
  - `.state-active` für Primär-Hervorhebung.
  - `.state-disabled` für Deaktivierung (Opacity, Pointer-Events).
  - `:focus-visible` globaler Fokus-Ring (WCAG-konform).

### 9) Dokumentation & Erweiterbarkeit
- MD-2024-Template genutzt; Versions- und Änderungsverfolgung über `CHANGELOG.md`.
- Erweiterungen: Komponenten-Katalog (Shadcn-basiert) + Shared Components.
- Tests: visuelle Regression (tests/visual), e2e-Flows (tests/e2e).

## Validierung
- Preview geprüft: ein einzelner Haupt-Scroll-Container, sichtbarer Fokus, saubere Breakpoints.
- Budgets und DevTools integriert für Laufzeit-Performance.
- Keine doppelten Scrollbars, keine CLS-Sprünge erkannt.

## Referenzen
- `src/index.css` – Design Tokens & Utilities
- `src/components/layout/MainLayout.tsx` – Layout-Shell & Skip-Link
- `src/components/layout/AppSidebar.tsx`, `Header.tsx`, `Footer.tsx`
- `docs/LAYOUT_SYSTEM_FINAL_V20.0.0.md`, `docs/DESIGN_SYSTEM_V18.5.0.md`
- `lighthouse-budget.json`, `lighthouserc.json`

## Changelog
- v1.1.0 (2025-11-11): Konsolidiertes Design-System erstellt; Tokens und Interaktionszustände in CSS verankert; Layout-Hierarchie und Accessibility validiert.
