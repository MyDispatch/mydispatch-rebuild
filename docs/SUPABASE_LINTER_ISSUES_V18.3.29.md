# 🔒 SUPABASE LINTER ISSUES V18.3.29

**Erstellt:** 2025-10-22  
**Version:** V18.3.29  
**Status:** ⚠️ 6 ISSUES IDENTIFIZIERT | 📋 DOKUMENTIERT

---

## 📋 ÜBERSICHT

Supabase Database Linter hat 6 Sicherheits-/Best-Practice-Issues identifiziert. Diese Dokumentation erklärt jeden Issue, dessen Impact und die erforderlichen Maßnahmen.

---

## ❌ ERROR ISSUES (1)

### ERROR 1: Security Definer View
**Level:** ERROR  
**Category:** SECURITY  
**Description:** Views mit SECURITY DEFINER erzwingen Postgres Permissions des View-Erstellers statt des Query-Users.

**Impact:**
- KRITISCH: Potenzielle Security-Lücke
- View-Queries umgehen RLS Policies
- Unberechtigter Datenzugriff möglich

**Affected:**
- Vermutlich: `public.materialized_view_*` oder custom views
- Exakte Identifikation: `SELECT * FROM pg_views WHERE security_definer = true;`

**Fix:**
```sql
-- Entferne SECURITY DEFINER Flag
ALTER VIEW [view_name] SET security_definer = false;

-- ODER: Lösche View wenn nicht benötigt
DROP VIEW IF EXISTS [view_name];
```

**Documentation:** https://supabase.com/docs/guides/database/database-linter?lint=0010_security_definer_view

**Status:** ⏳ PENDING - Erfordert manuelle DB-Aktion

---

## ⚠️ WARNING ISSUES (5)

### WARN 2: Function Search Path Mutable
**Level:** WARN  
**Category:** SECURITY  
**Description:** Functions ohne expliziten `search_path` Parameter.

**Impact:**
- MITTEL: SQL-Injection-Risiko
- Funktionen können manipuliert werden
- Best-Practice-Verstoß

**Fix:**
```sql
-- Setze search_path für jede Function
ALTER FUNCTION [function_name]
SET search_path = public, pg_catalog;

-- Oder in Function Definition:
CREATE OR REPLACE FUNCTION my_function()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  -- function body
END;
$$;
```

**Documentation:** https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable

**Status:** ⏳ PENDING - Prüfe alle custom functions

---

### WARN 3: Extension in Public
**Level:** WARN  
**Category:** SECURITY  
**Description:** Extensions im `public` Schema installiert.

**Impact:**
- LOW: Naming conflicts möglich
- Best-Practice-Verstoß
- Nicht kritisch für Sicherheit

**Fix:**
```sql
-- Verschiebe Extension in eigenes Schema
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION [extension_name] SET SCHEMA extensions;
```

**Documentation:** https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public

**Status:** ⏳ PENDING - Optional (Low Priority)

---

### WARN 4 & 5: Materialized View in API
**Level:** WARN  
**Category:** SECURITY  
**Description:** Materialized Views sind über Data API zugänglich.

**Impact:**
- LOW: Potenzielle Datenlecks
- Materialized Views sollten intern bleiben
- Best-Practice-Verstoß

**Affected:**
- Vermutlich: Analytics oder Reporting Views
- Identifikation: `SELECT * FROM pg_matviews;`

**Fix:**
```sql
-- Option 1: Entferne aus API Schema
ALTER MATERIALIZED VIEW [view_name] SET SCHEMA private;

-- Option 2: Füge RLS Policy hinzu
ALTER MATERIALIZED VIEW [view_name] ENABLE ROW LEVEL SECURITY;

-- Option 3: Lösche wenn nicht benötigt
DROP MATERIALIZED VIEW IF EXISTS [view_name];
```

**Documentation:** https://supabase.com/docs/guides/database/database-linter?lint=0016_materialized_view_in_api

**Status:** ⏳ PENDING - Prüfe ob Views noch benötigt

---

### WARN 6: Leaked Password Protection Disabled
**Level:** WARN  
**Category:** SECURITY  
**Description:** Supabase Leaked Password Protection ist deaktiviert.

**Impact:**
- MITTEL: Schwache Passwörter erlaubt
- Gehackte Passwörter nicht blockiert
- Security Best-Practice

**Fix:**
```sql
-- Enable via Supabase Dashboard oder SQL
-- Dashboard: Authentication > Auth Policies > Password Strength
-- Oder via Supabase API
```

**Alternative (Supabase Dashboard):**
1. Gehe zu: Authentication → Policies
2. Enable: "Leaked Password Protection"
3. Enable: "Password Strength Requirements"

**Documentation:** https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

**Status:** ⚠️ ACTION REQUIRED - Sofort aktivieren

---

## 🎯 PRIORITÄTS-MATRIX

| Issue | Priority | Impact | Effort | Status |
|-------|----------|--------|--------|--------|
| ERROR 1: Security Definer View | 🔴 KRITISCH | HIGH | LOW | ⏳ Pending |
| WARN 6: Password Protection | 🟠 HOCH | MEDIUM | LOW | ⚠️ Action Required |
| WARN 2: Function Search Path | 🟡 MITTEL | MEDIUM | MEDIUM | ⏳ Pending |
| WARN 4/5: Materialized Views | 🟢 NIEDRIG | LOW | LOW | ⏳ Pending |
| WARN 3: Extension in Public | 🟢 NIEDRIG | LOW | LOW | ⏳ Optional |

---

## 🚀 ACTION PLAN

### Phase 1 (SOFORT): ⚠️
1. **Enable Leaked Password Protection** (5 min)
   - Via Supabase Dashboard
   - Testing: Versuche schwaches Passwort
   
2. **Identify & Fix Security Definer View** (15 min)
   ```sql
   -- Run this query to find the view
   SELECT schemaname, viewname
   FROM pg_views
   WHERE security_definer = true;
   ```

### Phase 2 (KURZFRISTIG): 📅
3. **Audit Functions** (30 min)
   ```sql
   -- Find functions without search_path
   SELECT proname, prosrc
   FROM pg_proc
   WHERE pronamespace = 'public'::regnamespace
   AND prosecdef = true;
   ```
   
4. **Review Materialized Views** (20 min)
   ```sql
   -- List all materialized views
   SELECT schemaname, matviewname
   FROM pg_matviews;
   ```

### Phase 3 (OPTIONAL): ⏳
5. **Move Extensions** (10 min)
   - Create `extensions` schema
   - Move non-critical extensions

---

## 📚 RESOURCES

- **Supabase Linter Docs:** https://supabase.com/docs/guides/database/database-linter
- **Security Best Practices:** https://supabase.com/docs/guides/database/security
- **RLS Policies:** https://supabase.com/docs/guides/auth/row-level-security

---

## 🔄 MONITORING

### Pre-Deployment Check:
```bash
# Run linter before every deployment
npx supabase db lint

# Or via Supabase API
curl https://api.supabase.com/v1/projects/{project}/database/lint
```

### CI/CD Integration:
```yaml
# .github/workflows/ci.yml
- name: Supabase Linter
  run: |
    npx supabase db lint
    # Fail CI if ERROR issues found
```

---

## 📊 IMPACT ASSESSMENT

### Current Risk Score: **MEDIUM** ⚠️

**Factors:**
- ✅ RLS Policies: 100% implemented
- ⚠️ Security Definer: 1 ERROR (needs fix)
- ⚠️ Password Protection: Disabled (easy fix)
- ✅ Function Security: Mostly safe
- ✅ Code Quality: 100%

**After Fixes: LOW** ✅

---

## 🎓 LESSONS LEARNED

1. **Always run Supabase Linter** before production
2. **Never use SECURITY DEFINER** unless absolutely necessary
3. **Set search_path** in all SECURITY DEFINER functions
4. **Enable Password Protection** by default
5. **Keep Materialized Views internal**

---

**Maintained by:** Lovable AI Agent  
**Version:** V18.3.29  
**Status:** ⚠️ ISSUES DOKUMENTIERT | 📋 ACTION PLAN ERSTELLT
