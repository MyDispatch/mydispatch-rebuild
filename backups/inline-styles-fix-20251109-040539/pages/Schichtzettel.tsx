/* ==================================================================================
   SCHICHTZETTEL - V35.0 BATCH 1 MIGRATION
   ==================================================================================
   ✅ Migriert auf StandardPageLayout (wie Rechnungen.tsx)
   ✅ Fixed Right Sidebar (320px)
   ✅ Realtime Updates (useRealtimeShifts)
   ✅ Export-Funktionalität
   ✅ Mobile-optimiert
   ================================================================================== */

import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth.tsx';
import { useShifts } from '@/hooks/use-shifts.tsx';
import { useRealtimeShifts } from '@/hooks/use-realtime-shifts';
import { useDeviceType } from '@/hooks/use-device-type.tsx';
import { useTouchTargetValidation } from '@/hooks/validation/useTouchTargetValidation';
import { MobileSchichtzettel } from '@/components/mobile/MobileSchichtzettel';
import { useMainLayout } from '@/hooks/use-main-layout';
import { SEOHead } from '@/components/shared/SEOHead';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { UniversalExportBar } from '@/components/dashboard/UniversalExportBar';
import { StatCard } from '@/components/smart-templates/StatCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/EmptyState';
import { V28Button } from '@/components/design-system/V28Button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { DetailDialog } from '@/components/shared/DetailDialog';
import { ShiftForm } from '@/components/forms/ShiftForm';
import { formatCurrency, formatTime } from '@/lib/index';
import { useToast } from '@/hooks/use-toast';
import { Plus, Calendar, Check, Download, CheckCircle, Clock, FolderOpen, Eye, FileCheck } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { handleError, handleSuccess, handleInfo } from '@/lib/error-handler';

interface Shift {
  id: string;
  driver_id: string;
  vehicle_id: string;
  date: string;
  shift_start_time: string;
  shift_end_time: string | null;
  pause_start_time: string | null;
  pause_end_time: string | null;
  km_start: number | null;
  km_end: number | null;
  total_km: number | null;
  cash_earnings: number;
  card_earnings: number;
  invoice_earnings: number;
  approved_by_company: boolean;
  confirmed_by_driver: boolean;
  locked_by_driver?: boolean;
  locked_at?: string | null;
  license_plate: string | null;
  concession_number: string | null;
  created_at: string;
}

export default function Schichtzettel() {
  useTouchTargetValidation();
  const { profile } = useAuth();
  const { toast } = useToast();
  const { isMobile } = useDeviceType();
  const { shifts, isLoading, updateShift, archiveShift, isArchiving } = useShifts();
  useRealtimeShifts(); // V35.0: Realtime Updates
  const { sidebarExpanded } = useMainLayout();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  
  if (!profile?.company_id && !isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-destructive">Fehler: Company-ID fehlt. Bitte melden Sie sich erneut an.</p>
      </div>
    );
  }

  const handleApprove = async (shift: Shift) => {
    if (!shift?.id || !profile?.company_id) {
      handleError(new Error('Invalid data'), 'Schicht-ID oder Company-ID fehlt');
      return;
    }

    try {
      await updateShift({
        id: shift.id,
        approved_by_company: true,
        driver_id: shift.driver_id,
        vehicle_id: shift.vehicle_id,
        date: shift.date,
        shift_start_time: shift.shift_start_time,
      });
    } catch (error) {
      handleError(error, 'Genehmigung fehlgeschlagen');
    }
  };

  const handleArchive = async () => {
    if (!selectedShift?.id) {
      handleError(new Error('No shift selected'), 'Keine Schicht ausgewählt');
      return;
    }
    
    try {
      await archiveShift(selectedShift.id);
      setDetailDialogOpen(false);
      setSelectedShift(null);
    } catch (error) {
      handleError(error, 'Archivierung fehlgeschlagen');
    }
  };

  const handleExportPDF = async (shiftId: string | undefined) => {
    if (!shiftId || typeof shiftId !== 'string' || shiftId.trim() === '') {
      handleError(new Error('Invalid shift ID'), 'Schicht-ID ist ungültig');
      return;
    }

    try {
      handleInfo('Export wird erstellt...', 'Export');

      const { data, error } = await supabase.functions.invoke('export-shift-pdf', {
        body: { shiftId: shiftId.trim() }
      });

      if (error) throw error;

      if (data?.pdfUrl && typeof data.pdfUrl === 'string') {
        window.open(data.pdfUrl, '_blank');
        handleSuccess('PDF wurde erfolgreich erstellt');
      } else {
        throw new Error('PDF-URL fehlt in Response');
      }
    } catch (error) {
      handleError(error, 'PDF-Export fehlgeschlagen');
    }
  };

  const filteredShifts = useMemo(() => {
    if (!Array.isArray(shifts)) return [];
    if (!searchTerm || searchTerm.trim() === '') return shifts;
    
    const normalizedSearch = searchTerm.toLowerCase().trim();
    return shifts.filter(shift => 
      shift?.license_plate?.toLowerCase().includes(normalizedSearch) ||
      shift?.concession_number?.toLowerCase().includes(normalizedSearch)
    );
  }, [shifts, searchTerm]);

  const kpis: [any, any, any] = useMemo(() => {
    const safeShifts = Array.isArray(shifts) ? shifts : [];
    const approved = safeShifts.filter(s => s?.approved_by_company && s?.confirmed_by_driver).length;
    const pending = safeShifts.filter(s => !s?.approved_by_company || !s?.confirmed_by_driver).length;
    const total = safeShifts.length;

    return [
      {
        title: 'Abgeschlossen',
        value: approved,
        icon: CheckCircle,
        trend: undefined,
        subtitle: 'Schichten',
      },
      {
        title: 'Offen',
        value: pending,
        icon: Clock,
        trend: undefined,
        subtitle: 'Schichten',
      },
      {
        title: 'Gesamt',
        value: total,
        icon: FolderOpen,
        trend: undefined,
        subtitle: 'Schichten',
      },
    ];
  }, [shifts]);

  const getShiftStatus = (shift: Shift) => {
    if (shift.approved_by_company && shift.confirmed_by_driver) {
      return { type: 'success' as const, label: 'Abgeschlossen' };
    }
    if (shift.approved_by_company && !shift.confirmed_by_driver) {
      return { type: 'warning' as const, label: 'Warte auf Fahrer' };
    }
    if (!shift.approved_by_company && shift.confirmed_by_driver) {
      return { type: 'warning' as const, label: 'Warte auf Genehmigung' };
    }
    return { type: 'pending' as const, label: 'Offen' };
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd.MM.yyyy');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Lädt...</p>
      </div>
    );
  }

  // Mobile View
  if (isMobile) {
    return (
      <>
        <SEOHead 
          title="Schichtzettel - MyDispatch"
          description="PBefG-konforme Schichterfassung und Stundenzettel"
          canonical="/schichtzettel"
        />
        <MobileSchichtzettel
          shifts={shifts}
          isLoading={isLoading}
          onCreateNew={() => setIsDialogOpen(true)}
          onShiftClick={(shift) => {
            setSelectedShift(shift as Shift);
            setDetailDialogOpen(true);
          }}
          onRefresh={() => window.location.reload()}
          onApprove={(shiftId) => {
            const shift = shifts.find(s => s.id === shiftId);
            if (shift) handleApprove(shift);
          }}
          onExportPDF={handleExportPDF}
        />
      </>
    );
  }

  return (
    <>
      <StandardPageLayout
        title="Schichtzettel"
        description="PBefG-konforme Schichterfassung und Stundenzettel für Taxi- und Mietwagenunternehmen."
        canonical="/schichtzettel"
        subtitle="PBefG-konforme Schichterfassung und Stundenzettel"
        onCreateNew={() => setIsDialogOpen(true)}
        createButtonLabel="Schicht erfassen"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Schichten durchsuchen..."
        cardTitle="Schicht-Übersicht"
        cardIcon={<Calendar className="h-5 w-5" />}
      >
        {/* KPI-Cards */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {kpis.map((kpi, index) => (
            <StatCard
              key={index}
              label={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              change={kpi.trend ? { value: kpi.trend.value, trend: kpi.trend.value >= 0 ? 'up' : 'down' } : undefined}
            />
          ))}
        </div>

        {/* Export Bar */}
        <UniversalExportBar
          data={filteredShifts}
          filename={`schichtzettel-${new Date().toISOString().split('T')[0]}`}
          showPdf={true}
          showExcel={true}
          showCsv={true}
        />

        {filteredShifts.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-full h-full" />}
            title={searchTerm ? 'Keine Schichten gefunden' : 'Noch keine Schichten'}
            description={
              searchTerm
                ? 'Versuchen Sie einen anderen Suchbegriff'
                : 'Erfassen Sie Ihre erste Schicht'
            }
            actionLabel={searchTerm ? undefined : 'Schicht erfassen'}
            onAction={searchTerm ? undefined : () => setIsDialogOpen(true)}
            isSearchResult={!!searchTerm}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead className="hidden sm:table-cell">Kennzeichen</TableHead>
                <TableHead className="hidden md:table-cell">Schichtzeit</TableHead>
                <TableHead className="hidden lg:table-cell">Km</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShifts.map((shift) => {
                const status = getShiftStatus(shift);
                const canApprove = !shift.approved_by_company;
                const canExport = shift.approved_by_company && shift.confirmed_by_driver;
                
                return (
                  <TableRow
                    key={shift.id}
                    onClick={() => {
                      setSelectedShift(shift);
                      setDetailDialogOpen(true);
                    }}
                    className="cursor-pointer hover:bg-muted"
                  >
                    <TableCell className="font-medium">
                      {formatDate(shift.date)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {shift.license_plate || '-'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatTime(shift.shift_start_time)} - {formatTime(shift.shift_end_time)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {shift.total_km ? `${shift.total_km} km` : '-'}
                    </TableCell>
                    <TableCell>
                      <StatusIndicator
                        type={status.type}
                        label={status.label}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <V28Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedShift(shift);
                            setDetailDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </V28Button>
                        {canExport && (
                          <V28Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExportPDF(shift.id);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </V28Button>
                        )}
                        {canApprove && (
                          <V28Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(shift);
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </V28Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Create Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Neue Schicht</DialogTitle>
              <DialogDescription>
                Erfassen Sie die Schichtdaten gemäß PBefG-Anforderungen
              </DialogDescription>
            </DialogHeader>
            <ShiftForm 
              onSuccess={() => {
                setIsDialogOpen(false);
              }}
              onCancel={() => {
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Detail Dialog */}
        {selectedShift && (
          <DetailDialog
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            title="Schicht-Details"
            createdAt={selectedShift.created_at}
            onArchive={handleArchive}
            showArchive={!selectedShift.approved_by_company || !selectedShift.confirmed_by_driver}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Datum</p>
                  <p className="font-medium">{formatDate(selectedShift.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusIndicator
                    type={getShiftStatus(selectedShift).type}
                    label={getShiftStatus(selectedShift).label}
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kennzeichen</p>
                  <p className="font-medium">{selectedShift.license_plate || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Konzessionsnummer</p>
                  <p className="font-medium">{selectedShift.concession_number || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Schichtbeginn</p>
                  <p className="font-medium">{formatTime(selectedShift.shift_start_time)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Schichtende</p>
                  <p className="font-medium">{formatTime(selectedShift.shift_end_time)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gesamt-Km</p>
                  <p className="font-medium">{selectedShift.total_km ? `${selectedShift.total_km} km` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Einnahmen</p>
                  <p className="font-medium">
                    {formatCurrency((selectedShift.cash_earnings || 0) + (selectedShift.card_earnings || 0) + (selectedShift.invoice_earnings || 0))}
                  </p>
                </div>
              </div>
            </div>
          </DetailDialog>
          )}
      </StandardPageLayout>

      {/* V35.0: Fixed Right Sidebar (Desktop only) */}
      {!isMobile && (
        <aside 
          className="fixed right-0 top-16 bottom-0 bg-white border-l border-border shadow-lg z-20 overflow-y-auto hidden md:block transition-all duration-300"
          style={{
            width: '320px',
          }}
        >
          {/* Schnellzugriff Actions */}
          <div className="p-4 space-y-3 border-b border-border">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-slate-700" />
              Schnellzugriff
            </h3>
            
            <V28Button
              variant="primary"
              fullWidth
              icon={Plus}
              iconPosition="left"
              onClick={() => setIsDialogOpen(true)}
            >
              Schicht erfassen
            </V28Button>

            <V28Button
              variant="secondary"
              fullWidth
              icon={Download}
              iconPosition="left"
              onClick={() => toast({ title: 'Export', description: 'Export wird vorbereitet...' })}
            >
              Export
            </V28Button>
          </div>

          {/* Live-Status Stats */}
          <div className="p-4 space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Live-Status</h4>
            
            <div className="space-y-2">
              {/* Abgeschlossene Schichten */}
              <div className="p-3 bg-status-success/10 rounded-lg border border-status-success/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-status-success">Abgeschlossen</span>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-status-success">{kpis[0].value}</p>
                <p className="text-xs text-green-500 mt-1">Schichten</p>
              </div>
              
              {/* Offene Schichten */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-amber-600">Offen</span>
                  <Clock className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-amber-700">{kpis[1].value}</p>
                <p className="text-xs text-amber-500 mt-1">Schichten</p>
              </div>
              
              {/* Gesamt Schichten */}
              <div className="p-3 bg-muted rounded-lg border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">Gesamt</span>
                  <FolderOpen className="h-4 w-4 text-slate-400" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{kpis[2].value}</p>
                <p className="text-xs text-muted-foreground mt-1">Schichten</p>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
