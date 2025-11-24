/* ==================================================================================
   LOGO COMPONENT - V26.0 (Official MyDispatch Logo)
   ==================================================================================
   Offizielles MyDispatch-Logo mit "simply arrive" Tagline
   ================================================================================== */

import { cn } from '@/lib/utils';
import officialLogo from '@/assets/mydispatch-logo-official.png';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export function Logo({ className, showTagline: _showTagline = false }: LogoProps) {
  return (
    <img
      src={officialLogo}
      alt="MyDispatch - simply arrive"
      className={cn(
        "h-8 sm:h-10 max-w-[180px] sm:max-w-[220px] md:max-w-[280px] object-contain",
        className
      )}
    />
  );
}
