/* ==================================================================================
   ABOUT PAGE - V28.1 PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ V28.1 Design System konform
   ✅ Hero mit Company-Story Dashboard-Preview
   ✅ Timeline + Team Grid-Sections
   ================================================================================== */

import { Building2, Calendar, Users, Trophy, Heart, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { SEOHead } from '@/components/shared/SEOHead';
import { V28HeroPremium } from '@/components/hero/V28HeroPremium';
import { AboutDashboardPreview } from '@/components/preview';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { V28IconBox } from '@/components/design-system/V28IconBox';
import { V28Button } from '@/components/design-system/V28Button';
import { Badge } from '@/components/ui/badge';

const About = () => {
  const navigate = useNavigate();

  const timelineEvents = [
    {
      year: '2010',
      title: 'Gründung',
      description: 'MyDispatch wird von Taxi-Experten gegründet, die die Branche von innen kennen.',
      icon: Building2
    },
    {
      year: '2015',
      title: 'Erste 100 Kunden',
      description: 'Wir erreichen 100 zufriedene Taxi- und Mietwagenunternehmen in Deutschland.',
      icon: Trophy
    },
    {
      year: '2020',
      title: 'Cloud-Migration',
      description: 'Vollständige Modernisierung auf Cloud-Infrastruktur für bessere Performance.',
      icon: Target
    },
    {
      year: '2025',
      title: '450+ Unternehmen',
      description: 'Über 450 Unternehmen vertrauen auf MyDispatch für ihre tägliche Disposition.',
      icon: Users
    }
  ];

  const teamMembers = [
    {
      name: 'Pascal Courbois',
      role: 'Gründer & CEO',
      description: '15 Jahre Erfahrung in der Taxi-Branche'
    },
    {
      name: 'Development Team',
      role: 'Software-Entwicklung',
      description: 'Experten für Cloud & Enterprise-Software'
    },
    {
      name: 'Support Team',
      role: 'Kundenbetreuung',
      description: 'Deutschsprachiger Support mit Branchenkenntnissen'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Branchennähe',
      description: 'Wir kennen die Taxi-Branche aus eigener Erfahrung und verstehen Ihre Herausforderungen.'
    },
    {
      icon: Target,
      title: 'Qualität',
      description: 'Höchste Ansprüche an Code-Qualität, Sicherheit und Datenschutz (Made in Germany).'
    },
    {
      icon: Users,
      title: 'Partnerschaft',
      description: 'Sie sind nicht nur Kunde - Sie sind Partner. Ihr Feedback gestaltet unser Produkt.'
    }
  ];

  return (
    <MarketingLayout currentPage="about">
      <SEOHead
        title="Über MyDispatch"
        description="Die Geschichte hinter MyDispatch. Made in Germany, entwickelt von Taxi-Experten für Taxi-Experten seit 2010."
        canonical="/about"
        keywords={['MyDispatch Team', 'Über MyDispatch', 'Taxi Software Entwickler', 'Made in Germany', 'MyDispatch Geschichte']}
      />

      {/* Hero Section - V28HeroPremium */}
      <V28HeroPremium
        variant="home"
        backgroundVariant="3d-premium"
        badge={{ text: 'Made in Germany', icon: Building2 }}
        title="Von Taxi-Experten für Taxi-Experten"
        subtitle="MyDispatch entstand aus 15 Jahren Praxis-Erfahrung"
        description="Wir kennen die Herausforderungen der Taxi-Branche aus eigener Erfahrung und haben MyDispatch entwickelt, um Ihren Alltag zu vereinfachen."
        primaryCTA={{
          label: 'Jetzt starten',
          onClick: () => navigate('/auth?mode=signup')
        }}
        secondaryCTA={{
          label: 'Kontakt aufnehmen',
          onClick: () => navigate('/contact')
        }}
        visual={<AboutDashboardPreview />}
        businessMetrics={[
          { label: 'Gegründet', value: '2010', sublabel: 'in Deutschland' },
          { label: 'Unternehmen', value: '450+', sublabel: 'vertrauen uns' },
          { label: 'Team-Größe', value: '12', sublabel: 'Experten' }
        ]}
      />

      {/* Timeline Section */}
      <V28MarketingSection
        background="canvas"
        title="Unsere Geschichte"
        description="Wie MyDispatch entstanden ist"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {timelineEvents.map((event, index) => {
            const EventIcon = event.icon;
            return (
              <V28MarketingCard
                key={event.year}
                className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <V28IconBox icon={EventIcon} variant="slate" />
                  <div className="text-3xl font-bold text-slate-900">
                    {event.year}
                  </div>
                </div>
                <h4 className="font-sans text-lg font-semibold text-slate-900 mb-2">
                  {event.title}
                </h4>
                <p className="font-sans text-sm text-slate-600">
                  {event.description}
                </p>
              </V28MarketingCard>
            );
          })}
        </div>
      </V28MarketingSection>

      {/* Values Section */}
      <V28MarketingSection
        background="white"
        title="Unsere Werte"
        description="Was uns antreibt"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const ValueIcon = value.icon;
            return (
              <V28MarketingCard
                key={value.title}
                className="text-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              >
                <div className="flex justify-center mb-4">
                  <V28IconBox icon={ValueIcon} variant="slate" />
                </div>
                <h4 className="font-sans text-lg font-semibold text-slate-900 mb-3">
                  {value.title}
                </h4>
                <p className="font-sans text-sm text-slate-600">
                  {value.description}
                </p>
              </V28MarketingCard>
            );
          })}
        </div>
      </V28MarketingSection>

      {/* Team Section */}
      <V28MarketingSection
        background="canvas"
        title="Das Team"
        description="Die Menschen hinter MyDispatch"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <V28MarketingCard
              key={member.name}
              className="text-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              {/* Avatar Placeholder */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-12 h-12 text-slate-600" />
              </div>
              <h4 className="font-sans text-lg font-semibold text-slate-900 mb-2">
                {member.name}
              </h4>
              <Badge className="mb-3 bg-slate-100 text-slate-700 hover:bg-slate-200">
                {member.role}
              </Badge>
              <p className="font-sans text-sm text-slate-600">
                {member.description}
              </p>
            </V28MarketingCard>
          ))}
        </div>
      </V28MarketingSection>

      {/* CTA Section */}
      <V28MarketingSection background="white">
        <V28MarketingCard className="bg-primary text-primary-foreground text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Bereit, durchzustarten?
          </h2>
          <p className="max-w-2xl mx-auto text-base md:text-lg opacity-90 mb-6">
            Werden Sie Teil der MyDispatch-Familie und profitieren Sie von 15 Jahren Branchenerfahrung.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <V28Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/auth?mode=signup')}
            >
              Jetzt kostenlos testen
            </V28Button>
            <V28Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/contact')}
            >
              Persönliche Demo vereinbaren
            </V28Button>
          </div>
        </V28MarketingCard>
      </V28MarketingSection>
    </MarketingLayout>
  );
};

export default About;
