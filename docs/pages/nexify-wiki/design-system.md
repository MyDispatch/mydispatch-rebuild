# NeXify WiKi – Design System (V28.1 → V32.5)

Status: Production-ready foundation. Figma-Import vorbereitet – bitte Figma File-Key liefern.

## Zielsetzung
- Einheitliches, skalierbares Design-System für das NeXify WiKi mit strikter CI-Konformität.
- Pixelgenaue Layouts (12-Spalten-Grid, 8px Baseline), responsive über alle Breakpoints.
- Systematische Design-Tokens, klare Typografie-Hierarchie, konsistente Komponenten-Bibliothek.

## Figma MCP – Import & Analyse
- Benötigt: Figma File-Key der „NeXify WiKi“-Bibliothek (z. B. aus `https://www.figma.com/file/<FILE_KEY>/...`).
- Schritte nach Bereitstellung des Keys:
  - Assets & Dokumentation laden und CI-Richtlinien extrahieren.
  - Bestehende Patterns/Komponenten inventarisieren, Varianten prüfen (States, Sizes, Density).
  - Lücken erkennen und systematisch schließen (Buttons, Formulare, Navigation, Cards, Icons).

## Grid & Spacing
- Seiten-Grid: 12 Spalten, max-width `1400px` (Desktop), Container zentriert mit `padding: 2rem`.
- Baseline-Grid: 8px (alle vertikalen Rhythmen in Inkrementen von 8px).
- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.
- Spacing-Standard:
  - Desktop: `px-8 py-6 gap-6 space-y-6`
  - Mobile: `px-4 py-4 gap-4 space-y-4`
  - Immer mit Breakpoint: `class="px-4 sm:px-8 py-4 sm:py-6"`

## Farbpalette (WCAG 2.1 AA)
- Primär: `--primary: slate-700 (215 25% 27%)` – seriös, B2B-geeignet.
- Sekundär: `--secondary: slate-100 (210 40% 96%)`.
- Muted: `--muted: slate-200 (214 32% 91%)`.
- Foreground: `--foreground: slate-700 (215 25% 27%)`.
- Karten/Popover: Weiß-Hintergründe mit Slate-Text.
- Statusfarben (Ampel):
  - Success: `142 76% 36%` (Hover: `32%`).
  - Warning: `48 96% 53%` (Hover: `48%`).
  - Error: `0 84% 60%` (Hover: `55%`).
- Sidebar: `--sidebar-*` Tokens für Hintergrund, Text, Primary, Border, Ring.
- Charts: `--chart-*` für Linien und Grid.
- Dark Mode: konsistente `--*` Overrides gemäß Slate-Dark.

Hinweis: Legacy-Farben (`dunkelblau`, `beige`) nur wenn absolut nötig und begründet, ansonsten Slate-Palette verbindlich.

## Typografie-System
- Schriftfamilien:
  - Sans: `Inter` (Primär, seriös, neutral).
  - Serif: `Playfair Display` (sekundär, sparsam für Editorial).
  - Mono: `SF Mono / Cascadia Code` (Code/Metadaten).
- Hierarchie (Tailwind-Klassen, Desktop):
  - H1: `text-4xl font-semibold tracking-tight` (Line-Height 1.2).
  - H2: `text-3xl font-semibold` (LH 1.3).
  - H3: `text-2xl font-semibold` (LH 1.35).
  - Body: `text-base text-slate-700` (LH 1.6).
  - Small: `text-sm text-slate-600`.
- Sprach-Optimierungen: deutsche Silbentrennung aktiviert, englische deaktiviert; globale Umbruch-Regeln in `legacy/index.css`.

## Icon-Set
- Strichstärke: 2px Standard; konsistent über alle Icons.
- Größen: 16px, 24px, 32px.
- Benennung: `{category}/{name}-{size}-{stroke}` (z. B. `system/arrow-right-24-2px`).
- Zugriff: Figma Komponenten + Export als SVG mit einheitlicher ViewBox (`24 24`).

## UI-Komponenten (Kern)
- Buttons: Primär, Sekundär, Muted, Destructive; States: default, hover, focus, disabled, loading.
- Formularelemente: Input, Textarea, Select, Checkbox (Radix UI), Radio, Switch; Focus-Ring über `--ring`.
- Navigation: Topbar, Sidebar (Tokens `--sidebar-*`), Tabs; aktive/hover/disabled definiert.
- Karten & Container: Card, Panel, Popover, Modal; Schatten `--shadow-*` für Depth.

## Design-Tokens (Implementierung)
- CSS Variables: `nexify-new-complete/legacy/design-system.css` + `legacy/index.css`.
- Tailwind-Anbindung: `tailwind.config.ts` mappt `colors`, `radius`, `boxShadow`, `animation` auf Tokens.
- Z-Index: globale Hierarchie in `legacy/index.css` (`--z-index-*`).

## Responsive & Layout-Regeln
- Seitenränder, Komponentenausrichtung, gleichmäßige Abstände (8px-Inkremente).
- Keine horizontalen Scrollbars; Scrollbar-hide Utilities sind standardisiert.
- Performance: GPU-optimierte Parallax/Animations; Reduced Motion Respekt.

## Atom → Molekül → Organismus → Templates
- Atome: Buttons, Badges, Icons, Inputs.
- Moleküle: Formgruppen, Cards mit Header/Body/Footer.
- Organismen: Header, Footer, Sidebar, Dashboard-Panels.
- Templates: Wiki-Start, Kategorie-Seiten, Detail-Ansichten, Docs-Index.

## Lücken-Management
- Systematische Erfassung: Liste fehlender Komponenten, Status, Priorität.
- Erstellung gemäß CI: Tokens, Typografie, States, Interaktionen dokumentieren.
- Review & QA: visuelle Konsistenz, Interaktion, Responsivität.

## CI-Vorgaben
- Logo-Implementierung: Mindestabstände, Platzierung (Top-Left), dunkler/heller Hintergrundvarianten.
- Farben: ausschließlich definierte Tokens, keine Direktwerte in Komponenten.
- Typografie: Inter als Default; Kontrast und Lesbarkeit prüfen.

## Dokumentation & Interaktionsmuster
- Styleguide: Tokens, Farbverwendung, Typografie, Spacing, Grid.
- Komponenten-Guides: Props, Zustände, Varianten, Beispiele.
- Interaktion: Hover/Focus/Active, Disabled/Loading, Keyboard-Navigation.

## Qualitätssicherung
- WCAG 2.1 AA Kontrast-Checks pro Primär-/Sekundärfarbe.
- Breakpoint-Tests: Mobile, Tablet, Desktop, 2XL.
- Konsistenz-Checks: Token-Verwendung, Layer-Ordnung, Spacing-Logik.

## Figma-Bibliothek – Aufbau
- Struktur: Foundations (Colors, Type, Grid), Icons, Atoms, Molecules, Organisms, Templates.
- Varianten: Größe, Zustand, Theme (Light/Dark), Density.
- Auto-Layout: überall aktiviert; Constraints und min/max Größen.
- Tokens: Figma Variables spiegeln CSS Tokens (`--*`) – Farb-, Radius-, Spacing-, Z-Index-Mapping.

## Nächste Schritte (nach File-Key)
1) Figma-Import ausführen und Assets inventarisieren.
2) Token-Variablen in Figma Variables übernehmen (Color, Radius, Spacing).
3) Komponenten-Varianten vervollständigen; Auto-Layout prüfen.
4) QA-Checks dokumentieren und Abnahme-Checkliste pflegen.

—
Letzte Aktualisierung: 2025-11-10

