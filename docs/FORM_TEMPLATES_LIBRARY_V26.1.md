# FORM TEMPLATES LIBRARY V26.1

> **Version:** 26.1.0  
> **Letzte Aktualisierung:** 2025-01-26  
> **Status:** DOKUMENTIERT - READY FOR REDESIGN

---

## 🎯 ÜBERSICHT

Alle existierenden Forms/Dialogs wurden dokumentiert und als Templates für die V26.1 Hero-Qualität-Migration vorbereitet.

**WICHTIG:** Bevor ein Form visuell angepasst wird, MUSS es hier dokumentiert sein!

---

## 📋 EXISTIERENDE FORMS

### 1. **FormDialog** (Base Component)

**Pfad:** `src/components/dialogs/FormDialog.tsx`  
**Typ:** Generic Form Dialog Base  
**Verwendung:** Basis für alle anderen Form Dialogs

#### Struktur:

```typescript
interface FormDialogProps<TFormValues> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  form: UseFormReturn<TFormValues>;
  onSubmit: (data: TFormValues) => void | Promise<void>;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  resetOnClose?: boolean;
  closeOnSubmit?: boolean;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}
```

#### Features:

- ✅ React Hook Form Integration
- ✅ Auto-Reset on Close
- ✅ Loading States
- ✅ Size Variants
- ✅ Custom Submit/Cancel Labels

#### Felder: KEINE (Container Only)

---

### 2. **InvoiceFormDialog**

**Pfad:** `src/components/invoices/InvoiceFormDialog.tsx`  
**Typ:** Rechnung erstellen  
**Verwendung:** Neue Rechnung anlegen

#### Struktur:

```typescript
interface InvoiceFormData {
  customer_id: string;
  amount: string;
  due_date: string;
  description: string;
  invoice_number: string;
  payment_method: "bar" | "rechnung" | "ec_karte" | "kreditkarte";
}
```

#### Felder (NIEMALS ENTFERNEN):

1. **Kunde** (customer_id) - Pflichtfeld, Dropdown mit Kunden
2. **Rechnungsnummer** (invoice_number) - Auto-generiert, editierbar
3. **Betrag** (amount) - Pflichtfeld, Euro
4. **Fälligkeitsdatum** (due_date) - Pflichtfeld, Date Picker
5. **Beschreibung** (description) - Optional, Textarea
6. **Zahlungsmethode** (payment_method) - Pflichtfeld, Dropdown

#### Features:

- ✅ Inline Customer Creation
- ✅ Auto-Generated Invoice Number
- ✅ Payment Method Selection
- ✅ Due Date Picker

---

### 3. **MobileFormDialog**

**Pfad:** `src/components/mobile/MobileFormDialog.tsx`  
**Typ:** Mobile-Optimierter Form Dialog  
**Verwendung:** Forms auf Mobile Devices

#### Struktur:

```typescript
interface MobileFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  className?: string;
}
```

#### Features:

- ✅ Full-Screen auf Mobile
- ✅ Scroll Area für lange Forms
- ✅ Touch-Optimierte Buttons
- ✅ Close Button (X)

#### Felder: KEINE (Container Only)

---

### 4. **V26NewBookingDialog**

**Pfad:** `src/components/dashboard/V26NewBookingDialog.tsx`  
**Typ:** Neuer Auftrag  
**Verwendung:** Schnell-Buchung vom Dashboard

#### Struktur:

```typescript
// Muss noch dokumentiert werden - Form existiert aber
```

#### Felder (zu dokumentieren):

- Abholadresse
- Zieladresse
- Abholzeit
- Kunde
- Fahrzeug/Fahrer
- Preis
- Notizen

---

## 🎨 V26.1 HERO-QUALITÄT MIGRATION PLAN

### Phase 1: UI-Elemente erstellen (✅ DONE)

- [x] V26PerformanceBadge
- [x] V26IconBox (existiert bereits)
- [x] Dashboard Hero-Qualität

### Phase 2: Form-Komponenten (TODO)

- [ ] V26FormDialog (Base mit Glassmorphism)
- [ ] V26FormField (Mit Icon-Box Support)
- [ ] V26FormInput (Premium Inputs)
- [ ] V26FormSelect (Premium Dropdowns)
- [ ] V26FormTextarea (Premium Textareas)

### Phase 3: Spezifische Forms Migrieren (TODO)

- [ ] InvoiceFormDialog → V26InvoiceFormDialog
- [ ] V26NewBookingDialog optimieren
- [ ] Weitere Forms identifizieren und migrieren

---

## 📝 MIGRATION RULES

### Vor Migration eines Forms:

1. ✅ Form in dieser Datei dokumentieren
2. ✅ Alle Felder auflisten (NIEMALS ENTFERNEN!)
3. ✅ Validierungsregeln notieren
4. ✅ Dependencies prüfen

### Während Migration:

1. ✅ Alle Felder beibehalten (nur Design ändern!)
2. ✅ V26IconBox für Icons verwenden
3. ✅ V26PerformanceBadge für Status/Trends
4. ✅ KERNFARBEN konsequent nutzen
5. ✅ Glassmorphism & Glow Effects

### Nach Migration:

1. ✅ Alten Form-Code auskommentieren (NICHT LÖSCHEN!)
2. ✅ Library-Eintrag erstellen
3. ✅ Dokumentation aktualisieren

---

## 🚨 KRITISCHE REGELN

1. **NIEMALS Felder aus Forms entfernen** - nur Design ändern!
2. **IMMER dokumentieren vor Migration**
3. **NIEMALS direkt alte Forms löschen** - erst auskommentieren
4. **IMMER V26.1 Design Tokens verwenden**
5. **IMMER alte Funktionalität beibehalten**

---

**Dokumentation:** Diese Datei ist die Single Source of Truth für alle Forms in MyDispatch.
