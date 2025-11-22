/* ==================================================================================
   TEAM-MANAGEMENT V1.0 - VOLLSTÄNDIGE TEAM-VERWALTUNG
   ==================================================================================
   Features:
   ✅ Team-Mitglieder anzeigen (Liste mit Rollen)
   ✅ Neue Mitglieder einladen (E-Mail + Rolle)
   ✅ Rollen-Verwaltung (Admin, Member, Viewer)
   ✅ Berechtigungen pro Rolle
   ✅ Status-Tracking (Active, Pending Invitation)
   ✅ Mobile-optimiert
   ================================================================================== */

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { V28Button } from '@/components/design-system/V28Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { handleError, handleSuccess } from '@/lib/error-handler';
import { Users, UserPlus, Mail, Shield, Eye, Trash2, AlertCircle, Loader2 } from 'lucide-react';

interface TeamMember {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited';
  created_at: string;
  last_sign_in_at: string | null;
}

const ROLE_LABELS = {
  admin: 'Administrator',
  member: 'Mitglied',
  viewer: 'Betrachter',
};

const ROLE_DESCRIPTIONS = {
  admin: 'Voller Zugriff auf alle Funktionen inkl. Einstellungen',
  member: 'Zugriff auf alle Funktionen außer Einstellungen',
  viewer: 'Nur Lesezugriff auf Aufträge und Statistiken',
};

const ROLE_BADGE_VARIANTS = {
  admin: 'destructive' as const,
  member: 'default' as const,
  viewer: 'secondary' as const,
};

export function TeamManagementSection() {
  const { company, profile } = useAuth();
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [isInviting, setIsInviting] = useState(false);

  // Check if current user is admin
  const isAdmin = profile?.role === 'admin' || profile?.role === 'owner';

  useEffect(() => {
    if (company?.id) {
      fetchTeamMembers();
    }
  }, [company?.id]);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all profiles for this company
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at, last_sign_in_at')
        .eq('company_id', company?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const members: TeamMember[] = (data || []).map((profile: any) => ({
        id: profile.id,
        email: profile.email || 'N/A',
        full_name: profile.full_name,
        role: profile.role || 'member',
        status: profile.last_sign_in_at ? 'active' : 'invited',
        created_at: profile.created_at,
        last_sign_in_at: profile.last_sign_in_at,
      }));

      setTeamMembers(members);
    } catch (error) {
      handleError(error, 'Fehler beim Laden der Team-Mitglieder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteTeamMember = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast({
        title: 'Ungültige E-Mail',
        description: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsInviting(true);

      // Call Edge Function to send invitation
      const { data, error } = await supabase.functions.invoke('send-team-invitation', {
        body: {
          email: inviteEmail,
          role: inviteRole,
          company_id: company?.id,
          inviter_name: profile?.full_name || profile?.email,
        },
      });

      if (error) throw error;

      handleSuccess(`Einladung an ${inviteEmail} wurde versendet`);
      setIsInviteDialogOpen(false);
      setInviteEmail('');
      setInviteRole('member');
      
      // Refresh team members
      await fetchTeamMembers();
    } catch (error) {
      handleError(error, 'Fehler beim Versenden der Einladung');
    } finally {
      setIsInviting(false);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      handleSuccess('Rolle erfolgreich aktualisiert');
      await fetchTeamMembers();
    } catch (error) {
      handleError(error, 'Fehler beim Aktualisieren der Rolle');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Möchten Sie dieses Team-Mitglied wirklich entfernen?')) {
      return;
    }

    try {
      // Soft delete: Set company_id to null
      const { error } = await supabase
        .from('profiles')
        .update({ company_id: null })
        .eq('id', memberId);

      if (error) throw error;

      handleSuccess('Team-Mitglied erfolgreich entfernt');
      await fetchTeamMembers();
    } catch (error) {
      handleError(error, 'Fehler beim Entfernen des Team-Mitglieds');
    }
  };

  if (!company?.id) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Kein Unternehmen zugeordnet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header mit Invite-Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Team-Mitglieder ({teamMembers.length})</h3>
          <p className="text-sm text-muted-foreground">
            Verwalten Sie Ihr Team und deren Zugriffsrechte
          </p>
        </div>
        {isAdmin && (
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <V28Button variant="primary">
                <UserPlus className="h-4 w-4 mr-2" />
                Mitglied einladen
              </V28Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Team-Mitglied einladen</DialogTitle>
                <DialogDescription>
                  Laden Sie ein neues Mitglied zu Ihrem Team ein. Sie erhalten eine E-Mail mit Anweisungen.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="invite-email">E-Mail-Adresse</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="name@beispiel.de"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="invite-role">Rolle</Label>
                  <Select value={inviteRole} onValueChange={(value: any) => setInviteRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{ROLE_LABELS.admin}</span>
                          <span className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS.admin}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="member">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{ROLE_LABELS.member}</span>
                          <span className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS.member}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="viewer">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{ROLE_LABELS.viewer}</span>
                          <span className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS.viewer}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <V28Button variant="secondary" onClick={() => setIsInviteDialogOpen(false)}>
                  Abbrechen
                </V28Button>
                <V28Button
                  variant="primary"
                  onClick={handleInviteTeamMember}
                  disabled={isInviting}
                >
                  {isInviting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Wird versendet...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Einladung senden
                    </>
                  )}
                </V28Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Permissions Info */}
      {!isAdmin && (
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="py-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Eingeschränkte Berechtigung</p>
              <p className="text-xs text-muted-foreground mt-1">
                Nur Administratoren können Team-Mitglieder verwalten.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members Table */}
      <Card>
        <CardContent className="p-0">
          {teamMembers.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Keine Team-Mitglieder vorhanden</p>
              {isAdmin && (
                <p className="text-sm text-muted-foreground mt-2">
                  Klicken Sie auf "Mitglied einladen" um zu beginnen
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name / E-Mail</TableHead>
                    <TableHead>Rolle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Letzter Login</TableHead>
                    {isAdmin && <TableHead className="text-right">Aktionen</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{member.full_name || member.email}</p>
                          {member.full_name && (
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {isAdmin ? (
                          <Select
                            value={member.role}
                            onValueChange={(value) => handleUpdateRole(member.id, value)}
                            disabled={member.id === profile?.id} // Can't change own role
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">{ROLE_LABELS.admin}</SelectItem>
                              <SelectItem value="member">{ROLE_LABELS.member}</SelectItem>
                              <SelectItem value="viewer">{ROLE_LABELS.viewer}</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant={ROLE_BADGE_VARIANTS[member.role]}>
                            {ROLE_LABELS[member.role]}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                          {member.status === 'active' ? 'Aktiv' : 'Eingeladen'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {member.last_sign_in_at
                            ? new Date(member.last_sign_in_at).toLocaleDateString('de-DE', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })
                            : '-'}
                        </span>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          {member.id !== profile?.id && (
                            <V28Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </V28Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Roles & Permissions Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rollen & Berechtigungen</CardTitle>
          <CardDescription>Übersicht der Zugriffsrechte pro Rolle</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-destructive" />
                <span className="font-medium text-sm">{ROLE_LABELS.admin}</span>
              </div>
              <p className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS.admin}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium text-sm">{ROLE_LABELS.member}</span>
              </div>
              <p className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS.member}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="font-medium text-sm">{ROLE_LABELS.viewer}</span>
              </div>
              <p className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS.viewer}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
