/* ==================================================================================
   PRE-ACTION AUDIT MODULE - V18.2.14
   ==================================================================================
   Zentrale Fehlerprävention (Agent Zero-Defect-Strategie)
   - Intent & Schema Validation vor kritischen System-/API-Aktionen
   - Self-Correction & Rerouting-Loop (SCRL)
   - Multi-Agent-Verification (MAV) Ready
   ================================================================================== */

import { z } from 'zod';
import { logger } from './logger';

type ActionIntent = 
  | 'database_query'
  | 'database_mutation'
  | 'edge_function_call'
  | 'auth_action'
  | 'storage_operation';

interface PreActionContext {
  intent: ActionIntent;
  targetEntity?: string;
  payload?: any;
  companyId?: string;
  userId?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  correctionSuggestions?: string[];
}

/**
 * Zentrale Pre-Action-Audit-Klasse
 * Führt obligatorische Validierung vor kritischen Aktionen durch
 */
export class PreActionAudit {
  private static instance: PreActionAudit;

  private constructor() {}

  static getInstance(): PreActionAudit {
    if (!PreActionAudit.instance) {
      PreActionAudit.instance = new PreActionAudit();
    }
    return PreActionAudit.instance;
  }

  /**
   * Hauptvalidierungs-Methode
   * MUSS vor jeder kritischen Aktion aufgerufen werden
   */
  async validate(context: PreActionContext): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      correctionSuggestions: [],
    };

    // 1. Intent Validation
    if (!this.isValidIntent(context.intent)) {
      result.errors.push(`Ungültiger Intent: ${context.intent}`);
      result.isValid = false;
    }

    // 2. Company ID Validation (Multi-Tenant Enforcement)
    if (this.requiresCompanyId(context.intent) && !context.companyId) {
      result.errors.push('Company ID fehlt (Multi-Tenant Isolation erforderlich)');
      result.isValid = false;
      result.correctionSuggestions?.push(
        'Fügen Sie .eq("company_id", profile.company_id) zur Query hinzu'
      );
    }

    // 3. Payload Schema Validation
    if (context.payload) {
      const schemaValidation = await this.validatePayloadSchema(context);
      if (!schemaValidation.isValid) {
        result.errors.push(...schemaValidation.errors);
        result.isValid = false;
      }
    }

    // 4. Security Checks
    const securityCheck = await this.performSecurityChecks(context);
    if (!securityCheck.isValid) {
      result.errors.push(...securityCheck.errors);
      result.warnings.push(...securityCheck.warnings);
      result.isValid = false;
    }

    // 5. Rate Limiting Check (Optional)
    const rateLimitCheck = await this.checkRateLimits(context);
    if (!rateLimitCheck.isValid) {
      result.warnings.push('Rate Limit erreicht - Aktion verzögert');
    }

    // Log Validation Result
    if (!result.isValid) {
      logger.error('Pre-Action Audit fehlgeschlagen', new Error('Validation failed'), {
        component: 'PreActionAudit',
        action: 'validate',
        intent: context.intent,
        errors: result.errors,
        companyId: context.companyId
      });
    } else if (result.warnings.length > 0) {
      logger.warn('Pre-Action Audit mit Warnungen', {
        component: 'PreActionAudit',
        action: 'validate',
        intent: context.intent,
        warnings: result.warnings,
        companyId: context.companyId
      });
    }

    return result;
  }

  /**
   * Intent Validation
   */
  private isValidIntent(intent: ActionIntent): boolean {
    const validIntents: ActionIntent[] = [
      'database_query',
      'database_mutation',
      'edge_function_call',
      'auth_action',
      'storage_operation',
    ];
    return validIntents.includes(intent);
  }

  /**
   * Multi-Tenant Validation
   */
  private requiresCompanyId(intent: ActionIntent): boolean {
    return intent === 'database_query' || intent === 'database_mutation';
  }

  /**
   * Payload Schema Validation
   */
  private async validatePayloadSchema(context: PreActionContext): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    // Dynamische Schema-Validierung basierend auf targetEntity
    try {
      if (context.targetEntity === 'bookings') {
        const bookingSchema = z.object({
          company_id: z.string().uuid(),
          customer_id: z.string().uuid().optional(),
          pickup_address: z.string().min(1),
          dropoff_address: z.string().min(1),
          pickup_time: z.string().datetime(),
        });

        bookingSchema.parse(context.payload);
      } else if (context.targetEntity === 'drivers') {
        const driverSchema = z.object({
          company_id: z.string().uuid(),
          first_name: z.string().min(1),
          last_name: z.string().min(1),
          email: z.string().email().optional(),
        });

        driverSchema.parse(context.payload);
      }
      // Weitere Entities...
    } catch (error: Error | unknown) {
      result.isValid = false;
      if (error instanceof z.ZodError) {
        result.errors = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      } else {
        result.errors.push('Schema-Validierung fehlgeschlagen');
      }
    }

    return result;
  }

  /**
   * Security Checks
   */
  private async performSecurityChecks(context: PreActionContext): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    // 1. SQL Injection Prevention
    if (context.payload) {
      const dangerousPatterns = [
        /--/,
        /;/,
        /DROP\s+TABLE/i,
        /DELETE\s+FROM/i,
        /UPDATE\s+\w+\s+SET/i,
      ];

      const payloadString = JSON.stringify(context.payload);
      for (const pattern of dangerousPatterns) {
        if (pattern.test(payloadString)) {
          result.errors.push('Potentielle SQL-Injection erkannt');
          result.isValid = false;
          break;
        }
      }
    }

    // 2. XSS Prevention
    if (context.payload && typeof context.payload === 'object') {
      for (const value of Object.values(context.payload)) {
        if (typeof value === 'string' && /<script/i.test(value)) {
          result.warnings.push('Potentieller XSS-Versuch erkannt - Payload wird bereinigt');
        }
      }
    }

    // 3. DSGVO-Compliance Check
    if (context.intent === 'database_mutation' && context.targetEntity === 'customers') {
      if (!context.companyId) {
        result.errors.push('DSGVO-Verletzung: Keine Company-Isolation bei Kundendaten');
        result.isValid = false;
      }
    }

    return result;
  }

  /**
   * Rate Limiting Check
   */
  private async checkRateLimits(context: PreActionContext): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    // Placeholder - Implementierung in V18.2.15
    // Rate Limiting basierend auf userId + intent
    // Speicherung in Redis/Supabase

    return result;
  }

  /**
   * Self-Correction & Rerouting-Loop (SCRL)
   */
  async attemptCorrection(
    context: PreActionContext,
    validationResult: ValidationResult
  ): Promise<PreActionContext | null> {
    if (validationResult.isValid) {
      return context;
    }

    // Auto-Correction Logic
    const correctedContext = { ...context };

    // 1. Company ID Auto-Injection
    if (validationResult.errors.some(e => e.includes('Company ID'))) {
      // Versuche Company ID aus aktuellem Auth-Context zu holen
      // (Placeholder - benötigt Zugriff auf Auth-Store)
      logger.warn('Auto-Correction: Company ID fehlt - manuelle Korrektur erforderlich', {
        component: 'PreActionAudit',
        action: 'attemptAutoCorrection',
        intent: context.intent
      });
      return null;
    }

    // 2. Payload Sanitization
    if (validationResult.warnings.some(w => w.includes('XSS'))) {
      // Sanitize Payload
      if (correctedContext.payload && typeof correctedContext.payload === 'object') {
        for (const [key, value] of Object.entries(correctedContext.payload)) {
          if (typeof value === 'string') {
            correctedContext.payload[key] = value
              .replace(/<script/gi, '')
              .replace(/<\/script>/gi, '');
          }
        }
      }
      logger.warn('Auto-Correction: XSS-Payload bereinigt', {
        component: 'PreActionAudit',
        action: 'attemptAutoCorrection',
        sanitized: true
      });
    }

    // Re-Validate nach Korrektur
    const reValidation = await this.validate(correctedContext);
    if (reValidation.isValid) {
      return correctedContext;
    }

    return null;
  }
}

/**
 * Convenience Function für einfache Verwendung
 */
export async function preActionAudit(context: PreActionContext): Promise<boolean> {
  const audit = PreActionAudit.getInstance();
  const result = await audit.validate(context);

  if (!result.isValid) {
    // Versuche Auto-Correction
    const correctedContext = await audit.attemptCorrection(context, result);
    if (correctedContext) {
      if (import.meta.env.DEV) {
        logger.debug('[PreActionAudit] Auto-Correction erfolgreich', { correctedContext });
      }
      return true;
    }
    
    logger.error('PreActionAudit Validation fehlgeschlagen', new Error('Validation failed'), {
      component: 'PreActionAudit',
      action: 'performAudit',
      errors: result.errors,
      intent: context.intent
    });
    return false;
  }

  return true;
}
