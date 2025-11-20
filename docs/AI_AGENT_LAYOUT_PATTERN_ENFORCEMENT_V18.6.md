# 🤖 AI AGENT - LAYOUT PATTERN ENFORCEMENT V18.6

**Zweck:** Dieses Dokument definiert das Verhalten des AI Agents bei Layout-Anforderungen.

---

## 🔒 ABSOLUTE REGELN

### 1. Layout Pattern System ist PFLICHT

**Bei JEDER neuen Page/Component:**

Der AI Agent MUSS das Layout Pattern System aus `docs/LAYOUT_PATTERN_SYSTEM_V18.6.md` nutzen.

**NIEMALS:**

- ❌ Hardcoded spacing values (`py-20`, `mt-10`, `gap-5`)
- ❌ Inkonsistente Abstände
- ❌ Custom Grid/Flex ohne Layout Components
- ❌ Inline Styles für Spacing

**IMMER:**

- ✅ `Section` Component für Sections
- ✅ `Container` Component für Content-Bereiche
- ✅ `Grid` Component für Layouts
- ✅ `Flex` Component für flexible Layouts
- ✅ `Stack` Component für Stacks
- ✅ Design System Spacing

---

## 🚦 WORKFLOW

### Phase 1: Anforderung analysieren

**User fragt nach neuer Page/Section:**

```
User: "Erstelle eine Features-Seite"
```

**AI Agent denkt:**

1. Welche Sections sind nötig? (Hero, Features Grid, CTA)
2. Welche Layout Components brauche ich? (Section, Container, Grid)
3. Welches Spacing ist passend? (xl für Hero, lg für Content)
4. Welche responsive Breakpoints? (1 col mobile, 2 tablet, 3 desktop)

### Phase 2: Implementation mit Layout Components

**AI Agent schreibt:**

```tsx
<Section spacing="xl" background="gradient">
  <Container size="lg">
    <Stack spacing="xl" align="center" className="text-center">
      <h1 className="text-5xl font-bold">Features</h1>
      <p className="text-xl">Beschreibung</p>
    </Stack>
  </Container>
</Section>

<Section spacing="xl" background="white">
  <Container>
    <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
      {/* Feature Cards */}
    </Grid>
  </Container>
</Section>
```

### Phase 3: Self-Check

**AI Agent prüft:**

- [ ] Alle Sections nutzen `Section` Component
- [ ] Alle Grids nutzen `Grid` Component
- [ ] Keine hardcoded spacing values
- [ ] Responsive Breakpoints korrekt
- [ ] Semantic HTML

---

## 🛡️ ENFORCEMENT BEI FEHLERN

### Szenario 1: User verwendet hardcoded Spacing

**User-Code:**

```tsx
<div className="py-20 mt-10">
  <div className="gap-5">
```

**AI Agent Antwort:**

```
⚠️ Layout Pattern Violation!

Der Code verwendet hardcoded spacing values.
Das Layout Pattern System V18.6 schreibt vor:

✅ RICHTIG:
<Section spacing="xl">
  <Grid gap="lg">

Soll ich den Code korrigieren?
```

### Szenario 2: User fragt nach Custom Layout

**User:**

```
"Ich brauche ein Custom Grid mit 5 Spalten und 25px Gap"
```

**AI Agent Antwort:**

```
Das Layout Pattern System unterstützt 1-6 und 12 Spalten.
Für 5 Spalten:

<Grid cols={{ default: 1, md: 2, lg: 5 }} gap="lg">

Die nächste Standard-Gap zu 25px ist "lg" (32px).
Das sorgt für Konsistenz im System.

Wenn du exakt 25px brauchst, können wir das diskutieren.
Aber ich empfehle stark, bei 32px zu bleiben.
```

---

## 📋 TRIPLE-CHECK ENFORCEMENT

### Pre-Implementation Check

**BEVOR Code geschrieben wird:**

```
🔍 LAYOUT PATTERN CHECK:

1. Section Structure:
   □ Nutze ich Section Component?
   □ Spacing passend? (sm/md/lg/xl/2xl)
   □ Background korrekt? (white/gray/gradient)

2. Container:
   □ Nutze ich Container Component?
   □ Size passend? (sm/md/lg/xl/2xl/full)

3. Grid/Flex:
   □ Nutze ich Grid/Flex Component?
   □ Responsive Breakpoints definiert?
   □ Gap aus Design System?

4. No Violations:
   □ Keine hardcoded spacing?
   □ Keine inline styles für spacing?
   □ Keine Custom Grid/Flex ohne Components?

✅ ALLE CHECKS BESTANDEN → Implementation starten
❌ CHECKS NICHT BESTANDEN → Pattern korrigieren
```

### Post-Implementation Check

**NACHDEM Code geschrieben wurde:**

```
🔍 LAYOUT PATTERN VERIFICATION:

1. Code Review:
   □ Alle Sections nutzen Section?
   □ Alle Grids nutzen Grid?
   □ Alle Flex nutzen Flex?
   □ Alle Stacks nutzen Stack?

2. Spacing Review:
   □ Keine hardcoded values? (py-20, mt-10, gap-5)
   □ Nur Design System Spacing?

3. Responsive Review:
   □ Mobile-first?
   □ Breakpoints korrekt?
   □ Touch-friendly?

✅ ALLE VERIFICATIONS BESTANDEN → Code freigeben
❌ VERIFICATIONS NICHT BESTANDEN → Korrigieren
```

---

## 🎯 EXAMPLES: DO'S AND DON'TS

### ❌ WRONG - Hardcoded Spacing

```tsx
// ❌ NIEMALS SO!
<div className="py-20 px-10 mt-10 mb-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    <div className="p-6">Card</div>
  </div>
</div>
```

**Problem:**

- Hardcoded spacing (py-20, px-10, mt-10, mb-8, gap-5)
- Keine Layout Components
- Inkonsistent

### ✅ CORRECT - Layout Components

```tsx
// ✅ IMMER SO!
<Section spacing="xl">
  <Container size="xl">
    <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
      <Card>Card</Card>
    </Grid>
  </Container>
</Section>
```

**Warum besser:**

- Layout Components nutzen
- Design System Spacing
- Konsistent
- Wartbar

---

## 🚨 EMERGENCY OVERRIDE

**Nur in Ausnahmefällen:**

Wenn das Layout Pattern System technisch NICHT möglich ist:

1. **User informieren:**

```
⚠️ Layout Pattern Violation Notice:

In diesem speziellen Fall kann ich das Layout Pattern System
nicht 100% nutzen, weil [Grund].

Ich verwende stattdessen [Alternative], um so nah wie möglich
am Standard zu bleiben.

Alternative:
[Code-Beispiel]

Ist das okay?
```

2. **Dokumentieren:**

```tsx
/* ==================================================================================
   LAYOUT PATTERN EXCEPTION
   ==================================================================================
   GRUND: [Warum nicht möglich]
   DATUM: 2025-10-28
   APPROVED BY: Pascal
   ================================================================================== */

// Custom Layout Code...
```

---

## 📚 TRAINING EXAMPLES

### Example 1: Feature Page

**User Request:**

```
"Erstelle eine Seite mit Features in 3 Spalten"
```

**AI Agent Response:**

```tsx
<Section spacing="xl" background="white">
  <Container>
    <Stack spacing="lg" align="center" className="text-center mb-12">
      <h2 className="text-4xl font-bold">Features</h2>
      <p className="text-lg text-slate-600 max-w-2xl">Alle Features im Überblick</p>
    </Stack>

    <Grid cols={{ default: 1, md: 2, lg: 3 }} gap="lg">
      {FEATURES.map((feature) => (
        <FeatureCard key={feature.id} {...feature} />
      ))}
    </Grid>
  </Container>
</Section>
```

**AI Agent erklärt:**

```
✅ Layout Pattern System korrekt angewendet:

- Section mit spacing="xl" (Standard für Content-Sections)
- Container für max-width
- Stack für vertikale Ausrichtung des Headers
- Grid mit responsive Breakpoints (1/2/3 Spalten)
- gap="lg" (32px) aus Design System
```

---

## ✅ FINAL CHECKLIST

**AI Agent nutzt diese Checklist vor jedem Commit:**

### Layout Components

- [ ] Alle Sections nutzen `Section` Component
- [ ] Alle Content-Bereiche nutzen `Container`
- [ ] Alle Grids nutzen `Grid` Component
- [ ] Alle Flex-Layouts nutzen `Flex` Component
- [ ] Alle Stacks nutzen `Stack` Component

### Spacing

- [ ] KEINE hardcoded spacing values
- [ ] NUR Design System Spacing (sm/md/lg/xl/2xl)
- [ ] Konsistente Abstände überall
- [ ] Responsive Spacing

### HTML Structure

- [ ] Semantic HTML Elements
- [ ] Proper Heading Hierarchy
- [ ] Accessibility-konform

### Responsive

- [ ] Mobile-first Approach
- [ ] Breakpoints korrekt (default/sm/md/lg/xl)
- [ ] Touch-friendly (min 44x44px)

---

**LAST UPDATE:** 2025-10-28  
**STATUS:** 🔴 CRITICAL - MUST FOLLOW  
**PRIORITY:** HIGHEST
