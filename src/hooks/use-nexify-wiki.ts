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

  const loadWiki = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const startTime = performance.now();

    try {
      if (enableLogging) {
        logger.info('[NeXify Wiki] Loading Wiki via brain-query...', { component: 'useNeXifyWiki' });
      }

      // Call brain-query edge function (session initialization)
      const { data, error: functionError } = await supabase.functions.invoke('brain-query', {
        body: {
          action: 'session-init',
          options: {
            loadLearnings: true,
            loadIssues: true,
            loadComponents: true,
            loadBestPractices: true,
            loadSelfReport: true,
          }
        }
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
  }, [enableLogging]);

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
    isReady: !!wikiData && !error,
  };
}
