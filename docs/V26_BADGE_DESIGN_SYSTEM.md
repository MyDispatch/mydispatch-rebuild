# V26 BADGE DESIGN SYSTEM - CI-KONFORME BADGE-VARIANTEN

**Status:** ✅ AKTIV - SYSTEMWEITE VORGABE V2.0  
**Datum:** 15.01.2025  
**Version:** 2.0 (Update: Farbschema angepasst)

---

## 🎯 GRUNDPRINZIP

Badges sind **statische UI-Elemente** zur Hervorhebung von Informationen (Rabatte, Status, Premium-Features).

**NIEMALS:**

- Conditional Logic basierend auf Parent-State
- Dynamische Farb-Switches
- `animate-pulse` (wirkt unprofessionell)

**IMMER:**

- Feste Varianten über Props steuern
- UNIFIED_DESIGN_TOKENS verwenden
- 3D-Shadow-Effekt für Premium-Look

---

## 🎨 DEFINIERTE VARIANTEN

### Variante 1: Beige Background + Blaue Schrift (Premium/Rabatt)

**Anwendung:**

- Rabatte ("-20%", "Spare 50€")
- Premium-Kennzeichnung ("Empfohlen", "Beliebt")
- Highlights auf Call-to-Actions

**Styling:**

```typescript
style={{
  backgroundColor: UNIFIED_DESIGN_TOKENS.colors.beige,      // hsl(42, 49%, 78%)
  color: UNIFIED_DESIGN_TOKENS.colors.dunkelblau,           // hsl(225, 31%, 28%)
  border: '3px solid',
  borderColor: UNIFIED_DESIGN_TOKENS.colors.beige,          // Beige Border (auf weißem BG sichtbar)
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
}}
```

**Visuelle Eigenschaften:**

- 🎨 Beige Background (#EADEBD / hsl(42, 49%, 78%))
- 🔵 Blaue Schrift (#323D5E / hsl(225, 31%, 28%))
- 🎨 Beige 3px Border (auch auf weißem Hintergrund erkennbar)
- ✨ Schwarzer Drop-Shadow + Inset-Glow für Tiefe

---

### Variante 2: Blaue Background + Beige Schrift (Standard/Info)

**Anwendung:**

- Status-Informationen ("Neu", "Beta", "Coming Soon")
- Informative Labels
- Sekundäre Badges

**Styling:**

```typescript
style={{
  backgroundColor: UNIFIED_DESIGN_TOKENS.colors.dunkelblau,  // hsl(225, 31%, 28%)
  color: UNIFIED_DESIGN_TOKENS.colors.beige,                 // hsl(42, 49%, 78%)
  border: '3px solid',
  borderColor: UNIFIED_DESIGN_TOKENS.colors.dunkelblau,      // Dunkelblau Border (auf weißem BG sichtbar)
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
}}
```

**Visuelle Eigenschaften:**

- 🔵 Blauer Background (#323D5E / hsl(225, 31%, 28%))
- 🎨 Beige Schrift (#EADEBD / hsl(42, 49%, 78%))
- 🔵 Dunkelblau 3px Border (auch auf weißem Hintergrund erkennbar)
- ✨ Schwarzer Drop-Shadow + Inset-Glow für Tiefe

---

## 📋 IMPLEMENTATION GUIDELINES

### ✅ RICHTIG

**1. Statisches Badge mit Variante 1 (Beige/Blau):**

```tsx
<Badge
  className="px-2.5 py-0.5 text-xs font-bold rounded-full"
  style={{
    backgroundColor: UNIFIED_DESIGN_TOKENS.colors.beige,
    color: UNIFIED_DESIGN_TOKENS.colors.dunkelblau,
    border: "3px solid",
    borderColor: UNIFIED_DESIGN_TOKENS.colors.weiss,
    boxShadow:
      "0 4px 16px rgba(255, 255, 255, 0.5), 0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.3)",
  }}
>
  -20%
</Badge>
```

**2. Statisches Badge mit Variante 2 (Blau/Beige):**

```tsx
<Badge
  className="px-2.5 py-0.5 text-xs font-bold rounded-full"
  style={{
    backgroundColor: UNIFIED_DESIGN_TOKENS.colors.dunkelblau,
    color: UNIFIED_DESIGN_TOKENS.colors.beige,
    border: "3px solid",
    borderColor: UNIFIED_DESIGN_TOKENS.colors.weiss,
    boxShadow:
      "0 4px 16px rgba(255, 255, 255, 0.5), 0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.3)",
  }}
>
  Neu
</Badge>
```

### ❌ FALSCH

**1. Conditional Logic im Badge-Style:**

```tsx
// ❌ FALSCH - Badge-Farbe abhängig vom Parent-State
<Badge
  style={{
    backgroundColor: isActive ? UNIFIED_DESIGN_TOKENS.colors.beige : "rgba(234, 222, 189, 0.3)", // ❌ Dynamischer Switch!
  }}
>
  -20%
</Badge>
```

**2. Fehlender 3px Border:**

```tsx
// ❌ FALSCH - Kein 3D-Effekt
<Badge
  style={{
    backgroundColor: UNIFIED_DESIGN_TOKENS.colors.beige,
    color: UNIFIED_DESIGN_TOKENS.colors.dunkelblau,
    // ❌ border fehlt!
  }}
>
  -20%
</Badge>
```

**3. Hex-Farben statt Token:**

```tsx
// ❌ FALSCH - Hex statt HSL-Token
<Badge
  style={{
    backgroundColor: "#EADEBD", // ❌ Hex!
    color: "#323D5E", // ❌ Hex!
  }}
>
  -20%
</Badge>
```

---

## 🔧 VERWENDETE KOMPONENTEN

### Betroffene Dateien:

- `src/components/design-system/V26BillingToggle.tsx` - Rabatt-Badge "-20%"
- `src/components/pricing/V26PricingCard.tsx` - "Empfohlen"-Badge
- `src/components/ui/badge.tsx` - shadcn/ui Base-Badge

### Token-System:

- `src/lib/design-system/unified-design-tokens.ts` (Primary)
- Alle Farben sind **HSL-Werte**

---

## 📊 FARB-REFERENZ

| Farbe      | Hex     | HSL                | Verwendung                                        |
| ---------- | ------- | ------------------ | ------------------------------------------------- |
| Dunkelblau | #323D5E | hsl(225, 31%, 28%) | CI-Primärfarbe (Variante 2 BG, Variante 1 Text)   |
| Beige      | #EADEBD | hsl(42, 49%, 78%)  | CI-Sekundärfarbe (Variante 1 BG, Variante 2 Text) |
| Weiß       | #FFFFFF | hsl(0, 0%, 100%)   | Border (3D-Effekt)                                |

---

## 🎓 BEST PRACTICES

### 1. Wann welche Variante?

**Variante 1 (Beige/Blau):**

- ✅ Wenn Badge **maximale Aufmerksamkeit** benötigt (Rabatte)
- ✅ Auf dunklen Hintergründen (Dunkelblau-Buttons)
- ✅ Für Premium-/Empfohlene-Kennzeichnung

**Variante 2 (Blau/Beige):**

- ✅ Informative Labels auf hellen Hintergründen
- ✅ Sekundäre Badges (weniger auffällig)
- ✅ Status-Badges ("Beta", "Neu")

### 2. Border ist Pflicht

Der 3px Border ist **nicht optional** und muss in der Hintergrundfarbe des Badges sein:

- Erzeugt visuellen 3D-Tiefeneffekt
- Hebt Badge vom weißen Hintergrund ab (Variante 1 = Beige Border, Variante 2 = Dunkelblau Border)
- CI-Standard für Premium-Look
- **KRITISCH:** Border muss in Badge-Farbe sein (nicht weiß), damit er auf weißem Hintergrund sichtbar ist

### 3. Shadow-Struktur verstehen

```css
/* Optimierter Shadow-Stack (ohne weißen Glow für bessere Sichtbarkeit): */
boxshadow: "0 8px 24px rgba(0, 0, 0, 0.15),         /* Schwarzer Drop-Shadow für Tiefe */
   inset 0 1px 2px rgba(255, 255, 255, 0.2)"; /* Inset-Glow (subtiler 3D-Effekt) */
```

Diese Shadow-Kombination sorgt für einen professionellen 3D-Effekt ohne störende weiße Highlights.

---

## 🚨 HÄUFIGE FEHLER & LÖSUNGEN

### Problem 1: Badge zeigt falsche Farbe

**Ursache:** Conditional Logic im Style  
**Lösung:** Siehe `docs/SOLUTION_DATABASE.md` → `BADGE-COLOR-CONDITIONAL-001`

### Problem 2: Änderungen werden nicht angezeigt

**Ursache:** Build-Cache  
**Lösung:** Siehe `docs/SOLUTION_DATABASE.md` → `BUILD-CACHE-TOKEN-003`

### Problem 3: Hex statt HSL

**Ursache:** Token-System-Konflikt  
**Lösung:** Siehe `docs/SOLUTION_DATABASE.md` → `COLOR-SYSTEM-HEX-002`

---

## 🔗 SIEHE AUCH

- `docs/SOLUTION_DATABASE.md` - Alle Badge-Lösungen
- `docs/V26_ICON_BADGE_GUIDELINES.md` - Icon-System & zusätzliche Badge-Infos
- `src/lib/design-system/unified-design-tokens.ts` - Token-Definitionen

---

**NIEMALS DIESE VORGABEN ÄNDERN OHNE PROJEKTLEITER-GENEHMIGUNG!**

**Letzte Aktualisierung:** 15.01.2025 (V2.0 - Farbschema Update)  
**Maintainer:** NeXify AI Agent
