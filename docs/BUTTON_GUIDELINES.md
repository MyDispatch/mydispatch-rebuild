# MyDispatch Button-Richtlinien (SYSTEMWEIT)

**Status:** ✅ FINAL - NIEMALS ÄNDERN!  
**Datum:** 26.10.2025  
**Version:** 1.0

---

## 🎯 ABSOLUTE REGEL: 2PX UMRANDUNG FÜR ALLE BUTTONS

### ✅ SYSTEMWEITE VORGABE

Alle Buttons im MyDispatch-System MÜSSEN eine **2px Umrandung** haben:

1. **Primary Buttons (V26Button)**
   - Hintergrund: Dunkelblau (#323D5E)
   - Text: Beige (#EADEBD)
   - **Border: 2px solid Dunkelblau (#323D5E)**

2. **Secondary Buttons (V26Button)**
   - Hintergrund: Weiß (#FFFFFF)
   - Text: Dunkelblau (#323D5E)
   - **Border: 2px solid Dunkelblau (#323D5E)**

3. **Hero Buttons (V26HeroButton)**
   - Primary: Beige Hintergrund, weiße 2px Border
   - Secondary: Transparenter Hintergrund, weiße 2px Border

---

## 📋 IMPLEMENTIERUNGSREGELN

### V26Button (Standard)

```tsx
// ✅ KORREKT - 2px Umrandung
<V26Button variant="primary">Speichern</V26Button>
<V26Button variant="secondary">Abbrechen</V26Button>

// Implementierung in V26Button.tsx:
borderWidth: '2px',
borderStyle: 'solid',
borderColor: KERNFARBEN.dunkelblau
```

### V26HeroButton (Landing Pages)

```tsx
// ✅ KORREKT - 2px weiße Umrandung
<V26HeroButton variant="primary" icon={BadgeCheck}>
  Jetzt starten
</V26HeroButton>

<V26HeroButton variant="secondary" icon={Download}>
  App installieren
</V26HeroButton>

// Implementierung in V26HeroButton.tsx:
borderWidth: '2px',
borderStyle: 'solid',
borderColor: KERNFARBEN.weiss
```

---

## ❌ VERBOTEN

### NIEMALS VERWENDEN:

- ❌ 1px Umrandung (zu dünn, nicht sichtbar genug)
- ❌ Keine Umrandung bei outline-Buttons
- ❌ Uneinheitliche Border-Breiten
- ❌ Custom-Buttons ohne V26-Komponenten

---

## 🔍 BETROFFENE KOMPONENTEN

### Library-Komponenten (26.10.2025)

✅ `src/components/design-system/V26Button.tsx` - 2px Border auf primary & secondary  
✅ `src/components/design-system/V26HeroButton.tsx` - 2px Border auf beiden Varianten

### Verwendung in Seiten

✅ `src/pages/Home.tsx` - V26HeroButton mit 2px Border  
✅ `src/pages/Pricing.tsx` - V26Button mit 2px Border  
✅ `src/pages/Auth.tsx` - V26Button mit 2px Border

---

## ⚠️ WARTUNG & UPDATES

Bei **JEDEM** neuen Button:

1. ✅ Verwende ausschließlich V26Button oder V26HeroButton
2. ✅ Niemals custom Buttons ohne 2px Border erstellen
3. ✅ Prüfe visuelle Konsistenz
4. ✅ Dokumentation aktualisieren

---

## 📞 FEHLERPRÄVENTION

Falls Buttons ohne 2px Border gefunden werden:

```bash
# Suche nach Buttons mit 1px oder ohne Border
grep -r "borderWidth.*1px" src/components/**/*.tsx
grep -r "border.*none" src/components/**/Button*.tsx
```

**Sofort korrigieren auf:**

- `borderWidth: '2px'`
- `borderStyle: 'solid'`
- Korrekten KERNFARBEN verwenden

---

---

## 🏷️ SIEHE AUCH

- `docs/V26_ICON_BADGE_GUIDELINES.md` - Für Icons und Badges (ebenfalls 2px Border)

---

**NIEMALS DIESE VORGABEN ÄNDERN OHNE PROJEKTLEITER-GENEHMIGUNG!**
