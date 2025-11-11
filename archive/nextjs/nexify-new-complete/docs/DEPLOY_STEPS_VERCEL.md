# 🚀 Deploy Steps — Vercel
Status: Production-Ready
Version: 1.0.0
Datum: 2025-11-10
Autor: Team MyDispatch

## Zusammenfassung
Kurzanleitung für einen fehlerfreien Deploy auf Vercel. Beachtet Next.js- und Supabase-Integrationen.

## Schritte
- Repo mit Vercel verbinden (Git-Provider).
- Build-Einstellungen prüfen: Node-Version, `next.config.ts`, Images, Runtimes, Output.
- ENV setzen (siehe `docs/ENV_CHECKLIST.md`). Keine Secrets im Code.
- Preview-Deployment validieren: Routing, API-Routen, SSR/SSG, Middleware.
- Logs prüfen: Keine Warnungen/Fehler.
- Production deployen, Smoke-Tests ausführen.

## Validierung
- Feature-Flags, Middleware, Caching/ISR funktionieren wie erwartet.
- Seiten-Metadaten korrekt, SEO-Budget und Performance-Budgets eingehalten.

