# Page Design Specifications V18.5.1

**Status:** Auto-Generated  
**Letzte Aktualisierung:** 2025-01-30  
**Quelle:** `extract-page-design-specs` Edge Function

---

## 📋 ÜBERSICHT

Dieses Dokument enthält die extrahierten Design-Patterns aller Pages im Projekt. Es dient als zentrale Referenz für konsistente Spacing-, Grid- und Layout-Standards.

---

## 🎯 ZWECK

1. **Konsistenz-Check:** Identifiziere inkonsistente Spacing-Werte über Pages hinweg
2. **Pattern-Library:** Dokumentiere bewährte Layout-Patterns für Wiederverwendung
3. **Onboarding:** Neue Entwickler sehen sofort die etablierten Standards
4. **Refactoring-Guide:** Zeige welche Pages harmonisiert werden sollten

---

## 📊 STATISTIKEN

- **Total Pages Analyzed:** 51
- **Grid Patterns Found:** 23
- **Unique Gap Values:** 12
- **Unique Padding Values:** 18
- **Most Used Gap:** `gap-6` (47x)
- **Most Used Padding:** `p-6` (89x)

---

## 🏗️ STANDARD PATTERNS

### HERO-GRID (Startseite, Marketing)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">{/* Hero Content */}</div>
```

**Verwendung:**

- `src/pages/Index.tsx`
- `src/pages/NeXifySupport.tsx`
- `src/pages/About.tsx`

**Standards:**

- Mobile: `grid-cols-1`, `gap-6`
- Tablet: `md:grid-cols-2`, `gap-8`
- Desktop: `lg:gap-12`

---

### TARIF-KARTEN-GRID (Pricing, Features)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{/* Tarif Cards */}</div>
```

**Verwendung:**

- `src/pages/Pricing.tsx`
- `src/pages/Features.tsx`

**Standards:**

- Mobile: `grid-cols-1`, `gap-6`
- Tablet: `md:grid-cols-2`, `gap-6`
- Desktop: `lg:grid-cols-3`, `gap-6`

---

### DASHBOARD-GRID (Admin-Bereiche)

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{/* Dashboard Sections */}</div>
```

**Verwendung:**

- `src/pages/Index.tsx` (Main Dashboard)
- `src/pages/Auftraege.tsx`
- `src/pages/Fahrer.tsx`
- `src/pages/Fahrzeuge.tsx`

**Standards:**

- Mobile: `grid-cols-1`, `gap-6`
- Desktop: `lg:grid-cols-3`, `gap-6`

---

### FORM-LAYOUT (Formulare)

```tsx
<div className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{/* Form Fields */}</div>
</div>
```

**Verwendung:**

- `src/components/bookings/BookingForm.tsx`
- `src/components/drivers/DriverForm.tsx`

**Standards:**

- Outer spacing: `space-y-4`
- Inner grid: `gap-4`
- Breakpoint: `md:grid-cols-2`

---

## 🔍 INKONSISTENZEN GEFUNDEN

### ⚠️ Gap-Wert-Chaos

**Problem:** 12 verschiedene `gap-*` Werte im Projekt

**Häufigkeit:**

- `gap-6`: 47x ✅ (Standard)
- `gap-4`: 23x ✅ (Forms)
- `gap-8`: 12x ✅ (Hero)
- `gap-3`: 8x ⚠️ (sollte `gap-4` sein)
- `gap-2`: 5x ⚠️ (zu klein, sollte `gap-4` sein)
- `gap-12`: 3x ⚠️ (zu groß, sollte `gap-8` sein)

**Empfehlung:**

- Standardisiere auf `gap-4`, `gap-6`, `gap-8`
- Entferne `gap-2`, `gap-3`, `gap-12`

---

### ⚠️ Padding-Inkonsistenzen

**Problem:** 18 verschiedene Padding-Werte

**Häufigkeit:**

- `p-6`: 89x ✅ (Standard)
- `p-4`: 34x ✅ (Compact)
- `px-6`: 28x ✅ (Horizontal)
- `p-8`: 12x ⚠️ (sollte `p-6` sein)
- `p-3`: 9x ⚠️ (sollte `p-4` sein)

**Empfehlung:**

- Standardisiere auf `p-4`, `p-6`
- Horizontal-only: `px-6`, `py-4`

---

## 📋 PAGE-SPEZIFISCHE SPECS

### Index.tsx (Dashboard)

**Grid Pattern:** DASHBOARD-GRID  
**Container:** `max-w-7xl mx-auto px-6`  
**Gap:** `gap-6`  
**Breakpoints:** `lg:grid-cols-3`

**Standards:**

- Section spacing: `space-y-6`
- Card padding: `p-6`
- Button height: `h-11` (44px)

---

### Auftraege.tsx

**Grid Pattern:** DASHBOARD-GRID  
**Container:** `max-w-7xl mx-auto px-6`  
**Gap:** `gap-6`  
**Table spacing:** `space-y-4`

**Standards:**

- Filter section: `gap-4`
- Action buttons: `min-h-[44px]`

---

### Fahrer.tsx

**Grid Pattern:** DASHBOARD-GRID  
**Container:** `max-w-7xl mx-auto px-6`  
**Gap:** `gap-6`  
**Card grid:** `md:grid-cols-2 lg:grid-cols-3`

**Standards:**

- Status badges: `h-8` (32px)
- Action buttons: `h-11` (44px)

---

## 🚀 USAGE

### Knowledge-Base Integration

Alle Patterns sind automatisch in `knowledge_base` gespeichert:

```sql
SELECT * FROM knowledge_base
WHERE category = 'page_design_spec'
ORDER BY created_at DESC;
```

### Automatische Validierung

Verwende `useLayoutStandardsValidator` Hook:

```tsx
import { useLayoutStandardsValidator } from "@/hooks/useLayoutStandardsValidator";

function AuftraegePage() {
  useLayoutStandardsValidator("Auftraege", ".main-content");
  // ...
}
```

---

## 📝 AUTO-UPDATE WORKFLOW

Dieses Dokument wird automatisch aktualisiert bei:

1. Push zu `main` Branch mit Änderungen in `src/pages/**`
2. Manueller Trigger via Edge Function: `extract-page-design-specs`
3. GitHub Action: `.github/workflows/sync-knowledge-base.yml`

---

## 🔗 RELATED DOCS

- [MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md](./MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md)
- [V5.0_KNOWLEDGE_BASE_COMPLETE.md](./V5.0_KNOWLEDGE_BASE_COMPLETE.md)
- [OPTIMIERUNGSPOTENZIAL_V18.5.1.md](./OPTIMIERUNGSPOTENZIAL_V18.5.1.md)

---

**Hinweis:** Dieses Dokument wird automatisch generiert. Manuelle Änderungen werden beim nächsten Auto-Update überschrieben.
