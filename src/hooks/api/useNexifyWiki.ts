import { useQuery } from '@tanstack/react-query';
import { logger } from '@/lib/logger';
import { searchWiki, loadWikiSessionInit } from '@/api/nexify';

export function useNexifyWikiSearch(query: string, limit = 5) {
  return useQuery({
    queryKey: ['nexify-wiki-search', query, limit],
    enabled: !!query && query.length > 1,
    queryFn: async () => {
      const res = await searchWiki(query, limit);
      if (!res.success) {
        logger.warn('useNexifyWikiSearch: search failed', res.error);
        throw new Error(res.error || 'search failed');
      }
      return res.data?.results || [];
    },
  });
}

export function useNexifyWikiSessionInit() {
  return useQuery({
    queryKey: ['nexify-wiki-session-init'],
    queryFn: async () => {
      const res = await loadWikiSessionInit();
      if (!res.success) {
        logger.warn('useNexifyWikiSessionInit: init failed', res.error);
        throw new Error(res.error || 'init failed');
      }
      return res.data?.session_data || {
        recent_learnings: [],
        critical_issues: [],
        active_components: [],
        best_practices: [],
        automation_patterns: [],
      };
    },
  });
}

// Kompatibilitätsalias: existierende Namenskonvention "useNeXifyWiki"
export const useNeXifyWiki = {
  useSearch: useNexifyWikiSearch,
  useSessionInit: useNexifyWikiSessionInit,
};

