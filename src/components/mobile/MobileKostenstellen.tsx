/* ==================================================================================
   MOBILE-OPTIMIERTE KOSTENSTELLEN-ANSICHT V18.3 - MIT GRID-LAYOUT
   ==================================================================================
   Verwendet MobileGridLayout für standardisierte Struktur
   ================================================================================== */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Building2, AlertCircle } from 'lucide-react';
import { MobileGridLayout } from './MobileGridLayout';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { formatCurrency, roundTo } from '@/lib/index';

interface CostCenter {
  id: string;
  name: string;
  description?: string;
  budget?: number;
  spent?: number;
  active: boolean;
  created_at: string;
}

interface MobileKostenstellenProps {
  costCenters: CostCenter[];
  isLoading: boolean;
  onCreateNew: () => void;
  onCostCenterClick: (costCenter: CostCenter) => void;
  onRefresh: () => void;
}

export function MobileKostenstellen({
  costCenters,
  isLoading,
  onCreateNew,
  onCostCenterClick,
  onRefresh
}: MobileKostenstellenProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCostCenters = costCenters.filter(cc => {
    if (activeFilter === 'active' && !cc.active) return false;
    if (activeFilter === 'inactive' && cc.active) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        cc.name.toLowerCase().includes(query) ||
        cc.description?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const activeCount = costCenters.filter(cc => cc.active).length;
  const inactiveCount = costCenters.filter(cc => !cc.active).length;

  const filters = [
    { id: 'all', label: 'Alle', count: costCenters.length },
    { id: 'active', label: 'Aktiv', count: activeCount },
    { id: 'inactive', label: 'Inaktiv', count: inactiveCount },
  ];

  // Removed: Using central formatCurrency from @/lib/index

  const getBudgetPercentage = (spent: number, budget: number) => {
    if (!budget || budget === 0) return 0;
    return Math.min((spent / budget) * 100, 100);
  };

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = getBudgetPercentage(spent, budget);
    if (percentage >= 100) return 'error';
    if (percentage >= 80) return 'warning';
    return 'success';
  };

  return (
    <MobileGridLayout<CostCenter>
      searchPlaceholder="Suchen..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onRefresh={onRefresh}
      isLoading={isLoading}
      filters={filters}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      data={filteredCostCenters}
      renderCard={(cc) => {
        const spent = cc.spent || 0;
        const budget = cc.budget || 0;
        const percentage = getBudgetPercentage(spent, budget);
        const status = getBudgetStatus(spent, budget);
        
        return (
          <Card className="cursor-pointer hover:bg-primary/5 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-base flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-foreground" />
                    {cc.name}
                  </h3>
                  {cc.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {cc.description}
                    </p>
                  )}
                </div>
                <Badge variant={cc.active ? 'default' : 'outline'}>
                  {cc.active ? 'Aktiv' : 'Inaktiv'}
                </Badge>
              </div>

              {budget > 0 && (
                <>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium">{formatCurrency(budget)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Verbraucht</span>
                      <span className={cn(
                        "font-semibold",
                        status === 'error' && "text-destructive",
                        status === 'warning' && "text-status-warning",
                        status === 'success' && "text-status-success"
                      )}>
                        {formatCurrency(spent)}
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={cn(
                        "h-2",
                        status === 'error' && "[&>div]:bg-destructive",
                        status === 'warning' && "[&>div]:bg-status-warning"
                      )}
                    />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {roundTo(percentage, 1)}% verbraucht
                      </span>
                      <span className="text-muted-foreground">
                        {formatCurrency(budget - spent)} übrig
                      </span>
                    </div>
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded text-xs text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>Budget überschritten!</span>
                    </div>
                  )}
                  {status === 'warning' && (
                    <div className="flex items-center gap-2 p-2 bg-status-warning/10 rounded text-xs text-muted-foreground">
                      <AlertCircle className="h-4 w-4 shrink-0 text-foreground" />
                      <span>Budget bald erschöpft</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        );
      }}
      onItemClick={onCostCenterClick}
      entityLabel={{ singular: 'Kostenstelle', plural: 'Kostenstellen' }}
      fabLabel="Neue Kostenstelle"
      onFabClick={onCreateNew}
      fabIcon={Plus}
      emptyStateProps={{
        icon: <Search className="h-16 w-16" />,
        noDataTitle: 'Keine Kostenstellen',
        noDataDescription: 'Erstelle deine erste Kostenstelle',
        noResultsTitle: 'Keine Ergebnisse',
        noResultsDescription: 'Versuche einen anderen Suchbegriff'
      }}
    />
  );
}
