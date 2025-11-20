/* ==================================================================================
   AUTH VIDEO BACKGROUND - V28.1 PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ V28.1 Professional Gray-Blue Design
   ✅ Subtle Video Background
   ✅ Performance-optimiert
   ================================================================================== */

interface AuthVideoBackgroundProps {
  videoUrl?: string;
  posterUrl?: string;
}

export function AuthVideoBackground({
  videoUrl = "/videos/hero-video.mp4",
  posterUrl = "/images/hero-poster.jpg",
}: AuthVideoBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-slate-50">
      {/* Video Element */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={posterUrl}
        className="absolute inset-0 w-full h-full object-cover brightness-[0.6] opacity-40"
      >
        <source src={videoUrl} type="video/mp4" />
        {/* Fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />
      </video>

      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-slate-100/70 to-slate-50/80" />
    </div>
  );
}
