/* ==================================================================================
   XLSX EXPORT UTILITY V28.1
   ==================================================================================
   ✅ SheetJS (xlsx) integration
   ✅ Multiple sheets support
   ✅ Formatting support
   ================================================================================== */

import * as XLSX from 'xlsx';

export interface XLSXExportOptions {
  sheetName?: string;
  filename?: string;
  /** Column widths (optional) */
  columnWidths?: Record<string, number>;
}

/**
 * Export data to XLSX format
 * 
 * @param data - Array of objects or multiple sheets
 * @param options - Export options
 * @returns XLSX blob
 */
export async function exportToXLSX(
  data: unknown[] | Record<string, any[]>,
  options: XLSXExportOptions = {}
): Promise<Blob> {
  const {
    sheetName = 'Export',
    columnWidths,
  } = options;

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Handle single sheet or multiple sheets
  if (Array.isArray(data)) {
    // Single sheet
    if (data.length === 0) {
      throw new Error('Keine Daten zum Exportieren');
    }
    
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Apply column widths if provided
    if (columnWidths) {
      const cols = Object.entries(columnWidths).map(([, width]) => ({ wch: width }));
      ws['!cols'] = cols;
    }
    
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  } else {
    // Multiple sheets
    const sheetNames = Object.keys(data);
    if (sheetNames.length === 0) {
      throw new Error('Keine Daten zum Exportieren');
    }
    
    for (const name of sheetNames) {
      const sheetData = data[name];
      if (Array.isArray(sheetData) && sheetData.length > 0) {
        const ws = XLSX.utils.json_to_sheet(sheetData);
        
        // Apply column widths if provided
        if (columnWidths) {
          const cols = Object.entries(columnWidths).map(([, width]) => ({ wch: width }));
          ws['!cols'] = cols;
        }
        
        XLSX.utils.book_append_sheet(wb, ws, name);
      }
    }
  }

  // Generate buffer
  const wbout = XLSX.write(wb, { 
    bookType: 'xlsx', 
    type: 'array',
    compression: true,
  });

  // Return as blob
  return new Blob([wbout], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
}

/**
 * Export data to CSV format (alternative to XLSX)
 * 
 * @param data - Array of objects
 * @param options - Export options
 * @returns CSV blob
 */
export async function exportToCSV(
  data: unknown[],
  options: { filename?: string } = {}
): Promise<Blob> {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Keine Daten zum Exportieren');
  }

  // Create worksheet from data
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Convert to CSV
  const csv = XLSX.utils.sheet_to_csv(ws, { 
    FS: ';', // German Excel uses semicolon
    RS: '\n',
  });

  // Add BOM for Excel compatibility
  const BOM = '\uFEFF';
  
  return new Blob([BOM + csv], { 
    type: 'text/csv;charset=utf-8;' 
  });
}
