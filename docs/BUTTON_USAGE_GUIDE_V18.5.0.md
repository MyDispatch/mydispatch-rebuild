# BUTTON USAGE GUIDE V18.5.0

> **Version:** 18.5.0  
> **Status:** ✅ VERBINDLICH  
> **Zweck:** Korrekte Button-Verwendung in MyDispatch

---

## 🎯 BUTTON-ARTEN

### 1. MARKETING-BUTTONS

**Verwendung:** Landing Pages (Home, Pricing, etc.)  
**Pfad:** `src/components/design-system/MarketingButton.tsx`

```tsx
import { MarketingButton } from '@/components/design-system';

// Hero-Section (auf dunklem Video-Background)
<MarketingButton marketingVariant="hero-primary" size="lg">
  Jetzt abonnieren
</MarketingButton>

<MarketingButton marketingVariant="hero-secondary" size="lg">
  Demo ansehen
</MarketingButton>

// CTA-Section (auf hellem Background)
<MarketingButton marketingVariant="cta-primary" size="lg">
  Starten
</MarketingButton>

<MarketingButton marketingVariant="cta-secondary" size="lg">
  Mehr erfahren
</MarketingButton>
```

**Farben:**

- `hero-primary`: Gold/Beige (`bg-primary`) mit dunkelbauem Text
- `hero-secondary`: Transparent mit weißem Border und Text
- `cta-primary`: Gold/Beige (`bg-primary`) mit dunkelbauem Text
- `cta-secondary`: Transparent mit Primary-Border

---

### 2. APP-BUTTONS

**Verwendung:** Dashboard, Interne Seiten  
**Pfad:** `src/components/ui/button.tsx`

```tsx
import { Button } from '@/components/ui/button';

// Standard-Button (Primary Action)
<Button variant="default">Speichern</Button>

// Sekundäre Aktion
<Button variant="secondary">Abbrechen</Button>

// Outline für subtile Actions
<Button variant="outline">Details</Button>

// Ghost für minimale Actions
<Button variant="ghost">
  <Edit className="h-4 w-4" />
</Button>

// Destructive für Delete-Actions
<Button variant="destructive">Löschen</Button>

// Quick-Action (speziell für Dashboard)
<Button variant="quickAction">
  <Plus className="h-4 w-4" />
  Neuer Auftrag
</Button>
```

**Varianten-Übersicht:**
| Variante | Verwendung | Farben |
|----------|------------|--------|
| `default` | Primäre Aktion | `bg-primary` + `text-primary-foreground` |
| `secondary` | Sekundäre Aktion | `bg-secondary` + `text-secondary-foreground` |
| `outline` | Subtile Aktion | `border-input` + `bg-background` |
| `ghost` | Minimale Aktion | Transparent + Hover-Background |
| `destructive` | Löschen/Ablehnen | `bg-destructive` + `text-destructive-foreground` |
| `link` | Link-Stil | `text-primary` + Underline |
| `quickAction` | Dashboard Quick-Actions | Transparent + Hover-Primary |

---

## 🎨 FARB-REGELN

### KRITISCH: Background-Kontrast beachten!

#### Auf DUNKLEM Background (Video-Hero, Dark-Mode)

```tsx
✅ RICHTIG:
<Button className="bg-primary text-foreground">Text</Button>
<Button className="bg-background text-foreground">Text</Button>
<Button className="border-2 border-white text-white">Text</Button>

❌ FALSCH:
<Button className="bg-foreground text-background">Text</Button>  // Zu dunkel!
<Button className="text-foreground">Text</Button>  // Unsichtbar!
```

#### Auf HELLEM Background (Cards, Dashboard)

```tsx
✅ RICHTIG:
<Button variant="default">Text</Button>  // Nutzt primary
<Button variant="secondary">Text</Button>
<Button variant="outline">Text</Button>

❌ FALSCH:
<Button className="text-white bg-white">Text</Button>  // Kein Kontrast!
```

---

## 📱 MOBILE-OPTIMIERUNG

### Touch-Targets (PFLICHT)

```tsx
// IMMER mindestens 44x44px für Touch-Targets
<Button className="min-h-[44px]">OK</Button>

// Oder size="lg"
<Button size="lg">OK</Button>
```

### Responsive Sizing

```tsx
// Mobile-First Sizing
<Button size="lg" className="w-full sm:w-auto px-4 sm:px-8 py-4 sm:py-6">
  Abonnieren
</Button>
```

---

## ✨ HOVER & ANIMATIONEN

### Standard-Hover (App-Buttons)

```tsx
// Automatisch durch Varianten
<Button variant="default">Hover-Effekt inkludiert</Button>
```

### Custom-Hover (Marketing)

```tsx
<MarketingButton
  marketingVariant="hero-primary"
  className="hover:scale-105 transition-all duration-300"
>
  Mit Scale-Effekt
</MarketingButton>
```

---

## 🔢 ICON-BUTTONS

### Mit Icon + Text

```tsx
import { Plus } from "lucide-react";

<Button>
  <Plus className="h-4 w-4" />
  Neu erstellen
</Button>;
```

### Nur Icon

```tsx
<Button size="icon" variant="ghost">
  <Edit className="h-4 w-4" />
</Button>

// Mit ARIA-Label (Accessibility)
<Button size="icon" variant="ghost" aria-label="Bearbeiten">
  <Edit className="h-4 w-4" />
</Button>
```

---

## 🚫 VERBOTENE PATTERNS

### ❌ Direkte Farben

```tsx
// FALSCH
<Button className="bg-blue-500 text-white">Button</Button>
<Button className="bg-[#EADEBD]">Button</Button>

// RICHTIG
<Button variant="default">Button</Button>
<Button className="bg-primary text-foreground">Button</Button>
```

### ❌ Falsche Marketing-Button Usage

```tsx
// FALSCH - Standard-Button auf Marketing-Seite
<Button variant="default">Jetzt abonnieren</Button>

// RICHTIG - Marketing-Button verwenden
<MarketingButton marketingVariant="hero-primary">
  Jetzt abonnieren
</MarketingButton>
```

### ❌ Zu kleine Touch-Targets

```tsx
// FALSCH
<Button className="h-8 px-2">OK</Button>  // Zu klein für Mobile!

// RICHTIG
<Button className="min-h-[44px] px-4">OK</Button>
```

---

## 📋 CHECKLISTE VOR DEPLOYMENT

- [ ] Alle Marketing-Buttons verwenden `MarketingButton`
- [ ] Keine direkten Farben (`bg-blue-500`, `text-white`)
- [ ] Alle Buttons haben mindestens `min-h-[44px]`
- [ ] Icon-Buttons haben `aria-label`
- [ ] Hover-Effekte sind konsistent
- [ ] Mobile-First Sizing verwendet
- [ ] Kontraste sind WCAG AA konform (4.5:1)

---

## 🔗 VERKNÜPFTE DOKUMENTE

- [UI_COMPONENTS_LIBRARY_V18.5.0.md](./UI_COMPONENTS_LIBRARY_V18.5.0.md)
- [DESIGN_SYSTEM_V18.5.0.md](./DESIGN_SYSTEM_V18.5.0.md)
- [QUALITAETS_STANDARDS_V18.5.0.md](./QUALITAETS_STANDARDS_V18.5.0.md)

---

**Letzte Aktualisierung:** 2025-10-22 22:35 (DE)  
**Version:** 18.5.0  
**Status:** ✅ VERBINDLICH
