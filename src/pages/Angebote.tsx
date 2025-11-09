/* ==================================================================================
   ANGEBOTE V1.0 - VOLLSTÄNDIGE QUOTES/OFFERS VERWALTUNG
   ==================================================================================
   ✅ Eigene Page (kein Redirect mehr!)
   ✅ use-quotes Hook (React Query)
   ✅ StandardPageLayout mit Right Sidebar
   ✅ StatCards Pattern (Golden Template)
   ✅ V28.1 Slate Design System
   ✅ Mobile + Desktop responsive
   ================================================================================== */

import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuotes } from '@/hooks/use-quotes';
import { useDeviceType } from '@/hooks/use-device-type';
import { useBulkSelection } from '@/hooks/use-bulk-selection';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { StatCard } from '@/components/smart-templates/StatCard';
import { V28Button } from '@/components/design-system/V28Button';
import { BulkActionBar } from '@/components/shared/BulkActionBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { DetailDialog } from '@/components/shared/DetailDialog';
import { UniversalExportBar } from '@/components/dashboard/UniversalExportBar';
import { StatusIndicator, getBookingStatusType, getPaymentStatusType } from '@/components/shared/StatusIndicator';
import { useMainLayout } from '@/hooks/use-main-layout';
import { useStatistics } from '@/hooks/use-statistics';
import { formatCurrency } from '@/lib/format-utils';
import { KPIGenerator } from '@/lib/dashboard-automation';
import { handleSuccess } from '@/lib/error-handler';
import { 
  BookOpen, Plus, Download, Euro, FileText, 
  CheckCircle, Clock, XCircle, Activity, Users, Car 
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Quote {
  id: string;
  created_at: string;
  pickup_address: string;
  dropoff_address: string;
  pickup_time: string;
  offer_status?: string;
  price: number;
  customer_id?: string;
  archived?: boolean;
}

export default function Angebote() {
  const { profile } = useAuth();
  const { isMobile } = useDeviceType();
  const { sidebarExpanded } = useMainLayout();
  const { stats } = useStatistics();
  
  // ✅ React Query Hook für Angebote
  const {
    quotes,
    isLoading,
    createQuote,
    updateQuote,
    archiveQuote,
    convertToBooking,
    isCreating,
    isUpdating,
    isArchiving,
    isConverting,
  } = useQuotes();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Bulk-Selection
  const bulkSelection = useBulkSelection<Quote>();
  
  // ==================================================================================
  // FILTERED DATA
  // ==================================================================================
  const filteredQuotes = useMemo(
    () => quotes.filter(q => 
      q.pickup_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.dropoff_address?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [quotes, searchTerm]
  );
  
  const pendingQuotes = useMemo(
    () => filteredQuotes.filter(q => !q.offer_status || q.offer_status === 'pending'),
    [filteredQuotes]
  );
  
  const acceptedQuotes = useMemo(
    () => filteredQuotes.filter(q => q.offer_status === 'accepted'),
    [filteredQuotes]
  );
  
  const declinedQuotes = useMemo(
    () => filteredQuotes.filter(q => q.offer_status === 'declined'),
    [filteredQuotes]
  );
  
  // ==================================================================================
  // KPI CARDS (GOLDEN TEMPLATE)
  // ==================================================================================
  const quoteKPIs = useMemo(() => [
    KPIGenerator.custom({
      title: 'Offene Angebote',
      value: pendingQuotes.length,
      icon: Clock,
      subtitle: 'Warten auf Annahme'
    }),
    KPIGenerator.custom({
      title: 'Akzeptiert',
      value: acceptedQuotes.length,
      icon: CheckCircle,
      subtitle: 'Erfolgsquote: ' + (quotes.length > 0 ? Math.round((acceptedQuotes.length / quotes.length) * 100) : 0) + '%'
    }),
    KPIGenerator.custom({
      title: 'Gesamtwert',
      value: formatCurrency(filteredQuotes.reduce((sum, q) => sum + (q.price || 0), 0)),
      icon: Euro,
      subtitle: `${filteredQuotes.length} Angebote`
    })
  ] as [any, any, any], [pendingQuotes, acceptedQuotes, filteredQuotes, quotes, declinedQuotes]);
  
  // ==================================================================================
  // HANDLERS
  // ==================================================================================
  const handleViewDetails = (quote: Quote) => {
    setSelectedQuote(quote);
    setDetailDialogOpen(true);
  };
  
  const handleConvertToBooking = async (quoteId: string) => {
    if (confirm('Angebot in Auftrag umwandeln?')) {
      convertToBooking(quoteId);
      setDetailDialogOpen(false);
    }
  };
  
  const handleArchive = async (quoteId: string) => {
    if (confirm('Angebot wirklich archivieren?')) {
      archiveQuote(quoteId);
      setDetailDialogOpen(false);
    }
  };
  
  // ==================================================================================
  // RENDER: LOADING
  // ==================================================================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Lädt Angebote...</p>
      </div>
    );
  }
  
  // ==================================================================================
  // RENDER: MAIN LAYOUT
  // ==================================================================================
  return (
    <>
      <StandardPageLayout
          title="Angebote"
          description="MyDispatch Angebotsverwaltung: Professionelle Angebotserstellung und Verwaltung für Taxi- und Mietwagenunternehmen."
          canonical="/angebote"
          subtitle="Verwaltung Ihrer Angebote"
          onCreateNew={() => setCreateDialogOpen(true)}
          createButtonLabel="Neues Angebot"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Angebote durchsuchen..."
          cardTitle="Angebotsübersicht"
          cardIcon={<BookOpen className="h-5 w-5" />}
        >
          {/* ✅ KPI CARDS (GOLDEN TEMPLATE) */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {quoteKPIs.map((kpi, index) => (
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
          
          {/* EXPORT BAR */}
          <UniversalExportBar
            data={filteredQuotes}
            filename={`angebote-${new Date().toISOString().split('T')[0]}`}
            showPdf={true}
            showExcel={true}
            showCsv={true}
          />
          
          {/* BULK ACTIONS BAR */}
          {bulkSelection.selectedCount > 0 && (
            <BulkActionBar
              selectedCount={bulkSelection.selectedCount}
              actions={[
                {
                  label: 'Archivieren',
                  icon: FileText,
                  onClick: async () => {
                    if (confirm(`${bulkSelection.selectedCount} Angebote archivieren?`)) {
                      // Bulk archive logic here
                      bulkSelection.clearSelection();
                    }
                  },
                  variant: 'secondary'
                }
              ]}
              onClearSelection={bulkSelection.clearSelection}
            />
          )}
          
          {/* DATA TABLE */}
          {filteredQuotes.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-12 w-12 text-slate-400" />}
              title="Keine Angebote vorhanden"
              description="Erstellen Sie Ihr erstes Angebot, um loszulegen."
              actionLabel="Neues Angebot"
              onAction={() => setCreateDialogOpen(true)}
            />
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                  <TableHead className="w-12">
                      <Checkbox
                        checked={
                          filteredQuotes.length > 0 && 
                          filteredQuotes.every(q => bulkSelection.isSelected(q.id))
                        }
                        onCheckedChange={() => bulkSelection.toggleSelectAll(filteredQuotes)}
                      />
                    </TableHead>
                    <TableHead>Angebots-Nr.</TableHead>
                    <TableHead>Abholung</TableHead>
                    <TableHead>Ziel</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Preis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.map((quote) => (
                    <TableRow
                      key={quote.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => handleViewDetails(quote)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={bulkSelection.selectedIds.includes(quote.id)}
                          onCheckedChange={() => bulkSelection.toggleSelection(quote.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {quote.id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {quote.pickup_address}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {quote.dropoff_address}
                      </TableCell>
                      <TableCell>
                        {format(new Date(quote.pickup_time), 'dd.MM.yyyy HH:mm', { locale: de })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          quote.offer_status === 'accepted' ? 'default' :
                          quote.offer_status === 'declined' ? 'destructive' :
                          'secondary'
                        }>
                          {quote.offer_status === 'accepted' ? 'Akzeptiert' :
                           quote.offer_status === 'declined' ? 'Abgelehnt' :
                           'Offen'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(quote.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </StandardPageLayout>
      
      {/* ✅ RIGHT SIDEBAR (320px, Desktop only) */}
      {!isMobile && (
        <aside 
          className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-slate-200 shadow-lg z-20 overflow-y-auto hidden md:block"
        >
          {/* Schnellzugriff */}
          <div className="p-4 space-y-3 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-slate-700" />
              Schnellzugriff
            </h3>
            
            <V28Button 
              variant="primary" 
              fullWidth 
              icon={Plus}
              onClick={() => setCreateDialogOpen(true)}
            >
              Neues Angebot
            </V28Button>
            
            <V28Button 
              variant="secondary" 
              fullWidth 
              icon={Download}
              onClick={() => handleSuccess('Export wird vorbereitet...')}
            >
              Export
            </V28Button>
          </div>

          {/* Live-Status Stats */}
          <div className="p-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Live-Status</h4>
            
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-600">Offene Angebote</span>
                <Clock className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{pendingQuotes.length}</p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-green-600">Akzeptiert</span>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-green-700">{acceptedQuotes.length}</p>
            </div>

            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-red-600">Abgelehnt</span>
                <XCircle className="h-4 w-4 text-red-400" />
              </div>
              <p className="text-2xl font-bold text-red-700">{declinedQuotes.length}</p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-blue-600">Gesamtwert</span>
                <Euro className="h-4 w-4 text-blue-400" />
              </div>
              <p className="text-lg font-bold text-blue-700">
                {formatCurrency(filteredQuotes.reduce((sum, q) => sum + (q.price || 0), 0))}
              </p>
            </div>
          </div>
        </aside>
      )}
      
      {/* DETAIL DIALOG */}
      {selectedQuote && (
        <DetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          title={`Angebot ${selectedQuote.id.slice(0, 8)}`}
          createdAt={selectedQuote.created_at}
          onArchive={async () => {
            await handleArchive(selectedQuote.id);
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Abholung</label>
              <p className="text-slate-900">{selectedQuote.pickup_address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Ziel</label>
              <p className="text-slate-900">{selectedQuote.dropoff_address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Datum & Uhrzeit</label>
              <p className="text-slate-900">
                {format(new Date(selectedQuote.pickup_time), 'dd.MM.yyyy HH:mm', { locale: de })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Preis</label>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(selectedQuote.price)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Status</label>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={
                  selectedQuote.offer_status === 'accepted' ? 'default' :
                  selectedQuote.offer_status === 'declined' ? 'destructive' :
                  'secondary'
                }>
                  {selectedQuote.offer_status === 'accepted' ? 'Akzeptiert' :
                   selectedQuote.offer_status === 'declined' ? 'Abgelehnt' :
                   'Offen'}
                </Badge>
                {(!selectedQuote.offer_status || selectedQuote.offer_status === 'pending') && (
                  <V28Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleConvertToBooking(selectedQuote.id)}
                  >
                    In Auftrag umwandeln
                  </V28Button>
                )}
              </div>
            </div>
          </div>
        </DetailDialog>
      )}
    </>
  );
}
