# 🔌 API INTEGRATION TEMPLATE - MyDispatch

## Standard Pattern für alle API-Integrationen

---

## Template-Struktur

### 1. Custom Hook (Recommended Pattern)

```typescript
/* ==================================================================================
   use[API-NAME] HOOK - [KURZBESCHREIBUNG]
   ==================================================================================
   ✅ TanStack Query (React Query) Integration
   ✅ Error Handling & Loading States
   ✅ TypeScript strict mode
   ✅ Optimistic Updates (falls relevant)
   ================================================================================== */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/* ==================================================================================
   TYPES & INTERFACES
   ================================================================================== */

interface ApiDataType {
  id: string;
  name: string;
  // ... weitere Felder
}

interface ApiQueryParams {
  filter?: string;
  sortBy?: string;
  limit?: number;
}

interface ApiMutationParams {
  id: string;
  data: Partial<ApiDataType>;
}

/* ==================================================================================
   API FUNCTIONS
   ================================================================================== */

// GET - Fetch Data
async function fetchApiData(params?: ApiQueryParams): Promise<ApiDataType[]> {
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .eq('filter', params?.filter || '')
    .order(params?.sortBy || 'created_at', { ascending: false })
    .limit(params?.limit || 10);
  
  if (error) throw error;
  return data || [];
}

// POST - Create Data
async function createApiData(newData: Omit<ApiDataType, 'id'>): Promise<ApiDataType> {
  const { data, error } = await supabase
    .from('table_name')
    .insert(newData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// PATCH - Update Data
async function updateApiData({ id, data }: ApiMutationParams): Promise<ApiDataType> {
  const { data: updated, error } = await supabase
    .from('table_name')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return updated;
}

// DELETE - Delete Data
async function deleteApiData(id: string): Promise<void> {
  const { error } = await supabase
    .from('table_name')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

/* ==================================================================================
   CUSTOM HOOKS
   ================================================================================== */

// Query Hook - GET
export function useApiData(params?: ApiQueryParams) {
  return useQuery({
    queryKey: ['api-data', params],
    queryFn: () => fetchApiData(params),
    staleTime: 5 * 60 * 1000, // 5 Minuten
    gcTime: 10 * 60 * 1000,   // 10 Minuten
  });
}

// Mutation Hook - CREATE
export function useCreateApiData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createApiData,
    onSuccess: () => {
      // Invalidate & Refetch
      queryClient.invalidateQueries({ queryKey: ['api-data'] });
      toast.success('Erfolgreich erstellt');
    },
    onError: (error: Error) => {
      console.error('Create failed:', error);
      toast.error('Fehler beim Erstellen');
    },
  });
}

// Mutation Hook - UPDATE
export function useUpdateApiData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateApiData,
    onMutate: async ({ id, data }) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: ['api-data'] });
      
      const previousData = queryClient.getQueryData<ApiDataType[]>(['api-data']);
      
      queryClient.setQueryData<ApiDataType[]>(['api-data'], (old) => 
        old?.map(item => item.id === id ? { ...item, ...data } : item)
      );
      
      return { previousData };
    },
    onError: (error, _, context) => {
      // Rollback
      queryClient.setQueryData(['api-data'], context?.previousData);
      console.error('Update failed:', error);
      toast.error('Fehler beim Aktualisieren');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-data'] });
      toast.success('Erfolgreich aktualisiert');
    },
  });
}

// Mutation Hook - DELETE
export function useDeleteApiData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteApiData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-data'] });
      toast.success('Erfolgreich gelöscht');
    },
    onError: (error: Error) => {
      console.error('Delete failed:', error);
      toast.error('Fehler beim Löschen');
    },
  });
}
```

---

### 2. Component Usage

```typescript
import { useApiData, useCreateApiData, useUpdateApiData, useDeleteApiData } from '@/hooks/useApiName';

function MyComponent() {
  // Fetch Data
  const { data, isLoading, error } = useApiData({ filter: 'active' });
  
  // Mutations
  const createMutation = useCreateApiData();
  const updateMutation = useUpdateApiData();
  const deleteMutation = useDeleteApiData();
  
  // Handlers
  const handleCreate = () => {
    createMutation.mutate({ name: 'New Item' });
  };
  
  const handleUpdate = (id: string) => {
    updateMutation.mutate({ id, data: { name: 'Updated' } });
  };
  
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };
  
  // Loading State
  if (isLoading) return <div>Loading...</div>;
  
  // Error State
  if (error) return <div>Error: {error.message}</div>;
  
  // Render Data
  return (
    <div>
      {data?.map(item => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => handleUpdate(item.id)}>Update</button>
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </div>
      ))}
      <button onClick={handleCreate}>Create New</button>
    </div>
  );
}
```

---

## Supabase Realtime Integration

```typescript
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useApiDataRealtime(params?: ApiQueryParams) {
  const queryClient = useQueryClient();
  const query = useApiData(params);
  
  useEffect(() => {
    const channel = supabase
      .channel('table_name_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'table_name',
        },
        (payload) => {
          console.log('Realtime change:', payload);
          
          // Invalidate Query on any change
          queryClient.invalidateQueries({ queryKey: ['api-data'] });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  return query;
}
```

---

## Edge Function Integration

```typescript
/* ==================================================================================
   EDGE FUNCTION CALL
   ================================================================================== */

async function callEdgeFunction<T>(
  functionName: string,
  payload: Record<string, any>
): Promise<T> {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body: payload,
  });
  
  if (error) throw error;
  return data as T;
}

// Usage
export function useEdgeFunctionCall() {
  return useMutation({
    mutationFn: ({ functionName, payload }: { functionName: string; payload: any }) =>
      callEdgeFunction(functionName, payload),
    onSuccess: (data) => {
      console.log('Edge function success:', data);
      toast.success('Erfolgreich verarbeitet');
    },
    onError: (error: Error) => {
      console.error('Edge function error:', error);
      toast.error('Fehler bei der Verarbeitung');
    },
  });
}
```

---

## External API Integration (via Edge Function)

```typescript
/* ==================================================================================
   EXTERNAL API (z.B. HERE Maps, OpenAI, etc.)
   ================================================================================== */

interface ExternalApiResponse {
  result: string;
  metadata: Record<string, any>;
}

async function callExternalApi(
  endpoint: string,
  params: Record<string, any>
): Promise<ExternalApiResponse> {
  // Call via Edge Function (Secrets sind dort sicher)
  const { data, error } = await supabase.functions.invoke('external-api-proxy', {
    body: {
      endpoint,
      params,
    },
  });
  
  if (error) throw error;
  return data;
}

export function useExternalApi() {
  return useMutation({
    mutationFn: callExternalApi,
    onSuccess: (data) => {
      console.log('External API success:', data);
    },
    onError: (error: Error) => {
      console.error('External API error:', error);
      toast.error('Externe API-Anfrage fehlgeschlagen');
    },
  });
}
```

---

## Error Handling Best Practices

```typescript
import { SupabaseError } from '@supabase/supabase-js';

function handleSupabaseError(error: SupabaseError): string {
  // RLS Policy Violation
  if (error.code === '42501') {
    return 'Zugriff verweigert. Bitte einloggen.';
  }
  
  // Foreign Key Constraint
  if (error.code === '23503') {
    return 'Daten können nicht gelöscht werden (Verknüpfungen vorhanden).';
  }
  
  // Unique Constraint
  if (error.code === '23505') {
    return 'Eintrag existiert bereits.';
  }
  
  // Generic
  return error.message || 'Ein Fehler ist aufgetreten';
}

// Usage in Hook
onError: (error: SupabaseError) => {
  const message = handleSupabaseError(error);
  toast.error(message);
}
```

---

## Checklist API Integration

**Vor Implementation:**
- [ ] Database Schema existiert (Tabelle, RLS Policies)
- [ ] TypeScript Types definiert
- [ ] Query Key Strategy geplant
- [ ] Error Handling definiert
- [ ] Realtime nötig? (Supabase Realtime)
- [ ] External API? (Edge Function als Proxy)

**Nach Implementation:**
- [ ] Hook dokumentiert (Kommentare)
- [ ] In CHANGELOG.md eingetragen
- [ ] Error Cases getestet
- [ ] Loading States geprüft
- [ ] Optimistic Updates funktionieren
- [ ] Toast-Notifications korrekt

---

**LAST UPDATE:** 2025-01-26  
**VERSION:** 1.0  
**STATUS:** ✅ TEMPLATE READY
