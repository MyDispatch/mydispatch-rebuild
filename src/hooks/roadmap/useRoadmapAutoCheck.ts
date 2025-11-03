import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RoadmapAutoCheckConfig {
  enabled: boolean;
  current_task: string;
  affected_files?: string[];
  affected_pages?: string[];
  onOpportunisticTasksFound?: (tasks: any[]) => void;
}

/**
 * Auto-Check Hook für Roadmap-System
 * 
 * Prüft automatisch bei Code-Änderungen, ob parallel Tasks erledigt werden können.
 * NUR in Dev-Mode aktiv!
 * 
 * @example
 * useRoadmapAutoCheck({
 *   enabled: true,
 *   current_task: 'Implementing Contact Page Hero',
 *   affected_files: ['src/pages/Contact.tsx'],
 *   affected_pages: ['contact']
 * });
 */
export function useRoadmapAutoCheck(config: RoadmapAutoCheckConfig) {
  useEffect(() => {
    // Nur in Dev-Mode und wenn enabled
    if (!config.enabled || import.meta.env.PROD) return;

    const checkRoadmap = async () => {
      try {
        if (import.meta.env.DEV) {
          console.log('🔍 [Roadmap Auto-Check] Starting...');
        }

        const { data, error } = await supabase.functions.invoke('roadmap-auto-checker', {
          body: {
            current_task_description: config.current_task,
            affected_files: config.affected_files || [],
            affected_pages: config.affected_pages || []
          }
        });

        if (error) {
          if (import.meta.env.DEV) {
            console.error('❌ [Roadmap Auto-Check] Error:', error);
          }
          return;
        }

        if (data.opportunistic_tasks?.length > 0) {
          if (import.meta.env.DEV) {
            console.group('💡 [Roadmap Auto-Check] Opportunistic Tasks Found!');
            data.opportunistic_tasks.forEach((task: any) => {
              console.log(`→ ${task.title} (Match: ${(task.match_score * 100).toFixed(0)}%)`);
              console.log(`  Reason: ${task.match_reason}`);
              console.log(`  Effort: ${task.estimated_hours}h`);
            });
            console.groupEnd();
          }

          // Callback ausführen
          config.onOpportunisticTasksFound?.(data.opportunistic_tasks);
        } else {
          if (import.meta.env.DEV) {
            console.log('✅ [Roadmap Auto-Check] No opportunistic tasks found');
          }
        }

      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('❌ [Roadmap Auto-Check] Exception:', err);
        }
      }
    };

    // Debounce: Warte 2s nach letzter Änderung
    const timer = setTimeout(checkRoadmap, 2000);
    return () => clearTimeout(timer);
  }, [config.current_task, config.affected_files, config.affected_pages, config.enabled, config.onOpportunisticTasksFound]);
}
