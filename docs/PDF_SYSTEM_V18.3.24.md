# MyDispatch PDF-System V18.3.24

**Status:** ✅ AKTIV - DIN A4, DIN 5008, DSGVO-konform  
**Datum:** 21.10.2025  
**Version:** V18.3.24

---

## 🎯 ZIELSETZUNG

Professionelles PDF-System für alle Geschäftsdokumente:

- ✅ DIN A4 Format (210mm x 297mm)
- ✅ DIN 5008 (Deutsche Geschäftsbriefe)
- ✅ DSGVO-konform (Datenschutzhinweise)
- ✅ PBefG-konform (Taxi-Branche)
- ✅ MyDispatch Branding

---

## 📦 VERFÜGBARE TEMPLATES

### 1. Rechnung (Invoice)

**Datei:** `src/lib/pdf/pdf-generator-invoice.ts`

```tsx
import { generateInvoiceHTML, exportInvoicePDF } from "@/lib/pdf/pdf-generator-invoice";

const invoiceData = {
  invoiceNumber: "RE-2025-0001",
  invoiceDate: new Date(),
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),

  customerName: "Max Mustermann GmbH",
  customerAddress: "Musterstraße 123",
  customerPostal: "80331",
  customerCity: "München",
  customerEmail: "max@example.com",

  bookingNumber: "BK-2025-0042",
  bookingDate: new Date(),

  items: [
    {
      position: 1,
      description: "Taxifahrt München Flughafen",
      amount: 65.0,
      details: "Route: Marienplatz → Terminal 2",
    },
  ],

  subtotal: 65.0,
  taxRate: 19,
  taxAmount: 12.35,
  total: 77.35,

  paymentTermsDays: 14,
  paymentMethod: "Rechnung",
};

// PDF exportieren
await exportInvoicePDF(invoiceData, "Rechnung_RE-2025-0001.pdf");
```

**Features:**

- ✅ DIN 5008 Adressblock
- ✅ Line Items mit Details
- ✅ MwSt.-Berechnung (19%)
- ✅ Zahlungsbedingungen
- ✅ DSGVO-Hinweis
- ✅ MyDispatch Branding

### 2. Auftragsbestätigung (Booking Confirmation)

**TODO** - Folgt dem gleichen Pattern wie Rechnung

### 3. Fahrschein (Ride Receipt)

**TODO** - PBefG-konform mit Fahrtstrecke

---

## 🎨 DESIGN-STANDARDS

### Farben (MyDispatch CI)

```css
Primary:    #EADEBD  /* hsl(40 31% 88%) - Beige/Gold */
Foreground: #323D5E  /* hsl(225 31% 28%) - Dunkelblau */
Accent:     #856d4b  /* hsl(45 31% 54%) - Gold-Braun */
```

### Typografie

```css
Font Family: Arial, sans-serif
Body:        10pt
Headlines:   24pt (H2), 14pt (H3)
Small Text:  8pt (Footer, Legal)
```

### Spacing (DIN 5008)

```
Top Margin:     25mm
Side Margins:   25mm
Bottom Margin:  25mm

Address Block:  50mm von oben
Sender Line:    Unter 27mm
```

---

## 📏 DIN 5008 STANDARDS

### Adressfeld

```
┌─────────────────────────────┐
│ MyDispatch - RideHub...      │ ← Absenderzeile (8pt, Grau)
├─────────────────────────────┤
│                               │
│ Firma GmbH                    │ ← Empfänger (11pt, Fett)
│ Straße 123                    │
│ 12345 Stadt                   │
│                               │
└─────────────────────────────┘
```

### Datumsformat

```
✅ RICHTIG:  15.01.2025  (DD.MM.YYYY)
❌ FALSCH:   01/15/2025  (US-Format)
```

### Währung

```
✅ RICHTIG:  1.234,56 €  (DIN 5008)
❌ FALSCH:   €1,234.56   (US-Format)
```

---

## 🔒 DSGVO-KONFORMITÄT

### Datenschutzhinweis (Pflicht!)

```html
<div class="dsgvo-info">
  <strong>Datenschutzhinweis:</strong>
  Diese Rechnung enthält personenbezogene Daten, die gemäß Art. 6 Abs. 1 lit. b DSGVO zur
  Vertragserfüllung verarbeitet werden. Bei Fragen: datenschutz@my-dispatch.de
</div>
```

**Rechtslage:**

- Art. 6 Abs. 1 lit. b DSGVO - Vertragserfüllung
- Aufbewahrungspflicht: 10 Jahre (§ 147 AO)
- Löschung: Nach Ablauf der Aufbewahrungspflicht

### Keine Kopien an Dritte ohne Einwilligung!

```tsx
// ❌ FALSCH
await sendEmail(invoice, [customer.email, "accounting@company.com"]);

// ✅ RICHTIG
await sendEmail(invoice, [customer.email]); // Nur Kunde!
```

---

## 🚗 PBefG-KONFORMITÄT (Taxi-Branche)

### Pflichtangaben auf Fahrschein

Gemäß § 51 PBefG müssen enthalten sein:

1. **Unternehmensname** (RideHub Solutions)
2. **Fahrtstrecke** (Start → Ziel)
3. **Datum & Uhrzeit**
4. **Fahrpreis** (mit MwSt.)
5. **Fahrzeug-Kennzeichen** (optional, empfohlen)
6. **Fahrer-Name** (optional, empfohlen)

```tsx
const rideReceipt = {
  // ... standard fields
  route: "Marienplatz → Flughafen München Terminal 2",
  departureTime: new Date("2025-01-21T14:00:00"),
  arrivalTime: new Date("2025-01-21T14:35:00"),
  vehiclePlate: "M-TX 1234",
  driverName: "Max Mustermann",
};
```

---

## 💻 VERWENDUNG

### Installation

```bash
npm install html2pdf.js
```

### Basic Usage

```tsx
import { exportInvoicePDF } from "@/lib/pdf/pdf-generator-invoice";

// In Component
const handleDownloadPDF = async () => {
  await exportInvoicePDF(invoiceData);
};

<Button onClick={handleDownloadPDF}>
  <Download className="h-4 w-4 mr-2" />
  PDF herunterladen
</Button>;
```

### Email-Versand

```tsx
// Generate HTML first
const html = generateInvoiceHTML(data);

// Send via Resend
await resend.emails.send({
  from: "noreply@my-dispatch.de",
  to: customer.email,
  subject: `Rechnung ${data.invoiceNumber}`,
  html: html,
  attachments: [
    {
      filename: `Rechnung_${data.invoiceNumber}.pdf`,
      content: await generatePDFBlob(html),
    },
  ],
});
```

---

## 🔧 CUSTOMIZATION

### Custom Header

```tsx
// Override company data per invoice
const customData = {
  ...invoiceData,
  customHeader: {
    logo: "/custom-logo.png",
    companyName: "Taxi München GmbH",
    // ...
  },
};
```

### Custom Footer

```tsx
// Add custom footer text
const customData = {
  ...invoiceData,
  footerNote: "Vielen Dank für Ihr Vertrauen!",
};
```

---

## 📊 PERFORMANCE

### Bundle Size

```
html2pdf.js:     ~150KB (gzipped)
Templates:       ~5KB
Total Impact:    +155KB
```

**Optimization:**

- Lazy-load html2pdf.js nur bei PDF-Export
- Templates als separate Files
- Cache HTML-Templates

### Generation Time

```
Simple Invoice:     ~1s
Complex (10 items): ~2s
With Images:        ~3s
```

---

## ✅ CHECKLISTE VOR VERSAND

### Rechtlich

- [ ] Alle Pflichtangaben enthalten (§ 14 UStG)
- [ ] DSGVO-Hinweis vorhanden
- [ ] Korrekte USt-ID & Steuernummer
- [ ] PBefG-konform (bei Taxifahrten)

### Inhaltlich

- [ ] Rechnungsnummer eindeutig
- [ ] Datum korrekt
- [ ] Kunde korrekt (Name, Adresse)
- [ ] Beträge korrekt (MwSt., Gesamt)
- [ ] Zahlungsziel gesetzt

### Design

- [ ] DIN A4 Format
- [ ] MyDispatch Branding
- [ ] Lesbare Schriftgröße (≥10pt)
- [ ] Kein Umbruch mitten in Tabelle

---

## 🚨 TROUBLESHOOTING

### PDF wird nicht generiert

```
Error: html2pdf is not defined
```

**Lösung:** html2pdf.js installieren:

```bash
npm install html2pdf.js
```

### Falsches Datumsformat

```tsx
// ❌ FALSCH
new Date().toLocaleDateString("en-US");

// ✅ RICHTIG
formatDate(new Date()); // aus format-utils.ts
```

### MwSt. falsch berechnet

```tsx
// ❌ FALSCH
const tax = subtotal * 0.19;

// ✅ RICHTIG
const tax = Math.round(((subtotal * taxRate) / 100) * 100) / 100;
```

---

## 📞 SUPPORT

Bei Fragen:

- Dokumentation: `docs/PDF_SYSTEM_V18.3.24.md`
- Code: `src/lib/pdf/`
- DIN 5008: https://www.din-5008-richtlinien.de/

---

## 📝 TODO

- [ ] Auftragsbestätigung-Template
- [ ] Fahrschein-Template (PBefG)
- [ ] Lieferschein-Template
- [ ] Mahnung-Template
- [ ] Angebot-Template

---

**ALLE PDFs MÜSSEN DIN A4, DIN 5008 UND DSGVO-KONFORM SEIN!**
