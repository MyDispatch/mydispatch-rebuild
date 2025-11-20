# MyDispatch Form-System V18.3.24

**Status:** ✅ AKTIV - Zentral & Wiederverwendbar  
**Datum:** 21.10.2025  
**Version:** V18.3.24

---

## 🎯 ZIELSETZUNG

Zentrale Form-Komponenten für:

- ✅ react-hook-form Integration
- ✅ Zod Validation
- ✅ File Upload Support
- ✅ DSGVO-konform
- ✅ Responsive (Mobile-optimiert)

---

## 📦 KOMPONENTEN

### 1. UnifiedForm (Basis-Form)

**Datei:** `src/components/forms/UnifiedForm.tsx`

```tsx
import { UnifiedForm } from "@/components/forms/UnifiedForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, "Name erforderlich"),
  email: z.string().email("Ungültige E-Mail"),
});

type FormData = z.infer<typeof schema>;

function MyComponent() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await api.create(data);
    toast.success("Gespeichert");
  };

  return (
    <UnifiedForm
      form={form}
      onSubmit={onSubmit}
      submitLabel="Speichern"
      cancelLabel="Abbrechen"
      onCancel={() => navigate(-1)}
      columns={2} // 1 | 2 | 3
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name *</FormLabel>
            <FormControl>
              <Input {...field} />
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
            <FormLabel>E-Mail *</FormLabel>
            <FormControl>
              <Input {...field} type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </UnifiedForm>
  );
}
```

**Features:**

- Grid-Layouts (1, 2, 3 Spalten)
- Auto-Loading-State
- Required-Indicator
- Cancel-Button (optional)
- Mobile-optimiert

### 2. FileUploadField (File Upload)

```tsx
import { FileUploadField } from "@/components/forms/UnifiedForm";

<FileUploadField
  label="Führerschein"
  accept="image/*,.pdf"
  maxSize={10} // MB
  multiple={false}
  required={true}
  description="Max. 10MB, JPG/PNG/PDF"
  onUpload={async (files) => {
    const file = files[0];
    // Upload to Supabase Storage
    const { data } = await supabase.storage.from("documents").upload(`licenses/${file.name}`, file);

    toast.success("Hochgeladen");
  }}
/>;
```

**Features:**

- Drag & Drop (geplant)
- Size Validation
- Type Validation
- Progress Bar (geplant)
- Preview (geplant)

---

## 🎨 DESIGN

### Grid-Layouts

```tsx
// 1 Spalte (Default)
<UnifiedForm columns={1}>

// 2 Spalten (Responsive: Mobile 1, Desktop 2)
<UnifiedForm columns={2}>

// 3 Spalten (Responsive: Mobile 1, Tablet 2, Desktop 3)
<UnifiedForm columns={3}>
```

### Spacing

```tsx
// Form: space-y-6
// Grid: gap-4
// Buttons: gap-3
```

---

## 🔒 DSGVO-KONFORMITÄT

### Pflichtfeld-Markierung

```tsx
<FormLabel>
  Name
  {required && <span className="text-destructive ml-1">*</span>}
</FormLabel>
```

### File Upload Hinweise

```tsx
<FileUploadField description="Ihre Daten werden verschlüsselt übertragen und gemäß DSGVO gespeichert." />
```

---

## ✅ BEST PRACTICES

### DO ✅

```tsx
// Zod Schema verwenden
const schema = z.object({...});

// Type-Safe
type FormData = z.infer<typeof schema>;

// Error Handling
const onSubmit = async (data: FormData) => {
  try {
    await api.create(data);
    toast.success('Erfolg');
  } catch (error) {
    handleError(error, 'Fehler beim Speichern');
  }
};

// Required Indicator
<FormLabel>Name *</FormLabel>
```

### DON'T ❌

```tsx
// Keine Inline-Validation
onChange={(e) => {
  if (e.target.value.length < 3) {
    setError('Zu kurz');
  }
}}

// Keine uncontrolled Forms
<input name="name" />

// Keine magischen Zahlen
maxSize={10485760}  // Use maxSize={10} (MB)
```

---

**ALLE FORMS MÜSSEN UNIFIED-SYSTEM VERWENDEN!**
