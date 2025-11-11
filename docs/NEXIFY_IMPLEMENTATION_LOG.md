# NeXify Implementierung – Soll-Zustand und Abweichungen

Version: V32.1 – Stand: Heute

## Übersicht

- Projektpfad: `nexify-new-complete/`
- Ziel: Produktionsreife, konsistente UI/UX gemäß NeXify-Richtlinien, saubere Supabase-Integration, Edge-Best-Practices.

## Übernommene Best Practices und Ressourcen

- Geolocation (Vercel Edge Middleware): Geodaten werden in der Middleware als Response-Header (`x-geo-country`, `x-geo-city`, `x-geo-region`) mitgegeben.
- Workspace/Output-Konfiguration: `turbopack.root` und `outputFileTracingRoot` in `next.config.ts` gesetzt, um Warnungen zu vermeiden.
- UI-Designsystem: Radix UI/Tailwind-basierte Komponenten erweitert (`Textarea`, `Select`, `Tabs`, `Dialog`).
- Dashboard-Layout: Einheitliche TopNav und QuickActions in `app/dashboard/` integriert.
- Spezialseiten: Unternehmer-Landingpage (`/entrepreneur`), Kundenportal (`/customer`), Fahrerportal (`/driver`).

## Abweichungen und Anpassungen

- Middleware-Konvention: Next.js 16 meldet Deprecation der Middleware-Konvention. Aktuell weiterhin kompatibel; Migration auf `proxy` wird geplant.
- Feature Flags/ConfigCat: Architektur vorbereitet (Middleware/Headers), konkrete Anbieterintegration optional und abhängig von Infrastrukturfreigabe.
- Bot Protection/DataDome: Placeholder – erfordert Konto/Keys; Integration nicht aktiviert.
- Cron/Jobs: Nutzung von Vercel Cron grundsätzlich möglich; derzeit keine produktiven Tasks konfiguriert.
- Subdomain-Auth/Multi-Tenant: Auf Roadmap; aktuelle App verwendet single-tenant Supabase-Auth.

## Supabase

- Env: `.env.local` benötigt `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Middleware: `lib/supabase/middleware.ts` – Session Update, Redirects, Header-Augmentation.

## Tests

- Unit: `tests/unit/ui/button.test.tsx` – Smoke-Test für UI-Basis.
- E2E: Vorhandene E2E-Ordner sind projektweit; Anpassung an `app/auth/*` empfohlen.

## Nächste Schritte

1. Migration auf Proxy-Konvention (Next.js 16) – `middleware.ts` → `proxy.ts` inkl. Session-Handling.
2. Aktivierung Feature Flags (z. B. ConfigCat) – abhängig von Zugangsdaten.
3. Bot Protection (DataDome) – nach Bereitstellung von API-Keys.
4. E2E-Tests erweitern für `/entrepreneur`, `/customer`, `/driver`.
5. Dokumentation der UI-Komponenten in `docs/pages/` ergänzen.

