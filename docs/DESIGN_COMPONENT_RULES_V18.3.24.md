# 🎨 DESIGN COMPONENT RULES V18.3.24
**Spezifische Komponenten-Regeln & Design-Patterns**

Datum: 18.01.2025  
Version: V18.3.24  
Status: 🔴 BINDEND

---

## 🎯 ZWECK

Dieses Dokument definiert **spezifische Design-Regeln für UI-Komponenten**, die über die allgemeinen Design-System-Vorgaben hinausgehen.

---

## 🏷️ BADGE-KOMPONENTE

### Grundregeln

**✅ Erlaubte Verwendungen:**
```tsx
// Informative Labels (nicht interaktiv)
<Badge>Empfohlen</Badge>
<Badge variant="success">Aktiv</Badge>
<Badge variant="secondary">Business+</Badge>
```

**❌ VERBOTEN:**
```tsx
// 1. Keine Hover-Effekte
<Badge className="hover:bg-primary cursor-pointer" />  // ❌ FALSCH!

// 2. Keine Click-Handler
<Badge onClick={handleClick}>Click me</Badge>  // ❌ FALSCH!

// 3. Keine Transitions/Animations
<Badge className="transition-all hover:scale-105" />  // ❌ FALSCH!
```

### Korrekte Badge-Implementierung

```tsx
// Standard Badge (read-only)
<Badge className="pointer-events-none">
  Empfohlen
</Badge>

// Mit Icon (auch read-only)
<Badge className="pointer-events-none">
  <StarIcon className="h-3 w-3 mr-1 text-foreground" />
  Top-Feature
</Badge>

// Wenn Interaktion WIRKLICH nötig:
// → Verwende stattdessen einen Button!
<Button variant="outline" size="sm">
  Business+ Feature
</Button>
```

### Badge-Varianten

```tsx
// Verfügbare Varianten:
<Badge variant="default">Standard</Badge>      // neutral
<Badge variant="secondary">Info</Badge>        // muted
<Badge variant="success">Aktiv</Badge>         // grün
<Badge variant="warning">Ausstehend</Badge>    // gelb
<Badge variant="destructive">Fehler</Badge>    // rot
<Badge variant="outline">Umrandet</Badge>      // transparent
```

**Regel:** Badges sind **immer** non-interactive Labels!

---

## 🪟 DIALOG/MODAL-KOMPONENTE

### Dialog-Struktur (ZWINGEND)

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-3xl">
    {/* 1. HEADER (innerhalb) */}
    <DialogHeader>
      <DialogTitle>Titel</DialogTitle>
      <DialogDescription>Beschreibung</DialogDescription>
    </DialogHeader>

    {/* 2. CONTENT (innerhalb, scrollbar) */}
    <ScrollArea className="max-h-[60vh]">
      {/* Scrollbarer Content */}
    </ScrollArea>

    {/* 3. FOOTER (innerhalb, unten fixiert) */}
    <div className="px-6 py-4 border-t bg-background">
      <Button>Aktion</Button>
      <Button variant="secondary">Schließen</Button>
    </div>
  </DialogContent>
</Dialog>
```

### Dialog-Footer Regeln

**❌ FALSCH:**
```tsx
</DialogContent>  {/* Content schließt */}
<div className="footer">  {/* Footer AUSSERHALB! */}
  <Button variant="outline">Schließen</Button>  {/* Weiß auf weiß! */}
</div>
```

**✅ RICHTIG:**
```tsx
  {/* Content */}
  
  {/* Footer INNERHALB DialogContent */}
  <div className="px-6 py-4 border-t bg-background">
    <Button variant="secondary">Schließen</Button>  {/* Sichtbar! */}
  </div>
</DialogContent>
```

### Dialog-Button-Farben

```tsx
// Primär-Aktion: Standard oder primary-gefärbt
<Button className="bg-primary hover:bg-primary/90 text-foreground">
  Speichern
</Button>

// Sekundär-Aktion: NIEMALS outline (schlecht sichtbar)
<Button variant="secondary">Schließen</Button>  // ✅ RICHTIG
<Button variant="ghost">Abbrechen</Button>       // ✅ RICHTIG
<Button variant="outline">Schließen</Button>     // ❌ FALSCH (weiß auf weiß)
```

**Regel:** Dialog-Footer immer `bg-background`, Close-Button `variant="secondary"` oder `variant="ghost"`

---

## 🔘 BUTTON-KOMPONENTE

### Button-Varianten-Matrix

| Variante | Verwendung | Farbe | Hover |
|----------|------------|-------|-------|
| `default` | Primär-Aktion | `bg-primary` | `hover:bg-primary/90` |
| `destructive` | Löschen/Stornieren | `bg-status-error` | `hover:bg-status-error/90` |
| `outline` | Sekundär (hell) | `border` transparent | `hover:bg-muted` |
| `secondary` | Sekundär (dunkel) | `bg-secondary` | `hover:bg-secondary/80` |
| `ghost` | Tertiary/Subtle | transparent | `hover:bg-muted` |
| `link` | Link-Style | transparent | `underline` |

### Button-Größen

```tsx
<Button size="sm">Klein</Button>        // h-9 px-3
<Button size="default">Standard</Button> // h-10 px-4
<Button size="lg">Groß</Button>          // h-11 px-8
<Button size="icon">Icon</Button>        // h-10 w-10
```

### Custom Button-Farben (Tarif-Highlights)

```tsx
// Für hervorgehobene Aktionen (z.B. Business-Tarif)
<Button
  className={cn(
    "flex-1",
    tariff.highlighted && "bg-primary hover:bg-primary/90 text-foreground"
  )}
>
  {tariff.ctaText}
</Button>
```

**Regel:** Niemals `bg-accent` (verboten!), nur `bg-primary` oder Varianten

---

## 📋 CARD-KOMPONENTE

### Card-Struktur

```tsx
<Card className="border rounded-lg bg-card">
  <CardHeader>
    <CardTitle>Titel</CardTitle>
    <CardDescription>Beschreibung</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Optional: Buttons */}
  </CardFooter>
</Card>
```

### Card-Hover-Effekte (Optional)

```tsx
// Für interaktive Cards:
<Card className="border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
  {/* Content */}
</Card>

// Für nicht-interaktive Cards:
<Card className="border rounded-lg">  {/* Kein Hover */}
  {/* Content */}
</Card>
```

**Regel:** Hover nur auf wirklich interaktiven Cards (Click-Handler vorhanden)

---

## 🎨 ICON-KOMPONENTE

### Icon-Farben (ABSOLUT)

```tsx
// ✅ Standard (IMMER verwenden)
<Icon className="h-4 w-4 text-foreground" />

// ✅ Disabled-State
<Icon className="h-4 w-4 text-muted-foreground" />

// ❌ VERBOTEN (Ampelfarben nur auf Badge/StatusIndicator!)
<Icon className="h-4 w-4 text-status-success" />  // FALSCH!
<Icon className="h-4 w-4 text-accent" />          // FALSCH (accent verboten!)
```

### Icon-Größen

```tsx
<Icon className="h-3 w-3" />  // Extra Klein (Badge)
<Icon className="h-4 w-4" />  // Klein (Standard)
<Icon className="h-5 w-5" />  // Medium
<Icon className="h-6 w-6" />  // Groß (Header)
<Icon className="h-8 w-8" />  // Extra Groß (Hero)
```

**Regel:** Icons IMMER `text-foreground` oder `text-muted-foreground`, NIEMALS Status-Farben!

---

## 🔴 STATUS-INDICATOR-KOMPONENTE

### Wann StatusIndicator verwenden?

**✅ RICHTIG:**
```tsx
// Nur für tatsächliche Status-Anzeigen:
<StatusIndicator status="success">Auftrag bestätigt</StatusIndicator>
<StatusIndicator status="warning">Zahlung ausstehend</StatusIndicator>
<StatusIndicator status="error">Dokument abgelaufen</StatusIndicator>
```

**❌ FALSCH:**
```tsx
// Nicht für allgemeine Icons:
<CheckIcon className="text-status-success" />  // → Verwende text-foreground!
```

### StatusIndicator-Implementation

```tsx
interface StatusIndicatorProps {
  status: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

const StatusIndicator = ({ status, children }: StatusIndicatorProps) => {
  const colors = {
    success: 'text-status-success bg-status-success/10',
    warning: 'text-status-warning bg-status-warning/10',
    error: 'text-status-error bg-status-error/10',
    info: 'text-muted-foreground bg-muted/10'
  };

  return (
    <div className={cn('px-2 py-1 rounded-full text-xs font-medium', colors[status])}>
      {children}
    </div>
  );
};
```

**Regel:** Ampelfarben (success/warning/error) NUR auf StatusIndicator, Badge (variant) und Alert!

---

## 📏 SPACING & LAYOUT

### Container-Padding

```tsx
// Page-Container (Standard)
<div className="px-4 sm:px-6 lg:px-8 py-6">

// Card-Padding
<Card className="p-6">  // Standard
<Card className="p-4">  // Kompakt (Mobile)

// Dialog-Padding
<DialogHeader className="px-6 pt-6 pb-4">
<DialogContent className="px-6 py-4">
```

### Spacing zwischen Elementen (8px Grid)

```tsx
// Vertikal
<div className="space-y-4">     // 16px (Standard)
<div className="space-y-6">     // 24px (Sections)
<div className="space-y-2">     // 8px (Kompakt)

// Horizontal
<div className="space-x-3">     // 12px (Buttons)
<div className="space-x-4">     // 16px (Standard)

// Gap (Grid/Flex)
<div className="grid gap-4">    // 16px
<div className="flex gap-3">    // 12px
```

**Regel:** Immer 8px-Grid einhalten (4, 8, 12, 16, 24, 32, 48)

---

## 🎯 ZUSAMMENFASSUNG: KRITISCHE KOMPONENTEN-REGELN

### Top 5 Komponenten-Fehler vermeiden:

1. **Badge mit Hover** → `pointer-events-none` hinzufügen
2. **Dialog-Footer außerhalb** → Immer innerhalb `<DialogContent>`
3. **Outline-Button in Dialog** → Verwende `variant="secondary"`
4. **Icons mit Status-Farben** → Nur `text-foreground`
5. **accent-Farbe** → Komplett verboten, verwende `primary`

---

## 🔗 VERKNÜPFTE DOKUMENTE

- **KNOWN_ISSUES_REGISTRY_V18.3.24.md** - Fehler A.5, A.6 (Badge, Dialog)
- **ICON_GUIDELINES.md** - Icon-Farben-Regeln
- **MASTER_VORGABEN_CHECKLISTE_V18.3.24.md** - Design-System

---

**Version:** V18.3.24  
**Letzte Aktualisierung:** 18.01.2025  
**Status:** ✅ BINDEND  
**Änderungsvorbehalt:** info@my-dispatch.de
