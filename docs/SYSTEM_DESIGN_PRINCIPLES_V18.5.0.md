# SYSTEM DESIGN PRINCIPLES V18.5.0

> **Zentrale Design-Vorgaben für MyDispatch**  
> **Version:** 18.5.0 → **V28.1 FINAL**  
> **Letzte Aktualisierung:** 2025-10-28  
> **Status:** ✅ V28.1 Professional Gray-Blue Flat Design ist AKTIV

## 🚨 V28.1 UPDATE - BREAKING CHANGES
**Ab sofort gelten folgende neue Regeln systemweit:**
- ✅ **NO ROUNDED CORNERS** - Alle border-radius entfernt
- ✅ **Flat Design System** - Keine 3D-Effekte, keine Glows
- ✅ **Slate Palette** - Nur noch slate-50 bis slate-900
- ✅ **1px Borders** - Keine dicken Borders mehr
- ✅ **Tailwind Shadows** - Nur Standard shadow-sm, shadow-md, etc.

**Siehe:** `docs/V28.1_DESIGN_SYSTEM_FINAL.md` für vollständige V28.1 Specs

---

## 🎯 GRUNDPRINZIP: ZENTRALISIERUNG

**NIEMALS** direkte Implementierung in Komponenten.  
**IMMER** über zentrale Design-Systeme.

### Warum?
- ✅ Eine Änderung = Systemweite Aktualisierung
- ✅ Keine Inkonsistenzen
- ✅ Wartbarkeit & Skalierbarkeit
- ✅ CI-Konformität garantiert

---

## 📚 ZENTRALE SYSTEME

### 1. Button-System
**Location:** `src/components/ui/button.tsx` + `src/components/design-system/MarketingButton.tsx`

**Regel:**
```tsx
// ❌ FALSCH
<button className="bg-blue-500 text-white">Click</button>

// ✅ RICHTIG
<Button variant="default">Click</Button>
<MarketingButton marketingVariant="hero-primary">Click</MarketingButton>
```

**Varianten:**
- `default` - Primäre Aktion (bg-primary)
- `secondary` - Sekundäre Aktion (bg-secondary)
- `outline` - Outline-Stil
- `ghost` - Transparent mit Hover
- `destructive` - Löschen/Warnung

**Marketing-Varianten:**
- `hero-primary` - Hero-Hauptbutton (bg-primary)
- `hero-secondary` - Hero-Sekundärbutton (transparent + border)
- `cta-primary` - CTA-Hauptbutton
- `cta-secondary` - CTA-Sekundärbutton

### 3. Feature-Icon-Boxen
**Location:** `src/components/shared/FeatureIconBox.tsx`

**Regel:**
```tsx
// ❌ FALSCH - Inkonsistentes Styling
<div className="bg-primary/10 p-3">
  <Icon className="text-foreground" />
</div>

// ✅ RICHTIG - Wie Sidebar-Buttons
<FeatureIconBox icon={Car} size="md" />
```

**Design:**
- `bg-secondary` (Blauer Hintergrund)
- `text-primary-foreground` (Helles Icon)
- Hover: `bg-secondary/90`
- Shadow: `shadow-md`

**Größen:**
- `sm` - Kleine Icons (p-2, h-4 w-4)
- `md` - Standard (p-2 sm:p-3, h-6 w-6 sm:h-8 w-8)
- `lg` - Große Icons (p-3 sm:p-4, h-8 w-8 sm:h-10 w-10)
**Location:** `src/components/design-system/Icon.tsx`

**STRIKTE REGEL:**
```tsx
// ❌ VERBOTEN: Direkte Lucide-Imports
import { Check } from 'lucide-react';
<Check className="text-green-500" />

// ❌ VERBOTEN: Status-Farben auf Icons
<Icon name="Check" className="text-status-success" />

// ✅ RICHTIG: Icon-Komponente mit CI-Farben
<Icon name="Check" className="text-foreground" />
<Icon name="AlertCircle" className="text-muted-foreground" />
```

**Erlaubte Icon-Farben (AUSNAHMSLOS):**
- `text-foreground` (Standard-Dunkelblau)
- `text-muted-foreground` (Deaktiviert/Sekundär)
- `text-accent` (Sonderfälle, Bronze/Gold-Akzent)

**VERBOTEN:**
- ❌ `text-status-success` / `text-green-*`
- ❌ `text-status-warning` / `text-yellow-*`
- ❌ `text-status-error` / `text-red-*`
- ❌ Jegliche direkte Tailwind-Farben

**Ausnahme:**
Status-Farben nur für `StatusIndicator` + `Badge` Komponenten.

### 3. Color-System
**Location:** `src/index.css` + `tailwind.config.ts`

**Regel:**
```tsx
// ❌ FALSCH
className="text-white bg-black"
className="text-[#323D5E]"

// ✅ RICHTIG
className="text-foreground bg-background"
className="text-primary-foreground bg-primary"
```

**Semantic Tokens:**
- `--background` / `--foreground`
- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--accent` / `--accent-foreground`
- `--muted` / `--muted-foreground`
- `--status-success` / `--status-warning` / `--status-error`

### 4. Spacing-System
**Location:** `tailwind.config.ts`

**Mobile-First Pattern:**
```tsx
// ✅ RICHTIG
className="gap-3 sm:gap-4 md:gap-6"
className="p-4 sm:p-6 md:p-8"
className="py-8 sm:py-12 md:py-16"

// ❌ FALSCH
className="gap-5"
className="p-7"
```

**Standard-Werte (8px Grid):**
- `gap-2` (8px)
- `gap-3` (12px)
- `gap-4` (16px)
- `gap-6` (24px)
- `gap-8` (32px)

### 5. Border-Radius - V28.1 FLAT DESIGN

**🚫 KRITISCH: NO ROUNDED CORNERS (V28.1)**

**Alle `rounded-*` Classes sind VERBOTEN:**
```tsx
// ❌ VERBOTEN - Keine Rundungen mehr!
className="rounded-xl"
className="rounded-2xl"
className="rounded-t-lg"
className="rounded-b-lg"
className="rounded-full"

// ✅ RICHTIG - Clean & Flat
<div className="border border-slate-200">
  {/* Keine Rundungen */}
</div>
```

**Grund:** V28.1 ist ein **Flat Design System**. Alle Rundungen wurden entfernt für:
- Klare, professionelle Ästhetik
- Keine "Lückenfüll-Lösungen" mit absolut positionierten Divs
- Konsistentes, minimalistisches Erscheinungsbild

### 6. Links - KEINE Unterstreichungen

**VERPFLICHTEND:** Systemweit keine Unterstreichungen bei Links.

```tsx
// ✅ RICHTIG - V26Link ohne Unterstreichung
<V26Link to="/page">Link Text</V26Link>

// ✅ RICHTIG - Normale Links
<Link to="/page" className="no-underline">Link</Link>

// ❌ FALSCH - Unterstrichene Links
<a className="underline">Link</a>
<Link className="underline">Link</Link>
```

**Regel:**
- Alle Links verwenden `no-underline`
- Hover-Effekte über Farbwechsel, NICHT über Unterstreichungen
- V26Link-Komponente ist bereits konform

---

## 🚫 VERBOTENE PATTERNS

### 1. Inline-Styles
```tsx
// ❌ NIEMALS
<div style={{ backgroundColor: '#eadebd' }}>
```

### 2. Direkte Farben
```tsx
// ❌ NIEMALS
className="text-blue-500 bg-white"
className="text-[#323D5E]"
```

### 3. Custom Button-Styles
```tsx
// ❌ NIEMALS
<button className="bg-[#eadebd] hover:bg-[#d4c8a7] text-[#323d5e]">

// ✅ RICHTIG
<Button variant="default">
```

### 4. Nicht-CI-konforme Icons
```tsx
// ❌ NIEMALS
<Check className="text-green-500" />
<AlertTriangle className="text-yellow-500" />

// ✅ RICHTIG
<Icon name="Check" className="text-foreground" />
<StatusIndicator status="success" label="Aktiv" />
```

---

## ✅ QUALITY CHECKLIST

Vor jedem Commit:

```
[ ] Alle Buttons über Button/MarketingButton-System
[ ] Alle Icons über Icon-Komponente
[ ] Keine direkten Farben (nur Semantic Tokens)
[ ] Mobile-First Spacing (gap-3 sm:gap-4)
[ ] Keine Inline-Styles
[ ] CI-konforme Icon-Farben (text-foreground/muted)
[ ] Touch-Targets min-h-[44px]
```

---

## 📖 SIEHE AUCH

- **`V28.1_DESIGN_SYSTEM_FINAL.md`** - ⭐ HAUPTDOKUMENTATION für V28.1
- `ICON_GUIDELINES.md` - Icon-Farb-Regeln
- `BUTTON_USAGE_GUIDE_V18.5.0.md` - Button-Varianten
- `DESIGN_SYSTEM_V18.5.0.md` - Vollständiges Design-System (veraltet, siehe V28.1)
- `UI_LIBRARY_SYSTEM_V18.5.0.md` - Komponenten-Bibliothek

---

## 🗑️ DEPRECATED (V26.x)

**Folgende Design-Versionen sind NICHT MEHR GÜLTIG:**
- ❌ V26.x Design System - Komplett ersetzt durch V28.1
- ❌ Beige/Dunkelblau Farbpalette - Ersetzt durch Slate
- ❌ Rounded Corners - Komplett entfernt
- ❌ 2-3px Borders - Ersetzt durch 1px
- ❌ Custom Shadow Glows - Ersetzt durch Tailwind Standard

**Migration:** Siehe `docs/V28.1_DESIGN_SYSTEM_FINAL.md` für Migration Guide

---

**KRITISCH:** Diese Vorgaben sind SYSTEMWEIT und AUSNAHMSLOS zu befolgen.
