/* ==================================================================================
   MASTER USER MANAGEMENT - V18.5.8
   ==================================================================================
   Verwaltung von Master-Accounts (nur für Master-Accounts zugänglich)
   - Master-User hinzufügen/entfernen
   - Email-basierte Master-Liste
   ================================================================================== */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { V28Button } from "@/components/design-system/V28Button";
import { Input } from "@/lib/compat";
import { Badge } from "@/components/ui/badge";
import { Shield, UserPlus, Trash2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { handleError, handleSuccess } from "@/lib/error-handler";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MasterUser {
  user_id: string;
  email: string;
}

export function MasterUserManagement() {
  const [masterUsers, setMasterUsers] = useState<MasterUser[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMasterUsers();
  }, []);

  const fetchMasterUsers = async () => {
    try {
      // Hole alle User mit Admin-Rolle
      const { data: masterRoles, error } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .eq("role", "admin");

      if (error) throw error;

      // Hole Email-Adressen aus auth.users
      const {
        data: { users },
        error: usersError,
      } = await supabase.auth.admin.listUsers();

      if (usersError) throw usersError;

      const usersWithEmails = (masterRoles || []).map((role: { user_id: string; role: string }) => {
        const user = users?.find((u: any) => u.id === role.user_id);
        return {
          user_id: role.user_id,
          email: user?.email || "Unbekannt",
        };
      });

      setMasterUsers(usersWithEmails);
    } catch (error) {
      handleError(error, "Fehler beim Laden der Master-User");
    }
  };

  const addMasterUser = async () => {
    if (!newEmail.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib eine Email-Adresse ein",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Suche User anhand der Email
      const {
        data: { users },
        error: searchError,
      } = await supabase.auth.admin.listUsers();
      if (searchError) throw searchError;

      const targetUser = users?.find((u: any) => u.email?.toLowerCase() === newEmail.toLowerCase());

      if (!targetUser) {
        toast({
          title: "User nicht gefunden",
          description: `Kein User mit der Email ${newEmail} gefunden. Der User muss sich zuerst registrieren.`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Füge Master-Rolle hinzu
      const { error: insertError } = await supabase.from("user_roles").insert({
        user_id: targetUser.id,
        role: "admin",
      });

      if (insertError) {
        if (insertError.code === "23505") {
          toast({
            title: "Bereits Master",
            description: "Dieser User ist bereits ein Master-Account",
            variant: "destructive",
          });
        } else {
          throw insertError;
        }
      } else {
        handleSuccess("Master-User erfolgreich hinzugefügt");
        setNewEmail("");
        await fetchMasterUsers();
      }
    } catch (error) {
      handleError(error, "Fehler beim Hinzufügen des Master-Users");
    } finally {
      setIsLoading(false);
    }
  };

  const removeMasterUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");

      if (error) throw error;

      handleSuccess("Master-Rechte erfolgreich entfernt");
      await fetchMasterUsers();
    } catch (error) {
      handleError(error, "Fehler beim Entfernen der Master-Rechte");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-foreground" />
          Master-User Verwaltung
        </CardTitle>
        <CardDescription>
          Verwalte Master-Accounts, die Zugriff auf das Master-Dashboard und erweiterte Funktionen
          haben
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Master User Form */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="Email-Adresse des Users"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addMasterUser()}
              className="min-h-[44px]"
            />
          </div>
          <V28Button
            onClick={addMasterUser}
            disabled={isLoading}
            variant="primary"
            className="min-h-[44px] min-w-[44px]"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Hinzufügen
          </V28Button>
        </div>

        {/* Master Users List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Aktuelle Master-Accounts ({masterUsers.length})
          </h4>

          {masterUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Keine Master-User gefunden</p>
            </div>
          ) : (
            <div className="space-y-2">
              {masterUsers.map((user) => (
                <Card
                  key={user.user_id}
                  className="border-2 border-border hover:border-foreground/50 transition-all"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.email}</p>
                        <p className="text-xs text-muted-foreground">Master-Account</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-foreground/10 text-foreground border border-foreground/20">
                        Master
                      </Badge>
                      <V28Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(user.user_id)}
                        className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </V28Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Warning */}
        <div className="bg-muted/50 p-4 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Hinweis:</strong> Master-Accounts haben Zugriff auf
            das Master-Dashboard, können alle Unternehmen sehen, Tarife für Test-Zwecke wechseln und
            erweiterte System-Funktionen nutzen. Vergib diese Rechte nur an vertrauenswürdige
            Personen.
          </p>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Master-Rechte entfernen?</AlertDialogTitle>
            <AlertDialogDescription>
              Bist du sicher, dass du die Master-Rechte für diesen User entfernen möchtest? Der User
              verliert damit den Zugriff auf das Master-Dashboard und alle erweiterten Funktionen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && removeMasterUser(deleteTarget)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Rechte entfernen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
