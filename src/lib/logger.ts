/* ==================================================================================
   LOGGER UTILITY V18.5.14
   ==================================================================================
   Centralized Logging System für MyDispatch
   
   Vorteile:
   - Production: Logs automatisch deaktiviert
   - Development: Strukturiertes Logging mit Prefixes
   - Performance: console.log-Overhead in Production entfernt
   - Debugging: Bessere Filterbarkeit in DevTools
   
   Migration:
   console.log('message') → logger.debug('message')
   console.warn('message') → logger.warn('message')
   console.error('message') → logger.error('message')
   ================================================================================== */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LoggerConfig {
  enabled: boolean;
  minLevel: LogLevel;
  prefix?: string;
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
    const isDeno = typeof globalThis !== "undefined" && "Deno" in globalThis;
    const isDev = isDeno
      ? (globalThis as any).Deno?.env?.get("ENVIRONMENT") !== "production"
      : (import.meta.env?.DEV ?? false);

    this.config = {
      enabled: isDev,
      minLevel: "debug",
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    return this.levels[level] >= this.levels[this.config.minLevel];
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): any[] {
    const prefix = this.config.prefix ? `[${this.config.prefix}]` : "";
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0];

    const emoji = {
      debug: "🔍",
      info: "ℹ️",
      warn: "⚠️",
      error: "❌",
    }[level];

    return [`${emoji} ${timestamp} ${prefix} ${message}`, ...args];
  }

  debug(message: string | any, ...args: any[]): void {
    if (this.shouldLog("debug")) {
      const msg = typeof message === "string" ? message : JSON.stringify(message);
      console.log(...this.formatMessage("debug", msg, ...args));
    }
  }

  info(message: string | any, ...args: any[]): void {
    if (this.shouldLog("info")) {
      const msg = typeof message === "string" ? message : JSON.stringify(message);
      console.info(...this.formatMessage("info", msg, ...args));
    }
  }

  warn(message: string | any, ...args: any[]): void {
    if (this.shouldLog("warn")) {
      const msg = typeof message === "string" ? message : JSON.stringify(message);
      console.warn(...this.formatMessage("warn", msg, ...args));
    }
  }

  error(message: string | any, ...args: any[]): void {
    if (this.shouldLog("error")) {
      const msg = typeof message === "string" ? message : JSON.stringify(message);
      console.error(...this.formatMessage("error", msg, ...args));
    }
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
    if (this.shouldLog("debug") && console.group) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.shouldLog("debug") && console.groupEnd) {
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
