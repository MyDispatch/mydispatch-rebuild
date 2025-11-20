# FEHLENDE KOMPONENTEN - VOLLSTÄNDIGE ANALYSE V18.5.0

> **Version:** 18.5.0  
> **Status:** ⚠️ WORK IN PROGRESS  
> **Zweck:** Identifikation aller noch fehlenden Komponenten für MyDispatch

---

## 🎯 ÜBERSICHT

Nach Analyse der bestehenden Dokumentation wurden folgende **kritische Lücken** identifiziert:

---

## 📋 KATEGORIE 1: SEITEN-SPEZIFIKATIONEN (HOCH PRIORITÄT)

### **A. AUFTRÄGE (Bookings)**

**Fehlt:**
- `AUFTRAEGE_SPEZIFIKATION_V18.5.0.md`

**Benötigt:**
```markdown
1. Auftragsübersicht
   - DataTable mit Filtern (Status, Datum, Fahrer, Kunde)
   - Spalten: ID, Datum, Zeit, Kunde, Abholung, Ziel, Fahrer, Status, Preis
   - Actions: Details, Bearbeiten, Stornieren, PDF

2. Neue Buchung (Multi-Step-Formular)
   - Step 1: Kunde auswählen/anlegen (Inline-Create)
   - Step 2: Abhol- & Zieladresse (HERE Autocomplete)
   - Step 3: Datum & Zeit, Fahrzeugtyp
   - Step 4: Zusatzleistungen (Kindersitz, Gepäck, etc.)
   - Step 5: Preis-Kalkulation (basierend auf HERE Distance)
   - Step 6: Fahrer-Zuweisung (manuell oder automatisch)
   - Step 7: Zusammenfassung & Bestätigung

3. Auftrags-Details (Sidebar oder Modal)
   - Vollständige Buchungsinformationen
   - Status-Historie
   - Rechnungs-Link
   - Fahrer-Kommunikation (Chat ab Business+)
   - Live-Tracking (ab Business+)

4. Auftrags-Bearbeitung
   - Status ändern (geplant → in Bearbeitung → abgeschlossen)
   - Fahrer neu zuweisen
   - Zeit/Adresse ändern
   - Stornieren (mit Stornierungsgrund)
```

---

### **B. FAHRER (Drivers)**

**Fehlt:**
- `FAHRER_SPEZIFIKATION_V18.5.0.md`

**Benötigt:**
```markdown
1. Fahrerübersicht
   - DataTable mit Status-Ampel (verfügbar, im Einsatz, offline)
   - Spalten: Name, Status, Aktueller Auftrag, Fahrzeug, Telefon, E-Mail
   - Actions: Details, Bearbeiten, Deaktivieren, Schichtplan

2. Fahrer-Details
   - Persönliche Daten
   - Dokumente (Führerschein, Taxischein, Gesundheitszeugnis)
   - Fahrzeug-Zuweisung
   - Statistiken (Aufträge heute/Woche/Monat, Umsatz, Kundenbewertungen)
   - Schichtplan

3. Fahrer-Formular
   - Anrede (Herr/Frau/Divers)
   - Vorname, Nachname
   - E-Mail, Telefon
   - Adresse (Straße, PLZ, Stadt, Land)
   - Dokumente-Upload (Drag & Drop, max 5MB pro Datei)
   - Fahrzeug-Auswahl (Dropdown)
   - Notizen

4. Schichtplanung
   - Kalender-Ansicht (Woche/Monat)
   - Schichten anlegen (Start, Ende, Pausen)
   - Verfügbarkeiten markieren
   - Urlaub/Krankheit eintragen
```

---

### **C. KUNDEN (Customers)**

**Fehlt:**
- `KUNDEN_SPEZIFIKATION_V18.5.0.md`

**Benötigt:**
```markdown
1. Kundenübersicht
   - DataTable mit Filtern (Typ: Privat/Geschäft, Status, Letzte Buchung)
   - Spalten: Name, E-Mail, Telefon, Letzte Buchung, Gesamt-Umsatz, Actions
   - Quick-Actions: Neue Buchung für Kunde, Details, Bearbeiten

2. Kunden-Details
   - Persönliche Daten
   - Buchungs-Historie (letzten 10 Aufträge)
   - Zahlungs-Historie (offene/bezahlte Rechnungen)
   - Notizen
   - Statistiken (Gesamt-Umsatz, Durchschnittspreis, Kundenwert)

3. Kunden-Formular (Full-Create)
   - Typ (Privat/Geschäft)
   - Anrede, Vorname, Nachname
   - Firma (nur bei Geschäftskunden)
   - E-Mail, Telefon
   - Adresse (Standard-Abholadresse)
   - Zahlungsmethode (Bar, Rechnung, Kartenzahlung)
   - Kunden-Portal-Zugang (ab Business+)

4. Inline-Kundenanlage (Quick-Create im Booking-Formular)
   - Anrede, Vorname, Nachname
   - E-Mail, Telefon
   - → Vollständige Daten später ergänzen
```

---

### **D. RECHNUNGEN (Invoices)**

**Fehlt:**
- `RECHNUNGEN_SPEZIFIKATION_V18.5.0.md`

**Benötigt:**
```markdown
1. Rechnungsübersicht
   - DataTable mit Filtern (Status: Offen/Bezahlt/Überfällig, Zeitraum)
   - Spalten: Nr., Datum, Kunde, Betrag, Status, Fällig am, Actions
   - Quick-Actions: PDF-Download, Bezahlt markieren, Mahnung senden

2. Rechnungs-Details
   - Rechnungskopf (Eigene Firma, Kunde)
   - Positionen (Aufträge mit Einzelpreisen)
   - Summe (Netto, MwSt., Brutto)
   - Zahlungsinformationen (IBAN, Verwendungszweck)
   - Zahlungs-Historie

3. PDF-Generierung
   - Template: DIN 5008 konform
   - Logo, Firmendaten
   - Rechnungsnummer (auto-increment)
   - Positionen-Tabelle
   - Fußzeile (Bankverbindung, Steuernummer, etc.)

4. Stripe-Integration (Auto-Payment ab Business+)
   - Automatische Rechnung nach Auftrag
   - Stripe-Checkout-Link in Rechnung
   - Webhook: Rechnung auf "Bezahlt" setzen
```

---

## 📋 KATEGORIE 2: FORMULAR-STANDARDS (HOCH PRIORITÄT)

### **Fehlt:**
- `FORMULAR_STANDARDS_V18.5.0_KORREKT.md`

**Benötigt:**
```markdown
1. Allgemeine Formular-Prinzipien
   - React Hook Form + Zod-Validation
   - Error-Handling (Field-Level + Form-Level)
   - Loading-States während Submit
   - Success-Toast nach erfolgreichem Submit
   - Accessibility (Labels, ARIA-Attributes, Keyboard-Navigation)

2. Standard-Feldtypen
   - Text-Input (FormField)
   - E-Mail-Input (mit Validation)
   - Telefon-Input (mit Format-Mask)
   - Adress-Input (HERE Autocomplete)
   - Date-Picker (react-day-picker)
   - Select/Dropdown (FormSelect)
   - Textarea (FormTextarea)
   - Checkbox (FormCheckbox)
   - File-Upload (Drag & Drop, Vorschau)

3. Feldfolge-Standards
   - Anrede → Vorname → Nachname
   - Straße → Hausnummer → PLZ → Stadt → Land
   - E-Mail → Telefon
   - Start-Datum → End-Datum

4. Validation-Patterns
   - E-Mail: RFC-5322 konform
   - Telefon: +49 (0) 123 456789 oder 0123 456789
   - PLZ: 5 Ziffern (Deutschland)
   - IBAN: DE89 3704 0044 0532 0130 00

5. Multi-Step-Formulare
   - Step-Indicator (Fortschrittsbalken)
   - Zurück-Button (mit State-Persistence)
   - Validation pro Step (nicht erst am Ende!)
   - Zusammenfassung am Ende

6. Code-Beispiele
   - Vollständiges Booking-Form
   - Vollständiges Fahrer-Form
   - Inline-Kunden-Create
```

---

## 📋 KATEGORIE 3: MARKETING-SEITEN (MITTEL PRIORITÄT)

### **Fehlt:**
- `MARKETING_SEITEN_SPEZIFIKATION_V18.5.0.md`

**Benötigt:**
```markdown
1. Hero-Sections (5 Varianten)
   - Variante A: Full-Screen mit Video-Background
   - Variante B: Split-Layout (Text links, Illustration rechts)
   - Variante C: Centered mit CTA-Buttons
   - Variante D: Feature-Cards-Grid
   - Variante E: Animated Stats

2. Feature-Showcase
   - Feature-Carousel (Swiper.js)
   - Feature-Comparison-Table (Basic vs Business+ vs Enterprise)
   - Interactive Demo (Screenshots mit Annotations)

3. Landingpage-Struktur (Unternehmer-Branded-Pages)
   - Route: /:slug (z.B. /nexify)
   - Gebrandetes Design (Logo, Farben, Slogan)
   - Buchungswidget (ab Business+)
   - Kontakt-Formular
   - Öffnungszeiten, Telefon, E-Mail

4. SEO-Optimierung
   - Meta-Tags (Title, Description, Keywords)
   - Structured-Data (Organization, LocalBusiness)
   - Open-Graph-Tags (Facebook, LinkedIn)
   - Twitter-Cards
   - Sitemap-Generator
   - Robots.txt

5. Conversion-Optimierung
   - CTAs (klar, auffällig, action-oriented)
   - Forms (kurz, simpel, mit Validation)
   - Social-Proof (Kundenbewertungen, Logos, Zahlen)
   - Trust-Badges (SSL, DSGVO, TÜV)
```

---

## 📋 KATEGORIE 4: API-DOKUMENTATION (MITTEL PRIORITÄT)

### **Fehlt:**
- `API_DOKUMENTATION_V18.5.0.md` (vollständig)

**Benötigt:**
```markdown
1. Supabase Edge Functions
   - check-subscription (Tarif-Prüfung)
   - create-checkout (Stripe-Checkout-Session)
   - customer-portal (Stripe-Portal-Session)
   - ai-smart-routing (Optimale Route berechnen)
   - ai-demand-forecasting (7-Tage-Prognose)
   - ai-code-review (GitHub CI/CD Integration)
   - ai-search (Intelligente Wissens-Suche)
   - send-booking-confirmation (E-Mail via Resend)

2. HERE APIs
   - Geocode (Adresse → Koordinaten)
   - Reverse-Geocode (Koordinaten → Adresse)
   - Autocomplete (Adress-Suche)
   - Routing (A → B, Multi-Stop)
   - Traffic (Echtzeit-Verkehrslage)
   - Isoline (Erreichbarkeit in X Minuten)

3. OpenWeatherMap API
   - Current-Weather (Live-Wetter)
   - Forecast (5-Tage-Vorhersage)
   - One-Call (Komplette Wetter-Daten)

4. Lovable AI Gateway
   - Modelle (Gemini 2.5 Flash/Pro, GPT-5)
   - Chat-Completions (Standard)
   - Tool-Calling (Structured-Output)
   - Streaming (SSE)

5. World Time API
   - Current-Time (Aktuelle Zeit)
   - Timezone (Zeitzone ermitteln)

6. Resend API
   - Send-Email (Transaktionale E-Mails)
   - Batch-Send (Mehrere E-Mails)
   - Templates (HTML-E-Mail-Templates)
```

---

## 📋 KATEGORIE 5: DATENBANK-SCHEMA (MITTEL PRIORITÄT)

### **Fehlt:**
- `DATENBANK_SCHEMA_V18.5.0.md` (vollständig)

**Benötigt:**
```markdown
1. Tabellen-Übersicht (alle 34 Tabellen)
   - profiles (User-Profile)
   - companies (Mandanten)
   - bookings (Aufträge)
   - drivers (Fahrer)
   - vehicles (Fahrzeuge)
   - customers (Kunden)
   - invoices (Rechnungen)
   - invoice_items (Rechnungspositionen)
   - payments (Zahlungen)
   - documents (Dokumente)
   - shift_plans (Schichtpläne)
   - driver_locations (GPS-Tracking)
   - notifications (Benachrichtigungen)
   - error_logs (Fehler-Logs)
   - knowledge_base (Wissens-Datenbank)
   - code_snippets (Code-Bibliothek)
   - best_practices (Best-Practice-Sammlung)
   - faq (FAQ-Einträge)
   - ... weitere

2. RLS Policies (pro Tarif)
   - Basic: Nur eigene Daten
   - Business: + Team-Zugriff
   - Business+: + erweiterte Features
   - Enterprise: + Multi-Company

3. Materialized Views (Performance-Optimierung)
   - dashboard_stats (KPI-Cards)
   - booking_statistics (Auftrags-Statistiken)
   - driver_performance (Fahrer-Leistung)

4. Trigger & Functions
   - update_updated_at_column() (Auto-Timestamp)
   - soft_delete_booking() (Soft-Delete statt Hard-Delete)
   - calculate_invoice_total() (Rechnungssumme)
   - auto_assign_driver() (Intelligente Fahrer-Zuweisung)

5. Migration-History
   - Changelog aller Migrations
   - Rollback-Scripts
```

---

## 📋 KATEGORIE 6: WORKFLOW-AUTOMATION (NIEDRIG PRIORITÄT)

### **Fehlt:**
- `WORKFLOW_AUTOMATION_V18.5.0.md` (Update)

**Benötigt:**
```markdown
1. N8N Workflows (20+ Workflows)
   - Automatische Fahrer-Zuweisung (Smart-Dispatch)
   - E-Mail-Benachrichtigungen (Buchungsbestätigung, Rechnung)
   - Stripe-Webhook-Handling (Payment-Success, Subscription-Updated)
   - HERE-API-Automation (Route-Caching, Traffic-Updates)
   - AI-Workflows (Gemini-Integration für Demand-Forecasting)

2. Cron-Jobs (Supabase pg_cron)
   - Tägliche Statistik-Generierung (03:00 Uhr)
   - Wöchentliche Reports (Montags 08:00 Uhr)
   - Monatsabschluss (1. des Monats, 00:00 Uhr)
   - Alte Logs löschen (90 Tage Aufbewahrung)

3. Event-Driven-Architecture
   - booking.created → E-Mail senden, Fahrer benachrichtigen
   - booking.completed → Rechnung generieren, Statistik aktualisieren
   - driver.offline → Neu zuweisen, Admin benachrichtigen
```

---

## 📋 KATEGORIE 7: GRAFIK- & DESIGN-VORGABEN (HOCH PRIORITÄT)

### **Fehlt:**
- `GRAFIK_DESIGN_SYSTEM_V18.5.0.md`

**Benötigt:**
```markdown
1. Tailwind-CSS-Grafiken
   - Dashboard-Mockups (mit realen Daten)
   - Auftrags-Formular-Szenarien (Step-by-Step)
   - Fahrer-Portal-Screenshots
   - Mobile-Ansichten (Responsive)

2. Marketing-Grafiken
   - Hero-Images (hochauflösend, professionell)
   - Feature-Illustrations (SVG, interaktiv)
   - Icon-Set (einheitlich, SVG)
   - Logo-Varianten (Light/Dark, Small/Large)

3. Dashboard-Visualisierungen
   - Statistik-Grafiken (Line-Charts, Bar-Charts, Pie-Charts)
   - Heatmaps (Demand-Forecasting)
   - Route-Maps (HERE Maps Integration)
   - Live-Tracking-Karten

4. Animation-Standards
   - Micro-Interactions (Button-Hover, Form-Validation)
   - Page-Transitions (Smooth, nicht abrupt)
   - Loading-Animations (Skeleton-Screens, Spinner)
   - Success-Animations (Confetti, Checkmarks)

5. Export-Formate
   - SVG (für Icons, Logos, Illustrationen)
   - PNG (für Screenshots, Mockups)
   - WebP (für optimierte Web-Bilder)
   - MP4 (für Animations-Demos)
```

---

## 📋 KATEGORIE 8: TESTING & QA (HOCH PRIORITÄT)

### **Fehlt:**
- Test-Cases für alle Features
- Visual-Regression-Tests (Screenshot-Baselines)
- E2E-Test-Szenarien

**Benötigt:**
```markdown
1. Unit-Test-Coverage
   - Alle Utils (format-utils, database-utils, etc.)
   - Alle Custom-Hooks
   - Design-System-Validators

2. Integration-Tests
   - Booking-Flow (End-to-End)
   - Driver-Assignment
   - Invoice-Generation
   - Stripe-Payment-Flow

3. E2E-Tests (Playwright)
   - Login → Dashboard → Neue Buchung → Fahrer zuweisen → Rechnung
   - Fahrer-Portal → Auftrag annehmen → GPS-Tracking → Abschließen
   - Kunden-Portal → Buchung ansehen → Rechnung herunterladen

4. Visual-Regression-Tests
   - Screenshot-Baselines für alle Seiten
   - Desktop (1920x1080)
   - Mobile (375x812)
   - Tablet (768x1024)

5. Performance-Tests
   - Lighthouse-Scores (>90 für alle Seiten)
   - Bundle-Size (<1.5MB)
   - API-Response-Times (<500ms)
```

---

## ✅ PRIORISIERUNG & ZEITPLAN

### **Phase 1 (Woche 1-2): KRITISCH**
1. ✅ AUFTRAEGE_SPEZIFIKATION_V18.5.0.md
2. ✅ FAHRER_SPEZIFIKATION_V18.5.0.md
3. ✅ FORMULAR_STANDARDS_V18.5.0_KORREKT.md

### **Phase 2 (Woche 3-4): HOCH**
4. ✅ KUNDEN_SPEZIFIKATION_V18.5.0.md
5. ✅ RECHNUNGEN_SPEZIFIKATION_V18.5.0.md
6. ✅ GRAFIK_DESIGN_SYSTEM_V18.5.0.md

### **Phase 3 (Woche 5-6): MITTEL**
7. ✅ MARKETING_SEITEN_SPEZIFIKATION_V18.5.0.md
8. ✅ API_DOKUMENTATION_V18.5.0.md (vollständig)
9. ✅ DATENBANK_SCHEMA_V18.5.0.md (vollständig)

### **Phase 4 (Woche 7-8): NIEDRIG**
10. ✅ WORKFLOW_AUTOMATION_V18.5.0.md (Update)
11. ✅ Test-Cases & QA-Dokumentation

---

**Version:** V18.5.0  
**Status:** ⚠️ WORK IN PROGRESS  
**Nächstes Review:** 2025-02-02
