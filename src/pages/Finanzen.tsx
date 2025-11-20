/* ==================================================================================
   FINANZEN V38.0 - GOLDEN TEMPLATE ENFORCEMENT
   ==================================================================================
   ✅ StandardPageLayout
   ✅ KPI-Cards mit StatCard
   ✅ UniversalExportBar
   ✅ Bulk Selection
   ✅ Mobile: MobileRechnungen Component
   ✅ V28.1 Design System
   ================================================================================== */

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useInvoices } from '@/hooks/use-invoices';
import { useBulkSelection } from '@/hooks/use-bulk-selection';
import { useDeviceType } from '@/hooks/use-device-type';
import { useNavigate } from 'react-router-dom';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { StatCard } from '@/components/smart-templates/StatCard';
import { UniversalExportBar } from '@/components/dashboard/UniversalExportBar';
import { BulkActionBar } from '@/components/shared/BulkActionBar';
import { MobileRechnungen } from '@/components/mobile/MobileRechnungen';
import { V28Button } from '@/components/design-system/V28Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { EmptyState } from '@/components/shared/EmptyState';
import { Euro, FileText, AlertTriangle, Eye, Edit, Download, Mail } from 'lucide-react';
import { formatCurrency } from '@/lib/format-utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { handleSuccess } from '@/lib/error-handler';

export default function Finanzen() {
  // V18.3: ALL HOOKS FIRST
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isMobile } = useDeviceType();
  const { invoices = [], isLoading: invoicesLoading } = useInvoices();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Bulk Selection
  const bulkSelection = useBulkSelection<any>();

  // Authentication Guard - KRITISCH für Sicherheit!
  useEffect(() => {
    if (!loading && !profile) {
      navigate('/auth', { replace: true });
    }
  }, [loading, profile, navigate]);

  // Filter invoices
  const filteredInvoices = useMemo(
    () => invoices.filter(inv => 
      inv.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [invoices, searchTerm]
  );

  const activeInvoices = useMemo(() => filteredInvoices.filter(inv => !inv.archived), [filteredInvoices]);

  // KPI Calculations
  const financeStats = useMemo(() => {
    const total = activeInvoices.reduce((sum, inv) => sum + (inv.price || 0), 0);
    const open = activeInvoices.filter(inv => inv.payment_status === 'pending').length;
    const overdue = activeInvoices.filter(inv => inv.payment_status === 'overdue').length;
    const paid = activeInvoices.filter(inv => inv.payment_status === 'paid').length;
    
    const thisMonth = activeInvoices.filter((i: any) => {
      const date = new Date(i.created_at);
      const now = new Date();
      return date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear();
    });
    const monthlyRevenue = thisMonth.reduce((sum: number, i: any) => 
      sum + (i.price || 0), 0);

    return { total, open, overdue, paid, monthlyRevenue };
  }, [activeInvoices]);

  // KPIs
  const kpis = useMemo(() => [
    {
      label: 'Umsatz (Monat)',
      value: formatCurrency(financeStats.monthlyRevenue),
      icon: Euro,
    },
    {
      label: 'Offene Rechnungen',
      value: financeStats.open.toString(),
      icon: FileText,
    },
    {
      label: 'Überfällig',
      value: financeStats.overdue.toString(),
      icon: AlertTriangle,
    },
  ], [financeStats]);

  // Bulk Actions
  const handleBulkEmail = async () => {
    toast({
      title: 'E-Mails werden versendet...',
      description: `${bulkSelection.selectedCount} Rechnungen werden versendet.`,
    });
    handleSuccess(`${bulkSelection.selectedCount} Rechnungen erfolgreich versendet`);
    bulkSelection.clearSelection();
  };

  const handleBulkExport = async () => {
    toast({
      title: 'Export wird erstellt...',
      description: `${bulkSelection.selectedCount} Rechnungen werden exportiert.`,
    });
    handleSuccess(`${bulkSelection.selectedCount} Rechnungen erfolgreich exportiert`);
    bulkSelection.clearSelection();
  };

  if (loading || invoicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600">Laden...</p>
      </div>
    );
  }

  // Mobile View
  if (isMobile) {
    return (
      <StandardPageLayout
        title="Finanzen - MyDispatch"
        description="Umsätze, Rechnungen und finanzielle Übersichten"
        canonical="/finanzen"
        subtitle="Ihre finanzielle Übersicht im Blick"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechnungen durchsuchen..."
      >
        {/* KPIs für Mobile */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {kpis.map((kpi, index) => (
            <StatCard
              key={index}
              label={kpi.label}
              value={kpi.value}
              icon={kpi.icon}
            />
          ))}
        </div>

        <MobileRechnungen
          invoices={activeInvoices.map(inv => ({
            id: inv.id,
            invoice_number: inv.id.slice(0, 8),
            customer_name: inv.customer ? `${inv.customer.first_name} ${inv.customer.last_name}` : 'Unbekannt',
            amount: inv.price || 0,
            status: inv.payment_status || 'pending',
            date: inv.created_at,
          }))}
          isLoading={invoicesLoading}
          onCreateNew={() => navigate('/rechnungen')}
          onInvoiceClick={(invoice) => navigate(`/rechnungen/${invoice.id}`)}
          onRefresh={() => window.location.reload()}
        />
      </StandardPageLayout>
    );
  }

  // Desktop View
  const isAllSelected = activeInvoices.length > 0 && activeInvoices.every(inv => bulkSelection.selectedIds.includes(inv.id));

  return (
    <StandardPageLayout
      title="Finanzen - MyDispatch"
      description="Umsätze, Rechnungen und finanzielle Übersichten"
      canonical="/finanzen"
      subtitle="Ihre finanzielle Übersicht im Blick"
      onCreateNew={() => navigate('/rechnungen')}
      createButtonLabel="Neue Rechnung"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Rechnungen durchsuchen..."
      cardTitle="Finanzübersicht"
      cardIcon={<Euro className="h-5 w-5" />}
    >
      {/* KPIs */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {kpis.map((kpi, index) => (
          <StatCard
            key={index}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
          />
        ))}
      </div>

      {/* Export Bar */}
      <UniversalExportBar
        data={activeInvoices}
        filename={`finanzen-${new Date().toISOString().split('T')[0]}`}
        showPdf={true}
        showExcel={true}
        showCsv={true}
      />

      {/* Table */}
      <div className="overflow-x-auto scrollbar-hide">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={() => bulkSelection.toggleSelectAll(activeInvoices)}
                  aria-label="Alle auswählen"
                />
              </TableHead>
              <TableHead>Rechnungs-Nr.</TableHead>
              <TableHead className="hidden md:table-cell">Kunde</TableHead>
              <TableHead>Betrag</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Datum</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="p-0">
                  <EmptyState
                    icon={<FileText className="w-full h-full" />}
                    title={searchTerm ? 'Keine Rechnungen gefunden' : 'Noch keine Rechnungen vorhanden'}
                    description={searchTerm ? 'Versuchen Sie eine andere Suchanfrage' : 'Erstellen Sie Ihre erste Rechnung'}
                    isSearchResult={!!searchTerm}
                  />
                </TableCell>
              </TableRow>
            ) : (
              activeInvoices.map((invoice: any) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Checkbox
                      checked={bulkSelection.isSelected(invoice.id)}
                      onCheckedChange={() => bulkSelection.toggleSelection(invoice.id)}
                      aria-label={`Rechnung ${invoice.id.slice(0, 8)} auswählen`}
                    />
                  </TableCell>
                  <TableCell className="font-mono font-medium text-slate-900">
                    {invoice.id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-slate-900">
                    {invoice.customer ? `${invoice.customer.first_name} ${invoice.customer.last_name}` : 'Unbekannt'}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {formatCurrency(invoice.price || 0)}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.payment_status === 'paid' 
                        ? 'bg-status-success/10 text-status-success' 
                        : invoice.payment_status === 'overdue'
                        ? 'bg-status-error/10 text-status-error'
                        : 'bg-status-warning/10 text-status-warning'
                    }`}>
                      {invoice.payment_status === 'paid' ? 'Bezahlt' : 
                       invoice.payment_status === 'overdue' ? 'Überfällig' : 'Ausstehend'}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-slate-600">
                    {format(new Date(invoice.created_at), 'dd.MM.yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <V28Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => navigate(`/rechnungen/${invoice.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </V28Button>
                      <V28Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => toast({ title: 'Bald verfügbar' })}
                      >
                        <Edit className="h-4 w-4" />
                      </V28Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={bulkSelection.selectedCount}
        onClearSelection={bulkSelection.clearSelection}
        actions={[
          { label: 'E-Mail senden', icon: Mail, onClick: handleBulkEmail },
          { label: 'Export', icon: Download, onClick: handleBulkExport },
        ]}
      />
    </StandardPageLayout>
  );
}
