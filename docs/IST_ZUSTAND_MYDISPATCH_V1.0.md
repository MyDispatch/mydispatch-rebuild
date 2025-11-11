# IST-Zustand MyDispatch
Status: Draft
Version: 1.0.0
Datum: 2025-11-10
Autor: Engineering

## Zusammenfassung
Erfassung aktueller Funktionen, Prozesse und Komponenten inkl. UX/Security/Performance-Bewertung.

## Details
- Funktionen: Booking-Listen, Create/Update/Delete APIs (`/api/v2/bookings`), Dashboard-Widgets, Wiki-Ansichten.
- Prozesse: Auth über Supabase, Datenabfragen via TanStack Query, Edge Function-basierte Hilfsprozesse.
- Architektur: React Pages/Components, Hooks, Libs, i18n JSON Namespaced (`de`, `en`).
- Identifizierte Risiken:
  - Performance: Potenzial für Memoization bei Listen/Widgets.
  - Sicherheit: Harte Supabase URL/Keys in einigen Scripts (bereinigt).
  - Usability: Einheitliche CI/Abstände prüfen; Touch-Targets WCAG sicherstellen.

## Validierung
- Hooks: `use-nexify-wiki`, `use-offline-queue`, Validierungs-Hooks vorhanden.
- ENV: Nutzung `VITE_SUPABASE_URL` und Keys; Offline-Guard aktiv.

## Referenzen
- `src/routes/` – Router-Definitionen
- `src/hooks/` – zentrale Logik
- `docs/CHANGELOG.md` – Dokumentierte Änderungen

