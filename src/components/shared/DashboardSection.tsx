/* ==================================================================================
   DASHBOARD-SECTION V18.5.1 - STANDARDISIERTER BEREICH
   ==================================================================================
   Einheitlicher Bereich für alle Dashboard-Seiten
   - Zentriertes Icon/Titel/Badge Layout
   - Responsive & Design-System konform
   - Konsistente Abstände
   ================================================================================== */

import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface DashboardSectionProps {
  icon: LucideIcon;
  title: string;
  badge?: string | number;
  children: ReactNode;
}

export function DashboardSection({
  icon: Icon,
  title,
  badge,
  children,
}: DashboardSectionProps) {
  return (
    <Card className="overflow-hidden">
      {/* Header - Zentriert, Icon/Titel/Badge */}
      <div className="flex items-center justify-center gap-3 px-6 py-4 border-b bg-muted/30">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
          <Icon className="h-5 w-5 text-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {badge !== undefined && (
          <Badge variant="secondary" className="ml-1">
            {badge}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </Card>
  );
}
