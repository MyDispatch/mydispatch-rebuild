# ANALYSE IST-ZUSTAND (MyDispatch Frontend)
Status: Production-Ready
Version: 1.0.0
Datum: 2025-11-10
Autor: Engineering

## Zusammenfassung
Systemweite IST-Analyse des React + Vite Frontends mit Fokus auf Supabase-Integration, Datenfluss, Performance (TanStack Query), Fehlerbehandlung und UI/UX. Dokument verknüpft Code-Pfade und nennt identifizierte Risiken, Engpässe und Optimierungspotenziale.

## Details
- Architektur & Einstiegspunkte
  - Routing: `src/App.tsx` nutzt `BrowserRouter` und `Routes`; Single Source of Truth via `src/routes/routes.config.tsx`.
  - Server-State: TanStack Query über `src/lib/query-client.ts` und `src/lib/react-query/`. Caching-Optionen in `src/lib/react-query/query-options.ts` konsolidiert.
  - API-Layer: `src/lib/hooks/useApi.ts` mit `createApiClient`, typ-sichere Aufrufe, `useQuery`/`useMutation`-Wrapper vorhanden.

- Supabase-Integration
  - Client: `src/integrations/supabase/client.ts` initialisiert via `getSupabaseEnv()` aus `src/integrations/supabase/env.ts`.
  - Env-Handling: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`; Offline-Dev-Modus unterstützt via `VITE_OFFLINE_DEV=true`.
  - Datenbankverbindungen: Hooks (u. a. `use-bookings.tsx`, `use-partners.tsx`, `use-documents.tsx`) verwenden `supabase.from(...).select(...)` mit RLS-konformen Filtern (`company_id`).
  - Abfrageperformance: Default `staleTime` 5 Min, `gcTime` 10 Min, `retry` 2x; Echtzeit-Dashboards mit `refetchInterval` 60s; Factory-basierte Query-Keys in `src/lib/react-query/query-keys.ts` vorhanden.

- Fehlerbehandlung & Logging
  - Zentrale Handler: `src/lib/error-handler.ts` (Toast, Supabase-Logging optional), `src/lib/logger.ts` (Log-Levels, Sanitizing), `src/lib/error-tracker.ts` (Kategorisierung, Deduplizierung).
  - Nutzung: Viele Hooks zeigen strukturierte `onError`-Zweige; vereinzelte Stellen mit direktem Throw ohne Handler existieren.

- UI/UX Bewertung
  - Designkonsistenz: CI-Konforme Tailwind-Klassen (Palette, Komponenten-Basis siehe NeXify Config). Meist konsistent, einzelne ältere Komponenten nutzen abweichende Farb-/Spacing-Varianten.
  - Benutzerfreundlichkeit: Listen/CRUD-Pattern homogen; Toaster vorhanden; Dialoge meist mit klaren CTAs.
  - Barrierefreiheit: Semantische Struktur überwiegend korrekt; Fokus-Stile häufig vorhanden; ARIA-Labels teilweise unvollständig bei komplexen Dialogen.
  - Responsives Verhalten: Grid-System eingehalten; Mobile-Optimierungen für Haupt-Listen gut; einige legacy Seiten haben starre Breiten.

## Validierung
- Code-Quellen geprüft: `src/integrations/supabase/*`, `src/lib/react-query/*`, relevante Hooks unter `src/hooks/*`.
- Dokumente abgeglichen: `docs/SYSTEM_OPTIMIZATION_SUMMARY_V18.5.1.md`, `docs/02-ARCHITECTURE/Overview.md`, `docs/MASTER_INDEX_V18.5.1.md`.
- Quick-Checks: Query-Key Factory vorhanden; Offline-Dev-Modus sauber; RLS-Filter in kritischen Tabellen eingehalten.

## Identifizierte Punkte
- Kritisch
  - Beispiel-ENV enthält reale Supabase-Domain → Risiko: Fehlkonfiguration bei neuen Entwicklern.
- Hoch
  - Divergenz der Query-Key-Nutzung (legacy vs. neue Factory) über Hooks hinweg → potenzielle Inkonsistenz beim Invalidieren.
- Mittel
  - Vereinzelte direkte Supabase-Calls in Widgets ohne central `useApi`-Layer.
  - A11y: ARIA-Labels und Rollen in komplexen Dialogen inkonsistent.
- Niedrig
  - Dokumentationsstellen nennen „React/Next.js“ statt „React + Vite“.

## Referenzen
- Code: `src/integrations/supabase/*`, `src/lib/react-query/*`, `src/hooks/*`
- Docs: `docs/SYSTEM_OPTIMIZATION_SUMMARY_V18.5.1.md`, `docs/02-ARCHITECTURE/Overview.md`, `docs/MASTER_INDEX_V18.5.1.md`

