/* ==================================================================================
   NUMBER-UTILS - Zentrale Zahlen-Operationen
   ==================================================================================
   - Rundung, Formatierung
   - Prozent-Berechnungen
   - Min/Max/Clamp
   - Durchschnitt, Summe
   ================================================================================== */

// ============================================================================
// ROUNDING
// ============================================================================

export function roundTo(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

export function roundUp(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.ceil(value * multiplier) / multiplier;
}

export function roundDown(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.floor(value * multiplier) / multiplier;
}

// ============================================================================
// CLAMPING
// ============================================================================

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function clampPercentage(value: number): number {
  return clamp(value, 0, 100);
}

// ============================================================================
// PERCENTAGE CALCULATIONS
// ============================================================================

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return roundTo((value / total) * 100, 1);
}

export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return roundTo(((newValue - oldValue) / oldValue) * 100, 1);
}

export function applyPercentage(value: number, percentage: number): number {
  return roundTo(value * (percentage / 100), 2);
}

export function addPercentage(value: number, percentage: number): number {
  return roundTo(value + applyPercentage(value, percentage), 2);
}

export function subtractPercentage(value: number, percentage: number): number {
  return roundTo(value - applyPercentage(value, percentage), 2);
}

// ============================================================================
// ARRAY CALCULATIONS
// ============================================================================

export function sum(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return roundTo(sum(numbers) / numbers.length, 2);
}

export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;

  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return roundTo((sorted[mid - 1] + sorted[mid]) / 2, 2);
  }

  return sorted[mid];
}

export function min(numbers: number[]): number {
  return Math.min(...numbers);
}

export function max(numbers: number[]): number {
  return Math.max(...numbers);
}

// ============================================================================
// RANGE CALCULATIONS
// ============================================================================

export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export function normalizeToRange(
  value: number,
  sourceMin: number,
  sourceMax: number,
  targetMin: number,
  targetMax: number
): number {
  const normalized = (value - sourceMin) / (sourceMax - sourceMin);
  return targetMin + normalized * (targetMax - targetMin);
}

// ============================================================================
// DISTANCE/PROXIMITY
// ============================================================================

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function proximity(value: number, target: number): number {
  return Math.abs(value - target);
}

// ============================================================================
// RANDOM
// ============================================================================

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number, decimals: number = 2): number {
  return roundTo(Math.random() * (max - min) + min, decimals);
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

export function toFixed(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("de-DE", options).format(value);
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${roundTo(value / 1_000_000, 1)}M`;
  }
  if (value >= 1_000) {
    return `${roundTo(value / 1_000, 1)}k`;
  }
  return value.toString();
}

// ============================================================================
// SIGN & COMPARISON
// ============================================================================

export function sign(value: number): 1 | -1 | 0 {
  if (value > 0) return 1;
  if (value < 0) return -1;
  return 0;
}

export function isPositive(value: number): boolean {
  return value > 0;
}

export function isNegative(value: number): boolean {
  return value < 0;
}

export function isZero(value: number): boolean {
  return value === 0;
}

export function isEven(value: number): boolean {
  return value % 2 === 0;
}

export function isOdd(value: number): boolean {
  return value % 2 !== 0;
}

// ============================================================================
// SAFETY CHECKS
// ============================================================================

export function safeNumber(value: unknown, fallback: number = 0): number {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
}

export function safePercentage(value: unknown): number {
  return clampPercentage(safeNumber(value, 0));
}

export function safePositive(value: unknown): number {
  return Math.max(0, safeNumber(value, 0));
}
