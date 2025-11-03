---
to: src/pages/<%= name %>.tsx
---
/* 
 * GOLDEN TEMPLATE - <%= name %>
 * Generated from /rechnungen template
 * Date: <%= new Date().toISOString().split('T')[0] %>
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DashboardPageTemplate } from '@/components/dashboard/DashboardPageTemplate';
import { UniversalExportBar } from '@/components/shared/UniversalExportBar';
import { QuickActionsOverlay } from '@/components/shared/QuickActionsOverlay';

const <%= name %> = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // TODO: Replace with your data fetching logic
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['<%= name.toLowerCase() %>'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('<%= name.toLowerCase() %>')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Generate KPIs (adapt to your data)
  const kpis = [
    {
      label: 'Total Items',
      value: items.length.toString(),
      change: '+0%',
      trend: 'neutral' as const,
    },
  ];

  // Generate Quick Actions
  const quickActions = [
    {
      title: 'Add New',
      description: 'Create new item',
      onClick: () => setIsDialogOpen(true),
      color: 'primary' as const,
    },
  ];

  return (
    <DashboardPageTemplate
      pageTitle="<%= name %>"
      kpis={kpis}
      quickActions={quickActions}
    >
      <div className="space-y-4">
        <UniversalExportBar
          selectedCount={selectedItems.length}
          onExportExcel={() => {}}
          onExportPDF={() => {}}
          onClearSelection={() => setSelectedItems([])}
        />

        {/* TODO: Add your content here */}
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-slate-600">
            Replace this with your <%= name %> content
          </p>
        </div>

        <QuickActionsOverlay actions={quickActions} />
      </div>

      {/* TODO: Add your dialog/form here */}
    </DashboardPageTemplate>
  );
};

export default <%= name %>;
