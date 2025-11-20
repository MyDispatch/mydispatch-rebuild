import { useEffect } from "react";
import { logger } from "@/lib/logger";

/**
 * Legal-Compliance Validation Hook
 *
 * Prüft automatisch, ob rechtliche Vorgaben eingehalten werden:
 * - DSGVO: Datenschutzhinweise bei Formularen
 * - AI Act: KI-Kennzeichnung bei AI-Antworten
 * - TMG: Impressum/Datenschutz/AGB Links im Footer
 *
 * Siehe: docs/RECHTLICHE_COMPLIANCE_VORGABEN_V18.5.1.md
 *
 * @example
 * useLegalComplianceValidation({ hasForm: true, hasAI: false });
 */
interface ComplianceOptions {
  hasForm?: boolean;
  hasAI?: boolean;
  hasFooter?: boolean;
}

export const useLegalComplianceValidation = (options: ComplianceOptions = {}) => {
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const validateCompliance = () => {
      const warnings: string[] = [];

      // Prüfe DSGVO: Datenschutzhinweis bei Formularen
      if (options.hasForm) {
        const forms = document.querySelectorAll("form");
        forms.forEach((form, index) => {
          const hasPrivacyHint =
            form.querySelector("[data-privacy-hint]") ||
            form.textContent?.includes("Datenschutz") ||
            form.textContent?.includes("DSGVO");

          if (!hasPrivacyHint) {
            warnings.push(
              `DSGVO: Formular ${index + 1} fehlt Datenschutzhinweis (data-privacy-hint)`
            );
          }
        });
      }

      // Prüfe AI Act: KI-Kennzeichnung
      if (options.hasAI) {
        const aiElements = document.querySelectorAll("[data-ai-generated]");
        if (aiElements.length === 0) {
          warnings.push("AI Act: KI-generierte Inhalte fehlen Kennzeichnung (data-ai-generated)");
        }
      }

      // Prüfe TMG: Footer-Links
      if (options.hasFooter !== false) {
        const footer = document.querySelector("footer");
        if (footer) {
          const requiredLinks = ["Impressum", "Datenschutz", "AGB"];
          requiredLinks.forEach((linkText) => {
            const hasLink = Array.from(footer.querySelectorAll("a")).some((link) =>
              link.textContent?.includes(linkText)
            );
            if (!hasLink) {
              warnings.push(`TMG: Footer fehlt Link zu "${linkText}"`);
            }
          });
        }
      }

      if (warnings.length > 0) {
        logger.group("🔶 Legal-Compliance Validation");
        warnings.forEach((warning) =>
          logger.warn(warning, { component: "useLegalComplianceValidation" })
        );
        logger.info("Siehe: docs/RECHTLICHE_COMPLIANCE_VORGABEN_V18.5.1.md", {
          component: "useLegalComplianceValidation",
        });
        logger.groupEnd();
      }
    };

    // Delay validation to ensure DOM is ready
    const timer = setTimeout(validateCompliance, 1000);
    return () => clearTimeout(timer);
  }, [options.hasForm, options.hasAI, options.hasFooter]);
};
