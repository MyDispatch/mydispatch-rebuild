import { useState } from "react";
import { FileDown } from "lucide-react";
import { handleError } from "@/lib/error-handler";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { V28Button } from "@/components/design-system/V28Button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { handleSuccess } from "@/lib/error-handler";

interface PDFExportOptions {
  includePrice: boolean;
  includePhone: boolean;
  includeCustomerDetails: boolean;
  includeDriverDetails: boolean;
  includeVehicleDetails: boolean;
  includePaymentInfo: boolean;
  includeNotes: boolean;
}

interface PDFExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: PDFExportOptions) => Promise<void>;
  entityType: "booking" | "quote" | "invoice";
}

export function PDFExportDialog({ isOpen, onClose, onExport, entityType }: PDFExportDialogProps) {
  const [options, setOptions] = useState<PDFExportOptions>({
    includePrice: true,
    includePhone: true,
    includeCustomerDetails: true,
    includeDriverDetails: entityType === "booking",
    includeVehicleDetails: entityType === "booking",
    includePaymentInfo: entityType === "invoice",
    includeNotes: false,
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(options);
      handleSuccess("PDF erfolgreich erstellt");
      onClose();
    } catch (error) {
      handleError(error, "Fehler beim Erstellen des PDFs");
    } finally {
      setIsExporting(false);
    }
  };

  const getTitle = () => {
    switch (entityType) {
      case "booking":
        return "Auftrag als PDF exportieren";
      case "quote":
        return "Angebot als PDF exportieren";
      case "invoice":
        return "Rechnung als PDF exportieren";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-foreground" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            Wählen Sie die Informationen aus, die im PDF enthalten sein sollen
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="includePrice"
                checked={options.includePrice}
                onCheckedChange={(checked) => setOptions({ ...options, includePrice: !!checked })}
              />
              <Label htmlFor="includePrice" className="cursor-pointer">
                Preise anzeigen
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="includePhone"
                checked={options.includePhone}
                onCheckedChange={(checked) => setOptions({ ...options, includePhone: !!checked })}
              />
              <Label htmlFor="includePhone" className="cursor-pointer">
                Telefonnummern anzeigen
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="includeCustomerDetails"
                checked={options.includeCustomerDetails}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, includeCustomerDetails: !!checked })
                }
              />
              <Label htmlFor="includeCustomerDetails" className="cursor-pointer">
                Kundendetails anzeigen
              </Label>
            </div>

            {entityType === "booking" && (
              <>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="includeDriverDetails"
                    checked={options.includeDriverDetails}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, includeDriverDetails: !!checked })
                    }
                  />
                  <Label htmlFor="includeDriverDetails" className="cursor-pointer">
                    Fahrerdetails anzeigen
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="includeVehicleDetails"
                    checked={options.includeVehicleDetails}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, includeVehicleDetails: !!checked })
                    }
                  />
                  <Label htmlFor="includeVehicleDetails" className="cursor-pointer">
                    Fahrzeugdetails anzeigen
                  </Label>
                </div>
              </>
            )}

            {entityType === "invoice" && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="includePaymentInfo"
                  checked={options.includePaymentInfo}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includePaymentInfo: !!checked })
                  }
                />
                <Label htmlFor="includePaymentInfo" className="cursor-pointer">
                  Zahlungsinformationen anzeigen
                </Label>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Checkbox
                id="includeNotes"
                checked={options.includeNotes}
                onCheckedChange={(checked) => setOptions({ ...options, includeNotes: !!checked })}
              />
              <Label htmlFor="includeNotes" className="cursor-pointer">
                Interne Notizen anzeigen
              </Label>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground">
            <p className="font-medium mb-1">💡 Hinweis:</p>
            <p>
              Das PDF wird mit Ihrem Unternehmenslogo und in Ihren CI-Farben erstellt. Alle Angaben
              entsprechen den deutschen Formatierungen (TT.MM.JJJJ, 1.234,56 €).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <V28Button
              onClick={handleExport}
              disabled={isExporting}
              variant="primary"
              className="flex-1"
            >
              <FileDown className="mr-2 h-4 w-4" />
              {isExporting ? "Erstelle PDF..." : "PDF erstellen"}
            </V28Button>
            <V28Button
              variant="secondary"
              onClick={onClose}
              disabled={isExporting}
              className="flex-1"
            >
              Abbrechen
            </V28Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
