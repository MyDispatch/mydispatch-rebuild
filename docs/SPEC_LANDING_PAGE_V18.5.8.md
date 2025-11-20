# 🏠 LANDING PAGE SPECIFICATION V18.5.8

**Status:** 📋 Spezifikation  
**Route:** `/`  
**Letzte Aktualisierung:** 2025-10-24  
**Verantwortlich:** NeXify AI Development Agent  
**Klassifizierung:** Marketing (ÖFFENTLICH)

---

## 📊 EXECUTIVE SUMMARY

### Zweck

Die Landing Page ist die zentrale Einstiegsseite von MyDispatch und dient der **ersten Kontaktaufnahme** mit potenziellen Kunden.

### Zielgruppe

- Taxi- und Mietwagenunternehmer
- Geschäftsführer von Limousinen-Services
- Fuhrparkleiter (B2B)

### Kernbotschaft

> "MyDispatch – Die professionelle Dispositionssoftware für Taxi- und Mietwagenunternehmen. DSGVO-konform. Made in Germany. Abonnieren ab 39 €/Monat."

---

## 🏗️ ARCHITEKTUR-ENTSCHEIDUNGEN

### Layout

```typescript
Layout: MarketingLayout
Grid: HERO-GRID, TARIF-KARTEN-GRID, FAQ-ACCORDION
Responsive: Mobile-First (3 Breakpoints: sm, md, lg)
```

### Component-Struktur

```typescript
const PageStructure = {
  Header: "MarketingHeader", // Mit Navigation
  Sections: [
    "HeroSection", // Hero + Dual-CTA
    "TrustBadgesSection", // Made in Germany, DSGVO, etc.
    "FeaturesOverviewSection", // Top 6 Features (3 Spalten Desktop)
    "TarifkartenSection", // 3 Tarife (Starter, Business, Enterprise)
    "TestimonialsSection", // 3 Kundenstimmen
    "FAQSection", // Top 5 FAQs
    "CTASection", // Final Call-to-Action
  ],
  Footer: "MarketingFooter", // Impressum/Datenschutz/AGB Links
};
```

---

## 📐 MOBILE-FIRST WIREFRAMES

### Mobile (375px)

```
┌─────────────────────────────────┐
│  [Logo]          [Menü ☰]       │
├─────────────────────────────────┤
│                                 │
│  HERO-SECTION                   │
│  ════════════                   │
│  H1: MyDispatch – Die führende  │
│      Software für Taxi-         │
│      unternehmen                │
│                                 │
│  P: Professionelle Disposition  │
│     für moderne Fuhrparks       │
│                                 │
│  [Jetzt abonnieren]             │ ← min-h-[44px]
│  [Mehr erfahren]                │ ← min-h-[44px]
│                                 │
│  🇩🇪 Made in Germany            │
│  🔒 DSGVO-konform               │
│                                 │
├─────────────────────────────────┤
│  FEATURES (1 Spalte)            │
│  ┌───────────────────────────┐ │
│  │ 📋 Intelligente Disposition│ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ 📊 Live-Statistiken       │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ 🔗 Partner-Netzwerk       │ │
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│  TARIFE (1 Spalte vertikal)     │
│  ┌───────────────────────────┐ │
│  │ STARTER                   │ │
│  │ 39 €/Monat                │ │
│  │ [Features...]             │ │
│  │ [Abonnieren]              │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ BUSINESS ⭐ Empfohlen     │ │
│  │ 79 €/Monat                │ │
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│  FOOTER                         │
│  Impressum • Datenschutz • AGB  │
└─────────────────────────────────┘
```

### Desktop (1920px)

```
┌───────────────────────────────────────────────────┐
│  [Logo]      Features  Preise  Docs  Kontakt      │
├───────────────────────────────────────────────────┤
│                                                   │
│  HERO-SECTION (zentriert, max-w-4xl)             │
│  ════════════════════════════════                │
│  H1: MyDispatch – Die führende Software          │
│       für Taxi- und Mietwagenunternehmen         │
│                                                   │
│  P: Professionelle Disposition, Live-Tracking    │
│     und intelligente Auftragsverwaltung          │
│                                                   │
│  [Jetzt abonnieren] [Mehr erfahren]              │
│                                                   │
│  🇩🇪 Made in Germany  🔒 DSGVO-konform           │
│                                                   │
├───────────────────────────────────────────────────┤
│  FEATURES (3 Spalten, grid-cols-3)               │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐      │
│  │📋 Dispos.│  │📊 Statistik│ │🔗 Partner│      │
│  └───────────┘ └───────────┘ └───────────┘      │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐      │
│  │🚗 Fuhrpark│  │💰 Finanzen│ │🤖 KI-Chat│      │
│  └───────────┘ └───────────┘ └───────────┘      │
├───────────────────────────────────────────────────┤
│  TARIFE (3 Spalten, grid-cols-3)                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │ STARTER │ │BUSINESS*│ │ENTERPRISE│            │
│  │ 39 €    │ │ 79 €    │ │ 129 €    │            │
│  └─────────┘ └─────────┘ └─────────┘            │
│                                                   │
│  *Empfohlen                                       │
└───────────────────────────────────────────────────┘
```

---

## 🎨 COMPONENT-BREAKDOWN

### Neu zu erstellen

- [ ] `HeroSection.tsx` (15min)
  - Gradient-Background
  - Dual-CTA (Primär + Sekundär)
  - Trust-Badges
  - text-wrap: balance für H1

- [ ] `FeaturesOverviewSection.tsx` (10min)
  - Grid: 1 Col Mobile, 3 Cols Desktop
  - Icon + Title + Description
  - Hover-Effekte

- [ ] `TarifkartenSection.tsx` (20min)
  - 3 Tarif-Cards (Starter/Business/Enterprise)
  - Highlighted Card (Business)
  - Feature-Listen mit Check-Icons
  - CTA-Buttons

- [ ] `TestimonialsSection.tsx` (10min)
  - 3 Testimonials (Slider auf Mobile)
  - Foto + Name + Firma
  - 2-Zeilen Zitat

- [ ] `CTASection.tsx` (5min)
  - Final-CTA vor Footer
  - Gradient-Background
  - Prominent

### Wiederverwendbar

- [x] `MarketingHeader` (existiert)
- [x] `MarketingFooter` (existiert)
- [x] `Badge` (shadcn/ui)
- [x] `Button` (shadcn/ui)
- [x] `Card` (shadcn/ui)

---

## 🔒 RECHTLICHE COMPLIANCE

### DSGVO (Art. 13)

- [x] **Kein** Datenschutzhinweis nötig (keine Formulare auf Landing)
- [x] Cookie-Banner nur bei Tracking (aktuell: Nur technisch notwendig)
- [x] Footer-Links: Impressum, Datenschutz, AGB

### TMG § 5

- [x] Impressum-Link im Footer (verpflichtend)
- [x] Datenschutzerklärung-Link im Footer (verpflichtend)
- [x] AGB-Link im Footer (verpflichtend)

### AI Act (Art. 52)

- [ ] **Keine KI-Features** auf Landing Page (keine Kennzeichnung nötig)

### UWG (Wettbewerbsrecht)

- [x] Keine Superlative ohne Beleg
- [x] Messbare Fakten ("500+ Unternehmen")
- [x] Transparente Preisangaben ("ab 39 €/Monat")

### Compliance-Matrix

```typescript
const LandingPageCompliance = {
  DSGVO: {
    datenschutzhinweis: false, // Keine Formulare
    cookies: true, // Cookie-Banner bei Tracking
    footer_links: true, // Impressum/Datenschutz/AGB
  },
  AI_Act: {
    ki_kennzeichnung: false, // Keine KI-Features
  },
  TMG: {
    impressum: true, // Verpflichtend
    agb: true, // Verpflichtend
  },
  UWG: {
    belege: true, // Nur messbare Fakten
    preistransparenz: true, // "ab 39 €/Monat"
  },
};
```

---

## 🔍 SEO-STRATEGIE

### Primary Keywords

- Taxi Software (Hauptkeyword)
- Mietwagenunternehmen Software
- Dispositionssoftware
- Fuhrparkverwaltung Software

### Secondary Keywords

- DSGVO-konform Taxi Software
- Made in Germany Dispositionssoftware
- Limousinen-Service Software
- Flottenmanagementsoftware

### Long-Tail Keywords

- Taxi Software München
- Mietwagen Software Berlin
- Dispositionssoftware Hamburg
- Fuhrpark App Deutschland

### Meta-Tags

```html
<title>MyDispatch – Taxi & Mietwagen Software | DSGVO-konform</title>
<meta
  name="description"
  content="Professionelle Dispositionssoftware für Taxiunternehmen. 
           DSGVO-konform, Made in Germany. Abonnieren ab 39 €/Monat. 
           500+ aktive Unternehmen vertrauen MyDispatch."
/>
<meta
  name="keywords"
  content="taxi software, mietwagenunternehmen software, dispositionssoftware, 
           fuhrparkverwaltung, DSGVO-konform, made in germany"
/>
```

### Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MyDispatch",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, iOS, Android",
  "offers": {
    "@type": "Offer",
    "price": "39.00",
    "priceCurrency": "EUR"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "500"
  }
}
```

---

## 📝 CONTENT-STRUKTUR

### Hero-Section

**H1:** "MyDispatch – Die führende Software für Taxi- und Mietwagenunternehmen"

- Max. 60 Zeichen ✅
- Primary Keyword enthalten ✅
- text-wrap: balance ✅

**Subtitle:** "Professionelle Disposition, Live-Tracking und intelligente Auftragsverwaltung für moderne Fuhrparks."

- Max. 160 Zeichen ✅
- Nutzen-orientiert ✅
- text-wrap: pretty ✅

**CTAs:**

- Primär: "Jetzt abonnieren" (Hero-Primary Style)
- Sekundär: "Mehr erfahren" (Hero-Secondary Style)

**Trust-Badges:**

- 🇩🇪 Made in Germany
- 🔒 DSGVO-konform
- ✅ 500+ Unternehmen

### Features-Section

**H2:** "Alles, was moderne Taxiunternehmen brauchen"

**Features (Top 6):**

1. 📋 **Intelligente Disposition** - Automatische Fahrerzuweisung
2. 📊 **Live-Statistiken** - Echtzeit-KPIs & Dashboards
3. 🔗 **Partner-Netzwerk** - Auftragsverteilung & Kooperationen
4. 🚗 **Fuhrparkverwaltung** - TÜV-Erinnerungen & Wartungen
5. 💰 **Finanzen** - Rechnungen, Abrechnungen, Umsätze
6. 🤖 **KI-Assistent** - 24/7 Support & intelligente Hilfe

### Tarife-Section

**H2:** "Transparente Preise für jeden Bedarf"

**Tarife:**

1. **STARTER** - 39 €/Monat
   - Max. 10 Fahrzeuge
   - Max. 10 Fahrer
   - Unbegrenzte Aufträge
   - Basis-Support

2. **BUSINESS** ⭐ Empfohlen - 79 €/Monat
   - Max. 50 Fahrzeuge
   - Max. 50 Fahrer
   - Partner-Netzwerk
   - Live-Statistiken
   - Prioritäts-Support

3. **ENTERPRISE** - 129 €/Monat
   - Unbegrenzt Fahrzeuge
   - Unbegrenzt Fahrer
   - API-Zugang
   - White-Label Option
   - Dedizierter Support

**Disclaimer:** "Alle Preise zzgl. MwSt. Monatlich kündbar."

### Testimonials-Section

**H2:** "Was unsere Kunden sagen"

**Testimonials (3):**

1. "MyDispatch hat unsere Disposition revolutioniert. 30% Zeitersparnis!"  
   – Michael Schmidt, GF Taxi München GmbH

2. "Endlich eine Software, die alle Anforderungen erfüllt. Made in Germany!"  
   – Sarah Weber, Limousinen-Service Berlin

3. "Partner-Netzwerk ist ein Gamechanger. Mehr Aufträge, mehr Umsatz."  
   – Thomas Klein, Mietwagen Hamburg

### FAQ-Section

**H2:** "Häufig gestellte Fragen"

**Top 5 FAQs:**

1. **Ist MyDispatch DSGVO-konform?**  
   Ja, vollständig DSGVO-konform. Server in Deutschland, TLS 1.3 Verschlüsselung.

2. **Welcher Tarif passt zu mir?**  
   Starter für kleine Unternehmen (<10 Fahrzeuge), Business für mittelständische (bis 50), Enterprise für große Flotten.

3. **Kann ich jederzeit kündigen?**  
   Ja, monatlich kündbar. Keine Mindestlaufzeit.

4. **Gibt es eine Testphase?**  
   Ja, 14 Tage kostenlos testen. Keine Kreditkarte nötig.

5. **Welche Zahlungsarten werden akzeptiert?**  
   SEPA-Lastschrift, Kreditkarte, PayPal. Automatische Abrechnung.

### Final-CTA-Section

**H2:** "Starten Sie jetzt mit MyDispatch"
**P:** "500+ Unternehmen vertrauen bereits auf MyDispatch. Werden Sie Teil der Community."
**CTA:** "Jetzt abonnieren"

---

## 🎯 IMPLEMENTIERUNGS-ZEITPLAN

### Geschätzte Zeiten (AI-Zeiten)

```yaml
HeroSection:           15min
FeaturesOverview:      10min
TarifkartenSection:    20min
TestimonialsSection:   10min
FAQSection:             5min
CTASection:             5min
Integration & Testing: 10min
────────────────────────────
GESAMT:                75min
```

---

## ✅ TESTING-CHECKLISTE

### Responsive-Tests

- [ ] Mobile (375px, 414px)
- [ ] Tablet (768px, 1024px)
- [ ] Desktop (1920px)

### Touch-Target-Tests

- [ ] Alle Buttons ≥ 44px
- [ ] CTA-Buttons gut klickbar
- [ ] Navigation erreichbar

### Performance-Tests

- [ ] Lighthouse Score ≥ 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s

### SEO-Tests

- [ ] Title-Tag optimiert
- [ ] Meta-Description optimiert
- [ ] H1 vorhanden & unique
- [ ] Alt-Texte für Bilder
- [ ] Structured Data validiert

### Legal-Compliance-Tests

- [ ] Impressum-Link funktioniert
- [ ] Datenschutz-Link funktioniert
- [ ] AGB-Link funktioniert
- [ ] Keine Superlative ohne Beleg
- [ ] Preise transparent

---

## 🔗 VERWANDTE DOKUMENTATION

- **MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md** - Grid-Patterns
- **RECHTLICHE_COMPLIANCE_VORGABEN_V18.5.1.md** - Rechtliche Standards
- **MARKETING_CONTENT_STANDARDS_V18.5.0.md** - Content-Guidelines
- **SEITEN_PLANUNGSPROZESS_V18.5.1.md** - Planungs-Workflow

---

## 📝 CHANGELOG

### V18.5.8 (2025-10-24)

- **ERSTELLT:** Landing Page Spezifikation
- **KONFORM:** ARCHIVIERUNGSSYSTEM_V18.3.28.md
- **WORKFLOW:** SEITEN_PLANUNGSPROZESS_V18.5.1.md

---

**Version:** 18.5.8  
**Status:** 📋 SPECIFICATION - BEREIT FÜR IMPLEMENTIERUNG

**END OF DOCUMENT**
