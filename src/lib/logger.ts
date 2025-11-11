/* ==================================================================================
   LOGGER UTILITY V18.5.15
   ==================================================================================
   Centralized Logging System für MyDispatch
   
   Vorteile:
   - Production: Logs optional an DB-Sink (Supabase) emitten
   - Development: Strukturiertes Logging mit Prefixes
   - Performance: console.log-Overhead in Production entfernt
   - Debugging: Bessere Filterbarkeit in DevTools
   - Governance: Sanitizing sensitivier Felder gemäß Security-Richtlinien
   
   Migration:
   console.log('message') → logger.debug('message')
   console.warn('message') → logger.warn('message')
   console.error('message') → logger.error('message')
   ================================================================================== */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  minLevel: LogLevel;
  prefix?: string;
  sinks?: LoggerSink[];
}

interface LogContext {
  [key: string]: unknown;
}

interface LoggerSink {
  emit: (level: LogLevel, message: string, context?: LogContext) => Promise<void> | void;
}

class Logger {
  private config: LoggerConfig;
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(config?: Partial<LoggerConfig>) {
    // ✅ FIX P1.11: Deno Edge Function kompatibel (Type-safe check)
    const isDeno = typeof globalThis !== 'undefined' && 'Deno' in globalThis;
    const isDev = isDeno 
      ? (globalThis as any).Deno?.env?.get('ENVIRONMENT') !== 'production'
      : import.meta.env?.DEV ?? false;
    
    this.config = {
      enabled: isDev,
      minLevel: 'debug',
      ...config,
    };

    // Initialize sinks
    this.initSinks();
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    return this.levels[level] >= this.levels[this.config.minLevel];
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): any[] {
    const prefix = this.config.prefix ? `[${this.config.prefix}]` : '';
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    
    const emoji = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
    }[level];

    return [`${emoji} ${timestamp} ${prefix} ${message}`, ...args];
  }

  private sanitizeContext(context?: LogContext): LogContext | undefined {
    if (!context) return undefined;
    const forbiddenKeys = ['password', 'token', 'key', 'secret', 'authorization', 'auth'];
    const sanitized: LogContext = {};
    for (const [k, v] of Object.entries(context)) {
      const lower = k.toLowerCase();
      if (forbiddenKeys.some(f => lower.includes(f))) {
        sanitized[k] = '[REDACTED]';
      } else {
        sanitized[k] = v;
      }
    }
    return sanitized;
  }

  private async emitToSinks(level: LogLevel, message: string, context?: LogContext) {
    const sinks = this.config.sinks || [];
    if (sinks.length === 0) return;
    const sanitized = this.sanitizeContext(context);
    for (const sink of sinks) {
      try {
        await sink.emit(level, message, sanitized);
      } catch (e) {
        // Avoid recursive error logging
        if (this.shouldLog('warn')) {
          console.warn('[Logger] Sink emit failed', e);
        }
      }
    }
  }

  private initSinks() {
    const sinks: LoggerSink[] = [];
    // Console sink (dev only)
    const consoleSink: LoggerSink = {
      emit: (level, msg, ctx) => {
        const formatted = this.formatMessage(level, msg, ctx);
        switch (level) {
          case 'debug':
            if (this.shouldLog('debug')) console.log(...formatted);
            break;
          case 'info':
            if (this.shouldLog('info')) console.info(...formatted);
            break;
          case 'warn':
            if (this.shouldLog('warn')) console.warn(...formatted);
            break;
          case 'error':
            if (this.shouldLog('error')) console.error(...formatted);
            break;
        }
      }
    };
    sinks.push(consoleSink);

    // Optional Supabase sink (controlled via env flag)
    const enableDbLogs = (import.meta as any)?.env?.VITE_ENABLE_DB_LOGS === 'true';
    if (enableDbLogs) {
      const supabaseSink: LoggerSink = {
        emit: async (level, msg, ctx) => {
          // Only emit info/warn/error to DB sinks; skip debug to reduce noise
          if (level === 'debug') return;
          try {
            const { supabase } = await import('@/integrations/supabase/client');
            const payload = {
              level,
              message: msg,
              context: ctx ?? {},
              created_at: new Date().toISOString(),
            };
            // Fire-and-forget; ignore errors to avoid UI blocking
            await supabase.from('app_logs').insert(payload);
          } catch (e) {
            if (this.shouldLog('warn')) console.warn('[Logger] Supabase sink emit failed');
          }
        }
      };
      sinks.push(supabaseSink);
    }

    this.config.sinks = sinks;
  }

  debug(message: string | any, ...args: any[]): void {
    const msg = typeof message === 'string' ? message : JSON.stringify(message);
    this.emitToSinks('debug', msg, args?.[0]);
  }

  info(message: string | any, ...args: any[]): void {
    const msg = typeof message === 'string' ? message : JSON.stringify(message);
    this.emitToSinks('info', msg, args?.[0]);
  }

  warn(message: string | any, ...args: any[]): void {
    const msg = typeof message === 'string' ? message : JSON.stringify(message);
    this.emitToSinks('warn', msg, args?.[0]);
  }

  error(message: string | any, ...args: any[]): void {
    const msg = typeof message === 'string' ? message : JSON.stringify(message);
    this.emitToSinks('error', msg, args?.[0]);
  }

  // Factory method for scoped loggers
  scope(prefix: string): Logger {
    return new Logger({
      ...this.config,
      prefix,
    });
  }

  // Console.group/groupEnd support
  group(label: string): void {
    if (this.shouldLog('debug') && console.group) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.shouldLog('debug') && console.groupEnd) {
      console.groupEnd();
    }
  }
}

// Default logger instance
export const logger = new Logger();

// Named exports for convenience
export const createLogger = (prefix: string) => logger.scope(prefix);

// Legacy exports for backward compatibility
export const logDebug = (message: string | any, ...args: any[]) => logger.debug(message, ...args);
export const logInfo = (message: string | any, ...args: any[]) => logger.info(message, ...args);
export const logWarning = (message: string | any, ...args: any[]) => logger.warn(message, ...args);
export const logError = (message: string | any, ...args: any[]) => logger.error(message, ...args);

// Example usage:
// import { logger, createLogger, logDebug } from '@/lib/logger';
// 
// logger.debug('App initialized');
// logDebug('Legacy style'); // Also works
// 
// const dbLogger = createLogger('Database');
// dbLogger.info('Query executed', { rows: 42 });
