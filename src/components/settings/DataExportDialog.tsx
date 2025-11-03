import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { V28Button } from '@/components/design-system/V28Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/lib/error-handler';

interface DataCategory {
  id: string;
  label: string;
  description: string;
  tables: string[];
}

const DATA_CATEGORIES: DataCategory[] = [
  {
    id: 'profile',
    label: 'Profil & Account',
    description: 'Persönliche Informationen, Login-Daten',
    tables: ['profiles'],
  },
  {
    id: 'bookings',
    label: 'Aufträge & Buchungen',
    description: 'Alle Ihre Aufträge und Buchungen',
    tables: ['bookings'],
  },
  {
    id: 'invoices',
    label: 'Rechnungen',
    description: 'Alle Rechnungen und Zahlungen',
    tables: ['invoices'],
  },
  {
    id: 'customers',
    label: 'Kunden',
    description: 'Kundendaten (soweit Sie Eigentümer sind)',
    tables: ['customers'],
  },
  {
    id: 'drivers',
    label: 'Fahrer',
    description: 'Fahrerdaten Ihres Unternehmens',
    tables: ['drivers'],
  },
  {
    id: 'vehicles',
    label: 'Fahrzeuge',
    description: 'Fahrzeugdaten Ihres Unternehmens',
    tables: ['vehicles'],
  },
  {
    id: 'documents',
    label: 'Dokumente',
    description: 'Hochgeladene Dokumente und Dateien',
    tables: ['documents'],
  },
  {
    id: 'audit',
    label: 'Aktivitätsprotokolle',
    description: 'Ihre Systemaktivitäten (DSGVO Art. 15)',
    tables: ['audit_logs'],
  },
];

export function DataExportDialog() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const selectAll = () => {
    setSelectedCategories(DATA_CATEGORIES.map((cat) => cat.id));
  };

  const deselectAll = () => {
    setSelectedCategories([]);
  };

  const handleExport = async () => {
    if (selectedCategories.length === 0) {
      toast({
        title: '⚠️ Keine Kategorien ausgewählt',
        description: 'Bitte wählen Sie mindestens eine Kategorie aus.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-user-data', {
        body: { 
          userId: profile?.id,
          categories: selectedCategories 
        }
      });

      if (error) throw error;

      // Download als JSON-Datei
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mydispatch-datenexport-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportComplete(true);
      toast({
        title: '✅ Datenexport erfolgreich',
        description: 'Ihre Daten wurden als JSON-Datei heruntergeladen.',
      });
    } catch (error) {
      handleError(error, 'Datenexport fehlgeschlagen', { title: 'Data Export Error' });
      toast({
        title: '❌ Export fehlgeschlagen',
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <V28Button variant="secondary">
          <Download className="mr-2 h-4 w-4" />
          Daten exportieren (DSGVO Art. 20)
        </V28Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Datenexport (DSGVO Art. 20)
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-6">
            {/* DSGVO-Hinweis */}
            <Alert>
              <AlertDescription className="text-sm">
                <p className="font-medium mb-2">Ihr Recht auf Datenübertragbarkeit</p>
                <p>
                  Gemäß <strong>DSGVO Art. 20</strong> haben Sie das Recht, Ihre personenbezogenen Daten 
                  in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten. Der Export 
                  enthält alle Daten, die Sie in MyDispatch gespeichert haben.
                </p>
              </AlertDescription>
            </Alert>

            {/* Kategorie-Auswahl */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Datenkategorien auswählen:</Label>
                <div className="flex gap-2">
                  <V28Button size="sm" variant="ghost" onClick={selectAll}>
                    Alle auswählen
                  </V28Button>
                  <V28Button size="sm" variant="ghost" onClick={deselectAll}>
                    Alle abwählen
                  </V28Button>
                </div>
              </div>

              <div className="space-y-2">
                {DATA_CATEGORIES.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <div className="flex-1 space-y-1">
                      <Label
                        htmlFor={category.id}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {category.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Format-Info */}
            <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
              <p className="font-medium">Export-Format:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Format: JSON (maschinenlesbar)</li>
                <li>Struktur: Getrennt nach Tabellen und Kategorien</li>
                <li>Dateiname: mydispatch-datenexport-YYYY-MM-DD.json</li>
                <li>Personenbezogene Daten werden anonymisiert (falls nötig)</li>
              </ul>
            </div>

            {/* Success Message */}
            {exportComplete && (
              <Alert className="bg-status-success/10 border-status-success">
                <CheckCircle2 className="h-4 w-4 text-status-success" />
                <AlertDescription className="text-sm text-status-success">
                  Export erfolgreich! Die Datei wurde heruntergeladen.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <V28Button
            variant="secondary"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Abbrechen
          </V28Button>
          <V28Button
            onClick={handleExport}
            disabled={isExporting || selectedCategories.length === 0}
            className="w-full sm:w-auto"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exportiere...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Daten exportieren ({selectedCategories.length} Kategorien)
              </>
            )}
          </V28Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
