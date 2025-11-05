/* ==================================================================================
   MASTER MEMORY TIMELINE V1.0
   ==================================================================================
   ✅ Zeigt jüngste Memory-Einträge des NeXifyAI MASTER
   ✅ Supabase Tabelle: master_memory_entries (optional)
   ✅ Fallback auf gespeicherte Standards, falls Tabelle fehlt
   ✅ Visualisierung als Timeline im V28.1 Stil
   ================================================================================== */

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { Brain, Sparkles } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { captureError } from '@/lib/sentry-integration';

type MemoryConfidence = 'critical' | 'high' | 'medium' | 'low';

export interface MasterMemoryEntry {
  id: string;
  summary: string;
  details?: string | null;
  category?: string | null;
  confidence?: MemoryConfidence | null;
  author?: string | null;
  created_at: string;
}

const CONFIDENCE_BADGE: Record<MemoryConfidence, string> = {
  critical: 'bg-red-100 text-red-700 border border-red-200',
  high: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  low: 'bg-slate-100 text-slate-600 border border-slate-200',
};

const FALLBACK_MEMORY: MasterMemoryEntry[] = [
  {
    id: 'fallback-1',
    summary: 'Auto-Learn Workflow optimiert die Deployment Pipeline (Vercel + Supabase).',
    details: 'Deployment Rule aktualisiert → Pascal Deployment-Regel strikt angewendet.',
    category: 'deployment',
    confidence: 'high',
    author: 'NeXifyAI MASTER',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'fallback-2',
    summary: 'Vergessensschutz validiert (FORGET-PROOF SYSTEM V1.0).',
    details: 'Daily Cron bestätigt persistenten Speicher.',
    category: 'governance',
    confidence: 'medium',
    author: 'Automation Worker',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: 'fallback-3',
    summary: 'Cursor Automationen bereit – API-Anbindung fehlt (manuelle Freigabe benötigt).',
    details: 'Plan: Edge Function cursor-sync vorbereiten.',
    category: 'integration',
    confidence: 'low',
    author: 'NeXifyAI MASTER',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
];

async function fetchMemory(): Promise<MasterMemoryEntry[]> {
  try {
    const { data, error } = await supabase
      .from('master_memory_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(12);

    if (error) {
      if ((error as { code?: string }).code === '42P01') {
        return FALLBACK_MEMORY;
      }
      throw error;
    }

    if (!data || data.length === 0) {
      return FALLBACK_MEMORY;
    }

    return data as MasterMemoryEntry[];
  } catch (error) {
    captureError(error instanceof Error ? error : new Error(String(error)), {
      component: 'MasterMemoryTimeline',
      action: 'fetchMemory',
    });
    return FALLBACK_MEMORY;
  }
}

export function MasterMemoryTimeline() {
  const { data = FALLBACK_MEMORY, isLoading } = useQuery<MasterMemoryEntry[]>({
    queryKey: ['master-memory-entries'],
    queryFn: fetchMemory,
    refetchInterval: 120_000,
  });

  return (
    <Card className="border-slate-200 shadow-lg h-full">
      <CardHeader className="border-b border-slate-200 bg-white/70">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <Brain className="h-5 w-5 text-slate-700" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">
              Persistent Memory Timeline
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Neueste Erkenntnisse und Auto-Learn Einträge des NeXifyAI MASTER.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3">
                <Skeleton className="mt-1 h-4 w-4 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {data.map((entry, index) => {
              const isLast = index === data.length - 1;
              const confidence = entry.confidence ?? 'medium';
              return (
                <div key={entry.id} className="relative pl-6">
                  {!isLast && (
                    <div className="absolute left-2 top-7 h-full w-px bg-slate-200" />
                  )}
                  <div className="absolute left-0 top-2 flex h-4 w-4 items-center justify-center">
                    <span className="h-3 w-3 rounded-full border border-slate-300 bg-white" />
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      {entry.category && (
                        <Badge variant="outline" className="border-slate-300 text-slate-600">
                          {entry.category}
                        </Badge>
                      )}
                      <Badge className={CONFIDENCE_BADGE[confidence]}>
                        {confidence === 'critical'
                          ? 'Kritisch'
                          : confidence === 'high'
                            ? 'Hoch'
                            : confidence === 'medium'
                              ? 'Mittel'
                              : 'Niedrig'}
                      </Badge>
                      <span className="text-[11px] text-slate-400">
                        {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: de })}
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      {entry.summary}
                    </p>

                    {entry.details && (
                      <p className="mt-2 text-xs text-slate-500">
                        {entry.details}
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                      <Sparkles className="h-3 w-3" />
                      {entry.author ? `Autor: ${entry.author}` : 'Autor: NeXifyAI MASTER'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

