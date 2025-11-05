/* ==================================================================================
   ARRAY-UTILS - Zentrale Array-Operationen
   ==================================================================================
   - Filtering, Sorting
   - Grouping, Chunking
   - Deduplication
   - Array-Manipulation
   ================================================================================== */

// ============================================================================
// ARRAY FILTERING
// ============================================================================

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

export function compact<T>(array: (T | null | undefined | false | '' | 0)[]): T[] {
  return array.filter(Boolean) as T[];
}

export function filterByKeys<T extends Record<string, unknown>>(
  array: T[],
  searchTerm: string,
  keys: (keyof T)[]
): T[] {
  const term = searchTerm.toLowerCase();
  return array.filter(item =>
    keys.some(key => {
      const value = String(item[key] || '').toLowerCase();
      return value.includes(term);
    })
  );
}

// ============================================================================
// ARRAY GROUPING
// ============================================================================

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function groupByFunction<T>(
  array: T[],
  fn: (item: T) => string
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = fn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// ============================================================================
// ARRAY CHUNKING
// ============================================================================

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function partition<T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];
  
  array.forEach(item => {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  });
  
  return [truthy, falsy];
}

// ============================================================================
// ARRAY SORTING
// ============================================================================

export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal === bVal) return 0;
    
    const comparison = aVal < bVal ? -1 : 1;
    return order === 'asc' ? comparison : -comparison;
  });
}

export function sortByDate<T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...array].sort((a, b) => {
    const aDate = new Date(String(a[key]));
    const bDate = new Date(String(b[key]));
    
    const comparison = aDate.getTime() - bDate.getTime();
    return order === 'asc' ? comparison : -comparison;
  });
}

export function sortByMultiple<T>(
  array: T[],
  keys: { key: keyof T; order?: 'asc' | 'desc' }[]
): T[] {
  return [...array].sort((a, b) => {
    for (const { key, order = 'asc' } of keys) {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal === bVal) continue;
      
      const comparison = aVal < bVal ? -1 : 1;
      return order === 'asc' ? comparison : -comparison;
    }
    return 0;
  });
}

// ============================================================================
// ARRAY MANIPULATION
// ============================================================================

export function move<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function take<T>(array: T[], count: number): T[] {
  return array.slice(0, count);
}

export function takeRight<T>(array: T[], count: number): T[] {
  return array.slice(-count);
}

export function drop<T>(array: T[], count: number): T[] {
  return array.slice(count);
}

export function dropRight<T>(array: T[], count: number): T[] {
  return array.slice(0, -count);
}

// ============================================================================
// ARRAY SEARCH
// ============================================================================

export function findByKey<T>(array: T[], key: keyof T, value: any): T | undefined {
  return array.find(item => item[key] === value);
}

export function findIndexByKey<T>(array: T[], key: keyof T, value: any): number {
  return array.findIndex(item => item[key] === value);
}

export function includes<T>(array: T[], value: T): boolean {
  return array.includes(value);
}

export function includesAny<T>(array: T[], values: T[]): boolean {
  return values.some(value => array.includes(value));
}

export function includesAll<T>(array: T[], values: T[]): boolean {
  return values.every(value => array.includes(value));
}

// ============================================================================
// ARRAY STATISTICS
// ============================================================================

export function count<T>(array: T[], predicate: (item: T) => boolean): number {
  return array.filter(predicate).length;
}

export function countBy<T>(array: T[], key: keyof T): Record<string, number> {
  return array.reduce((counts, item) => {
    const value = String(item[key]);
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
}

// ============================================================================
// ARRAY COMPARISON
// ============================================================================

export function isEqual<T>(array1: T[], array2: T[]): boolean {
  if (array1.length !== array2.length) return false;
  return array1.every((item, index) => item === array2[index]);
}

export function difference<T>(array1: T[], array2: T[]): T[] {
  return array1.filter(item => !array2.includes(item));
}

export function intersection<T>(array1: T[], array2: T[]): T[] {
  return array1.filter(item => array2.includes(item));
}

export function union<T>(array1: T[], array2: T[]): T[] {
  return unique([...array1, ...array2]);
}

// ============================================================================
// SAFE ACCESS
// ============================================================================

export function first<T>(array: T[]): T | undefined {
  return array[0];
}

export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1];
}

export function isArrayEmpty<T>(array: T[] | null | undefined): boolean {
  return !array || array.length === 0;
}

export function isArrayNotEmpty<T>(array: T[] | null | undefined): boolean {
  return Boolean(array && array.length > 0);
}
