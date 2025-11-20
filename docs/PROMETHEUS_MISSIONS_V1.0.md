# PROMETHEUS OPERATIONS PLAN V1.0
**Status:** 🚀 ACTIVE  
**Datum:** 2025-01-31  
**Mission:** Hybride Migration zu perfekter HYPERION-Architektur

---

## 📊 STRATEGIC SITUATION (Verified Reality)

### ✅ GREEN ZONE (Foundation Complete)
| System | Status | Coverage |
|--------|--------|----------|
| API Layer | ✅ 100% | 7/7 modules (bookings, drivers, vehicles, customers, partners, shifts, companies) |
| Global State | ✅ 100% | 4/4 stores (auth, subscription, layout, bulk-selection) |
| Documentation | ✅ LIVE | Master Index, Dependency Graphs, Self-Healing, Breaking Changes |
| Design System | ⚡ 40% | V28 Components partial, Storybook configured |

### ⚠️ YELLOW ZONE (Transformation Active)
- **TanStack Query Migration:** 37/~150 components (25%)
- **Custom Hooks:** ~80 domain-specific hooks exist
- **API Abstraction:** High-level hooks (useBookings, useCustomers) operational

### 🔴 RED ZONE (Legacy Code)
**Direct Supabase Calls Found:**
1. `DriverTracking.tsx` - GPS position inserts
2. `ChatWindow.tsx` - Message inserts
3. `GlobalErrorBoundary.tsx` - Error logging
4. `DocumentUploadForm.tsx` - Document metadata
5. `ShiftForm.tsx` - Shift creation
6. `TerminationTool.tsx` - Termination logs
7. `PartnerRequestDialog.tsx` - Partner requests
8. `V28CookieConsent.tsx` - Cookie consent storage

**Impact:** ~8 critical components with direct DB access (not 113!)

---

## 🎯 MISSION I: "ATLAS" (Atomic Design System)

### Objective
Create complete atomic UI component library to accelerate Mission II.

### Phase 1.1: Core UI Atoms (First 10)
```yaml
# UI-ATOMS-SPEC-V1.0.yaml

atoms:
  - name: V28Button
    status: ✅ EXISTS
    path: src/components/design-system/V28Button.tsx
    variants: [primary, secondary, outline, ghost, link]
    states: [default, hover, active, disabled, loading]
    
  - name: V28Input
    status: 🔴 MISSING
    path: src/lib/components/V28Input.tsx
    props:
      - name: placeholder
        type: string
        required: false
      - name: error
        type: string
        required: false
      - name: label
        type: string
        required: false
    states: [default, focus, error, disabled]
    design: "Tailwind slate palette, 1px borders"
    
  - name: V28Card
    status: 🔴 MISSING
    path: src/lib/components/V28Card.tsx
    variants: [default, hover, selected]
    props:
      - name: title
        type: string
      - name: description
        type: string
      - name: icon
        type: LucideIcon
      - name: onClick
        type: () => void
    
  - name: V28Badge
    status: 🔴 MISSING
    path: src/lib/components/V28Badge.tsx
    variants: [success, warning, error, info, neutral]
    props:
      - name: label
        type: string
        required: true
      - name: variant
        type: BadgeVariant
        required: true
    
  - name: V28Select
    status: 🔴 MISSING
    path: src/lib/components/V28Select.tsx
    props:
      - name: options
        type: Array<{label: string, value: string}>
      - name: value
        type: string
      - name: onChange
        type: (value: string) => void
      - name: placeholder
        type: string
      - name: error
        type: string
    
  - name: V28Dialog
    status: 🔴 MISSING (Wrapper for Radix)
    path: src/lib/components/V28Dialog.tsx
    variants: [small, medium, large, fullscreen]
    props:
      - name: open
        type: boolean
      - name: onOpenChange
        type: (open: boolean) => void
      - name: title
        type: string
      - name: description
        type: string
    
  - name: V28Table
    status: 🔴 MISSING
    path: src/lib/components/V28Table.tsx
    props:
      - name: columns
        type: Column[]
      - name: data
        type: any[]
      - name: onRowClick
        type: (row: any) => void
      - name: loading
        type: boolean
    features:
      - sorting
      - filtering
      - pagination
      - bulk-selection
    
  - name: V28StatusIndicator
    status: ✅ EXISTS
    path: src/components/shared/StatusIndicator.tsx
    variants: [success, warning, error, info, neutral]
    
  - name: V28EmptyState
    status: ✅ EXISTS
    path: src/components/shared/EmptyState.tsx
    
  - name: V28SearchBar
    status: 🔴 MISSING
    path: src/lib/components/V28SearchBar.tsx
    props:
      - name: value
        type: string
      - name: onChange
        type: (value: string) => void
      - name: placeholder
        type: string
      - name: onClear
        type: () => void
```

### Deliverables
- [ ] 5 neue UI-Atome erstellt (V28Input, V28Card, V28Badge, V28Select, V28SearchBar)
- [ ] 5 Storybook Stories geschrieben
- [ ] Design-System Dokumentation aktualisiert

---

## 🎯 MISSION II: "STRANGLER FIG 2.0" (Cluster Migration)

### Cluster Analysis (P0 - Critical Components)

#### Cluster 1: GPS/Tracking (P0)
**Components:** 1  
**Pattern:** Real-time position updates  
**Migration Strategy:** Create `useVehicleTracking` mutation hook

```typescript
// Target Architecture
import { useVehicleTracking } from '@/hooks/use-vehicle-tracking';

const { updatePosition } = useVehicleTracking();

await updatePosition({
  vehicle_id: currentVehicleId,
  latitude,
  longitude,
  speed,
  heading,
});
```

**Files:**
- `src/pages/DriverTracking.tsx` (Line 85: direct supabase.from insert)

---

#### Cluster 2: Chat/Communication (P0)
**Components:** 1  
**Pattern:** Message creation & file uploads  
**Migration Strategy:** Create `useChatMessages` hook with mutations

```typescript
// Target Architecture
import { useChatMessages } from '@/hooks/use-chat-messages';

const { sendMessage, uploadFile } = useChatMessages(conversationId);

await sendMessage({ text: messageText });
await uploadFile({ file: uploadedFile });
```

**Files:**
- `src/components/chat/ChatWindow.tsx` (Lines 193, 242: direct inserts)

---

#### Cluster 3: Error Logging (P1)
**Components:** 1  
**Pattern:** Error tracking & AI learning  
**Migration Strategy:** Create `useErrorLogging` hook

```typescript
// Target Architecture
import { useErrorLogging } from '@/hooks/use-error-logging';

const { logError, logLearning } = useErrorLogging();

await logError({
  error_message: error.message,
  error_category: 'react_error',
  severity: 'high',
});
```

**Files:**
- `src/components/debug/GlobalErrorBoundary.tsx` (Lines 57, 75)

---

#### Cluster 4: Form Submissions (P2)
**Components:** 5  
**Pattern:** Document/Shift/Partner/Cookie data creation  
**Migration Strategy:** Integrate with existing API layer mutations

**Files:**
- `src/components/forms/DocumentUploadForm.tsx` (Line 152)
- `src/components/forms/ShiftForm.tsx` (Line 187)
- `src/components/master/TerminationTool.tsx` (Line 190)
- `src/components/partner/PartnerRequestDialog.tsx` (Line 92)
- `src/components/shared/V28CookieConsent.tsx` (Line 99)

---

### Migration Execution Protocol

**Per Component:**
1. ✅ Identify direct `supabase.from()` call
2. ✅ Create/use API layer function in `src/lib/api/`
3. ✅ Create TanStack Query mutation hook in `src/hooks/`
4. ✅ Replace component code with hook usage
5. ✅ Test mutation success/error handling
6. ✅ Update component registry
7. ✅ Delete old direct DB access code

**Priority Sequence:**
1. **Week 1:** Cluster 1 (GPS Tracking) - CRITICAL for live operations
2. **Week 2:** Cluster 2 (Chat) - HIGH user impact
3. **Week 3:** Cluster 3 (Error Logging) - System health
4. **Week 4:** Cluster 4 (Form Submissions) - LOW risk refactor

---

## 🎯 MISSION III: "CHRONICLE" (Living Documentation)

### Objective
Auto-update documentation after every code change.

### Architecture

#### Edge Function: `auto-doc-updater`
```typescript
// supabase/functions/auto-doc-updater/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { commitHash, filesChanged, changeType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    console.log('[Auto-Doc] Processing commit:', commitHash);
    console.log('[Auto-Doc] Files changed:', filesChanged.length);
    console.log('[Auto-Doc] Change type:', changeType);

    // Analyze changes with Gemini 2.5 Flash
    const analysisPrompt = `
Analyze this code change and update documentation:

**Commit:** ${commitHash}
**Files Changed:** ${filesChanged.join(', ')}
**Change Type:** ${changeType}

Tasks:
1. Update HYPERION_PHASE_2_STATUS.md if TanStack Query hooks changed
2. Update DEPENDENCY_GRAPHS_V1.0.md if new API modules added
3. Update COMPONENT_REGISTRY.md if components added/removed
4. Generate changelog entry (max 100 chars)

Return JSON:
{
  "updates": [
    {
      "file": "docs/HYPERION_PHASE_2_STATUS.md",
      "section": "Migration Progress",
      "newContent": "..."
    }
  ],
  "changelog": "feat: Added useVehicleTracking hook (P0 migration)"
}
`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Documentation Automation Agent: Analyze code changes and update docs." },
          { role: "user", content: analysisPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) throw new Error(`AI gateway error: ${response.status}`);

    const aiData = await response.json();
    const result = JSON.parse(aiData.choices[0].message.content);

    console.log('[Auto-Doc] AI Analysis:', result);

    return new Response(
      JSON.stringify({
        success: true,
        updates: result.updates,
        changelog: result.changelog,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Auto-Doc] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
```

### Integration Points

**GitHub Action Trigger:**
```yaml
# .github/workflows/auto-doc-on-push.yml
name: Auto-Update Docs

on:
  push:
    branches: [main]
    paths:
      - 'src/**/*.tsx'
      - 'src/**/*.ts'

jobs:
  update-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Trigger Doc Update
        run: |
          curl -X POST "${{ secrets.SUPABASE_URL }}/functions/v1/auto-doc-updater" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{
              "commitHash": "${{ github.sha }}",
              "filesChanged": ["${{ github.event.commits[0].modified }}"],
              "changeType": "code_update"
            }'
```

**Manual Trigger (Development):**
```typescript
// src/hooks/use-doc-updater.ts
import { supabase } from '@/integrations/supabase/client';

export function useDocUpdater() {
  const triggerUpdate = async (filesChanged: string[]) => {
    const { data, error } = await supabase.functions.invoke('auto-doc-updater', {
      body: {
        commitHash: 'manual-trigger',
        filesChanged,
        changeType: 'manual'
      }
    });
    
    if (error) throw error;
    return data;
  };
  
  return { triggerUpdate };
}
```

---

## 📈 METRICS & TRACKING

### Mission I (ATLAS) Progress
- [ ] 0/5 new atoms created
- [ ] 0/5 Storybook stories written
- [ ] 0% Design System completion

### Mission II (STRANGLER FIG) Progress
| Cluster | Priority | Components | Status | ETA |
|---------|----------|------------|--------|-----|
| GPS Tracking | P0 | 1 | 🔴 TODO | Week 1 |
| Chat | P0 | 1 | 🔴 TODO | Week 2 |
| Error Logging | P1 | 1 | 🔴 TODO | Week 3 |
| Form Submissions | P2 | 5 | 🔴 TODO | Week 4 |

**Total:** 8 components to migrate (not 113!)

### Mission III (CHRONICLE) Progress
- [ ] Edge Function created
- [ ] GitHub Action configured
- [ ] Manual trigger hook implemented
- [ ] First automated doc update successful

---

## 🎯 SUCCESS CRITERIA

### Week 1 Target
- ✅ Mission I: 5 UI atoms created + Storybook stories
- ✅ Mission II: GPS Tracking cluster migrated (1 component)
- ✅ Mission III: Edge Function operational

### Week 2 Target
- ✅ Mission II: Chat cluster migrated (1 component)
- ✅ Mission III: First automated doc update from GitHub Action

### Week 3 Target
- ✅ Mission II: Error Logging migrated (1 component)
- ✅ Mission I: 5 additional UI atoms

### Week 4 Target
- ✅ Mission II: All Form Submissions migrated (5 components)
- ✅ 100% TanStack Query adoption for stateful operations
- ✅ Zero direct Supabase calls in components

---

## ⚠️ CRITICAL NOTES

1. **Reality Check:** Original "113 ROT components" was overestimate. Actual count: **8 components with direct DB access**.

2. **Most pages already use abstraction:** `useBookings`, `useCustomers`, `useDrivers` etc. hooks are operational and use TanStack Query.

3. **Focus on mutations:** Remaining direct calls are mostly INSERT operations. Need mutation hooks, not query hooks.

4. **Breaking Changes:** Mission III prevents documentation drift. AI validates every change against dependency graph.

5. **No Code Freeze:** All missions run in parallel. System stays operational.

---

**Next Action:** Start Mission I Phase 1.1 - Create first 5 UI atoms.
