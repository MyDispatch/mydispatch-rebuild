import { supabase } from "../supabase/client";
import type { AgentCommand, AgentStatus, Project } from "../../types";

export const nexifyAPI = {
  // Agent Status
  async getAgentStatus(): Promise<AgentStatus> {
    const { data, error } = await supabase.from("agent_status").select("*").single();

    if (error) {
      console.error("Error fetching agent status:", error);
      return {
        online: false,
        activity: "idle",
      };
    }

    return data || { online: false, activity: "idle" };
  },

  // Execute Command
  async executeCommand(command: string, projectCode?: string): Promise<AgentCommand> {
    const { data, error } = await supabase
      .from("agent_commands")
      .insert({
        command_type: "code",
        command_text: command,
        status: "pending",
        project_code: projectCode,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to execute command: ${error.message}`);
    }

    // Call Edge Function to execute command
    const { data: result, error: execError } = await supabase.functions.invoke(
      "nexify-ai-master-command",
      {
        body: {
          command,
          project_code: projectCode,
        },
      }
    );

    if (execError) {
      // Update command status to failed
      await supabase
        .from("agent_commands")
        .update({
          status: "failed",
          error_message: execError.message,
        })
        .eq("id", data.id);

      throw execError;
    }

    // Update command status
    await supabase
      .from("agent_commands")
      .update({
        status: result.status || "completed",
        result: result.result,
        execution_time_ms: result.execution_time_ms,
      })
      .eq("id", data.id);

    return {
      ...data,
      status: result.status || "completed",
      result: result.result,
    };
  },

  // Get Projects
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("nexify_projects")
      .select("*")
      .eq("status", "active")
      .order("priority", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }

    return data || [];
  },

  // Auto-Load Context
  async autoLoadContext() {
    const { data, error } = await supabase.functions.invoke("nexify-auto-load-context", {
      body: {
        user_email: "courbois1981@gmail.com",
        load_projects: true,
        load_global_knowledge: true,
      },
    });

    if (error) {
      console.error("Error loading context:", error);
      return null;
    }

    return data;
  },
};
