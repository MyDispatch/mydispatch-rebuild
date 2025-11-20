# 📊 LOAD-TEST EXECUTION GUIDE - V18.3.24

**Datum:** 2025-10-20  
**Ziel:** >500 Fahrzeuge (50 req/s), >95% Success-Rate, <2s p95

---

## ⚙️ INSTALLATION

### Schritt 1: Artillery installieren

```bash
# Global installation (einmalig)
npm install -g artillery
```

### Schritt 2: Projekt auschecken

```bash
# Falls noch nicht vorhanden
git clone https://github.com/YOUR-USERNAME/mydispatch.git
cd mydispatch
```

---

## 🚀 TEST AUSFÜHRUNG

### Standard-Test (500 Fahrzeuge)

```bash
# Ausführen mit Report-Output
artillery run load-test.yml --output report.json

# HTML-Report generieren
artillery report report.json --output report.html

# Report im Browser öffnen
open report.html  # macOS
xdg-open report.html  # Linux
start report.html  # Windows
```

### Erweiterte Optionen

#### Test mit angepasster Last (z.B. 1000 Fahrzeuge = 100 req/s)

```bash
artillery run load-test.yml \
  --overrides '{"config": {"phases": [{"duration": 60, "arrivalRate": 100}]}}' \
  --output report-1000.json
```

#### Test mit Environment-Variables

```bash
# Setze VITE_SUPABASE_URL falls nicht in .env
VITE_SUPABASE_URL=https://vsbqyqhzxmwezlhzdmfd.supabase.co \
artillery run load-test.yml --output report.json
```

#### Test mit Verbose-Logging

```bash
artillery run load-test.yml --output report.json --debug
```

---

## 📈 ERWARTETE ERGEBNISSE

### Success-Kriterien

| Metrik            | Ziel     | Akzeptabel  | Kritisch  |
| ----------------- | -------- | ----------- | --------- |
| Success-Rate      | >95%     | 90-95%      | <90%      |
| p95 Response-Time | <2s      | 2-3s        | >3s       |
| p99 Response-Time | <3s      | 3-5s        | >5s       |
| Max Error-Rate    | <5%      | 5-10%       | >10%      |
| Throughput        | 50 req/s | 40-50 req/s | <40 req/s |

### Beispiel-Output (Ideal)

```
Summary report @ 05:15:00
------------------------------------------------------
Scenarios launched:  3000
Scenarios completed: 2950
Requests completed:  11800
Mean response/sec:   49.2
Response time (msec):
  min: 45
  max: 1850
  median: 320
  p95: 980
  p99: 1620
Scenario duration (msec):
  min: 234
  max: 5620
  median: 1240
  p95: 2450
  p99: 3120
Codes:
  200: 11650
  429: 120 (Rate-Limit - OK)
  500: 30 (0.25% - OK)
```

---

## 🔍 TROUBLESHOOTING

### Problem: Viele 500-Errors (>5%)

**Lösung:**

1. Prüfe Supabase Edge Function Logs:
   ```bash
   # Lovable Cloud → Backend → Edge Functions → Logs
   # Filter: get-traffic, get-weather, gps-tracker-webhook
   ```
2. Prüfe HERE API Rate-Limit:
   - Logs nach "429 Too Many Requests" suchen
   - Rate-Limit-Handler in `TrafficWidget.tsx` aktiviert?
3. Retry Test mit 30s Pause zwischen Phasen

### Problem: p95 >2s (langsame Responses)

**Lösung:**

1. Prüfe Materialized View Refresh:
   ```sql
   SELECT * FROM dashboard_stats; -- Sollte <5min alt sein
   ```
2. Prüfe Supabase Connection-Pool:
   - Lovable Cloud → Backend → Database → Performance
3. Prüfe Network-Latency:
   ```bash
   ping vsbqyqhzxmwezlhzdmfd.supabase.co
   ```

### Problem: 429-Errors von Supabase (>10%)

**Lösung:**

1. Reduziere Last:
   ```bash
   # Teste mit 25 req/s statt 50
   artillery run load-test.yml \
     --overrides '{"config": {"phases": [{"duration": 60, "arrivalRate": 25}]}}' \
     --output report-reduced.json
   ```
2. Prüfe Supabase Limits:
   - Lovable Cloud → Settings → Usage
   - Falls Limit erreicht: Upgrade zu Paid Plan

---

## 📊 RESULTS INTERPRETATION

### Scenario-Breakdown

```
Scenario: Dashboard Requests (40%)
  Success: 1180/1200 (98.3%)
  p95: 650ms
  Status: ✅ PASS

Scenario: Booking List Queries (30%)
  Success: 885/900 (98.3%)
  p95: 1200ms
  Status: ✅ PASS

Scenario: GPS Position Updates (20%)
  Success: 595/600 (99.2%)
  p95: 450ms
  Status: ✅ PASS

Scenario: Live-Map Traffic/Weather (10%)
  Success: 280/300 (93.3%)
  p95: 1800ms
  Status: ⚠️ ACCEPTABLE (HERE Rate-Limit: 20 × 429)
```

### Gesamtbewertung

- **PASS:** Success >95%, p95 <2s, Errors <5%
- **ACCEPTABLE:** Success 90-95%, p95 2-3s, Errors 5-10%
- **FAIL:** Success <90%, p95 >3s, Errors >10%

---

## 🎯 POST-TEST ACTIONS

### Bei PASS

1. ✅ Markiere Load-Test als abgeschlossen in `GO_LIVE_CHECKLIST_V18.3.24.md`
2. ✅ Commit Results: `git add report.html && git commit -m "Load-Test PASS (500 Vehicles)"`
3. ✅ Weiter zu nächstem Schritt (Sentry-DSN)

### Bei ACCEPTABLE

1. ⚠️ Dokumentiere Warnings in `SPRINT_47_P2_FINAL_GO_LIVE.md`
2. ⚠️ Plan für Optimierung (z.B. HERE Rate-Limit erhöhen)
3. ✅ Go-Live erlaubt (Minor Issues akzeptabel)

### Bei FAIL

1. ❌ Analysiere Logs (Supabase, Sentry, HERE API)
2. ❌ Fixe kritische Issues
3. ❌ Retry Load-Test nach 10min Pause
4. ❌ Eskaliere zu n8n-Alert falls weiterhin FAIL

---

## 📝 DOCUMENTATION

### Log zu brain_logs

```typescript
// Nach Test-Completion in Frontend:
await supabase.from("brain_logs").insert({
  agent_action: "load_test_completed",
  input_context: {
    test_type: "500_vehicles",
    duration_seconds: 250,
    phases: 5,
  },
  output_result: {
    success_rate: 98.3,
    p95_ms: 980,
    error_rate: 1.7,
    status: "pass",
  },
  success: true,
  confidence: 0.98,
});
```

---

**Erstellt von:** AI-Agent (No-Code Engineer)  
**Zeitstempel:** 2025-10-20 05:12:00 UTC  
**Version:** V18.3.24
