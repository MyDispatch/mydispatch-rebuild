# FEHLERDIAGNOSE FRAMEWORK V1.0

## 🎯 SYSTEMATISCHE FEHLERSUCHE

### 1. PRIMÄRE FEHLERQUELLEN-HIERARCHIE

```
Level 0: Environment & Configuration
├── SUPABASE_URL missing/incorrect
├── API Keys not configured
├── Environment variables mismatch
└── CORS configuration errors

Level 1: Build & Deployment
├── TypeScript compilation errors
├── Missing dependencies
├── Edge function deployment failures
└── Asset loading failures

Level 2: Runtime Errors
├── State management errors
├── API call failures
├── Authentication errors
└── Data validation errors

Level 3: Logic Errors
├── Business logic bugs
├── Race conditions
├── Memory leaks
└── Performance bottlenecks
```

### 2. FEHLERDIAGNOSE-CHECKLISTE

#### PHASE 1: Initial Assessment

- [ ] Check Console Logs (Browser DevTools)
- [ ] Check Network Tab (Failed Requests)
- [ ] Check Supabase Edge Function Logs
- [ ] Check Database Logs (Postgres)
- [ ] Check Authentication Status

#### PHASE 2: Root Cause Analysis

```typescript
// Diagnostic Query Template
const diagnose = async (errorType: string) => {
  // 1. Environment Check
  const envCheck = checkEnvironmentVariables();

  // 2. API Health Check
  const apiHealth = await checkAPIHealth();

  // 3. Database Connection
  const dbHealth = await checkDatabaseConnection();

  // 4. Authentication Status
  const authStatus = await checkAuthStatus();

  return {
    envCheck,
    apiHealth,
    dbHealth,
    authStatus,
    timestamp: new Date().toISOString(),
  };
};
```

#### PHASE 3: Isolation Testing

1. **Remove Dependencies**: Strip down to minimal code
2. **Add Logging**: Insert console.log at critical points
3. **Test in Isolation**: Run affected code in sandbox
4. **Compare with Working Code**: Diff against last working version

### 3. URSACHEN-MAPPING

| Symptom                 | Mögliche Ursache | Diagnose-Befehl         | Lösung               |
| ----------------------- | ---------------- | ----------------------- | -------------------- |
| 500 Error Edge Function | Missing ENV vars | Check Supabase Secrets  | Add required secrets |
| CORS Error              | Missing headers  | Check function CORS     | Add corsHeaders      |
| Auth Error              | Invalid token    | Check auth.users        | Re-authenticate      |
| DB Error                | RLS Policy       | Check policies          | Update RLS rules     |
| Build Error             | TypeScript       | Check tsconfig          | Fix type errors      |
| Import Error            | Missing file     | Check file exists       | Create/import file   |
| JSON Parse Error        | Invalid JSON     | Validate JSON syntax    | Fix JSON structure   |
| Timeout Error           | Slow query       | Check query performance | Optimize query       |

### 4. KRITISCHE PRÜFPUNKTE

#### Edge Functions

```typescript
// Mandatory checks for every edge function
const edgeFunctionHealthCheck = {
  // 1. Environment Variables
  hasSupabaseUrl: !!Deno.env.get("SUPABASE_URL"),
  hasSupabaseKey: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
  hasCustomSecrets: !!Deno.env.get("CUSTOM_API_KEY"),

  // 2. CORS Configuration
  hasCorsHeaders: true,
  hasOptionsHandler: true,

  // 3. Error Handling
  hasTryCatch: true,
  hasErrorLogging: true,
  hasErrorResponse: true,

  // 4. Logging
  hasRequestLogging: true,
  hasResponseLogging: true,
};
```

#### Frontend Components

```typescript
// Component health checks
const componentHealthCheck = {
  // 1. State Management
  hasProperState: true,
  hasErrorBoundary: true,

  // 2. Data Fetching
  hasLoadingState: true,
  hasErrorState: true,
  hasSuccessState: true,

  // 3. User Feedback
  hasToastNotifications: true,
  hasLoadingSpinners: true,

  // 4. Error Recovery
  hasRetryLogic: true,
  hasFallbackUI: true,
};
```

### 5. DEBUGGING COMMANDS

```bash
# Edge Function Logs (Lovable Cloud)
# Access via Lovable Backend UI

# Database Query Test
# Use Supabase SQL Editor

# Local Development
npm run dev

# Build Test
npm run build

# Type Check
npx tsc --noEmit
```

### 6. COMMON ERROR PATTERNS

#### Pattern 1: "Function X is not defined"

**Ursache**: Import fehlt oder falscher Pfad
**Diagnose**:

```bash
grep -r "function X" src/
```

**Lösung**: Import korrigieren

#### Pattern 2: "Cannot read property of undefined"

**Ursache**: Null/Undefined check fehlt
**Diagnose**: Add optional chaining
**Lösung**:

```typescript
// ❌ BAD
const value = data.nested.property;

// ✅ GOOD
const value = data?.nested?.property ?? defaultValue;
```

#### Pattern 3: "CORS policy blocked"

**Ursache**: CORS headers fehlen
**Diagnose**: Check Network Tab
**Lösung**: Add corsHeaders to response

#### Pattern 4: "Invalid JSON"

**Ursache**: Malformed JSON or incorrect escaping
**Diagnose**: Validate JSON with JSON.parse
**Lösung**: Fix JSON structure or use proper escaping

#### Pattern 5: "Entity type undefined in kronos-executor"

**Ursache**: Wrong property passed to child function
**Diagnose**: Check function call parameters
**Lösung**: Pass complete entity object, not entity.entity_type

### 7. ESKALATIONS-PFAD

```
Level 1: Self-Diagnosis (5 min)
└─ Run automated health checks
   └─ FAILED → Level 2

Level 2: Logs Analysis (10 min)
└─ Check all log sources
   └─ FAILED → Level 3

Level 3: Code Review (15 min)
└─ Review recent changes
   └─ FAILED → Level 4

Level 4: Rollback (5 min)
└─ Revert to last working state
   └─ SUCCESS → Root cause analysis
   └─ FAILED → Level 5

Level 5: Deep Dive (30 min)
└─ Systematic component isolation
   └─ SUCCESS → Fix and document
   └─ FAILED → External help
```

### 8. AUTOMATED HEALTH CHECKS

```typescript
// System-wide health check
const runSystemHealthCheck = async () => {
  const checks = {
    environment: await checkEnvironment(),
    database: await checkDatabase(),
    apis: await checkAPIs(),
    authentication: await checkAuth(),
    edgeFunctions: await checkEdgeFunctions(),
    frontend: await checkFrontend(),
  };

  const failed = Object.entries(checks).filter(([_, result]) => !result.healthy);

  if (failed.length > 0) {
    console.error("Health Check Failed:", failed);
    return { healthy: false, failed };
  }

  return { healthy: true, checks };
};
```

### 9. RECOVERY STRATEGIES

#### Strategy 1: Retry with Exponential Backoff

```typescript
const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};
```

#### Strategy 2: Circuit Breaker

```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private state: "closed" | "open" | "half-open" = "closed";

  async execute(fn: () => Promise<any>) {
    if (this.state === "open") {
      if (Date.now() - this.lastFailTime > 30000) {
        this.state = "half-open";
      } else {
        throw new Error("Circuit breaker is open");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = "closed";
  }

  private onFailure() {
    this.failures++;
    this.lastFailTime = Date.now();
    if (this.failures >= 5) {
      this.state = "open";
    }
  }
}
```

#### Strategy 3: Graceful Degradation

```typescript
const gracefulDegradation = async () => {
  try {
    // Try primary service
    return await primaryService();
  } catch (error) {
    console.warn("Primary service failed, using fallback");
    try {
      // Try fallback service
      return await fallbackService();
    } catch (fallbackError) {
      console.error("All services failed, using cached data");
      // Use cached data
      return await getCachedData();
    }
  }
};
```

## VERSION HISTORY

- V1.0 (2025-01-31): Initial Framework
  - Fehlerquellen-Hierarchie
  - Diagnose-Checkliste
  - Ursachen-Mapping
  - Error Recovery Strategies

## TAGS

`fehlersuche` `diagnostics` `debugging` `system-health` `troubleshooting` `error-recovery`
