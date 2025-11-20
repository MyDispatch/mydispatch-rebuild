import { V28Button } from '@/components/design-system/V28Button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface MobileFilterBarProps {
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export function MobileFilterBar({ filters, activeFilter, onFilterChange }: MobileFilterBarProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {filters.map(filter => (
        <V28Button
          key={filter.id}
          size="sm"
          variant={activeFilter === filter.id ? 'primary' : 'secondary'}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "w-full touch-manipulation min-h-[44px] h-11 px-4",
            "flex items-center justify-between group",
            activeFilter === filter.id && "shadow-md"
          )}
        >
          <span className="text-sm font-medium">{filter.label}</span>
          {filter.count !== undefined && (
            <Badge 
              variant={activeFilter === filter.id ? 'secondary' : 'outline'}
              className={cn(
                "ml-auto",
                "group-hover:bg-primary group-hover:text-foreground"
              )}
            >
              {filter.count}
            </Badge>
          )}
        </V28Button>
      ))}
    </div>
  );
}
