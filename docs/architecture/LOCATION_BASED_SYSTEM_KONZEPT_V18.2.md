# 🌍 Location-Based System & Adress-/Anrede-Konsistenz - MyDispatch V18.2

**Version:** 18.2.6  
**Datum:** 17.10.2025, 17:00 Uhr  
**Status:** 🟡 Konzept & Implementierungsplan

---

## 📋 EXECUTIVE SUMMARY

MyDispatch muss **location-aware** werden. Jedes Unternehmen hat einen Standort (z.B. München, Köln, Berlin), und **alle systemweiten Features** müssen sich dynamisch daran anpassen:

- **Wetter & Verkehr**: Automatisch für Firmenstandort
- **GPS-Tracking**: Zentrum der Live-Map = Firmenadresse
- **Adressfelder**: Einheitlich in allen Forms (Straße, Hausnummer, PLZ, Ort)
- **Anrede-Felder**: Systemweit (Herr, Frau, Divers)
- **Standort-spezifische Defaults**: Zeitzonen, Vorwahlen, etc.

**Ziel:** Ein Unternehmen in München sieht München-Wetter, München-Verkehr, München als GPS-Zentrum. Bei Umzug nach Köln ändert sich alles automatisch.

---

## 🎯 SYSTEMARCHITEKTUR

### 1. Company Location als Single Source of Truth

```typescript
// companies Tabelle (ERWEITERN)
interface Company {
  // ... existing fields
  
  // LOCATION-BASED (NEU)
  address: string;           // "Maximilianstraße 12, 80539 München"
  street: string;            // "Maximilianstraße"
  street_number: string;     // "12"
  postal_code: string;       // "80539"
  city: string;              // "München"
  
  // GEO-KOORDINATEN (NEU - für GPS/Maps)
  latitude: number;          // 48.1351
  longitude: number;         // 11.5820
  
  // LOCATION-METADATA (NEU)
  timezone: string;          // "Europe/Berlin"
  country_code: string;      // "DE"
  phone_prefix: string;      // "+49"
  
  // ANSPRECHPARTNER (NEU - systemweit)
  representative_salutation: 'Herr' | 'Frau' | 'Divers';
  representative_title: string;        // "Dr."
  representative_first_name: string;   // "Max"
  representative_last_name: string;    // "Mustermann"
}
```

### 2. Location-Based Feature Matrix

| **Feature** | **Abhängig von** | **Implementierung** | **Status** |
|-------------|------------------|---------------------|------------|
| **Weather Widget** | `company.city` | OpenWeatherMap API | ✅ Implementiert (manuell) |
| **Traffic Widget** | `company.latitude`, `company.longitude` | HERE Traffic API | ✅ Implementiert (hardcoded München) |
| **GPS Live-Map Zentrum** | `company.latitude`, `company.longitude` | HERE Maps v3 `setCenter()` | ❌ Fehlt |
| **Booking-Widget City Default** | `company.city` | Pre-fill Dropdowns | ❌ Fehlt |
| **Anrede-Felder** | `ENUM salutation` | Systemweite Komponente | 🟡 Teilweise (inkonsistent) |
| **Adress-Felder** | `street`, `street_number`, `postal_code`, `city` | AddressInput.tsx | 🟡 Vorhanden, nicht überall genutzt |
| **Timezone Handling** | `company.timezone` | date-fns-tz | ❌ Fehlt |
| **Phone Number Validation** | `company.phone_prefix` | libphonenumber-js | ❌ Fehlt |

---

## 🔧 IMPLEMENTIERUNGSPLAN

### Phase 1: Company Location Backend (P0 - KRITISCH)

**Datenbank-Migration:**

```sql
-- LOCATION-BASED ERWEITERUNGEN
ALTER TABLE companies 
ADD COLUMN street TEXT,
ADD COLUMN street_number TEXT,
ADD COLUMN postal_code TEXT,
ADD COLUMN city TEXT,
ADD COLUMN latitude NUMERIC(9,6),
ADD COLUMN longitude NUMERIC(9,6),
ADD COLUMN timezone TEXT DEFAULT 'Europe/Berlin',
ADD COLUMN country_code TEXT DEFAULT 'DE',
ADD COLUMN phone_prefix TEXT DEFAULT '+49';

-- ANSPRECHPARTNER (REPRÄSENTANT) - Bereits teilweise vorhanden!
-- representative_salutation ENUM bereits vorhanden
-- representative_title TEXT bereits vorhanden
-- representative_first_name TEXT bereits vorhanden
-- representative_last_name TEXT bereits vorhanden

-- GEOCODING TRIGGER (Automatische Koordinaten-Berechnung)
CREATE OR REPLACE FUNCTION update_company_coordinates()
RETURNS TRIGGER AS $$
BEGIN
  -- Wenn Adresse geändert wird → Geocoding via HERE API
  IF NEW.address IS DISTINCT FROM OLD.address THEN
    -- Edge Function aufrufen: geocode-address
    -- Koordinaten in latitude/longitude speichern
    NULL; -- Placeholder, Edge Function implementierung separat
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER company_address_geocode
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_company_coordinates();
```

**Edge Function: `geocode-company-address`**

```typescript
// supabase/functions/geocode-company-address/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { address } = await req.json();
  const HERE_API_KEY = Deno.env.get("HERE_API_KEY");
  
  // HERE Geocoding API
  const response = await fetch(
    `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${HERE_API_KEY}`
  );
  
  const data = await response.json();
  const position = data.items?.[0]?.position;
  
  return new Response(JSON.stringify({
    latitude: position?.lat,
    longitude: position?.lng,
  }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

---

### Phase 2: Einstellungen-Tab "Standort" (P0 - KRITISCH)

**Neuer Tab in Einstellungen.tsx:**

```tsx
// Tab 8: Standort
<TabsContent value="location">
  <Card>
    <CardHeader>
      <CardTitle>Unternehmensstandort</CardTitle>
      <CardDescription>
        Alle Wetter-, Verkehrs- und GPS-Funktionen richten sich nach diesem Standort
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Address Input Component */}
      <AddressInput
        street={companyData.street || ''}
        streetNumber={companyData.street_number || ''}
        postalCode={companyData.postal_code || ''}
        city={companyData.city || ''}
        onAddressChange={(address) => {
          setCompanyData({
            ...companyData,
            street: address.street,
            street_number: address.streetNumber,
            postal_code: address.postalCode,
            city: address.city,
            // Trigger Geocoding
            address: `${address.street} ${address.streetNumber}, ${address.postalCode} ${address.city}`,
          });
        }}
        onStreetChange={(value) => setCompanyData({...companyData, street: value})}
        onStreetNumberChange={(value) => setCompanyData({...companyData, street_number: value})}
        onPostalCodeChange={(value) => setCompanyData({...companyData, postal_code: value})}
        onCityChange={(value) => setCompanyData({...companyData, city: value})}
        label="Firmenadresse"
        placeholder="Straße eingeben..."
      />
      
      {/* Koordinaten-Anzeige (readonly) */}
      {companyData.latitude && companyData.longitude && (
        <div className="p-4 bg-muted rounded-md">
          <p className="text-sm font-medium">GPS-Koordinaten (automatisch)</p>
          <p className="text-xs text-muted-foreground mt-1">
            Lat: {companyData.latitude} | Lng: {companyData.longitude}
          </p>
        </div>
      )}
      
      {/* Live-Preview: Wetter */}
      {companyData.city && (
        <div>
          <Label>Live-Vorschau: Wetter in {companyData.city}</Label>
          <LiveWeather city={companyData.city} />
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>
```

---

### Phase 3: Location-Aware Widgets (P0 - KRITISCH)

**Weather Widget:**

```tsx
// VORHER (hardcoded):
<WeatherWidget city="München" />

// NACHHER (dynamic):
export function WeatherWidget() {
  const { company } = useAuth();
  
  return <LiveWeather city={company?.city || 'München'} />;
}
```

**Traffic Widget:**

```tsx
// VORHER (hardcoded München-Koordinaten):
const routes = [
  { name: 'A9 München-Nord', origin: '48.1351,11.5820' },
];

// NACHHER (dynamic um Firmenstandort):
const { company } = useAuth();

const routes = [
  { 
    name: `${company.city} Zentrum`, 
    origin: `${company.latitude},${company.longitude}` 
  },
  { 
    name: `${company.city} Nord`, 
    origin: `${company.latitude + 0.05},${company.longitude}` 
  },
  { 
    name: `${company.city} Süd`, 
    origin: `${company.latitude - 0.05},${company.longitude}` 
  },
];
```

**GPS Live-Map:**

```tsx
// src/components/dashboard/LiveMap.tsx
export function LiveMap() {
  const { company } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mapRef.current || !company?.latitude || !company?.longitude) return;
    
    const platform = new H.service.Platform({
      apikey: HERE_API_KEY,
    });
    
    const defaultLayers = platform.createDefaultLayers();
    const map = new H.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      {
        // DYNAMISCHES ZENTRUM BASIEREND AUF FIRMENSTANDORT
        center: { lat: company.latitude, lng: company.longitude },
        zoom: 12,
      }
    );
    
    // Firmen-Marker hinzufügen
    const companyMarker = new H.map.Marker({
      lat: company.latitude,
      lng: company.longitude,
    });
    map.addObject(companyMarker);
    
    // ... rest of map logic
  }, [company]);
  
  return <div ref={mapRef} className="h-full w-full" />;
}
```

---

### Phase 4: Systemweite Adress-/Anrede-Konsistenz (P1 - WICHTIG)

#### 4.1 Anrede-Felder (ENUM salutation)

**Status:** 🟡 Teilweise implementiert (inkonsistent)

**Implementierte Stellen:**
- ✅ `PersonFormFields.tsx` (Komponente vorhanden)
- ✅ `InlineCustomerForm.tsx` (nutzt PersonFormFields)
- ✅ Fahrer.tsx (formData.salutation)
- ✅ Kunden.tsx (formData.salutation)

**Fehlende Stellen:**
- ❌ `UnifiedForm.tsx` (Aufträge/Angebote/Rechnungen) - Kunden-Anrede fehlt!
- ❌ `PartnerForm.tsx` (Partner) - Anrede fehlt!
- ❌ `ShiftForm.tsx` (Schichtzettel) - Fahrer-Anrede fehlt (aber eigentlich nicht nötig)
- ❌ Einstellungen Tab "Unternehmensprofil" - Repräsentanten-Anrede fehlt!

**TODO:**
1. `UnifiedForm.tsx` erweitern:
   ```tsx
   // Kunden-Sektion:
   <PersonFormFields
     formData={{
       salutation: formData.customer_salutation,
       title: formData.customer_title,
       first_name: formData.customer_first_name,
       last_name: formData.customer_last_name,
       // ...
     }}
     onChange={(field, value) => setFormData({
       ...formData,
       [`customer_${field}`]: value,
     })}
     isRequired={(field) => ['salutation', 'first_name', 'last_name'].includes(field)}
   />
   ```

2. Einstellungen Tab 2 erweitern:
   ```tsx
   // Repräsentant (Geschäftsführer)
   <div className="space-y-4">
     <Label>Geschäftsführer / Repräsentant</Label>
     <PersonFormFields
       formData={{
         salutation: companyData.representative_salutation,
         title: companyData.representative_title,
         first_name: companyData.representative_first_name,
         last_name: companyData.representative_last_name,
       }}
       onChange={(field, value) => setCompanyData({
         ...companyData,
         [`representative_${field}`]: value,
       })}
       isRequired={(field) => ['salutation', 'first_name', 'last_name'].includes(field)}
     />
   </div>
   ```

#### 4.2 Adress-Felder (street, street_number, postal_code, city)

**Status:** 🟡 AddressInput.tsx vorhanden, aber nicht überall genutzt

**Implementierte Stellen:**
- ✅ `InlineCustomerForm.tsx` (nutzt AddressInput)
- ✅ Aufträge (pickup_address, dropoff_address als Text-Felder - MANUELL!)

**Fehlende Stellen:**
- ❌ Kunden.tsx - Nutzt NICHT AddressInput! (formData.address als einzelnes Feld)
- ❌ Fahrer.tsx - Nutzt NICHT AddressInput! (formData.address als einzelnes Feld)
- ❌ Einstellungen Tab 2 (Unternehmensprofil) - Nutzt einzelnes address-Feld!
- ❌ Einstellungen Tab 8 (Standort) - MUSS AddressInput nutzen! ⭐ NEU

**TODO:**
1. **Kunden.tsx refactoren:**
   ```tsx
   // VORHER: Einzelnes address-Feld
   <Input value={formData.address} onChange={...} />
   
   // NACHHER: AddressInput-Komponente
   <AddressInput
     street={formData.street || ''}
     streetNumber={formData.street_number || ''}
     postalCode={formData.postal_code || ''}
     city={formData.city || ''}
     onAddressChange={(address) => {
       setFormData({
         ...formData,
         street: address.street,
         street_number: address.streetNumber,
         postal_code: address.postalCode,
         city: address.city,
         address: `${address.street} ${address.streetNumber}, ${address.postalCode} ${address.city}`,
       });
     }}
     onStreetChange={...}
     onStreetNumberChange={...}
     onPostalCodeChange={...}
     onCityChange={...}
   />
   ```

2. **Fahrer.tsx refactoren:** (analog zu Kunden.tsx)

3. **Einstellungen Tab 2 refactoren:** (Unternehmensprofil - Firmenadresse)

4. **Einstellungen Tab 8 erstellen:** (Standort - mit GPS-Koordinaten-Anzeige)

---

### Phase 5: Booking-Widget Location Defaults (P2 - GEPLANT)

**Ziel:** Wenn Kunde über gebrandete Landingpage bucht, soll City/PLZ automatisch vorausgefüllt sein.

```tsx
// src/components/booking/BookingWidget.tsx
export function BookingWidget({ companySlug }: { companySlug: string }) {
  const [company, setCompany] = useState<Company | null>(null);
  
  useEffect(() => {
    // Company-Daten abrufen
    const fetchCompany = async () => {
      const { data } = await supabase
        .from('companies')
        .select('*')
        .eq('company_slug', companySlug)
        .single();
      
      setCompany(data);
    };
    
    fetchCompany();
  }, [companySlug]);
  
  const [formData, setFormData] = useState({
    pickup_city: company?.city || '',  // PRE-FILL!
    dropoff_city: company?.city || '',  // PRE-FILL!
    // ...
  });
  
  return (
    <form>
      {/* Abholort */}
      <AddressInput
        street={formData.pickup_street}
        city={formData.pickup_city} // Bereits vorausgefüllt mit München/Köln/etc.
        // ...
      />
    </form>
  );
}
```

---

## 📋 VOLLSTÄNDIGE TODO-LISTE

### 🔴 P0 - KRITISCH (SOFORT UMSETZEN)

1. **Datenbank-Migration: Company Location**
   - [ ] ALTER TABLE companies (street, street_number, postal_code, city, latitude, longitude, timezone, country_code, phone_prefix)
   - [ ] Geocoding-Trigger erstellen
   - [ ] Edge Function: geocode-company-address

2. **Einstellungen Tab 8: Standort**
   - [ ] Tab "Standort" hinzufügen
   - [ ] AddressInput integrieren
   - [ ] Koordinaten-Anzeige (readonly)
   - [ ] Live-Preview: Wetter-Widget
   - [ ] Save-Handler mit Geocoding

3. **Location-Aware Widgets**
   - [ ] WeatherWidget: city aus company.city
   - [ ] TrafficWidget: Routen dynamisch um company.latitude/longitude
   - [ ] LiveMap: Zentrum auf company.latitude/longitude
   - [ ] GPS-Tracking: Firmen-Marker auf Karte

4. **Adress-Konsistenz**
   - [ ] Kunden.tsx: AddressInput statt einzelnes address-Feld
   - [ ] Fahrer.tsx: AddressInput statt einzelnes address-Feld
   - [ ] Einstellungen Tab 2: AddressInput für Firmenadresse

5. **Anrede-Konsistenz**
   - [ ] UnifiedForm.tsx: PersonFormFields für Kunden-Anrede
   - [ ] Einstellungen Tab 2: PersonFormFields für Repräsentant

### 🟡 P1 - WICHTIG (DIESE WOCHE)

6. **Phone Number Validation**
   - [ ] libphonenumber-js installieren
   - [ ] usePhoneValidation Hook
   - [ ] Integration in alle Phone-Input-Felder (Kunden, Fahrer, Partner)

7. **Timezone Handling**
   - [ ] date-fns-tz installieren
   - [ ] useTz Hook (basierend auf company.timezone)
   - [ ] Alle Datum/Uhrzeit-Anzeigen in Unternehmens-Timezone

8. **Geocoding Cache**
   - [ ] Tabelle: geocoding_cache (address → lat/lng)
   - [ ] Cache-Lookup vor API-Call
   - [ ] 30-Tage-Retention

### 🟢 P2 - GEPLANT (NÄCHSTE 2 WOCHEN)

9. **Booking-Widget Location Defaults**
   - [ ] BookingWidget: city pre-fill aus company.city
   - [ ] Validierung: Pickup/Dropoff in Region (Radius 50km)

10. **Master-Dashboard Location Analytics**
    - [ ] Top 10 Städte nach Aufträgen
    - [ ] Heatmap: Aufträge nach Postleitzahl
    - [ ] Expansion-Empfehlungen (neue Städte)

---

## 🚀 IMPLEMENTIERUNGS-REIHENFOLGE

**Sprint 28 (7 Tage):**
- Tag 1-2: Datenbank-Migration + Edge Function
- Tag 3-4: Einstellungen Tab 8 (Standort)
- Tag 5: Location-Aware Widgets
- Tag 6: Adress-Konsistenz (Kunden, Fahrer)
- Tag 7: Anrede-Konsistenz (UnifiedForm, Einstellungen)

**Sprint 29 (3 Tage):**
- Tag 1: Phone Number Validation
- Tag 2: Timezone Handling
- Tag 3: Geocoding Cache

**Sprint 30 (2 Tage):**
- Tag 1: Booking-Widget Location Defaults
- Tag 2: Master-Dashboard Location Analytics

---

## 🎯 ERFOLGSKRITERIEN

**Location-Based System:**
- [x] Unternehmen in München → München-Wetter, München-Verkehr, München-GPS-Zentrum
- [x] Unternehmen in Köln → Köln-Wetter, Köln-Verkehr, Köln-GPS-Zentrum
- [x] Adress-Änderung → Automatisches Geocoding → Alle Widgets aktualisieren sich

**Adress-/Anrede-Konsistenz:**
- [x] Alle Forms nutzen AddressInput.tsx (street, street_number, postal_code, city)
- [x] Alle Forms nutzen PersonFormFields.tsx (salutation, title, first_name, last_name)
- [x] Keine inkonsistenten Einzelfelder mehr

**User Experience:**
- [x] Einstellungen → Standort ändern → Live-Preview von Wetter
- [x] GPS-Karte zentriert sich automatisch auf neuen Standort
- [x] Booking-Widget pre-filled mit Firmenstadt

---

## 📊 TECHNISCHE DETAILS

### HERE Geocoding API

```typescript
// Edge Function: geocode-company-address
const response = await fetch(
  `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${HERE_API_KEY}`
);

const data = await response.json();
const position = data.items?.[0]?.position;

return {
  latitude: position?.lat,
  longitude: position?.lng,
  formatted_address: data.items?.[0]?.address?.label,
};
```

### AddressInput.tsx Re-Use Pattern

```tsx
// STANDARD PATTERN (überall identisch):
<AddressInput
  street={formData.street || ''}
  streetNumber={formData.street_number || ''}
  postalCode={formData.postal_code || ''}
  city={formData.city || ''}
  onAddressChange={(address) => {
    setFormData({
      ...formData,
      street: address.street,
      street_number: address.streetNumber,
      postal_code: address.postalCode,
      city: address.city,
      address: `${address.street} ${address.streetNumber}, ${address.postalCode} ${address.city}`,
    });
  }}
  onStreetChange={(value) => setFormData({...formData, street: value})}
  onStreetNumberChange={(value) => setFormData({...formData, street_number: value})}
  onPostalCodeChange={(value) => setFormData({...formData, postal_code: value})}
  onCityChange={(value) => setFormData({...formData, city: value})}
/>
```

---

**Status:** 🟡 Konzept abgeschlossen | Bereit für Implementierung  
**Next:** Datenbank-Migration & Einstellungen Tab 8  
**Deadline:** Sprint 28 (7 Tage)
