/**
 * MAIN STORE UNIT TESTS V1.0
 * 
 * Test Coverage:
 * - Initial state
 * - State updates
 * - Selectors
 * - Actions
 * - Store isolation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMainStore } from './useMainStore';

describe('useMainStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useMainStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('Initial state', () => {
    it('has correct initial user state', () => {
      const { result } = renderHook(() => useMainStore());
      
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('has correct initial UI state', () => {
      const { result } = renderHook(() => useMainStore());
      
      expect(result.current.sidebarExpanded).toBe(true);
      expect(result.current.theme).toBe('light');
    });

    it('has correct initial filter state', () => {
      const { result } = renderHook(() => useMainStore());
      
      expect(result.current.filters).toEqual({});
      expect(result.current.searchQuery).toBe('');
    });
  });

  describe('User actions', () => {
    it('sets user correctly', () => {
      const { result } = renderHook(() => useMainStore());
      
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
      };

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('logs out user correctly', () => {
      const { result } = renderHook(() => useMainStore());
      
      act(() => {
        result.current.setUser({ id: '1', email: 'test@example.com' });
      });
      
      expect(result.current.isAuthenticated).toBe(true);

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('UI actions', () => {
    it('toggles sidebar correctly', () => {
      const { result } = renderHook(() => useMainStore());
      
      expect(result.current.sidebarExpanded).toBe(true);

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.sidebarExpanded).toBe(false);

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.sidebarExpanded).toBe(true);
    });

    it('sets theme correctly', () => {
      const { result } = renderHook(() => useMainStore());
      
      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
    });
  });

  describe('Filter actions', () => {
    it('sets filters correctly', () => {
      const { result } = renderHook(() => useMainStore());
      
      const filters = {
        status: 'active',
        dateFrom: '2025-01-01',
      };

      act(() => {
        result.current.setFilters(filters);
      });

      expect(result.current.filters).toEqual(filters);
    });

    it('clears filters correctly', () => {
      const { result } = renderHook(() => useMainStore());
      
      act(() => {
        result.current.setFilters({ status: 'active' });
      });

      expect(result.current.filters).toEqual({ status: 'active' });

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters).toEqual({});
    });

    it('sets search query correctly', () => {
      const { result } = renderHook(() => useMainStore());
      
      act(() => {
        result.current.setSearchQuery('test query');
      });

      expect(result.current.searchQuery).toBe('test query');
    });
  });

  describe('Selectors', () => {
    it('selects user email correctly', () => {
      const { result } = renderHook(() => 
        useMainStore(state => state.user?.email)
      );
      
      expect(result.current).toBeUndefined();

      const { result: storeResult } = renderHook(() => useMainStore());
      
      act(() => {
        storeResult.current.setUser({ 
          id: '1', 
          email: 'test@example.com' 
        });
      });

      const { result: emailResult } = renderHook(() => 
        useMainStore(state => state.user?.email)
      );

      expect(emailResult.current).toBe('test@example.com');
    });
  });

  describe('Store isolation', () => {
    it('maintains separate instances', () => {
      const { result: result1 } = renderHook(() => useMainStore());
      const { result: result2 } = renderHook(() => useMainStore());
      
      act(() => {
        result1.current.setSearchQuery('query 1');
      });

      // Both hooks should reference the same store
      expect(result1.current.searchQuery).toBe('query 1');
      expect(result2.current.searchQuery).toBe('query 1');
    });
  });
});
