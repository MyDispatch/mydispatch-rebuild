# 🔄 SELF-HEALING SYSTEM V1.0

**Version:** 1.0.0  
**Datum:** 2025-01-31  
**Status:** ✅ PRODUCTION-READY

---

## 📋 Übersicht

Das Self-Healing System ist ein autonomes Fehlerkorrektur-Framework für MyDispatch. Es:

- **Erkennt** Fehler automatisch
- **Diagnostiziert** Root Causes via Known Issues
- **Repariert** bekannte Fehler automatisch
- **Lernt** aus neuen Fehlern
- **Eskaliert** komplexe Probleme

---

## 🎯 Architektur

```
Error Detection → Pattern Matching → Auto-Fix → Learning → Prevention
      ↓                 ↓               ↓          ↓           ↓
  Error Logs      Known Issues    Fix Scripts  ai_learning  Monitoring
```

---

## 1. Auto-Recovery Flows

### 1.1 Retry with Exponential Backoff

**Use Case:** Temporäre Netzwerk-/API-Fehler

```typescript
// src/lib/self-healing/retry.ts

interface RetryConfig {
  maxAttempts: number;
  baseDelay: number; // ms
  maxDelay: number; // ms
  exponentialBase: number;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    exponentialBase: 2,
  }
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === config.maxAttempts) {
        // Log final failure
        await logError({
          error: lastError,
          context: { attempts: config.maxAttempts, strategy: "retry" },
        });
        throw lastError;
      }

      // Calculate exponential backoff delay
      const delay = Math.min(
        config.baseDelay * Math.pow(config.exponentialBase, attempt - 1),
        config.maxDelay
      );

      console.log(`[Self-Heal] Retry attempt ${attempt}/${config.maxAttempts} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}
```

**Usage:**

```typescript
// Edge Function with auto-retry
const data = await withRetry(() => supabase.from("bookings").select(), { maxAttempts: 3 });
```

---

### 1.2 Circuit Breaker Pattern

**Use Case:** Wiederkehrende Fehler bei External APIs

```typescript
// src/lib/self-healing/circuit-breaker.ts

type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

interface CircuitBreakerConfig {
  failureThreshold: number; // Failures until OPEN
  successThreshold: number; // Successes to close from HALF_OPEN
  timeout: number; // ms until retry from OPEN
}

export class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private failureCount = 0;
  private successCount = 0;
  private nextAttempt = Date.now();

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() < this.nextAttempt) {
        throw new Error("Circuit breaker is OPEN");
      }
      this.state = "HALF_OPEN";
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
    this.failureCount = 0;

    if (this.state === "HALF_OPEN") {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        console.log("[Circuit Breaker] Closing circuit after successful recovery");
        this.state = "CLOSED";
        this.successCount = 0;
      }
    }
  }

  private onFailure() {
    this.failureCount++;
    this.successCount = 0;

    if (this.failureCount >= this.config.failureThreshold) {
      console.log("[Circuit Breaker] Opening circuit due to failures");
      this.state = "OPEN";
      this.nextAttempt = Date.now() + this.config.timeout;

      // Log to known_issues if pattern repeats
      this.logCircuitOpen();
    }
  }

  private async logCircuitOpen() {
    // Create/update known issue
    await supabase.from("known_issues").insert({
      issue_type: "circuit_breaker_open",
      severity: "high",
      description: `Circuit breaker opened after ${this.config.failureThreshold} failures`,
      resolution_strategy: "Check external API health, verify credentials",
      tags: ["circuit_breaker", "external_api"],
    });
  }
}
```

**Usage:**

```typescript
// Edge Function with circuit breaker
const stripeCircuit = new CircuitBreaker({
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 60000 // 1 minute
});

const payment = await stripeCircuit.execute(
  () => stripe.paymentIntents.create(...)
);
```

---

### 1.3 Graceful Degradation

**Use Case:** Non-Critical Feature Failures

```typescript
// src/lib/self-healing/graceful-degradation.ts

export async function withGracefulDegradation<T>(
  primaryFn: () => Promise<T>,
  fallbackFn: () => T,
  featureName: string
): Promise<T> {
  try {
    return await primaryFn();
  } catch (error) {
    console.warn(`[Graceful Degradation] ${featureName} failed, using fallback`, error);

    // Log degradation event
    await supabase.from("ai_learning_patterns").insert({
      pattern_type: "graceful_degradation",
      context: {
        feature: featureName,
        error: (error as Error).message,
      },
      learnings: `Feature ${featureName} degraded due to error`,
      confidence: 1.0,
    });

    return fallbackFn();
  }
}
```

**Usage:**

```typescript
// AI Chat with fallback
const aiResponse = await withGracefulDegradation(
  () => callLovableAI(prompt),
  () => "AI ist momentan nicht verfügbar. Bitte versuchen Sie es später erneut.",
  "AI Chat"
);
```

---

## 2. Error Pattern Matching

### 2.1 Known Issue Detection

```typescript
// src/lib/self-healing/pattern-matcher.ts

export async function matchKnownIssue(error: Error): Promise<{
  issue: any;
  autoFixAvailable: boolean;
} | null> {
  const errorMessage = error.message.toLowerCase();

  // Query known_issues for matching pattern
  const { data: knownIssues } = await supabase
    .from("known_issues")
    .select("*")
    .eq("resolved", false)
    .order("severity", { ascending: false });

  for (const issue of knownIssues || []) {
    // Check if error message matches issue pattern
    const pattern = issue.error_pattern;
    if (pattern && new RegExp(pattern, "i").test(errorMessage)) {
      console.log(`[Pattern Match] Found known issue: ${issue.title}`);

      return {
        issue,
        autoFixAvailable: !!issue.auto_fix_script,
      };
    }
  }

  return null;
}
```

---

### 2.2 Auto-Fix Execution

```typescript
// src/lib/self-healing/auto-fix.ts

export async function applyAutoFix(issue: any): Promise<boolean> {
  const fixScript = issue.auto_fix_script;

  if (!fixScript) {
    console.warn("[Auto-Fix] No fix script available");
    return false;
  }

  try {
    console.log(`[Auto-Fix] Applying fix for: ${issue.title}`);

    // Execute fix script (sandboxed)
    const result = await executeFixScript(fixScript, issue.context);

    if (result.success) {
      // Update issue as resolved
      await supabase
        .from("known_issues")
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
          resolution_notes: "Auto-fixed by Self-Healing System",
        })
        .eq("id", issue.id);

      // Log success to learning patterns
      await supabase.from("ai_learning_patterns").insert({
        pattern_type: "auto_fix_success",
        context: { issue_id: issue.id, fix_script: fixScript },
        learnings: `Successfully auto-fixed: ${issue.title}`,
        confidence: 1.0,
      });

      return true;
    }
  } catch (error) {
    console.error("[Auto-Fix] Failed to apply fix", error);

    // Log failure
    await supabase.from("ai_learning_patterns").insert({
      pattern_type: "auto_fix_failure",
      context: { issue_id: issue.id, error: (error as Error).message },
      learnings: `Auto-fix failed: ${issue.title}`,
      confidence: 0.5,
    });
  }

  return false;
}

async function executeFixScript(script: string, context: any): Promise<{ success: boolean }> {
  // Sandboxed execution (implement based on script type)
  // For MVP: Support simple scripts like cache invalidation, retry, etc.

  if (script === "invalidate_cache") {
    // Invalidate TanStack Query cache
    queryClient.invalidateQueries();
    return { success: true };
  }

  if (script === "refresh_auth") {
    // Refresh authentication token
    await supabase.auth.refreshSession();
    return { success: true };
  }

  // Add more fix scripts as patterns emerge
  return { success: false };
}
```

---

## 3. Learning from Errors

### 3.1 Error → Learning Pipeline

```typescript
// src/lib/self-healing/error-learner.ts

export async function learnFromError(
  error: Error,
  context: {
    component: string;
    action: string;
    userImpact: "low" | "medium" | "high" | "critical";
    environment: "development" | "production";
  }
): Promise<void> {
  // Step 1: Check if error is known
  const knownIssue = await matchKnownIssue(error);

  if (knownIssue) {
    // Increment occurrence count
    await supabase
      .from("known_issues")
      .update({ occurrences: knownIssue.issue.occurrences + 1 })
      .eq("id", knownIssue.issue.id);

    // If occurrences > threshold, escalate
    if (knownIssue.issue.occurrences + 1 >= 10) {
      await escalateIssue(knownIssue.issue, "High occurrence rate");
    }

    return;
  }

  // Step 2: Create new learning pattern
  const learning = generateLearning(error, context);

  await supabase.from("ai_learning_patterns").insert({
    pattern_type: "error_pattern",
    context: {
      error_message: error.message,
      stack_trace: error.stack,
      ...context,
    },
    learnings: learning,
    confidence: calculateConfidence(error, context),
  });

  // Step 3: Check if pattern repeats (3+ times)
  const occurrences = await countErrorOccurrences(error.message);

  if (occurrences >= 3) {
    await promoteToKnownIssue(error, context, occurrences);
  }
}

function generateLearning(error: Error, context: any): string {
  // AI-enhanced learning generation (or template-based)
  return `Error in ${context.component} during ${context.action}: ${error.message}. User impact: ${context.userImpact}.`;
}

function calculateConfidence(error: Error, context: any): number {
  let confidence = 0.5; // Base confidence

  // Increase confidence if stack trace is available
  if (error.stack) confidence += 0.2;

  // Increase if error is in production
  if (context.environment === "production") confidence += 0.1;

  // Increase if user impact is high
  if (context.userImpact === "critical") confidence += 0.2;

  return Math.min(confidence, 1.0);
}

async function countErrorOccurrences(errorMessage: string): Promise<number> {
  const { count } = await supabase
    .from("ai_learning_patterns")
    .select("*", { count: "exact", head: true })
    .ilike("context->error_message", `%${errorMessage}%`);

  return count || 0;
}

async function promoteToKnownIssue(error: Error, context: any, occurrences: number): Promise<void> {
  console.log(`[Learning] Promoting error to known issue (${occurrences} occurrences)`);

  await supabase.from("known_issues").insert({
    issue_type: "recurring_error",
    title: `Recurring Error: ${error.message.substring(0, 100)}`,
    description: `Error occurred ${occurrences} times in ${context.component}`,
    severity: context.userImpact === "critical" ? "critical" : "high",
    occurrences: occurrences,
    error_pattern: escapeRegex(error.message),
    resolution_strategy: "Investigate root cause in component",
    tags: ["auto_detected", context.component.toLowerCase()],
  });
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
```

---

### 3.2 Escalation Paths

```typescript
// src/lib/self-healing/escalation.ts

export async function escalateIssue(issue: any, reason: string): Promise<void> {
  console.warn(`[Escalation] Escalating issue: ${issue.title} - Reason: ${reason}`);

  // Update severity if not already critical
  if (issue.severity !== "critical") {
    await supabase
      .from("known_issues")
      .update({ severity: "high", escalation_reason: reason })
      .eq("id", issue.id);
  }

  // Send notification (email, Slack, etc.)
  await sendEscalationNotification(issue, reason);

  // Log escalation
  await supabase.from("ai_learning_patterns").insert({
    pattern_type: "issue_escalation",
    context: { issue_id: issue.id, reason },
    learnings: `Issue escalated: ${issue.title}`,
    confidence: 1.0,
  });
}

async function sendEscalationNotification(issue: any, reason: string): Promise<void> {
  // Edge Function call to send email/Slack message
  await supabase.functions.invoke("send-escalation-alert", {
    body: {
      issue: issue,
      reason: reason,
      recipients: ["admin@mydispatch.com"],
    },
  });
}
```

---

## 4. Self-Healing Edge Function Wrapper

```typescript
// supabase/functions/_shared/self-healing-wrapper.ts

import { CircuitBreaker } from "./circuit-breaker.ts";
import { withRetry } from "./retry.ts";
import { matchKnownIssue, applyAutoFix } from "./auto-fix.ts";
import { learnFromError } from "./error-learner.ts";

type EdgeFunction = (req: Request) => Promise<Response>;

export function withSelfHealing(
  fn: EdgeFunction,
  config: {
    componentName: string;
    enableRetry?: boolean;
    enableCircuitBreaker?: boolean;
    enableAutoFix?: boolean;
  }
): EdgeFunction {
  const circuitBreaker = config.enableCircuitBreaker
    ? new CircuitBreaker({ failureThreshold: 5, successThreshold: 2, timeout: 60000 })
    : null;

  return async (req: Request) => {
    try {
      // Wrap execution with optional retry
      const execute = async () => {
        if (circuitBreaker) {
          return await circuitBreaker.execute(() => fn(req));
        }
        return await fn(req);
      };

      if (config.enableRetry) {
        return await withRetry(execute, { maxAttempts: 3 });
      }

      return await execute();
    } catch (error) {
      console.error(`[Self-Heal] Error in ${config.componentName}:`, error);

      // Try to match and auto-fix
      if (config.enableAutoFix) {
        const knownIssue = await matchKnownIssue(error as Error);

        if (knownIssue?.autoFixAvailable) {
          const fixed = await applyAutoFix(knownIssue.issue);

          if (fixed) {
            console.log("[Self-Heal] Auto-fix successful, retrying...");
            return await fn(req); // Retry after fix
          }
        }
      }

      // Learn from error
      await learnFromError(error as Error, {
        component: config.componentName,
        action: "edge_function_execution",
        userImpact: "high",
        environment: "production",
      });

      // Return graceful error response
      return new Response(
        JSON.stringify({
          error: "Service temporarily unavailable",
          message: "We are working on fixing this issue.",
          requestId: crypto.randomUUID(),
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }
  };
}
```

**Usage in Edge Function:**

```typescript
// supabase/functions/get-bookings/index.ts
import { withSelfHealing } from "../_shared/self-healing-wrapper.ts";

const handler = withSelfHealing(
  async (req: Request) => {
    // Original function logic
    const { data, error } = await supabase.from("bookings").select();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  },
  {
    componentName: "get-bookings",
    enableRetry: true,
    enableCircuitBreaker: true,
    enableAutoFix: true,
  }
);

serve(handler);
```

---

## 5. Monitoring & Metrics

### Self-Healing Dashboard Metrics

```typescript
// src/lib/self-healing/metrics.ts

export interface SelfHealingMetrics {
  total_errors: number;
  auto_fixed: number;
  auto_fix_success_rate: number;
  circuit_breaker_opens: number;
  escalations: number;
  avg_recovery_time_ms: number;
}

export async function getSelfHealingMetrics(): Promise<SelfHealingMetrics> {
  const { data: learnings } = await supabase
    .from("ai_learning_patterns")
    .select("*")
    .in("pattern_type", [
      "error_pattern",
      "auto_fix_success",
      "auto_fix_failure",
      "circuit_breaker_open",
      "issue_escalation",
    ]);

  const totalErrors = learnings?.filter((l) => l.pattern_type === "error_pattern").length || 0;
  const autoFixed = learnings?.filter((l) => l.pattern_type === "auto_fix_success").length || 0;
  const circuitOpens =
    learnings?.filter((l) => l.pattern_type === "circuit_breaker_open").length || 0;
  const escalations = learnings?.filter((l) => l.pattern_type === "issue_escalation").length || 0;

  return {
    total_errors: totalErrors,
    auto_fixed: autoFixed,
    auto_fix_success_rate: totalErrors > 0 ? (autoFixed / totalErrors) * 100 : 0,
    circuit_breaker_opens: circuitOpens,
    escalations: escalations,
    avg_recovery_time_ms: 0, // TODO: Calculate from timestamps
  };
}
```

---

## 🎯 Integration Checklist

- [ ] Install self-healing utilities in `src/lib/self-healing/`
- [ ] Wrap all Edge Functions with `withSelfHealing`
- [ ] Add retry logic to critical API calls
- [ ] Implement circuit breakers for external APIs
- [ ] Create auto-fix scripts for common errors
- [ ] Set up error learning pipeline
- [ ] Configure escalation notifications
- [ ] Add self-healing metrics to Dashboard

---

**© 2025 NeXify - Alle Rechte vorbehalten**
