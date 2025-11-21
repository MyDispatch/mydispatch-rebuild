# MyDispatch API Documentation

Comprehensive API reference for MyDispatch V33.4 - Taxi & Limousine Dispatch Management System.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Authentication](#authentication)
- [Core Hooks API](#core-hooks-api)
- [Supabase Integration](#supabase-integration)
- [Edge Functions](#edge-functions)
- [Design System Components](#design-system-components)
- [Error Handling](#error-handling)
- [Real-time Subscriptions](#real-time-subscriptions)

---

## 🏗️ Architecture Overview

### Tech Stack

- **Frontend:** React 18.3 + TypeScript 5.8 + Vite 5.4
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **State Management:** TanStack Query v5 + Zustand
- **UI Framework:** Tailwind CSS 3.4 + shadcn/ui + Design System V28.1
- **Real-time:** Supabase Realtime (WebSocket)
- **Deployment:** Vercel (Frontend) + Supabase (Backend)

### Project Structure

```
mydispatch-rebuild/
├── src/
│   ├── hooks/                      # React Hooks (API Layer)
│   │   ├── api/                    # API Hooks (useBookings, useCustomers, etc.)
│   │   ├── use-auth.tsx            # Authentication Hook
│   │   └── use-realtime-*.tsx      # Real-time Subscription Hooks
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts           # ✅ Centralized Supabase Client
│   │       └── types.ts            # Generated Database Types
│   ├── lib/
│   │   ├── error-handler.ts        # Centralized Error Handling
│   │   └── logger.ts               # Logging Utility
│   └── components/
│       └── design-system/          # V28.1 Design System Components
└── supabase/
    ├── functions/                  # Edge Functions (100+)
    └── migrations/                 # Database Migrations
```

---

## 🔐 Authentication

### useAuth Hook

Central authentication hook managing user session, company context, and permissions.

#### API Reference

```typescript
import { useAuth } from "@/hooks/use-auth";

const {
  user, // Current user object (Supabase User)
  company, // Current company object
  profile, // User profile with company_id
  session, // Supabase session
  isLoading, // Loading state
  error, // Error object (if any)
  signIn, // Sign in function
  signUp, // Sign up function
  signOut, // Sign out function
  updateProfile, // Update user profile
} = useAuth();
```

#### Usage Example

```typescript
function ProtectedComponent() {
  const { user, company, isLoading, signOut } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth" />;

  return (
    <div>
      <h1>Willkommen, {user.email}</h1>
      <p>Unternehmen: {company?.name}</p>
      <button onClick={signOut}>Abmelden</button>
    </div>
  );
}
```

#### Master Account

```typescript
const isMasterAccount = user?.email === "courbois1981@gmail.com";

if (isMasterAccount) {
  // Access to /master route and special features
}
```

---

## 🪝 Core Hooks API

### useBookings

Manages booking/dispatch CRUD operations with company scoping.

#### API Reference

```typescript
import { useBookings } from "@/hooks/use-bookings";

const {
  bookings, // Booking[] - Company-scoped bookings
  isLoading, // boolean
  error, // Error | null
  refetch, // () => void - Refetch data
  createBooking, // (data: BookingInput) => Promise<Booking>
  updateBooking, // (id: string, data: Partial<Booking>) => Promise<Booking>
  deleteBooking, // (id: string) => Promise<void>
  archiveBooking, // (id: string) => Promise<void> - Soft delete
} = useBookings();
```

#### Usage Example

```typescript
function BookingList() {
  const { bookings, isLoading, createBooking } = useBookings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateBooking = async (data: BookingInput) => {
    try {
      await createBooking(data);
      handleSuccess("Auftrag erstellt");
      setIsDialogOpen(false);
    } catch (error) {
      handleError(error, "Fehler beim Erstellen");
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!bookings.length) return <EmptyState icon={FileText} title="Keine Aufträge" />;

  return (
    <>
      <BookingTable bookings={bookings} />
      <NewBookingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSubmit={handleCreateBooking} />
    </>
  );
}
```

### useCustomers

Manages customer data with validation and deduplication.

#### API Reference

```typescript
import { useCustomers } from "@/hooks/use-customers";

const {
  customers, // Customer[] - Company-scoped customers
  isLoading,
  error,
  refetch,
  createCustomer, // (data: CustomerInput) => Promise<Customer>
  updateCustomer, // (id: string, data: Partial<Customer>) => Promise<Customer>
  deleteCustomer, // (id: string) => Promise<void>
  archiveCustomer, // (id: string) => Promise<void>
  findDuplicates, // (email: string) => Promise<Customer[]>
} = useCustomers();
```

#### Deduplication Example

```typescript
function CustomerForm() {
  const { customers, createCustomer, findDuplicates } = useCustomers();
  const [email, setEmail] = useState("");
  const [duplicates, setDuplicates] = useState<Customer[]>([]);

  const handleEmailBlur = async () => {
    const dups = await findDuplicates(email);
    if (dups.length > 0) {
      setDuplicates(dups);
      toast.warning(`${dups.length} ähnliche Kunden gefunden`);
    }
  };

  return (
    <form>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailBlur} />
      {duplicates.length > 0 && <DuplicateWarning customers={duplicates} />}
    </form>
  );
}
```

### useVehicles

Manages fleet vehicles with GPS tracking integration.

#### API Reference

```typescript
import { useVehicles } from "@/hooks/use-vehicles";

const {
  vehicles, // Vehicle[] - Company vehicles
  isLoading,
  error,
  refetch,
  createVehicle, // (data: VehicleInput) => Promise<Vehicle>
  updateVehicle, // (id: string, data: Partial<Vehicle>) => Promise<Vehicle>
  deleteVehicle, // (id: string) => Promise<void>
  assignDriver, // (vehicleId: string, driverId: string) => Promise<void>
  unassignDriver, // (vehicleId: string) => Promise<void>
} = useVehicles();
```

### useInvoices

Manages invoicing with export capabilities (PDF/Excel).

#### API Reference

```typescript
import { useInvoices } from "@/hooks/use-invoices";

const {
  invoices, // Invoice[] - Company invoices
  isLoading,
  error,
  refetch,
  createInvoice, // (data: InvoiceInput) => Promise<Invoice>
  updateInvoice, // (id: string, data: Partial<Invoice>) => Promise<Invoice>
  markAsPaid, // (id: string) => Promise<void>
  sendInvoice, // (id: string) => Promise<void> - Email invoice
  exportToPDF, // (id: string) => Promise<Blob>
  exportToExcel, // (ids: string[]) => Promise<Blob>
} = useInvoices();
```

---

## 🗄️ Supabase Integration

### Centralized Client

**ALWAYS** use the centralized Supabase client - **NEVER** create new instances.

```typescript
// ✅ CORRECT
import { supabase } from "@/integrations/supabase/client";

const { data, error } = await supabase.from("bookings").select("*").eq("company_id", companyId);

// ❌ WRONG - Security violation
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(url, SERVICE_ROLE_KEY); // FORBIDDEN in frontend
```

### Multi-Tenant Pattern

All queries MUST include `company_id` scoping for security.

```typescript
// ✅ CORRECT - Company-scoped query
const { data, error } = await supabase
  .from("customers")
  .select("*")
  .eq("company_id", companyId) // ⚠️ MANDATORY
  .order("created_at", { ascending: false });

if (error) throw error;
return data || [];

// ❌ WRONG - Security violation (RLS will block)
const { data } = await supabase.from("customers").select("*");
```

### RLS Policies

All tables have Row Level Security (RLS) policies enforcing company isolation.

**Example Policy:**

```sql
CREATE POLICY "Users can view own company data"
ON bookings FOR SELECT
USING (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));
```

### Soft Delete Pattern

Use `archived` flag instead of hard deletes.

```typescript
// ✅ CORRECT - Soft delete
await supabase
  .from("customers")
  .update({
    archived: true,
    archived_at: new Date().toISOString(),
    archived_by: user.id,
  })
  .eq("id", customerId);

// ❌ WRONG - Hard delete (audit trail lost)
await supabase.from("customers").delete().eq("id", customerId);
```

---

## ⚡ Edge Functions

100+ Deno-based Edge Functions deployed on Supabase.

### Calling Edge Functions

```typescript
import { supabase } from "@/integrations/supabase/client";

// Example: Send booking confirmation email
const { data, error } = await supabase.functions.invoke("send-booking-email", {
  body: {
    booking_id: "abc-123",
    recipient: "customer@example.com",
    template: "booking_confirmation",
  },
});

if (error) {
  console.error("Edge Function error:", error);
  throw error;
}

console.log("Email sent:", data);
```

### Key Edge Functions

#### Email Functions

- `send-booking-email` - Booking confirmation emails
- `send-template-email` - Generic templated emails
- `send-invoice-email` - Invoice delivery

#### AI Functions

- `ai-smart-assignment` - AI-powered driver assignment
- `ai-support-chat` - Customer support chatbot
- `ai-migration-orchestrator` - Autonomous code migration

#### Automation Functions

- `daily-health-check` - System health monitoring (runs 06:00 daily)
- `cleanup-gps-positions` - Auto-delete GPS data >24h (runs 12:00 daily)
- `auto-fix-issues` - Self-healing system issues
- `brain-query` - Knowledge base queries

#### Integration Functions

- `get-here-api-key` - Secure HERE Maps API key retrieval
- `create-checkout` - Stripe payment checkout
- `check-subscription` - Subscription validation

### Error Response Pattern

All Edge Functions return consistent error format:

```typescript
// Success response
{
  "success": true,
  "data": { /* ... */ }
}

// Error response
{
  "success": false,
  "error": "Validation failed",
  "details": { /* ... */ }
}
```

---

## 🎨 Design System Components

### V28 Button

```typescript
import { V28Button } from "@/components/design-system/V28Button";

<V28Button variant="primary" size="lg" onClick={handleClick}>
  Speichern
</V28Button>

// Variants: primary, secondary, destructive, outline, ghost
// Sizes: xs, sm, default, lg, xl
```

### V28 Card

```typescript
import { V28Card } from "@/components/design-system/V28Card";

<V28Card title="KPI Übersicht" description="Aktuelle Statistiken" icon={TrendingUp}>
  <div>Card content</div>
</V28Card>
```

### V28 Badge

```typescript
import { V28Badge } from "@/components/design-system/V28Badge";

<V28Badge variant="success">Aktiv</V28Badge>
<V28Badge variant="error">Inaktiv</V28Badge>
<V28Badge variant="warning">Ausstehend</V28Badge>

// Variants: info, success, error, warning, accent
```

### Semantic Color Tokens

```typescript
// ✅ ALWAYS use semantic tokens
<div className="bg-info-light text-info-text border-info-border">Info</div>
<div className="bg-success-light text-success-text">Success</div>
<div className="bg-error-light text-error-text">Error</div>
<div className="bg-warning-light text-warning-text">Warning</div>

// ❌ NEVER use direct Tailwind colors
<div className="bg-blue-50 text-blue-700">Wrong</div>
```

---

## 🚨 Error Handling

### handleError Utility

Centralized error handling with toast notifications and logging.

```typescript
import { handleError, handleSuccess } from "@/lib/error-handler";

try {
  const result = await riskyOperation();
  handleSuccess("Operation erfolgreich");
  return result;
} catch (error) {
  handleError(error, "Operation fehlgeschlagen", {
    showToast: true, // Show user notification
    logToSupabase: true, // Log to error_logs table
    context: {
      // Additional context for debugging
      userId: user.id,
      operation: "createBooking",
    },
  });
  throw error; // Re-throw if needed
}
```

### Error Logging

Errors are automatically logged to `error_logs` table:

```typescript
{
  id: "uuid",
  error_message: "Failed to create booking",
  error_stack: "Error: ...",
  user_id: "user-uuid",
  company_id: "company-uuid",
  severity: "error",  // info, warning, error, critical
  context: { /* custom data */ },
  created_at: "2025-01-21T..."
}
```

---

## 📡 Real-time Subscriptions

### useRealtimeBookings

Live updates for bookings table.

```typescript
import { useRealtimeBookings } from "@/hooks/use-realtime-bookings";

function LiveBookingsList() {
  const { bookings, isConnected } = useRealtimeBookings({
    onInsert: (booking) => toast.info(`Neuer Auftrag: ${booking.id}`),
    onUpdate: (booking) => console.log("Auftrag aktualisiert:", booking),
    onDelete: (booking) => console.log("Auftrag gelöscht:", booking),
  });

  return (
    <>
      {isConnected && <LiveIndicator />}
      <BookingTable bookings={bookings} />
    </>
  );
}
```

### useRealtimeDrivers

Live driver/shift status updates.

```typescript
import { useRealtimeDrivers } from "@/hooks/use-realtime-drivers";

function LiveDriverMap() {
  const { drivers, isConnected } = useRealtimeDrivers({
    onUpdate: (driver) => {
      // Update map marker position
      updateMarker(driver.id, driver.last_position);
    },
  });

  return <MapComponent drivers={drivers} />;
}
```

### Subscription Pattern

```typescript
// Automatic cleanup on unmount
useEffect(() => {
  const channel = supabase
    .channel("bookings-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookings",
        filter: `company_id=eq.${companyId}`, // ⚠️ Company-scoped
      },
      (payload) => {
        console.log("Change received:", payload);
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
      }
    )
    .subscribe();

  // ⚠️ MANDATORY cleanup
  return () => {
    supabase.removeChannel(channel);
  };
}, [companyId]);
```

---

## 📊 Query Patterns

### TanStack Query Configuration

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query with caching
const { data, isLoading, error } = useQuery({
  queryKey: ["customers", companyId], // [entity, scope]
  queryFn: fetchCustomers,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

// Mutation with optimistic updates
const mutation = useMutation({
  mutationFn: createCustomer,
  onMutate: async (newCustomer) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["customers"] });

    // Snapshot previous value
    const previousCustomers = queryClient.getQueryData(["customers"]);

    // Optimistically update cache
    queryClient.setQueryData(["customers"], (old: Customer[]) => [...old, newCustomer]);

    return { previousCustomers };
  },
  onError: (err, newCustomer, context) => {
    // Rollback on error
    queryClient.setQueryData(["customers"], context?.previousCustomers);
  },
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ["customers"] });
  },
});
```

---

## 🔗 Related Documentation

- **[Supabase Backend Audit](./SUPABASE_BACKEND_AUDIT.md)** - Database schema & RLS policies
- **[Design System V28.1](./DESIGN_SYSTEM_DOCUMENTATION_V28.1_FINAL.md)** - Component library
- **[Security Best Practices](./guides/SECURITY_BEST_PRACTICES.md)** - Security guidelines
- **[Defensive Coding Standards](../DEFENSIVE_CODING_STANDARDS.md)** - Code quality rules

---

**Version:** V33.4
**Last Updated:** 2025-01-21
**Maintained by:** NeXify Team
