/* ==================================================================================
   V28 HERO 3D BACKGROUND CLEAN - OHNE ICONS/SHAPES
   ==================================================================================
   ✅ Nur: Grid + Orbs + Glow + Vignette
   ✅ KEINE Layer 4 Shapes/Icons
   ✅ Minimalistischer, professioneller Look
   ================================================================================== */

import { useEffect, useRef } from 'react';

export function V28Hero3DBackgroundClean() {
  const layersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let rafId: number;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      lastX = x;
      lastY = y;

      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        layersRef.current.forEach((layer, idx) => {
          if (!layer) return;
          const multiplier = (idx + 1) * 8;
          layer.style.transform = `translate3d(${lastX * multiplier}px, ${lastY * multiplier}px, 0)`;
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Layer 1: Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-white" />

      {/* Layer 2: Grid Pattern */}
      <div 
        ref={(el) => el && (layersRef.current[0] = el)}
        className="parallax-layer absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 L50 50 M50 10 L10 50' stroke='%23334155' stroke-width='1' fill='none' stroke-dasharray='2,2'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Layer 3: Floating Orbs */}
      <div ref={(el) => el && (layersRef.current[1] = el)} className="parallax-layer absolute inset-0">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-300/30 rounded-full blur-3xl animate-float-vertical" 
          style={{ animationDuration: '8s' }} 
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-400/25 rounded-full blur-3xl animate-float-horizontal" 
          style={{ animationDuration: '12s', animationDelay: '2s' }} 
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-500/20 rounded-full blur-3xl animate-float-vertical" 
          style={{ animationDuration: '16s', animationDelay: '4s' }} 
        />
      </div>

      {/* Layer 4: REMOVED - No Shapes/Icons */}

      {/* Layer 5: Glow Effects */}
      <div ref={(el) => el && (layersRef.current[2] = el)} className="parallax-layer absolute inset-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-slate-200/60 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-radial from-slate-300/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-slate-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-gradient-radial from-slate-300/45 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Layer 6: Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/60" />
    </>
  );
}
