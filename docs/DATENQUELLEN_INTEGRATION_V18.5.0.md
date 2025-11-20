# DATENQUELLEN & INTEGRATION V18.5.0

> **Version:** 18.5.0  
> **Status:** ✅ PRODUKTIV  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 ÜBERSICHT

MyDispatch integriert **5 Haupt-Datenquellen** für intelligente, datengetriebene Disposition:

1. **HERE Maps API** (Routing, Geocoding, Traffic)
2. **OpenWeatherMap API** (Wetter & Vorhersagen)
3. **Aktuelle Zeit & Zeitzonen** (World Time API)
4. **Verkehrsdaten** (HERE Traffic Flow)
5. **AI-Predictive Analytics** (Lovable AI Gateway)

---

## 🗺️ 1. HERE MAPS API

### Verwendung

- **Route-Optimierung:** Schnellste/Kürzeste Route
- **Geocoding:** Adresse → GPS-Koordinaten
- **Reverse Geocoding:** GPS → Adresse
- **Traffic-Flow:** Live-Verkehrslage
- **ETA-Berechnung:** Ankunftszeit unter Berücksichtigung von Traffic

### API-Key

**Speicherort:** Lovable Cloud → Secrets  
**Key-Name:** `HERE_API_KEY`

### Edge Function: Route-Berechnung

```typescript
// supabase/functions/calculate-route/index.ts
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const HERE_API_KEY = Deno.env.get("HERE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RouteRequest {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  departureTime?: string; // ISO 8601
  avoidTolls?: boolean;
  vehicleType?: "car" | "truck";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { origin, destination, departureTime, avoidTolls, vehicleType }: RouteRequest =
      await req.json();

    // 1. Geocoding (falls Adressen statt Koordinaten)
    // (siehe Geocoding-Section unten)

    // 2. Route-Berechnung mit Traffic
    const routeUrl = new URL("https://router.hereapi.com/v8/routes");
    routeUrl.searchParams.set("transportMode", vehicleType || "car");
    routeUrl.searchParams.set("origin", `${origin.lat},${origin.lng}`);
    routeUrl.searchParams.set("destination", `${destination.lat},${destination.lng}`);
    routeUrl.searchParams.set("return", "summary,polyline,turnByTurnActions,travelSummary");
    routeUrl.searchParams.set("apiKey", HERE_API_KEY!);

    if (departureTime) {
      routeUrl.searchParams.set("departureTime", departureTime);
    }

    if (avoidTolls) {
      routeUrl.searchParams.set("avoid[features]", "tollRoad");
    }

    const response = await fetch(routeUrl.toString());
    const data = await response.json();

    if (!response.ok || !data.routes || data.routes.length === 0) {
      throw new Error("Route nicht gefunden");
    }

    const route = data.routes[0];
    const section = route.sections[0];

    return new Response(
      JSON.stringify({
        distance: section.travelSummary.length, // Meter
        duration: section.travelSummary.duration, // Sekunden
        trafficDelay: section.travelSummary.trafficDelay || 0, // Sekunden
        baseDuration: section.travelSummary.baseDuration, // Ohne Traffic
        polyline: section.polyline, // Für Karten-Darstellung
        instructions: section.turnByTurnActions || [],
        departureTime: section.departure.time,
        arrivalTime: section.arrival.time,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("[CALCULATE-ROUTE] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

### Frontend-Integration

```typescript
// src/lib/here-api-client.ts
import { supabase } from "@/integrations/supabase/client";

export interface RouteData {
  distance: number; // Meter
  duration: number; // Sekunden
  trafficDelay: number;
  baseDuration: number;
  polyline: string;
  instructions: any[];
  departureTime: string;
  arrivalTime: string;
}

export const calculateRoute = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  options?: {
    departureTime?: string;
    avoidTolls?: boolean;
    vehicleType?: "car" | "truck";
  }
): Promise<RouteData> => {
  const { data, error } = await supabase.functions.invoke("calculate-route", {
    body: {
      origin,
      destination,
      ...options,
    },
  });

  if (error) throw error;
  return data as RouteData;
};
```

**Verwendung in Komponenten:**

```typescript
// src/components/booking/RoutePreview.tsx
import { calculateRoute } from '@/lib/here-api-client';

export function RoutePreview({ pickupAddress, dropoffAddress }: RoutePreviewProps) {
  const [routeData, setRouteData] = useState<RouteData | null>(null);

  useEffect(() => {
    const loadRoute = async () => {
      // 1. Geocode Adressen (siehe unten)
      const origin = await geocodeAddress(pickupAddress);
      const destination = await geocodeAddress(dropoffAddress);

      // 2. Route berechnen
      const route = await calculateRoute(origin, destination, {
        departureTime: new Date().toISOString(),
        avoidTolls: false,
      });

      setRouteData(route);
    };

    loadRoute();
  }, [pickupAddress, dropoffAddress]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Route-Vorschau</CardTitle>
      </CardHeader>
      <CardContent>
        {routeData && (
          <>
            <p>Distanz: {(routeData.distance / 1000).toFixed(1)} km</p>
            <p>Dauer: {Math.ceil(routeData.duration / 60)} Min</p>
            <p>Verkehrsverzögerung: +{Math.ceil(routeData.trafficDelay / 60)} Min</p>
            <p>Ankunft: {format(new Date(routeData.arrivalTime), 'HH:mm', { locale: de })}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
```

### Geocoding (Adresse → Koordinaten)

```typescript
// supabase/functions/geocode/index.ts
serve(async (req) => {
  const { address } = await req.json();

  const url = new URL("https://geocode.search.hereapi.com/v1/geocode");
  url.searchParams.set("q", address);
  url.searchParams.set("apiKey", HERE_API_KEY!);

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.items && data.items.length > 0) {
    const location = data.items[0].position;
    return new Response(
      JSON.stringify({
        lat: location.lat,
        lng: location.lng,
        address: data.items[0].address,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  throw new Error("Adresse nicht gefunden");
});
```

### Traffic-Flow (Live-Verkehrslage)

```typescript
// supabase/functions/traffic-flow/index.ts
serve(async (req) => {
  const { lat, lng, radius } = await req.json(); // radius in Metern

  const url = new URL("https://data.traffic.hereapi.com/v7/flow");
  url.searchParams.set("locationReferencing", "shape");
  url.searchParams.set("in", `circle:${lat},${lng};r=${radius}`);
  url.searchParams.set("apiKey", HERE_API_KEY!);

  const response = await fetch(url.toString());
  const data = await response.json();

  // Durchschnittliche Verkehrslage berechnen
  const avgSpeed =
    data.results.reduce((sum, item) => sum + item.currentFlow.speed, 0) / data.results.length;
  const avgJamFactor =
    data.results.reduce((sum, item) => sum + item.currentFlow.jamFactor, 0) / data.results.length;

  return new Response(
    JSON.stringify({
      avgSpeed, // km/h
      avgJamFactor, // 0-10 (0 = frei, 10 = Stau)
      status: avgJamFactor < 4 ? "free" : avgJamFactor < 8 ? "slow" : "jam",
      details: data.results,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
```

---

## 🌦️ 2. OPENWEATHERMAP API

### Verwendung

- **Live-Wetter:** Aktuelle Wetterdaten für Dashboard-Widget
- **Vorhersagen:** 5-Tage-Prognose für Smart-Routing
- **Wetter-Alerts:** Unwetter-Warnungen für Fahrer

### API-Key

**Speicherort:** Lovable Cloud → Secrets  
**Key-Name:** `OPENWEATHERMAP_API_KEY`

### Edge Function: Wetter-Daten

```typescript
// supabase/functions/fetch-weather/index.ts
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const OPENWEATHERMAP_API_KEY = Deno.env.get("OPENWEATHERMAP_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WeatherRequest {
  city?: string;
  lat?: number;
  lng?: number;
  includeForecast?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, lat, lng, includeForecast }: WeatherRequest = await req.json();

    // 1. Aktuelles Wetter
    const currentUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
    if (city) {
      currentUrl.searchParams.set("q", city);
    } else if (lat && lng) {
      currentUrl.searchParams.set("lat", lat.toString());
      currentUrl.searchParams.set("lon", lng.toString());
    }
    currentUrl.searchParams.set("appid", OPENWEATHERMAP_API_KEY!);
    currentUrl.searchParams.set("units", "metric");
    currentUrl.searchParams.set("lang", "de");

    const currentResponse = await fetch(currentUrl.toString());
    const currentData = await currentResponse.json();

    const result: any = {
      current: {
        temp: currentData.main.temp,
        feelsLike: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        windSpeed: currentData.wind.speed,
        windDirection: currentData.wind.deg,
        cloudiness: currentData.clouds.all,
        visibility: currentData.visibility,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        sunrise: new Date(currentData.sys.sunrise * 1000).toISOString(),
        sunset: new Date(currentData.sys.sunset * 1000).toISOString(),
      },
    };

    // 2. Vorhersage (optional)
    if (includeForecast) {
      const forecastUrl = new URL("https://api.openweathermap.org/data/2.5/forecast");
      if (city) {
        forecastUrl.searchParams.set("q", city);
      } else if (lat && lng) {
        forecastUrl.searchParams.set("lat", lat.toString());
        forecastUrl.searchParams.set("lon", lng.toString());
      }
      forecastUrl.searchParams.set("appid", OPENWEATHERMAP_API_KEY!);
      forecastUrl.searchParams.set("units", "metric");
      forecastUrl.searchParams.set("lang", "de");

      const forecastResponse = await fetch(forecastUrl.toString());
      const forecastData = await forecastResponse.json();

      result.forecast = forecastData.list.slice(0, 8).map((item: any) => ({
        time: new Date(item.dt * 1000).toISOString(),
        temp: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        precipitation: item.rain?.["3h"] || 0,
      }));
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("[FETCH-WEATHER] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

### Frontend-Integration

```typescript
// src/components/dashboard/LiveWeather.tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function LiveWeather({ city = 'München' }: { city?: string }) {
  const { data: weather, isLoading } = useQuery({
    queryKey: ['weather', city],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('fetch-weather', {
        body: { city, includeForecast: false },
      });
      if (error) throw error;
      return data;
    },
    staleTime: 30 * 60 * 1000, // 30min Cache
    refetchInterval: 30 * 60 * 1000, // Auto-Refresh alle 30min
  });

  if (isLoading) return <Skeleton className="h-32" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Wetter: {city}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <img
            src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`}
            alt={weather.current.description}
            className="h-16 w-16"
          />
          <div>
            <p className="text-3xl font-bold">{Math.round(weather.current.temp)}°C</p>
            <p className="text-muted-foreground capitalize">{weather.current.description}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Gefühlt</p>
            <p className="font-medium">{Math.round(weather.current.feelsLike)}°C</p>
          </div>
          <div>
            <p className="text-muted-foreground">Wind</p>
            <p className="font-medium">{weather.current.windSpeed} m/s</p>
          </div>
          <div>
            <p className="text-muted-foreground">Luftfeuchtigkeit</p>
            <p className="font-medium">{weather.current.humidity}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Sicht</p>
            <p className="font-medium">{(weather.current.visibility / 1000).toFixed(1)} km</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 🕒 3. AKTUELLE ZEIT & ZEITZONEN

### Verwendung

- **Server-Zeit:** UTC-Timestamp für alle Datenbank-Einträge
- **Lokale Zeit:** Anzeige in User-Timezone
- **Multi-Timezone-Support:** Für internationale Buchungen

### World Time API (Kostenlos!)

```typescript
// supabase/functions/fetch-current-time/index.ts
serve(async (req) => {
  const { timezone } = await req.json(); // z.B. 'Europe/Berlin'

  const url = `http://worldtimeapi.org/api/timezone/${timezone || "Europe/Berlin"}`;
  const response = await fetch(url);
  const data = await response.json();

  return new Response(
    JSON.stringify({
      datetime: data.datetime, // ISO 8601
      timestamp: data.unixtime,
      timezone: data.timezone,
      offset: data.utc_offset, // z.B. '+01:00'
      dayOfWeek: data.day_of_week,
      weekNumber: data.week_number,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
```

### Frontend: Timezone-Handling

```typescript
// src/lib/time-utils.ts
import { format, formatInTimeZone } from "date-fns-tz";
import { de } from "date-fns/locale";

export const formatDateTimeInTimezone = (
  date: string | Date,
  timezone: string = "Europe/Berlin",
  formatStr: string = "dd.MM.yyyy HH:mm"
): string => {
  return formatInTimeZone(new Date(date), timezone, formatStr, { locale: de });
};

// Verwendung
formatDateTimeInTimezone("2025-01-26T14:30:00Z", "Europe/Berlin", "dd.MM.yyyy HH:mm");
// Output: "26.01.2025 15:30"
```

---

## 🚦 4. VERKEHRSDATEN (HERE TRAFFIC FLOW)

### Live-Traffic Dashboard-Widget

```typescript
// src/components/dashboard/LiveTraffic.tsx
import { useQuery } from '@tanstack/react-query';

export function LiveTraffic({ route }: { route?: { lat: number; lng: number }[] }) {
  const { data: traffic } = useQuery({
    queryKey: ['traffic', route],
    queryFn: async () => {
      const { data } = await supabase.functions.invoke('traffic-flow', {
        body: {
          lat: route?.[0].lat || 48.1351, // München Default
          lng: route?.[0].lng || 11.5820,
          radius: 5000, // 5km
        },
      });
      return data;
    },
    refetchInterval: 5 * 60 * 1000, // Alle 5min
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Live-Verkehrslage
        </CardTitle>
      </CardHeader>
      <CardContent>
        {traffic && (
          <>
            <div className="flex items-center gap-2">
              <StatusIndicator
                status={traffic.status}
                type="traffic"
              />
              <span className="font-medium">
                {traffic.status === 'free' && 'Freie Fahrt'}
                {traffic.status === 'slow' && 'Zähfließend'}
                {traffic.status === 'jam' && 'Stau'}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Ø Geschwindigkeit: {Math.round(traffic.avgSpeed)} km/h
            </p>
            <p className="text-sm text-muted-foreground">
              Staufaktor: {traffic.avgJamFactor.toFixed(1)}/10
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 🤖 5. AI-PREDICTIVE ANALYTICS

### Demand-Forecasting (7-Tage-Prognose)

```typescript
// supabase/functions/ai-forecast/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

serve(async (req) => {
  const { companyId, days } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // 1. Historische Daten (90 Tage)
  const { data: historical } = await supabase
    .from("bookings")
    .select("pickup_time, created_at, price, status")
    .eq("company_id", companyId)
    .gte("pickup_time", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
    .order("pickup_time", { ascending: true });

  // 2. Lovable AI Gateway (Google Gemini)
  const aiResponse = await fetch("https://api.lovable.dev/ai/v1/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      prompt: `
Analysiere die folgenden Buchungsdaten und erstelle eine ${days}-Tage-Prognose.
Berücksichtige: Wochentag-Muster, Saisonalität, Trends.

Antwort als JSON-Array: [{ date: "YYYY-MM-DD", predictedBookings: number, confidence: 0-1 }]

Historische Daten (90 Tage):
${JSON.stringify(historical, null, 2)}
      `,
    }),
  });

  const forecast = await aiResponse.json();

  return new Response(JSON.stringify({ forecast }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
```

### Frontend-Integration

```typescript
// src/components/dashboard/PredictiveDemandWidget.tsx
export function PredictiveDemandWidget() {
  const { profile } = useAuth();

  const { data: forecast } = useQuery({
    queryKey: ['predictive-demand', profile?.company_id],
    queryFn: async () => {
      const { data } = await supabase.functions.invoke('ai-forecast', {
        body: {
          companyId: profile?.company_id,
          days: 7,
        },
      });
      return data.forecast;
    },
    staleTime: 60 * 60 * 1000, // 1h Cache
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          7-Tage-Prognose
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart
          data={forecast}
          xDataKey="date"
          lines={[
            { dataKey: 'predictedBookings', stroke: 'hsl(var(--primary))' }
          ]}
          height={200}
        />
      </CardContent>
    </Card>
  );
}
```

---

## 🔄 SYSTEMWEITE DATENFLUSS-INTEGRATION

### Smart-Routing mit allen Datenquellen

```typescript
// src/lib/smart-routing.ts
export const calculateSmartRoute = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  pickupTime: string
) => {
  // 1. Wetter-Check
  const weather = await supabase.functions.invoke("fetch-weather", {
    body: { lat: origin.lat, lng: origin.lng },
  });

  // 2. Verkehrs-Check
  const traffic = await supabase.functions.invoke("traffic-flow", {
    body: { lat: origin.lat, lng: origin.lng, radius: 5000 },
  });

  // 3. Route-Berechnung mit Traffic
  const route = await supabase.functions.invoke("calculate-route", {
    body: {
      origin,
      destination,
      departureTime: pickupTime,
      avoidTolls: false,
    },
  });

  // 4. Risiko-Assessment
  const riskScore = calculateRiskScore({
    weather: weather.data.current,
    traffic: traffic.data,
    route: route.data,
  });

  return {
    ...route.data,
    weather: weather.data.current,
    traffic: traffic.data,
    riskScore,
    recommendations: generateRecommendations(riskScore),
  };
};

const calculateRiskScore = ({ weather, traffic, route }) => {
  let score = 0;

  // Wetter-Risiko
  if (weather.description.includes("regen")) score += 2;
  if (weather.description.includes("schnee")) score += 4;
  if (weather.windSpeed > 15) score += 2;

  // Verkehrs-Risiko
  if (traffic.avgJamFactor > 7) score += 3;

  // Route-Risiko
  if (route.trafficDelay > 600) score += 2; // >10min Verzögerung

  return Math.min(score, 10); // 0-10 Scale
};

const generateRecommendations = (riskScore: number): string[] => {
  const recommendations: string[] = [];

  if (riskScore > 7) {
    recommendations.push("⚠️ Hohe Verzögerung erwartet - frühere Abfahrt empfohlen");
  }
  if (riskScore > 5) {
    recommendations.push("🚗 Erhöhtes Verkehrsaufkommen - alternative Route prüfen");
  }
  if (riskScore > 3) {
    recommendations.push("🌧️ Schlechtes Wetter - vorsichtige Fahrweise empfohlen");
  }

  return recommendations;
};
```

---

## 📊 CACHING & PERFORMANCE

### Redis-Cache-Strategie (Optional, via Supabase Functions)

```typescript
// supabase/functions/_shared/cache.ts
const CACHE_TTL = {
  route: 24 * 60 * 60, // 24h
  weather: 30 * 60, // 30min
  traffic: 5 * 60, // 5min
  geocoding: 7 * 24 * 60 * 60, // 7 Tage
};

export const getCachedData = async (key: string, fetchFn: () => Promise<any>, ttl: number) => {
  // Supabase Storage als Cache nutzen (alternativ: Upstash Redis)
  const cached = await supabase.storage.from("cache").download(`${key}.json`);

  if (cached.data) {
    const data = JSON.parse(await cached.data.text());
    if (Date.now() - data.timestamp < ttl * 1000) {
      return data.value;
    }
  }

  // Cache Miss → Neu laden
  const value = await fetchFn();

  await supabase.storage.from("cache").upload(
    `${key}.json`,
    JSON.stringify({
      value,
      timestamp: Date.now(),
    }),
    { upsert: true }
  );

  return value;
};
```

---

## 🔗 EXTERNE RESSOURCEN

- **HERE Maps:** https://developer.here.com/documentation
- **OpenWeatherMap:** https://openweathermap.org/api
- **World Time API:** http://worldtimeapi.org/
- **Lovable AI:** https://docs.lovable.dev/features/ai

---

**Version:** V18.5.0  
**Nächstes Update:** Q2 2025 (Erweiterte Predictive Analytics)
