# 🧩 Wireframes: Header, Footer, Chat‑Widget
Status: Draft
Version: 1.1.1
Datum: 2025-11-11
Autor: Engineering

## Zusammenfassung
Textuelle Wireframes zur Absicherung vor Implementierung; definieren Struktur, Gruppierung und Interaktionspunkte.

## Details
- Header (weiß, 64px)
  - Links: Logo (Home)
  - Mitte: Hauptnavigation (Home, Features, Pricing, FAQ, Kontakt)
  - Rechts: Suche, AI‑Assist, Login/Profil
  - Keine Transparenz, kein Blur, optional helle Border unten
- Footer (weiß, 64–96px)
  - Spalten: Produkt, Unternehmen, Rechtliches
  - Unterzeile: Copyright, Social (optional), keine dunkle Abschlusslinie
- Chat‑Widget
  - FAB: r=28–32px, bottom‑right 24px; Lucide‑Icon monochrom
  - Panel: Desktop floating `w-400–480`, Mobile fullscreen; Header mit Titel, Close
  - DSGVO Consent vor Erstöffnung

## Validierung
- Navigationsstruktur aus `navigation.ts` referenziert

## Referenzen
- `src/routes/navigation.ts`
- `docs/DESIGN_SOLL_ANALYSE_V1.1.1.md`

