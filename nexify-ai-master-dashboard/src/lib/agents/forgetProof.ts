import { supabase } from "../supabase/client";
import { nexifyAPI } from "../api/nexify";

export interface ForgetProofContext {
  projects: any[];
  globalKnowledge: {
    recent_learnings: any[];
    critical_issues: any[];
    components: any[];
    best_practices: any[];
    code_snippets: any[];
  };
  crmData: {
    companies: any[];
    contacts: any[];
  };
  sessionContext: {
    last_session: any;
    recommended_actions: any[];
  };
}

export class ForgetProofSystem {
  private context: ForgetProofContext | null = null;
  private loadedAt: Date | null = null;

  async loadContext(): Promise<ForgetProofContext> {
    try {
      // 1. Auto-Load Context via Edge Function
      const contextData = await nexifyAPI.autoLoadContext();

      if (!contextData) {
        throw new Error("Failed to load context from Edge Function");
      }

      // 2. Load Projects
      const projects = await nexifyAPI.getProjects();

      // 3. Load from Knowledge Base
      const { data: learnings } = await supabase
        .from("ai_learning_patterns")
        .select("*")
        .order("learned_at", { ascending: false })
        .limit(10);

      const { data: issues } = await supabase
        .from("known_issues")
        .select("*")
        .eq("resolved", false)
        .order("severity", { ascending: false });

      const { data: components } = await supabase
        .from("component_registry")
        .select("*")
        .eq("verification_status", "active")
        .order("last_verified", { ascending: false })
        .limit(20);

      const { data: bestPractices } = await supabase
        .from("best_practices")
        .select("*")
        .order("usage_count", { ascending: false })
        .limit(10);

      const { data: codeSnippets } = await supabase
        .from("code_snippets")
        .select("*")
        .order("usage_count", { ascending: false })
        .limit(10);

      // 4. Load CRM Data
      const { data: companies } = await supabase
        .from("companies")
        .select("*")
        .eq("status", "active");

      const { data: contacts } = await supabase.from("contacts").select("*").eq("status", "active");

      this.context = {
        projects: contextData.active_projects || projects,
        globalKnowledge: {
          recent_learnings: learnings || [],
          critical_issues: issues || [],
          components: components || [],
          best_practices: bestPractices || [],
          code_snippets: codeSnippets || [],
        },
        crmData: {
          companies: companies || [],
          contacts: contacts || [],
        },
        sessionContext: contextData.session_context || {
          last_session: null,
          recommended_actions: [],
        },
      };

      this.loadedAt = new Date();

      return this.context;
    } catch (error) {
      console.error("Error loading Forget-Proof context:", error);
      throw error;
    }
  }

  getContext(): ForgetProofContext | null {
    return this.context;
  }

  isContextValid(): boolean {
    if (!this.context || !this.loadedAt) return false;

    // Context ist 5 Minuten gültig
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return this.loadedAt > fiveMinutesAgo;
  }

  async ensureContext(): Promise<ForgetProofContext> {
    if (!this.isContextValid()) {
      return await this.loadContext();
    }
    return this.context!;
  }
}

// Singleton Instance
export const forgetProofSystem = new ForgetProofSystem();
