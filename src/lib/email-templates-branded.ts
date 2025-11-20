/* ==================================================================================
   E-MAIL TEMPLATES - MIT KUNDENSPEZIFISCHEM DESIGN
   ==================================================================================
   Alle E-Mail-Templates mit Company-Branding (Logo, Farben)
   ================================================================================== */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface CompanyBranding {
  logoUrl?: string | null;
  primaryColor?: string | null;
  companyName: string;
  isWhiteLabel: boolean; // Business/Enterprise
}

/**
 * Base Email Template mit Company-Branding oder MyDispatch-Branding
 */
function getEmailBaseTemplate(content: string, branding: CompanyBranding): string {
  const logoUrl = branding.logoUrl || "https://cdn.mydispatch.de/logo-white.png";
  const primaryColor = branding.primaryColor || "#323D5E";
  const accentColor = branding.primaryColor
    ? adjustBrightness(branding.primaryColor, -20)
    : "#856d4b";
  const footerBrand = branding.isWhiteLabel ? branding.companyName : "MyDispatch";

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Mail</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
      padding: 30px;
      text-align: center;
    }
    .header img {
      max-width: 180px;
      height: auto;
      max-height: 60px;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.6;
    }
    .content h1 {
      color: ${primaryColor};
      font-size: 24px;
      margin-top: 0;
    }
    .cta-button {
      display: inline-block;
      padding: 14px 28px;
      background-color: ${accentColor};
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .info-box {
      background-color: #f8f9fa;
      border-left: 4px solid ${accentColor};
      padding: 16px;
      margin: 20px 0;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #6c757d;
      font-size: 14px;
    }
    .footer a {
      color: ${accentColor};
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px !important;
      }
      .cta-button {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="${logoUrl}" alt="${branding.companyName} Logo" />
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>
        <strong>${footerBrand}</strong><br>
        ${branding.isWhiteLabel ? "" : "MyDispatch GmbH | Musterstraße 123 | 12345 Musterstadt<br>"}
        <a href="tel:+49123456789">+49 123 456 789</a> |
        <a href="mailto:info@mydispatch.de">info@mydispatch.de</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px;">
        Sie erhalten diese E-Mail, weil Sie bei ${footerBrand} registriert sind.<br>
        <a href="{{unsubscribe_link}}">Benachrichtigungen verwalten</a> |
        <a href="{{privacy_link}}">Datenschutz</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Helper: Adjust color brightness
 */
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// 1. Passwort-Vergessen (Branded)
export function passwordResetTemplateBranded(
  resetLink: string,
  branding: CompanyBranding
): EmailTemplate {
  const content = `
    <h1>Passwort zurücksetzen</h1>
    <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.</p>
    <p>Klicken Sie auf den folgenden Link, um ein neues Passwort festzulegen:</p>
    <a href="${resetLink}" class="cta-button">Passwort zurücksetzen</a>
    <p style="color: #666; font-size: 14px;">Dieser Link ist 24 Stunden gültig.</p>
    <p style="color: #666; font-size: 12px;">Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.</p>
  `;

  return {
    subject: `${branding.isWhiteLabel ? branding.companyName : "MyDispatch"} - Passwort zurücksetzen`,
    html: getEmailBaseTemplate(content, branding),
    text: `
Passwort zurücksetzen

Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.

Klicken Sie auf den folgenden Link:
${resetLink}

Dieser Link ist 24 Stunden gültig.

Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.
    `.trim(),
  };
}

// 2. Registrierungs-Bestätigung (Branded)
export function registrationConfirmTemplateBranded(
  companyName: string,
  userName: string,
  loginUrl: string,
  branding: CompanyBranding
): EmailTemplate {
  const content = `
    <h1>Willkommen, ${userName}! 👋</h1>
    <p>Ihre Registrierung für <strong>${companyName}</strong> war erfolgreich.</p>
    <p>Sie können sich jetzt anmelden und mit der Disposition beginnen:</p>
    <a href="${loginUrl}" class="cta-button">Jetzt anmelden</a>
    <p style="color: #666;">Bei Fragen steht Ihnen unser Support gerne zur Verfügung.</p>
  `;

  return {
    subject: `Willkommen bei ${branding.isWhiteLabel ? branding.companyName : "MyDispatch"}!`,
    html: getEmailBaseTemplate(content, branding),
    text: `
Willkommen bei ${branding.isWhiteLabel ? branding.companyName : "MyDispatch"}, ${userName}!

Ihre Registrierung für ${companyName} war erfolgreich.

Sie können sich jetzt anmelden: ${loginUrl}

Bei Fragen steht Ihnen unser Support gerne zur Verfügung.
    `.trim(),
  };
}

// 3. Buchungsbestätigung (Branded)
export function bookingConfirmationTemplateBranded(
  customerName: string,
  pickupAddress: string,
  dropoffAddress: string,
  pickupTime: string,
  price: string,
  branding: CompanyBranding,
  driverName?: string,
  vehiclePlate?: string
): EmailTemplate {
  const driverInfo = driverName ? `<p><strong>Fahrer:</strong> ${driverName}</p>` : "";
  const vehicleInfo = vehiclePlate ? `<p><strong>Fahrzeug:</strong> ${vehiclePlate}</p>` : "";

  const content = `
    <h1>Buchungsbestätigung</h1>
    <p>Hallo ${customerName},</p>
    <p>Ihre Buchung wurde erfolgreich bestätigt.</p>
    <div class="info-box">
      <p><strong>Abholung:</strong> ${pickupAddress}</p>
      <p><strong>Ziel:</strong> ${dropoffAddress}</p>
      <p><strong>Zeit:</strong> ${pickupTime}</p>
      <p><strong>Preis:</strong> ${price}</p>
      ${driverInfo}
      ${vehicleInfo}
    </div>
    <p>Wir freuen uns darauf, Sie zu fahren!</p>
  `;

  return {
    subject: `Buchungsbestätigung - ${branding.isWhiteLabel ? branding.companyName : "MyDispatch"}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
Buchungsbestätigung

Hallo ${customerName},

Ihre Buchung wurde erfolgreich bestätigt.

Abholung: ${pickupAddress}
Ziel: ${dropoffAddress}
Zeit: ${pickupTime}
Preis: ${price}
${driverName ? `Fahrer: ${driverName}` : ""}
${vehiclePlate ? `Fahrzeug: ${vehiclePlate}` : ""}

Wir freuen uns darauf, Sie zu fahren!
    `.trim(),
  };
}

// 4. Rechnung (Branded)
export function invoiceEmailTemplateBranded(
  customerName: string,
  invoiceNumber: string,
  invoiceDate: string,
  totalAmount: string,
  dueDate: string,
  pdfUrl: string,
  branding: CompanyBranding,
  paymentLink?: string
): EmailTemplate {
  const paymentButton = paymentLink
    ? `
    <a href="${paymentLink}" class="cta-button" style="margin-left: 10px;">💳 Jetzt online bezahlen</a>
  `
    : "";

  const content = `
    <h1>Ihre Rechnung</h1>
    <p>Sehr geehrte/r ${customerName},</p>
    <p>anbei erhalten Sie Ihre Rechnung für die erbrachten Leistungen.</p>
    <div class="info-box">
      <p><strong>Rechnungsnummer:</strong> ${invoiceNumber}</p>
      <p><strong>Rechnungsdatum:</strong> ${invoiceDate}</p>
      <p><strong>Gesamtbetrag:</strong> ${totalAmount}</p>
      <p><strong>Zahlungsziel:</strong> ${dueDate}</p>
    </div>
    <a href="${pdfUrl}" class="cta-button">📄 Rechnung herunterladen (PDF)</a>
    ${paymentButton}
    <p style="margin-top: 30px; font-size: 14px; color: #666;">
      Bitte überweisen Sie den Betrag bis zum ${dueDate} unter Angabe der Rechnungsnummer.
    </p>
  `;

  return {
    subject: `Rechnung ${invoiceNumber} - ${branding.isWhiteLabel ? branding.companyName : "MyDispatch"}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
Ihre Rechnung

Sehr geehrte/r ${customerName},

anbei erhalten Sie Ihre Rechnung für die erbrachten Leistungen.

Rechnungsnummer: ${invoiceNumber}
Rechnungsdatum: ${invoiceDate}
Gesamtbetrag: ${totalAmount}
Zahlungsziel: ${dueDate}

PDF: ${pdfUrl}
${paymentLink ? `Online bezahlen: ${paymentLink}` : ""}
    `.trim(),
  };
}
