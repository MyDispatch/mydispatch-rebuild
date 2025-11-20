# 🔒 DASHBOARD SECURITY SEPARATION V18.5.1

**Datum:** 24.10.2025  
**Version:** 18.5.1  
**Status:** 🚨 **KRITISCH & VERPFLICHTEND**  
**Sicherheitsstufe:** HÖCHSTE PRIORITÄT

---

## 🎯 KERNPRINZIP: STRIKTE TRENNUNG

**KRITISCH:** MyDispatch unterscheidet **ZWEI KOMPLETT GETRENNTE** Dashboard-Bereiche:

### 1. `/dashboard` - KUNDEN-DASHBOARD

**Zielgruppe:** MyDispatch Unternehmer-Kunden (Externe Nutzer)  
**Zugriff:** Alle authentifizierten Kunden  
**Zweck:** Geschäftsverwaltung (Aufträge, Fahrer, Fahrzeuge, Kunden, Finanzen)

### 2. `/master` - MASTER-DASHBOARD

**Zielgruppe:** MyDispatch-Team (Systembetreiber)  
**Zugriff:** **NUR** Accounts mit `role = 'master'`  
**Zweck:** System-Überwachung, Monitoring, Admin-Tools, Alerts

---

## 🚨 ABSOLUTE SICHERHEITSREGELN

### Regel 1: **NIEMALS** System-Daten im Kunden-Dashboard!

```tsx
// ❌ VERBOTEN: System-Alerts im Kunden-Dashboard (/dashboard)
<Route path="/dashboard" element={
  <DashboardLayout>
    <AlertWidget />           {/* ❌ System-Komponente! */}
    <PerformanceWidget />     {/* ❌ System-Komponente! */}
    <ErrorLogWidget />        {/* ❌ System-Komponente! */}
  </DashboardLayout>
} />

// ✅ KORREKT: System-Komponenten NUR im Master-Dashboard (/master)
<Route path="/master" element={
  <ProtectedRoute requiredRole="master">  {/* ← KRITISCH! */}
    <DashboardLayout>
      <AlertWidget />           {/* ✅ Sicher im Master */}
      <PerformanceWidget />     {/* ✅ Sicher im Master */}
      <ErrorLogWidget />        {/* ✅ Sicher im Master */}
    </DashboardLayout>
  </ProtectedRoute>
} />
```

---

### Regel 2: **ZWINGEND** Role-Based Access Control (RBAC)

**KRITISCH:** `/master` Route **MUSS** mit `requiredRole="master"` geschützt sein!

```typescript
// src/config/routes.config.tsx
{
  path: '/master',
  component: lazy(() => import('@/pages/MasterDashboard')),
  protected: true,              // ✅ Auth erforderlich
  layout: 'main',
  requiredRole: 'master',       // 🚨 KRITISCH: Nur Master-Accounts!
  meta: {
    title: 'Master-Dashboard',
    icon: Crown,
    breadcrumb: 'Master-Dashboard',
    description: 'System-Überwachung (Nur für MyDispatch-Team)',
  },
}
```

---

### Regel 3: **VERPFLICHTENDE** User-Roles-Tabelle

**KRITISCH:** Roles **MÜSSEN** in separater Tabelle gespeichert werden (Security Best Practice!)

```sql
-- Migration: Erstelle user_roles Tabelle
CREATE TYPE public.app_role AS ENUM ('customer', 'master', 'admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- RLS Policies
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security Definer Function (verhindert RLS-Rekursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy: Nur Master können andere Rollen sehen
CREATE POLICY "Masters can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'master'));

-- Policy: Nutzer können eigene Rollen lesen
CREATE POLICY "Users can read own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());
```

---

## 🔐 IMPLEMENTIERUNG: PROTECTED ROUTE

**KRITISCH:** ProtectedRoute prüft `requiredRole` und blockiert unbefugten Zugriff!

```tsx
// src/components/ProtectedRoute.tsx
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, roles } = useAuth();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 🚨 KRITISCH: Role-Check
  if (requiredRole && !roles.includes(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">🚫 Zugriff verweigert</h1>
          <p className="text-muted-foreground">
            Sie haben nicht die erforderlichen Berechtigungen für diese Seite.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

---

## 📊 DASHBOARD-MAPPING

### Kunden-Dashboard (`/dashboard`)

**Erlaubte Komponenten:**

- ✅ `RevenueChart` (Umsatz-Entwicklung)
- ✅ `HEREMapComponent` (Live-Karte)
- ✅ `Schnellzugriff` (4 Hauptaktionen)
- ✅ `Tagesübersicht` (Aufträge/Fahrer/Fahrzeuge)
- ✅ `Offene Rechnungen` (Überfällig & Ausstehend)
- ✅ `PaymentMethodsChart` (Zahlungsarten)
- ✅ `ResourceStatusWidget` (Fahrer-Status)
- ✅ `StatisticsWidget` (Vergleich & Trends)
- ✅ `ActivityTimeline` (Letzte Aktivitäten)
- ✅ `WeatherWidget` (Wetter-Daten)
- ✅ `TrafficWidget` (Verkehrslage)
- ✅ `PredictiveDemandWidget` (KI-Prognosen, Business-Tier)

**VERBOTEN:**

- ❌ `AlertWidget` (System-Alerts)
- ❌ `PerformanceWidget` (Response Times, DB-Latenz)
- ❌ `ErrorLogWidget` (Latest Errors, Sentry)
- ❌ `UserActivityWidget` (Active Users, Sessions)
- ❌ `BackupStatusWidget` (Letzte Backups)
- ❌ `APIHealthWidget` (Externe APIs)
- ❌ `DatabaseWidget` (Connections, Query Performance)
- ❌ `SecurityWidget` (Failed Logins, Suspicious Activity)
- ❌ `AgentHealthWidget` (AI-Agent Monitoring)
- ❌ `DocAISyncWidget` (Doc-AI Sync Status)

---

### Master-Dashboard (`/master`)

**Nur für Master-Accounts sichtbar:**

- ✅ `AlertWidget` (System-Alerts) ← **NEU in BATCH 10**
- ✅ KPI-Karten (Gesamt-Unternehmen, Terminierungen, Umsatz)
- ✅ Terminierungs-Tab (Kunden sperren/entsperren)
- ✅ Analytics-Tab (System-Performance)
- ✅ Company-Management (Alle MyDispatch-Kunden verwalten)

**Zukünftige System-Widgets:**

- 🔄 `PerformanceWidget` (Response Times, DB-Latenz)
- 🔄 `ErrorLogWidget` (Latest Errors, 404s, Sentry)
- 🔄 `UserActivityWidget` (Active Users, Sessions)
- 🔄 `BackupStatusWidget` (Letzte Backups, Erfolgsrate)
- 🔄 `APIHealthWidget` (Externe APIs: Stripe, Google Maps, etc.)
- 🔄 `DatabaseWidget` (Connections, Query Performance)
- 🔄 `SecurityWidget` (Failed Logins, Suspicious Activity)

---

## 🛡️ SECURITY BEST PRACTICES

### 1. **NIEMALS** Client-Side Role-Checks alleine!

```tsx
// ❌ FALSCH: Nur Frontend-Check (kann manipuliert werden!)
const isMaster = localStorage.getItem("role") === "master"; // UNSICHER!

if (isMaster) {
  return <MasterDashboard />;
}

// ✅ RICHTIG: Server-Side Validation + Frontend-Check
const { roles } = useAuth(); // Lädt Rollen aus Supabase via RLS
const isMaster = roles.includes("master");

if (isMaster) {
  return (
    <ProtectedRoute requiredRole="master">
      <MasterDashboard />
    </ProtectedRoute>
  );
}
```

---

### 2. **ZWINGEND** Row Level Security (RLS) für sensible Tabellen

```sql
-- KRITISCH: Alle Unternehmensdaten NUR für eigenen Zugriff!
CREATE POLICY "Users can only see own company data"
ON companies
FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid()
  OR public.has_role(auth.uid(), 'master')  -- Masters sehen alles
);

-- KRITISCH: Nur Master dürfen Terminierungen setzen
CREATE POLICY "Only masters can terminate accounts"
ON companies
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'master'))
WITH CHECK (public.has_role(auth.uid(), 'master'));
```

---

### 3. **VERPFLICHTEND** Audit-Logging für Master-Aktionen

```typescript
// src/lib/audit-logger.ts
export async function logMasterAction(
  action: string,
  targetCompanyId: string,
  details: Record<string, any>
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await supabase.from("audit_logs").insert({
    actor_id: user.id,
    action,
    target_company_id: targetCompanyId,
    details,
    timestamp: new Date().toISOString(),
  });
}

// Beispiel: Terminierung loggen
await logMasterAction("terminate_company", companyId, {
  reason: "Non-payment",
  previous_status: "active",
  new_status: "terminated",
});
```

---

## ⚠️ ALARM-TRIGGER

**SOFORT ESKALIEREN bei:**

1. System-Komponenten im Kunden-Dashboard gefunden
2. `/master` Route OHNE `requiredRole="master"`
3. Role-Check nur Client-Side (ohne Server-Validation)
4. Fehlende RLS-Policies für Unternehmensdaten
5. Fehlende Audit-Logs für Master-Aktionen
6. Rollen in `profiles` oder `users` Tabelle (statt `user_roles`)

---

## ✅ CHECKLISTE VOR COMMIT

Dashboard-Trennung:

- [ ] System-Komponenten NUR im `/master`?
- [ ] Kunden-Dashboard (`/dashboard`) enthält KEINE System-Daten?
- [ ] `/master` Route mit `requiredRole="master"` geschützt?
- [ ] `user_roles` Tabelle mit RLS existiert?
- [ ] `has_role()` Security Definer Function aktiv?
- [ ] RLS-Policies für `companies` Tabelle implementiert?
- [ ] Audit-Logging für Master-Aktionen aktiv?
- [ ] ProtectedRoute prüft Rollen korrekt?

---

## 📚 REFERENZEN

- **System-Komponenten:** `docs/SYSTEM_KOMPONENTEN_VORGABEN_V18.5.1.md`
- **Dashboard-Naming:** `docs/DASHBOARD_NAMING_CONVENTIONS.md`
- **Dashboard-Layout:** `docs/DASHBOARD_LAYOUT_RULES_V18.5.1.md`
- **Portal-Struktur:** `docs/PORTAL_STRUKTUR_V18.3.30.md`
- **Shared Knowledge:** `docs/SHARED_KNOWLEDGE_V18.5.1.md`
- **Supabase RLS Best Practices:** [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🚀 MIGRATION PLAN

Wenn `/master` Route noch NICHT mit `requiredRole` geschützt ist:

### Phase 1: User-Roles-Tabelle erstellen (falls noch nicht vorhanden)

```bash
# Migration ausführen (siehe SQL oben)
supabase db push
```

### Phase 2: Master-Accounts identifizieren

```sql
-- Füge MyDispatch-Team Accounts hinzu
INSERT INTO public.user_roles (user_id, role)
VALUES
  ('UUID_TEAM_MEMBER_1', 'master'),
  ('UUID_TEAM_MEMBER_2', 'master'),
  ('UUID_TEAM_MEMBER_3', 'master');
```

### Phase 3: Route schützen

```typescript
// src/config/routes.config.tsx
{
  path: '/master',
  component: lazy(() => import('@/pages/MasterDashboard')),
  protected: true,
  layout: 'main',
  requiredRole: 'master',  // ← HINZUFÜGEN!
  meta: { ... },
}
```

### Phase 4: Testing

- ✅ Als Kunde: `/master` öffnen → **Zugriff verweigert**
- ✅ Als Master: `/master` öffnen → **Zugriff gewährt**
- ✅ Direkter URL-Zugriff: `/master` → **Redirect wenn nicht Master**

---

**KRITISCH:** Diese Trennung ist **NICHT verhandelbar**. Kunden-Dashboard und Master-Dashboard sind **KOMPLETT GETRENNTE** Bereiche mit unterschiedlichen Sicherheitsstufen!

---

**Version:** 18.5.1  
**Datum:** 24.10.2025  
**Status:** 🚨 KRITISCH & VERPFLICHTEND  
**Verantwortlich:** System-Security-Architektur
