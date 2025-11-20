/**
 * ==================================================================================
 * SMART BREADCRUMBS V18.3 Sprint 36 - Context-Aware Navigation
 * ==================================================================================
 * Erweiterte Breadcrumbs mit Entity-Context
 * - Route-basierte Navigation
 * - Entity-Details anzeigen (z.B. "BK-1234 (Max Mustermann)")
 * - Click-to-Navigate mit DetailDialog-Integration
 * - Mobile-optimiert (truncate)
 * 
 * Usage:
 * <SmartBreadcrumbs 
 *   items={[
 *     { label: 'Aufträge', href: '/auftraege' },
 *     { label: 'BK-1234 (Max Mustermann)', isCurrentPage: true }
 *   ]} 
 * />
 * ==================================================================================
 */

import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface SmartBreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function SmartBreadcrumbs({ 
  items, 
  showHome = true,
  className 
}: SmartBreadcrumbsProps) {
  // Keine Breadcrumbs wenn keine Items
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav 
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground mb-6",
        className
      )} 
      aria-label="Breadcrumb"
    >
      {/* Home Link */}
      {showHome && (
        <>
          <Link
            to="/dashboard"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
        </>
      )}

      {/* Breadcrumb Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-2">
            {isLast || item.isCurrentPage ? (
              <span 
                className={cn(
                  "font-medium text-foreground truncate",
                  "max-w-[150px] sm:max-w-[250px] md:max-w-[400px]"
                )}
                title={item.label}
              >
                {item.label}
              </span>
            ) : (
              <>
                <Link
                  to={item.href || '#'}
                  className={cn(
                    "hover:text-foreground transition-colors truncate",
                    "max-w-[150px] sm:max-w-[250px] md:max-w-[400px]"
                  )}
                  title={item.label}
                >
                  {item.label}
                </Link>
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
