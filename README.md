# MyDispatch - Taxi & Mietwagen Management System

**Status:** ✅ PRODUCTION-READY
**Version:** V32.5
**Datum:** 2025-01-31
**Entwickelt von:** NeXify (Pascal)
**Betreuung:** NeXify - Dauerhafte Entwicklung & Support

## Project info

**Website:** https://my-dispatch.de
**URL**: https://lovable.dev/projects/532d4c5b-6df3-4e1c-93e4-4632fcf0ef9b
**Supabase Projekt-ID:** `ygpwuiygivxoqtyoigtg`

## 🚀 Quick Start

```sh
# Clone repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
npm run test:e2e

# Validate Hero backgrounds (V31.5)
npm run validate:hero
```

## 📋 Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production (TypeScript check + Vite build)
- `npm run preview` - Preview production build
- `npm run lint` - ESLint code linting
- `npm run format` - Format code with Prettier
- `npm test` - Run unit tests (Vitest)
- `npm run test:ui` - Run tests with UI
- `npm run test:e2e` - Run E2E tests (Playwright)
- `npm run test:e2e:ui` - Run E2E tests with UI
- `npm run validate:hero` - Validate Hero background compliance (V31.5)

## 🎨 Hero System V31.5

All hero sections MUST use `backgroundVariant="3d-premium"` for visual consistency.

**Validation:**
```bash
npm run validate:hero
```

**Documentation:**
- [Hero Background Standard V31.5](./docs/HERO_BACKGROUND_STANDARD_V31.5.md)
- [Hero Design Rules](./docs/V28_HERO_DESIGN_RULES.md)

## Core Features

- **Auftragsverwaltung**: Vollständiges Disposition-System für Taxi- und Mietwagenunternehmen
- **Fahrer & Fahrzeuge**: Verwaltung von Personal, Fahrzeugen und Dokumenten
- **Kunden & Partner**: CRM und Partner-Netzwerk-Management
- **Schichtzettel**: Automatische Erfassung und Verwaltung von Arbeitszeiten
- **Rechnungsstellung**: Professionelle Rechnungserstellung mit PDF-Export
- **GPS-Tracking**: Live-Tracking von Fahrzeugen und Fahrern
- **Mobile-optimiert**: Vollständig responsive für alle Geräte

## Technologies

- **Frontend**: React 18, TypeScript, Vite
- **UI**: shadcn-ui (42+ Components), Tailwind CSS
- **Design System**: V28.1 (PRODUCTION)
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Maps**: HERE Maps API (Routing, Geocoding)
- **Payments**: Stripe
- **Testing**: Vitest, Playwright
- **Monitoring**: Sentry, Web Vitals

## Project Structure

```
mydispatch-rebuild/
├── src/
│   ├── components/          # UI Components
│   │   ├── design-system/   # V28.1 Design System
│   │   ├── pricing/         # V28.1 Pricing Components
│   │   ├── layout/          # Layout Components (FROZEN)
│   │   └── ui/              # shadcn/ui Components
│   ├── pages/               # Application Pages
│   ├── lib/                 # Utilities & Helpers
│   ├── hooks/               # React Hooks
│   └── integrations/        # External Integrations
├── docs/                    # Dokumentation
│   ├── NEXIFY_WIKI_V1.0.md  # Haupt-Wiki
│   ├── COMPONENT_REGISTRY_V28.1.md
│   ├── FORGET_PROOF_SYSTEM_V1.0.md
│   └── MYDISPATCH_VOLLSTAENDIGE_ANALYSE_V1.0.md
├── supabase/                # Supabase Config
│   ├── migrations/          # Database Migrations
│   └── functions/          # Edge Functions
└── PROTECTION.md            # Repository Protection Rules
```

## Repository Protection

**⚠️ WICHTIG:** Dieses Repository ist durch Schutz-Regeln geschützt!

- ✅ Design System V28.1 - IMMER VERWENDEN
- ✅ Layout System - FROZEN (keine Änderungen ohne Genehmigung)
- ✅ Hero System V31.5 - MANDATORY (`backgroundVariant="3d-premium"`)
- ✅ Component Registry - MANDATORY CHECK vor jeder neuen Component

**Details:** Siehe [`PROTECTION.md`](./PROTECTION.md)

## Development

```sh
# Clone repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start development server
npm run dev
```

## Deployment

Open [Lovable](https://lovable.dev/projects/532d4c5b-6df3-4e1c-93e4-4632fcf0ef9b) → Share → Publish

## Custom Domain

Navigate to Project > Settings > Domains → [Connect Domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
