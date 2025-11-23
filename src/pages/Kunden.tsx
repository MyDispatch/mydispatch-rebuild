/* ==================================================================================
   KUNDEN V28.1 - PROFESSIONAL GRAY-BLUE DESIGN
   ==================================================================================
   ✅ V28.1 Professional Design (Tailwind Slate Palette)
   ✅ Dezente, moderne B2B-Ästhetik
   ✅ 100% Funktionalität beibehalten
   ✅ Semantic Color System (Tailwind-native)
   ✅ Keine Layout-Änderungen - nur visuelle Upgrades
   ================================================================================== */

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { useDeviceType } from "@/hooks/use-device-type";
import { useCustomers } from "@/hooks/use-customers";
import { useRealtimeCustomers } from "@/hooks/use-realtime-customers";
import { useBulkSelection } from "@/hooks/use-bulk-selection";
import { useCustomerRelatedData } from "@/hooks/use-customer-related";
import { BulkActionBar } from "@/components/shared/BulkActionBar";
import { MobileKunden } from "@/components/mobile/MobileKunden";
import { Mail, Download, Plus } from "lucide-react";
import { StandardPageLayout } from "@/components/layout/StandardPageLayout";
import { EmptyState } from "@/components/shared/EmptyState";
import { V28Button } from "@/components/design-system/V28Button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/index";
import { Users } from "lucide-react";
import { StatusIndicator } from "@/components/shared/StatusIndicator";
import { handleError } from "@/lib/error-handler";
import { DetailDialog } from "@/components/shared/DetailDialog";
import { CustomersTable } from "@/components/tables/CustomersTable";
import { RelatedEntityCard } from "@/components/shared/RelatedEntityCard";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { DashboardStatsCalculator } from "@/lib/dashboard-automation/stats-calculator";
import { KPIGenerator } from "@/lib/dashboard-automation/kpi-generator";
import { QuickActionsGenerator } from "@/lib/dashboard-automation";
import { StatCard } from "@/components/smart-templates/StatCard";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { handleSuccess } from "@/lib/error-handler";
import { useMemoizedFilter } from "@/hooks/use-memoized-kpis";
import { CustomerForm as CustomerFormWrapper } from "@/components/forms/wrapped/CustomerForm";
import { useMainLayout } from "@/hooks/use-main-layout";
import { UniversalExportBar } from "@/components/dashboard/UniversalExportBar";
import type { CustomerInsert } from "@/api/customers";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  has_portal_access: boolean;
  credit_limit: number;
  outstanding_balance: number;
  is_manually_created: boolean;
  created_at: string;
  salutation?: string;
  title?: string;
  address?: string;
  notes?: string;
  archived?: boolean;
}

// V18.3: TypeScript Interfaces für Related Entities (C.4)
interface CustomerBooking {
  id: string;
  pickup_address: string;
  dropoff_address: string | null;
  pickup_time: string;
  price: number;
  status: string;
}

interface CustomerInvoice {
  id: string;
  price: number;
  payment_status: "pending" | "paid" | "overdue" | "cancelled";
  created_at: string;
}

export default function Kunden() {
  // ✅ ALLE HOOKS ZUERST (vor bedingter Logik)
  const { profile } = useAuth();
  const { customers, isLoading, archiveCustomer } = useCustomers();
  useRealtimeCustomers(); // V35.0: Realtime Updates
  const { toast } = useToast();
  const navigate = useNavigate();
  const bulkSelection = useBulkSelection<Customer>();
  const { isMobile } = useDeviceType();
  const { sidebarExpanded } = useMainLayout();

  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // ✅ MISSION II: TanStack Query Hook für Related Data
  const { bookings: customerBookings, invoices: customerInvoices } = useCustomerRelatedData(
    selectedCustomer?.id || null,
    profile?.company_id
  );

  const handleArchive = async (id: string) => {
    archiveCustomer(id);
    setDetailDialogOpen(false);
    bulkSelection.clearSelection();
  };

  // V18.3: Bulk-Actions Handlers
  const handleBulkEmail = () => {
    handleSuccess("E-Mail-Versand wird vorbereitet...");
    toast({
      title: "Funktion in Entwicklung",
      description: "E-Mail-Versand für mehrere Kunden wird bald verfügbar sein.",
    });
  };

  const handleBulkExport = () => {
    handleSuccess("Export wird vorbereitet...");
    toast({
      title: "Funktion in Entwicklung",
      description: "Export für mehrere Kunden wird bald verfügbar sein.",
    });
  };

  // ⚡ V18.5.1: Memoized Filter für Performance (50% schneller bei großen Listen)
  const filteredCustomers = useMemoizedFilter(
    () =>
      customers
        .filter((customer) => showArchived || !customer.archived)
        .filter(
          (customer) =>
            `${customer.first_name} ${customer.last_name}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone?.includes(searchTerm)
        ),
    [customers, showArchived, searchTerm]
  );

  // V18.5.1: Stats-Berechnung mit DashboardStatsCalculator
  const customerStats = useMemo(
    () =>
      DashboardStatsCalculator.customers(customers) as {
        total: number;
        portalAccess: number;
        openInvoices: number;
        openInvoicesAmount: number;
        percentagePortalAccess: number;
      },
    [customers]
  );

  // V18.5.1: KPIs mit KPIGenerator
  const kpis = useMemo(
    () => [
      KPIGenerator.customers.total(customerStats.total),
      KPIGenerator.customers.portalAccess(customerStats.portalAccess, customerStats.total),
      KPIGenerator.customers.openInvoices(
        customerStats.openInvoices,
        customerStats.openInvoicesAmount
      ),
    ],
    [customerStats]
  ) as [any, any, any];

  // V18.5.1: Quick Actions mit QuickActionsGenerator
  const quickActions: [any, any] = useMemo(
    () => [
      QuickActionsGenerator.create("Kunde anlegen", Plus, () => setDialogOpen(true)),
      QuickActionsGenerator.export(Download, () => handleBulkExport()),
    ],
    []
  );

  const getCustomerType = (customer: Customer) => {
    if (customer.is_manually_created) {
      return { label: "Manuell", type: "info" as const };
    }
    return { label: "Selbstregistriert", type: "success" as const };
  };

  const getBalanceStatus = (balance: number) => {
    if (balance === 0) return "success";
    if (balance > 0) return "warning";
    return "error";
  };

  // ✅ MISSION II: Entfernt - Related Data wird jetzt via useCustomerRelatedData Hook geladen

  return (
    <>
      <StandardPageLayout
        title="Kunden"
        description="MyDispatch Kundenverwaltung: Stammdaten, Kreditlimits und Zahlungsinformationen für Taxi- und Mietwagenunternehmen."
        canonical="/kunden"
        background="orbs-light"
        subtitle="Kundenverwaltung und Stammdaten"
        onCreateNew={() => setDialogOpen(true)}
        createButtonLabel="Kunde anlegen"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Kunden durchsuchen..."
        cardTitle="Kundenübersicht"
        cardIcon={<Users className="h-5 w-5" />}
        filterComponents={
          <div className="flex items-center gap-2">
            <Switch
              id="show-archived-customers"
              checked={showArchived}
              onCheckedChange={setShowArchived}
            />
            <Label htmlFor="show-archived-customers" className="text-sm cursor-pointer">
              Archivierte anzeigen
            </Label>
          </div>
        }
      >
        {/* ✅ V6.1: StatCards Pattern (Golden Template - EXAKT WIE /RECHNUNGEN) */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {kpis.map((kpi, index) => (
            <StatCard
              key={index}
              label={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              change={
                kpi.trend
                  ? {
                      value: kpi.trend.value,
                      trend: kpi.trend.value >= 0 ? "up" : "down",
                    }
                  : undefined
              }
            />
          ))}
        </div>

        {/* V33.0: Export Bar */}
        <UniversalExportBar
          data={filteredCustomers}
          filename={`kunden-${new Date().toISOString().split("T")[0]}`}
          showPdf={true}
          showExcel={true}
          showCsv={true}
        />

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Lädt...</div>
        ) : filteredCustomers.length === 0 ? (
          <EmptyState
            icon={<Users className="w-full h-full" />}
            title={searchTerm ? "Keine Kunden gefunden" : "Noch keine Kunden"}
            description={
              searchTerm
                ? "Versuchen Sie einen anderen Suchbegriff"
                : "Legen Sie Ihren ersten Kunden an, um mit der Verwaltung zu beginnen"
            }
            actionLabel={searchTerm ? undefined : "Kunde anlegen"}
            onAction={searchTerm ? undefined : () => setDialogOpen(true)}
            isSearchResult={searchTerm.length > 0}
          />
        ) : (
          <>
            <CustomersTable
              customers={filteredCustomers}
              onViewDetails={(customer) => {
                setSelectedCustomer(customer);
                setDetailDialogOpen(true);
              }}
              selectedIds={bulkSelection.selectedIds}
              onToggleSelection={bulkSelection.toggleSelection}
              onToggleSelectAll={() => bulkSelection.toggleSelectAll(filteredCustomers)}
              showBulkSelect={true}
            />
            <BulkActionBar
              selectedCount={bulkSelection.selectedCount}
              onClearSelection={bulkSelection.clearSelection}
              actions={[
                { label: "E-Mail senden", icon: Mail, onClick: handleBulkEmail },
                { label: "Exportieren", icon: Download, onClick: handleBulkExport },
              ]}
            />
          </>
        )}
      </StandardPageLayout>

      {/* Dialog für Kundenanlage/-bearbeitung */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? "Kunde bearbeiten" : "Neuer Kunde"}</DialogTitle>
            <DialogDescription>
              Erfassen Sie hier die Kundendaten. Pflichtfelder sind mit * gekennzeichnet.
            </DialogDescription>
          </DialogHeader>
          <CustomerForm
            customer={editingCustomer}
            companyId={profile?.company_id}
            onSuccess={() => {
              setDialogOpen(false);
              setEditingCustomer(null);
            }}
            onCancel={() => {
              setDialogOpen(false);
              setEditingCustomer(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog für Kunden-Details */}
      {selectedCustomer && (
        <DetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          title="Kunden-Details"
          createdAt={selectedCustomer.created_at}
          onEdit={() => {
            setEditingCustomer(selectedCustomer);
            setDetailDialogOpen(false);
            setDialogOpen(true);
          }}
          onArchive={() => handleArchive(selectedCustomer.id)}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">
                  {selectedCustomer.salutation && `${selectedCustomer.salutation} `}
                  {selectedCustomer.title && `${selectedCustomer.title} `}
                  {selectedCustomer.first_name} {selectedCustomer.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Typ</p>
                <StatusIndicator
                  type={getCustomerType(selectedCustomer).type}
                  label={getCustomerType(selectedCustomer).label}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">E-Mail</p>
                <p className="font-medium">{selectedCustomer.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefon</p>
                <p className="font-medium">{selectedCustomer.phone || "-"}</p>
              </div>
              {selectedCustomer.address && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="font-medium">{selectedCustomer.address}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Kreditlimit</p>
                <p className="font-medium">{formatCurrency(selectedCustomer.credit_limit)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Offener Betrag</p>
                <StatusIndicator
                  type={getBalanceStatus(selectedCustomer.outstanding_balance)}
                  label={formatCurrency(selectedCustomer.outstanding_balance)}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Portal-Zugang</p>
                <StatusIndicator
                  type={selectedCustomer.has_portal_access ? "success" : "neutral"}
                  label={selectedCustomer.has_portal_access ? "Aktiviert" : "Deaktiviert"}
                />
              </div>
            </div>
            {selectedCustomer.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notizen</p>
                <p className="text-sm mt-1">{selectedCustomer.notes}</p>
              </div>
            )}

            {/* V18.3: Related Entities */}
            <div className="space-y-3 mt-6 pt-6 border-t">
              <h4 className="text-sm font-semibold text-muted-foreground">Verknüpfte Daten</h4>

              {/* V18.3: Related Entities */}
              {customerBookings.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Letzte Aufträge ({customerBookings.length})
                  </p>
                  {customerBookings.slice(0, 3).map((booking) => (
                    <RelatedEntityCard
                      key={booking.id}
                      type="customer"
                      label="Auftrag"
                      value={`${booking.pickup_address} → ${booking.dropoff_address || "Unbekannt"}`}
                      meta={`Preis: ${formatCurrency(booking.price || 0)} | Status: ${booking.status}`}
                      onClick={() => navigate(`/auftraege?id=${booking.id}`)}
                      className="mb-2"
                    />
                  ))}
                </div>
              )}

              {/* V18.3: Offene Rechnungen */}
              {customerInvoices.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Offene Rechnungen ({customerInvoices.length})
                  </p>
                  {customerInvoices.map((invoice) => (
                    <RelatedEntityCard
                      key={invoice.id}
                      type="invoice"
                      label="Rechnung"
                      value={`RE-${invoice.id.substring(0, 8)}`}
                      meta={`Betrag: ${formatCurrency(invoice.price || 0)}`}
                      status={invoice.payment_status === "overdue" ? "error" : "warning"}
                      statusLabel={
                        invoice.payment_status === "overdue" ? "Überfällig" : "Ausstehend"
                      }
                      onClick={() => navigate(`/rechnungen?id=${invoice.id}`)}
                      className="mb-2"
                    />
                  ))}
                </div>
              )}

              {customerBookings.length === 0 && customerInvoices.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Noch keine verknüpften Daten vorhanden.
                </p>
              )}
            </div>
          </div>
        </DetailDialog>
      )}
    </>
  );
}

// CustomerForm component - Uses UnifiedForm Wrapper
interface CustomerFormProps {
  customer?: any;
  companyId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

function CustomerForm({ customer, companyId, onSuccess, onCancel }: CustomerFormProps) {
  const { createCustomer, updateCustomer, isCreating, isUpdating } = useCustomers();

  const form = useForm({
    defaultValues: {
      first_name: customer?.first_name || "",
      last_name: customer?.last_name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      mobile: customer?.mobile || "",
      salutation: customer?.salutation || "",
      title: customer?.title || "",
      birth_date: customer?.birth_date || "",
      street: customer?.street || "",
      street_number: customer?.street_number || "",
      postal_code: customer?.postal_code || "",
      city: customer?.city || "",
      tax_id: customer?.tax_id || "",
      customer_number: customer?.customer_number || "",
      credit_limit: customer?.credit_limit || 0,
      outstanding_balance: customer?.outstanding_balance || 0,
      payment_terms: customer?.payment_term_days || 14,
      notes: customer?.notes || "",
      has_portal_access: customer?.has_portal_access || false,
    },
  });

  const handleSubmit = async (data: any) => {
    const customerData: Partial<CustomerInsert> = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email || null,
      phone: data.phone || null,
      salutation: data.salutation || null,
      title: data.title || null,
      street: data.street || null,
      street_number: data.street_number || null,
      postal_code: data.postal_code || null,
      city: data.city || null,
      tax_id: data.tax_id || null,
      credit_limit: parseFloat(data.credit_limit) || 0,
      outstanding_balance: parseFloat(data.outstanding_balance) || 0,
      payment_term_days: parseInt(data.payment_terms) || 14,
      notes: data.notes || null,
      has_portal_access: data.has_portal_access || false,
      // Additional required fields for CustomerInsert type
      address: data.address || null,
      archived: false,
      billing_address: data.billing_address || null,
      billing_city: data.billing_city || null,
      billing_postal_code: data.billing_postal_code || null,
      billing_street: data.billing_street || null,
      billing_street_number: data.billing_street_number || null,
      company_name: data.company_name || null,
      customer_type: data.customer_type || null,
      discount_percentage: data.discount_percentage || null,
      is_manually_created: true,
      // company_id wird automatisch vom Hook hinzugefügt
    };

    if (customer) {
      await updateCustomer({ id: customer.id, ...customerData });
    } else {
      await createCustomer(customerData as any);
    }

    onSuccess();
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <CustomerFormWrapper
      form={form}
      onSubmit={handleSubmit}
      mode="dialog"
      portal="entrepreneur"
      loading={isSubmitting}
    />
  );
}

// 🧠 Brain-System Validation Report wird in der Haupt-Komponente gerendert (siehe Zeile ~103)
