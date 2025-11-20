# 🎨 Design System

> **Zentrale Design-Vorgaben für MyDispatch**  
> **Version:** 18.5.0  
> **Konsolidiert aus:** 10+ Design-Dokumenten  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🚨 AI MODEL GOVERNANCE (P-00 KRITISCH)

**MyDispatch verwendet AUSSCHLIESSLICH Claude Sonnet 4.5 über Anthropic API**

- **Modell:** `claude-sonnet-4-5`
- **Provider:** Anthropic API
- **API-Key:** `ANTHROPIC_API_KEY` (Supabase Secret)
- **Dokumentation:** `docs/AI_MODEL_GOVERNANCE_V26.0.md`

**VERBOTEN:**

- ❌ Lovable AI Gateway
- ❌ Google Gemini (alle Varianten)
- ❌ OpenAI GPT (alle Varianten)
- ❌ Andere AI-Modelle

**Siehe:** `docs/AI_MODEL_GOVERNANCE_V26.0.md` für vollständige Governance-Regeln.

---

## 🎯 Grundprinzip: ZENTRALISIERUNG

**NIEMALS** direkte Implementierung in Komponenten.  
**IMMER** über zentrale Design-Systeme.

### Warum?

- ✅ Eine Änderung = Systemweite Aktualisierung
- ✅ Keine Inkonsistenzen
- ✅ Wartbarkeit & Skalierbarkeit
- ✅ CI-Konformität garantiert

---

## 🎨 Color System

### Semantic Tokens (PFLICHT!)

**Location:** `src/index.css` + `tailwind.config.ts`

```tsx
// ✅ RICHTIG - Semantic Tokens
className = "text-foreground bg-background";
className = "text-primary bg-primary";
className = "text-muted-foreground bg-muted";

// ❌ FALSCH - Direct Colors
className = "text-white bg-black";
className = "text-[#EADEBD]";
className = "text-blue-500";
```

### Verfügbare Tokens

```css
/* Light Mode */
--background: 40 8% 98%; /* Helles Beige */
--foreground: 225 31% 28%; /* Dunkles Blau */
--primary: 40 31% 88%; /* Beige-Gold (#EADEBD) */
--primary-foreground: 225 31% 28%;
--secondary: 225 31% 28%; /* Dunkles Blau */
--secondary-foreground: 40 31% 88%;
--muted: 40 8% 95%;
--muted-foreground: 225 20% 50%;

/* Status Colors */
--status-success: 142 71% 45%;
--status-warning: 38 92% 50%;
--status-error: 0 84% 60%;
```

---

## 🔘 Button System

**WICHTIG V26.0:** Für standardisierte Primary/Secondary Buttons siehe `V26_COMPONENT_LIBRARY.md` → `V26Button` Komponente.

**Location:** `src/components/ui/button.tsx` + `src/components/design-system/MarketingButton.tsx`

### Standard Buttons (Shadcn Base)

```tsx
<Button variant="default">Primäre Aktion</Button>
<Button variant="secondary">Sekundäre Aktion</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Transparent</Button>
<Button variant="destructive">Löschen</Button>
```

### Marketing Buttons

```tsx
<MarketingButton marketingVariant="hero-primary">
  Jetzt starten
</MarketingButton>
<MarketingButton marketingVariant="hero-secondary">
  Mehr erfahren
</MarketingButton>
```

**Varianten:**

- `hero-primary` - Hero-Hauptbutton (bg-primary)
- `hero-secondary` - Hero-Sekundärbutton (transparent + border)
- `cta-primary` - CTA-Hauptbutton
- `cta-secondary` - CTA-Sekundärbutton

---

## 🎭 Icon System

**WICHTIG V26.0:** Für Icon-Container mit blauem Hintergrund und beigen Icons siehe `V26_COMPONENT_LIBRARY.md` → `V26IconBox` Komponente.

**Location:** `src/components/design-system/Icon.tsx`

### STRIKTE REGEL

```tsx
// ❌ VERBOTEN: Direkte Lucide-Imports
import { Check } from 'lucide-react';
<Check className="text-green-500" />

// ✅ RICHTIG: Icon-Komponente
<Icon name="Check" className="text-foreground" />
<Icon name="AlertCircle" className="text-muted-foreground" />
```

### Erlaubte Icon-Farben

**AUSNAHMSLOS:**

- `text-foreground` (Standard-Dunkelblau)
- `text-muted-foreground` (Deaktiviert/Sekundär)
- `text-primary` (Primär-Akzent)
- `text-background` (Auf dunklen Hintergründen)

**VERBOTEN:**

- ❌ `text-status-success` / `text-green-*`
- ❌ `text-status-warning` / `text-yellow-*`
- ❌ `text-status-error` / `text-red-*`

**Ausnahme:** Status-Farben nur für `StatusIndicator` + `Badge` Komponenten.

---

## 📏 Spacing System

**Location:** `tailwind.config.ts`

### Mobile-First Pattern

```tsx
// ✅ RICHTIG
className = "gap-3 sm:gap-4 md:gap-6";
className = "p-4 sm:p-6 md:p-8";
className = "py-8 sm:py-12 md:py-16";

// ❌ FALSCH
className = "gap-5";
className = "p-7";
```

### Standard-Werte (8px Grid)

- `gap-2` = 8px
- `gap-3` = 12px
- `gap-4` = 16px
- `gap-6` = 24px
- `gap-8` = 32px

---

## 🎯 Touch Targets (Mobile-First)

**PFLICHT:** Minimum 44×44px für interaktive Elemente

```tsx
// ✅ RICHTIG
<Button className="min-h-[44px] min-w-[44px]">

// ❌ FALSCH
<Button className="h-8 w-8">  // Nur 32×32px!
```

---

## 📦 Component-Spezifische Systeme

### Feature-Icon-Boxen

**Location:** `src/components/shared/FeatureIconBox.tsx`

```tsx
// ✅ RICHTIG - Wie Sidebar-Buttons
<FeatureIconBox icon={Car} size="md" />

// ❌ FALSCH - Inkonsistentes Styling
<div className="bg-primary/10 p-3">
  <Icon name="Car" className="text-foreground" />
</div>
```

**Design:**

- `bg-secondary` (Blauer Hintergrund)
- `text-primary-foreground` (Helles Icon)
- Hover: `bg-secondary/90`
- Shadow: `shadow-md`

### Border-Radius bei gestapelten Elementen

**VERPFLICHTEND:** Keine Rundungen an angrenzenden Kanten

```tsx
// ✅ KORREKT
<div className="space-y-0">
  {items.map((item, i) => (
    <Button
      className="rounded-none first:rounded-t-lg last:rounded-b-lg"
    />
  ))}
</div>

// ❌ FALSCH
<div className="space-y-2">
  {items.map((item) => (
    <Button className="rounded-lg" />
  ))}
</div>
```

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
className = "text-blue-500 bg-white";
className = "text-[#323D5E]";
```

### 3. Custom Button-Styles

```tsx
// ❌ NIEMALS
<button className="bg-[#eadebd] hover:bg-[#d4c8a7]">

// ✅ RICHTIG
<Button variant="default">
```

### 4. Nicht-CI-konforme Icons

```tsx
// ❌ NIEMALS
<Check className="text-green-500" />

// ✅ RICHTIG
<Icon name="Check" className="text-foreground" />
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

## 🔧 Tools & Testing

### Design-Token Check

```bash
# Automatischer Check
npm run test:design-tokens

# Script läuft: scripts/check-design-tokens.sh
```

### Visual Regression Tests

```bash
# Playwright E2E
npm run test:e2e

# Spezifische Design Tests
npx playwright test tests/e2e/design-system/
```

---

## 📚 Weitere Ressourcen

- [Component Library](./Component-Library.md) - Alle UI Components
- [Quick Reference](../01-GETTING-STARTED/Quick-Reference.md) - Commands
- [Coding Standards](../03-DEVELOPMENT/Coding-Standards.md) - Code Guidelines

---

## 📝 Changelog

### V18.5.0 (2025-01-26)

- Konsolidierung aus 10+ Design-Dokumenten
- Zentrale Anlaufstelle für alle Design-Fragen
- Content System Integration
- Icon System Guidelines verschärft
- Touch-Target-Pflicht eingeführt

---

**KRITISCH:** Diese Vorgaben sind SYSTEMWEIT und AUSNAHMSLOS zu befolgen.
