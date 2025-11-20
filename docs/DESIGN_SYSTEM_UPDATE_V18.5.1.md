# DESIGN SYSTEM UPDATE V18.5.1

> **Version:** 18.5.1  
> **Datum:** 26.01.2025  
> **Art:** Header/Footer Harmonisierung

---

## 🎯 ÄNDERUNGEN

### 1. Header-Übernahme (Auth → Marketing)

**Vorher (MarketingLayout):**

```tsx
<header className="bg-background shadow-sm border-b border-border">{/* Weißer Header */}</header>
```

**Nachher (Auth-Style übernommen):**

```tsx
<header className="bg-gradient-to-r from-primary via-primary to-primary/95 shadow-lg border-b border-border/20">
  {/* Primary Gradient Header - fehlerfrei */}
</header>
```

**Grund:** Auth-Header ist fehlerfrei und wurde als Basis übernommen.

---

### 2. Footer-Anpassung (Matching Header)

**Vorher:**

```tsx
<footer className="bg-background border-t border-border">
  <Link className="text-muted-foreground hover:text-foreground">Impressum</Link>
</footer>
```

**Nachher:**

```tsx
<footer className="bg-gradient-to-t from-primary via-primary to-primary/95 border-t border-border/20 backdrop-blur-sm">
  <Link className="text-foreground/70 hover:text-foreground">Impressum</Link>
</footer>
```

**Grund:** Footer passt sich farblich an Header an (Primary Gradient statt Weiß).

---

### 3. Sidebar (UNVERÄNDERT)

**Bleibt:**

```tsx
<aside className="bg-background border-r border-border">
  <Link className="text-foreground hover:bg-primary/10 hover:text-foreground">
    <Icon className="h-5 w-5 text-foreground" />
    Navigation
  </Link>
</aside>
```

**Grund:** Sidebar bleibt im aktuellen Design (Weiß/Beige) und wird NICHT angepasst!

---

## 🎨 FARBSYSTEM-UPDATES

### Header/Footer (NEU)

| Element    | Farbe            | Wert                                                       |
| ---------- | ---------------- | ---------------------------------------------------------- |
| Background | Primary Gradient | `from-primary via-primary to-primary/95`                   |
| Text       | Foreground       | `text-foreground` (Header) / `text-foreground/70` (Footer) |
| Border     | Subtil           | `border-border/20`                                         |
| Shadow     | Premium          | `shadow-lg` (Header) / `backdrop-blur-sm` (Footer)         |

### Sidebar (UNVERÄNDERT)

| Element    | Farbe      | Wert                                        |
| ---------- | ---------- | ------------------------------------------- |
| Background | Weiß       | `bg-background`                             |
| Active     | Primary    | `bg-primary text-foreground`                |
| Hover      | Primary/10 | `hover:bg-primary/10 hover:text-foreground` |
| Icons      | Foreground | `text-foreground`                           |

---

## 📦 BETROFFENE DATEIEN

### Geändert

- `src/components/layout/MarketingLayout.tsx` - Header/Footer übernommen
- `docs/HEADER_FOOTER_DESIGN_V18.5.1.md` - Neue Spezifikation

### Basis (Referenz)

- `src/components/auth/AuthHeader.tsx` - Fehlerfrei, als Basis verwendet
- `src/components/auth/AuthFooter.tsx` - Als Basis für Footer-Farben

### Unverändert (Beibehalten)

- `src/components/layout/MarketingLayout.tsx` - Sidebar-Design
- `src/index.css` - Sidebar-Farben (Lines 164-171)

---

## ✅ ERFOLGSKRITERIEN

1. ✅ Header: Primary Gradient (`from-primary via-primary to-primary/95`)
2. ✅ Footer: Primary Gradient (`from-primary via-primary to-primary/95`, Richtung `to top`)
3. ✅ Logo: Strikte `max-w-[120px] sm:max-w-[160px] md:max-w-[180px]` (kein Overflow)
4. ✅ Buttons: `bg-background/20 hover:bg-background/30` (Glassmorphism)
5. ✅ Footer-Text: `text-foreground/70 hover:text-foreground` (gedimmt)
6. ✅ Sidebar: Bleibt `bg-background` mit `text-foreground` Icons

---

## 🔄 MIGRATION-GUIDE

### Für neue Marketing-Seiten

```tsx
import { MarketingLayout } from "@/components/layout/MarketingLayout";

// MarketingLayout verwendet automatisch:
// - Header: Primary Gradient (Auth-Style)
// - Footer: Primary Gradient (Matching Header)
// - Sidebar: Weiß/Beige (Unverändert)

export default function NewMarketingPage() {
  return <MarketingLayout currentPage="new-page">{/* Content */}</MarketingLayout>;
}
```

### Für Custom Headers/Footers

```tsx
// Verwende immer AuthHeader/AuthFooter als Basis!
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthFooter } from '@/components/auth/AuthFooter';

<AuthHeader /> {/* Fehlerfrei! */}
<AuthFooter /> {/* Fehlerfrei! */}
```

---

## 🚨 WICHTIGE REGELN

### ✅ DO

- Header/Footer: Primary Gradient verwenden
- Text auf Primary BG: `text-foreground` oder `text-foreground/70`
- Buttons auf Primary BG: `bg-background/20 hover:bg-background/30`
- Sidebar: `bg-background` beibehalten

### ❌ DON'T

- Header/Footer: NICHT `bg-background` (Weiß) verwenden
- Text: NICHT `text-white` auf Primary BG
- Sidebar: NICHT Primary Gradient verwenden
- Logo: KEINE unbegrenzten `max-w-*` Werte

---

## 📚 VERWANDTE UPDATES

- [HEADER_FOOTER_DESIGN_V18.5.1.md](./HEADER_FOOTER_DESIGN_V18.5.1.md) - Vollständige Spezifikation
- [DESIGN_SYSTEM_HOVER_RULES_V18.3.1.md](./DESIGN_SYSTEM_HOVER_RULES_V18.3.1.md) - Hover-Regeln
- [UI_LIBRARY_SYSTEM_V18.5.0.md](./UI_LIBRARY_SYSTEM_V18.5.0.md) - Komponenten-Library

---

**Status:** ✅ PRODUKTIONSREIF - Alle Änderungen implementiert
