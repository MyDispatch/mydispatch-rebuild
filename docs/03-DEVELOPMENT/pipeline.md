# MyDispatch Pipeline & GitKraken Konfiguration (V45.0)

## Übersicht
- CI: Lint, Type-Check, Build, Unit-Tests, optionale E2E, Security Audit, Lighthouse CI.
- CD: Vercel Deployment auf `main` mit Post-Deploy Smoke/E2E.
- Supabase: Migrations, Edge Functions, RLS Coverage Audit.
- Git-Flow: `main` (stabil), `develop` (Integration), `feature/*`, `release/*`, `hotfix/*`.

## CI Details (GitHub Actions)
- Lint: `npm run lint` (Fehler blockieren Merge).
- Type-Check: `npm run type-check` (Fehler blockieren Merge).
- Unit-Tests: `npm run test:unit` (Fehler blockieren Merge).
- E2E: `npm run test:e2e` nach `npx playwright install --with-deps` (optional, toleriert Fehler).
- Performance: `npx @lhci/cli autorun` mit `lighthouserc.json` (optional, toleriert Fehler).
- Security: `npm audit --audit-level=moderate` (optional, toleriert Fehler).

## CD Details (Vercel)
- Trigger: Push auf `main`.
- Secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` im Repo hinterlegen.
- Build: `npm ci && npm run build` vor Deployment.
- Post-Deploy: `npm run test:smoke` und `npm run test:e2e:prod` (optional).

## Supabase Deployment
- CLI Setup: `supabase/setup-cli@v1`.
- Link: `supabase link --project-ref <ref>` mit `SUPABASE_ACCESS_TOKEN`.
- Migrations: `supabase db push`.
- Functions: `supabase functions deploy`.
- RLS Audit: `npm run check:rls` mit `SUPABASE_URL` und `SUPABASE_SERVICE_ROLE_KEY`.

## Lokale Quality Gates (Husky)
- Pre-Commit: Type-Check, Lint, Prettier Check, Unit-Tests (geänderte Files), optional RLS Check.
- Install: `npx husky install` bei frischem Clone, falls Hooks nicht aktiv sind.

## GitKraken Richtlinien
- Default Branch: `main` (angepasst in `.gitkraken`).
- Protected Branches: `main`, `master`, `production`.
- Git-Flow: aktiviert mit `develop` und Prefixes für Feature/Release/Hotfix.
- Konventionelle Commits: aktiv, Template hinterlegt.
- Hooks: Verwende Husky Hooks – GitKraken erkennt sie automatisch.

## Entwickler-Setup
1. `npm install`
2. `npm run dev` (Vite) oder `npm start` (Express auf `dist`)
3. `npx playwright install --with-deps` für E2E lokal
4. Supabase `.env` gemäß `supabase/.env.setup` setzen für RLS-Checks

## Troubleshooting
- Vite nicht erkannt: `npm install` ausführen und erneut `npm run dev`.
- LHCI fehlend: CI nutzt `npx @lhci/cli autorun`, lokal optional `npm i -D @lhci/cli`.
- Hooks in GitKraken: Wenn Husky nicht greift, `npx husky install` ausführen.

## Compliance
- Entspricht V45.0 Premium Vibrant Design System und Dev-Standards.
