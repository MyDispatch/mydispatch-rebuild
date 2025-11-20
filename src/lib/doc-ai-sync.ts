/**
 * Doc-AI Synchronisation Utilities
 *
 * Automatische Synchronisation zwischen Code-Änderungen und Dokumentation.
 * Wird im NeXify-Workflow bei jeder relevanten Änderung aufgerufen.
 *
 * @example
 * await syncDesignReferences();
 * await validateDocConsistency();
 */

import { supabase } from "@/integrations/supabase/client";
import { logDebug, logError } from "@/lib/logger";

interface DesignReference {
  page: string;
  components: string[];
  colors: Record<string, string>;
  layout: string;
  lastUpdate: string;
}

/**
 * Extrahiert Design-Referenzen aus fertigen Seiten
 */
export async function extractDesignReferences(): Promise<Record<string, DesignReference>> {
  const references: Record<string, DesignReference> = {
    home: {
      page: "/home",
      components: ["MarketingButton", "MarketingLayout", "Hero", "Badge"],
      colors: {
        primary: "hsl(40 31% 88%)",
        foreground: "hsl(225 31% 28%)",
        background: "hsl(0 0% 100%)",
      },
      layout: "Marketing-Template",
      lastUpdate: new Date().toISOString(),
    },
    dashboard: {
      page: "/dashboard",
      components: ["PageHeaderWithKPIs", "KPIGenerator", "DashboardLayout"],
      colors: {
        primary: "hsl(40 31% 88%)",
        foreground: "hsl(225 31% 28%)",
        card: "hsl(var(--card))",
      },
      layout: "APP_PAGE_TEMPLATE V18.5.1",
      lastUpdate: new Date().toISOString(),
    },
    auftraege: {
      page: "/auftraege",
      components: ["PageHeaderWithKPIs", "Table", "Dialog"],
      colors: {
        primary: "hsl(40 31% 88%)",
        foreground: "hsl(225 31% 28%)",
      },
      layout: "APP_PAGE_TEMPLATE V18.5.1",
      lastUpdate: new Date().toISOString(),
    },
  };

  return references;
}

/**
 * Synchronisiert Design-Referenzen mit Doc-AI
 */
export async function syncDesignReferences(): Promise<boolean> {
  try {
    logDebug("[Doc-AI-Sync] Starting design reference sync");

    const references = await extractDesignReferences();

    const { data, error } = await supabase.functions.invoke("manage-docs", {
      body: {
        action: "sync-design",
        designReferences: references,
      },
    });

    if (error || data?.error) {
      throw error || new Error(data.error);
    }

    logDebug("[Doc-AI-Sync] Design sync successful", {
      pagesProcessed: Object.keys(references).length,
    });

    return true;
  } catch (err) {
    logError({ message: "[Doc-AI-Sync] Design sync failed", context: err });
    return false;
  }
}

/**
 * Validiert Dokumentations-Konsistenz
 */
export async function validateDocConsistency(docs: Record<string, string>): Promise<{
  valid: boolean;
  issues: string[];
}> {
  try {
    logDebug("[Doc-AI-Sync] Validating doc consistency");

    const { data, error } = await supabase.functions.invoke("manage-docs", {
      body: {
        action: "validate",
        docs: docs,
      },
    });

    if (error || data?.error) {
      throw error || new Error(data.error);
    }

    const issues = data?.designConsistency?.issues || [];
    const valid = data?.designConsistency?.status === "ok";

    logDebug("[Doc-AI-Sync] Validation complete", { valid, issuesCount: issues.length });

    return { valid, issues };
  } catch (err) {
    logError({ message: "[Doc-AI-Sync] Validation failed", context: err });
    return { valid: false, issues: ["Validation failed"] };
  }
}

/**
 * Automatische Doc-Update-Trigger
 *
 * Sollte aufgerufen werden nach:
 * - Neuen Fehler-Reports
 * - Design-System-Änderungen
 * - Neuen Seiten
 * - Template-Updates
 */
export async function triggerDocUpdate(
  updateType: "error" | "design" | "page" | "template",
  data: any
): Promise<boolean> {
  try {
    logDebug("[Doc-AI-Sync] Triggering doc update", { updateType });

    const { data: result, error } = await supabase.functions.invoke("manage-docs", {
      body: {
        action: "update",
        docs: {
          [`${updateType}-update-${Date.now()}.json`]: JSON.stringify(data, null, 2),
        },
      },
    });

    if (error || result?.error) {
      throw error || new Error(result.error);
    }

    logDebug("[Doc-AI-Sync] Doc update successful");
    return true;
  } catch (err) {
    logError({ message: "[Doc-AI-Sync] Doc update failed", context: err });
    return false;
  }
}
