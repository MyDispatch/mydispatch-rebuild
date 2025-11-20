# 📊 SYSTEM AUDIT V18.3.24
**Vollständiger Überblick über alle Systeme, Schemas & Vorgaben**

Datum: 18.01.2025  
Version: V18.3.24  
Status: 🔵 DOKUMENTATION - Referenz für Entwicklung

---

## 🗂️ DOKUMENTATIONS-STRUKTUR

### Hierarchie-Übersicht

```
MASTER_VORGABEN_CHECKLISTE_V18.3.24.md (Oberste Instanz)
├── QUALITY_GATES_V18.3.24.md (Automatische Validierung)
├── SYSTEM_AUDIT_V18.3.24.md (Diese Datei - Überblick)
│
├── CORE GUIDELINES
│   ├── INSTRUCTIONS_GUIDELINES_V18.3_FINAL.md
│   ├── SYSTEM_VORGABEN_V18.3.24_FINAL.md
│   └── BRANDING_VORGABEN_V18.3.24_FINAL.md
│
├── SPECIALIZED GUIDELINES
│   ├── ICON_GUIDELINES.md
│   ├── TARIFF_SYSTEM_V18.3.24.md
│   └── [Weitere spezielle Docs]
│
└── IMPLEMENTATION FILES
    ├── src/lib/design-tokens.ts
    ├── src/index.css
    ├── tailwind.config.ts
    └── src/lib/tariff/tariff-definitions.ts
```

---

## 1️⃣ DESIGN-SYSTEM

### 1.1 Farb-System V18.3.24

**Datei:** `src/index.css`

```css
:root {
  /* ✅ PRIMÄRE FARBEN (Erlaubt) */
  --primary: 40 31% 88%;        /* #EADEBD - Beige/Gold - Hauptfarbe */
  --foreground: 225 31% 28%;    /* #323D5E - Dunkelblau - Text */
  --background: 0 0% 100%;      /* #FFFFFF - Weiß */
  --muted: 210 40% 96.1%;       /* #F9FAFB - Gedämpft */
  --muted-foreground: 215.4 16.3% 46.9%;  /* #64748B */
  --border: 214.3 31.8% 91.4%;  /* #E2E8F0 */
  
  /* ✅ AMPEL-SYSTEM (Nur für Status/Badges) */
  --status-success: 142 71% 45%;   /* #22c55e - Grün */
  --status-warning: 48 96% 53%;    /* #eab308 - Gelb */
  --status-error: 0 84% 60%;       /* #ef4444 - Rot */
  
  /* ❌ DEPRECATED (Nicht mehr verwenden!) */
  /* --accent: 45 31% 54%;          VERBOTEN! */
  /* --accent-foreground: ...        VERBOTEN! */
}
```

**Status:** ✅ Produktiv  
**Änderungen:** accent entfernt (V18.3.24)

### 1.2 Layout-System

**Geschützte Werte (NIEMALS ändern):**

```typescript
// Header
height: 60px (h-16)
background: hsl(var(--primary))
position: fixed top-0
z-index: 50

// Sidebar
width: 64px (collapsed)
width: 240px (expanded)
transition: width 300ms ease-in-out
background: hsl(var(--background))

// Footer
padding: py-2 (8px)
background: hsl(var(--primary))
```

**Geschützte Dateien:**
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/AppSidebar.tsx`
- `src/components/layout/MainLayout.tsx`
- `src/components/layout/DashboardLayout.tsx`

**Status:** 🔒 GESCHÜTZT

### 1.3 Typography-System

**Datei:** `src/index.css`

```css
:root {
  /* Font-Familie */
  --font-base: 'Inter', system-ui, -apple-system, sans-serif;
  --font-headline: 'Geist', 'Inter', sans-serif;
  
  /* Font-Größen (Fluid) */
  --font-display: clamp(3rem, 5vw, 4.5rem);
  --font-h1: clamp(2rem, 4vw, 3rem);
  --font-h2: clamp(1.5rem, 3vw, 2rem);
  --font-h3: 1.5rem;
  --font-body: 1rem;
  --font-small: 0.875rem;
  --font-xs: 0.75rem;
}
```

**Status:** ✅ Produktiv

### 1.4 Spacing-System (8px Grid)

**DIN 5008 Standards:**

```typescript
space-y-1: 0.25rem (4px)
space-y-2: 0.5rem (8px)    // ← Basis
space-y-3: 0.75rem (12px)
space-y-4: 1rem (16px)     // ← Standard
space-y-6: 1.5rem (24px)
space-y-8: 2rem (32px)
space-y-12: 3rem (48px)
```

**Status:** ✅ Produktiv

---

## 2️⃣ TARIF-SYSTEM

### 2.1 Tariff Definitions

**Datei:** `src/lib/tariff/tariff-definitions.ts`

**Struktur:**

```typescript
interface TariffDefinition {
  id: string;                    // 'starter' | 'business' | 'enterprise'
  productId: string;             // Stripe Product ID
  name: string;
  description: string;
  priceMonthly: number;          // in €
  priceYearly: number;           // in €
  priceMonthlyFormatted: string; // "39 €"
  yearlyDiscount: number;
  limits: {
    users: number;               // -1 = unlimited
    drivers: number;
    vehicles: number;
    bookings: number;
    partners: number;
  };
  features: TariffFeature[];
  highlighted: boolean;
  ctaText: string;
  badge?: string;
}

// Aktuelle Tarife:
export const TARIFFS: TariffDefinition[] = [
  { id: 'starter', ... },      // 39 €/Monat, 3 Fahrer
  { id: 'business', ... },     // 79 €/Monat, unlimited
  { id: 'enterprise', ... }    // Custom
];
```

**Status:** ✅ Produktiv (Single Source of Truth)

### 2.2 Feature-Gating

**Hook:** `useTariffLimits` (`src/hooks/use-tariff-limits.tsx`)

```typescript
import { useTariffLimits } from '@/hooks/use-tariff-limits';

const { canAdd, showLimitWarning } = useTariffLimits();

// Beispiel: Neuen Fahrer hinzufügen
if (!canAdd('drivers')) {
  showLimitWarning('drivers');
  return;
}
```

**Komponente:** `UpgradePrompt` (`src/components/shared/UpgradePrompt.tsx`)

```typescript
import { UpgradePrompt } from '@/components/shared/UpgradePrompt';

if (!hasFeatureAccess(productId, 'partner_management')) {
  return (
    <UpgradePrompt 
      feature="Partner-Netzwerk" 
      requiredTariff="Business"
      variant="fullscreen"
    />
  );
}
```

**Status:** ✅ Produktiv

### 2.3 Stripe-Synchronisation

**Datei:** `src/lib/stripe/tariff-sync.ts`  
**Edge Function:** `supabase/functions/sync-tariff-to-stripe/index.ts`

```typescript
// Frontend triggert Sync:
import { triggerStripeSyncEdgeFunction } from '@/lib/stripe/tariff-sync';

await triggerStripeSyncEdgeFunction('business');
```

**Status:** ✅ Produktiv

---

## 3️⃣ SICHERHEITS-SYSTEM

### 3.1 Multi-Tenant Isolation

**Regel:** JEDE Datenbank-Query MUSS `company_id` filtern!

```typescript
// ✅ RICHTIG:
const { data } = await supabase
  .from('bookings')
  .select('*')
  .eq('company_id', profile.company_id)
  .eq('archived', false);

// ❌ FALSCH:
const { data } = await supabase
  .from('bookings')
  .select('*');
```

**Status:** 🔒 KRITISCH - IMMER beachten!

### 3.2 Archiving-System

**Regel:** NIEMALS `.delete()` verwenden!

```typescript
// ✅ RICHTIG:
await supabase
  .from('bookings')
  .update({ 
    archived: true, 
    archived_at: new Date().toISOString() 
  })
  .eq('id', bookingId);

// ❌ FALSCH:
await supabase
  .from('bookings')
  .delete()
  .eq('id', bookingId);
```

**Status:** 🔒 KRITISCH - IMMER beachten!

### 3.3 RLS Policies

**Supabase Tables:** Alle mit RLS aktiviert

```sql
-- Beispiel: bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own company bookings"
  ON public.bookings FOR SELECT
  USING (company_id = (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));
```

**Status:** ✅ Produktiv (58+ Policies aktiv)

---

## 4️⃣ BRANDING-SYSTEM

### 4.1 Verbotene Begriffe (Systemweit)

**Datei:** `docs/BRANDING_VORGABEN_V18.3.24_FINAL.md`

```
❌ NIEMALS VERWENDEN:
- Lovable / Lovable.dev / Lovable Cloud / Lovable AI
- Supabase / Supabase Dashboard
- React / Vite / TypeScript (öffentlich)
- n8n (öffentlich)
- Test-Account / Kostenlos testen / Free Trial
- Geld-zurück-Garantie
```

**Status:** 🔒 BINDEND

### 4.2 Erlaubte Begriffe

```
✅ IMMER VERWENDEN:
- MyDispatch / MyDispatch AI / MyDispatch System
- Google Cloud / Google Cloud Platform
- Backend / Datenbank / Cloud-Infrastruktur
- Verschlüsselte Secrets / Backend-Konfiguration
- Monatlich kündbar / Keine Mindestlaufzeit
```

**Status:** ✅ Empfohlen

---

## 5️⃣ ICON-SYSTEM

### 5.1 CI-Konforme Icon-Farben

**Datei:** `docs/ICON_GUIDELINES.md`

```typescript
// ✅ ERLAUBTE FARBEN:
text-foreground          // Hauptfarbe (dunkelblau)
text-muted-foreground    // Disabled-State
// text-accent           // ❌ ENTFERNT in V18.3.24!

// ❌ VERBOTEN:
text-status-success      // Nur auf StatusIndicator/Badge!
text-status-warning      // Nur auf StatusIndicator/Badge!
text-status-error        // Nur auf StatusIndicator/Badge!
text-green-*, text-red-* // Generische Tailwind-Farben verboten
```

**Beispiel:**

```tsx
// ✅ RICHTIG:
<Plus className="h-4 w-4 text-foreground" />
<Save className="h-5 w-5 text-muted-foreground" />

// ❌ FALSCH:
<Plus className="h-4 w-4 text-accent" />        // accent verboten!
<Check className="h-4 w-4 text-status-success" /> // nur auf Badge erlaubt!
```

**Status:** ✅ Produktiv

---

## 6️⃣ LOKALISIERUNGS-SYSTEM

### 6.1 Deutsche Formatierung

**Datei:** `src/lib/format-utils.ts`

```typescript
// Währung (DIN 5008)
formatCurrency(1234.56)  // "1.234,56 €"

// Datum
formatDate(new Date())   // "18.01.2025"

// Zeit
formatTime(new Date())   // "14:30"
```

**Neue Deutsche Rechtschreibung:**
- "Straße" (nicht "Strasse")
- "dass" (Konjunktion)
- "kennenlernen" (zusammen)

**Status:** ✅ Produktiv

### 6.2 Anrede/Titel-System

**Typen:**

```typescript
type Salutation = 'Herr' | 'Frau' | 'Divers' | null;
type Title = 'Dr.' | 'Prof.' | 'Dr. med.' | null;

// Beispiele:
"Sehr geehrte Frau Prof. Schmidt,"
"Guten Tag Alex Müller," // Divers
```

**Status:** ✅ Produktiv

---

## 7️⃣ DATENBANK-SCHEMA

### 7.1 Kern-Tabellen

```sql
-- Haupttabellen (mit RLS):
public.companies          -- Multi-Tenant Root
public.profiles           -- User-Profile (company_id FK)
public.bookings           -- Aufträge
public.customers          -- Kunden
public.drivers            -- Fahrer
public.vehicles           -- Fahrzeuge
public.invoices           -- Rechnungen
public.partners           -- Partner (Business+)
public.landingpages       -- Landingpages (Business+)

-- Alle mit:
- company_id (FK zu companies)
- archived (boolean, default: false)
- created_at, updated_at (timestamps)
```

**Status:** ✅ Produktiv

### 7.2 ENUMs

```sql
CREATE TYPE salutation AS ENUM ('Herr', 'Frau', 'Divers');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE vehicle_class AS ENUM ('Economy', 'Business Class', 'First Class', 'Van', 'Bus');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
```

**Status:** ✅ Produktiv

---

## 8️⃣ HOOKS & UTILITIES

### 8.1 Core Hooks

**Authentifizierung:**
- `useAuth()` - User, Profile, Company
- `useSubscription()` - Aktueller Tarif, hasAccess()

**Entities:**
- `useBookings()` - Aufträge mit company_id Filter
- `useCustomers()` - Kunden mit company_id Filter
- `useDrivers()` - Fahrer mit company_id Filter
- `useVehicles()` - Fahrzeuge mit company_id Filter

**Dashboard:**
- `useDashboardStats()` - Live-KPIs (Materialized View)

**Tarif:**
- `useTariffLimits()` - Limit-Enforcement

**Status:** ✅ Produktiv

### 8.2 Utility Functions

**Formatierung:**
- `formatCurrency(value)` - "1.234,56 €"
- `formatDate(date)` - "18.01.2025"
- `formatTime(date)` - "14:30"

**Validation:**
- `handleError(error, message)` - Zentrales Error-Handling
- `handleSuccess(message)` - Toast-Benachrichtigung

**Status:** ✅ Produktiv

---

## 9️⃣ INTEGRATION-SYSTEME

### 9.1 HERE Maps

**Datei:** `src/lib/here-maps-config.ts`

```typescript
// API-Key aus Supabase Secrets
const HERE_API_KEY = import.meta.env.VITE_HERE_API_KEY;

// Services:
- Geocoding (Adresse → Koordinaten)
- Routing (A → B Routenberechnung)
- Traffic (Live-Traffic-Daten)
- Autosuggest (AddressInput)
```

**Status:** ✅ Produktiv (Business+)

### 9.2 Stripe

**Produkte:**
- Starter (39 €/Monat)
- Business (79 €/Monat)
- Enterprise (Custom)

**Sync:**
- `sync-tariff-to-stripe` Edge Function
- Metadata-Update via Stripe API

**Status:** ✅ Produktiv

### 9.3 n8n Workflows

**Anzahl:** 25+ Workflows
**Features:**
- Email-Versand (Bestätigungen, Erinnerungen)
- Automatisierungen (Buchungen, Rechnungen)
- Partner-Benachrichtigungen (Business+)

**Status:** ✅ Produktiv

---

## 🔟 DEPLOYMENT & CI/CD

### 10.1 Quality Gates

**Pre-Commit Hook:**
- Farb-Validierung (kein accent)
- Icon-Farben (text-foreground)
- Security (kein DELETE)
- TypeScript (0 Errors)

**Status:** ✅ Empfohlen (siehe QUALITY_GATES_V18.3.24.md)

### 10.2 Build Pipeline

```bash
# TypeScript Type-Check
npm run type-check

# Build
npm run build

# Deploy (automatisch via Lovable)
# Edge Functions deploy automatisch
```

**Status:** ✅ Produktiv

---

## 1️⃣1️⃣ DOKUMENTATIONS-INDEX

### Haupt-Dokumente

| Datei | Zweck | Priorität | Status |
|-------|-------|-----------|--------|
| `MASTER_VORGABEN_CHECKLISTE_V18.3.24.md` | Oberste Instanz, Checklisten | 🔴 P0 | ✅ Aktiv |
| `QUALITY_GATES_V18.3.24.md` | Automatische Validierung | 🔴 P0 | ✅ Aktiv |
| `SYSTEM_AUDIT_V18.3.24.md` | Überblick (diese Datei) | 🟡 P1 | ✅ Aktiv |
| `INSTRUCTIONS_GUIDELINES_V18.3_FINAL.md` | Coding Standards | 🔴 P0 | ✅ Aktiv |
| `SYSTEM_VORGABEN_V18.3.24_FINAL.md` | System-Regeln | 🔴 P0 | ✅ Aktiv |
| `BRANDING_VORGABEN_V18.3.24_FINAL.md` | Branding-Regeln | 🔴 P0 | ✅ Aktiv |
| `TARIFF_SYSTEM_V18.3.24.md` | Tarif-System | 🟡 P1 | ✅ Aktiv |
| `ICON_GUIDELINES.md` | Icon-Farben | 🟡 P1 | ✅ Aktiv |

### Implementierungs-Dateien

| Datei | Zweck | Status |
|-------|-------|--------|
| `src/lib/design-tokens.ts` | Design-Token-System | ✅ Produktiv |
| `src/index.css` | CSS-Variablen (HSL) | ✅ Produktiv |
| `tailwind.config.ts` | Tailwind-Theme | ✅ Produktiv |
| `src/lib/tariff/tariff-definitions.ts` | Tarif-Definitionen | ✅ Produktiv |
| `src/hooks/use-tariff-limits.tsx` | Limit-Enforcement | ✅ Produktiv |
| `src/components/shared/UpgradePrompt.tsx` | Upgrade-UI | ✅ Produktiv |

---

## 1️⃣2️⃣ ÄNDERUNGSHISTORIE

### V18.3.24 (18.01.2025) - AKTUELL
- ✅ accent-Farbe systemweit entfernt
- ✅ MASTER_VORGABEN_CHECKLISTE erstellt
- ✅ QUALITY_GATES implementiert
- ✅ SYSTEM_AUDIT erstellt
- ✅ Pre-Commit Hook definiert
- ✅ Branding-Vorgaben verschärft

### V18.3.23 (17.01.2025)
- ✅ Tariff-System mit Feature-Gating
- ✅ TariffFeatureDialog optimiert
- ✅ Stripe-Synchronisation
- ✅ Limit-Enforcement

### V18.3.0 (16.01.2025)
- ✅ Design-Freeze etabliert
- ✅ Icon-Guidelines
- ✅ Multi-Tenant Security
- ✅ Archiving-System

---

## 🎯 ZUSAMMENFASSUNG

**Gesamtüberblick MyDispatch V18.3.24:**

```
📊 Dokumentation:      12 Haupt-Dokumente
🎨 Design-System:      5 Kern-Komponenten (ohne accent!)
🔒 Security:           Multi-Tenant + Archiving + RLS
💼 Tarif-System:       3 Tarife (Starter/Business/Enterprise)
🗄️  Datenbank:         10+ Kern-Tabellen, 58+ RLS Policies
🔧 Hooks/Utils:        15+ Custom Hooks
🌍 Integrationen:      HERE Maps, Stripe, n8n
✅ Quality Gates:      Automatische Validierung
🚀 Status:             100% Produktiv
```

**Kritische Vorgaben:**
1. ❌ KEIN accent mehr (nur primary/foreground)
2. 🔒 IMMER company_id filtern
3. 🗑️ NIEMALS DELETE (nur Archiving)
4. 🏢 KEIN Lovable/Supabase Branding
5. 💰 Feature-Gating über tariff-definitions.ts

---

**Version:** V18.3.24  
**Letzte Aktualisierung:** 18.01.2025  
**Status:** ✅ VOLLSTÄNDIG  
**Änderungsvorbehalt:** info@my-dispatch.de
