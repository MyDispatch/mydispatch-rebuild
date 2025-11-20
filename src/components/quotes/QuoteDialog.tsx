import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuoteForm } from "./QuoteForm";

interface QuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId?: string;
}

export function QuoteDialog({ open, onOpenChange, quoteId }: QuoteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {quoteId ? "Angebot bearbeiten" : "Neues Angebot"}
          </DialogTitle>
        </DialogHeader>
        <QuoteForm
          quoteId={quoteId}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
