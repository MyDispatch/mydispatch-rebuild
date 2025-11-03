/* ==================================================================================
   MOBILE-OPTIMIERTE KUNDEN-ANSICHT V18.3 - MIT GRID-LAYOUT
   ==================================================================================
   Verwendet MobileGridLayout für standardisierte Struktur
   ================================================================================== */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { Plus, Search, Mail, Phone, User, MapPin } from 'lucide-react';
import { MobileGridLayout } from './MobileGridLayout';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/index';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  address?: string;
  is_manually_created: boolean;
  has_portal_access: boolean;
  outstanding_balance?: number;
}

interface MobileKundenProps {
  customers: Customer[];
  isLoading: boolean;
  onCreateNew: () => void;
  onCustomerClick: (customer: Customer) => void;
  onRefresh: () => void;
}

export function MobileKunden({
  customers,
  isLoading,
  onCreateNew,
  onCustomerClick,
  onRefresh
}: MobileKundenProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    // Type filter
    if (activeFilter === 'business' && customer.is_manually_created) return false;
    if (activeFilter === 'manual' && !customer.is_manually_created) return false;
    if (activeFilter === 'portal' && !customer.has_portal_access) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase();
      return (
        fullName.includes(query) ||
        customer.email?.toLowerCase().includes(query) ||
        customer.phone?.toLowerCase().includes(query) ||
        customer.address?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Count by type
  const typeCounts = {
    all: customers.length,
    business: customers.filter(c => !c.is_manually_created).length,
    manual: customers.filter(c => c.is_manually_created).length,
    portal: customers.filter(c => c.has_portal_access).length,
  };

  const filters = [
    { id: 'all', label: 'Alle', count: typeCounts.all },
    { id: 'business', label: 'Geschäft', count: typeCounts.business },
    { id: 'manual', label: 'Manuell', count: typeCounts.manual },
    { id: 'portal', label: 'Portal', count: typeCounts.portal },
  ];

  return (
    <MobileGridLayout<Customer>
      searchPlaceholder="Suchen..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onRefresh={onRefresh}
      isLoading={isLoading}
      filters={filters}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      data={filteredCustomers}
      renderCard={(customer) => (
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {customer.first_name} {customer.last_name}
                    </p>
                    {customer.outstanding_balance && customer.outstanding_balance > 0 && (
                      <Badge variant="destructive" className="text-[10px] mt-1">
                        {formatCurrency(customer.outstanding_balance)} offen
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {customer.is_manually_created && (
                    <Badge variant="secondary" className="text-[10px]">Manuell</Badge>
                  )}
                  {customer.has_portal_access && (
                    <Badge variant="outline" className="text-[10px]">Portal</Badge>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                {customer.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">{customer.address}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      onItemClick={onCustomerClick}
      entityLabel={{ singular: 'Kunde', plural: 'Kunden' }}
      fabLabel="Neuer Kunde"
      onFabClick={onCreateNew}
      fabIcon={Plus}
      emptyStateProps={{
        icon: <Search className="h-16 w-16" />,
        noDataTitle: 'Keine Kunden',
        noDataDescription: 'Erstelle deinen ersten Kunden',
        noResultsTitle: 'Keine Ergebnisse',
        noResultsDescription: 'Versuche einen anderen Suchbegriff'
      }}
    />
  );
}
