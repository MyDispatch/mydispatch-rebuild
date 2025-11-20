/* ==================================================================================
   OPTIMIZED RENDERING HOOK V31.0
   ==================================================================================
   Delays rendering until element is in viewport for performance optimization
   ================================================================================== */

import { useState, useEffect, useRef } from 'react';
import type { RenderingResolution } from '@/lib/rendering-quality';

export function useOptimizedRendering(resolution: RenderingResolution = 'retina') {
  const [shouldRender, setShouldRender] = useState(resolution === 'standard');
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Standard resolution renders immediately
    if (resolution === 'standard') {
      setShouldRender(true);
      return;
    }

    // Ultra-HD and Retina use Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Delay rendering for performance
          const delay = resolution === 'ultra-hd' ? 300 : 150;
          setTimeout(() => setShouldRender(true), delay);
        }
      },
      { threshold: 0.1 }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => observer.disconnect();
  }, [resolution]);
  
  return { shouldRender, elementRef };
}
