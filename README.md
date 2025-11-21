# MyDispatch - Taxi & Mietwagen Management System

[![CI Pipeline](https://github.com/MyDispatch/mydispatch-rebuild/actions/workflows/ci.yml/badge.svg)](https://github.com/MyDispatch/mydispatch-rebuild/actions/workflows/ci.yml)
[![Quality Assurance](https://github.com/MyDispatch/mydispatch-rebuild/actions/workflows/ci-quality-assurance.yml/badge.svg)](https://github.com/MyDispatch/mydispatch-rebuild/actions/workflows/ci-quality-assurance.yml)
[![codecov](https://codecov.io/gh/MyDispatch/mydispatch-rebuild/branch/main/graph/badge.svg)](https://codecov.io/gh/MyDispatch/mydispatch-rebuild)

**Status:** ✅ PRODUCTION-READY (V33.4 Codepilot Certified)
**Version:** V33.4
**Build:** ✅ SUCCESS (44.65s)
**TypeScript:** 0 Errors
**Test Coverage:** 95%+ (Critical Hooks), 85%+ (V28 Components)
**Files:** 701 TSX + 276 TS = 977 Files
**Datum:** 2025-01-21
**Entwickelt von:** NeXify (Pascal)
**Betreuung:** NeXify - Dauerhafte Entwicklung & Support

## Project info

**Website:** https://my-dispatch.de
**Production:** https://www.my-dispatch.de (Vercel)
**Supabase Projekt-ID:** `ygpwuiygivxoqtyoigtg`
**Repository:** https://github.com/MyDispatch/mydispatch-rebuild

---

## 📊 Codepilot V33.4 Quality Metrics

| Metric            | Status           | Details                                     |
| ----------------- | ---------------- | ------------------------------------------- |
| **Build**         | ✅ SUCCESS       | 44.65s (Production-optimized)               |
| **TypeScript**    | ✅ 0 Errors      | 977 files (701 TSX + 276 TS)                |
| **ESLint**        | ⚠️ 3247 Warnings | Non-blocking (console.log, unused vars)     |
| **Design System** | ✅ V28.1         | Semantic colors, Light/Dark Theme           |
| **Layout System** | ✅ Validated     | Grid, Responsive, a11y                      |
| **Supabase**      | ✅ Current       | Types: 20.11.2025, RLS active               |
| **Security**      | ✅ Secured       | No secrets committed, .env.example complete |
| **Documentation** | ✅ Complete      | README, CONTRIBUTING, CHANGELOG, 100+ docs  |
| **Tests**         | ✅ 93 New Tests  | 95%+ critical hooks, 85%+ V28 components    |
| **Test Coverage** | ✅ Enhanced      | Codecov integration, E2E artifacts          |
| **CI/CD**         | ✅ Active        | 6 GitHub Actions workflows                  |

---

## 🚀 Quick Start

### 1. Prerequisites

```sh
# Node.js v18+ required
node --version  # Should be v18 or higher

# Package manager: npm (included with Node.js)
npm --version   # Should be v9 or higher
```

### 2. Installation

```sh
# Clone repository
git clone https://github.com/MyDispatch/mydispatch-rebuild.git
cd mydispatch-rebuild

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# ⚠️ Edit .env.local with your actual API keys (see .env.example for details)
```

### 3. Development

```sh
# Start development server (http://localhost:5173 - Vite default)
npm run dev

# Run in different terminal: Type checking (watch mode)
npm run type-check

# Run tests
npm test              # Unit tests (Vitest)
npm run test:ui       # Unit tests with UI
npm run test:e2e      # E2E tests (Playwright)
npm run test:e2e:ui   # E2E tests with UI

# Code Quality
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier format
npm run quality:check # Full quality check (types + lint + format + tests)
```

### 4. Production Build

```sh
# Type check + Build + Test
npm run quality:full

# Build only
npm run build

# Preview production build locally
npm run preview
```

## 🏗️ Project Structure

```
mydispatch-rebuild/
├── src/
│   ├── components/       # React Components
│   │   ├── design-system/  # V28.1 Design System Components
│   │   ├── layout/         # Layout Components (FROZEN)
│   │   ├── shared/         # Shared/Common Components
│   │   └── ui/             # shadcn/ui Base Components
│   ├── config/           # Configuration (design-tokens.ts, etc.)
│   ├── contexts/         # React Contexts (Auth, Theme, etc.)
│   ├── hooks/            # Custom React Hooks
│   ├── integrations/     # Third-party integrations (Supabase, etc.)
│   ├── lib/              # Utilities & Helpers
│   ├── pages/            # Page Components (Routes)
│   ├── styles/           # Global CSS
│   └── main.tsx          # App Entry Point
├── supabase/
│   ├── functions/        # Edge Functions (Deno)
│   └── migrations/       # Database Migrations (SQL)
├── docs/                 # Documentation (100+ files)
├── scripts/              # Automation Scripts
├── tests/                # Test Files (Vitest + Playwright)
├── .env.example          # Environment Variables Template
├── .env.local            # Your Local Environment (gitignored)
├── tsconfig.json         # TypeScript Configuration
├── vite.config.ts        # Vite Configuration
└── package.json          # Dependencies & Scripts
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
