/* ==================================================================================
   V28 HERO BACKGROUND - PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ Slate-Gradient statt Dunkelblau/Beige
   ✅ Subtile Grid-Pattern (statisch)
   ✅ Soft Radial Glow (keine Animation)
   ✅ Clean & B2B-geeignet
   ================================================================================== */

export function V28HeroBackground() {
  return (
    <>
      {/* Slate Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />

      {/* Taxi-Route Pattern - Subtle Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 L50 50 M50 10 L10 50' stroke='%23334155' stroke-width='1' fill='none' stroke-dasharray='2,2'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Animated Orbs */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-200/30 rounded-full blur-3xl animate-pulse" 
        style={{ animationDuration: '8s' }} 
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-200/30 rounded-full blur-3xl animate-pulse" 
        style={{ animationDuration: '12s', animationDelay: '2s' }} 
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent" />
    </>
  );
}
