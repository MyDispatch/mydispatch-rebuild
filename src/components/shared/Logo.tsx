/* ==================================================================================
   LOGO COMPONENT - V26.0 (Official MyDispatch Logo)
   ==================================================================================
   Offizielles MyDispatch-Logo mit "simply arrive" Tagline
   ================================================================================== */

import { cn } from '@/lib/utils';
import officialLogo from '@/assets/mydispatch-logo-official.png';
import { useState } from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export function Logo({ className, showTagline = false }: LogoProps) {
  const [src, setSrc] = useState<string>(officialLogo);
  return (
    <img
      src={src}
      alt="MyDispatch - simply arrive"
      loading="lazy"
      decoding="async"
      onError={() => {
        // Fallback auf public-Asset, falls gebundeltes Logo nicht verfügbar ist
        if (src !== '/logo.png') setSrc('/logo.png');
      }}
      className={cn(
        "h-8 sm:h-10 max-w-[180px] sm:max-w-[220px] md:max-w-[280px] object-contain",
        className
      )}
    />
  );
}
