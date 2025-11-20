/* ==================================================================================
   MOBILE-OPTIMIERTE RECHNUNGEN-ANSICHT V18.3 - MIT GRID-LAYOUT
   ==================================================================================
   Verwendet MobileGridLayout für standardisierte Struktur
   ================================================================================== */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { Plus, Search, Download, Mail, Calendar } from 'lucide-react';
import { MobileGridLayout } from './MobileGridLayout';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { formatCurrency } from '@/lib/index';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name?: string;
  customer_first_name?: string;
  customer_last_name?: string;
  total: number;
  payment_status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  invoice_date: string;
  due_date?: string;
}

interface MobileRechnungenProps {
  invoices: Invoice[];
  isLoading: boolean;
  onCreateNew: () => void;
  onInvoiceClick: (invoice: Invoice) => void;
  onRefresh: () => void;
  onDownloadPDF?: (invoiceId: string) => void;
  onSendEmail?: (invoiceId: string) => void;
}

export function MobileRechnungen({
  invoices,
  isLoading,
  onCreateNew,
  onInvoiceClick,
  onRefresh,
  onDownloadPDF,
  onSendEmail
}: MobileRechnungenProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = invoices.filter(invoice => {
    if (activeFilter !== 'all' && invoice.payment_status !== activeFilter) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const customerName = invoice.customer_name || 
        `${invoice.customer_first_name || ''} ${invoice.customer_last_name || ''}`.trim();
      
      return (
        invoice.invoice_number.toLowerCase().includes(query) ||
        customerName.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const statusCounts = {
    all: invoices.length,
    pending: invoices.filter(i => i.payment_status === 'pending').length,
    paid: invoices.filter(i => i.payment_status === 'paid').length,
    overdue: invoices.filter(i => i.payment_status === 'overdue').length,
    cancelled: invoices.filter(i => i.payment_status === 'cancelled').length,
  };

  const filters = [
    { id: 'all', label: 'Alle', count: statusCounts.all },
    { id: 'pending', label: 'Offen', count: statusCounts.pending },
    { id: 'paid', label: 'Bezahlt', count: statusCounts.paid },
    { id: 'overdue', label: 'Überfällig', count: statusCounts.overdue },
    { id: 'cancelled', label: 'Storniert', count: statusCounts.cancelled },
  ];

  // Removed: Using central formatCurrency from @/lib/index

  const getPaymentStatusType = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      case 'cancelled': return 'neutral';
      default: return 'neutral';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Bezahlt';
      case 'pending': return 'Offen';
      case 'overdue': return 'Überfällig';
      case 'cancelled': return 'Storniert';
      default: return 'Unbekannt';
    }
  };

  return (
    <MobileGridLayout<Invoice>
      searchPlaceholder="Suchen..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onRefresh={onRefresh}
      isLoading={isLoading}
      filters={filters}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      data={filteredInvoices}
      renderCard={(invoice) => {
        const customerName = invoice.customer_name || 
          `${invoice.customer_first_name || ''} ${invoice.customer_last_name || ''}`.trim();
        
        return (
          <Card className="cursor-pointer hover:bg-primary/5 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-base">
                    {invoice.invoice_number}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {customerName || 'Kein Kunde'}
                  </p>
                </div>
                <StatusIndicator 
                  type={getPaymentStatusType(invoice.payment_status)}
                  label={getPaymentStatusLabel(invoice.payment_status)}
                />
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-foreground">
                  {formatCurrency(invoice.total)}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(invoice.invoice_date), 'dd.MM.yyyy', { locale: de })}</span>
                </div>
                {invoice.due_date && (
                  <div className="flex items-center gap-1">
                    <span>Fällig: {format(new Date(invoice.due_date), 'dd.MM.yyyy', { locale: de })}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t">
                {onDownloadPDF && (
                  <V28Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadPDF(invoice.id);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </V28Button>
                )}
                {onSendEmail && invoice.payment_status !== 'paid' && (
                  <V28Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSendEmail(invoice.id);
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </V28Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      }}
      onItemClick={onInvoiceClick}
      entityLabel={{ singular: 'Rechnung', plural: 'Rechnungen' }}
      fabLabel="Neue Rechnung"
      onFabClick={onCreateNew}
      fabIcon={Plus}
      emptyStateProps={{
        icon: <Search className="h-16 w-16" />,
        noDataTitle: 'Keine Rechnungen',
        noDataDescription: 'Erstelle deine erste Rechnung',
        noResultsTitle: 'Keine Ergebnisse',
        noResultsDescription: 'Versuche einen anderen Suchbegriff'
      }}
    />
  );
}
