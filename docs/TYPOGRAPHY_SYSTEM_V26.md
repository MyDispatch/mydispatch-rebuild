# TYPOGRAPHY SYSTEM V26.0

> **Version:** 26.0  
> **Letzte Aktualisierung:** 2025-01-26  
> **Status:** ✅ Production Ready

---

## 🎯 ÜBERSICHT

Systemweite Schriftarten-Vorgaben für MyDispatch. Garantiert konsistente Typografie und perfekte Lesbarkeit auf allen Geräten.

---

## 📚 SCHRIFTFAMILIEN

### Primary: Inter (Sans-Serif)

**Verwendung:** Gesamte UI, alle Texte, Buttons, Forms  
**Gewichte:** 300, 400, 500, 600, 700, 800, 900

```typescript
// Tailwind Config
fontFamily: {
  sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
}
```

**Anwendung:**

```tsx
// Standard (wird automatisch angewendet)
<div className="font-sans">Inhalt</div>

// Explizit für sicheren Fallback
<div className="font-sans">Kritischer Text</div>
```

### Secondary: Playfair Display (Serif)

**Verwendung:** Dekorative Überschriften, Marketing-Hero-Sektionen (optional)  
**Gewichte:** 400, 700

```typescript
// Tailwind Config
fontFamily: {
  serif: ['Playfair Display', 'Georgia', 'serif'],
}
```

**Anwendung:**

```tsx
// Nur für spezielle Marketing-Elemente
<h1 className="font-serif">Elegante Überschrift</h1>
```

### Monospace: SF Mono

**Verwendung:** Code-Blöcke, technische Daten, Debugging  
**Gewichte:** Standard

```typescript
// Tailwind Config
fontFamily: {
  mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'monospace'],
}
```

---

## 🎨 SCHRIFTGRÖSSENSYSTEM (Responsive)

### Überschriften

```tsx
// H1 - Seitentitel
<h1 className="text-2xl sm:text-3xl font-bold text-foreground font-sans">
  Aufträge
</h1>

// H2 - Sektion-Titel
<h2 className="text-xl sm:text-2xl font-semibold text-foreground font-sans">
  Schnellzugriff
</h2>

// H3 - Card-Titel
<h3 className="text-lg font-semibold text-foreground font-sans">
  Details
</h3>

// H4 - Sub-Titel
<h4 className="text-base font-medium text-foreground font-sans">
  Information
</h4>
```

### Body Text

```tsx
// Standard Body
<p className="text-sm sm:text-base text-muted-foreground font-sans">
  Standard-Text für alle Beschreibungen.
</p>

// Large Body
<p className="text-base sm:text-lg text-foreground font-sans">
  Wichtiger, größerer Text.
</p>

// Small Text / Captions
<span className="text-xs sm:text-sm text-muted-foreground font-sans">
  Sub-Text, Labels, Meta-Informationen
</span>
```

### UI-Elemente

```tsx
// Button-Text
<Button className="font-semibold text-sm font-sans">
  Aktion
</Button>

// Input-Labels
<label className="text-sm font-medium text-foreground font-sans">
  Feldname
</label>

// Placeholder
<Input
  placeholder="Eingabe..."
  className="text-sm font-sans placeholder:text-muted-foreground"
/>
```

---

## ✅ PFLICHT-REGELN

### 1. Font-Sans ist Standard

**IMMER** `font-sans` explizit setzen für konsistente Darstellung:

```tsx
// ✅ RICHTIG - Explizites font-sans
<div className="space-y-6 font-sans">
  <h1 className="text-2xl font-bold font-sans">Titel</h1>
  <p className="text-base font-sans">Text</p>
</div>

// ❌ FALSCH - Keine Schriftart-Klasse
<div className="space-y-6">
  <h1 className="text-2xl font-bold">Titel</h1>
</div>
```

### 2. Mobile-First Typography

**IMMER** responsive Schriftgrößen verwenden:

```tsx
// ✅ RICHTIG - Responsive
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans">

// ❌ FALSCH - Fixe Größe
<h1 className="text-4xl font-sans">
```

### 3. Semantische Schriftgewichte

```tsx
// Light (300) - Selten, nur für Design-Akzente
font - light;

// Normal (400) - Standard-Body-Text
font - normal;

// Medium (500) - Labels, Sub-Headings
font - medium;

// Semibold (600) - Wichtige Texte, Card-Titel
font - semibold;

// Bold (700) - Überschriften (H1, H2, H3)
font - bold;

// Extrabold (800) - KPI-Werte, Preise
font - extrabold;
```

### 4. Text-Farben mit Schrift kombinieren

```tsx
// Primary Text (H1-H3, wichtige Elemente)
<h1 className="text-foreground font-bold font-sans">

// Secondary Text (Body, Beschreibungen)
<p className="text-muted-foreground font-normal font-sans">

// Tertiary Text (Sub-Text, Labels)
<span className="text-muted-foreground/60 font-normal font-sans">
```

---

## 🚫 VERBOTEN

### Direct Font Declarations

```tsx
// ❌ FALSCH - Inline Font-Family
<div style={{ fontFamily: 'Arial' }}>

// ❌ FALSCH - Custom Font ohne Config
<div className="font-custom">
```

### Inkonsistente Schriftgrößen

```tsx
// ❌ FALSCH - Nicht-responsive, willkürliche Größe
<h1 className="text-[28px]">

// ❌ FALSCH - Zu viele verschiedene Größen
<p className="text-[13.5px]">
```

### Fehlende Schriftarten-Klasse

```tsx
// ❌ FALSCH - Keine font-sans auf Container
<div className="space-y-4">
  <p>Text ohne explizite Schriftart</p>
</div>
```

---

## 📋 MIGRATION CHECKLIST

Für jede Komponente/Seite:

- [ ] `font-sans` auf Root-Container gesetzt
- [ ] Alle Überschriften haben `font-sans`
- [ ] Alle Body-Texte haben `font-sans`
- [ ] Responsive Schriftgrößen (`text-sm sm:text-base`)
- [ ] Semantische Gewichte (`font-bold`, `font-semibold`, etc.)
- [ ] Keine Direct Font Declarations
- [ ] Keine Custom Font-Sizes außerhalb des Systems

---

## 🛠️ TOOLS & TESTING

### Visual Check

```bash
# Suche nach fehlenden font-sans
grep -r "className=" src/ | grep -v "font-sans"

# Suche nach Direct Font Declarations
grep -r "fontFamily:" src/
```

### Test-Cases

1. Desktop (1920px) - Alle Texte lesbar
2. Tablet (768px) - Responsive Schriftgrößen aktiv
3. Mobile (375px) - Touch-optimiert, kein Text-Overflow

---

## 📊 SYSTEM-STATUS

| Komponente         | Status | Font-Sans | Responsive |
| ------------------ | ------ | --------- | ---------- |
| EmptyState         | ✅     | ✅        | ✅         |
| StandardPageLayout | ✅     | ✅        | ✅         |
| MetricCard         | ✅     | ✅        | ✅         |
| PageHeaderWithKPIs | ✅     | ✅        | ✅         |
| Auftraege.tsx      | ✅     | ✅        | ✅         |

---

**Erstellt am:** 2025-01-26  
**Version:** V26.0  
**Status:** ✅ Production Ready
