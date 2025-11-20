# TEXT ALIGNMENT SYSTEM V26.0

> **Erstellt:** 2025-01-26  
> **Zweck:** Verbindliche Regeln für Text-Ausrichtung in Marketing-Seiten  
> **Status:** ✅ AKTIV

---

## 🎯 CORE PRINCIPLE

**Text-Alignment folgt Container-Zentrierung:**

- Horizontal zentrierte Container (`mx-auto`) → `text-center`
- Full-width Container → `text-left` (Default)
- Asymmetrische Layouts → Explizit definieren

---

## 📐 STANDARD PATTERNS

### Pattern 1: Zentrierte Hero/Section Beschreibung

**Use Case:** Haupt-Beschreibungstexte unter Titeln

```tsx
<p className="max-w-3xl mx-auto text-center text-lg text-muted-foreground">
  Ihre Beschreibung hier. Optimale Lesbarkeit durch begrenzte Zeilenbreite und zentrale Ausrichtung.
</p>
```

**Spezifikation:**

- `max-w-3xl` (768px) für Standard-Beschreibungen
- `mx-auto` für horizontale Zentrierung
- `text-center` für Text-Alignment (PFLICHT!)
- `text-lg` für Hero-Sections
- `text-base` für Sub-Sections

---

### Pattern 2: Kompakte zentrierte Texte

**Use Case:** Kurze Statements, Taglines

```tsx
<p className="max-w-2xl mx-auto text-center text-base text-muted-foreground">
  Kürzerer, prägnanter Text.
</p>
```

**Spezifikation:**

- `max-w-2xl` (672px) für kürzere Texte
- Sonst identisch zu Pattern 1

---

### Pattern 3: Linksbündige Content-Texte

**Use Case:** Fließtexte in Cards, Listen, Sidebar

```tsx
<p className="text-base text-muted-foreground">
  Längerer Fließtext ohne max-width Begrenzung. Linksbündig für optimale Lesbarkeit bei mehrzeiligen
  Absätzen.
</p>
```

**Spezifikation:**

- KEIN `mx-auto` → KEIN `text-center`
- Standard `text-left` (implizit)

---

### Pattern 4: Grid/Flex Content

**Use Case:** Feature-Cards, Icon-Boxen

```tsx
<div className="grid md:grid-cols-3 gap-8">
  <div className="text-center">
    <Icon className="mx-auto mb-4" />
    <h3 className="text-lg font-semibold mb-2">Feature Titel</h3>
    <p className="text-sm text-muted-foreground">Beschreibung zentriert unter Icon</p>
  </div>
</div>
```

**Spezifikation:**

- Container: `text-center` wenn Icon/Inhalt zentriert
- Einzelne Elemente erben Alignment

---

## ⚠️ ANTI-PATTERNS

### ❌ Anti-Pattern 1: Container zentriert, Text linksbündig

```tsx
// FALSCH - Visuell unharmonisch
<p className="max-w-3xl mx-auto text-lg">Text ist linksbündig in zentriertem Container</p>
```

### ❌ Anti-Pattern 2: Text zentriert ohne Container-Begrenzung

```tsx
// FALSCH - Zu breite Zeilen, schlechte Lesbarkeit
<p className="text-center text-lg">
  Sehr langer Text der über die gesamte Bildschirmbreite zentriert wird und dadurch unleserlich
  wird...
</p>
```

### ❌ Anti-Pattern 3: Übermäßige Zentrierung

```tsx
// FALSCH - Fließtext sollte linksbündig sein
<Card>
  <CardContent className="text-center">
    <p>Langer Absatz mit mehreren Zeilen...</p>
  </CardContent>
</Card>
```

---

## 📋 DECISION TREE

**Wann `text-center`?**

```
Ist Container horizontal zentriert? (mx-auto)
  └─ JA
      └─ Ist Text < 3 Zeilen?
          └─ JA → text-center ✅
          └─ NEIN
              └─ Ist es eine Hero/Section-Beschreibung?
                  └─ JA → text-center ✅
                  └─ NEIN → text-left ✅
  └─ NEIN → text-left (Default) ✅
```

---

## 🎨 BEISPIELE AUS CODEBASE

### ✅ KORREKT: Pricing Hero

```tsx
// src/pages/Pricing.tsx Line 308
<p className="max-w-3xl mx-auto text-center text-lg text-muted-foreground leading-relaxed">
  Starten Sie noch heute mit MyDispatch und optimieren Sie Ihr Taxi- oder Mietwagenunternehmen...
</p>
```

### ✅ KORREKT: Contact Hero

```tsx
// src/pages/Contact.tsx Line 108
<p className="max-w-3xl mx-auto text-center text-lg text-muted-foreground leading-relaxed">
  Unser Support-Team steht Ihnen bei Fragen zur Verfügung.
</p>
```

### ✅ KORREKT: Feature Card (linksbündig)

```tsx
<Card>
  <CardContent>
    <h3 className="font-semibold mb-2">Feature Titel</h3>
    <p className="text-sm text-muted-foreground">
      Mehrzeiliger Fließtext bleibt linksbündig für optimale Lesbarkeit in Cards.
    </p>
  </CardContent>
</Card>
```

---

## 🔍 QUALITY CHECKLIST

Vor jedem Commit:

- [ ] Alle `mx-auto` Container haben explizites Text-Alignment
- [ ] `max-w-3xl mx-auto` → `text-center` gesetzt
- [ ] Fließtexte in Cards sind linksbündig
- [ ] Hero-Beschreibungen nutzen Pattern 1
- [ ] Mobile-Ansicht getestet (Alignment bleibt harmonisch)

---

## 📊 MIGRATION STATUS

**Implementiert in:**

- ✅ src/pages/Pricing.tsx (Line 308)
- ✅ src/pages/Contact.tsx (Line 108)
- ✅ src/pages/Home.tsx (Line 595)
- ✅ src/pages/NeXifySupport.tsx (Lines 343, 426, 476, 514, 646)

**Review erforderlich:**

- ⏳ src/pages/Features.tsx
- ⏳ src/pages/About.tsx
- ⏳ Weitere Marketing-Seiten

---

## 🔗 RELATED DOCUMENTS

- [PRICING_DESIGN_SYSTEM_V26.0.md](./PRICING_DESIGN_SYSTEM_V26.0.md) - Übergeordnetes Design-System
- [FEHLERLOG_V18.5.14.md](./FEHLERLOG_V18.5.14.md) - Fehler #002: Text-Alignment Issue

---

**Version:** V26.0  
**Last Update:** 2025-01-26  
**Maintainer:** NeXify AI Agent
