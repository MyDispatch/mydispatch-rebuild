/* ==================================================================================
   FINANZEN (RECHNUNGEN & ANGEBOTE) V28.1 - PROFESSIONAL GRAY-BLUE DESIGN
   ==================================================================================
   ✅ V28.1 Professional Design (Tailwind Slate Palette)
   ✅ Dezente, moderne B2B-Ästhetik
   ✅ Rechnungsverwaltung mit Datenbankanbindung
   ✅ Angebotsverwaltung (von Aufträge verschoben)
   ✅ Multi-Tenant mit company_id
   ✅ Status-Tracking (Bezahlt, Ausstehend, Überfällig)
   ✅ Tab-Navigation: Rechnungen / Angebote
   ================================================================================== */

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useInvoices } from '@/hooks/use-invoices';
import { useBookings } from '@/hooks/use-bookings';
import { useBulkSelection } from '@/hooks/use-bulk-selection';
import { useDeviceType } from '@/hooks/use-device-type';
import { BulkActionBar } from '@/components/shared/BulkActionBar';
import { MobileRechnungen } from '@/components/mobile/MobileRechnungen';
import { supabase } from '@/integrations/supabase/client';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { V28Button } from '@/components/design-system/V28Button';
import { FileText, Download, Mail, Filter, Send, Eye, Euro, BookOpen, Plus, UserPlus, Edit } from 'lucide-react';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { useToast } from '@/hooks/use-toast';
import { handleError, handleSuccess } from '@/lib/error-handler';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useSearchParams, useLocation } from 'react-router-dom';
import { KPIGenerator, QuickActionsGenerator } from '@/lib/dashboard-automation';
import { DashboardStatsCalculator } from '@/lib/dashboard-automation/stats-calculator';
import { formatCurrency } from '@/lib/format-utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/shared/EmptyState';
import { StandardActionButtons } from '@/components/shared/StandardActionButtons';
import { DetailDialog } from '@/components/shared/DetailDialog';
import { RelatedEntityCard, getStandardActions } from '@/components/shared/RelatedEntityCard';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { InvoiceDialog } from '@/components/invoices/InvoiceDialog';
import { SkeletonTable, SkeletonKPIGrid } from '@/components/shared/SkeletonCard';
import { useStatistics } from '@/hooks/use-statistics';
import { useMainLayout } from '@/hooks/use-main-layout';
import { UniversalExportBar } from '@/components/dashboard/UniversalExportBar';
import { cn } from '@/lib/utils';
import { StatCard } from '@/components/smart-templates/StatCard';
// ✅ REMOVED: Dead import SidebarAIChatTrigger (P1.8)

interface Invoice {
  id: string;
  customer_id: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  created_at: string;
  payment_method?: string;
  payment_status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  price: number;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
}

// V18.3: TypeScript Interface für Related Booking (C.4)
interface InvoiceBooking {
  id: string;
  pickup_address: string;
  dropoff_address: string;
  pickup_time: string;
  price: number;
  status: string;
  customer_id: string;
  driver_id: string | null;
  vehicle_id: string | null;
}

const Rechnungen = () => {
  // V18.3: ALL HOOKS FIRST (vor conditionals)
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isMobile } = useDeviceType();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'rechnungen';
  const [searchTerm, setSearchTerm] = useState('');
  
  // ⚡ HOOK-ZENTRALISIERUNG - React Query für Invoices
  const { invoices: hookInvoices, isLoading: invoicesLoading } = useInvoices();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [invoiceBooking, setInvoiceBooking] = useState<InvoiceBooking | null>(null);
  const [invoiceCustomer, setInvoiceCustomer] = useState<Customer | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // V18.3: Bulk-Selection Integration
  const bulkSelection = useBulkSelection<Invoice>();
  
  // V28.2.19: Statistics für Quick-Actions
  const { stats } = useStatistics();
  const { sidebarExpanded } = useMainLayout();

  // V18.3: Bookings für Angebote-Tab
  const { bookings: allBookings } = useBookings();
  const offers = allBookings.filter(b => b.is_offer);

  // V18.3: Bulk-Actions Handlers
  const handleBulkPDFExport = async () => {
    try {
      toast({
        title: 'PDF-Export wird erstellt...',
        description: `${bulkSelection.selectedCount} Rechnungen werden exportiert.`,
      });

      const { data, error } = await supabase.functions.invoke('bulk-export-pdf', {
        body: {
          entity_type: 'invoices',
          entity_ids: bulkSelection.selectedIds
        }
      });

      if (error) throw error;

      handleSuccess(`${data.count} PDFs erfolgreich erstellt`);
      if (data.download_url) {
        window.open(data.download_url, '_blank');
      }
      bulkSelection.clearSelection();
    } catch (error) {
      handleError(error, 'PDF-Export fehlgeschlagen');
    }
  };

  const handleBulkEmail = async () => {
    const emailType = prompt('Email-Typ (invoice/reminder):', 'invoice');
    if (!emailType) return;

    try {
      toast({
        title: 'E-Mails werden versendet...',
        description: `${bulkSelection.selectedCount} E-Mails werden versendet.`,
      });

      const { data, error } = await supabase.functions.invoke('bulk-send-email', {
        body: {
          entity_type: 'invoices',
          entity_ids: bulkSelection.selectedIds,
          email_type: emailType
        }
      });

      if (error) throw error;

      handleSuccess(`${data.sent} E-Mails erfolgreich versendet${data.failed > 0 ? ` (${data.failed} fehlgeschlagen)` : ''}`);
      bulkSelection.clearSelection();
    } catch (error) {
      handleError(error, 'E-Mail-Versand fehlgeschlagen');
    }
  };

  const handleBulkReminder = async () => {
    try {
      toast({
        title: 'Zahlungserinnerungen werden versendet...',
        description: `${bulkSelection.selectedCount} Erinnerungen werden versendet.`,
      });

      const { data, error } = await supabase.functions.invoke('bulk-send-email', {
        body: {
          entity_type: 'invoices',
          entity_ids: bulkSelection.selectedIds,
          email_type: 'reminder'
        }
      });

      if (error) throw error;

      handleSuccess(`${data.sent} Zahlungserinnerungen erfolgreich versendet${data.failed > 0 ? ` (${data.failed} fehlgeschlagen)` : ''}`);
      bulkSelection.clearSelection();
    } catch (error) {
      handleError(error, 'Erinnerungs-Versand fehlgeschlagen');
    }
  };

  useEffect(() => {
    if (profile?.company_id) {
      fetchCustomers();
    }
  }, [profile?.company_id]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('company_id', profile?.company_id)
        .eq('archived', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      handleError(error, 'Fehler beim Laden der Kunden');
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.first_name} ${customer.last_name}` : 'Unbekannt';
  };

  const getInvoiceStatusType = (status: string) => {
    const statusMap: Record<string, unknown> = {
      paid: 'success',
      pending: 'warning',
      overdue: 'error',
      cancelled: 'neutral',
    };
    return statusMap[status] || 'neutral';
  };

  const getInvoiceStatusLabel = (status: string) => {
    const labelMap: Record<string, string> = {
      paid: 'Bezahlt',
      pending: 'Ausstehend',
      overdue: 'Überfällig',
      cancelled: 'Storniert',
    };
    return labelMap[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  // ✅ FIX: invoices MUSS vor Verwendung definiert werden (Temporal Dead Zone Fix)
  const invoices = hookInvoices;
  const loading = invoicesLoading;

  // ⚡ V18.5.1: Memoized Filter für Performance - FIXED: Hooks direkt im Component Body
  const allInvoices = useMemo(
    () => invoices.filter(invoice => 
      getCustomerName(invoice.customer_id).toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [invoices, searchTerm, customers]
  );

  const paidInvoices = useMemo(
    () => allInvoices.filter(invoice => invoice.status === 'paid'),
    [allInvoices]
  );

  const pendingInvoices = useMemo(
    () => allInvoices.filter(invoice => invoice.status === 'pending'),
    [allInvoices]
  );

  const overdueInvoices = useMemo(
    () => allInvoices.filter(invoice => invoice.status === 'overdue'),
    [allInvoices]
  );

  // V18.3: Load Related Data for Invoice Detail
  const loadInvoiceRelatedData = async (invoice: Invoice) => {
    if (!profile?.company_id) return;

    try {
      // Load customer details
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', invoice.customer_id)
        .eq('company_id', profile.company_id)
        .eq('archived', false)
        .maybeSingle();

      if (customerError) throw customerError;
      setInvoiceCustomer(customerData);
    } catch (error) {
      handleError(error, 'Fehler beim Laden der Rechnungsdaten');
    }
  };

  // V18.3: Mobile View Handler
  const handleDownloadPDF = async (invoiceId: string) => {
    toast({
      title: 'Bald verfügbar',
      description: 'PDF-Export wird in Kürze verfügbar sein.',
    });
  };

  const handleSendEmail = async (invoiceId: string) => {
    toast({
      title: 'Bald verfügbar',
      description: 'E-Mail-Versand wird in Kürze verfügbar sein.',
    });
  };

  // ==================================================================================
  // V18.5.1: SSOT - Einheitliche KPIs und Quick Actions für Mobile + Desktop
  // ==================================================================================
  const invoiceKPIs = useMemo(() => [
    KPIGenerator.invoices.open(
      invoices.filter(i => i.status === 'pending').length,
      invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0)
    ),
    KPIGenerator.invoices.overdue(
      invoices.filter(i => i.status === 'overdue').length,
      invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0)
    ),
    KPIGenerator.custom({
      title: 'Umsatz Monat',
      value: formatCurrency(invoices.filter(i => {
        const invoiceDate = new Date(i.created_at);
        const now = new Date();
        return invoiceDate.getMonth() === now.getMonth() && invoiceDate.getFullYear() === now.getFullYear();
      }).reduce((sum, i) => sum + i.amount, 0)),
      icon: Euro,
    })
  ] as [any, any, any], [invoices]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Lädt...</p>
      </div>
    );
  }

  // V18.3: Mobile View - AUCH mit Layout für Breadcrumbs!
  if (isMobile) {
    // Map invoices to mobile format
    const mobileInvoices = invoices.map(inv => ({
      id: inv.id,
      invoice_number: `RE-${inv.id.substring(0, 8)}`,
      customer_first_name: customers.find(c => c.id === inv.customer_id)?.first_name || '',
      customer_last_name: customers.find(c => c.id === inv.customer_id)?.last_name || '',
      total: inv.amount,
      payment_status: inv.status,
      invoice_date: inv.created_at,
    }));

    return (
      <>
        <main
          className={cn(
            "transition-[margin] duration-300",
            "pt-14 pb-16" // Mobile: Standard Header + Footer
          )}
        >
          <StandardPageLayout
            title="Finanzen"
            description="MyDispatch Finanzverwaltung: Erstellen und verwalten Sie Rechnungen und Angebote"
            canonical="/rechnungen"
            subtitle="Verwalten Sie Ihre Finanzen"
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder={currentTab === 'rechnungen' ? "Rechnungen durchsuchen..." : "Angebote durchsuchen..."}
          >
            {/* V18.5.1: KPI-Cards (ohne Schnellzugriff im Header!) */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {invoiceKPIs.map((kpi, index) => (
                <StatCard
                  key={index}
                  label={kpi.title}
                  value={kpi.value}
                  icon={kpi.icon}
                  change={kpi.trend ? { value: kpi.trend.value, trend: kpi.trend.value >= 0 ? 'up' : 'down' } : undefined}
                />
              ))}
            </div>

        <MobileRechnungen
          invoices={mobileInvoices}
          isLoading={loading}
          onCreateNew={() => setCreateDialogOpen(true)}
          onInvoiceClick={(invoice) => {
            const originalInvoice = invoices.find(i => i.id === invoice.id);
            if (originalInvoice) {
              setSelectedInvoice(originalInvoice);
              loadInvoiceRelatedData(originalInvoice);
              setDetailDialogOpen(true);
            }
          }}
          onRefresh={() => {}} // Auto-refresh via React Query
          onDownloadPDF={handleDownloadPDF}
          onSendEmail={handleSendEmail}
        />
          </StandardPageLayout>
        </main>
      </>
    );
  }

  const renderInvoiceTable = (filteredInvoices: Invoice[]) => {
    // Check if all items are selected
    const isAllSelected = filteredInvoices.length > 0 && filteredInvoices.every(inv => bulkSelection.selectedIds.includes(inv.id));
    const isSomeSelected = bulkSelection.selectedIds.length > 0 && !isAllSelected;

    return (
      <>
        <div className="overflow-x-auto scrollbar-hide">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={() => bulkSelection.toggleSelectAll(filteredInvoices)}
                    className={isSomeSelected && !isAllSelected ? "data-[state=checked]:bg-primary" : ""}
                    aria-label="Alle auswählen"
                  />
                </TableHead>
                <TableHead>Rechnungs-ID</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead className="hidden md:table-cell">Datum</TableHead>
                <TableHead>Betrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-0">
                    <EmptyState
                      icon={<FileText className="w-full h-full" />}
                      title={searchTerm ? 'Keine Rechnungen gefunden' : 'Noch keine Rechnungen vorhanden'}
                      description={searchTerm ? 'Versuchen Sie eine andere Suchanfrage' : 'Rechnungen werden automatisch aus abgeschlossenen Aufträgen generiert'}
                      isSearchResult={!!searchTerm}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <Checkbox
                        checked={bulkSelection.isSelected(invoice.id)}
                        onCheckedChange={() => bulkSelection.toggleSelection(invoice.id)}
                        aria-label={`Rechnung ${invoice.id} auswählen`}
                      />
                    </TableCell>
                <TableCell className="font-mono text-sm">
                  RE-{invoice.id.substring(0, 8)}
                </TableCell>
                <TableCell className="font-medium">
                  {getCustomerName(invoice.customer_id)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(invoice.created_at)}
                </TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(invoice.amount)}
                </TableCell>
                <TableCell>
                  <StatusIndicator
                    type={getInvoiceStatusType(invoice.status)}
                    label={getInvoiceStatusLabel(invoice.status)}
                    size="sm"
                  />
                </TableCell>
                     <TableCell>
                       <div className="flex justify-end gap-2">
                         <V28Button 
                           variant="secondary" 
                           size="sm"
                           onClick={() => {
                             setSelectedInvoice(invoice);
                             loadInvoiceRelatedData(invoice);
                             setDetailDialogOpen(true);
                           }}
                         >
                           <Eye className="h-4 w-4" />
                         </V28Button>
                         <V28Button 
                           variant="secondary" 
                           size="sm"
                           onClick={() => toast({
                             title: 'Bald verfügbar',
                             description: 'PDF-Export wird in Kürze verfügbar sein.',
                           })}
                         >
                           <Download className="h-4 w-4" />
                         </V28Button>
                         <V28Button 
                           variant="secondary" 
                           size="sm"
                           onClick={() => toast({
                             title: 'Bald verfügbar',
                             description: 'E-Mail-Versand wird in Kürze verfügbar sein.',
                           })}
                         >
                           <Mail className="h-4 w-4" />
                         </V28Button>
                       </div>
                     </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <BulkActionBar
          selectedCount={bulkSelection.selectedCount}
          onClearSelection={bulkSelection.clearSelection}
          actions={[
            { label: 'PDF exportieren', icon: Download, onClick: handleBulkPDFExport },
            { label: 'Rechnung senden', icon: Mail, onClick: handleBulkEmail },
            { label: 'Zahlungserinnerung', icon: Send, onClick: handleBulkReminder, variant: 'secondary' },
          ]}
        />
      </>
    );
  };

  return (
    <>
      <StandardPageLayout
          className="transition-all duration-300"
          title="Finanzen"
          description="MyDispatch Finanzverwaltung: Rechnungen, Angebote und Zahlungstracking für Taxi- und Mietwagenunternehmen."
          canonical="/rechnungen"
          subtitle="Verwalten Sie Ihre Rechnungen, Angebote und Zahlungen"
          onCreateNew={() => currentTab === 'rechnungen' ? setCreateDialogOpen(true) : navigate('/auftraege', { state: { createOffer: true } })}
          createButtonLabel={currentTab === 'rechnungen' ? "Neue Rechnung" : "Neues Angebot"}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={currentTab === 'rechnungen' ? "Rechnungen durchsuchen..." : "Angebote durchsuchen..."}
          cardTitle="Finanz-Übersicht"
          cardIcon={<FileText className="h-5 w-5" />}
        >
          {/* ✅ V6.1: StatCards Pattern (Golden Template - Desktop) */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {invoiceKPIs.map((kpi, index) => (
              <StatCard
                key={index}
                label={kpi.title}
                value={kpi.value}
                icon={kpi.icon}
                change={kpi.trend ? { 
                  value: kpi.trend.value, 
                  trend: kpi.trend.value >= 0 ? 'up' : 'down' 
                } : undefined}
              />
            ))}
          </div>

        {/* V33.0: Export Bar */}
        <UniversalExportBar
          data={allInvoices}
          filename={`rechnungen-${new Date().toISOString().split('T')[0]}`}
          showPdf={true}
          showExcel={true}
          showCsv={true}
        />

        <Tabs value={currentTab} onValueChange={(value) => setSearchParams({ tab: value })}>
          <TabsList className="mb-4">
            <TabsTrigger 
              value="rechnungen" 
              className="flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-1.5 text-xs sm:text-sm"
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Rechnungen</span>
              <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0 sm:ml-1">
                {invoices.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="angebote" 
              className="flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-1.5 text-xs sm:text-sm min-h-[44px]"
            >
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Angebote</span>
              <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0 sm:ml-1">
                {offers.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rechnungen">
        {renderInvoiceTable(allInvoices)}
          </TabsContent>

          <TabsContent value="angebote">
            {offers.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="w-full h-full" />}
                title={searchTerm ? 'Keine Angebote gefunden' : 'Noch keine Angebote'}
                description={searchTerm ? 'Versuchen Sie einen anderen Suchbegriff' : 'Erstellen Sie Angebote in der Aufträge-Seite'}
                actionLabel="Zu Aufträgen"
                onAction={() => navigate('/auftraege')}
              />
            ) : (
              <div className="overflow-x-auto scrollbar-hide rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Abholort</TableHead>
                      <TableHead className="hidden md:table-cell">Zielort</TableHead>
                      <TableHead className="hidden lg:table-cell">Abholzeit</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="hidden sm:table-cell text-right">Preis</TableHead>
                      <TableHead className="w-[150px] text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offers.filter(o => 
                      !o.archived &&
                      (o.pickup_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       o.dropoff_address?.toLowerCase().includes(searchTerm.toLowerCase()))
                    ).map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell className="font-medium">{offer.pickup_address}</TableCell>
                        <TableCell className="hidden md:table-cell">{offer.dropoff_address}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {format(new Date(offer.pickup_time), 'dd.MM.yyyy HH:mm', { locale: de })}
                        </TableCell>
                        <TableCell>
                          <StatusIndicator
                            type={offer.offer_status === 'pending' ? 'warning' : offer.offer_status === 'accepted' ? 'success' : 'error'}
                            label={offer.offer_status === 'pending' ? 'Offen' : offer.offer_status === 'accepted' ? 'Angenommen' : 'Abgelehnt'}
                          />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-right font-semibold">
                          {offer.price ? formatCurrency(offer.price) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <V28Button
                              size="sm"
                              variant="secondary"
                              onClick={() => navigate('/auftraege', { state: { viewOffer: offer.id } })}
                            >
                              <Eye className="h-4 w-4" />
                            </V28Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* V18.3: Invoice Creation Dialog */}
        <InvoiceDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />

        {/* V18.3: Invoice Detail Dialog */}
        {selectedInvoice && (
          <DetailDialog
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            title={`Rechnung RE-${selectedInvoice.id.substring(0, 8)}`}
            createdAt={selectedInvoice.created_at}
            relatedEntities={
              <>
                {/* Booking */}
                {invoiceBooking && (
                  <RelatedEntityCard
                    type="invoice"
                    label="Auftrag"
                    value={`${invoiceBooking.pickup_address} → ${invoiceBooking.dropoff_address}`}
                    meta={`${format(new Date(invoiceBooking.pickup_time), 'dd.MM.yyyy HH:mm', { locale: de })} • ${formatCurrency(invoiceBooking.price || 0)}`}
                    onClick={() => {
                      setDetailDialogOpen(false);
                      navigate('/auftraege', { state: { viewBooking: invoiceBooking.id } });
                    }}
                    actions={[
                      {
                        icon: Eye,
                        label: 'Details',
                        onClick: () => {
                          setDetailDialogOpen(false);
                          navigate('/auftraege', { state: { viewBooking: invoiceBooking.id } });
                        }
                      }
                    ]}
                  />
                )}

                {/* Customer */}
                {invoiceCustomer && (
                  <RelatedEntityCard
                    type="customer"
                    label="Kunde"
                    value={`${invoiceCustomer.first_name} ${invoiceCustomer.last_name}`}
                    meta={invoiceCustomer.email || invoiceCustomer.phone || 'Keine Kontaktdaten'}
                    onClick={() => {
                      setDetailDialogOpen(false);
                      navigate('/kunden', { state: { viewCustomer: invoiceCustomer.id } });
                    }}
                    actions={[
                      ...(invoiceCustomer.phone ? [getStandardActions.phone(invoiceCustomer.phone)] : []),
                      ...(invoiceCustomer.email ? [getStandardActions.email(invoiceCustomer.email)] : []),
                    ]}
                  />
                )}
              </>
            }
          >
            {/* Main Content - Invoice Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Rechnungs-ID</p>
                  <p className="font-mono text-sm">RE-{selectedInvoice.id.substring(0, 8)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={
                    selectedInvoice.status === 'paid' ? 'default' :
                    selectedInvoice.status === 'overdue' ? 'destructive' : 'secondary'
                  }>
                    {getInvoiceStatusLabel(selectedInvoice.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kunde</p>
                  <p className="font-medium">{getCustomerName(selectedInvoice.customer_id)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Betrag</p>
                  <p className="font-semibold text-lg">{formatCurrency(selectedInvoice.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Erstellt am</p>
                  <p>{formatDate(selectedInvoice.created_at)}</p>
                </div>
              </div>
            </div>
          </DetailDialog>
          )}
        </StandardPageLayout>

      {/* V33.0: Schnellzugriff Sidebar (rechts) - Desktop only - KOMPAKT & PROFESSIONELL! */}
      {!isMobile && (
        <aside 
          className="fixed right-0 top-16 bottom-0 bg-white border-l border-slate-200 shadow-lg z-20 overflow-y-auto hidden md:block transition-all duration-300"
          style={{
            width: '320px', // ✅ Feste professionelle Breite - immer sichtbar!
          }}
        >
          {/* Schnellzugriff Actions */}
          <div className="p-4 space-y-3 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-slate-700" />
              Schnellzugriff
            </h3>
            
            <V28Button
              variant="primary"
              fullWidth
              icon={Plus}
              iconPosition="left"
              onClick={() => setCreateDialogOpen(true)}
            >
              Neue Rechnung
            </V28Button>

            <V28Button
              variant="secondary"
              fullWidth
              icon={Download}
              iconPosition="left"
              onClick={() => handleBulkPDFExport()}
            >
              Export
            </V28Button>
          </div>

          {/* Live-Status Stats */}
          <div className="p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Live-Status</h4>
            
            <div className="space-y-2">
              {/* Offene Rechnungen */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-600">Offen</span>
                  <FileText className="h-4 w-4 text-slate-400" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{pendingInvoices.length}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {formatCurrency(pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
                </p>
              </div>
              
              {/* Überfällige Rechnungen */}
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-red-600">Überfällig</span>
                  <Mail className="h-4 w-4 text-red-400" />
                </div>
                <p className="text-2xl font-bold text-red-700">{overdueInvoices.length}</p>
                <p className="text-xs text-red-500 mt-1">
                  {formatCurrency(overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
                </p>
              </div>
              
              {/* Bezahlte Rechnungen (Monat) */}
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-green-600">Bezahlt (Monat)</span>
                  <Euro className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-green-700">
                  {paidInvoices.filter(inv => {
                    const invDate = new Date(inv.created_at);
                    const now = new Date();
                    return invDate.getMonth() === now.getMonth() && 
                           invDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
                <p className="text-xs text-green-500 mt-1">
                  {formatCurrency(paidInvoices.filter(inv => {
                    const invDate = new Date(inv.created_at);
                    const now = new Date();
                    return invDate.getMonth() === now.getMonth() && 
                           invDate.getFullYear() === now.getFullYear();
                  }).reduce((sum, inv) => sum + inv.amount, 0))}
                </p>
              </div>
            </div>
          </div>

          {/* ✅ REMOVED: AI Chat Trigger (P1.8 Dead Code Cleanup) */}
      </aside>
      )}
    </>
  );
};

export default Rechnungen;
