/* ==================================================================================
   PRIVACY PAGE - DSGVO SELF-SERVICE
   ==================================================================================
   Phase 3.2: DSGVO-Dashboard für Kunden
   - Datenexport (DSGVO Art. 15)
   - Löschanfrage (DSGVO Art. 17)
   - Datenschutz-Einstellungen
   ================================================================================== */

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Trash2, 
  Shield, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { 
  exportCustomerData, 
  downloadDataExport, 
  requestAccountDeletion,
  getDeletionRequestStatus 
} from '@/lib/gdpr-export';
import { toast } from 'sonner';
import { SEOHead } from '@/components/shared/SEOHead';

export default function Privacy() {
  const { profile } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [deletionStatus, setDeletionStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [showDeletionConfirm, setShowDeletionConfirm] = useState(false);

  const handleExportData = async () => {
    if (!profile?.id) return;
    
    setIsExporting(true);
    try {
      const data = await exportCustomerData(profile.id, 'JSON');
      if (data) {
        downloadDataExport(data, `mydispatch-data-${profile.email}`);
        toast.success('Ihre Daten wurden exportiert');
      } else {
        toast.error('Export fehlgeschlagen');
      }
    } catch (error) {
      toast.error('Fehler beim Datenexport');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRequestDeletion = async () => {
    if (!profile?.id) return;
    
    const success = await requestAccountDeletion(profile.id);
    if (success) {
      setDeletionStatus('pending');
      toast.success('Löschanfrage wurde erstellt');
      setShowDeletionConfirm(false);
    } else {
      toast.error('Löschanfrage fehlgeschlagen');
    }
  };

  return (
    <>
      <SEOHead
        title="Datenschutz - MyDispatch"
        description="Verwalten Sie Ihre persönlichen Daten"
      />
      <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Datenschutz & Privatsphäre
            </h1>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre persönlichen Daten gemäß DSGVO
            </p>
          </div>
        </div>

        {/* Data Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Datenexport (DSGVO Art. 15)
            </CardTitle>
            <CardDescription>
              Laden Sie alle Ihre gespeicherten Daten herunter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">
                Der Export enthält:
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Ihre persönlichen Daten (Name, E-Mail, Adresse)</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Alle Buchungen und Aufträge</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Rechnungen und Zahlungen</span>
                </li>
              </ul>
            </div>
            
            <V28Button 
              onClick={handleExportData} 
              disabled={isExporting}
              variant="primary"
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
                  Daten exportieren
                </>
              )}
            </V28Button>
          </CardContent>
        </Card>

        {/* Account Deletion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Konto löschen (DSGVO Art. 17)
            </CardTitle>
            <CardDescription>
              Beantragen Sie die Löschung Ihres Kontos und aller Daten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {deletionStatus === 'pending' ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Löschanfrage ausstehend</strong>
                  <br />
                  Ihre Löschanfrage wird geprüft. Die Löschung erfolgt innerhalb von 30 Tagen.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Achtung: Diese Aktion kann nicht rückgängig gemacht werden!</strong>
                    <br />
                    Nach der Löschung können Sie nicht mehr auf Ihr Konto zugreifen.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Folgende Daten werden gelöscht:
                  </p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Ihr Benutzerkonto</li>
                    <li>• Alle persönlichen Daten</li>
                    <li>• Ihre Buchungshistorie</li>
                    <li>• Rechnungen (nach gesetzlicher Aufbewahrungsfrist)</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-3">
                    Die Löschung erfolgt innerhalb von 30 Tagen nach Genehmigung.
                  </p>
                </div>

                {!showDeletionConfirm ? (
                  <V28Button 
                    variant="destructive" 
                    onClick={() => setShowDeletionConfirm(true)}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Konto löschen beantragen
                  </V28Button>
                ) : (
                  <div className="space-y-3">
                    <Alert>
                      <AlertDescription>
                        Sind Sie sicher, dass Sie Ihr Konto löschen möchten?
                      </AlertDescription>
                    </Alert>
                    <div className="flex gap-2">
                      <V28Button 
                        variant="destructive" 
                        onClick={handleRequestDeletion}
                      >
                        Ja, Konto löschen
                      </V28Button>
                      <V28Button 
                        variant="secondary" 
                        onClick={() => setShowDeletionConfirm(false)}
                      >
                        Abbrechen
                      </V28Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Privacy Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Ihre Rechte
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                <span><strong>Recht auf Auskunft (Art. 15 DSGVO):</strong> Sie können eine Kopie Ihrer Daten anfordern</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                <span><strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer Daten beantragen</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                <span><strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können Ihre Daten in maschinenlesbarem Format erhalten</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
