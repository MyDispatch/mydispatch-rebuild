# 🔥 MISSION II: STRANGLER FIG 2.0 - API LAYER MIGRATION

**Codename:** STRANGLER FIG 2.0  
**Status:** 📋 PLANNING  
**Complexity:** CRITICAL  
**Impact:** 159 Files  
**Strategy:** Incremental Batch Migration

---

## 🎯 MISSION OBJECTIVE

**Eliminate direct Supabase imports** in application code and establish a clean API layer with TanStack Query (React Query).

**Current State:**

- ❌ 159 files import Supabase directly
- ❌ No unified API layer
- ❌ No centralized error handling
- ❌ No consistent loading states
- ❌ No optimistic updates

**Target State:**

- ✅ Zero direct Supabase imports in UI components
- ✅ Unified API layer (`src/api/`)
- ✅ TanStack Query for all data fetching
- ✅ Centralized error handling
- ✅ Consistent loading states
- ✅ Optimistic updates where needed

---

## 📊 CURRENT ANALYSIS

### File Distribution

```
159 files with direct Supabase imports:
- src/components/: ~80 files
- src/hooks/: ~40 files
- src/pages/: ~30 files
- src/config/: ~9 files
```

### Critical Clusters (Prioritized)

| Cluster       | Files | Priority | Business Impact |
| ------------- | ----- | -------- | --------------- |
| Bookings      | ~25   | P0       | Core Business   |
| Customers     | ~15   | P0       | Core Business   |
| Drivers       | ~12   | P0       | Core Business   |
| Vehicles      | ~10   | P0       | Core Business   |
| Dashboard     | ~20   | P1       | High Visibility |
| Settings      | ~15   | P1       | Configuration   |
| Chat/Messages | ~12   | P2       | Communication   |
| Documents     | ~10   | P2       | Compliance      |
| Others        | ~40   | P3       | Utilities       |

---

## 🚀 MIGRATION STRATEGY

### Phase 0: Infrastructure Setup (1-2h)

**Deliverables:**

1. `src/api/base.ts` - Base API configuration
2. `src/api/types.ts` - Shared types
3. `src/api/bookings.ts` - Example API module
4. `src/hooks/api/useBookings.ts` - Example React Query hooks

**Infrastructure Pattern:**

```typescript
// src/api/base.ts
import { supabase } from "@/integrations/supabase/client";

export const api = {
  bookings: {
    getAll: async () => supabase.from("bookings").select("*"),
    getById: async (id: string) => supabase.from("bookings").select("*").eq("id", id).single(),
    create: async (data: any) => supabase.from("bookings").insert(data),
    update: async (id: string, data: any) => supabase.from("bookings").update(data).eq("id", id),
    delete: async (id: string) => supabase.from("bookings").delete().eq("id", id),
  },
};

// src/hooks/api/useBookings.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/api/base";

export const useBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: api.bookings.getAll,
  });
};
```

### Phase 1: Pilot Migration - Bookings Cluster (2-3h)

**Target:** 25 files in Bookings cluster

**Steps:**

1. Create `src/api/bookings.ts`
2. Create `src/hooks/api/useBookings.ts`
3. Migrate components one-by-one:
   - `NewBookingDialog.tsx`
   - `BookingsTable.tsx`
   - `BookingDetailDialog.tsx`
   - etc.
4. Test thoroughly
5. Document learnings

**Success Criteria:**

- ✅ Zero direct Supabase imports in migrated files
- ✅ All CRUD operations working
- ✅ Loading states implemented
- ✅ Error handling implemented
- ✅ Zero breaking changes
- ✅ Tests passing

### Phase 2: Scale - Customers & Drivers (3-4h)

**Target:** 27 files (Customers: 15, Drivers: 12)

**Parallel Execution:**

- Create `src/api/customers.ts` + hooks
- Create `src/api/drivers.ts` + hooks
- Migrate components in batches of 5

### Phase 3: Scale - Vehicles & Dashboard (3-4h)

**Target:** 30 files (Vehicles: 10, Dashboard: 20)

### Phase 4: Remaining Clusters (4-6h)

**Target:** 77 files (Settings, Chat, Documents, Others)

---

## 🔧 MIGRATION PATTERNS

### Pattern 1: Component with useQuery

```typescript
// ❌ BEFORE (Direct Supabase)
import { supabase } from "@/integrations/supabase/client";

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("bookings").select("*");
      setData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // ...
};

// ✅ AFTER (API Layer + React Query)
import { useBookings } from "@/hooks/api/useBookings";

const MyComponent = () => {
  const { data, isLoading } = useBookings();

  // ...
};
```

### Pattern 2: Component with useMutation

```typescript
// ❌ BEFORE
const handleCreate = async (data: any) => {
  setLoading(true);
  const result = await supabase.from("bookings").insert(data);
  setLoading(false);
  refetch();
};

// ✅ AFTER
import { useCreateBooking } from "@/hooks/api/useBookings";

const { mutate: createBooking, isPending } = useCreateBooking();

const handleCreate = (data: any) => {
  createBooking(data, {
    onSuccess: () => toast.success("Created!"),
    onError: (error) => toast.error(error.message),
  });
};
```

### Pattern 3: Realtime Subscription

```typescript
// ❌ BEFORE
useEffect(() => {
  const subscription = supabase
    .channel("bookings")
    .on("postgres_changes", { event: "*", schema: "public" }, (payload) => {
      console.log(payload);
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);

// ✅ AFTER
import { useBookingsRealtime } from "@/hooks/api/useBookings";

useBookingsRealtime(); // Handles subscription + queryClient.invalidateQueries
```

---

## 📋 VALIDATION CHECKLIST

**Per Migrated File:**

- [ ] No direct `import { supabase }` in component
- [ ] Uses hooks from `src/hooks/api/`
- [ ] Loading state implemented
- [ ] Error handling implemented
- [ ] Success notifications implemented
- [ ] Optimistic updates (if applicable)
- [ ] Tests updated/passing
- [ ] Visual QA passed

**Per Batch:**

- [ ] grep search confirms no Supabase imports
- [ ] Build passes
- [ ] All CRUD operations tested
- [ ] Realtime updates working
- [ ] Performance acceptable
- [ ] Knowledge Base updated

---

## 🎯 SUCCESS METRICS

| Metric                      | Start | Target | Method          |
| --------------------------- | ----- | ------ | --------------- |
| Files with Supabase imports | 159   | 0      | grep search     |
| API Layer Coverage          | 0%    | 100%   | Code coverage   |
| Loading State Consistency   | ~30%  | 100%   | Manual audit    |
| Error Handling Consistency  | ~40%  | 100%   | Manual audit    |
| Code Duplication            | High  | Low    | Bundle analysis |

---

## 🚨 RISKS & MITIGATION

| Risk                   | Impact | Probability | Mitigation                          |
| ---------------------- | ------ | ----------- | ----------------------------------- |
| Breaking Changes       | High   | Medium      | Incremental migration + testing     |
| Performance Regression | Medium | Low         | React Query caching                 |
| Realtime Issues        | High   | Medium      | Thorough Realtime testing           |
| Dev Time Overrun       | Medium | High        | Batch approach enables pause/resume |

---

## 📚 KNOWLEDGE BASE INTEGRATION

**After Each Batch:**

1. Log to `ai_learning_patterns` (success/failure)
2. Update `code_snippets` (reusable patterns)
3. Update `best_practices` (migration guidelines)
4. Update `known_issues` (if issues found)

**Final Deliverable:**

- Complete migration report
- Reusable migration toolkit
- Updated architecture docs

---

## 🔄 NEXT STEPS

1. **Immediate:** Create Phase 0 infrastructure
2. **Today:** Complete Pilot Migration (Bookings)
3. **This Week:** Complete Phase 2-3 (Customers, Drivers, Vehicles, Dashboard)
4. **Next Week:** Complete Phase 4 (Remaining clusters)

**Estimated Total Time:** 15-20 hours  
**Estimated Completion:** 1-2 weeks

---

**Mission Lead:** neXify AI  
**Status:** 📋 Ready to Execute  
**Priority:** P0 - Critical Infrastructure  
**Approval:** Awaiting User Confirmation

---

## 📖 REFERENCES

- **TanStack Query Docs:** https://tanstack.com/query/latest
- **Current Supabase Integration:** `src/integrations/supabase/`
- **Component Registry:** `docs/COMPONENT_REGISTRY.md`
- **NeXify Wiki:** `docs/NEXIFY_WIKI_V1.0.md`
