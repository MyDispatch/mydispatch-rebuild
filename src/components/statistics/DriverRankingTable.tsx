/* ==================================================================================
   Driver Ranking Table - V18.3 Sprint 35
   ==================================================================================
   - Top 10 Fahrer nach Umsatz/Fahrten
   - Badges für Top 3
   - Click-to-Details Navigation
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, TrendingUp } from 'lucide-react';

interface DriverRankingData {
  rank: number;
  driver_id: string;
  name: string;
  avatar?: string;
  rides: number;
  revenue: number;
  rating?: number;
  badge?: string;
}

interface DriverRankingTableProps {
  data: DriverRankingData[];
  onClick?: (driverId: string) => void;
}

export function DriverRankingTable({ data, onClick }: DriverRankingTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: '🏆', variant: 'default' as const, label: 'Top 1' };
    if (rank === 2) return { icon: '🥈', variant: 'secondary' as const, label: 'Top 2' };
    if (rank === 3) return { icon: '🥉', variant: 'secondary' as const, label: 'Top 3' };
    return null;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-foreground" />
            Top 10 Fahrer (Monat)
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Sortiert nach Umsatz
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Fahrer</TableHead>
                <TableHead className="text-right">Fahrten</TableHead>
                <TableHead className="text-right">Umsatz</TableHead>
                <TableHead className="text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    Keine Daten verfügbar
                  </TableCell>
                </TableRow>
              ) : (
                data.map((driver) => {
                  const rankBadge = getRankBadge(driver.rank);
                  return (
                    <TableRow
                      key={driver.driver_id}
                      className={onClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                      onClick={() => onClick?.(driver.driver_id)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1">
                          {driver.rank}
                          {rankBadge && (
                            <span className="text-lg">{rankBadge.icon}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={driver.avatar} alt={driver.name} />
                            <AvatarFallback className="text-xs">
                              {getInitials(driver.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{driver.name}</p>
                            {rankBadge && (
                              <Badge variant={rankBadge.variant} className="text-[10px] mt-0.5">
                                {rankBadge.label}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium">{driver.rides}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-primary">
                          {formatCurrency(driver.revenue)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {driver.rating !== undefined && (
                          <div className="flex items-center justify-end gap-1">
                            <Star className="h-4 w-4 fill-status-warning text-status-warning" />
                            <span className="text-sm font-medium">
                              {driver.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        {onClick && data.length > 0 && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            💡 Klicken Sie auf einen Fahrer für Details
          </p>
        )}
      </CardContent>
    </Card>
  );
}
