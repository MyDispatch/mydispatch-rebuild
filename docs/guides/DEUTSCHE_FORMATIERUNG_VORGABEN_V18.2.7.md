# 📝 Deutsche Formatierungs-Vorgaben MyDispatch V18.2.7

**Status:** ✅ SYSTEMWEIT VERBINDLICH  
**Datum:** 15.01.2025  
**Version:** 18.2.7  

---

## 🎯 ZIELSETZUNG

Systemweite Vorgaben für perfekte deutsche Formatierung, Rechtschreibung nach aktueller deutscher Rechtschreibreform und fehlerfreie visuelle Darstellung in allen MyDispatch-Komponenten.

---

## 📋 RECHTSCHREIBREFORM (NEUE DEUTSCHE RECHTSCHREIBUNG)

### Grundregeln:

#### 1. **ss vs. ß** (seit 2006)
```
✅ KORREKT:
- dass (Konjunktion)
- Straße (nach langem Vokal)
- Fuß (nach langem Vokal)
- muss (nach kurzem Vokal)
- Fluss (nach kurzem Vokal)

❌ FALSCH:
- daß → dass
- Strasse → Straße
- muß → muss
```

#### 2. **Getrennt- und Zusammenschreibung**
```
✅ KORREKT:
- infrage stellen (getrennt)
- zurzeit (Adverb, zusammen)
- zur Zeit (Präposition + Artikel, getrennt)
- kennenlernen (zusammen)
- spazieren gehen (getrennt)

❌ FALSCH:
- in Frage stellen
- ken- nenlernen
```

#### 3. **Kommasetzung**
```
✅ KORREKT:
- Er kam, um zu helfen. (Infinitiv mit "um...zu")
- Sie versprach, pünktlich zu sein. (erweiterter Infinitiv)
- Das Auto, das ich gestern gekauft habe, ist rot. (Relativsatz)

⚠️ OPTIONAL (aber empfohlen):
- Er hofft[,] pünktlich zu sein. (einfacher Infinitiv)
```

#### 4. **Groß- und Kleinschreibung**
```
✅ KORREKT:
- im Allgemeinen (Substantivierung)
- des Weiteren (Substantivierung)
- seit Langem (Substantivierung)
- heute Morgen (Tageszeit nach Adverb)
- Rad fahren (Substantiv + Verb getrennt)

❌ FALSCH:
- im allgemeinen
- desweiteren
- seit langem
- heute morgen
- radfahren
```

---

## 🔢 ZAHLEN & WÄHRUNGEN (DIN 5008)

### Datumsformat:
```typescript
// KORREKT (deutsches Format):
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Ausgabe: 15.01.2025 (NICHT: 01/15/2025 oder 2025-01-15)
```

### Uhrzeitformat:
```typescript
// KORREKT (24-Stunden-Format):
const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Ausgabe: 14:30 (NICHT: 2:30 PM)
```

### Währungsformat:
```typescript
// KORREKT (€ mit Punkt als Tausendertrenner):
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

// Ausgabe: 1.234,56 € (NICHT: €1,234.56 oder 1234.56 EUR)
```

### Zahlenformat:
```
✅ KORREKT:
- 1.234.567,89 (Punkt als Tausendertrenner, Komma als Dezimaltrenn.)
- 42 % (Leerzeichen vor %)
- 5 km (Leerzeichen vor Einheit)

❌ FALSCH:
- 1,234,567.89 (US-Format)
- 42% (kein Leerzeichen)
- 5km (kein Leerzeichen)
```

---

## 📐 TYPOGRAFIE & UMBRÜCHE

### Silbentrennung (CSS):
```css
* {
  hyphens: auto;
  -webkit-hyphens: auto;
  -ms-hyphens: auto;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
```

### Geschützte Leerzeichen:
```tsx
// KORREKT:
<span>42&nbsp;€</span>         // Zahl + Währung
<span>42&nbsp;%</span>          // Zahl + Prozent
<span>§&nbsp;21 PBefG</span>    // Paragraph + Nummer
<span>z.&nbsp;B.</span>         // Abkürzungen
<span>Dr.&nbsp;Müller</span>    // Titel + Name

// FALSCH:
<span>42 €</span>               // Normales Leerzeichen
```

### Anführungszeichen:
```
✅ KORREKT:
- „deutsche Anführungszeichen"
- »französische Guillemets«
- "englische quotes" (nur bei englischen Zitaten)

❌ FALSCH:
- "deutsche Anführungszeichen" (US-Style)
- 'einfache Anführungszeichen' (nur für Zitate in Zitaten)
```

### Gedankenstrich vs. Bindestrich:
```
✅ KORREKT:
- Taxi- und Mietwagenunternehmen (Bindestrich, kein Leerzeichen)
- München – Berlin (Gedankenstrich mit Leerzeichen)
- 14:00–18:00 Uhr (Halbgeviertstrich ohne Leerzeichen)

❌ FALSCH:
- Taxi - und Mietwagenunternehmen (Leerzeichen falsch)
- München - Berlin (Bindestrich statt Gedankenstrich)
```

---

## 🎨 VISUELLE DARSTELLUNG

### Line-Height (Zeilenhöhe):
```css
/* BODY TEXT */
body, p {
  line-height: 1.5; /* DIN 1450 (Leserlichkeit) */
}

/* HEADLINES */
h1, h2, h3 {
  line-height: 1.2; /* Kompakter für Headlines */
}

/* TABELLEN */
td {
  line-height: 1.4; /* Kompakter für Tabellen */
}
```

### Letter-Spacing (Zeichenabstand):
```css
/* FLIESSTEXT */
body, p {
  letter-spacing: 0.01em; /* Minimal für bessere Lesbarkeit */
}

/* HEADLINES */
h1 {
  letter-spacing: -0.02em; /* Optischer Ausgleich bei großen Größen */
}

/* BUTTONS */
button {
  letter-spacing: 0.05em; /* Etwas luftiger */
}
```

### Responsive Umbrüche:
```tsx
// KORREKT (Mobile-First):
<p className="text-sm sm:text-base lg:text-lg leading-relaxed">
  Professionelle Disposition für Taxiunternehmen, Mietwagenunternehmen<br className="hidden sm:block" />
  und Limousinen-Services – vollständige Fuhrparkverwaltung,<br className="hidden sm:block" />
  intelligente Auftragsvergabe in einer DSGVO-konformen Plattform
</p>
```

---

## 📱 MOBILE-OPTIMIERUNG

### Mindestgrößen (Accessibility):
```css
/* TOUCH TARGETS (WCAG 2.1 AAA) */
button, a {
  min-height: 44px; /* iOS-Standard */
  min-width: 44px;
}

/* FONT SIZES */
body {
  font-size: 16px; /* Minimum für Mobile (iOS zoomed nicht) */
}

h1 {
  font-size: clamp(2rem, 5vw, 4rem); /* Responsive Skalierung */
}
```

### Viewport Meta-Tag:
```html
<!-- KORREKT (bereits in index.html): -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

---

## 🔤 ANREDE & TITEL (SYSTEMATISCH)

### Anrede-Optionen (PersonFormFields):
```typescript
const ANREDE_OPTIONS = [
  { value: 'Herr', label: 'Herr' },
  { value: 'Frau', label: 'Frau' },
  { value: 'Divers', label: 'Divers' },
];
```

### Titel-Optionen:
```typescript
const TITEL_OPTIONS = [
  { value: '', label: 'Kein Titel' },
  { value: 'Dr.', label: 'Dr.' },
  { value: 'Prof.', label: 'Prof.' },
  { value: 'Prof. Dr.', label: 'Prof. Dr.' },
];
```

### Vollständige Anrede (E-Mail/Brief):
```tsx
// KORREKT:
const fullSalutation = `${anrede}${titel ? ' ' + titel : ''} ${vorname} ${nachname}`;

// Ausgabe-Beispiele:
// "Herr Dr. Max Mustermann"
// "Frau Prof. Dr. Anna Schmidt"
// "Divers Alex Müller"
```

### Briefanrede:
```tsx
// KORREKT:
const letterSalutation = anrede === 'Divers' 
  ? `Guten Tag ${vorname} ${nachname},`
  : `Sehr geehrte${anrede === 'Frau' ? '' : 'r'} ${anrede}${titel ? ' ' + titel : ''} ${nachname},`;

// Ausgabe-Beispiele:
// "Sehr geehrter Herr Dr. Mustermann,"
// "Sehr geehrte Frau Prof. Schmidt,"
// "Guten Tag Alex Müller,"
```

---

## 🏠 ADRESSFELDER (SYSTEMATISCH)

### Standard-Adressformat:
```typescript
interface Address {
  street: string;        // "Hauptstraße"
  street_number: string; // "42a"
  postal_code: string;   // "80331"
  city: string;          // "München"
  country?: string;      // "Deutschland" (optional)
}
```

### Darstellung (Einzeilig):
```tsx
// KORREKT:
const addressSingleLine = `${street} ${street_number}, ${postal_code} ${city}`;

// Ausgabe: "Hauptstraße 42a, 80331 München"
```

### Darstellung (Mehrzeilig):
```tsx
// KORREKT:
<div>
  <p>{`${street} ${street_number}`}</p>
  <p>{`${postal_code} ${city}`}</p>
  {country && <p>{country}</p>}
</div>

// Ausgabe:
// Hauptstraße 42a
// 80331 München
// Deutschland
```

---

## 📊 DATEN-KONSISTENZ

### Pflichtfelder (Allgemein):
```typescript
// KORREKT (Formulare):
const requiredFields = {
  anrede: true,         // Herr/Frau/Divers
  vorname: true,        // Vorname
  nachname: true,       // Nachname
  street: true,         // Straße
  street_number: true,  // Hausnummer
  postal_code: true,    // PLZ
  city: true,           // Ort
  email: true,          // E-Mail
  phone: true,          // Telefon
};
```

### Optionale Felder:
```typescript
// OPTIONAL:
const optionalFields = {
  titel: false,         // Dr., Prof. etc.
  firma: false,         // Firmenname
  address_zusatz: false, // Adresszusatz (z.B. "Hinterhaus")
  country: false,       // Land (Standard: Deutschland)
};
```

---

## 🚀 IMPLEMENTIERUNG (SYSTEMWEIT)

### Zentrale Format-Utils (src/lib/format-utils.ts):

```typescript
// BEREITS IMPLEMENTIERT:
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// NEU (ERGÄNZEN):
export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (date: string | Date): string => {
  return `${formatDate(date)}, ${formatTime(date)}`;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2).replace('.', ',')} %`;
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(2).replace('.', ',')} km`;
};
```

---

## ✅ QUALITY CHECKLIST

### Bei JEDEM Commit:
- [ ] Rechtschreibprüfung (neue deutsche Rechtschreibung)
- [ ] ss/ß korrekt verwendet
- [ ] Kommas nach aktuellen Regeln
- [ ] Zahlenformat: 1.234,56 (Punkt als Tausendertrenner)
- [ ] Währung: 1.234,56 € (Leerzeichen vor €)
- [ ] Datum: 15.01.2025 (DD.MM.YYYY)
- [ ] Uhrzeit: 14:30 (24h-Format)
- [ ] Geschützte Leerzeichen bei Zahlen/Einheiten
- [ ] Line-Height: 1.5 (Body), 1.2 (Headlines)
- [ ] Touch-Targets: Min. 44x44px
- [ ] Silbentrennung aktiviert (CSS)

---

## 📚 RESSOURCEN

### Offizielle Quellen:
- [Duden Online](https://www.duden.de/)
- [Rat für deutsche Rechtschreibung](http://www.rechtschreibrat.com/)
- [DIN 5008 (Schreib- und Gestaltungsregeln)](https://de.wikipedia.org/wiki/DIN_5008)
- [WCAG 2.1 (Accessibility)](https://www.w3.org/TR/WCAG21/)

### MyDispatch-spezifisch:
- `src/lib/format-utils.ts` - Zentrale Formatierungs-Utils
- `src/components/forms/PersonFormFields.tsx` - Anrede/Titel
- `src/components/forms/AddressInput.tsx` - Adressfelder
- `src/index.css` - Globale Typografie-Styles

---

**Erstellt:** 15.01.2025, 17:45 Uhr (CEST)  
**Autor:** AI-Agent (Claude Sonnet 4)  
**Genehmigt:** Pascal Courbois (Projektleiter)

**SYSTEMWEIT VERBINDLICH – NIEMALS ABWEICHEN!**
