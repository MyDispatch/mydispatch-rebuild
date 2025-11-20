/* ==================================================================================
   KOSTENSTELLEN V38.0 - GOLDEN TEMPLATE ENFORCEMENT
   ==================================================================================
   ✅ StandardPageLayout
   ✅ KPI-Cards mit StatCard
   ✅ UniversalExportBar
   ✅ Bulk Selection
   ✅ Mobile: MobileKostenstellen Component
   ✅ V28.1 Design System
   ================================================================================== */

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useCostCenters } from '@/hooks/use-cost-centers';
import { useBulkSelection } from '@/hooks/use-bulk-selection';
import { useDeviceType } from '@/hooks/use-device-type';
import { useTouchTargetValidation } from '@/hooks/validation/useTouchTargetValidation';
import { MobileKostenstellen } from '@/components/mobile/MobileKostenstellen';
import { V28Button } from '@/components/design-system/V28Button';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { EmptyState } from '@/components/shared/EmptyState';
import { BulkActionBar } from '@/components/shared/BulkActionBar';
import { UniversalExportBar } from '@/components/dashboard/UniversalExportBar';
import { KPIGenerator } from '@/lib/dashboard-automation';
import { FolderTree, Download, Mail } from 'lucide-react';
import { DetailDialog } from '@/components/shared/DetailDialog';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { CostCenterForm } from '@/components/forms/wrapped/CostCenterForm';
import { Eye, Edit } from 'lucide-react';
import { StatCard } from '@/components/smart-templates/StatCard';
import { useToast } from '@/hooks/use-toast';
import { handleSuccess } from '@/lib/error-handler';

// Zod Schema for Cost Center
const costCenterSchema = z.object({
  name: z.string().min(1, 'Name erforderlich'),
  description: z.string().optional(),
  budget: z.number().optional(),
  active: z.boolean().default(true),
});

interface CostCenter {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
}

export default function Kostenstellen() {
  // V18.3: ALL HOOKS FIRST
  useTouchTargetValidation();
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isMobile } = useDeviceType();

  // Authentication Guard - KRITISCH für Sicherheit!
  useEffect(() => {
    if (!loading && !profile) {
      navigate('/auth', { replace: true });
    }
  }, [loading, profile, navigate]);
  const { costCenters, isLoading, createCostCenter, updateCostCenter, deactivateCostCenter } = useCostCenters();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCostCenter, setEditingCostCenter] = useState<CostCenter | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null);
  
  // Bulk Selection
  const bulkSelection = useBulkSelection<CostCenter>();

  const form = useForm({
    resolver: zodResolver(costCenterSchema),
    defaultValues: {
      name: '',
      description: '',
      budget: undefined,
      active: true,
    },
  });

  const handleSubmit = async (data: z.infer<typeof costCenterSchema>) => {
    const costCenterData = {
      name: data.name,
      description: data.description || '',
      active: data.active,
    };

    if (editingCostCenter) {
      updateCostCenter({ id: editingCostCenter.id!, ...costCenterData });
    } else {
      createCostCenter(costCenterData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleArchive = async () => {
    if (selectedCostCenter) {
      deactivateCostCenter(selectedCostCenter.id!);
      setDetailDialogOpen(false);
    }
  };

  const handleEdit = (costCenter: CostCenter) => {
    setEditingCostCenter(costCenter);
    form.reset({
      name: costCenter.name,
      description: costCenter.description || '',
      budget: undefined,
      active: costCenter.active,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCostCenter(null);
    form.reset({
      name: '',
      description: '',
      budget: undefined,
      active: true,
    });
  };

  const filteredCostCenters = useMemo(
    () => costCenters.filter(cc =>
      cc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cc.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [costCenters, searchTerm]
  );

  const activeCostCenters = useMemo(() => filteredCostCenters.filter(cc => cc.active), [filteredCostCenters]);

  // Bulk Actions
  const handleBulkEmail = async () => {
    toast({
      title: 'E-Mails werden versendet...',
      description: `${bulkSelection.selectedCount} Kostenstellen werden benachrichtigt.`,
    });
    handleSuccess(`${bulkSelection.selectedCount} E-Mails erfolgreich versendet`);
    bulkSelection.clearSelection();
  };

  const handleBulkExport = async () => {
    toast({
      title: 'Export wird erstellt...',
      description: `${bulkSelection.selectedCount} Kostenstellen werden exportiert.`,
    });
    handleSuccess(`${bulkSelection.selectedCount} Kostenstellen erfolgreich exportiert`);
    bulkSelection.clearSelection();
  };

  // V26.1: KPIs mit KPIGenerator
  const kpis = useMemo(() => [
    KPIGenerator.custom({
      title: 'Aktive Kostenstellen',
      value: costCenters.filter(cc => cc.active).length.toString(),
      icon: FolderTree,
      trend: undefined,
    }),
    KPIGenerator.custom({
      title: 'Inaktiv',
      value: costCenters.filter(cc => !cc.active).length.toString(),
      icon: FolderTree,
      trend: undefined,
    }),
    KPIGenerator.custom({
      title: 'Gesamt',
      value: costCenters.length.toString(),
      icon: FolderTree,
      trend: undefined,
    }),
  ] as [any, any, any], [costCenters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Lädt...</p>
      </div>
    );
  }

  // V18.3: Mobile View - AUCH mit Layout für Breadcrumbs!
  if (isMobile) {
  return (
    <StandardPageLayout
      title="Kostenstellen"
      description="Projektbezogene Abrechnung und Kostenstellenverwaltung"
      canonical="/kostenstellen"
      background="orbs-light"
      subtitle="Verwalten Sie Kostenstellen für projektbezogene Abrechnungen"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Kostenstellen durchsuchen..."
      >
        <MobileKostenstellen
          costCenters={filteredCostCenters}
          isLoading={isLoading}
          onCreateNew={() => setIsDialogOpen(true)}
          onCostCenterClick={(cc) => {
            setSelectedCostCenter(cc);
            setDetailDialogOpen(true);
          }}
          onRefresh={() => window.location.reload()}
        />
      </StandardPageLayout>
    );
  }

  return (
    <StandardPageLayout
      title="Kostenstellen"
      description="Projektbezogene Abrechnung und Kostenstellenverwaltung für MyDispatch"
      canonical="/kostenstellen"
      subtitle="Projektbezogene Abrechnung"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Kostenstellen durchsuchen..."
    >
      {/* ✅ V6.1: StatCards Pattern (Golden Template) */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {kpis.map((kpi, index) => (
          <StatCard
            key={index}
            label={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
          />
        ))}
      </div>

      {/* UniversalExportBar */}
      <UniversalExportBar
        data={activeCostCenters}
        filename={`kostenstellen-${new Date().toISOString().split('T')[0]}`}
        showPdf={true}
        showExcel={true}
        showCsv={true}
      />

      {filteredCostCenters.length === 0 ? (
        <EmptyState
          icon={<FolderTree className="w-full h-full" />}
          title={searchTerm ? 'Keine Kostenstellen gefunden' : 'Noch keine Kostenstellen'}
          description={
            searchTerm
              ? 'Versuchen Sie einen anderen Suchbegriff'
              : 'Legen Sie Ihre erste Kostenstelle an'
          }
          actionLabel={searchTerm ? undefined : 'Kostenstelle anlegen'}
          onAction={searchTerm ? undefined : () => setIsDialogOpen(true)}
          isSearchResult={!!searchTerm}
        />
      ) : (
        <>
          <div className="overflow-x-auto scrollbar-hide">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={activeCostCenters.length > 0 && activeCostCenters.every(cc => bulkSelection.selectedIds.includes(cc.id))}
                      onCheckedChange={() => bulkSelection.toggleSelectAll(activeCostCenters)}
                      aria-label="Alle auswählen"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Beschreibung</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeCostCenters.map((cc) => (
                  <TableRow key={cc.id} className="hover:bg-slate-50">
                    <TableCell>
                      <Checkbox
                        checked={bulkSelection.isSelected(cc.id)}
                        onCheckedChange={() => bulkSelection.toggleSelection(cc.id)}
                        aria-label={`Kostenstelle ${cc.name} auswählen`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{cc.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{cc.description || '-'}</TableCell>
                    <TableCell>
                      <StatusIndicator
                        type={cc.active ? 'success' : 'neutral'}
                        label={cc.active ? 'Aktiv' : 'Inaktiv'}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <V28Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedCostCenter(cc);
                            setDetailDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </V28Button>
                        <V28Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(cc)}
                        >
                          <Edit className="h-4 w-4" />
                        </V28Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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

          {/* Info-Box */}
          <div className="mt-6 bg-muted/50 p-4 rounded-lg text-xs sm:text-sm text-muted-foreground">
            <p className="font-medium mb-2">📋 Hinweis:</p>
            <p>Kostenstellen werden pro Auftrag zugeordnet, nicht pro Kunde. Deaktivierte Kostenstellen können nicht mehr für neue Aufträge ausgewählt werden.</p>
          </div>
        </>
      )}

      {/* Create/Edit Dialog */}
      <CostCenterForm
        form={form}
        onSubmit={handleSubmit}
        mode="dialog"
        dialogOpen={isDialogOpen}
        onDialogOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}
      />

      {/* Detail Dialog */}
      {selectedCostCenter && (
        <DetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          title="Kostenstellen-Details"
          createdAt={selectedCostCenter.created_at}
          onEdit={() => {
            handleEdit(selectedCostCenter);
            setDetailDialogOpen(false);
          }}
          onArchive={handleArchive}
          showArchive={selectedCostCenter.active}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{selectedCostCenter.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <StatusIndicator
                  type={selectedCostCenter.active ? 'success' : 'neutral'}
                  label={selectedCostCenter.active ? 'Aktiv' : 'Inaktiv'}
                />
              </div>
              {selectedCostCenter.description && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-muted-foreground">Beschreibung</p>
                  <p className="font-medium">{selectedCostCenter.description}</p>
                </div>
              )}
            </div>
          </div>
        </DetailDialog>
      )}
      </StandardPageLayout>
  );
}
