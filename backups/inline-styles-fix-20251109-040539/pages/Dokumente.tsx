/* ==================================================================================
   DOKUMENTE - V35.0 BATCH 1 MIGRATION
   ==================================================================================
   ✅ Migriert auf StandardPageLayout (wie Rechnungen.tsx)
   ✅ Fixed Right Sidebar (320px)
   ✅ Realtime Updates (useRealtimeDocuments)
   ✅ Export-Funktionalität
   ✅ Mobile-optimiert
   ================================================================================== */

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useDocuments } from '@/hooks/use-documents';
import { useRealtimeDocuments } from '@/hooks/use-realtime-documents';
import { useDeviceType } from '@/hooks/use-device-type';
import { useTouchTargetValidation } from '@/hooks/validation/useTouchTargetValidation';
import { useMainLayout } from '@/hooks/use-main-layout';
import { MobileDokumente } from '@/components/mobile/MobileDokumente';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/shared/SEOHead';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { UniversalExportBar } from '@/components/dashboard/UniversalExportBar';
import { StatCard } from '@/components/smart-templates/StatCard';
import { V28Button } from '@/components/design-system/V28Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/EmptyState';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { useToast } from '@/hooks/use-toast';
import { Plus, FileText, Download, Eye, AlertTriangle, CheckCircle, Clock, FolderOpen } from 'lucide-react';
import { format } from 'date-fns';
import { DocumentUploadForm } from '@/components/forms/DocumentUploadForm';
import { DetailDialog } from '@/components/shared/DetailDialog';
import { handleError, handleSuccess } from '@/lib/error-handler';

interface Document {
  id: string;
  entity_type: string;
  entity_id: string;
  document_type: string;
  name: string;
  file_url: string;
  expiry_date: string | null;
  reminder_sent: boolean;
  tags: string[] | null;
  created_at: string;
}

export default function Dokumente() {
  useTouchTargetValidation();
  const { profile } = useAuth();
  const { toast } = useToast();
  const { isMobile } = useDeviceType();
  const { sidebarExpanded } = useMainLayout();
  const { documents, isLoading: loading, deleteDocument } = useDocuments();
  useRealtimeDocuments(); // V35.0: Realtime Updates
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [entities, setEntities] = useState({ drivers: [], vehicles: [], customers: [] });
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    if (profile?.company_id) {
      fetchEntities();
    }
  }, [profile?.company_id]);

  const fetchEntities = async () => {
    try {
      const [driversRes, vehiclesRes, customersRes] = await Promise.all([
        supabase
          .from('drivers')
          .select('id, first_name, last_name')
          .eq('company_id', profile?.company_id)
          .eq('archived', false),
        supabase
          .from('vehicles')
          .select('id, license_plate')
          .eq('company_id', profile?.company_id)
          .eq('archived', false),
        supabase
          .from('customers')
          .select('id, first_name, last_name')
          .eq('company_id', profile?.company_id)
          .eq('archived', false),
      ]);

      setEntities({
        drivers: driversRes.data || [],
        vehicles: vehiclesRes.data || [],
        customers: customersRes.data || [],
      });
    } catch (error) {
      handleError(error, 'Entitäten konnten nicht geladen werden', { showToast: false });
    }
  };

  const handleDelete = async (doc: Document) => {
    if (!doc?.id) {
      toast({
        title: 'Fehler',
        description: 'Dokument-ID fehlt',
        variant: 'destructive',
      });
      return;
    }

    try {
      await deleteDocument(doc.id);
      setDetailDialogOpen(false);
    } catch (error) {
      handleError(error, 'Dokument konnte nicht gelöscht werden');
    }
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc =>
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [documents, searchTerm]);

  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return 'neutral';
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return 'error';
    if (daysUntilExpiry <= 30) return 'warning';
    return 'success';
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd.MM.yyyy');
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      fuehrerschein: 'Führerschein',
      p_schein: 'P-Schein',
      fahrzeugschein: 'Fahrzeugschein',
      tuev: 'TÜV',
      versicherung: 'Versicherung',
      sonstiges: 'Sonstiges',
    };
    return labels[type] || type;
  };

  const getEntityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      driver: 'Fahrer',
      vehicle: 'Fahrzeug',
      customer: 'Kunde',
    };
    return labels[type] || type;
  };

  const kpis: [any, any, any] = useMemo(() => {
    const expired = documents.filter(doc => getExpiryStatus(doc.expiry_date) === 'error').length;
    const expiringSoon = documents.filter(doc => getExpiryStatus(doc.expiry_date) === 'warning').length;
    const total = documents.length;

    return [
      {
        title: 'Abgelaufen',
        value: expired,
        icon: AlertTriangle,
        trend: undefined,
        subtitle: 'Dokumente',
      },
      {
        title: 'Läuft bald ab',
        value: expiringSoon,
        icon: Clock,
        trend: undefined,
        subtitle: 'Dokumente',
      },
      {
        title: 'Gesamt',
        value: total,
        icon: FolderOpen,
        trend: undefined,
        subtitle: 'Dokumente',
      },
    ];
  }, [documents]);

  if (loading) {
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
          title="Dokumente - MyDispatch"
          description="Dokumentenverwaltung und Ablaufüberwachung"
          canonical="/dokumente"
        />
        <MobileDokumente
          documents={documents}
          isLoading={loading}
          onCreateNew={() => setIsDialogOpen(true)}
          onDocumentClick={(doc) => {
            setSelectedDocument(doc as Document);
            setDetailDialogOpen(true);
          }}
          onRefresh={() => window.location.reload()}
        />
      </>
    );
  }

  return (
    <>
      <StandardPageLayout
        title="Dokumente"
        description="Dokumentenverwaltung und Ablaufüberwachung für Taxi- und Mietwagenunternehmen."
        canonical="/dokumente"
        subtitle="Dokumentenverwaltung und Ablaufüberwachung"
        onCreateNew={() => setIsDialogOpen(true)}
        createButtonLabel="Dokument hochladen"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Dokumente durchsuchen..."
        cardTitle="Dokument-Übersicht"
        cardIcon={<FileText className="h-5 w-5" />}
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
          data={filteredDocuments}
          filename={`dokumente-${new Date().toISOString().split('T')[0]}`}
          showPdf={true}
          showExcel={true}
          showCsv={true}
        />

        {filteredDocuments.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-full h-full" />}
            title={searchTerm ? 'Keine Dokumente gefunden' : 'Noch keine Dokumente'}
            description={
              searchTerm
                ? 'Versuchen Sie einen anderen Suchbegriff'
                : 'Laden Sie Ihr erstes Dokument hoch'
            }
            actionLabel={searchTerm ? undefined : 'Dokument hochladen'}
            onAction={searchTerm ? undefined : () => setIsDialogOpen(true)}
            isSearchResult={!!searchTerm}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Typ</TableHead>
                <TableHead className="hidden md:table-cell">Entität</TableHead>
                <TableHead className="hidden lg:table-cell">Ablaufdatum</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocument(doc);
                    setDetailDialogOpen(true);
                  }}
                  className="cursor-pointer hover:bg-slate-50"
                >
                  <TableCell>{doc.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {getDocumentTypeLabel(doc.document_type)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getEntityTypeLabel(doc.entity_type)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {doc.expiry_date ? formatDate(doc.expiry_date) : '-'}
                  </TableCell>
                  <TableCell>
                    <StatusIndicator
                      type={getExpiryStatus(doc.expiry_date)}
                      label={
                        doc.expiry_date
                          ? getExpiryStatus(doc.expiry_date) === 'error'
                            ? 'Abgelaufen'
                            : getExpiryStatus(doc.expiry_date) === 'warning'
                            ? 'Läuft bald ab'
                            : 'Gültig'
                          : 'Kein Ablaufdatum'
                      }
                      size="sm"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <V28Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDocument(doc);
                        setDetailDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </V28Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Upload Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Neues Dokument</DialogTitle>
              <DialogDescription>
                Laden Sie ein Dokument hoch und erfassen Sie die Details
              </DialogDescription>
            </DialogHeader>
            <DocumentUploadForm
              onSuccess={() => {
                setIsDialogOpen(false);
              }}
              onCancel={() => setIsDialogOpen(false)}
              entities={entities}
            />
          </DialogContent>
        </Dialog>

        {/* Detail Dialog */}
        {selectedDocument && (
          <DetailDialog
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
            title={`Dokument: ${selectedDocument.name}`}
            onDelete={() => handleDelete(selectedDocument)}
            showDelete={true}
            showArchive={false}
            createdAt={selectedDocument.created_at}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <p className="font-medium">{selectedDocument.name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Dokumenttyp:</span>
                  <p className="font-medium">{getDocumentTypeLabel(selectedDocument.document_type)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Entität:</span>
                  <p className="font-medium">{getEntityTypeLabel(selectedDocument.entity_type)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Ablaufdatum:</span>
                  <p className="font-medium">
                    {selectedDocument.expiry_date ? formatDate(selectedDocument.expiry_date) : 'Kein Ablaufdatum'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <div className="mt-1">
                    <StatusIndicator
                      type={getExpiryStatus(selectedDocument.expiry_date)}
                      label={
                        selectedDocument.expiry_date
                          ? getExpiryStatus(selectedDocument.expiry_date) === 'error'
                            ? 'Abgelaufen'
                            : getExpiryStatus(selectedDocument.expiry_date) === 'warning'
                            ? 'Läuft bald ab'
                            : 'Gültig'
                          : 'Kein Ablaufdatum'
                      }
                      size="sm"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Tags:</span>
                  <p className="font-medium">
                    {selectedDocument.tags && selectedDocument.tags.length > 0 
                      ? selectedDocument.tags.join(', ') 
                      : '-'}
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <V28Button
                  onClick={() => window.open(selectedDocument.file_url, '_blank')}
                  className="w-full"
                  variant="primary"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Dokument herunterladen
                </V28Button>
              </div>
            </div>
          </DetailDialog>
        )}
      </StandardPageLayout>

      {/* V35.0: Fixed Right Sidebar (Desktop only) */}
      {!isMobile && (
        <aside 
          className="fixed right-0 top-16 bottom-0 bg-white border-l border-slate-200 shadow-lg z-20 overflow-y-auto hidden md:block transition-all duration-300"
          style={{
            width: '320px',
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
              onClick={() => setIsDialogOpen(true)}
            >
              Dokument hochladen
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
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Live-Status</h4>
            
            <div className="space-y-2">
              {/* Abgelaufene Dokumente */}
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-red-600">Abgelaufen</span>
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </div>
                <p className="text-2xl font-bold text-red-700">{kpis[0].value}</p>
                <p className="text-xs text-red-500 mt-1">Dokumente</p>
              </div>
              
              {/* Läuft bald ab */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-amber-600">Läuft bald ab</span>
                  <Clock className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-amber-700">{kpis[1].value}</p>
                <p className="text-xs text-amber-500 mt-1">Dokumente</p>
              </div>
              
              {/* Gesamt Dokumente */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-600">Gesamt</span>
                  <FolderOpen className="h-4 w-4 text-slate-400" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{kpis[2].value}</p>
                <p className="text-xs text-slate-500 mt-1">Dokumente</p>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
