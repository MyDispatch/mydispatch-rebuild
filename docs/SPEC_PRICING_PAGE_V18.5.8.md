# 💰 PRICING PAGE SPECIFICATION V18.5.8

**Status:** 📋 Spezifikation  
**Route:** `/preise`  
**Letzte Aktualisierung:** 2025-10-24  
**Verantwortlich:** NeXify AI Development Agent  
**Klassifizierung:** Marketing (ÖFFENTLICH)

---

## 📊 EXECUTIVE SUMMARY

### Zweck
Die Pricing Page zeigt alle verfügbaren Tarife mit vollständiger Feature-Matrix und dient der **Konversion** (Trial-Start oder direktes Abo).

### Zielgruppe
- Entscheider, die bereits Interesse haben
- Vergleichende Nutzer (Wettbewerbs-Analyse)
- Budget-bewusste Unternehmer

### Kernbotschaft
> "Transparente Preise. Keine versteckten Kosten. Monatlich kündbar. Ab 39 €/Monat."

---

## 🏗️ ARCHITEKTUR-ENTSCHEIDUNGEN

### Layout
```typescript
Layout: MarketingLayout
Grid: TARIF-KARTEN-GRID (3 Spalten Desktop, 1 Spalte Mobile)
Responsive: Mobile-First (3 Breakpoints: sm, md, lg)
```

### Component-Struktur
```typescript
const PageStructure = {
  Header: 'MarketingHeader',
  Sections: [
    'PricingHeroSection',          // H1 + Subtitle
    'TariffComparisonSection',     // 3 Tarif-Cards mit Feature-Matrix
    'DetailedFeaturesSection',     // Vollständige Feature-Liste
    'FAQPricingSection',           // Pricing-spezifische FAQs
    'EnterpriseCTASection',        // Für Custom-Anfragen
    'TrustSection',                // Sicherheits-Garantien
  ],
  Footer: 'MarketingFooter',
};
```

---

## 📐 MOBILE-FIRST WIREFRAMES

### Mobile (375px)
```
┌─────────────────────────────────┐
│  [Logo]          [Menü ☰]       │
├─────────────────────────────────┤
│  HERO                           │
│  H1: Transparente Preise        │
│  P: Monatlich kündbar           │
├─────────────────────────────────┤
│  TARIFE (vertikal)              │
│  ┌───────────────────────────┐ │
│  │ STARTER                   │ │
│  │ 39 €/Monat                │ │
│  │ ─────────────             │ │
│  │ ✅ Max. 10 Fahrzeuge      │ │
│  │ ✅ Max. 10 Fahrer         │ │
│  │ ✅ Unbegrenzt Aufträge    │ │
│  │ ✅ Basis-Support          │ │
│  │ ❌ Partner-Netzwerk       │ │
│  │ ❌ Live-Statistiken       │ │
│  │                           │ │
│  │ [Jetzt starten]           │ │ ← min-h-[44px]
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ BUSINESS ⭐               │ │
│  │ 79 €/Monat                │ │
│  │ [Empfohlen]               │ │
│  │ ─────────────             │ │
│  │ ✅ Max. 50 Fahrzeuge      │ │
│  │ ✅ Max. 50 Fahrer         │ │
│  │ ✅ Partner-Netzwerk       │ │
│  │ ✅ Live-Statistiken       │ │
│  │ ✅ Prioritäts-Support     │ │
│  │                           │ │
│  │ [Jetzt starten]           │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ ENTERPRISE                │ │
│  │ 129 €/Monat               │ │
│  │ ─────────────             │ │
│  │ ✅ Unbegrenzt Fahrzeuge   │ │
│  │ ✅ API-Zugang             │ │
│  │ ✅ White-Label            │ │
│  │ ✅ Dedizierter Support    │ │
│  │                           │ │
│  │ [Jetzt starten]           │ │
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│  FEATURE-MATRIX                 │
│  [Tabelle: Mobile-optimiert]    │
├─────────────────────────────────┤
│  FAQ                            │
│  [Accordion mit 5 Fragen]       │
└─────────────────────────────────┘
```

### Desktop (1920px)
```
┌───────────────────────────────────────────────────┐
│  [Logo]      Features  Preise  Docs  Kontakt      │
├───────────────────────────────────────────────────┤
│  HERO (zentriert)                                 │
│  H1: Transparente Preise für jeden Bedarf        │
│  P: Keine versteckten Kosten. Monatlich kündbar. │
├───────────────────────────────────────────────────┤
│  TARIFE (3 Spalten, grid-cols-3)                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │ STARTER │ │BUSINESS*│ │ENTERPRISE│            │
│  │ 39 €    │ │ 79 €    │ │ 129 €    │            │
│  │ ─────── │ │ ─────── │ │ ─────── │            │
│  │ Feature │ │ Feature │ │ Feature │            │
│  │ Liste   │ │ Liste   │ │ Liste   │            │
│  │         │ │         │ │         │            │
│  │ [Start] │ │ [Start] │ │ [Start] │            │
│  └─────────┘ └─────────┘ └─────────┘            │
│                                                   │
│  *Empfohlen für mittelständische Unternehmen     │
├───────────────────────────────────────────────────┤
│  FEATURE-MATRIX (Tabelle)                        │
│  ┌──────────────┬────────┬─────────┬────────────┐│
│  │ Feature      │Starter │Business │Enterprise  ││
│  ├──────────────┼────────┼─────────┼────────────┤│
│  │ Fahrzeuge    │ 10     │ 50      │ Unbegrenzt ││
│  │ Fahrer       │ 10     │ 50      │ Unbegrenzt ││
│  │ Partner      │ ❌     │ ✅      │ ✅         ││
│  │ Statistiken  │ ❌     │ ✅      │ ✅         ││
│  │ API          │ ❌     │ ❌      │ ✅         ││
│  └──────────────┴────────┴─────────┴────────────┘│
└───────────────────────────────────────────────────┘
```

---

## 🎨 COMPONENT-BREAKDOWN

### Neu zu erstellen
- [ ] `PricingHeroSection.tsx` (5min)
  - Kurz & prägnant
  - Keine CTAs (kommen in Tarif-Cards)

- [ ] `TariffComparisonSection.tsx` (25min)
  - 3 Tarif-Cards (wiederverwendbar von Landing)
  - Feature-Listen pro Tarif
  - Highlighted Card (Business)
  - Individual CTAs

- [ ] `DetailedFeaturesMatrix.tsx` (15min)
  - Responsive Tabelle
  - Mobile: Card-basiert
  - Desktop: Volle Tabelle
  - Legende (✅ Enthalten, ⚠️ Eingeschränkt, ❌ Nicht verfügbar)

- [ ] `FAQPricingSection.tsx` (10min)
  - Pricing-spezifische Fragen
  - Accordion-basiert
  - 5-7 Fragen

- [ ] `EnterpriseCTASection.tsx` (5min)
  - Für Custom-Anfragen
  - "Individuelle Lösung benötigt? Kontaktieren Sie uns."

- [ ] `TrustSection.tsx` (5min)
  - Sicherheits-Garantien
  - 14-Tage-Geld-zurück
  - 99,9% Uptime

### Wiederverwendbar
- [x] `MarketingHeader`
- [x] `MarketingFooter`
- [x] `Badge`
- [x] `Button`
- [x] `Card`
- [x] `Accordion` (shadcn/ui)

---

## 🔒 RECHTLICHE COMPLIANCE

### DSGVO
- [x] Kein Datenschutzhinweis nötig (keine Formulare)
- [x] Footer-Links vorhanden

### TMG § 5
- [x] Impressum-Link (verpflichtend)
- [x] AGB-Link (verpflichtend bei Preisen!)

### Preisangabenverordnung (PAngV)
- [x] Bruttopreise anzeigen (inkl. MwSt.)
- [x] Disclaimer: "Alle Preise zzgl. 19% MwSt."
- [x] Mindestlaufzeit: "Monatlich kündbar"
- [x] Kündigungsfrist: "Zum Monatsende"

### UWG (Wettbewerbsrecht)
- [x] Keine "Ab"-Preise ohne Kontext
- [x] Transparente Feature-Zuordnung
- [x] Kein Kleingedrucktes mit versteckten Kosten

### Compliance-Matrix
```typescript
const PricingPageCompliance = {
  DSGVO: {
    datenschutzhinweis: false,
    footer_links: true,
  },
  TMG: {
    impressum: true,
    agb: true,  // Verpflichtend!
  },
  PAngV: {
    bruttopreise: true,
    disclaimer: "Alle Preise zzgl. 19% MwSt.",
    laufzeit: "Monatlich kündbar",
  },
  UWG: {
    transparenz: true,
    keine_versteckten_kosten: true,
  },
};
```

---

## 🔍 SEO-STRATEGIE

### Primary Keywords
- MyDispatch Preise
- Taxi Software Kosten
- Dispositionssoftware Preis
- Fuhrparkverwaltung Tarife

### Secondary Keywords
- Taxi Software günstig
- Mietwagenunternehmen Software Abo
- Dispositionssoftware monatlich kündbar

### Meta-Tags
```html
<title>MyDispatch Preise – Transparente Tarife ab 39 €/Monat</title>
<meta 
  name="description" 
  content="MyDispatch Tarife: Starter 39 €, Business 79 €, Enterprise 129 €. 
           Monatlich kündbar. Keine versteckten Kosten. 14 Tage kostenlos testen."
/>
```

### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "MyDispatch Starter",
  "offers": [
    {
      "@type": "Offer",
      "name": "Starter",
      "price": "39.00",
      "priceCurrency": "EUR",
      "billingIncrement": "P1M"
    },
    {
      "@type": "Offer",
      "name": "Business",
      "price": "79.00",
      "priceCurrency": "EUR"
    },
    {
      "@type": "Offer",
      "name": "Enterprise",
      "price": "129.00",
      "priceCurrency": "EUR"
    }
  ]
}
```

---

## 📝 CONTENT-STRUKTUR

### Hero-Section
**H1:** "Transparente Preise für jeden Bedarf"
**P:** "Keine versteckten Kosten. Keine Mindestlaufzeit. Monatlich kündbar. Abonnieren ab 39 €/Monat."

### Tariffe-Section
**H2:** "Wählen Sie den passenden Tarif"

**Tarife (detailliert):**

#### 1. STARTER – 39 €/Monat
- ✅ Max. 10 Fahrzeuge
- ✅ Max. 10 Fahrer
- ✅ Unbegrenzt Aufträge
- ✅ Kundenverwaltung
- ✅ Basis-Dashboard
- ✅ E-Mail-Support
- ❌ Partner-Netzwerk
- ❌ Live-Statistiken
- ❌ API-Zugang

**Ideal für:** Kleine Taxiunternehmen, Einzelunternehmer

#### 2. BUSINESS – 79 €/Monat ⭐ Empfohlen
- ✅ Max. 50 Fahrzeuge
- ✅ Max. 50 Fahrer
- ✅ Unbegrenzt Aufträge
- ✅ Partner-Netzwerk
- ✅ Live-Statistiken
- ✅ Erweiterte Berichte
- ✅ Prioritäts-Support
- ✅ GPS-Tracking (24h)
- ❌ API-Zugang
- ❌ White-Label

**Ideal für:** Mittelständische Unternehmen, Mietwagenfirmen

#### 3. ENTERPRISE – 129 €/Monat
- ✅ Unbegrenzt Fahrzeuge
- ✅ Unbegrenzt Fahrer
- ✅ Partner-Netzwerk
- ✅ Live-Statistiken
- ✅ Vollständige API
- ✅ White-Label Option
- ✅ Dedizierter Support
- ✅ Custom-Integrationen
- ✅ On-Premise Option

**Ideal für:** Große Flotten, Franchise-Systeme

**Disclaimer:** "Alle Preise zzgl. 19% MwSt. Monatlich kündbar zum Monatsende. Keine Mindestlaufzeit."

### Feature-Matrix-Section
**H2:** "Vollständiger Feature-Vergleich"

**Tabelle:**
| Feature | Starter | Business | Enterprise |
|---------|---------|----------|------------|
| **Verwaltung** ||||
| Fahrzeuge | 10 | 50 | Unbegrenzt |
| Fahrer | 10 | 50 | Unbegrenzt |
| Aufträge | Unbegrenzt | Unbegrenzt | Unbegrenzt |
| Kunden | Unbegrenzt | Unbegrenzt | Unbegrenzt |
| **Funktionen** ||||
| Intelligente Disposition | ✅ | ✅ | ✅ |
| GPS-Tracking (24h) | ❌ | ✅ | ✅ |
| Partner-Netzwerk | ❌ | ✅ | ✅ |
| Live-Statistiken | ❌ | ✅ | ✅ |
| Erweiterte Berichte | ❌ | ✅ | ✅ |
| KI-Assistent | ✅ | ✅ | ✅ |
| **Integration** ||||
| API-Zugang | ❌ | ❌ | ✅ |
| Webhooks | ❌ | ❌ | ✅ |
| White-Label | ❌ | ❌ | ✅ |
| Custom-Integrationen | ❌ | ❌ | ✅ |
| **Support** ||||
| E-Mail-Support | ✅ | ✅ | ✅ |
| Prioritäts-Support | ❌ | ✅ | ✅ |
| Telefon-Support | ❌ | ⚠️ | ✅ |
| Dedizierter Account-Manager | ❌ | ❌ | ✅ |

**Legende:**
- ✅ Enthalten
- ⚠️ Eingeschränkt
- ❌ Nicht verfügbar

### FAQ-Section
**H2:** "Häufig gestellte Fragen zu Preisen"

1. **Gibt es eine Mindestlaufzeit?**  
   Nein, monatlich kündbar zum Monatsende.

2. **Was passiert bei Überschreitung der Limits?**  
   Sie erhalten eine Benachrichtigung und können auf den nächsten Tarif upgraden.

3. **Kann ich den Tarif wechseln?**  
   Ja, jederzeit Upgrade möglich. Downgrade zum nächsten Abrechnungszeitraum.

4. **Gibt es eine Testphase?**  
   Ja, 14 Tage kostenlos testen. Keine Kreditkarte erforderlich.

5. **Welche Zahlungsarten werden akzeptiert?**  
   SEPA-Lastschrift, Kreditkarte, PayPal.

6. **Sind die Preise inkl. MwSt.?**  
   Nein, alle Preise zzgl. 19% MwSt.

7. **Was ist bei Enterprise enthalten?**  
   Custom-Lösungen, White-Label, API, dedizierter Support. Kontaktieren Sie uns für Details.

### Enterprise-CTA-Section
**H2:** "Individuelle Lösung benötigt?"
**P:** "Große Flotten, spezielle Anforderungen oder On-Premise Installation? Wir erstellen Ihnen ein individuelles Angebot."
**CTA:** "Jetzt Kontakt aufnehmen"

### Trust-Section
**H2:** "Unsere Garantien"
- ✅ 14 Tage Geld-zurück-Garantie
- ✅ 99,9% Uptime-Garantie
- ✅ DSGVO-konform
- ✅ Made in Germany
- ✅ Monatlich kündbar

---

## 🎯 IMPLEMENTIERUNGS-ZEITPLAN

```yaml
PricingHeroSection:         5min
TariffComparison:          25min
DetailedFeaturesMatrix:    15min
FAQPricingSection:         10min
EnterpriseCTASection:       5min
TrustSection:               5min
Integration & Testing:     10min
─────────────────────────────────
GESAMT:                    75min
```

---

## ✅ TESTING-CHECKLISTE

### Responsive-Tests
- [ ] Mobile: Tarif-Cards vertikal
- [ ] Desktop: Tarif-Cards 3 Spalten
- [ ] Feature-Matrix: Mobile Card-basiert, Desktop Tabelle

### Rechtliche-Tests
- [ ] AGB-Link funktioniert
- [ ] Disclaimer sichtbar
- [ ] Preise inkl. MwSt.-Hinweis
- [ ] Kündigungsfristen klar

### Conversion-Tests
- [ ] CTAs prominent
- [ ] Business-Tarif highlighted
- [ ] Feature-Unterschiede klar
- [ ] FAQ beantwortet Einwände

---

## 🔗 VERWANDTE DOKUMENTATION

- **MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md** - Grid-Patterns
- **RECHTLICHE_COMPLIANCE_VORGABEN_V18.5.1.md** - Preisangaben-Pflicht
- **MARKETING_CONTENT_STANDARDS_V18.5.0.md** - Tarif-Präsentation

---

## 📝 CHANGELOG

### V18.5.8 (2025-10-24)
- **ERSTELLT:** Pricing Page Spezifikation

---

**Version:** 18.5.8  
**Status:** 📋 SPECIFICATION - BEREIT FÜR IMPLEMENTIERUNG

**END OF DOCUMENT**
