/* ==================================================================================
   DOKUMENTATIONS-INHALTE - Strukturierte Hilfe-Texte
   ==================================================================================
   Für DocumentationModal.tsx
   ================================================================================== */

export interface DocTopic {
  id: string;
  title: string;
  category: string;
  content: string;
}

export const documentationTopics: DocTopic[] = [
  {
    id: 'quickstart',
    title: 'Schnellstart-Guide',
    category: 'Erste Schritte',
    content: `
      <h2>Willkommen bei MyDispatch!</h2>
      <p>Dieser Guide hilft Ihnen, in 5 Minuten mit MyDispatch zu starten.</p>
      
      <h3>1. Dashboard verstehen</h3>
      <p>Nach dem Login sehen Sie Ihr Dashboard mit:</p>
      <ul>
        <li><strong>KPI-Karten:</strong> Aufträge, Fahrer, Fahrzeuge, Umsatz</li>
        <li><strong>Schnellaktionen:</strong> Neuer Auftrag, Schichtzettel, Nachrichten</li>
        <li><strong>Aktivitäts-Feed:</strong> Letzte Ereignisse</li>
      </ul>
      
      <h3>2. Ersten Auftrag erstellen</h3>
      <p>Klicken Sie auf "Auftrag erstellen" oder navigieren Sie zu <strong>Disposition → Aufträge</strong>.</p>
      <ol>
        <li>Wählen Sie einen Kunden (oder legen Sie einen neuen an)</li>
        <li>Geben Sie Abholdatum und -zeit ein</li>
        <li>Tragen Sie Abholort und Zielort ein</li>
        <li>Wählen Sie Fahrzeugklasse und Passagiere</li>
        <li>Speichern Sie den Auftrag</li>
      </ol>
      
      <h3>3. Fahrer und Fahrzeuge verwalten</h3>
      <p>Unter <strong>Verwaltung</strong> finden Sie:</p>
      <ul>
        <li><strong>Fahrer:</strong> Anlegen, Schichten planen, Dokumente verwalten</li>
        <li><strong>Fahrzeuge:</strong> Kennzeichen, Versicherungen, Wartungen</li>
        <li><strong>Kunden:</strong> Stammdaten, Portal-Zugang, Kreditlimits</li>
      </ul>
      
      <h3>4. Hilfe & Support</h3>
      <p>Bei Fragen klicken Sie auf den <strong>AI-Support-Button</strong> (unten rechts) oder kontaktieren Sie uns:</p>
      <ul>
        <li><strong>E-Mail:</strong> support@my-dispatch.de</li>
        <li><strong>Telefon:</strong> Mo-Fr 9-17 Uhr</li>
      </ul>
    `
  },
  {
    id: 'auftraege',
    title: 'Aufträge erstellen und verwalten',
    category: 'Disposition',
    content: `
      <h2>Auftragsmanagement</h2>
      <p>Alles zur Erstellung, Bearbeitung und Verwaltung von Aufträgen.</p>
      
      <h3>Neuen Auftrag erstellen</h3>
      <ol>
        <li><strong>Kunde auswählen:</strong> Wählen Sie einen bestehenden Kunden oder legen Sie einen neuen an (Button "Neu")</li>
        <li><strong>Abholdatum & -zeit:</strong> Pflichtfelder! Rückwirkende Buchungen sind nicht erlaubt (PBefG)</li>
        <li><strong>Adressen:</strong> Nutzen Sie die Google Places Autocomplete für schnelle Eingabe</li>
        <li><strong>Fahrzeugklasse:</strong> Wählen Sie die passende Klasse (Economy bis Van/SUV)</li>
        <li><strong>Passagiere & Gepäck:</strong> 1-8 Personen/Gepäckstücke</li>
        <li><strong>Flughafen/Bahnhof:</strong> Aktivieren Sie spezielle Felder für Abhol-Services</li>
      </ol>
      
      <h3>Auftrags-Status</h3>
      <ul>
        <li><strong>Ausstehend (Gelb):</strong> Auftrag wartet auf Bestätigung</li>
        <li><strong>Bestätigt (Grün):</strong> Auftrag ist bestätigt</li>
        <li><strong>In Bearbeitung (Grün):</strong> Fahrer ist unterwegs</li>
        <li><strong>Abgeschlossen (Grün):</strong> Fahrt ist beendet</li>
        <li><strong>Storniert (Rot):</strong> Auftrag wurde abgesagt</li>
      </ul>
      
      <h3>Partner-Aufträge</h3>
      <p>Sie können Aufträge an Partner weitergeben (Business-Tarif erforderlich):</p>
      <ol>
        <li>Klicken Sie auf "An Partner weitergeben"</li>
        <li>Wählen Sie einen Partner aus Ihrem Netzwerk</li>
        <li>Die Provision wird automatisch berechnet</li>
      </ol>
      
      <h3>Zahlungsarten</h3>
      <p><strong>WICHTIG (PBefG):</strong> Barzahlung ist nur für <em>manuell angelegte</em> Kunden erlaubt!</p>
      <ul>
        <li><strong>Bar:</strong> Nur für manuell angelegte Kunden</li>
        <li><strong>Kreditkarte:</strong> Für alle Kunden</li>
        <li><strong>EC-Karte:</strong> Für alle Kunden</li>
        <li><strong>Rechnung:</strong> Für alle Kunden (Standard)</li>
      </ul>
    `
  },
  {
    id: 'fahrer',
    title: 'Fahrer-Verwaltung',
    category: 'Verwaltung',
    content: `
      <h2>Fahrer-Management</h2>
      <p>Verwalten Sie Ihre Fahrer, Dokumente und Schichten.</p>
      
      <h3>Neuen Fahrer anlegen</h3>
      <ol>
        <li><strong>Persönliche Daten:</strong> Anrede, Titel, Vor-/Nachname, Kontakt</li>
        <li><strong>Adresse:</strong> Nutzen Sie Google Places für schnelle Eingabe</li>
        <li><strong>Führerschein:</strong> Führerscheinnummer, Ablaufdatum, Klassen</li>
        <li><strong>Dokumente:</strong> P-Schein, Führerschein hochladen</li>
      </ol>
      
      <h3>Führerscheinklassen</h3>
      <p>Wählen Sie die relevanten Klassen für Ihren Fahrer:</p>
      <ul>
        <li><strong>B:</strong> PKW bis 3,5t, max. 8 Passagiere</li>
        <li><strong>BE:</strong> PKW mit Anhänger</li>
        <li><strong>D1:</strong> Kleinbusse bis 16 Passagiere</li>
        <li><strong>D:</strong> Busse über 16 Passagiere</li>
        <li><strong>P-Schein:</strong> Personenbeförderungsschein (Pflicht für Taxi/Mietwagen)</li>
      </ul>
      
      <h3>Schicht-Status</h3>
      <ul>
        <li><strong>Verfügbar (Grün):</strong> Fahrer ist bereit für Aufträge</li>
        <li><strong>Im Einsatz (Grün):</strong> Fahrer ist aktuell unterwegs</li>
        <li><strong>Pause (Gelb):</strong> Fahrer ist in der Pause</li>
        <li><strong>Offline (Rot):</strong> Fahrer ist nicht verfügbar</li>
      </ul>
      
      <h3>GPS-Tracking</h3>
      <p>Business-Tarif: Fahrer können GPS-Tracking aktivieren für Live-Standort-Updates.</p>
      <p><strong>DSGVO-Hinweis:</strong> Fahrer müssen explizit zustimmen!</p>
    `
  },
  {
    id: 'fahrzeuge',
    title: 'Fahrzeug-Verwaltung',
    category: 'Verwaltung',
    content: `
      <h2>Fahrzeugverwaltung</h2>
      <p>Verwalten Sie Ihre Flotte mit allen relevanten Daten.</p>
      
      <h3>Neues Fahrzeug anlegen</h3>
      <ol>
        <li><strong>Kennzeichen:</strong> Deutsches Format (z.B. M-YD 1234)</li>
        <li><strong>Konzessionsnummer:</strong> Pflichtfeld! (PBefG)</li>
        <li><strong>Marke & Modell:</strong> Wählen Sie aus über 100 Marken</li>
        <li><strong>Fahrzeugklasse:</strong> Economy, Business, First Class, Van/SUV</li>
      </ol>
      
      <h3>Versicherungen</h3>
      <p>Erfassen Sie alle Versicherungsdaten für vollständige Dokumentation:</p>
      
      <h4>Haftpflicht (Pflicht)</h4>
      <ul>
        <li>SF-Klasse (0-35)</li>
        <li>Zahlungsweise (Monatlich, Vierteljährlich, Halbjährlich, Jährlich)</li>
        <li>Beitrag in EUR</li>
      </ul>
      
      <h4>Teilkasko (Optional)</h4>
      <ul>
        <li>Zahlungsweise</li>
        <li>Beitrag in EUR</li>
        <li>Selbstbeteiligung (Ohne, 150€, 300€, 500€, 1000€, 2500€)</li>
      </ul>
      
      <h4>Vollkasko (Optional)</h4>
      <ul>
        <li>SF-Klasse (0-35)</li>
        <li>Zahlungsweise</li>
        <li>Beitrag in EUR</li>
        <li>Selbstbeteiligung (Ohne, 150€, 300€, 500€, 1000€, 2500€)</li>
      </ul>
      
      <h3>Wartungen & Dokumente</h3>
      <p>Laden Sie wichtige Dokumente hoch:</p>
      <ul>
        <li>Fahrzeugschein</li>
        <li>TÜV-Bericht</li>
        <li>Versicherungsnachweis</li>
        <li>Konzessionsurkunde</li>
      </ul>
      <p><strong>Automatische Erinnerungen:</strong> Sie werden 30 Tage vor Ablauf benachrichtigt!</p>
    `
  },
  {
    id: 'partner',
    title: 'Partner-Netzwerk',
    category: 'Business-Features',
    content: `
      <h2>Partner-Netzwerk (Business-Tarif)</h2>
      <p>Arbeiten Sie mit anderen Unternehmen zusammen und teilen Sie Aufträge.</p>
      
      <h3>Partner hinzufügen</h3>
      <ol>
        <li>Navigieren Sie zu <strong>Verwaltung → Partner</strong></li>
        <li>Klicken Sie auf "Partner hinzufügen"</li>
        <li>Geben Sie Firmendaten ein (Name, Kontakt, Provision)</li>
        <li>Senden Sie eine Partneranfrage</li>
      </ol>
      
      <h3>Partner-Anfragen</h3>
      <p>Wenn Sie eine Anfrage erhalten:</p>
      <ol>
        <li>Sie sehen ein <strong>Badge</strong> im Partner-Menü</li>
        <li>Prüfen Sie die Anfrage-Details</li>
        <li>Akzeptieren oder ablehnen Sie die Anfrage</li>
        <li>Nach Akzeptanz können Sie Aufträge teilen</li>
      </ol>
      
      <h3>Aufträge an Partner weitergeben</h3>
      <ol>
        <li>Öffnen Sie einen Auftrag in der Liste</li>
        <li>Klicken Sie auf "An Partner weitergeben"</li>
        <li>Wählen Sie einen Partner</li>
        <li>Die Provision wird automatisch berechnet</li>
      </ol>
      
      <h3>Provisions-Berechnung</h3>
      <p>Die Provision wird automatisch berechnet basierend auf:</p>
      <ul>
        <li><strong>Vereinbarter Prozentsatz:</strong> Bei Partner-Erstellung festgelegt</li>
        <li><strong>Manuelle Anpassung:</strong> Optional möglich</li>
        <li><strong>Netto-Betrag:</strong> Provision auf Netto-Preis</li>
      </ul>
      
      <h3>Ressourcen teilen</h3>
      <p>Sie können mit Partnern teilen:</p>
      <ul>
        <li><strong>Fahrer:</strong> Verfügbare Fahrer für Partner-Aufträge</li>
        <li><strong>Fahrzeuge:</strong> Fahrzeuge für Partner-Einsätze</li>
      </ul>
    `
  },
  {
    id: 'schichtplanung',
    title: 'Schichtplanung',
    category: 'Betrieb',
    content: `
      <h2>Schichtzettel & Planung</h2>
      <p>Planen Sie Schichten, erfassen Sie Einnahmen und verwalten Sie Arbeitszeiten.</p>
      
      <h3>Neue Schicht erstellen</h3>
      <ol>
        <li>Navigieren Sie zu <strong>Betrieb → Schichtzettel</strong></li>
        <li>Klicken Sie auf "Schicht planen"</li>
        <li>Wählen Sie Datum, Fahrer und Fahrzeug</li>
        <li>Tragen Sie Schichtzeiten ein (Start, Ende, Pausen)</li>
        <li>Speichern Sie die Schicht</li>
      </ol>
      
      <h3>Schicht-Erfassung (durch Fahrer)</h3>
      <p>Fahrer können ihre Schichten selbst erfassen:</p>
      <ul>
        <li><strong>KM-Stand:</strong> Start und Ende</li>
        <li><strong>Einnahmen:</strong> Bar, Karte, Rechnung</li>
        <li><strong>Konzessionsnummer:</strong> Wird automatisch aus Fahrzeugdaten übernommen</li>
      </ul>
      
      <h3>Schicht-Freigabe</h3>
      <p>Zwei-Stufen-System:</p>
      <ol>
        <li><strong>Fahrer bestätigt:</strong> Fahrer gibt Schicht frei (innerhalb 24h)</li>
        <li><strong>Unternehmen genehmigt:</strong> Sie prüfen und genehmigen die Schicht</li>
      </ol>
      <p><strong>Gesperrte Schichten:</strong> Nach 10 Tagen automatisch gesperrt (keine Änderungen mehr möglich)</p>
      
      <h3>Abrechnungen</h3>
      <p>Nutzen Sie Schichtzettel für:</p>
      <ul>
        <li>Provisionsabrechnungen</li>
        <li>Umsatzübersichten</li>
        <li>Steuerliche Dokumentation</li>
      </ul>
    `
  },
  {
    id: 'rechnungen',
    title: 'Rechnungsstellung',
    category: 'Finanzen',
    content: `
      <h2>Angebote & Rechnungen</h2>
      <p>Erstellen Sie professionelle Angebote und Rechnungen in Sekunden.</p>
      
      <h3>Angebot erstellen</h3>
      <ol>
        <li>Navigieren Sie zu <strong>Disposition → Angebote</strong></li>
        <li>Alle Felder wie bei Aufträgen</li>
        <li>Zusätzlich: Gültigkeitsdatum (Standard: 30 Tage)</li>
        <li>Status: Offen, Angenommen, Abgelehnt</li>
      </ol>
      
      <h3>Angebot in Auftrag umwandeln</h3>
      <p>Wenn ein Kunde ein Angebot annimmt:</p>
      <ol>
        <li>Öffnen Sie das Angebot</li>
        <li>Klicken Sie auf "Annehmen"</li>
        <li>Das Angebot wird automatisch in einen Auftrag umgewandelt</li>
      </ol>
      
      <h3>Rechnungen</h3>
      <p>Rechnungen werden automatisch aus Aufträgen generiert:</p>
      <ul>
        <li><strong>Status:</strong> Bezahlt, Ausstehend, Überfällig, Storniert</li>
        <li><strong>Zahlungsziel:</strong> Standard 14 Tage</li>
        <li><strong>Mahnungen:</strong> Automatische Erinnerungen</li>
      </ul>
      
      <h3>MwSt.-Behandlung</h3>
      <ul>
        <li><strong>19% MwSt.:</strong> Standard</li>
        <li><strong>7% MwSt.:</strong> Ermäßigt (selten)</li>
        <li><strong>0% MwSt.:</strong> Kleinunternehmer (§ 19 UStG)</li>
      </ul>
      
      <h3>PDF-Export</h3>
      <p>Laden Sie Rechnungen als PDF herunter:</p>
      <ol>
        <li>Klicken Sie auf "PDF herunterladen"</li>
        <li>Wählen Sie, welche Informationen enthalten sein sollen</li>
        <li>PDF wird mit Ihrem Unternehmens-Logo generiert</li>
      </ol>
    `
  },
  {
    id: 'kommunikation',
    title: 'Kommunikationssystem',
    category: 'Betrieb',
    content: `
      <h2>Team-Kommunikation</h2>
      <p>WhatsApp-ähnliches System für interne Kommunikation.</p>
      
      <h3>Chat</h3>
      <ul>
        <li><strong>1:1 Chats:</strong> Direkte Nachrichten an Fahrer/Kollegen</li>
        <li><strong>Gruppenchats:</strong> Team-Kommunikation</li>
        <li><strong>Datei-Upload:</strong> Bilder, PDFs versenden</li>
        <li><strong>Echtzeit:</strong> Nachrichten sofort zugestellt</li>
      </ul>
      
      <h3>Audio/Video-Calls</h3>
      <p>Starten Sie Audio- oder Video-Anrufe direkt aus dem Chat:</p>
      <ol>
        <li>Öffnen Sie eine Konversation</li>
        <li>Klicken Sie auf Telefon- oder Video-Symbol</li>
        <li>Der Anruf wird sofort gestartet</li>
      </ol>
      
      <h3>DSGVO-Hinweis</h3>
      <p><strong>Wichtig:</strong> Sie können nur mit Personen aus Ihrem Unternehmen kommunizieren (company_id Isolation).</p>
    `
  },
  {
    id: 'statistiken',
    title: 'Statistiken & Reporting',
    category: 'Business-Features',
    content: `
      <h2>Live-Statistiken (Business-Tarif)</h2>
      <p>Echtzeit-Dashboards mit aussagekräftigen KPIs.</p>
      
      <h3>Verfügbare Metriken</h3>
      <ul>
        <li><strong>Umsatz:</strong> Heute, diese Woche, dieser Monat</li>
        <li><strong>Aufträge:</strong> Anzahl und Entwicklung</li>
        <li><strong>Auslastung:</strong> Fahrer und Fahrzeuge</li>
        <li><strong>Partner-Provisionen:</strong> Übersicht und Trends</li>
      </ul>
      
      <h3>Kostenstellen</h3>
      <p>Ordnen Sie Ausgaben Kostenstellen zu:</p>
      <ol>
        <li>Legen Sie Kostenstellen an (z.B. "Treibstoff", "Wartung")</li>
        <li>Erfassen Sie Ausgaben mit Kategorie</li>
        <li>Exportieren Sie Berichte für Buchhaltung</li>
      </ol>
      
      <h3>Live-Daten</h3>
      <p>Business-Tarif bietet zusätzlich:</p>
      <ul>
        <li><strong>Live-Map:</strong> Fahrzeug-Positionen in Echtzeit</li>
        <li><strong>Wetter:</strong> Aktuelle Wetterlage am Standort</li>
        <li><strong>Verkehr:</strong> Echtzeit-Verkehrsinformationen</li>
      </ul>
    `
  },
  {
    id: 'einstellungen',
    title: 'Einstellungen & Konfiguration',
    category: 'System',
    content: `
      <h2>System-Einstellungen</h2>
      <p>Passen Sie MyDispatch an Ihre Bedürfnisse an.</p>
      
      <h3>Unternehmensdaten</h3>
      <p>Unter <strong>System → Unternehmen</strong>:</p>
      <ul>
        <li><strong>Logo:</strong> Laden Sie Ihr Unternehmens-Logo hoch</li>
        <li><strong>Farben:</strong> Wählen Sie Ihre CI-Farbe</li>
        <li><strong>Kontaktdaten:</strong> Adresse, Telefon, E-Mail</li>
        <li><strong>Geschäftszeiten:</strong> Öffnungszeiten pflegen</li>
      </ul>
      
      <h3>Benachrichtigungen</h3>
      <p>Steuern Sie, wann Sie benachrichtigt werden:</p>
      <ul>
        <li><strong>E-Mail:</strong> Neue Buchungen, Nachrichten</li>
        <li><strong>SMS:</strong> Dringende Ereignisse (Business+)</li>
        <li><strong>Push:</strong> Mobile Benachrichtigungen</li>
      </ul>
      
      <h3>Landingpage-Konfigurator (Business+)</h3>
      <p>Erstellen Sie Ihre eigene Kunden-Landingpage:</p>
      <ol>
        <li>Logo und Farbe anpassen</li>
        <li>Texte individualisieren</li>
        <li>Buchungs-Widget konfigurieren</li>
        <li>Live-Vorschau nutzen</li>
      </ol>
      
      <h3>API-Zugang (Business+)</h3>
      <p>Integrieren Sie MyDispatch in Ihre bestehenden Systeme via REST-API.</p>
    `
  },
  {
    id: 'rechtliches',
    title: 'Rechtliche Grundlagen',
    category: 'Compliance',
    content: `
      <h2>Rechtliche Compliance</h2>
      <p>MyDispatch erfüllt alle gesetzlichen Anforderungen für Taxiunternehmen.</p>
      
      <h3>PBefG (Personenbeförderungsgesetz)</h3>
      <ul>
        <li><strong>§ 13:</strong> Konzessionspflicht – Jedes Fahrzeug benötigt eine Konzession</li>
        <li><strong>§ 21:</strong> Betriebspflicht – Beförderungsdaten müssen erfasst werden</li>
        <li><strong>§ 22:</strong> Beförderungspflicht – Aufträge dürfen nicht willkürlich abgelehnt werden</li>
        <li><strong>§ 51:</strong> Entgelte – Tarife müssen eingehalten werden</li>
      </ul>
      
      <h3>DSGVO (Datenschutz-Grundverordnung)</h3>
      <p>MyDispatch ist vollständig DSGVO-konform:</p>
      <ul>
        <li><strong>Datenminimierung:</strong> Nur notwendige Daten werden erfasst</li>
        <li><strong>Zweckbindung:</strong> Daten nur für Betriebszwecke</li>
        <li><strong>Löschrechte:</strong> Kunden können Löschung verlangen (nach Aufbewahrungsfrist)</li>
        <li><strong>Auskunftsrechte:</strong> Kunden können ihre Daten einsehen</li>
      </ul>
      
      <h3>Aufbewahrungsfristen</h3>
      <ul>
        <li><strong>Beförderungsdaten:</strong> 30 Tage (PBefG § 21)</li>
        <li><strong>Rechnungen:</strong> 10 Jahre (§ 147 AO)</li>
        <li><strong>Schichtzettel:</strong> 6 Jahre (HGB § 257)</li>
      </ul>
      
      <h3>KI-Transparenz (EU AI Act 2024/1689)</h3>
      <p>Unser AI-System ist hochrisikofrei (Art. 6):</p>
      <ul>
        <li><strong>Zweck:</strong> Support, Analyse, Routenplanung</li>
        <li><strong>Modell:</strong> MyDispatch AI (Google Gemini 2.5 Flash)</li>
        <li><strong>Datenschutz:</strong> Anonymisierte Verarbeitung</li>
      </ul>
    `
  },
  {
    id: 'troubleshooting',
    title: 'Fehlerbehebung',
    category: 'Support',
    content: `
      <h2>Häufige Probleme & Lösungen</h2>
      
      <h3>Ich kann keinen Auftrag erstellen</h3>
      <p><strong>Lösung:</strong></p>
      <ul>
        <li>Prüfen Sie, ob Sie einen Kunden ausgewählt haben</li>
        <li>Stellen Sie sicher, dass Datum und Uhrzeit in der Zukunft liegen</li>
        <li>Füllen Sie alle Pflichtfelder aus (mit * markiert)</li>
      </ul>
      
      <h3>Barzahlung nicht verfügbar</h3>
      <p><strong>Grund:</strong> PBefG erlaubt Barzahlung nur für manuell angelegte Kunden.</p>
      <p><strong>Lösung:</strong> Legen Sie den Kunden manuell an (nicht über Portal-Registrierung).</p>
      
      <h3>GPS-Tracking funktioniert nicht</h3>
      <p><strong>Lösungen:</strong></p>
      <ol>
        <li>Prüfen Sie, ob der Fahrer GPS-Tracking aktiviert hat</li>
        <li>Stellen Sie sicher, dass eine aktive Schicht läuft</li>
        <li>Erlauben Sie Standort-Zugriff im Browser</li>
        <li>Business-Tarif erforderlich für Live-Map!</li>
      </ol>
      
      <h3>Landingpage zeigt kein Buchungs-Widget</h3>
      <p><strong>Grund:</strong> Widget ist nur im Business-Tarif verfügbar.</p>
      <p><strong>Lösung:</strong> Upgraden Sie auf Business oder Enterprise.</p>
      
      <h3>Partner-Anfragen nicht sichtbar</h3>
      <p><strong>Lösungen:</strong></p>
      <ul>
        <li>Prüfen Sie, ob Sie Business-Tarif haben</li>
        <li>Schauen Sie im Badge (rote Zahl) neben "Partner" im Menü</li>
        <li>Navigieren Sie zu Partner-Seite und prüfen Sie "Anfragen"-Tab</li>
      </ul>
      
      <h3>Dokumente laden nicht</h3>
      <p><strong>Lösungen:</strong></p>
      <ul>
        <li>Prüfen Sie Ihre Internetverbindung</li>
        <li>Dateigröße max. 10 MB</li>
        <li>Erlaubte Formate: PDF, JPG, PNG, DOCX</li>
      </ul>
      
      <h3>Noch Fragen?</h3>
      <p>Kontaktieren Sie unseren Support:</p>
      <ul>
        <li><strong>E-Mail:</strong> support@my-dispatch.de</li>
        <li><strong>Telefon:</strong> Mo-Fr 9-17 Uhr</li>
        <li><strong>AI-Support:</strong> 24/7 verfügbar (Button unten rechts)</li>
      </ul>
    `
  },
  {
    id: 'api',
    title: 'API-Dokumentation',
    category: 'Business-Features',
    content: `
      <h2>MyDispatch REST-API (Business-Tarif)</h2>
      <p>Integrieren Sie MyDispatch in Ihre bestehenden Systeme.</p>
      
      <h3>API-Zugang aktivieren</h3>
      <ol>
        <li>Navigieren Sie zu <strong>Einstellungen → API</strong></li>
        <li>Generieren Sie einen API-Schlüssel</li>
        <li>Speichern Sie den Schlüssel sicher (wird nur einmal angezeigt!)</li>
      </ol>
      
      <h3>Authentifizierung</h3>
      <p>Nutzen Sie Bearer-Token im Header:</p>
      <pre>Authorization: Bearer YOUR_API_KEY</pre>
      
      <h3>Wichtige Endpunkte</h3>
      <ul>
        <li><strong>GET /api/bookings:</strong> Alle Aufträge abrufen</li>
        <li><strong>POST /api/bookings:</strong> Neuen Auftrag erstellen</li>
        <li><strong>GET /api/drivers:</strong> Alle Fahrer abrufen</li>
        <li><strong>GET /api/vehicles:</strong> Alle Fahrzeuge abrufen</li>
      </ul>
      
      <h3>Webhooks</h3>
      <p>Erhalten Sie Benachrichtigungen bei Ereignissen:</p>
      <ul>
        <li><strong>booking.created:</strong> Neuer Auftrag erstellt</li>
        <li><strong>booking.status_changed:</strong> Status-Änderung</li>
        <li><strong>driver.shift_started:</strong> Schicht begonnen</li>
      </ul>
      
      <h3>Rate Limits</h3>
      <ul>
        <li><strong>Starter:</strong> 100 Requests/Minute</li>
        <li><strong>Business:</strong> 1000 Requests/Minute</li>
        <li><strong>Enterprise:</strong> Keine Begrenzung</li>
      </ul>
      
      <p><strong>Vollständige API-Dokumentation:</strong> Kontaktieren Sie support@my-dispatch.de</p>
    `
  }
];

export function getDocumentationTopic(id: string): DocTopic | undefined {
  return documentationTopics.find(topic => topic.id === id);
}

export function getDocumentationCategories(): string[] {
  return Array.from(new Set(documentationTopics.map(topic => topic.category)));
}

export function getDocumentationByCategory(category: string): DocTopic[] {
  return documentationTopics.filter(topic => topic.category === category);
}
