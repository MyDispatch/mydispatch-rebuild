/* ==================================================================================
   SECTION ERROR FALLBACK V28.1
   ================================================================================== */

import { V28Button } from "@/components/design-system/V28Button";
import { AlertCircle } from "lucide-react";

interface SectionErrorFallbackProps {
  sectionName: string;
  onRetry?: () => void;
}

export const SectionErrorFallback = ({ sectionName, onRetry }: SectionErrorFallbackProps) => {
  return (
    <div className="min-h-[200px] flex items-center justify-center bg-slate-50 py-12">
      <div className="text-center max-w-md px-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {sectionName}-Bereich konnte nicht geladen werden
        </h3>
        <p className="text-sm text-slate-600 mb-6">
          Bitte laden Sie die Seite neu oder versuchen Sie es später erneut.
        </p>
        <div className="flex gap-3 justify-center">
          <V28Button variant="secondary" onClick={() => window.location.reload()}>
            Seite neu laden
          </V28Button>
          {onRetry && (
            <V28Button onClick={onRetry} variant="primary">
              Erneut versuchen
            </V28Button>
          )}
        </div>
      </div>
    </div>
  );
};
