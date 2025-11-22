/* ==================================================================================
   MASTER.TSX - V33.4 SIMPLIFIED MASTER DASHBOARD
   ==================================================================================
   Vereinfachtes Master-Dashboard für info@my-dispatch.de

   REMOVED (per User Request):
   - System-Übersicht (4 Tiles mit Details)
   - Benutzer-Verwaltung (all users across companies)
   - Analytics (Charts & Metrics)
   - Einstellungen (Master settings)

   KEPT (per User Request):
   - 6 KPIs: Benutzer Gesamt, Aktive Benutzer, Unternehmen, Aufträge Gesamt, System-Status, Monatsumsatz
   - Master-Account-Verwaltung (add/remove master users)
   - Registrierte Unternehmen (list with detail view: Impressum + Tariff expiry)
   ================================================================================== */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { V28Badge } from '@/components/design-system/V28Badge';
import { Users, Building2, FileText, Activity, Euro, Shield, Eye, X, Check, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MasterKPIs {
  totalUsers: number;
  activeUsers: number;
  totalCompanies: number;
  totalBookings: number;
  systemStatus: 'healthy' | 'degraded' | 'down';
  monthlyRevenue: number;
}

interface RegisteredCompany {
  id: string;
  name: string;
  email: string;
  created_at: string;
  tariff: string;
  subscription_end_date: string | null;
  auto_renewal: boolean;
  // Impressum data
  company_name: string | null;
  street_address: string | null;
  postal_code: string | null;
  city: string | null;
  phone: string | null;
  ceo_name: string | null;
  commercial_register: string | null;
  tax_id: string | null;
}

export default function Master() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<MasterKPIs | null>(null);
  const [companies, setCompanies] = useState<RegisteredCompany[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<RegisteredCompany | null>(null);

  // ✅ Security: Only info@my-dispatch.de or courbois1981@gmail.com (legacy fallback)
  const isMasterAccount = user?.email === 'info@my-dispatch.de' || user?.email === 'courbois1981@gmail.com';

  useEffect(() => {
    if (!isMasterAccount) {
      toast({
        title: 'Zugriff verweigert',
        description: 'Master-Dashboard nur für autorisierte Master-Accounts.',
        variant: 'destructive',
      });
      navigate('/dashboard');
      return;
    }

    loadMasterData();
  }, [isMasterAccount, navigate]);

  const loadMasterData = async () => {
    try {
      setLoading(true);

      // Load KPIs
      const [usersRes, companiesRes, bookingsRes] = await Promise.all([
        supabase.from('profiles').select('id, is_active', { count: 'exact', head: false }),
        supabase.from('companies').select('id', { count: 'exact', head: false }),
        supabase.from('bookings').select('id', { count: 'exact', head: false }),
      ]);

      const totalUsers = usersRes.count || 0;
      const activeUsers = usersRes.data?.filter((u) => u.is_active).length || 0;
      const totalCompanies = companiesRes.count || 0;
      const totalBookings = bookingsRes.count || 0;

      // Calculate monthly revenue (dummy for now - integrate Stripe later)
      const monthlyRevenue = totalCompanies * 99; // Assuming 99 EUR per company

      setKpis({
        totalUsers,
        activeUsers,
        totalCompanies,
        totalBookings,
        systemStatus: 'healthy',
        monthlyRevenue,
      });

      // Load registered companies with Impressum data
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (companiesError) throw companiesError;

      setCompanies(companiesData || []);
    } catch (error) {
      console.error('Failed to load master data:', error);
      toast({
        title: 'Fehler',
        description: 'Master-Daten konnten nicht geladen werden.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: MasterKPIs['systemStatus']) => {
    if (status === 'healthy') return 'text-success';
    if (status === 'degraded') return 'text-warning';
    return 'text-destructive';
  };

  const getTariffBadgeVariant = (tariff: string): 'default' | 'secondary' | 'premium' => {
    if (tariff === 'Business' || tariff === 'business') return 'premium';
    if (tariff === 'Starter' || tariff === 'starter') return 'secondary';
    return 'default';
  };

  if (loading) {
    return (
      <StandardPageLayout title="Master-Dashboard" showBackButton={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </StandardPageLayout>
    );
  }

  if (!kpis) {
    return (
      <StandardPageLayout title="Master-Dashboard" showBackButton={false}>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Fehler beim Laden der Master-Daten.</p>
          </CardContent>
        </Card>
      </StandardPageLayout>
    );
  }

  return (
    <StandardPageLayout title="Master-Dashboard" showBackButton={false}>
      <div className="space-y-6 sm:space-y-8">
        {/* KPIs - 6 Metrics in 2 rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Benutzer Gesamt */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Benutzer Gesamt</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{kpis.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-foreground opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Aktive Benutzer */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Aktive Benutzer</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{kpis.activeUsers}</p>
                </div>
                <Activity className="h-8 w-8 text-foreground opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Unternehmen */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unternehmen</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{kpis.totalCompanies}</p>
                </div>
                <Building2 className="h-8 w-8 text-foreground opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* Aufträge Gesamt */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Aufträge Gesamt</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{kpis.totalBookings}</p>
                </div>
                <FileText className="h-8 w-8 text-foreground opacity-20" />
              </div>
            </CardContent>
          </Card>

          {/* System-Status */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System-Status</p>
                  <p className={`text-2xl font-bold mt-2 ${getStatusColor(kpis.systemStatus)}`}>
                    {kpis.systemStatus === 'healthy' ? 'Aktiv' : kpis.systemStatus === 'degraded' ? 'Beeinträchtigt' : 'Ausgefallen'}
                  </p>
                </div>
                <Activity className={`h-8 w-8 opacity-20 ${getStatusColor(kpis.systemStatus)}`} />
              </div>
            </CardContent>
          </Card>

          {/* Monatsumsatz */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monatsumsatz</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{kpis.monthlyRevenue.toLocaleString('de-DE')} €</p>
                </div>
                <Euro className="h-8 w-8 text-foreground opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Master-Account-Verwaltung */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Master-Account-Verwaltung</CardTitle>
                <CardDescription>Verwalte Benutzer mit Master-Dashboard-Zugriff</CardDescription>
              </div>
              <Shield className="h-5 w-5 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-foreground" />
                  <div>
                    <p className="font-medium text-foreground">info@my-dispatch.de</p>
                    <p className="text-sm text-muted-foreground">Haupt-Master-Account</p>
                  </div>
                </div>
                <V28Badge variant="premium">Master</V28Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Weitere Master-Accounts können über die Benutzerverwaltung hinzugefügt werden.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Registrierte Unternehmen */}
        <Card>
          <CardHeader>
            <CardTitle>Registrierte Unternehmen</CardTitle>
            <CardDescription>Alle registrierten Unternehmen mit Tarif-Details</CardDescription>
          </CardHeader>
          <CardContent>
            {companies.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">Keine Unternehmen registriert.</p>
            ) : (
              <div className="space-y-3">
                {companies.map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{company.name}</p>
                          <p className="text-sm text-muted-foreground">{company.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-sm">
                        <V28Badge variant={getTariffBadgeVariant(company.tariff)}>{company.tariff}</V28Badge>
                        {company.subscription_end_date && (
                          <span className="text-muted-foreground">
                            Läuft ab: {new Date(company.subscription_end_date).toLocaleDateString('de-DE')}
                          </span>
                        )}
                        {company.auto_renewal && (
                          <span className="text-xs text-success flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Auto-Verlängerung
                          </span>
                        )}
                      </div>
                    </div>
                    <V28Button variant="ghost" size="sm" onClick={() => setSelectedCompany(company)}>
                      <Eye className="h-4 w-4" />
                    </V28Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Company Detail Modal (Impressum + Tariff) */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCompany(null)}>
          <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">{selectedCompany.name}</h2>
              <button
                onClick={() => setSelectedCompany(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Tariff Section */}
              <div className="border border-border rounded-lg p-4 bg-muted/50">
                <h3 className="font-semibold text-foreground mb-3">Tarif-Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tarif</p>
                    <V28Badge variant={getTariffBadgeVariant(selectedCompany.tariff)} className="mt-1">
                      {selectedCompany.tariff}
                    </V28Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ablaufdatum</p>
                    <p className="text-foreground mt-1">
                      {selectedCompany.subscription_end_date
                        ? new Date(selectedCompany.subscription_end_date).toLocaleDateString('de-DE')
                        : 'Unbegrenzt'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Auto-Verlängerung</p>
                    <p className="text-foreground mt-1 flex items-center gap-1">
                      {selectedCompany.auto_renewal ? (
                        <>
                          <Check className="h-4 w-4 text-success" />
                          Aktiviert
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-destructive" />
                          Deaktiviert
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Registriert am</p>
                    <p className="text-foreground mt-1">{new Date(selectedCompany.created_at).toLocaleDateString('de-DE')}</p>
                  </div>
                </div>
              </div>

              {/* Impressum Section */}
              <div className="border border-border rounded-lg p-4 bg-muted/50">
                <h3 className="font-semibold text-foreground mb-3">Impressum</h3>
                <div className="space-y-2 text-sm">
                  {selectedCompany.company_name && (
                    <div>
                      <p className="text-muted-foreground">Firmenname</p>
                      <p className="text-foreground">{selectedCompany.company_name}</p>
                    </div>
                  )}
                  {selectedCompany.ceo_name && (
                    <div>
                      <p className="text-muted-foreground">Geschäftsführer</p>
                      <p className="text-foreground">{selectedCompany.ceo_name}</p>
                    </div>
                  )}
                  {(selectedCompany.street_address || selectedCompany.postal_code || selectedCompany.city) && (
                    <div>
                      <p className="text-muted-foreground">Adresse</p>
                      <p className="text-foreground">
                        {selectedCompany.street_address && `${selectedCompany.street_address}, `}
                        {selectedCompany.postal_code && `${selectedCompany.postal_code} `}
                        {selectedCompany.city}
                      </p>
                    </div>
                  )}
                  {selectedCompany.phone && (
                    <div>
                      <p className="text-muted-foreground">Telefon</p>
                      <p className="text-foreground">{selectedCompany.phone}</p>
                    </div>
                  )}
                  {selectedCompany.email && (
                    <div>
                      <p className="text-muted-foreground">E-Mail</p>
                      <p className="text-foreground">{selectedCompany.email}</p>
                    </div>
                  )}
                  {selectedCompany.commercial_register && (
                    <div>
                      <p className="text-muted-foreground">Handelsregister</p>
                      <p className="text-foreground">{selectedCompany.commercial_register}</p>
                    </div>
                  )}
                  {selectedCompany.tax_id && (
                    <div>
                      <p className="text-muted-foreground">Umsatzsteuer-ID</p>
                      <p className="text-foreground">{selectedCompany.tax_id}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <V28Button onClick={() => setSelectedCompany(null)}>Schließen</V28Button>
            </div>
          </div>
        </div>
      )}
    </StandardPageLayout>
  );
}
