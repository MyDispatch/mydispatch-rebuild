# Tarifsteuerung-System V18.2 - Vollständige Dokumentation

## 🎯 Übersicht

MyDispatch verwendet ein **3-Stufen-Tarifsystem** mit zentraler Steuerung über Stripe Product IDs.

### Tarife

| Tarif | Monatspreis | Product IDs | Features |
|-------|-------------|-------------|----------|
| **Starter** | 39€ | `prod_TEeg0ykplmGKd0`, `prod_TF5cFE5Fi5rBCz` | Basisdisposition, bis zu 3 Fahrer/Fahrzeuge, Info-Landingpage |
| **Business** | 99€ | `prod_TEegHmtpPZOZcG`, `prod_TF5cnWFZYEQUsG` | Alle Starter-Features + Partner-Management, Buchungswidget, Kunden-Portal, Live-Traffic, Statistiken |
| **Enterprise** | Custom | `prod_ENTERPRISE_ID_PLACEHOLDER` | Alle Business-Features + White-Label, Premium-Support |

## 📋 Zentrale Tarif-Utilities

**Datei:** `src/lib/subscription-utils.ts`

```typescript
export const PRODUCT_IDS = {
  starter: ['prod_TEeg0ykplmGKd0', 'prod_TF5cFE5Fi5rBCz'],
  business: ['prod_TEegHmtpPZOZcG', 'prod_TF5cnWFZYEQUsG'],
  enterprise: ['prod_ENTERPRISE_ID_PLACEHOLDER']
}

export function isBusinessTier(productId: string | null | undefined): boolean
export function isStarterTier(productId: string | null | undefined): boolean
export function isEnterpriseTier(productId: string | null | undefined): boolean
export function getTierName(productId: string | null | undefined): string
```

## 🔑 Kritische Regel

**NIEMALS** Tarif-IDs hardcoden! **IMMER** die Funktionen aus `subscription-utils.ts` verwenden.

## 📊 Datenbank-Schema

### companies.subscription_product_id

**Typ:** `TEXT`  
**Nullable:** `YES`  
**Beispielwert:** `prod_TEegHmtpPZOZcG` (Business)

```sql
-- Tarif eines Unternehmens prüfen
SELECT 
  name, 
  subscription_product_id, 
  subscription_status 
FROM companies 
WHERE id = 'company-uuid';
```

## 🎨 Systemweite Implementierung

### 1. Auth.tsx - Login-Seite

**Datei:** `src/pages/Auth.tsx`

```typescript
// Company-Branding mit Tarif laden
const { data } = await supabase
  .from('companies')
  .select('id, name, logo_url, primary_color, company_slug, subscription_product_id')
  .eq('id', companyId)
  .maybeSingle();

// Tarif-Name ermitteln
const companyTier = getTierName(brandedCompany.subscription_product_id);

// UI anpassen
<CardDescription>
  {brandedCompany 
    ? `Login für Mitarbeiter und Kunden${companyTier ? ` • ${companyTier}-Tarif` : ''}` 
    : 'Professionelle Dispositionssoftware'}
</CardDescription>
```

**Features:**
- ✅ Lädt `subscription_product_id` beim Branding-Fetch
- ✅ Zeigt korrekten Tarif-Namen an
- ✅ Registrierung nur bei öffentlichem Login (nicht gebrandet)

### 2. Unternehmer.tsx - Landing Page

**Datei:** `src/pages/Unternehmer.tsx`

```typescript
// Alle Company-Daten laden (inkl. subscription_product_id)
const { data } = await supabase.from('companies').select('*')
  .eq('company_slug', slug)
  .eq('landingpage_enabled', true)
  .maybeSingle();

// Tarif-Checks
const isStarter = isStarterTier(company?.subscription_product_id);
const isBusiness = isBusinessTier(company?.subscription_product_id);
const isEnterprise = isEnterpriseTier(company?.subscription_product_id);

// Feature-Zugriff
const hasBookingAccess = isBusiness || isEnterprise;
const hasCustomerPortal = isBusiness || isEnterprise;
```

**Tarif-abhängige Features:**
- ✅ **Booking-Widget:** Nur Business/Enterprise
- ✅ **Kunden-Portal-Button:** Nur Business/Enterprise
- ✅ **Footer "Powered by":** Starter/Business (nicht Enterprise)

### 3. AppSidebar.tsx - Navigation

**Datei:** `src/components/layout/AppSidebar.tsx`

```typescript
const productId = company?.subscription_product_id;

// Feature-Visibility
const showPartnerManagement = isBusinessTier(productId) || isEnterpriseTier(productId);
const showStatistics = isBusinessTier(productId) || isEnterpriseTier(productId);
```

**Tarif-abhängige Menüpunkte:**
- ✅ **Partner:** Nur Business/Enterprise
- ✅ **Statistiken:** Nur Business/Enterprise
- ✅ **Office-Verwaltung:** Nur Business/Enterprise

### 4. FeatureGate.tsx - Feature-Schutz

**Datei:** `src/components/shared/FeatureGate.tsx`

```typescript
<FeatureGate
  feature="booking_widget"
  requiredTier="business"
  fallback={<div>Upgrade erforderlich</div>}
>
  <BookingWidget />
</FeatureGate>
```

**Geschützte Features:**
- `booking_widget` → Business/Enterprise
- `customer_portal` → Business/Enterprise
- `partner_management` → Business/Enterprise
- `statistics` → Business/Enterprise
- `ai_chatbot` → Business/Enterprise

### 5. use-subscription.tsx - Hook

**Datei:** `src/hooks/use-subscription.tsx`

```typescript
const { data: companyData } = await supabase
  .from('companies')
  .select('subscription_product_id, subscription_status, subscription_current_period_end')
  .eq('id', companyId)
  .single();

return {
  productId: companyData.subscription_product_id,
  status: companyData.subscription_status,
  currentPeriodEnd: companyData.subscription_current_period_end
};
```

### 6. Einstellungen.tsx - Tarif-Anzeige

**Datei:** `src/pages/Einstellungen.tsx`

```typescript
<Badge 
  type={isBusinessTier(productId) ? 'success' : 'info'}
  label={isBusinessTier(productId) ? 'Business' : 'Starter'}
/>

{/* Feature-Warnung bei Starter-Tarif */}
{!isBusinessTier(productId) && (
  <Alert>
    <p>Dieses Feature ist nur im Business-Tarif verfügbar.</p>
    <Button onClick={upgradeToBusinessTier}>Jetzt upgraden</Button>
  </Alert>
)}
```

## 🔒 RLS-Policies & Security

### Public Access für Landing Pages

```sql
-- Öffentlicher Lesezugriff für aktivierte Landingpages
CREATE POLICY "Public can view companies with enabled landingpage"
ON companies FOR SELECT
USING (landingpage_enabled = true);
```

**Felder öffentlich sichtbar:**
- `id`, `name`, `logo_url`, `primary_color`, `company_slug`
- `landingpage_title`, `landingpage_hero_text`, `landingpage_description`
- `address`, `phone`, `email`, `business_hours`
- `widget_enabled`, `widget_button_text`, `widget_size`, `widget_show_phone`
- **`subscription_product_id`** (für Tarif-Checks auf Landing Page)

### Authentifizierter Zugriff

```sql
-- Unternehmer können eigene Company-Daten sehen/bearbeiten
CREATE POLICY "company_select_policy"
ON companies FOR SELECT
USING (id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid()));
```

## 🐛 Häufige Fehlerquellen & Lösungen

### Problem 1: Tarif wird nicht erkannt

**Symptom:** Feature wird angezeigt obwohl Tarif nicht passt

**Ursache:**
```typescript
// ❌ FALSCH - subscription_product_id nicht geladen
const { data } = await supabase
  .from('companies')
  .select('id, name, logo_url')
  .eq('id', companyId);
```

**Lösung:**
```typescript
// ✅ RICHTIG - subscription_product_id IMMER laden
const { data } = await supabase
  .from('companies')
  .select('id, name, logo_url, subscription_product_id')
  .eq('id', companyId);
```

### Problem 2: Hardcodierte Tarif-Prüfung

**Symptom:** Tarif-Check funktioniert nicht bei neuen Product IDs

**Ursache:**
```typescript
// ❌ FALSCH - Hardcodierte ID
if (productId === 'prod_TEegHmtpPZOZcG') { ... }
```

**Lösung:**
```typescript
// ✅ RICHTIG - Zentrale Utility verwenden
import { isBusinessTier } from '@/lib/subscription-utils';
if (isBusinessTier(productId)) { ... }
```

### Problem 3: Fehlende Null-Checks

**Symptom:** TypeScript-Fehler oder Runtime-Fehler

**Ursache:**
```typescript
// ❌ FALSCH - Keine Null-Prüfung
const isBusiness = PRODUCT_IDS.business.includes(productId);
```

**Lösung:**
```typescript
// ✅ RICHTIG - Utility macht Null-Check automatisch
const isBusiness = isBusinessTier(productId);
```

### Problem 4: .single() statt .maybeSingle()

**Symptom:** Fehler "Expected one row, got zero"

**Ursache:**
```typescript
// ❌ FALSCH - single() wirft Fehler bei leerem Ergebnis
const { data } = await supabase
  .from('companies')
  .select('*')
  .eq('company_slug', slug)
  .single();
```

**Lösung:**
```typescript
// ✅ RICHTIG - maybeSingle() gibt null bei leerem Ergebnis
const { data } = await supabase
  .from('companies')
  .select('*')
  .eq('company_slug', slug)
  .maybeSingle();
```

## 📝 Checkliste für neue Features

Bei Implementierung neuer Features:

- [ ] `subscription_product_id` in Query laden
- [ ] Tarif-Check mit `isBusinessTier()` / `isStarterTier()` / `isEnterpriseTier()`
- [ ] UI anpassen basierend auf Tarif
- [ ] `<FeatureGate>` für geschützte Features verwenden
- [ ] Fallback-UI für niedrigere Tarife implementieren
- [ ] `.maybeSingle()` statt `.single()` bei unsicheren Queries
- [ ] Null-Checks für `productId` durchführen
- [ ] Niemals Product IDs hardcoden

## 🧪 Testing-Szenarien

### Test-Accounts

| Email | Unternehmen | Tarif | Product ID |
|-------|------------|-------|-----------|
| `courbois1981@gmail.com` | Taxi123 | Business | `prod_TEegHmtpPZOZcG` |

### Test-Szenarien

1. **Landing Page (Starter):**
   - ✅ Info-Landingpage sichtbar
   - ✅ Kein Booking-Widget
   - ✅ Kein Kunden-Portal-Button
   - ✅ "Powered by MyDispatch" im Footer

2. **Landing Page (Business):**
   - ✅ Info-Landingpage sichtbar
   - ✅ Booking-Widget verfügbar
   - ✅ Kunden-Portal-Button sichtbar
   - ✅ "Powered by MyDispatch" im Footer

3. **Landing Page (Enterprise):**
   - ✅ Info-Landingpage sichtbar
   - ✅ Booking-Widget verfügbar
   - ✅ Kunden-Portal-Button sichtbar
   - ✅ KEIN "Powered by" im Footer (White-Label)

4. **Auth-Seite (gebrandet):**
   - ✅ Company-Logo und Farben
   - ✅ Tarif-Name in Beschreibung ("Business-Tarif")
   - ✅ Zurück-Button zur Landing (mit Slug)
   - ✅ KEINE Registrierung sichtbar (nur Login)

5. **Auth-Seite (öffentlich):**
   - ✅ MyDispatch-Branding
   - ✅ Login UND Registrierung verfügbar
   - ✅ Zur Startseite-Button

## 🚀 Deployment-Hinweise

### Stripe Integration

**Required Secrets:**
- `STRIPE_SECRET_KEY` (sk_live_... oder sk_test_...)
- `STRIPE_CUSTOMER_PORTAL_URL`

**Webhook-Endpunkte:**
- `/api/stripe/webhook` (für Subscription-Updates)

### Supabase Configuration

**Edge Functions:**
- `create-checkout` - Stripe Checkout-Session erstellen
- `check-subscription` - Subscription-Status prüfen
- `customer-portal` - Stripe Customer Portal öffnen

## 📞 Support & Fehlerbehebung

Bei Problemen mit Tarifsteuerung:

1. **Tarif in DB prüfen:**
   ```sql
   SELECT name, subscription_product_id, subscription_status 
   FROM companies 
   WHERE email = 'user@example.com';
   ```

2. **Product ID in subscription-utils.ts prüfen:**
   - Ist die Product ID in `PRODUCT_IDS` enthalten?
   - Wird korrekte Tier-Funktion verwendet?

3. **RLS-Policies prüfen:**
   - Kann der Nutzer die Company-Daten sehen?
   - Wird `subscription_product_id` geladen?

4. **Console-Logs aktivieren:**
   ```typescript
   console.log('Company:', company);
   console.log('Product ID:', company?.subscription_product_id);
   console.log('Is Business:', isBusinessTier(company?.subscription_product_id));
   ```

---

**Version:** V18.2  
**Stand:** 18.10.2025  
**Autor:** MyDispatch Development Team
