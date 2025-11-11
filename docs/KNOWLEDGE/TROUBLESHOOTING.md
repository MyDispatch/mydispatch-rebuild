# 🛠️ Troubleshooting Guide
Status: ✅ Production-Ready
Version: 1.1.0
Datum: 2025-11-10
Autor: Frontend Team

## Zusammenfassung
Dieser Leitfaden dokumentiert bekannte Fehlerbilder und deren Ursachenfixes. Schwerpunkt dieses Updates: White Screen im Entwicklungsmodus verursacht durch Service‑Worker‑Caching/Scope‑Konflikte; behoben durch Dev‑seitige Deregistrierung.

## Details

### White Screen in Dev (Service Worker)
- Symptom: Leere Seite („White Screen“) beim Start im Entwicklungsmodus; keine klaren Fehler im Browser, gelegentlich Chunk‑Load‑Fehler.
- Root Cause: Service Worker aus vorherigen Builds/Ports greift in Dev ein (Cache/Scope‑Konflikte) und blockiert Asset‑Ladepfade.

#### Fix (Implementiert)
- `src/main.tsx`: Im DEV werden alle vorhandenen Service‑Worker‑Registrierungen deregistriert; Service Worker wird nur in PROD registriert.

#### Vorgehen für lokale Entwicklung
- Starte den Dev‑Server isoliert: `npm run dev -- --port 5176 --strictPort`.
- Öffne nur einen Vite‑Dev‑Server gleichzeitig.
- Bei Portwechsel/Fehlern: Hard Reload im Browser und ggf. Browser‑Caches leeren.

### Checks bei Verdacht auf SW‑Interferenz
- `Application` Tab (DevTools) → Service Workers: Sicherstellen, dass im Dev keine Registrierung aktiv ist.
- `Cache Storage`: Alle Caches löschen, falls Probleme fortbestehen.
- `LocalStorage`/`SessionStorage`: Nicht benötigte Einträge entfernen (Achtung: Auth‑Tokens erhalten).

## Validierung
- Isolierte Dev‑Preview auf Port 5176 geöffnet, kein White Screen; Routing und HMR funktionieren.
- Keine Laufzeitfehler im Terminal; Browserkonsole clean.

## Referenzen
- `src/main.tsx`
- `docs/CHANGELOG.md`
- Root `CHANGELOG.md`
