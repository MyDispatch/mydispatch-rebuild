# 💳 TARIFF-SYSTEM V18.3.24 - VOLLSTÄNDIGE DOKUMENTATION

## ÜBERSICHT

Das Tariff-System V18.3.24 ist eine **zentrale, typsichere und Stripe-synchronisierte** Lösung für:

- ✅ Tarif-Definitionen (Starter, Business, Enterprise)
- ✅ Feature-Gating & Access-Control
- ✅ Limit-Enforcement (Fahrer, Fahrzeuge, etc.)
- ✅ Automatische Stripe-Synchronisation
- ✅ Dynamische Pricing-Seite
- ✅ Upgrade-Prompts

---

## ARCHITEKTUR

```
src/lib/tariff/
├── tariff-definitions.ts      # Zentrale Tarif-Daten (SINGLE SOURCE OF TRUTH)
├── tariff-sync.ts             # Stripe-Synchronisation
└── tariff-enforcement.ts      # Access-Control & Limits

src/hooks/
├── use-tariff-limits.tsx      # Limit-Prüfung (Fahrer, Fahrzeuge)
└── use-feature-access.tsx     # Feature-Zugriff (erweitert)

src/components/shared/
├── UpgradePrompt.tsx          # Upgrade-Button für gesperrte Features
└── FeatureGate.tsx            # Feature-Gating (erweitert)

supabase/functions/
└── sync-tariff-to-stripe/     # Edge Function für Stripe-API
```

---

## ZENTRALE TARIF-DEFINITIONEN

**Datei:** `src/lib/tariff/tariff-definitions.ts`

### Interface: TariffDefinition

```typescript
interface TariffDefinition {
  id: "starter" | "business" | "enterprise";
  name: string;
  priceMonthly: number;
  priceYearly: number;
  priceMonthlyFormatted: string; // "39 €"
  priceYearlyFormatted: string; // "374,40 €"
  yearlyDiscount: number; // 93.60
  description: string;
  badge?: string; // "Empfohlen"
  highlighted: boolean;
  stripeProductIds: readonly string[];
  stripePriceIds: {
    monthly: string;
    yearly: string;
  };
  limits: TariffLimit;
  features: TariffFeature[];
  ctaText: string;
  ctaAction: "signup" | "contact" | "upgrade";
}
```

### Tarif-Limits

```typescript
interface TariffLimit {
  drivers: number; // -1 = Unbegrenzt
  vehicles: number;
  bookings: number;
  partners: number;
  users: number;
}
```

### Feature-Definition

```typescript
interface TariffFeature {
  id: string; // Eindeutige ID
  name: string; // Anzeigename
  description?: string;
  included: boolean; // Im Tarif enthalten?
  module?: string; // Für Feature-Gating
  route?: string; // Für Navigation
}
```

---

## FEATURE-GATING

### Verwendung in Komponenten

```typescript
import { hasFeatureAccess } from '@/lib/tariff/tariff-definitions';
import { useAuth } from '@/hooks/use-auth';

const { company } = useAuth();
const hasPartnerAccess = hasFeatureAccess(company?.subscription_product_id, 'partners');

if (!hasPartnerAccess) {
  return <UpgradePrompt
    featureName="Partner-Management"
    featureDescription="Verwalten Sie Partnerfirmen und teilen Sie Aufträge"
    requiredTier="Business"
    variant="fullscreen"
  />;
}
```

### FeatureGate-Component (Erweitert)

```typescript
import { FeatureGate } from '@/components/shared/FeatureGate';

<FeatureGate requiredTariff="Business" feature="partner_management">
  <PartnerManagementComponent />
</FeatureGate>
```

### Routen-Schutz

```typescript
// src/config/routes.config.tsx
{
  path: '/partner',
  element: (
    <FeatureGate requiredTariff="Business" feature="partner_management">
      <Partner />
    </FeatureGate>
  )
}
```

---

## LIMIT-ENFORCEMENT

### Hook: useTariffLimits

```typescript
import { useTariffLimits } from "@/hooks/use-tariff-limits";

const { canAdd, tryAdd, showLimitWarning } = useTariffLimits();

// Prüfe vor Erstellung
const handleCreateDriver = () => {
  if (!tryAdd("drivers")) {
    // Limit erreicht, Toast wird automatisch angezeigt
    return;
  }

  // Erstelle Fahrer
  createDriver();
};
```

### Automatische Limit-Warnung

```typescript
if (canAdd("drivers")) {
  // Erlaubt
} else {
  showLimitWarning("drivers");
  // Toast: "Sie haben das Maximum von 3 Fahrern erreicht.
  //         Upgraden Sie auf Business für unbegrenzte Nutzung."
}
```

### Limits in Tabellen anzeigen

```typescript
const { usage, limits } = useTariffLimits();

<Badge variant={usage.drivers >= (limits?.drivers || 0) ? 'destructive' : 'secondary'}>
  {usage.drivers} / {limits?.drivers === -1 ? '∞' : limits?.drivers}
</Badge>
```

---

## STRIPE-SYNCHRONISATION

### Automatischer Sync bei Tarif-Änderungen

```typescript
import { syncTariffToStripe } from "@/lib/stripe/tariff-sync";

// Nach Änderung an Tarif-Definition
await syncTariffToStripe("business");
```

### Vollständiger Sync aller Tarife

```typescript
import { syncAllTariffsToStripe } from "@/lib/stripe/tariff-sync";

await syncAllTariffsToStripe();
```

### Edge Function (Backend)

**Endpunkt:** `sync-tariff-to-stripe`

```typescript
// Aufruf via Frontend
const { data } = await supabase.functions.invoke("sync-tariff-to-stripe", {
  body: {
    tariff_id: "business",
    metadata: {
      feature_count: "18",
      last_updated: new Date().toISOString(),
    },
  },
});
```

**Was wird synchronisiert:**

- ✅ Product-Metadaten (Features, Limits)
- ✅ Beschreibung
- ✅ Timestamps
- ❌ **NICHT:** Preise (müssen manuell in Stripe geändert werden)

---

## PRICING-SEITE (DYNAMISCH)

### Automatische Aktualisierung

Die Pricing-Seite liest **automatisch** aus `tariff-definitions.ts`:

```typescript
import { ALL_TARIFFS } from '@/lib/tariff/tariff-definitions';

{ALL_TARIFFS.map(tariff => (
  <TariffCard key={tariff.id} tariff={tariff} />
))}
```

**Änderungen propagieren automatisch zu:**

- ✅ Pricing-Seite
- ✅ Vergleichs-Tabelle
- ✅ Feature-Gates
- ✅ Upgrade-Prompts

---

## UPGRADE-PROMPTS

### 3 Varianten

#### 1. Inline (für kleine Bereiche)

```typescript
<UpgradePrompt
  featureName="Statistiken"
  featureDescription="Erweiterte Reports und Analysen"
  requiredTier="Business"
  variant="inline"
/>
```

#### 2. Card (Standard)

```typescript
<UpgradePrompt
  featureName="Partner-Management"
  featureDescription="Verwalten Sie Partnerfirmen"
  requiredTier="Business"
  variant="card"
/>
```

#### 3. Fullscreen (für gesperrte Seiten)

```typescript
<UpgradePrompt
  featureName="Statistiken & Reports"
  featureDescription="Umfassende Analysen Ihrer Geschäftsdaten"
  requiredTier="Business"
  variant="fullscreen"
/>
```

---

## BUSINESS-TARIF FEATURES (VOLLSTÄNDIG)

### Basis-Features

- ✅ Unbegrenzt Fahrer/Fahrzeuge
- ✅ Alle Starter-Features

### Premium-Features

- ✅ Partner-Management
- ✅ Live-Traffic & Wetter
- ✅ Statistiken & Reports
- ✅ Kunden-Login & Portal
- ✅ Buchungswidget
- ✅ AI-Chatbot
- ✅ API-Zugang

### Erweiterte Features

- ✅ GPS-Echtzeit-Tracking
- ✅ Team-Chat
- ✅ Dokumenten-Management
- ✅ Schichtplanung
- ✅ Kostenstellen
- ✅ Massen-Operationen
- ✅ Erweiterte Reports
- ✅ E-Mail-Vorlagen
- ✅ n8n Workflow-Automatisierung
- ✅ Bis zu 5 Benutzer
- ✅ Prioritäts-Support

---

## BEST PRACTICES

### ✅ DO

1. **Verwende zentrale Definitionen**

   ```typescript
   import { getTariffById } from "@/lib/tariff/tariff-definitions";
   const business = getTariffById("business");
   ```

2. **Prüfe Limits vor Aktionen**

   ```typescript
   if (!tryAdd("drivers")) return;
   ```

3. **Zeige Upgrade-Prompts**

   ```typescript
   if (!hasFeatureAccess(productId, 'statistics')) {
     return <UpgradePrompt ... />;
   }
   ```

4. **Synchronisiere nach Änderungen**
   ```typescript
   await syncTariffToStripe("business");
   ```

### ❌ DON'T

1. **Keine Inline-Tarif-Daten**

   ```typescript
   // FALSCH
   const price = 99;

   // RICHTIG
   const business = getTariffById("business");
   const price = business.priceMonthly;
   ```

2. **Keine manuellen Feature-Checks**

   ```typescript
   // FALSCH
   if (productId === 'prod_TEegHmtpPZOZcG') { ... }

   // RICHTIG
   if (hasFeatureAccess(productId, 'partners')) { ... }
   ```

3. **Keine Hardcoded-Limits**

   ```typescript
   // FALSCH
   if (drivers.length >= 3) { ... }

   // RICHTIG
   if (exceedsLimit(productId, 'drivers', drivers.length)) { ... }
   ```

---

## TESTING

### Tarif-Switcher (Test-Accounts)

```typescript
import { TariffSwitcher } from '@/components/settings/TariffSwitcher';

// Nur für Test-Accounts sichtbar
<TariffSwitcher />
```

### Test-Szenarien

1. **Limit-Erreicht**
   - Erstelle 3 Fahrer im Starter
   - Versuche 4. Fahrer zu erstellen → Toast-Warnung
2. **Feature-Gesperrt**
   - Öffne `/partner` im Starter → Upgrade-Prompt
3. **Upgrade-Flow**
   - Klicke "Upgrade" → Weiterleitung zu `/pricing`

---

## VERSPRECHEN EINHALTEN

### Checkliste

- ✅ Starter: Max 3 Fahrer/Fahrzeuge → **Enforced**
- ✅ Business: Unbegrenzt → **Enforced**
- ✅ Kein Partner-Management in Starter → **Enforced**
- ✅ Keine Statistiken in Starter → **Enforced**
- ✅ Business-Features nur mit Abo → **Enforced**

### Enforcement-Punkte

1. **Routen-Ebene** (AppSidebar, Routes)
2. **Komponenten-Ebene** (FeatureGate)
3. **Datenbank-Ebene** (RLS-Policies mit product_id)
4. **Limit-Ebene** (useTariffLimits Hook)

---

## MIGRATION BESTEHENDER SYSTEME

### Schritte

1. **Importiere Definitionen**

   ```typescript
   import { getTariffByProductId } from "@/lib/tariff/tariff-definitions";
   ```

2. **Ersetze Inline-Checks**

   ```typescript
   // Alt
   if (isBusinessTier(productId)) { ... }

   // Neu
   if (hasFeatureAccess(productId, 'partners')) { ... }
   ```

3. **Füge Upgrade-Prompts hinzu**

   ```typescript
   if (!hasAccess) {
     return <UpgradePrompt ... />;
   }
   ```

4. **Teste alle Tarife**
   - Starter → Limits testen
   - Business → Alle Features testen
   - Enterprise → Vollzugriff testen

---

## SUPPORT & DEBUGGING

### Logs aktivieren

```typescript
console.log("Tariff:", getTariffByProductId(company?.subscription_product_id));
console.log("Feature Access:", hasFeatureAccess(productId, "partners"));
console.log("Limits:", useTariffLimits().limits);
```

### Häufige Fehler

1. **"Feature nicht verfügbar" obwohl Business**
   → Prüfe `subscription_product_id` in DB

2. **"Limit erreicht" bei unbegrenztem Tarif**
   → Prüfe ob `limit === -1`

3. **Pricing-Seite zeigt falsche Daten**
   → Prüfe `tariff-definitions.ts` wurde aktualisiert

---

## FAZIT

Das Tariff-System V18.3.24 stellt sicher:

✅ **Single Source of Truth** für alle Tarif-Daten  
✅ **Automatische Synchronisation** mit Pricing & Stripe  
✅ **Robustes Feature-Gating** auf allen Ebenen  
✅ **Limit-Enforcement** verhindert Übernutzung  
✅ **Benutzerfreundliche Upgrade-Prompts**  
✅ **Versprechen werden eingehalten**

**Status:** 🟢 Production Ready

**Version:** V18.3.24  
**Datum:** Januar 2025  
**Wartung:** RideHub Solutions
