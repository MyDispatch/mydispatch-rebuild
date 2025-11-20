/* ==================================================================================
   FEATURE FLAGS SYSTEM - Client Version (Local Storage)
   ==================================================================================
   Ermöglicht kontrollierte Feature-Rollouts ohne DB-Abhängigkeit
   ================================================================================== */

import { useEffect, useState } from "react";
import { logger } from "@/lib/logger";

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
}

// Default feature flags
const DEFAULT_FLAGS: Record<string, boolean> = {
  new_dashboard: false,
  enhanced_maps: true,
  ai_chat_support: false,
  realtime_tracking: true,
  mobile_app_beta: false,
};

/**
 * Get all feature flags from localStorage
 */
export function getFeatureFlags(): Record<string, boolean> {
  try {
    const stored = localStorage.getItem("feature_flags");
    if (stored) {
      return { ...DEFAULT_FLAGS, ...JSON.parse(stored) };
    }
    return DEFAULT_FLAGS;
  } catch {
    return DEFAULT_FLAGS;
  }
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(featureName: string): boolean {
  const flags = getFeatureFlags();
  return flags[featureName] || false;
}

/**
 * React Hook for feature flags
 */
export function useFeatureFlags() {
  const [flags, setFlags] = useState<Record<string, boolean>>(DEFAULT_FLAGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const loadedFlags = getFeatureFlags();
    setFlags(loadedFlags);
    setLoading(false);

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "feature_flags" && e.newValue) {
        try {
          const newFlags = { ...DEFAULT_FLAGS, ...JSON.parse(e.newValue) };
          setFlags(newFlags);
        } catch (error) {
          logger.error("[FeatureFlags] Failed to parse storage update", error, {
            component: "feature-flags-client",
          });
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { flags, loading };
}

/**
 * React Hook for a specific feature flag
 */
export function useFeatureFlag(featureName: string): boolean {
  const { flags, loading } = useFeatureFlags();

  if (loading) return false;
  return flags[featureName] || false;
}

/**
 * Toggle a feature flag (for development/testing)
 */
export function toggleFeatureFlag(featureName: string, enabled: boolean) {
  try {
    const currentFlags = getFeatureFlags();
    const newFlags = { ...currentFlags, [featureName]: enabled };
    localStorage.setItem("feature_flags", JSON.stringify(newFlags));

    // Trigger storage event manually for same-tab updates
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "feature_flags",
        newValue: JSON.stringify(newFlags),
        oldValue: JSON.stringify(currentFlags),
      })
    );

    return true;
  } catch (error) {
    logger.error("[FeatureFlags] Failed to toggle", error, {
      component: "feature-flags-client",
      featureName,
      enabled,
    });
    return false;
  }
}

/**
 * Kill Switch - Disable a feature immediately
 */
export function killSwitch(featureName: string) {
  return toggleFeatureFlag(featureName, false);
}
