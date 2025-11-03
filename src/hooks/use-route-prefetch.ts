/* ==================================================================================
   ROUTE PREFETCH HOOK - REMIX/NEXT.JS-INSPIRED
   ==================================================================================
   ⚡ PHASE 2.2: Performance Optimization
   
   Hover-Prefetching für kritische Routes
   Lädt Route-Chunks vor der Navigation
   
   Usage:
   const prefetch = useRoutePrefetch();
   <Link onMouseEnter={() => prefetch('/auftraege')} to="/auftraege">
   ================================================================================== */

import { useEffect, useCallback } from 'react';

interface PrefetchCache {
  [key: string]: boolean;
}

const prefetchCache: PrefetchCache = {};

/**
 * Route Prefetch Hook
 * 
 * Prefetches route chunks on hover/focus for instant navigation
 * 
 * @example
 * const prefetch = useRoutePrefetch();
 * 
 * <button 
 *   onMouseEnter={() => prefetch('/dashboard')}
 *   onClick={() => navigate('/dashboard')}
 * >
 *   Zum Dashboard
 * </button>
 */
export const useRoutePrefetch = () => {
  const prefetch = useCallback((path: string) => {
    // Skip if already prefetched
    if (prefetchCache[path]) return;
    
    // Mark as prefetched
    prefetchCache[path] = true;
    
    // Prefetch using link rel="prefetch"
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    link.as = 'document';
    document.head.appendChild(link);
  }, []);
  
  return prefetch;
};

/**
 * Prefetch Link Component
 * 
 * Drop-in replacement for Link with automatic prefetching
 * 
 * @example
 * <PrefetchLink to="/dashboard">Zum Dashboard</PrefetchLink>
 */
export const usePrefetchLink = (to: string) => {
  const prefetch = useRoutePrefetch();
  
  const handleMouseEnter = useCallback(() => {
    prefetch(to);
  }, [prefetch, to]);
  
  const handleFocus = useCallback(() => {
    prefetch(to);
  }, [prefetch, to]);
  
  return {
    onMouseEnter: handleMouseEnter,
    onFocus: handleFocus,
  };
};
