import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { resilientQuery } from "@/lib/supabase-resilient-client";

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

export interface TavilySearchResponse {
  query: string;
  answer: string | null;
  results: TavilySearchResult[];
  total: number;
  search_depth: "basic" | "advanced";
}

export interface EnhancedKnowledgeResult {
  id: string | null;
  category: string;
  title: string;
  content: any;
  tags: string[];
  confidence_score: number;
  relevance_score?: number;
  relevance_reason?: string;
  source: "internal" | "tavily";
}

export interface EnhancedKnowledgeResponse {
  query: string;
  results: EnhancedKnowledgeResult[];
  total: number;
  internal_count: number;
  tavily_count: number;
  auto_learned: number;
}

export interface CodeValidationResult {
  is_valid: boolean;
  score: number;
  issues: Array<{
    severity: "error" | "warning" | "info";
    message: string;
    line: number | null;
    suggestion: string;
  }>;
  best_practices_applied: string[];
  improvements: string[];
  file_path?: string;
  technologies: string[];
  best_practices_sources: Array<{ title: string; url: string }>;
  validated_at: string;
}

export interface APIHealthStatus {
  overall_status: "healthy" | "degraded" | "critical" | "error";
  apis: Array<{
    api_name: string;
    status: "healthy" | "degraded" | "down";
    response_time_ms: number;
    error_message: string | null;
    critical: boolean;
  }>;
  checked_at: string;
}

export function useTavilySearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [apiHealth, setApiHealth] = useState<APIHealthStatus | null>(null);

  /**
   * Search Tavily for best practices
   */
  const searchBestPractices = async (
    query: string,
    searchDepth: "basic" | "advanced" = "advanced",
    includeDomains: string[] = [],
    maxResults: number = 5
  ): Promise<TavilySearchResponse | null> => {
    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke("tavily-best-practice-search", {
        body: {
          query,
          search_depth: searchDepth,
          include_domains: includeDomains,
          max_results: maxResults,
        },
      });

      if (error) {
        if (import.meta.env.DEV) console.error("Tavily search error:", error);
        toast.error("Tavily-Suche fehlgeschlagen");
        return null;
      }

      toast.success(`${data.total} Best Practices gefunden`);
      return data;
    } catch (error) {
      if (import.meta.env.DEV) console.error("Tavily search exception:", error);
      toast.error("Unerwarteter Fehler bei Tavily-Suche");
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Enhanced Knowledge Query (Internal + Tavily)
   */
  const queryEnhancedKnowledge = async (
    query: string,
    categoryFilter: string | null = null,
    limit: number = 10,
    includeTavily: boolean = true
  ): Promise<EnhancedKnowledgeResponse | null> => {
    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke("enhanced-knowledge-query", {
        body: {
          query,
          category_filter: categoryFilter,
          limit,
          include_tavily: includeTavily,
        },
      });

      if (error) {
        if (import.meta.env.DEV) console.error("Enhanced knowledge query error:", error);
        toast.error("Knowledge-Abfrage fehlgeschlagen");
        return null;
      }

      toast.success(
        `${data.total} Ergebnisse (${data.internal_count} intern, ${data.tavily_count} Tavily)`
      );
      return data;
    } catch (error) {
      if (import.meta.env.DEV) console.error("Enhanced knowledge query exception:", error);
      toast.error("Unerwarteter Fehler bei Knowledge-Abfrage");
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Validate code against Tavily best practices
   */
  const validateCode = async (
    code: string,
    context?: string,
    filePath?: string
  ): Promise<CodeValidationResult | null> => {
    setIsValidating(true);
    try {
      const { data, error } = await supabase.functions.invoke("tavily-code-validator", {
        body: {
          code,
          context,
          file_path: filePath,
        },
      });

      if (error) {
        if (import.meta.env.DEV) console.error("Code validation error:", error);
        toast.error("Code-Validierung fehlgeschlagen");
        return null;
      }

      if (data.is_valid) {
        toast.success(`Code validiert (Score: ${(data.score * 100).toFixed(0)}%)`);
      } else {
        toast.warning(`Code-Probleme erkannt (Score: ${(data.score * 100).toFixed(0)}%)`);
      }

      return data;
    } catch (error) {
      if (import.meta.env.DEV) console.error("Code validation exception:", error);
      toast.error("Unerwarteter Fehler bei Code-Validierung");
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Check API health status
   */
  const checkAPIHealth = async (): Promise<APIHealthStatus | null> => {
    setIsCheckingHealth(true);
    try {
      if (import.meta.env.DEV) console.log("[useTavilySearch] Checking API health...");

      const { data, error } = await resilientQuery(
        () => supabase.functions.invoke("api-connection-manager"),
        { maxRetries: 3, baseDelay: 1000 }
      );

      if (error) {
        if (import.meta.env.DEV)
          console.warn("[useTavilySearch] API health check failed after retries:", error);
        toast.error("API Health Check fehlgeschlagen", {
          description: "Bitte versuche es später erneut",
        });
        setApiHealth(null);
        return null;
      }

      const criticalDown = data.apis.filter((api: any) => api.critical && api.status === "down");

      if (data.overall_status === "healthy") {
        toast.success("Alle APIs sind gesund");
      } else if (criticalDown.length > 0) {
        toast.error(`${criticalDown.length} kritische APIs down!`);
      } else {
        toast.warning("Einige APIs sind degradiert");
      }

      setApiHealth(data);
      return data;
    } catch (error) {
      if (import.meta.env.DEV)
        console.error("[useTavilySearch] API health check exception:", error);
      toast.error("API Health Check fehlgeschlagen");
      setApiHealth(null);
      return null;
    } finally {
      setIsCheckingHealth(false);
    }
  };

  return {
    // Functions
    searchBestPractices,
    queryEnhancedKnowledge,
    validateCode,
    checkAPIHealth,

    // Loading states
    isSearching,
    isValidating,
    isCheckingHealth,

    // State
    apiHealth,
  };
}
