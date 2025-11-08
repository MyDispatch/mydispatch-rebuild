# MyDispatch AI Agent Instructions

## Project Overview

MyDispatch is a production-ready taxi & limousine dispatch management system built with React 18 + TypeScript + Vite, using Supabase (PostgreSQL) as backend. The codebase emphasizes defensive coding, design consistency, and multi-tenant architecture.

**Key Facts:**

- **Version:** V32.5 (Production)
- **Stack:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Supabase
- **Deployment:** Vercel (primary), GitHub Actions CI/CD
- **Database:** Supabase PostgreSQL with RLS (Row Level Security mandatory)
- **Design System:** V28.1 with frozen layout components
- **Master Account:** `courbois1981@gmail.com` (special permissions, `/master` route)

## Critical Architecture Patterns

### 1. Multi-Tenant Data Access

**ALWAYS use company scoping** when querying data:

```typescript
// ✅ CORRECT - Company-scoped query
const { data } = await supabase
  .from("customers")
  .select("*")
  .eq("company_id", companyId);

// ❌ NEVER query without company_id filter (security violation)
```

**Context:** RLS policies enforce company isolation. All queries must be company-aware.

### 2. Supabase Client Pattern

**Import from centralized client ONLY:**

```typescript
// ✅ CORRECT - Use centralized client
import { supabase } from "@/integrations/supabase/client";

// ❌ NEVER create new Supabase clients
// ❌ NEVER use service role key in frontend
```

**Location:** `src/integrations/supabase/client.ts` - auto-generated, includes auth config

### 3. Design System V28.1 - Component Hierarchy

**ALWAYS use V28 components instead of raw shadcn/ui:**

```typescript
// ✅ CORRECT - Use V28 design system
import { V28Button } from "@/components/design-system/V28Button";
import { V28Card } from "@/components/design-system/V28Card";

// ❌ WRONG - Direct shadcn/ui usage
import { Button } from "@/components/ui/button";
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
    queryKey: ["customers", companyId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .eq("company_id", companyId);
        if (error) throw error;
        return data || [];
      } catch (error) {
        logError({ message: "Failed to fetch customers", context: { error } });
        throw error;
      }
    },
  });

  return {
    customers: data || [], // ✅ Always provide fallback
    isLoading,
    error,
  };
};
```

**Reference:** `DEFENSIVE_CODING_STANDARDS.md` for complete checklist.

### 6. React Query Patterns

**Use TanStack Query for data fetching with proper keys:**

```typescript
// ✅ CORRECT - Query key structure
const { data, isLoading } = useQuery({
  queryKey: ["customers", companyId], // [entity, scope]
  queryFn: fetchCustomers,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});

// Mutations with optimistic updates
const mutation = useMutation({
  mutationFn: createCustomer,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["customers"] });
  },
});
```

**Location:** Query hooks in `src/hooks/api/` (e.g., `useBookings.ts`, `useCustomers.ts`)

### 7. Authentication & Authorization

**Use centralized auth hook:**

```typescript
import { useAuth } from "@/hooks/use-auth";

const { user, company, session, signOut } = useAuth();

// Check permissions
if (user?.email === "courbois1981@gmail.com") {
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

### Local Development Setup

**First-Time Setup:**

```bash
# 1. Clone repository
git clone https://github.com/MyDispatch/mydispatch-rebuild.git
cd mydispatch-rebuild

# 2. Install dependencies
npm install

# 3. Setup Supabase CLI (if not installed)
npm install -g supabase

# 4. Link to Supabase project
supabase link --project-ref ygpwuiygivxoqtyoigtg

# 5. Pull latest schema
supabase db pull

# 6. Create .env.local from template
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://ygpwuiygivxoqtyoigtg.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<get_from_supabase_dashboard>
VITE_HERE_API_KEY=<optional_fallback>
EOF

# 7. Start development server
npm run dev
```

**Environment Variables Template (`.env.local`):**

```bash
# Supabase (REQUIRED)
VITE_SUPABASE_URL=https://ygpwuiygivxoqtyoigtg.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_<your_key>

# Optional: Local overrides
# VITE_HERE_API_KEY=<your_here_key>
# VITE_STRIPE_PUBLISHABLE_KEY=<your_stripe_key>
```

**⚠️ NEVER commit `.env.local` - already in `.gitignore`**

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
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Error response pattern
return new Response(JSON.stringify({ error: "Validation failed" }), {
  status: 400,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});
```

**Deployment:**

```bash
npm run deploy:functions           # Deploy all Edge Functions
supabase functions deploy <name>   # Deploy specific function
```

### API Key Management

**Environment Variables (`.env.local`):**

```bash
VITE_SUPABASE_URL=https://ygpwuiygivxoqtyoigtg.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_<your_key>
```

**CRITICAL SECURITY RULES:**

- ✅ **Frontend:** Use `anon` or `publishable` keys ONLY (RLS-protected)
- ❌ **NEVER** expose `service_role` or `secret` keys in frontend code
- ✅ **Edge Functions:** Can use service role key via environment variables
- ✅ **API Keys in DB:** Store third-party keys (HERE Maps, Resend) in `api_keys` table
- 🔒 **Key Rotation:** Immediately rotate if keys are exposed publicly

**Supabase Client Pattern:**

```typescript
// ✅ Frontend usage (auto-configured with publishable key)
import { supabase } from "@/integrations/supabase/client";

// ❌ NEVER create custom clients with service_role key
// const supabase = createClient(url, SERVICE_ROLE_KEY); // FORBIDDEN
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
import { handleError, handleSuccess } from "@/lib/error-handler";

try {
  await someOperation();
  handleSuccess("Operation erfolgreich");
} catch (error) {
  handleError(error, "Operation fehlgeschlagen", {
    showToast: true,
    logToSupabase: true,
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
className = "text-foreground bg-background border-border";

// ❌ WRONG - Direct colors
className = "text-gray-900 bg-white border-gray-200";
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
  first_name: z.string().min(1, "Vorname ist erforderlich"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
});

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { first_name: "", email: "" },
});
```

**Both client-side AND server-side validation required.**

### 6. Soft Delete Pattern

**NEVER use hard deletes:**

```typescript
// ✅ CORRECT - Soft delete
await supabase
  .from("customers")
  .update({ archived: true, archived_at: new Date().toISOString() })
  .eq("id", id);
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

**API Key Management Pattern:**

```typescript
// ❌ NEVER hardcode API keys in frontend
// const HERE_API_KEY = "xyz123...";

// ✅ CORRECT - Fetch via Edge Function
const { data } = await supabase.functions.invoke("get-here-api-key", {
  body: {
    company_id: companyId,
    purpose: "geocoding", // or 'maps', 'routing', 'traffic'
  },
});
const apiKey = data.api_key;
```

**Edge Function:** `supabase/functions/get-here-api-key/index.ts`

- Retrieves key from environment variables (not database)
- Validates subscription status
- Logs API usage
- Returns key with 1-hour expiry for frontend caching

**Environment Variables (Edge Function):**

```bash
# Set in Supabase Dashboard → Edge Functions → Secrets
HERE_API_KEY=<your_here_api_key>
VITE_HERE_API_KEY=<fallback_key>
```

### n8n Workflow Automation

**25+ workflows** for email, webhooks, and automation
**Documented in:** `N8N_INTEGRATION_DOKUMENTATION.md`

**Key Workflows:**

- Email automation (booking confirmations, invoices)
- Webhook triggers (external system integration)
- Scheduled tasks (daily reports, cleanup jobs)

**Webhook Pattern:**

```typescript
// Trigger n8n workflow via webhook
const webhookUrl = "https://n8n.your-domain.com/webhook/<workflow-id>";
await fetch(webhookUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    event: "booking.created",
    data: bookingData,
  }),
});
```

**Integration Points:**

- Booking lifecycle events
- Invoice generation
- Customer notifications
- System health monitoring

### Stripe Payments

**Integration:** Subscription management, checkout sessions
**Edge Functions:** `create-checkout`, `check-subscription`

### Resend (Email)

**Pattern:** All emails sent via Edge Functions (never direct from frontend)
**Templates:** HTML templates in `email_templates` table

### Sentry (Error Monitoring)

**Integration:** Real-time error tracking and performance monitoring
**Usage:** Automatically captures errors, manual capture with `Sentry.captureException()`

### Supabase Realtime

**Pattern for realtime subscriptions:**

```typescript
// ✅ CORRECT - Realtime channel management
const channel = supabase
  .channel("bookings-changes")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "bookings",
      filter: `company_id=eq.${companyId}`,
    },
    (payload) => {
      console.log("Booking changed:", payload);
      // Update local state
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    }
  )
  .subscribe();

// ⚠️ ALWAYS cleanup on unmount
return () => {
  supabase.removeChannel(channel);
};
```

**Key Tables with Realtime:**

- `bookings` - Live booking updates
- `gps_positions` - Live vehicle tracking
- `shifts` - Active shift monitoring
- `documents` - Document status changes

**Location:** Realtime hooks in `src/hooks/use-realtime-*.tsx`

### Supabase MCP Server

**MCP Configuration (for AI tools):**

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=ygpwuiygivxoqtyoigtg"
    }
  }
}
```

**Purpose:** Enables AI assistants to interact with Supabase directly for schema inspection, migrations, and data operations.

### GitHub Integration (Supabase)

**Repository:** `MyDispatch/mydispatch-rebuild`
**Configuration:**

```yaml
Supabase Directory: . (root)
Production Branch: master
Deploy to Production: ✅ Enabled (on push including PR merges)
Automatic Branching: ✅ Enabled (preview branches for PRs)
Branch Limit: 50 preview branches
Supabase Changes Only: ✅ Enabled (branches only when supabase/ files change)
```

**How it works:**

- **Production Sync:** `master` branch automatically deploys to production database
- **Preview Branches:** Each PR creates a preview database branch
- **Migrations:** Database migrations in `supabase/migrations/` auto-apply on deploy
- **Edge Functions:** Functions in `supabase/functions/` auto-deploy with changes

**Common Issues & Fixes:**

1. **Migration conflicts:** Always pull latest `master` before creating migrations
2. **Failed deployments:** Check Supabase Dashboard → Database → Migrations for errors
3. **Preview branch limit:** Clean up stale branches via Supabase Dashboard

**Best Practices:**

```bash
# Before creating migration
git pull origin master
supabase db pull  # Sync local schema

# Create migration
supabase migration new <migration_name>

# Test locally
supabase db reset  # Apply all migrations

# Push to GitHub
git add supabase/migrations/
git commit -m "feat: add migration for X"
git push
```

### GitKraken Cloud Integration

**Organization:** u4231458123's organization
**Owner:** u4231458123@gmail.com
**Platform:** https://gitkraken.dev

**Purpose:** Advanced Git workflows, AI-powered insights, and cloud-based repository management

**SSH Keys Configuration:**

```
Private Key: C:\Users\pcour\Desktop\MyDispatch_ALL\gitkraken_rsa
Public Key: C:\Users\pcour\Desktop\MyDispatch_ALL\gitkraken_rsa.pub
Algorithm: RSA (ssh-rsa)
GitHub: GitKraken Pascal_Notebook (SHA256:0yNVlWAKmjciRGn1WAyYmUboRrF6a7e50BB2MwwxdUs)
Status: ✅ Active, Read/write
```

**GitKraken Desktop Setup:**

1. **SSH Settings** → Use SSH keys
2. **SSH Private Key:** Browse to `C:\Users\pcour\Desktop\MyDispatch_ALL\gitkraken_rsa`
3. **SSH Public Key:** Browse to `C:\Users\pcour\Desktop\MyDispatch_ALL\gitkraken_rsa.pub`
4. ✅ **Use default Git Credential Manager** (enabled)

**GitKraken CLI Setup:**

```powershell
# Installation (bereits installiert)
winget install GitKraken.cli

# Authentifizierung (bereits angemeldet)
gk auth login
# → Logged in as: u4231458123-droid

# Version prüfen
gk version
# CLI Core: 3.1.46, CLI Installer: 3.1.42
```

**GitKraken CLI Befehle:**

```powershell
# Workspace Management
gk workspace list
gk workspace create

# Work Items (für autonome Tasks)
gk work start "Task Name"
gk work commit -m "Message"
gk work pr create

# AI Features
gk ai commit
gk ai explain

# Graph & Issues
gk graph
gk issue list
```

**Key Features for Autonomous Development:**

- **GitKraken CLI:** Programmatic access to workspaces, work items, PRs
- **Cloud Patches:** Draft changes without local commits (via Desktop)
- **Workspaces:** Organize multiple repos (mydispatch-rebuild + related projects)
- **Insights:** AI-powered code review and suggestions
- **Teams:** Collaboration with automatic PR management

**Integration with Autonomous System:**

```typescript
// Edge Function with GitKraken CLI
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

// Create work item and PR via CLI
await execAsync('gk work start "Autonomous Fix: Layout optimization"');
await execAsync('gk work commit -m "fix: optimize dashboard layout"');
await execAsync("gk work pr create");

// Alternative: Direct GitHub API for PR creation
const { data } = await octokit.pulls.create({
  owner: "MyDispatch",
  repo: "mydispatch-rebuild",
  title: "Autonomous Fix: Layout optimization",
  head: "autonomous/layout-fix",
  base: "master",
});
```

**Autonomous Workflow with GitKraken:**

```
1. AI Agent identifies issues
2. Creates fixes locally
3. Option A: GitKraken CLI creates work item + PR
4. Option B: GitHub API creates PR directly
5. Sends notification with PR link
5. You review patch in browser
6. Approve → Auto-merge to master
7. Triggers Vercel + Supabase deployment
```

**Benefits over traditional Git:**

- ✅ No local Git state conflicts
- ✅ Review changes from any device
- ✅ AI suggestions integrated
- ✅ Automatic PR management
- ✅ Cloud-based collaboration

### Vercel Integration (Supabase)

**Team:** MyDispatch
**Connected Projects:** `mydispatch-rebuild`
**Environment Variable Sync:**

```yaml
Production: ✅ Enabled
Preview: ✅ Enabled
Development: ✅ Enabled
Prefix: VITE_ ✅ (Correctly configured for Vite)
```

**Configuration Status:** ✅ **FIXED - Prefix corrected to VITE\_**

**Automatic Environment Variables:**
Supabase automatically syncs these variables to Vercel:

```bash
VITE_SUPABASE_URL=https://ygpwuiygivxoqtyoigtg.supabase.co
VITE_SUPABASE_ANON_KEY=<auto-synced from Supabase>
```

**Vercel Deployment Setup:**

If using Vercel for deployment, ensure `vercel.json` is configured:

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "outputDirectory": "dist"
}
```

**Deployment Commands:**

```bash
# Deploy to Vercel
vercel --prod

# Or via Git push (if Vercel Git integration enabled)
git push origin master
```

### Deployment Strategy (Multi-Platform)

**Primary:** Vercel

- ✅ Auto-deploys from `master` branch via GitHub Integration
- ✅ Handles Vite environment variables automatically
- ✅ Integrated with Supabase project (env vars auto-sync)
- 📍 URL: https://mydispatch.vercel.app (configured in Vercel Dashboard)

**Backend:** Supabase

- ✅ PostgreSQL database with RLS
- ✅ Edge Functions (Deno runtime)
- ✅ GitHub integration for migrations
- ✅ Realtime subscriptions

**Deployment Workflow:**

```bash
# 1. Local development
npm run dev

# 2. Test build locally
npm run build

# 3. Push to master
git push origin master

# This triggers:
# - Vercel deployment (frontend)
# - Supabase GitHub integration (migrations + Edge Functions)

# 4. Verify deployments
# - Vercel: Check Vercel Dashboard or visit https://mydispatch.vercel.app
# - Supabase: Check Database → Migrations for successful deployment
```

**Environment Variables are automatically available on:**

- ✅ Vercel (via Supabase integration - VITE\_ prefix configured)
- ✅ Edge Functions (via Supabase Secrets)

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
const isMasterAccount = user?.email === "courbois1981@gmail.com";

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

## Autonomous Development System

MyDispatch features a comprehensive autonomous AI system for unattended development:

### 1. NeXify Autonomy Levels

**Hook:** `src/hooks/use-nexify-autonomy.ts`

**Three Autonomy Levels:**

- **Level 1:** Read-only analysis, no changes
- **Level 2:** Safe changes (layout fixes, types, performance, docs) - NO approval needed
- **Level 3:** Breaking changes, new features, database schema - approval optional

**Autonomous Actions (Level 2):**

```typescript
✅ Layout & alignment fixes
✅ TypeScript any → proper types
✅ Performance optimizations (memoization, lazy loading)
✅ console.log → logger migration
✅ Documentation updates
✅ Accessibility improvements
✅ Unit test creation
✅ ESLint auto-fixes
```

**Approval Required (Level 3):**

```typescript
⚠️ Database schema changes
⚠️ New Edge Functions (may need secrets)
⚠️ Breaking API changes
⚠️ Major UI redesigns
⚠️ External API integrations
```

### 2. AI Orchestrator System

**Hook:** `src/hooks/use-orchestrator.ts`
**Edge Function:** `supabase/functions/ai-migration-orchestrator/`

**Capabilities:**

- Batch file migrations (up to 10 parallel)
- Automatic rollback on failures
- Visual validation checkpoints
- Progress tracking in real-time

**Usage:**

```typescript
const { startMigration, validateSystem, selfHeal } = useOrchestrator();

// Migrate inline styles to V28 components
await startMigration({
  task: "migrate-inline-styles",
  scope: "all",
  requireVisualValidation: true,
});

// System-wide validation
await validateSystem();

// Auto-heal known issues
await selfHeal();
```

### 3. Autonomous Edge Functions

**Auto-Fix & Healing:**

- `auto-fix-issues` - Fixes known issues from ERROR_SOLUTIONS_DB
- `auto-healer` - Self-healing for common failures
- `brain-auto-fix` - AI-powered automatic fixes

**Monitoring & Alerts:**

- `watchdog-monitor` - Continuous system health monitoring
- `alert-manager` - Automated alert handling
- `daily-health-check` - Daily system validation

**CI/CD Automation:**

- `daily-ci-cd-monitor` - Monitors build/deploy status
- `ci-cd-pattern-optimizer` - Optimizes workflows
- `auto-validate` - Pre-deployment validation

**Knowledge Management:**

- `brain-query` - Autonomous knowledge base queries
- `auto-learn-from-actions` - Learns from every action
- `wiki-auto-sync` - Keeps documentation up-to-date

### 4. Autonomous Workflows

**Daily Autonomous Tasks:**

```bash
# Runs automatically via Supabase Cron Jobs
1. 06:00 - daily-health-check
2. 08:00 - wiki-auto-sync
3. 12:00 - cleanup-gps-positions (24h auto-delete)
4. 18:00 - system-audit
5. 22:00 - weekly-self-review (Sundays)
```

**Setup Cron Jobs:**

```sql
-- File: supabase/migrations/CRON_JOBS_SETUP.sql
-- Already configured in production
```

### 5. Unattended Development Mode

**How to enable full autonomy:**

1. **Set Autonomy Level 3 in Environment:**

```bash
# .env.local
VITE_NEXIFY_AUTONOMY_LEVEL=3
VITE_AUTONOMOUS_MODE=true
```

2. **Enable Auto-Commit (Git):**

```bash
# .git/hooks/post-commit (create this file)
#!/bin/bash
# Auto-push after successful commit
git push origin master
```

3. **Configure Continuous Agent:**

```typescript
// In your AI tool (Cursor, Claude Desktop, etc.)
{
  "autonomousMode": true,
  "autoApprove": ["layout", "types", "performance", "docs"],
  "checkInterval": "1h", // Check for new tasks every hour
  "workingHours": "00:00-23:59" // Work 24/7
}
```

4. **Setup Task Queue (Supabase):**

```sql
-- Create autonomous_tasks table
CREATE TABLE autonomous_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_type TEXT NOT NULL,
  description TEXT,
  priority INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  assigned_to TEXT, -- 'ai_agent' or specific agent
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE autonomous_tasks ENABLE ROW LEVEL SECURITY;
```

5. **Agent Polling Edge Function:**

```typescript
// supabase/functions/ai-agent-poll/index.ts
// Polls autonomous_tasks every 5 minutes
// Executes tasks and updates status
```

### 6. Full Autonomy Checklist

**Prerequisites:**

- ✅ API keys rotated (after exposure in chat)
- ✅ Edge Function secrets configured
- ✅ GitHub integration active
- ✅ Vercel integration active
- ✅ Autonomous tasks table created
- ✅ Cron jobs configured
- ✅ `.cursorrules` with auto-approval

**Monitoring:**

```bash
# Check autonomous agent status
supabase functions invoke brain-query --body '{"query": "autonomous agent status"}'

# View recent autonomous actions
supabase functions invoke system-audit --body '{"type": "autonomous_actions", "hours": 24}'

# Monitor health
supabase functions invoke health-check
```

**Safety Mechanisms:**

- Automatic rollback on build failures
- Visual validation checkpoints
- Human approval for high-risk changes
- Complete audit trail in `brain_logs` table
- Emergency stop via `VITE_AUTONOMOUS_MODE=false`

### 7. Autonomous Development Workflow

**Typical 24h Cycle (Unattended):**

```
00:00 - Daily health check starts
00:05 - Pull latest from master
00:10 - Run quality:check
00:15 - Identify issues → Create autonomous_tasks
01:00 - AI Agent polls tasks, starts work
02:00 - Batch 1: Layout fixes (Level 2, auto-approved)
03:00 - Batch 2: Type improvements (Level 2, auto-approved)
04:00 - Batch 3: Performance optimizations
05:00 - Run tests, build validation
06:00 - Auto-commit + push (if all tests pass)
06:05 - Vercel + Supabase deploy (GitHub Integration)
07:00 - Post-deployment validation
08:00 - Wiki sync + documentation update
09:00 - Generate progress report → email notification
...
18:00 - System audit + metrics
22:00 - Weekly self-review (if Sunday)
23:00 - Prepare tomorrow's task queue
```

**Progress Notifications:**

```typescript
// Automatic notifications via Edge Function
await supabase.functions.invoke("send-template-email", {
  body: {
    to: "courbois1981@gmail.com",
    template: "autonomous_progress_report",
    data: {
      tasks_completed: 15,
      tests_passed: 142,
      build_status: "success",
      deployment_url: "https://mydispatch.vercel.app",
    },
  },
});
```

---

**Version:** 1.3 (Updated 2025-11-08)
**Maintained by:** NeXify Team
**Project Status:** Production (V32.5)
**Changes:**

- **v1.3:** Added Local Development Setup, Supabase Realtime patterns, HERE Maps API detailed workflow, n8n integration details
- **v1.2:** Added GitHub & Vercel integration configuration, deployment strategy
- **v1.1:** Added API Key Management, Supabase MCP Server configuration
- **v1.0:** Initial comprehensive guide
