# 🏗️ MyDispatch V18.1 - Implementierungs-Blueprints

## 📐 Blueprint 1: Global Search System

### Dateistruktur
```
src/
├── components/
│   └── search/
│       ├── GlobalSearch.tsx          # Main Search Component
│       ├── SearchResults.tsx         # Results Display
│       ├── SearchFilters.tsx         # Filter UI
│       └── FilterPresets.tsx         # Saved Filters
├── hooks/
│   ├── use-global-search.tsx         # Search Logic
│   └── use-keyboard-shortcuts.tsx    # Keyboard Nav
└── lib/
    └── search-utils.ts               # Search Utilities
```

### Komponenten-Architektur
```typescript
// src/components/search/GlobalSearch.tsx
GlobalSearch
├── SearchInput (Cmd+K Trigger)
├── SearchFilters
│   ├── EntityFilter (Bookings, Customers, Drivers, ...)
│   ├── StatusFilter
│   └── DateRangeFilter
├── FilterPresets
│   ├── "Heute offen"
│   ├── "Überfällig"
│   └── "Meine Fahrer"
└── SearchResults
    ├── BookingResult
    ├── CustomerResult
    ├── DriverResult
    └── VehicleResult
```

### Datenfluss
```
User Input (Cmd+K)
    ↓
GlobalSearch Component
    ↓
useGlobalSearch Hook
    ↓
Debounced Query (300ms)
    ↓
Supabase Full-Text Search
    ↓
Fuzzy Match (Client-Side)
    ↓
Sorted Results (by Score)
    ↓
SearchResults Display
```

---

## 📐 Blueprint 2: React Query Cache System

### Migration-Plan
```typescript
// VORHER (useState)
const [bookings, setBookings] = useState([]);
useEffect(() => {
  fetchBookings();
}, []);

// NACHHER (React Query)
const { data: bookings, isLoading, error, refetch } = useBookingsQuery();
```

### Cache-Strategie
```typescript
// src/lib/react-query-config.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,        // 30s - Daten gelten als "frisch"
      cacheTime: 5 * 60 * 1000, // 5min - Cache-Aufbewahrung
      retry: 3,                 // 3x Retry bei Fehler
      retryDelay: (attemptIndex) => 
        Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential Backoff
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
});

// Query Keys Hierarchie
['bookings', companyId] → Alle Aufträge
['bookings', companyId, 'today'] → Heutige Aufträge
['bookings', companyId, bookingId] → Einzelner Auftrag
['drivers', companyId] → Alle Fahrer
['drivers', companyId, driverId] → Einzelner Fahrer
```

### Optimistic Updates
```typescript
// Beispiel: Auftrag-Status ändern
const updateBookingMutation = useMutation({
  mutationFn: updateBooking,
  onMutate: async (newData) => {
    // Cancel laufende Queries
    await queryClient.cancelQueries(['bookings']);
    
    // Snapshot des alten Zustands
    const previousBookings = queryClient.getQueryData(['bookings']);
    
    // Optimistic Update
    queryClient.setQueryData(['bookings'], (old) => 
      old.map(b => b.id === newData.id ? { ...b, ...newData } : b)
    );
    
    return { previousBookings };
  },
  onError: (err, newData, context) => {
    // Rollback bei Fehler
    queryClient.setQueryData(['bookings'], context.previousBookings);
  },
  onSettled: () => {
    // Refetch nach Mutation
    queryClient.invalidateQueries(['bookings']);
  },
});
```

---

## 📐 Blueprint 3: AI Smart Routing

### Edge Function Architektur
```typescript
// supabase/functions/ai-smart-routing/index.ts

Eingabe:
{
  origin: { lat: 48.1351, lng: 11.5820 },
  destination: { lat: 48.1461, lng: 11.5618 },
  vehicle_class: "Business Class - Limousine (1-4 Pax)",
  pickup_time: "2025-10-15T14:30:00Z",
  passengers: 2,
  luggage: 1
}

Verarbeitung:
1. Google Maps Directions API → Routen abrufen
2. HERE Traffic API → Verkehrslage prüfen
3. OpenWeatherMap API → Wetter abrufen
4. Lovable AI → Optimale Route berechnen

AI-Prompt:
"Analysiere folgende Route:
- Start: München Hauptbahnhof (48.1351, 11.5820)
- Ziel: Flughafen München (48.1461, 11.5618)
- Abfahrt: 15.10.2025 14:30 Uhr
- Fahrzeugklasse: Business Limousine
- Verkehrslage: {traffic_data}
- Wetter: {weather_data}

Berechne:
1. Optimale Route unter Berücksichtigung von Verkehr/Wetter
2. Geschätzter Preis (Basis: 2€/km + 0,50€/min + Fahrzeugklassen-Zuschlag)
3. Alternative Routen bei hohem Verkehrsaufkommen
4. Risikofaktoren (Stau, Unwetter, Baustellen)

Antwort als JSON:
{
  recommended_route: {...},
  estimated_price: number,
  alternatives: [...],
  warnings: [...]
}"

Ausgabe:
{
  recommended_route: {
    distance_km: 38.5,
    duration_minutes: 35,
    traffic_delay_minutes: 5,
    weather_impact: "Leichter Regen",
    estimated_price: 95.50,
    route_points: [...],
    instructions: [...]
  },
  alternatives: [
    {
      name: "Autobahn-Route",
      distance_km: 42.0,
      duration_minutes: 32,
      estimated_price: 98.00
    }
  ],
  warnings: [
    "Leichter Verkehr auf A9",
    "Regen möglich - Fahrtzeit +5min"
  ]
}
```

### Caching-Strategie
```typescript
// Cache Routen für 30 Minuten
// Key: origin_lat_lng + destination_lat_lng + pickup_time (gerundet auf 30min)
const cacheKey = `${origin.lat}_${origin.lng}_${destination.lat}_${destination.lng}_${roundedTime}`;

// Bei Cache-Hit: Sofortantwort ohne AI-Call
// Bei Cache-Miss: AI-Call + Cache speichern
```

---

## 📐 Blueprint 4: Auto-Assignment System

### Algorithmus-Flowchart
```
Neuer Auftrag erstellt
    ↓
1. Verfügbare Fahrer ermitteln
   - shift_status = 'available'
   - company_id match
   - archived = false
    ↓
2. Passende Fahrzeuge ermitteln
   - vehicle_class match
   - status = 'available'
   - company_id match
    ↓
3. Scoring berechnen (0-100 Punkte)
   ┌─────────────────────────────┐
   │ Proximity Score (40%)       │
   │ - GPS-Distanz zum Abholort  │
   │ - <5km: 100 Punkte          │
   │ - 5-10km: 80 Punkte         │
   │ - 10-20km: 60 Punkte        │
   │ - >20km: 40 Punkte          │
   ├─────────────────────────────┤
   │ Vehicle Match Score (30%)   │
   │ - Exakte Klasse: 100 Punkte │
   │ - Höhere Klasse: 80 Punkte  │
   │ - Niedrigere: 0 Punkte      │
   ├─────────────────────────────┤
   │ Workload Score (20%)        │
   │ - 0 Aufträge: 100 Punkte    │
   │ - 1-2 Aufträge: 80 Punkte   │
   │ - 3-5 Aufträge: 60 Punkte   │
   │ - >5 Aufträge: 40 Punkte    │
   ├─────────────────────────────┤
   │ Availability Score (10%)    │
   │ - Online: 100 Punkte        │
   │ - Pause: 50 Punkte          │
   │ - Offline: 0 Punkte         │
   └─────────────────────────────┘
    ↓
4. Bester Match auswählen
   - Höchster Gesamtscore
    ↓
5. Automatisch zuweisen
   - booking.driver_id = selected_driver_id
   - booking.vehicle_id = selected_vehicle_id
   - driver.shift_status = 'busy'
   - vehicle.status = 'in_use'
    ↓
6. Benachrichtigung
   - E-Mail an Fahrer
   - Toast im Dashboard
```

### Implementierung
```typescript
// src/lib/auto-assignment.ts

interface AssignmentScore {
  driver_id: string;
  vehicle_id: string;
  total_score: number;
  factors: {
    proximity: number;    // 0-100
    vehicle_match: number; // 0-100
    workload: number;      // 0-100
    availability: number;  // 0-100
  };
}

export async function calculateBestAssignment(
  booking: Booking
): Promise<AssignmentScore | null> {
  // 1. Verfügbare Fahrer
  const availableDrivers = await supabase
    .from('drivers')
    .select('*, vehicle_positions(*)')
    .eq('company_id', booking.company_id)
    .eq('shift_status', 'available')
    .eq('archived', false);

  if (!availableDrivers.data?.length) return null;

  // 2. Passende Fahrzeuge
  const matchingVehicles = await supabase
    .from('vehicles')
    .select('*')
    .eq('company_id', booking.company_id)
    .eq('status', 'available')
    .eq('archived', false);

  // 3. Scoring
  const scores: AssignmentScore[] = [];
  
  for (const driver of availableDrivers.data) {
    for (const vehicle of matchingVehicles.data) {
      // Fahrzeugklasse-Match
      if (vehicle.vehicle_class !== booking.vehicle_type) continue;
      
      // GPS-Distanz berechnen
      const distance = calculateDistance(
        driver.vehicle_positions?.[0],
        booking.pickup_location_coords
      );
      
      const proximityScore = calculateProximityScore(distance);
      const vehicleMatchScore = vehicle.vehicle_class === booking.vehicle_type ? 100 : 80;
      
      // Workload: Anzahl aktiver Aufträge
      const workload = await getDriverWorkload(driver.id);
      const workloadScore = calculateWorkloadScore(workload);
      
      const availabilityScore = driver.shift_status === 'available' ? 100 : 50;
      
      const totalScore = 
        proximityScore * 0.4 +
        vehicleMatchScore * 0.3 +
        workloadScore * 0.2 +
        availabilityScore * 0.1;
      
      scores.push({
        driver_id: driver.id,
        vehicle_id: vehicle.id,
        total_score: totalScore,
        factors: {
          proximity: proximityScore,
          vehicle_match: vehicleMatchScore,
          workload: workloadScore,
          availability: availabilityScore,
        },
      });
    }
  }
  
  // Bester Match
  return scores.sort((a, b) => b.total_score - a.total_score)[0] || null;
}
```

---

## 📐 Blueprint 5: PDF/Excel Export

### Export-Architektur
```
User klickt "Export"
    ↓
Export-Dialog
├── Format wählen (PDF/Excel)
├── Zeitraum wählen
├── Filter anwenden
└── Template wählen (Standard/Custom)
    ↓
Edge Function: generate-export
    ↓
Daten abrufen (Supabase)
    ↓
Format-Spezifisch:
├── PDF: jsPDF + Company Branding
└── Excel: xlsx + Formeln
    ↓
File generieren
    ↓
Supabase Storage hochladen
    ↓
Download-Link zurückgeben
    ↓
User erhält Download
```

### PDF-Template
```typescript
// supabase/functions/generate-pdf/index.ts
import { jsPDF } from "jspdf";

// Company Branding laden
const logo = await fetch(company.logo_url);
const primaryColor = company.primary_color || '#EADEBD';

// PDF erstellen
const doc = new jsPDF();

// Header mit Logo
doc.addImage(logo, 'PNG', 10, 10, 50, 20);
doc.setFillColor(primaryColor);
doc.rect(0, 0, 210, 40, 'F');

// Titel
doc.setFontSize(20);
doc.text(`Auftrags-Übersicht ${dateRange}`, 70, 20);

// Tabelle
doc.autoTable({
  head: [['Datum', 'Auftragsnr.', 'Kunde', 'Start', 'Ziel', 'Preis']],
  body: bookingsData.map(b => [
    formatDate(b.pickup_date),
    b.booking_number,
    b.customer_name,
    b.pickup_location,
    b.dropoff_location,
    formatCurrency(b.price)
  ]),
  startY: 50,
  theme: 'grid',
  headStyles: { fillColor: primaryColor },
});

// Footer
doc.setFontSize(10);
doc.text(`Erstellt am ${new Date().toLocaleDateString('de-DE')}`, 10, 280);
doc.text(`Seite ${doc.internal.getNumberOfPages()}`, 180, 280);

// Speichern
const pdfBuffer = doc.output('arraybuffer');
```

---

## 📐 Blueprint 6: PWA Installation

### Service Worker Strategie
```javascript
// public/service-worker.js

// Cache-Strategie
const CACHE_NAME = 'mydispatch-v18.1';
const CACHE_URLS = [
  '/',
  '/manifest.json',
  '/index.css',
  '/main.js',
  // ... statische Assets
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS);
    })
  );
});

// Fetch Event (Network First, fallback zu Cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Response cachen
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Bei Offline: Cache verwenden
        return caches.match(event.request);
      })
  );
});

// Background Sync (Offline-Änderungen synchronisieren)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bookings') {
    event.waitUntil(syncOfflineBookings());
  }
});
```

### PWA Prompt
```typescript
// src/hooks/use-pwa-install.tsx
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });
  }, []);
  
  const promptInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success('MyDispatch wurde installiert!');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };
  
  return { isInstallable, promptInstall };
}
```

---

## 📐 Blueprint 7: Audit Logs System

### Datenbank-Schema
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'archive'
  entity_type TEXT NOT NULL, -- 'booking', 'driver', 'vehicle', ...
  entity_id UUID NOT NULL,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_company ON audit_logs(company_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
```

### Logging-Middleware
```typescript
// src/lib/audit-logger.ts
export async function logAuditEvent({
  action,
  entityType,
  entityId,
  oldData,
  newData,
}: AuditEvent) {
  const { user } = await supabase.auth.getUser();
  const { profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('user_id', user.id)
    .single();
  
  await supabase.from('audit_logs').insert({
    company_id: profile.company_id,
    user_id: user.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    old_data: oldData,
    new_data: newData,
    ip_address: await getClientIP(),
    user_agent: navigator.userAgent,
  });
}

// Verwendung
await logAuditEvent({
  action: 'update',
  entityType: 'booking',
  entityId: booking.id,
  oldData: oldBooking,
  newData: newBooking,
});
```

---

## 🎯 Implementierungs-Reihenfolge

### SPRINT 1 (P0) - 5 Tage
1. ✅ Datenbank-Indizes erstellen
2. ✅ React Query Integration
3. ✅ Error Handling + Retry
4. ✅ Audit Logs System
5. ✅ Global Search (Basic)

### SPRINT 2 (P1) - 7 Tage
6. ✅ AI Smart Routing
7. ✅ Auto-Assignment
8. ✅ PDF/Excel Export
9. ✅ Recurring Bookings
10. ✅ ETA-Updates

### SPRINT 3 (P2) - 7 Tage
11. ✅ PWA Installation
12. ✅ Weather-Alerts
13. ✅ Traffic-Based-Pricing
14. ✅ Custom Dashboards

---

**Status:** 🟢 Blueprints fertig, bereit für Implementierung  
**Nächster Schritt:** Code-Implementierung starten
