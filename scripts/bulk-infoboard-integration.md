# Bulk InfoBoard Integration Script Plan

## Purpose

Automatisierte Integration von DashboardInfoBoard in alle 46 Dashboard-Pages

## Affected Files (46 Pages)

### P0 - HAUPTBEREICH (2):

- ✅ `src/pages/Index.tsx` (DONE)
- `src/pages/Auftraege.tsx`

### P1 - VERWALTUNG (7):

- ✅ `src/pages/Kunden.tsx` (DONE)
- `src/pages/Fahrer.tsx`
- `src/pages/Schichtzettel.tsx`
- `src/pages/Finanzen.tsx`
- `src/pages/Kostenstellen.tsx`
- `src/pages/Dokumente.tsx`
- `src/pages/Kommunikation.tsx`
- `src/pages/Einstellungen.tsx`

### P2 - GESCHÄFT (3):

- `src/pages/Partner.tsx`
- `src/pages/Statistiken.tsx`
- `src/pages/LandingpageKonfigurator.tsx`

### P3 - WEITERE (34):

(List all remaining dashboard pages here)

## Integration Template

```tsx
// 1. Add imports at top
import { DashboardInfoBoard } from '@/components/dashboard/DashboardInfoBoard';
import { useMainLayout } from '@/hooks/use-main-layout';
import { generateKPIsForArea, generateChartDataForArea, DASHBOARD_INFO_CONFIGS } from '@/config/dashboard-info-configs';
import { useMemo } from 'react';

// 2. Inside component, add hooks
const { sidebarExpanded } = useMainLayout();
const config = DASHBOARD_INFO_CONFIGS['area-name']; // Replace area-name

// 3. Add memoized data generators
const infoBoardKPIs = useMemo(() =>
  generateKPIsForArea('area-name', data || []),
  [data]
);

const chartData = useMemo(() =>
  generateChartDataForArea('area-name', data || []),
  [data]
);

// 4. Before return statement, add InfoBoard
<DashboardInfoBoard
  area="area-name"
  sidebarExpanded={sidebarExpanded}
  kpis={infoBoardKPIs}
  quickActions={config.quickActions}
  chartData={chartData}
  currentData={data || []}
/>

// 5. Update main element styling
<main
  className="transition-[margin] duration-300"
  style={{
    marginLeft: sidebarExpanded ? '880px' : '704px'
  }}
>
```

## Area Mapping

| Page                        | Area Name                  | Data Source       |
| --------------------------- | -------------------------- | ----------------- |
| Index.tsx                   | 'dashboard'                | bookings          |
| Auftraege.tsx               | 'auftraege'                | bookings          |
| Kunden.tsx                  | 'kunden'                   | customers         |
| Fahrer.tsx                  | 'fahrer'                   | drivers           |
| Schichtzettel.tsx           | 'schichten'                | shifts            |
| Finanzen.tsx                | 'finanzen'                 | invoices          |
| Kostenstellen.tsx           | 'kostenstellen'            | costCenters       |
| Dokumente.tsx               | 'dokumente'                | documents         |
| Kommunikation.tsx           | 'kommunikation'            | messages          |
| Einstellungen.tsx           | 'einstellungen'            | settings          |
| Partner.tsx                 | 'partner'                  | partners          |
| Statistiken.tsx             | 'statistiken'              | statistics        |
| LandingpageKonfigurator.tsx | 'landingpage_konfigurator' | landingPageConfig |

## Validation Checklist

Per page, check:

- [ ] Imports added correctly
- [ ] useMainLayout hook called
- [ ] Area-config exists in dashboard-info-configs.ts
- [ ] KPIs generated with correct data
- [ ] Chart data generated correctly
- [ ] InfoBoard rendered before main content
- [ ] Main content margin adjusted (880px/704px)
- [ ] No TypeScript errors
- [ ] No layout shifts visible
- [ ] Export buttons functional
- [ ] Mobile view not affected

## Execution Order

1. **Manual Integration (Priority Pages):**
   - Auftraege.tsx
   - Fahrer.tsx
   - Schichtzettel.tsx
2. **Semi-Automated (Medium Priority):**
   - Finanzen.tsx through Statistiken.tsx
   - Use script to generate code, manual review

3. **Fully Automated (Low Priority):**
   - Remaining 34 pages
   - Script applies template, runs validation

## Script Location

Create: `scripts/integrate-infoboard-bulk.js`

## Testing Strategy

After each batch:

1. Run TypeScript: `npx tsc --noEmit`
2. Run ESLint: `npm run lint`
3. Build: `npm run build`
4. Visual check: Navigate to each page
5. Test export buttons
6. Check responsive behavior

## Rollback Plan

- Git branch per batch: `feature/infoboard-batch-{n}`
- Commit after each successful page
- Tag working states: `infoboard-{n}-pages-complete`
- Revert script: `git revert {commit}`
