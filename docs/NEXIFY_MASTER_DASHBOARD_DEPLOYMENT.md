## Deployment-Checkliste – NeXifyAI MASTER Dashboard

### 1. Neues GitHub-Repository
- Repository-Name: `nexifyai-master-dashboard`
- Initialen Commit aus `/workspace/nexify-master-dashboard`
- Branch-Schutz aktivieren (`main`, Review notwendig)

```bash
cd nexify-master-dashboard
git init
git remote add origin git@github.com:<org>/nexifyai-master-dashboard.git
git add .
git commit -m "feat: initial master dashboard"
git push -u origin main
```

### 2. Vercel-Projekt anlegen
- Vercel → „New Project“ → GitHub-Repo auswählen
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

### 3. Environment Variables (Production & Preview)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_MASTER_AGENT_API_URL`
- `VITE_MASTER_ADMIN_EMAIL=courbois1981@gmail.com`
- `VITE_MASTER_ADMIN_PASSWORD=1def!xO2022!!`
- `VERCEL_PASSWORD_PROTECTION=1def!xO2022!!`
- optional: `NEXIFY_MASTER_GH_PAT` (GitHub Automationen)

### 4. Passwortschutz aktivieren
**Option A (Vercel built-in):** Environment `VERCEL_PASSWORD_PROTECTION` + `VERCEL_PASSWORD_PROTECTION_USERNAME`.<br />
**Option B (Middleware):** `middleware.ts` mit Basic-Auth Headern ergänzen.

### 5. Supabase-Setup
- Schema-Migration `supabase/migrations/0001_create_nexify_master_schema.sql` ausführen
- Rollen anlegen: `master`, `observer`
- Service Role Key **nicht** im Frontend verwenden (nur Edge Functions)
- Edge Functions deployen: `master-session-init`, `master-run-command`, `master-plugin-exec`

### 6. Automationen
- GitHub Action (`.github/workflows/ci.yml`):
  - `npm install`
  - `npm run validate:all`
  - Cache für `node_modules` aktivieren
- Optional: Vercel Deploy Hook für automatisches Deployment nach erfolgreicher CI

### 7. Smoke Tests nach Deployment
- Login mit Master-Credentials
- Agent-Chat (Mock > echte API)
- Workflow-Trigger → Monitoring prüfen
- Plugin-Manifest registrieren
- PWA installieren + Offline-Test (Chrome Lighthouse)

### 8. Forget-Proof & Wissensbindung
- `docs/NEXIFY_MASTER_DASHBOARD_REQUIREMENTS.md` aktuell halten
- Supabase `master_audit_log` mit Edge Functions verknüpfen
- Regel: Jede Änderung → `docs/CHANGELOG.md` im neuen Repo pflegen

### 9. Cursor-Integration (manuell)
- Cursor Remote API Token generieren
- Plugin `plugin-cursor-remote` Manifest aktualisieren (Capability `cursor.remoteCommands`)
- Sicherheitsreview (Pascal-Regeln) durchführen

### 10. Wartung
- Secrets Rotation alle 90 Tage
- `npm run validate:all` automatisiert (Cron)
- Lessons Learned in `docs/LESSONS_LEARNED_V30.0.md` ergänzen
