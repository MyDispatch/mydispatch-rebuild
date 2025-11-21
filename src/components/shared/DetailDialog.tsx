/* ==================================================================================
   SYSTEMWEITES DETAIL-POPUP - Einheitliche Listen-Detail-Ansicht
   ==================================================================================
   - Öffnet Detail-Ansicht in Dialog
   - Bearbeitungsmodus integriert
   - Archivierungs-Option
   - Doppelte Bestätigung für kritische Aktionen
   ================================================================================== */

import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { V28Button } from '@/components/design-system/V28Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Eye, Edit, Archive, Trash2, Save, X } from 'lucide-react';
import { handleSuccess, handleError } from '@/lib/error-handler';
import { DIALOG_LAYOUT } from '@/lib/dialog-layout-utils';

interface DetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  editForm?: ReactNode;
  onArchive?: () => Promise<void>;
  onDelete?: () => Promise<void>;
  onEdit?: () => void;
  showArchive?: boolean;
  showDelete?: boolean;
  createdAt?: string;
  relatedEntities?: ReactNode; // V18.3: Related Entities Section
}

export function DetailDialog({
  open,
  onOpenChange,
  title,
  children,
  editForm,
  onArchive,
  onDelete,
  onEdit,
  showArchive = true,
  showDelete = false,
  createdAt,
  relatedEntities, // V18.3: Related Entities
}: DetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleArchiveConfirm = async () => {
    if (!onArchive) return;
    
    setIsLoading(true);
    try {
      await onArchive();
      handleSuccess('Erfolgreich archiviert');
      setConfirmArchive(false);
      onOpenChange(false);
    } catch (error) {
      handleError(error, 'Fehler beim Archivieren');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) return;
    
    setIsLoading(true);
    try {
      await onDelete();
      handleSuccess('Erfolgreich gelöscht');
      setConfirmDelete(false);
      onOpenChange(false);
    } catch (error) {
      handleError(error, 'Fehler beim Löschen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`max-w-4xl ${DIALOG_LAYOUT.content}`}>
          <DialogHeader className={DIALOG_LAYOUT.header}>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="flex flex-col gap-1">
              <span>{isEditing ? 'Bearbeitungsmodus aktiv' : 'Detailansicht'}</span>
              {createdAt && (
                <span className="text-xs text-muted-foreground">
                  Erstellt: {new Date(createdAt).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {editForm ? (
            <Tabs value={isEditing ? 'edit' : 'view'} onValueChange={(v) => setIsEditing(v === 'edit')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="view" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Ansehen
                </TabsTrigger>
                <TabsTrigger value="edit" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Bearbeiten
                </TabsTrigger>
              </TabsList>

              <TabsContent value="view" className={`mt-4 ${DIALOG_LAYOUT.body}`}>
                {children}
                
                {/* V18.3: Related Entities Section */}
                {relatedEntities && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                      Verknüpfte Daten
                    </h4>
                    <div className="space-y-3">
                      {relatedEntities}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="edit" className={`mt-4 ${DIALOG_LAYOUT.body}`}>
                {editForm}
              </TabsContent>
            </Tabs>
          ) : (
            <div className={`mt-4 ${DIALOG_LAYOUT.body}`}>
              {children}
              
              {/* V18.3: Related Entities Section */}
              {relatedEntities && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                    Verknüpfte Daten
                  </h4>
                  <div className="space-y-3">
                    {relatedEntities}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className={`flex flex-col sm:flex-row gap-2 sm:gap-4 ${DIALOG_LAYOUT.footer}`}>
            {onEdit && !isEditing && (
              <V28Button
                variant="primary"
                onClick={onEdit}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Bearbeiten
              </V28Button>
            )}
            {showArchive && onArchive && !isEditing && (
              <V28Button
                variant="secondary"
                onClick={() => setConfirmArchive(true)}
                className="flex items-center gap-2"
              >
                <Archive className="h-4 w-4" />
                Archivieren
              </V28Button>
            )}
            {showDelete && onDelete && !isEditing && (
              <V28Button
                variant="destructive"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Löschen
              </V28Button>
            )}
            <V28Button variant="ghost" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Schließen
            </V28Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archivierungs-Bestätigung */}
      <AlertDialog open={confirmArchive} onOpenChange={setConfirmArchive}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archivieren bestätigen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie diesen Eintrag archivieren möchten? 
              Archivierte Einträge können jederzeit wiederhergestellt werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchiveConfirm}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? 'Wird archiviert...' : 'Archivieren'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Lösch-Bestätigung */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Löschen bestätigen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie absolut sicher? Diese Aktion kann nicht rückgängig gemacht werden.
              Der Eintrag wird permanent gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? 'Wird gelöscht...' : 'Endgültig löschen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
