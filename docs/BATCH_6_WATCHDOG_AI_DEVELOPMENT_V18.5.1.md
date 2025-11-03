# BATCH 6: WATCHDOG-AI DEVELOPMENT V18.5.1

**Status:** 📋 GEPLANT  
**Datum:** 2025-10-24  
**Zweck:** 24/7 System-Überwachung mit Watchdog-AI + Central Brain

---

## 🎯 ZIELE

### 1. **Watchdog-AI Edge Function**
- ✅ Edge Function `watchdog-monitor` entwickeln
- ✅ System-Scans (Frontend, Backend, Docs, Tests)
- ✅ Alarm-System (INFO, WARNING, CRITICAL)
- ✅ Metrics-Tracking (Bundle Size, Load Time, Coverage)

### 2. **Central Brain Edge Function**
- ✅ Orchestrierung aller AI-Agenten (NeXify, Docs-Agent, Watchdog-AI)
- ✅ Status-Aggregation
- ✅ Inter-Agent-Communication
- ✅ Rollback-Management

### 3. **Database Schema**
- ✅ Tabelle `monitoring_logs` erstellen
- ✅ Indexes für Performance
- ✅ RLS-Policies (Admin-only Access)

### 4. **Monitoring Cron Job**
- ✅ Alle 30min automatischer Scan
- ✅ CRITICAL Findings → Sofort-Alarm
- ✅ Logging in Database

---

## 📋 PRIORISIERUNG

### Priority 1 (KRITISCH - 3-4 Stunden)
1. **Watchdog-AI Edge Function** (60min)
   - Basic Scan-Funktionen
   - Alarm-Logic
   - Response-Format
2. **Central Brain Edge Function** (45min)
   - Agent-Orchestration
   - Status-API
3. **Database Schema** (15min)
   - `monitoring_logs` Tabelle
   - RLS-Policies
4. **Testing** (60min)
   - Manual Tests aller Functions
   - Error-Handling

### Priority 2 (WICHTIG - 2-3 Stunden)
1. **Monitoring Cron Job** (45min)
   - Supabase Cron Setup
   - Auto-Trigger Logic
2. **Frontend-Scans** (60min)
   - Direct Colors Detection
   - Mobile Touch-Target Check
   - Layout Freeze Validation
3. **Backend-Scans** (45min)
   - RLS-Policies Check
   - Edge Function Health

### Priority 3 (NICE-TO-HAVE - 1-2 Stunden)
1. **Monitoring Dashboard UI** (60min)
   - Admin Route `/admin/monitoring`
   - Real-Time Health Status
2. **Advanced Metrics** (30min)
   - Visual Regression
   - Bundle Analysis

---

## 🏗️ ARCHITEKTUR-DETAILS

### 1. Watchdog-AI Edge Function

**File:** `supabase/functions/watchdog-monitor/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { action, scope } = await req.json();
  
  // action: "scan" | "report" | "alert"
  // scope: "full" | "frontend" | "backend" | "docs" | "tests"
  
  let findings: Finding[] = [];
  
  if (scope === 'frontend' || scope === 'full') {
    findings.push(...await scanFrontend());
  }
  
  if (scope === 'backend' || scope === 'full') {
    findings.push(...await scanBackend());
  }
  
  if (scope === 'docs' || scope === 'full') {
    findings.push(...await scanDocs());
  }
  
  const status = determineStatus(findings);
  
  return new Response(JSON.stringify({
    status,
    findings,
    metrics: await collectMetrics()
  }), { headers: { 'Content-Type': 'application/json' } });
});

async function scanFrontend(): Promise<Finding[]> {
  const findings: Finding[] = [];
  
  // 1. Direct Colors Check
  const directColors = await checkDirectColors();
  if (directColors.length > 5) {
    findings.push({
      severity: 'critical',
      category: 'design',
      message: `${directColors.length} components use direct colors (text-white, bg-black)`,
      location: directColors.join(', '),
      recommendation: 'Use semantic tokens (bg-primary, text-foreground)'
    });
  }
  
  // 2. Mobile Touch-Targets Check
  const smallTargets = await checkTouchTargets();
  if (smallTargets.length > 0) {
    findings.push({
      severity: 'warning',
      category: 'ux',
      message: `${smallTargets.length} buttons < 44px (Apple/Google Guidelines)`,
      location: smallTargets.join(', '),
      recommendation: 'Add min-h-[44px] to interactive elements'
    });
  }
  
  // 3. Layout Freeze Check
  const layoutChanges = await checkLayoutFreeze();
  if (layoutChanges.length > 0) {
    findings.push({
      severity: 'critical',
      category: 'design',
      message: 'Layout Freeze violated on protected pages',
      location: layoutChanges.join(', '),
      recommendation: 'Revert changes to Index.tsx, Auftraege.tsx'
    });
  }
  
  return findings;
}

async function scanBackend(): Promise<Finding[]> {
  const findings: Finding[] = [];
  
  // 1. RLS-Policies Check
  const missingRLS = await checkRLSPolicies();
  if (missingRLS.length > 0) {
    findings.push({
      severity: 'critical',
      category: 'security',
      message: `${missingRLS.length} tables without RLS policies`,
      location: missingRLS.join(', '),
      recommendation: 'Enable RLS and create policies'
    });
  }
  
  // 2. Edge Functions Health
  const unhealthyFunctions = await checkEdgeFunctions();
  if (unhealthyFunctions.length > 0) {
    findings.push({
      severity: 'warning',
      category: 'backend',
      message: `${unhealthyFunctions.length} edge functions not responding`,
      location: unhealthyFunctions.join(', '),
      recommendation: 'Check logs and redeploy'
    });
  }
  
  return findings;
}

async function scanDocs(): Promise<Finding[]> {
  const findings: Finding[] = [];
  
  // 1. Veraltete Docs Check
  const outdatedDocs = await checkDocVersions();
  if (outdatedDocs.length > 0) {
    findings.push({
      severity: 'info',
      category: 'docs',
      message: `${outdatedDocs.length} docs still on V18.3 (should be V18.5.1)`,
      location: outdatedDocs.join(', '),
      recommendation: 'Update or archive old versions'
    });
  }
  
  return findings;
}

async function collectMetrics() {
  return {
    bundleSize: await getBundleSize(), // "1.2MB"
    loadTime: await getLoadTime(), // "2.4s"
    testCoverage: await getTestCoverage(), // "65%"
    rlsPolicies: await countRLSPolicies(), // 15
    lastDeployment: await getLastDeployment() // "2025-10-24T09:30:00Z"
  };
}

function determineStatus(findings: Finding[]): 'ok' | 'warning' | 'critical' {
  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  const warningCount = findings.filter(f => f.severity === 'warning').length;
  
  if (criticalCount > 0) return 'critical';
  if (warningCount > 0) return 'warning';
  return 'ok';
}
```

### 2. Central Brain Edge Function

**File:** `supabase/functions/central-brain/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from '@supabase/supabase-js';

serve(async (req) => {
  const { command, agents } = await req.json();
  const supabase = createClient(...);
  
  if (command === 'status') {
    // Rufe Status von allen Agents ab
    const nexifyStatus = await getNexifyStatus();
    const docsStatus = await getDocsStatus(supabase);
    const watchdogStatus = await getWatchdogStatus(supabase);
    
    const systemHealth = determineSystemHealth([nexifyStatus, docsStatus, watchdogStatus]);
    
    return new Response(JSON.stringify({
      nexifyStatus,
      docsStatus,
      watchdogStatus,
      systemHealth
    }), { headers: { 'Content-Type': 'application/json' } });
  }
  
  if (command === 'sync') {
    // Synchronisiere alle Agents
    await syncAgents(supabase, agents);
    
    return new Response(JSON.stringify({
      status: 'synced',
      timestamp: new Date().toISOString()
    }), { headers: { 'Content-Type': 'application/json' } });
  }
  
  // ... weitere Commands (deploy, rollback)
});

async function getWatchdogStatus(supabase: any) {
  const { data: latestScan } = await supabase
    .from('monitoring_logs')
    .select('*')
    .eq('agent', 'watchdog')
    .order('scan_timestamp', { ascending: false })
    .limit(1)
    .single();
  
  return {
    lastScan: latestScan?.scan_timestamp,
    findings: latestScan?.findings?.length || 0,
    status: latestScan?.status || 'unknown'
  };
}

async function getDocsStatus(supabase: any) {
  // Call manage-docs with action: "validate"
  const { data } = await supabase.functions.invoke('manage-docs', {
    body: { action: 'validate' }
  });
  
  return {
    lastSync: new Date().toISOString(),
    docsUpToDate: data?.designConsistency?.status === 'ok'
  };
}
```

### 3. Database Schema

**Migration:**

```sql
-- ==================================================================================
-- WATCHDOG-AI MONITORING SYSTEM V18.5.1
-- ==================================================================================

-- Monitoring Logs Tabelle
CREATE TABLE public.monitoring_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent VARCHAR(50) NOT NULL, -- 'watchdog' | 'docs' | 'nexify'
  scope VARCHAR(50) NOT NULL, -- 'frontend' | 'backend' | 'docs' | 'tests' | 'full'
  status VARCHAR(20) NOT NULL, -- 'ok' | 'warning' | 'critical'
  findings JSONB DEFAULT '[]',
  metrics JSONB DEFAULT '{}',
  scan_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes für Performance
CREATE INDEX idx_monitoring_logs_scan_timestamp ON public.monitoring_logs(scan_timestamp DESC);
CREATE INDEX idx_monitoring_logs_status ON public.monitoring_logs(status);
CREATE INDEX idx_monitoring_logs_agent ON public.monitoring_logs(agent);

-- RLS-Policies (Admin-only)
ALTER TABLE public.monitoring_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view all monitoring logs"
ON public.monitoring_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Watchdog-AI can insert monitoring logs"
ON public.monitoring_logs
FOR INSERT
WITH CHECK (true); -- Edge Function hat Service-Role-Key

-- Agent Status Tabelle (für Central Brain)
CREATE TABLE public.agent_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name VARCHAR(50) NOT NULL UNIQUE,
  last_activity TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_task TEXT,
  progress INTEGER DEFAULT 0, -- 0-100%
  status VARCHAR(20) NOT NULL DEFAULT 'idle', -- 'idle' | 'working' | 'error'
  metadata JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS für agent_status
ALTER TABLE public.agent_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view agent status"
ON public.agent_status
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Agents can update their own status"
ON public.agent_status
FOR UPDATE
USING (true)
WITH CHECK (true); -- Service-Role-Key

-- Initial Agent-Einträge
INSERT INTO public.agent_status (agent_name, status) VALUES
  ('nexify', 'idle'),
  ('docs', 'idle'),
  ('watchdog', 'idle');
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Pre-Implementation
- [ ] WATCHDOG_AI_ARCHITECTURE_V18.5.1.md gelesen?
- [ ] Database Schema verstanden?
- [ ] AI-Modell-Kosten geprüft? (Lovable AI Budget)
- [ ] Rollback-Plan vorbereitet?

### Implementation
- [ ] `watchdog-monitor` Edge Function entwickelt
- [ ] `central-brain` Edge Function entwickelt
- [ ] Database Migration ausgeführt
- [ ] Manual Tests durchgeführt
- [ ] Error-Handling implementiert

### Post-Implementation
- [ ] Cron Job konfiguriert
- [ ] Erste Scans erfolgreich?
- [ ] Alarm-System funktioniert?
- [ ] Dokumentation aktualisiert?
- [ ] FEHLER_LOG erweitert bei Problemen?

---

## 📊 SUCCESS METRICS

| Metrik | Ziel | Status |
|--------|------|--------|
| **Edge Functions** | 2 deployed | ⏳ Pending |
| **Database Schema** | migration_logs Tabelle | ⏳ Pending |
| **First Scan** | Erfolgreich | ⏳ Pending |
| **Response Time** | < 5s | ⏳ Pending |
| **False Positives** | < 5% | 🔄 Monitoring |

---

## 🚨 RISKS & MITIGATION

### Risk 1: AI-Modell-Kosten zu hoch
**Mitigation:** Start mit 30min-Intervallen, später auf 1h erhöhen wenn zu teuer

### Risk 2: False Positives überwältigen NeXify
**Mitigation:** Severity-Filter (nur WARNING+ an NeXify), INFO nur loggen

### Risk 3: Performance-Impact auf System
**Mitigation:** Scans laufen async, kein Impact auf User-Facing Features

---

**Version:** 18.5.1  
**Status:** 📋 Geplant  
**Estimated Time:** 6-8 Stunden (AI-Zeit)  
**Nächste Review:** Nach Implementation Testing
