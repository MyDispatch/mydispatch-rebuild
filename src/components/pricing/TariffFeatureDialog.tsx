/* ==================================================================================
   TARIFF FEATURE DIALOG V28.1 - PROFESSIONAL GRAY-BLUE
   ==================================================================================
   ✅ V28.1 Design System konform
   ✅ designTokens für alle Farben (Single Source of Truth)
   ✅ Flat Design (rounded-2xl Container, minimal rounding)
   ✅ Mobile-First & Tablet-Responsive
   ✅ Systemweit wiederverwendbar
   ✅ 300ms Transitions
   ✅ 8px Grid Spacing
   ================================================================================== */

import { Check, X, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { V28Button } from "@/components/design-system/V28Button";
import { TariffDefinition } from "@/lib/tariff/tariff-definitions";
import { designTokens } from "@/config/design-tokens";
import { cn } from "@/lib/utils";

interface TariffFeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tariff: TariffDefinition;
  billingPeriod?: "monthly" | "yearly";
  onSelectTariff?: () => void;
}

export function TariffFeatureDialog({
  open,
  onOpenChange,
  tariff,
  billingPeriod = "monthly",
  onSelectTariff,
}: TariffFeatureDialogProps) {
  const includedFeatures = tariff.features.filter((f) => f.included);
  const excludedFeatures = tariff.features.filter((f) => !f.included);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] p-0 flex flex-col rounded-2xl border shadow-lg gap-0"
        style={{
          borderColor: designTokens.colors.slate[200],
          background: designTokens.colors.white,
        }}
      >
        {/* Header - Fixed */}
        <DialogHeader
          className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b shrink-0"
          style={{ borderColor: designTokens.colors.slate[200] }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: designTokens.colors.primary.light,
                }}
              >
                <Sparkles
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  style={{ color: designTokens.colors.primary.DEFAULT }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: designTokens.colors.slate[900] }}
                >
                  {tariff.name}
                </DialogTitle>
                <DialogDescription
                  className="text-sm sm:text-base mt-1"
                  style={{ color: designTokens.colors.slate[600] }}
                >
                  {tariff.description}
                </DialogDescription>
              </div>
            </div>
            {tariff.badge && (
              <Badge
                className="pointer-events-none text-xs sm:text-sm self-start sm:self-auto shrink-0 rounded font-semibold"
                style={{
                  background: designTokens.colors.primary.DEFAULT,
                  color: designTokens.colors.white,
                  border: `1px solid ${designTokens.colors.slate[200]}`,
                }}
              >
                {tariff.badge}
              </Badge>
            )}
          </div>

          {/* Preis-Section - Mobile optimiert */}
          <div className="flex flex-wrap items-baseline gap-2 mt-4">
            <span
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: designTokens.colors.slate[900] }}
            >
              {billingPeriod === "monthly"
                ? tariff.priceMonthlyFormatted
                : tariff.priceYearlyFormatted}
            </span>
            <span className="text-xs sm:text-sm" style={{ color: designTokens.colors.slate[600] }}>
              {billingPeriod === "monthly" ? "pro Monat" : "pro Jahr"}
            </span>
            {billingPeriod === "yearly" && tariff.yearlyDiscount > 0 && (
              <Badge
                variant="outline"
                className="text-[10px] sm:text-xs rounded"
                style={{
                  borderColor: designTokens.colors.primary.DEFAULT,
                  color: designTokens.colors.primary.DEFAULT,
                  background: designTokens.colors.primary.light,
                }}
              >
                -20% ({tariff.yearlyDiscount.toFixed(2)} € Ersparnis)
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Body (Scrollable) - SCROLLBAR UNSICHTBAR - MIN-HEIGHT FÜR SCROLL */}
        <div
          className="px-4 sm:px-6 py-4 overflow-y-auto flex-1 scrollbar-invisible min-h-0"
          style={{
            background: designTokens.colors.slate[50],
          }}
        >
          {/* Limits-Section - Mobile optimiert */}
          {(tariff.limits.drivers !== -1 || tariff.limits.users !== -1) && (
            <div className="mb-6">
              <h3
                className="text-xs sm:text-sm font-semibold mb-3"
                style={{ color: designTokens.colors.slate[600] }}
              >
                Limits & Kapazitäten
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {tariff.limits.drivers !== -1 && (
                  <div
                    className="rounded-lg p-3 sm:p-4 border shadow-sm transition-all duration-300"
                    style={{
                      background: designTokens.colors.white,
                      borderColor: designTokens.colors.slate[200],
                    }}
                  >
                    <div
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: designTokens.colors.slate[900] }}
                    >
                      {tariff.limits.drivers}
                    </div>
                    <div
                      className="text-[10px] sm:text-xs mt-1"
                      style={{ color: designTokens.colors.slate[600] }}
                    >
                      Fahrer & Fahrzeuge
                    </div>
                  </div>
                )}
                {tariff.limits.users !== -1 && (
                  <div
                    className="rounded-lg p-3 sm:p-4 border shadow-sm transition-all duration-300"
                    style={{
                      background: designTokens.colors.white,
                      borderColor: designTokens.colors.slate[200],
                    }}
                  >
                    <div
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: designTokens.colors.slate[900] }}
                    >
                      {tariff.limits.users}
                    </div>
                    <div
                      className="text-[10px] sm:text-xs mt-1"
                      style={{ color: designTokens.colors.slate[600] }}
                    >
                      Benutzer
                    </div>
                  </div>
                )}
                {tariff.limits.drivers === -1 && (
                  <div
                    className="rounded-lg p-3 sm:p-4 border shadow-sm transition-all duration-300"
                    style={{
                      background: designTokens.colors.primary.light,
                      borderColor: designTokens.colors.primary.DEFAULT,
                    }}
                  >
                    <div
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: designTokens.colors.primary.DEFAULT }}
                    >
                      ∞
                    </div>
                    <div
                      className="text-[10px] sm:text-xs mt-1"
                      style={{ color: designTokens.colors.slate[600] }}
                    >
                      Keine Limit
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enthaltene Features - Mobile optimiert */}
          <div className="mb-6">
            <h3
              className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4 flex items-center gap-2"
              style={{ color: designTokens.colors.slate[900] }}
            >
              <Check
                className="h-4 w-4 sm:h-5 sm:w-5"
                style={{ color: designTokens.colors.primary.DEFAULT }}
              />
              Enthaltene Features ({includedFeatures.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
              {includedFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  style={{
                    background: designTokens.colors.white,
                    borderColor: designTokens.colors.slate[200],
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = designTokens.colors.primary.DEFAULT;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = designTokens.colors.slate[200];
                  }}
                >
                  <Check
                    className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5"
                    style={{ color: designTokens.colors.primary.DEFAULT }}
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs sm:text-sm font-medium"
                      style={{ color: designTokens.colors.slate[900] }}
                    >
                      {feature.name}
                    </div>
                    {feature.description && (
                      <div
                        className="text-[10px] sm:text-xs mt-1"
                        style={{ color: designTokens.colors.slate[600] }}
                      >
                        {feature.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nicht enthaltene Features - Mobile optimiert */}
          {excludedFeatures.length > 0 && (
            <div className="mt-4 sm:mt-6">
              <h3
                className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4 flex items-center gap-2"
                style={{ color: designTokens.colors.slate[600] }}
              >
                <X
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  style={{ color: designTokens.colors.slate[300] }}
                />
                Nicht enthalten ({excludedFeatures.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                {excludedFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg opacity-60"
                    style={{
                      background: designTokens.colors.slate[100],
                    }}
                  >
                    <X
                      className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5"
                      style={{ color: designTokens.colors.slate[300] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-xs sm:text-sm"
                        style={{ color: designTokens.colors.slate[600] }}
                      >
                        {feature.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer mit CTA - Mobile optimiert */}
        <div
          className="px-4 sm:px-6 py-4 border-t shrink-0"
          style={{
            borderColor: designTokens.colors.slate[200],
            background: designTokens.colors.white,
          }}
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <V28Button
              size="lg"
              variant="primary"
              className="flex-1 min-h-[44px] text-sm sm:text-base font-semibold rounded transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md bg-slate-700 text-white hover:bg-slate-800"
              onClick={() => {
                onSelectTariff?.();
                onOpenChange(false);
              }}
            >
              {tariff.ctaText}
            </V28Button>
            <V28Button
              size="lg"
              variant="secondary"
              className="min-h-[44px] text-sm sm:text-base font-semibold rounded transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => onOpenChange(false)}
            >
              Schließen
            </V28Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
