# Security Best Practices

## Authentication & Authorization

### 1. Supabase RLS (Row Level Security)

**EVERY table MUST have RLS enabled:**

```sql
-- ✅ MANDATORY for all tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- ✅ Basic company isolation policy
CREATE POLICY "Users can only access own company data"
ON bookings FOR ALL
USING (company_id = (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

-- ✅ Read-only for specific roles
CREATE POLICY "Drivers can view assigned bookings"
ON bookings FOR SELECT
USING (
  driver_id = auth.uid()
  AND status IN ('assigned', 'in_progress')
);
```

### 2. API Key Management

**NEVER expose secret keys in frontend:**

```typescript
// ❌ FORBIDDEN: Service role key in frontend
const supabase = createClient(url, SERVICE_ROLE_KEY); // ⛔ SECURITY VIOLATION

// ✅ CORRECT: Use publishable key (RLS-protected)
import { supabase } from "@/integrations/supabase/client";

// ✅ CORRECT: Fetch API keys via Edge Function
const { data } = await supabase.functions.invoke("get-api-key", {
  body: { service: "here_maps" },
});
```

**Environment Variables:**

```bash
# .env.local (NEVER commit!)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGc... # ✅ Safe to expose

# Supabase Edge Function Secrets (Dashboard only)
SERVICE_ROLE_KEY=eyJhbGc... # ⛔ NEVER in frontend
HERE_API_KEY=xxx # ⛔ NEVER in frontend
RESEND_API_KEY=xxx # ⛔ NEVER in frontend
```

### 3. Input Validation

**Always validate on backend AND frontend:**

```typescript
// Frontend validation (Zod)
import { z } from "zod";

const bookingSchema = z.object({
  customer_name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/),
  pickup_date: z.date().min(new Date()),
});

// Backend validation (Edge Function)
const { data, error } = bookingSchema.safeParse(requestBody);
if (error) {
  return new Response(JSON.stringify({ error: "Invalid input" }), {
    status: 400,
  });
}
```

### 4. SQL Injection Prevention

**ALWAYS use parameterized queries:**

```typescript
// ❌ DANGEROUS: String concatenation
const { data } = await supabase
  .from("bookings")
  .select("*")
  .filter("customer_name", "eq", userInput); // If userInput contains SQL

// ✅ SAFE: Supabase client handles parameterization
const { data } = await supabase.from("bookings").select("*").eq("customer_name", userInput); // Automatically escaped

// ✅ SAFE: RPC with parameters
const { data } = await supabase.rpc("search_bookings", {
  search_term: userInput,
});
```

## Content Security

### 1. XSS Prevention

**Sanitize HTML content:**

```typescript
import DOMPurify from 'dompurify';

// ❌ DANGEROUS: Direct HTML injection
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ SAFE: Sanitize before rendering
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />

// ✅ BEST: Avoid innerHTML entirely
<div>{userContent}</div> // React auto-escapes
```

### 2. CORS Configuration

**Edge Function CORS pattern:**

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.my-dispatch.de",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Your logic here
  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
```

### 3. Rate Limiting

**Prevent abuse:**

```typescript
// Edge Function rate limiting
import { rateLimit } from "@/lib/rate-limit";

Deno.serve(async (req) => {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  const { allowed, remaining } = await rateLimit(ip, {
    limit: 100, // 100 requests
    window: 60000, // per minute
  });

  if (!allowed) {
    return new Response("Rate limit exceeded", { status: 429 });
  }

  // Process request
  return new Response(JSON.stringify({ remaining }));
});
```

## Data Protection

### 1. Encryption at Rest

**Sensitive data encryption:**

```typescript
// Use Supabase Vault for secrets
const { data } = await supabase
  .from("vault")
  .select("decrypted_secret")
  .eq("name", "api_key")
  .single();

// Or encrypt manually
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

function encrypt(text: string, key: Buffer): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}
```

### 2. PII (Personal Identifiable Information)

**Minimize exposure:**

```typescript
// ❌ BAD: Log sensitive data
console.log("User data:", { email, password, ssn });

// ✅ GOOD: Redact sensitive fields
console.log("User data:", {
  email: email.replace(/(?<=.{2}).(?=.*@)/g, "*"),
  user_id: userId,
});

// ✅ GOOD: Use error tracking without PII
Sentry.captureException(error, {
  tags: { user_id: userId },
  // ❌ Don't include: email, phone, address
});
```

### 3. Secure File Uploads

**Validate file types and size:**

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

async function handleFileUpload(file: File) {
  // Validate size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large");
  }

  // Validate type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type");
  }

  // Generate secure filename
  const ext = file.name.split(".").pop();
  const filename = `${crypto.randomUUID()}.${ext}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage.from("documents").upload(filename, file, {
    cacheControl: "3600",
    upsert: false,
  });

  return data?.path;
}
```

## Session Security

### 1. Session Management

**Supabase auth best practices:**

```typescript
// ✅ Refresh tokens automatically
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "TOKEN_REFRESHED") {
    console.log("Token refreshed");
  }
  if (event === "SIGNED_OUT") {
    // Clear local state
    localStorage.clear();
  }
});

// ✅ Set session timeout
const SESSION_TIMEOUT = 24 * 60 * 60; // 24 hours

await supabase.auth.signInWithPassword({
  email,
  password,
  options: {
    expiresIn: SESSION_TIMEOUT,
  },
});
```

### 2. CSRF Protection

**Supabase handles CSRF automatically, but for custom endpoints:**

```typescript
// Generate CSRF token
const csrfToken = crypto.randomUUID();
sessionStorage.setItem("csrf_token", csrfToken);

// Send with request
const response = await fetch("/api/endpoint", {
  method: "POST",
  headers: {
    "X-CSRF-Token": csrfToken,
  },
  body: JSON.stringify(data),
});
```

## Monitoring & Logging

### 1. Security Logging

**Log security-relevant events:**

```typescript
async function logSecurityEvent(event: {
  type: "login" | "logout" | "access_denied" | "suspicious_activity";
  user_id?: string;
  ip_address: string;
  details: string;
}) {
  await supabase.from("security_logs").insert({
    ...event,
    timestamp: new Date().toISOString(),
  });
}

// Usage
await logSecurityEvent({
  type: "access_denied",
  user_id: user.id,
  ip_address: req.headers.get("x-forwarded-for"),
  details: "Attempted to access unauthorized resource",
});
```

### 2. Error Handling

**Don't expose internal errors:**

```typescript
// ❌ BAD: Exposes internal details
catch (error) {
  return res.status(500).json({
    error: error.message, // "Database connection failed at 192.168.1.1"
    stack: error.stack,
  });
}

// ✅ GOOD: Generic message to user, detailed log internally
catch (error) {
  console.error('[ERROR]', error);
  await logError(error);

  return res.status(500).json({
    error: 'An error occurred. Please try again later.',
    errorId: generateErrorId(), // For support reference
  });
}
```

## Compliance

### 1. GDPR Compliance

**Data deletion:**

```sql
-- Soft delete for audit trail
UPDATE customers
SET deleted_at = NOW(),
    email = 'deleted@example.com',
    phone = NULL,
    address = NULL
WHERE id = $1;

-- Hard delete after retention period
DELETE FROM customers
WHERE deleted_at < NOW() - INTERVAL '30 days';
```

### 2. Cookie Consent

**V28CookieConsent component already implemented:**

```typescript
import { V28CookieConsent } from '@/components/shared/V28CookieConsent';

function App() {
  return (
    <>
      <Router />
      <V28CookieConsent />
    </>
  );
}
```

## Security Checklist

- [ ] All tables have RLS enabled
- [ ] No service role keys in frontend
- [ ] Input validation on frontend + backend
- [ ] Parameterized SQL queries only
- [ ] HTML sanitization (DOMPurify)
- [ ] CORS properly configured
- [ ] Rate limiting on Edge Functions
- [ ] Sensitive data encrypted
- [ ] PII redacted in logs
- [ ] File uploads validated (type, size)
- [ ] Session timeout configured
- [ ] CSRF tokens for custom endpoints
- [ ] Security events logged
- [ ] Error messages don't expose internals
- [ ] GDPR data deletion implemented
- [ ] Cookie consent banner active
- [ ] Security headers in vercel.json
- [ ] Dependencies audited (`npm audit`)
- [ ] API keys rotated regularly
- [ ] Backup & disaster recovery plan

## Incident Response

**If security breach detected:**

1. **Immediate:** Rotate ALL API keys
2. **Alert:** Email courbois1981@gmail.com
3. **Investigate:** Check `security_logs` table
4. **Patch:** Fix vulnerability
5. **Notify:** Inform affected users (GDPR)
6. **Document:** Post-mortem in `docs/security/`

**Emergency contacts:**

- Primary: courbois1981@gmail.com
- Supabase Support: https://supabase.com/support
- Security: security@my-dispatch.de

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [React Security](https://react.dev/learn/keeping-components-pure)
- [GDPR Compliance](https://gdpr.eu/)
