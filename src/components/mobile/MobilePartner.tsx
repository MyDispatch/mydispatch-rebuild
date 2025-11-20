/* ==================================================================================
   MOBILE-OPTIMIERTE PARTNER-ANSICHT V18.3
   ==================================================================================
   Standard-Pattern:
   - Vertikale Filter-Buttons (w-full)
   - Card-basierte Liste
   - FAB für "Neuen Partner"
   - Touch-optimiert (min-h-[44px])
   ================================================================================== */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { Plus, Search, RefreshCw, Eye, Handshake, Network, Mail, Phone } from 'lucide-react';
import { MobileFilterBar } from './MobileFilterBar';
import { Input } from '@/lib/compat';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusIndicator, getPartnerStatusType } from '@/components/shared/StatusIndicator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/index';

interface Partner {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  provision_amount: number;
  online_access_enabled: boolean;
  created_at: string;
}

interface MobilePartnerProps {
  partners: Partner[];
  isLoading: boolean;
  onCreateNew: () => void;
  onPartnerClick: (partner: Partner) => void;
  onRefresh: () => void;
}

export function MobilePartner({
  partners,
  isLoading,
  onCreateNew,
  onPartnerClick,
  onRefresh
}: MobilePartnerProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredPartners = partners.filter(partner => {
    // Status filter
    if (activeFilter === 'active' && !partner.online_access_enabled) return false;
    if (activeFilter === 'inactive' && partner.online_access_enabled) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        partner.name?.toLowerCase().includes(query) ||
        partner.email?.toLowerCase().includes(query) ||
        partner.phone?.includes(query)
      );
    }

    return true;
  });

  // Count by status
  const statusCounts = {
    all: partners.length,
    active: partners.filter(p => p.online_access_enabled).length,
    inactive: partners.filter(p => !p.online_access_enabled).length,
  };

  const filters = [
    { id: 'all', label: 'Alle', count: statusCounts.all },
    { id: 'active', label: 'Aktiv', count: statusCounts.active },
    { id: 'inactive', label: 'Inaktiv', count: statusCounts.inactive },
  ];

  // Removed: Using central formatCurrency from @/lib/index

  return (
    <div className="space-y-6">
      {/* Search + Refresh */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Partner suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11"
          />
        </div>
        <V28Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-11 w-11 shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </V28Button>
      </div>

      {/* Vertical Filter Bar */}
      <MobileFilterBar
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-medium text-muted-foreground">
          {filteredPartners.length} Partner
        </span>
      </div>

      {/* Partner List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-32 bg-muted rounded" />
            </Card>
          ))}
        </div>
      ) : filteredPartners.length > 0 ? (
        <div className="space-y-4">
          {filteredPartners.map(partner => (
            <Card 
              key={partner.id} 
              className="cursor-pointer hover:bg-primary/5 transition-colors"
              onClick={() => onPartnerClick(partner)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-3">
                  <CardTitle className="text-lg">{partner.name}</CardTitle>
                  <StatusIndicator
                    type={getPartnerStatusType(partner.online_access_enabled)}
                    label={partner.online_access_enabled ? 'Online' : 'Offline'}
                    size="sm"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Contact Info */}
                {partner.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground break-all">{partner.email}</span>
                  </div>
                )}
                {partner.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">{partner.phone}</span>
                  </div>
                )}

                {/* Provision */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Provision:</span>
                  <Badge variant="secondary" className="font-semibold">
                    {formatCurrency(partner.provision_amount)}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <V28Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 min-h-[44px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPartnerClick(partner);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </V28Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Handshake className="h-16 w-16" />}
          title={searchQuery ? 'Keine Partner gefunden' : 'Noch keine Partner'}
          description={searchQuery 
            ? 'Versuche einen anderen Suchbegriff'
            : 'Füge deinen ersten Partner hinzu'
          }
          actionLabel={!searchQuery ? 'Partner hinzufügen' : undefined}
          onAction={!searchQuery ? onCreateNew : undefined}
        />
      )}

      {/* FAB */}
      <V28Button
        size="lg"
        className="fixed bottom-24 right-4 rounded-full w-14 h-14 shadow-2xl z-40"
        onClick={onCreateNew}
        aria-label="Neuer Partner"
      >
        <Plus className="h-6 w-6" />
      </V28Button>
    </div>
  );
}
