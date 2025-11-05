/* ==================================================================================
   KRITISCHER HINWEIS: Portal Auth - KUNDEN-LOGIN (SEPARATE AUTH!)
   ==================================================================================
   Separate Authentifizierung für Portal-Kunden mit has_portal_access=true
   ================================================================================== */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { V28Button } from '@/components/design-system/V28Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { SEOHead } from '@/components/shared/SEOHead';
import { handleError } from '@/lib/error-handler';
import { z } from 'zod';
import { usePortalTheme } from '@/hooks/use-portal-theme';
import { getPortalPrimaryColor } from '@/lib/portal-theme';
import { AuthForm } from '@/components/forms/wrapped';

interface CompanyBranding {
  id: string;
  name: string;
  logo_url: string | null;
  primary_color: string | null;
}

const portalLoginSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein'),
});

const portalRegisterSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein'),
  firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen lang sein'),
  lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen lang sein'),
  phone: z.string().optional(),
});

export default function PortalAuth() {
  const [loading, setLoading] = useState(false);
  const [brandingLoading, setBrandingLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('login');
  const [company, setCompany] = useState<CompanyBranding | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // ✅ V36.0: Portal-Theme aus Hook
  const companyId = searchParams.get('company');
  const { theme: portalTheme } = usePortalTheme({ companyId });

  // Login Form
  const loginForm = useForm({
    resolver: zodResolver(portalLoginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Register Form
  const registerForm = useForm({
    resolver: zodResolver(portalRegisterSchema),
    defaultValues: { email: '', password: '', firstName: '', lastName: '', phone: '' },
  });

  // Load company branding
  useEffect(() => {
    fetchCompanyBranding();
  }, [searchParams]);

  // Set initial tab from URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'register') {
      setActiveTab('register');
    }
  }, [searchParams]);

  const fetchCompanyBranding = async () => {
    try {
      const companyId = searchParams.get('company');
      if (!companyId) {
        setBrandingLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('companies')
        .select('id, name, logo_url, primary_color')
        .eq('id', companyId)
        .single();

      if (error) throw error;
      setCompany(data);
    } catch (error: Error | unknown) {
      handleError(error, 'Fehler beim Laden der Firmendaten', { showToast: false });
    } finally {
      setBrandingLoading(false);
    }
  };

  const handlePortalLogin = async (data: z.infer<typeof portalLoginSchema>) => {
    setLoading(true);

    const { email, password } = data;

    try {

      // Standard Supabase Auth Login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Login fehlgeschlagen');

      // Prüfe ob Kunde Portal-Zugang hat
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id, has_portal_access, company_id, first_name, last_name')
        .eq('email', email)
        .eq('has_portal_access', true)
        .single();

      if (customerError || !customerData) {
        // Logout wenn kein Portal-Zugang
        await supabase.auth.signOut();
        throw new Error('Kein Portal-Zugang. Bitte kontaktieren Sie Ihr Unternehmen.');
      }

      // Speichere Portal-Session-Info
      sessionStorage.setItem('portal_customer_id', customerData.id);
      sessionStorage.setItem('portal_company_id', customerData.company_id);
      sessionStorage.setItem('portal_mode', 'true');

      toast({
        title: `Willkommen, ${customerData.first_name}!`,
        description: 'Sie wurden erfolgreich angemeldet.',
      });
      
      navigate('/portal');
    } catch (error: Error | unknown) {
      toast({
        title: 'Anmeldefehler',
        description: error.message || 'Bitte überprüfen Sie Ihre Anmeldedaten.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePortalRegister = async (data: z.infer<typeof portalRegisterSchema>) => {
    setLoading(true);

    const { email, password, firstName, lastName, phone } = data;

    try {

      // Hole Company ID aus URL-Parameter (von Widget)
      const companyId = searchParams.get('company');
      if (!companyId) {
        throw new Error('Ungültiger Registrierungslink. Bitte nutzen Sie das Buchungswidget.');
      }

      // 1. Supabase Auth Registrierung
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/portal/auth`,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Registrierung fehlgeschlagen');

      // 2. Kunde in DB anlegen mit Portal-Zugang
      const { error: customerError } = await supabase
        .from('customers')
        .insert([{
          company_id: companyId,
          email: email,
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          has_portal_access: true,
          customer_type: 'Privatkunde',
        }]);

      if (customerError) {
        // Rollback Auth-User bei Fehler
        await supabase.auth.signOut();
        throw customerError;
      }

      toast({
        title: 'Registrierung erfolgreich!',
        description: 'Sie können sich jetzt anmelden.',
      });

      // Tab auf Login setzen und Form reset
      setActiveTab('login');
      registerForm.reset();
    } catch (error: Error | unknown) {
      toast({
        title: 'Registrierungsfehler',
        description: error.message || 'Registrierung fehlgeschlagen.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const email = (document.getElementById('portal-email') as HTMLInputElement)?.value;
    
    if (!email) {
      toast({
        title: 'Fehler',
        description: 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/portal/auth`,
      });

      if (error) throw error;

      toast({
        title: 'E-Mail gesendet!',
        description: 'Bitte überprüfen Sie Ihr Postfach für den Passwort-Reset-Link.',
      });
    } catch (error: Error | unknown) {
      toast({
        title: 'Fehler',
        description: error.message || 'Passwort-Reset fehlgeschlagen.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ V36.0: Zentrales Portal-Theme (mit Fallback für Rückwärtskompatibilität)
  const primaryColor = portalTheme?.primaryColor || getPortalPrimaryColor(company || {});
  const companyName = portalTheme?.companyName || company?.name || 'Kunden-Portal';

  if (brandingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={`${companyName} - Kunden-Login`}
        description={`Melden Sie sich im Kunden-Portal von ${companyName} an.`}
        canonical="/portal/auth"
      />
      
      <div className="min-h-screen bg-background flex flex-col">
        {/* Gebrandeter Header */}
        <header 
          className="sticky top-0 z-50 shadow-sm"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {company?.logo_url && (
                <img 
                  src={company.logo_url} 
                  alt={`${companyName} Logo`}
                  className="h-10 w-auto object-contain"
                />
              )}
              <span className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {companyName}
              </span>
            </div>
            <V28Button
              variant="secondary"
              onClick={() => navigate(company ? `/${company.id}` : '/home')}
              className="h-9 px-3 sm:px-4 text-sm font-medium text-foreground hover:bg-foreground/10 rounded-md"
            >
              <ArrowLeft className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Zurück</span>
            </V28Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <Card className="w-full max-w-md shadow-elegant">
            <CardHeader className="space-y-2 text-center">
              {company?.logo_url && (
                <div className="flex justify-center mb-4">
                  <img 
                    src={company.logo_url} 
                    alt={`${companyName} Logo`}
                    className="h-16 w-auto object-contain"
                  />
                </div>
              )}
              <CardTitle className="text-2xl font-bold">{companyName}</CardTitle>
              <CardDescription>
                Melden Sie sich an oder erstellen Sie ein Konto
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="login" className="min-h-[44px]">
                    <LogIn className="h-4 w-4 mr-2" />
                    Anmelden
                  </TabsTrigger>
                  <TabsTrigger value="register" className="min-h-[44px]">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Registrieren
                  </TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <AuthForm
                    form={loginForm}
                    onSubmit={handlePortalLogin}
                    mode="login"
                    portal="customer"
                    loading={loading}
                  />
                  <V28Button
                    type="button"
                    variant="secondary"
                    className="w-full mt-4"
                    onClick={handleResetPassword}
                    disabled={loading}
                  >
                    Passwort vergessen?
                  </V28Button>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register">
                  <AuthForm
                    form={registerForm}
                    onSubmit={handlePortalRegister}
                    mode="signup"
                    portal="customer"
                    loading={loading}
                  />
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
                <p>Bei Fragen zur Registrierung:</p>
                <p className="mt-1">Kontaktieren Sie {companyName}</p>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer mit Powered by MyDispatch - Optimiertes Padding */}
        <footer className="border-t bg-muted/30 py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
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
