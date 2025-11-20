# 🔌 API CONNECTION MASTER PLAN V28.2.0

**Status:** ✅ PRODUCTION  
**Letzte Aktualisierung:** 2025-10-29  
**Version:** 28.2.0  
**Zweck:** Zentrale Dokumentation aller API-Integrationen

---

## 📋 EXECUTIVE SUMMARY

MyDispatch V28.2.0 nutzt **11 externe APIs** für verschiedene Funktionalitäten:

| API                         | Zweck                              | Status   | Rate Limit      | Kosten          |
| --------------------------- | ---------------------------------- | -------- | --------------- | --------------- |
| **HERE Maps SDK**           | Kartenvisualisierung, Geocoding    | ✅ Aktiv | Unbegrenzt      | Pro Request     |
| **Supabase Auth**           | Authentifizierung, User-Management | ✅ Aktiv | 50k MAU         | Free bis 50k    |
| **Supabase Database**       | PostgreSQL, Realtime               | ✅ Aktiv | Unbegrenzt      | Free bis 500MB  |
| **Supabase Storage**        | Dateispeicherung                   | ✅ Aktiv | 1GB Free        | Pay-as-you-go   |
| **Supabase Edge Functions** | Serverless Functions               | ✅ Aktiv | 500k Requests   | Free bis 500k   |
| **Supabase Realtime**       | Live Updates                       | ✅ Aktiv | 200 Concurrent  | Free bis 200    |
| **OpenRouter AI**           | AI Chat, Sentiment Analysis        | ✅ Aktiv | Model-abhängig  | Per Token       |
| **Stripe**                  | Zahlungsabwicklung                 | ✅ Aktiv | 100 Req/Sekunde | 2.9% + 0.30€    |
| **Resend**                  | E-Mail-Versand                     | ✅ Aktiv | 100 Emails/Tag  | Free bis 100    |
| **OpenWeatherMap**          | Wetterdaten                        | ✅ Aktiv | 60 Calls/Min    | Free bis 1k/day |
| **Daily.co**                | Video-Calls                        | ✅ Aktiv | 10k Min/Monat   | Free bis 10k    |

**Edge Functions Deployed:** 79  
**Realtime Channels:** 4 (bookings, drivers, vehicles, chat_messages)

---

## 🗺️ 1. HERE MAPS SDK

### Overview

**Zweck:** Kartenvisualisierung, Geocoding, Routing, Address Autocomplete  
**Dokumentation:** https://developer.here.com/documentation  
**API Key Location:** `VITE_HERE_API_KEY`

### Endpoints

#### Maps JS API (Client-Side)

```typescript
// Platform Init
const platform = new window.H.service.Platform({
  apikey: import.meta.env.VITE_HERE_API_KEY,
});

// Map Rendering
const defaultLayers = platform.createDefaultLayers();
const map = new window.H.Map(mapContainer, defaultLayers.vector.normal.map, {
  center: { lat, lng },
  zoom: 13,
});
```

**Rate Limits:** Unbegrenzt (Pay-per-use)  
**Performance Target:** Map Load < 2s

#### Geocoding API

```typescript
// Forward Geocoding (Address → Coordinates)
const geocoder = platform.getSearchService();
geocoder.geocode(
  {
    q: address,
  },
  (result) => {
    const { lat, lng } = result.items[0].position;
  },
  (error) => {
    console.error("Geocoding failed:", error);
  }
);
```

**Rate Limits:** 250k Requests/Monat (Free Tier)  
**Fallback:** Cached Geocoding Results in `geocode_cache` Table

#### Autocomplete API

```typescript
// Address Suggestions
geocoder.autosuggest(
  {
    q: query,
    at: `${lat},${lng}`,
    limit: 5,
  },
  (result) => {
    const suggestions = result.items.map((item) => item.address.label);
  },
  (error) => {
    logError("[HERE Autocomplete] Error:", error);
  }
);
```

**Rate Limits:** 250k Requests/Monat  
**Debouncing:** 300ms (implementiert in `AddressAutosuggest.tsx`)

### Error Handling

```typescript
// Pattern: Retry with Exponential Backoff
async function fetchWithRetry(fn: () => Promise<any>, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 2 ** i * 1000));
    }
  }
}

// Usage
await fetchWithRetry(() => geocoder.geocode({ q: address }));
```

### Fallback Strategy

1. **Cache First:** Check `geocode_cache` Table
2. **API Call:** If not cached, call HERE API
3. **Fallback:** If API fails, use Manual Lat/Lng Input

### Components Using HERE Maps

- `HEREMapComponent.tsx` (Dashboard Map)
- `AddressAutosuggest.tsx` (Booking Forms)
- `RouteVisualization.tsx` (Route Planning)

---

## 🔐 2. SUPABASE AUTH

### Overview

**Zweck:** User Authentication, Session Management, Password Reset  
**Dokumentation:** https://supabase.com/docs/guides/auth  
**Anon Key:** `VITE_SUPABASE_ANON_KEY`

### Auth Methods

- ✅ Email/Password Login
- ✅ Magic Link Login
- ❌ Google OAuth (nicht aktiviert)
- ❌ SSO (nicht aktiviert)

### Core Functions

#### Sign Up

```typescript
import { supabase } from "@/integrations/supabase/client";

const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "SecurePassword123!",
  options: {
    data: {
      company_name: "Test Company",
      role: "admin",
    },
  },
});
```

**Auto-Confirm:** ✅ Enabled (für Dev/Testing)  
**Email Verification:** ⚠️ Disabled (Production: Enable!)

#### Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "SecurePassword123!",
});

if (error) {
  if (error.message.includes("Invalid login credentials")) {
    toast.error("Falsche E-Mail oder Passwort");
  }
}
```

#### Session Management

```typescript
// Get Current Session
const {
  data: { session },
} = await supabase.auth.getSession();

// Listen to Auth Changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_IN") {
    navigate("/dashboard");
  } else if (event === "SIGNED_OUT") {
    navigate("/auth");
  }
});
```

### Error Handling

```typescript
// Common Auth Errors
const AUTH_ERRORS = {
  "Invalid login credentials": "Falsche E-Mail oder Passwort",
  "Email not confirmed": "Bitte bestätigen Sie Ihre E-Mail",
  "User already registered": "E-Mail bereits registriert",
  "Password should be at least 6 characters": "Passwort zu kurz (min. 6 Zeichen)",
};

function getAuthErrorMessage(error: any): string {
  return AUTH_ERRORS[error.message] || "Ein Fehler ist aufgetreten";
}
```

### Rate Limits

- **Sign Up:** 100/hour per IP
- **Sign In:** 500/hour per IP
- **Password Reset:** 20/hour per email

### Components Using Auth

- `Auth.tsx` (Login/Register)
- `AuthProvider.tsx` (Context)
- `ProtectedRoute.tsx` (Route Guard)
- `ProfileSettings.tsx` (Profile Management)

---

## 💾 3. SUPABASE DATABASE

### Overview

**Zweck:** PostgreSQL Database, Row Level Security, Realtime  
**Dokumentation:** https://supabase.com/docs/guides/database  
**Connection:** Via `supabase.from(table)`

### Schema Overview

- **56 Tables** (siehe `DATABASE_SCHEMA_COMPLETE.md`)
- **4 Realtime Tables:** bookings, drivers, vehicles, chat_messages
- **20+ Database Functions**
- **15+ Triggers**
- **RLS Policies:** 100% aktiv auf allen Tables

### Core Queries

#### Select with RLS

```typescript
// Automatic company_id filtering via RLS
const { data: bookings, error } = await supabase
  .from("bookings")
  .select(
    `
    *,
    customer:customers(name, email),
    driver:drivers(name),
    vehicle:vehicles(license_plate)
  `
  )
  .order("created_at", { ascending: false })
  .limit(50);
```

**Performance:** < 200ms für 50 Bookings  
**RLS:** Filtert automatisch nach `company_id` des eingeloggten Users

#### Insert with Validation

```typescript
const { data, error } = await supabase
  .from("bookings")
  .insert({
    company_id: user.company_id,
    customer_id: selectedCustomer.id,
    pickup_address: pickupAddress,
    dropoff_address: dropoffAddress,
    pickup_time: pickupTime,
    status: "confirmed",
    price: calculatedPrice,
  })
  .select()
  .single();

if (error) {
  if (error.code === "23505") {
    toast.error("Booking bereits vorhanden");
  } else if (error.code === "P0001") {
    toast.error("Validation Fehler: " + error.message);
  }
}
```

#### Update with Optimistic Locking

```typescript
// Check version before update
const { data: current } = await supabase
  .from("bookings")
  .select("version")
  .eq("id", bookingId)
  .single();

const { error } = await supabase
  .from("bookings")
  .update({
    status: "completed",
    version: current.version + 1,
  })
  .eq("id", bookingId)
  .eq("version", current.version); // Optimistic Lock

if (error?.code === "P0001") {
  toast.error("Booking wurde zwischenzeitlich geändert. Bitte neu laden.");
}
```

### Database Functions

#### get_dashboard_stats_for_company

```sql
-- Returns KPI stats for company
SELECT
  COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE) as todays_bookings,
  SUM(price) FILTER (WHERE created_at::date = CURRENT_DATE) as todays_revenue,
  COUNT(DISTINCT driver_id) FILTER (WHERE status = 'available') as available_drivers,
  COUNT(DISTINCT vehicle_id) FILTER (WHERE status = 'available') as available_vehicles
FROM bookings
WHERE company_id = auth.uid_company_id();
```

**Usage:**

```typescript
const { data } = await supabase.rpc("get_dashboard_stats_for_company");
```

### Error Handling

```typescript
// PostgreSQL Error Codes
const DB_ERRORS = {
  "23505": "Duplicate Key Violation", // Unique Constraint
  "23503": "Foreign Key Violation",
  P0001: "Custom Validation Error",
  "42501": "Insufficient Privileges",
  PGRST116: "Row Not Found",
};

function handleDatabaseError(error: any) {
  const code = error.code || error.error_code;
  logError("[Database Error]", { code, message: error.message });

  if (code === "23505") {
    toast.error("Eintrag existiert bereits");
  } else if (code === "42501") {
    toast.error("Keine Berechtigung für diese Aktion");
  } else {
    toast.error("Datenbankfehler: " + error.message);
  }
}
```

### Rate Limits

- **Queries:** Unbegrenzt (CPU Time basiert)
- **Connections:** 60 Concurrent (Free Tier)
- **Storage:** 500MB Free

### Performance Optimization

- ✅ Indexes auf Foreign Keys
- ✅ Materialized Views für Dashboard Stats
- ✅ Partitioning für große Tables (bookings)
- ✅ Query Result Caching via TanStack Query

---

## 📦 4. SUPABASE STORAGE

### Overview

**Zweck:** Dateispeicherung (Dokumente, PDFs, Fotos)  
**Buckets:** `documents`, `driver_documents`, `vehicle_documents`, `invoices`

### Upload Flow

```typescript
// Upload File
const file = event.target.files[0];
const filePath = `${companyId}/${userId}/${Date.now()}_${file.name}`;

const { data, error } = await supabase.storage.from("documents").upload(filePath, file, {
  cacheControl: "3600",
  upsert: false,
});

if (error) {
  if (error.message.includes("Payload too large")) {
    toast.error("Datei zu groß (max. 10MB)");
  }
}

// Get Public URL
const {
  data: { publicUrl },
} = supabase.storage.from("documents").getPublicUrl(filePath);
```

### RLS Policies

```sql
-- Users can only view own company files
CREATE POLICY "Users view own company files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = (
    SELECT company_id::text FROM profiles WHERE user_id = auth.uid()
  )
);
```

### Error Handling

```typescript
// Storage Errors
if (error?.message.includes("Payload too large")) {
  toast.error("Datei zu groß (max. 10MB)");
} else if (error?.message.includes("duplicate")) {
  toast.error("Datei existiert bereits");
} else if (error?.statusCode === "42501") {
  toast.error("Keine Berechtigung zum Upload");
}
```

### Limits

- **Max File Size:** 50MB (Free Tier)
- **Total Storage:** 1GB Free
- **Bandwidth:** 2GB/Monat Free

---

## ⚡ 5. SUPABASE EDGE FUNCTIONS

### Overview

**Deployed Functions:** 79  
**Runtime:** Deno  
**Deployment:** Automatisch via GitHub Actions

### Key Functions

#### ai-orchestrator

**Zweck:** Master AI für Task-Orchestrierung  
**Trigger:** Manual HTTP Call  
**Model:** google/gemini-2.5-pro

```typescript
// Call from Frontend
const { data } = await supabase.functions.invoke("ai-orchestrator", {
  body: {
    task: "Analyze booking patterns",
    scope: "company",
    constraints: { timeframe: "30days" },
  },
});
```

#### ai-code-analyzer

**Zweck:** Code-Analyse für Qualitätschecks  
**Trigger:** CI/CD Pipeline  
**Model:** google/gemini-2.5-flash

#### ai-code-migrator

**Zweck:** Automatische Code-Fixes  
**Trigger:** Manual nach Code-Analyzer

### Error Handling

```typescript
// Edge Function Errors
try {
  const { data, error } = await supabase.functions.invoke("function-name", {
    body: payload,
  });

  if (error) {
    if (error.message.includes("timeout")) {
      toast.error("Zeitüberschreitung - bitte erneut versuchen");
    } else if (error.message.includes("LOVABLE_API_KEY")) {
      logError("[Edge Function] API Key missing");
    }
  }
} catch (error) {
  logError("[Edge Function] Network error:", error);
  toast.error("Verbindungsfehler");
}
```

### Rate Limits

- **Invocations:** 500k/Monat Free
- **Execution Time:** 60s max
- **Memory:** 512MB max

---

## 🔄 6. SUPABASE REALTIME

### Overview

**Channels:** 4 aktiv  
**Zweck:** Live Updates für Tables  
**Dokumentation:** siehe `REALTIME_SUBSCRIPTIONS_PLAN.md`

### Active Channels

1. **bookings-realtime-updates**
2. **drivers-realtime-updates**
3. **vehicles-realtime-updates**
4. **chat-messages-realtime**

### Subscription Pattern

```typescript
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useRealtimeBookings() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("bookings-realtime-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          console.log("[Realtime] Booking change:", payload);
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
```

### Error Handling

```typescript
// Connection Loss Handling
channel.on("system", {}, (status) => {
  if (status === "CHANNEL_ERROR") {
    logError("[Realtime] Channel error - reconnecting...");
    setTimeout(() => channel.subscribe(), 5000);
  }
});
```

---

## 🤖 7. OPENROUTER AI

### Overview

**Zweck:** AI Chat, Sentiment Analysis  
**Models:** gpt-4, claude-3, gemini-pro  
**API Key:** `LOVABLE_API_KEY` (via Supabase Secrets)

### Usage

```typescript
// Call via Edge Function
const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-2.5-pro",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userMessage },
    ],
  }),
});

const data = await response.json();
const aiMessage = data.choices[0].message.content;
```

### Rate Limits

- **Model-abhängig:** gpt-4 = 10k Tokens/min
- **Kosten:** Per Token (siehe OpenRouter Pricing)

---

## 💳 8. STRIPE

### Overview

**Zweck:** Subscription Management, Payment Processing  
**API Key:** `STRIPE_SECRET_KEY` (via Supabase Secrets)  
**Webhook Secret:** `STRIPE_WEBHOOK_SECRET`

### Core Functions

#### Create Checkout Session

```typescript
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [
    {
      price: "price_xxx", // Stripe Price ID
      quantity: 1,
    },
  ],
  mode: "subscription",
  success_url: "https://mydispatch.app/success",
  cancel_url: "https://mydispatch.app/pricing",
  customer_email: user.email,
  metadata: {
    company_id: user.company_id,
    user_id: user.id,
  },
});
```

#### Webhook Handling

```typescript
// Verify Stripe Signature
const sig = request.headers.get("stripe-signature");
const event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);

switch (event.type) {
  case "checkout.session.completed":
    // Update subscription in DB
    await updateSubscription(event.data.object);
    break;
  case "invoice.payment_failed":
    // Notify user
    await sendPaymentFailedEmail(event.data.object);
    break;
}
```

### Rate Limits

- **API Calls:** 100 Requests/Sekunde
- **Webhooks:** Unbegrenzt

---

## 📧 9. RESEND

### Overview

**Zweck:** Transactional Emails  
**API Key:** `RESEND_API_KEY`

### Send Email

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "noreply@mydispatch.app",
  to: user.email,
  subject: "Willkommen bei MyDispatch",
  html: emailTemplate,
});
```

### Rate Limits

- **Free Tier:** 100 Emails/Tag
- **Paid:** Unbegrenzt

---

## 🌦️ 10. OPENWEATHERMAP

### Overview

**Zweck:** Wetterdaten für Route Planning  
**API Key:** `OPENWEATHER_API_KEY`

### Usage

```typescript
const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
);
const weather = await response.json();
```

### Rate Limits

- **Free:** 60 Calls/Minute

---

## 📹 11. DAILY.CO

### Overview

**Zweck:** Video-Calls für Support  
**API Key:** `DAILY_API_KEY`

### Create Room

```typescript
const response = await fetch("https://api.daily.co/v1/rooms", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${DAILY_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: `support-${Date.now()}`,
    privacy: "private",
  }),
});
```

---

## 📊 COMPONENT → API MAPPING

| Component                 | HERE | Supabase Auth | Supabase DB | Supabase Storage | Edge Functions | Realtime | Stripe |
| ------------------------- | ---- | ------------- | ----------- | ---------------- | -------------- | -------- | ------ |
| **HEREMapComponent**      | ✅   | ❌            | ✅          | ❌               | ❌             | ✅       | ❌     |
| **AddressAutosuggest**    | ✅   | ❌            | ❌          | ❌               | ❌             | ❌       | ❌     |
| **Auth.tsx**              | ❌   | ✅            | ✅          | ❌               | ❌             | ❌       | ❌     |
| **Dashboard (Index.tsx)** | ✅   | ✅            | ✅          | ❌               | ❌             | ✅       | ❌     |
| **Auftraege.tsx**         | ❌   | ✅            | ✅          | ❌               | ❌             | ✅       | ❌     |
| **Dokumente.tsx**         | ❌   | ✅            | ✅          | ✅               | ❌             | ❌       | ❌     |
| **Pricing.tsx**           | ❌   | ✅            | ❌          | ❌               | ❌             | ❌       | ✅     |
| **ChatWindow**            | ❌   | ✅            | ✅          | ❌               | ✅             | ✅       | ❌     |

---

## 🔒 SECRETS MANAGEMENT

**Alle API Keys sind als Supabase Secrets gespeichert:**

```bash
# List Secrets
supabase secrets list

# Set Secret
supabase secrets set STRIPE_SECRET_KEY="sk_live_xxx"
```

**Environment Variables:**

- `VITE_HERE_API_KEY` (Frontend, .env)
- `VITE_SUPABASE_URL` (Frontend, .env)
- `VITE_SUPABASE_ANON_KEY` (Frontend, .env)
- Alle anderen: Supabase Secrets (Backend only)

---

## 🚨 MONITORING & ALERTS

### Performance Monitoring

- **Supabase Dashboard:** Query Performance
- **Lighthouse CI:** Frontend Performance
- **Sentry:** Error Tracking (optional)

### Alerts

- **Email:** Bei kritischen Fehlern
- **Slack:** Bei Deployment Failures
- **Toast:** Bei User-sichtbaren Fehlern

---

**Version:** 28.2.0  
**Status:** ✅ PRODUCTION  
**Nächste Review:** Bei neuer API-Integration
