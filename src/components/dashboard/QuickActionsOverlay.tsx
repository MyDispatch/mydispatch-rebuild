import { FileText, Users, Car, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/compat';
import { Badge } from '@/lib/compat';
import { V28Button } from '@/components/design-system/V28Button';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib';

interface QuickActionsOverlayProps {
  pendingBookings: number;
  availableDrivers: number;
  availableVehicles: number;
  todayRevenue: number;
}

export function QuickActionsOverlay({
  pendingBookings,
  availableDrivers,
  availableVehicles,
  todayRevenue
}: QuickActionsOverlayProps) {
  const navigate = useNavigate();

  // formatCurrency imported from @/lib

  return (
    <Card className="border shadow-sm h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Schnellzugriff</CardTitle>
          <Badge variant="secondary" className="text-xs">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <V28Button
          variant="secondary"
          className="w-full justify-between"
          onClick={() => navigate('/auftraege?status=pending')}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Offene Aufträge</span>
          </div>
          <Badge variant={pendingBookings > 0 ? "default" : "outline"}>
            {pendingBookings}
          </Badge>
        </V28Button>

        <V28Button
          variant="secondary"
          className="w-full justify-between"
          onClick={() => navigate('/fahrer?status=available')}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Verfügbare Fahrer</span>
          </div>
          <Badge variant="outline" className="bg-status-success/10 text-status-success border-status-success/20">
            {availableDrivers}
          </Badge>
        </V28Button>

        <V28Button
          variant="secondary"
          className="w-full justify-between"
          onClick={() => navigate('/fahrzeuge?status=verfuegbar')}
        >
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Verfügbare Fahrzeuge</span>
          </div>
          <Badge variant="outline" className="bg-status-success/10 text-status-success border-status-success/20">
            {availableVehicles}
          </Badge>
        </V28Button>

        <div className="pt-2 border-t space-y-2">
          <V28Button
            variant="secondary"
            className="w-full justify-between"
            onClick={() => navigate('/schichtzettel')}
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-foreground" />
              <span className="text-sm font-medium text-foreground">Schichtplan</span>
            </div>
          </V28Button>

          <div className="flex items-center justify-between p-3 bg-card rounded-lg border shadow-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-foreground" />
              <span className="text-sm font-medium text-foreground">Umsatz heute</span>
            </div>
            <span className="text-sm font-bold text-foreground">
              {formatCurrency(todayRevenue)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
