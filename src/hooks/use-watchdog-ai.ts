/**
 * WATCHDOG-AI HOOK V18.5.1
 * 
 * React Hook for interacting with Watchdog-AI and Central Brain
 */

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface WatchdogScanResult {
  success: boolean;
  scan_type: string;
  results_count: number;
  critical_count: number;
  warning_count: number;
  info_count: number;
  results: unknown[];
}

interface AgentStatus {
  agent_name: string;
  status: 'idle' | 'working' | 'syncing' | 'error';
  current_task?: string;
  last_sync_at?: string;
  data: Record<string, unknown>;
  version: string;
}

export function useWatchdogAI() {
  const [isScanning, setIsScanning] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const triggerScan = async (scan_type: 'full' | 'frontend' | 'backend' | 'docs' | 'tests' = 'full'): Promise<WatchdogScanResult | null> => {
    setIsScanning(true);
    toast.info(`Starte ${scan_type === 'full' ? 'vollständigen' : scan_type} Scan...`);

    try {
      const { data, error } = await supabase.functions.invoke('central-brain', {
        body: {
          action: 'trigger_watchdog_scan',
          payload: { scan_type }
        }
      });

      if (error) throw error;

      const result = data.result as WatchdogScanResult;

      if (result.critical_count > 0) {
        toast.error(`🚨 ${result.critical_count} kritische Probleme gefunden!`);
      } else if (result.warning_count > 0) {
        toast.warning(`⚠️ ${result.warning_count} Warnungen gefunden`);
      } else {
        toast.success(`✅ Scan abgeschlossen: Alles in Ordnung`);
      }

      return result;
    } catch (error: Error | unknown) {
      logger.error('[useWatchdogAI] Scan failed', error, { component: 'useWatchdogAI' });
      toast.error(`Scan fehlgeschlagen: ${error.message}`);
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  const syncAgents = async (): Promise<any> => {
    setIsSyncing(true);
    toast.info('Synchronisiere Agenten...');

    try {
      const { data, error } = await supabase.functions.invoke('central-brain', {
        body: { action: 'sync_agents' }
      });

      if (error) throw error;

      const result = data.result;

      if (result.all_synced) {
        toast.success(`✅ Alle ${result.agents_count} Agenten synchronisiert`);
      } else {
        toast.warning(`⚠️ ${result.outdated_agents.length} Agenten veraltet: ${result.outdated_agents.join(', ')}`);
      }

      return result;
    } catch (error: Error | unknown) {
      logger.error('[useWatchdogAI] Sync failed', error, { component: 'useWatchdogAI' });
      toast.error(`Synchronisierung fehlgeschlagen: ${error.message}`);
      return null;
    } finally {
      setIsSyncing(false);
    }
  };

  const getAgentStatus = async (agent_name?: string): Promise<AgentStatus | AgentStatus[] | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('central-brain', {
        body: {
          action: 'get_agent_status',
          agent_name
        }
      });

      if (error) throw error;

      return data.result;
    } catch (error: Error | unknown) {
      logger.error('[useWatchdogAI] Get status failed', error, { component: 'useWatchdogAI' });
      toast.error(`Status-Abfrage fehlgeschlagen: ${error.message}`);
      return null;
    }
  };

  const updateAgentStatus = async (
    agent_name: string,
    status: 'idle' | 'working' | 'syncing' | 'error',
    current_task?: string,
    data?: Record<string, unknown>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.functions.invoke('central-brain', {
        body: {
          action: 'update_agent_status',
          agent_name,
          payload: { status, current_task, data }
        }
      });

      if (error) throw error;

      return true;
    } catch (error: Error | unknown) {
      logger.error('[useWatchdogAI] Update status failed', error, { component: 'useWatchdogAI' });
      toast.error(`Status-Update fehlgeschlagen: ${error.message}`);
      return false;
    }
  };

  return {
    isScanning,
    isSyncing,
    triggerScan,
    syncAgents,
    getAgentStatus,
    updateAgentStatus,
  };
}
