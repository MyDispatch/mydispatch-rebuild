# 🎯 MyDispatch MASTER SYSTEM V18.5.0

**Status:** 🟢 PRODUCTION READY  
**Version:** 18.5.0  
**Datum:** 23.10.2025  
**Autor:** RideHub Solutions

---

## 📋 INHALTSVERZEICHNIS

1. [System-Architektur](#system-architektur)
2. [Tarif-System](#tarif-system)
3. [Datenquellen](#datenquellen)
4. [Design-System](#design-system)
5. [Komponenten-Bibliothek](#komponenten-bibliothek)
6. [Portale](#portale)
7. [Automatisierungen](#automatisierungen)
8. [Kritische Regeln](#kritische-regeln)
9. [Checklisten](#checklisten)
10. [Troubleshooting](#troubleshooting)

---

## 1. SYSTEM-ARCHITEKTUR

### 1.1 Tech-Stack

```yaml
Frontend:
  - React 18.3.1
  - TypeScript 5.x
  - Vite (Build Tool)
  - TailwindCSS (Styling)
  - Shadcn/UI (Components)
  
Backend:
  - Supabase (Database, Auth, Edge Functions)
  - PostgreSQL (Database)
  - Row Level Security (RLS)
  
Payments:
  - Stripe (Subscriptions)
  
AI:
  - Lovable AI Gateway
  - Google Gemini 2.5 Flash (Default)
```

### 1.2 Projekt-Struktur

```
mydispatch/
├── src/
│   ├── components/          # UI-Komponenten
│   │   ├── design-system/   # Zentrale Design-Tokens
│   │   ├── layout/          # Layouts (Marketing, App)
│   │   ├── shared/          # Geteilte Komponenten
│   │   └── ui/              # Shadcn Base Components
│   ├── data/                # Zentrale Datenquellen
│   │   ├── pricing-tiers.ts     # SINGLE SOURCE: Pricing
│   │   ├── faq-data.ts          # FAQ-Daten
│   │   └── testimonials.ts      # Testimonials
│   ├── hooks/               # Custom React Hooks
│   ├── lib/                 # Utilities & Business Logic
│   │   ├── tariff/          # Tarif-System
│   │   └── subscription-utils.ts # Stripe-Integration
│   ├── pages/               # Page Components
│   │   ├── Home.tsx         # Landing Page
│   │   ├── Pricing.tsx      # Pricing Page
│   │   ├── Dashboard.tsx    # Unternehmer Dashboard
│   │   └── ...
│   └── integrations/
│       └── supabase/        # Supabase Client (AUTO-GENERATED)
├── docs/                    # Dokumentation
├── supabase/
│   ├── functions/           # Edge Functions
│   └── migrations/          # DB Migrations
└── public/                  # Static Assets
```

---

## 2. TARIF-SYSTEM

### 2.1 Zentrale Definition

**Datei:** `src/data/pricing-tiers.ts` (MARKETING)  
**Datei:** `src/lib/tariff/tariff-definitions.ts` (APP-LOGIK)

**KRITISCH:** Diese beiden Dateien müssen **IMMER synchron** sein!

### 2.2 Tarif-Übersicht

| Tarif | Monatspreis | Jahrespreis | Ersparnis | Features |
|-------|-------------|-------------|-----------|----------|
| **Starter** | 39 € | 420 € | 48 € | Max. 3 Fahrer/Fahrzeuge, Basis-Features |
| **Business** | 99 € | 1.068 € | 120 € | Unbegrenzt Fahrer/Fahrzeuge, Alle Features |
| **Enterprise** | Individuell | Individuell | - | Custom Solutions, White-Label |

### 2.3 Feature-Matrix

```typescript
// Starter-Features
- Unbegrenzte Aufträge ✅
- Max. 3 Fahrzeuge ✅
- Max. 3 Fahrer ✅
- Max. 1 Benutzer ✅
- Digitale Fuhrparkverwaltung ✅
- TÜV-Erinnerungen ✅
- Rechnungserstellung ✅
- Schichtplanung ✅
- 24/7 KI-Support ✅
- Mobile App ✅
- Fleet & Driver Add-On ⚡ (Optional: 9€/Monat)

// Business-Features (zusätzlich)
- Unbegrenzt Fahrzeuge ✅
- Unbegrenzt Fahrer ✅
- Max. 5 Benutzer ✅
- Partner-Netzwerk ✅
- Provisionsabrechnung ✅
- Live-Statistiken & KPIs ✅
- Kunden-Portal ✅
- Online-Buchungswidget ✅
- E-Mail-Benachrichtigungen ✅
- Export-Funktionen ✅
- API-Zugang (Basis) ✅
- Prioritäts-Support ✅

// Enterprise-Features (zusätzlich)
- Unbegrenzt Benutzer ✅
- Dedizierter Account Manager ✅
- API-Zugang (Erweitert) ✅
- Custom Branding ✅
- White-Label Option ✅
- SLA-Garantie 99,99% ✅
- Schulungen inklusive ✅
- Individuelle Anpassungen ✅
- Premium-Support 24/7 ✅
- Datenmigration ✅
```

### 2.4 Stripe Product IDs

```typescript
export const STRIPE_PRODUCT_IDS = {
  STARTER: 'prod_starter_2025',
  BUSINESS: 'prod_business_2025',
  ENTERPRISE: 'prod_enterprise_2025',
} as const;

// Legacy Product IDs (für Bestandskunden)
export const PRODUCT_IDS = {
  starter: ['prod_TEeg0ykplmGKd0', 'prod_TF5cFE5Fi5rBCz'],
  business: ['prod_TEegHmtpPZOZcG', 'prod_TF5cnWFZYEQUsG'],
  enterprise: ['prod_ENTERPRISE_ID_PLACEHOLDER']
}
```

### 2.5 Feature-Gating Implementation

```typescript
// Verwendung in Komponenten
import { hasFeatureAccess } from '@/lib/tariff/tariff-definitions';

const hasPartnerAccess = hasFeatureAccess(
  company?.subscription_product_id, 
  'partners'
);

if (!hasPartnerAccess) {
  return <UpgradePrompt 
    featureName="Partner-Management"
    requiredTier="Business"
    variant="fullscreen"
  />;
}
```

---

## 3. DATENQUELLEN

### 3.1 SINGLE SOURCE OF TRUTH Prinzip

**KRITISCHE REGEL:** Jede Datenart hat GENAU EINE Quelle!

```typescript
// ✅ RICHTIG
import { PRICING_TIERS } from '@/data/pricing-tiers';
const starterPrice = PRICING_TIERS[0].priceNumeric;

// ❌ FALSCH
const starterPrice = 39; // Hardcoded!
```

### 3.2 Zentrale Datenquellen

| Datentyp | Datei | Beschreibung |
|----------|-------|--------------|
| Pricing | `src/data/pricing-tiers.ts` | Marketing-Preise & Features |
| Tarife | `src/lib/tariff/tariff-definitions.ts` | App-Tarif-Logik |
| FAQ | `src/data/faq-data.ts` | FAQ-Daten |
| Testimonials | `src/data/testimonials.ts` | Kundenbewertungen |
| Stripe IDs | `src/lib/subscription-utils.ts` | Stripe Product/Price IDs |

### 3.3 Automatische Synchronisation

**ZIEL:** Änderung an einer Stelle = Überall aktualisiert

**Verwendung auf Seiten:**
```typescript
// Home.tsx, Pricing.tsx, Auth.tsx - ALLE nutzen dieselben Daten
import { PRICING_TIERS } from '@/data/pricing-tiers';

{PRICING_TIERS.map(tier => (
  <TariffCard key={tier.id} tier={tier} />
))}
```

---

## 4. DESIGN-SYSTEM

### 4.1 Farb-System (HSL)

```css
/* index.css - Zentrale Farbdefinitionen */
:root {
  /* Primary Colors */
  --primary: 217 91% 60%;           /* Hauptfarbe (Blau) */
  --primary-foreground: 0 0% 100%;  /* Text auf Primary */
  
  /* Background */
  --background: 0 0% 100%;          /* Weiß */
  --foreground: 222 47% 11%;        /* Dunkelgrau (Text) */
  
  /* Muted */
  --muted: 210 40% 96%;             /* Hellgrau */
  --muted-foreground: 215 16% 47%;  /* Grauer Text */
  
  /* Status Colors */
  --status-success: 142 71% 45%;    /* Grün */
  --status-warning: 38 92% 50%;     /* Orange */
  --status-error: 0 84% 60%;        /* Rot */
}

.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

### 4.2 Spacing-System

```typescript
// Tailwind Config
spacing: {
  'xs': '0.5rem',   // 8px
  'sm': '1rem',     // 16px
  'md': '1.5rem',   // 24px
  'lg': '2rem',     // 32px
  'xl': '3rem',     // 48px
  '2xl': '4rem',    // 64px
}
```

### 4.3 Grid-System

```typescript
// Standard Grid für Cards
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>...</Card>
</div>

// Hero Grid
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  <div>Text</div>
  <div>Image</div>
</div>
```

### 4.4 Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

---

## 5. KOMPONENTEN-BIBLIOTHEK

### 5.1 Design-System Komponenten

```typescript
// src/components/design-system/
├── Icon.tsx              // Zentrale Icon-Komponente
├── MarketingButton.tsx   // Marketing CTAs
└── index.ts              // Exports
```

### 5.2 Layout Komponenten

```typescript
// src/components/layout/
├── MarketingLayout.tsx   // Marketing-Seiten Layout
├── AppLayout.tsx         // App Layout (Sidebar)
└── AppSidebar.tsx        // Sidebar mit Navigation
```

### 5.3 Feature-Komponenten

```typescript
// src/components/shared/
├── FeatureGate.tsx       // Feature-Zugangskontrolle
├── UpgradePrompt.tsx     // Upgrade-Aufforderung
└── SEOHead.tsx           // SEO Meta Tags
```

### 5.4 Verwendungsbeispiele

```typescript
// Feature-Gate
<FeatureGate 
  requiredTariff="Business" 
  feature="partner_management"
>
  <PartnerComponent />
</FeatureGate>

// Upgrade-Prompt
<UpgradePrompt
  featureName="Statistiken"
  requiredTier="Business"
  variant="fullscreen"
/>

// Marketing Button
<MarketingButton
  variant="primary"
  size="large"
  icon="ArrowRight"
  onClick={() => navigate('/pricing')}
>
  Jetzt starten
</MarketingButton>
```

---

## 6. PORTALE

### 6.1 Marketing-Seiten (Öffentlich)

```typescript
// Seiten ohne Login
- / (Home.tsx)              # Landing Page
- /pricing (Pricing.tsx)    # Tarife & Preise
- /docs (Docs.tsx)          # Dokumentation
- /faq (FAQ.tsx)            # FAQ
- /contact (Contact.tsx)    # Kontaktformular
- /impressum                # Impressum
- /datenschutz              # Datenschutz
- /agb                      # AGB
```

### 6.2 Unternehmer-Portal (Auth erforderlich)

```typescript
// App-Seiten für Unternehmer
- /dashboard               # Dashboard & KPIs
- /auftraege               # Auftragsverwaltung
- /fahrer                  # Fahrerverwaltung
- /fahrzeuge               # Fahrzeugverwaltung
- /kunden                  # Kundenverwaltung
- /partner                 # Partner-Management (Business+)
- /statistiken             # Statistiken (Business+)
- /einstellungen           # Einstellungen
- /office                  # Office-Verwaltung
```

### 6.3 Kunden-Portal

```typescript
- /kunde/login             # Kunden-Login
- /kunde/dashboard         # Kunden-Übersicht
- /kunde/buchungen         # Buchungsübersicht
- /kunde/neue-buchung      # Neue Buchung
```

### 6.4 Fahrer-Portal

```typescript
- /fahrer/login            # Fahrer-Login
- /fahrer/dashboard        # Fahrer-Übersicht
- /fahrer/auftraege        # Auftragsübersicht
```

### 6.5 Unternehmer-Landing-Pages

```typescript
// Dynamische Landing Pages pro Unternehmen
- /{company_slug}          # Info-Landingpage
  - Widget-Integration (Business+)
  - Kunden-Portal-Button (Business+)
  - Buchungs-Widget (Business+)
  - White-Label Footer (Enterprise)
```

---

## 7. AUTOMATISIERUNGEN

### 7.1 Pricing-Synchronisation

```typescript
// Bei Änderung in pricing-tiers.ts
1. Home.tsx wird automatisch aktualisiert
2. Pricing.tsx wird automatisch aktualisiert
3. Auth.tsx zeigt neue Preise
4. Feature-Gates prüfen neue Features
```

### 7.2 Stripe-Synchronisation

```typescript
// Edge Function: sync-tariff-to-stripe
await supabase.functions.invoke('sync-tariff-to-stripe', {
  body: { tariff_id: 'business' }
});

// Synchronisiert:
- Product-Metadaten
- Feature-Beschreibungen
- Limit-Informationen
```

### 7.3 Supabase Types

```typescript
// NIEMALS manuell editieren!
// Auto-generiert aus DB-Schema
src/integrations/supabase/types.ts
```

---

## 8. KRITISCHE REGELN

### 8.1 Datenquellen

```typescript
// ✅ RICHTIG
import { PRICING_TIERS } from '@/data/pricing-tiers';

// ❌ FALSCH
const price = 39; // Hardcoded!
```

### 8.2 Stripe Product IDs

```typescript
// ✅ RICHTIG
import { isBusinessTier } from '@/lib/subscription-utils';
if (isBusinessTier(productId)) { ... }

// ❌ FALSCH
if (productId === 'prod_TEegHmtpPZOZcG') { ... }
```

### 8.3 Feature-Gating

```typescript
// ✅ RICHTIG
import { hasFeatureAccess } from '@/lib/tariff/tariff-definitions';
if (hasFeatureAccess(productId, 'partners')) { ... }

// ❌ FALSCH
if (tier === 'business' || tier === 'enterprise') { ... }
```

### 8.4 Supabase Queries

```typescript
// ✅ RICHTIG - subscription_product_id IMMER laden
const { data } = await supabase
  .from('companies')
  .select('id, name, subscription_product_id')
  .eq('id', companyId)
  .maybeSingle();

// ❌ FALSCH - subscription_product_id fehlt
const { data } = await supabase
  .from('companies')
  .select('id, name')
  .eq('id', companyId);
```

### 8.5 Design-System

```css
/* ✅ RICHTIG - Semantic Tokens */
.button {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

/* ❌ FALSCH - Hardcoded Colors */
.button {
  background-color: #3B82F6;
  color: white;
}
```

### 8.6 Komponenten-Struktur

```typescript
// ✅ RICHTIG - Kleine, fokussierte Komponenten
<PricingCard tier={tier} />

// ❌ FALSCH - Monolithische Komponenten
<PricingSection>
  {/* 500 Zeilen Code */}
</PricingSection>
```

---

## 9. CHECKLISTEN

### 9.1 Neue Feature Implementierung

- [ ] Tarif-Prüfung: Welcher Tarif braucht das Feature?
- [ ] `subscription_product_id` in Query laden
- [ ] Feature-Gate hinzufügen (falls Business+)
- [ ] Upgrade-Prompt für niedrigere Tarife
- [ ] Tests: Starter vs. Business vs. Enterprise
- [ ] Mobile Responsive Check
- [ ] SEO Meta-Tags hinzufügen
- [ ] Dokumentation aktualisieren

### 9.2 Pricing-Update

- [ ] `pricing-tiers.ts` aktualisieren
- [ ] `tariff-definitions.ts` synchronisieren
- [ ] Jahrespreise berechnen (Monat * 12 - Rabatt)
- [ ] Ersparnis-Anzeige prüfen
- [ ] Home.tsx Check
- [ ] Pricing.tsx Check
- [ ] Auth.tsx Check
- [ ] Stripe-Sync ausführen
- [ ] SEO-Schema aktualisieren

### 9.3 Go-Live Checklist

- [ ] Alle Marketing-Seiten vollständig
- [ ] Pricing korrekt auf allen Seiten
- [ ] Feature-Gates funktionieren
- [ ] Limit-Enforcement aktiv
- [ ] Stripe-Integration getestet
- [ ] RLS-Policies korrekt
- [ ] SEO Meta-Tags vollständig
- [ ] Mobile Responsive getestet
- [ ] Performance optimiert
- [ ] Security Audit durchgeführt

---

## 10. TROUBLESHOOTING

### 10.1 Häufige Fehler

**Problem:** Jahrespreise werden nicht angezeigt

**Lösung:**
```typescript
// Prüfen ob yearlyPrice gesetzt ist
{tier.yearlyPrice && tier.id !== 'enterprise' && (
  <div>oder {tier.yearlyPrice} pro Jahr</div>
)}
```

**Problem:** Feature wird angezeigt obwohl Tarif falsch

**Lösung:**
```typescript
// subscription_product_id MUSS geladen werden
const { data } = await supabase
  .from('companies')
  .select('*, subscription_product_id')
  .eq('id', companyId);
```

**Problem:** Tarif wird nicht erkannt

**Lösung:**
```typescript
// Utility-Funktionen verwenden
import { isBusinessTier } from '@/lib/subscription-utils';
console.log('Product ID:', company?.subscription_product_id);
console.log('Is Business:', isBusinessTier(company?.subscription_product_id));
```

### 10.2 Debug-Kommandos

```typescript
// Tarif-Informationen ausgeben
console.log('Tariff:', getTariffByProductId(productId));
console.log('Features:', tariff?.features);
console.log('Limits:', tariff?.limits);

// Subscription-Status prüfen
const { data } = await supabase
  .from('companies')
  .select('subscription_product_id, subscription_status')
  .eq('id', companyId);
console.log('Subscription:', data);
```

---

## 📞 SUPPORT

Bei Fragen oder Problemen:

1. **Dokumentation prüfen:** Dieses Dokument durchsuchen
2. **Console-Logs aktivieren:** Debug-Informationen sammeln
3. **Spezifische Docs:** Siehe Referenzen unten

---

## 📚 REFERENZEN

- `TARIFF_SYSTEM_V18.3.24.md` - Tarif-System Details
- `TARIFSTEUERUNG_SYSTEM_V18.2.md` - Stripe-Integration
- `CHAT_SYSTEM_FINALE_DOKUMENTATION_V18.2.31.md` - AI-Chat
- `CORPORATE_DESIGN_MANUAL_V1.0.md` - Design-Guidelines
- `DASHBOARD_AUDIT_REPORT_V18.3.md` - Dashboard-Spezifikationen

---

**Version:** V18.5.0  
**Letzte Aktualisierung:** 23.10.2025  
**Status:** 🟢 PRODUCTION READY  
**Wartung:** RideHub Solutions
