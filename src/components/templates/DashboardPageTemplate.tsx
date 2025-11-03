/* ==================================================================================
   DASHBOARD-PAGE-TEMPLATE V18.5.1 - SINGLE SECTION
   ==================================================================================
   Standardisiertes Template für Dashboard-Seiten mit EINEM Bereich
   - Breadcrumbs automatisch
   - Titel + Beschreibung
   - Suche mit Archiv-Toggle
   - 3 KPIs + Schnellzugriff
   - Ein zentraler Bereich mit Icon/Titel/Badge
   - Einheitliches Eye-Icon für Details
   ================================================================================== */

import { ReactNode } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardBreadcrumb } from '@/components/layout/DashboardBreadcrumb';
import { PageHeaderWithKPIs } from '@/components/shared/PageHeaderWithKPIs';
import { DashboardSection } from '@/components/shared/DashboardSection';
import { Input } from '@/lib/compat';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface KPICardData {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  subtitle?: string;
  miniChart?: number[];
}

interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
}

interface DashboardPageTemplateProps {
  // SEO & Layout
  pageTitle: string;
  pageDescription: string;
  background?: 'white' | 'canvas' | 'orbs-light';
  
  // KPIs & Actions
  kpis: [KPICardData, KPICardData, KPICardData];
  quickActions: [QuickAction, QuickAction];
  
  // Search & Filter
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  showArchived: boolean;
  onArchivedChange: (value: boolean) => void;
  archivedLabel?: string;
  
  // Section Content
  sectionIcon: LucideIcon;
  sectionTitle: string;
  sectionBadge?: string | number;
  children: ReactNode;
  
  // Quick Actions Panel (NEU V2.0)
  quickActionsPanelConfig?: {
    enabled?: boolean; // Default: false (opt-in für Migration)
    variant?: 'compact' | 'standard'; // Default: 'standard'
    contextWidget?: ReactNode; // Custom Widget oder nutze context-widgets
  };
}

export function DashboardPageTemplate({
  pageTitle,
  pageDescription,
  background = 'canvas',
  kpis,
  quickActions,
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Durchsuchen...',
  showArchived,
  onArchivedChange,
  archivedLabel = 'Archivierte anzeigen',
  sectionIcon,
  sectionTitle,
  sectionBadge,
  children,
  quickActionsPanelConfig,
}: DashboardPageTemplateProps) {
  const showQuickActionsPanel = quickActionsPanelConfig?.enabled ?? false;
  return (
    <MainLayout background={background}>
      <div className={showQuickActionsPanel ? "flex gap-6" : "space-y-6"}>
        {/* Hauptbereich */}
        <div className="flex-1 min-w-0">
          <div className="space-y-6">
            {/* Breadcrumbs */}
            <DashboardBreadcrumb />
            
            {/* KPIs + Schnellzugriff */}
            <div className="mb-6">
              <PageHeaderWithKPIs
                kpis={kpis}
                quickActions={quickActions}
                quickAccessTitle="Schnellzugriff"
              />
            </div>

            {/* Suche + Archiv-Filter */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="h-11 pl-10"
                />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-card">
                <Switch
                  id="show-archived"
                  checked={showArchived}
                  onCheckedChange={onArchivedChange}
                />
                <Label htmlFor="show-archived" className="text-sm cursor-pointer whitespace-nowrap">
                  {archivedLabel}
                </Label>
              </div>
            </div>

            {/* Zentraler Bereich */}
            <DashboardSection
              icon={sectionIcon}
              title={sectionTitle}
              badge={sectionBadge}
            >
              {children}
            </DashboardSection>
          </div>
        </div>
        
        {/* Quick Actions Panel (NEU V2.0) */}
        {showQuickActionsPanel && (
          <aside className="hidden xl:block w-80 shrink-0">
            {quickActionsPanelConfig?.contextWidget}
          </aside>
        )}
      </div>
    </MainLayout>
  );
}
