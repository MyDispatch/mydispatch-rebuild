/_ ==================================================================================
PRICING PAGE V18.5.3 - CLEAN PREMIUM DESIGN
==================================================================================
✅ Minimalistisches Flat-Design
✅ Klare visuelle Hierarchie
✅ Subtile Hover-Effekte (Lift)
✅ Professionelle Buttons ohne Spielereien
✅ Business-Tarif klar hervorgehoben
✅ Vertrauenswürdiges B2B-Design
✅ DSGVO-konform, Marketing-Standards, SEO-optimiert
================================================================================== _/

import { useState } from 'react';
import { Check, X, ChevronDown, Sparkles, Rocket, Building2, Crown, Truck } from 'lucide-react';
import { TariffFeatureDialog } from '@/components/pricing/TariffFeatureDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarketingButton } from '@/components/design-system/MarketingButton';
import {
Accordion,
AccordionContent,
AccordionItem,
AccordionTrigger,
} from '@/components/ui/accordion';
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from '@/components/ui/table';
import { SEOHead } from '@/components/shared/SEOHead';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { useNavigate } from 'react-router-dom';
import { pricingSchema } from '@/lib/schema-org';
import { cn } from '@/lib/utils';

// Import zentrale Tarif-Definitionen
import { ALL_TARIFFS, COMPARISON_FEATURES, getTariffById, ADDON_FLEET_EXTENSION } from '@/lib/tariff/tariff-definitions';

// Icon-Mapping für Tarife
const getTariffIcon = (tariffId: string) => {
switch(tariffId) {
case 'starter':
return Rocket;
case 'business':
return Building2;
case 'enterprise':
return Crown;
default:
return Rocket;
}
};

// Dynamische Vergleichs-Daten aus Tarif-Definitionen
const getComparisonData = () => {
const starter = getTariffById('starter');
const business = getTariffById('business');
const enterprise = getTariffById('enterprise');

return COMPARISON_FEATURES.map(cf => {
const starterFeature = starter?.features.find(f => f.id === cf.key);
const businessFeature = business?.features.find(f => f.id === cf.key);
const enterpriseFeature = enterprise?.features.find(f => f.id === cf.key);

    return {
      name: cf.name,
      starter: starterFeature?.included ?? false,
      business: businessFeature?.included ?? false,
      enterprise: enterpriseFeature?.included ?? true,
    };

});
};

export default function Pricing() {
const navigate = useNavigate();
const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
const [selectedTariff, setSelectedTariff] = useState<typeof ALL_TARIFFS[0] | null>(null);

const comparisonData = getComparisonData();

const handleSubscribe = (tariffId: string) => {
if (tariffId === 'enterprise') {
navigate('/contact');
return;
}

    // Weiterleitung zur Auth-Seite mit Tarif-Parameter
    const billingParam = billingPeriod;
    navigate(`/auth?tariff=${tariffId}&billing=${billingParam}`);

};

return (
<MarketingLayout currentPage="pricing">
<SEOHead
title="Preise & Tarife - MyDispatch"
description="Transparente Preise für Taxi- und Mietwagenunternehmen. Starter ab 39€/Monat, Business ab 99€/Monat. Transparente Preisgestaltung ohne versteckte Kosten, monatlich kündbar."
canonical="/pricing"
schema={pricingSchema}
keywords={['Taxi Software Preise', 'Mietwagen Software Kosten', 'Dispositionssoftware Tarife', 'MyDispatch Preise', 'Flottenmanagement Abo']}
/>

      {/* Hero Section mit Video Background - Moderner: Weicheres Overlay, bessere Balance */}
      <section className="-mt-6 min-h-[700px] md:h-screen flex items-center justify-center overflow-hidden relative">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
          style={{ filter: 'brightness(0.6) contrast(1.05)' }} // Leichter Kontrast für Modernität
          onError={(e) => {
            try {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.style.background = 'linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--primary)) 100%)';
              }
            } catch {
              // Silent fail
            }
          }}
        >
          <source
            src="https://videos.pexels.com/video-files/9520622/9520622-uhd_2732_1440_25fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Fallback Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 via-foreground/80 to-primary/40"></div> {/* Weicherer Gradient für Harmonie */}

        {/* Dark Overlay - Moderner: Leichter Opacity */}
        <div className="hero-dark-overlay absolute inset-0 bg-foreground/30"></div>

        {/* Content Container */}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

              {/* Linke Spalte - Hauptinhalt - Harmonisierter Text: Bessere Line-Height */}
              <div className="text-center lg:text-left space-y-6 sm:space-y-7 md:space-y-8 flex flex-col justify-center">

                {/* Headline - Moderner: Leichter Glow in CI-Gold */}
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight animate-fade-in drop-shadow-md"
                  style={{
                    animationDelay: '150ms',
                    textWrap: 'balance',
                    lineHeight: 1.1 // Harmonischer
                  }}
                >
                  <span className="block text-primary transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(234,222,189,0.6)]">
                    Unsere Tarife
                  </span>
                  <span className="hero-headline-secondary block mt-2 sm:mt-3" style={{ textWrap: 'balance' }}>
                    Transparent & fair für jede Flottengröße
                  </span>
                </h1>

                {/* Subtext - Harmonischer: Medium Weight */}
                <p
                  className="hero-subtext text-base sm:text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium animate-fade-in" // Font-medium für Balance
                  style={{
                    animationDelay: '300ms',
                    textWrap: 'pretty',
                    lineHeight: 1.6 // Bessere Lesbarkeit
                  }}
                >
                  Wählen Sie das passende Abo für Ihr Unternehmen. Transparente Preisgestaltung ohne versteckte Kosten, monatlich kündbar, faire Preise.
                </p>

                {/* Trust-Badges - Moderner: Leichte Scale on Hover */}
                <div
                  className="flex flex-wrap gap-3 justify-center lg:justify-start items-center animate-fade-in"
                  style={{ animationDelay: '450ms' }}
                >
                  <Badge variant="trust" className="text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 hover:scale-105 transition-transform">
                    Made in Germany
                  </Badge>
                  <Badge variant="trust" className="text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 hover:scale-105 transition-transform">
                    DSGVO-konform
                  </Badge>
                  <Badge variant="trust" className="text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 hover:scale-105 transition-transform">
                    Monatlich kündbar
                  </Badge>
                </div>
              </div>

              {/* Rechte Spalte - Leer */}
              <div className="hidden lg:block" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="min-h-screen">
        {/* Billing Toggle & Tarif-Karten - Weiß - Harmonisiertere Abstände */}
        <section className="py-16 sm:py-20 md:py-24 bg-background"> {/* Erhöhte Padding für Luft */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header - Moderner: Zentriert, bessere Tracking */}
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-heading-2 mb-4 tracking-wide font-bold"> {/* Tracking-wide für Modernität */}
                Wählen Sie Ihren passenden Tarif
              </h2>
              <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed font-medium">
                Flexible Abrechnungsmodelle für jede Flottengröße. Monatlich oder jährlich mit Rabatt – Sie entscheiden.
              </p>
            </div>

            <div className="text-center mb-12 sm:mb-16">
              {/* Billing Toggle - Flat Design - Moderner: Smooth Transition */}
              <div className="inline-flex items-center gap-2 bg-primary p-1 rounded-xl border border-border shadow-sm transition-shadow hover:shadow-md"> {/* Rounded-xl für Softness */}
                <Button
                  onClick={() => setBillingPeriod('monthly')}
                  variant={billingPeriod === 'monthly' ? 'primary-filled' : 'ghost'}
                  size="lg"
                  className={cn(
                    "min-h-[44px] transition-all duration-300",
                    billingPeriod === 'monthly' && 'bg-foreground text-background hover:bg-foreground hover:text-background',
                    billingPeriod !== 'monthly' && 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Monatlich
                </Button>
                <Button
                  onClick={() => setBillingPeriod('yearly')}
                  variant={billingPeriod === 'yearly' ? 'primary-filled' : 'ghost'}
                  size="lg"
                  className={cn(
                    "min-h-[44px] transition-all duration-300",
                    billingPeriod === 'yearly' && 'bg-foreground text-background hover:bg-foreground hover:text-background',
                    billingPeriod !== 'yearly' && 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Jährlich
                  <Badge className={cn(
                    "text-[10px] font-bold px-2 ml-2",
                    billingPeriod === 'monthly' ? 'bg-foreground text-background' : 'bg-primary text-foreground'
                  )}>
                    -20%
                  </Badge>
                </Button>
              </div>
            </div>

            {/* Tarif-Karten - Clean Premium Design - Moderner: Stärkere Hover, Gradient Borders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 md:items-start"> {/* Erhöhte Gap für Balance */}
              {ALL_TARIFFS.map((tariff, index) => {
                const includedFeatures = tariff.features.filter(f => f.included);
                // Business-Tarif zeigt mehr Features (8), andere nur 5
                const displayLimit = tariff.highlighted ? 8 : 5;
                const displayedFeatures = includedFeatures.slice(0, displayLimit);
                const hasMoreFeatures = includedFeatures.length > displayLimit;
                const TariffIcon = getTariffIcon(tariff.id);

                return (
                  <Card
                    key={tariff.name}
                    className={cn(
                      "relative flex flex-col transition-all duration-300 animate-fade-in bg-background rounded-xl overflow-hidden", // Rounded-xl für Modernität
                      tariff.highlighted
                        ? 'border-2 border-foreground shadow-lg hover:shadow-2xl hover:-translate-y-2' // Stärkere Hover
                        : 'border border-border hover:border-foreground/50 hover:shadow-lg hover:-translate-y-1 md:mt-8'
                    )}
                    style={{ animationDelay: `${150 + index * 100}ms` }}
                  >
                    {tariff.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <Badge variant="marker" className="px-4 py-1 shadow-sm">
                          {tariff.badge}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className={cn("pb-6", tariff.highlighted && "pt-8")}>
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-heading-3 font-bold">
                          {tariff.name}
                        </h3>
                        <div className="bg-secondary rounded-lg p-2.5 transition-transform hover:rotate-3"> {/* Leichte Animation */}
                          <TariffIcon className="h-6 w-6 text-primary shrink-0" />
                        </div>
                      </div>

                      <div className="mb-2">
                        <CardTitle className="text-heading-1 font-bold">
                          {billingPeriod === 'monthly' ? tariff.priceMonthlyFormatted : tariff.priceYearlyFormatted}
                        </CardTitle>
                        <p className="text-body-sm text-muted-foreground mt-1 font-medium">
                          {billingPeriod === 'monthly' ? 'pro Monat' : 'pro Jahr'}
                        </p>
                      </div>

                      {billingPeriod === 'yearly' && tariff.yearlyDiscount > 0 && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-status-success/10 shadow-inner">
                          <span className="text-body-sm text-status-success font-semibold">
                            Spare {tariff.yearlyDiscount.toFixed(2)} € jährlich
                          </span>
                        </div>
                      )}

                      <p className="text-body text-muted-foreground mt-4 font-medium leading-relaxed">
                        {tariff.description}
                      </p>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col pt-0">
                      <ul className="space-y-3 mb-6 flex-1">
                        {displayedFeatures.map((feature) => (
                          <li key={feature.id} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-foreground shrink-0 mt-0.5 transition-colors hover:text-primary" /> {/* Hover-Farbe für Interaktion */}
                            <span className="text-body text-foreground/80 font-medium">{feature.name}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="space-y-2.5 mt-auto">
                        {hasMoreFeatures && (
                          <Button
                            variant="ghost"
                            onClick={() => setSelectedTariff(tariff)}
                            className="w-full text-body hover:bg-primary/10 transition-colors"
                          >
                            <ChevronDown className="h-4 w-4 mr-1 transition-transform group-hover:rotate-180" />
                            +{includedFeatures.length - 5} weitere Features anzeigen
                          </Button>
                        )}

                        <Button
                          variant={
                            tariff.id === 'business' ? "primary-filled" : "beige-filled"
                          }
                          size="lg"
                          onClick={() => handleSubscribe(tariff.id)}
                          className="w-full bg-gradient-to-r from-secondary to-foreground/90 hover:from-secondary hover:to-foreground text-background" // Subtiler Gradient für Modernität
                        >
                          {tariff.ctaText}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Add-Ons Section - Dezent getönt - Moderner: Grid-Balance, Shadows */}
        <section className="-mt-16 pt-0 pb-16 md:pb-20 bg-muted/30"> {/* Leichteres Muted für Harmonie */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-heading-2 mb-4 tracking-wide font-bold">
                Erweiterungen
              </h2>
              <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed font-medium">
                Erweitern Sie Ihren Tarif bedarfsgerecht mit flexiblen Add-Ons für mehr Kapazität und Funktionen.
              </p>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"> {/* Erhöhte Gap */}
                {/* Fleet & Driver Extension - Moderner: Hover-Lift */}
                <Card className="border-2 border-foreground shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-background rounded-xl">
                  <CardContent className="p-6 sm:p-8 flex items-start gap-4">
                    <div className="bg-secondary rounded-lg p-2.5 shrink-0 transition-transform hover:scale-110">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-heading-3 mb-3 font-bold">
                        Fleet & Driver Add-On für Starter-Tarif
                      </h4>
                      <div className="text-heading-1 mb-1 font-bold">
                        {billingPeriod === 'monthly'
                          ? ADDON_FLEET_EXTENSION.priceMonthlyFormatted
                          : ADDON_FLEET_EXTENSION.priceYearlyFormatted}
                      </div>
                      <div className="text-body-sm text-muted-foreground mb-3 font-medium">
                        {billingPeriod === 'monthly' ? 'pro Monat' : 'pro Jahr'}
                      </div>
                      {billingPeriod === 'yearly' && ADDON_FLEET_EXTENSION.yearlyDiscount > 0 && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-status-success/10 mb-4 shadow-inner">
                          <span className="text-body-sm text-status-success font-semibold">
                            Spare {ADDON_FLEET_EXTENSION.yearlyDiscount.toFixed(2)} € jährlich
                          </span>
                        </div>
                      )}
                      <p className="text-body text-muted-foreground font-medium leading-relaxed">
                        {ADDON_FLEET_EXTENSION.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Info-Card: Weitere Add-Ons */}
                <Card className="border-0 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-background rounded-xl">
                  <CardContent className="p-6 sm:p-8 flex items-start gap-4">
                    <div className="bg-secondary rounded-lg p-2.5 shrink-0 transition-transform hover:scale-110">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-heading-3 mb-3 font-bold">
                        Weitere Erweiterungen in Planung
                      </h4>
                      <p className="text-body text-muted-foreground mb-4 font-medium leading-relaxed">
                        Wir arbeiten kontinuierlich an neuen Add-Ons, um Ihre Flotte optimal zu unterstützen.
                      </p>
                      <p className="text-body-sm text-muted-foreground font-medium">
                        Kontaktieren Sie uns für individuelle Anforderungen
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
          </div>
        </section>

        {/* Vergleichstabelle - Weiß - Moderner: Rounded, Alternierende mit Gradient */}
        <section className="py-20 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-heading-2 mb-4 tracking-wide font-bold">
                Detaillierter Vergleich
              </h2>
              <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed font-medium">
                Alle Features und Leistungsmerkmale der Tarife im direkten Vergleich – transparent und übersichtlich.
              </p>
            </div>
              <Card className="border border-border hover:shadow-lg transition-all duration-300 bg-background rounded-xl overflow-hidden"> {/* Rounded für Softness */}
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-border bg-gradient-to-r from-background to-muted/20"> {/* Leichter Gradient */}
                          <TableHead className="py-4 px-6 text-heading-3 text-foreground font-bold">Feature</TableHead>
                          <TableHead className="text-center py-4 text-heading-3 text-foreground font-bold">Starter</TableHead>
                          <TableHead className="text-center py-4 bg-primary text-heading-3 text-foreground font-bold">Business</TableHead>
                          <TableHead className="text-center py-4 text-heading-3 text-foreground font-bold">Enterprise</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {comparisonData.map((feature, index) => (
                          <TableRow
                            key={feature.name}
                            className={cn(
                              "border-b border-border/50 transition-colors hover:bg-muted/30",
                              index % 2 === 0 && "bg-muted/10" // Leichteres Alternieren
                            )}
                          >
                            <TableCell className="font-medium py-4 px-6 text-body">{feature.name}</TableCell>
                            <TableCell className="text-center py-4">
                              {typeof feature.starter === 'boolean' ? (
                                feature.starter ? (
                                  <Check className="mx-auto h-5 w-5 text-foreground" />
                                ) : (
                                  <X className="mx-auto h-5 w-5 text-muted-foreground/30" />
                                )
                              ) : (
                                <span className="text-body font-medium">{feature.starter as string}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center py-4 bg-foreground/10"> {/* Leichter BG für Highlight */}
                              {typeof feature.business === 'boolean' ? (
                                feature.business ? (
                                  <Check className="mx-auto h-5 w-5 text-primary" />
                                ) : (
                                  <X className="mx-auto h-5 w-5 text-primary" />
                                )
                              ) : (
                                <span className="text-body font-medium text-primary">{feature.business as string}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center py-4">
                              {typeof feature.enterprise === 'boolean' ? (
                                feature.enterprise ? (
                                  <Check className="mx-auto h-5 w-5 text-foreground" />
                                ) : (
                                  <X className="mx-auto h-5 w-5 text-muted-foreground/30" />
                                )
                              ) : (
                                <span className="text-body font-medium">{feature.enterprise as string}</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
          </div>
        </section>

        {/* FAQ Section - Weiß mit alternierenden Items - Moderner: Smooth Accordion */}
        <section className="py-20 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-heading-2 mb-4 tracking-wide font-bold">
                Häufig gestellte Fragen
              </h2>
              <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed font-medium">
                Antworten auf die wichtigsten Fragen zu Tarifen, Verträgen und Zahlungsmodalitäten.
              </p>
            </div>
              <div className="max-w-4xl mx-auto shadow-md rounded-xl overflow-hidden"> {/* Wrapper für Depth */}
                <Accordion type="single" collapsible className="space-y-0">
                  {[
                    {
                      value: 'item-1',
                      question: 'Welche Zahlungsmethoden werden akzeptiert?',
                      answer: 'Wir akzeptieren alle gängigen Kreditkarten (Visa, Mastercard, American Express) und SEPA-Lastschrift über Stripe. Die Abrechnung erfolgt monatlich oder jährlich im Voraus, automatisch über Ihren gewählten Zahlungsweg.'
                    },
                    {
                      value: 'item-2',
                      question: 'Kann ich meinen Tarif jederzeit wechseln?',
                      answer: 'Ja, Sie können jederzeit auf einen höheren Tarif upgraden. Die Differenz wird anteilig berechnet. Ein Downgrade ist zum Ende der aktuellen Abrechnungsperiode möglich.'
                    },
                    {
                      value: 'item-3',
                      question: 'Welche Vertragslaufzeit gibt es?',
                      answer: 'MyDispatch ist monatlich kündbar. Es gibt keine Mindestvertragslaufzeit. Bei jährlicher Zahlung erhalten Sie einen Rabatt von bis zu 20%, die Kündigung ist dann zum Ende der Jahresperiode möglich.'
                    },
                    {
                      value: 'item-4',
                      question: 'Wie lange werden meine Daten gespeichert?',
                      answer: (
                        <>
                          Gemäß PBefG § 51 und Handelsrecht werden Auftragsdaten für 10 Jahre aufbewahrt.
                          Personenbezogene Daten werden nach Vertragsende bzw. auf Antrag gemäß DSGVO gelöscht,
                          sofern keine gesetzlichen Aufbewahrungsfristen bestehen. Weitere Details finden Sie
                          in unserer <a href="/datenschutz" className="text-foreground underline hover:underline font-medium">Datenschutzerklärung</a>.
                        </>
                      )
                    },
                    {
                      value: 'item-5',
                      question: 'Was passiert, wenn ich mehr als 3 Fahrer im Starter-Tarif benötige?',
                      answer: 'Sie haben zwei Optionen: Entweder Sie erweitern Ihren Starter-Tarif durch unsere Fleet & Driver Erweiterung (9 € pro zusätzlichem Fahrer/Fahrzeug pro Monat), oder Sie upgraden auf den Business-Tarif für unbegrenzte Fahrer und Fahrzeuge sowie zusätzliche Premium-Features.'
                    },
                    {
                      value: 'item-6',
                      question: 'Kann ich jederzeit kündigen?',
                      answer: 'Ja, alle Tarife sind monatlich kündbar. Bei monatlicher Zahlung endet Ihr Zugang zum Ende des aktuellen Abrechnungsmonats. Bei jährlicher Zahlung haben Sie bis zum Ende der Jahresperiode Zugriff auf alle Features. Eine Kündigungsfrist gibt es nicht.'
                    }
                  ].map((faq, index) => (
                    <AccordionItem
                      key={faq.value}
                      value={faq.value}
                      className={cn(
                        "border-b border-border/50 px-6 transition-all",
                        index % 2 === 0 && "bg-muted/10"
                      )}
                    >
                      <AccordionTrigger className="hover:no-underline py-4 text-body font-bold group"> {/* Font-bold für Harmonie */}
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-body text-muted-foreground pb-4 font-medium leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
          </div>
        </section>

        {/* Feature-Detail Dialog */}
        {selectedTariff && (
          <TariffFeatureDialog
            open={!!selectedTariff}
            onOpenChange={(open) => !open && setSelectedTariff(null)}
            tariff={selectedTariff}
            onSelectTariff={() => handleSubscribe(selectedTariff.id)}
          />
        )}
      </div>
    </MarketingLayout>

);
}
