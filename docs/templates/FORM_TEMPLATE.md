# 📝 FORM TEMPLATE - MyDispatch

## Standard Pattern für alle Forms mit React Hook Form + Zod

---

## Template-Struktur

### 1. Zod Schema (src/schemas/)

```typescript
/* ==================================================================================
   [FORM-NAME] SCHEMA - ZOD VALIDATION
   ================================================================================== */

import { z } from "zod";

export const formNameSchema = z.object({
  // Text Fields
  email: z.string().min(1, "E-Mail ist erforderlich").email("Ungültige E-Mail-Adresse"),

  name: z
    .string()
    .min(2, "Name muss mindestens 2 Zeichen haben")
    .max(50, "Name darf maximal 50 Zeichen haben"),

  // Number Fields
  age: z.number().min(18, "Mindestalter ist 18").max(120, "Ungültiges Alter"),

  // Optional Fields
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Ungültige Telefonnummer")
    .optional(),

  // Boolean Fields
  acceptTerms: z.boolean().refine((val) => val === true, "Sie müssen den Bedingungen zustimmen"),

  // Select Fields
  role: z.enum(["user", "admin", "moderator"], {
    errorMap: () => ({ message: "Ungültige Rolle" }),
  }),

  // Date Fields
  birthdate: z.date({
    required_error: "Geburtsdatum ist erforderlich",
  }),

  // File Upload
  avatar: z
    .instanceof(File, { message: "Datei ist erforderlich" })
    .refine((file) => file.size <= 5000000, "Datei darf maximal 5MB groß sein")
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), "Nur JPG/PNG erlaubt")
    .optional(),
});

// TypeScript Type aus Zod Schema
export type FormNameType = z.infer<typeof formNameSchema>;
```

---

### 2. Form Component

```typescript
/* ==================================================================================
   [FORM-NAME] FORM COMPONENT
   ==================================================================================
   ✅ React Hook Form + Zod Integration
   ✅ V26 Design System
   ✅ Error Handling & Validation
   ✅ Loading States
   ================================================================================== */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formNameSchema, FormNameType } from '@/schemas/form-name.schema';
import { V26Button } from '@/components/design-system/V26Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface FormNameProps {
  onSuccess?: (data: FormNameType) => void;
  initialData?: Partial<FormNameType>;
  isLoading?: boolean;
}

export function FormName({ onSuccess, initialData, isLoading = false }: FormNameProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormNameType>({
    resolver: zodResolver(formNameSchema),
    defaultValues: initialData || {},
  });

  const onSubmit = async (data: FormNameType) => {
    try {
      // API Call oder Mutation
      console.log('Form Data:', data);

      // Success
      toast.success('Formular erfolgreich übermittelt');
      onSuccess?.(data);
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Fehler beim Übermitteln des Formulars');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Text Input */}
      <div>
        <Label htmlFor="email">E-Mail *</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="ihre@email.de"
          disabled={isLoading || isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Text Input */}
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Ihr Name"
          disabled={isLoading || isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Number Input */}
      <div>
        <Label htmlFor="age">Alter *</Label>
        <Input
          id="age"
          type="number"
          {...register('age', { valueAsNumber: true })}
          placeholder="18"
          disabled={isLoading || isSubmitting}
        />
        {errors.age && (
          <p className="text-sm text-red-500 mt-1">{errors.age.message}</p>
        )}
      </div>

      {/* Optional Input */}
      <div>
        <Label htmlFor="phone">Telefon (optional)</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="+49 123 456789"
          disabled={isLoading || isSubmitting}
        />
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Checkbox */}
      <div className="flex items-center gap-2">
        <input
          id="acceptTerms"
          type="checkbox"
          {...register('acceptTerms')}
          disabled={isLoading || isSubmitting}
          className="w-4 h-4"
        />
        <Label htmlFor="acceptTerms">Ich akzeptiere die Bedingungen *</Label>
      </div>
      {errors.acceptTerms && (
        <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>
      )}

      {/* Select */}
      <div>
        <Label htmlFor="role">Rolle *</Label>
        <select
          id="role"
          {...register('role')}
          disabled={isLoading || isSubmitting}
          className="w-full border rounded-md p-2"
        >
          <option value="">Bitte wählen</option>
          <option value="user">Benutzer</option>
          <option value="admin">Administrator</option>
          <option value="moderator">Moderator</option>
        </select>
        {errors.role && (
          <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-2">
        <V26Button
          type="submit"
          disabled={isLoading || isSubmitting}
          variant="primary"
        >
          {isSubmitting ? 'Übermitteln...' : 'Absenden'}
        </V26Button>

        <V26Button
          type="button"
          onClick={() => reset()}
          disabled={isLoading || isSubmitting}
          variant="secondary"
        >
          Zurücksetzen
        </V26Button>
      </div>
    </form>
  );
}
```

---

## Advanced Patterns

### File Upload with Preview

```typescript
import { useState } from 'react';

function FileUploadForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const { register, watch } = useForm();

  const avatarFile = watch('avatar');

  useEffect(() => {
    if (avatarFile && avatarFile[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(avatarFile[0]);
    }
  }, [avatarFile]);

  return (
    <div>
      <input type="file" {...register('avatar')} accept="image/*" />
      {preview && <img src={preview} alt="Preview" className="w-32 h-32" />}
    </div>
  );
}
```

---

### Multi-Step Form

```typescript
import { useState } from 'react';

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, trigger } = useForm();

  const handleNext = async () => {
    // Validate current step
    const isValid = await trigger(['email', 'name']); // Step 1 fields
    if (isValid) setStep(step + 1);
  };

  return (
    <form>
      {step === 1 && (
        <div>
          {/* Step 1 Fields */}
          <V26Button onClick={handleNext}>Weiter</V26Button>
        </div>
      )}

      {step === 2 && (
        <div>
          {/* Step 2 Fields */}
          <V26Button onClick={() => setStep(1)}>Zurück</V26Button>
          <V26Button type="submit">Absenden</V26Button>
        </div>
      )}
    </form>
  );
}
```

---

### Dynamic Fields (Array)

```typescript
import { useFieldArray } from 'react-hook-form';

const schema = z.object({
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
  })),
});

function DynamicForm() {
  const { control, register } = useForm({ resolver: zodResolver(schema) });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`items.${index}.name`)} />
          <input {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
          <button onClick={() => remove(index)}>Entfernen</button>
        </div>
      ))}
      <button onClick={() => append({ name: '', quantity: 0 })}>Hinzufügen</button>
    </div>
  );
}
```

---

## Checklist Form Implementation

**Vor Implementation:**

- [ ] Zod Schema definiert (src/schemas/)
- [ ] TypeScript Types aus Schema generiert
- [ ] Required vs. Optional Fields geklärt
- [ ] Validation Rules klar
- [ ] UI/UX für Fehler-Anzeige geplant

**Nach Implementation:**

- [ ] Alle Felder validiert (Edge Cases)
- [ ] Error Messages benutzerfreundlich
- [ ] Loading States funktionieren
- [ ] Success/Error Toasts vorhanden
- [ ] Form Reset nach Success
- [ ] Accessibility getestet (Labels, ARIA)
- [ ] In COMPONENT_REGISTRY.md dokumentiert

---

**LAST UPDATE:** 2025-01-26  
**VERSION:** 1.0  
**STATUS:** ✅ TEMPLATE READY
