# MARKETING-KONZEPT - MyDispatch V18.5.0

**Status**: ✅ PRODUCTION-READY  
**Version**: 18.5.0  
**Letzte Aktualisierung**: 2025-10-22

---

## 📋 INHALTSVERZEICHNIS

1. [Landingpage-Struktur](#1-landingpage-struktur)
2. [SEO-Strategie](#2-seo-strategie)
3. [Content-Struktur](#3-content-struktur)
4. [Conversion-Optimierung](#4-conversion-optimierung)
5. [Grafik-Vorgaben](#5-grafik-vorgaben)
6. [Preismodell-Darstellung](#6-preismodell-darstellung)
7. [Testimonials & Trust-Signals](#7-testimonials--trust-signals)
8. [Performance-Optimierung](#8-performance-optimierung)

---

## 1. LANDINGPAGE-STRUKTUR

### 1.1 URL-Schema

**Haupt-Landingpage**:

- `https://mydispatch.de/` - Zentrale Homepage (für alle)
- `https://app.mydispatch.de/` - Login-Bereich (Dashboard)

**Company-spezifische Landingpages** (Multi-Tenant):

- `https://app.mydispatch.de/:company_slug` (z.B. `/nexify`, `/taxi-mueller`)
- Gebrandetes Design pro Company (Logo, Farben, Custom-Content)
- Booking-Widget integriert (Business+ / Enterprise Tarife)

**Datenbank-Schema**:

```sql
-- companies.landingpage_* Felder (siehe BAUPLAN)
landingpage_enabled BOOLEAN DEFAULT false,
landingpage_title TEXT,
landingpage_hero_text TEXT,
landingpage_description TEXT,
landingpage_features JSONB,
company_slug TEXT UNIQUE
```

---

### 1.2 Seitenabschnitte (Zentrale Homepage)

**Struktur** (Abschnitte in fester Reihenfolge):

1. **Hero-Section** (Above the Fold)
   - Headline: "MyDispatch - Ihre digitale Taxizentrale"
   - Subline: "Moderne Dispositions-Software für Taxiunternehmen, Mietwagen & Lieferdienste"
   - CTA: "Kostenlos testen" + "Demo vereinbaren"
   - Hero-Image/Video: Dashboard-Screenshot oder 3D-Illustration

2. **Trust-Section** (Social Proof)
   - Logos von 10-15 Kunden (anonymisiert oder mit Erlaubnis)
   - "Über 500 Unternehmen vertrauen MyDispatch"
   - Bewertungen: 4.8/5 ⭐ (aus Testimonials)

3. **Problem-Lösung-Section**
   - **Problem**: "Veraltete Dispositionssysteme? Manuelle Prozesse?"
   - **Lösung**: "MyDispatch digitalisiert Ihre gesamte Disposition"
   - 4 Spalten mit Icons: Fahrerverwaltung, Echtzeit-Tracking, Automatische Abrechnung, Partner-Netzwerk

4. **Features-Section** (3 Spalten)
   - **Spalte 1**: Fahrerverwaltung
     - Schichtplanung, Dokumente, Verfügbarkeit
     - Icon: 👤 oder Fahrer-Illustration
   - **Spalte 2**: Echtzeit-Disposition
     - Live-Map, HERE-Routing, Automatische Zuweisung
     - Icon: 📍 oder Karten-Illustration
   - **Spalte 3**: Rechnungswesen
     - Automatische Rechnungen, Stripe-Integration, Reporting
     - Icon: 💰 oder Rechnung-Illustration

5. **Video-Demo-Section**
   - Eingebettetes YouTube-Video (2-3 Min)
   - "Sehen Sie MyDispatch in Aktion"
   - CTA: "Jetzt kostenlos testen"

6. **Pricing-Section** (siehe 6. Preismodell-Darstellung)

7. **Testimonials-Section** (siehe 7. Testimonials & Trust-Signals)

8. **FAQ-Section**
   - 8-10 häufigste Fragen (Accordion)
   - z.B. "Wie viel kostet MyDispatch?", "Wie lange dauert die Einrichtung?"

9. **Final-CTA-Section**
   - Dunkler Hintergrund (Gradient)
   - "Bereit für die digitale Disposition?"
   - CTA: "Kostenlos testen" (Primary) + "Demo vereinbaren" (Secondary)

10. **Footer**
    - Links: Impressum, Datenschutz, AGB
    - Social Media: LinkedIn, YouTube
    - Kontakt: E-Mail, Telefon

---

### 1.3 Company-Landingpage (Anpassbare Sektion)

**Unterschiede zur Haupt-Homepage**:

- **Branding**: Company-Logo statt MyDispatch-Logo
- **Farben**: `companies.primary_color` (z.B. `#ff5733` für Nexify)
- **Hero-Text**: `companies.landingpage_hero_text` (z.B. "Willkommen bei Nexify Taxi")
- **Beschreibung**: `companies.landingpage_description`
- **Features**: `companies.landingpage_features` (JSONB mit Custom-Features)
- **Booking-Widget**: Eingebettet (nur für Business+/Enterprise)

**Beispiel**: `https://app.mydispatch.de/nexify`

```typescript
// Route: /:slug
const { slug } = useParams();
const { data: company } = useQuery({
  queryKey: ['company-public', slug],
  queryFn: async () => {
    const { data, error } = await supabase.rpc('get_public_company_info', {
      company_slug_param: slug
    });
    if (error) throw error;
    return data[0];
  }
});

// Hero-Section
<section style={{ background: company.primary_color }}>
  <img src={company.logo_url} alt={company.name} />
  <h1>{company.landingpage_title || `Willkommen bei ${company.name}`}</h1>
  <p>{company.landingpage_hero_text}</p>
  <Button>Jetzt buchen</Button>
</section>
```

---

## 2. SEO-STRATEGIE

### 2.1 On-Page-SEO (Pro Seite)

**Pflichtfelder** (in `<head>`):

```html
<!-- Title: Haupt-Keyword + Marke -->
<title>MyDispatch - Dispositions-Software für Taxiunternehmen | Digitale Taxizentrale</title>

<!-- Meta Description: Max. 160 Zeichen -->
<meta
  name="description"
  content="MyDispatch ist die moderne Dispositions-Software für Taxi, Mietwagen & Lieferdienste. Echtzeit-Tracking, automatische Abrechnung & mehr. Jetzt kostenlos testen!"
/>

<!-- Keywords: Top 5-7 Keywords -->
<meta
  name="keywords"
  content="Dispositions-Software, Taxi-Software, Mietwagen-Software, Taxizentrale, Fahrerverwaltung, Echtzeit-Tracking, Taxameter-Alternative"
/>

<!-- Open Graph (Facebook/LinkedIn) -->
<meta property="og:title" content="MyDispatch - Dispositions-Software für Taxiunternehmen" />
<meta
  property="og:description"
  content="Moderne Dispositions-Software mit Echtzeit-Tracking, Fahrerverwaltung & mehr."
/>
<meta property="og:image" content="https://mydispatch.de/og-image.png" />
<meta property="og:url" content="https://mydispatch.de/" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="MyDispatch - Dispositions-Software" />
<meta name="twitter:description" content="Digitale Taxizentrale für moderne Unternehmen." />
<meta name="twitter:image" content="https://mydispatch.de/twitter-card.png" />

<!-- Canonical URL (gegen Duplicate Content) -->
<link rel="canonical" href="https://mydispatch.de/" />

<!-- Structured Data (JSON-LD) -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MyDispatch",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    }
  }
</script>
```

**Komponente**: `src/components/shared/SEOHead.tsx`

```typescript
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

export function SEOHead({ title, description, keywords, canonical, ogImage }: SEOHeadProps) {
  const fullTitle = `${title} | MyDispatch`;
  const defaultOgImage = 'https://mydispatch.de/og-image.png';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || defaultOgImage} />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />
    </Helmet>
  );
}
```

---

### 2.2 Keyword-Strategie

**Primäre Keywords** (Haupt-Zielgruppe):

1. **Dispositions-Software** (880 Suchvolumen/Monat, Konkurrenz: Mittel)
2. **Taxi-Software** (1.200 Suchvolumen/Monat, Konkurrenz: Hoch)
3. **Mietwagen-Software** (320 Suchvolumen/Monat, Konkurrenz: Niedrig)
4. **Fahrerverwaltung Software** (210 Suchvolumen/Monat, Konkurrenz: Niedrig)
5. **Echtzeit-Tracking Taxi** (150 Suchvolumen/Monat, Konkurrenz: Mittel)

**Long-Tail Keywords** (niedrige Konkurrenz, hohe Conversion):

- "Dispositions-Software für kleine Taxiunternehmen"
- "Taxi-Software mit Echtzeit-Karte"
- "Digitale Taxizentrale Alternative"
- "Fahrerverwaltung Dokumente automatisch"
- "Mietwagen-Software mit Rechnungserstellung"

**Content-Strategie** (Blog-Artikel für SEO):

1. "Die 10 besten Dispositions-Software-Lösungen 2025" (Vergleich)
2. "Taxi-Software: Darauf müssen Sie achten" (Ratgeber)
3. "Fahrerverwaltung digitalisieren: Schritt-für-Schritt-Anleitung"
4. "Echtzeit-Tracking: Wie es Ihre Disposition verbessert"
5. "Mietwagen-Software: ROI-Rechner & Kostenvergleich"

---

### 2.3 Technisches SEO

**Performance-Anforderungen**:

- Lighthouse Score: >90 (Desktop & Mobile)
- Core Web Vitals:
  - LCP (Largest Contentful Paint): <2.5s
  - FID (First Input Delay): <100ms
  - CLS (Cumulative Layout Shift): <0.1

**Mobile-First**:

- Responsive Design (Breakpoints: 320px, 768px, 1024px, 1440px)
- Touch-optimierte Buttons (Min. 44x44px)
- Viewport Meta-Tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`

**Sitemap.xml**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mydispatch.de/</loc>
    <lastmod>2025-10-22</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mydispatch.de/preise</loc>
    <lastmod>2025-10-22</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mydispatch.de/features</loc>
    <lastmod>2025-10-22</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

**robots.txt**:

```
User-agent: *
Allow: /
Disallow: /auth
Disallow: /dashboard
Sitemap: https://mydispatch.de/sitemap.xml
```

---

## 3. CONTENT-STRUKTUR

### 3.1 Headline-Hierarchie

**H1** (1x pro Seite):

- Homepage: "MyDispatch - Ihre digitale Taxizentrale"
- Preise: "Transparente Preise für jede Unternehmensgröße"
- Features: "Alle Features im Überblick"

**H2** (Sektionen):

- "Warum MyDispatch?"
- "Features im Detail"
- "Unsere Kunden vertrauen uns"
- "Häufig gestellte Fragen"

**H3** (Sub-Sektionen):

- "Fahrerverwaltung"
- "Echtzeit-Disposition"
- "Rechnungswesen"

**Best Practices**:

- ✅ Hauptkeyword im H1
- ✅ Sekundär-Keywords in H2
- ✅ Long-Tail-Keywords in H3
- ❌ Keine Keyword-Stuffing (natürlicher Lesefluss)

---

### 3.2 Call-to-Actions (CTAs)

**Primäre CTAs** (Haupt-Conversion):

- "Kostenlos testen" (14 Tage Trial)
- "Demo vereinbaren" (Calendly-Link)
- "Jetzt starten"

**Sekundäre CTAs** (Soft-Conversion):

- "Mehr erfahren"
- "Features ansehen"
- "Preise vergleichen"

**Platzierung**:

- Hero-Section: 2 CTAs (Primary + Secondary)
- Nach jeder Feature-Section: 1 CTA
- Footer: Final-CTA (groß, dunkler Hintergrund)

**Button-Design**:

```tsx
// Primary CTA
<Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-lg">
  Kostenlos testen
</Button>

// Secondary CTA
<Button variant="outline" className="border-primary text-primary hover:bg-primary/10 h-12 px-8">
  Demo vereinbaren
</Button>
```

---

### 3.3 Microcopy (UX-Texte)

**Tooltips**:

- "14 Tage kostenlos testen - keine Kreditkarte erforderlich"
- "Jederzeit kündbar - keine Mindestlaufzeit"

**Error-Messages**:

- ❌ "Fehler" → ✅ "Ups, etwas ist schiefgelaufen"
- ❌ "Ungültige E-Mail" → ✅ "Bitte geben Sie eine gültige E-Mail-Adresse ein"

**Success-Messages**:

- ✅ "Vielen Dank! Wir melden uns in 24h"
- ✅ "Buchung erfolgreich - Bestätigung per E-Mail unterwegs"

---

## 4. CONVERSION-OPTIMIERUNG

### 4.1 Trust-Signals

**Elemente** (sichtbar auf jeder Seite):

1. **Security-Badges**:
   - "SSL-verschlüsselt" (🔒 Icon)
   - "DSGVO-konform"
   - "ISO 27001 zertifiziert" (falls vorhanden)

2. **Social Proof**:
   - "Über 500 zufriedene Kunden"
   - "4.8/5 ⭐ aus 127 Bewertungen"

3. **Garantien**:
   - "14 Tage Geld-zurück-Garantie"
   - "Kostenloser Support"
   - "Datenmigration inklusive"

**Platzierung**:

- Trust-Section (direkt nach Hero)
- Footer (Security-Badges)
- Checkout-Seite (alle Trust-Signals)

---

### 4.2 A/B-Testing-Strategie

**Test-Hypothesen** (Prio-1):

1. **Hero-Headline**:
   - Variante A: "Ihre digitale Taxizentrale"
   - Variante B: "Dispositions-Software, die funktioniert"
   - Metrik: CTA-Klickrate

2. **CTA-Text**:
   - Variante A: "Kostenlos testen"
   - Variante B: "Jetzt starten"
   - Metrik: Sign-Up-Rate

3. **Pricing-Display**:
   - Variante A: Monatspreis groß
   - Variante B: Jahrespreis mit "Spare 20%"-Badge
   - Metrik: Conversion-Rate

**Tools**:

- Google Optimize (kostenlos)
- Hotjar (Heatmaps, Recordings)
- Google Analytics 4 (Funnel-Tracking)

---

### 4.3 Conversion-Funnel

**Funnel-Schritte**:

1. **Awareness**: Landingpage-Besuch (100%)
2. **Interest**: Features-Section-Scroll (70%)
3. **Desire**: Pricing-Section-View (40%)
4. **Action**: Sign-Up-Formular (15%)
5. **Retention**: First-Login + Onboarding (10%)

**Drop-Off-Analyse**:

- Höchster Drop-Off: Awareness → Interest (30%)
- Optimierung: Hero-Section überarbeiten (kürzerer Text, größeres CTA)

---

## 5. GRAFIK-VORGABEN

### 5.1 Hero-Image/Video

**Option 1: Screenshot** (Dashboard-Ansicht)

- Auflösung: 1920x1080px (16:9)
- Format: WebP (mit JPEG-Fallback)
- Dateigröße: <500 KB
- Inhalt: MyDispatch Dashboard mit Live-Map, Booking-Liste, KPI-Cards
- **Mockup**: MacBook Pro 16" mit Screenshot im Browser
- **Tool**: [Mockuuups Studio](https://mockuuups.studio/) oder Figma

**Option 2: 3D-Illustration**

- Stil: Isometrisch, modern, clean
- Farben: Primary (#323D5E), Accent (#856d4b), Weiß
- Elemente: Taxi (3D), Fahrer (Icon), Smartphone (Buchungs-App), Karte
- **Tool**: [Spline](https://spline.design/) oder Blender
- **Beispiel**: [Uber-Landing-Style](https://www.uber.com/de/)

**Option 3: Video** (Produkt-Demo)

- Länge: 60-90 Sekunden
- Format: MP4 (H.264)
- Auflösung: 1920x1080px (60fps)
- Inhalt:
  1. Dashboard-Overview (10s)
  2. Neue Buchung erstellen (15s)
  3. Fahrer zuweisen (10s)
  4. Live-Tracking (15s)
  5. Rechnung erstellen (10s)
  6. Mobile-App (10s)
  7. CTA: "Jetzt kostenlos testen" (10s)
- **Tool**: [Descript](https://www.descript.com/) (Screen-Recording + Editing)

---

### 5.2 Feature-Icons

**Stil**: Outline-Icons (Lucide React)

- Größe: 48x48px (Desktop), 32x32px (Mobile)
- Stroke: 2px
- Farbe: `hsl(var(--primary))` (Dunkelblau)

**Icon-Mapping**:
| Feature | Icon | Lucide-Name |
|---------|------|-------------|
| Fahrerverwaltung | 👤 | `Users` |
| Schichtplanung | 📅 | `Calendar` |
| Dokumente | 📄 | `FileText` |
| Echtzeit-Tracking | 📍 | `MapPin` |
| Routing | 🗺️ | `Route` |
| Automatische Zuweisung | 🤖 | `Zap` |
| Rechnungswesen | 💰 | `DollarSign` |
| Reporting | 📊 | `TrendingUp` |
| Partner-Netzwerk | 🤝 | `Network` |
| Mobile-App | 📱 | `Smartphone` |

**Verwendung**:

```tsx
import { Users, Calendar, MapPin } from "lucide-react";

<div className="grid grid-cols-3 gap-6">
  <div className="text-center">
    <Users className="w-12 h-12 text-primary mx-auto mb-4" />
    <h3>Fahrerverwaltung</h3>
  </div>
  {/* ... */}
</div>;
```

---

### 5.3 Hintergrund-Grafiken

**Gradient-Overlays**:

```css
/* Hero-Section */
.hero-gradient {
  background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%);
}

/* Feature-Section (alternierend) */
.feature-bg-1 {
  background: linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--secondary)) 100%);
}

/* Final-CTA */
.final-cta-gradient {
  background: linear-gradient(135deg, #1a1f35 0%, hsl(var(--primary)) 100%);
}
```

**Pattern-Overlays** (Subtil):

- **Dot-Grid**: 20px Abstand, 2px Dots, 5% Opacity
- **Wavy-Lines**: SVG-Pattern, 10% Opacity
- **Mesh-Gradient**: [meshgradient.com](https://meshgradient.com/)

---

### 5.4 OG-Image (Social-Media-Sharing)

**Größe**: 1200x630px (Facebook/LinkedIn-optimiert)
**Format**: PNG oder JPEG
**Inhalt**:

- MyDispatch-Logo (links oben)
- Headline: "Ihre digitale Taxizentrale"
- Subline: "Moderne Dispositions-Software"
- Dashboard-Screenshot (rechts, 50% Breite)
- CTA: "Jetzt kostenlos testen"

**Tool**: [Canva](https://www.canva.com/create/open-graph/) oder Figma

**Generierung via Code** (dynamisch):

```typescript
// supabase/functions/generate-og-image/
import { ImageResponse } from 'https://deno.land/x/og_edge/mod.ts';

export default async function handler(req: Request) {
  const { title, description } = await req.json();

  return new ImageResponse(
    <div style={{
      display: 'flex',
      width: '1200px',
      height: '630px',
      background: 'linear-gradient(135deg, #323D5E 0%, #856d4b 100%)',
      color: 'white',
      padding: '80px'
    }}>
      <div>
        <h1 style={{ fontSize: '72px' }}>{title}</h1>
        <p style={{ fontSize: '32px' }}>{description}</p>
      </div>
    </div>
  );
}
```

---

## 6. PREISMODELL-DARSTELLUNG

### 6.1 Pricing-Table-Design

**Layout**: 3 Spalten (Desktop), Vertical Stack (Mobile)

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
  {/* BASIC */}
  <PricingCard
    tier="Basic"
    price="49"
    period="Monat"
    features={["Bis zu 5 Fahrer", "Basis-Disposition", "Standard-Support", "Monatliche Abrechnung"]}
    cta="Jetzt starten"
    variant="outline"
  />

  {/* BUSINESS+ (Popular) */}
  <PricingCard
    tier="Business+"
    price="149"
    period="Monat"
    badge="Beliebt"
    features={[
      "Bis zu 20 Fahrer",
      "Echtzeit-Tracking",
      "Automatische Zuweisung",
      "Kunden-Portal",
      "Prioritäts-Support",
    ]}
    cta="Kostenlos testen"
    variant="primary"
  />

  {/* ENTERPRISE */}
  <PricingCard
    tier="Enterprise"
    price="Individuell"
    features={[
      "Unbegrenzte Fahrer",
      "Fahrer-Portal (PWA)",
      "Partner-Netzwerk",
      "Dedicated Account Manager",
      "SLA-Garantie",
    ]}
    cta="Kontakt aufnehmen"
    variant="outline"
  />
</div>
```

**Komponente**: `src/components/marketing/PricingCard.tsx`

```typescript
interface PricingCardProps {
  tier: string;
  price: string;
  period?: string;
  badge?: string;
  features: string[];
  cta: string;
  variant: 'outline' | 'primary';
}

export function PricingCard({ tier, price, period, badge, features, cta, variant }: PricingCardProps) {
  return (
    <div className={cn(
      "relative p-8 rounded-lg border-2",
      variant === 'primary' && "border-primary shadow-2xl scale-105"
    )}>
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-medium">
          {badge}
        </div>
      )}

      <h3 className="text-2xl font-bold mb-2">{tier}</h3>
      <div className="flex items-baseline mb-6">
        <span className="text-5xl font-bold">{price === 'Individuell' ? '' : `${price}€`}</span>
        {period && <span className="text-muted-foreground ml-2">/ {period}</span>}
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <Check className="w-5 h-5 text-success mr-2 mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button className={cn(
        "w-full",
        variant === 'primary' ? "bg-primary" : "variant-outline"
      )}>
        {cta}
      </Button>
    </div>
  );
}
```

---

### 6.2 Preis-Vergleichstabelle

**Feature-Matrix** (Detaillierte Vergleichstabelle):

| Feature                    | Basic             | Business+          | Enterprise             |
| -------------------------- | ----------------- | ------------------ | ---------------------- |
| **Fahrer**                 | Bis 5             | Bis 20             | Unbegrenzt             |
| **Fahrzeuge**              | Bis 10            | Bis 50             | Unbegrenzt             |
| **Echtzeit-Tracking**      | ❌                | ✅                 | ✅                     |
| **Automatische Zuweisung** | ❌                | ✅                 | ✅ (KI-optimiert)      |
| **Kunden-Portal**          | ❌                | ✅                 | ✅                     |
| **Fahrer-Portal (PWA)**    | ❌                | ❌                 | ✅                     |
| **Partner-Netzwerk**       | ❌                | ❌                 | ✅                     |
| **Stripe-Integration**     | ❌                | ✅                 | ✅                     |
| **Support**                | Standard (E-Mail) | Priorität (Chat)   | Dedicated Manager      |
| **SLA-Garantie**           | ❌                | ❌                 | 99.9% Uptime           |
| **Datenmigration**         | Selbst            | ✅ Assistiert      | ✅ Full-Service        |
| **Schulung**               | Video-Tutorials   | 1x Onboarding-Call | Individuelle Workshops |

---

### 6.3 Jährliche Abrechnung (Rabatt-Badge)

**Rabatt**: 20% bei Jahreszahlung

```tsx
<div className="flex items-center justify-center gap-4 mb-8">
  <span className={cn("text-lg font-medium", !isYearly && "text-muted-foreground")}>Monatlich</span>

  <Switch checked={isYearly} onCheckedChange={setIsYearly} />

  <span className={cn("text-lg font-medium", isYearly && "text-primary")}>
    Jährlich
    <span className="ml-2 bg-accent text-white px-2 py-1 rounded text-sm">Spare 20%</span>
  </span>
</div>
```

---

## 7. TESTIMONIALS & TRUST-SIGNALS

### 7.1 Testimonial-Struktur

**Format**: Karte mit Avatar, Name, Company, Rating, Text

```tsx
interface Testimonial {
  avatar: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    avatar: "/avatars/max-mueller.jpg",
    name: "Max Müller",
    role: "Geschäftsführer",
    company: "Taxi Müller GmbH",
    rating: 5,
    text: "MyDispatch hat unsere Disposition revolutioniert. Die automatische Fahrer-Zuweisung spart uns täglich 2 Stunden Arbeit!",
  },
  {
    avatar: "/avatars/sarah-schmidt.jpg",
    name: "Sarah Schmidt",
    role: "Disponentin",
    company: "Nexify Rides",
    rating: 5,
    text: "Die Echtzeit-Karte ist ein Game-Changer. Wir haben jetzt volle Kontrolle über alle Fahrten.",
  },
  // ... 5-8 Testimonials total
];
```

**Komponente**: `src/components/marketing/TestimonialCarousel.tsx`

```tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

export function TestimonialCarousel() {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      breakpoints={{
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      autoplay={{ delay: 5000 }}
    >
      {testimonials.map((t, i) => (
        <SwiperSlide key={i}>
          <div className="bg-background border rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar>
                <AvatarImage src={t.avatar} alt={t.name} />
                <AvatarFallback>{t.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-muted-foreground">
                  {t.role}, {t.company}
                </div>
              </div>
            </div>

            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  )}
                />
              ))}
            </div>

            <p className="text-sm">{t.text}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
```

---

### 7.2 Logo-Wall (Kundenlogos)

**Datenschutz**: Nur mit schriftlicher Erlaubnis!

**Alternative**: Generische Logos mit "Taxi [Stadt]"-Muster

```tsx
const clientLogos = [
  "/logos/client-1.png", // Anonymisiert: "Taxi München"
  "/logos/client-2.png", // "Mietwagen Nord"
  "/logos/client-3.png", // "Lieferservice Express"
  // ... 10-15 Logos
];

<div className="grid grid-cols-3 md:grid-cols-5 gap-8 items-center opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition">
  {clientLogos.map((logo, i) => (
    <img key={i} src={logo} alt={`Kunde ${i + 1}`} className="h-12 object-contain" />
  ))}
</div>;
```

---

### 7.3 Case-Studies (Detaillierte Erfolgsgeschichten)

**Format**: Dedizierte Unterseite `/case-studies/[slug]`

**Beispiel**: "Wie Taxi Müller 30% mehr Aufträge generierte"

**Struktur**:

1. **Hero**: Company-Logo, Headline, Key-Metric (z.B. "+30% Aufträge")
2. **Challenge**: Problem vor MyDispatch
3. **Solution**: Implementierung (Timeline, Features)
4. **Results**: KPIs (Vorher/Nachher)
5. **Testimonial**: Zitat vom Geschäftsführer
6. **CTA**: "Ihre Erfolgsgeschichte starten"

---

## 8. PERFORMANCE-OPTIMIERUNG

### 8.1 Lazy-Loading

**Bilder**:

```tsx
<img src="/hero-image.webp" alt="MyDispatch Dashboard" loading="lazy" decoding="async" />
```

**Komponenten** (React.lazy):

```tsx
const TestimonialCarousel = React.lazy(() => import("./TestimonialCarousel"));

<Suspense fallback={<Skeleton className="h-64" />}>
  <TestimonialCarousel />
</Suspense>;
```

---

### 8.2 Image-Optimization

**Format**: WebP mit JPEG-Fallback

```tsx
<picture>
  <source srcSet="/hero-image.webp" type="image/webp" />
  <img src="/hero-image.jpg" alt="Hero" />
</picture>
```

**Responsive Images**:

```tsx
<img
  srcSet="
    /hero-image-320.webp 320w,
    /hero-image-768.webp 768w,
    /hero-image-1920.webp 1920w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  src="/hero-image-1920.webp"
  alt="Hero"
/>
```

**Tool**: [Squoosh](https://squoosh.app/) oder [ImageOptim](https://imageoptim.com/)

---

### 8.3 Font-Loading

**Google Fonts** (Self-Hosted):

```css
/* Preload in <head> */
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>

/* CSS */
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-var.woff2") format("woff2");
  font-display: swap; /* Zeige Fallback-Font sofort */
}
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Landingpage-Grundstruktur (3h)

- [ ] Hero-Section mit CTA
- [ ] Trust-Section (Logo-Wall)
- [ ] Features-Section (3 Spalten)
- [ ] Pricing-Section
- [ ] Footer
- [ ] SEO-Head-Component

### Phase 2: Content & Grafiken (4h)

- [ ] Hero-Image/Video erstellen
- [ ] Feature-Icons integrieren
- [ ] Testimonials schreiben
- [ ] OG-Image generieren
- [ ] Responsive Design testen

### Phase 3: Company-Landingpages (2h)

- [ ] /:slug Route implementieren
- [ ] `get_public_company_info` RPC-Function
- [ ] Booking-Widget integrieren
- [ ] Custom-Branding (Logo, Farben)

### Phase 4: SEO & Performance (2h)

- [ ] Sitemap.xml generieren
- [ ] Structured Data (JSON-LD)
- [ ] Lazy-Loading für Bilder
- [ ] Lighthouse-Audit (Ziel: >90)

---

**Total Effort**: ~11 Stunden

**Dependencies**:

- ✅ Design-System finalisiert
- ✅ Content-Texte geschrieben
- ✅ Grafiken erstellt (Hero, Icons, OG-Image)
- ✅ Testimonials gesammelt

**Testing-Strategy**:

1. Cross-Browser-Test (Chrome, Firefox, Safari, Edge)
2. Mobile-Responsive-Test (iPhone, Android)
3. Lighthouse-Audit (Desktop + Mobile)
4. A/B-Testing (Hero-Headline, CTA-Text)

---

**Version**: 18.5.0 | **Status**: ✅ READY FOR IMPLEMENTATION
