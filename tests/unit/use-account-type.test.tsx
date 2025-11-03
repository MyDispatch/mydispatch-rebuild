/**
 * Unit Tests - useAccountType Hook V18.2
 * 
 * Tests account type detection and permissions:
 * - Normal accounts
 * - Test accounts (demo@my-dispatch.de)
 * - Master accounts (courbois1981@gmail.com, master@my-dispatch.de)
 * - Permission derivation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAccountType } from '@/hooks/use-account-type';
import * as useAuthModule from '@/hooks/use-auth';

// Mock useAuth hook
vi.mock('@/hooks/use-auth', () => ({
  useAuth: vi.fn(),
}));

// Mock subscription utils
vi.mock('@/lib/subscription-utils', () => ({
  isBusinessTier: vi.fn((productId) => productId === 'business-plan'),
}));

describe('useAccountType', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Account Type Detection', () => {
    it('should return normal for regular user email', () => {
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: { email: 'user@example.com' } as any,
        profile: null,
      } as any);

      const { result } = renderHook(() => useAccountType());
      expect(result.current.accountType).toBe('normal');
    });

    it('should return master for courbois1981@gmail.com', () => {
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: { email: 'courbois1981@gmail.com' } as any,
        profile: null,
      } as any);

      const { result } = renderHook(() => useAccountType());
      expect(result.current.accountType).toBe('master');
    });

    it('should return master for master@my-dispatch.de', () => {
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: { email: 'master@my-dispatch.de' } as any,
        profile: null,
      } as any);

      const { result } = renderHook(() => useAccountType());
      expect(result.current.accountType).toBe('master');
    });

    it('should return test for demo@my-dispatch.de', () => {
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: { email: 'demo@my-dispatch.de' } as any,
        profile: null,
      } as any);

      const { result } = renderHook(() => useAccountType());
      expect(result.current.accountType).toBe('test');
    });

    it('should be case-insensitive for master accounts', () => {
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: { email: 'COURBOIS1981@GMAIL.COM' } as any,
        profile: null,
      } as any);

      const { result } = renderHook(() => useAccountType());
      expect(result.current.accountType).toBe('master');
    });

    it('should handle email with whitespace', () => {
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: { email: '  master@my-dispatch.de  ' } as any,
        profile: null,
      } as any);

      const { result } = renderHook(() => useAccountType());
      expect(result.current.accountType).toBe('master');
    });

    it('should return normal when user is null', () => {
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: null,
        profile: null,
      } as any);

      const { result } = renderHook(() => useAccountType());
      expect(result.current.accountType).toBe('normal');
    });

    it('should return normal when email is undefined', () => {
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: {} as any,
        profile: null,
      } as any);

      const { result } = renderHook(() => useAccountType());
      expect(result.current.accountType).toBe('normal');
    });
  });

  describe('Permissions - Master Account', () => {
    beforeEach(() => {
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: { email: 'courbois1981@gmail.com' } as any,
        profile: { company: { subscription_product_id: null } } as any,
      } as any);
    });

    it('should grant all permissions to master account', () => {
      const { result } = renderHook(() => useAccountType());
      expect(result.current.permissions).toEqual({
        canSwitchTariff: true,
        canAccessMasterDashboard: true,
        canBypassPayment: true,
        canAccessBusinessFeatures: true,
      });
    });
  });

  describe('Permissions - Test Account', () => {
    beforeEach(() => {
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: { email: 'demo@my-dispatch.de' } as any,
        profile: { company: { subscription_product_id: null } } as any,
      } as any);
    });

    it('should grant tariff switching and payment bypass to test account', () => {
      const { result } = renderHook(() => useAccountType());
      expect(result.current.permissions).toEqual({
        canSwitchTariff: true,
        canAccessMasterDashboard: false,
        canBypassPayment: true,
        canAccessBusinessFeatures: true,
      });
    });
  });

  describe('Permissions - Normal Account', () => {
    it('should grant minimal permissions to normal account without business plan', () => {
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: { email: 'user@example.com' } as any,
        profile: { company: { subscription_product_id: 'starter-plan' } } as any,
      } as any);

      const { result } = renderHook(() => useAccountType());
      expect(result.current.permissions).toEqual({
        canSwitchTariff: false,
        canAccessMasterDashboard: false,
        canBypassPayment: false,
        canAccessBusinessFeatures: false,
      });
    });

    it('should grant business features to normal account with business plan', () => {
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: { email: 'user@example.com' } as any,
        profile: { company: { subscription_product_id: 'business-plan' } } as any,
      } as any);

      const { result } = renderHook(() => useAccountType());
      expect(result.current.permissions).toEqual({
        canSwitchTariff: false,
        canAccessMasterDashboard: false,
        canBypassPayment: false,
        canAccessBusinessFeatures: true,
      });
    });

    it('should handle null profile gracefully', () => {
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: { email: 'user@example.com' } as any,
        profile: null,
      } as any);

      const { result } = renderHook(() => useAccountType());
      expect(result.current.permissions).toEqual({
        canSwitchTariff: false,
        canAccessMasterDashboard: false,
        canBypassPayment: false,
        canAccessBusinessFeatures: false,
      });
    });
  });

  describe('Permissions - Edge Cases', () => {
    it('should handle missing company in profile', () => {
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: { email: 'user@example.com' } as any,
        profile: {} as any,
      } as any);

      const { result } = renderHook(() => useAccountType());
      expect(result.current.permissions.canAccessBusinessFeatures).toBe(false);
    });

    it('should handle null subscription_product_id', () => {
      vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: { email: 'user@example.com' } as any,
        profile: { company: { subscription_product_id: null } } as any,
      } as any);

      const { result } = renderHook(() => useAccountType());
      expect(result.current.permissions.canAccessBusinessFeatures).toBe(false);
    });
  });

  describe('Memoization', () => {
    it('should memoize accountType based on email', () => {
      const mockUseAuth = vi.mocked(useAuthModule.useAuth);
      mockUseAuth.mockReturnValue({
        user: { email: 'master@my-dispatch.de' } as any,
        profile: null,
      } as any);

      const { result, rerender } = renderHook(() => useAccountType());
      const firstAccountType = result.current.accountType;

      rerender();
      expect(result.current.accountType).toBe(firstAccountType);
      expect(result.current.accountType).toBe('master');
    });

    it('should recalculate when email changes', () => {
      const mockUseAuth = vi.mocked(useAuthModule.useAuth);
      mockUseAuth.mockReturnValue({
        user: { email: 'user@example.com' } as any,
        profile: null,
      } as any);

      const { result, rerender } = renderHook(() => useAccountType());
      expect(result.current.accountType).toBe('normal');

      mockUseAuth.mockReturnValue({
        user: { email: 'master@my-dispatch.de' } as any,
        profile: null,
      } as any);

      rerender();
      expect(result.current.accountType).toBe('master');
    });
  });
});
