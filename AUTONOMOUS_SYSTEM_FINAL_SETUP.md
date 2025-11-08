# Autonomous System - Finale Setup-Schritte

## ✅ ABGESCHLOSSEN

### 1. Datenbank Setup

- ✅ Migration `20251108000002_autonomous_complete_fixed.sql` erfolgreich angewendet
- ✅ 4 Tabellen erstellt: `autonomous_tasks`, `autonomous_execution_logs`, `autonomous_system_config`, `autonomous_safety_checks`
- ✅ 3 PostgreSQL Functions deployed
- ✅ System aktiviert (enabled=true, dry_run_mode=true)
- ✅ 3 Test-Tasks erstellt

### 2. Edge Function Deployment

- ✅ Edge Function `ai-agent-poll` deployed (Status: ACTIVE)
- ✅ URL: https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/ai-agent-poll
- ✅ Version 1 deployed

### 3. Code-Optimierungen

- ✅ TypeScript baseUrl deprecated → `ignoreDeprecations: "6.0"` hinzugefügt
- ✅ PowerShell unused variables → `Out-Null` verwendet
- ✅ Email Templates Parameter-Reihenfolge → Optionale Parameter nach hinten verschoben

---

## 🚀 NÄCHSTE SCHRITTE

### A. Edge Function testen (JETZT)

```powershell
# PowerShell Terminal
$serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlncHd1aXlnaXZ4b3F0eW9pZ3RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ0NDM0MywiZXhwIjoyMDc2MDIwMzQzfQ.W_rbOUxa57VffJiUX9TClCAFB6m11qS2GVxpEzWQ56Q"

$response = Invoke-RestMethod `
  -Uri "https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/ai-agent-poll" `
  -Method Post `
  -Headers @{
    "Content-Type"="application/json"
    "Authorization"="Bearer $serviceRoleKey"
  } `
  -Body '{}'

$response | ConvertTo-Json -Depth 10
```

**Erwartetes Ergebnis:**

```json
{
  "success": true,
  "dry_run": true,
  "processed": 3,
  "results": [
    {
      "task_id": "...",
      "status": "completed",
      "message": "DRY RUN: Task would be executed",
      "changes": { ... }
    }
  ]
}
```

### B. Cron Job einrichten (5-10 Minuten)

1. **Öffne Supabase Dashboard:**

   ```
   https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/database/cron-jobs
   ```

2. **Klicke "Create Cron Job"**

3. **Konfiguration:**

   ```
   Name: autonomous-agent-poll
   Schedule: */5 * * * * (alle 5 Minuten)
   Command: SELECT net.http_post(
     url := 'https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/ai-agent-poll',
     headers := jsonb_build_object(
       'Content-Type', 'application/json',
       'Authorization', 'Bearer YOUR_SERVICE_ROLE_KEY'
     ),
     body := '{}'::jsonb
   );
   ```

4. **Ersetze `YOUR_SERVICE_ROLE_KEY`** mit:

   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlncHd1aXlnaXZ4b3F0eW9pZ3RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ0NDM0MywiZXhwIjoyMDc2MDIwMzQzfQ.W_rbOUxa57VffJiUX9TClCAFB6m11qS2GVxpEzWQ56Q
   ```

5. **Speichern und aktivieren**

### C. Git-Status aufräumen (Optional)

```bash
# Alle autonomen Dateien committen
git add .github/copilot-instructions.md
git add .github/workflows/autonomous-agent.yml
git add GITKRAKEN_QUICKSTART.md
git add docs/AUTONOMOUS_SYSTEM_README.md
git add docs/GITKRAKEN_SSH_SETUP.md
git add package.json
git add scripts/autonomous-*.ts
git add scripts/emergency-stop.ts
git add scripts/setup-autonomous-system.ps1
git add scripts/setup-autonomous-system.ts
git add supabase/functions/create-gitkraken-patch/index.ts
git add supabase/functions/ai-agent-poll/index.ts
git add supabase/migrations/20251108000000_autonomous_system_setup.sql
git add supabase/migrations/20251108000002_autonomous_complete_fixed.sql

git commit -m "feat: autonomous system v1.0

- Database tables and functions
- Edge Functions (ai-agent-poll, create-gitkraken-patch)
- GitKraken Cloud Patches integration
- Autonomous agent scripts and workflows
- Complete documentation"

git push origin master
```

**⚠️ NICHT committen:**

- `.env.local` (bereits in .gitignore)

---

## 🔧 OPTIONALE MANUELL-TASKS

### 1. Supabase Types regenerieren

**Erforderlich:** Personal Access Token (sbp\_\*)

1. Gehe zu: https://supabase.com/dashboard/account/tokens
2. Erstelle neuen Token (Name: "MyDispatch Types Generation")
3. Kopiere Token
4. Im Terminal:
   ```bash
   export SUPABASE_ACCESS_TOKEN=sbp_...
   npx supabase gen types typescript --project-id ygpwuiygivxoqtyoigtg > src/integrations/supabase/types.ts
   ```

### 2. GitHub Secrets konfigurieren

**Erforderlich für:** Autonomous Agent GitHub Workflow

1. Gehe zu: https://github.com/MyDispatch/mydispatch-rebuild/settings/secrets/actions
2. Füge hinzu:
   - `VITE_SUPABASE_URL`: https://ygpwuiygivxoqtyoigtg.supabase.co
   - `SUPABASE_SERVICE_ROLE_KEY`: (siehe .env.local)
   - `GITKRAKEN_API_TOKEN`: (optional, für Cloud Patches)
   - `GH_PAT`: (optional, für PR-Erstellung)

### 3. CompanyData letterhead_url ergänzen

**Erforderlich für:** BrandingSection Component

In `src/integrations/supabase/types.ts` oder entsprechende Type-Datei:

```typescript
export interface CompanyData {
  // ... existing fields
  letterhead_url?: string | null;
}
```

---

## 📊 MONITORING

### Überprüfe Task-Ausführung

```sql
-- Supabase SQL Editor
SELECT * FROM autonomous_tasks ORDER BY created_at DESC LIMIT 10;
SELECT * FROM autonomous_execution_logs ORDER BY created_at DESC LIMIT 10;
SELECT * FROM autonomous_system_stats;
```

### Überwache Edge Function Logs

```
https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/functions/ai-agent-poll/logs
```

---

## 🎯 PRODUCTION MODE (NACH TESTING)

**NUR nach erfolgreichem Dry-Run Testing!**

```sql
-- Supabase SQL Editor
UPDATE autonomous_system_config
SET dry_run_mode = false
WHERE id = 1;
```

**Dann werden Tasks WIRKLICH ausgeführt:**

- Git Branches erstellt
- Code-Änderungen committed
- Pull Requests erstellt (via GitHub oder GitKraken)

---

## 🆘 TROUBLESHOOTING

### Edge Function gibt 404

- Prüfe Deployment-Status im Dashboard
- Warte 1-2 Minuten nach Deployment (Propagation)
- Prüfe Edge Function Logs

### Tasks bleiben "pending"

- Prüfe `autonomous_system_config.enabled = true`
- Prüfe Edge Function wird aufgerufen (Logs)
- Prüfe `dry_run_mode` Status

### Emergency Stop

```powershell
npx tsx scripts/emergency-stop.ts --reason "Testing abgeschlossen" --hours 24
```

---

**Status:** System bereit für Testing ✅
**Letzte Aktualisierung:** 2025-11-08
**Version:** V32.5 + Autonomous System V1.0
