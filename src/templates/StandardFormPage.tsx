/**
 * STANDARD FORM PAGE TEMPLATE V45.0 - PREMIUM VIBRANT PROFESSIONAL
 *
 * Wiederverwendbare Template-Komponente für alle Formular-Ansichten
 * (Erstellen + Bearbeiten)
 *
 * Features:
 * - React Hook Form + Zod Validation
 * - Sektionierte Felder
 * - Speichern + Abbrechen Buttons
 * - Loading States
 * - Error Handling
 *
 * ✅ V45.0 PREMIUM VIBRANT PROFESSIONAL DESIGN
 * ✅ Premium Vibrant Professional Farbpalette
 * ✅ Verbesserte Kontraste und leuchtende Farben
 * ✅ Business Tarif Premium Features
 * ✅ 100% V45.0 Design System kompatibel
 */

import { ReactNode } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { V28Button } from "@/components/design-system/V28Button";
import { useMainLayout } from "@/hooks/useMainLayout";

export interface FormSection {
  title: string;
  description?: string;
  fields: ReactNode;
}

export interface StandardFormPageProps {
  // Header
  title: string;
  subtitle?: string;

  // Form
  sections: FormSection[];
  onSubmit: () => void;
  onCancel: () => void;

  // Status
  isSubmitting?: boolean;
  isDirty?: boolean;
  isValid?: boolean;

  // Mode
  mode: "create" | "edit";
}

export function StandardFormPage({
  title,
  subtitle,
  sections,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isDirty = false,
  isValid = true,
  mode,
}: StandardFormPageProps) {
  const { sidebarExpanded } = useMainLayout();

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 transition-all duration-300"
      style={{
        marginLeft: sidebarExpanded ? "256px" : "56px",
      }}
    >
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <V28Button
              variant="secondary"
              size="sm"
              className="hover:shadow-md transition-all duration-300"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Abbrechen
            </V28Button>

            <V28Button
              variant="primary"
              size="sm"
              className="hover:shadow-md transition-all duration-300"
              onClick={onSubmit}
              disabled={!isValid || isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Speichert..." : "Speichern"}
            </V28Button>
          </div>

          <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
          {subtitle && <p className="text-slate-700 mt-1 font-medium">{subtitle}</p>}
        </div>

        {/* Form Sections */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-6"
        >
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-6 shadow-lg rounded-lg">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-800">{section.title}</h2>
                {section.description && (
                  <p className="text-sm text-slate-700 mt-1 font-medium">{section.description}</p>
                )}
              </div>

              <div className="space-y-4">{section.fields}</div>
            </div>
          ))}

          {/* Sticky Save Button */}
          <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 flex items-center justify-end gap-3 shadow-lg">
            <V28Button
              type="button"
              variant="secondary"
              className="hover:shadow-md transition-all duration-300"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Abbrechen
            </V28Button>

            <V28Button
              type="submit"
              variant="primary"
              className="hover:shadow-md transition-all duration-300"
              disabled={!isValid || isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              {mode === "create" ? "Erstellen" : "Änderungen speichern"}
            </V28Button>
          </div>
        </form>

        {/* Unsaved Changes Warning */}
        {isDirty && (
          <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-2 text-sm shadow-lg">
            Ungespeicherte Änderungen
          </div>
        )}
      </div>
    </div>
  );
}
