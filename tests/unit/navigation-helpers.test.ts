/**
 * Unit Tests - Navigation Helpers V18.5.1
 * 
 * Tests all navigation helper functions for:
 * - Route generation
 * - Context-aware navigation
 * - Redirect logic
 * - Public route detection
 */

import { describe, it, expect, vi } from 'vitest';
import {
  getHomeRoute,
  navigateToAuth,
  navigateToProtectedRoute,
  getEntityRoute,
  getLoginRedirectRoute,
  getSignupRedirectRoute,
  getLogoutRedirectRoute,
  isPublicRoute,
  getCompanyContext,
} from '@/lib/navigation-helpers';

describe('Navigation Helpers', () => {
  describe('getHomeRoute', () => {
    it('should return "/" when no searchParams provided', () => {
      expect(getHomeRoute()).toBe('/');
      expect(getHomeRoute(null)).toBe('/');
    });

    it('should return "/" when searchParams is empty', () => {
      const params = new URLSearchParams();
      expect(getHomeRoute(params)).toBe('/');
    });

    it('should return "/" when only slug is provided', () => {
      const params = new URLSearchParams('slug=taxi-mueller');
      expect(getHomeRoute(params)).toBe('/');
    });

    it('should return "/" when only company is provided', () => {
      const params = new URLSearchParams('company=123');
      expect(getHomeRoute(params)).toBe('/');
    });

    it('should return "/:slug" when both company and slug are valid', () => {
      const params = new URLSearchParams('company=123&slug=taxi-mueller');
      expect(getHomeRoute(params)).toBe('/taxi-mueller');
    });

    it('should return "/" when slug is empty string', () => {
      const params = new URLSearchParams('company=123&slug=');
      expect(getHomeRoute(params)).toBe('/');
    });

    it('should return "/" when slug is whitespace only', () => {
      const params = new URLSearchParams('company=123&slug=%20');
      expect(getHomeRoute(params)).toBe('/');
    });
  });

  describe('navigateToAuth', () => {
    it('should navigate to /auth without params when no options', () => {
      const navigate = vi.fn();
      navigateToAuth(navigate);
      expect(navigate).toHaveBeenCalledWith('/auth');
    });

    it('should include tab=login when mode is login', () => {
      const navigate = vi.fn();
      navigateToAuth(navigate, { mode: 'login' });
      expect(navigate).toHaveBeenCalledWith('/auth?tab=login');
    });

    it('should include tab=signup when mode is signup', () => {
      const navigate = vi.fn();
      navigateToAuth(navigate, { mode: 'signup' });
      expect(navigate).toHaveBeenCalledWith('/auth?tab=signup');
    });

    it('should include all params for branded customer signup', () => {
      const navigate = vi.fn();
      navigateToAuth(navigate, {
        mode: 'signup',
        companyId: '123',
        slug: 'taxi-mueller',
        customerMode: true,
      });
      expect(navigate).toHaveBeenCalledWith(
        '/auth?tab=signup&company=123&slug=taxi-mueller&mode=customer'
      );
    });

    it('should include company and slug without customerMode', () => {
      const navigate = vi.fn();
      navigateToAuth(navigate, {
        mode: 'login',
        companyId: '456',
        slug: 'mietwagen-berlin',
      });
      expect(navigate).toHaveBeenCalledWith(
        '/auth?tab=login&company=456&slug=mietwagen-berlin'
      );
    });
  });

  describe('navigateToProtectedRoute', () => {
    it('should call navigate with path', () => {
      const navigate = vi.fn();
      navigateToProtectedRoute(navigate, '/dashboard');
      expect(navigate).toHaveBeenCalledWith('/dashboard', undefined);
    });

    it('should pass options to navigate', () => {
      const navigate = vi.fn();
      const options = { replace: true, state: { from: '/auth' } };
      navigateToProtectedRoute(navigate, '/dashboard', options);
      expect(navigate).toHaveBeenCalledWith('/dashboard', options);
    });
  });

  describe('getEntityRoute', () => {
    it('should generate route for kunden', () => {
      expect(getEntityRoute('kunden', '123')).toBe('/kunden?id=123');
    });

    it('should generate route for fahrer', () => {
      expect(getEntityRoute('fahrer', '456')).toBe('/fahrer?id=456');
    });

    it('should generate route for fahrzeuge', () => {
      expect(getEntityRoute('fahrzeuge', '789')).toBe('/fahrzeuge?id=789');
    });

    it('should generate route for auftraege', () => {
      expect(getEntityRoute('auftraege', 'abc')).toBe('/auftraege?id=abc');
    });

    it('should generate route for rechnungen', () => {
      expect(getEntityRoute('rechnungen', 'def')).toBe('/rechnungen?id=def');
    });

    it('should generate route for angebote', () => {
      expect(getEntityRoute('angebote', 'ghi')).toBe('/angebote?id=ghi');
    });
  });

  describe('getLoginRedirectRoute', () => {
    it('should return custom redirect when provided', () => {
      const params = new URLSearchParams('redirect=/auftraege');
      expect(getLoginRedirectRoute('entrepreneur', params)).toBe('/auftraege');
    });

    it('should return /dashboard for entrepreneur without redirect', () => {
      const params = new URLSearchParams();
      expect(getLoginRedirectRoute('entrepreneur', params)).toBe('/dashboard');
    });

    it('should return /portal for customer', () => {
      const params = new URLSearchParams();
      expect(getLoginRedirectRoute('customer', params)).toBe('/portal');
    });

    it('should return /driver/dashboard for driver', () => {
      const params = new URLSearchParams();
      expect(getLoginRedirectRoute('driver', params)).toBe('/driver/dashboard');
    });

    it('should prioritize redirect param over role-based routing', () => {
      const params = new URLSearchParams('redirect=/custom-page');
      expect(getLoginRedirectRoute('customer', params)).toBe('/custom-page');
    });
  });

  describe('getSignupRedirectRoute', () => {
    it('should return /dashboard for entrepreneur without payment', () => {
      expect(getSignupRedirectRoute('entrepreneur', false)).toBe('/dashboard');
    });

    it('should return /dashboard for entrepreneur with payment', () => {
      expect(getSignupRedirectRoute('entrepreneur', true)).toBe('/dashboard');
    });

    it('should return /portal for customer', () => {
      expect(getSignupRedirectRoute('customer', false)).toBe('/portal');
    });

    it('should return /driver/dashboard for driver', () => {
      expect(getSignupRedirectRoute('driver', false)).toBe('/driver/dashboard');
    });
  });

  describe('getLogoutRedirectRoute', () => {
    it('should return /portal/auth for portal paths', () => {
      expect(getLogoutRedirectRoute('/portal')).toBe('/portal/auth');
      expect(getLogoutRedirectRoute('/portal/dashboard')).toBe('/portal/auth');
    });

    it('should return /driver/login for driver paths', () => {
      expect(getLogoutRedirectRoute('/driver')).toBe('/driver/login');
      expect(getLogoutRedirectRoute('/driver/dashboard')).toBe('/driver/login');
    });

    it('should return /auth for dashboard paths', () => {
      expect(getLogoutRedirectRoute('/dashboard')).toBe('/auth');
      expect(getLogoutRedirectRoute('/auftraege')).toBe('/auth');
      expect(getLogoutRedirectRoute('/kunden')).toBe('/auth');
    });

    it('should return /auth for unknown paths', () => {
      expect(getLogoutRedirectRoute('/unknown')).toBe('/auth');
      expect(getLogoutRedirectRoute('/')).toBe('/auth');
    });
  });

  describe('isPublicRoute', () => {
    it('should return true for marketing routes', () => {
      expect(isPublicRoute('/')).toBe(true);
      expect(isPublicRoute('/auth')).toBe(true);
      expect(isPublicRoute('/pricing')).toBe(true);
      expect(isPublicRoute('/faq')).toBe(true);
      expect(isPublicRoute('/docs')).toBe(true);
      expect(isPublicRoute('/contact')).toBe(true);
    });

    it('should return true for legal routes', () => {
      expect(isPublicRoute('/impressum')).toBe(true);
      expect(isPublicRoute('/datenschutz')).toBe(true);
      expect(isPublicRoute('/agb')).toBe(true);
      expect(isPublicRoute('/terms')).toBe(true);
    });

    it('should return true for driver public routes', () => {
      expect(isPublicRoute('/driver')).toBe(true);
      expect(isPublicRoute('/driver/login')).toBe(true);
      expect(isPublicRoute('/driver/register')).toBe(true);
      expect(isPublicRoute('/driver/welcome')).toBe(true);
    });

    it('should return false for protected dashboard routes', () => {
      expect(isPublicRoute('/dashboard')).toBe(false);
      expect(isPublicRoute('/dashboard/settings')).toBe(false);
    });

    it('should return false for entity routes', () => {
      expect(isPublicRoute('/auftraege')).toBe(false);
      expect(isPublicRoute('/kunden')).toBe(false);
      expect(isPublicRoute('/fahrer')).toBe(false);
    });

    it('should return false for portal routes', () => {
      expect(isPublicRoute('/portal')).toBe(false);
      expect(isPublicRoute('/portal/bookings')).toBe(false);
    });

    it('should return true for dynamic branded routes', () => {
      expect(isPublicRoute('/taxi-mueller')).toBe(true);
      expect(isPublicRoute('/mietwagen-berlin')).toBe(true);
    });
  });

  describe('getCompanyContext', () => {
    it('should return null values for empty params', () => {
      const params = new URLSearchParams();
      const context = getCompanyContext(params);
      expect(context).toEqual({
        companyId: null,
        slug: null,
        isMarketing: true,
        isBranded: false,
      });
    });

    it('should return company context when params present', () => {
      const params = new URLSearchParams('company=123&slug=taxi-mueller');
      const context = getCompanyContext(params);
      expect(context).toEqual({
        companyId: '123',
        slug: 'taxi-mueller',
        isMarketing: false,
        isBranded: true,
      });
    });

    it('should handle partial params correctly', () => {
      const params = new URLSearchParams('company=456');
      const context = getCompanyContext(params);
      expect(context).toEqual({
        companyId: '456',
        slug: null,
        isMarketing: false,
        isBranded: true,
      });
    });
  });
});
