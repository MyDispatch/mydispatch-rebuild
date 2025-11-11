# Problems & Diagnostics
Status: Production-Ready
Version: 1.1.1
Datum: 2025-11-11
Autor: Engineering

## Zusammenfassung
- White Screen auf Produktions-Builds durch veraltete, im Service Worker gecachte Assets.
- Branch-Inkonsistenz: Repository-Default auf `master` statt `main` führte zu divergenter Dokumentation und Automatisierung.

## Details
- Ursache White Screen: SW hielt alte Build-Artefakte; bei Versionswechsel wurde kein kontrollierter Cache-Reset ausgelöst.
- Fix: Message-Handler in `public/sw.js` ergänzt (`VERSION_CHECK`, `CLEAR_CACHES`), Client-Handshake in `src/main.tsx` implementiert. Bei Versionsänderungen werden SW-Caches, `localStorage`, `sessionStorage` und Cookies geleert, anschließend Reload.
- Branch-Migration: Lokaler Branch von `master`→`main` umbenannt und zu Remote gepusht. Dokumente und Tooling-Hinweise aktualisiert.

## Validierung
- Dev-Server getestet; keine UI-Fehler im Preview, White Screen nicht reproduzierbar nach Cache-Reset.
- SW-Activation und Message-Routen geprüft (skipWaiting + kontrollierter Cache-Clear).
- `git`-Status: aktueller Branch `main`; Remote `origin/main` gesetzt.

## Referenzen
- `public/sw.js`
- `src/main.tsx`
- `CHANGELOG.md`, `docs/CHANGELOG.md`
- `docs/DEPLOYMENT_GUIDE_V32.5.md`
- `.github/copilot-instructions.md`
