# V28 HERO DESIGN RULES - VERBINDLICH!

**Erstellt:** 2025-01-30  
**Status:** ✅ MANDATORY - Niemals verletzen!  
**Update V31.5:** Alle Hero-Backgrounds MÜSSEN `backgroundVariant="3d-premium"` verwenden!

> **⚠️ NEU:** Siehe [HERO_BACKGROUND_STANDARD_V31.5.md](./HERO_BACKGROUND_STANDARD_V31.5.md) für Background-Spezifikationen

---

## 🚨 KRITISCHE REGELN

### 1. MAXIMUM 2 BUTTONS PRO HERO

```tsx
// ✅ RICHTIG - 2 Buttons
<V28HeroPremium
  primaryCTA={{ label: 'Jetzt starten', onClick: ... }}
  showPWAButton={true}  // PWA Button = 2. Button
/>

// ❌ FALSCH - 3 Buttons (NIEMALS!)
<V28HeroPremium
  primaryCTA={...}
  secondaryCTA={...}      // ❌ Verboten wenn PWA-Button vorhanden!
  showPWAButton={true}
/>
```

**Begründung:** UX Best Practice - zu viele CTAs verwirren User und reduzieren Conversion.

---

### 2. PWA-BUTTON IST SECONDARY CTA

Der PWA Install Button ersetzt den Secondary CTA-Button:

```tsx
// ✅ RICHTIG
primaryCTA = "Jetzt starten" (bg-slate-700)
showPWAButton = true → "App installieren" (variant="secondary")

// ❌ FALSCH
primaryCTA + secondaryCTA + showPWAButton = 3 Buttons!
```

**Props-Interface:**

```tsx
interface V28HeroPremiumProps {
  primaryCTA: { label: string; onClick: () => void; icon?: LucideIcon };
  secondaryCTA?: { label: string; onClick: () => void }; // Nur OHNE PWA-Button!
  showPWAButton?: boolean; // Ersetzt secondaryCTA
}
```

---

### 3. ICON-BACKGROUND-STANDARD: `bg-slate-50`

**ALLE Icon-Container im Dashboard MÜSSEN `bg-slate-50` verwenden!**

```tsx
// ✅ RICHTIG - Einheitliches Design
<div className="p-1.5 rounded-lg bg-slate-50">
  <FileText className="w-4 h-4 text-slate-700" />
</div>

// ❌ FALSCH - Bunte Backgrounds
<div className="p-1.5 rounded-lg bg-blue-50">   // ❌ Verboten!
  <FileText className="w-4 h-4 text-blue-600" />
</div>

<div className="p-1.5 rounded-lg bg-green-50">  // ❌ Verboten!
  <Euro className="w-4 h-4 text-green-600" />
</div>
```

**Standard für ALLE KPI-Cards:**

- Background: `bg-slate-50`
- Icon-Color: `text-slate-700`
- Border (optional): `ring-1 ring-slate-200`

**Ausnahme:** Status-Badges (Live, Erledigt) dürfen Farben haben (grün/rot/gelb).

---

## 📋 VALIDATION CHECKLISTE

### Hero-Button-Check:

```bash
# ✅ Prüfen: Max 2 Buttons
grep -A 20 "V28HeroPremium" src/pages/*.tsx | grep -E "primaryCTA|secondaryCTA|showPWAButton"

# Expected:
# - primaryCTA immer vorhanden
# - secondaryCTA ODER showPWAButton (nicht beides!)
```

### Icon-Background-Check:

```bash
# ❌ Verbotene Farben finden (Taxi Dashboard)
grep -r "bg-blue-50\|bg-green-50\|bg-red-50\|bg-yellow-50" src/components/hero/V28TaxiDashboardPreview.tsx
# Expected: 0 Treffer! (alle müssen bg-slate-50 sein)

# ❌ Verbotene Farben finden (IT Dashboard)
grep -r "bg-blue-100\|bg-green-100\|bg-red-100\|bg-slate-200" src/components/home/V28ITDashboardPreview.tsx
# Expected: 0 Treffer! (alle müssen bg-slate-50 sein)

# ✅ Korrekte Nutzung prüfen (beide Dashboards)
grep -r "bg-slate-50" src/components/hero/V28TaxiDashboardPreview.tsx src/components/home/V28ITDashboardPreview.tsx
# Expected: 8 Treffer total (4 pro Dashboard)
```

---

## 🎨 DESIGN SYSTEM COMPLIANCE

### Button-Hierarchie:

1. **Primary CTA** (`variant="primary"`): Slate-700 Background, White Text
2. **Secondary CTA** (`variant="secondary"`): Slate-100 Background, Slate-900 Text
3. **PWA Button** (`variant="secondary"`): Wie Secondary CTA, aber mit PWA-Logik

### Icon-Container-Hierarchie:

1. **KPI-Cards:** `bg-slate-50` + `text-slate-700` (Standard)
2. **Status-Badges:** Farben erlaubt (green/red/yellow) nur für Live/Erledigt/Geplant
3. **Navigation-Icons:** `bg-slate-100` + `text-slate-700`

---

## 🚫 ANTI-PATTERNS (NIEMALS TUN!)

### ❌ 3 Buttons im Hero

```tsx
// ❌ FALSCH
<V28HeroPremium
  primaryCTA={...}
  secondaryCTA={...}
  showPWAButton={true}  // 3. Button!
/>
```

### ❌ Bunte Icon-Backgrounds in KPI-Cards

```tsx
// ❌ FALSCH
<div className="p-1.5 rounded-lg bg-blue-50">
<div className="p-1.5 rounded-lg bg-green-50">
<div className="p-1.5 rounded-lg bg-red-50">
```

### ❌ Inkonsistente Icon-Colors

```tsx
// ❌ FALSCH - Verschiedene Farben
<FileText className="w-4 h-4 text-blue-600" />   // Aufträge
<Euro className="w-4 h-4 text-green-600" />      // Umsatz
<Users className="w-4 h-4 text-slate-700" />     // Fahrer

// ✅ RICHTIG - Alle gleich
<FileText className="w-4 h-4 text-slate-700" />
<Euro className="w-4 h-4 text-slate-700" />
<Users className="w-4 h-4 text-slate-700" />
```

---

## 📚 BETROFFENE DATEIEN

### Direkt betroffen:

- `src/components/hero/V28HeroPremium.tsx` (Button-Logik)
- `src/components/hero/V28TaxiDashboardPreview.tsx` (Icon-Backgrounds)
- `src/components/home/V28ITDashboardPreview.tsx` (Icon-Backgrounds) ← NEU 2025-01-30
- `src/pages/Home.tsx` (Hero-Implementation)
- `src/pages/Features.tsx` (Hero-Implementation)
- `src/pages/Demo.tsx` (Hero-Implementation)
- `src/pages/Contact.tsx` (✅ KONFORM - nutzt V28IconBox variant="slate")

### Referenz-Dokumentation:

- `docs/02-ARCHITECTURE/Design-System.md` (V28.1 Slate-Palette)
- `docs/V28_HERO_PREMIUM_COMPONENTS.md` (Component-API)

---

## ✅ SUCCESS CRITERIA

1. ✅ **Max 2 Buttons**: Jeder Hero hat max. 2 Buttons (Primary + PWA ODER Secondary)
2. ✅ **Einheitliche Icon-Backgrounds**: Alle KPI-Cards nutzen `bg-slate-50`
3. ✅ **Einheitliche Icon-Colors**: Alle KPI-Icons nutzen `text-slate-700`
4. ✅ **Keine Bunten Backgrounds**: `bg-blue-50`, `bg-green-50` etc. nur für Status-Badges

---

## 🔄 MIGRATION HISTORIE

**2025-01-30:**

- Initial Rules definiert
- Home.tsx: Secondary CTA entfernt (zugunsten PWA-Button)
- V28TaxiDashboardPreview: Aufträge/Umsatz Icon-BG von blue-50/green-50 → slate-50 geändert
- V28HeroPremium: Secondary CTA + PWA-Button → nur noch PWA-Button (max 2 Buttons)
- V28ITDashboardPreview: ALLE Icon-BG standardisiert (green-100, blue-100, slate-200 → slate-50)
- Contact.tsx: Geprüft - bereits konform (V28IconBox variant="slate")

---

**DIESE REGELN SIND VERBINDLICH UND DÜRFEN NIEMALS VERLETZT WERDEN!**
