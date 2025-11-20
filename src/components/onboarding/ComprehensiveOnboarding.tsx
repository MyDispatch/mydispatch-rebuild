/* ==================================================================================
   COMPREHENSIVE ONBOARDING - Multi-Step-Wizard für neue Unternehmen
   ==================================================================================
   6 Schritte: Recht, Unternehmen, Fahrer/Fahrzeuge, Test-Auftrag, Workflow, Support
   ================================================================================== */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { V28Button } from "@/components/design-system/V28Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/lib/compat";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/lib/compat";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/compat";
import { Badge } from "@/lib/compat";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/lib/error-handler";
import {
  Scale,
  Building2,
  Users,
  Car,
  FileText,
  Workflow,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
  ExternalLink,
  Shield,
  BookOpen,
  Sparkles,
  Keyboard,
  Smartphone,
  AlertTriangle,
  Phone,
} from "lucide-react";

interface OnboardingProgress {
  current_step: number;
  completed_steps: number[];
  skipped: boolean;
}

interface ComprehensiveOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

const VEHICLE_CLASSES = [
  "Economy Class (1-4 Pax)",
  "Business Class - Limousine (1-4 Pax)",
  "Business Class - Kombi (1-4 Pax)",
  "First Class (1-3 Pax)",
  "Van / SUV (1-8 Pax)",
];

export function ComprehensiveOnboarding({ onComplete, onSkip }: ComprehensiveOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const { user, profile, company } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form States
  const [companyData, setCompanyData] = useState({
    name: company?.name || "",
    address: company?.address || "",
    phone: company?.phone || "",
    email: company?.email || "",
    is_kleinunternehmer: company?.is_kleinunternehmer || false,
  });

  const [driverData, setDriverData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    license_number: "",
  });

  const [vehicleData, setVehicleData] = useState({
    license_plate: "",
    vehicle_class: "Economy Class (1-4 Pax)",
    concession_number: "",
  });

  useEffect(() => {
    loadProgress();
  }, [user?.id]);

  const loadProgress = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("onboarding_progress")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!error && data) {
      setProgress(data);
      setCurrentStep(data.current_step);
      setCompletedSteps(data.completed_steps || []);
    }
  };

  const saveProgress = async (step: number, completed: number[] = completedSteps) => {
    if (!user?.id) return;

    const { error } = await supabase.from("onboarding_progress").upsert({
      user_id: user.id,
      current_step: step,
      completed_steps: completed,
      skipped: false,
    });

    if (error) {
      handleError(error, "Fehler beim Speichern des Fortschritts", { showToast: false });
    }
  };

  const markStepComplete = async (step: number) => {
    const newCompleted = [...completedSteps, step];
    setCompletedSteps(newCompleted);
    await saveProgress(step + 1, newCompleted);
  };

  const handleSaveCompany = async () => {
    if (!company?.id) return;

    const { error } = await supabase
      .from("companies")
      .update({
        name: companyData.name,
        address: companyData.address,
        phone: companyData.phone,
        email: companyData.email,
        is_kleinunternehmer: companyData.is_kleinunternehmer,
      })
      .eq("id", company.id);

    if (error) {
      toast({
        title: "Fehler",
        description: "Unternehmensdaten konnten nicht gespeichert werden.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Gespeichert",
      description: "Unternehmensdaten erfolgreich aktualisiert.",
    });
    return true;
  };

  const handleSaveDriver = async () => {
    if (!profile?.company_id) return;

    const { error } = await supabase.from("drivers").insert({
      company_id: profile.company_id,
      first_name: driverData.first_name,
      last_name: driverData.last_name,
      email: driverData.email,
      phone: driverData.phone,
      license_number: driverData.license_number,
    });

    if (error) {
      toast({
        title: "Fehler",
        description: "Fahrer konnte nicht angelegt werden.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Fahrer angelegt",
      description: `${driverData.first_name} ${driverData.last_name} erfolgreich hinzugefügt.`,
    });
    return true;
  };

  const handleSaveVehicle = async () => {
    if (!profile?.company_id) return;

    const { error } = await supabase.from("vehicles").insert({
      company_id: profile.company_id,
      license_plate: vehicleData.license_plate,
      vehicle_class: vehicleData.vehicle_class as any,
      concession_number: vehicleData.concession_number,
    });

    if (error) {
      toast({
        title: "Fehler",
        description: "Fahrzeug konnte nicht angelegt werden.",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Fahrzeug angelegt",
      description: `${vehicleData.license_plate} erfolgreich hinzugefügt.`,
    });
    return true;
  };

  const handleNext = async () => {
    // Validierung & Speicherung basierend auf Schritt
    if (currentStep === 2) {
      const success = await handleSaveCompany();
      if (!success) return;
    } else if (currentStep === 3) {
      const driverSuccess = await handleSaveDriver();
      const vehicleSuccess = await handleSaveVehicle();
      if (!driverSuccess || !vehicleSuccess) return;
    }

    await markStepComplete(currentStep);
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
    saveProgress(currentStep - 1);
  };

  const handleComplete = async () => {
    if (!user?.id) return;

    await supabase.from("onboarding_progress").upsert({
      user_id: user.id,
      current_step: 7,
      completed_steps: [1, 2, 3, 4, 5, 6],
      skipped: false,
      completed_at: new Date().toISOString(),
    });

    onComplete();
  };

  const progressPercentage = (currentStep / 6) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Scale className="h-8 w-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Rechtliche Grundlagen</h3>
                <p className="text-muted-foreground">PBefG, DSGVO & Voraussetzungen</p>
              </div>
            </div>

            <Card className="bg-status-warning/5 border-status-warning/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-5 w-5 text-foreground" />
                  Rechtliche Voraussetzungen prüfen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-foreground mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Gewerbeschein</p>
                      <p className="text-xs text-muted-foreground">
                        Anmeldung beim Gewerbeamt (§ 14 GewO)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-foreground mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Genehmigung nach PBefG</p>
                      <p className="text-xs text-muted-foreground">
                        Konzession gem. § 47 PBefG für entgeltliche Personenbeförderung
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-foreground mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Haftpflichtversicherung</p>
                      <p className="text-xs text-muted-foreground">
                        Mindestdeckung gem. § 44 PBefG (Personenschäden)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-foreground mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Fahrer mit P-Schein</p>
                      <p className="text-xs text-muted-foreground">
                        Personenbeförderungsschein gem. § 48 FeV
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-background p-4 rounded-lg border">
                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-foreground" />
                    DSGVO-Hinweis
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MyDispatch speichert Beförderungsdaten 30 Tage (§ 21 PBefG Betriebspflicht).
                    Danach Archivierung für 10 Jahre (§ 147 AO). Fahrer-GPS nur für Disposition.
                  </p>
                </div>

                <V28Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open("https://www.gesetze-im-internet.de/pbefg/", "_blank")}
                  className="w-full"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  PBefG im Volltext lesen
                  <ExternalLink className="ml-2 h-4 w-4" />
                </V28Button>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
              ℹ️ Kontaktieren Sie bei Fragen Ihre lokale IHK oder einen Fachanwalt
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="h-8 w-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Unternehmensdaten</h3>
                <p className="text-muted-foreground">Firmenprofil vervollständigen</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Firmenname *</Label>
                <Input
                  id="company-name"
                  value={companyData.name}
                  onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                  placeholder="Taxi Mustermann GmbH"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-address">Geschäftsadresse *</Label>
                <Input
                  id="company-address"
                  value={companyData.address}
                  onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                  placeholder="Musterstraße 123, 12345 Musterstadt"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Telefon *</Label>
                  <Input
                    id="company-phone"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                    placeholder="+49 123 456789"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">E-Mail *</Label>
                  <Input
                    id="company-email"
                    type="email"
                    value={companyData.email}
                    onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                    placeholder="info@taxi-mustermann.de"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-muted/30 p-4 rounded-lg">
                <Checkbox
                  id="kleinunternehmer"
                  checked={companyData.is_kleinunternehmer}
                  onCheckedChange={(checked) =>
                    setCompanyData({ ...companyData, is_kleinunternehmer: checked as boolean })
                  }
                />
                <label
                  htmlFor="kleinunternehmer"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Kleinunternehmerregelung gem. § 19 UStG
                  <p className="text-xs text-muted-foreground font-normal mt-1">
                    Keine Umsatzsteuer auf Rechnungen (max. 22.000€ Jahresumsatz)
                  </p>
                </label>
              </div>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Ihr Tarif:</strong>{" "}
                  {company?.subscription_status === "active" ? "Business" : "Starter"}
                  <br />
                  Änderungen jederzeit unter <strong>Einstellungen → Unternehmen</strong>
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-8 w-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Fahrer & Fahrzeuge</h3>
                <p className="text-muted-foreground">Erste Ressourcen anlegen</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ersten Fahrer anlegen</CardTitle>
                <CardDescription>Mindestens 1 Fahrer erforderlich</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driver-first-name">Vorname *</Label>
                    <Input
                      id="driver-first-name"
                      value={driverData.first_name}
                      onChange={(e) => setDriverData({ ...driverData, first_name: e.target.value })}
                      placeholder="Max"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driver-last-name">Nachname *</Label>
                    <Input
                      id="driver-last-name"
                      value={driverData.last_name}
                      onChange={(e) => setDriverData({ ...driverData, last_name: e.target.value })}
                      placeholder="Mustermann"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="driver-email">E-Mail</Label>
                    <Input
                      id="driver-email"
                      type="email"
                      value={driverData.email}
                      onChange={(e) => setDriverData({ ...driverData, email: e.target.value })}
                      placeholder="m.mustermann@firma.de"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driver-phone">Telefon</Label>
                    <Input
                      id="driver-phone"
                      value={driverData.phone}
                      onChange={(e) => setDriverData({ ...driverData, phone: e.target.value })}
                      placeholder="+49 123 456789"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver-license">Führerscheinnummer *</Label>
                  <Input
                    id="driver-license"
                    value={driverData.license_number}
                    onChange={(e) =>
                      setDriverData({ ...driverData, license_number: e.target.value })
                    }
                    placeholder="B123456789"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Erstes Fahrzeug anlegen</CardTitle>
                <CardDescription>Mindestens 1 Fahrzeug erforderlich</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-plate">Kennzeichen *</Label>
                  <Input
                    id="vehicle-plate"
                    value={vehicleData.license_plate}
                    onChange={(e) =>
                      setVehicleData({
                        ...vehicleData,
                        license_plate: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="B-TX 1234"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle-class">Fahrzeugklasse *</Label>
                  <Select
                    value={vehicleData.vehicle_class}
                    onValueChange={(value) =>
                      setVehicleData({ ...vehicleData, vehicle_class: value })
                    }
                  >
                    <SelectTrigger id="vehicle-class">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_CLASSES.map((vc) => (
                        <SelectItem key={vc} value={vc}>
                          {vc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle-concession">Konzessionsnummer *</Label>
                  <Input
                    id="vehicle-concession"
                    value={vehicleData.concession_number}
                    onChange={(e) =>
                      setVehicleData({ ...vehicleData, concession_number: e.target.value })
                    }
                    placeholder="PB-12345"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Pro Fahrzeug eine eigene Konzession gem. § 47 PBefG
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-8 w-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Test-Auftrag</h3>
                <p className="text-muted-foreground">Disposition ausprobieren</p>
              </div>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-5 w-5 text-foreground" />
                  Guided Tour: Ersten Auftrag anlegen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">1</Badge>
                    <div>
                      <p className="font-semibold text-sm">Navigation</p>
                      <p className="text-xs text-muted-foreground">
                        Gehen Sie zu <strong>Disposition → Aufträge</strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">2</Badge>
                    <div>
                      <p className="font-semibold text-sm">Neuer Auftrag</p>
                      <p className="text-xs text-muted-foreground">
                        Klicken Sie auf <strong>"Neuer Auftrag"</strong> und füllen Sie die Felder
                        aus
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">3</Badge>
                    <div>
                      <p className="font-semibold text-sm">Fahrer zuweisen</p>
                      <p className="text-xs text-muted-foreground">
                        Wählen Sie Ihren angelegten Fahrer und Fahrzeug aus
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">4</Badge>
                    <div>
                      <p className="font-semibold text-sm">Status ändern</p>
                      <p className="text-xs text-muted-foreground">
                        Testen Sie: Auftrag bestätigen → In Fahrt → Abgeschlossen
                      </p>
                    </div>
                  </div>
                </div>

                <V28Button
                  className="w-full"
                  variant="primary"
                  onClick={() => {
                    navigate("/auftraege");
                    onSkip();
                  }}
                >
                  Jetzt zur Disposition
                  <ArrowRight className="ml-2 h-4 w-4" />
                </V28Button>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground text-center">
              Sie können das Onboarding später fortsetzen
            </p>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Workflow className="h-8 w-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Workflow-Tipps</h3>
                <p className="text-muted-foreground">Best Practices & Shortcuts</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tägliche Workflows optimieren</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-foreground mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Morgen-Routine</p>
                      <p className="text-xs text-muted-foreground">
                        Schichtzettel öffnen → Fahrer zuweisen → Fahrzeuge checken → Aufträge
                        disponieren
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-foreground mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Kunden-Hotline</p>
                      <p className="text-xs text-muted-foreground">
                        Nutzen Sie das integrierte Kommunikations-System (WhatsApp-ähnlich) für
                        schnelle Absprachen
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-foreground mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Monatsabschluss</p>
                      <p className="text-xs text-muted-foreground">
                        Rechnungen prüfen → Zahlungseingänge kontrollieren → Statistiken auswerten
                        (Business)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Keyboard className="h-5 w-5 text-foreground" />
                  Tastatur-Shortcuts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Neuer Auftrag</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      Strg+N
                    </Badge>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Suche</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      Strg+K
                    </Badge>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Schichtzettel</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      Strg+S
                    </Badge>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Dashboard</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      Strg+H
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Smartphone className="h-5 w-5 text-foreground" />
                  Mobile-App (Coming Soon)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  Unsere mobile App für iOS & Android ist in Entwicklung. Sie werden per E-Mail
                  benachrichtigt, sobald sie verfügbar ist.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <HelpCircle className="h-8 w-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Support & Ressourcen</h3>
                <p className="text-muted-foreground">Wir sind für Sie da</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate("/docs")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-5 w-5 text-foreground" />
                    Dokumentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Umfassende Anleitungen, Tutorials und FAQ zu allen Funktionen.
                  </p>
                  <V28Button variant="secondary" size="sm" className="w-full">
                    Zur Doku
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </V28Button>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate("/contact")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Phone className="h-5 w-5 text-foreground" />
                    Support-Kontakt
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Persönlicher Support per E-Mail, Telefon oder Live-Chat.
                  </p>
                  <V28Button variant="secondary" size="sm" className="w-full">
                    Kontakt aufnehmen
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </V28Button>
                </CardContent>
              </Card>

              <Card className="sm:col-span-2 bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-5 w-5 text-foreground" />
                    AI-Assistent
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Unser KI-gestützter Support-Assistent beantwortet Fragen zur Software, hilft bei
                    der Disposition und gibt Optimierungsempfehlungen.
                  </p>
                  <div className="bg-background p-3 rounded-lg border text-xs text-muted-foreground">
                    <p className="font-semibold mb-1">Beispielfragen:</p>
                    <ul className="space-y-1 ml-4 list-disc">
                      <li>"Wie erstelle ich eine Sammelrechnung?"</li>
                      <li>"Welche Dokumente brauche ich für neue Fahrer?"</li>
                      <li>"Wie funktioniert das Partner-Netzwerk?"</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-status-success/5 border-status-success/20">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-16 w-16 text-foreground mx-auto mb-4" />
                <h4 className="text-xl font-bold text-foreground mb-2">
                  Onboarding abgeschlossen! 🎉
                </h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Sie sind jetzt bereit, MyDispatch voll zu nutzen. Viel Erfolg!
                </p>
                <V28Button onClick={handleComplete} variant="primary">
                  Zum Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </V28Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl my-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline">Schritt {currentStep} von 6</Badge>
              <V28Button variant="ghost" size="sm" onClick={onSkip}>
                <X className="h-4 w-4 mr-2" />
                Abbrechen
              </V28Button>
            </div>
            <Progress value={progressPercentage} className="mb-4 h-2" />
          </CardHeader>

          <CardContent className="space-y-6">
            {renderStep()}

            <div className="flex items-center justify-between pt-6 border-t">
              <V28Button variant="secondary" onClick={handleBack} disabled={currentStep === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück
              </V28Button>

              {currentStep < 6 ? (
                <V28Button onClick={handleNext} variant="primary">
                  Weiter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </V28Button>
              ) : (
                <V28Button
                  onClick={handleComplete}
                  variant="primary"
                  className="bg-status-success hover:bg-status-success/90"
                >
                  Abschließen
                  <CheckCircle className="ml-2 h-4 w-4" />
                </V28Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
