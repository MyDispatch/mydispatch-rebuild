/* ==================================================================================
   DASHBOARD-DUAL-PAGE-TEMPLATE V18.5.1 - TWO SECTIONS WITH TABS
   ==================================================================================
   Standardisiertes Template für Dashboard-Seiten mit ZWEI Bereichen
   - Breadcrumbs automatisch
   - Titel + Beschreibung
   - Suche mit Archiv-Toggle
   - 3 KPIs + Schnellzugriff (dynamisch je Tab)
   - Zwei Bereiche mit Tab-Navigation
   - Einheitliches Eye-Icon für Details
   ================================================================================== */

import type { ReactNode } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardBreadcrumb } from '@/components/layout/DashboardBreadcrumb';
import { PageHeaderWithKPIs } from '@/components/shared/PageHeaderWithKPIs';
import { DashboardSection } from '@/components/shared/DashboardSection';
import { Input } from '@/lib/compat';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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

interface SectionConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  title: string;
  badge?: string | number;
  content: ReactNode;
  kpis: [KPICardData, KPICardData, KPICardData];
  quickActions: [QuickAction, QuickAction];
}

interface DashboardDualPageTemplateProps {
  // SEO & Layout
  pageTitle: string;
  pageDescription: string;
  
  // Tabs
  sections: [SectionConfig, SectionConfig];
  activeTab: string;
  onTabChange: (value: string) => void;
  
  // Search & Filter (Global für beide Tabs)
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  showArchived: boolean;
  onArchivedChange: (value: boolean) => void;
  archivedLabel?: string;
}

export function DashboardDualPageTemplate({
  pageTitle,
  pageDescription,
  sections,
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Durchsuchen...',
  showArchived,
  onArchivedChange,
  archivedLabel = 'Archivierte anzeigen',
}: DashboardDualPageTemplateProps) {
  const currentSection = sections.find(s => s.id === activeTab) || sections[0];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <DashboardBreadcrumb />
      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-2 mb-6">
          {sections.map((section) => (
            <TabsTrigger 
              key={section.id} 
              value={section.id}
              className="flex items-center gap-2"
            >
              <section.icon className="h-4 w-4" />
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="space-y-6 mt-0">
            {/* KPIs + Schnellzugriff (dynamisch je Tab) */}
            <PageHeaderWithKPIs
              kpis={section.kpis}
              quickActions={section.quickActions}
              quickAccessTitle="Schnellzugriff"
            />

            {/* Suche + Archiv-Filter */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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

            {/* Section Content */}
            <DashboardSection
              icon={section.icon}
              title={section.title}
              badge={section.badge}
            >
              {section.content}
            </DashboardSection>
          </TabsContent>
        ))}
      </Tabs>
      </div>
    </MainLayout>
  );
}
