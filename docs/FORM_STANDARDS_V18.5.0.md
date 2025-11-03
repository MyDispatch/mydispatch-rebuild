# Form Standards V18.5.0

**Status:** Production-Ready  
**Letzte Aktualisierung:** 2025-10-22  
**Verantwortlich:** Pascal Courbois  
**Kategorie:** Developer Guidelines

---

## 🎯 Übersicht

Diese Guidelines definieren **einheitliche Standards** für alle Formulare in MyDispatch. Konsistente Formulare verbessern UX, reduzieren Fehler und beschleunigen die Entwicklung.

---

## 🏗️ Form Architecture

### **Stack:**
- **React Hook Form** (`react-hook-form`) - Form State Management
- **Zod** (`zod`) - Schema Validation
- **@hookform/resolvers** - RHF + Zod Integration
- **Shadcn Form Components** - UI Components

### **Base Template:**

```typescript
// src/components/forms/ExampleForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mind. 8 Zeichen haben"),
});

type FormValues = z.infer<typeof formSchema>;

export function ExampleForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // API Call
      await apiCall(data);
      toast.success("Erfolgreich gespeichert");
      form.reset();
    } catch (error) {
      toast.error("Fehler beim Speichern");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="max@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passwort</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Wird gespeichert..." : "Speichern"}
        </Button>
      </form>
    </Form>
  );
}
```

---

## 📋 Field Types & Standards

### **1. Text Input**

```typescript
// Standard Text Field
<FormField
  control={form.control}
  name="first_name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Vorname</FormLabel>
      <FormControl>
        <Input placeholder="Max" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

// Validation
const schema = z.object({
  first_name: z.string().min(2, "Mind. 2 Zeichen").max(50, "Max. 50 Zeichen"),
});
```

### **2. Email Input**

```typescript
<Input type="email" placeholder="max@example.com" {...field} />

// Validation
email: z.string().email("Ungültige E-Mail-Adresse"),
```

### **3. Phone Input**

```typescript
<Input 
  type="tel" 
  placeholder="+49 170 1234567" 
  {...field} 
/>

// Validation (DE Format)
phone: z.string()
  .regex(/^(\+49|0)[1-9][0-9]{1,14}$/, "Ungültige Telefonnummer")
  .optional(),
```

### **4. Number Input**

```typescript
<Input 
  type="number" 
  min={0} 
  step={1}
  placeholder="0" 
  {...field} 
  onChange={(e) => field.onChange(parseFloat(e.target.value))}
/>

// Validation
passenger_count: z.number().int().min(1, "Mind. 1 Passagier").max(50, "Max. 50 Passagiere"),
```

### **5. Date Picker**

```typescript
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

<FormField
  control={form.control}
  name="date_of_birth"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Geburtsdatum</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? format(field.value, "dd.MM.yyyy") : "Datum wählen"}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )}
/>

// Validation
date_of_birth: z.date().refine(
  (date) => {
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 18;
  },
  { message: "Mindestalter: 18 Jahre" }
),
```

### **6. Select Dropdown**

```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<FormField
  control={form.control}
  name="vehicle_type"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Fahrzeugtyp</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Typ wählen" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="sedan">Limousine</SelectItem>
          <SelectItem value="suv">SUV</SelectItem>
          <SelectItem value="van">Van</SelectItem>
          <SelectItem value="luxury">Luxus</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

// Validation
vehicle_type: z.enum(["sedan", "suv", "van", "luxury"], {
  required_error: "Bitte Fahrzeugtyp wählen",
}),
```

### **7. Multi-Select**

```typescript
import { Checkbox } from "@/components/ui/checkbox";

const serviceTypes = [
  { id: "taxi", label: "Taxi" },
  { id: "rental", label: "Mietwagen" },
  { id: "limousine", label: "Limousine" },
];

<FormField
  control={form.control}
  name="service_types"
  render={() => (
    <FormItem>
      <FormLabel>Service-Typen</FormLabel>
      {serviceTypes.map((type) => (
        <FormField
          key={type.id}
          control={form.control}
          name="service_types"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value?.includes(type.id)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? field.onChange([...field.value, type.id])
                      : field.onChange(field.value?.filter((value) => value !== type.id));
                  }}
                />
              </FormControl>
              <FormLabel className="!mt-0">{type.label}</FormLabel>
            </FormItem>
          )}
        />
      ))}
      <FormMessage />
    </FormItem>
  )}
/>

// Validation
service_types: z.array(z.string()).min(1, "Mind. 1 Service-Typ wählen"),
```

### **8. Radio Group**

```typescript
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

<FormField
  control={form.control}
  name="customer_type"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Kundentyp</FormLabel>
      <FormControl>
        <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <RadioGroupItem value="individual" />
            </FormControl>
            <FormLabel className="!mt-0">Privatkunde</FormLabel>
          </FormItem>
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <RadioGroupItem value="business" />
            </FormControl>
            <FormLabel className="!mt-0">Geschäftskunde</FormLabel>
          </FormItem>
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

// Validation
customer_type: z.enum(["individual", "business"]),
```

### **9. Textarea**

```typescript
import { Textarea } from "@/components/ui/textarea";

<FormField
  control={form.control}
  name="notes"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Notizen</FormLabel>
      <FormControl>
        <Textarea 
          placeholder="Zusätzliche Informationen..." 
          className="min-h-[100px]"
          {...field} 
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

// Validation
notes: z.string().max(500, "Max. 500 Zeichen").optional(),
```

### **10. File Upload**

```typescript
import { Input } from "@/components/ui/input";

<FormField
  control={form.control}
  name="avatar"
  render={({ field: { onChange, value, ...field } }) => (
    <FormItem>
      <FormLabel>Profilbild</FormLabel>
      <FormControl>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file);
          }}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

// Validation
avatar: z
  .instanceof(File)
  .refine((file) => file.size <= 5000000, "Max. 5MB")
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    "Nur JPG, PNG oder WEBP"
  )
  .optional(),
```

---

## 🎨 Form Layout Patterns

### **1. Single Column (Standard)**

```typescript
<form className="space-y-6">
  <FormField ... />
  <FormField ... />
  <FormField ... />
  <Button type="submit">Speichern</Button>
</form>
```

### **2. Two Columns**

```typescript
<form className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <FormField ... /> {/* Vorname */}
    <FormField ... /> {/* Nachname */}
  </div>
  
  <FormField ... /> {/* Email (Full Width) */}
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <FormField ... /> {/* Telefon */}
    <FormField ... /> {/* Mobilnummer */}
  </div>
  
  <Button type="submit">Speichern</Button>
</form>
```

### **3. Multi-Step Form**

```typescript
const [step, setStep] = useState(1);

<form>
  {step === 1 && (
    <>
      <FormField ... />
      <FormField ... />
      <Button onClick={() => setStep(2)}>Weiter</Button>
    </>
  )}
  
  {step === 2 && (
    <>
      <FormField ... />
      <FormField ... />
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setStep(1)}>Zurück</Button>
        <Button type="submit">Speichern</Button>
      </div>
    </>
  )}
</form>
```

---

## ✅ Validation Standards

### **Common Validations:**

```typescript
const validations = {
  // Text
  required: z.string().min(1, "Pflichtfeld"),
  text: z.string().min(2).max(100),
  
  // Email
  email: z.string().email("Ungültige E-Mail"),
  
  // Phone (DE)
  phone: z.string().regex(/^(\+49|0)[1-9][0-9]{1,14}$/),
  
  // Number
  positiveInt: z.number().int().positive(),
  percentage: z.number().min(0).max(100),
  
  // Date
  futureDate: z.date().min(new Date(), "Datum muss in Zukunft liegen"),
  pastDate: z.date().max(new Date(), "Datum muss in Vergangenheit liegen"),
  
  // File
  image: z
    .instanceof(File)
    .refine((f) => f.size <= 5000000, "Max. 5MB")
    .refine((f) => ["image/jpeg", "image/png"].includes(f.type), "Nur JPG/PNG"),
};
```

### **Custom Validations:**

```typescript
// IBAN Validation
const ibanSchema = z.string().refine(
  (iban) => {
    const cleaned = iban.replace(/\s/g, "");
    return /^DE\d{20}$/.test(cleaned);
  },
  { message: "Ungültige IBAN (Format: DE + 20 Ziffern)" }
);

// USt-IdNr. Validation (DE)
const vatSchema = z.string().regex(
  /^DE\d{9}$/,
  "Ungültige USt-IdNr. (Format: DE123456789)"
);
```

---

## 🚀 Form Submission

### **1. Standard Submission**

```typescript
const onSubmit = async (data: FormValues) => {
  try {
    const { error } = await supabase.from('table').insert(data);
    if (error) throw error;
    
    toast.success("Erfolgreich gespeichert");
    form.reset();
    onClose?.(); // Close dialog/modal
  } catch (error) {
    console.error(error);
    toast.error("Fehler beim Speichern");
  }
};
```

### **2. With File Upload**

```typescript
const onSubmit = async (data: FormValues) => {
  try {
    // 1. Upload File
    if (data.avatar) {
      const fileName = `${Date.now()}-${data.avatar.name}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, data.avatar);
      
      if (uploadError) throw uploadError;
      
      data.avatar_url = fileName;
    }
    
    // 2. Insert Data
    const { error } = await supabase.from('drivers').insert({
      ...data,
      avatar: undefined, // Remove File object
    });
    
    if (error) throw error;
    
    toast.success("Fahrer erstellt");
  } catch (error) {
    toast.error("Fehler beim Speichern");
  }
};
```

---

## 🎯 Best Practices

### **DO's ✅**
- **Immer** React Hook Form + Zod verwenden
- **Klare** Fehlermeldungen in Deutsch
- **Loading States** während Submit (`isSubmitting`)
- **Toast Notifications** für Success/Error
- **Auto-Focus** auf erstes Feld
- **Disabled Submit** während Submission
- **Form.reset()** nach Success
- **Optimistic Updates** wo sinnvoll

### **DON'Ts ❌**
- **Keine** uncontrolled forms
- **Keine** vagen Fehlermeldungen ("Fehler")
- **Keine** Inline-Validation ohne Zod
- **Keine** fehlenden Loading States
- **Kein** automatisches Close ohne Feedback
- **Keine** fehlenden Pflichtfeld-Markierungen

---

## 📊 Accessibility (a11y)

```typescript
// Label immer verwenden
<FormLabel htmlFor="email">E-Mail</FormLabel>

// aria-describedby für Hilfe-Texte
<FormDescription id="email-help">
  Wir senden Ihnen Bestätigungen per E-Mail
</FormDescription>

// aria-invalid bei Fehlern (automatisch via Shadcn)
<Input aria-invalid={!!form.formState.errors.email} />

// Focus Management
useEffect(() => {
  if (open) {
    setTimeout(() => {
      document.getElementById('first-field')?.focus();
    }, 100);
  }
}, [open]);
```

---

## 🧪 Testing

```typescript
// tests/forms/create-order-form.spec.ts
test('Create order form validation', async ({ page }) => {
  await page.goto('/orders/new');
  
  // Submit empty form
  await page.click('button[type="submit"]');
  
  // Check error messages
  await expect(page.locator('text=Pflichtfeld')).toHaveCount(3);
  
  // Fill valid data
  await page.fill('[name="customer_id"]', 'CUS-P-00001');
  await page.fill('[name="pickup_address"]', 'Berlin Hauptbahnhof');
  await page.fill('[name="dropoff_address"]', 'Berlin Tegel');
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Verify success
  await expect(page.locator('text=Auftrag erstellt')).toBeVisible();
});
```

---

## 🔗 Verknüpfte Dokumente

- [ORDERS_SPECIFICATION_V18.5.0.md](./ORDERS_SPECIFICATION_V18.5.0.md)
- [DRIVER_SPECIFICATION_V18.5.0.md](./DRIVER_SPECIFICATION_V18.5.0.md)
- [CUSTOMER_SPECIFICATION_V18.5.0.md](./CUSTOMER_SPECIFICATION_V18.5.0.md)
- [ASSET_MANAGEMENT_SYSTEM_V18.5.0.md](./ASSET_MANAGEMENT_SYSTEM_V18.5.0.md)

---

**Letzte Aktualisierung:** 2025-10-22 22:00 (DE)  
**Version:** 18.5.0  
**Status:** ✅ Production-Ready
