# Known Issues - V28 Hero System

**Erstellt:** 2025-01-30  
**Status:** ✅ GELÖST

---

## 🐛 ISSUE #1: 3 Buttons im Hero (CRITICAL)

### Problem:
Home.tsx hatte 3 Buttons im Hero:
1. Primary CTA ("Jetzt starten")
2. Secondary CTA ("Demo vereinbaren")
3. PWA Install Button ("App installieren")

### Impact:
- ❌ UX: Zu viele CTAs verwirren User
- ❌ Design: Visuelles Chaos, keine klare Hierarchie
- ❌ Conversion: Reduzierte Click-Through-Rate

### Root Cause:
V28HeroPremium erlaubte gleichzeitige Nutzung von `secondaryCTA` + `showPWAButton`.

### Solution:
✅ **MAX 2 BUTTONS Regel** etabliert:
- Primary CTA (Pflicht)
- ENTWEDER Secondary CTA ODER PWA Button (exklusiv)

✅ **Code-Änderungen:**
- Home.tsx: `secondaryCTA` entfernt
- Features.tsx: `secondaryCTA` entfernt
- Demo.tsx: `secondaryCTA` entfernt
- V28HeroPremium: Interface mit Warnkommentaren versehen

✅ **Dokumentation:**
- `docs/V28_HERO_DESIGN_RULES.md` erstellt
- Validation-Checklisten definiert

### Prevention:
```tsx
// ✅ RICHTIG
<V28HeroPremium
  primaryCTA={...}
  showPWAButton={true}  // 2. Button
/>

// ❌ FALSCH
<V28HeroPremium
  primaryCTA={...}
  secondaryCTA={...}    // ❌ Nicht mit PWA!
  showPWAButton={true}
/>
```

**Grep-Check:**
```bash
# Prüfen auf 3-Button-Verstöße
grep -A 5 "secondaryCTA" src/pages/*.tsx | grep -A 2 "showPWAButton"
# Expected: 0 Treffer!
```

---

## 🐛 ISSUE #2: Inkonsistente Icon-Backgrounds (HIGH)

### Problem:
KPI-Cards im Dashboard hatten verschiedenfarbige Icon-Backgrounds:
- Aufträge: `bg-blue-50` ❌
- Umsatz: `bg-green-50` ❌
- Fahrer: `bg-slate-50` ✅
- Fahrzeuge: `bg-slate-50` ✅

### Impact:
- ❌ Design: Inkonsistent, nicht V28.1-konform
- ❌ Brand: Zu bunt, nicht professionell
- ❌ UX: Ablenkend statt fokussiert

### Root Cause:
Feature-spezifische Farben wurden für Icon-Backgrounds genutzt, statt System-Farben.

### Solution:
✅ **Einheitlicher Standard:** `bg-slate-50` für ALLE Icon-Container

✅ **Code-Änderungen:**
- V28TaxiDashboardPreview:
  - Aufträge Icon-BG: `bg-blue-50` → `bg-slate-50`
  - Aufträge Icon-Color: `text-blue-600` → `text-slate-700`
  - Umsatz Icon-BG: `bg-green-50` → `bg-slate-50`
  - Umsatz Icon-Color: `text-green-600` → `text-slate-700`

✅ **Dokumentation:**
- `docs/V28_HERO_DESIGN_RULES.md` - Section "Icon-Background-Standard"
- Anti-Patterns definiert

### Prevention:
```tsx
// ✅ RICHTIG - Einheitlich
<div className="p-1.5 rounded-lg bg-slate-50">
  <FileText className="w-4 h-4 text-slate-700" />
</div>

// ❌ FALSCH - Bunte Backgrounds
<div className="p-1.5 rounded-lg bg-blue-50">
  <FileText className="w-4 h-4 text-blue-600" />
</div>
```

**Grep-Check:**
```bash
# Prüfen auf verbotene Farben
grep -r "bg-blue-50\|bg-green-50\|bg-red-50" src/components/hero/V28TaxiDashboardPreview.tsx
# Expected: 0 Treffer!
```

### Exception:
Status-Badges (Live, Erledigt, Geplant) dürfen Farben haben:
- Live: `bg-green-100` ✅
- Erledigt: `bg-slate-200` ✅
- Geplant: `bg-blue-50` ✅

---

## 📋 VERIFICATION COMPLETED

### Files Changed:
- `src/components/hero/V28HeroPremium.tsx`
- `src/components/hero/V28TaxiDashboardPreview.tsx`
- `src/pages/Home.tsx`
- `src/pages/Features.tsx`
- `src/pages/Demo.tsx`

### Documentation Created:
- `docs/V28_HERO_DESIGN_RULES.md` (NEW)
- `docs/KNOWN_ISSUES_V28_HERO.md` (THIS FILE)

### Tests Passed:
✅ Max 2 Buttons in allen Hero-Sections
✅ Einheitliche Icon-Backgrounds (`bg-slate-50`)
✅ Einheitliche Icon-Colors (`text-slate-700`)
✅ V28.1 Slate-Palette Compliance

---

**STATUS: ✅ ALLE ISSUES GELÖST - 2025-01-30**
