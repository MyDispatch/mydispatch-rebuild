/* ==================================================================================
   PDF-GENERATOR - RECHNUNGEN (DIN A4, DIN 5008, DSGVO)
   ==================================================================================
   ✅ DIN A4 Format (210mm x 297mm)
   ✅ DIN 5008 Deutsche Geschäftsbriefe
   ✅ DSGVO-konform (Datenschutzhinweise)
   ✅ PBefG-konform (Taxi-Branche)
   ================================================================================== */

import { formatCurrency, formatDate } from "@/lib/format-utils";

// ==================================================================================
// COMPANY DATA (MyDispatch)
// ==================================================================================

export const COMPANY_DATA = {
  name: "MyDispatch",
  owner: "RideHub Solutions",
  ownerName: "Ibrahim Simsek",
  address: "Ensbachmühle 4",
  postal: "94571 Schaufling",
  country: "Deutschland",
  phone: "+49 170 8004423",
  email: "info@my-dispatch.de",
  web: "www.my-dispatch.de",

  // Rechtsangaben
  // ⚠️ PRODUCTION SETUP REQUIRED:
  // Diese Placeholder-Werte müssen in der Produktionsumgebung durch echte Firmendaten
  // aus der Datenbank oder Environment-Variablen ersetzt werden.
  ustId: "DE123456789", // ← Echte USt-IdNr. aus company.tax_id
  steuernummer: "123/456/78901", // ← Echte Steuernummer aus company.tax_number

  // Banking
  // ⚠️ PRODUCTION SETUP REQUIRED:
  // Diese Banking-Informationen müssen aus den Company-Settings geladen werden.
  bank: "Sparkasse", // ← Aus company.bank_name
  iban: "DE89 3704 0044 0532 0130 00", // ← Aus company.iban
  bic: "COBADEFFXXX", // ← Aus company.bic

  // DSGVO
  dsgvoContact: "datenschutz@my-dispatch.de",

  // Design
  primaryColor: "#EADEBD", // hsl(40 31% 88%)
  foregroundColor: "#323D5E", // hsl(225 31% 28%)
  highlightColor: "#856d4b", // hsl(45 31% 54%) - Ersetzt accentColor
};

// ==================================================================================
// TYPES
// ==================================================================================

export interface InvoiceData {
  // Invoice Meta
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;

  // Customer
  customerName: string;
  customerAddress: string;
  customerPostal: string;
  customerCity: string;
  customerEmail?: string;

  // Booking Reference
  bookingNumber?: string;
  bookingDate?: Date;

  // Line Items
  items: InvoiceItem[];

  // Amounts
  subtotal: number;
  taxRate: number; // 19% Standard
  taxAmount: number;
  total: number;

  // Payments
  paidAmount?: number;
  remainingAmount?: number;

  // Terms
  paymentTermsDays?: number; // Default: 14
  paymentMethod?: "Rechnung" | "Bar" | "Karte" | "Überweisung";

  // Notes
  notes?: string;

  // DSGVO
  includeDsgvoInfo?: boolean;
}

export interface InvoiceItem {
  position: number;
  description: string;
  quantity?: number;
  unitPrice?: number;
  amount: number;
  details?: string; // Optional details (z.B. "Route: München → Flughafen")
}

// ==================================================================================
// PDF GENERATION (HTML Template)
// ==================================================================================

/**
 * Generiert HTML für Rechnung (DIN 5008 konform)
 * Kann mit jsPDF oder html2pdf.js zu PDF konvertiert werden
 */
export function generateInvoiceHTML(data: InvoiceData): string {
  const {
    invoiceNumber,
    invoiceDate,
    dueDate,
    customerName,
    customerAddress,
    customerPostal,
    customerCity,
    customerEmail,
    bookingNumber,
    bookingDate,
    items,
    subtotal,
    taxRate,
    taxAmount,
    total,
    paidAmount,
    remainingAmount,
    paymentTermsDays = 14,
    paymentMethod,
    notes,
    includeDsgvoInfo = true,
  } = data;

  // Calculate due date if not provided
  const calculatedDueDate =
    dueDate || new Date(invoiceDate.getTime() + paymentTermsDays * 24 * 60 * 60 * 1000);

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rechnung ${invoiceNumber}</title>
  <style>
    /* DIN A4: 210mm x 297mm */
    @page {
      size: A4;
      margin: 25mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Arial', sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: ${COMPANY_DATA.foregroundColor};
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 25mm;
      margin: 0 auto;
      background: white;
    }
    
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 10mm;
      border-bottom: 2px solid ${COMPANY_DATA.primaryColor};
      margin-bottom: 10mm;
    }
    
    .header-left h1 {
      font-size: 32pt;
      font-weight: bold;
      color: ${COMPANY_DATA.foregroundColor};
      margin-bottom: 5px;
    }
    
    .header-left p {
      font-size: 10pt;
      color: #6B7280;
    }
    
    .header-right {
      text-align: right;
    }
    
    .header-right h2 {
      font-size: 24pt;
      font-weight: bold;
      color: ${COMPANY_DATA.foregroundColor};
      margin-bottom: 10px;
    }
    
    .header-right p {
      font-size: 10pt;
      color: #6B7280;
      margin: 2px 0;
    }
    
    /* Sender & Recipient (DIN 5008) */
    .address-block {
      margin-bottom: 20mm;
    }
    
    .sender-line {
      font-size: 8pt;
      color: #6B7280;
      border-bottom: 1px solid #E5E7EB;
      padding-bottom: 2mm;
      margin-bottom: 5mm;
    }
    
    .recipient {
      font-size: 11pt;
      line-height: 1.5;
    }
    
    .recipient strong {
      font-weight: bold;
      font-size: 12pt;
    }
    
    /* Invoice Title */
    .invoice-title {
      font-size: 14pt;
      font-weight: bold;
      margin-bottom: 15mm;
      color: ${COMPANY_DATA.foregroundColor};
    }
    
    /* Table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10mm;
    }
    
    thead {
      background: ${COMPANY_DATA.primaryColor};
    }
    
    thead th {
      padding: 8px 10px;
      text-align: left;
      font-weight: bold;
      font-size: 10pt;
      color: ${COMPANY_DATA.foregroundColor};
    }
    
    tbody tr {
      border-bottom: 1px solid #E5E7EB;
    }
    
    tbody td {
      padding: 8px 10px;
      font-size: 10pt;
    }
    
    tbody td.amount {
      text-align: right;
      font-weight: 600;
    }
    
    tbody td.details {
      font-size: 9pt;
      color: #6B7280;
      padding-top: 2px;
    }
    
    /* Totals */
    .totals {
      margin-top: 10mm;
      margin-left: auto;
      width: 60mm;
    }
    
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 3mm 0;
      font-size: 10pt;
    }
    
    .totals-row.subtotal {
      border-top: 1px solid #E5E7EB;
    }
    
    .totals-row.total {
      border-top: 2px solid ${COMPANY_DATA.foregroundColor};
      font-weight: bold;
      font-size: 12pt;
      margin-top: 2mm;
    }
    
    .totals-row.paid {
      color: #10B981;
    }
    
    .totals-row.remaining {
      color: ${COMPANY_DATA.highlightColor};
      font-weight: bold;
    }
    
    /* Payment Terms */
    .payment-terms {
      margin-top: 15mm;
      padding: 5mm;
      background: #F9FAFB;
      border-left: 3px solid ${COMPANY_DATA.highlightColor};
    }
    
    .payment-terms h3 {
      font-size: 11pt;
      font-weight: bold;
      margin-bottom: 3mm;
    }
    
    .payment-terms p {
      font-size: 10pt;
      line-height: 1.5;
      margin: 2mm 0;
    }
    
    /* Footer */
    .footer {
      margin-top: 20mm;
      padding-top: 5mm;
      border-top: 1px solid #E5E7EB;
      font-size: 8pt;
      color: #6B7280;
      text-align: center;
      line-height: 1.5;
    }
    
    .footer .company-info {
      margin-bottom: 3mm;
    }
    
    .footer .legal-info {
      margin-top: 3mm;
      font-size: 7pt;
    }
    
    /* DSGVO Info */
    .dsgvo-info {
      margin-top: 5mm;
      padding: 3mm;
      background: #FEF3C7;
      border-left: 3px solid #F59E0B;
      font-size: 8pt;
      line-height: 1.4;
    }
    
    /* Print Styles */
    @media print {
      .page {
        margin: 0;
        padding: 0;
      }
      
      .page-break {
        page-break-after: always;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <h1>${COMPANY_DATA.name}</h1>
        <p>Professionelle Dispositionssoftware</p>
      </div>
      <div class="header-right">
        <h2>RECHNUNG</h2>
        <p><strong>Rechnungsnummer:</strong> ${invoiceNumber}</p>
        <p><strong>Datum:</strong> ${formatDate(invoiceDate.toISOString())}</p>
        ${bookingNumber ? `<p><strong>Auftrag:</strong> ${bookingNumber}</p>` : ""}
      </div>
    </div>
    
    <!-- Address Block (DIN 5008) -->
    <div class="address-block">
      <div class="sender-line">
        ${COMPANY_DATA.name} - ${COMPANY_DATA.owner} - ${COMPANY_DATA.address} - ${COMPANY_DATA.postal}
      </div>
      <div class="recipient">
        <strong>${customerName}</strong><br>
        ${customerAddress}<br>
        ${customerPostal} ${customerCity}
        ${customerEmail ? `<br>${customerEmail}` : ""}
      </div>
    </div>
    
    <!-- Invoice Title -->
    <div class="invoice-title">
      ${
        bookingNumber
          ? `Rechnung für: Fahrtauftrag ${bookingNumber}${bookingDate ? ` vom ${formatDate(bookingDate.toISOString())}` : ""}`
          : "Rechnung für erbrachte Leistungen"
      }
    </div>
    
    <!-- Line Items Table -->
    <table>
      <thead>
        <tr>
          <th style="width: 10%;">Pos.</th>
          <th style="width: 60%;">Beschreibung</th>
          <th style="width: 30%; text-align: right;">Betrag</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item) => `
          <tr>
            <td>${item.position}</td>
            <td>
              ${item.description}
              ${item.details ? `<br><span class="details">${item.details}</span>` : ""}
            </td>
            <td class="amount">${formatCurrency(item.amount)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    
    <!-- Totals -->
    <div class="totals">
      <div class="totals-row subtotal">
        <span>Zwischensumme:</span>
        <span>${formatCurrency(subtotal)}</span>
      </div>
      <div class="totals-row">
        <span>zzgl. ${taxRate}% MwSt:</span>
        <span>${formatCurrency(taxAmount)}</span>
      </div>
      <div class="totals-row total">
        <span>Gesamtbetrag:</span>
        <span>${formatCurrency(total)}</span>
      </div>
      ${
        paidAmount
          ? `
        <div class="totals-row paid">
          <span>Bereits bezahlt:</span>
          <span>${formatCurrency(paidAmount)}</span>
        </div>
      `
          : ""
      }
      ${
        remainingAmount
          ? `
        <div class="totals-row remaining">
          <span>Noch zu zahlen:</span>
          <span>${formatCurrency(remainingAmount)}</span>
        </div>
      `
          : ""
      }
    </div>
    
    <!-- Payment Terms -->
    <div class="payment-terms">
      <h3>Zahlungsbedingungen</h3>
      <p>
        <strong>Zahlbar innerhalb von ${paymentTermsDays} Tagen ohne Abzug.</strong><br>
        Zahlungsziel: ${formatDate(calculatedDueDate.toISOString())}
        ${paymentMethod ? `<br>Zahlungsart: ${paymentMethod}` : ""}
      </p>
      ${notes ? `<p style="margin-top: 3mm;">${notes}</p>` : ""}
    </div>
    
    <!-- DSGVO Info -->
    ${
      includeDsgvoInfo
        ? `
      <div class="dsgvo-info">
        <strong>Datenschutzhinweis:</strong> 
        Diese Rechnung enthält personenbezogene Daten, die gemäß Art. 6 Abs. 1 lit. b DSGVO 
        zur Vertragserfüllung verarbeitet werden. Bei Fragen: ${COMPANY_DATA.dsgvoContact}
      </div>
    `
        : ""
    }
    
    <!-- Footer -->
    <div class="footer">
      <div class="company-info">
        <strong>${COMPANY_DATA.name}</strong> - ${COMPANY_DATA.owner} - ${COMPANY_DATA.ownerName}<br>
        ${COMPANY_DATA.address} - ${COMPANY_DATA.postal} - ${COMPANY_DATA.country}<br>
        Telefon: ${COMPANY_DATA.phone} - E-Mail: ${COMPANY_DATA.email} - Web: ${COMPANY_DATA.web}
      </div>
      <div class="legal-info">
        USt-ID: ${COMPANY_DATA.ustId} - Steuernr.: ${COMPANY_DATA.steuernummer}<br>
        ${COMPANY_DATA.bank}: IBAN ${COMPANY_DATA.iban} - BIC: ${COMPANY_DATA.bic}
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// ==================================================================================
// EXPORT FUNCTION
// ==================================================================================

/**
 * Exportiert Rechnung als PDF
 * Nutzt html2pdf.js (muss separat installiert werden)
 */
export async function exportInvoicePDF(data: InvoiceData, filename?: string): Promise<void> {
  const html = generateInvoiceHTML(data);

  // Create temporary container
  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.position = "absolute";
  container.style.left = "-9999px";
  document.body.appendChild(container);

  try {
    // Dynamic import of html2pdf.js (optional dependency)
    // @ts-ignore - html2pdf.js may not be installed
    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 0, // Margins already in HTML
      filename: filename || `Rechnung_${data.invoiceNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(opt).from(container).save();
  } finally {
    // Cleanup
    document.body.removeChild(container);
  }
}
