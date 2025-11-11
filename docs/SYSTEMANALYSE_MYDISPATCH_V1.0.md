# Systemanalyse MyDispatch
Status: Draft
Version: 1.0.0
Datum: 2025-11-10
Autor: Engineering

## Zusammenfassung
Systemweite Analyse der MyDispatch Plattform (React+Vite, Supabase, React Router v6, TanStack Query). Fokus auf Kunden-, Fahrer- und Unternehmerportal, Architektur, Codebasis und Abhängigkeiten.

## Details
- Plattform: `React + Vite` mit `TailwindCSS`, `React Router v6` (lazy, prefetch), `TanStack Query`, `Supabase` (DB, Auth, Edge Functions).
- Routing: Beispiele gemäß `config/NEXIFY_REACT_VITE_CONFIG_V1.1.yaml` mit Marketing und App-Routen.
- State: Query-First, ergänzt durch Contexts; Wiki-Integration über `use-nexify-wiki.ts` und API-Hooks.
- Datenbank: Supabase Tabellen wie `bookings`, `drivers`; RLS und Templates vorhanden.
- Integrationen: Supabase Edge Functions (`brain-query`, `health-check`, `manage-docs`), Resend für E-Mail vorgesehen.
- Sicherheit: ENV-gestützte Konfiguration; harte URLs/Keys in Scripts bereinigt.

## Validierung
- Build-Check lokal (Vite Dev Server) und Preview getestet.
- Wiki-Hook besitzt Offline-Guard, verhindert Fehler bei fehlenden ENV.
- Scripts aktualisiert für ENV-basierte Nutzung (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).

## Referenzen
- `src/hooks/use-nexify-wiki.ts`
- `scripts/setup-autonomous-system.ts`
- `scripts/test-autonomous-system.ts`
- `config/NEXIFY_REACT_VITE_CONFIG_V1.1.yaml`

