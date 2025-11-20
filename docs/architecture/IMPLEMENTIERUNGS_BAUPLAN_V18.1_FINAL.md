# 🔧 MyDispatch V18.1 - Implementierungs-Bauplan & Schaltplan

**Status:** In Umsetzung | **Datum:** 15.10.2025 | **Version:** 18.1 GoLive

---

## 🎯 ZIELSETZUNG

**Transformation von V18.0 → V18.1:**

- ✅ Keine Mock-Daten mehr
- ✅ Production-Ready Code
- ✅ 60% Performance-Boost
- ✅ 99.99% Uptime
- ✅ Vollständige Feature-Completion

---

## 📋 IMPLEMENTIERUNGS-PHASEN

### ✅ Phase 1: Foundation (ABGESCHLOSSEN - 100%)

**Dauer:** 2h | **Status:** ✅ Completed

#### Database Optimizations

```sql
-- 11 Performance-Indexes erstellt
CREATE INDEX idx_bookings_company_archived ON bookings(company_id, archived);
CREATE INDEX idx_bookings_status ON bookings(status) WHERE archived = false;
CREATE INDEX idx_bookings_pickup_date ON bookings(pickup_date) WHERE archived = false;
CREATE INDEX idx_drivers_company_status ON drivers(company_id, shift_status);
CREATE INDEX idx_vehicles_company_status ON vehicles(company_id, status);
CREATE INDEX idx_customers_company_archived ON customers(company_id, archived);
CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX idx_shifts_date_driver ON shifts(date, driver_id);
CREATE INDEX idx_chat_messages_conversation ON chat_messages(conversation_id, created_at DESC);
CREATE INDEX idx_partner_connections_companies ON partner_connections(company_a_id, company_b_id);
CREATE INDEX idx_audit_logs_company_created ON audit_logs(company_id, created_at DESC);

-- Full-Text Search für Global Search
CREATE INDEX idx_bookings_search ON bookings USING GIN(
  to_tsvector('german',
    COALESCE(pickup_address, '') || ' ' ||
    COALESCE(dropoff_address, '')
  )
);
CREATE INDEX idx_customers_search ON customers USING GIN(
  to_tsvector('german',
    COALESCE(first_name, '') || ' ' ||
    COALESCE(last_name, '') || ' ' ||
    COALESCE(email, '')
  )
);
CREATE INDEX idx_drivers_search ON drivers USING GIN(
  to_tsvector('german',
    COALESCE(first_name, '') || ' ' ||
    COALESCE(last_name, '')
  )
);
```

#### Neue Tabellen

- ✅ `audit_logs` - CRUD-Tracking (DSGVO, PBefG)
- ✅ `filter_presets` - Gespeicherte Filter
- ✅ `performance_metrics` - Query-Zeiten, Render-Performance

---

### 🔄 Phase 2: Core UX + Performance (IN ARBEIT - 0%)

**Dauer:** 4h | **Status:** 🚧 Starting Now | **Priorität:** P0

#### 2.1 React Query Integration (1h)

**Ziel:** 60% schnelleres State-Management

**Abhängigkeiten:**

- ✅ `@tanstack/react-query` bereits installiert

**Dateien zu erstellen:**

1. `src/lib/query-client.ts` - Query-Client-Konfiguration
2. `src/hooks/use-bookings.tsx` - Bookings Queries/Mutations
3. `src/hooks/use-drivers.tsx` - Drivers Queries/Mutations
4. `src/hooks/use-vehicles.tsx` - Vehicles Queries/Mutations
5. `src/hooks/use-customers.tsx` - Customers Queries/Mutations

**Dateien zu aktualisieren:**

- `src/main.tsx` - QueryClientProvider wrappen
- `src/pages/Auftraege.tsx` - useBookings() statt direktem Supabase
- `src/pages/Fahrer.tsx` - useDrivers() statt direktem Supabase
- `src/pages/Fahrzeuge.tsx` - useVehicles() statt direktem Supabase
- `src/pages/Kunden.tsx` - useCustomers() statt direktem Supabase

**Code-Pattern:**

```typescript
// src/lib/query-client.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 Minuten
      retry: 3,
      refetchOnWindowFocus: true,
    },
  },
});

// src/hooks/use-bookings.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export const useBookings = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["bookings", profile?.company_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, customer:customers(*), driver:drivers(*), vehicle:vehicles(*)")
        .eq("company_id", profile!.company_id)
        .eq("archived", false)
        .order("pickup_time", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.company_id,
  });

  const createMutation = useMutation({
    mutationFn: async (booking: any) => {
      const { data, error } = await supabase
        .from("bookings")
        .insert({ ...booking, company_id: profile!.company_id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  return { bookings: data, isLoading, error, createBooking: createMutation.mutate };
};
```

---

#### 2.2 Global Search mit Fuzzy-Matching (1.5h)

**Ziel:** Cmd+K Navigation, 70% schnellere Suche

**Abhängigkeiten:**

- ✅ Full-Text Search Indexes (Phase 1)
- ⏳ React Query (Phase 2.1)

**Dateien zu erstellen:**

1. `src/components/search/GlobalSearchDialog.tsx` - Cmd+K Dialog
2. `src/components/search/SearchResultItem.tsx` - Ergebnis-Card
3. `src/hooks/use-global-search.tsx` - Search Hook mit Fuzzy
4. `src/lib/fuzzy-search.ts` - Fuzzy-Matching-Algorithmus

**Dateien zu aktualisieren:**

- `src/components/layout/DashboardLayout.tsx` - GlobalSearchDialog einbinden

**Code-Pattern:**

```typescript
// src/hooks/use-global-search.tsx
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { fuzzyMatch } from "@/lib/fuzzy-search";

export const useGlobalSearch = (query: string) => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["global-search", profile?.company_id, query],
    queryFn: async () => {
      if (query.length < 2) return [];

      const [bookings, customers, drivers, vehicles] = await Promise.all([
        supabase
          .from("bookings")
          .select("id, pickup_address, dropoff_address, status, pickup_time")
          .eq("company_id", profile!.company_id)
          .eq("archived", false)
          .textSearch("pickup_address", query, { type: "websearch", config: "german" })
          .limit(5),
        supabase
          .from("customers")
          .select("id, first_name, last_name, email")
          .eq("company_id", profile!.company_id)
          .eq("archived", false)
          .textSearch("first_name", query, { type: "websearch", config: "german" })
          .limit(5),
        // ... drivers, vehicles
      ]);

      return {
        bookings: bookings.data || [],
        customers: customers.data || [],
        drivers: drivers.data || [],
        vehicles: vehicles.data || [],
      };
    },
    enabled: query.length >= 2,
    staleTime: 30000, // 30s
  });
};
```

---

#### 2.3 Keyboard-Shortcuts (0.5h)

**Ziel:** Power-User-Produktivität +80%

**Abhängigkeiten:**

- Keine

**Dateien zu erstellen:**

1. `src/hooks/use-keyboard-shortcuts.tsx` - Shortcut-Handler
2. `src/components/shared/ShortcutHelpDialog.tsx` - Cmd+/ Hilfe

**Dateien zu aktualisieren:**

- `src/App.tsx` - useKeyboardShortcuts() Hook einbinden

**Shortcuts:**

```typescript
const shortcuts = {
  "Cmd+K": () => openGlobalSearch(),
  "Cmd+N": () => navigate("/auftraege?new=true"),
  "Cmd+Shift+D": () => navigate("/"),
  "Cmd+Shift+K": () => navigate("/kunden"),
  "Cmd+Shift+F": () => navigate("/fahrer"),
  "Cmd+Shift+V": () => navigate("/fahrzeuge"),
  "Cmd+/": () => openShortcutHelp(),
  Esc: () => closeDialogs(),
};
```

---

#### 2.4 Enhanced Error Handling (1h)

**Ziel:** Retry-Mechanismus, Offline-Queue erweitern

**Abhängigkeiten:**

- ✅ ErrorBoundary (bereits vorhanden)
- ✅ use-offline-queue (bereits vorhanden)
- ✅ supabase-resilient-client.ts (bereits vorhanden)

**Dateien zu aktualisieren:**

1. `src/lib/supabase-resilient-client.ts` - Erweitern um Toast-Benachrichtigungen
2. `src/hooks/use-offline-queue.tsx` - Erweitern um automatisches Retry
3. `src/components/shared/ErrorBoundary.tsx` - Erweitern um Reset-Button

**Code-Pattern:**

```typescript
// src/lib/supabase-resilient-client.ts - Erweitert
export async function resilientQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  options: RetryOptions = {}
): Promise<{ data: T | null; error: any }> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000 } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await queryFn();

      if (!result.error || !isRetryableError(result.error)) {
        return result;
      }

      if (attempt < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);

        // Toast-Benachrichtigung
        toast.info(
          `Verbindungsproblem erkannt. Wiederhole Anfrage... (${attempt + 1}/${maxRetries})`
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        toast.error("Verbindung fehlgeschlagen. Bitte überprüfen Sie Ihre Internetverbindung.");
        return result;
      }
    } catch (error) {
      if (attempt === maxRetries) {
        toast.error("Unerwarteter Fehler aufgetreten.");
        return { data: null, error };
      }
    }
  }

  return { data: null, error: new Error("Max retries exceeded") };
}
```

---

### 🎨 Phase 3: Smart Features (TAG 2 - 6h)

**Priorität:** P0-P1

#### 3.1 Adress-Autovervollständigung (2h)

**Ziel:** Google Places API Integration

**Edge Functions:**

- ✅ `geocode-address` (bereits vorhanden)

**Dateien zu erstellen:**

1. `src/components/forms/AddressAutocompleteInput.tsx` - Google Places Autocomplete
2. `src/hooks/use-google-places.tsx` - Places API Hook

**Dateien zu aktualisieren:**

- `src/pages/Auftraege.tsx` - AddressAutocompleteInput verwenden
- `src/pages/Angebote.tsx` - AddressAutocompleteInput verwenden
- `src/pages/Rechnungen.tsx` - AddressAutocompleteInput verwenden

**Code-Pattern:**

```typescript
// src/hooks/use-google-places.tsx
import { useState, useCallback } from "react";

export const useGooglePlaces = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchPlaces = useCallback(async (input: string) => {
    if (!input || input.length < 3) {
      setPredictions([]);
      return;
    }

    setLoading(true);
    try {
      const service = new google.maps.places.AutocompleteService();
      const result = await service.getPlacePredictions({
        input,
        componentRestrictions: { country: ["de", "nl"] },
      });
      setPredictions(result.predictions || []);
    } catch (error) {
      console.error("Places API Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { predictions, loading, searchPlaces };
};
```

---

#### 3.2 Echtzeit-ETA & Routing (3h)

**Ziel:** HERE/Google Integration für Live-Routing

**Edge Functions:**

- ✅ `get-traffic` (bereits vorhanden)

**Dateien zu erstellen:**

1. `src/hooks/use-route-calculation.tsx` - HERE/Google Routing
2. `src/components/booking/RouteMapPreview.tsx` - Karte mit Route
3. `supabase/functions/calculate-route/index.ts` - Routing Edge Function

**Code-Pattern:**

```typescript
// supabase/functions/calculate-route/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { origin, destination } = await req.json();

    // HERE Routing API
    const url = new URL("https://router.hereapi.com/v8/routes");
    url.searchParams.set("transportMode", "car");
    url.searchParams.set("origin", origin);
    url.searchParams.set("destination", destination);
    url.searchParams.set("return", "summary,polyline");
    url.searchParams.set("apikey", Deno.env.get("HERE_API_KEY")!);

    const response = await fetch(url.toString());
    const data = await response.json();

    const route = data.routes[0];
    const summary = route.sections[0].summary;

    return new Response(
      JSON.stringify({
        distance_km: (summary.length / 1000).toFixed(1),
        duration_minutes: Math.round(summary.duration / 60),
        polyline: route.sections[0].polyline,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
```

---

#### 3.3 Intelligente Filter (1h)

**Ziel:** Quick-Filter, Gespeicherte Ansichten

**Abhängigkeiten:**

- ✅ `filter_presets` Tabelle (Phase 1)

**Dateien zu erstellen:**

1. `src/components/shared/FilterBar.tsx` - Quick-Filter-Chips
2. `src/hooks/use-filter-presets.tsx` - Gespeicherte Filter

---

### 🤖 Phase 4: AI-Powered Features (TAG 3-4 - 8h)

**Priorität:** P1

#### 4.1 AI Smart Routing (3h)

**Edge Functions zu erstellen:**

1. `supabase/functions/ai-smart-routing/index.ts`

**Code-Pattern:**

```typescript
// supabase/functions/ai-smart-routing/index.ts
const systemPrompt = `
Du bist ein Dispositions-Assistent für Taxi-Unternehmen.
Analysiere folgende Faktoren für die optimale Fahrer-Zuweisung:
1. GPS-Distanz zum Abholort
2. Fahrzeug-Klasse (passt zum Auftrag?)
3. Schicht-Status (verfügbar, beschäftigt, pause)
4. Aktuelle Verkehrslage (Stau-Faktor)
5. Historische Performance (Top-Fahrer zuerst)

Gib die TOP 3 Fahrer zurück mit Begründung.
`;

const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: context },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "suggest_drivers",
          parameters: {
            type: "object",
            properties: {
              suggestions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    driver_id: { type: "string" },
                    score: { type: "number" },
                    reasoning: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "suggest_drivers" } },
  }),
});
```

---

#### 4.2 AI Sentiment-Analyse (3h)

**Edge Functions zu erstellen:**

1. `supabase/functions/ai-sentiment-analysis/index.ts`

---

#### 4.3 AI Dokumenten-OCR (2h)

**Edge Functions zu erstellen:**

1. `supabase/functions/ai-document-ocr/index.ts`

---

### 📤 Phase 5: Automation & Exports (TAG 4-5 - 10h)

**Priorität:** P1

#### 5.1 Wetter-Warnungen (2h)

**Komponenten:**

- `src/components/dashboard/WeatherAlertsWidget.tsx`

#### 5.2 Verkehrs-Integration (2h)

**Komponenten:**

- `src/components/dashboard/TrafficAlertsWidget.tsx`

#### 5.3 Automatische E-Mails (2h)

**Edge Functions erweitern:**

- ✅ `send-template-email` (bereits vorhanden)
- Neue Trigger in Mutations (React Query)

#### 5.4 PDF-Export (3h)

**Edge Functions zu erstellen:**

1. `supabase/functions/export-booking-pdf/index.ts`
2. `supabase/functions/export-invoice-pdf/index.ts`

#### 5.5 CSV-Export (1h)

**Edge Functions zu erstellen:**

1. `supabase/functions/export-csv/index.ts`

---

### 📱 Phase 6: Mobile & PWA (TAG 6-7 - 8h)

**Priorität:** P2

#### 6.1 PWA-Installation (3h)

- ✅ Service Worker (bereits vorhanden)
- ✅ Manifest (bereits vorhanden)
- Install-Prompt-Komponente

#### 6.2 Push-Benachrichtigungen (3h)

- Web Push API Integration

#### 6.3 Chat-Dateianhänge (2h)

- Drag&Drop Upload erweitern

---

### 🎛️ Phase 7: Master-Dashboard (TAG 7-8 - 6h)

**Priorität:** P1

#### 7.1 Churn-Prediction (3h)

**Edge Functions zu erstellen:**

1. `supabase/functions/ai-churn-prediction/index.ts`

#### 7.2 Performance-Dashboard (3h)

- Charts für alle Companies

---

## 🧹 SYSTEMWEITE OPTIMIERUNGEN

### Mock-Daten entfernen

**Dateien zu prüfen:**

- `src/pages/Index.tsx` - KEINE Hard-coded Daten
- `src/pages/Statistiken.tsx` - KEINE chartData Arrays
- `src/pages/MasterDashboard.tsx` - KEINE Mock-Companies

**Pattern:**

```typescript
// ❌ VORHER (Mock-Daten)
const chartData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
];

// ✅ NACHHER (Echte Daten)
const { data: chartData } = useQuery({
  queryKey: ["revenue-chart", profile?.company_id],
  queryFn: async () => {
    const { data } = await supabase
      .from("bookings")
      .select("price, created_at")
      .eq("company_id", profile!.company_id)
      .gte("created_at", startOfMonth(new Date()).toISOString());

    return aggregateByMonth(data);
  },
});
```

---

### TypeScript-Errors beheben

**Bekannte Issues:**

1. `Select.Item` mit leerem `value` → `undefined` verwenden
2. Fehlende `DialogDescription` → Immer einfügen
3. Ungenutzte Variablen → Entfernen oder `_` prefixen

---

### Console-Logs entfernen

**Pattern:**

```bash
# Suche nach console.log
grep -r "console.log" src/

# Ersetze mit logger.ts
import { logDebug } from '@/lib/logger';
logDebug('Debug message', { context });
```

---

## 📊 ERFOLGS-METRIKEN

### Performance

- Dashboard-Load: < 1.0s (aktuell ~1.8s)
- Auftrags-Liste: < 400ms (aktuell ~1.2s)
- Suche: < 200ms (aktuell ~800ms)
- Bundle-Size: < 1.2MB (aktuell ~1.8MB)

### Uptime

- 99.99% Verfügbarkeit
- < 0.1% Error-Rate
- < 5s Recovery-Time

### UX

- Lighthouse Score: > 90
- WCAG 2.1 AA: 100%
- Mobile-Responsive: 100%

---

## 🚀 DEPLOYMENT-CHECKLISTE

### Pre-GoLive

- [ ] Alle TypeScript-Errors behoben
- [ ] Alle ESLint-Warnings behoben
- [ ] Keine console.log() in Production
- [ ] Keine Mock-/Test-Daten
- [ ] Alle Edge Functions deployt
- [ ] Alle Secrets konfiguriert
- [ ] RLS-Policies aktiv
- [ ] Audit-Logging aktiv

### GoLive

- [ ] DNS-Konfiguration
- [ ] SSL-Zertifikat
- [ ] Monitoring aktiv
- [ ] Backup-Strategie
- [ ] Rollback-Plan

---

**Dieser Bauplan dient als Schritt-für-Schritt-Anleitung für die vollständige V18.1-Implementierung.**
