/* ==================================================================================
   PARTNER REQUEST DIALOG - Anfrage an anderen MyDispatch-Nutzer
   ================================================================================== */

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/lib/error-handler";
import { usePartnerRequests } from "@/hooks/use-partner-requests";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { V28Button } from "@/components/design-system/V28Button";
import { Input } from "@/lib/compat";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface PartnerRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCompanyId: string;
  onSuccess?: () => void;
}

export function PartnerRequestDialog({
  open,
  onOpenChange,
  currentCompanyId,
  onSuccess,
}: PartnerRequestDialogProps) {
  const [targetCompanyId, setTargetCompanyId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // ✅ MISSION II: TanStack Query Hook statt direktem Supabase-Call
  const { createRequest } = usePartnerRequests(currentCompanyId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetCompanyId.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine MyDispatch-ID ein.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Prüfen ob Ziel-Company existiert
      const { data: targetCompany, error: companyError } = await supabase
        .from("companies")
        .select("id, name")
        .eq("id", targetCompanyId)
        .single();

      if (companyError || !targetCompany) {
        toast({
          title: "Fehler",
          description: "Unternehmen nicht gefunden. Bitte prüfen Sie die MyDispatch-ID.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Prüfen ob bereits eine Verbindung oder Anfrage existiert
      const { data: existingRequest } = await supabase
        .from("partner_requests")
        .select("id, status")
        .or(
          `and(requesting_company_id.eq.${currentCompanyId},target_company_id.eq.${targetCompanyId}),and(requesting_company_id.eq.${targetCompanyId},target_company_id.eq.${currentCompanyId})`
        )
        .maybeSingle();

      if (existingRequest) {
        toast({
          title: "Anfrage bereits vorhanden",
          description: `Es existiert bereits eine ${existingRequest.status === "pending" ? "ausstehende" : existingRequest.status === "accepted" ? "akzeptierte" : "abgelehnte"} Anfrage.`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // ✅ MISSION II: TanStack Query Hook statt direktem Supabase-Call
      await createRequest({
        requesting_company_id: currentCompanyId,
        target_company_id: targetCompanyId,
        message: message.trim() || null,
      });

      toast({
        title: "Anfrage gesendet",
        description: `Partner-Anfrage wurde an ${targetCompany.name} gesendet.`,
      });

      // Reset form
      setTargetCompanyId("");
      setMessage("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      handleError(error, "Partner-Anfrage konnte nicht gesendet werden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Neuen Partner hinzufügen</DialogTitle>
            <DialogDescription>
              Geben Sie die MyDispatch-ID des Unternehmens ein, mit dem Sie eine Partnerschaft
              eingehen möchten.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="company-id">MyDispatch-ID *</Label>
              <Input
                id="company-id"
                placeholder="z.B. 550e8400-e29b-41d4-a716-446655440000"
                value={targetCompanyId}
                onChange={(e) => setTargetCompanyId(e.target.value)}
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Die ID finden Sie in den Unternehmenseinstellungen des Partners
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Nachricht (optional)</Label>
              <Textarea
                id="message"
                placeholder="Beschreiben Sie kurz den Grund für die Partnerschaft..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <V28Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Abbrechen
            </V28Button>
            <V28Button type="submit" variant="primary" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Anfrage senden
            </V28Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
