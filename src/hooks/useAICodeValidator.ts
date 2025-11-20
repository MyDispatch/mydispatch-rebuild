import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createLogger } from '@/lib/logger';

const logger = createLogger('CodeValidator');

export interface CodeViolation {
  rule: string;
  line: number;
  issue: string;
  fix: string;
}

export interface ValidationResult {
  valid: boolean;
  violations: CodeViolation[];
  suggestions: string[];
  confidence: number;
  error?: string;
}

export interface AutoFixResult {
  fixed_code: string | null;
  changes: Array<{
    line: number;
    old: string;
    new: string;
    reason: string;
  }>;
  confidence: number;
  remaining_issues: string[];
  error?: string;
}

/**
 * Hook für AI-gestützte Code-Validierung
 * 
 * Prüft Code gegen alle MyDispatch Standards (Design, Layout, Icons, etc.)
 * vor der Implementation, um Layout-Breaks zu verhindern.
 * 
 * @example
 * const { validateCode, isValidating, lastValidation } = useAICodeValidator();
 * 
 * const result = await validateCode({
 *   code: '...tsx code...',
 *   file_path: 'src/pages/Fahrer.tsx',
 *   change_type: 'dashboard_modification'
 * });
 * 
 * if (!result.valid) {
 *   console.error('Violations:', result.violations);
 * }
 */
export function useAICodeValidator() {
  const [isValidating, setIsValidating] = useState(false);
  const [isGeneratingFix, setIsGeneratingFix] = useState(false);
  const [lastValidation, setLastValidation] = useState<ValidationResult | null>(null);
  const [lastFix, setLastFix] = useState<AutoFixResult | null>(null);
  const { toast } = useToast();

  /**
   * Validiert Code gegen alle Knowledge-Base Standards
   */
  const validateCode = async ({
    code,
    file_path,
    change_type = 'component_render'
  }: {
    code: string;
    file_path: string;
    change_type?: string;
  }): Promise<ValidationResult> => {
    setIsValidating(true);
    
    try {
      logger.debug(`Validating ${file_path}...`);

      const { data, error } = await supabase.functions.invoke('ai-code-validator', {
        body: {
          code,
          file_path,
          change_type,
        },
      });

      if (error) {
        logger.error('Validation error:', error);
        throw new Error(error.message || 'Validation failed');
      }

      const result: ValidationResult = data;
      setLastValidation(result);

      // Show toast if violations found
      if (!result.valid && result.violations.length > 0) {
        toast({
          title: '⚠️ Code Violations gefunden',
          description: `${result.violations.length} Violations in ${file_path}`,
          variant: 'destructive',
        });
        logger.warn('Validation failed:', result.violations);
      } else {
        logger.debug('Validation passed');
      }

      return result;

    } catch (error) {
      logger.error('validateCode error:', error);
      
      const errorResult: ValidationResult = {
        valid: false,
        violations: [{
          rule: 'System Error',
          line: 0,
          issue: error instanceof Error ? error.message : 'Unknown error',
          fix: 'Please check logs'
        }],
        suggestions: [],
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      setLastValidation(errorResult);
      return errorResult;

    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Generiert automatische Fixes für Code-Violations
   */
  const generateAutoFix = async ({
    code,
    violations,
    file_path
  }: {
    code: string;
    violations: CodeViolation[];
    file_path: string;
  }): Promise<AutoFixResult> => {
    setIsGeneratingFix(true);

    try {
      logger.debug(`Generating auto-fix for ${file_path}...`);

      const { data, error } = await supabase.functions.invoke('ai-auto-fix-generator', {
        body: {
          code,
          violations,
          file_path,
        },
      });

      if (error) {
        logger.error('Auto-fix error:', error);
        throw new Error(error.message || 'Auto-fix generation failed');
      }

      const result: AutoFixResult = data;
      setLastFix(result);

      if (result.fixed_code && result.confidence > 0.8) {
        toast({
          title: '✅ Auto-Fix generiert',
          description: `${result.changes.length} Änderungen vorgeschlagen (Confidence: ${(result.confidence * 100).toFixed(0)}%)`,
        });
        logger.debug('Auto-fix generated:', result.changes.length, 'changes');
      } else if (result.error) {
        toast({
          title: '⚠️ Auto-Fix fehlgeschlagen',
          description: result.error,
          variant: 'destructive',
        });
      }

      return result;

    } catch (error) {
      logger.error('generateAutoFix error:', error);

      const errorResult: AutoFixResult = {
        fixed_code: null,
        changes: [],
        confidence: 0,
        remaining_issues: [error instanceof Error ? error.message : 'Unknown error'],
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      setLastFix(errorResult);
      return errorResult;

    } finally {
      setIsGeneratingFix(false);
    }
  };

  return {
    validateCode,
    generateAutoFix,
    isValidating,
    isGeneratingFix,
    lastValidation,
    lastFix,
  };
}
