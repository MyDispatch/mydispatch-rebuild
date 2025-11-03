# MyDispatch Icon-Farben Guidelines (SYSTEMWEIT)

**Status:** ✅ FINAL - NIEMALS ÄNDERN!  
**Datum:** 14.10.2025  
**Version:** 1.0  

---

## 🎨 ABSOLUTE REGEL: CI-KONFORME ICON-FARBEN

### ✅ ERLAUBTE FARBEN (AUSSCHLIESSLICH!)

1. **text-foreground** (Standard CI-Farbe)
   - Primäre Icon-Farbe für Check, X, und andere Lucide-Icons
   - HSL: `225 31% 28%` (#323D5E - Dunkelgrau/Blau)
   - Verwendung: Alle Standard-Icons systemweit

2. **text-muted-foreground** (Sekundäre CI-Farbe)
   - Für deaktivierte/nicht verfügbare Features
   - HSL: Abgeleitet von `--muted-foreground`
   - Verwendung: Negative Indikatoren (X-Icons für "nicht verfügbar")

3. **text-accent** (Akzent-Farbe)
   - Für besondere Hervorhebungen
   - HSL: `31 26% 38%` (#856d4b - Braun/Gold)
   - Verwendung: Nur für spezielle Call-to-Actions

---

## ❌ VERBOTENE FARBEN

### NIEMALS VERWENDEN:
- ❌ `text-status-success` (Nur für StatusIndicator-Badges!)
- ❌ `text-status-warning` (Nur für StatusIndicator-Badges!)
- ❌ `text-status-error` (Nur für StatusIndicator-Badges!)
- ❌ `text-green-*` (Keine Tailwind-Default-Farben!)
- ❌ `text-red-*` (Keine Tailwind-Default-Farben!)
- ❌ `text-yellow-*` (Keine Tailwind-Default-Farben!)
- ❌ Jede andere Nicht-CI-Farbe

---

## 📋 IMPLEMENTIERUNGSREGELN

### Standard-Icons (Check, X, etc.)
```tsx
// ✅ KORREKT - CI-konform
<Check className="h-4 w-4 text-foreground" />
<X className="h-4 w-4 text-muted-foreground" />

// ❌ FALSCH - Ampelfarben verboten!
<Check className="h-4 w-4 text-status-success" />
<X className="h-4 w-4 text-status-error" />
```

### Status-Badges (Ampel-System)
```tsx
// ✅ KORREKT - Nur für StatusIndicator-Component!
<StatusIndicator type="success" label="Aktiv" />
<StatusIndicator type="error" label="Fehler" />

// ❌ FALSCH - Niemals direkt auf Icons!
<Badge className="text-status-success">Aktiv</Badge>
```

---

## 🎯 SPEZIALFALL: AMPEL-SYSTEM

Das **Ampel-System** (Rot/Gelb/Grün) ist **AUSSCHLIESSLICH** für `StatusIndicator.tsx` reserviert:

```tsx
// EINZIG ERLAUBTE VERWENDUNG VON AMPELFARBEN
<StatusIndicator 
  type="success"  // Grün: hsl(142 76% 36%)
  label="Aktiv" 
/>
```

**Grund:** Ampelfarben dienen zur **Status-Anzeige**, NICHT zur Icon-Darstellung!

---

## 📦 FLEET & DRIVER ADD-ON (KRITISCH!)

### ✅ KORREKTE DEFINITION
```tsx
const FLEET_ADDON = {
  name: 'Fleet & Driver Erweiterung',
  price: 9,  // PAUSCHAL, NICHT PRO EINHEIT!
  priceId: 'price_1SDSo1LX5M8TT990Az2dOJgv',
  productId: 'prod_T9mMIE0Vq22m74',
  description: 'Unbegrenzte Fahrzeuge und Fahrer für 9€/Monat pauschal',
};
```

### 📌 WICHTIGE REGEL
- **9€/Monat pauschal** = Unbegrenzte Fahrzeuge & Fahrer
- **NICHT** 9€ pro Fahrzeug oder Fahrer!
- **KEINE** Mengen-Eingabe nötig (nur Checkbox: Ja/Nein)

---

## 🔍 DATEIEN MIT ICON-VERWENDUNG

### Geprüfte & Korrigierte Dateien (14.10.2025 - UPDATE 16:45 Uhr)
✅ `src/pages/Auth.tsx` - Check/X Icons → text-foreground | State-Fix (addonEnabled)  
✅ `src/pages/Pricing.tsx` - Alle Icons → text-foreground | Kommentar korrigiert (pauschal)  
✅ `src/pages/Angebote.tsx` - Action-Buttons → text-foreground  
✅ `src/pages/Einstellungen.tsx` - Feature-Liste → text-foreground  
✅ `src/pages/Kostenstellen.tsx` - Status-Text → text-foreground  
✅ `src/pages/Schichtzettel.tsx` - Approve-Button Icon → text-foreground  
✅ `src/pages/Statistiken.tsx` - Trend-Text → text-foreground

### Nicht-betroffen (Ampel-System korrekt)
✅ `src/components/shared/StatusIndicator.tsx` - Ampelfarben bleiben!

---

## ⚠️ WARTUNG & UPDATES

Bei **JEDEM** neuen Feature mit Icons:
1. ✅ Icons MÜSSEN `text-foreground` oder `text-muted-foreground` verwenden
2. ✅ Ampelfarben NUR für `StatusIndicator`-Component
3. ✅ Fleet & Driver Add-On = 9€ pauschal (NICHT pro Einheit)
4. ✅ Dokumentation in dieser Datei aktualisieren

---

## 📞 FEHLERPRÄVENTION

Falls Icons in **Nicht-CI-Farben** gefunden werden:

```bash
# Suche nach verbotenen Farben
grep -r "text-status-success" src/pages/*.tsx
grep -r "text-status-error" src/pages/*.tsx
grep -r "text-status-warning" src/pages/*.tsx
```

**Sofort korrigieren auf:**
- `text-foreground` (Standard)
- `text-muted-foreground` (Deaktiviert)

---

**NIEMALS DIESE VORGABEN ÄNDERN OHNE PROJEKTLEITER-GENEHMIGUNG!**
