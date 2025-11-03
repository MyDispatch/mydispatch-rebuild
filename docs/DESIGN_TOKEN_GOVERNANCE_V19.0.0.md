# 🎨 DESIGN TOKEN GOVERNANCE V19.0.0

**Status:** Production-Ready (P-00)  
**Gültig ab:** 2025-10-25  
**Zweck:** Verpflichtende Design-Token-Nutzung für skalierbare UI  
**Klassifizierung:** Bindend für alle UI-Entwicklungen  
**Hierarchie:** Untergeordnet zu MYDISPATCH_CORPORATE_GOVERNANCE_V19.0.0.md

---

## 📋 ÜBERSICHT

Dieses Dokument definiert die **obligatorische Nutzung von Design-Tokens** für alle UI-Entwicklungen bei MyDispatch. Design-Tokens sind die Single Source of Truth für alle visuellen Eigenschaften (Farben, Abstände, Schatten, etc.) und gewährleisten:

1. **Konsistenz:** Alle UI-Elemente folgen denselben visuellen Regeln
2. **Skalierbarkeit:** Änderungen an einem Token wirken sich global aus
3. **Wartbarkeit:** Zentrale Definition, keine Code-Duplikation
4. **Accessibility:** Konforme Kontraste, Touch-Targets, etc.

---

## 🚨 TOKEN-ZWANG (MANDATORY)

**AB SOFORT GILT:**

### ✅ PFLICHT: Design-Tokens verwenden

**Datei:** `src/lib/design-system/design-tokens.ts`

```typescript
import { DESIGN_TOKENS } from '@/lib/design-system/design-tokens';

// ✅ RICHTIG: Design-Tokens verwenden
<div style={{
  backgroundColor: DESIGN_TOKENS.colors.dunkelblau,
  padding: DESIGN_TOKENS.spacing.card_padding_mobile,
  borderRadius: DESIGN_TOKENS.radius.card,
  boxShadow: DESIGN_TOKENS.elevation.card_default,
}}>
```

### ❌ VERBOTEN: Direkte Tailwind-Klassen

```typescript
// ❌ FALSCH: Direkte Tailwind-Klassen für visuelle Eigenschaften
<div className="bg-[#323D5E] p-6 rounded-2xl shadow-lg">

// ❌ FALSCH: Hardcoded Werte
<div style={{ padding: '24px', borderRadius: '16px' }}>

// ❌ FALSCH: Direkte Farben
<div className="text-white bg-black">
```

### ⚠️ AUSNAHMEN (Nur in begründeten Fällen)

**Erlaubt (mit Begründung):**
- Layout-Klassen: `flex`, `grid`, `container`, `mx-auto`
- Utility-Klassen: `hidden`, `block`, `relative`, `absolute`
- Responsive Breakpoints: `md:grid-cols-2`, `lg:flex-row`

**Begründung erforderlich für:**
- Tailwind-Farben in bestehenden Komponenten (Migration geplant)
- Einmalige, komponentenspezifische Werte (z.B. custom Icon-Größe)

---

## 🎨 TOKEN-KATEGORIEN

### 1. COLORS (Farben)

**Verfügbar:**
- `DESIGN_TOKENS.colors.dunkelblau` (#323D5E) - Hauptfarbe
- `DESIGN_TOKENS.colors.beige` (#EADEBD) - Akzentfarbe
- `DESIGN_TOKENS.colors.weiss` (#FFFFFF) - Hintergrund
- `DESIGN_TOKENS.colors.canvas` (#F9FAFB) - Sektion-Hintergrund
- `DESIGN_TOKENS.colors.text_primary` (#111827) - Überschriften
- `DESIGN_TOKENS.colors.text_secondary` (#374151) - Body-Text
- `DESIGN_TOKENS.colors.text_tertiary` (#6B7280) - Sub-Text
- `DESIGN_TOKENS.colors.hover_primary` - Hover-Zustand
- `DESIGN_TOKENS.colors.success` - Erfolg (grün)
- `DESIGN_TOKENS.colors.error` - Fehler (rot)

**Verwendung:**
```typescript
style={{ 
  backgroundColor: DESIGN_TOKENS.colors.dunkelblau,
  color: DESIGN_TOKENS.colors.beige,
}}
```

### 2. SPACING (Abstände)

**Verfügbar:**
- `DESIGN_TOKENS.spacing.xs` (8px)
- `DESIGN_TOKENS.spacing.sm` (12px)
- `DESIGN_TOKENS.spacing.md` (16px)
- `DESIGN_TOKENS.spacing.lg` (24px)
- `DESIGN_TOKENS.spacing.xl` (32px)
- `DESIGN_TOKENS.spacing.section_padding_mobile` (80px)
- `DESIGN_TOKENS.spacing.section_padding_desktop` (96px)
- `DESIGN_TOKENS.spacing.card_padding_mobile` (24px)
- `DESIGN_TOKENS.spacing.card_padding_desktop` (32px)
- `DESIGN_TOKENS.spacing.card_gap` (32px)

**Verwendung:**
```typescript
style={{ 
  padding: DESIGN_TOKENS.spacing.card_padding_mobile,
  gap: DESIGN_TOKENS.spacing.card_gap,
}}
```

### 3. ELEVATION (Schatten)

**Verfügbar:**
- `DESIGN_TOKENS.elevation.card_default` - Standard-Card-Schatten
- `DESIGN_TOKENS.elevation.card_hover` - Card-Hover-Schatten
- `DESIGN_TOKENS.elevation.card_highlighted` - Hervorgehobene Card
- `DESIGN_TOKENS.elevation.button_primary` - Primary-Button-Hover
- `DESIGN_TOKENS.elevation.neutral_subtle` - Subtiler Schatten

**Verwendung:**
```typescript
style={{ 
  boxShadow: DESIGN_TOKENS.elevation.card_default,
}}
```

### 4. RADIUS (Abrundungen)

**Verfügbar:**
- `DESIGN_TOKENS.radius.card` (16px, rounded-2xl)
- `DESIGN_TOKENS.radius.button` (9999px, rounded-full)
- `DESIGN_TOKENS.radius.input` (8px, rounded-lg)
- `DESIGN_TOKENS.radius.icon_container` (8px oder 9999px)

**Verwendung:**
```typescript
style={{ 
  borderRadius: DESIGN_TOKENS.radius.card,
}}
```

### 5. MOTION (Animationen)

**Verfügbar:**
- `DESIGN_TOKENS.motion.duration_default` (300ms)
- `DESIGN_TOKENS.motion.duration_fast` (200ms)
- `DESIGN_TOKENS.motion.ease_default` (cubic-bezier)
- `DESIGN_TOKENS.motion.transition_default` (all 0.3s ease)
- `DESIGN_TOKENS.motion.transition_transform` (transform 0.3s ease)

**Verwendung:**
```typescript
style={{ 
  transition: DESIGN_TOKENS.motion.transition_default,
}}

onMouseEnter={(e) => {
  e.currentTarget.style.transform = 'scale(1.02)';
}}
```

### 6. TYPOGRAPHY (Typografie)

**Verfügbar:**
- `DESIGN_TOKENS.typography.font_family_base` (Inter)
- `DESIGN_TOKENS.typography.font_size_h1_mobile` (48px)
- `DESIGN_TOKENS.typography.font_size_h1_desktop` (60px)
- `DESIGN_TOKENS.typography.font_size_body` (16px)
- `DESIGN_TOKENS.typography.font_weight_bold` (700)
- `DESIGN_TOKENS.typography.line_height_relaxed` (1.625)

**Verwendung:**
```typescript
style={{ 
  fontFamily: DESIGN_TOKENS.typography.font_family_base,
  fontSize: DESIGN_TOKENS.typography.font_size_h1_mobile,
  fontWeight: DESIGN_TOKENS.typography.font_weight_bold,
}}
```

### 7. INTERACTIVE (Interaktive Elemente)

**Verfügbar:**
- `DESIGN_TOKENS.interactive.min_touch_target` (44px)
- `DESIGN_TOKENS.interactive.button_height` (48px)
- `DESIGN_TOKENS.interactive.button_primary_bg` (Dunkelblau)
- `DESIGN_TOKENS.interactive.button_primary_hover_scale` (1.02)
- `DESIGN_TOKENS.interactive.focus_ring_color` (Dunkelblau)

**Verwendung:**
```typescript
style={{ 
  minHeight: DESIGN_TOKENS.interactive.min_touch_target,
  backgroundColor: DESIGN_TOKENS.interactive.button_primary_bg,
}}
```

---

## 📝 MIGRATIONS-PROZESS

### Phase 1: Neue Komponenten (SOFORT)

**Alle neuen Komponenten MÜSSEN Design-Tokens verwenden.**

```typescript
// NEU: MyNewComponent.tsx
import { DESIGN_TOKENS } from '@/lib/design-system/design-tokens';

export function MyNewComponent() {
  return (
    <div style={{
      backgroundColor: DESIGN_TOKENS.colors.weiss,
      padding: DESIGN_TOKENS.spacing.card_padding_mobile,
      borderRadius: DESIGN_TOKENS.radius.card,
      boxShadow: DESIGN_TOKENS.elevation.card_default,
    }}>
      Content
    </div>
  );
}
```

### Phase 2: Bestehende Komponenten (SCHRITTWEISE)

**Priorisierung:**
1. **P1 (Kritisch):** Marketing-Komponenten (Pricing, Hero, Features)
2. **P2 (Hoch):** Shared-Komponenten (Button, Card, Input)
3. **P3 (Mittel):** Dashboard-Komponenten
4. **P4 (Niedrig):** Admin-Komponenten

**Vorgehen:**
1. Identifiziere direkte Tailwind-Klassen für visuelle Eigenschaften
2. Ersetze durch entsprechende Design-Tokens
3. Teste visuell (keine Änderungen in der Darstellung!)
4. Commit mit Prefix `refactor(tokens):`

### Phase 3: Tailwind-Config-Update (SPÄTER)

**Langfristig:** Tailwind-Config mit Design-Tokens synchronisieren

```javascript
// tailwind.config.ts (Zukunft)
import { DESIGN_TOKENS } from './src/lib/design-system/design-tokens';

export default {
  theme: {
    extend: {
      colors: DESIGN_TOKENS.colors,
      spacing: DESIGN_TOKENS.spacing,
      // etc.
    }
  }
}
```

---

## ✅ COMPLIANCE-CHECKS

### Pre-Commit Check (Developer)

**Vor jedem Commit prüfen:**
- [ ] Keine neuen direkten Farben (`bg-[#...]`, `text-white`, etc.)
- [ ] Keine hardcoded Abstände in neuen/geänderten Komponenten
- [ ] Keine hardcoded Schatten/Radien in neuen/geänderten Komponenten
- [ ] Design-Tokens korrekt importiert und verwendet
- [ ] Visuelle Darstellung unverändert (bei Refactoring)

### Code-Review Check (Reviewer)

**Reviewer prüft:**
- [ ] Sind Design-Tokens verwendet?
- [ ] Sind Ausnahmen begründet?
- [ ] Ist die visuelle Konsistenz gewahrt?
- [ ] Sind Mobile-First-Regeln eingehalten? (Touch-Targets, Responsive)

### CI/CD Check (Automated)

**Automatische Checks (geplant):**
- ESLint-Rule: Keine direkten Farb-Werte in neuen Dateien
- Visual Regression Tests: Keine unerwarteten visuellen Änderungen
- Accessibility Tests: Touch-Targets ≥ 44px, Kontraste WCAG 2.1 AA

---

## 🔗 VERWANDTE DOKUMENTATION

**Hierarchie:**
```
MYDISPATCH_CORPORATE_GOVERNANCE_V19.0.0.md (Oberste Ebene)
├─ DESIGN_TOKEN_GOVERNANCE_V19.0.0.md (Diese Datei)
├─ Design-System.md (Allgemeine Design-Vorgaben)
├─ PRICING_DESIGN_SYSTEM_V26.0.md (Pricing-spezifisch)
└─ src/lib/design-system/design-tokens.ts (Code-Implementierung)
```

---

## 📊 METRIKEN & ZIELE

**Ziele (Q1 2026):**
- 100% Design-Token-Nutzung in neuen Komponenten
- 80% Design-Token-Nutzung in bestehenden Komponenten (P1+P2)
- 0% direkte Farb-Werte in neuem Code
- 0% hardcoded Abstände/Schatten/Radien in neuem Code

**Tracking:**
- Monatlicher Bericht: Anzahl Komponenten mit/ohne Design-Tokens
- Code-Review-Feedback: Anzahl abgelehnter PRs wegen Token-Verstößen
- Developer-Feedback: Usability der Design-Tokens

---

## 📝 CHANGELOG

### V19.0.0 (2025-10-25) - INITIAL RELEASE

**🎯 NEU:**
- Design-Token-System erstellt (`src/lib/design-system/design-tokens.ts`)
- Token-Kategorien definiert: Colors, Spacing, Elevation, Radius, Motion, Typography, Interactive
- Token-Zwang für neue Komponenten eingeführt
- Migrations-Prozess für bestehende Komponenten definiert
- Compliance-Checks dokumentiert
- Helper-Functions für CSS-Variablen und Media-Queries

**🔗 Integration:**
- Verknüpft mit MYDISPATCH_CORPORATE_GOVERNANCE_V19.0.0.md
- Erweitert KERNFARBEN aus `src/lib/design-system/pricing-colors.ts`
- Bindend für alle UI-Entwicklungen

---

**END OF DOCUMENT**

**ANWENDUNG:**
Diese Governance ist ab sofort bindend für alle UI-Entwicklungen. Alle neuen Komponenten MÜSSEN Design-Tokens verwenden. Bestehende Komponenten werden schrittweise migriert.
