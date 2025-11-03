# TEXT WRAPPING GUIDELINES V18.5.0

> **Version:** 18.5.0  
> **Letzte Aktualisierung:** 2025-01-26  
> **Status:** ✅ SYSTEMWEIT GÜLTIG

---

## 🎯 ÜBERSICHT

Professionelle Text-Umbrüche nach deutschen Lokalisierungsvorgaben (DIN 5008) für optimale Lesbarkeit auf allen Bildschirmgrößen.

---

## 📋 ABSOLUTE REGELN

### 1. CSS Text-Wrap Properties

```css
/* Für Headlines - ausgewogene Textverteilung */
text-wrap: balance;

/* Für Body/Subtext - verhindert "Witwen" (einzelne Wörter am Ende) */
text-wrap: pretty;
```

**Anwendung in React/JSX:**
```tsx
<h1 style={{ textWrap: 'balance' }}>
  Ihre Headline hier
</h1>

<p style={{ textWrap: 'pretty' }}>
  Ihr längerer Fließtext hier
</p>
```

---

### 2. Non-Breaking Spaces (Geschützte Leerzeichen)

**Zweck:** Verhindern, dass kurze Wörter allein in einer Zeile stehen.

**JavaScript/JSX-Syntax:**
```tsx
// ✅ KORREKT - Non-Breaking Space verhindert Trennung
<span>für{'\u00A0'}Taxi-</span>
<span>und{'\u00A0'}intelligente</span>
<span>alles in{'\u00A0'}einer</span>

// ❌ FALSCH - Normales Leerzeichen kann getrennt werden
<span>für Taxi-</span>
<span>und intelligente</span>
```

**HTML-Entity (alternativ):**
```html
für&nbsp;Taxi-
und&nbsp;intelligente
```

---

### 3. Soft Hyphens (Weiche Trennstriche)

**Zweck:** Deutsche Trennungsregeln für lange Komposita einhalten.

**Verwendung:**
```tsx
// ✅ Korrekte deutsche Silbentrennung
Miet&shy;wagen&shy;unter&shy;nehmen
Fuhr&shy;park&shy;ver&shy;waltung
Auftrags&shy;vergabe
Dispo&shy;sitions&shy;software
```

**Regeln:**
- Trennung nach Silben gemäß DIN 5008
- Nie zwischen weniger als 3 Buchstaben trennen
- Komposita an Wortfugen trennen

---

## 🎨 IMPLEMENTIERUNG

### Hero Headlines (H1)
```tsx
<h1 
  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
  style={{ textWrap: 'balance' }}
>
  <span className="block text-primary">
    MyDispatch
  </span>
  <span className="block mt-2" style={{ textWrap: 'balance' }}>
    Die führende Software für{'\u00A0'}Taxi- und{'\u00A0'}Miet&shy;wagen&shy;unter&shy;nehmen
  </span>
</h1>
```

### Subtext / Body Copy
```tsx
<p 
  className="text-lg max-w-2xl"
  style={{ textWrap: 'pretty' }}
>
  Professionelle Disposition, voll&shy;ständige Fuhr&shy;park&shy;ver&shy;waltung 
  und{'\u00A0'}intelligente Auftrags&shy;vergabe{'\u00A0'}– alles in{'\u00A0'}einer 
  DSGVO-konformen Plattform
</p>
```

### Feature-Listen
```tsx
<div style={{ textWrap: 'balance' }}>
  Intelligente Auf&shy;trags&shy;ver&shy;gabe für{'\u00A0'}maximale Effizienz
</div>
```

---

## ✅ BEST PRACTICES

### Wann Non-Breaking Spaces verwenden?
- **Artikel + Nomen:** `in{'\u00A0'}einer`, `für{'\u00A0'}Taxi-`
- **Konjunktionen + Adjektive:** `und{'\u00A0'}intelligente`
- **Präpositionen + kurze Wörter:** `–{'\u00A0'}alles`
- **Zahlen + Einheiten:** `9{'\u00A0'}€`, `24{'\u00A0'}Stunden`

### Wann Soft Hyphens verwenden?
- **Komposita (>12 Zeichen):** Miet&shy;wagen&shy;unter&shy;nehmen
- **Fachbegriffe:** Fuhr&shy;park&shy;ver&shy;waltung
- **Zusammengesetzte Adjektive:** DSGVO-konform (kein &shy; bei Bindestrich!)

### Wann `text-wrap` verwenden?
- **`balance`:** Alle Headlines (H1-H3), Card-Titel
- **`pretty`:** Body-Text, Subtext, Beschreibungen (>2 Zeilen)

---

## 🚫 HÄUFIGE FEHLER

### ❌ FALSCH
```tsx
// Keine Umbruchkontrolle
<h1>Die führende Software für Taxi- und Mietwagen&shy;unternehmen</h1>

// Zu aggressive Trennungen
<p>Die&shy;se Soft&shy;ware ist toll</p>

// Normales Leerzeichen vor kurzem Wort
<p>alles in einer Plattform</p>
```

### ✅ RICHTIG
```tsx
// Balanced Headlines mit Non-Breaking Spaces
<h1 style={{ textWrap: 'balance' }}>
  Die führende Software für{'\u00A0'}Taxi- und{'\u00A0'}Miet&shy;wagen&shy;unter&shy;nehmen
</h1>

// Nur lange Wörter mit Soft Hyphens
<p style={{ textWrap: 'pretty' }}>
  Diese Soft&shy;ware ist toll
</p>

// Non-Breaking Space vor kurzem Wort
<p>alles in{'\u00A0'}einer Plattform</p>
```

---

## 📱 RESPONSIVE VERHALTEN

### Desktop (>1024px)
- `text-wrap: balance` verteilt Text optimal über Zeilen
- Soft Hyphens werden nur bei Bedarf aktiviert
- Non-Breaking Spaces verhindern unschöne Umbrüche

### Tablet (768px - 1024px)
- `text-wrap` passt sich automatisch an
- Mehr Soft Hyphens werden aktiv
- Non-Breaking Spaces bleiben aktiv

### Mobile (<768px)
- `text-wrap: pretty` verhindert Witwen
- Maximale Soft Hyphen-Nutzung
- Kürzere Zeilen = wichtigere Rolle von `\u00A0`

---

## 🔍 BROWSER-SUPPORT

| Browser | `text-wrap: balance` | `text-wrap: pretty` | `&shy;` | `\u00A0` |
|---------|---------------------|--------------------|---------|----|
| Chrome 114+ | ✅ | ✅ | ✅ | ✅ |
| Firefox 121+ | ✅ | ✅ | ✅ | ✅ |
| Safari 17.4+ | ✅ | ✅ | ✅ | ✅ |
| Edge 114+ | ✅ | ✅ | ✅ | ✅ |

**Fallback:** Browser ohne Support ignorieren `text-wrap` und nutzen Standard-Umbrüche.

---

## 📦 INTEGRATION IN DESIGN-SYSTEM

```typescript
// lib/design-system.ts
export const textWrapStyles = {
  headline: { textWrap: 'balance' as const },
  body: { textWrap: 'pretty' as const },
};

// Verwendung
<h1 style={textWrapStyles.headline}>Headline</h1>
<p style={textWrapStyles.body}>Body Text</p>
```

---

## ✅ QUALITY CHECKLIST

- [ ] Headlines verwenden `text-wrap: balance`
- [ ] Body-Text verwendet `text-wrap: pretty`
- [ ] Kurze Wörter (<4 Zeichen) nach Präpositionen mit `\u00A0` geschützt
- [ ] Lange Komposita (>12 Zeichen) mit `&shy;` getrennt
- [ ] Mobile Ansicht geprüft (keine alleinstehenden Wörter)
- [ ] Tablet Ansicht geprüft (ausgewogene Zeilen)
- [ ] Desktop Ansicht geprüft (professionelles Layout)
- [ ] Deutsche Trennungsregeln (DIN 5008) befolgt

---

**SYSTEMWEITE VORGABE - BEI ALLEN TEXTEN ANWENDEN!**
