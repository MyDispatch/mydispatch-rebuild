import * as React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { logger } from "@/lib/logger";
import { LoadingPage } from "@/components/shared/LoadingPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  // CRITICAL V18.3.30: Defensive Auth Hook Call with Error Boundary
  let authState;
  try {
    authState = useAuth();
  } catch (error) {
    // Fallback: Redirect to login if AuthProvider missing
    logger.error("[ProtectedRoute] useAuth failed", error as Error, {
      component: "ProtectedRoute",
    });
    return <Navigate to="/auth" replace />;
  }

  const { user, loading, roles } = authState;

  if (loading) {
    return <LoadingPage message="Authentifizierung wird geprüft..." />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && !roles.includes(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Zugriff verweigert</h1>
          <p className="text-muted-foreground">
            Sie haben nicht die erforderlichen Berechtigungen für diese Seite.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
