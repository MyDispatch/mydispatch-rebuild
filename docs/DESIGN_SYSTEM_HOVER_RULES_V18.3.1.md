# DESIGN-SYSTEM REGEL: HOVER-FARBEN AUF HELLEN HINTERGRÜNDEN

**Version:** V18.3.1  
**Datum:** 21.01.2025  
**Status:** 🔴 KRITISCH - SYSTEMWEIT BINDEND

---

## 📋 PROBLEM

Auf hellen Hintergründen (bg-primary, bg-background, bg-card) sind **weiße oder helle Hover-Farben NICHT sichtbar**.

**Beispiel:**

```tsx
// ❌ FALSCH - Weiße Hover-Farbe auf hellem Hintergrund
<Button variant="ghost">
  <Icon className="hover:text-white" /> {/* UNSICHTBAR! */}
</Button>
```

---

## ✅ LÖSUNG: SYSTEMWEITE REGEL

### Regel 1: Hover-Farben auf hellen Hintergründen

**Auf allen hellen Hintergründen IMMER `text-foreground` bei Hover verwenden:**

- `bg-primary` (Beige #EADEBD)
- `bg-background` (Weiß #FFFFFF)
- `bg-card` (Weiß #FFFFFF)
- `bg-secondary` (Helles Grau)
- `bg-muted` (Helles Grau)

```tsx
// ✅ RICHTIG
<Button variant="ghost" className="text-foreground hover:text-foreground">
  <Icon className="text-foreground" />
  Text
</Button>
```

### Regel 2: Hover-Farben auf dunklen Hintergründen

**Auf allen dunklen Hintergründen `text-white` oder `text-accent-foreground` verwenden:**

- `bg-accent` (Braun #856d4b)
- `bg-destructive` (Rot)
- `bg-status-success` (Grün)
- `bg-status-error` (Rot)

```tsx
// ✅ RICHTIG
<Button variant="default" className="bg-accent text-accent-foreground hover:text-white">
  <Icon className="text-white" />
  Text
</Button>
```

---

## 🎨 FARBSYSTEM-ÜBERSICHT

### MyDispatch CI-Farben

```css
/* Helle Hintergründe */
--primary: hsl(40 31% 88%); /* #EADEBD - Beige/Gold */
--background: hsl(0 0% 100%); /* #FFFFFF - Weiß */
--card: hsl(0 0% 100%); /* #FFFFFF - Weiß */

/* Dunkle Hintergründe */
--accent: hsl(31 26% 38%); /* #856d4b - Braun/Gold */
--foreground: hsl(225 31% 28%); /* #323D5E - Dunkelblau */

/* Text-Farben */
--primary-foreground: hsl(225 31% 28%); /* Dunkel für helle BG */
--accent-foreground: hsl(0 0% 100%); /* Weiß für dunkle BG */
```

---

## 🔧 IMPLEMENTIERUNG

### 1. Button-Komponente (BEREITS GEFIXED)

```tsx
// src/components/ui/button.tsx

const buttonVariants = cva("...", {
  variants: {
    variant: {
      // ✅ RICHTIG: hover:text-foreground statt hover:text-accent-foreground
      ghost: "text-foreground hover:bg-accent/10 hover:text-foreground hover:shadow-sm",

      // ✅ RICHTIG: hover:text-foreground auf hellem BG
      outline: "border hover:bg-accent/10 hover:text-foreground",
    },
  },
});
```

### 2. Custom Buttons auf hellen Hintergründen

```tsx
// ✅ RICHTIG - Explizite hover:text-foreground Klasse
<Button
  variant="ghost"
  className="hover:text-foreground"
>
  <Icon className="text-foreground" />
</Button>

// ❌ FALSCH - Keine Hover-Farbe oder weiße Farbe
<Button variant="ghost">
  <Icon className="hover:text-white" /> {/* UNSICHTBAR! */}
</Button>
```

### 3. Icon-Farben

```tsx
// ✅ RICHTIG auf hellen Hintergründen
<TrendingUp className="h-4 w-4 text-foreground hover:text-foreground" />

// ❌ FALSCH
<TrendingUp className="h-4 w-4 text-white" /> {/* UNSICHTBAR auf bg-primary! */}
```

---

## 📦 BETROFFENE KOMPONENTEN

### Systemweite Fixes erforderlich:

1. **Button-Komponente** ✅ FIXED
   - `variant="ghost"` → `hover:text-foreground`
   - `variant="outline"` → `hover:text-foreground`

2. **Custom Buttons** (Manuell prüfen)
   - Alle Buttons mit `bg-primary` Hintergrund
   - Alle Icon-Buttons auf Cards
   - Alle Action-Buttons auf hellen Hintergründen

3. **Dashboard-Widgets**
   - PredictiveDemandWidget ✅ FIXED
   - UrgentActionsWidget
   - WeatherWidget
   - TrafficWidget

4. **Navigation-Elemente**
   - Sidebar-Items auf `bg-primary`
   - Header-Buttons auf `bg-primary`

---

## ✅ PRE-COMMIT CHECKLIST

Vor jedem Commit prüfen:

- [ ] Alle Buttons auf hellen BG haben `hover:text-foreground`
- [ ] Keine `hover:text-white` auf `bg-primary`, `bg-background`, `bg-card`
- [ ] Keine `hover:text-accent-foreground` auf hellen Hintergründen
- [ ] Icons verwenden `text-foreground` auf hellen BG
- [ ] Dark-Mode-Kompatibilität geprüft (falls implementiert)

---

## 🚨 ANTI-PATTERNS (NIEMALS TUN!)

```tsx
// ❌ ANTI-PATTERN 1: Weiße Hover-Farbe auf hellem Hintergrund
<Button className="bg-primary hover:text-white">
  Text {/* UNSICHTBAR! */}
</Button>

// ❌ ANTI-PATTERN 2: accent-foreground auf hellem Hintergrund
<Icon className="text-foreground hover:text-accent-foreground" />
{/* accent-foreground ist WEISS - unsichtbar auf hellen BG! */}

// ❌ ANTI-PATTERN 3: Keine Hover-Farbe definiert
<Button variant="ghost">
  {/* Erbt möglicherweise falsche Farbe */}
</Button>

// ❌ ANTI-PATTERN 4: Direkte Hex-Farben statt CSS-Variablen
<Button className="hover:text-[#FFFFFF]">
  {/* Nicht wartbar, kein Design-System */}
</Button>
```

---

## 🎯 ERFOLGSKRITERIEN

✅ **Alle Buttons/Icons auf hellen Hintergründen sind bei Hover sichtbar**  
✅ **Konsistente Verwendung von `text-foreground` auf hellen BG**  
✅ **Keine Kontrast-Probleme mehr**  
✅ **Design-System-konform**

---

## 📚 VERWANDTE DOKUMENTATION

- [DESIGN_SYSTEM_MASTER_V18.3_ULTIMATE.md](./DESIGN_SYSTEM_MASTER_V18.3_ULTIMATE.md) - Vollständiges Design-System
- [ICON_GUIDELINES.md](../ICON_GUIDELINES.md) - Icon-Farben-Regeln
- [index.css](../src/index.css) - Zeile 90-113 (Hover-Regeln)

---

**⚠️ WICHTIG:** Diese Regel ist ab sofort BINDEND für alle neuen Components und muss bei bestehenden Components nachgezogen werden!
