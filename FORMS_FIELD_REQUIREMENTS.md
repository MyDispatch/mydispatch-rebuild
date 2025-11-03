# Formularfelder-Anforderungen MyDispatch V18.1

Vollständige Dokumentation aller Pflichtfelder und optionalen Felder für alle Formulare.

---

## 🚗 1. Fahreranlage (src/pages/Fahrer.tsx)

### Profilbild
- **profile_image_url** (optional) - Upload JPG, PNG, WEBP (max. 5 MB)

### Persönliche Daten
- **salutation*** (Pflicht) - Enum: "Herr", "Frau", "Divers"
- **title** (optional) - Akademischer Titel (Prof., Dr., Dr. Dr., etc.)
- **first_name*** (Pflicht) - Vorname (String, max. 100 Zeichen)
- **last_name*** (Pflicht) - Nachname (String, max. 100 Zeichen)

### Kontaktdaten
- **email*** (Pflicht) - E-Mail (String, Validierung)
- **phone*** (Pflicht) - Telefon (String, Format: +49 XXX XXXXXXX)

### Adresse (Google Places Autocomplete)
- **street*** (Pflicht) - Straße (String)
- **street_number*** (Pflicht) - Hausnummer (String)
- **postal_code*** (Pflicht) - PLZ (String)
- **city*** (Pflicht) - Ort (String)
- **address** (auto-generiert) - Vollständige Adresse kombiniert aus obigen Feldern

### Führerscheindaten (Pflicht)
- **license_number*** (Pflicht) - Führerscheinnummer (String, alphanumerisch)
- **license_expiry_date*** (Pflicht) - Ablaufdatum Führerschein (Date, Format: DD.MM.JJJJ)
- **license_classes*** (Pflicht, mind. 1) - Mehrfachauswahl (Array):
  - AM (Moped)
  - A1 (Leichtkraftrad)
  - A2 (Motorrad beschränkt)
  - A (Motorrad)
  - B (PKW)
  - BE (PKW + Anhänger)
  - C1 (LKW bis 7,5t)
  - C1E (LKW + Anhänger)
  - C (LKW)
  - CE (LKW + Anhänger)
  - D1 (Kleinbus)
  - D1E (Kleinbus + Anhänger)
  - D (Bus)
  - DE (Bus + Anhänger)
  - T (Traktor)
  - L (Land-/Forstwirtschaft)

### Wichtige Dokumente
- **fuehrerschein_document*** (Pflicht) - File Upload (max. 10 MB, .pdf, .jpg, .jpeg, .png)
- **p_schein_document** (optional) - P-Schein (Personenbeförderungsschein) - File Upload (max. 10 MB)

### Status
- **shift_status*** (Pflicht) - Enum: "offline", "on_duty", "available", "busy", "break" (Default: "offline")

### System-Felder (automatisch)
- **company_id** - Multi-Tenant Isolation
- **archived** - Soft Delete (boolean, default: false)
- **created_at** - Eingangsstempel (immutable)
- **updated_at** - Letzte Änderung

---

## 🚙 2. Fahrzeuganlage (src/pages/Fahrzeuge.tsx)

### Profilbild
- **profile_image_url** (optional) - Upload JPG, PNG, WEBP (max. 5 MB)

### Fahrzeugdaten
- **license_plate*** (Pflicht) - Kennzeichen (String, Format: XX-XX 1234, UPPERCASE)
- **brand*** (Pflicht) - Marke (String, z.B. Mercedes-Benz, BMW, VW)
- **model*** (Pflicht) - Modell (String, z.B. E-Klasse, 5er, Passat)
- **year*** (Pflicht) - Baujahr (Integer, min: 1900, max: aktuelles Jahr + 1)
- **vehicle_class*** (Pflicht) - Enum:
  - "Economy Class (1-4 Pax)"
  - "Business Class - Limousine (1-4 Pax)"
  - "Business Class - Kombi (1-4 Pax)"
  - "First Class (1-3 Pax)"
  - "Van / SUV (1-8 Pax)"
- **tuev_expiry_date*** (Pflicht) - TÜV-Ablauf (Date, Format: DD.MM.JJJJ)

### Konzessionsdaten (Pflicht pro Fahrzeug)
- **concession_number*** (Pflicht) - Konzessionsnummer (String, z.B. KO-12345)
- **concession_document*** (Pflicht) - Konzessions-Dokument Upload (max. 10 MB, .pdf, .jpg, .jpeg, .png)

### Erweiterte Fahrzeugdaten
- **vin** (optional) - Fahrzeug-Identifikationsnummer (FIN/VIN) (String, 17 Zeichen)
- **fuel_type** (optional) - Kraftstoffart (Enum: "Benzin", "Diesel", "Elektro", "Hybrid", "Erdgas", "Wasserstoff")
- **seats** (optional) - Sitzplätze (Integer, min: 1, max: 9, default: 4)
- **mileage** (optional) - Aktueller Kilometerstand (Integer, min: 0, default: 0)

### KFZ-Versicherung
- **insurance_company** (optional) - Versicherungsgesellschaft (String, z.B. Allianz, HUK-Coburg)
- **insurance_policy_number** (optional) - Versicherungsnummer (String)
- **insurance_start_date** (optional) - Versicherungsbeginn (Date)
- **insurance_end_date** (optional) - Versicherungsende (Date)
- **insurance_type** (optional) - Versicherungsart (Enum: "Haftpflicht", "Teilkasko", "Vollkasko")
- **insurance_annual_premium** (optional) - Jahresprämie (Decimal, min: 0, default: 0)

### Wartung & Service
- **last_service_date** (optional) - Letzter Service (Date)
- **next_service_date** (optional) - Nächster Service (Date)
- **service_interval_km** (optional) - Service-Intervall (Integer, km, default: 15000)

### Status
- **status*** (Pflicht) - Enum: "available", "im_einsatz", "wartung", "defekt" (Default: "available")
- **assigned_driver_id** (optional) - Zugewiesener Fahrer (FK zu drivers.id)

### System-Felder (automatisch)
- **company_id** - Multi-Tenant Isolation
- **archived** - Soft Delete (boolean, default: false)
- **created_at** - Eingangsstempel (immutable)
- **updated_at** - Letzte Änderung

---

## 👤 3. Kundenanlage (src/pages/Kunden.tsx)

### Persönliche Daten
- **salutation*** (Pflicht) - Enum: "Herr", "Frau", "Divers"
- **title** (optional) - Akademischer Titel (Prof., Dr., Dr. Dr., etc.)
- **first_name*** (Pflicht) - Vorname (String, max. 100 Zeichen)
- **last_name*** (Pflicht) - Nachname (String, max. 100 Zeichen)

### Kontaktdaten
- **email*** (Pflicht) - E-Mail (String, Validierung)
- **phone*** (Pflicht) - Telefon (String, Format: +49 XXX XXXXXXX)

### Kundentyp
- **customer_type*** (Pflicht) - Enum: "Privatkunde", "Geschäftskunde" (Default: "Privatkunde")
- **company_name** (optional, Pflicht bei Geschäftskunde) - Firmenname (String)
- **tax_id** (optional, Pflicht bei Geschäftskunde) - USt-IdNr. (String, Format: DE123456789)

### Adresse (Google Places Autocomplete)
- **street*** (Pflicht) - Straße (String)
- **street_number*** (Pflicht) - Hausnummer (String)
- **postal_code*** (Pflicht) - PLZ (String)
- **city*** (Pflicht) - Ort (String)
- **address** (auto-generiert) - Vollständige Adresse kombiniert aus obigen Feldern

### Rechnungsdaten (optional)
- **billing_street** (optional) - Rechnungsstraße (falls abweichend)
- **billing_street_number** (optional) - Rechnungshausnummer
- **billing_postal_code** (optional) - Rechnungs-PLZ
- **billing_city** (optional) - Rechnungsort
- **billing_address** (auto-generiert) - Vollständige Rechnungsadresse

### Zahlungsinformationen
- **credit_limit** (optional) - Kreditlimit (Decimal, min: 0, default: 0, Currency: EUR)
- **payment_term_days** (optional) - Zahlungsziel (Integer, Tage, default: 14)
- **discount_percentage** (optional) - Skonto (Decimal, %, min: 0, max: 100, default: 0)

### Portal-Zugang
- **has_portal_access** (optional) - Portal-Zugang aktiviert (boolean, default: false)

### Notizen
- **notes** (optional) - Notizen (Text)

### System-Felder (automatisch)
- **company_id** - Multi-Tenant Isolation
- **is_manually_created** - Unterscheidung manuelle/automatische Anlage (boolean)
- **outstanding_balance** - Offener Betrag (Decimal, auto-berechnet)
- **archived** - Soft Delete (boolean, default: false)
- **created_at** - Eingangsstempel (immutable)
- **updated_at** - Letzte Änderung

---

## 📍 Adressfelder - Systemweite Standards

**WICHTIG:** Alle Adressfelder verwenden Google Places Autocomplete API.

### Einzelfelder (für DB-Speicherung):
- **street** - Straße
- **street_number** - Hausnummer
- **postal_code** - PLZ
- **city** - Ort
- **country** (optional) - Land (default: "Deutschland")

### Auto-Generiert:
- **address** - Vollständige Adresse: "{street} {street_number}, {postal_code} {city}"

### Komponente:
- **AddressInput.tsx** - Wiederverwendbar für alle Formulare
- API: Google Places Autocomplete (GOOGLE_API_KEY aus Secrets)
- Features:
  - Auto-Vervollständigung beim Tippen
  - Automatisches Ausfüllen aller Einzelfelder
  - Debouncing (500ms)
  - Manuelle Bearbeitung erlaubt
  - Validierung aller Pflichtfelder

---

## 🔒 DSGVO-Hinweise

Alle Formulare enthalten:
- DSGVONotice-Komponente
- Cookie-Consent-Integration
- Datenschutz-Link
- AGB-Link
- Einwilligungserklärungen (bei sensiblen Daten wie GPS-Tracking)

---

## 📋 Validierungsregeln

### E-Mail:
- Format: RFC 5322 Standard
- max. 255 Zeichen

### Telefon:
- Format: +49 (0)XXX XXXXXXX oder 0XXX XXXXXXX
- Speicherung: Normalisiert (+49XXXXXXXXXX)

### Datum:
- Format Eingabe: DD.MM.JJJJ (de-DE)
- Format Speicherung: ISO 8601 (YYYY-MM-DD)

### Währung:
- Format Anzeige: 1.234,56 € (de-DE)
- Format Speicherung: Decimal(10,2)

### Datei-Uploads:
- max. Dateigröße: 10 MB
- Erlaubte Formate: .pdf, .jpg, .jpeg, .png
- Speicherung: Supabase Storage (Bucket: documents)

---

## 🔄 Migration TODO

Folgende Datenbankfelder müssen hinzugefügt werden:

### drivers Tabelle:
```sql
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS salutation salutation_type;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS street TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS street_number TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS license_expiry_date DATE;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS license_classes TEXT[];
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
```

### vehicles Tabelle:
```sql
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS model TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS tuev_expiry_date DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS vin TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS fuel_type TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS seats INTEGER DEFAULT 4;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS mileage INTEGER DEFAULT 0;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS insurance_company TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS insurance_policy_number TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS insurance_start_date DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS insurance_end_date DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS insurance_type TEXT;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS insurance_annual_premium NUMERIC(10,2) DEFAULT 0;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS last_service_date DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS next_service_date DATE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS service_interval_km INTEGER DEFAULT 15000;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
```

### customers Tabelle:
```sql
ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_type TEXT DEFAULT 'Privatkunde';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS tax_id TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS street TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS street_number TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_street TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_street_number TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_postal_code TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_city TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_address TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS payment_term_days INTEGER DEFAULT 14;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC(5,2) DEFAULT 0;
```

---

**Version:** V18.1  
**Datum:** 15.10.2025  
**Status:** ✅ Final und verbindlich
