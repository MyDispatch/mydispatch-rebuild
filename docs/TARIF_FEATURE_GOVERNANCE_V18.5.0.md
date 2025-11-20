# Tarif-Feature-Governance V18.5.0

**Status:** Production-Ready  
**Erstellt:** 2025-10-25  
**Zweck:** Zentrale Vorgaben für Feature-Zugriff nach Tarif  
**Klassifizierung:** Intern - Bindend für alle UI-Komponenten

---

## 🎯 KERN-PRINZIP

**REGEL:** Features die NICHT im Tarif enthalten sind, werden NICHT angezeigt (kein Link, kein Menü-Eintrag, keine Route).

**REGEL:** Features die in HÖHEREN Tarifen erweitert sind, werden ausgegraut mit "Upgrade"-Button.

---

## 📊 TARIF-ÜBERSICHT

### **Starter-Tarif (39 €/Monat)**
- **Fahrer/Fahrzeuge:** Max. 3
- **Benutzer:** 1
- **Aufträge:** Unbegrenzt
- **Partner:** ❌ NICHT verfügbar

### **Business-Tarif (99 €/Monat)** ⭐ Empfohlen
- **Fahrer/Fahrzeuge:** Unbegrenzt
- **Benutzer:** 5
- **Aufträge:** Unbegrenzt
- **Partner:** ✅ Unbegrenzt

### **Enterprise-Tarif (Auf Anfrage)**
- **Fahrer/Fahrzeuge:** Unbegrenzt
- **Benutzer:** Unbegrenzt
- **Aufträge:** Unbegrenzt
- **Partner:** ✅ Unbegrenzt
- **White-Label:** ✅

---

## 🔒 FEATURE-ZUGRIFFSKONTROLLE

### **Navigation & Sidebar**

#### ✅ STARTER: Sichtbare Links
```typescript
const STARTER_ROUTES = [
  '/dashboard',           // ✅ Vorhanden
  '/auftraege',          // ✅ Vorhanden
  '/kunden',             // ✅ Vorhanden
  '/fahrer',             // ✅ Vorhanden (Max. 3)
  '/fahrzeuge',          // ✅ Vorhanden (Max. 3)
  '/rechnungen',         // ✅ Vorhanden
  '/angebote',           // ✅ Vorhanden
  '/office',             // ✅ Vorhanden
  '/einstellungen',      // ✅ Vorhanden
]
```

#### ❌ STARTER: NICHT sichtbare Links
```typescript
const STARTER_HIDDEN_ROUTES = [
  '/partner',            // ❌ Komplett versteckt (Business+)
  '/statistiken',        // ❌ Komplett versteckt (Business+)
  '/kommunikation',      // ❌ Komplett versteckt (Business+)
  '/dokumente',          // ❌ Komplett versteckt (Business+)
  '/schichtzettel',      // ❌ Komplett versteckt (Business+)
  '/kostenstellen',      // ❌ Komplett versteckt (Business+)
]
```

#### ✅ BUSINESS: Zusätzliche Links
```typescript
const BUSINESS_ADDITIONAL_ROUTES = [
  '/partner',            // ✅ NEU verfügbar
  '/statistiken',        // ✅ NEU verfügbar
  '/kommunikation',      // ✅ NEU verfügbar
  '/dokumente',          // ✅ NEU verfügbar
  '/schichtzettel',      // ✅ NEU verfügbar
  '/kostenstellen',      // ✅ NEU verfügbar
]
```

---

## 🎨 UI-PATTERNS

### Pattern 1: **Feature komplett versteckt** (Starter)
```tsx
// Sidebar-Link für Partner (NICHT im Starter-Tarif)
{hasFeatureAccess(userProductId, 'partners') && (
  <SidebarMenuButton asChild>
    <Link to="/partner">
      <Users className="h-4 w-4" />
      <span>Partner-Netzwerk</span>
    </Link>
  </SidebarMenuButton>
)}
```

### Pattern 2: **Feature ausgegraut mit Upgrade-Button** (Starter auf Dashboard)
```tsx
// Dashboard-Widget für Live-Karte (im Starter ausgegraut)
<Card className={cn(
  "border border-border",
  !hasFeatureAccess(userProductId, 'gps') && "opacity-50 pointer-events-none"
)}>
  <CardHeader>
    <CardTitle>Live-Karte</CardTitle>
    {!hasFeatureAccess(userProductId, 'gps') && (
      <Badge variant="secondary" className="ml-2">Business+</Badge>
    )}
  </CardHeader>
  <CardContent>
    {hasFeatureAccess(userProductId, 'gps') ? (
      <LiveMapWidget />
    ) : (
      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Live-GPS-Tracking verfügbar im Business-Tarif
        </p>
        <Button variant="secondary" onClick={() => navigate('/pricing')}>
          Jetzt upgraden
        </Button>
      </div>
    )}
  </CardContent>
</Card>
```

### Pattern 3: **Limitiertes Feature mit Counter** (Fahrer-Limit)
```tsx
// Fahrer-Seite: Limit-Anzeige für Starter (Max. 3)
<div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-bold">Fahrer</h2>
  <div className="flex items-center gap-4">
    {!hasUnlimitedDrivers(userProductId) && (
      <Badge variant="outline">
        {currentDriverCount} / 3 Fahrer
      </Badge>
    )}
    <Button 
      onClick={() => setShowCreateDialog(true)}
      disabled={exceedsLimit(userProductId, 'drivers', currentDriverCount)}
    >
      <Plus className="h-4 w-4 mr-2" />
      Neuer Fahrer
    </Button>
  </div>
</div>

{exceedsLimit(userProductId, 'drivers', currentDriverCount) && (
  <Alert variant="warning" className="mb-4">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Fahrer-Limit erreicht</AlertTitle>
    <AlertDescription>
      Sie haben das Maximum von 3 Fahrern erreicht. 
      <Button variant="link" onClick={() => navigate('/pricing')}>
        Upgraden Sie jetzt auf Business
      </Button> für unbegrenzte Fahrer.
    </AlertDescription>
  </Alert>
)}
```

---

## 📋 FEATURE-MATRIX (Detailliert)

### **CORE-FEATURES** (Basis-Funktionen)

| Feature | Starter | Business | Enterprise |
|---------|---------|----------|------------|
| **Dashboard** | ✅ Basis | ✅ + Live-Widgets | ✅ + Custom |
| **Aufträge** | ✅ Unbegrenzt | ✅ + Smart-Assign | ✅ + API |
| **Kunden** | ✅ Basis | ✅ + Portal | ✅ + White-Label |
| **Fahrer** | ✅ Max. 3 | ✅ Unbegrenzt | ✅ Unbegrenzt |
| **Fahrzeuge** | ✅ Max. 3 | ✅ Unbegrenzt | ✅ Unbegrenzt |
| **Rechnungen** | ✅ Basis | ✅ Basis | ✅ Basis |
| **Angebote** | ✅ Basis | ✅ Basis | ✅ Basis |

### **PREMIUM-FEATURES** (Business+)

| Feature | Starter | Business | Enterprise | Route |
|---------|---------|----------|------------|-------|
| **Partner-Management** | ❌ | ✅ | ✅ | `/partner` |
| **Statistiken** | ❌ | ✅ | ✅ | `/statistiken` |
| **Live-Traffic** | ❌ | ✅ | ✅ | (Dashboard-Widget) |
| **GPS-Tracking** | ❌ | ✅ | ✅ | (Dashboard-Widget) |
| **Team-Chat** | ❌ | ✅ | ✅ | `/kommunikation` |
| **Dokumente** | ❌ | ✅ | ✅ | `/dokumente` |
| **Schichtplanung** | ❌ | ✅ | ✅ | `/schichtzettel` |
| **Kostenstellen** | ❌ | ✅ | ✅ | `/kostenstellen` |
| **Workflow-Automation** | ❌ | ✅ (n8n) | ✅ (n8n) | (Einstellungen) |
| **API-Zugang** | ❌ | ✅ | ✅ | (Einstellungen) |

### **ENTERPRISE-FEATURES** (Enterprise only)

| Feature | Starter | Business | Enterprise | Route |
|---------|---------|----------|------------|-------|
| **White-Label** | ❌ | ❌ | ✅ | (Einstellungen) |
| **Custom Integrationen** | ❌ | ❌ | ✅ | (Kontakt) |
| **Dedizierter Manager** | ❌ | ❌ | ✅ | (Kontakt) |
| **SLA-Garantie** | ❌ | ❌ | ✅ | (Kontakt) |

---

## 🛠️ IMPLEMENTIERUNGS-HELPER

### **React Hook: `useTariffAccess`**
```typescript
// src/hooks/use-tariff-access.ts
import { useAuth } from '@/hooks/use-auth';
import { getTariffByProductId, hasFeatureAccess, exceedsLimit } from '@/lib/tariff/tariff-definitions';

export function useTariffAccess() {
  const { user, subscription } = useAuth();
  const productId = subscription?.product_id;
  const tariff = getTariffByProductId(productId);

  return {
    // Feature-Zugriff
    hasFeature: (module: string) => hasFeatureAccess(productId, module),
    
    // Limit-Prüfung
    exceedsLimit: (resource: 'drivers' | 'vehicles' | 'users', current: number) => 
      exceedsLimit(productId, resource, current),
    
    // Tarif-Info
    tariff,
    tariffId: tariff?.id || 'starter',
    isStarter: tariff?.id === 'starter',
    isBusiness: tariff?.id === 'business',
    isEnterprise: tariff?.id === 'enterprise',
  };
}
```

### **Component: `<UpgradePrompt />`**
```tsx
// src/components/shared/UpgradePrompt.tsx
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptProps {
  featureName: string;
  requiredTier: 'Business' | 'Enterprise';
}

export function UpgradePrompt({ featureName, requiredTier }: UpgradePromptProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
      <Badge variant="secondary" className="text-sm px-4 py-2">
        {requiredTier}+
      </Badge>
      <h3 className="text-xl font-bold text-foreground">
        {featureName}
      </h3>
      <p className="text-sm text-muted-foreground max-w-md">
        Dieses Feature ist im {requiredTier}-Tarif verfügbar.
        Upgraden Sie jetzt für den vollen Funktionsumfang.
      </p>
      <Button variant="secondary" onClick={() => navigate('/pricing')}>
        Jetzt upgraden
      </Button>
    </div>
  );
}
```

---

## 🚨 SICHERHEITS-REGELN

### **KRITISCH: Niemals Client-Side-Only Checks!**

❌ **FALSCH:**
```typescript
// NUR Client-Side Check (kann umgangen werden!)
if (userTier === 'starter') {
  // Feature blockieren
}
```

✅ **RICHTIG:**
```typescript
// 1. Client-Side Check (für UX)
if (!hasFeatureAccess(productId, 'partners')) {
  return <UpgradePrompt featureName="Partner-Netzwerk" requiredTier="Business" />;
}

// 2. Server-Side Check (in Edge Function oder RLS Policy)
// supabase/functions/create-partner/index.ts
const { data: subscription } = await supabase
  .from('subscriptions')
  .select('product_id')
  .eq('user_id', userId)
  .single();

if (!hasFeatureAccess(subscription.product_id, 'partners')) {
  return new Response('Upgrade required', { status: 403 });
}
```

### **RLS Policy für Partner-Tabelle**
```sql
-- Nur Business+ Kunden können Partner erstellen
CREATE POLICY "Only Business+ can create partners"
ON public.partners
FOR INSERT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM subscriptions s
    WHERE s.user_id = auth.uid()
    AND s.product_id IN (
      'prod_TEegHmtpPZOZcG',  -- Business Monthly
      'prod_TF5cnWFZYEQUsG',  -- Business Yearly
      'prod_ENTERPRISE_ID_PLACEHOLDER'  -- Enterprise
    )
  )
);
```

---

## 📚 VERWENDUNG IM CODE

### Beispiel: Sidebar-Navigation
```tsx
// src/components/layout/AppSidebar.tsx
import { useTariffAccess } from '@/hooks/use-tariff-access';

export function AppSidebar() {
  const { hasFeature } = useTariffAccess();

  return (
    <Sidebar>
      {/* Basis-Features (alle Tarife) */}
      <SidebarMenuItem>
        <Link to="/dashboard">Dashboard</Link>
      </SidebarMenuItem>

      {/* Business+ Features */}
      {hasFeature('partners') && (
        <SidebarMenuItem>
          <Link to="/partner">
            Partner-Netzwerk
            <Badge variant="secondary">Business+</Badge>
          </Link>
        </SidebarMenuItem>
      )}

      {hasFeature('statistics') && (
        <SidebarMenuItem>
          <Link to="/statistiken">Statistiken</Link>
        </SidebarMenuItem>
      )}
    </Sidebar>
  );
}
```

### Beispiel: Dashboard mit Feature-Gates
```tsx
// src/pages/Dashboard.tsx
import { useTariffAccess } from '@/hooks/use-tariff-access';
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';

export default function Dashboard() {
  const { hasFeature, isStarter } = useTariffAccess();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Basis-KPIs (alle Tarife) */}
      <KPICard title="Aufträge heute" value="42" />
      <KPICard title="Umsatz heute" value="1.234 €" />

      {/* Live-Karte (Business+) */}
      <Card>
        <CardHeader>
          <CardTitle>Live-Karte</CardTitle>
          {isStarter && <Badge variant="secondary">Business+</Badge>}
        </CardHeader>
        <CardContent>
          {hasFeature('gps') ? (
            <LiveMapWidget />
          ) : (
            <UpgradePrompt 
              featureName="Live-GPS-Tracking" 
              requiredTier="Business" 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## ✅ CHECKLISTE FÜR ENTWICKLER

- [ ] Feature-Zugriff mit `hasFeatureAccess()` prüfen
- [ ] Nicht verfügbare Features KOMPLETT verstecken (keine Links)
- [ ] Erweiterte Features ausgegraut mit Upgrade-Prompt
- [ ] Limits mit `exceedsLimit()` prüfen und anzeigen
- [ ] Server-Side Validierung in Edge Functions
- [ ] RLS Policies für Business+-Features
- [ ] Badge "Business+" oder "Enterprise" bei Premium-Features
- [ ] Upgrade-Button führt zu `/pricing`

---

**LETZTE AKTUALISIERUNG:** 2025-10-25  
**VERSION:** V18.5.0  
**STATUS:** ✅ Production-Ready

**WICHTIG:** Diese Datei MUSS in die Custom Knowledge aufgenommen werden!
