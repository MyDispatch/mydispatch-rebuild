/* ==================================================================================
   Mobile Statistiken Component - V18.3.17 Sprint 41
   ==================================================================================
   - Vereinfachte KPI-Cards für Mobile
   - Bar-Charts statt komplexe Line-Charts
   - Tabellen als Card-Listen
   - Export-Buttons prominent
   ================================================================================== */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { Download, TrendingUp, Users, Trophy, Handshake } from 'lucide-react';
import { StatCard } from '@/components/smart-templates/StatCard';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/index';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MobileStatistikenProps {
  stats: {
    totalRevenue: number;
    completedBookings: number;
    totalDrivers: number;
    utilization: number;
  };
  topDrivers: Array<{
    rank: number;
    driver_id: string;
    name: string;
    avatar?: string;
    rides: number;
    revenue: number;
    rating: number;
    badge?: string;
  }>;
  partnerPerformance: Array<{
    partner_id: string;
    name: string;
    bookings: number;
    revenue: number;
    provision: number;
    provisionRate: number;
    trend: string;
  }>;
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    bookings: number;
  }>;
  onPDFExport: () => void;
  onExcelExport: () => void;
}

export function MobileStatistiken({
  stats,
  topDrivers,
  partnerPerformance,
  dailyRevenue,
  onPDFExport,
  onExcelExport,
}: MobileStatistikenProps) {
  const navigate = useNavigate();

  // Removed: Using central formatCurrency from @/lib/index

  // Berechne letzte 7 Tage für Mini-Chart
  const last7Days = dailyRevenue.slice(-7);
  const maxRevenue = Math.max(...last7Days.map(d => d.revenue));

  return (
    <div className="space-y-6 pb-6">
      {/* Header mit Export-Buttons */}
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-bold">Statistiken</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Erweiterte Auswertungen und Berichte
          </p>
        </div>
        <div className="flex gap-2">
          <V28Button 
            variant="secondary" 
            size="sm" 
            onClick={onPDFExport}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </V28Button>
          <V28Button 
            variant="secondary" 
            size="sm" 
            onClick={onExcelExport}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Excel
          </V28Button>
        </div>
      </div>

      {/* KPI Cards - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Umsatz (Monat)"
          value={formatCurrency(stats.totalRevenue)}
          icon={TrendingUp}
          change={{ value: 12, trend: 'up' }}
        />
        <StatCard
          label="Aufträge"
          value={stats.completedBookings.toString()}
          icon={TrendingUp}
          change={{ value: 8, trend: 'up' }}
        />
        <StatCard
          label="Aktive Fahrer"
          value={stats.totalDrivers.toString()}
          icon={Users}
          change={{ value: 2, trend: 'up' }}
        />
        <StatCard
          label="Auslastung"
          value={`${stats.utilization}%`}
          icon={TrendingUp}
          change={{ value: 5, trend: 'up' }}
        />
      </div>

      {/* Umsatz letzte 7 Tage - Vereinfachter Bar-Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-foreground" />
            Umsatz (letzte 7 Tage)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {last7Days.map((day, index) => {
              const percentage = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              const dayName = new Date(day.date).toLocaleDateString('de-DE', { 
                weekday: 'short',
                day: '2-digit',
                month: '2-digit'
              });

              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{dayName}</span>
                    <span className="font-medium">{formatCurrency(day.revenue)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {day.bookings} Fahrten
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top 5 Fahrer - Card-Liste */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4 text-foreground" />
            Top 5 Fahrer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {topDrivers.slice(0, 5).map((driver) => (
              <div
                key={driver.driver_id}
                onClick={() => navigate(`/fahrer?id=${driver.driver_id}`)}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 active:bg-muted/50 transition-colors touch-manipulation"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={driver.avatar} />
                    <AvatarFallback className="bg-primary/10 text-foreground">
                      {driver.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {driver.badge && (
                    <div className="absolute -top-1 -right-1 text-lg">
                      {driver.badge}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {driver.name}
                    </span>
                    <Badge variant="outline" className="text-xs shrink-0">
                      #{driver.rank}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{driver.rides} Fahrten</span>
                    <span>•</span>
                    <span>{formatCurrency(driver.revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {topDrivers.length > 5 && (
            <V28Button
              variant="secondary"
              size="sm"
              className="w-full mt-3"
              onClick={() => navigate('/fahrer')}
            >
              Alle Fahrer anzeigen
            </V28Button>
          )}
        </CardContent>
      </Card>

      {/* Partner-Performance - Card-Liste */}
      {partnerPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Handshake className="h-4 w-4 text-foreground" />
              Partner-Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {partnerPerformance.slice(0, 5).map((partner) => (
                <div
                  key={partner.partner_id}
                  onClick={() => navigate(`/partner?id=${partner.partner_id}`)}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 active:bg-muted/50 transition-colors touch-manipulation"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {partner.name}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{partner.bookings} Aufträge</span>
                      <span>•</span>
                      <span>{partner.provisionRate}% Provision</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-medium">
                      {formatCurrency(partner.revenue)}
                    </div>
                    <div className={cn(
                      "text-xs font-medium",
                      partner.trend.startsWith('+') ? "text-status-success" : "text-status-error"
                    )}>
                      {partner.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {partnerPerformance.length > 5 && (
              <V28Button
                variant="secondary"
                size="sm"
                className="w-full mt-3"
                onClick={() => navigate('/partner')}
              >
                Alle Partner anzeigen
              </V28Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info Card - Vollständiger Report */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <TrendingUp className="h-10 w-10 mx-auto text-foreground" />
            <h3 className="font-semibold text-sm">Detaillierte Berichte</h3>
            <p className="text-xs text-muted-foreground">
              Für ausführliche Statistiken und erweiterte Analysen nutzen Sie bitte die Desktop-Version.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
