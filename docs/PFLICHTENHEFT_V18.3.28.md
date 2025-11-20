# 📘 SYSTEMWEITES PFLICHTENHEFT V18.3.28

## MyDispatch - Requirements Specification (Corporate Standard)

**Version:** 18.3.28  
**Status:** Production-Ready  
**Letzte Aktualisierung:** 2025-10-21  
**Verantwortlich:** Senior Systemarchitekt  
**Klassifizierung:** Intern - Entwicklungsvorgabe

---

## 📋 INHALTSVERZEICHNIS

1. [Projektübersicht](#projektübersicht)
2. [Stakeholder & Rollen](#stakeholder--rollen)
3. [Funktionale Anforderungen](#funktionale-anforderungen)
4. [Nicht-Funktionale Anforderungen](#nicht-funktionale-anforderungen)
5. [Systemarchitektur](#systemarchitektur)
6. [Datenmodell](#datenmodell)
7. [Schnittstellen](#schnittstellen)
8. [Sicherheitsanforderungen](#sicherheitsanforderungen)
9. [Qualitätsanforderungen](#qualitätsanforderungen)
10. [Deployment & Betrieb](#deployment--betrieb)

---

## 🎯 PROJEKTÜBERSICHT

### Vision

MyDispatch ist eine **Premium-Disposition-Plattform für die Transportbranche**, die Unternehmer, Disponenten, Fahrer und Kunden in einem integrierten System vereint. Ziel ist es, **Marktführer** durch höchste technische Qualität, perfektioniertes Design und maximale Nutzerfreundlichkeit zu werden.

### Scope

- **Dispatcher-Webapp** (React/Vite)
- **Backend-Infrastruktur** (Lovable Cloud/Supabase)
- **Öffentliche Portale** (Unternehmer, Fahrer, Kunden)
- **Mobile-Responsive** Design (Mobile-First)

### Technologie-Stack

```
Frontend:  React 18 + TypeScript + Vite
Styling:   Tailwind CSS (HSL Design System)
UI-Lib:    Shadcn/ui (Labary-System)
Backend:   Supabase (PostgreSQL + Auth + Storage + Edge Functions)
State:     TanStack Query + React Context
Maps:      HERE Maps API
Icons:     Lucide React (170+ Komponenten)
Testing:   Playwright (E2E), Jest (Unit)
CI/CD:     GitHub Actions
```

---

## 👥 STAKEHOLDER & ROLLEN

### Primäre Benutzergruppen

| Rolle           | Beschreibung         | Zugriffsrechte                       | Portal             |
| --------------- | -------------------- | ------------------------------------ | ------------------ |
| **Unternehmer** | Firmengründer, Owner | Full Admin, Alle Daten               | Unternehmer-Portal |
| **Disponent**   | Auftrags-Manager     | CRUD Aufträge, Fahrer-Zuweisung      | Dispatcher-Webapp  |
| **Fahrer**      | Ausführende Kraft    | Read Eigene Aufträge, Status-Updates | Fahrer-Portal      |
| **Kunde**       | Auftraggeber         | Read Eigene Aufträge, Tracking       | Kunden-Portal      |

### Entwickler-Rollen

- **Senior Systemarchitekt** (KI): Gesamtverantwortung, Qualitätssicherung
- **Auftraggeber**: Anforderungsdefinition, Abnahme
- **QA Engineer** (automatisiert): Test-Execution, Reporting

---

## ⚙️ FUNKTIONALE ANFORDERUNGEN

### FR-001: Auftrags-Management

#### FR-001.1: Auftrags-Erstellung

**Priorität:** MUST  
**Status:** ✅ Implementiert

**User Story:**

> Als Disponent möchte ich einen neuen Auftrag erstellen können, damit ich Transportaufträge erfassen kann.

**Akzeptanzkriterien:**

- [x] Formular mit allen Pflichtfeldern (Abholung, Lieferung, Datum, Kunde)
- [x] Adress-Autocomplete via HERE Maps
- [x] Validierung aller Eingaben (Zod-Schema)
- [x] Bestätigung nach erfolgreicher Erstellung
- [x] Fehlerhandling bei API-Fehlern

**Technische Spezifikation:**

```typescript
interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  pickup_address: string;
  delivery_address: string;
  pickup_date: Date;
  delivery_date?: Date;
  status: "pending" | "assigned" | "in_transit" | "delivered" | "cancelled";
  driver_id?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}
```

**Abhängigkeiten:**

- Backend: `orders` Tabelle mit RLS
- API: HERE Maps Geocoding API
- UI: Shadcn Form + Dialog

---

#### FR-001.2: Auftrags-Übersicht

**Priorität:** MUST  
**Status:** ✅ Implementiert

**User Story:**

> Als Disponent möchte ich alle Aufträge filtern und sortieren können.

**Akzeptanzkriterien:**

- [x] Tabellarische Darstellung mit Pagination
- [x] Filter nach Status, Datum, Kunde
- [x] Suche nach Auftragsnummer
- [x] Sortierung nach Spalten
- [x] Responsive Layout (Mobile: Cards, Desktop: Table)

---

#### FR-001.3: Fahrer-Zuweisung

**Priorität:** MUST  
**Status:** ✅ Implementiert

**User Story:**

> Als Disponent möchte ich einem Auftrag einen Fahrer zuweisen können.

**Akzeptanzkriterien:**

- [x] Dropdown mit verfügbaren Fahrern
- [x] Verfügbarkeits-Check (nicht bereits zugewiesene Fahrer)
- [x] Benachrichtigung an Fahrer nach Zuweisung
- [x] Status-Update auf "assigned"

---

### FR-002: Dashboard & KPIs

#### FR-002.1: Dashboard-Übersicht

**Priorität:** MUST  
**Status:** ✅ Implementiert

**Akzeptanzkriterien:**

- [x] KPI-Cards (Offene Aufträge, Heute fällig, Aktive Fahrer, Umsatz)
- [x] Echtzeit-Updates via Supabase Realtime
- [x] Responsive Grid-Layout
- [x] Animations & Hover-Effects

---

#### FR-002.2: Karten-Integration

**Priorität:** MUST  
**Status:** ✅ Implementiert

**Akzeptanzkriterien:**

- [x] HERE Maps Embedded (Iframe)
- [x] Marker für aktive Aufträge
- [x] Routing zwischen Abholung und Lieferung
- [x] Loading & Error States

---

### FR-003: Authentifizierung & Autorisierung

#### FR-003.1: Login/Logout

**Priorität:** MUST  
**Status:** ✅ Implementiert

**Akzeptanzkriterien:**

- [x] Email/Password Login
- [x] Session Management via Supabase Auth
- [x] Protected Routes
- [x] Auto-Confirm Email (Development Mode)

---

#### FR-003.2: Row Level Security

**Priorität:** MUST  
**Status:** ✅ Implementiert

**Akzeptanzkriterien:**

- [x] User kann nur eigene Daten sehen
- [x] RLS Policies für alle Tabellen
- [x] Service Role nur für Admin-Tasks

---

### FR-004: Benachrichtigungs-System

#### FR-004.1: Toast-Notifications

**Priorität:** MUST  
**Status:** ✅ Implementiert

**Akzeptanzkriterien:**

- [x] Erfolgs-Meldungen (grün)
- [x] Fehler-Meldungen (rot)
- [x] Info-Meldungen (blau)
- [x] Auto-Dismiss nach 5s

---

### FR-005: Finanz-Management

#### FR-005.1: Rechnungs-Übersicht

**Priorität:** SHOULD  
**Status:** 🔄 IN ARBEIT

**User Story:**

> Als Unternehmer möchte ich alle Rechnungen einsehen können.

**Akzeptanzkriterien:**

- [ ] Tabellarische Darstellung
- [ ] Filter nach Status (bezahlt, offen, überfällig)
- [ ] Export als PDF
- [ ] Zahlungsstatus-Tracking

---

### FR-006: Reporting & Analytics

#### FR-006.1: Auftrags-Reports

**Priorität:** COULD  
**Status:** 📋 GEPLANT

**User Story:**

> Als Unternehmer möchte ich Reports über Aufträge generieren können.

**Akzeptanzkriterien:**

- [ ] Zeitraum-Filter
- [ ] Charts (Recharts)
- [ ] Export als CSV/PDF
- [ ] Metriken: Volumen, Umsatz, Durchlaufzeit

---

## 🏗️ NICHT-FUNKTIONALE ANFORDERUNGEN

### NFR-001: Performance

| Metrik                   | Zielwert | Messmethode  |
| ------------------------ | -------- | ------------ |
| Initial Load Time        | < 2s     | Lighthouse   |
| Time to Interactive      | < 3s     | Lighthouse   |
| API Response Time        | < 500ms  | Backend Logs |
| Largest Contentful Paint | < 2.5s   | Lighthouse   |

**Maßnahmen:**

- Code Splitting (Vite)
- Lazy Loading für Routes
- Image Optimization
- CDN für Assets

---

### NFR-002: Usability

**Anforderungen:**

- [x] Mobile-First Design
- [x] Touch-Targets mind. 44x44px
- [x] WCAG 2.1 AA Konformität
- [x] Keyboard-Navigation
- [x] Screen-Reader Support

**Verifizierung:**

- Lighthouse Accessibility Score > 90
- Manual Testing mit VoiceOver/NVDA

---

### NFR-003: Sicherheit

**Anforderungen:**

- [x] XSS-Prävention (DOMPurify)
- [x] CSRF-Protection (Supabase)
- [x] Input-Validation (Zod)
- [x] RLS Policies auf allen Tabellen
- [x] HTTPS-Only
- [x] Content Security Policy

**Verifizierung:**

- Security Scan (Playwright)
- OWASP Top 10 Compliance

---

### NFR-004: Wartbarkeit

**Code-Qualität:**

- TypeScript Strict Mode
- ESLint + Prettier
- Komponenten < 300 Zeilen
- Functions < 50 Zeilen
- Test Coverage > 80%

**Dokumentation:**

- Jede Komponente JSDoc-kommentiert
- README für alle Module
- Inline-Kommentare für komplexe Logik

---

### NFR-005: Skalierbarkeit

**Anforderungen:**

- Horizontal Scaling (Supabase)
- Connection Pooling
- Caching (TanStack Query)
- Pagination für alle Listen

**Load Testing:**

- 1000 concurrent users
- 10k requests/min
- < 1% error rate

---

## 🏛️ SYSTEMARCHITEKTUR

### Architektur-Diagramm

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React App (Vite) + Tailwind + Shadcn/ui            │  │
│  │  - Dashboard  - Aufträge  - Finanzen  - Einstellungen│  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS (REST + WebSocket)
┌──────────────────────┴──────────────────────────────────────┐
│              LOVABLE CLOUD (Supabase)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Auth        │  │ PostgreSQL   │  │ Edge Functions   │  │
│  │ - JWT       │  │ - RLS        │  │ - AI Chat        │  │
│  │ - Sessions  │  │ - Realtime   │  │ - Webhooks       │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
│  ┌─────────────┐  ┌──────────────┐                         │
│  │ Storage     │  │ Realtime     │                         │
│  │ - Files     │  │ - PubSub     │                         │
│  └─────────────┘  └──────────────┘                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                  EXTERNAL SERVICES                          │
│  - HERE Maps API       - Email Provider (Resend)            │
│  - AI Models (Lovable AI)  - Monitoring (Sentry)           │
└─────────────────────────────────────────────────────────────┘
```

---

### Komponenten-Struktur

```
src/
├── components/
│   ├── ui/                 # Shadcn Base Components
│   ├── design-system/      # Custom Design System Components
│   ├── dashboard/          # Dashboard-spezifische Komponenten
│   ├── orders/             # Auftrags-Komponenten
│   ├── shared/             # Geteilte Komponenten
│   └── layouts/            # Layout-Wrapper
├── hooks/                  # Custom React Hooks
├── lib/                    # Utility Functions
│   ├── utils.ts            # cn() + Helpers
│   ├── sanitize.ts         # XSS-Prevention
│   └── validation.ts       # Zod Schemas
├── pages/                  # Route Components
├── integrations/           # External APIs
│   └── supabase/           # Supabase Client (auto-generated)
└── types/                  # TypeScript Definitions
```

---

## 🗄️ DATENMODELL

### Entity-Relationship-Diagramm

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   profiles  │         │    orders    │         │   drivers   │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id (PK)     │────┐    │ id (PK)      │    ┌────│ id (PK)     │
│ user_id (FK)│    │    │ order_number │    │    │ user_id (FK)│
│ full_name   │    │    │ customer_id  │────┘    │ license     │
│ avatar_url  │    │    │ driver_id(FK)│         │ phone       │
│ role        │    │    │ pickup_addr  │         │ vehicle     │
└─────────────┘    │    │ delivery_addr│         │ status      │
                   │    │ status       │         └─────────────┘
                   │    │ created_at   │
                   │    └──────────────┘
                   │
                   │    ┌──────────────┐
                   └────│  customers   │
                        ├──────────────┤
                        │ id (PK)      │
                        │ company_name │
                        │ contact_name │
                        │ email        │
                        │ phone        │
                        └──────────────┘
```

---

### Tabellen-Definitionen

#### `profiles`

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('admin', 'dispatcher', 'driver', 'customer')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
```

---

#### `orders`

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) NOT NULL,
  driver_id UUID REFERENCES drivers(id),
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  delivery_date DATE,
  status TEXT CHECK (status IN ('pending', 'assigned', 'in_transit', 'delivered', 'cancelled')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dispatchers can manage orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('admin', 'dispatcher'))
);
CREATE POLICY "Drivers can view assigned orders" ON orders FOR SELECT USING (driver_id IN (
  SELECT id FROM drivers WHERE user_id = auth.uid()
));
```

---

## 🔌 SCHNITTSTELLEN

### REST API Endpoints

#### Orders API

```
GET    /api/orders                # List all orders (paginated)
POST   /api/orders                # Create new order
GET    /api/orders/:id            # Get order details
PUT    /api/orders/:id            # Update order
DELETE /api/orders/:id            # Delete order
PATCH  /api/orders/:id/assign     # Assign driver
```

#### Drivers API

```
GET    /api/drivers               # List all drivers
GET    /api/drivers/:id           # Get driver details
GET    /api/drivers/:id/orders    # Get driver's orders
```

---

### WebSocket Events (Supabase Realtime)

```typescript
// Orders Channel
supabase
  .channel("orders")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "orders",
    },
    (payload) => {
      // Handle INSERT, UPDATE, DELETE
    }
  )
  .subscribe();
```

---

### External APIs

#### HERE Maps API

```typescript
// Geocoding
GET https://geocode.search.hereapi.com/v1/geocode
  ?q={address}
  &apiKey={API_KEY}

// Routing
GET https://router.hereapi.com/v8/routes
  ?transportMode=car
  &origin={lat},{lng}
  &destination={lat},{lng}
  &apiKey={API_KEY}
```

---

## 🔒 SICHERHEITSANFORDERUNGEN

### Authentifizierung

- **JWT-basiert** (Supabase Auth)
- **Session-Timeout:** 1 Stunde Inaktivität
- **Refresh-Token:** 30 Tage Gültigkeit
- **Password-Policy:** Min. 8 Zeichen, 1 Großbuchstabe, 1 Zahl

### Autorisierung

- **Role-Based Access Control (RBAC)**
- **Row Level Security (RLS)** auf allen Tabellen
- **API-Keys:** Environment Variables, NIEMALS im Code

### Daten-Schutz

- **DSGVO-konform:** Recht auf Löschung, Datenexport
- **Verschlüsselung:** TLS 1.3 für alle Verbindungen
- **Backup:** Daily Automated Backups (7 Tage Retention)

### Input-Validation

```typescript
// Alle Inputs MÜSSEN validiert werden
import { z } from "zod";

const OrderSchema = z.object({
  pickup_address: z.string().min(5).max(200),
  delivery_address: z.string().min(5).max(200),
  pickup_date: z.date().min(new Date()),
  customer_id: z.string().uuid(),
});
```

---

## ✅ QUALITÄTSANFORDERUNGEN

### Code-Qualität

| Metrik            | Zielwert          | Tool          |
| ----------------- | ----------------- | ------------- |
| Test Coverage     | > 80%             | Jest          |
| TypeScript Errors | 0                 | tsc --noEmit  |
| ESLint Errors     | 0                 | ESLint        |
| Lighthouse Score  | > 90              | Lighthouse CI |
| Bundle Size       | < 500kb (gzipped) | Vite Analyzer |

---

### Testing-Strategie

```
┌─────────────────────────────────────────────┐
│  E2E Tests (Playwright)                     │
│  - User Flows  - Compliance  - Security     │
├─────────────────────────────────────────────┤
│  Integration Tests (React Testing Library)  │
│  - Components  - Hooks  - API Integration   │
├─────────────────────────────────────────────┤
│  Unit Tests (Jest)                          │
│  - Utils  - Business Logic  - Validation    │
└─────────────────────────────────────────────┘
```

**Test-Pyramide:**

- 70% Unit Tests
- 20% Integration Tests
- 10% E2E Tests

---

## 🚀 DEPLOYMENT & BETRIEB

### Deployment-Pipeline

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Git Push    │────▶│  GitHub      │────▶│  Lovable     │
│  (develop)   │     │  Actions     │     │  Preview     │
└──────────────┘     │  - Build     │     │  Environment │
                     │  - Test      │     └──────────────┘
                     │  - Lint      │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Production  │
                     │  Deploy      │
                     │  (on merge)  │
                     └──────────────┘
```

---

### Monitoring & Logging

**Tools:**

- **Error Tracking:** Sentry
- **Performance:** Lighthouse CI
- **Logs:** Supabase Logs + Browser Console
- **Uptime:** UptimeRobot

**Alerts:**

- Error Rate > 1%
- Response Time > 1s
- Downtime > 5 min

---

### Backup-Strategie

| Was      | Frequenz | Retention  | Speicherort      |
| -------- | -------- | ---------- | ---------------- |
| Database | Täglich  | 7 Tage     | Supabase Backup  |
| Files    | Täglich  | 30 Tage    | Supabase Storage |
| Code     | Bei Push | Unbegrenzt | GitHub           |

---

## 📚 ANHANG

### Glossar

| Begriff           | Definition                                |
| ----------------- | ----------------------------------------- |
| **Disposition**   | Zuweisung von Aufträgen an Fahrer         |
| **RLS**           | Row Level Security (Datenbank-Sicherheit) |
| **KPI**           | Key Performance Indicator                 |
| **Edge Function** | Serverless Function (läuft on-demand)     |

---

### Referenzen

- `docs/BESTÄTIGUNGS_PROMPT_V18.3.28.md` - Master Prompt
- `docs/DESIGN_SYSTEM_V18.3.28.md` - Design System
- `docs/FEHLERDATENBANK_V18.3.28.md` - Fehler-Log
- `DESIGN_SYSTEM_VORGABEN_V18.3.md` - Layout-Vorgaben

---

**END OF DOCUMENT**

_Dieses Pflichtenheft ist ein lebendes Dokument und wird kontinuierlich aktualisiert. Letzte Review: 2025-10-21_
