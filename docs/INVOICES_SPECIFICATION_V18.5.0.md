# Invoices Specification V18.5.0

**Status:** Production-Ready  
**Letzte Aktualisierung:** 2025-10-22  
**Verantwortlich:** Pascal Courbois  
**Kategorie:** Page Specification

---

## 🎯 Übersicht

Die **Invoices-Seite** verwaltet alle Rechnungen mit automatischer Generierung, PDF-Export und Zahlungstracking.

---

## 📊 Datenbankschema

### **Tabelle: `invoices`**

```sql
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,

  -- Verknüpfungen
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,

  -- Rechnungsdaten
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  payment_terms INTEGER NOT NULL DEFAULT 14, -- Tage

  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft',      -- Entwurf
    'sent',       -- Versendet
    'paid',       -- Bezahlt
    'overdue',    -- Überfällig
    'cancelled'   -- Storniert
  )),

  -- Beträge (in Cent für Präzision, später durch 100 teilen)
  subtotal INTEGER NOT NULL, -- Netto
  tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 19.00, -- Steuersatz in %
  tax_amount INTEGER NOT NULL, -- Steuerbetrag
  total_amount INTEGER NOT NULL, -- Brutto
  currency TEXT NOT NULL DEFAULT 'EUR',

  -- Zahlungsinformationen
  payment_method TEXT CHECK (payment_method IN (
    'cash',
    'card',
    'bank_transfer',
    'paypal',
    'invoice'
  )),
  payment_date TIMESTAMP WITH TIME ZONE,
  payment_reference TEXT, -- Referenz/Transaktions-ID

  -- Dokumente
  pdf_url TEXT,

  -- Notizen
  notes TEXT,
  internal_notes TEXT, -- Nur für Staff sichtbar

  -- System
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indizes
CREATE INDEX idx_invoices_customer ON public.invoices(customer_id);
CREATE INDEX idx_invoices_order ON public.invoices(order_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX idx_invoices_invoice_date ON public.invoices(invoice_date DESC);

-- Auto-generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.invoice_number := 'INV-' || TO_CHAR(now(), 'YYYY') || '-' ||
    LPAD(NEXTVAL('invoice_number_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS invoice_number_seq;

CREATE TRIGGER set_invoice_number
BEFORE INSERT ON public.invoices
FOR EACH ROW
WHEN (NEW.invoice_number IS NULL)
EXECUTE FUNCTION generate_invoice_number();

-- Auto-calculate due_date
CREATE OR REPLACE FUNCTION calculate_due_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.due_date IS NULL THEN
    NEW.due_date := NEW.invoice_date + (NEW.payment_terms || ' days')::INTERVAL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_due_date
BEFORE INSERT ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION calculate_due_date();

-- Auto-update status to overdue
CREATE OR REPLACE FUNCTION check_invoice_overdue()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'sent' AND NEW.due_date < CURRENT_DATE THEN
    NEW.status := 'overdue';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_overdue_status
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION check_invoice_overdue();

-- Auto-update timestamp
CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invoices"
ON public.invoices FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create invoices"
ON public.invoices FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update invoices"
ON public.invoices FOR UPDATE
USING (auth.uid() IS NOT NULL);
```

### **Tabelle: `invoice_items`**

```sql
CREATE TABLE public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,

  -- Position
  position INTEGER NOT NULL, -- Reihenfolge

  -- Artikel/Service
  description TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 1.00 CHECK (quantity > 0),
  unit_price INTEGER NOT NULL, -- in Cent

  -- Berechnung
  line_total INTEGER NOT NULL, -- quantity * unit_price

  -- Optional: Verknüpfung zu Auftrag
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indizes
CREATE INDEX idx_invoice_items_invoice ON public.invoice_items(invoice_id);

-- Auto-calculate line_total
CREATE OR REPLACE FUNCTION calculate_line_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.line_total := (NEW.quantity * NEW.unit_price)::INTEGER;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_line_total
BEFORE INSERT OR UPDATE ON public.invoice_items
FOR EACH ROW
EXECUTE FUNCTION calculate_line_total();

-- RLS Policies
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invoice items"
ON public.invoice_items FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage invoice items"
ON public.invoice_items FOR ALL
USING (auth.uid() IS NOT NULL);
```

---

## 🎨 UI-Komponenten

### **1. Invoices List View**

```typescript
// src/pages/Invoices.tsx
import { InvoicesList } from "@/components/invoices/InvoicesList";
import { InvoicesFilters } from "@/components/invoices/InvoicesFilters";
import { CreateInvoiceButton } from "@/components/invoices/CreateInvoiceButton";

export function Invoices() {
  return (
    <div className="container-safe space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-heading">Rechnungen</h1>
        <CreateInvoiceButton />
      </div>

      <InvoicesFilters />
      <InvoicesList />
    </div>
  );
}
```

### **2. Invoices Table**

**Spalten:**

- Rechnungsnummer
- Kunde (Name + Kundennummer)
- Rechnungsdatum
- Fälligkeitsdatum
- Gesamt-Betrag
- Status (Badge)
- Aktionen (View/Download PDF/Mark Paid/Send Email)

**Features:**

- Status-Filter: Alle, Entwurf, Versendet, Bezahlt, Überfällig
- Date Range Picker
- Quick Stats Cards:
  - Offene Rechnungen (Anzahl + Betrag)
  - Überfällige Rechnungen (Anzahl + Betrag)
  - Umsatz diesen Monat
  - Durchschnittliche Zahlungsdauer
- Bulk Actions: PDF-Download, Email versenden, Status ändern

### **3. Create Invoice Form**

**Step 1: Kunde auswählen**

```typescript
<CustomerSelect
  onSelect={(customer) => {
    // Auto-fill customer data
    // Load customer's open orders
  }}
/>
```

**Step 2: Rechnungsdaten**

- Rechnungsdatum (Date Picker, default: heute)
- Zahlungsziel in Tagen (Number Input, default: 14)
- Fälligkeitsdatum (auto-calculated, read-only)
- Zahlungsmethode (Select)

**Step 3: Positionen hinzufügen**

```typescript
<InvoiceItemsTable>
  {items.map((item, index) => (
    <InvoiceItemRow
      key={index}
      position={index + 1}
      description={item.description}
      quantity={item.quantity}
      unitPrice={item.unitPrice}
      lineTotal={item.lineTotal}
      onRemove={() => removeItem(index)}
    />
  ))}
  <AddItemButton />
</InvoiceItemsTable>
```

**Positionen können sein:**

- Manuell eingetragen
- Aus Auftrag übernommen (Auto-Fill von Order)
- Aus Vorlage (z.B. "Taxi-Fahrt Flughafen")

**Step 4: Zusammenfassung**

- Zwischensumme (Netto)
- Steuersatz (Select: 0%, 7%, 19%)
- Steuerbetrag (auto-calculated)
- **Gesamtbetrag (Brutto)**

**Optional:**

- Notizen (für Kunde sichtbar)
- Interne Notizen (nur Staff)

**Validation:**

- Mindestens 1 Position
- Alle Positionen mit Beschreibung und Preis > 0
- Fälligkeitsdatum muss nach Rechnungsdatum liegen

### **4. Invoice Detail View**

**Layout:**

```
┌─────────────────────────────────────────────────┐
│  INV-2025-00123            Status: [Badge]      │
│  Rechnungsdatum: 22.10.2025                     │
│  Fälligkeitsdatum: 05.11.2025                   │
├─────────────────────────────────────────────────┤
│  KUNDE:                                          │
│  Max Mustermann (CUS-P-00042)                   │
│  Musterstraße 123, 10115 Berlin                 │
│  max@example.com | +49 170 1234567              │
├─────────────────────────────────────────────────┤
│  POSITIONEN:                                     │
│  Pos | Beschreibung      | Menge | Preis | Sum  │
│  ────┼───────────────────┼───────┼───────┼───── │
│   1  | Taxi-Fahrt        |  1.00 | 45.00 | 45.00│
│   2  | Flughafen-Gebühr  |  1.00 | 10.00 | 10.00│
├─────────────────────────────────────────────────┤
│                         Zwischensumme: 55,00 €  │
│                         MwSt. 19%:     10,45 €  │
│                         ─────────────────────   │
│                         Gesamt:        65,45 €  │
├─────────────────────────────────────────────────┤
│  AKTIONEN:                                       │
│  [Download PDF] [Als bezahlt markieren]         │
│  [Per Email senden] [Bearbeiten] [Stornieren]   │
└─────────────────────────────────────────────────┘
```

**Payment Timeline:**

- Erstellt am: 22.10.2025
- Versendet am: 22.10.2025 (per Email)
- Fällig am: 05.11.2025
- Bezahlt am: [wenn paid]

---

## 🚀 Edge Functions

### **1. Generate Invoice PDF**

```typescript
// supabase/functions/generate-invoice-pdf/index.ts
// Input: invoice_id
// Output: pdf_url (Supabase Storage)
```

**Libraries:**

- `jsPDF` oder `puppeteer` für PDF-Generierung
- Template: Professional Invoice Layout mit Firmen-Logo

**PDF Sections:**

- Header (Firma, Logo, Kontaktdaten)
- Rechnungsnummer, Datum, Fälligkeitsdatum
- Kundenadresse
- Positionen (Table)
- Summen (Netto, Steuer, Brutto)
- Footer (Bankverbindung, Steuernummer, Rechtliches)

### **2. Send Invoice via Email**

```typescript
// supabase/functions/send-invoice-email/index.ts
// Input: invoice_id, recipient_email
// Output: email_sent (boolean)
```

**Email Template:**

```html
Sehr geehrter Kunde, anbei erhalten Sie die Rechnung [INV-2025-00123] über [65,45 €].
Fälligkeitsdatum: 05.11.2025 Zahlungsmethode: Überweisung PDF im Anhang. Mit freundlichen Grüßen,
Ihr MyDispatch Team
```

### **3. Payment Reminder**

```typescript
// supabase/functions/send-payment-reminders/index.ts
// Läuft täglich via Cron
// Findet überfällige Rechnungen und sendet Reminder
```

**Reminder-Stufen:**

- 1. Reminder: 3 Tage nach Fälligkeit (freundlich)
- 2. Reminder: 10 Tage nach Fälligkeit (dringend)
- 3. Reminder: 20 Tage nach Fälligkeit (letzte Mahnung)

### **4. Invoice Analytics**

```typescript
// supabase/functions/invoice-analytics/index.ts
// Input: date_range
// Output: total_revenue, paid_invoices, outstanding_amount, avg_days_to_payment
```

---

## 🎨 Design System

### **Invoice Status Colors**

```css
:root {
  --invoice-draft: 220 13% 91%;
  --invoice-draft-foreground: 220 9% 46%;

  --invoice-sent: 221 83% 53%;
  --invoice-sent-foreground: 0 0% 100%;

  --invoice-paid: 142 71% 45%;
  --invoice-paid-foreground: 0 0% 100%;

  --invoice-overdue: 0 84% 60%;
  --invoice-overdue-foreground: 0 0% 100%;

  --invoice-cancelled: 0 0% 64%;
  --invoice-cancelled-foreground: 0 0% 100%;
}
```

---

## 🧪 Testing

```typescript
// tests/invoices.spec.ts
test("Create invoice from order", async ({ page }) => {
  // Create order first
  const orderId = await createTestOrder();

  await page.goto(`/orders/${orderId}`);
  await page.click("text=Rechnung erstellen");

  // Should auto-fill from order
  await expect(page.locator('[name="customer_id"]')).toHaveValue("...");

  await page.click('button[type="submit"]');

  await expect(page.locator("text=Rechnung erstellt")).toBeVisible();
});

test("Mark invoice as paid", async ({ page }) => {
  const invoiceId = await createTestInvoice({ status: "sent" });

  await page.goto(`/invoices/${invoiceId}`);
  await page.click("text=Als bezahlt markieren");

  await page.fill('[name="payment_date"]', "2025-10-22");
  await page.fill('[name="payment_reference"]', "TXN-123456");
  await page.click('button[type="submit"]');

  await expect(page.locator("text=Bezahlt")).toBeVisible();
});
```

---

## 📊 Buchhaltungs-Integration

**Export-Formate:**

- **DATEV**: CSV-Export für DATEV-Import
- **Lexoffice**: API-Integration (optional)
- **Excel**: Detaillierte Aufstellung

```typescript
// supabase/functions/export-invoices-datev/index.ts
// Generates DATEV-compatible CSV
```

---

## 🔗 Verknüpfte Dokumente

- [ORDERS_SPECIFICATION_V18.5.0.md](./ORDERS_SPECIFICATION_V18.5.0.md)
- [CUSTOMER_SPECIFICATION_V18.5.0.md](./CUSTOMER_SPECIFICATION_V18.5.0.md)
- [FORM_STANDARDS_V18.5.0.md](./FORM_STANDARDS_V18.5.0.md)

---

**Letzte Aktualisierung:** 2025-10-22 22:00 (DE)  
**Version:** 18.5.0  
**Status:** ✅ Production-Ready
