# Customer Specification V18.5.0

**Status:** Production-Ready  
**Letzte Aktualisierung:** 2025-10-22  
**Verantwortlich:** Pascal Courbois  
**Kategorie:** Page Specification

---

## 🎯 Übersicht

Die **Customers-Seite** verwaltet alle Kundendaten mit Historie, Präferenzen und Kommunikation.

---

## 📊 Datenbankschema

### **Tabelle: `customers`**

```sql
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_number TEXT NOT NULL UNIQUE,
  
  -- Persönliche Daten
  customer_type TEXT NOT NULL DEFAULT 'individual' CHECK (customer_type IN (
    'individual',  -- Privatkunde
    'business'     -- Geschäftskunde
  )),
  
  -- Individual
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  
  -- Business
  company_name TEXT,
  vat_number TEXT,
  
  -- Kontakt
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  mobile TEXT,
  
  -- Adresse
  street TEXT,
  postal_code TEXT,
  city TEXT,
  country TEXT DEFAULT 'DE',
  
  -- Präferenzen
  preferred_payment_method TEXT CHECK (preferred_payment_method IN (
    'cash',
    'card',
    'invoice',
    'prepaid'
  )),
  preferred_vehicle_type TEXT CHECK (preferred_vehicle_type IN (
    'sedan',
    'suv',
    'van',
    'luxury',
    'minibus'
  )),
  language TEXT DEFAULT 'de' CHECK (language IN ('de', 'en', 'fr', 'es')),
  
  -- Marketing
  newsletter_subscribed BOOLEAN DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,
  
  -- Statistiken
  total_orders INTEGER DEFAULT 0,
  completed_orders INTEGER DEFAULT 0,
  cancelled_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0.00,
  avg_rating DECIMAL(3, 2),
  
  -- Customer Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
    'active',
    'inactive',
    'blocked'
  )),
  
  -- VIP/Corporate
  is_vip BOOLEAN DEFAULT false,
  discount_percentage DECIMAL(5, 2) DEFAULT 0.00,
  credit_limit DECIMAL(10, 2),
  
  -- Notizen
  notes TEXT,
  
  -- System
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indizes
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_phone ON public.customers(phone);
CREATE INDEX idx_customers_type ON public.customers(customer_type);
CREATE INDEX idx_customers_status ON public.customers(status);
CREATE INDEX idx_customers_created_at ON public.customers(created_at DESC);

-- Auto-generate customer number
CREATE OR REPLACE FUNCTION generate_customer_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_type = 'business' THEN
    NEW.customer_number := 'CUS-B-' || LPAD(NEXTVAL('customer_number_seq')::TEXT, 5, '0');
  ELSE
    NEW.customer_number := 'CUS-P-' || LPAD(NEXTVAL('customer_number_seq')::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS customer_number_seq;

CREATE TRIGGER set_customer_number
BEFORE INSERT ON public.customers
FOR EACH ROW
WHEN (NEW.customer_number IS NULL)
EXECUTE FUNCTION generate_customer_number();

-- Auto-update timestamp
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view customers" 
ON public.customers FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create customers" 
ON public.customers FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update customers" 
ON public.customers FOR UPDATE 
USING (auth.uid() IS NOT NULL);
```

---

## 🎨 UI-Komponenten

### **1. Customers List View**

```typescript
// src/pages/Customers.tsx
import { CustomersList } from "@/components/customers/CustomersList";
import { CustomersFilters } from "@/components/customers/CustomersFilters";
import { AddCustomerButton } from "@/components/customers/AddCustomerButton";

export function Customers() {
  return (
    <div className="container-safe space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-heading">Kunden</h1>
        <AddCustomerButton />
      </div>
      
      <CustomersFilters />
      <CustomersList />
    </div>
  );
}
```

### **2. Customers Table**

**Spalten:**
- Kundennummer (mit VIP Badge wenn is_vip)
- Name/Firma
- Typ (Badge: Privat/Geschäft)
- Email
- Telefon
- Anzahl Aufträge
- Gesamt-Umsatz
- Status (Badge)
- Aktionen (View/Edit/Block)

**Features:**
- Quick Search (Name, Email, Telefon)
- Filter: Typ, Status, VIP
- Sort: Name, Umsatz, Anzahl Aufträge
- Export als CSV/Excel
- Bulk Actions: Newsletter versenden, Status ändern

### **3. Add/Edit Customer Form**

**Step 1: Kundentyp wählen**
```typescript
<RadioGroup>
  <Radio value="individual">Privatkunde</Radio>
  <Radio value="business">Geschäftskunde</Radio>
</RadioGroup>
```

**Step 2A: Privatkunde-Daten**
- Vorname (Text Input)
- Nachname (Text Input)
- Geburtsdatum (Date Picker)
- Email (Email Input)
- Telefon (Phone Input)
- Mobilnummer (Phone Input, optional)

**Step 2B: Geschäftskunde-Daten**
- Firmenname (Text Input)
- USt-IdNr. (Text Input mit Validation)
- Ansprechpartner Vorname
- Ansprechpartner Nachname
- Email (Firmen-Email)
- Telefon
- Mobilnummer (optional)

**Step 3: Adresse**
- Straße + Hausnummer
- PLZ
- Stadt
- Land (Select)

**Step 4: Präferenzen**
- Bevorzugte Zahlungsmethode (Select)
- Bevorzugter Fahrzeugtyp (Select)
- Sprache (Select: DE, EN, FR, ES)
- VIP-Status (Checkbox)
- Rabatt in % (Number Input, nur wenn VIP)
- Kreditlimit (Number Input, nur Business)

**Step 5: Marketing**
- Newsletter abonnieren (Checkbox)
- Marketing-Einwilligung (Checkbox mit DSGVO-Hinweis)

**Validation:**
- Email format + Uniqueness check
- Telefon format DE
- USt-IdNr. Validation (Format + Prüfziffer)
- Geburtsdatum: Kunde muss mind. 18 Jahre alt sein
- Kreditlimit nur > 0 wenn Business

### **4. Customer Detail View**

**Tabs:**

**1. Übersicht**
- Customer Card (Nummer, Typ, Kontakt, Status)
- Stats Widget (Aufträge, Umsatz, Durchschnittsbewertung)
- VIP Badge & Benefits
- Quick Actions (Auftrag erstellen, Email senden, Anrufen)

**2. Aufträge**
- Table mit allen Aufträgen des Kunden
- Filter: Status, Datum
- Quick Create Order Button

**3. Rechnungen**
- Table mit allen Rechnungen
- Status: Offen, Bezahlt, Überfällig
- Gesamtsumme & Offene Posten
- Download Invoice PDFs

**4. Kommunikation**
- Timeline aller Interaktionen
  - Phone Calls (mit Notizen)
  - Emails (gesendete/empfangene)
  - SMS
  - WhatsApp (wenn integriert)
- "Neue Nachricht senden" Button

**5. Dokumente**
- Upload/View Customer Documents
- Contracts, Agreements, ID-Scans etc.

**6. Notizen**
- Internal Notes (nur für Staff)
- Rich Text Editor
- Timeline-View mit Author + Timestamp

---

## 🚀 Edge Functions

### **1. Customer Analytics**

```typescript
// supabase/functions/customer-analytics/index.ts
// Input: customer_id, date_range
// Output: order_frequency, avg_order_value, lifetime_value, churn_risk
```

### **2. Duplicate Customer Detection**

```typescript
// supabase/functions/detect-duplicate-customers/index.ts
// Input: email, phone, name
// Output: potential_duplicates[]
```

**Logik:**
- Fuzzy-Match auf Name (Levenshtein-Distanz)
- Exact-Match auf Email & Phone
- Score-basiertes Ranking

### **3. Customer Segmentation**

```typescript
// supabase/functions/segment-customers/index.ts
// Output: segments[] (VIP, Active, At-Risk, Inactive, etc.)
```

**Segmente:**
- **VIP**: is_vip = true OR total_spent > 5000€
- **Active**: completed_orders > 0 in letzten 30 Tagen
- **At-Risk**: Keine Orders in letzten 90 Tagen, aber davor aktiv
- **Inactive**: Keine Orders in letzten 180 Tagen

---

## 📱 Realtime Features

```typescript
// Enable Realtime für Customers (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
```

---

## 🎨 Design System

### **Customer Type Colors**

```css
:root {
  --customer-individual: 221 83% 53%;
  --customer-individual-foreground: 0 0% 100%;
  
  --customer-business: 262 83% 58%;
  --customer-business-foreground: 0 0% 100%;
  
  --customer-vip: 47 96% 53%;
  --customer-vip-foreground: 26 83% 14%;
}
```

### **VIP Badge Component**

```typescript
// src/components/customers/VipBadge.tsx
export function VipBadge() {
  return (
    <Badge className="bg-customer-vip text-customer-vip-foreground">
      <Crown className="h-3 w-3 mr-1" />
      VIP
    </Badge>
  );
}
```

---

## 🧪 Testing

```typescript
// tests/customers.spec.ts
test('Add private customer', async ({ page }) => {
  await page.goto('/customers');
  await page.click('text=Neuer Kunde');
  
  await page.click('[value="individual"]');
  await page.fill('[name="first_name"]', 'Max');
  await page.fill('[name="last_name"]', 'Mustermann');
  await page.fill('[name="email"]', 'max@example.com');
  await page.fill('[name="phone"]', '+49 170 1234567');
  
  await page.click('button[type="submit"]');
  
  await expect(page.locator('text=Kunde erstellt')).toBeVisible();
});

test('Detect duplicate customer', async ({ page }) => {
  // Create first customer
  await createCustomer({ email: 'test@example.com' });
  
  // Try to create duplicate
  await page.goto('/customers/new');
  await page.fill('[name="email"]', 'test@example.com');
  
  // Should show warning
  await expect(page.locator('text=Kunde mit dieser Email existiert bereits')).toBeVisible();
});
```

---

## 📊 DSGVO Compliance

**Wichtige Features:**
- **Data Export**: Kunde kann alle seine Daten als JSON/PDF exportieren
- **Data Deletion**: "Recht auf Vergessenwerden" - anonymisiert Kundendaten
- **Consent Management**: Tracking aller Einwilligungen (Marketing, Newsletter)
- **Data Retention**: Automatische Löschung inaktiver Kunden nach 3 Jahren (konfigurierbar)

```sql
-- DSGVO: Anonymize Customer
CREATE OR REPLACE FUNCTION anonymize_customer(customer_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.customers
  SET
    first_name = 'ANONYMIZED',
    last_name = 'ANONYMIZED',
    email = 'deleted-' || id || '@anonymized.com',
    phone = 'DELETED',
    mobile = NULL,
    street = NULL,
    postal_code = NULL,
    city = NULL,
    notes = 'Customer data anonymized per GDPR request',
    status = 'inactive'
  WHERE id = customer_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🔗 Verknüpfte Dokumente

- [ORDERS_SPECIFICATION_V18.5.0.md](./ORDERS_SPECIFICATION_V18.5.0.md)
- [INVOICES_SPECIFICATION_V18.5.0.md](./INVOICES_SPECIFICATION_V18.5.0.md)
- [FORM_STANDARDS_V18.5.0.md](./FORM_STANDARDS_V18.5.0.md)

---

**Letzte Aktualisierung:** 2025-10-22 22:00 (DE)  
**Version:** 18.5.0  
**Status:** ✅ Production-Ready
