/* ==================================================================================
   SUBSCRIPTION SECTION V18.3
   ==================================================================================
   Abonnement-Status, Tarif-Features, Upgrade
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { V28Button } from "@/components/design-system/V28Button";
import { Separator } from "@/components/ui/separator";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { TariffSwitcher } from "./TariffSwitcher";
import { useSubscription } from "@/hooks/use-subscription";
import { useAccountType } from "@/hooks/use-account-type";
import { supabase } from "@/integrations/supabase/client";
import { isBusinessTier } from "@/lib/subscription-utils";

export function SubscriptionSection() {
  const { subscribed, productId, subscriptionEnd, openCustomerPortal } = useSubscription();
  const { accountType, permissions } = useAccountType();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Abonnement & Tarif</CardTitle>
        <CardDescription>Verwalten Sie Ihr Abonnement und upgraden Sie bei Bedarf</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Abonnement-Status</Label>
            <div>
              <StatusIndicator
                type={subscribed ? "success" : "error"}
                label={subscribed ? "Aktiv" : "Inaktiv"}
                size="md"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Aktueller Tarif</Label>
            <div>
              <StatusIndicator
                type={isBusinessTier(productId) ? "success" : "info"}
                label={isBusinessTier(productId) ? "Business" : "Starter"}
                size="md"
              />
            </div>
          </div>
        </div>

        {subscriptionEnd && (
          <div className="space-y-2">
            <Label className="text-muted-foreground">Abonnement läuft bis</Label>
            <p className="text-foreground font-medium">
              {new Date(subscriptionEnd).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        )}

        <Separator />

        {/* Features */}
        <div>
          <h3 className="font-semibold mb-4">Ihr Tarif enthält:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {isBusinessTier(productId) ? (
              <>
                <div className="text-sm">
                  <span className="text-foreground mr-2">✓</span>
                  <span>Keine Begrenzung bei Fahrern/Fahrzeugen</span>
                </div>
                <div className="text-sm">
                  <span className="text-foreground mr-2">✓</span>
                  <span>Partner-Management</span>
                </div>
                <div className="text-sm">
                  <span className="text-foreground mr-2">✓</span>
                  <span>Live-Traffic & Wetter</span>
                </div>
                <div className="text-sm">
                  <span className="text-foreground mr-2">✓</span>
                  <span>Statistiken & Reports</span>
                </div>
                <div className="text-sm">
                  <span className="text-foreground mr-2">✓</span>
                  <span>Kunden-Portal</span>
                </div>
                <div className="text-sm">
                  <span className="text-foreground mr-2">✓</span>
                  <span>Buchungswidget</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm">
                  <span className="text-foreground mr-2">✓</span>
                  <span>Bis zu 3 Fahrer/Fahrzeuge</span>
                </div>
                <div className="text-sm">
                  <span className="text-foreground mr-2">✓</span>
                  <span>Basisdisposition</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-muted-foreground mr-2">✗</span>
                  <span>Partner-Management</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-muted-foreground mr-2">✗</span>
                  <span>Live-Traffic & Wetter</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {subscribed && (
            <V28Button
              onClick={openCustomerPortal}
              variant="secondary"
              className="h-10 min-h-[44px] px-6 touch-manipulation"
            >
              Abonnement verwalten
            </V28Button>
          )}
          {accountType === "normal" && !permissions.canAccessBusinessFeatures && (
            <V28Button
              onClick={async () => {
                const { data, error } = await supabase.functions.invoke("create-checkout", {
                  body: { priceId: "price_1SIBN9LX5M8TT990mxE8owxm" },
                });
                if (data?.url) window.location.href = data.url;
              }}
              className="h-10 min-h-[44px] px-6 bg-primary hover:bg-primary/90 text-primary-foreground touch-manipulation"
            >
              Auf Business upgraden
            </V28Button>
          )}
        </div>

        {/* Tariff-Switcher für Master/Test-Accounts */}
        {permissions.canSwitchTariff && (
          <>
            <Separator />
            <TariffSwitcher />
          </>
        )}
      </CardContent>
    </Card>
  );
}
