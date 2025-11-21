/* ==================================================================================
   SUPABASE CLIENT MOCK - CENTRALIZED FOR ALL TESTS
   ==================================================================================
   Consistent Supabase mock with fluent API pattern
   ================================================================================== */

import { vi } from 'vitest';

export const mockSupabaseClient = {
  from: vi.fn(() => mockSupabaseClient),
  select: vi.fn(() => mockSupabaseClient),
  insert: vi.fn(() => mockSupabaseClient),
  update: vi.fn(() => mockSupabaseClient),
  delete: vi.fn(() => mockSupabaseClient),
  eq: vi.fn(() => mockSupabaseClient),
  neq: vi.fn(() => mockSupabaseClient),
  in: vi.fn(() => mockSupabaseClient),
  is: vi.fn(() => mockSupabaseClient),
  order: vi.fn(() => mockSupabaseClient),
  limit: vi.fn(() => mockSupabaseClient),
  single: vi.fn(() => mockSupabaseClient),
  maybeSingle: vi.fn(() => mockSupabaseClient),
  then: vi.fn((resolve) => {
    return Promise.resolve({ data: [], error: null }).then(resolve);
  }),
  auth: {
    getSession: vi.fn(() =>
      Promise.resolve({
        data: {
          session: {
            user: {
              id: 'test-user-id',
              email: 'test@example.com',
              aud: 'authenticated',
              role: 'authenticated',
              created_at: new Date().toISOString(),
            },
            access_token: 'test-token',
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: 'test-refresh-token',
          }
        },
        error: null
      })
    ),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
    signOut: vi.fn(() => Promise.resolve({ error: null })),
    signInWithPassword: vi.fn(() =>
      Promise.resolve({
        data: {
          user: { id: 'test-user-id', email: 'test@example.com' },
          session: { access_token: 'test-token' }
        },
        error: null
      })
    ),
  },
  channel: vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn(() => Promise.resolve({ status: 'SUBSCRIBED' })),
    unsubscribe: vi.fn(() => Promise.resolve({ status: 'UNSUBSCRIBED' })),
  })),
  removeChannel: vi.fn(() => Promise.resolve({ status: 'OK' })),
};

/**
 * Mock factory for Supabase responses
 */
export const createMockResponse = <T>(data: T, error: any = null) => ({
  data,
  error,
  status: error ? 400 : 200,
  statusText: error ? 'Bad Request' : 'OK',
});

/**
 * Mock factory for booking data
 */
export const createMockBooking = (overrides = {}) => ({
  id: 'test-booking-1',
  booking_number: 'BK-2024-001',
  pickup_location: 'Hauptbahnhof',
  dropoff_location: 'Flughafen',
  status: 'pending',
  total_price: 45.50,
  company_id: 'test-company-id',
  customer_id: 'test-customer-id',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  archived: false,
  ...overrides,
});

/**
 * Mock factory for user profile
 */
export const createMockProfile = (overrides = {}) => ({
  id: 'test-profile-id',
  user_id: 'test-user-id',
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  phone: '+49123456789',
  company_id: 'test-company-id',
  role: 'admin',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

/**
 * Mock factory for company
 */
export const createMockCompany = (overrides = {}) => ({
  id: 'test-company-id',
  name: 'Test Company GmbH',
  email: 'info@testcompany.com',
  phone: '+49123456789',
  address: 'Teststraße 1',
  city: 'Berlin',
  postal_code: '10115',
  country: 'DE',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

/**
 * Reset all mocks (call in beforeEach)
 */
export const resetSupabaseMocks = () => {
  Object.values(mockSupabaseClient).forEach((mock: any) => {
    if (typeof mock === 'function') {
      mock.mockClear();
    }
    if (mock && typeof mock === 'object') {
      Object.values(mock).forEach((nestedMock: any) => {
        if (typeof nestedMock === 'function') {
          nestedMock.mockClear();
        }
      });
    }
  });
};

// Export default mock client
export default mockSupabaseClient;
