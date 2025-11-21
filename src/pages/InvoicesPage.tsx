/**
 * INVOICES PAGE V1.0 (KRONOS Wave 5 - Batch 5A)
 * 
 * Assembliert aus:
 * - StandardListPage Template
 * - useInvoices API Hook
 */

import { useState } from 'react';
import { Plus, Trash2, Mail, Download } from 'lucide-react';
import type { ListColumn, BulkAction } from '@/templates/StandardListPage';
import { StandardListPage } from '@/templates/StandardListPage';
import { useInvoices, useDeleteInvoice } from '@/lib/api/invoices-hooks';
import { formatDate, formatCurrency } from '@/lib/data-transformers';
import { toast } from 'sonner';

export function InvoicesPage() {
  const { data: invoices, isLoading } = useInvoices();
  const { mutate: deleteInvoice } = useDeleteInvoice();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const columns: ListColumn<any>[] = [
    {
      key: 'invoice_number',
      label: 'Rechnungsnr.',
      width: '150px',
    },
    {
      key: 'customers',
      label: 'Kunde',
      width: '200px',
      render: (value: any) => value?.name || '-',
    },
    {
      key: 'total_amount',
      label: 'Betrag',
      width: '120px',
      render: (value) => formatCurrency(value as number),
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (value) => {
        const statuses = {
          draft: 'Entwurf',
          sent: 'Versendet',
          paid: 'Bezahlt',
          overdue: 'Überfällig',
          cancelled: 'Storniert',
        };
        return statuses[value as keyof typeof statuses] || value;
      },
    },
    {
      key: 'invoice_date',
      label: 'Rechnungsdatum',
      width: '130px',
      render: (value) => formatDate(value as string),
    },
    {
      key: 'due_date',
      label: 'Fällig am',
      width: '130px',
      render: (value) => value ? formatDate(value as string) : '-',
    },
    {
      key: 'created_at',
      label: 'Erstellt',
      width: '120px',
      render: (value) => formatDate(value as string),
    },
  ];

  const handleDelete = (ids: string[]) => {
    ids.forEach((id) => {
      deleteInvoice(id, {
        onSuccess: () => {
          toast.success('Rechnung gelöscht');
        },
        onError: () => {
          toast.error('Fehler beim Löschen');
        },
      });
    });
    setSelectedIds([]);
  };

  const bulkActions: BulkAction[] = [
    {
      label: 'Löschen',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
      onClick: handleDelete,
    },
  ];

  const kpis = [
    {
      label: 'Gesamt',
      value: invoices?.length || 0,
    },
    {
      label: 'Offen',
      value: invoices?.filter((i) => i.status === 'sent').length || 0,
    },
    {
      label: 'Bezahlt',
      value: invoices?.filter((i) => i.status === 'paid').length || 0,
    },
  ];

  const quickActions = [
    {
      label: 'Neue Rechnung',
      icon: Plus,
      onClick: () => toast.info('Funktion in Entwicklung'),
    },
    {
      label: 'E-Mail senden',
      icon: Mail,
      onClick: () => toast.info('Funktion in Entwicklung'),
    },
    {
      label: 'Export',
      icon: Download,
      onClick: () => toast.info('Funktion in Entwicklung'),
    },
  ];

  return (
    <StandardListPage
      title="Rechnungen"
      data={invoices || []}
      columns={columns as any}
      isLoading={isLoading}
      kpis={kpis}
      quickActions={quickActions}
      onViewDetail={() => {}}
      dashboardArea="invoices"
      bulkActions={bulkActions}
    />
  );
}
