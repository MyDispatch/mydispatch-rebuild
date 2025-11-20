/* ==================================================================================
   USE-DB-QUERY-AGENT HOOK V18.5.13
   ================================================================================== 
   React Hook für sichere Datenbankabfragen über DB-Query-Agent
   ================================================================================== */

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface QueryOptions {
  table: string;
  columns?: string;
  filters?: Record<string, any>;
  limit?: number;
}

interface QueryResult<T = any> {
  data: T[] | null;
  error: string | null;
  loading: boolean;
  metrics: {
    queryTimeMs: number;
    rowCount: number;
    table: string;
    estimatedCost?: number; // ⭐ NEU: DB-Load für Kosten-Prognose
  } | null;
}

export function useDbQueryAgent() {
  const [result, setResult] = useState<QueryResult>({
    data: null,
    error: null,
    loading: false,
    metrics: null,
  });

  const query = async <T = any>(options: QueryOptions): Promise<QueryResult<T>> => {
    setResult(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'db-query-agent',
        {
          body: options,
        }
      );

      if (functionError) {
        const errorResult = {
          data: null,
          error: functionError.message,
          loading: false,
          metrics: null,
        };
        setResult(errorResult);
        return errorResult;
      }

      if (!functionData.success) {
        const errorResult = {
          data: null,
          error: functionData.error || 'Query failed',
          loading: false,
          metrics: functionData.metrics || null,
        };
        setResult(errorResult);
        return errorResult;
      }

      const successResult = {
        data: functionData.data,
        error: null,
        loading: false,
        metrics: functionData.metrics,
      };
      setResult(successResult);
      return successResult;
    } catch (error: any) {
      const errorResult = {
        data: null,
        error: error.message || 'Unbekannter Fehler',
        loading: false,
        metrics: null,
      };
      setResult(errorResult);
      return errorResult;
    }
  };

  return {
    ...result,
    query,
  };
}
