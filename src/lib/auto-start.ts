// ==================================================================================
// AUTO-START & INITIALIZATION SYSTEM
// ==================================================================================
// Purpose: Automatically initialize and start all self-healing systems
// Runs: On app startup, ensures system is always operational
// ==================================================================================

import { startWatchdog, getWatchdogStatus } from "./watchdog";
import { SelfHealing } from "./self-healing";
import { logInfo, logError } from "./logger";

// ==================================================================================
// INITIALIZATION STATE
// ==================================================================================
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

// ==================================================================================
// AUTO-START CONFIGURATION
// ==================================================================================
const AUTO_START_CONFIG = {
  watchdog: true, // Always start watchdog
  immediateHealthCheck: true, // Run health check on startup
  persistenceCheck: true, // Verify localStorage availability
  databaseCheck: true, // Verify database connection
  edgeFunctionCheck: false, // Skip Edge Function check (can be slow)
};

// ==================================================================================
// INITIALIZATION FUNCTION
// ==================================================================================
export async function initializeSelfHealingSystem(): Promise<void> {
  // Prevent multiple initializations
  if (isInitialized) {
    console.log("🔄 Self-healing system already initialized");
    return;
  }

  // If initialization in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start initialization
  initializationPromise = (async () => {
    try {
      console.log("🚀 Initializing self-healing autonomous system...");
      logInfo({ message: "Self-healing system initialization started" });

      // 1. Check localStorage availability
      if (AUTO_START_CONFIG.persistenceCheck) {
        try {
          localStorage.setItem("self_healing_test", "ok");
          localStorage.removeItem("self_healing_test");
          console.log("✅ localStorage available");
        } catch (error) {
          console.warn("⚠️ localStorage not available", error);
        }
      }

      // 2. Run immediate health check
      if (AUTO_START_CONFIG.immediateHealthCheck) {
        try {
          const healingResult = await SelfHealing.autoHeal();
          if (healingResult.healed) {
            console.log("🏥 Initial healing completed", {
              issues: healingResult.issues.length,
              fixes: healingResult.fixes.length,
            });
          } else {
            console.log("✅ System healthy on startup");
          }
        } catch (error) {
          console.error("❌ Initial health check failed", error);
        }
      }

      // 3. Start watchdog service
      if (AUTO_START_CONFIG.watchdog) {
        try {
          startWatchdog();
          const status = getWatchdogStatus();
          console.log("🐕 Watchdog service started", status);
        } catch (error) {
          console.error("❌ Failed to start watchdog", error);
        }
      }

      // Mark as initialized
      isInitialized = true;
      logInfo({ message: "Self-healing system initialized successfully" });
      console.log("✅ Self-healing autonomous system ready!");
    } catch (error) {
      logError({
        message: "Critical error during self-healing system initialization",
        context: { error },
      });
      throw error;
    }
  })();

  return initializationPromise;
}

// ==================================================================================
// STATUS CHECK
// ==================================================================================
export function getSelfHealingStatus(): {
  initialized: boolean;
  watchdog: ReturnType<typeof getWatchdogStatus>;
} {
  return {
    initialized: isInitialized,
    watchdog: getWatchdogStatus(),
  };
}

// ==================================================================================
// MANUAL RESET (for testing)
// ==================================================================================
export function resetInitialization(): void {
  isInitialized = false;
  initializationPromise = null;
  console.log("🔄 Self-healing system reset");
}

// ==================================================================================
// AUTO-START ON IMPORT (if in production)
// ==================================================================================
if (
  typeof window !== "undefined" &&
  import.meta.env.VITE_AUTONOMOUS_MODE === "true"
) {
  // Auto-start after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => initializeSelfHealingSystem(), 1000);
    });
  } else {
    setTimeout(() => initializeSelfHealingSystem(), 1000);
  }
}
