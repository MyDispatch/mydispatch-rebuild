/**
 * SHIFTS PAGE V1.0 (KRONOS Wave 5 - Batch 5A)
 * 
 * Assembliert aus:
 * - StandardListPage Template
 * - useShifts API Hook
 */

import { useState } from 'react';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { StandardListPage, ListColumn, BulkAction } from '@/templates/StandardListPage';
import { useShifts, useDeleteShift } from '@/lib/api/shifts-hooks';
import { formatDate } from '@/lib/data-transformers';
import { toast } from 'sonner';

export function ShiftsPage() {
  const { data: shifts, isLoading } = useShifts();
  const { mutate: deleteShift } = useDeleteShift();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const columns: ListColumn<any>[] = [
    {
      key: 'drivers',
      label: 'Fahrer',
      width: '200px',
      render: (value: any) => 
        value ? `${value.first_name} ${value.last_name}` : '-',
    },
    {
      key: 'vehicles',
      label: 'Fahrzeug',
      width: '200px',
      render: (value: any) => 
        value ? `${value.brand} ${value.model} (${value.license_plate})` : '-',
    },
    {
      key: 'start_time',
      label: 'Start',
      width: '150px',
      render: (value) => formatDate(value as string),
    },
    {
      key: 'end_time',
      label: 'Ende',
      width: '150px',
      render: (value) => value ? formatDate(value as string) : '-',
    },
    {
      key: 'total_hours',
      label: 'Stunden',
      width: '100px',
      render: (value) => value ? `${value}h` : '-',
    },
    {
      key: 'shift_status',
      label: 'Status',
      width: '120px',
      render: (value) => {
        const statuses = {
          scheduled: 'Geplant',
          in_progress: 'Aktiv',
          completed: 'Abgeschlossen',
          cancelled: 'Abgesagt',
        };
        return statuses[value as keyof typeof statuses] || value;
      },
    },
    {
      key: 'approved_by_company',
      label: 'Bestätigt',
      width: '100px',
      render: (value) => value ? '✓' : '-',
    },
  ];

  const handleDelete = (ids: string[]) => {
    ids.forEach((id) => {
      deleteShift(id, {
        onSuccess: () => {
          toast.success('Schicht archiviert');
        },
        onError: () => {
          toast.error('Fehler beim Archivieren');
        },
      });
    });
    setSelectedIds([]);
  };

  const bulkActions: BulkAction[] = [
    {
      label: 'Archivieren',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
      onClick: handleDelete,
    },
  ];

  const kpis = [
    {
      label: 'Gesamt',
      value: shifts?.length || 0,
    },
    {
      label: 'Aktiv',
      value: shifts?.filter((s: any) => s.shift_status === 'in_progress').length || 0,
    },
    {
      label: 'Geplant',
      value: shifts?.filter((s: any) => s.shift_status === 'scheduled').length || 0,
    },
  ];

  const quickActions = [
    {
      label: 'Neue Schicht',
      icon: Plus,
      onClick: () => toast.info('Funktion in Entwicklung'),
    },
    {
      label: 'Kalender',
      icon: Calendar,
      onClick: () => toast.info('Funktion in Entwicklung'),
    },
    {
      label: 'Zeiterfassung',
      icon: Clock,
      onClick: () => toast.info('Funktion in Entwicklung'),
    },
  ];

  return (
    <StandardListPage
      title="Schichten"
      data={shifts || []}
      columns={columns as any}
      isLoading={isLoading}
      kpis={kpis}
      quickActions={quickActions}
      onViewDetail={() => {}}
      dashboardArea="shifts"
      bulkActions={bulkActions}
    />
  );
}
