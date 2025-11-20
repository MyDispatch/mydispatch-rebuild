/* ==================================================================================
   E-MAIL TEMPLATES V2 - ERWEITERT MIT NEUEM SCHEMA
   ==================================================================================
   Neues Schema: Anrede → Einleitung → Datum → Uhrzeit → Abholort → Zielort → Fahrzeugklasse
   Für alle Workflows: Buchung, Angebot, Rechnung, Zahlungserinnerung, etc.
   ================================================================================== */

export interface EmailTemplateData {
  salutation: string; // "Sehr geehrter Herr Schmidt" oder "Sehr geehrte Frau Müller"
  introduction: string; // "vielen Dank für Ihre Buchung bei [Firmenname]"
  date: string; // "15.10.2025"
  time: string; // "14:30 Uhr"
  pickupAddress: string; // "Hauptstraße 1, 80331 München"
  dropoffAddress: string; // "Flughafen München, 85356 München"
  vehicleClass: string; // "Business Class - Limousine (1-4 Pax)"
  price?: string; // "125,50 €"
  additionalInfo?: string; // Weitere Infos (Gepäck, Passagiere, etc.)
  companyName?: string;
  companyPhone?: string;
  companyEmail?: string;
}

const formatEmailTemplate = (data: EmailTemplateData, content: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
      <!-- Header mit Logo -->
      <div style="background-color: #EADEBD; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: #323D5E; margin: 0; font-size: 24px;">MyDispatch</h1>
        ${data.companyName ? `<p style="color: #856d4b; margin: 8px 0 0 0; font-size: 14px;">${data.companyName}</p>` : ''}
      </div>
      
      <!-- Hauptinhalt -->
      <div style="padding: 30px; background-color: #ffffff; border: 1px solid #e5e5e5; border-top: none;">
        ${content}
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0 0 10px 0;"><strong>MyDispatch Support</strong></p>
        <p style="margin: 0;">Mo. - Fr.: 9:00 - 17:00 Uhr</p>
        ${data.companyPhone ? `<p style="margin: 5px 0 0 0;">Tel: ${data.companyPhone}</p>` : ''}
        ${data.companyEmail ? `<p style="margin: 5px 0 0 0;">E-Mail: ${data.companyEmail}</p>` : ''}
        <p style="margin: 15px 0 0 0; color: #999; font-size: 11px;">
          © ${new Date().getFullYear()} MyDispatch. Alle Rechte vorbehalten.
        </p>
      </div>
    </div>
  `;
};

// 1. BUCHUNGSBESTÄTIGUNG
const bookingConfirmationTemplateV2 = (data: EmailTemplateData): string => {
  const content = `
    <!-- Anrede -->
    <p style="font-size: 16px; color: #323D5E; margin: 0 0 20px 0;">
      ${data.salutation},
    </p>
    
    <!-- Einleitung -->
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
      ${data.introduction}
    </p>
    
    <!-- Fahrtdetails -->
    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #323D5E; margin: 0 0 15px 0; font-size: 18px;">📋 Fahrtdetails</h3>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">📅 Datum:</strong> 
        <span style="color: #333;">${data.date}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🕐 Uhrzeit:</strong> 
        <span style="color: #333;">${data.time}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">📍 Abholort:</strong> 
        <span style="color: #333;">${data.pickupAddress}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🎯 Zielort:</strong> 
        <span style="color: #333;">${data.dropoffAddress}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🚗 Fahrzeugklasse:</strong> 
        <span style="color: #333;">${data.vehicleClass}</span>
      </div>
      
      ${data.price ? `
        <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #EADEBD;">
          <strong style="color: #323D5E; font-size: 16px;">💶 Gesamtpreis:</strong> 
          <span style="color: #856d4b; font-size: 18px; font-weight: bold;">${data.price}</span>
        </div>
      ` : ''}
      
      ${data.additionalInfo ? `
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e5e5;">
          <p style="font-size: 13px; color: #666; margin: 0;">${data.additionalInfo}</p>
        </div>
      ` : ''}
    </div>
    
    <!-- Abschluss -->
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 20px 0 0 0;">
      Wir freuen uns darauf, Sie zu fahren!
    </p>
    
    <p style="font-size: 14px; color: #323D5E; margin: 20px 0 0 0;">
      Mit freundlichen Grüßen<br>
      ${data.companyName || 'Ihr MyDispatch-Team'}
    </p>
  `;
  
  return formatEmailTemplate(data, content);
};

// 2. ANGEBOTSVERSAND
const quoteEmailTemplateV2 = (data: EmailTemplateData & { validUntil: string }): string => {
  const content = `
    <p style="font-size: 16px; color: #323D5E; margin: 0 0 20px 0;">
      ${data.salutation},
    </p>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
      ${data.introduction}
    </p>
    
    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #323D5E; margin: 0 0 15px 0; font-size: 18px;">📋 Angebots-Details</h3>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">📅 Datum:</strong> 
        <span style="color: #333;">${data.date}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🕐 Uhrzeit:</strong> 
        <span style="color: #333;">${data.time}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">📍 Abholort:</strong> 
        <span style="color: #333;">${data.pickupAddress}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🎯 Zielort:</strong> 
        <span style="color: #333;">${data.dropoffAddress}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🚗 Fahrzeugklasse:</strong> 
        <span style="color: #333;">${data.vehicleClass}</span>
      </div>
      
      ${data.price ? `
        <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #EADEBD;">
          <strong style="color: #323D5E; font-size: 16px;">💶 Angebots-Preis:</strong> 
          <span style="color: #856d4b; font-size: 18px; font-weight: bold;">${data.price}</span>
        </div>
      ` : ''}
      
      <div style="margin-top: 15px; padding: 12px; background-color: #fff3cd; border-radius: 4px;">
        <strong style="color: #856d4b;">⏰ Gültig bis:</strong> 
        <span style="color: #333;">${data.validUntil}</span>
      </div>
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 20px 0;">
      Bei Interesse kontaktieren Sie uns bitte oder nehmen Sie das Angebot direkt an.
    </p>
    
    <p style="font-size: 14px; color: #323D5E; margin: 20px 0 0 0;">
      Mit freundlichen Grüßen<br>
      ${data.companyName || 'Ihr MyDispatch-Team'}
    </p>
  `;
  
  return formatEmailTemplate(data, content);
};

// 3. RECHNUNGSVERSAND
const invoiceEmailTemplateV2 = (data: EmailTemplateData & { invoiceNumber: string; dueDate: string; netAmount: string; vatAmount: string; grossAmount: string }): string => {
  const content = `
    <p style="font-size: 16px; color: #323D5E; margin: 0 0 20px 0;">
      ${data.salutation},
    </p>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
      ${data.introduction}
    </p>
    
    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #323D5E; margin: 0 0 15px 0; font-size: 18px;">📋 Rechnungs-Details</h3>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">📄 Rechnungs-Nr.:</strong> 
        <span style="color: #333;">${data.invoiceNumber}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">📅 Datum:</strong> 
        <span style="color: #333;">${data.date}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🕐 Uhrzeit:</strong> 
        <span style="color: #333;">${data.time}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">📍 Abholort:</strong> 
        <span style="color: #333;">${data.pickupAddress}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🎯 Zielort:</strong> 
        <span style="color: #333;">${data.dropoffAddress}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🚗 Fahrzeugklasse:</strong> 
        <span style="color: #333;">${data.vehicleClass}</span>
      </div>
      
      <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #EADEBD;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #666;">Nettobetrag:</span>
          <span style="color: #333; font-weight: 500;">${data.netAmount}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: #666;">MwSt.:</span>
          <span style="color: #333; font-weight: 500;">${data.vatAmount}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid #ddd;">
          <strong style="color: #323D5E; font-size: 16px;">💶 Gesamtbetrag:</strong>
          <strong style="color: #856d4b; font-size: 18px;">${data.grossAmount}</strong>
        </div>
      </div>
      
      <div style="margin-top: 15px; padding: 12px; background-color: #fff3cd; border-radius: 4px;">
        <strong style="color: #856d4b;">⏰ Fällig bis:</strong> 
        <span style="color: #333;">${data.dueDate}</span>
      </div>
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 20px 0;">
      Bitte überweisen Sie den Rechnungsbetrag bis zum angegebenen Datum auf unser Konto.
    </p>
    
    <p style="font-size: 14px; color: #323D5E; margin: 20px 0 0 0;">
      Mit freundlichen Grüßen<br>
      ${data.companyName || 'Ihr MyDispatch-Team'}
    </p>
  `;
  
  return formatEmailTemplate(data, content);
};

// 4. ZAHLUNGSERINNERUNG
const paymentReminderTemplateV2 = (data: EmailTemplateData & { invoiceNumber: string; dueDate: string; daysOverdue: number }): string => {
  const content = `
    <p style="font-size: 16px; color: #323D5E; margin: 0 0 20px 0;">
      ${data.salutation},
    </p>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
      wir möchten Sie daran erinnern, dass die folgende Rechnung noch offen ist:
    </p>
    
    <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #fbbf24;">
      <h3 style="color: #856d4b; margin: 0 0 15px 0; font-size: 18px;">⚠️ Offene Rechnung</h3>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">📄 Rechnungs-Nr.:</strong> 
        <span style="color: #333;">${data.invoiceNumber}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">⏰ Fälligkeitsdatum:</strong> 
        <span style="color: #ef4444; font-weight: 600;">${data.dueDate} (vor ${data.daysOverdue} Tagen)</span>
      </div>
      
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #fbbf24;">
        <strong style="color: #323D5E; font-size: 16px;">💶 Offener Betrag:</strong> 
        <strong style="color: #ef4444; font-size: 18px;">${data.price}</strong>
      </div>
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 20px 0;">
      Bitte überweisen Sie den offenen Betrag umgehend, um Mahngebühren zu vermeiden.
    </p>
    
    <p style="font-size: 13px; color: #666; margin: 20px 0;">
      Falls Sie die Rechnung bereits beglichen haben, betrachten Sie diese E-Mail als gegenstandslos.
    </p>
    
    <p style="font-size: 14px; color: #323D5E; margin: 20px 0 0 0;">
      Mit freundlichen Grüßen<br>
      ${data.companyName || 'Ihr MyDispatch-Team'}
    </p>
  `;
  
  return formatEmailTemplate(data, content);
};

// 5. AUFTRAGS-STORNIERUNG
const bookingCancellationTemplateV2 = (data: EmailTemplateData & { cancellationReason?: string }): string => {
  const content = `
    <p style="font-size: 16px; color: #323D5E; margin: 0 0 20px 0;">
      ${data.salutation},
    </p>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
      Ihre Buchung wurde erfolgreich storniert.
    </p>
    
    <div style="background-color: #fee; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
      <h3 style="color: #ef4444; margin: 0 0 15px 0; font-size: 18px;">❌ Stornierte Buchung</h3>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">📅 Datum:</strong> 
        <span style="color: #333;">${data.date}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🕐 Uhrzeit:</strong> 
        <span style="color: #333;">${data.time}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">📍 Abholort:</strong> 
        <span style="color: #333;">${data.pickupAddress}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🎯 Zielort:</strong> 
        <span style="color: #333;">${data.dropoffAddress}</span>
      </div>
      
      ${data.cancellationReason ? `
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ef4444;">
          <strong style="color: #323D5E;">Grund:</strong>
          <p style="color: #666; margin: 5px 0 0 0;">${data.cancellationReason}</p>
        </div>
      ` : ''}
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 20px 0;">
      Bei Fragen stehen wir Ihnen gerne zur Verfügung.
    </p>
    
    <p style="font-size: 14px; color: #323D5E; margin: 20px 0 0 0;">
      Mit freundlichen Grüßen<br>
      ${data.companyName || 'Ihr MyDispatch-Team'}
    </p>
  `;
  
  return formatEmailTemplate(data, content);
};

// 6. AUFTRAGS-ÄNDERUNG
const bookingUpdateTemplateV2 = (data: EmailTemplateData & { changesDescription: string }): string => {
  const content = `
    <p style="font-size: 16px; color: #323D5E; margin: 0 0 20px 0;">
      ${data.salutation},
    </p>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
      Ihre Buchung wurde aktualisiert. Hier die neuen Details:
    </p>
    
    <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
      <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">🔄 Aktualisierte Buchung</h3>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">📅 Datum:</strong> 
        <span style="color: #333;">${data.date}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🕐 Uhrzeit:</strong> 
        <span style="color: #333;">${data.time}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">📍 Abholort:</strong> 
        <span style="color: #333;">${data.pickupAddress}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🎯 Zielort:</strong> 
        <span style="color: #333;">${data.dropoffAddress}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🚗 Fahrzeugklasse:</strong> 
        <span style="color: #333;">${data.vehicleClass}</span>
      </div>
      
      ${data.price ? `
        <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #3b82f6;">
          <strong style="color: #323D5E; font-size: 16px;">💶 Preis:</strong> 
          <span style="color: #856d4b; font-size: 18px; font-weight: bold;">${data.price}</span>
        </div>
      ` : ''}
      
      <div style="margin-top: 15px; padding: 12px; background-color: #dbeafe; border-radius: 4px;">
        <strong style="color: #1e40af;">📝 Änderungen:</strong>
        <p style="color: #333; margin: 5px 0 0 0;">${data.changesDescription}</p>
      </div>
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 20px 0;">
      Bei Fragen zu diesen Änderungen kontaktieren Sie uns bitte.
    </p>
    
    <p style="font-size: 14px; color: #323D5E; margin: 20px 0 0 0;">
      Mit freundlichen Grüßen<br>
      ${data.companyName || 'Ihr MyDispatch-Team'}
    </p>
  `;
  
  return formatEmailTemplate(data, content);
};

// 7. FAHRER-ZUWEISUNG (an Fahrer)
const driverAssignmentTemplateV2 = (data: EmailTemplateData & { driverName: string; bookingId: string }): string => {
  const content = `
    <p style="font-size: 16px; color: #323D5E; margin: 0 0 20px 0;">
      Hallo ${data.driverName},
    </p>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
      Sie wurden einem neuen Auftrag zugewiesen:
    </p>
    
    <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
      <h3 style="color: #047857; margin: 0 0 15px 0; font-size: 18px;">✅ Neuer Auftrag</h3>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🆔 Auftrags-ID:</strong> 
        <span style="color: #333; font-family: monospace;">${data.bookingId}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">📅 Datum:</strong> 
        <span style="color: #333;">${data.date}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🕐 Uhrzeit:</strong> 
        <span style="color: #333; font-weight: 600; font-size: 16px;">${data.time}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">📍 Abholort:</strong> 
        <span style="color: #333;">${data.pickupAddress}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🎯 Zielort:</strong> 
        <span style="color: #333;">${data.dropoffAddress}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🚗 Fahrzeugklasse:</strong> 
        <span style="color: #333;">${data.vehicleClass}</span>
      </div>
      
      ${data.additionalInfo ? `
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #10b981;">
          <strong style="color: #323D5E;">ℹ️ Zusatzinfo:</strong>
          <p style="color: #666; margin: 5px 0 0 0;">${data.additionalInfo}</p>
        </div>
      ` : ''}
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 20px 0;">
      Bitte bestätigen Sie die Auftragsannahme im Fahrer-Portal.
    </p>
    
    <p style="font-size: 14px; color: #323D5E; margin: 20px 0 0 0;">
      Gute Fahrt!<br>
      ${data.companyName || 'Ihr MyDispatch-Team'}
    </p>
  `;
  
  return formatEmailTemplate(data, content);
};

// 8. SCHICHT-ERINNERUNG (an Fahrer)
const shiftReminderTemplateV2 = (driverName: string, date: string, startTime: string, endTime: string, vehiclePlate: string, companyName: string): string => {
  const data: EmailTemplateData = {
    salutation: `Hallo ${driverName}`,
    introduction: 'Erinnerung an Ihre morgige Schicht',
    date,
    time: startTime,
    pickupAddress: '-',
    dropoffAddress: '-',
    vehicleClass: '-',
    companyName,
  };
  
  const content = `
    <p style="font-size: 16px; color: #323D5E; margin: 0 0 20px 0;">
      ${data.salutation},
    </p>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
      Erinnerung: Morgen beginnt Ihre Schicht!
    </p>
    
    <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
      <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">📅 Schicht-Details</h3>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">📅 Datum:</strong> 
        <span style="color: #333;">${date}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🕐 Start:</strong> 
        <span style="color: #333; font-weight: 600;">${startTime}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🕔 Ende:</strong> 
        <span style="color: #333; font-weight: 600;">${endTime}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">🚗 Fahrzeug:</strong> 
        <span style="color: #333;">${vehiclePlate}</span>
      </div>
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 20px 0;">
      Bitte seien Sie pünktlich und melden Sie sich bei Problemen rechtzeitig!
    </p>
    
    <p style="font-size: 14px; color: #323D5E; margin: 20px 0 0 0;">
      Gute Fahrt!<br>
      ${companyName || 'Ihr MyDispatch-Team'}
    </p>
  `;
  
  return formatEmailTemplate(data, content);
};

// 9. WILLKOMMENS-E-MAIL (Onboarding)
const welcomeOnboardingTemplateV2 = (userName: string, companyName: string): string => {
  const data: EmailTemplateData = {
    salutation: `Sehr geehrte/r ${userName}`,
    introduction: `willkommen bei MyDispatch! Ihr Konto für ${companyName} ist jetzt aktiv.`,
    date: new Date().toLocaleDateString('de-DE'),
    time: '-',
    pickupAddress: '-',
    dropoffAddress: '-',
    vehicleClass: '-',
    companyName: 'MyDispatch',
  };
  
  const content = `
    <p style="font-size: 16px; color: #323D5E; margin: 0 0 20px 0;">
      ${data.salutation},
    </p>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
      ${data.introduction}
    </p>
    
    <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #047857; margin: 0 0 15px 0; font-size: 18px;">🎉 Los geht's!</h3>
      <p style="color: #333; margin-bottom: 15px;">Hier sind Ihre ersten Schritte:</p>
      <ol style="color: #333; line-height: 1.8; padding-left: 20px;">
        <li>Unternehmensprofil vervollständigen</li>
        <li>Erste Fahrer und Fahrzeuge anlegen</li>
        <li>Ersten Auftrag erstellen</li>
        <li>AI-Support testen</li>
      </ol>
    </div>
    
    <a href="${import.meta.env.VITE_SUPABASE_URL}/" style="display: inline-block; padding: 12px 24px; background-color: #856d4b; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; text-align: center;">
      Jetzt loslegen
    </a>
    
    <p style="font-size: 14px; color: #323D5E; margin: 20px 0 0 0;">
      Viel Erfolg mit MyDispatch!<br>
      Ihr MyDispatch-Team
    </p>
  `;
  
  return formatEmailTemplate(data, content);
};

// 10. TARIF-UPGRADE-BESTÄTIGUNG
const tariffUpgradeTemplateV2 = (userName: string, oldTariff: string, newTariff: string, effectiveDate: string, newPrice: string): string => {
  const data: EmailTemplateData = {
    salutation: `Sehr geehrte/r ${userName}`,
    introduction: `Ihr Tarif-Upgrade wurde erfolgreich durchgeführt.`,
    date: effectiveDate,
    time: '-',
    pickupAddress: '-',
    dropoffAddress: '-',
    vehicleClass: '-',
    companyName: 'MyDispatch',
  };
  
  const content = `
    <p style="font-size: 16px; color: #323D5E; margin: 0 0 20px 0;">
      ${data.salutation},
    </p>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
      ${data.introduction}
    </p>
    
    <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
      <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">⬆️ Tarif-Upgrade</h3>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">Alter Tarif:</strong> 
        <span style="color: #666; text-decoration: line-through;">${oldTariff}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">Neuer Tarif:</strong> 
        <span style="color: #047857; font-weight: 600; font-size: 16px;">${newTariff}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">Wirksam ab:</strong> 
        <span style="color: #333;">${effectiveDate}</span>
      </div>
      
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #f59e0b;">
        <strong style="color: #323D5E; font-size: 16px;">💶 Neuer Preis:</strong> 
        <strong style="color: #856d4b; font-size: 18px;">${newPrice}</strong>
      </div>
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 20px 0;">
      Vielen Dank für Ihr Vertrauen! Sie können jetzt alle erweiterten Features nutzen.
    </p>
    
    <p style="font-size: 14px; color: #323D5E; margin: 20px 0 0 0;">
      Mit freundlichen Grüßen<br>
      Ihr MyDispatch-Team
    </p>
  `;
  
  return formatEmailTemplate(data, content);
};

// 11. SUPPORT-TICKET-BESTÄTIGUNG
const supportTicketTemplateV2 = (userName: string, ticketId: string, subject: string, message: string): string => {
  const data: EmailTemplateData = {
    salutation: `Sehr geehrte/r ${userName}`,
    introduction: `Ihr Support-Ticket wurde erfolgreich angelegt.`,
    date: new Date().toLocaleDateString('de-DE'),
    time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    pickupAddress: '-',
    dropoffAddress: '-',
    vehicleClass: '-',
    companyName: 'MyDispatch',
  };
  
  const content = `
    <p style="font-size: 16px; color: #323D5E; margin: 0 0 20px 0;">
      ${data.salutation},
    </p>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
      ${data.introduction}
    </p>
    
    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #323D5E; margin: 0 0 15px 0; font-size: 18px;">🎫 Ticket-Details</h3>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">Ticket-ID:</strong> 
        <span style="color: #333; font-family: monospace;">${ticketId}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">Betreff:</strong> 
        <span style="color: #333;">${subject}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #323D5E;">Erstellt am:</strong> 
        <span style="color: #333;">${data.date} um ${data.time}</span>
      </div>
      
      <div style="margin-top: 15px; padding: 12px; background-color: #e5e7eb; border-radius: 4px;">
        <strong style="color: #323D5E;">Ihre Nachricht:</strong>
        <p style="color: #333; margin: 5px 0 0 0; white-space: pre-wrap;">${message}</p>
      </div>
    </div>
    
    <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 20px 0;">
      Unser Support-Team wird sich schnellstmöglich bei Ihnen melden.
    </p>
    
    <div style="background-color: #dbeafe; padding: 12px; border-radius: 4px; margin: 20px 0;">
      <p style="font-size: 13px; color: #1e40af; margin: 0;">
        <strong>⏰ Antwortzeiten:</strong><br>
        Starter: 24h | Business: 4h | Enterprise: 1h
      </p>
    </div>
    
    <p style="font-size: 14px; color: #323D5E; margin: 20px 0 0 0;">
      Mit freundlichen Grüßen<br>
      Ihr MyDispatch-Team
    </p>
  `;
  
  return formatEmailTemplate(data, content);
};

// Export aller Templates
export {
  bookingConfirmationTemplateV2,
  quoteEmailTemplateV2,
  invoiceEmailTemplateV2,
  paymentReminderTemplateV2,
  bookingCancellationTemplateV2,
  bookingUpdateTemplateV2,
  driverAssignmentTemplateV2,
  shiftReminderTemplateV2,
  welcomeOnboardingTemplateV2,
  tariffUpgradeTemplateV2,
  supportTicketTemplateV2,
};
