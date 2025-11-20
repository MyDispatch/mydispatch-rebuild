import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logDebug, logError } from "@/lib/logger";

interface ValidationRequest {
  id: string;
  category:
    | "Design-Konsistenz"
    | "Rechtliche Compliance"
    | "Mobile-First"
    | "Performance"
    | "Sicherheit";
  context: string;
  question: string;
  files: string[];
  options: string[];
  priority: "KRITISCH" | "HOCH" | "NORMAL";
  blocks: string;
  timestamp: string;
}

interface ValidationAnswer {
  requestId: string;
  answer: string;
  documentation: string;
  answeredAt: string;
  answeredBy: "NeXify";
}

/**
 * React Hook für Doc-AI Validation Protocol
 *
 * VERWENDUNG (Doc-AI):
 * - createValidationRequest() → Frage stellen
 * - getDesignReferences() → Eigenständig prüfen
 *
 * VERWENDUNG (NeXify):
 * - checkQueue() → Prüf-Queue checken (PHASE 1)
 * - answerRequest() → Frage beantworten
 * - triggerDocAI() → Doc-AI weitermachen lassen
 */
export function useDocAIValidation() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Doc-AI: Prüfanfrage erstellen
   */
  const createValidationRequest = async (request: Omit<ValidationRequest, "id" | "timestamp">) => {
    setIsLoading(true);

    try {
      const validationRequest: ValidationRequest = {
        ...request,
        id: `REQ-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };

      logDebug("[Doc-AI] Creating validation request", { id: validationRequest.id });

      const { data, error } = await supabase.functions.invoke("manage-docs", {
        body: {
          action: "create-validation-request",
          validationRequest,
        },
      });

      if (error) throw error;

      toast({
        title: "Prüfanfrage erstellt",
        description: `${validationRequest.id} wurde an NeXify gesendet.`,
      });

      return validationRequest;
    } catch (err) {
      logError({
        message: "[Doc-AI] Validation Request Error",
        context: err,
      });

      toast({
        title: "Fehler",
        description: "Prüfanfrage konnte nicht erstellt werden.",
        variant: "destructive",
      });

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Doc-AI: Eigenständig Design-Referenzen abrufen
   */
  const getDesignReferences = async (pages: string[]) => {
    setIsLoading(true);

    try {
      logDebug("[Doc-AI] Getting design references", { pages });

      const { data, error } = await supabase.functions.invoke("manage-docs", {
        body: {
          action: "get-design-references",
          pages,
        },
      });

      if (error) throw error;

      return data.designReferences;
    } catch (err) {
      logError({
        message: "[Doc-AI] Design References Error",
        context: err,
      });

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * NeXify: Prüf-Queue checken
   */
  const checkQueue = async (): Promise<ValidationRequest[]> => {
    // In Production: Lese docs/DOC_AI_PRÜFANFRAGEN_QUEUE.md
    // Für jetzt: Mock
    return [];
  };

  /**
   * NeXify: Prüfanfrage beantworten
   */
  const answerRequest = async (requestId: string, answer: ValidationAnswer) => {
    setIsLoading(true);

    try {
      logDebug("[NeXify] Answering validation request", { requestId });

      const { data, error } = await supabase.functions.invoke("manage-docs", {
        body: {
          action: "answer-validation-request",
          requestId,
          answer,
        },
      });

      if (error) throw error;

      toast({
        title: "Prüfanfrage beantwortet",
        description: `${requestId} wurde beantwortet. Doc-AI wurde getriggert.`,
      });

      return data;
    } catch (err) {
      logError({
        message: "[NeXify] Answer Request Error",
        context: err,
      });

      toast({
        title: "Fehler",
        description: "Antwort konnte nicht übermittelt werden.",
        variant: "destructive",
      });

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * NeXify: Doc-AI triggern (nach Antwort)
   */
  const triggerDocAI = async (requestId: string) => {
    logDebug("[NeXify] Triggering Doc-AI", { requestId });

    // In Production: WebSocket/SSE Trigger
    // For now: use logger
    logDebug("[NeXify] Doc-AI getriggert", { requestId });

    return true;
  };

  return {
    // Doc-AI Methods
    createValidationRequest,
    getDesignReferences,

    // NeXify Methods
    checkQueue,
    answerRequest,
    triggerDocAI,

    isLoading,
  };
}
