import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { listWorkflows, triggerWorkflow } from "@/lib/masterAgent";
import { toast } from "@/lib/toast";

export function WorkflowLauncher() {
  const { data: workflows, isLoading } = useQuery({
    queryKey: ["master-workflows"],
    queryFn: listWorkflows
  });
  const [pendingWorkflow, setPendingWorkflow] = useState<string | null>(null);

  const handleTrigger = async (workflowId: string) => {
    setPendingWorkflow(workflowId);
    try {
      const response = await triggerWorkflow(workflowId);
      toast({
        title: `Workflow ${response.id}`,
        description: response.message ?? `Status: ${response.status}`,
        variant: response.status === "failed" ? "error" : "success"
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Workflow Start fehlgeschlagen",
        description: (error as Error)?.message ?? "Siehe Logs",
        variant: "error"
      });
    } finally {
      setPendingWorkflow(null);
    }
  };

  return (
    <section className="flex h-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Master Workflows</h3>
          <p className="text-xs text-slate-400">Bringt Validierung & Deployment zusammen.</p>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-300">
          {isLoading ? "lädt" : `${workflows?.length ?? 0} Workflows`}
        </span>
      </header>
      <div className="space-y-3 overflow-y-auto">
        {(workflows ?? []).map((workflow) => (
          <article key={workflow.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-100">{workflow.name}</h4>
                <p className="mt-1 text-xs text-slate-400">{workflow.description}</p>
              </div>
              <span className="rounded-full bg-slate-800 px-2 py-1 text-[11px] uppercase tracking-wide text-slate-300">
                {workflow.command}
              </span>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-slate-400">
              {workflow.guardrails.map((guardrail) => (
                <li key={guardrail}>• {guardrail}</li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleTrigger(workflow.id)}
                disabled={pendingWorkflow === workflow.id}
                className="rounded-lg bg-primary-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-400 disabled:opacity-60"
              >
                {pendingWorkflow === workflow.id ? "Wird gestartet…" : "Workflow starten"}
              </button>
            </div>
          </article>
        ))}
        {!isLoading && (workflows?.length ?? 0) === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-xs text-slate-500">
            Noch keine Workflows registriert. Verbinde das Agent-API, um Master Workflows zu laden.
          </p>
        ) : null}
      </div>
    </section>
  );
}
