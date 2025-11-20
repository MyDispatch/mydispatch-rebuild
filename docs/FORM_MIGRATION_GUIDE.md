# 📝 FORM MIGRATION GUIDE - V26 → UnifiedForm V2.0

## ✅ PHASE 1.1 COMPLETE

**Status:** Form-Registry erstellt, UnifiedForm V2.0 deployed

**Neue Files:**

- ✅ `src/config/form-fields-registry.ts` - Zentrale Field-Definitionen
- ✅ `src/components/forms/UnifiedForm.tsx` (V2.0) - Dialog-Support integriert

---

## 🎯 MIGRATION WORKFLOW

### **ALT (FormDialog):**

```typescript
import { FormDialog } from '@/components/dialogs/FormDialog';

<FormDialog
  open={open}
  onOpenChange={setOpen}
  title="Neuer Kunde"
  form={form}
  onSubmit={handleSubmit}
>
  <FormField name="first_name" label="Vorname" />
  <FormField name="last_name" label="Nachname" />
  <FormField name="email" label="E-Mail" />
</FormDialog>
```

### **NEU (UnifiedForm mit Dialog-Mode):**

```typescript
import { UnifiedForm } from '@/components/forms/UnifiedForm';
import { CUSTOMER_FIELDS } from '@/config/form-fields-registry';

<UnifiedForm
  mode="dialog"
  dialogOpen={open}
  onDialogOpenChange={setOpen}
  dialogTitle="Neuer Kunde"
  form={form}
  fields={[
    CUSTOMER_FIELDS.firstName,
    CUSTOMER_FIELDS.lastName,
    CUSTOMER_FIELDS.email,
    CUSTOMER_FIELDS.phone,
  ]}
  onSubmit={handleSubmit}
  resetOnSuccess
  closeOnSuccess
/>
```

**Benefits:**

- ✅ **1 Component** statt 2 (FormDialog + Form)
- ✅ **Type-Safe Fields** aus Registry
- ✅ **Zentrale Field-Definitionen** (Labels ändern → überall updated)
- ✅ **Weniger Code** (~40% Reduktion)

---

## 📚 FIELD REGISTRY USAGE

### **Option 1: Alle Fields eines Entity**

```typescript
import { getFieldSet } from '@/config/form-fields-registry';

<UnifiedForm
  fields={getFieldSet('customer')} // Alle Customer-Fields
  form={form}
  onSubmit={handleSubmit}
/>
```

### **Option 2: Selektive Fields**

```typescript
import { CUSTOMER_FIELDS } from '@/config/form-fields-registry';

<UnifiedForm
  fields={[
    CUSTOMER_FIELDS.firstName,
    CUSTOMER_FIELDS.lastName,
    CUSTOMER_FIELDS.email,
    // Nur diese 3!
  ]}
  form={form}
  onSubmit={handleSubmit}
/>
```

### **Option 3: Fields modifizieren**

```typescript
<UnifiedForm
  fields={[
    { ...CUSTOMER_FIELDS.email, placeholder: 'Ihre E-Mail-Adresse' },
    { ...CUSTOMER_FIELDS.phone, required: false }, // Required überschreiben
  ]}
  form={form}
  onSubmit={handleSubmit}
/>
```

---

## 🔄 MIGRATION CHECKLIST

### **Files zu LÖSCHEN nach Migration:**

- [ ] `src/components/dialogs/FormDialog.tsx`
- [ ] `src/components/mobile/MobileFormDialog.tsx`
- [ ] `src/components/invoices/InvoiceFormDialog.tsx`

### **Pages zu MIGRIEREN:**

- [ ] Auftraege.tsx (Booking Form)
- [ ] Kunden.tsx (Customer Form)
- [ ] Fahrer.tsx (Driver Form)
- [ ] Fahrzeuge.tsx (Vehicle Form)
- [ ] Rechnungen.tsx (Invoice Form)
- [ ] ... (weitere 10+ Pages)

---

## 🎨 DIALOG-MODE FEATURES

### **Sizes:**

```typescript
dialogSize = "sm"; // 425px (small dialogs, confirmations)
dialogSize = "md"; // 600px (standard forms)
dialogSize = "lg"; // 800px (default, most forms)
dialogSize = "xl"; // 1000px (complex forms)
dialogSize = "full"; // 95vw (fullscreen forms)
```

### **Auto-Close & Reset:**

```typescript
<UnifiedForm
  mode="dialog"
  resetOnSuccess={true}  // Form nach Submit zurücksetzen
  closeOnSuccess={true}  // Dialog nach Submit schließen
  // ...
/>
```

### **Multi-Step Forms:**

```typescript
<UnifiedForm
  showProgress
  multiStep={{
    currentStep: 1,
    totalSteps: 3,
    onStepChange: (step) => console.log('Step:', step),
  }}
  // ...
/>
```

---

## 📊 MIGRATION PROGRESS

**Phase 1.1:** ✅ **COMPLETE** (Form-Registry + UnifiedForm V2.0)  
**Phase 1.2:** ⏳ **TODO** (Migration aller Forms)  
**Phase 1.3:** ⏳ **TODO** (Alte Files löschen)

**Estimated Time:** 1-2h für alle Form-Migrationen

---

**LAST UPDATE:** 2025-10-29  
**VERSION:** V2.0.0
