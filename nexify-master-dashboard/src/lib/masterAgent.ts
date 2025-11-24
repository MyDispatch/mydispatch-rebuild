export type AgentMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};

export type WorkflowDefinition = {
  id: string;
  name: string;
  description: string;
  command: string;
  guardrails: string[];
};

export type WorkflowRunResponse = {
  id: string;
  status: "queued" | "running" | "completed" | "failed";
  message?: string;
};

const API_URL = import.meta.env.VITE_MASTER_AGENT_API_URL;

const FALLBACK_MESSAGES: AgentMessage[] = [
  {
    id: "system-1",
    role: "system",
    content: "NeXifyAI MASTER initialisiert. Prüfe NeXify Wiki & Forget-Proof Speicher.",
    createdAt: new Date().toISOString()
  },
  {
    id: "assistant-1",
    role: "assistant",
    content:
      "✅ Session init abgeschlossen. Supabase Schema `nexify_master` validiert. Bereit für Befehle.",
    createdAt: new Date().toISOString()
  }
];

const FALLBACK_WORKFLOWS: WorkflowDefinition[] = [
  {
    id: "wf-master-workflow",
    name: "Master Workflow",
    description: "Führt den gesamten Master-Validierungs- und Deploymentprozess aus.",
    command: "npm run master:workflow",
    guardrails: ["Vorher `validate:all` laufen lassen", "Deployment Status prüfen"]
  },
  {
    id: "wf-validate-all",
    name: "Validate All",
    description: "Linting, Typprüfungen und Unit Tests.",
    command: "npm run validate:all",
    guardrails: ["Keine offenen TODOs", "Supabase Policies geprüft"]
  }
];

export async function bootstrapConversation(): Promise<AgentMessage[]> {
  if (!API_URL) {
    return FALLBACK_MESSAGES;
  }

  const response = await fetch(`${API_URL}/chat/bootstrap`);
  if (!response.ok) {
    throw new Error(`Agent Bootstrap fehlgeschlagen (${response.status})`);
  }

  return (await response.json()) as AgentMessage[];
}

export async function sendAgentMessage(content: string): Promise<AgentMessage> {
  if (!API_URL) {
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      content: `Simulierte Antwort: ${content.slice(0, 120)}… (verbinde API für echte Antworten)`,
      createdAt: new Date().toISOString()
    };
  }

  const response = await fetch(`${API_URL}/chat/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ content })
  });

  if (!response.ok) {
    throw new Error(`Agent Antwort fehlgeschlagen (${response.status})`);
  }

  return (await response.json()) as AgentMessage;
}

export async function listWorkflows(): Promise<WorkflowDefinition[]> {
  if (!API_URL) {
    return FALLBACK_WORKFLOWS;
  }

  const response = await fetch(`${API_URL}/workflows`);
  if (!response.ok) {
    throw new Error(`Workflows konnten nicht geladen werden (${response.status})`);
  }

  return (await response.json()) as WorkflowDefinition[];
}

export async function triggerWorkflow(workflowId: string): Promise<WorkflowRunResponse> {
  if (!API_URL) {
    return {
      id: workflowId,
      status: "queued",
      message: "Simulation: API_URL konfigurieren, um echte Workflows zu starten."
    };
  }

  const response = await fetch(`${API_URL}/workflows/${workflowId}/trigger`, {
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(`Workflow konnte nicht gestartet werden (${response.status})`);
  }

  return (await response.json()) as WorkflowRunResponse;
}
