# TYPOGRAPHY-STANDARDS V18.5.1

> **KRITISCH:** Diese Standards sind ZWINGEND für ALLE Text-basierten Aufgaben!

---

## 🎯 SOFORTIGE ERINNERUNG (VOR JEDER AUFGABE!)

**BEVOR DU IRGENDWELCHE TEXTE/WERTE SCHREIBST:**

1. ✅ Prüfe `src/index.css` (Zeilen 1-500)
2. ✅ Verwende NIEMALS `font-size: 16px` oder `text-[16px]`
3. ✅ Verwende IMMER Typography-Klassen (`text-heading-2`, `text-body`)
4. ✅ Verwende IMMER Semantic Tokens (`text-foreground`, `text-muted-foreground`)
5. ✅ Prüfe Kontrast-Regeln (Helle BG → text-foreground, Dunkle BG → text-primary)

---

## 📐 TYPOGRAFIE-HIERARCHIE (ZWINGEND!)

### Headlines (Überschriften)

```typescript
// ✅ RICHTIG - IMMER SO!
<h1 className="text-heading-1">Hauptüberschrift</h1>
<h2 className="text-heading-2">Unterüberschrift</h2>
<h3 className="text-heading-3">Abschnitt</h3>

// ❌ FALSCH - NIEMALS SO!
<h1 className="text-4xl">Hauptüberschrift</h1>
<h2 style={{ fontSize: '24px' }}>Unterüberschrift</h2>
```

### Schrift-Klassen (Vollständige Liste)

```css
/* HERO & DISPLAY (Extra große Texte) */
.text-display     → 48-64px (Hero-Titel, Landingpages)
  - font-size: var(--font-5xl)
  - line-height: 1.1
  - font-weight: 800

/* HEADLINES (Überschriften) */
.text-heading-1   → 36-48px (H1, Seitentitel)
  - font-size: var(--font-4xl)
  - line-height: 1.2
  - font-weight: 700

.text-heading-2   → 30-36px (H2, Sektionen)
  - font-size: var(--font-3xl)
  - line-height: 1.25
  - font-weight: 700

.text-heading-3   → 24-30px (H3, Untertitel)
  - font-size: var(--font-2xl)
  - line-height: 1.3
  - font-weight: 600

/* BODY TEXT (Fließtext) */
.text-body-lg     → 18-20px (Große Fließtexte, Intros)
  - font-size: var(--font-lg)
  - line-height: 1.6

.text-body        → 16-18px (Standard-Body, Paragraphen)
  - font-size: var(--font-base)
  - line-height: 1.625

.text-body-sm     → 14-16px (Kleinere Texte, Beschreibungen)
  - font-size: var(--font-sm)
  - line-height: 1.5

/* SMALL TEXT (Labels, Captions) */
.text-caption     → 12-14px (Captions, Meta-Infos)
  - font-size: var(--font-xs)
  - line-height: 1.4

.text-label       → 12-14px (Form-Labels, Tags)
  - font-size: var(--font-xs)
  - font-weight: 500
  - letter-spacing: 0.025em
```

---

## 🎨 FARB-SYSTEM (SEMANTIC TOKENS)

### Text-Farben (NIEMALS Direct Colors!)

```typescript
// ✅ RICHTIG - Semantic Tokens
text-foreground        → Haupt-Text (#323D5E)
text-muted-foreground  → Sekundär-Text (Grau)
text-primary           → Akzent-Text (#EADEBD)
text-secondary         → Auf dunklen Buttons

// ❌ FALSCH - Direct Colors
text-white            → VERBOTEN (außer auf dunklen BG)
text-black            → VERBOTEN (verwende text-foreground)
text-[#323D5E]        → VERBOTEN (verwende text-foreground)
text-gray-900         → VERBOTEN (verwende text-foreground)
```

### Kontrast-Regeln (WCAG AA)

```typescript
// REGEL 1: Helle Hintergründe → Dunkler Text
bg-background (Weiß)     → text-foreground (#323D5E)
bg-card (Weiß)           → text-foreground (#323D5E)
bg-primary (#EADEBD)     → text-foreground (#323D5E)

// REGEL 2: Dunkle Hintergründe → Heller Text
bg-secondary (#323D5E)   → text-primary (#EADEBD)
bg-destructive (Rot)     → text-white
bg-status-success (Grün) → text-white

// REGEL 3: Hover auf hellen Hintergründen
bg-primary hover → hover:text-foreground (NIEMALS hover:text-white!)
```

---

## 📏 TEXT-UMBRUCH-SYSTEM (Deutsch-optimiert)

### Automatische Silbentrennung (DIN 5008)

```css
/* SYSTEMWEIT AKTIV (body-Tag) */
hyphens: auto;
hyphenate-limit-chars: 6 3 3; /* Min. 6 Zeichen, 3 vor/nach */
word-break: normal; /* Wortgrenzen respektieren */
overflow-wrap: break-word; /* Lange Wörter umbrechen */
```

### Spezialklassen für Umbrüche

```typescript
// ✅ Hero-Texte (keine Silbentrennung)
<h1 className="hero-text-no-hyphens">
  Willkommen bei MyDispatch
</h1>

// ✅ Marketing-Texte (sanfte Silbentrennung)
<p className="marketing-text-soft-hyphens">
  Ihre professionelle Taxizentrale-Software
</p>

// ✅ Fließtext (Standard-Silbentrennung)
<p className="body-text-hyphens">
  Verwalten Sie Ihre Aufträge, Fahrer und Fahrzeuge...
</p>

// ✅ Keine Umbrüche (wichtige Phrasen)
<span className="text-nowrap-important">
  +49 (0) 123 456789
</span>

// ✅ Balance (kurze Texte gleichmäßig verteilen)
<h2 className="text-balance">
  Ihre Vorteile auf einen Blick
</h2>

// ✅ Pretty (Witwen/Waisen vermeiden)
<p className="text-pretty">
  Langer Absatz mit optimaler Zeilenverteilung...
</p>
```

---

## 📱 RESPONSIVE TYPOGRAPHY

### Fluid Typography (automatisch responsiv)

```typescript
// ✅ AUTOMATISCH RESPONSIVE (clamp-basiert)
// Keine Breakpoints nötig!

text-heading-1 → 36px (Mobile) bis 48px (Desktop)
text-heading-2 → 30px (Mobile) bis 36px (Desktop)
text-body      → 16px (Mobile) bis 18px (Desktop)

// ❌ FALSCH - Manuelle Breakpoints
<h1 className="text-2xl sm:text-3xl md:text-4xl">
// ✅ RICHTIG - Fluid Typography
<h1 className="text-heading-1">
```

### Mobile-Optimierungen

```typescript
// Kleinere Schrift auf Mobile (falls nötig)
<p className="text-body-sm lg:text-body">
  Text wird auf Desktop größer
</p>

// Heading-Größe anpassen
<h2 className="text-heading-3 lg:text-heading-2">
  Responsive Überschrift
</h2>
```

---

## 🎯 KOMPONENTEN-BEISPIELE

### MetricCard (KPI)

```typescript
// ✅ KORREKTE TYPOGRAFIE
<MetricCard
  title="Aktive Fahrer" // text-caption (12-14px)
  value={12}            // text-3xl (30-36px)
  subtitle="im Einsatz" // text-caption (12-14px)
/>

// IMPLEMENTIERUNG (MetricCard.tsx)
<p className="text-xs font-medium text-muted-foreground uppercase">
  {title} // text-xs = text-caption
</p>
<p className="text-3xl font-bold text-foreground">
  {value}
</p>
```

### DashboardSection

```typescript
// ✅ KORREKTE TYPOGRAFIE
<DashboardSection
  title="Fahrerliste" // text-lg (18-20px)
/>

// IMPLEMENTIERUNG
<h3 className="text-lg font-semibold text-foreground">
  {title}
</h3>
```

### StandardTableTemplate

```typescript
// ✅ KORREKTE TYPOGRAFIE
<TableHeader>
  <TableRow>
    <TableHead className="text-xs font-medium">
      Name // text-xs = 12-14px
    </TableHead>
  </TableRow>
</TableHeader>
<TableBody>
  <TableCell className="text-sm text-foreground">
    Max Mustermann // text-sm = 14-16px
  </TableCell>
</TableBody>
```

---

## ✅ CHECKLISTE (VOR COMMIT!)

```typescript
- [ ] KEINE font-size: XXpx verwendet
- [ ] KEINE text-[XXpx] Klassen
- [ ] KEINE text-white auf hellen Backgrounds
- [ ] KEINE text-black (immer text-foreground)
- [ ] KEINE Direct Colors (#fff, rgb())
- [ ] Typography-Klassen verwendet (text-heading-X, text-body)
- [ ] Semantic Tokens verwendet (text-foreground, text-muted-foreground)
- [ ] Kontrast-Regeln beachtet (WCAG AA)
- [ ] Text-Umbruch-Klassen wo nötig (hero-text-no-hyphens, etc.)
- [ ] Responsive mit Fluid Typography (automatisch)
```

---

## 🚨 HÄUFIGE FEHLER (NIEMALS MACHEN!)

### ❌ FEHLER 1: Direct Font-Size

```typescript
// ❌ FALSCH
<h1 style={{ fontSize: '24px' }}>Titel</h1>
<h1 className="text-[24px]">Titel</h1>
<h1 className="text-2xl">Titel</h1>

// ✅ RICHTIG
<h1 className="text-heading-1">Titel</h1>
```

### ❌ FEHLER 2: Direct Colors

```typescript
// ❌ FALSCH
<p className="text-white">Text</p>
<p className="text-black">Text</p>
<p className="text-[#323D5E]">Text</p>

// ✅ RICHTIG
<p className="text-foreground">Text</p>
<p className="text-muted-foreground">Text</p>
```

### ❌ FEHLER 3: Falsche Hover-Farben

```typescript
// ❌ FALSCH (auf hellem Hintergrund)
<Button className="bg-primary hover:text-white">

// ✅ RICHTIG
<Button className="bg-primary hover:text-foreground">
```

### ❌ FEHLER 4: Manuelle Responsive Breakpoints

```typescript
// ❌ FALSCH (unnötig komplex)
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">

// ✅ RICHTIG (automatisch responsiv)
<h1 className="text-heading-1">
```

---

## 📚 REFERENZEN

- `src/index.css` (Zeilen 1-500) → Typografie-Definitionen
- `tailwind.config.ts` → Farb-System
- `src/components/dashboard/MetricCard.tsx` → Beispiel-Implementierung
- `docs/MYDISPATCH_SYSTEM_MASTER_V18.5.1.md` → Vollständige Dokumentation

---

**MERKE:** Schriftbild-Konsistenz ist KRITISCH für professionelles UI!  
**REGEL:** IMMER Typography-Klassen, NIEMALS Direct Sizes/Colors!

---

**END OF TYPOGRAPHY STANDARDS**
