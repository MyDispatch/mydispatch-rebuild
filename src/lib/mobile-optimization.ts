/* ==================================================================================
   MOBILE OPTIMIZATION - Vollständige Mobile-First Utilities
   ==================================================================================
   Erstellt: 2025-01-31
   Zweck: Mobile-First Helper Functions & Utilities
   Autor: NeXify AI MASTER
   ================================================================================== */

import React, { useState, useEffect } from "react";

/**
 * Mobile-First Breakpoints
 */
export const BREAKPOINTS = {
  sm: 640, // Small devices (phones)
  md: 768, // Medium devices (tablets)
  lg: 1024, // Large devices (desktops)
  xl: 1280, // Extra large devices
  "2xl": 1536, // 2X Extra large devices
} as const;

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < BREAKPOINTS.md;
}

/**
 * Check if device is tablet
 */
export function isTablet(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg;
}

/**
 * Check if device is desktop
 */
export function isDesktop(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= BREAKPOINTS.lg;
}

/**
 * Get current viewport width
 */
export function getViewportWidth(): number {
  if (typeof window === "undefined") return 0;
  return window.innerWidth;
}

/**
 * Touch-Target Size Check (≥48px)
 */
export const TOUCH_TARGET_MIN_SIZE = 48;

/**
 * Mobile-First Class Names
 */
export const MOBILE_CLASSES = {
  // Layout
  container: "w-full px-4 sm:px-6 lg:px-8",
  section: "py-6 sm:py-8 lg:py-12",

  // Typography
  heading: "text-2xl sm:text-3xl lg:text-4xl",
  subheading: "text-xl sm:text-2xl lg:text-3xl",
  body: "text-base sm:text-lg",

  // Spacing
  gap: "gap-4 sm:gap-6 lg:gap-8",
  padding: "p-4 sm:p-6 lg:p-8",

  // Grid
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",

  // Buttons
  button: "min-h-[48px] px-4 sm:px-6 py-3 sm:py-4",

  // Cards
  card: "w-full sm:max-w-md lg:max-w-lg",
} as const;

/**
 * Safe Area Insets (iOS Notch)
 */
export function getSafeAreaInsets(): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  if (typeof window === "undefined") {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  const style = getComputedStyle(document.documentElement);

  return {
    top: parseInt(style.getPropertyValue("--safe-area-inset-top") || "0"),
    bottom: parseInt(style.getPropertyValue("--safe-area-inset-bottom") || "0"),
    left: parseInt(style.getPropertyValue("--safe-area-inset-left") || "0"),
    right: parseInt(style.getPropertyValue("--safe-area-inset-right") || "0"),
  };
}

/**
 * Responsive Value Helper
 */
export function responsiveValue<T>(values: { mobile?: T; tablet?: T; desktop?: T; default: T }): T {
  if (typeof window === "undefined") return values.default;

  const width = window.innerWidth;

  if (width < BREAKPOINTS.md && values.mobile !== undefined) {
    return values.mobile;
  }

  if (width >= BREAKPOINTS.md && width < BREAKPOINTS.lg && values.tablet !== undefined) {
    return values.tablet;
  }

  if (width >= BREAKPOINTS.lg && values.desktop !== undefined) {
    return values.desktop;
  }

  return values.default;
}

/**
 * Mobile-First Media Query Hook (for React)
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    // Initial check for SSR safety
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    // Skip effect on server-side
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}
