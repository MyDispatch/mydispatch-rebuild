/* ==================================================================================
   HELP CONTENT DEFINITIONS V18.3.24
   ==================================================================================
   Zentrale Definition aller Hilfeartikel für MyDispatch
   Kategorisiert nach Bereichen mit detaillierten Erklärungen
   ================================================================================== */

import type { HelpArticle, HelpContext } from "@/components/help/HelpSystem";

// ==================================================================================
// DASHBOARD HILFE
// ==================================================================================

const dashboardArticles: HelpArticle[] = [
  {
    id: "dashboard-overview",
    title: "Dashboard-Übersicht verstehen",
    category: "Grundlagen",
    tags: ["dashboard", "quick-start", "übersicht"],
    content: `
Das Dashboard ist Ihre Zentrale für alle wichtigen Informationen auf einen Blick.

<strong>KPI-Cards (oben)</strong>
Die vier Kennzahlen-Karten zeigen die wichtigsten Metriken:
• Aufträge heute: Anzahl aller Aufträge für den aktuellen Tag
• Verfügbare Fahrer: Fahrer mit Status "Verfügbar" oder "Pause"
• Umsatz heute: Gesamtumsatz aus abgeschlossenen Aufträgen
• Offene Rechnungen: Anzahl unbezahlter Rechnungen

<strong>Dringende Aktionen</strong>
Hier sehen Sie alle Aufgaben, die sofortige Aufmerksamkeit erfordern:
• 🔴 Kritisch: Müssen innerhalb von 24h erledigt werden
• 🟡 Wichtig: Sollten diese Woche erledigt werden
• 🔵 Info: Zur Kenntnisnahme

<strong>Live-Widgets</strong>
• Compliance-Widget: Zeigt ablaufende Dokumente (Führerscheine, TÜV, etc.)
• Fahrer-Status: Echtzeit-Übersicht über alle Fahrer
• Umsatz-Breakdown: Aufschlüsselung nach Zahlungsart

<strong>💡 Tipp:</strong> Klicken Sie auf jedes Widget für detaillierte Informationen.
    `,
    quickActions: [
      {
        label: "Neuen Auftrag erstellen",
        action: () => (window.location.href = "/auftraege?action=new"),
      },
      {
        label: "Fahrer-Status prüfen",
        action: () => (window.location.href = "/fahrer"),
      },
    ],
    relatedArticles: ["dashboard-kpis", "dashboard-actions"],
  },
  {
    id: "dashboard-kpis",
    title: "KPI-Cards erklärt",
    category: "Grundlagen",
    tags: ["dashboard", "kpi", "metriken"],
    content: `
<strong>Was bedeuten die KPI-Cards?</strong>

<strong>1. Aufträge heute</strong>
• Zählt alle Aufträge mit heutigem Abholdatum
• Status: Bestätigt, In Bearbeitung, Abgeschlossen
• ⚠️ Stornierte Aufträge werden NICHT gezählt

<strong>2. Verfügbare Fahrer</strong>
• Fahrer mit Status "Verfügbar" ODER "Pause"
• Echtzeit-Update alle 30 Sekunden
• GPS-Position wird berücksichtigt (aktive Schicht)

<strong>3. Umsatz heute</strong>
• Summe aller ABGESCHLOSSENEN Aufträge
• Nur bestätigte Zahlungen (Bar, Rechnung bezahlt)
• ⚠️ Offene Rechnungen werden NICHT gezählt

<strong>4. Offene Rechnungen</strong>
• Status "Versendet" oder "Überfällig"
• Zeigt Gesamtsumme der ausstehenden Beträge
• Klicken für Details zu jeder Rechnung

<strong>💡 Profi-Tipp:</strong>
Die Trends (↑↓) vergleichen mit gestern.
Grün = Verbesserung, Rot = Verschlechterung
    `,
  },
  {
    id: "dashboard-actions",
    title: "Dringende Aktionen richtig nutzen",
    category: "Funktionen",
    tags: ["dashboard", "aktionen", "workflow"],
    content: `
<strong>Wie funktionieren Dringende Aktionen?</strong>

Das System erkennt automatisch Aufgaben, die Ihre Aufmerksamkeit benötigen:

<strong>🔴 Kritische Aktionen (SOFORT)</strong>
• Ablaufende Dokumente (innerhalb 7 Tage)
• Überfällige Rechnungen (>30 Tage)
• Unzugewiesene Aufträge (Abholung in <4h)
• Fahrzeuge ohne gültigen TÜV

<strong>🟡 Wichtige Aktionen (DIESE WOCHE)</strong>
• Dokumente laufen in 8-14 Tagen ab
• Rechnungen überfällig (15-30 Tage)
• Wartungstermine anstehend

<strong>🔵 Informationen</strong>
• Neue Kundenanfragen
• Fahrer-Feedback
• System-Updates

<strong>So handeln Sie:</strong>
1. Klicken Sie auf die Aktion
2. Sie werden direkt zum relevanten Bereich geleitet
3. Erledigen Sie die Aufgabe
4. Die Aktion verschwindet automatisch

<strong>💡 Ziel:</strong> 0 kritische Aktionen jeden Tag!
    `,
  },
];

// ==================================================================================
// AUFTRÄGE HILFE
// ==================================================================================

const bookingsArticles: HelpArticle[] = [
  {
    id: "bookings-create",
    title: "Neuen Auftrag erstellen",
    category: "Grundlagen",
    tags: ["aufträge", "quick-start", "erstellen"],
    content: `
<strong>So erstellen Sie einen neuen Auftrag in 5 Schritten:</strong>

<strong>1. Kunde auswählen oder neu anlegen</strong>
• Suchen Sie nach vorhandenem Kunden (Name, Telefon, E-Mail)
• Oder: "Neuer Kunde" → Inline-Formular ausfüllen
• ✓ System speichert Kunde automatisch

<strong>2. Abholung & Ziel eingeben</strong>
• Nutzen Sie die intelligente Adress-Suche (HERE Maps)
• System schlägt automatisch Adressen vor
• Tipp: PLZ für schnellere Suche eingeben

<strong>3. Datum & Uhrzeit festlegen</strong>
• Abholdatum: Wann soll der Kunde abgeholt werden?
• Rückfahrt? Optional für Hin- und Rückfahrt

<strong>4. Fahrzeugklasse wählen</strong>
• Standard: Normale PKW-Fahrt
• Business: Komfort-Fahrzeuge
• First: Luxus-Fahrzeuge
• Van/Bus: Großraumtransport

<strong>5. Preis & Zahlungsart</strong>
• System berechnet Preis automatisch (GPS-Distanz)
• Oder: Manuell überschreiben
• Zahlungsart: Bar, Rechnung, Karte

<strong>💡 Profi-Tipp:</strong>
Nutzen Sie "Smart Assignment" für automatische Fahrer-Zuweisung!
    `,
    quickActions: [
      {
        label: "Jetzt Auftrag erstellen",
        action: () => (window.location.href = "/auftraege?action=new"),
      },
    ],
  },
  {
    id: "bookings-smart-assignment",
    title: "Intelligente Fahrer-Zuweisung (AI)",
    category: "KI-Features",
    tags: ["aufträge", "ai", "zuweisung", "fahrer"],
    content: `
<strong>Wie funktioniert Smart Assignment?</strong>

Das System analysiert automatisch:
• GPS-Position aller verfügbaren Fahrer
• Aktuelle Workload (Fahrten heute)
• Fahrzeug-Kompatibilität (Klasse)
• Fahrer-Rating & Erfahrung
• Verkehrslage (live)

<strong>Verwendung:</strong>
1. Erstellen Sie Auftrag (ohne Fahrer)
2. Klicken Sie "Smart Assignment"
3. System zeigt Top-3-Vorschläge
4. Wählen Sie besten Vorschlag aus
5. Fertig!

<strong>Score-Erklärung:</strong>
• 90-100: Perfekt (optimale Bedingungen)
• 70-89: Sehr gut (empfohlen)
• 50-69: Gut (akzeptabel)
• <50: Nicht ideal (manuelle Prüfung)

<strong>💡 Wichtig:</strong>
Smart Assignment berücksichtigt:
✓ ETA (Ankunftszeit beim Kunden)
✓ Fahrer-Verfügbarkeit (Schicht-Status)
✓ Pausen-Zeiten (automatisch)

<strong>⚠️ Business+ Feature</strong>
Benötigt Business-Tarif oder höher.
    `,
  },
];

// ==================================================================================
// FAHRER HILFE
// ==================================================================================

const driversArticles: HelpArticle[] = [
  {
    id: "drivers-overview",
    title: "Fahrer-Verwaltung Übersicht",
    category: "Grundlagen",
    tags: ["fahrer", "quick-start", "verwaltung"],
    content: `
<strong>Fahrer & Fahrzeuge verwalten</strong>

Die Seite ist in zwei Tabs unterteilt:

<strong>Tab 1: Fahrer</strong>
Hier verwalten Sie alle Ihre Fahrer:
• Persönliche Daten (Name, Kontakt, Adresse)
• Dokumente (Führerschein, P-Schein, Attest)
• Schicht-Status (Verfügbar, Beschäftigt, Pause)
• GPS-Tracking (Echtzeit-Position)
• Statistiken (Fahrten, Umsatz, Rating)

<strong>Tab 2: Fahrzeuge</strong>
Alle Fahrzeuge im Überblick:
• Fahrzeugdaten (Marke, Modell, Kennzeichen)
• Dokumente (TÜV, Versicherung, Zulassung)
• Wartungsplan (nächste Termine)
• Zugewiesener Fahrer

<strong>💡 Wichtig:</strong>
Das System warnt automatisch bei ablaufenden Dokumenten!
Rot = <7 Tage, Gelb = <14 Tage
    `,
    quickActions: [
      {
        label: "Neuen Fahrer anlegen",
        action: () => (window.location.href = "/fahrer?tab=fahrer&action=new"),
      },
      {
        label: "Neues Fahrzeug anlegen",
        action: () => (window.location.href = "/fahrer?tab=fahrzeuge&action=new"),
      },
    ],
  },
  {
    id: "drivers-documents",
    title: "Pflichtdokumente für Fahrer",
    category: "Compliance",
    tags: ["fahrer", "dokumente", "pbefg", "pflicht"],
    content: `
<strong>Welche Dokumente sind Pflicht?</strong>

<strong>1. Führerschein (§6 FeV)</strong>
• Klasse B: Mindestanforderung
• Gültigkeitsdauer: 15 Jahre (ab 2013)
• ⚠️ System warnt 30 Tage vorher

<strong>2. P-Schein (§48 PBefG)</strong>
• Personenbeförderungsschein PFLICHT
• Gültigkeitsdauer: 5 Jahre
• Verlängerung: Medizinisches Attest nötig
• ⚠️ Fahren ohne P-Schein = Bußgeld bis 5.000€

<strong>3. Medizinisches Attest</strong>
• Bei P-Schein-Ersterteilung
• Bei Verlängerung (alle 5 Jahre)
• Anforderung: Hausarzt oder Betriebsarzt

<strong>4. Führungszeugnis</strong>
• Erweitertes Führungszeugnis
• Bei Einstellung (nicht älter als 3 Monate)
• Aktualisierung: alle 5 Jahre empfohlen

<strong>💡 System-Funktion:</strong>
MyDispatch trackt alle Ablaufdaten automatisch und sendet:
• 30 Tage vorher: E-Mail-Erinnerung
• 14 Tage vorher: Dashboard-Warnung (Gelb)
• 7 Tage vorher: Kritische Warnung (Rot)
• 0 Tage: Fahrer-Status → "Nicht einsetzbar"
    `,
  },
];

// ==================================================================================
// EXPORT HELP CONTEXTS
// ==================================================================================

export const helpContexts: Record<string, HelpContext> = {
  dashboard: {
    page: "Dashboard",
    articles: dashboardArticles,
    shortcuts: [
      { key: "Cmd+K", description: "Globale Suche öffnen" },
      { key: "Cmd+N", description: "Neuer Auftrag" },
      { key: "Cmd+H", description: "Hilfe öffnen" },
    ],
  },
  bookings: {
    page: "Aufträge",
    articles: bookingsArticles,
    shortcuts: [
      { key: "N", description: "Neuer Auftrag" },
      { key: "F", description: "Filter öffnen" },
      { key: "S", description: "Suche fokussieren" },
    ],
  },
  drivers: {
    page: "Fahrer & Fahrzeuge",
    articles: driversArticles,
    shortcuts: [
      { key: "N", description: "Neuer Fahrer" },
      { key: "Tab", description: "Zwischen Tabs wechseln" },
    ],
  },
};
