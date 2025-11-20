/* ==================================================================================
   KRITISCHER HINWEIS: NotFound - DESIGN/LAYOUT FINAL V18.3.25!
   ==================================================================================
   - 100% Semantic Tokens (bg-primary/30, text-foreground)
   - Mobile-optimiert (min-h-[44px] Touch-Targets)
   - Dark/Light Mode kompatibel
   ================================================================================== */

import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { V28Button } from "@/components/design-system/V28Button";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 404 tracking via logger, no console.error needed
  useEffect(() => {
    // Error is logged automatically by router
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-primary/30">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl sm:text-8xl font-bold text-foreground">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
          Seite nicht gefunden
        </h2>
        <p className="text-muted-foreground">
          Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <V28Button
            className="min-h-[44px]"
            variant="primary"
            onClick={() => navigate('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Zur Startseite
          </V28Button>
          <V28Button
            variant="secondary"
            onClick={() => window.history.back()}
            className="min-h-[44px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </V28Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
