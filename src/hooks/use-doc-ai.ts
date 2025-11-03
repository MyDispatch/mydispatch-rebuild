import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logDebug, logError } from '@/lib/logger';

interface DocAIRequest {
  action: 'analyze' | 'update' | 'validate' | 'sync-design';
  docs?: Record<string, string>;
  designReferences?: Record<string, string>;
}

interface DocAIResponse {
  analysis?: string;
  recommendations?: string[];
  updates?: Record<string, string>;
  designConsistency?: {
    status: 'ok' | 'warning' | 'error';
    issues?: string[];
  };
  error?: string;
}

/**
 * React Hook für Doc-Management AI
 * 
 * @example
 * const { analyzeDoc, isLoading } = useDocAI();
 * 
 * const result = await analyzeDoc({
 *   action: 'analyze',
 *   docs: { 'FEHLER_LOG_V18.5.1.md': content }
 * });
 */
export function useDocAI() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const callDocAI = async (request: DocAIRequest): Promise<DocAIResponse | null> => {
    setIsLoading(true);
    
    try {
      logDebug('[Doc-AI] Calling manage-docs', { action: request.action });
      
      const { data, error } = await supabase.functions.invoke('manage-docs', {
        body: request
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        if (data.error.includes('Rate limit')) {
          toast({
            title: 'Rate Limit erreicht',
            description: 'Bitte versuche es in wenigen Minuten erneut.',
            variant: 'destructive'
          });
        } else if (data.error.includes('Payment required')) {
          toast({
            title: 'Lovable AI Credits aufgebraucht',
            description: 'Bitte füge Credits in den Workspace-Einstellungen hinzu.',
            variant: 'destructive'
          });
        } else {
          throw new Error(data.error);
        }
        return null;
      }

      logDebug('[Doc-AI] Success', { 
        recommendations: data.recommendations?.length || 0,
        updates: Object.keys(data.updates || {}).length 
      });

      return data;

    } catch (err) {
      logError({ 
        message: '[Doc-AI] Error', 
        context: err 
      });
      
      toast({
        title: 'Doc-AI Fehler',
        description: 'Die Dokumentations-Analyse ist fehlgeschlagen.',
        variant: 'destructive'
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Convenience Methods
  const analyzeDoc = (docs: Record<string, string>) => 
    callDocAI({ action: 'analyze', docs });

  const validateDocs = (docs: Record<string, string>) => 
    callDocAI({ action: 'validate', docs });

  const syncDesign = (designReferences: Record<string, string>) => 
    callDocAI({ action: 'sync-design', designReferences });

  const updateDocs = (docs: Record<string, string>) => 
    callDocAI({ action: 'update', docs });

  return {
    callDocAI,
    analyzeDoc,
    validateDocs,
    syncDesign,
    updateDocs,
    isLoading
  };
}