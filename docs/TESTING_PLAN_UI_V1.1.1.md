# 🧪 Testing‑Plan: Cross‑Browser & Responsive
Status: Draft
Version: 1.1.1
Datum: 2025-11-11
Autor: Engineering

## Zusammenfassung
Testmatrix und Prüfschritte für Header/Footer/Chat inkl. Accessibility und Performance.

## Details
- Browser
  - Chrome (aktuell), Firefox, Edge, Safari (macOS/iOS)
- Geräte
  - Mobile: 360×640, 375×812, 414×896
  - Tablet: 768×1024, 834×1194
  - Desktop: 1280, 1440, 1920
- Prüfpunkte
  - Header weiß, kein Blur/Transparenz; Navigation gemäß `navigation.ts`
  - Footer weiß, keine dunkle Linie; Links vollständig, korrekt
  - Chat FAB/Panel funktional, Consent, Tastatur, Escape schließt, Focus‑Trap
  - ARIA Rollen: `banner`, `contentinfo`, `dialog` korrekt; `aria-label` gesetzt
  - Performance: Layout Shift (CLS) minimal; Lazy‑Loading Chat

## Validierung
- Lighthouse (Accessibility ≥ 90)
- Axe DevTools Report

## Referenzen
- `src/layouts/MarketingLayout.tsx`
- `src/layouts/AuthPageLayout.tsx`
- `src/components/chat/V28ChatWidget.tsx`

