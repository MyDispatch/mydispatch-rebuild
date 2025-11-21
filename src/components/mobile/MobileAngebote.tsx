/* ==================================================================================
   MOBILE-OPTIMIERTE ANGEBOTE-ANSICHT V18.3 - MIT GRID-LAYOUT
   ==================================================================================
   Verwendet MobileGridLayout für standardisierte Struktur
   ================================================================================== */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, FileText, MapPin, Clock, Euro } from 'lucide-react';
import { MobileGridLayout } from './MobileGridLayout';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/format-utils';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Quote } from '@/hooks/use-quotes';

interface MobileAngeboteProps {
  quotes: Quote[];
  isLoading: boolean;
  onCreateNew: () => void;
  onQuoteClick: (quote: Quote) => void;
  onRefresh: () => void;
}

export function MobileAngebote({
  quotes,
  isLoading,
  onCreateNew,
  onQuoteClick,
  onRefresh
}: MobileAngeboteProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter quotes
  const filteredQuotes = quotes.filter(quote => {
    // Status filter
    if (activeFilter === 'pending' && quote.offer_status && quote.offer_status !== 'pending') return false;
    if (activeFilter === 'accepted' && quote.offer_status !== 'accepted') return false;
    if (activeFilter === 'declined' && quote.offer_status !== 'declined') return false;
    if (activeFilter === 'open' && quote.offer_status && quote.offer_status !== 'pending') return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const customerName = quote.customer_name ||
        `${quote.customer_first_name || ''} ${quote.customer_last_name || ''}`.trim();

      return (
        quote.pickup_address?.toLowerCase().includes(query) ||
        quote.dropoff_address?.toLowerCase().includes(query) ||
        customerName.toLowerCase().includes(query) ||
        quote.id.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Count by status
  const statusCounts = {
    all: quotes.length,
    open: quotes.filter(q => !q.offer_status || q.offer_status === 'pending').length,
    accepted: quotes.filter(q => q.offer_status === 'accepted').length,
    declined: quotes.filter(q => q.offer_status === 'declined').length,
  };

  const filters = [
    { id: 'all', label: 'Alle', count: statusCounts.all },
    { id: 'open', label: 'Offen', count: statusCounts.open },
    { id: 'accepted', label: 'Akzeptiert', count: statusCounts.accepted },
    { id: 'declined', label: 'Abgelehnt', count: statusCounts.declined },
  ];

  const getStatusBadge = (status?: string) => {
    if (status === 'accepted') {
      return <Badge variant="default" className="text-[10px]">Akzeptiert</Badge>;
    }
    if (status === 'declined') {
      return <Badge variant="destructive" className="text-[10px]">Abgelehnt</Badge>;
    }
    return <Badge variant="secondary" className="text-[10px]">Offen</Badge>;
  };

  return (
    <MobileGridLayout<Quote>
      searchPlaceholder="Angebote durchsuchen..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onRefresh={onRefresh}
      isLoading={isLoading}
      filters={filters}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      data={filteredQuotes}
      renderCard={(quote) => (
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      Angebot {quote.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(quote.pickup_time), 'dd.MM.yyyy HH:mm', { locale: de })}
                    </p>
                  </div>
                </div>
                {getStatusBadge(quote.offer_status)}
              </div>

              {/* Route Info */}
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 text-success-text mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Von</p>
                    <p className="text-foreground truncate">{quote.pickup_address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 text-error-text mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Nach</p>
                    <p className="text-foreground truncate">{quote.dropoff_address}</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Euro className="h-4 w-4" />
                  <span className="text-xs">Preis</span>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(quote.price)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      onItemClick={onQuoteClick}
      entityLabel={{ singular: 'Angebot', plural: 'Angebote' }}
      fabLabel="Neues Angebot"
      onFabClick={onCreateNew}
      fabIcon={Plus}
      emptyStateProps={{
        icon: <FileText className="h-16 w-16" />,
        noDataTitle: 'Keine Angebote',
        noDataDescription: 'Erstelle dein erstes Angebot',
        noResultsTitle: 'Keine Ergebnisse',
        noResultsDescription: 'Versuche einen anderen Suchbegriff'
      }}
    />
  );
}
