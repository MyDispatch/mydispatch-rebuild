# V26 BUTTON DESIGN SYSTEM - BADGE-KONFORMES FARBSCHEMA

**Status:** ✅ AKTIV - SYSTEMWEITE VORGABE V1.0  
**Datum:** 2025-01-15  
**Version:** 1.0 (Badge-Konformität + Spacing-Standards)

---

## 🎯 GRUNDPRINZIP

Buttons übernehmen das **exakt gleiche Farbschema wie Badges** (siehe `docs/V26_BADGE_DESIGN_SYSTEM.md`) für maximale visuelle Konsistenz.

**KERNREGEL:**

- **Primary Button = Badge Variante 1**: Beige Background + Blaue Schrift
- **Secondary Button = Badge Variante 2**: Blauer Background + Beige Schrift

---

## 🎨 BUTTON-VARIANTEN (BADGE-KONFORM)

### Variante 1: Primary Button (Beige BG + Blaue Schrift)

**Anwendung:**

- Haupt-Call-to-Actions (z.B. "Jetzt starten", "Tarif wählen")
- Wichtigste Aktion auf einer Seite
- Maximale Aufmerksamkeit erforderlich

**Styling:**

```typescript
style={{
  backgroundColor: UNIFIED_DESIGN_TOKENS.colors.beige,      // hsl(42, 49%, 78%)
  color: UNIFIED_DESIGN_TOKENS.colors.dunkelblau,           // hsl(225, 31%, 28%)
  border: '2px solid',
  borderColor: UNIFIED_DESIGN_TOKENS.colors.beige,
  height: '48px',                                            // Touch-Target: 48px (h-12)
  padding: '0 24px',                                         // px-6
  borderRadius: '9999px',                                    // rounded-full
}}
```

**Hover-Effekt:**

```typescript
hover: {
  transform: 'scale(1.05)',
  boxShadow: '0 8px 24px rgba(50, 61, 94, 0.16), 0 2px 8px rgba(234, 222, 189, 0.12)',
}
```

---

### Variante 2: Secondary Button (Blauer BG + Beige Schrift)

**Anwendung:**

- Sekundäre Aktionen (z.B. "Mehr erfahren", "Dokumentation")
- Alternativen zur Haupt-Aktion
- Informative CTAs

**Styling:**

```typescript
style={{
  backgroundColor: UNIFIED_DESIGN_TOKENS.colors.dunkelblau,  // hsl(225, 31%, 28%)
  color: UNIFIED_DESIGN_TOKENS.colors.beige,                 // hsl(42, 49%, 78%)
  border: '2px solid',
  borderColor: UNIFIED_DESIGN_TOKENS.colors.dunkelblau,
  height: '48px',                                             // Touch-Target: 48px (h-12)
  padding: '0 24px',                                          // px-6
  borderRadius: '9999px',                                     // rounded-full
}}
```

**Hover-Effekt:**

```typescript
hover: {
  transform: 'scale(1.05)',
  boxShadow: '0 0 30px rgba(234, 222, 189, 0.2)',           // Beige Glow
}
```

---

## 📏 SPACING & SIZING STANDARDS (WCAG KONFORM)

### Touch-Target-Größen (Accessibility)

**KRITISCH:** Alle interaktiven Elemente MÜSSEN minimum **44x44px** sein (WCAG 2.1 AA - Target Size).

| Kontext                | Höhe | Tailwind-Klasse | Anwendung                                     |
| ---------------------- | ---- | --------------- | --------------------------------------------- |
| **Standard Button**    | 48px | `h-12`          | Standard-Buttons in Formularen, Cards, Listen |
| **Hero Button**        | 56px | `h-14`          | Haupt-CTAs auf Hero-Sections, Landingpages    |
| **Sidebar Navigation** | 44px | `h-11`          | Sidebar-Links (Touch-Minimum)                 |
| **Icon Button**        | 40px | `h-10 w-10`     | Icon-only Buttons (z.B. Menu, Close)          |
| **Small Button**       | 36px | `h-9`           | Inline-Aktionen in dichter UI (nur Desktop)   |

---

### Padding-Standards (Horizontal)

| Größe        | Padding | Tailwind-Klasse | Verwendung                   |
| ------------ | ------- | --------------- | ---------------------------- |
| **Standard** | 24px    | `px-6`          | Standard-Buttons mit Text    |
| **Large**    | 32px    | `px-8`          | Hero-Buttons, wichtige CTAs  |
| **Compact**  | 16px    | `px-4`          | Kompakte Buttons in enger UI |
| **Small**    | 12px    | `px-3`          | Sidebar, Dense Lists         |

---

### Spacing zwischen Buttons (Gap)

| Kontext                        | Gap  | Tailwind-Klasse |
| ------------------------------ | ---- | --------------- |
| **Button-Gruppe (horizontal)** | 16px | `gap-4`         |
| **Button-Stack (vertikal)**    | 12px | `gap-3`         |
| **Hero-CTAs**                  | 16px | `gap-4`         |
| **Form-Buttons**               | 12px | `gap-3`         |

---

## 🔧 KOMPONENTEN-REFERENZ

### Betroffene Button-Komponenten

| Datei                                              | Varianten                       | Status                   |
| -------------------------------------------------- | ------------------------------- | ------------------------ |
| `src/components/design-system/V26Button.tsx`       | primary, secondary              | ✅ Badge-Konform         |
| `src/components/design-system/V26HeroButton.tsx`   | primary, secondary              | ✅ Badge-Konform         |
| `src/components/design-system/V26ActionButton.tsx` | primary, secondary, outline     | ✅ Badge-Konform         |
| `src/components/ui/button.tsx`                     | default, outline, ghost, etc.   | ⚠️ Legacy (zu migrieren) |
| `src/components/design-system/MarketingButton.tsx` | hero-primary, cta-primary, etc. | ⚠️ Legacy (zu migrieren) |

---

## 📋 IMPLEMENTATION GUIDELINES

### ✅ RICHTIG - Primary Button (Beige/Blau)

```tsx
import { V26Button } from "@/components/design-system/V26Button";

<V26Button variant="primary" onClick={handleAction}>
  Jetzt starten
</V26Button>;
```

**Rendering:**

- Beige Background (#EADEBD)
- Blaue Schrift (#323D5E)
- 2px Beige Border
- 48px Höhe (h-12)
- 24px Horizontal Padding (px-6)

---

### ✅ RICHTIG - Secondary Button (Blau/Beige)

```tsx
<V26Button variant="secondary" onClick={handleAction}>
  Mehr erfahren
</V26Button>
```

**Rendering:**

- Blauer Background (#323D5E)
- Beige Schrift (#EADEBD)
- 2px Blauer Border
- 48px Höhe (h-12)
- 24px Horizontal Padding (px-6)

---

### ❌ FALSCH - Hex-Farben statt Token

```tsx
// ❌ NIEMALS Hex-Farben verwenden!
<button
  style={{
    backgroundColor: "#EADEBD", // ❌ Hex!
    color: "#323D5E", // ❌ Hex!
  }}
>
  Button
</button>
```

**Problem:** Keine Token-Konsistenz, keine zentrale Wartbarkeit.

---

### ❌ FALSCH - Zu kleine Touch-Targets

```tsx
// ❌ 32px Höhe = WCAG-Verstoß!
<button className="h-8 px-3">Action</button>
```

**Problem:** Unter 44x44px Touch-Target (Accessibility-Verstoß).

---

## 🎓 BEST PRACTICES

### 1. Wann welche Variante?

**Primary Button (Beige/Blau):**

- ✅ Hauptaktion auf einer Seite
- ✅ Conversion-orientierte CTAs ("Kaufen", "Registrieren", "Starten")
- ✅ Wenn maximale Aufmerksamkeit benötigt wird

**Secondary Button (Blau/Beige):**

- ✅ Alternative Aktionen ("Abbrechen", "Zurück", "Mehr erfahren")
- ✅ Navigations-Buttons
- ✅ Informative CTAs

---

### 2. Border ist Pflicht

Der **2px Border** ist nicht optional:

- Hebt Button vom Hintergrund ab
- Erzeugt visuellen Tiefeneffekt
- CI-Standard für professionellen Look

---

### 3. Touch-Target-Hierarchie

**Immer größere Targets für wichtigere Aktionen:**

```
Hero-CTA (56px)  >  Standard (48px)  >  Navigation (44px)  >  Icon (40px)
```

**Regel:** Je wichtiger die Aktion, desto größer der Button.

---

### 4. Spacing-Konsistenz

**NIEMALS** willkürliche Pixel-Werte verwenden:

```tsx
// ❌ FALSCH
<div style={{ padding: '13px 19px' }}>

// ✅ RICHTIG
<div className="px-6 py-3"> {/* 24px / 12px */}
```

**Nutze ausschließlich:** 8px-Grid (4, 8, 12, 16, 24, 32, 48, 64)

---

## 🚨 HÄUFIGE FEHLER & LÖSUNGEN

### Problem 1: Button zeigt falsche Farbe

**Ursache:** Conditional Logic im Style  
**Lösung:** Nutze feste Varianten (`primary` / `secondary`) über Props

---

### Problem 2: Button zu klein auf Mobile

**Ursache:** Touch-Target unter 44px  
**Lösung:** Minimum `h-11` (44px) für alle interaktiven Elemente

---

### Problem 3: Inkonsistente Abstände

**Ursache:** Willkürliche px-Werte  
**Lösung:** Nutze 8px-Grid und Tailwind-Spacing (`gap-3`, `gap-4`, `px-6`)

---

## 📊 FARB-REFERENZ (UNIFIED_DESIGN_TOKENS)

| Farbe      | Hex     | HSL                | Verwendung                 |
| ---------- | ------- | ------------------ | -------------------------- |
| Dunkelblau | #323D5E | hsl(225, 31%, 28%) | Secondary BG, Primary Text |
| Beige      | #EADEBD | hsl(42, 49%, 78%)  | Primary BG, Secondary Text |
| Weiß       | #FFFFFF | hsl(0, 0%, 100%)   | Border (3D-Effekt)         |

---

## 🔗 SIEHE AUCH

- `docs/V26_BADGE_DESIGN_SYSTEM.md` - Badge-Farbschema (Referenz)
- `docs/SOLUTION_DATABASE.md` - Alle Button-Lösungen
- `src/lib/design-system/unified-design-tokens.ts` - Token-Definitionen
- `docs/PRICING_DESIGN_SYSTEM_V26.0.md` - Button-Standards im Marketing-Kontext

---

**NIEMALS DIESE VORGABEN ÄNDERN OHNE PROJEKTLEITER-GENEHMIGUNG!**

**Letzte Aktualisierung:** 2025-01-15 (V1.0 - Badge-Konformität + Spacing)  
**Maintainer:** NeXify AI Agent
