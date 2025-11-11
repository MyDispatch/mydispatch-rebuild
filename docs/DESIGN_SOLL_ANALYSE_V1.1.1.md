# 📐 MyDispatch SOLL-Analyse: Layout & Design
Status: Draft
Version: 1.1.1
Datum: 2025-11-11
Autor: Engineering

## Zusammenfassung
Detaillierte SOLL-Spezifikation für Seitenlayout, Farben, Typografie, Abstände, Breakpoints und Kern‑UI‑Elemente (Header, Footer, Chat‑Widget). Grundlage für Rekonstruktion gemäß CI und Vorgaben.

## Details
- Layout-Prinzipien
  - Ein Haupt‑Scroll‑Container, keine verschachtelten Scroll‑Container
  - Struktur: `Layout > Page > Section > Widget > Primitive`
  - Responsive Grid: Container max‑width `xl`/`xxl` gemäß Breakpoints, Seitenränder `px-4 sm:px-6 md:px-8`
- Farben (CI, Referenz NeXify Config 1.1.0)
  - Primary `#1F3A8A`
  - Secondary `#0EA5E9`
  - Accent `#22C55E`
  - Background `#0B1220`
  - Surface `#111827`
  - Text Primary `#F8FAFC`, Text Secondary `#CBD5E1`
  - Feedback: Error `#EF4444`, Warning `#F59E0B`, Info `#3B82F6`, Success `#10B981`
- Typografie
  - Fonts: `Inter`, `DM Sans`
  - Skala: xs 12/18, sm 14/20, base 16/24, lg 18/28, xl 20/30, xxl 24/32, display 36/44
- Abstände
  - Basis: `4px`‑Multiplikator (4, 8, 12, 16, 20, 24, 32, 40)
  - Komponenten: Buttons `px-4 py-2`, Cards `px-4 py-4`, Header/Footer Höhe `64px`
- Breakpoints
  - `sm:640`, `md:768`, `lg:1024`, `xl:1280`, `xxl:1536`
- Komponenten‑SOLL
  - Header: Hintergrund `#FFFFFF`, keine Transparenz/Blur; originale Navigation; Border optional `#E5E7EB` (hell) oder none
  - Footer: Hintergrund `#FFFFFF`, keine Transparenz; keine dunkle Abschlusslinie; klare Link‑Gruppierung
  - Chat‑Widget FAB: Monochrom Lucide‑Icon, CI‑konforme Farben, Fokus‑Ring; Position bottom‑right; DSGVO‑Consent vor Öffnung

## Validierung
- Cross‑Check mit `config/NEXIFY_REACT_VITE_CONFIG_V1.1.yaml`
- Abgleich mit `docs/KNOWLEDGE/DESIGN_SYSTEM.md` und `ACCESSIBILITY_GOVERNANCE_V19.0.0.md`

## Referenzen
- `docs/STYLEGUIDE_UI_V1.1.1.md`
- `docs/WIREFRAMES_HEADER_FOOTER_CHAT_V1.1.1.md`
- `docs/IMPLEMENTATION_SPEC_DASHBOARD_TARIFFS_ACCESS_V1.1.md`
- `config/NEXIFY_REACT_VITE_CONFIG_V1.1.yaml`

