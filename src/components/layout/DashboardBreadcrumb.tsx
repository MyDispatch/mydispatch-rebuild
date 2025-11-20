import { useDeviceType } from "@/hooks/use-device-type";
import { Home, ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

export function DashboardBreadcrumb() {
  const { isMobile } = useDeviceType();
  const location = useLocation();

  // Hide breadcrumbs on mobile
  if (isMobile) {
    return null;
  }

  // Get current page name
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentPage = pathSegments[pathSegments.length - 1] || "dashboard";

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      <Link to="/dashboard" className="hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium capitalize">{currentPage}</span>
    </div>
  );
}
