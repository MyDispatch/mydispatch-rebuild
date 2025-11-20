# V26 ICON & BADGE BORDER GUIDELINES

**HINWEIS:** Für vollständige Badge-Design-Vorgaben siehe: `docs/V26_BADGE_DESIGN_SYSTEM.md`

**Status:** ✅ FINAL - SYSTEMWEITE VORGABE  
**Datum:** 26.10.2025  
**Version:** 1.0  

---

## 🎯 ABSOLUTE REGEL: 2PX UMRANDUNG FÜR ALLE ICONS UND BADGES

### ✅ SYSTEMWEITE VORGABE

Alle Icons (in IconBox) und Badges im MyDispatch-System MÜSSEN eine **2px Umrandung** haben:

---

## 📦 V26IconBox (LIBRARY-KOMPONENTE) - BADGE-KONFORM

**Datei:** `src/components/design-system/V26IconBox.tsx`

### Varianten (Badge-Konform)

**Variante 1: Primary (Blauer BG + Beiges Icon)**
```tsx
<V26IconBox icon={Truck} size="lg" variant="primary" />

// Standard für Feature-Icons, Hauptelemente
style={{
  backgroundColor: UNIFIED_DESIGN_TOKENS.colors.dunkelblau,
  color: UNIFIED_DESIGN_TOKENS.colors.beige,
  border: '2px solid',
  borderColor: UNIFIED_DESIGN_TOKENS.colors.dunkelblau,
}}
```

**Variante 2: Secondary (Beiger BG + Blaues Icon)**
```tsx
<V26IconBox icon={Check} size="md" variant="secondary" />

// Alternative für spezielle Hervorhebungen
style={{
  backgroundColor: UNIFIED_DESIGN_TOKENS.colors.beige,
  color: UNIFIED_DESIGN_TOKENS.colors.dunkelblau,
  border: '2px solid',
  borderColor: UNIFIED_DESIGN_TOKENS.colors.beige,
}}
```

### Größen
- `sm`: 40x40px (Icon: 20x20px)
- `md`: 48x48px (Icon: 24x24px)
- `lg`: 64x64px (Icon: 32x32px)

---

## 🏷️ V26Badge (LIBRARY-KOMPONENTE)

**AKTUALISIERT:** Siehe `docs/V26_BADGE_DESIGN_SYSTEM.md` für vollständige Badge-Vorgaben.

**Datei:** `src/components/design-system/V26Badge.tsx`

### Styling (Neue V26.0 Vorgabe - V2.0 Update)
```tsx
<V26Badge>Info</V26Badge>

// Implementierung in V26Badge.tsx (Variante 1 - Premium):
style={{
  backgroundColor: UNIFIED_DESIGN_TOKENS.colors.beige,
  color: UNIFIED_DESIGN_TOKENS.colors.dunkelblau,
  border: '3px solid',
  borderColor: UNIFIED_DESIGN_TOKENS.colors.weiss,
  boxShadow: '0 4px 16px rgba(255, 255, 255, 0.5), 0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
}}
```

### Neue Badge-Regeln (V26.0 - V2.0 Update)
- **Border:** 3px solid white (Pflicht)
- **Zwei Varianten:**
  - **Variante 1:** Beige BG + Blaue Schrift (Premium/Rabatt)
  - **Variante 2:** Blaue BG + Beige Schrift (Standard/Info)
- **3D-Shadow:** Pflicht für alle Badges
- **KEIN animate-pulse**

---

## ❌ VERBOTEN

### NIEMALS VERWENDEN:
- ❌ 1px Umrandung (zu dünn, nicht sichtbar genug)
- ❌ Keine Umrandung bei IconBox oder Badge
- ❌ Uneinheitliche Border-Breiten
- ❌ Custom Icons/Badges ohne V26-Komponenten
- ❌ Direkte Verwendung von `<Badge>` statt `<V26Badge>`

---

## 🔍 BETROFFENE KOMPONENTEN

### Library-Komponenten (26.10.2025)
✅ `src/components/design-system/V26IconBox.tsx` - 2px Border auf allen Größen  
✅ `src/components/design-system/V26Badge.tsx` - 2px Border systemweit  

### Verwendung in Seiten
✅ `src/pages/Home.tsx` - V26IconBox & V26Badge mit 2px Border  
✅ `src/pages/Pricing.tsx` - V26IconBox & V26Badge mit 2px Border  

---

## ⚠️ WARTUNG & UPDATES

Bei **JEDEM** neuen Icon oder Badge:
1. ✅ Verwende ausschließlich V26IconBox oder V26Badge
2. ✅ Niemals custom Icons/Badges ohne 2px Border erstellen
3. ✅ Prüfe visuelle Konsistenz
4. ✅ Dokumentation aktualisieren

---

## 📞 FEHLERPRÄVENTION

Falls Icons/Badges ohne 2px Border gefunden werden:

```bash
# Suche nach Icons/Badges mit 1px oder ohne Border
grep -r "IconBox.*borderWidth.*1px" src/**/*.tsx
grep -r "Badge.*border.*none" src/**/*.tsx
```

**Sofort korrigieren auf:**
- `border: '2px solid'`
- `borderColor: KERNFARBEN.dunkelblau`

---

## 🔗 SIEHE AUCH

- **`docs/V26_BADGE_DESIGN_SYSTEM.md`** - NEUE systemweite Badge-Vorgaben (Pflichtlektüre!)
- `docs/LAYOUT_SPACING_GUIDELINES.md` - Footer-Spacing und Layout-Regeln
- `docs/V26_COMPONENT_LIBRARY.md` - Vollständige Komponenten-Dokumentation

---

**NIEMALS DIESE VORGABEN ÄNDERN OHNE PROJEKTLEITER-GENEHMIGUNG!**
