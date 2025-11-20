# FEHLER-LOG UPDATE - F-025

**Datum:** 2025-10-24 17:00  
**Fehler:** monitoring_logs.metadata does not exist  
**Severity:** 🔴 CRITICAL  
**Status:** ✅ RESOLVED

---

## F-025: monitoring_logs Spalten-Inkonsistenz (2025-10-24)

**Severity:** 🔴 CRITICAL  
**Category:** Database Schema / SQL Error  
**Status:** ✅ RESOLVED

### Problem

**Symptome:**

- Postgres ERROR: `column monitoring_logs.metadata does not exist`
- Alert-System Hooks (`use-alert-statistics.ts`, `use-latest-alerts.ts`) können nicht laden
- Master-Dashboard AlertWidget zeigt Fehler
- System-Monitoring funktioniert nicht

**Console Log (Postgres):**

```
ERROR: column monitoring_logs.metadata does not exist
Location: src/hooks/use-alert-system.ts
```

### Root Cause

**Warum entstanden?**

1. Migration `20251024075946` erstellt `monitoring_logs` mit Spalte `details` (JSONB)
2. Alert-System Hooks versuchen `metadata` zu lesen
3. **Spalten-Mismatch:** `details` (DB) vs. `metadata` (Code)
4. WATCHDOG_AI_ARCHITECTURE_V18.5.1.md verwendet `metadata`
5. alert_logs verwendet `metadata` (konsistent)
6. monitoring_logs verwendete `details` (inkonsistent)

**Betroffene Dateien:**

```
supabase/migrations/20251024075946_*.sql (Line 14: details JSONB)
src/hooks/use-alert-system.ts (verwendet alert_logs.metadata)
docs/WATCHDOG_AI_ARCHITECTURE_V18.5.1.md (spezifiziert metadata)
```

### Lösung

**Migration erstellt:**

```sql
-- Benenne 'details' zu 'metadata' um
ALTER TABLE public.monitoring_logs
  RENAME COLUMN details TO metadata;

-- Kommentar für Dokumentation
COMMENT ON COLUMN public.monitoring_logs.metadata IS
  'Additional context data as JSONB (previously named details)';
```

**Konsistenz hergestellt:**

- ✅ `monitoring_logs.metadata` (JSONB)
- ✅ `alert_logs.metadata` (JSONB)
- ✅ Beide Tabellen verwenden gleichen Spalten-Namen

### Betroffene Dateien

- ✅ `supabase/migrations/20251024081031_*.sql` (FIX erstellt)
- ✅ `src/hooks/use-alert-system.ts` (funktioniert jetzt)
- ✅ `src/components/dashboard/AlertWidget.tsx` (lädt jetzt korrekt)

### Prävention

**Pre-Implementation Checklist:**

```
[ ] Schema-Konsistenz prüfen (z.B. metadata vs. details)?
[ ] Migrations gegen Docs validieren?
[ ] Code vs. DB-Schema abgleichen?
[ ] Postgres Logs checken vor Deploy?
```

**Lessons Learned:**

1. **Spalten-Namen konsistent halten:** `metadata` für alle Monitoring-Tabellen
2. **Schema-Docs als Source of Truth:** WATCHDOG_AI_ARCHITECTURE ist Referenz
3. **Postgres Logs prüfen:** ERROR sofort nach Migration erkennbar
4. **Code vs. DB abgleichen:** Hooks müssen Schema matchen

### Testing

**Manual Testing:**

- [x] Master-Dashboard lädt ohne Fehler
- [x] AlertWidget zeigt Statistiken
- [x] Postgres Logs KEINE Errors mehr
- [x] Alert-System Hooks funktionieren

**Automated Testing:**

```sql
-- Prüfe Spalte existiert
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'monitoring_logs'
  AND column_name = 'metadata';

-- Expected: 1 Row (metadata existiert)
```

### Timeline

- **2025-10-24 16:45:** ERROR in Postgres Logs identifiziert
- **2025-10-24 16:50:** Root Cause analysiert (Spalten-Mismatch)
- **2025-10-24 17:00:** Migration erstellt & deployed ✅
- **2025-10-24 17:05:** Testing abgeschlossen ✅

---

**Version:** 18.5.1  
**Datum:** 2025-10-24  
**Status:** ✅ RESOLVED
