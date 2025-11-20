/* ==================================================================================
   DEBOUNCE HOOK - V18.1
   ==================================================================================
   Performance-Optimierung für Search & Input-Felder
   ================================================================================== */

import { useState, useEffect } from "react";

/**
 * Debounce Hook
 * Verzögert die Aktualisierung eines Wertes bis nach einer Pause
 *
 * @param value - Der zu debouncende Wert
 * @param delay - Verzögerung in Millisekunden (Standard: 300ms)
 * @returns Der gedebouncte Wert
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // Query wird erst nach 500ms ohne Änderung ausgeführt
 *   fetchResults(debouncedSearchTerm);
 * }, [debouncedSearchTerm]);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
