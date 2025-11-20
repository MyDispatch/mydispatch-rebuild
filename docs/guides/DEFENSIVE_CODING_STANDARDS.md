# Defensive Coding Standards für MyDispatch V18.3

**Ziel:** Maximale System-Resilienz und Fehlertoleranz durch strukturierte Defensive Programming Practices.

---

## 1. HOOKS - Defensive Standards

### Regel 1.1: Try-Catch-Blocks PFLICHT
Jeder Hook, der externe Daten lädt oder API-Calls macht, MUSS Try-Catch-Blocks haben.

```typescript
// ❌ FALSCH - Keine Error-Behandlung
export const useCustomers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await supabase.from('customers').select('*');
      return data;
    }
  });
  return { customers: data, isLoading };
};

// ✅ RICHTIG - Mit Error-Handling und Fallback
export const useCustomers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('customers').select('*');
        if (error) throw error;
        return data || [];
      } catch (error) {
        logError({
          message: 'Failed to fetch customers',
          context: { error }
        });
        throw error;
      }
    }
  });
  
  return { 
    customers: data || [], // Fallback-Value
    isLoading, 
    error 
  };
};
```

### Regel 1.2: Fallback-Values PFLICHT
Hooks MÜSSEN IMMER sichere Fallback-Werte zurückgeben.

```typescript
// ✅ RICHTIG - Fallbacks für alle Szenarien
return {
  customers: data || [],           // Leeres Array statt undefined
  isLoading: isLoading ?? true,    // Default zu true
  error: error || null,            // Explizit null
  refetch: refetch || (() => {})   // No-op Funktion als Fallback
};
```

---

## 2. COMPONENTS - Defensive Standards

### Regel 2.1: Loading-, Error- und Empty-States PFLICHT
Jede Component MUSS alle drei States abdecken.

```typescript
// ✅ RICHTIG - Alle States abgedeckt
export const CustomersTable = () => {
  const { customers, isLoading, error } = useCustomers();

  // 1. Loading State
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 2. Error State
  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Fehler beim Laden"
        description="Kunden konnten nicht geladen werden."
        action={<Button onClick={refetch}>Erneut versuchen</Button>}
      />
    );
  }

  // 3. Empty State
  if (customers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Keine Kunden"
        description="Es wurden noch keine Kunden angelegt."
        action={<Button onClick={onCreateNew}>Ersten Kunden anlegen</Button>}
      />
    );
  }

  // 4. Success State
  return <Table data={customers} />;
};
```

### Regel 2.2: Props-Validierung mit TypeScript
Props MÜSSEN typsicher und mit Defaults versehen sein.

```typescript
// ✅ RICHTIG - Type-Safe Props mit Defaults
interface KPICardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType;
  trend?: number;              // Optional
  loading?: boolean;           // Optional
  onClick?: () => void;        // Optional
}

export const KPICard = ({
  title,
  value,
  icon: Icon,
  trend = 0,                   // Default
  loading = false,             // Default
  onClick
}: KPICardProps) => {
  // Component Logic
};
```

### Regel 2.3: Event-Handler Error-Handling
Event-Handler MÜSSEN Try-Catch-Blocks haben.

```typescript
// ✅ RICHTIG - Try-Catch in Event-Handler
const handleDelete = async (id: string) => {
  try {
    setIsDeleting(true);
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    handleSuccess('Kunde erfolgreich gelöscht');
    refetch();
  } catch (error) {
    handleError(error, 'Fehler beim Löschen des Kunden');
  } finally {
    setIsDeleting(false);
  }
};
```

---

## 3. API CALLS - Defensive Standards

### Regel 3.1: Retry-Logic PFLICHT
API-Calls MÜSSEN Retry-Logic mit Exponential Backoff haben.

```typescript
// ✅ RICHTIG - Mit Retry-Logic
const fetchWithRetry = async (
  fn: () => Promise<any>, 
  retries = 3,
  backoff = 1000
): Promise<any> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(fn, retries - 1, backoff * 2);
    }
    throw error;
  }
};

// Verwendung
const { data } = await fetchWithRetry(() => 
  supabase.from('customers').select('*')
);
```

### Regel 3.2: Timeout-Handling
API-Calls MÜSSEN Timeouts haben.

```typescript
// ✅ RICHTIG - Mit Timeout
const fetchWithTimeout = async (
  fn: () => Promise<any>,
  timeout = 10000
): Promise<any> => {
  return Promise.race([
    fn(),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};
```

### Regel 3.3: Cache-Strategy
Häufig abgerufene Daten MÜSSEN gecacht werden.

```typescript
// ✅ RICHTIG - Mit React Query Cache
const { data } = useQuery({
  queryKey: ['customers', companyId],
  queryFn: fetchCustomers,
  staleTime: 5 * 60 * 1000,    // 5 Minuten
  cacheTime: 10 * 60 * 1000,   // 10 Minuten
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
});
```

---

## 4. MOBILE - Defensive Standards

### Regel 4.1: Touch-Target-Größe
Alle interaktiven Elemente MÜSSEN mindestens 44x44px sein (iOS HIG).

```typescript
// ✅ RICHTIG - Mobile-optimierte Button-Größe
<Button 
  className="min-h-[44px] min-w-[44px] touch-manipulation"
  onClick={handleClick}
>
  Speichern
</Button>
```

### Regel 4.2: Viewport-Overflow-Prevention
Components MÜSSEN Viewport-Overflow verhindern.

```typescript
// ✅ RICHTIG - Overflow-Prevention
<div className="w-full max-w-full overflow-x-hidden">
  <Table className="min-w-full" />
</div>
```

### Regel 4.3: Mobile-First-Media-Queries
Styles MÜSSEN Mobile-First geschrieben werden.

```typescript
// ✅ RICHTIG - Mobile-First
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

---

## 5. FORMS - Defensive Standards

### Regel 5.1: Client-Side-Validation
Forms MÜSSEN Client-Side-Validation haben.

```typescript
// ✅ RICHTIG - Mit Zod-Validation
const customerSchema = z.object({
  first_name: z.string().min(1, 'Vorname ist erforderlich'),
  last_name: z.string().min(1, 'Nachname ist erforderlich'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z.string().regex(/^\+?[0-9\s-]+$/, 'Ungültige Telefonnummer')
});

const form = useForm<CustomerFormData>({
  resolver: zodResolver(customerSchema),
  defaultValues: {
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  }
});
```

### Regel 5.2: Server-Side-Validation
Forms MÜSSEN auch Server-Side-Validation haben.

```typescript
// ✅ RICHTIG - Server-Side Validation in Edge Function
const { data, error: validationError } = customerSchema.safeParse(body);

if (!validationError) {
  return new Response(
    JSON.stringify({ error: 'Validation failed', details: validationError }),
    { status: 400, headers: corsHeaders }
  );
}
```

---

## 6. DATABASE - Defensive Standards

### Regel 6.1: RLS IMMER aktiv
ALLE Tabellen MÜSSEN Row Level Security aktiviert haben.

```sql
-- ✅ RICHTIG - RLS aktiviert
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own customers" 
ON customers FOR SELECT 
USING (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));
```

### Regel 6.2: Soft-Delete statt Hard-Delete
NIEMALS Hard-Delete verwenden, IMMER Archiving.

```typescript
// ❌ FALSCH - Hard Delete
await supabase.from('customers').delete().eq('id', id);

// ✅ RICHTIG - Soft Delete
await supabase
  .from('customers')
  .update({ archived: true, archived_at: new Date().toISOString() })
  .eq('id', id);
```

---

## 7. ERROR-HANDLING - Defensive Standards

### Regel 7.1: Zentrale Error-Handler verwenden
IMMER `handleError()` aus `error-handler.ts` verwenden.

```typescript
// ✅ RICHTIG - Zentraler Error-Handler
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

### Regel 7.2: Error-Boundaries nutzen
Components MÜSSEN in Error-Boundaries gewrappt sein.

```typescript
// ✅ RICHTIG - Mit Error Boundary
<ErrorBoundary>
  <Dashboard />
</ErrorBoundary>

<WidgetErrorBoundary widgetName="Live-Map">
  <LiveMapHERE />
</WidgetErrorBoundary>
```

---

## 8. PERFORMANCE - Defensive Standards

### Regel 8.1: Debouncing für Suchen
Suchfelder MÜSSEN Debouncing haben.

```typescript
// ✅ RICHTIG - Mit Debounce
const debouncedSearch = useDebouncedValue(searchTerm, 300);

useEffect(() => {
  if (debouncedSearch) {
    performSearch(debouncedSearch);
  }
}, [debouncedSearch]);
```

### Regel 8.2: Lazy-Loading für große Listen
Große Listen MÜSSEN virtualisiert oder paginiert sein.

```typescript
// ✅ RICHTIG - Mit Pagination
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['customers'],
  queryFn: ({ pageParam = 0 }) => fetchCustomers(pageParam),
  getNextPageParam: (lastPage, pages) => lastPage.hasMore ? pages.length : undefined
});
```

---

## 9. SECURITY - Defensive Standards

### Regel 9.1: Input-Sanitization
Alle User-Inputs MÜSSEN sanitized werden.

```typescript
// ✅ RICHTIG - Input-Sanitization
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Entferne HTML-Tags
    .substring(0, 1000);  // Limit length
};
```

### Regel 9.2: NIEMALS Secrets im Frontend
API-Keys MÜSSEN auf dem Backend sein.

```typescript
// ❌ FALSCH - API-Key im Frontend
const API_KEY = 'sk-1234567890';

// ✅ RICHTIG - API-Key in Edge Function
const API_KEY = Deno.env.get('OPENAI_API_KEY');
```

---

## 10. TESTING - Defensive Standards

### Regel 10.1: Unit-Tests für kritische Funktionen
Kritische Business-Logic MUSS getestet sein.

```typescript
// ✅ RICHTIG - Unit Test
describe('calculateProvision', () => {
  it('should calculate 15% provision correctly', () => {
    expect(calculateProvision(100, 15)).toBe(15);
  });

  it('should handle invalid input', () => {
    expect(calculateProvision(-100, 15)).toBe(0);
    expect(calculateProvision(100, -15)).toBe(0);
  });
});
```

---

## CHECKLISTE: Defensive Code Review

Vor jedem Commit diese Checkliste durchgehen:

- [ ] Alle Hooks haben Try-Catch und Fallback-Values
- [ ] Alle Components haben Loading-, Error- und Empty-States
- [ ] Alle API-Calls haben Retry-Logic und Timeouts
- [ ] Alle Forms haben Client- und Server-Side-Validation
- [ ] Alle interaktiven Mobile-Elemente sind ≥44px
- [ ] Alle Tabellen mit >50 Rows haben Pagination
- [ ] Alle Error-Handler nutzen zentrale `handleError()`
- [ ] Alle Secrets sind auf Backend
- [ ] Alle RLS-Policies sind aktiv
- [ ] Alle Deletes sind Soft-Deletes
- [ ] Alle Images haben Alt-Text
- [ ] Alle Inputs haben Labels
- [ ] Keine `console.log/error/warn` (nur `logger.ts`)
- [ ] Keine Direct-Color-Values (nur Semantic-Tokens)

---

**Version:** V18.3  
**Stand:** 19.10.2025  
**Status:** ✅ PRODUCTION STANDARDS
