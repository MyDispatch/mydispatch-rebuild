/* ==================================================================================
   MASTER-DASHBOARD - Terminierungs-Tool Component
   ==================================================================================
   Verwaltung säumiger Accounts, Mahnungen & Blockierungen (nur Master-Accounts)
   ================================================================================== */

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTerminationLogs } from '@/hooks/use-termination-logs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { Input } from '@/lib/compat';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Ban, Mail, Eye, Clock, Euro } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/format-utils';
import { handleError, handleSuccess } from '@/lib/error-handler';

interface Company {
  id: string;
  name: string;
  email: string;
  subscription_status: string;
  subscription_current_period_end: string | null;
  monthly_revenue: number;
  total_bookings: number;
  billing_status: string;
  stripe_customer_id: string | null;
}

interface TerminationLog {
  id: string;
  action_type: string;
  notes: string;
  created_at: string;
  performer: {
    first_name: string;
    last_name: string;
  };
}

export function TerminationTool() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredView, setFilteredView] = useState<'all' | 'overdue' | 'at_risk' | 'blocked'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [actionType, setActionType] = useState<'reminder' | 'warning' | 'block' | 'note'>('reminder');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  
  // ✅ MISSION II: TanStack Query Hook statt direktem Supabase-Call
  const { logs = [], createLog } = useTerminationLogs(selectedCompany?.id);

  useEffect(() => {
    fetchCompanies();
  }, []);

  // ✅ REMOVED: fetchLogs - now handled by useTerminationLogs hook

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');

    if (error) {
      handleError(error, 'Unternehmen konnten nicht geladen werden', {
        title: 'Datenbankfehler',
        showToast: true,
      });
    } else {
      setCompanies(data || []);
    }
  };

  // ✅ REMOVED: fetchLogs function - replaced by useTerminationLogs hook

  const getFilteredCompanies = () => {
    let filtered = companies;

    // Filter nach Ansicht
    if (filteredView === 'overdue') {
      filtered = companies.filter(
        (c) =>
          c.subscription_current_period_end &&
          new Date(c.subscription_current_period_end) < new Date()
      );
    } else if (filteredView === 'at_risk') {
      filtered = companies.filter(
        (c) =>
          c.subscription_current_period_end &&
          new Date(c.subscription_current_period_end) <
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      );
    } else if (filteredView === 'blocked') {
      filtered = companies.filter((c) => c.subscription_status === 'blocked');
    }

    // Suchfilter
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const handleAction = async () => {
    if (!selectedCompany) return;

    setLoading(true);

    try {
      if (actionType === 'block') {
        // Account blockieren
        const { error } = await supabase
          .from('companies')
          .update({ subscription_status: 'blocked' })
          .eq('id', selectedCompany.id);

        if (error) throw error;
        handleSuccess('Account wurde blockiert');
      } else if (actionType === 'reminder' || actionType === 'warning') {
        // E-Mail senden
        const { error } = await supabase.functions.invoke('send-termination-email', {
          body: {
            company_id: selectedCompany.id,
            action_type: actionType,
          },
        });

        if (error) throw error;
        handleSuccess('E-Mail wurde versendet');
      }

      // ✅ MISSION II: TanStack Query Hook statt direktem Supabase-Call
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await createLog({
          company_id: selectedCompany.id,
          action_type: actionType,
          performed_by: userData.user.id,
          notes: notes || null,
        });
      }

      // Refresh companies
      fetchCompanies();
      setNotes('');
    } catch (error) {
      handleError(error, 'Aktion konnte nicht ausgeführt werden', {
        title: 'Fehler bei Terminierung',
        showToast: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (company: Company) => {
    if (company.subscription_status === 'blocked') {
      return <Badge variant="destructive">Blockiert</Badge>;
    }

    if (
      company.subscription_current_period_end &&
      new Date(company.subscription_current_period_end) < new Date()
    ) {
      return <Badge variant="destructive">Überfällig</Badge>;
    }

    if (
      company.subscription_current_period_end &&
      new Date(company.subscription_current_period_end) <
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ) {
      return (
        <Badge variant="outline" className="border-status-warning bg-status-warning/10 text-status-warning">
          Läuft bald ab
        </Badge>
      );
    }

    return <Badge variant="outline" className="border-status-success bg-status-success/10 text-status-success">Aktiv</Badge>;
  };

  const filteredCompanies = getFilteredCompanies();

  const stats = {
    at_risk: companies.filter(
      (c) =>
        c.subscription_current_period_end &&
        new Date(c.subscription_current_period_end) <
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
        new Date(c.subscription_current_period_end) > new Date()
    ).length,
    overdue: companies.filter(
      (c) =>
        c.subscription_current_period_end &&
        new Date(c.subscription_current_period_end) < new Date()
    ).length,
    blocked: companies.filter((c) => c.subscription_status === 'blocked').length,
  };

  return (
    <div className="space-y-6">
      {/* Statistik-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-foreground" />
              Gefährdet
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stats.at_risk}</div>
            <p className="text-xs text-muted-foreground">Läuft in 7 Tagen ab</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-foreground" />
              Überfällig
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Sofortmaßnahme nötig</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Ban className="h-4 w-4 text-foreground" />
              Blockiert
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stats.blocked}</div>
            <p className="text-xs text-muted-foreground">Derzeit gesperrt</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Suche */}
      <Card>
        <CardHeader>
          <CardTitle>Terminierungsverwaltung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Unternehmen suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <Tabs value={filteredView} onValueChange={(v: any) => setFilteredView(v)}>
              <TabsList>
                <TabsTrigger value="all">Alle ({companies.length})</TabsTrigger>
                <TabsTrigger value="at_risk">Gefährdet ({stats.at_risk})</TabsTrigger>
                <TabsTrigger value="overdue">Überfällig ({stats.overdue})</TabsTrigger>
                <TabsTrigger value="blocked">Blockiert ({stats.blocked})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Companies Tabelle */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unternehmen</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Gültig bis</TableHead>
                  <TableHead className="text-right">Umsatz</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Keine Unternehmen gefunden
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell>{company.email || '-'}</TableCell>
                      <TableCell>{getStatusBadge(company)}</TableCell>
                      <TableCell>
                        {company.subscription_current_period_end
                          ? formatDate(company.subscription_current_period_end)
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(company.monthly_revenue || 0)}
                      </TableCell>
                       <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <V28Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCompany(company)}
                            >
                              <Eye className="h-4 w-4" />
                            </V28Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Terminierungsmaßnahmen: {company.name}</DialogTitle>
                              <DialogDescription>
                                Wählen Sie eine Aktion und fügen Sie optional Notizen hinzu
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                              {/* Aktions-Auswahl */}
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Aktion</label>
                                <Select
                                  value={actionType}
                                  onValueChange={(v: any) => setActionType(v)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="reminder">
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Erinnerung senden
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="warning">
                                      <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Mahnung senden
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="block">
                                      <div className="flex items-center gap-2">
                                        <Ban className="h-4 w-4" />
                                        Account blockieren
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="note">
                                      <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        Notiz hinzufügen
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Notizen */}
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Notizen (optional)
                                </label>
                                <Textarea
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  placeholder="z.B. Zahlungserinnerung per Telefon durchgeführt..."
                                  rows={4}
                                />
                              </div>

                              {/* Company-Info */}
                              <div className="bg-muted p-4 rounded-lg space-y-2">
                                <p className="text-sm">
                                  <strong>E-Mail:</strong> {company.email || 'Nicht hinterlegt'}
                                </p>
                                <p className="text-sm">
                                  <strong>Abo-Status:</strong> {company.subscription_status}
                                </p>
                                <p className="text-sm">
                                  <strong>Gültig bis:</strong>{' '}
                                  {company.subscription_current_period_end
                                    ? formatDate(company.subscription_current_period_end)
                                    : '-'}
                                </p>
                                <p className="text-sm">
                                  <strong>Monatsumsatz:</strong>{' '}
                                  {formatCurrency(company.monthly_revenue || 0)}
                                </p>
                                <p className="text-sm">
                                  <strong>Aufträge gesamt:</strong> {company.total_bookings}
                                </p>
                              </div>

                              {/* History-Log */}
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">Bisherige Aktionen</h4>
                                <div className="border rounded-lg max-h-40 overflow-y-auto">
                                  {logs.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground py-4">
                                      Noch keine Aktionen durchgeführt
                                    </p>
                                  ) : (
                                    <div className="divide-y">
                                      {logs.map((log) => (
                                        <div key={log.id} className="p-3">
                                          <div className="flex items-center justify-between mb-1">
                                            <Badge variant="outline">{log.action_type}</Badge>
                                            <span className="text-xs text-muted-foreground">
                                              {formatDate(log.created_at)}
                                            </span>
                                          </div>
                                           {log.notes && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                              {log.notes}
                                            </p>
                                          )}
                                          {log.performer && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                              Durchgeführt von: {log.performer.first_name}{' '}
                                              {log.performer.last_name}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Aktion ausführen */}
                              <div className="flex justify-end gap-2">
                                <V28Button
                                  variant="secondary"
                                  onClick={() => {
                                    setSelectedCompany(null);
                                    setNotes('');
                                  }}
                                >
                                  Abbrechen
                                </V28Button>
                                <V28Button
                                  onClick={handleAction}
                                  disabled={loading}
                                  variant={actionType === 'block' ? 'destructive' : 'primary'}
                                >
                                  {loading ? 'Wird ausgeführt...' : 'Aktion ausführen'}
                                </V28Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
