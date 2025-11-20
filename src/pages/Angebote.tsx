/* ==================================================================================
   ANGEBOTE V1.0 - VOLLSTÄNDIGE QUOTES/OFFERS VERWALTUNG
   ==================================================================================
   ✅ Eigene Page (kein Redirect mehr!)
   ✅ use-quotes Hook (React Query)
   ✅ StandardPageLayout mit Right Sidebar
   ✅ StatCards Pattern (Golden Template)
   ✅ V28.1 Slate Design System
   ✅ Mobile + Desktop responsive
   ✅ Auth Guard mit loading-State
   ✅ Mobile/Desktop Split
   ================================================================================== */

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useQuotes, type Quote } from '@/hooks/use-quotes';
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
import { MobileAngebote } from '@/components/mobile/MobileAngebote';
import { QuoteDialog } from '@/components/quotes/QuoteDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Angebote() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useDeviceType();
  const { sidebarExpanded } = useMainLayout();
  const { stats } = useStatistics();
  
  // ==================================================================================
  // AUTH GUARD - CRITICAL SECURITY
  // ==================================================================================
  useEffect(() => {
    if (!loading && !profile) {
      navigate('/auth', { replace: true });
    }
  }, [loading, profile, navigate]);
  
  // ✅ React Query Hook für Angebote
  const {
    quotes,
    isLoading,
    refetch,
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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Bulk-Selection
  const bulkSelection = useBulkSelection<Quote>();
  
  // ==================================================================================
  // FILTERED DATA
  // ==================================================================================
  const filteredQuotes = useMemo(
    () => quotes.filter(q => {
      // Search filter
      const matchesSearch = q.pickup_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.dropoff_address?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'pending' && (!q.offer_status || q.offer_status === 'pending')) ||
        (statusFilter === 'accepted' && q.offer_status === 'accepted') ||
        (statusFilter === 'declined' && q.offer_status === 'declined');
      
      return matchesSearch && matchesStatus;
    }),
    [quotes, searchTerm, statusFilter]
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
  // MOBILE/DESKTOP SPLIT
  // ==================================================================================
  if (isMobile) {
    return (
      <MobileAngebote
        quotes={filteredQuotes}
        isLoading={isLoading}
        onCreateNew={() => setCreateDialogOpen(true)}
        onQuoteClick={handleViewDetails}
        onRefresh={() => refetch()}
      />
    );
  }
  
  // ==================================================================================
  // RENDER: LOADING (Desktop only)
  // ==================================================================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Lädt Angebote...</p>
      </div>
    );
  }
  
  // ==================================================================================
  // RENDER: DESKTOP LAYOUT
  // ==================================================================================
  return (
    <>
      <StandardPageLayout
          title="Angebote"
          description="MyDispatch Angebotsverwaltung: Professionelle Angebotserstellung und Verwaltung für Taxi- und Mietwagenunternehmen."
          canonical="/angebote"
          subtitle="Verwaltung Ihrer Angebote"
          actions={[
            {
              label: 'Neues Angebot',
              onClick: () => setCreateDialogOpen(true),
              icon: Plus,
              variant: 'primary'
            },
            {
              label: 'Export',
              onClick: () => handleSuccess('Export wird vorbereitet...'),
              icon: Download,
              variant: 'secondary'
            }
          ]}
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
          
          {/* STATUS FILTER */}
          <div className="mb-4 flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Status:</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Alle Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="pending">Offen</SelectItem>
                <SelectItem value="accepted">Akzeptiert</SelectItem>
                <SelectItem value="declined">Abgelehnt</SelectItem>
              </SelectContent>
            </Select>
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
                      for (const id of bulkSelection.selectedIds) {
                        await archiveQuote(id);
                      }
                      bulkSelection.clearSelection();
                    }
                  },
                  variant: 'secondary'
                },
                {
                  label: 'In Auftrag umwandeln',
                  icon: CheckCircle,
                  onClick: async () => {
                    if (confirm(`${bulkSelection.selectedCount} Angebote in Aufträge umwandeln?`)) {
                      for (const id of bulkSelection.selectedIds) {
                        await convertToBooking(id);
                      }
                      bulkSelection.clearSelection();
                    }
                  },
                  variant: 'default'
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
      
      {/* CREATE/EDIT DIALOG */}
      <QuoteDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}
