/* ==================================================================================
   UNTERNEHMER-LANDINGPAGE (TENANT-LANDINGPAGE)
   ==================================================================================
   VISUELL FINAL | Funktionale Erweiterung erlaubt | CI-konform
   - Öffentliche Landingpage für Taxi-/Mietwagenunternehmen
   - Dynamische Inhalte aus Company-Entity
   - Responsiv, DSGVO-konform
   
   TARIF-LOGIK V18.2.8:
   - Landingpage: ALLE Tarife (Starter, Business, Enterprise)
   - Booking-Widget: NUR Business/Enterprise
   - Customer-Login: NUR Business/Enterprise
   
   URL-STRUKTUR V18.2.8:
   - Primär: /:slug (SEO-optimiert) → my-dispatch.de/[slug]
   - Fallback: /unternehmer?tenant=id (Legacy-Support)
   ================================================================================== */

import { useState } from 'react';
import { useSearchParams, useParams, Link, useNavigate } from 'react-router-dom';
import { V28Button } from '@/components/design-system/V28Button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, UserPlus, Shield, FileText } from 'lucide-react';
import { SEOHead } from '@/components/shared/SEOHead';
import { BookingWidget } from '@/components/booking/BookingWidget';
import { IntelligentAIChat } from '@/components/shared/IntelligentAIChat';
import { WaveBackground } from '@/components/enhanced/WaveBackground';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { formatBusinessHours } from '@/lib/business-hours-formatter';
import { usePublicCompany } from '@/hooks/use-public-company';
import { useDeviceType } from '@/hooks/use-device-type';
import { cn } from '@/lib/utils';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { TenantLandingFooter } from '@/components/tenant/TenantLandingFooter';
import { getPortalPrimaryColor } from '@/lib/portal-theme';

// 🔒 SECURITY: Interface matches companies_public_info view (safe fields only)
interface CompanyData {
  id: string;
  name: string;
  company_slug: string | null;
  logo_url: string | null;
  primary_color: string | null;
  landingpage_title: string | null;
  landingpage_hero_text: string | null;
  landingpage_description: string | null;
  city: string | null;
  postal_code: string | null;
  phone: string | null;
  email: string | null;
  business_hours: any;
  widget_button_text: string | null;
  widget_size: string | null;
  widget_show_phone: boolean | null;
  landingpage_enabled: boolean | null;
  widget_enabled: boolean | null;
}

export default function Unternehmer() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isMobile } = useDeviceType();
  
  const tenantId = searchParams.get('tenant') || searchParams.get('id');
  
  const [bookingOpen, setBookingOpen] = useState(false);

  // React Query Hook für automatische Updates
  const { data: company, isLoading: loading } = usePublicCompany(slug, tenantId);

  // V18.2.8: Redirect Legacy-URL zu Slug-URL (wenn Slug vorhanden)
  if (tenantId && !slug && company?.company_slug) {
    navigate(`/${company.company_slug}`, { replace: true });
  }

  // 🔒 SECURITY FIX: Public landing pages can't check tariffs (subscription_product_id not exposed)
  // Solution: Show booking widget for ALL companies - tariff enforcement happens on backend
  const hasBookingAccess = (company as any)?.widget_enabled || false;
  const hasCustomerPortal = company?.landingpage_enabled || false;
  
  // Navigation handler for auth buttons
  const handleAuthNavigation = () => {
    if (company?.company_slug) {
      sessionStorage.setItem('landing_company_slug', company.company_slug);
      sessionStorage.setItem('landing_company_id', company.id);
      navigate(`/auth?company=${company.company_slug}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Lädt...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Unternehmen nicht gefunden</h2>
            <p className="text-muted-foreground mb-4">
              Die angeforderte Landingpage existiert nicht oder ist nicht verfügbar.
            </p>
            <V28Button variant="primary" onClick={() => navigate('/')}>
              Zur Startseite
            </V28Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ V36.0: Zentrales Portal-Theme-System
  const primaryColor = getPortalPrimaryColor(company);

  return (
    <>
      <SEOHead
        title={company.landingpage_title || `${company.name} - Ihr Taxi- & Mietwagenservice`}
        description={company.landingpage_description || `Professioneller Taxi- und Mietwagenservice von ${company.name}. Jetzt buchen!`}
        canonical={company.company_slug ? `/${company.company_slug}` : `/unternehmer?tenant=${company.id}`}
      />

      <div className="flex flex-col w-full bg-background">
        {/* UNIFIED HEADER V18.5.1 - EXAKT wie Marketing/Auth */}
        <AuthHeader 
          companyName={company.name}
          logoUrl={company.logo_url || undefined}
        />

        {/* Hero Section - V28.1 Split Layout mit Clean Background */}
        <section className="relative overflow-hidden mt-14 sm:mt-16 min-h-screen flex items-center bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Column: Content */}
              <div className={cn(
                "space-y-6 animate-fade-in",
                isMobile ? "text-center" : "text-center lg:text-left"
              )}>
                {/* Company Logo Badge */}
                {company.logo_url && (
                  <div className={cn(
                    "inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-700/10 border border-slate-700/30",
                    isMobile && "mx-auto"
                  )}>
                    <img 
                      src={company.logo_url} 
                      alt={company.name} 
                      className="h-7 object-contain" 
                    />
                  </div>
                )}

                {/* Headline */}
                <h1 className={cn(
                  "font-extrabold leading-tight text-slate-900",
                  isMobile ? "text-4xl sm:text-5xl" : "text-5xl lg:text-7xl"
                )}>
                  {company.landingpage_title || 'Ihr professioneller Fahrservice'}
                </h1>

                {/* Hero Text */}
                <p className={cn(
                  "text-slate-600 leading-relaxed",
                  isMobile ? "text-lg" : "text-lg lg:text-2xl"
                )}>
                  {company.landingpage_hero_text || 'Buchen Sie bequem online. Verfügbar 24/7.'}
                </p>

                {/* CTAs with Auth Navigation */}
                <div className={cn(
                  "flex flex-col sm:flex-row gap-4",
                  isMobile ? "items-stretch" : "items-center lg:justify-start justify-center"
                )}>
                  {company.phone && (
                    <a href={`tel:${company.phone}`} className={cn(isMobile && "w-full")}>
                      <V28Button 
                        variant="primary"
                        size="lg"
                        fullWidth={isMobile}
                        icon={Phone}
                        iconPosition="left"
                      >
                        Jetzt anrufen
                      </V28Button>
                    </a>
                  )}
                  {hasBookingAccess && (company as any).widget_enabled && (
                    <V28Button 
                      variant="secondary"
                      size="lg"
                      onClick={() => setBookingOpen(true)}
                      icon={UserPlus}
                      iconPosition="left"
                      fullWidth={isMobile}
                    >
                      {company.widget_button_text || 'Online buchen'}
                    </V28Button>
                  )}
                </div>

                {/* Trust Indicators - Mobile Optimized */}
                <div className={cn(
                  "flex flex-wrap gap-3 sm:gap-4 text-sm sm:text-base",
                  isMobile ? "justify-center" : "justify-center lg:justify-start"
                )}>
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full shadow-sm">
                    <div className="h-2 w-2 rounded-full bg-slate-500 animate-pulse" />
                    <span className="font-medium text-slate-700">24/7 verfügbar</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full shadow-sm">
                    <Shield className="h-4 w-4 text-slate-700" />
                    <span className="font-medium text-slate-700">Sicher & DSGVO</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full shadow-sm">
                    <FileText className="h-4 w-4 text-slate-700" />
                    <span className="font-medium text-slate-700">Festpreise</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Graphic (Desktop only) */}
              {!isMobile && (
                <div className="hidden lg:flex justify-center">
                  <div className="relative w-full max-w-2xl">
                    <OptimizedImage
                      src="/hero-customer-booking.svg"
                      alt={`Online-Buchung bei ${company.name}`}
                      aspectRatio="4/3"
                      className="w-full max-w-2xl rounded-2xl shadow-2xl"
                      priority={false}
                    />
                    {/* Premium Badge Overlay */}
                    <div className="absolute -top-4 -right-4 bg-slate-700 text-slate-50 px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
                      <span className="text-sm font-semibold">24/7 Online</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Customer Portal Section */}
        {hasCustomerPortal && (
          <section className="py-12 sm:py-16 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Bereits Kunde?
                </h2>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                  Melden Sie sich an, um Ihre Fahrten zu verwalten und Buchungen einzusehen.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <V28Button 
                    variant="secondary"
                    size="lg"
                    onClick={handleAuthNavigation}
                    icon={UserPlus}
                    iconPosition="left"
                  >
                    Kundenbereich Login
                  </V28Button>
                  <V28Button 
                    variant="secondary"
                    size="lg"
                    onClick={handleAuthNavigation}
                  >
                    Noch kein Konto? Jetzt registrieren
                  </V28Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
              Warum {company.name}?
            </h2>
            <p className="text-center text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto">
              Professioneller Fahrservice mit höchsten Qualitätsstandards
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover-lift card-hover animate-fade-in">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 shadow-elegant">
                    <Phone className="h-7 w-7 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">24/7 Service</h3>
                  <p className="text-sm text-muted-foreground">
                    Rund um die Uhr für Sie erreichbar. An 365 Tagen im Jahr.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift card-hover animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 shadow-elegant">
                    <MapPin className="h-7 w-7 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Pünktlichkeit</h3>
                  <p className="text-sm text-muted-foreground">
                    Garantierte Pünktlichkeit für Termine, Flüge und wichtige Events.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift card-hover animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 shadow-elegant">
                    <Shield className="h-7 w-7 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Sicherheit</h3>
                  <p className="text-sm text-muted-foreground">
                    Geprüfte Fahrer, moderne Fahrzeuge und umfassende Versicherung.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift card-hover animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 shadow-elegant">
                    <FileText className="h-7 w-7 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Transparent</h3>
                  <p className="text-sm text-muted-foreground">
                    Faire Preise ohne versteckte Kosten. Festpreis auf Anfrage.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Leistungen Section */}
        <section className="py-12 sm:py-16 bg-background relative">
          <WaveBackground position="bottom" color="primary" opacity={0.05} />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
              Unsere Leistungen
            </h2>
            <p className="text-center text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto">
              Von Flughafentransfer bis Geschäftsreisen - wir sind Ihr zuverlässiger Partner
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-hover">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                    Flughafentransfer
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Sicherer und komfortabler Transfer zu allen deutschen und internationalen Flughäfen.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-foreground mt-1">•</span>
                      <span>Flugüberwachung und Anpassung bei Verspätungen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-foreground mt-1">•</span>
                      <span>Meet & Greet Service am Terminal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-foreground mt-1">•</span>
                      <span>Gepäckassistenz inklusive</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                    Geschäftsreisen
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Professioneller Fahrservice für Geschäftskunden und Firmenkunden.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-foreground mt-1">•</span>
                      <span>Festpreise und Rahmenverträge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-foreground mt-1">•</span>
                      <span>Monatliche Sammelrechnungen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-foreground mt-1">•</span>
                      <span>Kostenstellenverwaltung möglich</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                    Events & Feiern
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Für Ihre besonderen Anlässe bieten wir individuellen Fahrservice.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-foreground mt-1">•</span>
                      <span>Hochzeiten und Familienfeiern</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-foreground mt-1">•</span>
                      <span>Konzerte und Sportveranstaltungen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-foreground mt-1">•</span>
                      <span>Shuttle-Service für Gruppen</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                    Krankenfahrten
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Zuverlässiger Transport zu Arztterminen und medizinischen Einrichtungen.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-foreground mt-1">•</span>
                      <span>Rollstuhlgerechte Fahrzeuge verfügbar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-foreground mt-1">•</span>
                      <span>Begleitpersonen willkommen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-foreground mt-1">•</span>
                      <span>Abrechnung mit Krankenkassen möglich</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Company Information */}
        <section className="py-12 sm:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
              Kontaktieren Sie uns
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Contact Info */}
              <Card className="glass card-hover">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Kontakt</h3>
                  <div className="space-y-3">
                    {company.phone && (
                      <div className="flex items-center gap-3 interactive-hover rounded-lg p-2 -mx-2">
                        <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                        <a
                          href={`tel:${company.phone}`}
                          className="hover:text-primary transition-colors min-h-[44px] flex items-center"
                        >
                          {company.phone}
                        </a>
                      </div>
                    )}
                    {company.email && (
                      <div className="flex items-center gap-3 interactive-hover rounded-lg p-2 -mx-2">
                        <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                        <a
                          href={`mailto:${company.email}`}
                          className="hover:text-primary transition-colors min-h-[44px] flex items-center"
                        >
                          {company.email}
                        </a>
                      </div>
                    )}
                    {(company.postal_code || company.city) && (
                      <div className="flex items-start gap-3 p-2 -mx-2">
                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-foreground mt-1" />
                        <span>
                          {[company.postal_code, company.city].filter(Boolean).join(' ')}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="glass card-hover">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                    Öffnungszeiten
                  </h3>
                  <div className="space-y-2">
                    {company.business_hours && typeof company.business_hours === 'object' ? (
                      Object.entries(company.business_hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between text-sm">
                          <span className="font-medium">{day}</span>
                          <span className="text-muted-foreground">
                            {String(hours).toLowerCase() === 'geschlossen' 
                              ? 'Geschlossen' 
                              : `${hours} Uhr`}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Kontaktieren Sie uns für Verfügbarkeiten
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Business/Enterprise Features - Booking-Widget */}
            {hasBookingAccess && (company as any).widget_enabled && (
              <div className="mt-8 sm:mt-12 text-center">
                <Card className="max-w-2xl mx-auto glass-strong card-hover shadow-elegant">
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">
                      Online-Buchung verfügbar
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Buchen Sie Ihre Fahrt bequem online und profitieren Sie von unserem 
                      erstklassigen Service. Verfügbar 24/7.
                    </p>
                    <V28Button
                      variant="primary"
                      size="lg"
                      onClick={() => setBookingOpen(true)}
                    >
                      {company.widget_button_text || 'Jetzt buchen'}
                    </V28Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Starter Tariff Info - Kein Booking-Widget */}
            {!hasBookingAccess && (
              <div className="mt-8 sm:mt-12 text-center">
                <Card className="max-w-2xl mx-auto glass-strong card-hover shadow-elegant">
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">
                      Kontaktieren Sie uns
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Für Buchungen und Anfragen kontaktieren Sie uns bitte telefonisch 
                      oder per E-Mail. Wir sind gerne für Sie da!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      {company.phone && (
                        <a href={`tel:${company.phone}`}>
                          <V28Button
                            variant="primary"
                            size="lg"
                            icon={Phone}
                            iconPosition="left"
                          >
                            Jetzt anrufen
                          </V28Button>
                        </a>
                      )}
                      {company.email && (
                        <a href={`mailto:${company.email}`}>
                          <V28Button
                            variant="secondary"
                            size="lg"
                            icon={Mail}
                            iconPosition="left"
                          >
                            E-Mail schreiben
                          </V28Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Customer Portal Section - Business/Enterprise Only */}
            {hasCustomerPortal && (
              <div className="mt-8 sm:mt-12 text-center">
                <Card className="max-w-2xl mx-auto glass-strong card-hover shadow-elegant">
                  <CardContent className="p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4">
                      Kundenportal-Zugang
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Bereits Kunde? Melden Sie sich an, um Ihre Buchungen zu verwalten 
                      und Ihren Buchungsverlauf einzusehen.
                    </p>
                    <V28Button
                      variant="primary"
                      size="lg"
                      onClick={() => {
                        // Store Company Context für Auth-Page Redirect
                        sessionStorage.setItem('landing_company_slug', company.company_slug || '');
                        sessionStorage.setItem('landing_company_id', company.id);
                        navigate(`/auth?company=${company.company_slug}`);
                      }}
                      icon={UserPlus}
                      iconPosition="left"
                    >
                      Login / Registrierung
                    </V28Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* TENANT FOOTER V28.1 - Company-spezifische Legal Dialogs */}
        <TenantLandingFooter
          companyName={company.name}
          primaryColor={primaryColor}
        />

        {/* Booking Widget Dialog - NUR Business/Enterprise */}
        {company && hasBookingAccess && (company as any).widget_enabled && (
          <BookingWidget
            open={bookingOpen}
            onOpenChange={setBookingOpen}
            companyId={company.id}
            companyName={company.name}
            primaryColor={primaryColor}
          />
        )}

        {/* INTELLIGENT AI CHAT für Landing-Page (Endkunden-Support) */}
        {company && hasBookingAccess && (
          <IntelligentAIChat 
            isPublicLanding={true}
            companyData={{
              id: company.id,
              name: company.name,
              phone: company.phone || undefined,
              email: company.email || undefined,
              address: [company.postal_code, company.city].filter(Boolean).join(' ') || undefined,
              business_hours: company.business_hours,
            }}
          />
        )}

      </div>
    </>
  );
}
