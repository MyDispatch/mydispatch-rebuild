/* ==================================================================================
   E-MAIL TEMPLATES - ALLE 24 TEMPLATES VOLLSTÄNDIG
   ==================================================================================
   Erstellt: 2025-01-31
   Zweck: Alle E-Mail-Templates mit Company-Branding
   Autor: NeXify AI MASTER
   ================================================================================== */

import { EmailTemplate, CompanyBranding } from './email-templates-branded';
import { passwordResetTemplateBranded, registrationConfirmTemplateBranded, bookingConfirmationTemplateBranded, invoiceEmailTemplateBranded } from './email-templates-branded';

/**
 * Email Verification Template (AUTH-03)
 */
export function emailVerificationTemplateBranded(
  userName: string,
  verificationLink: string,
  branding: CompanyBranding
): EmailTemplate {
  const content = `
    <h1>E-Mail-Adresse bestätigen</h1>
    <p>Hallo ${userName}! 👋</p>
    <p>Vielen Dank für Ihre Registrierung bei ${branding.isWhiteLabel ? branding.companyName : 'MyDispatch'}.</p>
    <p>Bitte bestätigen Sie Ihre E-Mail-Adresse, um Ihr Konto zu aktivieren:</p>
    <a href="${verificationLink}" class="cta-button">E-Mail-Adresse bestätigen</a>
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Dieser Link ist 24 Stunden gültig.<br>
      Falls Sie sich nicht registriert haben, ignorieren Sie diese E-Mail.
    </p>
  `;

  return {
    subject: `${branding.isWhiteLabel ? branding.companyName : 'MyDispatch'} - E-Mail-Adresse bestätigen`,
    html: getEmailBaseTemplate(content, branding),
    text: `
E-Mail-Adresse bestätigen

Hallo ${userName},

vielen Dank für Ihre Registrierung bei ${branding.isWhiteLabel ? branding.companyName : 'MyDispatch'}.

Bitte bestätigen Sie Ihre E-Mail-Adresse:
${verificationLink}

Dieser Link ist 24 Stunden gültig.
    `.trim(),
  };
}

/**
 * Driver Onboarding Complete Template (DRIVER-02)
 */
export function driverOnboardingCompleteTemplateBranded(
  driverName: string,
  companyName: string,
  dashboardLink: string,
  branding: CompanyBranding
): EmailTemplate {
  const content = `
    <h1>Onboarding abgeschlossen! 🎉</h1>
    <p>Hallo ${driverName},</p>
    <p>Ihr Onboarding bei <strong>${companyName}</strong> ist erfolgreich abgeschlossen.</p>
    <p>Sie können jetzt:</p>
    <ul>
      <li>Aufträge annehmen</li>
      <li>Ihre Schichten einsehen</li>
      <li>Mit der Zentrale kommunizieren</li>
    </ul>
    <a href="${dashboardLink}" class="cta-button">Zum Fahrer-Portal</a>
  `;

  return {
    subject: `Onboarding abgeschlossen - ${companyName}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
Onboarding abgeschlossen!

Hallo ${driverName},

Ihr Onboarding bei ${companyName} ist erfolgreich abgeschlossen.

Zum Portal: ${dashboardLink}
    `.trim(),
  };
}

/**
 * Shift Reminder Template (DRIVER-03)
 */
export function shiftReminderTemplateBranded(
  driverName: string,
  shiftDate: string,
  shiftTime: string,
  companyName: string,
  branding: CompanyBranding
): EmailTemplate {
  const content = `
    <h1>Erinnerung: Ihre Schicht morgen</h1>
    <p>Hallo ${driverName},</p>
    <p>Wir erinnern Sie an Ihre geplante Schicht:</p>
    <div class="info-box">
      <p><strong>Datum:</strong> ${shiftDate}</p>
      <p><strong>Zeit:</strong> ${shiftTime}</p>
      <p><strong>Unternehmen:</strong> ${companyName}</p>
    </div>
    <p>Bitte bestätigen Sie Ihre Teilnahme oder kontaktieren Sie uns bei Fragen.</p>
  `;

  return {
    subject: `Schicht-Erinnerung: ${shiftDate} - ${companyName}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
Erinnerung: Ihre Schicht morgen

Hallo ${driverName},

Ihre Schicht:
Datum: ${shiftDate}
Zeit: ${shiftTime}
Unternehmen: ${companyName}
    `.trim(),
  };
}

/**
 * Customer Welcome Template (CUSTOMER-02)
 */
export function customerWelcomeTemplateBranded(
  customerName: string,
  companyName: string,
  portalLink: string,
  branding: CompanyBranding
): EmailTemplate {
  const content = `
    <h1>Willkommen im Kunden-Portal! 👋</h1>
    <p>Hallo ${customerName},</p>
    <p>Willkommen im Kunden-Portal von <strong>${companyName}</strong>!</p>
    <p>Über das Portal können Sie:</p>
    <ul>
      <li>Neue Fahrten buchen</li>
      <li>Ihre Auftrags-Historie einsehen</li>
      <li>Rechnungen herunterladen</li>
      <li>Ihr Profil verwalten</li>
    </ul>
    <a href="${portalLink}" class="cta-button">Zum Portal</a>
  `;

  return {
    subject: `Willkommen im Kunden-Portal - ${companyName}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
Willkommen im Kunden-Portal!

Hallo ${customerName},

Willkommen im Kunden-Portal von ${companyName}!

Zum Portal: ${portalLink}
    `.trim(),
  };
}

/**
 * Booking Reminder Template (BOOKING-02)
 */
export function bookingReminderTemplateBranded(
  customerName: string,
  pickupTime: string,
  pickupAddress: string,
  driverName: string,
  driverPhone: string,
  vehiclePlate: string,
  branding: CompanyBranding
): EmailTemplate {
  const content = `
    <h1>Erinnerung: Ihre Fahrt morgen 🚗</h1>
    <p>Hallo ${customerName},</p>
    <p>Wir erinnern Sie an Ihre gebuchte Fahrt:</p>
    <div class="info-box">
      <p><strong>📅 Abholung:</strong> ${pickupTime}</p>
      <p><strong>📍 Adresse:</strong> ${pickupAddress}</p>
      <p><strong>👤 Fahrer:</strong> ${driverName}</p>
      <p><strong>📞 Telefon:</strong> <a href="tel:${driverPhone}">${driverPhone}</a></p>
      <p><strong>🚙 Fahrzeug:</strong> ${vehiclePlate}</p>
    </div>
    <p>Wir freuen uns auf Sie! Bei Fragen erreichen Sie uns jederzeit.</p>
  `;

  return {
    subject: `Erinnerung: Ihre Fahrt morgen - ${branding.isWhiteLabel ? branding.companyName : 'MyDispatch'}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
Erinnerung: Ihre Fahrt morgen

Hallo ${customerName},

Ihre gebuchte Fahrt:
Abholung: ${pickupTime}
Adresse: ${pickupAddress}
Fahrer: ${driverName} (${driverPhone})
Fahrzeug: ${vehiclePlate}
    `.trim(),
  };
}

/**
 * Booking Cancellation Template (BOOKING-03)
 */
export function bookingCancellationTemplateBranded(
  customerName: string,
  bookingId: string,
  pickupTime: string,
  cancellationFee: string,
  refundAmount: string,
  branding: CompanyBranding
): EmailTemplate {
  const cancellationFeeBox = cancellationFee !== '0,00 €' ? `
    <div class="warning-box">
      <p><strong>Stornogebühr:</strong> ${cancellationFee}</p>
      <p style="font-size: 14px; margin-top: 10px;">
        Da die Stornierung weniger als 24 Stunden vor der Abholung erfolgte, fällt eine Stornogebühr an.
      </p>
    </div>
  ` : '';

  const content = `
    <h1>Buchung storniert</h1>
    <p>Hallo ${customerName},</p>
    <p>Ihre Buchung wurde erfolgreich storniert.</p>
    <div class="info-box">
      <p><strong>Buchungsnummer:</strong> ${bookingId}</p>
      <p><strong>Ursprüngliche Abholung:</strong> ${pickupTime}</p>
      ${cancellationFeeBox}
      <p style="color: #51cf66;"><strong>Rückerstattung:</strong> ${refundAmount}</p>
    </div>
    <p>Wir hoffen, Sie bald wieder bei uns begrüßen zu dürfen!</p>
  `;

  return {
    subject: `Buchung storniert - ${branding.isWhiteLabel ? branding.companyName : 'MyDispatch'}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
Buchung storniert

Hallo ${customerName},

Ihre Buchung wurde erfolgreich storniert.

Buchungsnummer: ${bookingId}
Ursprüngliche Abholung: ${pickupTime}
${cancellationFee !== '0,00 €' ? `Stornogebühr: ${cancellationFee}\n` : ''}
Rückerstattung: ${refundAmount}
    `.trim(),
  };
}

/**
 * Driver Assigned Template (BOOKING-04)
 */
export function driverAssignedTemplateBranded(
  driverName: string,
  bookingId: string,
  pickupTime: string,
  pickupAddress: string,
  customerName: string,
  customerPhone: string,
  branding: CompanyBranding
): EmailTemplate {
  const content = `
    <h1>Neuer Auftrag zugewiesen 🚗</h1>
    <p>Hallo ${driverName},</p>
    <p>Ihnen wurde ein neuer Auftrag zugewiesen:</p>
    <div class="info-box">
      <p><strong>Buchungsnummer:</strong> ${bookingId}</p>
      <p><strong>Abholung:</strong> ${pickupTime}</p>
      <p><strong>Adresse:</strong> ${pickupAddress}</p>
      <p><strong>Kunde:</strong> ${customerName}</p>
      <p><strong>Telefon:</strong> <a href="tel:${customerPhone}">${customerPhone}</a></p>
    </div>
    <p>Bitte bestätigen Sie den Auftrag oder kontaktieren Sie die Zentrale.</p>
  `;

  return {
    subject: `Neuer Auftrag zugewiesen - ${bookingId}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
Neuer Auftrag zugewiesen

Hallo ${driverName},

Neuer Auftrag:
Buchungsnummer: ${bookingId}
Abholung: ${pickupTime}
Adresse: ${pickupAddress}
Kunde: ${customerName} (${customerPhone})
    `.trim(),
  };
}

/**
 * Partner Accepted Template (PARTNER-02)
 */
export function partnerAcceptedTemplateBranded(
  companyName: string,
  partnerCompanyName: string,
  partnerLink: string,
  branding: CompanyBranding
): EmailTemplate {
  const content = `
    <h1>Partner-Anfrage akzeptiert ✅</h1>
    <p>Hallo ${companyName},</p>
    <p>Ihre Partner-Anfrage an <strong>${partnerCompanyName}</strong> wurde akzeptiert!</p>
    <p>Sie können jetzt:</p>
    <ul>
      <li>Aufträge an ${partnerCompanyName} vergeben</li>
      <li>Partner-Statistiken einsehen</li>
      <li>Provisionsverwaltung nutzen</li>
    </ul>
    <a href="${partnerLink}" class="cta-button">Zum Partner-Bereich</a>
  `;

  return {
    subject: `Partner-Anfrage akzeptiert - ${partnerCompanyName}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
Partner-Anfrage akzeptiert

Hallo ${companyName},

Ihre Partner-Anfrage an ${partnerCompanyName} wurde akzeptiert!

Zum Partner-Bereich: ${partnerLink}
    `.trim(),
  };
}

/**
 * Partner Rejected Template (PARTNER-03)
 */
export function partnerRejectedTemplateBranded(
  companyName: string,
  partnerCompanyName: string,
  reason?: string,
  branding: CompanyBranding
): EmailTemplate {
  const reasonText = reason ? `
    <div class="info-box">
      <p><strong>Grund:</strong> ${reason}</p>
    </div>
  ` : '';

  const content = `
    <h1>Partner-Anfrage abgelehnt</h1>
    <p>Hallo ${companyName},</p>
    <p>Ihre Partner-Anfrage an <strong>${partnerCompanyName}</strong> wurde leider abgelehnt.</p>
    ${reasonText}
    <p>Bei Fragen kontaktieren Sie bitte unseren Support.</p>
  `;

  return {
    subject: `Partner-Anfrage abgelehnt - ${partnerCompanyName}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
Partner-Anfrage abgelehnt

Hallo ${companyName},

Ihre Partner-Anfrage an ${partnerCompanyName} wurde leider abgelehnt.
${reason ? `\nGrund: ${reason}` : ''}
    `.trim(),
  };
}

/**
 * Document Expired Template (DOCUMENT-02)
 */
export function documentExpiredTemplateBranded(
  recipientName: string,
  documentName: string,
  entityType: string,
  expiryDate: string,
  documentUrl: string,
  branding: CompanyBranding
): EmailTemplate {
  const content = `
    <h1>⚠️ Dokument abgelaufen</h1>
    <p>Hallo ${recipientName},</p>
    <p>Das Dokument <strong>${documentName}</strong> für ${entityType} ist abgelaufen!</p>
    <div class="error-box">
      <p><strong>Dokument:</strong> ${documentName}</p>
      <p><strong>Abgelaufen seit:</strong> ${expiryDate}</p>
      <p><strong>Typ:</strong> ${entityType}</p>
    </div>
    <p style="color: #dc3545;"><strong>Sofortige Aktion erforderlich!</strong></p>
    <a href="${documentUrl}" class="cta-button">Zum Dokumente-Bereich</a>
  `;

  return {
    subject: `⚠️ Dokument abgelaufen: ${documentName}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
⚠️ Dokument abgelaufen

Hallo ${recipientName},

Das Dokument ${documentName} für ${entityType} ist abgelaufen!

Abgelaufen seit: ${expiryDate}

Sofortige Aktion erforderlich!
    `.trim(),
  };
}

/**
 * Payment Confirmation Template (INVOICE-02)
 */
export function paymentConfirmationTemplateBranded(
  customerName: string,
  invoiceNumber: string,
  amount: string,
  paymentDate: string,
  branding: CompanyBranding
): EmailTemplate {
  const content = `
    <h1>Zahlung erhalten ✅</h1>
    <p>Sehr geehrte/r ${customerName},</p>
    <p>vielen Dank für Ihre Zahlung!</p>
    <div class="info-box" style="border-left-color: #51cf66;">
      <p><strong>Rechnungsnummer:</strong> ${invoiceNumber}</p>
      <p><strong>Betrag:</strong> ${amount}</p>
      <p><strong>Zahlungsdatum:</strong> ${paymentDate}</p>
    </div>
    <p>Ihre Zahlung wurde erfolgreich verbucht.</p>
  `;

  return {
    subject: `Zahlung erhalten - Rechnung ${invoiceNumber}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
Zahlung erhalten

Sehr geehrte/r ${customerName},

vielen Dank für Ihre Zahlung!

Rechnungsnummer: ${invoiceNumber}
Betrag: ${amount}
Zahlungsdatum: ${paymentDate}
    `.trim(),
  };
}

/**
 * Payment Reminder 1 Template (INVOICE-03)
 */
export function paymentReminder1TemplateBranded(
  customerName: string,
  invoiceNumber: string,
  totalAmount: string,
  daysOverdue: number,
  paymentLink: string,
  branding: CompanyBranding
): EmailTemplate {
  const content = `
    <h1>Freundliche Zahlungserinnerung</h1>
    <p>Sehr geehrte/r ${customerName},</p>
    <p>uns ist aufgefallen, dass die folgende Rechnung noch nicht beglichen wurde:</p>
    <div class="warning-box">
      <p><strong>Rechnungsnummer:</strong> ${invoiceNumber}</p>
      <p><strong>Betrag:</strong> ${totalAmount}</p>
      <p><strong>Überfällig seit:</strong> ${daysOverdue} Tagen</p>
    </div>
    <p>Falls die Zahlung bereits erfolgt ist, betrachten Sie diese E-Mail bitte als gegenstandslos.</p>
    <a href="${paymentLink}" class="cta-button">Jetzt bezahlen</a>
  `;

  return {
    subject: `Zahlungserinnerung: Rechnung ${invoiceNumber}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
Freundliche Zahlungserinnerung

Sehr geehrte/r ${customerName},

uns ist aufgefallen, dass die folgende Rechnung noch nicht beglichen wurde:

Rechnungsnummer: ${invoiceNumber}
Betrag: ${totalAmount}
Überfällig seit: ${daysOverdue} Tagen

Online bezahlen: ${paymentLink}
    `.trim(),
  };
}

/**
 * Payment Reminder 2 Template (INVOICE-04)
 */
export function paymentReminder2TemplateBranded(
  customerName: string,
  invoiceNumber: string,
  totalAmount: string,
  daysOverdue: number,
  paymentLink: string,
  branding: CompanyBranding
): EmailTemplate {
  const content = `
    <h1>Zahlungserinnerung (2. Mahnung)</h1>
    <p>Sehr geehrte/r ${customerName},</p>
    <p>wir erinnern Sie erneut an die noch offene Rechnung:</p>
    <div class="warning-box">
      <p><strong>Rechnungsnummer:</strong> ${invoiceNumber}</p>
      <p><strong>Betrag:</strong> ${totalAmount}</p>
      <p><strong>Überfällig seit:</strong> ${daysOverdue} Tagen</p>
    </div>
    <p>Bitte begleichen Sie den Betrag umgehend.</p>
    <a href="${paymentLink}" class="cta-button">Jetzt bezahlen</a>
  `;

  return {
    subject: `2. Mahnung: Rechnung ${invoiceNumber}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
2. Mahnung

Sehr geehrte/r ${customerName},

wir erinnern Sie erneut an die noch offene Rechnung:

Rechnungsnummer: ${invoiceNumber}
Betrag: ${totalAmount}
Überfällig seit: ${daysOverdue} Tagen

Online bezahlen: ${paymentLink}
    `.trim(),
  };
}

/**
 * Payment Reminder 3 Template (INVOICE-05)
 */
export function paymentReminder3TemplateBranded(
  customerName: string,
  invoiceNumber: string,
  totalAmount: string,
  daysOverdue: number,
  paymentLink: string,
  branding: CompanyBranding
): EmailTemplate {
  const content = `
    <h1>⚠️ Letzte Mahnung vor Inkasso</h1>
    <p>Sehr geehrte/r ${customerName},</p>
    <p>dies ist unsere letzte Mahnung vor der Übergabe an ein Inkassounternehmen.</p>
    <div class="error-box">
      <p><strong>Rechnungsnummer:</strong> ${invoiceNumber}</p>
      <p><strong>Betrag:</strong> ${totalAmount}</p>
      <p><strong>Überfällig seit:</strong> ${daysOverdue} Tagen</p>
    </div>
    <p style="color: #dc3545;"><strong>Bitte begleichen Sie den Betrag innerhalb von 7 Tagen.</strong></p>
    <a href="${paymentLink}" class="cta-button">Jetzt bezahlen</a>
  `;

  return {
    subject: `⚠️ Letzte Mahnung: Rechnung ${invoiceNumber}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
⚠️ Letzte Mahnung vor Inkasso

Sehr geehrte/r ${customerName},

dies ist unsere letzte Mahnung vor der Übergabe an ein Inkassounternehmen.

Rechnungsnummer: ${invoiceNumber}
Betrag: ${totalAmount}
Überfällig seit: ${daysOverdue} Tagen

Bitte begleichen Sie den Betrag innerhalb von 7 Tagen.

Online bezahlen: ${paymentLink}
    `.trim(),
  };
}

/**
 * Critical Error Template (ADMIN-01)
 */
export function criticalErrorTemplateBranded(
  errorType: string,
  errorMessage: string,
  affectedUsers: number,
  timestamp: string,
  logLink: string,
  branding: CompanyBranding
): EmailTemplate {
  const content = `
    <h1>🚨 Kritischer Systemfehler</h1>
    <div class="error-box">
      <p><strong>Fehlertyp:</strong> ${errorType}</p>
      <p><strong>Zeit:</strong> ${timestamp}</p>
      <p><strong>Betroffene User:</strong> ${affectedUsers}</p>
    </div>
    <p><strong>Fehlermeldung:</strong></p>
    <pre style="background: #f4f4f4; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${errorMessage}</pre>
    <a href="${logLink}" class="cta-button" style="background-color: #dc3545;">Fehler-Logs anzeigen</a>
    <p style="margin-top: 30px; color: #dc3545;"><strong>Sofortige Aktion erforderlich!</strong></p>
  `;

  return {
    subject: `🚨 CRITICAL: ${errorType}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
🚨 CRITICAL: ${errorType}

Fehlertyp: ${errorType}
Zeit: ${timestamp}
Betroffene User: ${affectedUsers}

Fehlermeldung:
${errorMessage}

Logs: ${logLink}
    `.trim(),
  };
}

/**
 * Weekly Report Template (ADMIN-02)
 */
export function weeklyReportTemplateBranded(
  reportData: {
    totalBookings: number;
    totalRevenue: string;
    activeDrivers: number;
    activeCustomers: number;
    weekStart: string;
    weekEnd: string;
  },
  branding: CompanyBranding
): EmailTemplate {
  const content = `
    <h1>Wochenbericht 📊</h1>
    <p>Hier ist Ihr Wochenbericht für die Woche ${reportData.weekStart} - ${reportData.weekEnd}:</p>
    <div class="info-box">
      <p><strong>Buchungen:</strong> ${reportData.totalBookings}</p>
      <p><strong>Umsatz:</strong> ${reportData.totalRevenue}</p>
      <p><strong>Aktive Fahrer:</strong> ${reportData.activeDrivers}</p>
      <p><strong>Aktive Kunden:</strong> ${reportData.activeCustomers}</p>
    </div>
    <p>Detaillierte Statistiken finden Sie in Ihrem Dashboard.</p>
  `;

  return {
    subject: `Wochenbericht - ${reportData.weekStart} bis ${reportData.weekEnd}`,
    html: getEmailBaseTemplate(content, branding),
    text: `
Wochenbericht

Woche: ${reportData.weekStart} - ${reportData.weekEnd}

Buchungen: ${reportData.totalBookings}
Umsatz: ${reportData.totalRevenue}
Aktive Fahrer: ${reportData.activeDrivers}
Aktive Kunden: ${reportData.activeCustomers}
    `.trim(),
  };
}

// Helper: Get Email Base Template (from email-templates-branded.ts)
function getEmailBaseTemplate(content: string, branding: CompanyBranding): string {
  // This should be imported from email-templates-branded.ts
  // For now, we'll use a simplified version
  const logoUrl = branding.logoUrl || 'https://cdn.mydispatch.de/logo-white.png';
  const primaryColor = branding.primaryColor || '#323D5E';
  const accentColor = branding.primaryColor ? adjustBrightness(branding.primaryColor, -20) : '#856d4b';
  const footerBrand = branding.isWhiteLabel ? branding.companyName : 'MyDispatch';

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Mail</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%); padding: 30px; text-align: center; }
    .header img { max-width: 180px; height: auto; max-height: 60px; }
    .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
    .content h1 { color: ${primaryColor}; font-size: 24px; margin-top: 0; }
    .cta-button { display: inline-block; padding: 14px 28px; background-color: ${accentColor}; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .info-box { background-color: #f8f9fa; border-left: 4px solid ${accentColor}; padding: 16px; margin: 20px 0; }
    .warning-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 16px; margin: 20px 0; }
    .error-box { background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 16px; margin: 20px 0; }
    .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #6c757d; font-size: 14px; }
    .footer a { color: ${accentColor}; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .content { padding: 30px 20px !important; }
      .cta-button { display: block !important; width: 100% !important; text-align: center !important; }
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
      <p><strong>${footerBrand}</strong><br>
      ${branding.isWhiteLabel ? '' : 'MyDispatch GmbH | Musterstraße 123 | 12345 Musterstadt<br>'}
      <a href="tel:+49123456789">+49 123 456 789</a> | <a href="mailto:info@mydispatch.de">info@mydispatch.de</a></p>
      <p style="margin-top: 20px; font-size: 12px;">
        Sie erhalten diese E-Mail, weil Sie bei ${footerBrand} registriert sind.<br>
        <a href="{{unsubscribe_link}}">Benachrichtigungen verwalten</a> | <a href="{{privacy_link}}">Datenschutz</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

