/* ==================================================================================
   KOMMUNIKATIONSSYSTEM - Participant Selector Component
   ==================================================================================
   Auswahl von Gesprächspartnern (Fahrer, Portal-Kunden, Benutzer)
   ================================================================================== */

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/lib/compat";
import { V28Button } from "@/components/design-system/V28Button";
import { Input } from "@/lib/compat";
import { Checkbox } from "@/lib/compat";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, User, Car } from "lucide-react";
import { handleError, handleSuccess } from "@/lib/error-handler";
import { logDebug, logError } from "@/lib/logger";

interface Participant {
  id: string;
  type: "user" | "driver" | "customer";
  name: string;
  email?: string;
}

interface ParticipantSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (conversationId: string) => void;
}

export function ParticipantSelector({
  open,
  onOpenChange,
  onConversationCreated,
}: ParticipantSelectorProps) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");

  // Available Participants
  const [users, setUsers] = useState<Participant[]>([]);
  const [drivers, setDrivers] = useState<Participant[]>([]);
  const [customers, setCustomers] = useState<Participant[]>([]);

  useEffect(() => {
    if (!open || !profile) return;

    const fetchParticipants = async () => {
      logDebug("[ParticipantSelector] Loading participants for company", {
        companyId: profile.company_id,
      });

      // KRITISCH: Nur User mit echten user_ids können im Chat sein!
      // Fahrer/Kunden OHNE user_id werden NICHT unterstützt
      const { data: profilesData, error } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name")
        .eq("company_id", profile.company_id)
        .neq("user_id", user?.id); // Nicht den aktuellen User

      if (error) {
        logError({ message: "Error loading profiles", context: error });
      }

      logDebug("[ParticipantSelector] Found team members", { count: profilesData?.length || 0 });

      setUsers(
        (profilesData || []).map((p) => ({
          id: p.user_id,
          type: "user",
          name: `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Unbekannt",
        }))
      );

      // Fahrer und Kunden werden NICHT mehr geladen
      // Sie haben keine user_id und können daher nicht chatten
      setDrivers([]);
      setCustomers([]);
    };

    fetchParticipants();
  }, [open, profile, user]);

  const handleToggleParticipant = (id: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCreateConversation = async () => {
    if (selectedParticipants.length === 0 || !user || !profile) {
      handleError(
        new Error("Keine Teilnehmer"),
        "Bitte wählen Sie mindestens einen Teilnehmer aus"
      );
      return;
    }

    setLoading(true);

    try {
      const isGroup = selectedParticipants.length > 1;

      // Erstelle Conversation
      const { data: conversation, error: convError } = await supabase
        .from("chat_conversations")
        .insert({
          company_id: profile.company_id,
          is_group: isGroup,
          name: isGroup ? groupName || "Gruppe" : null,
          created_by: user.id,
        })
        .select()
        .single();

      if (convError) throw convError;

      // Füge Participants hinzu (inkl. aktuellen User)
      const participantIds = [...selectedParticipants, user.id];
      const { error: participantsError } = await supabase.from("chat_participants").insert(
        participantIds.map((id) => ({
          conversation_id: conversation.id,
          user_id: id,
        }))
      );

      if (participantsError) throw participantsError;

      handleSuccess("Gespräch erstellt");
      onConversationCreated(conversation.id);
      onOpenChange(false);

      // Reset
      setSelectedParticipants([]);
      setGroupName("");
      setSearchTerm("");
    } catch (error) {
      handleError(error, "Gespräch konnte nicht erstellt werden");
    } finally {
      setLoading(false);
    }
  };

  const filterParticipants = (participants: Participant[]) => {
    if (!searchTerm) return participants;
    return participants.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const ParticipantList = ({ participants }: { participants: Participant[] }) => (
    <div className="space-y-2">
      {filterParticipants(participants).map((participant) => (
        <div
          key={participant.id}
          className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer"
          onClick={() => handleToggleParticipant(participant.id)}
        >
          <Checkbox
            checked={selectedParticipants.includes(participant.id)}
            onCheckedChange={() => handleToggleParticipant(participant.id)}
          />
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary border border-primary/20 text-xs">
              {participant.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{participant.name}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Neues Gespräch</DialogTitle>
          <DialogDescription>
            Wählen Sie Teilnehmer aus, um ein Gespräch zu starten
          </DialogDescription>
        </DialogHeader>

        {/* Suchfeld */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Teilnehmer suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Gruppenname (wenn mehr als 1 Teilnehmer) */}
        {selectedParticipants.length > 1 && (
          <div>
            <Label htmlFor="group-name">Gruppenname (optional)</Label>
            <Input
              id="group-name"
              placeholder="z.B. Team Meeting"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-2"
            />
          </div>
        )}

        {/* Teilnehmer-Liste */}
        <ScrollArea className="flex-1 mt-4">
          {users.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <h4 className="font-semibold text-base mb-2">Keine Teammitglieder verfügbar</h4>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                Um den Team-Chat zu nutzen, müssen Sie weitere Mitarbeiter einladen.
              </p>
              <V28Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  navigate("/einstellungen?tab=team");
                }}
              >
                Zu Einstellungen → Team
              </V28Button>
            </div>
          ) : (
            <ParticipantList participants={users} />
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {selectedParticipants.length} Teilnehmer ausgewählt
          </p>
          <div className="flex gap-2">
            <V28Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>
              Abbrechen
            </V28Button>
            <V28Button
              onClick={handleCreateConversation}
              disabled={loading || selectedParticipants.length === 0}
            >
              Gespräch erstellen
            </V28Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
