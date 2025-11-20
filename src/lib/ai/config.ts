/* ==================================================================================
   ZENTRALE AI-KONFIGURATION V26.0 - CLAUDE SONNET 4.5 ONLY
   ==================================================================================
   🚨 ABSOLUTE VERPFLICHTUNG: NUR CLAUDE SONNET 4.5 ÜBER ANTHROPIC API
   
   Diese Datei definiert die EINZIGE erlaubte AI-Konfiguration für MyDispatch.
   NIEMALS ÄNDERN ohne explizite Freigabe von Pascal!
   ================================================================================== */

/**
 * Zentrale AI-Konfiguration
 * 
 * @constant AI_CONFIG - Die einzige erlaubte AI-Konfiguration
 * @property provider - MUSS 'anthropic' sein
 * @property model - MUSS 'claude-sonnet-4-5' sein
 * @property apiKeySecret - Supabase Secret Name
 * @property baseUrl - Anthropic API Endpoint
 */
export const AI_CONFIG = {
  provider: 'anthropic' as const,
  model: 'claude-sonnet-4-5' as const,
  apiKeySecret: 'ANTHROPIC_API_KEY' as const,
  baseUrl: 'https://api.anthropic.com/v1' as const,
  anthropicVersion: '2023-06-01' as const,
} as const;

export type AIConfig = typeof AI_CONFIG;

/**
 * Type Guard zur Compile-Time Validierung
 * 
 * Stellt sicher, dass nur Claude Sonnet 4.5 über Anthropic API verwendet wird.
 * 
 * @param config - Zu validierende Konfiguration
 * @returns true wenn Konfiguration valide ist
 */
export function validateAIConfig(config: unknown): config is AIConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    'provider' in config &&
    config.provider === 'anthropic' &&
    'model' in config &&
    config.model === 'claude-sonnet-4-5' &&
    'apiKeySecret' in config &&
    config.apiKeySecret === 'ANTHROPIC_API_KEY'
  );
}

/**
 * Runtime-Check für AI-Konfiguration
 * 
 * Wirft einen Fehler, wenn die Konfiguration nicht valide ist.
 * MUSS in jeder Edge Function aufgerufen werden, bevor AI verwendet wird.
 * 
 * @throws Error wenn Konfiguration nicht Claude Sonnet 4.5 ist
 */
export function enforceAIConfig(): void {
  if (!validateAIConfig(AI_CONFIG)) {
    throw new Error(
      'KRITISCHER GOVERNANCE-VERSTOSS: ' +
      'Nur Claude Sonnet 4.5 über Anthropic API ist erlaubt! ' +
      'Siehe: docs/AI_MODEL_GOVERNANCE_V26.0.md'
    );
  }
}

/**
 * Standard-Parameter für Claude Sonnet 4.5
 * 
 * Diese Parameter sind für die meisten Use Cases optimiert.
 */
export const DEFAULT_AI_PARAMS = {
  maxTokens: 4096,
  temperature: 0.7,
  topP: 0.9,
} as const;

/**
 * Streaming-Konfiguration
 * 
 * Aktiviert Token-by-Token Streaming für bessere UX.
 */
export const STREAMING_CONFIG = {
  enabled: true,
  bufferSize: 1024,
} as const;
