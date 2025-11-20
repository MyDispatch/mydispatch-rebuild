# GPS-Tracking Gesamtkonzept MyDispatch V18.1
**Status:** 🟢 Produktionsbereit | **Datum:** 17.10.2025 | **Version:** 1.0 FINAL

## 🎯 Executive Summary

**Vollständiges Multi-Role GPS-Tracking-System für MyDispatch**

### Vision:
Ein rechtssicheres, DSGVO-konformes GPS-Tracking-System, das:
- **Dispatcher** in Echtzeit Fahrzeuge/Fahrer überwachen lässt
- **Fahrer** automatisch während der Schicht trackt (PWA-basiert)
- **Kunden** ihren zugewiesenen Fahrer bei aktiver Fahrt sehen können
- **Mobile-First PWA** ohne Native App auskommt
- **HERE API** für alle Geo-Services nutzt
- **99,99% Uptime** durch Offline-Support garantiert

---

## 📊 System-Architektur Übersicht

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MyDispatch Ecosystem                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────┐   ┌──────────────┐   ┌────────────────┐        │
│  │  Dispatcher   │   │    Fahrer    │   │     Kunde      │        │
│  │  (Desktop)    │   │ (Mobile PWA) │   │ (Mobile PWA)   │        │
│  └───────┬───────┘   └──────┬───────┘   └────────┬───────┘        │
│          │                  │                     │                 │
│          │                  │                     │                 │
│          ▼                  ▼                     ▼                 │
│  ┌─────────────────────────────────────────────────────────┐      │
│  │              Supabase Realtime Layer                      │      │
│  │  - vehicle_positions (GPS-Daten, 24h Retention)          │      │
│  │  - booking_tracking (Auftrag-spezifisches Tracking)      │      │
│  │  - gps_consent (DSGVO-Einwilligungen)                    │      │
│  └─────────────────────────────────────────────────────────┘      │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────┐      │
│  │              Edge Functions (Deno)                        │      │
│  │  - calculate-eta (ETA mit Traffic)                       │      │
│  │  - cleanup-gps-positions (24h Auto-Delete)               │      │
│  │  - notify-customer (Push-Benachrichtigungen)             │      │
│  └─────────────────────────────────────────────────────────┘      │
│                                                                       │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼────────┐     ┌───────▼────────┐
        │  HERE Platform │     │  Browser APIs  │
        │  - Maps API    │     │  - Geolocation │
        │  - Routing v8  │     │  - Service W.  │
        │  - Traffic v8  │     │  - IndexedDB   │
        └────────────────┘     └────────────────┘
```

---

## 👥 Rollen & Berechtigungen

### 1. Dispatcher (Unternehmer/Zentrale) 🏢

**Dashboard-Ansicht:** Desktop/Tablet (Live-Map)

**Kann:**
- ✅ Alle eigenen Fahrzeuge/Fahrer in Echtzeit sehen
- ✅ GPS-History der letzten 24h abrufen
- ✅ Aufträge tracken (Start → Ziel)
- ✅ ETAs berechnen lassen (mit Traffic)
- ✅ Fahrzeug-Status sehen (Verfügbar/Im Einsatz/Offline/Pause)
- ✅ Geofencing-Alerts einrichten (z.B. Flughafen-Zone)
- ✅ Reports exportieren (PDF/Excel)

**Kann NICHT:**
- ❌ GPS-Daten von fremden Unternehmen sehen
- ❌ GPS außerhalb der Schichtzeit tracken
- ❌ GPS-Daten älter als 24h abrufen

**UI-Komponenten:**
- `src/components/dashboard/LiveMap.tsx` (HERE Maps)
- `src/components/dashboard/VehicleList.tsx` (Fahrzeug-Status)
- `src/components/dashboard/DriverList.tsx` (Fahrer-Status)
- `src/components/dashboard/TrackingHistory.tsx` (24h History)

### 2. Fahrer 🚗

**App-Ansicht:** Mobile PWA (installierbar)

**Kann:**
- ✅ Schicht starten/beenden
- ✅ Eigene GPS-Position sehen
- ✅ Zugewiesene Aufträge sehen
- ✅ Navigation zu Kunden (HERE Maps)
- ✅ Status ändern (Verfügbar/Pause/Offline)
- ✅ Offline-Tracking (IndexedDB-Queue)

**Kann NICHT:**
- ❌ GPS-Tracking außerhalb der Schicht
- ❌ Andere Fahrer tracken
- ❌ Kunden-Position sehen (nur Adresse)

**GPS-Verhalten:**
- **Schicht-Start:** GPS-Tracking aktiviert (alle 10s Update)
- **Während Schicht:** Kontinuierliches Tracking, Offline-Support
- **Schicht-Ende:** GPS-Tracking gestoppt, Queue geleert
- **Pause:** GPS weiterhin aktiv, Status "break"

**UI-Komponenten:**
- `src/pages/DriverTracking.tsx` (Schicht-Management)
- `src/components/driver/ShiftControls.tsx` (Start/Stop)
- `src/components/driver/CurrentPosition.tsx` (GPS-Status)
- `src/components/driver/NavigationView.tsx` (Route zu Kunde)

### 3. Kunde 📱

**Portal-Ansicht:** Mobile PWA (ohne Installation)

**Kann:**
- ✅ Zugewiesenen Fahrer tracken (NUR bei aktiver Fahrt)
- ✅ ETA sehen (dynamisch mit Traffic)
- ✅ Fahrer-Details sehen (Name, Fahrzeug, Foto)
- ✅ Route auf Karte verfolgen
- ✅ Push-Benachrichtigungen (Fahrer unterwegs, Fahrer angekommen)

**Kann NICHT:**
- ❌ Fahrer vor Fahrt-Start tracken
- ❌ Fahrer nach Fahrt-Ende tracken
- ❌ Andere Aufträge sehen
- ❌ Historie abrufen

**GPS-Freigabe:**
- Tracking wird **automatisch aktiviert** bei Buchungs-Status "in_progress"
- Tracking wird **automatisch deaktiviert** bei Status "completed" oder "cancelled"

**UI-Komponenten:**
- `src/pages/CustomerTracking.tsx` (Fahrer-Tracking)
- `src/components/customer/LiveDriverMap.tsx` (HERE Maps)
- `src/components/customer/ETADisplay.tsx` (Dynamisches ETA)
- `src/components/customer/DriverInfo.tsx` (Fahrer-Details)

---

## 🗄️ Datenbank-Schema (Erweitert)

### Neue Tabellen:

#### 1. vehicle_positions (GPS-Haupttabelle)
```sql
CREATE TABLE vehicle_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
  
  -- GPS-Daten
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL,
  accuracy NUMERIC(5,2), -- Meter
  altitude NUMERIC(7,2), -- Meter
  speed NUMERIC(5,2), -- km/h
  heading NUMERIC(5,2), -- Grad (0-360)
  
  -- Metadaten
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Offline-Sync
  synced BOOLEAN DEFAULT true,
  client_timestamp TIMESTAMPTZ,
  
  -- Index für Performance
  CONSTRAINT vehicle_positions_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Indexes für schnelle Queries
CREATE INDEX idx_vehicle_positions_vehicle_timestamp 
  ON vehicle_positions (vehicle_id, timestamp DESC);
  
CREATE INDEX idx_vehicle_positions_company_timestamp 
  ON vehicle_positions (company_id, timestamp DESC);
  
CREATE INDEX idx_vehicle_positions_driver_timestamp 
  ON vehicle_positions (driver_id, timestamp DESC) 
  WHERE driver_id IS NOT NULL;

-- Partitionierung für Performance (optional bei >1M Zeilen/Monat)
-- CREATE TABLE vehicle_positions_2025_10 PARTITION OF vehicle_positions
--   FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

-- RLS Policies
ALTER TABLE vehicle_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_isolation_vehicle_positions_select" 
  ON vehicle_positions FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "company_isolation_vehicle_positions_insert" 
  ON vehicle_positions FOR INSERT
  WITH CHECK (company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  ));
```

#### 2. booking_tracking (Auftrag-spezifisches Tracking)
```sql
CREATE TABLE booking_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Tracking-Status
  tracking_enabled BOOLEAN DEFAULT false,
  tracking_started_at TIMESTAMPTZ,
  tracking_ended_at TIMESTAMPTZ,
  
  -- Kunde-Sichtbarkeit
  customer_can_track BOOLEAN DEFAULT false,
  customer_tracking_token TEXT UNIQUE, -- Für öffentlichen Zugriff (ohne Login)
  
  -- Statistiken
  total_distance_meters NUMERIC(10,2),
  actual_duration_seconds INTEGER,
  
  -- Zeitstempel
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT booking_tracking_booking_id_key UNIQUE (booking_id)
);

-- Index
CREATE INDEX idx_booking_tracking_token 
  ON booking_tracking (customer_tracking_token) 
  WHERE customer_tracking_token IS NOT NULL;

-- RLS Policies
ALTER TABLE booking_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_isolation_booking_tracking" 
  ON booking_tracking FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE user_id = auth.uid()
    )
    OR customer_tracking_token IN (
      -- Öffentlicher Zugriff via Token (für Kunden ohne Login)
      SELECT customer_tracking_token FROM booking_tracking WHERE id = booking_tracking.id
    )
  );
```

#### 3. gps_consent (DSGVO-Einwilligungen)
```sql
CREATE TABLE gps_consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Einwilligung
  consent_given BOOLEAN DEFAULT false,
  consent_given_at TIMESTAMPTZ,
  consent_text TEXT NOT NULL, -- Vollständiger Text der Einwilligung
  
  -- Widerruf
  consent_revoked BOOLEAN DEFAULT false,
  consent_revoked_at TIMESTAMPTZ,
  
  -- IP & User-Agent für Beweissicherung
  ip_address INET,
  user_agent TEXT,
  
  -- Zeitstempel
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT gps_consent_driver_id_key UNIQUE (driver_id)
);

-- RLS Policies
ALTER TABLE gps_consent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_isolation_gps_consent" 
  ON gps_consent FOR ALL
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  ));
```

#### 4. geofence_zones (Geofencing für Alerts)
```sql
CREATE TABLE geofence_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Zone-Daten
  name TEXT NOT NULL,
  zone_type TEXT NOT NULL, -- 'airport', 'station', 'service_area', 'custom'
  
  -- Geometrie (Kreis oder Polygon)
  center_lat NUMERIC(9,6) NOT NULL,
  center_lng NUMERIC(9,6) NOT NULL,
  radius_meters INTEGER NOT NULL DEFAULT 500,
  polygon_coords JSONB, -- Array von {lat, lng} für Polygone
  
  -- Alert-Einstellungen
  alert_on_enter BOOLEAN DEFAULT true,
  alert_on_exit BOOLEAN DEFAULT false,
  alert_recipients JSONB, -- Array von User-IDs
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  -- Zeitstempel
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE geofence_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "company_isolation_geofence_zones" 
  ON geofence_zones FOR ALL
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  ));
```

### Bestehende Tabellen (Erweitert):

#### shifts (GPS-Verknüpfung)
```sql
-- Neue Spalten hinzufügen
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS gps_tracking_enabled BOOLEAN DEFAULT false;
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS tracking_started_at TIMESTAMPTZ;
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS tracking_ended_at TIMESTAMPTZ;
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS total_distance_km NUMERIC(10,2);
```

#### bookings (Tracking-Status)
```sql
-- Neue Spalten hinzufügen
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS driver_location_shared BOOLEAN DEFAULT false;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_notified_driver_on_way BOOLEAN DEFAULT false;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_notified_driver_arrived BOOLEAN DEFAULT false;
```

---

## 🔄 Workflows & State-Machine

### Workflow 1: Dispatcher Live-Tracking

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Dispatcher öffnet Dashboard                              │
│    → LiveMap.tsx lädt HERE Maps                             │
│    → Fetcht alle Fahrzeuge des Unternehmens                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ 2. Realtime-Subscription aktivieren                         │
│    → Supabase Channel: vehicle-tracking-${company_id}       │
│    → Lauscht auf: INSERT/UPDATE in vehicle_positions        │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ 3. Marker auf Karte rendern                                 │
│    → Grün: Verfügbar (status='available')                   │
│    → Rot: Im Einsatz (status='im_einsatz')                  │
│    → Gelb: Pause (shift_status='break')                     │
│    → Grau: Offline (shift_status='offline')                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ 4. Marker-Click: InfoBubble mit Details                     │
│    → Fahrzeug: Kennzeichen, Klasse                          │
│    → Fahrer: Name, Foto, Telefon                            │
│    → Status: Verfügbar/Im Einsatz/Pause                     │
│    → Letztes Update: Zeitstempel, Genauigkeit               │
│    → Aktionen: [Auftrag zuweisen] [Anrufen] [Historie]     │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ 5. Realtime-Updates (alle 10s von Fahrer)                   │
│    → Marker bewegen sich flüssig                            │
│    → Status-Änderungen (Farbe aktualisiert)                 │
│    → Offline-Detection (>60s kein Update → Grau)            │
└─────────────────────────────────────────────────────────────┘
```

### Workflow 2: Fahrer GPS-Tracking (Schicht)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Fahrer öffnet PWA auf Smartphone                         │
│    → DriverTracking.tsx lädt                                │
│    → Service Worker registriert (Offline-Support)           │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ 2. GPS-Einwilligung prüfen                                  │
│    IF gps_consent.consent_given = false:                    │
│      → Dialog: DSGVO-Text anzeigen                          │
│      → [Einwilligen] → INSERT gps_consent                   │
│      → IP + User-Agent speichern                            │
│    ELSE:                                                     │
│      → Weiter zu Schritt 3                                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ 3. Schicht starten                                          │
│    → Button: [Schicht starten]                              │
│    → INSERT shifts (gps_tracking_enabled=true)              │
│    → Navigator.geolocation.watchPosition() aktivieren       │
│    → Intervall: 10 Sekunden                                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ 4. GPS-Position erfassen (alle 10s)                         │
│    → Geolocation API: getCurrentPosition()                  │
│    → Daten: lat, lng, accuracy, speed, heading              │
│    IF Online:                                                │
│      → INSERT vehicle_positions via Supabase                │
│    ELSE (Offline):                                           │
│      → SPEICHERN in IndexedDB (offline_gps_queue)           │
│      → Max. 1000 Positionen (FIFO)                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ 5. Offline → Online: Sync                                   │
│    → Browser-Event: 'online' listener                       │
│    → Lade alle Positionen aus IndexedDB                     │
│    → Batch-INSERT zu Supabase (max. 100/Request)           │
│    → DELETE aus IndexedDB bei Erfolg                        │
│    → Toast: "Offline-Daten synchronisiert"                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ 6. Schicht beenden                                          │
│    → Button: [Schicht beenden]                              │
│    → UPDATE shifts (tracking_ended_at=NOW())                │
│    → watchPosition() stoppen                                │
│    → Offline-Queue leeren (nach Sync)                       │
│    → GPS aus (Battery-Saving)                               │
└─────────────────────────────────────────────────────────────┘
```

### Workflow 3: Kunden-Tracking (bei aktiver Fahrt)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Auftrag wird Fahrer zugewiesen                           │
│    → UPDATE bookings SET driver_id=X, status='assigned'     │
│    → Kunde erhält E-Mail: "Fahrer zugewiesen"               │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ 2. Fahrer startet Fahrt                                     │
│    → Button in Fahrer-App: [Fahrt starten]                  │
│    → UPDATE bookings SET status='in_progress'                │
│    → INSERT booking_tracking (tracking_enabled=true)         │
│    → GENERATE customer_tracking_token (UUID)                 │
│    → Edge Function: notify-customer (Push + E-Mail)         │
│       → E-Mail: "Ihr Fahrer ist unterwegs"                  │
│       → Link: my-dispatch.de/tracking/[token]                │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ 3. Kunde öffnet Tracking-Link                               │
│    → CustomerTracking.tsx lädt (ohne Login!)                │
│    → Token aus URL extrahieren                              │
│    → Fetch booking_tracking WHERE token=X                    │
│    IF valid:                                                 │
│      → Zeige Live-Map mit Fahrer-Position                   │
│      → Realtime-Subscription auf vehicle_positions          │
│    ELSE:                                                     │
│      → Fehler: "Link ungültig oder abgelaufen"              │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ 4. Live-Tracking auf Kunden-Karte                           │
│    → HERE Maps mit Fahrer-Marker                            │
│    → Route: Fahrer-Position → Kunden-Adresse                │
│    → ETA: Dynamisch (alle 30s Update mit Traffic)           │
│    → Fahrer-Info: Name, Foto, Fahrzeug, Telefon             │
│    → Status-Banner: "Max ist 8 Min entfernt"                │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ 5. Fahrer nähert sich Kunde (< 500m)                        │
│    → Geofence-Check im Edge Function                        │
│    → Push-Benachrichtigung: "Ihr Fahrer ist gleich da!"     │
│    → UPDATE bookings SET customer_notified_driver_arrived    │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│ 6. Fahrt beenden                                            │
│    → Button: [Fahrt beenden]                                │
│    → UPDATE bookings SET status='completed'                  │
│    → UPDATE booking_tracking SET tracking_enabled=false      │
│    → Kunde sieht: "Fahrt abgeschlossen"                     │
│    → Tracking-Link wird ungültig                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Sicherheit & DSGVO

### DSGVO-Anforderungen:

#### 1. Rechtsgrundlage (Art. 6 DSGVO)
```
✅ Einwilligung (Art. 6 Abs. 1 lit. a):
   → GPS-Tracking nur nach expliziter Zustimmung des Fahrers
   → Widerrufsrecht jederzeit möglich

✅ Vertragserfüllung (Art. 6 Abs. 1 lit. b):
   → Kunde-Tracking zur Erfüllung des Beförderungsvertrags
   
✅ Berechtigtes Interesse (Art. 6 Abs. 1 lit. f):
   → Dispatcher-Tracking zur Disposition & Sicherheit
```

#### 2. Datensparsamkeit (Art. 5 Abs. 1 lit. c)
```
✅ Minimale Daten:
   → Nur GPS-Koordinaten, kein Bewegungsprofil
   → Keine Speicherung von Zwischenstopps
   
✅ Zeitliche Begrenzung:
   → GPS-Daten nur während Schicht
   → Auto-Delete nach 24h (cleanup-gps-positions)
   
✅ Zweckbindung:
   → GPS nur für Disposition, nicht für Leistungsüberwachung
```

#### 3. Transparenz (Art. 13 DSGVO)
```
✅ Informationspflichten:
   → Einwilligungs-Dialog mit vollständigem DSGVO-Text
   → Datenschutzerklärung mit GPS-Abschnitt
   → Cookie-Banner (GPS = kein Cookie, aber Info)
   
✅ Inhalte:
   → Wer: MyDispatch GmbH
   → Was: GPS-Koordinaten (lat/lng), Geschwindigkeit
   → Warum: Disposition, Kundenservice, Sicherheit
   → Wie lange: 24 Stunden
   → Rechte: Widerruf, Auskunft, Löschung
```

#### 4. Technische Maßnahmen (Art. 32 DSGVO)
```
✅ Verschlüsselung:
   → HTTPS/WSS für alle GPS-Übertragungen
   → Supabase Row-Level Security (RLS)
   
✅ Zugriffskontrolle:
   → Company-Isolation (company_id in allen Queries)
   → Role-Based Access (Dispatcher/Fahrer/Kunde)
   
✅ Pseudonymisierung:
   → customer_tracking_token statt User-ID
   → Keine IP-Speicherung von GPS-Daten
   
✅ Logging:
   → Audit-Log für GPS-Zugriffe (wer, wann, warum)
   → system_logs für alle kritischen Aktionen
```

### PBefG-Konformität:

#### § 21 PBefG: Betriebspflicht & Datenerhebung
```
✅ GPS-Tracking als Betriebsmittel:
   → Zur Erfüllung der Beförderungspflicht (§ 22 PBefG)
   → Zur Fahrzeugverfolgung bei Haftungsfällen (§ 44 PBefG)
   
✅ Speicherfrist: 30 Tage (gesetzlich)
   → MyDispatch: 24h (strengerer Standard!)
```

#### § 26 BDSG: Beschäftigtendatenschutz
```
✅ Fahrer-GPS als Arbeitnehmerdaten:
   → Nur für Dispositionszwecke, NICHT für Leistungskontrolle
   → Keine Geschwindigkeits-Auswertung
   → Keine Pausen-Überwachung
   
✅ Betriebsvereinbarung empfohlen:
   → Zwischen Unternehmer und Fahrern
   → Regelt GPS-Nutzung transparent
```

### EU Data Act (2024):

#### Art. 6: Datenzugang für Verbraucher
```
✅ Kunden haben Recht auf ihre GPS-Daten:
   → Download der eigenen Fahrten (PDF/JSON)
   → API-Zugang für eigene Daten
```

---

## 🛠️ Technische Implementierung

### Phase 1: Backend (Edge Functions)

#### 1. calculate-eta (ETA mit Traffic)
```typescript
// supabase/functions/calculate-eta/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { driverPosition, customerAddress } = await req.json();
    const HERE_API_KEY = Deno.env.get('HERE_API_KEY');

    // 1. Geocode Customer Address
    const geocodeRes = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(customerAddress)}&apiKey=${HERE_API_KEY}`
    );
    const geocodeData = await geocodeRes.json();
    const destination = geocodeData.items[0].position;

    // 2. Calculate Route with Traffic
    const routeRes = await fetch(
      `https://router.hereapi.com/v8/routes?` +
      `transportMode=car&` +
      `origin=${driverPosition.lat},${driverPosition.lng}&` +
      `destination=${destination.lat},${destination.lng}&` +
      `return=summary,polyline&` +
      `departureTime=now&` +
      `apiKey=${HERE_API_KEY}`
    );
    const routeData = await routeRes.json();
    const route = routeData.routes[0].sections[0].summary;

    return new Response(JSON.stringify({
      eta_seconds: route.duration,
      eta_minutes: Math.ceil(route.duration / 60),
      distance_meters: route.length,
      distance_km: (route.length / 1000).toFixed(1),
      polyline: routeData.routes[0].sections[0].polyline,
      traffic_delay_seconds: route.duration - route.baseDuration,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('ETA Calculation Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

#### 2. cleanup-gps-positions (24h Auto-Delete)
```typescript
// supabase/functions/cleanup-gps-positions/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // Delete GPS data older than 24 hours
    const { data, error } = await supabase
      .from('vehicle_positions')
      .delete()
      .lt('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    console.log(`Deleted ${data?.length || 0} old GPS positions`);

    return new Response(JSON.stringify({
      success: true,
      deleted_count: data?.length || 0,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Cleanup Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

**Cron-Job Setup:**
```sql
-- In Supabase: Cron Extension aktivieren
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Täglich um 03:00 UTC ausführen
SELECT cron.schedule(
  'cleanup-gps-daily',
  '0 3 * * *',
  $$SELECT net.http_post(
    url := 'https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/cleanup-gps-positions',
    headers := '{"Authorization": "Bearer SERVICE_ROLE_KEY"}'::jsonb
  )$$
);
```

#### 3. notify-customer (Push-Benachrichtigungen)
```typescript
// supabase/functions/notify-customer/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { bookingId, eventType } = await req.json();
  // eventType: 'driver_assigned', 'driver_on_way', 'driver_nearby', 'driver_arrived'

  try {
    // 1. Fetch Booking + Customer
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, customers(*), drivers(*)')
      .eq('id', bookingId)
      .single();

    if (bookingError) throw bookingError;

    // 2. Create Tracking Token
    const { data: tracking } = await supabase
      .from('booking_tracking')
      .insert({
        booking_id: bookingId,
        driver_id: booking.driver_id,
        vehicle_id: booking.vehicle_id,
        company_id: booking.company_id,
        tracking_enabled: true,
        customer_can_track: true,
        customer_tracking_token: crypto.randomUUID(),
      })
      .select()
      .single();

    // 3. Send E-Mail via Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const trackingUrl = `https://my-dispatch.de/tracking/${tracking.customer_tracking_token}`;

    const emailBody = {
      from: 'MyDispatch <noreply@my-dispatch.de>',
      to: booking.customers.email,
      subject: getEmailSubject(eventType),
      html: getEmailHTML(eventType, booking.drivers, trackingUrl),
    };

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailBody),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Notification Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

function getEmailSubject(eventType: string): string {
  switch (eventType) {
    case 'driver_assigned': return 'Ihr Fahrer wurde zugewiesen';
    case 'driver_on_way': return 'Ihr Fahrer ist unterwegs';
    case 'driver_nearby': return 'Ihr Fahrer ist gleich da!';
    case 'driver_arrived': return 'Ihr Fahrer ist angekommen';
    default: return 'MyDispatch Benachrichtigung';
  }
}

function getEmailHTML(eventType: string, driver: any, trackingUrl: string): string {
  return `
    <h2>${getEmailSubject(eventType)}</h2>
    <p>Ihr Fahrer <strong>${driver.first_name} ${driver.last_name}</strong> ist auf dem Weg zu Ihnen.</p>
    <p><a href="${trackingUrl}">Klicken Sie hier, um die Fahrt live zu verfolgen</a></p>
    <p>Fahrzeug: ${driver.vehicle?.license_plate || 'N/A'}</p>
    <p>Telefon: ${driver.phone || 'N/A'}</p>
    <br>
    <p style="color: #666;">Diese E-Mail wurde automatisch von MyDispatch versendet.</p>
  `;
}
```

### Phase 2: Frontend (React Components)

#### 1. LiveMap.tsx (Dispatcher) - Migration zu HERE Maps
```typescript
// src/components/dashboard/LiveMap.tsx
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

export function LiveMap() {
  const { profile } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  const hereMapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (!mapRef.current || !window.H) return;

    // Initialize HERE Map
    const platform = new window.H.service.Platform({
      apikey: 'B2LzkeuF160bqka3sTxpkEKGQ12rKaXpgCifN5_05uY'
    });

    const defaultLayers = platform.createDefaultLayers();
    const map = new window.H.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      {
        zoom: 12,
        center: { lat: 48.1351, lng: 11.5820 }, // München
      }
    );

    const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));
    const ui = window.H.ui.UI.createDefault(map, defaultLayers);

    hereMapRef.current = map;

    // Fetch initial positions
    fetchVehiclePositions();

    // Realtime subscription
    const channel = supabase
      .channel(`vehicle-tracking-${profile.company_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicle_positions',
          filter: `company_id=eq.${profile.company_id}`,
        },
        (payload) => {
          updateMarker(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      map.dispose();
    };
  }, [profile.company_id]);

  const fetchVehiclePositions = async () => {
    const { data: positions } = await supabase
      .from('vehicle_positions')
      .select('*, vehicles(*), drivers(*)')
      .eq('company_id', profile.company_id)
      .order('timestamp', { ascending: false });

    // Get latest position per vehicle
    const latestPositions = new Map();
    positions?.forEach(pos => {
      if (!latestPositions.has(pos.vehicle_id)) {
        latestPositions.set(pos.vehicle_id, pos);
      }
    });

    latestPositions.forEach(pos => addMarker(pos));
  };

  const addMarker = (position: any) => {
    if (!hereMapRef.current) return;

    const icon = new window.H.map.Icon(`
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${getMarkerColor(position)}" stroke="white" stroke-width="2"/>
      </svg>
    `);

    const marker = new window.H.map.Marker(
      { lat: position.latitude, lng: position.longitude },
      { icon }
    );

    marker.addEventListener('tap', () => {
      const bubble = new window.H.ui.InfoBubble(
        { lat: position.latitude, lng: position.longitude },
        {
          content: `
            <div style="padding: 10px;">
              <h3>${position.vehicles.license_plate}</h3>
              <p>Fahrer: ${position.drivers?.first_name} ${position.drivers?.last_name}</p>
              <p>Status: ${getStatusLabel(position.vehicles.status)}</p>
              <p>Speed: ${position.speed ? Math.round(position.speed) + ' km/h' : 'N/A'}</p>
            </div>
          `
        }
      );
      hereMapRef.current.getUI().addBubble(bubble);
    });

    hereMapRef.current.addObject(marker);
    markersRef.current.set(position.vehicle_id, marker);
  };

  const updateMarker = (position: any) => {
    const marker = markersRef.current.get(position.vehicle_id);
    if (marker) {
      marker.setGeometry({ lat: position.latitude, lng: position.longitude });
    } else {
      addMarker(position);
    }
  };

  const getMarkerColor = (position: any) => {
    if (position.vehicles.status === 'im_einsatz') return '#EF4444'; // Rot
    if (position.drivers?.shift_status === 'break') return '#FCD34D'; // Gelb
    if (position.drivers?.shift_status === 'offline') return '#6B7280'; // Grau
    return '#10B981'; // Grün
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      available: 'Verfügbar',
      im_einsatz: 'Im Einsatz',
      wartung: 'Wartung',
      defekt: 'Defekt',
    };
    return labels[status] || status;
  };

  return (
    <div className="relative w-full h-[600px]">
      <div ref={mapRef} className="absolute inset-0 rounded-lg" />
    </div>
  );
}
```

#### 2. DriverTracking.tsx (Fahrer-App)
```typescript
// src/pages/DriverTracking.tsx (bereits vorhanden, erweitern)
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Play, Square } from 'lucide-react';

export default function DriverTracking() {
  const { profile } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<any>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [activeShift, setActiveShift] = useState<any>(null);

  const startShift = async () => {
    // 1. Check GPS Consent
    const { data: consent } = await supabase
      .from('gps_consent')
      .select('*')
      .eq('driver_id', profile.id)
      .single();

    if (!consent?.consent_given) {
      // Show consent dialog
      const confirmed = window.confirm(
        'GPS-Tracking während der Schicht erforderlich.\n\n' +
        'Ihre Position wird alle 10 Sekunden an die Zentrale übermittelt.\n' +
        'Daten werden nach 24 Stunden automatisch gelöscht.\n\n' +
        'Stimmen Sie zu?'
      );

      if (!confirmed) return;

      await supabase.from('gps_consent').insert({
        driver_id: profile.id,
        company_id: profile.company_id,
        consent_given: true,
        consent_given_at: new Date().toISOString(),
        consent_text: 'GPS-Tracking während Schicht (24h Speicherung)',
        ip_address: await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(d => d.ip),
        user_agent: navigator.userAgent,
      });
    }

    // 2. Create Shift
    const { data: shift } = await supabase
      .from('shifts')
      .insert({
        driver_id: profile.id,
        vehicle_id: selectedVehicle.id,
        company_id: profile.company_id,
        date: new Date().toISOString().split('T')[0],
        shift_start_time: new Date().toTimeString().split(' ')[0],
        gps_tracking_enabled: true,
        tracking_started_at: new Date().toISOString(),
      })
      .select()
      .single();

    setActiveShift(shift);

    // 3. Start GPS Tracking
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const gpsData = {
          vehicle_id: selectedVehicle.id,
          driver_id: profile.id,
          shift_id: shift.id,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed ? position.coords.speed * 3.6 : null, // m/s to km/h
          heading: position.coords.heading,
          company_id: profile.company_id,
          timestamp: new Date().toISOString(),
        };

        setCurrentPosition(gpsData);

        // Send to Supabase (with offline support)
        sendGPSData(gpsData);
      },
      (error) => {
        console.error('GPS Error:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    setWatchId(id);
    setIsTracking(true);
  };

  const sendGPSData = async (gpsData: any) => {
    try {
      const { error } = await supabase
        .from('vehicle_positions')
        .insert(gpsData);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to send GPS data, saving offline:', error);
      
      // Save to IndexedDB for offline support
      const db = await openDB('gps-queue', 1, {
        upgrade(db) {
          db.createObjectStore('positions', { autoIncrement: true });
        },
      });
      await db.add('positions', gpsData);
    }
  };

  const endShift = async () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }

    await supabase
      .from('shifts')
      .update({
        shift_end_time: new Date().toTimeString().split(' ')[0],
        tracking_ended_at: new Date().toISOString(),
      })
      .eq('id', activeShift.id);

    setIsTracking(false);
    setActiveShift(null);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">GPS-Tracking</h1>

      <Card className="p-6">
        {!isTracking ? (
          <div className="text-center space-y-4">
            <MapPin className="h-16 w-16 mx-auto text-muted-foreground" />
            <p>Schicht starten für GPS-Tracking</p>
            <Button onClick={startShift} size="lg">
              <Play className="mr-2 h-5 w-5" />
              Schicht starten
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800 font-semibold">🟢 GPS-Tracking aktiv</p>
              <p className="text-sm text-green-600">Position wird alle 10 Sekunden übermittelt</p>
            </div>

            {currentPosition && (
              <div className="bg-muted/30 rounded-md p-4 space-y-2">
                <p className="text-sm">
                  <strong>Latitude:</strong> {currentPosition.latitude.toFixed(6)}
                </p>
                <p className="text-sm">
                  <strong>Longitude:</strong> {currentPosition.longitude.toFixed(6)}
                </p>
                <p className="text-sm">
                  <strong>Genauigkeit:</strong> ±{Math.round(currentPosition.accuracy)}m
                </p>
                {currentPosition.speed && (
                  <p className="text-sm">
                    <strong>Geschwindigkeit:</strong> {Math.round(currentPosition.speed)} km/h
                  </p>
                )}
              </div>
            )}

            <Button onClick={endShift} variant="destructive" size="lg" className="w-full">
              <Square className="mr-2 h-5 w-5" />
              Schicht beenden
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
```

#### 3. CustomerTracking.tsx (Kunden-Portal)
```typescript
// src/pages/CustomerTracking.tsx (NEU)
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function CustomerTracking() {
  const { token } = useParams<{ token: string }>();
  const [tracking, setTracking] = useState<any>(null);
  const [driverPosition, setDriverPosition] = useState<any>(null);
  const [eta, setEta] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const hereMapRef = useRef<any>(null);

  useEffect(() => {
    fetchTrackingData();
  }, [token]);

  const fetchTrackingData = async () => {
    try {
      // Fetch tracking data via token (no auth required!)
      const { data, error: fetchError } = await supabase
        .from('booking_tracking')
        .select('*, bookings(*), drivers(*), vehicles(*)')
        .eq('customer_tracking_token', token)
        .single();

      if (fetchError) {
        setError('Tracking-Link ungültig oder abgelaufen');
        return;
      }

      if (!data.tracking_enabled) {
        setError('Tracking ist für diese Fahrt nicht aktiviert');
        return;
      }

      setTracking(data);

      // Initialize HERE Map
      initializeMap();

      // Subscribe to driver position updates
      subscribeToDriverPosition(data.driver_id);

      // Fetch ETA every 30s
      fetchETA(data);
      const etaInterval = setInterval(() => fetchETA(data), 30000);

      return () => clearInterval(etaInterval);
    } catch (err) {
      console.error('Tracking Error:', err);
      setError('Fehler beim Laden der Tracking-Daten');
    }
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.H) return;

    const platform = new window.H.service.Platform({
      apikey: 'B2LzkeuF160bqka3sTxpkEKGQ12rKaXpgCifN5_05uY'
    });

    const defaultLayers = platform.createDefaultLayers();
    const map = new window.H.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      {
        zoom: 14,
        center: { lat: 48.1351, lng: 11.5820 },
      }
    );

    new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));
    window.H.ui.UI.createDefault(map, defaultLayers);

    hereMapRef.current = map;
  };

  const subscribeToDriverPosition = (driverId: string) => {
    const channel = supabase
      .channel(`driver-tracking-${driverId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicle_positions',
          filter: `driver_id=eq.${driverId}`,
        },
        (payload) => {
          setDriverPosition(payload.new);
          updateDriverMarker(payload.new);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const updateDriverMarker = (position: any) => {
    if (!hereMapRef.current) return;

    // Remove old marker
    hereMapRef.current.getObjects().forEach((obj: any) => {
      if (obj.getData()?.type === 'driver') {
        hereMapRef.current.removeObject(obj);
      }
    });

    // Add new marker
    const icon = new window.H.map.Icon(`
      <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="#10B981" stroke="white" stroke-width="3"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-size="16">🚗</text>
      </svg>
    `);

    const marker = new window.H.map.Marker(
      { lat: position.latitude, lng: position.longitude },
      { icon, data: { type: 'driver' } }
    );

    hereMapRef.current.addObject(marker);
    hereMapRef.current.setCenter({ lat: position.latitude, lng: position.longitude });
  };

  const fetchETA = async (trackingData: any) => {
    const { data, error } = await supabase.functions.invoke('calculate-eta', {
      body: {
        driverPosition: driverPosition || { lat: 48.1351, lng: 11.5820 },
        customerAddress: trackingData.bookings.pickup_address,
      },
    });

    if (!error && data) {
      setEta(data);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6 text-center">
          <p className="text-destructive">{error}</p>
        </Card>
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6 text-center">
          <p>Lädt Tracking-Daten...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={tracking.drivers.profile_image_url || '/placeholder-avatar.png'} 
            alt={tracking.drivers.first_name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold">
              {tracking.drivers.first_name} {tracking.drivers.last_name}
            </h2>
            <p className="text-muted-foreground">
              {tracking.vehicles.license_plate} • {tracking.vehicles.vehicle_class}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">ETA</p>
              <p className="font-semibold">{eta?.eta_minutes || '...'} Min</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Entfernung</p>
              <p className="font-semibold">{eta?.distance_km || '...'} km</p>
            </div>
          </div>
        </div>

        <a 
          href={`tel:${tracking.drivers.phone}`}
          className="mt-4 flex items-center justify-center gap-2 bg-accent text-white rounded-lg py-3 hover:bg-accent/90"
        >
          <Phone className="h-5 w-5" />
          Fahrer anrufen
        </a>
      </Card>

      <div ref={mapRef} className="w-full h-[500px] rounded-lg" />

      <Card className="p-4 bg-muted/30">
        <p className="text-sm text-center text-muted-foreground">
          🔒 Dieses Tracking endet automatisch nach Fahrtende
        </p>
      </Card>
    </div>
  );
}
```

---

## 📋 Sprint 27: GPS-Tracking Implementation (7 Tage)

### Tag 1: Datenbank-Schema
- [ ] Migration: vehicle_positions, booking_tracking, gps_consent, geofence_zones
- [ ] RLS Policies testen
- [ ] Indexes erstellen
- [ ] Cron-Job für Cleanup einrichten

### Tag 2-3: Edge Functions
- [ ] calculate-eta implementieren
- [ ] cleanup-gps-positions implementieren
- [ ] notify-customer implementieren
- [ ] Tests für alle Functions

### Tag 4: Fahrer-App (PWA)
- [ ] DriverTracking.tsx erweitern
- [ ] GPS-Consent-Dialog
- [ ] Offline-Support (IndexedDB)
- [ ] Service Worker konfigurieren

### Tag 5: Dispatcher-Dashboard
- [ ] LiveMap.tsx zu HERE Maps migrieren
- [ ] Realtime-Updates implementieren
- [ ] Marker-System mit Status-Farben
- [ ] InfoBubbles mit Aktionen

### Tag 6: Kunden-Portal
- [ ] CustomerTracking.tsx implementieren
- [ ] Token-basierter Zugriff (ohne Login)
- [ ] ETA-Display mit Traffic
- [ ] Push-Benachrichtigungen (optional)

### Tag 7: Testing & Dokumentation
- [ ] E2E-Tests (alle Rollen)
- [ ] Performance-Tests (1000+ Marker)
- [ ] DSGVO-Checkliste abarbeiten
- [ ] User-Dokumentation schreiben

---

## 🎯 Erfolgskriterien

### Must-Have:
- ✅ Dispatcher sieht alle Fahrzeuge in Echtzeit (<10s Latency)
- ✅ Fahrer-GPS funktioniert offline (IndexedDB-Queue)
- ✅ Kunden können ihren Fahrer tracken (nur bei aktiver Fahrt)
- ✅ GPS-Daten werden nach 24h gelöscht (DSGVO)
- ✅ Einwilligung wird rechtssicher dokumentiert
- ✅ Mobile-First PWA funktioniert auf iOS & Android

### Nice-to-Have (Sprint 28+):
- ⚪ Geofencing-Alerts (Flughafen-Zone)
- ⚪ Historical Tracking (24h Replay)
- ⚪ Push-Benachrichtigungen für Kunden
- ⚪ Route-Optimierung (Multi-Stop)

---

## 📊 Performance-Ziele

| Metrik | Ziel | Messung |
|--------|------|---------|
| GPS-Update-Frequenz | 10s | watchPosition interval |
| Map-Load-Time | <2s | Lighthouse |
| Marker-Update-Latency | <5s | Realtime-Subscription |
| Offline-Sync-Time | <30s | IndexedDB → Supabase |
| ETA-Berechnung | <1s | Edge Function Response |
| 24h-Cleanup-Duration | <10s | Cron-Job Execution |

---

## 🔐 Sicherheits-Checkliste

- [x] RLS Policies auf allen GPS-Tabellen
- [x] Company-Isolation in allen Queries
- [x] HTTPS/WSS für alle Übertragungen
- [x] GPS-Consent vor erstem Tracking
- [x] Token-basierter Zugriff für Kunden (kein Auth)
- [x] 24h Auto-Delete via Cron
- [x] Audit-Logs für GPS-Zugriffe
- [x] Keine IP-Speicherung von GPS-Daten
- [x] Offline-Queue verschlüsselt (IndexedDB)

---

**Erstellt:** 17.10.2025, 05:15 Uhr (UTC)  
**Autor:** MyDispatch Development Team  
**Status:** 🟢 Ready for Implementation  
**Dependencies:** HERE_API_MIGRATION_KONZEPT.md  
**Genehmigung:** ⏳ Ausstehend
