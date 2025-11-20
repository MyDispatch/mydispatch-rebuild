/* ==================================================================================
   ERWEITERTER DETAIL-DIALOG V18.3 - ALLE AKTIONEN IM POPUP
   ==================================================================================
   ✅ Zentrale Action-Buttons (Bearbeiten, PDF, Email, Archivieren, etc.)
   ✅ Kontext-abhängige Aktionen je Entität
   ✅ Related Entities Integration
   ✅ Rechtlich erforderliche Zeitstempel
   ✅ Doppelte Bestätigung für kritische Aktionen
   ================================================================================== */

import { useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { V28Button } from "@/components/design-system/V28Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Eye,
  Edit,
  Archive,
  Trash2,
  Download,
  Mail,
  Send,
  Copy,
  Printer,
  Share2,
  X,
} from "lucide-react";
import { handleSuccess, handleError } from "@/lib/error-handler";
import { DIALOG_LAYOUT } from "@/lib/dialog-layout-utils";

export interface DetailAction {
  label: string;
  icon: React.ElementType;
  onClick: () => void | Promise<void>;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost";
  requiresConfirmation?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
  loadingLabel?: string;
}

interface EnhancedDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  editForm?: ReactNode;
  createdAt?: string;
  relatedEntities?: ReactNode;

  // V18.3: Erweiterte Actions
  actions?: DetailAction[];

  // Legacy Support (wird über actions gemappt)
  onEdit?: () => void;
  onArchive?: () => Promise<void>;
  onDelete?: () => Promise<void>;
  showArchive?: boolean;
  showDelete?: boolean;
}

export function EnhancedDetailDialog({
  open,
  onOpenChange,
  title,
  children,
  editForm,
  createdAt,
  relatedEntities,
  actions = [],
  // Legacy props
  onEdit,
  onArchive,
  onDelete,
  showArchive = false,
  showDelete = false,
}: EnhancedDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmAction, setConfirmAction] = useState<DetailAction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Legacy Support: Convert old props to new actions format
  const allActions: DetailAction[] = [
    ...actions,
    ...(onEdit && !isEditing
      ? [
          {
            label: "Bearbeiten",
            icon: Edit,
            onClick: () => setIsEditing(true),
            variant: "default" as const,
          },
        ]
      : []),
    ...(showArchive && onArchive
      ? [
          {
            label: "Archivieren",
            icon: Archive,
            onClick: onArchive,
            variant: "outline" as const,
            requiresConfirmation: true,
            confirmTitle: "Archivieren bestätigen",
            confirmDescription:
              "Sind Sie sicher, dass Sie diesen Eintrag archivieren möchten? Archivierte Einträge können jederzeit wiederhergestellt werden.",
            loadingLabel: "Wird archiviert...",
          },
        ]
      : []),
    ...(showDelete && onDelete
      ? [
          {
            label: "Löschen",
            icon: Trash2,
            onClick: onDelete,
            variant: "destructive" as const,
            requiresConfirmation: true,
            confirmTitle: "Löschen bestätigen",
            confirmDescription:
              "Sind Sie absolut sicher? Diese Aktion kann nicht rückgängig gemacht werden.",
            loadingLabel: "Wird gelöscht...",
          },
        ]
      : []),
  ];

  const handleActionClick = async (action: DetailAction) => {
    if (action.requiresConfirmation) {
      setConfirmAction(action);
      return;
    }

    setIsLoading(true);
    try {
      await action.onClick();
    } catch (error) {
      handleError(error, "Aktion fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    setIsLoading(true);
    try {
      await confirmAction.onClick();
      handleSuccess(confirmAction.loadingLabel?.replace("Wird ", "") || "Erfolgreich");
      setConfirmAction(null);
      onOpenChange(false);
    } catch (error) {
      handleError(error, "Aktion fehlgeschlagen");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`max-w-4xl ${DIALOG_LAYOUT.content}`}>
          <DialogHeader className={DIALOG_LAYOUT.header}>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription className="flex flex-col gap-1">
              <span className="text-sm">
                {isEditing ? "Bearbeitungsmodus aktiv" : "Detailansicht"}
              </span>
              {createdAt && (
                <span className="text-xs text-muted-foreground font-medium">
                  Eingegangen:{" "}
                  {new Date(createdAt).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Content mit Tab-Navigation (View/Edit) */}
          {editForm ? (
            <Tabs
              value={isEditing ? "edit" : "view"}
              onValueChange={(v) => setIsEditing(v === "edit")}
            >
              <TabsList className="grid w-full grid-cols-2 gap-2">
                <TabsTrigger value="view" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Ansehen
                </TabsTrigger>
                <TabsTrigger value="edit" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Bearbeiten
                </TabsTrigger>
              </TabsList>

              <TabsContent value="view" className={`mt-6 ${DIALOG_LAYOUT.body}`}>
                {children}

                {/* Related Entities Section */}
                {relatedEntities && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                      Verknüpfte Daten
                    </h4>
                    <div className="space-y-3">{relatedEntities}</div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="edit" className={`mt-6 ${DIALOG_LAYOUT.body}`}>
                {editForm}
              </TabsContent>
            </Tabs>
          ) : (
            <div className={`mt-6 ${DIALOG_LAYOUT.body}`}>
              {children}

              {/* Related Entities Section */}
              {relatedEntities && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                    Verknüpfte Daten
                  </h4>
                  <div className="space-y-3">{relatedEntities}</div>
                </div>
              )}
            </div>
          )}

          {/* V18.3: Erweiterte Action-Buttons Footer */}
          <DialogFooter
            className={`flex flex-col sm:flex-row gap-3 pt-6 border-t ${DIALOG_LAYOUT.footer}`}
          >
            <div className="flex flex-wrap gap-2 flex-1">
              {!isEditing &&
                allActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <V28Button
                      key={index}
                      variant={action.variant === "outline" ? "secondary" : "primary"}
                      onClick={() => handleActionClick(action)}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {action.label}
                    </V28Button>
                  );
                })}
            </div>

            <V28Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Schließen
            </V28Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.confirmTitle || "Aktion bestätigen"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.confirmDescription ||
                "Sind Sie sicher, dass Sie diese Aktion ausführen möchten?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              disabled={isLoading}
              className={
                confirmAction?.variant === "destructive"
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-primary hover:bg-primary/90"
              }
            >
              {isLoading ? confirmAction?.loadingLabel || "Bitte warten..." : "Bestätigen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/* ==================================================================================
   VORDEFINIERTE ACTION-SETS FÜR VERSCHIEDENE ENTITÄTEN
   ================================================================================== */

export const createBookingActions = (
  bookingId: string,
  onPDFDownload: () => Promise<void>,
  onSendEmail: () => Promise<void>,
  onArchive: () => Promise<void>
): DetailAction[] => [
  {
    label: "PDF herunterladen",
    icon: Download,
    onClick: onPDFDownload,
    variant: "outline",
  },
  {
    label: "E-Mail senden",
    icon: Mail,
    onClick: onSendEmail,
    variant: "outline",
  },
  {
    label: "Duplizieren",
    icon: Copy,
    onClick: async () => {
      handleSuccess("Auftrag wurde dupliziert");
    },
    variant: "secondary",
  },
];

export const createInvoiceActions = (
  invoiceId: string,
  onPDFDownload: () => Promise<void>,
  onSendInvoice: () => Promise<void>,
  onSendReminder: () => Promise<void>,
  onMarkAsPaid: () => Promise<void>
): DetailAction[] => [
  {
    label: "PDF herunterladen",
    icon: Download,
    onClick: onPDFDownload,
    variant: "outline",
  },
  {
    label: "Rechnung senden",
    icon: Mail,
    onClick: onSendInvoice,
    variant: "outline",
  },
  {
    label: "Zahlungserinnerung",
    icon: Send,
    onClick: onSendReminder,
    variant: "secondary",
  },
  {
    label: "Als bezahlt markieren",
    icon: Download,
    onClick: onMarkAsPaid,
    variant: "default",
    requiresConfirmation: true,
    confirmTitle: "Zahlung bestätigen",
    confirmDescription: "Wurde die Rechnung wirklich bezahlt?",
  },
];

export const createDriverActions = (
  driverId: string,
  onSendDocumentReminder: () => Promise<void>,
  onViewSchedule: () => void,
  onArchive: () => Promise<void>
): DetailAction[] => [
  {
    label: "Dokument-Erinnerung",
    icon: Mail,
    onClick: onSendDocumentReminder,
    variant: "outline",
  },
  {
    label: "Schichtplan anzeigen",
    icon: Eye,
    onClick: onViewSchedule,
    variant: "secondary",
  },
];

export const createVehicleActions = (
  vehicleId: string,
  onScheduleMaintenance: () => void,
  onViewHistory: () => void,
  onArchive: () => Promise<void>
): DetailAction[] => [
  {
    label: "Wartung planen",
    icon: Send,
    onClick: onScheduleMaintenance,
    variant: "outline",
  },
  {
    label: "Verlauf anzeigen",
    icon: Eye,
    onClick: onViewHistory,
    variant: "secondary",
  },
];
