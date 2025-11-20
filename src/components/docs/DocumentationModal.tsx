/* ==================================================================================
   DOKUMENTATIONS-MODAL - Dynamisches Modal für registrierte Nutzer
   ==================================================================================
   Nicht registriert: Redirect zu /auth
   Registriert: Modal mit CI-konformer Dokumentation
   ================================================================================== */

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/lib/compat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { V28Button } from "@/components/design-system/V28Button";
import { BookOpen, X } from "lucide-react";
import { sanitizeHelpContent } from "@/lib/sanitize";

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  category?: string;
}

export function DocumentationModal({
  isOpen,
  onClose,
  title,
  content,
  category,
}: DocumentationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <DialogTitle className="text-xl">{title}</DialogTitle>
                {category && (
                  <DialogDescription className="text-sm mt-1">
                    Kategorie: {category}
                  </DialogDescription>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div
            className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizeHelpContent(content) }}
          />
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t">
          <V28Button onClick={onClose} variant="secondary">
            Schließen
          </V28Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
