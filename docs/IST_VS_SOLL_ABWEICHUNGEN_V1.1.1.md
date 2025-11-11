# 🔍 Abweichungen IST ↔ SOLL (Header, Footer, Chat)
Status: Draft
Version: 1.1.1
Datum: 2025-11-11
Autor: Engineering

## Zusammenfassung
Dokumentiert alle relevanten Abweichungen zwischen aktuellem IST und angestrebtem SOLL für UI‑Kernelemente.

## Details
- Header
  - IST: `MarketingLayout` nutzt `bg-surface/90 + backdrop-blur + border-b border-slate-800` (dunkel/transluzent)
  - SOLL: `bg-white`, keine Transparenz/Blur, Navigation gemäß `navigation.ts`, helle Border optional
  - Code‑Ziel: `src/layouts/MarketingLayout.tsx`, ggf. `src/components/layout/Header.tsx`
- Footer
  - IST: `bg-surface/90 + backdrop-blur + border-t border-slate-800`
  - SOLL: `bg-white`, keine dunkle Abschlusslinie (Border entfernen oder hell), Linkgruppen prüfen
  - Code‑Ziel: `src/layouts/MarketingLayout.tsx`, `src/components/layout/AuthFooter.tsx`
- Chat‑Widget
  - IST: V28‑Chat mit professionellem FAB, evtl. farbige/gradienten Styles aus V26/V28
  - SOLL: Monochrom Lucide‑Icon, CI‑konforme Farben, klare FAB‑Style (weißes Badge, helles Border, dunkles Icon), DSGVO Consent bleibt
  - Code‑Ziel: `src/components/chat/V28ChatWidget.tsx`, `src/components/chat/IntelligentAIChat.tsx`, `src/styles/ai-chat.css`

## Validierung
- Nach Umsetzung visuelle Abnahme und Accessibility‑Report

## Referenzen
- `src/layouts/MarketingLayout.tsx`
- `src/layouts/AuthPageLayout.tsx`
- `src/components/chat/V28ChatWidget.tsx`
- `src/routes/navigation.ts`

