# 📚 DOCUMENTATION PAGE SPECIFICATION V18.5.8

**Status:** 📋 Spezifikation  
**Route:** `/docs`  
**Letzte Aktualisierung:** 2025-10-24  
**Verantwortlich:** NeXify AI Development Agent  
**Klassifizierung:** Marketing (ÖFFENTLICH)

---

## 📊 EXECUTIVE SUMMARY

### Zweck
Die Documentation Page ist die zentrale Anlaufstelle für **Hilfe, Tutorials und Support** für bestehende und potenzielle Kunden.

### Zielgruppe
- Neue Nutzer (Onboarding)
- Bestehende Nutzer (Feature-Suche)
- Entscheider (Pre-Sales-Informationen)

### Kernbotschaft
> "Alles, was Sie über MyDispatch wissen müssen. Von Quick-Start bis zu erweiterten Features."

---

## 🏗️ ARCHITEKTUR-ENTSCHEIDUNGEN

### Layout
```typescript
Layout: MarketingLayout
Grid: DOCS-GRID (Sidebar + Content-Area)
Responsive: Mobile-First (Sidebar wird zu Dropdown auf Mobile)
```

### Component-Struktur
```typescript
const PageStructure = {
  Header: 'MarketingHeader',
  Layout: {
    Sidebar: 'DocsSidebar',      // Kategorie-Navigation
    Content: 'DocsContent',       // Dynamischer Content-Bereich
  },
  Components: [
    'DocsHeroSection',            // Hero + Search
    'QuickStartSection',          // 5-Minuten Quick-Start
    'CategoriesSection',          // Haupt-Kategorien (Cards)
    'PopularArticlesSection',     // Top 5 meistgelesene Artikel
    'VideoTutorialsSection',      // Video-Tutorials (optional)
    'SupportCTASection',          // "Nicht gefunden? Support kontaktieren"
  ],
  Footer: 'MarketingFooter',
};
```

---

## 📐 MOBILE-FIRST WIREFRAMES

### Mobile (375px)
```
┌─────────────────────────────────┐
│  [Logo]          [Menü ☰]       │
├─────────────────────────────────┤
│  HERO                           │
│  H1: MyDispatch Dokumentation   │
│  [Suche: "Wie starte ich..."]   │ ← h-11
├─────────────────────────────────┤
│  KATEGORIEN (Dropdown)          │
│  [▼ Kategorie auswählen]        │ ← min-h-[44px]
├─────────────────────────────────┤
│  QUICK-START                    │
│  ┌───────────────────────────┐ │
│  │ 1. Account erstellen      │ │
│  │ 2. Erstes Fahrzeug        │ │
│  │ 3. Ersten Fahrer          │ │
│  │ 4. Ersten Auftrag         │ │
│  │ 5. Fertig! 🎉            │ │
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│  HAUPT-KATEGORIEN               │
│  ┌───────────────────────────┐ │
│  │ 📋 Erste Schritte         │ │
│  │ 12 Artikel                │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ 🚗 Fuhrparkverwaltung     │ │
│  │ 8 Artikel                 │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ 📊 Statistiken & Berichte │ │
│  │ 6 Artikel                 │ │
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│  BELIEBT                        │
│  1. Wie erstelle ich Auftrag?   │
│  2. GPS-Tracking einrichten     │
│  3. Partner-Netzwerk nutzen     │
│  4. Rechnungen erstellen        │
│  5. Tarif wechseln              │
└─────────────────────────────────┘
```

### Desktop (1920px)
```
┌───────────────────────────────────────────────────┐
│  [Logo]      Features  Preise  Docs  Kontakt      │
├───────────────────────────────────────────────────┤
│  HERO (zentriert)                                 │
│  H1: MyDispatch Dokumentation                     │
│  [Suche: Durchsuchen Sie 100+ Artikel]           │
├─────────────┬─────────────────────────────────────┤
│  SIDEBAR    │  CONTENT-AREA                       │
│  ─────────  │                                     │
│  📋 Erste   │  QUICK-START                        │
│  Schritte   │  ┌────────────────────────────────┐│
│  ────────── │  │ In 5 Minuten startklar        ││
│  • Account  │  │ 1. Account erstellen          ││
│  • Fahrzeug │  │ 2. Fahrzeug hinzufügen        ││
│  • Fahrer   │  │ 3. Fahrer anlegen             ││
│  • Auftrag  │  │ 4. Ersten Auftrag erstellen   ││
│             │  │ 5. Fertig! 🎉                ││
│  🚗 Fuhrpark│  └────────────────────────────────┘│
│  ────────── │                                     │
│  • Fahrzeuge│  KATEGORIEN (3 Spalten)             │
│  • Wartung  │  ┌────────┐ ┌────────┐ ┌────────┐ │
│  • TÜV      │  │Erste   │ │Fuhrpark│ │Partner │ │
│             │  │Schritte│ │        │ │        │ │
│  💰 Finanzen│  └────────┘ └────────┘ └────────┘ │
│  ────────── │                                     │
│  • Rechnung │  BELIEBT                            │
│  • Abrechng │  [Liste mit Top 5 Artikeln]        │
│             │                                     │
└─────────────┴─────────────────────────────────────┘
```

---

## 🎨 COMPONENT-BREAKDOWN

### Neu zu erstellen
- [ ] `DocsHeroSection.tsx` (10min)
  - Search-Bar (Live-Suche)
  - Kategorie-Quick-Links

- [ ] `DocsSidebar.tsx` (15min)
  - Kategorie-Baum
  - Collapsed/Expanded States
  - Aktive Artikel highlighten
  - Mobile: Wird zu Dropdown

- [ ] `DocsContent.tsx` (20min)
  - Dynamischer Content-Renderer
  - Markdown-Support
  - Code-Syntax-Highlighting
  - Table of Contents (Rechts)

- [ ] `QuickStartSection.tsx` (10min)
  - 5-Schritte Tutorial
  - Nummerierung
  - Links zu Detail-Artikeln

- [ ] `CategoriesSection.tsx` (10min)
  - Cards für Haupt-Kategorien
  - Artikel-Anzahl
  - Icon + Titel + Beschreibung

- [ ] `PopularArticlesSection.tsx` (5min)
  - Top 5 meistgelesene
  - Link zu Artikel

- [ ] `SupportCTASection.tsx` (5min)
  - "Nicht gefunden?"
  - Link zu Kontakt

### Wiederverwendbar
- [x] `MarketingHeader`
- [x] `MarketingFooter`
- [x] `Input` (Search)
- [x] `Card`
- [x] `Accordion`
- [x] `Button`

---

## 🔒 RECHTLICHE COMPLIANCE

### DSGVO
- [x] Kein Datenschutzhinweis (keine Formulare, nur Suche)
- [x] Footer-Links vorhanden

### TMG
- [x] Impressum-Link
- [x] Datenschutz-Link

### AI Act (KRITISCH!)
- [x] **Falls KI-gestützter Chat:** KI-Kennzeichnung VERPFLICHTEND!
- [x] Icon + Text-Hinweis bei jeder KI-Antwort

```tsx
// KI-Kennzeichnung (falls Chat-Feature)
<div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
  <div className="flex items-start gap-2">
    <Bot className="h-5 w-5 text-primary shrink-0 mt-0.5" />
    <div className="text-xs text-muted-foreground">
      <strong>KI-Assistent:</strong> Diese Antworten werden von einer 
      künstlichen Intelligenz generiert. Prüfen Sie wichtige Informationen 
      bitte selbst nach oder kontaktieren Sie unseren Support.
    </div>
  </div>
</div>
```

### Compliance-Matrix
```typescript
const DocsPageCompliance = {
  DSGVO: {
    datenschutzhinweis: false,  // Keine Formulare
    footer_links: true,
  },
  AI_Act: {
    ki_kennzeichnung: true,     // Falls Chat-Feature!
  },
  TMG: {
    impressum: true,
    datenschutz: true,
  },
};
```

---

## 🔍 SEO-STRATEGIE

### Primary Keywords
- MyDispatch Dokumentation
- MyDispatch Hilfe
- MyDispatch Tutorial
- MyDispatch Anleitung

### Secondary Keywords
- Taxi Software Anleitung
- Dispositionssoftware Hilfe
- Fuhrparkverwaltung Tutorial

### Meta-Tags
```html
<title>MyDispatch Dokumentation – Hilfe & Tutorials</title>
<meta 
  name="description" 
  content="Vollständige MyDispatch Dokumentation mit Tutorials, 
           Anleitungen und Quick-Start-Guide. Von Erste Schritte 
           bis zu erweiterten Features."
/>
```

### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "MyDispatch Dokumentation",
  "description": "Hilfe und Tutorials für MyDispatch",
  "inLanguage": "de-DE"
}
```

---

## 📝 CONTENT-STRUKTUR

### Hero-Section
**H1:** "MyDispatch Dokumentation"
**P:** "Alles, was Sie über MyDispatch wissen müssen."
**Search:** "Durchsuchen Sie 100+ Hilfe-Artikel..."

### Quick-Start-Section
**H2:** "In 5 Minuten startklar"

**Schritte:**
1. **Account erstellen** - Registrierung & Tarif-Auswahl
2. **Erstes Fahrzeug hinzufügen** - Kennzeichen, TÜV, Versicherung
3. **Ersten Fahrer anlegen** - Name, P-Schein, Führerschein
4. **Ersten Auftrag erstellen** - Kunde, Abholung, Ziel
5. **Fertig!** 🎉 Sie sind startklar.

### Kategorien (Haupt)

#### 📋 Erste Schritte (12 Artikel)
- Account erstellen
- Erstes Fahrzeug hinzufügen
- Ersten Fahrer anlegen
- Ersten Auftrag erstellen
- Dashboard verstehen
- Einstellungen konfigurieren
- ...

#### 🚗 Fuhrparkverwaltung (8 Artikel)
- Fahrzeuge hinzufügen
- TÜV-Erinnerungen einrichten
- Wartungspläne erstellen
- Tankkarten verwalten
- ...

#### 👨‍✈️ Fahrer & Personal (6 Artikel)
- Fahrer anlegen
- P-Schein-Verwaltung
- Arbeitszeiten erfassen
- Urlaubsplanung
- ...

#### 📋 Auftragsverwaltung (10 Artikel)
- Auftrag erstellen
- Fahrer zuweisen
- GPS-Tracking nutzen
- Aufträge stornieren
- ...

#### 💰 Finanzen & Rechnungen (7 Artikel)
- Rechnungen erstellen
- Abrechnungen durchführen
- Umsätze analysieren
- Zahlungen verfolgen
- ...

#### 🔗 Partner-Netzwerk (5 Artikel)
- Partner hinzufügen
- Aufträge verteilen
- Provisionen verwalten
- ...

#### 📊 Statistiken & Berichte (6 Artikel)
- Dashboard-KPIs verstehen
- Berichte exportieren
- Kennzahlen analysieren
- ...

#### ⚙️ Einstellungen & Integration (8 Artikel)
- Tarif wechseln
- API-Zugang einrichten
- Webhooks konfigurieren
- White-Label aktivieren (Enterprise)
- ...

#### 🆘 Support & Troubleshooting (5 Artikel)
- Häufige Fehler beheben
- Support kontaktieren
- Feedback geben
- ...

### Beliebte Artikel (Top 5)
1. **Wie erstelle ich einen Auftrag?** (500 Aufrufe)
2. **GPS-Tracking einrichten** (450 Aufrufe)
3. **Partner-Netzwerk nutzen** (400 Aufrufe)
4. **Rechnungen erstellen** (380 Aufrufe)
5. **Tarif wechseln** (350 Aufrufe)

### Support-CTA-Section
**H2:** "Nicht gefunden, wonach Sie suchen?"
**P:** "Unser Support-Team hilft Ihnen gerne weiter."
**CTA:** "Support kontaktieren"

---

## 🤖 KI-CHAT-INTEGRATION (Optional)

### Falls KI-gestützter Hilfe-Chat implementiert wird:

**VERPFLICHTEND:** AI Act Compliance!

```tsx
<div className="fixed bottom-24 right-4 z-50">
  <Button 
    size="lg" 
    className="h-14 w-14 rounded-full shadow-lg"
    onClick={() => setChatOpen(true)}
  >
    <Bot className="h-6 w-6" />
  </Button>
</div>

{chatOpen && (
  <Card className="fixed bottom-24 right-4 w-96 h-96 shadow-xl">
    {/* KI-Kennzeichnung (VERPFLICHTEND!) */}
    <div className="bg-primary/5 border-b border-primary/20 p-3">
      <div className="flex items-start gap-2">
        <Bot className="h-5 w-5 text-primary shrink-0" />
        <div className="text-xs text-muted-foreground">
          <strong>KI-Assistent:</strong> Antworten werden von KI generiert. 
          Prüfen Sie wichtige Infos selbst nach.
        </div>
      </div>
    </div>
    
    {/* Chat-Content */}
    <div className="p-4 overflow-y-auto">
      {/* Messages */}
    </div>
  </Card>
)}
```

---

## 🎯 IMPLEMENTIERUNGS-ZEITPLAN

```yaml
DocsHeroSection:         10min
DocsSidebar:             15min
DocsContent:             20min
QuickStartSection:       10min
CategoriesSection:       10min
PopularArticles:          5min
SupportCTA:               5min
Integration & Testing:   10min
─────────────────────────────
GESAMT:                  85min
```

---

## ✅ TESTING-CHECKLISTE

### Responsive-Tests
- [ ] Mobile: Sidebar → Dropdown
- [ ] Desktop: Sidebar sichtbar
- [ ] Search funktioniert

### Accessibility-Tests
- [ ] Sidebar-Navigation per Tastatur
- [ ] Artikel-Links gut sichtbar
- [ ] Kontrast ≥ 4.5:1

### AI-Compliance-Tests (falls Chat)
- [ ] KI-Kennzeichnung bei JEDER Antwort
- [ ] Icon + Text vorhanden
- [ ] Disclaimer klar lesbar

---

## 🔗 VERWANDTE DOKUMENTATION

- **RECHTLICHE_COMPLIANCE_VORGABEN_V18.5.1.md** - AI Act Pflichten
- **MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md** - Sidebar-Patterns

---

## 📝 CHANGELOG

### V18.5.8 (2025-10-24)
- **ERSTELLT:** Documentation Page Spezifikation
- **KRITISCH:** AI Act Compliance bei KI-Chat

---

**Version:** 18.5.8  
**Status:** 📋 SPECIFICATION - BEREIT FÜR IMPLEMENTIERUNG

**END OF DOCUMENT**
