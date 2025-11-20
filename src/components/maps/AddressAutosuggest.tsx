import { useState, useEffect, useRef } from "react";
import { Input } from "@/lib/compat";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";

interface Suggestion {
  id: string;
  address: string;
  lat: number;
  lng: number;
}

interface AddressAutosuggestProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: Suggestion) => void;
  placeholder?: string;
  className?: string;
}

export const AddressAutosuggest = ({
  value,
  onChange,
  onSelect,
  placeholder = "Adresse eingeben",
  className,
}: AddressAutosuggestProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestions([]);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const apiKey = import.meta.env.VITE_HERE_API_KEY;
        const response = await fetch(
          `https://autosuggest.search.hereapi.com/v1/autosuggest?q=${encodeURIComponent(value)}&at=48.1351,11.5820&lang=de-DE&apiKey=${apiKey}`
        );

        if (!response.ok) {
          throw new Error("Autosuggest API Fehler");
        }

        const data = await response.json();
        const items = data.items || [];

        const newSuggestions: Suggestion[] = items
          .filter((item: any) => item.position)
          .slice(0, 5)
          .map((item: any) => ({
            id: item.id,
            address: item.address?.label || item.title,
            lat: item.position.lat,
            lng: item.position.lng,
          }));

        setSuggestions(newSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        logger.error("[AddressAutosuggest] Autosuggest Fehler", error as Error, {
          component: "AddressAutosuggest",
          action: "fetchSuggestions",
        });
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value]);

  const handleSelect = (suggestion: Suggestion) => {
    onChange(suggestion.address);
    setShowSuggestions(false);
    setSuggestions([]);
    onSelect?.(suggestion);
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors flex items-start gap-3 border-b last:border-b-0"
            >
              <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{suggestion.address}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
