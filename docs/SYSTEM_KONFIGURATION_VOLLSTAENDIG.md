# 🔧 MyDispatch - Vollständige System-Konfiguration

**Erstellt:** 2025-01-31  
**Version:** 1.0.0  
**Autor:** NeXify AI MASTER  
**Status:** ✅ VOLLSTÄNDIG  
**Zweck:** Zentrale Dokumentation aller System-Konfigurationen

---

## 📋 INHALTSVERZEICHNIS

1. [Supabase-Konfiguration](#1-supabase-konfiguration)
2. [Stripe-Konfiguration](#2-stripe-konfiguration)
3. [HERE API-Konfiguration](#3-here-api-konfiguration)
4. [n8n Workflow-Automatisierung](#4-n8n-workflow-automatisierung)
5. [Edge Functions Konfiguration](#5-edge-functions-konfiguration)
6. [Environment Variables](#6-environment-variables)
7. [Frontend-Konfiguration](#7-frontend-konfiguration)
8. [CI/CD-Konfiguration](#8-cicd-konfiguration)
9. [Monitoring & Logging](#9-monitoring--logging)

---

## 1. SUPABASE-KONFIGURATION

### 1.1 Projekt-Informationen

**Projekt-ID:** `vsbqyqhzxmwezlhzdmfd`  
**Projekt-URL:** `https://vsbqyqhzxmwezlhzdmfd.supabase.co`  
**Region:** EU (Frankfurt)  
**Database:** PostgreSQL 15

### 1.2 Authentication

**Provider:**
- Email/Password ✅
- OAuth (optional)

**Konfiguration:**
- Email-Verifizierung: **Optional** (für Production: Aktivieren)
- Password-Reset: ✅ Aktiviert
- Session-Dauer: Standard (1 Woche)

### 1.3 Database Schema

**Hauptschemas:**
- `public` - Hauptschema für App-Daten
- `auth` - Supabase Auth Schema
- `nexify_ai_master_knowledge_base` - AI Knowledge Base Schema

**Wichtige Tabellen:**
- `profiles` - User-Profile
- `companies` - Unternehmen
- `bookings` - Aufträge
- `drivers` - Fahrer
- `vehicles` - Fahrzeuge
- `customers` - Kunden
- `partners` - Partner-Unternehmen
- `invoices` - Rechnungen
- `quotations` - Angebote
- `documents` - Dokumente
- `user_roles` - RBAC-Rollen

### 1.4 Row Level Security (RLS)

**Status:** ✅ Aktiviert für alle Tabellen

**Policies:**
- User können nur eigene Daten sehen
- Company-basierte Zugriffskontrolle
- Master-Role hat Vollzugriff

### 1.5 Storage

**Buckets:**
- `documents` - Dokumenten-Uploads (Private)
- `logos` - Firmenlogos (Public)
- `master-chat` - Master-Chat Uploads (Private)

**Konfiguration:**
- File-Size-Limit: 10MB (dokumente), 5MB (logos)
- Erlaubte Formate: PDF, JPG, PNG, DOCX

### 1.6 Realtime

**Aktivierte Channels:**
- `bookings` - Auftrags-Updates
- `drivers` - Fahrer-Updates
- `vehicles` - Fahrzeug-Updates
- `customers` - Kunden-Updates

---

## 2. STRIPE-KONFIGURATION

### 2.1 API-Keys

**Environment Variables:**
- `STRIPE_SECRET_KEY` - Secret Key (Edge Functions)
- `STRIPE_PUBLISHABLE_KEY` - Publishable Key (Frontend)

**Status:** ✅ Konfiguriert

### 2.2 Products & Prices

**Starter-Tarif:**
- Product ID: `prod_TEeg0ykplmGKd0` (Monthly), `prod_TF5cFE5Fi5rBCz` (Yearly)
- Price ID Monthly: `price_1SIBMrLX5M8TT990zBX6gWOm`
- Price ID Yearly: `price_1SIbRALX5M8TT990B81vhHPT`
- Preis: 39€/Monat, 374,40€/Jahr

**Business-Tarif:**
- Product ID: `prod_TEegHmtpPZOZcG` (Monthly), `prod_TF5cnWFZYEQUsG` (Yearly)
- Price ID Monthly: `price_1SIBN9LX5M8TT990mxE8owxm`
- Price ID Yearly: `price_1SIbRKLX5M8TT990e1vX4ebf`
- Preis: 99€/Monat, 950,40€/Jahr

**Enterprise-Tarif:**
- Product ID: `prod_ENTERPRISE_ID_PLACEHOLDER` (auf Anfrage)
- Preis: Auf Anfrage

### 2.3 Webhooks

**Endpoint:** `https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/stripe-webhook`

**Events:**
- `checkout.session.completed` - Subscription erstellt
- `customer.subscription.updated` - Subscription aktualisiert
- `customer.subscription.deleted` - Subscription gekündigt
- `invoice.payment_succeeded` - Zahlung erfolgreich
- `invoice.payment_failed` - Zahlung fehlgeschlagen

### 2.4 Customer Portal

**Status:** ✅ Aktiviert  
**URL:** Wird von Stripe bereitgestellt

---

## 3. HERE API-KONFIGURATION

### 3.1 API-Keys

**Environment Variables:**
- `HERE_API_KEY` - API Key (Edge Functions)

**Status:** ✅ Konfiguriert

### 3.2 Services

**Verwendete Services:**
- **Geocoding** - Adressen → Koordinaten
- **Routing** - Routenberechnung
- **Traffic** - Live-Verkehrsdaten
- **Weather** - Wettervorhersage

**Edge Functions:**
- `geocode-address` - Adress-Geocoding
- `get-here-api-key` - API-Key-Verwaltung
- `get-traffic` - Verkehrsdaten
- `get-weather` - Wetterdaten

### 3.3 Rate Limits

**Limits:**
- Geocoding: 250 requests/day (Free Tier)
- Routing: 250 requests/day (Free Tier)
- Traffic: 250 requests/day (Free Tier)

---

## 4. N8N WORKFLOW-AUTOMATISIERUNG

### 4.1 Konfiguration

**Status:** ✅ Integriert (n8n Cloud)

**Edge Function:**
- `n8n-workflow-management` - Workflow-Verwaltung

### 4.2 Workflows

**Aktive Workflows:**
- Buchungs-Bestätigung (Email)
- Rechnungserstellung (Automatisch)
- Dokument-Ablauf-Erinnerungen
- GPS-Daten-Cleanup
- Daily Reports

**Konfiguration:**
- Webhook-URLs werden dynamisch generiert
- API-Keys werden in Edge Functions verwaltet

---

## 5. EDGE FUNCTIONS KONFIGURATION

### 5.1 Allgemeine Konfiguration

**Project ID:** `vsbqyqhzxmwezlhzdmfd`  
**Region:** EU (Frankfurt)

### 5.2 Wichtige Edge Functions

**Authentication:**
- `create-checkout` - Stripe Checkout (verify_jwt: true)
- `check-subscription` - Subscription-Status (verify_jwt: true)

**AI-Features:**
- `ai-smart-assignment` - Intelligente Fahrerzuweisung
- `ai-support-chat` - AI-Chatbot
- `ai-document-ocr` - Dokument-OCR

**Business Logic:**
- `geocode-address` - Adress-Geocoding
- `send-booking-email` - Buchungs-Emails
- `create-public-booking` - Öffentliche Buchungen

**Master-System:**
- `master-chat` - Master-Chat (verify_jwt: true)
- `nexify-project-management` - Projekt-Management
- `nexify-compliance-automation` - Compliance-Checks

### 5.3 Environment Variables

**Alle Edge Functions:**
- `SUPABASE_URL` - Automatisch gesetzt
- `SUPABASE_SERVICE_ROLE_KEY` - Automatisch gesetzt

**Spezifische Variables:**
- `STRIPE_SECRET_KEY` - Für `create-checkout`
- `HERE_API_KEY` - Für `geocode-address`, `get-traffic`, `get-weather`
- `N8N_API_KEY` - Für `n8n-workflow-management`

---

## 6. ENVIRONMENT VARIABLES

### 6.1 Frontend (.env)

```env
VITE_SUPABASE_URL=https://vsbqyqhzxmwezlhzdmfd.supabase.co
VITE_SUPABASE_ANON_KEY=<ANON_KEY>
VITE_APP_URL=https://my-dispatch.de
```

### 6.2 Edge Functions

**Automatisch gesetzt:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**Manuell zu setzen:**
- `STRIPE_SECRET_KEY`
- `HERE_API_KEY`
- `N8N_API_KEY`

### 6.3 Supabase Dashboard

**Settings → Edge Functions → Secrets:**
- Alle Secrets hier konfigurieren
- Werden automatisch an alle Functions weitergegeben

---

## 7. FRONTEND-KONFIGURATION

### 7.1 Build-Konfiguration

**Framework:** React 18 + Vite  
**TypeScript:** ✅ Aktiviert  
**Path Aliases:** `@/` → `src/`

### 7.2 Routing

**Router:** React Router v6  
**Layouts:**
- `MarketingLayout` - Marketing-Seiten
- `AppLayout` - App-Bereich
- `PortalLayout` - Kunden-Portal
- `DriverLayout` - Fahrer-App

### 7.3 State Management

**React Query:** ✅ Für Server-State  
**Context API:** ✅ Für Auth, Subscription, QuickActions  
**Zustand:** ✅ Für lokalen State (optional)

### 7.4 Design System

**Version:** V28.1 / V32.1  
**Komponenten:** shadcn/ui + Custom Components  
**Farben:** Professional Gray-Blue Palette  
**Responsive:** Mobile-First

---

## 8. CI/CD-KONFIGURATION

### 8.1 GitHub Actions

**Workflows:**
- `ci-quality-assurance.yml` - Quality Checks
- Pre-commit Hooks (Husky)

### 8.2 Quality Checks

**Tests:**
- Unit Tests (Vitest)
- E2E Tests (Playwright)
- Performance Tests (Lighthouse)

**Linting:**
- ESLint (TypeScript)
- Prettier (Code-Formatting)

### 8.3 Deployment

**Frontend:**
- Vercel/Netlify (automatisch via Git)
- Environment Variables müssen gesetzt werden

**Edge Functions:**
- Supabase CLI: `supabase functions deploy <function-name>`

---

## 9. MONITORING & LOGGING

### 9.1 Logging

**Frontend:**
- `@/lib/logger` - Zentrale Logging-Funktion
- Log-Level: debug, info, warn, error

**Edge Functions:**
- `console.log()` - Wird in Supabase Dashboard angezeigt
- Structured Logging empfohlen

### 9.2 Error Tracking

**Frontend:**
- Error Boundaries (React)
- Error Handler: `@/lib/error-handler`

**Edge Functions:**
- Try-Catch-Blocks
- Error-Responses mit Status-Codes

### 9.3 Monitoring

**Supabase Dashboard:**
- Edge Function Logs
- Database Performance
- API Usage

**Custom Monitoring:**
- `watchdog-monitor` Edge Function (optional)

---

## 📋 KONFIGURATIONS-CHECKLISTE

### Initial Setup:
- [ ] Supabase Projekt erstellt
- [ ] Database Migrations ausgeführt
- [ ] RLS Policies konfiguriert
- [ ] Storage Buckets erstellt
- [ ] Stripe Account konfiguriert
- [ ] HERE API Key erstellt
- [ ] n8n Account erstellt (optional)
- [ ] Edge Functions deployed
- [ ] Environment Variables gesetzt

### Tägliche Wartung:
- [ ] Edge Function Logs prüfen
- [ ] Database Performance prüfen
- [ ] Stripe Webhooks prüfen
- [ ] API Usage Limits prüfen

---

**Pascal, alle System-Konfigurationen sind dokumentiert!** 🚀











