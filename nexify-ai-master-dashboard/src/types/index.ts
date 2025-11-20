export interface Project {
  id: string;
  project_name: string;
  project_code: string;
  project_type: "saas" | "website" | "app" | "automation";
  description?: string;
  website_url?: string;
  github_repo?: string;
  supabase_project_id?: string;
  status: "active" | "archived" | "on_hold";
  priority: number;
  tech_stack?: string[];
  total_sessions: number;
  total_tasks: number;
  total_components: number;
  last_activity_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AgentCommand {
  id: string;
  session_id?: string;
  command_type: "code" | "deploy" | "query" | "update" | "other";
  command_text: string;
  status: "pending" | "executing" | "completed" | "failed";
  result?: any;
  error_message?: string;
  execution_time_ms?: number;
  created_at: string;
}

export interface DashboardSession {
  id: string;
  user_id: string;
  session_start: string;
  session_end?: string;
  commands_executed: number;
  projects_accessed: string[];
  created_at: string;
}

export interface AgentStatus {
  online: boolean;
  activity: "idle" | "active" | "processing";
  current_project?: string;
  last_command?: string;
  uptime?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  project_code?: string;
  command_id?: string;
}
