# MyDispatch Implementierungsspezifikation — Dashboard, Tarife, Zugriffe & Inhalte
Status: ✅ Production-Ready
Version: 1.1.0
Datum: 2025-11-10
Autor: Frontend Team (Engineering)

## Zusammenfassung
Diese Spezifikation legt verbindliche technische und gestalterische Anforderungen für MyDispatch (React + Vite) fest. Sie deckt Inhaltsrichtlinien für Formulare, Workflow- und Zugriffsbeschränkungen (bezahlt vs. frei, spezielle Account-Regeln), vollständige Dashboard-Layouts inkl. KPIs/Charts/CI-Farben (Main-Dashboard mit GPS-Karte und Schnellzugriff), Tarifintegration (Stripe-Produkt-/Feature-Mapping, automatische Aktivierung neuer Features) sowie Prüfdaten und ein „17 Logs“-Audit-System ab. Ziel ist eine eindeutige Grundlage für Implementierung, Tests und Betriebsdokumentation.

## Details

### 1) Inhaltsrichtlinien (Formulare)
- Unveränderbarkeit: Alle bestehenden Formularfelder bleiben erhalten. Es ist ausschließlich erlaubt, fehlende Felder zu ergänzen (keine Entfernungen, keine Umbenennungen).
- Schreibweise & Formatierung:
  - Labels: Satzfall, präzise Fachbegriffe, keine Abkürzungen ohne Glossar.
  - Platzhalter: Kontextspezifisch, keine vollständigen Sätze, maximal 5–7 Worte.
  - Fehlermeldungen: Klar, kurz, lösungsorientiert („Bitte gültige E‑Mail eingeben“).
  - Validierung: Zod-Schemata zentral, synchron mit API-Typen.
  - Barrierefreiheit: `aria-label`, konsistente Fokuszustände, Kontrast ≥ 4.5:1.
- Ergänzungen fehlender Felder: Neue Felder müssen
  - an passender Position gemäß „Layout > Section > Widget > Primitive“ eingefügt werden,
  - im zentralen Zod-Schema und in Supabase/Stripe Payloads nachvollziehbar sein,
  - i18n-Keys erhalten (de Default, en optional).
 - Standards & Inventar (verbindlich):
   - Form-Standards: Siehe `docs/FORMULAR_STANDARDS_V18.5.0.md` (Multi-Step-Patterns, Inline-Validierung, Autosave, Address-Autocomplete via HERE).
   - Feld-Inventar: Siehe `docs/FORM_FIELD_INVENTORY_V29.1.md` (80% Coverage, keine Duplikate, zentrale `FORM_FIELDS_REGISTRY`).

### 2) Workflow-Anforderungen (Zugriff & Tarife)
- Grundsatz: Nur bezahlte Tarife dürfen Funktionen nutzen. Nicht bezahlte Konten erhalten ausschließlich Lesezugriff auf Marketing/Info-Bereiche.
- Tarif-Stufen (Stripe):
  - Free (0 €): Nur öffentliche Seiten, kein Dashboard, keine CRUD.
  - Starter: Basis-Dashboard (KPIs, einfache Listen), keine GPS-Livekarte, limitierte Realtime.
  - Business: Voller Funktionsumfang inkl. GPS-Karte, Realtime, sämtliche Module.
  - Enterprise: Business + erweiterte Integrationen/SLAs.
- Spezielle Account-Regelungen:
  - `courbois1981@gmail.com`: Test-/Maintainer-Account. Erzwingt Business‑Plan (Feature‑Gate aktiv), dient der Vollverifikation aller Dashboard-Funktionen. Bei abgelaufener Zahlung → Sperre produktiver Aktionen, aber QA‑Read-Zugriff bleibt für Tests erhalten.
- Zugriffsbeschränkungen (vollständig dokumentiert):
  - Routing-Guards: Protected Routes für `/dashboard`, `/bookings`, `/drivers`, `/vehicles`, `/finance`.
  - Feature-Gates: Komponenten prüfen `accountTier` und `entitlements` (Stripe) vor Aktivierung.
  - API/CRUD: Schreiboperationen nur für `authenticated` + `paid=true` (Stripe-Webhook synchronisiert Flag). RLS Policies bleiben strikt.
  - Export/Reports: Nur `Business` oder höher.
 - Tarif/Gating-Implementierung (Registry + Webhooks):
   - Feature Registry: `entitlementKey` pro Feature; Business-Tier setzt `all_dashboard_modules=true`.
   - Webhooks: `customer.subscription.updated`, `invoice.payment_succeeded` aktualisieren `profiles.entitlements` + `paid` Flag.
   - Secrets: Keine Stripe‑Secrets im Repo; ausschließlich ENV‑Variablen gemäß `docs/API_SECRETS_MANAGEMENT_V18.5.0.md`.

### 3) Dashboard-Layout (Neukalkulation & Seitenanforderungen)
- CI-Farben: Aus `config/NEXIFY_REACT_VITE_CONFIG_V1.1.yaml` (primary, secondary, accent, surface, textPrimary, textSecondary) verwenden; keine Hardcodes.
- Jede Dashboard-Seite muss enthalten:
  - Aktuelle Charts mit CI-Farben: Line/Bar/Pie je nach Modul, responsiv, lazy geladen.
  - Relevante KPIs: Klar definierte Kennzahlen pro Bereich (siehe Liste unten).
  - Vollständige Funktionen: Listen, Details, CRUD, Filter, Suche, Pagination.
  - Realtime (wo sinnvoll): Subscriptions für Buchungen/Fahrzeuge/Fahrer.
- Hauptdashboard:
  - Zentrale GPS-Karte: Fahrzeuge/Fahrer live (Cluster, Status‑Layer: aktiv/inaktiv/besetzt).
  - Schnellzugriffs-Buttons: „Neue Buchung“, „Fahrer anrufen“, „Fahrzeug lokalisieren“, „Export“, „Finanzen“.
- KPIs je Bereich (Mindestumfang):
  - Global: Aktive Aufträge, Umsatz (Tag/Woche/Monat), Erfüllungsquote, Wartezeit Ø.
  - Buchungen: Offene, Abgeschlossen, Storniert, SLA‑Erfüllung, Durchschnittliche Fahrtdauer.
  - Fahrer: Aktive Fahrer, Verfügbarkeit, Top‑Leistung (Umsatz), Schichtstatus.
  - Fahrzeuge: Aktive Fahrzeuge, Wartungsstatus, Auslastung, Kilometer Ø.
  - Finanzen: Einnahmen, Ausgaben, Deckungsbeitrag, offene Rechnungen, Zahlungsstatus.
 - Charts & CI (verbindlich):
   - Vendor: `recharts` (HEX‑Farben erforderlich).
   - Chart‑Farben: Gemäß `docs/DESIGN_SYSTEM_CHART_COLORS_V18.3.md` und `config/NEXIFY_REACT_VITE_CONFIG_V1.1.yaml.visualization.charts.colors_hex`.
   - Accessibility: Kontrast ≥ 4.5:1, keine farb‑exklusiven Unterscheidungen; Tooltips mit `.recharts-tooltip--dashboard`.

### 4) Tarifintegration (Stripe)
- Automatische Integration neuer Features:
  - Feature Registry: Jedes neue Feature wird mit `entitlementKey` registriert und einem Stripe‑Produkt/Preis zugeordnet.
  - Webhooks: `customer.subscription.updated`, `invoice.payment_succeeded` aktualisieren `entitlements` in der Nutzerprofil‑Tabelle.
  - Business‑Tarif: Muss alle Dashboard-Funktionen abbilden (siehe KPIs/Charts/Map/Schnellzugriff). Entitlements für Business = „all_dashboard_modules=true“.
- Nur bezahlte Leistungen nutzbar:
  - Feature‑Gate: Komponenten checken `entitlements[feature] === true`. Bei false → Disabled‑State + CTA „Tarif upgraden“.
  - API‑Gate: Schreibend nur, wenn `paid=true` (serverseitig geprüft, clientseitig beworben).
 - Secrets‑Management: Gemäß `docs/API_SECRETS_MANAGEMENT_V18.5.0.md` ausschließlich ENV‑Variablen nutzen; keinerlei Secrets in Code/Repo; keine Ausgabe in Logs.

### 5) Dokumentation & Prüfdaten
- Zusammenfassung: Diese Spezifik deckt Inhalte, Workflows, Layouts, Tarife, Prüfungen und Audit.
- Prüfdaten (Verifikation):
  - Accounts:
    - Business QA: `courbois1981@gmail.com` → `accountTier=business`, `paid=true`, `entitlements=*`.
    - Starter: `starter.test@mydispatch.local` → eingeschränkte Entitlements (kein Map‑Live).
  - Stripe (Platzhalter): `PRODUCT_DASHBOARD_BUSINESS`, `PRICE_BUSINESS_MONTHLY`, `FEATURE_GPS_MAP`, `FEATURE_EXPORTS`, `FEATURE_REALTIME`.
  - Supabase Tabellen: `bookings`, `drivers`, `vehicles` mit min. 10 QA‑Einträgen und realistischen Zeitstempeln.
- „17 Logs“ — Audit/Telemetry Mindestumfang:
  1. Auth Login/Logout
  2. Account Tier Change
  3. Stripe Subscription Update
  4. Entitlement Evaluation
  5. Route Guard Access Denied
  6. API Request (CRUD Bookings)
  7. API Request (Drivers/Vehicles)
  8. Realtime Subscription State
  9. Map Render/Update Event
  10. KPI Calculation Snapshot
  11. Chart Render (Module/Theme)
  12. Feature Gate Trigger
  13. Export Trigger (Finance/Bookings)
  14. Error Boundary Capture
  15. Rate Limit/Throttle Event
  16. Cache Hit/Miss (Query)
  17. Security Policy Violation (CSP/RLS)
- Log‑Schema (JSON):
  ```json
  {
    "ts":"2025-11-10T12:00:00Z",
    "userId":"uuid",
    "email":"string",
    "accountTier":"free|starter|business|enterprise",
    "event":"string",
    "entity":"bookings|drivers|vehicles|finance|map|auth|stripe|kpi|chart|feature",
    "status":"ok|warn|error",
    "details":{},
    "durationMs":123,
    "correlationId":"uuid"
  }
  ```

## Validierung
- Gating‑Tests:
  - Starter vs. Business: Starter darf keine GPS‑Livekarte/Exports; Business darf alle Dashboard‑Funktionen.
  - `courbois1981@gmail.com`: Vollzugriff Business; bei `paid=false` → Schreiboperationen gesperrt, Read für QA erlaubt.
- UI‑Tests: Charts zeigen CI‑Farben, KPIs sind befüllt, Schnellzugriff sichtbar.
- API‑Tests: CRUD verweigert bei `paid=false`; erlaubt bei `paid=true`.
- Logs: Mindestens 17 Event‑Kategorien erzeugen Einträge mit korrektem Schema.
 - Accessibility‑Validierung: WCAG 2.2 AA via `docs/ACCESSIBILITY_GOVERNANCE_V19.0.0.md` Checkliste (Kontrast, Fokus, ARIA, Tastatur).
 - Routing‑Validierung: Guards & ErrorBoundaries gemäß `docs/ROUTING_SYSTEM_V18.5.1.md` (keine verschachtelten Scroll‑Container, kontextsensitiv).
 - RLS‑Validierung: Supabase Policies gemäß `docs/SECURITY_RLS_POLICIES_DOCUMENTATION_V18.5.1.md` (Company‑Isolation, granularer Zugriff).

## Referenzen
- `config/NEXIFY_REACT_VITE_CONFIG_V1.1.yaml` — Design, Routing, Security, QA
- `docs/MASTER_INDEX_V18.5.1.md` — Zentrale Indexierung
- `docs/DEVELOPMENT/TESTING_GUIDE.md` — Tests & Abdeckung
- `docs/ARCHITECTURE/FRONTEND_STRUCTURE.md` — Struktur & Patterns
- `docs/TECHNICAL/DATABASE_SCHEMA.md` — Tabellen & Beziehungen
- `docs/NEXIFY_WIKI_V1.0.md` — Agent‑Startpunkt & Vorgaben
 - `docs/DESIGN_SYSTEM_CHART_COLORS_V18.3.md` — CI‑konforme Chart‑Farben
 - `docs/API_SECRETS_MANAGEMENT_V18.5.0.md` — Secrets‑Management Prinzipien
 - `docs/SECURITY_RLS_POLICIES_DOCUMENTATION_V18.5.1.md` — RLS‑Policies
 - `docs/ACCESSIBILITY_GOVERNANCE_V19.0.0.md` — WCAG‑Governance
 - `docs/FORMULAR_STANDARDS_V18.5.0.md`, `docs/FORM_FIELD_INVENTORY_V29.1.md` — Formularstandards & Inventar
