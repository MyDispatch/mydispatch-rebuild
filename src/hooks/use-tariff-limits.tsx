/* ==================================================================================
   TARIFF-LIMITS HOOK V18.3.24
   ==================================================================================
   Prüfung und Enforcement von Tarif-Limits
   ================================================================================== */

import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getTariffByProductId, exceedsLimit, TariffLimit } from "@/lib/tariff/tariff-definitions";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useTariffLimits() {
  const { company } = useAuth();
  const navigate = useNavigate();

  const tariff = getTariffByProductId(company?.subscription_product_id);

  // Aktuelle Nutzung abrufen
  const { data: usage } = useQuery({
    queryKey: ["tariff-usage", company?.id],
    queryFn: async () => {
      if (!company?.id) return null;

      const [driversRes, vehiclesRes, usersRes, partnersRes] = await Promise.all([
        supabase
          .from("drivers")
          .select("id", { count: "exact", head: true })
          .eq("company_id", company.id)
          .eq("archived", false),

        supabase
          .from("vehicles")
          .select("id", { count: "exact", head: true })
          .eq("company_id", company.id)
          .eq("archived", false),

        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("company_id", company.id),

        supabase
          .from("partner_connections")
          .select("id", { count: "exact", head: true })
          .or(`company_a_id.eq.${company.id},company_b_id.eq.${company.id}`)
          .eq("archived", false),
      ]);

      return {
        drivers: driversRes.count || 0,
        vehicles: vehiclesRes.count || 0,
        users: usersRes.count || 0,
        partners: partnersRes.count || 0,
        bookings: 0, // Unbegrenzt in allen Tarifen
      };
    },
    enabled: !!company?.id,
  });

  // Prüfe ob Limit erreicht
  const checkLimit = (resource: keyof TariffLimit): boolean => {
    if (!tariff || !usage) return false;

    const currentCount = usage[resource];
    return exceedsLimit(company?.subscription_product_id, resource, currentCount);
  };

  // Prüfe ob Hinzufügen erlaubt
  const canAdd = (resource: keyof TariffLimit): boolean => {
    if (!tariff || !usage) return false;

    const currentCount = usage[resource];
    const limit = tariff.limits[resource];

    // -1 = Unbegrenzt
    if (limit === -1) return true;

    return currentCount < limit;
  };

  // Zeige Limit-Warnung
  const showLimitWarning = (resource: keyof TariffLimit) => {
    if (!tariff) return;

    const limit = tariff.limits[resource];
    const resourceName = {
      drivers: "Fahrer",
      vehicles: "Fahrzeuge",
      users: "Benutzer",
      partners: "Partner",
      bookings: "Aufträge",
    }[resource];

    toast.error(`Tarif-Limit erreicht`, {
      description: `Sie haben das Maximum von ${limit} ${resourceName} erreicht. Upgraden Sie auf Business für unbegrenzte Nutzung.`,
      action: {
        label: "Upgrade",
        onClick: () => navigate("/pricing"),
      },
    });
  };

  // Versuche hinzuzufügen mit Limit-Check
  const tryAdd = (resource: keyof TariffLimit): boolean => {
    if (canAdd(resource)) {
      return true;
    }

    showLimitWarning(resource);
    return false;
  };

  return {
    tariff,
    usage,
    limits: tariff?.limits,
    checkLimit,
    canAdd,
    tryAdd,
    showLimitWarning,
  };
}
