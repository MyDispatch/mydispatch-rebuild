# 🔄 API FLOW DIAGRAMS V28.2.0

**Status:** ✅ PRODUCTION  
**Letzte Aktualisierung:** 2025-10-29  
**Version:** 28.2.0  
**Zweck:** Visualisierung kritischer API-Flows mit Mermaid

---

## 📋 OVERVIEW

Dieses Dokument enthält **Sequence Diagrams** für die 8 kritischsten API-Flows in MyDispatch:

1. **Booking Creation Flow** - User erstellt neue Buchung
2. **Map Rendering Flow** - Dashboard Map wird geladen
3. **Chat Message Flow** - User sendet Chat-Nachricht
4. **Driver Status Update Flow** - Driver ändert Status
5. **Address Autocomplete Flow** - User tippt Adresse ein
6. **Invoice Generation Flow** - System generiert Rechnung
7. **Realtime Subscription Flow** - Client subscribt Realtime Channel
8. **Payment Flow** - User startet Stripe Checkout

---

## 1️⃣ BOOKING CREATION FLOW

**Trigger:** User klickt "Neuer Auftrag" Button im Dashboard  
**Duration:** ~800ms (ohne Address Autocomplete)  
**APIs:** HERE Geocoding, Supabase DB, Supabase Realtime

```mermaid
sequenceDiagram
    participant User
    participant BookingDialog
    participant AddressAutocomplete
    participant HEREGeocoding
    participant SupabaseDB
    participant RealtimeChannel
    participant Dashboard

    User->>BookingDialog: Click "Neuer Auftrag"
    BookingDialog->>User: Show Dialog

    User->>AddressAutocomplete: Type "Hauptstraße 1"
    AddressAutocomplete->>HEREGeocoding: autosuggest(query)
    Note over AddressAutocomplete,HEREGeocoding: Debounced 300ms
    HEREGeocoding-->>AddressAutocomplete: Suggestions []
    AddressAutocomplete->>User: Show Dropdown

    User->>AddressAutocomplete: Select Address
    AddressAutocomplete->>HEREGeocoding: geocode(address)
    HEREGeocoding-->>AddressAutocomplete: { lat, lng }

    User->>BookingDialog: Click "Speichern"
    BookingDialog->>BookingDialog: Validate Form (Zod)

    alt Validation Success
        BookingDialog->>SupabaseDB: INSERT booking
        Note over SupabaseDB: RLS checks company_id
        SupabaseDB-->>BookingDialog: { id, ... }

        SupabaseDB->>RealtimeChannel: BROADCAST 'INSERT'
        RealtimeChannel->>Dashboard: New Booking Event
        Dashboard->>Dashboard: Invalidate ['bookings'] Query
        Dashboard->>Dashboard: Refetch Bookings

        BookingDialog->>User: Toast "Buchung erstellt"
        BookingDialog->>BookingDialog: Close Dialog
    else Validation Error
        BookingDialog->>User: Show Error Messages
    end
```

**Error Points:**

- ⚠️ HERE API Timeout (Fallback: Manual Lat/Lng Input)
- ⚠️ Supabase RLS Violation (Toast: "Keine Berechtigung")
- ⚠️ Validation Error (Show Field-Errors)

**Performance Target:** < 800ms (ohne User-Input-Zeit)

---

## 2️⃣ MAP RENDERING FLOW

**Trigger:** User navigiert zu Dashboard  
**Duration:** ~2s (inkl. HERE SDK Load)  
**APIs:** HERE Maps SDK, Supabase DB (Bookings, Drivers, Vehicles)

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant HEREMapComponent
    participant HEREPlatform
    participant SupabaseDB
    participant RealtimeChannel

    User->>Dashboard: Navigate to /dashboard
    Dashboard->>Dashboard: useAuth() check
    Dashboard->>HEREMapComponent: Render Component

    HEREMapComponent->>HEREMapComponent: Check if window.H exists

    alt SDK Not Loaded
        HEREMapComponent->>HEREPlatform: Load HERE SDK Script
        Note over HEREMapComponent,HEREPlatform: ~500ms
        HEREPlatform-->>HEREMapComponent: SDK Ready
    end

    HEREMapComponent->>HEREPlatform: new H.service.Platform()
    HEREMapComponent->>HEREPlatform: createDefaultLayers()
    HEREMapComponent->>HEREPlatform: new H.Map(container, layers)
    Note over HEREMapComponent,HEREPlatform: Map rendered ~800ms

    HEREMapComponent->>SupabaseDB: SELECT company headquarters
    SupabaseDB-->>HEREMapComponent: { lat, lng, name }
    HEREMapComponent->>HEREPlatform: addMarker(headquarters)

    HEREMapComponent->>SupabaseDB: SELECT active bookings
    SupabaseDB-->>HEREMapComponent: bookings []

    loop For each booking
        HEREMapComponent->>HEREPlatform: addMarker(booking)
    end

    HEREMapComponent->>SupabaseDB: SELECT available drivers
    SupabaseDB-->>HEREMapComponent: drivers []

    loop For each driver
        HEREMapComponent->>HEREPlatform: addMarker(driver)
    end

    HEREMapComponent->>RealtimeChannel: Subscribe 'bookings'
    HEREMapComponent->>RealtimeChannel: Subscribe 'drivers'
    HEREMapComponent->>RealtimeChannel: Subscribe 'vehicles'

    RealtimeChannel-->>HEREMapComponent: Connected ✓

    HEREMapComponent->>User: Map Ready 🗺️
```

**Error Points:**

- ⚠️ HERE SDK Load Failure (Fallback: Static Map Image)
- ⚠️ Company Headquarters Missing (Fallback: Default Berlin Coordinates)
- ⚠️ Realtime Connection Lost (Fallback: Polling every 10s)

**Performance Target:** < 2s Map Load (Lighthouse Metric)

---

## 3️⃣ CHAT MESSAGE FLOW

**Trigger:** User sendet Chat-Nachricht  
**Duration:** ~300ms (ohne AI Response)  
**APIs:** Supabase DB, Supabase Realtime, OpenRouter AI (Edge Function)

```mermaid
sequenceDiagram
    participant User
    participant ChatWindow
    participant SupabaseDB
    participant RealtimeChannel
    participant EdgeFunction
    participant OpenRouterAI
    participant OtherUsers

    User->>ChatWindow: Type Message + Enter
    ChatWindow->>ChatWindow: Validate (not empty, < 2000 chars)

    ChatWindow->>SupabaseDB: INSERT chat_message
    Note over SupabaseDB: { conversation_id, sender_id, content }
    SupabaseDB-->>ChatWindow: { id, created_at }

    SupabaseDB->>RealtimeChannel: BROADCAST 'INSERT'
    RealtimeChannel->>ChatWindow: New Message Event (Self)
    RealtimeChannel->>OtherUsers: New Message Event

    ChatWindow->>ChatWindow: Scroll to Bottom
    ChatWindow->>User: Message Sent ✓

    alt AI-Enabled Conversation
        ChatWindow->>EdgeFunction: Invoke 'ai-chat-handler'
        Note over EdgeFunction: Check if AI should respond

        alt AI Response Needed
            EdgeFunction->>OpenRouterAI: POST /v1/chat/completions
            Note over EdgeFunction,OpenRouterAI: Model: gpt-4-turbo
            OpenRouterAI-->>EdgeFunction: AI Response

            EdgeFunction->>SupabaseDB: INSERT ai_message
            SupabaseDB->>RealtimeChannel: BROADCAST 'INSERT'
            RealtimeChannel->>ChatWindow: AI Message Event
            ChatWindow->>User: AI Response 🤖
        end
    end
```

**Error Points:**

- ⚠️ Message Insert Failed (Toast: "Nachricht konnte nicht gesendet werden")
- ⚠️ Realtime Connection Lost (Show Warning: "Offline - Messages verzögert")
- ⚠️ AI API Timeout (Show: "AI antwortet nicht")

**Performance Target:** < 300ms Message Insert

---

## 4️⃣ DRIVER STATUS UPDATE FLOW

**Trigger:** Driver ändert Status (verfügbar → beschäftigt)  
**Duration:** ~200ms  
**APIs:** Supabase DB, Supabase Realtime

```mermaid
sequenceDiagram
    participant Driver
    participant DriverApp
    participant SupabaseDB
    participant RealtimeChannel
    participant Dashboard
    participant HEREMap

    Driver->>DriverApp: Click "Status: Beschäftigt"
    DriverApp->>SupabaseDB: UPDATE drivers SET status='busy'
    Note over SupabaseDB: RLS checks user_id = driver_user_id
    SupabaseDB-->>DriverApp: Success ✓

    SupabaseDB->>RealtimeChannel: BROADCAST 'UPDATE'
    RealtimeChannel->>Dashboard: Driver Status Changed
    Dashboard->>Dashboard: Invalidate ['drivers'] Query
    Dashboard->>Dashboard: Refetch Drivers

    RealtimeChannel->>HEREMap: Driver Status Changed
    HEREMap->>HEREMap: Update Marker Icon
    Note over HEREMap: Available (Green) → Busy (Orange)

    Dashboard->>Dashboard: Update KPI "Verfügbare Fahrer"
    Note over Dashboard: Count decreased by 1

    Dashboard->>Driver: Updated UI ✓
```

**Error Points:**

- ⚠️ Update Failed (RLS Violation) - Toast: "Keine Berechtigung"
- ⚠️ Optimistic Update Conflict (Version Mismatch) - Reload Data

**Performance Target:** < 200ms Status Update

---

## 5️⃣ ADDRESS AUTOCOMPLETE FLOW

**Trigger:** User tippt Adresse in Booking-Formular  
**Duration:** ~350ms (300ms Debounce + 50ms API)  
**APIs:** HERE Autosuggest API

```mermaid
sequenceDiagram
    participant User
    participant AddressInput
    participant Debouncer
    participant HEREAutosuggest
    participant Dropdown

    User->>AddressInput: Type "Hauptstraße"
    AddressInput->>Debouncer: Queue Request
    Note over Debouncer: Wait 300ms

    User->>AddressInput: Continue typing "Hauptstraße 1"
    AddressInput->>Debouncer: Cancel Previous, Queue New
    Note over Debouncer: Wait 300ms

    User->>AddressInput: Stop typing
    Note over Debouncer: 300ms elapsed

    Debouncer->>HEREAutosuggest: autosuggest("Hauptstraße 1")
    Note over HEREAutosuggest: at: user_lat,user_lng<br/>limit: 5
    HEREAutosuggest-->>AddressInput: Suggestions [5]

    AddressInput->>Dropdown: Show Results
    Dropdown->>User: Display 5 Addresses

    User->>Dropdown: Click "Hauptstraße 1, Berlin"
    Dropdown->>AddressInput: Set Value
    AddressInput->>HEREAutosuggest: geocode("Hauptstraße 1, Berlin")
    HEREAutosuggest-->>AddressInput: { lat: 52.52, lng: 13.40 }

    AddressInput->>AddressInput: Store lat/lng in hidden fields
    AddressInput->>User: Address Selected ✓
```

**Error Points:**

- ⚠️ API Rate Limit (Show: "Zu viele Anfragen, bitte warten")
- ⚠️ No Suggestions Found (Show: "Keine Adressen gefunden")
- ⚠️ Geocoding Failed (Fallback: Manual Lat/Lng Input)

**Performance Target:** < 50ms API Response (nach Debounce)

---

## 6️⃣ INVOICE GENERATION FLOW

**Trigger:** User klickt "Rechnung erstellen" für Booking  
**Duration:** ~1.5s (PDF Generation)  
**APIs:** Supabase DB, Edge Function (PDF Generator)

```mermaid
sequenceDiagram
    participant User
    participant AuftraegePage
    participant SupabaseDB
    participant EdgeFunction
    participant PDFGenerator
    participant SupabaseStorage

    User->>AuftraegePage: Click "Rechnung erstellen"
    AuftraegePage->>SupabaseDB: SELECT booking + customer + company
    SupabaseDB-->>AuftraegePage: Complete Booking Data

    AuftraegePage->>EdgeFunction: Invoke 'generate-invoice'
    Note over EdgeFunction: Pass booking_id

    EdgeFunction->>SupabaseDB: SELECT invoice_template
    SupabaseDB-->>EdgeFunction: Template HTML

    EdgeFunction->>PDFGenerator: Render HTML to PDF
    Note over PDFGenerator: Puppeteer/Chrome<br/>~1s
    PDFGenerator-->>EdgeFunction: PDF Buffer

    EdgeFunction->>SupabaseStorage: Upload invoice.pdf
    Note over SupabaseStorage: Bucket: invoices<br/>Path: company_id/booking_id.pdf
    SupabaseStorage-->>EdgeFunction: Public URL

    EdgeFunction->>SupabaseDB: UPDATE booking SET invoice_url
    SupabaseDB-->>EdgeFunction: Success ✓

    EdgeFunction-->>AuftraegePage: { invoice_url }
    AuftraegePage->>User: Download PDF 📄
```

**Error Points:**

- ⚠️ PDF Generation Timeout (> 10s) - Retry once
- ⚠️ Storage Upload Failed - Toast: "Upload fehlgeschlagen"
- ⚠️ Template Not Found - Use Default Template

**Performance Target:** < 2s Total Time

---

## 7️⃣ REALTIME SUBSCRIPTION FLOW

**Trigger:** Component Mount (Dashboard, Auftraege, etc.)  
**Duration:** ~500ms Connection Setup  
**APIs:** Supabase Realtime

```mermaid
sequenceDiagram
    participant Component
    participant useRealtimeHook
    participant SupabaseClient
    participant RealtimeServer
    participant PostgreSQL

    Component->>useRealtimeHook: useRealtimeBookings()
    useRealtimeHook->>SupabaseClient: supabase.channel('bookings')
    SupabaseClient->>RealtimeServer: WebSocket Connect
    Note over SupabaseClient,RealtimeServer: wss://realtime.supabase.co

    RealtimeServer-->>SupabaseClient: Connected ✓

    SupabaseClient->>RealtimeServer: Subscribe 'postgres_changes'
    Note over RealtimeServer: table: bookings<br/>event: *
    RealtimeServer->>PostgreSQL: LISTEN bookings_channel
    PostgreSQL-->>RealtimeServer: Listening ✓

    RealtimeServer-->>SupabaseClient: Subscribed ✓
    SupabaseClient-->>useRealtimeHook: Channel Ready

    Note over Component,PostgreSQL: --- Later: Data Changes ---

    PostgreSQL->>RealtimeServer: NOTIFY 'INSERT booking'
    RealtimeServer->>SupabaseClient: WebSocket Message
    SupabaseClient->>useRealtimeHook: Callback({ event: 'INSERT', new: {...} })
    useRealtimeHook->>Component: Invalidate Queries
    Component->>Component: Refetch Data
    Component->>Component: Re-render with new data
```

**Error Points:**

- ⚠️ WebSocket Connection Failed (Fallback: HTTP Polling)
- ⚠️ Connection Dropped (Auto-Reconnect after 5s)
- ⚠️ Channel Error (Log + Toast Warning)

**Performance Target:** < 500ms Connection Setup

---

## 8️⃣ PAYMENT FLOW (STRIPE CHECKOUT)

**Trigger:** User klickt "Abonnement kaufen" auf Pricing-Seite  
**Duration:** ~2s (Checkout Session Creation)  
**APIs:** Stripe, Supabase DB (Webhook)

```mermaid
sequenceDiagram
    participant User
    participant PricingPage
    participant EdgeFunction
    participant Stripe
    participant StripeCheckout
    participant StripeWebhook
    participant SupabaseDB

    User->>PricingPage: Click "Professional buchen"
    PricingPage->>EdgeFunction: Invoke 'create-checkout-session'
    Note over EdgeFunction: Pass: price_id, user_email

    EdgeFunction->>Stripe: stripe.checkout.sessions.create()
    Note over Stripe: mode: 'subscription'<br/>price: price_xxx
    Stripe-->>EdgeFunction: { url: checkout_url }

    EdgeFunction-->>PricingPage: { checkout_url }
    PricingPage->>User: Redirect to Stripe

    User->>StripeCheckout: Fill Payment Info
    StripeCheckout->>StripeCheckout: Process Payment
    StripeCheckout->>User: Payment Success ✓

    StripeCheckout->>StripeWebhook: POST /stripe-webhook
    Note over StripeWebhook: Event: checkout.session.completed

    StripeWebhook->>StripeWebhook: Verify Signature
    StripeWebhook->>SupabaseDB: UPDATE subscription
    Note over SupabaseDB: Set: plan='professional'<br/>status='active'
    SupabaseDB-->>StripeWebhook: Success ✓

    StripeWebhook-->>StripeCheckout: 200 OK
    StripeCheckout->>User: Redirect to Success Page
```

**Error Points:**

- ⚠️ Checkout Session Creation Failed (Toast: "Fehler beim Laden")
- ⚠️ Payment Failed (Stripe shows error)
- ⚠️ Webhook Signature Invalid (Log + Alert Admin)

**Performance Target:** < 2s Checkout Session Creation

---

## 📊 PERFORMANCE TARGETS SUMMARY

| Flow                      | Target  | Critical? | Fallback          |
| ------------------------- | ------- | --------- | ----------------- |
| **Booking Creation**      | < 800ms | ✅ Yes    | Manual Lat/Lng    |
| **Map Rendering**         | < 2s    | ✅ Yes    | Static Image      |
| **Chat Message**          | < 300ms | ⚠️ Medium | Offline Queue     |
| **Driver Status Update**  | < 200ms | ✅ Yes    | Optimistic Update |
| **Address Autocomplete**  | < 50ms  | ⚠️ Medium | Manual Input      |
| **Invoice Generation**    | < 2s    | ⚠️ Medium | Retry + Email     |
| **Realtime Subscription** | < 500ms | ✅ Yes    | HTTP Polling      |
| **Payment Flow**          | < 2s    | ✅ Yes    | Retry + Support   |

---

## 🚨 ERROR HANDLING PATTERNS

### Pattern 1: Retry with Exponential Backoff

```typescript
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
```

### Pattern 2: Fallback to Manual Input

```typescript
try {
  const { lat, lng } = await geocodeAddress(address);
} catch (error) {
  logError("[Geocoding] Failed:", error);
  toast.info("Bitte Koordinaten manuell eingeben");
  setShowManualInput(true);
}
```

### Pattern 3: Optimistic Update

```typescript
// Update UI immediately
setBookings((prev) => [...prev, newBooking]);

// Then save to DB
try {
  await supabase.from("bookings").insert(newBooking);
} catch (error) {
  // Rollback on error
  setBookings((prev) => prev.filter((b) => b.id !== newBooking.id));
  toast.error("Speichern fehlgeschlagen");
}
```

---

**Version:** 28.2.0  
**Status:** ✅ PRODUCTION  
**Nächste Review:** Bei neuen kritischen Flows
