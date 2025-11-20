/* ==================================================================================
   KRITISCHER HINWEIS: Portal Dashboard - KUNDEN-PORTAL
   ==================================================================================
   Geschütztes Portal für Kunden mit has_portal_access=true
   Features: Auftrags-Historie, Neue Buchung, Profilverwaltung
   ================================================================================== */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { V28Button } from '@/components/design-system/V28Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { V28Dialog } from '@/components/design-system/V28Dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogOut, Calendar, PlusCircle, User, FileText } from 'lucide-react';
import { SEOHead } from '@/components/shared/SEOHead';
import { StatusIndicator, getBookingStatusType, getPaymentStatusType } from '@/components/shared/StatusIndicator';
import { formatCurrency } from '@/lib/format-utils';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { handleError } from '@/lib/error-handler';
import { OfflineIndicator } from '@/components/portal/OfflineIndicator';
import { HeroSection, ResponsiveBadge } from '@/components/design-system';
import { StatCard } from '@/components/smart-templates/StatCard';
import { useCachedPortalTheme } from '@/hooks/use-portal-theme';
import { logger } from '@/lib/logger';
import { PortalBookingForm } from '@/components/forms/wrapped';

// Portal Booking Schema
const portalBookingSchema = z.object({
  pickupAddress: z.string().min(5, 'Abholadresse erforderlich'),
  dropoffAddress: z.string().min(5, 'Zieladresse erforderlich'),
  pickupTime: z.string().min(1, 'Abholzeit erforderlich'),
  vehicleType: z.string().min(1, 'Fahrzeugklasse erforderlich'),
  passengers: z.string().default('1'),
  luggage: z.string().default('0'),
  specialRequests: z.string().optional(),
});

interface Booking {
  id: string;
  pickup_address: string;
  dropoff_address: string;
  pickup_time: string;
  status: string;
  price: number | null;
  vehicle_type: string;
  payment_status: string;
  created_at: string;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company_id: string;
}

export default function Portal() {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ V36.0: Zentrales Portal-Theme-System - HOOKS VOR EARLY RETURNS
  const portalTheme = useCachedPortalTheme();
  const companyName = portalTheme?.companyName || 'Kunden-Portal';
  const companyLogo = portalTheme?.logoUrl;
  const primaryColor = portalTheme?.primaryColor || '#EADEBD';

  // Portal Booking Form
  const bookingForm = useForm({
    resolver: zodResolver(portalBookingSchema),
    defaultValues: {
      pickupAddress: '',
      dropoffAddress: '',
      pickupTime: '',
      vehicleType: '',
      passengers: '1',
      luggage: '0',
      specialRequests: '',
    },
  });

  useEffect(() => {
    checkPortalAuth();
  }, []);

  const checkPortalAuth = async () => {
    try {
      const portalMode = sessionStorage.getItem('portal_mode');
      const customerId = sessionStorage.getItem('portal_customer_id');
      const companyId = sessionStorage.getItem('portal_company_id');

      if (!portalMode || !customerId || !companyId) {
        navigate('/portal/auth');
        return;
      }

      // Hole Auth Session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/portal/auth');
        return;
      }

      // Hole Kundendaten UND Company-Branding
      // 🔒 SECURITY: Use companies_public_info view for public branding data
      const [customerResult, companyResult] = await Promise.all([
        supabase
          .from('customers')
          .select('*')
          .eq('id', customerId)
          .eq('has_portal_access', true)
          .single(),
        supabase
          .from('companies_public_info')
          .select('id, name, logo_url, primary_color')
          .eq('id', companyId)
          .maybeSingle()
      ]);

      if (customerResult.error || !customerResult.data) {
        await handleLogout();
        return;
      }

      if (companyResult.error || !companyResult.data) {
        // Fallback: Zeige Portal ohne Company-Branding
        logger.warn('[Portal] Company branding could not be loaded', { component: 'Portal' });
      }

      setCustomer(customerResult.data as unknown as Customer);
      
      // Company-Branding für Header/Footer
      if (companyResult.data) {
        (window as any).__portalCompany = companyResult.data;
      }

      await fetchBookings(customerId);
    } catch (error) {
      handleError(error, 'Portal-Authentifizierung fehlgeschlagen', { showToast: false });
      navigate('/portal/auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_id', customerId)
        .eq('archived', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings((data || []) as unknown as Booking[]);
    } catch (error: any) {
      handleError(error, 'Aufträge konnten nicht geladen werden');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem('portal_customer_id');
    sessionStorage.removeItem('portal_company_id');
    sessionStorage.removeItem('portal_mode');
    
    toast({
      title: 'Abgemeldet',
      description: 'Sie wurden erfolgreich abgemeldet.',
    });
    
    navigate('/portal/auth');
  };

  const handleNewBooking = async (data: z.infer<typeof portalBookingSchema>) => {
    if (!customer) return;

    setSubmitting(true);

    try {
      // 🔒 SECURITY: Use edge function for server-side validation
      const { data: result, error } = await supabase.functions.invoke('portal-create-booking', {
        body: {
          company_id: customer.company_id,
          customer_id: customer.id,
          pickup_address: data.pickupAddress,
          dropoff_address: data.dropoffAddress,
          pickup_time: new Date(data.pickupTime).toISOString(),
          vehicle_type: data.vehicleType,
          passengers: parseInt(data.passengers) || 1,
          luggage: parseInt(data.luggage) || 0,
          special_requests: data.specialRequests || '',
        },
      });

      if (error) {
        logger.error('[Portal] Edge function error', error, { component: 'Portal' });
        throw new Error(error.message || 'Buchung konnte nicht erstellt werden');
      }

      if (!result?.success) {
        throw new Error(result?.error || 'Buchung fehlgeschlagen');
      }

      toast({
        title: 'Buchung erfolgreich!',
        description: 'Ihre Buchungsanfrage wurde übermittelt.',
      });

      setIsNewBookingOpen(false);
      await fetchBookings(customer.id);
      bookingForm.reset();
    } catch (error: any) {
      logger.error('[Portal] Booking error', error, { component: 'Portal' });
      toast({
        title: 'Fehler',
        description: error.message || 'Buchung konnte nicht erstellt werden.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <>
      <SEOHead 
        title={`${companyName} - Kunden-Portal Dashboard`}
        description={`Verwalten Sie Ihre Buchungen im ${companyName} Kunden-Portal.`}
        canonical="/portal"
      />
      
      <div className="min-h-screen bg-background flex flex-col">
        {/* Hero Section mit Company-Branding */}
        <HeroSection
          variant="portal"
          title={`Willkommen, ${customer.first_name}!`}
          subtitle="Ihr Kunden-Portal"
          description="Verwalten Sie Ihre Buchungen und sehen Sie Ihre Auftrags-Historie."
          backgroundType="gradient"
          companyBranding={{
            logo: companyLogo,
            primaryColor: primaryColor,
            name: companyName,
          }}
          secondaryCTA={{
            text: 'Abmelden',
            icon: LogOut,
            onClick: handleLogout,
          }}
          className="py-6 sm:py-8 md:py-12"
        />

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* P1-OPTIMIERUNG: Offline-Indicator */}
          <OfflineIndicator />
          
          {/* KPI Cards - Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatCard
              label="Gesamtbuchungen"
              value={bookings.length.toString()}
              icon={Calendar}
            />
            <StatCard
              label="Ausstehend"
              value={bookings.filter(b => b.status === 'pending').length.toString()}
              icon={FileText}
            />
            <StatCard
              label="Abgeschlossen"
              value={bookings.filter(b => b.status === 'completed').length.toString()}
              icon={Calendar}
            />
          </div>

          <Tabs defaultValue="bookings" className="space-y-4 sm:space-y-6">
            <TabsList className="min-h-[44px]">
              <TabsTrigger value="bookings" className="text-sm sm:text-base min-h-[44px]">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 shrink-0" />
                Meine Buchungen
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-sm sm:text-base min-h-[44px]">
                <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 shrink-0" />
                Profil
              </TabsTrigger>
            </TabsList>

            {/* Buchungen Tab */}
            <TabsContent value="bookings" className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">Auftrags-Historie</h2>
                <V28Button 
                  onClick={() => setIsNewBookingOpen(true)}
                  className="w-full sm:w-auto min-h-[44px]"
                  variant="primary"
                >
                  <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 shrink-0" />
                  Neue Buchung
                </V28Button>
              </div>

              {/* Portal Booking Form */}
              <PortalBookingForm
                form={bookingForm}
                onSubmit={handleNewBooking}
                mode="dialog"
                portal="customer"
                dialogOpen={isNewBookingOpen}
                onDialogOpenChange={setIsNewBookingOpen}
                loading={submitting}
              />

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto scrollbar-hide">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Datum</TableHead>
                          <TableHead>Von</TableHead>
                          <TableHead>Nach</TableHead>
                          <TableHead>Fahrzeug</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Zahlung</TableHead>
                          <TableHead className="text-right">Preis</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-6 sm:py-8">
                              <FileText className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 mx-auto mb-2 sm:mb-3 opacity-50 text-muted-foreground" />
                              <p className="text-sm sm:text-base md:text-lg text-muted-foreground">Noch keine Buchungen vorhanden.</p>
                              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">Erstellen Sie Ihre erste Buchung!</p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          bookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="text-xs sm:text-sm md:text-base">
                                {format(new Date(booking.pickup_time), 'dd.MM.yyyy HH:mm', { locale: de })}
                              </TableCell>
                              <TableCell className="max-w-[150px] sm:max-w-[200px] md:max-w-[250px] truncate text-xs sm:text-sm md:text-base">
                                {booking.pickup_address}
                              </TableCell>
                              <TableCell className="max-w-[150px] sm:max-w-[200px] md:max-w-[250px] truncate text-xs sm:text-sm md:text-base">
                                {booking.dropoff_address}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm md:text-base">{booking.vehicle_type}</TableCell>
                              <TableCell>
                                <ResponsiveBadge
                                  variant={getBookingStatusType(booking.status) === 'success' ? 'success' : 'warning'}
                                  size="xs"
                                >
                                  {booking.status}
                                </ResponsiveBadge>
                              </TableCell>
                              <TableCell>
                                <ResponsiveBadge
                                  variant={getPaymentStatusType(booking.payment_status) === 'success' ? 'success' : 'warning'}
                                  size="xs"
                                >
                                  {booking.payment_status}
                                </ResponsiveBadge>
                              </TableCell>
                              <TableCell className="text-right font-medium text-xs sm:text-sm md:text-base">
                                {booking.price ? formatCurrency(booking.price) : '—'}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profil Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl md:text-2xl">Mein Profil</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Ihre persönlichen Informationen
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs sm:text-sm">Vorname</Label>
                      <p className="font-medium text-sm sm:text-base md:text-lg">{customer.first_name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs sm:text-sm">Nachname</Label>
                      <p className="font-medium text-sm sm:text-base md:text-lg">{customer.last_name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs sm:text-sm">E-Mail</Label>
                      <p className="font-medium text-sm sm:text-base md:text-lg">{customer.email || '—'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs sm:text-sm">Telefon</Label>
                      <p className="font-medium text-sm sm:text-base md:text-lg">{customer.phone || '—'}</p>
                    </div>
                  </div>
                  <div className="pt-3 sm:pt-4 border-t">
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                      Für Änderungen Ihrer Daten kontaktieren Sie bitte Ihr Taxi-Unternehmen.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer mit Powered by MyDispatch - Optimiertes Padding */}
        <footer className="border-t bg-muted/30 py-3 sm:py-4 md:py-5 mt-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm md:text-base text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {companyName} · Powered by{' '}
              <a 
                href="https://mydispatch.de" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                MyDispatch
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
