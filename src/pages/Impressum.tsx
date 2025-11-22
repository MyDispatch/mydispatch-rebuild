/* ==================================================================================
   IMPRESSUM - V28.1 PROFESSIONAL MINIMALISM
   ==================================================================================
   ✅ V28.1 Design System konform
   ✅ Layout konsistent mit anderen Legal Pages
   ✅ TMG & DL-InfoV vollständig
   ================================================================================== */

import { MapPin, Phone, Mail, Globe, ExternalLink, FileText } from 'lucide-react';
import { SEOHead } from '@/components/shared/SEOHead';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import { V28HeroPremium } from '@/components/hero/V28HeroPremium';
import { PremiumDashboardContent } from '@/components/dashboard/PremiumDashboardContent';
import { V28MarketingSection } from '@/components/design-system/V28MarketingSection';
import { V28MarketingCard } from '@/components/design-system/V28MarketingCard';

const Impressum = () => {
  return (
    <MarketingLayout currentPage="legal">
      <SEOHead
        title="Impressum"
        description="Impressum von MyDispatch. Anbieter: Ibrahim SIMSEK, Ensbachmühle 4, D-94571 Schaufling. Kontakt: info@my-dispatch.de"
        canonical="/impressum"
      />

      {/* Hero Section - V28HeroPremium */}
      <V28HeroPremium
        variant="demo"
        backgroundVariant="3d-premium"
        badge={{ text: "Rechtliche Angaben", icon: FileText }}
        title="Impressum"
        subtitle="Angaben gemäß § 5 TMG und § 2 DL-InfoV"
        description="Alle rechtlichen Informationen zu MyDispatch und NeXify"
        primaryCTA={{
          label: 'Kontakt aufnehmen',
          onClick: () => window.location.href = '/contact'
        }}
        visual={
          <PremiumDashboardContent pageType="impressum" />
        }
      />

      {/* Content Section */}
      <V28MarketingSection background="canvas">
        <div className="space-y-8">
          {/* RideHub Solutions Card */}
          <V28MarketingCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
                <span className="text-slate-900 font-bold text-2xl">R</span>
              </div>
              <div>
                <h2 className="font-sans text-2xl font-bold text-slate-900">RideHub Solutions</h2>
                <p className="font-sans text-sm text-slate-600">Marke: MyDispatch by RideHub Solutions</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">Verantwortlich für den Inhalt gemäß § 55 Abs. 2 RStV</h3>
                <p className="font-sans text-sm text-slate-600 mb-2">Inhaber: Ibrahim SIMSEK</p>
                <div className="flex items-start gap-2 mt-2">
                  <MapPin className="h-4 w-4 text-slate-700 mt-0.5" />
                  <div>
                    <p className="font-sans text-sm text-slate-600">Ensbachmühle 4</p>
                    <p className="font-sans text-sm text-slate-600">D-94571 Schaufling</p>
                    <p className="font-sans text-sm text-slate-600">Deutschland</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">Kontaktdaten</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-700" />
                    <a href="tel:+491708004423" className="font-sans text-sm text-slate-700 hover:text-slate-900 hover:underline transition-colors">+49 170 8004423</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-700" />
                    <a href="mailto:info@my-dispatch.de" className="font-sans text-sm text-slate-700 hover:text-slate-900 hover:underline transition-colors">info@my-dispatch.de</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-700" />
                    <a href="https://www.my-dispatch.de" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-slate-700 hover:text-slate-900 hover:underline transition-colors">www.my-dispatch.de</a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">Geschäftszeiten</h3>
                <p className="font-sans text-sm text-slate-600"><strong>Bürozeiten:</strong> Mo-Fr: 09:00 - 17:00 Uhr</p>
                <p className="font-sans text-sm text-slate-600"><strong>24/7 Support:</strong> E-Mail-Support rund um die Uhr</p>
                <p className="font-sans text-sm text-slate-600"><strong>Reaktionszeit:</strong> &lt; 24h</p>
              </div>
            </div>
          </V28MarketingCard>

          {/* NeXify Card */}
          <V28MarketingCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
                <span className="text-slate-900 font-bold text-2xl">N</span>
              </div>
              <div>
                <h2 className="font-sans text-2xl font-bold text-slate-900">NeXify</h2>
                <p className="font-sans text-sm text-slate-600">Technologiepartner & Auftragsverarbeiter</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">Unternehmensdaten</h3>
                <p className="font-sans text-sm text-slate-600 mb-2">Pascal Courbois</p>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate-700 mt-0.5" />
                  <div>
                    <p className="font-sans text-sm text-slate-600">Graaf van Loonstraat 1E</p>
                    <p className="font-sans text-sm text-slate-600">5921 JA Venlo</p>
                    <p className="font-sans text-sm text-slate-600">Niederlande</p>
                    <p className="font-sans text-sm font-semibold text-slate-900 mt-2">Deutsche Anschrift:</p>
                    <p className="font-sans text-sm text-slate-600">Wallstrasse 9, 41334 Kaldenkirchen-Nettetal, Deutschland</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">Kontaktdaten</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-700" />
                    <a href="tel:+31613318856" className="font-sans text-sm text-slate-700 hover:text-slate-900 hover:underline transition-colors">+31 6 133 188 56</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-700" />
                    <a href="mailto:support@nexify-automate.com" className="font-sans text-sm text-slate-700 hover:text-slate-900 hover:underline transition-colors">support@nexify-automate.com</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-700" />
                    <a href="https://www.nexify-automate.com" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-slate-700 hover:text-slate-900 hover:underline transition-colors">www.nexify-automate.com</a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">Handelsregister & Steuern</h3>
                <p className="font-sans text-sm text-slate-600"><strong>KvK-Nummer:</strong> 90483944</p>
                <p className="font-sans text-sm text-slate-600"><strong>USt-ID:</strong> NL865786276B01</p>
              </div>

              <div className="bg-slate-100 p-4 rounded-lg">
                <p className="font-sans text-sm font-semibold text-slate-900 mb-2">Rolle als Auftragsverarbeiter gemäß Art. 28 DSGVO:</p>
                <p className="font-sans text-sm text-slate-600 mb-2">
                  NeXify erbringt technische Dienstleistungen für MyDispatch (Hosting-Infrastruktur, technischer Support, Systementwicklung, Wartung und Updates) ausschließlich als Auftragsverarbeiter nach Weisung von MyDispatch. Die Datenverarbeitung erfolgt DSGVO-konform auf Grundlage eines Auftragsverarbeitungsvertrags (AVV).
                </p>
                <p className="font-sans text-sm text-slate-600">
                  <strong>Leistungen:</strong> Cloud-Hosting (EU-Server), technischer 24/7-Support, Software-Development, System-Wartung, Sicherheitsupdates, Performance-Optimierung
                </p>
              </div>
            </div>
          </V28MarketingCard>

          {/* Rechtliche Hinweise Card */}
          <V28MarketingCard>
            <h2 className="font-sans text-2xl font-bold text-slate-900 mb-6">Rechtliche Hinweise</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">Haftung für Inhalte (§ 7 Abs. 1 TMG)</h3>
                <p className="font-sans text-sm text-slate-600">
                          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                        </p>
                <p className="font-sans text-sm text-slate-600 mt-2">
                  Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
                </p>
              </div>

              <div>
                <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">Haftung für externe Links (§ 8 Abs. 1 TMG)</h3>
                <p className="font-sans text-sm text-slate-600">
                          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                        </p>
                <p className="font-sans text-sm text-slate-600 mt-2">
                  Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                </p>
              </div>

              <div>
                <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">Urheberrecht & Markenrecht</h3>
                <p className="font-sans text-sm text-slate-600">
                          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                        </p>
                <p className="font-sans text-sm text-slate-600 mt-2">
                  Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                </p>
              </div>

              <div>
                <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">Datenschutz</h3>
                <p className="font-sans text-sm text-slate-600">
                  Die Nutzung unserer Website ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten erhoben werden, erfolgt dies stets auf freiwilliger Basis und nach ausdrücklicher Einwilligung. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.
                </p>
                <p className="font-sans text-sm text-slate-600 mt-2">
                  Ausführliche Informationen finden Sie in unserer <a href="/datenschutz" className="font-sans text-slate-700 hover:text-slate-900 hover:underline transition-colors">Datenschutzerklärung</a>.
                </p>
              </div>
            </div>
          </V28MarketingCard>

          {/* Streitbeilegung Card */}
          <V28MarketingCard>
            <h2 className="font-sans text-2xl font-bold text-slate-900 mb-6">Streitbeilegung & Verbraucherinformation</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">Online-Streitbeilegung gemäß Art. 14 Abs. 1 ODR-VO</h3>
                <p className="font-sans text-sm text-slate-600 mb-3">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter folgendem Link erreichen:
                </p>
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-sans text-sm text-slate-700 hover:text-slate-900 hover:underline transition-colors"
                >
                  https://ec.europa.eu/consumers/odr
                  <ExternalLink className="h-4 w-4 text-slate-700" />
                </a>
              </div>

              <div>
                <h3 className="font-sans text-lg font-semibold text-slate-900 mb-3">Verbraucherschlichtung gemäß § 36 VSBG</h3>
                <p className="font-sans text-sm text-slate-600">
                  Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 Abs. 1 Nr. 1 VSBG - Verbraucherstreitbeilegungsgesetz).
                </p>
              </div>

              <div className="bg-slate-100 p-4 rounded-lg">
                <p className="font-sans text-sm font-semibold text-slate-900 mb-2">Hinweis zur Streitbeilegung:</p>
                <p className="font-sans text-sm text-slate-600">
                  Bei Fragen oder Beschwerden wenden Sie sich bitte zunächst direkt an unseren Kundensupport. Wir sind stets bemüht, eine einvernehmliche Lösung zu finden.
                </p>
              </div>
            </div>
          </V28MarketingCard>
        </div>
      </V28MarketingSection>
        </MarketingLayout>
  );
};

export default Impressum;
