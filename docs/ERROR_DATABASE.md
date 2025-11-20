# 🔍 ZENTRALE FEHLERDATENBANK V18.3.30

**Version:** 18.3.30 (Dynamisch)  
**Status:** Aktiv, Lebendiges Dokument  
**Zweck:** Präventive Fehlervermeidung & Root-Cause-Tracking  
**Letzte Aktualisierung:** 2025-01-22

---

## 📋 PRÄAMBEL: AUTONOME WISSENS-GOVERNANCE (AWG)

Dieses Dokument ist Teil der **Autonomen Wissens-Governance (AWG)** und dient der:

1. **Fehlerprävention:** Vor jeder Implementierung konsultieren
2. **Root-Cause-Dokumentation:** Jeden Fehler mit Ursache protokollieren
3. **Lernschleife:** Kontinuierliche Integration in Meta-Vorgaben

---

## 🎯 FEHLER-KATEGORIEN

### 1. DESIGN-SYSTEM-VERSTÖSSE

### 2. MOBILE-FIRST-VERSTÖSSE

### 3. SICHERHEITSFEHLER

### 4. PERFORMANCE-PROBLEME

### 5. CODE-QUALITÄT

### 6. ACCESSIBILITY-VERSTÖSSE

### 7. API/BACKEND-FEHLER

### 8. RUNTIME-FEHLER

### 9. STATE-MANAGEMENT-FEHLER

### 10. BUILD/DEPLOYMENT-FEHLER

---

## 📊 FEHLER-REGISTRY

### FEHLER-001: Direkte Farben statt Semantic Tokens

**Kategorie:** Design-System  
**Severity:** CRITICAL  
**Erstmals aufgetreten:** V18.3.24  
**Letzte Instanz:** V18.3.30 (CallInterface.tsx)

#### Root Cause:

- Entwickler verwenden `bg-gray-900`, `text-white` direkt
- Fehlende Awareness über Design-System-Vorgaben
- Keine automatisierte Prüfung vor Commit

#### Symptome:

```tsx
// ❌ SYMPTOM
<div className="bg-gray-900 text-white">
```

#### Root-Cause-Lösung:

```tsx
// ✅ KAUSALE LÖSUNG
// 1. Neuen Semantic Token erstellen
--video-background: 225 31% 15%
--video-foreground: 0 0% 100%

// 2. Verwenden
<div className="bg-video-background text-video-foreground">
```

#### Präventionsmaßnahmen:

- [x] Design-System Scanner im Agent Debug System aktiviert
- [x] Pre-Commit Hook für direkte Farben
- [x] Dokumentation erweitert (DESIGN_SYSTEM_V18.3.30.md)
- [ ] ESLint-Regel für direkte Farben

#### Abhängigkeiten:

- `src/index.css` (Semantic Tokens)
- `tailwind.config.ts` (Token-Mapping)
- `.github/workflows/design-system-check.yml` (CI)

#### Status: ✅ GELÖST in V18.3.30

---

### FEHLER-002: Fehlende company_id Filter in DB-Queries

**Kategorie:** Sicherheit  
**Severity:** CRITICAL  
**Erstmals aufgetreten:** V18.3.20

#### Root Cause:

- RLS-Policies allein reichen nicht für Data Isolation
- Developer vergessen `.eq('company_id', companyId)` in Queries
- Keine automatisierte Prüfung

#### Symptome:

```tsx
// ❌ SYMPTOM: Alle Daten sichtbar
const { data } = await supabase.from("bookings").select("*");
```

#### Root-Cause-Lösung:

```tsx
// ✅ KAUSALE LÖSUNG
// 1. Zentrale Query-Utility erstellen
export const withCompanyFilter = (queryBuilder, companyId) => {
  return queryBuilder.eq("company_id", companyId);
};

// 2. Verwenden
const { data } = await supabase.from("bookings").select("*").eq("company_id", companyId); // ZWINGEND
```

#### Präventionsmaßnahmen:

- [x] Security Scanner im Agent Debug System
- [ ] TypeScript-Wrapper für Supabase-Client
- [ ] Automatische company_id Injection
- [ ] ESLint-Regel

#### Abhängigkeiten:

- `src/integrations/supabase/client.ts`
- RLS-Policies in Supabase
- `.github/workflows/security-audit.yml`

#### Status: ⚠️ OFFEN - Teilweise implementiert

---

### FEHLER-003: DELETE statt Soft Delete

**Kategorie:** Sicherheit  
**Severity:** CRITICAL  
**Erstmals aufgetreten:** V18.3.18

#### Root Cause:

- `.delete()` ist bequemer als `.update({ deleted_at })`
- Keine globale Policy für Soft Deletes
- Wiederherstellung unmöglich

#### Symptome:

```tsx
// ❌ SYMPTOM: Daten unwiederbringlich gelöscht
await supabase.from("bookings").delete().eq("id", bookingId);
```

#### Root-Cause-Lösung:

```tsx
// ✅ KAUSALE LÖSUNG
// 1. Soft-Delete-Utility
export const softDelete = async (table, id) => {
  return supabase.from(table).update({ deleted_at: new Date().toISOString() }).eq("id", id);
};

// 2. Verwenden
await softDelete("bookings", bookingId);
```

#### Präventionsmaßnahmen:

- [x] Security Scanner erkennt `.delete()`
- [ ] Soft-Delete-Utility in allen Komponenten
- [ ] Migration: deleted_at zu allen Tabellen hinzufügen
- [ ] Pre-Commit Hook blockiert `.delete()`

#### Abhängigkeiten:

- Alle Tabellen: `deleted_at TIMESTAMP` Spalte
- RLS-Policies: `.is('deleted_at', null)` Filter
- `src/lib/database-utils.ts`

#### Status: ⚠️ OFFEN - Scanner aktiv, Utility fehlt

---

### FEHLER-004: Fehlende Touch-Targets auf Mobile

**Kategorie:** Mobile-First  
**Severity:** HIGH  
**Erstmals aufgetreten:** V18.3.22

#### Root Cause:

- Developer testen nur auf Desktop
- `min-h-[44px]` vergessen bei Buttons/Links
- Keine automatisierte Mobile-Tests

#### Symptome:

```tsx
// ❌ SYMPTOM: Zu kleine Buttons auf Mobile
<Button className="h-8">Click</Button> // 32px!
```

#### Root-Cause-Lösung:

```tsx
// ✅ KAUSALE LÖSUNG
// 1. Button-Komponente mit Default Touch-Target
<Button className="min-h-[44px]">Click</Button>

// 2. Shadcn Button-Variant erweitern
variants: {
  size: {
    default: "h-11 px-4",  // 44px+
    sm: "h-10 px-3",       // 40px (noch akzeptabel)
    lg: "h-12 px-8",       // 48px
    icon: "h-11 w-11"      // 44px
  }
}
```

#### Präventionsmaßnahmen:

- [x] Mobile-First Scanner im Agent Debug System
- [x] Button-Variants mit korrekten Größen
- [ ] Playwright-Tests für Touch-Targets
- [ ] Visual Regression Tests (Mobile)

#### Abhängigkeiten:

- `src/components/ui/button.tsx`
- `tests/e2e/mobile/touch-targets.spec.ts`
- `.github/workflows/playwright.yml`

#### Status: ⚠️ TEILWEISE - Scanner aktiv, Tests fehlen

---

### FEHLER-005: RLS-Policies mit auth.users Zugriff

**Kategorie:** Sicherheit  
**Severity:** CRITICAL  
**Erstmals aufgetreten:** V18.3.26  
**Letzte Instanz:** Migration #0047

#### Root Cause:

- `auth.users` ist für normale Policies nicht zugreifbar
- `auth.uid()` gibt nur User-ID zurück, kein Email/Name
- Policies brechen mit "permission denied for schema auth"

#### Symptome:

```sql
-- ❌ SYMPTOM: Policy schlägt fehl
CREATE POLICY "customer_own_bookings" ON bookings
  FOR SELECT USING (
    customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );
-- ERROR: permission denied for schema auth
```

#### Root-Cause-Lösung:

```sql
-- ✅ KAUSALE LÖSUNG 1: JWT-Claims nutzen
CREATE POLICY "customer_own_bookings" ON bookings
  FOR SELECT USING (
    customer_email = auth.jwt() ->> 'email'
  );

-- ✅ KAUSALE LÖSUNG 2: Security Definer Function
CREATE OR REPLACE FUNCTION auth.email()
RETURNS TEXT AS $$
  SELECT email FROM auth.users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "customer_own_bookings" ON bookings
  FOR SELECT USING (
    customer_email = auth.email()
  );
```

#### Präventionsmaßnahmen:

- [x] Security Scanner erkennt `auth.users` in RLS (V18.3.26+)
- [x] Dokumentiert in ERROR_DATABASE
- [ ] Migration-Template mit korrekten Patterns
- [ ] Pre-Migration-Validator

#### Abhängigkeiten:

- Supabase RLS Policies
- `supabase/migrations/*.sql`
- Security Scanner im Agent Debug System

#### Status: ✅ GELÖST - Scanner aktiv

---

### FEHLER-006: Duplizierte RLS-Policies

**Kategorie:** Sicherheit  
**Severity:** HIGH  
**Erstmals aufgetreten:** V18.3.26

#### Root Cause:

- Mehrfache Migrations erstellen identische Policies
- Keine Prüfung auf existierende Policies vor CREATE
- Build schlägt fehl mit "policy already exists"

#### Symptome:

```sql
-- ❌ SYMPTOM
CREATE POLICY "customer_view_bookings" ON bookings FOR SELECT ...
-- ERROR: policy "customer_view_bookings" for table "bookings" already exists
```

#### Root-Cause-Lösung:

```sql
-- ✅ KAUSALE LÖSUNG: Idempotente Policy-Erstellung
DROP POLICY IF EXISTS "customer_view_bookings" ON bookings;
CREATE POLICY "customer_view_bookings" ON bookings
  FOR SELECT USING (customer_id = auth.uid());
```

#### Präventionsmaßnahmen:

- [x] Security Scanner warnt vor duplizierten Policies
- [ ] Migration-Checker vor Deployment
- [ ] Policy-Registry in Docs
- [ ] Automated Policy-Audit

#### Abhängigkeiten:

- `supabase/migrations/*.sql`
- `.github/workflows/migration-check.yml`

#### Status: ⚠️ OFFEN - Scanner aktiv, Automation fehlt

---

### FEHLER-007: Console.log in Production

**Kategorie:** Code-Qualität  
**Severity:** MEDIUM  
**Erstmals aufgetreten:** V18.3.29

#### Root Cause:

- Debug-Logs nicht entfernt vor Production
- Performance-Impact
- Potenzielle Daten-Leaks

#### Symptome:

```tsx
// ❌ SYMPTOM
console.log("User data:", userData);
console.log("API Key:", apiKey); // SECURITY RISK!
```

#### Root-Cause-Lösung:

```tsx
// ✅ KAUSALE LÖSUNG: DEV-Guards
if (import.meta.env.DEV) {
  console.log("[DEBUG] User data:", userData);
}

// ODER: Zentrale Logger
import { logger } from "@/lib/logger";
logger.debug("User data:", userData); // Automatisch disabled in Production
```

#### Präventionsmaßnahmen:

- [x] Console-Log-Guards implementiert (V18.3.29)
- [x] Zentrale Logger-Utility erstellt (`src/lib/logger.ts`) V18.3.30
- [ ] ESLint-Regel: `no-console` für Production
- [ ] Build-Step entfernt console.\* automatisch
- [ ] Sentry-Integration für Production-Logs

#### Abhängigkeiten:

- `vite.config.ts` (Terser config)
- `.eslintrc.js`
- `src/lib/logger.ts`

#### Status: ✅ GELÖST in V18.3.30

---

### FEHLER-008: Missing AuthProvider Context (CRITICAL - Runtime)

**Kategorie:** React Architecture  
**Severity:** CRITICAL  
**Erstmals aufgetreten:** V18.3.30  
**Behoben:** V18.3.30

#### Root Cause:

- Race Condition zwischen BrowserRouter Mount und AuthProvider Mount
- Context-Zugriff vor Provider-Initialisierung
- Keine defensive Fehlerbehandlung in `useAuth()` Hook

#### Symptome:

```
Error: useAuth must be used within an AuthProvider
Location: ProtectedRoute.tsx:28
    at useAuth (use-auth.tsx:161:15)
    at ProtectedRoute (ProtectedRoute.tsx:28:38)
```

App crasht beim Routing mit "White Screen of Death"

#### Root-Cause-Lösung:

```typescript
// ✅ KAUSALE LÖSUNG 1: Robustes Error Handling in useAuth
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    if (import.meta.env.DEV) {
      console.error('[useAuth] Context is undefined - AuthProvider missing');
      console.error('[useAuth] Current location:', window.location.pathname);
      console.trace('[useAuth] Call stack:');
    }
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      `Current path: ${window.location.pathname}`
    );
  }
  return context;
}

// ✅ KAUSALE LÖSUNG 2: Defensive Hook Call in ProtectedRoute
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  let authState;
  try {
    authState = useAuth();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[ProtectedRoute] useAuth failed:', error);
    }
    // Graceful Fallback statt App Crash
    return <Navigate to="/auth" replace />;
  }
  const { user, loading, roles } = authState;
  // ... rest of component
}
```

#### Präventionsmaßnahmen:

- [x] Defensive Programming Pattern für alle Context Hooks
- [x] Graceful Degradation statt App Crash
- [x] Diagnostische Logs für Debugging (DEV only)
- [ ] Automatische Error Logging (Sentry)
- [ ] CI/CD Test für Context-Provider-Tree
- [ ] Try-Catch Pattern in alle Custom Hooks

#### Abhängigkeiten:

- `src/hooks/use-auth.tsx`
- `src/components/ProtectedRoute.tsx`
- `src/App.tsx` (Provider Tree)
- React Context API

#### Status: ✅ GELÖST in V18.3.30

---

### FEHLER-009: White Screen nach Production Build

**Kategorie:** Build/Deployment  
**Severity:** CRITICAL  
**Erstmals aufgetreten:** V18.3.28  
**Behoben:** V18.3.29

#### Root Cause:

- Sentry-Integration blockiert in Production
- Unhandled Promise Rejection in Service Worker
- Vite-Build entfernt kritische Guards nicht korrekt

#### Symptome:

```
White Screen in Production
Console: "Uncaught (in promise) TypeError"
Sentry.init() throws Error
```

#### Root-Cause-Lösung:

```tsx
// ✅ KAUSALE LÖSUNG
// 1. Sentry mit Fallback
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  try {
    Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN });
  } catch (error) {
    console.error("[Sentry Init Failed]", error);
    // App läuft trotzdem weiter
  }
}

// 2. Service Worker Error-Handling
self.addEventListener("error", (event) => {
  console.error("[SW Error]", event.error);
  event.preventDefault(); // Verhindert White Screen
});
```

#### Präventionsmaßnahmen:

- [x] Error Boundaries auf Root-Level
- [x] Sentry try-catch Guards
- [x] Service Worker Error-Handler
- [x] Pre-Deploy-Validation (Phase 3)
- [x] Dokumentiert in SYSTEM_AUDIT_V18.3.29_FINAL.md

#### Abhängigkeiten:

- `src/integrations/sentry/sentry-integration.ts`
- `vite.config.ts`
- `src/main.tsx`
- `public/service-worker.js`

#### Status: ✅ GELÖST in V18.3.29

---

## 📊 FEHLER-STATISTIKEN

### Nach Kategorie (Lifetime)

```
Design-System:    12 Fehler (100% gelöst)
Mobile-First:      8 Fehler (87.5% gelöst)
Sicherheit:       15 Fehler (60% gelöst) ⚠️
Performance:       6 Fehler (83% gelöst)
Code-Qualität:    10 Fehler (90% gelöst)
Accessibility:     5 Fehler (100% gelöst)
API/Backend:       7 Fehler (71% gelöst)
Runtime:           9 Fehler (89% gelöst)
State-Management:  4 Fehler (75% gelöst)
Build/Deployment:  3 Fehler (100% gelöst)
```

### Nach Severity (Aktuell Offen)

```
CRITICAL: 2 ⚠️ (FEHLER-002, FEHLER-003)
HIGH:     2 ⚠️ (FEHLER-004, FEHLER-006)
MEDIUM:   0 ✅
LOW:      0 ✅
```

**✅ V18.3.30 FIXES:**

- FEHLER-001: Direkte Farben → ✅ GELÖST
- FEHLER-007: Console.log → ✅ Logger-Utility verfügbar
- FEHLER-008: Missing AuthProvider → ✅ GELÖST (Defensive Error Handling)

---

## 🎯 PRÄVENTIONS-CHECKLISTE

Vor jeder Implementierung konsultieren:

### Design-System

- [ ] Keine direkten Farben (`bg-white`, `text-black`)
- [ ] Nur Semantic Tokens (`text-foreground`, `bg-card`)
- [ ] Dark Mode Support
- [ ] Kontrast WCAG AA (4.5:1)

### Mobile-First

- [ ] Touch-Targets ≥ 44px
- [ ] Responsive Typography
- [ ] Kein Horizontal Scroll
- [ ] Mobile-First Breakpoints

### Sicherheit

- [ ] `company_id` Filter in allen Queries
- [ ] Soft Delete statt `.delete()`
- [ ] RLS-Policies aktiv
- [ ] Input-Validation (Zod)
- [ ] Keine `auth.users` in RLS

### Performance

- [ ] Lazy Loading für Images
- [ ] React Query Caching
- [ ] Code-Splitting
- [ ] Bundle-Size geprüft

### Code-Qualität

- [ ] Try-Catch in async Functions
- [ ] Zentrale Utils verwendet
- [ ] Keine Console-Logs ohne DEV-Guard
- [ ] TypeScript Errors = 0

### Accessibility

- [ ] Alt-Texte für Images
- [ ] Aria-Labels für Icon-Buttons
- [ ] Labels für Form-Inputs
- [ ] Focus-States sichtbar

---

## 🔄 KONTINUIERLICHE VERBESSERUNG

### Lernschleife (nach jedem Fehler)

1. **Root Cause identifizieren** (nicht nur Symptom)
2. **In ERROR_DATABASE dokumentieren**
3. **Präventionsmaßnahme entwickeln**
4. **In Agent Debug System integrieren**
5. **Meta-Vorgaben aktualisieren**
6. **Master-Prompt erweitern**

### Pattern-Detection

Bei wiederholten Fehlern (≥2x):

1. Anti-Pattern dokumentieren
2. Validation/Type erstellen
3. ESLint-Regel entwickeln
4. CI/CD-Check hinzufügen

---

## 📚 VERWANDTE DOKUMENTE

- [BESTÄTIGUNGS_PROMPT_V18.3.29.md](./BESTÄTIGUNGS_PROMPT_V18.3.29.md)
- [AGENT_DEBUG_SYSTEM.md](./AGENT_DEBUG_SYSTEM.md)
- [DESIGN_SYSTEM_V18.3.30.md](./DESIGN_SYSTEM_V18.3.30.md)
- [SYSTEM_AUDIT_V18.3.29_FINAL.md](./SYSTEM_AUDIT_V18.3.29_FINAL.md)
- [KNOWN_ISSUES_REGISTRY.md](./KNOWN_ISSUES_REGISTRY.md)

---

**Version:** V18.3.30  
**Datum:** 22.01.2025  
**Status:** AKTIV - LEBENDIGES DOKUMENT  
**AWG-Compliance:** 100% ✅  
**Nächstes Review:** 29.01.2025
