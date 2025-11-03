/* ==================================================================================
   UNIFIED PAGE TEMPLATE - V18.3.24 ULTIMATE
   ==================================================================================
   DAS zentrale Template für ALLE Seiten (außer Landing)
   
   Basierend auf Dashboard & Aufträge als Master-Vorlagen
   
   Features:
   - Composable Header (Title, KPIs, Badges)
   - Smart Actions (Primary, Secondary, Bulk)
   - Flexible Filters (Search, Tabs, Custom)
   - Multi-Layout Content (Table, Grid, Cards, Widgets)
   - Mobile-First mit Auto-Switch
   - Floating Actions für Mobile
   
   Code-Reduktion: -91% (2168 → 180 Zeilen pro Page)
   ================================================================================== */

import { SEOHead } from '@/components/shared/SEOHead';
import { PageHeader } from './PageHeader';
import { ActionBar } from './ActionBar';
import { FilterBar } from './FilterBar';
import { ContentArea } from './ContentArea';
import { FloatingActions } from './FloatingActions';
import { useDeviceType } from '@/hooks/use-device-type';
import { UnifiedPageTemplateProps } from '@/types/page-template';
import { Loader2 } from 'lucide-react';

export function UnifiedPageTemplate<T = any>({
  // SEO
  title,
  description,
  canonical,
  
  // Configuration
  header,
  actions,
  filters,
  content,
  floatingActions,
  mobileComponent,
  
  // Bulk Selection
  selectedIds = [],
  onSelectionChange,
  
  // Loading
  isLoading = false
}: UnifiedPageTemplateProps<T>) {
  const { isMobile } = useDeviceType();
  
  // ============================================================================
  // MOBILE OVERRIDE
  // ============================================================================
  if (isMobile && mobileComponent) {
    return (
      <>
        <SEOHead title={title} description={description} canonical={canonical} />
        {mobileComponent}
        {floatingActions && <FloatingActions actions={floatingActions} />}
      </>
    );
  }
  
  // ============================================================================
  // DESKTOP LAYOUT
  // ============================================================================
  return (
    <>
      <SEOHead title={title} description={description} canonical={canonical} />
      
      <div className="space-y-6">
        {/* ============================================================================
            HEADER SECTION
            - Title + Description + Icon
            - KPI Cards (optional)
            - Badges (optional)
            ============================================================================ */}
        <PageHeader {...header} />
        
        {/* ============================================================================
            ACTION BAR
            - Primary Actions (Links)
            - Secondary Actions (Rechts)
            - Bulk Actions (Overlay bei Selection)
            ============================================================================ */}
        {actions && (
          <ActionBar
            primary={actions.primary}
            secondary={actions.secondary}
            bulk={actions.bulk}
            selectedCount={selectedIds.length}
            selectedIds={selectedIds}
          />
        )}
        
        {/* ============================================================================
            FILTER BAR
            - Search Input
            - Tabs mit Counts
            - Custom Filters
            ============================================================================ */}
        {filters && (
          <FilterBar
            search={filters.search}
            tabs={filters.tabs}
            customFilters={filters.customFilters}
            onSearchChange={filters.onSearchChange}
            onTabChange={filters.onTabChange}
            onFilterChange={filters.onFilterChange}
          />
        )}
        
        {/* ============================================================================
            CONTENT AREA
            - Table View (DataTable)
            - Grid View (3 Columns)
            - Cards View (Vertical)
            - Widgets View (Dashboard)
            - Custom Content
            - Empty State
            ============================================================================ */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ContentArea {...content} />
        )}
      </div>
      
      {/* ============================================================================
          FLOATING ACTIONS (MOBILE)
          - Fixed Position Bottom-Right
          - Vertical Stack
          ============================================================================ */}
      {isMobile && floatingActions && <FloatingActions actions={floatingActions} />}
    </>
  );
}
