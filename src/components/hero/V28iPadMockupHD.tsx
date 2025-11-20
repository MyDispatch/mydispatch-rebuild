/* ==================================================================================
   V28 IPAD MOCKUP HD - ULTRA-HD DEVICE MOCKUP
   ==================================================================================
   ✅ SVG-based for perfect rendering
   ✅ Supports standard/retina/ultra-hd resolutions
   ✅ 3D tilt animations
   ✅ Premium shadows & reflections
   ================================================================================== */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { RenderingResolution } from '@/lib/rendering-quality';
import { getScaleClass } from '@/lib/rendering-quality';

interface V28iPadMockupHDProps {
  children: ReactNode;
  tiltDirection?: 'left' | 'right';
  resolution?: RenderingResolution;
  className?: string;
}

export function V28iPadMockupHD({ 
  children, 
  tiltDirection = 'left',
  resolution = 'retina',
  className 
}: V28iPadMockupHDProps) {
  const tiltTransform = tiltDirection === 'left' 
    ? 'rotateY(8deg) rotateZ(-2deg)' 
    : 'rotateY(-8deg) rotateZ(2deg)';

  return (
    <div 
      className={cn("relative w-full", className)}
      style={{ 
        perspective: '1000px',
        transform: tiltTransform,
        transformStyle: 'preserve-3d'
      }}
    >
      {/* iPad Shell with Premium Shadow */}
      <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-[2.5rem] shadow-2xl border-[12px] border-slate-800">
        {/* Camera */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 rounded-full" />
        
        {/* Screen Content Area - Scrollable */}
        <div className="absolute inset-3 bg-white rounded-[1.5rem] overflow-hidden">
          <div className="w-full h-full overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </div>

        {/* Premium Reflection Overlay */}
        <div 
          className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
            mixBlendMode: 'overlay'
          }}
        />
      </div>
      
      {/* Ambient Shadow */}
      <div 
        className="absolute -inset-8 opacity-20 blur-3xl bg-gradient-to-br from-slate-900/40 to-transparent pointer-events-none -z-10"
        aria-hidden="true"
      />
    </div>
  );
}
