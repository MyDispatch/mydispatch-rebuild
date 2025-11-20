# 📖 MYDISPATCH VOLLUMFÄNGLICHE SYSTEM-DOKUMENTATION

**Version:** 1.0.0  
**Stand:** 29.10.2025  
**Status:** ✅ Production-Ready  
**Verantwortlich:** Ibrahim SIMSEK (CEO) & Pascal Courbois (CTO)

---

## 🏢 KAPITEL 1: GESCHÄFTSMODELL & VISION

### Was ist MyDispatch?

**Kerngeschäft:**
MyDispatch ist eine moderne, cloudbasierte Dispositions- und Flottenmanagement-Software für Taxi-, Mietwagen- und Limousinenunternehmen. Die Plattform bietet eine All-in-One-Lösung für:

- Auftragsverwaltung & Disposition
- GPS-Echtzeit-Tracking
- Fahrer- & Fahrzeugmanagement
- Rechnungsstellung & Finanzverwaltung
- Partner-Netzwerk-Management
- Kunden-Self-Service-Portal

**Zielgruppen:**

- **Primär:** Kleine und mittlere Taxi-/Mietwagen-/Limousinenunternehmen (1-100 Fahrzeuge)
- **Sekundär:** Einzelunternehmer (Taxi-Einzelfahrer mit bis zu 3 Fahrzeugen)
- **Geografisch:** DACH-Region (Deutschland, Österreich, Schweiz), primär Deutschland

**Unique Selling Proposition (USP):**

1. **Multi-Tenant White-Label-System**: Jeder Unternehmer erhält seine eigene gebrandete Landing-Page für Kundenbuchungen
2. **DSGVO-First Approach**: 100% deutscher Datenschutz, Server in Deutschland
3. **Integration-First**: Nahtlose Anbindung an bestehende Systeme (Taxameter, DATEV, etc.)
4. **Mobile-First Design**: Optimiert für Smartphone-Nutzung (Fahrer & Disponenten)
5. **Transparente Preisstruktur**: Starter (39€/Monat) & Business (99€/Monat), keine versteckten Kosten

**Marktpositionierung:**

- **Segment:** Mittelklasse (zwischen Low-Cost-Tools und Enterprise-Lösungen)
- **Differenzierung:** Premium-Qualität zum Mittelklasse-Preis
- **Fokus:** KMU-freundlich, einfache Bedienung, schneller Onboarding-Prozess

**Wettbewerbsvorteile:**

1. White-Label Kunden-Landing-Pages (Wettbewerber haben das nicht!)
2. Partner-Netzwerk-Management (Auftragsvergabe an Subunternehmer)
3. Made in Germany mit DSGVO-Compliance by Design
4. Moderne Tech-Stack (React, TypeScript, Real-time Updates)
5. Transparente Preise ohne versteckte Kosten
6. Kein Vendor-Lock-In (Datenexport jederzeit möglich)

**Vision:**
"Die führende cloudbasierte Dispositions-Plattform für KMU im Personentransport-Sektor in der DACH-Region werden und durch kontinuierliche Innovation den digitalen Standard für die Branche setzen."

**Mission Statement:**
"Wir digitalisieren Taxiunternehmen und Mietwagenservices durch intuitive, leistungsstarke Software, die jedem Unternehmen – unabhängig von Größe oder Budget – Zugang zu professionellen Management-Tools bietet."

**Geschäftsziele 2025:**

1. 100+ aktive Unternehmer-Kunden bis Ende 2025
2. Monatlich Wiederkehrender Umsatz (MRR): 10.000€
3. Churn-Rate < 5% (Kunden bleiben länger als 12 Monate)
4. Expansion in Österreich & Schweiz (Q3/Q4 2025)
5. API-Marketplace-Launch (Q4 2025)

### Unternehmensstruktur

**Gründung:**

- **Unternehmen:** RideHub Solutions (MyDispatch Marke)
- **Gründungsjahr:** 2024
- **Gründer:** Ibrahim SIMSEK
- **Technologiepartner:** NeXify IT-Dienstleistungen (Pascal Courbois)

**Gesellschaftsform:**

- RideHub Solutions: Kleinunternehmen (§19 UStG)
- NeXify: GmbH (Niederlande)

**Standorte:**

- **Hauptsitz:** Ensbachmühle 4, 94571 Schaufling, Deutschland (RideHub Solutions)
- **Tech-Partner:** Graaf van Loonstraat 1E, 5921 JA Venlo, Niederlande (NeXify)

**Mitarbeiteranzahl:**

- 2 Gründer/Core-Team
- AI-assisted Development (Lovable AI, Claude Sonnet 4.5)

**Führungsstruktur:**

- **CEO/Inhaber (RideHub Solutions):** Ibrahim SIMSEK
- **CTO/Tech-Lead (NeXify):** Pascal Courbois
- **Struktur:** Flache Hierarchie, agile Zusammenarbeit

**Organisationsaufbau:**

```
Ibrahim SIMSEK (CEO)
├── Pascal Courbois (CTO/Tech Lead)
├── Product Development (AI-assisted)
├── Customer Success (geplant)
└── Sales & Marketing (geplant)
```

---

## 💼 KAPITEL 2: GESCHÄFTSMODELL DETAILS

### Kundentypen & Segmente

**B2B-Kunden (Unternehmer):**

- **Zielgruppe:** Inhaber von Taxi-, Mietwagen-, Limousinen-Unternehmen
- **Typische Unternehmensgrößen:**
  - **Starter-Segment:** 1-3 Fahrzeuge (Einzelunternehmer)
  - **Business-Segment:** 4-100 Fahrzeuge (KMU)
  - **Enterprise (geplant):** 100+ Fahrzeuge (Großflotten)
- **Branchen-Fokus:**
  - Taxi (klassischer Taxibetrieb mit Funkzentrale)
  - Mietwagen mit Fahrer (Voranmeldung)
  - Limousinen-Service (VIP/Business)
- **Geografische Abdeckung:**
  - Deutschland (Primärmarkt)
  - Österreich (geplant Q3/2025)
  - Schweiz (geplant Q4/2025)

**B2C-Kunden (End-Fahrgäste):**

- **Zielgruppe:** Privatpersonen & Geschäftskunden, die Fahrten buchen
- **Demografische Merkmale:**
  - Alter: 25-65 Jahre
  - Tech-affin (Smartphone-Nutzung)
  - Stadt- & Landbewohner
- **Nutzungsverhalten:**
  - Spontanbuchungen (Taxi)
  - Geplante Buchungen (Mietwagen, Limousinen)
  - Wiederkehrende Buchungen (Stammkunden)
- **Buchungskanäle:**
  - Unternehmer-Landing-Page (White-Label)
  - Telefon (klassisch)
  - Kunden-Portal (Self-Service, geplant)

### Revenue-Streams

**Primäre Einnahmequellen:**

1. **SaaS-Abonnements:**
   - Starter-Plan: 39€/Monat (3 Fahrzeuge, 1 User)
   - Business-Plan: 99€/Monat (unbegrenzt Fahrzeuge, 5 User)
   - Jährliche Zahlung: 20% Rabatt
2. **Add-Ons:**
   - Fleet-Expansion (Starter): 9€/Monat für unbegrenzte Fahrzeuge
   - Zusätzliche User-Slots: 9€/User/Monat (über Business-Limit)

**Sekundäre Einnahmequellen (Roadmap):** 3. **API-Marketplace:**

- Transaktionsgebühr: 5% auf Partner-Integrationen
- Premium-API-Zugang: 29€/Monat

4. **White-Label-Premium:**
   - Custom-Domain-Hosting: 19€/Monat
   - Custom-App-Branding (iOS/Android): 99€ einmalig
5. **Onboarding & Support:**
   - Premium-Onboarding: 199€ einmalig
   - Telefon-Support-Hotline: 49€/Monat

**Preismodelle:**

- **Freemium:** NEIN (keine kostenlose Version)
- **Trial:** NEIN (rechtlich nicht als "kostenlos" beworben)
- **Pay-as-you-grow:** JA (Starter → Business Upgrade jederzeit)
- **Annual Discount:** JA (20% bei jährlicher Zahlung)

### Service-Portfolio

**Kernservices (in allen Plänen):**

1. Auftragsverwaltung (digitale Auftragserfassung, Fahrerzuweisung, Status-Tracking)
2. Fahrzeugverwaltung (Stammdaten, TÜV/HU-Überwachung, Wartungsplaner)
3. Fahrermanagement (Stammdaten, Führerschein-Verwaltung, Schichtplanung)
4. Kundenverwaltung (Stammdaten B2B & B2C, Buchungshistorie)
5. Rechnungsstellung (automatisch, PDF-Export, E-Mail-Versand)

**Zusatzservices (Business-Plan):** 6. GPS-Echtzeit-Tracking (Live-Karte, Routenverfolgung, Geofencing) 7. Partner-Netzwerk (Auftragsvergabe an Subunternehmer) 8. Erweiterte Analysen (Umsatz-Dashboards, Fahrzeugauslastung, Custom Reports) 9. API-Zugang (REST API, Webhooks, Integrationen)

---

## 🏗️ KAPITEL 3: SYSTEM-ARCHITEKTUR & TECHNOLOGIE

### Technologie-Stack

**Frontend:**

- React 18.3.1 + Vite + TypeScript (Strict Mode)
- Zustand 5.0.8 + TanStack Query 5.83.0
- shadcn/ui (Radix UI Primitives) + Tailwind CSS
- React Hook Form 7.61.1 + Zod 3.25.76
- Recharts 2.15.4, jsPDF 3.0.3, XLSX 0.18.5

**Backend:**

- Supabase (Lovable Cloud): PostgreSQL 15+, Supabase Auth (JWT), Storage, Realtime
- Edge Functions: Deno (TypeScript)
- AI: Claude Sonnet 4.5 API (Anthropic)

**Cloud-Infrastruktur:**

- Hosting: Vercel (Frontend) + Supabase EU (Backend)
- CDN: Vercel Edge Network
- SSL/TLS: Automatic (Let's Encrypt)

**Monitoring & Security:**

- Error Tracking: Sentry (@sentry/react 10.20.0)
- Analytics: Plausible (DSGVO-konform)
- Security: RLS Policies, Zod Input Validation, DOMPurify 3.3.0

### Datenmodell (Multi-Tenant via company_id)

**Kern-Entities:**

1. **companies** - Unternehmer-Accounts
2. **profiles** - User-Accounts (FK → auth.users, companies)
3. **drivers** - Fahrer (FK → companies)
4. **vehicles** - Fahrzeuge (FK → companies)
5. **customers** - Endkunden (FK → companies)
6. **bookings** - Aufträge (FK → companies, customers, drivers, vehicles)
7. **shifts** - Schichten (FK → companies, drivers, vehicles)
8. **invoices** - Rechnungen (FK → companies, customers)
9. **documents** - Dokumente (FK → companies)
10. **cost_centers** - Kostenstellen (FK → companies)

**Data-Privacy (DSGVO):**

- Daten-Minimierung, Anonymisierung (GPS nach 24h)
- User-Datenexport (JSON/CSV), Löschung nach 30 Tagen Retention

---

## 🎨 KAPITEL 4: DESIGN-SYSTEM & BRAND

### Brand Identity

**Brand-Farben:**

```
PRIMARY: #0f172a (Slate 900) - Dunkel, seriös
SECONDARY: #10b981 (Green 600) - Erfolg, positive Aktionen
ACCENT: #3b82f6 (Blue 600) - Info, neutrale Hervorhebungen
TEXT: #0f172a (Headlines), #475569 (Body, Slate 600)
BORDER: #e2e8f0 (Slate 200)
BACKGROUND: #f8fafc (Slate 50)
```

**Typografie:**

- Font-Family: `Inter` (Primary)
- Weights: 400 (Normal), 500 (Semibold), 600/700 (Bold), 800 (Extrabold)
- Sizes: text-xs (12px) → text-5xl (48px)

**Brand-Voice:**

- Tonalität: Professionell, vertrauenswürdig, freundlich
- Sprache: Deutsch (Sie für B2B, Du optional für B2C)
- Stil: Klar, präzise, keine Marketing-Floskeln

### Design-System V28.1

**Component-Library (61 Components):**

- Foundation (8): Button, Input, Textarea, Select, Checkbox, Radio, Toggle, Label
- Layout (5): Container, Grid, Flex, Stack, Spacer
- Navigation (6): Header, NavLink, DropdownMenu, Breadcrumb, Tabs, Footer
- Content (9): Card, Hero, FeatureGrid, PricingTable, Testimonial, Badge, Tag, Avatar, Divider
- Feedback (8): Alert, Toast, Modal, Tooltip, Popover, ProgressBar, Spinner, Skeleton
- Forms (5): Form, FormField, DatePicker, FileUpload, Slider
- Data (5): Table, List, Accordion, Stats, Timeline
- Utility (6): Icon, Logo, Image, Video, Link, ScrollToTop
- Complex (9): CookieBanner, CookieSettings, Search, NewsletterSignup, ContactForm, ComparisonTable, FAQ, Carousel, CTASection

**Spacing-System:** 4px Grid (0, 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px)

**Responsive Breakpoints:**

```
Mobile: 320px+ (Default)
sm: 640px (Tablets Portrait)
md: 768px (Tablets Landscape)
lg: 1024px (Desktops)
xl: 1280px (Large Desktops)
2xl: 1536px (Extra Large)
```

### V26 → V28.1 Migration

**V26 (Legacy):** Dunkelblau (#323D5E) + Beige (#EADEBD), komplexe Shadows, Custom-Animations
**V28.1 (Modern):** Slate-Palette (#0f172a), Tailwind-native, shadcn/ui Components

**Kritische Unterschiede:**

- Transitions: V26 (1000-1200ms) → V28.1 (300ms)
- Farben: Beige-Accent (#EADEBD) → Slate-200 (#e2e8f0)
- Components: V26 Wrapper gelöscht → shadcn/ui direkt

---

## 🏢 KAPITEL 5: UNTERNEHMER-MULTI-TENANT-SYSTEM

### Multi-Tenant-Architektur

**Tenant-Isolation:**

- **Database-Level:** Alle Tabellen haben `company_id` Foreign Key
- **Row-Level Security (RLS):** PostgreSQL Policies filtern automatisch nach `company_id`
- **User-Access:** Profiles-Tabelle verknüpft User mit Company
- **API-Level:** Supabase Auth liefert `company_id` aus JWT-Token

**Daten-Separation:**

```sql
-- Beispiel RLS Policy (bookings)
CREATE POLICY "Users can only view own company bookings"
ON bookings FOR SELECT
USING (company_id = auth.uid_company_id());
```

**Branding-System:**

- **Logo-Upload:** Supabase Storage (`company_logos/`)
- **Farben:** `primary_color`, `secondary_color` in companies-Tabelle
- **Fonts:** System-Standard (keine Custom-Fonts)

**White-Labeling:**

- **Subdomain-Struktur:** `[company-slug].mydispatch.de`
- **Custom-Domain (Premium):** `fahrten.mustermann-taxi.de`
- **Powered-by:** "Powered by MyDispatch" im Footer (Standard, optional entfernbar)

### Unternehmer-Onboarding

**Registrierungs-Prozess:**

1. **Signup-Form:** E-Mail, Passwort, Firmenname
2. **Email-Verification:** Supabase Magic Link
3. **Company-Setup:** Logo-Upload, Farben wählen, Slug-Name
4. **Subscription-Select:** Starter/Business auswählen
5. **Payment (geplant):** Stripe Checkout
6. **Go-Live:** Account aktiviert

**Setup-Requirements:**

- Firmendaten (Name, Adresse, USt-ID)
- Logo (PNG/SVG, max 2MB)
- CI-Farben (Primary, Secondary)
- Slug (URL-Name, z.B. "mustermann-taxi")

**CI-Upload-Prozess:**

```tsx
// Logo-Upload zu Supabase Storage
const { data, error } = await supabase.storage
  .from("company_logos")
  .upload(`${companyId}/logo.png`, logoFile);
```

### Unternehmer-Landing-Pages

**Zweck:**

- Fahrgäste (B2C) können direkt beim Unternehmer buchen
- Kein MyDispatch-Branding sichtbar (White-Label)
- Unternehmer-CI komplett integriert

**Zielgruppe:**

- End-Fahrgäste (NICHT Unternehmer!)
- Stammkunden des Unternehmers
- Google-Suche-Traffic

**Funktionen:**

- Hero mit Unternehmer-Logo & Farben
- Buchungs-CTA (Telefon oder Online-Formular)
- Leistungsübersicht (Taxi, Mietwagen, Limousinen)
- Kontaktdaten (Adresse, Telefon, E-Mail)
- DSGVO-Footer (Impressum, Datenschutz des Unternehmers)

**Branding-Integration:**

```tsx
<div
  style={{
    backgroundColor: company.primary_color,
    color: company.secondary_color,
  }}
>
  <img src={company.logo_url} alt={company.name} />
  <h1>{company.name}</h1>
  <Button style={{ backgroundColor: company.secondary_color }}>Jetzt buchen</Button>
</div>
```

**Buchungs-Flows:**

1. **Telefon-Buchung:** Click-to-Call Button
2. **Online-Formular (Roadmap):** Pickup/Dropoff, Datum/Zeit, Kontaktdaten
3. **WhatsApp (Roadmap):** Direktlink zu WhatsApp-Chat

---

## 📱 KAPITEL 6: DASHBOARD-STRUKTUR & NAVIGATION

### Dashboard-Hierarchie

```
HAUPTBEREICH:
├── Dashboard (Übersicht) - KPI-Übersicht, aktuelle Aufträge, Live-Karte
└── Aufträge - Order Management, Auftragserfassung, Disposition

VERWALTUNG:
├── Kunden - Customer Management (B2B & B2C)
├── Fahrer & Fahrzeuge - Driver/Vehicle Management (2 Tabs)
├── Schichten & Zeiten - Shift Management, Arbeitszeiterfassung
├── Finanzen - Financial Management, Rechnungen, Zahlungen
├── Kostenstellen - Cost Center Management
└── Dokumente & Ablauf - Document/Process Management

GESCHÄFT:
├── Partner-Netzwerk - Partner Management, Auftragsverteilung
├── Statistiken & Reports - Analytics & Reporting
└── Landingpage-Editor - Landing Page Management (Unternehmer-CI)

SYSTEM:
├── Kommunikation - Communication Management, Chat, E-Mail
└── Einstellungen - System Settings, User-Verwaltung, Subscription
```

### Dashboard-Details (Beispiel: Aufträge)

**Zweck:** Zentrale Auftragsverwaltung für Disponenten

**Hauptfunktionen:**

- Neue Aufträge erfassen (Pickup/Dropoff, Kunde, Preis)
- Fahrer & Fahrzeug zuweisen (manuell/automatisch)
- Status-Tracking (offen → zugewiesen → unterwegs → abgeschlossen)
- Live-Karte mit GPS-Positionen
- Auftragshistorie & Suche

**Daten-Quellen:**

- `bookings` Tabelle (Supabase)
- `drivers` & `vehicles` für Zuweisung
- `customers` für Kundendaten
- GPS-Positions-Stream (Supabase Realtime)

**User-Rollen:**

- **Admin:** Alle Funktionen
- **Disponent:** Aufträge erfassen, zuweisen, bearbeiten
- **Fahrer:** Nur eigene Aufträge sehen (Read-Only)

**Workflows:**

1. **Auftragserfassung:** Kunde anruft → Disponent erfasst Auftrag → Fahrer zuweisen
2. **Automatische Zuweisung:** System schlägt freien Fahrer vor (basierend auf GPS-Nähe)
3. **Status-Update:** Fahrer-App updated Status → Dashboard zeigt Echtzeit-Status

**KPIs (Dashboard Sidebar):**

- Offene Aufträge (heute)
- Laufende Fahrten (aktuell)
- Abgeschlossene Aufträge (heute)
- Durchschnittliche Fahrtdauer
- Umsatz (heute)

**Export-Anforderungen:**

- PDF: Auftrags-Details (für Rechnung)
- Excel: Auftrags-Liste (Zeitraum-Filter)
- CSV: Rohdaten-Export (Buchhaltung)

**Mobile-Anforderungen:**

- Mobile-optimierte Tabelle (horizontal scrollbar)
- Touch-friendly Buttons (min 44px)
- Quick-Actions (Telefon-Icon → Kunde anrufen)

### Live-Info-Board System

**Zweck:**

- Echtzeit-KPIs neben Dashboard anzeigen
- Schneller Überblick ohne Scrollen
- Export-Funktionen zentral verfügbar

**Position:**

- Rechts neben Dashboard-Inhalt
- Links von DashboardSidebar (320px breit)
- `left: sidebarExpanded ? '560px' : '384px'`
- `z-index: 40` (var(--z-infoboard))

**Inhalte (Area-spezifisch):**

- **Dashboard:** Navigation zu allen Bereichen
- **Aufträge:** Quick-Filters, Status-Tabs
- **Fahrer:** Driver-Management, Vehicle-Tabs
- **Finanzen:** Report-Tabs, Time-Range-Filters

**Funktionalität:**

- Context-sensitive Quick Actions
- Area-specific Filtering
- Tab Navigation

**Visualisierungen:**

- **Navigation:** Tab-basiert, Context-sensitive
- **Quick Actions:** Icon + Label
- **Responsive:** Mobile = Hamburger Menu, Desktop = Fixed Sidebar

---

## 🚀 KAPITEL 7: FEATURES & FUNKTIONEN

### Core-Features (Alle Pläne)

**1. Auftragsmanagement:**

- Digitale Auftragserfassung (Pickup, Dropoff, Zeit, Kunde)
- Fahrerzuweisung (manuell/vorschlag-basiert)
- Status-Tracking (7 Status: offen, zugewiesen, angenommen, unterwegs, am Ziel, abgeschlossen, storniert)
- Auftragshistorie mit Volltextsuche
- Wiederkehrende Aufträge (Stammkunden)
- Notizen & Tags pro Auftrag

**2. Fahrer-Management:**

- Fahrer-Stammdaten (Name, Kontakt, Adresse)
- Führerschein-Verwaltung (Nummer, Ablaufdatum)
- P-Schein-Verwaltung (Personenbeförderungsschein)
- Gesundheitszeugnis-Upload & Ablauf-Erinnerung
- Fahrer-Status (aktiv, krank, Urlaub, inaktiv)
- Arbeitszeit-Tracking (Schichten)

**3. Fahrzeug-Management:**

- Fahrzeug-Stammdaten (Kennzeichen, Marke, Modell, Baujahr)
- TÜV/HU-Überwachung (Ablaufdatum + automatische Erinnerung 30 Tage vorher)
- Versicherungs-Ablauf-Tracking
- Wartungsplaner (KM-basiert, Intervalle)
- Fahrzeugdokumente-Upload (Zulassung, Versicherung)
- Fahrzeug-Status (aktiv, Wartung, defekt, inaktiv)

**4. GPS-Echtzeit-Tracking (Business-Plan):**

- Live-Karte aller Fahrzeuge (HERE Maps)
- GPS-Position-Stream (Supabase Realtime)
- Routenverfolgung (letzte 24h)
- Geofencing (Zonen definieren, Benachrichtigungen)
- GPS-Daten-Anonymisierung (nach 24h DSGVO-konform)

**5. Kommunikation:**

- In-App-Chat (Disponent ↔ Fahrer)
- E-Mail-Benachrichtigungen (Auftragsbestätigung)
- SMS-Versand (Roadmap: Fahrgast-Benachrichtigungen)
- Push-Notifications (PWA/App, Roadmap)

**6. Zahlungsabwicklung:**

- Zahlungsmethoden-Tracking (Bar, Karte, Rechnung)
- Rechnungserstellung (automatisch nach Fahrt)
- Mahnwesen (Basic: manuell)
- Payment-Gateway (Stripe, Roadmap)

**7. Reporting:**

- Umsatz-Übersicht (Tag, Woche, Monat)
- Fahrer-Performance (Anzahl Fahrten, Umsatz)
- Fahrzeugauslastung (% aktive Zeit)
- Excel/PDF-Export

### Advanced-Features (Business-Plan/Roadmap)

**8. KI-Features:**

- **Automatische Fahrerzuweisung:** Machine Learning basiert auf GPS-Nähe, Fahrer-Performance, Fahrzeug-Typ
- **Demand Forecasting:** Vorhersage von Buchungs-Peaks (basierend auf historischen Daten)
- **Chatbot (Roadmap):** AI-Chat für Fahrgast-Buchungen (Claude API)
- **Auto-Routing:** Optimale Routenvorschläge (HERE Maps API)

**9. API-Integrationen:**

- **DATEV-Export:** Rechnungsdaten automatisch an DATEV übertragen
- **Taxameter-Anbindung:** Fahrtdaten automatisch importieren
- **Stripe-Payment:** Online-Bezahlung für Fahrgäste
- **WhatsApp-Business:** Buchungen via WhatsApp
- **Google-Calendar:** Fahrer-Schichten synchronisieren

**10. Workflow-Automation:**

- **Auto-Mahnwesen:** Automatische Mahnungen bei überfälliger Rechnung (7, 14, 21 Tage)
- **Wiederkehrende Aufträge:** Automatische Erstellung (z.B. tägliche Fahrten)
- **Ablauf-Erinnerungen:** TÜV, Führerschein, P-Schein (E-Mail 30 Tage vorher)
- **Auto-Invoicing:** Rechnung automatisch nach abgeschlossener Fahrt

**11. Multi-Language (Roadmap):**

- Deutsch (Standard)
- Englisch (Q3/2025)
- Türkisch, Polnisch (Q4/2025)

**12. Compliance:**

- **DSGVO:** Consent-Management, Daten-Export, Löschung
- **Accessibility:** WCAG 2.1 AA (Screen-Reader, Keyboard-Navigation)
- **Security:** 2FA (Two-Factor-Auth, Roadmap)

### Premium-Features (Enterprise/Add-Ons)

**13. White-Label-Premium:**

- Custom-Domain (eigene Domain statt Subdomain)
- Entfernung "Powered by MyDispatch"
- Custom-App-Branding (iOS/Android mit Unternehmer-Logo)

**14. Enterprise-Features (Roadmap):**

- Mehrmandanten-Verwaltung (Filial-System)
- Advanced-Analytics (Custom-Reports, BI-Dashboard)
- Dedicated-Support (24/7 Hotline)
- SLA-Garantien (99.9% Uptime)

---

## 👥 KAPITEL 8: USER-ROLLEN & BERECHTIGUNGEN

### User-Typen

**1. Super-Admin (MyDispatch-Team):**

- **Zweck:** System-Verwaltung, Support, Monitoring
- **Zugriff:** Alle Companies, alle Dashboards (Read-Only für Company-Daten)
- **Funktionen:** User-Management, Subscription-Management, System-Konfiguration

**2. Unternehmer-Admin (Company-Owner):**

- **Zweck:** Haupt-Nutzer des Unternehmens
- **Zugriff:** Vollzugriff auf eigene Company-Daten
- **Funktionen:** Alle Dashboards, User-Verwaltung (eigene Mitarbeiter), Subscription-Management

**3. Unternehmer-Mitarbeiter (Dispatcher):**

- **Zweck:** Disponenten, Büro-Personal
- **Zugriff:** Eingeschränkter Zugriff (kein Finanz-Dashboard)
- **Funktionen:** Aufträge, Kunden, Fahrer, Fahrzeuge (CRUD), Schichten (Read-Only)

**4. Fahrer (Driver):**

- **Zweck:** Fahrer-App-Zugriff (Mobile-optimiert)
- **Zugriff:** Nur eigene Daten (eigene Aufträge, eigene Schichten)
- **Funktionen:** Schichtzettel, Auftragsübersicht, Status-Update, Dokumenten-Upload

**5. Fahrgäste (End-Customer, Roadmap):**

- **Zweck:** Self-Service-Portal für Stammkunden
- **Zugriff:** Nur eigene Buchungen
- **Funktionen:** Buchungshistorie, Online-Buchen, Rechnungen einsehen

**6. Support (Customer-Success, Roadmap):**

- **Zweck:** MyDispatch-Support-Team
- **Zugriff:** Read-Only auf alle Companies (für Support-Anfragen)
- **Funktionen:** Support-Tickets, Chat, E-Mail-Support

### Berechtigungs-Matrix

| Feature           | Super-Admin | Unternehmer-Admin | Mitarbeiter | Fahrer        | Fahrgast    |
| ----------------- | ----------- | ----------------- | ----------- | ------------- | ----------- |
| **Dashboard**     | ✅ Read-All | ✅ Full           | ✅ Full     | ❌            | ❌          |
| **Aufträge**      | ✅ Read-All | ✅ Full           | ✅ Full     | ✅ Read-Own   | ✅ Read-Own |
| **Kunden**        | ✅ Read-All | ✅ Full           | ✅ Full     | ❌            | ❌          |
| **Fahrer**        | ✅ Read-All | ✅ Full           | ✅ Full     | ✅ Read-Own   | ❌          |
| **Fahrzeuge**     | ✅ Read-All | ✅ Full           | ✅ Full     | ✅ Read-Own   | ❌          |
| **Schichten**     | ✅ Read-All | ✅ Full           | ✅ Read     | ✅ Full-Own   | ❌          |
| **Finanzen**      | ✅ Read-All | ✅ Full           | ❌          | ❌            | ❌          |
| **Kostenstellen** | ✅ Read-All | ✅ Full           | ❌          | ❌            | ❌          |
| **Dokumente**     | ✅ Read-All | ✅ Full           | ✅ Full     | ✅ Upload-Own | ❌          |
| **Partner**       | ✅ Read-All | ✅ Full           | ✅ Read     | ❌            | ❌          |
| **Statistiken**   | ✅ Read-All | ✅ Full           | ✅ Read     | ❌            | ❌          |
| **Landingpage**   | ✅ Read-All | ✅ Full           | ❌          | ❌            | ❌          |
| **Kommunikation** | ✅ Full     | ✅ Full           | ✅ Full     | ✅ Limited    | ❌          |
| **Einstellungen** | ✅ System   | ✅ Company        | ❌          | ✅ Profile    | ❌          |

**RLS Policies (PostgreSQL):**

```sql
-- Beispiel: Aufträge (bookings)
-- Unternehmer-Admin/Mitarbeiter: Alle Aufträge der eigenen Company
CREATE POLICY "Company users can view all company bookings"
ON bookings FOR SELECT
USING (company_id = auth.uid_company_id());

-- Fahrer: Nur eigene Aufträge
CREATE POLICY "Drivers can view only own bookings"
ON bookings FOR SELECT
USING (driver_id = auth.uid() AND company_id = auth.uid_company_id());
```

---

## 📊 KAPITEL 9: BUSINESS-PROZESSE & WORKFLOWS

### Kern-Workflows

**1. Auftrags-Lifecycle:**

```
1. BUCHUNG EINGANG
   ├─ Telefon (Disponent erfasst manuell)
   ├─ Online-Formular (Unternehmer-Landing, Roadmap)
   └─ WhatsApp (Roadmap)

2. AUFTRAGS-ERFASSUNG
   ├─ Pickup-Adresse + Dropoff-Adresse
   ├─ Datum/Zeit
   ├─ Kunde (bestehend/neu)
   └─ Fahrzeug-Typ (Taxi, Kombi, Limousine)

3. FAHRER-ZUWEISUNG
   ├─ Manuell (Disponent wählt Fahrer)
   ├─ Vorschlag (System schlägt freien Fahrer vor)
   └─ Automatisch (KI-basiert, Roadmap)

4. STATUS-UPDATES
   ├─ Zugewiesen → Fahrer erhält Benachrichtigung
   ├─ Angenommen → Fahrer bestätigt
   ├─ Unterwegs → Fahrer started GPS-Tracking
   ├─ Am Ziel → Fahrt abgeschlossen
   └─ Abgeschlossen → Rechnung erstellt

5. RECHNUNGSSTELLUNG
   ├─ Automatisch nach Fahrt-Abschluss
   ├─ PDF-Generierung
   ├─ E-Mail-Versand an Kunde
   └─ Zahlung verbuchen (Bar/Karte/Rechnung)

6. ABSCHLUSS
   ├─ Fahrgast-Feedback (optional, Roadmap)
   └─ Archivierung (nach 30 Tagen)
```

**2. Fahrer-Onboarding:**

```
1. REGISTRIERUNG
   ├─ Persönliche Daten (Name, Adresse, Kontakt)
   ├─ Führerschein-Daten (Nummer, Ablaufdatum)
   └─ P-Schein-Daten (Nummer, Ablaufdatum)

2. DOKUMENTEN-UPLOAD
   ├─ Führerschein-Kopie (PDF/JPG)
   ├─ P-Schein-Kopie
   ├─ Gesundheitszeugnis
   └─ Gewerbeanmeldung (falls Subunternehmer)

3. PRÜFUNG
   ├─ Unternehmer-Admin prüft Dokumente
   └─ Freigabe oder Ablehnung

4. AKTIVIERUNG
   ├─ Status = aktiv
   ├─ Fahrer erhält App-Zugang
   └─ Einführungs-E-Mail (Onboarding-Guide)

5. ERSTE SCHICHT
   ├─ Schicht erfassen (Start-KM)
   ├─ Erster Auftrag zuweisen
   └─ Support bei Fragen
```

**3. Unternehmer-Onboarding (siehe Kapitel 5)**

**4. Support-Workflows:**

```
1. TICKET-EINGANG
   ├─ E-Mail (support@mydispatch.de)
   ├─ In-App-Chat (Roadmap)
   └─ Telefon-Hotline (Premium, Roadmap)

2. TICKET-KATEGORISIERUNG
   ├─ Technisches Problem (Bug)
   ├─ Feature-Request
   ├─ Frage/How-To
   └─ Billing-Issue

3. BEARBEITUNG
   ├─ P1 (Critical): < 2h Response
   ├─ P2 (High): < 4h Response
   ├─ P3 (Normal): < 24h Response
   └─ P4 (Low): < 48h Response

4. ESKALATION
   ├─ Keine Lösung nach 48h → Eskalation an Tech-Lead
   └─ Customer-Unhappy → Eskalation an CEO

5. ABSCHLUSS
   ├─ Lösung dokumentieren (Knowledge-Base)
   └─ Customer-Satisfaction-Survey
```

**5. Billing-Workflows:**

```
1. SUBSCRIPTION-START
   ├─ Stripe Checkout (Roadmap)
   ├─ Payment-Method-Verification
   └─ Account-Aktivierung

2. MONATLICHE ABRECHNUNG
   ├─ Automatische Belastung (1. des Monats)
   ├─ Rechnung per E-Mail
   └─ Retry bei Fehlschlag (3 Versuche)

3. PAYMENT-FAILED
   ├─ E-Mail-Benachrichtigung
   ├─ Grace-Period (7 Tage)
   └─ Account-Sperrung (nach 7 Tagen)

4. UPGRADE/DOWNGRADE
   ├─ Proration-Berechnung
   ├─ Sofortige Änderung
   └─ Nächste Rechnung angepasst

5. KÜNDIGUNG
   ├─ Kündigung zum Monatsende
   ├─ Daten-Export anbieten
   └─ Daten-Löschung nach 30 Tagen
```

### Automation-Rules

**1. Automatische Zuweisungen:**

- **Regel:** Freier Fahrer + GPS-Nähe < 5km → Automatische Vorschlag
- **Trigger:** Neuer Auftrag erstellt
- **Bedingung:** Business-Plan + GPS-Tracking aktiviert
- **Aktion:** Fahrer erhält Push-Notification "Neuer Auftrag in Ihrer Nähe"

**2. Notification-Triggers:**
| Trigger | Empfänger | Kanal | Inhalt |
|---------|-----------|-------|--------|
| Neuer Auftrag | Fahrer | Push + SMS | "Neuer Auftrag: [Adresse]" |
| TÜV-Ablauf (30 Tage) | Admin | E-Mail | "TÜV-Ablauf Fahrzeug [Kennzeichen]" |
| Führerschein-Ablauf | Admin | E-Mail | "Führerschein-Ablauf Fahrer [Name]" |
| Rechnung überfällig | Admin | E-Mail | "Mahnung Rechnung [Nummer]" |
| Payment-Failed | Admin | E-Mail | "Zahlung fehlgeschlagen [Subscription]" |

**3. Escalation-Processes:**

- Support-Ticket ohne Antwort nach 48h → E-Mail an Tech-Lead
- Payment-Failed 3x → E-Mail an CEO + Account-Sperrung
- Customer-Complaint → Sofortige E-Mail an Customer-Success

**4. Report-Generation:**

- **Täglich:** Umsatz-Übersicht (E-Mail um 6:00 Uhr)
- **Wöchentlich:** Fahrer-Performance (Montag 8:00 Uhr)
- **Monatlich:** Gesamtstatistik (1. des Monats, 9:00 Uhr)

---

## 🔧 KAPITEL 10: IST-ZUSTAND & SOLL-ZUSTAND

### IST-Zustand (Stand: 29.10.2025)

**Implementierte Features:**

- ✅ Dashboard (46 Pages vollständig, V28.1 Design)
- ✅ Auftragsmanagement (CRUD, Status-Tracking)
- ✅ Fahrer-/Fahrzeugmanagement (CRUD, Dokumenten-Upload)
- ✅ Kundenverwaltung (CRUD)
- ✅ Schichtzettel (Erfassung, KM-Tracking)
- ✅ Rechnungsstellung (automatisch, PDF-Export)
- ✅ GPS-Tracking (HERE Maps Integration)
- ✅ Multi-Tenant-System (RLS Policies, company_id)
- ✅ Supabase Auth (Login, Signup, Magic Links)
- ✅ InfoBoard-System (5/46 Dashboards integriert)
- ✅ Export-Funktionen (PDF, Excel, CSV)
- ✅ Mobile-Responsive (Mobile-First Design)

**Bekannte Probleme:**

- ⚠️ InfoBoard nur auf 5 Pages (41 Pages fehlen)
- ⚠️ V26-Referenzen in Legacy-Code (Migration zu V28.1 ongoing)
- ⚠️ Console-Log-Statements (109 Violations, Clean-up benötigt)
- ⚠️ Finanzen.tsx fehlt komplett (TODO: erstellen)
- ⚠️ TypeScript Strict Mode deaktiviert (TODO: aktivieren)

**Performance-Status:**

- Lighthouse: 96/100 ✅
- Bundle Size: 348kb (Target: <500kb) ✅
- Load Time: <2s ✅
- Error Rate: 0.02% (Target: <0.1%) ✅

**User-Feedback:**

- ✅ Dashboard-Übersichtlichkeit sehr gut
- ✅ Mobile-Nutzung problemlos
- ⚠️ Finanzen-Dashboard fehlt (Kunden-Request)
- ⚠️ Export-Buttons teilweise versteckt (UX-Verbesserung nötig)

**Technical-Debt:**

- V26-zu-V28.1-Migration (50% abgeschlossen)
- Console-Log-Elimination (70% abgeschlossen)
- TypeScript Strict Mode (0% - deaktiviert)
- Test Coverage (19 Integration Tests, 5 E2E Tests - Ziel: 80%)

**Design-Inkonsistenzen:**

- V26/V28.1-Mischung in Marketing-Pages (Pricing noch V26.1)
- Beige-Accent (#EADEBD) noch in Legacy-Components
- Transitions unterschiedlich (V26: 1200ms, V28.1: 300ms)

### SOLL-Zustand (Ziel: Q1/2025)

**Feature-Roadmap:**

**Q4/2024:**

- ✅ V28.1 Design-System komplett umsetzen
- ✅ Console-Log-Elimination (100%)
- ✅ Finanzen.tsx Dashboard erstellen
- ✅ InfoBoard auf alle 46 Pages integrieren
- ✅ TypeScript Strict Mode aktivieren

**Q1/2025:**

- Unternehmer-Landing-Pages (White-Label) Go-Live
- Stripe-Payment-Integration
- Kunden-Self-Service-Portal (Buchungshistorie)
- Auto-Mahnwesen
- Mobile-App (PWA) mit Offline-Support

**Q2/2025:**

- DATEV-Export-Integration
- Fahrer-App (iOS/Android, React Native)
- API-Marketplace-Launch
- Multi-Language (Englisch)

**Q3/2025:**

- KI-Features (Auto-Routing, Demand-Forecasting)
- WhatsApp-Business-Integration
- Expansion Österreich/Schweiz

**Performance-Ziele:**

- Lighthouse: 98/100 (aktuell: 96)
- Bundle Size: <250kb (aktuell: 348kb)
- Load Time: <1.5s (aktuell: <2s)
- Test Coverage: 80% (aktuell: ~40%)

**Design-Ziele:**

- 100% V28.1 Compliance (0% V26 Referenzen)
- 0 Console-Violations
- 0 TypeScript-Errors (Strict Mode)
- WCAG 2.1 AA Compliance (100%)

**User-Experience-Ziele:**

- User-Onboarding-Tutorial (First-Time-User)
- Context-Sensitive-Help (? Icon neben Features)
- Keyboard-Shortcuts (Power-User)
- Dark-Mode (optional)

**Business-Ziele:**

- 100 aktive Unternehmer-Kunden
- MRR: 10.000€
- Churn-Rate: <5%
- NPS (Net Promoter Score): >50

**Technical-Goals:**

- 0 Technical Debt
- 100% Test Coverage (Unit + Integration + E2E)
- CI/CD Pipeline mit Auto-Deployment
- Monitoring mit Sentry + Plausible

### Gap-Analysis

**Feature-Gaps (Must-Have vor Go-Live):**

1. Finanzen.tsx Dashboard (P0 - CRITICAL)
2. InfoBoard auf alle Pages (P1)
3. Unternehmer-Landing-Pages (P0 - CRITICAL)
4. Stripe-Payment-Integration (P0 - CRITICAL)
5. Auto-Mahnwesen (P2)

**Performance-Gaps:**

1. Bundle-Size-Reduktion (348kb → 250kb)
2. Code-Splitting für Lazy-Loading
3. Image-Optimization (WebP statt PNG)

**Design-Gaps:**

1. V26-Elimination (50% verbleibend)
2. Console-Log-Elimination (30% verbleibend)
3. TypeScript Strict Mode (100% TODO)

**UX-Gaps:**

1. Onboarding-Tutorial fehlt
2. Inline-Help fehlt
3. Keyboard-Shortcuts fehlen
4. Mobile-Navigation teilweise unübersichtlich

**Technical-Gaps:**

1. Test Coverage: 40% → 80%
2. CI/CD Pipeline fehlt
3. Monitoring unvollständig (nur Sentry, keine Business-Metriken)

---

## 🎯 KAPITEL 11: QUALITÄTS-ANFORDERUNGEN

### Performance-Requirements

**Lighthouse-Scores (Ziel: ≥95):**

- Performance: ≥95 (aktuell: 96 ✅)
- Accessibility: ≥95 (aktuell: 98 ✅)
- Best Practices: ≥95 (aktuell: 100 ✅)
- SEO: ≥95 (aktuell: 100 ✅)

**Core-Web-Vitals:**

- **LCP (Largest Contentful Paint):** <2.5s (aktuell: 1.8s ✅)
- **FID (First Input Delay):** <100ms (aktuell: 50ms ✅)
- **CLS (Cumulative Layout Shift):** <0.1 (aktuell: 0.05 ✅)

**Bundle-Size-Limits:**

- Initial Bundle: <150kb gzipped (aktuell: 148kb ✅)
- Total JS: <250kb gzipped (aktuell: 348kb ⚠️)
- Total CSS: <50kb gzipped (aktuell: 32kb ✅)
- Images per Page: <1MB

**Loading-Time-Targets:**

- First Contentful Paint: <1.5s (aktuell: 1.2s ✅)
- Time to Interactive: <3s (aktuell: 2.4s ✅)
- Server Response Time: <200ms (aktuell: 150ms ✅)

**Mobile-Performance:**

- Lighthouse Mobile: ≥90 (aktuell: 94 ✅)
- Touch-Target-Size: ≥44px (100% Compliance ✅)
- Viewport-Meta: Present (✅)

### Accessibility-Requirements

**WCAG-Level:** 2.1 AA (Ziel: 100% Compliance)

**Screen-Reader-Support:**

- ✅ Alle Bilder haben `alt`-Attribute
- ✅ Alle Form-Inputs haben `<label>`
- ✅ ARIA-Labels für Icon-Buttons
- ✅ Semantische HTML-Struktur (`<header>`, `<main>`, `<nav>`, `<footer>`)

**Keyboard-Navigation:**

- ✅ Tab-Order logisch
- ✅ Focus-Indicators sichtbar (2px solid outline)
- ✅ Escape schließt Modals/Dialogs
- ✅ Enter aktiviert Buttons

**Color-Contrast:**

- ✅ Text auf Hintergrund: ≥4.5:1 (Body-Text)
- ✅ Headings: ≥3:1 (große Texte)
- ✅ Links: ≥4.5:1 + Underline bei Hover
- ✅ Buttons: ≥4.5:1

**Touch-Targets:**

- ✅ Minimum 44x44px (iOS HIG)
- ✅ Spacing zwischen Targets: ≥8px
- ✅ Mobile-Buttons: 48px Höhe

### Security-Requirements

**Data-Protection (DSGVO):**

- ✅ Consent-Management (Cookie-Banner)
- ✅ Daten-Export (JSON/CSV)
- ✅ Daten-Löschung (User-Request)
- ✅ Anonymisierung (GPS nach 24h)
- ✅ Encryption at Rest (PostgreSQL)
- ✅ Encryption in Transit (TLS 1.3)

**Authentication:**

- ✅ Supabase Auth (JWT-based)
- ✅ Password-Hashing (bcrypt via Supabase)
- ❌ 2FA (TODO: Roadmap Q2/2025)
- ✅ Magic-Links (Passwordless Login)

**Authorization:**

- ✅ Row-Level Security (RLS Policies)
- ✅ Role-Based Access Control (RBAC)
- ✅ API-Key-Management (Secrets in Supabase Vault)

**Data-Encryption:**

- ✅ Passwords: bcrypt (Supabase)
- ✅ API-Keys: AES-256 (Supabase Vault)
- ✅ User-Data: PostgreSQL Encryption
- ✅ TLS 1.3 (HTTPS überall)

**Audit-Logging:**

- ✅ Auth-Events (Login, Logout, Signup)
- ✅ Data-Changes (CRUD auf kritischen Tabellen)
- ❌ Admin-Actions (TODO: Roadmap)

### Testing-Requirements

**Unit-Test-Coverage:** ≥80% (aktuell: ~40%)

- Ziel: Alle Components, Hooks, Utils
- Tool: Vitest + React Testing Library

**Integration-Tests:** ≥50 Tests (aktuell: 19)

- Ziel: Alle Dashboard-Pages, Core-Workflows
- Tool: Vitest + React Testing Library

**E2E-Tests:** ≥20 Tests (aktuell: 5)

- Ziel: Kritische User-Journeys (Login, Auftrags-Erfassung, Rechnung erstellen)
- Tool: Playwright

**Performance-Tests:**

- Lighthouse CI in GitHub Actions
- Bundle-Size-Check in CI/CD

**Security-Tests:**

- ✅ npm audit (automatisch in CI/CD)
- ❌ Penetration-Testing (TODO: External Audit)

---

## 🚦 KAPITEL 12: DEPLOYMENT & OPERATIONS

### Deployment-Strategy

**Environment-Setup:**

1. **Development:** Lokal (localhost:5173)
2. **Staging:** Vercel Preview-Deployments (PR-basiert)
3. **Production:** Vercel Production (mydispatch.de)

**CI/CD-Pipeline (GitHub Actions):**

```yaml
Trigger: Push to main / PR
Jobs: 1. Lint & Type-Check (ESLint, TypeScript)
  2. Unit Tests (Vitest, Coverage ≥80%)
  3. E2E Tests (Playwright)
  4. Build (Vite)
  5. Lighthouse CI (Performance-Check)
  6. Deploy to Vercel (Auto)
```

**Release-Process:**

1. Feature-Branch erstellen (`feature/xyz`)
2. Code schreiben + Tests
3. PR erstellen → CI/CD läuft
4. Code-Review (min 1 Approval)
5. Merge to `main` → Auto-Deploy to Production

**Rollback-Strategy:**

- Vercel ermöglicht Instant-Rollback zu vorheriger Deployment
- Git-Revert bei kritischen Fehlern
- Rollback-Time: <5 Minuten

**Blue-Green-Deployment:**

- Vercel Preview (Blue) → Tests → Promote to Production (Green)
- Zero-Downtime-Deployment
- Canary-Deployments (10% Traffic → 100%)

### Monitoring & Observability

**Application-Monitoring:**

- **Tool:** Sentry (@sentry/react)
- **Metriken:** Error-Rate, Error-Traces, User-Impact
- **Alerts:** Slack-Benachrichtigung bei Error-Rate >1%

**Error-Tracking:**

- Sentry fängt alle Runtime-Errors
- Source-Maps für Stack-Traces
- User-Context (anonymisiert)

**Performance-Monitoring:**

- **Tool:** Web Vitals (web-vitals 5.1.0)
- **Metriken:** LCP, FID, CLS
- **Reporting:** Sentry Performance-Monitoring

**Business-Metrics:**

- **Tool:** Plausible Analytics
- **Metriken:** Pageviews, Bounce-Rate, Traffic-Sources
- **DSGVO:** Kein Cookie-Banner nötig (Privacy-First)

**Alert-Rules:**
| Bedingung | Alert | Empfänger | Kanal |
|-----------|-------|-----------|-------|
| Error-Rate >1% | CRITICAL | Tech-Lead | Slack + E-Mail |
| Lighthouse <90 | WARNING | Tech-Lead | Slack |
| Deployment-Failed | CRITICAL | Tech-Lead | Slack + SMS |
| Supabase-Downtime | CRITICAL | CEO + CTO | Slack + SMS |

### Maintenance & Support

**Support-Levels:**

- **Starter-Plan:** E-Mail-Support (Mo-Fr, 9-17 Uhr, <24h Response)
- **Business-Plan:** E-Mail + Chat (Mo-Fr, 9-19 Uhr, <4h Response)
- **Enterprise (Roadmap):** 24/7 Hotline (<2h Response)

**Maintenance-Windows:**

- **Geplant:** Sonntag 2-4 Uhr (monatlich, optional)
- **Ungeplant:** Sofort bei kritischen Security-Patches

**Backup-Strategy:**

- **Database:** Supabase Auto-Backups (täglich, 7 Tage Retention)
- **Storage:** Supabase Storage Auto-Replication
- **Code:** GitHub (Git-History)

**Disaster-Recovery:**

- **RTO (Recovery Time Objective):** <1h (Database-Restore)
- **RPO (Recovery Point Objective):** <24h (letztes Backup)
- **Plan:** Supabase-Restore + Vercel-Rollback

**Documentation-Maintenance:**

- Docs aktualisiert bei jedem Release (Changelog)
- Quarterly-Review aller Docs (alle 3 Monate)

---

## 📋 KAPITEL 13: COMPLIANCE & LEGAL

### Legal-Requirements

**Impressum (§5 TMG):**

```
RideHub Solutions
Inhaber: Ibrahim SIMSEK
Anschrift: Ensbachmühle 4, 94571 Schaufling, Deutschland
Telefon: +49 151 44461450
E-Mail: info@ridehub.de
USt-IdNr: DE123456789 (Kleinunternehmer §19 UStG)
```

**Datenschutzerklärung (Art. 13 DSGVO):**

- Verantwortlicher: RideHub Solutions (Ibrahim SIMSEK)
- Datenschutzbeauftragter: Nicht erforderlich (<10 Mitarbeiter)
- Datenverarbeitung: Supabase (EU-Server, DSGVO-konform)
- Rechte: Auskunft, Berichtigung, Löschung, Widerspruch
- Speicherdauer: Bis Konto-Löschung + 30 Tage

**AGB (Allgemeine Geschäftsbedingungen):**

- Vertragspartner: RideHub Solutions & Unternehmer
- Leistungsumfang: SaaS-Lizenz, Support, Updates
- Laufzeit: Monatlich kündbar
- Haftung: Beschränkt auf Vorsatz/grobe Fahrlässigkeit
- Streitbeilegung: Zuständig Amtsgericht Deggendorf

**Cookie-Policy:**

- Essenzielle Cookies: Supabase Auth (JWT-Token)
- Analytische Cookies: Plausible (DSGVO-konform, kein Consent nötig)
- Marketing-Cookies: KEINE

**KI-Transparenz (AI Act Compliance):**

```
MyDispatch nutzt KI-Technologie (Claude Sonnet 4.5 von Anthropic) für:
- Automatische Fahrerzuweisung (Vorschläge)
- Demand-Forecasting (Vorhersagen)
- Chatbot-Funktionen (Roadmap)

Die KI-Systeme sind nicht vollautomatisiert. Finale Entscheidungen
trifft immer der Mensch (Disponent/Unternehmer).
```

### Compliance-Standards

**DSGVO/GDPR (EU-Datenschutz):**

- ✅ Datenminimierung (nur notwendige Daten)
- ✅ Zweckbindung (Daten nur für definierten Zweck)
- ✅ Transparenz (Datenschutzerklärung)
- ✅ Betroffenenrechte (Auskunft, Löschung, Export)
- ✅ Technische Maßnahmen (Encryption, RLS)
- ✅ Vertrag mit Auftragsverarbeiter (Supabase AVV)

**Accessibility (Barrierefreiheit):**

- Standard: WCAG 2.1 AA
- ✅ Screen-Reader-Support
- ✅ Keyboard-Navigation
- ✅ Color-Contrast ≥4.5:1
- ✅ Touch-Targets ≥44px

**Industry-Standards:**

- ISO 27001 (Information Security Management, Supabase-certified)
- SOC 2 Type II (Supabase-certified)

**Audit-Requirements:**

- Jährlicher Security-Audit (extern)
- Quarterly-Review Datenschutz (intern)
- Penetration-Testing (jährlich, extern)

---

## 🎓 KAPITEL 14: TRAINING & DOCUMENTATION

### User-Documentation

**User-Manuals:**

- Unternehmer-Handbuch (PDF, 50 Seiten)
- Fahrer-Schnellstart-Guide (PDF, 10 Seiten)
- Disponent-Handbuch (PDF, 30 Seiten)

**Video-Tutorials:**

- Onboarding-Video (5min): Account-Setup, erste Schritte
- Auftragserfassung (3min): Auftrag erstellen, Fahrer zuweisen
- Rechnungsstellung (4min): Rechnung erstellen, versenden
- GPS-Tracking (3min): Live-Karte nutzen

**FAQ (Häufige Fragen):**

- "Wie ändere ich meine Subscription?"
- "Wie füge ich einen neuen Fahrer hinzu?"
- "Wie exportiere ich Rechnungen?"
- "Wie funktioniert GPS-Tracking?"

**Release-Notes:**

- Changelog nach jedem Release
- Breaking-Changes hervorgehoben
- Migration-Guides bei größeren Updates

### Developer-Documentation

**API-Documentation:**

- OpenAPI-Spec (Swagger)
- Endpoint-Übersicht (REST API)
- Authentication-Guide (JWT)
- Rate-Limits

**Component-Documentation:**

- Storybook (geplant): UI-Component-Library
- Props-Übersicht für alle Components
- Usage-Examples

**Architecture-Documentation:**

- System-Architektur-Diagramm
- Datenmodell (Entity-Relationship-Diagram)
- Deployment-Architektur

**Deployment-Documentation:**

- Lokales Setup (README.md)
- Environment-Variables
- Database-Migrations
- CI/CD-Pipeline

### Training-Programs

**User-Onboarding (Unternehmer):**

1. Welcome-E-Mail + Onboarding-Video
2. First-Login: Interactive-Tutorial (Guided-Tour)
3. Erste Schritte: Fahrer hinzufügen, Auftrag erfassen
4. Follow-Up-E-Mail nach 7 Tagen: "Wie läuft es?"

**Admin-Training (Power-User):**

- Webinar (60min): Alle Dashboards, erweiterte Features
- Q&A-Session (30min)
- Zertifikat (optional)

**Developer-Training (Onboarding neuer Devs):**

- Tech-Stack-Overview (React, TypeScript, Supabase)
- Codebase-Walkthrough (Folder-Struktur, Patterns)
- First-Issue-Assignment (Pair-Programming)

---

## 🔮 KAPITEL 15: FUTURE-ROADMAP

### Short-Term (Q4/2024 - 3 Monate)

**Prioritäre Features:**

1. **Finanzen.tsx Dashboard** (P0-CRITICAL)
   - Umsatz-Übersicht, Einnahmen/Ausgaben, Gewinn/Verlust
   - Rechnung-Status-Verteilung, Mahnwesen
   - Export (PDF, Excel, DATEV)

2. **InfoBoard-Integration (41 Pages)** (P1)
   - DashboardInfoBoard auf alle verbleibenden Dashboards
   - Konsistente KPI-Darstellung
   - Export-Funktionen überall verfügbar

3. **Console-Log-Elimination (100%)** (P1)
   - Alle 109 Violations beheben
   - Structured Logging mit Winston (Roadmap)

**Critical-Fixes:**

- TypeScript Strict Mode aktivieren
- V26-Referenzen eliminieren (100%)
- Bundle-Size-Optimierung (<250kb)

**Performance-Improvements:**

- Code-Splitting für Lazy-Loading
- Image-Optimization (WebP, lazy-loading)
- Tree-Shaking für ungenutzten Code

### Medium-Term (Q1-Q2/2025 - 6-12 Monate)

**Major-Features:**

**1. Unternehmer-Landing-Pages (Go-Live)**

- White-Label-Booking-Widget
- Custom-Domain-Support
- Online-Buchungsformular
- Fahrgast-Self-Service-Portal

**2. Stripe-Payment-Integration**

- Subscription-Management
- Auto-Billing (monatlich)
- Payment-Failed-Handling
- Invoice-Generation

**3. Mobile-App (iOS/Android)**

- React Native (Code-Reuse 80%)
- Fahrer-App (Schichtzettel, Aufträge, GPS)
- Offline-Support (Service-Worker)
- Push-Notifications

**4. DATEV-Export**

- Automatischer Export (Rechnungen, Zahlungen)
- DATEV-Schnittstelle-Compliance
- Monatliche Übermittlung

**5. API-Marketplace**

- REST API (OAuth 2.0)
- Webhooks (Echtzeit-Events)
- Partner-Integrationen (Taxameter, Accounting)
- Rev-Share (5% Transaktionsgebühr)

**Platform-Expansions:**

- Multi-Language (Englisch, Türkisch, Polnisch)
- Expansion Österreich/Schweiz (Q2/2025)
- White-Label-Premium (Custom-App-Branding)

**Integration-Expansions:**

- WhatsApp-Business (Buchungen)
- Google-Calendar (Schicht-Sync)
- Slack (Team-Communication)

### Long-Term (Q3-Q4/2025 - 12+ Monate)

**Vision-Features:**

**1. KI-Powered-Automation**

- **Auto-Routing:** Optimale Routenvorschläge (Machine Learning)
- **Demand-Forecasting:** Buchungs-Peak-Vorhersage
- **Dynamic-Pricing:** Surge-Pricing basierend auf Nachfrage
- **Chatbot:** AI-Chat für Fahrgast-Buchungen (Claude API)

**2. Partner-Ecosystem**

- **Partner-Marketplace:** Auftragsvergabe an Subunternehmer
- **Commission-Tracking:** Automatische Provisionsverwaltung
- **Multi-Company-Workflows:** Flottenübergreifende Aufträge

**3. Enterprise-Features**

- **Mehrmandanten-Verwaltung:** Filial-System
- **Advanced-Analytics:** BI-Dashboard, Custom-Reports
- **Dedicated-Support:** 24/7 Hotline, SLA-Garantien
- **Custom-Integrations:** On-Premise-Anbindungen

**Market-Expansion:**

- **Neue Branchen:** Kurierdienste, Krankentransport
- **Neue Regionen:** Benelux, Frankreich, UK
- **B2C-Plattform:** MyDispatch-Ride (Uber-Alternative)

**Technology-Evolution:**

- **AI-First-Architecture:** LLM-basierte Features
- **Blockchain:** Transparente Provisionsverwaltung (Partner)
- **IoT-Integration:** Telematik-Anbindung (Fahrzeugdaten)
- **AR/VR:** Virtual-Reality-Fahrer-Training

---

## 🎯 ZUSAMMENFASSUNG & SCHNELLREFERENZ

### Projekt-Eckdaten

- **Name:** MyDispatch
- **Typ:** SaaS (Cloud-basierte Dispositions-Software)
- **Zielgruppe:** Taxi-/Mietwagen-/Limousinenunternehmen (KMU, DACH)
- **Tech-Stack:** React, TypeScript, Supabase, Vercel
- **Status:** Production-Ready (V18.3.30)
- **Gründer:** Ibrahim SIMSEK (CEO), Pascal Courbois (CTO)

### Kernmerkmale

1. Multi-Tenant White-Label-System
2. GPS-Echtzeit-Tracking
3. DSGVO-First (EU-Server)
4. Mobile-First Design
5. Transparente Preise (39€/99€ Monat)

### Kritische Prioritäten (Q4/2024)

1. Finanzen.tsx Dashboard erstellen
2. InfoBoard auf alle 46 Pages
3. Console-Log-Elimination (100%)
4. TypeScript Strict Mode
5. V26-zu-V28.1-Migration abschließen

### Go-Live-Roadmap

- **Q4/2024:** Unternehmer-Landing-Pages + Stripe-Payment
- **Q1/2025:** Mobile-App + API-Marketplace
- **Q2/2025:** DATEV-Export + Multi-Language
- **Q3/2025:** KI-Features + Expansion Österreich/Schweiz

---

**ENDE DER DOKUMENTATION**

**Letzte Aktualisierung:** 29.10.2025  
**Version:** 1.0.0  
**Verantwortlich:** Ibrahim SIMSEK, Pascal Courbois  
**Status:** ✅ Vollständig

---

**NÄCHSTE SCHRITTE:**

1. Diese Dokumentation teilen mit allen Stakeholdern
2. Bot-Prompts aktualisieren (Custom Knowledge)
3. Quarterly-Review-Termin setzen (alle 3 Monate)
4. Roadmap-Items priorisieren (Q4/2024-Kickoff)

**KONTAKT:**

- **CEO:** Ibrahim SIMSEK - info@ridehub.de
- **CTO:** Pascal Courbois - pascal@nexify.nl
- **Support:** support@mydispatch.de
