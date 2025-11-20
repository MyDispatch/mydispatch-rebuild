/**
 * PRICING VALIDATION HOOK V18.5.2
 *
 * Automatische Synchronisations-Prüfung zwischen:
 * - pricing-tiers.ts (Marketing)
 * - tariff-definitions.ts (App-Logik)
 *
 * Verhindert Inkonsistenzen bei Pricing-Updates
 *
 * NEU in V18.5.2:
 * ✅ Automatische -20% Rabatt-Validierung
 * ✅ Floating-Point Toleranz (±1 Cent)
 * ✅ Detaillierte Fehler-Beschreibungen
 */

import { useEffect } from "react";
import { PRICING_TIERS } from "@/data/pricing-tiers";
import { getTariffById } from "@/lib/tariff/tariff-definitions";
import { logger } from "@/lib/logger";

interface ValidationError {
  tariff: string;
  field: string;
  expected: any;
  actual: any;
  severity: "error" | "warning";
}

export function usePricingValidation() {
  const errors: ValidationError[] = [];

  // Prüfe jeden Tarif
  PRICING_TIERS.forEach((tier) => {
    const tariffDef = getTariffById(tier.id as any);

    if (!tariffDef) {
      errors.push({
        tariff: tier.id,
        field: "definition",
        expected: "exists",
        actual: "missing",
        severity: "error",
      });
      return;
    }

    // Prüfe Monatspreis
    if (tier.priceNumeric !== tariffDef.priceMonthly) {
      errors.push({
        tariff: tier.id,
        field: "monthlyPrice",
        expected: tariffDef.priceMonthly,
        actual: tier.priceNumeric,
        severity: "error",
      });
    }

    // Prüfe Jahrespreis (nur wenn vorhanden)
    if (tier.yearlyPriceNumeric && tariffDef.priceYearly) {
      if (Math.abs(tier.yearlyPriceNumeric - tariffDef.priceYearly) > 0.01) {
        errors.push({
          tariff: tier.id,
          field: "yearlyPrice",
          expected: tariffDef.priceYearly,
          actual: tier.yearlyPriceNumeric,
          severity: "error",
        });
      }
    }

    // NEUE VALIDIERUNG: -20% Rabatt-Check
    if (tier.priceNumeric > 0 && tier.yearlyPriceNumeric) {
      const expectedYearly = Math.round(tier.priceNumeric * 12 * 0.8 * 100) / 100; // -20% mit 2 Dezimalen
      const actualYearly = tier.yearlyPriceNumeric;
      const tolerance = 0.01; // 1 Cent Toleranz

      if (Math.abs(expectedYearly - actualYearly) > tolerance) {
        const actualDiscount = ((1 - actualYearly / (tier.priceNumeric * 12)) * 100).toFixed(2);
        errors.push({
          tariff: tier.id,
          field: "yearlyDiscount",
          expected: "-20%",
          actual: `${actualDiscount}% (${actualYearly}€ statt ${expectedYearly}€)`,
          severity: "error",
        });
      }
    }

    // Prüfe Stripe Product IDs
    if (tier.stripeProductId !== tariffDef.stripeProductIds[0]) {
      errors.push({
        tariff: tier.id,
        field: "stripeProductId",
        expected: tariffDef.stripeProductIds[0],
        actual: tier.stripeProductId,
        severity: "warning",
      });
    }
  });

  // In Development: Console-Ausgabe
  useEffect(() => {
    if (errors.length > 0) {
      logger.group("🚨 PRICING VALIDATION ERRORS");
      errors.forEach((err) => {
        const icon = err.severity === "error" ? "❌" : "⚠️";
        logger.info(`${icon} ${err.tariff}.${err.field}`, {
          component: "usePricingValidation",
          expected: err.expected,
          actual: err.actual,
        });
      });
      logger.groupEnd();
    }
  }, [errors.length]);

  return {
    isValid: errors.length === 0,
    errors,
    errorCount: errors.length,
    criticalErrors: errors.filter((e) => e.severity === "error").length,
    warnings: errors.filter((e) => e.severity === "warning").length,
  };
}
