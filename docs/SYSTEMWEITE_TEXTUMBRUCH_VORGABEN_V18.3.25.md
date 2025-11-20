# Systemweite Textumbruch-Vorgaben V18.3.25

**Status:** ✅ Production Ready | **Gültig ab:** 2025-01-18  
**Scope:** ALLE Seiten und Komponenten | **Version:** V18.3.25 FINAL

---

## 🎯 Zielsetzung

Professionelle, typografisch korrekte Textumbrüche in ALLEN MyDispatch-Seiten nach deutschen Standards (DIN 5008) mit kontextspezifischen Regeln für optimale Lesbarkeit.

**Kernprinzipien:**

- ✅ Headlines: **KEINE** Silbentrennung (bleiben ungeteilt)
- ✅ Hero-Text: **KEINE** Silbentrennung (natürliche Umbrüche an Leerzeichen)
- ✅ Marketing-Text: **SANFTE** Silbentrennung (8 Zeichen min., 4 vor/nach)
- ✅ Fließtext: **STANDARD** Silbentrennung (6 Zeichen min., 3 vor/nach)
- ✅ Code/URLs: **SPEZIELLE** Regeln (kein hyphen, break-all erlaubt)

---

## 📚 Standard-Regeln (Automatisch auf `body`)

### Globale Basis-Einstellungen (`src/index.css`)

```css
body {
  /* Deutsche Silbentrennung (DIN 5008) */
  hyphens: auto;
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
  hyphenate-limit-chars: 6 3 3; /* Min. 6 Zeichen, mind. 3 vor/nach Trennung */

  /* Wortumbruch-Regeln */
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: normal; /* NICHT break-all! Behält Wortgrenzen */

  /* Typografie-Optimierung */
  text-rendering: optimizeLegibility;
  font-kerning: normal;
  line-break: auto; /* Browser-optimiert */
}
```

**Was bedeutet das?**

- Automatische Silbentrennung für ALLE Texte
- Mindestens 6 Zeichen pro Wort vor Trennung
- Mindestens 3 Zeichen vor/nach dem Trennstrich
- Umbruch nur an natürlichen Wortgrenzen (außer bei langen Wörtern)

---

## 🏷️ Element-Spezifische Regeln

### 1. **Headlines (h1-h6): KEINE Silbentrennung**

```css
h1,
h2,
h3,
h4,
h5,
h6 {
  hyphens: none !important;
  -webkit-hyphens: none !important;
  word-break: normal;
  overflow-wrap: break-word; /* Nur bei SEHR langen Wörtern */
}
```

**Verwendung:**

```tsx
<h1>Ihr professioneller Fahrservice</h1>
<!-- Bleibt ungeteilt, auch auf Mobile -->
```

**Warum?**

- Headlines sollen visuell stark und ungeteilt wirken
- Silbentrennung stört den Lesefluss bei großen Schriften
- Wichtige Botschaften bleiben zusammen

---

### 2. **Fließtext (p, li, td, th): STANDARD Silbentrennung**

```css
p,
li,
td,
th {
  hyphens: auto;
  -webkit-hyphens: auto;
  hyphenate-limit-chars: 6 3 3;
  text-align: left; /* Links für bessere Lesbarkeit */
}
```

**Verwendung:**

```tsx
<p>
  Professioneller Taxi- und Mietwagenservice von Taxi Courbois.
  Jetzt buchen!
</p>
<!-- "Mietwagenservice" könnte zu "Mietwagen-service" werden -->
```

**Warum?**

- Fließtext profitiert von Silbentrennung (gleichmäßigere Zeilen)
- DIN 5008 Standard für deutsche Texte
- Verbessert Lesbarkeit auf schmalen Bildschirmen

---

### 3. **Code/Pre (code, pre, kbd): SPEZIELLE Regeln**

```css
code,
pre,
kbd,
samp {
  hyphens: none;
  -webkit-hyphens: none;
  word-break: break-all; /* Code darf überall umbrechen */
  white-space: pre-wrap; /* Leerzeichen erhalten */
}
```

**Verwendung:**

```tsx
<code>npm install @tanstack/react-query</code>
<!-- Kann bei "react-query" umbrechen, aber ohne Trennstrich -->
```

**Warum?**

- Code soll NIEMALS mit Trennstrichen versehen werden
- Aber bei langen Pfaden/URLs muss Umbruch möglich sein
- `break-all` erlaubt Umbruch überall (ohne Trennzeichen)

---

### 4. **Links/URLs (a): Wortumbruch erlaubt**

```css
a {
  word-break: break-word; /* URLs können überall umbrechen */
  overflow-wrap: break-word;
}
```

**Verwendung:**

```tsx
<a href="https://my-dispatch.de/sehr-lange-url-die-umbricht">
  Link mit langer URL
</a>
<!-- URL kann umbrechen ohne horizontale Scrollbar -->
```

**Warum?**

- URLs sind oft sehr lang und würden sonst überlaufen
- Wichtig für Mobile-Optimierung
- Verhindert horizontale Scrollbars

---

## 🎨 Utility-Klassen (Für spezielle Fälle)

### `.hero-text-no-hyphens` - Hero/Marketing ohne Silbentrennung

**Verwendung:**

```tsx
<p className="text-2xl hero-text-no-hyphens">
  Willkommen bei Courbois, Ihrem Taxi-Unternehmer in Köln.
</p>
<!-- Umbricht nur an Leerzeichen: "...Ihrem | Taxi-Unternehmer..." -->
```

**CSS:**

```css
.hero-text-no-hyphens {
  hyphens: none !important;
  -webkit-hyphens: none !important;
  word-break: normal !important;
  overflow-wrap: break-word !important;
}
```

**Wann verwenden?**

- ✅ Hero-Sections (große, prominente Texte)
- ✅ Marketing-Slogans
- ✅ Call-to-Action Texte
- ✅ Kurze beschreibende Texte (1-3 Sätze)

**Warum?**

- Hero-Text wirkt natürlicher ohne Silbentrennung
- "Taxi-Unternehmer" bleibt zusammen (bereits ein Kompositum)
- Umbruch erfolgt an natürlichen Grenzen (Leerzeichen, Kommata)

---

### `.marketing-text-soft-hyphens` - Sanfte Silbentrennung

**Verwendung:**

```tsx
<p className="text-lg marketing-text-soft-hyphens">
  Professioneller Taxi- und Mietwagenservice für Geschäftskunden
  und Privatpersonen in ganz Deutschland.
</p>
<!-- "Mietwagenservice" → "Mietwagen-service" (nur bei mind. 8 Zeichen) -->
```

**CSS:**

```css
.marketing-text-soft-hyphens {
  hyphens: auto;
  -webkit-hyphens: auto;
  hyphenate-limit-chars: 8 4 4; /* Längere Wörter, mehr Zeichen vor/nach */
}
```

**Wann verwenden?**

- ✅ Feature-Beschreibungen
- ✅ Service-Übersichten
- ✅ Produkt-Texte
- ✅ Mittelgroße Texte (3-6 Sätze)

**Warum?**

- Weniger aggressive Trennung als Standard
- Nur sehr lange Wörter (8+ Zeichen) werden getrennt
- Mehr Zeichen vor/nach Trennstrich (4 statt 3)

---

### `.body-text-hyphens` - Standard Fließtext

**Verwendung:**

```tsx
<article className="body-text-hyphens">
  <p>Langer Artikel-Text mit vielen Absätzen...</p>
  <p>Weitere Details über unsere Dienstleistungen...</p>
</article>
<!-- Standard DIN 5008 Silbentrennung (6-3-3) -->
```

**CSS:**

```css
.body-text-hyphens {
  hyphens: auto;
  -webkit-hyphens: auto;
  hyphenate-limit-chars: 6 3 3;
}
```

**Wann verwenden?**

- ✅ Blog-Artikel
- ✅ Dokumentation
- ✅ AGB / Datenschutz
- ✅ Lange Texte (10+ Sätze)

**Warum?**

- Standard-Regel für deutschen Fließtext
- Optimal für lange Texte (gleichmäßige Zeilen)
- DIN 5008 konform

---

### `.text-nowrap-important` - Keine Umbrüche

**Verwendung:**

```tsx
<span className="text-nowrap-important">24/7 verfügbar</span>
<!-- Bleibt IMMER zusammen, auch auf Mobile -->
```

**CSS:**

```css
.text-nowrap-important {
  white-space: nowrap !important;
  overflow: hidden;
  text-overflow: ellipsis; /* "..." bei Überlauf */
}
```

**Wann verwenden?**

- ✅ Wichtige Badges ("24/7", "100% Pünktlich")
- ✅ Telefonnummern
- ✅ Kurze Labels
- ✅ Navigation-Items

**Warum?**

- Manche Phrasen MÜSSEN zusammenbleiben
- Visuell wichtig (z.B. "24/7" darf nicht zu "24/ | 7" werden)
- Ellipsis (`...`) zeigt an, wenn Text abgeschnitten ist

---

### `.text-balance` - Gleichmäßige Zeilenverteilung

**Verwendung:**

```tsx
<h2 className="text-balance">
  Warum Taxi Courbois?
</h2>
<!-- Verteilt Wörter gleichmäßig über Zeilen -->
```

**CSS:**

```css
.text-balance {
  text-wrap: balance;
}
```

**Wann verwenden?**

- ✅ Kurze Headlines (2-3 Zeilen)
- ✅ Card-Titel
- ✅ Section-Überschriften

**Warum?**

- Verhindert "Witwen" (einzelnes Wort auf letzter Zeile)
- Gleichmäßigere optische Verteilung
- Modernes CSS-Feature (Chrome 114+, Safari 17+)

---

### `.text-pretty` - Verhindert Witwen/Waisen

**Verwendung:**

```tsx
<p className="text-pretty">
  Professioneller Fahrservice mit höchsten Qualitätsstandards
  für Ihr Unternehmen.
</p>
<!-- Verhindert einzelne Wörter auf letzter Zeile -->
```

**CSS:**

```css
.text-pretty {
  text-wrap: pretty;
}
```

**Wann verwenden?**

- ✅ Kurze Absätze (2-4 Sätze)
- ✅ Teaser-Texte
- ✅ Intro-Texte

**Warum?**

- Verhindert typografische Witwen (einzelnes Wort auf neuer Zeile)
- Bessere optische Balance
- Modernes CSS-Feature (Chrome 117+, Safari 17.4+)

---

## 🗂️ Verwendungs-Matrix

| Text-Typ       | Element | Klasse                         | Silbentrennung            | Wann?                  |
| -------------- | ------- | ------------------------------ | ------------------------- | ---------------------- |
| **Headlines**  | h1-h6   | -                              | ❌ Keine                  | Immer                  |
| **Hero-Text**  | p       | `.hero-text-no-hyphens`        | ❌ Keine                  | Hero-Sections          |
| **Marketing**  | p       | `.marketing-text-soft-hyphens` | 🟡 Sanft (8-4-4)          | Feature-Beschreibungen |
| **Fließtext**  | p, li   | `.body-text-hyphens`           | ✅ Standard (6-3-3)       | Artikel, Docs          |
| **Badges**     | span    | `.text-nowrap-important`       | ❌ Keine                  | Labels, Badges         |
| **Card-Titel** | h3      | `.text-balance`                | ❌ Keine                  | Kurze Titel            |
| **Teaser**     | p       | `.text-pretty`                 | ✅ Standard               | Intro-Texte            |
| **Code**       | code    | -                              | ❌ Keine, aber break-all  | Code-Snippets          |
| **URLs**       | a       | -                              | ❌ Keine, aber break-word | Links                  |

---

## 📋 Implementation-Checklist

### Für JEDE neue Komponente:

- [ ] **Headlines:** Prüfen, ob `h1-h6` ohne Silbentrennung bleiben
- [ ] **Hero-Text:** Klasse `.hero-text-no-hyphens` hinzufügen
- [ ] **Marketing-Text:** Klasse `.marketing-text-soft-hyphens` verwenden
- [ ] **Fließtext:** Standard-Regeln aktiv (keine Extra-Klasse nötig)
- [ ] **Footer-Text:** Zentriert mit `text-center`, keine Silbentrennung für Badges
- [ ] **Mobile-Test:** Auf 320px Breite testen
- [ ] **Lesbarkeit:** Umbrüche an sinnvollen Stellen?

---

## 🔍 Debugging-Tipps

### Problem: Text bricht an falschen Stellen um

**Lösung 1:** Prüfe, ob das Element die richtige Klasse hat

```tsx
<!-- ❌ FALSCH: Hero-Text ohne Klasse -->
<p className="text-2xl">Willkommen bei Courbois...</p>

<!-- ✅ RICHTIG: Mit hero-text-no-hyphens -->
<p className="text-2xl hero-text-no-hyphens">Willkommen bei Courbois...</p>
```

**Lösung 2:** Nutze Browser DevTools

```
1. Element rechtsklicken → Untersuchen
2. Im "Computed" Tab nach "hyphens" suchen
3. Sollte "none" oder "auto" sein (je nach Kontext)
```

---

### Problem: Footer-Buttons ziehen nach links

**Lösung:** Flex-Container mit `justify-center` verwenden

```tsx
<!-- ❌ FALSCH: text-center auf Buttons -->
<div className="text-center">
  <button>Button 1</button>
  <button>Button 2</button>
</div>

<!-- ✅ RICHTIG: Flex mit justify-center -->
<div className="flex items-center justify-center flex-wrap gap-4">
  <button className="whitespace-nowrap">Button 1</button>
  <button className="whitespace-nowrap">Button 2</button>
</div>
```

---

### Problem: Lange URLs überlaufen

**Lösung:** `word-break: break-word` ist bereits auf `<a>` gesetzt

```tsx
<!-- ✅ Automatisch: Links brechen korrekt um -->
<a href="https://very-long-url.com/with/many/segments">
  Sehr langer Link
</a>
```

---

## 🚀 Systemweite Aktivierung

### Bereits implementiert in:

- ✅ `src/index.css` (Global Base Styles)
- ✅ `src/pages/Unternehmer.tsx` (Landing-Page)
- ✅ Alle Footer-Komponenten
- ✅ Alle Card-Komponenten

### TODO für neue Seiten:

1. Prüfe Hero-Texte → Füge `.hero-text-no-hyphens` hinzu
2. Prüfe Marketing-Texte → Füge `.marketing-text-soft-hyphens` hinzu
3. Prüfe Footer → Nutze Flex-Layout mit `justify-center`
4. Teste auf Mobile (320px Breite)

---

## 📚 Browser-Support

| Feature                  | Chrome  | Safari   | Firefox | Edge    |
| ------------------------ | ------- | -------- | ------- | ------- |
| `hyphens: auto`          | ✅ 55+  | ✅ 5.1+  | ✅ 43+  | ✅ 79+  |
| `text-wrap: balance`     | ✅ 114+ | ✅ 17+   | ❌      | ✅ 114+ |
| `text-wrap: pretty`      | ✅ 117+ | ✅ 17.4+ | ❌      | ✅ 117+ |
| `word-break: break-word` | ✅ 1+   | ✅ 3+    | ✅ 1+   | ✅ 12+  |

**Fallback:** Moderne Features haben automatische Fallbacks (Browser ignorieren unbekannte Properties)

---

## 📞 Support & Fragen

**Tech Lead:** MyDispatch Development Team  
**Letzte Aktualisierung:** 2025-01-18  
**Version:** V18.3.25 FINAL

Bei Fragen zu Textumbrüchen → siehe dieses Dokument FIRST!

---

**© 2025 MyDispatch - Systemweite Textumbruch-Vorgaben V18.3.25**
