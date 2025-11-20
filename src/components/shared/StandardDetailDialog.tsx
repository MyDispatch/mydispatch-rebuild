/* ==================================================================================
   STANDARD-DETAIL-DIALOG V18.5.1 - SYSTEMWEITE DETAILANSICHT
   ==================================================================================
   Einheitliches PopUp-System für ALLE Entitäten
   - Eye-Icon Trigger am Listenende
   - Standardisierte Actions (Bearbeiten, PDF, Email, Archivieren)
   - Rechtskonforme Zeitstempel
   - Related Entities Support
   - Doppelte Bestätigung für kritische Aktionen
   ================================================================================== */

import { ReactNode } from "react";
import { EnhancedDetailDialog, DetailAction } from "@/components/templates/EnhancedDetailDialog";
import { Eye } from "lucide-react";
import { V28Button } from "@/components/design-system/V28Button";

interface StandardDetailDialogProps {
  // Dialog State
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Content
  title: string;
  children: ReactNode;
  editForm?: ReactNode;
  createdAt?: string;
  relatedEntities?: ReactNode;

  // Actions
  actions?: DetailAction[];
  onEdit?: () => void;
  onArchive?: () => Promise<void>;
  showArchive?: boolean;
}

interface DetailTriggerProps {
  onClick: () => void;
  label?: string;
}

/**
 * Standardisierter Trigger-Button (Eye-Icon) für Detailansichten
 */
export function DetailTrigger({ onClick, label = "Details" }: DetailTriggerProps) {
  return (
    <V28Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="h-9 w-9 rounded-md hover:bg-accent/10 transition-all duration-200"
      aria-label={label}
    >
      <Eye className="h-4 w-4 text-foreground" />
    </V28Button>
  );
}

/**
 * Standardisierte Detailansicht für alle Entitäten
 */
export function StandardDetailDialog({
  open,
  onOpenChange,
  title,
  children,
  editForm,
  createdAt,
  relatedEntities,
  actions,
  onEdit,
  onArchive,
  showArchive = false,
}: StandardDetailDialogProps) {
  return (
    <EnhancedDetailDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      editForm={editForm}
      createdAt={createdAt}
      relatedEntities={relatedEntities}
      actions={actions}
      onEdit={onEdit}
      onArchive={onArchive}
      showArchive={showArchive}
    >
      {children}
    </EnhancedDetailDialog>
  );
}
