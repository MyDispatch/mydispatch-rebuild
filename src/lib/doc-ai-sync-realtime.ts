/**
 * Doc-AI Real-Time Indexing & Synchronisation
 *
 * V18.5.8: Erweitert den Doc-AI Sync um Real-Time Indexing Capabilities.
 * Kritische Code-Änderungen werden sofort nach dem Commit indexiert.
 *
 * @example
 * await indexCriticalCodeChanges({ files: ['src/pages/Dashboard.tsx'], ... });
 * await subscribeToDocAIRealtime();
 */

import { supabase } from "@/integrations/supabase/client";
import { logDebug, logError, logInfo } from "@/lib/logger";

interface CodeChange {
  files: string[];
  timestamp: number;
  commitHash?: string;
  changeType: "create" | "update" | "delete";
  criticality: "low" | "medium" | "high";
}

interface RealTimeIndexEntry {
  id: string;
  file: string;
  content: string;
  indexed_at: string;
  commit_hash?: string;
  criticality: string;
}

/**
 * Channel-Name für Real-Time Doc-AI Sync
 */
const REALTIME_CHANNEL = "doc-ai-realtime";

/**
 * Indexiert kritische Code-Änderungen in Echtzeit
 *
 * KRITISCH: MUSS nach jedem erfolgreichen Commit aufgerufen werden!
 */
export async function indexCriticalCodeChanges(changes: CodeChange): Promise<boolean> {
  try {
    logInfo("[Doc-AI-RT] Starting real-time indexing", {
      filesCount: changes.files.length,
      criticality: changes.criticality,
    });

    // Nur kritische und mittlere Änderungen indexieren
    if (changes.criticality === "low") {
      logDebug("[Doc-AI-RT] Skipping low-criticality changes");
      return true;
    }

    const { data, error } = await supabase.functions.invoke("doc-ai-realtime-index", {
      body: {
        action: "index",
        changes: changes,
      },
    });

    if (error || data?.error) {
      throw error || new Error(data.error);
    }

    logInfo("[Doc-AI-RT] Real-time indexing successful", {
      indexed: changes.files.length,
    });

    // Trigger Real-Time Channel Update
    await triggerRealTimeUpdate("code-change", changes);

    return true;
  } catch (err) {
    logError({
      message: "[Doc-AI-RT] Real-time indexing failed",
      context: err,
    });
    return false;
  }
}

/**
 * Abonniert Real-Time Doc-AI Updates
 */
export async function subscribeToDocAIRealtime(
  onCodeChange?: (changes: CodeChange) => void,
  onDocUpdate?: (update: any) => void,
  onValidationRequest?: (request: any) => void
): Promise<() => void> {
  logDebug("[Doc-AI-RT] Subscribing to real-time channel");

  const channel = supabase
    .channel(REALTIME_CHANNEL)
    .on("broadcast", { event: "code-change" }, (payload) => {
      logDebug("[Doc-AI-RT] Code change received", payload);
      onCodeChange?.(payload.payload as CodeChange);
    })
    .on("broadcast", { event: "doc-update" }, (payload) => {
      logDebug("[Doc-AI-RT] Doc update received", payload);
      onDocUpdate?.(payload.payload);
    })
    .on("broadcast", { event: "validation-request" }, (payload) => {
      logDebug("[Doc-AI-RT] Validation request received", payload);
      onValidationRequest?.(payload.payload);
    })
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        logInfo("[Doc-AI-RT] Successfully subscribed to real-time channel");
      } else if (status === "CHANNEL_ERROR") {
        logError({
          message: "[Doc-AI-RT] Real-time subscription failed",
          context: status,
        });
      }
    });

  // Cleanup-Funktion zurückgeben
  return () => {
    logDebug("[Doc-AI-RT] Unsubscribing from real-time channel");
    supabase.removeChannel(channel);
  };
}

/**
 * Triggert ein Real-Time Update im Channel
 */
async function triggerRealTimeUpdate(
  eventType: "code-change" | "doc-update" | "validation-request",
  payload: any
): Promise<boolean> {
  try {
    const channel = supabase.channel(REALTIME_CHANNEL);

    await channel.send({
      type: "broadcast",
      event: eventType,
      payload: payload,
    });

    logDebug("[Doc-AI-RT] Real-time update triggered", { eventType });
    return true;
  } catch (err) {
    logError({
      message: "[Doc-AI-RT] Failed to trigger real-time update",
      context: err,
    });
    return false;
  }
}

/**
 * Ruft Knowledge aus dem Real-Time Index ab (CQR First)
 *
 * WICHTIG: Dies ist die ERSTE Anlaufstelle für CQR!
 */
export async function getRealTimeKnowledge(query: string): Promise<any | null> {
  try {
    logDebug("[Doc-AI-RT] Querying real-time index", { query });

    const { data, error } = await supabase.functions.invoke("doc-ai-realtime-index", {
      body: {
        action: "query",
        query: query,
      },
    });

    if (error || data?.error) {
      throw error || new Error(data.error);
    }

    if (data?.results && data.results.length > 0) {
      logDebug("[Doc-AI-RT] Knowledge found in real-time index", {
        resultsCount: data.results.length,
      });
      return data.results;
    }

    logDebug("[Doc-AI-RT] No knowledge found in real-time index");
    return null;
  } catch (err) {
    logError({
      message: "[Doc-AI-RT] Failed to query real-time index",
      context: err,
    });
    return null;
  }
}

/**
 * Auto-Ermittlung der Kritikalität einer Datei
 */
export function determineCriticality(filePath: string): "low" | "medium" | "high" {
  // Kritische Pfade (high)
  if (
    filePath.includes("/lib/") ||
    filePath.includes("/hooks/") ||
    filePath.includes("/integrations/") ||
    filePath.includes("brain-system") ||
    filePath.includes("doc-ai")
  ) {
    return "high";
  }

  // Mittlere Kritikalität (medium)
  if (
    filePath.includes("/pages/") ||
    filePath.includes("/components/") ||
    filePath.includes("/data/")
  ) {
    return "medium";
  }

  // Niedrige Kritikalität (low)
  return "low";
}

/**
 * Convenience-Funktion für Post-Commit Indexing
 */
export async function postCommitIndexing(changedFiles: string[]): Promise<void> {
  const highCriticalityFiles = changedFiles.filter((f) => determineCriticality(f) === "high");
  const mediumCriticalityFiles = changedFiles.filter((f) => determineCriticality(f) === "medium");

  if (highCriticalityFiles.length > 0) {
    await indexCriticalCodeChanges({
      files: highCriticalityFiles,
      timestamp: Date.now(),
      changeType: "update",
      criticality: "high",
    });
  }

  if (mediumCriticalityFiles.length > 0) {
    await indexCriticalCodeChanges({
      files: mediumCriticalityFiles,
      timestamp: Date.now(),
      changeType: "update",
      criticality: "medium",
    });
  }

  logInfo("[Doc-AI-RT] Post-commit indexing complete", {
    total: changedFiles.length,
    high: highCriticalityFiles.length,
    medium: mediumCriticalityFiles.length,
  });
}
