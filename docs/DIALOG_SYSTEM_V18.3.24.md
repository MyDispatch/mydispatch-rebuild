# MyDispatch Dialog-System V18.3.24

**Status:** ✅ AKTIV - Systemweit verpflichtend  
**Datum:** 21.10.2025  
**Version:** V18.3.24

---

## 🎯 ZIELSETZUNG

Zentrales, wiederverwendbares Dialog-System mit:

- ✅ MyDispatch Design System
- ✅ Responsive (Mobile-optimiert)
- ✅ Type-Safe Props
- ✅ Accessibility (ARIA)
- ✅ Loading-States
- ✅ Form-Integration

---

## 📦 KOMPONENTEN

### 1. UnifiedDialog (Basis-Dialog)

Universeller Dialog für alle Anwendungsfälle:

```tsx
import { UnifiedDialog } from "@/components/dialogs/UnifiedDialog";
import { useState } from "react";

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <UnifiedDialog
      open={open}
      onOpenChange={setOpen}
      title="Dialog-Titel"
      description="Optional: Beschreibung"
      size="md" // sm | md | lg | xl | full
      primaryAction={{
        label: "Speichern",
        onClick: async () => {
          // Async action möglich
          await saveData();
          setOpen(false);
        },
        variant: "default", // default | destructive
        disabled: false,
      }}
      secondaryAction={{
        label: "Abbrechen",
        onClick: () => setOpen(false),
      }}
      isLoading={false}
      loadingText="Wird verarbeitet..."
      closeOnOutsideClick={true}
      showCloseButton={true}
    >
      {/* Dialog Content */}
      <div className="space-y-4">
        <p>Dialog-Inhalt hier</p>
      </div>
    </UnifiedDialog>
  );
}
```

**Features:**

- ✅ Flexible Größen (sm bis full)
- ✅ Primary/Secondary Actions
- ✅ Loading-State (disabled + Spinner)
- ✅ Custom Close-Button
- ✅ Outside-Click-Control

### 2. FormDialog (Formular-Dialog)

Optimiert für `react-hook-form`:

```tsx
import { FormDialog } from "@/components/dialogs/FormDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  email: z.string().email("Ungültige E-Mail"),
});

type FormData = z.infer<typeof schema>;

function MyFormDialog() {
  const [open, setOpen] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  });

  const handleSubmit = async (data: FormData) => {
    // API-Call
    await createCustomer(data);
    toast.success("Kunde erstellt");
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      title="Neuer Kunde"
      description="Kundendaten eingeben"
      form={form}
      onSubmit={handleSubmit}
      submitLabel="Kunde erstellen"
      cancelLabel="Abbrechen"
      resetOnClose={true}
      closeOnSubmit={true}
      size="lg"
    >
      {/* Form Fields */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Max Mustermann" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="max@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormDialog>
  );
}
```

**Features:**

- ✅ Automatisches Form-Handling
- ✅ Submit mit Loading-State
- ✅ Auto-Close on Success
- ✅ Auto-Reset on Close
- ✅ Error-Handling

### 3. ConfirmDialog (Bestätigungs-Dialog)

Einfacher Confirm-Dialog:

```tsx
import { ConfirmDialog } from "@/components/dialogs/UnifiedDialog";

function DeleteButton() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    await deleteItem(itemId);
    toast.success("Gelöscht");
    setShowConfirm(false);
  };

  return (
    <>
      <Button onClick={() => setShowConfirm(true)} variant="destructive">
        Löschen
      </Button>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Eintrag löschen?"
        description="Diese Aktion kann nicht rückgängig gemacht werden."
        confirmLabel="Ja, löschen"
        cancelLabel="Abbrechen"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </>
  );
}
```

---

## 🎨 DESIGN-SPEZIFIKATIONEN

### Größen

```typescript
size = "sm"; // 384px (max-w-sm)  - Kleine Dialogs, Confirms
size = "md"; // 448px (max-w-md)  - Standard (Default)
size = "lg"; // 512px (max-w-lg)  - Formulare
size = "xl"; // 576px (max-w-xl)  - Große Forms, Details
size = "full"; // 100% (max-w-full) - Mobile Fullscreen
```

### Farben (CI-konform)

```tsx
// Title
className = "text-xl font-semibold text-foreground";

// Description
className = "text-sm text-muted-foreground";

// Primary Button
variant = "default"; // bg-accent (Gold)
variant = "destructive"; // bg-status-error (Rot)

// Secondary Button
variant = "outline"; // Border-only
```

### Spacing

```tsx
// Header
className = "relative";

// Content
className = "py-4";

// Footer
className = "flex flex-col sm:flex-row gap-2 sm:gap-3";
```

---

## 📱 RESPONSIVE VERHALTEN

### Desktop (≥768px)

```tsx
// Footer: Horizontal Layout
<DialogFooter className="flex flex-row gap-3">
  <Button variant="outline">Abbrechen</Button>
  <Button>Speichern</Button>
</DialogFooter>
```

### Mobile (<768px)

```tsx
// Footer: Vertical Stack
<DialogFooter className="flex flex-col gap-2">
  <Button className="w-full">Speichern</Button>
  <Button variant="outline" className="w-full">
    Abbrechen
  </Button>
</DialogFooter>;

// Buttons: Full-Width
className = "w-full sm:w-auto";
```

---

## 🔒 ACCESSIBILITY

### ARIA-Attribute

```tsx
// Close Button
aria-label="Dialog schließen"

// Loading State
aria-busy={isLoading}
aria-live="polite"

// Form Elements
aria-describedby={errorId}
aria-invalid={hasError}
```

### Keyboard Navigation

- **ESC** - Dialog schließen (wenn nicht loading)
- **TAB** - Durch Felder navigieren
- **ENTER** - Submit (in Forms)

---

## 🚀 ADVANCED PATTERNS

### Multi-Step Form Dialog

```tsx
function MultiStepDialog() {
  const [step, setStep] = useState(1);
  const form = useForm();

  return (
    <FormDialog
      title={`Schritt ${step} von 3`}
      form={form}
      onSubmit={(data) => {
        if (step < 3) {
          setStep(step + 1);
        } else {
          // Final submit
          createBooking(data);
        }
      }}
      submitLabel={step < 3 ? "Weiter" : "Abschließen"}
    >
      {step === 1 && <Step1Fields />}
      {step === 2 && <Step2Fields />}
      {step === 3 && <Step3Fields />}
    </FormDialog>
  );
}
```

### Dialog mit Custom Footer

```tsx
<UnifiedDialog
  // ... props
  primaryAction={undefined} // Disable default footer
  secondaryAction={undefined}
>
  {/* Content */}
  <div>...</div>

  {/* Custom Footer */}
  <div className="flex justify-between mt-4">
    <Button variant="ghost">Link 1</Button>
    <div className="flex gap-2">
      <Button variant="outline">Abbrechen</Button>
      <Button>Speichern</Button>
    </div>
  </div>
</UnifiedDialog>
```

### Nested Dialogs (Vermeiden!)

```tsx
// ❌ NICHT EMPFOHLEN
<Dialog1>
  <Dialog2> {/* Nested */}</Dialog2>
</Dialog1>;

// ✅ BESSER: Sequential
const [dialog1Open, setDialog1Open] = useState(false);
const [dialog2Open, setDialog2Open] = useState(false);

// Close Dialog1, then open Dialog2
setDialog1Open(false);
setTimeout(() => setDialog2Open(true), 100);
```

---

## ✅ MIGRATION ALTER DIALOGS

### ALT: Custom Dialog

```tsx
// ❌ ALT (viel Boilerplate)
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titel</DialogTitle>
    </DialogHeader>
    <div>Content</div>
    <DialogFooter>
      <Button onClick={() => setOpen(false)}>Abbrechen</Button>
      <Button onClick={handleSave}>Speichern</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### NEU: UnifiedDialog

```tsx
// ✅ NEU (weniger Code, mehr Features)
<UnifiedDialog
  open={open}
  onOpenChange={setOpen}
  title="Titel"
  primaryAction={{ label: "Speichern", onClick: handleSave }}
  secondaryAction={{ label: "Abbrechen", onClick: () => setOpen(false) }}
>
  <div>Content</div>
</UnifiedDialog>
```

---

## 🎓 BEST PRACTICES

### DO ✅

```tsx
// Use TypeScript Generics
<FormDialog<MyFormData>
  form={form}
  onSubmit={handleSubmit}
>

// Loading States
primaryAction={{
  onClick: async () => {
    setLoading(true);
    await saveData();
    setLoading(false);
  }
}}

// Controlled State
const [open, setOpen] = useState(false);

// Reset on Close
resetOnClose={true}
```

### DON'T ❌

```tsx
// Keine uncontrolled Dialogs
<Dialog defaultOpen={true} />  // Falsch!

// Keine nested Dialogs
<Dialog><Dialog /></Dialog>

// Keine magischen Größen
className="w-[456px]"  // Use size prop!

// Keine Inline-Actions
<Button onClick={async () => {
  // Long inline code
}}>

// Kein Form ohne FormDialog
<UnifiedDialog>
  <form onSubmit={...}>  // Use FormDialog!
</UnifiedDialog>
```

---

## 📊 VERWENDUNGS-MATRIX

| Use Case           | Component     | Size | Props          |
| ------------------ | ------------- | ---- | -------------- |
| Einfache Nachricht | UnifiedDialog | sm   | -              |
| Bestätigung        | ConfirmDialog | sm   | variant        |
| Formular (klein)   | FormDialog    | lg   | form, onSubmit |
| Formular (groß)    | FormDialog    | xl   | form, onSubmit |
| Details anzeigen   | UnifiedDialog | lg   | -              |
| Multi-Step Form    | FormDialog    | xl   | step state     |

---

## 🔍 TROUBLESHOOTING

### Problem: Dialog schließt nicht

```tsx
// ❌ Falsch: Keine State-Kontrolle
<UnifiedDialog open={true} />;

// ✅ Richtig: Controlled State
const [open, setOpen] = useState(false);
<UnifiedDialog open={open} onOpenChange={setOpen} />;
```

### Problem: Form submitted nicht

```tsx
// ❌ Falsch: Kein onSubmit
<FormDialog form={form} />

// ✅ Richtig: onSubmit definieren
<FormDialog
  form={form}
  onSubmit={async (data) => {
    await api.create(data);
  }}
/>
```

### Problem: Loading-State zeigt nicht

```tsx
// ❌ Falsch: isLoading nicht gesetzt
<UnifiedDialog isLoading={false} />;

// ✅ Richtig: State tracken
const [loading, setLoading] = useState(false);
<UnifiedDialog isLoading={loading} />;
```

---

## 📞 SUPPORT

Bei Fragen:

- Dokumentation: `docs/DIALOG_SYSTEM_V18.3.24.md`
- Code: `src/components/dialogs/`
- Shadcn: `src/components/ui/dialog.tsx`

---

**NIEMALS ALTE DIALOG-PATTERNS VERWENDEN - NUR UNIFIED-SYSTEM!**
