import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import officialLogo from "@/assets/mydispatch-logo-official.png";
import { SEOHead } from "@/components/shared/SEOHead";

export default function DriverSplash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/driver/welcome");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <SEOHead
        title="MyDispatch Fahrer-App"
        description="Willkommen bei der MyDispatch Fahrer-App"
      />
      <div className="min-h-screen bg-portal-fahrer flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Dekorative Elemente */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-32 left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />

        {/* Logo und Illustration */}
        <div className="relative z-10 flex flex-col items-center space-y-8 animate-fade-in">
          {/* MyDispatch Logo */}
          <div className="bg-card/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-border/50">
            <img src={officialLogo} alt="MyDispatch Logo" className="h-16 w-auto object-contain" />
          </div>

          {/* Fahrer Illustration */}
          <div className="relative">
            <div className="w-48 h-48 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-full flex items-center justify-center shadow-xl">
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                className="text-foreground"
              >
                {/* Stylized Driver Icon */}
                <circle cx="60" cy="40" r="18" fill="currentColor" opacity="0.9" />
                <path
                  d="M40 90 C40 75, 45 65, 60 65 C75 65, 80 75, 80 90"
                  fill="currentColor"
                  opacity="0.9"
                />
                <circle cx="60" cy="100" r="8" fill="currentColor" opacity="0.7" />
              </svg>
            </div>

            {/* Pulse Animation */}
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
          </div>

          {/* Loading Indicator */}
          <div className="flex items-center space-x-2 mt-8">
            <div
              className="w-2 h-2 bg-foreground rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-foreground rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-foreground rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 375 100" fill="none" className="w-full">
            <path
              d="M0 50 Q 93.75 20, 187.5 50 T 375 50 V 100 H 0 Z"
              fill="hsl(var(--primary))"
              opacity="0.3"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
