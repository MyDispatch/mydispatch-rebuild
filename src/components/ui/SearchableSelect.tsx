/* ==================================================================================
   SEARCHABLE SELECT - Universal Component for Large Lists
   ==================================================================================
   ✅ Search/Filter functionality
   ✅ Keyboard navigation
   ✅ Loading states
   ✅ Custom option rendering
   ✅ Portal-theming ready
   ================================================================================== */

import { useState, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { V28Button } from '@/components/design-system/V28Button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface SearchableSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  portal?: 'entrepreneur' | 'customer' | 'driver';
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = 'Auswählen...',
  searchPlaceholder = 'Suchen...',
  emptyText = 'Keine Ergebnisse gefunden',
  disabled = false,
  loading = false,
  className,
  portal,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const selectedOption = options.find((option) => option.value === value);

  // Filter options based on search
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
    option.description?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <V28Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || loading}
          className={cn(
            'w-full justify-between',
            !selectedOption && 'text-muted-foreground',
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Laden...</span>
              </>
            ) : selectedOption ? (
              <>
                {selectedOption.icon && <selectedOption.icon className="h-4 w-4 shrink-0" />}
                <span className="truncate">{selectedOption.label}</span>
              </>
            ) : (
              placeholder
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </V28Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  onSelect={() => {
                    onValueChange(option.value === value ? '' : option.value);
                    setOpen(false);
                    setSearchValue('');
                  }}
                  className="gap-2"
                >
                  {option.icon && <option.icon className="h-4 w-4 shrink-0" />}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="truncate">{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground truncate">
                        {option.description}
                      </span>
                    )}
                  </div>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4 shrink-0',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
