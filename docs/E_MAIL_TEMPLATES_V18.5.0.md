# E-MAIL TEMPLATES - MyDispatch V18.5.0

**Status**: ✅ PRODUCTION-READY  
**Version**: 18.5.0  
**Letzte Aktualisierung**: 2025-10-22

---

## 📋 INHALTSVERZEICHNIS

1. [Template-Übersicht](#1-template-übersicht)
2. [Design-Standards](#2-design-standards)
3. [Bestehende Templates](#3-bestehende-templates)
4. [Fehlende Templates](#4-fehlende-templates)
5. [E-Mail-Versand-Integration](#5-e-mail-versand-integration)
6. [Testing & Spam-Score](#6-testing--spam-score)
7. [Mehrsprachigkeit](#7-mehrsprachigkeit)
8. [DSGVO-Compliance](#8-dsgvo-compliance)

---

## 1. TEMPLATE-ÜBERSICHT

### 1.1 Template-Matrix

| Template-ID     | Name                               | Zweck                    | Empfänger          | Edge Function                | Status       |
| --------------- | ---------------------------------- | ------------------------ | ------------------ | ---------------------------- | ------------ |
| **AUTH-01**     | `passwordResetTemplate`            | Passwort zurücksetzen    | User               | `send-password-reset`        | ✅ Vorhanden |
| **AUTH-02**     | `registrationConfirmTemplate`      | Registrierung bestätigt  | Neuer User         | `send-welcome-email`         | ✅ Vorhanden |
| **AUTH-03**     | `emailVerificationTemplate`        | E-Mail verifizieren      | Neuer User         | (Supabase Auth)              | ❌ Fehlt     |
| **DRIVER-01**   | `driverInvitationTemplate`         | Fahrer einladen          | Neuer Fahrer       | `invite-driver`              | ✅ Vorhanden |
| **DRIVER-02**   | `driverOnboardingCompleteTemplate` | Onboarding abgeschlossen | Fahrer             | `driver-onboarding-complete` | ❌ Fehlt     |
| **DRIVER-03**   | `shiftReminderTemplate`            | Schicht-Erinnerung       | Fahrer             | `send-shift-reminder`        | ❌ Fehlt     |
| **CUSTOMER-01** | `customerInvitationTemplate`       | Kunde einladen           | Neuer Kunde        | `invite-customer`            | ✅ Vorhanden |
| **CUSTOMER-02** | `customerWelcomeTemplate`          | Willkommen im Portal     | Kunde              | `customer-welcome`           | ❌ Fehlt     |
| **BOOKING-01**  | `bookingConfirmationTemplate`      | Buchung bestätigt        | Kunde              | `send-booking-confirmation`  | ✅ Vorhanden |
| **BOOKING-02**  | `bookingReminderTemplate`          | Buchung-Erinnerung (24h) | Kunde              | `send-booking-reminder`      | ❌ Fehlt     |
| **BOOKING-03**  | `bookingCancellationTemplate`      | Buchung storniert        | Kunde + Fahrer     | `send-cancellation-email`    | ❌ Fehlt     |
| **BOOKING-04**  | `driverAssignedTemplate`           | Fahrer zugewiesen        | Fahrer             | `notify-driver-assignment`   | ❌ Fehlt     |
| **PARTNER-01**  | `partnerRequestTemplate`           | Partner-Anfrage          | Ziel-Company       | `send-partner-request`       | ✅ Vorhanden |
| **PARTNER-02**  | `partnerAcceptedTemplate`          | Partner akzeptiert       | Ursprungs-Company  | `partner-accepted`           | ❌ Fehlt     |
| **PARTNER-03**  | `partnerRejectedTemplate`          | Partner abgelehnt        | Ursprungs-Company  | `partner-rejected`           | ❌ Fehlt     |
| **DOCUMENT-01** | `documentExpiryTemplate`           | Dokument läuft ab        | Disponent + Fahrer | `send-expiry-reminder`       | ✅ Vorhanden |
| **DOCUMENT-02** | `documentExpiredTemplate`          | Dokument abgelaufen      | Admin + Fahrer     | `document-expired-alert`     | ❌ Fehlt     |
| **INVOICE-01**  | `invoiceEmailTemplate`             | Rechnung versenden       | Kunde              | `send-invoice`               | ❌ Fehlt     |
| **INVOICE-02**  | `paymentConfirmationTemplate`      | Zahlung bestätigt        | Kunde              | `send-payment-confirmation`  | ❌ Fehlt     |
| **INVOICE-03**  | `paymentReminder1Template`         | 1. Zahlungserinnerung    | Kunde              | `send-payment-reminder`      | ❌ Fehlt     |
| **INVOICE-04**  | `paymentReminder2Template`         | 2. Mahnung               | Kunde              | `send-payment-reminder`      | ❌ Fehlt     |
| **INVOICE-05**  | `paymentReminder3Template`         | 3. Mahnung (Inkasso)     | Kunde              | `send-payment-reminder`      | ❌ Fehlt     |
| **ADMIN-01**    | `criticalErrorTemplate`            | Kritischer Fehler        | Admin              | `send-admin-alert`           | ❌ Fehlt     |
| **ADMIN-02**    | `weeklyReportTemplate`             | Wochenbericht            | Admin              | `send-weekly-report`         | ❌ Fehlt     |

**Status**:

- ✅ **7 Templates vorhanden** (in `src/lib/email-templates.ts`)
- ❌ **17 Templates fehlen** (müssen erstellt werden)

---

## 2. DESIGN-STANDARDS

### 2.1 HTML-Template-Struktur

**Base-Template** (alle E-Mails verwenden dieses):

```html
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{subject}}</title>
    <style>
      /* Inline-CSS für maximale Kompatibilität */
      body {
        margin: 0;
        padding: 0;
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        background-color: #f5f5f5;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
      }
      .header {
        background: linear-gradient(135deg, #323d5e 0%, #856d4b 100%);
        padding: 30px;
        text-align: center;
      }
      .header img {
        max-width: 180px;
        height: auto;
      }
      .content {
        padding: 40px 30px;
        color: #333333;
        line-height: 1.6;
      }
      .content h1 {
        color: #323d5e;
        font-size: 24px;
        margin-top: 0;
      }
      .cta-button {
        display: inline-block;
        padding: 14px 28px;
        background-color: #856d4b;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        margin: 20px 0;
      }
      .info-box {
        background-color: #f8f9fa;
        border-left: 4px solid #856d4b;
        padding: 16px;
        margin: 20px 0;
      }
      .warning-box {
        background-color: #fff3cd;
        border-left: 4px solid #ffc107;
        padding: 16px;
        margin: 20px 0;
      }
      .error-box {
        background-color: #f8d7da;
        border-left: 4px solid #dc3545;
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
        color: #856d4b;
        text-decoration: none;
      }
      /* Mobile-Optimierung */
      @media only screen and (max-width: 600px) {
        .content {
          padding: 30px 20px !important;
        }
        .cta-button {
          display: block !important;
          width: 100% !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <!-- Header with Logo -->
      <div class="header">
        <img src="https://your-cdn.com/mydispatch-logo-white.png" alt="MyDispatch Logo" />
      </div>

      <!-- Content -->
      <div class="content">{{content}}</div>

      <!-- Footer -->
      <div class="footer">
        <p>
          <strong>MyDispatch GmbH</strong><br />
          Musterstraße 123 | 12345 Musterstadt<br />
          <a href="tel:+49123456789">+49 123 456 789</a> |
          <a href="mailto:info@mydispatch.de">info@mydispatch.de</a>
        </p>
        <p style="margin-top: 20px; font-size: 12px;">
          Sie erhalten diese E-Mail, weil Sie bei MyDispatch registriert sind.<br />
          <a href="{{unsubscribe_link}}">Benachrichtigungen verwalten</a> |
          <a href="{{privacy_link}}">Datenschutz</a>
        </p>
      </div>
    </div>
  </body>
</html>
```

---

### 2.2 Farben & Branding

**Primary Colors** (aus Design-System):

- **Primary**: `#323D5E` (Dunkelblau)
- **Accent**: `#856d4b` (Goldbraun)
- **Success**: `#51cf66` (Grün)
- **Warning**: `#ffc107` (Gelb)
- **Error**: `#ff6b6b` (Rot)

**Background**:

- Outer: `#f5f5f5` (Light Gray)
- Container: `#ffffff` (White)

**Typography**:

- Font: System-Font-Stack
- H1: 24px, Bold, `#323D5E`
- Body: 16px, Regular, `#333333`
- Footer: 14px, Regular, `#6c757d`

---

### 2.3 E-Mail-Client-Kompatibilität

**Getestete Clients**:

- ✅ Gmail (Desktop + Mobile)
- ✅ Outlook (2016+)
- ✅ Apple Mail (macOS + iOS)
- ✅ Thunderbird
- ✅ Yahoo Mail
- ✅ Web.de / GMX

**Vermeidung von**:

- ❌ Externe CSS-Files (werden blockiert)
- ❌ JavaScript (wird nicht ausgeführt)
- ❌ Web-Fonts (Fallback auf System-Fonts)
- ❌ Video-Embeds (nur Bild-Links)

---

## 3. BESTEHENDE TEMPLATES

### 3.1 `passwordResetTemplate` (AUTH-01)

**Datei**: `src/lib/email-templates.ts` (Zeile 13-27)

**Verwendung**:

```typescript
import { passwordResetTemplate } from "@/lib/email-templates";

const resetLink = `${window.location.origin}/reset-password?token=${token}`;
const email = passwordResetTemplate(resetLink);

await resend.emails.send({
  from: "MyDispatch <noreply@mydispatch.de>",
  to: user.email,
  subject: email.subject,
  html: email.body,
});
```

**Verbesserungsvorschläge**:

1. **Plain-Text-Alternative hinzufügen**:

```typescript
export const passwordResetTemplate = (resetLink: string) => ({
  subject: "MyDispatch - Passwort zurücksetzen",
  html: `...`, // Bestehender HTML-Body
  text: `
Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.

Klicken Sie auf den folgenden Link:
${resetLink}

Dieser Link ist 24 Stunden gültig.

Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.
  `.trim(),
});
```

2. **Design-Upgrade**: Base-Template verwenden (siehe 2.1)

3. **Security-Icon** hinzufügen:

```html
<div style="text-align: center; margin: 20px 0;">
  🔒 <strong>Sicherheitshinweis</strong><br />
  <small>Geben Sie diesen Link niemals an Dritte weiter.</small>
</div>
```

---

### 3.2 `registrationConfirmTemplate` (AUTH-02)

**Datei**: `src/lib/email-templates.ts` (Zeile 30-43)

**Problem**: ❌ Verwendet `import.meta.env.VITE_SUPABASE_URL` im Template (Client-Only!)

**Fix**:

```typescript
export const registrationConfirmTemplate = (
  companyName: string,
  userName: string,
  loginUrl: string // ✅ Übergeben statt hardcoded
): EmailTemplate => ({
  subject: "Willkommen bei MyDispatch!",
  body: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #323D5E;">Willkommen bei MyDispatch, ${userName}!</h2>
      <p>Ihre Registrierung für <strong>${companyName}</strong> war erfolgreich.</p>
      <p>Sie können sich jetzt anmelden und mit der Disposition beginnen:</p>
      <a href="${loginUrl}" style="display: inline-block; padding: 12px 24px; background-color: #856d4b; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Jetzt anmelden
      </a>
      <p style="color: #666;">Bei Fragen steht Ihnen unser Support gerne zur Verfügung.</p>
    </div>
  `,
});
```

**Verwendung** (in Edge Function):

```typescript
const loginUrl = `${Deno.env.get("SUPABASE_URL")}/auth` || "https://app.mydispatch.de/auth";
const email = registrationConfirmTemplate(companyName, userName, loginUrl);
```

---

### 3.3 `driverInvitationTemplate` (DRIVER-01)

**Datei**: `src/lib/email-templates.ts` (Zeile 46-67)

**Verwendung**: ✅ Gut strukturiert

**Verbesserung**: Code-Block für Passwort:

```html
<div
  style="background: #f4f4f4; padding: 16px; border-radius: 4px; font-family: monospace; font-size: 18px; letter-spacing: 2px; text-align: center; margin: 20px 0;"
>
  ${tempPassword}
</div>
```

---

### 3.4 `customerInvitationTemplate` (CUSTOMER-01)

**Datei**: `src/lib/email-templates.ts` (Zeile 70-91)

**Verwendung**: ✅ Gut strukturiert (analog zu Driver-Invitation)

---

### 3.5 `partnerRequestTemplate` (PARTNER-01)

**Datei**: `src/lib/email-templates.ts` (Zeile 94-112)

**Problem**: ❌ Links mit hartcodierten URLs

**Fix**:

```typescript
export const partnerRequestTemplate = (
  targetCompanyName: string,
  requestingCompanyName: string,
  message: string,
  acceptLink: string, // z.B. https://app.mydispatch.de/partner-accept?token=xyz
  rejectLink: string // z.B. https://app.mydispatch.de/partner-reject?token=xyz
): EmailTemplate => ({
  // ... (Rest bleibt gleich)
});
```

---

### 3.6 `documentExpiryTemplate` (DOCUMENT-01)

**Datei**: `src/lib/email-templates.ts` (Zeile 115-133)

**Problem**: ❌ `import.meta.env` im Template

**Fix**:

```typescript
export const documentExpiryTemplate = (
  companyName: string,
  documentName: string,
  entityType: string,
  expiryDate: string,
  daysUntilExpiry: number,
  documentUrl: string // ✅ Übergeben
): EmailTemplate => ({
  // ...
  body: `
    <a href="${documentUrl}" style="...">
      Zum Dokumente-Bereich
    </a>
  `,
});
```

---

### 3.7 `bookingConfirmationTemplate` (BOOKING-01)

**Datei**: `src/lib/email-templates.ts` (Zeile 136-152)

**Verwendung**: ✅ Gut strukturiert

**Erweiterung für Fahrer-Info**:

```typescript
export const bookingConfirmationTemplate = (
  customerName: string,
  pickupAddress: string,
  dropoffAddress: string,
  pickupTime: string,
  price: string,
  driverName?: string, // ✅ Optional
  vehiclePlate?: string // ✅ Optional
): EmailTemplate => ({
  subject: "Buchungsbestätigung - MyDispatch",
  body: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #323D5E;">Buchungsbestätigung</h2>
      <p>Hallo ${customerName},</p>
      <p>Ihre Buchung wurde erfolgreich bestätigt.</p>
      <div class="info-box">
        <p><strong>Abholung:</strong> ${pickupAddress}</p>
        <p><strong>Ziel:</strong> ${dropoffAddress}</p>
        <p><strong>Zeit:</strong> ${pickupTime}</p>
        <p><strong>Preis:</strong> ${price}</p>
        ${driverName ? `<p><strong>Fahrer:</strong> ${driverName}</p>` : ""}
        ${vehiclePlate ? `<p><strong>Fahrzeug:</strong> ${vehiclePlate}</p>` : ""}
      </div>
      <p>Wir freuen uns darauf, Sie zu fahren!</p>
    </div>
  `,
});
```

---

## 4. FEHLENDE TEMPLATES

### 4.1 `emailVerificationTemplate` (AUTH-03)

**Zweck**: E-Mail-Adresse bestätigen nach Registrierung

**Template**:

```typescript
export const emailVerificationTemplate = (
  userName: string,
  verificationLink: string
): EmailTemplate => ({
  subject: "MyDispatch - E-Mail-Adresse bestätigen",
  html: `
    <div class="email-container">
      <div class="header">
        <img src="https://cdn.mydispatch.de/logo-white.png" alt="MyDispatch">
      </div>
      <div class="content">
        <h1>Hallo ${userName}! 👋</h1>
        <p>Vielen Dank für Ihre Registrierung bei MyDispatch.</p>
        <p>Bitte bestätigen Sie Ihre E-Mail-Adresse, um Ihr Konto zu aktivieren:</p>
        
        <a href="${verificationLink}" class="cta-button">
          E-Mail-Adresse bestätigen
        </a>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Dieser Link ist 24 Stunden gültig.<br>
          Falls Sie sich nicht registriert haben, ignorieren Sie diese E-Mail.
        </p>
      </div>
      <div class="footer">
        <!-- Standard-Footer -->
      </div>
    </div>
  `,
  text: `
Hallo ${userName},

vielen Dank für Ihre Registrierung bei MyDispatch.

Bitte bestätigen Sie Ihre E-Mail-Adresse:
${verificationLink}

Dieser Link ist 24 Stunden gültig.
  `.trim(),
});
```

---

### 4.2 `bookingReminderTemplate` (BOOKING-02)

**Zweck**: Erinnerung 24h vor Abholung

**Template**:

```typescript
export const bookingReminderTemplate = (
  customerName: string,
  pickupTime: string,
  pickupAddress: string,
  driverName: string,
  driverPhone: string,
  vehiclePlate: string
): EmailTemplate => ({
  subject: "Erinnerung: Ihre Fahrt morgen",
  html: `
    <div class="content">
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
    </div>
  `,
  text: `
Erinnerung: Ihre Fahrt morgen

Hallo ${customerName},

wir erinnern Sie an Ihre gebuchte Fahrt:

Abholung: ${pickupTime}
Adresse: ${pickupAddress}
Fahrer: ${driverName} (${driverPhone})
Fahrzeug: ${vehiclePlate}

Wir freuen uns auf Sie!
  `.trim(),
});
```

**Trigger**: Cron-Job täglich 18:00 Uhr

---

### 4.3 `bookingCancellationTemplate` (BOOKING-03)

**Zweck**: Stornierungsbestätigung

**Template**:

```typescript
export const bookingCancellationTemplate = (
  customerName: string,
  bookingId: string,
  pickupTime: string,
  cancellationFee: string,
  refundAmount: string
): EmailTemplate => ({
  subject: "Buchung storniert - MyDispatch",
  html: `
    <div class="content">
      <h1>Buchung storniert</h1>
      <p>Hallo ${customerName},</p>
      <p>Ihre Buchung wurde erfolgreich storniert.</p>
      
      <div class="info-box">
        <p><strong>Buchungsnummer:</strong> ${bookingId}</p>
        <p><strong>Ursprüngliche Abholung:</strong> ${pickupTime}</p>
        ${
          cancellationFee !== "0,00 €"
            ? `
          <p style="color: #dc3545;"><strong>Stornogebühr:</strong> ${cancellationFee}</p>
        `
            : ""
        }
        <p style="color: #51cf66;"><strong>Rückerstattung:</strong> ${refundAmount}</p>
      </div>
      
      ${
        cancellationFee !== "0,00 €"
          ? `
        <div class="warning-box">
          <p><strong>Hinweis zur Stornogebühr:</strong><br>
          Da die Stornierung weniger als 24 Stunden vor der Abholung erfolgte, 
          fällt eine Stornogebühr an.</p>
        </div>
      `
          : ""
      }
      
      <p>Wir hoffen, Sie bald wieder bei uns begrüßen zu dürfen!</p>
    </div>
  `,
  text: `
Buchung storniert

Hallo ${customerName},

Ihre Buchung wurde erfolgreich storniert.

Buchungsnummer: ${bookingId}
Ursprüngliche Abholung: ${pickupTime}
${cancellationFee !== "0,00 €" ? `Stornogebühr: ${cancellationFee}\n` : ""}
Rückerstattung: ${refundAmount}
  `.trim(),
});
```

---

### 4.4 `invoiceEmailTemplate` (INVOICE-01)

**Zweck**: Rechnung per E-Mail versenden

**Template**:

```typescript
export const invoiceEmailTemplate = (
  customerName: string,
  invoiceNumber: string,
  invoiceDate: string,
  totalAmount: string,
  dueDate: string,
  pdfUrl: string,
  paymentLink?: string
): EmailTemplate => ({
  subject: `Rechnung ${invoiceNumber} - MyDispatch`,
  html: `
    <div class="content">
      <h1>Ihre Rechnung</h1>
      <p>Sehr geehrte/r ${customerName},</p>
      <p>anbei erhalten Sie Ihre Rechnung für die erbrachten Leistungen.</p>
      
      <div class="info-box">
        <p><strong>Rechnungsnummer:</strong> ${invoiceNumber}</p>
        <p><strong>Rechnungsdatum:</strong> ${invoiceDate}</p>
        <p><strong>Gesamtbetrag:</strong> ${totalAmount}</p>
        <p><strong>Zahlungsziel:</strong> ${dueDate}</p>
      </div>
      
      <a href="${pdfUrl}" class="cta-button" style="background-color: #323D5E;">
        📄 Rechnung herunterladen (PDF)
      </a>
      
      ${
        paymentLink
          ? `
        <a href="${paymentLink}" class="cta-button" style="margin-left: 10px;">
          💳 Jetzt online bezahlen
        </a>
      `
          : ""
      }
      
      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        Bitte überweisen Sie den Betrag bis zum ${dueDate} unter Angabe der Rechnungsnummer.
      </p>
    </div>
  `,
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
});
```

---

### 4.5 `paymentReminder1Template` (INVOICE-03)

**Zweck**: Freundliche 1. Erinnerung (7 Tage überfällig)

**Template**:

```typescript
export const paymentReminder1Template = (
  customerName: string,
  invoiceNumber: string,
  totalAmount: string,
  daysOverdue: number,
  paymentLink: string
): EmailTemplate => ({
  subject: `Zahlungserinnerung: Rechnung ${invoiceNumber}`,
  html: `
    <div class="content">
      <h1>Freundliche Zahlungserinnerung</h1>
      <p>Sehr geehrte/r ${customerName},</p>
      <p>uns ist aufgefallen, dass die folgende Rechnung noch nicht beglichen wurde:</p>
      
      <div class="warning-box">
        <p><strong>Rechnungsnummer:</strong> ${invoiceNumber}</p>
        <p><strong>Betrag:</strong> ${totalAmount}</p>
        <p><strong>Überfällig seit:</strong> ${daysOverdue} Tagen</p>
      </div>
      
      <p>Falls die Zahlung bereits erfolgt ist, betrachten Sie diese E-Mail bitte als gegenstandslos.</p>
      
      <a href="${paymentLink}" class="cta-button">
        Jetzt bezahlen
      </a>
      
      <p style="margin-top: 20px;">
        Bei Fragen stehen wir Ihnen gerne zur Verfügung.
      </p>
    </div>
  `,
  text: `
Freundliche Zahlungserinnerung

Sehr geehrte/r ${customerName},

uns ist aufgefallen, dass die folgende Rechnung noch nicht beglichen wurde:

Rechnungsnummer: ${invoiceNumber}
Betrag: ${totalAmount}
Überfällig seit: ${daysOverdue} Tagen

Online bezahlen: ${paymentLink}
  `.trim(),
});
```

---

### 4.6 `criticalErrorTemplate` (ADMIN-01)

**Zweck**: Admin-Alert bei kritischen Fehlern

**Template**:

```typescript
export const criticalErrorTemplate = (
  errorType: string,
  errorMessage: string,
  affectedUsers: number,
  timestamp: string,
  logLink: string
): EmailTemplate => ({
  subject: `🚨 CRITICAL: ${errorType}`,
  html: `
    <div class="content">
      <div class="error-box">
        <h1>🚨 Kritischer Systemfehler</h1>
        <p><strong>Fehlertyp:</strong> ${errorType}</p>
        <p><strong>Zeit:</strong> ${timestamp}</p>
        <p><strong>Betroffene User:</strong> ${affectedUsers}</p>
      </div>
      
      <p><strong>Fehlermeldung:</strong></p>
      <pre style="background: #f4f4f4; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px;">
${errorMessage}
      </pre>
      
      <a href="${logLink}" class="cta-button" style="background-color: #dc3545;">
        Fehler-Logs anzeigen
      </a>
      
      <p style="margin-top: 30px; color: #dc3545;">
        <strong>Sofortige Aktion erforderlich!</strong>
      </p>
    </div>
  `,
  text: `
🚨 CRITICAL: ${errorType}

Fehlertyp: ${errorType}
Zeit: ${timestamp}
Betroffene User: ${affectedUsers}

Fehlermeldung:
${errorMessage}

Logs: ${logLink}
  `.trim(),
});
```

---

## 5. E-MAIL-VERSAND-INTEGRATION

### 5.1 Resend-Integration (Edge Function)

**Datei**: `supabase/functions/_shared/email-sender.ts`

```typescript
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string; // Base64
  }>;
}

export async function sendEmail(options: SendEmailOptions) {
  const { to, subject, html, text, from, replyTo, attachments } = options;

  try {
    const response = await resend.emails.send({
      from: from || "MyDispatch <noreply@mydispatch.de>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      replyTo: replyTo || "support@mydispatch.de",
      attachments,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    console.log("[Email] Sent successfully:", response.id);
    return response;
  } catch (error) {
    console.error("[Email] Send failed:", error);
    throw error;
  }
}
```

**Verwendung**:

```typescript
import { sendEmail } from "../_shared/email-sender.ts";
import { passwordResetTemplate } from "../_shared/email-templates.ts";

const resetLink = `https://app.mydispatch.de/reset-password?token=${token}`;
const template = passwordResetTemplate(resetLink);

await sendEmail({
  to: user.email,
  subject: template.subject,
  html: template.html,
  text: template.text,
});
```

---

### 5.2 Batch-Versand (für Newsletter/Reminder)

**Datei**: `supabase/functions/send-batch-emails/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { sendEmail } from "../_shared/email-sender.ts";

serve(async (req) => {
  try {
    const { recipients, template, data } = await req.json();

    // Max. 100 E-Mails pro Batch (Resend-Limit)
    const chunks = chunkArray(recipients, 100);

    for (const chunk of chunks) {
      await Promise.all(
        chunk.map((recipient) =>
          sendEmail({
            to: recipient.email,
            subject: template.subject,
            html: template.html.replace(/\{\{name\}\}/g, recipient.name),
            text: template.text.replace(/\{\{name\}\}/g, recipient.name),
          })
        )
      );

      // Rate-Limiting: 100 E-Mails/Minute
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
```

---

## 6. TESTING & SPAM-SCORE

### 6.1 Spam-Score-Checker

**Tools**:

- [Mail-Tester.com](https://www.mail-tester.com/) - Score 10/10 anstreben
- [Litmus](https://www.litmus.com/) - Multi-Client-Testing
- [GlockApps](https://glockapps.com/) - Deliverability-Test

**Häufige Spam-Trigger** (vermeiden):

- ❌ Wörter: "FREE", "GUARANTEED", "CLICK HERE", "ACT NOW"
- ❌ Übermäßige Großbuchstaben
- ❌ Viele Ausrufezeichen (!!!)
- ❌ Rote/grelle Farben in CTA-Buttons
- ❌ Fehlende Plain-Text-Alternative
- ❌ Zu viele Links (>10)
- ❌ Kein Unsubscribe-Link (DSGVO-Pflicht!)

**Best Practices**:

- ✅ SPF/DKIM/DMARC korrekt konfigurieren
- ✅ Sender-Domain verifizieren (Resend)
- ✅ Unsubscribe-Link in jedem Template
- ✅ Plain-Text + HTML-Version
- ✅ Responsive Design (Mobile-optimiert)

---

### 6.2 Test-Workflow

**Schritt 1: Lokaler Test**

```bash
# Supabase Edge Function lokal testen
supabase functions serve send-welcome-email --env-file .env.local

# Test-Request
curl -X POST http://localhost:54321/functions/v1/send-welcome-email \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -d '{"email": "test@example.com", "name": "Max Mustermann"}'
```

**Schritt 2: Mail-Tester**

1. E-Mail an test-xxxx@mail-tester.com senden
2. Mail-Tester-Seite öffnen
3. Score analysieren (Ziel: 10/10)

**Schritt 3: Multi-Client-Test**

- Gmail (Desktop + Mobile)
- Outlook (Desktop)
- Apple Mail (macOS + iOS)

---

## 7. MEHRSPRACHIGKEIT

### 7.1 Template-Struktur mit i18n

**Datei**: `src/lib/email-templates/index.ts`

```typescript
type Locale = "de" | "en" | "fr" | "es";

interface LocalizedTemplate {
  de: EmailTemplate;
  en: EmailTemplate;
  fr?: EmailTemplate;
  es?: EmailTemplate;
}

export const passwordResetTemplates: LocalizedTemplate = {
  de: passwordResetTemplate_DE,
  en: passwordResetTemplate_EN,
};

export function getTemplate(
  templateName: keyof typeof passwordResetTemplates,
  locale: Locale = "de"
): EmailTemplate {
  const templates = passwordResetTemplates;
  return templates[locale] || templates.de; // Fallback auf Deutsch
}
```

**Verwendung**:

```typescript
import { getTemplate } from "@/lib/email-templates";

const userLocale = user.locale || "de"; // Aus Profil oder Browser-Language
const template = getTemplate("passwordReset", userLocale);
const email = template(resetLink);
```

---

### 7.2 Übersetzungs-Checkliste

**Prio 1 (Go-Live)**:

- ✅ Deutsch (vollständig)

**Prio 2 (Q1 2025)**:

- Englisch (alle Templates)

**Prio 3 (Q2 2025)**:

- Französisch (Auth + Booking)
- Spanisch (Auth + Booking)

---

## 8. DSGVO-COMPLIANCE

### 8.1 Pflicht-Elemente

**In jedem E-Mail-Template**:

1. ✅ **Unsubscribe-Link**:

```html
<p style="font-size: 12px; color: #666;">
  Sie können Ihre E-Mail-Einstellungen jederzeit ändern:
  <a href="{{unsubscribe_link}}">Benachrichtigungen verwalten</a>
</p>
```

2. ✅ **Datenschutz-Link**:

```html
<a href="https://mydispatch.de/datenschutz">Datenschutzerklärung</a>
```

3. ✅ **Impressum-Link**:

```html
<a href="https://mydispatch.de/impressum">Impressum</a>
```

4. ✅ **Kontaktdaten**:

```html
<p>
  MyDispatch GmbH | Musterstraße 123 | 12345 Musterstadt<br />
  <a href="mailto:datenschutz@mydispatch.de">datenschutz@mydispatch.de</a>
</p>
```

---

### 8.2 Einwilligungs-Management

**Datenbank-Struktur**:

```sql
CREATE TABLE email_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  company_id UUID REFERENCES companies(id),

  -- Opt-Ins
  marketing_emails BOOLEAN DEFAULT false,
  booking_notifications BOOLEAN DEFAULT true,
  payment_reminders BOOLEAN DEFAULT true,
  document_alerts BOOLEAN DEFAULT true,
  partner_notifications BOOLEAN DEFAULT false,

  -- Audit
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Check vor E-Mail-Versand**:

```typescript
const { data: prefs } = await supabase
  .from("email_preferences")
  .select("booking_notifications")
  .eq("user_id", userId)
  .single();

if (!prefs?.booking_notifications) {
  console.log("[Email] User opted out of booking notifications");
  return; // Keine E-Mail senden
}
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Template-Cleanup (2h)

- [ ] Alle bestehenden Templates auf Base-Template migrieren
- [ ] `import.meta.env` durch Funktionsparameter ersetzen
- [ ] Plain-Text-Alternative für alle Templates
- [ ] Spam-Score-Tests (Ziel: 10/10)

### Phase 2: Fehlende Templates (4h)

- [ ] `emailVerificationTemplate` (AUTH-03)
- [ ] `bookingReminderTemplate` (BOOKING-02)
- [ ] `bookingCancellationTemplate` (BOOKING-03)
- [ ] `driverAssignedTemplate` (BOOKING-04)
- [ ] `invoiceEmailTemplate` (INVOICE-01)
- [ ] `paymentConfirmationTemplate` (INVOICE-02)
- [ ] `paymentReminder1/2/3Template` (INVOICE-03/04/05)
- [ ] `criticalErrorTemplate` (ADMIN-01)

### Phase 3: Edge Functions (3h)

- [ ] `_shared/email-sender.ts` - Zentrale Resend-Integration
- [ ] `_shared/email-templates.ts` - Alle Templates
- [ ] `send-batch-emails/` - Batch-Versand
- [ ] Error-Handling & Retry-Logik

### Phase 4: DSGVO & Testing (2h)

- [ ] `email_preferences` Tabelle + RLS
- [ ] Opt-Out-Check in allen Edge Functions
- [ ] Unsubscribe-Link-Handler
- [ ] Multi-Client-Tests (Gmail, Outlook, Apple Mail)

---

**Total Effort**: ~11 Stunden

**Dependencies**:

- ✅ Resend API Key konfiguriert
- ✅ Domain verifiziert (mydispatch.de)
- ✅ SPF/DKIM/DMARC-Records gesetzt

**Testing-Strategy**:

1. Unit-Tests für Template-Rendering
2. E2E-Tests für E-Mail-Versand
3. Spam-Score-Tests (Mail-Tester)
4. DSGVO-Compliance-Audit

---

**Version**: 18.5.0 | **Status**: ✅ READY FOR IMPLEMENTATION
