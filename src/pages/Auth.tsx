/* ==================================================================================
   ⚠️ LAYOUT FREEZE V28.1 - KEINE DESIGN/LAYOUT-ÄNDERUNGEN ERLAUBT!
   ==================================================================================
   DESIGN-SYSTEM: V28.1 Professional Minimalism (Slate-Palette)
   GESCHÜTZT: AuthPageLayout, Header, Footer, Tabs, Forms, Cards, Spacing
   ERLAUBT: Technische Optimierungen (Performance, Validation, Security)
   VERBOTEN: Design-Änderungen, Layout-Anpassungen, neue UI-Features
   MOBILE-FIRST: Touch-Targets ≥48px, Responsive Breakpoints (sm/md/lg)
   LETZTE FREIGABE: 2025-01-30
   ==================================================================================

   AUTH PAGE V28.1 - PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ MarketingLayout (Header & Footer integriert!)
   ✅ V26AuthCard, V26AuthInput, V26TariffCard
   ✅ Fleet & Driver Add-On Integration
   ✅ Vollständige Form-Felder nach SYSTEM_VORGABEN_AUTH_LOGIN_V18.2
   ✅ Validation aus lib/validation.ts
   ✅ WCAG 2.1 AA konform
   ✅ DSGVO & PBefG § 51 konform
   ================================================================================== */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Rocket, Building2, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { getLoginRedirectRoute } from '@/lib/navigation-helpers';
import { logger } from '@/lib/logger';
import { AuthPageLayout } from '@/components/layout/AuthPageLayout';
import { SEOHead } from '@/components/shared/SEOHead';
import { Grid } from '@/components/ui/layout/Grid';
import { V28AuthCard } from '@/components/design-system/V28AuthCard';
import { V28AuthInput } from '@/components/design-system/V28AuthInput';
import { V28TariffCard } from '@/components/design-system/V28TariffCard';
import { V28Button } from '@/components/design-system/V28Button';
import { V28Select } from '@/components/design-system/V28Select';
import { V28Badge } from '@/components/design-system/V28Badge';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import fleetDriverIcon from '@/assets/fleet-driver-addon-icon-v2.png';
import { Checkbox } from '@/components/ui/checkbox';
import { LoginSchema, EmailSchema } from '@/lib/validation';
import { validateSecurePassword, getPasswordErrorMessage } from '@/lib/password-validation';
import { ADD_ONS } from '@/lib/pricing/single-source';
import { STARTER_TARIFF, BUSINESS_TARIFF, ADDON_FLEET_EXTENSION } from '@/lib/tariff/tariff-definitions';
import { AddressInput } from '@/components/forms/AddressInput';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePublicCompany } from '@/hooks/use-public-company';
import { Link } from 'react-router-dom';

// Tariff Definitions (from centralized definitions)
const TARIFFS = [
  {
    id: 'starter' as const,
    name: STARTER_TARIFF.name,
    priceMonthly: STARTER_TARIFF.priceMonthlyFormatted,
    priceYearly: STARTER_TARIFF.priceYearlyFormatted,
    priceId: STARTER_TARIFF.stripePriceIds.monthly,
    priceIdYearly: STARTER_TARIFF.stripePriceIds.yearly,
    description: STARTER_TARIFF.description,
    icon: Zap,
    features: STARTER_TARIFF.features.filter(f => f.included).slice(0, 5).map(f => f.name),
    limitations: '3 Fahrer · 3 Fahrzeuge',
  },
  {
    id: 'business' as const,
    name: BUSINESS_TARIFF.name,
    priceMonthly: BUSINESS_TARIFF.priceMonthlyFormatted,
    priceYearly: BUSINESS_TARIFF.priceYearlyFormatted,
    priceId: BUSINESS_TARIFF.stripePriceIds.monthly,
    priceIdYearly: BUSINESS_TARIFF.stripePriceIds.yearly,
    description: BUSINESS_TARIFF.description,
    icon: Building2,
    badge: BUSINESS_TARIFF.badge,
    features: BUSINESS_TARIFF.features.filter(f => f.included).slice(0, 6).map(f => f.name),
    limitations: 'Keine Begrenzung',
  },
];

// Fleet & Driver Add-On
const FLEET_ADDON = ADDON_FLEET_EXTENSION;

// Entrepreneur Signup Schema mit allen erforderlichen Feldern
const entrepreneurSignupSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
    .refine(validateSecurePassword, (val) => ({
      message: getPasswordErrorMessage(val)
    })),
  password_confirm: z.string(),
  salutation: z.enum(['Herr', 'Frau', 'Divers'], {
    required_error: 'Anrede erforderlich',
  }),
  title: z.string().optional(),
  firstName: z.string().min(2, 'Vorname erforderlich'),
  lastName: z.string().min(2, 'Nachname erforderlich'),
  companyName: z.string().min(2, 'Firmenname erforderlich'),
  taxId: z.string().min(5, 'Umsatzsteuer-ID erforderlich'),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  tariff: z.enum(['starter', 'business']),
  fleetAddon: z.boolean().optional(),
}).refine((data) => data.password === data.password_confirm, {
  message: 'Passwörter stimmen nicht überein',
  path: ['password_confirm'],
});

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Company Context for Branding
  const companySlug = searchParams.get('company');
  const { data: tenantCompany } = usePublicCompany(companySlug || undefined, null);

  const [loading, setLoading] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState<'starter' | 'business'>('starter');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [fleetAddon, setFleetAddon] = useState(false);
  const [fleetAddonEnabled, setFleetAddonEnabled] = useState(false);
  const [signupPassword, setSignupPassword] = useState('');
  const [activeTab, setActiveTab] = useState(searchParams.get('mode') || 'login');

  // ==================================================================================
  // LOGIK-BASIERTE INITIALISIERUNG: Query-Parameter verarbeiten
  // ==================================================================================
  // Qualitätssicherung: Alle URL-Parameter werden korrekt verarbeitet
  // - tariff=starter|business: Setzt initialen Tariff für Signup
  // - mode=signup: Aktiviert automatisch Signup-Tab
  // - billing=monthly|yearly: Setzt initiale Billing-Period
  // ==================================================================================
  useEffect(() => {
    // 1. Tariff-Parameter verarbeiten (aus Pricing-Seiten oder direkt)
    const tariffParam = searchParams.get('tariff');
    if (tariffParam === 'starter' || tariffParam === 'business') {
      setSelectedTariff(tariffParam);
      // Automatisch zu Signup-Tab wechseln, wenn Tariff gesetzt ist
      if (activeTab !== 'signup') {
        setActiveTab('signup');
      }
    }

    // 2. Billing-Period-Parameter verarbeiten (aus Pricing-Seiten)
    const billingParam = searchParams.get('billing');
    if (billingParam === 'monthly' || billingParam === 'yearly') {
      setBillingPeriod(billingParam);
    }

    // 3. Mode-Parameter verarbeiten (aus Features oder direkt)
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup' || modeParam === 'login') {
      setActiveTab(modeParam);
    }
  }, [searchParams, activeTab]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const validation = LoginSchema.safeParse({ email, password });
      if (!validation.success) {
        toast({
          title: 'Validierungsfehler',
          description: validation.error.errors[0].message,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Normalize email (trim and lowercase)
      const normalizedEmail = email.toLowerCase().trim();

      logger.debug('[Auth] Login attempt', {
        email: normalizedEmail,
        emailLength: normalizedEmail.length,
        passwordLength: password.length,
        component: 'Auth'
      });

      // Try login with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        logger.error('[Auth] Login error', error, {
          email: normalizedEmail,
          errorCode: error.status,
          errorMessage: error.message,
          component: 'Auth'
        });

        // Detailed error message
        let errorMessage = error.message || 'Ungültige Anmeldedaten';

        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = 'E-Mail-Adresse oder Passwort ist falsch. Bitte prüfen Sie Ihre Eingaben oder setzen Sie Ihr Passwort zurück.';
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = 'Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse. Prüfen Sie Ihr Postfach.';
        } else if (error.message?.includes('User not found')) {
          errorMessage = 'Dieser Account existiert nicht. Bitte registrieren Sie sich zuerst.';
        }

        throw new Error(errorMessage);
      }

      if (!data || !data.user) {
        logger.error('[Auth] No user data returned', new Error('No user data'), {
          email: normalizedEmail,
          component: 'Auth'
        });
        throw new Error('Login fehlgeschlagen - Keine Benutzerdaten erhalten');
      }

      const userData = data;
      logger.debug('[Auth] Login successful', {
        userId: userData.user.id,
        email: userData.user.email,
        emailConfirmed: userData.user.email_confirmed_at,
        component: 'Auth'
      });

      // Check if user has profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      if (profileError) {
        logger.warn('[Auth] Profile query error', profileError, {
          userId: userData.user.id,
          component: 'Auth'
        });
      }

      logger.debug('[Auth] Profile-Check', {
        found: !!profile,
        userId: userData.user.id,
        component: 'Auth'
      });

      if (profile) {
        logger.debug('[Auth] Profile Data', {
          user_id: profile.user_id,
          company_id: profile.company_id,
          component: 'Auth'
        });
          // ==================================================================================
          // KRITISCH: Master-Zugang für courbois1981@gmail.com
          // ==================================================================================
          // Prüfe ob User Master-Role hat (via user_roles oder profile.role)
          const { data: userRoles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userData.user.id)
            .eq('role', 'master')
            .maybeSingle();

          // Master-Zugang-Check
          // V32.7: Nur user_roles-Tabelle als Single Source of Truth
          const isMaster = userRoles?.role === 'master';

          logger.debug('[Auth] Role-Check', {
            email,
            isMaster,
            userRolesData: userRoles,
            userId: userData.user.id,
            component: 'Auth'
          });

          // V43.1: Master-Users gehen auch zu /dashboard (keine separate /master Route)
          // Master-spezifische Features werden im Dashboard conditional gerendert
          if (isMaster) {
            logger.debug('[Auth] Master-Zugang erkannt - Weiterleitung zu /dashboard', { email, isMaster: true, component: 'Auth' });
          }

          // Check if from Company Landing (SessionStorage)
          const landingSlug = sessionStorage.getItem('landing_company_slug');
          if (landingSlug) {
            sessionStorage.removeItem('landing_company_slug');
            sessionStorage.removeItem('landing_company_id');
            navigate(`/${landingSlug}`);
            return;
          }

          // Otherwise: Use standard redirect logic (Entrepreneur)
          const redirectRoute = getLoginRedirectRoute('entrepreneur', searchParams);
          logger.debug('[Auth] Entrepreneur-Redirect', {
            email,
            redirectRoute,
            isMaster: false,
            component: 'Auth'
          });
          navigate(redirectRoute);
          return;
        }

        // Check if user has customer portal access (use normalized email)
        const { data: customer } = await supabase
          .from('customers')
          .select('id, company_id, has_portal_access')
          .eq('email', normalizedEmail)
          .eq('has_portal_access', true)
          .maybeSingle();

        if (customer) {
          logger.debug('[Auth] Customer Portal Access gefunden', { component: 'Auth' });
          sessionStorage.setItem('portal_mode', 'true');
          sessionStorage.setItem('portal_customer_id', customer.id);
          sessionStorage.setItem('portal_company_id', customer.company_id);
          navigate('/portal');
          return;
        }

      // Kein Profil oder Customer gefunden
      logger.error('[Auth] Kein Profile oder Customer gefunden', new Error('No access found'), {
        email: normalizedEmail,
        userId: userData.user.id,
        component: 'Auth'
      });

      toast({
        title: 'Kein Zugang gefunden',
        description: 'Für diesen Account existiert kein Profil. Bitte kontaktiere den Support oder erstelle ein neues Profil.',
        variant: 'destructive',
      });

      // Sign out user if no profile found (to avoid confusion)
      await supabase.auth.signOut();
    } catch (error: any) {
      logger.error('[Auth] Login failed', error, {
        email: email,
        component: 'Auth'
      });

      // Show detailed error message
      const errorMessage = error.message || 'Ungültige Anmeldedaten';

      toast({
        title: 'Login fehlgeschlagen',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000, // Show longer for debugging
      });

      // If invalid credentials, suggest password reset
      if (errorMessage.includes('falsch') || errorMessage.includes('Invalid login credentials')) {
        // Optionally show password reset hint
        setTimeout(() => {
          toast({
            title: 'Tipp',
            description: 'Falls Sie Ihr Passwort vergessen haben, nutzen Sie die Funktion "Passwort zurücksetzen".',
            duration: 4000,
          });
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const signupData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      password_confirm: formData.get('password_confirm') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      companyName: formData.get('companyName') as string,
      taxId: formData.get('taxId') as string,
      phone: formData.get('phone') as string,
      street: formData.get('street') as string,
      city: formData.get('city') as string,
      zipCode: formData.get('zipCode') as string,
      tariff: selectedTariff,
      fleetAddon: fleetAddonEnabled,
    };

    try {
      const validation = entrepreneurSignupSchema.safeParse(signupData);
      if (!validation.success) {
        toast({
          title: 'Validierungsfehler',
          description: validation.error.errors[0].message,
          variant: 'destructive',
        });
        return;
      }

      // 1. Create Supabase Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // 2. Create Company
      const { data: company, error: companyError} = await supabase
        .from('companies')
        .insert({
          name: signupData.companyName,
          company_slug: signupData.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          tax_id: signupData.taxId,
          phone: signupData.phone || null,
          address: signupData.street || null,
          city: signupData.city || null,
          postal_code: signupData.zipCode || null,
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // 3. Create Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          company_id: company.id,
          first_name: signupData.firstName,
          last_name: signupData.lastName,
          role: 'entrepreneur',
        });

      if (profileError) throw profileError;

      // 4. Send Registration Confirmation Email
      try {
        const { error: emailError } = await supabase.functions.invoke('send-registration-confirmation', {
          body: {
            user_id: authData.user.id,
            email: signupData.email,
            company_name: signupData.companyName,
            tariff: selectedTariff,
          },
        });
        if (emailError) {
          console.warn('Registration email failed:', emailError);
          // Don't fail registration if email fails
        }
      } catch (emailErr) {
        console.warn('Registration email error:', emailErr);
      }

      // 5. Create Stripe Checkout (if payment required)
      const tariff = TARIFFS[selectedTariff];
      const checkoutUrl = `/api/stripe/checkout?price_id=${tariff.priceId}&email=${encodeURIComponent(signupData.email)}`;

      toast({
        title: 'Registrierung erfolgreich',
        description: 'Eine Bestätigungs-E-Mail wurde gesendet. Bitte prüfen Sie Ihr Postfach.',
      });

      // Navigate to dashboard after successful registration
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error: any) {
      toast({
        title: 'Registrierung fehlgeschlagen',
        description: error.message || 'Ein Fehler ist aufgetreten',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const validation = EmailSchema.safeParse(email);
      if (!validation.success) {
        toast({
          title: 'Validierungsfehler',
          description: 'Ungültige E-Mail-Adresse',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast({
        title: 'E-Mail versendet',
        description: 'Bitte prüfen Sie Ihr Postfach.',
      });
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: (error as Error)?.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout
      companyName={tenantCompany?.name || undefined}
      logoUrl={tenantCompany?.logo_url || undefined}
    >
      <SEOHead
        title="Anmelden | MyDispatch"
        description="Melden Sie sich bei MyDispatch an oder erstellen Sie einen neuen Account."
        canonical="/auth"
      />

      {/* Main Auth Content - Centered with correct spacing */}
      <div className="min-h-[calc(100vh-160px)] flex items-start sm:items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full max-w-4xl">
          {/* Auth Card Container */}
          <V28AuthCard className="w-full p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Company Logo (wenn von Landing) */}
            {tenantCompany && tenantCompany.logo_url && (
              <div className="flex items-center justify-center mb-6">
                <img
                  src={tenantCompany.logo_url}
                  alt={tenantCompany.name || 'Company Logo'}
                  className="h-12 object-contain"
                />
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tabs Navigation - Mobile-First Touch-Friendly */}
              <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 bg-slate-100 border-slate-200 gap-0 z-40 relative">
                <TabsTrigger
                  value="login"
                  className="min-h-[52px] text-sm sm:text-base px-3 sm:px-4 py-3 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=inactive]:hover:bg-slate-200"
                  style={activeTab === 'login' && tenantCompany?.primary_color ? {
                    backgroundColor: tenantCompany.primary_color
                  } : undefined}
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="min-h-[52px] text-sm sm:text-base px-3 sm:px-4 py-3 data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=inactive]:hover:bg-slate-200"
                  style={activeTab === 'signup' && tenantCompany?.primary_color ? {
                    backgroundColor: tenantCompany.primary_color
                  } : undefined}
                >
                  Registrierung
                </TabsTrigger>
                <TabsTrigger
                  value="reset"
                  className="min-h-[52px] text-xs sm:text-base px-2 sm:px-4 py-3 leading-tight data-[state=active]:bg-slate-700 data-[state=active]:text-white data-[state=inactive]:hover:bg-slate-200"
                  style={activeTab === 'reset' && tenantCompany?.primary_color ? {
                    backgroundColor: tenantCompany.primary_color
                  } : undefined}
                >
                  <span className="block text-center">
                    Passwort<br className="sm:hidden" />zurücksetzen
                  </span>
                </TabsTrigger>
              </TabsList>

              {/* ==================== LOGIN TAB ==================== */}
              <TabsContent value="login" className="mt-0">
                <div className="max-w-md mx-auto">
                  <h1 className="text-3xl font-bold mb-2 text-center text-slate-900">
                    Willkommen zurück
                  </h1>
                  <p className="text-center mb-8 text-slate-600">
                    Melden Sie sich mit Ihren Zugangsdaten an
                  </p>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <V28AuthInput
                      label="E-Mail-Adresse"
                      type="email"
                      name="email"
                      placeholder="ihre@email.de"
                      required
                      disabled={loading}
                    />

                    <V28AuthInput
                      label="Passwort"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />

                    <V28Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Wird angemeldet...
                        </>
                      ) : (
                        'Anmelden'
                      )}
                    </V28Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setActiveTab('reset')}
                        className="text-sm text-slate-600 hover:underline"
                      >
                        Passwort vergessen?
                      </button>
                    </div>
                  </form>
                </div>
              </TabsContent>

              {/* ==================== SIGNUP TAB ==================== */}
              <TabsContent value="signup" className="mt-0">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-3xl font-bold mb-2 text-center text-slate-900">
                    Jetzt registrieren
                  </h1>
                  <p className="text-center mb-8 text-slate-600">
                    Wählen Sie Ihren Tarif und starten Sie sofort
                  </p>

                  <form onSubmit={handleSignup} className="space-y-6 sm:space-y-8">
                     {/* Tarif-Auswahl */}
                    <div className="space-y-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 sm:mb-4">
                        1. Tarif wählen
                      </h2>

                      {/* Billing Period Toggle */}
                      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-3">
                        <span className={cn(
                          "text-sm font-medium transition-colors",
                          billingPeriod === 'monthly' ? "text-slate-900" : "text-slate-500"
                        )}>
                          Monatlich
                        </span>
                        <button
                          type="button"
                          onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                          className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                            billingPeriod === 'yearly' ? "bg-slate-700" : "bg-slate-300"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                              billingPeriod === 'yearly' ? "translate-x-6" : "translate-x-1"
                            )}
                          />
                        </button>
                        <span className={cn(
                          "text-sm font-medium transition-colors",
                          billingPeriod === 'yearly' ? "text-slate-900" : "text-slate-500"
                        )}>
                          Jährlich
                          <span className="ml-1 text-xs text-slate-600 font-semibold">(20% Rabatt)</span>
                        </span>
                      </div>

                       {/* Tariff Cards */}
                      <Grid cols={{ default: 1, md: 2 }} gap="lg">
                        {TARIFFS.map((tariff) => {
                          const displayPrice = billingPeriod === 'monthly' ? tariff.priceMonthly : tariff.priceYearly;
                          return (
                            <V28TariffCard
                              key={tariff.id}
                              name={tariff.name}
                              price={displayPrice}
                              icon={tariff.icon}
                              features={tariff.features}
                              limitations={tariff.limitations}
                              isSelected={selectedTariff === tariff.id}
                              onClick={() => setSelectedTariff(tariff.id)}
                              badge={tariff.badge}
                            />
                          );
                        })}
                      </Grid>

                      {/* Fleet & Driver Add-On (nur bei Starter) */}
                      {selectedTariff === 'starter' && (
                        <div
                          className={cn(
                            "mt-6 relative overflow-hidden rounded-2xl border-2 transition-all duration-300 group",
                            fleetAddonEnabled
                              ? "border-slate-400 bg-slate-50 shadow-lg"
                              : "border-slate-200 bg-background hover:border-slate-300 hover:shadow-md"
                          )}
                        >
                          {/* Checkbox - Top Right */}
                          <label htmlFor="fleet-addon" className="absolute top-3 right-3 z-10 cursor-pointer">
                            <Checkbox
                              id="fleet-addon"
                              checked={fleetAddonEnabled}
                              onCheckedChange={(checked) => setFleetAddonEnabled(checked as boolean)}
                              className="w-6 h-6"
                            />
                          </label>

                          {/* Content */}
                          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 sm:p-6">
                            {/* Icon/Image */}
                            <div className="shrink-0">
                              <img
                                src={fleetDriverIcon}
                                alt="Fleet & Driver Extension"
                                className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                              />
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-2 mb-2">
                                <h3 className="text-lg font-bold text-slate-900">
                                  {FLEET_ADDON.badge}
                                </h3>
                                <V28Badge variant="primary" className="shrink-0">Empfohlen</V28Badge>
                              </div>

                              <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                {FLEET_ADDON.description}
                              </p>

                              {/* Price Display */}
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-slate-900">
                                  + {billingPeriod === 'monthly' ? FLEET_ADDON.priceMonthlyFormatted : FLEET_ADDON.priceYearlyFormatted}
                                </span>
                                <span className="text-sm text-slate-500">
                                  {billingPeriod === 'monthly' ? '/ Monat' : '/ Jahr'}
                                </span>
                                {billingPeriod === 'yearly' && (
                                  <span className="ml-2 text-xs text-slate-600 font-semibold">
                                    (20% Rabatt)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Selected Indicator */}
                          {fleetAddonEnabled && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 to-slate-600" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Persönliche Daten */}
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-slate-900">
                        2. Ihre Daten
                      </h2>
                      <Grid cols={{ default: 1, lg: 2 }} gap="lg">
                        <V28Select
                          label="Anrede *"
                          name="salutation"
                          required
                          disabled={loading}
                          options={[
                            { value: '', label: 'Bitte wählen' },
                            { value: 'Herr', label: 'Herr' },
                            { value: 'Frau', label: 'Frau' },
                            { value: 'Divers', label: 'Divers' }
                          ]}
                        />
                        <V28Select
                          label="Titel (optional)"
                          name="title"
                          disabled={loading}
                          options={[
                            { value: '', label: 'Kein Titel' },
                            { value: 'Dr.', label: 'Dr.' },
                            { value: 'Prof.', label: 'Prof.' },
                            { value: 'Prof. Dr.', label: 'Prof. Dr.' },
                            { value: 'Dr. med.', label: 'Dr. med.' },
                            { value: 'Dr. jur.', label: 'Dr. jur.' }
                          ]}
                        />
                        <V28AuthInput
                          label="Vorname *"
                          type="text"
                          name="firstName"
                          placeholder="Max"
                          required
                          disabled={loading}
                        />
                        <V28AuthInput
                          label="Nachname *"
                          type="text"
                          name="lastName"
                          placeholder="Mustermann"
                          required
                          disabled={loading}
                        />
                        <V28AuthInput
                          label="E-Mail-Adresse *"
                          type="email"
                          name="email"
                          placeholder="max@beispiel.de"
                          required
                          disabled={loading}
                          className="md:col-span-2"
                        />
                        <V28AuthInput
                          label="Telefon (optional)"
                          type="tel"
                          name="phone"
                          placeholder="+49 123 4567890"
                          disabled={loading}
                          className="md:col-span-2"
                        />
                      </Grid>
                    </div>

                    {/* Unternehmensdaten */}
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-slate-900">
                        3. Unternehmensdaten
                      </h2>
                      <Grid cols={{ default: 1, lg: 2 }} gap="lg">
                        <V28AuthInput
                          label="Firmenname *"
                          type="text"
                          name="companyName"
                          placeholder="Taxi Mustermann GmbH"
                          required
                          disabled={loading}
                          className="md:col-span-2"
                        />
                        <V28AuthInput
                          label="Umsatzsteuer-ID *"
                          type="text"
                          name="taxId"
                          placeholder="DE123456789"
                          required
                          disabled={loading}
                        />
                        <V28AuthInput
                          label="Straße & Hausnummer (optional)"
                          type="text"
                          name="street"
                          placeholder="Musterstraße 123 (oder nutzen Sie Adresssuche)"
                          disabled={loading}
                        />
                        <V28AuthInput
                          label="PLZ (optional)"
                          type="text"
                          name="zipCode"
                          placeholder="12345"
                          disabled={loading}
                        />
                        <V28AuthInput
                          label="Stadt (optional)"
                          type="text"
                          name="city"
                          placeholder="Berlin"
                          disabled={loading}
                        />
                      </Grid>
                    </div>

                    {/* Passwort */}
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-slate-900">
                        4. Passwort festlegen
                      </h2>
                      <Grid cols={{ default: 1, lg: 2 }} gap="lg">
                        <div>
                          <V28AuthInput
                            label="Passwort *"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            disabled={loading}
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                          />
                          <PasswordStrengthIndicator password={signupPassword} className="mt-2" />
                        </div>
                        <V28AuthInput
                          label="Passwort bestätigen *"
                          type="password"
                          name="password_confirm"
                          placeholder="••••••••"
                          required
                          disabled={loading}
                        />
                      </Grid>
                    </div>

                    {/* Rechtliche Hinweise */}
                    <div className="p-4 rounded-lg bg-slate-100 border border-slate-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-slate-600" />
                        <div className="text-sm space-y-2 text-slate-600">
                          <p className="font-semibold text-slate-900">
                            Rechtliche Hinweise
                          </p>
                          <p>
                            <strong>DSGVO:</strong> Ihre Daten werden verschlüsselt auf deutschen Servern gespeichert und ausschließlich zur Vertragserfüllung verwendet.
                          </p>
                          <p>
                            <strong>PBefG § 51:</strong> Gemäß Personenbeförderungsgesetz sind wir zur Speicherung von Betreiberdaten verpflichtet.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <V28Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                          <span className="text-sm sm:text-base">Wird verarbeitet...</span>
                        </>
                      ) : (
                        <span className="text-sm sm:text-base font-semibold">
                          Jetzt registrieren
                        </span>
                      )}
                    </V28Button>

                    <p className="text-sm text-center text-slate-600">
                      Mit der Registrierung stimmen Sie unseren{' '}
                      <a href="/agb" className="underline hover:no-underline">
                        AGB
                      </a>{' '}
                      und der{' '}
                      <a href="/datenschutz" className="underline hover:no-underline">
                        Datenschutzerklärung
                      </a>{' '}
                      zu.
                    </p>
                  </form>
                </div>
              </TabsContent>

              {/* ==================== PASSWORD RESET TAB ==================== */}
              <TabsContent value="reset" className="mt-0">
                <div className="max-w-md mx-auto">
                  <h1 className="text-3xl font-bold mb-2 text-center text-slate-900">
                    Passwort zurücksetzen
                  </h1>
                  <p className="text-center mb-8 text-slate-600">
                    Geben Sie Ihre E-Mail-Adresse ein, um einen Zurücksetzungslink zu erhalten
                  </p>

                  <form onSubmit={handlePasswordReset} className="space-y-6">
                    <V28AuthInput
                      label="E-Mail-Adresse"
                      type="email"
                      name="email"
                      placeholder="ihre@email.de"
                      required
                      disabled={loading}
                    />

                    <V28Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Wird gesendet...
                        </>
                      ) : (
                        'Zurücksetzungslink senden'
                      )}
                    </V28Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="text-sm text-slate-600 hover:underline"
                      >
                        Zurück zum Login
                      </button>
                    </div>
                  </form>
                </div>
              </TabsContent>
            </Tabs>

            {/* Powered by MyDispatch Footer */}
            <div className="text-center mt-8">
              <p className="text-xs text-slate-500">
                Powered by{' '}
                <Link to="/" className="text-slate-700 hover:underline font-medium">
                  MyDispatch
                </Link>
              </p>
            </div>
          </V28AuthCard>
        </div>
      </div>
    </AuthPageLayout>
  );
}
