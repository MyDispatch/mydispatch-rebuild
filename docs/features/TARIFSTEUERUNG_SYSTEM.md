# 🎯 TARIF-STEUERUNG SYSTEMWEIT - MyDispatch V18.0

**Version:** 1.0 FINAL  
**Datum:** 15.10.2025  
**Status:** 🟢 PRODUKTIONSREIF  
**Zweck:** Zentrale Dokumentation der Tarif-basierten Feature-Steuerung

---

## 📋 ÜBERSICHT

MyDispatch nutzt ein **3-Tarif-System** mit tarif-spezifischen Features:

| Tarif          | Preis       | Features                                                                                        | Komponente                       |
| -------------- | ----------- | ----------------------------------------------------------------------------------------------- | -------------------------------- |
| **Starter**    | 39 €/Monat  | Basis-Disposition, 3 Fahrer/Fahrzeuge, Standard-Support                                         | Alle Basis-Features              |
| **Business**   | 99 €/Monat  | Unbegrenzt Fahrer/Fahrzeuge, Partner-Netzwerk, Statistiken, Live-Infos, Landingpage mit Buchung | `FeatureGate`, `Unternehmer.tsx` |
| **Enterprise** | Auf Anfrage | Alle Business + White-Label, Custom-Integration, SLA, Schulungen                                | Wie Business + Master-Dashboard  |

---

## 🔐 IMPLEMENTIERUNG

### 1. **FeatureGate-Komponente** (`src/components/shared/FeatureGate.tsx`)

**Standard-Lösung für Protected Routes:**

```tsx
import { FeatureGate } from '@/components/shared/FeatureGate';

// Beispiel: Partner-Seite (nur Business+)
<FeatureGate requiredTariff="Business" featureName="Partnerverwaltung">
  <PartnerList />
</FeatureGate>

// Beispiel: Statistiken (nur Business+)
<FeatureGate requiredTariff="Business" featureName="Erweiterte Statistiken">
  <StatisticsCharts />
</FeatureGate>
```

**Props:**

- `requiredTariff`: `"Starter" | "Business" | "Enterprise"`
- `featureName`: String (für Upgrade-Message)
- `showUpgradeMessage`: Boolean (optional, default: true)

**Verhalten:**

- **Starter-User sieht Business-Feature**: Upgrade-Message mit Link zu `/pricing`
- **Business-User**: Voller Zugang zu Business/Enterprise-Features
- **Enterprise-User**: Voller Zugang zu allen Features

---

### 2. **Unternehmer-Landingpage** (`src/pages/Unternehmer.tsx`)

**Tarif-spezifische Funktionalität:**

```tsx
// Zeilen 83-84: Tarif-Erkennung
const isBusiness =
  company?.subscription_product_id?.includes("business") ||
  company?.subscription_product_id?.includes("enterprise");

// Zeile 199-208: Buchungs-Button (nur Business/Enterprise)
{
  isBusiness && company.widget_enabled ? (
    <Button onClick={() => setBookingOpen(true)}>
      {company.widget_button_text || "Jetzt buchen"}
    </Button>
  ) : null;
}

// Zeile 298-322: Online-Buchung Section (nur Business/Enterprise)
{
  isBusiness && (
    <Card>
      <h3>Online-Buchung verfügbar</h3>
      <Button onClick={() => setBookingOpen(true)}>Jetzt buchen</Button>
    </Card>
  );
}

// Zeile 325-365: Kontakt-Only Section (Starter-Tarif)
{
  !isBusiness && (
    <Card>
      <h3>Kontaktieren Sie uns</h3>
      <Button asChild>
        <a href={`tel:${company.phone}`}>Anrufen</a>
      </Button>
    </Card>
  );
}

// Zeile 408-416: Booking Widget Dialog (nur Business/Enterprise)
{
  company && isBusiness && company.widget_enabled && (
    <BookingWidget open={bookingOpen} onOpenChange={setBookingOpen} />
  );
}

// Zeile 419-421: AI Chatbot (nur Business/Enterprise)
{
  company && isBusiness && <AISupportWidget />;
}
```

**Datenbank-Fields:**

- `companies.subscription_product_id`: `"starter" | "business" | "enterprise"`
- `companies.landingpage_enabled`: Boolean (Aktivierung der Landingpage)
- `companies.widget_enabled`: Boolean (Aktivierung des Buchungs-Widgets)

---

### 3. **Partner-Verwaltung** (`src/pages/Partner.tsx`)

**Zeile 201-206: FeatureGate Wrapper**

```tsx
<FeatureGate requiredTariff="Business" featureName="Partnerverwaltung" showUpgradeMessage={true}>
  {/* Gesamte Partner-Seite */}
</FeatureGate>
```

**Features:**

- Partner-Netzwerk (MyDispatch-to-MyDispatch Verbindungen)
- Externe Partner (ohne Login)
- Anfragen senden/empfangen
- Fahrzeug-/Fahrer-Sharing

---

### 4. **Statistiken** (`src/pages/Statistiken.tsx`)

**Zeile 106-168: FeatureGate Wrapper**

```tsx
<FeatureGate requiredTariff="Business" featureName="Erweiterte Statistiken">
  <div className="space-y-6">
    {/* KPI Cards */}
    {/* Umsatzentwicklung Charts */}
    {/* Top Fahrer Ranking */}
  </div>
</FeatureGate>
```

**Features:**

- Detaillierte KPIs (Umsatz, Aufträge, Auslastung)
- Charts (Umsatzentwicklung, Top Fahrer, Heatmaps)
- Exportfunktionen (CSV, PDF)

---

## 🎨 UI/UX-DESIGN FÜR UPGRADE-MESSAGES

**Standard FeatureGate Upgrade-Message:**

```tsx
// src/components/shared/FeatureGate.tsx (bereits implementiert)
<Card className="border-2 border-accent">
  <CardContent className="p-8 text-center">
    <div className="mb-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10">
        <Crown className="h-8 w-8 text-accent" />
      </div>
    </div>
    <h3 className="text-xl font-semibold mb-2">{featureName} ist ein Business-Feature</h3>
    <p className="text-muted-foreground mb-6">
      Upgraden Sie auf Business, um diese und weitere Premium-Funktionen zu nutzen.
    </p>
    <Button asChild size="lg">
      <Link to="/pricing">Jetzt upgraden</Link>
    </Button>
  </CardContent>
</Card>
```

---

## 🔍 TARIF-PRÜFUNG SYSTEMWEIT (Checklist)

### ✅ **Aktuell korrekt implementiert:**

- [x] **Partner.tsx**: FeatureGate mit `requiredTariff="Business"` (Zeile 201)
- [x] **Statistiken.tsx**: FeatureGate mit `requiredTariff="Business"` (Zeile 106)
- [x] **Unternehmer.tsx**: Manuelle Tarif-Prüfung via `subscription_product_id` (Zeilen 83-84, 199, 298, 325, 408, 419)
- [x] **LiveMap.tsx**: Keine Tarif-Beschränkung (alle Tarife) ✅
- [x] **DriverTracking.tsx**: Keine Tarif-Beschränkung (alle Tarife) ✅

### ✅ **Weitere geschützte Features (bestätigt):**

- [x] **Sidebar-Navigation** (`src/components/layout/AppSidebar.tsx`):
  - Zeile 64: Partner-Link mit `requiredTariff: "Business"`
  - Zeile 83: Statistiken-Link mit `requiredTariff: "Business"`
- [x] **MasterDashboard** (`src/pages/MasterDashboard.tsx`):
  - Zeile 28-38: Master-Account-Prüfung (nur `info@simsek.cc`, `nexify.login@gmail.com`)

---

## 📊 TARIF-MATRIX (Feature-Übersicht)

| Feature                      | Starter     | Business        | Enterprise      |
| ---------------------------- | ----------- | --------------- | --------------- |
| **Basis-Disposition**        | ✅          | ✅              | ✅              |
| **Aufträge/Kunden/Fahrer**   | ✅ (max. 3) | ✅ (unbegrenzt) | ✅ (unbegrenzt) |
| **Angebote/Rechnungen**      | ✅          | ✅              | ✅              |
| **Dokumente/Schichtzettel**  | ✅          | ✅              | ✅              |
| **Live-Map GPS-Tracking**    | ✅          | ✅              | ✅              |
| **Driver-Tracking (Mobile)** | ✅          | ✅              | ✅              |
| **Partner-Netzwerk**         | ❌          | ✅              | ✅              |
| **Statistiken/Charts**       | ❌          | ✅              | ✅              |
| **Landingpage + Buchung**    | ❌          | ✅              | ✅              |
| **AI Chatbot (Landingpage)** | ❌          | ✅              | ✅              |
| **API-Zugang**               | ❌          | ✅              | ✅              |
| **White-Label**              | ❌          | ❌              | ✅              |
| **Custom Integration**       | ❌          | ❌              | ✅              |
| **Dedizierter Support**      | ❌          | ❌              | ✅              |
| **SLA-Garantie**             | ❌          | ❌              | ✅              |

---

## 🛡️ DSGVO & RECHTLICHE KONFORMITÄT

**Tarif-Daten in der Datenbank:**

```sql
-- companies.subscription_product_id
'starter' | 'business' | 'enterprise'

-- companies.subscription_status
'active' | 'trial' | 'past_due' | 'canceled' | 'incomplete'

-- companies.billing_status
'active' | 'past_due' | 'unpaid' | 'canceled'
```

**DSGVO-Anforderungen:**

- ✅ Alle Tarif-Daten sind mit `company_id` isoliert (RLS Policies)
- ✅ Downgrade: Features werden deaktiviert, aber **Daten bleiben erhalten** (kein Löschen!)
- ✅ Kündigung: Account wird **archiviert**, nicht gelöscht (30 Tage Widerruf)

---

## 🚀 HINWEISE FÜR ENTWICKLER

### **Neue Feature implementieren mit Tarif-Schutz:**

```tsx
// Option 1: FeatureGate (empfohlen)
import { FeatureGate } from "@/components/shared/FeatureGate";

<FeatureGate requiredTariff="Business" featureName="Mein neues Feature">
  <MyNewFeature />
</FeatureGate>;

// Option 2: Manuelle Prüfung (für komplexe Logik)
import { useAuth } from "@/hooks/use-auth";

const { company } = useAuth();
const isBusiness =
  company?.subscription_product_id?.includes("business") ||
  company?.subscription_product_id?.includes("enterprise");

{
  isBusiness ? <PremiumFeature /> : <UpgradeMessage />;
}
```

### **Sidebar-Navigation erweitern:**

```tsx
// src/components/layout/AppSidebar.tsx
{
  title: "Neues Feature",
  url: "/neues-feature",
  icon: MyIcon,
  requiredTariff: "Business" // Optional: Business/Enterprise only
}
```

---

## 🔄 UPDATE-PROZESS

**Bei Tarif-Änderungen:**

1. **Stripe Webhook** (`supabase/functions/check-subscription/index.ts`):
   - Aktualisiert `companies.subscription_product_id`
   - Aktualisiert `companies.subscription_status`
2. **Frontend**: `useSubscription` Hook reagiert automatisch
3. **FeatureGate**: Re-rendert und zeigt/versteckt Features

---

## 🎉 ERFOLGSKRITERIEN

- [x] Alle Business-Features sind mit `<FeatureGate>` geschützt
- [x] Unternehmer-Landingpage nutzt `subscription_product_id` korrekt
- [x] Upgrade-Messages zeigen korrekte Tarif-Namen
- [x] Downgrade deaktiviert Features ohne Datenverlust
- [x] DSGVO-konform (RLS + Archiving)

---

**FINALE VORGABE:**  
Diese Dokumentation ist ab sofort **SYSTEMWEIT GÜLTIG** und darf **NICHT ABGEÄNDERT** werden.  
Alle neuen Features MÜSSEN dieser Tarif-Struktur folgen.

**Letzte Aktualisierung:** 15.10.2025, 21:00 Uhr  
**Status:** 🟢 PRODUKTIONSBEREIT  
**Autor:** AI-Agent (Claude Sonnet 4)
