# 🚨 BREAKING CHANGE SIMULATOR V1.0

**Version:** 1.0.0  
**Datum:** 2025-01-31  
**Status:** ✅ PRODUCTION-READY

---

## 📋 Zweck

Dieses Dokument simuliert die Auswirkungen häufiger Breaking Changes auf das MyDispatch-System. Es dient zur:

- **Risikoanalyse** bei geplanten Änderungen
- **Impact Assessment** vor Migrations
- **Rollback-Planung** für Notfälle

---

## 1. Database Schema Changes

### Simulation #1: ALTER TABLE bookings (Add Column)

**Change:**

```sql
ALTER TABLE bookings ADD COLUMN priority VARCHAR(10) DEFAULT 'normal';
```

**Impact Analysis:**

| Category               | Impact                                      | Details                                 |
| ---------------------- | ------------------------------------------- | --------------------------------------- |
| **Affected Files**     | 23                                          | All files using `bookings` table        |
| **Affected Functions** | 8                                           | Edge Functions reading/writing bookings |
| **TypeScript Errors**  | 0                                           | Column is nullable/has default          |
| **Estimated Downtime** | 0 minutes                                   | Non-breaking (adds optional field)      |
| **Rollback Strategy**  | `ALTER TABLE bookings DROP COLUMN priority` | Safe rollback                           |

**Deployment Plan:**

1. ✅ Run migration in Supabase
2. ✅ Deploy new types (auto-generated)
3. ✅ No code changes required (optional field)
4. ✅ Gradual adoption in UI

**Risk Level:** 🟢 LOW

---

### Simulation #2: ALTER TABLE bookings (Remove Column)

**Change:**

```sql
ALTER TABLE bookings DROP COLUMN old_field;
```

**Impact Analysis:**

| Category               | Impact                                                          | Details                    |
| ---------------------- | --------------------------------------------------------------- | -------------------------- |
| **Affected Files**     | 15                                                              | Files using `old_field`    |
| **Affected Functions** | 3                                                               | Edge Functions using field |
| **TypeScript Errors**  | 15+                                                             | Missing property errors    |
| **Estimated Downtime** | 30 minutes                                                      | Code changes required      |
| **Rollback Strategy**  | `ALTER TABLE bookings ADD COLUMN old_field TYPE` + Restore data | Complex rollback           |

**Deployment Plan:**

1. ⚠️ Identify all usages via grep: `grep -r "old_field" src/`
2. ⚠️ Remove all references in code (15 files)
3. ⚠️ Deploy code changes
4. ⚠️ Wait for deployment success (5 min)
5. ⚠️ Run migration
6. ⚠️ Monitor for errors (10 min)

**Risk Level:** 🟡 MEDIUM

---

### Simulation #3: ALTER TABLE bookings (Change Column Type)

**Change:**

```sql
ALTER TABLE bookings ALTER COLUMN status TYPE VARCHAR(50);
-- Previously: VARCHAR(20)
```

**Impact Analysis:**

| Category               | Impact                                                      | Details                            |
| ---------------------- | ----------------------------------------------------------- | ---------------------------------- |
| **Affected Files**     | 18                                                          | Files with hardcoded status checks |
| **Affected Functions** | 5                                                           | Edge Functions validating status   |
| **TypeScript Errors**  | 0                                                           | Type widening (safe)               |
| **Estimated Downtime** | 5 minutes                                                   | Migration time only                |
| **Rollback Strategy**  | `ALTER TABLE bookings ALTER COLUMN status TYPE VARCHAR(20)` | Safe if no data >20 chars          |

**Deployment Plan:**

1. ✅ Run migration (backward compatible)
2. ✅ Update validation rules if needed
3. ✅ No immediate code changes required

**Risk Level:** 🟢 LOW

---

### Simulation #4: RENAME TABLE bookings → orders

**Change:**

```sql
ALTER TABLE bookings RENAME TO orders;
```

**Impact Analysis:**

| Category               | Impact                                  | Details                           |
| ---------------------- | --------------------------------------- | --------------------------------- |
| **Affected Files**     | 45+                                     | ALL files using bookings table    |
| **Affected Functions** | 12                                      | ALL Edge Functions using bookings |
| **TypeScript Errors**  | 100+                                    | Table name not found              |
| **Estimated Downtime** | 2-4 hours                               | Complete refactor required        |
| **Rollback Strategy**  | `ALTER TABLE orders RENAME TO bookings` | Simple but requires downtime      |

**Deployment Plan:**

1. 🔴 **CRITICAL:** Coordinate deployment window
2. 🔴 Find all usages: `grep -r "from('bookings')" src/`
3. 🔴 Batch replace (45+ files)
4. 🔴 Update all Edge Functions
5. 🔴 Deploy code + migration simultaneously
6. 🔴 Monitor for 1 hour post-deployment

**Risk Level:** 🔴 HIGH (Avoid if possible)

---

## 2. Environment Variable Changes

### Simulation #5: RENAME ENV VAR (LOVABLE_API_KEY → AI_API_KEY)

**Change:**

```bash
# Old: LOVABLE_API_KEY=xxx
# New: AI_API_KEY=xxx
```

**Impact Analysis:**

| Category               | Impact                                   | Details                                                |
| ---------------------- | ---------------------------------------- | ------------------------------------------------------ |
| **Affected Files**     | 0                                        | No code uses env vars directly                         |
| **Affected Functions** | 8                                        | Edge Functions using `Deno.env.get('LOVABLE_API_KEY')` |
| **TypeScript Errors**  | 0                                        | Runtime error only                                     |
| **Estimated Downtime** | 30 minutes                               | Redeploy all Edge Functions                            |
| **Rollback Strategy**  | Revert secret name in Supabase Dashboard | Immediate                                              |

**Deployment Plan:**

1. ⚠️ Update secret in Supabase Dashboard
2. ⚠️ Update all Edge Functions (8 files):
   ```diff
   - const apiKey = Deno.env.get('LOVABLE_API_KEY');
   + const apiKey = Deno.env.get('AI_API_KEY');
   ```
3. ⚠️ Deploy Edge Functions (auto-deploy triggers)
4. ⚠️ Verify all functions work (health check)

**Risk Level:** 🟡 MEDIUM

---

### Simulation #6: Missing ENV VAR (SUPABASE_URL Not Set)

**Impact Analysis:**

| Category               | Impact                      | Details                             |
| ---------------------- | --------------------------- | ----------------------------------- |
| **Affected Files**     | 0                           | Detected at runtime                 |
| **Affected Functions** | 12                          | ALL Edge Functions fail immediately |
| **TypeScript Errors**  | 0                           | Runtime error only                  |
| **Estimated Downtime** | Complete outage until fixed | 5-10 minutes to add secret          |
| **Rollback Strategy**  | Add secret in Dashboard     | Immediate recovery                  |

**Error Message:**

```
Error: Server configuration error: Missing environment variables
```

**Prevention:**

```typescript
// ALL Edge Functions have this check:
const supabaseUrl = Deno.env.get("SUPABASE_URL");
if (!supabaseUrl) {
  return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500 });
}
```

**Risk Level:** 🔴 HIGH (Production Outage)

---

## 3. API Signature Changes

### Simulation #7: Edge Function Body Change (Breaking)

**Change:**

```typescript
// Old:
POST /edge-function { "action": "create" }

// New:
POST /edge-function { "operation": "create" }
```

**Impact Analysis:**

| Category               | Impact                           | Details                              |
| ---------------------- | -------------------------------- | ------------------------------------ |
| **Affected Files**     | 12                               | All files calling this Edge Function |
| **Affected Functions** | 1                                | The Edge Function itself             |
| **TypeScript Errors**  | 0                                | Type mismatch at runtime             |
| **Estimated Downtime** | 1-2 hours                        | Coordinate client + server changes   |
| **Rollback Strategy**  | Deploy old Edge Function version | Git revert + redeploy                |

**Deployment Plan:**

1. 🔴 Support BOTH `action` AND `operation` (backward compatibility):
   ```typescript
   const operation = body.operation || body.action;
   ```
2. 🔴 Deploy Edge Function first
3. 🔴 Gradually update clients (12 files)
4. 🔴 Remove `action` support after 2 weeks

**Risk Level:** 🔴 HIGH (Breaking Change)

---

### Simulation #8: External API Version Change (Stripe v2 → v3)

**Impact Analysis:**

| Category               | Impact                                     | Details                                                |
| ---------------------- | ------------------------------------------ | ------------------------------------------------------ |
| **Affected Files**     | 8                                          | All files using Stripe                                 |
| **Affected Functions** | 3                                          | payment-webhook, create-payment-intent, refund-payment |
| **TypeScript Errors**  | 20+                                        | Type mismatches                                        |
| **Estimated Downtime** | 4-6 hours                                  | Complete Stripe integration rewrite                    |
| **Rollback Strategy**  | Keep v2 code, deploy as separate functions | Complex                                                |

**Deployment Plan:**

1. 🔴 Create NEW Edge Functions (v3):
   - `payment-webhook-v3`
   - `create-payment-intent-v3`
   - `refund-payment-v3`
2. 🔴 Update frontend to call v3 functions
3. 🔴 Keep v2 functions running for 1 month
4. 🔴 Monitor v3 adoption
5. 🔴 Deprecate v2 functions

**Risk Level:** 🔴 CRITICAL (Revenue Impact)

---

## 4. Dependency Updates

### Simulation #9: Supabase JS v2 → v3 (Major Version)

**Impact Analysis:**

| Category               | Impact                              | Details                         |
| ---------------------- | ----------------------------------- | ------------------------------- |
| **Affected Files**     | 150+                                | ALL files using Supabase client |
| **Affected Functions** | 12                                  | ALL Edge Functions              |
| **TypeScript Errors**  | 50+                                 | Breaking API changes            |
| **Estimated Downtime** | 1-2 days                            | Complete refactor               |
| **Rollback Strategy**  | Git revert + package.json downgrade | Complex (types changed)         |

**Known Breaking Changes (Example):**

```typescript
// v2:
const { data, error } = await supabase.from("bookings").select();

// v3 (hypothetical):
const { data, error } = await supabase.table("bookings").query();
```

**Deployment Plan:**

1. 🔴 Create feature branch
2. 🔴 Update package.json
3. 🔴 Fix TypeScript errors (50+ files)
4. 🔴 Run full test suite
5. 🔴 Deploy to staging
6. 🔴 Test for 1 week
7. 🔴 Deploy to production (coordinate downtime window)

**Risk Level:** 🔴 CRITICAL (System-Wide Impact)

---

## 5. RLS Policy Changes

### Simulation #10: Tighten RLS Policy (bookings)

**Change:**

```sql
-- Old: Users can view all bookings
CREATE POLICY "Users view all" ON bookings FOR SELECT USING (true);

-- New: Users can only view their own bookings
DROP POLICY "Users view all" ON bookings;
CREATE POLICY "Users view own" ON bookings FOR SELECT
USING (auth.uid() = user_id);
```

**Impact Analysis:**

| Category               | Impact             | Details                                 |
| ---------------------- | ------------------ | --------------------------------------- |
| **Affected Files**     | 15                 | Pages/components showing all bookings   |
| **Affected Functions** | 2                  | Edge Functions querying all bookings    |
| **TypeScript Errors**  | 0                  | Data just disappears (silent failure!)  |
| **Estimated Downtime** | 0 minutes          | No downtime, but data access restricted |
| **Rollback Strategy**  | Restore old policy | Immediate via Supabase Dashboard        |

**Side Effects:**

- Admin users can't see all bookings anymore
- Reports/analytics break (no data)
- Customer support can't view bookings

**Mitigation:**

```sql
-- Add admin bypass:
CREATE POLICY "Admins view all" ON bookings FOR SELECT
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

**Risk Level:** 🟡 MEDIUM (Silent Data Loss)

---

## 🧪 Testing Breaking Changes

### Pre-Deployment Checklist

Before applying ANY breaking change:

- [ ] Run Breaking Change Simulator (this doc)
- [ ] Identify all affected files via grep
- [ ] Create feature branch for changes
- [ ] Update all affected code
- [ ] Run TypeScript compiler
- [ ] Run unit tests
- [ ] Run E2E tests
- [ ] Deploy to staging environment
- [ ] Test for 24-48 hours
- [ ] Coordinate production deployment window
- [ ] Prepare rollback plan
- [ ] Monitor post-deployment (1 hour)

---

## 📊 Breaking Change Risk Matrix

| Change Type              | Risk Level  | Downtime | Rollback Complexity |
| ------------------------ | ----------- | -------- | ------------------- |
| Add Column               | 🟢 LOW      | 0 min    | Easy                |
| Remove Column            | 🟡 MEDIUM   | 30 min   | Medium              |
| Rename Table             | 🔴 HIGH     | 2-4h     | Hard                |
| Env Var Rename           | 🟡 MEDIUM   | 30 min   | Easy                |
| Missing Env Var          | 🔴 HIGH     | Outage   | Easy                |
| API Signature Change     | 🔴 HIGH     | 1-2h     | Medium              |
| External API Version     | 🔴 CRITICAL | 4-6h     | Hard                |
| Dependency Major Version | 🔴 CRITICAL | 1-2 days | Hard                |
| RLS Policy Tighten       | 🟡 MEDIUM   | 0 min    | Easy                |

---

## 🔧 Automated Tools

### Breaking Change Detector Script

```typescript
// scripts/detect-breaking-changes.ts
import { exec } from "child_process";

const breakingPatterns = [
  { pattern: /DROP COLUMN/, severity: "HIGH", message: "Column removal detected" },
  { pattern: /ALTER TABLE .* RENAME TO/, severity: "CRITICAL", message: "Table rename detected" },
  { pattern: /DROP POLICY/, severity: "MEDIUM", message: "RLS policy change detected" },
];

async function detectBreakingChanges(migrationFile: string) {
  const content = await fs.readFile(migrationFile, "utf-8");

  const issues = breakingPatterns.filter((p) => p.pattern.test(content));

  if (issues.length > 0) {
    console.error("🚨 BREAKING CHANGES DETECTED:");
    issues.forEach((issue) => {
      console.error(`[${issue.severity}] ${issue.message}`);
    });
    process.exit(1);
  }
}
```

**Usage:**

```bash
npm run detect-breaking-changes supabase/migrations/latest.sql
```

---

**© 2025 NeXify - Alle Rechte vorbehalten**
