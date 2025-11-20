# DARK BACKGROUNDS - COLOR RULES V18.5.2

> **Version:** 18.5.2  
> **Status:** ✅ VERBINDLICH  
> **Zweck:** Farb-Konsistenz auf dunklen Hintergründen

---

## ⚠️ KRITISCHE REGEL

**NIEMALS `text-foreground` auf dunklen Hintergründen verwenden!**

Dies führt zu **unsichtbarem Text** und ist einer der häufigsten Fehler.

---

## 🎨 FARB-REGELN NACH BACKGROUND

### 1️⃣ Dark Backgrounds (`bg-primary`, `bg-secondary`, `bg-accent`)

#### **Text:**

- ✅ `text-white`
- ✅ `text-primary-foreground`
- ✅ `text-white/90` (für Sekundär-Text)
- ❌ `text-foreground` (unsichtbar!)
- ❌ `text-muted-foreground` (unsichtbar!)

#### **Icons:**

- ✅ `text-white`
- ✅ `className="text-white"` im Icon-Component
- ❌ `text-foreground`

#### **Buttons:**

- ✅ `bg-background/20 text-white hover:bg-background/30`
- ✅ `bg-white/10 text-white hover:bg-white/20`
- ❌ Standard Button Variants (falsche Farben)

#### **Beispiel - KORREKT:**

```tsx
<header className="bg-primary sticky top-0 z-50">
  <div className="container flex items-center justify-between h-16">
    {/* Logo mit weißem Text */}
    <div className="flex items-center gap-2">
      <Icon name="Truck" className="h-6 w-6 text-white" />
      <span className="text-xl font-bold text-white">MyDispatch</span>
    </div>

    {/* Navigation mit weißen Icons */}
    <nav className="flex items-center gap-1">
      <Button variant="ghost" className="bg-background/20 text-white hover:bg-background/30">
        <Icon name="Home" className="h-4 w-4 text-white" />
        Home
      </Button>
      <Button variant="ghost" className="bg-background/20 text-white hover:bg-background/30">
        Login
      </Button>
    </nav>
  </div>
</header>
```

#### **Beispiel - FALSCH:**

```tsx
<header className="bg-primary sticky top-0 z-50">
  <div className="container flex items-center justify-between h-16">
    {/* ❌ FEHLER: text-foreground ist unsichtbar auf bg-primary! */}
    <div className="flex items-center gap-2">
      <Icon name="Truck" className="h-6 w-6 text-foreground" /> {/* ❌ */}
      <span className="text-xl font-bold text-foreground">MyDispatch</span> {/* ❌ */}
    </div>

    {/* ❌ FEHLER: Standard Button hat falsche Farben */}
    <nav className="flex items-center gap-1">
      <Button variant="ghost">
        {" "}
        {/* ❌ */}
        <Icon name="Home" className="h-4 w-4" />
        Home
      </Button>
    </nav>
  </div>
</header>
```

---

### 2️⃣ Light Backgrounds (`bg-background`, `bg-card`, `bg-muted`)

#### **Text:**

- ✅ `text-foreground`
- ✅ `text-muted-foreground`
- ❌ `text-white` (zu hell)

#### **Icons:**

- ✅ `text-foreground`
- ✅ `text-muted-foreground`
- ❌ `text-white`

#### **Buttons:**

- ✅ Standard Button Variants (`default`, `outline`, `ghost`)

#### **Beispiel - KORREKT:**

```tsx
<main className="bg-background min-h-screen">
  <div className="container py-8">
    {/* Standard Farben auf hellem Hintergrund */}
    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
    <p className="text-muted-foreground">Übersicht</p>

    {/* Standard Button Variants funktionieren */}
    <Button variant="default">Neuer Auftrag</Button>
    <Button variant="outline">Abbrechen</Button>
  </div>
</main>
```

---

### 3️⃣ Gradient Backgrounds (`bg-gradient-*`)

Behandeln wie **Dark Backgrounds**, wenn Gradient dunkel endet:

```tsx
<div className="bg-gradient-to-br from-primary to-primary/80">
  <h2 className="text-white">Premium Features</h2>
  <Icon name="Star" className="text-white" />
  <Button className="bg-background/20 text-white hover:bg-background/30">Mehr erfahren</Button>
</div>
```

---

## 🛠️ UTILITIES & HELPER

### Button auf Dark Background:

**Datei:** `src/components/design-system/DarkBackgroundButton.tsx`

```tsx
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DarkBackgroundButtonProps extends ButtonProps {
  // Props
}

export function DarkBackgroundButton({ className, children, ...props }: DarkBackgroundButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "bg-background/20 text-white hover:bg-background/30",
        "border-white/20 hover:border-white/30",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
```

**Nutzung:**

```tsx
<div className="bg-primary">
  <DarkBackgroundButton>Login</DarkBackgroundButton>
  <DarkBackgroundButton>Registrieren</DarkBackgroundButton>
</div>
```

---

## 🔍 VALIDIERUNG

### ESLint Rule:

```json
{
  "rules": {
    "no-restricted-syntax": [
      "error",
      {
        "selector": "JSXAttribute[name.name='className'][value.value=/text-foreground/] > JSXOpeningElement[name.name=/.*/>] > JSXElement > JSXAttribute[name.name='className'][value.value=/bg-primary|bg-secondary|bg-accent/]",
        "message": "❌ FEHLER: text-foreground darf nicht auf bg-primary/secondary/accent verwendet werden! Nutze text-white."
      }
    ]
  }
}
```

### Manual Check:

```bash
# Suche nach verbotenen Kombinationen
grep -rn "text-foreground.*bg-primary\|bg-primary.*text-foreground" src/

# Suche nach text-muted-foreground auf dunklen Backgrounds
grep -rn "text-muted-foreground.*bg-primary\|bg-primary.*text-muted-foreground" src/
```

---

## 📋 CHECKLISTE VOR COMMIT

- [ ] Alle Icons auf `bg-primary/secondary/accent` haben `text-white`
- [ ] Alle Texte auf dunklen Backgrounds haben `text-white`
- [ ] Buttons auf dunklen Backgrounds haben `bg-background/20 text-white`
- [ ] Keine `text-foreground` auf dunklen Backgrounds
- [ ] Dark Mode getestet

---

## 🎨 QUICK REFERENCE

| Background      | Text              | Icons             | Buttons                                              |
| --------------- | ----------------- | ----------------- | ---------------------------------------------------- |
| `bg-primary`    | `text-white`      | `text-white`      | `bg-background/20 text-white hover:bg-background/30` |
| `bg-secondary`  | `text-white`      | `text-white`      | `bg-background/20 text-white hover:bg-background/30` |
| `bg-accent`     | `text-white`      | `text-white`      | `bg-background/20 text-white hover:bg-background/30` |
| `bg-background` | `text-foreground` | `text-foreground` | Standard Variants                                    |
| `bg-card`       | `text-foreground` | `text-foreground` | Standard Variants                                    |

---

**Referenz:** `SYSTEM_DESIGN_PRINCIPLES_V18.5.0.md`  
**Next:** Apply to all Marketing Pages & Dashboard
