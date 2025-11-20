import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/**
 * Dokumentations-Sync Hook - Dauerhafte Dokumentations-Konsistenz
 * 
 * Synchronisiert automatisch NEXIFY_SYSTEM_MASTER_BRAIN.md mit aktuellen System-Zuständen.
 * Nutzt Supabase Edge Function für persistente Dokumentations-Updates.
 * 
 * @param enabled - Aktiviert/Deaktiviert die automatische Synchronisation
 */
export function useDocSync(enabled: boolean = false) {
  const syncDocumentation = useCallback(async (updates: {
    section: string;
    content: string;
    timestamp: string;
  }) => {
    if (!enabled) return;

    try {
      logger.info('[Doc-Sync] Syncing documentation section', { 
        component: 'useDocSync', 
        section: updates.section 
      });

      const { data, error } = await supabase.functions.invoke('datadoc-sync', {
        body: {
          action: 'update',
          document: 'NEXIFY_SYSTEM_MASTER_BRAIN',
          section: updates.section,
          content: updates.content,
          timestamp: updates.timestamp,
        }
      });

      if (error) {
        logger.error('[Doc-Sync] Error', error as Error, { component: 'useDocSync' });
        return false;
      }

      logger.info('[Doc-Sync] Documentation synced successfully', { component: 'useDocSync' });
      return true;

    } catch (error) {
      logger.error('[Doc-Sync] Unexpected error', error as Error, { component: 'useDocSync' });
      return false;
    }
  }, [enabled]);

  const logSessionProgress = useCallback(async (progress: {
    phase: string;
    status: string;
    completedTasks: string[];
    metrics: Record<string, any>;
  }) => {
    if (!enabled) return;

    const timestamp = new Date().toISOString();
    
    const content = `
## ${progress.phase} - ${timestamp}

**Status:** ${progress.status}

### Abgeschlossene Tasks:
${progress.completedTasks.map(t => `- ✅ ${t}`).join('\n')}

### Metriken:
${Object.entries(progress.metrics).map(([key, value]) => `- **${key}:** ${value}`).join('\n')}
`;

    return syncDocumentation({
      section: '8.1 SESSION-HISTORIE',
      content,
      timestamp,
    });
  }, [enabled, syncDocumentation]);

  useEffect(() => {
    if (!enabled) return;

    // Auto-Sync bei Page-Unload (Sitzungsende)
    const handleUnload = () => {
      // Beacon API für zuverlässiges Logging beim Verlassen
      if (navigator.sendBeacon) {
        const data = new Blob([JSON.stringify({
          action: 'session_end',
          timestamp: new Date().toISOString(),
        })], { type: 'application/json' });
        
        navigator.sendBeacon('/api/doc-sync', data);
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [enabled]);

  return {
    syncDocumentation,
    logSessionProgress,
    isEnabled: enabled,
  };
}
