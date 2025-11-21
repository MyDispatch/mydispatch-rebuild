/* ==================================================================================
   IPHONE MOCKUP HD - ULTRA-HD MOBILE DEVICE MOCKUP
   ==================================================================================
   ✅ Modern iPhone design with notch
   ✅ Supports standard/retina/ultra-hd resolutions
   ✅ 3D tilt animations
   ✅ Premium shadows
   ================================================================================== */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { RenderingResolution } from '@/lib/rendering-quality';
import { getScaleClass } from '@/lib/rendering-quality';

interface IPhoneMockupHDProps {
  children: ReactNode;
  tiltDirection?: 'left' | 'right';
  resolution?: RenderingResolution;
  className?: string;
}

export function IPhoneMockupHD({ 
  children, 
  tiltDirection = 'right',
  resolution = 'retina',
  className 
}: IPhoneMockupHDProps) {
  const tiltTransform = tiltDirection === 'right' 
    ? 'rotateY(-8deg) rotateZ(2deg)' 
    : 'rotateY(8deg) rotateZ(-2deg)';

  return (
    <div 
      className={cn("relative w-full", className)}
      style={{ 
        perspective: '1000px',
        transform: tiltTransform,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* iPhone Shell */}
      <div className="relative w-full aspect-[9/19.5] bg-slate-900 rounded-[3rem] shadow-2xl border-8 border-slate-800">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-20" />
        
        {/* Screen Content Area */}
        <div className="absolute inset-4 bg-white rounded-[2.5rem] overflow-hidden">
          <div 
            className={cn(
              "w-full h-full scale-[0.85] origin-top transition-transform duration-300",
              resolution === 'ultra-hd' && "scale-[0.9]"
            )}
          >
            {children}
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-700 rounded-full" />

        {/* Premium Reflection */}
        <div 
          className="absolute inset-0 rounded-[3rem] pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
            mixBlendMode: 'overlay'
          }}
        />
      </div>
      
      {/* Ambient Shadow */}
      <div 
        className="absolute -inset-6 opacity-15 blur-2xl bg-gradient-to-br from-slate-900/30 to-transparent pointer-events-none -z-10"
        aria-hidden="true"
      />
    </div>
  );
}
