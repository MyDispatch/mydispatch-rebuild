/* ==================================================================================
   UNIVERSAL DASHBOARD TEMPLATE V33.0 - ULTIMATE DASHBOARD STRUCTURE
   ==================================================================================
   ✅ Kombiniert ALLE Standard-Features
   ✅ KPIs & Quick Actions (PageHeaderWithKPIs)
   ✅ Filter & Suche (UniversalFilterBar)
   ✅ Export-Buttons (UniversalExportBar)
   ✅ Section Content (DashboardSection)
   ✅ Pagination (UniversalPagination)
   ✅ Bulk Actions (BulkActionBar)
   ✅ 100% V28.1 Design System konform
   ================================================================================== */

import { ReactNode } from 'react';
import { SEOHead } from '@/components/shared/SEOHead';
import { DashboardBreadcrumb } from '@/components/layout/DashboardBreadcrumb';
import { PageHeaderWithKPIs, type KPICardData, type QuickAction } from '@/components/shared/PageHeaderWithKPIs';
import { UniversalFilterBar, type FilterConfig } from './UniversalFilterBar';
import { UniversalExportBar } from './UniversalExportBar';
import { DashboardSection } from '@/components/shared/DashboardSection';
import { UniversalPagination } from './UniversalPagination';
import { BulkActionBar, type BulkAction } from '@/components/shared/BulkActionBar';
import { LucideIcon } from 'lucide-react';

interface UniversalDashboardTemplateProps {
  // SEO & Layout
  pageTitle: string;
  pageDescription: string;
  
  // KPIs & Quick Actions (immer vorhanden)
  kpis: [KPICardData, KPICardData, KPICardData];
  quickActions: [QuickAction, QuickAction];
  
  // Filter & Search (immer vorhanden)
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  showArchived: boolean;
  onArchivedChange: (value: boolean) => void;
  filters?: FilterConfig[];
  onFilterChange?: (filterId: string, value: any) => void;
  
  // Export (optional)
  exportConfig?: {
    data: unknown[];
    filename: string; // ohne Extension
  };
  
  // Pagination (optional)
  paginationConfig?: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (count: number) => void;
  };
  
  // Bulk Actions (optional)
  bulkActions?: BulkAction[];
  selectedCount?: number;
  onClearSelection?: () => void;
  
  // Section Content (immer vorhanden)
  sectionIcon: LucideIcon;
  sectionTitle: string;
  sectionBadge?: string | number;
  children: ReactNode;
  
  // Dashboard-spezifische Zusätze (optional)
  additionalHeader?: ReactNode; // z.B. Tab-Navigation
  additionalSidebar?: ReactNode; // z.B. Quick Actions Panel rechts
}

export function UniversalDashboardTemplate({
  pageTitle,
  pageDescription,
  kpis,
  quickActions,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  showArchived,
  onArchivedChange,
  filters,
  onFilterChange,
  exportConfig,
  paginationConfig,
  bulkActions,
  selectedCount = 0,
  onClearSelection,
  sectionIcon,
  sectionTitle,
  sectionBadge,
  children,
  additionalHeader,
  additionalSidebar
}: UniversalDashboardTemplateProps) {
  return (
    <>
      <SEOHead title={pageTitle} description={pageDescription} />
      
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <DashboardBreadcrumb />
        
        {/* Additional Header (z.B. Tab-Navigation) */}
        {additionalHeader}
        
        {/* KPIs & Quick Actions */}
        <PageHeaderWithKPIs
          kpis={kpis}
          quickActions={quickActions}
        />
        
        {/* Filter & Search */}
        <UniversalFilterBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          showArchived={showArchived}
          onArchivedChange={onArchivedChange}
          filters={filters}
          onFilterChange={onFilterChange}
        />
        
        {/* Export Bar (optional) */}
        {exportConfig && (
          <UniversalExportBar
            data={exportConfig.data}
            filename={exportConfig.filename}
          />
        )}
        
        {/* Dashboard Section Content */}
        <DashboardSection
          icon={sectionIcon}
          title={sectionTitle}
          badge={sectionBadge}
        >
          {children}
        </DashboardSection>
        
        {/* Pagination (optional) */}
        {paginationConfig && (
          <UniversalPagination
            currentPage={paginationConfig.currentPage}
            totalPages={paginationConfig.totalPages}
            itemsPerPage={paginationConfig.itemsPerPage}
            totalItems={paginationConfig.totalItems}
            onPageChange={paginationConfig.onPageChange}
            onItemsPerPageChange={paginationConfig.onItemsPerPageChange}
          />
        )}
      </div>
      
      {/* Bulk Action Bar (sticky bottom, falls Auswahl aktiv) */}
      {bulkActions && selectedCount > 0 && (
        <BulkActionBar
          selectedCount={selectedCount}
          onClearSelection={onClearSelection!}
          actions={bulkActions}
        />
      )}
      
      {/* Additional Sidebar (z.B. Quick Actions Panel rechts) */}
      {additionalSidebar}
    </>
  );
}
