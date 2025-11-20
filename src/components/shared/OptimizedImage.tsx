/* ==================================================================================
   OPTIMIZED IMAGE COMPONENT
   ==================================================================================
   Performance-optimierte Bildkomponente mit:
   - Lazy Loading
   - Progressive Loading (Skeleton → Image)
   - Responsive srcset
   - WebP Support mit Fallback
   ================================================================================== */

import { useState, ImgHTMLAttributes } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "onLoad" | "onError"> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/2";
  className?: string;
  priority?: boolean; // Skip lazy loading for above-the-fold images
  srcSet?: string; // Custom srcSet (overrides retinaOptimized)
  sizes?: string; // Responsive sizes attribute
  format?: "webp" | "avif" | "png"; // Preferred format
  retinaOptimized?: boolean; // Auto-generate 2x/3x srcSet
}

/**
 * Performance-optimized image component
 *
 * Features:
 * - Automatic lazy loading (unless priority=true)
 * - Progressive loading with skeleton
 * - Responsive sizing
 * - Fade-in transition
 *
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="/hero-image.jpg"
 *   alt="Hero Image"
 *   aspectRatio="16/9"
 *   priority
 * />
 * ```
 */
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  aspectRatio,
  className = "",
  priority = false,
  srcSet: customSrcSet,
  sizes = "100vw",
  format = "webp",
  retinaOptimized = false,
  ...props
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  // Calculate aspect ratio padding
  const aspectRatioPadding = aspectRatio
    ? {
        "16/9": "56.25%",
        "4/3": "75%",
        "1/1": "100%",
        "3/2": "66.67%",
      }[aspectRatio]
    : undefined;

  // Auto-generate Retina srcSet if enabled
  const generatedSrcSet =
    retinaOptimized && !customSrcSet
      ? `${src.replace(/\.(png|jpg|jpeg)$/i, `@2x.${format}`)} 2x, ${src.replace(/\.(png|jpg|jpeg)$/i, `@3x.${format}`)} 3x`
      : customSrcSet;

  // Determine if we should use <picture> for format fallbacks
  const usePicture = format === "webp" || format === "avif";

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ paddingBottom: aspectRatioPadding }}
    >
      {/* Skeleton while loading */}
      {!loaded && !error && <Skeleton className="absolute inset-0 w-full h-full" />}

      {/* Image with optional <picture> wrapper */}
      {!error &&
        (usePicture ? (
          <picture>
            {/* WebP/AVIF Source */}
            <source type={`image/${format}`} srcSet={generatedSrcSet || src} sizes={sizes} />
            {/* Fallback to original format */}
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              onLoad={handleLoad}
              onError={handleError}
              className={`
                absolute inset-0 w-full h-full object-cover
                transition-opacity duration-500 image-rendering-crisp
                ${loaded ? "opacity-100" : "opacity-0"}
              `}
              {...props}
            />
          </picture>
        ) : (
          <img
            src={src}
            srcSet={generatedSrcSet}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={`
              absolute inset-0 w-full h-full object-cover
              transition-opacity duration-500 image-rendering-crisp
              ${loaded ? "opacity-100" : "opacity-0"}
            `}
            {...props}
          />
        ))}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground p-4">
            <svg
              className="mx-auto h-12 w-12 mb-2 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Bild konnte nicht geladen werden</p>
          </div>
        </div>
      )}
    </div>
  );
};
