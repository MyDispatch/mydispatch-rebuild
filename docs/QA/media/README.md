# Annotierte Screenshots – Leitfaden
Status: Production-Ready
Version: 1.0.0
Datum: 2025-11-11

## Zweck
Visuelle Untermauerung der Abweichungsprotokolle und QA‑Findings durch hochwertige, annotierte Screenshots.

## Anforderungen
- Auflösung: ≥ 1920×1080, PNG bevorzugt.
- Markierungen: klare, kontrastreiche Annotationen (Rahmen, Pfeile, Labels).
- Beschreibung: Jede Datei erhält eine kurze Erläuterung (Problem/Beobachtung, Kontext, Viewport).
- Dateibenennung: `bereich-viewport-kurzbeschreibung.png` (z. B. `sidebar-md-padding-24px.png`).

## Empfohlene Shots
- Sidebar:
  - `sidebar-sm.png`, `sidebar-md.png`, `sidebar-lg.png`, `sidebar-xl.png`, `sidebar-xxl.png`.
  - Fokus-Indikator auf Toggle und Menüeintrag.
- Header:
  - Fokus-Reihenfolge, Tastaturnutzung, ARIA‑Labels sichtbar (DevTools).
- MainLayout:
  - `skip-to-content` aktiv (Fokus auf Link, Sprung zu `#main-content`).
- Footer:
  - Legal‑Routen (`/legal/impressum`, `/legal/datenschutz`, `/legal/agb`).

## Ablage
- Screenshots hier speichern: `docs/QA/media/`.
- Optional: Unterordner nach Feature (z. B. `sidebar/`, `header/`).

## Metadaten
- Ergänze pro Bild eine Textdatei mit gleichem Namen (`*.txt`) mit:
  - Viewport/Device
  - Seite/URL
  - Schritte zur Reproduktion
  - Erwartetes Verhalten vs. Ist‑Beobachtung
