import { Navigate, Outlet, useLocation } from "react-router-dom";

import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { useAuthStore } from "@/stores/authStore";

export function ProtectedRoute() {
  const location = useLocation();
  const session = useAuthStore((state) => state.session);
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

  if (isBootstrapping) {
    return <FullScreenLoader message="Initialisiere Sicherheitskontext" />;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
