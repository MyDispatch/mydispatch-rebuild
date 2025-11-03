/* ==================================================================================
   E-MAIL TEMPLATES - ERWEITERT
   ==================================================================================
   Alle E-Mail-Templates für MyDispatch
   ================================================================================== */

export interface EmailTemplate {
  subject: string;
  body: string;
}

// 1. Passwort-Vergessen
export const passwordResetTemplate = (resetLink: string): EmailTemplate => ({
  subject: 'MyDispatch - Passwort zurücksetzen',
  body: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #323D5E;">Passwort zurücksetzen</h2>
      <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.</p>
      <p>Klicken Sie auf den folgenden Link, um ein neues Passwort festzulegen:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #856d4b; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Passwort zurücksetzen
      </a>
      <p style="color: #666;">Dieser Link ist 24 Stunden gültig.</p>
      <p style="color: #666; font-size: 12px;">Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.</p>
    </div>
  `,
});

// 2. Registrierungs-Bestätigung
export const registrationConfirmTemplate = (companyName: string, userName: string): EmailTemplate => ({
  subject: 'Willkommen bei MyDispatch!',
  body: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #323D5E;">Willkommen bei MyDispatch, ${userName}!</h2>
      <p>Ihre Registrierung für <strong>${companyName}</strong> war erfolgreich.</p>
      <p>Sie können sich jetzt anmelden und mit der Disposition beginnen:</p>
      <a href="${import.meta.env.VITE_SUPABASE_URL}/auth" style="display: inline-block; padding: 12px 24px; background-color: #856d4b; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Jetzt anmelden
      </a>
      <p style="color: #666;">Bei Fragen steht Ihnen unser Support gerne zur Verfügung.</p>
    </div>
  `,
});

// 3. Fahrer-Einladung (Portal)
export const driverInvitationTemplate = (driverName: string, companyName: string, loginLink: string, tempPassword: string): EmailTemplate => ({
  subject: `Einladung zum MyDispatch Fahrer-Portal - ${companyName}`,
  body: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #323D5E;">Hallo ${driverName}!</h2>
      <p><strong>${companyName}</strong> hat Sie zum Fahrer-Portal eingeladen.</p>
      <p>Über das Portal können Sie:</p>
      <ul>
        <li>Ihre Schichten einsehen</li>
        <li>Aufträge bestätigen</li>
        <li>Mit der Zentrale kommunizieren</li>
      </ul>
      <p><strong>Ihre Zugangsdaten:</strong></p>
      <p>Login-Link: <a href="${loginLink}">${loginLink}</a></p>
      <p>Temporäres Passwort: <code>${tempPassword}</code></p>
      <p style="color: #ff6b6b;">Bitte ändern Sie Ihr Passwort nach dem ersten Login!</p>
      <a href="${loginLink}" style="display: inline-block; padding: 12px 24px; background-color: #856d4b; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Zum Portal
      </a>
    </div>
  `,
});

// 4. Kunden-Einladung (Portal)
export const customerInvitationTemplate = (customerName: string, companyName: string, loginLink: string, tempPassword: string): EmailTemplate => ({
  subject: `Einladung zum MyDispatch Kunden-Portal - ${companyName}`,
  body: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #323D5E;">Hallo ${customerName}!</h2>
      <p><strong>${companyName}</strong> hat Sie zum Kunden-Portal eingeladen.</p>
      <p>Über das Portal können Sie:</p>
      <ul>
        <li>Neue Fahrten buchen</li>
        <li>Ihre Auftrags-Historie einsehen</li>
        <li>Rechnungen herunterladen</li>
      </ul>
      <p><strong>Ihre Zugangsdaten:</strong></p>
      <p>Login-Link: <a href="${loginLink}">${loginLink}</a></p>
      <p>Temporäres Passwort: <code>${tempPassword}</code></p>
      <p style="color: #ff6b6b;">Bitte ändern Sie Ihr Passwort nach dem ersten Login!</p>
      <a href="${loginLink}" style="display: inline-block; padding: 12px 24px; background-color: #856d4b; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Zum Portal
      </a>
    </div>
  `,
});

// 5. Partner-Anfrage (Benachrichtigung)
export const partnerRequestTemplate = (targetCompanyName: string, requestingCompanyName: string, message: string, acceptLink: string, rejectLink: string): EmailTemplate => ({
  subject: `Neue Partner-Anfrage von ${requestingCompanyName}`,
  body: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #323D5E;">Neue Partner-Anfrage</h2>
      <p><strong>${requestingCompanyName}</strong> möchte mit <strong>${targetCompanyName}</strong> eine Partner-Verbindung aufbauen.</p>
      ${message ? `<p><strong>Nachricht:</strong></p><p style="background: #f5f5f5; padding: 12px; border-radius: 4px;">${message}</p>` : ''}
      <p>Bei Annahme können beide Unternehmen Fahrzeuge und Fahrer gemeinsam nutzen.</p>
      <div style="margin: 30px 0;">
        <a href="${acceptLink}" style="display: inline-block; padding: 12px 24px; background-color: #51cf66; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">
          Annehmen
        </a>
        <a href="${rejectLink}" style="display: inline-block; padding: 12px 24px; background-color: #ff6b6b; color: white; text-decoration: none; border-radius: 4px;">
          Ablehnen
        </a>
      </div>
    </div>
  `,
});

// 6. Dokumenten-Ablauf (Erinnerung)
export const documentExpiryTemplate = (companyName: string, documentName: string, entityType: string, expiryDate: string, daysUntilExpiry: number): EmailTemplate => ({
  subject: `Dokument läuft bald ab - ${documentName}`,
  body: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ff6b6b;">⚠️ Dokument läuft bald ab</h2>
      <p>Hallo ${companyName},</p>
      <p>das folgende Dokument läuft in <strong>${daysUntilExpiry} Tagen</strong> ab:</p>
      <div style="background: #fff3cd; padding: 16px; border-radius: 4px; margin: 20px 0;">
        <p><strong>Dokument:</strong> ${documentName}</p>
        <p><strong>Typ:</strong> ${entityType}</p>
        <p><strong>Ablaufdatum:</strong> ${expiryDate}</p>
      </div>
      <p>Bitte laden Sie rechtzeitig ein neues Dokument hoch, um rechtliche Probleme zu vermeiden.</p>
      <a href="${import.meta.env.VITE_SUPABASE_URL}/dokumente" style="display: inline-block; padding: 12px 24px; background-color: #856d4b; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Zum Dokumente-Bereich
      </a>
    </div>
  `,
});

// 7. Buchungs-Bestätigung
export const bookingConfirmationTemplate = (customerName: string, pickupAddress: string, dropoffAddress: string, pickupTime: string, price: string): EmailTemplate => ({
  subject: 'Buchungsbestätigung - MyDispatch',
  body: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #323D5E;">Buchungsbestätigung</h2>
      <p>Hallo ${customerName},</p>
      <p>Ihre Buchung wurde erfolgreich bestätigt.</p>
      <div style="background: #f5f5f5; padding: 16px; border-radius: 4px; margin: 20px 0;">
        <p><strong>Abholung:</strong> ${pickupAddress}</p>
        <p><strong>Ziel:</strong> ${dropoffAddress}</p>
        <p><strong>Zeit:</strong> ${pickupTime}</p>
        <p><strong>Preis:</strong> ${price}</p>
      </div>
      <p>Wir freuen uns darauf, Sie zu fahren!</p>
    </div>
  `,
});
