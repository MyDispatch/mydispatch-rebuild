/**
 * ========================================================================
 * INTERSECTION OBSERVER HOOK - SCROLL ANIMATIONS
 * ========================================================================
 *
 * Trigger animations when elements enter viewport
 * Used for staggered fade-in effects on scroll
 *
 * USAGE:
 * ```tsx
 * const { ref, isVisible } = useIntersectionObserver();
 *
 * <div ref={ref} className={isVisible ? 'animate-fade-in' : ''}>
 *   Content
 * </div>
 * ```
 * ========================================================================
 */

import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}
