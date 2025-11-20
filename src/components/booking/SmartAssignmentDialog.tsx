/**
 * ==================================================================================
 * SMART ASSIGNMENT DIALOG V18.3 - AI-basierte Fahrer-Zuweisung
 * ==================================================================================
 * Zeigt AI-Vorschläge für optimale Fahrer-Zuweisung
 * - Top 3 Vorschläge mit Score & Confidence
 * - GPS-basierte ETA-Anzeige
 * - Breakdown der Scoring-Faktoren
 * - One-Click-Assignment
 * ==================================================================================
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/lib/compat";
import { V28Button } from "@/components/design-system/V28Button";
import { Card } from "@/lib/compat";
import { Badge } from "@/lib/compat";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sparkles,
  MapPin,
  Car,
  TrendingUp,
  Star,
  Award,
  Clock,
  Phone,
  Loader2,
} from "lucide-react";
import { handleError, handleSuccess } from "@/lib/error-handler";

interface AssignmentRecommendation {
  driver_id: string;
  driver_name: string;
  driver_phone?: string;
  vehicle_id: string;
  vehicle_plate: string;
  score: number;
  eta_minutes: number | null;
  confidence: "high" | "medium" | "low";
  reason: string;
  breakdown: {
    proximity: number;
    availability: number;
    vehicle_match: number;
    workload: number;
    rating: number;
    experience: number;
  };
}

interface SmartAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  pickupLocation: { lat: number; lng: number };
  pickupTime: string;
  vehicleClass?: string;
  passengers: number;
  companyId: string;
  onAssign: (driverId: string, vehicleId: string) => Promise<void>;
}

export function SmartAssignmentDialog({
  open,
  onOpenChange,
  bookingId,
  pickupLocation,
  pickupTime,
  vehicleClass,
  passengers,
  companyId,
  onAssign,
}: SmartAssignmentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AssignmentRecommendation[]>([]);
  const [assigning, setAssigning] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchRecommendations();
    }
  }, [open]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-smart-assignment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            booking_id: bookingId,
            pickup_location: pickupLocation,
            pickup_time: pickupTime,
            vehicle_class: vehicleClass,
            passengers,
            company_id: companyId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Fehler beim Laden der Vorschläge");
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      handleError(error, "Fehler beim Laden der AI-Vorschläge");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (driverId: string, vehicleId: string) => {
    setAssigning(driverId);
    try {
      await onAssign(driverId, vehicleId);
      handleSuccess("Fahrer erfolgreich zugewiesen");
      onOpenChange(false);
    } catch (error) {
      handleError(error, "Fehler bei der Zuweisung");
    } finally {
      setAssigning(null);
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: "bg-status-success/10 text-status-success border-status-success/20",
      medium: "bg-status-warning/10 text-status-warning border-status-warning/20",
      low: "bg-muted/30 text-muted-foreground border-border",
    };

    const labels = {
      high: "Hohe Übereinstimmung",
      medium: "Mittlere Übereinstimmung",
      low: "Niedrige Übereinstimmung",
    };

    return (
      <Badge variant="outline" className={colors[confidence as keyof typeof colors]}>
        {labels[confidence as keyof typeof labels]}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-status-success";
    if (score >= 70) return "text-status-warning";
    return "text-muted-foreground";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-foreground" />
            <DialogTitle>AI-Intelligente Zuweisung</DialogTitle>
          </div>
          <DialogDescription>
            Unsere KI analysiert Standort, Verfügbarkeit, Auslastung und Erfahrung, um die optimalen
            Fahrer vorzuschlagen.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-foreground mx-auto" />
              <p className="text-muted-foreground">Analysiere Fahrer...</p>
            </div>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Keine passenden Fahrer gefunden</p>
            <V28Button onClick={() => onOpenChange(false)} className="mt-4" variant="secondary">
              Schließen
            </V28Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <Card
                key={rec.driver_id}
                className={`p-4 ${index === 0 ? "border-primary border-2" : ""}`}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {index === 0 && (
                        <Badge className="bg-primary text-primary-foreground">Top-Vorschlag</Badge>
                      )}
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-foreground font-semibold">
                          {rec.driver_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{rec.driver_name}</h3>
                        <p className="text-sm text-muted-foreground">{rec.vehicle_plate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(rec.score)}`}>
                        {rec.score}
                      </div>
                      <p className="text-xs text-muted-foreground">von 100</p>
                    </div>
                  </div>

                  {/* Confidence & Reason */}
                  <div className="flex flex-wrap items-center gap-2">
                    {getConfidenceBadge(rec.confidence)}
                    <Badge variant="outline" className="text-xs">
                      {rec.reason}
                    </Badge>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {rec.eta_minutes !== null && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">ETA</p>
                          <p className="font-semibold">{rec.eta_minutes} Min</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Nähe</p>
                        <p className="font-semibold">{rec.breakdown.proximity}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Auslastung</p>
                        <p className="font-semibold">{rec.breakdown.workload}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Erfahrung</p>
                        <p className="font-semibold">{rec.breakdown.experience}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="my-4 h-px bg-border" />
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Bewertungs-Details
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Verfügbarkeit</span>
                          <span className="font-semibold">{rec.breakdown.availability}%</span>
                        </div>
                        <Progress value={rec.breakdown.availability} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Fahrzeug-Match</span>
                          <span className="font-semibold">{rec.breakdown.vehicle_match}%</span>
                        </div>
                        <Progress value={rec.breakdown.vehicle_match} className="h-1.5" />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <V28Button
                      onClick={() => handleAssign(rec.driver_id, rec.vehicle_id)}
                      disabled={assigning !== null}
                      variant="primary"
                      className="flex-1"
                    >
                      {assigning === rec.driver_id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Wird zugewiesen...
                        </>
                      ) : (
                        <>
                          <Car className="h-4 w-4 mr-2" />
                          Zuweisen
                        </>
                      )}
                    </V28Button>
                    {rec.driver_phone && (
                      <V28Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(`tel:${rec.driver_phone}`, "_self")}
                        className="h-10 w-10"
                      >
                        <Phone className="h-4 w-4" />
                      </V28Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {/* Footer Info */}
            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground">
                Die Vorschläge basieren auf GPS-Position, Verfügbarkeit, Auslastung und Erfahrung.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
