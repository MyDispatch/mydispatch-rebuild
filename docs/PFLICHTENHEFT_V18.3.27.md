# 📘 SYSTEMWEITES PFLICHTENHEFT - MyDispatch System

**Version:** 18.3.27  
**Status:** Aktiv, Verbindlich  
**Letzte Aktualisierung:** 2025-10-21  
**Kategorie:** Corporate Standard Requirements Specification

---

## 1. PROJEKTÜBERSICHT

### 1.1 Systembeschreibung

**MyDispatch** ist ein vollständiges Transport-Management-System (TMS) für Logistikunternehmen zur Verwaltung von Aufträgen, Fahrzeugen, Fahrern, Kunden und Finanzen.

### 1.2 Systemarchitektur

- **Frontend:** React 18.3+ mit TypeScript
- **Styling:** Tailwind CSS mit Custom Design System
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **State Management:** TanStack Query (React Query)
- **Routing:** React Router v6
- **UI-Komponenten:** Radix UI (Labary-System)

### 1.3 Deployment

- **Development:** Lovable Cloud Preview
- **Production:** Lovable Cloud Deploy
- **Database:** Lovable Cloud (Supabase)

---

## 2. FUNKTIONALE ANFORDERUNGEN

### 2.1 Benutzerverwaltung & Authentifizierung

#### F-AUTH-001: Benutzerregistrierung

- Email/Passwort-basierte Registrierung
- Auto-Confirm Email aktiviert (Development)
- Company-ID Zuordnung bei Registrierung
- Profile-Erstellung mit Metadaten

#### F-AUTH-002: Benutzeranmeldung

- Email/Passwort-Login
- Session-Management via Supabase Auth
- Remember-Me-Funktion
- Password-Reset-Flow

#### F-AUTH-003: Rollensystem

- **Rollen:**
  - `admin`: Volle System-Rechte
  - `dispatcher`: Auftrags- & Fahrer-Management
  - `accountant`: Finanz- & Rechnungsverwaltung
  - `driver`: Fahrer-App-Zugriff
  - `customer`: Kunden-Portal-Zugriff

#### F-AUTH-004: Multi-Tenancy

- Strikte Datentrennung via `company_id`
- Alle Queries filtern nach `company_id`
- RLS Policies erzwingen Company-Isolation

### 2.2 Dashboard & Übersichten

#### F-DASH-001: Hauptdashboard (DashboardV18_3)

- **KPIs:**
  - Aktive Aufträge (Heute/Gesamt)
  - Offene Rechnungen (Betrag/Anzahl)
  - Verfügbare Fahrer
  - Wartende Dokumente
- **Visualisierungen:**
  - Umsatz-Chart (Balken)
  - Auftrags-Status-Verteilung (Donut)
  - Letzte Aktivitäten (Timeline)

#### F-DASH-002: Dokument-Ablauf-Dashboard

- Ablaufende Dokumente (30/60/90 Tage)
- Filterfunktion nach Typ
- Sortierung nach Ablaufdatum
- Archivierte Dokumente ausblenden

#### F-DASH-003: Statistiken

- Echtzeit-Updates via Supabase Functions
- Materialized Views für Performance
- Company-ID-Filter auf allen Stats

### 2.3 Auftragsverwaltung

#### F-ORDER-001: Auftragserfassung

- **Pflichtfelder:**
  - Auftragsnummer (auto-generiert)
  - Kunde (Dropdown)
  - Abhol-/Lieferadresse
  - Datum & Uhrzeit
  - Frachttyp
- **Optionale Felder:**
  - Notizen
  - Gewicht
  - Volumen
  - Referenznummer

#### F-ORDER-002: Auftragsübersicht

- Tabellenansicht mit StandardTableTemplate
- Filter: Status, Datum, Kunde, Fahrer
- Suche: Auftragsnummer, Adresse
- Sortierung: Datum, Status, Betrag
- Bulk-Selection für Massenaktionen

#### F-ORDER-003: Auftragsstatus

- **Status-Workflow:**
  1. `pending` → Neu erstellt
  2. `confirmed` → Bestätigt
  3. `assigned` → Fahrer zugewiesen
  4. `in_transit` → Unterwegs
  5. `delivered` → Zugestellt
  6. `cancelled` → Storniert

#### F-ORDER-004: Auftragszuweisung

- Fahrer-Auswahl via Dropdown
- Automatische Benachrichtigung an Fahrer
- Status-Update auf `assigned`
- Fahrzeug-Zuweisung optional

#### F-ORDER-005: Auftragsdetails

- EnhancedDetailDialog mit Action-Set "Booking"
- Aktionen: Bearbeiten, PDF, Email, Archivieren
- Related Entities: Kunde, Fahrer, Rechnung
- Dokumente & Notizen

### 2.4 Kunden-Management

#### F-CUST-001: Kundenerfassung

- **Pflichtfelder:**
  - Name
  - Email ODER Telefon
  - Adresse
- **Optionale Felder:**
  - Firmenname
  - USt-ID
  - Zahlungsbedingungen
  - Notizen

#### F-CUST-002: Kundenübersicht

- StandardTableTemplate
- Filter: Status, Region
- Suche: Name, Email, Firma
- Sortierung: Name, Erstelldatum

#### F-CUST-003: Kundendetails

- EnhancedDetailDialog
- Related Entities: Aufträge, Rechnungen
- Kommunikationshistorie
- Dokumente

#### F-CUST-004: Kundenkategorien

- B2B / B2C Klassifizierung
- VIP-Status
- Zahlungskonditionen-Kategorien

### 2.5 Fahrer-Management

#### F-DRIVER-001: Fahrererfassung

- **Pflichtfelder:**
  - Vorname, Nachname
  - Email
  - Führerscheinnummer
  - Führerscheinklasse
  - Ablaufdatum Führerschein
- **Optionale Felder:**
  - Telefon
  - Adresse
  - Notizen

#### F-DRIVER-002: Fahrerübersicht

- Tab-Navigation: Aktive / Archivierte
- StandardTableTemplate
- Filter: Status, Qualifikation
- Detail-Button am Zeilenende

#### F-DRIVER-003: Fahrerdetails

- EnhancedDetailDialog mit Action-Set "Driver"
- Dokumenten-Management (Führerschein, ADR, etc.)
- Zugewiesene Aufträge
- Fahrzeug-Zuordnung
- Verfügbarkeitsstatus

#### F-DRIVER-004: Dokument-Ablauf-Tracking

- Automatische Warnung bei Ablauf <30 Tage
- Status-Indikator (Grün/Gelb/Rot)
- Erinnerungs-Funktion

### 2.6 Fahrzeug-Management

#### F-VEHICLE-001: Fahrzeugerfassung

- **Pflichtfelder:**
  - Kennzeichen
  - Fahrzeugtyp
  - TÜV-Ablauf
  - Versicherung-Ablauf
- **Optionale Felder:**
  - Hersteller, Modell
  - Baujahr
  - Ladekapazität
  - GPS-Tracker-ID

#### F-VEHICLE-002: Fahrzeugübersicht

- Tab-Navigation: Aktive / Archivierte
- StandardTableTemplate
- Filter: Typ, Verfügbarkeit
- Detail-Button am Zeilenende

#### F-VEHICLE-003: Fahrzeugdetails

- EnhancedDetailDialog mit Action-Set "Vehicle"
- Dokumenten-Management (TÜV, Versicherung, etc.)
- Wartungshistorie
- Zugewiesener Fahrer
- GPS-Tracking-Integration (optional)

#### F-VEHICLE-004: Wartungsplanung

- Regelmäßige Wartungsintervalle
- Automatische Erinnerungen
- Wartungskosten-Tracking

### 2.7 Finanz-Management

#### F-FIN-001: Rechnungserstellung

- Manuelle Rechnungserstellung
- Automatische Rechnungserstellung aus Auftrag
- Rechnungsnummer (auto-generiert)
- Mehrwertsteuer-Berechnung (19% / 7% / 0%)

#### F-FIN-002: Rechnungsübersicht

- Tab-Navigation: Rechnungen / Angebote / Gutschriften
- StandardTableTemplate
- Filter: Status, Datum, Kunde
- Suche: Rechnungsnummer, Kunde
- Bulk-Export (PDF, CSV)

#### F-FIN-003: Rechnungsdetails

- EnhancedDetailDialog mit Action-Set "Invoice"
- Aktionen: PDF, Email, Mahnung, Storno
- Zahlungsstatus-Tracking
- Related Entities: Kunde, Auftrag

#### F-FIN-004: Zahlungsverfolgung

- Status: Offen / Bezahlt / Überfällig / Storniert
- Automatische Mahnstufen
- Zahlungseingangs-Buchung
- Zahlungserinnerungen

#### F-FIN-005: Kostenstellen

- Kategorisierung von Ausgaben
- Budget-Tracking pro Kostenstelle
- Reports & Auswertungen

#### F-FIN-006: Dashboard

- Offene Forderungen (Gesamt)
- Überfällige Rechnungen
- Umsatz (Monat/Jahr)
- Top-Kunden nach Umsatz

### 2.8 Dokument-Management

#### F-DOC-001: Dokumenten-Upload

- Dateitypen: PDF, JPG, PNG, DOCX
- Max. Dateigröße: 10 MB
- Automatische Thumbnail-Generierung

#### F-DOC-002: Dokumenten-Kategorien

- Führerscheine
- TÜV-Bescheinigungen
- Versicherungen
- ADR-Scheine
- Frachtpapiere
- Rechnungsbelege

#### F-DOC-003: Dokumenten-Ablauf

- Ablaufdatum-Tracking
- Automatische Benachrichtigungen
- Status-Indikatoren
- Filter nach Ablauf-Status

#### F-DOC-004: Archivierung

- Soft-Delete (is_archived Flag)
- Archiv-Ansicht
- Wiederherstellungs-Funktion

### 2.9 Kommunikation

#### F-COMM-001: AI-Support-Chat

- Integrierter Chat-Bot
- Kontext-basierte Antworten
- Ticket-Erstellung aus Chat
- Chat-Historie

#### F-COMM-002: Email-Versand

- Rechnungs-Versand per Email
- Auftragsbestätigungen
- Erinnerungen & Mahnungen
- Template-basiert

#### F-COMM-003: Benachrichtigungen

- In-App-Benachrichtigungen
- Toast-Nachrichten
- Ablauf-Warnungen
- Status-Updates

### 2.10 Fahrer-App

#### F-APP-001: Fahrer-Login

- Separate Fahrer-Auth
- QR-Code-Login (optional)
- Biometrische Authentifizierung (optional)

#### F-APP-002: Fahrer-Dashboard

- Heutige Aufträge
- Auftragsstatus-Update
- Navigation zu Adressen
- Foto-Upload (POD - Proof of Delivery)

#### F-APP-003: Auftragsliste

- Zugewiesene Aufträge
- Filter: Heute / Anstehend / Abgeschlossen
- Sortierung: Zeit, Priorität

#### F-APP-004: Auftragsdetails

- Abhol-/Lieferadresse
- Kontaktdaten
- Frachtdetails
- Notizen
- Navigation-Integration

#### F-APP-005: Status-Updates

- Status-Änderung per Button
- Foto-Upload bei Zustellung
- Unterschrift-Capture (optional)
- GPS-Position-Logging

### 2.11 Kunden-Portal

#### F-PORTAL-001: Kunden-Login

- Separate Kunden-Auth
- Password-Reset
- Session-Management

#### F-PORTAL-002: Auftragsübersicht

- Eigene Aufträge anzeigen
- Filter: Status, Datum
- Tracking-Link (optional)

#### F-PORTAL-003: Auftragserstellung

- Self-Service Auftragserfassung
- Adress-Validierung
- Sofortpreis-Kalkulation (optional)

#### F-PORTAL-004: Rechnungen

- Rechnungsübersicht
- Download als PDF
- Zahlungsstatus

---

## 3. NICHT-FUNKTIONALE ANFORDERUNGEN

### 3.1 Performance

#### NF-PERF-001: Ladezeiten

- Initiales Laden: <2s
- Navigation zwischen Seiten: <500ms
- API-Response: <1s (95. Perzentil)

#### NF-PERF-002: Datenbankoptimierung

- Materialized Views für Dashboards
- Indizes auf alle Foreign Keys
- Query-Performance-Monitoring

#### NF-PERF-003: Caching

- TanStack Query Cache: 5 Min
- Supabase Connection Pooling
- Browser-Cache für Static Assets

### 3.2 Sicherheit

#### NF-SEC-001: Authentifizierung

- Passwort-Mindestlänge: 8 Zeichen
- Password-Hashing via Supabase Auth
- Session-Timeout: 24h
- Auto-Logout bei Inaktivität: 30 Min

#### NF-SEC-002: Autorisierung

- RLS Policies auf allen Tabellen
- Company-ID-Filter auf alle Queries
- Rollenbasierte Zugriffskontrollen
- API-Key-Management für Integrations

#### NF-SEC-003: Datenschutz

- DSGVO-Konformität
- Soft-Delete (keine Hard-Deletes)
- Daten-Archivierung nach 7 Jahren
- Audit-Logs für kritische Aktionen

#### NF-SEC-004: Input-Validierung

- Zod-Schemas für alle Forms
- SQL-Injection-Prevention (Supabase RLS)
- XSS-Prevention (React Escaping)
- CSRF-Protection (Supabase)

### 3.3 Usability

#### NF-UX-001: Responsive Design

- Mobile-First Approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch-Targets: min-h-[44px]
- Keine horizontalen Scrolls

#### NF-UX-002: Accessibility

- WCAG 2.1 Level AA
- Keyboard-Navigation
- Screen-Reader-Support
- Kontrast-Verhältnis >4.5:1

#### NF-UX-003: Internationalisierung

- Deutsche UI (Primary)
- Datum/Zeit-Formate: DE (DD.MM.YYYY)
- Währung: EUR
- Vorbereitung für i18n (optional)

#### NF-UX-004: Error-Handling

- Benutzerfreundliche Fehlermeldungen
- Toast-Notifications
- Fallback-UIs bei Fehlern
- Offline-Detection

### 3.4 Wartbarkeit

#### NF-MAINT-001: Code-Qualität

- TypeScript Strict Mode
- ESLint + Prettier
- 0 TypeScript Errors
- Komponenten <300 Zeilen

#### NF-MAINT-002: Dokumentation

- JSDoc für komplexe Funktionen
- README für jedes Modul
- Seitendokumentation (Phase 3B)
- Pflichtenheft (dieses Dokument)

#### NF-MAINT-003: Testing

- Unit-Tests für Utils
- Integration-Tests für kritische Flows
- E2E-Tests für Happy-Paths
- Test-Coverage >80% (Ziel)

#### NF-MAINT-004: Versionierung

- Git-basiert
- Semantic Versioning
- Changelog
- Feature-Branches

### 3.5 Skalierbarkeit

#### NF-SCAL-001: Datenbank

- Horizontal Scaling via Supabase
- Connection Pooling
- Partitioning bei >1M Rows (optional)

#### NF-SCAL-002: Backend

- Serverless Edge Functions
- Auto-Scaling via Supabase
- Rate-Limiting

#### NF-SCAL-003: Frontend

- Code-Splitting
- Lazy-Loading für Routes
- Image-Optimization
- CDN für Static Assets

---

## 4. DATENMODELL

### 4.1 Haupttabellen

#### profiles

- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `company_id` (uuid, FK → companies)
- `role` (text)
- `first_name` (text)
- `last_name` (text)
- `created_at` (timestamp)

#### companies

- `id` (uuid, PK)
- `name` (text)
- `slug` (text, unique)
- `status` (text)
- `created_at` (timestamp)

#### bookings (Aufträge)

- `id` (uuid, PK)
- `company_id` (uuid, FK)
- `booking_number` (text, unique)
- `customer_id` (uuid, FK)
- `driver_id` (uuid, FK, nullable)
- `status` (text)
- `pickup_address` (text)
- `delivery_address` (text)
- `pickup_date` (timestamp)
- `total_price` (numeric)
- `created_at` (timestamp)

#### customers (Kunden)

- `id` (uuid, PK)
- `company_id` (uuid, FK)
- `name` (text)
- `email` (text)
- `phone` (text)
- `address` (text)
- `is_archived` (boolean)
- `created_at` (timestamp)

#### drivers (Fahrer)

- `id` (uuid, PK)
- `company_id` (uuid, FK)
- `first_name` (text)
- `last_name` (text)
- `email` (text)
- `license_number` (text)
- `license_expiry` (date)
- `status` (text)
- `is_archived` (boolean)
- `created_at` (timestamp)

#### vehicles (Fahrzeuge)

- `id` (uuid, PK)
- `company_id` (uuid, FK)
- `license_plate` (text)
- `type` (text)
- `tuv_expiry` (date)
- `insurance_expiry` (date)
- `is_archived` (boolean)
- `created_at` (timestamp)

#### invoices (Rechnungen)

- `id` (uuid, PK)
- `company_id` (uuid, FK)
- `invoice_number` (text, unique)
- `customer_id` (uuid, FK)
- `booking_id` (uuid, FK, nullable)
- `type` (text) -- 'invoice', 'quote', 'credit_note'
- `status` (text)
- `total_amount` (numeric)
- `due_date` (date)
- `created_at` (timestamp)

#### documents (Dokumente)

- `id` (uuid, PK)
- `company_id` (uuid, FK)
- `entity_type` (text) -- 'driver', 'vehicle', 'booking'
- `entity_id` (uuid)
- `type` (text)
- `file_url` (text)
- `expire_at` (date, nullable)
- `is_archived` (boolean)
- `created_at` (timestamp)

### 4.2 Views & Materialized Views

#### dashboard_stats (MV)

- `company_id` (uuid)
- `active_bookings_today` (int)
- `total_active_bookings` (int)
- `open_invoices_count` (int)
- `open_invoices_amount` (numeric)
- `available_drivers` (int)
- `pending_documents` (int)

#### mv_document_expiry_dashboard (MV)

- Ablaufende Dokumente gruppiert nach Zeitfenstern

#### v_all_expiring_documents (View)

- Vereinheitlichte Sicht auf alle ablaufenden Dokumente

### 4.3 Functions

#### get_dashboard_stats(p_company_id uuid)

- Security Definer Function
- Liefert Dashboard-KPIs

#### get_document_expiry_dashboard(p_company_id uuid)

- Security Definer Function
- Liefert Dokument-Ablauf-Daten

#### get_expiring_documents(p_company_id uuid)

- Security Definer Function
- Liefert alle ablaufenden Dokumente

---

## 5. UI/UX DESIGN-SYSTEM

### 5.1 Farbschema (Semantic Tokens)

#### Light Mode

- `background`: hsl(0 0% 100%)
- `foreground`: hsl(222.2 84% 4.9%)
- `primary`: hsl(222.2 47.4% 11.2%)
- `primary-foreground`: hsl(210 40% 98%)
- `secondary`: hsl(210 40% 96.1%)
- `secondary-foreground`: hsl(222.2 47.4% 11.2%)
- `muted`: hsl(210 40% 96.1%)
- `muted-foreground`: hsl(215.4 16.3% 46.9%)
- `border`: hsl(214.3 31.8% 91.4%)
- `card`: hsl(0 0% 100%)
- `card-foreground`: hsl(222.2 84% 4.9%)

#### Dark Mode

- `background`: hsl(222.2 84% 4.9%)
- `foreground`: hsl(210 40% 98%)
- `primary`: hsl(210 40% 98%)
- `primary-foreground`: hsl(222.2 47.4% 11.2%)
- `secondary`: hsl(217.2 32.6% 17.5%)
- `secondary-foreground`: hsl(210 40% 98%)
- `muted`: hsl(217.2 32.6% 17.5%)
- `muted-foreground`: hsl(215 20.2% 65.1%)
- `border`: hsl(217.2 32.6% 17.5%)
- `card`: hsl(222.2 84% 4.9%)
- `card-foreground`: hsl(210 40% 98%)

#### Status Colors

- `status-success`: hsl(142.1 76.2% 36.3%)
- `status-warning`: hsl(38 92% 50%)
- `status-error`: hsl(0 84.2% 60.2%)
- `status-info`: hsl(221.2 83.2% 53.3%)

### 5.2 Typografie

- **Font-Family:** Inter (System-UI Fallback)
- **Base-Size:** 16px
- **Scale:** text-xs (12px), text-sm (14px), text-base (16px), text-lg (18px), text-xl (20px)
- **Weight:** font-normal (400), font-medium (500), font-semibold (600), font-bold (700)

### 5.3 Spacing

- **Base:** 4px
- **Scale:** 0, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24 (rem)

### 5.4 Komponenten

#### StandardTableTemplate

- Einheitliche Tabellenstruktur
- Detail-Button am Zeilenende
- Bulk-Selection Support
- Rechtskonforme Zeitstempel (created_at)

#### EnhancedDetailDialog

- Alle Aktionen im PopUp
- Vordefinierte Action-Sets
- Related Entities Integration
- Doppelte Bestätigung für kritische Aktionen

#### Buttons

- Varianten: default, secondary, outline, ghost, destructive
- Größen: sm (h-9), default (h-10), lg (h-11)
- Touch-Targets: min-h-[44px] auf Mobile

#### Forms

- Zod-basierte Validation
- React Hook Form
- Error-States
- Accessible Labels

---

## 6. QUALITÄTSSICHERUNG

### 6.1 Testing-Strategie

#### Unit-Tests

- Utils (format-utils, validation-utils)
- Helpers
- Isolated Functions

#### Integration-Tests

- Form-Submissions
- API-Calls
- State-Management

#### E2E-Tests

- Auftragserstellung (Ende-zu-Ende)
- Rechnungserstellung & Versand
- Fahrer-Zuweisung

### 6.2 Code-Review

- Peer-Review für alle Features
- Design-System Compliance Check
- Security-Review für Backend-Änderungen
- Performance-Review bei DB-Änderungen

### 6.3 Quality Gates

- 0 TypeScript Errors
- 0 ESLint Errors
- 0 Design-System Violations
- 0 Security Violations
- 100% Critical Path Coverage (E2E)

---

## 7. DEPLOYMENT & BETRIEB

### 7.1 Deployment-Strategie

- **Development:** Lovable Cloud Preview (Auto-Deploy bei Commit)
- **Staging:** Lovable Cloud Deploy (Manual Trigger)
- **Production:** Lovable Cloud Deploy (Manual Trigger nach QA)

### 7.2 Monitoring

- **Application Monitoring:** Sentry
- **Database Monitoring:** Supabase Analytics
- **Uptime Monitoring:** Lovable Cloud
- **Error-Tracking:** Agent Debug System

### 7.3 Backup & Recovery

- **Database Backup:** Daily (Supabase)
- **Retention:** 30 Tage
- **Recovery-Time-Objective (RTO):** <1h
- **Recovery-Point-Objective (RPO):** <24h

### 7.4 Incident-Management

- **Severity-Levels:**
  - **Critical:** System down, Datenverlust
  - **High:** Feature nicht verfügbar
  - **Medium:** Performance-Probleme
  - **Low:** UI-Bug, keine Funktionseinschränkung

- **Response-Times:**
  - Critical: <15 Min
  - High: <1h
  - Medium: <4h
  - Low: <24h

---

## 8. ROADMAP & ZUKÜNFTIGE FEATURES

### Phase 1 (Q1 2025) - ABGESCHLOSSEN

- ✅ Core-System (Auth, Dashboard, CRUD)
- ✅ Design-System Migration (V18.3.24)
- ✅ Template-System (V18.3)
- ✅ Security-Audit (V18.3.25)

### Phase 2 (Q2 2025) - IN ARBEIT

- 🔄 Seitendokumentation (Phase 3B)
- 🔄 Pflichtenheft (Phase 3C)
- 🔄 Mobile-App-Optimization
- 🔄 Performance-Tuning

### Phase 3 (Q3 2025) - GEPLANT

- 📋 GPS-Tracking-Integration
- 📋 Automatische Routenplanung
- 📋 WhatsApp-Integration für Notifications
- 📋 Preiskalkulations-Engine

### Phase 4 (Q4 2025) - VISION

- 📋 Machine-Learning für Auftragsprognosen
- 📋 Multi-Language Support (EN, FR, PL)
- 📋 Mobile-App (React Native)
- 📋 API für Drittsysteme

---

## 9. ANHANG

### 9.1 Glossar

- **Booking:** Auftrag, Transport-Order
- **POD:** Proof of Delivery (Zustellnachweis)
- **RLS:** Row Level Security (Supabase)
- **TMS:** Transport Management System
- **MV:** Materialized View
- **Labary:** Interne Bezeichnung für das UI-Komponentensystem

### 9.2 Referenzen

- [Supabase Dokumentation](https://supabase.com/docs)
- [React Dokumentation](https://react.dev)
- [Tailwind CSS Dokumentation](https://tailwindcss.com/docs)
- [Radix UI Dokumentation](https://www.radix-ui.com/docs)

### 9.3 Änderungshistorie

| Version | Datum      | Änderung            | Autor    |
| ------- | ---------- | ------------------- | -------- |
| 18.3.27 | 2025-10-21 | Initiale Erstellung | AI Agent |

---

**Ende des Pflichtenhefts**

**Version:** V18.3.27  
**Status:** AKTIV - VERBINDLICH  
**Kategorie:** Corporate Standard Requirements Specification
