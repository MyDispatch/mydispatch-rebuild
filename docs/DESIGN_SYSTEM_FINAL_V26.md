# DESIGN SYSTEM FINAL V26.0 - MASTER-DOKUMENTATION
> **Version:** 26.0 "BALANCED"  
> **Letzte Aktualisierung:** 2025-01-26  
> **Status:** 🔒 LOCKED & PRODUCTION READY

---

## 🎯 ÜBERBLICK

Dies ist die Master-Dokumentation für das V26.0 "BALANCED" Design System von MyDispatch. Alle Design-Entscheidungen basieren auf der `Pricing.tsx`-Vorlage und sind systemweit verpflichtend.

---

## 📚 STRUKTUR & NAVIGATION

### Kern-Dokumentation
1. **KERNFARBEN:** `src/lib/design-system/pricing-colors.ts` - Zentrale Farb-Definitionen
2. **Design-Tokens:** `src/lib/design-system/design-tokens.ts` - Spacing, Elevation, Motion
3. **Komponenten-Library:** `docs/V26_COMPONENT_LIBRARY.md` - Wiederverwendbare Komponenten
4. **Typografie:** `docs/TYPOGRAPHY_SYSTEM_V26.md` - Schriftarten & Hierarchie
5. **Infoboard:** `docs/V26_INFOBOARD_SYSTEM.md` - Notice-/Hinweis-Boxen
6. **Migration-Log:** `docs/MIGRATION_V26_AUFTRAEGE_LOG.md` - Implementierungs-Historie

### Erweiterte Dokumentation
- **Pricing Design:** `docs/PRICING_DESIGN_SYSTEM_V26.0.md` - Marketing-Seiten
- **Design-System Basis:** `docs/02-ARCHITECTURE/Design-System.md` - Allgemeine Regeln
- **UI-Library:** `docs/UI_LIBRARY_SYSTEM_V18.5.0.md` - Shared Components

---

## 🎨 KERNFARBEN (Zwingend!)

**Datei:** `src/lib/design-system/pricing-colors.ts`

```typescript
export const KERNFARBEN = {
  dunkelblau: '#323D5E',
  beige: '#EADEBD',
  weiss: '#FFFFFF',
  canvas: '#F9FAFB',
  text_primary: '#111827',
  text_secondary: '#374151',
  text_tertiary: '#6B7280',
  border_neutral: '#E5E7EB',
  border_neutral_soft: 'rgba(229, 231, 235, 0.8)',
} as const;
```

### Verwendungs-Matrix

| Farbe | Primäre Verwendung | Sekundäre Verwendung |
|-------|-------------------|----------------------|
| **dunkelblau** | Button-Background (Primary), Icon-Container-Background, Active States | Borders (20-40% Opacity), Accents |
| **beige** | Text auf Dunkelblau, Icons in blauen Containern | - |
| **weiss** | Card-Hintergründe, Secondary Button-Background | - |
| **canvas** | Seiten-Hintergrund, Notice-Boxen | - |
| **text_primary** | H1-H3, KPI-Werte, Card-Titel | - |
| **text_secondary** | Body-Text, Beschreibungen | - |
| **text_tertiary** | Sub-Texte, Labels, Meta-Info | - |
| **border_neutral** | Standard-Borders, Hover-States | - |
| **border_neutral_soft** | Default-Card-Borders | - |

---

## 🧩 KOMPONENTEN-SYSTEM

### 1. Buttons (V26Button)
**Datei:** `src/components/design-system/V26Button.tsx`

#### Primary Button
```tsx
<V26Button variant="primary" onClick={handleAction}>
  <Plus className="h-4 w-4" />
  Neu erstellen
</V26Button>
```
- **Background:** Dunkelblau
- **Text:** Beige
- **Hover:** `#3F4C70` + Schatten + `scale(1.02)`

#### Secondary Button
```tsx
<V26Button variant="secondary" onClick={handleAction}>
  Abbrechen
</V26Button>
```
- **Background:** Weiß
- **Border:** 2px Dunkelblau
- **Text:** Dunkelblau
- **Hover:** Dunkelblau 10% Opacity + `scale(1.02)`

**Regel:** Pro Kontext maximal 1 Primary, beliebig viele Secondary.

---

### 2. Icon-Container (V26IconBox)
**Datei:** `src/components/design-system/V26IconBox.tsx`

```tsx
<V26IconBox icon={FileText} size="md" />
```
- **Background:** Dunkelblau (`#323D5E`)
- **Icon-Farbe:** Beige (`#EADEBD`)
- **Größen:** sm (40px), md (48px), lg (64px)

**Verwendung:** KPI-Cards, Features, Hero-Sektionen

---

### 3. Hinweis-Boxen (V26InfoBox)
**Datei:** `src/components/design-system/V26InfoBox.tsx`

#### Legal (DSGVO, PBefG)
```tsx
<V26InfoBox type="legal" title="PBefG § 51 Hinweis">
  Auftragsdaten werden für 10 Jahre gespeichert.
</V26InfoBox>
```

#### Warning
```tsx
<V26InfoBox type="warning" title="Achtung">
  Diese Aktion kann nicht rückgängig gemacht werden.
</V26InfoBox>
```

#### Info (Standard)
```tsx
<V26InfoBox title="Hinweis">
  Wichtige Information für den Nutzer.
</V26InfoBox>
```

- **Background:** Canvas (`#F9FAFB`)
- **Text:** `text_secondary`
- **Titel:** `text_primary`

---

## 📐 DESIGN-TOKENS

### Spacing
```typescript
spacing: {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
}
```

### Elevation (Shadows)
```typescript
elevation: {
  sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
}
```

### Border-Radius
```typescript
radius: {
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',    // Standard für Cards
  full: '9999px', // Standard für Buttons
}
```

### Motion
```typescript
motion: {
  duration: {
    fast: '150ms',
    default: '300ms',
    slow: '500ms',
  },
  timing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}
```

---

## 🔤 TYPOGRAFIE

**Schriftart:** Inter (Sans-Serif)  
**Fallbacks:** -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial

### Hierarchie
```tsx
// H1 - Seitentitel
<h1 className="text-2xl sm:text-3xl font-bold text-foreground font-sans">

// H2 - Sektion-Titel
<h2 className="text-xl sm:text-2xl font-semibold text-foreground font-sans">

// H3 - Card-Titel
<h3 className="text-lg font-semibold text-foreground font-sans">

// Body Text
<p className="text-sm sm:text-base text-muted-foreground font-sans">

// Small Text
<span className="text-xs text-muted-foreground font-sans">
```

**Pflicht:** `font-sans` auf allen Text-Elementen!

---

## ✅ PFLICHT-REGELN

### 1. KERNFARBEN verwenden
```tsx
// ✅ RICHTIG
import { KERNFARBEN } from '@/lib/design-system/pricing-colors';
style={{ backgroundColor: KERNFARBEN.dunkelblau }}

// ❌ FALSCH
style={{ backgroundColor: '#323D5E' }}
className="bg-blue-500"
```

### 2. V26-Komponenten verwenden
```tsx
// ✅ RICHTIG
<V26Button variant="primary">Aktion</V26Button>
<V26IconBox icon={FileText} />
<V26InfoBox type="legal">Hinweis</V26InfoBox>

// ❌ FALSCH
<button style={{ backgroundColor: '#323D5E' }}>Aktion</button>
<div className="w-12 h-12 bg-primary"><FileText /></div>
<div className="bg-gray-50 p-4">Hinweis</div>
```

### 3. Responsive Typografie
```tsx
// ✅ RICHTIG
<h1 className="text-2xl sm:text-3xl lg:text-4xl">

// ❌ FALSCH
<h1 className="text-4xl">
```

### 4. Semantic Tokens
```tsx
// ✅ RICHTIG
<p style={{ color: KERNFARBEN.text_secondary }}>

// ❌ FALSCH
<p className="text-gray-700">
```

---

## 🚫 VERBOTEN

### Direct Colors
```tsx
// ❌ VERBOTEN
className="text-white bg-black text-blue-500"
style={{ color: '#FFFFFF' }}
```

### Inline Styles ohne KERNFARBEN
```tsx
// ❌ VERBOTEN
style={{ backgroundColor: '#ccc', padding: '10px' }}
```

### Custom Button Styles
```tsx
// ❌ VERBOTEN
<Button className="bg-primary text-white rounded-full">
```

### Nicht-responsive Schriftgrößen
```tsx
// ❌ VERBOTEN
<h1 className="text-5xl">
```

---

## 📋 MIGRATIONS-CHECKLIST

Für jede neue Seite/Komponente:
- [ ] KERNFARBEN importiert und verwendet
- [ ] Buttons durch `V26Button` ersetzt
- [ ] Icons durch `V26IconBox` ersetzt
- [ ] Notice-Boxen durch `V26InfoBox` ersetzt
- [ ] `font-sans` auf allen Text-Elementen
- [ ] Responsive Schriftgrößen (`text-sm sm:text-base`)
- [ ] Cards: `rounded-2xl` mit KERNFARBEN-Borders
- [ ] Hover-Effekte: `scale(1.02)` + `duration-300`
- [ ] Mobile-First getestet (375px, 768px, 1920px)
- [ ] WCAG AA Kontraste geprüft

---

## 📊 QUALITY GATES

### Pre-Commit
- [ ] Keine Direct Colors (`grep -r "text-white\|bg-black"`)
- [ ] Keine Inline-Styles ohne KERNFARBEN
- [ ] TypeScript: Zero Errors
- [ ] Prettier: Formatierung korrekt

### Pre-Deploy
- [ ] Visual Regression Tests: Pass
- [ ] Accessibility Tests: WCAG AA
- [ ] Performance: Core Web Vitals
- [ ] Mobile: Touch-Targets ≥ 44px

---

## 🛠️ TOOLS & COMMANDS

### Code Checks
```bash
# Suche nach Direct Colors
grep -r "text-white\|bg-black\|text-blue-" src/

# Suche nach fehlenden font-sans
grep -r "className=" src/ | grep -v "font-sans"

# Suche nach Inline-Styles
grep -r "style={{" src/ | grep -v "KERNFARBEN"
```

### Testing
```bash
# Visual Regression
npm run test:visual

# Accessibility
npm run test:a11y

# Component Tests
npm run test:components
```

---

## 📈 SYSTEM-STATUS

| Kategorie | Status | Compliance |
|-----------|--------|------------|
| **KERNFARBEN** | ✅ | 100% |
| **Komponenten** | ✅ | 100% |
| **Typografie** | ✅ | 100% |
| **Infoboard** | ✅ | 100% |
| **Buttons** | ✅ | 100% |
| **Icons** | ✅ | 100% |
| **Mobile-First** | ✅ | 100% |
| **WCAG AA** | ✅ | 100% |

---

## 🔗 QUICK LINKS

- [V26 Component Library](./V26_COMPONENT_LIBRARY.md) - Buttons, Icons, InfoBoxen
- [Typography System](./TYPOGRAPHY_SYSTEM_V26.md) - Schriftarten & Hierarchie
- [Infoboard System](./V26_INFOBOARD_SYSTEM.md) - Notice-Boxen
- [Migration Log](./MIGRATION_V26_AUFTRAEGE_LOG.md) - Implementierungs-Historie
- [Pricing Design](./PRICING_DESIGN_SYSTEM_V26.0.md) - Marketing-Seiten

---

**Master-Dokumentation erstellt:** 2025-01-26  
**Version:** V26.0 "BALANCED"  
**Status:** 🔒 LOCKED & PRODUCTION READY
