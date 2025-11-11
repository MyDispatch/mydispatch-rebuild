# Login-Sicherheit und Stabilität (Stand: 2025-11-10)

Diese Dokumentation beschreibt die implementierten Schutzmaßnahmen und Prüfungen rund um den Login sowie notwendige Umgebungsvariablen.

## Änderungen und Features

- Brute-Force-Schutz (Client-seitig):
  - Zählt fehlgeschlagene Versuche und sperrt temporär nach 5 Fehlversuchen (15 Minuten).
  - Leichter Backoff nach Fehlversuch, um sofortige Wiederholungen zu entschärfen.

- Inaktivitäts-Logout (global):
  - Automatischer Logout nach 15 Minuten Inaktivität.
  - Warnhinweis 1 Minute vor Ablauf, Interaktion setzt den Timer zurück.

- Login-Testskript gehärtet (`scripts/test-login-master.cjs`):
  - Validiert den Schlüssel gegen `auth/v1/settings`.
  - Fällt bei ungültigem Anon-Key auf Service Role Key zurück, um Tests fortzusetzen.

## Umgebungsvariablen

- `VITE_SUPABASE_URL`: Supabase Projekt-URL (z. B. `https://<project>.supabase.co`).
- `VITE_SUPABASE_ANON_KEY`: Anon/Public Key (muss zum Projekt passen). Wird vom Frontend genutzt.
- `SUPABASE_SERVICE_ROLE_KEY`: Service Role Key (nur serverseitig/Tests, nicht im Browser verwenden).

Hinweis: Der Anon-Key muss aus dem Supabase-Dashboard des Projekts `ygpwuiygivxoqtyoigtg` entnommen werden. Ein falscher Key führt zu `Invalid API key` beim Login.

## Testablauf

1. Skript: `node scripts/test-login-master.cjs`
   - Erwartet: Anon-Key validiert; falls nicht, Fallback auf Service Role; Login erfolgreich und Rollen `admin`, `master` vorhanden.

2. UI-Test:
   - Dev-Server starten (`npm start`) und `/auth` öffnen.
   - Mit gültigen Credentials anmelden (z. B. `courbois1981@gmail.com`).
   - Mit ungültigen Daten prüfen: Saubere Fehlermeldungen, Sperrlogik nach Mehrfachfehlern.
   - Inaktivität testen: Warnung und anschließender Logout nach 15 Minuten.

## bekannte Punkte und ToDos

- Der aktuell gesetzte `VITE_SUPABASE_ANON_KEY` ist für das Projekt offenbar ungültig. Bitte im Supabase-Dashboard prüfen und den korrekten Anon-Key in `.env.local` setzen.
- Optional: Serverseitige Rate-Limiting/Lockout ergänzen (Edge Function/GoTrue-Konfiguration), um den Schutz serverseitig abzusichern.

## Rückfall/Recovery

- Rollback-Skript vorhanden: `node scripts/rollback-master-users.cjs` (löscht Master-User aus Auth, falls notwendig).

## Verantwortlichkeiten

- Frontend schützt und informiert den Nutzer; Sicherheit muss zusätzlich serverseitig gewährleistet werden (RLS, Admin-Only-Operationen, Rate-Limits).

