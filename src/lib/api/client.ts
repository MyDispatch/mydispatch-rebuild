/**
 * RE-EXPORT: API Client
 *
 * Dieser File re-exportiert die API Client-Typen aus src/api/client.ts
 * für Backward-Kompatibilität mit bestehendem Code in src/lib/api/*
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";
export type { TypedSupabaseClient, ApiResponse } from "@/api/client";
export { handleApiError } from "@/api/client";

// Import API factories
import { createBookingsApi } from "./bookings";
import { createPartnersApi } from "./partners";
import { createShiftsApi } from "./shifts";
import { createCompaniesApi } from "./companies";
import { createInvoicesApi } from "./invoices";
import { createDocumentsApi } from "./documents";
import { createProfilesApi } from "./profiles";
import { createDriversApi } from "@/api/drivers";
import { createVehiclesApi } from "@/api/vehicles";
import { createCustomersApi } from "@/api/customers";

/**
 * Unified API Client Interface
 */
export interface ApiClient {
  bookings: ReturnType<typeof createBookingsApi>;
  drivers: ReturnType<typeof createDriversApi>;
  vehicles: ReturnType<typeof createVehiclesApi>;
  customers: ReturnType<typeof createCustomersApi>;
  partners: ReturnType<typeof createPartnersApi>;
  shifts: ReturnType<typeof createShiftsApi>;
  companies: ReturnType<typeof createCompaniesApi>;
  invoices: ReturnType<typeof createInvoicesApi>;
  documents: ReturnType<typeof createDocumentsApi>;
  profiles: ReturnType<typeof createProfilesApi>;
}

/**
 * Creates a unified API client for all backend operations
 */
export function createApiClient(supabase: SupabaseClient<Database>): ApiClient {
  return {
    bookings: createBookingsApi(supabase),
    drivers: createDriversApi(supabase),
    vehicles: createVehiclesApi(supabase),
    customers: createCustomersApi(supabase),
    partners: createPartnersApi(supabase),
    shifts: createShiftsApi(supabase),
    companies: createCompaniesApi(supabase),
    invoices: createInvoicesApi(supabase),
    documents: createDocumentsApi(supabase),
    profiles: createProfilesApi(supabase),
  };
}
