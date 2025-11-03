# MyDispatch Gesamtkonzept - Single Source of Truth

> **Version:** 1.0.0  
> **Erstellt:** 2025-10-26  
> **Status:** 🔒 PRODUCTION-LOCKED  
> **Zweck:** Zentrale Master-Dokumentation für alle Aspekte des MyDispatch-Systems

---

# I. FUNDAMENTALE SYSTEMBESCHREIBUNG

## 1.1 Was ist MyDispatch?

**Kurzprofil:**
MyDispatch ist eine cloudbasierte, DSGVO-konforme Dispositions- und Flottenmanagementsoftware für Taxi- und Mietwagenunternehmen in Deutschland und Österreich.

**Mission:**
Moderne Taxi- und Mietwagenunternehmen durch digitale Tools bei der professionellen Disposition, Fuhrpartverwaltung und Geschäftsoptimierung zu unterstützen.

**Zielgruppe:**
- **Primär:** Taxi-Unternehmen (Einzelunternehmer bis mittelständische Flotten)
- **Sekundär:** Mietwagen-Unternehmen (mit und ohne Chauffeur)
- **Tertiär:** Fuhrpark-Manager (in größeren Unternehmen)

**Charakteristika der Zielgruppe:**
- B2B-Kontext (geschäftliche Entscheidungen)
- Kennt die Branche, aber nicht zwingend IT/Software
- Wertschätzung von Transparenz, Rechtssicherheit, Zuverlässigkeit
- Pragmatisch: Will Lösungen, keine Tech-Buzzwords

**Unique Selling Propositions (USPs):**
1. Made in Germany - Deutsche Server, DSGVO-konform
2. 24/7 AI-Support - Deutscher Support per Chat & Telefon
3. Keine Setup-Gebühren - Sofort einsatzbereit
4. Skalierbar - Von 1 bis 1000+ Fahrzeuge
5. Monatlich kündbar - Keine Mindestlaufzeit

---

## 1.2 NeXify Rolle & Governance

**Name:** NeXify (Entwicklungsunternehmen)  
**Rolle:** Betreuendes Entwicklungsunternehmen für MyDispatch  
**Auftraggeber:** Pascal (Inhaber von NeXify)

**Governance-Prinzipien:**
1. **Logisches & Vorausschauendes Denken**: Systemweite Konsequenzen vor jeder Entscheidung bewerten
2. **Konsolidierung & IST-Abgleich**: Vollständige Wissenskonsolidierung vor Code-Änderungen
3. **Ultimative Fehleranalyse**: Root Cause Analysis bei allen Problemen
4. **Dokumentations-Governance**: Kontinuierliche Pflege aller Dokumentationen
5. **Eigenständige Analyse**: Keine Rückfragen bei technischen Entscheidungen (siehe NEXIFY_EIGENSTÄNDIGE_ANALYSE_VORGABE_V18.5.1.md)

**Workflow-Struktur (3-Phasen):**
- **Phase 1:** Selbstreflexion & Code-Audit
- **Phase 2:** IST-Zustand & Planung
- **Phase 3:** Implementation mit Qualitätssicherung

**Referenz:** `NEXIFY_WORKFLOW_PROMPT_V19.0.0.md`

---

## 1.3 Technischer Stack

### Frontend
| Komponente | Technologie | Version |
|------------|-------------|---------|
| **Framework** | React | 18.3.1 |
| **Build Tool** | Vite | Latest |
| **Sprache** | TypeScript | Latest |
| **Styling** | Tailwind CSS | Latest |
| **UI Library** | Shadcn/UI | Latest |
| **Icons** | Lucide React | 0.546.0 |
| **Routing** | React Router | 6.30.1 |
| **State Management** | React Query | 5.83.0 |
| **Forms** | React Hook Form | 7.61.1 |
| **Validation** | Zod | 3.25.76 |

### Backend (Lovable Cloud / Supabase)
| Komponente | Technologie |
|------------|-------------|
| **Database** | PostgreSQL (Supabase) |
| **Auth** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Edge Functions** | Supabase Edge Functions |
| **Realtime** | Supabase Realtime |

### AI & Machine Learning
| Komponente | Vorgabe | Secret |
|------------|---------|--------|
| **KI-API** | Anthropic API | ANTHROPIC_API_KEY |
| **KI-Modell** | Claude 3.5 Sonnet | - |
| **Use Cases** | AI-Support, Chatbot, Dokumenten-Analyse | - |

**ZWINGEND:** Ausschließlich Claude 3.5 Sonnet verwenden, keine anderen Modelle!

### Testing & Quality
| Komponente | Technologie |
|------------|-------------|
| **E2E Testing** | Playwright | 1.56.1 |
| **Visual Regression** | Playwright Screenshots | - |
| **Linting** | ESLint | Latest |
| **Formatting** | Prettier | 3.6.2 |

---

## 1.4 Unternehmensdaten

### MyDispatch
- **Firma:** MyDispatch GmbH (Platzhalter)
- **Land:** Deutschland
- **Server-Standort:** Frankfurt am Main
- **Rechtsform:** GmbH
- **Compliance:** DSGVO, PBefG § 51, ISO 27001

### NeXify
- **Firma:** NeXify Development Company
- **Rolle:** Entwicklungspartner & Betreuung
- **Inhaber:** Pascal

---

# II. PRODUKT & FEATURE-GOVERNANCE

## 2.1 Tarif-Struktur (AKTUELL & VOLLSTÄNDIG)

**Single Source of Truth:** `src/lib/tariff/tariff-definitions.ts`

### Tarif 1: STARTER

**Preis:**
- Monatlich: 39 €
- Jährlich: 420 € (Ersparnis: 48 €)

**Beschreibung:** Perfekt für kleine Unternehmen

**Limits:**
- Fahrer: Max. 3
- Fahrzeuge: Max. 3
- Aufträge: Unbegrenzt
- Partner: 0
- Benutzer: Max. 1

**Inkludierte Features:**
- ✅ Basisdisposition
- ✅ Auftragsverwaltung (unbegrenzt)
- ✅ Kunden-/Fahrerverwaltung
- ✅ Angebote & Rechnungen
- ✅ Digitale Fuhrparkverwaltung
- ✅ TÜV-Erinnerungen
- ✅ Schichtplanung
- ✅ Dokumentenmanagement
- ✅ Info-Landingpage
- ✅ Mobile App
- ✅ 24/7 KI-Support
- ✅ Fleet & Driver Add-On (Optional, 9€/Monat pauschal)

**NICHT Inkludierte Features:**
- ❌ Partner-Management
- ❌ Live-Traffic-Infos
- ❌ Kunden-Portal
- ❌ Buchungswidget
- ❌ Statistiken & Reports
- ❌ API-Zugang
- ❌ GPS-Echtzeit-Tracking
- ❌ Team-Chat
- ❌ Workflow-Automatisierung

**CTA:** "Tarif wählen" → Signup Flow

---

### Tarif 2: BUSINESS (BELIEBTESTE WAHL)

**Preis:**
- Monatlich: 99 €
- Jährlich: 1.068 € (Ersparnis: 120 €)

**Badge:** "Empfohlen" (Highlighted)

**Beschreibung:** Beliebt bei wachsenden Unternehmen

**Limits:**
- Fahrer: Unbegrenzt
- Fahrzeuge: Unbegrenzt
- Aufträge: Unbegrenzt
- Partner: Unbegrenzt
- Benutzer: Max. 5

**Inkludierte Features (ALLE STARTER + Folgende):**
- ✅ Unbegrenzt Fahrer/Fahrzeuge
- ✅ Partner-Management & Provisionsabrechnung
- ✅ Live-Traffic & Wetter
- ✅ Statistiken & Reports (erweitert)
- ✅ Kunden-Login & Portal
- ✅ Online-Buchungswidget
- ✅ AI-Chatbot
- ✅ API-Zugang (Basis)
- ✅ GPS-Echtzeit-Tracking
- ✅ Team-Chat
- ✅ Dokumenten-Management (erweitert)
- ✅ Schichtplanung (erweitert)
- ✅ Kostenstellen
- ✅ Massen-Operationen
- ✅ Erweiterte Reports
- ✅ E-Mail-Vorlagen
- ✅ n8n Workflow-Automatisierung
- ✅ Prioritäts-Support

**NICHT Inkludierte Features:**
- ❌ White-Label Landingpages
- ❌ Custom Integrationen
- ❌ Dedizierter Account Manager
- ❌ SLA-Garantie
- ❌ Schulungen vor Ort

**CTA:** "Tarif wählen" → Signup Flow

---

### Tarif 3: ENTERPRISE

**Preis:** Auf Anfrage (Individuell)

**Badge:** "Für Großflotten"

**Beschreibung:** Maßgeschneiderte Lösungen

**Limits:**
- Fahrer: Unbegrenzt
- Fahrzeuge: Unbegrenzt
- Aufträge: Unbegrenzt
- Partner: Unbegrenzt
- Benutzer: Unbegrenzt

**Inkludierte Features (ALLE BUSINESS + Folgende):**
- ✅ White-Label Landingpages
- ✅ Custom Integrationen
- ✅ Dedizierter Account Manager
- ✅ SLA-Garantie (99,99%)
- ✅ Schulungen vor Ort
- ✅ Unbegrenzte Benutzer
- ✅ Custom Development
- ✅ Prioritäts-Onboarding
- ✅ 24/7 Premium-Support
- ✅ Datenmigration
- ✅ API-Zugang (Erweitert, keine Limits)

**CTA:** "Kontakt aufnehmen" → Contact Flow

---

### Add-Ons

**Fleet & Driver Add-On:**
- **Preis:** 9 € / Monat (pauschal)
- **Anwendbar auf:** Nur Starter-Tarif
- **Beschreibung:** Unbegrenzte Erweiterung von Fahrzeugen/Fahrern über die ersten 3 hinaus
- **Aktivierung:** Sofort aktiv, monatlich kündbar

---

## 2.2 Feature-Gating & Zugriffsregeln (ZWINGEND)

**Implementation:** `src/lib/tariff/tariff-definitions.ts` → `hasFeatureAccess()`

### Zugriffsmatrix

| Feature/Modul | Starter | Business | Enterprise | Route |
|---------------|---------|----------|------------|-------|
| Auftragsverwaltung | ✅ | ✅ | ✅ | `/auftraege` |
| Fahrer/Fahrzeuge | ✅ (Max. 3) | ✅ (∞) | ✅ (∞) | `/fahrer`, `/fahrzeuge` |
| Kunden | ✅ | ✅ | ✅ | `/kunden` |
| Rechnungen | ✅ | ✅ | ✅ | `/rechnungen` |
| Angebote | ✅ | ✅ | ✅ | `/angebote` |
| Dokumente | ✅ (Basis) | ✅ (Erweitert) | ✅ (Premium) | `/dokumente` |
| Schichtzettel | ✅ (Basis) | ✅ (Erweitert) | ✅ (Premium) | `/schichtzettel` |
| Partner-Netzwerk | ❌ | ✅ | ✅ | `/partner` |
| Statistiken | ❌ | ✅ | ✅ | `/statistiken` |
| Team-Chat | ❌ | ✅ | ✅ | `/kommunikation` |
| Kostenstellen | ❌ | ✅ | ✅ | `/kostenstellen` |
| Kunden-Portal | ❌ | ✅ | ✅ | `/portal` |
| Landingpage-Konfigurator | ❌ (Info only) | ✅ | ✅ (White-Label) | `/landingpage` |
| API-Zugang | ❌ | ✅ (Basis) | ✅ (Erweitert) | - |
| Live-Traffic & Wetter | ❌ | ✅ | ✅ | Dashboard Widget |
| GPS-Tracking | ❌ | ✅ | ✅ | `/tracking` |

**Implementierungs-Regel:**
```typescript
// Jede geschützte Route MUSS Feature-Gating implementieren
import { hasFeatureAccess } from '@/lib/tariff/tariff-definitions';

if (!hasFeatureAccess(productId, 'partners')) {
  return <UpgradePrompt targetTariff="business" />;
}
```

---

## 2.3 Dashboard-Funktionalitäten (STATUS QUO - DÜRFEN SICH NICHT ÄNDERN)

### Master-Dashboard (`/` nach Login, `/dashboard`)

**Layout-Struktur:**
1. **Section Header** mit Live-Zeit-Anzeige
2. **KPI Grid** (4 Spalten: Aufträge, Umsatz, Fahrer, Fahrzeuge)
3. **Quick Actions Bar** (Neuer Auftrag, Schichtzettel, Team-Chat)
4. **Main Widgets Grid** (3 Spalten):
   - Urgent Actions Widget
   - Resource Status Widget
   - Revenue Breakdown Widget (Business+)
5. **Map & Sidebar Grid** (2:1 Ratio):
   - HERE Map Component (Business+)
   - Weather Widget (Business+)
   - Traffic Widget (Business+)
6. **Activity Timeline** (Full Width)
7. **Upgrade Banner** (wenn nicht Business+)

**Funktionen (MÜSSEN ERHALTEN BLEIBEN):**
- ✅ Live-Zeit-Anzeige (Echtzeit-Uhr)
- ✅ KPI-Berechnungen (Bookings, Revenue, Drivers, Vehicles)
- ✅ Realtime-Updates (Supabase Realtime)
- ✅ Urgent Actions (Ablaufende Dokumente, Überfällige Rechnungen)
- ✅ Resource Status (Verfügbare/Beschäftigte Fahrer, Fahrzeuge)
- ✅ Revenue Breakdown (Bar, Rechnung, Karte)
- ✅ Activity Timeline (Letzte 20 Aktivitäten)
- ✅ Navigation zu Detail-Seiten (onClick)
- ✅ Mobile-Ansicht mit `MobileDashboard`
- ✅ Welcome Wizard (Onboarding für neue User)

**Datei:** `src/pages/Index.tsx`

---

### Aufträge-Dashboard (`/auftraege`)

**Layout:** Single Large Card View (V22.0.0)

**Funktionen (MÜSSEN ERHALTEN BLEIBEN):**
- ✅ CRUD (Create, Read, Update, Delete) für Aufträge
- ✅ Filter (Status, Datum, Preis, Kunde)
- ✅ Sortierung (nach allen Spalten)
- ✅ Suche (Kunden-Name, Abholort, Zielort)
- ✅ Status-Updates (Bestätigt, In Bearbeitung, Abgeschlossen)
- ✅ Export (CSV, PDF)
- ✅ Massenoperationen (Multi-Select)
- ✅ Realtime-Updates (Supabase Realtime)
- ✅ Fahrer-Zuweisung
- ✅ Rechnung erstellen (aus Auftrag)
- ✅ Angebot konvertieren zu Auftrag

**Datei:** `src/pages/Auftraege.tsx`

**Design-Status:** ✅ LAYOUT-FROZEN (keine Design-Änderungen ohne Freigabe!)

---

### Fahrer & Fahrzeuge Dashboard (`/fahrer`, `/fahrzeuge`)

**Layout:** Zusammengeführt in einem Dashboard

**Funktionen Fahrer (MÜSSEN ERHALTEN BLEIBEN):**
- ✅ CRUD für Fahrer
- ✅ Führerschein-Verwaltung (Upload, Ablauf-Überwachung)
- ✅ Schichtstatus (Verfügbar, Beschäftigt, Offline)
- ✅ Profilbild-Upload
- ✅ Dokumenten-Verwaltung (TÜV, Führerschein, P-Schein)
- ✅ Statistiken (Fahrten heute, Gesamt-Umsatz)
- ✅ Archivierung (Soft-Delete)
- ✅ Filter & Suche

**Funktionen Fahrzeuge (MÜSSEN ERHALTEN BLEIBEN):**
- ✅ CRUD für Fahrzeuge
- ✅ TÜV-Überwachung (automatische Erinnerungen)
- ✅ Wartungsplaner
- ✅ Status-Management (Verfügbar, In Betrieb, Wartung)
- ✅ Fahrzeug-Dokumente
- ✅ Kilometerstand-Tracking
- ✅ Archivierung (Soft-Delete)
- ✅ Filter & Suche

**Datei:** `src/pages/Fahrer.tsx`

**Design-Status:** ✅ LAYOUT-FROZEN (keine Design-Änderungen ohne Freigabe!)

---

### Kunden-Dashboard (`/kunden`)

**Funktionen (MÜSSEN ERHALTEN BLEIBEN):**
- ✅ CRUD für Kunden
- ✅ Firmen- und Privatkunden
- ✅ Stammdaten-Verwaltung
- ✅ Auftrags-Historie pro Kunde
- ✅ Rechnungs-Historie pro Kunde
- ✅ Notizen/Kommentare
- ✅ Archivierung (Soft-Delete)
- ✅ Export (CSV, Excel)
- ✅ Filter & Suche

**Datei:** `src/pages/Kunden.tsx`

---

### Rechnungen-Dashboard (`/rechnungen`)

**Funktionen (MÜSSEN ERHALTEN BLEIBEN):**
- ✅ CRUD für Rechnungen
- ✅ Angebotserstellung (separate Route `/angebote`)
- ✅ Automatische Rechnungserstellung aus Auftrag
- ✅ Status-Tracking (Offen, Bezahlt, Überfällig)
- ✅ Mahnwesen (automatische Mahnungen)
- ✅ Export (PDF, CSV)
- ✅ DATEV-Export (für Steuerberater)
- ✅ Filter (Status, Datum, Betrag, Kunde)
- ✅ Zahlungsabgleich
- ✅ Storno-Funktion

**Datei:** `src/pages/Rechnungen.tsx`

---

### Partner-Dashboard (`/partner`) - Business+

**Funktionen (MÜSSEN ERHALTEN BLEIBEN):**
- ✅ CRUD für Partner-Unternehmen
- ✅ Auftragsvergabe an Partner
- ✅ Provisionsabrechnung (automatisch)
- ✅ Partner-Status (Aktiv, Inaktiv)
- ✅ Partner-Statistiken
- ✅ Partner-Portal (separate URL)
- ✅ Benachrichtigungen (bei neuen Aufträgen)

**Datei:** `src/pages/Partner.tsx`

**Design-Status:** ✅ LAYOUT-FROZEN

---

### Statistiken-Dashboard (`/statistiken`) - Business+

**Funktionen (MÜSSEN ERHALTEN BLEIBEN):**
- ✅ Umsatz-Reports (täglich, wöchentlich, monatlich, jährlich)
- ✅ Fahrer-Performance
- ✅ Fahrzeug-Auslastung
- ✅ Kunden-Analyse (Top-Kunden, Neukunden)
- ✅ Zahlungsmethoden-Verteilung
- ✅ Geografie-Analyse (Abholorte, Zielorte)
- ✅ Export (PDF, Excel, CSV)
- ✅ Visuelle Darstellung (Charts mit Recharts)
- ✅ Zeitraum-Filter
- ✅ Vergleichs-Ansichten (Vorjahr, Vormonat)

**Datei:** `src/pages/Statistiken.tsx`

---

### Weitere Dashboards/Seiten

| Route | Bezeichnung | Funktionen | Tarif |
|-------|-------------|------------|-------|
| `/schichtzettel` | Schichtplanung | Schicht-CRUD, Verfügbarkeitsprüfung, Konfliktmanagement | Alle |
| `/dokumente` | Dokumenten-Management | Upload, Ablauf-Überwachung, Kategorisierung | Alle |
| `/kommunikation` | Team-Chat | Echtzeit-Chat, Channels, Datei-Sharing | Business+ |
| `/kostenstellen` | Kostenstellen | CRUD, Zuordnung zu Aufträgen, Reports | Business+ |
| `/portal` | Kunden-Portal | Kunden-Login, Buchungs-Historie, Self-Service | Business+ |
| `/landingpage` | Landingpage-Konfigurator | Info-Page (Starter), Konfigurator (Business+), White-Label (Enterprise) | Alle |
| `/tracking` | GPS-Tracking | Live-Karte, Routenhistorie, Geofencing | Business+ |
| `/ai-support` | AI-Support | Chatbot-Interface, Historie | Alle |
| `/einstellungen` | Einstellungen | Profil, Unternehmen, Abo-Verwaltung | Alle |

---

## 2.4 Formular-Struktur (STATUS QUO - DÜRFEN SICH NICHT ÄNDERN)

### Auftrag erstellen/bearbeiten

**Felder (Vollständig):**
1. **Kunde** (Select, Pflicht)
2. **Abholadresse** (Text, Pflicht)
3. **Zieladresse** (Text, Pflicht)
4. **Datum & Uhrzeit** (DateTimePicker, Pflicht)
5. **Fahrer** (Select, Optional)
6. **Fahrzeug** (Select, Optional)
7. **Preis** (Number, Pflicht)
8. **Zahlungsmethode** (Select: Bar, Karte, Rechnung)
9. **Status** (Select: Offen, Bestätigt, In Bearbeitung, Abgeschlossen)
10. **Notizen** (Textarea, Optional)
11. **Kostenstelle** (Select, Optional, Business+)
12. **Partner** (Select, Optional, Business+)

**Validation:** Zod Schema mit Pflichtfelder-Prüfung

**Implementation:** `src/components/auftraege/BookingForm.tsx`

---

### Fahrer anlegen/bearbeiten

**Felder (Vollständig):**
1. **Vorname** (Text, Pflicht)
2. **Nachname** (Text, Pflicht)
3. **E-Mail** (Email, Pflicht)
4. **Telefon** (Tel, Pflicht)
5. **Führerschein-Nummer** (Text, Pflicht)
6. **Führerschein-Ablauf** (Date, Pflicht)
7. **P-Schein-Nummer** (Text, Optional)
8. **P-Schein-Ablauf** (Date, Optional)
9. **Profilbild** (File Upload, Optional)
10. **Adresse** (Text, Optional)
11. **Geburtsdatum** (Date, Optional)
12. **Notizen** (Textarea, Optional)

**Validation:** Zod Schema mit Ablaufdatum-Prüfung (muss in Zukunft liegen)

**Implementation:** `src/components/fahrer/DriverForm.tsx`

---

### Fahrzeug anlegen/bearbeiten

**Felder (Vollständig):**
1. **Kennzeichen** (Text, Pflicht, Unique)
2. **Marke** (Text, Pflicht)
3. **Modell** (Text, Pflicht)
4. **Typ** (Select: Limousine, Kombi, Van, etc., Pflicht)
5. **Baujahr** (Number, Pflicht)
6. **Farbe** (Text, Optional)
7. **TÜV-Ablauf** (Date, Pflicht)
8. **Versicherung-Ablauf** (Date, Optional)
9. **Kilometerstand** (Number, Optional)
10. **Status** (Select: Verfügbar, In Betrieb, Wartung)
11. **Notizen** (Textarea, Optional)

**Validation:** Zod Schema mit TÜV-Ablaufdatum-Prüfung

**Implementation:** `src/components/fahrzeuge/VehicleForm.tsx`

---

### Login/Registrierung

**Login-Felder:**
1. **E-Mail** (Email, Pflicht)
2. **Passwort** (Password, Pflicht)
3. **Remember Me** (Checkbox, Optional)

**Registrierungs-Felder:**
1. **Vorname** (Text, Pflicht)
2. **Nachname** (Text, Pflicht)
3. **E-Mail** (Email, Pflicht)
4. **Passwort** (Password, Pflicht, Min. 8 Zeichen)
5. **Passwort wiederholen** (Password, Pflicht, Muss übereinstimmen)
6. **Firmenname** (Text, Pflicht)
7. **Tarif-Auswahl** (aus URL oder Select)
8. **AGB akzeptieren** (Checkbox, Pflicht)
9. **Datenschutz akzeptieren** (Checkbox, Pflicht)

**Validation:** Zod Schema mit Passwort-Stärke-Prüfung

**Implementation:** `src/pages/Auth.tsx`

---

# III. ARCHITEKTUR & KONSISTENZ (USER EXPERIENCE)

## 3.1 Zusammengeführte vs. Separate Bereiche

### Zusammengeführt:
- **Fahrer & Fahrzeuge** (`/fahrer`) - Ein Dashboard, zwei Tabs
- **Angebote & Rechnungen** (Separate Routes, aber gleiche Komponenten)

### Separat:
- **Aufträge** (`/auftraege`) - Eigener Bereich
- **Kunden** (`/kunden`) - Eigener Bereich
- **Partner** (`/partner`) - Eigener Bereich (Business+)
- **Statistiken** (`/statistiken`) - Eigener Bereich (Business+)

**Begründung:** Fahrer & Fahrzeuge sind eng miteinander verbunden (Zuweisung), daher zusammengeführt. Aufträge sind separate Business-Logik und haben eigenen Workflow.

---

## 3.2 UX-Konsistenz (HARTE VORGABE)

**ZWINGEND:** Alle gleichartigen Dashboards MÜSSEN exakt die gleiche Struktur, Anordnung und Funktionalität haben.

### Standard-Dashboard-Struktur

**Jedes Dashboard MUSS folgende Elemente in dieser Reihenfolge haben:**

1. **Section Header**
   ```tsx
   <SectionHeader
     title="Dashboard-Name"
     description="Kurzbeschreibung"
     align="left"
   />
   ```

2. **Action Bar** (oberhalb der Daten-Tabelle/Grid)
   ```tsx
   <div className="flex items-center gap-4">
     <ActionButton variant="primary" icon={Plus}>Neu erstellen</ActionButton>
     <ActionButton variant="secondary" icon={Upload}>Importieren</ActionButton>
   </div>
   ```

3. **Filter & Search Bar**
   ```tsx
   <div className="flex items-center gap-4">
     <SearchInput />
     <FilterDropdown />
     <SortDropdown />
   </div>
   ```

4. **Daten-Anzeige** (DataTable oder DataGrid)
   ```tsx
   <DataGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
     {items.map(item => <Card>{item}</Card>)}
   </DataGrid>
   ```

5. **Pagination** (bei >20 Einträgen)
   ```tsx
   <Pagination currentPage={1} totalPages={5} />
   ```

**Referenz-Implementierungen:**
- ✅ `/auftraege` - Perfekte Umsetzung
- ✅ `/fahrer` - Perfekte Umsetzung
- ✅ `/partner` - Perfekte Umsetzung

**Regel:** Wenn ein Element in Dashboard A existiert, MUSS es in Dashboard B in der gleichen Position sein!

---

## 3.3 API-Verbindungen & Datenfluss

### Supabase-Tabellen (MÜSSEN ERHALTEN BLEIBEN)

| Tabelle | Zweck | RLS | Realtime |
|---------|-------|-----|----------|
| `bookings` | Aufträge | ✅ | ✅ |
| `drivers` | Fahrer | ✅ | ✅ |
| `vehicles` | Fahrzeuge | ✅ | ✅ |
| `customers` | Kunden | ✅ | ❌ |
| `invoices` | Rechnungen | ✅ | ❌ |
| `quotes` | Angebote | ✅ | ❌ |
| `partners` | Partner-Unternehmen | ✅ | ❌ |
| `partner_bookings` | Partner-Aufträge | ✅ | ✅ |
| `documents` | Dokumente | ✅ | ❌ |
| `shifts` | Schichten | ✅ | ✅ |
| `cost_centers` | Kostenstellen | ✅ | ❌ |
| `companies` | Unternehmen | ✅ | ❌ |
| `profiles` | Benutzer-Profile | ✅ | ❌ |
| `chat_messages` | Team-Chat | ✅ | ✅ |
| `chat_channels` | Chat-Kanäle | ✅ | ❌ |
| `audit_logs` | Aktivitäts-Logs | ✅ | ❌ |

**Sicherheits-Prinzip (ZWINGEND):**
- ALLE Tabellen haben Row Level Security (RLS) aktiviert
- ALLE Queries filtern nach `company_id` (Multi-Tenancy)
- Soft-Delete statt Hard-Delete (`archived` Flag)
- Audit-Logging für kritische Operationen

---

### Custom Hooks (Datenzugriff)

**Pattern:** Ein Hook pro Entität

| Hook | Tabelle | Features |
|------|---------|----------|
| `useBookings()` | bookings | CRUD, Realtime, Filter |
| `useDrivers()` | drivers | CRUD, Realtime, Status |
| `useVehicles()` | vehicles | CRUD, Realtime, TÜV |
| `useCustomers()` | customers | CRUD, Filter, Search |
| `useInvoices()` | invoices | CRUD, Status, Export |
| `usePartners()` | partners | CRUD, Provisionen |
| `useStatistics()` | - | Aggregierte Daten |
| `useAuth()` | profiles | User, Company, Subscription |

**Location:** `src/hooks/`

**Regel:** NIEMALS direkte Supabase-Queries in Components! Immer über Hooks abstrahieren.

---

### Edge Functions

| Function | Zweck | Secret |
|----------|-------|--------|
| `ai-chat` | Claude 3.5 Sonnet Chatbot | ANTHROPIC_API_KEY |
| `send-email` | E-Mail-Versand (Benachrichtigungen) | (TBD) |
| `generate-invoice-pdf` | PDF-Generierung für Rechnungen | - |
| `stripe-webhook` | Stripe Payment Webhooks | (TBD) |

**Location:** `supabase/functions/`

---

## 3.4 Routing-System

**Routing-Datei:** `src/App.tsx`

### Public Routes (ohne Auth)
- `/` - Home/Landingpage (Marketing)
- `/pricing` - Pricing-Seite (Marketing)
- `/contact` - Kontakt-Formular (Marketing)
- `/faq` - FAQ-Seite (Marketing)
- `/impressum` - Impressum (Legal)
- `/datenschutz` - Datenschutzerklärung (Legal)
- `/agb` - AGB (Legal)
- `/auth` - Login/Registrierung

### Protected Routes (mit Auth)
- `/dashboard` (Alias für `/`) - Master-Dashboard
- `/auftraege` - Auftrags-Verwaltung
- `/fahrer` - Fahrer & Fahrzeuge (Zusammengeführt)
- `/fahrzeuge` - Redirect zu `/fahrer?tab=vehicles`
- `/kunden` - Kunden-Verwaltung
- `/rechnungen` - Rechnungs-Verwaltung
- `/angebote` - Angebots-Verwaltung
- `/schichtzettel` - Schichtplanung
- `/dokumente` - Dokumenten-Management
- `/einstellungen` - Einstellungen (Profil, Unternehmen, Abo)

### Protected Routes (Business+)
- `/partner` - Partner-Netzwerk
- `/statistiken` - Statistiken & Reports
- `/kommunikation` - Team-Chat
- `/kostenstellen` - Kostenstellen-Verwaltung
- `/tracking` - GPS-Tracking
- `/landingpage` - Landingpage-Konfigurator (erweitert)

### Protected Routes (Enterprise)
- `/landingpage` - White-Label Landingpages

**Navigation Guard:** `src/components/ProtectedRoute.tsx`

---

# IV. WORKFLOWS & GESETZLICHE VORGABEN

## 4.1 Bestehende Workflows (VOLLSTÄNDIG)

### 1. Registrierungs-Workflow (FUNKTIONIERT)

**Schritte:**
1. User öffnet `/auth` oder `/auth?tariff=business&billing=monthly`
2. Klickt auf "Registrieren"
3. Füllt Registrierungsformular aus (Vorname, Nachname, E-Mail, Passwort, Firmenname)
4. Akzeptiert AGB & Datenschutz (Pflicht-Checkboxen)
5. System erstellt:
   - Supabase Auth User (`auth.users`)
   - Profile (`profiles` Tabelle)
   - Company (`companies` Tabelle)
   - Stripe Customer (über Edge Function)
6. E-Mail-Verifizierung (Auto-Confirm aktiviert für Nicht-Produktiv-Apps)
7. Redirect zu Dashboard mit Welcome Wizard

**Implementation:** `src/pages/Auth.tsx`, `src/hooks/use-auth.ts`

---

### 2. Login-Workflow (FUNKTIONIERT)

**Schritte:**
1. User öffnet `/auth`
2. Gibt E-Mail & Passwort ein
3. System validiert gegen `auth.users`
4. Lädt Profile & Company aus DB
5. Prüft Subscription-Status
6. Redirect zu `/dashboard` oder letzte besuchte Seite

**Implementation:** `src/pages/Auth.tsx`

---

### 3. Passwort-Vergessen-Workflow (FUNKTIONIERT)

**Schritte:**
1. User klickt "Passwort vergessen" auf `/auth`
2. Gibt E-Mail ein
3. System sendet Reset-Link via Supabase Auth
4. User klickt Link in E-Mail
5. Wird zu Reset-Seite weitergeleitet
6. Gibt neues Passwort ein (2x)
7. Passwort wird aktualisiert
8. Redirect zu Login

**Implementation:** Supabase Auth (Standard-Flow)

---

### 4. Auftragserstellung & Zuweisung (FUNKTIONIERT)

**Schritte:**
1. User klickt "Neuer Auftrag" (Dashboard oder `/auftraege`)
2. Dialog öffnet sich mit Formular
3. User füllt Pflichtfelder aus (Kunde, Abholung, Ziel, Datum, Preis)
4. Optional: Fahrer & Fahrzeug zuweisen
5. System validiert:
   - Fahrer/Fahrzeug-Limits (Tarif-Check)
   - Überschneidungen (Zeitraum-Check)
6. Auftrag wird erstellt und in DB gespeichert
7. Realtime-Update in allen offenen Dashboards
8. Optional: Benachrichtigung an Fahrer (wenn zugewiesen)

**Implementation:** `src/pages/Auftraege.tsx`, `src/hooks/use-bookings.ts`

---

### 5. Rechnungserstellung aus Auftrag (FUNKTIONIERT)

**Schritte:**
1. User öffnet Auftrag-Details
2. Klickt "Rechnung erstellen"
3. System pre-fills Rechnung mit Auftragsdaten:
   - Kunde
   - Betrag
   - Datum
   - Auftragsnummer
4. User kann Rechnung editieren
5. System erstellt Rechnung in DB
6. Optional: PDF-Generierung via Edge Function
7. Optional: E-Mail-Versand an Kunde

**Implementation:** `src/pages/Auftraege.tsx`, `src/hooks/use-invoices.ts`

---

## 4.2 Gesetzliche Vorgaben (COMPLIANCE)

### DSGVO (Datenschutz-Grundverordnung)

**Umsetzung:**
- ✅ Datenschutzerklärung (`/datenschutz`)
- ✅ Einwilligung bei Registrierung (Checkboxen)
- ✅ Recht auf Auskunft (Export-Funktion)
- ✅ Recht auf Löschung (Account-Löschung)
- ✅ Recht auf Datenportabilität (CSV/JSON-Export)
- ✅ Verschlüsselung (AES-256)
- ✅ Server in Deutschland (Frankfurt)
- ✅ 2-Faktor-Authentifizierung (optional aktivierbar)

**Pflicht-Links auf ALLEN Seiten:**
- Footer: Impressum, Datenschutz, AGB
- Registrierung: Checkboxen mit Links zu Datenschutz & AGB

**Datei:** `src/pages/Datenschutz.tsx`

---

### PBefG § 51 (Personenbeförderungsgesetz)

**Vorgabe:** Auftragsdaten müssen 10 Jahre aufbewahrt werden.

**Umsetzung:**
- ✅ Soft-Delete bei Aufträgen (nur `archived` Flag, keine physische Löschung)
- ✅ Automatische Löschung nach 10 Jahren (via Cron-Job)
- ✅ Hinweis im UI: "Gemäß PBefG § 51 werden Auftragsdaten 10 Jahre aufbewahrt"

**Implementation:** 
- Soft-Delete: `src/hooks/use-bookings.ts`
- Hinweis: `src/pages/Auftraege.tsx`, `src/pages/Rechnungen.tsx`

---

### Handelsrecht (Rechnungsaufbewahrung)

**Vorgabe:** Rechnungen müssen 10 Jahre aufbewahrt werden.

**Umsetzung:**
- ✅ Soft-Delete bei Rechnungen
- ✅ Automatische Löschung nach 10 Jahren
- ✅ Export-Funktion für Steuerberater (DATEV-Format)

---

### Weitere Compliance-Anforderungen

- ✅ **Impressumspflicht**: `/impressum` mit allen Pflichtangaben
- ✅ **AGB**: `/agb` mit rechtsgültigen Nutzungsbedingungen
- ✅ **Cookie-Banner**: (TBD - wenn Cookies verwendet werden)
- ✅ **SSL/TLS**: HTTPS für alle Verbindungen (via Lovable Cloud)

---

# V. DESIGN & CI-GOVERNANCE

## 5.1 V26.0 Design System (PRODUCTION-LOCKED)

**Master-Dokumentation:** `docs/PRICING_DESIGN_SYSTEM_V26.0.md`

### Core Color System (KERNFARBEN)

**Datei:** `src/lib/design-system/pricing-colors.ts`

```typescript
export const KERNFARBEN = {
  dunkelblau: '#323D5E',    // Primary Brand Color
  beige: '#EADEBD',         // Accent Color
  weiss: '#FFFFFF',         // White
  canvas: '#F9FAFB',        // Background (gray-50)
  text_primary: '#111827',  // Headlines, Prices (gray-900)
  text_secondary: '#374151', // Body Text (gray-700)
  text_tertiary: '#6B7280',  // Sub-Text (gray-500)
  border_neutral: '#E5E7EB', // Borders (gray-200)
  border_neutral_soft: 'rgba(229, 231, 235, 0.8)',
} as const;
```

**VERBOTEN:**
- ❌ Direkte Hex-Werte in Components (`#111827`)
- ❌ Tailwind Color Classes (`text-gray-900`)
- ❌ Inline-Styles ohne KERNFARBEN-Referenz

**PFLICHT:**
```tsx
import { KERNFARBEN } from '@/lib/design-system/pricing-colors';
style={{ color: KERNFARBEN.text_primary }}
```

---

### Typography System V26.0

**Font-Family:** Inter (Primary), Playfair Display (Decorative)

**Datei:** `docs/TYPOGRAPHY_SYSTEM_V26.md`

**Pflicht-Klasse:** `font-sans` auf ALLEN Text-Elementen!

```tsx
// ✅ RICHTIG
<h1 className="font-sans text-6xl font-bold">Headline</h1>
<p className="font-sans text-base">Body Text</p>

// ❌ FALSCH
<h1 className="text-6xl font-bold">Headline ohne font-sans</h1>
```

**Font Sizes (Fluid Typography):**
- H1: `text-5xl md:text-6xl` (48px → 60px)
- H2: `text-4xl md:text-5xl` (36px → 48px)
- H3: `text-2xl` (24px)
- Body: `text-base` (16px)
- Small: `text-sm` (14px)

**Text-Wrapping:**
- Headlines: `textWrap: 'balance'`
- Body Text: `textWrap: 'pretty'`

---

### Spacing System V18.5.1

**Datei:** `docs/SPACING_SYSTEM_V18.5.1.md`

**Global Standards:**
```tsx
// Header
className="h-14 sm:h-16"

// Main Content
className="pt-14 sm:pt-16 pb-16 sm:pb-20"

// Footer
className="py-3 sm:py-4"

// Section Spacing
className="py-20 md:py-24"

// Card Padding
className="p-6 md:p-8"
```

---

### Component Library V26.0

**Datei:** `docs/V26_COMPONENT_LIBRARY.md`

**Wiederverwendbare Komponenten:**

1. **V26Button** (`src/components/design-system/V26Button.tsx`)
   - Varianten: `primary`, `secondary`
   - Hover: `scale(1.02)` + Shadow

2. **V26IconBox** (`src/components/design-system/V26IconBox.tsx`)
   - Varianten: `dunkelblau`, `beige`
   - Größen: `sm`, `md`, `lg`

3. **V26InfoBox** (`src/components/design-system/V26InfoBox.tsx`)
   - Typen: `info`, `warning`, `legal`

4. **MarketingSection** (`src/components/marketing/MarketingSection.tsx`)
   - Backgrounds: `canvas`, `white`
   - Auto-zentrierte Titel & Beschreibungen

5. **MarketingCard** (`src/components/marketing/MarketingCard.tsx`)
   - Standard-Karte mit CI-Styling

6. **IconBox** (`src/components/marketing/IconBox.tsx`)
   - Marketing-Varianten (älter als V26IconBox)

7. **FeatureListItem** (`src/components/marketing/FeatureListItem.tsx`)
   - Check-Icon + Text

8. **BillingToggle** (`src/components/marketing/BillingToggle.tsx`)
   - Monatlich/Jährlich Toggle

**Regel:** IMMER vorhandene Komponenten nutzen, NIEMALS Custom-Implementierungen!

---

### Text Alignment System V26.0 (NEU)

**Datei:** `docs/TEXT_ALIGNMENT_SYSTEM_V26.0.md`

**KERNREGEL:** Titel und Beschreibung MÜSSEN immer die gleiche Ausrichtung haben!

```tsx
// ✅ RICHTIG
<div className="text-center">
  <h2 className="text-4xl font-bold text-center">Titel</h2>
  <p className="text-lg text-center">Beschreibung</p>
</div>

// ❌ FALSCH
<div className="text-center">
  <h2 className="text-4xl font-bold text-center">Titel</h2>
  <p className="text-lg text-left">Beschreibung</p>
</div>
```

---

### Link System V18.5.0

**Datei:** `docs/SYSTEM_DESIGN_PRINCIPLES_V18.5.0.md` (Section 6)

**ZWINGEND:** KEINE Unterstreichungen bei Links systemweit!

```tsx
// ✅ RICHTIG - V26Link verwenden
import { V26Link } from '@/components/design-system/V26Link';
<V26Link href="/pricing">Zu den Preisen</V26Link>

// Hover-Effekt: opacity-80 statt underline
```

---

### Visueller Rhythmus (Marketing-Seiten)

**Pattern (von oben nach unten):**
```
Hero Section       → bg-dunkelblau (Gradient)
Features           → bg-canvas
Testimonials       → bg-white
Pricing            → bg-canvas
FAQ                → bg-canvas (mit white Card)
Final CTA          → bg-canvas
```

**Regel:** Maximale visuelle Harmonie durch gezielten Kontrast.

---

### Hero-Bereich Vorgaben

**ZWINGEND für alle Marketing-Seiten:**
1. **Professional Gradient** statt Video (Dunkelblau-Töne)
2. **Geometrisches Pattern** (subtil, 5% Opacity)
3. **Glow-Effekte** (Beige-Akzente für Tiefe)
4. **Premium Trust-Badge** (z.B. "500+ Unternehmen")
5. **Gestaffelte Animations** (fade-in mit Delays)
6. **Rechte Spalte:** Code-basierte Dashboard-Grafik (V26.0 Design)
7. **Optimierte Abstände** zwischen Headline/Subheadline/Description
8. **CTA-Buttons:** Primary (Beige BG) + Secondary (Transparent mit Border)

**Referenz:** `src/pages/Home.tsx` (Hero-Section)

---

## 5.2 Kommunikations-Standards

**Datei:** `docs/KOMMUNIKATION_TONALITY_V19.0.0.md`

### Tone of Voice

| Dimension | Ausprägung |
|-----------|------------|
| **Formalität** | Professionell, aber zugänglich (Siezen) |
| **Humor** | Zurückhaltend (keine Witze) |
| **Enthusiasmus** | Moderat (positiv, aber nicht übertrieben) |
| **Respekt** | Hoch (Kunde ist Partner) |

### Content Writing Rules

**Datei:** `docs/CONTENT_WRITING_STANDARDS_V26.0.md`

**Kernprinzipien:**
1. **Prägnanz**: Kurze, klare Sätze (max. 20 Wörter)
2. **Direkte Ansprache**: Sie-Form, aktive Verben
3. **Nutzen vor Features**: Konkreter Vorteil zuerst
4. **Transparenz**: Ehrliche Kommunikation, keine versteckten Kosten
5. **Professionell aber zugänglich**: Fachbegriffe nur wenn nötig

**Headline-Struktur:**
- H1: 3-6 Worte, Punkt-Sätze (z.B. "Klar. Fair. Zukunftssicher.")
- H2: 2-5 Worte, Nomen-Konstruktion
- H3: 2-6 Worte, Feature/Produkt-Name

### Verbotene Phrasen

❌ **STRIKT VERBOTEN:**
- "Kostenlos" (außer bei echter Gratis-Funktion)
- "Revolutionär"
- "Einzigartig"
- "State-of-the-art"
- "Best-in-class"
- "Innovativ" (ohne Erklärung)
- "Mega krasser Deal"
- "Nur heute: 50% Rabatt!"

✅ **EMPFOHLEN:**
- "Entwickelt für moderne Unternehmen"
- "Über 500 Unternehmen vertrauen uns"
- "Transparent und übersichtlich"
- "Sofort einsatzbereit"
- "Jederzeit kündbar"
- "Sparen Sie bis zu 20% bei jährlicher Zahlung"

---

# VI. SOLL/IST-STATUS & OFFENE PUNKTE

## 6.1 Fertiggestellte Bereiche (DESIGN-FROZEN)

| Bereich | Status | Design-Lock | Letzte Änderung |
|---------|--------|-------------|-----------------|
| `/` (Home) | ✅ FERTIG | 🔒 LOCKED | 2025-10-26 |
| `/pricing` | ✅ FERTIG | 🔒 LOCKED | 2025-01-26 |
| `/auftraege` | ✅ FERTIG | 🔒 LOCKED | 2025-01-20 |
| `/fahrer` | ✅ FERTIG | 🔒 LOCKED | 2025-01-20 |
| `/partner` | ✅ FERTIG | 🔒 LOCKED | 2025-01-20 |
| Header/Footer | ✅ FERTIG | 🔒 LOCKED | 2025-01-15 |

**Design-Lock Regel:** Nach Fertigstellung sind AUSNAHMSLOS nur noch technische Optimierungen, Fixes und Stabilisierungen erlaubt. Keine Layout- oder Design-Änderungen ohne explizite Freigabe!

---

## 6.2 In Bearbeitung

| Bereich | Status | Priorität | Nächster Schritt |
|---------|--------|-----------|------------------|
| `/contact` | 🔄 IN ARBEIT | Mittel | V26.0 Migration |
| `/faq` | 🔄 IN ARBEIT | Mittel | V26.0 Migration |
| `/impressum` | 🔄 IN ARBEIT | Niedrig | V26.0 Migration |
| `/datenschutz` | 🔄 IN ARBEIT | Niedrig | V26.0 Migration |
| `/agb` | 🔄 IN ARBEIT | Niedrig | V26.0 Migration |

---

## 6.3 Offene Punkte & Gaps

### Kritische Gaps (Prio 1 - SOFORT)
- [ ] Stripe Integration (Subscriptions, Invoices, Webhooks)
- [ ] E-Mail-Versand (Transactional Emails via Edge Function)
- [ ] PDF-Generierung (Rechnungen, Angebote)
- [ ] Push-Notifications (für Fahrer-App)

### Wichtige Gaps (Prio 2 - DIESE WOCHE)
- [ ] GPS-Tracking Implementation (Business+)
- [ ] HERE Maps Integration (Business+)
- [ ] Weather API Integration (Business+)
- [ ] Traffic API Integration (Business+)
- [ ] n8n Workflow-Automatisierung (Business+)

### Nice-to-Have Gaps (Prio 3 - NÄCHSTE SPRINT)
- [ ] Mobile App (iOS/Android) für Fahrer
- [ ] Offline-Modus (PWA)
- [ ] Dark Mode (vollständig)
- [ ] Multi-Language (EN, DE, AT)
- [ ] Custom Branding (Enterprise)

---

### Bekannte Bugs & Fixes

**Bug-Tracking:** Alle Bugs werden in separaten Error-Report-Dokumenten festgehalten.

**Beispiele:**
- ✅ GELÖST: Logo-Overflow (siehe `LOGO_OVERFLOW_FIX_V18.5.1_COMPLETE.md`)
- ✅ GELÖST: Badge-Sizing (siehe `ERROR_REPORT_BADGE_FINAL_V18.5.1.md`)
- ✅ GELÖST: Routing-Issues (siehe `ROUTING_FIX_REPORT_V18.5.1.md`)

---

## 6.4 Soll/Ist-Abgleich (STRUKTUR)

**Zweck:** Zukünftige Pflege des Projekt-Status

### Feature-Vollständigkeit

| Feature | SOLL | IST | Gap | Deadline |
|---------|------|-----|-----|----------|
| Auftragsverwaltung | 100% | 100% | - | ✅ |
| Fahrer-Management | 100% | 100% | - | ✅ |
| Rechnungsstellung | 100% | 95% | PDF-Gen | TBD |
| Partner-Netzwerk | 100% | 90% | Provisionen | TBD |
| GPS-Tracking | 100% | 0% | Komplett | TBD |

### Design-System-Compliance

| Bereich | SOLL | IST | Gap | Deadline |
|---------|------|-----|-----|----------|
| KERNFARBEN | 100% | 100% | - | ✅ |
| font-sans | 100% | 100% | - | ✅ |
| V26 Components | 100% | 90% | Alte Seiten | TBD |
| Text Alignment | 100% | 100% | - | ✅ |

---

# VII. TECHNISCHE REFERENZEN

## 7.1 Kritische Code-Dateien

### Frontend Core
- `src/App.tsx` - Routing & App-Initialisierung
- `src/main.tsx` - Entry Point
- `src/index.css` - Design Tokens & Global Styles
- `tailwind.config.ts` - Tailwind Configuration

### Layout System
- `src/components/layout/DashboardLayout.tsx` - App-Layout (Dashboard)
- `src/components/layout/MarketingLayout.tsx` - Marketing-Layout (Home, Pricing)
- `src/components/layout/Header.tsx` - Unified Header
- `src/components/layout/Footer.tsx` - Unified Footer
- `src/components/layout/Sidebar.tsx` - Navigation Sidebar

### Design System
- `src/lib/design-system/pricing-colors.ts` - KERNFARBEN
- `src/components/design-system/V26Button.tsx` - Standard-Buttons
- `src/components/design-system/V26IconBox.tsx` - Icon-Container
- `src/components/design-system/V26InfoBox.tsx` - Info-Boxen
- `src/components/design-system/V26Link.tsx` - Links (ohne Underline)

### Smart Templates
- `src/components/smart-templates/index.ts` - Exports
- `src/components/smart-templates/SectionHeader.tsx` - Section Headers
- `src/components/smart-templates/DataGrid.tsx` - Responsive Grids
- `src/components/smart-templates/StatCard.tsx` - KPI Cards
- `src/components/smart-templates/DashboardCard.tsx` - Widget Cards
- `src/components/smart-templates/ActionButton.tsx` - Action Buttons

### Data Management
- `src/lib/tariff/tariff-definitions.ts` - Tarif-System (Single Source of Truth)
- `src/data/pricing-tiers.ts` - Pricing-Daten (Legacy, migriert zu tariff-definitions)
- `src/data/faq-data.ts` - FAQ-Daten
- `src/data/testimonials.ts` - Testimonials
- `src/config/content.config.ts` - Content-Verwaltung

### Authentication & Authorization
- `src/hooks/use-auth.ts` - Auth Hook
- `src/hooks/use-subscription.ts` - Subscription Hook
- `src/components/ProtectedRoute.tsx` - Route Guard
- `src/pages/Auth.tsx` - Login/Register

---

## 7.2 Backend-Struktur

### Supabase Migrations
**Location:** `supabase/migrations/`

**Wichtigste Migrations:**
- `*_create_profiles.sql` - User-Profile
- `*_create_companies.sql` - Unternehmen (Multi-Tenancy)
- `*_create_bookings.sql` - Aufträge
- `*_create_drivers.sql` - Fahrer
- `*_create_vehicles.sql` - Fahrzeuge
- `*_create_invoices.sql` - Rechnungen
- `*_enable_realtime.sql` - Realtime für Bookings/Drivers/Vehicles

**RLS Policies:** ALLE Tabellen haben strenge RLS (Row Level Security)

---

### Edge Functions
**Location:** `supabase/functions/`

| Function | Status | Beschreibung |
|----------|--------|--------------|
| `ai-chat` | ✅ AKTIV | Claude 3.5 Sonnet Chatbot |
| `send-email` | 🔄 TBD | E-Mail-Versand |
| `generate-invoice-pdf` | 🔄 TBD | PDF-Generierung |
| `stripe-webhook` | 🔄 TBD | Stripe Payments |

---

## 7.3 Secrets Management

**Konfigurierte Secrets (Lovable Cloud):**
- `ANTHROPIC_API_KEY` - Claude 3.5 Sonnet (AI-Chat)
- (Weitere TBD)

**Zugriff:** Edge Functions via `Deno.env.get('SECRET_NAME')`

---

# VIII. QUALITY GATES & TESTING

## 8.1 Qualitäts-Standards

**Datei:** `docs/QUALITAETS_STANDARDS_V18.5.0.md`

### Code-Qualität
- ✅ 0 TypeScript Errors
- ✅ 100% Type-Safe
- ✅ Zentralisierte Utils (keine Inline-Formatierung)
- ✅ DRY-Prinzip (Don't Repeat Yourself)

### Design-Qualität
- ✅ 100% Design-System Compliance
- ✅ Pixelgenaue Umsetzung
- ✅ WCAG 2.1 AA Kontraste (min 4.5:1)
- ✅ Mobile-First Responsive

### Security-Qualität
- ✅ RLS auf ALLEN Tabellen
- ✅ company_id in ALLEN Queries
- ✅ Soft-Delete statt Hard-Delete
- ✅ Input-Validation (Zod)

### Performance-Qualität
- ✅ React Query Caching
- ✅ Lazy-Loading
- ✅ API-Caching (30s-30min)
- ✅ Bundle-Size <1.5MB

### UX-Qualität
- ✅ Loading-States überall
- ✅ Error-Handling mit Toast
- ✅ Optimistic UI-Updates
- ✅ Touch-Targets ≥44px (Mobile)

---

## 8.2 Testing-Strategy

### E2E Tests (Playwright)

**Datei:** `tests/e2e/visual/screenshots.spec.ts`

**Test-Coverage:**
- Desktop Screenshots (alle Haupt-Seiten)
- Mobile Screenshots (iPhone 12)
- Tablet Screenshots (iPad Pro)
- Component Screenshots (KPI Cards, Tables, Sidebar)
- Dark Mode Screenshots

**Command:** `npm run test:visual`

---

### Visual Regression Tests

**Zweck:** Verhindern von Layout-Breaks

**Workflow:**
1. Baseline-Screenshots erstellen
2. Code-Änderungen durchführen
3. Neue Screenshots erstellen
4. Visuellen Diff vergleichen
5. Bei Abweichungen: Manuell prüfen

---

## 8.3 Pre-Deployment Checklist

**PFLICHT vor JEDEM Deployment:**
- [ ] TypeScript: 0 Errors
- [ ] Design-System: 0 Violations
- [ ] Security-Scan: 0 CRITICAL
- [ ] Lighthouse: Score >90
- [ ] Mobile-Test: iPhone/Android OK
- [ ] All E2E Tests: PASS
- [ ] Visual Regression: PASS oder approved
- [ ] Console Errors: 0
- [ ] Network Errors: 0

---

# IX. ENTWICKLUNGS-WORKFLOW

## 9.1 NeXify 3-Phasen-Workflow

**Datei:** `docs/NEXIFY_WORKFLOW_PROMPT_V19.0.0.md`

### Phase 1: SELBSTREFLEXION & CODE-AUDIT
- Governance-Check (Corporate Governance, Kommunikation, Design)
- Code-Prüfung (Screenshots, Fehler-Identifikation)
- Fehler-Dokumentation (FEHLER_LOG erstellen)
- Wissensabgleich (Alle relevanten Docs lesen)
- Design-System-Compliance Check

### Phase 2: IST-ZUSTAND & PLANUNG
- IST-Analyse (Layout Freeze Check, ToV Check)
- Planung (Design-System, Kommunikations-Stil)
- Präsentation (Freigabe-Prozess mit Review)

### Phase 3: IMPLEMENTATION
- Design-System-Compliance Check
- Kommunikations-Check (ToV, Markenwerte)
- Umsetzung (Parallel Tool-Calls)
- Qualitätssicherung (Mobile, Legal, Performance, Design)
- Post-Validation

---

## 9.2 Layout-Freeze-Protection

**Datei:** `docs/LAYOUT_FREEZE_PROTECTION_V18.5.1.md`

**Geschützte Seiten:**
- `/auftraege` (Index.tsx wenn Dashboard)
- `/fahrer`
- `/partner`

**Regel:** KEINE Layout- oder Design-Änderungen ohne explizite Freigabe!

**Check vor Änderung:**
```typescript
if (file === 'src/pages/Auftraege.tsx') {
  if (requestType.includes('layout') || requestType.includes('design')) {
    STOP_IMMEDIATELY();
    WARN_USER_ABOUT_LAYOUT_FREEZE();
    WAIT_FOR_EXPLICIT_APPROVAL();
  }
}
```

---

## 9.3 Dashboard-Layout-Regel

**Datei:** `docs/DASHBOARD_LAYOUT_RULE_V18.5.1.md` (referenced)

**ZWINGEND für alle Dashboards:**
- Alle Cards sind harmonisch angeordnet
- KEINE weißen Lücken zwischen Cards
- Bündig abschließend (keine halbhohen Cards)
- Grid-Layout mit konsistenten Gaps

**Referenz:** `/dashboard`, `/auftraege`, `/fahrer`

---

# X. ROUTING & NAVIGATION

## 10.1 Routing-System

**Datei:** `docs/ROUTING_SYSTEM_V18.5.1.md` (referenced)

### Route-Struktur

**Marketing-Routes (Public):**
```
/ → src/pages/Home.tsx (Landingpage)
/pricing → src/pages/Pricing.tsx
/contact → src/pages/Contact.tsx
/faq → src/pages/FAQ.tsx
/impressum → src/pages/Impressum.tsx
/datenschutz → src/pages/Datenschutz.tsx
/agb → src/pages/AGB.tsx
```

**App-Routes (Protected):**
```
/dashboard → src/pages/Index.tsx (Master-Dashboard)
/auftraege → src/pages/Auftraege.tsx
/fahrer → src/pages/Fahrer.tsx
/fahrzeuge → Redirect zu /fahrer?tab=vehicles
/kunden → src/pages/Kunden.tsx
/rechnungen → src/pages/Rechnungen.tsx
/angebote → src/pages/Angebote.tsx
/schichtzettel → src/pages/Schichtzettel.tsx
/dokumente → src/pages/Dokumente.tsx
/einstellungen → src/pages/Einstellungen.tsx
```

**Business+ Routes (Protected + Feature-Gate):**
```
/partner → src/pages/Partner.tsx
/statistiken → src/pages/Statistiken.tsx
/kommunikation → src/pages/Kommunikation.tsx
/kostenstellen → src/pages/Kostenstellen.tsx
/tracking → src/pages/DriverTracking.tsx
/landingpage → src/pages/LandingpageKonfigurator.tsx (erweitert)
```

**Special Routes:**
```
/auth → src/pages/Auth.tsx (Login/Register)
/portal → src/pages/Portal.tsx (Kunden-Portal)
/portal/auth → src/pages/PortalAuth.tsx (Portal Login)
/ai-support → src/pages/AISupport.tsx (AI-Chatbot)
/coming-soon → src/pages/ComingSoon.tsx (Platzhalter)
```

---

## 10.2 Navigation-Pattern

**Sidebar-Navigation (App):**
- Dashboard
- Aufträge
- Fahrer & Fahrzeuge
- Kunden
- Rechnungen
- Partner (Business+)
- Statistiken (Business+)
- Kommunikation (Business+)
- Mehr (Dropdown: Dokumente, Schichtzettel, Kostenstellen, Einstellungen)

**Header-Navigation (Marketing):**
- Home
- Preise
- Funktionen (TBD)
- Kontakt
- FAQ
- Login/Dashboard

---

# XI. DATENBANK-SCHEMA

## 11.1 Core Tables

### profiles
```sql
- id (UUID, PK)
- user_id (UUID, FK auth.users)
- company_id (UUID, FK companies)
- first_name (TEXT)
- last_name (TEXT)
- email (TEXT)
- role (TEXT: admin, user)
- avatar_url (TEXT)
- created_at (TIMESTAMP)
```

### companies
```sql
- id (UUID, PK)
- name (TEXT)
- subscription_status (TEXT: active, inactive, trial)
- subscription_product_id (TEXT, FK Stripe)
- subscription_id (TEXT, Stripe)
- created_at (TIMESTAMP)
```

### bookings
```sql
- id (UUID, PK)
- company_id (UUID, FK)
- customer_id (UUID, FK customers)
- driver_id (UUID, FK drivers, NULLABLE)
- vehicle_id (UUID, FK vehicles, NULLABLE)
- pickup_address (TEXT)
- dropoff_address (TEXT)
- pickup_datetime (TIMESTAMP)
- price (NUMERIC)
- payment_method (TEXT: cash, card, invoice)
- payment_status (TEXT: paid, pending, overdue)
- status (TEXT: open, confirmed, in_progress, completed, cancelled)
- notes (TEXT)
- cost_center_id (UUID, FK, NULLABLE)
- partner_id (UUID, FK, NULLABLE)
- archived (BOOLEAN, default false)
- created_at (TIMESTAMP)
```

### drivers
```sql
- id (UUID, PK)
- company_id (UUID, FK)
- first_name (TEXT)
- last_name (TEXT)
- email (TEXT)
- phone (TEXT)
- license_number (TEXT)
- license_expiry (DATE)
- p_license_number (TEXT, NULLABLE)
- p_license_expiry (DATE, NULLABLE)
- shift_status (TEXT: available, busy, offline)
- profile_image_url (TEXT, NULLABLE)
- total_rides (INTEGER, default 0)
- archived (BOOLEAN, default false)
- created_at (TIMESTAMP)
```

### vehicles
```sql
- id (UUID, PK)
- company_id (UUID, FK)
- license_plate (TEXT, UNIQUE per company)
- brand (TEXT)
- model (TEXT)
- type (TEXT: limousine, kombi, van, bus, sonderfahrzeug)
- year (INTEGER)
- color (TEXT, NULLABLE)
- tuv_expiry (DATE)
- insurance_expiry (DATE, NULLABLE)
- mileage (INTEGER, NULLABLE)
- status (TEXT: available, in_use, maintenance, out_of_service)
- notes (TEXT, NULLABLE)
- archived (BOOLEAN, default false)
- created_at (TIMESTAMP)
```

### customers
```sql
- id (UUID, PK)
- company_id (UUID, FK)
- type (TEXT: private, business)
- first_name (TEXT)
- last_name (TEXT)
- company_name (TEXT, NULLABLE)
- email (TEXT, NULLABLE)
- phone (TEXT)
- address (TEXT, NULLABLE)
- notes (TEXT, NULLABLE)
- archived (BOOLEAN, default false)
- created_at (TIMESTAMP)
```

### invoices
```sql
- id (UUID, PK)
- company_id (UUID, FK)
- customer_id (UUID, FK customers)
- booking_id (UUID, FK bookings, NULLABLE)
- invoice_number (TEXT, UNIQUE per company)
- amount (NUMERIC)
- tax_rate (NUMERIC, default 19)
- tax_amount (NUMERIC)
- total_amount (NUMERIC)
- payment_status (TEXT: paid, pending, overdue)
- due_date (DATE)
- paid_at (TIMESTAMP, NULLABLE)
- notes (TEXT, NULLABLE)
- created_at (TIMESTAMP)
```

### partners
```sql
- id (UUID, PK)
- company_id (UUID, FK)
- name (TEXT)
- email (TEXT)
- phone (TEXT, NULLABLE)
- commission_rate (NUMERIC) -- Prozentsatz
- status (TEXT: active, inactive)
- portal_access_enabled (BOOLEAN, default false)
- notes (TEXT, NULLABLE)
- created_at (TIMESTAMP)
```

---

## 11.2 RLS Policies (SICHERHEITS-KRITISCH)

**Grundregel:** ALLE Policies MÜSSEN `company_id = auth.uid_company_id()` prüfen!

**Standard-Policy-Set pro Tabelle:**
```sql
-- SELECT
CREATE POLICY "Users can view own company data"
ON table_name FOR SELECT
USING (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

-- INSERT
CREATE POLICY "Users can insert own company data"
ON table_name FOR INSERT
WITH CHECK (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

-- UPDATE
CREATE POLICY "Users can update own company data"
ON table_name FOR UPDATE
USING (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

-- DELETE (Soft-Delete bevorzugt!)
CREATE POLICY "Users can delete own company data"
ON table_name FOR DELETE
USING (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));
```

**Referenz:** Supabase Migrations in `supabase/migrations/`

---

# XII. DOKUMENTATIONS-VERZEICHNIS

## 12.1 Core System Docs

| Dokument | Zweck | Priorität |
|----------|-------|-----------|
| `NEXIFY_EIGENSTÄNDIGE_ANALYSE_VORGABE_V18.5.1.md` | Eigenständige Entscheidungsfindung | ⭐⭐⭐ |
| `MYDISPATCH_AI_AGENT_META_PROMPT_V18.5.1.md` | Agent-Identität & Workflow | ⭐⭐⭐ |
| `NEXIFY_WORKFLOW_PROMPT_V19.0.0.md` | 3-Phasen-Workflow | ⭐⭐⭐ |
| `QUALITAETS_STANDARDS_V18.5.0.md` | Quality Gates | ⭐⭐⭐ |

## 12.2 Design & CI Docs

| Dokument | Zweck | Priorität |
|----------|-------|-----------|
| `PRICING_DESIGN_SYSTEM_V26.0.md` | Design-System (KERNFARBEN, etc.) | ⭐⭐⭐ |
| `V26_COMPONENT_LIBRARY.md` | Wiederverwendbare Komponenten | ⭐⭐⭐ |
| `TYPOGRAPHY_SYSTEM_V26.md` | Schriftarten & Größen | ⭐⭐ |
| `SPACING_SYSTEM_V18.5.1.md` | Abstände & Layout | ⭐⭐ |
| `TEXT_ALIGNMENT_SYSTEM_V26.0.md` | Text-Ausrichtungs-Regel | ⭐⭐ |
| `CONTENT_WRITING_STANDARDS_V26.0.md` | Content-Regeln | ⭐⭐ |
| `KOMMUNIKATION_TONALITY_V19.0.0.md` | Tone of Voice | ⭐⭐⭐ |
| `SYSTEM_DESIGN_PRINCIPLES_V18.5.0.md` | Link-Styles, etc. | ⭐⭐ |

## 12.3 Architecture Docs

| Dokument | Zweck | Priorität |
|----------|-------|-----------|
| `FRONTEND_ARCHITECTURE_V18.5.1.md` | Frontend-Struktur | ⭐⭐⭐ |
| `BACKEND_FRONTEND_INTEGRATION_V18.5.1.md` | Integration | ⭐⭐⭐ |
| `ROUTING_SYSTEM_V18.5.1.md` | Routing & Navigation | ⭐⭐ |

## 12.4 Error & Fix Docs

| Dokument | Zweck |
|----------|-------|
| `SPRINT_43_HERO_FINAL_FIX.md` | Hero-Section Fixes |
| `ERROR_REPORT_BADGE_FINAL_V18.5.1.md` | Badge Sizing Fix |
| `LOGO_OVERFLOW_FIX_V18.5.1_COMPLETE.md` | Logo-Overflow Fix |
| `ROUTING_FIX_REPORT_V18.5.1.md` | Routing Issues Fix |

---

# XIII. DEPLOYMENT & OPERATIONS

## 13.1 Build & Deployment

**Platform:** Lovable Cloud (Auto-Deploy bei Git-Push)

**Build Command:** `vite build`

**Output:** `dist/`

**Environment:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

---

## 13.2 Monitoring & Logging

**Supabase Analytics:**
- Auth Logs
- Database Logs
- Edge Function Logs

**Frontend Monitoring:**
- Sentry (Error Tracking)
- Web Vitals (Performance)

---

# XIV. ZUKÜNFTIGE ROADMAP

## 14.1 Nächste Schritte (Q1 2025)

**Prio 1:**
- [ ] Stripe Integration (Payments)
- [ ] E-Mail-System (Transactional)
- [ ] PDF-Generierung (Rechnungen)

**Prio 2:**
- [ ] GPS-Tracking (Business+)
- [ ] HERE Maps (Business+)
- [ ] Weather/Traffic APIs (Business+)

**Prio 3:**
- [ ] Mobile Apps (iOS/Android)
- [ ] Dark Mode (vollständig)
- [ ] Multi-Language

---

## 14.2 Feature-Requests (Backlog)

- [ ] WhatsApp-Integration (Auftrags-Benachrichtigungen)
- [ ] Voice-Dispatch (Sprachbefehle)
- [ ] Predictive Analytics (KI-gestützte Prognosen)
- [ ] Electric Vehicle Management (E-Mobilität)
- [ ] Carbon Footprint Tracking (Nachhaltigkeit)

---

# XV. GLOSSAR & DEFINITIONEN

## 15.1 Technische Begriffe

- **RLS:** Row Level Security (Supabase Sicherheits-Feature)
- **Edge Function:** Serverless Function (Supabase Backend)
- **Realtime:** WebSocket-basierte Live-Updates (Supabase)
- **Soft-Delete:** Logisches Löschen via `archived` Flag (statt physisch)
- **Multi-Tenancy:** Mehrere Unternehmen in einer DB (via `company_id`)
- **Feature-Gating:** Zugriffskontrolle basierend auf Tarif
- **PWA:** Progressive Web App (installierbar auf Mobile)

## 15.2 Business-Begriffe

- **Disposition:** Zentrale Auftrags- und Fahrereinteilung
- **Fuhrpark:** Gesamtheit aller Fahrzeuge eines Unternehmens
- **P-Schein:** Personenbeförderungsschein (Pflicht für Taxifahrer)
- **PBefG:** Personenbeförderungsgesetz
- **TÜV:** Technische Überwachung (Fahrzeugprüfung)
- **Provision:** Prozentuale Vergütung bei Partner-Aufträgen

---

# XVI. KONTAKTE & SUPPORT

## 16.1 Entwicklungs-Team

**NeXify:**
- Inhaber: Pascal
- Rolle: Lead Development & Product Management

## 16.2 MyDispatch Support (Fiktiv)

- E-Mail: support@mydispatch.de
- Telefon: +49 (0) 123 456789
- Web: https://help.mydispatch.de

---

# XVII. CHANGELOG

## Version 1.0.0 (2025-10-26)
- ✅ Initiale Erstellung der Master-Dokumentation
- ✅ Konsolidierung aller bestehenden Dokumentationen
- ✅ Vollständige Feature-Liste aller Tarife
- ✅ Dokumentation aller Dashboard-Funktionalitäten
- ✅ Formular-Strukturen dokumentiert
- ✅ Workflows dokumentiert
- ✅ Design-System V26.0 integriert
- ✅ Kommunikations-Standards integriert
- ✅ Text-Alignment-System integriert
- ✅ Link-System (ohne Underline) integriert
- ✅ Qualitäts-Standards & Testing integriert
- ✅ Soll/Ist-Struktur erstellt

---

**STATUS:** 🔒 PRODUCTION-LOCKED  
**ÄNDERUNGEN:** Nur mit Freigabe von Pascal!  
**NÄCHSTE REVISION:** 2025-11-26 oder bei Major Changes

---

**Erstellt von:** NeXify AI Agent  
**Basierend auf:** NEXIFY MASTER-GOVERNANCE PROMPT V4.0  
**Referenz-Dokumente:** 25+ Governance-, Design- und Architektur-Dokumente
