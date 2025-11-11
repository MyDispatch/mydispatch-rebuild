/* ==================================================================================
   useNeXifyWiki - Client-Side Wiki Integration Hook
   ==================================================================================
   Auto-loads NeXify Wiki on app start via brain-query Edge Function
   Provides access to:
   - Recent Learnings (last 10)
   - Critical Issues (unresolved)
   - Active Components (verified)
   - Best Practices (top usage)
   - Knowledge Graph Navigation
   ================================================================================== */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isOfflineDev as isOfflineEnv } from '@/integrations/supabase/env';
import { logger } from '@/lib/logger';

export interface WikiLoadResult {
  recentLearnings: any[];
  criticalIssues: any[];
  knownComponents: any[];
  bestPractices: any[];
  lastSelfReport: any | null;
  knowledgeGraphCoverage: number;
  totalDocs: number;
  loadTime: number;
  success: boolean;
  error?: string;
}

interface UseNeXifyWikiOptions {
  autoLoad?: boolean;
  enableLogging?: boolean;
}

export function useNeXifyWiki(options: UseNeXifyWikiOptions = {}) {
  const { autoLoad = true, enableLogging = true } = options;
  
  const [wikiData, setWikiData] = useState<WikiLoadResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBrainHealthy, setIsBrainHealthy] = useState<boolean>(false);

  const performHealthCheck = useCallback(async (headers?: Record<string, string>) => {
    try {
      // Versuche dedizierte Health-Check-Funktion; falls nicht vorhanden, blockiere brain-query
      const { data, error: healthError } = await supabase.functions.invoke('health-check', { headers });
      if (healthError) {
        throw new Error(healthError.message);
      }
      // Erwartet ein Objekt mit { ok: true } oder ähnlichem
      const ok = !!(data && (data.ok === true || data.status === 'ok'));
      setIsBrainHealthy(ok);
      if (enableLogging) {
        logger.info('[NeXify Wiki] Health-Check Ergebnis', { ok });
      }
      return ok;
    } catch (e) {
      // Wenn Health-Check fehlschlägt (z.B. Funktion nicht deployt), brain-query nicht ausführen
      setIsBrainHealthy(false);
      if (enableLogging) {
        logger.warn('[NeXify Wiki] Health-Check fehlgeschlagen, brain-query wird übersprungen');
      }
      return false;
    }
  }, [enableLogging]);

  const loadWiki = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const startTime = performance.now();

    try {
      // Offline-Guard: Wenn ENV unvollständig ist (z. B. fehlende URL/Keys), keine Netzwerk-Calls
      if (isOfflineEnv()) {
        if (enableLogging) {
          logger.warn('[NeXify Wiki] Offline-Dev erkannt: Supabase-ENV unvollständig, überspringe brain-query');
        }
        const loadTime = Math.round(performance.now() - startTime);
        const fallback: WikiLoadResult = {
          recentLearnings: [],
          criticalIssues: [],
          knownComponents: [],
          bestPractices: [],
          lastSelfReport: null,
          knowledgeGraphCoverage: 0,
          totalDocs: 0,
          loadTime,
          success: false,
          error: 'Offline-Dev: Supabase-ENV fehlt oder ist Platzhalter',
        };
        setWikiData(fallback);
        return fallback;
      }

      if (enableLogging) {
        logger.info('[NeXify Wiki] Loading Wiki via brain-query...', { component: 'useNeXifyWiki' });
      }

      // Call brain-query edge function (session initialization)
      const anon = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
      const headers = anon ? { apikey: anon, Authorization: `Bearer ${anon}` } : undefined;

      // Publizierbarer Key muss vorhanden sein
      if (!anon) {
        throw new Error('Fehlender Publishable/Anon Key für Supabase-Aufrufe');
      }

      // Health-Check vor brain-query: wenn nicht gesund, keine weiteren Aufrufe
      const healthy = await performHealthCheck(headers);
      if (!healthy) {
        if (enableLogging) {
          logger.warn('[NeXify Wiki] Health-Check nicht OK – brain-query wird übersprungen');
        }
        const loadTime = Math.round(performance.now() - startTime);
        const fallback: WikiLoadResult = {
          recentLearnings: [],
          criticalIssues: [],
          knownComponents: [],
          bestPractices: [],
          lastSelfReport: null,
          knowledgeGraphCoverage: 0,
          totalDocs: 0,
          loadTime,
          success: false,
          error: 'Edge Functions nicht gesund oder nicht deployt',
        };
        setWikiData(fallback);
        return fallback;
      }

      const { data, error: functionError } = await supabase.functions.invoke('brain-query', {
        headers,
        body: {
          query: 'session_init',
          include_best_practices: true,
          include_code_snippets: true,
          limit: 10,
        },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data || data.error) {
        throw new Error(data?.error || 'Wiki load failed');
      }

      const loadTime = performance.now() - startTime;

      const result: WikiLoadResult = {
        recentLearnings: data.recent_learnings || [],
        criticalIssues: data.critical_issues || [],
        knownComponents: data.known_components || [],
        bestPractices: data.best_practices || [],
        lastSelfReport: data.last_self_report || null,
        knowledgeGraphCoverage: data.knowledge_graph_coverage || 0,
        totalDocs: data.total_docs || 0,
        loadTime: Math.round(loadTime),
        success: true,
      };

      setWikiData(result);

      if (enableLogging) {
        logger.info('[NeXify Wiki] ✅ Wiki loaded successfully', {
          component: 'useNeXifyWiki',
          loadTime: result.loadTime,
          totalDocs: result.totalDocs,
          criticalIssues: result.criticalIssues.length,
          graphCoverage: result.knowledgeGraphCoverage,
        });
      }

      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      logger.error('[NeXify Wiki] Failed to load Wiki', err as Error, {
        component: 'useNeXifyWiki',
      });

      return {
        recentLearnings: [],
        criticalIssues: [],
        knownComponents: [],
        bestPractices: [],
        lastSelfReport: null,
        knowledgeGraphCoverage: 0,
        totalDocs: 0,
        loadTime: 0,
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, [enableLogging, performHealthCheck]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadWiki();
    }
  }, [autoLoad, loadWiki]);

  return {
    wikiData,
    isLoading,
    error,
    loadWiki,
    brainHealthy: isBrainHealthy,
    isReady: !!wikiData && !error,
  };
}
