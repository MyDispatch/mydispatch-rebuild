# 📋 VOLLSTÄNDIGE TODO-LISTE - Sprint 28 & Darüber Hinaus

**Version:** V18.2.6  
**Datum:** 17.10.2025, 17:00 Uhr  
**Status:** 🟡 Vollständige Analyse | Priorisiert | Umsetzungsbereit

---

## 🎯 QUICK OVERVIEW

**Gesamt-Status:**
- ✅ **Abgeschlossen:** Error Handler Migration (138 Stellen), Gebrandete Landingpage, Tarifsteuerung
- 🟡 **In Progress:** Location-Based System, Adress-/Anrede-Konsistenz
- ❌ **Offen:** 47 Aufgaben in 6 Kategorien

**Prioritäten:**
- 🔴 **P0 (Kritisch):** 15 Aufgaben - SOFORT umsetzen
- 🟡 **P1 (Wichtig):** 18 Aufgaben - Diese Woche
- 🟢 **P2 (Geplant):** 14 Aufgaben - Nächste 2 Wochen

---

## 📊 KATEGORIE-ÜBERSICHT

| **Kategorie** | **Aufgaben** | **P0** | **P1** | **P2** | **Fortschritt** |
|---------------|--------------|--------|--------|--------|-----------------|
| **1. Location-Based System** | 12 | 8 | 2 | 2 | 0% ❌ |
| **2. Adress-/Anrede-Konsistenz** | 8 | 4 | 4 | 0 | 25% 🟡 |
| **3. Verbleibende Code-Cleanup** | 7 | 0 | 5 | 2 | 60% 🟡 |
| **4. Master-Dashboard** | 4 | 1 | 2 | 1 | 50% 🟡 |
| **5. GPS-Tracking-System** | 10 | 2 | 3 | 5 | 0% ❌ |
| **6. Performance & Skalierung** | 6 | 0 | 2 | 4 | 30% 🟡 |
| **GESAMT** | **47** | **15** | **18** | **14** | **28%** |

---

## 🔴 KATEGORIE 1: LOCATION-BASED SYSTEM (P0 - KRITISCH)

### Backend-Foundation (Tag 1-2)

**1.1 Datenbank-Migration: Company Location** ⭐ KRITISCH
- [ ] ALTER TABLE companies: Neue Spalten hinzufügen
  - `street TEXT`
  - `street_number TEXT`
  - `postal_code TEXT`
  - `city TEXT`
  - `latitude NUMERIC(9,6)`
  - `longitude NUMERIC(9,6)`
  - `timezone TEXT DEFAULT 'Europe/Berlin'`
  - `country_code TEXT DEFAULT 'DE'`
  - `phone_prefix TEXT DEFAULT '+49'`
- [ ] Bestehende `address`-Spalte als Fallback beibehalten
- [ ] Daten-Migration: Bestehende addresses in neue Felder splitten (optional, manuell)

**Zeitaufwand:** 1h  
**Risiko:** ⚠️ Medium (Breaking Change wenn nicht sauber migriert)

---

**1.2 Edge Function: geocode-company-address** ⭐ KRITISCH
- [ ] Neue Edge Function erstellen
- [ ] HERE Geocoding API Integration
- [ ] Input: address string
- [ ] Output: { latitude, longitude, formatted_address }
- [ ] Error Handling mit handleError

**Zeitaufwand:** 1h  
**Risiko:** 🟢 Low

---

**1.3 Geocoding-Trigger (Optional)** 🟡 WICHTIG
- [ ] SQL-Trigger: Bei UPDATE companies.address → Edge Function aufrufen
- [ ] Koordinaten automatisch aktualisieren
- [ ] ODER: Frontend-basiert beim Save in Einstellungen

**Zeitaufwand:** 2h  
**Risiko:** ⚠️ Medium (Trigger-Performance)  
**Entscheidung:** Frontend-basiert bevorzugt (einfacher, weniger DB-Load)

---

### Frontend-Implementation (Tag 3-5)

**1.4 Einstellungen Tab 8: Standort** ⭐ KRITISCH
- [ ] Neuer Tab "Standort" hinzufügen
- [ ] AddressInput-Komponente integrieren
- [ ] Geocoding-Button (Edge Function aufrufen)
- [ ] Koordinaten-Anzeige (readonly, formatiert)
- [ ] Live-Preview: WeatherWidget
- [ ] Save-Handler mit handleSuccess/handleError

**Zeitaufwand:** 3h  
**Risiko:** 🟢 Low

---

**1.5 WeatherWidget Location-Aware** ⭐ KRITISCH
- [ ] `city` nicht mehr hardcoded "München"
- [ ] `const { company } = useAuth();`
- [ ] `city={company?.city || 'München'}`
- [ ] Fallback auf "München" wenn company.city leer

**Zeitaufwand:** 15min  
**Risiko:** 🟢 Low

---

**1.6 TrafficWidget Location-Aware** ⭐ KRITISCH
- [ ] `routes` dynamisch generieren basierend auf `company.latitude/longitude`
- [ ] 3 Routes: Zentrum, Nord (+0.05°), Süd (-0.05°)
- [ ] Labels: "${company.city} Zentrum" statt "A9 München-Nord"
- [ ] Fallback auf München-Koordinaten

**Zeitaufwand:** 30min  
**Risiko:** 🟢 Low

---

**1.7 LiveMap GPS-Zentrum Location-Aware** ⭐ KRITISCH
- [ ] `center: { lat: company.latitude, lng: company.longitude }`
- [ ] Firmen-Marker hinzufügen (Pin-Icon)
- [ ] Tooltip: Company-Name + Adresse
- [ ] Zoom: 12 (Stadt-Level)

**Zeitaufwand:** 30min  
**Risiko:** 🟢 Low

---

**1.8 LiveInfoWidget Location-Aware** ⭐ KRITISCH
- [ ] Aktuell: Extrahiert Stadt aus `company.address` (Split-Logic)
- [ ] NEU: Nutzt `company.city` direkt
- [ ] Traffic: Nutzt `company.latitude/longitude`

**Zeitaufwand:** 15min  
**Risiko:** 🟢 Low

---

### Backend-Helper (Tag 6)

**1.9 useCompanyLocation Hook** 🟡 WICHTIG
- [ ] Zentraler Hook für Location-Daten
- [ ] `const { city, latitude, longitude, timezone } = useCompanyLocation();`
- [ ] Fallbacks für fehlende Daten
- [ ] Caching (React Query)

```tsx
// src/hooks/use-company-location.tsx
export function useCompanyLocation() {
  const { company } = useAuth();
  
  return {
    city: company?.city || 'München',
    latitude: company?.latitude || 48.1351,
    longitude: company?.longitude || 11.5820,
    timezone: company?.timezone || 'Europe/Berlin',
    countryCode: company?.country_code || 'DE',
    phonePrefix: company?.phone_prefix || '+49',
    hasLocation: !!(company?.latitude && company?.longitude),
  };
}
```

**Zeitaufwand:** 1h  
**Risiko:** 🟢 Low

---

**1.10 Geocoding Cache System** 🟢 GEPLANT
- [ ] Tabelle: `geocoding_cache`
- [ ] address_text (unique index)
- [ ] latitude, longitude
- [ ] cached_at (30-Tage-Retention)
- [ ] RLS: Public Read (keine company_id)

**Zeitaufwand:** 2h  
**Risiko:** 🟢 Low

---

**1.11 Dashboard Widget Settings** 🟢 GEPLANT
- [ ] Einstellungen Tab 9: Widget-Konfiguration
- [ ] Toggle: Wetter-Widget anzeigen
- [ ] Toggle: Verkehrs-Widget anzeigen
- [ ] Toggle: GPS-Karte anzeigen

**Zeitaufwand:** 1h  
**Risiko:** 🟢 Low

---

**1.12 Booking-Widget City Pre-Fill** 🟢 GEPLANT
- [ ] BookingWidget: `pickup_city` aus `company.city`
- [ ] BookingWidget: `dropoff_city` aus `company.city`
- [ ] Validierung: Pickup/Dropoff in 50km-Radius

**Zeitaufwand:** 1h  
**Risiko:** 🟢 Low

---

## 🔴 KATEGORIE 2: ADRESS-/ANREDE-KONSISTENZ (P0 - KRITISCH)

### Adress-Felder Systemweit (Tag 6-7)

**2.1 Kunden.tsx: AddressInput Integration** ⭐ KRITISCH
- [ ] Ersetze einzelnes `address`-Feld durch AddressInput
- [ ] Füge `street`, `street_number`, `postal_code`, `city` zu formData hinzu
- [ ] onAddressChange Handler implementieren
- [ ] Backward-Compatibility: `address` als kombiniertes Feld beibehalten
- [ ] Update `handleSaveCustomer()` mit allen neuen Feldern

**Zeitaufwand:** 2h  
**Risiko:** ⚠️ Medium (Bestehende Kunden-Daten)

**Code-Änderungen:**
```tsx
// VORHER:
const [formData, setFormData] = useState({
  address: '',
  // ...
});

// NACHHER:
const [formData, setFormData] = useState({
  street: '',
  street_number: '',
  postal_code: '',
  city: '',
  address: '', // Kombiniert (für Backward-Compatibility)
  // ...
});

// Im JSX:
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
  label="Kundenadresse"
  placeholder="Straße eingeben..."
/>
```

---

**2.2 Fahrer.tsx: AddressInput Integration** ⭐ KRITISCH
- [ ] Analog zu Kunden.tsx
- [ ] Ersetze `address`-Feld durch AddressInput
- [ ] Update `handleSaveDriver()` mit neuen Feldern

**Zeitaufwand:** 2h  
**Risiko:** ⚠️ Medium

---

**2.3 Einstellungen Tab 2: AddressInput für Firmenadresse** ⭐ KRITISCH
- [ ] Unternehmensprofil-Tab erweitern
- [ ] AddressInput für Firmenadresse
- [ ] ODER: Verweis auf Tab 8 (Standort) für Adresse
- [ ] Repräsentant-Felder mit PersonFormFields

**Zeitaufwand:** 1h  
**Risiko:** 🟢 Low

---

**2.4 Database Schema Check: Address Fields** ⭐ KRITISCH
- [ ] Prüfe: customers-Tabelle hat `street`, `street_number`, `postal_code`, `city`? ✅ JA!
- [ ] Prüfe: drivers-Tabelle hat diese Felder? ✅ JA!
- [ ] Prüfe: companies-Tabelle? ❌ NEIN! → Migration nötig (siehe 1.1)

**Zeitaufwand:** 30min (Analyse)  
**Risiko:** 🟢 Low

---

### Anrede-Felder Systemweit (Tag 7)

**2.5 UnifiedForm.tsx: Kunden-Anrede hinzufügen** 🟡 WICHTIG
- [ ] PersonFormFields-Komponente für Kunden-Daten integrieren
- [ ] `customer_salutation`, `customer_title`, `customer_first_name`, `customer_last_name`
- [ ] Validierung: salutation, first_name, last_name REQUIRED
- [ ] Beim Kunden anlegen: Felder übernehmen

**Zeitaufwand:** 2h  
**Risiko:** ⚠️ Medium (Complex Form)

---

**2.6 Einstellungen Tab 2: Repräsentant-Anrede** 🟡 WICHTIG
- [ ] PersonFormFields für Repräsentanten-Daten
- [ ] `representative_salutation`, `representative_title`, etc.
- [ ] Bereits in DB vorhanden! Nur UI fehlt.

**Zeitaufwand:** 1h  
**Risiko:** 🟢 Low

---

**2.7 PartnerForm.tsx: Ansprechpartner-Anrede** 🟡 WICHTIG
- [ ] Partner haben aktuell nur `name`
- [ ] Erwäge: Partner als "Unternehmen" oder "Person"?
- [ ] Wenn Person: PersonFormFields integrieren
- [ ] Wenn Unternehmen: Ansprechpartner-Sub-Entity

**Zeitaufwand:** 2h  
**Risiko:** ⚠️ Medium (Design-Entscheidung nötig)

---

**2.8 Systemweite Anrede-Anzeige** 🟡 WICHTIG
- [ ] Tables: Kunden-Tabelle zeigt "Herr Max Mustermann" statt "Max Mustermann"
- [ ] DetailDialogs: Anrede prominent anzeigen
- [ ] E-Mail-Templates: Anrede nutzen ("Sehr geehrter Herr Mustermann")

**Zeitaufwand:** 2h  
**Risiko:** 🟢 Low

---

## 🟡 KATEGORIE 3: VERBLEIBENDE CODE-CLEANUP

### Production Code Cleanup Welle 12 (P1 - WICHTIG)

**3.1 Master-Tools Error Handler Migration** 🟡 WICHTIG
- [ ] TerminationTool.tsx (3 console.error)
- [ ] PartnerConnectionList.tsx (2 console.error)
- [ ] PartnerRequestDialog.tsx (1 console.error)
- [ ] PartnerFilter.tsx (1 console.error)

**Zeitaufwand:** 1h  
**Risiko:** 🟢 Low

---

**3.2 Shared Components Error Handler Migration** 🟡 WICHTIG
- [ ] AISupportWidget.tsx (1 console.error)
- [ ] IntelligentAIChat.tsx (2 console.error)
- [ ] PDFExportDialog.tsx (1 console.error)
- [ ] FeatureGate.tsx (1 console.error)
- [ ] ConfirmationDialog.tsx (1 console.error)

**Zeitaufwand:** 1h  
**Risiko:** 🟢 Low

---

**3.3 Chat/Communication Error Handler Migration** 🟡 WICHTIG
- [ ] ChatWindow.tsx (3 console.error)
- [ ] ConversationList.tsx (2 console.error)
- [ ] ParticipantSelector.tsx (1 console.error)

**Zeitaufwand:** 1h  
**Risiko:** 🟢 Low

---

**3.4 WebRTC Debug-Logs behalten** 🟡 WICHTIG
- [ ] CallInterface.tsx (3 console.log) - **BEHALTEN für Debugging**
- [ ] use-daily-call.tsx (7 console.log/error) - **BEHALTEN für Debugging**
- [ ] Dokumentiere: "WebRTC Debug-Logs intentional für Troubleshooting"

**Zeitaufwand:** 15min (Dokumentation)  
**Risiko:** 🟢 Low

---

**3.5 Weitere Cleanup-Kandidaten** 🟢 GEPLANT
- [ ] PortalRoute.tsx (1 console.error)
- [ ] BookingWidget.tsx (1 console.error)
- [ ] ShiftForm.tsx (2 console.error)
- [ ] ComprehensiveOnboarding.tsx (1 console.error)
- [ ] use-auth.tsx (3 console.error)

**Zeitaufwand:** 2h  
**Risiko:** 🟢 Low

---

**3.6 google-maps.ts → HERE API Migration Vorbereitung** 🟢 GEPLANT
- [ ] Dokumentiere Migration-Strategie
- [ ] AddressInput.tsx: Google Places → HERE Autosuggest
- [ ] Parallel-Betrieb während Migration (Feature-Flag)

**Zeitaufwand:** 4h (Konzept + Implementation)  
**Risiko:** ⚠️ Medium

---

**3.7 Systematische Console-Audit** 🟢 GEPLANT
- [ ] Alle verbleibenden 50+ console-Statements kategorisieren
- [ ] Debug-Logs: Behalten oder Entfernen?
- [ ] Error-Logs: Zu handleError migrieren
- [ ] Info-Logs: Zu handleInfo migrieren

**Zeitaufwand:** 2h  
**Risiko:** 🟢 Low

---

## 🔴 KATEGORIE 4: MASTER-DASHBOARD

**4.1 Performance-Tab erweitern** ⭐ KRITISCH
- [ ] Top 10 Unternehmen nach Umsatz (mit Ranking 🥇🥈🥉)
- [ ] Top 10 Unternehmen nach Aufträgen
- [ ] Top 10 Unternehmen nach Fahrzeugen
- [ ] Durchschnittswerte systemweit
- [ ] Charts (recharts)

**Status:** 🟡 Bereits vorhanden (zu erweitern)  
**Zeitaufwand:** 2h  
**Risiko:** 🟢 Low

---

**4.2 Location Analytics Tab** 🟡 WICHTIG
- [ ] Top 10 Städte nach Aufträgen
- [ ] Heatmap: Aufträge nach PLZ (Deutschland-Karte)
- [ ] Expansion-Empfehlungen (KI-basiert)

**Zeitaufwand:** 4h  
**Risiko:** ⚠️ Medium

---

**4.3 Upselling-Empfehlungen Tab** 🟡 WICHTIG
- [ ] Starter → Business Upgrade-Kandidaten
  - Kriterien: >3 Fahrzeuge, >100 Aufträge/Monat
- [ ] Business → Enterprise Upgrade-Kandidaten
  - Kriterien: >10 Fahrzeuge, >500 Aufträge/Monat
- [ ] Automatische E-Mail-Kampagnen (Resend.com)
- [ ] Conversion-Tracking

**Zeitaufwand:** 3h  
**Risiko:** 🟢 Low

---

**4.4 Security-Tab: RLS Policy Viewer** 🟢 GEPLANT
- [ ] Alle 60+ RLS Policies anzeigen (readonly)
- [ ] Gruppiert nach Tabelle
- [ ] Syntax-Highlighting
- [ ] Dokumentations-Links

**Zeitaufwand:** 2h  
**Risiko:** 🟢 Low

---

## 🔴 KATEGORIE 5: GPS-TRACKING-SYSTEM

**5.1 Datenbank-Migration: GPS Tables** ⭐ KRITISCH
- [ ] CREATE TABLE vehicle_positions (siehe GPS_TRACKING_GESAMTKONZEPT_V18.1.md)
- [ ] CREATE TABLE booking_tracking
- [ ] CREATE TABLE gps_consent
- [ ] CREATE TABLE geofence_zones
- [ ] RLS Policies für alle Tabellen

**Zeitaufwand:** 2h  
**Risiko:** 🟢 Low

---

**5.2 Edge Functions: GPS Backend** ⭐ KRITISCH
- [ ] calculate-eta (HERE Routing API mit Traffic)
- [ ] calculate-route (HERE Routing API)
- [ ] cleanup-gps-positions (Cron-Job, 24h Auto-Delete)
- [ ] notify-customer (Tracking-Link per E-Mail)

**Zeitaufwand:** 4h  
**Risiko:** ⚠️ Medium

---

**5.3 DriverTracking.tsx: GPS-Tracking PWA** 🟡 WICHTIG
- [ ] Browser Geolocation API (navigator.geolocation.watchPosition)
- [ ] GPS-Consent-Dialog (DSGVO)
- [ ] Schicht-basiertes Tracking (nur während Schicht)
- [ ] Interval: 10 Sekunden
- [ ] Supabase Insert: vehicle_positions

**Zeitaufwand:** 4h  
**Risiko:** ⚠️ Medium

---

**5.4 LiveMap: Driver-Tracking Integration** 🟡 WICHTIG
- [ ] Realtime-Subscription auf vehicle_positions
- [ ] Fahrzeug-Marker mit Icons (verfügbar/im Einsatz/wartung)
- [ ] Click: Details anzeigen (Fahrer-Name, Geschwindigkeit, etc.)
- [ ] Auto-Update alle 10s

**Zeitaufwand:** 3h  
**Risiko:** ⚠️ Medium

---

**5.5 Portal.tsx: Customer Tracking** 🟡 WICHTIG
- [ ] Token-basierter Zugriff
- [ ] Nur aktive Fahrten sichtbar
- [ ] Mini-Map mit Fahrzeug-Position
- [ ] ETA-Anzeige (dynamic)

**Zeitaufwand:** 3h  
**Risiko:** ⚠️ Medium

---

**5.6 Auftraege.tsx: GPS-Tracking Toggle** 🟢 GEPLANT
- [ ] Checkbox: "GPS-Tracking aktivieren"
- [ ] Erstellt booking_tracking-Eintrag
- [ ] Generiert tracking_token
- [ ] Button: "Tracking-Link an Kunde senden"

**Zeitaufwand:** 2h  
**Risiko:** 🟢 Low

---

**5.7 Schichtzettel: GPS Auto-Start/Stop** 🟢 GEPLANT
- [ ] "Schicht starten" → GPS-Tracking aktivieren
- [ ] "Schicht beenden" → GPS-Tracking stoppen
- [ ] GPS-Consent-Check vor Start

**Zeitaufwand:** 1h  
**Risiko:** 🟢 Low

---

**5.8 Geofencing: Automatische Benachrichtigungen** 🟢 GEPLANT
- [ ] Definiere Geofence-Zonen (Pickup, Dropoff)
- [ ] Realtime-Check: Fahrzeug in Zone?
- [ ] Notification: "Fahrer erreicht Abholort in 5 Minuten"

**Zeitaufwand:** 3h  
**Risiko:** ⚠️ Medium

---

**5.9 GPS-Daten-Visualisierung** 🟢 GEPLANT
- [ ] Fahrzeug-Detail: Letzte 24h GPS-Historie
- [ ] Fahrer-Detail: Route-Verlauf (Polyline)
- [ ] Schichtzettel: Gefahrene Route anzeigen

**Zeitaufwand:** 2h  
**Risiko:** 🟢 Low

---

**5.10 DSGVO-Compliance: GPS-Consent-Management** 🟢 GEPLANT
- [ ] Fahrer.tsx: GPS-Consent-Toggle
- [ ] gps_consent-Tabelle nutzen
- [ ] Ohne Consent: Kein Tracking möglich
- [ ] Consent-Widerruf: Auto-Delete aller GPS-Daten

**Zeitaufwand:** 2h  
**Risiko:** 🟢 Low

---

## 🟡 KATEGORIE 6: PERFORMANCE & SKALIERUNG

**6.1 React Query Migration: Restliche Pages** 🟡 WICHTIG
- [ ] Kunden.tsx (analog zu Fahrer.tsx, Fahrzeuge.tsx, Partner.tsx)
- [ ] Dokumente.tsx
- [ ] Kostenstellen.tsx (bereits migriert via use-cost-centers.tsx!)

**Zeitaufwand:** 4h  
**Risiko:** 🟢 Low

---

**6.2 Code Splitting: Weitere Pages lazy** 🟡 WICHTIG
- [ ] Angebote.tsx lazy
- [ ] Rechnungen.tsx lazy
- [ ] Dokumente.tsx lazy
- [ ] Kostenstellen.tsx lazy
- [ ] Statistiken.tsx lazy

**Zeitaufwand:** 1h  
**Risiko:** 🟢 Low

---

**6.3 Bundle-Size Analyse** 🟢 GEPLANT
- [ ] vite-bundle-visualizer installieren
- [ ] Bundle-Report generieren
- [ ] Identifiziere größte Dependencies
- [ ] Optimierungs-Strategie

**Zeitaufwand:** 2h  
**Risiko:** 🟢 Low

---

**6.4 Image Optimization** 🟢 GEPLANT
- [ ] Logo/Profilbilder: WebP-Konvertierung
- [ ] Lazy Loading für alle Images
- [ ] Responsive Images (srcset)

**Zeitaufwand:** 2h  
**Risiko:** 🟢 Low

---

**6.5 Component Memoization** 🟢 GEPLANT
- [ ] Identifiziere Performance-Bottlenecks (React DevTools Profiler)
- [ ] useMemo für teure Berechnungen
- [ ] React.memo für Pure Components
- [ ] useCallback für Event-Handler

**Zeitaufwand:** 3h  
**Risiko:** ⚠️ Medium

---

**6.6 Lighthouse Score > 90** 🟢 GEPLANT
- [ ] Lighthouse Audit nach Deployment
- [ ] Performance-Optimierungen
- [ ] Accessibility-Fixes
- [ ] SEO-Verbesserungen
- [ ] Best Practices

**Zeitaufwand:** 4h  
**Risiko:** 🟢 Low

---

## 🚀 SPRINT 28 IMPLEMENTIERUNGSPLAN (7 TAGE)

### **Woche 1: Location-Based System & Adress-/Anrede-Konsistenz**

**Tag 1 (Mo): Backend-Foundation**
- [ ] 1.1 Datenbank-Migration: Company Location (1h)
- [ ] 1.2 Edge Function: geocode-company-address (1h)
- [ ] 5.1 GPS Tables Migration (2h)
- [ ] 2.4 Database Schema Check (30min)
- **Gesamt:** 4.5h

---

**Tag 2 (Di): Einstellungen Tab 8 Standort**
- [ ] 1.4 Einstellungen Tab 8: Standort (3h)
- [ ] 2.3 Einstellungen Tab 2: Repräsentant-Anrede (1h)
- [ ] 2.6 Einstellungen Tab 2: Repräsentant mit PersonFormFields (1h)
- **Gesamt:** 5h

---

**Tag 3 (Mi): Location-Aware Widgets**
- [ ] 1.5 WeatherWidget Location-Aware (15min)
- [ ] 1.6 TrafficWidget Location-Aware (30min)
- [ ] 1.7 LiveMap GPS-Zentrum Location-Aware (30min)
- [ ] 1.8 LiveInfoWidget Location-Aware (15min)
- [ ] 1.9 useCompanyLocation Hook (1h)
- [ ] 4.1 Master-Dashboard Performance-Tab erweitern (2h)
- **Gesamt:** 5h

---

**Tag 4 (Do): Adress-Konsistenz Teil 1**
- [ ] 2.1 Kunden.tsx: AddressInput Integration (2h)
- [ ] 2.2 Fahrer.tsx: AddressInput Integration (2h)
- [ ] Test: Kunden & Fahrer CRUD funktional
- **Gesamt:** 4h

---

**Tag 5 (Fr): Adress-Konsistenz Teil 2 + Anrede**
- [ ] 2.5 UnifiedForm.tsx: Kunden-Anrede (2h)
- [ ] 2.7 PartnerForm.tsx: Ansprechpartner-Anrede (2h)
- [ ] 2.8 Systemweite Anrede-Anzeige (2h)
- **Gesamt:** 6h

---

**Tag 6 (Sa): Code-Cleanup Welle 12**
- [ ] 3.1 Master-Tools Error Handler (1h)
- [ ] 3.2 Shared Components Error Handler (1h)
- [ ] 3.3 Chat Error Handler (1h)
- [ ] 3.4 WebRTC Debug-Logs Dokumentation (15min)
- [ ] Welle 11 Dokumentation finalisieren
- **Gesamt:** 3.5h

---

**Tag 7 (So): GPS Backend + Testing**
- [ ] 5.2 Edge Functions: calculate-eta, calculate-route, cleanup-gps-positions (4h)
- [ ] Systemweites Testing aller Location-Features
- [ ] Dokumentation: LOCATION_BASED_SYSTEM_V18.2.md
- [ ] Sprint 28 Completion Report
- **Gesamt:** 6h

---

## 📊 FORTSCHRITTS-TRACKING

### Vor Sprint 28:
- ✅ Error Handler Migration: 138/138 Stellen (100%)
- ✅ Gebrandete Landingpage: Vollständig
- ✅ Tarifsteuerung: Test/Master-Accounts
- ❌ Location-Based System: 0/12 Aufgaben
- 🟡 Adress-/Anrede-Konsistenz: 2/8 Aufgaben

### Nach Sprint 28 (Ziel):
- ✅ Location-Based System: 12/12 Aufgaben (100%)
- ✅ Adress-/Anrede-Konsistenz: 8/8 Aufgaben (100%)
- ✅ Code-Cleanup Welle 12: 7/7 Aufgaben (100%)
- ✅ GPS Backend: 4/10 Aufgaben (40%)

### Nach Sprint 29 (Ziel):
- ✅ GPS-Tracking vollständig: 10/10 Aufgaben (100%)
- ✅ Performance-Optimierung: 6/6 Aufgaben (100%)

---

## ✅ ERFOLGSKRITERIEN

**Location-Based System:**
- [x] Unternehmen in München: München-Wetter, München-Verkehr, GPS-Zentrum München
- [x] Unternehmen in Köln: Köln-Wetter, Köln-Verkehr, GPS-Zentrum Köln
- [x] Standort-Änderung in Einstellungen → Alle Widgets aktualisieren sich automatisch
- [x] Geocoding: Adresse → Koordinaten (automatisch)

**Adress-/Anrede-Konsistenz:**
- [x] Alle Entities nutzen AddressInput (street, street_number, postal_code, city)
- [x] Alle Personen nutzen PersonFormFields (salutation, title, first_name, last_name)
- [x] Keine inkonsistenten Einzelfelder mehr
- [x] E-Mail-Templates nutzen Anrede ("Sehr geehrter Herr Mustermann")

**Code-Qualität:**
- [x] 0 console.error in kritischen Production Files (außer WebRTC Debug)
- [x] Zentrale Error Handling 100% systemweit
- [x] React Query Migration 90% abgeschlossen

---

## 🎯 ZUSAMMENFASSUNG

**Offene Aufgaben Gesamt:** 47  
**Kritische Aufgaben (P0):** 15  
**Wichtige Aufgaben (P1):** 18  
**Geplante Aufgaben (P2):** 14

**Nächster Sprint:** Sprint 28 (Location-Based System & Adress-/Anrede-Konsistenz)  
**Dauer:** 7 Tage (Mo-So)  
**Geschätzter Aufwand:** 34 Stunden  
**Team:** 1 AI-Agent (Claude Sonnet 4) + Pascal Courbois (Product Owner)

---

**Erstellt:** 17.10.2025, 17:00 Uhr  
**Autor:** AI-Agent (Claude Sonnet 4)  
**Version:** V18.2.6  
**Status:** 🟡 Konzept abgeschlossen | Bereit für Implementierung

**NIEMALS ÜBERSCHREIBEN ODER LÖSCHEN!**
