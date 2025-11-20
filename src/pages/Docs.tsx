/* ==================================================================================
   DOCS PAGE - V28.1 PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ V28.1 Design System konform
   ✅ Keine V26-Classes mehr
   ✅ V28 Components (Hero, Section, Card, Button)
   ================================================================================== */

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { SEOHead } from '@/components/shared/SEOHead';
import { useAuth } from '@/hooks/use-auth';
import { DocumentationModal } from '@/components/docs/DocumentationModal';
import { documentationTopics } from '@/data/documentation-content';
import { cn } from '@/lib/utils';
import { V28Button } from '@/components/design-system/V28Button';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28HeroPremium } from '@/components/hero';
import { PremiumDashboardContent } from '@/components/dashboard/PremiumDashboardContent';
import { V28IconBox } from '@/components/design-system/V28IconBox';
import { Play, FileCheck, Users, Car, Handshake, Calendar, TrendingUp, Settings, MessageSquare, BadgeCheck } from 'lucide-react';

const Docs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleTopicClick = (topicId: string) => {
    if (!user) {
      navigate(`/auth?redirect=/docs&topic=${topicId}`);
      return;
    }
    setSelectedTopic(topicId);
  };

  const selectedContent = selectedTopic 
    ? documentationTopics.find(c => c.id === selectedTopic) 
    : null;

  const docCategories = [
    {
      title: 'Schnellstart',
      icon: Play,
      description: 'In 5 Minuten loslegen',
      topics: ['Registrierung & Erstes Login', 'Unternehmensprofil einrichten', 'Fahrer & Fahrzeuge anlegen', 'Ersten Auftrag erfassen']
    },
    {
      title: 'Aufträge',
      icon: FileCheck,
      description: 'Disposition & Buchungen',
      topics: ['Auftrag erstellen', 'Status-Workflow verstehen', 'Zahlungsarten zuweisen', 'Rechnungen erstellen']
    },
    {
      title: 'Kunden',
      icon: Users,
      description: 'Kundenverwaltung',
      topics: ['Kunden anlegen', 'Kundenhistorie einsehen', 'Stammkunden pflegen', 'Rechnungsadressen verwalten']
    },
    {
      title: 'Fahrer',
      icon: Users,
      description: 'Fahrerverwaltung',
      topics: ['Fahrer hinzufügen', 'Führerschein-Dokumente', 'Verfügbarkeit planen', 'Schichtzettel ausfüllen']
    },
    {
      title: 'Fahrzeuge',
      icon: Car,
      description: 'Fuhrparkverwaltung',
      topics: ['Fahrzeug anlegen', 'TÜV & Wartung tracken', 'Konzession hinterlegen', 'Fahrzeughistorie']
    },
    {
      title: 'Partner',
      icon: Handshake,
      description: 'Partnerunternehmen (Business)',
      topics: ['Partner anlegen', 'Provision festlegen', 'Aufträge zuweisen', 'Partner-Filter nutzen']
    },
    {
      title: 'Schichtzettel',
      icon: Calendar,
      description: 'Arbeitszeiten dokumentieren',
      topics: ['Schicht erfassen', 'Pausenzeiten eintragen', 'Kilometerstände', 'Digital bestätigen']
    },
    {
      title: 'Statistiken',
      icon: TrendingUp,
      description: 'Auswertungen (Business)',
      topics: ['Dashboard-Übersicht', 'Umsatz-Reports', 'Fahrer-Performance', 'Auslastungsanalyse']
    },
    {
      title: 'Einstellungen',
      icon: Settings,
      description: 'System konfigurieren',
      topics: ['Unternehmensdaten pflegen', 'Benutzer verwalten', 'Tarif wechseln', 'Daten exportieren']
    }
  ];

  return (
    <MarketingLayout currentPage="docs">
      <SEOHead 
        title="Dokumentation & Hilfe"
        description="MyDispatch Dokumentation: Schnellstart-Guide, Aufträge, Fahrer, Fahrzeuge, Partner, Schichtzettel und mehr."
        canonical="/docs"
        schema={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": "MyDispatch Dokumentation",
          "description": "Vollständige Anleitung zur Nutzung von MyDispatch",
          "author": {
            "@type": "Organization",
            "name": "MyDispatch"
          }
        }}
        keywords={['MyDispatch Anleitung', 'Taxi Software Tutorial', 'MyDispatch Dokumentation', 'Dispositionssoftware Hilfe', 'Schnellstart-Guide']}
      />
      
      {/* Hero Section - V32.0 PREMIUM DASHBOARD */}
      <V28HeroPremium
        variant="features"
        backgroundVariant="3d-premium"
        badge={{ text: 'Dokumentation', icon: Play }}
        title="Alles, was Sie über MyDispatch wissen müssen"
        subtitle="Anleitungen, Tutorials & Best Practices"
        description="Von der Einrichtung bis zu erweiterten Features - unsere Dokumentation begleitet Sie Schritt für Schritt."
        primaryCTA={{
          label: user ? 'Zum Dashboard' : 'Jetzt starten',
          onClick: () => user ? navigate('/dashboard') : navigate('/auth?mode=signup')
        }}
        secondaryCTA={{
          label: 'Support kontaktieren',
          onClick: () => navigate('/contact')
        }}
        visual={<PremiumDashboardContent pageType="docs" />}
        businessMetrics={[
          { label: 'Artikel', value: '50+', sublabel: 'Tutorials' },
          { label: 'Videos', value: '12', sublabel: 'Anleitungen' },
          { label: 'Support', value: '<2h', sublabel: 'Antwortzeit' }
        ]}
        trustElements={true}
      />

      {/* Content Section */}
      <V28MarketingSection
        background="canvas"
        title="Schnellstart & Dokumentation"
        description="Von der ersten Anmeldung bis zur erweiterten Nutzung"
      >
        {/* Quick Start Banner */}
        <V28MarketingCard className="mb-12 bg-primary text-primary-foreground">
          <div className="flex items-center gap-3 sm:gap-4 mb-6">
            <V28IconBox icon={Play} variant="slate" />
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">Schnellstart-Guide</h3>
              <p className="text-sm sm:text-base md:text-lg opacity-90 mt-1">In 5 Minuten einsatzbereit</p>
            </div>
          </div>
          
          <ol className="space-y-2.5 sm:space-y-3 mb-6">
            <li className="flex items-start gap-2.5 sm:gap-3">
              <Badge className="mt-0.5 text-xs sm:text-sm bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">1</Badge>
              <div className="text-sm sm:text-base md:text-lg">
                <strong>Registrieren</strong> - Erstellen Sie Ihr Konto und wählen Sie Ihren Tarif
              </div>
            </li>
            <li className="flex items-start gap-2.5 sm:gap-3">
              <Badge className="mt-0.5 text-xs sm:text-sm bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">2</Badge>
              <div className="text-sm sm:text-base md:text-lg">
                <strong>Unternehmen einrichten</strong> - Hinterlegen Sie Ihre Firmendaten
              </div>
            </li>
            <li className="flex items-start gap-2.5 sm:gap-3">
              <Badge className="mt-0.5 text-xs sm:text-sm bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">3</Badge>
              <div className="text-sm sm:text-base md:text-lg">
                <strong>Fahrer & Fahrzeuge</strong> - Legen Sie Ihre Ressourcen an
              </div>
            </li>
            <li className="flex items-start gap-2.5 sm:gap-3">
              <Badge className="mt-0.5 text-xs sm:text-sm bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">4</Badge>
              <div className="text-sm sm:text-base md:text-lg">
                <strong>Ersten Auftrag</strong> - Erfassen Sie Ihre erste Buchung
              </div>
            </li>
          </ol>
          
          <V28Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => navigate('/auth?mode=signup')}
          >
            Jetzt starten
          </V28Button>
        </V28MarketingCard>

        {/* Documentation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docCategories.map((category, index) => {
            const CategoryIcon = category.icon;
            return (
              <V28MarketingCard
                key={category.title}
                className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <V28IconBox icon={CategoryIcon} variant="slate" />
                  <h3 className="font-sans text-lg font-semibold text-slate-900">{category.title}</h3>
                </div>
                <p className="font-sans text-sm text-slate-600 mb-4">{category.description}</p>
                
                <ul className="space-y-2 mb-4">
                  {category.topics.map((topic, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition-colors cursor-pointer min-h-[44px] flex items-center hover:translate-x-1 duration-200"
                      onClick={() => handleTopicClick(category.title.toLowerCase())}
                    >
                      → {topic}
                    </li>
                  ))}
                </ul>
                
                <V28Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => handleTopicClick(category.title.toLowerCase())}
                >
                  {user ? 'Mehr erfahren' : 'Anmelden & Lesen'}
                </V28Button>
              </V28MarketingCard>
            );
          })}
        </div>

        {/* Support CTA */}
        <V28MarketingCard className="mt-12 bg-primary text-primary-foreground text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
            Brauchen Sie persönliche Hilfe?
          </h2>
          <p className="max-w-3xl mx-auto text-center text-sm sm:text-base md:text-lg opacity-90 mb-4 sm:mb-5 md:mb-6">
            Unser Support-Team steht Ihnen gerne zur Verfügung
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <V28Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/contact')}
            >
              Support kontaktieren
            </V28Button>
            <V28Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/faq')}
            >
              Zu den FAQs
            </V28Button>
          </div>
        </V28MarketingCard>
      </V28MarketingSection>

      {/* Documentation Modal */}
      {selectedContent && (
        <DocumentationModal
          isOpen={!!selectedTopic}
          onClose={() => setSelectedTopic(null)}
          title={selectedContent.title}
          content={selectedContent.content}
        />
      )}
    </MarketingLayout>
  );
};

export default Docs;
