/* ==================================================================================
   UPGRADE-PROMPT COMPONENT V18.3.24
   ==================================================================================
   Einheitlicher Upgrade-Button für gesperrte Features
   ================================================================================== */

import { Lock, ArrowRight } from "lucide-react";
import { V28Button } from "@/components/design-system/V28Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { getUpgradePath } from "@/lib/tariff/tariff-definitions";
import { useAuth } from "@/hooks/use-auth";

interface UpgradePromptProps {
  featureName: string;
  featureDescription: string;
  requiredTier: "Business" | "Enterprise";
  variant?: "inline" | "card" | "fullscreen";
}

export function UpgradePrompt({
  featureName,
  featureDescription,
  requiredTier,
  variant = "card",
}: UpgradePromptProps) {
  const navigate = useNavigate();
  const { company } = useAuth();

  const upgradePath = getUpgradePath(company?.subscription_product_id);

  const handleUpgrade = () => {
    navigate("/pricing");
  };

  // Inline-Variante (für kleine Bereiche)
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2 p-2 bg-muted/30 border border-border rounded-md">
        <Lock className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground flex-1">
          {featureName} - {requiredTier} erforderlich
        </span>
        <V28Button size="sm" variant="secondary" onClick={handleUpgrade}>
          Upgrade
        </V28Button>
      </div>
    );
  }

  // Fullscreen-Variante (für gesperrte Seiten)
  if (variant === "fullscreen") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md border-2 border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-foreground" />
            </div>
            <Badge className="mx-auto mb-2 bg-primary text-primary-foreground">
              {requiredTier}-Feature
            </Badge>
            <CardTitle className="text-2xl">{featureName}</CardTitle>
            <CardDescription className="text-base">{featureDescription}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Dieses Feature ist im {requiredTier}-Tarif verfügbar.
            </p>
            {upgradePath && (
              <p className="text-sm font-medium">
                Upgrade auf {upgradePath.name} ab {upgradePath.priceMonthlyFormatted}/Monat
              </p>
            )}
            <V28Button
              variant="primary"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleUpgrade}
            >
              Jetzt upgraden
              <ArrowRight className="ml-2 h-4 w-4" />
            </V28Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Card-Variante (Standard)
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Lock className="h-5 w-5 text-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{featureName}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {requiredTier}
              </Badge>
            </div>
            <CardDescription>{featureDescription}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <V28Button
          variant="primary"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleUpgrade}
        >
          Auf {requiredTier} upgraden
          <ArrowRight className="ml-2 h-4 w-4" />
        </V28Button>
      </CardContent>
    </Card>
  );
}
