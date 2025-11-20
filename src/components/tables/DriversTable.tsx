/* ==================================================================================
   DRIVERS TABLE - V18.3 Multi-Select Component
   ==================================================================================
   Performance-optimiert mit React.memo() für große Datenlisten
   V18.3: Bulk-Selection Support hinzugefügt
   ================================================================================== */

import { memo, useMemo } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Eye } from 'lucide-react';
import { V28Button } from '@/components/design-system/V28Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusIndicator, getDriverStatusType } from '@/components/shared/StatusIndicator';
import { getExpiryStatus, getExpiryMessage } from '@/lib/expiry-utils';
import { getShiftStatusLabel } from '@/lib/vehicle-status-utils'; // ✅ Zentrale Helper

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  license_number?: string;
  license_expiry_date?: string;
  shift_status: string;
  total_rides: number;
  archived: boolean;
  created_at: string;
}

interface DriversTableProps {
  drivers: Driver[];
  onViewDetails: (driver: Driver) => void;
  // V18.3: Bulk-Selection Props
  selectedIds?: string[];
  onToggleSelection?: (id: string) => void;
  onToggleSelectAll?: () => void;
  showBulkSelect?: boolean;
}

/**
 * Memoized Drivers Table Component
 * Verhindert unnötiges Re-Rendering bei großen Datensätzen
 * V18.3: Bulk-Selection Support
 */
export const DriversTable = memo(({ 
  drivers, 
  onViewDetails,
  selectedIds = [],
  onToggleSelection,
  onToggleSelectAll,
  showBulkSelect = false
}: DriversTableProps) => {
  // Memoize formatierte Daten
  const formattedDrivers = useMemo(() => {
    return drivers.map(driver => ({
      ...driver,
      fullName: `${driver.first_name} ${driver.last_name}`,
      statusType: getDriverStatusType(driver.shift_status),
    }));
  }, [drivers]);

  // Check if all items are selected
  const isAllSelected = drivers.length > 0 && drivers.every(d => selectedIds.includes(d.id));
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  if (drivers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Keine Fahrer gefunden.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <Table>
        <TableHeader>
          <TableRow>
            {showBulkSelect && onToggleSelectAll && (
              <TableHead className="w-[50px] pl-6">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={onToggleSelectAll}
                  className={isSomeSelected && !isAllSelected ? "data-[state=checked]:bg-primary" : ""}
                  aria-label="Alle auswählen"
                />
              </TableHead>
            )}
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">E-Mail</TableHead>
            <TableHead className="hidden md:table-cell">Telefon</TableHead>
            <TableHead className="hidden lg:table-cell">Führerschein</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[100px] text-center hidden lg:table-cell">Fahrten</TableHead>
            <TableHead className="w-[120px] hidden xl:table-cell">Eingegangen</TableHead>
            <TableHead className="w-[80px] text-center">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formattedDrivers.map((driver) => {
            const isSelected = selectedIds.includes(driver.id);
            
            return (
              <TableRow 
                key={driver.id} 
                className="hover:bg-muted/50"
                data-selected={isSelected}
              >
                {showBulkSelect && onToggleSelection && (
                  <TableCell className="pl-6">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelection(driver.id)}
                      aria-label={`Fahrer ${driver.fullName} auswählen`}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">{driver.fullName}</div>
                    {driver.license_expiry_date && (
                      <div className="text-xs">
                        <StatusIndicator 
                          type={getExpiryStatus(driver.license_expiry_date)}
                          label={getExpiryMessage(driver.license_expiry_date)}
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell max-w-[200px] truncate">
                  {driver.email || '-'}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {driver.phone || '-'}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {driver.license_number || '-'}
                </TableCell>
              <TableCell>
                <StatusIndicator 
                  type={driver.statusType}
                  label={getShiftStatusLabel(driver.shift_status)} // ✅ Zentrale Helper verwenden
                  size="sm"
                />
              </TableCell>
              <TableCell className="text-center hidden lg:table-cell">
                {driver.total_rides}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground hidden xl:table-cell">
                {format(new Date(driver.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
              </TableCell>
              <TableCell className="text-center">
                <V28Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onViewDetails(driver)}
                  className="h-9 w-9 p-0 hover:bg-primary/10 transition-colors"
                  aria-label="Details anzeigen"
                >
                  <Eye className="h-4 w-4 text-foreground" />
                </V28Button>
              </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.drivers === nextProps.drivers;
});

DriversTable.displayName = 'DriversTable';
