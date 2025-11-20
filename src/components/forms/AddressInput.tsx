/* ==================================================================================
   ADDRESS INPUT COMPONENT - V18.2.30 FINAL (HERE Autosuggest + Location-Aware)
   ==================================================================================
   Wiederverwendbare Adresskomponente mit HERE Autosuggest API
   MIGRATION: Google Maps → HERE API (Production Ready)
   LOCATION-AWARE: Nutzt Firmenstandort für präzisere Vorschläge (V18.2.30)
   ================================================================================== */

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/lib/compat';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/lib/error-handler';
import { useCompanyLocation } from '@/hooks/use-company-location';

interface AddressData {
  street: string;
  streetNumber: string;
  postalCode: string;
  city: string;
}

interface AddressInputProps {
  street: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  onAddressChange?: (address: AddressData) => void;
  onStreetChange: (value: string) => void;
  onStreetNumberChange: (value: string) => void;
  onPostalCodeChange: (value: string) => void;
  onCityChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

interface Suggestion {
  id: string;
  title: string;
  address: {
    street: string;
    house_number: string;
    postal_code: string;
    city: string;
    country: string;
  };
  position: { lat: number; lng: number } | null;
}

export function AddressInput({
  street,
  streetNumber,
  postalCode,
  city,
  onAddressChange,
  onStreetChange,
  onStreetNumberChange,
  onPostalCodeChange,
  onCityChange,
  required = false,
  disabled = false,
  className,
}: AddressInputProps) {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Location-Aware: Nutzt Firmenstandort für präzisere Adresssuche (V18.2.30)
  const { location, hasCoordinates } = useCompanyLocation();

  // HERE Autosuggest API - Adresssuche mit Debounce
  useEffect(() => {
    if (!searchValue || searchValue.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      abortControllerRef.current = new AbortController();

      try {
        // Location-Aware: Nutze Firmenstandort als 'at' Parameter (V18.2.30)
        interface AutosuggestBody {
          query: string;
          at?: string;
        }
        
        const body: AutosuggestBody = { query: searchValue };
        
        if (hasCoordinates && location?.latitude && location?.longitude) {
          body.at = `${location.latitude},${location.longitude}`;
        }
        
        const { data, error } = await supabase.functions.invoke('here-autosuggest', {
          body,
          signal: abortControllerRef.current.signal,
        });

        if (error) throw error;

        if (data?.suggestions && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          handleError(error, 'Adresssuche fehlgeschlagen', { 
            title: 'Autosuggest Fehler',
            showToast: false,
          });
          setSuggestions([]);
          setShowDropdown(false);
        }
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchValue, hasCoordinates, location]);

  // Klick außerhalb schließt Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Adresse auswählen (HERE API liefert bereits vollständige Adressdaten)
  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const addr = suggestion.address;

    // Callbacks aufrufen
    if (onAddressChange) {
      onAddressChange({
        street: addr.street,
        streetNumber: addr.house_number,
        postalCode: addr.postal_code,
        city: addr.city,
      });
    } else {
      onStreetChange(addr.street);
      onStreetNumberChange(addr.house_number);
      onPostalCodeChange(addr.postal_code);
      onCityChange(addr.city);
    }

    // UI zurücksetzen
    setSearchValue('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2 relative" ref={dropdownRef}>
        <Label htmlFor="address-search" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Adresssuche (HERE API)
        </Label>
        <div className="relative">
          <Input
            id="address-search"
            type="text"
            placeholder="Straße Hausnummer, PLZ Ort eingeben..."
            className="w-full pr-10"
            disabled={disabled}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        
        {/* Dropdown mit Vorschlägen */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="px-4 py-2 hover:bg-muted cursor-pointer text-sm transition-colors"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                <div className="font-medium">{suggestion.title}</div>
                {suggestion.address.city && (
                  <div className="text-xs text-muted-foreground">
                    {suggestion.address.postal_code} {suggestion.address.city}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {!searchValue && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Lightbulb className="h-4 w-4 text-foreground" />
            Beginnen Sie mit der Eingabe (min. 3 Zeichen)
            {hasCoordinates && location?.city && ` • Optimiert für ${location.city}`}
          </p>
        )}
        {street && (
          <div className="p-3 bg-muted/30 rounded-md border border-border">
            <p className="text-xs font-medium text-foreground mb-1">Aktuelle Adresse:</p>
            <p className="text-sm text-foreground">
              {street} {streetNumber}, {postalCode} {city}
            </p>
          </div>
        )}
      </div>

      {/* Manuelle Eingabefelder */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
          <Label htmlFor="street">
            Straße {required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="street"
            value={street}
            onChange={(e) => onStreetChange(e.target.value)}
            placeholder="Musterstraße"
            required={required}
            disabled={disabled}
          />
        </div>
        
        <div>
          <Label htmlFor="streetNumber">
            Hausnr. {required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="streetNumber"
            value={streetNumber}
            onChange={(e) => onStreetNumberChange(e.target.value)}
            placeholder="123"
            required={required}
            disabled={disabled}
          />
        </div>

        <div>
          <Label htmlFor="postalCode">
            PLZ {required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="postalCode"
            value={postalCode}
            onChange={(e) => onPostalCodeChange(e.target.value)}
            placeholder="80331"
            required={required}
            disabled={disabled}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="city">
            Stadt {required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="München"
            required={required}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
