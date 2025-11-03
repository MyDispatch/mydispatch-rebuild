# HOMEPAGE KONZEPT V18.5.0

> **Version:** 18.5.0  
> **Letzte Aktualisierung:** 2025-01-26  
> **Status:** ✅ SYSTEMWEIT GÜLTIG

---

## 🎯 HOMEPAGE-STRATEGIE

### Ziele
1. **Vertrauen aufbauen** (Made in Germany, DSGVO, Referenzen)
2. **Nutzen kommunizieren** (Zeitersparnis, Effizienz, Automatisierung)
3. **Tarife transparent darstellen** (Alle Features, klare Preise)
4. **Zur Aktion motivieren** (Anmeldung, Demo, Kontakt)

### Zielgruppen
- **Primär:** Taxi-/Mietwagenunternehmer (5-50 Fahrzeuge)
- **Sekundär:** Limousinen-Services, Großflotten (>50 Fahrzeuge)
- **Tertiär:** Fahrer (App-Download), Partner (Netzwerk)

---

## 📐 SEITENSTRUKTUR

### 1. HERO-SECTION (Above the Fold)

**Layout:** Grid 12 Spalten
- **Links (7 Spalten):** Text-Content
- **Rechts (5 Spalten):** Dashboard-Grafik

**Inhalte Links:**
```tsx
1. Badge: "Made in Germany • DSGVO-konform"
2. H1: "MyDispatch – Die führende Software für Taxi- und Mietwagenunternehmen"
3. Subtext: "Professionelle Disposition, vollständige Fuhrparkverwaltung 
   und intelligente Auftragsvergabe – alles in einer DSGVO-konformen Plattform"
4. CTA-Buttons:
   - Primär: "Jetzt abonnieren"
   - Sekundär: "App installieren"
5. Trust-Bar: "500+ Unternehmen" | "99,9% Uptime" | "24/7 Support"
```

**Inhalte Rechts:**
```tsx
Dashboard-Screenshot mit:
- GPS-Karte mit Fahrzeug-Markern
- Live-Disposition-Panel
- KPI-Cards ("12 Aktive Fahrten", "€2,847 Tagesumsatz")
- Glassmorphism-Rahmen
- Glow-Effekt (primary/30)
```

**Hintergrund:**
- Video: Taxi/Verkehr (mit Fallback-Gradient)
- Dark Overlay: rgba(0,0,0,0.6)
- Wave-Element am unteren Rand

---

### 2. FEATURES-SECTION

**Überschrift:**
```
"Alles, was Sie für moderne Disposition brauchen"
```

**Grid:** 3 Spalten (Desktop), 2 (Tablet), 1 (Mobile)

**Feature-Cards (9 Stück):**

| Icon | Titel | Badge | Tarif |
|------|-------|-------|-------|
| ClipboardList | Intelligente Auftragsverwaltung | Kern | Alle |
| Car | Digitale Fuhrparkverwaltung | Smart | Alle |
| Users | Fahrermanagement Pro | Produktiv | Alle |
| Receipt | Professionelles Rechnungswesen | Zeit-Spar | Alle |
| Handshake | Partner-Netzwerk | Business | Business+ |
| BarChart3 | Live-Statistiken & KPIs | Business | Business+ |
| Shield | DSGVO-konform & Sicher | Sicher | Alle |
| Smartphone | Kunden-Portal & Buchungswidget | Business | Business+ |
| Globe | Live-Traffic & Wetter | Smart | Alle |

**Card-Struktur:**
```tsx
<Card hover:shadow-2xl hover:-translate-y-1>
  <Icon + Badge (oben rechts)>
  <Title (H3, font-bold)>
  <Description (text-sm, 2-3 Zeilen)>
</Card>
```

**USP-Highlights darunter:**
```
Grid 3 Spalten:
- "500+ Aktive Unternehmen"
- "99,9% Uptime-Garantie"
- "ISO 27001 zertifiziert"
```

---

### 3. TARIFE-SECTION

**Überschrift:**
```
"Transparente Preise – Tarife für jede Unternehmensgröße"
```

**Grid:** 3 Spalten (gleiche Höhe)

**Tarif-Cards:**

#### STARTER (39 €/Monat)
```tsx
Badge: "Für Einsteiger"
Preis: "39 € / Monat"
Subtext: "Monatlich kündbar"

Features:
✅ Unbegrenzte Aufträge
✅ Max. 10 Fahrzeuge
✅ Max. 10 Fahrer
✅ Digitale Fuhrparkverwaltung
✅ TÜV-Erinnerungen
✅ Rechnungserstellung
✅ 24/7 KI-Support

CTA: "Jetzt starten"
```

#### BUSINESS (89 €/Monat)
```tsx
Badge: "Beliebteste Wahl" (primary)
Preis: "89 € / Monat"
Subtext: "Monatlich kündbar"

Features:
✅ Alle Starter-Features
✅ Max. 50 Fahrzeuge
✅ Max. 50 Fahrer
✅ Partner-Netzwerk
✅ Live-Statistiken
✅ Kunden-Portal
✅ Online-Buchungswidget
✅ Provisionsabrechnung

CTA: "Jetzt upgraden" (primary)
```

#### ENTERPRISE (Individuell)
```tsx
Badge: "Für Großflotten"
Preis: "Individuell"
Subtext: "Ab 50+ Fahrzeuge"

Features:
✅ Alle Business-Features
✅ Unbegrenzte Fahrzeuge
✅ Unbegrenzte Fahrer
✅ Dedizierter Support
✅ API-Zugang (erweitert)
✅ Custom Branding
✅ SLA-Garantie
✅ Schulungen inklusive

CTA: "Angebot anfordern"
```

**Feature-Vergleich darunter:**
```tsx
<Accordion>
  Titel: "Alle Features im Detail vergleichen"
  
  Inhalt: Vollständige Tarif-Matrix
  (siehe TARIFSTEUERUNG_SYSTEM.md)
</Accordion>
```

---

### 4. TESTIMONIALS-SECTION

**Überschrift:**
```
"Über 500 Unternehmen vertrauen MyDispatch"
```

**Slider:** 3 Testimonials sichtbar, Auto-Rotate 5s

**Testimonial-Card-Struktur:**
```tsx
<Card>
  <Quote-Icon (oben links, text-primary/30)>
  <Text: "Zitat (max. 2 Sätze, 40 Wörter)">
  <Author:
    - Avatar (Firma-Logo oder Platzhalter)
    - Name + Position
    - Firmenname
  >
  <Rating: 5 Sterne (optional)>
</Card>
```

**Beispiel-Testimonials:**

```tsx
{
  quote: "MyDispatch hat unsere Disposition revolutioniert. Die automatische 
          Fahrerzuweisung spart uns täglich 2 Stunden und unsere Fahrer sind 
          effizienter unterwegs.",
  author: "Michael Schmidt",
  role: "Geschäftsführer",
  company: "Taxi München GmbH",
  rating: 5
}
```

---

### 5. FAQ-SECTION

**Überschrift:**
```
"Häufig gestellte Fragen"
```

**Accordion:** 8-10 wichtigste Fragen

**Kategorien:**
1. **Tarife & Preise** (3 Fragen)
2. **Funktionen** (3 Fragen)
3. **Datenschutz & Sicherheit** (2 Fragen)
4. **Support & Onboarding** (2 Fragen)

**Beispiel-Fragen:**

```tsx
Q: "Welcher Tarif ist der richtige für mein Unternehmen?"
A: "Starter eignet sich für Flotten bis 10 Fahrzeuge. Business ist ideal 
    für Unternehmen mit 10-50 Fahrzeugen, die Partner-Funktionen und 
    Statistiken benötigen. Enterprise ist für Großflotten ab 50 Fahrzeugen 
    mit individuellen Anforderungen."

Q: "Kann ich den Tarif jederzeit wechseln?"
A: "Ja, Sie können jederzeit upgraden (sofort aktiv) oder downgraden 
    (zum Monatsende). Es gibt keine Mindestlaufzeit."

Q: "Sind meine Daten sicher?"
A: "Ja, alle Daten werden verschlüsselt auf ISO 27001-zertifizierten Servern 
    in Deutschland gespeichert. MyDispatch ist zu 100% DSGVO-konform."
```

---

### 6. CTA-SECTION (Final Call-to-Action)

**Layout:** Zentriert, Full-Width Gradient-Background

**Inhalte:**
```tsx
<Section bg-gradient-to-r from-primary/20 to-primary/10>
  <H2: "Bereit für moderne Disposition?">
  <Subtext: "Testen Sie MyDispatch 14 Tage kostenlos. Keine Kreditkarte erforderlich.">
  <CTA-Buttons:
    - Primär: "Jetzt kostenlos testen"
    - Sekundär: "Tarife vergleichen"
  >
  <Trust-Badges: Made in Germany | DSGVO | ISO 27001>
</Section>
```

---

### 7. FOOTER

**Grid:** 4 Spalten (Desktop), 2 (Tablet), 1 (Mobile)

**Spalten:**

**Spalte 1: Produkt**
```
- Features
- Tarife
- Integrationen
- Updates
```

**Spalte 2: Unternehmen**
```
- Über uns
- Karriere
- Presse
- Partner werden
```

**Spalte 3: Support**
```
- Hilfe-Center
- Dokumentation
- API-Referenz
- System-Status
```

**Spalte 4: Rechtliches**
```
- Impressum (PFLICHT)
- Datenschutz (PFLICHT)
- AGB (PFLICHT)
- Widerrufsrecht
- Cookie-Einstellungen
```

**Footer-Bottom:**
```tsx
<Divider>
<Flex justify-between>
  <Text: "© 2025 MyDispatch.de by Roitsch Solutions">
  <Social-Links: LinkedIn | GitHub | Twitter>
</Flex>
```

---

## 🎨 DESIGN-SPEZIFIKATIONEN

### Farben
```css
--primary: 40 31% 88%;           /* Beige/Gold */
--foreground: 225 31% 28%;       /* Dunkelblau */
--status-success: 142 76% 36%;   /* Grün */
```

### Typografie
```tsx
Hero H1: text-5xl sm:text-6xl font-bold
Hero Subtext: text-lg sm:text-xl font-light
Section H2: text-3xl sm:text-4xl font-bold
Card H3: text-lg sm:text-xl font-bold
Body Text: text-sm sm:text-base
```

### Spacing
```tsx
Section Padding: py-16 sm:py-20 md:py-24
Card Padding: p-6 sm:p-8
Gap (Grid): gap-6 sm:gap-8
```

### Animationen
```tsx
Fade-In: animate-fade-in (0.3s ease-out)
Hover Scale: hover:scale-105 (0.2s)
Hover Shadow: hover:shadow-2xl (0.3s)
```

---

## 📱 RESPONSIVE BREAKPOINTS

### Mobile (<640px)
- Single Column Layout
- Stack Hero (Text oben, Bild ausblenden)
- Feature Grid: 1 Spalte
- Tarif Cards: 1 Spalte (scrollbar)
- Testimonials: 1 sichtbar

### Tablet (640px-1024px)
- Hero: 1 Spalte (Text + Bild übereinander)
- Features: 2 Spalten
- Tarife: 2 Spalten (3. Karte neue Reihe)
- Footer: 2 Spalten

### Desktop (>1024px)
- Hero: 12-Spalten-Grid (7 Text + 5 Bild)
- Features: 3 Spalten
- Tarife: 3 Spalten (gleiche Höhe)
- Footer: 4 Spalten

---

## 🔍 SEO-OPTIMIERUNG

### Meta-Tags
```tsx
<title>
  MyDispatch - Führende Software für Taxi- & Mietwagenunternehmen | 
  Limousinen-Service
</title>

<meta name="description" content="MyDispatch: Professionelle 
  Dispositionssoftware für Taxiunternehmen, Mietwagenunternehmen und 
  Limousinen-Services. DSGVO-konform, Made in Germany. Jetzt abonnieren 
  ab 39 €/Monat." />

<meta name="keywords" content="Taxi Software, Mietwagenunternehmen Software, 
  Dispositionssoftware, Fuhrparkverwaltung, DSGVO-konform, Made in Germany" />
```

### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MyDispatch",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "EUR",
    "lowPrice": "39",
    "highPrice": "89"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "500"
  }
}
```

---

## ✅ QUALITY CHECKLIST

### Content
- [ ] Alle Texte rechtschreibgeprüft (Duden)
- [ ] Tonalität konsistent (professionell, zugänglich)
- [ ] Keine unbelegten Superlative
- [ ] Tarife transparent dargestellt
- [ ] Rechtliche Pflichtangaben verlinkt

### Design
- [ ] CI-Farben korrekt verwendet (HSL)
- [ ] Icons nur aus Lucide
- [ ] Grafiken MyDispatch-spezifisch (kein Stock)
- [ ] Text-Umbrüche optimiert (balance/pretty)
- [ ] Kontrast WCAG AA (4.5:1)

### Technik
- [ ] SEO-Meta-Tags vollständig
- [ ] Alt-Texte für alle Bilder
- [ ] Lazy-Loading für Grafiken
- [ ] Mobile-optimiert
- [ ] Performance <3s LCP

### Rechtliches
- [ ] Impressum verlinkt
- [ ] Datenschutz verlinkt
- [ ] AGB verlinkt
- [ ] Widerrufsrecht erwähnt
- [ ] Cookie-Banner implementiert

---

## 📚 INTEGRATION MIT ANDEREN VORGABEN

Diese Guidelines arbeiten zusammen mit:
- `MARKETING_CONTENT_STANDARDS_V18.5.0.md` - Content-Qualität
- `TEXT_WRAPPING_GUIDELINES_V18.5.0.md` - Text-Umbrüche
- `GRAPHICS_GUIDELINES_V18.5.0.md` - Visuelle Standards
- `TARIFSTEUERUNG_SYSTEM.md` - Tarif-Logik
- `UI_LIBRARY_SYSTEM_V18.5.0.md` - UI-Komponenten

---

**SYSTEMWEITE VORGABE - FÜR ALLE MARKETINGSEITEN ANWENDEN!**
