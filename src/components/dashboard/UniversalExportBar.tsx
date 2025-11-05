/* ==================================================================================
   UNIVERSAL EXPORT BAR V33.0 - STANDARDISIERTE EXPORT-BUTTONS
   ==================================================================================
   ✅ PDF/Excel/CSV Export-Buttons
   ✅ Nutzt UniversalDownload Component
   ✅ 100% V28.1 Design System konform
   ================================================================================== */

import { UniversalDownload } from '@/components/shared/UniversalDownload';
import { cn } from '@/lib/utils';

interface UniversalExportBarProps {
  data: unknown[];
  filename: string; // z.B. "kunden-2025-01-31" (ohne Extension)
  
  // Control welche Export-Formate angezeigt werden
  showPdf?: boolean;
  showExcel?: boolean;
  showCsv?: boolean;
  
  className?: string;
}

export function UniversalExportBar({
  data,
  filename,
  showPdf = true,
  showExcel = true,
  showCsv = true,
  className
}: UniversalExportBarProps) {
  return (
    <div className={cn("flex gap-2 p-4 bg-slate-50 border-b border-slate-200", className)}>
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mr-4 self-center">
        Export
      </p>
      
      {/* PDF Export */}
      {showPdf && (
        <UniversalDownload
          type="pdf"
          data={data}
          filename={filename}
          buttonLabel="PDF"
          variant="outline"
          size="sm"
          className="justify-start"
        />
      )}
      
      {/* Excel Export */}
      {showExcel && (
        <UniversalDownload
          type="xlsx"
          data={data}
          filename={filename}
          buttonLabel="Excel"
          variant="outline"
          size="sm"
          className="justify-start"
        />
      )}
      
      {/* CSV Export */}
      {showCsv && (
        <UniversalDownload
          type="csv"
          data={data}
          filename={filename}
          buttonLabel="CSV"
          variant="outline"
          size="sm"
          className="justify-start"
        />
      )}
    </div>
  );
}
