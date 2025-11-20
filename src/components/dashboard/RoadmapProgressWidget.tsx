import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/lib/compat";
import { Progress } from "@/components/ui/progress";
import { Rocket, CheckCircle2, Clock, Loader2 } from "lucide-react";

/**
 * Roadmap Progress Widget für Dashboard
 *
 * Zeigt Fortschritt der Roadmap-Tasks mit:
 * - Gesamt-Fortschritt (%)
 * - Status-Breakdown (Completed/In Progress/Pending)
 * - Priority-Breakdown (P0/P1/P2)
 */
export function RoadmapProgressWidget() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["roadmap-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmap_tasks")
        .select("status, priority, estimated_hours, actual_hours");

      if (error) throw error;

      const total = data.length;
      const completed = data.filter((t) => t.status === "completed").length;
      const inProgress = data.filter((t) => t.status === "in_progress").length;
      const pending = data.filter((t) => t.status === "pending").length;

      const p0Tasks = data.filter((t) => t.priority === "P0");
      const p0Completed = p0Tasks.filter((t) => t.status === "completed").length;

      const totalEstimatedHours = data.reduce((sum, t) => sum + (t.estimated_hours || 0), 0);
      const completedHours = data
        .filter((t) => t.status === "completed")
        .reduce((sum, t) => sum + (t.actual_hours || t.estimated_hours || 0), 0);

      return {
        total,
        completed,
        inProgress,
        pending,
        completionPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
        priorityBreakdown: {
          p0: `${p0Completed}/${p0Tasks.length}`,
          p1: `${data.filter((t) => t.priority === "P1" && t.status === "completed").length}/${data.filter((t) => t.priority === "P1").length}`,
          p2: `${data.filter((t) => t.priority === "P2" && t.status === "completed").length}/${data.filter((t) => t.priority === "P2").length}`,
        },
        hours: {
          total: totalEstimatedHours.toFixed(1),
          completed: completedHours.toFixed(1),
          remaining: (totalEstimatedHours - completedHours).toFixed(1),
        },
      };
    },
    refetchInterval: 30000, // Refresh alle 30s
  });

  if (isLoading) {
    return (
      <Card className="p-6 bg-slate-50 border-slate-200">
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-slate-50 border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Roadmap Progress</h3>
          <p className="text-sm text-slate-600">Content & Design Strategy V28.1</p>
        </div>
      </div>

      {/* Gesamt-Fortschritt */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">Overall Progress</span>
          <span className="text-2xl font-bold text-slate-900">{stats?.completionPercent}%</span>
        </div>
        <Progress value={stats?.completionPercent} className="h-3 bg-slate-200" />
        <div className="mt-2 text-xs text-slate-600">
          {stats?.completed}/{stats?.total} Tasks completed
        </div>
      </div>

      {/* Status-Breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{stats?.completed}</div>
          </div>
          <div className="text-xs text-slate-600">Completed</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Loader2 className="w-4 h-4 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{stats?.inProgress}</div>
          </div>
          <div className="text-xs text-slate-600">In Progress</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-4 h-4 text-slate-400" />
            <div className="text-2xl font-bold text-slate-400">{stats?.pending}</div>
          </div>
          <div className="text-xs text-slate-600">Pending</div>
        </div>
      </div>

      {/* Priority-Breakdown */}
      <div className="border-t border-slate-200 pt-4">
        <div className="text-sm font-medium text-slate-700 mb-3">By Priority</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">P0 (Critical)</span>
            <span className="font-mono font-medium text-slate-900">
              {stats?.priorityBreakdown.p0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">P1 (High)</span>
            <span className="font-mono font-medium text-slate-900">
              {stats?.priorityBreakdown.p1}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">P2 (Medium)</span>
            <span className="font-mono font-medium text-slate-900">
              {stats?.priorityBreakdown.p2}
            </span>
          </div>
        </div>
      </div>

      {/* Stunden-Breakdown */}
      <div className="border-t border-slate-200 pt-4 mt-4">
        <div className="text-sm font-medium text-slate-700 mb-3">Estimated Hours</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Total</span>
            <span className="font-mono font-medium text-slate-900">{stats?.hours.total}h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Completed</span>
            <span className="font-mono font-medium text-green-600">{stats?.hours.completed}h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Remaining</span>
            <span className="font-mono font-medium text-slate-400">{stats?.hours.remaining}h</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
