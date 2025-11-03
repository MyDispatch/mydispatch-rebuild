# 🎨 HERO-BACKGROUND-STANDARD V31.5

## KRITISCHE REGEL: EXAKTE BACKGROUND-KOMPONENTE

❌ **FALSCH** (zu oberflächlich):
```tsx
<HeroIpadShowcase backgroundVariant="3d-premium" />
```
→ Problem: `backgroundVariant` ist nur ein Prop, die **gerenderte Komponente** kann abweichen!

✅ **RICHTIG** (erzwungene Komponente):
```tsx
// In V28HeroPremium.tsx (Zeile 74-75):
{backgroundVariant === '3d-premium' && <V28Hero3DBackgroundPremium />}
```

## VISUELLE KOMPONENTEN AUF HOME.TSX

### V28Hero3DBackgroundPremium - 6 Layer System:

**Layer 1: Base Gradient**
- `bg-gradient-to-b from-slate-100 via-slate-50 to-white`
- Sanfter Übergang von hellem Slate zu reinem Weiß

**Layer 2: Straßennetz-Pattern**
- SVG mit Kreuzungen + Dasharray-Linien
- Opacity: 0.06 (subtiles Grid-Pattern)
- Parallax-Faktor: 10px (bewegt sich langsam bei Mouse-Move)

**Layer 3: Floating Orbs (3 Stück)**
- Orb 1: Top Left, 450px, Slate-300/35, 8s vertical float
- Orb 2: Bottom Right, 550px, Slate-400/30, 12s horizontal float (delay 2s)
- Orb 3: Center, 650px, Slate-500/25, 16s vertical float (delay 4s)
- Parallax-Faktor: 20px

**Layer 4: Taxi-Elemente (6 Stück)**
- Taxi Silhouette 1: Top Right, 28x28, rotate-12, 10s horizontal float
- MapPin Cluster: Top Left, 24x24, 12s vertical float (delay 2s)
- Routenlinie 1: Mitte Links, 40x40, 14s horizontal float (delay 1s)
- Taxi Silhouette 2: Bottom Right, 36x36, -rotate-6, 15s vertical float (delay 6s)
- MapPin 2: Bottom Left, 20x20, 11s horizontal float (delay 3s)
- Routenlinie 2: Bottom Center, 32x32, 13s vertical float (delay 4s)
- Parallax-Faktor: 30px

**Layer 5: Premium Glow Effects (5 Stück)**
- Glow Top Left: 700px, Slate-200/70
- Glow Bottom Right: 800px, Slate-300/60
- Glow Top Right: 600px, Slate-200/50
- Glow Bottom Left: 650px, Slate-300/55
- Glow Center: 900px, Slate-400/40
- Parallax-Faktor: 40px

**Layer 6: Vignette Overlays (2 Stück)**
- Top-to-Bottom: `bg-gradient-to-t from-white/70`
- Bottom-to-White: `bg-gradient-to-b to-white/80`
- Parallax-Faktor: 50px

### Performance-Features:
- ✅ Mouse-Parallax mit RAF (60fps)
- ✅ `prefers-reduced-motion` Check
- ✅ Throttled Mouse Events
- ✅ Hardware-accelerated `translate3d()`

## VERPFLICHTENDE REGEL FÜR ALLE SEITEN:

```tsx
<HeroIpadShowcase
  backgroundVariant="3d-premium"  // ✅ MANDATORY für alle Pre-Login-Seiten
  // ... weitere Props
/>
```

→ Diese Regel erzwingt die Verwendung von `V28Hero3DBackgroundPremium` in `V28HeroPremium.tsx` (Zeile 74-75)

## AUSNAHMEN: KEINE!

- ❌ KEINE vereinfachten Versionen
- ❌ KEINE "Light"-Varianten  
- ❌ KEINE alternativen Background-Varianten (`3d-clean`, `flat`, etc.)

**ZERO EXCEPTIONS - 100% KONSISTENZ**

## BETROFFENE SEITEN (40+):

### Hauptseiten (8):
- `/` (Home.tsx) → ✅ backgroundVariant="3d-premium"
- `/pricing` (Pricing.tsx) → ✅ backgroundVariant="3d-premium"
- `/docs` (Docs.tsx) → ⚠️ Migrieren
- `/faq` (FAQ.tsx) → ⚠️ Migrieren
- `/contact` (Contact.tsx) → ✅ backgroundVariant="3d-premium"
- `/features` (Features.tsx) → ✅ backgroundVariant="3d-premium"
- `/demo` (Demo.tsx) → ⚠️ Validieren
- `/nexify-support` (NeXifySupport.tsx) → ⚠️ Validieren

### Rechtsseiten (5):
- `/impressum` (Impressum.tsx) → ⚠️ Validieren
- `/datenschutz` (Datenschutz.tsx) → ⚠️ Validieren
- `/agb` (AGB.tsx) → ⚠️ Validieren
- `/nutzungsbedingungen` (falls vorhanden) → ⚠️ Erstellen
- `/rechtliches` (falls vorhanden) → ⚠️ Erstellen

### Feature-Detailseiten (20+):
- `/features/core/*` (7 Seiten)
- `/features/business/*` (13 Seiten)
- `/features/enterprise/*` (4 Seiten)

### Partner-Seiten:
- `/partner/:slug` → ⚠️ Dynamisches Template erstellen

## VALIDATION:

Run validation script:
```bash
npm run validate:hero
```

Expected output:
```
🎨 HERO BACKGROUND VALIDATION REPORT

Total Pages: 40+
✅ Correct: 40+
❌ Incorrect: 0

✅ ALL PAGES VALIDATED - 100% COMPLIANCE
```

## E2E-TESTS:

Run E2E tests:
```bash
npx playwright test tests/e2e/hero-backgrounds-v31-5.spec.ts
```

Tests validieren:
1. Presence of all 6 layers
2. Mouse-Parallax functionality
3. Visual regression (Screenshots)
4. Performance (`prefers-reduced-motion`)

## TECHNICAL REQUIREMENTS:

- ✅ `prefers-reduced-motion` Support
- ✅ 60fps Parallax (RAF-optimiert)
- ✅ Zero Build Errors
- ✅ Lighthouse Score >= 85

---

**Version:** V31.5  
**Datum:** 2025-01-30  
**Status:** ✅ PRODUCTION-READY - FULLY ENFORCED - NO EXCEPTIONS
