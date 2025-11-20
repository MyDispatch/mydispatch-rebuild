# 🔐 Security Guidelines

> **Security Best Practices für MyDispatch**  
> **Version:** 18.5.0  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 Security-First Prinzip

**Jede Funktion MUSS sicher sein, bevor sie deployed wird.**

---

## 🗄️ Database Security

### RLS (Row Level Security) - PFLICHT!

```sql
-- ✅ RICHTIG - RLS IMMER aktivieren
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own company bookings"
ON bookings FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

-- ❌ FALSCH - Offene Tabelle
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY; -- NIEMALS!
```

### Security Definer Functions

```sql
-- ✅ RICHTIG - search_path explizit setzen
CREATE OR REPLACE FUNCTION get_stats(target_company_id UUID)
RETURNS TABLE(...)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog  -- KRITISCH!
AS $$
BEGIN
  -- Authorization Check
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND company_id = target_company_id
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  -- Safe query
  RETURN QUERY SELECT ...;
END;
$$;
```

### SQL Injection Prevention

```tsx
// ✅ RICHTIG - Prepared Statements (auto)
const { data } = await supabase
  .from('bookings')
  .select('*')
  .eq('customer_id', customerId); // Safe!

// ❌ FALSCH - String Concatenation
const query = `SELECT * FROM bookings WHERE customer_id = '${customerId}'`;
// SQL Injection möglich!
```

---

## 🔑 Authentication & Authorization

### Role-Based Access Control (RBAC)

```sql
-- Separate user_roles table (PFLICHT!)
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id),
  role app_role NOT NULL,
  PRIMARY KEY (user_id, role)
);

-- Security Definer Function
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policy
CREATE POLICY "Admins can delete"
ON bookings FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
```

### Session Management

```tsx
// ✅ RICHTIG - Server-side session validation
const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  navigate('/auth');
  return;
}

// ❌ FALSCH - Client-side role check
const userRole = localStorage.getItem('role'); // Manipulierbar!
if (userRole === 'admin') {
  showAdminPanel(); // SECURITY BREACH!
}
```

---

## 🛡️ Input Validation

### Zod Schema Validation

```tsx
import { z } from 'zod';

// ✅ RICHTIG - Comprehensive validation
const bookingSchema = z.object({
  pickup_address: z.string().min(5).max(500),
  dropoff_address: z.string().min(5).max(500),
  pickup_time: z.date().min(new Date()),
  passengers: z.number().int().min(1).max(8),
  luggage: z.number().int().min(0).max(8),
  special_requests: z.string().max(1000).optional()
});

// Validate before submitting
const result = bookingSchema.safeParse(formData);
if (!result.success) {
  toast.error('Invalid input');
  return;
}
```

### Server-side Validation (Trigger)

```sql
-- ✅ RICHTIG - DB-Level validation
CREATE OR REPLACE FUNCTION validate_booking_input()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.passengers < 1 OR NEW.passengers > 8 THEN
    RAISE EXCEPTION 'Passengers must be 1-8';
  END IF;
  
  IF LENGTH(NEW.pickup_address) > 500 THEN
    RAISE EXCEPTION 'Address too long (DoS prevention)';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER validate_booking
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION validate_booking_input();
```

---

## 🔒 XSS Prevention

### DOMPurify für User-Generated Content

```tsx
import DOMPurify from 'dompurify';

// ✅ RICHTIG - Sanitize before rendering
const sanitized = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
  ALLOWED_ATTR: []
});

<div dangerouslySetInnerHTML={{ __html: sanitized }} />

// ❌ FALSCH - Direct HTML injection
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // XSS!
```

---

## 🔐 Secrets Management

### Environment Variables

```tsx
// ✅ RICHTIG - Environment variables
const apiKey = import.meta.env.VITE_API_KEY;

// ❌ FALSCH - Hardcoded secrets
const apiKey = 'sk_live_12345'; // NIEMALS committen!
```

### Supabase Secrets (Edge Functions)

```typescript
// ✅ RICHTIG - Supabase secrets
const apiKey = Deno.env.get('GOOGLE_API_KEY');

if (!apiKey) {
  throw new Error('Missing API key');
}
```

---

## 🌐 CORS & CSP

### Content Security Policy

```html
<!-- public/index.html -->
<meta 
  http-security-policy
  content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://js.api.here.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://*.supabase.co;
  "
/>
```

---

## 📊 Security Monitoring

### Supabase Security Linter

```bash
# Automatischer Security-Check
supabase test db

# Output: Liste aller Security-Warnungen
# - Tabellen ohne RLS
# - Fehlende Policies
# - Unsichere Functions
```

### Error Logging (OHNE sensitive Daten)

```tsx
// ✅ RICHTIG - Sanitized error logging
logError('Booking failed', {
  booking_id: bookingId,
  user_id: userId,
  // KEINE sensitive Daten!
});

// ❌ FALSCH - Sensitive Daten im Log
logError('Booking failed', {
  credit_card: formData.creditCard, // NIEMALS!
  password: formData.password        // NIEMALS!
});
```

---

## 🔄 Rate Limiting

### Edge Function Rate Limiting

```typescript
// Edge Function: rate-limiting.ts
const RATE_LIMIT = 100; // Requests per minute
const rateLimitCache = new Map<string, number>();

export async function checkRateLimit(userId: string) {
  const count = rateLimitCache.get(userId) || 0;
  
  if (count >= RATE_LIMIT) {
    throw new Error('Rate limit exceeded');
  }
  
  rateLimitCache.set(userId, count + 1);
  
  // Reset nach 1 Minute
  setTimeout(() => rateLimitCache.delete(userId), 60000);
}
```

---

## 🚨 Incident Response

### Security-Vorfall-Prozess

1. **Erkennung**: Automatische Alerts (Supabase Monitoring)
2. **Isolierung**: Betroffene Accounts sperren
3. **Analyse**: Log-Analyse, Ursache finden
4. **Behebung**: Patch deployen
5. **Kommunikation**: Betroffene informieren (DSGVO-Pflicht!)
6. **Post-Mortem**: Lessons Learned dokumentieren

### Meldepflicht (DSGVO Art. 33)

**Bei Datenpanne:**
- Meldung an Datenschutzbehörde innerhalb 72h
- Betroffene informieren (wenn hohes Risiko)
- Dokumentation des Vorfalls

---

## ✅ Security Checklist

Vor jedem Deployment:

```
[ ] RLS auf allen Tabellen aktiviert
[ ] Input-Validierung (Zod + DB-Trigger)
[ ] XSS-Prevention (DOMPurify)
[ ] SQL-Injection-Prevention (Prepared Statements)
[ ] RBAC korrekt implementiert
[ ] Secrets nicht im Code
[ ] CSP Header gesetzt
[ ] Rate Limiting aktiv
[ ] Supabase Linter ohne kritische Fehler
[ ] Keine sensitive Daten in Logs
```

---

## 📚 Weitere Ressourcen

- [Legal Compliance](./Legal-Compliance.md)
- [Quality Gates](./Quality-Gates.md)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Docs](https://supabase.com/docs/guides/database/security)

---

## 📝 Changelog

### V18.5.0 (2025-01-26)
- Erstversion Security Guidelines
- RLS, RBAC, Input Validation dokumentiert
- Security Linter Integration
- Incident Response Prozess

---

**KRITISCH:** Bei Security-Fragen IMMER eskalieren, niemals raten!
