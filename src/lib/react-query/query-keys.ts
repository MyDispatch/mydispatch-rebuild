/**
 * React Query Key Factory V18.5.1 (CONSOLIDATED)
 * 
 * Zentrale Definition aller Query-Keys für konsistente Caching
 * Verhindert Tippfehler und ermöglicht Type-Safety
 * 
 * MIGRATION from legacy query-client.ts completed (BATCH 17)
 * 
 * @example
 * import { queryKeys } from '@/lib/react-query/query-keys';
 * const { data } = useQuery({ queryKey: queryKeys.bookings.list() });
 */

export const queryKeys = {
  // Bookings
  bookings: {
    all: ['bookings'] as const,
    lists: () => [...queryKeys.bookings.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.bookings.lists(), { filters }] as const,
    details: () => [...queryKeys.bookings.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.bookings.details(), id] as const,
  },

  // Drivers
  drivers: {
    all: ['drivers'] as const,
    lists: () => [...queryKeys.drivers.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.drivers.lists(), { filters }] as const,
    details: () => [...queryKeys.drivers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.drivers.details(), id] as const,
  },

  // Vehicles
  vehicles: {
    all: ['vehicles'] as const,
    lists: () => [...queryKeys.vehicles.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.vehicles.lists(), { filters }] as const,
    details: () => [...queryKeys.vehicles.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.vehicles.details(), id] as const,
  },

  // Customers
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.customers.lists(), { filters }] as const,
    details: () => [...queryKeys.customers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.customers.details(), id] as const,
  },

  // Invoices
  invoices: {
    all: ['invoices'] as const,
    lists: () => [...queryKeys.invoices.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.invoices.lists(), { filters }] as const,
    details: () => [...queryKeys.invoices.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.invoices.details(), id] as const,
  },

  // Partners
  partners: {
    all: ['partners'] as const,
    lists: () => [...queryKeys.partners.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.partners.lists(), { filters }] as const,
    details: () => [...queryKeys.partners.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.partners.details(), id] as const,
  },

  // Cost Centers
  costCenters: {
    all: ['cost_centers'] as const,
    lists: () => [...queryKeys.costCenters.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.costCenters.lists(), { filters }] as const,
    details: () => [...queryKeys.costCenters.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.costCenters.details(), id] as const,
  },

  // Shifts
  shifts: {
    all: ['shifts'] as const,
    lists: () => [...queryKeys.shifts.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.shifts.lists(), { filters }] as const,
    details: () => [...queryKeys.shifts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.shifts.details(), id] as const,
  },

  // Documents
  documents: {
    all: ['documents'] as const,
    lists: () => [...queryKeys.documents.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.documents.lists(), { filters }] as const,
    details: () => [...queryKeys.documents.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.documents.details(), id] as const,
  },

  // Statistics
  statistics: {
    all: ['statistics'] as const,
    dashboard: () => [...queryKeys.statistics.all, 'dashboard'] as const,
    revenue: (period: string) => 
      [...queryKeys.statistics.all, 'revenue', period] as const,
    bookings: (period: string) => 
      [...queryKeys.statistics.all, 'bookings', period] as const,
  },

  // Dashboard Stats (NEW - covers 48% ohne Factory)
  dashboardStats: {
    all: ['dashboard-stats'] as const,
    list: (companyId?: string) => 
      companyId 
        ? [...queryKeys.dashboardStats.all, companyId] as const
        : queryKeys.dashboardStats.all,
  },

  // Weather (NEW)
  weather: {
    all: ['weather'] as const,
    current: () => [...queryKeys.weather.all, 'current'] as const,
  },

  // Traffic (NEW - V18.5.3 BATCH 18)
  traffic: (origin: string) => ['traffic', origin] as const,

  // Alert System (NEW)
  alerts: {
    all: ['alerts'] as const,
    policies: () => [...queryKeys.alerts.all, 'policies'] as const,
    latest: (limit: number = 10) => ['latest-alerts', limit] as const,
    history: (days: number = 7) => ['alert-history', days] as const,
    statistics: (days: number = 7) => ['alert-statistics', days] as const,
  },

  // Agent Health (NEW - BATCH 17.1)
  agentHealth: {
    all: ['agent-health'] as const,
    latest: () => [...queryKeys.agentHealth.all, 'latest'] as const,
    history: () => [...queryKeys.agentHealth.all, 'history'] as const,
    status: () => ['agent-status'] as const,
  },

  // AI Forecast (NEW - BATCH 17.1)
  aiForecast: (companyId: string | undefined, days: number) => 
    ['ai-forecast', companyId, days] as const,

  // Audit Logs (NEW)
  auditLogs: {
    all: ['audit-logs'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.auditLogs.all, 'list', { filters }] as const,
  },

  // Company (NEW)
  company: {
    all: ['company'] as const,
    detail: (id?: string) => 
      id ? [...queryKeys.company.all, id] as const : queryKeys.company.all,
    location: (id?: string) => 
      id ? [...queryKeys.company.all, 'location', id] as const : [...queryKeys.company.all, 'location'] as const,
  },

  // Document Expiry (NEW)
  documentExpiry: {
    all: ['document-expiry'] as const,
    dashboard: () => [...queryKeys.documentExpiry.all, 'dashboard'] as const,
    reminders: () => [...queryKeys.documentExpiry.all, 'reminders'] as const,
  },

  // Global Search (NEW)
  globalSearch: {
    all: ['global-search'] as const,
    query: (companyId: string, query: string) => 
      [...queryKeys.globalSearch.all, companyId, query] as const,
  },

  // User
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    subscription: () => [...queryKeys.user.all, 'subscription'] as const,
    settings: () => [...queryKeys.user.all, 'settings'] as const,
  },
} as const;

/**
 * Helper für Query-Key Invalidierung
 * 
 * @example
 * invalidateQueries(queryClient, queryKeys.bookings.all);
 */
export const invalidateQueries = (
  queryClient: any,
  queryKey: readonly unknown[]
) => {
  return queryClient.invalidateQueries({ queryKey });
};

/**
 * Helper für Query-Data Reset
 * 
 * @example
 * resetQueries(queryClient, queryKeys.bookings.all);
 */
export const resetQueries = (
  queryClient: any,
  queryKey: readonly unknown[]
) => {
  return queryClient.resetQueries({ queryKey });
};
