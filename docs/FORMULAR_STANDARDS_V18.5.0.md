# MYDISPATCH V18.5.0 - FORMULAR-STANDARDS

**Version:** 18.5.0  
**Datum:** 2025-01-22  
**Status:** PRODUKTIONSBEREIT

---

## 📋 FORMULAR-PHILOSOPHIE

### Grundprinzipien

1. **Logische Reihenfolge:** Von allgemein zu spezifisch
2. **Kontextuelle Gruppierung:** Zusammengehörige Felder gruppieren
3. **Progressive Disclosure:** Optionale Felder nur bei Bedarf zeigen
4. **Inline-Validierung:** Fehler sofort anzeigen
5. **Autosave (wo möglich):** Datenverlust vermeiden

---

## 🎯 STANDARD-FORMULAR-STRUKTUR

### Multi-Step-Formular (Beispiel: Booking)

```typescript
interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  validation: z.ZodSchema;
}

const bookingFormSteps: FormStep[] = [
  {
    id: "datetime-route",
    title: "Zeitpunkt & Route",
    description: "Wann und wohin soll die Fahrt gehen?",
    fields: ["pickup_time", "pickup_address", "dropoff_address"],
    validation: stepOneSchema,
  },
  {
    id: "passenger-details",
    title: "Fahrgastdaten",
    description: "Wie viele Personen und Gepäckstücke?",
    fields: ["passengers", "luggage", "special_requests"],
    validation: stepTwoSchema,
  },
  {
    id: "customer-selection",
    title: "Kundendaten",
    description: "Wer ist der Auftraggeber?",
    fields: [
      "customer_id",
      "customer_first_name",
      "customer_last_name",
      "customer_email",
      "customer_phone",
    ],
    validation: stepThreeSchema,
  },
  {
    id: "assignment",
    title: "Zuweisung (Optional)",
    description: "Fahrer und Fahrzeug zuweisen?",
    fields: ["driver_id", "vehicle_id"],
    validation: stepFourSchema,
  },
];
```

### Formular-Template

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    {/* Form Header */}
    <div className="flex items-center justify-between pb-4 border-b border-border">
      <div>
        <h2 className="text-2xl font-bold">{currentStep.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{currentStep.description}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="w-5 h-5" />
      </Button>
    </div>

    {/* Progress Indicator */}
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            "flex-1 h-2 rounded-full transition-colors",
            index <= currentStepIndex ? "bg-primary" : "bg-muted"
          )}
        />
      ))}
    </div>

    {/* Form Fields */}
    <div className="space-y-4">
      {currentStep.fields.map((fieldName) => (
        <FormField
          key={fieldName}
          control={form.control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{fieldLabels[fieldName]}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={fieldPlaceholders[fieldName]} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>

    {/* Form Footer */}
    <div className="flex items-center justify-between pt-4 border-t border-border">
      {currentStepIndex > 0 && (
        <Button type="button" variant="outline" onClick={handlePrevious}>
          Zurück
        </Button>
      )}

      {currentStepIndex < steps.length - 1 ? (
        <Button type="button" onClick={handleNext} className="ml-auto">
          Weiter
        </Button>
      ) : (
        <Button type="submit" disabled={isSubmitting} className="ml-auto">
          {isSubmitting ? "Speichern..." : "Auftrag erstellen"}
        </Button>
      )}
    </div>
  </form>
</Form>
```

---

## 📝 FORMULAR-SPEZIFIKATIONEN

### 1. BOOKING FORM (Auftrag erstellen)

#### Step 1: Zeitpunkt & Route

**Felder-Reihenfolge:**

```typescript
[
  {
    name: "pickup_time",
    type: "datetime",
    label: "Abholzeit",
    placeholder: "Datum und Uhrzeit wählen",
    required: true,
    validation: z.date().min(new Date(), "Muss in der Zukunft liegen"),
  },
  {
    name: "pickup_address",
    type: "address-autocomplete",
    label: "Abholadresse",
    placeholder: "Straße, Nr., PLZ, Stadt",
    required: true,
    validation: z.string().min(5, "Zu kurz").max(500),
    autocomplete: {
      provider: "HERE",
      country: "DEU",
    },
  },
  {
    name: "dropoff_address",
    type: "address-autocomplete",
    label: "Zieladresse",
    placeholder: "Straße, Nr., PLZ, Stadt",
    required: true,
    validation: z.string().min(5, "Zu kurz").max(500),
    autocomplete: {
      provider: "HERE",
      country: "DEU",
    },
  },
];
```

**UI-Features:**

- DateTimePicker mit Kalender-Popup
- Address-Autocomplete mit Dropdown
- Route-Preview auf Karte (Optional)

---

#### Step 2: Fahrgastdaten

**Felder-Reihenfolge:**

```typescript
[
  {
    name: "passengers",
    type: "number",
    label: "Anzahl Fahrgäste",
    placeholder: "1-8",
    required: true,
    validation: z.number().int().min(1).max(8),
    defaultValue: 1,
  },
  {
    name: "luggage",
    type: "number",
    label: "Gepäckstücke",
    placeholder: "0-8",
    required: true,
    validation: z.number().int().min(0).max(8),
    defaultValue: 0,
  },
  {
    name: "special_requests",
    type: "textarea",
    label: "Besondere Wünsche (Optional)",
    placeholder: "z.B. Kindersitz, Rollstuhlrampe, ...",
    required: false,
    validation: z.string().max(1000).optional(),
    rows: 3,
  },
];
```

**UI-Features:**

- Number-Input mit +/- Buttons
- Textarea mit Character-Counter

---

#### Step 3: Kundendaten

**Felder-Reihenfolge (Existierender Kunde):**

```typescript
[
  {
    name: "customer_id",
    type: "select-search",
    label: "Kunde auswählen",
    placeholder: "Name oder Telefonnummer suchen",
    required: true,
    options: customers.map((c) => ({
      value: c.id,
      label: `${c.first_name} ${c.last_name} (${c.phone})`,
    })),
  },
];
```

**Felder-Reihenfolge (Neuer Kunde):**

```typescript
[
  {
    name: "customer_first_name",
    type: "text",
    label: "Vorname",
    placeholder: "Max",
    required: true,
    validation: z.string().min(2, "Zu kurz").max(50),
  },
  {
    name: "customer_last_name",
    type: "text",
    label: "Nachname",
    placeholder: "Mustermann",
    required: true,
    validation: z.string().min(2, "Zu kurz").max(50),
  },
  {
    name: "customer_email",
    type: "email",
    label: "E-Mail",
    placeholder: "max@example.com",
    required: true,
    validation: z.string().email("Ungültige E-Mail"),
  },
  {
    name: "customer_phone",
    type: "tel",
    label: "Telefon",
    placeholder: "+49 123 456789",
    required: true,
    validation: z.string().regex(/^\+?[0-9\s\-()]+$/, "Ungültiges Format"),
  },
];
```

**UI-Features:**

- Toggle zwischen "Bestehender Kunde" / "Neuer Kunde"
- Searchable Select (Combobox)
- Telefon-Formatierung (Auto)

---

#### Step 4: Zuweisung (Optional)

**Felder-Reihenfolge:**

```typescript
[
  {
    name: "driver_id",
    type: "select",
    label: "Fahrer (Optional)",
    placeholder: "Automatisch zuweisen",
    required: false,
    options: drivers.map((d) => ({
      value: d.id,
      label: `${d.first_name} ${d.last_name}`,
      disabled: d.shift_status !== "available",
    })),
  },
  {
    name: "vehicle_id",
    type: "select",
    label: "Fahrzeug (Optional)",
    placeholder: "Automatisch zuweisen",
    required: false,
    options: vehicles.map((v) => ({
      value: v.id,
      label: `${v.license_plate} (${v.vehicle_class})`,
      disabled: v.status !== "available",
    })),
  },
];
```

**UI-Features:**

- Select mit Verfügbarkeits-Anzeige
- Option "Automatisch zuweisen" (leer lassen)

---

### 2. DRIVER FORM (Fahrer anlegen)

**Felder-Reihenfolge:**

```typescript
[
  // Persönliche Daten
  {
    section: "Persönliche Daten",
    fields: [
      { name: "first_name", type: "text", label: "Vorname", required: true },
      { name: "last_name", type: "text", label: "Nachname", required: true },
      { name: "date_of_birth", type: "date", label: "Geburtsdatum", required: true },
      { name: "nationality", type: "text", label: "Nationalität", required: true },
    ],
  },

  // Kontaktdaten
  {
    section: "Kontaktdaten",
    fields: [
      { name: "email", type: "email", label: "E-Mail", required: true },
      { name: "phone", type: "tel", label: "Telefon", required: true },
      {
        name: "emergency_contact_name",
        type: "text",
        label: "Notfallkontakt Name",
        required: false,
      },
      {
        name: "emergency_contact_phone",
        type: "tel",
        label: "Notfallkontakt Telefon",
        required: false,
      },
    ],
  },

  // Adresse
  {
    section: "Adresse",
    fields: [
      { name: "street", type: "text", label: "Straße", required: true },
      { name: "street_number", type: "text", label: "Hausnummer", required: true },
      { name: "postal_code", type: "text", label: "PLZ", required: true },
      { name: "city", type: "text", label: "Stadt", required: true },
      { name: "country_code", type: "select", label: "Land", required: true, defaultValue: "DE" },
    ],
  },

  // Führerschein
  {
    section: "Führerschein",
    fields: [
      { name: "license_number", type: "text", label: "Führerschein-Nr.", required: true },
      {
        name: "license_class",
        type: "multi-select",
        label: "Klassen",
        required: true,
        options: ["B", "C", "D", "DE"],
      },
      { name: "license_expiry_date", type: "date", label: "Gültig bis", required: true },
    ],
  },

  // P-Schein
  {
    section: "Personenbeförderungsschein",
    fields: [
      { name: "p_schein_number", type: "text", label: "P-Schein Nr.", required: true },
      { name: "p_schein_expiry_date", type: "date", label: "Gültig bis", required: true },
    ],
  },

  // Beschäftigung
  {
    section: "Beschäftigungsdaten",
    fields: [
      { name: "employee_number", type: "text", label: "Personalnummer", required: false },
      { name: "employment_start_date", type: "date", label: "Eintrittsdatum", required: true },
      {
        name: "employment_type",
        type: "select",
        label: "Beschäftigungsart",
        required: true,
        options: ["Festanstellung", "Teilzeit", "Minijob"],
      },
    ],
  },
];
```

---

### 3. VEHICLE FORM (Fahrzeug anlegen)

**Felder-Reihenfolge:**

```typescript
[
  // Fahrzeugdaten
  {
    section: "Fahrzeugdaten",
    fields: [
      {
        name: "license_plate",
        type: "text",
        label: "Kennzeichen",
        required: true,
        transform: toUpperCase,
      },
      {
        name: "vehicle_class",
        type: "select",
        label: "Fahrzeugklasse",
        required: true,
        options: ["Limousine", "Kombi", "Van", "Großraum"],
      },
      { name: "make", type: "text", label: "Hersteller", required: true },
      { name: "model", type: "text", label: "Modell", required: true },
      {
        name: "year",
        type: "number",
        label: "Baujahr",
        required: true,
        validation: z
          .number()
          .int()
          .min(1990)
          .max(new Date().getFullYear() + 1),
      },
      { name: "color", type: "text", label: "Farbe", required: true },
    ],
  },

  // Kapazität
  {
    section: "Kapazität",
    fields: [
      {
        name: "seats",
        type: "number",
        label: "Sitzplätze",
        required: true,
        validation: z.number().int().min(1).max(9),
      },
      {
        name: "luggage_capacity",
        type: "number",
        label: "Gepäckraum (Koffer)",
        required: true,
        validation: z.number().int().min(0).max(20),
      },
    ],
  },

  // Zulassung
  {
    section: "Zulassung",
    fields: [
      { name: "vin", type: "text", label: "Fahrzeug-Identifikationsnummer (VIN)", required: true },
      { name: "registration_date", type: "date", label: "Erstzulassung", required: true },
      { name: "next_inspection_date", type: "date", label: "Nächste HU/AU", required: true },
    ],
  },

  // Versicherung
  {
    section: "Versicherung",
    fields: [
      { name: "insurance_provider", type: "text", label: "Versicherung", required: true },
      {
        name: "insurance_policy_number",
        type: "text",
        label: "Versicherungsnummer",
        required: true,
      },
      { name: "insurance_expiry_date", type: "date", label: "Gültig bis", required: true },
    ],
  },
];
```

---

## 🎨 FIELD-COMPONENTS

### Text Input

```tsx
<FormField
  control={form.control}
  name="first_name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>
        Vorname <span className="text-status-error">*</span>
      </FormLabel>
      <FormControl>
        <Input {...field} placeholder="Max" className="h-10" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Select Dropdown

```tsx
<FormField
  control={form.control}
  name="vehicle_class"
  render={({ field }) => (
    <FormItem>
      <FormLabel>
        Fahrzeugklasse <span className="text-status-error">*</span>
      </FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Wählen Sie eine Klasse" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="limousine">Limousine</SelectItem>
          <SelectItem value="kombi">Kombi</SelectItem>
          <SelectItem value="van">Van</SelectItem>
          <SelectItem value="grossraum">Großraum</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Date Picker

```tsx
<FormField
  control={form.control}
  name="pickup_time"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>
        Abholzeit <span className="text-status-error">*</span>
      </FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "w-full h-10 pl-3 text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value ? (
                format(field.value, "PPP HH:mm", { locale: de })
              ) : (
                <span>Datum wählen</span>
              )}
              <Calendar className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) => date < new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Address Autocomplete

```tsx
<FormField
  control={form.control}
  name="pickup_address"
  render={({ field }) => (
    <FormItem>
      <FormLabel>
        Abholadresse <span className="text-status-error">*</span>
      </FormLabel>
      <FormControl>
        <AddressAutocomplete
          value={field.value}
          onChange={field.onChange}
          placeholder="Straße, Nr., PLZ, Stadt"
          provider="HERE"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## ✅ VALIDIERUNGS-STANDARDS

### Zod-Schema-Patterns

```typescript
// Booking Schema (Vollständig)
export const bookingSchema = z.object({
  pickup_time: z.date().min(new Date(), "Abholzeit muss in der Zukunft liegen"),

  pickup_address: z.string().min(5, "Adresse zu kurz").max(500, "Adresse zu lang"),

  dropoff_address: z.string().min(5, "Adresse zu kurz").max(500, "Adresse zu lang"),

  passengers: z
    .number()
    .int("Muss ganzzahlig sein")
    .min(1, "Mindestens 1 Fahrgast")
    .max(8, "Maximal 8 Fahrgäste"),

  luggage: z
    .number()
    .int("Muss ganzzahlig sein")
    .min(0, "Mindestens 0 Gepäckstücke")
    .max(8, "Maximal 8 Gepäckstücke"),

  special_requests: z.string().max(1000, "Zu lang").optional(),

  customer_id: z.string().uuid("Ungültige Kunden-ID").optional(),

  driver_id: z.string().uuid("Ungültige Fahrer-ID").optional(),

  vehicle_id: z.string().uuid("Ungültige Fahrzeug-ID").optional(),
});
```

### Error-Messages (Deutsch)

```typescript
const errorMessages = {
  required: "Dieses Feld ist erforderlich",
  email: "Ungültige E-Mail-Adresse",
  phone: "Ungültige Telefonnummer",
  url: "Ungültige URL",
  min: (min: number) => `Mindestens ${min} Zeichen`,
  max: (max: number) => `Maximal ${max} Zeichen`,
  minValue: (min: number) => `Mindestens ${min}`,
  maxValue: (max: number) => `Maximal ${max}`,
  integer: "Muss eine ganze Zahl sein",
  positive: "Muss positiv sein",
  futureDate: "Muss in der Zukunft liegen",
  pastDate: "Muss in der Vergangenheit liegen",
};
```

---

## 🎯 ACCESSIBILITY-STANDARDS

### Required Fields

```tsx
<FormLabel>
  Vorname{" "}
  <span className="text-status-error" aria-label="erforderlich">
    *
  </span>
</FormLabel>
```

### ARIA-Labels

```tsx
<Input
  {...field}
  aria-label="Vorname"
  aria-required="true"
  aria-invalid={!!form.formState.errors.first_name}
  aria-describedby={form.formState.errors.first_name ? "first_name-error" : undefined}
/>;

{
  form.formState.errors.first_name && (
    <FormMessage id="first_name-error" role="alert">
      {form.formState.errors.first_name.message}
    </FormMessage>
  );
}
```

### Keyboard Navigation

- Tab: Nächstes Feld
- Shift+Tab: Vorheriges Feld
- Enter: Formular absenden (letzter Schritt)
- Escape: Formular schließen

---

## 📱 RESPONSIVE DESIGN

### Desktop (≥768px)

- 2-Column-Layout für zusammengehörige Felder
- Sidebar für Context-Information

### Mobile (<768px)

- Single-Column-Layout
- Sticky-Footer mit Buttons
- Collapsible Sections

---

**Version:** 18.5.0  
**Letztes Update:** 2025-01-22  
**Status:** ✅ PRODUKTIONSBEREIT
