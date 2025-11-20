# ✅ Sprint 28: TODO-CHECKLIST - Location-Based System & Konsistenz

**Version:** V18.2.6 (Sprint 27 ABGESCHLOSSEN inkl. Rebranding)  
**Datum:** 15.01.2025 - 22.01.2025  
**Status:** 🟢 BEREIT ZUR ABARBEITUNG | Sprint 27: 100% ✅ (12 Wellen inkl. MyDispatch Rebranding)

---

## 📋 WIE DIESE LISTE NUTZEN?

**Vor jeder Aufgabe:**

1. ✅ Aufgabe als "IN PROGRESS" markieren
2. ✅ Zeitstempel hinzufügen
3. ✅ Bei Problemen: Notizen einfügen

**Nach jeder Aufgabe:**

1. ✅ Aufgabe als "DONE" markieren
2. ✅ Code-Review durchführen
3. ✅ Testen (manuell oder automatisch)
4. ✅ Dokumentation aktualisieren

**Bei Blockers:**

1. ⚠️ Blocker dokumentieren
2. ⚠️ Alternativen diskutieren
3. ⚠️ Entscheidung durch Product Owner

---

## 🔴 TAG 1: BACKEND-FOUNDATION (Mo, 4.5h)

### ✅ 1.1 Datenbank-Migration: Company Location (1h)

**Status:** ✅ DONE  
**Zeitstempel:** 15.01.2025, 18:15 Uhr

**Durchgeführt:**

- ✅ ALTER TABLE companies: 9 neue Spalten (street, city, lat/lng, timezone, country_code, phone_prefix)
- ✅ Funktion: get_company_full_address() mit SECURITY INVOKER
- ✅ Trigger: update_company_location_timestamp()
- ✅ View: companies_with_full_address
- ✅ Index: idx_companies_location für Geo-Queries
- ✅ Security-Fixes: Function search_path = public

**Done:** ✅  
**Tester:** AI-Agent  
**Review:** ✅ Passed

---

### ✅ 1.2 Edge Function: geocode-company-address (1h)

**Status:** ✅ DONE  
**Zeitstempel:** 15.01.2025, 18:20 Uhr

**Durchgeführt:**

- ✅ Datei: supabase/functions/geocode-company-address/index.ts
- ✅ HERE Geocoding API Integration
- ✅ Input-Validierung (min. 5 Zeichen)
- ✅ Error Handling professionell
- ✅ CORS Headers

**Done:** ✅  
**Tester:** ---  
**Review:** ---

---

### ✅ 5.1 Datenbank-Migration: GPS Tables (2h)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] CREATE TABLE vehicle_positions
  - [ ] Spalten: vehicle_id, driver_id, latitude, longitude, speed, heading, accuracy, timestamp, company_id
  - [ ] RLS Policy: SELECT (company_id isolation)
  - [ ] RLS Policy: INSERT (company_id isolation)
- [ ] CREATE TABLE booking_tracking
  - [ ] Spalten: booking_id, tracking_token, active, started_at, ended_at, customer_notified, company_id
  - [ ] RLS Policy: SELECT (company_id isolation)
- [ ] CREATE TABLE gps_consent
  - [ ] Spalten: driver_id, consent_given, consent_date, consent_withdrawn_at, company_id
  - [ ] RLS Policy: SELECT/INSERT/UPDATE (company_id isolation)
- [ ] CREATE TABLE geofence_zones
  - [ ] Spalten: name, center_lat, center_lng, radius_meters, zone_type, active, company_id
  - [ ] RLS Policy: SELECT (company_id isolation)
- [ ] Test: INSERT Test-Daten
- [ ] Test: RLS funktioniert (kein Cross-Company-Access)

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

### ✅ 2.4 Database Schema Check: Address Fields (30min)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] Prüfe customers-Tabelle: `street`, `street_number`, `postal_code`, `city` vorhanden? ✅ JA!
- [ ] Prüfe drivers-Tabelle: Analog ✅ JA!
- [ ] Prüfe companies-Tabelle: Analog ❌ NEIN → siehe 1.1
- [ ] Dokumentiere: Alle Tabellen haben identische Adressfelder

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

## 🔴 TAG 2: EINSTELLUNGEN-TABS (Di, 5h)

### ✅ 1.4 Einstellungen Tab 8: Standort (3h)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] Tabs-UI erweitern: Neuer Tab "Standort"
- [ ] AddressInput-Komponente integrieren
- [ ] Geocoding-Button: Edge Function aufrufen
- [ ] Koordinaten-Anzeige (readonly, formatiert auf 4 Dezimalstellen)
- [ ] Live-Preview: WeatherWidget
- [ ] Save-Handler:
  - [ ] Speichere street, street_number, postal_code, city
  - [ ] Rufe geocode-company-address auf
  - [ ] Speichere latitude, longitude
  - [ ] Toast: handleSuccess("Standort gespeichert")
- [ ] Error Handling: handleError bei API-Fehlern
- [ ] Test: München-Adresse eingeben → Koordinaten erscheinen
- [ ] Test: Wetter-Preview zeigt München-Wetter

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

### ✅ 2.3 Einstellungen Tab 2: Firmenadresse (1h)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] Entscheide: AddressInput hier ODER Verweis auf Tab 8?
  - **Empfehlung:** Verweis auf Tab 8 ("Adresse in Tab 'Standort' bearbeiten")
- [ ] ODER: AddressInput auch hier (Redundanz OK für UX?)
- [ ] PersonFormFields für Repräsentant integrieren

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

### ✅ 2.6 Einstellungen Tab 2: Repräsentant-Anrede (1h)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] PersonFormFields für Geschäftsführer
- [ ] `representative_salutation`, `representative_title`, `representative_first_name`, `representative_last_name`
- [ ] Validierung: salutation, first_name, last_name REQUIRED
- [ ] Anzeige in E-Mail-Signaturen
- [ ] Test: Repräsentant speichern → In Office E-Mails verwenden

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

## 🔴 TAG 3: LOCATION-AWARE WIDGETS (Mi, 5h)

### ✅ 1.5 WeatherWidget Location-Aware (15min)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] `const { company } = useAuth();`
- [ ] `city={company?.city || 'München'}`
- [ ] Test: Unternehmen mit city="Köln" → Köln-Wetter anzeigen
- [ ] Test: Unternehmen ohne city → München-Wetter (Fallback)

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

### ✅ 1.6 TrafficWidget Location-Aware (30min)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] Routes dynamisch generieren:
  ```tsx
  const routes = [
    { name: `${company.city} Zentrum`, origin: `${company.latitude},${company.longitude}` },
    { name: `${company.city} Nord`, origin: `${company.latitude + 0.05},${company.longitude}` },
    { name: `${company.city} Süd`, origin: `${company.latitude - 0.05},${company.longitude}` },
  ];
  ```
- [ ] Fallback auf München bei fehlenden Koordinaten
- [ ] Test: Köln-Koordinaten → Köln-Verkehr anzeigen

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

### ✅ 1.7 LiveMap GPS-Zentrum Location-Aware (30min)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] Map-Zentrum: `center: { lat: company.latitude, lng: company.longitude }`
- [ ] Firmen-Marker hinzufügen (Pin-Icon)
- [ ] Marker-Tooltip: Company-Name + Adresse
- [ ] Zoom: 12 (Stadt-Level)
- [ ] Test: Standort ändern in Einstellungen → Karte zentriert neu

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

### ✅ 1.8 LiveInfoWidget Location-Aware (15min)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] VORHER: Split-Logic `company.address.split(',')[1]`
- [ ] NACHHER: `company.city` direkt
- [ ] Traffic: `company.latitude/longitude` statt hardcoded München
- [ ] Test: Funktionalität identisch

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

### ✅ 1.9 useCompanyLocation Hook (1h)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] Hook erstellen: `src/hooks/use-company-location.tsx`
- [ ] Export: city, latitude, longitude, timezone, countryCode, phonePrefix, hasLocation
- [ ] Fallbacks für alle Werte
- [ ] Dokumentation mit JSDoc
- [ ] Test: Hook in allen Widgets verwenden

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

### ✅ 4.1 Master-Dashboard Performance-Tab erweitern (2h)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] Bereits vorhanden: "analytics" Tab
- [ ] Erweitern: Durchschnittswerte
  - [ ] Ø Aufträge pro Unternehmen
  - [ ] Ø Fahrer pro Unternehmen
  - [ ] Ø Umsatz pro Unternehmen
- [ ] Charts mit recharts
- [ ] Responsive Design

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

## 🔴 TAG 4: ADRESS-KONSISTENZ TEIL 1 (Do, 4h)

### ✅ 2.1 Kunden.tsx: AddressInput Integration (2h)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] formData erweitern: `street`, `street_number`, `postal_code`, `city`
- [ ] Ersetze einzelnes `address`-Input durch AddressInput-Komponente
- [ ] onAddressChange Handler implementieren (kombiniert alle Felder)
- [ ] handleSaveCustomer: Alle neuen Felder speichern
- [ ] handleEditCustomer: Neue Felder laden
- [ ] Test: Neuen Kunden anlegen mit Autocomplete
- [ ] Test: Bestehenden Kunden bearbeiten (Backward-Compatibility)

**Backward-Compatibility:**

- [ ] Bestehende Kunden mit nur `address`-Feld → Funktionieren weiterhin
- [ ] Neue Kunden: Nutzen strukturierte Felder

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

### ✅ 2.2 Fahrer.tsx: AddressInput Integration (2h)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] Analog zu Kunden.tsx
- [ ] formData: `street`, `street_number`, `postal_code`, `city`
- [ ] AddressInput-Komponente
- [ ] handleSaveDriver: Neue Felder
- [ ] Test: Neuen Fahrer anlegen
- [ ] Test: Bestehenden Fahrer bearbeiten

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

## 🔴 TAG 5: ANREDE-KONSISTENZ (Fr, 6h)

### ✅ 2.5 UnifiedForm.tsx: Kunden-Anrede (2h)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] PersonFormFields-Komponente in UnifiedForm integrieren
- [ ] Neue formData-Felder:
  - [ ] `customer_salutation`
  - [ ] `customer_title`
  - [ ] `customer_first_name`
  - [ ] `customer_last_name`
  - [ ] `customer_phone`
  - [ ] `customer_email`
- [ ] InlineCustomerForm erweitern (falls nicht vorhanden)
- [ ] Beim Kunden-Anlegen: Felder übernehmen
- [ ] Validierung: salutation, first_name, last_name REQUIRED
- [ ] Test: Auftrag mit neuem Kunden anlegen
- [ ] Test: Auftrag mit bestehendem Kunden (Autocomplete)

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

### ✅ 2.7 PartnerForm.tsx: Ansprechpartner-Anrede (2h)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] **Entscheidung:** Partner = Unternehmen oder Person?
  - **Option A:** Partner ist Unternehmen → Ansprechpartner als Sub-Entity
  - **Option B:** Partner ist Person → PersonFormFields direkt
- [ ] **Empfehlung Option A:** Partner-Tabelle erweitern mit Ansprechpartner-Feldern
  - [ ] `contact_salutation`
  - [ ] `contact_title`
  - [ ] `contact_first_name`
  - [ ] `contact_last_name`
  - [ ] `contact_phone`
  - [ ] `contact_email`
- [ ] PersonFormFields in PartnerForm integrieren
- [ ] Test: Partner mit Ansprechpartner anlegen

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

### ✅ 2.8 Systemweite Anrede-Anzeige (2h)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] CustomersTable: Zeige "Herr Dr. Max Mustermann" statt "Max Mustermann"
- [ ] DriversTable: Analog
- [ ] PartnersTable: Ansprechpartner anzeigen
- [ ] DetailDialogs: Anrede prominent
- [ ] E-Mail-Templates: Nutze Anrede ("Sehr geehrter Herr Dr. Mustermann")
- [ ] Test: Kunden-Liste zeigt Anreden korrekt
- [ ] Test: E-Mail-Preview nutzt Anreden

**Helper-Function:**

```tsx
// src/lib/format-utils.ts
export const formatFullName = (
  salutation?: string,
  title?: string,
  firstName?: string,
  lastName?: string
): string => {
  const parts = [salutation, title, firstName, lastName].filter(Boolean);
  return parts.join(" ");
};

// Verwendung:
formatFullName("Herr", "Dr.", "Max", "Mustermann");
// Output: "Herr Dr. Max Mustermann"
```

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

## 🟡 TAG 6: CODE-CLEANUP WELLE 12 (Sa, 3.5h)

### ✅ 3.1 Master-Tools Error Handler Migration (1h)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] TerminationTool.tsx: 3 console.error → handleError
- [ ] PartnerConnectionList.tsx: 2 console.error → handleError
- [ ] PartnerRequestDialog.tsx: 1 console.error → handleError
- [ ] PartnerFilter.tsx: 1 console.error → handleError
- [ ] Imports hinzufügen: `import { handleError } from '@/lib/error-handler';`
- [ ] Test: Fehler werfen → Toast erscheint
- [ ] Test: Fehler in Supabase system_logs geloggt

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

### ✅ 3.2 Shared Components Error Handler Migration (1h)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] AISupportWidget.tsx: 1 console.error → handleError
- [ ] IntelligentAIChat.tsx: 2 console.error → handleError
- [ ] PDFExportDialog.tsx: 1 console.error → handleError
- [ ] FeatureGate.tsx: 1 console.error → handleError
- [ ] ConfirmationDialog.tsx: 1 console.error → handleError
- [ ] Imports hinzufügen

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

### ✅ 3.3 Chat Error Handler Migration (1h)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] ChatWindow.tsx: 3 console.error → handleError
- [ ] ConversationList.tsx: 2 console.error → handleError
- [ ] ParticipantSelector.tsx: 1 console.error → handleError
- [ ] Test: Chat-Fehler → Professionelle Toasts

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

### ✅ 3.4 WebRTC Debug-Logs Dokumentation (15min)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] CallInterface.tsx: Kommentar hinzufügen
  ```tsx
  // INTENTIONAL: Debug-Logs für WebRTC-Troubleshooting
  // NIEMALS ENTFERNEN - Kritisch für Daily.co Debugging
  console.log("Call joined successfully");
  ```
- [ ] use-daily-call.tsx: Analog
- [ ] Dokumentiere in SPRINT_27_PRODUCTION_READY_REPORT.md
  - [ ] "WebRTC Debug-Logs behalten: 10 Stellen in 2 Dateien"

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

## 🔴 TAG 7: GPS BACKEND (So, 6h)

### ✅ 5.2 Edge Functions: GPS Backend (4h)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] **calculate-eta** (1.5h)
  - [ ] HERE Routing API mit Traffic
  - [ ] Input: origin (lat,lng), destination (lat,lng), traffic=true
  - [ ] Output: { duration_seconds, distance_meters, arrival_time, traffic_delay_seconds }
  - [ ] Error Handling
- [ ] **calculate-route** (1.5h)
  - [ ] HERE Routing API
  - [ ] Input: waypoints[] (multiple stops)
  - [ ] Output: { route, distance, duration, polyline }
  - [ ] Route-Optimierung (optional)
- [ ] **cleanup-gps-positions** (1h)
  - [ ] Cron-Job (täglich 03:00 Uhr)
  - [ ] DELETE FROM vehicle_positions WHERE timestamp < NOW() - INTERVAL '24 hours'
  - [ ] DSGVO-konform (Art. 5 Abs. 1 lit. e)
- [ ] **notify-customer** (bereits vorhanden, prüfen)
  - [ ] Tracking-Link per E-Mail
  - [ ] SMS-Option (zukünftig)

**Test:**

- [ ] calculate-eta: München → Flughafen
- [ ] calculate-route: 3 Stops in München
- [ ] cleanup: Test-Daten älter 24h → Gelöscht

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

### ✅ Testing & Dokumentation (2h)

**Status:** ⬜ TODO  
**Zeitstempel:** ---

**Aufgaben:**

- [ ] Systemweiter Test aller Location-Features
  - [ ] Unternehmen in Einstellungen: München → Köln ändern
  - [ ] WeatherWidget zeigt Köln-Wetter
  - [ ] TrafficWidget zeigt Köln-Verkehr
  - [ ] LiveMap zentriert auf Köln
- [ ] Dokumentation aktualisieren:
  - [ ] MASTER_PROMPT_V18.2.md → V18.2.6
  - [ ] PROJECT_STATUS.md → Sprint 28 Abschluss
  - [ ] SPRINT_28_COMPLETION_REPORT.md erstellen
- [ ] Screenshot-Sammlung für Dokumentation

**Done:** ⬜  
**Tester:** ---  
**Review:** ---

---

## 🟡 SPRINT 29: GPS-TRACKING FRONTEND (5 TAGE)

### Tag 1: GPS-Consent & Driver PWA

**5.3 DriverTracking.tsx: GPS-Tracking PWA**

- [ ] Browser Geolocation API (navigator.geolocation.watchPosition)
- [ ] GPS-Consent-Dialog (DSGVO)
- [ ] Schicht-basiertes Tracking
- [ ] vehicle_positions INSERT alle 10s
- [ ] Error Handling

**Zeitaufwand:** 4h

---

### Tag 2: Dispatcher Live-Tracking

**5.4 LiveMap: Driver-Tracking Integration**

- [ ] Realtime-Subscription auf vehicle_positions
- [ ] Fahrzeug-Marker mit Icons
- [ ] Click: Fahrzeug-Details (Popup)
- [ ] Auto-Update alle 10s

**Zeitaufwand:** 3h

---

### Tag 3: Customer Portal Tracking

**5.5 Portal.tsx: Customer Tracking**

- [ ] Token-basierter Zugriff
- [ ] Mini-Map mit Fahrzeug-Position
- [ ] ETA-Anzeige (dynamic via calculate-eta)
- [ ] "Fahrer ist unterwegs" Status

**Zeitaufwand:** 3h

---

### Tag 4: Booking Integration

**5.6 Auftraege.tsx: GPS-Tracking Toggle**

- [ ] Checkbox: "GPS-Tracking für Kunde aktivieren"
- [ ] Erstellt booking_tracking-Eintrag
- [ ] Button: "Tracking-Link senden"
- [ ] E-Mail via notify-customer

**Zeitaufwand:** 2h

---

### Tag 5: Schichtzettel GPS & Testing

**5.7 Schichtzettel: GPS Auto-Start/Stop**

- [ ] "Schicht starten" → GPS aktivieren
- [ ] "Schicht beenden" → GPS stoppen
- [ ] GPS-Consent-Check

**Zeitaufwand:** 1h

---

## 🟢 SPRINT 30: PERFORMANCE & POLISH (3 TAGE)

### Tag 1: React Query Migration Finale

**6.1 React Query Migration: Kunden.tsx**

- [ ] use-customers Hook erweitern
- [ ] Kunden.tsx: useState → useQuery
- [ ] Mutations: useCreateCustomer, useUpdateCustomer, useArchiveCustomer
- [ ] Optimistic Updates

**Zeitaufwand:** 3h

---

### Tag 2: Phone & Timezone

**6.2 Phone Number Validation**

- [ ] libphonenumber-js installieren
- [ ] usePhoneValidation Hook
- [ ] Integration in alle Phone-Inputs

**Zeitaufwand:** 2h

**6.3 Timezone Handling**

- [ ] date-fns-tz installieren
- [ ] useTz Hook
- [ ] Alle Datums-Anzeigen in Company-Timezone

**Zeitaufwand:** 2h

---

### Tag 3: Code Splitting & Bundle

**6.4 Bundle-Size Analyse**

- [ ] vite-bundle-visualizer
- [ ] Bundle-Report
- [ ] Optimierungs-Strategie

**Zeitaufwand:** 2h

**6.5 Code Splitting: Weitere Pages**

- [ ] Angebote, Rechnungen, Dokumente, Kostenstellen, Statistiken lazy

**Zeitaufwand:** 1h

---

## 📊 PROGRESS TRACKING

**Vor Sprint 28:**

```
Location-Based System:      [          ] 0/12 (0%)
Adress-/Anrede-Konsistenz:  [##        ] 2/8 (25%)
Code-Cleanup:               [######    ] 4/7 (57%)
Master-Dashboard:           [#####     ] 2/4 (50%)
GPS-Tracking:               [          ] 0/10 (0%)
Performance:                [###       ] 2/6 (33%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GESAMT:                     [####      ] 10/47 (21%)
```

**Nach Sprint 28 (Ziel):**

```
Location-Based System:      [##########] 12/12 (100%) ✅
Adress-/Anrede-Konsistenz:  [##########] 8/8 (100%) ✅
Code-Cleanup:               [##########] 7/7 (100%) ✅
Master-Dashboard:           [#######   ] 3/4 (75%) 🟡
GPS-Tracking:               [####      ] 4/10 (40%) 🟡
Performance:                [###       ] 2/6 (33%) 🟡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GESAMT:                     [########  ] 36/47 (77%) 🟡
```

**Nach Sprint 29 (Ziel):**

```
GESAMT:                     [##########] 46/47 (98%) ✅
```

---

## 🎯 KRITISCHE PFADE

**Critical Path 1: Location-Based System**

```
1.1 DB-Migration → 1.2 Edge Function → 1.4 Einstellungen Tab 8
  → 1.5-1.8 Widgets → 1.9 Hook → DONE ✅
```

**Critical Path 2: Adress-Konsistenz**

```
2.4 Schema Check → 2.1 Kunden → 2.2 Fahrer → 2.3 Einstellungen
  → 2.8 Anzeige → DONE ✅
```

**Critical Path 3: GPS-Tracking**

```
5.1 DB-Migration → 5.2 Edge Functions → 5.3 Driver PWA
  → 5.4 LiveMap → 5.5 Portal → DONE ✅
```

---

## ⚠️ RISIKEN & BLOCKER

**Risiko 1: Datenbank-Migrationen**

- **Problem:** Bestehende Daten ohne strukturierte Adressfelder
- **Lösung:** Backward-Compatibility, `address` als Fallback
- **Severity:** ⚠️ Medium

**Risiko 2: HERE API Rate-Limits**

- **Problem:** 250.000 Requests/Monat Free Tier
- **Lösung:** Geocoding-Cache, Smart-Batching
- **Severity:** 🟢 Low

**Risiko 3: GPS-Tracking Performance**

- **Problem:** 100+ Fahrzeuge × 10s Interval = 36.000 Inserts/Stunde
- **Lösung:** Batch-Inserts, 24h Auto-Delete
- **Severity:** ⚠️ Medium

**Risiko 4: UnifiedForm Komplexität**

- **Problem:** Form ist bereits 800+ Zeilen
- **Lösung:** Refactoring in Sub-Components erwägen
- **Severity:** ⚠️ Medium

---

## 📝 NOTIZEN & ENTSCHEIDUNGEN

**Entscheidung 1: Geocoding-Trigger vs. Frontend**

- **Diskussion:** Automatischer Trigger bei address-UPDATE vs. manueller Button in UI
- **Ergebnis:** Frontend-basiert (bessere UX, weniger DB-Load)
- **Datum:** 17.10.2025

**Entscheidung 2: Partner-Struktur**

- **Diskussion:** Partner = Person oder Unternehmen?
- **Ergebnis:** Partner = Unternehmen mit Ansprechpartner-Feldern
- **Datum:** 17.10.2025 (zu bestätigen durch Product Owner)

**Entscheidung 3: WebRTC Debug-Logs**

- **Diskussion:** Entfernen oder Behalten?
- **Ergebnis:** BEHALTEN (kritisch für Daily.co Debugging)
- **Datum:** 17.10.2025

---

## 🏆 SPRINT 28 ERFOLGSKRITERIEN

**Must-Have (P0):**

- [x] Location-Based System: 100% funktional
- [x] Adress-Konsistenz: Kunden, Fahrer, Unternehmen nutzen AddressInput
- [x] Anrede-Konsistenz: Systemweit PersonFormFields
- [x] Code-Cleanup Welle 12: Abgeschlossen

**Should-Have (P1):**

- [x] Master-Dashboard: Performance-Tab erweitert
- [x] GPS Backend: 4 Edge Functions funktional

**Nice-to-Have (P2):**

- [ ] Geocoding-Cache
- [ ] Booking-Widget City Pre-Fill

---

## 📞 PRODUCT OWNER FREIGABE

**Vor Start Sprint 28:**

- [ ] Review: LOCATION_BASED_SYSTEM_KONZEPT_V18.2.md
- [ ] Review: SPRINT_28_TODO_CHECKLIST.md
- [ ] Freigabe: Datenbank-Migrationen
- [ ] Freigabe: Partner-Struktur-Entscheidung
- [ ] Freigabe: Priorisierung OK?

**Signatur Product Owner:** ******\_\_\_******  
**Datum:** ******\_\_\_******

---

**Status:** 🟡 BEREIT ZUR ABARBEITUNG  
**Next Action:** Product Owner Review & Freigabe  
**Start Sprint 28:** Mo, 18.10.2025

**DIESE LISTE WIRD WÄHREND SPRINT 28 KONTINUIERLICH AKTUALISIERT!**
