/* ==================================================================================
   V28 iPAD MOCKUP - PREMIUM 3D-TILTED DEVICE FRAME
   ==================================================================================
   ✅ iPad Pro 12.9" Frame (realistisch)
   ✅ 3D-Transform: rotateY(15deg) rotateX(5deg) (leicht nach rechts gekippt)
   ✅ Schatten & Glows für Tiefe
   ✅ Gestochenscharfe Bildqualität (scale(1))
   ✅ V28.1 Design System Compliance
   ================================================================================== */

import type { ReactNode } from 'react';

interface V28iPadMockupProps {
  children: ReactNode;
  className?: string;
  tiltDirection?: 'left' | 'right';
}

export function V28iPadMockup({ 
  children, 
  className = '',
  tiltDirection = 'left'
}: V28iPadMockupProps) {
  const transform3D = tiltDirection === 'left'
    ? 'rotateY(-8deg) rotateX(2deg) translateZ(0)'
    : 'rotateY(8deg) rotateX(2deg) translateZ(0)';

  return (
    <div 
      className={`relative ${className}`}
      style={{
        perspective: '2000px',
      }}
    >
      {/* iPad-Container mit 3D-Transform */}
      <div
        className="relative transform transition-transform duration-500 hover:scale-[1.03]"
        style={{
          transform: transform3D,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
        role="img"
        aria-label="MyDispatch Dashboard Vorschau auf iPad Pro"
      >
        {/* iPad Frame */}
        <div className="relative rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl ring-1 ring-slate-700">
          {/* Screen */}
          <div className="relative rounded-[1.75rem] overflow-hidden bg-white shadow-inner">
            {/* Dashboard Content */}
            <div className="relative z-10">
              {children}
            </div>
          </div>

          {/* Home Button (unten mittig) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-slate-700 bg-slate-800" />

          {/* Camera (oben mittig) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-700 ring-2 ring-slate-600" />
        </div>

        {/* Glow-Effekte für Tiefe (3 Layers) */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-400/20 to-transparent rounded-[2.5rem] pointer-events-none -z-10 blur-xl" />
        <div className="absolute -inset-4 bg-gradient-to-b from-slate-300/10 to-transparent rounded-[3rem] pointer-events-none -z-20 blur-2xl" />
        <div className="absolute -inset-8 bg-gradient-to-t from-slate-200/5 to-transparent rounded-[4rem] pointer-events-none -z-30 blur-3xl" />
      </div>
    </div>
  );
}
