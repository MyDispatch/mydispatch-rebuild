/* ==================================================================================
   IMAGE OPTIMIZER UTILITY V28.3
   ==================================================================================
   WebP/AVIF Converter & Retina srcSet Generator
   ================================================================================== */

export type ImageFormat = "webp" | "avif" | "png" | "jpg";

/**
 * Konvertiert Bildpfad zu optimiertem Format
 */
export const getOptimizedImageSrc = (originalSrc: string, format: ImageFormat = "webp"): string => {
  return originalSrc.replace(/\.(png|jpg|jpeg)$/i, `.${format}`);
};

/**
 * Generiert Retina srcSet für 2x/3x Displays
 */
export const getRetinaSrcSet = (baseSrc: string, format: ImageFormat = "webp"): string => {
  const optimizedSrc = getOptimizedImageSrc(baseSrc, format);
  const base = optimizedSrc.replace(/\.(webp|avif|png|jpg)$/i, "");
  const ext = format;

  return `
    ${base}.${ext} 1x,
    ${base}@2x.${ext} 2x,
    ${base}@3x.${ext} 3x
  `
    .trim()
    .replace(/\s+/g, " ");
};

/**
 * Generiert responsive sizes attribute
 */
export const getResponsiveSizes = (type: "hero" | "card" | "full" = "full"): string => {
  switch (type) {
    case "hero":
      return "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px";
    case "card":
      return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px";
    case "full":
    default:
      return "100vw";
  }
};
