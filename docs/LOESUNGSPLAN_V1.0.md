# LÖSUNGSPLAN (Systemweite Korrekturen & Optimierungen)
Status: Production-Ready
Version: 1.0.0
Datum: 2025-11-10
Autor: Engineering

## Zusammenfassung
Katalog aller festgestellten Probleme mit Priorisierung, betroffenen Komponenten, Aufwandsschätzung, technischen Anforderungen, Implementierungsschritten, Testfällen und Erfolgskriterien.

## Problemkatalog
- P1 Kritisch: Beispiel-ENV mit echter Supabase-Domain
  - Komponenten: `.env.local.example`
  - Aufwand: sehr gering
  - Anforderungen: Platzhalter nutzen, Misskonfiguration verhindern
  - Schritte: Beispielwerte sanitieren, Hinweise ergänzen
  - Tests: Lint-Check der ENV-Bezeichner; Start im Offline-Dev-Modus ohne Fehler
  - Erfolg: Neue Entwickler können lokal starten ohne versehentlichen Prod-Hit

- P2 Hoch: Query-Key Divergenz (legacy vs. Factory)
  - Komponenten: `src/hooks/*`, `src/lib/query-client.ts`, `src/lib/react-query/query-keys.ts`
  - Aufwand: mittel
  - Anforderungen: Einheitliche Nutzung der Factory-Keys für Konsistenz
  - Schritte: schrittweise Migration der Imports auf `@/lib/react-query/query-keys`
  - Tests: Invalidation-Verhalten bei CRUD (Partners, Customers); kein doppeltes Refetch
  - Erfolg: Einheitliche Query-Key-Strategie, stabilere Caching-Invalidation

- P3 Mittel: Direkte Supabase-Calls ohne `useApi`
  - Komponenten: vereinzelte Widgets/Pages (z. B. Roadmap/Dashboard)
  - Aufwand: mittel
  - Anforderungen: Konsistenter API-Layer für Testbarkeit und Error-Handling
  - Schritte: Extrahieren in `useApi`-Methoden, Hooks anpassen
  - Tests: Mockbarer API-Layer; Fehlerpfade korrekt über `error-handler`
  - Erfolg: Weniger duplizierte Logik, bessere Observability

- P4 Mittel: A11y-Verbesserungen für Dialoge/Listen
  - Komponenten: Dialog-Komponenten, komplexe Tabellen
  - Aufwand: mittel
  - Anforderungen: ARIA-Rollen/Labels, Fokus-Reihenfolge, Tastatur-Navigation
  - Schritte: Audit, gezielte Korrekturen, Fokus-Traps
  - Tests: Axe-Core lokal; Tastatur-Tab-Folge manuell prüfen
  - Erfolg: WCAG AA (2.2) erfüllt laut Policy

- P5 Niedrig: Docs-Begrifflichkeiten (React + Vite)
  - Komponenten: `docs/README.md`
  - Aufwand: gering
  - Anforderungen: Korrekte Bezeichnung gemäß Projektkonfiguration
  - Schritte: Textstellen aktualisieren, Links zu neuen Docs ergänzen
  - Tests: Link-Check; Index-Aktualisierung
  - Erfolg: Einheitliche Kommunikation, reduzierte Verwirrung

## Implementierungsschritte (Batch 1)
1) ENV-Sanitisierung in `.env.local.example`
2) Docs-Updates: `docs/README.md` (React + Vite, Links)
3) Erstellung der drei neuen Dokumente (IST, Plan, SOLL)
4) Changelog-Pflege (Root + Docs)

## Validierung
- Start lokal im Offline-Dev-Modus ohne ENV-Fehler
- Link-Check der neuen Dokumente aus `docs/README.md`
- Konsistenzprüfung gegen Master-Index

## Referenzen
- Policy: `docs/DOCUMENTATION_MAINTENANCE_POLICY_V1.1.md`
- Index: `docs/MASTER_INDEX_V18.5.1.md`

