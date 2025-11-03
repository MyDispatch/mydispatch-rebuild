/* ==================================================================================
   STANDARD ACTION BUTTONS V28.0.0 - V28 PREMIUM DESIGN
   ==================================================================================
   Einheitliche Action-Buttons für alle Tabellen
   - Immer gleiche Reihenfolge: Details, Bearbeiten, Archivieren
   - Konsistente Icons und Tooltips
   - Mobile-optimiert
   - V28 Premium Design (rounded-xl, shadow-sm/md, scale)
   ================================================================================== */

import { V28Button } from '@/components/design-system/V28Button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Eye, Edit, Archive, Trash2 } from 'lucide-react';

interface StandardActionButtonsProps {
  onViewDetails?: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  showViewDetails?: boolean;
  showEdit?: boolean;
  showArchive?: boolean;
  showDelete?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function StandardActionButtons({
  onViewDetails,
  onEdit,
  onArchive,
  onDelete,
  showViewDetails = true,
  showEdit = true,
  showArchive = true,
  showDelete = false,
  size = 'sm',
}: StandardActionButtonsProps) {
  // Map size to V28Button sizes
  const v28Size = size === 'default' ? 'md' : size === 'icon' ? 'sm' : size;
  
  return (
    <div className="flex justify-end gap-2">
      <TooltipProvider>
        {/* Details Button - Immer zuerst */}
        {showViewDetails && onViewDetails && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <V28Button
                  variant="ghost"
                  size={v28Size}
                  onClick={onViewDetails}
                  icon={Eye}
                  className="hover:bg-muted"
                >
                  <span className="sr-only">Details anzeigen</span>
                </V28Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Details anzeigen</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Edit Button - Immer zweiter */}
        {showEdit && onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <V28Button
                  variant="ghost"
                  size={v28Size}
                  onClick={onEdit}
                  icon={Edit}
                  className="hover:bg-muted"
                >
                  <span className="sr-only">Bearbeiten</span>
                </V28Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bearbeiten</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Archive Button - Immer dritter (oder Delete) */}
        {showArchive && onArchive && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <V28Button
                  variant="ghost"
                  size={v28Size}
                  onClick={onArchive}
                  icon={Archive}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <span className="sr-only">Archivieren</span>
                </V28Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Archivieren</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Delete Button - Alternative zu Archive */}
        {showDelete && onDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <V28Button
                  variant="ghost"
                  size={v28Size}
                  onClick={onDelete}
                  icon={Trash2}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <span className="sr-only">Löschen</span>
                </V28Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Löschen</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}
