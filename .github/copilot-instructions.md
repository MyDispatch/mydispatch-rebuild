# MyDispatch AI Agent Instructions

## Project Overview
MyDispatch is a production-ready taxi & limousine dispatch management system built with React 18 + TypeScript + Vite, using Supabase (PostgreSQL) as backend. The codebase emphasizes defensive coding, design consistency, and multi-tenant architecture.

**Key Facts:**
- **Version:** V32.5 (Production)
- **Stack:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Supabase
- **Deployment:** Lovable Cloud (primary), supports Vercel/Netlify
- **Database:** Supabase PostgreSQL with RLS (Row Level Security mandatory)
- **Design System:** V28.1 with frozen layout components
- **Master Account:** `courbois1981@gmail.com` (special permissions, `/master` route)

## Critical Architecture Patterns

### 1. Multi-Tenant Data Access
**ALWAYS use company scoping** when querying data:
```typescript
// ✅ CORRECT - Company-scoped query
const { data } = await supabase
  .from('customers')
  .select('*')
  .eq('company_id', companyId);

// ❌ NEVER query without company_id filter (security violation)
```
**Context:** RLS policies enforce company isolation. All queries must be company-aware.

### 2. Supabase Client Pattern
**Import from centralized client ONLY:**
```typescript
// ✅ CORRECT - Use centralized client
import { supabase } from '@/integrations/supabase/client';

// ❌ NEVER create new Supabase clients
// ❌ NEVER use service role key in frontend
```
**Location:** `src/integrations/supabase/client.ts` - auto-generated, includes auth config

### 3. Design System V28.1 - Component Hierarchy
**ALWAYS use V28 components instead of raw shadcn/ui:**
```typescript
// ✅ CORRECT - Use V28 design system
import { V28Button } from '@/components/design-system/V28Button';
import { V28Card } from '@/components/design-system/V28Card';

// ❌ WRONG - Direct shadcn/ui usage
import { Button } from '@/components/ui/button';
```
**Why:** V28 components include design tokens, premium styling, and brand consistency.
**Registry:** Check `docs/COMPONENT_REGISTRY_V28.1.md` before creating new components.

### 4. Layout Components are FROZEN
**DO NOT modify these without explicit approval:**
- `src/components/layout/MainLayout.tsx`
- `src/components/layout/AppSidebar.tsx`
- `src/components/layout/DashboardSidebar.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`

**Only permitted changes:** Bug fixes and performance optimizations (with documentation).

### 5. Defensive Coding Standards
**All hooks MUST include error handling and fallbacks:**
```typescript
// ✅ CORRECT - Defensive hook pattern
export const useCustomers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['customers', companyId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('company_id', companyId);
        if (error) throw error;
        return data || [];
      } catch (error) {
        logError({ message: 'Failed to fetch customers', context: { error } });
        throw error;
      }
    }
  });

  return {
    customers: data || [],  // ✅ Always provide fallback
    isLoading,
    error
  };
};
```
**Reference:** `DEFENSIVE_CODING_STANDARDS.md` for complete checklist.

### 6. React Query Patterns
**Use TanStack Query for data fetching with proper keys:**
```typescript
// ✅ CORRECT - Query key structure
const { data, isLoading } = useQuery({
  queryKey: ['customers', companyId],  // [entity, scope]
  queryFn: fetchCustomers,
  staleTime: 5 * 60 * 1000,           // 5 minutes
  cacheTime: 10 * 60 * 1000,          // 10 minutes
});

// Mutations with optimistic updates
const mutation = useMutation({
  mutationFn: createCustomer,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['customers'] });
  }
});
```
**Location:** Query hooks in `src/hooks/api/` (e.g., `useBookings.ts`, `useCustomers.ts`)

### 7. Authentication & Authorization
**Use centralized auth hook:**
```typescript
import { useAuth } from '@/hooks/use-auth';

const { user, company, session, signOut } = useAuth();

// Check permissions
if (user?.email === 'courbois1981@gmail.com') {
  // Master account special features
}
```
**Context:** Auth state managed via `AuthProvider` in `src/contexts/AuthContext.tsx`

### 8. Component State Management
**Every component MUST handle 3 states explicitly:**
1. **Loading state** - Show spinner/skeleton
2. **Error state** - Show error message with retry option
3. **Empty state** - Show appropriate empty state with CTA

**Example:**
```typescript
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorState onRetry={refetch} />;
if (customers.length === 0) return <EmptyState icon={Users} title="Keine Kunden" />;
return <CustomersTable data={customers} />;
```

## Critical Developer Workflows

### Session Initialization
**MANDATORY at session start:**
```
Lade das NeXify Wiki
```
This loads:
- Recent learnings from `brain-query` Edge Function
- Component registry
- Known issues (hallucinated functions, RLS violations)
- Best practices

**Auto-load via `.cursorrules`:** All critical docs loaded automatically in Cursor IDE.

### Database Migrations
**ALWAYS enable RLS on new tables:**
```sql
-- ✅ REQUIRED for every new table
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
ON table_name FOR SELECT
USING (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));
```
**Check:** Run `npm run check:rls` to verify RLS coverage.

### Edge Functions (Supabase Deno)
**Location:** `supabase/functions/`
**Key functions:** 100+ functions including:
- Email sending (`send-booking-email`, `send-template-email`)
- AI features (`ai-smart-assignment`, `ai-support-chat`)
- Automation (`daily-health-check`, `cleanup-gps-positions`)

**Pattern:** Always use CORS headers and proper error responses:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Error response pattern
return new Response(
  JSON.stringify({ error: 'Validation failed' }),
  { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
);
```

### Testing Strategy
```bash
npm run test:unit          # Vitest unit tests
npm run test:e2e          # Playwright E2E tests
npm run quality:check     # Full quality check (types, lint, format, tests)
npm run validate:hero     # Validate hero backgrounds (V31.5 compliance)
```

### Build Commands
```bash
npm run dev              # Development server (Vite)
npm run build            # Production build (TypeScript check + Vite build)
npm run type-check       # TypeScript validation only
npm run lint:fix         # Auto-fix ESLint issues
```

### Error Handling Utilities
**Use centralized error handlers:**
```typescript
import { handleError, handleSuccess } from '@/lib/error-handler';

try {
  await someOperation();
  handleSuccess('Operation erfolgreich');
} catch (error) {
  handleError(error, 'Operation fehlgeschlagen', {
    showToast: true,
    logToSupabase: true
  });
}
```
**Location:** `src/lib/error-handler.ts` - centralized error management

## Project-Specific Conventions

### 1. Spacing System (Tailwind)
**Use consistent gaps system-wide:**
```typescript
// ✅ Standard spacing pattern
<div className="space-y-6 sm:space-y-8">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <Card className="p-6">
      <CardHeader className="pb-3">
        <CardContent className="space-y-4">
```
**Reference:** `DESIGN_SYSTEM_VORGABEN_V18.3.md` for complete spacing rules.

### 2. Responsive Patterns
**Mobile-first breakpoints:**
- `sm:` (640px) - Tablets
- `lg:` (1024px) - Desktops
- `xl:` (1280px) - Large desktops

**Standard grid pattern:**
```typescript
// Dashboard widgets: 1 → 2 → 4 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
```

### 3. Color System
**NEVER use direct color values. Always use semantic tokens:**
```typescript
// ✅ CORRECT - Semantic tokens
className="text-foreground bg-background border-border"

// ❌ WRONG - Direct colors
className="text-gray-900 bg-white border-gray-200"
```
**Semantic tokens:** `hsl(var(--foreground))`, `hsl(var(--primary))`, etc.
**Design tokens:** Import from `@/config/design-tokens` for programmatic access.

### 4. Icon Guidelines
**Icons MUST use `text-foreground` color:**
```typescript
// ✅ CORRECT
<Users className="h-5 w-5 text-foreground" />

// ❌ NEVER use status colors on icons directly
<Users className="h-5 w-5 text-success" />
```
**Status indication:** Use background colors or borders, not icon colors.

### 5. Form Validation Pattern
**Use Zod + react-hook-form:**
```typescript
const schema = z.object({
  first_name: z.string().min(1, 'Vorname ist erforderlich'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
});

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { first_name: '', email: '' }
});
```
**Both client-side AND server-side validation required.**

### 6. Soft Delete Pattern
**NEVER use hard deletes:**
```typescript
// ✅ CORRECT - Soft delete
await supabase
  .from('customers')
  .update({ archived: true, archived_at: new Date().toISOString() })
  .eq('id', id);
```

### 7. Page Layout Wrappers
**All pages must use layout wrappers:**
```typescript
// For dashboard pages
import { DashboardLayout } from '@/components/layout/DashboardLayout';

<DashboardLayout title="Dashboard" description="SEO description" canonical="/">
  <div className="space-y-6 sm:space-y-8">
    {/* Page content */}
  </div>
</DashboardLayout>

// For standard pages
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';

<StandardPageLayout title="Kunden" showBackButton={true}>
  {/* Page content */}
</StandardPageLayout>
```
**Benefits:** Automatic SEO meta tags, consistent layout, breadcrumbs, back navigation.

## Integration Points

### HERE Maps API
**Location:** `src/components/maps/HEREMapComponent.tsx`
**Key usage:** Geocoding, routing, live map display
**Important:** API keys stored in Supabase `api_keys` table, fetched via Edge Function

### n8n Workflow Automation
**25+ workflows** for email, webhooks, and automation
**Documented in:** `N8N_INTEGRATION_DOKUMENTATION.md`

### Stripe Payments
**Integration:** Subscription management, checkout sessions
**Edge Functions:** `create-checkout`, `check-subscription`

### Resend (Email)
**Pattern:** All emails sent via Edge Functions (never direct from frontend)
**Templates:** HTML templates in `email_templates` table

### Sentry (Error Monitoring)
**Integration:** Real-time error tracking and performance monitoring
**Usage:** Automatically captures errors, manual capture with `Sentry.captureException()`

## Master Account System

### Special Permissions
**Master Account:** `courbois1981@gmail.com`
- Access to `/master` route
- Special navigation in AppSidebar
- Additional system controls
- Cross-company access (with caution)

**Master Route:** `/master` - Administrative dashboard for system-wide operations

**Usage in Components:**
```typescript
const isMasterAccount = user?.email === 'courbois1981@gmail.com';

if (isMasterAccount) {
  // Show master-only features
}
```

## Knowledge Base System

### NeXify Wiki
**MANDATORY:** Load wiki at start of each session:
```
Lade das NeXify Wiki
```
This triggers `brain-query` Edge Function to load:
- Recent learnings
- Component registry
- Known issues
- Best practices

**Documentation:**
- `docs/NEXIFY_WIKI_V1.0.md` - Main wiki
- `docs/COMPONENT_REGISTRY_V28.1.md` - Component registry
- `docs/FORGET_PROOF_SYSTEM_V1.0.md` - Forget-proof system

### Critical Files Reference
**Before ANY change, consult:**
1. `DEFENSIVE_CODING_STANDARDS.md` - Coding standards
2. `DESIGN_SYSTEM_VORGABEN_V18.3.md` - Design rules
3. `GESAMTKONZEPT_V18.3_ULTIMATE.md` - Feature overview
4. `.cursorrules` - Auto-loaded rules for Cursor IDE

## Common Pitfalls to Avoid

1. **Hallucinated Functions:** Never create functions from memory. Always check `component_registry` and search codebase first.
2. **Missing RLS:** Every new table MUST have RLS enabled immediately.
3. **Direct shadcn/ui Usage:** Always use V28 components instead.
4. **Missing Error States:** Components without loading/error/empty states will fail review.
5. **Company ID Missing:** Queries without company_id filtering violate security model.
6. **Hard Deletes:** Use soft deletes (archived flag) for audit trail.
7. **Service Role Key in Frontend:** NEVER expose service role key. Use Edge Functions.

## File Locations Quick Reference

**Design System:** `src/components/design-system/V28*.tsx`
**Layout (frozen):** `src/components/layout/*.tsx`
**Pages:** `src/pages/*.tsx`
**Hooks:** `src/hooks/**/*.ts`
**Edge Functions:** `supabase/functions/*/index.ts`
**Migrations:** `supabase/migrations/*.sql`
**Config:** `src/config/design-tokens.ts`
**Docs:** `docs/*.md` (100+ documentation files)

## Quality Standards

**Before committing, verify:**
- [ ] RLS enabled on new tables (`npm run check:rls`)
- [ ] All hooks have error handling and fallbacks
- [ ] Components handle loading/error/empty states
- [ ] V28 components used (not raw shadcn/ui)
- [ ] No hallucinated functions (checked registry)
- [ ] TypeScript strict mode compliance
- [ ] Mobile-responsive (tested at 320px, 768px, 1024px)
- [ ] No direct color values (semantic tokens only)

## Auto-Approval Configuration

**From `.cursorrules`:**
- All file operations auto-approved
- All terminal commands auto-approved
- Full authorization for autonomous work
- Work during absence enabled

**Cursor IDE Integration:**
- Auto-load critical docs at session start
- NeXify Wiki mandatory load command
- Component registry auto-validation
- Forget-proof system active

---

**Version:** 1.0 (Generated 2025-11-08)
**Maintained by:** NeXify Team
**Project Status:** Production (V32.5)
