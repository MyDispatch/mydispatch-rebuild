/**
 * RE-EXPORT: API Barrel
 * 
 * Re-exportiert API-Module für Backward-Kompatibilität
 */

export type { TypedSupabaseClient, ApiResponse } from '@/api/client';
export { handleApiError } from '@/api/client';
export { createApiClient, type ApiClient } from './client';

export { createBookingsApi } from './bookings';
export type { BookingsApi, BookingFilters, BookingWithRelations } from './bookings';

export { createPartnersApi } from './partners';
export type { PartnersApi, PartnerFilters } from './partners';

export { createShiftsApi } from './shifts';
export type { ShiftsApi, ShiftFilters } from './shifts';

export { createCompaniesApi } from './companies';
export type { CompaniesApi, CompanyFilters } from './companies';

export { createInvoicesApi } from './invoices';
export type { InvoicesApi, InvoiceFilters } from './invoices';

export { createDocumentsApi } from './documents';
export type { DocumentsApi, DocumentFilters } from './documents';

export { createProfilesApi } from './profiles';
export type { ProfilesApi, ProfileFilters } from './profiles';
