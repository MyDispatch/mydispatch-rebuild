/* ==================================================================================
   PARTNERS TABLE - V18.1 Memoized Component
   ==================================================================================
   Performance-optimiert mit React.memo() für große Datenlisten
   ================================================================================== */

import { memo, useMemo } from "react";
import { Eye } from "lucide-react";
import { V28Button } from "@/components/design-system/V28Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusIndicator } from "@/components/shared/StatusIndicator";

interface Partner {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  provision_amount: number;
  online_access_enabled: boolean;
  created_at: string;
}

interface PartnersTableProps {
  partners: Partner[];
  onViewDetails: (partner: Partner) => void;
}

/**
 * Memoized Partners Table Component
 * Verhindert unnötiges Re-Rendering bei großen Datensätzen
 */
export const PartnersTable = memo(
  ({ partners, onViewDetails }: PartnersTableProps) => {
    // Memoize formatierte Daten
    const formattedPartners = useMemo(() => {
      return partners.map((partner) => ({
        ...partner,
        formattedProvision: new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: "EUR",
        }).format(partner.provision_amount || 0),
        accessStatus: partner.online_access_enabled ? ("success" as const) : ("neutral" as const),
        accessLabel: partner.online_access_enabled ? "Aktiv" : "Inaktiv",
      }));
    }, [partners]);

    if (partners.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">Keine Partner gefunden.</div>;
    }

    return (
      <div className="overflow-x-auto scrollbar-hide">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">E-Mail</TableHead>
              <TableHead className="hidden md:table-cell">Telefon</TableHead>
              <TableHead className="w-[120px]">Provision</TableHead>
              <TableHead className="w-[100px] text-center">Zugang</TableHead>
              <TableHead className="w-[80px] text-center">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formattedPartners.map((partner) => (
              <TableRow key={partner.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{partner.name}</TableCell>
                <TableCell className="hidden sm:table-cell max-w-[200px] truncate">
                  {partner.email || "-"}
                </TableCell>
                <TableCell className="hidden md:table-cell">{partner.phone || "-"}</TableCell>
                <TableCell className="text-right">{partner.formattedProvision}</TableCell>
                <TableCell className="text-center">
                  <StatusIndicator
                    type={partner.accessStatus}
                    label={partner.accessLabel}
                    size="sm"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <V28Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onViewDetails(partner)}
                    className="h-8 w-8 p-0"
                    aria-label="Partner ansehen"
                  >
                    <Eye className="h-4 w-4" />
                  </V28Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison
    return prevProps.partners === nextProps.partners;
  }
);

PartnersTable.displayName = "PartnersTable";
