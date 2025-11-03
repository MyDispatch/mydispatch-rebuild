/**
 * VEHICLES LIST PAGE V1.0 (KRONOS Wave 2 - Batch 1)
 * 
 * Assembliert aus:
 * - StandardListPage Template
 * - useVehicles API Hook
 * - vehiclesStore State
 */

import { useState } from 'react';
import { Plus, Trash2, Wrench } from 'lucide-react';
import { StandardListPage, ListColumn, BulkAction } from '@/templates/StandardListPage';
import { useVehicles } from '@/hooks/use-vehicles';
import { formatDate } from '@/lib/data-transformers';
import type { Tables } from '@/integrations/supabase/types';

type Vehicle = Tables<'vehicles'>;

export function VehiclesListPage() {
  const { vehicles, isLoading } = useVehicles();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const columns: ListColumn<Vehicle>[] = [
    {
      key: 'license_plate',
      label: 'Kennzeichen',
      width: '120px',
    },
    {
      key: 'brand',
      label: 'Marke',
      width: '150px',
    },
    {
      key: 'model',
      label: 'Modell',
      width: '150px',
    },
    {
      key: 'year',
      label: 'Baujahr',
      width: '100px',
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (value) => (
        <span className={`px-2 py-1 text-xs ${
          value === 'available' 
            ? 'bg-green-100 text-green-700' 
            : value === 'wartung'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-slate-100 text-slate-700'
        }`}>
          {value === 'available' ? 'Verfügbar' : value === 'wartung' ? 'Wartung' : 'Im Einsatz'}
        </span>
      ),
    },
  ];

  const bulkActions: BulkAction[] = [
    {
      label: 'Wartung planen',
      icon: <Wrench className="h-4 w-4 mr-2" />,
      onClick: (ids) => console.log('Schedule maintenance:', ids),
      variant: 'default',
    },
    {
      label: 'Löschen',
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      onClick: (ids) => console.log('Delete:', ids),
      variant: 'destructive',
    },
  ];

  const kpis = [
    { label: 'Gesamt', value: vehicles?.length || 0, change: 0 },
    { label: 'Verfügbar', value: vehicles?.filter(v => v.status === 'available').length || 0, change: 0 },
    { label: 'Im Einsatz', value: vehicles?.filter(v => v.status === 'im_einsatz').length || 0, change: 0 },
    { label: 'Wartung', value: vehicles?.filter(v => v.status === 'wartung').length || 0, change: 0 },
  ];

  const quickActions = [
    {
      label: 'Neues Fahrzeug',
      icon: Plus,
      onClick: () => console.log('New vehicle'),
    },
  ];

  return (
    <StandardListPage
      title="Fahrzeuge"
      subtitle="Alle Fahrzeuge verwalten"
      kpis={kpis}
      data={vehicles || []}
      columns={columns}
      isLoading={isLoading}
      onCreateNew={() => console.log('Create new')}
      onViewDetail={(vehicle) => console.log('View:', vehicle.id)}
      bulkActions={bulkActions}
      dashboardArea="vehicles"
      quickActions={quickActions}
      onExport={(format) => console.log('Export:', format)}
    />
  );
}
