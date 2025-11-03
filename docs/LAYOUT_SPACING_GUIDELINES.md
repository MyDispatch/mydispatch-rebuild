# LAYOUT SPACING GUIDELINES - SYSTEMWEITE VORGABEN

**Status:** ✅ FINAL - NIEMALS ÄNDERN!  
**Datum:** 26.10.2025  
**Version:** 1.0  

---

## 🎯 ABSOLUTE REGEL: KEINE LÜCKE ZWISCHEN SEITENENDE UND FOOTER

### ✅ SYSTEMWEITE VORGABE

Der Footer MUSS nahtlos an das Seitenende anschließen - KEINE weiße Lücke zwischen Content und Footer!

---

## 📐 LAYOUT-STRUKTUR

### MarketingLayout (src/components/layout/MarketingLayout.tsx)

```tsx
<main className={cn(
  "min-h-screen overflow-x-hidden",
  isMobile ? "pt-14 pb-0" : "pt-16 pb-0"  // ✅ pb-0 - KEIN Bottom-Padding!
)}>
  {children}
</main>
```

**WICHTIG:**
- `pb-0` auf allen Breakpoints
- ❌ NIEMALS `pb-16`, `pb-20` oder ähnliches verwenden
- Footer ist `fixed bottom-0` und darf KEINE Lücke zum Content haben

---

## 📋 SECTION-SPACING

### Letzte Section einer Seite

Die letzte Section jeder Seite MUSS mit `pb-0` oder entsprechendem negativen Margin enden:

```tsx
// ✅ RICHTIG - Letzte Section
<section className="py-20 md:py-24" style={{ backgroundColor: KERNFARBEN.canvas }}>
  {/* Content */}
</section>
// Footer schließt direkt an
```

```tsx
// ❌ FALSCH - Zusätzliches Padding/Margin nach letzter Section
<section className="py-20 md:py-24 mb-8">
  {/* Content */}
</section>
// Erzeugt Lücke zum Footer!
```

---

## 🔍 BETROFFENE DATEIEN

### Layout-Komponenten
✅ `src/components/layout/MarketingLayout.tsx` - main mit `pb-0`  
✅ `src/components/layout/AppLayout.tsx` - main mit `pb-0`  

### Seiten (Beispiele)
✅ `src/pages/Home.tsx` - Letzte Section ohne zusätzliches Margin  
✅ `src/pages/Pricing.tsx` - Letzte Section ohne zusätzliches Margin  
✅ `src/pages/Auth.tsx` - Content ohne zusätzliches Bottom-Padding  

---

## ❌ VERBOTEN

### NIEMALS VERWENDEN:
- ❌ `pb-16`, `pb-20` auf `<main>` Elementen
- ❌ `mb-8`, `mb-12` auf der letzten Section einer Seite
- ❌ Zusätzliches `padding-bottom` auf Container-Elementen
- ❌ `min-h-screen` mit zusätzlichem Bottom-Spacing

---

## ⚠️ WARTUNG & UPDATES

Bei **JEDER** neuen Seite oder Layout-Änderung:
1. ✅ Prüfe, ob `<main>` `pb-0` hat
2. ✅ Prüfe, ob die letzte Section kein zusätzliches Bottom-Spacing hat
3. ✅ Teste im Browser: Footer muss nahtlos an Content anschließen
4. ✅ Teste auf allen Breakpoints (Mobile, Tablet, Desktop)

---

## 📞 FEHLERPRÄVENTION

Falls Lücken zwischen Content und Footer gefunden werden:

```bash
# Suche nach problematischem Padding
grep -r "pb-16\\|pb-20\\|pb-24" src/components/layout/*.tsx
grep -r "mb-8\\|mb-12\\|mb-16" src/pages/*.tsx | grep "section"
```

**Sofort korrigieren auf:**
- `<main>`: `pb-0`
- Letzte Section: Kein zusätzliches `mb-*`

---

## 🎨 FOOTER-DESIGN

Der Footer ist `fixed bottom-0` und hat:
- Eigenes internes Padding: `py-xs` (ca. 8px)
- Border-Top: `1px solid border`
- Hintergrund: `background`
- Z-Index: `20`

**Der Content MUSS so gestaltet sein, dass er GENAU bis zum Footer reicht - KEINE Lücke!**

---

---

## 🔗 SIEHE AUCH

- `docs/BUTTON_GUIDELINES.md` - Systemweite Button 2px Border Vorgaben
- `docs/V26_ICON_BADGE_GUIDELINES.md` - Systemweite Icon & Badge 2px Border Vorgaben
- `docs/V26_COMPONENT_LIBRARY.md` - Vollständige Komponenten-Dokumentation

---

**VERSION:** 1.0  
**STATUS:** PRODUCTION-LOCKED  
**ÄNDERUNGEN:** Nur mit Freigabe!
