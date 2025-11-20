# 🤖 MyDispatch Autonomous Development System

**Version:** 1.0
**Status:** Production-Ready
**Created:** 2025-11-08
**Author:** NeXify AI System

---

## 📋 Übersicht

Das **MyDispatch Autonomous Development System** ermöglicht vollautomatische Codeänderungen, Fehlerbehebungen und Optimierungen **ohne menschliche Anwesenheit**. Das System arbeitet nach dem **"Safety-First"**-Prinzip mit mehrschichtigen Sicherheitsmechanismen.

### Kernfunktionen

✅ **Autonome Code-Änderungen** (Level 2: Layout, Types, Performance, Docs)
✅ **GitKraken Patch-Workflow** (Level 3: Breaking Changes, neue Features)
✅ **Dry-Run Mode** (Standard: Keine Änderungen ohne Freigabe)
✅ **Emergency Stop** (Sofortige Deaktivierung bei Problemen)
✅ **Comprehensive Logging** (Jeder Schritt wird geloggt)
✅ **Health Monitoring** (Automatische System-Überwachung)
✅ **GitHub Actions Integration** (Stündliche automatische Ausführung)

---

## 🏗️ Architektur

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUTONOMOUS SYSTEM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐  │
│  │  Database     │    │  Edge         │    │  Scripts      │  │
│  │  Tables       │◄───┤  Functions    │◄───┤  & Agents     │  │
│  └───────────────┘    └───────────────┘    └───────────────┘  │
│         │                     │                     │            │
│         ▼                     ▼                     ▼            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 GitHub Actions Workflow                  │   │
│  │  (Preflight → Execute → Validate → Rollback)            │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              GitKraken Cloud Integration                │   │
│  │  (Patch Creation → Review → Merge)                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │        Vercel + Supabase Deployment (GitHub Integration)│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Datenbank-Schema

### Tabellen

#### `autonomous_tasks`

Speichert alle autonomen Aufgaben.

| Spalte                | Typ         | Beschreibung                                             |
| --------------------- | ----------- | -------------------------------------------------------- |
| `id`                  | UUID        | Primärschlüssel                                          |
| `task_type`           | TEXT        | Art der Aufgabe (layout_fix, type_improvement, etc.)     |
| `description`         | TEXT        | Beschreibung der Aufgabe                                 |
| `task_data`           | JSONB       | Zusätzliche Task-Daten (z.B. betroffene Dateien)         |
| `priority`            | INTEGER     | Priorität (0-10, höher = wichtiger)                      |
| `autonomy_level`      | INTEGER     | 1 = Read-only, 2 = Safe changes, 3 = Approval required   |
| `risk_level`          | TEXT        | low, medium, high                                        |
| `requires_approval`   | BOOLEAN     | Manuelle Freigabe erforderlich?                          |
| `status`              | TEXT        | pending, in_progress, completed, failed, awaiting_review |
| `result`              | JSONB       | Ergebnis der Ausführung                                  |
| `error`               | TEXT        | Fehlermeldung (falls gescheitert)                        |
| `gitkraken_patch_url` | TEXT        | URL zum GitKraken Patch (Level 3)                        |
| `created_at`          | TIMESTAMPTZ | Erstellungszeitpunkt                                     |
| `started_at`          | TIMESTAMPTZ | Start der Ausführung                                     |
| `completed_at`        | TIMESTAMPTZ | Ende der Ausführung                                      |

#### `autonomous_execution_logs`

Detailliertes Audit-Trail jeder Ausführung.

| Spalte           | Typ         | Beschreibung                            |
| ---------------- | ----------- | --------------------------------------- |
| `id`             | UUID        | Primärschlüssel                         |
| `task_id`        | UUID        | Referenz zu `autonomous_tasks`          |
| `execution_step` | TEXT        | Name des Ausführungsschritts            |
| `step_status`    | TEXT        | Status (in_progress, completed, failed) |
| `output_data`    | JSONB       | Ausgabedaten                            |
| `error_data`     | JSONB       | Fehler-Informationen                    |
| `timestamp`      | TIMESTAMPTZ | Zeitpunkt                               |
| `agent_version`  | TEXT        | Version des Agents                      |
| `environment`    | TEXT        | Umgebung (production, development)      |

#### `autonomous_system_config`

Zentrale System-Konfiguration (SINGLE ROW).

| Spalte                      | Typ         | Beschreibung                               |
| --------------------------- | ----------- | ------------------------------------------ |
| `id`                        | INTEGER     | PRIMARY KEY = 1 (nur eine Zeile!)          |
| `enabled`                   | BOOLEAN     | System aktiviert?                          |
| `dry_run_mode`              | BOOLEAN     | **DRY-RUN MODE** (Standard: true = sicher) |
| `max_daily_tasks`           | INTEGER     | Max. Tasks pro Tag (Standard: 50)          |
| `max_parallel_tasks`        | INTEGER     | Max. parallele Tasks (Standard: 5)         |
| `min_task_interval_minutes` | INTEGER     | Min. Abstand zwischen Tasks (Standard: 60) |
| `emergency_stop`            | BOOLEAN     | **EMERGENCY STOP** (stoppt alles sofort)   |
| `emergency_stop_reason`     | TEXT        | Grund für Emergency Stop                   |
| `emergency_stop_until`      | TIMESTAMPTZ | Emergency Stop aktiv bis                   |
| `notification_email`        | TEXT        | E-Mail für Benachrichtigungen              |
| `last_health_check`         | TIMESTAMPTZ | Letzter Health Check                       |
| `created_at`                | TIMESTAMPTZ | Erstellt am                                |
| `updated_at`                | TIMESTAMPTZ | Zuletzt aktualisiert                       |

#### `autonomous_safety_checks`

Definiert Safety Checks.

| Spalte               | Typ     | Beschreibung                                                                 |
| -------------------- | ------- | ---------------------------------------------------------------------------- |
| `id`                 | UUID    | Primärschlüssel                                                              |
| `check_type`         | TEXT    | build, test, lint, type-check, rls, security, dependencies, breaking_changes |
| `check_name`         | TEXT    | Name des Checks                                                              |
| `is_blocking`        | BOOLEAN | Blockiert Ausführung bei Fehler?                                             |
| `auto_fix_available` | BOOLEAN | Auto-Fix möglich?                                                            |
| `enabled`            | BOOLEAN | Check aktiviert?                                                             |

### Helper-Funktionen

#### `get_autonomous_config()`

```sql
SELECT * FROM get_autonomous_config();
```

Liefert aktuelle System-Konfiguration.

#### `create_autonomous_task()`

```sql
SELECT create_autonomous_task(
  p_task_type := 'layout_fix',
  p_description := 'Fix spacing issues in Dashboard',
  p_task_data := '{"files": ["src/pages/Dashboard.tsx"]}',
  p_priority := 5,
  p_autonomy_level := 2
);
```

Erstellt neue Task mit Validierung und Rate Limiting.

#### `emergency_stop_autonomous_system()`

```sql
SELECT emergency_stop_autonomous_system(
  p_reason := 'Build failing',
  p_duration_hours := 24
);
```

Aktiviert Emergency Stop für N Stunden.

---

## 🚀 Schnellstart

### 1. Voraussetzungen

```bash
# Node.js 20+
node --version

# Dependencies installieren
npm install

# Environment Variables setzen (.env.local)
VITE_SUPABASE_URL=https://ygpwuiygivxoqtyoigtg.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<your_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_key>  # NUR für Server-Side!
GITKRAKEN_API_TOKEN=<your_gitkraken_token>
```

### 2. Database Migration ausführen

```bash
# Migration anwenden
supabase db push

# Oder manuell:
psql -h <host> -U postgres -d postgres -f supabase/migrations/20251108000000_autonomous_system_setup.sql
```

### 3. Edge Function deployen

```bash
# GitKraken Patch Function deployen
supabase functions deploy create-gitkraken-patch

# Secrets setzen (in Supabase Dashboard):
# - GITKRAKEN_API_TOKEN
```

### 4. GitHub Actions konfigurieren

**GitHub Repository Settings → Secrets and Variables → Actions:**

| Secret                      | Wert                                       |
| --------------------------- | ------------------------------------------ |
| `VITE_SUPABASE_URL`         | `https://ygpwuiygivxoqtyoigtg.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key (aus Supabase Dashboard)  |
| `GITKRAKEN_API_TOKEN`       | GitKraken API Token                        |
| `GH_PAT` (optional)         | GitHub Personal Access Token               |

**GitKraken SSH Keys (bereits konfiguriert):**

- **Private Key:** `C:\Users\pcour\Desktop\MyDispatch_ALL\gitkraken_rsa`
- **Public Key:** `C:\Users\pcour\Desktop\MyDispatch_ALL\gitkraken_rsa.pub`
- **GitKraken Desktop:** SSH-Keys bereits in Einstellungen hinterlegt
- **Status:** ✅ Erfolgreich generiert und konfiguriert

### 5. System aktivieren

```bash
# Status prüfen
npm run autonomous:status

# Dry-Run Test (SICHER - keine Änderungen)
npm run autonomous:dry-run

# System scharf schalten (VORSICHT!)
# 1. In Supabase: UPDATE autonomous_system_config SET enabled = true, dry_run_mode = false WHERE id = 1;
# 2. In GitHub: Workflow aktivieren (.github/workflows/autonomous-agent.yml)
```

---

## 📖 Verwendung

### CLI Commands

```bash
# Status anzeigen
npm run autonomous:status

# Agent starten (respektiert Config)
npm run autonomous:start

# Dry-Run Mode (sicher, keine Änderungen)
npm run autonomous:dry-run

# Emergency Stop aktivieren
npm run autonomous:emergency-stop "Reason for stop"

# Health Check ausführen
npm run autonomous:health
```

### Task erstellen (via SQL)

```sql
-- Level 2 Task (autonom ausführbar)
SELECT create_autonomous_task(
  p_task_type := 'layout_fix',
  p_description := 'Fix spacing in Dashboard widgets',
  p_task_data := '{"files": ["src/pages/Dashboard.tsx"]}',
  p_priority := 7,
  p_autonomy_level := 2
);

-- Level 3 Task (benötigt Approval via GitKraken)
SELECT create_autonomous_task(
  p_task_type := 'new_feature',
  p_description := 'Add export to Excel functionality',
  p_task_data := '{"files": ["src/components/CustomerTable.tsx"], "requires": ["xlsx library"]}',
  p_priority := 5,
  p_autonomy_level := 3
);
```

### Task erstellen (via Edge Function - empfohlen)

```typescript
const { data, error } = await supabase.functions.invoke(
  "create-autonomous-task",
  {
    body: {
      task_type: "performance_optimization",
      description: "Memoize expensive components",
      task_data: {
        files: ["src/components/Dashboard.tsx"],
        components: ["StatisticsCard", "RevenueChart"],
      },
      priority: 6,
      autonomy_level: 2,
    },
  }
);
```

---

## 🔒 Sicherheitsmechanismen

### 1. Dry-Run Mode (DEFAULT)

**Standard: `dry_run_mode = true`**

- ✅ Agent simuliert Änderungen
- ✅ Keine tatsächlichen Dateimodifikationen
- ✅ Logging wie bei echter Ausführung
- ✅ Perfekt zum Testen

```sql
-- Dry-Run aktivieren (SICHER)
UPDATE autonomous_system_config SET dry_run_mode = true WHERE id = 1;

-- Dry-Run deaktivieren (VORSICHT - echte Änderungen!)
UPDATE autonomous_system_config SET dry_run_mode = false WHERE id = 1;
```

### 2. Autonomy Levels

| Level | Beschreibung     | Beispiele                                          | Approval?                |
| ----- | ---------------- | -------------------------------------------------- | ------------------------ |
| **1** | Read-only        | Analyse, Reporting                                 | ❌                       |
| **2** | Safe changes     | Layout fixes, Type improvements, Performance, Docs | ❌                       |
| **3** | Breaking changes | Database schema, New features, API changes         | ✅ (via GitKraken Patch) |

### 3. Safety Checks

Vor jeder Task-Ausführung:

```typescript
✅ Build validation (npm run type-check)
✅ Test validation (npm run test:unit)
✅ Lint check (npm run lint)
✅ RLS validation (custom check)
✅ Breaking changes detection
```

**Bei Fehler:** Task wird abgebrochen, Emergency Stop optional.

### 4. Emergency Stop

**Sofortiges Stoppen aller autonomen Aktivitäten:**

```bash
# Via CLI
npm run autonomous:emergency-stop "Build failing after last change"

# Via SQL
SELECT emergency_stop_autonomous_system('Critical bug detected', 48);

# Via Supabase Dashboard
UPDATE autonomous_system_config SET emergency_stop = true, emergency_stop_reason = 'Manual stop' WHERE id = 1;
```

**Deaktivieren:**

```sql
UPDATE autonomous_system_config SET emergency_stop = false WHERE id = 1;
```

### 5. Rate Limiting

- ✅ Max 50 Tasks/Tag (Standard)
- ✅ Max 5 parallele Tasks
- ✅ Min. 60 Minuten zwischen Tasks
- ✅ Max 10 GitKraken Patches/Stunde

### 6. Rollback bei Fehler

**GitHub Actions Workflow:**

```yaml
rollback:
  if: failure()
  steps:
    - Emergency Stop aktivieren
    - Git Reset --hard HEAD
    - Alert E-Mail senden
```

---

## 🔄 Workflows

### Level 2 Autonomous Workflow (Kein Approval)

```
1. Task in DB erstellt (autonomy_level = 2)
2. GitHub Actions (stündlich) erkennt Task
3. Safety Checks ausgeführt
4. Änderungen angewendet (wenn dry_run_mode = false)
5. Build & Test Validation
6. Bei Erfolg: Task completed
7. Bei Fehler: Rollback + Emergency Stop
```

### Level 3 Approval Workflow (GitKraken)

```
1. Task in DB erstellt (autonomy_level = 3)
2. GitHub Actions erkennt Task
3. Safety Checks ausgeführt
4. Änderungen generiert (NICHT angewendet)
5. GitKraken Patch erstellt via Edge Function
6. E-Mail Benachrichtigung an Notification Email
7. User reviewed Patch in GitKraken
8. User approved → Merge → Deployment
9. Task Status: awaiting_review → completed
```

---

## 📊 Monitoring

### Health Check

```bash
npm run autonomous:health
```

**Output:**

```
🔍 Running autonomous system health check...

=== HEALTH STATUS ===
Overall: ✅ HEALTHY

=== CHECKS ===
✅ Emergency Stop: No emergency stop active
✅ System Enabled: System enabled
⚠️  Dry-Run Mode: Dry-run mode active (no changes)
✅ Failed Tasks: Only 2 failed tasks
✅ Success Rate: Success rate: 92.5%
✅ Pending Tasks: 3 pending tasks
✅ Last Execution: Last execution 2.3 hours ago

=== SUMMARY ===
Total Tasks: 47
Pending: 3
Failed: 2
Success Rate: 92.5%
Last Execution: 2025-11-08T14:23:45.123Z
```

### Logs anzeigen

```sql
-- Letzte 10 Execution Logs
SELECT * FROM autonomous_execution_logs
ORDER BY timestamp DESC
LIMIT 10;

-- Tasks mit Fehlern
SELECT * FROM autonomous_tasks
WHERE status = 'failed'
ORDER BY created_at DESC;

-- Erfolgsrate der letzten 24h
SELECT * FROM autonomous_task_statistics;
```

### Dashboard (Supabase Studio)

1. **Supabase Dashboard** öffnen
2. **Table Editor** → `autonomous_tasks`
3. Filter: `status = 'pending'` → Offene Tasks
4. **SQL Editor** → `SELECT * FROM autonomous_task_statistics;`

---

## 🐛 Troubleshooting

### Problem: Agent führt keine Tasks aus

**Checklist:**

```sql
-- 1. System enabled?
SELECT enabled, dry_run_mode FROM autonomous_system_config;

-- 2. Emergency Stop aktiv?
SELECT emergency_stop, emergency_stop_reason FROM autonomous_system_config;

-- 3. Pending Tasks vorhanden?
SELECT COUNT(*) FROM autonomous_tasks WHERE status = 'pending';

-- 4. Daily Limit erreicht?
SELECT COUNT(*) FROM autonomous_tasks
WHERE created_at >= CURRENT_DATE;
```

**Lösung:**

```sql
-- System aktivieren
UPDATE autonomous_system_config SET enabled = true WHERE id = 1;

-- Emergency Stop deaktivieren
UPDATE autonomous_system_config SET emergency_stop = false WHERE id = 1;
```

### Problem: Safety Checks schlagen fehl

```bash
# Manuell ausführen:
npm run type-check
npm run lint
npm run test:unit

# Bei TypeScript-Fehlern:
npm run lint:fix

# Bei Test-Fehlern:
# → Tests fixen oder Task anpassen
```

### Problem: GitKraken Patch schlägt fehl

**Checklist:**

1. `GITKRAKEN_API_TOKEN` gesetzt? (Supabase Dashboard → Edge Functions → Secrets)
2. API Token valid? (Testen in GitKraken Dashboard)
3. Rate Limit erreicht? (Max 10 Patches/Stunde)

**Logs prüfen:**

```sql
SELECT * FROM autonomous_execution_logs
WHERE execution_step = 'gitkraken_patch_creation'
AND step_status = 'failed'
ORDER BY timestamp DESC
LIMIT 5;
```

### Problem: GitHub Actions Workflow läuft nicht

**Checklist:**

1. Workflow aktiviert? (`.github/workflows/autonomous-agent.yml` vorhanden?)
2. Secrets konfiguriert? (GitHub Settings → Secrets)
3. Schedule korrekt? (Cron: `0 * * * *` = stündlich)

**Manuell triggern:**

1. GitHub → Actions → "Autonomous Development Agent"
2. "Run workflow" → "master" → "Run workflow"

### Problem: Zu viele Failed Tasks

```sql
-- Fehlermuster analysieren
SELECT error, COUNT(*) as count
FROM autonomous_tasks
WHERE status = 'failed'
GROUP BY error
ORDER BY count DESC;

-- Spezifische Fehler prüfen
SELECT * FROM autonomous_tasks
WHERE status = 'failed'
ORDER BY completed_at DESC
LIMIT 10;
```

**Lösung:**

- Emergency Stop aktivieren
- Fehlerursache beheben
- Failed Tasks resetten:

```sql
UPDATE autonomous_tasks
SET status = 'pending', error = NULL, started_at = NULL, completed_at = NULL
WHERE status = 'failed' AND created_at >= CURRENT_DATE;
```

---

## 🧪 Testing

### Unit Tests

```bash
# Alle Tests
npm run test:unit

# Einzelner Test
npm run test:unit -- autonomous-agent

# Coverage
npm run test:coverage
```

### Integration Tests

```bash
# Dry-Run Test (SICHER)
npm run autonomous:dry-run

# Task erstellen und beobachten
psql -c "SELECT create_autonomous_task('layout_fix', 'Test task', '{}', 5, 2);"
npm run autonomous:start
npm run autonomous:status
```

### E2E Test (GitKraken Workflow)

```bash
# 1. Test-Task erstellen (Level 3)
psql -c "SELECT create_autonomous_task('test_feature', 'E2E Test', '{}', 5, 3);"

# 2. Agent ausführen (erstellt Patch)
npm run autonomous:start

# 3. GitKraken Patch prüfen
# → E-Mail mit Patch-Link erhalten
# → Patch in GitKraken öffnen
# → Review → Approve → Merge

# 4. Task-Status prüfen
psql -c "SELECT * FROM autonomous_tasks WHERE task_type = 'test_feature';"
# → Status sollte 'awaiting_review' oder 'completed' sein
```

---

## 📚 Best Practices

### DO ✅

- **Immer mit Dry-Run Mode starten**
- **Safety Checks ernst nehmen** (nicht überspringen)
- **Emergency Stop bei Unsicherheit** aktivieren
- **Regelmäßige Health Checks** (täglich)
- **GitKraken Patches gründlich reviewen**
- **Logging monitoren** (Fehler frühzeitig erkennen)
- **Rate Limits respektieren** (nicht erhöhen ohne Grund)

### DON'T ❌

- **Niemals `dry_run_mode = false` ohne Test setzen**
- **Niemals Safety Checks deaktivieren** (`is_blocking = false`)
- **Niemals Rate Limits auf 0 setzen** (kann System überlasten)
- **Niemals Emergency Stop ignorieren** (kann System schützen)
- **Niemals Service Role Key in Frontend** (nur Server-Side!)
- **Niemals ohne Backup** Produktionsdaten ändern

---

## 🔧 Konfiguration

### System-Konfiguration anpassen

```sql
-- Dry-Run Mode deaktivieren (VORSICHT!)
UPDATE autonomous_system_config SET dry_run_mode = false WHERE id = 1;

-- Daily Task Limit erhöhen
UPDATE autonomous_system_config SET max_daily_tasks = 100 WHERE id = 1;

-- Parallele Tasks erhöhen
UPDATE autonomous_system_config SET max_parallel_tasks = 10 WHERE id = 1;

-- Notification E-Mail ändern
UPDATE autonomous_system_config SET notification_email = 'dev@mydispatch.ai' WHERE id = 1;
```

### Safety Checks anpassen

```sql
-- Check deaktivieren (NICHT EMPFOHLEN!)
UPDATE autonomous_safety_checks SET enabled = false WHERE check_type = 'lint';

-- Check als non-blocking markieren
UPDATE autonomous_safety_checks SET is_blocking = false WHERE check_type = 'test';
```

### GitHub Actions Schedule anpassen

```yaml
# .github/workflows/autonomous-agent.yml
schedule:
  - cron: "0 */2 * * *" # Alle 2 Stunden statt stündlich
```

---

## 📞 Support

### Kontakt

- **E-Mail:** courbois1981@gmail.com
- **GitHub Issues:** https://github.com/MyDispatch/mydispatch-rebuild/issues
- **GitKraken:** https://gitkraken.dev

### Emergency Stop aktivieren

```bash
npm run autonomous:emergency-stop "Emergency - contact support"
```

### Logs exportieren

```sql
-- Export als CSV
COPY (
  SELECT * FROM autonomous_execution_logs
  WHERE timestamp >= NOW() - INTERVAL '24 hours'
  ORDER BY timestamp DESC
) TO '/tmp/autonomous_logs.csv' CSV HEADER;
```

---

## 📝 Changelog

### v1.0 (2025-11-08)

- ✅ Initial Release
- ✅ Database Schema mit 4 Tabellen
- ✅ `create-gitkraken-patch` Edge Function
- ✅ `autonomous-agent.ts` Core Script
- ✅ GitHub Actions Workflow
- ✅ Health Monitoring System
- ✅ Emergency Stop Mechanism
- ✅ Comprehensive Documentation

---

## 📄 License

Copyright © 2025 MyDispatch
**Internal Use Only** - Not Open Source

---

**🚀 Happy Autonomous Coding!**
