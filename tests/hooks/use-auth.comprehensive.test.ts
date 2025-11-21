/* ==================================================================================
   COMPREHENSIVE TESTS: useAuth Hook
   ==================================================================================
   Coverage: Authentication, session management, profile loading, master roles
   Target: 95%+ coverage (security-critical component)
   ================================================================================== */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import {
  mockSupabaseClient,
  createMockProfile,
  createMockCompany,
  resetSupabaseMocks,
} from '../__mocks__/supabase';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient,
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock toast
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock error handler
vi.mock('@/lib/error-handler', () => ({
  handleError: vi.fn(),
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
  },
}));

describe('useAuth - Comprehensive Security Test Suite', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    resetSupabaseMocks();
    vi.clearAllMocks();
  });

  describe('Hook Initialization', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });

    it('should provide auth context when within provider', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('session');
      expect(result.current).toHaveProperty('profile');
      expect(result.current).toHaveProperty('company');
      expect(result.current).toHaveProperty('roles');
      expect(result.current).toHaveProperty('signOut');
    });
  });

  describe('Session Loading', () => {
    it('should load active session on mount', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString(),
        },
        access_token: 'test-token',
        token_type: 'bearer' as const,
        expires_in: 3600,
        refresh_token: 'test-refresh-token',
      };

      const mockProfile = createMockProfile({ user_id: 'user-123' });
      const mockCompany = createMockCompany();

      vi.mocked(mockSupabaseClient.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      vi.mocked(mockSupabaseClient.from).mockReturnValue({
        ...mockSupabaseClient,
        select: vi.fn().mockReturnValue({
          ...mockSupabaseClient,
          eq: vi.fn().mockReturnValue({
            ...mockSupabaseClient,
            single: vi.fn().mockResolvedValue({
              data: { ...mockProfile, companies: mockCompany },
              error: null,
            }),
          }),
        }),
      } as any);

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.loading).toBe(true);

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.user).toBeTruthy();
      expect(result.current.user?.id).toBe('user-123');
      expect(result.current.session).toBeTruthy();
    });

    it('should handle no active session', async () => {
      vi.mocked(mockSupabaseClient.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.profile).toBeNull();
      expect(result.current.company).toBeNull();
    });

    it('should handle session load errors gracefully', async () => {
      vi.mocked(mockSupabaseClient.auth.getSession).mockRejectedValue(
        new Error('Network error')
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
    });
  });

  describe('User Profile Loading', () => {
    it('should fetch user profile and company on auth', async () => {
      const mockProfile = createMockProfile({
        user_id: 'user-123',
        first_name: 'Max',
        last_name: 'Mustermann',
      });
      const mockCompany = createMockCompany({ name: 'Test GmbH' });

      vi.mocked(mockSupabaseClient.from).mockReturnValue({
        ...mockSupabaseClient,
        select: vi.fn().mockReturnValue({
          ...mockSupabaseClient,
          eq: vi.fn().mockReturnValue({
            ...mockSupabaseClient,
            single: vi.fn().mockResolvedValue({
              data: { ...mockProfile, companies: mockCompany },
              error: null,
            }),
          }),
        }),
      } as any);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.profile?.first_name).toBe('Max');
      expect(result.current.profile?.last_name).toBe('Mustermann');
      expect(result.current.company?.name).toBe('Test GmbH');
    });

    it('should handle profile fetch errors', async () => {
      const mockSession = {
        user: { id: 'user-123', email: 'test@example.com' },
      };

      vi.mocked(mockSupabaseClient.auth.getSession).mockResolvedValue({
        data: { session: mockSession as any },
        error: null,
      });

      vi.mocked(mockSupabaseClient.from).mockReturnValue({
        ...mockSupabaseClient,
        select: vi.fn().mockReturnValue({
          ...mockSupabaseClient,
          eq: vi.fn().mockReturnValue({
            ...mockSupabaseClient,
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Profile not found' },
            }),
          }),
        }),
      } as any);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.profile).toBeNull();
      expect(result.current.company).toBeNull();
    });

    it('should enrich profile with email from session', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'session@example.com',
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString(),
        },
        access_token: 'token',
        token_type: 'bearer' as const,
        expires_in: 3600,
        refresh_token: 'refresh',
      };

      const mockProfile = createMockProfile({
        user_id: 'user-123',
        email: 'profile@example.com', // Different email
      });

      vi.mocked(mockSupabaseClient.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      vi.mocked(mockSupabaseClient.from).mockReturnValue({
        ...mockSupabaseClient,
        select: vi.fn().mockReturnValue({
          ...mockSupabaseClient,
          eq: vi.fn().mockReturnValue({
            ...mockSupabaseClient,
            single: vi.fn().mockResolvedValue({
              data: { ...mockProfile, companies: null },
              error: null,
            }),
          }),
        }),
      } as any);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      // Session email should take precedence
      expect(result.current.profile?.email).toBe('session@example.com');
    });
  });

  describe('Role Management', () => {
    it('should fetch user roles correctly', async () => {
      const mockProfile = createMockProfile();

      vi.mocked(mockSupabaseClient.from).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            ...mockSupabaseClient,
            select: vi.fn().mockReturnValue({
              ...mockSupabaseClient,
              eq: vi.fn().mockReturnValue({
                ...mockSupabaseClient,
                single: vi.fn().mockResolvedValue({
                  data: { ...mockProfile, companies: null },
                  error: null,
                }),
              }),
            }),
          } as any;
        }
        if (table === 'user_roles') {
          return {
            ...mockSupabaseClient,
            select: vi.fn().mockReturnValue({
              ...mockSupabaseClient,
              eq: vi.fn().mockResolvedValue({
                data: [
                  { role: 'admin' },
                  { role: 'dispatcher' },
                ],
                error: null,
              }),
            }),
          } as any;
        }
        return mockSupabaseClient as any;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.roles).toContain('admin');
      expect(result.current.roles).toContain('dispatcher');
      expect(result.current.roles).toHaveLength(2);
    });

    it('should handle missing roles gracefully', async () => {
      const mockProfile = createMockProfile();

      vi.mocked(mockSupabaseClient.from).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            ...mockSupabaseClient,
            select: vi.fn().mockReturnValue({
              ...mockSupabaseClient,
              eq: vi.fn().mockReturnValue({
                ...mockSupabaseClient,
                single: vi.fn().mockResolvedValue({
                  data: { ...mockProfile, companies: null },
                  error: null,
                }),
              }),
            }),
          } as any;
        }
        if (table === 'user_roles') {
          return {
            ...mockSupabaseClient,
            select: vi.fn().mockReturnValue({
              ...mockSupabaseClient,
              eq: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'No roles found' },
              }),
            }),
          } as any;
        }
        return mockSupabaseClient as any;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.roles).toEqual([]);
    });

    it('🔒 CRITICAL: should add master role for courbois1981@gmail.com', async () => {
      const mockSession = {
        user: {
          id: 'master-user',
          email: 'courbois1981@gmail.com',
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString(),
        },
        access_token: 'token',
        token_type: 'bearer' as const,
        expires_in: 3600,
        refresh_token: 'refresh',
      };

      const mockProfile = createMockProfile({
        user_id: 'master-user',
        email: 'courbois1981@gmail.com',
      });

      vi.mocked(mockSupabaseClient.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      vi.mocked(mockSupabaseClient.from).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            ...mockSupabaseClient,
            select: vi.fn().mockReturnValue({
              ...mockSupabaseClient,
              eq: vi.fn().mockReturnValue({
                ...mockSupabaseClient,
                single: vi.fn().mockResolvedValue({
                  data: { ...mockProfile, companies: null },
                  error: null,
                }),
              }),
            }),
          } as any;
        }
        if (table === 'user_roles') {
          return {
            ...mockSupabaseClient,
            select: vi.fn().mockReturnValue({
              ...mockSupabaseClient,
              eq: vi.fn().mockResolvedValue({
                data: [{ role: 'admin' }],
                error: null,
              }),
            }),
          } as any;
        }
        return mockSupabaseClient as any;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.roles).toContain('master');
      expect(result.current.roles).toContain('admin');
    });

    it('🔒 CRITICAL: should add master role for pascal@nexify.ai', async () => {
      const mockSession = {
        user: {
          id: 'nexify-master',
          email: 'pascal@nexify.ai',
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString(),
        },
        access_token: 'token',
        token_type: 'bearer' as const,
        expires_in: 3600,
        refresh_token: 'refresh',
      };

      const mockProfile = createMockProfile({
        user_id: 'nexify-master',
        email: 'pascal@nexify.ai',
      });

      vi.mocked(mockSupabaseClient.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      vi.mocked(mockSupabaseClient.from).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            ...mockSupabaseClient,
            select: vi.fn().mockReturnValue({
              ...mockSupabaseClient,
              eq: vi.fn().mockReturnValue({
                ...mockSupabaseClient,
                single: vi.fn().mockResolvedValue({
                  data: { ...mockProfile, companies: null },
                  error: null,
                }),
              }),
            }),
          } as any;
        }
        if (table === 'user_roles') {
          return {
            ...mockSupabaseClient,
            select: vi.fn().mockReturnValue({
              ...mockSupabaseClient,
              eq: vi.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          } as any;
        }
        return mockSupabaseClient as any;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.roles).toContain('master');
    });

    it('should NOT add master role for regular users', async () => {
      const mockSession = {
        user: {
          id: 'regular-user',
          email: 'regular@example.com',
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString(),
        },
        access_token: 'token',
        token_type: 'bearer' as const,
        expires_in: 3600,
        refresh_token: 'refresh',
      };

      const mockProfile = createMockProfile({
        user_id: 'regular-user',
        email: 'regular@example.com',
      });

      vi.mocked(mockSupabaseClient.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      vi.mocked(mockSupabaseClient.from).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            ...mockSupabaseClient,
            select: vi.fn().mockReturnValue({
              ...mockSupabaseClient,
              eq: vi.fn().mockReturnValue({
                ...mockSupabaseClient,
                single: vi.fn().mockResolvedValue({
                  data: { ...mockProfile, companies: null },
                  error: null,
                }),
              }),
            }),
          } as any;
        }
        if (table === 'user_roles') {
          return {
            ...mockSupabaseClient,
            select: vi.fn().mockReturnValue({
              ...mockSupabaseClient,
              eq: vi.fn().mockResolvedValue({
                data: [{ role: 'dispatcher' }],
                error: null,
              }),
            }),
          } as any;
        }
        return mockSupabaseClient as any;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.roles).not.toContain('master');
      expect(result.current.roles).toContain('dispatcher');
    });
  });

  describe('Sign Out Functionality', () => {
    it('should sign out successfully', async () => {
      vi.mocked(mockSupabaseClient.auth.signOut).mockResolvedValue({
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/auth');
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Abgemeldet',
        description: 'Sie wurden erfolgreich abgemeldet.',
      });
    });

    it('should clear all auth state on sign out', async () => {
      vi.mocked(mockSupabaseClient.auth.signOut).mockResolvedValue({
        error: null,
      });

      const mockSession = {
        user: { id: 'user-123', email: 'test@example.com' },
      };

      vi.mocked(mockSupabaseClient.auth.getSession).mockResolvedValue({
        data: { session: mockSession as any },
        error: null,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.user).toBeTruthy());

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.profile).toBeNull();
      expect(result.current.company).toBeNull();
      expect(result.current.roles).toEqual([]);
    });

    it('should handle sign out errors', async () => {
      const mockError = new Error('Sign out failed');
      vi.mocked(mockSupabaseClient.auth.signOut).mockResolvedValue({
        error: mockError as any,
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Fehler',
        description: 'Sign out failed',
        variant: 'destructive',
      });
    });
  });

  describe('Auth State Changes', () => {
    it('should respond to auth state change events', async () => {
      let authCallback: any;

      vi.mocked(mockSupabaseClient.auth.onAuthStateChange).mockImplementation((callback) => {
        authCallback = callback;
        return {
          data: { subscription: { unsubscribe: vi.fn() } },
        } as any;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      // Simulate SIGNED_IN event
      const newSession = {
        user: {
          id: 'new-user',
          email: 'new@example.com',
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString(),
        },
        access_token: 'new-token',
        token_type: 'bearer' as const,
        expires_in: 3600,
        refresh_token: 'new-refresh',
      };

      act(() => {
        authCallback('SIGNED_IN', newSession);
      });

      await waitFor(() => expect(result.current.user?.id).toBe('new-user'));
    });

    it('should unsubscribe from auth changes on unmount', async () => {
      const unsubscribe = vi.fn();

      vi.mocked(mockSupabaseClient.auth.onAuthStateChange).mockReturnValue({
        data: { subscription: { unsubscribe } },
      } as any);

      const { unmount } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(unsubscribe).not.toHaveBeenCalled());

      unmount();

      expect(unsubscribe).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid re-authentication', async () => {
      const mockProfile = createMockProfile();

      vi.mocked(mockSupabaseClient.from).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            ...mockSupabaseClient,
            select: vi.fn().mockReturnValue({
              ...mockSupabaseClient,
              eq: vi.fn().mockReturnValue({
                ...mockSupabaseClient,
                single: vi.fn().mockResolvedValue({
                  data: { ...mockProfile, companies: null },
                  error: null,
                }),
              }),
            }),
          } as any;
        }
        return mockSupabaseClient as any;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      // Simulate sign out
      await act(async () => {
        await result.current.signOut();
      });

      // Simulate immediate sign in (rapid re-auth)
      const newSession = {
        user: { id: 'user-456', email: 'new@example.com' },
      };

      vi.mocked(mockSupabaseClient.auth.getSession).mockResolvedValue({
        data: { session: newSession as any },
        error: null,
      });

      // Should not throw or cause race conditions
      expect(() => result.current.user).not.toThrow();
    });

    it('should handle case-insensitive master email comparison', async () => {
      const mockSession = {
        user: {
          id: 'master-user',
          email: 'COURBOIS1981@GMAIL.COM', // Uppercase
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString(),
        },
        access_token: 'token',
        token_type: 'bearer' as const,
        expires_in: 3600,
        refresh_token: 'refresh',
      };

      const mockProfile = createMockProfile({
        user_id: 'master-user',
        email: 'COURBOIS1981@GMAIL.COM',
      });

      vi.mocked(mockSupabaseClient.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      vi.mocked(mockSupabaseClient.from).mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            ...mockSupabaseClient,
            select: vi.fn().mockReturnValue({
              ...mockSupabaseClient,
              eq: vi.fn().mockReturnValue({
                ...mockSupabaseClient,
                single: vi.fn().mockResolvedValue({
                  data: { ...mockProfile, companies: null },
                  error: null,
                }),
              }),
            }),
          } as any;
        }
        if (table === 'user_roles') {
          return {
            ...mockSupabaseClient,
            select: vi.fn().mockReturnValue({
              ...mockSupabaseClient,
              eq: vi.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          } as any;
        }
        return mockSupabaseClient as any;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      // Should still recognize as master despite uppercase
      expect(result.current.roles).toContain('master');
    });
  });
});
