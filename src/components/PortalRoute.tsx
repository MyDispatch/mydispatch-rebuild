/* ==================================================================================
   PORTAL ROUTE - PROTECTED ROUTE FÜR KUNDEN-PORTAL
   ==================================================================================
   Prüft Portal-Session (sessionStorage)
   Redirect zu /auth?mode=customer wenn nicht authentifiziert
   ================================================================================== */

import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface PortalRouteProps {
  children: React.ReactNode;
}

export function PortalRoute({ children }: PortalRouteProps) {
  const [loading, setLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    checkPortalAuth();
  }, []);

  const checkPortalAuth = () => {
    const portalMode = sessionStorage.getItem('portal_mode');
    const customerId = sessionStorage.getItem('portal_customer_id');
    
    setIsAuthenticated(!!(portalMode && customerId));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=customer" replace />;
  }

  return <>{children}</>;
}
