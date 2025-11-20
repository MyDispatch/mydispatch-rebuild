# STRIPE INTEGRATION V18.5.0

> **Version:** 18.5.0  
> **Status:** ✅ PRODUKTIV  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 ÜBERSICHT

MyDispatch nutzt Stripe in **zwei verschiedenen Kontexten**:

1. **MyDispatch-Tarife** (Subscription für Unternehmen)
2. **Unternehmer-Kunden-Payments** (Jeder Unternehmer hat eigenen Stripe-Account)

---

## 📦 TEIL 1: MYDISPATCH-TARIFE (SUBSCRIPTION)

### Architektur

```
┌─────────────────────────────────────────────────────────┐
│                 MyDispatch Platform                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │  Starter   │  │  Business  │  │ Enterprise │       │
│  │   €49/mo   │  │   €99/mo   │  │   €299/mo  │       │
│  └────────────┘  └────────────┘  └────────────┘       │
│         │                │                │             │
│         └────────────────┴────────────────┘             │
│                       │                                 │
│                  Stripe API                             │
│  (Stripe Account: MyDispatch GmbH)                      │
└─────────────────────────────────────────────────────────┘
```

### Produkt & Preis-IDs

```typescript
// src/lib/subscription-utils.ts (BEREITS VORHANDEN)
export const PRODUCT_IDS = {
  starter: ['prod_TEeg0ykplmGKd0', 'prod_TF5cFE5Fi5rBCz'],
  business: ['prod_TEegHmtpPZOZcG', 'prod_TF5cnWFZYEQUsG'],
  enterprise: ['prod_ENTERPRISE_ID_PLACEHOLDER'],
} as const;

export const PRICE_IDS = {
  starterMonthly: 'price_1SIBMrLX5M8TT990zBX6gWOm',
  starterYearly: 'price_1SIbRALX5M8TT990B81vhHPT',
  businessMonthly: 'price_1SIBN9LX5M8TT990mxE8owxm',
  businessYearly: 'price_1SIbRKLX5M8TT990e1vX4ebf',
} as const;
```

### Edge Functions (BEREITS VORHANDEN)

#### 1. `check-subscription` (Status-Prüfung)

```typescript
// supabase/functions/check-subscription/index.ts
import Stripe from "https://esm.sh/stripe@18.5.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

// 1. Suche Stripe Customer via E-Mail
const customers = await stripe.customers.list({ 
  email: user.email, 
  limit: 1 
});

// 2. Prüfe aktive Subscription
const subscriptions = await stripe.subscriptions.list({
  customer: customerId,
  status: "active",
  limit: 1,
});

// 3. Update companies Tabelle
if (hasActiveSub) {
  await supabaseClient
    .from('companies')
    .update({
      subscription_product_id: productId,
      subscription_status: 'active',
      subscription_current_period_end: subscriptionEnd,
      stripe_customer_id: customerId,
    })
    .eq('id', profile.company_id);
}
```

**Aufruf im Frontend:**
```typescript
// src/hooks/use-subscription.tsx
const checkSubscription = async () => {
  const { data, error } = await supabase.functions.invoke('check-subscription');
  
  if (data) {
    setSubscriptionData({
      subscribed: data.subscribed,
      productId: data.product_id,
      subscriptionEnd: data.subscription_end
    });
  }
};

// Auto-Check: Alle 60s
useEffect(() => {
  checkSubscription();
  const interval = setInterval(checkSubscription, 60000);
  return () => clearInterval(interval);
}, []);
```

#### 2. `create-checkout` (Checkout-Session)

```typescript
// supabase/functions/create-checkout/index.ts
const session = await stripe.checkout.sessions.create({
  customer: customerId,
  line_items: [{ price: priceId, quantity: 1 }],
  mode: "subscription",
  success_url: `${origin}/`,
  cancel_url: `${origin}/pricing`,
  metadata: {
    supabase_user_id: user.id,
  },
});

return { url: session.url }; // Redirect zu Stripe Checkout
```

**Aufruf im Frontend:**
```typescript
// src/pages/Pricing.tsx
const handleSubscribe = async (priceId: string) => {
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { priceId }
  });
  
  if (data?.url) {
    window.open(data.url, '_blank'); // Öffnet Stripe Checkout
  }
};
```

#### 3. `customer-portal` (Subscription-Management)

```typescript
// supabase/functions/customer-portal/index.ts
const portalSession = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: `${origin}/einstellungen`,
});

return { url: portalSession.url };
```

**Aufruf im Frontend:**
```typescript
// src/pages/Einstellungen.tsx
const openCustomerPortal = async () => {
  const { data } = await supabase.functions.invoke('customer-portal');
  
  if (data?.url) {
    window.open(data.url, '_blank'); // Stripe Portal
  }
};
```

### Webhook-Handling (Optional, aber empfohlen)

```typescript
// supabase/functions/stripe-webhook/index.ts
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const signature = req.headers.get('stripe-signature')!;
const body = await req.text();

const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

switch (event.type) {
  case 'checkout.session.completed':
    const session = event.data.object;
    const userId = session.metadata.supabase_user_id;
    
    // Update subscription_product_id in companies table
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('user_id', userId)
      .single();
    
    if (profile?.company_id) {
      await supabase
        .from('companies')
        .update({
          subscription_status: 'active',
          subscription_product_id: session.metadata.product_id
        })
        .eq('id', profile.company_id);
    }
    break;
    
  case 'customer.subscription.deleted':
    // Set subscription_status = 'cancelled'
    break;
    
  case 'invoice.payment_failed':
    // Notification an Admin
    break;
}
```

**Webhook-URL konfigurieren:**
```
Stripe Dashboard → Developers → Webhooks → Add endpoint
URL: https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/stripe-webhook
Events: checkout.session.completed, customer.subscription.deleted, invoice.payment_failed
```

---

## 💳 TEIL 2: UNTERNEHMER-KUNDEN-PAYMENTS (STRIPE CONNECT)

### Architektur

```
┌─────────────────────────────────────────────────────────────────┐
│                     MyDispatch Platform                         │
│                  (Stripe Connect Platform)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Unternehmer A (Stripe Express Account)                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │  │
│  │  │ Kunde 1  │  │ Kunde 2  │  │ Kunde 3  │              │  │
│  │  │  €45,00  │  │  €67,50  │  │  €120,00 │              │  │
│  │  └──────────┘  └──────────┘  └──────────┘              │  │
│  │       │              │              │                    │  │
│  │       └──────────────┴──────────────┘                    │  │
│  │                   │                                      │  │
│  │            Stripe Connect                                │  │
│  │         (Zahlung geht direkt                             │  │
│  │          an Unternehmer A)                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  MyDispatch erhält Platform-Fee (2% optional)                  │
└─────────────────────────────────────────────────────────────────┘
```

### Konzept: Jeder Unternehmer = Eigener Stripe-Account

**WICHTIG:** MyDispatch speichert **KEINE** Payment-Daten zentral!  
Jeder Unternehmer benötigt einen **eigenen Stripe Express Account**.

### Datenbank-Schema (Erweiterung)

```sql
-- companies Tabelle erweitern
ALTER TABLE companies ADD COLUMN stripe_connect_account_id TEXT;
ALTER TABLE companies ADD COLUMN stripe_connect_onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE companies ADD COLUMN stripe_connect_charges_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE companies ADD COLUMN stripe_connect_payouts_enabled BOOLEAN DEFAULT FALSE;
```

### Onboarding-Flow

#### 1. Stripe Connect Account erstellen

```typescript
// Edge Function: supabase/functions/create-stripe-connect-account/index.ts
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

export default async (req: Request) => {
  const { companyId, email, businessName } = await req.json();
  
  // 1. Stripe Express Account erstellen
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'DE',
    email: email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: 'company',
    company: {
      name: businessName,
    },
  });
  
  // 2. Onboarding-Link generieren
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${req.headers.get('origin')}/einstellungen/payments`,
    return_url: `${req.headers.get('origin')}/einstellungen/payments?success=true`,
    type: 'account_onboarding',
  });
  
  // 3. Account-ID in Datenbank speichern
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
  
  await supabase
    .from('companies')
    .update({
      stripe_connect_account_id: account.id,
      stripe_connect_onboarding_completed: false,
    })
    .eq('id', companyId);
  
  return { onboardingUrl: accountLink.url };
};
```

**Frontend-Integration:**
```typescript
// src/pages/Einstellungen.tsx
const startStripeOnboarding = async () => {
  const { data } = await supabase.functions.invoke('create-stripe-connect-account', {
    body: {
      companyId: company.id,
      email: company.email,
      businessName: company.name,
    }
  });
  
  if (data?.onboardingUrl) {
    window.location.href = data.onboardingUrl; // Redirect zu Stripe
  }
};
```

#### 2. Onboarding-Status prüfen

```typescript
// Edge Function: supabase/functions/check-stripe-connect-status/index.ts
export default async (req: Request) => {
  const { accountId } = await req.json();
  
  const account = await stripe.accounts.retrieve(accountId);
  
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
  
  // Update Status in Datenbank
  await supabase
    .from('companies')
    .update({
      stripe_connect_onboarding_completed: account.details_submitted,
      stripe_connect_charges_enabled: account.charges_enabled,
      stripe_connect_payouts_enabled: account.payouts_enabled,
    })
    .eq('stripe_connect_account_id', accountId);
  
  return {
    onboardingCompleted: account.details_submitted,
    chargesEnabled: account.charges_enabled,
    payoutsEnabled: account.payouts_enabled,
  };
};
```

### Zahlung erstellen (Kunde → Unternehmer)

#### 1. Payment Intent erstellen

```typescript
// Edge Function: supabase/functions/create-payment-intent/index.ts
export default async (req: Request) => {
  const { amount, bookingId, companyId } = await req.json();
  
  // 1. Stripe Connect Account-ID aus Datenbank holen
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
  
  const { data: company } = await supabase
    .from('companies')
    .select('stripe_connect_account_id, stripe_connect_charges_enabled')
    .eq('id', companyId)
    .single();
  
  if (!company?.stripe_connect_charges_enabled) {
    throw new Error('Stripe-Zahlungen nicht aktiviert');
  }
  
  // 2. Payment Intent mit Connect Account erstellen
  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: Math.round(amount * 100), // Cents!
      currency: 'eur',
      payment_method_types: ['card', 'sepa_debit'],
      metadata: {
        booking_id: bookingId,
        company_id: companyId,
      },
      // Optional: Platform-Fee (2% für MyDispatch)
      application_fee_amount: Math.round(amount * 100 * 0.02),
    },
    {
      stripeAccount: company.stripe_connect_account_id, // WICHTIG!
    }
  );
  
  return {
    clientSecret: paymentIntent.client_secret,
  };
};
```

#### 2. Frontend: Stripe Elements Integration

```typescript
// src/components/booking/PaymentForm.tsx
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function PaymentForm({ bookingId, amount }: { bookingId: string; amount: number }) {
  const [clientSecret, setClientSecret] = useState('');
  
  useEffect(() => {
    // Payment Intent erstellen
    supabase.functions.invoke('create-payment-intent', {
      body: { amount, bookingId, companyId: profile.company_id }
    }).then(({ data }) => {
      setClientSecret(data.clientSecret);
    });
  }, []);
  
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm bookingId={bookingId} />
    </Elements>
  );
}

function CheckoutForm({ bookingId }: { bookingId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/auftraege?payment_success=true`,
      },
    });
    
    if (error) {
      handleError(error, 'Zahlung fehlgeschlagen');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" disabled={!stripe}>
        {formatCurrency(amount)} bezahlen
      </Button>
    </form>
  );
}
```

### Dashboard-Link (Unternehmer-View)

```typescript
// Edge Function: supabase/functions/create-stripe-dashboard-link/index.ts
export default async (req: Request) => {
  const { accountId } = await req.json();
  
  const loginLink = await stripe.accounts.createLoginLink(accountId);
  
  return { dashboardUrl: loginLink.url };
};
```

**Frontend:**
```typescript
// src/pages/Einstellungen.tsx
const openStripeDashboard = async () => {
  const { data } = await supabase.functions.invoke('create-stripe-dashboard-link', {
    body: { accountId: company.stripe_connect_account_id }
  });
  
  if (data?.dashboardUrl) {
    window.open(data.dashboardUrl, '_blank');
  }
};
```

---

## 🔄 SYSTEMWEITE INTEGRATION

### 1. Booking-Workflow mit Payment

```typescript
// src/pages/Auftraege.tsx
const handleBookingSubmit = async (formData) => {
  // 1. Auftrag erstellen
  const { data: booking } = await supabase
    .from('bookings')
    .insert({
      ...formData,
      payment_status: 'pending',
      payment_method: 'stripe',
    })
    .select()
    .single();
  
  // 2. Payment Intent erstellen (falls Online-Zahlung)
  if (formData.payment_method === 'stripe') {
    const { data: paymentData } = await supabase.functions.invoke('create-payment-intent', {
      body: {
        amount: formData.price,
        bookingId: booking.id,
        companyId: profile.company_id,
      }
    });
    
    // 3. Redirect zu Payment-Seite
    navigate(`/payment/${booking.id}?client_secret=${paymentData.clientSecret}`);
  }
};
```

### 2. Webhook für Payment-Confirmation

```typescript
// supabase/functions/stripe-connect-webhook/index.ts
export default async (req: Request) => {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();
  
  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    Deno.env.get('STRIPE_CONNECT_WEBHOOK_SECRET')!
  );
  
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const bookingId = paymentIntent.metadata.booking_id;
    
    // Update booking payment_status
    await supabase
      .from('bookings')
      .update({
        payment_status: 'paid',
        payment_stripe_intent_id: paymentIntent.id,
      })
      .eq('id', bookingId);
    
    // Sende Bestätigungs-E-Mail
    await supabase.functions.invoke('send-email', {
      body: {
        template: 'bookingConfirmationTemplate',
        to: customerEmail,
        bookingId,
      }
    });
  }
  
  return new Response('OK', { status: 200 });
};
```

---

## 💰 GEBÜHREN & KOSTEN

### Stripe-Gebühren (Deutschland)

| Typ | Gebühr |
|-----|--------|
| Kreditkarte (EU) | 1,4% + 0,25€ |
| SEPA-Lastschrift | 0,35% (min. 0,25€) |
| Stripe Connect Platform-Fee | +2% (optional für MyDispatch) |
| Auszahlung | Kostenlos |

**Beispiel:**
- Auftrag: 100,00€
- Stripe-Gebühr: 1,40€ + 0,25€ = 1,65€
- Platform-Fee (MyDispatch): 2,00€
- **Unternehmer erhält: 96,35€**

---

## 🛡️ SECURITY & COMPLIANCE

### PCI-DSS Compliance

✅ **MyDispatch ist PCI-DSS-konform**, da:
- KEINE Kartendaten auf MyDispatch-Servern gespeichert werden
- Stripe Elements iframe verwendet wird (Stripe handet PCI-DSS)
- Payment Intents Server-Side erstellt werden

### DSGVO-Compliance

✅ **DSGVO-konform**, da:
- Zahlungsdaten bei Stripe gespeichert (EU-Server)
- Unternehmer = eigener Stripe-Account = eigener Data-Controller
- MyDispatch = nur Platform-Provider (Data-Processor)

---

## 📋 CHECKLISTE: STRIPE CONNECT AKTIVIERUNG

### Für MyDispatch (Einmalig)

- [ ] Stripe Platform Account erstellen
- [ ] Connect Onboarding aktivieren
- [ ] Webhook-Endpoints konfigurieren
- [ ] Platform-Fee festlegen (0-2%)
- [ ] Edge Functions deployen

### Für jeden Unternehmer

- [ ] Stripe Express Account erstellen
- [ ] Onboarding-Link generieren
- [ ] Unternehmer schließt Onboarding ab (Stripe-UI)
- [ ] Status prüfen (charges_enabled = true?)
- [ ] Erste Test-Zahlung durchführen
- [ ] Dashboard-Link bereitstellen

---

## 🔗 EXTERNE RESSOURCEN

- **Stripe Connect Docs:** https://stripe.com/docs/connect
- **Express Account Setup:** https://stripe.com/docs/connect/express-accounts
- **Payment Intents:** https://stripe.com/docs/payments/payment-intents
- **Webhooks:** https://stripe.com/docs/webhooks
- **Elements:** https://stripe.com/docs/stripe-js

---

**Version:** V18.5.0  
**Nächstes Update:** Q2 2025 (Platform-Fee Optimierung)