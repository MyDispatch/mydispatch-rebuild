/* ==================================================================================
   RENDERING QUALITY UTILITIES V31.0
   ==================================================================================
   Manages graphic quality levels for Ultra-HD dashboard rendering
   ================================================================================== */

export type RenderingResolution = 'standard' | 'retina' | 'ultra-hd';

export interface RenderingConfig {
  scale: number;
  quality: 'standard' | 'medium' | 'high';
  antialiasing: boolean;
  svgPreferred: boolean;
  webpFallback?: boolean;
}

export const getRenderingQuality = (resolution: RenderingResolution): RenderingConfig => {
  switch(resolution) {
    case 'ultra-hd':
      return {
        scale: 2.5,
        quality: 'high',
        antialiasing: true,
        svgPreferred: true,
        webpFallback: true
      };
    case 'retina':
      return {
        scale: 2,
        quality: 'medium',
        antialiasing: true,
        svgPreferred: false
      };
    default:
      return {
        scale: 1,
        quality: 'standard',
        antialiasing: false,
        svgPreferred: false
      };
  }
};

export const getScaleClass = (resolution: RenderingResolution): string => {
  // ❌ REMOVED: transform:scale causes blur on Retina displays
  // ✅ Use native resolution + Retina srcSet instead
  return ''; // No CSS transform scaling
};

export const getRetinaClasses = (resolution: RenderingResolution): string => {
  // ✅ NEW: CSS-based rendering quality without transform blur
  switch(resolution) {
    case 'ultra-hd':
      return 'image-rendering-crisp';
    case 'retina':
      return 'image-rendering-auto';
    default:
      return '';
  }
};
