# Autonomous System - Dauerhafte Betreuung & Monitoring

## 📋 Übersicht

Das Autonomous System ist vollständig eingerichtet und getestet. Diese Anleitung beschreibt die dauerhafte Betreuung und Überwachung.

---

## 🎯 Tägliche Monitoring-Routine

### 1. Morgen-Check (5 Minuten)

```bash
# System-Status abrufen
npm run autonomous:test

# Erwartete Ausgabe:
# ✅ Passed: 8/8
# 🎉 All tests passed!
```

**Bei Problemen:**

- ❌ Test 1 failed: Supabase Verbindung prüfen
- ❌ Test 4 failed: Edge Function Logs im Dashboard prüfen
- ❌ Test 7 failed: PostgreSQL Function Permissions prüfen

### 2. Health-Check Dashboard

**URL:** https://mydispatch.vercel.app/autonomous

**Prüfe:**

- ✅ Health Status: "Gesund" oder "Aktiv"
- ✅ Pending Tasks < 10
- ✅ Failed Tasks Rate < 10%
- ✅ Letzte Ausführung < 10 Minuten

### 3. Supabase Dashboard

**URL:** https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg

**Prüfe:**

1. **Edge Functions Logs:**
   - Keine 500-Fehler in den letzten 24h
   - Response-Zeit < 2s

2. **Database Logs:**
   - Keine RLS Violations
   - Keine Deadlocks

3. **Cron Jobs:**
   - `autonomous-agent-poll` Status: ACTIVE
   - Letzte Ausführung: < 5 Minuten
   - Erfolgsrate: > 95%

---

## 🔧 Wöchentliche Wartung

### Montag: System-Audit

```bash
# 1. Vollständiger Test
npm run autonomous:test

# 2. Datenbank-Bereinigung (optional)
# Alte Logs entfernen (> 30 Tage)
# SQL im Supabase SQL Editor:
DELETE FROM autonomous_execution_logs
WHERE created_at < NOW() - INTERVAL '30 days';
```

### Mittwoch: Performance-Check

```sql
-- Supabase SQL Editor
-- Durchschnittliche Task-Ausführungszeit
SELECT
  task_type,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_duration_seconds,
  COUNT(*) as total_tasks
FROM autonomous_tasks
WHERE completed_at IS NOT NULL
AND created_at > NOW() - INTERVAL '7 days'
GROUP BY task_type;
```

**Erwartete Werte:**

- `documentation`: < 30s
- `layout_fix`: < 45s
- `type_improvement`: < 60s
- `performance_optimization`: < 90s

### Freitag: Erfolgsrate-Review

```sql
-- Supabase SQL Editor
-- Wöchentliche Erfolgsrate
SELECT
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'completed') / COUNT(*), 2) as success_rate
FROM autonomous_tasks
WHERE created_at > NOW() - INTERVAL '7 days';
```

**Ziel:** Success Rate > 90%

---

## 🚨 Alarme & Benachrichtigungen

### Kritische Alarme (Sofort handeln)

1. **System gestoppt (Emergency Stop aktiv)**

   ```bash
   # Status prüfen
   npm run autonomous:status

   # Wenn berechtigt, Emergency Stop aufheben:
   # SQL im Supabase SQL Editor:
   UPDATE autonomous_system_config
   SET emergency_stop = false,
       emergency_stop_reason = NULL
   WHERE id = 1;
   ```

2. **Edge Function offline (404 Fehler)**
   - Prüfe Deployment-Status im Supabase Dashboard
   - Re-deploye wenn nötig:
     ```bash
     npx supabase functions deploy ai-agent-poll --project-ref ygpwuiygivxoqtyoigtg
     ```

3. **Datenbank-Verbindung verloren**
   - Prüfe Supabase Status: https://status.supabase.com
   - Prüfe RLS Policies (könnte Service Role Key rotiert sein)

### Warnungen (Innerhalb 24h handeln)

1. **Erfolgsrate < 80%**
   - Prüfe fehlgeschlagene Tasks im Dashboard
   - Analysiere häufigste Fehler-Typen
   - Verbessere Error Handling in betroffenen Task-Typen

2. **Pending Tasks > 20**
   - System überlastet oder hängt
   - Erhöhe `max_parallel_tasks` (vorsichtig):
     ```sql
     UPDATE autonomous_system_config
     SET max_parallel_tasks = 10
     WHERE id = 1;
     ```

3. **Ausführungszeit steigt**
   - Prüfe Supabase Database Performance
   - Optimiere langsame Tasks

---

## 📊 Metriken & KPIs

### Erfolgs-Metriken

| Metrik                        | Ziel  | Warnung | Kritisch |
| ----------------------------- | ----- | ------- | -------- |
| Success Rate                  | > 95% | < 90%   | < 80%    |
| Avg. Execution Time           | < 60s | > 120s  | > 300s   |
| Failed Tasks (24h)            | < 5   | 5-20    | > 20     |
| System Uptime                 | > 99% | 95-99%  | < 95%    |
| Response Time (Edge Function) | < 2s  | 2-5s    | > 5s     |

### Produktivitäts-Metriken

```sql
-- Supabase SQL Editor
-- Tasks pro Tag (letzte 30 Tage)
SELECT
  DATE(created_at) as date,
  COUNT(*) as tasks_created,
  COUNT(*) FILTER (WHERE status = 'completed') as tasks_completed
FROM autonomous_tasks
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## 🔄 Backup & Recovery

### Automatisches Backup

**Supabase** erstellt automatisch Backups:

- Point-in-Time Recovery (PITR): Letzte 7 Tage
- Weekly Backups: Letzte 4 Wochen

**Zugriff:**
https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/database/backups

### Manuelles Backup (vor großen Änderungen)

```bash
# 1. Database Schema
npx supabase db dump --project-ref ygpwuiygivxoqtyoigtg > backup_schema.sql

# 2. Autonomous System Data
# SQL im Supabase SQL Editor:
COPY (SELECT * FROM autonomous_tasks) TO '/tmp/tasks_backup.csv' CSV HEADER;
COPY (SELECT * FROM autonomous_system_config) TO '/tmp/config_backup.csv' CSV HEADER;
```

### Recovery-Prozedur

**Bei kritischem Fehler:**

1. **Emergency Stop aktivieren:**

   ```bash
   npm run autonomous:emergency-stop
   ```

2. **System zurücksetzen:**

   ```sql
   -- Alle pending Tasks abbrechen
   UPDATE autonomous_tasks
   SET status = 'cancelled'
   WHERE status IN ('pending', 'in_progress');

   -- Dry-Run Mode aktivieren
   UPDATE autonomous_system_config
   SET dry_run_mode = true
   WHERE id = 1;
   ```

3. **Neue Tasks erstellen:**

   ```bash
   npm run autonomous:test
   ```

4. **Schrittweise reaktivieren:**

   ```sql
   -- Emergency Stop aufheben
   UPDATE autonomous_system_config
   SET emergency_stop = false
   WHERE id = 1;

   -- Nach erfolgreichem Test: Dry-Run deaktivieren
   UPDATE autonomous_system_config
   SET dry_run_mode = false
   WHERE id = 1;
   ```

---

## 🔐 Sicherheit & Compliance

### Zugriffskontrolle

**Wer hat Zugriff?**

- Master Account: `courbois1981@gmail.com` (voller Zugriff)
- Service Role Key: Nur in `.env.local` (NIEMALS committen!)
- Edge Functions: Service Role Key als Environment Variable

**Secrets Rotation (vierteljährlich):**

1. **Neuen Service Role Key generieren:**
   - Supabase Dashboard → Settings → API → Generate new service_role key

2. **Überall aktualisieren:**
   - `.env.local` (lokal)
   - GitHub Secrets (SUPABASE_SERVICE_ROLE_KEY)
   - Supabase Edge Functions Secrets

3. **Alten Key deaktivieren:**
   - Nach 7 Tagen Übergangsphase

### Audit Trail

**Alle Aktionen werden geloggt in:**

- `autonomous_execution_logs` (detaillierte Ausführung)
- `autonomous_safety_checks` (Sicherheits-Validierungen)

**Audit-Query (letzte 7 Tage):**

```sql
SELECT
  t.task_type,
  t.description,
  t.status,
  t.created_at,
  t.completed_at,
  l.execution_step,
  l.step_status
FROM autonomous_tasks t
LEFT JOIN autonomous_execution_logs l ON t.id = l.task_id
WHERE t.created_at > NOW() - INTERVAL '7 days'
ORDER BY t.created_at DESC;
```

---

## 📞 Support & Eskalation

### Kontakte

| Rolle          | Name                   | Verantwortung            |
| -------------- | ---------------------- | ------------------------ |
| System Owner   | Master Account         | Gesamtsystem             |
| Supabase Admin | courbois1981@gmail.com | Database, Edge Functions |
| GitHub Admin   | MyDispatch Org         | Repository, Secrets      |

### Eskalations-Matrix

| Problem              | Schwere  | Reaktionszeit | Kontakt             |
| -------------------- | -------- | ------------- | ------------------- |
| System offline       | Kritisch | Sofort        | Master Account      |
| Edge Function Error  | Hoch     | 1h            | Supabase Support    |
| Hohe Failed Rate     | Mittel   | 24h           | Code Review         |
| Performance-Probleme | Niedrig  | 7 Tage        | Optimization Sprint |

### Hilfreiche Links

- **Supabase Status:** https://status.supabase.com
- **GitHub Status:** https://www.githubstatus.com
- **Vercel Status:** https://www.vercel-status.com
- **Projekt URL:** https://mydispatch.vercel.app

---

## 📚 Weiterführende Dokumentation

- `AUTONOMOUS_SYSTEM_FINAL_SETUP.md` - Setup & Erste Schritte
- `AUTONOMOUS_ACTIVATION_SUMMARY.md` - Aktivierungs-Log
- `docs/AUTONOMOUS_SYSTEM_README.md` - Technische Details
- `.github/copilot-instructions.md` - Autonomous System Sektion

---

**Letzte Aktualisierung:** 2025-11-08
**Version:** V1.0
**Status:** ✅ Production Ready
