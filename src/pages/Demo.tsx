/* ==================================================================================
   DEMO PAGE - V28.1 PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ V28.1 Design System konform
   ✅ Hero Split Layout (Text links, Form rechts)
   ✅ Demo-Anfrage-Formular mit Zod Validation
   ✅ Social Proof (Kundenlogos)
   ✅ SEO-optimiert mit Schema.org
   ================================================================================== */

import { V28Button } from '@/components/design-system/V28Button';
import { V28IconBox } from '@/components/design-system/V28IconBox';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28HeroPremium } from '@/components/hero/V28HeroPremium';
import { V28DashboardPreview } from '@/components/home/V28DashboardPreview';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { SEOHead } from '@/components/shared/SEOHead';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Mail,
    Phone,
    Users,
    Video
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const demoSchema = z.object({
  name: z.string().trim().min(2, 'Name muss mindestens 2 Zeichen lang sein').max(100),
  email: z.string().trim().email('Ungültige E-Mail-Adresse').max(255),
  company: z.string().trim().min(2, 'Firmenname erforderlich').max(100),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().max(1000).optional(),
  agbAccepted: z.boolean().refine(val => val === true, 'Datenschutzerklärung muss akzeptiert werden'),
});

type DemoFormData = z.infer<typeof demoSchema>;

const benefits = [
  {
    icon: Video,
    title: 'Live-Demo',
    description: '30-minütige persönliche Produktvorführung mit einem MyDispatch-Experten'
  },
  {
    icon: Users,
    title: 'Individuelle Beratung',
    description: 'Wir gehen auf Ihre spezifischen Anforderungen und Fragen ein'
  },
  {
    icon: Clock,
    title: 'Flexible Termine',
    description: 'Wir passen uns Ihrem Zeitplan an - auch außerhalb der Geschäftszeiten'
  },
  {
    icon: CheckCircle2,
    title: 'Unverbindlich',
    description: 'Keine Verpflichtungen - lernen Sie MyDispatch in Ruhe kennen'
  }
];

export default function Demo() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DemoFormData>({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      message: '',
      agbAccepted: false,
    }
  });

  const onSubmit = async (data: DemoFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-demo-request', {
        body: {
          ...data,
          requestedAt: new Date().toISOString(),
        }
      });

      if (error) throw error;

      toast({
        title: 'Demo-Anfrage erhalten!',
        description: 'Wir melden uns innerhalb von 24 Stunden bei Ihnen.',
      });

      form.reset();
    } catch (error: Error | unknown) {
      toast({
        title: 'Fehler',
        description: error.message || 'Demo-Anfrage konnte nicht gesendet werden.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MarketingLayout currentPage="demo">
      <SEOHead
        title="Live-Demo anfragen"
        description="Buchen Sie Ihre persönliche MyDispatch Live-Demo. 30 Minuten individuelle Produktvorführung mit einem Experten. Jetzt unverbindlich anfragen!"
        canonical="/demo"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "MyDispatch Live-Demo",
          "description": "Unverbindliche Live-Demo anfragen"
        }}
        keywords={['MyDispatch Demo', 'Taxi Software Demo', 'Live Produktvorführung', 'Unverbindliche Demo', 'MyDispatch Vorführung']}
      />

      {/* Hero Section - V28 HERO PREMIUM */}
      <V28HeroPremium
        variant="demo"
        backgroundVariant="3d-premium"
        badge={{ text: 'Live-Demo', icon: Video }}
        title="Erleben Sie MyDispatch in Aktion"
        subtitle="30-minütige persönliche Demo mit echten Taxi-Daten"
        description="Unsere Experten zeigen Ihnen live, wie MyDispatch Ihr Taxi-Unternehmen digitalisiert. Keine Verpflichtungen, nur Einblicke."
        primaryCTA={{
          label: 'Demo-Termin buchen',
          onClick: () => {
            const formElement = document.getElementById('demo-form');
            formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          },
          icon: Calendar
        }}
        showPWAButton={true}
        visual={<V28DashboardPreview animationDelay="0.4s" title="my-dispatch.de/demo" />}
        businessMetrics={[
          { label: 'Demo-Dauer', value: '30 Min', sublabel: 'unverbindlich' },
          { label: 'Setup-Zeit', value: '<24h', sublabel: 'nach Vertragsabschluss' },
          { label: 'Zufriedenheit', value: '4.8/5', sublabel: 'Kundenbewertung' }
        ]}
      />

      {/* Benefits Section */}
      <V28MarketingSection
        background="canvas"
        title="Was erwartet Sie?"
        description="Ihre persönliche MyDispatch Demo"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => (
            <V28MarketingCard
              key={idx}
              className="text-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
            >
              <V28IconBox icon={benefit.icon} variant="slate" className="mx-auto mb-4" />
              <h3 className="font-sans text-lg font-semibold text-slate-900 mb-2">
                {benefit.title}
              </h3>
              <p className="font-sans text-sm text-slate-600">
                {benefit.description}
              </p>
            </V28MarketingCard>
          ))}
        </div>
      </V28MarketingSection>

      {/* Demo Form Section */}
      <V28MarketingSection
        id="demo-form"
        background="white"
        title="Jetzt Demo anfragen"
        description="Füllen Sie das Formular aus und wir melden uns innerhalb von 24 Stunden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Form */}
          <V28MarketingCard>
            <h3 className="font-sans text-2xl font-semibold text-slate-900 mb-6">
              Ihre Kontaktdaten
            </h3>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Ihr vollständiger Name"
                  className="mt-2"
                  disabled={isSubmitting}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">E-Mail *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  placeholder="ihre.email@firma.de"
                  className="mt-2"
                  disabled={isSubmitting}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company">Unternehmen *</Label>
                <Input
                  id="company"
                  {...form.register('company')}
                  placeholder="Ihr Firmenname"
                  className="mt-2"
                  disabled={isSubmitting}
                />
                {form.formState.errors.company && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.company.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Telefon (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...form.register('phone')}
                  placeholder="+49 ..."
                  className="mt-2"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="message">Nachricht (optional)</Label>
                <Textarea
                  id="message"
                  {...form.register('message')}
                  placeholder="Haben Sie spezielle Fragen oder Anforderungen?"
                  className="mt-2"
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="agbAccepted"
                  checked={form.watch('agbAccepted')}
                  onCheckedChange={(checked) => form.setValue('agbAccepted', checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="agbAccepted" className="text-sm text-slate-600 cursor-pointer">
                  Ich akzeptiere die{' '}
                  <a href="/datenschutz" className="text-slate-900 hover:underline">
                    Datenschutzerklärung
                  </a>
                </Label>
              </div>
              {form.formState.errors.agbAccepted && (
                <p className="text-sm text-red-600">{form.formState.errors.agbAccepted.message}</p>
              )}

              <V28Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Wird gesendet...' : 'Demo anfragen'}
              </V28Button>
            </form>
          </V28MarketingCard>

          {/* Info Cards */}
          <div className="space-y-6">
            <V28MarketingCard>
              <div className="flex items-start gap-4">
                <V28IconBox icon={Calendar} variant="slate" />
                <div>
                  <h4 className="font-sans text-lg font-semibold text-slate-900 mb-2">
                    Was passiert nach der Anfrage?
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" />
                      <span>Wir melden uns innerhalb von 24 Stunden</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" />
                      <span>Gemeinsam vereinbaren wir einen passenden Termin</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" />
                      <span>Sie erhalten einen Kalender-Eintrag mit Zugangsdaten</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" />
                      <span>30 Minuten Live-Demo mit Q&A</span>
                    </li>
                  </ul>
                </div>
              </div>
            </V28MarketingCard>

            <V28MarketingCard>
              <div className="flex items-start gap-4">
                <V28IconBox icon={Phone} variant="slate" />
                <div>
                  <h4 className="font-sans text-lg font-semibold text-slate-900 mb-2">
                    Lieber direkt anrufen?
                  </h4>
                  <p className="text-sm text-slate-600 mb-3">
                    Unser Team steht Ihnen gerne telefonisch zur Verfügung:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-700" />
                      <a href="tel:+491708004423" className="text-sm text-slate-700 hover:text-slate-900 hover:underline">
                        +49 170 8004423
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-700" />
                      <a href="mailto:info@my-dispatch.de" className="text-sm text-slate-700 hover:text-slate-900 hover:underline">
                        info@my-dispatch.de
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </V28MarketingCard>

            <V28MarketingCard className="bg-slate-50">
              <h4 className="font-sans text-lg font-semibold text-slate-900 mb-3">
                Vertrauen Sie auf Qualität
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-slate-900">Made</div>
                  <div className="text-xs text-slate-600">in Germany</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">99,9%</div>
                  <div className="text-xs text-slate-600">Uptime</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">24/7</div>
                  <div className="text-xs text-slate-600">Support</div>
                </div>
              </div>
            </V28MarketingCard>
          </div>
        </div>
      </V28MarketingSection>

      {/* FAQ Section */}
      <V28MarketingSection
        background="canvas"
        title="Häufige Fragen zur Demo"
        description="Alles, was Sie über die Live-Demo wissen müssen"
      >
        <V28MarketingCard className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <div>
              <h4 className="font-sans text-lg font-semibold text-slate-900 mb-2">Ist die Demo unverbindlich?</h4>
              <p className="text-sm text-slate-600">Ja, die Demo ist 100% unverbindlich. Es entstehen keine Kosten und Sie gehen keine Verpflichtungen ein.</p>
            </div>
            <div>
              <h4 className="font-sans text-lg font-semibold text-slate-900 mb-2">Wie lange dauert die Demo?</h4>
              <p className="text-sm text-slate-600">Die Demo dauert ca. 30 Minuten. Wir können die Zeit aber flexibel anpassen, falls Sie mehr Fragen haben.</p>
            </div>
            <div>
              <h4 className="font-sans text-lg font-semibold text-slate-900 mb-2">Was benötige ich für die Demo?</h4>
              <p className="text-sm text-slate-600">Nur einen Computer mit Internetverbindung. Wir senden Ihnen einen Link für die Video-Demo per E-Mail.</p>
            </div>
            <div>
              <h4 className="font-sans text-lg font-semibold text-slate-900 mb-2">Kann ich danach direkt starten?</h4>
              <p className="text-sm text-slate-600">Ja! Nach der Demo können Sie sich direkt registrieren und mit MyDispatch starten.</p>
            </div>
          </div>
        </V28MarketingCard>
      </V28MarketingSection>
    </MarketingLayout>
  );
}
