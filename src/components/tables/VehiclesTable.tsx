/* ==================================================================================
   VEHICLES TABLE - V18.3 Multi-Select Component
   ==================================================================================
   Performance-optimiert mit React.memo() für große Datenlisten
   V18.3: Bulk-Selection Support hinzugefügt
   ================================================================================== */

import { memo, useMemo } from 'react';
import { Eye } from 'lucide-react';
import { V28Button } from '@/components/design-system/V28Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusIndicator, getVehicleStatusType } from '@/components/shared/StatusIndicator';
import { getExpiryStatus, getExpiryMessage } from '@/lib/expiry-utils';
import { getVehicleStatusLabel } from '@/lib/vehicle-status-utils'; // ✅ Zentrale Helper
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Vehicle {
  id: string;
  license_plate: string;
  concession_number?: string;
  vehicle_class: 
    | "Economy Class (1-4 Pax)"
    | "Business Class - Limousine (1-4 Pax)"
    | "Business Class - Kombi (1-4 Pax)"
    | "First Class (1-3 Pax)"
    | "Van / SUV (1-8 Pax)";
  status: "available" | "im_einsatz" | "wartung" | "defekt";
  assigned_driver_id?: string;
  driver_name?: string;
  tuev_expiry_date?: string;
  archived: boolean;
  created_at: string;
}

interface VehiclesTableProps {
  vehicles: (Vehicle & { driver_name?: string })[];
  onViewDetails: (vehicle: Vehicle) => void;
  // V18.3: Bulk-Selection Props
  selectedIds?: string[];
  onToggleSelection?: (id: string) => void;
  onToggleSelectAll?: () => void;
  showBulkSelect?: boolean;
}

/**
 * Memoized Vehicles Table Component
 * Verhindert unnötiges Re-Rendering bei großen Datensätzen
 * V18.3: Bulk-Selection Support
 */
export const VehiclesTable = memo(({ 
  vehicles, 
  onViewDetails,
  selectedIds = [],
  onToggleSelection,
  onToggleSelectAll,
  showBulkSelect = false
}: VehiclesTableProps) => {
  // Memoize formatierte Daten
  const formattedVehicles = useMemo(() => {
    return vehicles.map(vehicle => ({
      ...vehicle,
      statusType: getVehicleStatusType(vehicle.status),
      driverName: vehicle.driver_name || 'Nicht zugewiesen',
      statusLabel: getVehicleStatusLabel(vehicle.status), // ✅ Zentrale Helper verwenden
    }));
  }, [vehicles]);

  // Check if all items are selected
  const isAllSelected = vehicles.length > 0 && vehicles.every(v => selectedIds.includes(v.id));
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Keine Fahrzeuge gefunden.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <Table>
        <TableHeader>
          <TableRow>
            {showBulkSelect && onToggleSelectAll && (
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={onToggleSelectAll}
                  className={isSomeSelected && !isAllSelected ? "data-[state=checked]:bg-primary" : ""}
                  aria-label="Alle auswählen"
                />
              </TableHead>
            )}
            <TableHead>Kennzeichen</TableHead>
            <TableHead className="hidden sm:table-cell">P-Schein</TableHead>
            <TableHead className="hidden md:table-cell">Klasse</TableHead>
            <TableHead className="hidden lg:table-cell">Fahrer</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[120px] hidden xl:table-cell">Eingegangen</TableHead>
            <TableHead className="w-[80px] text-center">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formattedVehicles.map((vehicle) => {
            const isSelected = selectedIds.includes(vehicle.id);
            
            return (
              <TableRow 
                key={vehicle.id} 
                className="hover:bg-muted/50"
                data-selected={isSelected}
              >
                {showBulkSelect && onToggleSelection && (
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelection(vehicle.id)}
                      aria-label={`Fahrzeug ${vehicle.license_plate} auswählen`}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">{vehicle.license_plate}</div>
                    {vehicle.tuev_expiry_date && (
                      <div className="text-xs">
                        <StatusIndicator 
                          type={getExpiryStatus(vehicle.tuev_expiry_date)}
                          label={`TÜV: ${getExpiryMessage(vehicle.tuev_expiry_date)}`}
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {vehicle.concession_number || '-'}
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                  {vehicle.vehicle_class}
                </TableCell>
              <TableCell className="hidden lg:table-cell">
                {vehicle.driverName}
              </TableCell>
              <TableCell>
                <StatusIndicator 
                  type={vehicle.statusType}
                  label={vehicle.statusLabel}
                  size="sm"
                />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground hidden xl:table-cell">
                {format(new Date(vehicle.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
              </TableCell>
              <TableCell className="text-center">
                <V28Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onViewDetails(vehicle)}
                  className="h-8 w-8 p-0"
                  aria-label="Fahrzeug ansehen"
                >
                  <Eye className="h-4 w-4" />
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
  return prevProps.vehicles === nextProps.vehicles;
});

VehiclesTable.displayName = 'VehiclesTable';
