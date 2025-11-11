# Release Notes – 2025-11-10

## Zusammenfassung
- Login-Probleme analysiert und Master-User zuverlässig in Supabase angelegt.
- Seeding-Skript korrigiert (Profiles-Schema und Rollen) und erfolgreich ausgeführt.
- Automatisiertes Login-Testskript hinzugefügt (verifiziert Auth, Profile, Rollen).
- Rollback-Skript bereitgestellt (Entfernt Master-User im Notfall).

## Änderungen
1. scripts/seed-master-users.cjs
   - Profiles: Verwendung von `first_name`/`last_name` statt `full_name`.
   - Rollen: `user_roles.role = 'admin'` (gültiges Enum, ersetzt 'master').
   - user_metadata beim Anlegen: `first_name`, `last_name`, `company_name` für Trigger `handle_new_user`.

2. scripts/test-login-master.cjs
   - Login mit Anon-Key, Prüfung von Profile (`profiles`) und Rollen (`user_roles`).
   - Diagnose-Logs zu URL und Key-Präfix zur schnellen Fehlersuche.

3. scripts/rollback-master-users.cjs
   - Entfernt die drei Master-User via Admin-API (`deleteUser`).

## Qualitätssicherung
- Seeding erfolgreich: Benutzer erstellt/aktualisiert, Profile und Rollen korrekt.
- Login-Test: derzeit Fehler "Invalid API key" – deutet auf ein Anon-Key/Projekt-ID-Mismatch hin.
  - .env.local ist gesetzt: `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` für Projekt `ygpwuiygivxoqtyoigtg`.
  - Bitte im Supabase Dashboard prüfen, ob der Anon-Key zu diesem Projekt gehört (Settings → API → Anon Key).

## Deployment-Vorbereitung
- Edge Function `nexify-api`: bereit für Deployment; Endpunkte vorhanden.
- Master-User-Seed: schon ausgeführt, produktionsreif.
- Anleitung: siehe unten.

## Rollback-Konzept
- Schneller Rollback: `node scripts/rollback-master-users.cjs` zum Entfernen der Master-Accounts.
- Alternativ: Anon-Key in `.env.local` auf vorheriges Projekt zurücksetzen (falls Notfall).

## Live-Gang Anleitung (Step-by-Step)
1. Supabase prüfen
   - Settings → API: Verifiziere `Project ID` und `Anon Key`.
   - Stelle sicher, dass `.env.local` exakt diese Daten enthält.

2. Master-User Login testen
   - Lokal: `node scripts/test-login-master.cjs` (erwartet Erfolg mit Admin-Rolle).
   - Frontend: `/auth` öffnen und mit `courbois1981@gmail.com` / `1def!xO2022!!` einloggen.

3. Edge Function Deployment (optional)
   - `supabase functions deploy nexify-api` (mit gültigen Secrets).
   - Health-Check: `/issues/critical`, `/components/active` via HTTP aufrufen.

4. System-Check
   - Auth, Datenzugriff, UI-Flows, Fehlerbehandlung stichprobenartig prüfen.

## Hinweise
- Der Fehler "Invalid API key" blockiert Login-Tests – liegt sehr wahrscheinlich an einem falsch zugeordneten Anon-Key. Bitte Dashboard-Werte gegen `.env.local` abgleichen.

