# Wiederherstellung des originalen Designs (Pixelgenau)

Datum: 2025-11-10

Ziel: Exakte Wiederherstellung des ursprünglichen Designs und Layouts unter ausschließlicher Nutzung der alten Dateien und Ressourcen, inklusive Fehlerbehebung und Qualitätskontrollen.

## Änderungen & Entscheidungen

- Next.js integriert die Original-Komponenten direkt aus `src/` mittels TS-Alias `legacy/*`.
- `app/layout.tsx` lädt zusätzlich `../../src/index.css`, um die originalen CSS-Tokens, Variablen und Tailwind-Erweiterungen zu aktivieren.
- `app/page.tsx` rendert die alte Landingpage `src/pages/Home.tsx` als Client-Komponente (`"use client"`).
- `app/dashboard/page.tsx` rendert die alte Dashboard-Seite `src/pages/Index.tsx` als Client-Komponente.
- `tsconfig.json` wurde erweitert: `@/*` erlaubt Fallback auf `../src/*`, zusätzlicher Alias `legacy/*` zeigt explizit auf `../src/*`.

## Begründung

- „Exklusive Nutzung der Original-Ressourcen“: Komponenten, Layouts und Styles bleiben unverändert und werden 1:1 übernommen.
- Pixelgenauigkeit: Die originale `index.css` wird geladen, wodurch dieselben Design-Tokens und Tailwind-Regeln gelten.
- Kompatibilität: Client-Markierung für Seiten, die alte UI-Logik (Lazy/Suspense, Zustand, DOM-APIs) verwenden.

## Fehlerbehebungen (bisher)

- Supabase-Client-Fallback bei fehlenden Umgebungsvariablen implementiert, um Build-Fehler zu vermeiden.
- Typsicherungen ergänzt (`supabase.auth.getUser()` Rückgabetyp), um „implicit any“ zu verhindern.
- Korrektur des Imports von `SupabaseClient` aus `@supabase/supabase-js`.
- `drivers`-Liste auf dynamisch gesetzt, um Prerendering-Probleme zu vermeiden.

## Qualitätskontrollen

- Visuelle Prüfung über die Preview (`/` und `/dashboard`), inkl. Abgleich der Abstände, Farben, Typografie, Interaktionen.
- Geplante visuelle Regressionstests (Snapshots) für Kernseiten.

## Nächste Schritte

1. Seiten `/drivers` und `/drivers/[id]` visuell gegen Original prüfen und ggf. anpassen.
2. Weitere Originalseiten aus `src/pages/` schrittweise in den App-Router übernehmen.
3. Supabase-Umgebungsvariablen setzen und Live-Datenflüsse validieren.
4. Automatisierte visuelle Tests (Playwright) konfigurieren.
