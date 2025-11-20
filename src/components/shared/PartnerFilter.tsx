/* ==================================================================================
   PARTNER FILTER - Dropdown für Partner-Auswahl in Aufträgen
   ================================================================================== */

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/lib/error-handler";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Handshake, Loader2 } from "lucide-react";

interface PartnerConnection {
  id: string;
  provision_rate: number;
  partner_company: {
    id: string;
    name: string;
  };
}

interface PartnerFilterProps {
  currentCompanyId: string;
  value?: string;
  onValueChange: (partnerId: string | undefined, provisionRate: number) => void;
  disabled?: boolean;
}

export function PartnerFilter({
  currentCompanyId,
  value,
  onValueChange,
  disabled,
}: PartnerFilterProps) {
  const [partners, setPartners] = useState<PartnerConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const { data, error } = await supabase
          .from("partner_connections")
          .select("id, provision_rate, company_a_id, company_b_id")
          .or(`company_a_id.eq.${currentCompanyId},company_b_id.eq.${currentCompanyId}`);

        if (error) throw error;

        // Fetch partner company details
        const partnersWithCompany = await Promise.all(
          (data || []).map(async (conn) => {
            const partnerId =
              conn.company_a_id === currentCompanyId ? conn.company_b_id : conn.company_a_id;

            const { data: company } = await supabase
              .from("companies")
              .select("id, name")
              .eq("id", partnerId)
              .single();

            return {
              id: conn.id,
              provision_rate: conn.provision_rate,
              partner_company: company!,
            };
          })
        );

        setPartners(partnersWithCompany);
      } catch (error) {
        handleError(error, "Fehler beim Laden der Partner", { showToast: false });
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [currentCompanyId]);

  const handleValueChange = (val: string) => {
    if (val === "none") {
      onValueChange(undefined, 0);
    } else {
      const partner = partners.find((p) => p.partner_company.id === val);
      if (partner) {
        onValueChange(partner.partner_company.id, partner.provision_rate);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Lade Partner...</span>
      </div>
    );
  }

  if (partners.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted">
        <Handshake className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Keine Partner verfügbar</span>
      </div>
    );
  }

  return (
    <Select value={value || "none"} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Partner auswählen (optional)" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Partner-Unternehmen</SelectLabel>
          <SelectItem value="none">
            <span className="text-muted-foreground">Kein Partner</span>
          </SelectItem>
          {partners.map((partner) => (
            <SelectItem key={partner.partner_company.id} value={partner.partner_company.id}>
              <div className="flex items-center gap-2">
                <Handshake className="h-4 w-4" />
                <span>{partner.partner_company.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({partner.provision_rate}% Provision)
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
