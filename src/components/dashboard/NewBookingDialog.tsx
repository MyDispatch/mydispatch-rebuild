/* ==================================================================================
   NEW BOOKING DIALOG - V28.1 Slate Design
   ==================================================================================
   Öffnet sich als Overlay über der Karte im Dashboard
   - V28.1 Professional Minimalism
   - Intelligente Formular-Validierung
   - Direkte Integration mit Booking-System
   ================================================================================== */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Textarea,
} from "@/lib/compat";
import { Label } from "@/components/ui/label";
import { V28Button } from "@/components/design-system/V28Button";
import { MapPin, Calendar, User, Phone, Mail, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateBooking } from "@/hooks/api/useBookings";
import { logger } from "@/lib/logger";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client"; // Temporary for customer creation

interface NewBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewBookingDialog({ open, onOpenChange }: NewBookingDialogProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const { mutate: createBooking, isPending } = useCreateBooking();

  // Form State
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    pickup_address: "",
    dropoff_address: "",
    pickup_time: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile?.company_id) {
      toast({
        title: "Fehler",
        description: "Keine Company-ID gefunden",
        variant: "destructive",
      });
      return;
    }

    // Validierung
    if (!formData.pickup_address || !formData.dropoff_address || !formData.pickup_time) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte füllen Sie alle Pflichtfelder aus",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create quick customer if customer data provided
      let customerId: string | null = null;

      if (formData.customer_name || formData.customer_phone || formData.customer_email) {
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .insert({
            company_id: profile.company_id,
            first_name: formData.customer_name || "Walk-in",
            last_name: "Customer",
            phone: formData.customer_phone,
            email: formData.customer_email,
          })
          .select("id")
          .single();

        if (customerError) {
          logger.error("Customer creation failed", customerError, {
            component: "NewBookingDialog",
          });
        } else {
          customerId = customerData.id;
        }
      }

      // Create booking via API hook
      createBooking(
        {
          company_id: profile.company_id,
          customer_id: customerId,
          pickup_address: formData.pickup_address,
          dropoff_address: formData.dropoff_address,
          pickup_time: formData.pickup_time,
          special_requests: formData.notes,
          status: "pending" as const,
          archived: false,
          is_offer: false,
        },
        {
          onSuccess: (data) => {
            onOpenChange(false);
            navigate("/auftraege", { state: { highlightId: data.id } });
          },
          onError: (error) => {
            logger.error("Booking creation failed", error, { component: "NewBookingDialog" });
          },
        }
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Auftrag konnte nicht erstellt werden";
      logger.error("Fehler beim Erstellen", error instanceof Error ? error : undefined, {
        component: "NewBookingDialog",
      });
      toast({
        title: "Fehler",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleFullForm = () => {
    onOpenChange(false);
    navigate("/auftraege", { state: { openCreateDialog: true } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Neuer Auftrag</DialogTitle>
          <DialogDescription>
            Schnellerfassung - Für detaillierte Optionen nutzen Sie das vollständige Formular
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Kunden-Informationen */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <User className="h-4 w-4" />
              Kunden-Informationen
            </h3>

            <div className="space-y-3">
              <div>
                <Label htmlFor="customer_name" className="text-sm font-medium text-slate-700">
                  Name (optional)
                </Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="Max Mustermann"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="customer_phone" className="text-sm font-medium text-slate-700">
                    <Phone className="h-3 w-3 inline mr-1" />
                    Telefon (optional)
                  </Label>
                  <Input
                    id="customer_phone"
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    placeholder="+49 123 456789"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="customer_email" className="text-sm font-medium text-slate-700">
                    <Mail className="h-3 w-3 inline mr-1" />
                    E-Mail (optional)
                  </Label>
                  <Input
                    id="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    placeholder="email@beispiel.de"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Auftrags-Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Auftrags-Details
            </h3>

            <div className="space-y-3">
              <div>
                <Label htmlFor="pickup_address" className="text-sm font-medium text-slate-700">
                  Abholadresse *
                </Label>
                <Input
                  id="pickup_address"
                  value={formData.pickup_address}
                  onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                  placeholder="Musterstraße 1, 12345 Musterstadt"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="dropoff_address" className="text-sm font-medium text-slate-700">
                  Zieladresse *
                </Label>
                <Input
                  id="dropoff_address"
                  value={formData.dropoff_address}
                  onChange={(e) => setFormData({ ...formData, dropoff_address: e.target.value })}
                  placeholder="Beispielweg 10, 54321 Beispielstadt"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="pickup_time" className="text-sm font-medium text-slate-700">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  Abholzeit *
                </Label>
                <Input
                  id="pickup_time"
                  type="datetime-local"
                  value={formData.pickup_time}
                  onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
                  <FileText className="h-3 w-3 inline mr-1" />
                  Notizen (optional)
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Zusätzliche Informationen..."
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <V28Button
            variant="secondary"
            onClick={handleFullForm}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            Vollständiges Formular
          </V28Button>
          <div className="flex gap-3 w-full sm:w-auto">
            <V28Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 sm:flex-none"
            >
              Abbrechen
            </V28Button>
            <V28Button
              variant="primary"
              onClick={() => {
                const form = document.querySelector("form");
                if (form) form.requestSubmit();
              }}
              disabled={isPending}
              className="flex-1 sm:flex-none"
            >
              {isPending ? "Wird erstellt..." : "Auftrag erstellen"}
            </V28Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
