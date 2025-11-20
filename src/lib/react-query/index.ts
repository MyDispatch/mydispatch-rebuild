/**
 * React Query Utilities
 *
 * Zentrale Utilities für konsistente Query-Verwaltung
 *
 * Siehe: docs/OPTIMIERUNGSPOTENZIAL_V18.5.1.md
 */

export { queryKeys, invalidateQueries, resetQueries } from "./query-keys";
export {
  defaultQueryOptions,
  realtimeQueryOptions,
  staticQueryOptions,
  userQueryOptions,
} from "./query-options";
