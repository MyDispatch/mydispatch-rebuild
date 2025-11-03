/* ==================================================================================
   EXPORT UTILS - V18.3 Sprint 35
   ==================================================================================
   - PDF/Excel Export für Statistiken
   - Nutzt bulk-export-pdf Edge Function
   - Browser-Download für Excel (CSV-Format)
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface StatisticsExportData {
  company_id: string;
  period: {
    from: string;
    to: string;
  };
  summary: {
    total_revenue: number;
    total_bookings: number;
    total_drivers: number;
    avg_booking_value: number;
  };
  daily_revenue: Array<{
    date: string;
    revenue: number;
    bookings: number;
  }>;
  top_drivers: Array<{
    name: string;
    rides: number;
    revenue: number;
  }>;
  partner_performance: Array<{
    name: string;
    bookings: number;
    revenue: number;
    provision: number;
  }>;
}

/**
 * Export Statistiken als PDF
 */
export async function exportStatisticsPDF(data: StatisticsExportData): Promise<Blob> {
  try {
    const { data: pdfData, error } = await supabase.functions.invoke('bulk-export-pdf', {
      body: {
        type: 'statistics',
        data,
      },
    });

    if (error) throw error;

    // Konvertiere Base64 zu Blob
    const base64Data = pdfData.pdf;
    const binaryData = atob(base64Data);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }

    return new Blob([bytes], { type: 'application/pdf' });
  } catch (error) {
    logger.error('[ExportUtils] PDF Export Error', error, { 
      component: 'export-utils',
      type: 'pdf' 
    });
    throw new Error('PDF-Export fehlgeschlagen');
  }
}

/**
 * Export Statistiken als Excel (CSV)
 */
export function exportStatisticsExcel(data: StatisticsExportData): Blob {
  try {
    let csv = '';

    // Header
    csv += 'MyDispatch Statistik-Export\n';
    csv += `Zeitraum: ${data.period.from} bis ${data.period.to}\n`;
    csv += '\n';

    // Zusammenfassung
    csv += 'ZUSAMMENFASSUNG\n';
    csv += 'Kennzahl;Wert\n';
    csv += `Gesamtumsatz;${formatCurrency(data.summary.total_revenue)}\n`;
    csv += `Aufträge;${data.summary.total_bookings}\n`;
    csv += `Fahrer;${data.summary.total_drivers}\n`;
    csv += `Ø Auftragswert;${formatCurrency(data.summary.avg_booking_value)}\n`;
    csv += '\n\n';

    // Täglicher Umsatz
    csv += 'TÄGLICHER UMSATZ\n';
    csv += 'Datum;Umsatz;Aufträge\n';
    data.daily_revenue.forEach((day) => {
      csv += `${day.date};${formatCurrency(day.revenue)};${day.bookings}\n`;
    });
    csv += '\n\n';

    // Top-Fahrer
    if (data.top_drivers.length > 0) {
      csv += 'TOP-FAHRER\n';
      csv += 'Name;Fahrten;Umsatz\n';
      data.top_drivers.forEach((driver) => {
        csv += `${driver.name};${driver.rides};${formatCurrency(driver.revenue)}\n`;
      });
      csv += '\n\n';
    }

    // Partner-Performance
    if (data.partner_performance.length > 0) {
      csv += 'PARTNER-PERFORMANCE\n';
      csv += 'Name;Aufträge;Umsatz;Provision\n';
      data.partner_performance.forEach((partner) => {
        csv += `${partner.name};${partner.bookings};${formatCurrency(partner.revenue)};${formatCurrency(partner.provision)}\n`;
      });
    }

    // UTF-8 BOM für Excel
    const bom = '\uFEFF';
    return new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  } catch (error) {
    logger.error('[ExportUtils] Excel Export Error', error, { 
      component: 'export-utils',
      type: 'excel' 
    });
    throw new Error('Excel-Export fehlgeschlagen');
  }
}

/**
 * Download Blob als Datei
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generiere Dateinamen mit Timestamp
 */
export function generateExportFilename(prefix: string, extension: string): string {
  const now = new Date();
  const timestamp = now.toISOString().split('T')[0]; // YYYY-MM-DD
  return `${prefix}_${timestamp}.${extension}`;
}

/**
 * Helper: Formatiere Währung für CSV
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
