# HEADER & FOOTER DESIGN SYSTEM V18.5.1

> **Version:** 18.5.1  
> **Datum:** 26.01.2025  
> **Status:** ✅ PRODUKTIONSREIF

---

## 🎯 ÜBERSICHT

Einheitliches Header/Footer-Design für alle Marketing-Seiten mit Auth-Header als fehlerfreie Basis.

---

## 📐 DESIGN-SPEZIFIKATIONEN

### Header (Auth-Style - Fehlerfrei)

```tsx
<header className="fixed top-0 z-30 bg-gradient-to-r from-primary via-primary to-primary/95 shadow-lg border-b border-border/20">
  <div className="px-4 sm:px-6">
    <div className="flex items-center justify-between h-14 sm:h-16">
      {/* Logo - KEIN Overflow */}
      <img
        src={officialLogo}
        alt="MyDispatch"
        className="h-7 sm:h-8 max-w-[120px] sm:max-w-[160px] md:max-w-[180px] object-contain drop-shadow-sm"
      />

      {/* Action Buttons */}
      <Button className="bg-background/20 text-foreground hover:bg-background/30">Anmelden</Button>
    </div>
  </div>
</header>
```

**Eigenschaften:**

- **Background:** `bg-gradient-to-r from-primary via-primary to-primary/95`
- **Höhe:** `h-14 sm:h-16` (56px → 64px)
- **Padding:** `px-4 sm:px-6` (horizontal)
- **Shadow:** `shadow-lg` (Premium-Effekt)
- **Border:** `border-b border-border/20` (subtil)
- **Logo:** Strikte `max-w-[120px] sm:max-w-[160px] md:max-w-[180px]` (KEIN Overflow!)
- **Buttons:** `bg-background/20` mit `hover:bg-background/30` (Glassmorphism)
- **Text:** `text-primary-foreground` (hell/weiß für bessere Harmonie mit Sidebar!)
- **Hover:** `hover:text-primary-foreground` (bleibt hell)

---

### Footer (Matching Header - V18.5.2 mit heller Schrift)

**Aktualisiert:** Footer verwendet helle Schrift für bessere Harmonie!

```tsx
<footer className="fixed bottom-0 z-20 bg-gradient-to-t from-primary via-primary to-primary/95 border-t border-border/20 backdrop-blur-sm py-3 sm:py-4">
  <div className="container mx-auto px-4 sm:px-6">
    {/* Mobile: Kompakt */}
    <div className="sm:hidden flex flex-col items-center gap-2">
      <p className="text-[10px] text-primary-foreground/90 font-medium">
        © 2025 MyDispatch.de by RideHub Solutions
      </p>
      <div className="flex items-center gap-3">
        <Link className="text-[10px] text-primary-foreground/80 hover:text-primary-foreground">
          Impressum
        </Link>
        <span className="text-[10px] text-primary-foreground/40">•</span>
        <Link className="text-[10px] text-primary-foreground/80 hover:text-primary-foreground">
          Datenschutz
        </Link>
      </div>
    </div>

    {/* Desktop: Mehrspaltig */}
    <div className="hidden sm:flex items-center justify-between">
      <p className="text-xs text-primary-foreground/90">
        © 2025 MyDispatch.de by RideHub Solutions
      </p>
      <div className="flex gap-6">
        <Link className="text-xs text-primary-foreground/80 hover:text-primary-foreground">
          Impressum
        </Link>
        <Link className="text-xs text-primary-foreground/80 hover:text-primary-foreground">
          Datenschutz
        </Link>
      </div>
    </div>
  </div>
</footer>
```

**Eigenschaften:**

- **Background:** `bg-gradient-to-t from-primary via-primary to-primary/95` (identisch zu Header, nur Richtung gedreht)
- **Padding:** `py-3 sm:py-4` (vertical)
- **Border:** `border-t border-border/20` (subtil)
- **Backdrop:** `backdrop-blur-sm` (Glassmorphism)
- **Text:** `text-primary-foreground/80 hover:text-primary-foreground` (hell, mit Opacity)
- **Trennzeichen:** `text-primary-foreground/40` (gedimmt)
- **Responsive:** Mobile kompakt einspaltig, Desktop mehrspaltig

**WICHTIG:** Alle Footer-Texte verwenden `text-primary-foreground` (hell) statt `text-foreground` (dunkel)!

---

## 🎨 FARBSYSTEM

### Header/Footer Gradient mit heller Schrift (V18.5.2)

**WICHTIG:** Alle Texte auf Primary Gradient MÜSSEN hell sein (Weiß/Creme)!

```css
/* Primary Gradient (Beige/Gold) */
--primary: hsl(40, 31%, 88%); /* #EADEBD */
--primary-foreground: hsl(225, 31%, 28%); /* #323D5E - Dunkelblau */

/* Header: Top → Bottom */
background: linear-gradient(
  to right,
  hsl(var(--primary)),
  hsl(var(--primary)),
  hsl(var(--primary) / 0.95)
);

/* Footer: Bottom → Top */
background: linear-gradient(
  to top,
  hsl(var(--primary)),
  hsl(var(--primary)),
  hsl(var(--primary) / 0.95)
);
```

### Text-Farben auf Primary Gradient BG (NEUE REGEL V18.5.2)

**KRITISCH:** Wir verwenden NICHT mehr `text-foreground` (dunkel) auf Primary Gradient!

```css
/* ✅ RICHTIG: Helle Schrift auf Primary Gradient */

/* Standard-Text (gedimmt, 80-90% Opacity) */
text-primary-foreground/90: hsl(225, 31%, 28%, 0.9); /* Haupttext */
text-primary-foreground/80: hsl(225, 31%, 28%, 0.8); /* Links/Sekundär */

/* Hover-Text (voll, 100% Opacity) */
text-primary-foreground: hsl(225, 31%, 28%); /* Aktiv/Hover */

/* Trennzeichen (40% Opacity) */
text-primary-foreground/40: hsl(225, 31%, 28%, 0.4); /* Bullet-Points */
```

**Reasoning:**

- Primary Gradient ist hell (Beige #EADEBD)
- `primary-foreground` ist dunkel (Dunkelblau #323D5E)
- ABER: Für bessere Harmonie mit Sidebar verwenden wir helle Schrift
- Lösung: `text-primary-foreground` mit Opacity-Varianten für Kontrast

---

## 📦 SIDEBAR (UNVERÄNDERT)

**WICHTIG:** Sidebar bleibt im aktuellen Design (weiß/beige) und wird NICHT an Header/Footer angepasst!

```tsx
<aside className="bg-background border-r border-border">
  {/* Sidebar bleibt weiß/beige mit text-foreground Icons */}
  <Link className="text-foreground hover:bg-primary/10 hover:text-foreground">
    <Icon className="h-5 w-5 text-foreground" />
    Navigation
  </Link>
</aside>
```

**Sidebar-Farben:**

- **Background:** `bg-background` (Weiß #FFFFFF)
- **Active:** `bg-primary text-foreground` (Beige #EADEBD)
- **Hover:** `hover:bg-primary/10 hover:text-foreground`
- **Icons:** `text-foreground` (Dunkelblau #323D5E)

---

## ✅ IMPLEMENTIERUNGS-CHECKLISTE

### Header

- [ ] Gradient `from-primary via-primary to-primary/95`
- [ ] Logo mit strikter `max-w-[120px] sm:max-w-[160px] md:max-w-[180px]`
- [ ] Logo `object-contain` + `drop-shadow-sm`
- [ ] Buttons `bg-background/20 hover:bg-background/30`
- [ ] Button-Text `text-foreground`
- [ ] Höhe `h-14 sm:h-16`

### Footer

- [ ] Gradient `from-primary via-primary to-primary/95` (to top!)
- [ ] Text `text-foreground/70 hover:text-foreground`
- [ ] Border `border-t border-border/20`
- [ ] Backdrop `backdrop-blur-sm`
- [ ] Padding `py-3 sm:py-4`

### Sidebar (Unverändert)

- [ ] Background `bg-background` (Weiß)
- [ ] Active `bg-primary text-foreground`
- [ ] Hover `hover:bg-primary/10 hover:text-foreground`
- [ ] Icons `text-foreground`

---

## 🚨 CRITICAL RULES

### ✅ RICHTIG

```tsx
// Header/Footer: Primary Gradient + Foreground Text
<header className="bg-gradient-to-r from-primary via-primary to-primary/95">
  <Button className="bg-background/20 text-foreground hover:bg-background/30">
    Anmelden
  </Button>
</header>

<footer className="bg-gradient-to-t from-primary via-primary to-primary/95">
  <Link className="text-foreground/70 hover:text-foreground">
    Impressum
  </Link>
</footer>

// Sidebar: Weiß/Beige + Foreground Text
<aside className="bg-background">
  <Link className="text-foreground hover:bg-primary/10 hover:text-foreground">
    Navigation
  </Link>
</aside>
```

### ❌ FALSCH

```tsx
// Header/Footer: NICHT bg-background verwenden!
<header className="bg-background"> ❌ FALSCH

// Header/Footer: NICHT text-white verwenden!
<Button className="text-white"> ❌ FALSCH

// Sidebar: NICHT Primary Gradient verwenden!
<aside className="bg-gradient-to-r from-primary"> ❌ FALSCH
```

---

## 📊 KOMPONENTEN-ÜBERSICHT

| Komponente  | Background                                                | Text                 | Border                      |
| ----------- | --------------------------------------------------------- | -------------------- | --------------------------- |
| **Header**  | `bg-gradient-to-r from-primary via-primary to-primary/95` | `text-foreground`    | `border-b border-border/20` |
| **Footer**  | `bg-gradient-to-t from-primary via-primary to-primary/95` | `text-foreground/70` | `border-t border-border/20` |
| **Sidebar** | `bg-background`                                           | `text-foreground`    | `border-r border-border`    |

---

## 🔗 VERWANDTE DOKUMENTATION

- [DESIGN_SYSTEM_MASTER_V18.5.0.md](./DESIGN_SYSTEM_MASTER_V18.5.0.md)
- [UI_LIBRARY_SYSTEM_V18.5.0.md](./UI_LIBRARY_SYSTEM_V18.5.0.md)
- [HEADER_FOOTER_UNIFIED_V18.5.0.md](./HEADER_FOOTER_UNIFIED_V18.5.0.md)

---

**⚠️ WICHTIG:** Diese Spezifikation ist ab sofort BINDEND für alle Marketing-Seiten!
