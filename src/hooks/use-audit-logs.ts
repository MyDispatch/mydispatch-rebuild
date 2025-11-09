/* ==================================================================================
   USE-AUDIT-LOGS HOOK - Centralized Audit Logging
   ==================================================================================
   ✅ Fire-and-forget pattern (keine UI-Blockierung)
   ✅ Automatic error logging
   ✅ Reusable across all hooks
   ✅ Query recent activities for timeline
   ================================================================================== */

import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { FileText, CheckCircle, Users, Car } from 'lucide-react';

export interface AuditLogData {
  id: string;
  company_id: string;
  user_id: string;
  action: 'create' | 'update' | 'delete' | 'archive';
  entity_type: string;
  entity_id: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  created_at: string;
}

interface TimelineItem {
  id: string;
  time: string;
  type: 'booking' | 'payment' | 'warning' | 'driver' | 'vehicle' | 'invoice';
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

export function useAuditLogs() {
  const { mutate: logAudit } = useMutation({
    mutationFn: async (logData: AuditLogData) => {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert(logData);
      
      if (error) throw error;
      return data;
    },
    // Fire-and-forget: No UI blocking
    onError: (error) => {
      logger.error('[Audit Log] Failed to log action', error as Error, {
        component: 'useAuditLogs',
        action: 'logAudit'
      });
    },
  });

  const { data: rawActivities = [], isLoading } = useQuery({
    queryKey: ['audit-logs-recent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000, // Refresh every 30s
  });

  // Transform audit logs into timeline items
  const activities: TimelineItem[] = rawActivities.map((log: AuditLogData) => {
    const getIcon = () => {
      switch (log.entity_type) {
        case 'booking': return FileText;
        case 'driver': return Users;
        case 'vehicle': return Car;
        default: return CheckCircle;
      }
    };

    const getType = () => {
      switch (log.entity_type) {
        case 'booking': return 'booking' as const;
        case 'driver': return 'driver' as const;
        case 'vehicle': return 'vehicle' as const;
        default: return 'booking' as const;
      }
    };

    const formatTime = () => {
      const date = new Date(log.created_at);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Gerade eben';
      if (diffMins < 60) return `Vor ${diffMins} Min`;
      if (diffMins < 1440) return `Vor ${Math.floor(diffMins / 60)} Std`;
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    };

    return {
      id: log.id,
      time: formatTime(),
      type: getType(),
      icon: getIcon(),
      title: `${log.action} - ${log.entity_type}`,
      description: `${log.entity_type} ID: ${log.entity_id}`,
      status: log.action === 'delete' ? 'warning' : 'success'
    };
  });

  return { logAudit, activities, isLoading };
}
