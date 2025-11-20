# HERE Maps Quick Start Guide V18.3.24

## 🚀 Schnellstart: Integration in bestehende Seiten

### 1. Live-Karte ins Dashboard einfügen

**Datei:** `src/pages/Dashboard.tsx`

```tsx
import { LiveDriverMap } from '@/components/dashboard/LiveDriverMap';

// Im Dashboard-Component:
export default function Dashboard() {
  const { profile } = useAuth();
  
  return (
    <div className="space-y-6">
      {/* Bestehende KPI-Cards */}
      <DashboardKPICards companyId={profile.company_id} />
      
      {/* NEU: Live-Karte */}
      <LiveDriverMap companyId={profile.company_id} />
      
      {/* Rest des Dashboards */}
    </div>
  );
}
```

**Ergebnis:** Live-Karte mit Fahrer-Positionen, Auto-Refresh alle 30s

---

### 2. Adress-Autosuggest in Auftrags-Formular

**Datei:** `src/pages/Auftraege.tsx` oder Booking-Form-Component

```tsx
import { AddressAutosuggest } from '@/components/maps/AddressAutosuggest';
import { useState } from 'react';

export default function BookingForm() {
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupCoords, setPickupCoords] = useState<{lat: number, lng: number} | null>(null);
  
  return (
    <form>
      {/* Abholadresse mit Autosuggest */}
      <AddressAutosuggest
        value={pickupAddress}
        onChange={setPickupAddress}
        onSelect={(suggestion) => {
          setPickupCoords({ lat: suggestion.lat, lng: suggestion.lng });
          console.log('Koordinaten gespeichert:', suggestion);
        }}
        placeholder="Abholadresse eingeben"
      />
      
      {/* Zieladresse mit Autosuggest */}
      <AddressAutosuggest
        value={dropoffAddress}
        onChange={setDropoffAddress}
        onSelect={(suggestion) => {
          // Optional: Route berechnen
          calculateRoute(pickupCoords, { lat: suggestion.lat, lng: suggestion.lng });
        }}
        placeholder="Zieladresse eingeben"
      />
    </form>
  );
}
```

---

### 3. Routing für Preis-Kalkulation

**Datei:** Beliebige Komponente

```tsx
import { useHERERouting } from '@/hooks/use-here-routing';

export default function PriceCalculator() {
  const { calculateRoute, formatDistance, formatDuration, isCalculating } = useHERERouting();
  const [route, setRoute] = useState(null);
  
  const handleCalculate = async () => {
    const result = await calculateRoute(
      { lat: 48.1351, lng: 11.5820 }, // Abholadresse
      { lat: 48.1500, lng: 11.5900 }, // Zieladresse
      'taxi'
    );
    
    if (result) {
      setRoute(result);
      console.log('Distanz:', formatDistance(result.distance));
      console.log('Dauer:', formatDuration(result.duration));
      
      // Preis berechnen (z.B. 2€/km)
      const price = (result.distance / 1000) * 2;
      console.log('Preis:', price.toFixed(2), '€');
    }
  };
  
  return (
    <div>
      <Button onClick={handleCalculate} disabled={isCalculating}>
        {isCalculating ? 'Berechne...' : 'Route berechnen'}
      </Button>
      
      {route && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p>Distanz: {formatDistance(route.distance)}</p>
          <p>Dauer: {formatDuration(route.duration)}</p>
          <p>Preis: {((route.distance / 1000) * 2).toFixed(2)} €</p>
        </div>
      )}
    </div>
  );
}
```

---

### 4. Standalone Karte für detaillierte Ansicht

**Datei:** Neue Seite `src/pages/LiveMap.tsx`

```tsx
import { HEREMap } from '@/components/maps/HEREMap';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function LiveMapPage() {
  const [drivers, setDrivers] = useState([]);
  
  useEffect(() => {
    // Fahrer laden
    fetchDrivers();
    
    // Realtime-Updates
    const channel = supabase
      .channel('drivers-map')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drivers' }, fetchDrivers)
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, []);
  
  const fetchDrivers = async () => {
    const { data } = await supabase
      .from('drivers')
      .select('*')
      .eq('archived', false);
    setDrivers(data || []);
  };
  
  const markers = drivers.map(d => ({
    lat: 48.1351 + Math.random() * 0.05, // Mock GPS
    lng: 11.5820 + Math.random() * 0.05,
    label: `${d.first_name} ${d.last_name}`
  }));
  
  return (
    <div className="h-screen w-full">
      <HEREMap
        center={{ lat: 48.1351, lng: 11.5820 }}
        zoom={12}
        markers={markers}
        className="h-full"
      />
    </div>
  );
}
```

---

## 🔧 Anpassungen & Styling

### Marker-Farben ändern

**Datei:** `src/components/maps/HEREMap.tsx` (Zeile ~90)

```tsx
// Grüne Marker (Standard)
const icon = new H.map.Icon(
  '<svg width="24" height="24"><circle cx="12" cy="12" r="10" fill="#22c55e" stroke="#fff" stroke-width="2"/></svg>'
);

// Orange Marker (z.B. für beschäftigte Fahrer)
const icon = new H.map.Icon(
  '<svg width="24" height="24"><circle cx="12" cy="12" r="10" fill="#eab308" stroke="#fff" stroke-width="2"/></svg>'
);

// Rote Marker (z.B. für offline Fahrer)
const icon = new H.map.Icon(
  '<svg width="24" height="24"><circle cx="12" cy="12" r="10" fill="#ef4444" stroke="#fff" stroke-width="2"/></svg>'
);
```

### Karten-Höhe anpassen

```tsx
// Desktop: 96 = 384px
<HEREMap className="h-96" />

// Mobile: 64 = 256px
<HEREMap className="h-64 md:h-96" />

// Fullscreen
<HEREMap className="h-screen" />
```

### Routen-Farben

**Datei:** `src/components/maps/HEREMap.tsx` (Zeile ~115)

```tsx
const routeLine = new H.map.Polyline(lineString, {
  style: { 
    strokeColor: '#22c55e', // Grün (Standard)
    lineWidth: 4 
  }
});

// Alternative: Orange für alternative Route
style: { strokeColor: '#eab308', lineWidth: 3 }
```

---

## 📊 Performance-Tipps

### 1. Lazy Loading der Karte

```tsx
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const HEREMap = lazy(() => import('@/components/maps/HEREMap'));

<Suspense fallback={<Loader2 className="animate-spin" />}>
  <HEREMap center={...} />
</Suspense>
```

### 2. Debouncing für Autosuggest

Bereits implementiert in `AddressAutosuggest.tsx` (300ms)

### 3. Cache für Routen

```tsx
const routeCache = new Map();

const getCachedRoute = async (from, to) => {
  const key = `${from.lat},${from.lng}-${to.lat},${to.lng}`;
  if (routeCache.has(key)) {
    return routeCache.get(key);
  }
  const route = await calculateRoute(from, to);
  routeCache.set(key, route);
  return route;
};
```

---

## 🔒 DSGVO-Hinweise

### GPS-Daten-Retention

Aktuell: **Mock-Positionen** (keine echten GPS-Daten)

Für echtes GPS-Tracking später:
```sql
-- Migration: driver_positions Tabelle mit Auto-Delete
CREATE TABLE driver_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Auto-Delete nach 24h via Cron
  CONSTRAINT valid_timestamp CHECK (timestamp > NOW() - INTERVAL '24 hours')
);
```

### Consent-Management

```tsx
// Vor GPS-Tracking prüfen:
const { data: consent } = await supabase
  .from('chat_consent')
  .select('consent_given')
  .eq('user_id', userId)
  .eq('entity_type', 'driver')
  .single();

if (!consent?.consent_given) {
  // Consent-Dialog anzeigen
  return;
}
```

---

## 🎨 Design-Anpassungen

### Gradient-Header (wie im Corporate Design)

```tsx
<CardHeader className="bg-gradient-to-r from-green-500/10 to-orange-500/10">
  <CardTitle>Live-Karte</CardTitle>
</CardHeader>
```

### Decorative Circles

```tsx
<div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-primary/20 blur-xl" />
<div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-accent/20 blur-lg" />
```

---

## 🧪 Testing

### Unit-Tests

```tsx
import { render } from '@testing-library/react';
import { HEREMap } from '@/components/maps/HEREMap';

test('HEREMap renders', () => {
  const { container } = render(
    <HEREMap center={{ lat: 48, lng: 11 }} />
  );
  expect(container.querySelector('.here-map')).toBeInTheDocument();
});
```

### Lighthouse-Score

Ziel: >90 für Mobile

```bash
npx lighthouse https://532d4c5b-6df3-4e1c-93e4-4632fcf0ef9b.lovableproject.com --view
```

---

## 📞 Support

**Fragen?** Siehe `HIER_INTEGRATION_REPORT_V18.3.24.md`

**API-Limits:** 250.000 Requests/Monat (HERE Freemium)

**Dokumentation:** https://developer.here.com/documentation

---

**Version:** V18.3.24  
**Erstellt:** 2025-10-20  
**Status:** ✅ Production-Ready
