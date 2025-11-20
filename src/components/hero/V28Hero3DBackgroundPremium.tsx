/* ==================================================================================
   V28 HERO 3D BACKGROUND PREMIUM - TAXI-SPEZIFISCHE ELEMENTE
   ==================================================================================
   ✅ KEINE abstrakten Geometrie-Shapes (Dreiecke/Quadrate)
   ✅ 100% Taxi-Branchen-Elemente (Fahrzeuge, Routen, Standorte)
   ✅ Straßennetz-Pattern statt einfaches Grid
   ✅ Premium Glow-Effekte
   ✅ Mouse-Parallax + Floating Animationen
   ✅ V28.1 Slate-Farben
   ================================================================================== */

import { useEffect, useRef } from 'react';

export function V28Hero3DBackgroundPremium() {
  const layersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Performance Check: Reduced Motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Throttle Mouse Move für 60fps
    let rafId: number;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1 range
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      lastX = x;
      lastY = y;

      // Request Animation Frame für smooth updates
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        layersRef.current.forEach((layer, idx) => {
          if (!layer) return;
          
          // Layer-spezifische Multiplikatoren (je tiefer, desto stärker)
          const multiplier = (idx + 1) * 10; // 10px, 20px, 30px, 40px, 50px
          
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
      {/* Layer 1: Base Gradient - Von Oben (Slate) nach Unten (White) */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-slate-50 to-white" />

      {/* Layer 2: Straßennetz-Pattern (statt einfaches Grid) */}
      <div 
        ref={(el) => el && (layersRef.current[0] = el)}
        className="parallax-layer absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 H100 M50 0 V100 M25 25 L75 75 M75 25 L25 75' stroke='%23334155' stroke-width='1.5' fill='none' stroke-dasharray='8,4'/%3E%3Ccircle cx='50' cy='50' r='3' fill='%23334155'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}
      />

      {/* Layer 3: Premium Floating Orbs (verstärkt) */}
      <div ref={(el) => el && (layersRef.current[1] = el)} className="parallax-layer absolute inset-0">
        {/* Orb 1 - Top Left */}
        <div 
          className="absolute top-[15%] left-[15%] w-[450px] h-[450px] bg-slate-300/35 rounded-full blur-3xl animate-float-vertical" 
          style={{ animationDuration: '8s' }} 
        />
        
        {/* Orb 2 - Bottom Right */}
        <div 
          className="absolute bottom-[10%] right-[10%] w-[550px] h-[550px] bg-slate-400/30 rounded-full blur-3xl animate-float-horizontal" 
          style={{ animationDuration: '12s', animationDelay: '2s' }} 
        />
        
        {/* Orb 3 - Center */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-slate-500/25 rounded-full blur-3xl animate-float-vertical" 
          style={{ animationDuration: '16s', animationDelay: '4s' }} 
        />
      </div>

      {/* Layer 4: Taxi-Spezifische Elemente - KEINE Geometrie! */}
      <div ref={(el) => el && (layersRef.current[2] = el)} className="parallax-layer absolute inset-0">
        {/* Taxi Silhouette 1 - Top Right */}
        <div 
          className="absolute top-[12%] right-[15%] animate-float-horizontal" 
          style={{ animationDuration: '10s' }}
        >
          <svg className="w-28 h-28 text-slate-400/20 rotate-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2M7 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
          </svg>
        </div>
        
        {/* MapPin Cluster - Top Left */}
        <div 
          className="hidden md:block absolute top-[35%] left-[8%] animate-float-vertical" 
          style={{ animationDuration: '12s', animationDelay: '2s' }}
        >
          <svg className="w-24 h-24 text-slate-400/18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" fill="white" />
          </svg>
        </div>
        
        {/* Routenlinie SVG - Mitte Links */}
        <div 
          className="hidden md:block absolute top-[50%] left-[12%] w-40 h-40 animate-float-horizontal opacity-25"
          style={{ animationDuration: '14s', animationDelay: '1s' }}
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-slate-600">
            <path 
              d="M10 10 Q30 50 50 50 T90 90" 
              strokeWidth="2" 
              strokeDasharray="4,4"
              strokeLinecap="round"
            />
            <circle cx="10" cy="10" r="4" fill="currentColor" />
            <circle cx="50" cy="50" r="4" fill="currentColor" />
            <circle cx="90" cy="90" r="4" fill="currentColor" />
          </svg>
        </div>
        
        {/* Taxi Silhouette 2 - Unten Rechts */}
        <div 
          className="absolute bottom-[18%] right-[25%] animate-float-vertical" 
          style={{ animationDuration: '15s', animationDelay: '6s' }}
        >
          <svg className="w-36 h-36 text-slate-300/15 -rotate-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2M7 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
          </svg>
        </div>

        {/* MapPin Icon - Unten Links */}
        <div 
          className="hidden md:block absolute bottom-[25%] left-[20%] animate-float-horizontal" 
          style={{ animationDuration: '11s', animationDelay: '3s' }}
        >
          <svg className="w-20 h-20 text-slate-500/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" fill="white" />
          </svg>
        </div>

        {/* Routenlinie SVG 2 - Unten Mitte */}
        <div 
          className="absolute bottom-[15%] left-[45%] w-32 h-32 animate-float-vertical opacity-20"
          style={{ animationDuration: '13s', animationDelay: '4s' }}
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-slate-700">
            <path 
              d="M20 80 Q40 40 60 50 T90 20" 
              strokeWidth="2.5" 
              strokeDasharray="6,3"
              strokeLinecap="round"
            />
            <circle cx="20" cy="80" r="5" fill="currentColor" />
            <circle cx="60" cy="50" r="5" fill="currentColor" />
            <circle cx="90" cy="20" r="5" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Layer 5: Premium Glow Effects (VERSTÄRKT) */}
      <div ref={(el) => el && (layersRef.current[3] = el)} className="parallax-layer absolute inset-0">
        {/* Glow Top Left */}
        <div 
          className="absolute top-0 left-0 w-[700px] h-[700px] bg-gradient-radial from-slate-200/70 to-transparent rounded-full blur-3xl"
        />
        
        {/* Glow Bottom Right */}
        <div 
          className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-slate-300/60 to-transparent rounded-full blur-3xl"
        />
        
        {/* Glow Top Right */}
        <div 
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-slate-200/50 to-transparent rounded-full blur-3xl"
        />
        
        {/* Glow Bottom Left */}
        <div 
          className="absolute bottom-0 left-0 w-[650px] h-[650px] bg-gradient-radial from-slate-300/55 to-transparent rounded-full blur-3xl"
        />

        {/* Center Premium Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-radial from-slate-400/40 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Layer 6: Vignette Overlay - Top to Bottom Transition */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent" />
      
      {/* Bottom Vignette - Weißer Übergang */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80" />
    </>
  );
}