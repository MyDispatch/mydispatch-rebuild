/* ==================================================================================
   NEXIFY AGENT TASK BOARD V1.0
   ==================================================================================
   ✅ Zeigt aktive Tasks des NeXifyAI MASTER Agents
   ✅ Nutzt Supabase (master_agent_tasks)
   ✅ Graceful Degradation bei fehlender Tabelle / Edge Function
   ✅ 100% V28.1 Design-System konform
   ================================================================================== */

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { AlertTriangle, CheckCircle2, Clock, Sparkles } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { V28Button } from '@/components/design-system/V28Button';
import { supabase } from '@/integrations/supabase/client';
import { captureError } from '@/lib/sentry-integration';

type AgentTaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';
type AgentTaskPriority = 'low' | 'medium' | 'high';

export interface AgentTask {
  id: string;
  title: string;
  status: AgentTaskStatus;
  priority: AgentTaskPriority;
  category?: string | null;
  owner?: string | null;
  created_at: string;
  updated_at?: string | null;
  due_at?: string | null;
}

const PRIORITY_BADGE_VARIANTS: Record<AgentTaskPriority, string> = {
  high: 'bg-rose-100 text-rose-700 border border-rose-200',
  medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  low: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
};

const STATUS_LABELS: Record<AgentTaskStatus, { label: string; icon: JSX.Element }> = {
  pending: {
    label: 'Wartend',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  in_progress: {
    label: 'In Arbeit',
    icon: <Sparkles className="h-3.5 w-3.5" />,
  },
  completed: {
    label: 'Abgeschlossen',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  blocked: {
    label: 'Blockiert',
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
};

async function fetchAgentTasks(): Promise<AgentTask[]> {
  try {
    const { data, error } = await supabase
      .from('master_agent_tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(12);

    if (error) {
      // Graceful fallback bei fehlender Tabelle (code 42P01)
      if ((error as { code?: string }).code === '42P01') {
        return [];
      }

      throw error;
    }

    return (data ?? []) as AgentTask[];
  } catch (error) {
    captureError(error instanceof Error ? error : new Error(String(error)), {
      component: 'NeXifyAgentTaskBoard',
      action: 'fetchAgentTasks',
    });
    return [];
  }
}

export function NeXifyAgentTaskBoard() {
  const {
    data: tasks = [],
    isLoading,
    refetch,
  } = useQuery<AgentTask[]>({
    queryKey: ['master-agent-tasks'],
    queryFn: fetchAgentTasks,
    refetchInterval: 60_000,
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (tasks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
          <Sparkles className="h-8 w-8 text-slate-400" />
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Keine offenen Agent-Tasks
            </p>
            <p className="text-xs text-slate-500">
              Der NeXifyAI MASTER ist bereit für neue Aufträge.
            </p>
          </div>
        </div>
      );
    }

    return (
      <ScrollArea className="max-h-[360px] pr-4">
        <div className="space-y-4">
          {tasks.map((task) => {
            const statusMeta = STATUS_LABELS[task.status];
            const lastUpdate = task.updated_at ?? task.created_at;
            const relativeTime = formatDistanceToNow(new Date(lastUpdate), {
              addSuffix: true,
              locale: de,
            });

            return (
              <div
                key={task.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={PRIORITY_BADGE_VARIANTS[task.priority]}>
                        {task.priority === 'high'
                          ? 'Priorität Hoch'
                          : task.priority === 'medium'
                            ? 'Priorität Mittel'
                            : 'Priorität Niedrig'}
                      </Badge>
                      {task.category && (
                        <Badge variant="outline" className="border-slate-300 text-slate-600">
                          {task.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                    {task.owner && (
                      <p className="text-xs text-slate-500">
                        Verantwortlich: <span className="font-medium text-slate-600">{task.owner}</span>
                      </p>
                    )}
                  </div>

                  <Badge variant="secondary" className="flex items-center gap-1 border border-slate-200">
                    {statusMeta.icon}
                    <span>{statusMeta.label}</span>
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>
                    Aktualisiert {relativeTime}
                  </span>
                  {task.due_at && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Fällig {formatDistanceToNow(new Date(task.due_at), { addSuffix: true, locale: de })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Card className="border-slate-200 shadow-lg">
      <CardHeader className="border-b border-slate-200 bg-white/70">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Agent Task Queue
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Priorisierte Aufgaben für den NeXifyAI MASTER. Aktualisiert automatisch alle 60 Sekunden.
            </CardDescription>
          </div>
          <V28Button variant="secondary" size="sm" onClick={() => refetch()}>
            Aktualisieren
          </V28Button>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {renderContent()}
      </CardContent>
    </Card>
  );
}

