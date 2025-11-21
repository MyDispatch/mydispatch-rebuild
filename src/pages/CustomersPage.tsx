/**
 * CUSTOMERS PAGE V1.0 (KRONOS Wave 5 - Batch 5A)
 * 
 * Assembliert aus:
 * - StandardListPage Template
 * - useCustomers API Hook
 */

import { useState } from 'react';
import { Plus, Trash2, Mail, Phone } from 'lucide-react';
import type { ListColumn, BulkAction } from '@/templates/StandardListPage';
import { StandardListPage } from '@/templates/StandardListPage';
import { useCustomers } from '@/hooks/use-customers';
import { formatDate } from '@/lib/data-transformers';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Customer = Tables<'customers'>;

export function CustomersPage() {
  const { customers, isLoading, archiveCustomer } = useCustomers();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const columns: ListColumn<Customer>[] = [
    {
      key: 'customer_name' as any,
      label: 'Name',
      width: '200px',
    },
    {
      key: 'email',
      label: 'E-Mail',
      width: '200px',
      render: (value) => value || '-',
    },
    {
      key: 'phone',
      label: 'Telefon',
      width: '150px',
      render: (value) => value || '-',
    },
    {
      key: 'city',
      label: 'Stadt',
      width: '150px',
      render: (value) => value || '-',
    },
    {
      key: 'postal_code',
      label: 'PLZ',
      width: '100px',
      render: (value) => value || '-',
    },
    {
      key: 'customer_type',
      label: 'Typ',
      width: '120px',
      render: (value) => {
        const types = {
          private: 'Privat',
          business: 'Geschäftlich',
        };
        return types[value as keyof typeof types] || value;
      },
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
      archiveCustomer(id);
    });
    toast.success('Kunden archiviert');
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
      value: customers?.length || 0,
    },
    {
      label: 'Geschäftskunden',
      value: customers?.filter((c) => c.customer_type === 'business').length || 0,
    },
    {
      label: 'Privatkunden',
      value: customers?.filter((c) => c.customer_type === 'private').length || 0,
    },
  ];

  const quickActions = [
    {
      label: 'Neuer Kunde',
      icon: Plus,
      onClick: () => toast.info('Funktion in Entwicklung'),
    },
    {
      label: 'E-Mail senden',
      icon: Mail,
      onClick: () => toast.info('Funktion in Entwicklung'),
    },
    {
      label: 'Anrufen',
      icon: Phone,
      onClick: () => toast.info('Funktion in Entwicklung'),
    },
  ];

  return (
    <StandardListPage
      title="Kunden"
      data={customers || []}
      columns={columns as any}
      isLoading={isLoading}
      kpis={kpis}
      quickActions={quickActions}
      onViewDetail={() => {}}
      dashboardArea="customers"
      bulkActions={bulkActions}
    />
  );
}
