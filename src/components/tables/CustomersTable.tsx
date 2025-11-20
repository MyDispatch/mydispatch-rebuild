/* ==================================================================================
   CUSTOMERS TABLE - V18.3 Multi-Select Component
   ==================================================================================
   Performance-optimiert mit React.memo() für große Datenlisten
   V18.3: Bulk-Selection Support hinzugefügt
   ================================================================================== */

import { memo, useMemo } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Eye } from "lucide-react";
import { V28Button } from "@/components/design-system/V28Button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusIndicator } from "@/components/shared/StatusIndicator";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  has_portal_access: boolean;
  credit_limit: number;
  outstanding_balance: number;
  created_at: string;
  is_manually_created: boolean;
  salutation?: string;
  title?: string;
}

interface CustomersTableProps {
  customers: Customer[];
  onViewDetails: (customer: Customer) => void;
  // V18.3: Bulk-Selection Props
  selectedIds?: string[];
  onToggleSelection?: (id: string) => void;
  onToggleSelectAll?: () => void;
  showBulkSelect?: boolean;
}

/**
 * Memoized Customers Table Component
 * Verhindert unnötiges Re-Rendering bei großen Datensätzen
 * V18.3: Bulk-Selection Support
 */
export const CustomersTable = memo(
  ({
    customers,
    onViewDetails,
    selectedIds = [],
    onToggleSelection,
    onToggleSelectAll,
    showBulkSelect = false,
  }: CustomersTableProps) => {
    // Memoize formatierte Daten
    const formattedCustomers = useMemo(() => {
      return customers.map((customer) => {
        const fullName = [
          customer.salutation,
          customer.title,
          customer.first_name,
          customer.last_name,
        ]
          .filter(Boolean)
          .join(" ");

        return {
          ...customer,
          fullName,
          formattedCreditLimit: new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
          }).format(customer.credit_limit || 0),
          formattedBalance: new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
          }).format(customer.outstanding_balance || 0),
          balanceStatus: customer.outstanding_balance > 0 ? "warning" : "success",
        };
      });
    }, [customers]);

    // Check if all items are selected
    const isAllSelected =
      customers.length > 0 && customers.every((c) => selectedIds.includes(c.id));
    const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

    if (customers.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">Keine Kunden gefunden.</div>;
    }

    return (
      <div className="overflow-x-auto scrollbar-hide">
        <Table>
          <TableHeader>
            <TableRow>
              {showBulkSelect && onToggleSelectAll && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={onToggleSelectAll}
                    className={
                      isSomeSelected && !isAllSelected ? "data-[state=checked]:bg-primary" : ""
                    }
                    aria-label="Alle auswählen"
                  />
                </TableHead>
              )}
              <TableHead>Name</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead className="w-[120px]">Kreditlimit</TableHead>
              <TableHead className="w-[120px]">Offener Betrag</TableHead>
              <TableHead className="w-[100px] text-center">Portal</TableHead>
              <TableHead className="w-[80px] text-center">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formattedCustomers.map((customer) => {
              const isSelected = selectedIds.includes(customer.id);

              return (
                <TableRow
                  key={customer.id}
                  className="hover:bg-muted/50"
                  data-selected={isSelected}
                >
                  {showBulkSelect && onToggleSelection && (
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelection(customer.id)}
                        aria-label={`Kunde ${customer.fullName} auswählen`}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{customer.fullName}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{customer.email || "-"}</TableCell>
                  <TableCell>{customer.phone || "-"}</TableCell>
                  <TableCell className="text-right">{customer.formattedCreditLimit}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        customer.outstanding_balance > 0 ? "text-warning font-semibold" : ""
                      }
                    >
                      {customer.formattedBalance}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusIndicator
                      type={customer.has_portal_access ? "success" : "neutral"}
                      label={customer.has_portal_access ? "Aktiv" : "Inaktiv"}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <V28Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onViewDetails(customer)}
                      className="h-8 w-8 p-0"
                      aria-label="Kunde ansehen"
                    >
                      <Eye className="h-4 w-4" />
                    </V28Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.customers === nextProps.customers;
  }
);

CustomersTable.displayName = "CustomersTable";
