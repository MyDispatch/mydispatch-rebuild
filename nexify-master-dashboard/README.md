# NeXifyAI MASTER Dashboard

Eigenständige PWA-Konsole für den NeXifyAI MASTER Agenten. Dient als Kontrollzentrum für Wissensabgleich, Workflows, Monitoring und Self-Extension.

## Features
- React 18 + Vite + TypeScript + Tailwind (Dark-Mode optimiert)
- Offline-fähig via `vite-plugin-pwa`
- Agent Command Center (Chat, Kontext-Checks, Workflow-Launcher)
- Monitoring-Übersicht für Supabase, Edge Functions, Deployments
- Plugin-Registry mit Manifest-Import für Self-Extension
- Settings-Seite für ENV- und Sicherheitskonfigurationen

## Quickstart
```bash
npm install
npm run dev
```

## Build & Tests
```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Konfiguration
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
- `VITE_MASTER_AGENT_API_URL`
- `VITE_MASTER_ADMIN_EMAIL`
- `VITE_MASTER_ADMIN_PASSWORD`

Lege diese Variablen lokal in `.env` und auf Vercel als Environment Variables an.

## Deployment (Vercel)
1. Neues GitHub-Repository erstellen und Projekt pushen.
2. Vercel-Projekt verbinden (Framework: Vite, Node.js 20).
3. Passwortschutz aktivieren (`VERCEL_PASSWORD_PROTECTION`) oder Middleware hinzufügen.
4. `npm run build` als Build-Kommando; `dist/` wird automatisch deployed.
5. Nach Deployment Smoke Tests: Login, Agent-Bootstrap, Workflow-Trigger, PWA-Install.

## Supabase Schema
- getrenntes Schema `nexify_master` verwenden
- Tabellen lt. `docs/NEXIFY_MASTER_DASHBOARD_REQUIREMENTS.md`
- RLS für `master` (Vollzugriff) und `observer` (Readonly) aktivieren

## Weiterentwicklung
- Cursor Remote API anbinden (Endpoint in `.env`)
- Edge Functions `master-session-init`, `master-run-command`, `master-plugin-exec`
- GitHub Actions Pipeline (Lint, Test, Build, Deploy)

> Siehe `docs/NEXIFY_MASTER_DASHBOARD_REQUIREMENTS.md` für vollständige Richtlinien.
