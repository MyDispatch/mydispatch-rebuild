/* ==================================================================================
   USE-AUDIT-LOGS HOOK - Aktivitäts-Feed für Dashboard
   ==================================================================================
   - Lädt audit_logs aus Supabase (letzte 24h)
   - Mappt zu ActivityTimeline-Format
   - Echtzeit-Updates via Supabase Realtime
   ================================================================================== */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { useEffect } from 'react';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Car,
  TrendingUp,
  Edit,
  Archive,
  UserPlus
} from 'lucide-react';

interface AuditLog {
  id: string;
  company_id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_data?: any;
  new_data?: any;
  created_at: string;
}

interface TimelineActivity {
  id: string;
  time: string;
  type: 'booking' | 'payment' | 'warning' | 'driver' | 'vehicle' | 'invoice';
  icon: any;
  title: string;
  description: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  meta?: { label: string; value: string }[];
  actions?: { label: string; onClick: () => void }[];
}

export function useAuditLogs() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: auditLogs = [], isLoading } = useQuery({
    queryKey: ['audit-logs', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return [];

      // Letzte 24 Stunden
      const yesterday = new Date();
      yesterday.setHours(yesterday.getHours() - 24);

      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('company_id', profile.company_id)
        .gte('created_at', yesterday.toISOString())
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as AuditLog[];
    },
    enabled: !!profile?.company_id,
    staleTime: 10000, // 10s für Live-Feed
    refetchInterval: 30000, // Auto-refresh alle 30s
  });

  // Polling statt Realtime für Live-Updates
  useEffect(() => {
    if (!profile?.company_id) return;

    // Auto-Invalidate alle 30s für Live-Feed
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['audit-logs', profile.company_id] });
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [profile?.company_id, queryClient]);

  // Map audit_logs zu Timeline-Format
  const activities: TimelineActivity[] = auditLogs.map(log => {
    const timeDiff = getTimeDifference(log.created_at);
    
    // Basis-Aktivität
    const activity: TimelineActivity = {
      id: log.id,
      time: timeDiff,
      type: mapEntityToType(log.entity_type),
      icon: getIconForEntity(log.entity_type),
      title: getTitleForAction(log.action, log.entity_type),
      description: getDescriptionForLog(log),
      status: getStatusForAction(log.action),
    };

    // Meta-Daten hinzufügen (z.B. Preis bei Buchungen)
    if (log.entity_type === 'booking' && log.new_data) {
      activity.meta = [
        { label: 'Preis', value: formatCurrency(log.new_data.price) },
      ];
      if (log.new_data.driver_id) {
        activity.meta.push({ label: 'Status', value: log.new_data.status });
      }
    }

    return activity;
  });

  return {
    activities,
    isLoading,
    rawLogs: auditLogs,
  };
}

// Helper: Zeit-Differenz formatieren
function getTimeDifference(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'gerade eben';
  if (diffMins < 60) return `vor ${diffMins} Min`;
  if (diffHours < 24) return `vor ${diffHours}h`;
  return `vor ${diffDays}d`;
}

// Helper: Entity-Type zu Timeline-Type
function mapEntityToType(entityType: string): TimelineActivity['type'] {
  switch (entityType) {
    case 'booking': return 'booking';
    case 'invoice': return 'invoice';
    case 'driver': return 'driver';
    case 'vehicle': return 'vehicle';
    default: return 'booking';
  }
}

// Helper: Icon für Entity-Type
function getIconForEntity(entityType: string) {
  switch (entityType) {
    case 'booking': return FileText;
    case 'invoice': return FileText;
    case 'driver': return Users;
    case 'vehicle': return Car;
    case 'payment': return TrendingUp;
    default: return FileText;
  }
}

// Helper: Titel für Action
function getTitleForAction(action: string, entityType: string): string {
  if (action === 'create') {
    switch (entityType) {
      case 'booking': return 'Neuer Auftrag erstellt';
      case 'driver': return 'Neuer Fahrer angelegt';
      case 'vehicle': return 'Neues Fahrzeug hinzugefügt';
      case 'customer': return 'Neuer Kunde angelegt';
      default: return 'Neuer Eintrag';
    }
  }
  if (action === 'update') {
    switch (entityType) {
      case 'booking': return 'Auftrag aktualisiert';
      case 'driver': return 'Fahrer-Daten geändert';
      case 'vehicle': return 'Fahrzeug-Daten geändert';
      default: return 'Eintrag aktualisiert';
    }
  }
  if (action === 'archive') return `${entityType} archiviert`;
  return action;
}

// Helper: Beschreibung aus Log-Daten
function getDescriptionForLog(log: AuditLog): string {
  if (!log.new_data) return log.entity_type;

  if (log.entity_type === 'booking') {
    const from = log.new_data.pickup_address || 'Unbekannt';
    const to = log.new_data.dropoff_address || 'Unbekannt';
    return `${from} → ${to}`;
  }

  if (log.entity_type === 'driver') {
    const name = `${log.new_data.first_name || ''} ${log.new_data.last_name || ''}`.trim();
    if (log.action === 'update' && log.old_data?.shift_status !== log.new_data.shift_status) {
      return `${name}: ${log.new_data.shift_status}`;
    }
    return name || 'Fahrer';
  }

  if (log.entity_type === 'vehicle') {
    return log.new_data.license_plate || 'Fahrzeug';
  }

  return log.entity_type;
}

// Helper: Status für Action
function getStatusForAction(action: string): TimelineActivity['status'] {
  switch (action) {
    case 'create': return 'info';
    case 'update': return undefined;
    case 'archive': return 'warning';
    case 'delete': return 'error';
    default: return undefined;
  }
}

// Helper: Währung formatieren
function formatCurrency(amount: number | null | undefined): string {
  if (!amount) return '0,00 €';
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
