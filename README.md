# MyDispatch - Taxi & Mietwagen Management

## Project info

**URL**: https://lovable.dev/projects/532d4c5b-6df3-4e1c-93e4-4632fcf0ef9b

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

- **Frontend**: React, TypeScript, Vite
- **UI**: shadcn-ui, Tailwind CSS
- **Backend**: Lovable Cloud (Supabase)
- **Maps**: HERE Maps API
- **Payments**: Stripe

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
