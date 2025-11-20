/* ==================================================================================
   Global Search Dialog (Cmd/Ctrl + K) - V18.3.26
   ==================================================================================
   - Fuzzy Search über alle Entities (Aufträge, Kunden, Fahrer, Fahrzeuge)
   - Keyboard Navigation (Arrow Keys)
   - Recent Searches (LocalStorage)
   - Direct Navigation zu Ergebnissen
   ================================================================================== */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { FileText, Users, User, Car, Clock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { handleError } from "@/lib/error-handler";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { logger } from "@/lib/logger";

interface SearchResult {
  id: string;
  type: "booking" | "customer" | "driver" | "vehicle";
  title: string;
  subtitle?: string;
  badge?: string;
  url: string;
}

interface RecentSearch {
  query: string;
  timestamp: number;
}

const RECENT_SEARCHES_KEY = "mydispatch_recent_searches";
const MAX_RECENT = 5;

export function GlobalSearchDialog() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(false);

  // Keyboard Shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Load Recent Searches from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed: RecentSearch[] = JSON.parse(stored);
        setRecentSearches(parsed.slice(0, MAX_RECENT));
      }
    } catch (error) {
      logger.error("[GlobalSearchDialog] Failed to load recent searches", error as Error, {
        component: "GlobalSearchDialog",
      });
    }
  }, [open]);

  // Save Recent Search
  const saveRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return;

    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      const existing: RecentSearch[] = stored ? JSON.parse(stored) : [];

      // Remove duplicate if exists
      const filtered = existing.filter((s) => s.query !== query);

      // Add new search at start
      const updated = [{ query, timestamp: Date.now() }, ...filtered].slice(0, MAX_RECENT);

      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      setRecentSearches(updated);
    } catch (error) {
      logger.error("[GlobalSearchDialog] Failed to save recent search", error as Error, {
        component: "GlobalSearchDialog",
      });
    }
  }, []);

  // Fuzzy Search across all entities
  const performSearch = useCallback(
    async (query: string) => {
      if (!profile?.company_id || query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        const searchLower = query.toLowerCase();
        const allResults: SearchResult[] = [];

        // Search Bookings
        const { data: bookings, error: bookingsError } = await supabase
          .from("bookings")
          .select("id, pickup_address, dropoff_address, pickup_time, status, archived")
          .eq("company_id", profile.company_id)
          .eq("archived", false)
          .or(`pickup_address.ilike.%${searchLower}%,dropoff_address.ilike.%${searchLower}%`)
          .limit(5);

        if (bookingsError) throw bookingsError;

        bookings?.forEach((booking) => {
          allResults.push({
            id: booking.id,
            type: "booking",
            title: `${booking.pickup_address} → ${booking.dropoff_address}`,
            subtitle: format(new Date(booking.pickup_time), "dd.MM.yyyy HH:mm", { locale: de }),
            badge: booking.status,
            url: `/auftraege?id=${booking.id}`,
          });
        });

        // Search Customers
        const { data: customers, error: customersError } = await supabase
          .from("customers")
          .select("id, first_name, last_name, email, phone, archived")
          .eq("company_id", profile.company_id)
          .eq("archived", false)
          .or(
            `first_name.ilike.%${searchLower}%,last_name.ilike.%${searchLower}%,email.ilike.%${searchLower}%`
          )
          .limit(5);

        if (customersError) throw customersError;

        customers?.forEach((customer) => {
          allResults.push({
            id: customer.id,
            type: "customer",
            title: `${customer.first_name} ${customer.last_name}`,
            subtitle: customer.email || customer.phone || undefined,
            url: `/kunden?id=${customer.id}`,
          });
        });

        // Search Drivers
        const { data: drivers, error: driversError } = await supabase
          .from("drivers")
          .select("id, first_name, last_name, license_number, shift_status, archived")
          .eq("company_id", profile.company_id)
          .eq("archived", false)
          .or(
            `first_name.ilike.%${searchLower}%,last_name.ilike.%${searchLower}%,license_number.ilike.%${searchLower}%`
          )
          .limit(5);

        if (driversError) throw driversError;

        drivers?.forEach((driver) => {
          allResults.push({
            id: driver.id,
            type: "driver",
            title: `${driver.first_name} ${driver.last_name}`,
            subtitle: driver.license_number || undefined,
            badge: driver.shift_status,
            url: `/fahrer?tab=fahrer&id=${driver.id}`,
          });
        });

        // Search Vehicles
        const { data: vehicles, error: vehiclesError } = await supabase
          .from("vehicles")
          .select("id, license_plate, vehicle_class, status, archived")
          .eq("company_id", profile.company_id)
          .eq("archived", false)
          .or(`license_plate.ilike.%${searchLower}%,vehicle_class.ilike.%${searchLower}%`)
          .limit(5);

        if (vehiclesError) throw vehiclesError;

        vehicles?.forEach((vehicle) => {
          allResults.push({
            id: vehicle.id,
            type: "vehicle",
            title: vehicle.license_plate,
            subtitle: vehicle.vehicle_class,
            badge: vehicle.status,
            url: `/fahrer?tab=fahrzeuge&id=${vehicle.id}`,
          });
        });

        setResults(allResults);
      } catch (error) {
        handleError(error, "Fehler bei der Suche", { showToast: false });
      } finally {
        setLoading(false);
      }
    },
    [profile?.company_id]
  );

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) {
        performSearch(search);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, performSearch]);

  const handleSelect = (result: SearchResult) => {
    saveRecentSearch(search);
    setOpen(false);
    navigate(result.url);
    setSearch("");
    setResults([]);
  };

  const handleRecentClick = (query: string) => {
    setSearch(query);
    performSearch(query);
  };

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "booking":
        return <FileText className="h-4 w-4 text-foreground" />;
      case "customer":
        return <User className="h-4 w-4 text-foreground" />;
      case "driver":
        return <Users className="h-4 w-4 text-foreground" />;
      case "vehicle":
        return <Car className="h-4 w-4 text-foreground" />;
    }
  };

  const getTypeLabel = (type: SearchResult["type"]) => {
    switch (type) {
      case "booking":
        return "Aufträge";
      case "customer":
        return "Kunden";
      case "driver":
        return "Fahrer";
      case "vehicle":
        return "Fahrzeuge";
    }
  };

  // Group results by type
  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.type]) acc[result.type] = [];
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Suche nach Aufträgen, Kunden, Fahrern..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        {!search && recentSearches.length > 0 && (
          <>
            <CommandGroup heading="Letzte Suchen">
              {recentSearches.map((recent, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleRecentClick(recent.query)}
                  className="cursor-pointer"
                >
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{recent.query}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {loading && search && (
          <CommandEmpty>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Search className="h-4 w-4 animate-pulse" />
              <span>Suche läuft...</span>
            </div>
          </CommandEmpty>
        )}

        {!loading && search && results.length === 0 && (
          <CommandEmpty>
            <div className="text-center py-6">
              <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Keine Ergebnisse für "{search}"</p>
            </div>
          </CommandEmpty>
        )}

        {!loading &&
          Object.entries(groupedResults).map(([type, items]) => (
            <CommandGroup key={type} heading={getTypeLabel(type as SearchResult["type"])}>
              {items.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    {getIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{result.title}</p>
                      {result.subtitle && (
                        <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                      )}
                    </div>
                    {result.badge && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                        {result.badge}
                      </Badge>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
      </CommandList>
    </CommandDialog>
  );
}
