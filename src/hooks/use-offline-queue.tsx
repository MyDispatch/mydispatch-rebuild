/* ==================================================================================
   OFFLINE-QUEUE HOOK - Resilient Operations
   ==================================================================================
   Speichert kritische Operationen bei Offline-Status
   ================================================================================== */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { softDelete } from '@/lib/database-utils';

interface QueuedOperation {
  id: string;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

const QUEUE_KEY = 'offline_operations_queue';
const MAX_QUEUE_SIZE = 100;

export function useOfflineQueue() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueSize, setQueueSize] = useState(0);

  // Online/Offline Detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: 'Online',
        description: 'Verbindung wiederhergestellt. Synchronisiere Daten...',
      });
      processQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'Offline',
        description: 'Keine Verbindung. Änderungen werden lokal gespeichert.',
        variant: 'destructive',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial Queue-Size laden
    updateQueueSize();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateQueueSize = () => {
    const queue = getQueue();
    setQueueSize(queue.length);
  };

  const getQueue = (): QueuedOperation[] => {
    const stored = localStorage.getItem(QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const setQueue = (queue: QueuedOperation[]) => {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    updateQueueSize();
  };

  const addToQueue = useCallback((operation: Omit<QueuedOperation, 'id' | 'timestamp'>) => {
    const queue = getQueue();
    
    if (queue.length >= MAX_QUEUE_SIZE) {
      toast({
        title: 'Queue voll',
        description: 'Maximale Anzahl von Offline-Operationen erreicht.',
        variant: 'destructive',
      });
      return;
    }

    const newOperation: QueuedOperation = {
      ...operation,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    queue.push(newOperation);
    setQueue(queue);

    toast({
      title: 'Operation gespeichert',
      description: 'Wird synchronisiert sobald Verbindung besteht.',
    });
  }, []);

  const processQueue = useCallback(async () => {
    const queue = getQueue();
    
    if (queue.length === 0) return;

    let processed = 0;
    let failed = 0;

    for (const operation of queue) {
      try {
        switch (operation.operation) {
          case 'insert':
            await (supabase.from as any)(operation.table).insert(operation.data);
            break;
          case 'update':
            await (supabase.from as any)(operation.table).update(operation.data).eq('id', operation.data.id);
            break;
          case 'delete':
            // SECURITY: Use Archiving instead of DELETE (SOLL-Vorgabe V18.3.24)
            await (supabase.from as any)(operation.table)
              .update({ 
                archived: true, 
                archived_at: new Date().toISOString() 
              })
              .eq('id', operation.data.id);
            break;
        }
        processed++;
      } catch (error) {
        failed++;
        logger.error('Queue processing failed', error as Error, {
          component: 'useOfflineQueue',
          action: 'processQueue',
          operation: operation.operation,
          table: operation.table
        });
      }
    }

    // Queue leeren bei erfolgreichem Processing
    if (failed === 0) {
      setQueue([]);
      toast({
        title: 'Synchronisierung abgeschlossen',
        description: `${processed} Operationen erfolgreich synchronisiert.`,
      });
    } else {
      toast({
        title: 'Teilweise synchronisiert',
        description: `${processed} erfolgreich, ${failed} fehlgeschlagen.`,
        variant: 'destructive',
      });
    }
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    toast({
      title: 'Queue geleert',
      description: 'Alle ausstehenden Operationen wurden entfernt.',
    });
  }, []);

  return {
    isOnline,
    queueSize,
    addToQueue,
    processQueue,
    clearQueue,
  };
}
