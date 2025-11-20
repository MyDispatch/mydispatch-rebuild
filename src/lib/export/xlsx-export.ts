/* ==================================================================================
   XLSX EXPORT UTILITY V28.1 (SECURITY FIX)
   ==================================================================================
   ✅ ExcelJS integration (sicherer xlsx-Ersatz)
   ✅ Multiple sheets support
   ✅ Formatting support
   ✅ Keine Security-Vulnerabilities
   ================================================================================== */

import ExcelJS from "exceljs";

export interface XLSXExportOptions {
  sheetName?: string;
  filename?: string;
  /** Column widths (optional) */
  columnWidths?: Record<string, number>;
}

/**
 * Export data to XLSX format using ExcelJS
 *
 * @param data - Array of objects or multiple sheets
 * @param options - Export options
 * @returns XLSX blob
 */
export async function exportToXLSX(
  data: any[] | Record<string, any[]>,
  options: XLSXExportOptions = {}
): Promise<Blob> {
  const { sheetName = "Export", columnWidths } = options;

  // Create workbook
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "MyDispatch";
  workbook.created = new Date();

  // Handle single sheet or multiple sheets
  if (Array.isArray(data)) {
    // Single sheet
    if (data.length === 0) {
      throw new Error("Keine Daten zum Exportieren");
    }

    const worksheet = workbook.addWorksheet(sheetName);

    // Extract headers from first object
    const headers = Object.keys(data[0]);
    worksheet.columns = headers.map((header, index) => ({
      header,
      key: header,
      width: columnWidths?.[header] || 15,
    }));

    // Add rows
    data.forEach((row) => {
      worksheet.addRow(row);
    });

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE5E7EB" }, // Light gray
    };
  } else {
    // Multiple sheets
    const sheetNames = Object.keys(data);
    if (sheetNames.length === 0) {
      throw new Error("Keine Daten zum Exportieren");
    }

    for (const name of sheetNames) {
      const sheetData = data[name];
      if (Array.isArray(sheetData) && sheetData.length > 0) {
        const worksheet = workbook.addWorksheet(name);

        // Extract headers from first object
        const headers = Object.keys(sheetData[0]);
        worksheet.columns = headers.map((header) => ({
          header,
          key: header,
          width: columnWidths?.[header] || 15,
        }));

        // Add rows
        sheetData.forEach((row) => {
          worksheet.addRow(row);
        });

        // Style header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE5E7EB" },
        };
      }
    }
  }

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Return as blob
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

/**
 * Export data to CSV format (alternative to XLSX)
 *
 * @param data - Array of objects
 * @param options - Export options
 * @returns CSV blob
 */
export async function exportToCSV(data: any[], options: { filename?: string } = {}): Promise<Blob> {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Keine Daten zum Exportieren");
  }

  // Extract headers
  const headers = Object.keys(data[0]);

  // Build CSV
  const csvRows: string[] = [];

  // Add header row
  csvRows.push(headers.join(";"));

  // Add data rows
  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      // Escape values containing semicolon or quotes
      if (value === null || value === undefined) return "";
      const stringValue = String(value);
      if (stringValue.includes(";") || stringValue.includes('"') || stringValue.includes("\n")) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(values.join(";"));
  });

  const csv = csvRows.join("\n");

  // Add BOM for Excel compatibility
  const BOM = "\uFEFF";

  return new Blob([BOM + csv], {
    type: "text/csv;charset=utf-8;",
  });
}
