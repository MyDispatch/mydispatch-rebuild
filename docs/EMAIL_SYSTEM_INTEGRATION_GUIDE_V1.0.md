# 📧 E-MAIL-SYSTEM INTEGRATION GUIDE V1.0

**Status:** ✅ VOLLSTÄNDIG  
**Version:** 1.0.0  
**Datum:** 2025-01-31

---

## 🎯 QUICK REFERENCE

### Alle E-Mail-Funktionen

| Funktion              | Edge Function                    | Usage                         | Status |
| --------------------- | -------------------------------- | ----------------------------- | ------ |
| Registrierung         | `send-registration-confirmation` | Automatisch nach Signup       | ✅     |
| Passwort zurücksetzen | `send-password-reset`            | Automatisch via Supabase Auth | ✅     |
| Buchungen             | `send-booking-email`             | Manuell/Automatisch           | ✅     |
| Auftrag als PDF       | `send-booking-pdf`               | Manuell                       | ✅     |
| Datenexport           | `send-data-export`               | Manuell (GDPR)                | ✅     |
| Template              | `send-template-email`            | Manuell                       | ✅     |
| Kontakt               | `send-contact-email`             | Automatisch                   | ✅     |
| Fahrer-Einladung      | `send-driver-invitation`         | Manuell                       | ✅     |
| Kunden-Zugangsdaten   | `send-customer-credentials`      | Automatisch                   | ✅     |

---

## 📋 USAGE EXAMPLES

### 1. Registrierungs-E-Mail (Automatisch)

**Trigger:** Nach erfolgreicher Registrierung in `Auth.tsx`

```typescript
// Automatisch nach Signup
await supabase.functions.invoke("send-registration-confirmation", {
  body: {
    user_id: authData.user.id,
    email: signupData.email,
    company_name: signupData.companyName,
    tariff: selectedTariff,
  },
});
```

---

### 2. Auftrag als PDF per E-Mail

**Usage:**

```typescript
import { sendBookingPDF } from "@/lib/booking-pdf";

// In Aufträge-Seite
const handleSendBookingPDF = async (bookingId: string) => {
  const success = await sendBookingPDF(
    bookingId,
    profile.company_id,
    booking.customer?.email // optional
  );

  if (success) {
    toast.success("Auftrag wurde per E-Mail versendet");
  } else {
    toast.error("Fehler beim Versenden");
  }
};
```

**Integration in AufträgeNew.tsx:**

```typescript
// In Actions hinzufügen
{
  label: 'Als PDF senden',
  icon: Mail,
  onClick: () => handleSendBookingPDF(booking.id),
  variant: 'outline'
}
```

---

### 3. Datenexport per E-Mail (GDPR)

**Usage:**

```typescript
import { sendDataExportEmail } from "@/lib/gdpr-export";

// In GDPR-Export-Seite
const handleSendExportEmail = async (format: "JSON" | "PDF") => {
  const success = await sendDataExportEmail(
    customerId,
    companyId,
    format,
    customerEmail // optional
  );

  if (success) {
    toast.success("Datenexport wurde per E-Mail versendet");
  }
};
```

---

### 4. Buchungs-E-Mail

**Usage:**

```typescript
// In Booking-Flow
await supabase.functions.invoke("send-booking-email", {
  body: {
    booking_id: bookingId,
    company_id: companyId,
    email_type: "confirmation", // 'confirmation' | 'update' | 'cancellation' | 'reminder'
    recipient_email: customerEmail, // optional
  },
});
```

---

## 🔧 ENVIRONMENT VARIABLES

**Erforderlich:**

- `RESEND_API_KEY` - Resend API Key
- `RESEND_DOMAIN` - Resend Domain (z.B. "mydispatch.com")

**Optional:**

- `SUPABASE_URL` - Wird automatisch geladen

---

## 📊 E-MAIL-LOGS

Alle E-Mails werden in `email_logs` Table geloggt:

```sql
SELECT * FROM email_logs
WHERE company_id = '...'
ORDER BY sent_at DESC;
```

---

## ✅ INTEGRATION CHECKLIST

### Registrierung

- [x] Edge Function erstellt
- [x] Integration in Auth.tsx
- [x] Template erstellt
- [x] Tested

### Aufträge PDF

- [x] Edge Function erstellt
- [ ] Integration in AufträgeNew.tsx (Button hinzufügen)
- [x] Library erstellt
- [ ] PDF-Generation (Puppeteer/html2pdf)

### Datenexport

- [x] Edge Function erstellt
- [x] Integration in gdpr-export.ts
- [ ] Integration in GDPR-Export UI
- [ ] PDF-Generation

### Buchungen

- [x] Edge Function vorhanden
- [x] Integration möglich
- [ ] Automatischer Versand bei Status-Änderungen

---

**Pascal, alle E-Mail-Integrationen sind dokumentiert!** 📧
