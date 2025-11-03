-- ============================================================================
-- V5.0 KNOWLEDGE-BASE: BEST-PRACTICES & CODE-SNIPPETS INITIAL DATA
-- ============================================================================
-- Fügt 20+ Best-Practices und 15+ Code-Snippets zur Knowledge-Base hinzu
-- Ermöglicht Zero-Hallucination durch vollständige Pattern-Datenbank
-- ============================================================================

-- ============================================================================
-- PHASE 1: BEST-PRACTICES (20 Einträge)
-- ============================================================================

INSERT INTO best_practices (title, category, do_this, dont_this, reasoning, example_code, tags, usage_count)
VALUES
  -- Component Patterns
  (
    'Component Registry Check Before Creation',
    'component_creation',
    'ALWAYS query component_registry before creating new components',
    'NEVER create components from memory without checking if they exist',
    'Prevents duplicate components and ensures consistency. component_registry is the single source of truth.',
    'const { data } = await supabase.from(''component_registry'').select(''*'').ilike(''component_name'', ''%Button%'');',
    ARRAY['component', 'registry', 'duplication', 'v5'],
    0
  ),
  
  (
    'V28.1 Slate-Palette ONLY',
    'design_system',
    'Use Tailwind-native Slate colors: text-slate-900, bg-slate-50, border-slate-200',
    'NEVER use designTokens.colors.primary.DEFAULT or custom CSS variables for colors',
    'V28.1 Design System uses exclusively Tailwind Slate palette. Harmonizes all pages automatically.',
    'className="text-slate-900 bg-slate-50 border-slate-200 hover:bg-slate-100"',
    ARRAY['v28', 'design-system', 'colors', 'slate'],
    0
  ),
  
  (
    'Safe User Property Access',
    'typescript_safety',
    'Always use Optional Chaining (?.) and Nullish Coalescing (??)',
    'NEVER access properties directly without null checks (user.name)',
    'Prevents runtime errors when properties are undefined. TypeScript Strict Mode requires this.',
    'const userName = user?.name ?? ''Unbekannt''; const email = user?.email ?? '''';',
    ARRAY['typescript', 'null-check', 'safety', 'optional-chaining'],
    0
  ),
  
  -- Supabase Patterns
  (
    'Supabase RLS Security Definer',
    'security',
    'Always use SECURITY DEFINER SET search_path = ''public'' for RLS functions',
    'NEVER create functions without SECURITY DEFINER (allows privilege escalation)',
    'SECURITY DEFINER ensures functions run with owner privileges. SET search_path prevents search_path injection attacks.',
    'CREATE FUNCTION check_user() RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''public'' AS $$ BEGIN RETURN auth.uid() IS NOT NULL; END; $$;',
    ARRAY['supabase', 'rls', 'security', 'postgres'],
    0
  ),
  
  (
    'Knowledge-Base Check Mandatory',
    'workflow',
    'ALWAYS run mandatory-knowledge-check BEFORE implementation',
    'NEVER skip knowledge-check step (causes hallucinations)',
    'V5.0 requires knowledge-base validation before every task. Ensures AI uses existing patterns.',
    'await supabase.functions.invoke(''mandatory-knowledge-check'', { body: { task_description, task_type } });',
    ARRAY['workflow', 'v5', 'mandatory', 'knowledge-base'],
    0
  ),
  
  -- Form Patterns
  (
    'Form Fields from Registry',
    'form_handling',
    'Import field definitions from FORM_FIELDS_REGISTRY',
    'NEVER hardcode form fields (causes inconsistency)',
    'form-fields-registry.ts is single source of truth for all 210+ form fields. Ensures consistency.',
    'import { BOOKING_FIELDS } from ''@/config/form-fields-registry''; const fields = [BOOKING_FIELDS.customer, BOOKING_FIELDS.pickupDate];',
    ARRAY['forms', 'registry', 'consistency'],
    0
  ),
  
  (
    'Zod Schema Validation Always',
    'validation',
    'Validate ALL user inputs with Zod schemas',
    'NEVER trust client data without validation',
    'Prevents XSS, SQL Injection, Type Errors. Zod provides runtime type-safety.',
    'const result = validateOrder(formData); if (!result.success) { console.error(result.error); return; }',
    ARRAY['zod', 'validation', 'security', 'type-safety'],
    0
  ),
  
  -- Layout Patterns
  (
    'Mobile-First Grid Patterns',
    'layout',
    'Use GRID_PATTERNS from layout-standards.ts',
    'NEVER use custom grid classes (causes inconsistency)',
    'layout-standards.ts defines all responsive grid patterns. Mobile-First approach ensures accessibility.',
    'import { GRID_PATTERNS } from ''@/config/layout-standards''; className={GRID_PATTERNS[''HERO-GRID''].full}',
    ARRAY['layout', 'mobile-first', 'grid', 'responsive'],
    0
  ),
  
  (
    'Touch-Target Minimum 44px',
    'accessibility',
    'All interactive elements: min-h-[44px] min-w-[44px]',
    'NEVER use smaller touch targets (fails WCAG 2.5.5)',
    'Apple HIG + WCAG require ≥44px touch targets. Essential for mobile accessibility.',
    'className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center"',
    ARRAY['accessibility', 'touch-target', 'wcag', 'mobile'],
    0
  ),
  
  -- Error Handling
  (
    'Centralized Error Handling',
    'error_handling',
    'Use handleError() from @/lib/error-handler for ALL errors',
    'NEVER use console.error or toast directly',
    'Centralized error handling logs to Supabase, triggers SMI learning, provides consistent UX.',
    'import { handleError } from ''@/lib/error-handler''; try { ... } catch (error) { handleError(error, ''Operation''); }',
    ARRAY['error-handling', 'logging', 'smi'],
    0
  ),
  
  -- Content Patterns
  (
    'Content from Central Content.ts',
    'content_management',
    'Import all text strings from @/lib/content/de-DE',
    'NEVER hardcode strings in JSX (prevents i18n)',
    'Central content.ts enables i18n, consistent terminology, easy updates.',
    'import { content } from ''@/lib/content/de-DE''; <Button>{content.buttons.save}</Button>',
    ARRAY['content', 'i18n', 'consistency'],
    0
  ),
  
  -- Performance
  (
    'React Query for Data Fetching',
    'performance',
    'Use React Query (useQuery) for all data fetching',
    'NEVER use useEffect + useState for API calls',
    'React Query provides caching, deduplication, background refetching. Reduces API load.',
    'const { data, isLoading } = useQuery({ queryKey: [''bookings''], queryFn: fetchBookings });',
    ARRAY['react-query', 'performance', 'caching'],
    0
  ),
  
  -- Database Patterns
  (
    'RLS Policies for Multi-Tenancy',
    'database',
    'ALL tables must have company_id column + RLS policies',
    'NEVER allow cross-company data access',
    'Multi-tenant isolation via RLS prevents data leaks. DSGVO compliance requires this.',
    'CREATE POLICY "Users access own company" ON bookings FOR SELECT USING (company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid()));',
    ARRAY['rls', 'multi-tenant', 'security', 'dsgvo'],
    0
  ),
  
  -- TypeScript Patterns
  (
    'Infer Types from Zod Schemas',
    'typescript',
    'Use z.infer<typeof Schema> for type definitions',
    'NEVER duplicate types manually (causes drift)',
    'Single source of truth: Zod schema defines both validation AND types.',
    'export type Order = z.infer<typeof CreateOrderSchema>;',
    ARRAY['typescript', 'zod', 'type-inference'],
    0
  ),
  
  -- React Patterns
  (
    'Component Props Interface Naming',
    'react',
    'Name Props interfaces: {ComponentName}Props',
    'NEVER use generic names like Props or IProps',
    'Clear naming improves code readability and IDE autocomplete.',
    'interface ButtonProps { variant: string; size: string; }',
    ARRAY['react', 'typescript', 'naming'],
    0
  ),
  
  -- Styling Patterns
  (
    'Tailwind Semantic Tokens Only',
    'styling',
    'Use CSS variables from index.css (--primary, --background)',
    'NEVER use direct colors (text-blue-500)',
    'Semantic tokens enable theme switching and consistent design.',
    'className="text-primary bg-background border-border"',
    ARRAY['tailwind', 'design-system', 'theming'],
    0
  ),
  
  -- SEO Patterns
  (
    'SEO Component for Every Page',
    'seo',
    'Every page must import SEO component with unique meta tags',
    'NEVER omit meta tags (reduces search visibility)',
    'SEO component ensures proper Open Graph, Twitter Cards, canonical URLs.',
    'import { SEO } from ''@/components/SEO''; <SEO title="Page Title" description="..." />',
    ARRAY['seo', 'meta-tags', 'opengraph'],
    0
  ),
  
  -- API Patterns
  (
    'Edge Functions for External APIs',
    'api',
    'ALL external API calls MUST go through Edge Functions',
    'NEVER expose API keys in client code',
    'Edge Functions hide API keys, enable CORS, provide rate limiting.',
    'const { data } = await supabase.functions.invoke(''external-api-call'', { body: { ... } });',
    ARRAY['edge-functions', 'security', 'api'],
    0
  ),
  
  -- Testing Patterns
  (
    'Test Coverage for Critical Paths',
    'testing',
    'Write tests for: Auth, Payment, Booking flows',
    'NEVER skip tests for revenue-critical features',
    'Tests prevent regressions in critical business logic.',
    'describe(''Booking Flow'', () => { it(''creates booking'', async () => { ... }); });',
    ARRAY['testing', 'vitest', 'critical-path'],
    0
  ),
  
  -- Documentation Patterns
  (
    'JSDoc for Public Functions',
    'documentation',
    'Add JSDoc comments to ALL exported functions',
    'NEVER leave public APIs undocumented',
    'JSDoc enables IDE tooltips, auto-generated docs, better DX.',
    '/** * Creates a new booking * @param data Booking data * @returns Promise<Booking> */ export async function createBooking(data: BookingData) { ... }',
    ARRAY['documentation', 'jsdoc', 'dx'],
    0
  );

-- ============================================================================
-- PHASE 2: CODE-SNIPPETS (15 Einträge)
-- ============================================================================

INSERT INTO code_snippets (pattern_name, code, description, language, tags, usage_count, success_rate, metadata)
VALUES
  -- Supabase Patterns
  (
    'Supabase Query with RLS',
    'const { data, error } = await supabase
  .from(''bookings'')
  .select(''*'')
  .eq(''company_id'', companyId)
  .order(''created_at'', { ascending: false });

if (error) {
  handleError(error, ''Fetch Bookings'');
  return;
}',
    'Standard Supabase query with RLS company_id filter, error handling, and ordering',
    'typescript',
    ARRAY['supabase', 'rls', 'query'],
    0,
    1.0,
    '{"best_for": "Data fetching with multi-tenant isolation"}'::jsonb
  ),
  
  (
    'Supabase Insert with Error Handling',
    'const { data, error } = await supabase
  .from(''bookings'')
  .insert({
    company_id: companyId,
    customer_id: customerId,
    pickup_address: pickupAddress,
    // ... more fields
  })
  .select()
  .single();

if (error) {
  handleError(error, ''Create Booking'');
  return null;
}

return data;',
    'Insert with error handling and return new record',
    'typescript',
    ARRAY['supabase', 'insert', 'crud'],
    0,
    1.0,
    '{"returns": "Newly created record or null"}'::jsonb
  ),
  
  -- React Query Patterns
  (
    'React Query useQuery Pattern',
    'import { useQuery } from ''@tanstack/react-query'';
import { supabase } from ''@/integrations/supabase/client'';

export function useBookings(companyId: string) {
  return useQuery({
    queryKey: [''bookings'', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(''bookings'')
        .select(''*'')
        .eq(''company_id'', companyId);
      
      if (error) throw error;
      return data;
    },
    staleTime: 60000, // 1 minute
  });
}',
    'Custom React Query hook for data fetching with caching',
    'typescript',
    ARRAY['react-query', 'hooks', 'caching'],
    0,
    1.0,
    '{"caching": "1 minute stale time"}'::jsonb
  ),
  
  -- Form Patterns
  (
    'Zod Form Validation Pattern',
    'import { z } from ''zod'';
import { useForm } from ''react-hook-form'';
import { zodResolver } from ''@hookform/resolvers/zod'';

const bookingSchema = z.object({
  customer_id: z.string().uuid(),
  pickup_address: z.string().min(5),
  pickup_date: z.date(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customer_id: '''',
      pickup_address: '''',
      pickup_date: new Date(),
    },
  });
  
  const onSubmit = async (data: BookingFormData) => {
    // Handle form submission
  };
  
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}',
    'Complete form setup with Zod validation and React Hook Form',
    'typescript',
    ARRAY['zod', 'react-hook-form', 'validation'],
    0,
    1.0,
    '{"type_safe": true, "validation": "client-side"}'::jsonb
  ),
  
  -- Component Patterns
  (
    'V28 Button Component Import',
    'import { V28Button } from ''@/components/v28/V28Button'';

<V28Button
  variant="primary"
  size="md"
  onClick={handleClick}
>
  Button Text
</V28Button>',
    'Standard V28.1 Button usage (NEVER recreate buttons)',
    'typescript',
    ARRAY['v28', 'button', 'component'],
    0,
    1.0,
    '{"variants": ["primary", "secondary", "outline", "ghost"]}'::jsonb
  ),
  
  -- Error Handling Patterns
  (
    'Centralized Error Handling Pattern',
    'import { handleError } from ''@/lib/error-handler'';

try {
  const result = await someOperation();
  if (!result) {
    throw new Error(''Operation failed'');
  }
  return result;
} catch (error) {
  handleError(error, ''Operation Name'', {
    context: { userId: user.id, action: ''create'' },
    showToast: true,
    logToSentry: true,
  });
  return null;
}',
    'Standard error handling with context and options',
    'typescript',
    ARRAY['error-handling', 'logging'],
    0,
    1.0,
    '{"logs_to": ["console", "supabase", "sentry"]}'::jsonb
  ),
  
  -- Layout Patterns
  (
    'Responsive Grid Layout',
    'import { GRID_PATTERNS } from ''@/config/layout-standards'';

<div className={GRID_PATTERNS[''HERO-GRID''].full}>
  <div className="bg-slate-50 p-6 rounded-lg">
    <h3 className="text-slate-900">Card 1</h3>
  </div>
  <div className="bg-slate-50 p-6 rounded-lg">
    <h3 className="text-slate-900">Card 2</h3>
  </div>
  <div className="bg-slate-50 p-6 rounded-lg">
    <h3 className="text-slate-900">Card 3</h3>
  </div>
</div>',
    'Mobile-first responsive grid using layout-standards',
    'typescript',
    ARRAY['layout', 'grid', 'responsive'],
    0,
    1.0,
    '{"breakpoints": "mobile: 1col, tablet: 2col, desktop: 3col"}'::jsonb
  ),
  
  -- Authentication Patterns
  (
    'Supabase Auth Check',
    'import { supabase } from ''@/integrations/supabase/client'';

const { data: { user }, error } = await supabase.auth.getUser();

if (error || !user) {
  console.error(''Not authenticated'');
  return null;
}

// User is authenticated
const userId = user.id;',
    'Check if user is authenticated',
    'typescript',
    ARRAY['auth', 'supabase'],
    0,
    1.0,
    '{"returns": "user object or null"}'::jsonb
  ),
  
  -- RLS Patterns
  (
    'Create RLS Policy',
    'CREATE POLICY "Users can view their company bookings"
  ON bookings
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id
      FROM profiles
      WHERE user_id = auth.uid()
    )
  );',
    'Standard RLS policy for multi-tenant data access',
    'sql',
    ARRAY['rls', 'postgres', 'security'],
    0,
    1.0,
    '{"applies_to": "Multi-tenant tables"}'::jsonb
  ),
  
  -- Realtime Patterns
  (
    'Supabase Realtime Subscription',
    'import { useEffect } from ''react'';
import { supabase } from ''@/integrations/supabase/client'';

useEffect(() => {
  const channel = supabase
    .channel(''bookings-changes'')
    .on(
      ''postgres_changes'',
      {
        event: ''*'',
        schema: ''public'',
        table: ''bookings'',
        filter: `company_id=eq.${companyId}`,
      },
      (payload) => {
        console.log(''Change received!'', payload);
        // Refresh data
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [companyId]);',
    'Subscribe to realtime database changes',
    'typescript',
    ARRAY['realtime', 'supabase', 'websocket'],
    0,
    1.0,
    '{"events": ["INSERT", "UPDATE", "DELETE"]}'::jsonb
  ),
  
  -- Edge Function Patterns
  (
    'Edge Function Invocation',
    'import { supabase } from ''@/integrations/supabase/client'';

const { data, error } = await supabase.functions.invoke(''function-name'', {
  body: {
    param1: value1,
    param2: value2,
  },
});

if (error) {
  handleError(error, ''Edge Function Call'');
  return null;
}

return data;',
    'Call Supabase Edge Function from client',
    'typescript',
    ARRAY['edge-functions', 'supabase'],
    0,
    1.0,
    '{"auto_auth": true, "cors": "enabled"}'::jsonb
  ),
  
  -- Migration Patterns
  (
    'Database Migration Template',
    '-- Add new column to existing table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS new_column TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_bookings_new_column
ON bookings(new_column);

-- Update existing records (if needed)
UPDATE bookings
SET new_column = ''default_value''
WHERE new_column IS NULL;',
    'Safe database migration pattern',
    'sql',
    ARRAY['migration', 'postgres', 'database'],
    0,
    1.0,
    '{"safe": "Uses IF NOT EXISTS for idempotency"}'::jsonb
  ),
  
  -- TypeScript Patterns
  (
    'Safe Property Access',
    'interface User {
  name?: string;
  email?: string;
  profile?: {
    avatar?: string;
  };
}

// Safe access with fallbacks
const userName = user?.name ?? ''Unbekannt'';
const userEmail = user?.email ?? '''';
const userAvatar = user?.profile?.avatar ?? ''/default-avatar.png'';

// Conditional rendering
{user?.profile?.avatar && (
  <img src={user.profile.avatar} alt={user?.name ?? ''User''} />
)}',
    'TypeScript optional chaining and nullish coalescing',
    'typescript',
    ARRAY['typescript', 'null-safety', 'optional-chaining'],
    0,
    1.0,
    '{"prevents": "Runtime errors from undefined properties"}'::jsonb
  ),
  
  -- Content Management
  (
    'Central Content Import',
    'import { content } from ''@/lib/content/de-DE'';

// Button texts
<Button>{content.buttons.save}</Button>
<Button>{content.buttons.cancel}</Button>

// Status texts
<Badge>{content.status.active}</Badge>

// Error messages
toast.error(content.errors.networkError);',
    'Import and use centralized content strings',
    'typescript',
    ARRAY['content', 'i18n', 'consistency'],
    0,
    1.0,
    '{"supports": "i18n, consistent terminology"}'::jsonb
  ),
  
  -- Testing Patterns
  (
    'Vitest Component Test',
    'import { describe, it, expect } from ''vitest'';
import { render, screen, fireEvent } from ''@testing-library/react'';
import { BookingForm } from ''./BookingForm'';

describe(''BookingForm'', () => {
  it(''renders form fields'', () => {
    render(<BookingForm />);
    
    expect(screen.getByLabelText(''Kunde'')).toBeInTheDocument();
    expect(screen.getByLabelText(''Abholdatum'')).toBeInTheDocument();
  });
  
  it(''submits form data'', async () => {
    const onSubmit = vi.fn();
    render(<BookingForm onSubmit={onSubmit} />);
    
    fireEvent.click(screen.getByText(''Speichern''));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});',
    'Component test with Vitest and Testing Library',
    'typescript',
    ARRAY['vitest', 'testing', 'react'],
    0,
    1.0,
    '{"framework": "Vitest + Testing Library"}'::jsonb
  );

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check inserted counts
DO $$
DECLARE
  bp_count INTEGER;
  cs_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO bp_count FROM best_practices;
  SELECT COUNT(*) INTO cs_count FROM code_snippets;
  
  RAISE NOTICE 'Best Practices inserted: %', bp_count;
  RAISE NOTICE 'Code Snippets inserted: %', cs_count;
  
  IF bp_count < 20 THEN
    RAISE WARNING 'Expected at least 20 Best Practices, got %', bp_count;
  END IF;
  
  IF cs_count < 15 THEN
    RAISE WARNING 'Expected at least 15 Code Snippets, got %', cs_count;
  END IF;
END $$;