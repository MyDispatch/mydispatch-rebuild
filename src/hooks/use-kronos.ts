/* ==================================================================================
   USE-KRONOS HOOK - KRONOS V18.0
   ==================================================================================
   React Hook für Interaktion mit KRONOS Executor System
   ================================================================================== */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface Entity {
  id: string;
  entity_type: string;
  name: string;
  status: string;
  level: number;
  specification: any;
  generated_code?: string;
  file_path?: string;
  error_message?: string;
  execution_time_ms?: number;
}

interface ExecutionRun {
  id: string;
  run_type: string;
  status: string;
  total_entities: number;
  completed_entities: number;
  failed_entities: number;
  current_level: number;
  total_levels: number;
  started_at: string;
  completed_at?: string;
}

interface ExecutionStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  failed: number;
  by_level: Record<number, number>;
}

export function useKronos() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentRun, setCurrentRun] = useState<ExecutionRun | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [stats, setStats] = useState<ExecutionStats | null>(null);
  const { toast } = useToast();

  // Parse Wiki to YAML Entities
  const parseWiki = useCallback(async (options?: { mode?: 'full' | 'incremental'; source?: 'knowledge_base' | 'markdown'; markdown?: string }) => {
    setIsLoading(true);
    try {
      toast({ title: '🔄 Wiki wird geparst...', description: 'Extrahiere Entities via AI' });

      const { data, error } = await supabase.functions.invoke('wiki-to-yaml-parser', {
        body: options || { mode: 'full', source: 'knowledge_base' },
      });

      if (error) throw error;

      toast({
        title: '✅ Wiki erfolgreich geparst',
        description: `${data.total} Entities erstellt`,
      });

      await loadEntities();
      return data;
    } catch (error) {
      logger.error('[useKronos] Parse Wiki error', error);
      toast({
        title: '❌ Wiki-Parsing fehlgeschlagen',
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Generate Dependency Graph
  const generateDependencyGraph = useCallback(async () => {
    setIsLoading(true);
    try {
      toast({ title: '📊 Dependency Graph wird erstellt...', description: 'Analysiere Dependencies' });

      const { data, error } = await supabase.functions.invoke('generate-dependency-graph');

      if (error) throw error;

      toast({
        title: '✅ Dependency Graph erstellt',
        description: `${data.graph.total_levels} Levels, ${data.graph.total_entities} Entities`,
      });

      await loadEntities();
      return data;
    } catch (error) {
      logger.error('[useKronos] Generate Graph error', error);
      toast({
        title: '❌ Graph-Erstellung fehlgeschlagen',
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Execute Code Generation
  const executeGeneration = useCallback(async (options?: { mode?: 'execute' | 'dry-run'; levels?: number[]; entity_ids?: string[] }) => {
    setIsLoading(true);
    try {
      toast({ title: '🚀 Code-Generierung gestartet', description: 'KRONOS Executor läuft...' });

      const { data, error } = await supabase.functions.invoke('kronos-executor', {
        body: options || { mode: 'execute' },
      });

      if (error) throw error;

      setCurrentRun({
        id: data.run_id,
        run_type: 'full',
        status: 'running',
        total_entities: 0,
        completed_entities: 0,
        failed_entities: 0,
        current_level: 0,
        total_levels: 0,
        started_at: new Date().toISOString(),
      });

      toast({
        title: '✅ Execution abgeschlossen',
        description: `${data.execution_summary.completed} Entities generiert`,
      });

      await loadEntities();
      return data;
    } catch (error) {
      logger.error('[useKronos] Execute error', error);
      toast({
        title: '❌ Execution fehlgeschlagen',
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load Entities from DB
  const loadEntities = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('entities_queue')
        .select('*')
        .order('level', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;

      setEntities(data as Entity[]);

      // Calculate stats
      const statsData: ExecutionStats = {
        total: data.length,
        pending: data.filter(e => e.status === 'pending').length,
        in_progress: data.filter(e => e.status === 'in_progress').length,
        completed: data.filter(e => e.status === 'completed').length,
        failed: data.filter(e => e.status === 'failed').length,
        by_level: {},
      };

      data.forEach(e => {
        statsData.by_level[e.level] = (statsData.by_level[e.level] || 0) + 1;
      });

      setStats(statsData);
    } catch (error) {
      logger.error('[useKronos] Load entities error', error);
    }
  }, []);

  // Load Current Run
  const loadCurrentRun = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('execution_runs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      setCurrentRun(data as ExecutionRun);
    } catch (error) {
      logger.error('[useKronos] Load run error', error);
    }
  }, []);

  // Retry failed entity
  const retryEntity = useCallback(async (entityId: string) => {
    try {
      await supabase
        .from('entities_queue')
        .update({ status: 'pending', error_message: null })
        .eq('id', entityId);

      toast({ title: '🔄 Entity zurückgesetzt', description: 'Bereit für erneute Ausführung' });
      await loadEntities();
    } catch (error) {
      logger.error('[useKronos] Retry entity error', error);
      toast({
        title: '❌ Fehler beim Zurücksetzen',
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
        variant: 'destructive',
      });
    }
  }, [toast, loadEntities]);

  return {
    // Actions
    parseWiki,
    generateDependencyGraph,
    executeGeneration,
    loadEntities,
    loadCurrentRun,
    retryEntity,

    // State
    isLoading,
    entities,
    stats,
    currentRun,
  };
}
