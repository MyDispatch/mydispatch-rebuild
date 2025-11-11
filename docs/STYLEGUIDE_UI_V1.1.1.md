# 🎨 UI‑Styleguide (Typografie, Farben, Abstände, Breakpoints)
Status: Draft
Version: 1.1.1
Datum: 2025-11-11
Autor: Engineering

## Zusammenfassung
Kompakter, umsetzungsfähiger Styleguide für Kern‑UI: Typografie, Farben, Abstände, Breakpoints, Interaktion.

## Details
- Typografie
  - Font‑Family: `Inter`, Fallback `system-ui`
  - Headings: H1 display 36/44, H2 xxl 24/32, H3 xl 20/30
  - Body: base 16/24; Small: sm 14/20; Caption: xs 12/18
- Farben (Tokens)
  - Text: `#0F172A` (Dark), `#334155` (Secondary), inverse `#F8FAFC`
  - Backgrounds: Page `#FFFFFF` (Marketing, Auth), App `#111827`
  - Borders: Light `#E5E7EB`, Medium `#CBD5E1`
  - Interactive: Primary `#1F3A8A`, Hover `#1F3A8A` 90%, Focus Ring `rgba(31,58,138,0.5)`
- Abstände
  - Grid: Container max‑width `1280/1536`, Gutter `16px`
  - Controls: Inputs `h-10`, Padding `px-3 py-2`
  - Cards: `rounded-xl`, `border-slate-200`, `bg-white`
- Breakpoints
  - `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `xxl 1536`
- States & Motion
  - Durations: fast 150ms, medium 300ms, slow 500ms
  - Easing: standard `cubic-bezier(0.4,0,0.2,1)`
- Accessibility
  - Kontrast mind. 4.5:1; Focus sichtbar; Tastatur vollständig; ARIA für Dialog/Chat korrekt

## Validierung
- UI‑Audit gegen SOLL‑Analyse

## Referenzen
- `docs/DESIGN_SOLL_ANALYSE_V1.1.1.md`
- `docs/ACCESSIBILITY_GOVERNANCE_V19.0.0.md`

