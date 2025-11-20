# DASHBOARD STANDARDS V28.1

## Overview
This document defines the mandatory standards for all dashboard pages to ensure consistency and optimal user experience across the MyDispatch platform.

## Dashboard Sidebar System

Every Dashboard page uses a consistent 2-sidebar layout:
- **Left:** AppSidebar (240px expanded, 64px collapsed)
- **Right:** DashboardSidebar (320px fixed, area-specific navigation)
- **Center:** Content Area (marginLeft: 560px/384px)

### Layout Structure
```typescript
import { useMainLayout } from '@/hooks/use-main-layout';

export default function DashboardPage() {
  const { sidebarExpanded } = useMainLayout();

  return (
    <>
      <AppSidebar />
      <DashboardSidebar />
      <main 
        style={{ 
          marginLeft: sidebarExpanded ? '560px' : '384px',
          transitionDuration: '300ms' 
        }}
      >
        {/* Content */}
      </main>
    </>
  );
}
```

### Layout Calculations
- **Sidebar Expanded:** 240px (AppSidebar) + 320px (DashboardSidebar) = **560px**
- **Sidebar Collapsed:** 64px (AppSidebar) + 320px (DashboardSidebar) = **384px**

### Required Sections (Dashboard Pages)

1. **Data Display** (Tables, Cards, Lists)
   - Area-specific data visualization
   - Responsive tables with mobile optimization
   - Touch-friendly buttons (≥44px)

2. **Export Functionality** (PDF, Excel, CSV)
   - UniversalDownload components
   - Consistent button styling
   - Full-width layout

3. **Mobile Navigation**
   - Hamburger menu toggle
   - Bottom navigation bar
   - Touch-optimized controls

## Export Button Standards

### Positioning
- **Location:** Within page content (not in separate InfoBoard)
- **Background:** Integrated with page design
- **Layout:** Horizontal button group or vertical stack

### Button Configuration
```tsx
<UniversalDownload
  type="pdf|xlsx|csv"
  data={currentData}
  filename={`${area}-${date}`}
  buttonLabel="PDF|Excel|CSV"
  variant="outline"
  size="sm"
  className="justify-start"
/>
```

### Consistent Spacing
- Gap between buttons: `gap-2` or `gap-4`
- Responsive layout: Stack on mobile, horizontal on desktop

## Responsive Behavior

### Desktop (≥1024px)
- Both sidebars visible
- Full content width available
- Smooth transitions

### Tablet (768px - 1023px)
- Sidebars may collapse
- Content adjusts accordingly

### Mobile (<768px)
- Sidebars hidden by default
- Hamburger menu toggle
- Bottom navigation bar

## Layout Shifts Prevention

### Main Content Margin
The main content area MUST adjust its margin based on sidebar state:

```tsx
<main 
  className="transition-[margin] duration-300"
  style={{
    marginLeft: sidebarExpanded ? '560px' : '384px',
    // AppSidebar + DashboardSidebar (NO InfoBoard!)
  }}
>
  {children}
</main>
```

### Transition Smoothness
- Duration: 300ms
- Timing function: `cubic-bezier(0.4, 0, 0.2, 1)`
- All elements transition simultaneously

## Design System Compliance

### Colors (V28.1 Slate System)
- Background: `bg-white`
- Borders: `border-slate-200`
- Text primary: `text-slate-900`
- Text secondary: `text-slate-600`
- Hover backgrounds: `hover:bg-slate-100`
- Section backgrounds: `bg-slate-50`

### Typography
- Section titles: `text-sm font-semibold text-slate-900`
- KPI labels: `text-xs text-slate-600`
- KPI values: `text-sm font-bold text-slate-900`
- Export heading: `text-xs font-semibold text-slate-600 uppercase tracking-wider`

### Spacing
- Section padding: `p-4`
- Inter-section borders: `border-b border-slate-200`
- KPI gap: `space-y-2`
- Action buttons gap: `space-y-2`
- Export buttons gap: `gap-2`

### Shadows & Effects
- InfoBoard shadow: `shadow-lg`
- Card hover: `hover:bg-slate-100 transition-colors`
- Smooth transitions: `transition-all duration-300`

## Testing Requirements

### Visual Regression
- All dashboard pages MUST pass visual regression tests
- Sidebar positioning consistency verified
- Export buttons visibility verified
- Responsive behavior tested at all breakpoints

### Functional Testing
- Export functionality verified for PDF, Excel, CSV
- Data accuracy verified
- Responsive layout verified
- Navigation functionality verified

### Accessibility
- All interactive elements keyboard accessible
- Proper ARIA labels on all buttons
- Color contrast ≥4.5:1
- Focus indicators visible

## Common Pitfalls to Avoid

❌ **Don't:**
- Hardcode sidebar positioning
- Use different export button styling per dashboard
- Use custom colors outside V28.1 system
- Forget to pass `sidebarExpanded` prop
- Skip responsive testing

✅ **Do:**
- Use configuration-based approach
- Maintain consistent export button positioning
- Use V28.1 design tokens exclusively
- Test on all viewport sizes
- Follow 2-sidebar layout pattern

## Version History

- **V32.0** (2025-01-31): 2-Sidebar Layout Final (DashboardInfoBoard deprecated)
- **V28.1** (2025-10-29): Initial dashboard standardization

## Related Documentation

- `docs/EXPORT_FUNCTIONALITY.md` - Export system details
- `docs/LAYOUT_PATTERN_GUIDE.md` - Layout component usage
- `docs/PROJECT_MEMORY.md` - System state and changes
