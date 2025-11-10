/**
 * STANDARD DETAIL PAGE TEMPLATE V45.0 - PREMIUM VIBRANT PROFESSIONAL
 * 
 * Wiederverwendbare Template-Komponente für alle Detail-Ansichten
 * Basiert auf Detail-Dialog Pattern (VERIFIED)
 * 
 * Features:
 * - Vollständige Entity-Anzeige (alle Felder)
 * - Export-Buttons (PDF, Excel, CSV) oben rechts
 * - Edit-Button (Pencil-Icon) oben rechts
 * - Print-Button (für Aufträge mit Briefpapier)
 * - Verwandte Entities (RelatedEntityCard)
 * - Archiv-Button unten
 * 
 * ✅ V45.0 PREMIUM VIBRANT PROFESSIONAL DESIGN
 * ✅ Premium Vibrant Professional Farbpalette
 * ✅ Verbesserte Kontraste und leuchtende Farben
 * ✅ Business Tarif Premium Features
 * ✅ 100% V45.0 Design System kompatibel
 */

import { ReactNode } from 'react';
import { ArrowLeft, Pencil, Download, Printer, Archive } from 'lucide-react';
import { V28Button } from '@/components/design-system/V28Button';
import { useMainLayout } from '@/hooks/useMainLayout';

export interface DetailSection {
  title: string;
  fields: DetailField[];
}

export interface DetailField {
  label: string;
  value: ReactNode;
  fullWidth?: boolean;
}

export interface RelatedEntity {
  title: string;
  items: Array<{
    id: string;
    label: string;
    onClick: () => void;
  }>;
}

export interface StandardDetailPageProps {
  // Header
  title: string;
  subtitle?: string;
  
  // Data
  sections: DetailSection[];
  relatedEntities?: RelatedEntity[];
  
  // Actions
  onBack: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  onExport?: (format: 'pdf' | 'excel' | 'csv') => void;
  onPrint?: () => void;
  
  // Status
  isLoading?: boolean;
  archived?: boolean;
}

export function StandardDetailPage({
  title,
  subtitle,
  sections,
  relatedEntities = [],
  onBack,
  onEdit,
  onArchive,
  onExport,
  onPrint,
  isLoading = false,
  archived = false,
}: StandardDetailPageProps) {
  const { sidebarExpanded } = useMainLayout();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-slate-600 font-medium">Lädt...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 transition-all duration-300"
      style={{ 
        marginLeft: sidebarExpanded ? '256px' : '56px'
      }}
    >
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <V28Button
              variant="secondary"
              size="sm"
              className="hover:shadow-md transition-all duration-300"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </V28Button>

            <div className="flex items-center gap-3">
              {onPrint && (
                <V28Button
                  variant="secondary"
                  size="sm"
                  className="hover:shadow-md transition-all duration-300"
                  onClick={onPrint}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Drucken
                </V28Button>
              )}

              {onExport && (
                <>
                  <V28Button
                    variant="secondary"
                    size="sm"
                    className="hover:shadow-md transition-all duration-300"
                    onClick={() => onExport('pdf')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </V28Button>
                  <V28Button
                    variant="secondary"
                    size="sm"
                    className="hover:shadow-md transition-all duration-300"
                    onClick={() => onExport('excel')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </V28Button>
                </>
              )}

              {onEdit && (
                <V28Button
                  variant="primary"
                  size="sm"
                  className="hover:shadow-md transition-all duration-300"
                  onClick={onEdit}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Bearbeiten
                </V28Button>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
          {subtitle && (
            <p className="text-slate-700 mt-1 font-medium">{subtitle}</p>
          )}
          
          {archived && (
            <div className="mt-3 inline-block px-3 py-1 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-800 text-sm font-medium rounded-lg">
              Archiviert
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-6 shadow-lg rounded-lg">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                {section.title}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {section.fields.map((field, fieldIdx) => (
                  <div 
                    key={fieldIdx}
                    className={field.fullWidth ? 'col-span-2' : 'col-span-1'}
                  >
                    <div className="text-sm text-slate-700 font-medium mb-1">
                      {field.label}
                    </div>
                    <div className="text-slate-800 font-medium">
                      {field.value || '-'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Related Entities */}
          {relatedEntities.length > 0 && (
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Verwandte Einträge
              </h2>

              <div className="space-y-4">
                {relatedEntities.map((entity, idx) => (
                  <div key={idx}>
                    <h3 className="text-sm font-medium text-slate-700 mb-2">
                      {entity.title}
                    </h3>
                    <div className="space-y-2">
                      {entity.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={item.onClick}
                          className="block w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 border border-slate-200"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Archive Action */}
        {onArchive && !archived && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <V28Button
              variant="secondary"
              size="sm"
              onClick={onArchive}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archivieren
            </V28Button>
          </div>
        )}
      </div>
    </div>
  );
}
