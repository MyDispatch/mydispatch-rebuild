/* ==================================================================================
   DASHBOARD INFO CONFIGS - TEMPORARY STUB V29.3
   ==================================================================================
   Diese Config wurde entfernt. Dies ist nur ein temporärer Stub für Build-Kompatibilität.
   ================================================================================== */

export interface DashboardInfoConfig {
  [key: string]: unknown;
}

export const DASHBOARD_INFO_CONFIGS: DashboardInfoConfig = {};

export interface KPIData {
  label: string;
  value: string | number;
  change?: number;
}

export function generateKPIsForArea(_area: string, _data: unknown[]): KPIData[] {
  return [];
}

export interface ChartData {
  labels: string[];
  data: number[];
}

export function generateChartDataForArea(_area: string, _data: unknown[]): ChartData | null {
  return null;
}

export type DashboardArea = string;
