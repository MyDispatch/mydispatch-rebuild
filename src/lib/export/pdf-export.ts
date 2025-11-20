/* ==================================================================================
   PDF EXPORT UTILITY V28.1
   ==================================================================================
   ✅ jsPDF + autoTable integration
   ✅ Company branding support
   ✅ V28.1 Slate colors
   ================================================================================== */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PDFExportOptions {
  title?: string;
  subtitle?: string;
  logo?: string;
  companyName?: string;
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'a4' | 'letter';
}

/**
 * Export data to PDF with table format
 * 
 * @param data - Array of objects to export
 * @param options - Export options
 * @returns PDF blob
 */
export async function exportToPDF(
  data: any[],
  options: PDFExportOptions = {}
): Promise<Blob> {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Keine Daten zum Exportieren');
  }

  const {
    title = 'Export',
    subtitle,
    logo,
    companyName,
    orientation = 'portrait',
    pageSize = 'a4',
  } = options;

  // Create PDF document
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize,
  });

  let currentY = 20;

  // Add logo if provided
  if (logo) {
    try {
      doc.addImage(logo, 'PNG', 15, currentY, 30, 30);
      currentY += 35;
    } catch (error) {
      // Logo failed to load, continue without it
      console.warn('Logo could not be loaded:', error);
    }
  }

  // Add company name
  if (companyName) {
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(companyName, logo ? 50 : 15, currentY);
    currentY += 8;
  }

  // Add title
  doc.setFontSize(18);
  doc.setTextColor(51, 65, 85); // slate-700
  doc.text(title, 15, currentY);
  currentY += 10;

  // Add subtitle if provided
  if (subtitle) {
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(subtitle, 15, currentY);
    currentY += 10;
  }

  // Add date
  doc.setFontSize(10);
  doc.setTextColor(120);
  const dateStr = `Erstellt am: ${new Date().toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`;
  doc.text(dateStr, 15, currentY);
  currentY += 15;

  // Extract headers from first object
  const headers = Object.keys(data[0]);
  const body = data.map(row => headers.map(header => {
    const value = row[header];
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'Ja' : 'Nein';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }));

  // Add table with autoTable
  autoTable(doc, {
    head: [headers],
    body,
    startY: currentY,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [51, 65, 85], // slate-700
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    margin: { top: currentY, left: 15, right: 15, bottom: 20 },
  });

  // Add page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      `Seite ${i} von ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Return as blob
  return doc.output('blob');
}
