# 🎯 HERO SYSTEM V26.0 - VERBINDLICHE STANDARDISIERUNG

**STATUS:** ✅ MANDATORY - AB SOFORT SYSTEMWEIT VERPFLICHTEND  
**VERSION:** V26.0  
**LAST UPDATE:** 2025-01-26

---

## ⚠️ ABSOLUT VERBINDLICHE REGELN

### REGEL #1: EINHEITLICHE HERO-GRÖSSE (UNVERÄNDERLICH!)

**ALLE Hero-Sections verwenden AUSNAHMSLOS diese exakte Größe:**

```tsx
<section className="relative pt-24 md:pt-32 pb-48 md:pb-56 overflow-hidden">
```

**NIEMALS ABWEICHEN!**

- ✅ `pt-24 md:pt-32` - Top Padding (fixiert)
- ✅ `pb-48 md:pb-56` - Bottom Padding (fixiert)
- ✅ `overflow-hidden` - Für Orbs (fixiert)
- ✅ `relative` - Für absolute Positionierung (fixiert)

**VERBOTEN:**

- ❌ `min-h-screen` oder andere dynamische Höhen
- ❌ `flex items-center justify-center` (macht Höhe variabel)
- ❌ Padding-Anpassungen für Content
- ❌ Jegliche Abweichung von diesen Werten

---

### REGEL #2: EINHEITLICHER BACKGROUND (UNVERÄNDERLICH!)

**ALLE Hero-Sections verwenden AUSNAHMSLOS:**

```tsx
import { HeroBackgroundOrbs } from "@/components/hero/HeroBackgroundOrbs";

<section className="relative pt-24 md:pt-32 pb-48 md:pb-56 overflow-hidden">
  <HeroBackgroundOrbs />

  {/* Content mit relative z-10 */}
  <div className="relative z-10">{/* ... */}</div>
</section>;
```

**Background-Komponente:**

- ✅ Gradient: `v26-gradient-hero-primary`
- ✅ Pattern Overlays (Grid, Dots, Diagonals)
- ✅ Animierte Glow Orbs (3 Schichten)
- ✅ NIEMALS inline-styles für Background

**VERBOTEN:**

- ❌ Eigene Background-Gradients
- ❌ Andere Background-Komponenten
- ❌ Modifikation der Orbs
- ❌ Abweichende Farben

---

### REGEL #3: CONTENT PASST SICH AN - NICHT UMGEKEHRT!

**KRITISCH:** Die Hero-Größe ist FIXIERT. Alle Inhalte müssen sich dieser Größe anpassen!

#### Content-Anpassungsstrategien:

**Text-Content:**

```tsx
// ✅ RICHTIG - Text passt sich an
<h1
  className="font-sans text-5xl md:text-6xl font-bold tracking-tight mb-6"
  style={{
    color: UNIFIED_DESIGN_TOKENS.colors.beige,
    textWrap: 'balance'
  }}
>
  {title}
</h1>

<p
  className="font-sans text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
  style={{
    color: UNIFIED_DESIGN_TOKENS.colors.weiss,
    textWrap: 'pretty'
  }}
>
  {subtitle}
</p>
```

**Spacing innerhalb Hero:**

```tsx
// ✅ RICHTIG - Container mit festem Spacing
<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
  <div className="text-center mb-10 md:mb-14">{/* Content */}</div>
</div>
```

**Komponenten in Hero:**

- ✅ Badges: Kompakt halten
- ✅ Buttons: Standard-Größen
- ✅ Toggle/Widgets: Innerhalb `mt-4` platzieren
- ✅ Graphics: Max-width limitieren

**VERBOTEN:**

- ❌ Hero-Größe für Content ändern
- ❌ Zusätzliches Padding für mehr Platz
- ❌ Content overflow außerhalb Hero
- ❌ Negative Margins um Hero-Größe zu "erweitern"

---

### REGEL #4: NEGATIVE MARGINS FÜR OVERLAPPING SECTIONS

**Pattern:** Cards/Sections die in Hero "eingreifen"

```tsx
{
  /* Hero Section */
}
<section className="relative pt-24 md:pt-32 pb-48 md:pb-56 overflow-hidden">
  <HeroBackgroundOrbs />
  {/* Content */}
</section>;

{
  /* Overlapping Section - Cards ragen in Hero */
}
<section
  className="-mt-32 md:-mt-40 py-20 md:py-24"
  style={{ backgroundColor: UNIFIED_DESIGN_TOKENS.colors.canvas }}
>
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 md:items-start">
      {/* Cards mit translate für unterschiedliche Höhen */}
      <div className="md:-translate-y-16">{/* Highlighted Card - ragt am weitesten */}</div>
    </div>
  </div>
</section>;
```

**Berechnungslogik:**

- Hero Bottom Padding: `pb-48 md:pb-56`
- Negative Margin: `-mt-32 md:-mt-40`
- Differenz = visueller Eingriff: `16/16 (mobile/desktop)`
- Highlighted Card: zusätzlich `-translate-y-16` → **doppelt so weit**

**Vorgabe:** Alle 3 Cards ragen in Hero, mittlere (highlighted) am weitesten!

---

## 📋 IMPLEMENTIERUNGS-CHECKLIST

### Beim Erstellen eines neuen Heroes:

- [ ] Exakte Größe verwendet: `pt-24 md:pt-32 pb-48 md:pb-56`
- [ ] `HeroBackgroundOrbs` importiert und eingebunden
- [ ] Content mit `relative z-10` wrapper
- [ ] Container mit Standard-Padding: `px-4 sm:px-6 lg:px-8`
- [ ] Text mit `textWrap: 'balance'` / `'pretty'`
- [ ] Farben aus `UNIFIED_DESIGN_TOKENS`
- [ ] Responsive Typography (text-5xl md:text-6xl)
- [ ] Keine zusätzlichen Padding-Anpassungen
- [ ] Overlapping Section korrekt berechnet (falls nötig)

### Beim Anpassen eines existierenden Heroes:

- [ ] **NIEMALS** Hero-Größe ändern!
- [ ] Content innerhalb Hero anpassen
- [ ] Text kürzen falls zu lang
- [ ] Komponenten-Größen reduzieren falls nötig
- [ ] Spacing optimieren (`mb-6`, `mb-10` etc.)
- [ ] **NIEMALS** Hero erweitern für mehr Platz!

---

## 🎨 REFERENZ-IMPLEMENTIERUNGEN

### Pricing Hero (V26PricingHero.tsx) ✅ PERFECT REFERENCE

```tsx
export function V26PricingHero({ title, subtitle, children }: V26PricingHeroProps) {
  return (
    <section className="relative pt-24 md:pt-32 pb-48 md:pb-56 overflow-hidden">
      {/* Background with Orbs */}
      <HeroBackgroundOrbs />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <h1
            className="font-sans text-5xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in"
            style={{
              color: UNIFIED_DESIGN_TOKENS.colors.weiss,
              textWrap: "balance",
              textShadow: "0 2px 20px rgba(0,0,0,0.2)",
            }}
          >
            {title}
          </h1>
          <p
            className="font-sans text-lg md:text-xl font-normal leading-relaxed max-w-3xl mx-auto mb-12 text-center animate-fade-in"
            style={{
              color: UNIFIED_DESIGN_TOKENS.colors.weiss,
              textWrap: "pretty",
              animationDelay: "0.1s",
              textShadow: "0 1px 10px rgba(0,0,0,0.3)",
            }}
          >
            {subtitle}
          </p>

          {children && (
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

**Verwendung:**

```tsx
<V26PricingHero
  title="Klar. Fair. Zukunftssicher."
  subtitle="Entdecken Sie unsere flexiblen Tarife – entwickelt für moderne Taxi- und Mietwagenunternehmen."
>
  <div className="mt-4">
    <V26BillingToggle
      billingPeriod={billingPeriod}
      onToggle={setBillingPeriod}
      discountText="-20%"
    />
  </div>
</V26PricingHero>
```

---

## 🚫 ANTI-PATTERNS (NIEMALS!)

### ❌ Variable Hero-Höhen

```tsx
// ❌ FALSCH - dynamische Höhe
<section className="relative min-h-screen flex items-center">

// ❌ FALSCH - andere Padding-Werte
<section className="relative pt-20 pb-32">

// ✅ RICHTIG - fixierte Standardgröße
<section className="relative pt-24 md:pt-32 pb-48 md:pb-56 overflow-hidden">
```

### ❌ Custom Backgrounds

```tsx
// ❌ FALSCH - eigener Background
<section className="relative bg-gradient-to-br from-blue-900 to-blue-700">

// ❌ FALSCH - inline-styles
<section style={{ background: 'linear-gradient(...)' }}>

// ✅ RICHTIG - Standard Background-Komponente
<section className="relative pt-24 md:pt-32 pb-48 md:pb-56 overflow-hidden">
  <HeroBackgroundOrbs />
</section>
```

### ❌ Hero-Größe für Content anpassen

```tsx
// ❌ FALSCH - Hero für mehr Content erweitern
<section className="relative pt-32 pb-64"> {/* pb-64 ist zu viel! */}

// ❌ FALSCH - zusätzliches Padding für Buttons
<div className="pb-20"> {/* Zusätzlicher Space */}
  <Button />
</div>

// ✅ RICHTIG - Content optimieren
<div className="mb-12"> {/* Standard mb-12 */}
  <Button />
</div>
```

---

## 📖 BEGRÜNDUNG DES SYSTEMS

### Warum fixierte Hero-Größe?

1. **Visuelle Konsistenz:** Alle Pages haben identischen "First Impression"
2. **Entwickler-Effizienz:** Keine Diskussionen über Hero-Größe
3. **Maintenance:** Einmal definiert, immer gleich
4. **Performance:** Keine Layout-Shifts
5. **Design-Integrität:** Background-Orbs funktionieren perfekt bei fixer Größe

### Warum Content anpassen statt Hero?

1. **System-Integrität:** Hero ist Teil der Brand-Identity
2. **Skalierbarkeit:** Neuer Content muss in System passen
3. **Disziplin:** Zwingt zu prägnanten Headlines & Subtitles
4. **Responsive Design:** Gleiche Größe = gleiches Verhalten
5. **Code-Qualität:** Keine Sonder-Cases

### Vorteile gegenüber flexiblen Heroes:

| Aspekt        | Flexibel (❌)         | Fixiert (✅)        |
| ------------- | --------------------- | ------------------- |
| Konsistenz    | Variiert pro Page     | Immer identisch     |
| Wartung       | Jedes Hero einzeln    | Zentrale Komponente |
| Performance   | Layout-Shifts möglich | Stabil              |
| Design-Review | Jedes Mal diskutieren | Einmal definiert    |
| Onboarding    | "Wie groß machen?"    | "Verwende Standard" |
| Mobile        | Unterschiedlich       | Einheitlich         |

---

## 🔄 MIGRATION BESTEHENDER HEROES

### Schritt 1: Hero-Größe standardisieren

```tsx
// VORHER
<section className="relative min-h-[700px] md:min-h-screen">

// NACHHER
<section className="relative pt-24 md:pt-32 pb-48 md:pb-56 overflow-hidden">
```

### Schritt 2: Background vereinheitlichen

```tsx
// VORHER
<div className="absolute inset-0 bg-gradient-to-br from-[#323D5E] to-[#4A5A7F]">

// NACHHER
<HeroBackgroundOrbs />
```

### Schritt 3: Content anpassen

```tsx
// Falls Text zu lang → kürzen
// Falls Components zu groß → verkleinern
// Falls Spacing zu groß → reduzieren

// Text-Längen-Richtlinien:
// - Headline: max. 60 Zeichen
// - Subtitle: max. 120 Zeichen
// - Description: max. 200 Zeichen (falls verwendet)
```

---

## ✅ FINALE CHECKLISTE

Vor JEDEM Commit mit Hero-Änderungen:

- [ ] Hero hat exakt `pt-24 md:pt-32 pb-48 md:pb-56`
- [ ] `HeroBackgroundOrbs` wird verwendet
- [ ] Keine custom Background-Styles
- [ ] Content hat `relative z-10`
- [ ] Text verwendet Design-Tokens
- [ ] Responsive Typography korrekt
- [ ] Keine Layout-Shifts beim Resize
- [ ] Mobile & Desktop getestet
- [ ] Overlapping Sections (falls vorhanden) korrekt berechnet
- [ ] Dokumentation aktualisiert (diese Datei)

---

## 📚 RELATED DOCUMENTATION

- `docs/MYDISPATCH_DESIGN_SYSTEM_FINAL_V26.0.md` - Hero Design System Details
- `docs/LESSONS_LEARNED.md` - Hero-spezifische Learnings
- `docs/V26_COMPONENT_LIBRARY.md` - V26 Components Übersicht
- `docs/PRICING_DESIGN_SYSTEM_V26.0.md` - Pricing-spezifische Hero-Implementierung

---

**REMEMBER:** Die Hero-Größe ist SAKROSANKT! Content muss sich anpassen, NIEMALS umgekehrt!

---

**LAST UPDATE:** 2025-01-26  
**AUTHOR:** AI Agent  
**STATUS:** ✅ PRODUCTION-READY & MANDATORY
