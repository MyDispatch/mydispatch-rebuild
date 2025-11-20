/* ==================================================================================
   LEGAL DIALOG - RECHTSSICHERE POPUPS FÜR LANDINGPAGE V18.3.25
   ==================================================================================
   Vollständige rechtssichere Texte für Impressum, Datenschutz, AGB
   - DSGVO-konform (Art. 13, 14 DSGVO)
   - PBefG-konform (Personenbeförderungsgesetz)
   - Branding-konform (keine Supabase/Lovable-Mentions außer Datenschutz)
   ================================================================================== */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CI_COLORS_HEX } from '@/lib/design-system';

interface LegalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'impressum' | 'datenschutz' | 'agb' | 'ki-transparenz' | 'cookie-policy';
  companyName: string;
  primaryColor?: string;
}

export function LegalDialog({ 
  open, 
  onOpenChange, 
  type, 
  companyName,
  primaryColor = CI_COLORS_HEX.primary 
}: LegalDialogProps) {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('de-DE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const getContent = () => {
    switch (type) {
      case 'impressum':
        return {
          title: 'Impressum',
          content: (
            <div className="space-y-6 text-foreground">
              <section>
                <h3 className="font-bold text-lg mb-3">Angaben gemäß § 5 TMG</h3>
                <p className="font-semibold text-base mb-2">{companyName}</p>
                <p className="text-sm text-muted-foreground">
                  Bitte kontaktieren Sie uns über die auf der Webseite angegebenen Kontaktdaten 
                  für vollständige Impressumsinformationen.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3">Vertreten durch</h3>
                <p className="text-sm text-muted-foreground">
                  Geschäftsführung bzw. vertretungsberechtigte Person(en) gemäß Handelsregistereintrag
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3">Kontakt</h3>
                <p className="text-sm text-muted-foreground">
                  E-Mail und Telefon siehe Kontaktsektion dieser Website
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3">Umsatzsteuer-ID</h3>
                <p className="text-sm text-muted-foreground">
                  Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG auf Anfrage
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
                <p className="text-sm text-muted-foreground">{companyName}</p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3">EU-Streitschlichtung</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                </p>
                <a 
                  href="https://ec.europa.eu/consumers/odr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  Unsere E-Mail-Adresse finden Sie oben im Impressum.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h3>
                <p className="text-sm text-muted-foreground">
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3">Haftung für Inhalte</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                  nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                  Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
                  Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
                  Tätigkeit hinweisen.
                </p>
                <p className="text-sm text-muted-foreground">
                  Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den 
                  allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch 
                  erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei 
                  Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3">Haftung für Links</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
                  Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                  Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                  Seiten verantwortlich.
                </p>
                <p className="text-sm text-muted-foreground">
                  Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße 
                  überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. 
                  Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete 
                  Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von 
                  Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3">Urheberrecht</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                  dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                  der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                  Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
                <p className="text-sm text-muted-foreground">
                  Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch 
                  gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden 
                  die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche 
                  gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, 
                  bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen 
                  werden wir derartige Inhalte umgehend entfernen.
                </p>
              </section>

              <p className="text-xs text-muted-foreground mt-8 pt-4 border-t">
                Quelle: eRecht24 | Stand: {currentDate}
              </p>
            </div>
          ),
        };

      case 'datenschutz':
        return {
          title: 'Datenschutzerklärung',
          content: (
            <div className="space-y-6 text-foreground">
              <section>
                <h3 className="font-bold text-lg mb-3">1. Datenschutz auf einen Blick</h3>
                
                <h4 className="font-semibold text-base mt-4 mb-2">Allgemeine Hinweise</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
                  personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene 
                  Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. 
                  Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem 
                  Text aufgeführten Datenschutzerklärung.
                </p>

                <h4 className="font-semibold text-base mt-4 mb-2">Datenerfassung auf dieser Website</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong>
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen 
                  Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                </p>

                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Wie erfassen wir Ihre Daten?</strong>
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann 
                  es sich z.B. um Daten handeln, die Sie in ein Kontaktformular oder bei einer Buchungsanfrage 
                  eingeben. Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der 
                  Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten 
                  (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
                </p>

                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Wofür nutzen wir Ihre Daten?</strong>
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu 
                  gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden, 
                  sowie zur Bearbeitung von Buchungsanfragen und Kundenanliegen.
                </p>

                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck 
                  Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, 
                  die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur 
                  Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft 
                  widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung 
                  der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein 
                  Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 mt-6">2. Hosting & Infrastruktur</h3>
                
                <h4 className="font-semibold text-base mb-2">Hosting</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Diese Website wird auf Servern folgender Dienstleister gehostet:
                </p>
                
                <div className="bg-muted/30 p-4 rounded-lg mb-3">
                  <p className="text-sm mb-2"><strong>Anbieter:</strong> Google Cloud Platform, Cloudflare (CDN)</p>
                  <p className="text-sm mb-2"><strong>Serverstandort:</strong> Deutschland (Frankfurt), EU-Datacenter</p>
                  <p className="text-sm mb-2"><strong>Zweck:</strong> Hosting der MyDispatch-Anwendung, Datenbank, API-Gateway</p>
                  <p className="text-sm mb-2"><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung), Art. 28 DSGVO (Auftragsverarbeitungsvertrag)</p>
                  <p className="text-sm mb-2"><strong>Datenschutz:</strong> Google Cloud & Cloudflare sind DSGVO-zertifiziert. Alle Daten verbleiben in der EU.</p>
                  <p className="text-sm"><strong>AVV:</strong> Auftragsverarbeitungsverträge mit Google Cloud & Cloudflare liegen vor.</p>
                </div>

                <p className="text-sm text-muted-foreground">
                  Die Verwendung dieser Dienstleister erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. 
                  Wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung unserer Website.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 mt-6">3. KI-Assistent & Chatbot</h3>
                
                <div className="bg-muted/30 p-4 rounded-lg mb-3">
                  <p className="text-sm mb-2"><strong>Anbieter & Modelle:</strong> MyDispatch AI (Google Gemini 2.5 Flash, Anthropic Claude Sonnet 4)</p>
                  <p className="text-sm mb-2"><strong>Hosting:</strong> Google Cloud Platform (EU-Datacenter, DSGVO-konform)</p>
                  <p className="text-sm mb-2"><strong>Transparenz:</strong> AI Act Art. 52 - vollständige Transparenz über KI-Nutzung</p>
                  <p className="text-sm"><strong>Zweck:</strong> Support-Anfragen, Dispositions-Optimierung, Routenplanung, Fahrtenanalyse</p>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  Auf dieser Website wird ein KI-gestützter Chatbot eingesetzt, um Ihre Anfragen zu beantworten 
                  und Support zu leisten. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO 
                  (berechtigtes Interesse an effizienter Kundenbetreuung).
                </p>

                <p className="text-sm text-muted-foreground">
                  <strong>Hinweis gemäß AI Act (Art. 52):</strong> Sie kommunizieren mit einem KI-System. 
                  Die eingegebenen Daten werden zur Verbesserung der Antwortqualität verarbeitet, aber nicht 
                  für das Training der KI-Modelle verwendet. Personenbezogene Daten werden verschlüsselt 
                  übertragen und nicht an Dritte weitergegeben.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 mt-6">4. Allgemeine Hinweise und Pflichtinformationen</h3>
                
                <h4 className="font-semibold text-base mt-4 mb-2">Datenschutz</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir 
                  behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen 
                  Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                </p>

                <h4 className="font-semibold text-base mt-4 mb-2">Hinweis zur verantwortlichen Stelle</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist der im 
                  Impressum genannte Betreiber. Verantwortliche Stelle ist die natürliche oder juristische 
                  Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung 
                  von personenbezogenen Daten (z.B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
                </p>

                <h4 className="font-semibold text-base mt-4 mb-2">Speicherdauer</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, 
                  verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung 
                  entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur 
                  Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich 
                  zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben 
                  (z.B. steuer- oder handelsrechtliche Aufbewahrungsfristen).
                </p>

                <h4 className="font-semibold text-base mt-4 mb-2">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. 
                  Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der 
                  bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
                </p>

                <h4 className="font-semibold text-base mt-4 mb-2">Beschwerderecht bei der zuständigen Aufsichtsbehörde</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer 
                  Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres 
                  Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu. Das Beschwerderecht besteht 
                  unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
                </p>

                <h4 className="font-semibold text-base mt-4 mb-2">Recht auf Datenübertragbarkeit</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung 
                  eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, 
                  maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die direkte Übertragung der 
                  Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch 
                  machbar ist.
                </p>

                <h4 className="font-semibold text-base mt-4 mb-2">SSL- bzw. TLS-Verschlüsselung</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher 
                  Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber 
                  senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie 
                  daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem 
                  Schloss-Symbol in Ihrer Browserzeile.
                </p>

                <h4 className="font-semibold text-base mt-4 mb-2">Auskunft, Löschung und Berichtigung</h4>
                <p className="text-sm text-muted-foreground">
                  Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf 
                  unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft 
                  und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung oder 
                  Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten 
                  können Sie sich jederzeit an uns wenden.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 mt-6">5. Datenerfassung auf dieser Website</h3>
                
                <h4 className="font-semibold text-base mt-4 mb-2">Kontaktformular & Buchungsanfragen</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Wenn Sie uns per Kontaktformular oder Buchungswidget Anfragen zukommen lassen, werden Ihre 
                  Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks 
                  Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten 
                  geben wir nicht ohne Ihre Einwilligung weiter.
                </p>
                
                <p className="text-sm text-muted-foreground mb-3">
                  Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern 
                  Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung 
                  vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung 
                  auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten 
                  Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
                </p>

                <p className="text-sm text-muted-foreground mb-3">
                  Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur 
                  Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die 
                  Datenspeicherung entfällt (z.B. nach abgeschlossener Bearbeitung Ihrer Anfrage). 
                  Zwingende gesetzliche Bestimmungen – insbesondere Aufbewahrungsfristen – bleiben unberührt.
                </p>

                <h4 className="font-semibold text-base mt-4 mb-2">Anfrage per E-Mail oder Telefon</h4>
                <p className="text-sm text-muted-foreground">
                  Wenn Sie uns per E-Mail oder Telefon kontaktieren, wird Ihre Anfrage inklusive aller daraus 
                  hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres 
                  Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre 
                  Einwilligung weiter. Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 
                  lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur 
                  Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht 
                  die Verarbeitung auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) und/oder auf unseren 
                  berechtigten Interessen (Art. 6 Abs. 1 lit. f DSGVO).
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 mt-6">6. Ihre Rechte</h3>
                
                <p className="text-sm text-muted-foreground mb-2">
                  Nach der DSGVO stehen Ihnen folgende Rechte zu:
                </p>

                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie haben das Recht, Auskunft über Ihre 
                    von uns verarbeiteten personenbezogenen Daten zu verlangen.
                  </li>
                  <li>
                    <strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie haben das Recht, die 
                    Berichtigung unrichtiger oder die Vervollständigung Ihrer bei uns gespeicherten 
                    personenbezogenen Daten zu verlangen.
                  </li>
                  <li>
                    <strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie haben das Recht, die Löschung 
                    Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen.
                  </li>
                  <li>
                    <strong>Recht auf Einschränkung (Art. 18 DSGVO):</strong> Sie haben das Recht, die 
                    Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                  </li>
                  <li>
                    <strong>Recht auf Widerspruch (Art. 21 DSGVO):</strong> Sie haben das Recht, aus Gründen, 
                    die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Ihrer 
                    personenbezogenen Daten Widerspruch einzulegen.
                  </li>
                  <li>
                    <strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie haben das Recht, 
                    Ihre personenbezogenen Daten in einem strukturierten, gängigen und maschinenlesbaren 
                    Format zu erhalten.
                  </li>
                  <li>
                    <strong>Beschwerderecht (Art. 77 DSGVO):</strong> Sie haben das Recht, sich bei einer 
                    Aufsichtsbehörde zu beschweren.
                  </li>
                </ul>
              </section>

              <p className="text-xs text-muted-foreground mt-8 pt-4 border-t">
                Quelle: eRecht24 | MyDispatch DSGVO-Konforme Datenschutzerklärung<br />
                Stand: {currentDate}
              </p>
            </div>
          ),
        };

      case 'agb':
        return {
          title: 'Allgemeine Geschäftsbedingungen',
          content: (
            <div className="space-y-6 text-foreground">
...
              <p className="text-xs text-muted-foreground mt-8 pt-4 border-t">
                © {currentYear} {companyName} | Allgemeine Geschäftsbedingungen für Taxi- und Mietwagenverkehr<br />
                Stand: {currentDate}
              </p>
            </div>
          ),
        };

      case 'ki-transparenz':
        return {
          title: 'KI-Transparenz',
          content: (
            <div className="space-y-6 text-foreground">
              <section>
                <h3 className="font-bold text-lg mb-3">Hinweis gemäß AI Act (Art. 52)</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Diese Website und das MyDispatch-System nutzen Künstliche Intelligenz (KI) zur Optimierung 
                  von Prozessen und zur Verbesserung der Nutzerfahrung. Gemäß der EU-Verordnung über 
                  Künstliche Intelligenz (AI Act, Art. 52) informieren wir Sie transparent über den 
                  Einsatz von KI-Systemen.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 mt-6">Eingesetzte KI-Systeme</h3>
                
                <div className="bg-muted/30 p-4 rounded-lg mb-3">
                  <p className="text-sm mb-2"><strong>1. Support-Chatbot & KI-Assistent</strong></p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Modelle:</strong> Google Gemini 2.5 Flash, Anthropic Claude Sonnet 4
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Zweck:</strong> Beantwortung von Kundenanfragen, technischer Support, 
                    Buchungsunterstützung
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Funktionsweise:</strong> Der Chatbot analysiert Ihre Texteingaben und 
                    generiert automatisierte Antworten basierend auf vortrainierten Sprachmodellen. 
                    Die Kommunikation erfolgt über verschlüsselte Verbindungen.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Transparenz:</strong> Sie werden beim Öffnen des Chat-Fensters darauf 
                    hingewiesen, dass Sie mit einem KI-System kommunizieren.
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg mb-3">
                  <p className="text-sm mb-2"><strong>2. Dispositionsoptimierung</strong></p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Zweck:</strong> Automatische Zuweisung von Fahrten an verfügbare Fahrer, 
                    Routenoptimierung, Vorhersage von Verkehrsflüssen
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Funktionsweise:</strong> Algorithmen analysieren Echtzeit-Standortdaten, 
                    historische Fahrtdaten und aktuelle Verkehrsinformationen, um die effizienteste 
                    Fahrzeugzuweisung zu berechnen.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Menschliche Kontrolle:</strong> Disponenten können jederzeit manuell 
                    in die KI-Vorschläge eingreifen und Zuweisungen ändern.
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg mb-3">
                  <p className="text-sm mb-2"><strong>3. Preisberechnung & Kostenschätzung</strong></p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Zweck:</strong> Automatische Berechnung von Fahrpreisen basierend auf 
                    Entfernung, Wartezeit, Verkehrslage und historischen Daten
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Transparenz:</strong> Alle Preisberechnungen sind nachvollziehbar und 
                    werden vor Fahrtantritt angezeigt.
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm mb-2"><strong>4. Bildanalyse & Dokumentenerkennung</strong></p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Zweck:</strong> Automatische Erkennung von Führerscheinen, Fahrzeugdokumenten, 
                    Rechnungen (OCR - Optical Character Recognition)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Datenschutz:</strong> Hochgeladene Dokumente werden nur temporär verarbeitet 
                    und nach Extraktion der relevanten Informationen gelöscht.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 mt-6">Ihre Rechte im Umgang mit KI</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>Recht auf Information:</strong> Sie haben jederzeit das Recht zu erfahren, 
                    ob eine Entscheidung durch ein KI-System getroffen wurde.
                  </li>
                  <li>
                    <strong>Recht auf menschliche Intervention:</strong> Bei wichtigen Entscheidungen 
                    können Sie die Überprüfung durch einen Menschen verlangen.
                  </li>
                  <li>
                    <strong>Widerspruchsrecht:</strong> Sie können der automatisierten Verarbeitung 
                    Ihrer Daten widersprechen, soweit dies technisch möglich ist.
                  </li>
                  <li>
                    <strong>Erklärungsrecht:</strong> Sie können eine verständliche Erklärung verlangen, 
                    wie eine KI-gestützte Entscheidung zustande gekommen ist.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 mt-6">Datenschutz & KI</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>Training:</strong> Ihre Eingaben werden NICHT zum Training der KI-Modelle verwendet. 
                  Die eingesetzten Modelle sind vortrainiert und werden extern gehostet.
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>Datenspeicherung:</strong> Chat-Verläufe werden nur für die Dauer der Session 
                  gespeichert und nach 24 Stunden automatisch gelöscht, sofern Sie keine Speicherung 
                  wünschen.
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  <strong>Verschlüsselung:</strong> Alle Daten werden während der Übertragung und 
                  Verarbeitung mit TLS 1.3 verschlüsselt.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>EU-Hosting:</strong> Alle KI-Verarbeitungen erfolgen auf Servern innerhalb 
                  der EU (Google Cloud Platform, Frankfurt/Deutschland).
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 mt-6">Qualitätssicherung & Fehlerkorrektur</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  KI-Systeme können Fehler machen oder ungenaue Antworten liefern. Wir arbeiten 
                  kontinuierlich an der Verbesserung der Systeme und nehmen Ihre Hinweise ernst.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Feedback:</strong> Bei fehlerhaften KI-Antworten oder unerwünschtem Verhalten 
                  können Sie uns jederzeit kontaktieren: support@{companyName.toLowerCase().replace(/\s+/g, '-')}.de
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 mt-6">Rechtliche Grundlagen</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Der Einsatz von KI erfolgt auf Grundlage von:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>EU AI Act (Artificial Intelligence Act) - Art. 52 (Transparenzpflichten)</li>
                  <li>DSGVO Art. 13, 14 (Informationspflichten)</li>
                  <li>DSGVO Art. 22 (Automatisierte Entscheidungen)</li>
                  <li>TMG § 13 (Nutzungsdaten)</li>
                </ul>
              </section>

              <p className="text-xs text-muted-foreground mt-8 pt-4 border-t">
                © {currentYear} {companyName} | KI-Transparenzerklärung gemäß AI Act Art. 52<br />
                Stand: {currentDate}
              </p>
            </div>
          ),
        };

      case 'cookie-policy':
        return {
          title: 'Cookie-Policy',
          content: (
            <div className="space-y-6 text-foreground">
              <section>
                <h3 className="font-bold text-lg mb-3">Was sind Cookies?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden, wenn Sie 
                  eine Website besuchen. Sie ermöglichen es, Ihre Präferenzen zu speichern, die Website-Nutzung 
                  zu analysieren und Ihnen ein besseres Nutzererlebnis zu bieten.
                </p>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 mt-6">Arten von Cookies auf dieser Website</h3>
                
                <div className="bg-muted/30 p-4 rounded-lg mb-3">
                  <p className="text-sm mb-2"><strong>1. Notwendige Cookies (Technisch erforderlich)</strong></p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Zweck:</strong> Diese Cookies sind für die Grundfunktionen der Website unerlässlich 
                    (z.B. Login-Session, Warenkorb, Sicherheit).
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Speicherdauer:</strong> Session oder bis zu 30 Tage
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Widerspruch:</strong> Nicht möglich, da technisch erforderlich
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg mb-3">
                  <p className="text-sm mb-2"><strong>2. Funktionale Cookies</strong></p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Zweck:</strong> Speicherung Ihrer Einstellungen (Sprache, Währung, 
                    Dark Mode, Sidebar-Präferenzen)
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) oder 
                    lit. f DSGVO (berechtigtes Interesse)
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Speicherdauer:</strong> Bis zu 12 Monate
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Widerspruch:</strong> Über Cookie-Einstellungen jederzeit möglich
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg mb-3">
                  <p className="text-sm mb-2"><strong>3. Analytische Cookies</strong></p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Zweck:</strong> Erfassung anonymisierter Nutzungsdaten zur Verbesserung 
                    der Website (Seitenaufrufe, Verweildauer, Klickpfade)
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Anbieter:</strong> Plausible Analytics (DSGVO-konform, keine IP-Speicherung, 
                    EU-Hosting)
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Speicherdauer:</strong> Bis zu 24 Monate
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Widerspruch:</strong> Über Cookie-Einstellungen oder Browser-Plugin
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm mb-2"><strong>4. Marketing-Cookies</strong></p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Status:</strong> Werden auf dieser Website NICHT eingesetzt
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Es erfolgt kein Tracking durch Drittanbieter wie Google Ads, Facebook Pixel, etc.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 mt-6">Ihre Cookie-Einstellungen verwalten</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Sie können Ihre Cookie-Präferenzen jederzeit über den Cookie-Banner oder in Ihren 
                  Browser-Einstellungen ändern. Beachten Sie, dass das Deaktivieren bestimmter Cookies 
                  die Funktionalität der Website beeinträchtigen kann.
                </p>
                
                <p className="text-sm mb-2"><strong>Browser-Einstellungen:</strong></p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mb-3">
                  <li><strong>Chrome:</strong> Einstellungen → Datenschutz und Sicherheit → Cookies</li>
                  <li><strong>Firefox:</strong> Einstellungen → Datenschutz & Sicherheit → Cookies</li>
                  <li><strong>Safari:</strong> Einstellungen → Datenschutz → Cookies blockieren</li>
                  <li><strong>Edge:</strong> Einstellungen → Cookies und Websiteberechtigungen</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 mt-6">Verwendete Cookies im Detail</h3>
                
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-2">Cookie-Name</th>
                        <th className="text-left py-2">Zweck</th>
                        <th className="text-left py-2">Dauer</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-2"><code>session_id</code></td>
                        <td className="py-2">Login-Session</td>
                        <td className="py-2">Session</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2"><code>auth_token</code></td>
                        <td className="py-2">Authentifizierung</td>
                        <td className="py-2">7 Tage</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2"><code>theme</code></td>
                        <td className="py-2">Dark/Light Mode</td>
                        <td className="py-2">365 Tage</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2"><code>sidebar_state</code></td>
                        <td className="py-2">Sidebar erweitert/kollabiert</td>
                        <td className="py-2">30 Tage</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2"><code>cookie_consent</code></td>
                        <td className="py-2">Cookie-Einwilligung</td>
                        <td className="py-2">365 Tage</td>
                      </tr>
                      <tr>
                        <td className="py-2"><code>_plausible</code></td>
                        <td className="py-2">Anonyme Nutzungsstatistik</td>
                        <td className="py-2">24 Monate</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 mt-6">LocalStorage & SessionStorage</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Zusätzlich zu Cookies verwenden wir LocalStorage und SessionStorage zur Speicherung 
                  von Daten direkt in Ihrem Browser. Diese Daten werden NICHT an unsere Server übertragen.
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Gespeicherte Daten:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Formular-Zwischenspeicherungen (zum Schutz vor Datenverlust)</li>
                  <li>UI-Zustand (offene Tabs, Filter-Einstellungen)</li>
                  <li>Sidebar-Präferenzen</li>
                  <li>Temporäre Chat-Verläufe (werden nicht synchronisiert)</li>
                </ul>
              </section>

              <section>
                <h3 className="font-bold text-lg mb-3 mt-6">Kontakt & Widerrufsrecht</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Sollten Sie Fragen zu unserer Cookie-Nutzung haben oder Ihre Einwilligung widerrufen 
                  möchten, kontaktieren Sie uns bitte:
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>E-Mail:</strong> datenschutz@{companyName.toLowerCase().replace(/\s+/g, '-')}.de
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Widerruf:</strong> Ihre Einwilligung können Sie jederzeit mit Wirkung für die 
                  Zukunft widerrufen, indem Sie die Cookie-Einstellungen ändern oder alle Cookies löschen.
                </p>
              </section>

              <p className="text-xs text-muted-foreground mt-8 pt-4 border-t">
                © {currentYear} {companyName} | Cookie-Policy gemäß DSGVO & ePrivacy-Richtlinie<br />
                Stand: {currentDate}
              </p>
            </div>
          ),
        };
    }
  };

  const { title, content } = getContent();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle 
            className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2"
          >
            <span className="w-1 h-8 bg-primary rounded-full" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(85vh-8rem)] pr-4">
          <div className="py-4">
            {content}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
