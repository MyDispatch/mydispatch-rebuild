/* ==================================================================================
   KRITISCHER HINWEIS: FAQ - DESIGN/LAYOUT FINAL!
   ==================================================================================
   VISUELL FINAL | Funktionale Erweiterung erlaubt | CI-konform
   ================================================================================== */

import { Badge } from '@/components/ui/badge';
import { SEOHead } from '@/components/shared/SEOHead';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { faqSchema } from '@/lib/schema-org';
import { HelpCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { V28HeroPremium } from '@/components/hero';
import { PremiumDashboardContent } from '@/components/dashboard/PremiumDashboardContent';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';
import { V28IconBox } from '@/components/design-system/V28IconBox';
import { V28Button } from '@/components/design-system/V28Button';
import { V28AccordionItem } from '@/components/pricing';
import { Accordion } from '@/components/ui/accordion';

const faqCategories = [
  {
    category: 'Allgemein',
    icon: HelpCircle,
    questions: [
      {
        q: 'Was ist MyDispatch?',
        a: 'MyDispatch ist eine professionelle Dispositionssoftware für Taxi-, Mietwagen- und Limousinenunternehmen. Sie umfasst Auftragsverwaltung, Flottenmanagement, Partner-Integration, PBefG-konforme Dokumentation und vieles mehr.',
      },
      {
        q: 'Für wen ist MyDispatch geeignet?',
        a: 'MyDispatch richtet sich an Taxi-, Mietwagen- und Limousinenunternehmen jeder Größe – vom Einzelunternehmer bis zum mittelständischen Fuhrpark mit mehreren Dutzend Fahrzeugen.',
      },
      {
        q: 'Ist MyDispatch für Taxiunternehmen geeignet?',
        a: 'Ja! MyDispatch erfüllt alle gesetzlichen Anforderungen für Taxiunternehmen: P-Schein-Verwaltung, Funk-Integration, PBefG § 51-Dokumentation (Beförderungsdaten), Taxameter-Anbindung und Tarifverwaltung. Rechtssichere Disposition nach allen branchenspezifischen Anforderungen.',
      },
      {
        q: 'Erfüllt MyDispatch die Rückkehrpflicht für Mietwagenunternehmen (§ 49 Abs. 4 PBefG)?',
        a: 'Ja! MyDispatch dokumentiert automatisch alle Rückkehrfahrten zum Betriebssitz mit Zeitstempel. Sie erfüllen damit automatisch die gesetzliche Rückkehrpflicht nach § 49 Abs. 4 PBefG.',
      },
      {
        q: 'Bietet MyDispatch White-Labeling für Limousinen-Services?',
        a: 'Ja! Im Enterprise-Tarif können Sie Ihr eigenes Branding verwenden (Logo, Farben, Domain). Ihre Kunden sehen keine MyDispatch-Referenzen. Perfekt für Premium-Limousinen-Services.',
      },
      {
        q: 'Ist MyDispatch DSGVO-konform?',
        a: 'Ja, MyDispatch ist vollständig DSGVO-konform. Alle Daten werden auf deutschen Servern gespeichert und unterliegen den strengen deutschen Datenschutzbestimmungen.',
      },
    ],
  },
  {
    category: 'Tarife & Abrechnung',
    icon: HelpCircle,
    questions: [
      {
        q: 'Welche Tarife gibt es?',
        a: 'Wir bieten drei Tarife an: Starter (39€/Monat oder 374,40€/Jahr) für bis zu 3 Fahrer/Fahrzeuge mit Basisdisposition, Kunden-/Fahrerverwaltung, Auftragsverwaltung, Angeboten & Rechnungen und Info-Landingpage. Business (99€/Monat oder 950,40€/Jahr) mit beliebig vielen Fahrern, allen Starter-Features plus Partner-Management, Live-Traffic & Wetter, Statistiken, Kunden-Portal, Buchungswidget, AI-Chatbot und API-Zugang. Enterprise mit individuellen Konditionen.',
      },
      {
        q: 'Gibt es eine Vertragslaufzeit?',
        a: 'Nein, alle Tarife sind monatlich kündbar. Sie gehen keine langfristige Verpflichtung ein.',
      },
      {
        q: 'Kann ich meinen Tarif upgraden?',
        a: 'Ja, Sie können jederzeit auf einen höheren Tarif wechseln. Der Wechsel wird sofort wirksam und Sie zahlen nur die anteilige Differenz.',
      },
      {
        q: 'Wie funktioniert die Abrechnung?',
        a: 'Die Abrechnung erfolgt monatlich über Stripe. Sie erhalten automatisch eine Rechnung per E-Mail.',
      },
      {
        q: 'Kann ich jederzeit kündigen?',
        a: 'Ja, MyDispatch hat keine Mindestlaufzeit. Sie können monatlich kündigen. Die Kündigung wird zum Ende des aktuellen Abrechnungszeitraums wirksam.',
      },
    ],
  },
  {
    category: 'Features & Funktionen',
    icon: HelpCircle,
    questions: [
      {
        q: 'Was ist im Starter-Tarif enthalten?',
        a: 'Der Starter-Tarif umfasst Basisdisposition, Kunden-/Fahrerverwaltung, Auftragsverwaltung, Angebote & Rechnungen und eine Info-Landingpage für bis zu 3 Fahrer/Fahrzeuge. Kein Partner-Management, keine Live-Traffic-Infos, kein Kunden-Portal, kein Buchungswidget, keine Statistiken.',
      },
      {
        q: 'Was bietet der Business-Tarif zusätzlich?',
        a: 'Der Business-Tarif bietet keine Begrenzung bei Fahrern/Fahrzeugen, Partner-Management, Live-Traffic & Wetter, Statistiken & Reports, Kunden-Login & Portal, Buchungswidget auf der Landingpage, AI-Chatbot und API-Zugang.',
      },
      {
        q: 'Kann ich meine Daten exportieren?',
        a: 'Ja, Sie können alle Ihre Daten jederzeit als CSV oder PDF exportieren.',
      },
      {
        q: 'Gibt es eine mobile App?',
        a: 'MyDispatch ist als responsive Web-App konzipiert und funktioniert auf allen Geräten. Eine native mobile App ist in Planung.',
      },
      {
        q: 'Können mehrere Benutzer gleichzeitig arbeiten?',
        a: 'Ja, MyDispatch unterstützt mehrere gleichzeitige Benutzer im gleichen Unternehmen.',
      },
    ],
  },
  {
    category: 'Technischer Support',
    icon: HelpCircle,
    questions: [
      {
        q: 'Wie erreiche ich den Support?',
        a: 'Sie erreichen unseren Support per E-Mail unter support@mydispatch.de. Business-Kunden haben zusätzlich Zugang zum Live-Chat.',
      },
      {
        q: 'Gibt es Schulungen?',
        a: 'Ja, wir bieten Online-Schulungen für neue Nutzer an. Kontaktieren Sie uns für weitere Informationen.',
      },
      {
        q: 'Was passiert bei technischen Problemen?',
        a: 'Unser Support-Team hilft Ihnen schnell weiter. Die durchschnittliche Antwortzeit beträgt weniger als 4 Stunden.',
      },
      {
        q: 'Gibt es eine Dokumentation?',
        a: 'Ja, wir stellen eine umfassende Online-Dokumentation mit Video-Tutorials zur Verfügung.',
      },
    ],
  },
  {
    category: 'DSGVO & Datenschutz',
    icon: HelpCircle,
    questions: [
      {
        q: 'Wo werden meine Daten gespeichert?',
        a: 'Alle Daten werden in ISO-zertifizierten Rechenzentren in Deutschland gespeichert.',
      },
      {
        q: 'Wer hat Zugriff auf meine Daten?',
        a: 'Nur Sie und Ihre autorisierten Mitarbeiter haben Zugriff auf Ihre Unternehmensdaten. Unsere Mitarbeiter können nur auf Supportanfrage und mit Ihrer Erlaubnis Einblick nehmen.',
      },
      {
        q: 'Werden meine Daten an Dritte weitergegeben?',
        a: 'Nein, wir geben Ihre Daten niemals an Dritte weiter. Ausnahme: Stripe für die Zahlungsabwicklung (PCI-DSS zertifiziert).',
      },
      {
        q: 'Kann ich meine Daten löschen lassen?',
        a: 'Ja, Sie haben jederzeit das Recht auf Löschung Ihrer Daten gemäß DSGVO Art. 17.',
      },
      {
        q: 'Gibt es einen Auftragsverarbeitungsvertrag (AVV)?',
        a: 'Ja, wir stellen allen Kunden einen DSGVO-konformen AVV zur Verfügung.',
      },
    ],
  },
];

export default function FAQ() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Alle Fragen für Schema.org
  const allQuestions = useMemo(() => 
    faqCategories.flatMap(cat => cat.questions),
    []
  );

  const filteredCategories = faqCategories.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.a.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <MarketingLayout currentPage="faq">
      <SEOHead
        title="Häufig gestellte Fragen (FAQ)"
        description="Antworten auf häufig gestellte Fragen zu MyDispatch: Tarife, Features, Support, DSGVO und mehr."
        canonical="/faq"
        schema={faqSchema(allQuestions)}
        keywords={['MyDispatch FAQ', 'Taxi Software Fragen', 'MyDispatch Support', 'Dispositionssoftware Hilfe', 'DSGVO Taxi Software']}
      />

      {/* Hero Section - V32.0 PREMIUM DASHBOARD */}
      <V28HeroPremium
        variant="features"
        backgroundVariant="3d-premium"
        badge={{ text: 'Hilfe & Support', icon: HelpCircle }}
        title="Häufig gestellte Fragen"
        subtitle="Finden Sie schnell Antworten auf die wichtigsten Fragen zu MyDispatch"
        description="Nutzen Sie die Suchfunktion oder browsen Sie durch die Kategorien"
        primaryCTA={{
          label: 'Jetzt starten',
          onClick: () => navigate('/auth?mode=signup')
        }}
        secondaryCTA={{
          label: 'Kontakt aufnehmen',
          onClick: () => navigate('/contact')
        }}
        visual={<PremiumDashboardContent pageType="faq" />}
        businessMetrics={[
          { label: 'Kategorien', value: '5', sublabel: 'Themenbereiche' },
          { label: 'Antworten', value: '80+', sublabel: 'Fragen' },
          { label: 'Support', value: '<24h', sublabel: 'Antwortzeit' }
        ]}
        trustElements={true}
      />

      {/* Content Section */}
      <V28MarketingSection
        background="canvas"
      >
        {/* Search Bar */}
        <div className="w-full max-w-xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Frage suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 min-h-[44px] text-base"
            />
          </div>
        </div>

        {/* FAQ Kategorien */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-10 sm:py-12">
            <p className="text-base md:text-lg text-slate-600">Keine Ergebnisse gefunden.</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {filteredCategories.map((category) => (
              <V28MarketingCard
                key={category.category}
                className="transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3 mb-6">
                  <V28IconBox icon={category.icon} variant="slate" />
                  <h3 className="font-sans text-xl sm:text-2xl font-semibold text-slate-900">{category.category}</h3>
                  <Badge className="text-xs sm:text-sm bg-primary text-primary-foreground border-none ml-auto">
                    {category.questions.length}
                  </Badge>
                </div>

                <Accordion type="single" collapsible className="space-y-0">
                  {category.questions.map((item, index) => (
                    <V28AccordionItem
                      key={index}
                      value={`${category.category}-${index}`}
                      question={item.q}
                      answer={item.a}
                    />
                  ))}
                </Accordion>
              </V28MarketingCard>
            ))}
          </div>
        )}

        {/* CTA Card */}
        <V28MarketingCard className="mt-12 bg-slate-600 text-white text-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
            Frage nicht gefunden?
          </h3>
          <p className="text-center max-w-2xl mx-auto opacity-90 mb-6 text-base sm:text-lg md:text-xl">
            Unser Support-Team hilft Ihnen gerne weiter.
          </p>
          <V28Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/contact')}
          >
            Kontakt aufnehmen
          </V28Button>
        </V28MarketingCard>
      </V28MarketingSection>
    </MarketingLayout>
  );
}
