/* ==================================================================================
   PAGE TEMPLATE TYPES - V18.3.24 ULTIMATE
   ==================================================================================
   Zentrale TypeScript-Definitionen für das UnifiedPageTemplate-System
   ================================================================================== */

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

// ============================================================================
// KPI CONFIGURATION
// ============================================================================
export interface KPICardConfig {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: string;
  statusType?: 'success' | 'warning' | 'error' | 'neutral';
  onClick?: () => void;
}

// ============================================================================
// BADGE CONFIGURATION
// ============================================================================
export interface BadgeConfig {
  label: string;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

// ============================================================================
// ACTION CONFIGURATION
// ============================================================================
export interface ActionConfig {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
  badge?: string;
}

export interface BulkActionConfig {
  actions: Array<{
    label: string;
    icon?: LucideIcon;
    onClick: (selectedIds: string[]) => void | Promise<void>;
    variant?: 'default' | 'destructive' | 'outline';
  }>;
  onClear: () => void;
}

// ============================================================================
// FILTER CONFIGURATION
// ============================================================================
export interface SearchConfig {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

export interface TabConfig {
  id: string;
  label: string;
  count?: number;
  icon?: LucideIcon;
}

export interface FilterConfig {
  id: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'custom';
  label: string;
  options?: Array<{ value: string; label: string }>;
  value?: any;
  onChange?: (value: any) => void;
  component?: ReactNode;
}

// ============================================================================
// CONTENT CONFIGURATION
// ============================================================================
export interface EmptyStateConfig {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ColumnDef<T = any> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  sticky?: boolean;      // Für rechtliche Pflichtfelder
  mandatory?: boolean;   // Für rechtliche Pflichtfelder (niemals verstecken)
}

export interface ContentConfig<T = any> {
  type: 'table' | 'grid' | 'cards' | 'widgets' | 'custom';
  data: T[];
  columns?: ColumnDef<T>[];
  renderItem?: (item: T, index: number) => ReactNode;
  emptyState?: EmptyStateConfig;
  onRowClick?: (item: T) => void;
  customContent?: ReactNode;
}

// ============================================================================
// FLOATING ACTIONS (MOBILE)
// ============================================================================
export interface FloatingActionConfig {
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'secondary' | 'outline';
  label?: string;
}

// ============================================================================
// PAGE HEADER CONFIGURATION
// ============================================================================
export interface QuickActionConfig {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
}

export interface PageHeaderConfig {
  title: string;
  description?: string;
  icon?: LucideIcon;
  kpis?: KPICardConfig[]; // VERPFLICHTEND: Exakt 3 KPIs
  quickActions?: QuickActionConfig[]; // VERPFLICHTEND: Schnellzugriff-Aktionen
  badges?: BadgeConfig[];
}

// ============================================================================
// UNIFIED PAGE TEMPLATE PROPS
// ============================================================================
export interface UnifiedPageTemplateProps<T = any> {
  // SEO & Meta
  title: string;
  description: string;
  canonical: string;
  
  // Header Configuration
  header: PageHeaderConfig;
  
  // Actions Configuration (optional)
  actions?: {
    primary?: ActionConfig[];
    secondary?: ActionConfig[];
    bulk?: BulkActionConfig;
  };
  
  // Filter Configuration (optional)
  filters?: {
    search?: SearchConfig;
    tabs?: TabConfig[];
    customFilters?: FilterConfig[];
    onSearchChange?: (value: string) => void;
    onTabChange?: (tabId: string) => void;
    onFilterChange?: (filters: Record<string, any>) => void;
  };
  
  // Content Configuration
  content: ContentConfig<T>;
  
  // Floating Actions (Mobile, optional)
  floatingActions?: FloatingActionConfig[];
  
  // Mobile Override (optional)
  mobileComponent?: ReactNode;
  
  // Bulk Selection (optional)
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  
  // Loading State (optional)
  isLoading?: boolean;
}
