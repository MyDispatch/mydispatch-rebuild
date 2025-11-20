# 🌿 API MIGRATION TEMPLATE (STRANGLER FIG PATTERN)

**Version**: 1.0  
**Source**: neXify SOL INVICTUS v21.0 - MISSION II (STRANGLER FIG 2.0)  
**Applicability**: React projects with direct backend calls (Supabase, Firebase, REST APIs)

---

## 📘 CONTEXT

This template provides a systematic approach to migrate direct backend calls to a modern API layer using TanStack Query (React Query), following the **Strangler Fig Pattern** for zero-downtime migrations.

---

## 🎯 OBJECTIVE

Replace all direct backend calls with:

- ✅ TanStack Query hooks for data fetching
- ✅ Centralized error handling
- ✅ Optimized caching strategies
- ✅ Type-safe API clients
- ✅ Consistent patterns across codebase

---

## 📚 PREREQUISITES

### Required Dependencies

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.83.0",
    "@supabase/supabase-js": "^2.75.0"
  }
}
```

### Project Structure

```
src/
├── lib/
│   ├── api/
│   │   ├── index.ts           # API Client Factory
│   │   ├── bookings.ts        # Domain-specific API module
│   │   └── types.ts           # Shared types
│   └── react-query/
│       ├── query-keys.ts      # Centralized query keys
│       └── query-options.ts   # Reusable query configs
└── hooks/
    └── use-[domain].ts        # Domain-specific hooks
```

---

## 🛠️ STEP-BY-STEP MIGRATION GUIDE

### Step 1: Identify Components to Migrate

**Prompt to AI**:

```
Scan the codebase for all direct backend calls (Supabase, Firebase, fetch, axios):

1. Search for patterns:
   - `supabase.from('table').select()`
   - `supabase.from('table').insert()`
   - `fetch('/api/...')`
   - `axios.get(...)`

2. Classify by priority:
   - P0: Critical user-facing features (auth, checkout, data display)
   - P1: Important features (audit logs, analytics)
   - P2: Infrastructure (monitoring, cleanup jobs)

3. Output a migration plan with estimated effort.
```

**Expected Output**:

```markdown
| Component          | Current Call                         | Priority | Estimated Effort |
| ------------------ | ------------------------------------ | -------- | ---------------- |
| BookingList.tsx    | supabase.from('bookings').select()   | P0       | 30 min           |
| DocumentUpload.tsx | supabase.from('documents').insert()  | P0       | 20 min           |
| AuditLogger.tsx    | supabase.from('audit_logs').insert() | P1       | 15 min           |
```

---

### Step 2: Create Centralized Query Keys

**Prompt to AI**:

```
Create a centralized query key system in `src/lib/react-query/query-keys.ts`:

1. Define query keys for all domains (bookings, users, documents, etc.)
2. Use factory functions for parameterized queries
3. Ensure type safety
```

**File**: `src/lib/react-query/query-keys.ts`

```typescript
export const queryKeys = {
  // Bookings
  bookings: (companyId?: string) => ["bookings", companyId] as const,
  booking: (id: string) => ["bookings", id] as const,

  // Users
  users: (companyId?: string) => ["users", companyId] as const,
  user: (id: string) => ["users", id] as const,

  // Documents
  documents: (companyId?: string) => ["documents", companyId] as const,
  document: (id: string) => ["documents", id] as const,

  // Stats
  stats: (companyId?: string) => ["stats", companyId] as const,
};

export const invalidateQueries = {
  bookings: (queryClient: QueryClient, companyId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings(companyId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.stats(companyId) });
  },
};
```

---

### Step 3: Create API Client Factory

**Prompt to AI**:

```
Create an API client factory in `src/lib/api/index.ts`:

1. Wrap Supabase client in a typed API layer
2. Support method chaining (e.g., `api.bookings.list()`)
3. Centralize error handling
4. Type-safe return values
```

**File**: `src/lib/api/index.ts`

```typescript
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

export type BookingWithRelations = Database["public"]["Tables"]["bookings"]["Row"] & {
  driver?: Database["public"]["Tables"]["profiles"]["Row"];
  vehicle?: Database["public"]["Tables"]["vehicles"]["Row"];
};

export function createApiClient(supabase: SupabaseClient<Database>) {
  return {
    bookings: {
      async list(): Promise<BookingWithRelations[]> {
        const { data, error } = await supabase
          .from("bookings")
          .select(
            `
            *,
            driver:profiles!driver_id(id, full_name, email),
            vehicle:vehicles(id, license_plate, model)
          `
          )
          .eq("archived", false)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data as BookingWithRelations[];
      },

      async create(booking: Partial<BookingWithRelations>) {
        const { data, error } = await supabase.from("bookings").insert(booking).select().single();

        if (error) throw error;
        return data;
      },

      async update(id: string, updates: Partial<BookingWithRelations>) {
        const { data, error } = await supabase
          .from("bookings")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return data;
      },

      async archive(id: string) {
        const { error } = await supabase.from("bookings").update({ archived: true }).eq("id", id);

        if (error) throw error;
      },
    },
  };
}
```

---

### Step 4: Create Domain Hook

**Prompt to AI**:

```
Create a hook for the [domain] using TanStack Query:

1. Use `useQuery` for data fetching
2. Use `useMutation` for data modifications
3. Integrate with API client from `src/lib/api/index.ts`
4. Use query keys from `src/lib/react-query/query-keys.ts`
5. Handle optimistic updates where appropriate
6. Include error handling and success toasts
```

**File**: `src/hooks/use-bookings.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { createApiClient, BookingWithRelations } from "@/lib/api";
import { useAuth } from "./use-auth";
import { queryKeys } from "@/lib/react-query/query-keys";
import { toast } from "sonner";
import { useMemo } from "react";

export const useBookings = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const api = useMemo(() => createApiClient(supabase), []);

  // Fetch bookings
  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery<BookingWithRelations[]>({
    queryKey: queryKeys.bookings(profile?.company_id),
    queryFn: async () => {
      if (!profile?.company_id) return [];
      return await api.bookings.list();
    },
    enabled: !!profile?.company_id,
    staleTime: 30000, // 30 seconds
  });

  // Create booking
  const createMutation = useMutation({
    mutationFn: async (booking: Partial<BookingWithRelations>) => {
      if (!profile?.company_id) throw new Error("No company ID");
      return await api.bookings.create({
        ...booking,
        company_id: profile.company_id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings(profile!.company_id!) });
      toast.success("Booking created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create booking");
      console.error(error);
    },
  });

  // Update booking
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BookingWithRelations> }) => {
      return await api.bookings.update(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings(profile!.company_id!) });
      toast.success("Booking updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update booking");
      console.error(error);
    },
  });

  // Archive booking
  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.bookings.archive(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings(profile!.company_id!) });
      toast.success("Booking archived");
    },
    onError: (error) => {
      toast.error("Failed to archive booking");
      console.error(error);
    },
  });

  return {
    bookings: bookings || [],
    isLoading,
    error,
    createBooking: createMutation.mutate,
    updateBooking: updateMutation.mutate,
    archiveBooking: archiveMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isArchiving: archiveMutation.isPending,
  };
};
```

---

### Step 5: Migrate Component

**Before (Direct Supabase Calls)**:

```typescript
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

export function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('archived', false);

      if (error) {
        console.error(error);
        return;
      }
      setBookings(data);
      setLoading(false);
    }
    fetchBookings();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {bookings.map(booking => (
        <div key={booking.id}>{booking.title}</div>
      ))}
    </div>
  );
}
```

**After (TanStack Query Hook)**:

```typescript
import { useBookings } from '@/hooks/use-bookings';

export function BookingList() {
  const { bookings, isLoading } = useBookings();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {bookings.map(booking => (
        <div key={booking.id}>{booking.title}</div>
      ))}
    </div>
  );
}
```

---

### Step 6: Handle Mutations

**Before (Direct Insert)**:

```typescript
const handleSubmit = async (data: BookingData) => {
  const { error } = await supabase.from("bookings").insert(data);

  if (error) {
    toast.error("Failed to create booking");
    return;
  }
  toast.success("Booking created");
};
```

**After (Mutation Hook)**:

```typescript
const { createBooking, isCreating } = useBookings();

const handleSubmit = (data: BookingData) => {
  createBooking(data);
};
```

---

## ✅ VALIDATION CHECKLIST

After migration, verify:

- [ ] All direct backend calls removed
- [ ] TanStack Query hooks used consistently
- [ ] Query keys centralized
- [ ] Error handling consistent
- [ ] Loading states handled
- [ ] Optimistic updates where appropriate
- [ ] Cache invalidation working correctly
- [ ] TypeScript types correct
- [ ] No console errors
- [ ] Performance improved (check Network tab)

---

## 🚀 ADVANCED PATTERNS

### Optimistic Updates

```typescript
const updateMutation = useMutation({
  mutationFn: api.bookings.update,
  onMutate: async (newBooking) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries({ queryKey: queryKeys.bookings() });

    // Snapshot previous value
    const previousBookings = queryClient.getQueryData(queryKeys.bookings());

    // Optimistically update
    queryClient.setQueryData(queryKeys.bookings(), (old) =>
      old.map((b) => (b.id === newBooking.id ? { ...b, ...newBooking } : b))
    );

    return { previousBookings };
  },
  onError: (err, newBooking, context) => {
    // Rollback on error
    queryClient.setQueryData(queryKeys.bookings(), context.previousBookings);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings() });
  },
});
```

### Prefetching

```typescript
const prefetchBooking = (id: string) => {
  queryClient.prefetchQuery({
    queryKey: queryKeys.booking(id),
    queryFn: () => api.bookings.getById(id),
  });
};
```

---

## 📈 EXPECTED OUTCOMES

After migration:

- ✅ 50% reduction in loading spinners (better caching)
- ✅ 30% faster perceived performance (optimistic updates)
- ✅ 80% reduction in error-related bugs (centralized error handling)
- ✅ 100% type safety (TypeScript integration)
- ✅ Easier testing (mock API client instead of Supabase)

---

## 🔧 TROUBLESHOOTING

### Issue: Stale data after mutation

**Solution**: Ensure `queryClient.invalidateQueries()` is called in `onSuccess`

### Issue: Infinite loading state

**Solution**: Check `enabled` condition in `useQuery` options

### Issue: TypeScript errors

**Solution**: Ensure API client return types match Supabase schema types

---

**Template Version**: 1.0  
**Last Updated**: 2025-01-31  
**Maintained By**: neXify AI Team
