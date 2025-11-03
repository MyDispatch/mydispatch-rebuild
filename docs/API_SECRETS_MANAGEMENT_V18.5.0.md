# API & SECRETS MANAGEMENT V18.5.0

> **Version:** 18.5.0  
> **Status:** ✅ PRODUKTIV  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 ÜBERSICHT

Zentrale Verwaltung aller API-Keys, Secrets und Credentials für MyDispatch.

### Kritische Prinzipien

1. **Security-First:** NIEMALS API-Keys im Code committen
2. **Lovable Cloud:** Primäre Secret-Storage für alle Credentials
3. **Rotation:** Regelmäßiger Austausch sensibler Keys (alle 90 Tage)
4. **Least-Privilege:** Jeder Key nur mit minimal notwendigen Berechtigungen

---

## 🔐 API-KEYS ÜBERSICHT

### 1. HERE MAPS API (Routing & Geocoding)

**Verwendung:** Route-Optimierung, Geocoding, Traffic, Standortverfolgung

**Speicherort:** Lovable Cloud → Secrets  
**Key-Name:** `HERE_API_KEY`  
**Typ:** REST API Key  
**Berechtigungen:** 
- Route Calculation V8
- Geocoding & Search V7
- Traffic V7
- Map Tile API V3

**Integration:**
```typescript
// Edge Function: /supabase/functions/calculate-route/index.ts
const HERE_API_KEY = Deno.env.get('HERE_API_KEY');

// Frontend: Über Edge Function (NIEMALS direkt)
const { data } = await supabase.functions.invoke('calculate-route', {
  body: { origin, destination }
});
```

**Cost Management:**
- Free Tier: 250.000 Transactions/Monat
- Caching: Route-Cache 24h (Redis/Supabase)
- Fallback: Google Maps API (sekundär)

**Dokumentation:** https://developer.here.com/documentation

---

### 2. OPENWEATHERMAP API (Wetterdaten)

**Verwendung:** Live-Wetter, Wettervorhersagen, Verkehrs-Prediction

**Speicherort:** Lovable Cloud → Secrets  
**Key-Name:** `OPENWEATHERMAP_API_KEY`  
**Typ:** REST API Key  
**Berechtigungen:** 
- Current Weather Data
- 5 Day / 3 Hour Forecast
- One Call API 3.0

**Integration:**
```typescript
// Edge Function: /supabase/functions/fetch-weather/index.ts
const OPENWEATHERMAP_API_KEY = Deno.env.get('OPENWEATHERMAP_API_KEY');

const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&lang=de`
);
```

**Cost Management:**
- Free Tier: 1.000 Calls/Tag
- Caching: 30min Cache per City
- Update-Frequenz: Alle 30min für Dashboard-Widget

**Dokumentation:** https://openweathermap.org/api

---

### 3. RESEND (E-Mail-Versand)

**Verwendung:** Transaktionale E-Mails (Buchungsbestätigungen, Passwort-Reset, etc.)

**Speicherort:** Lovable Cloud → Secrets  
**Key-Name:** `RESEND_API_KEY`  
**Typ:** API Key  
**Berechtigungen:** Full Access

**Integration:**
```typescript
// Edge Function: /supabase/functions/send-email/index.ts
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

await resend.emails.send({
  from: "MyDispatch <noreply@mydispatch.de>",
  to: [customerEmail],
  subject: "Buchungsbestätigung",
  html: emailTemplate,
});
```

**E-Mail-Templates:**
- Registrierung: `registrationConfirmTemplate`
- Passwort-Reset: `passwordResetTemplate`
- Buchungsbestätigung: `bookingConfirmationTemplate`
- Rechnung: `invoiceEmailTemplate`
- Dokument-Erinnerung: `documentExpiryTemplate`

**Cost Management:**
- Free Tier: 100 E-Mails/Tag
- Pro Plan: $20/Monat (50.000 E-Mails)
- Domain-Validierung: mydispatch.de (DKIM/SPF/DMARC)

**Dokumentation:** https://resend.com/docs

---

### 4. STRIPE (Payment Processing)

**Verwendung:** Subscription-Management (MyDispatch-Tarife), Payment für Unternehmer-Kunden

**Speicherort:** Lovable Cloud → Secrets (2 Keys!)  
**Key-Name:** 
- `STRIPE_SECRET_KEY` (Server-Side)
- `STRIPE_PUBLISHABLE_KEY` (Client-Side - KANN im Code sein!)

**Typ:** 
- Secret Key: Server-Only (sk_live_...)
- Publishable Key: Client-Safe (pk_live_...)

**Integration - Subscription (MyDispatch-Tarife):**
```typescript
// Edge Function: /supabase/functions/check-subscription/index.ts
import Stripe from "https://esm.sh/stripe@18.5.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const subscriptions = await stripe.subscriptions.list({
  customer: customerId,
  status: "active",
});
```

**Integration - Unternehmer-Variante (Connect):**
```typescript
// WICHTIG: Jeder Unternehmer benötigt eigenen Stripe-Account!
// MyDispatch nutzt Stripe Connect (Platform)

// Edge Function: /supabase/functions/create-connect-account/index.ts
const account = await stripe.accounts.create({
  type: 'express',
  country: 'DE',
  email: companyEmail,
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true },
  },
});

// Company Tabelle erweitern:
// - stripe_connect_account_id
// - stripe_connect_onboarding_completed
```

**Produkt-IDs (MyDispatch-Tarife):**
```typescript
// src/lib/subscription-utils.ts
export const PRODUCT_IDS = {
  starter: ['prod_TEeg0ykplmGKd0', 'prod_TF5cFE5Fi5rBCz'],
  business: ['prod_TEegHmtpPZOZcG', 'prod_TF5cnWFZYEQUsG'],
  enterprise: ['prod_ENTERPRISE_ID_PLACEHOLDER'],
};

export const PRICE_IDS = {
  starterMonthly: 'price_1SIBMrLX5M8TT990zBX6gWOm',
  starterYearly: 'price_1SIbRALX5M8TT990B81vhHPT',
  businessMonthly: 'price_1SIBN9LX5M8TT990mxE8owxm',
  businessYearly: 'price_1SIbRKLX5M8TT990e1vX4ebf',
};
```

**Webhooks:**
```typescript
// Edge Function: /supabase/functions/stripe-webhook/index.ts
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const signature = req.headers.get('stripe-signature');

const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

switch (event.type) {
  case 'checkout.session.completed':
    // Update subscription_product_id in companies table
    break;
  case 'customer.subscription.deleted':
    // Set subscription_status = 'cancelled'
    break;
}
```

**Cost Management:**
- Gebühren: 1,4% + 0,25€ pro Transaktion (Europa)
- Connect-Gebühr: +2% für Plattform (auf Unternehmer-Payments)

**Dokumentation:** https://stripe.com/docs

---

### 5. SUPABASE (Backend-as-a-Service)

**Verwendung:** Datenbank, Auth, Storage, Edge Functions

**Speicherort:** Automatisch via Lovable Cloud  
**Key-Namen:**
- `VITE_SUPABASE_URL` (Client-Side)
- `VITE_SUPABASE_ANON_KEY` (Client-Side)
- `SUPABASE_SERVICE_ROLE_KEY` (Server-Only!)

**Integration:**
```typescript
// Frontend: src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Edge Functions: Service Role Key für Admin-Actions
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } }
);
```

**Security:**
- ✅ Row Level Security (RLS) auf ALLEN Tabellen
- ✅ company_id Filter in ALLEN Queries
- ❌ NIEMALS Service Role Key im Frontend

**Dokumentation:** https://supabase.com/docs

---

### 6. LOVABLE AI GATEWAY (Optional)

**Verwendung:** AI-Features (Chatbot, Sentiment-Analyse, Vorhersagen)

**Speicherort:** KEINE API-Keys nötig! (Lovable Cloud integriert)  
**Modelle:**
- `google/gemini-2.5-pro` (Multimodal, komplexes Reasoning)
- `google/gemini-2.5-flash` (Balanced Performance)
- `google/gemini-2.5-flash-lite` (Schnell, kostengünstig)
- `openai/gpt-5` (Höchste Qualität)
- `openai/gpt-5-mini` (Mittelweg)
- `openai/gpt-5-nano` (Speed-optimiert)

**Integration:**
```typescript
// Edge Function: /supabase/functions/ai-forecast/index.ts
const response = await fetch('https://api.lovable.dev/ai/v1/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // KEIN API-Key nötig!
  },
  body: JSON.stringify({
    model: 'google/gemini-2.5-flash',
    prompt: 'Erstelle eine 7-Tage-Prognose...',
  }),
});
```

**Cost Management:**
- Lovable Cloud Free Tier: 1.000 Requests/Monat
- Usage-Based Pricing ab 10.000 Requests

**Dokumentation:** https://docs.lovable.dev/features/ai

---

## 🛠️ SECRET-MANAGEMENT WORKFLOWS

### 1. Secret hinzufügen (Lovable Cloud)

```bash
# 1. Lovable UI öffnen: Settings → Tools → Cloud → Secrets
# 2. "Add Secret" klicken
# 3. Name eingeben (z.B. HERE_API_KEY)
# 4. Value eingeben (API-Key)
# 5. Speichern

# Alternat
iv: CLI (falls verfügbar)
npx supabase secrets set HERE_API_KEY="your_key_here" --project-id vsbqyqhzxmwezlhzdmfd
```

### 2. Secret im Edge Function verwenden

```typescript
// supabase/functions/example/index.ts
const apiKey = Deno.env.get('HERE_API_KEY');

if (!apiKey) {
  throw new Error('HERE_API_KEY not configured');
}
```

### 3. Secret rotieren (alle 90 Tage)

1. Neuen API-Key beim Provider generieren
2. Alten Key BEHALTEN (Dual-Key-Phase)
3. Neuen Key in Lovable Cloud updaten
4. Edge Functions deployen
5. 24h warten (Cache-Invalidierung)
6. Alten Key beim Provider löschen

---

## 🚨 SECURITY BEST PRACTICES

### ❌ VERBOTEN

```typescript
// NIEMALS API-Keys im Code
const API_KEY = "sk_live_abc123..."; // ❌

// NIEMALS in Git committen
# .env
STRIPE_SECRET_KEY=sk_live_abc123... // ❌

// NIEMALS im Frontend verwenden (außer Publishable Keys)
const stripe = new Stripe("sk_live_abc123..."); // ❌
```

### ✅ KORREKT

```typescript
// Edge Function mit Deno.env
const API_KEY = Deno.env.get('STRIPE_SECRET_KEY'); // ✅

// Frontend nur mit Publishable Keys
const stripe = new Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // ✅

// Immer Fehlerbehandlung
if (!API_KEY) {
  throw new Error('API Key nicht konfiguriert');
}
```

---

## 📊 MONITORING & ALERTS

### 1. API-Usage-Tracking

```sql
-- Neue Tabelle: api_usage_logs
CREATE TABLE api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_provider TEXT NOT NULL, -- 'here', 'stripe', 'openweather'
  endpoint TEXT,
  status_code INTEGER,
  response_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für Performance
CREATE INDEX idx_api_usage_provider_date ON api_usage_logs(api_provider, created_at DESC);
```

### 2. Cost-Tracking Edge Function

```typescript
// supabase/functions/log-api-usage/index.ts
export const logAPIUsage = async (provider: string, statusCode: number, responseTime: number) => {
  await supabase.from('api_usage_logs').insert({
    api_provider: provider,
    status_code: statusCode,
    response_time_ms: responseTime,
  });
};
```

### 3. Alert-System (N8N Workflow)

```json
{
  "name": "API-Usage-Alert",
  "trigger": {
    "type": "schedule",
    "cron": "0 * * * *" // Jede Stunde
  },
  "actions": [
    {
      "type": "supabase-query",
      "query": "SELECT api_provider, COUNT(*) FROM api_usage_logs WHERE created_at > NOW() - INTERVAL '1 hour' GROUP BY api_provider"
    },
    {
      "type": "condition",
      "if": "count > 5000", // HERE API Limit Check
      "then": {
        "type": "send-email",
        "to": "admin@mydispatch.de",
        "subject": "⚠️ HERE API Limit erreicht"
      }
    }
  ]
}
```

---

## 🔄 API-KEY ROTATION PLAN

### Quartalweise Rotation (Alle 90 Tage)

| API-Provider | Letzter Rotation | Nächster Rotation | Status |
|--------------|------------------|-------------------|--------|
| HERE Maps | 2025-01-15 | 2025-04-15 | ✅ OK |
| OpenWeatherMap | 2025-01-15 | 2025-04-15 | ✅ OK |
| Resend | 2025-01-15 | 2025-04-15 | ✅ OK |
| Stripe (Secret) | 2025-01-15 | 2025-04-15 | ✅ OK |

**Prozess:**
1. 2 Wochen vorher: E-Mail-Reminder an Admin
2. Neuen Key generieren (Provider-Dashboard)
3. Lovable Cloud Secret updaten
4. Edge Functions automatisch neu deployen
5. 24h Monitoring (Fehlerrate prüfen)
6. Alten Key deaktivieren

---

## 📝 CHECKLISTE: NEUES SECRET HINZUFÜGEN

- [ ] Secret in Lovable Cloud hinzufügen
- [ ] Edge Function erstellen/updaten
- [ ] Fehlerbehandlung implementieren (if (!key) throw...)
- [ ] Logging hinzufügen (logAPIUsage)
- [ ] Cost-Management prüfen (Free Tier?)
- [ ] Dokumentation updaten (diese Datei!)
- [ ] Security-Review (NIEMALS im Frontend?)
- [ ] Rotation-Plan festlegen (90 Tage?)

---

## 🔗 EXTERNE RESSOURCEN

- **HERE Maps:** https://developer.here.com
- **OpenWeatherMap:** https://openweathermap.org/api
- **Resend:** https://resend.com/docs
- **Stripe:** https://stripe.com/docs
- **Supabase:** https://supabase.com/docs
- **Lovable AI:** https://docs.lovable.dev/features/ai

---

**Version:** V18.5.0  
**Nächstes Update:** Q2 2025 (API-Key Rotation)