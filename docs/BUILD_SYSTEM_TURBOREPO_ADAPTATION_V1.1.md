# Turborepo-Anpassung für React+Vite
Status: Production-Ready (Guideline)
Version: 1.1.1
Datum: 2025-11-11
Autor: Engineering

## Zusammenfassung
Dieses Dokument beschreibt, wie wir Turborepo für MyDispatch (React + Vite, kein Next.js) sinnvoll einsetzen: lokale/optionale Remote-Caches, Pipeline-Definitionen für `build`, `lint`, `test`, sowie eine mögliche spätere Packages-Struktur (z. B. `packages/ui`) für das Design-System. Ziel ist schnellere Builds, reproduzierbare Pipelines und saubere Projektorganisation – ohne den Wechsel zu Next.js.

## Details
- Architekturprinzipien
  - Beibehalten: Single-App React + Vite (keine Next.js Apps).
  - Optional: Monorepo-Style mit `packages/` für UI-/Util‑Libraries.
  - Turborepo steuert Pipelines (Build/Dev/Lint/Test) und Caching.

- Pipeline-Definition (turbo.json)
  - `build`: führt `npm run build` aus, cached mit Output `dist/**`.
  - `dev`: nicht gecached (Watch/Serve), rein lokal.
  - `lint`/`test`: deterministisch, Cache aktivierbar.

- Remote Caching (optional)
  - Aktivierbar via Vercel Account und Turborepo CLI (`turbo login`, `turbo link`).
  - Geeignet für CI/CD und Team-Setups, um Build-Artefakte zu teilen.
  - Hinweis: MyDispatch bleibt ein React+Vite-Projekt; die Beispiel-Apps im Referenzlink sind Next.js, dienen aber nur dem Struktur‑ und Pipeline‑Muster.

- Empfohlene Projektstruktur (schrittweise, optional)
  - `apps/mydispatch-web` → unsere bestehende Vite-App (heute `src/` im Root; Migration optional).
  - `packages/ui` → geteilte React-Komponenten (Lucide-Icons, CI-konforme Styles).
  - `packages/tsconfig` → geteilte TS-Configs, falls sinnvoll.

## Validierung
- Lokale Validierung
  - Führe `npx turbo run build` aus und prüfe, dass `dist/` entsteht.
  - Starte Dev wie gewohnt mit `npm run dev` (Turborepo steuert optional `turbo dev`).
  - Prüfe Caching: wiederholte Builds sollten deutlich schneller sein.

- CI/CD Validierung
  - Aktiviere optional Remote Cache, beobachte kürzere CI-Build-Zeiten.
  - Stelle sicher, dass Vite-Artefakte (`dist/**`) korrekt als Outputs deklariert sind.

## Referenzen
- Vercel Turborepo Example (Struktur/Pipelines): https://github.com/vercel/turborepo/tree/main/examples/basic
- Repo-Dateien
  - `turbo.json` (Pipeline-Definitionen)
  - `package.json` (Scripts)
  - `vite.config.ts` (Build-Konfiguration)

