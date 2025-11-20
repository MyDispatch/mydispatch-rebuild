# 📋 FORMULARE - SYSTEMWEITE DOKUMENTATION

**Version:** 1.1 | **Datum:** 15.10.2025 | **Status:** 🟢 FINAL (Erweitert)

---

## 🎯 KRITISCHE VORGABEN (NIEMALS ÄNDERN!)

### ✅ **Anrede & Titel sind PFLICHT**

Alle Personen-Entitäten (Kunden, Fahrer, User-Profile) **MÜSSEN** folgende Felder haben:

```typescript
interface PersonEntity {
  salutation: "Herr" | "Frau" | "Divers"; // PFLICHTFELD!
  title?: string; // Optional: Dr., Prof., etc.
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string; // NEU!
  notes?: string; // NEU!
}
```

### 📊 **Datenbank-Schema**

```sql
-- ENUM für Anrede (systemweit)
CREATE TYPE public.salutation AS ENUM ('Herr', 'Frau', 'Divers');

-- Erweiterungen (auf customers, drivers, profiles angewendet)
ALTER TABLE public.customers ADD COLUMN salutation public.salutation;
ALTER TABLE public.customers ADD COLUMN title TEXT;
ALTER TABLE public.customers ADD COLUMN address TEXT;
ALTER TABLE public.customers ADD COLUMN notes TEXT;

-- Gleiches Schema für drivers und profiles
```

---

## 🧩 WIEDERVERWENDBARE KOMPONENTEN

### 1️⃣ **PersonFormFields.tsx** (Haupt-Komponente)

**Pfad:** `src/components/forms/PersonFormFields.tsx`

**Verwendung:**

```tsx
import { PersonFormFields } from "@/components/forms/PersonFormFields";

<PersonFormFields
  formData={formData}
  onChange={handleChange}
  requiredFields={["salutation", "first_name", "last_name", "phone"]}
  showExtendedFields={true} // Zeigt Adresse & Notizen
/>;
```

**Features:**

- ✅ Anrede-Select (Herr/Frau/Divers)
- ✅ Titel-Select (Dr., Prof., etc.)
- ✅ Vor-/Nachname (required)
- ✅ E-Mail, Telefon
- ✅ Adresse (optional)
- ✅ Notizen (optional)
- ✅ Responsive Grid (grid-cols-1 sm:grid-cols-2)
- ✅ CI-Farben konform

**Verfügbare Titel:**

```typescript
const TITLES = [
  { value: "", label: "Kein Titel" },
  { value: "Dr.", label: "Dr." },
  { value: "Prof.", label: "Prof." },
  { value: "Prof. Dr.", label: "Prof. Dr." },
  { value: "Dr. med.", label: "Dr. med." },
  { value: "Dr. rer. nat.", label: "Dr. rer. nat." },
  { value: "Dipl.-Ing.", label: "Dipl.-Ing." },
];
```

---

### 2️⃣ **InlineCustomerForm.tsx** (Schnell-Erstellung)

**Pfad:** `src/components/forms/InlineCustomerForm.tsx`

**Verwendung:**

```tsx
import { InlineCustomerForm } from "@/components/forms/InlineCustomerForm";

{
  showInlineForm && (
    <InlineCustomerForm
      onCustomerCreated={(customerId) => {
        setFormData({ ...formData, customer_id: customerId });
        setShowInlineForm(false);
        fetchCustomers();
      }}
      onCancel={() => setShowInlineForm(false)}
    />
  );
}
```

**Features:**

- ✅ Inline-Erstellung ohne Seitenwechsel
- ✅ Automatische Auswahl nach Erstellung
- ✅ Nutzt PersonFormFields intern
- ✅ Toasts für Erfolg/Fehler

---

### 3️⃣ **AirportPickupFields.tsx** (Flughafen-Service)

**Pfad:** `src/components/forms/AirportPickupFields.tsx`

**Verwendung:**

```tsx
import { AirportPickupFields } from "@/components/forms/AirportPickupFields";

<AirportPickupFields
  enabled={formData.is_airport_pickup}
  onEnabledChange={(checked) => setFormData({ ...formData, is_airport_pickup: checked })}
  formData={{
    flight_number: formData.flight_number,
    terminal: formData.terminal,
    arrival_time: formData.arrival_time,
    wait_time: formData.wait_time,
    meet_and_greet: formData.meet_and_greet,
    name_sign: formData.name_sign,
  }}
  onChange={(field, value) => setFormData({ ...formData, [field]: value })}
/>;
```

**Features:**

- ✅ Checkbox zum Aktivieren/Deaktivieren
- ✅ Konditionale Anzeige (nur wenn enabled=true)
- ✅ Flugnummer, Terminal, Ankunftszeit
- ✅ Wartezeit in Minuten
- ✅ Meet & Greet Service mit Namensschild

---

### 4️⃣ **TrainStationPickupFields.tsx** (Bahnhof-Service)

**Pfad:** `src/components/forms/TrainStationPickupFields.tsx`

**Verwendung:**

```tsx
import { TrainStationPickupFields } from "@/components/forms/TrainStationPickupFields";

<TrainStationPickupFields
  enabled={formData.is_train_station_pickup}
  onEnabledChange={(checked) => setFormData({ ...formData, is_train_station_pickup: checked })}
  formData={{
    train_number: formData.train_number,
    arrival_time: formData.arrival_time,
    wait_time: formData.wait_time,
    meet_and_greet: formData.meet_and_greet,
    name_sign: formData.name_sign,
  }}
  onChange={(field, value) => setFormData({ ...formData, [field]: value })}
/>;
```

**Features:**

- ✅ Checkbox zum Aktivieren/Deaktivieren
- ✅ Konditionale Anzeige (nur wenn enabled=true)
- ✅ Zugnummer, Ankunftszeit
- ✅ Wartezeit in Minuten
- ✅ Meet & Greet Service mit Namensschild

---

## 📄 SEITEN-INTEGRATION

### ✅ **Aufträge (Auftraege.tsx)**

**Status:** 🟢 Implementiert

**Features:**

- Inline-Kunden-Erstellung im Dialog
- "Neu"-Button neben Kunden-Select
- Automatisches Refresh nach Anlage

**Code:**

```tsx
{
  showInlineCustomerForm ? (
    <InlineCustomerForm
      onCustomerCreated={(customerId) => {
        setFormData({ ...formData, customer_id: customerId });
        setShowInlineCustomerForm(false);
        fetchCustomers();
      }}
      onCancel={() => setShowInlineCustomerForm(false)}
    />
  ) : (
    <div>
      <div className="flex items-center justify-between">
        <Label>Kunde</Label>
        <Button onClick={() => setShowInlineCustomerForm(true)}>
          <UserPlus /> Neu
        </Button>
      </div>
      <Select>{/* ... */}</Select>
    </div>
  );
}
```

---

### ⏳ **Kunden (Kunden.tsx)**

**Status:** 🟡 Ausstehend

**Zu implementieren:**

```tsx
import { PersonFormFields } from "@/components/forms/PersonFormFields";

// Im Formular:
<PersonFormFields
  formData={formData}
  onChange={(field, value) => setFormData((prev) => ({ ...prev, [field]: value }))}
  requiredFields={["salutation", "first_name", "last_name", "phone"]}
  showExtendedFields={true}
/>;
```

**Zusätzliche Felder (nach PersonFormFields):**

```tsx
<div>
  <Label>Portal-Zugang aktivieren</Label>
  <Switch checked={formData.has_portal_access} />
</div>

<div>
  <Label>Kreditlimit</Label>
  <Input type="number" value={formData.credit_limit} />
</div>
```

---

### ⏳ **Fahrer (Fahrer.tsx)**

**Status:** 🟡 Ausstehend

**Zu implementieren:**

```tsx
import { PersonFormFields } from "@/components/forms/PersonFormFields";

<PersonFormFields
  formData={formData}
  onChange={(field, value) => setFormData((prev) => ({ ...prev, [field]: value }))}
  requiredFields={["salutation", "first_name", "last_name", "phone", "license_number"]}
  showExtendedFields={true}
/>;

{
  /* Fahrer-spezifische Felder */
}
<div>
  <Label>Führerscheinnummer *</Label>
  <Input
    value={formData.license_number}
    onChange={(e) => setFormData((prev) => ({ ...prev, license_number: e.target.value }))}
    required
  />
</div>;
```

---

### ⏳ **Schichtzettel (Schichtzettel.tsx)**

**Status:** 🟡 Ausstehend

**Hinweis:** Keine Personen-Felder, aber konsistentes Design verwenden.

---

## 🔧 IMPLEMENTIERUNGS-CHECKLISTE

### ✅ **Für jede neue Seite mit Personen-Daten:**

1. [ ] Import PersonFormFields
2. [ ] Anrede & Titel als Pflichtfelder (außer begründete Ausnahme)
3. [ ] TypeScript-Typen korrekt definieren:
   ```typescript
   salutation: formData.salutation as "Herr" | "Frau" | "Divers" | null;
   ```
4. [ ] Supabase INSERT mit korrekten Typen
5. [ ] Mobile-Optimierung (grid-cols-1 sm:grid-cols-2)
6. [ ] CI-Farben verwenden (bg-background, text-accent)
7. [ ] Toasts für Erfolg/Fehler

---

## 🚫 VERBOTEN

### ❌ **Diese Dinge NIEMALS tun:**

1. ❌ Anrede/Titel als optionale Felder behandeln
2. ❌ Eigene Anrede-Selects bauen (immer PersonFormFields!)
3. ❌ Direkte Farben verwenden (nur semantic tokens!)
4. ❌ Formulare ohne Inline-Erstellung (wo sinnvoll)
5. ❌ TypeScript-Errors ignorieren (Typen korrekt casten!)

---

## 📝 BEISPIEL: Vollständiges Formular

```tsx
import { PersonFormFields } from "@/components/forms/PersonFormFields";
import { InlineCustomerForm } from "@/components/forms/InlineCustomerForm";

function MyForm() {
  const [formData, setFormData] = useState({
    salutation: "",
    title: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.from("customers").insert([
      {
        company_id: profile.company_id,
        salutation: (formData.salutation as "Herr" | "Frau" | "Divers" | null) || null,
        title: formData.title || null,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        notes: formData.notes || null,
      },
    ]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PersonFormFields
        formData={formData}
        onChange={handleChange}
        requiredFields={["salutation", "first_name", "last_name", "phone"]}
        showExtendedFields={true}
      />

      <Button type="submit">Speichern</Button>
    </form>
  );
}
```

---

## 🎯 NÄCHSTE SCHRITTE

### Sprint 1 (Sofort):

1. ✅ PersonFormFields.tsx erstellt
2. ✅ InlineCustomerForm.tsx erstellt
3. ✅ Auftraege.tsx integriert
4. ⏳ Kunden.tsx integrieren
5. ⏳ Fahrer.tsx integrieren

### Sprint 2 (Später):

6. ⏳ Partner.tsx integrieren
7. ⏳ Einstellungen.tsx (User-Profile)

---

## 📞 SUPPORT & FRAGEN

Bei Problemen oder Unklarheiten:

1. Prüfe diese Dokumentation
2. Schaue in PersonFormFields.tsx (Referenz-Implementierung)
3. Prüfe Auftraege.tsx (Beispiel Inline-Erstellung)

**Nie selbst bauen, was es schon gibt!**

---

**Version:** 1.0  
**Erstellt:** 15.10.2025, 08:00 Uhr  
**Autor:** AI-Agent (Claude Sonnet 4)  
**Status:** 🟢 Production Ready  
**Priorität:** 🔴 P0 - KRITISCH

**NIEMALS ÜBERSCHREIBEN ODER ÄNDERN!**
