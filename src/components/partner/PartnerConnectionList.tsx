/* ==================================================================================
   PARTNER CONNECTION LIST - Übersicht aktiver Partner-Verbindungen
   ================================================================================== */

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/lib/error-handler';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { V28Button } from '@/components/design-system/V28Button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2, Car, Users, Percent, Loader2 } from 'lucide-react';

interface PartnerConnection {
  id: string;
  company_a_id: string;
  company_b_id: string;
  share_vehicles: boolean;
  share_drivers: boolean;
  provision_rate: number;
  created_at: string;
  partner_company?: {
    id: string;
    name: string;
    email: string;
  };
}

interface PartnerConnectionListProps {
  currentCompanyId: string;
}

export function PartnerConnectionList({ currentCompanyId }: PartnerConnectionListProps) {
  const [connections, setConnections] = useState<PartnerConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_connections')
        .select('*')
        .or(`company_a_id.eq.${currentCompanyId},company_b_id.eq.${currentCompanyId}`);

      if (error) throw error;

      // Fetch partner company details
      const connectionsWithPartner = await Promise.all(
        (data || []).map(async (conn) => {
          const partnerId = conn.company_a_id === currentCompanyId ? conn.company_b_id : conn.company_a_id;
          
          const { data: company } = await supabase
            .from('companies')
            .select('id, name, email')
            .eq('id', partnerId)
            .single();

          return {
            ...conn,
            partner_company: company,
          };
        })
      );

      setConnections(connectionsWithPartner);
    } catch (error: Error | unknown) {
      handleError(error, 'Partner-Verbindungen konnten nicht geladen werden', { showToast: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();

    // Realtime-Updates für neue Connections
    const channel = supabase
      .channel('partner_connections_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'partner_connections',
        },
        () => {
          fetchConnections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentCompanyId]);

  const handleDelete = async () => {
    if (!selectedConnection) return;

    setDeleting(true);
    try {
      // SECURITY: Use Archiving instead of DELETE (SOLL-Vorgabe V18.3.24)
      const { error } = await supabase
        .from('partner_connections')
        .update({ 
          archived: true, 
          archived_at: new Date().toISOString() 
        })
        .eq('id', selectedConnection);

      if (error) throw error;

      toast({
        title: 'Verbindung archiviert',
        description: 'Die Partner-Verbindung wurde erfolgreich archiviert.',
      });

      fetchConnections();
      setDeleteDialogOpen(false);
      setSelectedConnection(null);
    } catch (error: Error | unknown) {
      handleError(error, 'Verbindung konnte nicht archiviert werden');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (connections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aktive Partner</CardTitle>
          <CardDescription>Keine Partner-Verbindungen vorhanden</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Senden Sie eine Partner-Anfrage, um Fahrzeuge und Fahrer zu teilen.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Aktive Partner ({connections.length})</CardTitle>
          <CardDescription>Verwaltung Ihrer Partner-Verbindungen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto scrollbar-hide">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unternehmen</TableHead>
                  <TableHead className="hidden sm:table-cell">E-Mail</TableHead>
                  <TableHead className="text-center">Fahrzeuge</TableHead>
                  <TableHead className="text-center">Fahrer</TableHead>
                  <TableHead className="text-right">Provision</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connections.map((connection) => (
                  <TableRow key={connection.id}>
                    <TableCell className="font-medium">
                      {connection.partner_company?.name || 'Unbekannt'}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {connection.partner_company?.email}
                    </TableCell>
                    <TableCell className="text-center">
                      {connection.share_vehicles ? (
                        <Badge variant="secondary" className="gap-1">
                          <Car className="h-4 w-4" />
                          Geteilt
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Nein</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {connection.share_drivers ? (
                        <Badge variant="secondary" className="gap-1">
                          <Users className="h-4 w-4" />
                          Geteilt
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Nein</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {connection.provision_rate ? (
                        <div className="flex items-center justify-end gap-1 text-xs">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                          <span>{connection.provision_rate}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <V28Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedConnection(connection.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </V28Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Partner-Verbindung beenden</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie diese Partner-Verbindung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
