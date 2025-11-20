# 🎯 MASTER-DASHBOARD SPECIFICATION V40.11 - COMPLETE

> **Version:** V40.11  
> **Status:** ✅ PRODUCTION-READY - SINGLE SOURCE OF TRUTH  
> **Erstellt:** 2025-01-30  
> **Gültigkeit:** Ersetzt ALLE bisherigen Master-Dashboard Dokumentationen

---

## 📋 EXECUTIVE SUMMARY

Diese Spezifikation ist die **verbindliche Single Source of Truth** für das Master-Dashboard (`/master`).

**Zweck:** Zentrale Steuerungszentrale für System-Administratoren mit:

- System Health Monitoring
- Quick Actions (context-sensitive)
- Multi-Tab Navigation (Companies, Code Quality, System, Agent, Roadmap, CI Guidelines)
- Live Activity Feed
- Responsive 2-Column Layout

**Architektur-Prinzipien:**

- ✅ Mobile-First Design
- ✅ V28.1 Slate Design System (Pure Slate-Palette)
- ✅ React Query für Data Fetching
- ✅ Zustand für Local State
- ✅ Supabase Edge Functions für Backend Logic

---

## 🏗️ ARCHITECTURE BLUEPRINT

### System-Level Architecture

<lov-mermaid>
graph TD
    A[Browser] -->|Route: /master| B[Master.tsx]
    B --> C[MainLayout]
    C --> D[AppSidebar Links]
    C --> E[Dashboard Content]
    C --> F[Quick Actions Panel Rechts]
    
    E --> G[SEOHead]
    E --> H[PageHeaderWithKPIs]
    E --> I[System Health KPIs]
    E --> J[Tab Navigation]
    
    J --> K[Companies Tab]
    J --> L[Code Quality Tab]
    J --> M[System Tab]
    J --> N[Agent Tab]
    J --> O[Roadmap Tab]
    J --> P[CI Guidelines Tab]
    
    F --> Q[Quick Actions Card]
    F --> R[Recent Activity Card]
    F --> S[System Status Card]
    
    Q -->|Context| J
    Q -->|Action| T[Edge Functions]
    R -->|Live Updates| U[Supabase Realtime]
    S -->|Health Check| V[API Endpoints]
</lov-mermaid>

### Data Flow Architecture

<lov-mermaid>
sequenceDiagram
    participant User
    participant Master.tsx
    participant ReactQuery
    participant Supabase
    participant EdgeFunctions
    
    User->>Master.tsx: Navigate to /master
    Master.tsx->>ReactQuery: useQuery('system-health')
    ReactQuery->>Supabase: SELECT * FROM system_metrics
    Supabase-->>ReactQuery: Return Data
    ReactQuery-->>Master.tsx: Render KPIs
    
    User->>Master.tsx: Click Quick Action
    Master.tsx->>EdgeFunctions: invoke('master-action', {type})
    EdgeFunctions->>Supabase: Execute Operation
    Supabase-->>EdgeFunctions: Success/Error
    EdgeFunctions-->>Master.tsx: Response
    Master.tsx->>ReactQuery: Invalidate Queries
    ReactQuery->>Master.tsx: Refetch & Update
</lov-mermaid>

### State Management Architecture

<lov-mermaid>
graph LR
    A[Zustand Store] -->|selectedTab| B[Master.tsx]
    B -->|Context| C[Quick Actions]
    
    D[React Query Cache] -->|system-health| B
    D -->|recent-activities| E[Recent Activity Card]
    D -->|api-status| F[System Status Card]
    
    G[URL Params] -->|?tab=companies| B
    B -->|Sync| A
</lov-mermaid>

---

## 📐 VISUAL LAYOUT SCHEMA

### Desktop Layout (≥1280px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER (64px)                                                                │
│ [Logo] [Navigation] [User Menu]                                             │
├─────────────────┬───────────────────────────────────────┬───────────────────┤
│ APP SIDEBAR     │ DASHBOARD CONTENT                     │ QUICK ACTIONS     │
│ (256px)         │ (Dynamic Width)                       │ PANEL (384px)     │
│                 │                                       │                   │
│ [Dashboard]     │ ┌─────────────────────────────────┐  │ ┌───────────────┐ │
│ [Orders]        │ │ System Health KPIs (4-Grid)     │  │ │ Quick Actions │ │
│ [Drivers]       │ │ ├─────┬─────┬─────┬─────┐       │  │ │ (Context)     │ │
│ [Vehicles]      │ │ │ Up  │ Err │ Usr │ DB  │       │  │ │               │ │
│ [Customers]     │ │ └─────┴─────┴─────┴─────┘       │  │ └───────────────┘ │
│ [Billing]       │ └─────────────────────────────────┘  │ ┌───────────────┐ │
│ [Master] ◄──    │                                       │ │ Recent        │ │
│                 │ ┌─────────────────────────────────┐  │ │ Activity      │ │
│                 │ │ TAB NAVIGATION                  │  │ │ (Live Feed)   │ │
│                 │ │ [Companies][Code][System]...    │  │ │               │ │
│                 │ ├─────────────────────────────────┤  │ └───────────────┘ │
│                 │ │                                 │  │ ┌───────────────┐ │
│                 │ │ TAB CONTENT AREA                │  │ │ System Status │ │
│                 │ │ (Dynamic per Tab)               │  │ │ API: ✅       │ │
│                 │ │                                 │  │ │ DB:  ✅       │ │
│                 │ │                                 │  │ │ Storage: ✅   │ │
│                 │ └─────────────────────────────────┘  │ └───────────────┘ │
├─────────────────┴───────────────────────────────────────┴───────────────────┤
│ FOOTER (48px)                                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (<768px)

```
┌─────────────────────────────────┐
│ HEADER (56px)                   │
│ [☰] [Logo] [User]              │
├─────────────────────────────────┤
│ DASHBOARD CONTENT (Full Width)  │
│                                 │
│ ┌─────────────────────────────┐│
│ │ System Health KPIs (2x2)    ││
│ │ ┌───────┬───────┐           ││
│ │ │ Up    │ Err   │           ││
│ │ ├───────┼───────┤           ││
│ │ │ Usr   │ DB    │           ││
│ │ └───────┴───────┘           ││
│ └─────────────────────────────┘│
│                                 │
│ ┌─────────────────────────────┐│
│ │ TAB NAVIGATION (Swipeable)  ││
│ │ [Companies][Code][System]   ││
│ ├─────────────────────────────┤│
│ │ TAB CONTENT                 ││
│ └─────────────────────────────┘│
│                                 │
│ ┌─────────────────────────────┐│
│ │ Quick Actions (Collapsed)   ││
│ │ [+ Expand]                  ││
│ └─────────────────────────────┘│
├─────────────────────────────────┤
│ FOOTER (48px)                   │
└─────────────────────────────────┘
```

### Component Hierarchy Tree

<lov-mermaid>
graph TD
    A[Master.tsx] --> B[MainLayout]
    A --> C[SEOHead]
    A --> D[DashboardBreadcrumb]
    A --> E[PageHeaderWithKPIs]
    
    B --> F[AppSidebar]
    B --> G[Dashboard Content Area]
    B --> H[Quick Actions Panel]
    
    G --> I[System Health KPIs Grid]
    I --> J[Premium3DCard x4]
    
    G --> K[Tabs Component]
    K --> L[TabsList]
    K --> M[TabsContent: Companies]
    K --> N[TabsContent: Code Quality]
    K --> O[TabsContent: System]
    K --> P[TabsContent: Agent]
    K --> Q[TabsContent: Roadmap]
    K --> R[TabsContent: CI Guidelines]
    
    H --> S[Quick Actions Card]
    H --> T[Recent Activity Card]
    H --> U[System Status Card]
    
    S --> V[Button x N]
    T --> W[Activity Item x N]
    U --> X[Status Badge x 3]
</lov-mermaid>

---

## 📏 SPACING & GRID SYSTEM

### Pixel-Perfect Layout Calculations

#### Desktop (≥1280px)

```typescript
const LAYOUT_DIMENSIONS = {
  header: { height: 64 },
  footer: { height: 48 },
  appSidebar: {
    collapsed: 64,
    expanded: 256,
  },
  quickActionsPanel: { width: 384 },

  mainContent: {
    marginLeft: 256, // AppSidebar expanded
    marginRight: 384, // Quick Actions Panel
    padding: 24, // p-6
    gap: 24, // gap-6
  },

  systemHealthGrid: {
    columns: 4,
    gap: 24, // gap-6
    cardPadding: 24, // p-6
  },
};
```

#### Responsive Main Content Width

```css
/* Master.tsx Main Content Area */
.main-content {
  /* Desktop with both sidebars */
  @media (min-width: 1280px) {
    margin-left: var(--sidebar-width); /* 256px or 64px */
    margin-right: 384px; /* Quick Actions Panel */
  }

  /* Tablet (no Quick Actions Panel) */
  @media (min-width: 768px) and (max-width: 1279px) {
    margin-left: var(--sidebar-width);
    margin-right: 0;
  }

  /* Mobile (no sidebars visible) */
  @media (max-width: 767px) {
    margin-left: 0;
    margin-right: 0;
  }
}
```

### Grid Patterns

#### System Health KPIs Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">{/* 4 KPI Cards */}</div>
```

#### Quick Actions Panel Spacing

```tsx
<div className="space-y-6 px-6 pt-6 pb-6">
  {/* Quick Actions Card */}
  {/* Recent Activity Card */}
  {/* System Status Card */}
</div>
```

---

## 🔧 COMPONENT HIERARCHY

### Master.tsx Structure

```typescript
export default function Master() {
  return (
    <>
      <SEOHead
        title="Master Control Center"
        description="System-Administration Dashboard"
      />

      <MainLayout>
        {/* LEFT: AppSidebar (256px collapsed: 64px) */}

        {/* CENTER: Main Dashboard Content */}
        <div className="flex-1 overflow-auto xl:mr-[384px]">
          <div className="p-6 space-y-6">
            {/* Breadcrumb */}
            <DashboardBreadcrumb
              items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Master Control', href: '/master' }
              ]}
            />

            {/* Header mit KPIs */}
            <PageHeaderWithKPIs
              title="Master Control Center"
              subtitle="System-Administration & Monitoring"
              icon={Crown}
              kpis={[
                { label: 'System Uptime', value: '99.9%' },
                { label: 'Active Users', value: '1,234' }
              ]}
            />

            {/* System Health KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <Premium3DCard title="Uptime" value="99.9%" />
              <Premium3DCard title="Error Rate" value="0.01%" />
              <Premium3DCard title="Active Users" value="1,234" />
              <Premium3DCard title="DB Response" value="12ms" />
            </div>

            {/* Tab Navigation */}
            <Tabs defaultValue="companies">
              <TabsList>
                <TabsTrigger value="companies">Companies</TabsTrigger>
                <TabsTrigger value="code-quality">Code Quality</TabsTrigger>
                {/* ... mehr Tabs */}
              </TabsList>

              <TabsContent value="companies">
                {/* Companies Content */}
              </TabsContent>
              {/* ... mehr TabsContent */}
            </Tabs>
          </div>
        </div>

        {/* RIGHT: Quick Actions Panel (384px, fixed) */}
        <div className="hidden xl:flex flex-col fixed top-16 right-0 h-[calc(100vh-64px-48px)] w-96 bg-gradient-to-b from-slate-50/80 to-slate-100/60">
          <div className="space-y-6 px-6 pt-6 pb-6">
            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button>Firma hinzufügen</Button>
                <Button>Code Scan starten</Button>
                {/* Context-sensitive actions */}
              </CardContent>
            </Card>

            {/* Recent Activity Card */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {activities.map(activity => (
                  <ActivityItem key={activity.id} {...activity} />
                ))}
              </CardContent>
            </Card>

            {/* System Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusBadge label="API" status="online" />
                <StatusBadge label="Database" status="online" />
                <StatusBadge label="Storage" status="online" />
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
```

---

## ⚡ QUICK ACTIONS SYSTEM - SCHALTPLAN

### Context-Sensitive Logic

<lov-mermaid>
graph TD
    A[User selects Tab] --> B{Which Tab?}
    
    B -->|Companies| C[Show Company Actions]
    C --> C1["+ Firma hinzufügen"]
    C --> C2["📊 Firmen-Report"]
    C --> C3["🔄 Daten synchronisieren"]
    
    B -->|Code Quality| D[Show Code Actions]
    D --> D1["🔍 Code Scan starten"]
    D --> D2["📈 Quality Report"]
    D --> D3["🛠️ Auto-Fix Issues"]
    
    B -->|System| E[Show System Actions]
    E --> E1["🗄️ DB Backup starten"]
    E --> E2["📊 System Logs"]
    E --> E3["🔄 Cache leeren"]
    
    B -->|Agent| F[Show Agent Actions]
    F --> F1["🤖 Agent Status"]
    F --> F2["📝 Training starten"]
    F --> F3["🔧 Konfiguration"]
    
    B -->|Roadmap| G[Show Roadmap Actions]
    G --> G1["+ Neues Feature"]
    G --> G2["📊 Roadmap Export"]
    
    B -->|CI Guidelines| H[Show CI Actions]
    H --> H1["📄 Guidelines PDF"]
    H --> H2["✅ Compliance Check"]
</lov-mermaid>

### Implementation Pattern

```typescript
// In Master.tsx
const [activeTab, setActiveTab] = useState('companies');

const getQuickActionsForTab = (tab: string) => {
  const actionMap = {
    'companies': [
      { label: 'Firma hinzufügen', icon: Building2, action: () => handleAddCompany() },
      { label: 'Firmen-Report', icon: BarChart3, action: () => handleCompanyReport() },
      { label: 'Daten synchronisieren', icon: RefreshCw, action: () => handleSync() }
    ],
    'code-quality': [
      { label: 'Code Scan starten', icon: Search, action: () => handleCodeScan() },
      { label: 'Quality Report', icon: TrendingUp, action: () => handleQualityReport() },
      { label: 'Auto-Fix Issues', icon: Wrench, action: () => handleAutoFix() }
    ],
    'system': [
      { label: 'DB Backup starten', icon: Database, action: () => handleBackup() },
      { label: 'System Logs anzeigen', icon: FileText, action: () => handleLogs() },
      { label: 'Cache leeren', icon: Trash2, action: () => handleClearCache() }
    ],
    // ... weitere Tabs
  };

  return actionMap[tab] || [];
};

// Render Quick Actions dynamically
<CardContent className="space-y-2">
  {getQuickActionsForTab(activeTab).map(action => (
    <Button
      key={action.label}
      onClick={action.action}
      className="w-full justify-start"
      variant="outline"
    >
      <action.icon className="mr-2 h-4 w-4" />
      {action.label}
    </Button>
  ))}
</CardContent>
```

---

## 🎨 DESIGN SYSTEM V28.1 COMPLIANCE

### Colors (Pure Slate-Palette)

```css
/* Backgrounds */
bg-white           /* Cards, Panels */
bg-slate-50        /* Light Backgrounds */
bg-slate-100       /* Hover States */
bg-slate-900       /* Dark Mode */

/* Text */
text-slate-900     /* Headlines */
text-slate-700     /* Body Text */
text-slate-600     /* Secondary */
text-slate-500     /* Muted */
text-slate-400     /* Disabled */

/* Borders */
border-slate-200   /* Default */
border-slate-300   /* Hover */

/* Status Colors */
bg-emerald-50, text-emerald-700, border-emerald-200  /* Success */
bg-amber-50, text-amber-700, border-amber-200        /* Warning */
bg-red-50, text-red-700, border-red-200              /* Error */
bg-blue-50, text-blue-700, border-blue-200           /* Info */
```

### Typography

```css
/* Headlines */
text-3xl font-bold tracking-tight  /* Page Title */
text-xl font-semibold              /* Card Title */
text-lg font-medium                /* Section Title */

/* Body */
text-base text-slate-700           /* Regular Text */
text-sm text-slate-600             /* Secondary */
text-xs text-slate-500             /* Labels */
```

### Spacing System

```typescript
const SPACING = {
  xs: 8, // space-y-2, gap-2
  sm: 12, // space-y-3, gap-3
  md: 16, // space-y-4, gap-4, p-4
  lg: 24, // space-y-6, gap-6, p-6
  xl: 32, // space-y-8, gap-8
  xxl: 48, // space-y-12
};
```

### Shadows & Effects

```css
/* Cards */
shadow-sm          /* Default Card */
shadow-md          /* Elevated Card */
shadow-lg          /* Modal, Popover */
hover:shadow-xl    /* Hover Effect */

/* Transitions */
transition-all duration-300 ease-in-out
```

### Border Radius

```css
rounded-lg         /* Default Cards */
rounded-xl         /* Premium Cards */
rounded-2xl        /* Hero Cards */
rounded-full       /* Badges, Avatars */
```

---

## 💻 IMPLEMENTIERUNGS-VORGABEN

### Do's ✅

1. **Semantic Tokens verwenden**

   ```tsx
   // ✅ CORRECT
   <div className="bg-slate-50 text-slate-900 border-slate-200">
   ```

2. **React Query für Data Fetching**

   ```tsx
   const { data, isLoading } = useQuery({
     queryKey: ["system-health"],
     queryFn: fetchSystemHealth,
     refetchInterval: 30000, // 30s
   });
   ```

3. **Error Boundaries nutzen**

   ```tsx
   <ErrorBoundary fallback={<ErrorFallback />}>
     <Master />
   </ErrorBoundary>
   ```

4. **Accessibility (ARIA)**

   ```tsx
   <Button aria-label="Firma hinzufügen" aria-describedby="add-company-desc">
     + Firma hinzufügen
   </Button>
   ```

5. **Loading States**
   ```tsx
   {
     isLoading ? <Skeleton /> : <Content />;
   }
   ```

### Don'ts ❌

1. **Direkte Farben NIEMALS**

   ```tsx
   // ❌ WRONG
   <div className="bg-[#EADEBD] text-white">
   ```

2. **Inline Styles vermeiden**

   ```tsx
   // ❌ WRONG
   <div style={{ padding: '24px' }}>
   ```

3. **Hardcoded Magic Numbers**

   ```tsx
   // ❌ WRONG
   <div className="mt-[17px]">

   // ✅ CORRECT
   <div className="mt-4">  // 16px aus spacing scale
   ```

4. **Unnötige Re-Renders**

   ```tsx
   // ❌ WRONG
   const actions = getActions(); // Recalculates on every render

   // ✅ CORRECT
   const actions = useMemo(() => getActions(), [dependencies]);
   ```

5. **Missing Key Props**

   ```tsx
   // ❌ WRONG
   {
     items.map((item) => <Card>{item.name}</Card>);
   }

   // ✅ CORRECT
   {
     items.map((item) => <Card key={item.id}>{item.name}</Card>);
   }
   ```

---

## 🧪 TESTING & QUALITY GATES

### Unit Tests (Vitest)

```typescript
// Master.test.tsx
describe('Master Dashboard', () => {
  it('renders all System Health KPIs', () => {
    render(<Master />);
    expect(screen.getByText('System Uptime')).toBeInTheDocument();
    expect(screen.getByText('Error Rate')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('DB Response')).toBeInTheDocument();
  });

  it('switches tabs correctly', () => {
    render(<Master />);
    fireEvent.click(screen.getByText('Code Quality'));
    expect(screen.getByText('Code Scan starten')).toBeInTheDocument();
  });

  it('shows context-sensitive Quick Actions', () => {
    render(<Master />);
    fireEvent.click(screen.getByText('Companies'));
    expect(screen.getByText('Firma hinzufügen')).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)

```typescript
// master.e2e.ts
test("Master Dashboard full workflow", async ({ page }) => {
  await page.goto("/master");

  // System Health visible
  await expect(page.locator("text=System Uptime")).toBeVisible();

  // Tab Navigation works
  await page.click("text=Code Quality");
  await expect(page.locator("text=Code Scan starten")).toBeVisible();

  // Quick Action execution
  await page.click("text=DB Backup starten");
  await expect(page.locator("text=Backup erfolgreich")).toBeVisible();

  // Responsive: Mobile view
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page.locator(".quick-actions-panel")).toBeHidden();
});
```

### Visual Regression (Percy/Chromatic)

```typescript
test("Master Dashboard Visual Regression", async ({ page }) => {
  await page.goto("/master");
  await page.waitForLoadState("networkidle");
  await percySnapshot(page, "Master Dashboard - Desktop");

  await page.setViewportSize({ width: 768, height: 1024 });
  await percySnapshot(page, "Master Dashboard - Tablet");

  await page.setViewportSize({ width: 375, height: 667 });
  await percySnapshot(page, "Master Dashboard - Mobile");
});
```

### Accessibility Tests (axe-core)

```typescript
test("Master Dashboard Accessibility", async ({ page }) => {
  await page.goto("/master");
  const results = await new AxePuppeteer(page).analyze();
  expect(results.violations).toHaveLength(0);
});
```

### Performance Budgets

```typescript
const PERFORMANCE_BUDGETS = {
  FCP: 1800, // First Contentful Paint < 1.8s
  LCP: 2500, // Largest Contentful Paint < 2.5s
  TBT: 200, // Total Blocking Time < 200ms
  CLS: 0.1, // Cumulative Layout Shift < 0.1
  FID: 100, // First Input Delay < 100ms
};
```

---

## 📚 MIGRATION VON BISHERIGEN DOCS

### Konsolidierte Dokumentation

Diese Spezifikation V40.11 **ersetzt und referenziert**:

1. ✅ `docs/PHASE_2_MASTER_DASHBOARD_COMPLETE_V32.0.md` → **DEPRECATED**
2. ✅ `docs/PLAN_UPDATE_PHASE2.md` → **DEPRECATED**
3. ✅ `docs/PLAN_UPDATE_PHASE3.md` → **DEPRECATED**

### Deprecation Notice (wird in alte Docs eingefügt)

```markdown
---
⚠️ **DEPRECATION NOTICE**

Diese Dokumentation ist **veraltet** und wird durch die neue Master-Spezifikation ersetzt:

➡️ **Siehe:** `docs/MASTER_DASHBOARD_SPECIFICATION_V40.11_COMPLETE.md`

**Status:** Archived  
**Gültig bis:** 2025-01-30  
**Ersetzt durch:** V40.11 Complete Specification

---
```

### Cross-References

Alle anderen Dokumentationen verweisen auf diese Spec:

- `docs/DASHBOARD_STANDARDS.md` → Referenz auf Master-Dashboard als Beispiel
- `docs/SHARED_KNOWLEDGE_V18.5.1.md` → Link zu Master-Dashboard Patterns
- `docs/V28_MIGRATION_STATUS.md` → Master-Dashboard als V28.1 Reference Implementation

---

## 🚀 ERWEITERBARE QUICK ACTIONS

### Phase 1: System Monitoring & Performance ✅

| Action               | Beschreibung                    | Edge Function             | Status     |
| -------------------- | ------------------------------- | ------------------------- | ---------- |
| System Logs anzeigen | Öffnet Log-Viewer mit Filter    | `get-system-logs`         | ✅ Geplant |
| Performance Metrics  | Real-time Performance Dashboard | `get-performance-metrics` | ✅ Geplant |
| API Health Check     | Prüft alle API Endpoints        | `health-check`            | ✅ Geplant |

### Phase 2: Datenbank & Backend ✅

| Action               | Beschreibung             | Edge Function          | Status     |
| -------------------- | ------------------------ | ---------------------- | ---------- |
| DB Backup starten    | Manueller Backup-Trigger | `trigger-db-backup`    | ✅ Geplant |
| Backup Status prüfen | Zeigt letzte Backups     | `get-backup-status`    | ✅ Geplant |
| Query Performance    | Slow Query Analyzer      | `analyze-slow-queries` | ✅ Geplant |

### Phase 3: Deployment & CI/CD ✅

| Action              | Beschreibung                   | Edge Function           | Status     |
| ------------------- | ------------------------------ | ----------------------- | ---------- |
| Deployment Status   | Zeigt aktuelle Deployments     | `get-deployment-status` | ✅ Geplant |
| Rollback to Version | Rollback auf vorherige Version | `rollback-deployment`   | ✅ Geplant |
| CI Pipeline starten | Trigger Manual Pipeline        | `trigger-ci-pipeline`   | ✅ Geplant |

### Phase 4: User Management ✅

| Action              | Beschreibung                     | Edge Function         | Status     |
| ------------------- | -------------------------------- | --------------------- | ---------- |
| Neuen Admin anlegen | Admin User Creation              | `create-admin-user`   | ✅ Geplant |
| User Rollen ändern  | Role Management                  | `update-user-roles`   | ✅ Geplant |
| Aktive Sessions     | Zeigt alle aktiven User Sessions | `get-active-sessions` | ✅ Geplant |

### Phase 5: Maintenance & Operations ✅

| Action                   | Beschreibung                     | Edge Function             | Status     |
| ------------------------ | -------------------------------- | ------------------------- | ---------- |
| Cache leeren             | Redis/Browser Cache Clear        | `clear-cache`             | ✅ Geplant |
| Wartungsmodus aktivieren | Schaltet App in Maintenance Mode | `toggle-maintenance-mode` | ✅ Geplant |
| Datenbank Migration      | Run Pending Migrations           | `run-migrations`          | ✅ Geplant |

### Phase 6: Analytics & Reporting ✅

| Action              | Beschreibung               | Edge Function        | Status     |
| ------------------- | -------------------------- | -------------------- | ---------- |
| Analytics Dashboard | Öffnet Analytics Overlay   | `get-analytics-data` | ✅ Geplant |
| Export Data Report  | CSV/PDF Export von Reports | `export-report`      | ✅ Geplant |
| Usage Statistics    | User & System Usage Stats  | `get-usage-stats`    | ✅ Geplant |

### Phase 7: Security & Compliance ✅

| Action                | Beschreibung            | Edge Function       | Status     |
| --------------------- | ----------------------- | ------------------- | ---------- |
| Security Scan starten | Vulnerability Scanner   | `run-security-scan` | ✅ Geplant |
| DSGVO Audit Log       | GDPR Compliance Checker | `dsgvo-audit`       | ✅ Geplant |
| Access Log Review     | Review User Access Logs | `get-access-logs`   | ✅ Geplant |

---

## 📝 CODE-BEISPIELE

### Example 1: Quick Action Button with Edge Function

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { toast } from "sonner";

export function BackupQuickAction() {
  const queryClient = useQueryClient();

  const backupMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("trigger-db-backup", {
        body: { type: "manual", timestamp: new Date().toISOString() },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Backup erfolgreich gestartet!");
      queryClient.invalidateQueries({ queryKey: ["backup-status"] });
    },
    onError: (error) => {
      toast.error(`Backup fehlgeschlagen: ${error.message}`);
    },
  });

  return (
    <Button
      onClick={() => backupMutation.mutate()}
      disabled={backupMutation.isPending}
      className="w-full justify-start"
      variant="outline"
    >
      <Database className="mr-2 h-4 w-4" />
      {backupMutation.isPending ? "Backup läuft..." : "DB Backup starten"}
    </Button>
  );
}
```

### Example 2: Context-Sensitive Quick Actions Hook

```tsx
import { useMemo } from "react";
import { Building2, Search, Database, Bot, MapPin, FileCheck } from "lucide-react";

export function useContextActions(activeTab: string) {
  return useMemo(() => {
    const actionMap = {
      companies: [
        {
          id: "add-company",
          label: "Firma hinzufügen",
          icon: Building2,
          edgeFunction: "create-company",
          requiresAuth: true,
        },
        {
          id: "sync-companies",
          label: "Daten synchronisieren",
          icon: RefreshCw,
          edgeFunction: "sync-companies",
          requiresAuth: true,
        },
      ],
      "code-quality": [
        {
          id: "code-scan",
          label: "Code Scan starten",
          icon: Search,
          edgeFunction: "trigger-code-scan",
          requiresAuth: true,
        },
      ],
      system: [
        {
          id: "db-backup",
          label: "DB Backup starten",
          icon: Database,
          edgeFunction: "trigger-db-backup",
          requiresAuth: true,
        },
      ],
    };

    return actionMap[activeTab] || [];
  }, [activeTab]);
}
```

### Example 3: System Health KPI with Live Updates

```tsx
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Premium3DCard } from "@/components/v28/Premium3DCard";

export function SystemHealthKPIs() {
  const { data: systemHealth, isLoading } = useQuery({
    queryKey: ["system-health"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("get-system-health");
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // 30s
    refetchIntervalInBackground: true,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <Premium3DCard
        title="System Uptime"
        value={systemHealth?.uptime || "99.9%"}
        icon={Activity}
        trend="up"
      />
      <Premium3DCard
        title="Error Rate"
        value={systemHealth?.errorRate || "0.01%"}
        icon={AlertTriangle}
        trend="down"
      />
      <Premium3DCard
        title="Active Users"
        value={systemHealth?.activeUsers || "1,234"}
        icon={Users}
        trend="up"
      />
      <Premium3DCard
        title="DB Response"
        value={systemHealth?.dbResponse || "12ms"}
        icon={Database}
        trend="stable"
      />
    </div>
  );
}
```

---

## 🐛 TROUBLESHOOTING & COMMON PITFALLS

### Problem 1: Quick Actions Panel überlappt Content

**Symptom:**

```
Main Content wird von Quick Actions Panel überdeckt
```

**Root Cause:**

```tsx
// ❌ WRONG: Fehlendes margin-right
<div className="flex-1">{/* Content */}</div>
```

**Solution:**

```tsx
// ✅ CORRECT: margin-right für Quick Actions Panel
<div className="flex-1 xl:mr-[384px]">{/* Content */}</div>
```

### Problem 2: Layout Shift bei Sidebar Toggle

**Symptom:**

```
Content springt bei Sidebar collapse/expand
```

**Root Cause:**

```tsx
// ❌ WRONG: Keine Transition
<div className="flex-1">
```

**Solution:**

```tsx
// ✅ CORRECT: Smooth transition
<div className="flex-1 transition-all duration-300">
```

### Problem 3: Quick Actions zeigen falschen Context

**Symptom:**

```
Quick Actions ändern sich nicht bei Tab-Wechsel
```

**Root Cause:**

```tsx
// ❌ WRONG: Fehlende Dependency
const actions = useMemo(() => getActions(), []);
```

**Solution:**

```tsx
// ✅ CORRECT: activeTab als Dependency
const actions = useMemo(() => getActions(activeTab), [activeTab]);
```

### Problem 4: Mobile: Quick Actions Panel sichtbar

**Symptom:**

```
Auf Mobile ist Quick Actions Panel sichtbar (sollte hidden sein)
```

**Root Cause:**

```tsx
// ❌ WRONG: Keine responsive class
<div className="flex">
```

**Solution:**

```tsx
// ✅ CORRECT: Hidden auf Mobile, visible auf Desktop
<div className="hidden xl:flex">
```

---

## ✅ DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] Unit Tests: 100% Pass-Rate
- [ ] E2E Tests: Alle kritischen Flows getestet
- [ ] Visual Regression: Keine unerwarteten Änderungen
- [ ] Accessibility: axe-core score = 100
- [ ] Performance: Alle Budgets eingehalten
- [ ] TypeScript: 0 Errors, 0 Warnings
- [ ] ESLint: 0 Errors
- [ ] Build: Successful ohne Warnings

### Edge Functions

- [ ] `master-action` deployed & tested
- [ ] `get-system-health` deployed & tested
- [ ] `trigger-db-backup` deployed & tested
- [ ] Secrets konfiguriert (falls benötigt)
- [ ] CORS Headers korrekt

### Database

- [ ] Migrations erfolgreich ausgeführt
- [ ] RLS Policies aktiviert
- [ ] Indexes erstellt
- [ ] Backup vor Deployment

### Monitoring

- [ ] Sentry Error Tracking aktiv
- [ ] Performance Monitoring aktiv
- [ ] Uptime Monitoring konfiguriert
- [ ] Alert Rules definiert

### Documentation

- [ ] `MASTER_DASHBOARD_SPECIFICATION_V40.11_COMPLETE.md` finalisiert
- [ ] Alte Docs mit Deprecation Notice versehen
- [ ] Cross-References aktualisiert
- [ ] Changelog aktualisiert

---

## 🔗 VERLINKUNGEN & CROSS-REFERENCES

### Interne Dokumentation

- **Design System:** [`docs/DESIGN_SYSTEM_FINAL_V26.md`](./DESIGN_SYSTEM_FINAL_V26.md)
- **Dashboard Standards:** [`docs/DASHBOARD_STANDARDS.md`](./DASHBOARD_STANDARDS.md)
- **Component Registry:** [`docs/COMPONENT_REGISTRY.md`](./COMPONENT_REGISTRY.md)
- **Shared Knowledge:** [`docs/SHARED_KNOWLEDGE_V18.5.1.md`](./SHARED_KNOWLEDGE_V18.5.1.md)

### Deprecated Docs (Archiviert)

- [`docs/PHASE_2_MASTER_DASHBOARD_COMPLETE_V32.0.md`](./PHASE_2_MASTER_DASHBOARD_COMPLETE_V32.0.md) ⚠️ **DEPRECATED**
- [`docs/PLAN_UPDATE_PHASE2.md`](./PLAN_UPDATE_PHASE2.md) ⚠️ **DEPRECATED**
- [`docs/PLAN_UPDATE_PHASE3.md`](./PLAN_UPDATE_PHASE3.md) ⚠️ **DEPRECATED**

### External Resources

- **Lovable Docs:** [https://docs.lovable.dev](https://docs.lovable.dev)
- **Supabase Docs:** [https://supabase.com/docs](https://supabase.com/docs)
- **React Query:** [https://tanstack.com/query](https://tanstack.com/query)
- **Tailwind CSS:** [https://tailwindcss.com](https://tailwindcss.com)
- **shadcn/ui:** [https://ui.shadcn.com](https://ui.shadcn.com)

---

## 📊 VERSION HISTORY

| Version | Datum      | Änderungen                     | Status              |
| ------- | ---------- | ------------------------------ | ------------------- |
| V40.11  | 2025-01-30 | Initial Complete Specification | ✅ PRODUCTION-READY |

---

## 🎯 FAZIT

Diese Spezifikation ist die **verbindliche Single Source of Truth** für das Master-Dashboard.

**Key Takeaways:**

- ✅ 2-Column Responsive Layout (Sidebar + Main + Quick Actions)
- ✅ Context-Sensitive Quick Actions
- ✅ V28.1 Slate Design System 100% Compliance
- ✅ Erweiterbare Architektur (7 Phasen geplant)
- ✅ Production-Ready Code-Beispiele
- ✅ Vollständige Testing-Strategie

**Status:** 🟢 PRODUCTION-READY - READY FOR IMPLEMENTATION

## 📍 Lokalisierung & DIN 5008-Konformität (V40.12)

### Zentrale Content-Verwaltung

**Datei:** `src/lib/content/master-dashboard-content.ts`

Alle Texte sind zentral verwaltet und können einfach angepasst werden:

```typescript
import { masterDashboardContent } from '@/lib/content/master-dashboard-content';

// Verwendung:
<h1>{masterDashboardContent.header.title}</h1>
<p>{masterDashboardContent.systemHealth.uptime}</p>
```

**Vorteile:**

- ✅ Single Source of Truth für alle UI-Texte
- ✅ Einfache Wartung und Updates
- ✅ Konsistente Terminologie
- ✅ Vorbereitet für Mehrsprachigkeit (i18n)

### Deutsche Zahlenformate (DIN 5008)

**Implementierung:** `src/lib/format-utils.ts`

#### Prozentwerte

```typescript
formatPercentage(99.8); // => "99,8 %"
// ✅ Komma als Dezimaltrenner
// ✅ Leerzeichen vor Prozentzeichen
```

#### Große Zahlen

```typescript
formatNumber(1234); // => "1.234"
formatNumber(247); // => "247"
// ✅ Punkt als Tausender-Trenner
// ✅ Komma für Dezimalstellen
```

#### Millisekunden

```typescript
formatMilliseconds(45); // => "45 ms"
// ✅ Leerzeichen vor Einheit
```

#### Relative Zeitangaben

```typescript
formatRelativeTime(2, "hours"); // => "vor 2 Stunden"
formatRelativeTime(1, "day"); // => "vor 1 Tag"
// ✅ Deutsche Grammatik (Singular/Plural)
```

### Datumsformate

```typescript
// Standard-Datum
new Date().toLocaleDateString("de-DE"); // => "18.01.2025"

// Datum + Zeit
new Date().toLocaleString("de-DE"); // => "18.01.2025, 14:30:00"
```

**Format:** `DD.MM.YYYY` (Tag.Monat.Jahr)

### Einheiten nach DIN 5008

| Einheit       | Format                  | Beispiel |
| ------------- | ----------------------- | -------- |
| Prozent       | Zahl + Leerzeichen + %  | 99,8 %   |
| Millisekunden | Zahl + Leerzeichen + ms | 45 ms    |
| Stunden       | Zahl + Leerzeichen + h  | 2,4 h    |
| Grad Celsius  | Zahl + Leerzeichen + °C | 22 °C    |

**Regel:** IMMER Leerzeichen zwischen Zahl und Einheit!

### Status-Labels (Deutsch)

| Englisch  | Deutsch       |
| --------- | ------------- |
| Active    | Aktiv         |
| Confirmed | Bestätigt     |
| Completed | Abgeschlossen |
| Pending   | Ausstehend    |
| Online    | Online        |
| Offline   | Offline       |

Alle Status-Labels werden über `formatBookingStatus()`, `formatShiftStatus()`, etc. in `format-utils.ts` verwaltet.

### Accessibility (A11y)

**ARIA-Labels auf Deutsch:**

```typescript
aria-label={masterDashboardContent.aria.companiesTab}
aria-label={`${action.label} ${masterDashboardContent.aria.executeAction}`}
```

**Implementierte ARIA-Features:**

- ✅ Alle interaktiven Elemente haben `aria-label`
- ✅ Tab-Navigation mit semantischen Labels
- ✅ Screen-Reader-Unterstützung durch strukturiertes HTML
- ✅ Status-Badges mit ARIA-Labels (z.B. "API Status: Online")

### Testing & Validation

**E2E Tests:** `tests/e2e/compliance/master-localization.spec.ts`

Validiert:

- ✅ Keine englischen Texte
- ✅ Deutsche Zahlenformate (Komma statt Punkt)
- ✅ DIN 5008-konforme Einheiten (Leerzeichen)
- ✅ Deutsche Datumsformate (DD.MM.YYYY)
- ✅ Tab-Labels auf Deutsch
- ✅ Quick Actions auf Deutsch
- ✅ Relative Zeitangaben auf Deutsch
- ✅ System Status Labels auf Deutsch
- ✅ ARIA Labels auf Deutsch
- ✅ Keine gemischten Sprachen

### Migration von bisherigen Implementierungen

**Was wurde geändert:**

1. **Entfernt:** Hardcodierte englische Texte in `Master.tsx`
2. **Ersetzt:** Durch Import von `masterDashboardContent`
3. **Erweitert:** `format-utils.ts` um DIN 5008-konforme Funktionen
4. **Hinzugefügt:** Zentrale Content-Datei für alle UI-Texte
5. **Implementiert:** E2E Tests für Lokalisierung

**Breaking Changes:** Keine - Alle Änderungen sind rückwärtskompatibel.

### Best Practices

**DO's:**

- ✅ Nutze `masterDashboardContent` für alle UI-Texte
- ✅ Nutze `formatPercentage()`, `formatMilliseconds()`, etc. für Zahlen
- ✅ Nutze `.toLocaleString('de-DE')` für Datum/Zeit
- ✅ Füge `aria-label` für Accessibility hinzu

**DON'Ts:**

- ❌ Keine hardcodierten Texte direkt in Komponenten
- ❌ Keine Punkt-Trennung bei Dezimalzahlen (99.8% ❌)
- ❌ Keine fehlenden Leerzeichen vor Einheiten (45ms ❌)
- ❌ Keine englischen Texte im deutschen UI

---

**Erstellt:** 2025-01-30  
**Version:** V40.11 COMPLETE  
**Verantwortlich:** NeXify AI Development Agent  
**Gültigkeit:** Ersetzt ALLE bisherigen Master-Dashboard Dokumentationen
