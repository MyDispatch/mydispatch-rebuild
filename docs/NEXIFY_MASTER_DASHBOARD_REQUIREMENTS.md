## Überblick
- Ziel: Eigenständiges Dashboard (Desktop/PWA) für den festen Cloud-Agenten `NeXifyAI MASTER`, voll integriert in das NeXify-Wissens- und Qualitätssystem.
- Architektur: Moderne React-18-Anwendung (Vite, TypeScript, Tailwind) mit erweiterbarem Modularitätskern, Supabase-Anbindung und Edge-Function-Hooks.
- Deployment-Ziel: Neues, separates GitHub-Repository (öffentlich oder privat nach Wahl) und Bereitstellung über Vercel mit HTTP-Auth (Benutzer `courbois1981@gmail.com`, Passwort `1def!xO2022!!`).
- Grenzen: GitHub-/Vercel-Aktionen, Credential-Management und externe Automationen werden außerhalb dieser Session vom Nutzer ausgeführt. Dieses Dokument liefert technische Vorgaben und Schnittstellen.

## Stakeholder & Rollen
- **Master-Admin (courbois1981@gmail.com)**: Vollzugriff, Agent-Steuerung, Systemkonfiguration.
- **NeXifyAI MASTER (Cloud-Agent)**: Autonomer Operator innerhalb definierter Leitplanken, darf Workflows orchestrieren, Code generieren, Telemetrie auswerten.
- **Zukünftige Operator:innen**: Readonly-Zugriff über abgesicherte Sessions (optional).

## Funktionale Anforderungen
1. **Agent Command Center**
   - Persistenter, mehrspaltiger Workspace (Navigator, Status, Editor-/Task-View).
   - Live-Chat mit Conversation-History und Attachments (Markdown, Codeblöcke).
   - Runbook/Workflow-Launcher (Trigger für Master-Workflows wie `npm run master:workflow`).
2. **Wissens- & Kontextbindung**
   - Sofortige Initialisierung mit NeXify Wiki (`session_init`-Hook, Edge Function).
   - Forget-Proof Mechanismen: Conversation-Log in Supabase (`master_sessions`, `master_notes`).
   - Komponenten-/Snippet-Abgleich via Supabase (`component_registry`, `code_snippets`).
3. **Projekt- & Systemsteuerung**
   - GitHub-Aktionspanel: Push-/Pull-Trigger, PR-Monitoring via REST/GitHub GraphQL.
   - Cursor Remote Control Placeholder: API-Connector für Cursor-Automation (HTTPS + WebSocket Hooks).
   - Deployment Manager: Vercel-/Supabase-Status, Trigger-Buttons (über API Calls).
4. **Self-Extension Framework**
   - Plugin-Slots mit definierter JSON-Schema-Registrierung (Manifest: Name, Version, Permissions).
   - Module Sandbox (Dynamic Imports, Feature Flags) für Tests vor Aktivierung.
   - Audit Trail für jede Plugin-Aktivierung (RLS-gesicherte Supabase-Tabellen).
5. **Monitoring & Sicherheit**
   - Gesundheitsübersicht (Edge Function Heartbeats, Supabase Status, Cron Results).
   - Security-Konsole (Credential Check, Token-Ablauf, RLS-Validierung).
   - Audit-Logging (Aktionen, Fehler, Policy-Verstöße).

## Nicht-funktionale Anforderungen
- **PWA**: Offline Cache (Workbox/vite-plugin-pwa), Installation auf Desktop, Sync-Queue für Edge Actions.
- **Performance**: 60fps UI, LCP < 2.5s auf Desktop, Worker-basierte Hintergrundjobs.
- **Sicherheit**: HTTPS erzwingen, Content Security Policy, sichere Secrets via Environment Variables. Keine hartkodierten Tokens (nur Basic Auth für Demo/Preview).
- **Erweiterbarkeit**: Klare API-Schnittstellen (`/api/agent`, `/api/workflows`, `/api/plugins`).
- **Compliance**: DSGVO-konforme Speicherung (Supabase EU-Region), Log-Retention 180 Tage.

## Architektur & Komponenten
1. **Frontend (Vite + React 18 + TypeScript)**
   - Routen: `/login`, `/dashboard`, `/settings`, `/audit`, `/plugins`.
   - State: Zustand mit Zustandshydrierung via Zustand + React Query (Supabase).
   - Styling: Tailwind + interne Component Library (V28-Basis abstrahiert für neues Projekt).
2. **API Layer**
   - Edge Functions: `master-session-init`, `master-run-command`, `master-plugin-exec`.
   - Supabase REST/RPC: Persistenz, Query Layer für Knowledge Checks.
3. **Integrationen**
   - GitHub: OAuth App oder PAT, Endpunkte für Repos, PRs, Workflow Runs.
   - Vercel: REST v2 API für Deployments, Password Protection via Middleware.
   - Cursor: Remote Control API (Platzhalter, definierte Interface-Methoden).

## Supabase-Struktur (separates Schema `nexify_master`)
- `master_sessions` (id, started_at, context_blob, status).
- `master_notes` (id, session_id, author, body, embedding_vector).
- `master_workflows` (id, name, description, command, guardrails).
- `master_plugins` (id, manifest_json, status, created_at, updated_at).
- `master_audit_log` (id, actor, action, payload, result, created_at).
- **Policies**: Vollzugriff für `master`-Role, Readonly für `observer`-Role, RLS aktiv.

## Sicherheitsmaßnahmen
- MFA-geschützter Admin-Login (Supabase Auth + OTP Option).
- HTTP Basic Auth als zusätzliche Schutzebene für Vercel Preview (`/_middleware`).
- Secrets-Management via Vercel Environment Variables, kein Speichern im Repo.
- Audit Alerts (Edge Function + Email via Resend) bei Policy-Verstößen.

## Self-Extension Leitplanken
- Plugins benötigen Freigabe durch Master-Admin.
- Jede Erweiterung liefert Capability-Manifest (z.B. Zugriff auf Cursor, GitHub, Supabase).
- Staging-Ausführung in isolierter Worker-Sandbox vor Produktionsaktivierung.
- Automatische Tests (`npm run validate:all`, `npm run master:workflow`) müssen bestehen.

## Deployment-Vorgehen (manuell auszuführen)
1. Neues GitHub-Repository erstellen (`nexifyai-master-dashboard`).
2. Lokales Projekt initialisieren (`npm install`, `npm run build`, `npm run validate:all`).
3. Repository mit Vercel verbinden; Build-Settings: Framework `Vite`, Node 20.
4. Environment Variables setzen (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `MASTER_AGENT_API_URL`, usw.).
5. Password Protection via `VERCEL_PASSWORD_PROTECTION` oder eigenes Middleware-Skript.
6. Deployment triggern (`vercel --prod`).
7. Smoke Tests: Login, Agent-Init, PWA-Install, Offline-Fallback.

## Offene Punkte & Risiken
- Cursor-API: Offizieller Remote-Control-Endpunkt prüfen; bis dahin Mock-Service verwenden.
- Automatische Selbstoptimierung: Nur im Rahmen der Plugin-Sandbox zulassen, klare Guardrails definieren.
- Zugriff auf geschützte Systeme (z.B. Supabase Service Role) strikt begrenzen, Secrets rotation einplanen.
- V28 Designsystem neu aufsetzen oder Vorkomponenten extrahieren (Abgleich mit Component Registry nötig).

## Nächste Schritte
- Technisches Grundgerüst im Workspace erstellen.
- Supabase-Schema-Migration entwerfen (SQL + RLS Policies).
- UI-Flows als Figma/Whimsical-Skizze ausarbeiten (optional).
- Automations-Pipeline (GitHub Actions) für Tests & Deploy vorbereiten.
