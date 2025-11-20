/* ==================================================================================
   Welcome Wizard - Onboarding für neue Nutzer
   ==================================================================================
   Schritt-für-Schritt Einführung in MyDispatch
   ================================================================================== */

import { useState } from "react";
import { V28Button } from "@/components/design-system/V28Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Car, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface WelcomeWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function WelcomeWizard({ onComplete, onSkip }: WelcomeWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Willkommen bei MyDispatch!",
      description: "In wenigen Schritten ist Ihr System einsatzbereit",
      icon: CheckCircle,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            MyDispatch ist Ihre professionelle Dispositionssoftware für Taxi- und
            Mietwagenunternehmen. Lassen Sie uns gemeinsam Ihr System einrichten.
          </p>
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Was Sie erwartet:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-foreground" />
                Unternehmensprofil einrichten
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-foreground" />
                Fahrer und Fahrzeuge hinzufügen
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-foreground" />
                Ersten Auftrag anlegen
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Schritt 1: Unternehmensprofil",
      description: "Vervollständigen Sie Ihre Firmendaten",
      icon: Building2,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Navigieren Sie zu <strong>Einstellungen → Unternehmen</strong> und hinterlegen Sie:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Firmenname und Adresse</li>
            <li>• Kontaktdaten (Telefon, E-Mail)</li>
            <li>• Steuernummer / USt-ID (optional)</li>
            <li>• Ihr Logo (optional)</li>
          </ul>
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
            <p className="text-sm">
              💡 <strong>Tipp:</strong> Vollständige Firmendaten werden automatisch auf allen
              Rechnungen und Angeboten verwendet.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Schritt 2: Fahrer anlegen",
      description: "Fügen Sie Ihre Fahrer hinzu",
      icon: Users,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Gehen Sie zu <strong>Verwaltung → Fahrer</strong> und erfassen Sie:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Name und Kontaktdaten</li>
            <li>• Führerscheinnummer</li>
            <li>• P-Schein (Taxi-Lizenz)</li>
            <li>• Gültigkeitsdaten</li>
          </ul>
          <div className="bg-status-warning/10 border border-status-warning/20 p-4 rounded-lg">
            <p className="text-sm">
              ⚠️ <strong>Wichtig:</strong> MyDispatch erinnert Sie automatisch vor Ablauf von
              Dokumenten (30 Tage Vorlauf).
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Schritt 3: Fahrzeuge hinzufügen",
      description: "Erfassen Sie Ihren Fuhrpark",
      icon: Car,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Navigieren Sie zu <strong>Verwaltung → Fahrzeuge</strong> und tragen Sie ein:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Kennzeichen</li>
            <li>• Marke und Modell</li>
            <li>• Konzessionsnummer (pro Fahrzeug!)</li>
            <li>• TÜV-Ablauf</li>
            <li>• Fahrzeugklasse</li>
          </ul>
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
            <p className="text-sm">
              💡 <strong>Tipp:</strong> Die Konzessionsnummer wird gemäß PBefG § 47 pro Fahrzeug
              hinterlegt, nicht im Unternehmensprofil.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Geschafft! 🎉",
      description: "Sie sind bereit für Ihren ersten Auftrag",
      icon: CheckCircle,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Ihr MyDispatch-System ist jetzt einsatzbereit! Sie können:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-foreground" />
              Aufträge erfassen und disponieren
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-foreground" />
              Angebote und Rechnungen erstellen
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-foreground" />
              Schichtzettel digital führen
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-foreground" />
              Statistiken einsehen (Business-Tarif)
            </li>
          </ul>
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
            <p className="text-sm font-semibold mb-2">🚀 Weitere Hilfe benötigt?</p>
            <p className="text-sm text-muted-foreground">
              Besuchen Sie unsere{" "}
              <a href="/docs" className="text-primary hover:underline">
                Dokumentation
              </a>{" "}
              oder kontaktieren Sie unseren{" "}
              <a href="/contact" className="text-primary hover:underline">
                Support
              </a>
              .
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">
              Schritt {currentStep + 1} von {steps.length}
            </Badge>
            <V28Button variant="ghost" size="sm" onClick={onSkip}>
              Überspringen
            </V28Button>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-lg">
              <IconComponent className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <CardTitle>{currentStepData.title}</CardTitle>
              <CardDescription>{currentStepData.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStepData.content}

          <div className="flex items-center justify-between pt-4">
            <V28Button
              variant="secondary"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </V28Button>

            {currentStep < steps.length - 1 ? (
              <V28Button onClick={() => setCurrentStep(currentStep + 1)}>
                Weiter
                <ArrowRight className="ml-2 h-4 w-4" />
              </V28Button>
            ) : (
              <V28Button onClick={onComplete} variant="primary">
                Loslegen!
              </V28Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
