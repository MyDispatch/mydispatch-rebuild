# 📋 FORM FIELDS REGISTRY - USAGE GUIDE

**Version:** 1.0  
**Datum:** 2025-10-29  
**Status:** ✅ ACTIVE

---

## 🎯 ZWECK

Zentrale Definition aller Form-Fields im System.

**REGEL:**
- ✅ **1× Field-Definition, 100× Nutzung**
- ❌ **KEINE Duplikate**
- ✅ **Type-Safe mit Zod**
- ✅ **Konsistente Validierung**

---

## 📦 VERFÜGBARE KATEGORIEN

```typescript
import { FORM_FIELDS_REGISTRY } from '@/config/form-fields-registry';

// Kategorien:
FORM_FIELDS_REGISTRY.booking   // Auftrags-Fields
FORM_FIELDS_REGISTRY.customer  // Kunden-Fields
FORM_FIELDS_REGISTRY.driver    // Fahrer-Fields
FORM_FIELDS_REGISTRY.vehicle   // Fahrzeug-Fields
FORM_FIELDS_REGISTRY.invoice   // Rechnungs-Fields
```

---

## 🔧 USAGE MIT UNIFIED FORM

### Beispiel 1: Neuer Auftrag

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FORM_FIELDS_REGISTRY, buildZodSchema } from '@/config/form-fields-registry';
import { UnifiedForm } from '@/components/forms/UnifiedForm';

const BookingForm = () => {
  // Fields auswählen
  const fields = [
    FORM_FIELDS_REGISTRY.booking.customer,
    FORM_FIELDS_REGISTRY.booking.pickupAddress,
    FORM_FIELDS_REGISTRY.booking.dropoffAddress,
    FORM_FIELDS_REGISTRY.booking.pickupDate,
    FORM_FIELDS_REGISTRY.booking.pickupTime,
    FORM_FIELDS_REGISTRY.booking.passengers,
    FORM_FIELDS_REGISTRY.booking.notes,
  ];

  // Zod Schema automatisch generieren
  const schema = buildZodSchema(fields);

  // Form Setup
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      customer_id: '',
      pickup_address: '',
      dropoff_address: '',
      pickup_date: '',
      pickup_time: '',
      passengers: 1,
      notes: '',
    },
  });

  const handleSubmit = async (data: any) => {
    // Submit Logic
    console.log('Booking Data:', data);
  };

  return (
    <UnifiedForm
      form={form}
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Auftrag erstellen"
    />
  );
};
```

---

### Beispiel 2: Neuer Kunde

```typescript
const CustomerForm = () => {
  const fields = [
    FORM_FIELDS_REGISTRY.customer.firstName,
    FORM_FIELDS_REGISTRY.customer.lastName,
    FORM_FIELDS_REGISTRY.customer.email,
    FORM_FIELDS_REGISTRY.customer.phone,
    FORM_FIELDS_REGISTRY.customer.address,
    FORM_FIELDS_REGISTRY.customer.city,
    FORM_FIELDS_REGISTRY.customer.postalCode,
    FORM_FIELDS_REGISTRY.customer.portalAccess,
  ];

  const schema = buildZodSchema(fields);
  const form = useForm({ resolver: zodResolver(schema) });

  return (
    <UnifiedForm
      form={form}
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel="Kunde anlegen"
    />
  );
};
```

---

## 🛠️ HELPER FUNCTIONS

### getFieldsForCategory

```typescript
import { getFieldsForCategory } from '@/config/form-fields-registry';

// Alle Fields einer Kategorie
const bookingFields = getFieldsForCategory('booking');
const customerFields = getFieldsForCategory('customer');
```

---

### getField

```typescript
import { getField } from '@/config/form-fields-registry';

// Einzelnes Field
const emailField = getField('customer', 'email');
const pickupDateField = getField('booking', 'pickupDate');
```

---

### buildZodSchema

```typescript
import { buildZodSchema, FORM_FIELDS_REGISTRY } from '@/config/form-fields-registry';

const fields = [
  FORM_FIELDS_REGISTRY.customer.firstName,
  FORM_FIELDS_REGISTRY.customer.lastName,
  FORM_FIELDS_REGISTRY.customer.email,
];

// Automatisch Zod Schema generieren
const schema = buildZodSchema(fields);

// Schema nutzen
const form = useForm({
  resolver: zodResolver(schema),
});
```

---

## 📝 FIELD TYPES

### Unterstützte Typen:

| Type | Description | Example |
|------|-------------|---------|
| `text` | Text Input | Name, Adresse |
| `email` | Email Input | E-Mail |
| `password` | Password Input | Passwort |
| `number` | Number Input | Preis, Anzahl |
| `tel` | Phone Input | Telefon |
| `url` | URL Input | Website |
| `textarea` | Multi-Line Text | Notizen |
| `select` | Dropdown | Kunde, Status |
| `checkbox` | Checkbox | Portal-Zugang |
| `radio` | Radio Buttons | Zahlungsart |
| `date` | Date Picker | Datum |
| `time` | Time Picker | Uhrzeit |
| `datetime` | DateTime Picker | Datum + Zeit |
| `file` | File Upload | Dokument |
| `status` | Status Select | Status (mit Ampel) |

---

## 🎨 CUSTOM FIELDS

### Neues Field hinzufügen:

```typescript
// In form-fields-registry.ts

export const BOOKING_FIELDS = {
  // Bestehende Fields...
  
  // NEU: Flight Number
  flightNumber: {
    name: 'flight_number',
    label: 'Flugnummer (optional)',
    type: 'text' as const,
    placeholder: 'LH1234',
    required: false,
    validation: z.string().regex(/^[A-Z]{2}\d{1,4}$/, 'Ungültige Flugnummer').optional(),
  },
} as const;
```

---

## ✅ BENEFITS

### 1. **Single Source of Truth**
- Alle Fields zentral definiert
- Keine Duplikate
- Konsistente Labels

### 2. **Type-Safe**
- TypeScript Autocomplete
- Compile-Time Checks
- Zod Runtime Validation

### 3. **Wiederverwendbarkeit**
- 1× Definition → 100× Nutzung
- Änderungen propagieren automatisch
- Weniger Code

### 4. **Konsistenz**
- Gleiche Validierung überall
- Gleiche Labels
- Gleiche Placeholders
- Gleiche Fehlermeldungen

### 5. **Wartbarkeit**
- Zentrale Änderungen
- Einfache Erweiterung
- Klare Struktur

---

## 🚨 RULES

### ❌ VERBOTEN:

```typescript
// FALSCH: Inline Field-Definition
<FormField
  name="email"
  label="E-Mail"
  type="email"
  // ... hardcoded fields
/>
```

### ✅ RICHTIG:

```typescript
// RICHTIG: Aus Registry
import { FORM_FIELDS_REGISTRY } from '@/config/form-fields-registry';

const fields = [
  FORM_FIELDS_REGISTRY.customer.email,
];
```

---

## 📊 STATISTICS

**Anzahl definierter Fields:**
- Booking: 13 Fields
- Customer: 11 Fields
- Driver: 10 Fields
- Vehicle: 9 Fields
- Invoice: 9 Fields

**Total:** 52 zentral verwaltete Form-Fields

---

## 🔄 MIGRATION

### Alte Forms migrieren:

**Vorher:**
```typescript
// Hardcoded Fields
<Input
  name="firstName"
  label="Vorname"
  placeholder="Max"
  required
/>
```

**Nachher:**
```typescript
// Aus Registry
import { FORM_FIELDS_REGISTRY } from '@/config/form-fields-registry';

const fields = [
  FORM_FIELDS_REGISTRY.customer.firstName,
];

<UnifiedForm form={form} fields={fields} onSubmit={handleSubmit} />
```

---

## 📚 NEXT STEPS

1. **Alle bestehenden Forms migrieren**
2. **Hardcoded Fields entfernen**
3. **ESLint Rule hinzufügen** (enforce Registry usage)
4. **Tests schreiben**

---

**Status:** ✅ PRODUCTION READY  
**Last Update:** 2025-10-29
