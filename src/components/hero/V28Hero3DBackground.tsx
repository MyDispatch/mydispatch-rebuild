/* ==================================================================================
   V28 HERO 3D BACKGROUND - PARALLAX & FLOATING ANIMATION
   ==================================================================================
   ✅ 6-Layer-System mit Tiefenwirkung
   ✅ Mouse-Parallax-Effekt (60fps)
   ✅ Subtile Floating-Animationen
   ✅ Performance-optimiert (will-change, RAF)
   ✅ Accessibility (prefers-reduced-motion)
   ✅ V28.1 Slate-Farben
   ================================================================================== */

import { useEffect, useRef } from "react";

export function V28Hero3DBackground() {
  const layersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Performance Check: Reduced Motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
          const multiplier = (idx + 1) * 8; // 8px, 16px, 24px, 32px, 40px, 48px

          layer.style.transform = `translate3d(${lastX * multiplier}px, ${lastY * multiplier}px, 0)`;
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Layer 1: Base Gradient (statisch) */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-white" />

      {/* Layer 2: Grid Pattern (leichte Parallax) */}
      <div
        ref={(el) => el && (layersRef.current[0] = el)}
        className="parallax-layer absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 L50 50 M50 10 L10 50' stroke='%23334155' stroke-width='1' fill='none' stroke-dasharray='2,2'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Layer 3: Floating Orbs (starke Parallax) */}
      <div
        ref={(el) => el && (layersRef.current[1] = el)}
        className="parallax-layer absolute inset-0"
      >
        {/* Orb 1 - Top Left */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-300/30 rounded-full blur-3xl animate-float-vertical"
          style={{ animationDuration: "8s" }}
        />

        {/* Orb 2 - Bottom Right */}
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-400/25 rounded-full blur-3xl animate-float-horizontal"
          style={{ animationDuration: "12s", animationDelay: "2s" }}
        />

        {/* Orb 3 - Center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-500/20 rounded-full blur-3xl animate-float-vertical"
          style={{ animationDuration: "16s", animationDelay: "4s" }}
        />
      </div>

      {/* Layer 4: Branchen-Icons (mittlere Parallax) */}
      <div
        ref={(el) => el && (layersRef.current[2] = el)}
        className="parallax-layer absolute inset-0"
      >
        {/* Car Icon 1 - Top Right */}
        <div
          className="absolute top-[15%] right-[20%] animate-float-vertical"
          style={{ animationDuration: "10s" }}
        >
          <svg
            className="w-24 h-24 text-slate-400/15 rotate-12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            viewBox="0 0 24 24"
          >
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>

        {/* MapPin Icon - Top Left */}
        <div
          className="absolute top-[40%] left-[10%] animate-float-horizontal"
          style={{ animationDuration: "12s", animationDelay: "2s" }}
        >
          <svg
            className="w-20 h-20 text-slate-400/15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            viewBox="0 0 24 24"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>

        {/* Car Icon 2 - Bottom Right */}
        <div
          className="absolute bottom-[15%] right-[30%] animate-float-vertical"
          style={{ animationDuration: "14s", animationDelay: "6s" }}
        >
          <svg
            className="w-32 h-32 text-slate-300/10 -rotate-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            viewBox="0 0 24 24"
          >
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>
      </div>

      {/* Layer 5: Glow Effects (starke Parallax) */}
      <div
        ref={(el) => el && (layersRef.current[3] = el)}
        className="parallax-layer absolute inset-0"
      >
        {/* Glow Top Left */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-slate-200/60 to-transparent rounded-full blur-3xl" />

        {/* Glow Bottom Right */}
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-radial from-slate-300/50 to-transparent rounded-full blur-3xl" />

        {/* Glow Top Right */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-slate-200/40 to-transparent rounded-full blur-3xl" />

        {/* Glow Bottom Left */}
        <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-gradient-radial from-slate-300/45 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Layer 6: Vignette Overlay (statisch) */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent" />

      {/* Bottom Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/60" />
    </>
  );
}
